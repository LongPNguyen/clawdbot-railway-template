// ═══ EFFECTS — day/night, particles, clouds, seagulls, waves ═══

import { TILE, COLS, ROWS } from './config';

// ─── AMBIENT STATE ───
export const amb = {
  time: 0,
  wavePhase: 0,
  sparkP: [] as Particle[],
  steamP: [] as Particle[],
};

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; size: number; col: string;
}

interface Gull {
  x: number; y: number; speed: number; wp: number;
  ws: number; yo: number; dir: number;
}

interface Cloud {
  x: number; y: number; speed: number; w: number;
  h: number; op: number;
}

interface Wave {
  x: number; y: number; speed: number; phase: number; len: number;
}

interface Star {
  x: number; y: number; size: number;
  twinkleSpeed: number; twinkleOffset: number; brightness: number;
}

export const gulls: Gull[] = [];
export const clouds: Cloud[] = [];
export const waves: Wave[] = [];
export const stars: Star[] = [];

export function initEffects() {
  // Stars
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: Math.random() * COLS * TILE, y: Math.random() * ROWS * TILE,
      size: 0.4 + Math.random() * 1.2, twinkleSpeed: 1.5 + Math.random() * 3,
      twinkleOffset: Math.random() * Math.PI * 2, brightness: 0.4 + Math.random() * 0.6,
    });
  }
  // Seagulls
  for (let i = 0; i < 2; i++) {
    gulls.push({
      x: 5 + Math.random() * 20, y: Math.random() * 3,
      speed: 0.015 + Math.random() * 0.02, wp: Math.random() * Math.PI * 2,
      ws: 3 + Math.random() * 3, yo: Math.random() * Math.PI * 2, dir: 1,
    });
  }
  // Clouds
  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: Math.random() * COLS * TILE, y: Math.random() * 2,
      speed: 0.002 + Math.random() * 0.004, w: 30 + Math.random() * 50,
      h: 6 + Math.random() * 10, op: 0.4 + Math.random() * 0.25,
    });
  }
  // Waves
  for (let i = 0; i < 10; i++) {
    waves.push({
      x: Math.random() * COLS * TILE, y: 5 + Math.random() * 42,
      speed: 0.3 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2,
      len: 15 + Math.random() * 25,
    });
  }
}

function spSpark() {
  if (amb.sparkP.length > 8) return;
  amb.sparkP.push({
    x: 8 * TILE + Math.random() * 8, y: 36 * TILE + 2,
    vx: (Math.random() - 0.5) * 1.5, vy: -0.8 - Math.random() * 0.5,
    life: 1, size: 0.5 + Math.random() * 0.8,
    col: Math.random() > 0.5 ? '#f0c060' : '#e89060',
  });
}

function spSteam() {
  if (amb.steamP.length > 4) return;
  amb.steamP.push({
    x: 15 * TILE + 4 + Math.random() * 8, y: 39 * TILE,
    vx: (Math.random() - 0.5) * 0.3, vy: -0.4 - Math.random() * 0.3,
    life: 1, size: 1 + Math.random(), col: '#fff',
  });
}

export function updateAmbient(dt: number) {
  amb.time += dt / 1000;
  amb.wavePhase += dt * 0.001;

  if (Math.random() < dt * 0.0015) spSpark();
  for (let i = amb.sparkP.length - 1; i >= 0; i--) {
    const p = amb.sparkP[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= dt * 0.003;
    if (p.life <= 0) amb.sparkP.splice(i, 1);
  }

  if (Math.random() < dt * 0.0015) spSteam();
  for (let i = amb.steamP.length - 1; i >= 0; i--) {
    const p = amb.steamP[i];
    p.x += p.vx; p.y += p.vy; p.life -= dt * 0.001; p.size += dt * 0.001;
    if (p.life <= 0) amb.steamP.splice(i, 1);
  }

  for (let i = gulls.length - 1; i >= 0; i--) {
    gulls[i].x += gulls[i].speed * gulls[i].dir;
    gulls[i].yo += dt * 0.001;
    if (gulls[i].x > COLS + 3 || gulls[i].x < -3) gulls.splice(i, 1);
  }
  if (Math.random() < dt * 4e-5) {
    gulls.push({
      x: -5 + Math.random() * 5, y: 1 + Math.random() * 3,
      speed: 0.015 + Math.random() * 0.025, wp: Math.random() * Math.PI * 2,
      ws: 3 + Math.random() * 3, yo: Math.random() * Math.PI * 2,
      dir: Math.random() > 0.3 ? 1 : -1,
    });
  }

  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].x -= clouds[i].speed * dt;
    if (clouds[i].x < -clouds[i].w * 2) clouds.splice(i, 1);
  }
  if (clouds.length < 3 && Math.random() < dt * 2e-5) {
    clouds.push({
      x: COLS * TILE + 20, y: Math.random() * 2,
      speed: 0.002 + Math.random() * 0.004, w: 30 + Math.random() * 50,
      h: 6 + Math.random() * 10, op: 0.4 + Math.random() * 0.25,
    });
  }
}

// ─── DAY/NIGHT CYCLE ───
export interface DayPhase {
  hour: number; brightness: number; darkness: number;
  warmth: number; starAlpha: number; sunAlt: number; moonPhase: number;
}

export function getDayPhase(): DayPhase {
  const now = new Date();
  // Use Central Time (America/Chicago)
  const ct = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const hour = ct.getHours() + ct.getMinutes() / 60;
  const sunAlt = Math.cos((hour / 24 - 0.5) * Math.PI * 2);
  const brightness = Math.max(0, Math.min(1, (sunAlt + 0.15) / 1.15));
  const darkness = 1 - brightness;
  const horizonProx = 1 - Math.abs(sunAlt);
  const warmth = Math.min(horizonProx * Math.max(0, sunAlt + 0.4) * 1.2, 1);
  const starAlpha = Math.max(0, (darkness - 0.3) / 0.7);
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 864e5);
  const moonPhase = (dayOfYear % 30) / 30;
  return { hour, brightness, darkness, warmth, starAlpha, sunAlt, moonPhase };
}

// Helper for drawing
export function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

export function shade(hex: string, amt: number): string {
  let r: number, g: number, b: number;
  if (hex[0] === '#') {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (hex.startsWith('rgb')) {
    const m = hex.match(/(\d+)/g);
    if (!m) return hex;
    r = +m[0]; g = +m[1]; b = +m[2];
  } else return hex;
  return `rgb(${Math.max(0, Math.min(255, r + amt))},${Math.max(0, Math.min(255, g + amt))},${Math.max(0, Math.min(255, b + amt))})`;
}
