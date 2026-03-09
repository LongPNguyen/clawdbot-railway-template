// ═══ PIXEL OFFICE v14 — MAIN ENTRY ═══

import { TILE, COLS, ROWS, NATIVE_W, NATIVE_H, AGENT_DEFS } from './config';
import { Camera } from './camera';
import { Agent } from './agent';
import { initEffects, updateAmbient, amb, getDayPhase } from './effects';
import { OnePieceTheme } from './themes/one-piece';
import { ModernOfficeTheme } from './themes/modern-office';
import type { Theme } from './themes/types';
import { StatePoller } from './poller';
import { UI } from './ui';

// ─── CANVAS SETUP ───
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function getToolbarHeight() {
  return window.innerWidth <= 480 ? 38 : window.innerWidth <= 768 ? 42 : 48;
}

// ─── THEMES ───
const themes: Theme[] = [new OnePieceTheme(), new ModernOfficeTheme()];
let currentTheme: Theme;
const savedTheme = localStorage.getItem('pixel-office-theme') || 'one-piece';
currentTheme = themes.find(t => t.id === savedTheme) || themes[0];
currentTheme.init();

// ─── CAMERA ───
function getThemeWorldSize(theme: Theme) {
  const c = theme.cols || COLS;
  const r = theme.rows || ROWS;
  return { w: c * TILE, h: r * TILE };
}
const initWorld = getThemeWorldSize(currentTheme);
const camera = new Camera(initWorld.w, initWorld.h);

// ─── AGENTS ───
let agents: Agent[] = [];
function initAgents() {
  agents = AGENT_DEFS.map(d => {
    const agent = new Agent(d, () => agents);
    agent.setWalkable(currentTheme.walkable);
    return agent;
  });

  // For Modern Office theme, update desk positions
  if (currentTheme.id === 'modern-office' && currentTheme instanceof ModernOfficeTheme) {
    for (const a of agents) {
      const overrides = (currentTheme as ModernOfficeTheme).getAgentOverrides(a.id);
      if (overrides) {
        a.deskPos = { ...overrides.deskPos };
        a.x = overrides.deskPos.x;
        a.y = overrides.deskPos.y;
        a.px = overrides.deskPos.x * TILE;
        a.py = overrides.deskPos.y * TILE;
        a.room = overrides.room;
      }
    }
  }
}
initAgents();

// ─── EFFECTS ───
initEffects();

// ─── UI ───
const ui = new UI(agents, camera, themes, currentTheme.id, (newThemeId) => {
  // Theme change handler
  currentTheme = themes.find(t => t.id === newThemeId) || themes[0];
  currentTheme.init();
  localStorage.setItem('pixel-office-theme', currentTheme.id);
  
  // Reset camera for new world size
  const ws = getThemeWorldSize(currentTheme);
  camera.x = ws.w / 2;
  camera.y = ws.h / 2;
  (camera as any).targetX = camera.x;
  (camera as any).targetY = camera.y;
  camera.zoom = Math.max(0.8, Math.min(camera.viewW / ws.w, camera.viewH / ws.h));
  (camera as any).targetZoom = camera.zoom;
  camera.resetAgentZoom();
  
  // Reinit agents with new walkable map + positions
  const savedStates = agents.map(a => ({
    id: a.id, state: a.agentState, task: a.task, realTask: a.realTask, log: [...a.log], stateStart: a.stateStart
  }));
  
  initAgents();
  
  // Restore states
  for (const saved of savedStates) {
    const a = agents.find(ag => ag.id === saved.id);
    if (a) {
      a.agentState = saved.state;
      a.task = saved.task;
      a.realTask = saved.realTask;
      a.log = saved.log;
      a.stateStart = saved.stateStart;
    }
  }
  
  // Restart poller with new agents
  poller.stop();
  poller = new StatePoller(agents, () => ui.buildToolbar());
  poller.start();
  
  // Update UI references
  (ui as any).agents = agents;
  ui.currentThemeId = currentTheme.id;
  ui.buildToolbar();
});

// ─── STATE POLLER ───
let poller = new StatePoller(agents, () => ui.buildToolbar());
poller.start();

// ─── CANVAS RESIZE ───
let hasUserZoomed = false;
function resize() {
  const tbH = getToolbarHeight();
  const w = window.innerWidth;
  const h = window.innerHeight - tbH;
  
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.imageSmoothingEnabled = false;
  
  camera.resize(w, h);
  
  // Set initial zoom to fit the world nicely
  if (!camera.isZoomedOnAgent) {
    const ws = getThemeWorldSize(currentTheme);
    const fitZoom = Math.min(w / ws.w, h / ws.h);
    // On first load or if zoom is at default, auto-fit
    if (!hasUserZoomed) {
      camera.zoom = Math.max(0.5, fitZoom * 0.95);
      (camera as any).targetZoom = camera.zoom;
    }
  }
  
  ui.updateZoomDisplay();
}
window.addEventListener('resize', resize);
resize();

// ─── INPUT: SCROLL/PINCH ZOOM ───
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  
  // Detect trackpad pinch (ctrlKey is set for pinch gestures)
  const isPinch = e.ctrlKey;
  const delta = isPinch ? -e.deltaY * 0.01 : -e.deltaY * 0.002;
  const factor = Math.exp(delta);
  
  hasUserZoomed = true;
  camera.zoomAt(sx, sy, factor);
  ui.updateZoomDisplay();
}, { passive: false });

// ─── INPUT: CLICK / TAP ───
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let dragCamStartX = 0, dragCamStartY = 0;
let mouseDownTime = 0;

canvas.addEventListener('mousedown', (e) => {
  isDragging = false;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragCamStartX = camera.x;
  dragCamStartY = camera.y;
  mouseDownTime = Date.now();
});

canvas.addEventListener('mousemove', (e) => {
  if (e.buttons !== 1) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;
  if (isDragging) {
    camera.x = dragCamStartX - dx / camera.zoom;
    camera.y = dragCamStartY - dy / camera.zoom;
    // Stop any ongoing animation
    (camera as any).targetX = camera.x;
    (camera as any).targetY = camera.y;
    (camera as any).animating = false;
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDragging && Date.now() - mouseDownTime < 300) {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = camera.screenToWorld(sx, sy);
    ui.handleWorldClick(world.x, world.y);
  }
  isDragging = false;
});

// ─── INPUT: TOUCH ───
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
let touchIsPan = false;
let touchCamStartX = 0, touchCamStartY = 0;
let pinchStartDist = 0, pinchStartZoom = 1;

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    touchCamStartX = camera.x;
    touchCamStartY = camera.y;
    touchIsPan = false;
  } else if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    pinchStartDist = Math.sqrt(dx * dx + dy * dy);
    pinchStartZoom = camera.zoom;
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    e.preventDefault();
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) touchIsPan = true;
    if (touchIsPan) {
      camera.x = touchCamStartX - dx / camera.zoom;
      camera.y = touchCamStartY - dy / camera.zoom;
      (camera as any).targetX = camera.x;
      (camera as any).targetY = camera.y;
      (camera as any).animating = false;
    }
  } else if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const newZoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, pinchStartZoom * (dist / pinchStartDist)));
    
    // Zoom toward pinch center
    const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    const rect = canvas.getBoundingClientRect();
    const sx = cx - rect.left, sy = cy - rect.top;
    const worldBefore = camera.screenToWorld(sx, sy);
    camera.zoom = newZoom;
    const worldAfter = camera.screenToWorld(sx, sy);
    camera.x -= (worldAfter.x - worldBefore.x);
    camera.y -= (worldAfter.y - worldBefore.y);
    (camera as any).targetX = camera.x;
    (camera as any).targetY = camera.y;
    (camera as any).targetZoom = camera.zoom;
    
    ui.updateZoomDisplay();
  }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
  if (!touchIsPan && Date.now() - touchStartTime < 300 && e.changedTouches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const sx = touchStartX - rect.left;
    const sy = touchStartY - rect.top;
    const world = camera.screenToWorld(sx, sy);
    ui.handleWorldClick(world.x, world.y);
  }
  touchIsPan = false;
}, { passive: false });

// ─── GAME LOOP ───
let lastTime = 0;

function gameLoop(timestamp: number) {
  const dt = Math.min(timestamp - lastTime, 100);
  lastTime = timestamp;

  // Update
  camera.update(dt);
  updateAmbient(dt);
  for (const a of agents) a.update(dt);
  if (ui.selected) ui.updateSelectedPanel();
  ui.updateZoomDisplay();

  // Clear
  ctx.fillStyle = currentTheme.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply camera transform
  camera.apply(ctx);

  // Draw world
  currentTheme.drawWorld(ctx, amb.time);

  // Draw characters (sorted by Y for depth)
  // NPCs only appear on One Piece theme
  const isOnePiece = currentTheme.id === 'one-piece';
  const sorted = [...agents].filter(a => isOnePiece || !a.isNPC).sort((a, b) => a.py - b.py);
  for (const a of sorted) {
    currentTheme.drawCharacter(ctx, a, amb.time);
  }

  // Selection indicator
  ui.drawSelectionIndicator(ctx, amb.time);

  // Effects
  currentTheme.drawEffects(ctx, amb.time);

  // Restore camera
  camera.restore(ctx);

  // Screen-space overlays (day/night tinting)
  currentTheme.drawOverlay(ctx, canvas.width, canvas.height, amb.time);

  // Time indicator
  const phase = getDayPhase();
  // Display in Central Time (UTC-6, or UTC-5 during DST)
  const now = new Date();
  const ct = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const ctH = ct.getHours().toString().padStart(2, '0');
  const ctM = ct.getMinutes().toString().padStart(2, '0');
  const ampm = ct.getHours() >= 12 ? 'PM' : 'AM';
  const h12 = ct.getHours() % 12 || 12;
  const timeStr = `${h12}:${ctM} ${ampm} CT`;
  ctx.font = '12px monospace';
  ctx.fillStyle = phase.darkness > .3 ? 'rgba(180,200,240,0.4)' : 'rgba(40,30,20,0.3)';
  ctx.textAlign = 'right';
  ctx.fillText(timeStr, canvas.width - 8, 20);
  ctx.textAlign = 'center';

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
ui.buildToolbar();

console.log('🏴‍☠️ Pixel Office v14 — Theme Modes + Zoom Controls');
console.log('🎨 Press theme buttons to switch between One Piece and Modern Office');
console.log('🔍 Scroll wheel / pinch to zoom toward cursor');
console.log('👆 Click agent names to zoom to character');
console.log('🖱️ Click and drag to pan the camera');
