# SOTA Audit — keyframes.js `FrameCompiler` compile-time (DEEP lane)

**Scope.** The compile pipeline only — `src/animation/frame-compiler.ts`, its compile-time
helpers in `src/animation/utils.ts` (`parseAndFlattenObject` / `tryParseCache` / `calcFrameTime`
/ `createInterpVarValue`), the `AnimationFrame` layout in `src/animation/constants.ts`, and the
single hot-path consumer of its output (`interpFrames`, `engine.ts:547-607`). This lane goes
**deeper than `a-kf-framecompiler.md`**: that doc enumerated the gaps (FC-1…FC-8) and dispositioned
them; this one **profiles the pipeline as a whole, names a concrete SOTA compile architecture, and
names the transposition** that unifies the open items into one move — plus surfaces **two findings
the prior pass missed**: a live index-space conflation in `createFrame` (D-1) and the concrete
editor workload that makes the "incremental compile is BOOK" disposition wrong (D-2).

**Relationship to the prior lane.** I do **not** re-litigate FC-1 (colorSpace staleness), FC-3
(dead `unflattenObject`), FC-5 (reconcile findIndex), FC-6 (unbounded cache), FC-8 (already-SOTA
hot path) — those dispositions stand and are cross-referenced. This lane's net-new contribution is
**D-1** (a latent correctness bug), **D-2** (the editor re-parse profile that re-prioritizes the
incremental design from BOOK to FOLD-E), and **D-3 — the named architectural transposition**: *port
the `NumericAnimation` segment discipline (`numeric.ts`) up to the CSS keyframe compiler* — which
is the single move that subsumes FC-2 (idempotence), FC-4 (SoA layout), and the incremental rebuild
into one coherent compile architecture the codebase **already proves works**.

Disposition legend: **FOLD-E** · **FOLD-VALUEJS-HANDOFF** · **BOOK** · **GAP-NAMED** · **ALREADY-SOTA**.

---

## Pipeline profile (the mental trace this lane runs)

A single `parse()` (`frame-compiler.ts:278-331`) over an F-stop, V-property animation does, in order:

1. `this.frames = []` — discard prior compile (:279).
2. `templateFrames.sort` — O(F log F) (:281).
3. `templateFrames.map(parseAndFlattenObject)` — per frame: `flattenObject`, then per var a
   `tryParseCache` lookup + **`.clone()`** (`utils.ts:184-185,209`) + `setTargets` (:288-290).
   Cold: O(F·V·parse). Warm: O(F·V·clone). **Every clone walks the full `ValueUnit` graph.**
4. adjacent `createFrame(i,i+1)` loop — O(F), each calling `calcFrameTime` + two
   `seekPreviousValue` scans (`frame-compiler.ts:163-179`, O(F) each → **O(F²)** worst case).
5. `buildVarIndex` — O(F·V) `Object.keys` walk (:203-216).
6. `reconcileVars` per frame — O(F) × {`Object.keys` re-walk of `parsedVars[ix]` + a
   `frames.findIndex`} → **O(F²·V)** worst case (FC-5).
7. `frames.sort` by (start,stop) — O(F log F) (:304-309).
8. `frames.filter` empty-interp — O(F) (:312-316).
9. pre-flatten loop — per frame: build `flatVars` (`reduce`), **`unflattenObject` into `frame.vars`**
   (:327, dead on the CSS path — FC-3), `Object.values().flat()` into `allInterpVars` (:329).

**The profile's verdict.** Steps 3 (clone) and 6 (O(F²·V) reconcile) dominate; step 9 carries one
dead allocation. For a 2-stop opacity fade this is microseconds — irrelevant. The cost only matters
under the **re-parse workload** (D-2), where steps 1→9 run **twice per debounced keystroke** and the
clone-storm + O(F²) reconcile recur on every edit. The hot path (`interpFrames`) is **separately
SOTA** (FC-8) and untouched by any of this — the open work is **all compile-time**.

---

## D-1 (NET-NEW) — `createFrame` conflates template-index and compiled-frame-index spaces (latent correctness bug)

- **Cite:** `frame-compiler.ts:163-179`. `createFrame(startIx, endIx)` inherits a missing
  `transform`/`timingFunction` via `seekPreviousValue(startIx, this.frames, pred)` — but `startIx`
  is a **`templateFrames` index** (it is used as such for `this.templateFrames[startIx]` at :151),
  while `seekPreviousValue` searches **`this.frames`** (the *compiled* frame array) and the result
  indexes back into `this.frames[transformIx]` (:169,179).
- **The bug.** During the adjacent loop (`createFrame(i, i+1)`, :295-297) the two index spaces
  *happen* to coincide — `this.frames[i]` is the frame just pushed for `templateFrames[i]`, so
  `seekPreviousValue(i, this.frames, …)` walks the right frames. But `reconcileVars` calls
  `createFrame(startIx, endIx)` with **non-adjacent template indices** (`frame-compiler.ts:248,256`)
  while `this.frames.length` and ordering no longer track `templateFrames` (frames have been pushed
  out of template order, some templates produce no frame). At that point `seekPreviousValue(startIx,
  this.frames, …)` walks `this.frames` *by a template index*, reading the wrong frames' transform /
  timingFunction. It is masked today because (a) the default renderer is on **every** template frame
  (`resolveTransform` stamps `_defaultTransform` on all of them via the `from*` paths,
  `engine.ts:944-948`), so `startFrame.transform` is never null and the transform branch is dead in
  practice; and (b) per-keyframe `animation-timing-function` is the only path that leaves
  `timingFunction == null` (`frame-compiler.ts:134-137` inherits it on add when present), and when it
  *is* sparse, the wrong-index lookup still usually lands on a frame carrying the inherited curve. So
  it is **latent**, not currently observable — but it is a genuine index-space conflation that will
  mis-attribute the easing the moment a non-adjacent reconciled segment needs to inherit a
  per-keyframe curve from a specific earlier template.
- **SOTA gap.** A compiler must not index one array by another array's offsets. The correct seek is
  over `templateFrames` (where `startIx` is meaningful) reading `templateFrames[i].timingFunction` /
  `.transform`, **not** over the half-built `this.frames`. The inheritance is a *template* property
  (CSS `animation-timing-function` cascades down keyframes by percent order), so it belongs on the
  template axis.
- **Disposition:** **FOLD-E** — change the two `seekPreviousValue` calls to walk `this.templateFrames`
  (reading the template's `transform`/`timingFunction`), making the index space consistent with
  `startIx`. Small, local. Add a lock-test: a 3-stop animation with a per-keyframe
  `animation-timing-function` on the *middle* stop and a var that reconciles across 1→3 (non-adjacent)
  must inherit the correct curve.
- **Isomorphism:** pixel-identical for the masked common case (uniform transform + uniform easing);
  it **fixes** the sparse-per-keyframe-easing case that is currently silently wrong — a deliberate,
  befitting break, locked by the new test.

---

## D-2 (NET-NEW) — the editor re-parse profile makes incremental compile FOLD-E, not BOOK

- **Cite:** `useKeyframeOps.ts:47-80` (`updateAnimationFromKeyframesString`, debounced 1000ms) and
  `KeyframesEditor.vue:235` (`watch(cssKeyframesString, …)`). On **every** debounced edit the editor:
  (1) constructs a **fresh** `CSSKeyframesAnimation(...).fromKeyframes(keyframes)` — which runs the
  full `parse()` once (`engine.ts:984`); then (2) copies `templateFrames`/`options` onto the live
  animation and calls `animation.parse()` **a second time** (`useKeyframeOps.ts:66-69`). That is a
  **double whole-program compile per keystroke-batch**, each pass paying steps 3 (clone-storm) and 6
  (O(F²·V) reconcile) of the profile. `KeyframesStringControls.vue:143` and the timeline rebuild
  (`timelineEngine.ts`) share the pattern.
- **The gap.** `a-kf-framecompiler.md` FC-2 dispositioned incremental compile as **BOOK** —
  *"only worth building if a measurement shows frame-by-frame builders are a real workload."* This
  lane **finds the workload**: the demo's own keyframe editor is exactly a frame-by-frame /
  edit-per-keystroke builder, and it re-compiles the whole program (twice) on each edit. The prior
  doc's premise ("for batch `from*` it's a non-issue") holds for the static `from*` calls but **not**
  for the live editor, which is the headline interactive surface of the whole project.
- **SOTA reference.** Incremental compilation is the SOTA discipline for edit-driven pipelines:
  salsa / rustc's query model and lightningcss's per-rule independence both dirty only what an edit
  touched. csstree exposes per-node walk/replace so an editor mutates a sub-tree rather than
  re-lexing the document. The keyframes.js analogue is fine-grained: an edit to one keyframe's vars
  should dirty only the `(prev, edited, next)` segments (the same locality `NumericAnimation.update
  Keyframe` already exploits, `numeric.ts:186-205`).
- **Disposition:** **FOLD-E** (re-prioritized from BOOK) — but **scoped via D-3**: the cheapest,
  most honest win is *not* a bespoke incremental engine; it is **(a)** stop the editor's double
  compile (call `parse()` once, not via a throwaway `CSSKeyframesAnimation` *and* again on the live
  one — a demo-side fix), and **(b)** land D-3's segment transposition so the per-edit cost drops to
  the touched segments. (a) is a pure demo cleanup (no engine change); (b) is the architecture below.
  Even before (b), bounding `tryParseCache` (FC-6) and FC-3's dead-alloc removal cut the per-edit
  constant.
- **Isomorphism:** (a) is behavior-identical (one compile vs two produce the same `frames[]`, modulo
  the `frameId` non-determinism FC-2 already flags — which D-3 also fixes). (b) must assert byte-equal
  `frames[]` vs the whole-program path in CI.

---

## D-3 (THE TRANSPOSITION) — port the `NumericAnimation` segment discipline up to the CSS keyframe compiler

> **Named transposition:** *"`AnimationFrame` is a `NumericSegment` that forgot it was one."* The
> codebase **already ships** the SOTA compile shape — in `numeric.ts` — for the numeric case. The CSS
> compiler is the same problem (sorted keyframes → sampled segments → binary-search lookup → lerp)
> with a richer leaf (`ValueUnit` instead of `number`). The move is to **transpose `NumericAnimation`'s
> struct-of-arrays + incremental-segment-rebuild discipline onto `FrameCompiler`**, not to invent a
> new architecture. This single transposition subsumes FC-2, FC-4, and D-2's incremental need.

**What `NumericAnimation` already does right (the template to copy):**
- **Struct-of-arrays segment** (`numeric.ts:8-15`): a `NumericSegment` is `{ startPos, stopPos,
  keys: string[], startVals: number[], stopVals: number[], timingFunction }` — parallel typed arrays
  keyed by a compile-time `keys[]` index, *not* an object-of-arrays-of-objects. The lookup
  (`numeric.ts:152-184`) binary-searches `startPos`/`stopPos` and lerps `startVals[i]→stopVals[i]`
  into a **stable pre-allocated `result`** (`numeric.ts:117,176`) — zero alloc, cache-dense.
- **Incremental rebuild** (`numeric.ts:186-205`): `updateKeyframe(index, values)` mutates the one
  keyframe and **recomputes only the 1–2 adjacent segments** (`numeric.ts:197-202`). This is the
  exact fine-grained dirtying salsa/lightningcss do — and it's already here, tested, shipping.

**What `FrameCompiler` does instead (the gap):**
- `AnimationFrame` (`constants.ts:83-115`) is `{ time:{start,stop}, interpVars:{[k]:InterpolatedVar[]},
  allInterpVars, flatVars, vars, … }` — object-of-arrays-of-objects. The binary search chases
  `frame.time.start` / `frame.time.stop` through accessor closures (`engine.ts:561-566`), and the
  per-tick merge is `Object.assign(result, frame.flatVars)` per active frame (`engine.ts:589`).
- `parse()` is whole-program and non-incremental (the profile above). There is **no** `updateKeyframe`
  analogue; the editor's only lever is "rebuild everything" (D-2).

**The transposed compile architecture (concrete):**

1. **A parallel typed time index.** Alongside `frames[]`, compile a `Float64Array startTimes` and
   `Float64Array stopTimes` (struct-of-arrays). `binarySearchRange` indexes the flat arrays instead
   of chasing `f.time.start` closures (`engine.ts:563-565`) — cache-dense, branch-predictable. (This
   is FC-4(1), and it's the *direct* port of `NumericSegment.startPos/stopPos` being primitives the
   binary search reads without indirection.) **Isomorphism:** identical lookup result; pure
   representation change.

2. **Compile-time output slots, not per-tick `Object.assign`.** Today the aliasing is the load-bearing
   contract: `flatVars[key] = interpVars[key].map(v => v.value)` (`frame-compiler.ts:323`) so
   `frame.flatVars` holds the **same `ValueUnit` objects** `lerpValue` mutates in place via `iv.value`
   (`value.js interpolate.ts:101,123`); the downstream renderer stringifies those mutated units. The
   `Object.assign(result, frame.flatVars)` (`engine.ts:589`) re-copies every key of every active frame
   each tick. The SoA move: at compile time assign each output **key a stable slot** and write
   `lerpValue` results straight into a stable `result` buffer by slot (exactly `NumericAnimation`'s
   `this.result[keys[i]] = …`, `numeric.ts:176`). Removes the per-tick key-copy churn for
   multi-active-frame animations. **Isomorphism:** same interpolated values, same output keys; the
   slot map is a compile-time permutation. Lock with `interpolation.bench.ts` as the equivalence
   guard.

3. **Incremental `updateSegments(touchedKeyframeIx)`.** Port `numeric.ts:186-205` directly: an edit
   to keyframe `k`'s vars re-runs `parseAndFlattenObject` for `templateFrames[k]` only, then
   re-`createInterpVarValue` for the segments incident on `k` (the `(prev→k)` and `(k→next)` pairs,
   plus any reconciled non-adjacent segment that ends/starts at `k`, recoverable from `varIndex`).
   Everything else is retained. This is the FOLD-E answer to D-2 and to FC-2's incremental BOOK in
   one move — and because `NumericAnimation` already proves the locality is correct, the design is
   **not speculative**.

4. **Deterministic, content-derived `frameId`.** While transposing, kill the monotonic `frameId++`
   (`frame-compiler.ts:147,182` — FC-2's purity hole) by keying frames on the stable `(startIx,stopIx)`
   pair already in `ixs` (`frame-compiler.ts:154-157`). `NumericAnimation` doesn't even carry a frame
   id — the segment's `(startPos,stopPos)` *is* its identity. Two `parse()`s on identical input then
   yield byte-identical `frames[]` (the FC-2 lock-test). **Isomorphism:** `frame.id` values change but
   no consumer keys on them (`getAnimationId` reads the *animation* id, `engine.ts`); behavior- and
   pixel-stable.

- **Perf/elegance rationale.** This is the **gestalt** move: the project maintains two parallel
  keyframe engines (`NumericAnimation` light/numeric, `FrameCompiler` heavy/CSS) where one is SOTA
  (SoA + incremental) and one is not (object-graph + whole-program). Transposing the proven discipline
  upward (a) deletes the architectural inconsistency, (b) makes the editor workload (D-2) cheap, (c)
  closes FC-2's determinism hole and FC-4's layout gap as a side effect of one redesign rather than
  four point-fixes, and (d) is **low-risk because the target shape is already a tested, shipping unit**
  in the same codebase. KISS: don't invent — *unify*.
- **Disposition:** **FOLD-E** for the determinism+slot+typed-time sub-moves (1,2,4 — each independently
  isomorphic and bench-guardable); **FOLD-E (scoped, behind a bench gate)** for the incremental
  `updateSegments` (3) — land it with the equivalence assertion (incremental `frames[]` ≡
  whole-program `frames[]`) as the CI guard. The richer-leaf caveat is honest: `ValueUnit`'s mutable
  object model (`value.js index.ts:7-20`) means the *values* stay `ValueUnit`s (the aliasing contract
  must hold) — the SoA discipline applies to the **time index and the slot map**, not to flattening
  the leaves into raw `Float64Array`s. That's the bounded, honest scope; do not over-reach into a
  full numeric SoA that fights the value model.
- **Isomorphism (whole transposition):** every sub-move is a pure representation/scheduling change with
  identical interpolated output; guarded by `interpolation.bench.ts` equivalence + the new
  `frames[]` byte-equality lock. No pixel changes except D-1's deliberate per-keyframe-easing fix.

---

## D-4 — `tryParseCache` clone-on-read is the right model; the clone-storm is a re-parse artifact (subsumed by D-2/D-3)

- **Cite:** `utils.ts:145,183-185,209`. The cache holds an immutable template; hits return
  `cached.clone()` and misses store `parsed.clone()` — **correct**, because the engine mutates
  `ValueUnit`s in place during interpolation (`setTargets`/`setProperty` and the in-place `lerpValue`).
  The model itself is SOTA (it's what makes WASM unnecessary, per `r-wasm-compile-perf.md` F1).
- **The deeper observation (beyond FC-6's "bound it").** The clone cost is paid **per `parse()`**:
  re-parsing re-clones the *whole* `parsedVars` set (`frame-compiler.ts:283-293`), then
  `createInterpVarValue` clones again inside `normalizeValueUnits` (`utils.ts:281`). Under D-2's
  double-compile-per-edit this is the dominant per-keystroke cost. **The fix is structural, not
  cache-tuning:** D-3(3)'s incremental rebuild re-clones only the touched keyframe's vars; FC-6's
  bound (FOLD-E) caps memory; the demo-side single-compile (D-2(a)) halves it immediately.
- **Disposition:** cache bound = **FOLD-E** (= FC-6 = `r-wasm-compile-perf.md` F3, do not duplicate).
  Clone-storm = **subsumed by D-2/D-3** (don't re-parse / re-parse only the touched segment). value.js
  `memoize` LRU upgrade = **FOLD-VALUEJS-HANDOFF** (H1 below, merge with the existing handoff).
- **Isomorphism:** hits stay byte-identical; only cold-entry eviction timing changes. Behavior-stable.

---

## D-5 — ALREADY-SOTA (do not manufacture work)

- **The hot path** (`interpFrames`, `engine.ts:547-607`): binary-search seed + contiguous-neighbor
  scan (O(log N)+O(active)), `allInterpVars` flat walk with `prepareInterpVar`-resolved `_lerp`
  (zero per-call dispatch — `value.js interpolate.ts:117-118,143-150`), reusable `out` buffer (no
  per-tick output alloc). This is at the frontier; D-3's slot-buffer is the only residual *copy*
  (not alloc) refinement, gated on bench. **ALREADY-SOTA.**
- **`varIndex` reconciliation** (`frame-compiler.ts:203-216`): the O(F²) "next occurrence" findIndex
  was already replaced with a name→indices map in D. Only the *frame-existence* findIndex remains
  (FC-5). **ALREADY-SOTA** (the half it covers).
- **`allInterpVars` / `flatVars` pre-flatten** (`frame-compiler.ts:319-330`): the
  `Object.values().flat()` is done once at compile time. **ALREADY-SOTA** (= F7).
- **The D.W4 split** (`frame-compiler.ts:6-13`): a clock-free, playback-free, value-in→frames-out
  compiler — the right seam, unit-testable without a loop (`frame-compiler.test.ts:71-78`).
  **ALREADY-SOTA.**
- **The live-options reference for `duration`/`easing`** (`frame-compiler.test.ts:54-69`): genuinely
  SOTA — `setDuration` rescales `frame.time` in place (`engine.ts:318-329`), easing is read per-frame
  in the hot path (`engine.ts:576`). Only `colorSpace`/`hueMethod` break the promise (FC-1, unchanged
  disposition). **ALREADY-SOTA** (for the two it covers).

---

## value.js hand-off (FOLD-VALUEJS-HANDOFF)

> value.js is dirty + active; these are proposals for the value.js owner to formalize as a value.js
> tranche. Do not write value.js from keyframes.js. Consistent with `a-kf-framecompiler.md` H1/H2 and
> `r-wasm-compile-perf.md` H1.

### H1 — Bound the parse/normalize memo caches (LRU) + LRU-on-hit  *(merge with existing handoff)*
- **Where:** `value.js/src/utils.ts` `memoize` (default unbounded; FIFO eviction) and its unbounded
  consumers (parsing/units/color/stylesheet/normalize). keyframes.js's own `tryParseCache` (D-4/FC-6)
  mirrors the hazard and will be bounded kf-side.
- **Proposal:** generous default cap (e.g. 1024) so real working sets never evict; upgrade FIFO →
  true LRU (`delete`+`set` on hit). Closes the unbounded-memory hazard for the editor's
  per-keystroke generated CSS (D-2) at zero steady-state cost. **Same item as `a-kf-framecompiler.md`
  H1 and `r-wasm-compile-perf.md` H1 — one value.js tranche entry, not three.**
- **Isomorphism:** hits byte-identical; only cold-entry eviction timing changes.

### H2 — A cheap `clone` / structural-share path for re-parse  *(net-new framing, low priority)*
- **Where:** `value.js/src/units/index.ts` `ValueUnit.clone` and the `ValueArray.clone` it composes
  (consumed at `kf utils.ts:184-185,209`).
- **Context:** D-3's incremental rebuild and D-4's clone-storm both want the clone to be the *only*
  per-edit allocation that scales with the **touched** keyframe, not the whole document. If value.js's
  `clone` deep-walks a large `FunctionValue`/`ValueArray` graph, an editor re-parsing one keyframe of
  a many-property animation still pays a graph-walk. **Propose:** confirm `ValueUnit`/`ValueArray`
  clone cost is bounded by the *single value's* graph (it appears to be — each cache entry is one
  property's `ValueArray`); if a structural-share (copy-on-write) clone is cheap to expose, it would
  make D-3(3)'s per-segment rebuild near-free. **Low priority** — only matters once D-3(3) lands and
  only if clone shows up in the editor profile.
- **Isomorphism:** identical cloned values; pure allocation-strategy change.

### H3 — confirm `normalizeValueUnits` re-normalize seam for FC-1(a)  *(= prior H2, unchanged)*
- Carried forward from `a-kf-framecompiler.md` H2: if FC-1 picks "re-normalize existing segments on
  `setColorSpace` without a full re-parse," value.js needs a helper that re-derives a live
  `InterpolatedVar` into a new color space from its retained `start`/`stop` (`value.js interpolate.ts:
  143-150`). May already be covered by `normalizeValueUnits` over the retained endpoints — confirm; if
  not, expose one. **Low priority**, enables FC-1's clean fix only.

---

## Summary table

| ID  | Title | Disposition | Priority | Overlap |
|-----|-------|-------------|----------|---------|
| D-1 | `createFrame` template-index vs frame-index conflation | **FOLD-E** | **High (correctness, net-new)** | new |
| D-2 | editor re-parse profile → incremental is FOLD-E not BOOK | **FOLD-E** (demo single-compile) + scoped via D-3 | **High** | re-prioritizes FC-2 |
| D-3 | **transposition:** port `NumericAnimation` SoA + incremental segments up to `FrameCompiler` | **FOLD-E** (1,2,4) / **FOLD-E bench-gated** (3) | **High** | subsumes FC-2,FC-4,D-2 |
| D-4 | `tryParseCache` clone model right; clone-storm is a re-parse artifact | FOLD-E (bound) / subsumed by D-2,D-3 | Med | = FC-6 / F3 |
| D-5 | hot path / varIndex / pre-flatten / split / live-duration | **ALREADY-SOTA** | — | ⊇ FC-8 / F7 |
| H1  | bound value.js memo caches (LRU) | FOLD-VALUEJS-HANDOFF | Med | merge FC-H1 / F3-H1 |
| H2  | bounded/structural-share `clone` for incremental re-parse | FOLD-VALUEJS-HANDOFF | Low | new (enables D-3·3) |
| H3  | re-normalize seam for colorSpace change | FOLD-VALUEJS-HANDOFF | Low | = FC-H2 (enables FC-1a) |

**Net.** The FrameCompiler's **hot path is SOTA** (D-5) — D.W4's hardening hit the frontier and this
lane confirms it, not re-opens it. The deep contribution is three things the prior pass did not name:
**(D-1)** a real index-space conflation in `createFrame` that mis-attributes per-keyframe easing in
the non-adjacent reconcile case (FOLD-E, with a lock-test); **(D-2)** the demo's own keyframe editor
is the frame-by-frame re-parse workload that re-prioritizes incremental compile from BOOK to FOLD-E
(double-compile-per-keystroke today); and **(D-3)** the named transposition — *the CSS compiler should
be the `NumericAnimation` segment engine with a `ValueUnit` leaf* — which unifies FC-2's determinism,
FC-4's SoA layout, and D-2's incremental need into one redesign whose target shape is **already a
tested, shipping unit in the same repo**. The remaining compile-time items (FC-1 colorSpace staleness,
FC-3 dead `unflattenObject`, FC-5 reconcile findIndex, FC-6 cache bound) stand as the prior lane
dispositioned them and are folded opportunistically when D-3 touches `parse()`. Two value.js handoffs
(H1 cache bound — merge; H2 a bounded clone that makes D-3's incremental rebuild near-free).
