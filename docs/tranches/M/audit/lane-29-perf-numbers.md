# Lane 29 — Perf Numbers

**Tranche M audit lane · charter seed**

---

## Verdict

The L perf surface is **in good shape but contains several structural gaps**: the
budgeted bench gate (`proof:bench-taxonomy`) enforces only ONE throughput floor at
the HEAVY-SoA tier; the LIGHT-tier `NumericAnimation` SoA win is asserted by a
zero-alloc sentinel but carries no throughput budget; the spring-vector ADOPT is
measured and recorded but its floor is not in the taxonomy manifest; the
`warmEngine` floor is budgeted against an absolute `floorHz: 1000` (not a ratio);
the value.js color-math hot paths (VJ.L1–L8) are entirely un-measured kf-side with
only cross-repo `taxonomy.json` stubs; and EPF-1 is observe-only with a raw
thrash-count baseline but no cure shipped. The un-measured color-math is the
largest gap: every oklab playback frame pays per-call alloc in
`transformMat3`/`oklab2xyz`/`mixColors`/`gamutMapToRgbSpace` and kf has no bench
for it. None of this is a precept violation in the L-as-built surface — each gap
is either a dispatched cross-repo ask or an explicitly noted observe-only — but M
must decide whether the color-math co-bench belongs as a kf-side measurement or
remains a pure value.js-O dispatch.

---

## 1. The bench roster — what exists, what each measures

### 1a. Suites in `bench/taxonomy.json` (the five taxonomy-covered suites)

| Suite | Cases | Category mix |
|---|---|---|
| `bench/interpolation.bench.ts` | 6 | 6 run-check |
| `bench/parser.bench.ts` | 10 | 8 run-check · 1 observe-only · 1 run-check |
| `bench/interp-buffer.bench.ts` | 12 | 5 run-check · 6 observe-only · 1 budgeted (warmEngine) |
| `bench/compile.bench.ts` | 9 | 5 run-check · 4 observe-only |
| `bench/spring-tick.bench.ts` | 6 | 4 run-check · 1 observe-only · 1 budgeted (spring-vector) |

The lerpArray SoA K=8 FULL-PIPELINE arm is `observe-only` (not `budgeted`): the
taxonomy entry at `bench/taxonomy.json:144-155` marks the SoA arm `budgeted` with
`floorFraction: 1.2` relative to the per-channel baseline. **Verified: the SoA K=8
arm IS `budgeted` in the current manifest.** The baseline case and floor fraction
are correct.

### 1b. Suites covered by `proof:bench-runs` but NOT in taxonomy

`proof-bench-runs.mjs:46-53` lists six suites; the taxonomy manifest names only
five. The absent suite is **`bench/sync-step.bench.ts`** — the `RAFPlayback`
loop-core dispatch bench (FB-2 measurement instrument; J.W6 S1). Its cases
(drive(SmoothProgress), drive(SpringProgress), play(Animation·K=8),
play(AnimationGroup·32cells)) are exercised by `proof:bench-runs` as a run-check
but are NOT covered by the taxonomy manifest's `cases` array. This means:

- `proof:bench-taxonomy` runs only its declared suites — `sync-step.bench.ts`
  is not in `manifest.suites` and so is not classified.
- The `proof:bench-runs` gate covers it as a run-check (exit 0 + finite hz), but
  there is no taxonomy classification (no `run-check` entry in the manifest for
  any sync-step case).

**This is a taxonomy coverage gap:** `proof:bench-taxonomy` claims "every case in
every suite is covered by the manifest (no orphan case silently un-classified)"
but `sync-step.bench.ts` is outside the manifest's `suites` array entirely.
Whether the gate's coverage assertion extends to suites NOT in its manifest
depends on the script's implementation — but the design intent is that the
manifest covers all five declared suites, and `sync-step` is not among them.
`bench/playwright.bench.ts` and `bench/computed-real-dom.bench.ts` are
legitimately excluded (browser-gated); `sync-step.bench.ts` has no such
justification.

### 1c. The SoA lerpArray numbers — source verification

The "1.56× at K=2 → 4.25× at K=64" claim in `L.W7.md:24` originates from the
**Tranche G audit** (`docs/tranches/G/audit/a-valuejs-leverage.md:173`), citing
value.js's own `bench/numeric-soa.mjs`. It is NOT from the kf-side bench. The
kf-side J.W6 measurement (the authoritative one) is:

- K=8 full-pipeline: `10,772.56 hz` (per-channel) vs `179,142.05 hz` (SoA) =
  **16.6× = 94.0% reduction** (`docs/tranches/J/waves/J.W6-impl.md:298/327`).
- K=10 corroborator: 20.3×.
- K=8 dispatch-only: 14.6×.

The G-era "1.56×–4.25×" numbers are value.js's own microbench at small K, NOT
the kf-side full-pipeline result. L.W7.md:24 accurately says they are the "HEAVY
tier" adoption measurements — but they are not kf-measured numbers; they are the
value.js side numbers cited as provenance. The kf J.W6 measurement (16.6× at K=8)
supersedes them as the kf-side oracle.

### 1d. The spring-vector ADOPT number

`scripts/spring-vector-decision.json` records:
```json
{
  "vectorHz": 51007.189393746696,
  "scalarHz": 13233.333595786451,
  "ratio": 3.854447484796091,
  "verdict": "ADOPT",
  "recordedAt": "2026-06-17T12:49:26.814Z"
}
```
The 3.85× ratio at K=8 (threshold 1.2×) is the observed oracle. L.W7.md cited
"2.97–3.78×" as the measured range — the recorded number (3.85×) is consistent
with that range (the run-to-run variance explains the difference). The ADOPT
verdict is correct.

### 1e. The warmEngine budget

`bench/taxonomy.json:258-262` sets `"floorHz": 1000` — an absolute wall-clock
floor (1000 hz = sub-1ms per resolve). This is an ABSOLUTE floor, not a
ratio-relative floor. The L.W7.md §S6 comment (`taxonomy.json:260`) notes: "a
memoized microtask resolve is far under 1ms on any runner." This is the one
`budgeted` arm with an absolute floor rather than a baselineCase ratio. It is
`observe-only` in CI (the `declarePosture("observe-only")` in the taxonomy
script), HARD locally.

### 1f. EPF-1 baseline

`scripts/epf1-baseline.json` records:
- N=10: `layoutThrashCount: 19`, 10 reads + 10 writes
- N=50: `layoutThrashCount: 99`, 50 reads + 50 writes  
- N=100: `layoutThrashCount: 199`, 100 reads + 100 writes

The thrash count is linear in N: `layoutThrashCount = 2N - 1`. This confirms the
un-batched interleaved pattern: each element does a read then a write, producing
2 phase-boundaries per element minus 1 for the final write. A batch-reads-first
cure would drop to 1 boundary total (one READ phase, one WRITE phase). **The
cure is not shipped; the baseline is observe-only.** `ingest-cssom.ts` still has
no read/write phase separation.

---

## 2. What is budgeted vs run-check vs cross-repo

### Budgeted (actual throughput floor)

| Case | Suite | Floor type | Floor value |
|---|---|---|---|
| SoA K=8 full-pipeline (`bench/interp-buffer.bench.ts`) | interp-buffer | ratio | `baseline × 1.2` (the per-channel baseline case's hz × 1.2) |
| spring-vector K=8 (`bench/spring-tick.bench.ts`) | spring-tick | ratio | `baseline × 1.2` (scalar K=8 hz × 1.2) |
| warmEngine pre-resolve (`bench/interp-buffer.bench.ts`) | interp-buffer | absolute | `floorHz: 1000` |

The FIRST budgeted arm (`proof:bench-taxonomy`) has a relative ratio floor that
tracks the runner; the warmEngine arm has a device-independent absolute floor
(1ms). Both carry `observe-only` CI posture (never red on the slow Linux runner).

### Run-check only (finite positive hz; no budget)

All compilation benches (5 cold-compile cases at 2/6/11/50/200 stops), all basic
interpolation benches (2-frame opacity, multi-property, 11-stop complex), all
parser benches (simple 2-stop cold, complex 11-stop cold, realistic corpus, bare
parseCSSValue), all spring-tick regime benches (underdamped/critically/overdamped
+ live re-seat), all interp-buffer threaded benches (K=2/K=5/K=12), and the
calc() leaf bench. These 24+ cases run and emit positive hz but a 2× regression
is NOT caught.

### Observe-only (recorded; no floor; re-run sets new baseline)

- K=8 per-channel _lerp baseline (`interp-buffer`) — the DECISION arm's baseline
- K=10 full-pipeline pair (`interp-buffer`)
- K=8/K=10 dispatch-only pair (`interp-buffer`)
- scalar K=8 spring baseline (`spring-tick`) — the spring-vector baseline
- compile latency map (N=50/200 value.js parse vs fromString)
- cache-buster shape (unique value per iteration)

### Cross-repo (not run in kf CI; dispatched as asks to value.js Tranche O)

VJ.L1–VJ.L8, all in `bench/taxonomy.json:264-313`:
- VJ.L1: `transformMat3` zero-alloc 3×3 MVM (`value.js/src/units/color/matrix.ts:19-27`)
- VJ.L2: `oklab2xyz` scratch-buffer Vec3 intermediates (`conversions/oklab.ts:28`)
- VJ.L3: `xyz2oklab` scratch-buffer Vec3 intermediates (`conversions/oklab.ts:57`)
- VJ.L4: `mixColors` per-space scratch buffer, drop `keys().filter()` closure (`color/dispatch.ts:391`)
- VJ.L5: `gamutMapToRgbSpace` scalar probe, no per-iteration Color alloc (`color/dispatch.ts:223`)
- VJ.L6: `normalizeColor` indexed channel write, drop forEach closure (`normalize.ts:34`)
- VJ.L7: `memoize` Infinity fast-path + DIRECT_PATHS expansion (`color/dispatch.ts`)
- VJ.L8: intra-bucket dispatch refinement + scale() constant-range fast paths

These are the most architecturally significant perf gaps in the engine's hot path
(every oklab playback frame pays VJ.L1–L4 allocs) but kf cannot measure them —
they are value.js internals. The cross-repo dispatch is the correct home; the
taxonomy correctly marks them `cross-repo`.

---

## 3. Gaps

### Gap 1 — `bench/sync-step.bench.ts` absent from taxonomy manifest

`bench/sync-step.bench.ts` is covered by `proof:bench-runs` (in its `SUITES`
list) but is NOT in `bench/taxonomy.json`'s `suites` array. Its cases are:
- `drive(SmoothProgress) · 600-frame window`
- `drive(SpringProgress) · 600-frame window`
- `play(Animation · K=8 transform) · 600-frame window`
- `play(AnimationGroup · 32 cells · K=8) · 600-frame window`

These four cases have no taxonomy classification. Whether the taxonomy gate
requires ALL `proof:bench-runs` suites to be in the manifest, or only the five it
declares, depends on the gate's self-definition. The gap is that a bench measuring
the `RAFPlayback` loop-core dispatch cost — the same measurement the J.W6 S1
FB-2 decision was based on — has no budgeted arm and no taxonomy coverage.

**M obligation**: add `bench/sync-step.bench.ts` to the taxonomy manifest with
appropriate classifications (the `play(Animation·K=8)` and `play(Group·32cells)`
arms are CANDIDATES for `observe-only`; the loop-core dispatch arms are candidates
for `run-check`).

### Gap 2 — NumericAnimation SoA throughput un-budgeted

The `proof:zero-alloc` LIGHT-tier extension (L.W7 S2) asserts that
`NumericAnimation` segment buffers are `Float64Array` (the sentinel check at
`test/zero-alloc.test.ts:181-182`) and that `lerpArray` is called (reference
stability check). But there is NO throughput budget for `NumericAnimation.at()`.
The taxonomy manifest has no `NumericAnimation` bench arm at all — neither in
`bench/interpolation.bench.ts` (which uses `interpFrames` on `CSSKeyframesAnimation`)
nor in any other suite. The `lerpArray` win for `NumericAnimation` is structurally
analogous to the J.W6 SoA win (typed-array loop vs per-channel scalar dispatch),
but it is un-measured on the kf side post-L. The G-era "1.56×–4.25×" numbers are
value.js's own microbench, not a kf-side `NumericAnimation.at()` measurement.

**This is the factual error in the L-as-built documentation:** `L.W7.md:24`
claims the SoA arm was "measured 1.56× at K=2 → 4.25× at K=64" — these numbers
are from the G-era value.js `numeric-soa.mjs` bench, NOT from any kf-side bench
of `NumericAnimation.at()`. The kf-side J.W6 number (16.6× at K=8 on the HEAVY
`CSSKeyframesAnimation` pipeline) is the authoritative kf measurement but it is
for the HEAVY path, not `NumericAnimation`. No kf-side `NumericAnimation.at()`
bench exists.

**M obligation**: author a `NumericAnimation.at()` bench arm at K∈{2,5,12} (the
same K-ladder as `interp-buffer.bench.ts`) and add it to the taxonomy manifest as
`observe-only` (or `budgeted` if the win is confirmed). The gate:
`proof:zero-alloc` asserts the structural property (Float64Array sentinel); the
bench asserts the throughput win.

### Gap 3 — value.js color-math: un-measured, cross-repo dispatch not yet consumed

VJ.L1–L8 are in `bench/taxonomy.json` as `cross-repo` entries, dispatched to
`KF-TO-VALUEJS-O-ASKS.md §7`. Value.js 0.13.0 did NOT include these zero-alloc
rewrites (the current published version). The dispatch is correct and the taxonomy
correctly marks them as cross-repo. However:

- No kf-side bench exercises the oklab path's alloc count. `proof:color-fidelity`
  and `proof:compile-replay` exercise correctness, not allocation.
- Every animation frame that interpolates a color-valued property
  (`background-color`, `color`, `border-color`) routes through
  `lerpComputedValue` → value.js `mixColors` → `oklab2xyz` → `transformMat3`,
  paying VJ.L1–L4 per frame. This is the dominant alloc hot-path for color
  animations.
- The kf-side `bench/interpolation.bench.ts` benches opacity + transforms (no
  color interpolation), so the color path is entirely un-benched.

**M obligation** (cross-repo): the VJ.L1–L8 dispatch stands. The M question is
whether kf should author an integration bench (`bench/color-interp.bench.ts`) that
exercises `fromString("from{background-color:red}to{background-color:blue}").interpFrames(500,false)`
at K=1 color stop and measures the throughput. This gives kf a device-independent
baseline against which value.js-O's zero-alloc rewrites can be validated by
comparing the post-repin bench hz. This is NOT a kf-internal fix (kf cannot change
value.js internals) but it IS a kf-side measurement instrument for the value.js
cross-repo ask — the taxonomy's "cross-repo" category is "the case targets a
SIBLING; EXCLUDED from kf CI; asserted PRESENT in the dispatch doc." A kf-side
integration bench for color throughput would be categorized `observe-only` (not
`cross-repo`) — it measures kf's own `interpFrames` with a color corpus.

### Gap 4 — EPF-1 cure un-shipped; O(N) thrash confirmed

`scripts/epf1-baseline.json` records `layoutThrashCount: 2N-1` for all three N
values (10/50/100), confirming the interleaved pattern in `ingest-cssom.ts`. The
cure is `batch-reads-first/batch-writes-second`. The cure is NOT shipped. The gate
is `observe-only` (exits 0 regardless of the count). No M wave is needed to ship
the cure, but M should decide:

1. Whether the `proof:epf1-measure` baseline is sufficient evidence to authorize
   the batch-reads-first cure in M.W? (The answer is yes: 199 phase-boundaries at
   N=100 with 100 reads + 100 writes is the measured evidence the cure requires.)
2. Whether the cure belongs in an M wave targeting `ingest-cssom.ts` or is a
   Band-B handoff dependent on a larger ingest refactor.

`ingest-cssom.ts` is the K.W8 surface (+617 LOC). `flip.ts:119` has the correct
batched read-mutate-read pattern as a reference. The cure is a mechanical
read-phase / write-phase separation, not an architectural change.

### Gap 5 — `scheduler.postTask` adoption deferred, probe SKIPs in jsdom

`proof:scheduler-posttask` is green because the probe SKIPs when `scheduler.postTask`
is absent in the jsdom environment — but the skip is not a win. The adoption
of `postTask("background")` in `warmEngine()` is deferred because NO measured win
was observed (the probe environment does not have `scheduler.postTask`). This is
correct discipline. The gap: there is no Playwright-driven measurement of
`warmEngine()` + `postTask("background")` in a real browser. M's perf wave could
include a Playwright bench that measures whether wrapping `loadAnimationEngine()` in
`scheduler.postTask("background", ...)` on idle produces a measurable INP reduction
vs the current `void loadAnimationEngine()` bare fire-and-forget.

---

## 4. SOTA assessment

### What is demonstrably SOTA

- **Heavy SoA interp (J.W6):** 16.6× faster at K=8 full-pipeline; 14.6× dispatch-only.
  The `CSSKeyframesAnimation.interpFrames` path is the fastest it can be for numeric
  channels (one fused `lerpArray` over packed `Float64Array` segments).
- **Light NumericAnimation SoA (L.W7 S2):** segment buffers are `Float64Array`;
  `lerpArray` from `leaves.ts` (inlined, value.js-free). Zero-alloc gate (sentinel)
  green. Throughput un-measured kf-side (Gap 2).
- **SpringProgress vector (L.W7 S2):** `setTargets(Float64Array)` ships; 3.85×
  at K=8 measured and recorded (`spring-vector-decision.json`).
- **warmEngine/granular accessors (L.W7 S1/S3):** `warmEngine()` + `loadEngine()` /
  `loadCompiler()` / `loadIngest()` all ship; `proof:boundary` green (zero static
  value.js edge on the barrel); warmEngine floor `floorHz: 1000` budgeted.
- **sync-step zero-promise-loop (J.W6 S1/FB-2):** microtask turns/frame
  `1.998→0` (Animation·K=8) and `4.993→0` (Group·32cells) = −100%.
  `proof:sync-step` green.
- **C1 computed endpoint memo (G.W2):** `calc()` leaf bench runs; the −94% reflow
  reduction is a value.js-0.11.0 rephrase in the `_computedCache` (the steady-window
  bench measures post-memo).

### What is un-measured or un-budgeted

- **NumericAnimation.at() throughput** — no kf-side bench (Gap 2).
- **Color interpolation path** — no bench for `background-color` / `color` interp;
  value.js VJ.L1–L8 allocs paid on every color frame, un-measured kf-side (Gap 3).
- **`scheduler.postTask` priority for warmEngine** — no real-browser measurement
  (Gap 5).
- **EPF-1 batch-reads cure delta** — baseline measured (2N-1 thrash), cure un-shipped
  so the post-cure delta is zero (Gap 4).
- **`bench/sync-step.bench.ts` taxonomy** — no classification in the manifest (Gap 1).

---

## 5. Precept findings (L-as-built)

### ⚠ Factual overclaim in L.W7.md:24

`L.W7.md:24` states: "the J.W6 S2 SoA bench arm, measured 1.56× at K=2 → 4.25×
at K=64." This is an imported claim from the G-era value.js benchmark
(`docs/tranches/G/audit/a-valuejs-leverage.md:173`). The kf-side J.W6 measurement
is 16.6× at K=8 (full-pipeline), not 1.56×–4.25×. The two numbers are
not contradictory (the G numbers are for value.js's internal `lerpArray` vs scalar
on small K; the kf J.W6 number is the full-pipeline benchmark including segment
search + easing + merge), but the citation in L.W7.md names them as the "J.W6 S2
bench arm" measurement — which is incorrect. The actual J.W6 bench output is in
`docs/tranches/J/waves/J.W6-impl.md:297-302`. This is a documentation
inaccuracy, not a code defect.

Evidence: `docs/tranches/L/waves/L.W7.md:24` vs
`docs/tranches/J/waves/J.W6-impl.md:327` (16.6× is the kf-side number).

**No code precept violation.** The L-as-built implementation is correct; the
documentation conflates two different benchmarks. Classify as RECORD-ONLY, no
M-wave action required.

### No other precept violations found in the perf apparatus

- `proof:bench-taxonomy` is structurally sound; the cross-repo dispatch is
  correct; the budgeted arms use the correct device-honest relative-ratio floors.
- `proof:spring-vector` is the model MEASURE-FIRST gate: records ADOPT or KILL,
  no code ships without the measurement.
- `proof:zero-alloc` extension correctly uses a `Float64Array` sentinel (not a
  wall-clock budget) as the LIGHT-tier assertion — device-independent by
  construction.
- `proof:epf1-measure` is `observe-only` and exits 0 before the cure, correctly
  per inv-L-device-honesty.

---

## 6. M-wave proposals

### M.W? (perf) — close the un-measured gaps

**Deliverable.** Three orthogonal actions:

**P1 — NumericAnimation.at() bench arm (Gap 2).**
Add a `bench/numeric-soa.bench.ts` suite with cases at K∈{2,5,12,32} measuring
`NumericAnimation.at()` throughput over a 600-frame window. Add to
`bench/taxonomy.json` as `observe-only` cases (no floor until a measurement
confirms the win; if the win at K≥2 is ≥1.2× vs a pre-S2 baseline, promote to
`budgeted`). Cross-check: the G-era "1.56×" number at K=2 is the expected
minimum; the kf-side measurement will confirm or falsify it.

**P2 — Color interpolation integration bench (Gap 3).**
Add cases to `bench/interpolation.bench.ts` (or a new `bench/color-interp.bench.ts`)
exercising `fromString("from{background-color:oklch(0%_0_0)}to{background-color:oklch(100%_0_0)}").interpFrames(500,false)`
at K=1 color stop, categorized `observe-only`. This establishes the kf-side
baseline against which value.js-O's VJ.L1–L8 zero-alloc rewrites can be validated
post-repin. Not a cross-repo ask — this is a kf-side measurement of kf's own
`interpFrames`.

**P3 — `bench/sync-step.bench.ts` taxonomy coverage (Gap 1).**
Add `bench/sync-step.bench.ts` to `bench/taxonomy.json`'s `suites` array; classify
the four existing cases as `run-check`. This closes the coverage gap between
`proof:bench-runs` (which covers it) and `proof:bench-taxonomy` (which does not).

**P4 — EPF-1 batch-reads-first cure (Gap 4).**
The baseline is measured (2N-1 thrash confirmed). Ship the
`batch-reads-first / batch-writes-second` pass in `ingest-cssom.ts`. Update
`proof:epf1-measure` to assert `layoutThrashCount <= baseline.layoutThrashCount * 0.5`
when `EPF1_CURE=1`. The cure is a read-phase/write-phase mechanical separation
(reference: `flip.ts:119`).

**Gate bite.** `proof:bench-taxonomy` structural coverage clause catches any new
bench suite not in the manifest. P3 adds `sync-step` to the manifest; P1 adds the
new numeric-soa suite. P4 opens the 50%-reduction gate in `proof:epf1-measure`
when `EPF1_CURE=1`.

---

## 7. Deferred folds (chronic carry-forward)

| ID | Item | Status | Tripwire |
|---|---|---|---|
| DLL-30 | `scheduler.postTask` `"background"` adoption for `warmEngine` | probe SKIPs in jsdom; adoption deferred | Real-browser Playwright measurement showing INP benefit (Gap 5) |
| DLL-30 | EPF-1 read/write cure | baseline measured; cure un-shipped | `proof:epf1-measure` with `EPF1_CURE=1` gate (M.W? P4) |
| VJ.L1–L8 | value.js color-math zero-alloc (transformMat3/oklab2xyz/mixColors/gamutMapToRgbSpace) | cross-repo dispatch filed (`KF-TO-VALUEJS-O-ASKS.md §7`); un-consumed | value.js O (0.14.0) publish + kf re-pin + `proof:bench-taxonomy` cross-repo arm confirms dispatch intact |

---

## 8. Cross-repo asks

**To value.js Tranche O (0.14.0):**
- VJ.L1–L8 (the zero-alloc color hot-path rewrites). The M perf wave should
  verify the dispatch is still intact in `KF-TO-VALUEJS-O-ASKS.md` after any
  M constellation work.
- After value.js-O publishes, the kf-side color integration bench (M.W? P2) will
  serve as the validation instrument: re-run with the new value.js and confirm
  the throughput improves.

**No new cross-repo asks originate from this lane.** The existing VJ.L1–L8
dispatch is correctly filed and the `bench/taxonomy.json` cross-repo entries are
intact.

---

## Evidence anchors

| Claim | Evidence |
|---|---|
| lerpArray SoA K=8 full-pipeline 16.6× kf-measured | `docs/tranches/J/waves/J.W6-impl.md:297-327` |
| "1.56×–4.25×" is G-era value.js bench, not kf-measured | `docs/tranches/G/audit/a-valuejs-leverage.md:173` |
| spring-vector ADOPT 3.85× at K=8 recorded | `scripts/spring-vector-decision.json` |
| warmEngine/loadEngine/loadCompiler/loadIngest shipped | `src/animation/index.ts:230-234` |
| NumericAnimation `Float64Array` segments post-L | `src/animation/numeric.ts:145-150` |
| `lerpArray` inlined to `leaves.ts` (not imported from value.js) | `src/animation/internal/leaves.ts:68-80` |
| EPF-1 thrash = 2N-1 confirmed | `scripts/epf1-baseline.json` (N=10→19, N=50→99, N=100→199) |
| EPF-1 cure un-shipped | `src/animation/ingest-cssom.ts` (no batch-reads-first pass) |
| `bench/sync-step.bench.ts` absent from taxonomy `suites` | `bench/taxonomy.json:35-40` (lists 5 suites; sync-step absent) |
| `proof:bench-runs` covers sync-step | `scripts/proof-bench-runs.mjs:51` |
| VJ.L1–L8 cross-repo entries in taxonomy | `bench/taxonomy.json:264-313` |
| VJ.L1–L8 dispatched to value.js Tranche O | `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md §7` |
| SoA K=8 budgeted arm in taxonomy | `bench/taxonomy.json:148-155` |
| spring-vector K=8 budgeted arm in taxonomy | `bench/taxonomy.json:248-254` |
| warmEngine absolute floor 1000 hz | `bench/taxonomy.json:258-262` |
| zero-alloc sentinel checks Float64Array | `test/zero-alloc.test.ts:181-182` |
| No NumericAnimation.at() throughput bench | `bench/taxonomy.json` (no numeric-soa suite) |
| No color interpolation throughput bench | `bench/interpolation.bench.ts` (opacity + transforms only) |
