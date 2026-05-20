#!/usr/bin/env node
// Drop images into the /art folder, then run:
//   node generate-manifest.js
//
// Filenames should follow the pattern:  artwork-title_student-name.ext
// Supported formats: jpg, jpeg, png, gif, webp, avif

const fs   = require('fs');
const path = require('path');

const ART_DIR = path.join(__dirname, 'art');
const OUT     = path.join(__dirname, 'manifest.json');
const EXTS    = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

// ── Image dimension readers ──────────────────────────────────────────────────
// Each reads only the file header (max 64KB) — no full decode needed.

function readPng(buf) {
  // PNG: fixed header (8 bytes) + IHDR chunk header (8 bytes) + width (4) + height (4)
  if (buf.length < 24) return null;
  return {
    width:  buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function readGif(buf) {
  // GIF87a / GIF89a: logical screen width at bytes 6-7, height at 8-9 (little-endian)
  if (buf.length < 10) return null;
  return {
    width:  buf.readUInt16LE(6),
    height: buf.readUInt16LE(8),
  };
}

function readWebp(buf) {
  // RIFF (4) + file size (4) + WEBP (4) + chunk type (4) + chunk size (4) = 20 bytes header
  if (buf.length < 30) return null;
  const chunk = buf.slice(12, 16).toString('ascii');

  if (chunk === 'VP8 ') {
    // Lossy: 3-byte frame tag, then start code 9D 01 2A, then 16-bit LE width/height
    // bits 0-13 of each uint16 are the actual dimension
    const w = buf.readUInt16LE(26) & 0x3FFF;
    const h = buf.readUInt16LE(28) & 0x3FFF;
    return { width: w, height: h };
  }

  if (chunk === 'VP8L') {
    // Lossless: signature byte (0x2F) at offset 20, then packed uint32 LE at offset 21
    // bits  0-13: width  - 1
    // bits 14-27: height - 1
    const n = buf.readUInt32LE(21);
    return {
      width:  (n & 0x3FFF) + 1,
      height: ((n >> 14) & 0x3FFF) + 1,
    };
  }

  if (chunk === 'VP8X') {
    // Extended: flags (4 bytes) at offset 20, then canvas width-1 (24-bit LE) and height-1 (24-bit LE)
    const w = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
    const h = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1;
    return { width: w, height: h };
  }

  return null;
}

function readJpeg(buf) {
  // Walk JPEG segments (FF XX [2-byte length] [data]) until an SOF marker is found.
  // SOF data layout: [length 2] [precision 1] [height 2] [width 2]
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null;

  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xFF) return null; // lost sync

    const marker = buf[i + 1];
    i += 2;

    // Markers that have no length field
    if (marker === 0xD8 || marker === 0xD9 ||
        (marker >= 0xD0 && marker <= 0xD7)) continue;

    if (i + 2 > buf.length) return null;
    const segLen = (buf[i] << 8) | buf[i + 1]; // includes the 2 length bytes

    // SOF markers: C0-C3, C5-C7, C9-CB, CD-CF
    const isSOF =
      (marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF);

    if (isSOF) {
      if (i + 7 > buf.length) return null;
      return {
        height: (buf[i + 3] << 8) | buf[i + 4],
        width:  (buf[i + 5] << 8) | buf[i + 6],
      };
    }

    i += segLen; // jump past this segment
  }
  return null;
}

function getDimensions(filepath) {
  const fd = fs.openSync(filepath, 'r');
  const buf = Buffer.alloc(65536);
  const n   = fs.readSync(fd, buf, 0, buf.length, 0);
  fs.closeSync(fd);
  const data = buf.slice(0, n);

  // Detect format by magic bytes
  if (data[0] === 0x89 && data[1] === 0x50) return readPng(data);
  if (data[0] === 0xFF && data[1] === 0xD8) return readJpeg(data);
  if (data.slice(0, 4).toString() === 'RIFF' &&
      data.slice(8, 12).toString() === 'WEBP')   return readWebp(data);
  if (data.slice(0, 3).toString() === 'GIF')     return readGif(data);

  return null; // unsupported format — will default to portrait
}

// ── Build manifest ───────────────────────────────────────────────────────────

const files = fs.readdirSync(ART_DIR)
  .filter(f => EXTS.has(path.extname(f).toLowerCase()));

files.sort((a, b) =>
  fs.statSync(path.join(ART_DIR, b)).mtimeMs -
  fs.statSync(path.join(ART_DIR, a)).mtimeMs
);

const manifest = files.map(file => {
  const dims = getDimensions(path.join(ART_DIR, file));
  const landscape = dims ? dims.width > dims.height : false;
  return { file, landscape };
});

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
console.log(`manifest.json updated — ${manifest.length} image(s)`);
