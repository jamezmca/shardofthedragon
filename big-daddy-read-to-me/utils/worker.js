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

async function synthesize(text, voice) {
  self.postMessage({ type: MessageTypes.LOADING, status: 'synthesizing' });
  try {
    await loadModel();
    const result = await tts.generate(text, { voice });
    self.postMessage({
      type: MessageTypes.RESULT,
      audio: result.audio,
      sampling_rate: result.sampling_rate,
    });
  } catch (err) {
    self.postMessage({ type: MessageTypes.ERROR, message: err.message });
  }
}
