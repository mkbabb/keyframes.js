# M.W12 — Performance closure (honest measurement)

- **Band:** D · **Class:** DEV (docs); IMPL opens on authorization · **Dep:**
  value.js 0.13.0 (already pinned — the kf-side measurement instruments need no
  sibling publish). The value.js color-math co-bench (VJ.L1–L8) is a CROSS-REPO
  dispatch, NOT a kf-side blocker: this wave authors the kf-side instrument that
  VALIDATES the consume edge when value.js O 0.14.0 publishes; it does not consume
  it. Composes with M.W1's report-all runner but does NOT require it. Parallel with
  M.W13 (no file collision — M.W13 touches `engine.ts`/`group.ts`; M.W12 touches
  `bench/*` + `scripts/proof-*.mjs` + `bench/taxonomy.json` only).
- **Gate (extended + one NEW arm):** `proof:bench-taxonomy` EXTENDED — the
  `bench/numeric-soa.bench.ts` + `bench/color-interp.bench.ts` cases classified +
  budgeted, `bench/sync-step.bench.ts` lifted into the manifest's `suites` array
  (its 4 cases TODAY un-classified — verified `bench/taxonomy.json:suites` omits it
  while `scripts/proof-bench-runs.mjs:51` runs it); the BUDGETED-FLOOR ENFORCEMENT
  arm (the `observe-only` posture that lets every budget miss pass silently in CI —
  re-derived as a device-INDEPENDENT ratio floor that is HARD everywhere). `proof:scheduler-posttask`
  RE-TARGETED off its jsdom-SKIP proxy onto a REAL-BROWSER INP measurement — born-RED
  because no real measurement exists today (the gate is GREEN-by-SKIP, never measured
  the observable it was built to gate).

---

## Context

Lane-29 and lane-30 certify the L perf surface as **clean — no precept violation** —
but with **five un-measured / mis-attributed gaps** the L gates structurally cannot
see. M.W12 is the **honesty wave**: it closes each gap with a kf-side measurement
instrument whose born-RED witness is the REAL observable (inv-M-observable-truth),
corrects the one factual doc error, and dispatches the value.js color-math co-bench
on the acyclic spine. The wave ships ZERO engine code — the engine perf is already
SOTA (monomorphic dispatch, zero-alloc steady state, phase-separated PLAY path,
lane-30 §1/§9). M.W12 is the gate apparatus that makes the perf claims FALSIFIABLE
and TRACKED, not new speed.

The five gaps, each live-verified against today's tree (`tranche-j-dev`, 2026-06-17):

### Gap 1 — `NumericAnimation.at()` has NO kf-side throughput bench (lane-29 Gap 2)

L.W7 S2 packed `NumericAnimation`'s segment buffers into `Float64Array` and routed
`.at()` through one fused `lerpArray` (`numeric.ts:145-208`, verified). The
`proof:zero-alloc` LIGHT-tier sentinel (`test/zero-alloc.test.ts:181-182`) asserts the
STRUCTURAL property (`seg.from`/`seg.to instanceof Float64Array`) — but there is **no
throughput bench for `NumericAnimation.at()`**. `bench/numeric-soa.bench.ts` does not
exist (`ls bench/numeric-soa.bench.ts` → ENOENT, verified). The taxonomy manifest has
no `NumericAnimation` arm in any suite — `bench/interpolation.bench.ts` benches
`CSSKeyframesAnimation.interpFrames` (opacity + transforms), never the LIGHT
`NumericAnimation` path. The LIGHT-tier SoA win — the one most-likely-to-regress
because it is the value.js-free re-implementation of the HEAVY path — is the most
visible perf claim with the least measurement.

### Gap 2 — no color-interpolation integration bench (lane-29 Gap 3, lane-30 §2.2)

Every animation frame that interpolates a color-valued property
(`background-color`, `color`, `border-color`) routes through `lerpComputedValue` →
value.js `mixColors` → `oklab2xyz` → `transformMat3`, paying the VJ.L1–L4 per-call
allocs (lane-30 §2.1: `transformMat3` 1 tuple/call; `oklab2xyz`/`xyz2oklab` 3 tuples
each; `mixColors` `keys().filter()` + `resultComponents[]`; `gamutMapToRgbSpace` ≥48
Color allocs per out-of-gamut pixel). `bench/interpolation.bench.ts` benches opacity +
transforms ONLY — the color path is entirely un-benched. `bench/color-interp.bench.ts`
does not exist (verified). Without a kf-side baseline, value.js O's VJ.L1–L8 zero-alloc
rewrites CANNOT be validated on re-pin — there is no before/after instrument.

**The DENSIFY oklch nuance (lane-30 §2.3, the highest-value row):** the PLAY leg of a
2-stop `oklab→rgb` animation is allocation-FREE in steady state (the `direct.ts:46`
direct path — lane-30 §2.2). The cost is on the COMPILE leg — `sampleColorRamp` /
`densifyKey` (M.W6's surface) — where `space:"oklch"` ramps take the XYZ hub (no
`oklch↔oklab` DIRECT_PATH) and pay 12+ tuple allocs per stop. The integration bench
must exercise BOTH: `interpFrames` over a color corpus (the PLAY leg) AND a `compileToCSS`
oklch→oklab densify (the COMPILE leg) — so the value.js O consume can be validated on
the leg that actually allocates.

### Gap 3 — `bench/sync-step.bench.ts` is un-wired into the taxonomy (lane-29 Gap 1)

`bench/sync-step.bench.ts` exists (the J.W6 S1 / FB-2 loop-core dispatch instrument);
`scripts/proof-bench-runs.mjs:51` runs it as a RUN-CHECK. But `bench/taxonomy.json`'s
`suites` array names only FIVE suites — `sync-step` is **absent** (verified:
`["bench/interpolation.bench.ts","bench/parser.bench.ts","bench/interp-buffer.bench.ts",
"bench/compile.bench.ts","bench/spring-tick.bench.ts"]`). Because
`proof:bench-taxonomy`'s coverage clause (`proof-bench-taxonomy.mjs:232-242`) iterates
`namesBySuite` — built ONLY from suites IN the manifest (`:207-209`) — the four
sync-step cases are entirely OUTSIDE the gate's coverage floor. The bench measuring the
loop-core sync fast-path (the J.W6 `1.998→0` microtask-turns/frame win, the gate that
guards against a regression to the per-frame promise loop) has **no taxonomy
classification and no budgeted arm**. Its four cases:

| Case name (exact, from `bench/sync-step.bench.ts`) |
|---|
| `drive(SmoothProgress) · 600-frame window` |
| `drive(SpringProgress) · 600-frame window` |
| `play(Animation · K=8 transform) · 600-frame window` |
| `play(AnimationGroup · 32 cells · K=8) · 600-frame window` |

### Gap 4 — the `postTask` probe is GREEN-by-SKIP, never measured (lane-29 Gap 5, lane-30 §3.4)

`proof:scheduler-posttask` (`scripts/proof-scheduler-posttask.mjs`) is GREEN today —
but ONLY because the probe SKIPs when `scheduler.postTask` is absent in jsdom
(`scheduler-posttask.mjs:31`: "the postTask arm SKIPs in jsdom"). **The gate has NEVER
MEASURED the observable it was built to gate** — whether wrapping `warmEngine()`'s
`loadAnimationEngine()` in `scheduler.postTask(…, {priority:"background"})` produces a
real INP benefit (or at least no INP regression) versus the current bare
`void loadAnimationEngine()`. The SKIP is not a win; it is a measurement that did not
happen. **This is the EXACT inv-M-observable-truth failure the L.W1 S4 gate committed:**
a gate that tests a proxy (here, "the probe didn't error in an environment that lacks
the API") and never bites the real observable (the INP delta in a real browser). M.W12
RE-TARGETS the gate onto a Playwright real-browser INP measurement — born-RED because
that measurement does not exist today.

### Gap 5 — the budgeted floors are NOT enforced (lane-29 §1e, §2; the apparatus seam)

The three `budgeted` arms (SoA K=8, spring-vector K=8, warmEngine pre-resolve —
`bench/taxonomy.json` `cases[].category==="budgeted"`, verified) route EVERY floor
miss through `declarePosture("observe-only")` (`proof-bench-taxonomy.mjs:66-70`). Per
`scripts/lib/ci-env.mjs:63-65`, an `observe-only` miss in CI is NOTED, never RED — so a
2× throughput REGRESSION on any budgeted arm prints `[CI observe-only — …]` and the gate
**stays GREEN**. The floor is a device-DEPENDENT wall-clock `hz` predicate (lane-29 §2),
correctly observe-only by `inv-L-device-honesty` — BUT this means there is no
device-INDEPENDENT floor that is HARD everywhere. The warmEngine arm compounds this: its
floor is an ABSOLUTE `floorHz:1000` (`taxonomy.json` `floorHz`), not a baselineCase ratio
— a number that is device-dependent AND un-tracked to a baseline. The honest fix is a
RATIO floor (the win as a fraction of its own baseline, computed from the same report —
device-independent by construction, like the SoA/spring arms' `floorFraction:1.2`) that
is HARD in CI for the device-INDEPENDENT ratio, observe-only ONLY for the absolute
wall-clock magnitude. **Budgeted-floor enforcement** = the budgeted arm reds a real
regression instead of noting it.

### The doc correction — L.W7.md:24 mis-attribution (lane-29 §5, lane-30 §3.3)

`L.W7.md:24` states the `lerpArray` SoA win was "the J.W6 S2 SoA bench arm, **measured
1.56× at K=2 → 4.25× at K=64**" (verified live). Those numbers are the **G-era value.js
microbench** (`docs/tranches/G/audit/a-valuejs-leverage.md:173`, value.js's own
`bench/numeric-soa.mjs`) — NOT a kf-side measurement. The authoritative kf-side number is
**16.6× at K=8 full-pipeline** (`docs/tranches/J/waves/J.W6-impl.md:327`: 10,772.56 hz
per-channel → 179,142.05 hz SoA). The two are not contradictory (G measures value.js's
internal `lerpArray` vs scalar at small K; J.W6 measures the kf full pipeline) but the
L.W7 citation names value.js's number as kf's. This recurs at `L.W7.md:450` and `:451`
("1.56–4.25× throughput regression at K=2–64", "the J.W6 S2 bench measured"). M.W12
corrects all three to cite the kf-side 16.6× and label the 1.56×–4.25× as value.js's
provenance number.

### Audit evidence summary

| Ref | Source (file:line) | Gap |
|-----|--------------------|-----|
| lane-29 Gap 2 | `numeric.ts:145-208` (SoA path shipped); `bench/numeric-soa.bench.ts` ENOENT; `test/zero-alloc.test.ts:181-182` (sentinel only) | `NumericAnimation.at()` throughput un-benched kf-side |
| lane-29 Gap 3 / lane-30 §2.2-2.3 | `bench/interpolation.bench.ts` (opacity+transforms only); no color suite | color-interp PLAY + densify COMPILE legs un-benched; VJ.L1–L8 consume un-validatable |
| lane-29 Gap 1 | `bench/taxonomy.json` `suites` (5, sync-step absent); `proof-bench-runs.mjs:51` (runs it); `proof-bench-taxonomy.mjs:207-242` (coverage only over manifest suites) | `sync-step.bench.ts` 4 cases un-classified, un-budgeted |
| lane-29 Gap 5 / lane-30 §3.4 | `scripts/proof-scheduler-posttask.mjs:31` (SKIPs in jsdom) | postTask INP benefit never measured — GREEN-by-SKIP, not by measurement |
| lane-29 §1e/§2 | `proof-bench-taxonomy.mjs:66-70`+`ci-env.mjs:63-65` (observe-only miss never reds); `taxonomy.json` warmEngine `floorHz:1000` (absolute) | budgeted floors un-enforced; no device-independent HARD floor |
| lane-29 §5 / lane-30 §3.3 | `L.W7.md:24,450,451` vs `J.W6-impl.md:327` + `G/audit/a-valuejs-leverage.md:173` | "1.56×–4.25×" is value.js's G-era number, mis-cited as kf's J.W6 measurement |
| lane-29 §8 / lane-30 §2.4,§7 | `KF-TO-VALUEJS-O-ASKS.md §7` (VJ.L1–L8 dispatched); `taxonomy.json` `crossRepo[]` (8 ids) | color-math co-bench dispatch must stay intact + gain the kf-side validation instrument |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:bench-taxonomy` (extended) GREEN-on-coverage-but-RED-until-the-benches-exist +
`proof:scheduler-posttask` (re-targeted) born-RED + the budgeted-floor HARD arm + the
doc correction + the cross-repo dispatch confirmed. **No engine/library source is
touched** — this wave authors TWO new bench suites + extends ONE bench suite + extends
TWO gate scripts + the `taxonomy.json` manifest + the L.W7 doc correction + the
`KF-TO-VALUEJS-O-ASKS.md` co-bench arm. (DEV-phase: this is the SPEC; the bench/gate
authorship opens on explicit authorization, per the M.W0 dev→impl boundary.)

---

### S1 — `bench/numeric-soa.bench.ts`: the kf-side `NumericAnimation.at()` K-ladder (Gap 2 → Gap 1's analog)

**Breach.** `bench/numeric-soa.bench.ts` does not exist (verified ENOENT). The LIGHT-tier
SoA win is asserted only by a `Float64Array` sentinel (`test/zero-alloc.test.ts:181-182`)
— a STRUCTURAL property, not a throughput number. The G-era "1.56× at K=2" is value.js's
microbench, never a kf-side `NumericAnimation.at()` measurement.

**Deliverable.** Author `bench/numeric-soa.bench.ts` with cases at **K ∈ {2, 5, 12, 32}**
(the K-ladder, extending `interp-buffer.bench.ts`'s {2,5,12} with K=32 to surface the
typed-array win at the high-channel end where the per-channel `lerp`-loop dispatch cost
dominates). Each case constructs a `NumericAnimation` over a 2-stop `{k0..k_{K-1}: number}`
keyframe pair and benches `.at(p)` over a 600-frame steady window (the
`bench/*.bench.ts` 600-frame convention — `interp-buffer.bench.ts:74`,
`sync-step.bench.ts`). The bench measures the SHIPPED SoA path (`numeric.ts:201`
`lerpArray(seg.from, seg.to, eased, _out)`) — it does NOT need a "before" arm in-suite (the
sentinel already proves the buffers are `Float64Array`; the bench measures the absolute
`hz` the taxonomy then classifies).

**Taxonomy classification.** Add the four cases to `bench/taxonomy.json` `cases[]` with
`suite:"bench/numeric-soa.bench.ts"`, category **`observe-only`** (no floor until a
measurement run records the baseline — the MEASURE-FIRST discipline `proof:spring-vector`
models; lane-29 Gap 2: "add as observe-only … if the win at K≥2 is ≥1.2× vs a pre-S2
baseline, promote to budgeted"). Add `bench/numeric-soa.bench.ts` to the manifest's
`suites` array.

**Gate bite.** `proof:bench-taxonomy`'s coverage clause (`proof-bench-taxonomy.mjs:232-264`)
now requires every numeric-soa case classified AND every classified case reported — a
renamed/dropped case reds the `coverage` clause. The non-empty clause (`:266-279`) asserts
finite positive `hz`. **Born-RED today:** the suite is absent → if added to `suites` before
the file exists, `vitest bench` finds no cases → the coverage clause reds (manifest names a
case absent from the report). GREEN when the suite + the four cases + the classifications
co-exist.

**Honest number to report.** The wave's measurement run RECORDS the kf-side
`NumericAnimation.at()` hz at K∈{2,5,12,32} as the FIRST kf-side LIGHT-tier number —
superseding the borrowed G-era "1.56×". The number is reported in `PROGRESS.md`, not
asserted as a floor (until a baseline exists to ratio against).

---

### S2 — `bench/color-interp.bench.ts`: the PLAY-leg + densify-COMPILE-leg color baseline (Gap 2)

**Breach.** No kf bench exercises color interpolation. `bench/interpolation.bench.ts`
benches opacity + transforms only. The VJ.L1–L8 value.js color-math allocs (lane-30 §2.1)
are paid on every color frame's COMPILE-leg densify but have **zero kf-side measurement** —
so value.js O's zero-alloc rewrites cannot be validated on re-pin.

**Deliverable.** Author `bench/color-interp.bench.ts` with TWO case families (the leg
distinction lane-30 §2.2-2.3 makes load-bearing):

1. **PLAY leg** — `fromString("from{background-color:oklch(0% 0 0)}to{background-color:oklch(100% 0 0)}").interpFrames(500,false)` over a 600-frame window. Measures the per-frame
   color lerp (the `_colorPlan` Float64Array path — lane-30 §1.2). Steady-state
   allocation-free per lane-30 §2.2; this is the regression-guard arm.
2. **COMPILE leg (the allocating one)** — `compileToCSS` of a `background-color` keyframe
   over an **oklch-space** ramp at N stops (the `sampleColorRamp`/`densifyKey` densify —
   M.W6's surface), which TODAY takes the XYZ hub (no `oklch↔oklab` DIRECT_PATH — lane-30
   §2.3) and pays 12+ tuple allocs per stop. This is the arm value.js O's VJ.L1–L8 +
   VJ.O.DIRECT-OKLCH-OKLAB (lane-30 §7) will move.

**Taxonomy classification.** Add both case families to `taxonomy.json` `cases[]` (suite
`bench/color-interp.bench.ts`) as **`observe-only`** (the kf-side validation instrument
for the cross-repo asks — NOT `cross-repo` itself, which excludes from CI; this bench is
kf's OWN `interpFrames`/`compileToCSS`, per lane-29 Gap 3: "categorized observe-only … it
measures kf's own interpFrames"). Add the suite to `suites`. On value.js O re-pin (M.W9),
the densify arm is RE-MEASURED and the cross-repo `crossRepo[]` VJ.L# entries graduate
toward `budgeted` IF the kf-side densify hz improves ≥1.5× (lane-30 §5 M-PERF-3 — the
alloc-elimination win range).

**Gate bite.** Same coverage + non-empty clauses as S1. **Born-RED today:** the suite is
absent. GREEN when the two families exist and report finite hz. The cross-repo graduation
is M.W9's, gated on the value.js O publish — NOT this wave's DONE.

**Honest number to report.** The densify-leg hz on today's value.js 0.13.0 is the
pre-VJ.L1–L8 baseline — recorded so the post-re-pin delta is the validated co-bench result.
NO speed claim is made here; the number is the BEFORE of a before/after the value.js O
publish completes.

---

### S3 — wire `bench/sync-step.bench.ts` into the taxonomy (Gap 1)

**Breach.** `bench/sync-step.bench.ts` runs in `proof:bench-runs` (`proof-bench-runs.mjs:51`)
but is ABSENT from `taxonomy.json` `suites` (verified). Its four cases — the J.W6 loop-core
dispatch instrument — have NO taxonomy coverage; the `proof:bench-taxonomy` coverage floor
(`proof-bench-taxonomy.mjs:232-242`) iterates only suites in the manifest, so the gap is
invisible.

**Deliverable.** Add `bench/sync-step.bench.ts` to `taxonomy.json`'s `suites` array. Add
its four cases to `cases[]`:

| Case name | Category | Rationale |
|---|---|---|
| `drive(SmoothProgress) · 600-frame window` | `run-check` | loop-core dispatch cost; finite positive hz |
| `drive(SpringProgress) · 600-frame window` | `run-check` | loop-core dispatch cost |
| `play(Animation · K=8 transform) · 600-frame window` | `observe-only` | the J.W6 S1 sync fast-path win arm; recorded baseline |
| `play(AnimationGroup · 32 cells · K=8) · 600-frame window` | `observe-only` | the group YIELD_BATCH loop arm; recorded baseline |

(The classification follows lane-29 Gap 1's proposal: the loop-core dispatch arms are
`run-check`; the `play(Animation)`/`play(Group)` arms are `observe-only` baselines.)

**Gate bite.** With `sync-step` in `suites`, `proof:bench-taxonomy` now BUILDS `namesBySuite`
for it (`proof-bench-taxonomy.mjs:207-218`) and the coverage clause asserts every reported
sync-step case is classified. **Born-RED transition:** add the suite to `suites` BEFORE the
cases to `cases[]` → the four reported cases are un-classified → coverage clause reds
(`:234-240` "bench case … is not classified"). GREEN when the suite + four classifications
co-exist. This is the falsifiable closure of the `proof:bench-runs`/`proof:bench-taxonomy`
coverage divergence.

---

### S4 — RE-TARGET `proof:scheduler-posttask` onto a REAL-BROWSER INP measurement (Gap 4 — the inv-M-observable-truth keystone)

**Breach (the proxy).** `proof:scheduler-posttask` is GREEN by SKIP: the probe SKIPs when
`scheduler.postTask` is absent in jsdom (`proof-scheduler-posttask.mjs:31`). **It has never
measured the observable it gates** — the INP delta of `warmEngine()` wrapping
`loadAnimationEngine()` in `postTask("background")` versus the bare `void loadAnimationEngine()`.
The current gate asserts only (a) the probe file exists, (b) it exits 0, (c)
`yieldToMain()` still uses `scheduler.yield`. NONE of these bites the real INP observable —
this is the L.W1 S4 proxy failure recurring (inv-M-observable-truth).

**Deliverable.** RE-TARGET the gate onto a Playwright real-browser arm (the
`bench/playwright.bench.ts` / `proof:computed-real-dom` browser-gated precedent — the only
realm where `scheduler.postTask` and a real event loop exist). The new arm:

1. Loads the served built `dist` in a real chromium (the M.W3 `@vitest/browser` shared
   browser when it lands; until then a Playwright-core driver mirroring
   `bench/playwright.bench.ts`).
2. Measures INP (or LoAF attribution / `performance.measure` bracket as the device-honest
   fallback) for a user-gesture-triggered first `.animate()` under TWO conditions:
   (a) `warmEngine()` fired with bare `void loadAnimationEngine()` (today's behavior),
   (b) `warmEngine()` fired with `scheduler.postTask(() => loadAnimationEngine(), {priority:"background"})`.
3. Records the ADOPT/KILL verdict in `scripts/scheduler-posttask-decision.json` (mirroring
   `scripts/spring-vector-decision.json`'s MEASURE-FIRST shape — lane-30 §3.4 step 3).

**The MEASURE-FIRST contract (unchanged from L.W7 S4, sharpened).** Production `warmEngine`
adopts `postTask("background")` ONLY if the real-browser arm measures NO INP regression
(the background dispatch does not delay the gesture's first visible frame). If the
measurement shows no benefit AND no regression, the verdict is KILL-or-no-op (the bare
`void loadAnimationEngine()` stays) — recorded, not silently SKIPed.

**Gate bite (born-RED today — the REAL observable).** The re-targeted gate is **RED on
today's tree** because `scripts/scheduler-posttask-decision.json` does not exist and the
real-browser INP arm has never run — the SKIP-in-jsdom path no longer counts as GREEN. The
born-RED witness is the ABSENCE of a real measurement, not a source grep. GREEN when the
real-browser arm runs and the decision JSON records ADOPT (with no INP regression measured)
OR KILL (the postTask adoption stays un-shipped, the decision recorded). Per the M.W12
row: "the postTask probe greens on a real measurement OR stays KILLed" — the KILL path is a
GREEN gate over a recorded verdict, the inv-M-observable-truth-honest close.

**Constraint (M.W3 composition).** This arm rides the M.W3 shared-browser integration tier
when it lands (the warm chromium); on today's serial tree it is a standalone Playwright-core
driver in the `proof:computed-real-dom` browser-gated lane (NOT the jsdom unit tier — the
API is structurally absent there, the source of the false-GREEN).

---

### S5 — budgeted-floor ENFORCEMENT: a device-independent HARD ratio (Gap 5)

**Breach.** The three budgeted arms (`taxonomy.json` `cases[].category==="budgeted"`) route
every floor miss through `declarePosture("observe-only")` (`proof-bench-taxonomy.mjs:66-70`),
so a 2× regression NOTES and stays GREEN (`ci-env.mjs:63-65`). The warmEngine arm uses an
ABSOLUTE `floorHz:1000` (device-dependent AND un-tracked to a baseline). There is no
device-INDEPENDENT floor that is HARD in CI.

**Deliverable.** Split each budgeted arm's floor into TWO predicates (the device-honest
decomposition the apparatus already affords — `proof-bench-taxonomy.mjs:296-319` computes
`floor = baseHz * frac` from the SAME report):

1. **The device-INDEPENDENT ratio (HARD everywhere).** The SoA and spring arms ALREADY use
   `baselineCase` + `floorFraction:1.2` — a same-report ratio that tracks the runner
   (`:307` `floor = baseHz * frac`). This ratio is device-independent BY CONSTRUCTION (both
   numerator and denominator measured on the same runner in the same pass). Route the ratio
   miss through `declarePosture("hard")` (or a dedicated `miss=fail`) — a ratio inversion
   (SoA SLOWER than per-channel; spring-vector SLOWER than K-scalar) is a CORRECTNESS-class
   regression, HARD everywhere, never observe-only. The `observe-only` posture stays ONLY for
   the absolute-magnitude wall-clock arm.
2. **Re-derive the warmEngine arm to a ratio (not absolute `floorHz`).** Replace
   `floorHz:1000` with a `baselineCase` (a cold `loadAnimationEngine()` first-resolve arm) +
   `floorFraction` — so the warmEngine win is measured as a fraction of its own cold baseline
   (device-independent), with the absolute sub-1ms magnitude kept as an observe-only note.

**Gate bite.** The budgeted clause (`proof-bench-taxonomy.mjs:282-331`) splits: the ratio
predicate reds HARD on inversion; the absolute-magnitude predicate stays observe-only.
**Born-RED witness:** a planted regression — temporarily swap `numeric.ts`'s `lerpArray`
back to a per-channel loop (the S2 revert lane-29 names) — makes the SoA ratio < 1.0 and the
HARD arm REDS (today it would NOTE-and-pass under the blanket observe-only). GREEN when the
ratio arm is HARD and the un-regressed tree holds ratio ≥ floorFraction. **This is the
inv-M-observable-truth fix for the budgeted apparatus:** the gate bites the REAL regression
(ratio inversion) instead of noting it past.

---

### S6 — the L.W7.md doc correction (the mis-attribution, lane-29 §5)

**Breach.** `L.W7.md:24` cites value.js's G-era "1.56× at K=2 → 4.25× at K=64" as "the J.W6
S2 SoA bench arm, measured" — a kf-side claim that is actually value.js's
`numeric-soa.mjs` number (`G/audit/a-valuejs-leverage.md:173`). Recurs at `L.W7.md:450,451`.
The kf-side number is 16.6× at K=8 (`J.W6-impl.md:327`).

**Deliverable.** Correct the three L.W7.md sites to cite the kf-side **16.6× at K=8
full-pipeline** as the kf measurement, and label "1.56×–4.25× at K=2–K=64" as value.js's
OWN `bench/numeric-soa.mjs` provenance number (the small-K internal `lerpArray`-vs-scalar
microbench, distinct from the kf full-pipeline benchmark). The correction is a documentation
edit (RECORD-ONLY per lane-29 §5 — "no code precept violation"); it carries an inv-ε note that
the two numbers measure different things and neither contradicts the other. This is the lane-29
§5 obligation: the honest perf number, attributed to its real source.

**Gate bite.** No gate (a doc edit). The falsifiable check is that after S6 NO L.W7.md line
attributes a value.js-sourced number to a kf-side bench arm — a grep
(`grep -n "J.W6 S2.*1.56\|1.56.*J.W6 S2" docs/tranches/L/waves/L.W7.md` → empty). The
correction also lands in `PROGRESS.md`'s honest-numbers table.

---

### S7 — the value.js color-math co-bench DISPATCH (VJ.L1–L8 cross-repo, acyclic spine)

**Breach.** VJ.L1–L8 (the value.js color-math zero-alloc rewrites — lane-30 §2.1) are
dispatched in `KF-TO-VALUEJS-O-ASKS.md §7` and enumerated in `taxonomy.json` `crossRepo[]`
(8 ids, verified). `proof:bench-taxonomy`'s cross-repo clause (`proof-bench-taxonomy.mjs:123-168`)
asserts the dispatch is INTACT (every VJ.L# present in the doc + the manifest). M must
confirm the dispatch survives the M constellation work AND add the kf-side validation
instrument (S2's densify arm) as the consume-edge oracle.

**Deliverable.** TWO acyclic-spine moves (NO kf code change — the cures are value.js's,
inv-L-acyclic-purity / lane-30 §2.4):

1. **Confirm + extend the dispatch.** Verify `KF-TO-VALUEJS-O-ASKS.md §7` still names
   VJ.L1–L8 (the `proof:bench-taxonomy` cross-repo clause already asserts this). Add the
   lane-30 §7 NEW M-surfaced ask **VJ.O.DIRECT-OKLCH-OKLAB** (the `oklch↔oklab` DIRECT_PATH
   that eliminates 6 Vec3 allocs per conversion on the oklch-ramp hot path — the highest-value
   single addition for S2's densify arm). The co-bench ask requests value.js author
   `bench/color-math.bench.ts` (its OWN suite, over `transformMat3`/`oklab2xyz`/`mixColors`/
   `gamutMapToRgbSpace`/`sampleColorRamp`) with budgeted alloc-drop arms.
2. **Wire the kf-side validation edge.** S2's `bench/color-interp.bench.ts` densify arm IS
   the kf-side instrument that validates the consume edge: on value.js O 0.14.0 re-pin (M.W9),
   re-run it and confirm the densify hz improves ≥1.5× (lane-30 §5 M-PERF-3). The
   `crossRepo[]` VJ.L# entries graduate from `cross-repo` toward `budgeted` ONLY after the
   re-pin + the kf-side improvement is measured. This graduation is M.W9's consume, NOT this
   wave's DONE.

**Gate bite.** The cross-repo clause (`proof-bench-taxonomy.mjs:143-160`) reds if any VJ.L#
is dropped from the dispatch doc or the manifest — the §Bite lane-29 names: "silently
dropping the VJ.L1–L8 asks … the color-math frontier becomes untracked." **Born-RED is NOT
this clause** (it is GREEN today — the dispatch is intact); the cross-repo arm's role is the
regression-guard that the frontier STAYS tracked through the M constellation churn. The
new VJ.O.DIRECT-OKLCH-OKLAB ask is added to the doc + (optionally) the `crossRepo[]` as a 9th
tracked id.

---

## Born-RED gate

**Gate:** `proof:bench-taxonomy` (EXTENDED — S1/S2/S3/S5/S7 arms) + `proof:scheduler-posttask`
(RE-TARGETED — S4 real-browser arm). The wave's DONE is the EXTENDED gates biting RED on the
real observables on today's tree, before any bench/decision artifact exists.

### The REAL observable per arm (inv-M-observable-truth — each bites the genuine breach, not a proxy)

| Arm | The REAL observable the gate bites | Born-RED witness on today's tree |
|-----|-------------------------------------|----------------------------------|
| S1 numeric-SoA | `proof:bench-taxonomy` coverage clause: a classified `numeric-soa` case absent from the bench report | `bench/numeric-soa.bench.ts` ENOENT (verified) → manifest names cases the report cannot contain → coverage clause reds (`proof-bench-taxonomy.mjs:245-253`) |
| S2 color-interp | coverage clause: the PLAY + densify-COMPILE color cases un-reported | `bench/color-interp.bench.ts` ENOENT (verified) → same coverage red |
| S3 sync-step wired | coverage clause: the 4 sync-step cases reported-but-un-classified | add `sync-step` to `suites` (today absent — `taxonomy.json:suites` verified) → 4 cases reported, 0 classified → `:234-240` reds |
| S4 postTask | the INP delta of `postTask("background")` vs bare `void loadAnimationEngine()`, measured in a REAL browser | `scripts/scheduler-posttask-decision.json` ENOENT + the jsdom-SKIP no longer counts GREEN → the real measurement has never run → RED (the L.W1 S4 proxy failure cured) |
| S5 budgeted-floor | a budgeted ARM's ratio INVERSION (SoA slower than per-channel) reds HARD | plant the `numeric.ts` per-channel revert → SoA ratio < 1.0 → today NOTES-and-passes (blanket observe-only); after S5 the HARD ratio arm REDS |
| S7 cross-repo | a VJ.L# dropped from `KF-TO-VALUEJS-O-ASKS.md` or `crossRepo[]` → frontier untracked | (regression-guard — GREEN today; reds the moment a VJ.L# is silently dropped) |

### Why each born-RED is the genuine defect, not a stand-in

- **S4 is the keystone** (inv-M-observable-truth): the current gate is GREEN-by-SKIP — a
  proxy that asserts "the probe didn't error in an env that lacks the API." The real observable
  is the INP delta in a real browser, which the SKIP NEVER measured. M.W12's re-target makes the
  born-RED witness the ABSENCE of a real measurement — exactly the L.W1 S4 lesson (the gate
  tested a no-throw proxy and missed the NaN breach; this gate tested a SKIP proxy and missed
  the un-measured INP).
- **S5 bites the REAL regression** (a ratio inversion), not a wall-clock number that the
  observe-only blanket lets pass. The device-INDEPENDENT ratio is HARD; only the absolute
  magnitude stays observe-only — so a genuine SoA/spring-vector regression REDS instead of
  noting past.
- **S1/S2/S3 bite via the coverage clause** — a real bench case that exists in the manifest
  but not the report (S1/S2) or in the report but not the manifest (S3). The gate CANNOT be
  gamed by a stub: it runs `vitest bench` and asserts the real cases report finite hz
  (`proof-bench-taxonomy.mjs:266-279`).

### Today's tree result

`npm run proof:bench-taxonomy` is GREEN today (the 5-suite manifest is internally consistent).
After S1/S2/S3 wiring it is born-RED until the two suites exist + the sync-step cases are
classified. `npm run proof:scheduler-posttask` is GREEN-by-SKIP today; after S4 re-target it is
born-RED until the real-browser decision JSON records ADOPT-or-KILL. The wave's DONE is these
RED witnesses standing on today's tree — the cure (the bench authorship + the measurement run)
opens on authorization.

---

## Deps

| Dep | For | Status |
|-----|-----|--------|
| value.js 0.13.0 (already pinned) | S1/S2/S3/S5/S6 — the kf-side instruments | INSTALLED — `NumericAnimation.at`/`interpFrames`/`compileToCSS` all run against it; NO sibling publish needed |
| Playwright-core / M.W3 shared browser | S4 — the real-browser INP arm | `bench/playwright.bench.ts` + `proof:computed-real-dom` are the browser-gated precedent; M.W3's warm chromium is the eventual home (composes, not required) |
| value.js O 0.14.0 (VJ.L1–L8 + VJ.O.DIRECT-OKLCH-OKLAB) | S7 — the cross-repo co-bench GREEN flip + S2's densify-arm graduation | NOT published. The DISPATCH (S7 move 1) needs no publish; the consume-edge graduation is M.W9's, gated on the publish |
| M.W6 (densify oklch fidelity) | S2's densify-COMPILE-leg arm shares `densifyKey`'s surface | parallel Band-B wave; S2 benches the densify path M.W6 corrects — the bench is the perf instrument, M.W6 is the correctness cure (orthogonal, no collision) |

- **This wave needs NO sibling publish to land.** Every S-clause is a kf-side measurement
  instrument or a doc correction. S4 measures kf's OWN `warmEngine`/`loadAnimationEngine` in a
  real browser; S7's dispatch confirmation is a doc + manifest assertion. The value.js O
  consume (the densify graduation, the co-bench GREEN) is M.W9's, gated on the publish.
- **Composes with M.W1 (does NOT require it).** Once M.W1's report-all runner lands, the
  extended `proof:bench-taxonomy` and re-targeted `proof:scheduler-posttask` are nodes the
  orchestrator surfaces in one parallel pass. On today's serial tree they are in the
  `proof:all` report-all roster.
- **Parallel with M.W13 (no file collision).** M.W13 lifts the engine/playback seam
  (`engine.ts`/`group.ts`); M.W12 touches `bench/*` + `scripts/proof-bench-taxonomy.mjs` +
  `scripts/proof-scheduler-posttask.mjs` + `bench/taxonomy.json` + `L.W7.md`/`PROGRESS.md`.

---

## Bite — what regression each clause catches

| S-clause | Regression the gate catches |
|----------|------------------------------|
| S1 (numeric-SoA bench) | A revert of `numeric.ts`'s SoA path to a per-channel `lerp` loop ships unmeasured — the LIGHT-tier SoA win regresses with no kf-side throughput record (today only the `Float64Array` sentinel guards it; the absolute hz is un-benched) |
| S2 (color-interp bench) | value.js O's VJ.L1–L8 zero-alloc rewrite lands with NO kf-side before/after instrument — the consume edge is un-validatable; OR a color-path regression in `interpFrames`/densify ships unmeasured (no color bench exists today) |
| S3 (sync-step wired) | The J.W6 loop-core sync fast-path regresses to the per-frame promise loop and `proof:bench-taxonomy` stays GREEN (the 4 cases are outside the coverage floor today — `sync-step` absent from `suites`) |
| S4 (postTask real-browser) | The postTask adoption is decided on a jsdom SKIP that never measured INP — a `postTask("background")` that REGRESSES the gesture's first frame ships under a false-GREEN proxy (the exact inv-M-observable-truth failure); OR the KILL stands on an unmeasured budget claim |
| S5 (budgeted-floor HARD ratio) | A 2× SoA / spring-vector throughput REGRESSION (ratio inversion) NOTES-and-passes under the blanket observe-only posture — the budgeted floor that was the whole point of `proof:bench-taxonomy` never reds; OR the warmEngine absolute `floorHz:1000` drifts un-tracked to any baseline |
| S6 (doc correction) | The L.W7.md mis-attribution propagates value.js's G-era "1.56×–4.25×" as a kf-measured number into the 5.0.0 changelog / FINAL — an inv-ε overclaim that survives because no gate reads prose |
| S7 (cross-repo dispatch) | A VJ.L# is silently dropped from `KF-TO-VALUEJS-O-ASKS.md`/`crossRepo[]` during M constellation churn — the color-math alloc frontier becomes UNTRACKED (the `proof:bench-taxonomy` cross-repo clause is the only guard); OR the VJ.O.DIRECT-OKLCH-OKLAB highest-value ask is never filed |

---

## Excluded from this wave

- **The value.js O 0.14.0 color-math consume + the densify-arm graduation to `budgeted`** —
  that is M.W9 (the value.js O consume) + the re-pin. This wave authors the kf-side validation
  instrument (S2) and confirms the dispatch (S7); the GREEN flip / graduation lands on the
  value.js O publish.
- **The EPF-1 batch-reads-first cure** (lane-29 Gap 4 / lane-30 §1.7 M-PERF-2) — the
  `proof:epf1-measure` baseline is RECORDED (`scripts/epf1-baseline.json`, thrash = 2N-1
  confirmed); the cure (read-phase/write-phase separation, or the value.js `prefetchComputedValues`
  ask VJ.O.EPF-1) is a SEPARATE disposition: a kf `ingest-cssom.ts` cure OR a value.js O ask,
  tracked in `PROGRESS.md §"Open deferrals"` (DL-M-P2). M.W12 does NOT ship the EPF-1 cure;
  it is observe-only with the baseline recorded, the cure decision deferred per lane-30 §5 M-PERF-2.
- **The `lerpArray` inline deletion** (lane-30 §5 M-PERF-4 / §14 `./math` subpath) — gated on
  value.js O publishing a tree-shakeable `./math` subpath; the consume is M.W9's atomic
  workaround-deletion, NOT this perf wave.
- **WASM SIMD / WebGPU color compute** — KILL re-affirmed (lane-30 §3.1: the limiter is DOM
  write pressure, not the lerp arithmetic; a compute pass that ends in N style writes has MORE
  overhead). No bench, no ask.
- **The engine-seam transposition** (engine.ts 1397→~900) — that is M.W13 (gated on value.js
  VJ-L1 flatLeaf). M.W12 is measurement-only; M.W13 is the structural lift.
