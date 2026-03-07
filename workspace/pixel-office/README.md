# Pixel Office v1 — Company OS Visualization

A pixel-art office dashboard showing 5 AI agents (Printy, Forge, Sentinel, Vanta, Cipher) as animated characters in a top-down office. Built with vanilla JS + HTML5 Canvas 2D, zero dependencies.

## Quick Start

```bash
# Option 1: Just open the file
open index.html
# or
xdg-open index.html

# Option 2: Serve locally (any static server)
python3 -m http.server 8080
# then visit http://localhost:8080

# Option 3: npx
npx serve .
```

## Features (v1 Prototype)

- **30×20 tile grid** (16×16 px tiles) with 7 distinct rooms
- **5 agents** with unique colors, rendered as pixel characters
- **FSM states**: idle → walk → active (working/researching/blocked)
- **BFS pathfinding** for natural movement between rooms
- **Click interaction**: click agents to see name, role, status, task, activity log
- **Bottom toolbar** with agent buttons and status dots
- **Demo mode**: agents automatically cycle through working/idle/blocked/researching states
- **Toast notifications** on state changes
- **Status bubbles**: `?` (waiting), `!` (blocked), `✔` (complete)
- **Auto-zoom** to fit viewport at pixel-perfect integer zoom

## Architecture

Single `index.html` file containing:

| Module | Description |
|--------|-------------|
| Tile Map | 30×20 grid with wall/floor/door/furniture tiles |
| BFS Pathfinding | 4-connected grid search, returns tile path |
| Agent FSM | idle ↔ walking ↔ active state machine per agent |
| Renderer | Canvas 2D: floor → furniture → agents (Y-sorted) → bubbles → labels |
| Demo Engine | Timed random state changes cycling through realistic tasks |
| UI | DOM overlays for status panel, toolbar, toast notifications |

## Rooms

| Room | Occupant | Location |
|------|----------|----------|
| Command Desk | Printy (COO) | Top-left |
| Engineering Bay | Forge (Tech Lead) | Top-center-left |
| Security Room | Sentinel (Security) | Top-center-right |
| Research Library | Cipher (Research) | Top-right |
| Sales Bullpen | Vanta (Sales) | Bottom-left |
| Break Room | Shared | Bottom-center |
| Server Room | — | Bottom-right |

## Agent States

| State | Visual | Movement |
|-------|--------|----------|
| `working` | Typing at desk, task label shown | Walks to own desk |
| `idle` | Wanders (desk → coffee → couch → corridor) | Random BFS wander |
| `researching` | Reading at desk, blue label | Walks to own desk |
| `blocked` | Red `!` bubble | Freezes in place |
| `waiting_approval` | Amber `?` bubble | Walks to desk, waits |

## Next Steps (Phase 2)

- [ ] OpenClaw Gateway WebSocket integration (`ws://127.0.0.1:18789`)
- [ ] Real sprite sheets (LimeZu / custom pixel art)
- [ ] Camera pan/zoom controls
- [ ] Sound notifications (Web Audio API)
- [ ] Sitting animation offset (6px down at desk)
- [ ] Minimap

## Tech

- Vanilla JavaScript (ES2020+)
- HTML5 Canvas 2D
- Zero external dependencies
- Single file, ~35KB
