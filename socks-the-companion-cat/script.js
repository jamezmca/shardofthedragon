/*
 * SOCKS — THE COMPANION CAT
 * =========================
 * A cozy ambient pixel-art cat companion.
 *
 * HOW THE BEHAVIOR SYSTEM WORKS
 * ─────────────────────────────
 * The cat runs a state machine. Each state has:
 *   • a duration range (min/max ms) — see CONFIG.durations
 *   • a set of weighted next-state transitions — see STATE_TRANSITIONS
 *   • an animation loop (set of canvas-draw frames) — see ANIMATIONS
 *
 * The scheduler picks a duration, draws the matching animation in a loop,
 * then rolls the weighted transition table to choose what comes next.
 *
 * Sleep is the dominant long-form state (15–90+ min). Most activity states
 * are 2–20 min. Transitional states (stand, walk, resettle) are brief.
 *
 * WHERE TO TWEAK THINGS
 * ─────────────────────
 * • State durations        → CONFIG.durations
 * • Transition weights     → STATE_TRANSITIONS
 * • Movement distance      → CONFIG.movement
 * • Idle micro-event rates → CONFIG.idle
 * • Cat pixel art frames   → ANIMATIONS (each array of draw functions)
 * • Canvas / scale sizes   → CONFIG.sizes
 * • Audio                  → AUDIO section near bottom
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   CONFIG  — tweak everything from here
   ═══════════════════════════════════════════════════════════════════ */
const CONFIG = {
  // State duration ranges [min ms, max ms]
  durations: {
    sit:      [3 * 60e3,  12 * 60e3],
    watch:    [2 * 60e3,   8 * 60e3],
    loaf:     [5 * 60e3,  20 * 60e3],
    curl:     [5 * 60e3,  15 * 60e3],
    purr:     [3 * 60e3,  12 * 60e3],
    sleep:    [15 * 60e3, 90 * 60e3],
    stand:    [1500,       3000],
    walk:     [3000,       7000],
    resettle: [2000,       4000],
  },

  // Pixel canvas size (logical; CSS scales it)
  canvasSize: 64,

  // CSS classes and matching pixel widths for the four scale options
  sizes:    ['size-s', 'size-m', 'size-l', 'size-xl'],
  sizePx:   [128,       256,      400,      560],

  // Horizontal movement: how far (px, logical) a walk can shift position
  movement: {
    minSteps: 2,
    maxSteps: 6,
    stepPx:   4,         // logical pixels per step
    zonePad:  0.05,      // keep cat within 5%–95% of viewport width
  },

  // Idle micro-event probabilities (per scheduler tick, roughly every frame)
  idle: {
    blinkChance:       0.0015,   // chance per frame of triggering a blink
    earTwitchChance:   0.0003,
    tailFlickChance:   0.0004,
    headLiftChance:    0.0002,
    cursorGlanceChance: 0.00008, // only when awake and cursor is near
    cursorNearPx:      200,      // logical px distance considered "near"
  },

  // Purr audio fade time ms
  audio: {
    fadeIn:  2000,
    fadeOut: 2000,
  },
};

/* ═══════════════════════════════════════════════════════════════════
   STATE TRANSITIONS  — weighted next-state tables
   ═══════════════════════════════════════════════════════════════════ */
const STATE_TRANSITIONS = {
  sit:      [['sit',3], ['watch',2], ['loaf',2], ['curl',1], ['stand',1]],
  watch:    [['watch',2], ['sit',2], ['loaf',1], ['stand',1]],
  loaf:     [['loaf',3], ['sit',1], ['curl',2], ['sleep',2]],
  curl:     [['curl',2], ['purr',2], ['sleep',3]],
  purr:     [['purr',2], ['curl',2], ['sleep',2], ['sit',1]],
  sleep:    [['sleep',4], ['loaf',2], ['sit',1], ['curl',1]],
  stand:    [['walk',3], ['resettle',2]],
  walk:     [['resettle',1]],
  resettle: [['sit',2], ['loaf',2], ['curl',1]],
};

/* States in which purring audio is appropriate */
const PURR_STATES = new Set(['curl', 'purr', 'sleep']);

/* States considered "awake" for cursor / pet reactions */
const AWAKE_STATES = new Set(['sit', 'watch', 'loaf', 'curl', 'purr', 'stand', 'walk', 'resettle']);

/* ═══════════════════════════════════════════════════════════════════
   PALETTES  — cream Ragdoll + two alternates
   ═══════════════════════════════════════════════════════════════════ */
const PALETTES = [
  // 0: black & grey (default — dark charcoal with golden eyes)
  { body: '#3c3c3c', point: '#161616', eye: '#d4a818', nose: '#c47070', inner: '#2a1818' },
  // 1: classic Ragdoll (cream + grey-brown points)
  { body: '#f5ead8', point: '#9e8a7a', eye: '#8ab4d8', nose: '#e8a0a0', inner: '#f5ead8' },
  // 2: silver tabby
  { body: '#d8d8d0', point: '#606060', eye: '#90c080', nose: '#e8b0b0', inner: '#d8d8d0' },
  // 3: warm orange
  { body: '#f5c880', point: '#c06030', eye: '#70b070', nose: '#f0a0a0', inner: '#f5c880' },
];

/* Per-palette backgrounds chosen to contrast the cat colour.
   Tweak these to change the room feel for each coat. */
const PALETTE_THEME = [
  { dayBg: '#f0ebe0', nightBg: '#1a1a26', dayText: '#7a6a55', nightText: '#9a8ab0' }, // black cat  → warm cream
  { dayBg: '#8aaaba', nightBg: '#1a2535', dayText: '#3a5060', nightText: '#8090a8' }, // cream cat  → cool slate
  { dayBg: '#cfc4b0', nightBg: '#1e1a14', dayText: '#6a5a48', nightText: '#908070' }, // grey tabby → warm tan
  { dayBg: '#4e5e70', nightBg: '#0e1620', dayText: '#c0d0dc', nightText: '#8090a0' }, // orange cat → dark slate
];

function applyPaletteTheme() {
  // Background is always white; only update control text colour to match palette
  const t = PALETTE_THEME[paletteIndex] || PALETTE_THEME[0];
  document.documentElement.style.setProperty('--text', t.dayText);
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION FRAMES  — canvas pixel-art draw functions per state
   Each entry is an array of frame-draw functions: (ctx, pal) => void
   ═══════════════════════════════════════════════════════════════════ */

/* Utility: draw a filled pixel-art rectangle */
function px(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/* ── Shared body parts ─────────────────────────────────────────── */

function drawSittingBody(ctx, pal, eyeOpen = true, headTilt = 0) {
  const C = CONFIG.canvasSize;
  // Body (torso) — plump, centered
  px(ctx, pal.body,  20, 28, 24, 22);
  // Chest puff
  px(ctx, pal.body,  21, 26, 22, 6);
  // Back haunch
  px(ctx, pal.point, 20, 36, 6,  12);
  px(ctx, pal.point, 38, 36, 6,  12);
  // Front paws (tucked)
  px(ctx, pal.point, 22, 46, 7,  4);
  px(ctx, pal.point, 35, 46, 7,  4);
  // Paw toes suggestion
  px(ctx, pal.point, 22, 49, 2,  1);
  px(ctx, pal.point, 25, 49, 2,  1);
  px(ctx, pal.point, 35, 49, 2,  1);
  px(ctx, pal.point, 38, 49, 2,  1);
  // Tail curled beside body
  px(ctx, pal.point, 16, 38, 4, 12);
  px(ctx, pal.point, 16, 49, 8,  3);
  px(ctx, pal.point, 20, 49, 4,  2);
  // Head
  const hx = 19 + headTilt;
  px(ctx, pal.body,  hx,   10, 26, 20);
  // Ear left
  px(ctx, pal.point, hx,    8,  6,  6);
  px(ctx, pal.point, hx+1,  6,  4,  4);
  // Ear right
  px(ctx, pal.point, hx+20, 8,  6,  6);
  px(ctx, pal.point, hx+21, 6,  4,  4);
  // Face — darker mask around eyes
  px(ctx, pal.point, hx+5, 13,  16, 8);
  // Eyes
  if (eyeOpen) {
    px(ctx, pal.eye,   hx+6,  15, 4, 4);
    px(ctx, pal.eye,   hx+16, 15, 4, 4);
    // Pupils
    px(ctx, '#2a3a50', hx+7,  16, 2, 2);
    px(ctx, '#2a3a50', hx+17, 16, 2, 2);
    // Eye shine
    px(ctx, '#fff',    hx+8,  15, 1, 1);
    px(ctx, '#fff',    hx+18, 15, 1, 1);
  } else {
    // Closed eyes — tiny curved line
    px(ctx, pal.point, hx+6,  17, 4, 1);
    px(ctx, pal.point, hx+16, 17, 4, 1);
  }
  // Nose
  px(ctx, pal.nose,  hx+11, 20, 4, 3);
  // Whiskers
  px(ctx, '#d0c0a8', hx+2,  21, 8, 1);
  px(ctx, '#d0c0a8', hx+2,  23, 8, 1);
  px(ctx, '#d0c0a8', hx+16, 21, 8, 1);
  px(ctx, '#d0c0a8', hx+16, 23, 8, 1);
}

function drawLoafBody(ctx, pal, eyeOpen = false) {
  // Loaf — paws tucked, body rounder, lower
  px(ctx, pal.body,  18, 32, 28, 18);
  px(ctx, pal.body,  20, 30, 24, 8);
  // No visible paws — all tucked under
  px(ctx, pal.point, 18, 46, 28, 4);
  // Tail tip peaking beside
  px(ctx, pal.point, 14, 40, 4, 8);
  px(ctx, pal.point, 14, 47, 7, 3);
  // Head lower / settled
  px(ctx, pal.body,  20, 12, 24, 20);
  px(ctx, pal.point, 20,  8,  6,  8);
  px(ctx, pal.point, 38,  8,  6,  8);
  // Mask
  px(ctx, pal.point, 24, 16, 16, 8);
  if (eyeOpen) {
    px(ctx, pal.eye,   26, 18, 4, 3);
    px(ctx, pal.eye,   34, 18, 4, 3);
    px(ctx, '#2a3a50', 27, 19, 2, 2);
    px(ctx, '#2a3a50', 35, 19, 2, 2);
  } else {
    px(ctx, pal.point, 26, 20, 4, 1);
    px(ctx, pal.point, 34, 20, 4, 1);
  }
  px(ctx, pal.nose,  30, 25, 4, 3);
  px(ctx, '#d0c0a8', 20, 26, 8, 1);
  px(ctx, '#d0c0a8', 36, 26, 8, 1);
}

function drawCurlBody(ctx, pal, eyeOpen = false) {
  // Compact curl — head x=14-50 matches body x=14-50, no neck.
  // Floor at y≈52, ears at y=2 — matches sit/loaf visual height.

  // ── BODY — core x=14-50, y=28-48 ─────────────────────────────
  px(ctx, pal.body, 14, 28, 36, 20); // core
  px(ctx, pal.body, 16, 26, 32,  4); // top rounding
  px(ctx, pal.body, 16, 46, 32,  4); // bottom rounding y=46-50
  px(ctx, pal.body, 10, 32,  6, 14); // left end
  px(ctx, pal.body, 48, 30,  6, 18); // right end

  // Haunches — darker right ~40%
  px(ctx, pal.point, 38, 26, 16, 26);
  px(ctx, pal.point, 36, 28,  4, 22);

  // Tucked paws along base
  px(ctx, pal.point, 14, 48, 24,  4);

  // Tail wrapping right side, floor at y≈52
  px(ctx, pal.point, 52, 30,  4, 18);
  px(ctx, pal.point, 48, 46,  6,  4);
  px(ctx, pal.point, 28, 48, 22,  4);
  px(ctx, pal.point, 12, 48, 18,  3);
  px(ctx, pal.point, 10, 46,  4,  4);

  // ── HEAD — x=14-50, y=8-28, no neck ──────────────────────────
  px(ctx, pal.body, 14,  8, 36, 20); // head block
  px(ctx, pal.body, 16,  6, 32,  4); // top rounding y=6-10

  // Ears y=2-10
  px(ctx, pal.point, 17,  2,  8,  8);
  px(ctx, pal.point, 39,  2,  8,  8);

  // Face mask
  px(ctx, pal.point, 20, 13, 24,  8);

  // Eyes
  if (eyeOpen) {
    px(ctx, pal.eye,   21, 14,  8,  4);
    px(ctx, '#2a3a50', 22, 15,  5,  2);
    px(ctx, '#ffffff', 23, 14,  1,  1);
    px(ctx, pal.eye,   35, 14,  8,  4);
    px(ctx, '#2a3a50', 36, 15,  5,  2);
    px(ctx, '#ffffff', 37, 14,  1,  1);
  } else {
    px(ctx, '#aaaaaa', 21, 16,  8,  2);
    px(ctx, '#888888', 21, 18,  8,  1);
    px(ctx, '#aaaaaa', 35, 16,  8,  2);
    px(ctx, '#888888', 35, 18,  8,  1);
  }

  px(ctx, pal.nose,  27, 21, 10,  3);
  px(ctx, pal.point, 28, 24,  8,  1);

  // Whiskers both sides
  px(ctx, '#aaaaaa', 12, 20,  6,  1);
  px(ctx, '#aaaaaa', 46, 20,  6,  1);
  px(ctx, '#aaaaaa', 12, 22,  6,  1);
  px(ctx, '#aaaaaa', 46, 22,  6,  1);
}

function drawSleepBody(ctx, pal, b = 0) {
  // Sleeping: front-facing head at left with chin near floor, front paws forward,
  // body stretched right, tail lying flat with gentle tip curl. Floor y≈52.
  //
  // Body spans x=22-58. All darker markings are clipped to body bounds to
  // prevent floating blocks.

  // ── BODY — x=22-54 core, right end cap x=52-58 ────────────────
  px(ctx, pal.body, 22, 36+b, 30, 12); // core x=22-52, y=36-48
  px(ctx, pal.body, 24, 34+b, 26,  4); // top rounding x=24-50, y=34-38
  px(ctx, pal.body, 24, 48+b, 26,  4); // bottom rounding x=24-50, y=48-52
  px(ctx, pal.body, 50, 38+b,  8,  8); // right end cap x=50-58, y=38-46

  // Haunches — clipped entirely within body bounds
  px(ctx, pal.point, 38, 36+b, 12, 12); // x=38-50, y=36-48  (within core) ✓
  px(ctx, pal.point, 38, 34+b, 10,  4); // x=38-48, y=34-38  (within top rounding x=24-50) ✓
  px(ctx, pal.point, 36, 36+b,  4, 10); // left edge of haunch

  // ── FRONT PAWS — forward of head at floor level ────────────────
  px(ctx, pal.point,  2, 48+b, 22,  4); // paws x=2-24, y=48-52

  // ── TAIL — exits body bottom-right, lies flat, tip curls ───────
  // Connects visually to body's right end cap (x=50-58, y=38-46)
  px(ctx, pal.point, 50, 48+b, 10,  4); // tail flat on floor x=50-60, y=48-52
  px(ctx, pal.point, 56, 44+b,  4,  6); // tip curl x=56-60, y=44-50 (joins tail flat)

  // ── HEAD — wide flat blob, chin at floor, drawn over paw tops ──
  px(ctx, pal.body,  4, 32+b, 28, 16); // head x=4-32, y=32-48 (wide & low)
  px(ctx, pal.body,  6, 30+b, 24,  4); // top rounding y=30-34

  // Ears — moderate width, not too tall
  px(ctx, pal.point,  7, 24+b,  7,  6);
  px(ctx, pal.point, 20, 24+b,  7,  6);

  // Face mask — wide, in lower half of head
  px(ctx, pal.point,  8, 36+b, 20,  8);

  // Both eyes shut, spread wide to match broader face
  px(ctx, '#aaaaaa', 10, 38+b,  6,  2);
  px(ctx, '#888888', 10, 40+b,  6,  1);
  px(ctx, '#aaaaaa', 20, 38+b,  6,  2);
  px(ctx, '#888888', 20, 40+b,  6,  1);

  // Nose + mouth close to floor
  px(ctx, pal.nose,  15, 43+b,  6,  3);
  px(ctx, pal.point, 16, 46+b,  4,  1);

  // Whiskers both sides
  px(ctx, '#aaaaaa',  0, 41+b,  8,  1);
  px(ctx, '#aaaaaa',  0, 43+b,  8,  1);
  px(ctx, '#aaaaaa', 28, 41+b,  8,  1);
  px(ctx, '#aaaaaa', 28, 43+b,  8,  1);
}

function drawStandBody(ctx, pal) {
  // Standing — legs extended
  px(ctx, pal.body,  18, 24, 28, 22);
  px(ctx, pal.body,  20, 22, 24, 6);
  // Legs
  px(ctx, pal.point, 20, 44, 6, 10);
  px(ctx, pal.point, 38, 44, 6, 10);
  // Front legs
  px(ctx, pal.point, 22, 40, 5,  8);
  px(ctx, pal.point, 37, 40, 5,  8);
  // Paws
  px(ctx, pal.point, 20, 52, 8,  3);
  px(ctx, pal.point, 36, 52, 8,  3);
  // Tail up/out
  px(ctx, pal.point, 16, 26, 4, 20);
  px(ctx, pal.point, 12, 18, 4, 10);
  // Head — alert
  px(ctx, pal.body,  20, 8, 24, 18);
  px(ctx, pal.point, 20, 4,  6,  8);
  px(ctx, pal.point, 38, 4,  6,  8);
  px(ctx, pal.point, 24, 14, 16, 6);
  px(ctx, pal.eye,   26, 14, 4,  4);
  px(ctx, pal.eye,   34, 14, 4,  4);
  px(ctx, '#2a3a50', 27, 15, 2,  2);
  px(ctx, '#2a3a50', 35, 15, 2,  2);
  px(ctx, '#fff',    28, 14, 1,  1);
  px(ctx, '#fff',    36, 14, 1,  1);
  px(ctx, pal.nose,  29, 20, 4,  3);
  px(ctx, '#d0c0a8', 20, 21, 8,  1);
  px(ctx, '#d0c0a8', 36, 21, 8,  1);
}

/* ── Animation frame sets ──────────────────────────────────────── */
/* Each array element is called with (ctx, pal, blinkFlag, extras) */

const ANIMATIONS = {

  sit: [
    (ctx, pal, b) => drawSittingBody(ctx, pal, !b),
  ],

  watch: [
    (ctx, pal, b) => drawSittingBody(ctx, pal, !b, 0),
    (ctx, pal, b) => drawSittingBody(ctx, pal, !b, 0),
    (ctx, pal, b) => drawSittingBody(ctx, pal, !b, 1),   // slight glance right
    (ctx, pal, b) => drawSittingBody(ctx, pal, !b, -1),  // slight glance left
  ],

  loaf: [
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal, b) => drawLoafBody(ctx, pal, !b),         // rare slow blink
    (ctx, pal) => drawLoafBody(ctx, pal, false),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
  ],

  curl: [
    (ctx, pal) => drawCurlBody(ctx, pal, false),
  ],

  purr: [
    (ctx, pal) => drawCurlBody(ctx, pal, false),
    (ctx, pal) => drawCurlBody(ctx, pal, false),
    (ctx, pal) => drawCurlBody(ctx, pal, false),
  ],

  sleep: [
    (ctx, pal, _, breath) => drawSleepBody(ctx, pal, breath || 0),
  ],

  stand: [
    (ctx, pal) => drawStandBody(ctx, pal),
  ],

  walk: [
    (ctx, pal) => { drawStandBody(ctx, pal); px(ctx, pal.point, 22, 48, 8, 6); }, // step A
    (ctx, pal) => { drawStandBody(ctx, pal); px(ctx, pal.point, 34, 44, 8, 6); }, // step B
  ],

  resettle: [
    (ctx, pal) => drawStandBody(ctx, pal),
    (ctx, pal) => drawLoafBody(ctx, pal, false),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   STATE MACHINE CORE
   ═══════════════════════════════════════════════════════════════════ */

function weightedRandom(table) {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [state, w] of table) {
    r -= w;
    if (r <= 0) return state;
  }
  return table[table.length - 1][0];
}

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION RENDERER
   ═══════════════════════════════════════════════════════════════════ */

const canvas = document.getElementById('cat-canvas');
const ctx = canvas.getContext('2d');
const C = CONFIG.canvasSize;
canvas.width  = C;
canvas.height = C;

let paletteIndex = 0;
let pal = PALETTES[paletteIndex];

let blink = false;
let blinkTimer = 0;
const BLINK_DURATION = 150; // ms

let breathPhase = 0;  // 0..2PI for sleep breathing

// Micro-event overlay state
let earTwitch = false;
let tailFlick  = false;

function clearCanvas() {
  ctx.clearRect(0, 0, C, C);
}

function renderFrame(state, frameIdx) {
  clearCanvas();
  const frames = ANIMATIONS[state];
  if (!frames) return;
  const f = frames[frameIdx % frames.length];
  const breath = Math.round(Math.sin(breathPhase) * 1); // 0 or 1 px shift
  f(ctx, pal, blink, breath);

  // Ear twitch overlay
  if (earTwitch) {
    px(ctx, pal.point, 18, 6, 8, 4);
  }
  // Tail flick overlay (for sleep/curl)
  if (tailFlick && (state === 'sleep' || state === 'curl')) {
    px(ctx, pal.point, 46, 48, 6, 6);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MOVEMENT LOGIC
   ═══════════════════════════════════════════════════════════════════ */

let catX = 0.5; // 0..1, proportion of viewport width

function clampCatX() {
  const pad = CONFIG.movement.zonePad;
  catX = Math.max(pad, Math.min(1 - pad, catX));
}

function applyPosition() {
  const vw = window.innerWidth;
  const scaledW = CONFIG.sizePx[sizeIdx];
  const leftPx = catX * vw - scaledW / 2;
  const clampedLeft = Math.max(0, Math.min(vw - scaledW, leftPx));
  canvas.style.left = clampedLeft + 'px';

  const scale = scaledW / 64;
  const zzz = document.getElementById('zzz');
  zzz.style.left = (clampedLeft + 4 * scale) + 'px';
  zzz.style.bottom = (48 + scaledW - 2 * scale + 10) + 'px';
}

function doWalk(direction) {
  const steps = CONFIG.movement.minSteps +
    Math.floor(Math.random() * (CONFIG.movement.maxSteps - CONFIG.movement.minSteps + 1));
  const vw = window.innerWidth;
  const scaledW = CONFIG.sizePx[sizeIdx];
  const delta = (steps * CONFIG.movement.stepPx) / (vw - scaledW || vw);
  catX += direction * delta;
  clampCatX();
  applyPosition();
}

/* ═══════════════════════════════════════════════════════════════════
   BEHAVIOR SCHEDULER
   ═══════════════════════════════════════════════════════════════════ */

let currentState   = 'sit';
let stateEndTime   = 0;
let frameIdx       = 0;
let frameTimer     = 0;
const FRAME_RATE   = 600; // ms per animation frame (slow, cozy)

let paused = false;
let lastTime = 0;

// Track cursor
let cursorX = -9999;
let cursorY = -9999;
document.addEventListener('mousemove', e => { cursorX = e.clientX; cursorY = e.clientY; });

/* ═══════════════════════════════════════════════════════════════════
   DEV MODE  — enabled via ?dev=true in the URL
   ═══════════════════════════════════════════════════════════════════ */
const DEV_MODE = new URLSearchParams(window.location.search).get('dev') === 'true';
const DEV_STATE_MS = 8000; // ms per state in dev mode

if (DEV_MODE) {
  document.getElementById('dev-bar').classList.remove('hidden');
  document.getElementById('dev-next').addEventListener('click', () => {
    stateEndTime = 0; // force transition on next scheduler tick
  });
}

function updateDevBar(state) {
  if (!DEV_MODE) return;
  document.getElementById('dev-state').textContent = state;
}

function enterState(state) {
  currentState = state;
  frameIdx = 0;
  const [min, max] = CONFIG.durations[state];
  stateEndTime = performance.now() + (DEV_MODE ? DEV_STATE_MS : randBetween(min, max));

  // Walking: pick a direction
  if (state === 'walk') {
    walkDir = (Math.random() < 0.5) ? 1 : -1;
    walkDone = false;
  }

  updateAudio(state);
  updateZzz(state);
  updateDevBar(state);
}

let walkDir  = 1;
let walkDone = false;

function tick(now) {
  if (paused) { requestAnimationFrame(tick); return; }

  const dt = now - lastTime;
  lastTime = now;

  // Breathing phase (for sleep)
  breathPhase += dt * 0.0006; // ~0.6 rad/s → ~10s per breath cycle
  if (breathPhase > Math.PI * 2) breathPhase -= Math.PI * 2;

  // Blink logic
  if (blink) {
    blinkTimer -= dt;
    if (blinkTimer <= 0) blink = false;
  } else if (AWAKE_STATES.has(currentState) && Math.random() < CONFIG.idle.blinkChance) {
    blink = true;
    blinkTimer = BLINK_DURATION;
  }

  // Ear twitch
  if (earTwitch) {
    earTwitch = Math.random() > 0.02; // fades quickly
  } else if (Math.random() < CONFIG.idle.earTwitchChance) {
    earTwitch = true;
  }

  // Tail flick
  if (tailFlick) {
    tailFlick = Math.random() > 0.03;
  } else if (Math.random() < CONFIG.idle.tailFlickChance) {
    tailFlick = true;
  }

  // Cursor glance (only when awake, rare)
  if (AWAKE_STATES.has(currentState) && !blink &&
      Math.random() < CONFIG.idle.cursorGlanceChance) {
    const scaledW = CONFIG.sizePx[sizeIdx];
    const catPx   = parseInt(canvas.style.left  || '0') + scaledW / 2;
    if (Math.abs(cursorX - catPx) < CONFIG.idle.cursorNearPx) {
      blink = true;
      blinkTimer = BLINK_DURATION * 2;
    }
  }

  // Advance frame
  frameTimer -= dt;
  if (frameTimer <= 0) {
    frameTimer = FRAME_RATE;
    frameIdx++;

    // Walking movement
    if (currentState === 'walk' && !walkDone) {
      doWalk(walkDir);
      if (frameIdx >= CONFIG.movement.maxSteps) walkDone = true;
    }
  }

  // Render
  renderFrame(currentState, frameIdx);

  // State transition
  if (now >= stateEndTime) {
    const next = weightedRandom(STATE_TRANSITIONS[currentState]);
    enterState(next);
  }

  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════════════
   AUDIO HOOKS
   ═══════════════════════════════════════════════════════════════════
   To add real purring audio:
   1. Replace the AudioContext oscillator below with an <audio> element
      or AudioBuffer loaded from a .ogg/.mp3 file.
   2. Set audioEnabled = true initially if desired.
   The fade-in/fade-out logic is already wired.
*/

let audioCtx  = null;
let purrNode  = null;
let gainNode  = null;
let audioEnabled = false; // muted by default — unmuted on first user interaction
let audioUnlocked = false;

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function startPurr() {
  if (!audioEnabled) return;
  ensureAudioCtx();
  if (purrNode) return;
  // Synthetic purr: low oscillator + gentle LFO
  // REPLACE this block with a real audio buffer for a better sound
  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 28; // Hz — deep rumble
  const lfo = audioCtx.createOscillator();
  lfo.frequency.value = 25;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  osc.connect(filter);
  filter.connect(gainNode);
  lfo.start();
  osc.start();
  purrNode = { osc, lfo };
  gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + CONFIG.audio.fadeIn / 1000);
}

function stopPurr() {
  if (!purrNode || !gainNode) return;
  gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + CONFIG.audio.fadeOut / 1000);
  const node = purrNode;
  purrNode = null;
  setTimeout(() => { try { node.osc.stop(); node.lfo.stop(); } catch(e){} }, CONFIG.audio.fadeOut + 100);
}

function updateAudio(state) {
  if (PURR_STATES.has(state)) {
    startPurr();
  } else {
    stopPurr();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   ZZZ OVERLAY
   ═══════════════════════════════════════════════════════════════════ */
function updateZzz(state) {
  const zzz = document.getElementById('zzz');
  if (state === 'sleep') {
    zzz.classList.remove('hidden');
  } else {
    zzz.classList.add('hidden');
  }
}

/* ═══════════════════════════════════════════════════════════════════
   UI CONTROLS
   ═══════════════════════════════════════════════════════════════════ */


// Mouse (animal) cursor SVG — shown when hovering the cat canvas
const MOUSE_CURSOR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><ellipse cx='18' cy='20' rx='8' ry='7' fill='%23888'/><circle cx='12' cy='15' r='6' fill='%23888'/><ellipse cx='8.5' cy='9' rx='3' ry='3.5' fill='%23888'/><ellipse cx='8.5' cy='9' rx='1.8' ry='2.2' fill='%23f9a0b0'/><circle cx='11' cy='15' r='1.5' fill='%23111'/><circle cx='10.5' cy='14.5' r='0.5' fill='%23fff'/><path d='M26 22 Q31 19 31 25 Q31 30 27 29' stroke='%23888' stroke-width='2' fill='none' stroke-linecap='round'/></svg>`;
canvas.style.cursor = `url("data:image/svg+xml,${MOUSE_CURSOR_SVG}") 11 15, pointer`;

// Heart balloon spawner
const HEART_COLORS = ['#ff6b8a','#ff4477','#ff8fb0','#e87aff','#ff7676','#f0a0c8'];

function spawnHeart(clientX, clientY) {
  const el = document.createElement('div');
  el.className = 'heart-balloon';
  el.textContent = '♥';
  const size = 13 + Math.random() * 14;
  el.style.fontSize = size + 'px';
  // Center the heart on the click point
  el.style.left = (clientX - size * 0.4) + 'px';
  el.style.top  = (clientY - size * 0.5) + 'px';
  el.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  const dur = 2.6 + Math.random() * 1.4;
  el.style.setProperty('--heart-dur', dur + 's');
  const swayDir = Math.random() > 0.5 ? 1 : -1;
  el.style.setProperty('--sway', swayDir * (6 + Math.random() * 18) + 'px');
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

canvas.addEventListener('click', e => {
  spawnHeart(e.clientX, e.clientY);
  // Tiny reaction: ear twitch or blink
  if (currentState === 'sleep') {
    earTwitch = true;
  } else {
    blink = true;
    blinkTimer = 300;
  }
});

// Size
let sizeIdx = 2; // default: large
function applySize() {
  CONFIG.sizes.forEach(s => canvas.classList.remove(s));
  canvas.classList.add(CONFIG.sizes[sizeIdx]);
  applyPosition();
}

document.getElementById('btn-size').addEventListener('click', () => {
  sizeIdx = (sizeIdx + 1) % CONFIG.sizes.length;
  const labels = ['S', 'M', 'L', 'XL'];
  document.getElementById('btn-size').textContent = labels[sizeIdx];
  applySize();
  saveSettings();
});

// Palette
document.getElementById('btn-palette').addEventListener('click', () => {
  paletteIndex = (paletteIndex + 1) % PALETTES.length;
  pal = PALETTES[paletteIndex];
  applyPaletteTheme();
  saveSettings();
});

// Pet the cat
document.getElementById('btn-pet').addEventListener('click', () => {
  if (currentState === 'sleep') {
    earTwitch = true;
    setTimeout(() => { earTwitch = false; }, 800);
  } else {
    const prev = currentState;
    blink = true;
    blinkTimer = 500;
    enterState('purr');
    setTimeout(() => { enterState(prev); }, randBetween(8000, 15000));
  }
});

// Apply initial palette theme
applyPaletteTheme();

/* ═══════════════════════════════════════════════════════════════════
   LOCALSTORAGE SETTINGS
   ═══════════════════════════════════════════════════════════════════ */
function saveSettings() {
  try {
    localStorage.setItem('socks_settings', JSON.stringify({
      sizeIdx, paletteIndex, audioEnabled, paused,
    }));
  } catch(e) {}
}

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('socks_settings') || '{}');
    if (s.sizeIdx      != null) sizeIdx      = s.sizeIdx;
    if (s.paletteIndex != null) { paletteIndex = s.paletteIndex; pal = PALETTES[paletteIndex]; }
    if (s.audioEnabled != null) audioEnabled = s.audioEnabled;
    if (s.paused       != null) paused       = s.paused;
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE RESIZE
   ═══════════════════════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  clampCatX();
  applyPosition();
});

/* ═══════════════════════════════════════════════════════════════════
   RADIATOR
   ═══════════════════════════════════════════════════════════════════ */

// Shared radiator canvas context, set once in initRadiator
let radCtx = null;
const RAD_W      = 28;
const RAD_H_BODY = 20;
const RAD_H_WAVE = 16; // logical pixels of heat-wave space above body
const RAD_H      = RAD_H_BODY + RAD_H_WAVE;

function initRadiator() {
  const el = document.getElementById('radiator');
  el.width  = RAD_W;
  el.height = RAD_H;
  radCtx = el.getContext('2d');

  const R = {
    rail:  '#5a3010',   // dark warm brown rail
    hiTop: '#d07828',   // hot copper top-face highlight
    hi:    '#ff9a42',   // left-edge highlight — hottest point
    mid:   '#e06820',   // ridge body — glowing orange
    sh:    '#8a3010',   // right-edge shadow
    grv:   '#d04808',   // groove — glimpse of hot pipe behind
    foot:  '#3a1a06',   // base foot
  };

  function rp(c, x, y, w, h) { radCtx.fillStyle = c; radCtx.fillRect(x, y, w, h); }
  const Y = RAD_H_WAVE; // body starts below the wave zone

  // ── top rail ────────────────────────────────────────────────
  rp(R.rail,  0, Y,   RAD_W, 3);
  rp(R.hiTop, 0, Y,   RAD_W, 1);

  // ── 5 ridges + 4 grooves (layout: 2 | 4|1|4|1|4|1|4|1|4 | 2 = 28)
  [2, 7, 12, 17, 22].forEach(rx => {
    rp(R.hi,  rx,   Y+3, 1, 14);
    rp(R.mid, rx+1, Y+3, 2, 14);
    rp(R.sh,  rx+3, Y+3, 1, 14);
  });
  [6, 11, 16, 21].forEach(gx => rp(R.grv, gx, Y+3, 1, 14));
  rp(R.sh, 0,  Y+3, 2, 14); // side margins
  rp(R.sh, 26, Y+3, 2, 14);

  // ── bottom rail ─────────────────────────────────────────────
  rp(R.rail, 0, Y+17, RAD_W, 3);
  rp(R.foot, 0, Y+19, RAD_W, 1);
}

function animateRadiator() {
  if (!radCtx) return;

  // Clear only the heat-wave zone above the body
  radCtx.clearRect(0, 0, RAD_W, RAD_H_WAVE);

  const t = performance.now() / 1000; // seconds

  // 4 sinusoidal wave lines at staggered heights, each drifting upward
  for (let w = 0; w < 4; w++) {
    const speed  = 1.4 + w * 0.15;                              // logical px / sec
    const offset = w * (RAD_H_WAVE / 4);                        // stagger start
    // baseY drifts 0 → RAD_H_WAVE, wraps; convert so it starts at bottom
    const progress = (t * speed + offset) % RAD_H_WAVE;
    const baseY    = (RAD_H_WAVE - 1) - progress;               // bottom = RAD_H_WAVE-1

    // Fade out as wave rises (opacity is highest near the radiator)
    const opacity = (baseY / (RAD_H_WAVE - 1)) * 0.52;
    if (opacity < 0.02) continue;

    const phase = w * 1.6 + t * 0.25; // slowly shift the wave shape over time
    radCtx.fillStyle = `rgba(255,120,28,${opacity.toFixed(2)})`;

    for (let x = 0; x < RAD_W; x++) {
      // Sinusoidal horizontal wobble: amplitude ±1.4 logical px
      const sinY = Math.sin(x * 0.46 + phase) * 1.4;
      const py   = Math.round(baseY + sinY);
      if (py >= 0 && py < RAD_H_WAVE) {
        radCtx.fillRect(x, py, 1, 1);
      }
    }
  }

  requestAnimationFrame(animateRadiator);
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */
loadSettings();
applySize();
applyPaletteTheme();

// Sync button states from loaded settings
document.getElementById('btn-size').textContent = ['S','M','L','XL'][sizeIdx];

initRadiator();
animateRadiator();

catX = 0.45 + Math.random() * 0.2;
clampCatX();
applyPosition();
enterState('sit');
lastTime = performance.now();
requestAnimationFrame(tick);
