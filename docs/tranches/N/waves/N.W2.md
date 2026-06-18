# N.W2 — The carousel ring engine (LIGHT-barrel dogfood)

**Band: IMPL · kf-internal · impl on authorization.**
The 7-item carousel ring: one `SpringProgress` on a ring-angle scalar + CSS trig transforms,
shortest-delta interruptible spin-to-front, `stagger` reveal, per-item scale/opacity/blur/
brightness falloff derived from the live effective angle every frame. The entire picker
remains LIGHT-barrel-only; `proof:boundary` must stay GREEN with the carousel present.
inv-16 holds throughout.

---

## Context — what this wave builds

The ring is the spine of the Stage. It carries 7 `RingItem.vue` cards (one per scene),
arranged on a conceptual horizontal turntable tilted ~15deg toward the user (shared from
N.W1's `.stage-plane`). The ring orbits via a single **scalar** `SpringProgress` on a
`ring-angle` value (degrees, 0–360); each item's effective angle is
`(base-angle + index * 360/7) mod 360`; each item's visual state (scale, opacity, blur,
brightness) is computed per-frame from its `|effective-angle|` via a monotone falloff
function — one coherent physics law for the whole ring.

**The LIGHT-barrel discipline (locked decision 1) is the ring's hard constraint.**
The ring uses:
- `SpringProgress` (light export, `spring.ts`) — for the scalar ring-angle spring.
- `NumericAnimation` (light export, `numeric.ts`) — for per-item idle loops inside
  `RingItem.vue` / `ScenePreview.vue` (N.W4).
- `stagger` (light export, `stagger.ts`) — for the ring-reveal delay distribution.
- `RAFPlayback` (light export, `playback.ts`) — the ONE managed rAF driver (inv ζ, no
  hand-rolled rAF).
- `SmoothProgress` (light export, `smooth.ts`) — optionally for hover-brighten smoothing.

It does NOT use `fromMotionPath` (HEAVY — pulls value.js, models one element per DOM
offset-path), `loadAnimationEngine`, or any value.js import.

**Component tree authored in this wave:**

```
demo/@/components/custom/scene-stage/
├── CarouselRing.vue          # the 7-item turntable; owns the ring-angle SpringProgress + RAFPlayback
├── RingItem.vue              # one barrel: glass card + placeholder preview + counter-rotated face
└── composables/
    └── useRingOrbit.ts       # SpringProgress ring-angle + shortest-delta spin + per-item falloff
```

`CarouselRing.vue` mounts inside `SceneStage.vue` (N.W1). `RingItem.vue` receives computed
visual props (scale, opacity, blur, brightness) as reactive refs derived in `useRingOrbit.ts`.

**Geometry (from the research):**
- 7 items; spacing = 360/7 ≈ 51.43deg.
- Each item transform: `translateZ(340px) rotateY(angle)` — the front item (angle = 0deg)
  faces the user; the ring reads as an elliptical orbit under the 15deg rotateX tilt.
- Front card: additionally `rotateX(-15deg)` to counter-tilt and face the user flat.
- Z-order: `z-index` derived from `cos(angle)` so the front card paints last.
- Falloff by `|angle|` (0 = front, 180 = rear):
  - scale: 1.0 → 0.62 → 0.42 → 0 (linear between the ring positions)
  - opacity: 1.0 → 0.55 → 0.18 → 0 (rear items at ±154deg fade to 0)
  - blur: 0 → 2 → 5 → 8px
  - brightness: 1.0 → 0.5 → 0.28 → 0

**Spin-to-front choreography:**
- A flank-click or arrow press calls `useRingOrbit.spinTo(index)`.
- The shortest signed angular delta is computed:
  `delta = ((target - current) + 180) % 360 - 180`
  (wraps to [-180, +180], choosing the shorter arc).
- `SpringProgress.setTarget(ringAngle + delta)` re-seats the spring velocity-continuously
  from current `(x, v)` — no jump, interruptible mid-spin.
- Spring parameters: response = 0.55, dampingFraction = 0.82 — a hair of overshoot
  = satisfying click-into-place.
- Per-frame: the rAF tick reads the spring's current value → derives each item's
  `effectiveAngle` → recomputes scale/opacity/blur/brightness → writes to reactive refs
  → Vue updates the transforms without additional rAF overhead.

**Reveal (stage open):** `stagger({ from: 'center', duration: 60 })` distributes a per-index
delay (0ms for the center item, increasing outward); each item animates in from a starting
state of `opacity: 0, scale: 0.7` to its computed falloff value on the stagger-delayed beat.

---

## Scope — the S-clauses

### S1 — CarouselRing.vue: 7 items arranged on the turntable

**Deliverable:** `CarouselRing.vue` renders 7 `RingItem` components each translated to their
ring position (`translateZ(340px) rotateY(angle)`). The ring is mounted inside `.stage-plane`
so it shares the 15deg tilt from N.W1.

**Falsifiable:** `document.querySelectorAll('.ring-item').length === 7` in the running demo
after the stage opens; each has a distinct `rotateY` value separated by approximately 51deg;
the front item's `rotateY` resolves to `0deg` (or the effective rotation is 0mod360 for the
selected scene).

### S2 — useRingOrbit.ts: SpringProgress on ring-angle scalar + per-item falloff

**Deliverable:** `useRingOrbit.ts` creates exactly ONE `SpringProgress` instance for the
ring-angle scalar. Per-frame (via `RAFPlayback`) the spring is ticked; each item's
`effectiveAngle` is recomputed from `(ringAngle + index * 360/7) % 360`; scale/opacity/blur/
brightness are derived from the `|effectiveAngle|` falloff function. The reactive refs for
each item are updated in the rAF callback, not in a separate Vue watcher.

**Falsifiable:** `useRingOrbit.ts` does not import `fromMotionPath`, `loadAnimationEngine`,
or any value.js path (grep assertion in `proof:boundary`); the `SpringProgress` constructor
is called exactly once for the ring (one spring, not 7); `RAFPlayback.play()` is called
once and the single rAF loop drives all 7 items' visual states.

### S3 — Shortest-delta spin: flank-click spins the ring via SpringProgress

**Deliverable:** clicking a non-front `RingItem` calls `spinTo(index)`; the ring-angle
spring's target advances by the shortest signed angular delta; the spring re-seats from
its current `(x, v)` (interruptible); the clicked item arrives at the front position (angle
≈ 0deg) within one spring settling window (~600ms at response 0.55, damping 0.82).

**Falsifiable:** with the stage open, click a ring item at index 3 (±154deg from front):
`getComputedStyle(document.querySelector('.ring-item:nth-child(3)')).transform` before
click → a matrix with significant rotateY; after the spring settles → a near-identity
rotateY (~0deg) for that item and the center name-plate reflects the new front scene name.
The spring's current angle never jumps discontinuously (smooth interpolation visible in
a 60fps DevTools Performance recording).

### S4 — Interruptible spin: mid-flight click re-seats the spring

**Deliverable:** clicking a second ring item WHILE the spring is still settling from a
previous click causes the spring to re-seat from its current `(x, v)` — the motion is
continuous, not a jump. The ring does not snap to any intermediate value.

**Falsifiable:** trigger two rapid clicks on different ring items (within 200ms); the ring's
visual trajectory is smooth (no discontinuous jump in the transform matrix); the final
settled position corresponds to the SECOND click's target, not the first.

### S5 — Stagger reveal: ring fans in on stage open

**Deliverable:** when the stage opens, the 7 ring items animate in with a `stagger`-distributed
delay (`from: 'center'`, ~60ms per step). The center item appears first; the flanks follow in
sequence. This uses `stagger()` from the LIGHT barrel, not a hand-rolled delay array.

**Falsifiable:** in a Performance recording of the stage open, the 7 `.ring-item` elements
begin their opacity/scale transition at distinct, evenly-spaced time offsets (center first,
±1 flanks next, ±2 next, ±3 last); the delay spacing is approximately 60ms per index step
from center. No `setInterval` / `setTimeout` loop is present in the reveal code (stagger
returns construction-time per-index delay values consumed by the spring ticks).

### S6 — Counter-rotated front face: front card faces user flat

**Deliverable:** the front `RingItem` (the one closest to angle=0deg) carries an additional
`rotateX(-15deg)` transform on its inner `.card-face` element, counter-tilting the N.W1
stage plane's 15deg tilt so the front card faces the user flat.

**Falsifiable:** the front `.ring-item`'s inner `.card-face` has a computed transform matrix
consistent with `rotateX(-15deg)` applied after the parent's `rotateX(15deg)` — the net
result is zero tilt on the card face in the viewport plane. Verified by the card face
appearing rectangular (not foreshortened) in the rendered output.

### S7 — Z-order: front card paints last

**Deliverable:** each ring item's `z-index` is derived from `cos(effectiveAngle)` such that
items nearer to the front (cos ≈ 1) have higher z-index and paint over items behind them.
The front item is always topmost.

**Falsifiable:** with the stage open and 7 items visible, `document.querySelectorAll('.ring-item')`
sorted by `getComputedStyle(el).zIndex` places the front item last (highest z-index value).

### S8 — LIGHT-barrel-only: no HEAVY import in the carousel code

**Deliverable:** none of `CarouselRing.vue`, `RingItem.vue`, or `useRingOrbit.ts` imports
`loadAnimationEngine`, `fromMotionPath`, `fromDrawSVG`, `animate`, or any direct value.js
path. `proof:boundary` passes with the carousel present.

**Falsifiable:** the `proof:n-stage-boundary` import-graph walk (gate arm (b)) finds no
static `engine.ts` / `value.js` edge in the bundled graph rooted at these modules. (A
`grep -rE "loadAnimationEngine|fromMotionPath|fromDrawSVG|value\.js"` over the three files
is a fast *pre-flight* smell-check only — it is NOT the gate, because it greens on an
aliased import or a re-export and reds on a comment; the bundled-graph walk is the oracle.)

---

## Born-RED gate — `proof:n-carousel-ring`

**Gate name:** `proof:n-carousel-ring` (NEW — does not exist today). Two arms:

**(a) Carousel browser arm (playwright-core).**
```
# open demo, trigger dock Select, wait for stage open
page.evaluate(() =>
  document.querySelectorAll('.ring-item').length
) → 7

# click the ring item at index 3 (a non-front item)
page.click('.ring-item:nth-child(4)')
# wait for the spring to settle via a SETTLE PREDICATE (not a fixed sleep — the
# proof:settle-is-predicate discipline): poll until SpringProgress velocity < SETTLE_THRESH
await page.waitForFunction(() =>
  window.__stageRingOrbit?.spring?.velocity != null &&
  Math.abs(window.__stageRingOrbit.spring.velocity) < 1e-2
);
# the REAL observable (inv-M-observable-truth, matching PROGRESS.md §1 N.W2): the ring-angle
# SpringProgress settled value places the CLICKED index at the front (effectiveAngle ≈ 0
# within ε) — read from the spring instance's exposed value, NOT a rendered nameplate string.
page.evaluate(() => {
  const orbit = window.__stageRingOrbit;        // test handle the composable exposes
  const front = orbit.frontIndex;               // derived from the settled ring-angle
  return front === 3 && Math.abs(orbit.effectiveAngle(3)) < 0.5; // degrees, settled to front
}) → true
```
BITE: reds if the carousel renders fewer than 7 items, or if clicking a flank item does not
settle the ring-angle spring so the clicked index is at the front (spin-to-front broken).
The settled-spring read is the genuine oracle; a nameplate-text or rendered-pixel check is
the proxy to avoid (it greens if the nameplate updates from a different code path than the
spring, or before the spring has actually settled).

**(b) LIGHT-barrel IMPORT-GRAPH arm (node, AXIS-2 — the bundled demo graph, NOT a grep).**

> **CORRECTION (adversarial audit, 2026-06-17).** The EXISTING `proof:boundary`
> (`scripts/proof-boundary.mjs`) bundles each LIGHT export of the *library* barrel
> (`src/animation/index.ts`) from source and asserts its static module set is value.js-free.
> It does **NOT** traverse `demo/` at all. A heavy import inside a `demo/scene-stage/` Vue
> component would be bundled into the demo app chunk and would leave `proof:boundary` GREEN —
> so the original ⚠N1 claim ("proof:boundary born-RED with a planted heavy import in any
> stage module") is mechanically FALSE, and a bare `grep -rE` over the directory is exactly
> the L.W11 source-grep proxy the discipline forbids (it greens on an aliased/re-exported
> import). The REAL observable requires a NEW gate that walks the *demo* import graph.

```
# NEW gate proof:n-stage-boundary — a Rollup/Vite import-graph walk over the stage entry,
# NOT a text grep. CONCRETE MECHANISM (the impl locus, authored at N.W2 implementation):
# `esbuild.build({ entryPoints:['demo/@/components/custom/scene-stage/SceneStage.vue'],
# bundle:true, write:false, metafile:true, plugins:[vue, the demo @-alias resolver] })`,
# then walk `result.metafile.inputs` (the resolved STATIC module graph) — the same
# metafile-walk shape `proof:boundary` uses for the library barrel. Assert no input path is
# `src/animation/engine.ts` (the heavy split) / `animate.ts` / `motion-path.ts` /
# `draw-svg.ts` nor any `@mkbabb/value.js` module:
node scripts/proof-n-stage-boundary.mjs   # esbuild metafile walk of the stage subtree
  → asserts: engine.ts ∉ inputs ; value.js ∉ inputs ; loadAnimationEngine reachable ONLY
    via a DYNAMIC import() edge (esbuild marks it a separate output, NOT a static input)

# AND: the EXISTING library-barrel proof:boundary stays GREEN (it is the canary for the
# LIBRARY surface, not the demo — kept as a regression floor, not the picker's gate):
npm run proof:boundary → exits 0
```
BITE: reds if any HEAVY *static* import edge lands in the picker subtree's bundled graph —
the boundary law (locked decision 1) is violated. A planted `import { loadAnimationEngine }`
in any stage module REDs this gate via the GRAPH (the heavy chunk appears as a static edge),
not via a substring that an alias or barrel re-export could evade. This is the AXIS-2
import-graph axis per inv-M-two-axis; the demo-graph walk is the genuine oracle the
library-only `proof:boundary` cannot supply for `demo/` components.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree: `demo/@/components/custom/scene-stage/` does not exist. Therefore:
- Arm (a): `document.querySelectorAll('.ring-item').length` → 0 → **RED** (no ring items).
- Arm (b): grep over non-existent directory → exits non-zero → **RED** (though trivially;
  once the directory exists the grep asserts the content constraint).
- `proof:boundary` is GREEN today (no picker exists to pollute it); arm (b)'s boundary
  clause is the REGRESSION guard — it must stay GREEN after the picker is authored.

**Greens on the cure:** implementing `CarouselRing.vue` + `RingItem.vue` + `useRingOrbit.ts`
with only LIGHT imports, wired into `SceneStage.vue`, closes both arms.

**Implementation locus:** `scripts/proof-n-carousel-ring.mjs` — two sections: (1) the node
grep static check (instant, no browser); (2) the playwright-core browser arm (open demo,
trigger stage, count items, click flank, verify nameplate). Added to `package.json` under
`proof:n-carousel-ring` and appended to `proof:all`.

---

## Deps

- **N.W1 closed** (`proof:n-stage-shell` GREEN): `SceneStage.vue` and `.stage-plane` must
  exist for `CarouselRing.vue` to mount into.
- **glass-ui `~4.0.0`** (consumed published): `RingItem.vue` uses `.glass-floating` /
  `.glass-card` classes for the card chrome (no new recipes — locked decision 6).
- **`proof:boundary` GREEN** (existing gate, on every CI pass): must stay GREEN after the
  carousel is added. The carousel's LIGHT-only imports are the condition.
- **No value.js publish required** — the ring uses zero value.js APIs directly; the LIGHT
  exports (`SpringProgress`, `stagger`, `RAFPlayback`) are in `src/animation/` and already
  published in the current build.

---

## Bite

| S-clause | Regression it catches |
|---|---|
| S1 (7 items on turntable) | Ring renders fewer than 7 items — some scenes are silently absent from the picker. |
| S2 (one SpringProgress, RAFPlayback) | Multiple springs (one per item) or a hand-rolled rAF loop (inv ζ violation); or per-item state is computed in a Vue watcher (wrong axis — defeats interruptibility). |
| S3 (shortest-delta spin) | Spin takes the long arc (~308deg instead of ~52deg for an adjacent item) — the ring rotates the wrong way, feeling broken. |
| S4 (interruptible spin) | Mid-flight click snaps to an intermediate angle or jumps — physically discontinuous motion. |
| S5 (stagger reveal) | All 7 items appear simultaneously — the theatrical fan-in is absent; or hand-rolled delay array not using stagger(). |
| S6 (counter-rotated front) | Front card is foreshortened under the 15deg tilt — the center item reads smaller than it should, breaking the depth hierarchy. |
| S7 (z-order) | Rear items paint over front items — depth ordering is inverted, breaking the theatrical read. |
| S8 (LIGHT-barrel only) | HEAVY import lands in the picker — `proof:boundary` reds on the next CI run (the boundary law's canary). |

N.W2's born-RED gate (`proof:n-carousel-ring`) bites on the two real failure modes: the
ring not rendering at all (arm a), and a HEAVY import silently violating the boundary
(arm b). The two-arm structure follows inv-M-two-axis: the interaction truth goes through
the browser; the source-shape truth stays in a fast static check.
