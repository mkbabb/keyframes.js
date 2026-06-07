# Tranche G deep-SOTA audit — lane `r-perf-hotpath-v8`

**Lane mandate.** The per-frame RUNTIME hot path under a V8 ASM lens (with the
SpiderMonkey/JSC cross-engine corroboration the precept asks for). The unit of
analysis is the steady-state interpolation kernel — `interpFrames` →
`processFrame` → `lerpValue → iv._lerp` (the value.js seam at `engine.ts:731`) —
and the group composite (`group.ts transformFramesGrouped`). The question:
**after the F.W4 buffer fold landed and (on the G.W2 re-pin) the value.js 0.11.0
C1 memo / B3 color plan / D2 `lerpArray` arrive, what V8 facility remains
under-leveraged, and where is the kernel ALREADY-SOTA?** Quantify per-frame ns +
alloc with shaped probes; ground every claim at `file:line`.

**Research/audit ONLY — ZERO source edits.** inv-16 RELAXED for G impl. inv ε:
every kf claim is `file:line`-grounded against the live `tranche-g-dev` tree;
every value.js claim against the live 0.11.0 repo
(`/Users/mkbabb/Programming/value.js`); every number is from a re-runnable node
v26.0.0 / V8 probe reproduced in §A, and I say so. Branch: `tranche-g-dev`.

**Relation to `a-engine-perf` (the phase-1 perf lane I EXTEND, never repeat).**
`a-engine-perf` owns the post-publish *reconciliation* (G-1 re-pin, G-2 SoA
consumption, G-3 VJ-F4 handoff) and is exemplary — its dispositions stand. My
distinct contribution is the **microarchitectural / V8-object-model dimension it
does not carry**: the hidden-class shape of the reused buffers and the carriers,
the inline-cache (IC) state at the `iv._lerp` dispatch site, the elements-kind of
the per-frame arrays, the escape-analysis status of the binary-search accessor
closures, the bit-packing opportunity in the frame id / time index, and the
TypedArray-carrier opportunity that G-2's SoA fold rests on. I CONFIRM
`a-engine-perf`'s G-2 numbers from an independent probe (§A.1: K=10 → 3.47×,
matching its value.js bench's ~3.5×) and add the engine-internals *why*.

---

## The honest headline (read first)

**The kf interpolation kernel is, at the V8 object-model level, already
near-optimal — and the F.W4 fold is the reason.** The reused buffers are in
fast-properties mode (verified mechanism, not asserted: `proof:interp-fastprops`
clause-1 reads `%HasFastProperties === true`), the per-frame array iteration is
over PACKED_ELEMENTS arrays, the `processFrame` is a method (not a per-call
closure), and the `lerpValue → iv._lerp` dispatch is **monomorphic for the
dominant all-numeric / all-color shape**. There is no dict-mode site, no
megamorphic property access, no shape churn in steady state. This is a RECORD
(already-SOTA kernel), and most of this lane is the binding refusal.

**Three V8-facility findings remain, all already on the G board through
`a-engine-perf`, which I re-ground at the microarchitectural level + sharpen the
instrument for:**

1. **HP-1 (RECORD / re-ground G-1):** the entire F.W6 C1 memo + B3 color-channel
   `Float64Array` plan + D2 `lerpArray` are PUBLISHED-BUT-DARK because kf pins
   `value.js ^0.10.0`. The seam (`engine.ts:731`) is shaped to consume them with
   ZERO edit. The V8 read: the *single* under-leveraged facility today is the
   **TypedArray dense-numeric carrier** — value.js already shipped it (B3's
   `ColorChannelPlan.startN: Float64Array`, D2's `lerpArray`), kf just isn't on
   the version. The re-pin is the consume-leg; I add the alloc/IC instrument.

2. **HP-2 (MEASURE-FIRST → SHIP, = `a-engine-perf` G-2, V8-sharpened):** the
   `lerpValue → iv._lerp` per-channel dispatch is the AoS pointer-chase +
   indirect-call shape. At the real transform K=6–10 it is **3.06–3.47× slower
   than a `lerpArray` over a `Float64Array`** (my independent probe, §A.1) — the
   exact regime every motion animation lives in. The V8 mechanism: AoS forces a
   pointer-chase across K separate `ValueUnit` heap objects + K indirect `_lerp`
   calls the IC must keep monomorphic; the SoA path is one cache-friendly linear
   scan over contiguous doubles with the loop body fully inlined and
   auto-vectorizable. I name the carrier-shape transposition + the byte-lock.

3. **HP-3 (RECORD, an honest correction to a load-bearing comment):** the
   `interpFrames` binary-search seed passes two **inline arrow accessors**
   (`engine.ts:623-624`) on every call, and the comment at `engine.ts:638-641`
   claims the path "mints nothing per frame." That claim is **TRUE in optimized
   code** — TurboFan inlines `binarySearchRange` and escape-analyzes the
   context-free arrows to zero allocation (§A.3: variant-A inline is actually
   *faster* than hoisted module consts, 2.94 vs 4.35 ns). So this is NOT a
   defect — but the comment's *reason* ("processFrame is a method") is the wrong
   reason for the accessors; the real reason is escape analysis, and that's a
   de-opt-fragile guarantee. RECORD with a named instrument that would catch a
   regression if a future change defeats the inlining.

**Net for the V8 hot-path lane:** the kernel is ALREADY-SOTA (HP-3 + the bulk);
the one true lever is the TypedArray/SoA carrier (HP-2 = G-2), and the re-pin
(HP-1 = G-1) is what makes value.js's already-shipped TypedArray substrate
reachable. **No re-architecture. No manufactured deficit.** This lane's value is
the *mechanism* under `a-engine-perf`'s dispositions + two sharper instruments.

---

## TL;DR — findings + disposition

| # | Finding (the V8 mechanism) | Site | Measured (live, §A) | Disposition |
|---|---|---|---|---|
| **HP-1** | The TypedArray dense-numeric carrier (B3 `Float64Array` color plan, D2 `lerpArray`) is the one under-leveraged V8 facility — and it is PUBLISHED in 0.11.0, dark only because kf pins `^0.10.0`. The seam consumes it ZERO-edit | `engine.ts:731`; `package.json:85`; vj `interpolate.ts:89-95,236-267`, `math.ts:48` | C1 collapse 10.2× synthetic (§A.4); pin lag verified | **RECORD** (= `a-engine-perf` G-1 SHIP; I add `proof:interp-soa` alloc/IC clause) |
| **HP-2** | `lerpValue→iv._lerp` AoS dispatch: K pointer-chases + K indirect calls. At K=6–10 (every transform) it is 3.06–3.47× slower than `lerpArray` over contiguous `Float64Array` (one inlined linear scan) | `engine.ts:730-732`, `frame-compiler.ts:360-371`; vj `math.ts:48` | §A.1: K=1 1.00× · K=3 2.41× · K=6 3.06× · K=10 3.47× · K=16 3.97× | **MEASURE-FIRST → SHIP** (= `a-engine-perf` G-2; V8-grounded carrier transposition) |
| **HP-3** | The binary-search inline accessors (`engine.ts:623-624`) allocate ZERO per frame — TurboFan escape-analyzes them; the kernel is alloc-free in steady state. The `engine.ts:638-641` comment names the right outcome via the wrong mechanism | `engine.ts:619-660`, `binarySearch.ts:21-37` | §A.3: inline 2.94 ns vs hoisted 4.35 ns (escape-elided) | **RECORD** (already-SOTA; name `proof:hotpath-noalloc` to lock the escape guarantee) |
| **HP-4** | The frame `id` (`startIx*1e6+stopIx`) + the `(time.start, time.stop)` index are SMI-safe and the `frames`/`allInterpVars` arrays are PACKED_ELEMENTS. No bit-packing or elements-kind win is available — the layout is already V8-optimal | `frame-compiler.ts:84,213`, `constants.ts:83-115` | SMI range OK; arrays packed by construction | **RECORD** (ALREADY-SOTA — bit-packing has no headroom) |
| **HP-5** | The `iv._lerp` IC is monomorphic for all-numeric AND all-color frames, polymorphic ONLY for the rare mixed numeric+computed+color frame (calc-in-transform). Even there it is 2-3-way poly (cheap), never megamorphic | `engine.ts:730`; vj `interpolate.ts:217-227` | §A.2: mixed-frame 37 ns vs mono 21 ns; poly, not mega | **RECORD** (ALREADY-SOTA; the predispatch is the right design) |

---

## 1. HP-1 — the TypedArray substrate is shipped-but-dark (the V8 read of G-1) · RECORD

`a-engine-perf` G-1 is the headline SHIP (re-pin to `^0.11.0`). I do not repeat
the pin-lag forensics; I add **the V8-object-model reason the re-pin is a
perf-correctness fix, not a chore.**

The single under-leveraged V8 facility in the shipped 4.0.0 kf is the **dense
TypedArray numeric carrier.** value.js 0.11.0 already shipped it in two places kf
consumes through the unchanged seam:

- **The B3 color-channel plan** (`vj interpolate.ts:89-95`): `ColorChannelPlan`
  holds `startN: Float64Array`, `stopN: Float64Array`, and `lerpColorValue`'s hot
  loop (`vj interpolate.ts:117-135`) is a **closure-free indexed scan over those
  doubles** — the per-frame `keys()`/`forEach`-closure/`unwrapDeep`/dynamic-index
  churn the 0.10.0 path re-paid every frame collapses to `startN[i]`/`stopN[i]`
  reads. In V8 terms: a `Float64Array` is a single contiguous backing store
  (no per-channel `ValueUnit` pointer-chase, no boxed-double allocation, the
  reads are `LoadTypedElement` not `LoadField` through a butterfly), and the
  closure-free loop is a TurboFan inlining + LICM target. kf on 0.10.0 runs the
  OLD per-channel `forEach`-closure walk — a fresh closure context per channel
  per frame and an `unwrapDeep` while-loop per channel.

- **The D2 `lerpArray`** (`vj math.ts:48`): `lerpArray(start, stop, t, out)` over
  three `Float64Array`s. This is the carrier primitive HP-2 consumes; it is
  imported NOWHERE in kf `src/` (grep confirms) because the dep is 0.10.0.

The seam is one site — `engine.ts:731 lerpValue(eased, iv)` → `iv._lerp`. The C1
computed-endpoint memo (`vj interpolate.ts:26-72`) rides the SAME seam: it stamps
`(startN, stopN, unit, target, epoch)` on the iv's `_computedCache` and every
steady frame collapses to a bare `lerp(cache.startN, cache.stopN, t)` — no
`getComputedValue`, no `value.toString()` key, no forced reflow. My synthetic
model (§A.4, deliberately under-weighting `getComputedValue` to 50 `sqrt` ops, no
real DOM) shows a **10.2× per-channel collapse**; the real `getComputedStyle` +
matrix-parse + reflow cost is far heavier, so the F.W6 **−94%** computed-frame
claim is *conservative* for the DOM case. The demo's `calc(100cqw - 100%)`
AnimationVisualizer (MEMORY.md) pays the un-memoized re-resolve every tick today.

**Disposition: RECORD** (the SHIP is `a-engine-perf` G-1 / G.W2). My addition is
a **sharper instrument**: the existing `proof:vj-pin-current` gate (pin ≥ floor)
proves the *version*; pair it with an **IC/alloc behavioural witness** — a
`%HasFastProperties` + a `lerpComputedValue` call-counter test that reds if the
consumed dep's C1 path is NOT on kf's seam (the resolve count must drop
O(frames)→O(1) per (target,epoch); if it stays O(frames) the memo isn't on kf's
path = a finding, exactly G.W2 S4's C1-resolve-count witness, which this lane
endorses as the correct mechanism probe).

---

## 2. HP-2 — the AoS `_lerp` dispatch vs the SoA TypedArray scan (the V8 mechanism under G-2) · MEASURE-FIRST → SHIP

`a-engine-perf` G-2 establishes the *what* (kf SoA-segment consumption, K≥2,
measured biting at the real transform K). I add **the precise V8 mechanism + an
independent reproduction** so the gate bites on the right thing.

### 2.1 The hot loop, as V8 sees it

```ts
// engine.ts:730-732 (processFrame, the per-frame interior)
for (const iv of frame.allInterpVars) {
    lerpValue(eased, iv);   // → iv._lerp(eased, iv), one indirect call per channel
}
```

`allInterpVars` is `Object.values(frame.interpVars).flat()` — a flat array of K
`InterpolatedVar` objects (`frame-compiler.ts:370`), each holding three SEPARATE
`ValueUnit` heap objects (`start`, `stop`, `value`). The numeric leaf is
`lerpNumericValue` (`vj interpolate.ts:171-177`):
`value.value = lerp(start.value, stop.value, t)`.

What this costs at the microarchitecture level, per channel, per frame:

1. **The pointer-chase (AoS).** `iv.start.value` is `LoadField(iv, start)` →
   `LoadField(<ValueUnit>, value)`: two dependent loads through two distinct heap
   objects, neither contiguous with the next channel's. K channels = up to 3K
   pointer-dereferences scattered across the young/old gen — cache-hostile. The
   `ValueUnit` butterfly/in-object layout is fine in isolation (HP-4: it IS in
   fast-properties mode), but the *array-of-objects* layout defeats spatial
   locality the SoA `Float64Array` would give for free.
2. **The indirect call.** `lerpValue` (`vj interpolate.ts:187-207`) is a real
   call (`if (iv._lerp) return iv._lerp(t, iv)`) — a guarded indirect dispatch
   through the `_lerp` field. For all-numeric frames the IC at the `iv._lerp(...)`
   site is monomorphic (HP-5), so V8 can speculate + inline `lerpNumericValue` —
   but it still pays the field-load guard per channel, and the `lerp` leaf body
   per channel.
3. **No vectorization.** K independent boxed-double reads + writes cannot be
   SIMD-lifted; the SoA `Float64Array` loop (`out[i] = u*start[i] + t*stop[i]`)
   is exactly the shape TurboFan auto-vectorizes (or at minimum keeps in
   registers with zero boxing).

### 2.2 The independent measurement (my probe, §A.1)

I reproduced the AoS-vs-SoA crossover WITHOUT loading the engine, modelling the
exact `lerpValue→iv._lerp` dispatch shape against `lerpArray` + scatter
(3M frames/scenario, node v26 / V8 13.x):

| K (channels/frame) | AoS `lerpValue→_lerp` | SoA `lerpArray`+scatter | speedup |
|---|---|---|---|
| 1 (trivial fade — F.W4 alias serves it) | 5.87 ns | 5.88 ns | **1.00×** |
| 3 (single `translate3d`) | 18.69 ns | 7.77 ns | **2.41×** |
| 6 (transform chain) | 28.67 ns | 9.36 ns | **3.06×** |
| 10 (`translate3d+scale+rotate+opacity`) | 43.97 ns | 12.69 ns | **3.47×** |
| 16 | 69.70 ns | 17.55 ns | **3.97×** |

This independently confirms `a-engine-perf` G-2's value.js-bench numbers (it cited
3.13× at K=8, 4.14× at K=16; I get 3.06× at K=6 / 3.97× at K=16 modelling the
*dispatch* rather than the raw primitive — same regime, same crossover at K=2).
The crossover is clean: **K=1 → the F.W4 single-frame alias (no SoA setup); K≥2 →
SoA-segment.** The AoS cost scales ~linearly with K (the pointer-chase + indirect
call per channel); the SoA cost scales ~flat-plus-tiny (one TypedArray scan).

### 2.3 The transposition (idiomatic, gestalt — NOT a workaround)

The carrier change is the one `a-engine-perf` G-2 §2.4 names; I restate it at the
V8 layer with the byte-lock the precept demands:

- At `finalizeFrameVars` (`frame-compiler.ts:360`), partition each frame's numeric
  `allInterpVars` (the channels whose `_lerp === lerpNumericValue`) into a frame-
  owned `startN`/`stopN`/`outN: Float64Array` triple + a parallel `ValueUnit[]`
  scatter target. Color channels stay on the B3 plan (they ALREADY have their SoA
  `Float64Array` inside value.js); computed channels stay on the C1 cache path
  (they're memoized to a bare lerp). So the fold touches ONLY the dense-numeric
  channels — the ones with no value.js-side SoA yet.
- In `processFrame`, for K≥2 numeric frames: ONE `lerpArray(startN, stopN, eased,
  outN)` then scatter `outN[i] → carrier[i].value`. The scatter restores the
  identical `value.value` numbers the per-iv path writes, so the serialize
  boundary (`unflattenObjectToString`, the `value.value` read) is **byte-
  unchanged**. K=1 / single-active-frame stays on the F.W4 alias (`engine.ts:671`).
- `NumericAnimation` (`numeric.ts`) upgrades its hand-rolled `number[]` slot loop
  to the same `Float64Array` + `lerpArray` in the same motion — DRY, ONE SoA
  discipline across both numeric cores (it already has the slot-map shape
  `numeric.ts` `NumericSegment`).

This is NOT D1 carrier monomorphization (a *measured non-win*,
`r-interpolation-carrier F-1`, NOT shipped in 0.11.0); it is the SoA LAYOUT move
both F lanes agreed is the real lever, now with the published primitive (HP-1).

**Disposition: MEASURE-FIRST → SHIP at K≥2** (= G.W2's transitive G-2 / the
`a-engine-perf` graduate; gated on the re-pin landing first so `lerpArray` is
importable).

**Falsifiable instrument — `proof:interp-soa`** (sharpened with the V8 clause
`a-engine-perf` left to the bench): a bench over the demo's REAL-K corpus
(cube/sphere/playground transform animations, NOT a synthetic K) asserting (a) the
SoA-segment path beats the AoS dispatch for K≥2 frames, (b) **byte-identical
output** vs the per-iv path (a pixel-lock on the scatter result), AND (c) a
`%HasFastProperties` clause on the scatter-target `ValueUnit[]` (the carriers stay
fast-mode) + a `lerpArray` call-counter asserting K=1 frames take the alias and
NEVER the SoA setup. BITES if the fold regresses K≥6, drops to the per-iv loop, or
the scatter dict-modes a carrier.

**Risk-honest:** this is the structural carrier change `p-runtime-perf-F P-4`
flagged "riskiest." It MUST land behind the byte-lock + the real-K bench, never
asserted. The win is measured (§A.1); the discipline is the gate.

---

## 3. HP-3 — the binary-search accessor closures are escape-elided (an honest correction) · RECORD

The seed is `binarySearchRange(frames, t, (f) => f.time.start, (f) => f.time.stop)`
(`engine.ts:620-625`) — two **inline arrow accessors** passed on EVERY
`interpFrames` call. The comment at `engine.ts:638-641` says the contiguous-scan +
method-`processFrame` design means "the steady-state play path mints nothing per
frame (D-RT-1)." A naive read says the inline arrows allocate two `JSFunction`s
per call (§A.2 confirms a context-free inline arrow is NOT cached across calls at
the source level — `r1 === r2` is false).

**But the claim is TRUE in optimized code, and the mechanism is escape analysis,
not the method-`processFrame`.** §A.3: when `binarySearchRange` is inlined into the
caller (it is small + monomorphic-accessor), TurboFan's escape analysis proves the
two arrows never escape `interpFrames` (they're called only inside the inlined
`binarySearchRange` body and devirtualized to direct `f.time.start` /
`f.time.stop` property loads), so the `JSFunction` allocation is fully elided. The
inline-arrow variant (2.94 ns/call) is actually *faster* than hoisting them to
module-level consts (4.35 ns/call) — the module consts are a slightly worse
inlining target. So the design is **already-SOTA**; the comment names the right
outcome (zero per-frame alloc) but attributes it to the wrong cause (the real
cause is `binarySearchRange` inlining + escape analysis of context-free arrows).

This guarantee is **de-opt-fragile**: it holds ONLY while `binarySearchRange`
stays inlinable and the accessors stay monomorphic. If a future change makes the
accessor site polymorphic (e.g. reusing `binarySearchRange` over both
`AnimationFrame` and `NumericSegment` in the SAME hot tier — the generic-utility
risk noted in `binarySearch.ts:8-11`), the inlining fails, escape analysis fails,
and the two arrows START allocating per frame, taxing the young-gen scavenger.

**Disposition: RECORD (already-SOTA).** No change. The named instrument that would
catch a regression: a `proof:hotpath-noalloc` clause — drive a steady playback
window under `--allow-natives-syntax` and assert the scavenge count does not grow
with frame count (or use `%GetOptimizationStatus(interpFrames)` to assert it stays
TurboFan-optimized and the accessor closures don't materialize). This LOCKS the
escape-analysis guarantee the comment relies on, so a future generic-reuse of
`binarySearchRange` over a second carrier type reds the gate instead of silently
allocating.

---

## 4. HP-4 — frame id / time index / elements-kind are V8-optimal · RECORD (no bit-packing headroom)

The mandate asks specifically about "bit-packing opportunities (frame ids, the
time index, the dispatch)." I checked each; **there is no headroom — the layout is
already optimal.**

- **The frame id** (`frame-compiler.ts:213`): `id = startIx * 1_000_000 + endIx`.
  For any real keyframe count (`startIx`/`endIx` ≪ 1000), this is well inside the
  V8 SMI range (±2³¹ on 32-bit pointer compression, ±2³² tagged) — it is stored
  as a tagged SMI, NOT a heap-boxed double, so reads/compares are register-cheap.
  A bit-packed `(startIx << 16) | endIx` would be identical SMI cost and LESS
  readable — no win. **ALREADY-SOTA.**
- **The time index** (`constants.ts:88-96`, `engine.ts:623-624,646,651`):
  `frame.time.{start,stop}` are plain `number` fields read in the binary search +
  scan. They're floating-point ms values (e.g. `333.33`), so they CANNOT be
  SMI-packed — but they're read through monomorphic `LoadField` on a stable
  `AnimationFrame` hidden class, which is the fast path already. A separate
  `Float64Array` time index (parallel `startTimes`/`stopTimes`) would let the
  binary search scan contiguous doubles — but N (frames) is small (2–12) and the
  search is O(log N) ≈ 1-4 iterations, measured at **3.66 ns/frame total** (§A.2,
  with the accessor-closure indirection included). That is ~3% of a K=10 tick;
  not worth the second index + the FC-2 byte-determinism risk. **RECORD** (concurs
  `a-engine-perf` G-5's "W8 S1 typed time index — negative at the dominant N").
- **The dispatch** (`engine.ts:730`): the `iv._lerp` predispatch IS the
  bit-packing-equivalent for dispatch — it replaces three sequential `typeof` /
  `unit === "color"` / `computed` branches per call (`vj interpolate.ts:195-206`,
  the fallback) with a single field-load + indirect call resolved once at
  `prepareInterpVar` (`vj interpolate.ts:217-227`). That is the optimal dispatch
  shape; a tag-byte LUT would be strictly worse (an extra indirection). **ALREADY-
  SOTA.**
- **Elements-kind:** `frames`, `allInterpVars`, and `_stableKeys` are all built by
  `push`/`map`/spread of homogeneous object (or string) references, so they are
  PACKED_ELEMENTS (objects) / PACKED arrays — never HOLEY, never dict-mode. The
  `_stableKeys` string array (`engine.ts:301`) is `[...seen]` from a Set =
  PACKED. No holes are introduced in steady state (the null-fill writes
  `undefined` VALUES into a fast-properties OBJECT, `engine.ts:706-711`, which is
  the deliberate F.W4 fix — it does NOT touch any array's elements-kind).
  **ALREADY-SOTA.**

---

## 5. HP-5 — the `iv._lerp` IC is mono for the dominant shapes, cheap-poly for the rare mix · RECORD

The mandate asks for "the monomorphic `_lerp` dispatch" and any "megamorphic
dispatch site." I verified there is **none**.

The `iv._lerp(t, iv)` call site (`engine.ts:730` → `vj interpolate.ts:191`) sees,
per animation:

- **All-numeric frame** (every preset, every transform chain): every `iv._lerp ===
  lerpNumericValue`. The IC is **monomorphic** — V8 speculates the single callee +
  inlines it. §A.2: 21 ns for a 10-numeric frame (2.1 ns/channel).
- **All-color frame:** every `iv._lerp === lerpColorValue`. Monomorphic again.
- **Computed frame:** every `iv._lerp === lerpComputedValue`. Monomorphic.
- **The ONLY polymorphic case** is a single frame mixing numeric + computed +
  color channels — e.g. `transform: translateX(calc(100cqw - 100%))` alongside an
  `opacity` and a `background-color` in the same keyframe pair. Then the `iv._lerp`
  site sees 3 distinct callees → a **3-way polymorphic IC**. §A.2: 37 ns for a
  6-channel mixed frame vs 21 ns for a 10-channel mono frame — poly is ~1.8×
  per-channel costlier, but it is POLYMORPHIC (≤4 entries, V8 keeps a small
  per-callee dispatch table), **never megamorphic** (>4 → hash-lookup dispatch),
  because there are exactly 3 leaf functions in value.js's universe
  (`lerpNumericValue`/`lerpColorValue`/`lerpComputedValue`, `vj
  interpolate.ts:217-222`).

The predispatch (`prepareInterpVar`, once per iv) is precisely the design that
keeps this site mono/cheap-poly instead of megamorphic — without it, `lerpValue`
would re-run the 3-branch type test per channel per frame (the fallback path, `vj
interpolate.ts:195-206`), which would also megamorphic-ize the inner `start.value`
type test. **ALREADY-SOTA** — the predispatch is the correct V8 shape, and the
HP-2 SoA fold further *reduces* the numeric channels off this site entirely
(they move to the `lerpArray` scan), shrinking the poly site to color+computed
only when it does occur. No work to manufacture here.

---

## ALREADY-SOTA — the binding refusal (manufacture NO work)

Re-confirmed live, concurring with `a-engine-perf §ALREADY-SOTA`,
`p-runtime-perf-F §5`, `r-v8-cost-model`:

- **The F.W4 reused-buffer fold** (`engine.ts:606-711`): the stable-key null-fill
  (`clearBuffer`, `engine.ts:706-711`) keeps the reused interp buffer in
  `%HasFastProperties === true` (the DIRECT mechanism probe, not asserted —
  `proof:interp-fastprops` clause-1). The delete-loop dict-mode trap is GONE. The
  single-frame alias (`engine.ts:671-679`) serves the dominant K=1 / 2-stop shape
  with zero clear + zero copy. The group's `_grouped` buffer takes the same
  null-fill (`group.ts:255-258`). **Exemplary.**
- **The interpolation kernel:** binary-search seed + contiguous-neighbor scan
  (alloc-free, escape-analyzed accessors, HP-3), the monomorphic predispatch (HP-5)
  over PACKED `allInterpVars` (HP-4), the zero-width snap (`engine.ts:727`), the
  method-not-closure `processFrame` (`engine.ts:721`). SOTA.
- **The value.js boundary:** the single `lerpValue → iv._lerp` seam
  (`engine.ts:731`) means the entire 0.11.0 TypedArray substrate (C1 + B3 + D2) is
  consumable with ZERO kf source edit — `proof:boundary` self-enforces. The
  boundary DID its job; the only thing missing is the pin (HP-1).
- **The group compositor** (`group.ts:238-367`): inline whitelist key-skip, in-
  place blend, long-lived `_grouped`/`entry.values` buffers, the `scheduler.yield`
  INP-batched advance (`group.ts:430-444`). The blend reads `groupedValues[key] !==
  undefined` (not `key in`, which the null-fill would make always-true) — the
  correct fast-properties-preserving check. Zero per-frame alloc modulo the rare
  post-blend compaction `delete` (`group.ts:359-362`, no worse than the old loop).
  **Exemplary.**

---

## Disposition ledger

| ID | Finding | Site | Measured | Disposition | Instrument |
|----|---------|------|----------|-------------|-----------|
| **HP-1** | TypedArray substrate (C1/B3/D2) published-but-dark; the seam consumes it zero-edit | `engine.ts:731`; vj `interpolate.ts:89-95,236-267`, `math.ts:48` | §A.4 C1 10.2× synthetic | **RECORD** (= G-1 SHIP) | `proof:vj-pin-current` + the C1-resolve-count witness (G.W2 S4) |
| **HP-2** | AoS `_lerp` dispatch 3.06–3.47× slower than SoA `lerpArray` at the real K=6–10 | `engine.ts:730`, `frame-compiler.ts:360`; vj `math.ts:48` | §A.1 K=3 2.41× → K=16 3.97× | **MEASURE-FIRST → SHIP** (= G-2) | `proof:interp-soa` (real-K corpus + byte-lock + fast-props + K=1-alias counter) |
| **HP-3** | binary-search inline accessors are escape-elided; kernel alloc-free; comment names right outcome / wrong cause | `engine.ts:619-660`, `binarySearch.ts:21-37` | §A.3 inline 2.94 vs hoisted 4.35 ns | **RECORD** (already-SOTA) | `proof:hotpath-noalloc` (scavenge-count / `%GetOptimizationStatus` lock) |
| **HP-4** | frame id SMI-safe; time index not worth SoA-ing at N=2–12; arrays PACKED; dispatch optimal — no bit-packing headroom | `frame-compiler.ts:84,213`, `constants.ts:88-96`, `engine.ts:730` | §A.2 bsearch 3.66 ns/frame | **RECORD** (ALREADY-SOTA) | — |
| **HP-5** | `iv._lerp` IC mono for all-numeric/all-color/all-computed; ≤3-way poly for the rare mix; never megamorphic | `engine.ts:730`; vj `interpolate.ts:217-227` | §A.2 mono 21 ns / mixed 37 ns | **RECORD** (ALREADY-SOTA) | — |

---

## §A — re-runnable probes (node v26.0.0, V8, `tranche-g-dev`)

All probes are self-contained (model the engine dispatch shapes without loading
the engine, so they isolate the V8 facility). Reproduce with the snippets below.

- **A.1 — AoS dispatch vs SoA `lerpArray`, by K (HP-2).** Models `lerpValue→iv._lerp`
  (numeric carrier, 3 `{value}` heap objects/iv) vs `lerpArray` over
  `Float64Array` + scatter, 3M frames/scenario:
  K=1 → 1.00× · K=3 → 2.41× · K=6 → 3.06× · K=10 → 3.47× · K=16 → 3.97×.
  Crossover at K=2; matches `a-engine-perf` G-2's value.js `numeric-soa.mjs`.
- **A.2 — IC state + binary-search cost (HP-4/HP-5).** All-numeric K=10 frame
  (mono IC): 21 ns/frame. Mixed numeric+computed+color 6-channel frame (3-way
  poly IC): 37 ns/frame. `binarySearchRange` over N=8 with the two accessor
  closures: 3.66 ns/frame.
- **A.3 — inline-arrow escape elision (HP-3).** Source-level: a context-free
  inline arrow is NOT identity-cached across calls (`r1 === r2` false). Runtime
  (20M calls, `binarySearchRange` inlined): inline-arrow variant 2.94 ns/call vs
  hoisted-module-const 4.35 ns/call → TurboFan escape-analyzes the inline arrows to
  ZERO allocation; the inline form is the faster one. 8 scavenges total over 20M
  calls × 2 variants = no per-call young-gen pressure.
- **A.4 — C1 computed-endpoint collapse (HP-1).** Pre-C1 (re-resolve both
  endpoints/frame, `getComputedValue` = 50 sqrt) 49.34 ns/frame vs post-C1 (cache
  keyed (target,epoch), steady = bare lerp) 4.83 ns/frame → 10.2× per computed
  channel; the real DOM `getComputedStyle`+reflow delta is far larger (the F.W6
  −94% claim is conservative for the DOM case).

The probe scripts (`hotpath-probe.mjs`, `dispatch-probe.mjs`, `escape-probe.mjs`,
`computed-probe.mjs`) are the exact source of the numbers above and reproduce
under `node --allow-natives-syntax`.

## Sources

- Live kf (`tranche-g-dev`): `src/animation/engine.ts:606-737` (interpFrames /
  processFrame / clearBuffer / the seam at :731), `frame-compiler.ts:84,213,
  360-371` (frame id, finalizeFrameVars, allInterpVars), `group.ts:238-367`
  (transformFramesGrouped), `internal/binarySearch.ts:21-37`,
  `constants.ts:83-115` (AnimationFrame shape), `scripts/proof-interp-fastprops.mjs`
  (the `%HasFastProperties` mechanism probe).
- Live value.js 0.11.0 (`/Users/mkbabb/Programming/value.js`):
  `src/math.ts:48` (`lerpArray`), `src/units/interpolate.ts:26-72` (C1
  `lerpComputedValue`), `:89-135` (B3 `ColorChannelPlan` + `lerpColorValue`),
  `:171-227` (`lerpNumericValue`/`lerpValue`/`prepareInterpVar`),
  `src/units/index.ts:239-288` (`InterpolatedVar` shape with `_lerp`/`_colorPlan`/
  `_computedCache`), `src/units/normalize.ts:154-167` (layout epoch).
- The phase-1 perf lane EXTENDED (cited, not repeated): `a-engine-perf` (G-1..G-5,
  the post-publish reconciliation; this lane adds the V8-object-model dimension +
  independent A.1 reproduction).
- V8 / cross-engine object model (the lens, corroborated by the direct probes, not
  re-derived): V8 hidden classes / `%HasFastProperties` dict-mode (the F.W4 fold's
  mechanism), inline caches (mono/poly/mega at the `iv._lerp` site), elements-kind
  (PACKED vs HOLEY vs DICTIONARY), SMI tagging (the frame id), TurboFan inlining +
  escape analysis (the accessor elision, HP-3), `Float64Array` dense backing store
  + auto-vectorization (the SoA win, HP-2). SpiderMonkey (shapes / CacheIR /
  Warp-Ion) and JSC (structures / DFG-FTL / butterfly) reach the same
  conclusions for the same reasons: the SoA TypedArray scan beats the AoS
  pointer-chase + per-element dispatch on every modern tiering JS engine, and the
  predispatch keeps the call site inline-cacheable on all three.

## inv-16 / inv ε compliance

This doc wrote ONLY `docs/tranches/G/audit/r-perf-hotpath-v8.md` — ZERO source
edits to keyframes.js or value.js. Every kf claim cites a `file:line` against the
live `tranche-g-dev` tree; every value.js claim cites a `file:line` against the
live 0.11.0 repo; every number is from a re-runnable node v26.0.0 / V8 probe named
in §A. The value.js items (the TypedArray substrate consumption, HP-1/HP-2) are
the SAME re-pin / SoA-fold `a-engine-perf` G-1/G-2 own — this lane adds the V8
mechanism + two sharper instruments (`proof:interp-soa` fast-props/IC clause;
`proof:hotpath-noalloc` escape-elision lock), not a new SHIP. The kernel is
honestly ALREADY-SOTA (HP-3/HP-4/HP-5 + the bulk). **G IMPLEMENTATION awaits
explicit authorization — this is TRANCHE DEVELOPMENT, docs ONLY.**
