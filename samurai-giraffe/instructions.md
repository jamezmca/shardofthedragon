alright html game where we have to be samurai executioners.

basically there's 30 levels, and it's just mug shots (pixel art game style) of giraffes of different height, weight, bmi, and age, and a silly giraffe related crime.

the home page is level one, and all the levels are little tiles along the top of the page.

for each giraffe, all we see is a diagonal of a giraffe neck along the screen, and we can toggle between photgraph and xray views. photograph shows the skin and giraffe pattern, and also allows us to just how fat the giraffe was (corresponds to the statS), and xray shows bone. based off of that information we have, we have to draw a slice/line across the neck, where the length corresponds to the strength of the slice, and the angle needs to relates to the fat/age/weight stats. cutting through fat should be easiest maybe on a slight angle off normal to the skin, and bone should be perfectdicular.

the cut gets rated after blood is spalttered, and the head/neck falls down, and the tile with the level and the mug shot says 'executed' and is faded underneath the text.

score out of 100. 100 for a mathematically perfect cut in terms of angle as it relates to the average weight mathematically calculated to be best for the ocmbo of skin (fatness/age) and bone (age), and power - too much power causes explosion and mess, not enough and doesn't cut through.

bone and skin shouldn't be perfectly parallel, but the bone needs to lie within the region of the skin.

draw the line and then press space button to execute the criminal giraffe. after drawing the line, it stays on the screen, and if they draw another then the original is replaced.


_______RESPONSE_______

**Agreed plan:**

- Start with 2 levels, unlocking the next once the current giraffe is successfully executed (score > 0 cut-through). Older levels always replayable for best score.
- 30 levels total eventually, all procedurally generated (names, stats, crimes).
- Level select: row of tiles along top. Each shows tiny mugshot + level number. Locked levels show a padlock. Executed levels show a faded mugshot + red EXECUTED stamp + best score.
- Neck diagonal goes bottom-right → top-left across the canvas.
- Photograph view: giraffe spot pattern skin, neck width reflects fatness (BMI). X-ray view: bone as narrower inner band, slightly non-parallel to skin surface, thickness reflects age.
- Cut mechanic: click/touch-drag to draw a straight line (start = press, end = release). Line stays on screen; drawing again replaces it. Press Space (or on-screen Execute button for mobile) to execute.
- Scoring (0–100): angle score (weighted blend of skin-normal for fat giraffes vs bone-perpendicular for old/bony ones) + power score (ideal = proportional to total resistance of fat + bone density; too little = no cut, too much = explosion).
- Animation: blood particle splatter → head/neck slides off along cut angle → level tile stamps EXECUTED.
- After execution: stays on result screen showing score. Manual advance to next level via button. Can retry any completed level.
- Mobile supported: touch drag draws the line, on-screen Execute button replaces Space.

