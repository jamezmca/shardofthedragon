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

  // CSS classes for the four scale options
  sizes: ['size-s', 'size-m', 'size-l', 'size-xl'],

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
  // Curled up — oval shape
  px(ctx, pal.body,  16, 30, 32, 24);
  px(ctx, pal.body,  18, 28, 28, 8);
  // Tail wraps around entire body
  px(ctx, pal.point, 14, 32, 4, 20);
  px(ctx, pal.point, 14, 50, 20, 4);
  px(ctx, pal.point, 32, 50, 16, 4);
  px(ctx, pal.point, 46, 38, 4, 16);
  // Head tucked down
  px(ctx, pal.body,  22, 20, 20, 16);
  px(ctx, pal.point, 22, 16,  5,  8);
  px(ctx, pal.point, 37, 16,  5,  8);
  px(ctx, pal.point, 25, 24, 12, 6);
  if (eyeOpen) {
    px(ctx, pal.eye,   27, 25, 3, 3);
    px(ctx, pal.eye,   33, 25, 3, 3);
  } else {
    px(ctx, pal.point, 27, 27, 4, 1);
    px(ctx, pal.point, 33, 27, 4, 1);
  }
  px(ctx, pal.nose, 30, 30, 4, 2);
}

function drawSleepBody(ctx, pal, breathOffset = 0) {
  // Flattened sleeping curl — slightly compressed
  const by = 2 + breathOffset;
  px(ctx, pal.body,  14, 32 + by, 36, 20);
  px(ctx, pal.body,  16, 30 + by, 32, 8);
  // Tail
  px(ctx, pal.point, 12, 34 + by, 4, 18);
  px(ctx, pal.point, 12, 50 + by, 22, 4);
  px(ctx, pal.point, 34, 50 + by, 16, 4);
  px(ctx, pal.point, 48, 40 + by, 4, 14);
  // Head resting flat
  px(ctx, pal.body,  20, 24 + by, 24, 14);
  px(ctx, pal.point, 20, 20 + by,  5,  8);
  px(ctx, pal.point, 39, 20 + by,  5,  8);
  // Closed eyes
  px(ctx, pal.point, 24, 29 + by, 5, 1);
  px(ctx, pal.point, 34, 29 + by, 5, 1);
  px(ctx, pal.nose,  29, 33 + by, 4, 2);
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
    (ctx, pal, b) => drawLoafBody(ctx, pal, !b),         // occasional eye open
  ],

  curl: [
    (ctx, pal) => drawCurlBody(ctx, pal, false),
  ],

  purr: [
    (ctx, pal) => drawCurlBody(ctx, pal, false),
    (ctx, pal) => drawCurlBody(ctx, pal, false),         // gentle breathing implied by frame swap
    (ctx, pal) => { drawCurlBody(ctx, pal, false); px(ctx,'#e8d8c0',28,18,8,2); }, // chest fluff puff
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
  const scaledW = parseInt(canvas.style.width || '128');
  const leftPx = catX * vw - scaledW / 2;
  canvas.style.left = Math.max(0, Math.min(vw - scaledW, leftPx)) + 'px';

  // Position zzz label
  const zzz = document.getElementById('zzz');
  zzz.style.left = (parseInt(canvas.style.left) + scaledW / 2 - 20) + 'px';
}

function doWalk(direction) {
  const steps = CONFIG.movement.minSteps +
    Math.floor(Math.random() * (CONFIG.movement.maxSteps - CONFIG.movement.minSteps + 1));
  const vw = window.innerWidth;
  const delta = (steps * CONFIG.movement.stepPx) / vw;
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

function enterState(state) {
  currentState = state;
  frameIdx = 0;
  const [min, max] = CONFIG.durations[state];
  stateEndTime = performance.now() + randBetween(min, max);

  // Walking: pick a direction
  if (state === 'walk') {
    walkDir = (Math.random() < 0.5) ? 1 : -1;
    walkDone = false;
  }

  updateAudio(state);
  updateZzz(state);
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
    const scaledW = parseInt(canvas.style.width || '128');
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

// Pause
document.getElementById('btn-pause').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('btn-pause').textContent = paused ? '▶' : '⏸';
  saveSettings();
});

// Mute
document.getElementById('btn-mute').addEventListener('click', () => {
  audioEnabled = !audioEnabled;
  document.getElementById('btn-mute').textContent = audioEnabled ? '🔊' : '🔇';
  if (audioEnabled) {
    ensureAudioCtx();
    updateAudio(currentState);
  } else {
    stopPurr();
  }
  saveSettings();
});

// Palette
document.getElementById('btn-palette').addEventListener('click', () => {
  paletteIndex = (paletteIndex + 1) % PALETTES.length;
  pal = PALETTES[paletteIndex];
  saveSettings();
});

// Pet the cat
document.getElementById('btn-pet').addEventListener('click', () => {
  if (currentState === 'sleep') {
    // Tiny sleepy reaction
    earTwitch = true;
    setTimeout(() => { earTwitch = false; }, 800);
  } else {
    // Awake positive reaction
    const prev = currentState;
    blink = true;
    blinkTimer = 500;
    // Brief purr state then return
    enterState('purr');
    setTimeout(() => { enterState(prev); }, randBetween(8000, 15000));
  }
});

/* ═══════════════════════════════════════════════════════════════════
   DAY / NIGHT MODE
   ═══════════════════════════════════════════════════════════════════ */
function applyDayNight() {
  const h = new Date().getHours();
  document.body.classList.toggle('night', h < 6 || h >= 20);
}
applyDayNight();
setInterval(applyDayNight, 5 * 60 * 1000);

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
   SUMMON SCREEN
   ═══════════════════════════════════════════════════════════════════ */

const SUMMON_SEQUENCE = 'psp psp psp';

function initSummonScreen() {
  const lettersDiv = document.getElementById('prompt-letters');

  // Build one <span> per character
  SUMMON_SEQUENCE.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'prompt-char' + (ch === ' ' ? ' prompt-space' : '');
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.dataset.index = i;
    lettersDiv.appendChild(span);
  });

  let typedIndex = 0;

  function lightUpChar(i) {
    const span = lettersDiv.querySelector(`[data-index="${i}"]`);
    if (!span) return;
    span.classList.add('lit', 'just-lit');
    span.addEventListener('animationend', () => span.classList.remove('just-lit'), { once: true });
  }

  function advanceSpaces() {
    while (typedIndex < SUMMON_SEQUENCE.length && SUMMON_SEQUENCE[typedIndex] === ' ') {
      lightUpChar(typedIndex);
      typedIndex++;
    }
  }

  document.addEventListener('keydown', function onKey(e) {
    if (typedIndex >= SUMMON_SEQUENCE.length) return;
    advanceSpaces();
    if (typedIndex >= SUMMON_SEQUENCE.length) { triggerSummon(); return; }

    if (e.key === SUMMON_SEQUENCE[typedIndex]) {
      lightUpChar(typedIndex);
      typedIndex++;
      advanceSpaces();
      if (typedIndex >= SUMMON_SEQUENCE.length) {
        document.removeEventListener('keydown', onKey);
        setTimeout(triggerSummon, 500);
      }
    }
  });
}

function triggerSummon() {
  const screen = document.getElementById('summon-screen');
  screen.classList.add('fade-out');

  setTimeout(() => {
    screen.style.display = 'none';
    // Reveal cat and controls
    const scene    = document.getElementById('scene');
    const controls = document.getElementById('controls');
    scene.classList.remove('hidden');
    controls.classList.remove('hidden');
    // Small delay so display:flex kicks in before opacity transition
    requestAnimationFrame(() => {
      scene.classList.add('visible');
      controls.classList.add('visible');
    });
    startCat();
  }, 1000);
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */
loadSettings();
applySize();

// Sync button states from loaded settings
document.getElementById('btn-mute').textContent  = audioEnabled ? '🔊' : '🔇';
document.getElementById('btn-pause').textContent = paused ? '▶' : '⏸';
document.getElementById('btn-size').textContent  = ['S','M','L','XL'][sizeIdx];

function startCat() {
  catX = 0.45 + Math.random() * 0.2;
  clampCatX();
  applyPosition();
  enterState('sit');
  lastTime = performance.now();
  requestAnimationFrame(tick);
}

// Build the summon screen; cat doesn't start until sequence is typed
initSummonScreen();
