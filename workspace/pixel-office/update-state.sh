#!/usr/bin/env bash
# update-state.sh — Update pixel office state.json with real agent activity
# Usage:
#   ./update-state.sh <agent> <state> [task]
#   ./update-state.sh coordinator working "Coordinating project tasks"
#   ./update-state.sh builder idle
#   ./update-state.sh researcher researching "Market analysis"
#
# States: working, idle, researching, blocked, waiting_approval, offline
#
# To update multiple agents at once, call multiple times — the script
# does a read-modify-write on state.json preserving other agents.

set -euo pipefail

STATE_FILE="$(dirname "$0")/state.json"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <agent> <state> [task]"
  echo "  agent: coordinator|builder|reviewer|researcher|outreach"
  echo "  state: working|idle|researching|blocked|waiting_approval|offline"
  echo "  task:  optional task description"
  exit 1
fi

AGENT="$1"
STATE="$2"
TASK="${3:-null}"
NOW=$(date +%s)

# Validate agent
case "$AGENT" in
  coordinator|builder|reviewer|researcher|outreach) ;;
  *) echo "Unknown agent: $AGENT"; exit 1 ;;
esac

# Validate state
case "$STATE" in
  working|idle|researching|blocked|waiting_approval|offline) ;;
  *) echo "Unknown state: $STATE"; exit 1 ;;
esac

# Format task as JSON string or null
if [ "$TASK" = "null" ] || [ -z "$TASK" ]; then
  TASK_JSON="null"
else
  # Escape quotes in task
  TASK_ESCAPED=$(echo "$TASK" | sed 's/"/\\"/g')
  TASK_JSON="\"$TASK_ESCAPED\""
fi

# If state.json doesn't exist or is empty, create skeleton
if [ ! -s "$STATE_FILE" ]; then
  cat > "$STATE_FILE" <<EOF
{
  "agents": {
    "coordinator": { "state": "idle", "task": null, "updatedAt": 0 },
    "builder": { "state": "idle", "task": null, "updatedAt": 0 },
    "reviewer": { "state": "idle", "task": null, "updatedAt": 0 },
    "researcher": { "state": "idle", "task": null, "updatedAt": 0 },
    "outreach": { "state": "idle", "task": null, "updatedAt": 0 }
  },
  "lastUpdate": 0
}
EOF
fi

# Use node (available in this env) for safe JSON manipulation
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$STATE_FILE', 'utf8'));
if (!data.agents) data.agents = {};
data.agents['$AGENT'] = {
  state: '$STATE',
  task: $TASK_JSON,
  updatedAt: $NOW
};
data.lastUpdate = $NOW;
fs.writeFileSync('$STATE_FILE', JSON.stringify(data, null, 2) + '\n');
console.log('Updated $AGENT → $STATE' + ($TASK_JSON !== 'null' ? ' ($TASK)' : ''));
"
