# Root-cause — rc-drag-perf · B6 (drag select / persistence) + B8 (dock / glass-ui perf)

**Root-cause agent:** `rc-drag-perf` · Tranche I · 2026-06-08
**Scope:** B6 (square drag highlights chrome text + does not persist) and
B8 (ALL dock animations "supremely broken, slow, errored" + glass-ui slow).
**Design input for:** the I-tranche waves. This is a SEAM diagnosis + a
gestalt-fix DIRECTION, NOT a patch list. No workaround. No legacy.

**Investigation evidence read (verbatim, all RE-confirmed against source):**
`investigate/b6-square-drag.md`, `investigate/b8-dock-glassui-perf.md`,
`investigate/b16-perf-profile.md`, `investigate/b7-specular-glassui.md`, plus the
JSON dumps (`b8-spring-engine-dump.json`, `b16-*.result.json`).
**Source RE-confirmed (file:line):** `demo/app/scenes/SquareScene.vue`,
`demo/square/useSquareAnimations.ts`, `demo/@/composables/useDragScrub.ts`,
`demo/@/components/custom/animation-controls/controls/composables/useDragCapture.ts`,
`demo/@/components/custom/dock/ChromeDock.vue`,
`node_modules/@mkbabb/glass-ui/dist/styles/dock.css`.

---

## TL;DR — the two confirmed root causes and their single shared seam

| | Confirmed root cause (file:line) | Class |
|---|---|---|
| **B6-a text-select** | No GLOBAL select-suppression on drag-start. `SquareScene.vue:2` scopes `select-none` to `.square-stage`; the drag listens at `window` (`:94`) and the pointer legitimately sweeps the chrome (dock + control labels), which stay `user-select:auto`. | CSS / interaction |
| **B6-b non-persist** | `SquareScene.vue:99-107` `pointerup` → `reseat(0,0)` (`:104`) hard-codes spring-home-on-release. The dragged result is discarded BY DESIGN. | Interaction / policy |
| **B8 "slow"** | The dock width morph (`dock.css:305-309` / `:512`) is `transition: width …` on the SAME element carrying `backdrop-filter: var(--dock-surface-blur)` (`dock.css:90`). Animating an intrinsic-size (`width`) property re-runs **layout → backdrop re-blur → composite EVERY frame** → 12/114 dropped on expand (b16 §3). | Compositor / layout |
| **B8 "slow" (compounding)** | `/easing` writes a Vue `ref` (`useEasingDemo.ts:153-161`) per rAF frame → full reactive re-render of 31 `<path>`+22 `<svg>` → 21.6 ms/36-dropped (b16 §1). It is on screen WITH the dock → the dock reads "slow." | Vue reactivity |
| **B8 "errored"** | NOT a dock fault. The B1 `"......"` parse crash (`KeyframesStringControls.vue`) floods the shared console on cube mount while the dock is visible (b8 §H1, dump `consoleErr`). Owned by B1. | (cross-ref B1) |

**The single shared seam both halves of B6 converge on:** the per-scene
**hand-rolled `window`-drag in `SquareScene.vue` is the ONLY one in the scenes**
(grep-confirmed: it is the lone `window, "pointermove"` in `demo/app/scenes/**`),
and it bypasses the shared `useDragScrub` composable entirely. There is **no
seam in the codebase that owns "a drag is in flight"** — so neither global
select-suppression nor a persist/recenter policy has any home. That absence is
the root cause behind BOTH B6 defects.

---

## 1. B6 — CONFIRMED root cause (drag text-select + non-persistence)

### 1a. The text-highlight defect — no GLOBAL select-suppression seam

**Confirmed at `demo/app/scenes/SquareScene.vue`:**
- `:2` — the ONLY `select-none` is on the stage root:
  `<div class="square-stage … select-none">`. Scoped to the stage.
- `:89` — `box.value?.setPointerCapture(e.pointerId)` captures the POINTER
  stream only.
- `:94-97` — `useEventListener(window, "pointermove", …)` drives the drag at
  **window scope**, so the cursor legitimately travels over the entire chrome.
- **There is no `document`/`body`/`<html>` `user-select:none` applied for the
  gesture duration.** `onPointerDown` (`:85`) sets `dragging.value = true` and
  nothing else CSS-global.

The b6 CSS audit (`b6-square-drag.mjs`) proves it structurally:
`html=auto · body=auto · dock=auto · controls=auto` for the WHOLE gesture; 18/18
chrome text elements `user-select:auto`. A real (un-synthetic) mousedown-drag
therefore highlights every dock label and control caption it sweeps. (The
synthetic Playwright drag read 0 selected chars — an artifact of
`setPointerCapture` routing the pointer stream away from the document text-select
machinery, NOT absence of the defect; the CSS audit is the decisive proof.)

**Source-wide confirmation (this agent, grep over `demo/@ demo/app demo/square
demo/cube demo/amiga`, source-only):** the only `user-select:none` declarations
are scoped, surface-local guards — `EasingCurveCanvas.vue:370`,
`OrbitalDrag.vue:331`, `ControlsPaneWrapper.vue:304-305`. **Zero** of them is a
global, gesture-scoped `body.is-dragging` / `documentElement.style.userSelect`
toggle. The class of defect is **latent across every drag surface**, not unique
to square — `useDragScrub.ts` and `useDragCapture.ts` BOTH lack any global
select-suppression too (confirmed by reading both in full). Square is just the
one that escapes its scoped guard most visibly because it listens at `window`.

### 1b. The non-persistence defect — release re-seats to (0,0) by design

**Confirmed at `SquareScene.vue:99-107`** — `useEventListener(window,
"pointerup", …)`:
```
dragging.value = false;
reseat(0, 0);          // :104 — hard-codes spring-home-on-release
springReadout.x = "0.00";
springReadout.y = "0.00";
```
`reseat(nx, ny)` (`useSquareAnimations.ts:162-166`) sets `springX.target` /
`springY.target` and arms the loop; `reseat(0,0)` therefore drives both springs
to 0 — the box springs back to center. The b6 probe captures it exactly:
`heldAtDragEnd = translate(-110px, 88.4px) … scale(1.12)` → `after700ms =
translate(0,0) … scale(1)`. The composable has **no "settle in place" mode** —
`reseat` is the only re-seat verb, and `pointerup` chooses home.

The user's spec: the box should STAY where released. The existing `Home`/`End`
key → `reseat(0,0)` (`:118-124`) already gives an explicit recenter, so removing
the implicit recenter-on-release loses no capability.

### 1c. WHY THE GATES MISSED B6

- **Zero console output, zero pageerror** (b6 §Evidence: "Console: 0 messages.
  PageErrors: 0"). `proof:demo-console-clean` is structurally blind to it.
- **Source-shape GREEN.** `proof:dragscrub-single` (task #121, H.W12) asserts
  "≤1 hand-rolled drag block across scene targets" — and square IS that one
  allowed block, so the gate PASSES while the block it permits is the exact one
  carrying both defects. The gate counts drag blocks; it never DRIVES a drag and
  asserts (a) `getSelection()` empty over a swept chrome label, or (b) box
  transform ≠ identity after settle. A source-shape count cannot witness either.
- **`select-none` IS present** at `:2` — a green source-shape reviewer sees a
  `select-none` on the drag surface and reads "handled." The bug is that it is on
  the WRONG element (the stage, not the document) for a window-scope gesture.

This is the gate-blindspot incarnate: appearance + interaction + state, none of
which a source-shape or console-clean gate observes.

---

## 2. B8 — CONFIRMED root cause (dock / glass-ui "slow")

The b8 + b16 probes agree on the verdict and this agent confirms the mechanism in
the glass-ui CSS source. B8's "supremely broken, slow, errored" is a **composite
of four distinct mechanisms**, ranked by confidence and by what THIS tranche owns:

### 2a. The dock width-morph animates an INTRINSIC-SIZE property under a backdrop-filter — the primary measured dock hitch

**Confirmed at `node_modules/@mkbabb/glass-ui/dist/styles/dock.css`:**
- `:90` — `.glass-dock { backdrop-filter: var(--dock-surface-blur); }`
- `:305-309` / `:338-341` — the dock transitions `padding`, `transform`,
  `background`, `border-color` on `--dock-motion-resize`.
- `:512` — `transition: width var(--dock-motion-resize);` — **`width` IS
  transitioned** (the layer-host width morph), and `--dock-motion-resize =
  var(--duration-normal) var(--dock-resize-spring)` (`:26`), where
  `--dock-resize-spring` is the `--spring-dock` `linear()` easing token.

The mechanism: **`width` is an intrinsic-size property. Transitioning it forces
a LAYOUT pass every frame; and because the SAME element carries
`backdrop-filter`, every layout frame forces the blur region to be
re-sampled/re-composited.** That is the textbook "animating layout under a
backdrop-filter" cost. b16 §3 measures it directly on the otherwise-idle cube
route: **dock expand = 12/114 dropped, p95 25 ms, max 49 ms** — a visible 49 ms
hitch on a 60 Hz display while the rest of the route holds a clean 8.3 ms.

> **The contradiction that IS the finding:** b8's clean-harness probe reports the
> dock morph SMOOTH (95-120fps Chromium / 60fps WebKit) AND finds the
> `SpringProgress` engine FLIP short-circuits to a near-no-op
> (`b8-spring-engine-dump.json`: `springEngineEngaged:false, widthWriteCount:0`,
> `data-morphing` on→off at the SAME `t=4065`). b16's profiling-instrumented probe
> reports the SAME expand DROPS 12 frames. Both are true: the JS spring barely
> runs (so it is NOT the engine), but the **CSS `transition: width` + backdrop
> re-blur** that DOES run is the layout/composite hitch. The slowness is in the
> CSS compositor path, not the keyframes.js engine. The dock is `fit-content` +
> `start-collapsed` (`ChromeDock.vue:147`), so the width delta is sub-pixel and the
> engine bails — leaving the CSS transition as the sole, layout-bound, animator.

### 2b. The `/easing` per-rAF Vue-reactivity render storm — the dominant felt "slow"

**Confirmed at `demo/easing/useEasingDemo.ts:153-161`** (per b16 §1): the
`frame()` rAF callback writes `progress.value = sweep.at(phase).p` EVERY frame
while playing. `progress` is a Vue `ref` with multiple reactive consumers
(`watch(progress)` → `contractAnim.t` at `:394`, plus the template binds it to
the moving dot on every comparison curve). The easing stage is **31 `<path>` + 22
`<svg>` (243 nodes)**, so every frame triggers a full reactive re-render +
SVG re-layout. Measured: **playing = 21.6 ms / 36 dropped (~46 fps); paused =
8.3 ms / 0 dropped**; under a 4× CPU throttle **easing = 23.8 ms / 62 dropped vs
cube 8.3 ms / 0** on the identical throttle. This is the user's felt "slow,"
and the dock shares the screen with it → "the dock is slow."

### 2c. No single composed frame driver — stacked rAF loops

**Confirmed (b16 §5):** `/easing` runs **4** concurrent rAF loops/frame, `/amiga`
runs **6**. Each concern (the sweep, the time-twin `watch`, the
`useAnimationSync` poll at `useAnimationSync.ts:40-70`, the timeline poll at
`useTimelineBuild.ts:71`, three.js) spins its own rAF and they stack onto the hot
frame, where the engine already ships `RAFPlayback` (`src/animation/playback.ts`)
as THE single managed driver — under-used by the demo's per-scene loop stacking.

### 2d. The "errored" half is B1 bleed-through, NOT a dock fault

**Confirmed (b8 §H1 + `b8-spring-engine-dump.json › consoleErr`):** the dock
console carries exactly `[error] Err x 0 …` and `[warning] [KeyframesString]
could not serialize … Parse error at offset 0: "......"` on EVERY probe, on cube
mount, triggered by NO dock action. The user reads "the dock is errored" because
the console is full of B1 errors while the dock is on screen. **No dock-originated
pageerror exists on any run.** This half closes via B1, not via any dock change.

### 2e. WHY THE GATES MISSED B8

- **`proof:dock-morph-settled`, `proof:dock-zorder`, `proof:dock-popover-opens`
  are all GREEN** (b8 §H2) — they assert a token-peak shape (the `--spring-dock`
  +4.5% overshoot is correctly tuned) and z-order/hit-test, NOT a frame budget
  under load. A token-shape gate on a fast headless machine structurally cannot
  witness a 49 ms expand frame on real hardware.
- **The dock morph is near-no-op in the harness** (2a) — the engine spring
  short-circuits, so a runtime probe that samples the JS spring sees nothing
  wrong; only a probe that samples rAF intervals THROUGH the CSS-transition expand
  (b16's method) catches the 12 dropped frames.
- **No CPU-throttled, drop-counting, RUNNING-scene perf gate exists.** H shipped a
  46-fps `/easing` GREEN because every perf gate was a source-shape "uses
  RAFPlayback" check, never "play the preview, sample rAF, assert ≤ N dropped."

---

## 3. The IDIOMATIC, GESTALT fix DIRECTION (the architectural transposition)

> No patch. No workaround. No legacy. Each direction names the SEAM and the
> transposition; the waves choose the exact implementation against a REAL runtime
> gate.

### Direction D1 — Fold the square drag into the shared `useDragScrub` seam, and make THAT seam own a global "gesture-in-flight" body token (closes B6-a for ALL drags, gestalt)

The defect is structural: there is no seam that knows "a drag is live," so global
select-suppression has nowhere to live. The transposition is to give the **shared
drag composable that single authority**:

1. **Lift global select-suppression into `useDragScrub` (and `useDragCapture`).**
   On `onPointerDown` set a single document-level token (toggle a
   `body.is-dragging` class whose rule is `* { user-select: none }`, or set
   `document.documentElement.style.userSelect = "none"`); clear it on `pointerup`
   /`pointercancel`. Because vueuse already owns the listener lifecycle and the
   `dragging` ref already exists (`useDragScrub.ts:56,81`), this is ONE place,
   inherited by EVERY drag surface — square, spring rail, sequence scrub,
   motion-path. Closes the latent class, not just square.
2. **Migrate `SquareScene`'s hand-rolled `window`-drag onto `useDragScrub`.** Its
   `project(e)` is exactly the `reseatFromEvent` math (`SquareScene.vue:77-83`:
   normalize the pointer offset from the captured home center by `travel`); its
   `onScrub` is `reseat(nx, ny)`. This removes the lone bespoke `window` drag in
   the scenes (the one `proof:dragscrub-single` permits-but-does-not-inspect) and
   subsumes it under the seam that now owns select-suppression. **Caveat for the
   wave:** square is 2-axis (`{x,y}`) and the home-center is captured per-gesture
   (`captureFrame` at `:67-75`); `useDragScrub`'s `project` is generic `<T>`, so
   `T = {nx,ny}` fits — but if the generic `project` does not cleanly carry the
   per-gesture `captureFrame`, the seam grows a typed `onStart` capture hook
   (already present: `onStart?(e)` at `:39/67`). Either way the gesture engine
   lands IN the composable (honors `proof:composable-encapsulation`, task #122).

### Direction D2 — Persistence is a POLICY on the drag seam, not a hard-coded home (closes B6-b)

`pointerup` must NOT call `reseat(0,0)`. The transposition: `useSquareAnimations`
exposes a `settle()` verb (or `reseat` gains a `persist` mode) that leaves the
spring TARGETS at their last dragged value — the spring still chases-to-rest at
THAT target, so the lively spring feel is preserved while the box stays where
released. The explicit `Home`/`End` recenter (`:118`) remains the deliberate
"return home" affordance. Stated as a seam concept: the shared drag composable
carries a `releasePolicy: "persist" | "recenter"` so this is a declared choice,
not a buried `reseat(0,0)`. (Spring/MotionPath already PERSIST on release —
square is the outlier hard-coding recenter; D2 brings square into line with the
rest of the rail scenes, which is also the gestalt-consistency win.)

### Direction D3 — The dock must not animate an intrinsic-size property under a backdrop-filter (closes the measured dock hitch, 2a)

The seam is `dock.css:512` `transition: width …` on a `backdrop-filter` element
(`:90`). The gestalt transpositions, in preference order:

- **D3-a (preferred, glass-ui-owned):** the morph should be driven by a
  **compositor-only transform** (a `transform: scaleX()` / clip-path / a FLIP
  where the steady frames are `transform`, not `width`), so no per-frame layout +
  no per-frame backdrop re-sample. This is glass-ui's `useLayerTransition`
  province — the keyframes.js `SpringProgress` FLIP path is the RIGHT mechanism
  but it short-circuits because the `fit-content` layout yields a sub-0.5px width
  delta (2a; `b8-spring-engine-dump.json`). The architectural call: give the dock
  layout a real width delta to drive (so the engine FLIP actually composes
  transforms) OR drive the reveal off transform/clip rather than `width`. **inv-16
  says the engine is NOT fenced this tranche** — so if the FLIP needs the
  `SpringProgress` consume-edge re-shaped, that is in-bounds.
- **D3-b (glass-ui version, B7-adjacent):** kf pins `~3.5.1`; npm latest is
  `3.7.0`, and the glass-ui working tree (`v3.6.0-116`) has already merged the
  specular default-off (`6fac61a`) but it is UNRELEASED (b7). The dock-perf fix
  may ride a glass-ui release; this is a glass-ui consume-edge re-pin, **not a kf
  patch / fork** (honors the standing "all glass-ui changes go in glass-ui"
  precept). The wave must verify whether 3.7.0's dock already moves width off the
  layout path before bumping.

### Direction D4 — One composed frame driver per scene; drive the hot positional update OFF the Vue render graph (closes 2b + 2c, the dominant felt "slow")

`/easing` must not write a reactive `ref` per frame to move a dot. The
transposition: drive the sweep dot via a **direct, non-reactive `style.transform`
write** on the dot element inside the rAF callback (reactivity is the wrong tool
for a 60 Hz positional update), and write `progress` reactively at most a few Hz
for the readouts. Collapse the 4-6 stacked rAF loops to ONE composed driver per
scene by leaning on the engine's existing `RAFPlayback`
(`src/animation/playback.ts:61`) — the single managed driver the demo already
ships but under-uses. This is the largest measured win (46 fps → 60 fps on
easing) and an architectural-simplicity win (one tick per scene). Square already
models the target shape: `useSquareAnimations.ts` runs ONE `RAFPlayback` loop
that ticks all springs and writes `style.transform` directly, NO per-frame Vue
write — the easing scene should adopt the same discipline.

### Direction D5 — The "errored" half folds into B1 (no dock change)

The dock console errors are B1 bleed (2d). Cross-reference the B1 surface doc; no
dock-source change closes them.

---

## 4. The gate-regime consequence (the headline this feeds)

Both defects were SOURCE-SHAPE-GREEN and CONSOLE-CLEAN. The gates this tranche
must add are REAL runtime/interaction gates that reproduce the user's eye:

- **`proof:drag-gesture` (B6).** Playwright DRIVES a real pointer drag over a
  chrome label and asserts BOTH: (a) `window.getSelection().toString()` is empty
  after sweeping a dock/control label (select-suppression is live), AND (b) the
  dragged element's transform ≠ identity after settle (persistence). Run against
  EVERY drag surface, not just square — the seam owns it, so the gate covers it.
- **`proof:perf-frame-budget` (B8).** Playwright, under a **CDP CPU throttle
  (4-6×)**, (a) CLICKS the dock to expand and samples rAF intervals → asserts
  dropped-frames ≤ N; (b) switches to `/easing`, plays the preview, samples rAF →
  asserts ≤ N dropped. This is the gate that would have failed H's 46-fps easing
  and 49 ms dock expand RED. The token-peak gate must be SUPERSEDED, not kept
  beside it.
- **`proof:backdrop-surface-budget` (H3, on-device flag).** Count live
  `backdrop-filter` surfaces per route (30 on cube — b16 §6 / b8 §H3) and assert a
  ceiling; flag the on-device GPU/Retina re-measure that headless masks.

The lesson, stated once for the gate-regime overhaul: **a gate that counts drag
blocks or checks a token peak certifies the SHAPE of the code, never the FELT
behavior. Every gate in this lane must CLICK, DRAG, or PLAY and measure the
result the user reports.**

---

## 5. Disposition summary for the waves

| ID | Root cause (file:line) | Gestalt direction | Owner | Gate |
|---|---|---|---|---|
| B6-a | no global select-suppression; scoped `select-none` (`SquareScene.vue:2`) over a `window` drag (`:94`) | D1 — lift global `is-dragging` token into `useDragScrub`; migrate square onto the seam | demo | `proof:drag-gesture` (a) |
| B6-b | `pointerup → reseat(0,0)` (`SquareScene.vue:104`) | D2 — `releasePolicy: persist`; `settle()` verb; square matches the rail scenes | demo | `proof:drag-gesture` (b) |
| B8-slow-dock | `transition: width` (`dock.css:512`) under `backdrop-filter` (`:90`); engine FLIP no-ops on sub-0.5px delta | D3 — transform/clip-driven morph (real width delta for the FLIP) OR glass-ui re-pin | glass-ui (inv-16: engine unfenced) | `proof:perf-frame-budget` (a) |
| B8-slow-easing | per-rAF `progress.value` write → 243-node SVG re-render (`useEasingDemo.ts:153-161`) | D4 — non-reactive `style.transform` write; ONE composed `RAFPlayback` driver | demo | `proof:perf-frame-budget` (b) |
| B8-slow-stack | 4-6 stacked rAF loops per scene | D4 — one composed driver per scene | demo | `proof:perf-frame-budget` |
| B8-errored | B1 `"......"` console bleed (`KeyframesStringControls.vue`) | D5 — fold into B1 | (B1) | (B1 gate) |
