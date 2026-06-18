# N.W4 — Living previews (7 bespoke idle loops · content-visibility loop-gating · distant poster)

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** N.W2 (the
  carousel ring engine must be PRESENT so the preview components have a host that supplies
  the per-item `visible` / `near` / `front` signal that drives the gating decision). N.W3
  (the arrows shell) is NOT required — previews are independent of arrow motion.
- **Gate (born-RED, the living-previews roster):**
  - `proof:stage-previews-live` — **does NOT exist today** (the component directory
    `demo/@/components/custom/scene-stage/previews/` is ABSENT; `ls` confirms zero preview
    files). The gate asserts: for each of the 7 ring positions the currently-visible barrels
    show a RUNNING idle loop; off-front (opacity < 0.05 per the ring falloff) barrels have
    their `RAFPlayback` PAUSED; the total concurrent `RAFPlayback` instances inside the stage
    overlay never exceeds 5 simultaneously (the perf-budget cap). Born-RED because the
    preview components do not exist.
  - `proof:stage-preview-boundary` — asserts every file under `scene-stage/previews/` imports
    ONLY light-barrel exports (no `loadAnimationEngine`, no `fromMotionPath`, no `DrawSVG`
    from the engine module, no `value.js` direct import). Born-RED: the previews don't exist,
    but any naively-authored preview could pull the heavy engine (the R1↔R2/R3 tension from
    the design-synthesis — the LIGHT-barrel discipline is the keystone invariant; `proof:boundary`
    must stay green with the picker present).

---

## Context

N.W4 is the "hard problem" wave. The design-synthesis identifies it as such (§5): the naive
solution — 7 real scaled scenes — is infeasible (Three.js WebGL context cap ×7, Monaco/orbital
weight, 7 concurrent rAF loops). The solution is a HYBRID: bespoke lightweight idle-loop
mini-previews, each dogfooding ONE light primitive, visibility-gated so only the ~3–5 visible
barrels are live at any moment, and distant ring members rendering as a static poster.

Each preview is a small Vue component in `scene-stage/previews/` that receives `(sceneId,
visible, near, isFront)` props and:

- **FRONT / NEAR (visible ≤ 2 ring positions off-centre):** runs a living idle loop on
  `RAFPlayback`, interactive on hover for the front item, using ONE light primitive per scene.
- **FAR (visible but ≥ 3 positions off-centre):** the `contentvisibilityautostatechange` event
  fires `skipped: true`; the loop is paused via `playback.pause()`. A static CSS poster —
  a last-frame snapshot rendered as a CSS-only representation of the scene's visual identity —
  is shown via `content-visibility: auto` + `contain-intrinsic-size`.
- **INVISIBLE (opacity 0 — the two rear ring members):** loop is fully stopped; the DOM node
  is marked `content-visibility: hidden` so it never contributes to layout/paint.

The fallback for `contentvisibilityautostatechange` (Baseline September 2025; older Safari absent)
is an `IntersectionObserver` with `threshold: 0.1` that delivers the same `skipped`-equivalent
signal. The `@supports not (content-visibility: auto)` bracket gates the IO path.

### The 7 scene × primitive map (locked by design-synthesis §"Per-scene idle states")

> The 7 ring members are the non-home component scenes (registry-derived — see the RESOLVED
> note above). There is NO `HomePreview` ring slot: `home` has no scene component and is the
> close-without-select fallback, not a barrel.

| Scene | id | Primitive dogfooded | Living idle loop description | Static poster |
|---|---|---|---|---|
| Cube | `cube` | `NumericAnimation` (rotateY + rotateX) | Slow continuous 3-axis CSS die tumble via `--rx`/`--ry` CSS custom properties animated at ~0.15 rev/6s; `--face-*` colours intact | mid-tumble pose |
| Amiga | `amiga` | `SpringProgress` (translateY) | 2-D CSS Boing-ball hop: `translateY(0→−18px→0)`, `scaleY(1→0.9)` floor squash, ~1.8s loop — NOT Three.js (NEVER a WebGL context in a preview) | ball at apex |
| Square | `square` | `decay` / `NumericAnimation` | A box breathes (`border-radius 8↔20px`) + 2° rock; hover → a `decay()` fling across the preview | resting square |
| Easing | `easing` | `NumericAnimation` (stroke-dashoffset) | A bezier curve draws itself (`stroke-dashoffset L→0`, ~2s); a dot traces the finished curve, ~3s loop total | dot at curve end |
| Spring | `spring` | `SpringProgress` (translateX) | A needle flicks to a random target every ~2.5s then rings to rest with visible overshoot — the pure SpringProgress showcase | needle at rest |
| Sequence | `sequence` | `stagger` + `NumericAnimation` | 4 dots rise in a staggered wave (`stagger({ from: 'first', each: 120ms })`), fade, repeat ~3s | wave mid-flight |
| Motion-Path | `motion-path` | `NumericAnimation` (offset-distance CSS) | A traveller sweeps a CSS `offset-path` figure-8 via `offset-distance: 0%→100%`, `rotate: auto` banks it; PURE CSS offset-path (no `fromMotionPath` — HEAVY) | traveller at path midpoint |

> **Note (RESOLVED from the live registry, 2026-06-17 — NOT punted to IMPL).**
> `demo/app/scenes.ts` defines `HOME_SCENE_ID = "home"` as the no-component hero landing
> (it carries NO `icon` and NO scene component — `scenes.ts:82-87`) plus exactly **7
> component scenes**: `cube`, `amiga`, `square`, `easing`, `spring`, `sequence`,
> `motion-path`. The ring therefore carries the **7 non-home component scenes** — the
> preview table above lists 8 (Home + the 7) but the Home row is a documentation entry only;
> the gate measures the 7 ring members. `home` is the close-without-select fallback, not a
> ring slot. This matches the synthesis §5 list (7 scenes) and N.md's "7-item carousel
> ring". The count is FIXED at 7, derived from the registry — no IMPL-time ambiguity.

### Performance contract

The performance contract is: at most **5 concurrent `RAFPlayback` instances** running inside
the stage overlay at any moment (front + 2 near each side = 5; the 2 rear are always stopped;
any intermediate state where a spin is in progress caps at the 5 nearest). This is a relative
threshold, gated in `proof:stage-previews-live` via a live browser measurement — NOT an absolute
frame-time number (the CI device-dependence lesson: absolute thresholds fail on the slow Linux
runner; relative concurrent-count is device-independent).

The `will-change: transform` discipline: applied only to the FRONT item's preview host during
an active spin, removed when the ring settles (`useRingOrbit` settles signal). Never a permanent
`will-change` on all 7 preview nodes.

---

## Scope

Each S-clause is a concrete, falsifiable deliverable.

### S1 — `usePreviewVisibility.ts` composable (content-visibility + IO fallback)

**Breach.** Off-front preview loops run continuously (wasted rAF on the slow Linux runner;
7 simultaneous idle loops is the headline perf risk identified in design-synthesis §risks).

**Cure.** Author `demo/@/components/custom/scene-stage/composables/usePreviewVisibility.ts`:

- Accepts a template ref to the ring-item's host element and a reactive `isFront` / `isNear`
  flag from `useRingOrbit`.
- Attaches a `contentvisibilityautostatechange` listener (the efficient-background-processing
  Baseline event) on the host; on `event.skipped === true` calls `playback.pause()` on the
  preview's exposed `RAFPlayback` ref; on `event.skipped === false` calls `playback.resume()`.
- Under `@supports not (content-visibility: auto)`: falls back to an `IntersectionObserver`
  (`threshold: 0.1, rootMargin: '0px'`) with equivalent pause/resume logic.
- For the INVISIBLE rear items (angle > 150deg per the ring falloff — `useRingOrbit` exposes
  `isVisible: boolean`): calls `playback.stop()` unconditionally; sets `content-visibility:
  hidden` on the host inline style.
- Exposes `{ isGated: Ref<boolean> }` for the static-poster CSS class toggle.

**Falsifiable check.** Mount the stage; spin to a far-flank position; assert via
`page.evaluate` that the preview `RAFPlayback` at index `i` where `Math.abs(effectiveAngle) >
102.8deg` has `playback.running === false`. Assert that the front `RAFPlayback` has
`playback.running === true`. The total running count ≤ 5.

### S2 — 7 bespoke idle-loop preview components (one per scene, LIGHT-barrel only)

**Breach.** The `scene-stage/previews/` directory does not exist; no idle loops are authored.

**Cure.** Author 7 Vue components in `demo/@/components/custom/scene-stage/previews/`:

- `HomePreview.vue` — `NumericAnimation` ping-pong over `translateY` for the hero word;
  a CSS blinking caret via `animation: blink 1s step-start infinite` (pure CSS, no engine).
- `CubePreview.vue` — `NumericAnimation` over two CSS `@property` custom properties
  `--preview-rx` and `--preview-ry` (both `<angle>`, initial 0deg), advancing at 0.15
  rev/6s (looping via `RAFPlayback`); a 3-face CSS die using `--face-1..3` tokens.
- `AmigaPreview.vue` — a `SpringProgress` (response 0.38, damping 0.55 — the hop overshoot)
  driving `translateY`; a `NumericAnimation` over `scaleY` for the floor squash; a CSS
  checkerboard div (background-image: repeating-conic-gradient) cycling hue via a single
  CSS animation on `filter: hue-rotate`. NEVER imports Three.js.
- `SquarePreview.vue` — `NumericAnimation` ping-pong over `border-radius (8→20px)` + a 2deg
  CSS rock. On hover: a `decay()` call (light export) computes the fling trajectory; the box
  translates to a random X within the preview bounds and decays to rest.
- `EasingPreview.vue` — an SVG bezier path with `stroke-dasharray: L; stroke-dashoffset: L`;
  a `NumericAnimation` over `stroke-dashoffset` drives the self-draw (0→L over 2s); a second
  `NumericAnimation` sweeps a dot along the finished path via `offset-distance` on a sibling
  element.
- `SpringPreview.vue` — a `SpringProgress` (response 0.5, damping 0.6 — deliberate overshoot)
  tracks a target that reseats to a new random X every 2.5s; a needle `div` follows via
  `translateX`; the settle ring is the whole point.
- `SequencePreview.vue` — 4 `div` dots; a `stagger({ from: 'first', each: 120 })` produces
  delay offsets; each dot runs a `NumericAnimation` `translateY(0→−14px→0)` with its stagger
  delay baked in at construction time; the whole wave loops via a `RAFPlayback` that resets
  after `3000ms` virtual time.
- `MotionPathPreview.vue` — a traveller `div` on `offset-path: path('M...')` (a figure-8
  authored as a literal SVG path string — no `fromMotionPath`, which is HEAVY); a
  `NumericAnimation` over `offset-distance: 0%→100%` drives the sweep at ~4s/loop;
  `rotate: auto` banks the traveller. The path string is a fixed constant (not the editable
  motion-path scene's live bezier).

**Falsifiable check.** For each preview: mount in isolation (a test harness with
`content-visibility: visible`); assert the `RAFPlayback` is running; assert the animated
CSS property changes value between frame 0 and frame 500ms of virtual time (via `__tick(500)`
from the synthetic clock — N.W4 is AFTER the M.W4 synthetic-clock lands, or provides its own
test-only `__tick` shim). Assert the preview file imports ONLY from `@mkbabb/keyframes.js`
light-barrel exports (the `proof:stage-preview-boundary` static scan).

### S3 — `ScenePreview.vue` dispatcher (scene-id → preview component)

**Breach.** No dispatch layer exists; ring items have no way to render a scene-specific preview.

**Cure.** Author `demo/@/components/custom/scene-stage/ScenePreview.vue`: accepts `sceneId:
string`, `isFront: boolean`, `isNear: boolean` props; `defineAsyncComponent`-loads the
matching preview from `previews/` (lazy — the imports are code-split so only the previews
for visible ring items are fetched); wraps the preview's host in the `content-visibility:
auto; contain-intrinsic-size: auto 160px auto 160px` style (the contain-intrinsic-size
prevents the layout-collapse the research warns against); passes `isFront`/`isNear` into
the preview for the front interactive upgrade.

The front preview receives an additional `interactive: true` prop: when true, the preview
exposes a hover interaction surface (the SquarePreview decay fling, the SpringPreview
target-reset on click, etc.) that is disabled when `interactive: false` (flanks don't
respond to hover — the DK64 "one protagonist" read).

**Falsifiable check.** A `ScenePreview` with `sceneId="spring"` mounts `SpringPreview`
(verified by querying a data attribute set by the component); `sceneId="amiga"` mounts
`AmigaPreview`. Switching `isFront` from false → true applies the interactive class to the
host. The `defineAsyncComponent` lazy load is confirmed by verifying the `spring` preview
chunk is NOT in the initial bundle (the `proof:stage-preview-boundary` also verifies no
heavy chunk is pulled at ring mount time).

### S4 — Static poster path (distant items, `content-visibility: hidden`)

**Breach.** No static poster is defined for the two rear (fully-invisible) ring items. If
loops run for rear items the perf budget is blown; if they render nothing the ring looks
broken during the spin-through.

**Cure.** Each preview component implements a `poster` slot: a CSS-only representation of
the scene's visual identity that renders under `content-visibility: hidden` (degenerate
case — the browser skips layout/paint; the poster only shows during the brief spin window
when the rear item transitions through visibility). The poster is authored as a minimal SVG
or CSS shape stamped with the scene's accent color token (cube → `--face-1` tinted die
silhouette; amiga → `--amiga-red` disk; spring → a thin horizontal line with a dot; etc.).

The `usePreviewVisibility` composable applies `content-visibility: hidden` when
`isVisible === false` (rear items, angle > 150°) and `content-visibility: auto` for all
other states; `content-visibility: visible` is reserved for the front item's interactive
surface (the research warns against putting content-visibility on above-fold / front items).

**Falsifiable check.** Mount the stage; navigate the ring such that a rear item has
`Math.abs(effectiveAngle) > 150deg`; assert its host has `content-visibility: hidden`
in computed style; assert the poster child is present in the DOM but the loop
`RAFPlayback.running === false`. A spin-through of that item (it briefly becomes a flank)
asserts `content-visibility: auto` is applied within one frame of the visibility crossing.

### S5 — Perf-budget gate: ≤5 concurrent `RAFPlayback` instances inside the stage

**Breach.** No gate asserts the concurrent-loop cap. The research identifies 7 simultaneous
idle loops as the headline perf risk (design-synthesis §risks: "8 live previews tank perf").

**Cure.** `proof:stage-previews-live` clause (the concurrent-cap arm): in the browser test,
open the stage overlay with the ring in a stable state (any position); query all
`RAFPlayback` instances exposed on the stage's root component via a test helper; assert
`running.length ≤ 5`. The assertion is a COUNT — not a frame-time threshold — so it is
device-independent. The test repeats after a full spin (360°) to confirm the cap holds
through a complete ring rotation.

**Falsifiable check.** Today the previews do not exist → the gate is born-RED (no
`RAFPlayback` instances queryable, no concurrent-count assertion). After the cure: the gate
measures the real `running` count via the stage root's exposed test handle, confirms ≤ 5,
and exits 0. A planted violation (commenting out a `pause()` call for a far item) REDs the
gate by producing a count of 6.

---

## Born-RED gate

**The wave's named born-RED gates:** `proof:stage-previews-live` AND
`proof:stage-preview-boundary` — both ABSENT today, verified 2026-06-17.

### `proof:stage-previews-live` (living idle + gating correctness)

**Tier:** browser integration (opens the stage overlay, actuates the ring spin,
queries `RAFPlayback.running` counts and CSS property deltas — a UI/interaction
correctness gate on the AXIS-1 tier per inv-M-two-axis).

**The REAL observable (inv-M-observable-truth).** The genuine defects (were the
previews to exist without this gate):

1. A loop for an invisible rear item runs uncapped → perf budget blown; the
   slow-Linux-runner frame-drop repro is the real observable.
2. A `content-visibility: hidden` item's `RAFPlayback` is never paused even though
   the DOM skips paint → wasted JS budget, invisible to a source-shape grep.

The proxy to AVOID: a source grep asserting `pause()` is called in the composable
(greens while the pause is unreachable due to an event listener bug). The gate's born-RED
witness opens the stage, spins to a rear position, and directly queries
`playback.running` on the rear item's composable — the REAL paused-or-not state.

| Clause | Today's tree | After cure |
|---|---|---|
| C1 — previews mount | no `ScenePreview` component exists | 7 previews mount, one per ring item |
| C2 — front loop running | n/a | front item `RAFPlayback.running === true` |
| C3 — rear loops paused | n/a | rear items (angle >150°) `RAFPlayback.running === false` |
| C4 — concurrent cap ≤ 5 | n/a | `running.length ≤ 5` after full spin |
| C5 — poster present for rear | n/a | rear item DOM contains a `.stage-preview-poster` child |

**Today's tree result:** RED by construction — `scene-stage/previews/` ABSENT.

### `proof:stage-preview-boundary` (LIGHT-barrel discipline for previews)

**Tier:** hygiene / static (a source-shape scan + import graph check — AXIS-2 data-model
per inv-M-two-axis: it loads the compiled dist and checks the import graph, NOT a source grep).

**The REAL observable.** The genuine defect: a preview author imports `fromMotionPath`
(HEAVY) for the motion-path preview's traveller sweep, pulling value.js into the light
interaction layer and breaking `proof:boundary`. The proxy to AVOID: asserting the
string `fromMotionPath` is absent in the file text (greens if the import is aliased or
re-exported). The gate imports the built preview chunk and asserts `loadAnimationEngine`
and `fromMotionPath` are not in its module graph (the import-graph walk, not a grep).

**Today's tree result:** RED by construction — no preview files exist; the gate
sub-aggregator for `proof:stage-preview-boundary` is absent from `package.json`.

**GREEN condition.** All 7 preview components mount and animate; off-front
loops are paused (verified by `RAFPlayback.running`); concurrent count ≤ 5 through a
full spin; every preview file's import graph is value.js-free; `proof:boundary` stays
green with the stage present in the demo build.

---

## Dependencies

| Dep | Required state |
|-----|----------------|
| **N.W2** (carousel ring engine) | must be present — `useRingOrbit` provides `effectiveAngle`, `isVisible`, `isFront`, `isNear` per-item reactive signals that `usePreviewVisibility` consumes |
| **M.W4 synthetic clock** (or N-local shim) | the S2 falsifiable checks use `__tick(500)` to advance virtual time deterministically in the preview unit tests; if M.W4 has not landed, N.W4 provides a test-only `injectSyntheticRaf` shim in `test/stage/` (NOT in src) |
| `proof:boundary` (existing gate) | must stay GREEN — `proof:stage-preview-boundary` adds a per-file arm to the same import-graph discipline; the gate cannot regress the existing boundary |
| **glass-ui `~4.0.0`** | no direct dep — the preview components are pure engine + CSS, no glass-ui tokens beyond the color tokens already on the page |
| inv-16 | holds throughout — all files are under `demo/` (the picker writes only this repo) |

---

## Bite — what regression each S-clause prevents

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `usePreviewVisibility` | 7 simultaneous idle loops running for invisible/rear items tank the frame budget on the slow Linux CI runner; the loop-gating is the perf-budget enforcement |
| S2 7 preview components | A WebGL Three.js instance is used for the Amiga preview (WebGL context cap ×7 → browser kills contexts); a `fromMotionPath` import breaks `proof:boundary` |
| S3 `ScenePreview` dispatcher | All 7 preview chunks load eagerly at stage mount (bundle bloat; the defineAsyncComponent lazy split is the perf contract) |
| S4 static poster path | A rear item has no `content-visibility: hidden` — its invisible loop runs full-speed (the paused-but-not-gated failure mode); OR the layout collapses on `content-visibility: auto` without `contain-intrinsic-size` (the research-documented gotcha) |
| S5 concurrent-cap gate | The perf budget regresses silently — a future preview adds an uncapped loop; the gate enforces the ≤5 design invariant with a device-independent count assertion |
