# T.G — THE SPEED (perf, ground-up)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Band role (VERDICT #19).** The owner: *"The performance on **every single page** is god
> awful and needs to be rethought from the ground up."* This band carries the §0-root-cause-3
> perf cures + the perf-instrument re-home, and every wave ships **an oracle that REDs on the
> measured defect, not a proxy** (charter §0.3). The meta-fact this band is the subject of:
> the S impl closed **85/85 roster-green** with **eight** perf-adjacent gates all passing —
> and the owner felt sub-30fps on sight. Lane 32 dissects why every one of those instruments
> was either measuring the wrong layer, structurally blind to compositor cost, or never run
> in a biting posture; lane 11 built the fresh CDP-counter probes that see the truth. T.G is
> the architecture cures **plus** the instrument roster that makes "every gate green" impossible
> to coexist with a 20fps stage again.
>
> **The keystone.** **T.G1 (de-layer the blur)** is the band keystone — the single
> highest-leverage change (measured **33→116fps, 3.5×** on morph the instant `backdrop-filter`
> is neutralized), content-independent, and surgical enough to land early (charter §2 DAG:
> *"blur de-layer may land early, it's surgical"*). Its glass-ui static-backdrop half is a
> **handoff to T.H** (a `blur-source="static"` capability glass-ui does not ship today) — the
> kf-side born-RED acceptance gate lands **now**.
>
> **Sequencing.** Every OTHER T.G wave **measures the FINAL surface** (charter §2 DAG:
> *"T.G — perf — measures the FINAL surface"*): the per-scene budgets (T.G6) are authored over
> the SURVIVING scene set — **after** T.E prunes morph/motion-path/compose (lane 11 §8: pruning
> removes 3 of the measured problem stages) and T.A/T.B rebuild the retained scenes. T.G1 (chrome
> cost, scene-independent) and the instrument re-homes (T.G7…T.G10, over existing instruments)
> land independent of the rebuild.
>
> **Lanes:** 11-performance (ALL — T1…T6), 32-perf-instrumentation (ALL — T-PERF-A…E), 26-plan-vs-landed-FGH (rec 3 — the demo-scoped absolute perceived-perf oracle).

## T-open BEFORE baseline (committed; every born-RED wave reds against these numbers)

All figures instrumented on the **production build** (`dist/gh-pages`), 1440×900 / `deviceScaleFactor:2`
(lane 11), and via the **existing repo instruments** run against `tranche-s-impl @ 929ef0e` (lane 32).
The dev-vs-prod cross-check (localhost:5180, the owner's actual review environment) reproduces the bad
scenes within noise — **the "god awful" ships; it is not a dev-mode artifact** (lane 11 §6).

**Architecture-truth (device-independent — CDP counters, toggle deltas, rAF density):**

| Scene | rest fps | play fps | idle %CPU (churn) | blur-toggle Δ (rest fps → no-backdrop-filter) | avg / peak rAF/frame |
|---|---|---|---|---|---|
| home | 67.8 | **21.8** (57% CPU) | 5% | 95.7 → 119.9 (+25%) | 2.7 / 29 |
| cube | **20.9** | **20.3** | 5% | 90.5 → 120 (+33%) | 1.4 / 14 |
| amiga | **15.2** | **11.0** (>100% CPU) | — | 11.4 → 12.4 (noise; WebGL-bound) | 2.8 / 30 |
| square | 120 | 36.7 | — | flat (idle) | — |
| easing | **33.0** | **32.4** | 14% | 22.4 → **39.5 (+76%)** | **4.9 / 14** |
| spring | 89.9 | 92.8 | **33%** (90 layouts/s) | 90.7 → 119.9 (+32%) | 3.1 / 18 |
| sequence | 119.9 | 77.6 | — | flat (idle) | 0.1 / 30 |
| motion-path | 46.1 | 43.7 | — | 42.8 → **120.0 (+180%)** | — |
| morph | **33.0** | **30.9** | **11%** (bare grid!) | 33.2 → **116.5 (+250%)** | 3.0 / 22 |
| compose | 120 | 120.1 | — | flat (idle) | — |

Spring's play window: **537 recalcs + 263 layouts** over 2.5s. `contain: paint` on `.scene-host`
(App.vue:336) is **falsified** — `no-contain` is neutral-to-WORSE (cube 90→73, home 95→84); the
`backdrop-filter` removal is the real lever.

**Existing-instrument baseline (lane 32 — the BEFORE for the instrument re-homes):**

| Instrument | Measured this run | Bound | Verdict |
|---|---|---|---|
| `proof:lighthouse-mobile` (hard) | home 57 · cube 50 · amiga 37 · square 56 · easing 56 · spring 55 / **LCP 16.0s** | floors 63/64/49/62/61/52 · LCP<15s | **FAIL(6)** — every scene misses; never run hard in CI |
| `lighthouse-gate` (a11y) | home/desktop `color-contrast`, cube/desktop `color-contrast`, sequence/mobile `target-size` | 0 unbucketed | **FAIL(3)** — firing, but `ci.yml continue-on-error` discards it |
| `proof:perf-frame-budget` (cube ref) | 0 dropped, mean **8.3ms (~120Hz)** | DROP_MS=24ms | PASS — **blind** to the 20.9fps CDP truth on the same build |
| `bench/playwright.bench.ts` (LoAF) | **ENOENT** (`demo/app/loaf-observer.ts` moved 116 commits ago) | — | **BROKEN** — zero LoAF evidence for the back half of S |

---

## Wave index

| id | title | size | born | authority (T.M6) | lanes |
|---|---|---|---|---|---|
| T.G1 | **De-layer the blur — the animating stage never sits in a `backdrop-filter` backdrop** | L | RED | INSTRUMENT (+ T.H handoff) | 11 T1 |
| T.G2 | One master rAF clock — all scene/control loops are subscribers | M | RED | INSTRUMENT | 11 T2 |
| T.G3 | Scenes reach true rest — settle-and-stop + `content-visibility` | M | RED | INSTRUMENT | 11 T3 |
| T.G4 | Position by `transform`, never `left`/`top` — kill the layout-thrash | S | RED | INSTRUMENT | 11 T4 |
| T.G5 | Amiga WebGL budget (separable) | M | RED | INSTRUMENT | 11 T5 |
| T.G6 | **The demo perceived-perf gate family (`proof:perf`) — absolute, C-10-exempt, OWNER-authority + blocking** | M | RED | **OWNER** | 11 T6; 26 rec 3; 32 T-PERF-E |
| T.G7 | Cure `proof:perf-frame-budget`'s rAF-interval blindspot — add the CDP-counter clause | M | RED | **OWNER** | 32 T-PERF-B |
| T.G8 | Revive the dead LoAF gate — repoint the stale observer path + un-silence a future move | S | RED | INSTRUMENT | 32 T-PERF-A |
| T.G9 | `proof:lighthouse-mobile` off the permanently-unexercised hard path + committed baseline | M | RED | **OWNER** | 32 T-PERF-C |
| T.G10 | Un-silence the `lighthouse-gate` a11y verdict (the CI-wrapping neuter) | S | RED | INSTRUMENT | 32 T-PERF-D |

**Authority note (T.M6 coordination).** The doctrine is T.M's, the perf GATE is T.G's (charter §1;
T.M Charter-conflict note 1; T.M's Disposition 29-rec-5). The three perf gates that hold the perceived
bar (T.G6, T.G7, T.G9) declare **authority=OWNER** and carry the **blocking-not-OBSERVE** teeth per
T.M6 — they may NOT be demoted to the OBSERVE-only bucket the way `perf-frame-budget` and
`lighthouse-mobile` were (that demotion is exactly why the "god awful" rode green). T.G6 IS the concrete
`T-GATE-PERF` gate lane 29 rec 5 / T.M6 point to.

---

## The architecture cures — T.G1 … T.G5

### T.G1 — De-layer the blur: the animating stage never sits in a `backdrop-filter` backdrop · **KEYSTONE**
- **Scope.** The single highest-leverage change. `backdrop-filter` samples the *backdrop* —
  everything painted behind the element up to the nearest backdrop root. The demo's persistent
  chrome is glass: the **GlassDock** (`--glass-blur-floating`) and the **controls pane**
  (`--control-surface-blur`) sit permanently over the stage, and glass-ui ships ~144
  `backdrop-filter` declarations (lane 11 §3; kf-side dist census confirms ~126) including a
  `--glass-refract-filter` STACKED on the resting blur (2× the sample cost). Every frame the
  stage subject moves, the blur's source is invalidated → Chromium re-rasterizes the full blur
  footprint at up to 60Hz. **The motion-path row proves the mechanism** (43→120fps by removing
  EITHER the blur OR the animation) and morph proves it is **content-independent** (an
  almost-empty scene pays the same 3.5× because the cost lives in the chrome). Restructure the
  shell, gestalt-first, so the perpetually-animating stage is composited on a layer the glass
  chrome's `backdrop-filter` does NOT sample: (a) promote the stage to its own compositor layer
  ABOVE the dock/pane blur where design permits (dock/pane blur reads static margins only,
  stage un-blurred); (b) **glass-ui handoff (T.H)** — a `blur-source="static"` / frozen-backdrop
  mode where the dock/pane blur reads a *snapshot* rather than the live backdrop; (c) drop the
  stacked `--glass-refract-filter` on resting surfaces and cap blur radius. **Delete the
  ineffective `contain: paint` on `.scene-host` (App.vue:336)** — measured neutral-to-worse, the
  G1 claim ("the panel blur is no longer invalidated per scene frame") is falsified by
  measurement (lane 11 §3): `contain: paint` on the scene-host *sibling* does not remove its
  pixels from a *sibling* blur element's backdrop.
- **Gate (BORN-RED).** `proof:blur-not-resampled` — the toggle-probe delta
  `(no-backdrop-filter fps − baseline fps)` for **every** scene must be **< 15%**. **Reds today:**
  morph +250%, motion-path +180%, easing +76%, cube +33%, spring +32%, home +25% (all far over
  15%). Re-runs `toggle-probe.mjs` (promoted into `scripts/proof-*` via T.G6). The glass-ui
  static-backdrop capability is absent today → the T.H acceptance clause is **born-RED and
  handed off**.
- **Size.** L. **Lanes.** 11 rec 1 (T1).
- **Edges.**
  - **→ T.H** (the constellation): `blur-source="static"` / frozen-backdrop mode is a glass-ui-owned
    capability absent today → the consolidated BG/BH ask letter carries it; the kf-side acceptance
    gate (`proof:blur-not-resampled`'s glass-clause) lands NOW and reds until the fix ships (a
    version tripwire per T.H's gap-ledger discipline).
  - **→ T.A11**: amiga's `AmigaTelemetry.vue:61 backdrop-filter: blur(4px)` over the live WebGL
    canvas is the SAME fault genus (a moving subject re-invalidating a blur) — T.A11 removes it
    as part of the amiga stage strip-down; this wave owns the CSS-scene chrome, T.A11 the amiga
    instance.
  - **→ T.M3** (owner-golden): the de-layer must not visibly change the glass chrome's look —
    the appearance is captured under T.M's owner sign-off (the blur is still THERE, just not
    re-sampling the stage).
- **Lockstep** (lane 18 rule — a critical one). `proof:scene-perf-budget` clause **(G1)** asserts
  `.scene-host` carries `contain: paint` ("must include `paint`", lane 32 §1). Deleting the
  falsified `contain: paint` WITHOUT rewiring that clause reds a gate on the RIGHT thing (the
  ineffective mitigation) being absent — the exact anti-pattern. Retire/rewrite the G1 clause in
  the SAME motion (it becomes the `blur-not-resampled` layer-isolation assertion, not a
  `contain`-keyword grep). Grep `scripts/` for `scene-host-contained`/`contain: paint` before the
  commit lands.

### T.G2 — One master rAF clock; all scene/control loops are subscribers
- **Scope.** No master clock exists: nine+ independent `requestAnimationFrame` owners can be live
  at once, each doing its own `performance.now()`, its own reactive writes, its own
  `getComputedStyle` — measured **avg 3–5 / peak 14–30** concurrent rAF callbacks/frame (lane 11
  §5). Owners verified on the tree: `MorphTarget.vue`, `useTransformState.ts`,
  `useOrbitalInertia.ts`, `useAnimationSync.ts`, `useTimelineBuild.ts`, plus
  `useAnimationProgress`, `useRafLoop`/`AnimationVisualizer.vue`, `useSceneSwap`'s
  `SpringProgress`, `useSpringHotPath`, and the scene's own `RAFPlayback` via `useRafScene`.
  **The engine already OWNS a single managed driver abstraction** (`RAFPlayback` +
  `AnimationGroup`'s managed loop); the demo never routes its N auxiliary loops through ONE tick.
  Route every demo rAF consumer through ONE driver tick (extend `RAFPlayback`/managed-loop, or a
  demo `useMasterClock`): sub-loops register a per-frame callback + read the shared `now`; no
  consumer calls `requestAnimationFrame` directly. Morph running avg 3 loops on an empty grid is
  the proof the fan-out is gratuitous.
- **Gate (BORN-RED).** `proof:single-raf-clock` — `raf-density.mjs` avg rAF/frame ≤ **1.2** and
  peak ≤ **3** on every scene; a source clause greps `demo/` for
  `requestAnimationFrame(`/`useRafFn(` outside the ONE driver module (allowlist = 1). **Reds
  today:** easing avg 4.9/peak 14, spring 3.1/18, morph 3.0/22, amiga 2.8/30, home 2.7/29; six+
  raw `requestAnimationFrame` owners resolve in `demo/`.
- **Size.** M. **Lanes.** 11 rec 2 (T2).
- **Edges.** **→ T.A12** (amiga render-on-demand present loop) — the amiga WebGL loop is one of the
  fan-out owners; it becomes a subscriber to the master clock (or a gated render-on-demand loop).
  **→ T.F** (structure): the master-clock module is a shared demo primitive; its home in the
  re-taxonomized `demo/shared/` is T.F's call — this wave defines the seam, T.F places it.
- **Lockstep (arming-audit — charter §5 clause 1).** Rerouting every rAF is an actuation-mechanism
  change: any gate/test that hooks or counts `requestAnimationFrame`, or that drives a scene by
  its own rAF cadence, re-arms on the master-clock tick in the SAME motion. Grep `scripts/` +
  `test/` for `requestAnimationFrame`/rAF-count assumptions and re-point them at the one driver.

### T.G3 — Scenes reach true rest: settle-and-stop + `content-visibility`
- **Scope.** With ZERO interaction and no play pressed, scenes never rest: **spring burns 33% of
  one core forcing 90 layouts/second**, **morph burns 11% CPU rendering a bare grid**, easing
  forces 28 layouts/s (lane 11 §4). Two root causes: **(a) perpetual preview loops with no stop**
  — the spring "Live solver," easing hero sweep, cube 3-animation spin, and morph render loop all
  run forever; `useSpringHotPath.ts:143` writes `scrubberPhase.value = springLive.phase` **every
  frame at 60Hz** (a reactive ref write per frame, contradicting its own docstring that the 60Hz
  path is non-reactive). **(b)** covered by T.G4. **Fix:** every preview loop terminates when its
  animation settles (the spring solver's `settled` already exists — gate the loop on it;
  easing/cube/morph get the same); off-screen panels + the non-active stage get
  `content-visibility: auto` + `contain-intrinsic-size`; no reactive ref is written per-frame at
  60Hz — cap all reactive readouts at `PROGRESS_READOUT_HZ` (the `scrubberPhase` 60Hz reactive
  write becomes a direct non-reactive `style.transform`, folding into T.G4).
- **Gate (BORN-RED).** `proof:scene-rests` — `idle-churn.mjs` after 4.5s settle: idle `LayoutCount`
  **< 5** and idle `TaskDuration` **< 30ms / 3s (<1% CPU)** on every scene. **Reds today:** spring
  33% / 272 layouts, morph 11% / 90 layouts (empty grid), easing 14% / 84 layouts.
- **Size.** M. **Lanes.** 11 rec 3 (T3).
- **Edges.** **→ T.A12** delivers the amiga instance of this exact goal (render-on-demand present
  loop; `renderer.info.render.frame` stable at rest) — T.G owns the **cross-scene rest oracle +
  the CDP-counter measurement seam**, T.A12 the amiga scene cure. **→ T.A5** (cube re-light write
  quantization) consumes this wave's write-count measurement seam. **→ T.G6** — `scene-rests` is
  one clause of the `proof:perf` family's absolute per-scene budget.
- **Lockstep (arming-audit).** Loops that now STOP at rest re-arm any probe/gate that samples
  motion at an arbitrary late time (it will now see rest, not motion). Every per-scene
  subject-animates / motion probe must sample **inside the active window**, not post-settle —
  re-derive `proof-live-session.mjs` per-scene expected-states so a rest-reaching scene is not
  read as a broken one. Do it in ONE motion.

### T.G4 — Position by `transform`, never `left`/`top`; kill the layout-thrash
- **Scope.** The spring ball/thumb and the sequence scrubber/playhead are positioned by animating
  the LAYOUT property `left` at 60Hz — verified on the tree: `SpringTarget.vue:96` (`left: calc(...)`)
  + `will-change: left` at `:340,:348,:434`; also `SpringSidebar.vue:263`, `SpringHeatmap.vue:191`,
  `SequenceScrubber.vue`, `SequenceTarget.css`, `SequencePlayhead.vue` (lane 11 §4b). Animating
  `left` triggers **layout every frame**; `will-change: left` cannot composite it away (`left` is
  not a compositable property) and merely promotes a layer that still re-lays-out. **The codebase
  KNOWS the cure** — `AnimationVisualizer.vue:38` drives its ball via `transform: translateX(px)`
  (compositor-only), and `useEasingDemo.ts:158` documents moving OFF per-frame reactive writes to
  imperative transform painters "for cube-parity 60fps." Replace every `left`/`top` position
  animation with `transform: translate()`; delete the `will-change: left` promotions.
- **Gate (BORN-RED).** `proof:no-layout-animation` — source: **zero** `will-change: left`/`top`
  and zero animated `left`/`top` in `demo/scenes`; runtime: idle `LayoutCount` on spring/sequence
  drops from ~90/s → ~0. **Reds today:** three `will-change: left` + an animated `left` on
  `SpringTarget.vue`, plus the sequence sites.
- **Size.** S. **Lanes.** 11 rec 4 (T4).
- **Edges.** **↔ SQ-T5 / T.B / T.F**: lane 04's "de-Vue the hot path" (per-frame reactive writes →
  imperative transform painters) is the same transform-not-reactive discipline on the square scene
  — T.A cross-refs it to T.G/T.F; this wave owns the `left`→`transform` half, the reactive-write
  half folds with T.G3's `PROGRESS_READOUT_HZ`. The spring/sequence scenes **survive the prune**
  (only morph/motion-path/compose go) so these sites are real T-surface, not pruned debris.
- **Lockstep.** None removed; the `no-layout-animation` source-grep + runtime `LayoutCount` clause
  join the `proof:perf` roster (T.G6).

### T.G5 — Amiga WebGL budget (separable)
- **Scope.** Amiga is a **separate, WebGL-bound** problem: **11–15 fps, >100% CPU**
  (`TaskDuration` 2690–3397ms over 2.5s = multi-thread raster), **immune to every CSS toggle**
  (backdrop 11.4→12.4; lane 11 §7). Cost = the Three.js sphere + `AmigaCrtOverlay` + checkerboard
  texture + `AmigaTelemetry` (`backdrop-filter: blur(4px)` over the moving canvas) rendered full-res
  every frame with no throttle, no resolution scaling, no `powerPreference` tuning. It does not
  share a cure with the CSS scenes. **Fix:** DPR-cap the canvas, resolution-scale under load, pause
  the render loop when `settled`/off-viewport (extend the `useSceneVisibilityPause` seam to a frame
  budget), remove the telemetry blur over the live canvas.
- **Gate (BORN-RED).** `proof:amiga-budget` — amiga sustained fps **≥ 45** and `TaskDuration`
  **< 40%** of one core over a 2.5s play window. **Reds today:** 11–15 fps, >100% CPU. Re-runs
  `perf-probe.mjs` for `KF_SCENES=amiga`.
- **Size.** M. **Lanes.** 11 rec 5 (T5).
- **Edges** (the amiga SCENE cures are T.A's; T.G owns the BUDGET oracle — clean partition).
  **→ T.A9** (honest arc / camera-frames-the-room) changes the render envelope this budget measures;
  **→ T.A12** (render-on-demand) delivers the rest-loop half; **→ T.A10/T.A11** remove the CRT
  overlay + the telemetry `backdrop-filter` (the atmosphere/blur cost this budget will otherwise
  keep failing on). This wave gates the budget; T.A executes the scene work that lets it green.
- **Lockstep (arming-audit).** The amiga render-envelope + rest-loop changes re-arm
  `proof-amiga-subject-is-pivot.mjs` + `proof-amiga-decay-visible.mjs` (already flagged by T.A9/A12)
  — the budget oracle's play-window sampler must use the corrected CDP counter (T.G7), not the blind
  rAF-interval one; coordinate the measurement seam with T.A12's rest gate in one motion.

---

## The instrument re-home — T.G6 … T.G10 (each states the measured blindspot it cures)

### T.G6 — The demo perceived-perf gate family (`proof:perf`) — absolute, C-10-exempt, OWNER-authority + blocking
- **Measured blindspot cured.** C-10 (the library tenet: *"No raw absolute fps threshold may be a
  CI closure anywhere in the plan"*) left the owner's ONE perf axis — **absolute perceived
  performance** — with **no possible oracle** (lane 26 F2): a scene can be uniformly, absolutely
  janky and pass every relative/self-referential budget. `proof:scene-perf-budget` measures
  pixel-identity + fillRect-count + dpr≤2, never smoothness; `proof:portable-perf` never opens a
  browser; the SoA/colorTail floors measure the engine's hot loop, a layer strictly below the
  DOM/compositor jank the owner felt (lane 32 §2.8). **The owner measures absolute perceived
  performance; the plan deliberately excised absolute perception as the closure.**
- **Scope.** Stand up ONE demo-scoped perf gate family, `npm run proof:perf`, built from lane 11's
  four checked-in probes (`perf-probe.mjs`, `idle-churn.mjs`, `toggle-probe.mjs`,
  `raf-density.mjs`) promoted into `scripts/proof-perf-*.mjs`. It carries **absolute, demo-scoped**
  budgets — the C-10 ban is a LIBRARY tenet and the demo does not inherit it (charter §1 T.G: *"C-10
  stays library-only"*; the demo is not a portable library). Per-scene clauses, one table:
  - **play fps ≥ 50** and **idle CPU < 1%** (subsumes `scene-rests`, T.G3);
  - **blur-delta < 15%** (subsumes `blur-not-resampled`, T.G1) and **rAF avg ≤ 1.2 / peak ≤ 3**
    (subsumes `single-raf-clock`, T.G2) — one roster, fail-loud;
  - **per-scene INP + long-task + rAF-p95 under a fixed 4× CPU throttle on cold nav** (lane 26 rec 3):
    each scene holds **≤ N ms p95 frame interval** and **≤ M ms INP** under throttle, via a Chrome
    trace (`performance_start_trace`) or the scripted rAF-interval sampler — the absolute perceived
    bound C-10 forbade a library gate but the demo requires.
  - **Substrate (lane 32 T-PERF-E):** every clause imports `scripts/lib/portable-perf.mjs`'s
    `absoluteGate`/`ratioGate` rather than hand-rolling a threshold compare — the same
    same-report/device-independent primitive `proof:soa-composite`/`proof:color-soa` already prove
    (lane 32 §2.8), extended to the demo-DOM layer. `proof:portable-perf`'s existing
    `lint-no-raw-floor` clause auto-covers the new files (it scans `scripts/*.mjs` minus an
    exclusion list).
- **Gate (BORN-RED, authority=OWNER, blocking).** Reds today at the baseline numbers above
  (cube ~20fps, easing locked ~33fps, spring 33% idle CPU, morph +250% blur-delta, easing avg 4.9
  rAF/frame). Greens only once T.G1…T.G5 land. **Authority=OWNER + blocking-not-OBSERVE per T.M6** —
  this gate may NOT be demoted to OBSERVE (the failure mode of every existing perf instrument). The
  **absolute floor VALUES** (what fps/INP counts as "fast enough") ride **T.M's owner sign-off**
  (edge) — the owner sets the perceived bar (VERDICT #19); the gate reds today at ANY reasonable
  floor, so it is fundamentally BORN-RED with owner-blessed thresholds.
- **Size.** M. **Lanes.** 11 rec 6 (T6); 26 rec 3 (the demo-scoped absolute oracle); 32 T-PERF-E
  (the portable-perf substrate).
- **Edges.** **→ T.M6** declares this gate's OWNER authority + blocking status (the doctrine is
  T.M's, the gate is mine — the coordination point). **→ T.E** — the per-scene budget table is
  authored over the SURVIVING scene set (post-prune, post-rebuild); it is sequenced AFTER T.E's
  prune + T.A/T.B's rebuild so it does not budget scenes that are being deleted (lane 26 rec 3:
  *"Sequence AFTER the T demo rebuild"*). **→ T.G7** shares the CDP-counter methodology (this wave's
  new probes and T.G7's added clause both read `RecalcStyleCount`/`LayoutCount`/`TaskDuration`).
- **Lockstep** (lane 18). Wire `proof:perf` into `package.json`, `run-all.mjs`, `demo-roster.mjs`,
  `proof:ci-coverage`, and `gate-bands.mjs` in the same motion the probes are promoted — and it lands
  in the **blocking** roster (not the OBSERVE/`continue-on-error` bucket). The retired
  `proof:scene-perf-budget` structural clauses that stay (fillRect, dpr) keep their INSTRUMENT
  authority; only the perceived-perf family carries OWNER authority.

### T.G7 — Cure `proof:perf-frame-budget`'s rAF-interval blindspot — add the CDP-counter clause
- **Measured blindspot cured.** The gate closest in spirit to VERDICT #19 is **structurally blind
  to compositor-bound cost by construction**: `requestAnimationFrame`-interval sampling measures
  how fast the **main-thread callback loop** iterates, but `backdrop-filter` blur (lane 11's #1
  dominant cost) is a **compositor-thread raster cost** that does not block the main thread. In this
  project's own harness (`scripts/lib/demo-driver.mjs:562` — headless Chromium, no
  `headless:false`, no vsync/frame-rate emulation) nothing back-pressures rAF, so the JS loop
  free-runs at ~120Hz **independent of real paint cost**. **The measured discrepancy:** on the
  identical `dist/gh-pages` build, this gate reads cube at **0 dropped, mean 8.3ms (~120Hz)** while
  lane 11's CDP-`TaskDuration` sampling reads **~20.9fps rest / ~20.3fps play** — irreconcilable, and
  `DROP_MS=24ms` sits far above both. The gate's own prose asserts *"cube-parity ≈ 60 fps"* in four
  places while the live interval is ~120Hz — documentation and live number have quietly diverged and
  nothing catches it. Clause (e) already **counts 23 live `backdrop-filter` surfaces on `/cube`**
  and its own header says outright *"This clause does NOT gate"* — the instrument sees the loaded gun
  and declines to point it.
- **Scope.** Add a **CDP-metrics clause** (`RecalcStyleCount`/`LayoutCount`/`TaskDuration` deltas
  over the same play window — the exact counters lane 11 validates as device-independent
  architecture-truth) **alongside — not instead of** — the existing rAF-interval clauses. Fold the
  already-computed backdrop-filter surface census (today clause (e), non-gating) into an actual
  **relative budget**: surface-count × moving-subject must not correlate with a TaskDuration spike
  beyond a named margin. Fix the stale *"cube-parity ≈ 60 fps"* prose to the measured cadence.
- **Gate (BORN-RED, authority=OWNER, blocking).** The new clause reds today at lane 11's measured
  deltas (cube ~20fps rest, easing locked ~33fps, spring 465→537 recalcs / 228→263 layouts over a
  2.5s play window) and greens only once T.G1 (de-layer the blur) lands. Re-uses
  `portable-perf.mjs`'s `ratioGate` so the new clause is a same-report ratio, not a fresh absolute
  number. Declares OWNER authority + blocking per T.M6.
- **Size.** M. **Lanes.** 32 T-PERF-B.
- **Edges.** **→ T.G1** (this clause is the falsifiable proof T.G1 landed). **→ T.G6** (shared
  CDP-counter methodology). **→ T.M6** (authority declaration). **→ T.A5/T.A12** (their scene-local
  write/frame counters consume this corrected counter, not the blind rAF-interval one).
- **Lockstep.** The rAF-interval clauses STAY (they honestly measure main-thread cadence — a real,
  distinct question) but are explicitly re-declared NON-authoritative for compositor cost; clause
  (e) flips from non-gating census to a budgeted correlation in the same pass. Never leave the
  "cube-parity ≈ 60 fps" ground-truth prose standing after the counter clause proves ~20fps.

### T.G8 — Revive the dead LoAF gate — repoint the stale observer path + un-silence a future move
- **Measured blindspot cured.** `bench/playwright.bench.ts` ENOENTs immediately: it reads
  `demo/app/loaf-observer.ts` (three hardcoded refs, verified `:156,:159`) and that path has not
  existed since commit `440e5c3` (the S.D1 `demo/app/` partition), which relocated the file to
  `demo/app/runtime/loaf-observer.ts` — **116 commits before HEAD** — without updating the bench.
  The move is a pure rename (`observeLongAnimationFrames` unchanged); the break is a one-line path
  fix. But it produced **zero LoAF evidence** for the back half of the S impl drive, invisible at
  **every tier**: `proof:bench-runs` excludes `playwright.bench.ts` by name; `bench/taxonomy.json`'s
  `suites[]` omits it; `ci.yml`'s LoAF step wraps the run in `continue-on-error: true` **and** an
  `|| true`, so even its own `grep -q 'loaf-gate.*PASS'` (which DOES fail — an ENOENT never prints
  PASS) cannot fail the job.
- **Scope.** Repoint the three `demo/app/loaf-observer.ts` refs to `demo/app/runtime/loaf-observer.ts`.
  Replace the bare `fs.readFileSync` with a pre-flight `existsSync` that throws a distinct,
  human-legible error (*"the LoAF observer moved — update bench/playwright.bench.ts's path"*) rather
  than a raw ENOENT indistinguishable in the CI log from a genuine bench failure. Add a **static
  path-resolves anchor** (in `proof:bench-taxonomy` or a sibling script) asserting every path
  `bench/playwright.bench.ts` reads actually resolves, so a future `demo/app/` re-partition reds
  loudly instead of silently zeroing this gate's signal again.
- **Gate (BORN-RED).** `KF_PLAYWRIGHT_DIR=… npm run bench -- --run bench/playwright.bench.ts`
  produces a real `loaf-gate — PASS: no >50ms …` line (not an ENOENT stack); the new path-resolves
  clause reds if any bench-read path is missing. **Reds today:** ENOENT (the file is at
  `runtime/loaf-observer.ts`, confirmed on the tree; `demo/app/loaf-observer.ts` does not exist).
- **Size.** S. **Lanes.** 32 T-PERF-A.
- **Edges.** **→ T.F** (structure): the demo/app re-taxonomy (`app/chrome/` → `app/dock/`, the
  runtime tier) is exactly the class of move that broke this path — the static path-resolves anchor
  is the guard T.F's re-partition must not trip. Coordinate so the anchor lands with (or before)
  T.F's moves, not after another silent break.
- **Lockstep.** Do NOT add `playwright.bench.ts` to `proof:bench-runs`'s hard set (it is
  browser-gated by design, a documented CI-calibration excuse) — the fix is the path + the static
  anchor, not forcing the browser bench into the hard run. If the `ci.yml` LoAF step's
  `continue-on-error`/`|| true` wrapping is kept, the step's internal `grep` must at least
  distinguish "observer regressed" from "file moved" (the new legible error enables that) — the
  full un-silencing of the CI wrapping is T.G10's genus.

### T.G9 — `proof:lighthouse-mobile` off the permanently-unexercised hard path + committed baseline
- **Measured blindspot cured.** This is **the one existing instrument whose verdict agrees with
  "god awful"** — and the one instrument nobody has ever run in a biting posture. Run hard
  (`--probe` then asserted, local `IN_CI:false`), **every single scene misses its mobile-performance
  ceiling**: home 57 (floor 63), cube 50–51 (floor 64), amiga 37–38 (floor 49), square 56 (floor 62),
  easing 56 (floor 61); spring clears Performance (55 ≥ 52) but its **LCP 16.0s blows past the 15s
  bound**. The hard run prints `FAIL(6)` and exits non-zero. Two things mute it: (1) the gate's
  documented posture is `observe-only` in CI and only hard-asserts under `KF_REQUIRE_LH=1` on a
  "calibrated runner" — **`ci.yml`'s job never sets that variable**, so the hard branch appears to
  have never executed in automation; (2) even observe-branch misses are only *printed*, never
  accumulated into a committed baseline artifact a T wave could diff against.
- **Scope.** Stand up (or designate) ONE calibrated runner (self-hosted or a fixed-spec cloud
  instance) that runs this gate with `KF_REQUIRE_LH=1` on a schedule — the only path that turns the
  gate's already-correct ceiling logic into a blocking check. **Commit this run's measured numbers as
  the T-open BEFORE baseline** (home 57 / cube 50 / amiga 37 / square 56 / easing 56 / spring 55 +
  LCP 16.0s — every scene below its B-baseline floor), not a re-derivable curiosity.
- **Gate (BORN-RED, authority=OWNER, blocking).** The calibrated job reds today (6/6 misses,
  reproduced twice in lane 32); greens only once mobile perf is restored to the B floors — the
  falsifiable form of VERDICT #19's mobile half. Declares OWNER authority + blocking per T.M6 (this
  is the mobile half of the perceived bar; it must not ride OBSERVE-only forever).
- **Size.** M. **Lanes.** 32 T-PERF-C.
- **Edges.** **→ T.Z / deploy** (the calibrated runner is infra — it pairs with T.S's revived
  deploy-of-record path; the runner that hard-asserts lighthouse can be the same calibrated
  environment). **→ T.G6** — the committed baseline is the mobile row of the perceived-perf baseline
  table. **→ T.M9** (board-live) — the committed baseline artifact is a board-reconcilable fact, not
  a transcript number.
- **Lockstep.** The `KF_REQUIRE_LH=1` hard branch must be wired into an ACTUAL job (the calibrated
  runner) — landing the baseline artifact without a job that exercises the hard path re-creates the
  exact "hard branch never runs" hole. Flag: this wave has an **infra dependency** (a calibrated
  runner) that the impl orchestration must provision; until then the born-RED baseline is committed
  and the local hard run stands as the proof-of-red.

### T.G10 — Un-silence the `lighthouse-gate` a11y verdict (the CI-wrapping neuter)
- **Measured blindspot cured.** The gate's own design is sound — it partitions failing a11y audits
  into named allowance buckets and REDs on anything outside them. Run against the current tree it
  **correctly identifies 3 audits failing and NOT in either bucket**: `home/desktop` +
  `cube/desktop` `color-contrast`, and `sequence/mobile` `target-size`. **The oracle is fine; the
  wiring is not** — the `ci.yml` step that runs it carries `continue-on-error: true` inside a job the
  file itself calls *"OBSERVE-ONLY … never fails the `ci` workflow,"* so a gate designed to hard-bite
  on an unbucketed a11y regression, and firing that bite this run, cannot block anything. This is a
  distinct failure mode from an oracle-quality gap (lane 29's taxonomy): the oracle bites; the CI
  scaffolding neuters it before its verdict reaches a human.
- **Scope.** Two branches (owner/triage selects):
  - **(a) un-silence:** remove the step-level `continue-on-error: true`, letting a genuine unbucketed
    a11y regression block — matching the gate's own documented intent; OR
  - **(b) own it explicitly:** if a11y triage is deliberately deferred, add these three misses to a
    NAMED, dated allowance bucket (`bucket-t-pending`, mirroring the existing `bucket-glassui` /
    `bucket-w2`) with an explicit trigger, so the miss is tracked, not absorbed.
- **Gate (BORN-RED).** Either the CI step reds on the next unbucketed a11y failure (post
  `continue-on-error` removal), or `lighthouse-gate.mjs` grows a `bucket-t-pending` and this run's 3
  misses land in it by name. **Reds today:** 3 unbucketed failures firing, verdict discarded by
  `continue-on-error`.
- **Size.** S. **Lanes.** 32 T-PERF-D.
- **Edges** (the GATE-wiring is mine; the DEFECT cures are cross-band).
  - **→ T.D** (the look): the two `color-contrast` misses trace to VERDICT #16 *"I don't like this
    latent red theme"* — T.D's red-kill + the ONE oklch violet accent authority is the actual cure.
    **Sequence:** un-silencing (branch a) BEFORE T.D's contrast fix lands would red CI on a real,
    known regression — so either take branch (b) `bucket-t-pending` until T.D lands, then flip to (a);
    or sequence T.G10-branch-a after T.D's contrast fix. Flagged so the two do not deadlock.
  - **→ T.C** (the dock) / **T.F**: `sequence/mobile target-size` is a tap-target sizing miss — the
    dock/chrome recut owns the fix; this wave owns un-silencing the gate that reports it.
  - **→ T.M6** — this wave is the concrete instance of T.M6's "blocking-not-OBSERVE" doctrine applied
    to an a11y gate (the same neuter pattern as `perf-frame-budget` / `lighthouse-mobile`).
- **Lockstep** (lane 18). If branch (a): also audit the LoAF step's `|| true` (T.G8) and the
  lighthouse-mobile OBSERVE posture (T.G9) — the `continue-on-error` neuter is a **pattern** across
  the perf/a11y CI steps, not a one-off; do not un-silence one and leave the siblings neutered
  (that is the arming-audit lesson applied to CI wiring).

---

## Cross-band edges (summary)

| From | To | What crosses |
|---|---|---|
| T.G1 | **T.H** | `blur-source="static"` / frozen-backdrop mode — a glass-ui-owned capability absent today; the BG/BH ask letter carries it, the kf-side `blur-not-resampled` acceptance gate lands now (born-RED, version tripwire) |
| T.G1 | **T.A11** | Amiga telemetry `backdrop-filter: blur(4px)` over the live canvas is the same fault genus — T.A11 removes the amiga instance; this wave owns the CSS-scene chrome |
| T.G1, T.G3 | **T.A5, T.A9, T.A12** | Perf-oracle methodology (CDP-counter substrate, true-rest fleet oracle, amiga WebGL budget) — this band owns the measurement seam + cross-scene oracle; T.A supplies the scene-local instances |
| T.G2 | **T.F** | The master-clock module is a shared demo primitive; its home in `demo/shared/` is T.F's placement, this wave defines the seam |
| T.G4 | **T.B / T.F (SQ-T5)** | `left`→`transform` half here; the per-frame reactive-write→imperative-painter half folds with T.G3's `PROGRESS_READOUT_HZ` (lane 04 de-Vue-the-hot-path) |
| T.G5 | **T.A9, T.A10, T.A11, T.A12** | T.G owns the amiga BUDGET oracle; T.A owns the amiga SCENE cures (honest arc envelope, CRT/telemetry removal, render-on-demand) |
| T.G6, T.G7, T.G9 | **T.M6** | These gates declare authority=OWNER + blocking-not-OBSERVE; the doctrine is T.M's, the gates are T.G's (lane 29 rec 5 → this band) |
| T.G6 | **T.E** | The per-scene budget table is authored over the SURVIVING scene set (post-prune, post-rebuild) — sequenced AFTER T.E + T.A/T.B |
| T.G6 (floor values), T.G1/T.G3/T.G5 (appearance-adjacent) | **T.M** | The absolute perceived-perf FLOOR VALUES (what counts as "fast enough") ride owner sign-off; no perceived-perf bar is self-set |
| T.G8 | **T.F** | The `demo/app/` re-taxonomy is the move-class that broke the LoAF path; the static path-resolves anchor is the guard T.F's re-partition must not trip |
| T.G9 | **T.Z / T.S (deploy)** | The calibrated runner (infra) pairs with T.S's revived deploy-of-record path |
| T.G10 | **T.D, T.C/T.F** | The a11y DEFECT cures (color-contrast ← the red-kill; target-size ← dock/chrome) are cross-band; this wave un-silences the GATE that reports them |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.G#** = owned by a wave above · **↳ cross-ref** = executed by another band per the
charter (the perf oracle names the seam; the scene/theme/structure work lands there).

### Lane 11 — performance (ALL 6 recs assigned)

| Rec | Disposition |
|---|---|
| T1 · de-layer the blur (`blur-not-resampled`) | **→ T.G1** (keystone; glass-ui static-backdrop half → T.H) |
| T2 · one master rAF clock (`single-raf-clock`) | **→ T.G2** |
| T3 · scenes reach true rest (`scene-rests`) | **→ T.G3** (amiga instance → T.A12 edge) |
| T4 · position by transform, not left/top (`no-layout-animation`) | **→ T.G4** |
| T5 · amiga WebGL budget (`amiga-budget`) | **→ T.G5** (scene cures → T.A9/A10/A11/A12 edges) |
| T6 · re-home the perf gates (`proof:perf`) | **→ T.G6** (subsumes T1–T4 clauses into one blocking roster) |
| *(§8 cursor-light perf note — not a numbered rec)* | ↳ cross-ref **T.E** (compose pruned → the compose-local cursor light is moot) + **T.D OD-2** (if a site-wide key-light is wanted, this wave's constraint binds: ONE GPU-cheap promoted `transform: translate()` radial, never a per-`pointermove` gradient recompute) |
| *(§7 amiga separability, §3 root-cause, §4/§5 diagnostics)* | folded into T.G1/T.G2/T.G3/T.G5 scopes (evidence, not standalone recs) |

### Lane 32 — perf-instrumentation (ALL 5 recs assigned)

| Rec | Disposition |
|---|---|
| T-PERF-A · fix the LoAF gate's stale path + un-silence a move | **→ T.G8** |
| T-PERF-B · replace rAF-interval sampling with the CDP-counter methodology | **→ T.G7** |
| T-PERF-C · promote `proof:lighthouse-mobile` off the unexercised hard path + commit baseline | **→ T.G9** |
| T-PERF-D · un-silence the `lighthouse-gate` a11y regression or own it explicitly | **→ T.G10** |
| T-PERF-E · route lane 11's probes through the `portable-perf.mjs` ratio-gate substrate | **→ T.G6** (the substrate clause — every new `proof:perf-*` clause imports `absoluteGate`/`ratioGate`; `lint-no-raw-floor` auto-covers the new files) |

### Lane 26 — plan-vs-landed F/G/H (rec 3 assigned)

| Rec | Disposition |
|---|---|
| 3 · demo-scoped absolute perceived-perf oracle (exempt from the C-10 library ban) | **→ T.G6** (the per-scene INP/long-task/rAF-p95-under-4×-throttle clause; C-10 stays a library tenet, the demo does not inherit it; **T.M6** enforces its OWNER/blocking status per lane 26's disposition) |

---

## Charter conflicts / coordination notes spotted

1. **C-10 vs the demo absolute-perf gate — pre-resolved by the charter, not a conflict.** C-10 (*"no
   raw absolute fps threshold as a CI closure"*) is a **library** tenet — correct for a portable
   perf claim (a ratio reds honestly on any runner) and exactly wrong for the demo (a uniformly janky
   scene passes every relative budget — lane 26 F2). Charter §1 T.G already resolves it: *"demo-scoped
   absolute perceived-perf oracle (C-10 stays library-only)."* T.G6 is the demo gate; it is absolute
   and C-10-exempt **by construction** because the demo is not a portable library. The engine's hot
   loop (SoA/colorTail) keeps its device-independent ratio floors unchanged. Flagged so the impl drive
   does not mistakenly apply C-10 to the demo gate and re-blind the owner's one axis.

2. **Perf-gate ownership (lane 29 rec 5) — clean hand-off, mirrored from T.M's note 1.** Lane 29 rec 5
   (T-GATE-PERF, whole-roster blocking perf) lives in T.M's ALL-assigned lane 29, but the charter routes
   the GATE to T.G and T.M dispositions it *"cross-ref T.G … T.M6 enforces its OWNER-authority +
   blocking-not-OBSERVE."* **T.G6 IS that gate.** Not a conflict: T.M owns the DOCTRINE (owner-anchored
   + blocking, lane 29 Part III) via M6's authority axis; T.G authors the concrete gate. Flagged so the
   impl drive wires T.G6/T.G7/T.G9 through M6's authority declaration and lands them BLOCKING — the
   single most important lesson of this band (every existing perf instrument was neutered to OBSERVE).

3. **T.G6 must measure the FINAL surface — a sequencing dependency, not a conflict.** The per-scene
   budget table budgets the SURVIVING scenes; morph/motion-path/compose are pruned (T.E1/T.E3) or fused
   (T.E2), and the retained scenes are rebuilt (T.A/T.B). Authoring T.G6's per-scene rows over the S-era
   scene set would budget scenes that no longer exist. Resolution (charter §2 DAG-backed): T.G1 (chrome
   cost, scene-independent) + the instrument re-homes T.G7–T.G10 (over existing instruments) land
   independent/early; T.G6's per-scene budgets are sequenced AFTER T.E's prune + T.A/T.B's rebuild
   (lane 26 rec 3: *"Sequence AFTER the T demo rebuild"*). Flagged so the impl orchestration does not
   schedule T.G6's per-scene rows before the survivor set is fixed.

4. **The a11y-gate un-silence (T.G10) vs the a11y-defect cures (T.D/T.C) — a deadlock hazard.** T.G10
   owns un-silencing the `lighthouse-gate` a11y verdict, but the actual `color-contrast` fix lives in
   T.D's red-kill (VERDICT #16) and the `target-size` fix in T.C/T.F. Removing `continue-on-error`
   (branch a) BEFORE those cures land reds CI on a real, known regression. Resolution encoded in T.G10:
   take branch (b) `bucket-t-pending` (named, dated) until T.D/T.C's cures land, then flip to branch (a);
   OR sequence branch (a) after the cures. Flagged so T.G10 and T.D/T.C do not each assume the other
   sequences first.

5. **The `continue-on-error` / OBSERVE neuter is a PATTERN, not three independent misses.** T.G8's
   `|| true` LoAF step, T.G9's never-set `KF_REQUIRE_LH=1`, and T.G10's `continue-on-error` a11y step are
   the SAME failure mode — a correctly-authored (or once-working) instrument neutered by its CI wrapping —
   and it is the mechanism by which "85/85 green" coexisted with sub-30fps. T.M6 codifies the
   blocking-not-OBSERVE doctrine; this band executes it across all three sibling steps. Flagged (an
   arming-audit-shaped note applied to CI wiring): un-silencing one perf/a11y step while leaving its
   siblings neutered re-opens the leak — audit all three in one motion.
