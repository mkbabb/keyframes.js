# Lane 32 — Perf instrumentation record (feeds lane 11)

> **Surface.** The perf-instrumentation record itself: run the EXISTING repo perf
> instruments — not new probes — against the current `tranche-s-impl` tree, and
> record what they actually measure. Deliverable: a measured BEFORE table for T's
> perf work, plus which instruments are structurally blind to the jank the owner
> felt (VERDICT #19: "The performance on every single page is god awful"),
> bridging to lane 29 (gate-oracle-gap) and lane 11 (the ground-up perf audit,
> which built fresh CDP probes rather than exercising the shipped instruments —
> this lane is the missing cross-check: do the instruments the repo ALREADY
> ships agree with lane 11's numbers, and if not, why not).

## 0. Method

Every instrument below is an **existing** `proof:*` script, bench file, or npm
script already checked into the repo — none were authored for this audit. Run
against the **current tree** (`tranche-s-impl` @ `929ef0e`), against the
already-built `dist/gh-pages/` (current) and `dist/keyframes.js` (rebuilt via
`npm run build:lib` where needed). Browser instruments resolve Chromium via
`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui` (the sibling with
playwright installed — neither `playwright-core` nor `lighthouse` ship in kf's
own `node_modules`, matching the harness's own documented resolution
convention); Lighthouse resolves via `KF_LIGHTHOUSE_DIR=/Users/mkbabb/Programming/speedtest`
(a sibling project with `lighthouse` installed — kf carries no lighthouse
dependency of its own). Every number below is a direct console transcript from
running the named script, not a derived estimate.

## 1. The measured baseline table (the BEFORE)

| Instrument | What it measures | Measured this run | Bound | Verdict |
|---|---|---|---|---|
| `proof:perf-frame-budget` clause (c) dock-expand | rAF-interval drops during dock hover-expand, 4× CPU throttle | dropped=0, mean=8.5ms, p95=9.3ms, max=16.7ms | ≤2 dropped (non-blocking glass-ui HANDOFF) | PASS (recorded) |
| `proof:perf-frame-budget` clause (d·ref) cube reference | rAF-interval, 1× (no throttle) | dropped=0, mean=8.3ms, max=9.3ms | — (reference only) | — |
| `proof:perf-frame-budget` clause (d) easing play | rAF-interval, 1×, best-of-3 | dropped=1, mean=11.5ms, p95=16.9ms, max=24.9ms | ≤ cube-ref(0)+4 = 4 | PASS |
| `proof:perf-frame-budget` clause (e) backdrop census | live `backdrop-filter` surfaces on `/cube` | 23 surfaces | none (hygiene flag only) | recorded, non-gating |
| `proof:scene-transition-perf` T1 | cross-scene navigate → control-surface re-render, wall-clock | p95=71.8ms, p50=45.2ms (18 transitions) | ≤120ms | PASS |
| `proof:scene-transition-perf` T2 | control-surface round-trip identity (easing↔cube) | byte-identical | exact match | PASS |
| `proof:scene-perf-budget` (A3) | amiga tessellation fillRect call count | 130 calls | ≤256 | PASS |
| `proof:scene-perf-budget` (A2) | amiga renderer effective DPR | 2.00 | ≤2 | PASS |
| `proof:scene-perf-budget` (G1) | `.scene-host` paint containment | `contain: paint` | must include `paint` | PASS |
| `proof:scene-perf-budget` (G5) | resident `will-change` at rest (cube) | 0/7 elements resident | 0 resident | PASS |
| `proof:scene-perf-budget` (A5) | amiga decay-glide live confirmation (soft) | 0/23 changed frames sampled (headless WebGL readback confound) | ≥3 (soft; hard anchor is a separate vitest) | non-bite (self-declared soft) |
| `proof:portable-perf` | self-test of the ratio-gate helper library (fixtures only) | 8/8 fixture clauses pass | n/a — no demo measurement | PASS (not a perf measurement) |
| `lighthouse-gate` (a11y+SEO, open-panel state) | axe-core binary audits + SEO, 6 scenes × 2 viewports | **3 unbucketed failures**: home/desktop `color-contrast`, cube/desktop `color-contrast`, sequence/mobile `target-size` | 0 unbucketed failures, SEO≥90 | **FAIL (3)** |
| `proof:lighthouse-mobile --probe` | mobile Lighthouse Performance + LCP, 6 scenes | home 57, cube 50, amiga 37, square 56, easing 56, spring 55/LCP 16.0s | ceilings: 63/64/49/62/61/52; spring LCP<15s | measured, no assertion |
| `proof:lighthouse-mobile` (hard, local posture) | same, asserted | same numbers | same ceilings | **FAIL (6)** — every scene misses; spring LCP 16.0s ≥ 15s bound |
| `bench/playwright.bench.ts` (the LoAF >50ms-trace gate) | main-thread blocking >50ms during a 200-cell `AnimationGroup` composite | **ENOENT** — `demo/app/loaf-observer.ts` does not exist | n/a | **BROKEN** (see §2.7) — zero LoAF data collected |
| `bench/group-composite.bench.ts` → `proof:soa-composite` | SoA vs boxed compositor blend, same-report ratio | add 4.78×, weighted 4.54× @K=8 | ≥1.2× | PASS (ADOPT, durably recorded) |
| `bench/interp-buffer.bench.ts` colorTail → `proof:color-soa` | channel-plan color fold vs boxed `mixColors`, same-report ratio | K=3 11.9–12.0×, K=8 ≈11.9×, K=12 ≈12.0× | ≥4.0× | PASS (DECLINE verdict — value.js already owns it) |
| `proof:bench-taxonomy` | manifest/cross-repo structural check (not a bench run) | 8/8 VJ asks present | n/a | PASS |
| `proof:epf1-measure` | ingest CSSOM read/write thrash, observe-only baseline | N=100: 199 forced-layout events, 78.6ms | none (observe, no floor) | recorded |
| `proof:bench-runs` | run-check: 6 in-process suites (interpolation/parser/interp-buffer/compile/sync-step/spring-tick) exit 0 with finite positive `hz` per case | did not complete in ≤180s in this sandbox (still running — `spawnSync` buffers all output until the whole `vitest bench` process exits, so no partial signal is observable); not a timeout FAILURE of the gate itself, a sandbox wall-clock limit on this lane's run | n/a (run-check, no budget) | **inconclusive this run** — recorded honestly rather than guessed |

## 2. Per-instrument findings

### 2.1 `proof:perf-frame-budget` — PASSES clean; its own oracle cannot feel the cost lane 11 named as #1

This is the instrument closest in spirit to lane 11's rAF-density/frame-drop
work, and it is the ONE instrument whose scope overlaps directly with VERDICT
#19. It ran clean this session: cube reference 0 dropped (mean 8.3ms), easing
play 1 dropped (mean 11.5ms), dock-expand 0 dropped.

**The discrepancy.** Lane 11's independent CDP-`TaskDuration`-based measurement
of the *same* `dist/gh-pages` build records **cube at ~20.9 fps at rest** and
**~20.3 fps while playing** (lane-11 report §2). This gate's own rAF-interval
sample of the identical route, in the identical headless harness, reads a mean
**8.3ms inter-frame interval — i.e. ≈120 Hz**, not the ~50ms/20fps interval
lane 11's CDP counters imply. Both numbers are measured on the same build in
the same class of headless Chromium session; they are not reconcilable as "two
views of the same 20fps" — the rAF-interval number and the paint-cost number
are answering genuinely different questions, and only one of them is visible to
this gate's pass/fail boundary (`DROP_MS = 24ms`, i.e. "a dropped frame is an
inter-rAF-callback interval over 24ms").

**Root cause.** `requestAnimationFrame` interval sampling measures how fast the
**main-thread callback loop** iterates. `backdrop-filter` blur sampling — lane
11's identified dominant cost (§3 of that report: morph +250%, motion-path
+180%, easing +76% fps once blur is removed) — is a **compositor-thread raster
cost**. It does not block the main thread's rAF callback; it delays when the
*painted* frame actually reaches the screen. In a real, vsync-locked browser
this eventually back-pressures rAF (the browser won't schedule a new callback
faster than it can present a frame); in this project's own harness — headless
Chromium launched via `chromium.launch()` with no virtual-display/vsync pump
configured (`scripts/lib/demo-driver.mjs:562`, no `headless: false` and no
frame-rate emulation) — nothing enforces that back-pressure, so the JS-side
rAF loop free-runs at whatever cadence the event loop allows (measured here:
~120 Hz), **independent of the real compositor cost**. A scene whose CSS is
main-thread-cheap (three transform-driven `@keyframes` on the cube, no
per-frame JS writes) will always read near-0-dropped under this gate's
oracle, no matter how expensive the backdrop-filter raster is — which is
*exactly* lane 11's Class-A defect (a compositor-thread, content-independent
cost). The gate's own prose asserts "cube-parity ≈ 60 fps" as its ground-truth
baseline in four places; the actual measured interval this run is **~120 Hz**,
not 60 — the documentation and the live number have quietly diverged, and
nothing catches it because `DROP_MS=24ms` sits far above both.

The gate is not blind to the *existence* of the risk: clause (e) already
counts 23 live `backdrop-filter` surfaces on `/cube` (corroborating lane 11's
own ~30 census) — but its own header says outright "This clause does NOT
gate." The instrument sees the loaded gun and declines to point it at
anything.

### 2.2 `proof:scene-transition-perf` — clean, real wall-clock, but orthogonal to jank

p95=71.8ms against a 120ms budget is a genuine `performance.now()` wall-clock
duration (hash-change → 2 committed rAFs), not an interval-sampling artifact,
so it is not subject to §2.1's blindness. But its surface is DOM/store settle
latency for the control-surface projection — it has no visual assertion at
all and cannot see (nor was it ever meant to see) "one die face renders" or a
backdrop-cost regression.

### 2.3 `proof:scene-perf-budget` — clean, structural, narrowly and correctly scoped

Five clauses, all pixel/count/computed-style facts (fillRect call count,
pixel-identity to a committed baseline, DPR ratio, `contain` keyword,
`will-change` resolution) — genuinely rigorous for what they assert, and none
of them assert anything about the cube's *rendered geometry* (all six faces
visible) or a frame rate. This is correctly scoped, not blind by accident —
but its PASS was folded into the "85/85 green" figure that the owner rejected
on sight, and nothing here could have caught VERDICT #1 ("does not render
fully… ONE die face renders").

### 2.4 `proof:portable-perf` — not a perf measurement; a unit test wearing a perf name

This gate never opens a browser and never touches the demo. It is a pure-Node
self-test of `scripts/lib/portable-perf.mjs`'s `ratioGate`/`absoluteGate`
helper functions against synthetic fixture reports (`candHz=2000/baseHz=1000`,
etc.) — 8 fixture assertions, all passing. It is legitimate infrastructure
hygiene (the helper other perf gates import), but it contributes **zero**
signal to "is the product fast," and its name invites exactly the
misreading lane 29's Class-B taxonomy warns about: a green here says nothing
about felt performance.

### 2.5 `lighthouse-gate` (a11y + SEO) — currently RED on 3 real, unbucketed regressions, but the CI wrapping discards the verdict regardless

This gate's own design is sound: it explicitly partitions failing a11y audits
into two named, reviewable allowance buckets and REDs on anything outside
them. Run against the current tree, it correctly identifies **3 audits that
are failing and are NOT in either bucket**: `home/desktop` and `cube/desktop`
both fail `color-contrast`, and `sequence/mobile` fails `target-size`. This is
the gate working exactly as designed — a real, currently-active a11y
regression that its own logic marks as a hard failure.

The gap is not in the oracle; it is in `ci.yml`. The workflow step that runs
this gate carries `continue-on-error: true` inside a job the file's own
closing step calls "OBSERVE-ONLY … never fails the `ci` workflow." So a gate
that is *designed* to hard-bite on an unbucketed a11y regression, and *is*
firing that bite this run, cannot block anything — the CI scaffolding around
a correctly-designed gate neuters it before its verdict ever reaches a human.
This is a distinct failure mode from lane 29's Class A/B/C oracle-quality
taxonomy: the oracle here is fine; the wiring around it is not.

### 2.6 `proof:lighthouse-mobile` — the one existing instrument that DOES corroborate "god awful," muted by never running hard

Run with `--probe` (measure-only) and then hard (asserted, local/non-CI
posture — this environment reports `IN_CI: false`), **every single scene
misses its mobile-performance ceiling**: home 57 (floor 63), cube 50–51
(floor 64), amiga 37–38 (floor 49), square 56 (floor 62), easing 56 (floor
61); spring's Performance score just clears its floor (55 ≥ 52) but its LCP
(16.0s) blows past the 15s regression bound. The hard run prints
`FAIL (6): ceiling miss(es) on a local/on-device run` and exits non-zero — a
concrete, currently-firing corroboration of VERDICT #19's "every single page"
framing, measured by an instrument the repo already ships.

Two things mute this signal in practice: (1) the gate's own documented
posture is `observe-only` in CI (a shared/contended sandbox systematically
inflates Lighthouse's throttled numbers, a legitimate concern) and only
hard-asserts under an explicit `KF_REQUIRE_LH=1` on a "calibrated runner" —
`ci.yml`'s job never sets that variable, so the hard branch of this gate's own
code appears to have never executed in automation; (2) even the observe
branch's misses are only ever *printed*, never accumulated into a committed
baseline artifact a future T wave could diff against. The instrument is real
and it agrees with lane 11 in its own dimension (mobile); it has simply never
been pointed at anything that would surface its verdict.

### 2.7 `bench/playwright.bench.ts` (the LoAF >50ms-trace gate) — dead for 116 commits, silently

This gate ENOENTs immediately: it reads
`demo/app/loaf-observer.ts` (three hardcoded references,
`bench/playwright.bench.ts:4,23,156,159`) and that path has not existed since
commit `440e5c3` ("S.D1: partition demo/app/ into scene/·transition/·runtime/
… atomic move"), which relocated the file to
`demo/app/runtime/loaf-observer.ts` — **116 commits before `HEAD`** on this
branch's history (`git rev-list 440e5c3..HEAD --count` = 116) — without
updating the bench's path. The move is a pure rename (the export
`observeLongAnimationFrames` is unchanged); the break is a one-line path
fix, but it has produced **zero LoAF data** for the entire back half of the S
impl drive, and nothing caught it because:

- `proof:bench-runs` (the hard, structural "the benches run" gate) explicitly
  **excludes** `playwright.bench.ts` by name (`scripts/proof-bench-runs.mjs`
  header: "browser-gated … a legitimate CI-calibration excuse") — deliberate,
  documented, and correct in isolation, but it means no HARD gate ever
  imports this file at all.
- `bench/taxonomy.json`'s `suites[]` list also omits `playwright.bench.ts` —
  `proof:bench-taxonomy` cannot see it either.
- `ci.yml`'s own LoAF step (`.github/workflows/ci.yml:614-628`) wraps the run
  in `continue-on-error: true` *and* pipes the vitest invocation through
  `|| true`, so even the step's own internal `grep -q 'loaf-gate.*PASS'`
  failure (which DOES fire — an ENOENT never prints the PASS string) cannot
  fail the job, and the job itself is declared observe-only for the whole
  workflow.

Net effect: a real, producer/consumer-paired perf instrument that the repo's
own commentary calls out as closing "both the LoAF and >50ms-trace chronics as
ONE perf-evidence subsystem" has been quietly producing **no evidence at all**
for a substantial fraction of the tranche, invisible at every tier (hard
gate exclusion → taxonomy exclusion → CI continue-on-error → an `|| true`
inside the one step that does run it).

### 2.8 The engine-internal bench floors (SoA composite, colorTail) — rigorous, honest, and orthogonal to the felt jank

`proof:soa-composite` and `proof:color-soa` are the most methodologically
sound instruments in this entire lane: same-report, device-independent
ratios (`scripts/lib/portable-perf.mjs`'s `ratioGate`), K-monotone ladders,
byte-identical correctness cross-checks against the boxed reference, and
durably recorded ADOPT/DECLINE verdicts (`scripts/soa-composite-decision.json`
et al.) that a re-run reproduces rather than re-derives. Measured this
session: SoA compositor blend at K=8 runs 4.78× (add) / 4.54× (weighted)
against a 1.2× floor; the colorTail channel-plan fold runs ~11.9–12.0× against
a 4.0× floor at every K. Both comfortably clear their bounds.

This is the shape T-GATE-PERF (lane 29) and lane 11's T6 should imitate for
the **demo** layer — but as of today it exists only for the **engine's**
hot interpolation/compositing loop, a layer strictly below the DOM/CSS/
compositor jank the owner actually felt. None of the 22 VERDICT items trace to
interpolation throughput; this family answers a real, well-answered question
that is causally disconnected from "god awful."

## 3. Bridge to lane 29 — ranked, which instruments are blind to owner-felt jank and why

1. **`proof:perf-frame-budget`** — structurally blind to compositor-bound
   cost by construction (rAF-interval sampling on a main thread that free-runs
   in this harness's headless Chromium, decoupled from real paint/raster
   cost — §2.1). Its own hygiene census already counts the risk factor
   (backdrop-filter surfaces) and explicitly declines to gate on it.
2. **`bench/playwright.bench.ts` (LoAF)** — not blind by design, dead by
   neglect: ENOENT for 116 commits, invisible at every tier that could have
   caught it (§2.7).
3. **`lighthouse-gate` (a11y)** — not blind at all; it is *currently firing* 3
   real, correctly-classified failures. The blindness is downstream, in
   `ci.yml`'s `continue-on-error` wrapping (§2.5) — a wiring gap, not an
   oracle gap, and worth keeping distinct from lane 29's oracle taxonomy.
4. **`proof:lighthouse-mobile`** — not blind either; it is the one instrument
   in this lane whose numbers directly corroborate VERDICT #19 (6/6 scenes
   miss their mobile ceiling). It is muted by a `KF_REQUIRE_LH=1` hard-assert
   path that no CI job ever exercises (§2.6).
5. **`proof:scene-perf-budget` / `proof:scene-transition-perf`** — correctly
   and narrowly scoped to structural/timing invariants that were never meant
   to see visual jank; the error was letting their PASS count toward an
   undifferentiated "85/85 green," not any defect in the gates themselves
   (§2.2, §2.3).
6. **`proof:portable-perf`** — not a perf measurement of the product at all; a
   helper-library self-test riding a perf-sounding name (§2.4).
7. **SoA/colorTail bench floors** — rigorous and honest, but orthogonal: they
   measure the engine's hot loop, a layer below the DOM/compositor jank the
   owner described (§2.8).

**The one-line summary for lane 11:** of the seven existing instruments this
lane exercised, only one (`proof:lighthouse-mobile`) currently produces a
verdict that agrees with lane 11's "god awful" finding, and it is the one
instrument nobody has ever run in the posture that would let it bite. Every
other perf-adjacent instrument is either measuring the wrong layer (engine
hot-loop, DOM settle-latency, structural pixel facts) or is structurally
incapable of feeling the layer lane 11 identified as dominant (compositor-
bound `backdrop-filter` raster cost, invisible to main-thread rAF-interval
sampling in this project's own headless harness).

## T recommendations

### T-PERF-A — Fix the LoAF gate's stale path and make a moved-observer un-silent · **S**
- **Scope:** repoint `bench/playwright.bench.ts`'s three `demo/app/loaf-observer.ts`
  references to `demo/app/runtime/loaf-observer.ts` (the S.D1 move target).
  Additionally, replace the bare `fs.readFileSync` with a pre-flight
  `existsSync` check that throws a distinct, human-legible error ("the LoAF
  observer moved — update bench/playwright.bench.ts's path") rather than a
  raw ENOENT indistinguishable in the CI log from a genuine bench failure —
  today's `grep -q 'loaf-gate.*PASS'` check in `ci.yml` cannot tell "the
  observer regressed" from "the file moved."
- **Gate shape:** `KF_PLAYWRIGHT_DIR=… npm run bench -- --run bench/playwright.bench.ts`
  produces a real `loaf-gate — PASS: no >50ms …` line (not an ENOENT stack);
  add a static source-anchor (a cheap grep in `proof:bench-taxonomy` or a
  sibling script) asserting every path `bench/playwright.bench.ts` reads
  actually resolves, so a future `demo/app/` re-partition reds loudly instead
  of silently zeroing this gate's signal again.
- **Size:** S

### T-PERF-B — Replace rAF-interval sampling in `proof:perf-frame-budget` with the CDP-counter methodology lane 11 already proved · **M**
- **Scope:** `proof:perf-frame-budget`'s dropped-frame oracle is blind to
  compositor-bound cost in this harness (§2.1, measured: cube reads 0
  dropped / ~120Hz main-thread cadence via rAF-interval while lane 11's
  CDP-`TaskDuration` sampling reads ~20fps effective on the identical build).
  Add a CDP-metrics clause (`RecalcStyleCount`/`LayoutCount`/`TaskDuration`
  deltas over the same play window, the exact counters lane 11's report
  validates as device-independent architecture-truth) alongside — not
  instead of — the existing rAF-interval clauses, and fold the already-computed
  backdrop-filter surface census (today clause (e), explicitly non-gating)
  into an actual relative budget: surface-count × moving-subject must not
  correlate with a TaskDuration spike beyond a named margin.
- **Gate shape:** the new clause is born-RED today at lane 11's measured
  deltas (cube ~20fps rest, easing locked ~33fps, spring 465→537 recalcs /
  228→263 layouts over a 2.5s play window) and greens only once lane 11's T1
  (de-layer the blur) lands. Re-uses `scripts/lib/portable-perf.mjs`'s
  `ratioGate` so the new clause is a same-report ratio, not a fresh absolute
  number.
- **Size:** M

### T-PERF-C — Promote `proof:lighthouse-mobile` off the permanently-unexercised hard path and commit its baseline · **M**
- **Scope:** `KF_REQUIRE_LH=1` is the only path that turns this gate's already-
  correct ceiling logic into a blocking check, and no CI job sets it — the
  gate has apparently never hard-asserted in automation. Stand up (or
  designate) one calibrated runner (self-hosted or a fixed-spec cloud
  instance) that runs this gate with `KF_REQUIRE_LH=1` on a schedule, and
  commit this lane's measured numbers (home 57/cube 51/amiga 38/square 56/
  easing 56/spring 55+LCP16.0s — every scene currently below its B-baseline
  floor) as the T-open BEFORE baseline, not a re-derivable curiosity.
- **Gate shape:** the calibrated job reds today (6/6 misses, reproduced twice
  in this lane); green only once mobile perf is restored to the B floors —
  the falsifiable form of VERDICT #19's mobile half.
- **Size:** M

### T-PERF-D — Un-silence the `lighthouse-gate` a11y regression or own it explicitly · **S**
- **Scope:** `home/desktop` + `cube/desktop` `color-contrast` and
  `sequence/mobile` `target-size` are failing THIS RUN, unbucketed, which by
  the gate's own logic means "a real regression" — and `ci.yml`'s
  `continue-on-error: true` discards that verdict unconditionally. Either
  remove the step-level `continue-on-error` (let a genuine unbucketed a11y
  regression block, matching the gate's own documented intent) or, if a11y
  triage is deliberately deferred to a later tranche, add these three to a
  NAMED, dated allowance bucket (mirroring `bucket-glassui`/`bucket-w2`
  already in the file) so the miss is tracked, not absorbed.
- **Gate shape:** either the CI step reds on the next unbucketed a11y
  failure (post continue-on-error removal), or `lighthouse-gate.mjs` grows a
  `bucket-t-pending` with an explicit trigger and this run's 3 misses land in
  it by name.
- **Size:** S

### T-PERF-E — Route lane 11's demo-perf probes through the ALREADY-BUILT `portable-perf.mjs` ratio-gate substrate · **S**
- **Scope:** complements lane 11's T6 (re-home `perf-probe`/`idle-churn`/
  `toggle-probe`/`raf-density` into `scripts/proof-perf-*.mjs`) by naming the
  specific reusable piece: `scripts/lib/portable-perf.mjs`'s `ratioGate`/
  `absoluteGate` (already proven by `proof:soa-composite`/`proof:color-soa`,
  §2.8, and self-tested by `proof:portable-perf`) is the exact
  same-report/device-independent primitive T6's new demo-perf gates need, so
  the demo-DOM layer gets the same rigor the engine's hot loop already has,
  without re-deriving ratio math (the X1 duplication `proof:portable-perf`
  already guards against).
- **Gate shape:** every new `proof:perf-*` clause lane 11's T6 authors
  imports `ratioGate`/`absoluteGate` rather than hand-rolling a threshold
  compare; `proof:portable-perf`'s existing `lint-no-raw-floor` clause
  extends to cover the new files automatically (it scans all of `scripts/*.mjs`
  minus a small exclusion list).
- **Size:** S
