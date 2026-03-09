// ═══ AGENT ENTITY — state, pathfinding, movement ═══

import { TILE, COLS, ROWS, MOVE_SPEED, NPC_IDS, AGENT_TO_CHAR, CHAR_ACTIVITIES, type Activity, type AgentDef } from './config';

// ─── PATHFINDING ───
export function bfs(
  walkable: boolean[][],
  sx: number, sy: number, ex: number, ey: number
): { x: number; y: number }[] | null {
  if (sx === ex && sy === ey) return [];
  if (!walkable[ey]?.[ex]) return null;
  
  const R = walkable.length, C = walkable[0]?.length || COLS;
  const v = Array.from({ length: R }, () => new Uint8Array(C));
  const p: ([number, number] | null)[][] = Array.from({ length: R }, () => new Array(C).fill(null));
  const q: [number, number][] = [[sx, sy]];
  v[sy][sx] = 1;
  const dirs: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  
  while (q.length > 0) {
    const [cx, cy] = q.shift()!;
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || nx >= C || ny < 0 || ny >= R || v[ny][nx] || !walkable[ny][nx]) continue;
      v[ny][nx] = 1;
      p[ny][nx] = [cx, cy];
      if (nx === ex && ny === ey) {
        const path: { x: number; y: number }[] = [];
        let px2 = ex, py2 = ey;
        while (px2 !== sx || py2 !== sy) {
          path.unshift({ x: px2, y: py2 });
          const pp = p[py2][px2]!;
          px2 = pp[0]; py2 = pp[1];
        }
        return path;
      }
      q.push([nx, ny]);
    }
  }
  return null;
}

export class Agent {
  id: string; name: string; role: string; gender: 'male' | 'female';
  color: string; accent: string; skinTone: string; hair: string;
  hairStyle: string; room: string; theme: string;
  accessory: string; idleAnim: string; eyeColor: string;
  blush: string; outfit: string;
  deskPos: { x: number; y: number };
  
  x: number; y: number; px: number; py: number;
  fsmState: 'active' | 'walking' | 'idle' = 'active';
  agentState = 'working';
  task = 'Setting sail...';
  realTask: string | null = null;
  stateStart = Date.now();
  log: string[] = [];
  path: { x: number; y: number }[] = [];
  moveT = 0;
  dir: 'up' | 'down' | 'left' | 'right' = 'down';
  af = 0; at = 0; wf = 0; wt = 0;
  wandT = 0; wandD = 3000 + Math.random() * 5000;
  hBob = 0; hBobT = 0;
  blinkT = 2000 + Math.random() * 4000;
  isBlinking = false; blinkD = 0;
  breathP = Math.random() * Math.PI * 2;
  collabTarget: Agent | null = null;
  isSitting = false;
  uaf = 0; uat = 0;
  currentActivity: Activity | null = null;
  activityTimer = 0;
  activityDuration = 30000 + Math.random() * 30000;
  isNPC: boolean;
  charKey: string;
  activityFrame = 0;
  activityAnimTimer = 0;

  private walkableRef: boolean[][] = [];

  constructor(d: AgentDef, private allAgents: () => Agent[]) {
    this.id = d.id; this.name = d.name; this.role = d.role; this.gender = d.gender;
    this.color = d.color; this.accent = d.accent; this.skinTone = d.skinTone;
    this.hair = d.hair; this.hairStyle = d.hairStyle; this.room = d.room;
    this.theme = d.theme; this.accessory = d.accessory; this.idleAnim = d.idleAnim;
    this.eyeColor = d.eyeColor; this.blush = d.blush; this.outfit = d.outfit;
    this.deskPos = { ...d.deskPos };
    this.x = d.deskPos.x; this.y = d.deskPos.y;
    this.px = d.deskPos.x * TILE; this.py = d.deskPos.y * TILE;
    this.isNPC = NPC_IDS.has(d.id);
    this.charKey = AGENT_TO_CHAR[d.id] || d.id;
    this.pickActivity('idle');
  }

  setWalkable(w: boolean[][]) { this.walkableRef = w; }

  pickActivity(mode: 'idle' | 'working') {
    const charActs = CHAR_ACTIVITIES[this.charKey];
    if (!charActs) return;
    const pool = charActs[mode] || charActs.idle;
    if (!pool || pool.length === 0) return;
    let act = pool[Math.floor(Math.random() * pool.length)];
    if (this.currentActivity && this.currentActivity.name === act.name && pool.length > 1) {
      const others = pool.filter(a => a.name !== act.name);
      act = others[Math.floor(Math.random() * others.length)];
    }
    this.currentActivity = act;
    this.activityFrame = 0; this.activityAnimTimer = 0;
    if (act.roamTo && this.id === 'luffy' && this.walkableRef[act.roamTo.y]?.[act.roamTo.x]) {
      this.walkTo(act.roamTo.x, act.roamTo.y);
      this.room = this.roomForPos(act.roamTo);
    }
  }

  private roomForPos(p: { x: number; y: number }): string {
    if (p.y <= 6) return 'Figurehead'; if (p.y <= 10) return 'Helm';
    if (p.y <= 14) return 'Navigation Room'; if (p.y <= 18) return 'Fore Deck';
    if (p.y <= 30) return 'Grass Deck'; if (p.y <= 34) return 'Mid Deck';
    if (p.y <= 40) return 'Lower Deck'; if (p.y <= 43) return 'Galley';
    return 'Stern';
  }

  setState(ns: string, task: string) {
    if (this.agentState === ns && this.task === task) return;
    this.agentState = ns; this.stateStart = Date.now();
    if (task) this.task = task;
    this.log.unshift(`${ns}: ${task || ''}`);
    if (this.log.length > 5) this.log.pop();
    this.collabTarget = null; this.isSitting = false;

    if (ns === 'working' || ns === 'researching') this.pickActivity('working');
    else this.pickActivity('idle');
    this.activityTimer = 0; this.activityDuration = 30000 + Math.random() * 30000;

    let target: { x: number; y: number } | null = null;
    switch (ns) {
      case 'working': case 'waiting_approval': case 'researching':
        target = this.deskPos; break;
      case 'relaxing': {
        // Find walkable spots away from desk for relaxing
        const spots: { x: number; y: number }[] = [];
        const R = this.walkableRef.length, C = this.walkableRef[0]?.length || 30;
        for (let y = 0; y < R; y += 3) for (let x = 0; x < C; x += 3) {
          if (this.walkableRef[y]?.[x] && (Math.abs(x - this.deskPos.x) > 4 || Math.abs(y - this.deskPos.y) > 4)) {
            spots.push({ x, y });
          }
        }
        if (spots.length > 0) {
          const sp = spots[Math.floor(Math.random() * spots.length)];
          this.walkTo(sp.x, sp.y);
        }
        return;
      }
      case 'collaborating': {
        const agents = this.allAgents();
        const oth = agents.filter(a => a.id !== this.id && a.agentState !== 'offline');
        if (oth.length > 0) {
          const p = oth[Math.floor(Math.random() * oth.length)];
          this.collabTarget = p;
          const ty = p.deskPos.y + 1;
          if (this.walkableRef[ty]?.[p.deskPos.x]) this.walkTo(p.deskPos.x, ty);
          else this.walkTo(p.deskPos.x, p.deskPos.y);
        }
        return;
      }
      case 'blocked': this.fsmState = 'active'; return;
      case 'idle':
        this.fsmState = 'idle'; this.wandT = 0; this.wandD = 2000 + Math.random() * 3000;
        if (this.id === 'luffy') {
          this.activityTimer = 0; this.activityDuration = 15000 + Math.random() * 20000;
          this.pickActivity('idle');
          if (this.currentActivity) this.task = this.currentActivity.desc;
        }
        return;
      case 'offline': this.fsmState = 'idle'; return;
    }
    if (target) this.walkTo(target.x, target.y);
  }

  walkTo(tx: number, ty: number) {
    const p = bfs(this.walkableRef, this.x, this.y, tx, ty);
    if (p && p.length > 0) { this.path = p; this.fsmState = 'walking'; this.moveT = 0; }
    else if (this.x === tx && this.y === ty) this.fsmState = 'active';
  }

  update(dt: number) {
    this.at += dt; if (this.at > 300) { this.at = 0; this.af = (this.af + 1) % 4; }
    this.uat += dt; if (this.uat > 500) { this.uat = 0; this.uaf = (this.uaf + 1) % 6; }
    this.activityAnimTimer += dt; if (this.activityAnimTimer > 400) { this.activityAnimTimer = 0; this.activityFrame = (this.activityFrame + 1) % 8; }

    // Luffy roams
    if (this.id === 'luffy' && this.agentState !== 'working' && this.agentState !== 'researching') {
      this.activityTimer += dt;
      if (this.activityTimer >= this.activityDuration) {
        this.activityTimer = 0; this.activityDuration = 15000 + Math.random() * 25000;
        this.pickActivity('idle');
        if (this.currentActivity) this.task = this.currentActivity.desc;
      }
    }

    // NPC activity cycling
    if (this.isNPC) {
      this.activityTimer += dt;
      if (this.activityTimer >= this.activityDuration) {
        this.activityTimer = 0; this.activityDuration = 30000 + Math.random() * 30000;
        const mode = (this.agentState === 'working' || this.agentState === 'researching') ? 'working' : 'idle';
        this.pickActivity(mode as 'working' | 'idle');
        if (this.currentActivity) this.task = this.currentActivity.desc;
      }
    }

    // Working head bob
    if (this.fsmState === 'active' && (this.agentState === 'working' || this.agentState === 'researching')) {
      this.hBobT += dt; this.hBob = Math.sin(this.hBobT * 0.004) * 0.5;
    } else this.hBob = 0;

    // Blinking
    this.blinkT -= dt;
    if (this.blinkT <= 0 && !this.isBlinking) { this.isBlinking = true; this.blinkD = 100 + Math.random() * 80; }
    if (this.isBlinking) { this.blinkD -= dt; if (this.blinkD <= 0) { this.isBlinking = false; this.blinkT = 2000 + Math.random() * 5000; } }
    this.breathP += dt * 0.003;

    // Movement
    if (this.fsmState === 'walking') {
      this.moveT += dt; this.wt += dt;
      if (this.wt > 120) { this.wt = 0; this.wf = (this.wf + 1) % 4; }
      if (this.moveT >= MOVE_SPEED) {
        this.moveT = 0;
        if (this.path.length > 0) {
          const n = this.path.shift()!;
          if (n.x > this.x) this.dir = 'right';
          else if (n.x < this.x) this.dir = 'left';
          else if (n.y > this.y) this.dir = 'down';
          else this.dir = 'up';
          this.x = n.x; this.y = n.y;
        }
        if (this.path.length === 0) {
          this.fsmState = (this.agentState === 'idle' || this.agentState === 'offline') ? 'idle' : 'active';
          if (this.fsmState === 'idle') { this.wandT = 0; this.wandD = 2000 + Math.random() * 4000; }
        }
      }
    } else if (this.fsmState === 'idle') {
      if (this.id !== 'luffy') {
        this.wandT += dt;
        if (this.wandT >= this.wandD) {
          this.wandT = 0; this.wandD = 3000 + Math.random() * 5000;
          const dests = [
            this.deskPos, { x: 15, y: 8 }, { x: 15, y: 42 },
            { x: 12 + Math.floor(Math.random() * 7), y: 20 + Math.floor(Math.random() * 10) },
            { x: 15, y: 24 }, { x: 10, y: 46 }, { x: 20, y: 46 },
          ];
          const wts = [30, 8, 10, 25, 12, 8, 7];
          let tot = wts.reduce((a, b) => a + b, 0);
          let r = Math.random() * tot, idx = 0;
          for (let i = 0; i < wts.length; i++) { r -= wts[i]; if (r <= 0) { idx = i; break; } }
          const dest = dests[idx];
          if (this.walkableRef[dest.y]?.[dest.x]) this.walkTo(dest.x, dest.y);
        }
      }
    }

    // Smooth pixel position
    const tx = this.x * TILE, ty = this.y * TILE;
    this.px += (tx - this.px) * 0.2;
    this.py += (ty - this.py) * 0.2;
    if (Math.abs(this.px - tx) < 0.5) this.px = tx;
    if (Math.abs(this.py - ty) < 0.5) this.py = ty;
  }

  getStateTime(): string {
    const e = Date.now() - this.stateStart;
    const s = Math.floor(e / 1000); const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  }
}
