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
let dotsInterval = null;

function startDots(label) {
  let count = 0;
  statusText.textContent = label;
  dotsInterval = setInterval(() => {
    count = (count + 1) % 4;
    statusText.textContent = label + '.'.repeat(count);
  }, 500);
}

function stopDots() {
  clearInterval(dotsInterval);
  dotsInterval = null;
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

  worker.postMessage({
    type: MessageTypes.INFERENCE_REQUEST,
    text,
    voice: voiceSelect.value,
  });
});

resetBtn.addEventListener('click', () => {
  stopDots();
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
  }
}

function handleResult({ audio, sampling_rate }) {
  stopDots();
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
