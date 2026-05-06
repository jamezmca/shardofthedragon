Create a single self-contained HTML file using ONLY vanilla JavaScript and the HTML5 canvas API.

The goal is to create a stylized animated “3D-ish” ocean surface that appears to recede INTO the page using fake perspective. The aesthetic should feel calm, atmospheric, and slightly dreamy rather than realistic.

REQUIREMENTS:
- Fullscreen canvas.
- Deep ocean/water surface only.
- The water should appear like a plane extending into the distance.
- No Three.js, WebGL, shaders, or external libraries.
- Pure 2D canvas rendering only.
- Smooth 60fps animation.
- Resize correctly with window resizing.

VISUAL STYLE:
- Perspective-based trapezoid water plane:
  - Narrower at the horizon/top.
  - Wider at the bottom/front.
- Use MANY horizontal wave rows to fake depth.
- Rows near the horizon:
  - compressed together
  - thinner
  - lower amplitude
  - darker
- Rows near the viewer:
  - further apart
  - thicker
  - larger wave amplitude
  - brighter highlights
- Ocean should feel infinite and deep.

WAVE SYSTEM:
- Each row should be generated from layered sine waves.
- Waves should move over time.
- Different rows should move at slightly different speeds.
- Use multiple sine layers per row for natural movement.
- Movement should feel smooth and meditative.

DEPTH/PERSPECTIVE:
- Strong sense of the surface going INTO the screen.
- Use non-linear spacing:
  - rows should compress exponentially toward the horizon.
- Wave amplitude should increase toward the viewer.
- Width of each row should expand toward the viewer.

LIGHTING:
- Add subtle shimmering highlights.
- Use gradients for depth.
- Add atmospheric fade toward the horizon.
- Slight glow/specular effect on some wave crests.
- No harsh neon colors.

COLOURS:
- Dark navy/deep blue base.
- Slight teal/cyan highlights.
- Calm night-ocean palette.
- Soft contrast.

EXTRA DETAIL:
- Add a faint fog/haze near the horizon.
- Add very subtle drifting movement to the whole surface.
- The animation should feel alive even when viewed for a long time.

TECHNICAL:
- Organize code clearly.
- Use requestAnimationFrame.
- Separate rendering logic into functions.
- Add comments explaining the perspective math.
- Keep performance efficient enough for many rows.

IMPORTANT:
The key goal is NOT realistic water simulation.
The goal is creating a convincing illusion of DEPTH using perspective, spacing, gradients, and animated wave rows in a 2D canvas.