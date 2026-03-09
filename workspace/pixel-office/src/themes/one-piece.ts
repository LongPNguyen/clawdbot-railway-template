// ═══ ONE PIECE THOUSAND SUNNY THEME ═══

import type { Theme, FurnitureItem } from './types';
import type { Agent } from '../agent';
import { TILE, COLS, ROWS, COL, ZONE_THEMES, STATUS_COLORS, AGENT_IDENTITY, AGENT_DEFS } from '../config';
import { amb, gulls, clouds, waves, stars, getDayPhase, px, shade, type DayPhase } from '../effects';

export class OnePieceTheme implements Theme {
  id = 'one-piece';
  name = 'Thousand Sunny';
  backgroundColor = '#1868a8';
  tileMap: number[][] = [];
  roomMap: (string | null)[][] = [];
  walkable: boolean[][] = [];
  furniture: FurnitureItem[] = [];

  init() {
    const tm = this.tileMap, rm = this.roomMap, wk = this.walkable;
    for (let y = 0; y < ROWS; y++) {
      tm[y] = []; rm[y] = []; wk[y] = [];
      for (let x = 0; x < COLS; x++) { tm[y][x] = 11; rm[y][x] = null; wk[y][x] = false; }
    }
    const fT = (x1: number, y1: number, x2: number, y2: number, v: number, th?: string) => {
      for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++)
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) { tm[y][x] = v; if (th) rm[y][x] = th; }
    };

    // Hull shape
    fT(13,3,17,3,20);fT(12,4,18,4,20);fT(11,5,19,5,20);fT(10,6,20,6,20);fT(9,7,21,7,20);fT(8,8,22,8,20);
    fT(7,9,23,14,20);fT(5,15,25,18,20);fT(4,19,26,34,20);fT(4,35,26,40,20);
    fT(5,41,25,44,20);fT(6,45,24,46,20);fT(7,47,23,47,20);fT(8,48,22,48,20);
    // Bow
    fT(13,4,17,4,1);fT(12,5,18,5,1);fT(11,6,19,6,1);
    // Helm
    fT(10,7,20,7,1,'helm');fT(9,8,21,10,1,'helm');
    // Navigation
    fT(8,11,22,11,0);fT(8,11,8,14,0);fT(22,11,22,14,0);fT(8,14,22,14,0);
    fT(9,12,21,13,1,'navigation');fT(14,14,16,14,3);
    // Fore mast
    fT(6,15,24,18,1);
    // Grass
    fT(5,19,25,30,6);
    // Mid rooms
    fT(5,31,14,34,1);fT(16,31,25,34,1);fT(5,31,5,34,0);fT(14,31,14,34,0);
    fT(16,31,16,34,0);fT(25,31,25,34,0);fT(5,31,14,31,0);fT(16,31,25,31,0);
    fT(6,32,13,33,1,'aquarium');fT(17,32,24,33,1,'survey');
    fT(9,31,11,31,3);fT(20,31,22,31,3);
    // Lower rooms
    fT(5,35,13,40,1);fT(5,35,5,40,0);fT(13,35,13,40,0);fT(5,35,13,35,0);fT(5,40,13,40,0);fT(5,37,13,37,0);
    fT(6,36,12,36,1,'workshop');fT(6,38,12,39,1,'infirmary');
    fT(9,35,11,35,3);fT(9,37,11,37,3);fT(9,40,11,40,3);
    fT(17,35,25,40,1);fT(17,35,17,40,0);fT(25,35,25,40,0);fT(17,35,25,35,0);fT(17,40,25,40,0);fT(17,37,25,37,0);
    fT(18,36,24,36,1,'library');fT(18,38,24,39,1,'bath');
    fT(20,35,22,35,3);fT(20,37,22,37,3);fT(20,40,22,40,3);
    // Galley
    fT(14,38,16,43,1,'galley');fT(13,41,17,43,1,'galley');
    fT(13,41,13,43,0);fT(17,41,17,43,0);fT(13,43,17,43,0);fT(14,41,16,41,3);
    // Stern
    fT(7,44,23,47,1);fT(9,48,21,48,1);
    // Corridor
    fT(14,34,16,38,1);

    // Furniture
    const FL = this.furniture;
    const pF = (x: number, y: number, type: string, c?: string) => {
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        tm[y][x] = 4; FL.push({ x, y, type, color: c || '#708090' });
      }
    };
    pF(15,8,'helm','#b89050');
    pF(10,12,'nav_desk','#e89040');pF(11,12,'nav_desk','#e89040');pF(19,12,'map_table','#c89858');pF(20,12,'bookshelf_nav','#907838');pF(10,13,'treasure_chest','#e8a848');
    pF(15,16,'mast_base','#b89050');
    pF(7,20,'plant_sunny','#48b848');pF(23,20,'plant_sunny','#48b848');pF(7,29,'plant_sunny','#48b848');pF(23,29,'plant_sunny','#48b848');
    pF(5,21,'cannon','#505860');pF(25,21,'cannon','#505860');pF(5,28,'cannon','#505860');pF(25,28,'cannon','#505860');
    pF(15,26,'mast_base','#b89050');
    pF(7,32,'aquarium_tank','#40b8d8');pF(8,32,'aquarium_tank','#40b8d8');pF(12,32,'barrel','#a07838');
    pF(7,33,'bar_stool','#c09858');pF(8,33,'bar_stool','#c09858');
    pF(18,32,'telescope','#a0b0c0');pF(22,32,'bookshelf_nav','#907838');pF(23,32,'map_table','#c89858');pF(18,33,'chair','#c09858');
    pF(7,36,'workbench_f','#a08040');pF(8,36,'toolboard_f','#708898');pF(11,36,'cola_fridge','#40a8d8');
    pF(7,38,'medical_bed','#f0f0f0');pF(7,39,'medicine_shelf','#f0f0f0');pF(10,38,'medicine_shelf','#f0f0f0');pF(10,39,'herb_rack','#48a848');
    pF(19,36,'bookshelf_r','#604020');pF(20,36,'bookshelf_r','#604020');pF(23,36,'poneglyph','#505860');
    pF(19,38,'bath_tub','#e0d8d0');pF(19,39,'bath_tub','#e0d8d0');pF(23,38,'barrel','#a07838');
    pF(15,39,'stove','#505860');pF(15,42,'table_galley','#c8a060');pF(14,42,'barrel','#a07838');pF(16,42,'barrel','#a07838');
    pF(10,45,'cannon','#505860');pF(20,45,'cannon','#505860');
    pF(13,27,'weights','#505860');pF(17,27,'weights','#505860');

    // Build walkable grid
    const deskSet = new Set(AGENT_DEFS.map(d => `${d.deskPos.x},${d.deskPos.y}`));
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const t = tm[y][x];
      wk[y][x] = (t === 1 || t === 3 || t === 6);
      if (t === 4 && deskSet.has(`${x},${y}`)) wk[y][x] = true;
    }
  }

  // ─── WORLD DRAWING ───
  drawWorld(ctx: CanvasRenderingContext2D, time: number) {
    const phase = getDayPhase();
    this.drawOcean(ctx, time);
    this.drawStars(ctx, phase);
    this.drawCelestialBody(ctx, phase, time);
    this.drawClouds(ctx);
    this.drawHull(ctx);
    this.drawLionFigurehead(ctx);
    this.drawDeck(ctx);
    this.drawRailings(ctx);
    this.drawMasts(ctx, time);
    this.drawSlide(ctx);
    this.drawAdamTree(ctx, time);
    this.drawFurniture(ctx, time);
    this.drawRoomLabels(ctx);
    this.drawSeagulls(ctx, time);
  }

  drawEffects(ctx: CanvasRenderingContext2D, _time: number) {
    // Particles
    for (const p of amb.sparkP) px(ctx, p.x, p.y, p.size, p.size, p.col);
    for (const p of amb.steamP) px(ctx, p.x, p.y, p.size, p.size, `rgba(255,255,255,${p.life * 0.4})`);
    // Music notes for Brook
  }

  drawOverlay(ctx: CanvasRenderingContext2D, viewW: number, viewH: number, _time: number) {
    const phase = getDayPhase();
    if (phase.darkness <= 0.02 && phase.warmth <= 0.02) return;
    if (phase.darkness > 0.02) {
      ctx.fillStyle = `rgba(8,12,32,${phase.darkness * 0.45})`;
      ctx.fillRect(0, 0, viewW, viewH);
    }
    if (phase.warmth > 0.05) {
      ctx.fillStyle = `rgba(255,120,40,${phase.warmth * 0.12})`;
      ctx.fillRect(0, 0, viewW, viewH);
      const grad = ctx.createLinearGradient(0, 0, 0, viewH);
      grad.addColorStop(0, `rgba(255,140,60,0)`);
      grad.addColorStop(1, `rgba(255,100,30,${phase.warmth * 0.08})`);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, viewW, viewH);
    }
  }

  // ─── CHARACTER DRAWING (big section) ───
  drawCharacter(ctx: CanvasRenderingContext2D, a: Agent, time: number) {
    const bx = a.px, ty = a.py;
    const walking = a.fsmState === 'walking';
    const frame = a.wf;
    const bob = a.hBob, breath = Math.sin(a.breathP) * 0.3;
    const wc = frame % 4, wb = (wc === 1 || wc === 3) ? -0.5 : 0;
    const cy = ty + (walking ? wb : breath);
    const isFem = a.gender === 'female';
    const dir = a.dir;

    // Shadow
    px(ctx, bx + 3, ty + 14, 10, 2, 'rgba(0,0,0,0.15)');

    // ═══ LEGS ═══
    this.drawLegs(ctx, bx, cy, a, walking, wc);
    // ═══ BODY ═══
    this.drawBody(ctx, bx, cy, a, dir);
    // ═══ ACTIVITY ANIMATIONS ═══
    this.drawActivityAnim(ctx, bx, cy, ty, a, time);
    // ═══ HEAD ═══
    this.drawHead(ctx, bx, cy, a, bob, dir, isFem);
    // ═══ STATUS INDICATOR ═══
    this.drawStatusIndicator(ctx, bx, ty, a, time);
    // ═══ NAME LABEL ═══
    this.drawNameLabel(ctx, a);
    // ═══ ORB + SELECTION ═══
    this.drawOrb(ctx, a, time);
  }

  private drawLegs(ctx: CanvasRenderingContext2D, bx: number, cy: number, a: Agent, walking: boolean, wc: number) {
    if (a.hairStyle === 'chopper') {
      px(ctx, bx+5,cy+12,2,2,'#c89070');px(ctx, bx+9,cy+12,2,2,'#c89070');
      px(ctx, bx+5,cy+13.5,2,1,'#704020');px(ctx, bx+9,cy+13.5,2,1,'#704020');
    } else if (a.hairStyle === 'brook') {
      px(ctx, bx+6,cy+11,1,3,'#f0f0e8');px(ctx, bx+9,cy+11,1,3,'#f0f0e8');
      px(ctx, bx+5,cy+13,3,1,'#282838');px(ctx, bx+8,cy+13,3,1,'#282838');
    } else if (a.hairStyle === 'jinbe') {
      px(ctx, bx+4,cy+11,3,3,'#3868a8');px(ctx, bx+9,cy+11,3,3,'#3868a8');
      px(ctx, bx+4,cy+13,3,1,'#c8a060');px(ctx, bx+9,cy+13,3,1,'#c8a060');
    } else {
      const lc = a.hairStyle==='franky'?'#4880a0':a.hairStyle==='zoro'?'#384038':a.hairStyle==='sanji'?'#282828':a.hairStyle==='usopp'?'#8b6914':'#484050';
      const sc2 = a.hairStyle==='nami'?'#d08040':a.hairStyle==='robin'?'#6040a0':a.hairStyle==='luffy'?'#c83040':'#383028';
      if (walking) {
        const ll=wc===1?-1:wc===3?1:0, rl=wc===1?1:wc===3?-1:0;
        px(ctx,bx+5+ll,cy+11,2,3,lc);px(ctx,bx+9+rl,cy+11,2,3,lc);
        px(ctx,bx+4+ll,cy+13,3,1,sc2);px(ctx,bx+8+rl,cy+13,3,1,sc2);
      } else {
        px(ctx,bx+5,cy+11,2,3,lc);px(ctx,bx+9,cy+11,2,3,lc);
        px(ctx,bx+4,cy+13,3,1,sc2);px(ctx,bx+8,cy+13,3,1,sc2);
      }
    }
  }

  private drawBody(ctx: CanvasRenderingContext2D, bx: number, cy: number, a: Agent, dir: string) {
    const hs = a.hairStyle;
    if (hs === 'chopper') {
      px(ctx,bx+4,cy+6,8,6,'#c89070');px(ctx,bx+5,cy+6,6,5,shade('#c89070',10));
      px(ctx,bx+4,cy+6,8,1,'#e87888');
      px(ctx,bx+3,cy+7,1,3,'#c89070');px(ctx,bx+12,cy+7,1,3,'#c89070');
      px(ctx,bx+5,cy+8,6,3,a.color);
    } else if (hs === 'franky') {
      px(ctx,bx+3,cy+5,10,6,a.skinTone);
      px(ctx,bx+3,cy+5,2,6,'#e04040');px(ctx,bx+11,cy+5,2,6,'#e04040');
      px(ctx,bx+3,cy+5,10,1,'#d03030');
      px(ctx,bx+7,cy+7,2,1,'#4088d0');px(ctx,bx+6,cy+7.5,4,1,'#4088d0');px(ctx,bx+7,cy+8.5,2,1,'#4088d0');
      px(ctx,bx+1,cy+5,2,5,'#a0b0c0');px(ctx,bx+13,cy+5,2,5,'#a0b0c0');
      px(ctx,bx+5,cy+11,6,1,'#4088d0');
    } else if (hs === 'zoro') {
      px(ctx,bx+4,cy+6,8,5,a.skinTone);px(ctx,bx+4,cy+8,8,3,'#48a848');
      if (dir==='down'||dir==='left'){px(ctx,bx+2,cy+5,.5,7,'#808888');px(ctx,bx+2.5,cy+5,.5,7,'#606868');px(ctx,bx+3,cy+5,.5,7,'#909898');px(ctx,bx+1.5,cy+5,2,.8,'#c8a040');}
      px(ctx,bx+3,cy+6,1,4,a.skinTone);px(ctx,bx+12,cy+6,1,4,a.skinTone);
    } else if (hs === 'nami') {
      px(ctx,bx+4,cy+6,8,5,a.skinTone);
      px(ctx,bx+5,cy+6,3,2,'#e89040');px(ctx,bx+8,cy+6,3,2,'#e89040');px(ctx,bx+7,cy+6.5,2,1,a.skinTone);
      px(ctx,bx+4,cy+10,8,1.5,'#4868a8');px(ctx,bx+2,cy+9,2,1.5,'#c8a060');
      px(ctx,bx+3,cy+6,1,3,a.skinTone);px(ctx,bx+12,cy+6,1,3,a.skinTone);
    } else if (hs === 'robin') {
      px(ctx,bx+4,cy+6,8,5,'#6848a8');px(ctx,bx+6,cy+5.5,4,1,'#f0e8d0');
      px(ctx,bx+3,cy+6,1,4,'#6848a8');px(ctx,bx+12,cy+6,1,4,'#6848a8');
    } else if (hs === 'luffy') {
      px(ctx,bx+4,cy+6,8,5,a.skinTone);
      px(ctx,bx+4,cy+6,2,5,'#c83040');px(ctx,bx+10,cy+6,2,5,'#c83040');
      px(ctx,bx+5,cy+10,6,1.5,'#4868a8');
      px(ctx,bx+6,cy+7,.3,2,'#d0a0a0');px(ctx,bx+7,cy+7,.3,2.5,'#d0a0a0');
      px(ctx,bx+3,cy+6,1,4,a.skinTone);px(ctx,bx+12,cy+6,1,4,a.skinTone);
    } else if (hs === 'sanji') {
      px(ctx,bx+4,cy+6,8,5,'#282828');px(ctx,bx+5,cy+6,6,1,'#f0f0f0');
      px(ctx,bx+7,cy+7,2,4,'#282838');px(ctx,bx+7.5,cy+6.5,1,4,'#3858a8');
      px(ctx,bx+3,cy+6,1,4,'#282828');px(ctx,bx+12,cy+6,1,4,'#282828');
      px(ctx,bx+3,cy+10,1,1,a.skinTone);px(ctx,bx+12,cy+10,1,1,a.skinTone);
    } else if (hs === 'usopp') {
      px(ctx,bx+4,cy+6,8,5,'#8b6914');px(ctx,bx+5,cy+6,6,1,a.skinTone);
      px(ctx,bx+6,cy+7,1,3,'#c8a040');px(ctx,bx+9,cy+7,1,3,'#c8a040');
      px(ctx,bx+3,cy+6,1,4,a.skinTone);px(ctx,bx+12,cy+6,1,4,a.skinTone);
      if (dir==='down'){px(ctx,bx+2,cy+5,1,4,'#705020');px(ctx,bx+1.5,cy+5,2,1,'#705020');}
    } else if (hs === 'brook') {
      px(ctx,bx+5,cy+6,6,5,'#282838');px(ctx,bx+6,cy+6,4,1,'#f0f0f0');px(ctx,bx+7,cy+6.5,2,1,'#e04040');
      px(ctx,bx+4,cy+6,1,4,'#f0f0e8');px(ctx,bx+11,cy+6,1,4,'#f0f0e8');
      if (dir==='down'||dir==='right'){px(ctx,bx+12,cy+7,.5,6,'#c8a040');}
    } else if (hs === 'jinbe') {
      px(ctx,bx+3,cy+5,10,6,'#3868a8');px(ctx,bx+4,cy+5,8,1,'#e8c060');
      px(ctx,bx+6,cy+6,4,5,shade('#3868a8',15));px(ctx,bx+5,cy+8,2,2,'#e8c060');
      px(ctx,bx+2,cy+5,1,5,a.skinTone);px(ctx,bx+13,cy+5,1,5,a.skinTone);
    }
  }

  private drawActivityAnim(ctx: CanvasRenderingContext2D, bx: number, cy: number, ty: number, a: Agent, time: number) {
    if (a.fsmState !== 'active' || !a.currentActivity) return;
    const af = a.activityFrame, anim = a.currentActivity.anim;

    // Luffy activities
    if (anim==='goof'){const wave=Math.sin(time*6)*2;px(ctx,bx+1,cy+6+wave,2,1,a.skinTone);px(ctx,bx+13,cy+6-wave,2,1,a.skinTone);}
    else if(anim==='sit_figurehead'){const sf=Math.sin(time*1.5)*.5;px(ctx,bx+5,cy+12+sf,2,2,a.skinTone);px(ctx,bx+9,cy+12-sf,2,2,a.skinTone);}
    else if(anim==='swing_tree'){const swAng=Math.sin(time*2.5)*4;px(ctx,bx+6+swAng,cy-2,1,6,'#c8a040');px(ctx,bx+10+swAng,cy-2,1,6,'#c8a040');px(ctx,bx+5+swAng,cy+3,7,2,'#a07838');const legK=Math.sin(time*3)*1.5;px(ctx,bx+6+swAng,cy+5,2,2+legK,a.skinTone);px(ctx,bx+10+swAng,cy+5,2,2-legK,a.skinTone);}
    else if(anim==='fishing'){px(ctx,bx+13,cy+6,1,8,'#c8a060');px(ctx,bx+14,cy+5,.5,1,'#c8a060');px(ctx,bx+14,cy+6,.3,10,'rgba(200,200,200,0.6)');const bobF=Math.sin(time*2);px(ctx,bx+14,cy+16+bobF,1.5,1,'#e04040');}
    else if(anim==='eating'){const chomp=af%4<2?0:1;px(ctx,bx+1,cy+7,4,2+chomp,'#a06030');px(ctx,bx+0,cy+7,2,2,'#c89060');if(chomp)px(ctx,bx+6,cy+4,4,2,'#c04040');px(ctx,bx-1,cy+8,1,3,'#f0f0e0');}
    else if(anim==='running_deck'){const runP=af%4;const armL=runP<2?-2:1,armR=runP<2?1:-2;px(ctx,bx+1,cy+6+armL,2,1,a.skinTone);px(ctx,bx+13,cy+6+armR,2,1,a.skinTone);for(let i=0;i<3;i++){const sl=Math.sin(time*8+i*1.5);px(ctx,bx-3-i*3,cy+5+i*3+sl,3,.5,'rgba(255,255,255,0.2)');}}
    else if(anim==='napping_grass'){const zz1=Math.sin(time);ctx.font='bold 3px monospace';ctx.textAlign='left';ctx.fillStyle=`rgba(150,200,255,${.4+zz1*.15})`;ctx.fillText('z',bx+14,cy+2+zz1);ctx.fillStyle=`rgba(150,200,255,${.3})`;ctx.fillText('Z',bx+16,cy-1+zz1*.8);px(ctx,bx+4,cy+12,3,1,a.skinTone);px(ctx,bx+9,cy+12,3,1,a.skinTone);}
    else if(anim==='sliding'){const slideB=Math.sin(time*5);px(ctx,bx+2,cy+2+slideB,2,1,a.skinTone);px(ctx,bx+12,cy+2-slideB,2,1,a.skinTone);if(af%3===0){px(ctx,bx-2+Math.random()*4,cy-2+Math.random()*3,1,1,'#f8f080');px(ctx,bx+12+Math.random()*4,cy-1+Math.random()*3,1,1,'#f8f080');}}
    else if(anim==='captain_alert'){const fistBob=Math.sin(time*3)*.5;px(ctx,bx+13,cy+4+fistBob,2,2,a.skinTone);}
    else if(anim==='look_horizon'){px(ctx,bx+2,cy+2,3,1,a.skinTone);px(ctx,bx+1,cy+1,4,.5,a.skinTone);}
    // Zoro
    else if(anim==='sleeping'){const zz1=Math.sin(time*1.2);ctx.font='bold 3px monospace';ctx.textAlign='left';ctx.fillStyle=`rgba(150,200,255,${.4+zz1*.15})`;ctx.fillText('z',bx+14,cy+2+zz1);ctx.fillStyle=`rgba(150,200,255,${.3})`;ctx.fillText('Z',bx+16,cy-2+zz1);}
    else if(anim==='lazy_train'){const liftY=Math.sin(time*1.5)*2;px(ctx,bx+1,cy+7+liftY,2,1,a.skinTone);px(ctx,bx+0,cy+7+liftY,1.5,1.5,'#606870');}
    else if(anim==='napping'){const zFloat=Math.sin(time);ctx.font='bold 3px monospace';ctx.textAlign='left';ctx.fillStyle=`rgba(150,200,255,${.3+zFloat*.1})`;ctx.fillText('z',bx+13,cy+1+zFloat);}
    else if(anim==='intense_train'){const liftPhase=af%4;const ly=liftPhase<2?0:-2;px(ctx,bx+0,cy+6+ly,2,2,'#606870');px(ctx,bx+14,cy+6+ly,2,2,'#606870');px(ctx,bx+1,cy+6+ly,1,2,a.skinTone);px(ctx,bx+13,cy+6+ly,1,2,a.skinTone);if(liftPhase===3)px(ctx,bx+14,cy+2,1,2,'rgba(120,180,230,0.5)');}
    else if(anim==='sword_practice'){const swingPhase=Math.sin(time*4);px(ctx,bx+0,cy+4+swingPhase,1,6,'#c0c8d0');px(ctx,bx+0,cy+3+swingPhase,.5,.5,'#e8c060');px(ctx,bx+14,cy+4-swingPhase,1,6,'#c0c8d0');px(ctx,bx+14,cy+3-swingPhase,.5,.5,'#e8c060');px(ctx,bx+4,cy+4.5,8,.5,'#d0d8e0');}
    // Nami
    else if(anim==='lounging'){px(ctx,bx+13,cy+3,2,1,a.skinTone);}
    else if(anim==='casual_maps'){px(ctx,bx+1,cy+8,3,2,'#f0e8c0');px(ctx,bx+2,cy+8.5,1,.5,'#2878b8');}
    else if(anim==='active_nav'){px(ctx,bx+1,cy+8,4,2.5,'#f0e8c0');px(ctx,bx+11,cy+8,4,2.5,'#f0e8c0');px(ctx,bx+13,cy+6,2,2,'#c8a040');const pencilBob=Math.sin(time*3)*.5;px(ctx,bx+0,cy+7+pencilBob,1,3,'#e8c060');}
    else if(anim==='calculating'){px(ctx,bx+2,cy+9,2,1,a.skinTone);px(ctx,bx+1,cy+9,2,1,'#f0e8c0');}
    // Sanji
    else if(anim==='casual_cook'){const stir=Math.sin(time*2)*.5;px(ctx,bx+13,cy+8+stir,2,1,'#a0a8b0');}
    else if(anim==='smoking'){px(ctx,bx+4,cy+4,2,.3,'#f0f0e8');px(ctx,bx+3,cy+3.8,.5,.5,'#e88040');const smokeY=Math.sin(time*1.5);px(ctx,bx+2,cy+2+smokeY*.3,1,1,'rgba(200,200,200,0.2)');}
    else if(anim==='swooning'){const heartBob=Math.sin(time*3);px(ctx,bx+14,cy+heartBob,2,2,'#e87888');}
    else if(anim==='intense_cook'){px(ctx,bx+0,cy+7,3,1,'#a0a8b0');px(ctx,bx+13,cy+7,3,1,'#a0a8b0');const fireFlicker=Math.sin(time*8);px(ctx,bx+1,cy+9,2,1+fireFlicker*.3,'#e88040');px(ctx,bx+13,cy+9,2,1+fireFlicker*.3,'#e88040');if(af%4===0)px(ctx,bx+1,cy+5,1,1,'#e8c060');if(af%4===2)px(ctx,bx+14,cy+5,1,1,'#48a848');}
    else if(anim==='fire_cook'){const fireH=2+Math.sin(time*6);px(ctx,bx+6,cy+6,4,fireH,'rgba(232,128,64,0.4)');px(ctx,bx+7,cy+5,2,fireH+1,'rgba(248,200,64,0.3)');px(ctx,bx+13,cy+7,2,1,'#a0a8b0');}
    // Usopp
    else if(anim==='tinker'){px(ctx,bx+2,cy+9,2,1,a.skinTone);px(ctx,bx+1,cy+9,1.5,1,'#a0b0c0');}
    else if(anim==='fishing_usopp'){px(ctx,bx+13,cy+5,1,9,'#c8a060');px(ctx,bx+14,cy+5,.3,11,'rgba(200,200,200,0.5)');const bobU=Math.sin(time*1.8);px(ctx,bx+14,cy+16+bobU,1,1,'#48a848');}
    else if(anim==='storytelling'){const gesture=Math.sin(time*4)*2;px(ctx,bx+0,cy+6+gesture,2,1,a.skinTone);px(ctx,bx+14,cy+6-gesture,2,1,a.skinTone);}
    else if(anim==='build_weapons'){const hammerY=af%4<2?0:-2;px(ctx,bx+13,cy+7+hammerY,2,1,'#708898');px(ctx,bx+14,cy+6+hammerY,1,2,'#a07838');if(hammerY<0&&af%4===2){px(ctx,bx+12,cy+6,.5,.5,'#f0c060');px(ctx,bx+15,cy+7,.5,.5,'#f0c060');}px(ctx,bx+1,cy+9,3,2,'#505860');}
    else if(anim==='gadget_craft'){px(ctx,bx+1,cy+8,2,2,'#a0b0c0');px(ctx,bx+13,cy+8,2,2,'#a0b0c0');const gearAngle=time*3;px(ctx,bx+7+Math.cos(gearAngle),cy+9+Math.sin(gearAngle),1,1,'#c8a040');}
    // Chopper
    else if(anim==='playing'){const bounce=Math.abs(Math.sin(time*4))*2;px(ctx,bx+6,cy+10-bounce,4,2,a.skinTone);}
    else if(anim==='running_around'){const runPhase=af%4;const runOffset=runPhase<2?-1:1;px(ctx,bx+5+runOffset,cy+12,2,2,a.skinTone);px(ctx,bx+9-runOffset,cy+12,2,2,a.skinTone);}
    else if(anim==='eating_candy'){px(ctx,bx+1,cy+7,3,3,'#f0a8c8');px(ctx,bx+2,cy+10,1,2,'#c8a060');}
    else if(anim==='grind_medicine'){px(ctx,bx+1,cy+8,3,3,'#a0a8b0');const grindPhase=Math.sin(time*5);px(ctx,bx+2,cy+7+grindPhase*.3,1,3,'#808888');}
    else if(anim==='research_books'){px(ctx,bx+3,cy+8.5,10,2.5,'#c8b8e0');px(ctx,bx+8,cy+8.5,.3,2.5,'#a090b0');}
    // Robin
    else if(anim==='calm_reading'){px(ctx,bx+3,cy+8.5,5,2,'#382848');}
    else if(anim==='drinking_coffee'){px(ctx,bx+1,cy+8,2,2,'#f0f0f0');px(ctx,bx+1.5,cy+7,.5,.5,'#805020');const steamC=Math.sin(time*2);px(ctx,bx+1.5,cy+6+steamC*.3,.8,.8,'rgba(255,255,255,0.15)');}
    else if(anim==='observing'){px(ctx,bx+4,cy+8,8,1,a.skinTone);}
    else if(anim==='multi_research'){px(ctx,bx+0,cy+8,4,2,'#382848');px(ctx,bx+12,cy+8,4,2,'#604020');px(ctx,bx+5,cy+9,6,2,'#2868a8');}
    else if(anim==='poneglyph_study'){px(ctx,bx+3,cy+8.5,10,2.5,'#505860');const glow=.1+Math.sin(time*2)*.06;px(ctx,bx+3,cy+8.5,10,2.5,`rgba(100,160,200,${glow})`);}
    // Franky
    else if(anim==='cola_drink'){px(ctx,bx+1,cy+7,2,3,'#40a8d8');px(ctx,bx+1.5,cy+6.5,1,1,'#3090c0');}
    else if(anim==='maintenance'){const wrenchBob=Math.sin(time*2)*.5;px(ctx,bx+13,cy+7+wrenchBob,2,1,'#a0a8b0');}
    else if(anim==='super_pose'){px(ctx,bx+0,cy+5,2,1,a.skinTone);px(ctx,bx+14,cy+5,2,1,a.skinTone);}
    else if(anim==='welding'){px(ctx,bx+13,cy+8,2,2,'#a0b0c0');px(ctx,bx+14,cy+9,1,1,'#f0f8ff');if(af%3===0){for(let i=0;i<2;i++){const sx=bx+14+Math.random()*3-1,sy=cy+8+Math.random()*2;px(ctx,sx,sy,.5,.5,Math.random()>.5?'#f0c060':'#f0f0c0');}}}
    else if(anim==='heavy_hammer'){const hammerPhase=af%4;const hY2=hammerPhase<2?-3:0;px(ctx,bx+13,cy+6+hY2,2,3,'#708898');px(ctx,bx+12.5,cy+5+hY2,3,2,'#505860');}
    // Brook
    else if(anim==='play_music'){const vf=af%3;px(ctx,bx+2,cy+7,3,4,'#805020');px(ctx,bx+3,cy+7+vf*.2,1,3,'#c8a040');}
    else if(anim==='tea_time'){px(ctx,bx+2,cy+8,2,2,'#f0f0e8');px(ctx,bx+2.5,cy+7.5,1,.5,'#c0c0b8');}
    else if(anim==='composing'){px(ctx,bx+2,cy+8,6,3,'#f0e8d8');px(ctx,bx+3,cy+9,.5,.5,'#282838');px(ctx,bx+5,cy+8.5,.5,.5,'#282838');px(ctx,bx+6,cy+9.5,.5,.5,'#282838');const quillBob=Math.sin(time*3)*.3;px(ctx,bx+13,cy+7+quillBob,1,3,'#f0f0e8');}
    else if(anim==='intense_violin'){const ivf=af%4;px(ctx,bx+2,cy+6,3,5,'#805020');px(ctx,bx+3,cy+6+ivf*.8,1,4,'#c8a040');for(let i=0;i<2;i++){const nx2=bx+14+Math.sin(time*2+i*2)*3;const ny2=cy+2-i*3+Math.sin(time*1.5+i);px(ctx,nx2,ny2,1,1,`rgba(248,240,128,${.3-i*.1})`);};}
    // Jinbe
    else if(anim==='casual_steer'){px(ctx,bx+1,cy+8,2,1,a.skinTone);px(ctx,bx+13,cy+8,2,1,a.skinTone);}
    else if(anim==='watching_sea'){px(ctx,bx+2,cy+2,3,.5,a.skinTone);}
    else if(anim==='alert_helm'){px(ctx,bx+0,cy+7,2,2,a.skinTone);px(ctx,bx+14,cy+7,2,2,a.skinTone);}
    else if(anim==='focused_steer'){px(ctx,bx+0,cy+6,2,3,a.skinTone);px(ctx,bx+14,cy+6,2,3,a.skinTone);}
  }

  private drawHead(ctx: CanvasRenderingContext2D, bx: number, cy: number, a: Agent, bob: number, dir: string, isFem: boolean) {
    const hx = bx + 3.5, hy = cy + bob - 0.5;
    px(ctx, hx+3, hy+5, 3, 1.5, a.skinTone);

    const hs = a.hairStyle;
    // Head base
    if (hs === 'chopper') {
      px(ctx,hx+1,hy+1,7,5,a.skinTone);px(ctx,hx+.5,hy+2,8,3,a.skinTone);
      px(ctx,hx+1,hy-1,1,2,'#704020');px(ctx,hx+0,hy-2,1,1,'#704020');px(ctx,hx+2,hy-2,1,1,'#704020');
      px(ctx,hx+7,hy-1,1,2,'#704020');px(ctx,hx+6,hy-2,1,1,'#704020');px(ctx,hx+8,hy-2,1,1,'#704020');
      px(ctx,hx+1,hy-.5,7,2.5,'#e87888');px(ctx,hx+.5,hy+.5,8,1.5,'#e87888');
      px(ctx,hx+4,hy+.5,1,1.5,'#f0f0f0');px(ctx,hx+3.5,hy+1,2,.5,'#f0f0f0');
      if(dir!=='up')px(ctx,hx+3.5,hy+3.5,2,1.5,'#4088d0');
    } else if (hs === 'brook') {
      px(ctx,hx+1,hy+1,7,4.5,'#f0f0e8');px(ctx,hx+.5,hy+2,8,3,'#f0f0e8');
      px(ctx,hx,hy-2,9,3.5,'#181820');px(ctx,hx-.5,hy-1,10,2,'#181820');
      px(ctx,hx+1,hy-3,7,2,'#282830');px(ctx,hx+2,hy-4,5,2,'#181820');px(ctx,hx+1,hy-2.5,7,1,'#181820');
      px(ctx,hx+2,hy-3.5,5,.5,'#e8c060');
    } else if (hs === 'jinbe') {
      px(ctx,hx,hy+1,9,5,a.skinTone);px(ctx,hx-.5,hy+2,10,3,a.skinTone);
      px(ctx,hx+1,hy+.5,7,1.5,'#181828');
      px(ctx,hx-.5,hy+3,1,2,shade(a.skinTone,-15));px(ctx,hx+8.5,hy+3,1,2,shade(a.skinTone,-15));
    } else {
      px(ctx,hx+1,hy+1,7,4.5,a.skinTone);px(ctx,hx+.5,hy+2,8,3,a.skinTone);px(ctx,hx+2,hy+5,5,1,a.skinTone);
    }

    // Hair
    const hc = a.hair;
    if(hs==='nami'){px(ctx,hx+1,hy-.5,7,2.5,hc);px(ctx,hx+.5,hy+.5,8,1.5,hc);px(ctx,hx-.5,hy+1,1.5,4.5,hc);px(ctx,hx+8,hy+1,1.5,4.5,hc);px(ctx,hx+1,hy+1,2,1.5,hc);}
    else if(hs==='franky'){px(ctx,hx+1,hy-2,7,3.5,'#4088d0');px(ctx,hx+2,hy-3,5,2,'#4088d0');px(ctx,hx+3,hy-4,3,2,'#50a0e0');px(ctx,hx+3.5,hy-4.5,2,1,'#60b0f0');px(ctx,hx+.5,hy+1,1.5,2,'#4088d0');px(ctx,hx+7,hy+1,1.5,2,'#4088d0');if(dir!=='up'){px(ctx,hx+1,hy+1.5,3,1.5,'#181820');px(ctx,hx+5,hy+1.5,3,1.5,'#181820');px(ctx,hx+4,hy+1.8,1,.8,'#282830');}}
    else if(hs==='zoro'){px(ctx,hx+1,hy+.2,7,1.8,'#48a848');px(ctx,hx+.5,hy+.8,8,1,'#48a848');px(ctx,hx+2,hy-.2,2,.8,'#48a848');px(ctx,hx+5,hy-.3,2,.8,'#48a848');if(dir==='down'||dir==='right'){px(ctx,hx+.3,hy+3,.3,2,'#c8a040');px(ctx,hx+.1,hy+4.5,.5,.5,'#c8a040');px(ctx,hx+.1,hy+5,.5,.5,'#c8a040');}if(dir!=='up')px(ctx,hx+2,hy+1.5,.3,2.5,'#d0a0a0');}
    else if(hs==='robin'){px(ctx,hx+1,hy-.5,7,2.5,hc);px(ctx,hx+.5,hy+.5,8,1.5,hc);px(ctx,hx-.5,hy+1,1.5,5,hc);px(ctx,hx+8,hy+1,1.5,5,hc);px(ctx,hx+1,hy+1,2,1.5,hc);px(ctx,hx+6,hy+1,2,1.5,hc);px(ctx,hx+2,hy,5,1,'#c09050');}
    else if(hs==='luffy'){px(ctx,hx+1,hy-.2,7,2,hc);px(ctx,hx+.5,hy+.5,8,1.5,hc);px(ctx,hx,hy+.3,2,1.5,hc);px(ctx,hx+7,hy+.3,2,1.5,hc);px(ctx,hx+1,hy-1,2,1.2,hc);px(ctx,hx+4,hy-1.2,2,1.2,hc);px(ctx,hx+6,hy-.8,2,1,hc);px(ctx,hx,hy-2,9,2,'#e8c060');px(ctx,hx-1,hy-.5,11,1.2,'#c8a040');px(ctx,hx+1,hy-2.5,7,1.5,'#e8c060');px(ctx,hx+1,hy-1.2,7,.7,'#c83040');}
    else if(hs==='sanji'){px(ctx,hx+1,hy-.5,7,2.5,hc);px(ctx,hx+.5,hy+.5,8,1.5,hc);px(ctx,hx+3,hy,2,.8,shade(hc,15));px(ctx,hx+.5,hy+.5,3,3,hc);if(dir!=='up')px(ctx,hx+3.5,hy+4.5,2,.5,hc);}
    else if(hs==='usopp'){px(ctx,hx+1,hy-.5,7,2.5,hc);px(ctx,hx+.5,hy+.5,8,1.5,hc);px(ctx,hx-.5,hy+1,1.5,4,hc);px(ctx,hx+8,hy+1,1.5,4,hc);px(ctx,hx+1,hy,7,1,'#c8a040');px(ctx,hx+1,hy-.3,2,1,'#88c0d0');}

    // Face
    if(dir!=='up'){
      const ec = a.eyeColor;
      if(hs==='franky'){px(ctx,hx+3,hy+4,3,.5,'#a05030');px(ctx,hx+3.5,hy+4.3,2,.3,'#f0e0d0');}
      else if(hs==='chopper'){
        if(!a.isBlinking){px(ctx,hx+1.5,hy+2,2.5,2.2,'#fff');px(ctx,hx+5,hy+2,2.5,2.2,'#fff');const po=dir==='left'?-.3:dir==='right'?.3:0;px(ctx,hx+2+po,hy+2.3,2,1.5,ec);px(ctx,hx+5.5+po,hy+2.3,2,1.5,ec);px(ctx,hx+2.3+po,hy+2.6,1.3,1,'#181820');px(ctx,hx+5.8+po,hy+2.6,1.3,1,'#181820');px(ctx,hx+3+po,hy+2.2,.7,.7,'#fff');px(ctx,hx+6.5+po,hy+2.2,.7,.7,'#fff');}else{px(ctx,hx+2,hy+3,2,.4,'#282028');px(ctx,hx+5.5,hy+3,2,.4,'#282028');}px(ctx,hx+3.5,hy+5,2,.5,shade(a.skinTone,-25));
      }
      else if(hs==='brook'){px(ctx,hx+2,hy+2,2,1.5,'#181820');px(ctx,hx+5.5,hy+2,2,1.5,'#181820');px(ctx,hx+2.5,hy+4,4,.8,'#f0f0e8');for(let i=0;i<4;i++)px(ctx,hx+2.8+i,hy+4,.3,.8,'#d0d0c8');px(ctx,hx+4,hy+3,1,1,'#c0c0b8');}
      else if(hs==='jinbe'){if(!a.isBlinking){px(ctx,hx+2,hy+2.5,2,1.5,'#fff');px(ctx,hx+5.5,hy+2.5,2,1.5,'#fff');px(ctx,hx+2.5,hy+2.8,1,1,ec);px(ctx,hx+6,hy+2.8,1,1,ec);}else{px(ctx,hx+2.5,hy+3,1.5,.4,ec);px(ctx,hx+5.5,hy+3,1.5,.4,ec);}px(ctx,hx+3,hy+4.5,3,.6,shade(a.skinTone,-25));px(ctx,hx+.5,hy+4,1,.3,shade(a.skinTone,-12));px(ctx,hx+7.5,hy+4,1,.3,shade(a.skinTone,-12));}
      else if(hs==='usopp'){if(!a.isBlinking){px(ctx,hx+1.5,hy+2,2.5,2,'#fff');px(ctx,hx+5,hy+2,2.5,2,'#fff');const po=dir==='left'?-.3:dir==='right'?.3:0;px(ctx,hx+2+po,hy+2.2,1.8,1.5,ec);px(ctx,hx+5.5+po,hy+2.2,1.8,1.5,ec);px(ctx,hx+2.3+po,hy+2.5,1.2,1,'#181820');px(ctx,hx+5.8+po,hy+2.5,1.2,1,'#181820');}else{px(ctx,hx+2,hy+2.7,2,.5,ec);px(ctx,hx+5.5,hy+2.7,2,.5,ec);}px(ctx,hx+3.8,hy+3,1.4,2.5,shade(a.skinTone,-10));px(ctx,hx+4,hy+5,1,1,shade(a.skinTone,-18));px(ctx,hx+3,hy+5.5,3,.4,shade(a.skinTone,-20));}
      else if(hs==='sanji'){if(!a.isBlinking){px(ctx,hx+5,hy+2,2.5,2,'#fff');const po=dir==='left'?-.3:dir==='right'?.3:0;px(ctx,hx+5.5+po,hy+2.2,1.8,1.5,ec);px(ctx,hx+5.8+po,hy+2.5,1.2,1,'#181820');px(ctx,hx+5,hy+1.8,2.5,.3,'#e8c848');px(ctx,hx+7,hy+1.5,.8,.8,'#e8c848');}else{px(ctx,hx+5.5,hy+2.7,2,.5,ec);}px(ctx,hx+3.5,hy+4.2,2,.4,shade(a.skinTone,-22));px(ctx,hx+2,hy+4,2,.3,'#f0f0e8');px(ctx,hx+1.5,hy+3.8,.5,.5,'#e88040');px(ctx,hx+3.5,hy+4.5,2,.5,a.hair);}
      else{
        if(!a.isBlinking){px(ctx,hx+1.5,hy+2,2.5,2,'#fff');px(ctx,hx+5,hy+2,2.5,2,'#fff');const po=dir==='left'?-.3:dir==='right'?.3:0;px(ctx,hx+2+po,hy+2.2,1.8,1.5,ec);px(ctx,hx+5.5+po,hy+2.2,1.8,1.5,ec);px(ctx,hx+2.3+po,hy+2.5,1.2,1,'#181820');px(ctx,hx+5.8+po,hy+2.5,1.2,1,'#181820');px(ctx,hx+2.8+po,hy+2.2,.6,.6,'#fff');px(ctx,hx+6.3+po,hy+2.2,.6,.6,'#fff');if(isFem){px(ctx,hx+1.3,hy+1.8,2.8,.4,'#282028');px(ctx,hx+4.8,hy+1.8,2.8,.4,'#282028');}else{px(ctx,hx+1.5,hy+1.9,2.5,.3,'#282028');px(ctx,hx+5,hy+1.9,2.5,.3,'#282028');}}else{if(isFem){px(ctx,hx+1.8,hy+2.8,2,.4,'#282028');px(ctx,hx+5.3,hy+2.8,2,.4,'#282028');}else{px(ctx,hx+2,hy+2.7,2,.5,'#282028');px(ctx,hx+5.5,hy+2.7,2,.5,'#282028');}}
        px(ctx,hx+.8,hy+3.5,2,.8,a.blush);px(ctx,hx+6.2,hy+3.5,2,.8,a.blush);px(ctx,hx+4.2,hy+3.3,.6,.4,shade(a.skinTone,-18));
        if(hs==='luffy'){px(ctx,hx+2.5,hy+4,4,.6,shade(a.skinTone,-25));px(ctx,hx+3,hy+4.3,3,.3,'#f0e0d0');}else{px(ctx,hx+3.5,hy+4.2,2,.4,shade(a.skinTone,-22));}
        if(hs==='luffy'&&dir!=='up')px(ctx,hx+2,hy+3.8,.3,.8,'#c89090');
      }
    } else {
      px(ctx,hx+1,hy+1,7,4,a.hair);px(ctx,hx+.5,hy+2,8,2,a.hair);
      if(hs==='nami'||hs==='robin'||hs==='usopp'){px(ctx,hx-.5,hy+1,1.5,5,a.hair);px(ctx,hx+8,hy+1,1.5,5,a.hair);}
      if(hs==='luffy'){px(ctx,hx,hy-2,9,2,'#e8c060');px(ctx,hx-1,hy-.5,11,1.2,'#c8a040');}
      if(hs==='franky')px(ctx,hx+1,hy-2,7,3.5,'#4088d0');
      if(hs==='chopper')px(ctx,hx+1,hy-.5,7,2.5,'#e87888');
      if(hs==='brook'){px(ctx,hx,hy-2,9,3.5,'#181820');px(ctx,hx+2,hy-4,5,2,'#181820');}
    }
  }

  private drawStatusIndicator(ctx: CanvasRenderingContext2D, bx: number, ty: number, a: Agent, time: number) {
    if (a.isNPC) return;
    const dotColor = STATUS_COLORS[a.agentState] || '#98908c';
    const isWorking = a.agentState === 'working' || a.agentState === 'researching';

    if (isWorking) {
      const cx2 = bx + 8, cy3 = ty + 7;
      const glowPulse = .25 + Math.sin(time * 4) * .12;
      ctx.strokeStyle = `rgba(72,200,104,${glowPulse})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(cx2, cy3, 11, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(72,200,104,${glowPulse * 1.6})`;
      ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.arc(cx2, cy3, 9.5, 0, Math.PI * 2); ctx.stroke();

      // Spinning gear
      const gearX = bx + 14, gearY = ty - 4, gearR = 2.5, gAngle = time * 3;
      ctx.save(); ctx.translate(gearX, gearY); ctx.rotate(gAngle);
      ctx.fillStyle = 'rgba(72,200,104,0.85)';
      ctx.beginPath(); ctx.arc(0, 0, gearR * 0.6, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 6; i++) {
        const ta = i * Math.PI / 3;
        ctx.fillRect(Math.cos(ta) * gearR - 0.4, Math.sin(ta) * gearR - 0.4, 0.8, 0.8);
      }
      ctx.fillStyle = 'rgba(30,20,10,0.7)';
      ctx.beginPath(); ctx.arc(0, 0, gearR * 0.25, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Sparkles
      for (let i = 0; i < 3; i++) {
        const sparkAngle = time * 2.5 + i * Math.PI * 2 / 3;
        const sparkR = 12 + Math.sin(time * 4 + i) * 2;
        const sx = cx2 + Math.cos(sparkAngle) * sparkR;
        const sy = cy3 + Math.sin(sparkAngle) * sparkR;
        const sparkAlpha = .3 + Math.sin(time * 6 + i * 2) * .25;
        px(ctx, sx - .5, sy - .5, 1, 1, `rgba(72,200,104,${sparkAlpha})`);
      }
      px(ctx, bx + 6, ty + 16, 4, 2, dotColor);
      px(ctx, bx + 5, ty + 16.5, 6, 1, `rgba(72,200,104,${glowPulse})`);
    } else {
      px(ctx, bx + 7, ty + 16, 2, 2, dotColor);
    }
  }

  private drawNameLabel(ctx: CanvasRenderingContext2D, a: Agent) {
    ctx.textAlign = 'center';
    const labelX = a.px + 8;

    if (a.isNPC) {
      ctx.font = 'bold 1.8px monospace';
      ctx.fillStyle = 'rgba(168,144,200,0.6)';
      ctx.fillText(a.name, labelX, a.py + TILE + 2.5);
    } else {
      const ident = AGENT_IDENTITY[a.id];
      if (ident) {
        ctx.font = 'bold 2.2px monospace';
        ctx.fillStyle = '#f0e0c0';
        ctx.fillText(ident.short, labelX, a.py + TILE + 2.5);
        ctx.font = '1.5px monospace';
        ctx.fillStyle = 'rgba(200,160,64,0.7)';
        ctx.fillText(ident.agentRole, labelX, a.py + TILE + 5);
        ctx.font = '1.3px monospace';
        ctx.fillStyle = 'rgba(200,180,140,0.35)';
        ctx.fillText(a.name, labelX, a.py + TILE + 7.2);
        if (a.agentState === 'working' || a.agentState === 'researching') {
          const taskSnip = (a.realTask || a.task || '').substring(0, 22);
          if (taskSnip) {
            ctx.font = '1.3px monospace';
            ctx.fillStyle = 'rgba(72,200,104,0.55)';
            ctx.fillText(taskSnip + (taskSnip.length >= 22 ? '…' : ''), labelX, a.py + TILE + 9.5);
          }
        }
      } else {
        ctx.font = 'bold 2px monospace';
        ctx.fillStyle = a.color;
        ctx.fillText(a.name, labelX, a.py + TILE + 2.5);
      }
    }
  }

  private drawOrb(ctx: CanvasRenderingContext2D, a: Agent, time: number) {
    if (a.isNPC) return;
    const cx = a.px + 8;
    const orbColor = STATUS_COLORS[a.agentState] || '#98908c';
    const orbPulse = .6 + Math.sin(time * 3) * .3;
    const orbY = a.py - 6 + Math.sin(time * 2) * .8;
    const orbR = 2.5;
    const oR = parseInt(orbColor.slice(1, 3), 16) || 150;
    const oG = parseInt(orbColor.slice(3, 5), 16) || 144;
    const oB = parseInt(orbColor.slice(5, 7), 16) || 140;
    ctx.beginPath(); ctx.arc(cx, orbY, orbR * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${oR},${oG},${oB},${orbPulse * .25})`; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, orbY, orbR, 0, Math.PI * 2);
    ctx.fillStyle = orbColor; ctx.fill();
    ctx.beginPath(); ctx.arc(cx - .8, orbY - .8, orbR * .4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
  }

  // ─── WORLD ELEMENTS ───

  private drawOcean(ctx: CanvasRenderingContext2D, time: number) {
    const tm = this.tileMap;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      if (tm[y][x] === 11) {
        const wv = Math.sin(time * 1.5 + x * .3 + y * .2) * 8;
        const r = Math.floor(24 + wv), g = Math.floor(104 + wv), b = Math.floor(168 + wv * 0.5);
        px(ctx, x * TILE, y * TILE, TILE, TILE, `rgb(${r},${g},${b})`);
        if ((x * 7 + y * 13) % 11 === 0) {
          const wAlpha = .08 + Math.sin(time * 2 + x + y) * .04;
          px(ctx, x * TILE + 2, y * TILE + 4 + Math.sin(time + x) * .5, 8, 1, `rgba(144,208,240,${wAlpha})`);
        }
      }
    }
    for (const w of waves) {
      const wx = w.x + Math.sin(time * w.speed + w.phase) * 4;
      const wy = w.y * TILE + Math.sin(time * .8 + w.phase) * 3;
      const alpha = .1 + Math.sin(time + w.phase) * .05;
      px(ctx, wx, wy, w.len, 1.5, `rgba(180,220,248,${alpha})`);
    }
  }

  private drawStars(ctx: CanvasRenderingContext2D, phase: DayPhase) {
    if (phase.starAlpha <= 0) return;
    const tm = this.tileMap;
    for (const s of stars) {
      const tx = Math.floor(s.x / TILE), ty = Math.floor(s.y / TILE);
      if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) continue;
      if (tm[ty][tx] !== 11) continue;
      const twinkle = .3 + Math.sin(amb.time * s.twinkleSpeed + s.twinkleOffset) * .7;
      const alpha = phase.starAlpha * s.brightness * Math.max(0, twinkle);
      if (alpha < .02) continue;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${alpha * .15})`; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * .5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,248,255,${alpha})`; ctx.fill();
    }
  }

  private drawCelestialBody(ctx: CanvasRenderingContext2D, phase: DayPhase, time: number) {
    const cx2 = (COLS - 3) * TILE, baseY = 2 * TILE;
    const bodyY = baseY + (1 - Math.max(0, phase.sunAlt)) * 3 * TILE;
    if (phase.brightness > .15) {
      const sunAlpha = Math.min(1, phase.brightness * 1.5);
      const sunR = 4;
      ctx.beginPath(); ctx.arc(cx2, bodyY, sunR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,200,60,${sunAlpha * .12})`; ctx.fill();
      ctx.beginPath(); ctx.arc(cx2, bodyY, sunR * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,100,${sunAlpha * .25})`; ctx.fill();
      ctx.beginPath(); ctx.arc(cx2, bodyY, sunR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,180,${sunAlpha})`; ctx.fill();
      if (sunAlpha > .4) {
        for (let i = 0; i < 6; i++) {
          const ang = i * Math.PI / 3 + time * .15;
          const rx = Math.cos(ang) * sunR * 2.2, ry = Math.sin(ang) * sunR * 2.2;
          ctx.beginPath(); ctx.moveTo(cx2, bodyY); ctx.lineTo(cx2 + rx, bodyY + ry);
          ctx.strokeStyle = `rgba(255,220,100,${sunAlpha * .12})`;
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      }
    }
    if (phase.starAlpha > .1) {
      const moonAlpha = phase.starAlpha * .9;
      const moonR = 3.5;
      const moonX = (COLS - 5) * TILE;
      const moonY = baseY + Math.max(0, phase.sunAlt) * 2 * TILE;
      ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,200,240,${moonAlpha * .1})`; ctx.fill();
      ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,235,245,${moonAlpha})`; ctx.fill();
      const shadowOff = moonR * (phase.moonPhase < .5 ? (.5 - phase.moonPhase) * 2 : (phase.moonPhase - .5) * 2) * .8;
      ctx.beginPath(); ctx.arc(moonX + shadowOff, moonY, moonR * .95, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,30,60,${moonAlpha * .7})`; ctx.fill();
    }
  }

  private drawHull(ctx: CanvasRenderingContext2D) {
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      if (this.tileMap[y][x] === 20) {
        px(ctx, x * TILE, y * TILE, TILE, TILE, COL.hull);
        px(ctx, x * TILE, y * TILE, TILE, 1, COL.hullLight);
        px(ctx, x * TILE, y * TILE + TILE - 1, TILE, 1, COL.hullDark);
      }
    }
  }

  private drawLionFigurehead(ctx: CanvasRenderingContext2D) {
    const cx = 15 * TILE, cy = 1 * TILE;
    px(ctx,cx-16,cy-8,48,32,'#e8a830');px(ctx,cx-12,cy-14,40,20,'#e8a830');px(ctx,cx-8,cy-18,32,12,'#f0c040');
    px(ctx,cx-14,cy-6,8,6,'#f0c848');px(ctx,cx+20,cy-6,8,6,'#f0c848');
    px(ctx,cx-10,cy-12,6,6,'#f0c848');px(ctx,cx+18,cy-12,6,6,'#f0c848');
    px(ctx,cx-8,cy,32,20,'#f0c848');px(ctx,cx-4,cy-4,24,8,'#f8d860');
    px(ctx,cx-4,cy+4,6,5,'#fff');px(ctx,cx+12,cy+4,6,5,'#fff');
    px(ctx,cx-2,cy+5,3,3,'#302818');px(ctx,cx+14,cy+5,3,3,'#302818');
    px(ctx,cx-1,cy+4.5,1.5,1.5,'#fff');px(ctx,cx+15,cy+4.5,1.5,1.5,'#fff');
    px(ctx,cx+4,cy+10,8,4,'#c08020');
    px(ctx,cx,cy+15,16,3,'#b07020');px(ctx,cx+2,cy+15.5,12,1.5,'#f0e0c0');
    for(let i=0;i<5;i++){const angle=-Math.PI/2+(-0.5+i*0.25)*Math.PI;const rx=cx+8+Math.cos(angle)*24,ry=cy-8+Math.sin(angle)*18;px(ctx,rx-2,ry-2,4,6,'#f0c040');}
  }

  private drawDeck(ctx: CanvasRenderingContext2D) {
    const tm = this.tileMap, rm = this.roomMap;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const t = tm[y][x], fx = x * TILE, fy = y * TILE, room = rm[y][x];
      if (t === 0) {
        px(ctx, fx, fy, TILE, TILE, COL.cabin);
        px(ctx, fx, fy, TILE, 2, COL.cabinRoof);
        px(ctx, fx, fy + TILE - 1, TILE, 1, COL.cabinDark);
        if (room && ZONE_THEMES[room]) px(ctx, fx + 1, fy + 1, TILE - 2, TILE - 2, ZONE_THEMES[room].accent + '18');
      } else if (t === 1) {
        if (room && ZONE_THEMES[room]) {
          const th = ZONE_THEMES[room];
          px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? th.floor : th.floorAlt);
        } else px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? COL.deck : COL.deckAlt);
        if ((x * 7 + y * 13) % 5 === 0) { px(ctx, fx + 2, fy + 5, 10, .3, COL.deckGrain); px(ctx, fx + 4, fy + 11, 8, .3, COL.deckGrain); }
      } else if (t === 3) {
        px(ctx, fx, fy, TILE, TILE, COL.deckLight);
        px(ctx, fx + 2, fy + 2, TILE - 4, TILE - 4, COL.deck);
        px(ctx, fx, fy, 1, TILE, COL.cabinDark); px(ctx, fx + TILE - 1, fy, 1, TILE, COL.cabinDark);
      } else if (t === 4) {
        if (room && ZONE_THEMES[room]) {
          const th = ZONE_THEMES[room];
          px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? th.floor : th.floorAlt);
        } else px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? COL.deck : COL.deckAlt);
      } else if (t === 6) {
        px(ctx, fx, fy, TILE, TILE, (x + y) % 2 === 0 ? COL.grass : COL.grassAlt);
        if ((x * 3 + y * 7) % 5 === 0) { px(ctx, fx + 2, fy + 3, 1, 2.5, COL.grassDark); px(ctx, fx + 8, fy + 7, 1, 2.5, COL.grassDark); }
        if ((x * 11 + y * 3) % 7 === 0) px(ctx, fx + 5, fy + 5, 1, 1.5, COL.grassLight);
        if ((x * 13 + y * 17) % 23 === 0) { const fc = ['#f0a0b0', '#f8f080', '#a0d0f0', '#f0c0a0'][(x + y) % 4]; px(ctx, fx + 7, fy + 6, 2, 2, fc); }
      }
    }
  }

  private drawRailings(ctx: CanvasRenderingContext2D) {
    const tm = this.tileMap;
    for (let y = 6; y <= 48; y++) for (let x = 0; x < COLS; x++) {
      const t = tm[y]?.[x];
      if (t !== undefined && t >= 1 && t <= 6) {
        const left = x > 0 ? tm[y][x - 1] : 11;
        const right = x < COLS - 1 ? tm[y][x + 1] : 11;
        const up = y > 0 ? tm[y - 1][x] : 11;
        const down = y < ROWS - 1 ? tm[y + 1][x] : 11;
        if (left === 20 || left === 11) px(ctx, x * TILE - 1, y * TILE, 2, TILE, COL.railing);
        if (right === 20 || right === 11) px(ctx, (x + 1) * TILE - 1, y * TILE, 2, TILE, COL.railing);
        if (up === 20 || up === 11) px(ctx, x * TILE, y * TILE - 1, TILE, 2, COL.railing);
        if (down === 20 || down === 11) px(ctx, x * TILE, (y + 1) * TILE - 1, TILE, 2, COL.railing);
      }
    }
  }

  private drawMasts(ctx: CanvasRenderingContext2D, time: number) {
    const fmx = 15 * TILE + 4, fmy = 10 * TILE;
    px(ctx, fmx, fmy, 8, 7 * TILE, COL.mast); px(ctx, fmx + 2, fmy, 4, 7 * TILE, COL.mastDark);
    px(ctx, fmx - TILE * 3, fmy + TILE * 2, TILE * 7, 3, COL.mast);
    const fSway = Math.sin(time * .4) * 1.5;
    px(ctx, fmx - TILE * 2.5 + fSway, fmy + TILE * 2.5, TILE * 6, TILE * 3, COL.sail);

    const mmx = 15 * TILE + 4, mmy = 18 * TILE;
    px(ctx, mmx, mmy, 8, 10 * TILE, COL.mast); px(ctx, mmx + 2, mmy, 4, 10 * TILE, COL.mastDark);
    px(ctx, mmx - TILE * 4, mmy + TILE * 2, TILE * 9, 3, COL.mast);
    px(ctx, mmx - TILE * 3, mmy + TILE * 5, TILE * 7, 3, COL.mast);
    const mSway = Math.sin(time * .5) * 2;
    px(ctx, mmx - TILE * 3.5 + mSway * .3, mmy + TILE * 2.5, TILE * 8, TILE * 2.5, COL.sail);
    px(ctx, mmx - TILE * 2.5 + mSway * .5, mmy + TILE * 5.5, TILE * 6, TILE * 2.5, COL.sailShadow);

    // Jolly Roger
    const jx = mmx - TILE + mSway * .4, jy = mmy + TILE * 3;
    px(ctx, jx, jy, TILE * 2.5, TILE * 1.8, '#181818');
    px(ctx, jx + 6, jy + 3, 8, 6, '#f0f0f0'); px(ctx, jx + 5, jy + 5, 10, 3, '#f0f0f0');
    px(ctx, jx + 7, jy + 5, 2, 2, '#181818'); px(ctx, jx + 11, jy + 5, 2, 2, '#181818');
    px(ctx, jx + 5, jy + 2, 10, 2, '#e8c060'); px(ctx, jx + 4, jy + 3.5, 12, 1, '#c8a040');

    // Crow's nest
    px(ctx, mmx - 12, mmy - 4, 32, 6, COL.mast);
    px(ctx, mmx - 14, mmy - 5, 36, 2, COL.railing);
    px(ctx, mmx - 14, mmy + 1, 36, 2, COL.railing);

    // Flag
    const flagWave = Math.sin(time * 2) * 3;
    px(ctx, mmx + 2, mmy - 12, 1, 8, COL.mast);
    px(ctx, mmx + 4, mmy - 12 + flagWave * .2, TILE, TILE * .7, '#181818');
    px(ctx, mmx + 6, mmy - 11 + flagWave * .2, 4, 3, '#f0f0f0');
  }

  private drawSlide(ctx: CanvasRenderingContext2D) {
    const sx = 4 * TILE, sy = 22 * TILE;
    px(ctx, sx - 4, sy, 6, 5 * TILE, '#e8c060'); px(ctx, sx - 6, sy + 2, 4, 4.5 * TILE, '#d0a848');
    for (let i = 0; i < 5; i++) px(ctx, sx - 4 + i * .5, sy + i * TILE + 4, 5, TILE - 4, '#e8c060');
    px(ctx, sx - 7, sy, 2, 5 * TILE, '#c8a040'); px(ctx, sx + 1, sy, 2, 5 * TILE, '#c8a040');
    px(ctx, sx - 8, sy - 4, 14, 6, '#c09050');
  }

  private drawAdamTree(ctx: CanvasRenderingContext2D, time: number) {
    const tx = 25 * TILE + 4, ty = 24 * TILE;
    px(ctx, tx, ty, 8, 5 * TILE, '#906830'); px(ctx, tx + 2, ty, 4, 5 * TILE, '#a07838');
    px(ctx, tx - TILE * 2, ty - TILE, TILE * 5, 8, '#805828');
    px(ctx, tx - TILE, ty - TILE * 1.5, TILE * 3, 6, '#805828');
    px(ctx, tx - TILE * 3, ty - TILE * 2.5, TILE * 7, TILE * 2, '#389838');
    px(ctx, tx - TILE * 2.5, ty - TILE * 3, TILE * 6, TILE * 1.5, '#48b848');
    px(ctx, tx - TILE * 2, ty - TILE * 3.5, TILE * 5, TILE, '#60d060');
    const swingAngle = Math.sin(time * 1.5) * 2;
    px(ctx, tx - TILE + swingAngle, ty - TILE, 1, TILE * 2 + 4, '#c8a040');
    px(ctx, tx + TILE * .5 + swingAngle, ty - TILE, 1, TILE * 2 + 4, '#c8a040');
    px(ctx, tx - TILE + swingAngle - 1, ty + TILE + 4, TILE * 1.5 + 2, 3, '#a07838');
  }

  private drawFurniture(ctx: CanvasRenderingContext2D, time: number) {
    for (const f of this.furniture) {
      const fx = f.x * TILE, fy = f.y * TILE;
      switch (f.type) {
        case 'helm': this.drawHelm(ctx, time); break;
        case 'nav_desk':
          px(ctx,fx,fy+6,TILE,6,'#c09858');px(ctx,fx+1,fy+6,TILE-2,1,'#c8a060');
          px(ctx,fx+2,fy,TILE-4,7,'#282838');px(ctx,fx+3,fy+1,TILE-6,4.5,'#304090');
          px(ctx,fx+4,fy+2,4,2,'#f0e8c0');px(ctx,fx+9,fy+2,3,2,'#2878b8');
          px(ctx,fx,fy+5.5,TILE,.5,f.color); break;
        case 'map_table':
          px(ctx,fx+1,fy+4,14,8,'#c09858');px(ctx,fx+2,fy+5,12,6,'#f0e8c0');
          px(ctx,fx+3,fy+6,4,2,'#2878b8');px(ctx,fx+8,fy+6,2,3,'#c8a060'); break;
        case 'treasure_chest':
          px(ctx,fx+2,fy+6,12,8,'#c8a040');px(ctx,fx+3,fy+6,10,1,'#d8b050');
          px(ctx,fx+2,fy+4,12,3,'#b89030');px(ctx,fx+6,fy+5,4,2,'#e8c848'); break;
        case 'bookshelf_nav':
          px(ctx,fx+1,fy,14,16,'#907838');
          for(let i=0;i<4;i++)px(ctx,fx+2+i*3,fy+1,2.5,3.5,['#2878b8','#c89828','#e07060','#48a848'][i]); break;
        case 'mast_base':
          px(ctx,fx+4,fy+2,8,12,COL.mast);px(ctx,fx+5,fy+2,6,12,COL.mastDark); break;
        case 'cannon':
          px(ctx,fx+3,fy+6,10,6,'#404850');px(ctx,fx+4,fy+7,8,4,'#505860'); break;
        case 'plant_sunny':
          px(ctx,fx+5,fy+8,6,6,'#805828');px(ctx,fx+5,fy+4,6,5,'#48b848');
          px(ctx,fx+4,fy+5,3,3,'#389838');px(ctx,fx+9,fy+5,3,3,'#389838'); break;
        case 'weights':
          px(ctx,fx+2,fy+6,12,4,'#505860');px(ctx,fx+6,fy+4,4,8,'#606870');
          px(ctx,fx+1,fy+7,3,2,'#404850');px(ctx,fx+12,fy+7,3,2,'#404850'); break;
        case 'aquarium_tank':
          px(ctx,fx,fy,TILE,TILE,'#88d0e8');px(ctx,fx+1,fy+1,TILE-2,TILE-2,'#70c0d8');
          {const fishY=Math.sin(time*2+fx)*.5;px(ctx,fx+4,fy+6+fishY,4,2,'#e89040');px(ctx,fx+8,fy+10-fishY,3,2,'#e04050');} break;
        case 'bar_stool':
          px(ctx,fx+4,fy+8,8,6,'#c09858');px(ctx,fx+5,fy+8,6,5,'#c8a060'); break;
        case 'telescope':
          px(ctx,fx+6,fy+2,4,12,'#a0b0c0');px(ctx,fx+4,fy,8,3,'#808890');px(ctx,fx+5,fy+1,6,1,'#c0d0e0'); break;
        case 'chair':
          px(ctx,fx+4,fy+6,8,8,'#c09858');px(ctx,fx+5,fy+6,6,7,'#c8a060'); break;
        case 'workbench_f':
          px(ctx,fx+1,fy+6,14,3,'#705030');px(ctx,fx+1,fy+5,14,1.5,'#806038');px(ctx,fx+4,fy+4,3,2,'#505860'); break;
        case 'toolboard_f':
          px(ctx,fx+1,fy+1,14,14,'#a05028');px(ctx,fx+2,fy+2,12,12,'#c8a060');
          px(ctx,fx+3,fy+3,1,4,'#a07838');px(ctx,fx+7,fy+3,1,5,'#a0a8b0'); break;
        case 'cola_fridge':
          px(ctx,fx+2,fy+2,12,12,'#40a8d8');px(ctx,fx+3,fy+3,10,10,'#3090c0');
          for(let i=0;i<3;i++)px(ctx,fx+5+i*2.5,fy+5,1.5,3,'#2070a0'); break;
        case 'medical_bed':
          px(ctx,fx+1,fy+6,14,8,'#f0f0f0');px(ctx,fx+2,fy+7,12,6,'#d8e0f0'); break;
        case 'medicine_shelf':
          px(ctx,fx+1,fy,14,16,'#f0f0f0');px(ctx,fx+1,fy+4,14,1,'#d0d0d0');
          {const bc2=['#e07060','#48a848','#4888d8','#e8c040','#a068c0'];for(let i=0;i<5;i++)px(ctx,fx+2+i*2.5,fy+1,2,3,bc2[i]);} break;
        case 'herb_rack':
          px(ctx,fx+2,fy+2,12,12,'#805830');for(let i=0;i<4;i++)px(ctx,fx+3+i*2.8,fy+3,2,4,'#48a848'); break;
        case 'bookshelf_r':
          px(ctx,fx+1,fy,14,16,'#604020');px(ctx,fx+1,fy+4,14,1,'#503018');px(ctx,fx+1,fy+9,14,1,'#503018');
          {const bc3=['#6848a8','#c83848','#2868a8','#c88828','#389838'];for(let i=0;i<5;i++)px(ctx,fx+2+i*2.3,fy+1,1.8,3,bc3[i]);} break;
        case 'poneglyph':
          px(ctx,fx+2,fy+2,12,12,'#404850');px(ctx,fx+3,fy+3,10,10,'#505860');
          for(let i=0;i<3;i++)for(let j=0;j<3;j++)px(ctx,fx+4+i*2.5,fy+4+j*2.5,1.5,.5,'#88a0b0');
          {const gp=Math.sin(time*1.5)*.08+.1;px(ctx,fx+2,fy+2,12,12,`rgba(100,160,200,${gp})`);} break;
        case 'bath_tub':
          px(ctx,fx+1,fy+2,14,12,'#e0d8d0');px(ctx,fx+2,fy+3,12,10,'#88c8d8'); break;
        case 'barrel':
          px(ctx,fx+3,fy+4,10,10,'#a07838');px(ctx,fx+4,fy+4,8,1,'#b88848');px(ctx,fx+3,fy+7,10,1,'#805828'); break;
        case 'stove':
          px(ctx,fx+2,fy+4,12,10,'#505860');px(ctx,fx+4,fy+5,3,3,'#303840');px(ctx,fx+9,fy+5,3,3,'#303840');
          {const fire=Math.sin(time*5)>.3;if(fire){px(ctx,fx+5,fy+6,1,1,'#e08040');px(ctx,fx+10,fy+6,1,1,'#e08040');}} break;
        case 'table_galley':
          px(ctx,fx+1,fy+6,14,2,'#c09858');px(ctx,fx,fy+5,16,1.5,'#c8a060');
          px(ctx,fx+4,fy+4,3,2,'#f0f0f0');px(ctx,fx+4.5,fy+4.5,2,1,'#e08040');
          px(ctx,fx+9,fy+4,3,2,'#f0f0f0');px(ctx,fx+9.5,fy+4.5,2,1,'#c83040'); break;
      }
    }
  }

  private drawHelm(ctx: CanvasRenderingContext2D, time: number) {
    const hx = 15 * TILE, hy = 8 * TILE;
    px(ctx, hx - 2, hy, 20, 16, '#a07838'); px(ctx, hx, hy + 2, 16, 12, '#c09858');
    px(ctx, hx + 6, hy + 6, 4, 4, '#a07838');
    for (let i = 0; i < 8; i++) {
      const ang = i * Math.PI / 4 + time * .2;
      const sx = Math.cos(ang) * 6, sy = Math.sin(ang) * 6;
      ctx.strokeStyle = '#a07838'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(hx + 8, hy + 8); ctx.lineTo(hx + 8 + sx, hy + 8 + sy); ctx.stroke();
    }
    px(ctx, hx + 7, hy + 7, 2, 2, '#c8a060');
    px(ctx, hx + TILE + 4, hy + 2, 4, 12, '#505860'); px(ctx, hx + TILE + 3, hy, 6, 3, '#e04040');
  }

  private drawRoomLabels(ctx: CanvasRenderingContext2D) {
    ctx.font = '2.2px monospace'; ctx.textAlign = 'center';
    const ls = [
      { t: 'HELM', x: 15, y: 9.5, c: 'rgba(232,144,64,0.3)' },
      { t: 'NAVIGATION', x: 15, y: 13.5, c: 'rgba(232,144,64,0.2)' },
      { t: 'GRASS DECK', x: 15, y: 24, c: 'rgba(72,184,72,0.18)' },
      { t: 'AQUARIUM BAR', x: 10, y: 33.5, c: 'rgba(64,184,216,0.2)' },
      { t: 'SURVEY ROOM', x: 21, y: 33.5, c: 'rgba(88,152,208,0.2)' },
      { t: 'WORKSHOP', x: 10, y: 36.5, c: 'rgba(64,168,216,0.2)' },
      { t: 'INFIRMARY', x: 10, y: 39, c: 'rgba(232,120,136,0.2)' },
      { t: 'LIBRARY', x: 21, y: 36.5, c: 'rgba(104,72,168,0.2)' },
      { t: 'BATH', x: 21, y: 39, c: 'rgba(232,192,96,0.2)' },
      { t: 'GALLEY', x: 15, y: 42.5, c: 'rgba(160,120,60,0.18)' },
      { t: 'STERN', x: 15, y: 46.5, c: 'rgba(160,120,60,0.12)' },
    ];
    for (const l of ls) { ctx.fillStyle = l.c; ctx.fillText(l.t, l.x * TILE, l.y * TILE); }
  }

  private drawSeagulls(ctx: CanvasRenderingContext2D, time: number) {
    for (const g of gulls) {
      const gx = g.x * TILE, gy = (g.y + Math.sin(g.yo + time) * .3) * TILE;
      const wy = Math.sin(g.wp + time * g.ws) * 2;
      px(ctx, gx, gy, 3, 1.5, '#f0f0f0');
      px(ctx, gx - 1.5, gy - 1 + wy * .5, 2.5, 1, '#f0f0f0');
      px(ctx, gx + 2, gy - 1 - wy * .5, 2.5, 1, '#f0f0f0');
      px(ctx, gx + 2.5, gy + .5, .8, .5, '#e8a040');
    }
  }

  private drawClouds(ctx: CanvasRenderingContext2D) {
    for (const c of clouds) {
      ctx.fillStyle = `rgba(255,252,248,${c.op})`;
      ctx.beginPath(); ctx.ellipse(c.x, c.y * TILE + c.h / 2, c.w / 2, c.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.x - c.w * .2, c.y * TILE + c.h * .4, c.w * .25, c.h * .3, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
}
