import { KokoroTTS } from 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';

const MessageTypes = {
  PRELOAD: 'PRELOAD',
  PRELOAD_DONE: 'PRELOAD_DONE',
  INFERENCE_REQUEST: 'INFERENCE_REQUEST',
  LOADING: 'LOADING',
  DOWNLOADING: 'DOWNLOADING',
  RESULT: 'RESULT',
  ERROR: 'ERROR',
};

let tts = null;

self.addEventListener('message', async (event) => {
  const { type, text, voice } = event.data;
  if (type === MessageTypes.PRELOAD) await preload();
  if (type === MessageTypes.INFERENCE_REQUEST) await synthesize(text, voice);
});

async function loadModel() {
  if (tts) return;
  tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-ONNX', {
    dtype: 'q8',
    progress_callback: (data) => {
      if (data.status === 'progress') {
        self.postMessage({
          type: MessageTypes.DOWNLOADING,
          file: data.file,
          progress: data.progress,
        });
      }
    },
  });
}

async function preload() {
  try {
    await loadModel();
    self.postMessage({ type: MessageTypes.PRELOAD_DONE });
  } catch (err) {
    self.postMessage({ type: MessageTypes.ERROR, message: err.message });
  }
}

// Split text into chunks that fit within the model's ~510-token limit.
// Targets ~350 chars per chunk, breaking at sentence boundaries first,
// then at word boundaries if a single sentence is too long.
function chunkText(text, maxLen = 350) {
  const chunks = [];

  for (const para of text.split(/\n\n+/)) {
    const sentences = para.match(/[^.!?\n]+[.!?\n]*/g) || [para];
    let current = '';

    for (let sent of sentences) {
      sent = sent.trim();
      if (!sent) continue;

      if (current.length + sent.length + 1 > maxLen && current.length > 0) {
        chunks.push(current.trim());
        current = sent;
      } else {
        current += (current ? ' ' : '') + sent;
      }

      // If a single sentence still exceeds maxLen, split at word boundaries
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

async function synthesize(text, voice) {
  self.postMessage({ type: MessageTypes.LOADING, status: 'synthesizing' });
  try {
    await loadModel();
    const chunks = chunkText(text);
    const arrays = [];
    let samplingRate = 24000;

    for (let i = 0; i < chunks.length; i++) {
      if (chunks.length > 1) {
        self.postMessage({
          type: MessageTypes.LOADING,
          status: 'synthesizing',
          chunk: i + 1,
          total: chunks.length,
        });
      }
      const result = await tts.generate(chunks[i], { voice });
      arrays.push(result.audio);
      samplingRate = result.sampling_rate;
    }

    // Concatenate all chunk audio into one Float32Array
    const totalLen = arrays.reduce((n, a) => n + a.length, 0);
    const combined = new Float32Array(totalLen);
    let offset = 0;
    for (const arr of arrays) { combined.set(arr, offset); offset += arr.length; }

    self.postMessage({
      type: MessageTypes.RESULT,
      audio: combined,
      sampling_rate: samplingRate,
    });
  } catch (err) {
    self.postMessage({ type: MessageTypes.ERROR, message: err.message });
  }
}
