#!/usr/bin/env bash
# update-state.sh — Pixel Office real-time state sync
# Reads OpenClaw agent session data and writes state.json
# Run via cron every 30 seconds (cron fires every minute, runs twice with sleep 30)
set -euo pipefail

STATE_DIR="/root/.openclaw/workspace/out/pixel-office-v1"
STATE_FILE="$STATE_DIR/state.json"
AGENTS_DIR="/root/.openclaw/agents"
AGENTS=("printy" "forge" "sentinel" "vanta" "cipher")
ACTIVE_THRESHOLD=300  # 5 minutes in seconds

NOW_S=$(date +%s)
NOW_MS=$((NOW_S * 1000))

# Build state JSON using python3 for reliable JSON handling
python3 << 'PYEOF'
import json, os, glob, re, sys, time

AGENTS_DIR = "/root/.openclaw/agents"
STATE_FILE = "/root/.openclaw/workspace/out/pixel-office-v1/state.json"
AGENTS = ["coordinator", "builder", "reviewer", "researcher", "outreach"]
ACTIVE_THRESHOLD_MS = 300000  # 5 minutes in ms

now_ms = int(time.time() * 1000)
now_s = int(time.time())

def extract_task_from_jsonl(filepath, max_bytes=200000):
    """Read last chunk of JSONL, find most recent user message, extract short task."""
    try:
        fsize = os.path.getsize(filepath)
        read_start = max(0, fsize - max_bytes)
        with open(filepath, 'r', errors='replace') as f:
            f.seek(read_start)
            if read_start > 0:
                f.readline()  # skip partial line
            lines = f.readlines()

        last_user_text = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue

            if entry.get('type') != 'message':
                continue
            msg = entry.get('message', {})
            if msg.get('role') != 'user':
                continue

            content = msg.get('content', '')
            text = ''
            if isinstance(content, str):
                text = content
            elif isinstance(content, list):
                for item in content:
                    if isinstance(item, dict) and item.get('type') == 'text':
                        text = item.get('text', '')
                        break

            if text:
                last_user_text = text

        if not last_user_text:
            return None

        # Clean up: remove system prefixes, telegram metadata
        text = last_user_text
        # Remove "[Telegram ... UTC] " prefix
        text = re.sub(r'^\[Telegram\s+.*?\]\s*', '', text)
        # Remove "System: [..." prefix
        text = re.sub(r'^System:\s*\[.*?\]\s*', '', text)
        # Remove exec notifications
        if text.startswith('System:') or text.startswith('Exec '):
            return None

        # Truncate to something readable
        text = text.strip()
        if len(text) > 80:
            text = text[:77] + '...'

        return text if text else None

    except Exception:
        return None


def get_label_for_session(agent, session_key, sessions_data):
    """Get the label from sessions.json if it exists."""
    session_info = sessions_data.get(session_key, {})
    return session_info.get('label', None)


result = {"agents": {}, "lastUpdate": now_s}

for agent in AGENTS:
    agent_state = {"state": "idle", "task": None, "updatedAt": now_s}
    sessions_file = os.path.join(AGENTS_DIR, agent, "sessions", "sessions.json")

    if not os.path.exists(sessions_file):
        result["agents"][agent] = agent_state
        continue

    try:
        with open(sessions_file, 'r') as f:
            sessions_data = json.load(f)
    except (json.JSONDecodeError, IOError):
        result["agents"][agent] = agent_state
        continue

    # Find ALL active sessions (including parallel subagents)
    active_sessions = []
    most_recent_key = None
    most_recent_updated = 0
    most_recent_sid = None

    for session_key, session_info in sessions_data.items():
        updated_at = session_info.get('updatedAt', 0)
        if updated_at > most_recent_updated:
            most_recent_updated = updated_at
            most_recent_key = session_key
            most_recent_sid = session_info.get('sessionId', '')
        
        # Track all active sessions
        if updated_at > 0 and (now_ms - updated_at) < ACTIVE_THRESHOLD_MS:
            label = session_info.get('label', '')
            sid = session_info.get('sessionId', '')
            is_subagent = 'subagent:' in session_key
            active_sessions.append({
                'key': session_key,
                'label': label,
                'sid': sid,
                'updatedAt': updated_at,
                'isSubagent': is_subagent
            })

    # Check if active (updated within threshold)
    if most_recent_updated > 0 and (now_ms - most_recent_updated) < ACTIVE_THRESHOLD_MS:
        agent_state["state"] = "working"

        # Collect all active task descriptions
        task_parts = []
        for sess in active_sessions:
            if sess['label']:
                task_parts.append(sess['label'].replace('-', ' ').title())
            elif sess['isSubagent']:
                task_parts.append("Sub-task")
        
        if task_parts:
            # Show all active tasks
            agent_state["task"] = ' | '.join(task_parts[:3])  # max 3
            if len(active_sessions) > 1:
                agent_state["activeTasks"] = len(active_sessions)
        else:
            # Fall back to reading JSONL for main session task
            label = get_label_for_session(agent, most_recent_key, sessions_data)
            if label:
                agent_state["task"] = label.replace('-', ' ').title()
            elif most_recent_sid:
                jsonl_path = os.path.join(AGENTS_DIR, agent, "sessions", f"{most_recent_sid}.jsonl")
                if os.path.exists(jsonl_path):
                    task = extract_task_from_jsonl(jsonl_path)
                    if task:
                        agent_state["task"] = task
                    else:
                        if 'cron:' in (most_recent_key or ''):
                            agent_state["task"] = "Scheduled task"
                        else:
                            agent_state["task"] = "Active session"

    agent_state["updatedAt"] = now_s
    result["agents"][agent] = agent_state

# Write atomically (write to tmp then rename)
tmp_file = STATE_FILE + ".tmp"
with open(tmp_file, 'w') as f:
    json.dump(result, f, indent=2)
    f.write('\n')
os.rename(tmp_file, STATE_FILE)

# Print summary for logging
active = [a for a, s in result["agents"].items() if s["state"] == "working"]
print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] State updated. Active: {', '.join(active) if active else 'none'}")
PYEOF
