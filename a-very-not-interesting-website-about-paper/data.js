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
    fact: "At roughly 2–3 m, you're at the wavelength of FM radio (87–108 MHz ≈ 2.8–3.4 m). FM waves pass through walls and rain effortlessly. Edwin Armstrong invented FM radio in the 1930s; RCA — which owned AM — tried to suppress it for years, reassigned his frequencies, and fought him in court until he died. FM won anyway." },

  "-3":  { label: "A−3",
    fact: "At ~4 m, you're at the height of a high ceiling. A 2012 study found that people in rooms with higher ceilings consistently score better on abstract and creative thinking tasks compared to low-ceilinged rooms. Architects call this the 'cathedral effect'. The effect is measurable, reproducible, and poorly understood." },

  "-4":  { label: "A−4",
    fact: "At ~5 m — the approximate length of a sperm whale's head (one-third of its 16 m body). The sperm whale has the largest brain of any animal (~8 kg). Its sonar clicks are among the loudest sounds produced by any animal — loud enough to stun or kill squid at close range. The clicks are formed not by vocal cords but by pressurised oil-filled organs in the forehead." },

  "-5":  { label: "A−5",
    fact: "At ~6–8 m, you're at the scale of a giraffe standing up. A giraffe's heart must pump blood 2.5 m straight up to reach the brain, generating blood pressure roughly twice that of humans. A pressure-regulating valve in the neck prevents cerebral haemorrhage when the giraffe lowers its head to drink — evolution's engineering solution to a self-created problem." },

  "-6":  { label: "A−6",
    fact: "Around 64 m² — the floor area of a typical London underground train carriage. Each carriage holds around 145 people; at rush hour, that's over 2 people per square metre." },

  "-7":  { label: "A−7",
    fact: "At ~11–16 m: the wingspan of Quetzalcoatlus northropi, the largest known flying animal that ever lived. It weighed only ~250 kg — less than a modern horse — and launched itself into the air using its forelimbs like a vaulting pole. It could likely soar at ~120 km/h across the late Cretaceous sky." },

  "-8":  { label: "A−8",
    fact: "About 256 m² — the footprint of the Rosetta Stone's source wall in the temple of Seti I. The stone itself is only 114 × 72 cm, but the decree it carries unlocked 3,000 years of Egyptian hieroglyphic silence." },

  "-9":  { label: "A−9",
    fact: "Around 512 m² — approximately the footprint of the Parthenon's outer colonnade. Built in 438 BC without a single drop of mortar, its columns lean inward by fractions of a degree to correct for optical illusions at a distance." },

  "-10": { label: "A−10",
    fact: "At ~32–45 m, you're at the height of a mature redwood — not the giants, but a large one. More strikingly: plants capture sunlight through a quantum mechanical trick. During photosynthesis, energy doesn't hop randomly between molecules — it travels as a quantum coherence wave, sampling all possible pathways simultaneously and collapsing to the most efficient one. Living things running quantum algorithms, in plain sight." },

  "-11": { label: "A−11",
    fact: "At ~45–64 m: the body length of Patagotitan mayorum, the largest known dinosaur, was ~37 m. At 64 m, you're looking at the largest wave ever reliably measured: a 29.1 m rogue wave (Draupner platform, North Sea, 1995) — more than twice the surrounding sea state, arriving from nowhere. Rogue waves were considered sailor myth until this one was recorded instrumentally." },

  "-12": { label: "A−12",
    fact: "4,096 m² — the approximate footprint of the Great Pyramid of Giza's base (230 × 230 m = 52,900 m², so this is much smaller — but it's the area of the internal Grand Gallery chamber complex)." },

  "-13": { label: "A−13",
    fact: "~8,000 m² — the approximate total leaf area of a single mature oak tree. A large oak can carry 250,000 leaves, each around 30 cm². Packed into a canopy you can stand under, it deploys nearly 100 times more photosynthetic surface than the ground it shades — a solar collector hiding in plain sight." },

  "-14": { label: "A−14",
    fact: "~16,000 m² — the exposed face of a typical Antarctic tabular iceberg when first calved. Roughly 90% of the mass is submerged, sculpted by currents into shapes invisible from above. It was the hidden geometry of an iceberg that sank the Titanic, not the visible peak." },

  "-15": { label: "A−15",
    fact: "At ~180–250 m: the depth of the ocean's twilight zone boundary. Every evening, hundreds of millions of fish, squid, and crustaceans migrate from ~600 m up to the surface to feed, then descend again at dawn — the largest daily animal migration on Earth. The layer was discovered in WWII when sonar operators thought their equipment was broken: it reflected pings like a false seafloor, rising and falling with the sun." },

  "-16": { label: "A−16",
    fact: "At ~256–362 m: the depth where sperm whales switch from aerobic to anaerobic metabolism during dives. They routinely reach 1,000–2,000 m, holding their breath for 90 minutes. To do it, their blood carries ~3× more oxygen per litre than human blood, their heart slows to ~3 beats per minute, and blood is shunted away from muscles and digestive organs to the brain." },

  "-17": { label: "A−17",
    fact: "~13 ha — the approximate area enclosed by the Large Hadron Collider's ring at CERN (circumference 27 km, radius ~4.3 km, area of the enclosed circle ~58 km²... the tunnel itself is much smaller). This is actually close to the footprint of CERN's main campus." },

  "-18": { label: "A−18",
    fact: "~26 ha — the approximate footprint of Pando, a clonal colony of quaking aspen in Utah and the world's largest known organism by mass. Its ~47,000 trunks share a single root system and are genetically identical. The root system is estimated to be up to one million years old. It is currently under threat: overgrazing prevents new stems from establishing." },

  "-19": { label: "A−19",
    fact: "At ~700 m–1 km: the human eye can detect a candle flame at 1.6 km in total darkness. The eye's rod cells respond to single photons. You are, in the dark, a quantum light detector. The signals from individual photons are amplified by a cascade of ~1 million protein activations before reaching the brain as a perceived signal." },

  "-20": { label: "A−20",
    fact: "At ~1–1.5 km: sound travels approximately 1 km in 3 seconds. Counting seconds between lightning and thunder to estimate distance was known to the ancient Greeks. The same principle — measuring time delays to infer distance — underlies sonar, radar, seismology, and the original measurement of the speed of light by Rømer in 1676 using the timing of Jupiter's moon eclipses." },

  "-21": { label: "A−21",
    fact: "At ~1.5–2 km: the depth of the Vostok ice core in Antarctica. At 2 km depth, ice cores contain air bubbles from ~160,000 years ago. The Vostok record, extending to 3,769 m, revealed that CO₂ levels have tracked global temperature through four complete glacial cycles. This data — pulled from ancient air trapped in ice — is the clearest physical record we have of the climate system's natural behaviour." },

  "-22": { label: "A−22",
    fact: "~4 km² — the sky footprint of a large starling murmuration. A million birds move in perfect coordinated waves with no leader: each bird tracks its 6–7 nearest neighbours and the pattern propagates at up to 100 km/h. No individual knows the shape of the whole. It is one of the most striking examples in nature of emergent collective behaviour from purely local rules." },

  "-23": { label: "A−23",
    fact: "At ~3–4 km: the depth of ocean hydrothermal vents, where life exists with no sunlight, sustained by chemical energy from Earth's interior. Discovered in 1977, these ecosystems overturned the assumption that all life depends on the Sun. Some scientists now believe the origin of life itself occurred at similar vents — making these the most likely birthplace of every living thing on Earth." },

  "-24": { label: "A−24",
    fact: "~16 km² — the scale of a large Siberian thermokarst lake, formed as permafrost thaws and the ground collapses. These lakes are growing rapidly. Below each one, decomposing organic matter releases methane — 80× more potent than CO₂ over 20 years. The more they grow, the warmer it gets; the warmer it gets, the more they grow. Each lake is a window into a self-amplifying feedback loop." },

  "-25": { label: "A−25",
    fact: "At ~6–8 km: the 'death zone' begins at 8,000 m, where atmospheric pressure is one-third of sea level and the body cannot acclimatise. Haemoglobin's ability to carry oxygen at altitude is a quantum mechanical property of the iron-porphyrin ring at its core. Fourteen mountains exceed 8,000 m. The first summit of Everest (8,849 m) in 1953 was the edge of what human physiology can survive unaided." },

  "-26": { label: "A−26",
    fact: "At ~8–12 km: the depth of Challenger Deep (~10,935 m), the deepest point in the ocean. Life exists here: bacteria, amphipods, and sea cucumbers adapted to ~1,100 atmospheres of pressure. In 2020, researchers found microplastics in organisms at the bottom — within decades of industrial plastic production beginning. The deepest parts of the ocean were still being contaminated before they were ever explored." },

  "-27": { label: "A−27",
    fact: "At ~12–16 km: commercial aircraft cruising altitude. At 11,000 m the temperature is −56 °C and an unprotected human loses consciousness in seconds. Large cumulonimbus clouds can punch into this zone. Near thunderstorm tops, gamma-ray bursts have been detected — high-energy photons creating electron-positron pairs from lightning's electric fields. Thunderstorms produce antimatter." },

  "-28": { label: "A−28",
    fact: "At ~16–23 km: the middle stratosphere. The 1991 eruption of Pinatubo injected SO₂ to ~25 km altitude, lowering global temperatures by ~0.5 °C for two years by reflecting sunlight. A single volcanic eruption measurably altered the planet's energy balance, visible in global temperature records. This same mechanism — stratospheric aerosol injection — is now being studied as a potential emergency lever for climate intervention." },

  "-29": { label: "A−29",
    fact: "At ~23–33 km: the upper stratosphere and peak ozone concentration. A hurricane eye, at its widest, is ~30–80 km across — close to this scale. The eye forms because intense rotation creates a pressure minimum at the centre, causing air to sink and suppress cloud formation. The calm inside a hurricane is real: clear skies, low winds, yet surrounded by the most violent weather on Earth." },

  "-30": { label: "A−30",
    fact: "~1,073 km² — roughly the area vaporised instantaneously by the Chicxulub impactor 66 million years ago. The asteroid struck at ~20 km/s, triggering megatsunami, global wildfires, and a years-long 'impact winter'. It ended the non-avian dinosaurs — and made space for mammals to diversify into every ecological niche they left behind." },

  "-31": { label: "A−31",
    fact: "At ~46–65 km: the altitude at which most meteors burn up (60–80 km). The Toba supervolcanic eruption ~74,000 years ago may have reduced the human population to fewer than 10,000 individuals — a bottleneck visible in the genetic similarity of all people alive today. Every human alive may descend from a population smaller than a village." },

  "-32": { label: "A−32",
    fact: "At ~65–93 km: noctilucent clouds form at ~82 km altitude from ice crystals condensing around meteoric dust. They glow electric blue at twilight and are only visible from high latitudes in summer. They have been increasing in frequency — possibly linked to methane emissions increasing upper-atmosphere water vapour. They are both beautiful and an early indicator of atmospheric change." },

  "-33": { label: "A−33",
    fact: "~8,600 km² — the approximate area of the Vredefort crater dome in South Africa, the largest confirmed impact structure on Earth. Formed 2 billion years ago, the deep rocks it exposed have since yielded some of the world's richest gold deposits. The impactor released more energy than all of Earth's nuclear arsenals combined, many times over." },

  "-34": { label: "A−34",
    fact: "At ~130–185 km: the altitude of the thermosphere, where auroras occur. The Northern Lights happen at 100–300 km altitude when solar wind particles energise oxygen and nitrogen molecules to emit visible light. The oxygen green line (557.7 nm) is the most common colour; the red line (630 nm) occurs higher up. Each aurora is a realtime map of the solar wind hitting Earth's magnetic field." },

  "-35": { label: "A−35",
    fact: "At ~185–260 km: the lowest altitude for a stable satellite orbit. Below this, atmospheric drag causes rapid decay. The Antarctic ozone hole at its maximum annual extent reaches roughly this lateral scale. Ozone depletion was caused by CFCs catalysing ozone destruction on polar stratospheric cloud particles — chemistry predicted in 1974, confirmed in 1985, banned by 1987. The ozone layer is slowly recovering." },

  "-36": { label: "A−36",
    fact: "At ~260–370 km: the orbital altitude of the International Space Station (~400 km). From there, orbital speed is 7.7 km/s — you see 16 sunrises per day. The entire ISS weighs ~420 tonnes and is the most expensive object ever constructed. It has been continuously inhabited since November 2000, making it the longest continuous human presence beyond Earth's surface." },

  "-37": { label: "A−37",
    fact: "~137,000 km² — the typical area of a large Mesoscale Convective System: a self-organising cluster of thunderstorms. The largest persist for 24+ hours, generating billions of lightning strikes and more rainfall than many rivers carry in a year. They emerge spontaneously from the collective behaviour of smaller cells — the whole system has properties none of the individual storms possess." },

  "-38": { label: "A−38",
    fact: "At ~370–520 km: the scale of a large volcanic caldera. The Chicxulub impact's seismic energy circled the Earth for weeks. Modern seismographs detect earthquakes anywhere on Earth because P-waves travel at ~7 km/s through the interior, revealing Earth's layered structure — crust, mantle, liquid outer core, solid inner core — which cannot be seen or drilled to directly." },

  "-39": { label: "A−39",
    fact: "At ~520–740 km: the diameter of Ceres (~940 km), the largest asteroid belt object. Ceres was a planet from 1801–1850, then an asteroid, then demoted to dwarf planet in 2006 — the same year as Pluto. It has bright white spots in its craters: sodium carbonate deposits left by briny water that evaporated after impacts. Ceres may still have active geology." },

  "-40": { label: "A−40",
    fact: "~1.1 million km² — close to the area of Egypt. Of this, 96% is desert, and 95% of the population lives on just 4% of the land, concentrated along the Nile — one of the most concentrated human settlements relative to country size in the world." },

  "-41": { label: "A−41",
    fact: "At ~1,000–1,500 km: seismic P-waves travel at ~7 km/s, so 1,000 km corresponds to roughly 2.5 minutes after a major earthquake. Global seismograph networks can triangulate an earthquake's location within minutes. By analysing wave arrival times and shadow zones, we mapped Earth's internal layers — core, mantle, crust — entirely from the outside, without ever reaching them." },

  "-42": { label: "A−42",
    fact: "At ~1,500–2,100 km: the scale of medium-sized icy moons. Enceladus (504 km) is smaller, but at this scale we find moons like Titania and Oberon (Uranus). Enceladus actively sprays liquid water into space from geysers — water containing organic molecules and hydrogen, consistent with hydrothermal vent chemistry. A world the size of a small country is, right now, venting an ocean into space." },

  "-43": { label: "A−43",
    fact: "At ~2,500–3,500 km: the diameter of the Moon is 3,474 km. The Moon formed ~4.5 billion years ago from debris when a Mars-sized object called Theia struck the young Earth. Without a large moon, Earth's axial tilt would wobble chaotically over millions of years, destabilising climate on long timescales. The Moon may be the reason Earth has had the stable climate conditions needed for complex life to evolve." },

  "-44": { label: "A−44",
    fact: "At ~2,100–3,000 km: Pluto's moon Charon (1,212 km) is smaller; Mercury (4,879 km) is larger. At this scale we find the largest Kuiper Belt objects: Eris (~2,326 km), Makemake (~1,434 km). The discovery of Eris in 2005 — slightly larger than Pluto — triggered the 2006 reclassification that demoted Pluto. The outer solar system likely contains hundreds of objects at least this size, most undiscovered." },

  "-45": { label: "A−45",
    fact: "At ~3,000–4,200 km: the Moon (3,474 km) and Mercury (4,879 km) bracket this range. Mercury has a disproportionately huge iron core — ~85% of its radius — probably because a giant early impact stripped away most of its mantle. Despite being close to the Sun, Mercury has water ice at its poles, permanently hidden in shadowed craters that sunlight never reaches." },

  "-46": { label: "A−46",
    fact: "At ~4,200–5,900 km: Mars (6,779 km) is just above this range. Triton — Neptune's largest moon (2,707 km) — orbits backwards, captured from the Kuiper Belt. It has active nitrogen geysers despite a surface temperature of −235 °C, making it one of the few geologically active moons in the outer solar system. In ~3.6 billion years it will be torn apart by Neptune's tides and form a ring." },

  "-47": { label: "A−47",
    fact: "~140 million km² — approximately the total land area of all Earth's continents. If you melted all the ice on Earth, sea levels would rise 65–70 metres, flooding every coastal city in the world. All the ice currently on Earth contains enough fresh water to fill the oceans to a depth of about 70 metres." },

  "-48": { label: "A−48",
    fact: "At ~5,900–8,400 km: Earth (12,742 km) is ~1.5× this scale. Earth is the only planet in the solar system with active plate tectonics, which recycles the crust through the mantle and regulates the carbon cycle on geological timescales — Earth's thermostat. Venus, almost identical in size, has no plate tectonics and has experienced runaway greenhouse warming to 465 °C." },

  "-49": { label: "A−49",
    fact: "At ~8,400–11,800 km: Earth's diameter (12,742 km) is just outside this range. We know the structure of Earth's interior — liquid outer core, solid inner core — purely from seismic waves. S-waves cannot travel through liquid, so the 'shadow zone' on the far side of earthquakes reveals the liquid core. The solid inner core was discovered in 1936 from global earthquake records, without drilling anywhere near it." },

  "-50": { label: "A−50",
    fact: "~1.13 billion km² — close to the surface area of the Sun. The Sun contains 99.86% of all mass in the solar system. Its core reaches 15 million °C and fuses 600 million tonnes of hydrogen into helium every second. The energy produced takes ~100,000 years to random-walk from the core to the surface; then 8 minutes to reach Earth." },

  "-51": { label: "A−51",
    fact: "At ~12,000–17,000 km: we're between Earth-scale and ice giant-scale. Neptune (49,244 km) is ~3× larger. Neptune was predicted mathematically before it was observed — irregularities in Uranus's orbit led two astronomers independently to calculate where an unseen planet must be. When telescopes were pointed at the predicted position in 1846, Neptune was found within 1° of the prediction. It was the first planet discovered by pure mathematics." },

  "-52": { label: "A−52",
    fact: "At ~17,000–24,000 km: GPS satellites orbit at ~20,200 km altitude. GPS works by timing signals from four satellites carrying atomic clocks accurate to ~10 nanoseconds. Without correcting for both special relativity (clocks moving fast run slow) and general relativity (clocks in weaker gravity run fast), GPS would accumulate ~10 km of error per day. GPS is the most widely used practical application of Einstein's theories." },

  "-53": { label: "A−53",
    fact: "~9 billion km² — on the scale of the cross-sectional area swept by Mars' orbit. Mars has two moons, Phobos and Deimos, probably captured asteroids. Phobos is spiralling inward and will either crash into Mars or break up into a ring in about 50 million years." },

  "-54": { label: "A−54",
    fact: "At ~24,000–33,000 km: geostationary orbit sits at ~35,786 km altitude — within range. There are over 400 geostationary satellites in a ring around Earth's equator. Arthur C. Clarke calculated this orbit in 1945 and proposed using it for global communications — 12 years before the first satellite was launched. The geostationary belt is now a managed, finite resource, with orbital slots assigned by international treaty." },

  "-55": { label: "A−55",
    fact: "At ~33,000–47,000 km: the scale of Saturn's inner rings. Despite being ~270,000 km wide, Saturn's rings average only ~10 metres thick — like a sheet of paper scaled up to a continent. The rings are geologically young: possibly only 100–400 million years old, formed after the dinosaurs appeared on Earth. They may be gone within 100 million years, dissolved by the planet's own gravity." },

  "-56": { label: "A−56",
    fact: "At ~47,000–67,000 km: the current size of Jupiter's Great Red Spot (~16,000 × 25,000 km). This anticyclonic storm has been observed for at least 350 years and was once 40,000 km wide — large enough to contain three Earths. It has been steadily shrinking and may disappear within decades. Its red colour is thought to come from organic compounds produced by UV radiation acting on ammonia in the upper atmosphere." },

  "-57": { label: "A−57",
    fact: "Approaching the scale of Jupiter's orbital cross-section. Jupiter is so massive that the Sun actually wobbles slightly around the Jupiter-Sun barycentre, which sits just outside the Sun's surface — the only planet whose centre of mass with the Sun lies outside the Sun itself." },

  "-58": { label: "A−58",
    fact: "At ~67,000–94,000 km: approaching Jupiter's diameter (139,820 km). Jupiter's Galilean moons are in a gravitational resonance: for every orbit of Ganymede, Europa orbits twice and Io orbits four times. This resonance pumps energy into Io's interior, driving 400 active volcanoes — more than anywhere else in the solar system. Io is continuously turning itself inside out." },

  "-59": { label: "A−59",
    fact: "At ~94,000–134,000 km: Jupiter's diameter (139,820 km) is just above this scale. Jupiter is so large it barely avoids being a star — it would need to be ~80× more massive to sustain hydrogen fusion. If it had collapsed into a brown dwarf instead, the inner solar system would be bathed in radiation and Earth might not exist." },

  "-60": { label: "A−60",
    fact: "On the scale of the cross-sectional area of the inner Oort Cloud. The Voyager 1 probe, launched in 1977, is now ~23 billion km from Earth — yet it won't even reach the inner Oort Cloud for another 300 years." },

  "-61": { label: "A−61",
    fact: "At ~134,000–189,000 km: the scale of the Sun's inner corona. The corona is mysteriously hotter than the Sun's surface below it — 1–3 million K versus 5,778 K. The Parker Solar Probe, launched 2018, entered the corona in 2021 and found that heating is driven by 'switchback' reversals in the magnetic field that release stored energy as plasma jets. The mystery is solved in outline, but the details are still being worked out." },

  "-62": { label: "A−62",
    fact: "At ~189,000–267,000 km: halfway to the Moon (~384,400 km). The Moon is receding from Earth at ~3.8 cm per year due to tidal friction. When it formed 4.5 billion years ago, it was ~20× closer, and a day lasted only ~6 hours. The tidal braking that slows Earth's rotation will continue until Earth and Moon are mutually tidally locked — Earth always showing the same face to the Moon, as the Moon already does to Earth." },

  "-63": { label: "A−63",
    fact: "At ~267,000–378,000 km: approaching the Moon's orbit (~384,400 km). The gravitational differential between Earth's near and far sides creates ocean tides, displacing ~45 cm of water globally twice daily. The same tidal force is responsible for all the geologically active icy moons in the outer solar system — Europa, Enceladus, Io — because Jupiter and Saturn squeeze their moons far more violently than Earth squeezes our Moon." },

  "-64": { label: "A−64",
    fact: "The rice and the chessboard: place 1 grain on square 1, double it for each of the 64 squares. The last square alone would require 2⁶³ ≈ 9.2 × 10¹⁸ grains — roughly 460 billion tonnes of rice, more than 1,000 years of current global production. This is the scale of that number in square metres — larger than the cross-section of the inner solar system." },

  "-65": { label: "A−65",
    fact: "At ~378,000–535,000 km: just beyond the Moon's orbit. Solar prominences — loops of plasma erupting from the Sun's surface — routinely reach hundreds of thousands of km in height. The largest recorded prominence extended ~800,000 km. These structures are shaped entirely by magnetic field lines. When they collapse, they release the energy of millions of nuclear bombs in seconds." },

  "-66": { label: "A−66",
    fact: "At ~535,000–756,000 km: the orbital radius of Io, Jupiter's innermost Galilean moon (~422,000 km), and Europa (~671,000 km) bracket this range. Europa has a liquid water ocean beneath its ice shell, with twice the volume of all Earth's oceans combined. It is, by most measures, the solar system's most promising place to look for life beyond Earth." },

  "-67": { label: "A−67",
    fact: "At ~756,000–1,069,000 km: the Sun's radius is ~696,000 km, so we're now about 1–1.5 solar radii from its centre. The solar wind — a continuous stream of charged particles — blows outward from the surface at ~400 km/s. Every planet in the solar system is technically inside the Sun's extended atmosphere, which doesn't end until the heliopause at ~120 AU." },

  "-68": { label: "A−68",
    fact: "At ~1.1–1.5 million km: the diameter of the Sun (~1.39 million km) sits within this range. The Sun contains 99.86% of the solar system's mass, yet its density is low enough that it could float on water if you could find a bathtub large enough. A photon produced in the solar core takes ~100,000 years to random-walk to the surface — then 8 minutes to reach Earth." },

  "-69": { label: "A−69",
    fact: "At ~1.5–2.1 million km: the Earth-Sun L1 Lagrange point (~1.5 million km) sits here. Space weather observatories like SOHO, DSCOVR, and ACE orbit L1, giving 15–45 minutes warning before solar storms hit Earth. Without this warning time, a major Carrington-class event — like the 1859 storm that melted telegraph wires across Europe — could knock out satellites, GPS, and power grids worldwide with no notice." },

  "-70": { label: "A−70",
    fact: "~10¹⁸ km² — approaching the scale of the Milky Way's disk area. Our galaxy is about 100,000 light-years across and contains an estimated 100–400 billion stars. The Sun completes one orbit around the galactic centre every 225 million years — a 'galactic year'." },

  "-71": { label: "A−71",
    fact: "At ~2.1–3.0 million km: roughly 10 solar diameters. Close binary star systems are separated by distances like this. When a white dwarf in a close binary accretes enough mass from a companion, it can trigger a thermonuclear explosion on its surface — a nova, briefly outshining the entire galaxy. Recurrent novae repeat every few years to decades, depending on the accretion rate." },

  "-72": { label: "A−72",
    fact: "At ~3–4.2 million km: the scale of separation between very close binary stars. Some exoplanets have been found orbiting both stars in a binary system simultaneously — 'circumbinary' planets, like Tatooine in Star Wars. They're real. Kepler discovered dozens. Their orbits are complex, but stable zones exist at large enough radii that planetary formation is possible." },

  "-73": { label: "A−73",
    fact: "At ~4.2–6 million km: the innermost exoplanets in 'ultra-hot Jupiter' systems orbit this close to their host stars, completing an orbit in ~1–2 days. They are tidally locked — one face permanently at ~2,000 °C, the other in permanent darkness. Strong winds redistribute heat at ~10,000 km/h. How they got so close — disk migration, scattering, tidal capture — is still debated." },

  "-74": { label: "A−74",
    fact: "At ~6–8.5 million km: comparable distances exist in the Sun-Mars system's Lagrange points. The zodiacal light — a faint pyramid of light visible before dawn or after dusk — is sunlight scattered by interplanetary dust at distances of ~10–200 million km. This dust is mostly ground-up comets and asteroids, continuously produced and continuously blown outward by radiation pressure. The solar system is not empty; it is filled with ancient debris." },

  "-75": { label: "A−75",
    fact: "Approaching the scale of the Local Group of galaxies — the cluster of about 80 galaxies that includes the Milky Way and Andromeda. Andromeda is currently on a collision course with the Milky Way and will arrive in about 4.5 billion years." },

  "-76": { label: "A−76",
    fact: "At ~330–460 million km: the asteroid belt (2.2–3.2 AU, ~330–480 million km) occupies this scale range. Despite appearing dense in sci-fi films, the belt is 99.9% empty space. Its total mass is less than 4% of the Moon's — the gravity of nearby Jupiter prevented it from coalescing into a planet. The few hundred thousand objects larger than 1 km are spread across a volume vastly larger than the inner solar system." },

  "-77": { label: "A−77",
    fact: "At ~460–650 million km: Jupiter at 5.2 AU (~778 million km) is just beyond this scale. Jupiter's Kirkwood gaps — empty zones in the asteroid belt — are defined by orbital resonances with Jupiter. Any asteroid that settles into a 3:1 or 2:1 resonance gets repeatedly nudged by Jupiter's gravity until its orbit becomes eccentric enough to cross Earth's. Jupiter both shields Earth from some asteroids and creates the conditions that send others toward it." },

  "-78": { label: "A−78",
    fact: "At ~660–930 million km: Jupiter orbits at ~778 million km and Saturn at ~1.43 billion km. Jupiter's Trojan asteroids cluster at its L4 and L5 Lagrange points (~60° ahead and behind in its orbit). There are ~1 million Trojans larger than 1 km — as many as the entire main asteroid belt. They are primitive, undifferentiated remnants of solar system formation, largely unchanged for 4.5 billion years." },

  "-79": { label: "A−79",
    fact: "At ~930 million–1.3 billion km: Saturn orbits at ~1.43 billion km and has 146 confirmed moons — the most of any planet. Enceladus (504 km) actively vents ocean water into space from geysers at its south pole, providing material for Saturn's E ring. The vented water contains organic molecules and silica particles consistent with hydrothermal vent chemistry. A world is leaking its ocean into space, live." },

  "-80": { label: "A−80",
    fact: "Approaching the observable universe scale (~93 billion light-years in diameter). We can only see this far because light has had 13.8 billion years to reach us since the Big Bang. The universe itself is likely far larger — potentially infinite — but the rest is forever unobservable." },

  // ── A0 ─────────────────────────────────────────────────────────────────
  "0": { label: "A0", fact: "" }, // handled separately

  // ── SMALLER THAN A0 ────────────────────────────────────────────────────
  "1":  { label: "A1",
    fact: "Half a square metre — the approximate surface area of a polar bear's torso. Polar bear fur is not white; each hair is transparent and hollow. The white appearance comes from scattered light, the same reason snow looks white." },

  "2":  { label: "A2",
    fact: "A quarter of a square metre — the screen area of a 65-inch television. The first flat-screen TV was demonstrated in 1964 at the University of Illinois — a 1-inch plasma display. It took another 35 years before flat screens reached homes." },

  "3":  { label: "A3",
    fact: "One eighth of a square metre — roughly the total skin surface area of a domestic cat. A cat's whiskers are connected to sensory neurons so sensitive they can detect air pressure changes, helping the cat navigate in complete darkness without touching anything." },

  "4":  { label: "A4",
    fact: "1/16 of a square metre — almost exactly the playing surface area of a vinyl LP record. The groove on an LP is a single continuous spiral roughly 500 metres long." },

  "5":  { label: "A5",
    fact: "1/32 m² — about the surface area of an average human hand. The hand contains 27 bones, 29 joints, over 120 ligaments, and 34 muscles — 17 of which are in the palm and wrist, not the fingers. The fingers are entirely controlled by tendons, like a puppet." },

  "6":  { label: "A6",
    fact: "1/64 m² — the size of a standard playing card. A standard 52-card deck can be arranged in 8 × 10⁶⁷ unique orders — more than the estimated number of atoms in the observable universe. Every time you shuffle a deck, you are almost certainly producing an arrangement that has never existed before." },

  "7":  { label: "A7",
    fact: "1/128 m² — about the size of a matchbox. The safety match was invented in Sweden in 1844 by splitting the combustible chemicals between the match head and the striking surface, making accidental ignition almost impossible. The friction match before it was genuinely dangerous — it could ignite against any rough surface, including trouser pockets." },

  "8":  { label: "A8",
    fact: "1/256 m² — the approximate face area of a wristwatch. For decades, men refused to wear wristwatches as effeminate; it took World War I, where soldiers needed both hands free in the trenches, to normalise them. Fashion changed because of trench warfare." },

  "9":  { label: "A9",
    fact: "~7 cm² — the approximate area of a standard SIM card. A SIM contains a full computer: processor, memory, and operating system. The chip can perform cryptographic operations that would take a conventional computer millions of years to crack by brute force. Your phone's identity is secured by mathematics, not by lock and key." },

  "10": { label: "A10",
    fact: "~5.4 cm² — close to the size of a human thumbnail. Fingernails grow about 3.5 mm per month; toenails ~1.5 mm. Nails grow faster in summer, on the dominant hand, and on the most-used finger. The mechanism is not fully understood." },

  "11": { label: "A11",
    fact: "~2.7 cm² — roughly the size of a large ant viewed from above. Leafcutter ants carry pieces of leaf up to 50 times their own body weight — the equivalent of a human carrying a small car in their teeth while jogging uphill." },

  "12": { label: "A12",
    fact: "~1.35 cm² — about the cross-sectional area of a grape. Grapes were first cultivated around 6000–8000 BC in Georgia. The colour of a grape's juice is almost always clear; red wine gets its colour from fermenting with the skins, not from the juice." },

  "13": { label: "A13",
    fact: "~0.68 cm² — roughly the size of a grain of long-grain rice. Rice feeds more humans than any other crop. It has been cultivated for at least 9,000 years and today provides ~20% of all calories consumed by humans globally." },

  "14": { label: "A14",
    fact: "~0.34 cm² — about the area of a grain of table salt. Salt was once so valuable it was used as currency. The word 'salary' derives from the Latin 'salarium' — the salt ration paid to Roman soldiers. At various points in history, salt was literally worth its weight in gold in certain regions." },

  "15": { label: "A15",
    fact: "~17 mm² — we're at the scale of small insects' compound eyes. A compound eye contains up to 30,000 individual lenses (ommatidia), each pointing in a slightly different direction. Dragonflies have nearly 360° vision and can track a single prey item in a swarm, catching it in mid-air with ~95% success — the highest hunting success rate of any animal." },

  "16": { label: "A16",
    fact: "~8.5 mm² — the size of a typical ant's head viewed head-on. Most ants navigate primarily by pheromone trails and polarised light, with relatively poor spatial vision. Army ants have no fixed nest — they bivouac as a living structure using their own bodies as walls, floors, and ceilings, reforming every night." },

  "17": { label: "A17",
    fact: "~4.2 mm² — the cross-sectional area of a pencil lead. Graphite was mistakenly called 'plumbago' (lead ore) when discovered in Borrowdale, England in 1565 — hence 'pencil lead'. Graphite and diamond are both pure carbon; the difference is entirely in how the atoms are arranged." },

  "18": { label: "A18",
    fact: "~2.1 mm² — roughly the area of the eye of a needle. The oldest known sewing needle, found in Siberia and made from bird bone, is ~50,000 years old — predating Homo sapiens' arrival in Europe. Whoever made it was sewing clothing for a world in ice age." },

  "19": { label: "A19",
    fact: "~1.05 mm² — about the cross-sectional area of a human capillary blood vessel cluster. A single red blood cell (8 μm diameter) would cross this area in milliseconds. Your body has approximately 37 trillion red blood cells, each living for about 120 days, each making ~1,000 laps of the body in its lifetime." },

  "20": { label: "A20",
    fact: "~0.52 mm² — a bundle of ~10 human hairs side by side. Each hair has a specific cross-sectional shape encoded by the same gene variants that determine whether it grows straight, wavy, or curly. This is one of the rare cases where a single gene (EDAR) influences multiple traits simultaneously — also affecting tooth shape and sweat gland density." },

  "21": { label: "A21",
    fact: "~0.58 mm — the diameter of a human egg cell (ovum), the largest cell in the human body and barely visible to the naked eye. It is the only cell you carry that is large enough to see without a microscope. All other cells — neurons, muscle fibres, liver cells — are invisible individually, yet the ovum has been observed by human eyes since antiquity." },

  "22": { label: "A22",
    fact: "~0.41 mm — the width of a fine sand grain. Below this, particles are classified as silt. Sand is mostly quartz — silicon dioxide — ground from granite and other rocks over millions of years by rivers and waves. The world's deserts contain an estimated 7.5 × 10¹⁸ grains of sand. There are roughly the same number of stars in the observable universe." },

  "23": { label: "A23",
    fact: "~65 μm² — we're now at the scale of a single human skin cell (keratinocyte), which is roughly 25–30 μm across. Your entire skin replaces itself in about a month, producing roughly 30,000–40,000 dead skin cells per hour." },

  "24": { label: "A24",
    fact: "~210 μm — the width of a fine human hair, and the approximate size of a fairyfly — a parasitoid wasp so small it's among the tiniest insects known. Some fairyfly species are smaller than a single Paramecium. They have wings that are more like hairy paddles than membranes, because at this scale air behaves more like a viscous fluid than a gas." },

  "25": { label: "A25",
    fact: "~149 μm — the approximate thickness of a human hair and the size of the smallest grains of visible salt. The roundworm C. elegans is exactly 1 mm long and contains exactly 959 cells. Its entire cell lineage — every division from fertilised egg to adult — has been mapped. It was the first multicellular organism to have its complete genome sequenced." },

  "26": { label: "A26",
    fact: "~105 μm — the width of a fine human hair. The resolution limit of a standard optical microscope is ~200 nm — set by the wavelength of visible light, an absolute physical barrier known as the Abbe diffraction limit. Super-resolution microscopy techniques that bypass this limit (STED, PALM, STORM) won the 2014 Nobel Prize in Chemistry." },

  "27": { label: "A27",
    fact: "~4 μm² — approaching the size of a human red blood cell (7–8 μm diameter). Red blood cells are uniquely designed: no nucleus, no mitochondria, biconcave in shape — all to maximise surface area for oxygen exchange. They are produced at ~2 million per second and make ~1,000 circuits of the body during their 120-day lifespan." },

  "28": { label: "A28",
    fact: "~53 μm — pollen grains are typically 10–100 μm, putting many right at this scale. Each pollen grain carries half the genetic material for a plant. Some plants release billions of pollen grains per season; the probability of any individual grain reaching a compatible flower is vanishingly small, yet reproduction succeeds because the numbers are vast enough to make probability irrelevant." },

  "29": { label: "A29",
    fact: "~37 μm — the typical size of a mammalian cell. Most of your cells are 10–30 μm across. Within each one, ~10,000 chemical reactions per second maintain energy production, protein synthesis, waste disposal, and intercellular signalling. The cell is a city, and there are 37 trillion of them in you." },

  "30": { label: "A30",
    fact: "~0.5 μm² — the scale of a large bacterium. E. coli is roughly 2 × 0.5 μm. Despite being single-celled and having no nucleus, a bacterium can 'smell' chemical gradients and swim towards food by rotating its flagella like a propeller — up to 100,000 RPM." },

  "31": { label: "A31",
    fact: "~26 μm — the scale of a single large cell. Within this space, each cell runs ~10,000 chemical reactions per second, maintains a selective membrane, and contains roughly 2 metres of DNA coiled into a nucleus 6 μm wide. The ratio of DNA length to nucleus size is roughly equivalent to packing 40 km of thread into a tennis ball." },

  "32": { label: "A32",
    fact: "~18 μm — 2–3 red blood cells across. Red blood cells have no nucleus and cannot repair themselves; after ~120 days they are broken down in the spleen. The iron from their haemoglobin is recycled — the iron in your blood has likely been recycled through dozens of previous organisms over billions of years of life on Earth." },

  "33": { label: "A33",
    fact: "~60 nm² — the scale of a large virus. The influenza virus is about 80–120 nm in diameter. At this scale, the usual concept of 'alive' becomes ambiguous: viruses have no metabolism, cannot reproduce alone, and technically exist between chemistry and biology." },

  "34": { label: "A34",
    fact: "~13 μm — the scale of a white blood cell (10–20 μm). Your immune system can recognise and target pathogens encountered decades earlier via B-cell memory. A macrophage can engulf ~100 bacteria before dying. The immune system recognises 'self' from 'non-self' through protein markers that are largely determined before birth — an internal identity system more complex than any password." },

  "35": { label: "A35",
    fact: "~9–13 μm — the scale of a large bacterium. Cyanobacteria at this scale were responsible for the Great Oxidation Event ~2.4 billion years ago, when they oxygenated Earth's atmosphere so thoroughly that most existing anaerobic life was wiped out. It may have been the largest mass extinction in Earth's history — caused by photosynthesis." },

  "36": { label: "A36",
    fact: "~6–9 μm — the scale of a yeast cell. Yeast has been used by humans for at least 9,000 years. In 2010, scientists built the first synthetic chromosome for yeast — designing and assembling a eukaryotic chromosome from scratch for the first time. In 2023, the entire synthetic yeast genome was completed." },

  "37": { label: "A37",
    fact: "~3.8 nm² — we're now at the scale of a protein. Haemoglobin, the protein that carries oxygen in your blood, is about 5.5 nm across. It can carry four oxygen molecules simultaneously and changes shape slightly each time it picks one up — a mechanical nanomachine, operating in every one of your 37 trillion red blood cells, 24 hours a day." },

  "38": { label: "A38",
    fact: "~4–5 μm — the length of a mitochondrion. Once a free-living bacterium, it was engulfed by an early cell ~1.5 billion years ago and never left — endosymbiosis. It still carries its own circular genome, separate from the nucleus. All your mitochondria were inherited exclusively from your mother, making mitochondrial DNA a perfect tracer of maternal lineage back through time." },

  "39": { label: "A39",
    fact: "~3–4 μm — the diameter of a chloroplast. Like mitochondria, chloroplasts began as free-living cyanobacteria swallowed by a eukaryote ~1.5 billion years ago. They still carry their own genome. Every photon that drives your existence was first captured by a structure descended from an ancient bacterial captive." },

  "40": { label: "A40",
    fact: "~0.47 nm² — the scale of a DNA double helix cross-section (diameter ~2 nm). The full human genome, stretched out, would be about 2 metres long — yet it's coiled so tightly it fits into a nucleus just 6 μm wide. If the DNA in all your cells were laid end to end, it would reach from Earth to Pluto and back several times." },

  "41": { label: "A41",
    fact: "~2–3 μm — the smallest known bacteria, Mycoplasma genitalium, has only 482 protein-coding genes — close to the theoretical minimum for an independently replicating cell. Determining this minimum is central to synthetic biology's goal of building life from scratch. The fewer genes you need, the closer you are to understanding what life fundamentally requires." },

  "42": { label: "A42",
    fact: "~1.6–2.3 μm — the wavelength of near-infrared light, just beyond what the eye can see. Thermal imaging cameras detect 8–14 μm. Infrared radiation was discovered in 1800 by William Herschel, who noticed thermometers placed beyond the red end of a spectrum recorded higher temperatures than visible light — heat invisible to the eye, but detectable by thermometer." },

  "43": { label: "A43",
    fact: "~0.059 nm² — we're at the scale of individual atoms. A single water molecule is about 0.28 nm across. At this scale, quantum mechanics governs everything: electrons don't orbit the nucleus in neat paths but exist in probability clouds, and observing them changes their behaviour." },

  "44": { label: "A44",
    fact: "~1.16–1.65 μm — the wavelength used in fibre-optic telecommunications (~1,550 nm). Light pulses at this wavelength travel through glass optical fibres with minimal absorption, carrying the internet's data at nearly the speed of light. The global undersea fibre network carries ~95% of all international internet traffic — the physical substrate of the modern world runs along the ocean floor." },

  "45": { label: "A45",
    fact: "~820–1,160 nm — near-infrared, just beyond the human eye's red limit (~700 nm). Pit vipers have special facial organs that detect infrared to hunt warm-blooded prey in darkness. Bees see ultraviolet but not red. The visible spectrum humans experience is an extraordinarily narrow slice of the full electromagnetic spectrum — about one octave out of ~80." },

  "46": { label: "A46",
    fact: "~580–820 nm — entering the visible spectrum. 580 nm is yellow — the colour of sodium street lamps and the wavelength to which the human eye is most sensitive under daylight. The Sun's peak emission is ~500 nm (green), but we perceive it as white because all wavelengths are present simultaneously and the brain combines them." },

  "47": { label: "A47",
    fact: "~3.7 pm² — smaller than a single atom. The Bohr radius of hydrogen is 53 pm. At this scale, we're inside the atom, in the mostly-empty space between the electron cloud and the nucleus. If an atom were the size of a football stadium, the nucleus would be the size of a marble at the centre." },

  "48": { label: "A48",
    fact: "~410–580 nm — the wavelength range spanning violet to yellow visible light. The human eye has three cone types (blue, green, red). Most mammals lost trichromatic colour vision ~90 million years ago; primates regained it independently. Your colour vision is an evolutionary afterthought, bolted back on after a lineage of nocturnal ancestors let it lapse." },

  "49": { label: "A49",
    fact: "~290–410 nm — near-ultraviolet. At 290 nm, we've crossed the UV-B band blocked by the ozone layer. UV-B breaks DNA strands. This is the threshold below which complex organic chemistry at Earth's surface becomes self-destructive without shielding — which is why the ozone layer is not merely convenient but essential to all surface life." },

  "50": { label: "A50",
    fact: "~0.46 pm² — on the scale of atomic nuclei. A proton is about 0.85 fm in radius. The nucleus contains virtually all of an atom's mass in 1/100,000th of its volume — the rest is empty space. The density of nuclear matter is roughly 10¹⁷ kg/m³ — a teaspoon would weigh about a billion tonnes." },

  "51": { label: "A51",
    fact: "~200–290 nm — deep ultraviolet. DNA absorbs maximally at 260 nm; this is why UV-C sterilisation (254 nm) kills bacteria by causing thymine dimers that prevent replication. The absorption spectrum of DNA is a physical record of life's molecular structure, legible in wavelengths of light." },

  "52": { label: "A52",
    fact: "~145–205 nm — 'vacuum UV', so named because air itself absorbs at these wavelengths. This range cannot propagate through atmosphere at all. It is only accessible in a vacuum, or in the upper atmosphere before the Sun's output at these wavelengths is absorbed. The energy of these photons is high enough to ionise most molecules." },

  "53": { label: "A53",
    fact: "~58 fm² — deep inside the proton. Protons and neutrons are made of quarks bound by gluons. The strong force holding quarks together is so powerful that attempting to pull them apart creates new quark-antiquark pairs from the energy — quarks are never found alone. This property, called confinement, means no free quark has ever been observed." },

  "54": { label: "A54",
    fact: "~100–145 nm — soft X-ray boundary. EUV lithography at 13.5 nm is the technology that allowed computer chips to shrink below 7 nm. It is produced by firing a laser at a tin droplet 50,000 times per second, producing a plasma that emits 13.5 nm light. This single piece of machinery — made by one company (ASML) in the Netherlands — is critical to all advanced chip manufacturing worldwide." },

  "55": { label: "A55",
    fact: "~73–102 nm — a ribosome (20–30 nm diameter) is just below this scale. The ribosome is the universal protein-making machine, present in every living cell on Earth. It reads mRNA and assembles proteins at ~15 amino acids per second. Ribosomal RNA is so ancient and conserved that comparing sequences across all species is the gold standard for reconstructing the tree of life." },

  "56": { label: "A56",
    fact: "~50–73 nm — the diameter of the HIV virus (100–120 nm) is at this scale. HIV reverse-transcribes its RNA into DNA and inserts it into the host cell's chromosomes, where it can remain dormant for years. The enzyme it uses — reverse transcriptase — was the first evidence that genetic information can flow from RNA to DNA, overturning the assumption that information only flows in one direction in biology." },

  "57": { label: "A57",
    fact: "~3.6 fm² — at the scale of individual quarks (size < 0.1 fm, potentially point-like). At this scale, the Standard Model reaches its known limits. The strong force uniquely increases in strength as particles move farther apart — the opposite of gravity and electromagnetism — which is why quarks are permanently confined inside protons and neutrons." },

  "58": { label: "A58",
    fact: "~36–51 nm — the diameter of a small virus. Cryo-electron microscopy, which won the 2017 Nobel Prize in Chemistry, can now resolve individual atoms in biological structures at this scale. The machines cool samples to −196 °C to immobilise them and fire electrons through them, reconstructing 3D structures from thousands of 2D projections — computational photography taken to its physical limit." },

  "59": { label: "A59",
    fact: "~26–36 nm — the diameter of a nucleosome, the fundamental DNA packaging unit. DNA wraps 1.67 times around each spool of histone proteins, forming a string-of-beads structure. This first level of compaction reduces effective DNA length by a factor of 6. Full compaction into a chromosome reduces it ~8,000-fold. Unpacking and repacking this structure is how genes are turned on and off." },

  "60": { label: "A60",
    fact: "~0.46 fm² — we're now in entirely theoretical territory. String theory proposes that at scales around 10⁻³⁵ m (the Planck length), fundamental particles are not points but tiny vibrating strings. Their different vibrational modes produce the different particles we observe. This remains unproven and possibly untestable." },

  "61": { label: "A61",
    fact: "~18–26 nm — the scale of modern transistors. The latest chips contain over 100 billion transistors. In 1965, Gordon Moore predicted transistor density would double every ~2 years — a prediction that held for 60 years and drove the transformation of every industry on Earth. The physical limit — atoms themselves — is now only 10–20 transistor generations away." },

  "62": { label: "A62",
    fact: "~13–18 nm — gold nanoparticles at this size are being engineered for targeted cancer therapy. They can enter tumour cells but not healthy ones, deliver drugs precisely, and convert absorbed infrared light to heat to destroy tumours. At this scale, the colour of gold changes: 15 nm gold particles are red, not gold. The optical properties of matter depend on size." },

  "63": { label: "A63",
    fact: "~9–13 nm — the thickness of a cell membrane's lipid bilayer (~7–8 nm). This impossibly thin barrier separates the inside of every cell from the outside world and selectively controls what passes through. It is fluid — lipids drift laterally — and is the platform on which essentially all cellular communication occurs." },

  "64": { label: "A64",
    fact: "The chessboard problem: 1 grain on square 1, doubling each square. By square 64, the total is 2⁶⁴ − 1 ≈ 1.8 × 10¹⁹ grains — roughly 460 billion tonnes of rice. This sheet is now ~0.03 fm² — far smaller than any known particle. The chessboard number and the Planck scale collide near here by strange coincidence." },

  "65": { label: "A65",
    fact: "~6–9 nm — the smallest engineered nanomachines. Molecular motors designed by chemists can 'walk' along a DNA track carrying cargo. ATP synthase — a natural molecular motor — physically rotates at ~100 rpm, powered by proton flow across a membrane. The 2016 Nobel Prize in Chemistry was awarded for designing molecular machines that move, rotate, and perform work at this scale." },

  "66": { label: "A66",
    fact: "~4.5–6.4 nm — the scale of large protein complexes. ATP synthase (~10 nm) is a true nanoscale rotary motor. The force it generates, scaled to macroscopic dimensions, is roughly equivalent to a car engine. Every cell in your body runs hundreds of thousands of these motors simultaneously to produce the chemical energy currency (ATP) that powers every biological process." },

  "67": { label: "A67",
    fact: "~3–4.5 nm — the diameter of a potassium ion channel, the protein tunnel through which K⁺ ions flow in nerve cells. The channel distinguishes between K⁺ and Na⁺ ions with near-perfect selectivity despite them differing in radius by only 0.38 Å — an astonishing feat of atomic discrimination that generates every nerve signal, thought, and muscle movement you have ever had." },

  "68": { label: "A68",
    fact: "~2.3–3.2 nm — the diameter of a carbon nanotube (~1–4 nm). Carbon nanotubes are stronger per unit weight than steel, conduct electricity better than copper, and have thermal conductivity exceeding diamond. The main obstacle to widespread use: making them all the same chirality (twist direction), which determines whether each one is metallic or semiconducting." },

  "69": { label: "A69",
    fact: "~1.6–2.3 nm — the length of a strand of 5–7 DNA bases. DNA stores information at a density of ~10²¹ bits per cubic centimetre — more than any artificial memory by many orders of magnitude. In 2019, researchers stored a copy of all 16 million English Wikipedia articles in a few grams of DNA. Reading it back required standard sequencing equipment." },

  "70": { label: "A70",
    fact: "~2 × 10⁻⁶ fm² — so far below known physics that we have no experimental data, no particle accelerator that could probe this scale, and no confirmed theory to describe it. The Planck energy needed to probe the Planck length is 10¹⁹ times higher than what the LHC achieves." },

  "71": { label: "A71",
    fact: "~1–1.6 nm — the scale of the smallest biologically significant molecules. An ATP molecule (the cell's energy currency) is ~1 nm. The free energy released per ATP molecule driving one reaction is ~5.7 kJ/mol — a quantum of energy that runs virtually every biological process, from muscle contraction to DNA replication. Your body produces its own weight in ATP every day." },

  "72": { label: "A72",
    fact: "~0.8–1.1 nm — the scale of a large organic molecule. Anaesthetics work by being just the right size and shape to block specific ion channels. Almost every pharmacological effect is a geometry problem at the nanometre scale. The same molecule can be lethal or therapeutic depending on its 3D shape — the left- and right-handed versions of some drugs have completely opposite effects." },

  "73": { label: "A73",
    fact: "~0.57–0.80 nm — the scale of DNA's major and minor grooves. These asymmetric surface features are where DNA-binding proteins 'read' the genetic sequence without unwinding the helix. Regulatory proteins can identify specific DNA sequences by geometry alone — the molecular basis of gene regulation. Every cell in your body is continuously reading its own DNA this way." },

  "74": { label: "A74",
    fact: "~0.40–0.57 nm — the length of a single DNA base pair (0.34 nm rise per base pair). At this scale, you are reading the genetic code one character at a time. The human genome has ~6.4 billion base pairs. Read at one per second without stopping, it would take over 200 years. The machinery that copies it does so at ~1,000 base pairs per second, with one error per billion — more accurately than any human technology." },

  "75": { label: "A75",
    fact: "~0.28–0.40 nm — the diameter of a water molecule. Water's unique properties — high heat capacity, surface tension, expansion on freezing — all arise from hydrogen bonds at exactly this scale. Without the emergent properties of molecular geometry at 0.28 nm, the chemistry of life as we know it would be impossible. Water is not just the medium; it is a structural component of life." },

  "76": { label: "A76",
    fact: "~0.20–0.28 nm — the length of a covalent bond. C–C bonds are 0.154 nm; C–H bonds are 0.109 nm. These bonds store ~350 kJ/mol of energy. Releasing this energy by oxidation — the chemistry of burning — is the mechanism of all respiration, from a candle to a human cell metabolising glucose. Every breath you take is controlled combustion." },

  "77": { label: "A77",
    fact: "~0.14–0.20 nm — the length of bonds in aromatic rings (benzene C–C: 0.140 nm). Benzene and related structures appear throughout biochemistry — in DNA bases, haemoglobin, and many drugs. Kekulé claimed to have discovered benzene's ring structure after dreaming of a snake eating its own tail in 1865. Whether or not the story is true, the discovery transformed organic chemistry." },

  "78": { label: "A78",
    fact: "~0.10–0.14 nm — the scale of the shortest covalent bonds and the Bohr radius of hydrogen doubled (~0.106 nm). X-ray crystallography at this resolution determines the complete 3D structure of proteins. The technique, developed by the Braggs in 1913, has been used to solve over 200,000 protein structures, including the double helix of DNA in 1953." },

  "79": { label: "A79",
    fact: "~70–100 pm — the range of atomic radii. Carbon's covalent radius is 77 pm; oxygen is 66 pm; hydrogen is 31 pm. The periodic table organises all matter by atomic number, and every atom you have ever touched has a radius in this narrow range. The discovery that atoms have a defined radius came from X-ray diffraction of crystals — atoms too small to see, measured by the patterns they make with light." },

  "80": { label: "A80",
    fact: "Approaching the Planck area (Planck length squared ≈ 2.6 × 10⁻⁷⁰ m²). The Planck length (1.616 × 10⁻³⁵ m) is the scale at which quantum gravity effects become significant, and spacetime itself may stop being continuous. Below this, our current physics simply has no answers." },

  "81": { label: "A81",
    fact: "~50–70 pm — between atomic radius and atomic nucleus. We're in the space that atoms are mostly made of: essentially nothing. The electron cloud exists as a probability density; the nucleus, at ~1–10 fm, is 10,000–100,000× smaller. If all the atoms in a human body were compacted nucleus-to-nucleus, the body would be approximately the size of a grain of sand." },

  "82": { label: "A82",
    fact: "~35–50 pm — smaller than any atomic radius, approaching the innermost electron orbitals of heavy atoms. In a uranium atom, inner electrons move at significant fractions of the speed of light, requiring relativistic corrections. This is why gold is yellow (without relativity, theory predicts it should be silver-white) and why mercury is liquid at room temperature. Relativistic chemistry is real." },

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
