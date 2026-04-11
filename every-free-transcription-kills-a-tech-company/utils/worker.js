import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

const MODEL_NAME = 'Xenova/whisper-tiny.en';

const MessageTypes = {
  INFERENCE_REQUEST: 'INFERENCE_REQUEST',
  INFERENCE_DONE: 'INFERENCE_DONE',
  LOADING: 'LOADING',
  DOWNLOADING: 'DOWNLOADING',
  RESULT: 'RESULT',
  RESULT_PARTIAL: 'RESULT_PARTIAL',
};

let transcriber = null;

self.addEventListener('message', async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio) {
  self.postMessage({ type: MessageTypes.LOADING, status: 'loading' });

  if (!transcriber) {
    transcriber = await pipeline('automatic-speech-recognition', MODEL_NAME, {
      progress_callback: (data) => {
        if (data.status === 'progress') {
          self.postMessage({
            type: MessageTypes.DOWNLOADING,
            file: data.file,
            progress: data.progress,
            loaded: data.loaded,
            total: data.total,
          });
        }
      },
    });
  }

  self.postMessage({ type: MessageTypes.LOADING, status: 'success' });

  const stride_length_s = 5;
  const generationTracker = new GenerationTracker(transcriber, stride_length_s);

  await transcriber(audio, {
    top_k: 0,
    do_sample: false,
    chunk_length_s: 30,
    stride_length_s,
    return_timestamps: true,
    force_full_sequences: false,
    callback_function: generationTracker.callbackFunction.bind(generationTracker),
    chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
  });

  generationTracker.sendFinalResult();
}

class GenerationTracker {
  constructor(pipeline, stride_length_s) {
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    this.time_precision =
      pipeline.processor.feature_extractor.config.chunk_length /
      pipeline.model.config.max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({ type: MessageTypes.INFERENCE_DONE });
  }

  callbackFunction(beams) {
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) return;

    const bestBeam = beams[0];
    const text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
      skip_special_tokens: true,
    });

    self.postMessage({
      type: MessageTypes.RESULT_PARTIAL,
      result: { text, start: this.getLastChunkTimestamp(), end: undefined },
    });
  }

  chunkCallback(data) {
    this.chunks.push(data);
    const [, { chunks }] = this.pipeline.tokenizer._decode_asr(this.chunks, {
      time_precision: this.time_precision,
      return_timestamps: true,
      force_full_sequences: false,
    });

    this.processed_chunks = chunks.map((chunk, index) =>
      this.processChunk(chunk, index)
    );

    self.postMessage({
      type: MessageTypes.RESULT,
      results: this.processed_chunks,
      isDone: false,
      completedUntilTimestamp: this.getLastChunkTimestamp(),
    });
  }

  getLastChunkTimestamp() {
    if (this.processed_chunks.length === 0) return 0;
    return this.processed_chunks[this.processed_chunks.length - 1].end;
  }

  processChunk(chunk, index) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;
    return {
      index,
      text: `${text.trim()} `,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}
