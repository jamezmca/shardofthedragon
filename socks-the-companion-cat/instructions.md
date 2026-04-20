Build me a cozy website app that displays a comforting pixel-art cat companion who sits near the bottom of the screen and keeps the user company for long periods of time.

Core premise:
This is not a game, not a virtual pet with needs, and not a productivity app. It is ambient companionship. The cat should feel like a real cat quietly hanging out near you while you work, study, browse, or feel lonely. The emotional tone should be calm, warm, sleepy, comforting, and slightly magical.

Tech requirements:
- Use plain HTML, CSS, and JavaScript only
- No frameworks
- No build step
- Everything should run by opening index.html in a browser
- Keep the code clean, well-structured, and commented
- Separate into:
  - index.html
  - styles.css
  - script.js
- Use CSS sprite animation or simple frame-based animation logic
- No external dependencies
- No backend

Main UI:
- The page should be minimal and cozy
- The cat should live near the bottom of the viewport, as if sitting on the edge of the screen or on an invisible “floor”
- The cat should remain visible while the page is open
- The cat should not dominate the whole screen
- Give it a peaceful presence
- Include a very small unobtrusive control panel for:
  - mute/unmute purring
  - pause/resume cat animation
  - toggle pixel scaling size (small/medium/large)
  - optional “pet the cat” button
- Default UI should be clean and subtle

Cat visual design:
Make the cat a comforting pixel-art cat inspired by a Ragdoll:
- soft, plush, slightly chunky proportions
- cream body
- darker soft grey-brown ears, face, paws, and tail
- sleepy blue eyes
- fluffy tail
- rounded silhouette
- overall very comforting and gentle
- no exaggerated cartoon chaos
- it should feel like a quiet companion, not a mascot

Animation / behavior philosophy:
This cat will often be on screen for hours at a time.
Therefore:
- it should spend long stretches doing almost nothing
- it should often sleep for a very long time
- it should make infrequent small adjustments
- it should very occasionally stand, shuffle a small distance, then sit or curl up again
- behavior should feel natural and restful
- avoid frequent state changes
- avoid attention-seeking behavior
- avoid anything that becomes irritating over time

Important:
Do NOT make it change behavior every 30–120 seconds.
That is too frequent.
The cat should often remain in one state for many minutes.
Sometimes much longer.

Behavior state machine:
Implement the cat as a state machine with soft randomness.

Required states:
- sit
- watch
- loaf
- curl
- purr
- sleep
- stand
- walk
- resettle

Behavior descriptions:
- sit: relaxed upright sitting
- watch: sitting or loafing but alert, occasionally blinking and glancing around
- loaf: tucked paws, cozy settled posture
- curl: curled up preparing to sleep or purr
- purr: calm curled or seated purring state
- sleep: deeply asleep, extremely long-lasting state
- stand: standing transition before moving
- walk: tiny left/right movement only, never large distance
- resettle: turning, lowering back down, choosing new resting pose

Timing requirements:
Use long, believable durations.
Examples:
- watch: often 2–8 minutes
- sit: often 3–12 minutes
- loaf: often 5–20 minutes
- curl: often 5–15 minutes
- purr: often 3–12 minutes
- sleep: often 15–90+ minutes
- stand: brief transition
- walk: only a few tiny steps, then settle again
- resettle: short transition

Important:
- the cat should frequently enter sleep for long durations
- sleep should be the dominant long-form behavior
- while sleeping, only tiny idle motions should happen:
  - slow breathing
  - occasional ear twitch
  - rare tail flick
  - very rare micro-adjustment
- only occasionally should the cat wake up, stand, move a little, and settle elsewhere

Movement requirements:
- The cat only moves small distances left or right
- It should stay within a defined horizontal zone near the bottom of the viewport
- Never let it roam wildly around the page
- Walking should feel like 2–6 small steps, not travel
- Sometimes it should stand, shuffle slightly, turn, and sit back down
- Sometimes it should just make a tiny positional adjustment without fully relocating
- Rarely change direction
- No jumping or chaotic movement in version 1

Idle details:
Add subtle life-like touches:
- blinking
- slow breathing
- slight ear flick
- occasional tail swish
- tiny head lift
- tiny glance toward cursor, but only sometimes and only when awake
- sleeping should include very subtle breathing loop
- purring can include a slightly different breathing rhythm

Cursor interaction:
- Keep this subtle
- Only when awake
- Occasionally let the cat glance toward the cursor if it comes reasonably near
- Do NOT constantly track the cursor
- Do NOT make the cat act needy
- This should be rare and gentle

Purring:
- Include optional soft purring audio
- Must be muted by default until user interacts
- Add a mute/unmute control
- Purring should only happen in suitable states, mainly curl/purr/sometimes sleep
- Fade purring in and out gently
- If audio is hard to embed cleanly without external assets, stub the system neatly and comment where audio should be inserted

Pet interaction:
- Include a subtle “pet the cat” button
- Pressing it should trigger a small positive response if the cat is awake:
  - blink
  - slight head tilt
  - brief purr state
  - settle again
- If sleeping, maybe tiny ear flick or brief sleepy twitch, not full wake-up
- Do not make this too game-like

Visual style:
- Cozy
- Minimal
- Soft background
- Gentle neutral tones
- The cat should be the emotional focus
- Use pixel-art rendering with crisp edges
- Make sure scaling preserves pixel look
- Avoid over-designed UI

Implementation detail:
Since no external sprite sheets are available, create the cat visually in one of these acceptable ways:
1. Use embedded CSS/HTML pixel blocks
2. Use canvas drawing with simple pixel rectangles
3. Use simple generated sprite frames in JavaScript

Choose whichever is cleanest and most maintainable.
I care more about the behavior and feeling than about perfect art polish.

Architecture:
Please structure the code so that:
- the state machine is easy to tweak
- durations are easy to edit in one place
- animation frames are easy to edit in one place
- movement bounds are easy to edit
- sound hooks are easy to replace later
- behavior probabilities are easy to tune later

I want clear sections in the JavaScript for:
- config
- state definitions
- behavior scheduler
- animation renderer
- movement logic
- audio hooks
- UI controls

Behavior logic expectations:
Implement weighted random transitions, but in a believable way.
Examples:
- sleep should often transition to loaf, sit, or watch
- sit may remain sit for a long time, or move to watch, curl, or loaf
- curl may transition to purr or sleep
- purr may remain purr, transition to curl, or sleep
- watch may sometimes lead to stand then walk then resettle
- stand should usually lead to walk or immediate resettle
- walk should always be short and then settle again
- avoid rapid loops and jittery transitions

Very important:
Favor long calm states over activity.
This app must still feel good after 3 hours on screen.

Responsive behavior:
- keep the cat positioned correctly on window resize
- preserve its general location proportionally if possible
- ensure it remains on-screen at all times

Deliverables:
Please create the complete working project files:
- index.html
- styles.css
- script.js

Also include:
- a short README section at the top of script.js explaining how the behavior system works
- clear comments on where to tweak:
  - state durations
  - transition weights
  - movement distance
  - idle frequencies
  - audio

Stretch goals if simple:
- day/night visual mode based on local time
- tiny “Zzz” while sleeping, but very subtle and optional
- a few alternate coat palettes
- remembered settings in localStorage

But do not sacrifice simplicity or calmness.
The core goal is an emotionally comforting ambient cat companion that can sit quietly with someone for hours without becoming annoying.

Art direction addendum:
Make the cat look like the most comforting possible pixel companion:
- Ragdoll-inspired
- sleepy, plush, gentle
- slightly rounded body
- fluffy tail wrapped around or beside body in resting poses
- soft cream fur with darker ears/tail/paws
- subtle blue eyes when open
- adorable but not hyper-cute
- more “quiet friend beside you” than “cartoon mascot”