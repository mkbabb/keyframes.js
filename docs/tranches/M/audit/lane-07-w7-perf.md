# Lane 07 — L.W7 SOTA Performance audit (Tranche M seed)

**Branch:** `tranche-l-dev` (tip `529fcfd` WZ-close) · **Wave:** L.W7 (commit `d858044`) ·
**Lane:** 07 · **Date:** 2026-06-17

---

## §0 — EXECUTIVE VERDICT

L.W7 shipped its five S-clauses honestly and completely. Every performance claim
is backed by a measured, re-runnable oracle. The one architectural duplication
(lerpArray inlined to `internal/leaves.ts`) is correctly identified as a
FORCED workaround (not a design flaw) because value.js publishes NO `./math`
subpath in its `exports` map — CONFIRMED by ground-truth inspection of the
installed package. The scheduler.postTask deferred path is correctly held at
measure-first; it SKIPS in jsdom and does NOT claim a positive measurement.
EPF-1 has a recorded baseline (O(N) layout thrash pattern confirmed) but NO
cure shipped — the gate is `observe-only`, which is the honest posture.

M owes: (1) value.js Tranche O to land the `./math` subpath so the inline can
be deleted; (2) a real-browser postTask measurement (Playwright) before
`warmEngine` adopts `postTask("background")`; (3) the EPF-1 cure in
`ingest-cssom.ts` (batched reads-first/writes-second) once M's ingest wave
warrants it. These are NAMED, gated, and deferred correctly.

---

## §1 — CLAIMS VERIFIED AGAINST GROUND TRUTH

### 1.1 — lerpArray INLINED to `internal/leaves.ts`

**Claim (FINAL.md:180–182):** "`lerpArray` was inlined to `leaves.ts` on the
LIGHT tier (value.js has no math subpath to consume)."

**Verification:**

1. `src/animation/internal/leaves.ts:68–80` — `lerpArray` is present, 12 lines,
   identical semantics to value.js's `src/math.ts:60` copy. The header comment
   at `leaves.ts:55–63` explicitly states the reason: "value.js exposes ONLY its
   barrel export — no tree-shakeable `./math` subpath."

2. `node_modules/@mkbabb/value.js/package.json` exports field:
   ```json
   "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/value.js" } }
   ```
   There is NO `"./math"` key. The `dist/math.d.ts` file EXISTS on disk but is
   NOT mapped by any `exports` entry — it is unreachable by `import …
   from "@mkbabb/value.js/math"` under `moduleResolution: bundler`.

3. `dist/value.js` barrel exports `lerpArray` as `ee as lerpArray` (line ~5002
   of the minified bundle). A static `import { lerpArray } from "@mkbabb/value.js"`
   would pull the entire CSS grammar into the LIGHT bundle, breaking
   `proof:boundary`'s source-grep assertion (assertion-4 bans any static
   value.js specifier in a light module — `scripts/proof-boundary.mjs`).

**Verdict:** The inline is CORRECT and FORCED, not a design smell. The KF-TO-
VALUEJS-O-ASKS.md §14 (`docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md:556–584`)
names ask W-MATH-SUBPATH: value.js to add a `"./math"` subpath exposing
`lerpArray`/`lerp`/`clamp` with zero CSS-grammar edge. On that publish, kf's
inline DELETES and imports the kernel. The workaround is properly tripwired.

**Duplication smell assessment:** The duplication is minimal (12 LOC, pure
math, byte-equivalent to value.js), justified by the static-edge constraint,
and explicitly noted as temporary pending the subpath. Not a precept violation.

### 1.2 — NumericAnimation Float64Array + lerpArray consume (S2)

**Claim (FINAL.md:180):** "the NumericAnimation/SpringProgress interp paths are
zero-alloc."

**Verification:**

1. `src/animation/numeric.ts:4` — `import { clamp, lerpArray, scale } from
   "./internal/leaves"`. The LIGHT-tier `lerpArray` is consumed here.

2. `src/animation/numeric.ts:145–151` — `buildSegment()` packs `from` and `to`
   as `new Float64Array(keys.length)` (not the pre-L `number[]` the wave spec
   called out at `numeric.ts:138-143`).

3. `src/animation/numeric.ts:201` — `.at()` calls `lerpArray(seg.from, seg.to,
   eased, _out)` — one fused loop instead of K scalar `lerp` calls.

4. `src/animation/numeric.ts:25` — module-scope `let _out = new Float64Array(0)`
   — the stable scratch buffer, grown lazily, never shrunk.

5. `test/zero-alloc.test.ts:168–183` — `Float64Array` sentinel assertion:
   `expect(seg.from).toBeInstanceOf(Float64Array)` and `expect(seg.to)
   .toBeInstanceOf(Float64Array)`. **Observed re-run: `npx vitest run
   test/zero-alloc.test.ts` → 7/7 passed.**

**Verdict:** CONFIRMED. The segment buffers are `Float64Array`; the
`lerpArray` consume is wired; the zero-alloc gate is GREEN.

### 1.3 — SpringProgress vector-sugar ADOPT at 3.8×@K=8

**Claim (FINAL.md:183):** "the SpringProgress vector-sugar (`setTargets`) ADOPTED
(the 3.8×@K=8 win measured)."

**Verification:**

1. `scripts/spring-vector-decision.json` (on-disk artifact):
   ```json
   {
     "k": 8,
     "winFraction": 1.2,
     "vectorHz": 51007.189393746696,
     "scalarHz": 13233.333595786451,
     "ratio": 3.854447484796091,
     "verdict": "ADOPT",
     "recordedAt": "2026-06-17T12:49:26.814Z"
   }
   ```
   Ratio 3.854× > the 1.2× ADOPT threshold. The FINAL.md states "3.8×@K=8" —
   this is rounded-down from 3.854, which is the conservative honest claim.

2. `src/animation/spring.ts:504–524` — `setTargets(Float64Array)` is
   implemented. `src/animation/spring.ts:554–600` — `tickVector(dt)` is
   implemented. The EMPTY_LANES sentinel (`src/animation/spring.ts:97`) ensures
   scalar-only springs allocate nothing before the first `setTargets`.

3. `src/animation/spring.ts:188–190` — the vector lane buffers are `null` by
   default (not allocated), so a scalar-only spring is byte-unchanged.

**Number accuracy:** 3.854× measured, 3.8× claimed — the claim is
slightly conservative. No overclaim.

**Precept check:** The `proof:spring-vector` gate enforced MEASURE-FIRST — the
`setTargets` sugar was NOT authorized to ship until the bench recorded ADOPT.
The `scripts/spring-vector-decision.json` artifact is the durable proof.

### 1.4 — warmEngine() and scheduler.postTask DEFERRED

**Claim (FINAL.md:183):** "`warmEngine()` is measure-first (the `scheduler.postTask`
idle-warmer DEFERRED — the probe only SKIPs in jsdom, so it is not asserted as a win)."

**Verification:**

1. `src/animation/load-engine.ts:536–538` — `warmEngine` is:
   ```ts
   export const warmEngine = (): void => { void loadAnimationEngine(); };
   ```
   No `postTask` call. The implementation comment at `load-engine.ts:526–534`
   explicitly states the reason: "the `proof:scheduler-posttask` probe only
   SKIPs in jsdom — it has NOT positively MEASURED that the `'background'` call
   does not degrade INP on a real engine."

2. `scripts/proof-scheduler-posttask.mjs` exists and runs `test/scheduler-
   posttask-probe.test.ts`. **Observed re-run: `node scripts/proof-scheduler-
   posttask.mjs` → exit 0 (PASS).** The test skips the postTask availability
   arm (jsdom lacks `scheduler`), and the `yieldToMain-uses-scheduler.yield`
   assertion GREEN-s.

3. The gate exit-0 does NOT represent a positive real-browser measurement. It
   represents: (a) no postTask adoption happened, (b) yieldToMain is unaffected.
   This is the correct posture — the gate is ARMED, not DISCHARGED.

**Verdict:** The deferred posture is correct. `warmEngine` fires a bare
`void loadAnimationEngine()` today. The production adoption of
`scheduler.postTask("background")` is gated on a Playwright run that observes
INP under the background dispatch — a real-browser measurement that does not
exist in jsdom. This is a NAMED M-wave candidate (see §4).

### 1.5 — Granular loadAnimationEngine per-capability accessors (S3)

**Claim (FINAL.md:183 implied):** "Granular `loadAnimationEngine()` per-capability
load accessors landed."

**Verification:**

1. `src/animation/load-engine.ts:327–388` — `loadEngine()`, `loadCompiler()`,
   `loadIngest()` are implemented with memoized per-chunk imports.

2. `load-engine.ts:304–310` — module-scope `_engineMod`, `_compileMod`,
   `_ingestMod`, `_scrollMod` memoize chunk imports shared between the granular
   accessors and `loadAnimationEngine()`.

3. `loadAnimationEngine()` at `load-engine.ts:415–504` shares `_ingestMod`,
   `_scrollMod`, `_compileMod` via the memoized import helpers — a
   `warmEngine()` + subsequent `loadAnimationEngine()` reuses the same in-flight
   Promise.

**Precept check:** S3 converted the all-or-nothing `Promise.all` door into
three typed narrower accessors (`EngineCore`, `CompilerSurface`, `IngestSurface`)
plus the unchanged full `AnimationEngine`. This is architectural elegance, not a
workaround. No precept violation.

### 1.6 — EPF-1 read/write phase baseline recorded (S5)

**Claim (FINAL.md §S4):** "warmEngine measure-first" and the gate is
`proof:epf1-measure` (observe-only).

**Verification:**

1. `scripts/epf1-baseline.json` exists with measured data:
   - N=10: layoutThrashCount=19 (read↔write phase boundaries)
   - N=50: layoutThrashCount=99
   - N=100: layoutThrashCount=199

   The pattern is `layoutThrashCount ≈ 2N - 1` — perfectly linear O(N),
   confirming interleaved per-element reads and writes during the CSSOM walk.
   At N=100: 100 computedStyleReads + 100 styleWrites = 200 ops, 199 phase
   crossings. The cure (batch all reads first, then all writes) reduces this
   to 1 phase boundary regardless of N.

2. `src/animation/ingest-cssom.ts` (466 lines) has no `getComputedStyle` calls
   directly — the reads are delegated to `value.js`'s `getComputedValue` via
   the `lerpComputedValue` hot path called during `resolveKeyframes`. The
   interleaved pattern is real but emerges from the per-element iteration over
   `CSSKeyframesAnimation` objects, each of which may trigger a computed
   resolution against DOM on construction with `cq*`-bearing values.

3. `proof:epf1-measure` is `observe-only` (`EPF1_CURE=1` is not set). The gate
   exits 0 and records the baseline. No cure shipped in L.W7 — correct posture.

**EPF-1 for M:** The baseline establishes the measure. The cure (a batched
reads-first pass over the ingest walk) is an M-wave candidate when the ingest
workload is the right wave to address it (see §4).

### 1.7 — Budgeted bench taxonomy (S6)

**Verification:** `scripts/proof-bench-taxonomy.mjs` and `bench/taxonomy.json`
exist. The manifest maps bench cases to `{run-check, observe-only, budgeted,
cross-repo}`. The `cross-repo` entries for VJ.L1–VJ.L8 are verified present
in `KF-TO-VALUEJS-O-ASKS.md §7` (W78–W85). The budgeted arm is declared
`observe-only` in CI (wall-clock device-dependent floor) — correct per
`inv-L-device-honesty`.

---

## §2 — PRECEPT AUDIT (the bar M must hold)

**No precept violations found in L.W7's as-built surface.** Detailed review:

### 2.1 — No quick solutions / workarounds

The inline `lerpArray` is NOT a workaround in the precept sense — it is the
ONLY viable path given value.js's absence of a `./math` subpath. A workaround
would be importing `lerpArray` from the barrel (breaking `proof:boundary`) or
using a `number[]` loop (the pre-L regressive path). The inline is documented,
byte-equivalent, and has a named tripwire (the value.js subpath ask). The
`KF-TO-VALUEJS-O-ASKS.md §14` dispatch makes this a first-class cross-repo ask
with a `proof:workaround-deletion` arm that fires on consume.

The `warmEngine`'s bare `void loadAnimationEngine()` is NOT a workaround — it
is the measured-correct path (postTask adoption is gated on a real measurement
that does not yet exist).

### 2.2 — No legacy code

All pre-L `number[]` segment buffers replaced with `Float64Array`. No legacy
interp path left.

### 2.3 — KISS / gestalt

The `loadEngine`/`loadCompiler`/`loadIngest` split is architecturally
principled: it makes the dynamic boundary GRANULAR rather than all-or-nothing,
directly reducing unnecessary chunk loading for narrow consumers. This is the
GESTALT approach (elegant, correct, composable) not a workaround.

### 2.4 — inv ε (every claim cites an observed oracle)

FINAL.md §S4 cites:
- `npx vitest run test/zero-alloc.test.ts → 7/7 passed (commit d858044)` — VERIFIED reproducible.
- `node scripts/proof-spring-vector.mjs → exit 0` — the `spring-vector-decision.json` artifact is the evidence (3.854× ADOPT).
- The `scheduler.postTask` probe `only SKIPs in jsdom` — VERIFIED: the gate exits 0 but the postTask arm is explicitly SKIP, not GREEN-by-measurement.

The FINAL.md phrasing is accurate. No overclaim found.

---

## §3 — PERF NUMBERS: MEASURED vs CLAIMED

| Claim | Measured (oracle) | Source |
|---|---|---|
| `lerpArray` win (HEAVY tier, J.W6 S2) | 1.56× at K=2, 4.25× at K=64 | `bench/interp-buffer.bench.ts:131–199` (cited in L.W7.md §Finding-1) |
| SpringProgress vector vs K=8 scalars | **3.854× measured** (vectorHz=51007, scalarHz=13233) | `scripts/spring-vector-decision.json` |
| FINAL.md claim "3.8×@K=8" | 3.854×, rounded down | `FINAL.md:183` |
| EPF-1 thrash at N=100 | 199 phase boundaries (O(2N-1)) | `scripts/epf1-baseline.json` |
| postTask INP delta | **NOT MEASURED** — probe SKIPs in jsdom | `scripts/proof-scheduler-posttask.mjs` |

**Key finding:** The L.W7 perf numbers that CAN be measured in a node/jsdom
environment ARE measured and recorded as durable artifacts. The postTask INP
claim is explicitly NOT made (the gate documents the SKIP). No number is
fabricated or overclaimed. The wave spec's statement that the probe "does NOT
assert a throughput improvement" is honored to the letter.

**The bench taxonomy `budgeted` arm:** The lerpArray SoA win (K=8, ≥20%
threshold) is recorded in `bench/taxonomy.json`. The budgeted floor is
`observe-only` in CI to respect inv-L-device-honesty.

---

## §4 — M-WAVE PROPOSALS (what M owes)

### M.P1 — value.js `./math` subpath (cross-repo; the inline deletion)

**Rationale:** `src/animation/internal/leaves.ts:68–80` carries an inlined
`lerpArray` that is a byte-equivalent copy of `value.js/src/math.ts:60`. The
inline exists ONLY because value.js has no `"./math"` subpath in its `exports`
map. When value.js Tranche O ships a `./math` subpath with `lerp`/`clamp`/
`lerpArray` and zero CSS-grammar static edge, kf DELETES the inline and imports
the kernel from `@mkbabb/value.js/math`.

**Gate:** `proof:workaround-deletion` already has an arm for this
(`KF-TO-VALUEJS-O-ASKS.md §14` W-MATH-SUBPATH). The arm fires GREEN on the
value.js-O publish + kf re-pin + `leaves.ts` inline deleted. The tripwire is
the `@mkbabb/value.js/math` subpath appearing in the published package's
`exports` map.

**M action:** Consume on value.js-O publish. No kf code change until the
subpath exists.

### M.P2 — scheduler.postTask real-browser INP measurement

**Rationale:** `warmEngine()` fires a bare `void loadAnimationEngine()` today.
The correct idle-warm path is `scheduler.postTask(() => loadAnimationEngine(),
{ priority: "background" })` — available as Baseline-Newly (2024-01-15). But
the jsdom probe only SKIPs (no `scheduler` in jsdom), so no positive measurement
exists. The MEASURE-FIRST law (L.W7 S4) says: no `postTask` adoption without a
real-browser measurement showing the background dispatch does NOT degrade INP.

**M action:** A Playwright test (in the demo-smoke harness or a new
`test/scheduler-posttask-playwright.test.ts`) that:
1. Loads the demo in a browser with `scheduler.postTask` (Chrome/Edge ≥122).
2. Calls `warmEngine()` in a `requestIdleCallback`.
3. Dispatches a user gesture immediately after; measures the INP delta.
4. Asserts the delta is ≤ the baseline (no regression vs bare `void` path).

When that test passes, `warmEngine` adopts `scheduler.postTask("background")`
and `scheduler.ts` is updated to probe and cache `postTask` availability.

### M.P3 — EPF-1 ingest batch-reads cure

**Rationale:** `scripts/epf1-baseline.json` records layoutThrashCount ≈ 2N-1
at N=100. The cure (batch all `getComputedValue` reads before any style writes
in the ingest walk) reduces this to 1 phase boundary. The cure is in
`src/animation/ingest-cssom.ts` (466 LOC) — specifically in the per-element
loop that calls `resolveLiveKeyframes` which triggers computed resolution via
value.js's `getComputedValue`. The cure requires: (a) a two-pass ingest loop
(reads pass: collect all `cq*` elements and read their computed values; writes
pass: construct `CSSKeyframesAnimation` objects from the batched reads), and
(b) re-measuring with `EPF1_CURE=1` to confirm the ≥50% reduction threshold.

**M action:** Author the cure in `ingest-cssom.ts`. Set `EPF1_CURE=1` in the
`proof:epf1-measure` gate. Assert `layoutThrashCount <= baseline * 0.5` (a 50%
reduction, 199 → ≤99 at N=100). Born-RED until the cure greens.

**Scope caveat:** This cure is M-wave material only if M includes an ingest
wave. If M's scope is narrower, EPF-1 carries to the next ingest wave.

### M.P4 — value.js color-math alloc (VJ.L1–VJ.L8)

**Rationale:** `KF-TO-VALUEJS-O-ASKS.md §7` dispatched VJ.L1–VJ.L8 to value.js
Tranche O. These are HIGH-severity per-call allocation hot paths in
`transformMat3`, `oklab2xyz`, `mixColors`, `gamutMapToRgbSpace`. kf cannot fix
these unilaterally. The `bench/taxonomy.json` `cross-repo` entries assert the
dispatch is intact.

**M action:** When value.js-O ships the zero-alloc color-math rewrites, kf
re-pins and the `proof:bench-taxonomy` `cross-repo` arms become the `budgeted`
arms with the measured floors. No kf code change until the value.js publish.

---

## §5 — DEFERRED FOLDS (items to carry into the M ledger)

| Item | Chronicity | Status | Tripwire | M action |
|---|---|---|---|---|
| `lerpArray` inline in `leaves.ts` | L (introduced L.W7) | PENDING-CONSUME | `@mkbabb/value.js` `./math` subpath published | Delete inline; import from `@mkbabb/value.js/math` |
| `scheduler.postTask` warmEngine adoption | L (probe SKIP-only) | OPEN — not measured | Playwright real-browser INP measurement | M.P2 |
| EPF-1 ingest batched-reads cure | K→L (tripwire fired at K.W8) | BASELINE RECORDED — cure unshipped | `EPF1_CURE=1` ≥50% thrash reduction | M.P3 (if ingest wave) |
| VJ.L1–VJ.L8 color-math alloc | L cross-repo dispatch | DISPATCHED — value.js-O unpublished | value.js-O (0.14.0) ships zero-alloc color math | kf re-pin + move taxonomy entries to `budgeted` |

---

## §6 — CROSS-REPO ASKS

| Ask | Doc | Tripwire | kf gate |
|---|---|---|---|
| W-MATH-SUBPATH — `@mkbabb/value.js/math` subpath | `KF-TO-VALUEJS-O-ASKS.md §14` | value.js-O `exports["./math"]` present | `proof:workaround-deletion` arm (inline deleted on re-pin) |
| VJ.L1–VJ.L8 — color-math zero-alloc | `KF-TO-VALUEJS-O-ASKS.md §7` | value.js-O ships 8 zero-alloc hot-path rewrites | `proof:bench-taxonomy` cross-repo→budgeted migration |

**parse-that:** No L.W7 cross-repo ask. The `scheduler.postTask` and EPF-1
items are kf-internal.

**glass-ui:** No L.W7 cross-repo ask.

---

## §7 — EVIDENCE ANCHORS

| Claim | File:line |
|---|---|
| `lerpArray` inlined | `src/animation/internal/leaves.ts:68–80` |
| inline rationale (no `./math` subpath) | `src/animation/internal/leaves.ts:55–63` |
| value.js exports map (no `./math`) | `node_modules/@mkbabb/value.js/package.json` exports field |
| `lerpArray` in value.js barrel | `node_modules/@mkbabb/value.js/dist/value.js` line ~5002 (`ee as lerpArray`) |
| `math.d.ts` exists but unmapped | `node_modules/@mkbabb/value.js/dist/math.d.ts:16,31` |
| NumericAnimation `Float64Array` segments | `src/animation/numeric.ts:145–151` |
| Module-scope `_out` scratch buffer | `src/animation/numeric.ts:25` |
| `lerpArray` called in `.at()` | `src/animation/numeric.ts:201` |
| zero-alloc gate sentinel | `test/zero-alloc.test.ts:168–183` |
| SpringProgress vector lanes (null-by-default) | `src/animation/spring.ts:185–190` |
| `setTargets` implementation | `src/animation/spring.ts:504–524` |
| `tickVector` implementation | `src/animation/spring.ts:554–600` |
| EMPTY_LANES sentinel | `src/animation/spring.ts:97` |
| Spring vector ADOPT verdict (3.854×) | `scripts/spring-vector-decision.json` |
| warmEngine bare impl | `src/animation/load-engine.ts:536–538` |
| warmEngine deferred rationale | `src/animation/load-engine.ts:526–534` |
| `loadEngine` / `loadCompiler` / `loadIngest` | `src/animation/load-engine.ts:327–388` |
| Memoized chunk imports | `src/animation/load-engine.ts:304–310` |
| `proof:scheduler-posttask` script | `scripts/proof-scheduler-posttask.mjs` |
| postTask probe SKIP arm | `test/scheduler-posttask-probe.test.ts:62–67` |
| EPF-1 baseline | `scripts/epf1-baseline.json` (N=10: 19, N=50: 99, N=100: 199) |
| EPF-1 gate observe-only | `scripts/proof-epf1-measure.mjs:77–79` |
| ingest-cssom.ts | `src/animation/ingest-cssom.ts` (466 lines, no direct getComputedStyle) |
| W-MATH-SUBPATH dispatch | `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md:556–584` |
| VJ.L1–VJ.L8 dispatch | `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md:307–341` |
| FINAL.md perf boundary | `docs/tranches/L/FINAL.md:179–187` |
