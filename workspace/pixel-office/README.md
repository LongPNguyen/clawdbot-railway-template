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

Every theme implements the `Theme` interface from `src/themes/types.ts`. Here's the full process:

#### Step 1: Create your theme file

```typescript
// src/themes/cyberpunk-lab.ts
import type { Theme, FurnitureItem } from './types';
import type { Agent } from '../agent';
import { TILE, AGENT_DEFS, STATUS_COLORS } from '../config';

export class CyberpunkLabTheme implements Theme {
  id = 'cyberpunk-lab';
  name = 'Cyberpunk Lab';
  backgroundColor = '#0a0a1a';  // Dark neon background
  
  // Grid dimensions — landscape, portrait, or square. Your call.
  cols = 40;  // tiles wide
  rows = 25;  // tiles tall
  
  // These get populated in init()
  tileMap: number[][] = [];
  roomMap: (string | null)[][] = [];
  walkable: boolean[][] = [];
  furniture: FurnitureItem[] = [];

  init() {
    // Build your world grid
    // Tile types: 0=wall, 1=floor, 3=door, 4=furniture, 11=sky/empty, 20=exterior
    const C = this.cols!, R = this.rows!;
    for (let y = 0; y < R; y++) {
      this.tileMap[y] = []; this.roomMap[y] = []; this.walkable[y] = [];
      for (let x = 0; x < C; x++) {
        this.tileMap[y][x] = 11;      // default: empty/sky
        this.roomMap[y][x] = null;     // no room assignment
        this.walkable[y][x] = false;   // not walkable by default
      }
    }

    // Helper to fill rectangular areas
    const fill = (x1: number, y1: number, x2: number, y2: number, tile: number, zone?: string) => {
      for (let y = y1; y <= y2; y++)
        for (let x = x1; x <= x2; x++)
          if (y >= 0 && y < R && x >= 0 && x < C) {
            this.tileMap[y][x] = tile;
            if (zone) this.roomMap[y][x] = zone;
          }
    };

    // Example: build a room
    fill(5, 5, 35, 20, 1, 'main-lab');    // floor
    fill(5, 5, 35, 5, 0);                  // top wall
    fill(5, 20, 35, 20, 0);                // bottom wall
    fill(5, 5, 5, 20, 0);                  // left wall
    fill(35, 5, 35, 20, 0);                // right wall
    fill(19, 5, 21, 5, 3);                 // door in top wall

    // Add furniture
    this.furniture.push({ x: 10, y: 10, type: 'desk', color: '#4040ff' });

    // Build walkable grid (floor + doors are walkable)
    for (let y = 0; y < R; y++)
      for (let x = 0; x < C; x++)
        this.walkable[y][x] = (this.tileMap[y][x] === 1 || this.tileMap[y][x] === 3);
  }

  drawWorld(ctx: CanvasRenderingContext2D, time: number) {
    // Draw every tile
    for (let y = 0; y < this.rows!; y++)
      for (let x = 0; x < this.cols!; x++) {
        const t = this.tileMap[y][x];
        const px = x * TILE, py = y * TILE;
        if (t === 11) {
          ctx.fillStyle = this.backgroundColor;
        } else if (t === 0) {
          ctx.fillStyle = '#2a2a4a';  // walls
        } else if (t === 1) {
          ctx.fillStyle = (x + y) % 2 === 0 ? '#1a1a3a' : '#1e1e3e';  // floor checkerboard
        } else if (t === 3) {
          ctx.fillStyle = '#3a3a5a';  // doors
        }
        ctx.fillRect(px, py, TILE, TILE);
      }

    // Draw furniture
    for (const f of this.furniture) {
      ctx.fillStyle = f.color;
      ctx.fillRect(f.x * TILE + 2, f.y * TILE + 4, TILE - 4, TILE - 4);
    }
  }

  drawCharacter(ctx: CanvasRenderingContext2D, agent: Agent, time: number) {
    // Draw your character sprite at agent.px, agent.py
    // agent.px/py are pixel positions (tile * TILE)
    const x = agent.px, y = agent.py;
    
    // Simple example — colored circle with name
    const color = STATUS_COLORS[agent.agentState] || '#888';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // You can get much fancier — see one-piece.ts for full character drawing
  }

  drawEffects(ctx: CanvasRenderingContext2D, time: number) {
    // Optional: particles, weather, ambient animations
  }

  drawOverlay(ctx: CanvasRenderingContext2D, viewW: number, viewH: number, time: number) {
    // Optional: screen-space effects (day/night tinting, scanlines, etc.)
    // This draws AFTER camera restore, so coordinates are screen-space
  }
}
```

#### Step 2: Set agent positions for your theme

If your theme has a different layout, define where agents sit:

```typescript
// In your theme file, add position overrides
const MY_POSITIONS: Record<string, { deskPos: { x: number; y: number }; room: string }> = {
  'coordinator': { deskPos: { x: 10, y: 10 }, room: 'Command Center' },
  'builder':     { deskPos: { x: 20, y: 10 }, room: 'Build Lab' },
  'reviewer':    { deskPos: { x: 10, y: 15 }, room: 'Review Bay' },
  // ...
};

// Add this method to your theme class:
getAgentOverrides(id: string) {
  return MY_POSITIONS[id] || null;
}
```

#### Step 3: Register the theme

In `src/main.ts`, import and add your theme:

```typescript
import { CyberpunkLabTheme } from './themes/cyberpunk-lab';

const themes: Theme[] = [
  new OnePieceTheme(),
  new ModernOfficeTheme(),
  new CyberpunkLabTheme(),  // Your new theme!
];
```

#### Step 4: Build and test

```bash
npx vite build
# Refresh the page — your theme appears in the switcher
```

#### Theme Interface Reference

| Method | Required | Description |
|--------|----------|-------------|
| `init()` | ✅ | Build tile map, room map, walkable grid, furniture |
| `drawWorld()` | ✅ | Draw background, floors, walls, furniture |
| `drawCharacter()` | ✅ | Draw a single agent sprite |
| `drawEffects()` | ✅ | Draw particle effects, weather (can be empty) |
| `drawOverlay()` | ✅ | Screen-space effects like day/night (can be empty) |

| Property | Required | Description |
|----------|----------|-------------|
| `id` | ✅ | Unique string ID (used in localStorage) |
| `name` | ✅ | Display name in theme switcher |
| `backgroundColor` | ✅ | Canvas clear color |
| `cols` | Optional | Grid width in tiles (default: 30) |
| `rows` | Optional | Grid height in tiles (default: 50) |
| `tileMap` | ✅ | 2D array of tile types |
| `walkable` | ✅ | 2D boolean array for pathfinding |
| `roomMap` | ✅ | 2D array of room zone names |
| `furniture` | ✅ | Array of furniture items |

#### Tips

- **Start by copying `modern-office.ts`** and modifying it — much easier than starting from scratch
- **Landscape layouts** (wide `cols`, short `rows`) work better for desktop
- **The camera auto-fits** to your grid dimensions, so any size works
- **Use `time` parameter** in draw methods for animations (`Math.sin(time * speed)`)
- **Tile size is 16px** — each grid cell is 16×16 pixels on the native canvas

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
