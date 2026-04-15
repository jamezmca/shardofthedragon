#!/usr/bin/env node
// fetch-images.js
// Downloads all character images from the Jikan (MyAnimeList) API.
// Run with: node fetch-images.js
// Requires Node 18+ (uses native fetch).

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

/* ─── Config ──────────────────────────────────────────────────────────── */
const IMG_DIR   = path.join(__dirname, 'img');
const DELAY_MS  = 450;   // ~2.2 req/s — safely under Jikan's 3 req/s limit

/* ─── Characters (keep in sync with index.html) ──────────────────────── */
const characters = [
  // Dragon Ball
  { name: 'Goku' },
  { name: 'Vegeta' },
  { name: 'Gohan' },
  { name: 'Piccolo' },
  { name: 'Broly' },
  // Naruto
  { name: 'Rock Lee' },
  { name: 'Might Guy' },
  { name: 'Madara Uchiha' },
  // One Punch Man
  { name: 'Saitama' },
  { name: 'Garou' },
  { name: 'Bang (Silver Fang)',   query: 'Bang Silver Fang' },
  // My Hero Academia
  { name: 'All Might' },
  // One Piece
  { name: 'Roronoa Zoro' },
  { name: 'Whitebeard' },
  { name: 'Shanks' },
  // Seven Deadly Sins
  { name: 'Escanor' },
  // Berserk
  { name: 'Guts' },
  // Demon Slayer
  { name: 'Tengen Uzui' },
  { name: 'Gyomei Himejima' },
  { name: 'Akaza' },
  // Attack on Titan
  { name: 'Levi Ackerman' },
  // Vinland Saga
  { name: 'Thorfinn' },
  // Hunter x Hunter
  { name: 'Netero' },
  { name: 'Meruem' },
  // Baki
  { name: 'Yujiro Hanma' },
  // JoJo's Bizarre Adventure
  { name: 'Jotaro Kujo' },
  // Bleach
  { name: 'Kenpachi Zaraki' },
  { name: 'Yamamoto Genryūsai',   query: 'Yamamoto Genryuusai Shigekuni' },
  // Gurren Lagann
  { name: 'Kamina' },
  // Record of Ragnarok
  { name: 'Heracles',             query: 'Heracles Shuumatsu no Valkyrie' },
  { name: 'Lu Bu',                query: 'Lu Bu Shuumatsu no Valkyrie' },
  // Jujutsu Kaisen
  { name: 'Yuji Itadori' },
  { name: 'Aoi Todo' },
  { name: 'Toji Fushiguro' },
  // Fullmetal Alchemist: Brotherhood
  { name: 'Alex Louis Armstrong' },
  // Solo Leveling
  { name: 'Sung Jin-Woo' },
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function toSlug(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImageUrl(char) {
  const q   = encodeURIComponent(char.query || char.name);
  const res = await fetch(`https://api.jikan.moe/v4/characters?q=${q}&limit=3`);
  if (!res.ok) throw new Error(`Jikan API ${res.status}`);
  const json = await res.json();
  return json.data?.[0]?.images?.jpg?.image_url ?? null;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    function request(url) {
      const mod = url.startsWith('https') ? https : http;
      mod.get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          file.destroy();
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
        file.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
      }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
    }

    request(url);
  });
}

/* ─── Main ────────────────────────────────────────────────────────────── */
async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  let downloaded = 0, skipped = 0, failed = 0;
  const failures = [];

  console.log(`\nFetching images for ${characters.length} characters...\n`);

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const slug = toSlug(char.name);
    const dest = path.join(IMG_DIR, `${slug}.jpg`);

    if (fs.existsSync(dest)) {
      console.log(`  [${i + 1}/${characters.length}] skip  ${char.name}`);
      skipped++;
      continue;
    }

    try {
      const url = await fetchImageUrl(char);
      if (!url) {
        console.log(`  [${i + 1}/${characters.length}] miss  ${char.name} — no result from API`);
        failed++;
        failures.push(char.name);
      } else {
        await downloadFile(url, dest);
        console.log(`  [${i + 1}/${characters.length}] saved ${char.name} → ${slug}.jpg`);
        downloaded++;
      }
    } catch (err) {
      console.log(`  [${i + 1}/${characters.length}] error ${char.name} — ${err.message}`);
      failed++;
      failures.push(char.name);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n─────────────────────────────`);
  console.log(`  downloaded : ${downloaded}`);
  console.log(`  skipped    : ${skipped}`);
  console.log(`  failed     : ${failed}`);
  if (failures.length) {
    console.log(`\n  Failed characters:`);
    failures.forEach(n => console.log(`    - ${n}`));
  }
  console.log(`─────────────────────────────\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
