// Each entry: index (0 = A0, positive = smaller An, negative = larger A-n)
// dimensions in mm, fun fact, label
// A0 = 841 x 1189 mm (portrait). Each step right: halve long side. Each step left: double short side.
// Width/height always maintain sqrt(2) ratio.

// A_n: w = 1000 / 2^((2n+1)/4) mm, h = 1000 / 2^((2n-1)/4) mm
// For negative indices (larger than A0), we extend the same formula.

function getDimensions(n) {
  // A_n width = 1000 * 2^(-(2n+1)/4) mm
  // area = 1/2^n m²
  const wMm = 1000 * Math.pow(2, -(2*n+1)/4);
  const hMm = 1000 * Math.pow(2, -(2*n-1)/4);
  return { w: wMm, h: hMm, area: Math.pow(2, -n) };
}

// Fun facts keyed by index. 0 = A0, positive = smaller, negative = larger.
const FACTS = {
  // === LARGER THAN A0 (negative indices) ===
  "-1":  { label: "A−1", fact: "About the size of a standard door (roughly 2 m²). A single sheet would cover a typical interior door almost exactly." },
  "-2":  { label: "A−2", fact: "Approximately the floor area of a large wardrobe or a phone booth (~4 m²)." },
  "-3":  { label: "A−3", fact: "About the size of a small bathroom or a king-size bed (~8 m²)." },
  "-4":  { label: "A−4", fact: "Roughly the area of a typical parking space (~16 m²)." },
  "-5":  { label: "A−5", fact: "Around the size of a small studio apartment room (~32 m²)." },
  "-6":  { label: "A−6", fact: "About the floor area of a tennis court doubles alley (~64 m²)." },
  "-7":  { label: "A−7", fact: "Close to the playing surface of a professional squash court (~128 m²)." },
  "-8":  { label: "A−8", fact: "Approximately the area of an Olympic-size swimming pool surface (~256 m²)." },
  "-9":  { label: "A−9", fact: "About the footprint of a large house or a full basketball court (~512 m²)." },
  "-10": { label: "A−10", fact: "Roughly the area of a city block in Manhattan (~1,024 m² ≈ 0.1 ha)." },
  "-11": { label: "A−11", fact: "About the size of a soccer pitch (~2,048 m²)." },
  "-12": { label: "A−12", fact: "Roughly the area of 4 soccer pitches, or a large supermarket (~4,096 m²)." },
  "-13": { label: "A−13", fact: "About the size of Trafalgar Square in London (~8,192 m²)." },
  "-14": { label: "A−14", fact: "Approximately the area of the Vatican Gardens (~16,384 m² ≈ 1.6 ha)." },
  "-15": { label: "A−15", fact: "Close to the area of a small farm or Buckingham Palace gardens (~32,768 m²)." },
  "-16": { label: "A−16", fact: "About 6.5 hectares — the size of Monaco's Formula 1 street circuit footprint (~65,536 m²)." },
  "-17": { label: "A−17", fact: "Around 13 hectares — roughly the size of Disneyland's original Anaheim park (~131,072 m²)." },
  "-18": { label: "A−18", fact: "About 26 hectares — the footprint of the Pentagon and its grounds (~262,144 m²)." },
  "-19": { label: "A−19", fact: "~52 hectares — the area of Central Park's Great Lawn region (~524,288 m²)." },
  "-20": { label: "A−20", fact: "About 1 km² — roughly the area of the City of London (the Square Mile is 1.12 km²)." },
  "-25": { label: "A−25", fact: "~33 km² — about the area of Manhattan island." },
  "-30": { label: "A−30", fact: "~1,073 km² — roughly the area of Hong Kong." },
  "-33": { label: "A−33", fact: "~8,589 km² — about the size of Cyprus." },
  "-37": { label: "A−37", fact: "~137,438 km² — close to the area of Greece." },
  "-40": { label: "A−40", fact: "~1.1 million km² — about the area of Egypt." },
  "-43": { label: "A−43", fact: "~8.8 million km² — close to the area of Brazil." },
  "-47": { label: "A−47", fact: "~140 million km² — roughly the total land area of Earth." },
  "-50": { label: "A−50", fact: "~1.13 billion km² — about the surface area of the Sun." },
  "-53": { label: "A−53", fact: "~9 billion km² — roughly the cross-sectional area of the orbit of Mars." },
  "-57": { label: "A−57", fact: "Approaching the scale of the inner solar system." },
  "-60": { label: "A−60", fact: "~1.15 × 10²⁴ km² — on the order of the cross-section of the observable solar neighbourhood." },
  "-64": { label: "A−64", fact: "The chessboard story in reverse: if A0 is one grain of rice, A−64 would be the 64th square's pile — 2⁶³ grains, enough to cover India several metres deep. A mountain of rice." },
  "-70": { label: "A−70", fact: "Approaching galactic scales — the Milky Way disk is roughly 10⁵ light-years across." },
  "-80": { label: "A−80", fact: "On the scale of the observable universe (~93 billion light-years diameter)." },

  // === A0 ===
  "0": { label: "A0", fact: "A0 is the origin of the entire ISO 216 paper system. Its area is exactly 1 m². Every other A-size is simply A0 folded in half, again and again — each time preserving the same aspect ratio of 1 : √2." },

  // === SMALLER THAN A0 (positive indices) ===
  "1":  { label: "A1", fact: "A1 (594 × 841 mm) is used for large architectural drawings and posters. Area: 0.5 m²." },
  "2":  { label: "A2", fact: "A2 (420 × 594 mm) is a common size for technical drawings, posters, and flip-chart pads. Area: 0.25 m²." },
  "3":  { label: "A3", fact: "A3 (297 × 420 mm) is widely used in offices for spreadsheets, tabloid layouts, and newspapers. Area: 0.125 m²." },
  "4":  { label: "A4", fact: "A4 (210 × 297 mm) — the world's most common paper size, used in over 160 countries for letters, documents, and textbooks. Area: 0.0625 m²." },
  "5":  { label: "A5", fact: "A5 (148 × 210 mm) is a popular notebook and booklet size — exactly half an A4 sheet." },
  "6":  { label: "A6", fact: "A6 (105 × 148 mm) is the standard size for postcards in many countries." },
  "7":  { label: "A7", fact: "A7 (74 × 105 mm) — roughly the size of a playing card or a small notepad." },
  "8":  { label: "A8", fact: "A8 (52 × 74 mm) — about the size of a large postage stamp or business card." },
  "9":  { label: "A9", fact: "A9 (37 × 52 mm) — smaller than most business cards; sometimes used for tiny labels." },
  "10": { label: "A10", fact: "A10 (26 × 37 mm) — roughly the size of a large fingernail. Area: ~0.001 m²." },
  "11": { label: "A11", fact: "A11 (18 × 26 mm) — about the size of a thumbnail. Most printers cannot handle this size." },
  "12": { label: "A12", fact: "A12 (13 × 18 mm) — similar to a small coin or a SIM card." },
  "13": { label: "A13", fact: "A13 (9 × 13 mm) — about the size of a fingertip." },
  "14": { label: "A14", fact: "A14 (~6 × 9 mm) — close to the size of a grain of rice." },
  "15": { label: "A15", fact: "A15 (~5 × 6 mm) — roughly the diameter of a large sand grain." },
  "16": { label: "A16", fact: "A16 (~3 × 5 mm) — about the size of a small ant." },
  "17": { label: "A17", fact: "A17 (~2 × 3 mm) — on the scale of a dust mite (~0.3 mm is a dust mite; this is still visible to the naked eye)." },
  "18": { label: "A18", fact: "A18 (~1.6 × 2.2 mm) — about the width of a human hair strand viewed end-on." },
  "19": { label: "A19", fact: "A19 (~1.1 × 1.6 mm) — approaching the size of a large red blood cell cluster." },
  "20": { label: "A20", fact: "A20 (~0.8 × 1.1 mm) — about the size of a single grain of fine sand." },
  "21": { label: "A21", fact: "A21 (~0.56 × 0.8 mm) — close to the diameter of a human hair (~0.07 mm wide; this is still much larger)." },
  "23": { label: "A23", fact: "A23 (~0.28 × 0.40 mm) — on the order of the width of a human hair." },
  "27": { label: "A27", fact: "A27 (~0.044 × 0.062 mm, ~44 μm) — about the diameter of a human red blood cell (6–8 μm). We're getting close." },
  "30": { label: "A30", fact: "A30 (~5.5 × 7.8 μm) — on the scale of a single human cell nucleus." },
  "33": { label: "A33", fact: "A33 (~0.69 × 0.98 μm) — about the size of a large bacterium like E. coli." },
  "37": { label: "A37", fact: "A37 (~43 × 61 nm) — on the scale of a large virus, like influenza (~100 nm)." },
  "40": { label: "A40", fact: "A40 (~5.4 × 7.6 nm) — approaching the scale of a DNA double helix width (~2 nm)." },
  "43": { label: "A43", fact: "A43 (~0.67 × 0.95 nm) — about the diameter of a water molecule (~0.28 nm). We're at atomic scale." },
  "47": { label: "A47", fact: "A47 (~0.042 × 0.059 nm = 42 pm) — on the scale of the Bohr radius of hydrogen (53 pm)." },
  "50": { label: "A50", fact: "A50 (~5.3 × 7.4 pm) — smaller than an atomic nucleus (proton radius ~0.85 fm = 0.00085 pm). We've passed through the atom entirely." },
  "53": { label: "A53", fact: "A53 (~0.66 × 0.93 pm) — on the scale of a proton's radius (~0.85 fm). The sheet is now subatomic." },
  "57": { label: "A57", fact: "A57 (~41 × 58 fm) — deep inside nuclear physics territory." },
  "60": { label: "A60", fact: "A60 (~5.2 × 7.3 fm) — on the scale of a large atomic nucleus like uranium (radius ~7 fm)." },
  "64": { label: "A64", fact: "The rice and the chessboard: place 1 grain on square 1, 2 on square 2, 4 on square 3, doubling each time. By square 64, you need 2⁶³ ≈ 9.2 × 10¹⁸ grains — roughly 460 billion tonnes of rice, more than 1,000 years of global production. This sheet is ~0.32 × 0.46 fm — smaller than a proton." },
  "70": { label: "A70", fact: "A70 (~5 × 7 am = attometres) — far below the scale of any known particle. Entering deeply theoretical territory." },
  "80": { label: "A80", fact: "A80 — approaching the Planck length scale (~1.6 × 10⁻³⁵ m). The fabric of spacetime itself may become discrete at this resolution." },
  "83": { label: "A83", fact: "A83 — the long dimension is approximately the Planck length (1.616 × 10⁻³⁵ m). Below this, our current physics breaks down entirely. This is the smallest meaningful length in nature." },
};

// For indices not explicitly listed, generate a generic entry
function getFact(n) {
  const key = String(n);
  if (FACTS[key]) return FACTS[key];
  const { w, h, area } = getDimensions(n);
  const label = n >= 0 ? `A${n}` : `A−${Math.abs(n)}`;
  const areaStr = area >= 1 ? `${area.toFixed(2)} m²` : area >= 0.0001 ? `${(area*10000).toFixed(4)} cm²` : `${(area*1e6).toFixed(4)} mm²`;
  return { label, fact: `${label}: ${formatDim(w)} × ${formatDim(h)}, area ${areaStr}.` };
}

function formatDim(mm) {
  if (mm >= 1000) return `${(mm/1000).toFixed(3)} m`;
  if (mm >= 1) return `${mm.toFixed(1)} mm`;
  if (mm >= 0.001) return `${(mm*1000).toFixed(2)} μm`;
  if (mm >= 0.000001) return `${(mm*1e6).toFixed(2)} nm`;
  if (mm >= 0.000000001) return `${(mm*1e9).toFixed(2)} pm`;
  return `${(mm*1e12).toFixed(2)} fm`;
}
