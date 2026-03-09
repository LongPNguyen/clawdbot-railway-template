# 🏴‍☠️ Pixel Office — Real-Time Agent Dashboard

A live, interactive pixel-art visualization of your OpenClaw multi-agent team. Watch your AI agents work in real time, switch between themes, and zoom in on individual characters.

**Live demo:** [agents.post2site.com](https://agents.post2site.com)

![Pixel Office Screenshot](https://agents.post2site.com/screenshot.png)

## Features

- 🎨 **Multiple Themes** — Thousand Sunny (One Piece) and Modern Office, with localStorage persistence
- 🔍 **Smooth Zoom** — Scroll wheel / trackpad pinch zooms toward cursor (Google Maps style)
- 👆 **Click-to-Focus** — Click an agent name to smoothly zoom to their character
- 📊 **Real-Time Status** — Agents show working/idle/researching states from live session data
- 🌙 **Day/Night Cycle** — Real-time lighting based on your timezone (configurable)
- 📱 **Mobile Responsive** — Touch pan, pinch zoom, responsive toolbar
- 🐟 **Ambient Life** — Fish jumping, clouds drifting, twinkling stars at night

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [OpenClaw](https://github.com/openclaw/openclaw) running with agents configured

### 1. Install & Build

```bash
cd pixel-office
npm install
npx vite build
```

### 2. Configure the State Updater

The pixel office reads `state.json` to know what each agent is doing. The included `update-state.sh` script reads your OpenClaw agent sessions and generates this file.

**Edit `update-state.sh`** and update the agents list to match your setup:

```bash
# In update-state.sh, update this line:
AGENTS = ["printy", "forge", "sentinel", "vanta", "cipher"]

# Change to your agent names:
AGENTS = ["coordinator", "builder", "reviewer", "researcher", "outreach"]
```

Also update the agents directory path if needed:

```bash
AGENTS_DIR = "/root/.openclaw/agents"  # Default OpenClaw agents location
# or wherever your agents live:
AGENTS_DIR = "/data/.openclaw/agents"  # Railway volume path
```

### 3. Set Up the Cron Job

Add a cron job to update `state.json` every minute (runs twice for ~30s refresh):

```bash
crontab -e
```

Add this line:

```
* * * * * /path/to/pixel-office/dist/update-state.sh && sleep 30 && /path/to/pixel-office/dist/update-state.sh
```

### 4. Serve It

**Option A: Simple static server (recommended)**

```bash
npx browser-sync start --server dist --port 4011 --no-open --no-ui --no-notify
```

**Option B: systemd service (production)**

Create `/etc/systemd/system/pixel-office.service`:

```ini
[Unit]
Description=Pixel Office Dashboard
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/pixel-office/dist
ExecStart=/usr/bin/npx browser-sync start --server --port 4011 --files "*.html,*.css,*.js,state.json" --no-open --no-ui --no-notify
Restart=always
RestartSec=5
Environment=PATH=/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now pixel-office
```

**Option C: Behind a reverse proxy / Cloudflare Tunnel**

```yaml
# cloudflared config.yml
ingress:
  - hostname: agents.yourdomain.com
    service: http://localhost:4011
```

### 5. Access It

Open `http://localhost:4011` (or your configured domain).

## Configuration

### Agent Names & Identities

Edit `src/config.ts` to customize agent names, roles, and character mappings:

```typescript
export const AGENT_DEFS: AgentDef[] = [
  { id: 'coordinator', name: 'Coordinator', role: 'CEO', deskPos: { x: 8, y: 7 }, room: 'Bridge' },
  { id: 'builder', name: 'Builder', role: 'Dev Lead', deskPos: { x: 17, y: 17 }, room: 'Workshop' },
  // ... add your agents
];
```

### Timezone

The day/night cycle and clock default to Central Time (America/Chicago). To change it, edit `src/effects.ts` and `src/main.ts`:

```typescript
// In effects.ts — change 'America/Chicago' to your timezone:
const ct = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));

// In main.ts — same:
const ct = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
```

### Creating Custom Themes

Add a new theme by creating a file in `src/themes/`:

```typescript
// src/themes/my-theme.ts
import type { Theme } from './types';

export class MyTheme implements Theme {
  id = 'my-theme';
  name = 'My Theme';
  backgroundColor = '#1a1a2e';
  cols = 40;  // Custom grid width
  rows = 25;  // Custom grid height
  // ... implement the Theme interface
}
```

Then register it in `src/main.ts`:

```typescript
import { MyTheme } from './themes/my-theme';
const themes: Theme[] = [new OnePieceTheme(), new ModernOfficeTheme(), new MyTheme()];
```

### state.json Format

The pixel office reads this file to display agent status:

```json
{
  "agents": {
    "your-agent-id": {
      "state": "working",
      "task": "Building the landing page",
      "updatedAt": 1773090361
    },
    "another-agent": {
      "state": "idle",
      "task": null,
      "updatedAt": 1773090361
    }
  },
  "lastUpdate": 1773090361
}
```

**Valid states:** `working`, `idle`, `collaborating`, `researching`, `blocked`, `waiting_approval`, `offline`, `relaxing`

## Project Structure

```
pixel-office/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html              — Entry HTML with styles
├── src/
│   ├── main.ts             — Game loop, canvas, input handling
│   ├── config.ts           — Agent definitions, colors, constants
│   ├── camera.ts           — Camera system (zoom, pan, animations)
│   ├── agent.ts            — Agent entity, pathfinding, state machine
│   ├── effects.ts          — Day/night cycle, ambient effects
│   ├── poller.ts           — state.json polling, live/demo mode
│   ├── ui.ts               — Toolbar, status panel, theme switcher
│   └── themes/
│       ├── types.ts        — Theme interface
│       ├── one-piece.ts    — Thousand Sunny theme
│       └── modern-office.ts — Professional office theme
├── public/
│   └── sprites/            — Character sprite sheets (if using)
├── update-state.sh         — Cron script to generate state.json
└── dist/                   — Built output (serve this)
```

## Tech Stack

- **TypeScript** + **Vite** — Fast builds, type safety
- **Canvas 2D** — No heavy framework, just raw drawing
- **BFS Pathfinding** — Agents navigate between rooms
- **State Machine** — Characters walk, idle, work based on real agent status

## Credits

Built by [Long Nguyen](https://leedecard.com/long) and [Printy Money Hands](https://github.com/LongPNguyen) 💸

Part of the [OpenClaw](https://github.com/openclaw/openclaw) ecosystem.

## License

MIT — use it, remix it, make it yours.
