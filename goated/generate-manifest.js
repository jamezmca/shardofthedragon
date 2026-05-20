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

const files = fs.readdirSync(ART_DIR)
  .filter(f => EXTS.has(path.extname(f).toLowerCase()));

// Newest files first (by filesystem modification time)
files.sort((a, b) => {
  const mtimeA = fs.statSync(path.join(ART_DIR, a)).mtimeMs;
  const mtimeB = fs.statSync(path.join(ART_DIR, b)).mtimeMs;
  return mtimeB - mtimeA;
});

fs.writeFileSync(OUT, JSON.stringify(files, null, 2));
console.log(`manifest.json updated — ${files.length} image(s)`);
