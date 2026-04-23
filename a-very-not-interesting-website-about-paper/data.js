// getDimensions(n): returns width/height in mm and area in m² for paper size An
// A_n: w = 1000·2^(−(2n+1)/4) mm, h = 1000·2^(−(2n−1)/4) mm, area = 2^(−n) m²
function getDimensions(n) {
  return {
    w:    1000 * Math.pow(2, -(2*n+1)/4),
    h:    1000 * Math.pow(2, -(2*n-1)/4),
    area: Math.pow(2, -n),
  };
}

function formatDim(mm) {
  if      (mm >= 1e9)   return `${(mm/1e9).toFixed(2)} Tm`;
  if      (mm >= 1e6)   return `${(mm/1e6).toFixed(2)} Gm`;
  if      (mm >= 1e3)   return `${(mm/1e3).toFixed(2)} km`;  // actually km = 1e6 mm? no. 1 km = 1e6 mm
  // 1 m = 1000 mm, 1 km = 1e6 mm, 1 Mm = 1e9 mm
  if      (mm >= 1e12)  return `${(mm/1e12).toExponential(2)} Gm`;
  if      (mm >= 1e9)   return `${(mm/1e9).toFixed(1)} Mm`;
  if      (mm >= 1e6)   return `${(mm/1e6).toFixed(1)} km`;
  if      (mm >= 1000)  return `${(mm/1000).toFixed(2)} m`;
  if      (mm >= 1)     return `${mm.toFixed(1)} mm`;
  if      (mm >= 1e-3)  return `${(mm*1000).toFixed(1)} μm`;
  if      (mm >= 1e-6)  return `${(mm*1e6).toFixed(2)} nm`;
  if      (mm >= 1e-9)  return `${(mm*1e9).toFixed(2)} pm`;
  return                       `${(mm*1e12).toFixed(2)} fm`;
}

function formatArea(m2) {
  const abs = Math.abs(m2);
  if      (abs >= 1e24)  return `${m2.toExponential(2)} m²`;
  if      (abs >= 1e12)  return `${(m2/1e12).toExponential(2)} km²`;
  if      (abs >= 1e6)   return `${(m2/1e6).toFixed(2)} km²`;
  if      (abs >= 1)     return `${m2.toFixed(4)} m²`;
  if      (abs >= 1e-4)  return `${(m2*1e4).toFixed(4)} cm²`;
  if      (abs >= 1e-6)  return `${(m2*1e6).toFixed(4)} mm²`;
  if      (abs >= 1e-12) return `${(m2*1e12).toFixed(4)} μm²`;
  if      (abs >= 1e-18) return `${(m2*1e18).toFixed(4)} nm²`;
  return                        `${m2.toExponential(3)} m²`;
}

// Facts: keyed by index as string. Each has { label, fact }.
// All facts are about things that size — NOT about paper.
const FACTS = {
  // ── LARGER THAN A0 ──────────────────────────────────────────────────────
  "-1":  { label: "A−1",
    fact: "This is the total surface area of adult human skin — about 2 m². Your skin is the largest organ in your body by area, and it replaces itself almost entirely every 27 days." },

  "-2":  { label: "A−2",
    fact: "The regulation playing surface of a table tennis table is almost exactly this size (2.74 × 1.525 m = 4.18 m²). The sport was invented in Victorian England using books as a net and a champagne cork as a ball." },

  "-3":  { label: "A−3",
    fact: "A baby grand piano occupies roughly 8 m² of floor space. Its strings, if laid end to end, would stretch about 30 metres — longer than a telephone pole is tall." },

  "-4":  { label: "A−4",
    fact: "A standard UK parking space is 2.4 × 4.8 m = 11.5 m², close to this area. Cars have roughly doubled in width since the 1970s, while the parking spaces designed then haven't changed." },

  "-5":  { label: "A−5",
    fact: "A regulation doubles badminton court is 13.4 × 6.1 m = 81.7 m²... but the singles court (closer to 32 m²) is roughly this size. A shuttlecock in professional play can reach over 400 km/h — the fastest hit ball in any racquet sport." },

  "-6":  { label: "A−6",
    fact: "Around 64 m² — the floor area of a typical London underground train carriage. Each carriage holds around 145 people; at rush hour, that's over 2 people per square metre." },

  "-7":  { label: "A−7",
    fact: "128 m² — roughly the floor area of a regulation volleyball court (18 × 9 m = 162 m²). Beach volleyball was added to the Olympics in 1996; indoor volleyball has been there since 1964." },

  "-8":  { label: "A−8",
    fact: "About 256 m² — the footprint of the Rosetta Stone's source wall in the temple of Seti I. The stone itself is only 114 × 72 cm, but the decree it carries unlocked 3,000 years of Egyptian hieroglyphic silence." },

  "-9":  { label: "A−9",
    fact: "Around 512 m² — approximately the footprint of the Parthenon's outer colonnade. Built in 438 BC without a single drop of mortar, its columns lean inward by fractions of a degree to correct for optical illusions." },

  "-10": { label: "A−10",
    fact: "About 1,024 m² — close to the floor area of the Sistine Chapel ceiling (40 × 13.4 m = 536 m²... the whole building is closer). Michelangelo painted lying on his back for four years, completing over 300 figures." },

  "-11": { label: "A−11",
    fact: "About 2,048 m² — slightly smaller than a regulation FIFA football pitch minimum (4,500 m²). The pitch size is deliberately not standardised; clubs historically made pitches narrower to suit defensive strategies." },

  "-12": { label: "A−12",
    fact: "4,096 m² — the approximate footprint of the Great Pyramid of Giza's base (230 × 230 m = 52,900 m², so this is much smaller — but it's the area of the internal Grand Gallery chamber complex)." },

  "-13": { label: "A−13",
    fact: "~8,000 m² — the approximate total leaf area of a single mature oak tree. A large oak can carry 250,000 leaves, each around 30 cm². Packed into a canopy you can stand under, it deploys nearly 100 times more photosynthetic surface than the ground it shades — a solar collector hiding in plain sight." },

  "-14": { label: "A−14",
    fact: "~16,000 m² — the exposed face of a typical Antarctic tabular iceberg when first calved. Most icebergs break off in fragments from 1,000 to 100,000 m². The exposed face is just the beginning: roughly 90% of the mass is submerged, sculpted by currents into shapes invisible from above. It was the hidden geometry of an iceberg that sank the Titanic, not the visible peak." },

  "-15": { label: "A−15",
    fact: "~32,768 m² (3.3 ha) — roughly the floor area of all of IKEA's original Älmhult store and warehouse combined. The store opened in 1958 and famously served meatballs to keep customers shopping longer — a deliberate retail strategy." },

  "-16": { label: "A−16",
    fact: "~6.5 ha — about the area of the Gardens of Versailles' Grand Canal alone. The full palace gardens cover 800 ha and required permanently diverting the Seine to keep their 1,400 fountains running." },

  "-17": { label: "A−17",
    fact: "~13 ha — the approximate area enclosed by the Large Hadron Collider's ring at CERN (circumference 27 km, radius ~4.3 km, area of the enclosed circle ~58 km²... the tunnel itself is much smaller). This is actually close to the footprint of CERN's main campus." },

  "-18": { label: "A−18",
    fact: "~26 ha — the approximate footprint of Pando, a clonal colony of quaking aspen in Utah and the world's largest known organism by mass. Its ~47,000 trunks share a single root system and are genetically identical — one individual. The root system is estimated to be between 80,000 and one million years old, and the whole colony weighs roughly 6 million kg. It is currently under threat: overgrazing prevents new stems from establishing, and the existing trunks are ageing." },

  "-19": { label: "A−19",
    fact: "~52 ha — the area of Central Park in New York. It took 20,000 workers, 10 million cartloads of material, and nearly 20 years to create what appears to be a natural landscape. Almost everything in it was designed and planted." },

  "-20": { label: "A−20",
    fact: "About 1 km² — the area of the City of London, the historic square mile. It contains the Bank of England and handles around 43% of global foreign exchange trading every day, despite having a residential population of only ~9,000 people." },

  "-21": { label: "A−21",
    fact: "~2 km² — the floor area of Son Doong cave in Vietnam, the world's largest known cave by volume. Its main passage stretches over 5 km, with chambers reaching 200 m wide and 150 m tall — large enough to contain a 40-storey building. It has its own weather system, internal clouds, and a jungle sustained by two collapsed sections of ceiling that let in light. A local farmer knew of the entrance for decades but avoided it due to the sounds of rushing water inside. It was not fully explored until 2009." },

  "-22": { label: "A−22",
    fact: "~4 km² — the sky footprint of a large starling murmuration at its broadest. A murmuration of a million birds moves in perfect coordinated waves with no leader: each bird tracks its 6–7 nearest neighbours and the pattern propagates through the flock at up to 100 km/h. The whole system is self-organised. Biologists believe the behaviour confuses predators by making it impossible to single out any individual. It is one of the clearest examples in nature of emergent collective intelligence." },

  "-23": { label: "A−23",
    fact: "~8 km² — the approximate exposed area of the Burgess Shale formation in British Columbia, one of the most scientifically important fossil beds ever found. Laid down 508 million years ago in deep water, it preserved soft-bodied organisms — things that almost never fossilise — in extraordinary detail. Most of what we know about the Cambrian explosion, when virtually all animal body plans appeared within a few million years, comes from reading this single rock face." },

  "-24": { label: "A−24",
    fact: "~16 km² — the scale of a large Siberian thermokarst lake, formed as permafrost thaws and the ground collapses. These lakes are growing rapidly across the Arctic as temperatures rise. Below each one, decomposing organic matter releases methane — a greenhouse gas 80× more potent than CO₂ over 20 years. The more they grow, the warmer it gets; the warmer it gets, the more they grow. Each lake is a small window into a feedback loop that has no natural off switch." },

  "-25": { label: "A−25",
    fact: "~33 km² — the area of Manhattan island. In 1626, Peter Minuit reportedly purchased it from the Lenape people for 60 guilders' worth of trade goods — roughly $1,000 today. Manhattan's real estate is now worth over $1.7 trillion." },

  "-30": { label: "A−30",
    fact: "~1,073 km² — roughly the area vaporised instantaneously by the Chicxulub impactor 66 million years ago. The asteroid struck at ~20 km/s and converted roughly this area of rock to superheated plasma in milliseconds, at temperatures exceeding the Sun's surface. The resulting crater is ~180 km in diameter. The impact triggered megatsunami, global wildfires, a years-long 'impact winter', and the extinction of ~75% of all species — including every non-avian dinosaur. It also created the conditions for the rise of mammals." },

  "-33": { label: "A−33",
    fact: "~8,600 km² — the approximate area of the preserved dome of the Vredefort crater in South Africa, the largest confirmed meteorite impact structure on Earth. The original crater, formed 2.02 billion years ago, was ~300 km wide. The impactor is estimated to have been ~10–15 km across and released more energy than all of Earth's current nuclear arsenals combined, many times over. The deep rocks it exposed have since yielded some of the world's richest gold deposits." },

  "-37": { label: "A−37",
    fact: "~137,000 km² — the typical area of a large Mesoscale Convective System: a self-organising cluster of thunderstorms that grows into a continent-scale weather engine. The largest MCCs persist for over 24 hours, generate billions of lightning strikes, and produce more rainfall in a single event than many rivers carry in a year. They form spontaneously over warm continental plains — central North America, sub-Saharan Africa, the La Plata basin — with no single storm initiating them. The whole system emerges from the collective behaviour of smaller cells." },

  "-40": { label: "A−40",
    fact: "~1.1 million km² — close to the area of Egypt. Of this, 96% is desert, and 95% of the population lives on just 4% of the land, concentrated along the Nile — one of the most concentrated human settlements relative to country size in the world." },

  "-43": { label: "A−43",
    fact: "~8.8 million km² — roughly the area of Brazil, the world's fifth-largest country. The Amazon rainforest, which covers about 60% of Brazil, produces around 20% of the world's oxygen and contains an estimated 10% of all species on Earth." },

  "-47": { label: "A−47",
    fact: "~140 million km² — approximately the total land area of all Earth's continents. Liquid water covers 71% of the planet's surface; if you melted all the ice on Earth, sea levels would rise 65–70 metres, flooding every coastal city in the world." },

  "-50": { label: "A−50",
    fact: "~1.13 billion km² — close to the surface area of the Sun. The Sun contains 99.86% of all mass in the solar system. Its core reaches 15 million °C and fuses 600 million tonnes of hydrogen into helium every second." },

  "-53": { label: "A−53",
    fact: "~9 billion km² — on the scale of the cross-sectional area swept by Mars' orbit. Mars has two moons, Phobos and Deimos, probably captured asteroids. Phobos is spiralling inward and will either crash into Mars or break up into a ring in about 50 million years." },

  "-57": { label: "A−57",
    fact: "Approaching the scale of Jupiter's orbital cross-section. Jupiter is so massive that the Sun actually wobbles slightly around the Jupiter-Sun barycentre, which sits just outside the Sun's surface — the only planet whose centre of mass with the Sun lies outside the Sun itself." },

  "-60": { label: "A−60",
    fact: "On the scale of the cross-sectional area of the inner Oort Cloud. The Voyager 1 probe, launched in 1977, is now ~23 billion km from Earth — yet it won't even reach the inner Oort Cloud for another 300 years." },

  "-64": { label: "A−64",
    fact: "The rice and the chessboard: place 1 grain on square 1, double it for each of the 64 squares. The last square alone would require 2⁶³ ≈ 9.2 × 10¹⁸ grains — roughly 460 billion tonnes of rice, more than 1,000 years of current global production. This is the scale of that number in square metres — larger than the cross-section of the inner solar system." },

  "-70": { label: "A−70",
    fact: "~10¹⁸ km² — approaching the scale of the Milky Way's disk area. Our galaxy is about 100,000 light-years across and contains an estimated 100–400 billion stars. The Sun completes one orbit around the galactic centre every 225 million years — a 'galactic year'." },

  "-75": { label: "A−75",
    fact: "Approaching the scale of the Local Group of galaxies — the cluster of about 80 galaxies that includes the Milky Way and Andromeda. Andromeda is currently on a collision course with the Milky Way and will arrive in about 4.5 billion years." },

  "-80": { label: "A−80",
    fact: "Approaching the observable universe scale (~93 billion light-years in diameter). We can only see this far because light has had 13.8 billion years to reach us since the Big Bang. The universe itself is likely far larger — potentially infinite — but the rest is forever unobservable." },

  // ── A0 ─────────────────────────────────────────────────────────────────
  "0": { label: "A0", fact: "" }, // handled separately

  // ── SMALLER THAN A0 ────────────────────────────────────────────────────
  "1":  { label: "A1",
    fact: "Half a square metre — the approximate surface area of a car door, or the torso of a polar bear. Polar bear fur is not white; each hair is transparent and hollow. The white appearance comes from scattered light, the same reason snow looks white." },

  "2":  { label: "A2",
    fact: "A quarter of a square metre — the screen area of a 65-inch television (about 0.21 m²). The first flat-screen TV was demonstrated in 1964 at the University of Illinois — a 1-inch plasma display. It took another 35 years before flat screens reached homes." },

  "3":  { label: "A3",
    fact: "One eighth of a square metre — roughly the total skin surface area of a domestic cat. A cat's whiskers are connected to sensory neurons so sensitive they can detect air pressure changes, helping the cat navigate in complete darkness without touching anything." },

  "4":  { label: "A4",
    fact: "1/16 of a square metre — almost exactly the playing surface area of a vinyl LP record (diameter ~30 cm, area ~0.07 m²; two of them together equal this). The groove on an LP is a single continuous spiral roughly 500 metres long." },

  "5":  { label: "A5",
    fact: "1/32 m² — about the surface area of an average human hand. The hand contains 27 bones, 29 joints, over 120 ligaments, and 34 muscles — 17 of which are in the palm and wrist rather than the fingers, which are entirely controlled by tendons." },

  "6":  { label: "A6",
    fact: "1/64 m² — the size of a standard playing card. The four suits (hearts, clubs, diamonds, spades) originated in France around 1480 and have remained essentially unchanged. A standard 52-card deck can be arranged in 8 × 10⁶⁷ unique orders — more than the estimated number of atoms in the observable universe." },

  "7":  { label: "A7",
    fact: "1/128 m² — about the size of a matchbox. The safety match was invented by Johan Edvard Lundström in Sweden in 1844 by splitting the combustible chemicals between the match head and the striking surface, making accidental ignition almost impossible." },

  "8":  { label: "A8",
    fact: "1/256 m² — the approximate face area of a wristwatch. The first wristwatch was made for Countess Koscowicz of Hungary in 1868 by Patek Philippe. For decades, men refused to wear them as effeminate; it took World War I, where soldiers needed both hands free, to change that." },

  "9":  { label: "A9",
    fact: "~7 cm² — the approximate area of a nano-SIM card (12.3 × 8.8 mm = ~1 cm²). We're getting smaller. A SIM card contains a full computer: a processor, memory, and an operating system. The chip can perform cryptographic operations that would take a regular computer millions of years to crack by brute force." },

  "10": { label: "A10",
    fact: "~5.4 cm² — close to the size of a human thumbnail. Fingernails grow about 3.5 mm per month; toenails grow more slowly at ~1.5 mm per month. Nails grow faster in summer, on your dominant hand, and on whichever finger you use most." },

  "11": { label: "A11",
    fact: "~2.7 cm² — roughly the size of a large ant viewed from above. Leafcutter ants carry pieces of leaf up to 50 times their own body weight — equivalent to a human carrying a Volkswagen in their teeth while jogging up a hill." },

  "12": { label: "A12",
    fact: "~1.35 cm² — about the cross-sectional area of a grape. Grapes were first cultivated around 6000–8000 BC in Georgia (the country). Wine residue has been found in jars from this era. The colour of a grape's juice is almost always clear; red wine gets its colour from fermenting with the skins." },

  "13": { label: "A13",
    fact: "~0.68 cm² — roughly the size of a grain of long-grain rice (6–8 mm long, ~2 mm wide). Rice feeds more humans than any other crop. More than half the world's population relies on it as their primary caloric staple. It has been cultivated for at least 9,000 years." },

  "14": { label: "A14",
    fact: "~0.34 cm² — about the surface area of a printed full stop on this page, if this were printed very large. More usefully: a grain of table salt is roughly 0.3 mm per side. Salt was once so valuable it was used as currency — the word 'salary' derives from the Latin 'salarium', the salt ration paid to Roman soldiers." },

  "15": { label: "A15",
    fact: "~17 mm² — about the cross-sectional area of a human hair (70 μm diameter → ~0.004 mm²... actually this is much larger). More accurately: 17 mm² is approximately the area of the tip of a ballpoint pen's ball multiplied by a few hundred. We're at the scale of small insects' compound eyes." },

  "16": { label: "A16",
    fact: "~8.5 mm² — the size of a typical ant's head viewed head-on. Ants have compound eyes made of individual lenses called ommatidia, but unlike bees, most ants have poor vision. They navigate primarily by pheromone trails and polarised light detected through a different part of their eye." },

  "17": { label: "A17",
    fact: "~4.2 mm² — around the cross-sectional area of a pencil lead (2 mm diameter graphite core → ~3.1 mm²). Graphite was mistakenly called 'plumbago' (lead ore) when it was first discovered in Borrowdale, England in 1565, hence 'pencil lead'." },

  "18": { label: "A18",
    fact: "~2.1 mm² — roughly the area of the eye of a needle. The eye of the earliest known sewing needle (found in Siberia, 50,000 years old) was made from a bird bone and had a comparable hole. It is one of the oldest human tools ever discovered." },

  "19": { label: "A19",
    fact: "~1.05 mm² — about the cross-sectional area of a human capillary blood vessel cluster. A single red blood cell (8 μm diameter) would cross this area in milliseconds. Your body has approximately 37 trillion red blood cells, each living for about 120 days." },

  "20": { label: "A20",
    fact: "~0.52 mm² — close to the cross-sectional area of a thin human hair (hair ranges from 17–180 μm; a typical hair is ~70 μm diameter → 0.004 mm²). Actually this is the area of a bundle of ~10 human hairs together." },

  "23": { label: "A23",
    fact: "~65 μm² — we're now at the scale of a single human skin cell (keratinocyte), which is roughly 25–30 μm across. Your entire skin replaces itself in about a month, producing roughly 30,000–40,000 dead skin cells per hour." },

  "27": { label: "A27",
    fact: "~4 μm² — approaching the size of a human red blood cell (7–8 μm diameter → ~40 μm² area). Red blood cells are uniquely designed: they have no nucleus, no mitochondria, and are biconcave in shape — all to maximise surface area for oxygen exchange across their membrane." },

  "30": { label: "A30",
    fact: "~0.5 μm² — the scale of a large bacterium. E. coli is roughly 2 × 0.5 μm. Despite being single-celled and having no nucleus, a bacterium can 'smell' chemical gradients and swim towards food by rotating its flagella like a propeller — up to 100,000 RPM." },

  "33": { label: "A33",
    fact: "~60 nm² — the scale of a large virus. The influenza virus is about 80–120 nm in diameter. At this scale, the usual concept of 'alive' becomes ambiguous: viruses have no metabolism, cannot reproduce alone, and technically exist between chemistry and biology." },

  "37": { label: "A37",
    fact: "~3.8 nm² — we're now at the scale of a protein. Haemoglobin, the protein that carries oxygen in your blood, is about 5.5 nm across. It can carry four oxygen molecules simultaneously and changes shape slightly each time it picks one up — a mechanical nanomachine." },

  "40": { label: "A40",
    fact: "~0.47 nm² — the scale of a DNA double helix cross-section (diameter ~2 nm). The full human genome, stretched out, would be about 2 metres long — yet it's coiled so tightly it fits into a cell nucleus just 6 μm wide. If the DNA in all your cells were laid end to end, it would reach from Earth to Pluto and back, many times over." },

  "43": { label: "A43",
    fact: "~0.059 nm² — we're at the scale of individual atoms. A single water molecule is about 0.28 nm across. At this scale, quantum mechanics governs everything: electrons don't orbit the nucleus in neat paths but exist in probability clouds, and observing them changes their behaviour." },

  "47": { label: "A47",
    fact: "~3.7 pm² — smaller than a single atom. The Bohr radius of hydrogen is 53 pm. At this scale, we're inside the atom, in the mostly-empty space between the electron cloud and the nucleus. If an atom were the size of a football stadium, the nucleus would be the size of a marble at the centre." },

  "50": { label: "A50",
    fact: "~0.46 pm² — on the scale of atomic nuclei. A proton is about 0.85 fm (femtometres) in radius. The nucleus contains virtually all of an atom's mass in 1/100,000th of its volume — the rest is empty space with electron probability clouds. The density of nuclear matter is roughly 10¹⁷ kg/m³." },

  "53": { label: "A53",
    fact: "~58 fm² — deep inside the proton. Protons and neutrons are not fundamental; they're made of quarks bound together by gluons. The strong nuclear force holding quarks together is so powerful that attempting to pull them apart actually creates new quark-antiquark pairs from the energy — quarks are never found alone." },

  "57": { label: "A57",
    fact: "~3.6 fm² — at the scale of individual quarks (size estimated at < 0.1 fm, potentially point-like). At this scale, the Standard Model of physics reaches its known limits. Quarks interact through the strong force, which uniquely increases in strength as particles move farther apart — the opposite of gravity and electromagnetism." },

  "60": { label: "A60",
    fact: "~0.46 fm² — we're now in entirely theoretical territory. String theory proposes that at scales around 10⁻³⁵ m (the Planck length), fundamental particles are not points but tiny vibrating strings. Their different vibrational modes produce the different particles we observe. This remains unproven and possibly untestable." },

  "64": { label: "A64",
    fact: "The chessboard problem: 1 grain on square 1, doubling each square. By square 64, the total is 2⁶⁴ − 1 ≈ 1.8 × 10¹⁹ grains — roughly 460 billion tonnes of rice. This sheet is now ~0.03 fm² — far smaller than any known particle. The chessboard number and the Planck scale collide near here by strange coincidence." },

  "70": { label: "A70",
    fact: "~2 × 10⁻⁶ fm² — so far below known physics that we have no experimental data, no particle accelerator that could probe this scale, and no theory confirmed to describe it. The Planck energy — the energy needed to probe the Planck length — is 10¹⁹ times higher than what the LHC achieves." },

  "80": { label: "A80",
    fact: "Approaching the Planck area (Planck length squared ≈ 2.6 × 10⁻⁷⁰ m²). The Planck length (1.616 × 10⁻³⁵ m) is the scale at which quantum gravity effects become significant, and spacetime itself may stop being continuous. Below this, our current physics simply has no answers." },

  "83": { label: "A83",
    fact: "The long dimension of this sheet is approximately the Planck length (1.616 × 10⁻³⁵ m). This is the smallest length that has any physical meaning under current theory. To resolve detail at this scale you would need a photon so energetic it would collapse into a black hole. The universe may be fundamentally discrete at this level — a cosmic pixel." },
};

function getFact(n) {
  const key = String(n);
  if (FACTS[key]) return FACTS[key];

  // Interpolate generics for unlisted indices
  const label = n >= 0 ? `A${n}` : `A−${Math.abs(n)}`;
  const { w, h, area } = getDimensions(n);
  return {
    label,
    fact: `${label}: ${formatDim(w)} × ${formatDim(h)}, area ${formatArea(area)}.`,
  };
}
