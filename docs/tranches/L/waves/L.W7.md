# L.W7 — SOTA performance

- **Band:** A · **Class:** SHIP-in-L · **Dep:** value.js `lerpArray` — ALREADY
  PUBLISHED at 0.13.0 (`^0.13.0` in `package.json`); no new sibling publish gate
- **Gate (born-RED):** `proof:zero-alloc` EXTENDED to the LIGHT tier (`NumericAnimation`
  + `SpringProgress` lerpArray consume) + `proof:bench-taxonomy` (new gate — budgeted
  bench roster; RED today because the script does not exist)

---

## Context

The audit's Lane 30 perf verdict (⚠34) certified that the K-shipped heavy-tier perf
code is **clean: no violations**. The gap is on the FRONTIER, not in the deployed
surface. Four independent findings converge on L.W7:

### Finding 1 — lerpArray is published but un-consumed on the LIGHT tier (audit W122, ⚠34)

`value.js 0.13.0` exports `lerpArray(start, stop, t, out)` at
`src/math.ts:60` (published `index.ts:192`). The function was built FOR kf: its
`src/math.ts:43-49` doc names keyframes.js's `FrameCompiler` as the only real
downstream consumer. `bench/interp-buffer.bench.ts:131-199` proves the HEAVY
`CSSKeyframesAnimation` pipeline adopts it at the HEAVY tier (the J.W6 S2 SoA
bench arm, measured 1.56× at K=2 → 4.25× at K=64).

The LIGHT tier — `NumericAnimation` (`src/animation/numeric.ts:65-200`) —
builds the same per-segment `startVals`/`stopVals` number arrays
(`numeric.ts:138-143`) but interpolates them via a plain `for` loop over
individual `lerp(startVals[i], stopVals[i], t)` calls (no `Float64Array`, no
`lerpArray`). The substrate that would consume `lerpArray` CHEAPLY — pack
`startVals`/`stopVals` into `Float64Array` at segment-build time and call one
`lerpArray(from, to, t, out)` per `.at()` — is on the LIGHT boundary, so it
carries zero new value.js edge (value.js's `lerpArray` is value.js-free: it is a
plain typed-array loop). The `lerpArray` consume on the LIGHT tier is the
**un-claimed edge** the audit calls out (Lane 33 `proof:zero-alloc` covers only
the `AnimationGroup` composite; the LIGHT-tier `NumericAnimation.at` inner loop
is ungated).

`SpringProgress` vector sugar (W122) rides the same lerpArray substrat: a
`setTargets(Float64Array)` overload that ticks all K springs' `current` values
into one `Float64Array` output per tick, instead of K independent scalar
`SpringProgress` instances. The bench in `bench/spring-tick.bench.ts` covers
single-scalar tick; no multi-channel spring bench exists.

### Finding 2 — warmEngine() is unimplemented (audit W121)

`loadAnimationEngine()` (`src/animation/index.ts:330-390`) `Promise.all`'s eight
chunks. The first call on a cold page — from a user interaction handler — pays
network + parse + compile latency inline. On fast connections this is
sub-100ms; on constrained devices it is a visible stall before the first
animation.

`warmEngine()` is the one clean perf increment: call it in a `requestIdleCallback`
(or on `visibilitychange` / `mouseenter` on the app shell) to pre-flight the
dynamic import so the first `.animate()` / `CSSKeyframesAnimation` call is
synchronous against an already-resolved Promise. The cure is:

```ts
// src/animation/index.ts — the LIGHT barrel
let _enginePromise: Promise<AnimationEngine> | null = null;

export const loadAnimationEngine = (): Promise<AnimationEngine> => {
    _enginePromise ??= Promise.all([…]).then(merge);
    return _enginePromise;
};

export const warmEngine = (): void => {
    void loadAnimationEngine();   // fire-and-forget; idempotent
};
```

`warmEngine` is LIGHT-tier (it fires a dynamic import, never names a value.js
specifier — `proof:boundary` stays green). It is value.js-free by construction.
`proof:boundary`'s assertion-4 source-grep complements confirm: no static
value.js specifier in the barrel's light surface today, and `warmEngine` adds
none.

### Finding 3 — scheduler.postTask priority bands (audit W123)

`src/animation/internal/scheduler.ts` probes `scheduler.yield` live on each
call (lines 41-48) and falls back to `MessageChannel` / `setTimeout(0)`. It
does NOT probe `scheduler.postTask`, which ships priority bands:
`"user-blocking"` for the first visible frame of an animation that starts from
a user gesture, `"background"` for `warmEngine()`'s pre-flight chunk loads.

The audit's born-RED discipline: this is a **BOOK → born-RED probe** wave
(W123). `scheduler.postTask` is Baseline-Newly (2024-01-15). The born-RED gate
does NOT assert a throughput improvement — it asserts the `"background"` call
does NOT degrade INP (i.e., a user-gesture-timed animation start running in a
`"user-blocking"` task shows no measurable latency penalty vs the current
`scheduler.yield` path). The probe is: (a) `scheduler.postTask` is available in
the test environment, (b) wrapping `warmEngine()`'s `loadAnimationEngine()` in
a `"background"` postTask fires it without blocking the current microtask queue,
(c) the `yieldToMain` fast-path (`scheduler.yield`) is unaffected. Only when the
probe is green does the production `warmEngine` adopt `postTask("background")`.
No code is shipped without the probe gate GREEN.

### Finding 4 — granular loadAnimationEngine per-capability accessors (audit W124, W17)

`loadAnimationEngine()` (`src/animation/index.ts:330-390`) is **one all-or-nothing
door**: it `Promise.all`'s all eight chunks (engine + animate + motion-path +
draw-svg + ingest + scroll-scene + compile + animations). A consumer that needs
only `compileToCSS` pays for the `MotionPath` / `DrawSVG` / `AnimationGroup`
network weight. The audit's W17/W124 calls out the granularity gap; `K/FINAL.md:66`
records the engine-seam split as a kf-owned follow-up from K.

The cure is per-capability accessors on the barrel that share the memoized
partial chunks:

```ts
// Illustrative shape — exact API surface is the S3 deliverable
export const loadEngine          = (): Promise<EngineCore>    => …; // engine only
export const loadCompiler        = (): Promise<CompilerSurface> => …; // engine + compile
export const loadIngest          = (): Promise<IngestSurface>   => …; // engine + ingest
export const loadAnimationEngine = (): Promise<AnimationEngine> => …; // all (backward-compat)
```

Each accessor memoizes its Promise. `loadAnimationEngine` remains available and
continues to resolve the full surface — no breaking change. `proof:boundary`'s
assertion-3 (dynamic-chunk presence) must enumerate the new accessor names; its
assertion-1 (per-entry negative coverage) must cover the barrel's new light
re-exports (`warmEngine`, the new `load*` accessors emit no value.js edge from
the barrel).

### Finding 5 — EPF-1 read/write phase separation, measure-first (audit W40)

EPF-1 was BOOKED at J (the K-SEED, `K/audit/deferred-ledger-k.md:97`) with the
tripwire: "when a K.W8 SCROLL tier pins many `cq*`-driven elements through a
panel-resize — the multi-computed workload that makes the epoch-boundary thrash
real." K.W8 shipped the ingest workload (`ingest-cssom.ts`, +617 LOC per
`K/FINAL.md:45`). The tripwire HAS FIRED: the live CSSOM walk in
`ingest-cssom.ts` + `adoptRunning()` reads `getComputedStyle` and sets CSS
properties interleaved with CSSOM iteration. No explicit read/write phase
separation exists in `ingest-cssom.ts:1-396` (no batched read-then-write pass,
no `requestAnimationFrame` epoch boundary). The `flip.ts` module does this
correctly (`flip.ts:119`, "Batched read-mutate-read: one forced layout per side,
no thrash"); the ingest path does not apply the same discipline.

**Tripwire status:** the workload is now real. The L.W7 obligation is
**measure-first**: bench the ingest path under a multi-element `cq*`-driven
panel-resize scenario, record the layout-thrash count (via `performance.measure`
or LoAF attribution), and determine whether a batch-reads-first / batch-writes-second
pass over the ingest's `getComputedStyle` calls produces a measurable improvement
before writing any cure code. No cure ships without the measurement. The gate is
`proof:epf1-measure` (a new script that runs the CSSOM walk over N=10/50/100
elements with a `ResizeObserver` trigger, records the `layout-shift` count, and
asserts the DOCUMENTED baseline — an observe-only gate with the CATEGORY
`forced-layout` per `inv-L-device-honesty`).

### Audit evidence summary

| Ref | Source | Gap |
|-----|--------|-----|
| W122, ⚠34 | `numeric.ts:138-143` (`startVals`/`stopVals` plain arrays); `value.js/src/math.ts:60` (`lerpArray` published) | LIGHT-tier `NumericAnimation.at` does not use `lerpArray`; `Float64Array` segments un-packed |
| W121 | `index.ts:330` (`loadAnimationEngine` no-cache, no warm) | No `warmEngine()` — first-call latency on cold page unmitigated |
| W123 | `scheduler.ts:41-48` (`scheduler.yield` probe only) | `scheduler.postTask` `"background"` priority not probed for `warmEngine` |
| W124/W17 | `index.ts:334-363` (`Promise.all` 8 chunks) | One all-or-nothing door; no per-capability lazy accessor |
| W40 | `ingest-cssom.ts:1-396` | EPF-1 tripwire fired (K.W8 workload real); no measure-first bench exists yet |
| Lane 33 | `test/zero-alloc.test.ts:51` | `proof:zero-alloc` covers `AnimationGroup` only; LIGHT tier (`NumericAnimation`) uncovered |
| Lane 33 | `scripts/proof-bench-runs.mjs:47-55` | `proof:bench-runs` is a RUN-CHECK not a budget; no bench covers value.js color-math alloc claims |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:zero-alloc` (extended) + `proof:bench-taxonomy` GREEN.

### S1 — `warmEngine()` idle-warmer (W121)

**Deliverable.** Add `warmEngine(): void` to the LIGHT barrel (`src/animation/index.ts`)
as a fire-and-forget memoized dynamic import trigger. The implementation
deduplicates with `loadAnimationEngine()`'s existing import by sharing one
module-scope `_enginePromise: Promise<AnimationEngine> | null = null`. A call to
`loadAnimationEngine()` after `warmEngine()` has started returns the same
in-flight Promise — no double import.

**Constraints.**
- `warmEngine` is a LIGHT-tier named export: `proof:boundary` assertion-4 (source
  grep for static value.js specifiers in light modules) must continue to pass —
  `warmEngine` fires a `dynamic import`, not a static one.
- `proof:boundary` assertion-1 (per-entry negative coverage) adds `warmEngine` as
  a bundled entry; its chunk must contain zero static value.js / engine edges.
- `proof:published-surface` must see `warmEngine` in the tarball (it is
  `export const`, so API Extractor rolls it up into `dist/keyframes.d.ts`).

**Gate bite.** `proof:boundary` currently covers `loadAnimationEngine` as the sole
dynamic-boundary function on the barrel (assertion-3 checks `loadAnimationEngine`
by name). After S1: add `warmEngine` to assertion-3's list; the gate reds if
`warmEngine` accidentally carries a static value.js edge.

### S2 — `lerpArray` consume on the LIGHT tier (W122)

**Deliverable.** Rewrite `NumericAnimation`'s segment builder (`numeric.ts:130-143`)
to pack `startVals` and `stopVals` as `Float64Array` (instead of `number[]`). Add a
module-scope `_out: Float64Array` (resized lazily on first call with more channels
than the current capacity, never shrunk — stable reference). Replace the
per-channel `lerp()` loop in `.at()` (`numeric.ts:152-175`) with one
`lerpArray(seg.from, seg.to, easedT, this._out)` call, then write channels
from `_out` back into `this.result`.

**The value.js edge.** `lerpArray` is a plain `Float64Array` loop — it imports
nothing from `@mkbabb/value.js`'s CSS-grammar paths. It is typed at
`src/math.ts:60-72` as a pure function on typed arrays. Importing it on the
LIGHT tier requires: (a) value.js's `math.ts` subpath is value.js-free itself
(it imports only `Nullable` — a type, erased), and (b) the barrel import
(`import { lerpArray } from "@mkbabb/value.js"`) does NOT trigger value.js's
CSS grammar side effects. The S2 gate must verify this. If `lerpArray` is
re-exported through value.js's barrel (`index.ts:192`) which also exports the
CSS grammar, bundling it via the barrel import would pull the grammar's static
init into the light bundle — defeating `proof:boundary`. **The safe path:** import
from the explicit subpath `@mkbabb/value.js/math` (if value.js exposes one), or
declare `value.js` as externalized in the `proof:boundary` rolldown build and assert
the resulting light chunk imports NOTHING from value.js's runtime (the boundary
gate's proof-of-externalization mode). If neither is clean, S2 falls back to
**inline** the 8-line `lerpArray` into `numeric.ts` under the existing
`src/animation/internal/leaves.ts` no-duplicate rule — AFTER measuring that
`leaves.ts` is the better home and filing a cross-repo ask for value.js to expose
a tree-shakeable subpath. The decision is recorded, not assumed.

**Gate bite.** The existing `proof:zero-alloc` (`test/zero-alloc.test.ts:51`)
covers `AnimationGroup` only. The extension adds a `NumericAnimation` zero-alloc
arm: construct a `NumericAnimation` with K=8 channels, call `.at(t)` twice, and
assert the two returned objects are the SAME reference (the `_out` buffer
identity test — mirrors the group composite's `r1 === r2` assertion). RED today
because (a) `NumericAnimation.at` returns a freshly-written `this.result` already
pre-allocated — the REFERENCE is stable, but (b) the per-channel path writes via
individual `lerp` calls into the pre-allocated result, so the reference-stability
check passes TODAY for `this.result`'s object identity. The gate TIGHTENS the
claim: it adds a `Float64Array` sentinel check — that the segment's `from`/`to`
buffers ARE `Float64Array` instances (not `number[]`). This is RED today
(`startVals` is a plain `number[]` at `numeric.ts:139`) and GREEN after the S2
rewrite.

**Constraint.** `SpringProgress` vector sugar (W122 second half) is **BOOK
→ born-RED probe only** in L.W7: a `setTargets(Float64Array)` multi-spring API
requires a new public surface; the `bench/spring-tick.bench.ts` single-scalar
bench must be extended to a K=8 multi-spring case first. No new `SpringProgress`
method ships without a bench measurement showing the vector path beats K
independent scalar instances at the target K. The probe is `proof:spring-vector`
(new; born-RED until the bench arm exists and shows ≥20% improvement at K=8).
If the measurement is negative, the vector sugar is KILLED.

### S3 — granular loadAnimationEngine per-capability accessors (W124/W17)

**Deliverable.** Add three per-capability accessors to `src/animation/index.ts`:

| Accessor | Chunks | Use case |
|----------|--------|----------|
| `loadEngine()` | `engine` only | parse + interpolate without ingest/compile/motion |
| `loadCompiler()` | `engine` + `compile` | `compileToCSS` surface only |
| `loadIngest()` | `engine` + `ingest` + `scroll-scene` | `fromStyleSheets` / `adoptRunning` |

Each returns `Promise<T>` where `T` is the narrowed surface type. Each memoizes
its Promise. `loadAnimationEngine()` remains unchanged and resolves the full
surface — backward-compatible.

**Gate bite.** `proof:boundary` assertion-3 today asserts only `loadAnimationEngine`
emits the heavy chunks. After S3: the gate enumerates `loadEngine` / `loadCompiler`
/ `loadIngest` / `loadAnimationEngine`; asserts each emits its expected subset
of dynamic chunks and NOTHING static on the barrel entry; asserts no accessor
leaks a value.js edge into the barrel's static graph. RED today because the new
accessor names are absent from the gate's allowlist (adding a name to the gate
asserts it must be present — gating an absent symbol fails the assertion floor).

**Constraint.** `K/FINAL.md:66` records the engine-seam split as a FUTURE
follow-up, explicitly NOT a K blocker. L.W7 S3 closes it. The `dist/` hash-named
chunks (`engine-*`, `animate-*`, `motion-path-*`, `draw-svg-*`, `ingest-*`,
`scroll-scene-*`, `compile-*`, `animations-*`) already exist from K — the
granular accessors are WIRING, not new module splits.

### S4 — scheduler.postTask priority bands born-RED probe (W123)

**Deliverable.** A new test file `test/scheduler-posttask-probe.test.ts`:

1. Check `typeof globalThis.scheduler?.postTask === "function"` — if absent in
   the jsdom environment, SKIP the test (observe-only; the probe does not fail
   on environments that lack the API).
2. When available: wrap `loadAnimationEngine()` in a `"background"` postTask,
   assert the Promise resolves without error.
3. Assert `yieldToMain()` (`src/animation/internal/scheduler.ts:40`) continues to
   use `scheduler.yield` (not `postTask`) — the yield path is unaffected by the
   postTask probe.

**When probe is GREEN** in the jsdom environment (or under a Playwright run with
`scheduler.postTask` available): update `warmEngine()` from S1 to internally
call `scheduler.postTask(() => loadAnimationEngine(), { priority: "background" })`
when available, falling back to the bare `void loadAnimationEngine()` otherwise.

**Gate name.** `proof:scheduler-posttask` — a new script at
`scripts/proof-scheduler-posttask.mjs` that imports the test and asserts the
probe result is either SKIP (no API) or GREEN (no error). Born-RED today because
the script does not exist and `package.json` has no entry. GREEN when the script
exists and the `yieldToMain` fast-path assertion passes.

### S5 — EPF-1 read/write phase separation measure-first (W40)

**Deliverable.** `proof:epf1-measure` — a new `observe-only` gate script at
`scripts/proof-epf1-measure.mjs`. The gate:

1. Imports `ingest-cssom.ts`'s `resolveLiveKeyframes` and `fromStyleSheets` via
   `loadIngest()` (S3 accessor, or `loadAnimationEngine()` as fallback).
2. Synthesizes a `document.styleSheets` fixture with N=50 `@keyframes` rules
   plus sibling `.class { animation: … }` rules that carry `cqw`-bearing values
   (so `getComputedStyle` reads are exercised).
3. Triggers a `ResizeObserver` on a container element, then calls
   `fromStyleSheets()` during the observer callback — the scenario that makes
   interleaved read/write thrash real (the EPF-1 tripwire condition).
4. Records layout-thrash count via `PerformanceObserver` (`layout-shift` or
   `long-animation-frame` entries if available; falls back to a
   `performance.measure` bracket).
5. **Does not assert a threshold.** Emits the recorded baseline as a JSON
   artefact (`scripts/epf1-baseline.json`): `{ n: 50, layoutThrashCount: N,
   measuredMs: M, category: "forced-layout", cure: "batch-reads-first/batch-writes-second" }`.
6. On re-run, if a CURE is in place (a Phase flag in the script), asserts
   `layoutThrashCount <= baseline.layoutThrashCount * 0.5` — a 50%-reduction
   gate. Until the cure ships, the gate is `observe-only`.

**`inv-L-device-honesty` compliance.** The gate CATEGORY is `"forced-layout"`;
the cure is documented as `batch-reads-first/batch-writes-second`; the
`observe-only` flag is set (the script exits 0 regardless of the count). Per
`L.md §invariant set` the gate satisfies `inv-L-device-honesty`: it does NOT
assert a wall-clock budget; it asserts a layout-thrash COUNT (device-independent)
with `observe-only` until the cure ships.

**Born-RED posture.** The script is ABSENT from `package.json` today → RED on
`npm run proof:epf1-measure`. GREEN when the script exists and exits 0 (even on
the `observe-only` path). The budgeted half (`layoutThrashCount <= baseline * 0.5`)
opens only when the cure lands in `ingest-cssom.ts`.

### S6 — budgeted bench taxonomy (Lane 33)

**Deliverable.** A new gate `proof:bench-taxonomy` at
`scripts/proof-bench-taxonomy.mjs`. The problem it solves (Lane 33, `⚠34`):
`proof:bench-runs` is a **RUN-CHECK** (the bench executes, a positive `hz`
number is emitted — no budget). Two gaps follow:

1. **No bench covers the value.js color-math alloc claims** (W78–W85:
   `transformMat3`, `oklab2xyz`, `mixColors`, `gamutMapToRgbSpace` hot-path
   allocations in `/Users/mkbabb/Programming/value.js/src/utils.ts` and
   `color.ts`). kf's `proof:color-fidelity` and `proof:compile-replay` hit the
   color path at the integration level but do not measure allocations.
2. **Every bench-backed SOTA claim is un-budgeted**: the `lerpArray` SoA arm
   (`bench/interp-buffer.bench.ts:201`) shows a win; the claim survives only if
   the win persists across engine changes. `proof:bench-runs` does NOT assert it.

`proof:bench-taxonomy` introduces a **bench budget manifest**
(`bench/taxonomy.json`) mapping each bench case to one of:

| Category | Contract |
|----------|----------|
| `run-check` | bench runs and emits positive `hz`; no budget asserted |
| `budgeted` | `hz` must exceed a floor (baseline × fraction); floor recorded in `taxonomy.json` |
| `observe-only` | bench runs; result recorded; no floor; re-run establishes new baseline |
| `cross-repo` | bench targets a sibling (value.js color-math); excluded from kf CI; dispatched as a cross-repo ask |

The new gate:
- Reads `bench/taxonomy.json`.
- For `budgeted` cases: runs the bench, parses the `hz`, asserts `hz >= floor`.
- For `cross-repo` cases: asserts the case is listed in `KF-TO-VALUEJS-O-ASKS.md`
  (the value.js Tranche O dispatch doc) — it does NOT run the bench in kf CI.
- For `run-check` and `observe-only` cases: delegates to the existing
  `proof:bench-runs` logic (non-zero positive `hz`).

**The value.js color-math gap** is handled as `cross-repo` entries in
`taxonomy.json`. The dispatch to value.js Tranche O (`KF-TO-VALUEJS-O-ASKS.md`)
names VJ.L1–VJ.L8 (W78–W85) as the open items, records their high-severity
finding status (HIGH per `audit-32-skeleton.txt:278-282`), and requests that
value.js add `bench/color-math.bench.ts` covering the four hot functions with
budgeted entries.

**Born-RED posture.** `proof:bench-taxonomy` does not exist today (no script, no
`package.json` entry, no `bench/taxonomy.json`) → RED on any attempt to run it.
GREEN when:
1. `bench/taxonomy.json` exists and covers every bench case in
   `bench/interp-buffer.bench.ts`, `bench/interpolation.bench.ts`,
   `bench/parser.bench.ts`, `bench/compile.bench.ts`, `bench/spring-tick.bench.ts`.
2. The `budgeted` entries in `taxonomy.json` include at minimum the lerpArray SoA
   arm (W122 win: `hz >= baseline_hz * 1.2` at K=8) and the
   `warmEngine`-resolves-before-first-animate case (S1).
3. The `cross-repo` entries for VJ.L1–VJ.L8 are present AND the
   cross-repo-ask doc names them.

---

## Gate

### Born-RED gate: `proof:zero-alloc` (EXTENDED) + `proof:bench-taxonomy` (NEW)

**`proof:zero-alloc` extension — born-RED on today's tree:**

The existing `test/zero-alloc.test.ts` has no `NumericAnimation` arm. Add a
`describe("proof:zero-alloc — NumericAnimation LIGHT tier")` block with:

```ts
it("segment from/to buffers are Float64Array after S2", () => {
    const na = new NumericAnimation(
        [{ x: 0, y: 0, z: 0, w: 0, a: 0, b: 0, c: 0, d: 0 },
         { x: 1, y: 2, z: 3, w: 4, a: 5, b: 6, c: 7, d: 8 }],
    );
    // @ts-expect-error — accessing internal segment for gate
    const seg = na["segments"][0];
    expect(seg.from).toBeInstanceOf(Float64Array);   // RED today (plain number[])
    expect(seg.to).toBeInstanceOf(Float64Array);     // RED today
});
```

**RED today** because `numeric.ts:138-143` builds `startVals: keys.map((k) =>
start[k] as number)` — a `number[]`, not `Float64Array`. **GREEN after S2**
rewrites the segment builder to `Float64Array`.

**`proof:bench-taxonomy` — born-RED on today's tree:**

The script `scripts/proof-bench-taxonomy.mjs` does not exist. Any CI step that
runs `npm run proof:bench-taxonomy` exits non-zero (missing script). The
`package.json` has no `"proof:bench-taxonomy"` entry. GREEN when the manifest +
script + budgeted entries exist.

### Witness input for `proof:zero-alloc` LIGHT-arm RED

```
grep -n "startVals\|stopVals" src/animation/numeric.ts
# → numeric.ts:139: startVals: keys.map((k) => start[k] as number),
# → numeric.ts:140: stopVals: keys.map((k) => stop[k] as number),
# The plain `number[]` construction is the witness — instanceof Float64Array = false today.
```

---

## Deps

| Dep | Status | Gate |
|-----|--------|------|
| `value.js 0.13.0` `lerpArray` | ALREADY PUBLISHED (`^0.13.0` pinned) | No new sibling gate |
| `value.js` `math` subpath | CONFIRM in S2 — if not exposed, inline to `internal/leaves.ts` | `proof:boundary` S2 arm |
| `loadIngest()` (S3) | L.W7 internal | `proof:boundary` assertion-3 extension |
| `warmEngine()` (S1) | L.W7 internal | `proof:boundary` assertion-1 + assertion-3 |
| EPF-1 cure (S5) | **NOT shipped in L.W7** — observe-only gate + baseline recording | `proof:epf1-measure` observe-only |
| value.js VJ.L1–VJ.L8 color-math perf | cross-repo dispatch to Tranche O | `proof:bench-taxonomy` cross-repo entries |

**No glass-ui gate.** The five S-clauses are kf-internal (LIGHT boundary or
HEAVY wiring). L.W7 has zero dependency on the in-flight BB tranche.

---

## Bite — what regression each gate catches

| Gate | Regression caught |
|------|-------------------|
| `proof:zero-alloc` LIGHT arm (S2 `Float64Array` sentinel) | A revert of `numeric.ts` segment builder to `number[]` — restores the per-channel `lerp` loop, silent alloc per `.at()` call, 1.56–4.25× throughput regression at K=2–64 |
| `proof:zero-alloc` LIGHT arm (S2 lerpArray call path) | Removing the `lerpArray(from, to, t, out)` call and restoring individual `lerp` dispatches — the interp hot path regresses to closure-dispatch overhead the J.W6 S2 bench measured |
| `proof:boundary` S1 arm (`warmEngine` in accessor list) | Adding a static value.js import into `warmEngine`'s body — would pull the CSS grammar into every light-only consumer that calls `warmEngine()` during idle |
| `proof:boundary` S3 arm (`loadEngine`/`loadCompiler`/`loadIngest`) | Merging the per-capability chunks back into a single `Promise.all` — closes the granularity the accessors open, forcing every consumer to pay for all eight chunks regardless of need |
| `proof:bench-taxonomy` `budgeted` arm (lerpArray win) | An engine change that degrades `NumericAnimation.at` throughput by >20% at K=8 — silent regression not caught by `proof:bench-runs` (RUN-CHECK) |
| `proof:bench-taxonomy` `cross-repo` arm | Silently dropping the VJ.L1–VJ.L8 asks from the dispatch doc — the color-math alloc frontier becomes untracked |
| `proof:epf1-measure` | Removing the baseline artefact or adding new interleaved read/write in `ingest-cssom.ts` without re-measuring — the EPF-1 thrash count drifts without a record |
| `proof:scheduler-posttask` (S4) | Replacing `scheduler.yield` with `postTask` in `yieldToMain` — the fast-path is for yields BETWEEN group batch slices, not for engine warm-up; conflating them would serialize group ticks with background imports |
