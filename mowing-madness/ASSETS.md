# Mowing Madness — Asset Specification

**Setting:** A medieval/wizard/Viking fantasy estate — castle grounds, a wizard's tower garden, a Viking longhouse compound, ancient ruins, druidic stone circles, and dark enchanted forest clearings.  
**Style target:** Stardew Valley / top-down pixel art — warm but moody palette, clean dark outlines, chunky pixels, no dithering. Think Stardew Valley crossed with early Zelda: A Link to the Past.  
**Perspective:** Strictly top-down (looking straight down), same as Pokemon Gen 1/2.  
**Base unit:** 16×16 px world tile. All assets are specified at **4× native** (64 px per tile) so they remain crisp at any zoom level.  
**Format:** PNG with transparent background unless noted.  
**Prefix convention in ChatGPT prompts:** Always open with `"Pixel art, Stardew Valley style, top-down view, [size]px, no anti-aliasing, transparent background —"` then the specific description.

---

## MVP — First 20 Assets (Priority Order)

These 20 assets cover everything visible in the current level. Ordered by visual impact — do them in this sequence and each one will immediately make the game look meaningfully better.

**Tip on flowers:** Generate `flower_red.png` first, then ask ChatGPT to "recolour the petals only to [yellow / purple / pink / white], keep everything else identical" — saves regenerating 4 times from scratch.

| # | Filename | Size (px) | Why first |
|---|---|---|---|
| 1 | `grass.png` | 64×64 | Covers ~70% of the screen at all times. Biggest single impact. |
| 2 | `grass_mowed.png` | 64×64 | The core game loop feedback — every tile you cut becomes this. |
| 3 | `path_cobble.png` | 64×64 | Two full-map-length paths (horizontal + vertical) cross the entire level. Constantly visible. |
| 4 | `mower_n.png` | 64×64 | The player. Always centred on screen. |
| 5 | `cottage.png` | 704×704 | 11×11 tile building — dominates the top-left of the map. |
| 6 | `tree.png` | 128×128 | 13 instances scattered all over the map. |
| 7 | `tree_orchard.png` | 128×128 | 13 instances packed into the orchard block — large patch in the top-right. |
| 8 | `grave.png` | 64×64 | 8 instances spread across the whole map. |
| 9 | `sheep.png` | 64×64 | 3 instances — animals give the map life. |
| 10 | `chicken.png` | 64×64 | 3 instances — same reason. |
| 11 | `stump.png` | 64×64 | 5 instances scattered across the map. |
| 12 | `tent.png` | 320×384 | 5×6 tile structure — prominent in the lower-left. |
| 13 | `campfire.png` | 64×64 | Sits beside the tent — atmospheric anchor for that area. |
| 14 | `kennel.png` | 256×256 | 4×4 tile dog house — mid-map landmark. |
| 15 | `dog.png` | 64×64 | Sits outside the kennel. Small but pairs with it. |
| 16 | `flower_red.png` | 64×64 | 25 flowers spread across the map — they end the game, so they need to read clearly. Generate this one first, recolour for the rest. |
| 17 | `flower_yellow.png` | 64×64 | Recolour of flower_red. |
| 18 | `flower_purple.png` | 64×64 | Recolour of flower_red. |
| 19 | `flower_pink.png` | 64×64 | Recolour of flower_red. |
| 20 | `flower_white.png` | 64×64 | Recolour of flower_red. |

### What you get after these 20

- All ground tiles replaced — the world looks completely different from frame one
- The player sprite is fantasy-themed
- Every building, tree, animal, and prop currently in the level has a real sprite
- All 25 game-ending flowers are distinctly coloured and readable
- Nothing left drawing as a placeholder rectangle

### What to leave for later

- `border.png` — the procedural dark-brown border is acceptable for now
- All Viking, castle, druid, and dark forest assets — those are for future levels
- All UI assets — the current text HUD is functional
- All effects/particles — nice to have but not blocking

---

## Folder Structure

```
mowing-madness/
└── assets/
    ├── tiles/          ← tileable 64×64 ground textures
    ├── sprites/        ← objects, buildings, animals, characters
    ├── ui/             ← HUD, buttons, overlays
    ├── effects/        ← particles, animations
    └── seasonal/       ← winter/autumn variants of existing sprites
```

---

## 1. Terrain Tiles

All tiles are **64×64 px**, designed to tile seamlessly edge-to-edge.

| Asset | Filename | Notes |
|---|---|---|
| Uncut grass (lush) | `grass.png` | Current default ground |
| Mowed grass | `grass_mowed.png` | Lighter, striped |
| Cobblestone path | `path_cobble.png` | Main medieval path |
| Dirt/mud path | `path_dirt.png` | Rural track |
| Map border / dense thorns | `border.png` | Impassable hedge/thorn wall |
| Mossy stone floor | `stone_mossy.png` | Castle ruin interior |
| Dungeon stone floor | `stone_floor.png` | Dark grey cut stone tiles |
| Wooden plank floor | `planks.png` | Longhouse/tavern floor |
| Ancient rune floor | `rune_floor.png` | Glowing magical engraving on stone |
| Scorched earth | `scorched.png` | After fire/dragon — black-brown burnt |
| Shallow water / bog | `bog.png` | Dark murky green-brown |
| Deep water | `water.png` | River or moat — deep blue |
| Snow / frost | `snow.png` | Nordic/Viking level |
| Sand / ash | `ash.png` | Volcanic or desert ruins level |
| Dark enchanted soil | `magic_soil.png` | Deep purple-dark earth, faint glow |
| Gravel/loose stone | `gravel.png` | Castle courtyard fill |

**Prompt — grass.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable grass tile, 
lush medium green with subtle lighter blade strokes, slightly varied texture, 
a hint of wildness like an untended meadow, dark outline pixels at tile edges, 
no anti-aliasing, transparent background
```

**Prompt — grass_mowed.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable mowed lawn tile, 
flat lighter green, subtle alternating light/dark diagonal stripe pattern like 
freshly cut grass, clean and smooth, no anti-aliasing, transparent background
```

**Prompt — path_cobble.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable cobblestone 
path tile, dark grey rounded stones with near-black mortar gaps, slightly worn 
and uneven, medieval village street feel, no anti-aliasing, transparent background
```

**Prompt — path_dirt.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dirt track tile, 
warm muddy brown earth, small stone pebbles and worn ruts, rural medieval path, 
no anti-aliasing, transparent background
```

**Prompt — border.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dense thorn 
hedge border tile, very dark green tangled thorny bramble wall, sharp spike 
details, completely impassable feel, no anti-aliasing, transparent background
```

**Prompt — stone_mossy.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable mossy stone 
floor tile, grey cut stone blocks with bright green moss growing in the seams, 
ancient ruin feel, no anti-aliasing, transparent background
```

**Prompt — stone_floor.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dungeon stone 
floor tile, dark grey rectangular cut stone blocks, subtle shadow between seams, 
cold and austere castle interior feel, no anti-aliasing, transparent background
```

**Prompt — planks.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable wooden plank 
floor tile, warm dark-brown horizontal planks, thin dark gap lines between planks, 
Viking longhouse or tavern floor, slightly worn grain texture, 
no anti-aliasing, transparent background
```

**Prompt — rune_floor.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable magical rune 
floor tile, dark stone base with softly glowing blue-purple ancient rune 
engravings, mystical and arcane atmosphere, faint glow halo on runes, 
no anti-aliasing, transparent background
```

**Prompt — bog.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable boggy water 
tile, murky dark green-brown shallow swamp water, a few dead reeds or small 
lily shapes, foreboding and dank, no anti-aliasing, transparent background
```

**Prompt — magic_soil.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable enchanted 
soil tile, very dark purple-brown earth, faint softly glowing magical particles 
or runes just visible in the dirt, wizard's garden feel, 
no anti-aliasing, transparent background
```

---

## 2. Buildings & Structures

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Medieval cottage | 704×704 | 11×11 | `cottage.png` | Replaces house — current level |
| Wizard's tower | 384×384 | 6×6 | `wizard_tower.png` | Round stone tower |
| Viking longhouse | 640×384 | 10×6 | `longhouse.png` | Viking level |
| Castle tower (round) | 384×384 | 6×6 | `castle_tower.png` | Castle level |
| Castle great hall | 768×512 | 12×8 | `great_hall.png` | Castle level |
| Ruined castle wall section | 192×128 | 3×2 | `ruin_wall.png` | Ruins level |
| Blacksmith forge | 384×320 | 6×5 | `forge.png` | Village level |
| Tavern / mead hall | 640×512 | 10×8 | `tavern.png` | Viking/medieval village |
| Market stall | 256×192 | 4×3 | `market_stall.png` | Village level |
| Druid stone circle | 512×512 | 8×8 | `stone_circle.png` | Ancient ruins level |
| Viking longship (docked) | 512×192 | 8×3 | `longship.png` | Viking coast level |
| Shrine / altar stone | 192×192 | 3×3 | `shrine.png` | General |
| Windmill (stone, medieval) | 256×384 | 4×6 | `windmill.png` | Village level |
| Stables | 384×320 | 6×5 | `stables.png` | Castle/village level |
| Watchtower | 192×384 | 3×6 | `watchtower.png` | Castle perimeter |
| Ruined arch / doorway | 192×256 | 3×4 | `ruin_arch.png` | Ruins level |
| Dog kennel (animal pen) | 256×256 | 4×4 | `kennel.png` | Current level |
| Tent (camp) | 320×384 | 5×6 | `tent.png` | Current level |

**Prompt — cottage.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, 
medieval stone and timber cottage, 704x704px, thatched straw roof covering 
top 3/4 of sprite with lighter left half and darker right half for depth, 
a small chimney stack with smoke hint, cream plaster and dark timber beam 
front wall strip at bottom, a heavy wooden door with iron studs, 
two small leaded pane windows, warm and rustic medieval village feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — wizard_tower.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, 
wizard's tower, 384x384px, round grey stone tower seen from above, 
dark conical slate roof with a pointed lightning rod finial at tip, 
faint purple-blue magical glow around the roof edge, a small arched doorway 
at base, ancient arcane rune carved into stone visible from above, 
mysterious and magical, dark outline, no anti-aliasing, transparent background
```

**Prompt — longhouse.png**
```
Pixel art, Stardew Valley style, top-down view, Viking longhouse, 640x384px, 
long rectangular building with a steeply pitched thatched roof, darker right 
half and lighter left half for depth, carved dragon-head roof decorations at 
each gable end, heavy timber walls with a wide central door, Viking Nordic 
style, dark outline, no anti-aliasing, transparent background
```

**Prompt — castle_tower.png**
```
Pixel art, Stardew Valley style, top-down view, round medieval castle tower, 
384x384px, thick grey stone circular walls with battlements visible at the 
rim, flat stone roof with an iron torch bracket detail, a small arched window 
slit, imposing and solid, dark outline, no anti-aliasing, transparent background
```

**Prompt — forge.png**
```
Pixel art, Stardew Valley style, top-down view, blacksmith forge, 384x320px, 
stone building with a dark iron chimney pipe venting orange-red hot air, 
open front showing a glowing orange furnace/anvil area inside, heavy stone 
walls, industrial medieval feel, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — stone_circle.png**
```
Pixel art, Stardew Valley style, top-down view, druid stone circle, 512x512px, 
ring of tall grey standing stones seen from directly above, each stone slightly 
different size, faint blue-green magical glow emanating from the circle centre, 
ancient mossy stone feel, druidic and mysterious, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — longship.png**
```
Pixel art, Stardew Valley style, top-down view, Viking longship docked, 
512x192px, long narrow wooden boat hull seen from above, dragon-head prow 
at one end, rows of round shields along the sides, oar holes, 
striped sail rolled up, dark wood with iron fittings, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — shrine.png**
```
Pixel art, Stardew Valley style, top-down view, stone altar shrine, 192x192px, 
heavy flat-topped rectangular stone altar seen from above, carved rune 
engravings on the stone face, a small offering bowl or candle on top, 
mossy and ancient, slightly eerie, dark outline, no anti-aliasing, 
transparent background
```

---

## 3. Nature & Vegetation

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Oak tree | 128×128 | 2×2 | `tree.png` | Current game |
| Pine / fir tree | 128×128 | 2×2 | `tree_pine.png` | Nordic/dark forest |
| Dead gnarled tree | 128×128 | 2×2 | `tree_dead.png` | Cemetery / ruin level |
| Enchanted tree (glowing) | 128×128 | 2×2 | `tree_magic.png` | Wizard level |
| Ancient oak (huge) | 256×256 | 4×4 | `tree_ancient.png` | Druidic centrepiece |
| Cherry / blossom tree | 128×128 | 2×2 | `tree_blossom.png` | Spring / fae level |
| Orchard apple tree | 128×128 | 2×2 | `tree_orchard.png` | Current game |
| Tree stump | 64×64 | 1×1 | `stump.png` | Current game |
| Mossy stump | 64×64 | 1×1 | `stump_mossy.png` | Ruin level variant |
| Thorn bush / bramble | 64×64 | 1×1 | `thornbush.png` | Game-ending obstacle |
| Giant mushroom | 128×128 | 2×2 | `mushroom_giant.png` | Forest / fae level |
| Small mushroom cluster | 64×64 | 1×1 | `mushrooms.png` | Ground decoration |
| Standing stone (menhir) | 64×128 | 1×2 | `menhir.png` | Ancient landscape |
| Mossy boulder | 128×128 | 2×2 | `boulder.png` | General obstacle |
| Small rock | 64×64 | 1×1 | `rock.png` | Scattered |
| Rune stone | 64×128 | 1×2 | `runestone.png` | Viking level |
| Poison ivy patch | 64×64 | 1×1 | `poison_ivy.png` | Game-ending obstacle |
| Lily pad (on water) | 64×64 | 1×1 | `waterlily.png` | Pond decoration |
| Reed / bulrush | 64×64 | 1×1 | `reeds.png` | Bog / river edge |
| Vine-covered ruins wall | 128×64 | 2×1 | `vine_wall.png` | Ruin level |
| Hawthorn hedge section | 64×64 | 1×1 | `hawthorn.png` | Boundary |
| Corn / wheat stalks | 64×128 | 1×2 | `wheat.png` | Medieval farm level |
| Flower — red | 64×64 | 1×1 | `flower_red.png` | Game-ending |
| Flower — yellow | 64×64 | 1×1 | `flower_yellow.png` | Game-ending |
| Flower — purple | 64×64 | 1×1 | `flower_purple.png` | Game-ending |
| Flower — pink | 64×64 | 1×1 | `flower_pink.png` | Game-ending |
| Flower — white | 64×64 | 1×1 | `flower_white.png` | Game-ending |
| Enchanted flower (blue, glowing) | 64×64 | 1×1 | `flower_magic.png` | Wizard level — game-ending |

**Prompt — tree.png**
```
Pixel art, Stardew Valley style, top-down view, oak tree, 128x128px, 
round full dark-green canopy with darker outline ring and lighter highlight 
cluster top-left, small brown trunk stub visible below canopy, 
soft drop shadow ellipse on ground, slightly wild and untended medieval feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — tree_pine.png**
```
Pixel art, Stardew Valley style, top-down view, Nordic fir tree, 128x128px, 
dark forest-green cross/star shaped canopy with pointed spike tips, very dark 
centre fading lighter at tips, small brown trunk circle visible, 
brooding northern forest feel, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — tree_dead.png**
```
Pixel art, Stardew Valley style, top-down view, dead gnarled tree, 128x128px, 
dark charcoal-grey bare twisted branches spreading from a thick trunk, 
no leaves whatsoever, skeletal and unsettling branching pattern from above, 
one or two dead bark texture details, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — tree_magic.png**
```
Pixel art, Stardew Valley style, top-down view, enchanted glowing tree, 
128x128px, round canopy in deep blue-purple tones, leaves have a soft 
inner glow of cyan or pale blue light, faint sparkle particle dots in canopy, 
magical and otherworldly, dark outline, no anti-aliasing, transparent background
```

**Prompt — tree_ancient.png**
```
Pixel art, Stardew Valley style, top-down view, enormous ancient druidic oak, 
256x256px, massive round canopy in deep green, multiple highlight clusters 
suggesting huge spread of branches, thick gnarled trunk visible at base, 
a faint green-gold magical glow suggests ancient spirit energy, 
majestic and sacred, dark outline, no anti-aliasing, transparent background
```

**Prompt — mushroom_giant.png**
```
Pixel art, Stardew Valley style, top-down view, giant fantasy mushroom, 
128x128px, wide round red or purple mushroom cap with white spot dots seen 
from above, slightly luminescent glow on the cap edge, fae/fairy ring feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — runestone.png**
```
Pixel art, Stardew Valley style, top-down view, Viking rune stone, 64x128px, 
tall narrow grey stone slab seen from above (appears as an elongated oval), 
carved red-painted runic inscriptions clearly visible on the flat top face, 
ancient and weathered, Nordic feel, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — thornbush.png**
```
Pixel art, Stardew Valley style, top-down view, thorny bramble bush, 64x64px, 
dark green tangled thorny mass with sharp dark spike details, slightly menacing 
and impenetrable, hints of dark red wild berries among thorns, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — flower_red.png** (repeat for each color swapping petal color)
```
Pixel art, Stardew Valley style, top-down view, single wildflower with red 
petals, 64x64px, 5-petal meadow flower shape, bright red petals, small 
yellow centre, short green stem with two small leaves, delicate and wild, 
no anti-aliasing, transparent background
```

**Prompt — flower_magic.png**
```
Pixel art, Stardew Valley style, top-down view, enchanted glowing flower, 
64x64px, deep blue petals with a soft inner cyan glow, bright white 
luminescent centre, tiny sparkle dots drifting upward from petals, 
magical and beautiful but dangerous, no anti-aliasing, transparent background
```

---

## 4. Animals & Characters

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Enchanted mower (N) | 64×64 | 1×1 | `mower_n.png` | Player — rune-marked mower facing up |
| Dog | 64×64 | 1×1 | `dog.png` | Current game |
| Sheep | 64×64 | 1×1 | `sheep.png` | Current game |
| Chicken | 64×64 | 1×1 | `chicken.png` | Current game |
| Pig | 64×64 | 1×1 | `pig.png` | Medieval farm |
| Horse | 128×128 | 2×2 | `horse.png` | Stabled or wandering |
| Goat | 64×64 | 1×1 | `goat.png` | Medieval farm |
| Cow | 128×128 | 2×2 | `cow.png` | Medieval farm |
| Raven / crow | 64×64 | 1×1 | `raven.png` | Ominous decoration — cemetery/tower |
| Owl | 64×64 | 1×1 | `owl.png` | Wizard's familiar |
| Cat (witch's) | 64×64 | 1×1 | `cat.png` | Wizard level |
| Wolf | 64×64 | 1×1 | `wolf.png` | Dark forest level |
| Wild boar | 128×64 | 2×1 | `boar.png` | Forest level |
| Deer | 128×64 | 2×1 | `deer.png` | Forest level |
| Snake | 64×64 | 1×1 | `snake.png` | Ruin / swamp level |
| Frog | 64×64 | 1×1 | `frog.png` | Bog / pond level |
| Rat | 64×64 | 1×1 | `rat.png` | Dungeon / ruin level |
| Dragon (small, perched) | 128×128 | 2×2 | `dragon_small.png` | Wizard's pet / obstacle |
| Dragon (large, obstacle) | 256×256 | 4×4 | `dragon.png` | Boss-level obstacle |
| Giant spider | 128×128 | 2×2 | `spider.png` | Dark forest / ruin level |
| Skeleton (standing) | 64×64 | 1×1 | `skeleton.png` | Cemetery level decoration |
| Wizard NPC | 64×64 | 1×1 | `wizard_npc.png` | Decoration |
| Viking warrior NPC | 64×64 | 1×1 | `viking_npc.png` | Decoration |
| Knight NPC | 64×64 | 1×1 | `knight_npc.png` | Castle level decoration |

**Prompt — mower_n.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, 
enchanted mechanical lawn mower facing upward (north), 64x64px, 
chunky red and dark-iron body with glowing blue rune engravings on the 
sides, four small rugged wheels at corners, magical sparks hinting from 
the blade area below, small exhaust pipe at back emitting a tiny magical 
smoke puff, bold and fantastical, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — raven.png**
```
Pixel art, Stardew Valley style, top-down view, raven, 64x64px, 
glossy jet-black bird seen from above, folded dark wings, small sharp beak, 
bright single eye highlight, sleek and ominous, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — owl.png**
```
Pixel art, Stardew Valley style, top-down view, owl, 64x64px, 
round speckled brown-grey owl seen from above, two large circular eye 
highlights, neat folded wing pattern, wise and watchful, 
sitting still like a wizard's familiar, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — wolf.png**
```
Pixel art, Stardew Valley style, top-down view, grey wolf, 64x64px, 
lean grey wolf body seen from above, darker back stripe, pointed snout, 
tail held low, alert and threatening, dark forest feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — dragon_small.png**
```
Pixel art, Stardew Valley style, top-down view, small perched dragon, 
128x128px, compact dark-green or deep-red dragon curled or crouching, 
folded leathery wings visible from above, small horned head, 
glowing amber eyes, cute but dangerous, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — dragon.png**
```
Pixel art, Stardew Valley style, top-down view, large dragon, 256x256px, 
enormous dragon lying down seen from above, huge leathery wings spread 
wide, armoured scales in dark red or black, massive horned head, 
glowing orange-red eyes, imposing and terrifying, a boss-level obstacle, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — skeleton.png**
```
Pixel art, Stardew Valley style, top-down view, standing skeleton, 64x64px, 
white/off-white bone figure seen from above, visible skull on top, 
arm bones spread slightly, ribcage shape on torso, eerie and macabre, 
dark outline, no anti-aliasing, transparent background
```

---

## 5. Props & Decorations

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Gravestone (standard) | 64×64 | 1×1 | `grave.png` | Current game |
| Gravestone (ornate cross) | 64×64 | 1×1 | `grave_cross.png` | Cemetery level |
| Gravestone (angel statue) | 64×64 | 1×1 | `grave_angel.png` | Cemetery level |
| Grave mound | 128×64 | 2×1 | `grave_mound.png` | Freshly dug earth |
| Campfire | 64×64 | 1×1 | `campfire.png` | Current game |
| Torch post | 64×128 | 1×2 | `torch_post.png` | Lit torch on iron post |
| Wall torch bracket | 64×64 | 1×1 | `torch_wall.png` | Mounted flat torch |
| Cauldron | 64×64 | 1×1 | `cauldron.png` | Wizard / witch prop |
| Potion bottles (cluster) | 64×64 | 1×1 | `potions.png` | Wizard level prop |
| Spell book / open tome | 64×64 | 1×1 | `spellbook.png` | Wizard level prop |
| Crystal ball | 64×64 | 1×1 | `crystal_ball.png` | Wizard prop |
| Magic circle (ground rune) | 128×128 | 2×2 | `magic_circle.png` | Ground-level obstacle |
| Treasure chest (closed) | 64×64 | 1×1 | `chest_closed.png` | General |
| Treasure chest (open) | 64×64 | 1×1 | `chest_open.png` | Reward prop |
| Barrel (wooden) | 64×64 | 1×1 | `barrel.png` | General |
| Mead barrel (decorated) | 64×64 | 1×1 | `barrel_mead.png` | Viking level |
| Barrel stack (2×1) | 128×64 | 2×1 | `barrel_stack.png` | Storage prop |
| Anvil | 64×64 | 1×1 | `anvil.png` | Blacksmith prop |
| Weapons rack | 128×64 | 2×1 | `weapons_rack.png` | Castle armoury |
| Shield (leaning) | 64×64 | 1×1 | `shield.png` | Viking/castle prop |
| Crate / storage box | 64×64 | 1×1 | `crate.png` | General |
| Well (stone) | 64×64 | 1×1 | `well.png` | Village prop |
| Hay bale | 128×64 | 2×1 | `haybale.png` | Farm/stable prop |
| Cart / wagon (parked) | 192×128 | 3×2 | `cart.png` | Village prop |
| Wheelbarrow | 128×64 | 2×1 | `wheelbarrow.png` | Garden/farm prop |
| Fish drying rack | 128×64 | 2×1 | `fish_rack.png` | Viking coastal level |
| Boat anchor | 64×64 | 1×1 | `anchor.png` | Viking dock level |
| Sacrificial altar | 128×128 | 2×2 | `altar.png` | Viking / druid level |
| Catapult (parked) | 192×192 | 3×3 | `catapult.png` | Castle grounds level |
| Siege ballista | 192×128 | 3×2 | `ballista.png` | Castle grounds level |
| Millstone | 64×64 | 1×1 | `millstone.png` | Mill / village level |
| Scarecrow (medieval) | 64×128 | 1×2 | `scarecrow.png` | Farm level |
| Beehive (straw skep) | 64×64 | 1×1 | `beehive.png` | Garden/orchard |
| Caged raven / bird cage | 64×64 | 1×1 | `birdcage.png` | Wizard level prop |
| Sundial | 64×64 | 1×1 | `sundial.png` | Castle garden |
| Garden bench (stone) | 128×64 | 2×1 | `bench_stone.png` | Castle garden |
| Fountain (ornate stone) | 128×128 | 2×2 | `fountain.png` | Castle garden |
| Burning brazier | 64×64 | 1×1 | `brazier.png` | Castle/dungeon |

**Prompt — grave.png**
```
Pixel art, Stardew Valley style, top-down view, weathered gravestone, 64x64px, 
grey-blue mossy stone with rounded arch top, small dark cross engraved in 
centre, slightly tilted from age, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — grave_angel.png**
```
Pixel art, Stardew Valley style, top-down view, ornate gravestone with angel, 
64x64px, white stone angel figure seen from above with wings spread, 
seated on a heavy carved plinth, reverent and haunting, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — torch_post.png**
```
Pixel art, Stardew Valley style, top-down view, iron torch post, 64x128px, 
tall dark iron post with a burning torch at the top, orange-yellow flame 
tip, warm glow halo circle around flame, medieval castle or village path 
lighting, dark outline, no anti-aliasing, transparent background
```

**Prompt — cauldron.png**
```
Pixel art, Stardew Valley style, top-down view, witch's cauldron, 64x64px, 
large round black iron pot seen from above, swirling green-purple bubbling 
liquid inside, small steam wisps rising, three short legs, 
magical and sinister, dark outline, no anti-aliasing, transparent background
```

**Prompt — magic_circle.png**
```
Pixel art, Stardew Valley style, top-down view, magical summoning circle 
on ground, 128x128px, dark stone floor with a glowing blue-purple pentagram 
or arcane circle engraved and lit from within, rune symbols around the ring, 
mysterious and dangerous, dark outline, no anti-aliasing, transparent background
```

**Prompt — chest_closed.png**
```
Pixel art, Stardew Valley style, top-down view, treasure chest closed, 64x64px, 
dark brown wooden chest with iron banding and a heavy padlock, seen from above 
showing the lid, classic fantasy treasure chest, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — anvil.png**
```
Pixel art, Stardew Valley style, top-down view, blacksmith anvil, 64x64px, 
heavy dark iron anvil seen from above, classic horn-and-face shape, 
slightly worn surface with dark scuff marks, sitting on a wooden block, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — catapult.png**
```
Pixel art, Stardew Valley style, top-down view, medieval catapult, 192x192px, 
large siege weapon seen from above, heavy dark wood frame, wound rope 
tension mechanism, throwing arm with sling cup visible, imposing war machine, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — brazier.png**
```
Pixel art, Stardew Valley style, top-down view, stone brazier with fire, 
64x64px, wide shallow stone bowl on a short pedestal seen from above, 
orange and yellow fire burning within, faint glow on surrounding stone, 
castle or dungeon lighting prop, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — beehive.png**
```
Pixel art, Stardew Valley style, top-down view, traditional straw skep beehive, 
64x64px, domed woven straw coil shape seen from above, warm golden-straw 
colour, a few tiny bee dots circling around it, orchard or garden prop, 
dark outline, no anti-aliasing, transparent background
```

---

## 6. Fencing & Boundaries

All fence tiles are **64×64 px**, designed to connect seamlessly.

| Asset | Filename | Notes |
|---|---|---|
| Wooden stake fence — horizontal | `fence_h.png` | Viking palisade style |
| Wooden stake fence — vertical | `fence_v.png` | |
| Wooden fence — corner TL | `fence_tl.png` | |
| Wooden fence — corner TR | `fence_tr.png` | |
| Wooden fence — corner BL | `fence_bl.png` | |
| Wooden fence — corner BR | `fence_br.png` | |
| Wooden gate (closed) | `gate_closed.png` | |
| Wooden gate (open) | `gate_open.png` | |
| Stone wall section | `wall_stone.png` | Castle/ruin boundary |
| Iron / black metal fence — H | `iron_fence_h.png` | Cemetery/dungeon level |
| Iron / black metal fence — V | `iron_fence_v.png` | |
| Thorn hedge tile | `hedge_thorns.png` | Wild boundary |
| Castle battlement section | `battlement.png` | Top of castle wall |
| Ruined stone wall (broken) | `wall_ruin.png` | Ruin level — partial block |

**Prompt — fence_h.png**
```
Pixel art, Stardew Valley style, top-down view, horizontal Viking palisade 
fence tile, 64x64px, sharpened dark wooden stakes lashed together horizontally 
with rope binding at each post, rough-hewn wood texture, defensive and rustic, 
designed to tile seamlessly left-right, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — battlement.png**
```
Pixel art, Stardew Valley style, top-down view, castle battlement wall section, 
64x64px, grey stone crenellated parapet seen from above, alternating merlons 
and crenels along the wall top, solid and imposing, designed to tile seamlessly, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — wall_ruin.png**
```
Pixel art, Stardew Valley style, top-down view, ruined stone wall section, 
64x64px, crumbling grey stone wall seen from above, broken jagged top edge, 
moss and grass growing in cracks, partial coverage of the tile, 
no anti-aliasing, transparent background
```

---

## 7. Vehicles & Transport

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Horse-drawn cart (parked) | 192×128 | 3×2 | `cart.png` | Village level |
| Wheelbarrow | 128×64 | 2×1 | `wheelbarrow.png` | Farm/garden prop |
| Viking longship | 512×192 | 8×3 | `longship.png` | Docked — Viking level |
| Small rowboat | 192×128 | 3×2 | `rowboat.png` | Lake/river level |
| Enchanted riding mower | 128×128 | 2×2 | `mower_ride.png` | Upgraded player — future |

**Prompt — cart.png**
```
Pixel art, Stardew Valley style, top-down view, horse-drawn wooden cart, 
192x128px, seen from above, two large spoked wooden wheels on sides, 
open cart bed showing wooden planks, simple yoke hitch at front, 
parked with no horse attached, medieval village prop, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — mower_ride.png**
```
Pixel art, Stardew Valley style, top-down view, large enchanted riding 
mower, 128x128px, wide iron and dark-wood mechanical body covered in glowing 
blue rune carvings, large spoke wheels, a throne-like seat in the centre, 
magical gear mechanisms visible, fantastical upgrade feel, 
dark outline, no anti-aliasing, transparent background
```

---

## 8. Level-Specific Asset Sets

### Castle Grounds Level

| Asset | Filename |
|---|---|
| Castle tower | `castle_tower.png` |
| Great hall | `great_hall.png` |
| Battlement sections | `battlement.png` |
| Watchtower | `watchtower.png` |
| Catapult | `catapult.png` |
| Ballista | `ballista.png` |
| Weapons rack | `weapons_rack.png` |
| Training dummy | `training_dummy.png` |
| Knight NPC | `knight_npc.png` |
| Stone path | `path_cobble.png` |
| Braziers | `brazier.png` |

**Prompt — training_dummy.png**
```
Pixel art, Stardew Valley style, top-down view, medieval training dummy, 
64x64px, wooden post with a straw-stuffed cross-shaped dummy torso, 
seen from above showing the T-shape of the arms, battle-worn and patched, 
castle training yard prop, dark outline, no anti-aliasing, transparent background
```

### Wizard's Tower Garden Level

| Asset | Filename |
|---|---|
| Wizard's tower | `wizard_tower.png` |
| Magic circle | `magic_circle.png` |
| Cauldron | `cauldron.png` |
| Crystal ball | `crystal_ball.png` |
| Enchanted tree | `tree_magic.png` |
| Spell book | `spellbook.png` |
| Potions | `potions.png` |
| Giant mushroom | `mushroom_giant.png` |
| Owl | `owl.png` |
| Cat (witch's) | `cat.png` |
| Caged raven | `birdcage.png` |
| Dragon (small, perched) | `dragon_small.png` |
| Rune floor tiles | `rune_floor.png` |
| Enchanted flowers | `flower_magic.png` |

**Prompt — crystal_ball.png**
```
Pixel art, Stardew Valley style, top-down view, crystal ball on ornate stand, 
64x64px, round glass sphere with swirling inner blue-purple mist and a tiny 
faint magical scene inside, dark iron or bronze tripod stand beneath, 
arcane and mysterious, dark outline, no anti-aliasing, transparent background
```

**Prompt — spellbook.png**
```
Pixel art, Stardew Valley style, top-down view, open spell book, 64x64px, 
large ancient tome lying open seen from above, two pages visible with 
glowing rune text and a magical diagram, dark worn leather cover showing on 
the spine, arcane clasp detail, dark outline, no anti-aliasing, 
transparent background
```

### Viking Longhouse Level

| Asset | Filename |
|---|---|
| Longhouse | `longhouse.png` |
| Longship | `longship.png` |
| Rune stones | `runestone.png` |
| Mead barrels | `barrel_mead.png` |
| Fish drying rack | `fish_rack.png` |
| Boat anchor | `anchor.png` |
| Shields | `shield.png` |
| Weapons rack | `weapons_rack.png` |
| Sacrificial altar | `altar.png` |
| Wild boar | `boar.png` |
| Goat | `goat.png` |
| Raven | `raven.png` |
| Wooden palisade fences | `fence_h.png`, `fence_v.png` |
| Plank floor tiles | `planks.png` |

**Prompt — fish_rack.png**
```
Pixel art, Stardew Valley style, top-down view, fish drying rack, 128x64px, 
simple wooden crossbeam frame seen from above with several whole fish hanging 
on strings, pale dried fish colour, coastal Viking village prop, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — altar.png**
```
Pixel art, Stardew Valley style, top-down view, Viking sacrificial altar stone, 
128x128px, large flat dark stone slab with carved runic border, a small carved 
bowl channel for offerings, dark staining and worn edges, imposing and ancient, 
dark outline, no anti-aliasing, transparent background
```

### Cemetery / Dark Ruins Level

| Asset | Filename |
|---|---|
| Dead trees | `tree_dead.png` |
| Multiple gravestone types | `grave.png`, `grave_cross.png`, `grave_angel.png` |
| Mausoleum | `mausoleum.png` |
| Grave mounds | `grave_mound.png` |
| Iron fences | `iron_fence_h.png`, `iron_fence_v.png` |
| Raven | `raven.png` |
| Skeleton | `skeleton.png` |
| Ruined arches | `ruin_arch.png` |
| Mossy ruins floor | `stone_mossy.png` |
| Thorn hedges | `hedge_thorns.png` |
| Giant spider | `spider.png` |
| Snake | `snake.png` |

**Prompt — mausoleum.png**
```
Pixel art, Stardew Valley style, top-down view, gothic stone mausoleum, 
256x256px, square grey stone crypt seen from above, heavy iron-banded stone 
door with skull relief carving, mossy corners, iron fence railing detail 
around the perimeter, oppressive and ominous, dark outline, 
no anti-aliasing, transparent background
```

### Ancient Druid Ruins Level

| Asset | Filename |
|---|---|
| Stone circle | `stone_circle.png` |
| Ancient oak | `tree_ancient.png` |
| Menhirs / standing stones | `menhir.png` |
| Rune stones | `runestone.png` |
| Mossy ruins floor | `stone_mossy.png` |
| Ruined walls | `ruin_wall.png`, `wall_ruin.png` |
| Ruined arch | `ruin_arch.png` |
| Giant mushrooms | `mushroom_giant.png` |
| Bog tiles | `bog.png` |
| Reeds | `reeds.png` |
| Frog | `frog.png` |
| Snake | `snake.png` |
| Wolf | `wolf.png` |
| Enchanted flowers | `flower_magic.png` |

### Dark Forest Level

| Asset | Filename |
|---|---|
| Dense pine trees | `tree_pine.png` |
| Dead gnarled trees | `tree_dead.png` |
| Giant mushrooms | `mushroom_giant.png` |
| Small mushroom clusters | `mushrooms.png` |
| Mossy boulders | `boulder.png` |
| Wolf | `wolf.png` |
| Wild boar | `boar.png` |
| Giant spider | `spider.png` |
| Snake | `snake.png` |
| Thorn bushes | `thornbush.png` |
| Bog ground | `bog.png` |
| Reeds | `reeds.png` |

---

## 9. UI & HUD Elements

| Asset | Size (px) | Filename | Notes |
|---|---|---|---|
| D-pad button — up | 128×128 | `ui_dpad_up.png` | Stone/rune key style |
| D-pad button — down | 128×128 | `ui_dpad_down.png` | |
| D-pad button — left | 128×128 | `ui_dpad_left.png` | |
| D-pad button — right | 128×128 | `ui_dpad_right.png` | |
| D-pad button — up (active) | 128×128 | `ui_dpad_up_active.png` | Glowing active state |
| HUD panel / parchment | 512×128 | `ui_hud_panel.png` | Timer + bar backing |
| Progress bar — empty | 512×64 | `ui_bar_empty.png` | Stone track |
| Progress bar — fill | 512×64 | `ui_bar_fill.png` | Grass green fill |
| Banner background | 1×64 | `ui_banner_bg.png` | Tiling dark stone strip |
| Game title logo | 768×256 | `ui_title.png` | "MOWING MADNESS" in runic pixel lettering |
| Minimap border / frame | 256×192 | `ui_minimap_border.png` | Stone or parchment frame |
| Scroll / parchment overlay | 768×512 | `ui_scroll.png` | End/home screen parchment backdrop |

**Prompt — ui_dpad_up.png**
```
Pixel art, medieval fantasy style, game UI D-pad stone button facing up, 
128x128px, carved dark grey stone square button with worn bevelled edges, 
a glowing blue-white runic upward arrow engraved on the face, 
slight stone texture and depth, fantasy game controller feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — ui_title.png**
```
Pixel art, medieval fantasy style, "MOWING MADNESS" game title logo, 768x256px, 
chunky runic-style pixel lettering in bright lime-gold with a dark stone outline, 
slight grass blade and magical spark motifs integrated into the letters, 
ancient carved-into-stone feel, vibrant and bold, transparent background, 
no anti-aliasing
```

**Prompt — ui_scroll.png**
```
Pixel art, medieval fantasy style, parchment scroll overlay, 768x512px, 
old yellowed rolled-out parchment with curled scroll edges at top and bottom, 
rough torn edge details, faint ink stain aging, slightly translucent centre 
panel area, decorative rune border around the edge, 
no anti-aliasing, transparent background
```

---

## 10. Effects & Particles

| Asset | Size (px) | Filename | Notes |
|---|---|---|---|
| Grass clipping puff | 64×64 | `fx_mow.png` | Mowing effect |
| Magical flower petal burst | 128×128 | `fx_flower_crush.png` | Flower hit |
| Magical smoke puff | 64×64 | `fx_smoke.png` | Mower exhaust |
| Dust cloud | 64×64 | `fx_dust.png` | Fast turning |
| Sparkle / magic particle | 64×64 | `fx_sparkle.png` | Enchanted zone |
| Fire ember burst | 64×64 | `fx_ember.png` | Near campfire/forge |
| Rune flash | 128×128 | `fx_rune_flash.png` | Magic circle activation |
| Blood moon glow | 256×256 | `fx_bloodmoon.png` | Cemetery level atmosphere |

**Prompt — fx_mow.png**
```
Pixel art, Stardew Valley style, top-down view, grass clipping puff effect, 
64x64px, small burst of tiny green grass blade snippets scattering outward 
from centre with a pale green cloud puff, lively and satisfying, 
no anti-aliasing, transparent background
```

**Prompt — fx_flower_crush.png**
```
Pixel art, Stardew Valley style, top-down view, flower petal burst effect, 
128x128px, colourful petals in mixed pink/purple/red scattering outward 
from a centre explosion point, tiny green stem fragments and pollen dust, 
dramatic and expressive, no anti-aliasing, transparent background
```

**Prompt — fx_rune_flash.png**
```
Pixel art, medieval fantasy style, rune flash particle effect, 128x128px, 
bright blue-white runic symbol flaring outward with jagged light rays, 
magical energy burst feel, brief glow halo, 
no anti-aliasing, transparent background
```

---

## 11. Seasonal / Time-of-Day Variants

| Asset | Filename | Base Sprite |
|---|---|---|
| Snow-capped oak tree | `tree_snow.png` | `tree.png` |
| Snow-capped pine tree | `tree_pine_snow.png` | `tree_pine.png` |
| Snow-covered cottage | `cottage_snow.png` | `cottage.png` |
| Snow-covered longhouse | `longhouse_snow.png` | `longhouse.png` |
| Autumn oak tree | `tree_autumn.png` | `tree.png` |
| Frost-covered stone path | `path_cobble_frost.png` | `path_cobble.png` |
| Frozen bog | `bog_frozen.png` | `bog.png` |
| Night enchanted tree | `tree_magic_night.png` | `tree_magic.png` |

**Prompt — tree_snow.png**
```
Pixel art, Stardew Valley style, top-down view, snow-covered oak tree, 
128x128px, round canopy with a thick layer of white snow sitting heavily 
on the branches, dark green still visible beneath snow patches, 
cosy Nordic winter feel, dark outline, no anti-aliasing, transparent background
```

**Prompt — tree_autumn.png**
```
Pixel art, Stardew Valley style, top-down view, autumn oak tree, 128x128px, 
round canopy in rich warm orange, deep red and golden-yellow tones, 
slightly sparse with small gaps, a ring of fallen leaf dots around the base, 
beautiful melancholy autumn feel, dark outline, no anti-aliasing, 
transparent background
```

---

## Summary Count

| Category | Count |
|---|---|
| Terrain tiles | 16 |
| Buildings & structures | 18 |
| Nature & vegetation | 27 |
| Animals & characters | 23 |
| Props & decorations | 32 |
| Fencing & boundaries | 14 |
| Vehicles & transport | 5 |
| Level-specific extras | ~30 |
| UI & HUD | 12 |
| Effects & particles | 8 |
| Seasonal variants | 8 |
| **Total** | **~193** |
