# Lane 02 — cube (VERDICT #1, #5; shots 01, 05; touches #8, #16, #19, #24, #25, #26)

Design-lane audit of `demo/scenes/cube/` against the owner live-review. Evidence: live probes
against the dev tree (localhost:5180, playwright computed-style + geometry measurement),
production cross-check (keyframes.babb.dev), git archaeology, and the capture pair saved beside
this file: `02-cube-defect-filter-on.png` (current state, dark) / `02-cube-cured-filter-off.png`
(the same page with ONE declaration disabled).

---

## F1 — THE RENDER DEFECT (VERDICT #1): one CSS declaration flattens the whole die

**Defect.** "does not render fully" — at every entry state the cube paints as a single flat
red square (face 1) over the axis lines (shot 01). Confirmed live at 1440×900, light and dark.

**Root cause — CONFIRMED by live falsification, not inference.**
`CubeTarget.css:172-179`:

```css
@media (prefers-reduced-motion: no-preference) {
    .cube--relit {
        filter: drop-shadow( 0 calc(2px + var(--spin-energy, 0) * 10px) ... );
    }
}
```

`filter` is a CSS **grouping property**: any non-`none` filter forces the element's *used*
`transform-style` to `flat` (CSS Transforms 2 §"grouping property values"). `.cube--relit` IS
the `.cube` element — the direct 3D parent of the six `.cube-side` faces — so the entire face
set is flattened onto the cube's plane: the back face is backface-culled, the four side faces
project edge-on to slivers, and exactly the front face ("1") survives. The computed
`transform-style` still *reports* `preserve-3d` (the override happens at used-value time),
which is precisely why style-shape gates never saw it.

**Falsification run** (computed geometry, `getBoundingClientRect` widths of `.cube-side`, dev
tree, cold entry):

| face | filter ON (current) | `filter: none` | PRM `reduce` emulated |
|---|---|---|---|
| front | 225 × 225 | 248 × 248 | 248 × 248 |
| right | **15 × 210** | **115 × 292** | 115 × 291 |
| left | 15 × 210 | 76 × 294 | 76 × 293 |
| top | 210 × 15 | 293 × 76 | 293 × 76 |
| back | 225 (culled) | 206 × 206 | 206 × 206 |

One declaration disabled → the full three-face die renders (see the cured capture). Note the
third column: **the cube renders CORRECTLY under `prefers-reduced-motion: reduce`**, because
the media query gates the filter off — the one audience that asked for less motion gets the
only working render, and any probe that emulates RM (the capture harness has an RM leg,
`scripts/capture.mjs --reduced-motion`) sees a healthy cube.

**Both prompt-named suspects are EXONERATED, with evidence:**

- *The CubeTarget.css carve (74ee9d2)* — content-neutral: 221 lines out of the SFC, 222 into
  the sourced sheet (`git show 74ee9d2 --stat`), scoped attributes verified applied live
  (`.graph` computes `perspective: 1200px`, `idle-bob-52eec346` animates). Not the cause.
- *The S.G2 rest-attitude* — the graph's intro attitude is intact and live: `.graph` computes
  `matrix3d(…)` ≡ `rotate3d(-1, 1, 0, 30deg)`, written by `changeGraphPerspectiveAnim`
  (`useCubeDemo.ts:98-112`). With the filter cured, cold entry presents a proper
  three-quarter, three-face die with NO attitude change needed. Not the cause.
- *(Bonus exoneration)* the `.preserve-3d` utility: the demo's own copy was deleted back at
  17adae2 (Mar 2026), but glass-ui's `base-misc.css` ships it and it is live in the built CSS —
  all four chain elements compute `preserve-3d`.

**Dating + the gate blind-spot.** The filter was introduced at **4686aa4 (tranche-L W11.S2,
2026-06-17)** — the cube has rendered flat for **17 days**, through the L close's
"cube re-lit key-light tracks attitude … render beautifully" live validation, the R impl drive,
5.1.0 publish, and the S drive's 85/85 green roster. **Production keyframes.babb.dev is flat
right now** (probed: right face 13px). Every gate on this surface asserted *style shapes*
(`--lit` presence, crayon hue-exactness, string anchors) or computed-property claims that stay
true when flat; none measured **projected silhouette geometry**. Lane 26/29 should fold this
instance: the "green source-shape gates miss appearance" lesson, fourth recurrence, now with a
grouping-property mechanism that specifically defeats computed-style assertions.

**The T-shaped cure is a deletion, not a workaround.** The `--spin-energy` bloom channel
(the drop-shadow + the `::after` halo, `CubeTarget.css:165-195`; the producer
`useCubeRelit.ts:82-116`; the `flashRoll`/`disposeFlash` plumbing in `CubeTarget.vue`) is
L-era instrument gadgetry of exactly the family the owner is striking (#5, #8, #11, #13), it
is red (feeds #16's "latent red theme" — a red glow under everything), and it is the scene's
single most expensive paint (an animated-radius `drop-shadow` re-rasterizes the 450px cube
subtree per frame — #19). Deleting the channel cures the render, the theme, and the perf line
at once. Depth is already carried by the kept `--lit` face re-light + the lacquer sheen; the
die needs no synthetic glow. Do NOT relocate the filter to a wrapper (any ancestor in the
3D chain re-flattens; a non-ancestor sibling shadow is possible but is exactly the kind of
compensating gadget T is striking).

## F2 — The stage telemetry dies (VERDICT #5 + the #8 family, RULINGS)

- **`rx 0° ry 0° rz 0°` readout** (shot 05) — ruled removed. Kill: `CubeTarget.vue:134-144`
  (markup), `CubeTarget.css:197-222` (chip styles), `useCubeRelit.ts:76-80` (`euler` computed).
  This is also a red-mono floating element — #16/#24 fallout for free.
- **GestureLegend** (`CubeTarget.vue:10-18` — "DRAG: ORBIT / HOLD X/Y/Z / DOUBLE-TAP") — #8 is
  wholesale ("remove all elements like this"); the cube's stamp dies with the S.G3 layer.
  Gesture legibility transfers to the gestures themselves (the axis-lock lines already light
  on hold; the roll rewards discovery).
- **Face axis tags** (`+Z`/`−X` mono stamps on each face — `CubeTarget.vue:104-108`,
  `CubeTarget.css:150-163`) — same drafting-annotation family, duplicating the axis lines'
  semantics on the die itself. Recommend they die with the readout: the die is a die, not a
  labeled specimen. (Design call, not an explicit ruling — flag for owner taste.)
- **Axis lines KEPT** (`CubeAxisLines.vue`) — they are load-bearing (the axis-lock reveal) and
  the owner's shots show no objection. Demote their rest register: `opacity: 0.75 → ~0.45`
  base (`CubeAxisLines.vue:51`) so the stage recedes and only the LOCKED axis speaks.

## F3 — Dead markup + geometry hygiene (VERDICT #26 fallout on this surface)

- **`.rainbow-wrapper` is a corpse.** Six spans per cube (`CubeTarget.vue:66-75`) styled by a
  class with **zero CSS rules anywhere** (grep across demo/, glass-ui dist, and the built
  `index-*.css`: 0 hits). `rainbowTimings` (`CubeTarget.vue:215-218`) computes random
  animation delays for an animation that does not exist — the K.W0 S5d "fix" stabilized the
  timings of a dead element. Delete spans + computation + the z-comment at lines 56-62.
- **`.cube` boxes at 0 × 450px** (probed). Faces are absolutely positioned so the flex item
  collapses to zero width, and `height: calc(var(--side-size) * 2)` is double the die. It
  renders by accident of centering. Size the element honestly: `width/height:
  var(--side-size)` (or `aspect-ratio: 1`), faces centered via `inset: 0; margin: auto`.
- **`h()` render-function slot exposure** — `CubeScene.vue:117-143` (ppmycota HoverCard) and
  `:169-201` (`tabsContent`/`ribbonContent`) are hand-built `h()` trees inside `<script setup>`
  — the non-idiomatic-Vue shape #26 names. These become tiny SFC sub-components
  (`CubePpmycotaBadge.vue`, `CubeMatrixPanel.vue`) or, better, the panel-facility contract of
  #25 absorbs `tabsContent` entirely (F5).

## F4 — Performance on this surface (VERDICT #19)

Measured/read, ranked:
1. **The animated drop-shadow** (F1) — per-frame rasterization of the largest element on the
   page. Dies with F1.
2. **`--lit` per-face custom-property transitions** (`CubeTarget.css:82`, 6 faces × a
   `color-mix`+two-gradient repaint per drag tick). Keep the effect (it is the scene's depth
   signature) but quantize the writes: `litFor(...).toFixed(3)` → `toFixed(2)` in
   `useCubeRelit.ts:72` dedupes ~an order of magnitude of style invalidations during orbit.
3. **`easeInBounce` entrance** (`useCubeDemo.ts:98-104`) — a bounce-*in* on an entrance jitters
   at the start (backwards physics) and runs the engine for 700ms on mount. Replace with the
   scene's one settle easing (below).
4. `will-change` discipline is already correct (transient, `CubeTarget.css:65-68`) — no action.

## F5 — The panel facility (VERDICT #25, #7): cube is the reference implementation

The cube ALREADY carries the full facility — Controls / Keyframes / Timeline per
sub-animation (Rotations · Matrix · Hover) + the conditional Matrix tab riding the DFA's
`extraControlTabs` → `SegmentedTabs` strip. This is the shape #25 demands for square/spring/
easing ("like the core cube… with sub options for the controls, keyframes, timeline"). The
cube lane's obligation is to make it exemplary:
- **#7**: the outer wrapper pane around the controls card + transport card (visible in both
  captures, left side) dies; the panel is ONE glass surface (glass-ui `glass-panel` /
  `floating-panel` chrome), tabs ride glass-ui `SegmentedTabs`, fields ride glass-ui
  `Select`/`Input`/`Slider`/`NumberField` — all present in the 4.0.1 census
  (`node_modules/@mkbabb/glass-ui/dist/components/{ui,custom}`). **No glass-ui gap exists for
  this surface** (#27 delineation: cube needs nothing from BG/BH).
- The Matrix editor stays a first-class tab; its Reset/Fixed ribbon buttons become plain
  glass-ui `Button`s inside the panel (already are, but arrive via the `h()` ribbon — F3).

## Cross-lane observations (not this lane's recommendations)

- The **cursor-light blob** (#22) parks as a static glowing dot top-center on every cube
  capture (both attached) — it reads as debris on this scene's stage; the sitewide lane owns it.
- The transport dock's rainbow play pill + "Rotations" select ordering is #6/#17 (dock lane).
- The home-scene hero overlap with this cube (#3) is the hero lane; note the cube is the home
  BACKDROP subject (`CubeScene.vue:9-14` recede band), so F1's cure also fixes the FIRST thing
  every visitor sees behind the hero.

---

## TARGET DESIGN — "the drafting die on the paper stage"

Direction (committed, glass-ui-consonant): the cube scene is a **drafting table with one
saturated object on it**. The paper grid, the ink-hairline axes, and the glass panel are the
instrument; the die is the only thing allowed color. Every floating annotation is gone —
meaning is carried by material (lacquer + re-light), motion (settle physics), and earned
reveals (the axis lights only while locked). No red wash: red exists only as face 1's crayon,
one hue among six.

**Layout.** Full-bleed paper stage (glass-ui `paper-backdrop` grid, as now). Die centered in
the free stage area; when the panel is open (left, ~420px), the die centers in the remaining
region (the current grid already does this — keep). Axis hairlines cross at the die's origin.
Nothing else on the stage. Mobile: unchanged recede-band contract for home; die at
`min(50vh,50vw,18rem)`.

**Type ramp (per glass-ui typography rungs, #24).** Face numerals: Instrument Serif via
`text-display-2` (KEPT — this is the one correct display use on the stage). Panel labels/tabs:
glass-ui's text/label rungs (native sans). Fira Code appears ONLY inside the Matrix editor
cells and panel value fields — never floating on the stage. Zero mono telemetry chips.

**Color.** Faces keep the six crayon tokens `--face-1…6` (hue-exact). Stage is paper +
`--muted-foreground` hairlines. Axis colors `--axis-x/y/z` at rest opacity ~0.45, full only
while locked. The `--color-progress` red leaves the stage entirely (no bloom, no readout).

**Motion (one settle language).** Entrance: graph attitude `rotate3d(-1,1,0,30deg)` arrives on
`ease-out-back` ~650ms (single overshoot — the die "sets down"); PRM: snap to attitude. Idle:
the existing 5px `idle-bob` (PRM-gated) — kept. Orbit: quaternion drag + inertia — kept
untouched. Axis-lock: line lifts to full opacity + solid stroke — kept. Roll egg: double-tap
tumble on `ease-out-back` — kept (engine dogfood); the landing "thunk" is expressed by the
tumble's own overshoot, no filter flash. Face re-light `--lit` — kept, quantized.

**What dies (complete kill-list).** The `--spin-energy` channel (filter + `::after` bloom +
producer + `flashRoll`); the attitude readout (+ CSS + `euler`); GestureLegend; the six
`rainbow-wrapper` spans + `rainbowTimings`; the face axis tags; `easeInBounce`; the outer
panel wrapper pane; the `h()` slot trees (recomposed as SFCs).

---

## T recommendations

1. **T-CUBE-1 — Restore the 3D die: delete the `--spin-energy` bloom channel** · Remove
   `CubeTarget.css:165-195` (filter + `::after`), `useCubeRelit.ts:82-116`, the
   `flashRoll`/`spinEnergy` wiring in `CubeTarget.vue`; keep `--lit` re-light + lacquer ·
   Gate: a projected-silhouette oracle — at cold entry, NO reduced-motion emulation, ≥3
   `.cube-side` rects each with width AND height > 0.25·side (plus the owner-shot visual
   capture diff); grep-zero `spin-energy` in `scenes/cube/` · **S**
2. **T-CUBE-2 — Strip the stage telemetry (rulings #5/#8)** · Delete the attitude readout
   (markup+CSS+`euler`), GestureLegend usage, face axis tags, and the dead `rainbow-wrapper`
   spans + `rainbowTimings`; demote axis-line rest opacity to ~0.45 · Gate: grep-zero
   `cube-attitude|GestureLegend|rainbow-wrapper|face-axis-tag` under `scenes/cube/`; capture
   shows an annotation-free stage · **S**
3. **T-CUBE-3 — One settle-motion language** · Replace the `easeInBounce` graph intro with
   `ease-out-back` (~650ms) matching the roll; PRM snaps to attitude · Gate: probe reads the
   graph's settle transform reaches `rotate3d(-1,1,0,30deg)` within 800ms with ≤1 overshoot
   sign-change; RM-emulated run shows no intro animation frames · **S**
4. **T-CUBE-4 — The panel facility, exemplary (with #7)** · Cube's Controls/Keyframes/
   Timeline/Matrix panel re-chromed as ONE glass-ui panel (`glass-panel` + `SegmentedTabs` +
   ui field primitives), outer wrapper pane deleted; documented as the cross-scene reference
   contract #25 demands (shared with the panel/controls lane) · Gate: DOM probe — exactly one
   panel surface element (no nested wrapper card), all four tabs reachable, zero non-glass-ui
   field components in the cube panel tree · **M**
5. **T-CUBE-5 — CubeScene idiomatic recomposition + geometry hygiene** · `h()` slot trees →
   SFC sub-components (`CubePpmycotaBadge`, matrix panel via the T-CUBE-4 contract); `.cube`
   sized honestly (`--side-size` square, faces `inset:0;margin:auto`) · Gate: grep-zero
   `h(` in `CubeScene.vue`; probed `.cube` rect == side×side ±1px · **M**
6. **T-CUBE-6 — Re-light write quantization (perf, #19 slice)** · `--lit` producer rounds to
   2 decimals + skips no-op writes (`useCubeRelit.ts:72`) · Gate: instrumented 2s scripted
   orbit counts per-face style writes — ≥5× reduction vs. current; visual capture unchanged ·
   **S**
