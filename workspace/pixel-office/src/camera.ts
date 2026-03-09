// ═══ CAMERA SYSTEM — zoom, pan, smooth animations ═══

export class Camera {
  // World position the camera is centered on
  x: number;
  y: number;
  zoom: number;
  
  // Animation targets
  private targetX: number;
  private targetY: number;
  private targetZoom: number;
  private animating = false;
  private animSpeed = 5; // lerp speed (higher = faster)
  
  // Zoom limits
  readonly minZoom = 0.5;
  readonly maxZoom = 4;
  
  // Viewport dimensions (updated on resize)
  viewW = 0;
  viewH = 0;
  
  // Click-to-zoom state
  private zoomedAgentId: string | null = null;
  private preZoomState: { x: number; y: number; zoom: number } | null = null;

  constructor(worldW: number, worldH: number) {
    this.x = worldW / 2;
    this.y = worldH / 2;
    this.zoom = 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetZoom = this.zoom;
  }

  /** Apply camera transform to context. Call before drawing world. */
  apply(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.viewW / 2, this.viewH / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  /** Restore context after drawing world. */
  restore(ctx: CanvasRenderingContext2D) {
    ctx.restore();
  }

  /** Convert screen coordinates to world coordinates. */
  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: (sx - this.viewW / 2) / this.zoom + this.x,
      y: (sy - this.viewH / 2) / this.zoom + this.y,
    };
  }

  /** Convert world coordinates to screen coordinates. */
  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: (wx - this.x) * this.zoom + this.viewW / 2,
      y: (wy - this.y) * this.zoom + this.viewH / 2,
    };
  }

  /** Zoom at a specific screen position (Google Maps style). */
  zoomAt(screenX: number, screenY: number, factor: number) {
    const worldBefore = this.screenToWorld(screenX, screenY);
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    
    // Adjust position so the world point under cursor stays at the same screen position
    this.zoom = newZoom;
    const worldAfter = this.screenToWorld(screenX, screenY);
    this.x -= (worldAfter.x - worldBefore.x);
    this.y -= (worldAfter.y - worldBefore.y);
    
    // Update targets to match (stop any ongoing animation)
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetZoom = this.zoom;
    this.animating = false;
    this.zoomedAgentId = null;
    this.preZoomState = null;
  }

  /** Smoothly animate to a world position and zoom level. */
  panTo(wx: number, wy: number, zoom?: number, speed?: number) {
    this.targetX = wx;
    this.targetY = wy;
    if (zoom !== undefined) this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    if (speed !== undefined) this.animSpeed = speed;
    this.animating = true;
  }

  /** Click-to-zoom on an agent. Returns true if zooming in, false if zooming out. */
  toggleAgentZoom(agentId: string, worldX: number, worldY: number): boolean {
    if (this.zoomedAgentId === agentId) {
      // Zoom back out
      if (this.preZoomState) {
        this.panTo(this.preZoomState.x, this.preZoomState.y, this.preZoomState.zoom, 6);
      }
      this.zoomedAgentId = null;
      this.preZoomState = null;
      return false;
    } else {
      // Save current state and zoom in
      if (!this.zoomedAgentId) {
        this.preZoomState = { x: this.x, y: this.y, zoom: this.zoom };
      }
      this.zoomedAgentId = agentId;
      const zoomLevel = Math.max(2, Math.min(3, this.maxZoom));
      this.panTo(worldX, worldY, zoomLevel, 6);
      return true;
    }
  }

  /** Update camera animation. Call each frame with dt in ms. */
  update(dt: number) {
    if (!this.animating) return;
    
    const t = 1 - Math.exp(-this.animSpeed * dt / 1000);
    this.x += (this.targetX - this.x) * t;
    this.y += (this.targetY - this.y) * t;
    this.zoom += (this.targetZoom - this.zoom) * t;
    
    // Stop when close enough
    const dx = Math.abs(this.targetX - this.x);
    const dy = Math.abs(this.targetY - this.y);
    const dz = Math.abs(this.targetZoom - this.zoom);
    if (dx < 0.1 && dy < 0.1 && dz < 0.001) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.zoom = this.targetZoom;
      this.animating = false;
    }
  }

  /** Set viewport dimensions. */
  resize(w: number, h: number) {
    this.viewW = w;
    this.viewH = h;
  }

  /** Get current zoom for display. */
  getZoomDisplay(): string {
    return `${this.zoom.toFixed(1)}x`;
  }
  
  get isZoomedOnAgent(): boolean {
    return this.zoomedAgentId !== null;
  }
  
  get zoomedAgent(): string | null {
    return this.zoomedAgentId;
  }
  
  /** Reset zoom state (e.g., when clicking elsewhere). */
  resetAgentZoom() {
    if (this.preZoomState) {
      this.panTo(this.preZoomState.x, this.preZoomState.y, this.preZoomState.zoom, 6);
    }
    this.zoomedAgentId = null;
    this.preZoomState = null;
  }
}
