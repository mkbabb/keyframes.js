# b16-perf-profile — Runtime Performance Profile (Tranche I investigation)

**Agent:** Investigation Agent [b16-perf-profile]
**Date:** 2026-06-08
**Target:** the pre-BUILT `dist/gh-pages/` served on an ephemeral port; Chromium
via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js` `playwright-core`.
**Probes (all RUN, results committed alongside):**
- `probes/b16-perf-profile.mjs` → `b16-perf-profile.result.json` (load · backdrop · rAF idle · dock-spring · scene-switch · long-tasks · transfer)
- `probes/b16-perf-steady.mjs` → `b16-perf-steady.result.json` (per-scene STEADY-STATE rAF + concurrent rAF-loop count)
- `probes/b16-easing-isolate.mjs` → `b16-easing-isolate.result.json` (playing-vs-paused cost · pause self-terminate · 4× CPU-throttled floor · SVG node weight)

**Screenshots:** `shots/b16-01-cube-loaded.png`, `shots/b16-02-dock-expanded.png`, `shots/b16-03-after-switch-sequence.png`.

> **Headless caveat (stated once, governs every number).** Headless Chromium runs
> an ~2× rAF clock: a perfect 60 fps frame reads as ~8.3 ms here, not 16.7 ms. So
> the **absolute** ms are not the user's wall-clock. The **load-bearing signal is
> RELATIVE** — a scene whose frame interval is 2× another's, and the **dropped-frame
> count** (intervals > 24 ms ⇒ a 60 fps frame was missed) which is clock-invariant.
> The **4× CPU-throttle pass** (mid-tier laptop emulation) is the closest device-class
> proxy and tells the cleanest story. The user's "slow" is REAL and LOCALIZED below.

---

## TL;DR — WHERE the time goes

1. **The "slow" the user reports is NOT a global engine/backdrop cost. It is ONE
   hot loop: the `/easing` preview sweep.** At rest on cube/square/sequence/motion-path
   the demo holds a clean 60 fps (8.3 ms, 0 dropped). The moment `/easing` (or
   `/spring`) is the active scene **with its preview PLAYING**, the frame budget
   collapses to **21.6 ms mean, 36 / 70 frames dropped (~46 fps)** — and under a 4×
   CPU throttle it is **23.8 ms, 62 / 76 dropped** while cube on the same throttle
   stays **8.3 ms, 0 dropped**. Root cause: the easing rAF loop writes a reactive
   `progress.value` EVERY frame, which re-renders the whole easing stage — **31 SVG
   `<path>` + 22 `<svg>` (243 total nodes)** plus fans out through **2 extra
   `watch(progress)` projections** → a full Vue reactive-render storm at 60 Hz.
   This is B8 ("supremely broken, slow") and the user's "/easing is slow" felt on
   the actual product.
2. **`/easing` runs FOUR concurrent rAF loops at once; `/amiga` runs SIX.** The easing
   sweep + the contract time-twin + ≥2 `useAnimationSync`/timeline rAF pollers stack.
   The pollers are individually gated (idle after 30 stable frames) — they are NOT
   the floor — but they pile onto the sweep's hot frame instead of one composed driver.
3. **The dock-spring DROPS FRAMES on expand: 12 / 114 dropped, p95 25 ms, max 49 ms.**
   This is a glass-ui-owned spring (kf pins `~3.5.1`); the expand stutters even on
   the home/cube route where everything else is buttered. This is the user's "ALL
   dock animations are supremely broken, slow" (B8), measured.
4. **Initial load is FAST (LCP/FCP ≈ 204 ms, DCL 172 ms) — but the COLD TRANSFER is
   16.4 MB / 54 requests, dominated by `vendor-monaco 8.2 MB + ts/css/html workers`.**
   On localhost the bytes arrive instantly so LCP is unaffected; on a real network
   this is a multi-second eager Monaco pull for an editor most visitors never open.
   The boot path still spends **3 long tasks, longest 155 ms, 137 ms total blocking**
   — a real INP/TBT hit at first interaction.
5. **Backdrop-filter is NOT the bottleneck in this profile.** 30 live backdrop-filter
   layers, but a 30× forced-repaint cost 0.7 ms (headless = no real GPU compositing).
   The user's "glass-ui elements are slow" reads through #1 + #3 (Vue/spring cost),
   NOT through blur-fill rate **in this harness** — see Caveat: a real GPU + a
   high-DPI display can still make 30 stacked backdrop layers a fill-rate cost the
   headless compositor hides. Flagged for the on-device re-measure, not closed here.

---

## (1) Initial load — `b16-perf-profile.result.json › initialLoad`

| Metric | Value |
|---|---|
| wall-clock → `load` | 176 ms |
| TTFB | 4 ms (localhost) |
| FCP / LCP | **204 ms / 204 ms** |
| domInteractive / DCL / load | 9 / 172 / 174 ms |
| JS+CSS transfer (decoded) | **7,739 KB** on the cube route alone |
| boot long-tasks | **3** (longest **155 ms**, total blocking **137 ms**) |
| heaviest single resource | `vendor-monaco-COAzEUjw.js` **4,086 KB** |

`serverTransfer` (every byte the server shipped across the whole run, 54 requests,
**16,354 KB**): `vendor-monaco 8.2 MB · css.worker 2.06 MB · vendor-highlight 1.81 MB
· editor.worker 0.82 MB · vendor-reka-ui 0.68 MB · index.css 0.60 MB · vendor-three
0.52 MB`.

**Reading.** Load is *visually* fast because LCP fires on the cube before the heavy
chunks block paint — good. But the demo eagerly ships a 4 MB Monaco core + ~3 MB of
language workers (ts/css/html) on first load, and burns 137 ms of total blocking time
in boot long-tasks. Monaco backs the CSS-keyframes editor (`CSSCodeEditor.vue`), which
is already `defineAsyncComponent`-lazy in source — so a chunk this large arriving at
boot means the lazy boundary is not actually deferring the Monaco core/workers off the
critical path (or a static import is dragging it eager). This is the load-side lever:
the median visitor who never opens the keyframes tab pays a multi-MB Monaco tax.

## (2) Scene-switch latency — `…› sceneSwitch`

The scene **machine** settles fast everywhere (11–68 ms to register `activeScene`).
The cost is the **post-switch frame interval** (transition + new scene's first paints):

| switch → | machine settle | post-switch rAF mean | dropped | max |
|---|---|---|---|---|
| easing | 37 ms | **16.3 ms** | **9 / 37** | 25.7 ms |
| amiga | 11 ms | 15.8 ms | 1 / 39 | **299 ms** (one-off mount spike) |
| spring | 30 ms | **16.7 ms** | **7 / 36** | 25 ms |
| square | 15 ms | 8.3 ms | 0 / 72 | 9.4 ms |
| sequence | 16 ms | 8.3 ms | 0 / 72 | 8.9 ms |
| motion-path | 18 ms | 8.3 ms | 0 / 72 | 8.9 ms |
| cube | 68 ms | 8.5 ms | 0 / 71 | 16.6 ms |

**Reading.** Switching INTO easing/spring is where frames drop — because the
destination scene's hot loop (see #1) starts immediately and dominates the post-switch
window. amiga shows a single **299 ms mount spike** (Three.js scene/geometry init on
first mount), then recovers. square/sequence/motion-path/cube switch buttery (0 dropped).
The switch machinery itself is cheap; the destination scene's steady cost is the story.

## (3) Dock-spring frame timing — `…› dockSpringFrames`

Sampling rAF intervals while moving the cursor onto the collapsed dock to trigger the
glass-ui spring expand (on the cube route, otherwise idle-clean):

```
n=114  mean=10.53ms  p50=8.3ms  p95=25.1ms  max=49ms  dropped=12
```

**Reading.** At rest cube is 8.3 ms / 0 dropped (#5 below). The dock expand spends
**12 dropped frames, p95 25 ms, a 49 ms worst frame** — a visible hitch on a 60 Hz
display. The spring is glass-ui-owned (`GlassDock`, kf pins `~3.5.1`). This corroborates
B8 ("ALL dock animations are supremely broken, slow"). The dock spring is computed +
re-laid-out per frame against a backdrop-filtered pill; the hitch is in the dock's own
expand frames, independent of any scene loop.

## (4) Long tasks (> 50 ms) — `…› longTasksDuringSwitches`

Over the full multi-scene switch run: **5 long tasks, longest 221 ms, 292 ms total
blocking.** The two big ones (125 ms at boot, 221 ms) bracket the amiga (Three.js) mount
and the initial engine warm. These are the INP/TBT offenders — every one blocks the main
thread past the 50 ms responsiveness budget, so a click landing during one feels frozen.

## (5) rAF loop cost — IDLE steady state — `b16-perf-steady.result.json`

Per scene, **after the scene fully rests**, 1.8 s steady-state rAF sample + the
**concurrent rAF-callbacks-per-frame** count (rAF monkey-patched to tally loops/frame):

| scene | steady mean | p95 | dropped | rAF cbs/frame (mean / max) |
|---|---|---|---|---|
| cube | 8.33 ms | 9.1 ms | 0 / 216 | 2 / 2 |
| **easing** | **18.56 ms** | **25.7 ms** | **25 / 97** | **3.99 / 4** |
| **spring** | 9.87 ms | 16.7 ms | **5 / 182** | **3.99 / 4** |
| **amiga** | 8.43 ms | 9.2 ms | 0 / 215 | **5.99 / 6** |
| square | 8.33 ms | 9.2 ms | 0 / 216 | 2 / 2 |
| sequence | 8.37 ms | 9.1 ms | 0 / 216 | 1 / 1 |
| motion-path | 8.37 ms | 9 ms | 0 / 216 | 1 / 1 |

**Reading.** easing is the **only scene that drops frames at rest** (25 / 97 — its
preview sweep keeps playing, that IS its rest state). spring drops a few (5 / 182). amiga
holds 60 fps but runs **6 rAF loops/frame** (Three.js render + OrbitControls damping +
the demo's sync pollers) — fine on a GPU now, but the most loop-dense surface and the one
that spiked 299 ms on mount. cube/square hold a clean 2 loops/frame; sequence/motion-path
are a model **1 loop/frame**. **The loop COUNT is the architectural smell: there is no
single composed frame driver per scene — every concern (sweep, time-twin, sync poll,
timeline poll, three.js, controls) spins its own rAF and they stack.**

## (6) Backdrop-filter cost — `…› backdropFilter`

```
backdropLayerCount = 30
repaint30ms = 0.7   (30 forced full repaints, total)
samples: glass-dock blur(11px) · rounded-card blur(10px) saturate(1.05) brightness(…)
         (area 125,164 px²) · input-pill blur(1px) · glass-wash blur(1px) ×N
```

**Reading.** 30 backdrop-filter layers live at once — including a **125,164 px² card at
`blur(10px) saturate brightness`** (the controls panel) and the `blur(11px)` dock pill.
In **this headless harness** the forced-repaint cost is negligible (0.7 ms total — no
real GPU compositing). So backdrop-filter is **not the measured bottleneck here**, and
the user's "glass-ui slow" is better explained by #1 (Vue render storm) + #3 (spring).
**BUT** — headless masks GPU fill-rate. 30 stacked `backdrop-filter: blur()` layers,
one a large card, IS a known fill-rate cost on a real high-DPI display under scroll/
animation. This is the one finding the harness cannot fully settle; it must be
re-measured on-device (real GPU, Retina) before it is dismissed. Flagged, not closed.

---

## ROOT-CAUSE HYPOTHESIS

**The dominant runtime cost is a Vue-reactivity-per-rAF-frame storm in the `/easing`
preview, NOT the engine, NOT backdrop blur.** Trace:

- `demo/easing/useEasingDemo.ts:153–161` — the `frame()` rAF callback writes
  **`progress.value = sweep.at(phase).p` every frame** while the machine is `playing`.
- `progress` is a Vue `ref` with **multiple reactive consumers**: `watch(progress …)` →
  `contractAnim.t` (`:394`), plus the template binds `progress` to the moving dot on
  **each comparison curve** and to the live readouts. The easing stage renders **31 SVG
  `<path>` + 22 `<svg>` (`b16-easing-isolate.result.json › atLoad`)**.
- Every frame therefore drives a full reactive re-render + SVG re-layout/repaint of the
  whole curve gallery. Measured: **playing = 21.6 ms / 36 dropped; paused = 8.3 ms / 0
  dropped** (`b16-easing-isolate.result.json › playingRaf` vs `afterPauseRaf`). The
  pause-toggle self-terminates the loop correctly (`afterPauseMachine`), proving the
  cost is the per-frame reactive render, not a leaked loop.
- The **4× CPU-throttle** pass makes it undeniable: **easing 23.8 ms / 62 dropped vs cube
  8.3 ms / 0 dropped** on the identical throttle. On a mid-tier laptop, easing is sub-30 fps.

**Secondary cost: no single composed frame driver.** Each scene stacks independent rAF
loops (easing 4, amiga 6). The engine already ships `RAFPlayback` as "THE managed rAF
driver" (`src/animation/playback.ts`) and the demo uses it for the sweep — yet the
time-twin watch, the `useAnimationSync` poll, and the timeline poll each spin their own
rAF beside it. The gestalt fix is one driver per scene that ticks all concerns in one
frame and writes reactive state ONCE per frame (or drives the dot via a non-reactive
transform write — `style.transform` on the dot element, bypassing Vue's render for the
hot path entirely; reactivity is the wrong tool for a 60 Hz positional update).

**Tertiary cost: the dock spring (glass-ui ~3.5.1) drops 12 frames on expand** (#3) and
the **eager 4 MB Monaco + 3 MB workers** load (#1) — both real, both off the easing path.

## INTENDED vs OBSERVED

| Surface | Intended | Observed |
|---|---|---|
| /easing preview | smooth 60 fps curve sweep | **46 fps, 36/70 dropped (sub-30 throttled)** — Vue render storm |
| dock expand | buttery spring | **12/114 dropped, 49 ms worst frame** |
| scene switch (easing/spring) | instant | machine fast (≤37 ms) but **7–9 frames dropped** as the hot loop starts |
| amiga mount | instant | **299 ms one-off mount spike** + 6 rAF loops |
| initial load | lean | LCP fast (204 ms) but **16.4 MB / 137 ms boot-blocking**, eager Monaco |
| glass surfaces | calm | not GPU-fill-bound *in headless*; re-measure on-device |

## SOURCE TRACE (file:line)

- `demo/easing/useEasingDemo.ts:153–161` — `frame()` writes reactive `progress.value`/rAF.
- `demo/easing/useEasingDemo.ts:394–396` — `watch(progress)` → `contractAnim.t` (extra fan-out).
- `demo/easing/useEasingDemo.ts:127–139` — `comparisonCurves` (the SVG gallery re-rendered each frame).
- `demo/@/components/custom/animation-controls/controls/composables/useAnimationSync.ts:40–70` — one of the stacked sync pollers (correctly gated, but additive).
- `demo/@/components/custom/animation-controls/timeline/composables/useTimelineBuild.ts:71` — another stacked `useRafFn`.
- `demo/@/components/custom/dock/ChromeDock.vue:147` — `GlassDock` (glass-ui ~3.5.1) — the dropping spring.
- `src/animation/playback.ts:61` — `RAFPlayback` (THE intended single driver — under-used by the demo's per-scene loop stacking).

## FEEDS-FORWARD (for root-cause + authoring phases)

- **PERF-1 (HIGH):** `/easing` preview = reactive-per-frame render storm. Gestalt fix:
  drive the sweep dot via a direct non-reactive `style.transform` write (or a single
  `requestAnimationFrame` → imperative DOM update), decouple from Vue's render graph;
  write `progress` reactively at most a few Hz for the readouts, not per frame.
- **PERF-2 (MED):** ONE composed frame driver per scene (lean on `RAFPlayback`); collapse
  the 4–6 stacked rAF loops to one tick. Architectural simplicity + INP win.
- **PERF-3 (MED, glass-ui-owned):** dock-spring drops 12 frames on expand — re-examine
  the `~3.5.1` pin (ties to B7/B8 "are we using the latest glass-ui?"). Likely a glass-ui
  consume-edge, not a kf patch.
- **PERF-4 (MED):** eager 4 MB Monaco + 3 MB language workers at boot — verify the lazy
  boundary actually defers Monaco off the critical path; consider not pulling ts/html
  workers the keyframes editor never uses.
- **PERF-5 (LOW, re-measure on-device):** 30 backdrop-filter layers incl. a 125k-px² card.
  Not fill-bound in headless; confirm on a real GPU/Retina before dismissing.
- **A real-gate lesson for the gate-regime overhaul:** a perf gate must assert
  **dropped-frame budget on the RUNNING scene** (play the easing preview, sample rAF,
  assert ≤ N dropped), not a source-shape "uses RAFPlayback" check. The blindspot that let
  H ship a 46 fps easing scene green is EXACTLY a missing runtime-frame-budget gate.
