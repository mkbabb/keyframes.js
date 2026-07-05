# Lane 11 — PERFORMANCE, ground-up (VERDICT #19: "god awful on every single page")

> **Deliverable:** the measured cost table per suspect per scene + the T perf
> architecture. Every number below is instrumented, not vibed — CDP Performance
> domain counters + a rAF-delta frame sampler, driven through the `withPage`
> Playwright harness over the **production build** (`dist/gh-pages`, current), at
> 1440×900 / `deviceScaleFactor:2`. Probes are checked into
> `scratchpad/` (perf-probe.mjs, toggle-probe.mjs, idle-churn.mjs,
> raf-density.mjs, dev-vs-prod.mjs) and re-run identically.
>
> **Measurement caveat (stated once):** headless Chromium raster on macOS is
> somewhat slower than on-GPU desktop Chrome, so the ABSOLUTE fps figures are
> conservative-LOW. What is architecture-truth and device-independent: (a) the
> CDP counters — `RecalcStyleCount`, `LayoutCount`, `TaskDuration` — (b) the
> per-suspect TOGGLE deltas (removing one property, re-measuring), and (c) the
> rAF fan-out density. A dev-vs-prod cross-check (localhost:5180, the owner's
> actual review environment) reproduces the bad-scene framerates within noise —
> **the "god awful" ships; it is not a dev-mode artifact** (§6).

---

## 1. The headline, measured

Three compounding architectural faults, in priority order:

1. **`backdrop-filter` blur, composited over a perpetually-animating stage, is
   the dominant systemic killer.** It is a fixed CHROME cost, independent of
   scene content: the near-empty **morph** scene goes **33 → 116 fps (3.5×)**
   and **motion-path 43 → 120 fps (2.8×)** the instant `backdrop-filter` is
   neutralized. It hits every CSS scene (§3).
2. **No scene ever reaches a resting state.** With ZERO interaction and no play
   pressed, **spring burns 33% of one core** forcing **90 layouts/second**;
   **morph burns 11% CPU rendering a bare grid**; easing forces 28 layouts/s
   (§4). The preview loops run forever with no settle-and-stop and no
   `content-visibility` gate.
3. **Uncoordinated rAF fan-out + `left`/`top` layout animation.** Every
   composable owns its own `requestAnimationFrame` chain (measured avg **3–5**,
   peak **14–30** concurrent rAF callbacks/frame — §5), and spring/sequence
   drive positions by animating the LAYOUT property `left` at 60 Hz instead of
   `transform` (§4b) — forcing synchronous layout every frame.

`amiga` is a **separate, WebGL-bound** problem (11–15 fps, immune to every CSS
toggle — §3, §7). `square`, `sequence`, `compose` are idle-fine at 120 fps but
collapse under their own play interaction.

---

## 2. Cost table — full sweep (production build, dScale 2, 1440×900)

`restCPU`/`playCPU` = CDP `TaskDuration` delta over the 2.5 s sample window (ms
of main-thread + raster CPU). `recalc`/`layout` = `RecalcStyleCount` /
`LayoutCount` deltas (rest / play). `>50ms` = frames over the LoAF threshold.

| Scene | rest fps | rest p95 | play fps | play p95 | play >50ms | restCPU | playCPU | recalc r/p | layout r/p |
|---|---|---|---|---|---|---|---|---|---|
| home | 67.8 | 25.0 | **21.8** | 59.5 | 26 | 266 | **1434** | 173/159 | 93/83 |
| cube | **20.9** | 74.1 | **20.3** | 83.5 | 26 | 418 | 457 | 110/121 | 56/60 |
| amiga | **15.2** | 83.7 | **11.0** | 117 | 28 | **2690** | **3397** | 1/40 | 1/37 |
| square | 120 | 9.8 | 36.7 | 49.4 | 4 | 37 | 97 | 0/111 | 0/1 |
| easing | **33.0** | 67.0 | **32.4** | 66.6 | 15 | 405 | 488 | 172/203 | 74/90 |
| spring | 89.9 | 25.3 | 92.8 | 25.6 | 0 | **707** | **1096** | **465/537** | **228/263** |
| sequence | 119.9 | 9.9 | 77.6 | 25.9 | 0 | 47 | 550 | 0/217 | 0/109 |
| motion-path | 46.1 | 33.4 | 43.7 | 33.0 | 0 | 52 | 177 | 117/128 | 0/1 |
| morph | **33.0** | 50.1 | **30.9** | 50.1 | 4 | 310 | 363 | 201/226 | 83/89 |
| compose | 120 | 9.7 | 120.1 | 10.0 | 0 | 66 | 694 | 0/1 | 0/1 |

Reading it: **cube is locked at ~20 fps even at rest** (its 3-animation CSS-3D
cube + axes never stop); **home-PLAY collapses to 22 fps at 57% CPU** (the
per-char hero); **amiga is 11–15 fps at >100% CPU** (WebGL); **easing is locked
~33 fps** rest AND play; **spring's play does 537 recalcs + 263 layouts** over
2.5 s.

---

## 3. Suspect isolation — the `backdrop-filter` lever (rest fps, one toggle at a time)

Each column injects `*{ <property>: none !important }` and re-samples. The
delta is the isolated cost of that property.

| Scene | baseline | **no-backdrop-filter** | no-bg-image | no-css-anim | no-contain |
|---|---|---|---|---|---|
| morph | 33.2 | **116.5  (+250%)** | 28.3 | 35.3 | 27.2 |
| motion-path | 42.8 | **120.0  (+180%)** | 40.8 | **119.5** | 47.2 |
| easing | 22.4 | **39.5  (+76%)** | 26.4 | 26.3 | 27.8 |
| cube | 90.5 | **120  (+33%)** | 115 | 120 | 73.4 |
| spring | 90.7 | **119.9  (+32%)** | 87.2 | 95 | 98.5 |
| home | 95.7 | **119.9  (+25%)** | 118.5 | 119.9 | 84.0 |
| amiga | 11.4 | 12.4 (noise) | 9.4 | 12.7 | 12.4 |
| square / sequence / compose | 120 | 120 (flat — idle) | — | — | — |

**Root cause.** `backdrop-filter` samples the *backdrop* — everything painted
behind the element up to the nearest backdrop root. The demo's persistent chrome
is glass — glass-ui ships **144 `backdrop-filter` declarations** across
`dock.js`, `glass-panel.js`, `drawer.js`, `cards.css`, `segmented-tabs.css`,
including a `--glass-refract-filter` STACKED on the blur (`backdrop-filter:
var(--glass-blur-resting) var(--glass-refract-filter)` — 2× the sample cost).
The **GlassDock** (`--glass-blur-floating`) and the **controls pane**
(`--control-surface-blur`) sit permanently over the stage. Every frame the stage
subject moves, the blur's source is invalidated → Chromium re-rasterizes the
full blur footprint at up to 60 Hz.

The **motion-path row proves the mechanism**: 43 → 120 fps by removing EITHER
the blur OR the animation (`no-css-anim` also → 119.5). It is the *product*
(moving subject × blur sampling it) that costs — neither alone. Morph proves it
is **content-independent**: an almost-empty scene pays the same 3.5× penalty
because the cost lives in the chrome, not the stage.

**The existing mitigation is INEFFECTIVE.** `App.vue:337` puts `contain: paint`
on `.scene-host` (comment "G1 … the panel blur is no longer invalidated per
scene frame"). Measured: `no-contain` is neutral-to-WORSE (cube 90→73, home
95→84), and `backdrop-filter` removal is the real lever. `contain: paint` on the
scene-host *sibling* does not remove the host's pixels from a *sibling* blur
element's backdrop — the blur still reads them. The G1 claim is falsified by
measurement.

---

## 4. The never-rests scandal — idle churn (4.5 s settle, then 3 s of ZERO interaction)

No play pressed, no pointer, no scrub — the scene simply sits. It should cost ~0.

| Scene | recalc | **layout** | recalcMs | layoutMs | **CPU ms / 3000** | idle %CPU |
|---|---|---|---|---|---|---|
| **spring** | 555 | **272** | 336.3 | 98.3 | **998.5** | **33%** |
| easing | 197 | 84 | 153.9 | 45.2 | 421.7 | 14% |
| **morph** | 234 | **90** | 152.6 | 43.6 | 338.7 | **11%** |
| home | 178 | 27 | 31.5 | 13.9 | 149.6 | 5% |
| cube | 360 | 0 | 32.4 | 0 | 146.6 | 5% |

Spring forces **90 synchronous layouts/second while idle**; morph forces 30/s
**rendering an empty grid**; easing 28/s. This is battery-hostile and is a large
part of what the owner felt as "god awful."

**Root cause (a): perpetual preview loops with no stop.** The spring "Live
solver," the easing hero sweep, the cube 3-animation spin, and the morph engine
render loop all run forever. `useSpringDemo.ts:190/226/274/353` calls
`paintScrubberPhase()`, which (`useSpringHotPath.ts:143`) writes
`scrubberPhase.value = springLive.phase` **every frame at 60 Hz** — a *reactive
ref write per frame*, contradicting that file's own docstring ("the 60 Hz path
is non-reactive `style.transform`; reactive readouts are 6 Hz"). Every 60 Hz
reactive write triggers a Vue flush → style recalc → the `left` re-layout below.

**Root cause (b): animating `left`/`top` (LAYOUT properties) at 60 Hz.** The
spring ball/thumb and the sequence scrubber/playhead are positioned by animating
`left` — `SpringTarget.vue:340,348,434`, `SpringSidebar.vue:263`,
`SpringHeatmap.vue:315` (`left, top`), `SequenceScrubber.vue:154`,
`SequenceTarget.css:201`, `SequencePlayhead.vue:43`. Animating `left` triggers
**layout** every frame; `will-change: left` cannot composite it away (`left` is
not a compositable property) and merely promotes a layer that still re-lays-out.
The codebase KNOWS the cure — `AnimationVisualizer.vue:38` drives its ball via
`transform: translateX(px)` (compositor-only), and `useEasingDemo.ts:158-170`
documents moving OFF per-frame reactive writes to imperative transform painters
"for cube-parity 60 fps." Spring + sequence regressed to `left`.

---

## 5. rAF fan-out density (max / avg concurrent `requestAnimationFrame` callbacks per frame)

| Scene | avg rAF/frame | peak rAF/frame |
|---|---|---|
| easing | **4.9** | 14 |
| spring | 3.1 | 18 |
| morph (bare grid!) | 3.0 | 22 |
| amiga | 2.8 | 30 |
| home | 2.7 | 29 |
| cube | 1.4 | 14 |
| sequence | 0.1 (bursty) | 30 |

**Root cause: no master clock.** Nine+ independent rAF owners can be live at
once, each doing its own `performance.now()`, its own reactive writes, its own
`getComputedStyle`: `useAnimationProgress.ts` (polls every animation in the
group), `useAnimationSync.ts` (per selected animation), `useRafLoop.ts` /
`AnimationVisualizer.vue` (progress ball), `useSceneSwap` `SpringProgress`
(cross-dissolve), `useOrbitalInertia.ts` + `useTransformState.ts` (cube),
`MorphTarget.vue` (engine render), `useSpringHotPath.ts`, plus the scene's own
`RAFPlayback` via `useRafScene.ts`. The engine already OWNS a single managed
driver abstraction (`RAFPlayback` + `AnimationGroup`'s managed loop); the demo
never routes its N auxiliary loops through ONE tick. Morph running avg 3 loops on
an empty grid is the proof.

---

## 6. Dev vs prod — the problem ships (cross-check against the owner's environment)

The owner reviewed `localhost:5180` (Vite dev). Same scenes, dev server:

| Scene | dev fps (localhost:5180) | prod fps (dist/gh-pages) |
|---|---|---|
| cube | 120 (settled/idle) | 90.5 idle / 20.9 animating |
| easing | **27.5** | 22–33 |
| spring | 92 | 89.9 |
| morph | **31.7** | 33.0 |

The bad scenes (easing ~27, morph ~32) are **identical within noise** across dev
and prod. Vue dev-mode overhead is NOT the cause — the architecture (backdrop
blur × perpetual animation × layout-thrash) is baked into the shipped bundle.
This raises, not lowers, the mandate: fixing it is architectural, not "test in
prod."

---

## 7. amiga — the separable WebGL problem

11–15 fps, >100% CPU (`TaskDuration` 2690–3397 ms over 2.5 s = multi-thread
raster). Immune to every CSS toggle (backdrop 11.4→12.4, all ~11–12). Cost is
the Three.js sphere + `AmigaCrtOverlay` + checkerboard texture + `AmigaTelemetry`
(`backdrop-filter: blur(4px)` over the canvas) rendered full-res every frame with
no throttle, no resolution scaling, no `powerPreference` tuning, and telemetry
blur re-sampling the moving WebGL canvas. This is its own T wave; it does not
share a cure with the CSS scenes.

---

## 8. Note on the cursor light (VERDICT #22) and the prune scenes

The "strange light that follows the cursor, but only partially" is
**compose-local**: `ComposeTarget.vue:70-135` tracks `--mouse-x/--mouse-y` on
`@pointermove` and drives a `radial-gradient` background with a `@property`
transition. It is scene-scoped (hence "only partially"), and compose is slated
for pruning (#23), so it is moot as-is. If a site-wide cursor key-light is
wanted, it must be ONE GPU-cheap layer (a `transform: translate()`d radial on a
promoted element), never a per-`pointermove` `background-position`/gradient
recompute. Pruning morph + compose + motion-path (#23) additionally removes 3 of
the measured problem stages.

---

## T recommendations

### T1 — De-layer the blur: the animating stage must never be inside a `backdrop-filter` backdrop · **L**
- **Scope:** The single highest-leverage change. Restructure the shell so the
  perpetually-animating stage is composited on a layer that the glass chrome's
  `backdrop-filter` does NOT sample. Options, gestalt-first: (a) promote the
  stage to its own compositor layer ABOVE the dock/pane blur where the design
  permits (dock/pane over static margins only, stage un-blurred); (b) glass-ui
  handoff — the dock/pane blur reads a *static* snapshot rather than the live
  backdrop (glass-ui BG/BH: a `blur-source="static"` / frozen-backdrop mode);
  (c) drop the stacked `--glass-refract-filter` on resting surfaces and cap blur
  radius. Delete the ineffective `contain: paint` on `.scene-host` (App.vue:337)
  — it is falsified — and replace with the real layer isolation. Delineate the
  gap: static-backdrop compositing is a **glass-ui-owned** capability today
  absent → born-RED handoff to BG/BH.
- **Gate shape:** `proof:blur-not-resampled` — the toggle-probe delta
  `(no-backdrop-filter fps − baseline fps)` for every scene must be **< 15%**
  (today morph is +250%, motion-path +180%, easing +76%). Re-runs `toggle-probe.mjs`.
- **Size:** L

### T2 — One master rAF clock; all scene/control loops are subscribers · **M**
- **Scope:** Route every demo rAF consumer through ONE driver tick (extend the
  engine's `RAFPlayback`/managed-loop, or a demo `useMasterClock`). Sub-loops
  register a per-frame callback + read the shared `now`; no consumer calls
  `requestAnimationFrame` directly. Fold `useAnimationProgress`,
  `useAnimationSync`, `useRafLoop`, `useSceneSwap`, the scene painters, and
  `useSpringHotPath` onto it. Kills the avg-3-to-5 / peak-14-to-30 fan-out.
- **Gate shape:** `proof:single-raf-clock` — the `raf-density.mjs` avg
  rAF/frame must be **≤ 1.2** and peak **≤ 3** on every scene; a source gate
  greps the demo for `requestAnimationFrame(`/`useRafFn(` outside the ONE
  driver module (allowlist = 1).
- **Size:** M

### T3 — Scenes must reach true rest: settle-and-stop + `content-visibility` · **M**
- **Scope:** Every preview loop terminates when its animation settles (spring
  solver `settled` already exists — gate the loop on it; easing/cube/morph get
  the same). Off-screen panels and the non-active stage get
  `content-visibility: auto` + `contain-intrinsic-size`. No reactive ref is
  written per-frame at 60 Hz — cap all reactive readouts at
  `PROGRESS_READOUT_HZ` (the `scrubberPhase` 60 Hz reactive write,
  useSpringHotPath.ts:143, becomes a direct non-reactive `style.transform`).
- **Gate shape:** `proof:scene-rests` — `idle-churn.mjs` after 4.5 s settle:
  idle `LayoutCount` **< 5** and idle `TaskDuration` **< 30 ms / 3 s (<1% CPU)**
  on every scene (today spring 33%, morph 11%, easing 14%).
- **Size:** M

### T4 — Position by `transform`, never `left`/`top`; kill the layout-thrash · **S**
- **Scope:** Replace every `left`/`top` position animation with
  `transform: translate()`; delete the `will-change: left` promotions.
  Sites: `SpringTarget.vue:340,348,434`, `SpringSidebar.vue:263`,
  `SpringHeatmap.vue:315`, `SequenceScrubber.vue:154`, `SequenceTarget.css:201`,
  `SequencePlayhead.vue:43`. Adopt the pattern already proven in
  `AnimationVisualizer.vue:38` and `useEasingDemo.ts:158`.
- **Gate shape:** `proof:no-layout-animation` — source gate: zero
  `will-change: left`/`top` and zero animated `left`/`top` in `demo/scenes`;
  runtime: idle `LayoutCount` on spring/sequence drops from 90/s → ~0.
- **Size:** S

### T5 — amiga WebGL budget (separable) · **M**
- **Scope:** Throttle/scale the Three.js render — DPR-cap the canvas, resolution
  scaling under load, pause the render loop when `settled`/off-viewport (the
  `useSceneVisibilityPause` seam already exists; extend to a frame budget),
  remove the `backdrop-filter: blur(4px)` telemetry over the live canvas
  (AmigaTelemetry.vue:61 — blur over moving WebGL is the same T1 fault).
- **Gate shape:** `proof:amiga-budget` — amiga sustained fps **≥ 45** and
  `TaskDuration` **< 40%** of one core over a 2.5 s play window (today 11–15 fps,
  >100% CPU). Re-runs `perf-probe.mjs` for `KF_SCENES=amiga`.
- **Size:** M

### T6 — Re-home the perf gates so a green roster cannot hide sub-30fps · **S**
- **Scope:** The blindspot recurred (MEMORY: "green source-shape gates miss
  appearance/interaction/state"). Promote the probes in this lane
  (perf-probe/idle-churn/toggle/raf-density) into `scripts/proof-perf-*.mjs`
  wired to `npm run proof:perf`, with per-scene fps/CPU/layout budgets, so the
  next "every gate green" cannot coexist with a 20 fps stage.
- **Gate shape:** `proof:perf` runs headless in CI: play fps ≥ 50, idle CPU <
  1%, blur-delta < 15%, rAF avg ≤ 1.2 per scene — fail-loud, budgets in one
  table.
- **Size:** S
