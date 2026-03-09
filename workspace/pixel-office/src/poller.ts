// ═══ STATE POLLER — fetches state.json, manages live/demo mode ═══

import type { Agent } from './agent';
import { DEMO_TASKS, CHAR_ACTIVITIES } from './config';

export class StatePoller {
  private isLive = false;
  private lastUpdate = 0;
  private failCount = 0;
  private demoIdx: Record<string, number> = {};
  private demoInt: ReturnType<typeof setInterval> | null = null;
  private npcTimers: Record<string, ReturnType<typeof setTimeout>> = {};
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private onUpdate: () => void;

  constructor(
    private agents: Agent[],
    onUpdate: () => void
  ) {
    this.onUpdate = onUpdate;
    this.agents.forEach(a => this.demoIdx[a.id] = 0);
  }

  start() {
    this.pollTimer = setInterval(() => this.poll(), 2000);
    this.poll();
    // Init NPCs
    this.agents.forEach(a => {
      if (a.isNPC) {
        a.agentState = 'relaxing';
        a.pickActivity('idle');
        if (a.currentActivity) a.task = a.currentActivity.desc;
      } else {
        a.setState('idle', '');
        a.pickActivity('idle');
        if (a.currentActivity) a.task = a.currentActivity.desc;
      }
    });
    this.startNPCTimers();
  }

  stop() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.demoInt) clearInterval(this.demoInt);
    this.stopNPCTimers();
  }

  get live() { return this.isLive; }

  private setMode(live: boolean) {
    if (this.isLive === live) return;
    this.isLive = live;
    const ind = document.getElementById('mode-indicator')!;
    const lbl = document.getElementById('mode-label')!;
    if (live) {
      ind.className = 'live'; lbl.textContent = 'LIVE';
      if (this.demoInt) { clearInterval(this.demoInt); this.demoInt = null; }
      this.startNPCTimers();
    } else {
      ind.className = 'demo'; lbl.textContent = 'DEMO';
      this.stopNPCTimers();
      if (!this.demoInt) this.demoInt = setInterval(() => this.demoTick(), 5000 + Math.random() * 3000);
    }
    this.onUpdate();
  }

  private demoTick() {
    const a = this.agents[Math.floor(Math.random() * this.agents.length)];
    const ts = DEMO_TASKS[a.id]; if (!ts) return;
    const i = this.demoIdx[a.id] || 0;
    const t = ts[i % ts.length];
    this.demoIdx[a.id] = (i + 1) % ts.length;
    a.setState(t.s, t.t || '');
    this.onUpdate();
  }

  private startNPCTimers() {
    for (const a of this.agents) {
      if (!a.isNPC) continue;
      const cycleTime = () => 30000 + Math.random() * 30000;
      const npcCycle = () => {
        const charActs = CHAR_ACTIVITIES[a.charKey];
        if (charActs) {
          const mode: 'working' | 'idle' = Math.random() < 0.3 ? 'working' : 'idle';
          a.pickActivity(mode);
          if (a.currentActivity) {
            a.agentState = 'relaxing';
            a.task = a.currentActivity.desc;
            a.stateStart = Date.now();
            a.log.unshift(a.currentActivity.desc);
            if (a.log.length > 5) a.log.pop();
          }
          this.onUpdate();
        }
        this.npcTimers[a.id] = setTimeout(npcCycle, cycleTime());
      };
      this.npcTimers[a.id] = setTimeout(npcCycle, 5000 + Math.random() * 25000);
    }
  }

  private stopNPCTimers() {
    for (const id of Object.keys(this.npcTimers)) {
      clearTimeout(this.npcTimers[id]);
      delete this.npcTimers[id];
    }
  }

  private applyState(data: any) {
    if (!data?.agents || data.lastUpdate <= this.lastUpdate) return;
    this.lastUpdate = data.lastUpdate;
    for (const id of Object.keys(data.agents)) {
      const ao = this.agents.find(a => a.id === id);
      if (!ao || ao.isNPC) continue;
      const inc = data.agents[id];
      const ns = inc.state || 'idle';
      let nt = inc.task || '';
      if ((!nt || nt === 'Working on something' || nt === 'Setting sail...') && inc.description) nt = inc.description;
      if ((!nt || nt === 'Working on something') && inc.label) nt = inc.label;
      if (!nt || nt === 'Working on something') nt = ns === 'working' ? 'Busy (no task details)' : 'Chilling';
      ao.realTask = nt;
      if (ao.agentState !== ns || ao.task !== nt) ao.setState(ns, nt);
    }
    this.onUpdate();
  }

  private async poll() {
    try {
      const r = await fetch('state.json?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (d.lastUpdate > 0) {
        this.failCount = 0;
        this.setMode(true);
        this.applyState(d);
      } else {
        this.failCount++;
        if (this.failCount >= 5) this.setMode(false);
      }
    } catch {
      this.failCount++;
      if (this.failCount >= 5) this.setMode(false);
    }
  }
}
