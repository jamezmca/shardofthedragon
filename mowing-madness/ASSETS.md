# Mowing Madness — Asset Specification

**Style target:** Stardew Valley / top-down pixel art — warm palette, clean dark outlines, chunky pixels, no dithering.  
**Perspective:** Strictly top-down (looking straight down), same as Pokemon Gen 1/2.  
**Base unit:** 16×16 px world tile. All assets are specified at **4× native** (64 px per tile) so they remain crisp at any zoom level.  
**Format:** PNG with transparent background unless noted.  
**Prefix convention in ChatGPT prompts:** Always open with `"Pixel art, Stardew Valley style, top-down view, [size]px, no anti-aliasing, transparent background —"` then the specific description.

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
| Dirt path | `path.png` | Warm sandy-brown |
| Map border / hedge wall | `border.png` | Dense hedge or dark timber |
| Stone/cobblestone path | `path_stone.png` | Grey cobbles — suburban level |
| Wooden deck/patio | `deck.png` | Horizontal wood plank texture |
| Gravel | `gravel.png` | Fine grey pebbles — driveways |
| Sand | `sand.png` | Pale sandy tan — beach/park level |
| Dry/dead grass | `grass_dry.png` | Yellowed, brittle — summer level |
| Mud | `mud.png` | Dark brown, puddle-hinted — after rain |
| Water (pond fill) | `water.png` | Flat deep blue-green, subtle shimmer |
| Shallow water | `water_shallow.png` | Lighter blue, pebbles visible |
| Autumn leaves | `leaves_autumn.png` | Orange/red scattered leaf layer |
| Snow-covered ground | `snow.png` | White with subtle blue shadow drifts |
| Concrete / sidewalk | `concrete.png` | Flat light grey with seam lines |
| Flower bed (ground) | `flowerbed.png` | Dark soil with tiny scattered petals |

**Prompt — grass.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable grass tile, 
lush medium green with subtle lighter blade strokes, slightly varied texture 
across the tile, dark green outline pixels at tile edges, warm and inviting, 
no anti-aliasing, transparent background
```

**Prompt — grass_mowed.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable mowed lawn tile, 
flat lighter green, subtle alternating light/dark diagonal stripe pattern like 
freshly cut grass, no tall blades, clean and smooth, no anti-aliasing, 
transparent background
```

**Prompt — path.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dirt path tile, 
warm sandy-brown earth tone, small scattered pebble and soil texture details, 
slightly worn appearance, no anti-aliasing, transparent background
```

**Prompt — border.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dense hedge 
border tile, very dark forest green packed leaves, slightly irregular top edge, 
feels like a solid impenetrable hedge wall, no anti-aliasing, transparent background
```

**Prompt — path_stone.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable cobblestone 
path tile, grey rounded stones with dark mortar gaps between them, slightly 
uneven sizes, old European village feel, no anti-aliasing, transparent background
```

**Prompt — deck.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable wooden deck tile, 
warm medium-brown horizontal planks, thin dark plank gap lines, slightly worn 
grain texture, no anti-aliasing, transparent background
```

**Prompt — gravel.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable gravel tile, 
small grey and off-white pebbles packed together, slight variation in stone size, 
no anti-aliasing, transparent background
```

**Prompt — water.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable water tile, 
deep blue-green flat water surface, subtle lighter ripple or shimmer lines, 
clean and calm, no anti-aliasing, transparent background
```

**Prompt — grass_dry.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable dry grass tile, 
pale yellow and light brown dried grass blades, slightly withered look, 
sparse and crunchy feel, no anti-aliasing, transparent background
```

**Prompt — snow.png**
```
Pixel art, Stardew Valley style, top-down view, 64x64px tileable snow tile, 
clean white with subtle pale blue shadow in drift dips, slight sparkle pixel 
highlight, cold and fluffy feel, no anti-aliasing, transparent background
```

---

## 2. Buildings & Structures

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Farmhouse | 704×704 | 11×11 | `house.png` | Main house, current game |
| Dog kennel | 256×256 | 4×4 | `kennel.png` | Current game |
| Tent | 320×384 | 5×6 | `tent.png` | Current game |
| Barn | 512×448 | 8×7 | `barn.png` | Farm level |
| Garden shed | 256×256 | 4×4 | `shed.png` | General level |
| Greenhouse | 384×320 | 6×5 | `greenhouse.png` | Farm/garden level |
| Garage | 384×320 | 6×5 | `garage.png` | Suburban level |
| Gazebo | 320×320 | 5×5 | `gazebo.png` | Park level |
| Outhouse | 128×192 | 2×3 | `outhouse.png` | Rustic/camp level |
| Swimming pool | 384×256 | 6×4 | `pool.png` | Suburban level |
| Silo | 192×192 | 3×3 | `silo.png` | Farm level |
| Mausoleum | 256×256 | 4×4 | `mausoleum.png` | Cemetery level |
| Picnic shelter | 384×320 | 6×5 | `shelter.png` | Park level |
| Windmill | 256×384 | 4×6 | `windmill.png` | Farm level |

**Prompt — house.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, 
farmhouse sprite, 704x704px (11x11 tiles at 64px each), red terracotta 
shingled roof occupying top 3/4 of the sprite with a darker right half and 
lighter left half for depth, a thin bright ridge line down the centre, 
a small brick chimney on the roof, cream coloured front wall strip at the 
bottom with two small multi-pane windows and a brown wooden front door with 
a small brass knob, warm cosy Stardew Valley farmhouse feel, dark pixel 
outlines, no anti-aliasing, transparent background
```

**Prompt — kennel.png**
```
Pixel art, Stardew Valley style, top-down view, dog kennel, 256x256px, 
small red-roofed wooden dog house, lighter left roof half and darker right 
half, natural pine wood wall colour, arched dark doorway opening, dark 
outline, cute and chunky, no anti-aliasing, transparent background
```

**Prompt — tent.png**
```
Pixel art, Stardew Valley style, top-down view, camping tent, 320x384px, 
forest-green canvas triangle tent shape, lighter left face and darker right 
face to suggest depth, small triangular door opening at front base, 
a guide rope line detail, dark outline, no anti-aliasing, transparent background
```

**Prompt — barn.png**
```
Pixel art, Stardew Valley style, top-down view, large red barn, 512x448px, 
classic red barn with dark roof taking up most of the sprite, faded wood 
plank texture on the front strip, wide double barn doors in dark brown, 
hay bale hint near doors, dark outline, no anti-aliasing, transparent background
```

**Prompt — shed.png**
```
Pixel art, Stardew Valley style, top-down view, small garden shed, 256x256px, 
dark green painted shed, flat grey roof, single small wooden door, 
one small window, slightly weathered, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — greenhouse.png**
```
Pixel art, Stardew Valley style, top-down view, glass greenhouse, 384x320px, 
pale grey-white metal frame structure with light blue-green glass panes visible 
through the top, lush plant shapes hinted beneath the glass, warm glow feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — barn.png (silo companion) → silo.png**
```
Pixel art, Stardew Valley style, top-down view, grain silo, 192x192px, 
grey concrete cylinder looking straight down, darker ring outline at rim, 
inner circle slightly lighter, industrial farm feel, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — mausoleum.png**
```
Pixel art, Stardew Valley style, top-down view, stone mausoleum crypt, 
256x256px, grey stone flat-roofed structure, heavy stone door with iron 
hinges, weathered and mossy, slightly ominous, dark outline, 
no anti-aliasing, transparent background
```

---

## 3. Nature & Vegetation

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Oak tree | 128×128 | 2×2 | `tree.png` | Current game |
| Apple/orchard tree | 128×128 | 2×2 | `tree_orchard.png` | Current game |
| Tree stump | 64×64 | 1×1 | `stump.png` | Current game |
| Pine tree | 128×128 | 2×2 | `tree_pine.png` | Mountain/winter level |
| Palm tree | 128×128 | 2×2 | `tree_palm.png` | Beach/tropical level |
| Cherry blossom tree | 128×128 | 2×2 | `tree_cherry.png` | Spring level |
| Dead tree | 128×128 | 2×2 | `tree_dead.png` | Spooky/cemetery level |
| Bush / shrub | 64×64 | 1×1 | `bush.png` | General obstacle |
| Hedge section | 64×64 | 1×1 | `hedge.png` | Boundary tile variant |
| Rose bush | 64×64 | 1×1 | `rosebush.png` | Garden level — ends game if hit |
| Sunflower | 64×128 | 1×2 | `sunflower.png` | Tall — farmland level |
| Mushroom (small) | 64×64 | 1×1 | `mushroom.png` | Forest level |
| Boulder (large) | 128×128 | 2×2 | `boulder.png` | Obstacle |
| Rock (small) | 64×64 | 1×1 | `rock.png` | Scattered obstacle |
| Log pile | 128×64 | 2×1 | `logs.png` | Rustic obstacle |
| Pond | 384×256 | 6×4 | `pond.png` | Decorative impassable |
| Water lily | 64×64 | 1×1 | `waterlily.png` | On pond surface |
| Corn stalk | 64×128 | 1×2 | `corn.png` | Farm level obstacle |
| Haybale | 128×64 | 2×1 | `haybale.png` | Farm level |
| Flower — red | 64×64 | 1×1 | `flower_red.png` | Game-ending obstacle |
| Flower — yellow | 64×64 | 1×1 | `flower_yellow.png` | Game-ending obstacle |
| Flower — purple | 64×64 | 1×1 | `flower_purple.png` | Game-ending obstacle |
| Flower — pink | 64×64 | 1×1 | `flower_pink.png` | Game-ending obstacle |
| Flower — white | 64×64 | 1×1 | `flower_white.png` | Game-ending obstacle |

**Prompt — tree.png**
```
Pixel art, Stardew Valley style, top-down view, oak tree, 128x128px, 
round full green canopy with darker green outline ring and lighter highlight 
cluster top-left suggesting sunlight, small brown trunk stub visible below 
canopy, soft drop shadow ellipse on ground beneath, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — tree_orchard.png**
```
Pixel art, Stardew Valley style, top-down view, apple tree, 128x128px, 
round canopy in slightly yellow-green, 4 small bright red apple dots scattered 
among leaves, darker green outline ring, small brown trunk stub, soft ground 
shadow, no anti-aliasing, transparent background
```

**Prompt — stump.png**
```
Pixel art, Stardew Valley style, top-down view, tree stump looking straight 
down, 64x64px, concentric rings of warm brown and tan wood grain, dark outer 
bark ring, pale heartwood centre, slightly rough edge, no anti-aliasing, 
transparent background
```

**Prompt — tree_pine.png**
```
Pixel art, Stardew Valley style, top-down view, pine/fir tree, 128x128px, 
dark forest-green star or cross shaped canopy with pointed tips, darker centre 
and lighter outer tips, small brown trunk visible, looks like a Christmas tree 
from above, no anti-aliasing, transparent background
```

**Prompt — tree_palm.png**
```
Pixel art, Stardew Valley style, top-down view, palm tree, 128x128px, 
5-7 long flat green palm fronds radiating out from a central brown trunk circle, 
fronds slightly lighter at tips, tropical feel, no anti-aliasing, 
transparent background
```

**Prompt — tree_cherry.png**
```
Pixel art, Stardew Valley style, top-down view, cherry blossom tree, 128x128px, 
round fluffy canopy in soft pink with hints of white blossom clusters, 
slightly lighter pink highlight top-left, small dark trunk stub, 
scattered petal dots around base, delicate and beautiful, 
no anti-aliasing, transparent background
```

**Prompt — tree_dead.png**
```
Pixel art, Stardew Valley style, top-down view, dead bare tree, 128x128px, 
dark grey-brown bare gnarled branches spreading out from a thick trunk centre, 
no leaves, spindly branching shape from above, slightly creepy, 
no anti-aliasing, transparent background
```

**Prompt — bush.png**
```
Pixel art, Stardew Valley style, top-down view, round bush/shrub, 64x64px, 
medium green lumpy rounded shape, darker green outline, lighter highlight 
cluster top-left, slightly smaller and squatter than a tree, 
no anti-aliasing, transparent background
```

**Prompt — rosebush.png**
```
Pixel art, Stardew Valley style, top-down view, rose bush, 64x64px, 
dark green thorny rounded bush with 2-3 bright red rose blooms visible on top, 
dense and slightly menacing due to thorns, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — boulder.png**
```
Pixel art, Stardew Valley style, top-down view, large grey boulder, 128x128px, 
irregular rounded rock shape, medium grey with darker shadow one side, 
lighter highlight other side, slightly mossy green tinge on edges, 
no anti-aliasing, transparent background
```

**Prompt — flower_red.png** (repeat for each color, swapping petal color)
```
Pixel art, Stardew Valley style, top-down view, single red flower, 64x64px, 
4-petal daisy arrangement, bright red petals, bright yellow circular centre, 
short green stem, small paired green leaves at base, cute and cheerful, 
no anti-aliasing, transparent background
```

---

## 4. Animals & Characters

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Red mower (N) | 64×64 | 1×1 | `mower_n.png` | Facing up — rotate in canvas |
| Dog | 64×64 | 1×1 | `dog.png` | Current game |
| Sheep | 64×64 | 1×1 | `sheep.png` | Current game |
| Chicken | 64×64 | 1×1 | `chicken.png` | Current game |
| Cat | 64×64 | 1×1 | `cat.png` | Future level |
| Rabbit | 64×64 | 1×1 | `rabbit.png` | Future level |
| Duck | 64×64 | 1×1 | `duck.png` | Near pond |
| Cow | 128×128 | 2×2 | `cow.png` | Farm level |
| Pig | 64×64 | 1×1 | `pig.png` | Farm level |
| Horse | 128×128 | 2×2 | `horse.png` | Farm level |
| Crow / bird | 64×64 | 1×1 | `crow.png` | Cemetery level decoration |
| Squirrel | 64×64 | 1×1 | `squirrel.png` | Park/garden level |
| Frog | 64×64 | 1×1 | `frog.png` | Near pond/water |
| Turtle | 64×64 | 1×1 | `turtle.png` | Slow moving obstacle idea |
| Gardener NPC | 64×64 | 1×1 | `gardener.png` | Decoration / future NPC |
| Riding mower (larger) | 128×128 | 2×2 | `mower_ride.png` | Upgraded mower future |

**Prompt — mower_n.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, red 
lawn mower facing upward (north), 64x64px, chunky boxy bright red body, 
four small dark rubber tyres at corners, silver blade housing on underside 
visible, small exhaust pipe detail at back, handles at the rear, bold and 
cheerful, dark outline, no anti-aliasing, transparent background
```

**Prompt — dog.png**
```
Pixel art, Stardew Valley style, top-down view, dog, 64x64px, golden-brown 
medium dog sitting or lying down, chunky simple shape, dark eye pixel, 
floppy ear shape visible, stubby tail, warm friendly colours, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — sheep.png**
```
Pixel art, Stardew Valley style, top-down view, sheep, 64x64px, fluffy 
off-white woolly rounded body, small dark grey head poking out one end, 
four tiny dark legs barely visible at the bottom, round and adorable, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — chicken.png**
```
Pixel art, Stardew Valley style, top-down view, chicken, 64x64px, 
pale yellow-cream rounded body, small red comb on head, tiny orange beak, 
two small orange stick legs, white wing shape on body sides, 
chunky and cute, dark outline, no anti-aliasing, transparent background
```

**Prompt — cow.png**
```
Pixel art, Stardew Valley style, top-down view, dairy cow, 128x128px, 
large black and white spotted body, small dark head at one end, 
four stubby legs, simple chunky silhouette, classic farm animal, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — duck.png**
```
Pixel art, Stardew Valley style, top-down view, duck, 64x64px, 
white rounded body, small yellow-orange beak, green shimmer on head 
for a mallard look, tiny orange feet, sitting on water feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — frog.png**
```
Pixel art, Stardew Valley style, top-down view, frog, 64x64px, 
bright green rounded body, two large eyes on top of head, 
four splayed legs visible from above, wide froggy smile, 
sitting beside or in shallow water, dark outline, no anti-aliasing, 
transparent background
```

---

## 5. Props & Decorations

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Gravestone | 64×64 | 1×1 | `grave.png` | Current game |
| Campfire | 64×64 | 1×1 | `campfire.png` | Current game |
| Mailbox | 64×64 | 1×1 | `mailbox.png` | Suburban level |
| Garden gnome | 64×64 | 1×1 | `gnome.png` | Garden decoration |
| Birdbath | 64×64 | 1×1 | `birdbath.png` | Garden decoration |
| Garden bench | 128×64 | 2×1 | `bench.png` | Park level |
| Picnic table | 128×128 | 2×2 | `picnic_table.png` | Park/garden |
| BBQ grill | 64×64 | 1×1 | `bbq.png` | Backyard level |
| Patio umbrella + table | 128×128 | 2×2 | `patio_set.png` | Suburban backyard |
| Outdoor lamp post | 64×128 | 1×2 | `lamppost.png` | Suburban/park level |
| Wheelbarrow | 128×64 | 2×1 | `wheelbarrow.png` | Garden prop |
| Watering can | 64×64 | 1×1 | `watering_can.png` | Garden prop |
| Garden hose (coiled) | 64×64 | 1×1 | `hose.png` | Garden prop |
| Flower pot | 64×64 | 1×1 | `flowerpot.png` | Patio decoration |
| Planter box | 128×64 | 2×1 | `planter.png` | Garden decoration |
| Scarecrow | 64×128 | 1×2 | `scarecrow.png` | Farm level |
| Tire swing | 64×64 | 1×1 | `tire_swing.png` | Hangs from a tree |
| Trampoline | 128×128 | 2×2 | `trampoline.png` | Backyard obstacle |
| Swing set | 192×128 | 3×2 | `swingset.png` | Park/backyard |
| Sandbox | 128×128 | 2×2 | `sandbox.png` | Backyard level |
| Well | 64×64 | 1×1 | `well.png` | Rustic/farm level |
| Rain barrel | 64×64 | 1×1 | `rain_barrel.png` | Garden prop |
| Compost bin | 64×64 | 1×1 | `compost.png` | Eco garden level |
| Sundial | 64×64 | 1×1 | `sundial.png` | Garden decoration |
| Birdbath | 64×64 | 1×1 | `birdbath.png` | Garden decoration |
| Fountain | 128×128 | 2×2 | `fountain.png` | Park / formal garden |
| Statue / garden ornament | 64×64 | 1×1 | `statue.png` | Garden decoration |
| Flag pole | 64×128 | 1×2 | `flagpole.png` | Civic/park level |
| Crate / storage box | 64×64 | 1×1 | `crate.png` | General prop |
| Parked tractor | 192×128 | 3×2 | `tractor.png` | Farm level |
| Leaf pile | 128×64 | 2×1 | `leaf_pile.png` | Autumn level |
| Sprinkler head | 64×64 | 1×1 | `sprinkler.png` | Garden obstacle |
| Fire pit (large) | 128×128 | 2×2 | `fire_pit.png` | Different from campfire |
| Stone wall section | 64×64 | 1×1 | `wall_stone.png` | Boundary tile |

**Prompt — grave.png**
```
Pixel art, Stardew Valley style, top-down view, gravestone, 64x64px, 
grey-blue stone with rounded arch top, small dark cross engraved in centre, 
slightly weathered with a mossy tinge, squat base, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — campfire.png**
```
Pixel art, Stardew Valley style, top-down view, lit campfire, 64x64px, 
two crossed logs in warm brown seen from above, orange and yellow flame 
triangle rising from centre, tiny ember glow dots around base, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — mailbox.png**
```
Pixel art, Stardew Valley style, top-down view, mailbox on post, 64x64px, 
classic American-style dark green or red mailbox on a thin wooden post, 
little red flag raised on side, top-down perspective shows the rounded roof 
of the box, charming and suburban, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — gnome.png**
```
Pixel art, Stardew Valley style, top-down view, garden gnome, 64x64px, 
little round gnome figure with red pointed hat visible from above, 
white beard suggestion, blue jacket, sitting or standing, 
cheerful and colourful, dark outline, no anti-aliasing, transparent background
```

**Prompt — birdbath.png**
```
Pixel art, Stardew Valley style, top-down view, birdbath, 64x64px, 
grey stone pedestal looking from above shows a round shallow bowl, 
water inside shimmering slightly blue, one or two small bird dots perched 
on rim, classic garden feel, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — bench.png**
```
Pixel art, Stardew Valley style, top-down view, park bench, 128x64px, 
classic wooden slatted bench seen from above, warm brown wood, 
dark metal armrest ends, simple and clean, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — bbq.png**
```
Pixel art, Stardew Valley style, top-down view, barbecue grill, 64x64px, 
round dark grey charcoal grill on legs seen from above, circular cooking 
grate pattern on top, tiny orange ember glow underneath lid gap, 
suburban backyard feel, dark outline, no anti-aliasing, transparent background
```

**Prompt — lamppost.png**
```
Pixel art, Stardew Valley style, top-down view, garden lamp post, 64x128px, 
thin dark iron post with a small warm yellow glowing lantern top, 
light glow halo circle around lantern head, classic park or garden style, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — scarecrow.png**
```
Pixel art, Stardew Valley style, top-down view, farm scarecrow, 64x128px, 
T-shaped scarecrow on a wooden post, floppy hat on top, old shirt and 
trousers stuffed with straw visible from above, friendly and rustic, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — fountain.png**
```
Pixel art, Stardew Valley style, top-down view, garden fountain, 128x128px, 
circular stone basin seen from above, water jet in centre sending ripple 
rings outward, blue-green water, elegant formal garden feel, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — tractor.png**
```
Pixel art, Stardew Valley style, top-down view, parked farm tractor, 
192x128px, green John-Deere style tractor seen from above, large rear 
tyres, smaller front tyres, dark cab roof, yellow trim details, 
powerful and chunky, dark outline, no anti-aliasing, transparent background
```

**Prompt — trampoline.png**
```
Pixel art, Stardew Valley style, top-down view, backyard trampoline, 
128x128px, round trampoline seen from above, black jumping mat, 
bright blue or green safety padding ring around edge, silver metal legs 
barely visible, suburban backyard toy, dark outline, no anti-aliasing, 
transparent background
```

---

## 6. Fencing & Boundaries

All fence tiles are **64×64 px**, designed to connect seamlessly.

| Asset | Filename | Notes |
|---|---|---|
| Wooden fence — horizontal | `fence_h.png` | Horizontal run |
| Wooden fence — vertical | `fence_v.png` | Vertical run |
| Wooden fence — corner TL | `fence_tl.png` | Top-left corner |
| Wooden fence — corner TR | `fence_tr.png` | Top-right corner |
| Wooden fence — corner BL | `fence_bl.png` | Bottom-left corner |
| Wooden fence — corner BR | `fence_br.png` | Bottom-right corner |
| Wooden gate (closed) | `gate_closed.png` | Entryway |
| Wooden gate (open) | `gate_open.png` | Variation |
| Stone wall section | `wall_stone.png` | Cemetery / formal garden |
| Iron fence — horizontal | `iron_fence_h.png` | Cemetery level |
| Iron fence — vertical | `iron_fence_v.png` | Cemetery level |
| Hedge tile | `hedge.png` | Dense hedge boundary |

**Prompt — fence_h.png**
```
Pixel art, Stardew Valley style, top-down view, horizontal wooden fence 
section tile, 64x64px, two warm brown horizontal rails with a vertical 
post at each tile edge, slightly weathered wood grain, designed to tile 
seamlessly left-right, dark outline, no anti-aliasing, transparent background
```

**Prompt — gate_closed.png**
```
Pixel art, Stardew Valley style, top-down view, closed wooden garden gate, 
64x64px, two fence posts flanking a simple plank gate with a small latch, 
matches the fence style, charming farmyard feel, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — iron_fence_h.png**
```
Pixel art, Stardew Valley style, top-down view, horizontal wrought iron 
fence tile, 64x64px, dark near-black iron horizontal rails with thin 
vertical spear-tip pickets evenly spaced, gothic and slightly ominous, 
cemetery style, dark outline, no anti-aliasing, transparent background
```

---

## 7. Vehicles

| Asset | Size (px) | Tiles | Filename | Notes |
|---|---|---|---|---|
| Parked car | 128×192 | 2×3 | `car.png` | Suburban level |
| Parked truck / ute | 192×192 | 3×3 | `truck.png` | Suburban/farm level |
| Parked tractor | 192×128 | 3×2 | `tractor.png` | Farm level |
| Riding mower (player upgrade) | 128×128 | 2×2 | `mower_ride.png` | Future power-up |
| Wheelbarrow | 128×64 | 2×1 | `wheelbarrow.png` | Pushed aside prop |
| Golf cart | 128×128 | 2×2 | `golf_cart.png` | Golf course level |
| Bicycle | 64×128 | 1×2 | `bicycle.png` | Parked prop |

**Prompt — car.png**
```
Pixel art, Stardew Valley style, top-down view, parked car, 128x192px, 
seen from directly above, compact family car shape, dark roof/window area 
in centre, coloured body (suggest blue or red), four dark tyre corners, 
windscreen and rear window glint, no people visible, 
dark outline, no anti-aliasing, transparent background
```

**Prompt — mower_ride.png**
```
Pixel art, Stardew Valley style, top-down view looking straight down, 
large riding lawn mower, 128x128px, green body with yellow seat and steering 
wheel visible from above, wide cutting deck at front, large rear tyres, 
smaller front wheels, powerful and satisfying, dark outline, 
no anti-aliasing, transparent background
```

---

## 8. Level-Specific Asset Sets

### Cemetery Level

| Asset | Filename |
|---|---|
| Iron fences | `iron_fence_h.png`, `iron_fence_v.png` |
| Mausoleum | `mausoleum.png` |
| Dead tree | `tree_dead.png` |
| Crow | `crow.png` |
| Large gravestone (angel) | `grave_angel.png` |
| Grave mound (horizontal) | `grave_mound.png` |
| Dried funeral flowers | `funeral_flowers.png` |

**Prompt — grave_angel.png**
```
Pixel art, Stardew Valley style, top-down view, ornate gravestone with angel 
statue, 64x64px, white stone angel figure seen from above with stone wings 
spread, sits on a heavy plinth base, reverent and slightly haunting, 
dark outline, no anti-aliasing, transparent background
```

### Farm Level

| Asset | Filename |
|---|---|
| Barn | `barn.png` |
| Silo | `silo.png` |
| Tractor | `tractor.png` |
| Haybale | `haybale.png` |
| Corn stalks | `corn.png` |
| Scarecrow | `scarecrow.png` |
| Pig | `pig.png` |
| Cow | `cow.png` |
| Horse | `horse.png` |
| Chicken coop | `coop.png` |

**Prompt — coop.png**
```
Pixel art, Stardew Valley style, top-down view, chicken coop, 256x192px, 
small wooden hen house with a ramp/door, wood plank texture, reddish-brown 
roof, a small fenced yard area attached, straw floor visible, 
dark outline, no anti-aliasing, transparent background
```

### Suburban / Neighbourhood Level

| Asset | Filename |
|---|---|
| Second house variant | `house_b.png` |
| Garage | `garage.png` |
| Parked car | `car.png` |
| Mailbox | `mailbox.png` |
| Concrete path | `path_stone.png` |
| Driveway tiles | `gravel.png` |
| Swimming pool | `pool.png` |
| Trampoline | `trampoline.png` |
| Swing set | `swingset.png` |

**Prompt — house_b.png**
```
Pixel art, Stardew Valley style, top-down view, suburban house variant B, 
704x704px, blue-grey slate shingled roof, lighter left half darker right half 
for depth, white weatherboard-style front wall strip at bottom, double garage 
door to one side, two windows and a front door, tidy suburban feel, 
dark outline, no anti-aliasing, transparent background
```

### Park Level

| Asset | Filename |
|---|---|
| Fountain | `fountain.png` |
| Park bench | `bench.png` |
| Gazebo | `gazebo.png` |
| Lamp post | `lamppost.png` |
| Picnic table | `picnic_table.png` |
| Swing set | `swingset.png` |
| Bin / rubbish bin | `bin.png` |
| Flag pole | `flagpole.png` |
| Cobblestone path | `path_stone.png` |

**Prompt — gazebo.png**
```
Pixel art, Stardew Valley style, top-down view, park gazebo, 320x320px, 
octagonal wooden roof structure seen from above, dark shingled roof 
with a pointed top finial, wooden railing visible below the roofline edge, 
charming park shelter, warm wood tones, dark outline, 
no anti-aliasing, transparent background
```

---

## 9. UI & HUD Elements

| Asset | Size (px) | Filename | Notes |
|---|---|---|---|
| D-pad button (up) | 128×128 | `ui_dpad_up.png` | All 4 directions needed |
| D-pad button (down) | 128×128 | `ui_dpad_down.png` | |
| D-pad button (left) | 128×128 | `ui_dpad_left.png` | |
| D-pad button (right) | 128×128 | `ui_dpad_right.png` | |
| D-pad button (up, pressed) | 128×128 | `ui_dpad_up_active.png` | Active state |
| HUD panel / pill background | 512×128 | `ui_hud_panel.png` | Timer + bar backing |
| Progress bar — empty | 512×64 | `ui_bar_empty.png` | Track |
| Progress bar — fill | 512×64 | `ui_bar_fill.png` | Grass green |
| Banner background | 1×64 | `ui_banner_bg.png` | Tiling horizontal strip |
| Game title logo | 768×256 | `ui_title.png` | "MOWING MADNESS" lettering |
| Minimap border | 256×192 | `ui_minimap_border.png` | Frame around minimap |

**Prompt — ui_dpad_up.png**
```
Pixel art, game controller D-pad button facing up, 128x128px, dark gunmetal 
grey square button with bevelled 3D pixel-art edges, bright white or lime green 
upward arrow on face, slight top-left highlight and bottom-right shadow for 
depth, retro game controller feel, dark outline, no anti-aliasing, 
transparent background
```

**Prompt — ui_title.png**
```
Pixel art, "MOWING MADNESS" game title logo, 768x256px, chunky retro pixel 
lettering in bright lime green with a one-pixel dark outline, slight grass 
blade motif integrated into the letters, Stardew Valley / retro game title 
card feel, transparent background, no anti-aliasing
```

---

## 10. Effects & Particles

These are small sprites used in animation loops or one-shot effects.

| Asset | Size (px) | Filename | Notes |
|---|---|---|---|
| Grass clipping puff | 64×64 | `fx_mow.png` | Plays when mowing |
| Flower petal burst | 128×128 | `fx_flower_crush.png` | When flower is hit |
| Smoke puff | 64×64 | `fx_smoke.png` | Mower exhaust |
| Dust cloud | 64×64 | `fx_dust.png` | Fast turning |
| Star / score pop | 64×64 | `fx_star.png` | Achievement flash |
| Water splash | 64×64 | `fx_splash.png` | Near water |

**Prompt — fx_mow.png**
```
Pixel art, Stardew Valley style, top-down view, grass clipping puff particle, 
64x64px, small burst of tiny green grass blade snippets and a faint pale green 
puff cloud, scattering outward from centre, lively and satisfying, 
dark outline on grass bits, no anti-aliasing, transparent background
```

**Prompt — fx_flower_crush.png**
```
Pixel art, Stardew Valley style, top-down view, flower petal burst particle, 
128x128px, colourful petals in pink/red/yellow scattering outward from centre, 
a small sad puff of green stem debris, expressive and dramatic, 
no anti-aliasing, transparent background
```

---

## 11. Seasonal Variants

Snow-covered or autumn-tinted versions of existing sprites. Generated in exactly the same style as the original but with seasonal overlays.

| Asset | Filename | Base Sprite |
|---|---|---|
| Snow-capped oak tree | `tree_snow.png` | `tree.png` |
| Snow-capped pine tree | `tree_pine_snow.png` | `tree_pine.png` |
| Snow-covered house | `house_snow.png` | `house.png` |
| Snow-covered kennel | `kennel_snow.png` | `kennel.png` |
| Snow-covered tent | `tent_snow.png` | `tent.png` |
| Autumn oak tree | `tree_autumn.png` | `tree.png` |
| Leaf-covered stump | `stump_leaves.png` | `stump.png` |

**Prompt — tree_snow.png**
```
Pixel art, Stardew Valley style, top-down view, snow-covered oak tree, 
128x128px, same round canopy shape as the regular oak tree but with a 
layer of white snow sitting on top of the branches, visible dark green 
underneath the snow patches, cosy winter feel, dark outline, 
no anti-aliasing, transparent background
```

**Prompt — tree_autumn.png**
```
Pixel art, Stardew Valley style, top-down view, autumn oak tree, 128x128px, 
same round canopy shape as the regular oak tree, foliage now in warm orange, 
red and golden-yellow tones, slightly sparser look with gaps, 
a few fallen leaf dots around the base, beautiful autumn feel, 
dark outline, no anti-aliasing, transparent background
```

---

## Summary Count

| Category | Count |
|---|---|
| Terrain tiles | 16 |
| Buildings & structures | 14 |
| Nature & vegetation | 21 |
| Animals & characters | 16 |
| Props & decorations | 30 |
| Fencing & boundaries | 12 |
| Vehicles | 7 |
| Level-specific extras | ~20 |
| UI & HUD | 11 |
| Effects & particles | 6 |
| Seasonal variants | 7 |
| **Total** | **~160** |
