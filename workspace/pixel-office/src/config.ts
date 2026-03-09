// ═══ PIXEL OFFICE v14 — CONFIG & DATA ═══

export const TILE = 16;
export const COLS = 30;
export const ROWS = 50;
export const NATIVE_W = COLS * TILE; // 480
export const NATIVE_H = ROWS * TILE; // 800
export const MOVE_SPEED = 180;

// ─── COLORS ───
export const COL = {
  ocean: '#1868a8', oceanLight: '#2878b8', oceanDark: '#1058a0', oceanFoam: '#90d0f0',
  deck: '#c8a060', deckAlt: '#c09858', deckGrain: '#b89050', deckLight: '#d0a868',
  hull: '#a07030', hullDark: '#885820', hullLight: '#b88040',
  railing: '#d8b070', railingPost: '#b89050',
  grass: '#48b848', grassAlt: '#40a840', grassDark: '#389838', grassLight: '#60d060',
  mast: '#b89050', mastDark: '#a08040',
  sail: '#f0e8d8', sailShadow: '#e0d8c8',
  cabin: '#c09050', cabinDark: '#a07838', cabinRoof: '#c04830',
  flag: '#181818', flagSkull: '#f0f0f0',
  water: '#2080c0',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  working: '#48c868', idle: '#e8c040', collaborating: '#50b0c8',
  researching: '#5898d0', blocked: '#e07060', waiting_approval: '#e89858',
  offline: '#98908c', relaxing: '#a890c8',
};

export const ZONE_THEMES: Record<string, { floor: string; floorAlt: string; accent: string }> = {
  helm: { floor: '#c89858', floorAlt: '#c09050', accent: '#e89848' },
  navigation: { floor: '#c89858', floorAlt: '#c09050', accent: '#e89848' },
  galley: { floor: '#c8a870', floorAlt: '#c0a068', accent: '#e8a040' },
  infirmary: { floor: '#d8c8c0', floorAlt: '#d0c0b8', accent: '#e87888' },
  workshop: { floor: '#a0a8b0', floorAlt: '#98a0a8', accent: '#40a8d8' },
  survey: { floor: '#b8c0c8', floorAlt: '#b0b8c0', accent: '#5898d0' },
  library: { floor: '#b8a0c0', floorAlt: '#b098b8', accent: '#6848a8' },
  aquarium: { floor: '#90c8d8', floorAlt: '#88c0d0', accent: '#40b8d8' },
  bath: { floor: '#d8d0c8', floorAlt: '#d0c8c0', accent: '#e8c060' },
  training: { floor: '#c8a870', floorAlt: '#c0a068', accent: '#58a848' },
  mens: { floor: '#c0b0a0', floorAlt: '#b8a898', accent: '#a08060' },
  womens: { floor: '#d0b8c0', floorAlt: '#c8b0b8', accent: '#d090a0' },
};

// ─── AGENT DEFINITIONS ───
export interface AgentDef {
  id: string; name: string; role: string; gender: 'male' | 'female';
  color: string; accent: string; skinTone: string; hair: string;
  hairStyle: string; deskPos: { x: number; y: number }; room: string;
  theme: string; accessory: string; idleAnim: string; eyeColor: string;
  blush: string; outfit: string;
}

export const AGENT_DEFS: AgentDef[] = [
  { id: 'luffy', name: 'Luffy', role: 'Captain', gender: 'male',
    color: '#e04040', accent: '#f0c060', skinTone: '#f0c898', hair: '#181820',
    hairStyle: 'luffy', deskPos: { x: 15, y: 5 }, room: 'Figurehead', theme: 'helm',
    accessory: 'straw_hat', idleAnim: 'sit', eyeColor: '#282020',
    blush: 'rgba(230,100,80,0.2)', outfit: 'vest' },
  { id: 'printy', name: 'Nami', role: 'Navigator', gender: 'female',
    color: '#e89040', accent: '#f0c060', skinTone: '#f8d0a8', hair: '#e87828',
    hairStyle: 'nami', deskPos: { x: 15, y: 11 }, room: 'Navigation Room', theme: 'navigation',
    accessory: 'log_pose', idleAnim: 'map', eyeColor: '#885020',
    blush: 'rgba(230,100,80,0.3)', outfit: 'bikini_top' },
  { id: 'forge', name: 'Franky', role: 'Shipwright', gender: 'male',
    color: '#40a8d8', accent: '#f8d848', skinTone: '#f0c090', hair: '#4088d0',
    hairStyle: 'franky', deskPos: { x: 6, y: 35 }, room: "Usopp's Workshop", theme: 'workshop',
    accessory: 'cola', idleAnim: 'hammer', eyeColor: '#2060a0',
    blush: 'rgba(200,100,80,0.15)', outfit: 'hawaiian' },
  { id: 'sentinel', name: 'Zoro', role: 'First Mate', gender: 'male',
    color: '#389838', accent: '#303838', skinTone: '#f0c898', hair: '#48a848',
    hairStyle: 'zoro', deskPos: { x: 15, y: 27 }, room: "Crow's Nest", theme: 'training',
    accessory: 'swords', idleAnim: 'train', eyeColor: '#404040',
    blush: 'rgba(180,80,60,0.12)', outfit: 'haramaki' },
  { id: 'sanji', name: 'Sanji', role: 'Cook', gender: 'male',
    color: '#282828', accent: '#f0c060', skinTone: '#f0c898', hair: '#e8c848',
    hairStyle: 'sanji', deskPos: { x: 15, y: 40 }, room: 'Galley', theme: 'galley',
    accessory: 'cigarette', idleAnim: 'cook', eyeColor: '#4868a0',
    blush: 'rgba(220,100,100,0.15)', outfit: 'suit' },
  { id: 'usopp', name: 'Usopp', role: 'Sniper', gender: 'male',
    color: '#c8a040', accent: '#48a848', skinTone: '#d0a878', hair: '#181820',
    hairStyle: 'usopp', deskPos: { x: 24, y: 35 }, room: "Usopp's Workshop", theme: 'workshop',
    accessory: 'slingshot', idleAnim: 'tinker', eyeColor: '#302018',
    blush: 'rgba(200,120,80,0.15)', outfit: 'overalls' },
  { id: 'cipher', name: 'Chopper', role: 'Doctor', gender: 'male',
    color: '#e87888', accent: '#f0c8d0', skinTone: '#c89070', hair: '#905838',
    hairStyle: 'chopper', deskPos: { x: 6, y: 40 }, room: 'Infirmary', theme: 'infirmary',
    accessory: 'hat_chopper', idleAnim: 'read', eyeColor: '#402818',
    blush: 'rgba(240,120,120,0.35)', outfit: 'doctor' },
  { id: 'vanta', name: 'Robin', role: 'Archaeologist', gender: 'female',
    color: '#6848a8', accent: '#f0e8d0', skinTone: '#f0d0b0', hair: '#181820',
    hairStyle: 'robin', deskPos: { x: 24, y: 40 }, room: 'Library', theme: 'library',
    accessory: 'book', idleAnim: 'read_robin', eyeColor: '#3848a0',
    blush: 'rgba(200,100,120,0.2)', outfit: 'cowgirl' },
  { id: 'brook', name: 'Brook', role: 'Musician', gender: 'male',
    color: '#282838', accent: '#e8d8c0', skinTone: '#f0f0e8', hair: '#282838',
    hairStyle: 'brook', deskPos: { x: 8, y: 22 }, room: 'Grass Deck', theme: 'training',
    accessory: 'violin', idleAnim: 'music', eyeColor: '#181820',
    blush: 'rgba(0,0,0,0)', outfit: 'suit_brook' },
  { id: 'jinbe', name: 'Jinbe', role: 'Helmsman', gender: 'male',
    color: '#3868a8', accent: '#e8c060', skinTone: '#c8a8b8', hair: '#181828',
    hairStyle: 'jinbe', deskPos: { x: 22, y: 22 }, room: 'Grass Deck', theme: 'training',
    accessory: 'none', idleAnim: 'meditate', eyeColor: '#282838',
    blush: 'rgba(180,100,100,0.1)', outfit: 'kimono' },
];

export const NPC_IDS = new Set(['sanji', 'usopp', 'brook', 'jinbe']);
export const AGENT_LINKED_IDS = new Set(['luffy', 'printy', 'forge', 'sentinel', 'vanta', 'cipher']);

export const AGENT_TO_CHAR: Record<string, string> = {
  luffy: 'luffy', printy: 'nami', forge: 'franky', sentinel: 'zoro',
  sanji: 'sanji', usopp: 'usopp', cipher: 'chopper', vanta: 'robin',
  brook: 'brook', jinbe: 'jinbe',
};

export const AGENT_IDENTITY: Record<string, { agentName: string; agentRole: string; short: string }> = {
  luffy: { agentName: 'Meezy', agentRole: 'CEO', short: 'MEEZY' },
  printy: { agentName: 'Printy', agentRole: 'COO', short: 'PRINTY' },
  forge: { agentName: 'Forge', agentRole: 'Dev Lead', short: 'FORGE' },
  sentinel: { agentName: 'Sentinel', agentRole: 'Security', short: 'SENTINEL' },
  vanta: { agentName: 'Vanta', agentRole: 'Sales', short: 'VANTA' },
  cipher: { agentName: 'Cipher', agentRole: 'Research', short: 'CIPHER' },
};

// ─── ACTIVITY DEFINITIONS ───
export interface Activity {
  name: string; desc: string; anim: string; roamTo?: { x: number; y: number };
}

export const CHAR_ACTIVITIES: Record<string, { idle: Activity[]; working: Activity[] }> = {
  luffy: {
    idle: [
      { name: 'sitting_figurehead', desc: 'Sitting on the figurehead', anim: 'sit_figurehead', roamTo: { x: 15, y: 5 } },
      { name: 'swing_tree', desc: 'Swinging on the Adam tree!', anim: 'swing_tree', roamTo: { x: 23, y: 25 } },
      { name: 'fishing', desc: 'Fishing off the side of the ship', anim: 'fishing', roamTo: { x: 5, y: 21 } },
      { name: 'eating_meat', desc: 'Eating a big piece of meat!!', anim: 'eating', roamTo: { x: 15, y: 42 } },
      { name: 'goofing', desc: 'Goofing around on deck', anim: 'goof', roamTo: { x: 12, y: 24 } },
      { name: 'running_deck', desc: 'Running around the deck!', anim: 'running_deck', roamTo: { x: 18, y: 20 } },
      { name: 'napping_grass', desc: 'Napping on the grass', anim: 'napping_grass', roamTo: { x: 10, y: 26 } },
      { name: 'sliding', desc: 'Sliding down the slide! Whee!', anim: 'sliding', roamTo: { x: 5, y: 24 } },
    ],
    working: [
      { name: 'captain_alert', desc: 'Standing alert (Captain Mode)', anim: 'captain_alert' },
      { name: 'looking_horizon', desc: 'Looking at the horizon', anim: 'look_horizon' },
    ],
  },
  zoro: {
    idle: [
      { name: 'sleeping', desc: 'Sleeping... zzz', anim: 'sleeping' },
      { name: 'lazy_training', desc: 'Lazy one-arm pushups', anim: 'lazy_train' },
      { name: 'napping', desc: 'Napping against the mast', anim: 'napping' },
    ],
    working: [
      { name: 'intense_training', desc: 'Intense weight training!', anim: 'intense_train' },
      { name: 'sword_practice', desc: 'Three-sword practice', anim: 'sword_practice' },
    ],
  },
  nami: {
    idle: [
      { name: 'lounging', desc: 'Lounging on deck', anim: 'lounging' },
      { name: 'checking_maps', desc: 'Casually checking maps', anim: 'casual_maps' },
      { name: 'sunbathing', desc: 'Sunbathing', anim: 'sunbathing' },
    ],
    working: [
      { name: 'plotting_nav', desc: 'Actively plotting navigation', anim: 'active_nav' },
      { name: 'calculating', desc: 'Calculating course corrections', anim: 'calculating' },
    ],
  },
  sanji: {
    idle: [
      { name: 'casual_cooking', desc: 'Casual cooking', anim: 'casual_cook' },
      { name: 'smoking', desc: 'Smoking outside', anim: 'smoking' },
      { name: 'swooning', desc: 'Swooning over Nami-swan~', anim: 'swooning' },
    ],
    working: [
      { name: 'intense_cooking', desc: 'Intense cooking! Multiple pans!', anim: 'intense_cook' },
      { name: 'fire_cooking', desc: 'Flambé special!', anim: 'fire_cook' },
    ],
  },
  usopp: {
    idle: [
      { name: 'tinkering', desc: 'Tinkering with gadgets', anim: 'tinker' },
      { name: 'fishing', desc: 'Fishing with Luffy', anim: 'fishing_usopp' },
      { name: 'telling_stories', desc: 'Telling tall tales', anim: 'storytelling' },
    ],
    working: [
      { name: 'building_weapons', desc: 'Building weapons intensely!', anim: 'build_weapons' },
      { name: 'gadget_crafting', desc: 'Crafting special gadgets', anim: 'gadget_craft' },
    ],
  },
  chopper: {
    idle: [
      { name: 'playing', desc: 'Playing on deck!', anim: 'playing' },
      { name: 'running', desc: 'Running around happily', anim: 'running_around' },
      { name: 'cotton_candy', desc: 'Eating cotton candy', anim: 'eating_candy' },
    ],
    working: [
      { name: 'grinding_medicine', desc: 'Grinding medicine', anim: 'grind_medicine' },
      { name: 'researching', desc: 'Researching medical books', anim: 'research_books' },
    ],
  },
  robin: {
    idle: [
      { name: 'reading', desc: 'Calmly reading a book', anim: 'calm_reading' },
      { name: 'coffee', desc: 'Enjoying coffee', anim: 'drinking_coffee' },
      { name: 'observing', desc: 'Observing the crew', anim: 'observing' },
    ],
    working: [
      { name: 'multi_research', desc: 'Multiple books open, researching', anim: 'multi_research' },
      { name: 'poneglyph_study', desc: 'Studying poneglyph data', anim: 'poneglyph_study' },
    ],
  },
  franky: {
    idle: [
      { name: 'drinking_cola', desc: 'Drinking COLA!', anim: 'cola_drink' },
      { name: 'ship_maintenance', desc: 'Casual ship maintenance', anim: 'maintenance' },
      { name: 'posing', desc: 'SUPER pose!', anim: 'super_pose' },
    ],
    working: [
      { name: 'building', desc: 'Building with welding sparks!', anim: 'welding' },
      { name: 'hammering', desc: 'Heavy hammering!', anim: 'heavy_hammer' },
    ],
  },
  brook: {
    idle: [
      { name: 'playing_music', desc: 'Playing a cheerful tune', anim: 'play_music' },
      { name: 'drinking_tea', desc: 'Drinking tea... skull joke!', anim: 'tea_time' },
      { name: 'laughing', desc: 'Yohohoho!', anim: 'laughing' },
    ],
    working: [
      { name: 'composing', desc: 'Composing a new song', anim: 'composing' },
      { name: 'intense_violin', desc: 'Intense violin performance!', anim: 'intense_violin' },
    ],
  },
  jinbe: {
    idle: [
      { name: 'meditating', desc: 'Meditating peacefully', anim: 'meditating' },
      { name: 'casual_steering', desc: 'Casual steering', anim: 'casual_steer' },
      { name: 'watching_sea', desc: 'Watching the sea', anim: 'watching_sea' },
    ],
    working: [
      { name: 'alert_helm', desc: 'Alert at the helm!', anim: 'alert_helm' },
      { name: 'focused_steering', desc: 'Focused steering through storm', anim: 'focused_steer' },
    ],
  },
};

// ─── DEMO TASKS ───
export const DEMO_TASKS: Record<string, { s: string; t: string }[]> = {
  luffy: [
    { s: 'idle', t: 'Goofing around on deck' }, { s: 'idle', t: 'Sitting on the figurehead' },
    { s: 'idle', t: 'Fishing off the side' }, { s: 'working', t: 'Captain Mode - eyes on horizon!' },
    { s: 'idle', t: 'Eating a big piece of meat' }, { s: 'idle', t: '' },
  ],
  printy: [
    { s: 'working', t: 'Charting course to next island' }, { s: 'working', t: 'Calculating course corrections' },
    { s: 'idle', t: 'Lounging on deck' }, { s: 'idle', t: 'Casually checking maps' },
    { s: 'working', t: 'Counting treasure' }, { s: 'idle', t: 'Sunbathing' },
  ],
  forge: [
    { s: 'working', t: 'Welding repairs on the hull' }, { s: 'idle', t: 'Drinking COLA!' },
    { s: 'idle', t: 'SUPER pose!' }, { s: 'working', t: 'Heavy hammering on weapon' },
    { s: 'idle', t: 'Ship maintenance' }, { s: 'idle', t: '' },
  ],
  sentinel: [
    { s: 'working', t: 'Intense weight training!' }, { s: 'idle', t: 'Sleeping... zzz' },
    { s: 'working', t: 'Three-sword practice' }, { s: 'idle', t: 'Napping against the mast' },
    { s: 'idle', t: 'Lazy one-arm pushups' }, { s: 'working', t: 'Standing watch' },
  ],
  sanji: [
    { s: 'idle', t: 'Casual cooking' }, { s: 'idle', t: 'Smoking outside' },
    { s: 'working', t: 'Intense cooking! Multiple pans!' }, { s: 'idle', t: 'Swooning over Nami-swan~' },
    { s: 'working', t: 'Flambé special!' }, { s: 'idle', t: 'Smoking outside' },
  ],
  usopp: [
    { s: 'idle', t: 'Tinkering with gadgets' }, { s: 'idle', t: 'Fishing with Luffy' },
    { s: 'working', t: 'Building weapons intensely!' }, { s: 'idle', t: 'Telling tall tales' },
    { s: 'working', t: 'Crafting special gadgets' }, { s: 'idle', t: 'Tinkering with gadgets' },
  ],
  cipher: [
    { s: 'working', t: 'Grinding medicine' }, { s: 'idle', t: 'Playing on deck!' },
    { s: 'idle', t: 'Eating cotton candy' }, { s: 'working', t: 'Researching medical books' },
    { s: 'idle', t: 'Running around happily' }, { s: 'idle', t: '' },
  ],
  vanta: [
    { s: 'idle', t: 'Calmly reading a book' }, { s: 'working', t: 'Multiple books open, researching' },
    { s: 'idle', t: 'Enjoying coffee' }, { s: 'working', t: 'Studying poneglyph data' },
    { s: 'idle', t: 'Observing the crew' }, { s: 'idle', t: '' },
  ],
  brook: [
    { s: 'idle', t: 'Playing a cheerful tune' }, { s: 'idle', t: 'Drinking tea... skull joke!' },
    { s: 'working', t: 'Composing a new song' }, { s: 'idle', t: 'Yohohoho!' },
    { s: 'working', t: 'Intense violin performance!' }, { s: 'idle', t: 'Playing a cheerful tune' },
  ],
  jinbe: [
    { s: 'idle', t: 'Meditating peacefully' }, { s: 'idle', t: 'Casual steering' },
    { s: 'working', t: 'Alert at the helm!' }, { s: 'idle', t: 'Watching the sea' },
    { s: 'working', t: 'Focused steering through storm' }, { s: 'idle', t: 'Meditating peacefully' },
  ],
};
