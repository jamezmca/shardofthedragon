const MessageTypes = {
  INFERENCE_REQUEST: 'INFERENCE_REQUEST',
  INFERENCE_DONE: 'INFERENCE_DONE',
  LOADING: 'LOADING',
  DOWNLOADING: 'DOWNLOADING',
  RESULT: 'RESULT',
  RESULT_PARTIAL: 'RESULT_PARTIAL',
};

const VALID_EXTENSIONS = /\.(mp3|wav|mp4|mov|avi|flv|wmv|mpeg|mpg|webm|opus|ogg|m4a|aac)$/i;
const VALID_MIME_TYPES = [
  'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/webm',
  'audio/opus', 'audio/aac', 'audio/x-m4a', 'audio/x-wav',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg',
];

const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const statusBar = document.getElementById('status-bar');
const fileNameEl = document.getElementById('file-name');
const fileDurationEl = document.getElementById('file-duration');
const transcribeBtn = document.getElementById('transcribe-btn');
const statusText = document.getElementById('status-text');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const transcriptionOutput = document.getElementById('transcription-output');

let worker = null;
let currentFile = null;

uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!isValidAudioFile(file)) {
    alert('Please upload a valid audio or video file.');
    fileInput.value = '';
    return;
  }

  currentFile = file;
  const duration = await getAudioDuration(file);
  fileNameEl.textContent = file.name;
  fileDurationEl.textContent = formatDuration(duration);
  statusBar.hidden = false;
  transcribeBtn.disabled = false;
  setStatus('');
});

transcribeBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  transcribeBtn.disabled = true;
  uploadBtn.disabled = true;
  copyBtn.disabled = true;
  resetBtn.hidden = false;
  transcriptionOutput.innerHTML = '';

  setStatus('Firing Up Engines...');

  const audio = await readAudioFrom(currentFile);

  if (!worker) {
    worker = createWorker();
  }

  worker.postMessage({ type: MessageTypes.INFERENCE_REQUEST, audio });
});

copyBtn.addEventListener('click', () => {
  const text = getTranscriptionText();
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  alert('Copied to clipboard!');
});

resetBtn.addEventListener('click', () => {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  currentFile = null;
  fileInput.value = '';
  statusBar.hidden = true;
  transcriptionOutput.innerHTML = '';
  transcribeBtn.disabled = true;
  copyBtn.disabled = true;
  uploadBtn.disabled = false;
  resetBtn.hidden = true;
  setStatus('');
});

function createWorker() {
  const w = new Worker('./utils/worker.js', { type: 'module' });
  w.onmessage = (e) => {
    const { type } = e.data;
    if (type === MessageTypes.LOADING) handleLoading(e.data);
    if (type === MessageTypes.DOWNLOADING) handleDownloading(e.data);
    if (type === MessageTypes.RESULT) handleResult(e.data);
    if (type === MessageTypes.RESULT_PARTIAL) handlePartialResult(e.data);
    if (type === MessageTypes.INFERENCE_DONE) handleDone();
  };
  w.onerror = (e) => {
    setStatus('Error: ' + e.message);
    transcribeBtn.disabled = false;
    uploadBtn.disabled = false;
  };
  return w;
}

function handleLoading({ status }) {
  if (status === 'loading') setStatus('Firing Up Engines...');
  if (status === 'success') setStatus('Transcribing...');
}

function handleDownloading({ file, progress }) {
  setStatus(`Firing Up Engines... (${file} ${Math.round(progress)}%)`);
}

function handleResult({ results }) {
  const existing = transcriptionOutput.querySelectorAll('.chunk');
  results.forEach((result, i) => {
    if (i < existing.length) {
      existing[i].textContent = cleanText(result.text);
    } else {
      const span = document.createElement('span');
      span.className = 'chunk';
      span.textContent = cleanText(result.text);
      transcriptionOutput.appendChild(span);
    }
  });
  const partial = document.getElementById('partial-chunk');
  if (partial) partial.remove();
}

function handlePartialResult({ result }) {
  let partial = document.getElementById('partial-chunk');
  if (!partial) {
    partial = document.createElement('span');
    partial.id = 'partial-chunk';
    partial.style.opacity = '0.5';
    transcriptionOutput.appendChild(partial);
  }
  partial.textContent = cleanText(result.text);
}

function handleDone() {
  const partial = document.getElementById('partial-chunk');
  if (partial) partial.remove();
  setStatus('Payload Complete');
  copyBtn.disabled = false;
}

function setStatus(text) {
  statusText.textContent = text;
}

function getTranscriptionText() {
  return Array.from(transcriptionOutput.querySelectorAll('.chunk'))
    .map((s) => s.textContent)
    .join('');
}

function isValidAudioFile(file) {
  return VALID_MIME_TYPES.includes(file.type) || VALID_EXTENSIONS.test(file.name);
}

async function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

async function readAudioFrom(file) {
  const sampling_rate = 16000;
  const audioCTX = new AudioContext({ sampleRate: sampling_rate });
  const response = await file.arrayBuffer();
  const decoded = await audioCTX.decodeAudioData(response);
  return decoded.getChannelData(0);
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return 'unknown duration';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function cleanText(text) {
  return text.replace(/<\|\d+\.\d+\|>/g, '');
}
