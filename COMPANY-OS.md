# Company OS — Multi-Agent System

Company OS turns your OpenClaw instance into a team of specialized AI agents that coordinate work together. Instead of one general-purpose assistant, you get a team with distinct roles that can hand off tasks to each other.

## The 5 Default Agents

| Agent | Role | What They Do |
|-------|------|-------------|
| **Coordinator** | Project Manager | Routes incoming work, sets priorities, delegates to the right agent, tracks progress |
| **Builder** | Technical Lead | Writes code, builds features, deploys services, handles technical implementation |
| **Reviewer** | Quality Assurance | Reviews code and work output, catches bugs and issues, ensures quality standards |
| **Researcher** | Analyst | Investigates topics, gathers data, runs competitive analysis, prepares reports |
| **Outreach** | Communications | Drafts emails, manages social media, handles external communications |

The **Coordinator** is the default agent — it receives incoming messages and decides whether to handle them directly or delegate to a specialist.

## How Agent Handoff Works

Agents can spawn sub-agents to handle tasks in parallel:

1. A message comes in → **Coordinator** receives it
2. Coordinator evaluates: "This needs code written and a blog post about it"
3. Coordinator spawns **Builder** (write the code) and **Outreach** (draft the post) as sub-agents
4. Both work in parallel, up to `maxConcurrent: 4` sub-agents at once
5. Results flow back to Coordinator, who reports to you

Any agent can spawn any other agent as a sub-agent (configured via `allowAgents: ["*"]`). This means Builder can ask Researcher to look something up, Reviewer can ask Builder to fix an issue, etc.

## Configuration

The multi-agent config lives in `config/openclaw-template.json`. Key settings:

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4-5" },
      "subagents": { "maxConcurrent": 4 }
    },
    "list": [
      { "id": "coordinator", "name": "Coordinator", "default": true },
      { "id": "builder", "name": "Builder" },
      { "id": "reviewer", "name": "Reviewer" },
      { "id": "researcher", "name": "Researcher" },
      { "id": "outreach", "name": "Outreach" }
    ]
  },
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": ["coordinator", "builder", "reviewer", "researcher", "outreach"]
    }
  }
}
```

## Customizing Agents

### Change Agent Names and Roles

Edit `config/openclaw-template.json` to rename agents or change their roles:

```json
{ "id": "designer", "name": "Designer" }
```

### Add More Agents

Add entries to the `list` array and `tools.agentToAgent.allow`:

```json
{ "id": "security", "name": "Security Analyst", "subagents": { "allowAgents": ["*"] } }
```

### Change the Default Agent

Set `"default": true` on whichever agent should receive incoming messages:

```json
{ "id": "builder", "name": "Builder", "default": true }
```

### Per-Agent Models

Override the default model for specific agents:

```json
{
  "id": "researcher",
  "name": "Researcher",
  "model": { "primary": "anthropic/claude-opus-4-6" }
}
```

## Workspace Files

| File | Purpose |
|------|---------|
| `workspace/AGENTS.md` | Agent behavior guidelines — how agents should operate, manage memory, communicate |
| `workspace/SOUL.md` | Personality and principles — the team's working style and values |
| `workspace/TOOLS.md` | Local tool notes — your specific API keys, service configs, etc. |
| `workspace/memory/` | Agent memory — daily logs and context that persist across sessions |

## Pixel Office

The **Pixel Office** (`workspace/pixel-office/`) is a visual dashboard showing your agents as pixel-art characters in a top-down office. Each agent has their own room and their status is shown in real-time.

### Viewing the Office

Open `workspace/pixel-office/index.html` in a browser, or serve it:

```bash
cd workspace/pixel-office
python3 -m http.server 8080
# Visit http://localhost:8080
```

### Agent States

| State | Visual |
|-------|--------|
| `working` | Agent typing at their desk with task label |
| `idle` | Agent wandering (desk → coffee → couch) |
| `researching` | Agent reading at desk with blue label |
| `blocked` | Red `!` bubble — agent is stuck |
| `waiting_approval` | Amber `?` bubble — needs human input |

### Updating Agent Status

```bash
./workspace/pixel-office/update-state.sh coordinator working "Reviewing incoming tasks"
./workspace/pixel-office/update-state.sh builder working "Building auth system"
./workspace/pixel-office/update-state.sh researcher idle
```

Click on any agent character in the office to see their name, role, current status, and activity log.

## Getting Started

1. Deploy the template to Railway (follow the main README)
2. Complete the setup wizard at `/setup`
3. The Coordinator agent will handle incoming messages by default
4. Send a complex task — watch it get delegated to the right agents
5. Open the Pixel Office to see your team in action
