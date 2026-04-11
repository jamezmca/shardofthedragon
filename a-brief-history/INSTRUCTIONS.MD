# A Brief History — Project Instructions

## Overview

**A Brief History** is a single-page, scroll-based educational website that functions like an interactive PowerPoint presentation. It walks the reader through the complete history of the universe — from t=0 (the Big Bang, called "Genesis") through cosmic and biological evolution to the present day, and briefly onward to the end of the universe. The tone is educational and fun, aimed at a curious 13-year-old — think a high-quality dinosaur facts book that got a modern web redesign.

The entire experience lives in one HTML file (or one compiled bundle).

---

## Visual Design & Tone

### Typography
- Use expressive, friendly fonts — mix a chunky display font (e.g. Space Grotesk, Nunito, or Fredoka One) for headings with a highly readable body font (e.g. DM Sans, Inter, or Nunito Sans).
- Font sizes should be generous. This is not a dense academic paper.
- Pull quotes, key facts, and "wow" numbers should be visually oversized and emphasized.

### Color
- Each major era has its own color palette/theme (see Section Eras below). The background, accent colors, and UI chrome shift as the reader moves through time.
- Colors should be vivid and saturated but not garish. Think museum exhibit, not carnival.
- Dark mode is the default. Light mode can be considered later.

### Overall Aesthetic
- Modern, editorial, immersive.
- Generous whitespace. Let ideas breathe.
- Subtle animations on section entry (fade-in, slide-up — nothing that distracts).
- Illustrations, diagrams, and icons encouraged throughout. Placeholder divs with described content are fine during development.

---

## Layout & Navigation Model

### Sections and Subsections

The page is divided into **Sections**. Each Section represents a distinct era or major topic in the history of the universe.

- Sections can be taller than the viewport — content is not compressed to fit one screen.
- If a section becomes very long (more than roughly 3–4 viewport heights of content), it **must be broken into Subsections**.
- Subsections are visually marked with a subtle divider and a subsection label, but they belong to and share the styling of their parent Section.
- Sections and Subsections each have:
  - A **title**
  - A **time period** (absolute cosmic time or relative human-readable label)
  - A **section ID** (used for anchor linking and TOC tracking)

### Slide Navigation (Down Button)

Fixed in the **bottom-right corner** of the viewport at all times is a navigation control styled to look like a physical keyboard down-arrow key:

- Visual: Rounded rectangle, key-cap aesthetic, subtle shadow/depth effect
- Label: small text above or below reading `"click for next slide"`
- Behavior: Clicking it **snaps** (smooth scrolls) to the top of the next Section (not Subsection).
- When on the last section, the button either disappears or transforms into a "You've reached the end" state.
- On the very first section, an **up-arrow** variant does not appear (we start at the top). However, once the user has scrolled past the first section, a subtle **up button** can optionally appear alongside it.
- Keyboard shortcut: the actual keyboard `↓` arrow key (and `↑` for up) should trigger the same snap behavior.

### Table of Contents (TOC)

Fixed in the **top-right corner** of the viewport:

**Desktop:**
- A vertical panel showing all Sections, with the current Section highlighted.
- Each entry shows the Section title and its time period label.
- Completed sections are styled differently from the current and upcoming ones (e.g., muted, checked, or dimmed).
- Clicking any entry snaps to that Section.
- The panel is always visible on desktop but can be collapsed by the user.

**Mobile:**
- Collapsed by default to a thin vertical strip (maybe 8–12px wide) along the right edge, color-coded to the current era.
- Tapping it expands it to a drawer-style TOC overlay.
- Tapping outside or tapping the strip again collapses it.

### Cosmic Timeline Scale (Top Navbar)

Fixed at the **very top** of the viewport, spanning the full width, is a timeline scale that shows where in the cosmic continuum the reader currently is.

#### Structure

The scale is split into **two segments**:

1. **Segment A — The Past (0% → 90% of the bar width):** Represents from the Big Bang (t=0) to the present day (~13.8 billion years).
2. **Segment B — The Future (90% → 100% of the bar width):** Represents from now to the projected end of the universe (~100 trillion+ years, heat death or equivalent).

A clear visual marker (e.g. a label reading "NOW") sits at the 90% position to delineate the two scales. The scales are explicitly different — a small annotation or axis break should make it obvious that the right 10% of the bar covers an incomprehensibly larger span of time.

#### Behavior

- A **dot or cursor** travels along the bar as the user scrolls, indicating the current section's time period.
- Each Section is mapped to a position on the scale based on its allocated time period.
- The dot moves smoothly as the user scrolls (interpolating between section positions based on scroll progress within a section).
- Hovering over the scale shows a tooltip with the absolute time value at that point.
- The scale itself is color-coded by era, matching the section palettes below.
- On mobile, the scale is thinner but still present and functional. Labels may be hidden and revealed on tap.

---

## Asides & Tangents

Some sections will contain optional deep-dive content that is interesting but would disrupt the main narrative flow if inserted inline. These are called **Asides**.

### How Asides Work

- Within the body of a Section, a visually distinct **Aside Trigger** appears — a styled button or callout box (e.g. "Dive deeper: The Life Cycle of Stars →").
- When the user clicks the trigger, the aside **expands inline** — it visually "cuts" the document open, pushing subsequent content down, and inserts the aside content into the page.
- The aside has its own header, body content, and a prominent **"Close aside"** button at the bottom.
- Closing the aside collapses it back and restores the document to its normal flow, returning scroll position to approximately where the user was.
- Asides can contain their own subsections, figures, and key facts — but not other asides (no nesting).
- On the TOC and timeline scale, open Asides are indicated subtly (e.g., a branching line or a small indicator on the current section).
- Asides do NOT count as Sections for slide-navigation purposes. The down-arrow button skips over them.

### Example Asides (not exhaustive)
- Lifecycle of stars (aside within the formation of the universe section)
- How we went from chemistry to biology / the origin of life
- The Cambrian Explosion
- The mechanism of natural selection
- The Fermi Paradox
- Dark matter and dark energy

---

## Content: Sections & Eras

Below is the intended section structure. Each section should be treated as a chapter. The depth of content in each should be roughly proportional to its importance in the story of how we got here. Exact copy is written separately in `HISTORY.MD`; this document defines the structure, behavior, and rules.

### Era Color Themes

| Era | Name | Time Period | Palette Suggestion |
|---|---|---|---|
| 0 | Genesis | t=0 — first ~380,000 years | Deep violet / white hot |
| 1 | The First Light | 380,000 yr — 1 billion yr | Dark navy / amber gold |
| 2 | Galaxies & Stars | 1 billion yr — 5 billion yr | Deep space blue / cyan |
| 3 | Our Solar System | 4.6 billion yr ago | Orange / warm stone |
| 4 | A Violent Youth | 4.6–4 billion yr ago | Red / dark rust |
| 5 | Life Begins | 4–2.5 billion yr ago | Green / teal |
| 6 | The Long Wait | 2.5–600 million yr ago | Blue-green / muted |
| 7 | Explosion of Life | 600–250 million yr ago | Vivid green / gold |
| 8 | The Age of Dinosaurs | 250–66 million yr ago | Earthy amber / jungle green |
| 9 | Mammals Rise | 66–3 million yr ago | Warm brown / savanna tan |
| 10 | Humans | 3 million yr ago — today | Soft white / electric blue |
| 11 | The Far Future | now → end of universe | Cold grey / pale violet |

### Section List

1. **Genesis** — The Big Bang. t=0. Nothing, then everything. The first fractions of a second. Energy, quarks, the formation of protons and neutrons.
2. **The First Light** — The universe cools enough for atoms to form. The Cosmic Microwave Background. Darkness for hundreds of millions of years.
3. **The First Stars & Galaxies** — Gravity pulls matter together. The first stars ignite. They are enormous, short-lived, and their deaths seed the universe with heavier elements. Galaxies form. [Aside: Lifecycle of Stars]
4. **Our Solar System Is Born** — A cloud of gas and dust collapses. The Sun ignites. Planets coalesce from the debris disk. Earth forms.
5. **A Violent Youth** — The Late Heavy Bombardment. The Moon-forming impact. Earth's early hellscape. The formation of oceans.
6. **Life Begins** — The first chemistry that could copy itself. The origin of cells. [Aside: From chemistry to life — how did it actually happen?]
7. **The Long Wait** — Billions of years of single-celled life. Photosynthesis and the Great Oxidation Event. The atmosphere transforms. Eukaryotes emerge.
8. **An Explosion of Life** — The Cambrian Explosion. Multicellular life diversifies rapidly. [Aside: The Cambrian Explosion — why then?]
9. **Life Conquers Land** — Plants, then animals, move onto land. Insects, amphibians, reptiles.
10. **The Age of Dinosaurs** — The Permian extinction. Dinosaurs dominate. Mammals emerge in the shadows. Then the asteroid.
11. **Mammals Take Over** — The aftermath of the impact. Rapid mammalian diversification. Primates emerge.
12. **Humans** — Bipedalism. Tools. Language. Agriculture. Cities. Science. Now. [Aside: The Fermi Paradox — where is everyone?]
13. **The Far Future** — What happens next? The Sun's death. The Milky Way–Andromeda collision. The long dark. Heat death of the universe.

---

## Scroll & Interaction Behavior

- **Scroll is free** — the user can scroll naturally with mouse/trackpad/touch. The slide-snap only triggers on button click or arrow key press.
- **Active section detection** — determined by which section occupies the majority of the viewport (or whose top edge has been passed). Used to update the TOC highlight, the timeline dot position, and the active era theme.
- **Era theme transitions** — when the active section changes, the UI chrome (TOC panel, timeline bar segment, down button) gradually transitions to the new era's color palette. This can be a CSS transition on a top-level CSS variable.
- **Smooth scrolling** — all programmatic scroll events use smooth behavior. Native scroll is unaffected.
- **No full scroll hijacking** — do not intercept or replace native scroll behavior. Arrow keys trigger section-to-section snapping but do not block normal page keyboard shortcuts.

---

## Technical Guidelines

### Stack
- **Tailwind CSS** (via CDN or build step — build step preferred for purging)
- Vanilla JavaScript or a minimal framework (no heavy framework required; Alpine.js is acceptable if reactivity is needed)
- No external UI component libraries
- Fonts via Google Fonts

### File Structure (suggested)
```
/
├── index.html          # Main page
├── style.css           # Custom CSS (Tailwind base + custom overrides)
├── script.js           # All interaction logic
├── sections/           # (optional) Partials or includes if templated
└── assets/
    ├── fonts/
    └── icons/
```

### Accessibility
- All interactive elements must have keyboard focus styles.
- TOC and down-button must be reachable via Tab.
- Asides must trap focus when open and return focus to the trigger when closed.
- The timeline scale must have an `aria-label` describing current position for screen readers.
- Color contrast must meet WCAG AA minimums.

### Performance
- Lazy-load images and heavy assets.
- Aside content can be in the DOM but hidden; no need for dynamic fetching.
- Avoid layout thrash on scroll — throttle or use `IntersectionObserver` for section detection.

---

## Content Guidelines (for writing the sections)

- Write for a bright, curious 13-year-old. Avoid jargon without explanation, but don't dumb things down.
- Use analogy liberally. Scale is everything — use comparisons to help the reader feel the numbers.
- Every section should have at least one "wow fact" — a pull quote or callout that makes the reader stop and stare.
- Humor is welcome. Irreverence is welcome. Condescension is not.
- Numbers should always be contextualized. "13.8 billion years ago" needs a comparison. "If the history of the universe were a single calendar year, humans appear at 11:59:59 PM on December 31st."
- Each section should end with a natural bridge to the next — what changed, what came next, why it matters.

---

## Development Phases

1. **Phase 1 — Structure & Shell:** Build the HTML skeleton with all sections (placeholder content), the fixed UI elements (TOC, timeline, down button), and the era color system.
2. **Phase 2 — Interaction:** Implement scroll detection, section snapping, TOC tracking, timeline dot movement, and aside open/close behavior.
3. **Phase 3 — Content:** Fill in actual copy and visuals for each section, starting with Genesis and working forward.
4. **Phase 4 — Polish:** Animations, transitions, mobile tuning, accessibility audit, performance pass.

---

## Open Questions / Future Considerations

- Should subsections affect the TOC (as nested entries, collapsed by default)?
- Should there be a "reading progress" indicator separate from the timeline scale (e.g., a thin bar at the very top of the page)?
- Interactive elements within sections (e.g., a drag-to-compare slider for Earth's age vs. human history)?
- Audio? Ambient soundscapes per era?
- Should the URL update to reflect the current section (hash-based routing) for shareability?
