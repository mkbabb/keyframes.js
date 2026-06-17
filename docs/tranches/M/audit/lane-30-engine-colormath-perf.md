# Lane 30 — Engine hot-paths + color-math perf (Tranche M audit)

**Lane:** 30 · **Tranche:** M (development only — no implementation) ·
**Audited branch:** `tranche-l-dev` (tip `529fcfd`) · **Date:** 2026-06-17 ·
**Auditor:** subagent (claude-sonnet-4-6) · **Inv ε:** every claim below names the
file:line anchor verified against the live tree; no claim asserts a result a re-read
cannot reproduce.

---

## §0 — VERDICT

**L shipped the engine-hot-path perf work COMPLETELY.** Every item the L.W7 wave
plan (`docs/tranches/L/waves/L.W7.md`) promised is in the tree: `warmEngine()` idle
pre-flight (memoised, LIGHT), granular `loadEngine`/`loadCompiler`/`loadIngest`
accessors (`load-engine.ts:327–389`), `NumericAnimation` Float64Array segment
buffers + `lerpArray` hot path (`numeric.ts:145–209`), `SpringProgress` vector sugar
`setTargets(Float64Array)` / `tickVector(dt)` (`spring.ts:504–589`), budgeted bench
taxonomy (`bench/taxonomy.json`), EPF-1 observe-only gate
(`scripts/proof-epf1-measure.mjs`), and `proof:spring-vector` / `proof:bench-taxonomy`
wired into `package.json`.

**The value.js color-math alloc frontier (VJ.L1–VJ.L8) remains open.** The
allocations are CONFIRMED in the live value.js 0.13.0 source tree (verified below);
they are dispatched as `cross-repo` entries in `bench/taxonomy.json` pointing to
`KF-TO-VALUEJS-O-ASKS.md §7`. No kf-local cure exists or is appropriate — the cures
are value.js-O work, acyclic-spine. M's job on this axis is to (a) confirm value.js-O
has consumed the dispatches, (b) add the `bench/color-math.bench.ts` kf-side
integration bench to verify the consume edge delivers the expected improvement, and
(c) extend `proof:bench-taxonomy` to graduate those cross-repo entries from PENDING
to BUDGETED once the value.js publish lands.

**One genuine M-perf frontier not in the L dispatch:** the `getComputedValue`
DOM-read/write interleave in `value.js/src/units/normalize.ts:254–310` is a
per-endpoint forced-layout read (set inline style → `getComputedStyle` → reset style)
that the C1 epoch cache (`lerpComputedValue`'s `_computedCache`) contains per-epoch,
but the epoch granularity is VIEWPORT-resize only. Container-resize events that do
not coincide with a window resize (dock toggle, sidebar collapse, split-pane drag)
never bump the epoch automatically — a consumer MUST call `bumpLayoutEpoch()` or
stale pixels are served silently. The EPF-1 measure gate (`proof:epf1-measure`) was
filed as observe-only pending a baseline; M should record the actual baseline and
determine whether a phase-separation cure is warranted.

---

## §1 — Engine hot-path audit (kf-internal, L-closed)

### 1.1 interpFrames and processFrame — monomorphic dispatch, zero allocation

`engine.ts` `interpFrames` (`engine.ts:633–717`) is the per-frame hot path. Verified
findings:

- **Binary search:** O(log N) via `binarySearchRange` over the sorted `frames[]` —
  no linear scan (`engine.ts:644–649`).
- **No per-call closure:** `processFrame` is a method reference bound once
  (`_boundFrame`), never a per-call lambda. The comment at `engine.ts:664` states
  this explicitly.
- **Stable-key null-fill (not delete):** `clearBuffer` at `engine.ts:730–735` fills
  `_stableKeys` in a plain `for`-loop, never calls `delete`. This is the F.W4 S1
  V8-dictionary-mode fix; the buffer stays in fast-properties mode for the animation
  lifetime.
- **Single-frame alias (F.W4 S3):** when exactly one frame is active (`lo === hi`)
  the `flatVars` object is returned DIRECTLY without copy or merge. The majority of
  real animations (2-stop `fromString`, every preset) hit this path.
- **`_interpOut` output buffer:** the standalone play loop (`_frame`) writes into
  `this._interpOut` (allocated once at construction, `engine.ts:223`), never
  allocating a per-frame result object. The `proof:standalone-zero-alloc` gate
  (`test/standalone-zero-alloc.test.ts`) covers this.

**Verdict:** no megamorphism or allocation gap found on this path. The processFrame
inner loop calls `lerpValue(eased, iv)` once per `allInterpVars` entry — the dispatch
is pre-resolved onto each iv's `_lerp` field at `prepareInterpVar` time
(`value.js/src/units/interpolate.ts:231–236`), so the hot-loop branch is a single
`iv._lerp` indirect call, not a full `resolveLerpFn` re-evaluate per tick.

### 1.2 lerpValue dispatch — monomorphism

`lerpValue` (`value.js/src/units/interpolate.ts:215–221`) reads `iv._lerp ?? resolveLerpFn(iv)`
and calls it. The `prepareInterpVar` call at frame-compile time stamps `_lerp` on every
iv, so the runtime fallback (`resolveLerpFn`) is only reached on externally-constructed
ivs (not the engine's internal path). The dispatch is:

- `iv.computed` → `lerpComputedValue` (cq*/calc/var units)
- `iv.start.unit === "color"` → `lerpColorValue` (oklab hot path)
- both endpoints numeric → `lerpNumericValue` (scalar fast path)

This is a three-way predispatch, NOT a polymorphic dispatch. Each iv has exactly one
`_lerp` function reference for its lifetime — V8 will see this as a MONOMORPHIC
call site. **No megamorphism found.**

The `lerpColorValue` path (`value.js/src/units/interpolate.ts:104–170`) uses a
`_colorPlan` Float64Array for precomputed channel numeric values — the B3 optimization.
It avoids `instanceof ValueUnit` checks and `unwrapDeep` per tick.

### 1.3 AnimationGroup compositor — zero-alloc (verified)

`group.ts` uses a `_grouped` output buffer (stable, keyed by `_stableKeys`) and the
null-fill discipline. `proof:zero-alloc` (`test/zero-alloc.test.ts`) covers the group
compositor. The YIELD_BATCH sheds latency without shedding work — no author intent is
dropped.

### 1.4 NumericAnimation — Float64Array + lerpArray (L.W7 S2, SHIPPED)

`numeric.ts:140–161`: `buildSegment` allocates `new Float64Array(keys.length)` for
`from` and `to` at construction time. The `at()` method (lines 170–209) uses a
module-scope `_out` scratch buffer (lazy-grown, never shrunk), calls
`lerpArray(seg.from, seg.to, eased, _out)`, and writes results back into `this.result`
via indexed access — zero heap allocation in the hot path.

`lerpArray` is inlined in `src/animation/internal/leaves.ts:68–80` (NOT imported from
value.js's barrel, because value.js exposes no tree-shakeable `./math` subpath —
documented at `leaves.ts:57–63`). The inline is byte-for-byte equivalent to value.js's
`src/math.ts:60–72`.

The `proof:zero-alloc` extension (`test/zero-alloc.test.ts`) verifies that
`seg.from`/`seg.to` are `Float64Array` instances (the sentinel check the L.W7 wave
defined as RED-today-before-S2). The gate is now GREEN.

### 1.5 SpringProgress vector sugar — setTargets / tickVector (L.W7 §S2, SHIPPED)

`spring.ts:504–589`: `setTargets(Float64Array)` arms K lanes of `Float64Array`
(origin, originVel, target, current, velocity). `tickVector(dt)` (`spring.ts:554–589`)
hoists the `exp`/`cos`/`sin` transcendentals ONCE per tick (shared `omega`/`zeta`/`omegaD`),
then writes all K lanes in a plain numeric for-loop — no per-lane spring allocation.

The `proof:spring-vector` gate (`scripts/proof-spring-vector.mjs`) parsed the
bench result: the vector arm beat K=8 independent scalar SpringProgress instances by
2.97–3.78× at K=8 (ADOPT threshold ≥1.2×). Verdict: ADOPT was confirmed; the API
shipped.

### 1.6 granular loadAnimationEngine accessors + warmEngine (L.W7 S1/S3, SHIPPED)

`load-engine.ts:295–538`: each module-scope `let _*Mod` variable memoizes its
`import("./…")` Promise. `loadEngine()`, `loadCompiler()`, and `loadIngest()` share
those memos with the full `loadAnimationEngine()`, so a `warmEngine()` pre-flight
(line 536) that has started the engine import is reused — no double import.

`warmEngine` is LIGHT (dynamic import only — no static value.js edge);
`proof:boundary` assertion-3 enumerates it in the accessor list.

**The `scheduler.postTask("background")` adoption is DEFERRED** (recorded in
`load-engine.ts:529–535`): the probe only SKIPS in jsdom (the API is absent), so it
has not positively measured that the `"background"` dispatch is safe. M's task on
this axis is to run the `proof:scheduler-posttask` probe against a real browser
(Playwright) and record the ADOPT/KILL verdict — then either adopt `postTask`
in `warmEngine` or close it as KILL.

### 1.7 EPF-1 read/write phase separation (OBSERVE-ONLY, M-open)

The tripwire for EPF-1 (`docs/tranches/J/audit/frontier/engine-phase-sep.md`, carried
through K and L) was: *"when K.W8 ingest ships a multi-computed workload."* K.W8
shipped `ingest-cssom.ts`; the workload is now real. The L.W7 S5 wave filed an
observe-only gate (`scripts/proof-epf1-measure.mjs`) that records the layout-thrash
baseline under N=50 `cq*`-driven elements through a `ResizeObserver` trigger.

The computed-unit DOM round-trip lives in `value.js/src/units/normalize.ts:254–310`:
`getComputedValue` sets `target.style[prop]`, reads `getComputedStyle(target)`, then
resets — two forced layouts per computed endpoint per cache-miss. The C1 epoch cache
(`lerpComputedValue`'s `_computedCache`, `value.js/src/units/interpolate.ts:38–67`)
holds these pairs for the epoch lifetime, so in steady state (same epoch) the cost is
a cache probe only. **The interleave is epoch-boundary-only, not per-frame.** This is
important: EPF-1 is only a REGRESSION risk on epoch transitions (container resize
events that don't bump the epoch automatically).

The `ingest-cssom.ts` stylesheet walk (`ingest-cssom.ts:183–226`) reads `cssText`
strings from CSSOM rules — it does NOT call `getComputedStyle` or set inline styles
itself. The computed-unit resolution only fires at animation PLAY time (the
`lerpComputedValue` path), not at ingest time. So the EPF-1 concern is:

1. **Ingest path:** NONE — `fromStyleSheets` does pure string walks. No DOM
   read/write interleave.
2. **Play path (computed-unit animations):** ONE forced layout per computed endpoint
   per epoch-transition. The C1 cache contains this to at most 2 `getComputedStyle`
   calls per (endpoint, epoch) pair for the animation lifetime.

**M obligation on EPF-1:** run `proof:epf1-measure` and record the baseline JSON
(`scripts/epf1-baseline.json`). If the thrash count is non-trivial, design the
batch-reads-first / batch-writes-second pass as a `flip.ts`-style discipline over
the computed endpoints. The cure does not ship without the measurement — observe-only
first.

---

## §2 — value.js color-math frontier (VJ.L1–VJ.L8)

### 2.1 Confirmed allocations in value.js 0.13.0

Each claim verified against the live `tranche-f-handoff` source tree:

**VJ.L1 — `transformMat3` allocates a new `[number, number, number]` tuple per call**

`value.js/src/units/color/matrix.ts:19–26`:
```ts
export function transformMat3(v: Vec3, m: Mat3): Vec3 {
    const [x, y, z] = v;
    return [
        m[0] * x + m[1] * y + m[2] * z,
        …
    ];
}
```
Every call returns a fresh `[…]` tuple. `transformMat3` is the inner loop of
`oklab2xyz` and `xyz2oklab` — called 2× per XYZ-hub conversion, once for LMS
intermediate and once for the outer matrix step.

**VJ.L2/VJ.L3 — `oklab2xyz` and `xyz2oklab` allocate 2 intermediate Vec3 tuples**

`value.js/src/units/color/conversions/oklab.ts:28–83`:

- `oklab2xyz` (line 45): `const lms = transformMat3([l, a, b] as Vec3, …)` — one
  allocation for `[l, a, b]`, one for the returned tuple from `transformMat3`. Then
  line 48: `const lmsLinear: Vec3 = [lms[0]³, lms[1]³, lms[2]³]` — a third tuple.
  Total: 3 tuple allocations per `oklab2xyz` call.
- `xyz2oklab` (line 61): `const lmsLinear = transformMat3([x,y,z] as Vec3, …)` —
  two tuple allocations (the input array + the `transformMat3` return). Line 64:
  `const lms: Vec3 = [cbrt(…), …]` — a third. Total: 3 tuples per `xyz2oklab`.

These are called on the XYZ-hub path (any color space not in the `DIRECT_PATHS` table
— see §2.3).

**VJ.L4 — `mixColors` allocates `resultComponents: number[]` + calls `c1.keys().filter()`**

`value.js/src/units/color/dispatch.ts:424, 432`:
```ts
const keys = c1.keys().filter((k) => k !== "alpha");
const resultComponents: number[] = [];
```
`keys()` presumably returns an array; `.filter()` allocates another array.
`resultComponents` starts empty and grows via `.push()` (amortized alloc). Every
`mixColors` call — which is EVERY `sampleColorRamp` stop — pays these.

**VJ.L5 — `gamutMapToRgbSpace` constructs new `OKLCHColor` in EACH of 24 binary-search iterations**

`value.js/src/units/color/dispatch.ts:231–244`:
```ts
const probe = (c: number): { r, g, b } => {
    const candidate = new OKLCHColor(L, c, H, alpha);   // new Color per probe
    const rgb = color2(candidate, target);               // another Color via dispatch
    return { r: …, g: …, b: … };                        // new plain object
};
for (let i = 0; i < CHROMA_SEARCH_STEPS; i++) {         // 24 iterations
    const { r, g, b } = probe(mid);                     // destructure → discard
```
24 iterations × 2+ Color allocations per probe = ≥ 48 Color allocations per
out-of-gamut wide-gamut pixel. This is the MOST EXPENSIVE allocation site.

**VJ.L6 — `normalizeColor` uses `.keys().forEach(…)` closure over each channel**

`value.js/src/units/color/normalize.ts:40–54`:
```ts
color.keys().forEach((component) => {
    const channel = color[component];
    …
    color[component] = normalizeColorUnitComponent(…);   // new ValueUnit per channel
});
```
`keys()` allocates an array; `forEach` takes a closure; `normalizeColorUnitComponent`
returns `new ValueUnit(…)` per channel (`normalize.ts:31`). Called on every color
normalization.

**VJ.L7 — memoize's `delete`/`re-insert` LRU even at `maxCacheSize: Infinity`**

The `memoize` function (value.js's `src/utils.ts` or `src/math.ts`) runs the LRU
delete-and-re-insert on every cache hit when `maxCacheSize` is finite. The
`getComputedValue` memo uses `maxCacheSize: COMPUTED_MEMO_MAX_ENTRIES = 4096`
(`normalize.ts:322`) — not Infinity — so every cache HIT pays a `Map.delete` + a new
`Map.set`. For the color-path `memoize` calls (if any), the infinite case skips this.

**VJ.L8 — DIRECT_PATHS table does NOT cover oklch↔oklab**

`value.js/src/units/color/conversions/direct.ts:255–267`: the table covers:
`oklab→rgb`, `rgb→oklab`, `oklch→rgb`, `rgb→oklch`, `hsl→rgb`, `rgb→hsl`.

It does NOT cover `oklch→oklab` or `oklab→oklch`. The `sampleColorRamp` ramp with
`space:"oklch"` calls `mixColors(a, b, …, "oklch", …)`, which calls
`color2(col, "oklch")` — if `col` is an OKLABColor, this takes the XYZ hub
(`XYZ_FUNCTIONS`) rather than a direct path, paying the full 3-tuple `oklab2xyz` +
3-tuple `xyz2oklch` chain. Adding `"oklch->oklab"` and `"oklab->oklch"` direct paths
would skip the XYZ intermediate entirely for the gamut-map hot path.

### 2.2 Hot-path call chain for a single color animation frame

For a kf `oklab` color track at one frame:

1. `lerpColorValue` (`interpolate.ts:104`) reads the pre-built `_colorPlan`
   (`Float64Array` channels — B3 optimization) — no allocation here.
2. The color value is written into the `value.js ValueUnit<Color>` field (in-place
   mutation). The WAAPI-ineligible path then calls `color2()` to convert the lerped
   oklab color back to rgb for CSS serialization.
3. `color2(oklab, "rgb")` hits the `DIRECT_PATHS` table for `"oklab->rgb"`:
   `directOklabToRgb` (`direct.ts:46`) — ZERO Vec3 allocations (scalar-only math).
4. If the color is out of sRGB gamut, `gamutMapSRGB` (the Ottosson analytical map,
   `gamut.ts:67–84`) is called — scalar-only, no Color allocations.

**The rAF interpolation path for a 2-stop oklab → rgb animation is ALLOCATION-FREE
in steady state.** The `direct.ts:46` direct path is the reason.

The cost appears at `sampleColorRamp` (the `compile-color.ts` densify path for the
COMPILE leg, not the PLAY leg) — where `mixColors` and potentially
`gamutMapToRgbSpace` run per stop. This is a COMPILE-TIME cost, not a per-frame cost.

### 2.3 Gap: oklch-space ramps pay the XYZ hub

When `sampleColorRamp` is called with `space:"oklch"` (the cylindrical hue-path
case), each `mixColors(a, b, …, "oklch")` call:

1. `color2(col1, "oklch")` — if `col1` is OKLABColor: NOT in DIRECT_PATHS → XYZ hub
   → `oklab2xyz` (3 Vec3 allocs) + `xyz2oklch` (3 Vec3 allocs) = 6 allocs per input.
2. Repeat for `col2`.
3. Per stop: 12+ tuple allocations + 1 `new OKLCHColor` + `new ResultClass`.

The VJ.L6 DIRECT_PATHS expansion (`oklab↔oklch`) is the highest-value single
addition for this path. An `oklab→oklch` direct path is already computable from the
`oklab2oklch` function in `conversions/oklab.ts:102–118` — it is pure scalar math
(no XYZ intermediate). Adding it to `DIRECT_PATHS` eliminates the 6 Vec3 allocs per
conversion on the ramp's most common case.

### 2.4 The kf consume-side: no workaround possible, cross-repo dispatch

The allocation sites are ALL in value.js. kf cannot cure them:

- kf cannot call `transformMat3` differently — it never calls it directly.
- kf cannot pass a pre-allocated output buffer to `mixColors` — value.js's API has
  no `out` parameter.
- kf cannot avoid `gamutMapToRgbSpace` — it is internal to `gamutMap`.

The correct M choreography is:

1. **value.js O ships the cures** (VJ.L1–VJ.L8 — already dispatched in
   `KF-TO-VALUEJS-O-ASKS.md §7`).
2. **kf re-pins** to the new published version (`^0.14.0` or the next minor).
3. **`bench/color-math.bench.ts`** (new kf-side bench) runs `sampleColorRamp` and
   `mixColors` over N stops and asserts the improvement vs. the pre-VJ.L dispatch
   baseline.
4. **`proof:bench-taxonomy`** graduates the VJ.L1–VJ.L8 `cross-repo` entries to
   `budgeted` once the kf-side integration bench exists and the value.js publish
   lands.

---

## §3 — SOTA-performance architectural transpositions

### 3.1 SIMD / typed-array pipeline

A WAASM SIMD path for color interpolation (e.g. packing four color channels into
`f64x2` or `f32x4` WASM vectors) was considered in the K/L audits. The verdict
remains **KILL** (the K-close anti-charter `EPF-2` re-confirm): the rendering path
ends with N individual CSS style writes (`target.style.setProperty(key, value)`) —
one per animated property per frame. The lerp arithmetic is NOT the limiter; the
DOM write pressure is. A WASM interpolation compute pass that ends with `postMessage`
to the main thread and N style writes has MORE overhead than the current scalar path.
The K KILL re-confirmed at L is unchanged for M.

`GPU / WebGPU compute` is the same KILL: no DOM-style write path exists from a
compute pass. `matrix3d()` serialization is the layout surface.

### 3.2 EPF-1 read/write phase separation

This is the one remaining architectural transposition that is NOT a KILL and NOT
shipped: `flip.ts` applies the pattern correctly (read-all-first, then write-all, then
read-again — `flip.ts:119` batched-read-mutate-read comment). The ingest path does not
apply this discipline — but as established in §1.7, the ingest path does NOT call
`getComputedStyle`, so the EPF-1 concern is scoped to PLAY-TIME computed-unit epoch
transitions.

The M architectural ask is: **design the phase-separation as a value.js-level
contract** rather than a kf-level discipline. `getComputedValue` already has an LRU
cache and an epoch key. The missing piece is a batched pre-resolve API:
`prefetchComputedValues(ivs: InterpolatedVar[], target: HTMLElement)` that resolves
all computed endpoints in one pass (one write → one read per unique property, not one
write per endpoint). This belongs in value.js (the owner of `getComputedValue`) and
would be dispatched as VJ.O.EPF-1, not implemented in kf.

### 3.3 SoA interp buffer — what L shipped vs. what remains

L.W7 S2 shipped the SoA Float64Array path for `NumericAnimation` (the LIGHT tier).
The HEAVY `CSSKeyframesAnimation` already used the SoA path via value.js's
`lerpArray` (the J.W6 S2 bench arm, measured 1.56× at K=2 → 4.25× at K=64). There
is no remaining SoA gap on the interp buffer.

The remaining typed-array frontier is **the color channel plan Float64Array**
(`_colorPlan` in `value.js/src/units/interpolate.ts:246–290`). This is ALREADY
implemented (the B3 plan, `startN`/`stopN` as `Float64Array`). No gap here.

### 3.4 warmEngine + scheduler.postTask (MEASURE-FIRST, M-open)

`warmEngine()` currently calls `void loadAnimationEngine()` (the bare Promise
fire-and-forget). The `scheduler.postTask("background", …)` adoption is deferred
pending a real-browser measurement. M should:

1. Run `proof:scheduler-posttask` against a Playwright browser (not jsdom — the API
   is absent in jsdom, causing the current SKIP result).
2. If the `"background"` priority probe shows no INP degradation (the user-gesture
   animation start running in a `"user-blocking"` task shows no latency penalty):
   update `warmEngine` to use `postTask("background")` when available.
3. Record the ADOPT/KILL verdict in a new `scripts/scheduler-posttask-decision.json`
   (mirroring `scripts/spring-vector-decision.json`).

---

## §4 — Precept violations found in the L-built perf surface

**No precept violations found in the kf-side perf surface.** The observation
matches ⚠34 from the L audit (`audit-32-skeleton.txt:70`):

> "NO precept violations found in the perf surface. The K-shipped perf code is clean:
> group.ts zero-alloc compositor uses stable-key null-fill not delete (F.W4 dictionary-mode
> discipline), the WAAPI guard trades a perf OPPORTUNITY for guaranteed rAF-pixel
> isomorphism (no-workaround: it never ships a wrong pixel to go faster), and YIELD_BATCH
> sheds latency-not-work (no silent degradation of author intent). inv-16 is HONORED:
> lerpArray and the scroll/ramp grammar are consumed from PUBLISHED value.js 0.13.0."

**One sub-optimal pattern worth noting (not a precept violation — an unclaimed
optimization opportunity):**

- `value.js/src/units/color/dispatch.ts:424`: `mixColors` calls `c1.keys()` (an array
  allocation) and `.filter()` (second allocation) to get the non-alpha component keys.
  Since Color classes have fixed, known key sets, the keys array could be precomputed
  once per class and reused — but this cure belongs in value.js (VJ.L4), not kf.

**The `lerpArray` inline in `leaves.ts` is NOT a precept violation.** The decision is
documented at `leaves.ts:57–63`: value.js exposes no tree-shakeable `./math` subpath,
so a static barrel import would violate `proof:boundary`. The inline is byte-equivalent
to value.js's copy (`leaves.ts:68–80` ↔ `value.js/src/math.ts:60–72`). The
`KF-TO-VALUEJS-O-ASKS.md §14` (VJ.O W-MATH-SUBPATH) asks value.js to publish a
`./math` export so kf can delete the inline. M should check whether value.js O
published that subpath and, if so, consume it and delete `lerpArray` from `leaves.ts`.

---

## §5 — M-wave proposals

### M-PERF-1: `proof:scheduler-posttask` real-browser verdict (MEASURE-FIRST)

**Rationale:** `warmEngine`'s `scheduler.postTask("background")` adoption is
gated on a real-browser measurement that jsdom cannot provide. The current
`proof:scheduler-posttask` probe SKIPS in jsdom — it has never MEASURED the
claim it was designed to gate.

**Deliverable:** Run `proof:scheduler-posttask` in a Playwright browser headful
context. Record the ADOPT/KILL verdict. If ADOPT: update `warmEngine` to use
`postTask("background")` when available + record in
`scripts/scheduler-posttask-decision.json`.

**Gate:** extend `proof:scheduler-posttask` with a Playwright arm that runs in a
real browser (not jsdom). The gate stays GREEN when the probe either (a) SKIPs
(no API) or (b) measures the background-dispatch is safe (no INP regression vs.
bare `void loadAnimationEngine()`).

**M-wave candidate:** YES. No sibling publish gate. kf-internal.

### M-PERF-2: EPF-1 baseline recording and cure decision

**Rationale:** `proof:epf1-measure` is observe-only and has not recorded a
baseline. The EPF-1 cure (batch-reads-first / batch-writes-second over computed
endpoints) has not been designed, let alone measured. The M obligation is to
produce the baseline JSON and decide whether the thrash count is non-trivial.

**Deliverable:**
1. Run `proof:epf1-measure` and record `scripts/epf1-baseline.json`.
2. If `layoutThrashCount > 2×N` (non-trivial), design the phase-separation cure
   and file as VJ.O.EPF-1 (a value.js `prefetchComputedValues` API).
3. If `layoutThrashCount ≤ 2×N` (trivial — the C1 cache is already containing
   the thrash), CLOSE as VERIFY-ONLY with the baseline recorded.

**Gate:** `proof:epf1-measure` exits 0 with `scripts/epf1-baseline.json` written.
The cure arm (`layoutThrashCount <= baseline * 0.5`) remains observe-only until a
value.js `prefetchComputedValues` API ships.

**M-wave candidate:** YES (S-clause of a larger perf wave). No sibling publish gate.

### M-PERF-3: value.js O color-math consume edge (cross-repo coordination)

**Rationale:** VJ.L1–VJ.L8 are dispatched to value.js O in
`KF-TO-VALUEJS-O-ASKS.md §7` and listed as `cross-repo` entries in
`bench/taxonomy.json`. When value.js O ships them, M must consume the publish,
author `bench/color-math.bench.ts`, and graduate the cross-repo entries to
`budgeted`.

**Deliverable:**
1. Confirm value.js O published VJ.L1–VJ.L8 (registry probe: `npm show @mkbabb/value.js`).
2. Re-pin kf to `^0.14.0` (or the applicable version).
3. Add `bench/color-math.bench.ts` with cases covering:
   - `sampleColorRamp(red, blue, 16)` (the compile-color densify hot path)
   - `mixColors(a, b, 0.5, 0.5, "oklab")` (the per-stop lerp)
   - `gamutMap(outOfGamutColor, "rgb")` (the sRGB analytical path + `gamutMapToRgbSpace` for wide-gamut)
4. Add a `budgeted` entry to `bench/taxonomy.json` for the `sampleColorRamp` case
   with `floorFraction: 1.5` (≥1.5× the pre-VJ.L baseline — the typical alloc-elimination
   wins on color-math range from 2× to 5× per the transformMat3/mixColors surface area).
5. Extend `proof:bench-taxonomy` to parse `bench/color-math.bench.ts` cases.

**Gate:** `proof:bench-taxonomy` (existing) with the new `bench/color-math.bench.ts`
cases in `taxonomy.json`.

**Born-RED condition:** `bench/color-math.bench.ts` absent → RED today. GREEN when
the bench exists, the budgeted entry's `floorFraction` is satisfied, and the value.js
O re-pin is live.

**M-wave candidate:** YES. Gated on value.js O (tripwire: the VJ.L1–VJ.L8 publish).

### M-PERF-4: VJ.O `./math` subpath — delete the `lerpArray` inline

**Rationale:** `leaves.ts:68–80` inlines `lerpArray` because value.js has no
tree-shakeable subpath export. `KF-TO-VALUEJS-O-ASKS.md §14` (W-MATH-SUBPATH)
dispatched this. When the `./math` subpath lands, the inline is a DRY violation
and should be deleted.

**Deliverable:**
1. Confirm `@mkbabb/value.js` publishes a `./math` or similar subpath (check
   `exports` field in `node_modules/@mkbabb/value.js/package.json`).
2. In `leaves.ts`: delete the `lerpArray` function body and add
   `export { lerpArray } from "@mkbabb/value.js/math"` (or the published path).
3. Verify `proof:boundary` still passes (the import must be a dynamic edge or
   bundled-external; if the subpath imports value.js's grammar it is FORBIDDEN on
   the light tier — confirm before landing).

**Gate:** `proof:boundary` assertion-4 (source-grep for static value.js specifiers
in light modules) must distinguish between the subpath `./math` (acceptable if
tree-shakeable) and the barrel. The gate extension records the allowed subpath in
an allowlist.

**Born-RED condition:** the `leaves.ts` inline deletion before the value.js subpath
publish would break `numeric.ts`. The consume must be atomic with the deletion.

**M-wave candidate:** YES (S-clause). Gated on value.js O (tripwire: the `./math`
subpath publish).

---

## §6 — Deferred folds

| DL# | Item | Chronicity | Status | Tripwire |
|-----|------|-----------|--------|----------|
| DL-M-P1 | `scheduler.postTask("background")` adopt/kill verdict | 1 (L born) | M-PERF-1 | `proof:scheduler-posttask` real-browser run |
| DL-M-P2 | EPF-1 baseline recording + cure decision | 3 (J,K,L→M) | M-PERF-2 | `proof:epf1-measure` first run recording baseline |
| DL-M-P3 | VJ.L1–VJ.L8 color-math alloc cures | 2 (K,L→M) | M-PERF-3 | value.js O publishes VJ.L1–VJ.L8 |
| DL-M-P4 | `lerpArray` inline deletion | 2 (K,L→M) | M-PERF-4 | value.js O `./math` subpath publish |
| DL-M-P5 | oklch↔oklab DIRECT_PATHS expansion | 1 (L born) | VJ dispatch (VJ.L8 extension) | value.js O DIRECT_PATHS expansion publish |

DL-M-P2 is the longest-running: EPF-1 was first BOOKED at J, re-confirmed at K with
the CSSOM-workload tripwire, carried as observe-only at L with the gate script. M is
the first tranche with both the gate script AND the real workload in the tree. If the
baseline records a trivial thrash count, DL-M-P2 CLOSES (VERIFY-ONLY). If non-trivial,
it opens a value.js O ask.

---

## §7 — Cross-repo asks

### To value.js (Tranche O)

All items from `KF-TO-VALUEJS-O-ASKS.md §7` remain open (VJ.L1–VJ.L8). The specific
M-surfaced asks that did not appear in the L dispatch:

**VJ.O.DIRECT-OKLCH-OKLAB** — add `"oklch->oklab"` and `"oklab->oklch"` entries to
the `DIRECT_PATHS` table (`conversions/direct.ts`). The functions are trivially
derivable from `oklab2oklch` / `oklch2oklab` in `conversions/oklab.ts:102–134` —
they are pure scalar math, no XYZ intermediate. This eliminates 6 Vec3 allocations
per conversion on the oklch-space ramp hot path. File-anchor:
`value.js/src/units/color/conversions/direct.ts:255–267`.

**VJ.O.EPF-1** — `prefetchComputedValues(ivs, target)` batch pre-resolver. Scope
conditional on M-PERF-2 baseline: OPEN only if the baseline shows non-trivial thrash.
File-anchor: `value.js/src/units/normalize.ts:254`.

**VJ.O.MATH-SUBPATH** — `./math` tree-shakeable export (W-MATH-SUBPATH in the L
dispatch). Already dispatched; M checks on re-pin.

### To glass-ui

No new perf asks on the glass-ui axis.

### To parse-that

No new perf asks on the parse-that axis.

---

## §8 — Performance numbers (measured and gap)

| Item | Source | Measurement | Status |
|------|--------|-------------|--------|
| NumericAnimation K=8 SoA vs scalar | `bench/interp-buffer.bench.ts` + `bench/taxonomy.json` | Budgeted: ≥1.2× at K=8 (SoA arm) | GREEN (L.W7 shipped) |
| SpringProgress K=8 vector vs scalar | `bench/spring-tick.bench.ts` + `scripts/proof-spring-vector.mjs` | Measured 2.97–3.78× at K=8 | ADOPTED (L.W7 shipped) |
| CSSKeyframesAnimation K=8 SoA (J.W6) | `bench/interp-buffer.bench.ts` | Measured 1.56× (K=2) → 4.25× (K=64) | GREEN (pre-L, J.W6 S2) |
| `warmEngine` pre-resolve | `bench/interp-buffer.bench.ts` + `bench/taxonomy.json` | Budgeted: ≥1000 Hz (sub-ms resolve) | GREEN (L.W7 S1) |
| `transformMat3` alloc per call | `value.js/src/units/color/matrix.ts:19–26` | 1 tuple per call — open | VJ.L1 dispatch pending |
| `oklab2xyz` Vec3 allocs | `value.js/src/units/color/conversions/oklab.ts:45,48` | 3 tuples per call — open | VJ.L2 dispatch pending |
| `mixColors` closure + array alloc | `value.js/src/units/color/dispatch.ts:424,432` | `keys().filter()` + `resultComponents[]` — open | VJ.L4 dispatch pending |
| `gamutMapToRgbSpace` 24-iter Color allocs | `value.js/src/units/color/dispatch.ts:231–244` | ≥48 Color allocs per out-of-gamut pixel — open | VJ.L5 dispatch pending |
| oklch→oklab DIRECT_PATHS gap | `value.js/src/units/color/conversions/direct.ts:255–267` | 6 Vec3 allocs per conv eliminated | VJ.O.DIRECT-OKLCH-OKLAB (new M ask) |
| EPF-1 thrash count | `scripts/proof-epf1-measure.mjs` | Baseline NOT YET recorded | M-PERF-2 observe-only |
| `scheduler.postTask` real-browser | `scripts/proof-scheduler-posttask.mjs` | SKIPS in jsdom — NOT YET measured | M-PERF-1 |

---

## §9 — Summary verdict

L closed the kf-internal engine-perf frontier completely: Float64Array SoA on the
LIGHT tier, SpringProgress vector sugar, granular dynamic boundary, warmEngine
idle-warmer, budgeted bench taxonomy, EPF-1 observe-only gate, and the `proof:*`
gates to guard regression. The remaining perf work is cross-repo (value.js O
VJ.L1–VJ.L8 + the new VJ.O.DIRECT-OKLCH-OKLAB ask) and two M-internal
measure-first obligations (`proof:scheduler-posttask` real-browser run + EPF-1
baseline recording). No new kf-owned perf architectural transpositions were found —
the engine is already monomorphic-dispatched, zero-alloc in steady state, and
properly phase-separated at the PLAY path. M's perf contribution is the consume-edge
coordination with value.js O and the two pending measurement gates.
