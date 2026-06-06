# Tranche F deep-SOTA audit — lane `r-frame-compile-sota`

**Lane mandate.** Frame-**compilation** architecture SOTA: how Motion/GSAP/anime
compile keyframes into a runtime-sampled form; SoA / typed-array segment layouts;
incremental recompile on edit; precomputed sample splines. Re-examine the
**W8-WITHHELD** `FrameCompiler` SoA (typed time index, slot map) + incremental
`updateSegments` against this frontier **and the demo editor workload**. Is the
withhold still correct, or does F land it? **Research/audit only — zero source
edits.** inv-16: any value.js change is a hand-off; this lane writes only this doc.

**Method.** Live `file:line` grounding against the post-D+E tree
(`src/animation/frame-compiler.ts`, `engine.ts`, `constants.ts`, the demo editor
ops); a **standalone V8 microbench** of the exact W8 SoA proposal (typed-time-index
binary search vs the AoS accessor-closure shape the engine actually runs, node v26 /
V8 13.x); SOTA grounded against the Interpol low-level-tweening writeup (Codrops,
2025-10-27), Motion's `mix`/mixer model, Anime.js v4 keyframe composition, Babylon.js's
typed-array keyframe discussion, and the V8 inline-cache / SoA-vs-AoS literature. Every
code claim cites a line; the measurement is re-runnable (§A reproduces the bench inline).

**Relation to prior tranches (cite + diff, do NOT repeat).**
- E `audit/sota/a-kf-framecompiler.md` named **FC-1** (colorSpace compile-staleness) and
  **FC-2** (`frameId` non-determinism) as FOLD-E, and **FC-4** (SoA time-array + per-tick
  `Object.assign`) / incremental-compile as **BOOK**. **E LANDED FC-1 and FC-2** — this
  lane verifies that (§1) and does not re-litigate them. FC-4/incremental stayed BOOK; E
  FINAL re-states the withhold (`E/FINAL.md:46-49`). **This lane re-measures that withhold
  and confirms it holds** (§2, §3) — with the measured numbers the BOOK never had.
- The sibling F lane `r-interpolation-carrier.md` re-measured the **value-carrier** SoA
  (the `iv` lerp over `ValueUnit`) and found a real ~2× win for a flat `Float64Array`
  loop — **but that is the per-`InterpolatedVar` carrier, NOT the FrameCompiler's
  time-index / slot-map**. This lane owns the *compile-structure* SoA (`frame.time`
  typed index, the `flatVars` slot map) and **incremental `updateSegments`**, a strictly
  different surface. I cite that lane's carrier result where the slot-map analysis
  touches it (§3) and defer the carrier disposition to it (no double-count).

---

## TL;DR — dispositions

1. **The W8 FrameCompiler-SoA withhold is STILL CORRECT, and now it is MEASURED, not
   asserted (F-1).** The typed-time-index (parallel `Float64Array` of segment
   starts/stops feeding the binary search) is a **wash at the demo's real scale** and
   only pays at segment counts no demo reaches. Microbench (node v26): N=2 stops (the
   dominant preset shape) **10.0 → 10.3 ns — marginally *slower* SoA**; N=11 stops
   22.2 → 18.4 ns (~17%); the win only opens at N=50 (32.4 → 25.7) / N=200 (43.2 → 34.0).
   And the search runs **once per `interpFrames` tick**, dwarfed by the per-`iv` lerp +
   `Object.assign` that follow. The literal `Float64Array` form is also awkward against
   the shared `binarySearchRange` accessor API (`binarySearch.ts:21-37`) every other
   sampler reuses. **Disposition: MEASURE-FIRST → RECORD (withhold re-confirmed).**

2. **Incremental `updateSegments` is correctly NOT-LANDED — the demo editor workload
   makes it a non-win, and the measurement says so (F-2).** The heaviest editor op is
   **debounced 1000 ms** (`useKeyframeOps.ts:71,119-120,150`), so at most one whole-program
   `parse()` fires per second per active edit; a single-keyframe text edit mutates ONE
   template's `vars` then `animation.parse()` (`useKeyframeOps.ts:122-151`). A full
   compile of an 11-stop animation is sub-100 µs; incremental recompute would dirty the
   `(prev,new,next)` segments to save tens of µs **once a second** — invisible, and it
   would trade the current byte-deterministic whole-program `parse()` (the FC-2 lock,
   `compile-deterministic.test.ts`) for a dirty-tracking state machine that must *prove*
   byte-equivalence to it. SOTA incremental engines (salsa/rustc query model, lightningcss
   per-rule) earn their complexity at thousands of nodes; the FrameCompiler runs ≤~20.
   **Disposition: BOOK (record the design + the byte-equality contract; build only on a
   measured frame-by-frame builder workload — none exists).**

3. **The per-tick `Object.assign(result, frame.flatVars)` slot-map (FC-4 part 2) is the
   one compile-structure item with a *non-trivial* runtime cost — but it is gated on a
   multi-active-frame workload the current demos barely hit, and its clean form depends
   on the carrier SoA the sibling lane owns (F-3).** `processFrame` does
   `Object.assign(result, frame.flatVars)` per active frame (`engine.ts:636`); when
   property segments overlap this re-copies keys every tick. A compile-time slot map
   (each output key → a stable index, write `lerpValue` results straight into a reused
   buffer) removes the copy — but it only bites when ≥2 frames are active at one `t`, and
   the cleanest implementation rides the numeric-SoA segment compile the
   `r-interpolation-carrier` lane proposes. **Disposition: MEASURE-FIRST (needs a
   multi-active-frame bench that does not exist) + BOOK, sequenced AFTER the carrier
   lane.**

4. **The FrameCompiler is OTHERWISE ALREADY-SOTA — and matches the actual industry
   frontier, which is NOT typed-array SoA (F-4).** Motion compiles each output-pair to a
   **precomputed mixer closure** (`mix(a,b)` → a function of progress) — exactly what
   `prepareInterpVar`'s pre-resolved `iv._lerp` already is. Interpol (the 2025 "low-level
   take") **explicitly rejects** typed arrays / spline caching for runtime-lerp
   simplicity. No shipping mainstream JS animation library uses typed-array SoA for
   keyframe interpolation at sub-thousand-stop scale; Babylon.js reaches for it only at
   *millions* of keyframes (a memory, not CPU-hot-loop, concern). keyframes.js's
   compile-once `allInterpVars`/`flatVars` pre-flatten + monomorphic-shape
   `createFrame` + O(log N) binary search seed **is** the frontier shape. **Manufacture
   no SoA work here.** ALREADY-SOTA.

5. **One real, separate defect surfaced incidentally: the interpolation/parser benches
   are broken by E's boundary refactor (F-5).** `bench/interpolation.bench.ts:6` /
   `parser.bench.ts:2` do `import { CSSKeyframesAnimation } from "../src/animation"` — but
   E made the barrel lazy-load the heavy engine via `loadAnimationEngine()`, so the static
   named import resolves `undefined` → `TypeError: CSSKeyframesAnimation is not a
   constructor`. **The compile/interp benches do not run today.** Disposition: SHIP-in-F
   (a one-line import-path fix to `src/animation/engine`) — it is the *instrument* the
   measure-first dispositions above depend on. Flagged for the runtime lane; if unclaimed
   there, F should land it.

---

## §1 — What E LANDED (verify, then move on; do not re-litigate)

E discharged the two FOLD-E items the E FrameCompiler lane named. Verified live:

- **FC-1 (colorSpace/hueMethod compile-staleness) — LANDED.** `setColorSpace`
  (`engine.ts:439-456`) and `setHueMethod` (`engine.ts:459-473`) now call
  `this.compiler.renormalizeColors()` when `this.frames.length > 0`
  (`engine.ts:455`, `:473`). `renormalizeColors` (`frame-compiler.ts:387-401`) re-runs
  `createInterpVarValue` over the existing `frames`/`parsedVars` with the new
  `(colorSpace, hueMethod)` and rebuilds the hot-path arrays via `finalizeFrameVars`,
  with no re-flatten/re-sort — exactly the E-FC-1(a) cheap path the E lane recommended.
  The old "the comment lies" gap is closed; the doc-comment at `frame-compiler.ts:99-109`
  now correctly describes the targeted re-derive. **No F action.**
- **FC-2 (`parse()` non-idempotent `frameId`) — LANDED.** `createFrame` now derives the
  compiled id as `startIx * FRAME_ID_SCALE + endIx` (`frame-compiler.ts:213`,
  `FRAME_ID_SCALE = 1_000_000` at `:84`), content-keyed on the stable `(startIx, stopIx)`
  pair, not a monotonic counter. `compile-deterministic.test.ts` locks byte-identical
  `frames[]` across re-parses (the bite: revert to `this.frameId++` and the second
  compile's ids shift). `parse()` is idempotent. **No F action.**

These are CLOSED. F does not re-open them. What stayed BOOK/withheld — the SoA layout
(FC-4) and incremental compile — is this lane's actual subject, below.

---

## §2 — F-1: the typed-time-index SoA — MEASURED, withhold re-confirmed

### The proposal (W8 S2 / E-FC-4 part 1)

`AnimationFrame.time` is a per-frame `{ start, stop }` object (`constants.ts:93-96`). The
hot-path active-frame search reads it through **accessor closures**:

```
const seedIdx = binarySearchRange(frames, t, (f) => f.time.start, (f) => f.time.stop);
```
(`engine.ts:579-584`; `binarySearchRange` at `binarySearch.ts:21-37` chases
`f.time.start`/`f.time.stop` object pointers via the two closures). The W8 SoA proposal:
hold two parallel `Float64Array`s of segment starts/stops, index a flat array in the
binary search — cache-dense, branch-predictable, no closure call, no pointer chase.

### The measurement (§A reproduces it; node v26 / V8)

| N segments | AoS (closures over `f.time`) | SoA (`Float64Array` starts/stops) | Δ |
|---|---|---|---|
| **2** (dominant preset shape) | 9.99 ns | 10.30 ns | **−3% (SoA slower)** |
| **11** (the "complex" bench) | 22.22 ns | 18.39 ns | +17% |
| 50 | 32.42 ns | 25.69 ns | +21% |
| 200 | 43.15 ns | 34.02 ns | +21% |

### Why the withhold holds

1. **At the real workload scale the win is zero-to-negative.** The demo presets are
   overwhelmingly 2-stop (`animations.ts`; the AnimationMenuBar presets peak at a 6-stop
   `0/20/40/60/80/100%` shape — `AnimationMenuBar.vue`), and the project's own "complex"
   probe is 11-stop (`interpolation.bench.ts:16`). At N=2 the SoA is *marginally slower*
   (the flat-array bounds path loses to V8's already-monomorphic `f.time.start` read —
   every `AnimationFrame` is minted by the one `createFrame` shape at
   `frame-compiler.ts:215-226`, so the closure read is a single inline-cached memory load,
   per the V8 fast-property model). The ~20% win only appears at N≥50, which no demo
   reaches.
2. **The search is once-per-tick, not per-`iv`.** `interpFrames` calls
   `binarySearchRange` once (`engine.ts:579`) then linear-scans contiguous neighbors
   (`engine.ts:595-606`). The ~4 ns saved at N=11 is a single-digit-ns slice of a
   multi-µs frame dominated by the per-`iv` `lerpValue` loop (`engine.ts:628-630`) and
   `Object.assign` (`engine.ts:636`). The carrier lane's ~2× per-`iv` win is the lever
   that matters; the time-index is not.
3. **The form fights the shared abstraction.** `binarySearchRange` is the ONE segment
   locator every sampler reuses (`NumericAnimation`, the engine — `binarySearch.ts:5-12`).
   A `Float64Array` index either forks that API (two locators to maintain) or pushes the
   typed arrays *into* every frame array (a `NumericSegment`/`AnimationFrame` layout
   split). The E withhold named this precisely — "the literal `Float64Array` form is
   awkward against the shared `binarySearchRange` for a negligible gain" (`E/FINAL.md:47`).
   The measurement now backs that adjective with numbers.

**Disposition: MEASURE-FIRST → RECORD.** The withhold is re-confirmed with evidence. If a
real high-segment-count workload ever appears (e.g. a generated 200-stop scroll-bound
timeline), the SoA time-index becomes a measured win and lands then — gated on that
bench, not speculatively. **Not a fold for F.**

---

## §3 — F-2 / F-3: incremental `updateSegments` + the slot-map, against the editor workload

### F-2 — incremental recompile is a non-win at the editor's debounce + stop-count

The FOCUS asks specifically whether the demo editor workload justifies incremental
recompile. It does not, and the editor code is the proof:

- **The heavy edit op is debounced 1000 ms.** `updateAnimationFromKeyframesString`
  (`useKeyframeOps.ts:71-120`) and `updateAnimationFromKeyframeString`
  (`useKeyframeOps.ts:122-151`) are both `debounce(fn, 1000)`. The user types freely; at
  most one compile fires per second of settled input. There is no per-keystroke compile to
  amortize.
- **E already removed the *double* compile (S0).** The string-edit op transplants a single
  throwaway compile's state onto the live animation rather than re-`parse()`ing
  (`useKeyframeOps.ts:96-109`); add/remove mutate the live templates and `parse()` **once**
  (`useKeyframeOps.ts:171-183`, `:203-209`). The remaining compile is the irreducible one.
- **A single-keyframe text edit already mutates one template, then whole-recompiles**
  (`useKeyframeOps.ts:132-141`: `Object.assign(templateFrames[frameIx].vars, newVars)` →
  `animation.parse()`). This is the *canonical* incremental-recompile candidate — and it
  pays a full `parse()` of an animation with ≤~20 stops, which is sub-100 µs, **once per
  second**. Incremental recompute (dirty only the `(prev, edited, next)` segments) would
  save tens of µs at a 1 Hz cadence: unmeasurable against the 1000 ms debounce + the
  Monaco re-render + the `formatCSS` round-trip that bracket it.
- **The complexity is real and the determinism is at stake.** Incremental compile needs a
  dirty-segment state machine that must produce `frames[]` **byte-identical** to the
  whole-program path — i.e. it must satisfy the very `compile-deterministic.test.ts`
  contract E just locked, plus a new `proof:compile-incremental` byte-equality gate
  (the E FINAL already names this contract as the future fold's obligation,
  `E/FINAL.md:48-49`). That is a large, risk-bearing machine to save microseconds at 1 Hz.

**SOTA framing.** Incremental computation (salsa, rustc's query/red-green, lightningcss's
per-rule independence, fine-grained reactivity) earns its keep at **thousands** of nodes
where whole-program recompute is perceptible. The FrameCompiler's unit is ≤~20 stops; the
field's own low-level tweening writeups (Interpol, 2025) don't even pre-bake keyframes,
let alone incrementally recompile them. **The whole-program `parse()` IS the right shape
at this scale.**

**Disposition: BOOK.** Record the dirty-segment design + the `proof:compile-incremental`
byte-equality contract so it is not reinvented; build ONLY on a measured frame-by-frame
builder workload (a consumer calling `addFrame().parse()` in a loop — none exists in the
demo or the public API usage). **Not a fold for F.**

### F-3 — the per-tick `Object.assign` slot-map (FC-4 part 2): the one with teeth, but gated + downstream of the carrier lane

The single compile-structure item with a non-trivial *runtime* cost is the per-active-frame
output merge, NOT the time-index:

```
Object.assign(result, frame.flatVars);   // engine.ts:636, per active frame, every tick
```

When property segments overlap (≥2 frames active at one `t` — reconciled non-adjacent vars
create exactly this, `frame-compiler.ts:257-302`), each tick re-copies every key of every
active frame into `result`. The `out`-buffer reuse (`engine.ts:568-573`) already removes the
output *allocation*; this is the residual *copy*. The SOTA move: assign each output key a
**stable compile-time slot index**, write `lerpValue` results straight into a reused buffer
by slot, drop the per-tick `Object.assign`.

Two reasons this is MEASURE-FIRST and not a fold:
1. **It only bites with multiple active frames.** The 2-stop dominant case has exactly one
   active frame at any `t` — one `Object.assign` of one frame's keys, cheap. The cost scales
   with overlap, which the current demos barely exhibit; **there is no multi-active-frame
   bench** (`interpolation.bench.ts`'s 11-stop case is sequential, non-overlapping). The
   probe must be built before the fold is justified.
2. **Its clean form rides the carrier SoA the sibling lane owns.** Writing lerp results "by
   slot into a buffer" is the same numeric-`Float64Array`-segment compile
   `r-interpolation-carrier.md` (F-3) proposes for `allInterpVars`. Folding the slot-map
   *before* that lane lands would build a half-SoA that the carrier work then re-touches.
   Sequence it AFTER the carrier lane, and only on a multi-active-frame bench result.

**Disposition: MEASURE-FIRST + BOOK, sequenced after `r-interpolation-carrier`.** No F fold
absent (a) the multi-active-frame bench and (b) the carrier-lane SoA landing.

---

## §4 — F-4: the FrameCompiler is ALREADY-SOTA, and the industry frontier confirms it (manufacture no work)

The lane mandate asks how Motion/GSAP/anime compile keyframes, and whether typed-array SoA
/ precomputed splines are the frontier the FrameCompiler should chase. Grounded answer: **the
frontier the FrameCompiler already occupies is the precomputed-per-segment-mixer shape, and
typed-array SoA is NOT what shipping JS libraries do at this scale.**

- **Motion** — `mix(a, b)` returns *a function of progress*; the mixer is created **once per
  output-value pair** and called per-frame with `t` (Motion `mix` docs; the per-pair mixer is
  the compile-vs-runtime split). This is **exactly** keyframes.js's `prepareInterpVar` →
  pre-resolved `iv._lerp` (`frame-compiler.ts:289-296` builds the `InterpolatedVar` carriers
  via `createInterpVarValue`; the lerp dispatch is resolved once at compile, consumed
  per-frame at `engine.ts:629`). Same gestalt: compile the pairing + dispatch, sample at
  runtime.
- **Interpol** (Codrops, 2025-10-27, "a low-level take on tweening and motion") — the
  explicitly low-level 2025 entrant — does the lerp at runtime (`start + (end-start)*amount`),
  uses a shared pub/sub Ticker, and **carries no typed-array, spline-cache, or SoA layout at
  all**. The current SOTA "low-level" stance is *runtime lerp simplicity*, not pre-baked
  buffers.
- **Anime.js v4** composes tween values at animation-create time (the previous tween's
  computed end feeds the next), reads keyframes as plain value arrays — no typed-array
  segment buffer. Its v4 "cut overlapping animations where the new one starts" is the same
  segment-boundary discipline `reconcileVars` already enforces.
- **Typed-array SoA appears only at extreme scale.** The one place the field reaches for
  `Float32Array`/`Float64Array` keyframe storage is **millions** of keyframes (Babylon.js
  feature-request — a *memory*-footprint argument), not the per-tick CPU loop at ≤20 stops.
  And V8's inline-cache model makes the monomorphic `f.time.start` / `iv.value` reads (one
  `createFrame` / one `prepareInterpVar` shape) simple memory loads, so the AoS-vs-SoA gap is
  small until the array is large and cache-resident — exactly what §2's measurement shows.

What the FrameCompiler does that IS the frontier (credit, do not touch):
- **Compile-once pre-flatten.** `allInterpVars` / `flatVars` are built once in
  `finalizeFrameVars` (`frame-compiler.ts:360-371`), so the rAF loop walks a flat array with
  the lerp dispatch pre-resolved — zero per-tick shape work. (`constants.ts:105-110` documents
  the intent.)
- **O(log N) seed + contiguous neighbor scan** (`engine.ts:579-606`) — the right search shape.
- **Monomorphic frame mint** — one `createFrame` shape (`frame-compiler.ts:215-226`) keeps the
  hot-path reads inline-cached.
- **The D.W4 clock-free split** (`frame-compiler.ts:1-13`) — a pure value-in→frames-out unit,
  unit-testable without a loop (`frame-compiler.test.ts:71-78`).
- **Content-derived idempotent ids** (FC-2, §1) and **targeted color re-normalize** (FC-1, §1)
  — the two E folds that closed the only real compile-time correctness gaps.

**Disposition: ALREADY-SOTA.** Precomputed sample *splines* (the mandate's last frontier
item) are a no-op here: the easing is per-segment `timingFunction.fn` (read live per tick,
`engine.ts:626`) and value.js already owns the bezier/`linear()` solvers — a precomputed
`X(t)` sample table is a *value.js easing* concern (named in the E handoff Wave E4), not a
FrameCompiler one. No spline cache belongs in the compiler.

---

## §5 — F-5: the benches are broken by E's boundary refactor (a separate, real defect)

While grounding the measure-first dispositions I found the project's compile/interp benches do
not run:

- `bench/interpolation.bench.ts:6` and `bench/parser.bench.ts:2` import
  `{ CSSKeyframesAnimation } from "../src/animation"` (the barrel).
- E made the barrel **lazy-load** the heavy engine through `loadAnimationEngine()` (an
  `await import("./engine")`) — the value.js light/heavy boundary documented in
  `src/animation/CLAUDE.md`. The barrel no longer statically re-exports
  `CSSKeyframesAnimation`, so the static named import resolves `undefined`.
- Running `npx vitest bench --run bench/interpolation.bench.ts` →
  **`TypeError: CSSKeyframesAnimation is not a constructor`** at `interpolation.bench.ts:6`.

**Impact.** `npm run bench` cannot measure the compile or interpolation path — the exact
instrument every measure-first disposition in this lane (and the carrier lane) leans on. The
fix is a one-line import-path change to `from "../src/animation/engine"` (the heavy module
exports it directly, as the demo ops already import it — `useKeyframeOps.ts:2`).

**Disposition: SHIP-in-F.** Trivial, isomorphic (test-harness-only, no engine change), and it
unblocks the benches the whole measure-first posture depends on. This straddles the runtime/
bench surface — flag to the runtime lane; if unclaimed, F lands it. (Out of *this* lane's
write scope — recorded, not fixed.)

---

## §A — the re-runnable microbench (typed-time-index SoA vs the engine's AoS shape)

`node /tmp/bench-time-index.mjs` (node v26 / V8). Reproduces §2's table. The AoS path is the
engine's literal shape (`binarySearchRange` with `(f)=>f.time.start`/`(f)=>f.time.stop`
closures, `engine.ts:579-584` + `binarySearch.ts:21-37`); the SoA path is the W8 proposal
(parallel `Float64Array` starts/stops, flat index, no closure).

```js
function bench(label, fn, iters) {
  for (let i = 0; i < 50000; i++) fn(Math.random());            // warm
  const t0 = process.hrtime.bigint();
  let acc = 0;
  for (let i = 0; i < iters; i++) acc += fn(Math.random());
  const t1 = process.hrtime.bigint();
  console.log(`${label.padEnd(46)} ${(Number(t1 - t0) / iters).toFixed(3)} ns/op`);
}
function makeFrames(N) {
  const f = [];
  for (let i = 0; i < N; i++)
    f.push({ id: i, ixs: { start: i, stop: i + 1 },
             time: { start: (i / N) * 1000, stop: ((i + 1) / N) * 1000 } });
  return f;
}
function bsAoS(frames, value) {                                  // engine's shape
  const getStart = (f) => f.time.start, getStop = (f) => f.time.stop;
  let lo = 0, hi = frames.length - 1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; const it = frames[mid];
    if (value < getStart(it)) hi = mid - 1;
    else if (value > getStop(it)) lo = mid + 1; else return mid; }
  return -1;
}
function bsSoA(starts, stops, value) {                           // W8 SoA proposal
  let lo = 0, hi = starts.length - 1;
  while (lo <= hi) { const mid = (lo + hi) >> 1;
    if (value < starts[mid]) hi = mid - 1;
    else if (value > stops[mid]) lo = mid + 1; else return mid; }
  return -1;
}
for (const N of [2, 11, 50, 200]) {
  const frames = makeFrames(N);
  const starts = Float64Array.from(frames, (f) => f.time.start);
  const stops = Float64Array.from(frames, (f) => f.time.stop);
  console.log(`\n--- N=${N} segments ---`);
  bench("AoS  binarySearchRange (closures over f.time)", (v) => bsAoS(frames, v * 1000), 5_000_000);
  bench("SoA  Float64Array starts/stops",                (v) => bsSoA(starts, stops, v * 1000), 5_000_000);
}
```

**Caveat (honest).** This isolates the *search*; it does not run the full
`interpFrames` tick (the benches that would, §5, are broken). The conclusion does not depend
on the full-tick number: the search is once-per-tick and the per-`iv` lerp + `Object.assign`
that follow dominate, so a wash-to-marginal search delta cannot move the frame. The full-tick
re-measure should be done once §5's bench fix lands — and is expected to confirm, not
overturn, the withhold.

---

## Summary table

| ID | Finding | Disposition | Where |
|----|---------|-------------|-------|
| F-1 | Typed-time-index SoA: wash at N≤2, ~17–21% only at N≥11 on a once-per-tick search; awkward against shared `binarySearchRange` | **MEASURE-FIRST → RECORD** (withhold re-confirmed, now measured) | `engine.ts:579-584`, `binarySearch.ts:21-37`, `constants.ts:93-96` |
| F-2 | Incremental `updateSegments`: non-win at the 1000 ms-debounced editor + ≤20-stop scale; trades the FC-2 determinism lock for a dirty-state machine | **BOOK** (record design + `proof:compile-incremental` byte-equality contract) | `useKeyframeOps.ts:71,119-151,171-209`; `frame-compiler.ts:257-302` |
| F-3 | Per-tick `Object.assign` slot-map: real cost ONLY with multi-active frames (no bench exists); clean form rides the carrier-lane SoA | **MEASURE-FIRST + BOOK**, sequenced AFTER `r-interpolation-carrier` | `engine.ts:636`, `frame-compiler.ts:360-371` |
| F-4 | Compile shape = the industry frontier (Motion precomputed-mixer = `iv._lerp`; Interpol rejects SoA; typed-array only at millions of stops); pre-flatten + O(log N) + monomorphic mint + idempotent ids + targeted re-normalize | **ALREADY-SOTA** | `frame-compiler.ts:1-13,213,289-296,360-371,387-401`; `engine.ts:455,473,579-606` |
| FC-1 / FC-2 | colorSpace re-normalize + content-derived idempotent `frameId` | **LANDED in E** (verified; no F action) | `engine.ts:455,473`; `frame-compiler.ts:213,387-401`; `compile-deterministic.test.ts` |
| F-5 | Compile/interp benches broken by E's lazy barrel — `CSSKeyframesAnimation is not a constructor`; unblocks the measure-first instruments | **SHIP-in-F** (one-line import fix; flag runtime lane) | `bench/interpolation.bench.ts:6`, `bench/parser.bench.ts:2` |

**Net.** The W8 FrameCompiler-SoA + incremental-`updateSegments` withhold **HOLDS, and F
does not land it** — the measurement (§2) and the editor workload (§3) confirm the
disposition the E close stated honestly, now with numbers the BOOK lacked. The FrameCompiler
sits at the actual industry frontier for its scale (precomputed-per-segment mixer, compile-once
pre-flatten, monomorphic mint, idempotent ids) — manufacture no SoA/incremental work here. The
one fold F should make is the broken bench import (F-5), because it is the instrument the
measure-first posture across this and the carrier lane depends on. The single deeper item with
teeth (the per-tick `Object.assign` slot-map, F-3) is correctly downstream of the
`r-interpolation-carrier` lane and gated on a multi-active-frame bench that does not yet exist.
No value.js hand-off originates in this lane — the only adjacent value.js item (precomputed
easing sample-spline) already lives in the E handoff Wave E4 and is a value.js-easing concern,
not a FrameCompiler one.
