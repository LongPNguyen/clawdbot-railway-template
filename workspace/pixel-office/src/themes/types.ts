// ═══ THEME INTERFACE ═══

import type { Agent } from '../agent';

export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  tileMap: number[][];
  roomMap: (string | null)[][];
  walkable: boolean[][];
  furniture: FurnitureItem[];
  
  /** Per-theme grid dimensions (defaults to global COLS/ROWS if undefined) */
  cols?: number;
  rows?: number;
  
  /** Build the tile map, room map, walkable grid, furniture list */
  init(): void;
  
  /** Draw the world background (ocean/sky, hull/building, deck/floor, furniture, masts, labels, etc.) */
  drawWorld(ctx: CanvasRenderingContext2D, time: number): void;
  
  /** Draw a single character sprite */
  drawCharacter(ctx: CanvasRenderingContext2D, agent: Agent, time: number): void;
  
  /** Draw effects on top (particles, clouds, seagulls) */
  drawEffects(ctx: CanvasRenderingContext2D, time: number): void;
  
  /** Draw screen-space overlay (day/night tinting). Called AFTER camera restore. */
  drawOverlay(ctx: CanvasRenderingContext2D, viewW: number, viewH: number, time: number): void;
}

export interface FurnitureItem {
  x: number; y: number; type: string; color: string;
}
