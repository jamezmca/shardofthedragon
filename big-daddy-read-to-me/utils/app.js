const MessageTypes = {
  PRELOAD: 'PRELOAD',
  PRELOAD_DONE: 'PRELOAD_DONE',
  INFERENCE_REQUEST: 'INFERENCE_REQUEST',
  LOADING: 'LOADING',
  DOWNLOADING: 'DOWNLOADING',
  RESULT: 'RESULT',
  ERROR: 'ERROR',
};

const CACHE_KEY = 'bdrtm-kokoro-cached';

const VOICES = [
  { id: 'af_heart',    label: 'Heart — American female, warm' },
  { id: 'af_bella',    label: 'Bella — American female, expressive' },
  { id: 'af_sarah',    label: 'Sarah — American female, clear' },
  { id: 'af_sky',      label: 'Sky — American female, breathy' },
  { id: 'am_adam',     label: 'Adam — American male' },
  { id: 'am_michael',  label: 'Michael — American male' },
  { id: 'bf_emma',     label: 'Emma — British female' },
  { id: 'bf_isabella', label: 'Isabella — British female' },
  { id: 'bm_george',   label: 'George — British male' },
  { id: 'bm_lewis',    label: 'Lewis — British male' },
];

const voiceSelect = document.getElementById('voice-select');
const textInput = document.getElementById('text-input');
const fileInput = document.getElementById('file-input');
const speakBtn = document.getElementById('speak-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const outputDiv = document.getElementById('output');
const audioPlayer = document.getElementById('audio-player');
const downloadBtn = document.getElementById('download-btn');

for (const voice of VOICES) {
  const opt = document.createElement('option');
  opt.value = voice.id;
  opt.textContent = voice.label;
  voiceSelect.appendChild(opt);
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { textInput.value = e.target.result; };
  reader.onerror = () => { setStatus('Error reading file'); };
  reader.readAsText(file);
});

let worker = null;
let currentAudioUrl = null;

const spinnerEl = document.getElementById('spinner');

// ── Word ticker ───────────────────────────────────────────────────
const tickerEl = document.getElementById('word-ticker');
const TICKER_CLASSES = ['tw-past2','tw-past1','tw-cur','tw-next1','tw-next2'];
let tickerWords = [];
let tickerIdx = 0;
let tickerTarget = -1;
let tickerTimer = null;
let tickerChunkWordEnds = [];

// Mirror of chunkText in worker.js — keeps word-boundary mapping in sync.
function chunkTextForTicker(text, maxLen = 350) {
  const chunks = [];
  for (const para of text.split(/\n\n+/)) {
    const sentences = para.match(/[^.!?\n]+[.!?\n]*/g) || [para];
    let current = '';
    for (let sent of sentences) {
      sent = sent.trim();
      if (!sent) continue;
      if (current.length + sent.length + 1 > maxLen && current.length > 0) {
        chunks.push(current.trim()); current = sent;
      } else {
        current += (current ? ' ' : '') + sent;
      }
      while (current.length > maxLen) {
        const cut = current.lastIndexOf(' ', maxLen);
        if (cut <= 0) { chunks.push(current); current = ''; break; }
        chunks.push(current.slice(0, cut).trim());
        current = current.slice(cut + 1);
      }
    }
    if (current.trim()) chunks.push(current.trim());
  }
  return chunks.filter(c => c.length > 0);
}

function buildChunkWordEnds(text) {
  // Returns array where ends[i] = index of the last word belonging to chunk i.
  const ends = [];
  let total = 0;
  for (const chunk of chunkTextForTicker(text)) {
    total += chunk.split(/\s+/).filter(Boolean).length;
    ends.push(total - 1);
  }
  return ends;
}

function startWordTicker(text) {
  tickerWords = text.trim().split(/\s+/).filter(Boolean);
  tickerChunkWordEnds = buildChunkWordEnds(text);
  tickerIdx = 0;
  tickerTarget = -1;
  tickerEl.hidden = false;
  renderTicker();
  // Advance one word at a time toward tickerTarget; pauses naturally at chunk
  // boundaries until the next LOADING message advances the target.
  tickerTimer = setInterval(() => {
    if (tickerIdx < tickerTarget) { tickerIdx++; renderTicker(); }
  }, 100);
}

function setTickerTarget(idx) {
  tickerTarget = Math.min(Math.max(idx, 0), tickerWords.length - 1);
}

// Called on each LOADING chunk message.  chunk is 1-indexed.
// chunk K starting  →  chunks 0..K-2 are complete,  chunk K-1 is running.
function advanceTickerToChunk(chunk) {
  const K = chunk; // 1-indexed
  const ends = tickerChunkWordEnds;

  // Snap past all completed chunks (so we never show less progress than reality).
  const lastCompletedIdx = K - 2; // 0-indexed index of last completed chunk
  if (lastCompletedIdx >= 0 && ends[lastCompletedIdx] !== undefined) {
    tickerIdx = Math.max(tickerIdx, ends[lastCompletedIdx] + 1);
  }

  // Allow the ticker to animate through the current (running) chunk.
  const currentChunkIdx = K - 1; // 0-indexed
  const target = ends[currentChunkIdx] !== undefined
    ? ends[currentChunkIdx]
    : tickerWords.length - 1;
  setTickerTarget(target);
}

function renderTicker() {
  tickerEl.innerHTML = '';
  for (let offset = -2; offset <= 2; offset++) {
    const i = tickerIdx + offset;
    const span = document.createElement('span');
    span.textContent = (i >= 0 && i < tickerWords.length) ? tickerWords[i] : '\u00a0\u00a0\u00a0';
    span.className = (i >= 0 && i < tickerWords.length) ? TICKER_CLASSES[offset + 2] : 'tw-empty';
    tickerEl.appendChild(span);
  }
}

function stopWordTicker() {
  clearInterval(tickerTimer);
  tickerTimer = null;
  tickerEl.hidden = true;
  tickerEl.innerHTML = '';
  tickerWords = [];
  tickerIdx = 0;
  tickerTarget = -1;
  tickerChunkWordEnds = [];
}

function startDots(label) {
  statusText.textContent = label;
  spinnerEl.hidden = false;
}

function stopDots() {
  spinnerEl.hidden = true;
}

const isCached = localStorage.getItem(CACHE_KEY) === 'true';

if (isCached) {
  setStatus('Model ready');
} else {
  setStatus('Firing up engines...');
  speakBtn.disabled = true;
}

worker = createWorker();
worker.postMessage({ type: MessageTypes.PRELOAD });

speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) return;

  speakBtn.disabled = true;
  resetBtn.hidden = false;
  outputDiv.hidden = true;
  downloadBtn.hidden = false;
  downloadBtn.disabled = true;
  startDots('Synthesizing');
  startWordTicker(text);

  worker.postMessage({
    type: MessageTypes.INFERENCE_REQUEST,
    text,
    voice: voiceSelect.value,
  });
});

resetBtn.addEventListener('click', () => {
  stopDots();
  stopWordTicker();
  if (worker) {
    worker.terminate();
    worker = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  textInput.value = '';
  fileInput.value = '';
  audioPlayer.src = '';
  outputDiv.hidden = true;
  downloadBtn.hidden = true;
  downloadBtn.disabled = true;
  speakBtn.disabled = false;
  resetBtn.hidden = true;
  setStatus('Model ready');

  worker = createWorker();
  worker.postMessage({ type: MessageTypes.PRELOAD });
});

downloadBtn.addEventListener('click', () => {
  if (!currentAudioUrl) return;
  const a = document.createElement('a');
  a.href = currentAudioUrl;
  a.download = 'big-daddy-read-to-me.wav';
  a.click();
});

function createWorker() {
  const w = new Worker('./utils/worker.js', { type: 'module' });
  w.onmessage = (e) => {
    const { type } = e.data;
    if (type === MessageTypes.PRELOAD_DONE) handlePreloadDone();
    if (type === MessageTypes.DOWNLOADING) handleDownloading(e.data);
    if (type === MessageTypes.LOADING) handleLoading(e.data);
    if (type === MessageTypes.RESULT) handleResult(e.data);
    if (type === MessageTypes.ERROR) handleError(e.data);
  };
  w.onerror = (e) => {
    setStatus('Error: ' + e.message);
    speakBtn.disabled = false;
  };
  return w;
}

function handlePreloadDone() {
  localStorage.setItem(CACHE_KEY, 'true');
  speakBtn.disabled = false;
  setStatus('Model ready');
}

function handleDownloading({ file, progress }) {
  if (!isCached) {
    setStatus(`Firing up engines... (${file} ${Math.round(progress)}%)`);
  }
}

function handleLoading({ status, chunk, total }) {
  if (status === 'synthesizing') {
    const label = (chunk && total > 1) ? `Synthesizing (${chunk}/${total})` : 'Synthesizing';
    startDots(label);

    if (chunk) {
      // Multi-chunk path: advance ticker to the words for this chunk.
      advanceTickerToChunk(chunk);
    } else {
      // Single-chunk path: no per-chunk messages will follow, so let the
      // ticker run freely through all words.
      setTickerTarget(tickerWords.length - 1);
    }
  }
}

function handleResult({ audio, sampling_rate }) {
  stopDots();
  stopWordTicker();
  const blob = encodeWAV(audio, sampling_rate);
  if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
  currentAudioUrl = URL.createObjectURL(blob);
  audioPlayer.src = currentAudioUrl;
  outputDiv.hidden = false;
  downloadBtn.disabled = false;
  speakBtn.disabled = false;
  setStatus('Done');
}

function handleError({ message }) {
  stopDots();
  stopWordTicker();
  downloadBtn.hidden = true;
  downloadBtn.disabled = true;
  setStatus('Error: ' + message);
  speakBtn.disabled = false;
}

function setStatus(text) {
  statusText.textContent = text;
}

// Encodes a Float32Array of audio samples into a WAV Blob (16-bit PCM, mono).
function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const write = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  write(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
