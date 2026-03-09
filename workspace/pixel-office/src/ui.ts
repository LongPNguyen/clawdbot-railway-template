// ═══ UI — Toolbar, Status Panel, Theme Switcher ═══

import type { Agent } from './agent';
import type { Camera } from './camera';
import type { Theme } from './themes/types';
import { STATUS_COLORS, AGENT_IDENTITY, TILE } from './config';

export class UI {
  private selectedAgent: Agent | null = null;
  private onThemeChange: (id: string) => void;
  private camera: Camera;
  private agents: Agent[];
  currentThemeId: string = 'one-piece';

  constructor(
    agents: Agent[],
    camera: Camera,
    themes: Theme[],
    currentThemeId: string,
    onThemeChange: (id: string) => void
  ) {
    this.agents = agents;
    this.camera = camera;
    this.onThemeChange = onThemeChange;
    this.currentThemeId = currentThemeId;

    // Theme switcher
    this.buildThemeSwitcher(themes, currentThemeId);

    // Panel close button
    document.getElementById('panel-close')!.addEventListener('click', () => {
      this.selectedAgent = null;
      this.hidePanel();
      this.camera.resetAgentZoom();
      this.buildToolbar();
    });
  }

  get selected() { return this.selectedAgent; }

  selectAgent(agent: Agent | null) {
    this.selectedAgent = agent;
    if (agent) {
      this.showPanel(agent);
    } else {
      this.hidePanel();
    }
    this.buildToolbar();
  }

  /** Handle click on canvas — find agent under cursor */
  handleWorldClick(worldX: number, worldY: number): boolean {
    const mx = worldX / TILE, my = worldY / TILE;
    const hitRadius = 1.5;
    let closest: Agent | null = null, closestDist = Infinity;
    const isOnePiece = this.currentThemeId === 'one-piece';
    for (const a of this.agents) {
      // NPCs only clickable in One Piece theme
      if (!isOnePiece && a.isNPC) continue;
      const ax = a.px / TILE + 0.5, ay = a.py / TILE + 0.5;
      const d = Math.sqrt((mx - ax) ** 2 + (my - ay) ** 2);
      if (d < hitRadius && d < closestDist) { closestDist = d; closest = a; }
    }
    if (closest) {
      this.selectAgent(closest);
      this.camera.toggleAgentZoom(closest.id, closest.px + 8, closest.py + 8);
      return true;
    } else {
      this.selectAgent(null);
      this.camera.resetAgentZoom();
      return false;
    }
  }

  buildToolbar() {
    const tb = document.getElementById('toolbar')!;
    tb.innerHTML = '';
    const isOnePiece = this.currentThemeId === 'one-piece';
    const visible = isOnePiece ? this.agents : this.agents.filter(a => !a.isNPC);
    const sorted = [...visible].sort((a, b) => (a.isNPC ? 1 : 0) - (b.isNPC ? 1 : 0));
    
    for (const a of sorted) {
      const b = document.createElement('button');
      b.className = 'agent-btn' + (a === this.selectedAgent ? ' selected' : '');
      
      if (a.isNPC) {
        const npcActivity = a.currentActivity ? a.currentActivity.desc : '';
        b.innerHTML = `<span class="status-dot" style="background:#a890c8;opacity:0.5"></span><span style="opacity:0.7">${a.name}</span>`;
        b.style.borderColor = a === this.selectedAgent ? '#e87828' : '#604870';
        b.title = npcActivity || a.role;
      } else {
        const ident = AGENT_IDENTITY[a.id];
        const sc = STATUS_COLORS[a.agentState] || '#98908c';
        const isWorking = a.agentState === 'working' || a.agentState === 'researching';
        const dotClass = isWorking ? 'status-dot pulse' : 'status-dot';
        const displayName = ident ? ident.short : a.name;
        const displayRole = ident ? ident.agentRole : a.role;
        const workBadge = isWorking
          ? `<span style="font-size:8px;background:${sc};color:#000;padding:1px 4px;border-radius:3px;font-weight:bold">&#9881; BUSY</span>`
          : '';
        b.innerHTML = `<span class="${dotClass}" style="background:${sc};color:${sc};${isWorking ? 'box-shadow:0 0 6px ' + sc : ''}"></span><b>${displayName}</b><span style="font-size:9px;opacity:0.6;color:#c8a040">${displayRole}</span>${workBadge}`;
        b.title = a.realTask || a.task || a.agentState;
        if (isWorking) {
          b.style.borderColor = a === this.selectedAgent ? '#e87828' : sc;
          b.style.boxShadow = `0 0 8px ${sc}40`;
        }
      }
      
      b.addEventListener('click', () => {
        this.selectAgent(a);
        // Zoom to agent
        this.camera.toggleAgentZoom(a.id, a.px + 8, a.py + 8);
      });
      tb.appendChild(b);
    }
    
    const zd = document.createElement('span');
    zd.id = 'zoom-display';
    zd.textContent = this.camera.getZoomDisplay();
    tb.appendChild(zd);
  }

  updateZoomDisplay() {
    const zd = document.getElementById('zoom-display');
    if (zd) zd.textContent = this.camera.getZoomDisplay();
  }

  updateSelectedPanel() {
    if (this.selectedAgent) this.updatePanel(this.selectedAgent);
  }

  // ─── Panel ───
  private showPanel(a: Agent) {
    document.getElementById('status-panel')!.classList.add('visible');
    this.updatePanel(a);
  }

  private hidePanel() {
    document.getElementById('status-panel')!.classList.remove('visible');
  }

  private updatePanel(a: Agent) {
    const sc = STATUS_COLORS[a.agentState] || '#98908c';
    document.getElementById('panel-dot')!.style.backgroundColor = sc;

    if (a.isNPC) {
      document.getElementById('panel-agent-name')!.textContent = a.name;
      document.getElementById('panel-role')!.innerHTML = a.role + ' · <span style="color:#a890c8;font-weight:bold;border:1px solid #a890c8;padding:1px 5px;border-radius:3px;font-size:10px">NPC</span>';
      const statusEl = document.getElementById('panel-status')!;
      statusEl.textContent = a.currentActivity ? a.currentActivity.desc : 'Hanging out';
      statusEl.style.color = '#a890c8';
      document.getElementById('panel-activity-desc')!.textContent = a.currentActivity ? a.currentActivity.desc : 'Enjoying the voyage';
      (document.getElementById('panel-activity-desc')! as HTMLElement).style.borderLeftColor = '#a890c8';
    } else {
      const ident = AGENT_IDENTITY[a.id];
      if (ident) {
        document.getElementById('panel-agent-name')!.innerHTML = `${ident.agentName} <span style="font-size:11px;color:#c8a040;font-weight:normal">/ ${ident.agentRole}</span>`;
        document.getElementById('panel-role')!.innerHTML = `<span style="color:#48c868;font-weight:bold;border:1px solid #48c868;padding:1px 5px;border-radius:3px;font-size:10px">AGENT</span> <span style="color:#807060;font-size:10px">as ${a.name} (${a.role})</span>`;
      } else {
        document.getElementById('panel-agent-name')!.textContent = a.name;
        document.getElementById('panel-role')!.innerHTML = a.role + ' · <span style="color:#48c868;font-weight:bold">AGENT</span>';
      }
      const statusEl = document.getElementById('panel-status')!;
      statusEl.textContent = a.agentState.replace('_', ' ').toUpperCase();
      statusEl.style.color = sc;
      const taskText = a.realTask || a.task || 'No active task';
      document.getElementById('panel-activity-desc')!.textContent = taskText;
      (document.getElementById('panel-activity-desc')! as HTMLElement).style.borderLeftColor = sc;
    }

    document.getElementById('panel-time')!.textContent = a.getStateTime();
    document.getElementById('panel-room')!.textContent = a.room || '—';
    document.getElementById('panel-type')!.textContent = a.isNPC ? 'NPC' : 'AGENT';
    document.getElementById('panel-type')!.style.color = a.isNPC ? '#a890c8' : '#48c868';
    document.getElementById('panel-recent')!.innerHTML = a.log.map(l => `<div>• ${l}</div>`).join('') || '<div>No recent activity</div>';
  }

  // ─── Theme Switcher ───
  private buildThemeSwitcher(themes: Theme[], currentId: string) {
    const container = document.getElementById('theme-switcher')!;
    container.innerHTML = '';
    for (const theme of themes) {
      const btn = document.createElement('button');
      btn.textContent = theme.name;
      btn.className = theme.id === currentId ? 'active' : '';
      btn.dataset.themeId = theme.id;
      btn.addEventListener('click', () => {
        // Use live currentThemeId instead of stale closure
        if (theme.id === this.currentThemeId) return;
        // Fade transition
        const fade = document.getElementById('theme-fade')!;
        fade.classList.add('active');
        setTimeout(() => {
          this.currentThemeId = theme.id;
          this.onThemeChange(theme.id);
          // Update buttons
          container.querySelectorAll('button').forEach(b => {
            b.className = b.dataset.themeId === theme.id ? 'active' : '';
          });
          setTimeout(() => fade.classList.remove('active'), 50);
        }, 300);
      });
      container.appendChild(btn);
    }
  }

  /** Draw selection indicators (bouncing arrow / ring). Called within camera transform. */
  drawSelectionIndicator(ctx: CanvasRenderingContext2D, time: number) {
    const a = this.selectedAgent;
    if (!a) return;
    const cx = a.px + 8, cy2 = a.py + 8;

    if (!a.isNPC) {
      const arrowBounce = Math.abs(Math.sin(time * 5)) * 4;
      const arrowY = a.py - 12 - arrowBounce;
      ctx.fillStyle = '#f8c848';
      ctx.beginPath();
      ctx.moveTo(cx - 3, arrowY);
      ctx.lineTo(cx + 3, arrowY);
      ctx.lineTo(cx, arrowY + 4);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#c89828'; ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - 3, arrowY);
      ctx.lineTo(cx + 3, arrowY);
      ctx.lineTo(cx, arrowY + 4);
      ctx.closePath(); ctx.stroke();
    } else {
      const pulse = .4 + Math.sin(time * 3) * .15;
      ctx.strokeStyle = `rgba(168,144,200,${pulse})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.arc(cx, cy2, 10, 0, Math.PI * 2); ctx.stroke();
    }
  }
}
