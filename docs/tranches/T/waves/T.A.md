# T.A — THE STAGE RESTORED (scene correctness)

> **Band role.** T.A carries the §0-root-cause-3 cures: real, root-caused rendering
> defects that sat under green source-shape gates because the gates measured the wrong
> thing. Every wave here ships **an oracle that REDs on the *defect*, not a proxy**
> (charter §0.3). This band is correctness, not taste — where a wave also carries an
> aesthetic disposition, the appearance slice rides **T.M**'s owner-token capture and is
> called out; the band's own gates are BORN-RED and falsifiable on today's `tranche-s-impl`
> tree.
>
> **Lanes:** 02-cube (ALL), 03-amiga (ALL), 04-square (rec 1 — normalizer/keyframes/FSM
> core), 07-prune-triage (recs 3, 4).
>
> **The two LIBRARY touches (the only two T.A puts in `src/`, per charter §4 non-goals).**
> `T.A6` (amiga plain-vars `frame.transform` projection) and `T.A14` (MorphSVG
> attribute-first render contract). Both are **new-defect-driven** (§4 ring-fences them as
> the ONLY sanctioned library touches), both mark **LIBRARY**, both carry **unit + browser**
> oracles per the lane specs. Everything else is demo-side scene correctness.
>
> **The arming-audit lesson binds three waves** (charter §5 clause 1 — recurred 5× in S):
> T.A13 (square Play becomes honest), T.A15 (scenes cold-enter playing), and T.A8/T.A9
> (amiga physics/framing) are **actuation-semantic changes** — each re-arms *every* gate and
> driver built on the OLD behavior in the SAME motion. Their lockstep rows name the gates.

## Wave index

| id | title | size | library? | born | lanes |
|---|---|---|---|---|---|
| T.A1 | Restore the 3D die — delete the `--spin-energy` bloom channel | S | — | RED | 02 rec 1 |
| T.A2 | Cube stage strip-down (rulings #5/#8) | S | — | RED | 02 rec 2 |
| T.A3 | Cube one settle-motion language | S | — | RED | 02 rec 3 |
| T.A4 | Cube `.cube` geometry hygiene | S | — | RED | 02 rec 5 (geometry slice) |
| T.A5 | Cube re-light write quantization | S | — | RED | 02 rec 6 |
| T.A6 | **Plain-vars `frame.transform` contract** | M | **LIBRARY** | RED | 03 rec 1 |
| T.A7 | Amiga rides the group compositor; gesture as additive layer | M | — | RED | 03 rec 2 |
| T.A8 | The Boing IS the scene | M | — | RED | 03 rec 3 |
| T.A9 | Honest arc — delete the fit solver, retune physics | M | — | RED | 03 rec 4 |
| T.A10 | Amiga stage strip-down + grid-room | S | — | RED | 03 rec 5 |
| T.A11 | Transient telemetry via glass-ui MetricBadge | S | — | RED | 03 rec 6 |
| T.A12 | Render-on-demand present loop | S | — | RED | 03 rec 7 |
| T.A13 | Square honest Play — unit-normalizer + four-corner keyframes + FSM | M | — | RED | 04 rec 1 (core) |
| T.A14 | **MorphSVG attribute-first render contract** | S | **LIBRARY** | RED | 07 rec 3 |
| T.A15 | The autoplay contract — time-driven scenes cold-enter playing | S | — | RED | 07 rec 4 |

---

## Cube (lane 02) — T.A1 … T.A5

### T.A1 — Restore the 3D die: delete the `--spin-energy` bloom channel
- **Scope.** Delete the L-era bloom channel that flattens the whole die. `filter` is a CSS
  grouping property → forces `.cube--relit`'s *used* `transform-style` to `flat`, collapsing
  the six `.cube-side` faces onto one plane (only face 1 survives). Remove:
  `CubeTarget.css:165-195` (the `@media` `filter: drop-shadow(... --spin-energy ...)` +
  the `::after` halo); `useCubeRelit.ts:82-116` (the `spinEnergy` producer +
  `flashRoll`/`disposeFlash`); the `--spin-energy` binding + `flashRoll` wiring in
  `CubeTarget.vue:39,192,276`. Keep the `--lit` per-face re-light + lacquer sheen (depth is
  carried there). Do **NOT** relocate the filter to a wrapper — any ancestor in the 3D chain
  re-flattens; a compensating sibling shadow is exactly the gadget T strikes.
- **Gate (BORN-RED).** `proof:cube-silhouette` — at cold entry, **no reduced-motion
  emulation**, ≥3 `.cube-side` `getBoundingClientRect`s each with width AND height >
  0.25·`--side-size`; grep-zero `spin-energy` under `scenes/cube/`. **Reds today:** the
  right/left/top faces measure 15px slivers (lane 02 F1 table) → < 0.25·side. Rides T.M's
  owner-blessed perceptual reference oracle for the capture diff
  (`02-cube-cured-filter-off.png`).
- **Size.** S. **Lanes.** 02 rec 1 (T-CUBE-1).
- **Edges.** This is the FIRST thing every visitor sees — the cube is the home backdrop
  subject (`CubeScene.vue:9-14`), so the cure also fixes the home hero backdrop (T.D hero).
  The bloom is red-under-everything → feeds #16's "latent red theme" (T.D) and is the scene's
  costliest paint (#19, T.G).
- **Lockstep.** The bloom is a *defect*, not a gated tell — but grep `scripts/` for
  `spin-energy`/`flashRoll` and retire any gate clause that asserts the bloom/flash exists
  (lane-18 rule: never leave a gate pointing at a deleted tell). Add the silhouette oracle to
  the roster + `SCENE_GATE_META` cube entry.

### T.A2 — Cube stage strip-down (rulings #5, #8)
- **Scope.** Delete the on-stage annotation layer the owner struck. The `rx 0° ry 0° rz 0°`
  attitude readout: `CubeTarget.vue:134-144` (markup) + `CubeTarget.css:197-222` (chip) +
  `useCubeRelit.ts:76-80` (`euler` computed). GestureLegend usage (`CubeTarget.vue:10-18`).
  The face axis tags (`+Z`/`−X` mono stamps, `CubeTarget.vue:104-108`, `CubeTarget.css:150-163`).
  The dead `.rainbow-wrapper` corpse — six spans/cube (`CubeTarget.vue:66-75`) styled by a
  class with **zero CSS rules anywhere** + `rainbowTimings` (`CubeTarget.vue:215-218`) + the
  z-comment (`:56-62`). Demote `CubeAxisLines.vue:51` rest opacity `0.75 → ~0.45` so only the
  LOCKED axis speaks.
- **Gate (BORN-RED).** grep-zero `cube-attitude|GestureLegend|rainbow-wrapper|face-axis-tag`
  under `scenes/cube/`; annotation-free stage in the capture. **Reds today:** all four
  strings resolve in-tree. The axis-opacity value (0.45) is a taste tweak → **rides T.M's
  capture sign-off** (no standalone born-RED on the exact number).
- **Size.** S. **Lanes.** 02 rec 2 (T-CUBE-2).
- **Edges.** #5/#8 are OWNER RULINGS catalogued in VERDICT; the cube readout + gesture
  legend are named in **T.E**'s "ruled removals … with gates rewired in lockstep" charter
  row — this wave EXECUTES the cube-scene removal; **T.E owns the fleet-wide ruled-removal
  gate-rewire discipline** (edge).
- **Lockstep (CRITICAL).** `gesture-manifest.mjs`/`proof-gesture-manifest.mjs` **MANDATE**
  the gesture legends the owner ordered removed (VERDICT §0 rc1 names this exact inversion:
  "`gesture-manifest` MANDATES the legends the owner ordered removed"). Removing the cube
  legend WITHOUT re-cutting the manifest reds a gate on the *rejected* UI's absence — the
  lane-18 anti-pattern. Re-cut the cube row out of the gesture manifest in the SAME motion;
  coordinate the fleet manifest re-cut with T.E. Retire any gate asserting the attitude
  readout / face tags.

### T.A3 — Cube one settle-motion language
- **Scope.** Replace the `easeInBounce` graph intro (`useCubeDemo.ts:98-104`) — a bounce-*in*
  jitters backwards at the start and runs the engine 700ms on mount — with the scene's one
  settle easing `ease-out-back` (~650ms), matching the roll egg's landing. PRM snaps to
  attitude.
- **Gate (BORN-RED).** Probe reads the graph settle transform reaches
  `rotate3d(-1,1,0,30deg)` within 800ms with **≤1 overshoot sign-change**; the RM-emulated
  run shows no intro animation frames. **Reds today:** `easeInBounce` is a multi-bounce
  entrance → the settle exhibits several sign changes before rest. The choice of
  `ease-out-back` over other settles is a taste call → **rides T.M sign-off**; the
  ≤1-sign-change gate is objective.
- **Size.** S. **Lanes.** 02 rec 3 (T-CUBE-3).
- **Edges.** None cross-band; the settle language is scene-local. Perf slice (700ms engine
  run on mount) informs T.G.
- **Lockstep.** None removed; the born-RED settle probe joins the cube roster entry.

### T.A4 — Cube `.cube` geometry hygiene
- **Scope.** The `.cube` element boxes at **0 × 450px** (probed): faces are absolutely
  positioned so the flex item collapses to zero width, and `height: calc(var(--side-size)*2)`
  is double the die — it renders by accident of centering. Size it honestly:
  `width/height: var(--side-size)` (or `aspect-ratio: 1`), faces centered via `inset: 0;
  margin: auto`.
- **Gate (BORN-RED).** Probed `.cube` rect == `side × side` ±1px. **Reds today:** measures
  0 × 450.
- **Size.** S. **Lanes.** 02 rec 5 (the geometry slice of T-CUBE-5).
- **Edges.** T-CUBE-5's OTHER half — the `h()` render-function slot trees
  (`CubeScene.vue:117-143` ppmycota HoverCard; `:169-201` `tabsContent`/`ribbonContent`) →
  idiomatic SFC sub-components (`CubePpmycotaBadge.vue`, the matrix panel) — is **demo
  structure (#26)** and belongs to **T.F** (the composed-not-just-placed gate); the matrix
  panel specifically arrives via **T.B**'s panel-facility contract (T-CUBE-4 → T.B). This
  wave takes ONLY the geometry hygiene; the recomposition is cross-ref'd, not dropped.
- **Lockstep.** None; add the `.cube`-rect assertion to the cube roster entry.

### T.A5 — Cube re-light write quantization (perf slice of #19)
- **Scope.** The `--lit` producer (`useCubeRelit.ts:72`) writes 6 per-face custom properties
  each drag tick, each triggering a `color-mix` + two-gradient repaint. Round to 2 decimals
  (`litFor(...).toFixed(2)`) and skip no-op writes — dedupes ~an order of magnitude of style
  invalidations during orbit. Keep the effect (the scene's depth signature).
- **Gate (BORN-RED).** An instrumented 2s scripted orbit counts per-face style writes ≤ **N**
  where today's unquantized path **exceeds N** (an ABSOLUTE cap, not a relative "5× vs
  current" — a relative gate cannot red on today's tree; the lane's "≥5× reduction" is
  restated as `writes ≤ ceil(current/5)`); visual capture unchanged.
- **Size.** S. **Lanes.** 02 rec 6 (T-CUBE-6).
- **Edges.** **T.G** owns the perf oracle methodology (CDP-counter substrate); this wave
  supplies the scene-local write-cap and consumes T.G's measurement seam (edge).
- **Lockstep.** None removed; the write-count instrument is a new dev counter, roster-added.

---

## Amiga (lane 03) — T.A6 … T.A12

### T.A6 — Plain-vars `frame.transform` contract  · **LIBRARY**
- **Scope.** The transform channel hands consumers value.js-2.0.1 **array-boxed internal
  leaves** at the "animate any object" seam; a second writer's `+=` string-concatenates onto
  a boxed value → double-decimal string → `NaN` quaternion → **the mesh is not rasterized**
  (the ball vanishes mid-boing, 97/98 sampled frames corrupt — lane 03 F1). Root chain:
  `compile/frame-compiler.ts:401-410` (`finalizeFrameVars` → `frame.vars =
  unflattenObject(frame.flatVars)`, leaves stay array-boxed under value.js 2.0.1) →
  `engine/interpolate.ts:285` (`frame.transform(anim.unflatten ? frame.vars : frame.flatVars,
  t)` hands the boxed tree straight to the consumer; `unflatten` defaults `true` at
  `engine/animation.ts:139`). **Fix:** deliver PLAIN authored-shaped values — numbers where
  the author wrote numbers, strings where units/colors demand them — via a `plainVars`
  sibling written by the SAME interp stride that fills `value.value` (hot path stays
  zero-alloc, no per-frame alloc). `frame.transform` consumes `plainVars`. **The projection
  MUST cover BOTH consumer paths:** the per-animation path (`interpolate.ts:285`) AND the
  group SoA compositor blend output (`group/soa.ts` / `group/compositor.ts`) — the group path
  today "passes flat ValueUnit values which don't match the nested object structure" (lane 03
  F2), which is why T.A7 can ride the compositor. No demo-side coercion, no `singleTarget`
  dodges.
- **Gate (BORN-RED, unit + browser).**
  - *Unit:* `fromVars({rotation:{x:1.5}})` — the transformFunc receives `typeof
    vars.rotation.x === "number"` (and a units-authored leaf receives the authored string).
    **Reds today:** the leaf arrives as a one-element ValueUnit array (`typeof === "object"`).
  - *Browser:* `amiga-probe.mjs` (in `shots-03-amiga/`) — **zero** non-number `rotation`
    frames during the boing+glide overlap; the mid-boing screenshot **contains the ball**.
    **Reds today:** 97/98 frames corrupt, mid-boing screenshot is ball-less.
- **Size.** M. **Lanes.** 03 rec 1 (T-AM1).
- **Edges.** **T.A7 depends on this** (the group SoA plain-vars output is what lets amiga ride
  the compositor). §4 non-goals ring-fence this as one of T's only two library touches. The
  value.js-2.0.1 array-box shape is the S.C4/S2 consume-edge — **T.S** owns the value.js
  letter; this wave does NOT ask value.js to change (kf projects plain vars on its side).
- **Lockstep.** A new vitest under `test/compile/` (or `test/engine/`) for the plain-vars
  projection; re-verify the existing transform/interpolate tests still pass with the
  `plainVars` sibling present (no shape regression on the DOM-style renderer path, which
  already consumes `.value`).

### T.A7 — Amiga rides the group compositor; gesture as additive layer
- **Scope.** The flagship AnimationGroup scene **bypasses the group compositor**:
  `useAmigaDemo.ts:167-169` sets `animationGroup.singleTarget = false` with the confession
  that the grouped path's var shape is unconsumable (the F1 root, cured by T.A6). Nothing
  interleaves — writers race last-wins; the user's spin pose is stomped to `"0"` one frame
  into the boing (measured Δ −1.1007). **Fix:** spin / bounceX / bounceY become GROUP LAYERS
  composited through the singleTarget SoA path onto one plain-vars target adapter; the user's
  drag/decay spin joins as an **additive layer** (weight 1, `add` blend — the group already
  supports replace/add/weighted). Gesture and animation compose by construction; **no second
  writer on the mesh, ever.** Delete `singleTarget = false` and the transform-per-animation
  workaround.
- **Gate (BORN-RED).** Probe — during simultaneous drag + play, `rotation` stays finite AND
  the user's spin delta **accumulates on top of** the group value (pre-gesture pose preserved
  within ε after the gesture ends; no pose stomp). **Reds today:** the group `Object.assign`
  stomps the pose (F2).
- **Size.** M. **Lanes.** 03 rec 2 (T-AM2).
- **Edges.** **Depends on T.A6** (needs the group SoA path to emit plain vars). This is amiga
  becoming the compositor showcase it was always meant to be (`group/soa.ts` replace/add/
  weighted). Demo-primary; the only library surface is the plain-vars output T.A6 delivers.
- **Lockstep.** `proof-amiga-subject-is-pivot.mjs` / `proof-amiga-decay-visible.mjs` assume
  the current per-animation write path — re-verify both against the composited path
  (arming-audit): the decay glide is now an additive layer, not a raw `mesh.rotation.y +=`.

### T.A8 — The Boing IS the scene
- **Scope.** The scene's MAIN animation is demoted to a hidden double-tap egg that must be
  guillotined by a timer: `AmigaScene.vue:176-185` (`boingTimer = setTimeout(…, 4200)` stops
  the infinite group + hard-snaps `position.set(HOME)` + `rotation.set(0,0,0)` — measured
  one-frame teleport of 0.61 world units, ~0.6 ball-radii); `useAmigaBoot.ts:47-57`
  (duplicate 3000ms chop); `useDoubleTap` on the whole canvas (`:118-121`). **Fix (the
  gestalt inversion):** the dock transport plays the group continuously; there is no chop, no
  timer, no teleport. Stop settles the ball home through a short **SpringProgress** re-seat,
  never `position.set`. The boot egg, the visited-flag sessionStorage machinery, and the
  `bootedOnce` IntersectionObserver re-arm dance (`AmigaScene.vue:199-263`) all die.
- **Gate (BORN-RED).** Probe — **no** frame-pair with a position discontinuity > 0.05 world
  units across play/stop; grep — **zero** `setTimeout` in `scenes/amiga/`. **Reds today:**
  the 0.61-unit teleport at the chop; `setTimeout` present in `AmigaScene.vue` +
  `useAmigaBoot.ts`.
- **Size.** M. **Lanes.** 03 rec 3 (T-AM3).
- **Edges.** **Cold-entry disposition is governed by T.A15** (the autoplay contract): amiga's
  group is time-driven, so it cold-enters PLAYING (RM excepted). This RECONCILES the lane's
  F3 phrasing "cold-entry contract intact — human presses play" (that described the S-era
  contract) with the charter-adopted autoplay contract — see **Charter conflicts**.
- **Lockstep (arming-audit).** Removing the double-tap egg framing + the boot egg re-arms any
  gate/driver that fired the egg to observe the boing. Grep `scripts/` + `test/` for the
  amiga boot/egg/visited-flag drivers; re-point them at the transport-played group.

### T.A9 — Honest arc: delete the fit solver, retune physics
- **Scope.** The bounce is visually dead — authored ±5 crushed to ±0.42 (a ball of radius 1
  moves less than half its own radius). `useAmigaThree.ts:42` `BOUNCE_FIT_MARGIN = 0.35` ×
  the frustum-fit solver (`refreshBounceFraming`, `:88-114`) scales the authored `BOUNCE = 5`
  by 0.084 — the camera frames the REST pose, then the solver crushes the PLAY envelope into
  it. **Fix:** frame the ROOM, not the rest pose, then **delete the entire fit apparatus**
  (`refreshBounceFraming`, `BounceScale`, the `getBounceScale` seam, `BOUNCE_FIT_MARGIN`).
  Author the true arc inside the room: Y slams floor-to-upper-third with gravity easing, X
  sweeps wall-to-wall (~4s/crossing), **Z motion dies** (the original Boing is planar), spin
  is LINEAR about the authentic ~16° tilted axis with the sign flipping when X reverses at a
  wall (today: all three axes 0→2π over 20s under a cubic-bezier — a chaotic eased tumble,
  `useAmigaDemo.ts:73-95`).
- **Gate (BORN-RED).** Probe — `max |py| ≥ 2.5 × SPHERE_RADIUS` during play; spin `|dθ/dt|`
  constant within 5% between wall hits. **Reds today:** `max |py| = 0.422` (< 2.5×radius); the
  eased tumble is non-constant.
- **Size.** M. **Lanes.** 03 rec 4 (T-AM4).
- **Edges.** The camera-frames-the-room ties to the amiga WebGL budget owned by **T.G** (the
  reframe changes the render envelope). The stage VISUAL (grid-room replacing the gray Lambert
  box, contact-shadow) lands in **T.A10** per the lane's own bundling.
- **Lockstep (arming-audit).** The envelope change re-arms `proof-amiga-subject-is-pivot.mjs`
  (pivot geometry) + `proof-amiga-decay-visible.mjs` (the decay glide's visible travel) — both
  must be re-verified against the reframed room and the new arc, in the same motion.

### T.A10 — Amiga stage strip-down + grid-room
- **Scope.** Apply the owner rulings + swap the foreign gray room for the page's own
  substrate. Remove: GestureLegend usage (`AmigaScene.vue:25-32`, shot 08 — ruling #8); the
  CRT pastiche (`AmigaCrtOverlay.vue`, 125L — scanlines/grille/vignette/flash over a live
  WebGL canvas, the haze that turns the stage into a gray-purple slab, compositing cost every
  frame); `useAmigaBoot.ts` (65L); `spinBloom` + `FLICK_BOING_RAD_S` machinery
  (`useSphereSpin.ts:53-68,177-184`, `AmigaScene.vue:146-165`); the
  `.amiga-canvas--power-on` marker; the sessionStorage visited flag. **In:** the gray Lambert
  box DIES; the room floor/back-wall are drawn as the demo's own paper-grid over the theme
  backdrop (renderer stays `alpha:true`); a soft radial contact-shadow blob tracks the ball's
  x, scaling/fading with bounce height (the iconic fake shadow that sells the arc's altitude).
- **Gate (BORN-RED).** DOM census on `#/amiga` — **zero** elements between the canvas and the
  (one) transient metric badge; screenshot diff shows **no** scanline/vignette layer; `find
  scenes/amiga` has **no** `CrtOverlay`/`Boot` files. **Reds today:** the CRT overlay +
  legend + boot files exist; the census finds the atmosphere stack.
- **Size.** S. **Lanes.** 03 rec 5 (T-AM5).
- **Edges.** The removals are the same #8/#5/#13 genus **T.E** owns fleet-wide (edge —
  same gate-rewire discipline as T.A2). The grid-room's COLOR TOKENS (paper/grid-line/
  theme-accent) are **T.D**'s look language (edge — this wave draws the grid; T.D owns the
  token palette). The grid-room composition rides **T.M** capture sign-off (appearance).
- **Lockstep.** Re-cut amiga's row out of `gesture-manifest.mjs` in the same motion (the
  legend is manifest-mandated — same inversion as T.A2). Retire the CRT/boot/spinBloom gates.

### T.A11 — Transient telemetry via glass-ui MetricBadge
- **Scope.** Replace the permanently-parked dishonest readout (`ω 0.00 rad/s` forever at
  rest, occluded on mobile, hand-rolled: `AmigaTelemetry.vue:46-102` re-implements glass-ui's
  `MetricBadge`/`AnimatedDigit`) with **ONE transient glass-ui `MetricBadge`** (value = ω via
  `AnimatedDigit`, unit "rad/s", size `sm`), top-right of the stage (survives the mobile
  sheet), mounted **only while `|ω| > 0.05 rad/s`** and fading at rest. It appears when you
  spin, witnesses the decay() coast, and leaves. `AmigaTelemetry.vue` dies.
- **Gate (BORN-RED).** Probe — badge **absent at rest**, present within 200ms of a drag,
  absent ≤1s after glide rest; the mobile-390 shot shows the badge unoccluded by the sheet.
  **Reds today:** the readout is present at rest (fails "absent at rest") and occluded on
  390 (`rest-390.png`).
- **Size.** S. **Lanes.** 03 rec 6 (T-AM6).
- **Edges.** `MetricBadge`/`AnimatedDigit` are glass-ui 4.0.1 components — **T.H** owns the
  glass-ui consumption discipline; this wave is the amiga-scene consumer (edge). The
  parked-readout removal is the same #13-genus as T.E's ruled removals.
- **Lockstep.** Retire any gate asserting `AmigaTelemetry`'s presence/text; the transient
  badge's mount-window becomes the new assertion.

### T.A12 — Render-on-demand present loop
- **Scope.** `useAmigaThree.ts:200-212` — `present.loop(() => {…render…; return true;})`
  renders the WebGL room 60×/s while **nothing moves** (mean 29.8ms/~34fps on a fast Mac at
  rest — #19). **Fix:** render-on-demand — render when (OrbitControls fired `change` || group
  playing || glide live || re-seat spring live), else skip `renderer.render` while keeping the
  loop light (or stop it and re-arm on interaction). With the CRT gone (T.A10) and the room
  framed statically (T.A9), the at-rest scene is ~free.
- **Gate (BORN-RED).** Probe — `renderer.info.render.frame` **stable over 2s at rest**; first
  interaction frame renders within 1 rAF; mean inter-frame during play ≤17ms on the reference
  Mac. **Reds today:** the frame counter climbs monotonically at rest (F7).
- **Size.** S. **Lanes.** 03 rec 7 (T-AM7).
- **Edges.** "Scenes reach true rest" is a **T.G** charter goal + the pattern is shareable
  (T.G's true-rest fleet oracle) — this wave delivers the amiga instance; T.G owns the
  cross-scene rest oracle + the CDP-counter methodology (the rAF-interval blindspot).
- **Lockstep.** None removed; the frame-counter probe joins the roster; coordinate the
  measurement seam with T.G so amiga's rest gate uses the corrected CDP counter, not the
  blind rAF-interval one.

---

## Square (lane 04, rec 1) — T.A13

### T.A13 — Square honest Play: unit-normalizer + four-corner keyframes + FSM
- **Scope (the T.A core of SQ-T1 — the G2 inversion).** S.G2 amputated the square panel
  because Play painted nothing. The mechanical kill, reproduced: the transformFunc
  (`useSquareDemo.ts:63-100`) is written for the spring loop's **raw-number** diet
  (`` `translate(${tx}px,…)` ``), but the engine hands it **nested `frame.vars` whose leaves
  are ValueUnits** (`interpolate.ts:285`, `unflatten` default true `animation.ts:139`, nested
  build `frame-compiler.ts:410`) — `` `${new ValueUnit(42,'px')}px` `` → `"42pxpx"` → invalid
  CSS → CSSOM **silently discards** the assignment → the box never moves. Deliver the honest
  Play in three parts:
  1. **Unit-honest `num()` normalizer** at the boundary the two writers share: `num(v) =
     typeof v === "number" ? v : v.value`, percent-aware for the nested scale leaf
     (`d.unit === "%" ? d.value/100 : d.value`). The spring loop's raw numbers and the
     engine's ValueUnit leaves both resolve; the `"0pxpx"` kill-class becomes impossible.
  2. **Real four-corner keyframes** (today `x:"0px"→"0px"`, `y:"0px"→"0px"` are motionless —
     `useSquareDemo.ts:337-348`): a diamond tour with full rotation and the nested `d` doing
     visible work — `0%` center/0°/`d:100%` → `25%` (+90,−90)/90°/`d:108%` → `50%`
     (0,+90)/180°/`d:100%` → `75%` (−90,−90)/270°/`d:108%` → `100%` center/360°;
     `backgroundColor` on the sanctioned `--rainbow-*` stops. ±90px sits inside the ±110px
     spring travel envelope so drag and playback share one coordinate world. Now duration/
     easing/direction/fill/iterations visibly govern the paint.
  3. **The {idle, drag, playback} single-authority FSM.** Play → `playback` (group plays,
     springs dormant). Pointerdown on the box mid-play → `drag`: the group **pauses** (the
     existing scrub-pause-resume machine), the springs seat from the box's current painted
     pose (`new DOMMatrix(getComputedStyle(box).transform)` → `springX.value = tx/TRAVEL`,
     target = same) — a seamless takeover dogfooding the library's own adopt/temporal-takeover
     idea at demo scale. Release → springs settle → `idle`; Play resumes from the paused
     clock. **Delete `isPlaying→tumble`** (`SquareScene.vue:114,165-167`) — the tumble
     double-tap stays a gesture, not the Play verb.
- **Gate (BORN-RED).** A `proof:square-honest` v2 slice this wave OWNS: Play displaces the box
  **≥60px within one duration**; editing duration 2000→500ms changes the measured tour period
  accordingly; an easing change alters the mid-tour sample; pointerdown mid-play pauses the
  group and the box tracks the pointer with **no frame jump**; the keyframes string
  round-trips the nested-object shape (fromKeyframes ↔ serialized). **Reds today:** Play
  paints nothing — the box does not move (the `"0pxpx"` discard), so "displaces ≥60px" fails.
- **Size.** M. **Lanes.** 04 rec 1 (SQ-T1 — the normalizer/keyframes/FSM core).
- **Edges.** SQ-T1's OTHER half — the **DFA flip** (`controlSurfaceDFA.ts:99` `square: []` →
  `["controls","keyframes","timeline"]`), the **triad panel restoration**, and the
  **inversion of the four collapse-locked oracles** — is the **T.B** facility surface (the
  triad-everywhere charter row). This wave delivers the honest-Play MECHANISM that makes the
  panel non-lying (T.B's precondition); T.B restores the panel + inverts the DFA oracles. The
  panel chrome (no surrounding pane #7, `SegmentedTabs` not `KfPillTabs` #18) is **T.B**
  (SQ-T4 → T.B). De-annotate the stage (SQ-T2) is **T.E**; no-chrome-without-content (SQ-T3)
  is **T.B**; de-Vue the hot path (SQ-T5) is **T.G/T.F**.
- **Lockstep (arming-audit — this is the flagged one).** Making Play honest is an
  **actuation-semantic change**: `proof-square-honest.mjs` (231L, asserts Play paints
  NOTHING / panel ABSENT), `proof-scene-control-dfa.mjs:187` (`square:{hasPanel:false}`),
  `proof-live-session.mjs` (square trigger `null`), and `test/demo/control-surface-dfa.test.ts`
  (square in the empty-set group) all **gate-LOCK the rejected state** (VERDICT §0 rc1). They
  must flip to born-RED oracles for the restoration **in the same motion as the DFA flip** —
  which is why T.A13 and T.B's DFA restoration are a **joint motion** (edge). Never green a
  gate by resurrecting the rejected collapse; never leave `proof-square-honest` asserting the
  panel is absent after the panel returns.

---

## Morph + autoplay (lane 07, recs 3, 4) — T.A14 … T.A15

### T.A14 — MorphSVG attribute-first render contract  · **LIBRARY**
- **Scope.** The morph subject is invisible-at-rest by construction — the exact shot-17
  failure class. The scoped rule `d: var(--morph-d)` (`MorphTarget.vue:271-276`,
  `useMorphDemo.ts:102-106`) makes visibility depend on a live JS write: a CSS `d:` overrides
  the SVG `d` attribute, so when `--morph-d` is unset/empty the declaration computes to
  garbage → the protagonist renders as **nothing** (the code's own comment admits it). Any
  missed/failed write — an engine throw in `buildMorph`, an HMR re-mount, a scene-swap race —
  yields "a bare grid, nothing else." **Fix (library):** the `from` shape rides the SVG `d`
  **ATTRIBUTE**; `fromMorphSVG` writes the `from` path to `target`'s `d` attribute at build
  time so at rest (no frame written) the subject paints from the attribute; the per-frame
  engine write (`morph-svg.ts:231-235` — today both `d:` CSS AND `--morph-d`) applies the CSS
  channel only while a frame is in flight (which legitimately overrides the attribute during
  animation). The demo's scoped `d: var(--morph-d)` rule dies. **The at-rest state must never
  depend on a live engine write.**
- **Gate (BORN-RED, unit + browser).**
  - *Unit:* a vitest on `fromMorphSVG` — after construction and BEFORE any frame write, the
    target's `d` **attribute** carries the `from` path (`getAttribute("d")` non-empty,
    parses). **Reds today:** the from-shape lives only in the JS-written CSS channel.
  - *Browser:* extend `proof:morph-renders-d` — with **all** engine writes suppressed (build
    `autoPlay:false`, no `interpFrames(0,true)` seed call), the target `<path>` still paints
    the `from` shape (client bbox area > 0). **Reds today:** with `--morph-d` unset the path
    blanks (bbox area 0).
- **Size.** S. **Lanes.** 07 rec 3 (T-MORPH-ATTRIBUTE-FIRST).
- **Edges.** §4 non-goals ring-fence this as T's second (of two) library touches. The **demo
  consumption** lands inside **T.E**'s `scenes/svg/` fusion (the morph act of the one SVG
  scene) — this library wave is independent of the fusion but T.E's fused morph act consumes
  it (edge). Library gates `proof:morph-orients`/`proof:morphsvg-consume` are untouched.
- **Lockstep.** Extend `proof-morph-renders-d.mjs` with the writes-suppressed clause; the new
  vitest joins `test/svg/`. Do NOT green by re-seeding — the point is rest-without-a-write.

### T.A15 — The autoplay contract: time-driven scenes cold-enter playing
- **Scope.** Time-driven scenes cold-enter as a static card (motion-path
  `useMotionPathGesture.ts:156` `autoPlay:false`; the machine enters paused) → first
  impression: broken. **Fix (machine-level, not per-scene flags):** on `SCENE_READY`, any
  scene whose group has ≥1 **time-driven** member cold-enters playing; scrub/drag
  pause-for-gesture semantics unchanged. **Reduced-motion is the exception** (rest pose, no
  autoplay — the existing house contract preserved).
- **Gate (BORN-RED).** For every `SCENES` entry with a subject, cold-load → subject
  paint-state delta within 1.5s with **zero synthetic presses**; the RM-emulated leg shows no
  autoplay. **Reds today:** motion-path (and peers) cold-enter paused → no delta without a
  press.
- **Size.** S. **Lanes.** 07 rec 4 (T-AUTOPLAY-CONTRACT).
- **Edges.** The machine cold-entry default lives in the scene machine — **T.B** owns the
  machine single-writer + the ordered transport-action model ("play-first as data") (edge:
  the autoplay default is authored as machine data on T.B's single-writer). Governs **T.A8**
  (amiga cold-enters playing) and the fused **svg** scene (T.E, which asserts cold-enter
  motion in `proof:svg-scene`).
- **Lockstep (arming-audit — the second flagged one).** Scenes now cold-enter PLAYING → this
  re-arms **every** gate/driver that synthesized a play-press to observe motion, or asserted
  paused-at-cold-entry. Audit `scripts/` for `pressPlayToggle`/`isPlaying`-cold-entry
  assumptions and the per-scene subject-animates gates (motion is now present at cold entry —
  a driver that presses play then measures a delta will now see the delta already begun).
  `proof-live-session.mjs` per-scene expected-states must be re-derived. This is the exact
  "arming-audit, 3rd+ recurrence" the S board keeps re-learning (see the press-origin
  re-arm lesson in the recent commits) — do it in ONE motion.

---

## Cross-band edges (summary)

| From | To | What crosses |
|---|---|---|
| T.A2, T.A10 | **T.E** | The ruled removals (gesture legends, cube readout, telemetry) — this band executes the per-scene removal; T.E owns the fleet-wide ruled-removal + gate-rewire discipline (incl. the `gesture-manifest` re-cut) |
| T.A4 (recomposition slice) | **T.F** | `h()` slot-trees → SFC sub-components (composed-not-just-placed gate) |
| T.A4 (matrix panel), T.A13 (triad + DFA flip + oracle inversion + panel chrome) | **T.B** | The panel facility (SceneFacility, triad-everywhere, surrounding-pane removal, `SegmentedTabs` not `KfPillTabs`, DFA derivation, machine single-writer); cube is T.B's reference scene (T-CUBE-4) |
| T.A8, T.A15 | **T.B** | Cold-entry autoplay authored as machine data on T.B's single-writer |
| T.A5, T.A9, T.A12 | **T.G** | Perf oracle methodology (CDP-counter substrate, true-rest fleet oracle, amiga WebGL budget) — this band supplies scene-local instances; T.G owns the measurement seam |
| T.A6 | **T.S** | The value.js-2.0.1 array-box shape is the S.C4/S2 consume-edge; T.S owns the value.js letter (kf projects plain vars on its own side — no value.js ask) |
| T.A10 (grid tokens), the cube/amiga aesthetic targets | **T.D** | Color/type tokens for the restaged stages; T.D owns the look language |
| T.A11 | **T.H** | glass-ui `MetricBadge`/`AnimatedDigit` consumption discipline |
| T.A14 (demo consumption) | **T.E** | The morph act of the fused `scenes/svg/` scene consumes the attribute-first library contract |
| T.A2, T.A3, T.A10 (appearance slices), cube/amiga targets | **T.M** | Owner-token capture sign-off for any appearance disposition (axis opacity, settle-easing choice, grid-room composition) — no born-RED appearance oracle authored without the token |

---

## Disposition of lane recommendations (zero silent drops)

**Lane 02 (cube — ALL 6 recs):**

| rec | disposition |
|---|---|
| T-CUBE-1 (delete spin-energy bloom) | **T.A1** |
| T-CUBE-2 (strip stage telemetry) | **T.A2** (executes cube removal; gate-rewire discipline → T.E edge) |
| T-CUBE-3 (one settle-motion) | **T.A3** |
| T-CUBE-4 (panel facility exemplary + #7) | **CROSS-REF → T.B** (panel facility / surrounding-pane removal; cube is T.B's reference scene — lane says "shared with the panel/controls lane") |
| T-CUBE-5 (recomposition + geometry) | **SPLIT:** geometry hygiene → **T.A4**; `h()`→SFC recomposition → **CROSS-REF → T.F** (structure); matrix panel → **T.B** |
| T-CUBE-6 (re-light write quantization) | **T.A5** (T.G owns the perf-measurement substrate — edge) |

**Lane 03 (amiga — ALL 8 recs):**

| rec | disposition |
|---|---|
| T-AM1 (plain-vars transform) | **T.A6** (LIBRARY) |
| T-AM2 (rides group compositor) | **T.A7** |
| T-AM3 (Boing is the scene) | **T.A8** |
| T-AM4 (honest arc / fit-solver delete) | **T.A9** |
| T-AM5 (stage strip-down + grid-room) | **T.A10** (T.E ruled-removal + T.D tokens — edges) |
| T-AM6 (transient MetricBadge) | **T.A11** (T.H consumption — edge) |
| T-AM7 (render-on-demand) | **T.A12** (T.G true-rest oracle — edge) |
| T-AM8 (panel-truth for fromVars scenes) | **CROSS-REF → T.B** (lane says "hand-off to the controls lane"; the controls/panel facility is T.B — the pane must project the SELECTED animation's real options) |

**Lane 04 (square — rec 1 assigned; recs 2-5 not this band's assignment, listed for zero-drop):**

| rec | disposition |
|---|---|
| SQ-T1 (honest Play triad) | **SPLIT:** normalizer + four-corner keyframes + FSM core → **T.A13**; DFA flip + triad restoration + four-oracle inversion → **CROSS-REF → T.B** (joint motion — arming-audit) |
| SQ-T2 (de-annotate stage) | **CROSS-REF → T.E** (ruled removals #5/#8/#11/#16; not this band's assignment) |
| SQ-T3 (no chrome without content) | **CROSS-REF → T.B** (panel facility mount condition; not this band's assignment) |
| SQ-T4 (glass-ui-first panel) | **CROSS-REF → T.B** (`SegmentedTabs`/`LabeledField`/`EasingPicker`, no surrounding pane; not this band's assignment) |
| SQ-T5 (de-Vue the hot path) | **CROSS-REF → T.G / T.F** (per-frame reactive-write perf; not this band's assignment) |

**Lane 07 (prune-triage — recs 3,4 assigned; recs 1,2,5,6 are T.E's, listed for zero-drop):**

| rec | disposition |
|---|---|
| T-MORPH-ATTRIBUTE-FIRST (rec 3) | **T.A14** (LIBRARY) |
| T-AUTOPLAY-CONTRACT (rec 4) | **T.A15** |
| T-PRUNE-COMPOSE (rec 1) | **CROSS-REF → T.E** (owns lane 07 prune; not this band's assignment) |
| T-SVG-FUSION (rec 2) | **CROSS-REF → T.E** (the `scenes/svg/` fusion — T.A14's morph contract is consumed inside it; not this band's assignment) |
| T-NO-UTILITY-KEYED-LAYOUT (rec 5) | **CROSS-REF → T.E** (the `.z-dock:has(> .pointer-events-auto)` class-of-rule kill; not this band's assignment) |
| T-READOUT-TRUTH (rec 6) | **CROSS-REF → T.E** (shared progress-sampling seam; the frozen `OFFSET-DISTANCE 0%` + ungated morph poll; not this band's assignment) |

---

## Charter conflicts spotted

1. **The amiga cold-entry contradiction (lane 03 F3 vs. charter-adopted autoplay contract).**
   Lane 03 F3's T-shape says the boing plays "cold-entry contract intact — **human presses
   play**," while charter §1 (T.A row) + lane 07 rec 4 adopt "the autoplay contract (**time-
   driven scenes cold-enter playing**)." Amiga's group is time-driven, so the two rules
   collide at cold entry. **Reconciled in this doc in favor of the charter-adopted autoplay
   contract** (T.A15 governs; T.A8 defers cold-entry disposition to it): amiga cold-enters
   playing, reduced-motion excepted. Flagged for the synthesis index — the lane's parenthetical
   should be read as "the (new) standard cold-entry contract applies," not "wait for a press."

2. **Cube stage removals sit in BOTH T.A's lane-02-ALL assignment and T.E's "ruled removals"
   charter row.** Charter §1 T.A cube scope names ONLY `--spin-energy`; but lane 02 is assigned
   to T.A in full, and T.E's row explicitly lists "cube readout" and "gesture legends" among
   the ruled removals. **Resolved by partition:** T.A2/T.A10 EXECUTE the per-scene removal
   (inseparable from restaging the stage correctly); T.E owns the fleet-wide ruled-removal +
   gate-rewire discipline (the `gesture-manifest` re-cut especially). Both must move in
   lockstep or the `gesture-manifest`-mandates-the-legend inversion (VERDICT §0 rc1) reds a
   gate on the rejected UI's absence. Flagged so T.E's author and I do not double-author the
   `gesture-manifest` re-cut — it is ONE motion, owned jointly, and must not be dropped by each
   assuming the other holds it.

3. **SQ-T1 is a single lane rec spanning two bands (T.A core + T.B facility).** The
   normalizer/keyframes/FSM (T.A13) and the DFA-flip/oracle-inversion/triad (T.B) are one
   indivisible actuation-semantic change under the arming-audit lesson — they cannot land in
   separate batches without a window where `proof-square-honest` still asserts the panel is
   absent while Play already paints. Flagged so the impl orchestration schedules T.A13 + the
   T.B square-DFA flip in the SAME batch/motion.
