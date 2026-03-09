// ═══ MODERN OFFICE THEME ═══

import type { Theme, FurnitureItem } from './types';
import type { Agent } from '../agent';
import { TILE, COLS, ROWS, STATUS_COLORS, AGENT_IDENTITY, AGENT_DEFS } from '../config';
import { amb, clouds, getDayPhase, px, shade } from '../effects';

// Office colors
const OC = {
  sky: '#6ab4e8', skyLight: '#88c8f0', skyDark: '#5098d0',
  wall: '#c8c8c8', wallDark: '#a8a8a8', wallLight: '#d8d8d8', wallAccent: '#b0b0b0',
  floor: '#e0d8c8', floorAlt: '#d8d0c0', floorDark: '#c8c0b0',
  carpet: '#485898', carpetAlt: '#405088',
  desk: '#c09858', deskDark: '#a08040', deskLight: '#d0a868',
  window: '#88c8e8', windowFrame: '#e0e0e0', windowGlare: 'rgba(255,255,255,0.3)',
  plant: '#48a848', plantPot: '#a07838',
  monitor: '#282838', monitorScreen: '#304090', monitorGlow: 'rgba(72,200,104,0.15)',
  chair: '#404040', chairSeat: '#505060',
  coffee: '#604020', coffeeBody: '#e0d0c0',
  whiteboard: '#f0f0f0', whiteboardFrame: '#a0a0a0',
  ceiling: '#f0f0f0', ceilingLight: '#f8f8f0',
};

// Room zones for the office
const OFFICE_ZONES: Record<string, { floor: string; floorAlt: string; accent: string }> = {
  lobby: { floor: '#d0c8b8', floorAlt: '#c8c0b0', accent: '#e8c060' },
  exec: { floor: '#c8b8a8', floorAlt: '#c0b0a0', accent: '#c8a040' },
  dev: { floor: '#c8d0d8', floorAlt: '#c0c8d0', accent: '#4888d0' },
  security: { floor: '#c8c0b8', floorAlt: '#c0b8b0', accent: '#48a848' },
  research: { floor: '#d0c8d8', floorAlt: '#c8c0d0', accent: '#7858b8' },
  kitchen: { floor: '#e0d8d0', floorAlt: '#d8d0c8', accent: '#e8a040' },
  conference: { floor: '#d0d0d8', floorAlt: '#c8c8d0', accent: '#5898d0' },
  server: { floor: '#b8c0c8', floorAlt: '#b0b8c0', accent: '#40a8d8' },
  sales: { floor: '#d8d0c0', floorAlt: '#d0c8b8', accent: '#e07060' },
  medical: { floor: '#d8d8d0', floorAlt: '#d0d0c8', accent: '#e87888' },
  lounge: { floor: '#d0c8c0', floorAlt: '#c8c0b8', accent: '#a890c8' },
  reception: { floor: '#d8d0c8', floorAlt: '#d0c8c0', accent: '#c8a040' },
};

// Agent position mapping to office rooms — LANDSCAPE layout (50 wide × 30 tall)
const OFFICE_POSITIONS: Record<string, { deskPos: { x: number; y: number }; room: string; zone: string }> = {
  luffy: { deskPos: { x: 8, y: 7 }, room: 'CEO Office', zone: 'exec' },
  printy: { deskPos: { x: 17, y: 7 }, room: 'Ops Center', zone: 'exec' },
  forge: { deskPos: { x: 8, y: 17 }, room: 'Dev Lab', zone: 'dev' },
  sentinel: { deskPos: { x: 42, y: 7 }, room: 'Security Hub', zone: 'security' },
  sanji: { deskPos: { x: 33, y: 17 }, room: 'Kitchen', zone: 'kitchen' },
  usopp: { deskPos: { x: 17, y: 17 }, room: 'Dev Lab', zone: 'dev' },
  cipher: { deskPos: { x: 42, y: 17 }, room: 'Research Lab', zone: 'research' },
  vanta: { deskPos: { x: 33, y: 7 }, room: 'Creative Studio', zone: 'sales' },
  brook: { deskPos: { x: 25, y: 22 }, room: 'Lounge', zone: 'lounge' },
  jinbe: { deskPos: { x: 25, y: 7 }, room: 'Conference Room', zone: 'conference' },
};

export class ModernOfficeTheme implements Theme {
  id = 'modern-office';
  name = 'Modern Office';
  backgroundColor = '#6ab4e8';
  cols = 50;
  rows = 30;
  tileMap: number[][] = [];
  roomMap: (string | null)[][] = [];
  walkable: boolean[][] = [];
  furniture: FurnitureItem[] = [];

  init() {
    const C = this.cols!, R = this.rows!;
    const tm = this.tileMap, rm = this.roomMap, wk = this.walkable;
    this.furniture = [];
    for (let y = 0; y < R; y++) {
      tm[y] = []; rm[y] = []; wk[y] = [];
      for (let x = 0; x < C; x++) { tm[y][x] = 11; rm[y][x] = null; wk[y][x] = false; }
    }

    const fT = (x1: number, y1: number, x2: number, y2: number, v: number, zone?: string) => {
      for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++)
        if (y >= 0 && y < R && x >= 0 && x < C) { tm[y][x] = v; if (zone) rm[y][x] = zone; }
    };

    // ═══ LANDSCAPE OFFICE: 50w × 30h ═══
    // Roof / facade
    fT(1, 1, 48, 1, 20);
    fT(0, 2, 49, 2, 20);

    // ─── UPPER FLOOR (rows 3-12): CEO | Ops | Conference | Creative | Security ───
    // Outer walls
    fT(0, 3, 0, 12, 0); fT(49, 3, 49, 12, 0);
    fT(1, 3, 48, 3, 0); // top wall
    fT(1, 12, 48, 12, 0); // bottom wall / hallway divider

    // CEO Office (cols 2-11)
    fT(2, 4, 11, 11, 1, 'exec');
    fT(11, 4, 11, 11, 0); fT(11, 8, 11, 9, 3); // right wall + door

    // Ops Center (cols 13-21)
    fT(13, 4, 21, 11, 1, 'exec');
    fT(12, 4, 12, 11, 0); fT(22, 4, 22, 11, 0);
    fT(12, 8, 12, 9, 3); fT(22, 8, 22, 9, 3); // doors

    // Conference Room (cols 23-28)
    fT(23, 4, 28, 11, 1, 'conference');
    fT(28, 4, 28, 11, 0); fT(28, 8, 28, 9, 3);

    // Creative Studio (cols 30-37)
    fT(30, 4, 37, 11, 1, 'sales');
    fT(29, 4, 29, 11, 0); fT(37, 4, 37, 11, 0);
    fT(29, 8, 29, 9, 3); fT(37, 8, 37, 9, 3);

    // Security Hub (cols 39-47)
    fT(39, 4, 47, 11, 1, 'security');
    fT(38, 4, 38, 11, 0); fT(38, 8, 38, 9, 3);

    // Central hallway (row 12 is wall, make row 13 the hallway)
    fT(1, 12, 48, 12, 0);
    fT(5, 12, 6, 12, 3); fT(16, 12, 17, 12, 3); fT(25, 12, 26, 12, 3);
    fT(33, 12, 34, 12, 3); fT(42, 12, 43, 12, 3);

    // ─── LOWER FLOOR (rows 13-25): Dev Lab | Lounge | Kitchen | Research Lab ───
    fT(0, 13, 0, 25, 0); fT(49, 13, 49, 25, 0);
    fT(1, 13, 48, 13, 1); // hallway

    // Dev Lab (cols 2-21)
    fT(2, 14, 21, 21, 1, 'dev');
    fT(1, 14, 1, 21, 0); fT(21, 14, 21, 21, 0);
    fT(21, 17, 21, 18, 3);

    // Lounge (cols 22-28)
    fT(22, 14, 28, 25, 1, 'lounge');
    fT(28, 14, 28, 25, 0); fT(28, 17, 28, 18, 3);

    // Kitchen (cols 29-37)
    fT(29, 14, 37, 21, 1, 'kitchen');
    fT(29, 14, 29, 21, 0); fT(37, 14, 37, 21, 0);
    fT(29, 17, 29, 18, 3); fT(37, 17, 37, 18, 3);

    // Research Lab (cols 38-47)
    fT(38, 14, 47, 21, 1, 'research');
    fT(38, 14, 38, 21, 0); fT(48, 14, 48, 21, 0);
    fT(38, 17, 38, 18, 3);

    // Server room (bottom strip cols 2-21, rows 22-25)
    fT(2, 22, 21, 25, 1, 'server');
    fT(1, 22, 1, 25, 0); fT(21, 22, 21, 25, 0);
    fT(21, 23, 21, 24, 3);

    // Medical (cols 29-37, rows 22-25)
    fT(29, 22, 37, 25, 1, 'medical');
    fT(29, 22, 29, 25, 0); fT(37, 22, 37, 25, 0);
    fT(29, 23, 29, 24, 3); fT(37, 23, 37, 24, 3);

    // Expanded research/lower (cols 38-47, rows 22-25)
    fT(38, 22, 47, 25, 1, 'research');
    fT(38, 22, 38, 25, 0); fT(48, 22, 48, 25, 0);
    fT(38, 23, 38, 24, 3);

    // Bottom wall + building base
    fT(1, 25, 48, 25, 0);
    fT(0, 26, 49, 27, 20);

    // ─── FURNITURE ───
    const FL = this.furniture;
    const pF = (x: number, y: number, type: string, c?: string) => {
      if (y >= 0 && y < R && x >= 0 && x < C) {
        tm[y][x] = 4; FL.push({ x, y, type, color: c || '#708090' });
      }
    };

    // CEO Office
    pF(4, 5, 'plant_office', OC.plant); pF(10, 5, 'plant_office', OC.plant);
    pF(7, 6, 'exec_desk', OC.desk); pF(9, 7, 'monitor', OC.monitor);
    pF(3, 10, 'couch', '#605040'); pF(4, 10, 'couch', '#605040');

    // Ops Center
    pF(14, 5, 'plant_office', OC.plant); pF(20, 5, 'plant_office', OC.plant);
    pF(16, 7, 'desk_monitor', OC.desk); pF(18, 7, 'monitor', OC.monitor);
    pF(15, 10, 'whiteboard', OC.whiteboard);

    // Conference Room
    pF(24, 6, 'conf_table', OC.desk); pF(25, 6, 'conf_table', OC.desk);
    pF(26, 6, 'conf_table', OC.desk); pF(27, 6, 'conf_table', OC.desk);
    pF(24, 9, 'chair_conf', OC.chair); pF(27, 9, 'chair_conf', OC.chair);
    pF(24, 5, 'whiteboard', OC.whiteboard);

    // Creative Studio (Vanta)
    pF(32, 7, 'desk_monitor', OC.desk); pF(34, 7, 'monitor', OC.monitor);
    pF(31, 5, 'plant_office', OC.plant); pF(36, 5, 'plant_office', OC.plant);
    pF(35, 10, 'whiteboard', OC.whiteboard);

    // Security Hub (Sentinel)
    pF(41, 7, 'desk_monitor', OC.desk); pF(43, 7, 'monitor', OC.monitor);
    pF(45, 7, 'desk_monitor', OC.desk);
    pF(40, 5, 'plant_office', OC.plant); pF(46, 5, 'plant_office', OC.plant);
    pF(44, 10, 'server_rack', '#404850');

    // Dev Lab
    pF(4, 16, 'desk_monitor', OC.desk); pF(5, 16, 'monitor', OC.monitor);
    pF(8, 16, 'desk_monitor', OC.desk); pF(9, 17, 'monitor', OC.monitor);
    pF(14, 16, 'desk_monitor', OC.desk); pF(15, 16, 'monitor', OC.monitor);
    pF(17, 16, 'desk_monitor', OC.desk); pF(18, 17, 'monitor', OC.monitor);
    pF(10, 20, 'coffee_machine', OC.coffee);
    pF(3, 15, 'plant_office', OC.plant); pF(20, 15, 'plant_office', OC.plant);

    // Lounge
    pF(23, 16, 'couch', '#605040'); pF(24, 16, 'couch', '#605040');
    pF(26, 16, 'water_cooler', '#88c8d8');
    pF(23, 20, 'coffee_table', OC.desk); pF(25, 22, 'plant_office', OC.plant);
    pF(27, 22, 'plant_office', OC.plant);

    // Kitchen
    pF(31, 15, 'stove_office', '#505860'); pF(33, 15, 'fridge', '#e0e0e0');
    pF(32, 17, 'table_kitchen', OC.desk); pF(34, 17, 'table_kitchen', OC.desk);
    pF(36, 20, 'coffee_machine', OC.coffee);

    // Research Lab
    pF(40, 16, 'desk_monitor', OC.desk); pF(41, 16, 'monitor', OC.monitor);
    pF(43, 17, 'desk_monitor', OC.desk); pF(44, 17, 'monitor', OC.monitor);
    pF(39, 15, 'plant_office', OC.plant); pF(46, 15, 'plant_office', OC.plant);
    pF(45, 20, 'whiteboard', OC.whiteboard);

    // Server room
    pF(4, 23, 'server_rack', '#404850'); pF(6, 23, 'server_rack', '#404850');
    pF(8, 23, 'server_rack', '#404850'); pF(10, 23, 'server_rack', '#404850');
    pF(14, 23, 'server_rack', '#404850'); pF(16, 23, 'server_rack', '#404850');
    pF(18, 23, 'server_rack', '#404850');

    // Medical
    pF(31, 23, 'medical_bed', '#f0f0f0'); pF(33, 23, 'medicine_cabinet', '#f0f0f0');
    pF(35, 24, 'desk_monitor', OC.desk);

    // Build walkable grid
    const deskSet = new Set(AGENT_DEFS.map(d => {
      const op = OFFICE_POSITIONS[d.id];
      return op ? `${op.deskPos.x},${op.deskPos.y}` : `${d.deskPos.x},${d.deskPos.y}`;
    }));
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const t = tm[y][x];
      wk[y][x] = (t === 1 || t === 3);
      if (t === 4 && deskSet.has(`${x},${y}`)) wk[y][x] = true;
    }
  }

  /** Get office-specific overrides for agent positions */
  getAgentOverrides(id: string): { deskPos: { x: number; y: number }; room: string } | null {
    return OFFICE_POSITIONS[id] || null;
  }

  drawWorld(ctx: CanvasRenderingContext2D, time: number) {
    this.drawSky(ctx, time);
    this.drawBuildingExterior(ctx);
    this.drawFloors(ctx);
    this.drawOfficeFurniture(ctx, time);
    this.drawRoomLabels(ctx);
  }

  drawCharacter(ctx: CanvasRenderingContext2D, a: Agent, time: number) {
    const bx = a.px, ty = a.py;
    const walking = a.fsmState === 'walking';
    const frame = a.wf;
    const breath = Math.sin(a.breathP) * 0.3;
    const wc = frame % 4, wb = (wc === 1 || wc === 3) ? -0.5 : 0;
    const cy = ty + (walking ? wb : breath);

    // Shadow
    px(ctx, bx + 3, ty + 14, 10, 2, 'rgba(0,0,0,0.12)');

    // Professional pixel character
    this.drawOfficeChar(ctx, bx, cy, ty, a, walking, wc, time);

    // Status indicator
    if (!a.isNPC) {
      const dotColor = STATUS_COLORS[a.agentState] || '#98908c';
      const isWorking = a.agentState === 'working' || a.agentState === 'researching';
      if (isWorking) {
        const glowPulse = .25 + Math.sin(time * 4) * .12;
        ctx.strokeStyle = `rgba(72,200,104,${glowPulse})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(bx + 8, ty + 7, 11, 0, Math.PI * 2); ctx.stroke();
        px(ctx, bx + 6, ty + 16, 4, 2, dotColor);
      } else {
        px(ctx, bx + 7, ty + 16, 2, 2, dotColor);
      }

      // Orb
      const orbColor = STATUS_COLORS[a.agentState] || '#98908c';
      const orbY = a.py - 6 + Math.sin(time * 2) * .8;
      ctx.beginPath(); ctx.arc(bx + 8, orbY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = orbColor; ctx.fill();
    }

    // Name label
    this.drawNameLabel(ctx, a);
  }

  private drawOfficeChar(ctx: CanvasRenderingContext2D, bx: number, cy: number, ty: number, a: Agent, walking: boolean, wc: number, time: number) {
    // Simplified professional pixel character
    const suitColor = a.color;
    const pantsColor = shade(suitColor, -30);

    // Legs (dark pants)
    if (walking) {
      const ll = wc === 1 ? -1 : wc === 3 ? 1 : 0;
      const rl = wc === 1 ? 1 : wc === 3 ? -1 : 0;
      px(ctx, bx + 5 + ll, cy + 11, 2, 3, pantsColor);
      px(ctx, bx + 9 + rl, cy + 11, 2, 3, pantsColor);
      px(ctx, bx + 4 + ll, cy + 13, 3, 1, '#383028');
      px(ctx, bx + 8 + rl, cy + 13, 3, 1, '#383028');
    } else {
      px(ctx, bx + 5, cy + 11, 2, 3, pantsColor);
      px(ctx, bx + 9, cy + 11, 2, 3, pantsColor);
      px(ctx, bx + 4, cy + 13, 3, 1, '#383028');
      px(ctx, bx + 8, cy + 13, 3, 1, '#383028');
    }

    // Body (suit/blouse)
    px(ctx, bx + 4, cy + 6, 8, 5, suitColor);
    // Collar / shirt visible
    px(ctx, bx + 6, cy + 6, 4, 1, '#f0f0f0');
    // Arms
    px(ctx, bx + 3, cy + 6, 1, 4, suitColor);
    px(ctx, bx + 12, cy + 6, 1, 4, suitColor);
    // Hands
    px(ctx, bx + 3, cy + 10, 1, 1, a.skinTone);
    px(ctx, bx + 12, cy + 10, 1, 1, a.skinTone);

    // Head
    const hx = bx + 3.5, hy = cy + a.hBob - 0.5;
    px(ctx, hx + 1, hy + 1, 7, 4.5, a.skinTone);
    px(ctx, hx + .5, hy + 2, 8, 3, a.skinTone);
    px(ctx, hx + 3, hy + 5, 3, 1.5, a.skinTone);

    // Hair (simplified professional style using character's hair color)
    const hc = a.hair;
    px(ctx, hx + 1, hy, 7, 2, hc);
    px(ctx, hx + .5, hy + .5, 8, 1.5, hc);
    if (a.gender === 'female') {
      px(ctx, hx, hy + 1, 1.5, 4, hc);
      px(ctx, hx + 7.5, hy + 1, 1.5, 4, hc);
    }

    // Face
    if (a.dir !== 'up') {
      if (!a.isBlinking) {
        px(ctx, hx + 2, hy + 2, 2, 1.5, '#fff');
        px(ctx, hx + 5, hy + 2, 2, 1.5, '#fff');
        px(ctx, hx + 2.5, hy + 2.3, 1, 1, a.eyeColor);
        px(ctx, hx + 5.5, hy + 2.3, 1, 1, a.eyeColor);
      } else {
        px(ctx, hx + 2, hy + 2.7, 2, .4, '#282028');
        px(ctx, hx + 5.5, hy + 2.7, 2, .4, '#282028');
      }
      px(ctx, hx + 3.5, hy + 4, 2, .4, shade(a.skinTone, -20));
    } else {
      px(ctx, hx + 1, hy + 1, 7, 4, hc);
    }

    // Working animation — typing
    if (a.fsmState === 'active' && (a.agentState === 'working' || a.agentState === 'researching')) {
      const typing = Math.sin(time * 8);
      if (typing > 0) px(ctx, bx + 3, cy + 10, 1, 1, a.skinTone);
      else px(ctx, bx + 12, cy + 10, 1, 1, a.skinTone);
    }
  }

  private drawNameLabel(ctx: CanvasRenderingContext2D, a: Agent) {
    ctx.textAlign = 'center';
    const labelX = a.px + 8;
    if (a.isNPC) {
      ctx.font = 'bold 1.8px monospace';
      ctx.fillStyle = 'rgba(100,100,120,0.6)';
      ctx.fillText(a.name, labelX, a.py + TILE + 2.5);
    } else {
      const ident = AGENT_IDENTITY[a.id];
      if (ident) {
        ctx.font = 'bold 2.2px monospace';
        ctx.fillStyle = '#303040';
        ctx.fillText(ident.short, labelX, a.py + TILE + 2.5);
        ctx.font = '1.5px monospace';
        ctx.fillStyle = 'rgba(80,80,100,0.7)';
        ctx.fillText(ident.agentRole, labelX, a.py + TILE + 5);
      }
    }
  }

  drawEffects(ctx: CanvasRenderingContext2D, time: number) {
    // Minimal office effects — just clouds outside
  }

  drawOverlay(ctx: CanvasRenderingContext2D, viewW: number, viewH: number, time: number) {
    // Subtle day/night for office — dimmer at night
    const phase = getDayPhase();
    if (phase.darkness > 0.1) {
      ctx.fillStyle = `rgba(15,15,30,${phase.darkness * 0.25})`;
      ctx.fillRect(0, 0, viewW, viewH);
    }
  }

  // ─── SKY ───
  private drawSky(ctx: CanvasRenderingContext2D, time: number) {
    const tm = this.tileMap;
    for (let y = 0; y < this.rows!; y++) for (let x = 0; x < this.cols!; x++) {
      if (tm[y][x] === 11) {
        const grad = y / this.rows!;
        const r = Math.floor(106 + grad * 20);
        const g = Math.floor(180 - grad * 10);
        const b = Math.floor(232 - grad * 20);
        px(ctx, x * TILE, y * TILE, TILE, TILE, `rgb(${r},${g},${b})`);
      }
    }
    // Clouds in the sky
    for (const c of clouds) {
      ctx.fillStyle = `rgba(255,255,255,${c.op * 0.6})`;
      ctx.beginPath(); ctx.ellipse(c.x, c.y * TILE + c.h / 2, c.w / 2, c.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ─── BUILDING EXTERIOR ───
  private drawBuildingExterior(ctx: CanvasRenderingContext2D) {
    const tm = this.tileMap;
    for (let y = 0; y < this.rows!; y++) for (let x = 0; x < this.cols!; x++) {
      if (tm[y][x] === 20) {
        px(ctx, x * TILE, y * TILE, TILE, TILE, OC.wall);
        px(ctx, x * TILE, y * TILE, TILE, 1, OC.wallLight);
        px(ctx, x * TILE, y * TILE + TILE - 1, TILE, 1, OC.wallDark);
      }
    }
  }

  // ─── FLOORS ───
  private drawFloors(ctx: CanvasRenderingContext2D) {
    const tm = this.tileMap, rm = this.roomMap;
    for (let y = 0; y < this.rows!; y++) for (let x = 0; x < this.cols!; x++) {
      const t = tm[y][x], fx = x * TILE, fy = y * TILE, zone = rm[y][x];
      if (t === 0) {
        // Wall
        px(ctx, fx, fy, TILE, TILE, OC.wall);
        px(ctx, fx, fy, TILE, 1, OC.wallLight);
        px(ctx, fx, fy + TILE - 1, TILE, 1, OC.wallDark);
        if (zone && OFFICE_ZONES[zone]) px(ctx, fx + 1, fy + 1, TILE - 2, TILE - 2, OFFICE_ZONES[zone].accent + '18');
        // Windows on exterior walls (left=0, right=49)
        if (x === 0 || x === 49) {
          if (y % 3 === 0 && y > 2 && y < 26) {
            px(ctx, fx + 3, fy + 2, TILE - 6, TILE - 4, OC.window);
            px(ctx, fx + 3, fy + 2, TILE - 6, 1, OC.windowFrame);
            px(ctx, fx + 4, fy + 3, 3, 3, OC.windowGlare);
          }
        }
      } else if (t === 1 || t === 4) {
        if (zone && OFFICE_ZONES[zone]) {
          const th = OFFICE_ZONES[zone];
          px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? th.floor : th.floorAlt);
        } else {
          px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? OC.floor : OC.floorAlt);
        }
        // Carpet runner in hallway row
        if (t === 1 && y === 13) {
          px(ctx, fx + 2, fy, TILE - 4, TILE, OC.carpet);
        }
      } else if (t === 3) {
        // Doorway
        px(ctx, fx, fy, TILE, TILE, OC.floorDark);
        px(ctx, fx + 2, fy, TILE - 4, TILE, OC.floor);
      }
    }
  }

  // ─── OFFICE FURNITURE ───
  private drawOfficeFurniture(ctx: CanvasRenderingContext2D, time: number) {
    for (const f of this.furniture) {
      const fx = f.x * TILE, fy = f.y * TILE;
      switch (f.type) {
        case 'exec_desk':
          px(ctx, fx, fy + 4, TILE, 8, OC.desk);
          px(ctx, fx + 1, fy + 4, TILE - 2, 1, OC.deskLight);
          px(ctx, fx + 2, fy + 2, 4, 3, '#e8e0d0'); // papers
          break;
        case 'desk_monitor':
          px(ctx, fx, fy + 6, TILE, 6, OC.desk);
          px(ctx, fx + 1, fy + 6, TILE - 2, 1, OC.deskLight);
          break;
        case 'monitor':
          px(ctx, fx + 2, fy, TILE - 4, 7, OC.monitor);
          px(ctx, fx + 3, fy + 1, TILE - 6, 4.5, OC.monitorScreen);
          // Screen glow
          px(ctx, fx + 2, fy + 7, TILE - 4, 1, OC.monitorGlow);
          // Animated screen content
          { const line = Math.floor(time * 2) % 4;
            for (let i = 0; i < 3; i++) {
              const lx = fx + 4 + i * 3;
              const ly = fy + 1.5 + ((i + line) % 4) * 1;
              px(ctx, lx, ly, 2, 0.5, `rgba(120,200,160,${0.3 + Math.sin(time + i) * 0.15})`);
            }
          }
          break;
        case 'plant_office':
          px(ctx, fx + 5, fy + 8, 6, 6, OC.plantPot);
          px(ctx, fx + 4, fy + 4, 8, 5, OC.plant);
          px(ctx, fx + 3, fy + 5, 3, 3, shade(OC.plant, -15));
          px(ctx, fx + 10, fy + 5, 3, 3, shade(OC.plant, -15));
          break;
        case 'whiteboard':
          px(ctx, fx + 1, fy + 1, 14, 12, OC.whiteboardFrame);
          px(ctx, fx + 2, fy + 2, 12, 10, OC.whiteboard);
          px(ctx, fx + 3, fy + 3, 4, 0.5, '#e04040');
          px(ctx, fx + 3, fy + 5, 6, 0.5, '#4888d0');
          px(ctx, fx + 3, fy + 7, 3, 0.5, '#48a848');
          break;
        case 'coffee_machine':
          px(ctx, fx + 4, fy + 4, 8, 10, OC.coffeeBody);
          px(ctx, fx + 5, fy + 5, 6, 4, '#a08060');
          px(ctx, fx + 5, fy + 10, 2, 3, '#e0d0b0');
          // Steam
          { const steamY = Math.sin(time * 2) * 0.5;
            px(ctx, fx + 5.5, fy + 3 + steamY, 1, 1, 'rgba(200,200,200,0.2)');
          }
          break;
        case 'couch':
          px(ctx, fx, fy + 6, TILE, 8, '#605040');
          px(ctx, fx + 1, fy + 6, TILE - 2, 6, '#706050');
          px(ctx, fx, fy + 4, TILE, 3, '#504030');
          break;
        case 'coffee_table':
          px(ctx, fx + 2, fy + 6, 12, 6, OC.desk);
          px(ctx, fx + 3, fy + 6, 10, 1, OC.deskLight);
          break;
        case 'water_cooler':
          px(ctx, fx + 5, fy + 4, 6, 10, '#88c8d8');
          px(ctx, fx + 6, fy + 2, 4, 3, '#a0d8e8');
          px(ctx, fx + 5, fy + 8, 6, 2, '#d0d0d0');
          break;
        case 'conf_table':
          px(ctx, fx, fy + 4, TILE, 8, '#806838');
          px(ctx, fx, fy + 4, TILE, 1, '#907848');
          break;
        case 'chair_conf':
          px(ctx, fx + 4, fy + 6, 8, 8, OC.chair);
          px(ctx, fx + 5, fy + 6, 6, 6, OC.chairSeat);
          break;
        case 'stove_office':
          px(ctx, fx + 2, fy + 4, 12, 10, '#e0e0e0');
          px(ctx, fx + 4, fy + 5, 3, 3, '#303840');
          px(ctx, fx + 9, fy + 5, 3, 3, '#303840');
          break;
        case 'fridge':
          px(ctx, fx + 2, fy + 2, 12, 12, '#e0e0e0');
          px(ctx, fx + 3, fy + 3, 10, 5, '#d0d0d0');
          px(ctx, fx + 3, fy + 9, 10, 4, '#d0d0d0');
          px(ctx, fx + 12, fy + 5, 1, 2, '#a0a0a0');
          break;
        case 'table_kitchen':
          px(ctx, fx + 1, fy + 6, 14, 2, OC.desk);
          px(ctx, fx, fy + 5, 16, 1.5, OC.deskLight);
          break;
        case 'medical_bed':
          px(ctx, fx + 1, fy + 6, 14, 8, '#f0f0f0');
          px(ctx, fx + 2, fy + 7, 12, 6, '#d8e0f0');
          break;
        case 'medicine_cabinet':
          px(ctx, fx + 1, fy, 14, 16, '#f0f0f0');
          px(ctx, fx + 1, fy + 4, 14, 1, '#d0d0d0');
          { const bc = ['#e07060', '#48a848', '#4888d8', '#e8c040'];
            for (let i = 0; i < 4; i++) px(ctx, fx + 2 + i * 3, fy + 1, 2, 3, bc[i]);
          }
          break;
        case 'server_rack':
          px(ctx, fx + 2, fy + 1, 12, 14, '#303840');
          px(ctx, fx + 3, fy + 2, 10, 12, '#404850');
          // Blinking lights
          for (let i = 0; i < 4; i++) {
            const on = Math.sin(time * 3 + f.x + i * 1.5) > 0;
            px(ctx, fx + 4, fy + 3 + i * 3, 1, 1, on ? '#48c868' : '#304030');
            px(ctx, fx + 6, fy + 3 + i * 3, 1, 1, on ? '#4888d0' : '#303848');
          }
          break;
      }
    }
  }

  private drawRoomLabels(ctx: CanvasRenderingContext2D) {
    ctx.font = '2.5px monospace'; ctx.textAlign = 'center';
    const labels = [
      { t: 'CEO OFFICE', x: 7, y: 9, c: 'rgba(160,128,64,0.25)' },
      { t: 'OPS CENTER', x: 17, y: 9, c: 'rgba(160,128,64,0.2)' },
      { t: 'CONFERENCE', x: 25.5, y: 9, c: 'rgba(88,120,180,0.2)' },
      { t: 'CREATIVE', x: 33.5, y: 9, c: 'rgba(200,90,80,0.2)' },
      { t: 'SECURITY', x: 43, y: 9, c: 'rgba(72,168,72,0.2)' },
      { t: 'DEV LAB', x: 12, y: 19, c: 'rgba(72,136,208,0.2)' },
      { t: 'LOUNGE', x: 25, y: 19, c: 'rgba(140,120,160,0.2)' },
      { t: 'KITCHEN', x: 33, y: 19, c: 'rgba(200,140,60,0.18)' },
      { t: 'RESEARCH', x: 43, y: 19, c: 'rgba(120,88,184,0.2)' },
      { t: 'SERVER ROOM', x: 12, y: 24, c: 'rgba(64,168,216,0.18)' },
      { t: 'MEDICAL', x: 33, y: 24, c: 'rgba(200,100,120,0.2)' },
    ];
    for (const l of labels) { ctx.fillStyle = l.c; ctx.fillText(l.t, l.x * TILE, l.y * TILE); }
  }
}
