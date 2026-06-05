# SOTA audit — keyframes.js runtime hot-path, DEEP cost model (Tranche E)

**Lane:** Runtime hot-path — DEEP. Goes deeper than `a-kf-runtime.md`: builds
the per-frame cost model op-by-op, names the realistic micro-opts (typed
arrays, `Object.assign` avoidance, monomorphic shapes, batched writes), splits
real wins from measurement noise, and names the measure-first gate for each.

**inv-16:** keyframes.js findings → `FOLD-E`; value.js findings →
`FOLD-VALUEJS-HANDOFF` (value.js is dirty + active — propose a value.js
tranche, never write it here). Every finding: file:line + spec/guide cite,
the gap/opportunity, perf/elegance rationale, disposition, isomorphism note.

**Relationship to `a-kf-runtime.md`:** that lane named 5 keyframes findings
(E-RT-1..5) + 3 value.js handoffs (VJS-1..3) and the verdict "the group is
zero-alloc; the standalone loop is not." This lane RE-CONFIRMS that frame and
goes a layer deeper into the *micro-architecture* of the per-frame work: the
megamorphic value carrier, the monomorphic-shape discipline, the typed-array
substrate, the `delete`-loop dictionary deopt, and the read-after-write layout
thrash that the cost model exposes. Cross-references are marked `(deepens
E-RT-n)`.

---

## 0. Executive verdict — the dispatch is SOTA; the *carrier and the buffer churn* are the real cost

Build the per-frame cost model for the steady-state standalone `Animation`
loop (one active frame, `K` interpolation vars, `P` flat properties, `T`
targets). One rAF tick costs, in order (`engine.ts:547-607`):

| # | Op | Site | Cost class | Verdict |
|---|----|------|-----------|---------|
| 1 | `for (const k in result) delete result[k]` | `engine.ts:555` | **dict-mode deopt** + O(P) | **real, fixable** |
| 2 | `binarySearchRange` | `engine.ts:561`; `binarySearch.ts:21` | O(log N), monomorphic | ALREADY-SOTA |
| 3 | `processFrame` closure alloc | `engine.ts:573` | 1 alloc/frame | real (deepens E-RT-1) |
| 4 | `scale(t,start,stop,0,1)` | `engine.ts:575` | 1 div, throws on 0-width | minor (E-RT-5) |
| 5 | `frame.timingFunction.fn(scaled)` | `engine.ts:576` | 1 monomorphic call | ALREADY-SOTA |
| 6 | `for (iv of allInterpVars) lerpValue` | `engine.ts:578` | K × (`_lerp` dispatch + **megamorphic VU r/w**) | **carrier is the cost** |
| 7 | `Object.assign(result, frame.flatVars)` | `engine.ts:589` | O(P) megamorphic copy/frame | **real, mostly redundant** |
| 8 | `frame.transform(...)` → `transformTargetsStyle` | `engine.ts:583`; `utils.ts:305` | P × T `setProperty` + **full re-serialize** | **real** (deepens E-RT-3) |

**The shape of the cost.** Steps 2 and 5 are textbook SOTA — O(log N) seek,
pre-resolved monomorphic `_lerp` (value.js `interpolate.ts:143`), a single
`.fn` call. The cost lives in the **carrier and the buffer plumbing around the
math**, not the math: a megamorphic 6-field `ValueUnit` mutated per-var
(step 6), an `Object.assign` re-copy of a dictionary-shaped dict per-frame
(step 7), a `delete`-loop that pushes the output object into dictionary mode
(step 1), and a full string re-serialization of the transform on the write
(step 8). None of these is the interpolation kernel — all are the *connective
tissue* between the kernel and the DOM.

**Top findings (deepest-value first):**

1. **D-RT-1 (FOLD-E)** — step 1's `for..in` + `delete` on the reused `out`
   buffer forces V8 to keep the output object in **dictionary (hash) mode**
   forever, defeating the very zero-alloc reuse it was added for. A
   stable-key `null`-fill or a fixed-shape buffer keeps it in fast-properties
   mode. The prior E-RT-1 named the *closure*; this names the *deopt of the
   buffer it writes into*.

2. **D-RT-2 (FOLD-E)** — step 7's `Object.assign(result, frame.flatVars)`
   re-copies the whole flat-var dict every frame even though `flatVars` is a
   stable, frame-owned object whose *values* are the same mutated `ValueUnit`s
   `lerpValue` just wrote. For the single-active-frame case (the overwhelming
   majority), `result` can alias `frame.flatVars` directly — zero copy.

3. **D-RT-3 (FOLD-VALUEJS-HANDOFF)** — `ValueUnit` is a **megamorphic 6-field
   class** (`value, unit, superType, subProperty, property, targets`,
   `units/index.ts:7-20`). The hot path only ever reads/writes `.value` (and
   for color, walks channels). A value.js tranche could mint a *lean*
   interpolation carrier (a monomorphic `{value:number}` cell, or a parallel
   `Float64Array` of current values) so the per-frame mutation site hits a
   monomorphic inline cache. Largest structural win; value.js-owned.

4. **D-RT-4 (FOLD-VALUEJS-HANDOFF)** — `NumericAnimation` segments store
   `startVals`/`stopVals` as `number[]` (`numeric.ts:139-140`) and write into
   a per-key object (`numeric.ts:176`). The zero-alloc engine's substrate
   could be `Float64Array` — denser, monomorphic, SIMD-amenable. The carrier
   shape is keyframes-local (`numeric.ts`) so this is **FOLD-E**; the
   *general* typed-array interp primitive it motivates is the value.js handoff.

5. **D-RT-5 (FOLD-E + FOLD-VALUEJS-HANDOFF)** — the computed-unit path
   (`vh`/`calc`/`var`/`cqw`) does a **read-after-write layout thrash** inside
   the frame: `getComputedValue` writes inline style then immediately calls
   `getComputedStyle` (value.js `normalize.ts:162-164`). This is the exact
   anti-pattern Motion's batched read/write phase exists to kill. Deepens
   E-RT-4/D-3 with the *layout-thrash* framing, not just the memo-key cost.

6. **D-RT-6 (GAP-NAMED)** — the rAF write path emits **no `will-change` /
   compositor-promotion hint**. WAAPI gets compositor threading for free; the
   rAF fallback (every color anim, every computed-unit anim, every custom
   transform) paints on the main thread with no layer hint. A one-time
   `will-change` on `play()` + cleanup on settle is a real paint win for the
   rAF majority.

Honest SOTA confirmations are in §7 — the dispatch, the binary search, the
`allInterpVars` pre-flatten, the group zero-alloc, and `scheduler.yield` are
all genuinely modern; do not manufacture work there.

---

## 1. D-RT-1 [FOLD-E] — the reused `out` buffer is held in dictionary mode by the `delete` loop

`interpFrames` clears its reusable output buffer with a delete loop
(`engine.ts:555`):

```ts
const result = out;
for (const k in result) delete result[k];
```

The whole point of the `out` parameter (E-RT-1's zero-alloc steady state, and
the group's `entry.values`/`_grouped` buffers, `group.ts:91,211`) is to avoid
a fresh `{}` per frame. But `delete obj[key]` is the canonical trigger for
V8 to **transition an object out of "fast properties" (hidden-class) mode into
"dictionary/slow properties" mode** — and once an object is in dictionary
mode it stays there. So the reused buffer pays a *slow hash lookup* on every
subsequent `result[key] = …` (step 7's `Object.assign` target) and every
`for..in` — for the entire lifetime of the animation. The buffer reuse trades
one GC allocation for a permanent per-access dictionary penalty.

**Cite:** V8 hidden-class / dictionary-mode behavior — an object that has had
`delete` applied falls to slow dictionary properties and does not recover
([V8 hidden classes & inline caching](https://medium.com/@yashschandra/hidden-v8-optimizations-hidden-classes-and-inline-caching-736a09c2e9eb)).
The same applies to `group.ts`'s `_grouped` (`group.ts:212`) and every
`entry.values` cleared the same way (`group.ts` via `interpFrames`).

**The fix (measure-first).** Two SOTA shapes:
- **Stable-key reset:** if the active key-set is stable across frames (it is,
  for a fixed animation — the frames' `flatVars` keys don't change once
  compiled), clear by assigning `undefined`/`null` to the *known* keys rather
  than `delete`. No hidden-class transition; the object keeps its shape.
- **Alias, don't clear:** see D-RT-2 — for the single-frame case the buffer
  need not be cleared *or* copied at all.

**Perf rationale.** The cost is invisible in a microbench that allocates fresh
objects (the GC win dominates) but real in steady-state: every property
touch on a dictionary-mode object is a hash probe instead of a fixed-offset
load. This is precisely the class of "the optimization regressed the thing it
optimized" that only a *shaped* benchmark (long-running, same buffer, INP
under load) surfaces.

**Measure-first gate.** Add a bench that plays one animation for N frames
reusing one `out` buffer and measures `interpFrames` p50/p99 — compare
`delete`-loop vs stable-key reset. Confirm with `--prof` / `%DebugPrint` that
the buffer stays in fast-properties mode. Only fold if the shaped bench moves.

**Disposition: FOLD-E.** `engine.ts:555` + `group.ts:212`. Keyframes-local.
**Isomorphism:** pixel-identical — same keys, same values, only the clear
mechanism changes.

---

## 2. D-RT-2 [FOLD-E] — `Object.assign(result, frame.flatVars)` re-copies a stable dict every frame

After lerping, `processFrame` merges the frame's flat vars into the output
(`engine.ts:589`):

```ts
Object.assign(result, frame.flatVars);
```

`frame.flatVars` is built ONCE at compile time (`frame-compiler.ts:319-326`)
and its leaf values are the **same `ValueUnit` instances** that `lerpValue`
mutated in place two lines earlier (step 6 writes `iv.value.value`, and
`flatVars[key] = value.map(v => v.value)` references those exact `iv.value`
units, `frame-compiler.ts:324`). So `Object.assign` copies *references that
already point at the freshly-mutated units* into a dictionary-mode buffer
(D-RT-1). For the dominant single-active-frame case, the copy is pure
overhead: the caller could read `frame.flatVars` directly.

**Why it exists:** the multi-overlapping-frame case (multiple properties
sharing a time range, scanned by the neighbor expansion at `engine.ts:593-604`)
genuinely needs a *merge* — frame A contributes `opacity`, frame B contributes
`transform`, and the result must hold both. `Object.assign` is the merge.

**The SOTA shape.** Branch on active-frame count:
- **1 active frame** (the common path): `return frame.flatVars` directly — no
  buffer clear (D-RT-1), no copy. The transform reads it as-is.
- **≥2 active frames:** keep the merge, but into a buffer that is NOT in
  dictionary mode (D-RT-1's stable-key reset), and consider that the merged
  key-set is also stable per animation, so the merge can be a fixed key list.

**Perf rationale.** `Object.assign` into a dictionary-mode object is O(P) hash
writes per frame. For a 2-property animation that's small; for the demo's cube
(`App.vue:333` reads `interpFrames` per frame) and any matrix3d/multi-channel
animation it compounds. The single-frame alias removes the copy entirely.

**Measure-first gate.** The existing `interpolation.bench.ts` 2-frame /
multi-property / 11-stop cases already isolate this — add a variant that
threads the `out` buffer (the realistic playback shape, which the current
bench omits) and compare alias-vs-assign. Fold only on a measured win; the
single-frame fast path must be proven to dominate real animations (it does for
`fromString` two-stop and most presets).

**Disposition: FOLD-E.** `engine.ts:589`. **Isomorphism:** pixel-identical for
the single-frame alias (same object, same mutated values); the multi-frame
merge is unchanged.

---

## 3. D-RT-3 [FOLD-VALUEJS-HANDOFF] — `ValueUnit` is a megamorphic carrier; the hot path wants a lean cell

`lerpValue`'s pre-resolved dispatch (`_lerp`, value.js `interpolate.ts:117`)
is genuinely SOTA — monomorphic, paid once (ALREADY-SOTA, §7). But the
*object it mutates* is heavy. `ValueUnit` carries six constructor fields
(value.js `units/index.ts:13-20`):

```ts
constructor(public value, public unit?, public superType?,
            public subProperty?, public property?, public targets?) {}
```

The numeric hot path (`lerpNumericValue`, `interpolate.ts:97`) does exactly
one thing: `value.value = lerp(start.value, stop.value, t)`. Three property
reads + one write on a 6-field class. Because `ValueUnit` instances are minted
across the parser in many shapes (some with `superType`, some with `targets`,
some color-payloaded, some `string`-valued, some `number`-valued), the
**inline cache at `value.value = …` and `start.value`/`stop.value` reads sees
multiple hidden classes** — it tends polymorphic/megamorphic rather than
monomorphic. Megamorphic property access degrades to dictionary-style lookup
([V8 inline caching: >4 shapes → megamorphic → slow lookups](https://braineanear.medium.com/the-v8-engine-series-iii-inline-caching-unlocking-javascript-performance-51cf09a64cc3)).

**The structural opportunity (value.js-owned).** The interpolation substrate
wants a *monomorphic* current-value cell, separate from the rich parse-time
`ValueUnit`. Three shapes a value.js tranche could weigh:
- A lean `{ value: number }` interp cell (always-number, one shape) the
  `InterpolatedVar` mutates, with the `ValueUnit` reconstituted only at
  serialize time (the write boundary).
- A **parallel `Float64Array`** of current numeric values indexed by var,
  with the `ValueUnit`s carrying only static metadata — the math writes the
  typed array, the serializer reads it. Densest, SIMD-amenable
  ([typed arrays enforce one type, denser storage, SIMD](https://medium.com/swlh/exploration-of-javascript-object-for-performance-optimization-70b20246ab9e)).
- A frozen-shape `ValueUnit` variant minted by `prepareInterpVar` so all
  interp-time units share ONE hidden class (cheapest to adopt; keeps the
  class).

**Perf rationale.** This is the single largest *structural* per-var win: it
turns step 6's K × (3 reads + 1 write) from megamorphic hash-ish accesses into
monomorphic fixed-offset loads. For a multi-channel color or matrix3d
animation (K large) it compounds linearly.

**Measure-first gate.** value.js's bench harness should measure
`lerpNumericValue` over a megamorphic `ValueUnit` population vs a monomorphic
lean cell across K = 1, 8, 64. The win must survive the cost of the extra
indirection (cell → unit at serialize). This is a deep change — it touches the
`InterpolatedVar` contract keyframes consumes — so it must be a *named value.js
tranche*, not a drive-by.

**Disposition: FOLD-VALUEJS-HANDOFF.** value.js owns `ValueUnit` and
`InterpolatedVar` (`units/index.ts`, `interpolate.ts`). keyframes only consumes
the surface. Propose: **value.js tranche "lean interpolation carrier"** —
a monomorphic interp cell / typed-array substrate behind `prepareInterpVar`,
preserving the `lerpValue` signature.
**Isomorphism:** pixel-identical (same numbers, different storage); the risk is
the serialize-boundary reconstitution must round-trip exactly.

---

## 4. D-RT-4 [FOLD-E carrier + FOLD-VALUEJS-HANDOFF primitive] — `NumericAnimation` segments want `Float64Array`

`NumericAnimation` is the advertised "zero-allocation" engine (`numeric.ts:54`)
for canvas/WebGL loops. Its `.at(progress)` hot path (`numeric.ts:152-184`) is
clean — binary search, in-place result write — but its substrate is plain
`number[]` and a per-key object:

```ts
startVals: keys.map((k) => start[k] as number),   // numeric.ts:139 — number[]
stopVals:  keys.map((k) => stop[k]  as number),   // numeric.ts:140 — number[]
...
this.result[seg.keys[i]] = lerp(seg.startVals[i], seg.stopVals[i], eased); // :176
```

For the engine whose entire reason to exist is throughput in tight render
loops, the substrate should be **`Float64Array`**: denser memory, a single
element type (no boxed-number / hole risk), monomorphic element access, and
SIMD-amenable
([Float64Array: single type, denser, SIMD](https://medium.com/swlh/exploration-of-javascript-object-for-performance-optimization-70b20246ab9e)).
`startVals`/`stopVals`/a `result` value buffer become typed arrays; the
key→index map is built once. The public `.at()` returning a `Record` can stay
(reconstitute from the typed buffer at the boundary) or gain a typed sibling.

**Perf rationale.** This is the canonical typed-array win and it lands on the
*one* engine explicitly sold for hot loops. A `number[]` in V8 may be a
packed-double array (good) but the per-key *object* write (`this.result[key]`,
`numeric.ts:176`) is the megamorphic-ish path D-RT-3 describes, at the
NumericAnimation layer. Typed arrays remove both the boxing risk and the
object-write.

**Disposition split.**
- **FOLD-E:** the `NumericAnimation` substrate swap (`numeric.ts` is
  keyframes-local, value.js-free by design — `index.ts:30`). Self-contained.
- **FOLD-VALUEJS-HANDOFF:** if this motivates a *general* typed-array
  interpolation primitive (a `lerpArray(Float64Array, Float64Array, t, out)`)
  that the heavy `ValueUnit` path could also adopt (D-RT-3), that primitive is
  value.js's to own. Propose alongside the D-RT-3 tranche.

**Measure-first gate.** Extend `interpolation.bench.ts` with a
`NumericAnimation.at()` case at K = 4 / 32 / 256 over `number[]` vs
`Float64Array`. Typed arrays win decisively only at larger K and in long
loops; confirm the small-K case (K ≤ 4) doesn't regress on the
typed-array-construction overhead before folding.

**Isomorphism:** pixel-identical numbers; the public `Record` return must
round-trip bit-exactly through the typed buffer.

---

## 5. D-RT-5 [FOLD-E seam + FOLD-VALUEJS-HANDOFF] — computed-unit path is a per-frame read-after-write layout thrash

When an animation interpolates a computed unit (`vh`/`vw`/`cqw`/`calc`/`var`),
`lerpComputedValue` resolves both endpoints against the live box every frame
(value.js `interpolate.ts:28-29` → `getComputedValue`), and `getComputedValue`
does (value.js `normalize.ts:162-164`):

```ts
style[prop] = newValue;                              // WRITE inline style
const computed = getComputedStyle(target).getPropertyValue(prop); // READ — forces layout
style[prop] = originalValue;                         // WRITE back
```

This is the **canonical layout-thrash anti-pattern**: an interleaved
write→read→write that forces a synchronous style/layout flush *inside the rAF
frame*, for `var`/`calc` on every interpolation tick. It is exactly the thing
Motion's architecture exists to eliminate — "Motion batches all reads and
writes every animation frame… reducing layout thrashing and style
recalculations"
([Motion batched read/write, 6× faster unit conversion](https://motion.dev/docs/gsap-vs-motion)).
keyframes/value.js does the opposite: it forces a layout per computed var per
frame.

**Mitigations already in place (credit where due):** `getComputedValue` is
memoized (value.js `normalize.ts:136`), and `vh`/`cqw` resolve to a stable
value while the viewport/container is static, so the *second+* frame is a cache
hit and skips the thrash. The thrash bites on: the first frame, every viewport
resize, and `calc()` whose value changes per frame. The prior audit (E-RT-4 /
D-3 / VJS-1) named the *memo-key re-serialization cost* on the cache-hit path;
this finding names the deeper issue — **the cache-miss path is a forced
synchronous layout**, and the architecture has no batched read phase to hoist
it out of the per-frame loop.

**The SOTA shape (two layers).**
- **keyframes seam (FOLD-E):** hoist endpoint resolution out of the per-frame
  loop. At `prepareInterpVar` time (`frame-compiler.ts:283-293`, when targets
  are bound) resolve the *static* computed endpoints (`vh`, `cqw`) ONCE per
  layout epoch and cache the numeric px on the `InterpolatedVar`, invalidating
  on a `ResizeObserver` tick rather than per frame. Then the per-frame
  `lerpComputedValue` is a plain numeric lerp — no `getComputedStyle`. This
  matches Motion's "read once, then write many" batching, applied at the
  keyframes layer. (This is E-RT-4's endpoint cache, reframed as *thrash
  elimination*, not memo-cost.)
- **value.js handoff (FOLD-VALUEJS-HANDOFF):** the `getComputedValue`
  write/read/write itself, and the `value.toString()` memo-key rebuild per hit
  (value.js `normalize.ts:195`, VJS-1), are value.js-owned. Propose a value.js
  tranche: a *batched resolve* entry point that resolves a *set* of computed
  values against a target in one read phase, and a memo key that doesn't
  re-stringify (cache an id on the `ValueUnit`).

**Measure-first gate.** A `proof:computed-frame` shaped bench: animate
`calc(100cqw - 100%)` (the demo's actual `AnimationVisualizer` case, per
MEMORY.md) for N frames and measure forced-reflow count (Performance panel
"Recalculate Style"/"Layout" events) and `interpFrames` p99. The endpoint
cache must drop the per-frame layout count to ~0 in steady state.

**Disposition: FOLD-E** (keyframes endpoint cache / ResizeObserver epoch) **+
FOLD-VALUEJS-HANDOFF** (batched `getComputedValue` + non-restringifying memo
key). **Isomorphism:** pixel-identical while the layout epoch is stable; the
ResizeObserver invalidation must fire before the next paint so a resize is not
one frame stale (the current per-frame resolve is never stale — this trades
one frame of staleness on resize for eliminating the per-frame thrash; gate on
whether that's acceptable, it almost always is).

---

## 6. D-RT-6 [GAP-NAMED] — the rAF write path has no `will-change` / compositor-promotion hint

WAAPI-eligible animations run on the compositor thread for free
(`waapi.ts`, ALREADY-SOTA). But WAAPI eligibility is *narrow* by design
(`waapi.ts:35-126`): it rejects color interpolation, computed units, custom
transforms, and non-uniform/non-CSS-twinned easing. So the **rAF path is the
default for the majority of interesting animations** — every oklab color
fade, every `cqw`/`calc` motion, every custom-transform render. That path
writes `target.style.setProperty` per frame (`utils.ts:316`) with **no layer
hint**: no `will-change`, no `transform: translateZ(0)`, nothing telling the
browser to promote the element to its own compositor layer. So the browser
re-rasterizes on the main thread every frame.

**The gap.** A SOTA rAF animator sets `will-change` on the animating
properties at `play()` and removes it at settle (leaving it on permanently
wastes GPU memory — the well-known `will-change` footgun). keyframes knows
exactly which properties it animates (the frames' `flatVars` keys / the
`property` field on each `ValueUnit`), so it can emit a precise
`will-change: opacity, transform` at `play()` and clear it in `settle()`.

**Cite:** This is paint-pipeline guidance — promote animated elements so the
rAF write hits a composited layer rather than triggering main-thread paint.
(General CSS compositing best practice; the modern-web-guidance INP/long-frame
docs — `identify-heavy-scripts`, Baseline: Long Animation Frames Chrome 123 —
target the *script* cost, while this targets the *paint* cost the script
triggers.)

**Why GAP-NAMED not FOLD-E:** it's a genuine behavior addition (mutating
`will-change` on targets) with a real footgun (over-promotion, memory) and an
isomorphism question (does adding `will-change` change rendering in any
observable way? — it can change stacking/`z-index` containing-block behavior
and sub-pixel anti-aliasing in edge cases). It deserves a named decision with
a measure-first gate, not a silent fold.

**Measure-first gate.** Playwright bench (`bench/playwright.bench.ts` exists)
animating a color fade (rAF path) with/without `will-change`, measuring
main-thread paint time / dropped frames via the Performance trace. Adopt only
if the composited path measurably reduces main-thread paint without
regressing the no-promotion baseline.

**Disposition: GAP-NAMED.** Named for E-fold decision; if accepted it's a
keyframes-side change in `engine.ts` `play()`/`settle()` (it knows the
properties). **Isomorphism:** intended pixel-identical, but `will-change`
*can* alter rendering at the margins — must be verified, hence GAP not FOLD.

---

## 7. D-RT-7 [FOLD-E] — `processFrame` closure + per-frame allocation, deepened

Deepens E-RT-1. `processFrame` is declared as a fresh closure inside
`interpFrames` on every call (`engine.ts:573`), capturing `t`,
`transformFrames`, `result`, `this`. That's one closure allocation per frame
plus the `out = {}` default-param allocation when the caller omits the buffer
(`engine.ts:550`). The prior audit named both. The *deeper* observation: even
with the buffer threaded, the closure is re-minted per frame because it's a
lexical inner function — hoisting it to a private method
(`_processFrame(frame, t, transformFrames, result)`) removes the per-frame
closure entirely, and the neighbor-scan loops (`engine.ts:593-604`) call the
method instead. A private method is monomorphic (one `this` shape) and the JIT
inlines it; the inner closure is re-created each call and harder to inline
across the rAF boundary.

**Perf rationale.** Closure allocation is cheap individually but it's *per
frame, per animation, forever* — it's pure steady-state garbage feeding the GC
that the `out` buffer was added to avoid. Hoisting it is the same discipline,
finished.

**Measure-first gate.** The same shaped `interpFrames` bench (D-RT-1/D-RT-2);
the closure cost shows up as allocation-rate / minor-GC frequency under a
long-running playback, not in a short microbench.

**Disposition: FOLD-E.** `engine.ts:573`. **Isomorphism:** pixel-identical
(same body, different binding site).

---

## 8. FOLD-VALUEJS-HANDOFF — value.js items the cost model surfaces (handoff, do not write)

Consolidated for the value.js owner. None of these may be written here.

1. **VJS-D1 — lean interpolation carrier (the big one).** See D-RT-3.
   `ValueUnit`'s 6-field megamorphic shape is the per-var hot-path carrier; a
   monomorphic interp cell or `Float64Array` substrate behind `prepareInterpVar`
   would monomorphize the mutation site. **Named value.js tranche.**
   (`units/index.ts:7-20`, `interpolate.ts:97,143`.)

2. **VJS-D2 — batched `getComputedValue` + non-restringifying memo key.** See
   D-RT-5. The write→read→write layout thrash (`normalize.ts:162-164`) and the
   `value.toString()` memo-key rebuild per hit (`normalize.ts:195` — re-confirms
   VJS-1) are value.js-owned. Propose a batched-resolve entry point and a
   stable-id memo key (cache an id on the `ValueUnit` instead of stringifying).

3. **VJS-D3 — `unflattenObjectToString` allocates + string-builds per call.**
   Re-confirms VJS-2 (`units/utils.ts:115-148`). The per-frame DOM write
   (D-RT-8 below / E-RT-3) calls this every frame; each call allocates a fresh
   `result` object and builds CSS strings via `keys.split(".")`, `leftS`/`rightS`
   concat, and `values.join(", ")`. A buffer-reusing / incremental-string
   variant (resolve the static `prop(…(`/`)…)` skeleton once at compile, fill
   only the changing number per frame) is the value.js-side win paired with the
   keyframes write-skip (D-RT-8). **value.js tranche.**

4. **VJS-D4 — `memoize` reads `Date.now()` per call even when `ttl===Infinity`.**
   Re-confirms VJS-3 (`utils.ts:125`). `getComputedValue`'s memo has
   `ttl=Infinity` (default) but the wrapper calls `Date.now()` on every hit
   (`utils.ts:125`). A `ttl===Infinity` fast path skips the syscall-ish read.
   Tiny, but it's on the computed-unit per-frame path; bundle with VJS-D2.

5. **VJS-D5 — `coalesce` allocates a fresh `ValueUnit` on the non-inplace
   path.** `normalizeValueUnits` calls `left.coalesce(right)` /
   `right.coalesce(left)` (value.js `normalize.ts:369-370`) at compile time
   (not per-frame, so lower priority), and `coalesce`'s default non-inplace
   branch mints a new `ValueUnit` (`units/index.ts:122-133`). Compile-time, so
   not hot — noted only for completeness; **likely BOOK, not worth a tranche
   alone.**

---

## 9. D-RT-8 [FOLD-E] — the per-frame DOM write re-serializes unconditionally, deepened

Deepens E-RT-3. `transformTargetsStyle` (`utils.ts:305-319`) is the default
renderer, called per frame when `transformFrames` is true (`engine.ts:583`).
Per frame it: (a) calls `unflattenObjectToString(vars)` — full re-serialization
(VJS-D3); (b) iterates `Object.entries(styleStringVars)` — array allocation;
(c) calls `target.style.setProperty(key, value)` for every key × every target,
**unconditionally**, even if the string is byte-identical to last frame (a
paused or settled-then-touched element, a property that hasn't changed because
its frame isn't active).

**Deeper than E-RT-3:** the prior audit named the write-skip + string cache.
The cost model adds two structural points:
- **The serialization skeleton is static.** For `transform`, the
  `translateX(…) rotate(…)` *shape* is fixed at compile time; only the numbers
  change per frame. `unflattenObjectToString` rebuilds the whole skeleton
  (`leftS`/`rightS`/split, `utils.ts:129-142`) every frame. Pre-compiling the
  skeleton at `parse()` and filling only the numbers is the structural win
  (the keyframes half of VJS-D3).
- **`setProperty` is a megamorphic DOM call.** Skipping it when the value is
  unchanged isn't just "fewer writes" — each `setProperty` can invalidate
  style and schedule paint. A last-written-string cache per (target, prop)
  elides the invalidation, not just the call.

**Measure-first gate.** Playwright bench: animate a 3-property transform for N
frames, count `setProperty` calls and style-invalidations with/without the
last-value cache. The string-skeleton cache needs the value.js handoff
(VJS-D3) to land fully; the write-skip is keyframes-local and lands alone.

**Disposition: FOLD-E** (write-skip + per-target last-string cache in
`utils.ts`) **+ FOLD-VALUEJS-HANDOFF** (the skeleton-reusing
`unflattenObjectToString`, VJS-D3). **Isomorphism:** pixel-identical —
identical writes are elided; the first write of each distinct value is
unchanged.

---

## 10. D-RT-9 [GAP-NAMED] — `scale()` throws on a zero-width frame; the loop core's promise churn

Two minor confirmations, both already named by the prior audit, re-stated with
the cost-model framing:

- **`scale(t, start, stop, 0, 1)` throws when `start === stop`** (`engine.ts:575`
  → `leaves.ts:35` / value.js `math.ts`). A degenerate zero-duration frame
  (two keyframes at the same percent, or `duration` rounding) makes
  `fromMax === fromMin` and the per-frame call *throws*. The hot path should
  treat a zero-width segment as "snap to the endpoint" (return `1` or `0`), not
  throw. Re-confirms E-RT-5. **GAP-NAMED** (edge robustness; the fix is a guard
  in `processFrame` or a non-throwing `scale` variant). Disposition note: the
  *throw* is value.js's `scale` (math.ts) but the keyframes copy in `leaves.ts`
  throws identically — the keyframes seam can guard before the call (FOLD-E) or
  value.js can offer a clamping `scale` (FOLD-VALUEJS-HANDOFF). **Isomorphism:**
  changes only degenerate-input behavior (throw → snap), which is strictly more
  correct.

- **`RAFPlayback._run` wraps every frame in `Promise.resolve(step(now)).then`**
  (`playback.ts:99-108`), and `advanceTo` is `async` (`engine.ts:662`), so the
  loop pays a microtask + promise allocation per frame even when `step` is
  synchronous (the common rAF case — `advanceTo` only awaits on the *first*
  frame for `onStart`/`delay`). Re-confirms E-RT-2. The generation-guard
  correctness it buys is real (concurrent stop/restart safety), so this is a
  *careful* measure-first fold: a synchronous fast path when `step` returns a
  boolean (not a thenable) preserves the guard while skipping the microtask.
  **Disposition: FOLD-E** (careful — keep the async path for the awaiting
  frames). **Isomorphism:** behavior-identical (events, resolve timing, the
  generation guard all unchanged); only the synchronous-frame microtask is
  elided.

---

## 11. ALREADY-SOTA — do not manufacture work here

Honest confirmations. The cost model proves these are genuinely modern:

- **Pre-resolved monomorphic lerp dispatch** (`interpolate.ts:117,143`). `_lerp`
  is resolved once per `InterpolatedVar` at `prepareInterpVar` and the hot path
  is a single indirect call — exactly the "pay dispatch once" SOTA shape. The
  *carrier* it mutates is the issue (D-RT-3), not the dispatch. **ALREADY-SOTA.**

- **O(log N) binary-search segment seek** (`binarySearch.ts:21`;
  `engine.ts:561`; `numeric.ts:156`). Branchless-ish, monomorphic accessors,
  no allocation. Textbook. **ALREADY-SOTA.**

- **`allInterpVars` pre-flatten** (`frame-compiler.ts:329`; consumed
  `engine.ts:578`). The per-frame loop iterates one pre-built flat array
  instead of `Object.values(interpVars).flat()` per frame — the allocation was
  correctly hoisted to compile time. **ALREADY-SOTA.**

- **Group zero-alloc compositor** (`group.ts:91,211-298`). `_grouped` +
  `entry.values` reused buffers, inline whitelist key-skip (no `filteredValues`
  object), in-place blend accumulation. The group is genuinely zero-alloc per
  frame — exactly as the prior audit found. (The one residue is the `delete`-loop
  dictionary-mode issue D-RT-1, which applies here too but is a *clear-mechanism*
  fix, not an allocation.) **ALREADY-SOTA** (modulo D-RT-1).

- **Dirty-flag entry cache** (`group.ts:145-157`). `Object.values` + sort
  hoisted behind a dirty flag, rebuilt only on mutation. **ALREADY-SOTA.**

- **`scheduler.yield()` with live probe + cached fallback** (`scheduler.ts:40`;
  used `group.ts:379`). Baseline-Newly native `scheduler.yield`, MessageChannel
  fallback, capability cached. INP relief for large groups done by the book
  (modern-web-guidance `identify-inp-causes`, Event Timing Baseline 2025-12-12;
  Long Animation Frames Chrome 123). **ALREADY-SOTA.**

- **Pre-bound `_boundFrame`** (`engine.ts:150`; `group.ts:75,94`). The loop
  callback is bound once in the constructor, not per `play()`. **ALREADY-SOTA.**

- **WAAPI compositor delegation** (`waapi.ts`). When eligible, hands visuals to
  the compositor thread with a faithful `linear()`/`cubic-bezier()` twin
  (`toWAAPIOptions:198-200`) and a shadow rAF that only ticks *state* (no
  `interpFrames` for visuals, `playWAAPI:242-253`). This is the correct
  off-main-thread path. The narrowness of eligibility is *why* D-RT-6
  (rAF-path `will-change`) matters. **ALREADY-SOTA.**

- **`prepareInterpVar` color hue precompute** (`interpolate.ts:143-149`;
  `lerpColorValue:57`). The cylindrical-hue dispatch and colorSpace are resolved
  at prepare time; the per-frame color lerp is a channel walk with one branch.
  Correct for perceptual interpolation. **ALREADY-SOTA.**

---

## 12. Disposition ledger

| ID | Finding | Site | Disposition | Win | Isomorphism |
|----|---------|------|-------------|-----|-------------|
| D-RT-1 | `for..in` + `delete` holds reused `out` buffer in **dictionary mode** | `engine.ts:555`; `group.ts:212` | **FOLD-E** (stable-key reset) | High (steady-state) | pixel-identical |
| D-RT-2 | `Object.assign(result, frame.flatVars)` re-copies stable dict every frame | `engine.ts:589` | **FOLD-E** (single-frame alias) | Med-High | pixel-identical |
| D-RT-3 | `ValueUnit` is a **megamorphic 6-field carrier** at the per-var mutation site | value.js `units/index.ts:7-20`; `interpolate.ts:97` | **FOLD-VALUEJS-HANDOFF** (lean interp cell / typed substrate) | **Highest structural** | pixel-identical (storage only) |
| D-RT-4 | `NumericAnimation` segments use `number[]` + per-key object write | `numeric.ts:139-140,176` | **FOLD-E** (Float64Array substrate) **+ HANDOFF** (general typed primitive) | High (large K, hot loops) | pixel-identical |
| D-RT-5 | computed-unit path = per-frame **read-after-write layout thrash** | value.js `normalize.ts:162-164`; kf `frame-compiler.ts:283` | **FOLD-E** (endpoint cache + ResizeObserver epoch) **+ HANDOFF** (batched resolve) | High (calc/cqw present) | pixel-identical while layout-epoch stable |
| D-RT-6 | rAF write path has **no `will-change`/compositor hint** | `engine.ts` `play()`/`settle()`; `utils.ts:316` | **GAP-NAMED** | Med-High (rAF majority) | intended-identical; `will-change` can alter rendering — verify |
| D-RT-7 | `processFrame` closure re-minted per frame | `engine.ts:573` | **FOLD-E** (hoist to private method) | Low-Med (GC pressure) | pixel-identical |
| D-RT-8 | per-frame DOM write re-serializes skeleton + writes unconditionally | `utils.ts:305-319`; value.js `units/utils.ts:115` | **FOLD-E** (write-skip + last-string cache) **+ HANDOFF** (skeleton reuse) | Med-High | pixel-identical (identical writes elided) |
| D-RT-9a | `scale()` throws on zero-width frame (`start===stop`) | `engine.ts:575`; `leaves.ts:35` | **GAP-NAMED** (guard / clamping scale) | Low | throw→snap (strictly more correct) |
| D-RT-9b | `_run` per-frame promise+microtask churn on sync frames | `playback.ts:99-108`; `engine.ts:662` | **FOLD-E** (sync fast path, careful — keep guard) | Med | behavior-identical |
| VJS-D1 | lean interpolation carrier (monomorphize the mutation site) | value.js `units/index.ts`, `interpolate.ts` | **FOLD-VALUEJS-HANDOFF** | Highest | pixel-identical |
| VJS-D2 | batched `getComputedValue` + non-restringifying memo key | value.js `normalize.ts:162-164,195` | **FOLD-VALUEJS-HANDOFF** | High | pixel-identical |
| VJS-D3 | `unflattenObjectToString` allocates + string-builds skeleton per call | value.js `units/utils.ts:115-148` | **FOLD-VALUEJS-HANDOFF** | Med-High | pixel-identical |
| VJS-D4 | `memoize` reads `Date.now()` when `ttl===Infinity` | value.js `utils.ts:125` | **FOLD-VALUEJS-HANDOFF** (bundle w/ VJS-D2) | Low | identical |
| VJS-D5 | `coalesce` allocates on non-inplace path (compile-time, not hot) | value.js `units/index.ts:122-133` | **BOOK** (not a tranche alone) | Negligible | n/a |
| — | dispatch / binary search / allInterpVars / group zero-alloc / entry cache / scheduler.yield / bound frame / WAAPI / hue precompute | (§11) | **ALREADY-SOTA** | — | — |

---

## 13. The measure-first discipline (gates summary)

Every FOLD here is gated on a *shaped* benchmark, not a microbench — because
the deepest findings (D-RT-1 dictionary-mode, D-RT-3 megamorphism, D-RT-7
closure GC) are **invisible to allocation-dominated microbenchmarks** and only
appear under long-running, buffer-reusing, INP-under-load playback. The gates:

1. **`interpolation.bench.ts` + a threaded-`out`-buffer variant** — the current
   bench omits the `out` buffer (the realistic playback shape), so it cannot
   see D-RT-1/D-RT-2/D-RT-7. Add it. Gates D-RT-1, D-RT-2, D-RT-7.
2. **`%DebugPrint` / `--prof` fast-properties check** — confirm the reused
   buffers stay out of dictionary mode after the fix. Gates D-RT-1.
3. **`NumericAnimation.at()` bench at K = 4/32/256, `number[]` vs Float64Array**
   — confirm typed arrays win at large K without regressing small K. Gates
   D-RT-4.
4. **`proof:computed-frame` forced-reflow bench** — animate `calc(100cqw-100%)`,
   count Recalculate-Style/Layout events. Gates D-RT-5.
5. **`bench/playwright.bench.ts` paint trace** — color-fade rAF path
   with/without `will-change`; transform anim with/without write-skip. Gates
   D-RT-6, D-RT-8.

**The honest verdict:** the interpolation *kernel* (dispatch, search, easing
call, color hue) is SOTA and should not be touched. The wins are in the
*carrier* (D-RT-3, value.js handoff — the biggest), the *buffer plumbing*
(D-RT-1/D-RT-2/D-RT-7, FOLD-E), the *computed-unit layout thrash* (D-RT-5), the
*DOM write* (D-RT-8 + D-RT-6), and the *typed substrate* for the numeric engine
(D-RT-4). Fold none without the shaped gate that proves the steady-state win —
the prior tranches' own discipline, applied to costs that don't show up in a
naive bench.

---

## Sources

- modern-web-guidance: `identify-heavy-scripts` (Long Animation Frames API,
  Baseline limited — Chrome 123 / Mar 2024), `identify-inp-causes` (Event
  Timing, Baseline Newly 2025-12-12).
- [Motion — GSAP vs Motion: batched per-frame read/write, deferred keyframe
  resolution, 6× faster unit conversion](https://motion.dev/docs/gsap-vs-motion)
- [Motion — Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list)
- [V8 hidden classes & inline caching (dictionary-mode on `delete`)](https://medium.com/@yashschandra/hidden-v8-optimizations-hidden-classes-and-inline-caching-736a09c2e9eb)
- [V8 inline caching: monomorphic / polymorphic / megamorphic (>4 shapes → slow lookup)](https://braineanear.medium.com/the-v8-engine-series-iii-inline-caching-unlocking-javascript-performance-51cf09a64cc3)
- [JS micro-optimization: hidden classes, Float64Array (single type, denser, SIMD)](https://medium.com/swlh/exploration-of-javascript-object-for-performance-optimization-70b20246ab9e)
- Live code: `src/animation/engine.ts`, `frame-compiler.ts`, `group.ts`,
  `numeric.ts`, `playback.ts`, `utils.ts`, `internal/{binarySearch,leaves,scheduler}.ts`,
  `waapi.ts`; value.js `src/units/{interpolate,index,normalize,utils}.ts`,
  `src/utils.ts`.
</content>
</invoke>
