# Big Daddy Read To Me — Setup Instructions

No manual file downloads needed. The model fetches automatically from
HuggingFace on first use and is cached in the browser from that point on.

---

## Run the app

Open `index.html` with VS Code Live Server (right-click → Open with Live
Server). Do **not** open it as a `file://` URL directly — HuggingFace model
downloads require a proper HTTP origin to pass CORS.

---

## First use

On first visit the app downloads the Kokoro model (~82MB at q8 quantization)
from HuggingFace. The status bar shows download progress. This happens once
per device — every visit after that loads instantly from browser cache.

---

## Voices

10 Kokoro voices are available covering American and British accents, male
and female. All use the same underlying model so switching voices requires
no additional download.

| Voice | Character |
|---|---|
| Heart | American female, warm |
| Bella | American female, expressive |
| Sarah | American female, clear |
| Sky | American female, breathy |
| Adam | American male |
| Michael | American male |
| Emma | British female |
| Isabella | British female |
| George | British male |
| Lewis | British male |

---

## Model details

- **Model**: `onnx-community/Kokoro-82M-ONNX`
- **Quantization**: `q8` (8-bit) — good balance of quality and download size
- **Download size**: ~82MB on first use, cached after that
- **Audio output**: WAV, 24kHz, mono

---

## Notes

- The app will not work opened as a local file (`file://`) — use Live Server
  or any other local HTTP server (`npx serve`, `python3 -m http.server`, etc.)
- To clear the cached model: open DevTools → Application → Cache Storage →
  delete the `transformers-cache` entry, then hard refresh
