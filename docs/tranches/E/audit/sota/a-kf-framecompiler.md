# SOTA Audit — keyframes.js `FrameCompiler` (compile-time lane)

**Scope.** The frame-compilation half of the engine — `src/animation/frame-compiler.ts`
(the D.W4 split out of the former 1019-line `Animation` god-object) plus the compile-time
helpers it leans on in `src/animation/utils.ts` (`parseAndFlattenObject`, `tryParseCache`,
`calcFrameTime`, `createInterpVarValue`) and the `AnimationFrame` data layout in
`src/animation/constants.ts`. The pipeline under audit:
`addFrame()` → `parse()` → sort templates → `parseAndFlattenObject` → `createFrame` →
`buildVarIndex` → `reconcileVars` → sort/filter → pre-flatten (`flatVars`/`vars`/`allInterpVars`).

**Verdict — headline.** The compiler is **largely SOTA on the things that were measured and
hardened in D** (the O(N²) → O(N) `varIndex`, the `allInterpVars`/`flatVars` pre-flatten for
zero-alloc rAF iteration, the `tryParseCache` on the per-value parse, `prepareInterpVar`'s
pre-resolved lerp dispatch). The real gaps this lane surfaces are **not** the same as the
broad WASM/compile-perf lane (`r-wasm-compile-perf.md`, which named F4 = the one residual
findIndex). They are: **(1) a genuine compile-staleness correctness gap** — `setColorSpace`/
`setHueMethod` mutate `options` but never recompile, and the interp segments bake the color
space at compile time, so the doc-comment's "colorSpace changes are seen" is false post-parse;
**(2) `parse()` is whole-program, non-incremental and non-idempotent** — every `addFrame`
batch re-flattens, re-normalizes, re-clones, and re-sorts ALL frames from scratch, and
`frameId` accumulates across re-parses (a monotonic-counter leak); **(3) a dead compile-time
allocation** — `frame.vars = unflattenObject(...)` is computed for every frame but never read
on the `CSSKeyframesAnimation` path (the common case); **(4) the `AnimationFrame` layout is an
object-of-arrays-of-objects** where a struct-of-arrays / typed-time-array layout is the SOTA
hot-path shape; **(5) the residual `findIndex` (already named F4) plus an O(V) `Object.keys`
re-walk that the `varIndex` could subsume.**

Disposition legend: **FOLD-E** (keyframes.js, fold into Tranche E) · **FOLD-VALUEJS-HANDOFF**
(propose a value.js tranche; do not write value.js) · **BOOK** (record for later) ·
**GAP-NAMED** (named gap, no action now) · **ALREADY-SOTA**.

> **Relationship to `r-wasm-compile-perf.md`.** That lane covered the parser/WASM picture and
> named the `tryParseCache` bound (its F3) and the `reconcileVars` findIndex (its F4). This doc
> goes **deeper into the FrameCompiler specifically** — the compile staleness, the re-parse
> idempotence, the data layout, the dead `unflattenObject`. Overlapping items (FC-5 ↔ F4,
> caches ↔ F3/H1) are cross-referenced, not re-litigated; the dispositions agree.

---

## FC-1 — Compile-staleness: `setColorSpace`/`setHueMethod` mutate options but never recompile (the comment lies)

- **Cite:** `frame-compiler.ts:86-92` doc-comment claims the live-options reference means
  *"duration/easing/**colorSpace** changes are seen without re-linking."* The color space is
  consumed **only at compile time**: `reconcileVars` passes `this.options.colorSpace` /
  `this.options.hueMethod` into `createInterpVarValue` (`frame-compiler.ts:262-264`), which
  bakes them into the normalized segment via `normalizeValueUnits(l, r, { colorSpace, hueMethod })`
  → `prepareInterpVar(...)` (`utils.ts:279-281`). After `parse()`, the segments are frozen in
  that space — `prepareInterpVar` even pre-resolves `_lerp` to the color path
  (`value.js/src/units/interpolate.ts:143-150`). Meanwhile `setColorSpace`/`setHueMethod`
  (`engine.ts:428-457`) write `options` and **return — no `parse()`**. Contrast `setDuration`
  (`engine.ts:318-329`), which DOES reconcile in place (rescales `frame.time` by the ratio).
- **The gap.** "Live reference" is true for `duration` (because the times are rescaled on the
  setter) and for `easing` (read per-frame in the hot path via `frame.timingFunction.fn`), but
  **false for `colorSpace`/`hueMethod`** — those are compile-baked and the setters don't
  recompile. So `anim.fromString(css); anim.setColorSpace("lab")` silently keeps interpolating
  in `oklab`. The comment actively misleads (it names colorSpace as an example of what's "seen").
- **Why it matters / elegance.** This is the subtlest failure mode of the D.W4 split that the
  test suite reaches for (`frame-compiler.test.ts:54-69` locks the duration case) but does NOT
  cover for colorSpace. CSS Color 4 / value.js make perceptual spaces (`oklab` default,
  `constants.ts:181`) the whole point of the color machinery; a setter that no-ops is a
  correctness gap, not a perf one.
- **Disposition:** **FOLD-E.** Two honest options, KISS-ranked:
  - **(a)** Make `setColorSpace`/`setHueMethod` re-trigger compilation when frames already
    exist (mirror `setDuration`'s "reconcile-on-set" posture) — but a *full* re-parse is
    heavyweight (FC-2); a cheaper move is to re-run only the normalize step over existing
    `interpVars` (re-`createInterpVarValue` from `parsedVars`, no re-flatten/re-sort).
  - **(b)** If recompile-on-set is rejected as too costly, **fix the comment** and document
    that colorSpace/hueMethod are compile-time-bound (set them before `parse()`), and add a
    lock-test asserting the bound behavior so the contract is explicit. (a) is the SOTA
    answer; (b) is the honest minimum.
- **Isomorphism:** (a) changes pixels *only* for the post-parse-setColorSpace case that is
  currently silently wrong — i.e. it makes a broken case correct (a deliberate, befitting
  break). (b) is pixel-identical, doc-only.

---

## FC-2 — `parse()` is whole-program, non-incremental, and non-idempotent (`frameId` accumulates)

- **Cite:** `frame-compiler.ts:278-331`. Every `parse()` call: `this.frames = []` (:279),
  re-sorts ALL `templateFrames` (:281), re-runs `parseAndFlattenObject` over **every** frame's
  vars (:283-293), rebuilds every adjacent `createFrame` (:295-297), rebuilds `varIndex`
  (:300), re-reconciles (:301), re-sorts (:304-309), re-filters (:312-316), and re-flattens
  (:319-330). The `CSSKeyframesAnimation.from*` paths call `parse()` once after a full
  `addFrame` batch (`engine.ts:960,984,1031`) — good. But the **public `addFrame` is chainable
  and `parse()` is public**, so an incremental builder (`anim.addFrame(...).parse()` then later
  `anim.addFrame(...).parse()`) pays the **full** recompile each time, O(F·(parse+sort+normalize))
  per added frame → O(F²·…) to build a timeline frame-by-frame.
- **Second, sharper smell — `frameId` is monotonic across re-parses.** `createFrame` does
  `const id = this.frameId++` (`frame-compiler.ts:182`) and `addFrame` also `this.frameId += 1`
  (:147). `parse()` never resets `frameId`. So re-parsing the same animation **mutates the
  compiler's id counter every time** and assigns *different* frame ids on each compile — frame
  identity is not stable across recompiles. For a value-in→frames-out "pure" unit (the stated
  design, :6-13), `parse()` producing a different-id `frames[]` on identical input is a purity
  violation. `getAnimationId` (`engine.ts:73-76`) falls back to `String(animation.id)` (the
  *animation* id, not frame id) so this doesn't leak to consumers today, but it's a latent
  determinism gap (e.g. snapshot-testing compiled frames, or any future frame-keyed cache).
- **SOTA gap.** SOTA compile pipelines (incremental computation — salsa/rustc query model,
  React/Solid fine-grained reactivity, lightningcss's per-rule independence) are
  **incremental**: a new keyframe should dirty only the segments it touches. Here the unit is
  small enough (≤ ~20 stops typical) that whole-program recompile is *acceptable*, but the
  **non-determinism (`frameId`) and the lack of an idempotence contract** are the real defects,
  not the recompute cost.
- **Disposition:**
  - `frameId` determinism: **FOLD-E** — reset/derive `frameId` deterministically inside
    `parse()` (e.g. `frameId = templateFrames.length` at compile start, or key frames by
    `(startIx,stopIx)` instead of a counter — the `ixs` pair is already a stable identity at
    :154-157, making the `id` field nearly redundant). Small, isomorphic to consumers, closes
    the purity hole. Add a lock-test: two `parse()`s on identical input yield byte-identical
    `frames[]` (ids included).
  - Incremental compile: **BOOK** — only worth building if a measurement shows frame-by-frame
    builders are a real workload; for batch `from*` it's a non-issue. Record the design (dirty
    only the affected `(prev,new,next)` segments) so it isn't reinvented.
- **Isomorphism:** the `frameId` fix changes the *values* of `frame.id` but not behavior
  (no consumer keys on it); pixels identical. Incremental compile (if ever built) must assert
  byte-equal `frames[]` vs the whole-program path in CI.

---

## FC-3 — Dead compile-time allocation: `frame.vars = unflattenObject(...)` is never read on the CSS path

- **Cite:** `frame-compiler.ts:319-330` computes, per frame, BOTH `frame.flatVars` (the flat
  `{key: ValueUnit[]}`) AND `frame.vars = unflattenObject(frame.flatVars)` (:327). In the hot
  path `interpFrames` (`engine.ts:582-589`) `frame.vars` is read **only** when
  `transformFrames === true` *and* `this.unflatten === true` (:584). But
  `CSSKeyframesAnimation` sets `this.unflatten = false` in its constructor (`engine.ts:934`)
  and keeps it false unless a *custom* transform is supplied (`resolveTransform`,
  `engine.ts:944-949`). So for **every CSS-keyframe animation using the default DOM renderer —
  the dominant case** — `frame.vars` is computed at compile time and never read (the renderer
  consumes `frame.flatVars` via `Object.assign(result, frame.flatVars)` at :589 and the
  transform reads `frame.flatVars`).
- **SOTA gap.** This is a compile-time allocation (an `unflattenObject` building a nested
  object graph per frame) that is dead for the common path. SOTA = *don't materialize what the
  hot path won't read.* The `unflatten` flag is known at compile time (it's an instance field
  set before `parse()` in all `from*` paths), so the compiler could skip building `frame.vars`
  unless `unflatten` is true, or build it lazily (getter) on first read.
- **Why it matters.** Per-frame nested-object construction over many-stop animations
  (editors, generated keyframes) is wasted first-paint work; for an 11-stop × multi-property
  animation it's 10+ `unflattenObject` calls producing garbage.
- **Disposition:** **FOLD-E** — small, local, isomorphic. Cleanest form: pass `unflatten`
  (or the consuming Animation's flag) into `parse()`/the pre-flatten step and gate the
  `frame.vars = unflattenObject(...)` line; or make `vars` a lazy getter on the frame computed
  from `flatVars` on first access. Either keeps the field's contract while removing the dead
  work.
- **Isomorphism:** pixel-identical — `frame.vars` is only ever read where it's still built;
  the gate removes computation no observer depends on. Must keep a lock-test for the
  custom-transform path (`unflatten = true`) so `frame.vars` is still materialized there.

---

## FC-4 — `AnimationFrame` data layout: object-of-arrays-of-objects vs. struct-of-arrays for the hot path

- **Cite:** `constants.ts:83-115` — `AnimationFrame` is `{ id, start, ixs, time:{start,stop},
  flatVars: V, vars: V, interpVars: {[k]: InterpolatedVar[]}, allInterpVars: InterpolatedVar[],
  transform, timingFunction }`. The hot path (`interpFrames`, `engine.ts:573-590`) per active
  frame: reads `frame.time.{start,stop}`, calls `frame.timingFunction.fn`, iterates
  `frame.allInterpVars` calling `lerpValue`, then `Object.assign(result, frame.flatVars)`.
- **What's already SOTA (credit where due):** `allInterpVars` is the pre-flattened array
  (`frame-compiler.ts:329`) so the per-frame loop is a flat array walk with `iv._lerp` already
  resolved (`prepareInterpVar`) — zero per-call dispatch, zero allocation. This is the right
  move and is correctly called out in `r-wasm-compile-perf.md` F7. The binary-search seed +
  contiguous neighbor scan (`engine.ts:561-604`) is also SOTA (O(log N) + O(active)).
- **The residual layout gap (mild, honest).** Two things keep it short of frontier:
  1. **`frame.time` is a per-frame `{start, stop}` object** — the binary search reads
     `f.time.start`/`f.time.stop` via two accessor closures (`engine.ts:563-565`). For the
     search-heavy step, a **parallel typed `Float64Array` of starts and stops** (struct-of-
     arrays) is the SOTA shape: cache-dense, branch-predictable, and `binarySearchRange` could
     index a flat array instead of chasing object pointers. This matters at high active-frame
     counts; for ≤20 stops it's negligible (be honest: micro).
  2. **`Object.assign(result, frame.flatVars)` per active frame** (`engine.ts:589`) re-copies
     every key of every active frame into the output object each tick. When multiple frames are
     active (overlapping property segments) this is repeated key-copy churn. A precomputed
     "which output keys does this frame own" set, or writing `lerpValue` results straight into
     a stable `result` buffer keyed by a compile-time-assigned slot index, would remove the
     per-tick `Object.assign`. (The `out` buffer reuse at :550-555 already removes the *output*
     allocation; this is about the *copy*, not the alloc.)
- **SOTA reference.** Motion One / GSAP keep interpolation state in flat typed buffers keyed by
  a compiled property index; the "compile to slots" move is exactly the struct-of-arrays
  discipline. value.js's own `ValueUnit` graph (rich objects the engine mutates in place) makes
  a *full* SoA transposition expensive (you'd fight the value model), so this is a *bounded*
  opportunity, not a rewrite.
- **Disposition:** **BOOK** (with a FOLD-E sliver). The typed-time-array (1) is **BOOK** —
  only pays at high frame counts no current demo hits; record the design. The per-tick
  `Object.assign` removal (2) is a **FOLD-E** candidate IF a bench shows multi-active-frame
  animations spending time there; gate it on measurement (the `interpolation.bench.ts` 11-stop
  case is the probe). Do not manufacture the SoA rewrite — value.js's object model makes it a
  poor cost-benefit absent a measured bottleneck.
- **Isomorphism:** any layout change must be pixel- and byte-identical (same interpolated
  values, same output keys); these are pure representation changes. Lock with the existing
  interpolation benches as equivalence guards.

---

## FC-5 — `reconcileVars`: residual `findIndex` + redundant `Object.keys` re-walk (completes the indexing already started)

- **Cite:** `frame-compiler.ts:226-271`. Two residual O(N) scans remain inside an already-
  indexed function:
  1. **The frame-existence lookup** (`frame-compiler.ts:250-252`):
     `this.frames.findIndex(f => f.ixs.start === startIx && f.ixs.stop === endIx)` runs **once
     per (variable × frame)**. This is `r-wasm-compile-perf.md` **F4** — agreed disposition.
     The `(startIx,endIx)` → frame mapping is reconstructible as a `Map` keyed on a composite
     (`startIx * N + endIx`), turning the findIndex O(1). The adjacent `createFrame` segments
     are inserted with known `ixs` (:295-297), so the map can be built alongside them for free.
  2. **`reconcileVars(ix)` re-derives `startVars = this.parsedVars[ix]` then `Object.keys`-walks
     it** (:227-232) — but `buildVarIndex` (:203-216) **already walked every
     `Object.keys(parsedVars[i])`** to build the index. The per-`ix` key-walk is a second pass
     over the same data. The index could be inverted/extended to also yield "for frame ix, the
     keys present and their next-occurrence" in one structure, so `reconcileVars` reads the
     index instead of re-walking `parsedVars`.
- **SOTA gap.** Both are the same "finish the indexing discipline you started" gestalt move
  (the comment at :199-202 / :218-225 already documents the half-done indexing). Completing it
  takes the reconcile pass from worst-case ~O(V·F) (with the findIndex inside) to a clean
  single index pass.
- **Perf/elegance rationale.** Compile-time-only (runs once per `parse()`), bounded by stop
  count, so honestly **Low** priority on the cost axis — but it's a *cohesion* win: the
  function half-adopts indexing then falls back to a linear scan and a redundant walk, which
  reads as unfinished. Folding it makes the function internally consistent.
- **Disposition:** **FOLD-E** — small, local, completes an existing pattern. (1) is identical
  to F4; (2) is the extra observation this lane adds. Honestly low priority; fold
  opportunistically (e.g. when FC-2/FC-3 touch `parse()` anyway).
- **Isomorphism:** pure restructuring; identical `frames[]` output. Behaviour- and
  pixel-stable.

---

## FC-6 — `tryParseCache` + `clone()` churn: unbounded cache, and clone-on-read of cached parses

- **Cite:** `utils.ts:145` (`const tryParseCache = new Map<string, ValueArray>()` — module-
  level, never evicted, set at :209) and the **clone discipline around it** (:184-185, :209):
  a cache hit returns `cached.clone()` (:185) and a miss stores `parsed.clone()` (:209) — i.e.
  the cache holds an immutable template and every consumer gets a fresh clone (correct, because
  the engine mutates `ValueUnit`s in place during interpolation — `setTargets`,
  `setProperty`). Additionally `createInterpVarValue` (`utils.ts:225-283`) and
  `padToLength` allocate `new ValueUnit(0)` padding per length-mismatch (:259).
- **Two findings here:**
  1. **Unbounded cache (= `r-wasm-compile-perf.md` F3).** `tryParseCache` keyed on
     `${childKey}:${strValue}` (:182) grows without bound — a hazard for apps that parse
     programmatically-generated CSS (a number interpolated into a string per frame, an editor
     re-parsing on each keystroke). Agreed disposition: **FOLD-E** — bound it (LRU, generous
     cap e.g. 1k). Cross-ref F3 / handoff H1.
  2. **Clone-on-every-read is correct but the *granularity* is coarse (new observation).**
     Because the engine mutates parsed `ValueUnit`s in place, the cache *must* hand out clones —
     fine. But `parse()` re-clones the WHOLE `parsedVars` set on every `parse()` (each frame's
     `parseAndFlattenObject` re-hits the cache and clones, :283-293), and then
     `createInterpVarValue` clones again inside `normalizeValueUnits`. For the re-parse case
     (FC-2) this is clone-storms. The deeper fix is FC-2 (don't re-parse), which makes the
     clone cost a one-time compile cost rather than a per-`parse()` one.
- **SOTA gap.** Memoization-with-clone is the right model (it's what makes WASM unnecessary —
  see `r-wasm-compile-perf.md` F1); the gaps are *bounding* the cache and *not re-paying* the
  clone on idempotent re-parses (FC-2).
- **Disposition:** cache bound: **FOLD-E** (= F3). Clone-storm-on-reparse: subsumed by FC-2's
  determinism/idempotence fold — **FOLD-E** via FC-2. value.js's `memoize` LRU upgrade:
  **FOLD-VALUEJS-HANDOFF** (= H1 below).
- **Isomorphism:** cache hits stay byte-identical; only cold-entry eviction timing changes
  (re-parse vs hit), behaviour-stable. Cap generous so real working sets never evict.

---

## FC-7 — Sort stability + the `start.value` percent collision (compile correctness, mild)

- **Cite:** `frame-compiler.ts:281` sorts `templateFrames` by `a.start.value - b.start.value`
  (numeric, fine) and :304-309 sorts `frames` by `(time.start, time.stop)`. The template sort
  is **not** keyed on insertion order for ties — two keyframes at the *same* percent (legal in
  authoring, e.g. `50% { a } 50% { b }`, and producible via `addFrame(50,...)` twice) sort in
  `Array.prototype.sort` order, which is spec-guaranteed stable since ES2019 so insertion order
  is preserved — **OK on modern engines** (Node ≥22 per `CLAUDE.md`), so this is *not* a bug,
  but it's an *undocumented reliance* on sort stability for same-percent frame ordering.
- **The mild gap.** `convertFrameStart` (`frame-compiler.ts:94-109`) clamps `start.value` to
  `[0,100]` AFTER converting time units to percent against `options.duration` (:103). Because
  the percent is computed from the *current* duration, a frame added as `addFrame("500ms", …)`
  freezes its percent at add-time against the then-current duration; a later `setDuration`
  rescales `frame.time` (engine.ts:321-325) but NOT the template's `start.value` percent. So
  re-`parse()` after a duration change recomputes times from the *stale* template percent. This
  is consistent (the percent is the source of truth) but the time-unit→percent conversion at
  add-time couples the template to the duration-at-add, which is a subtle ordering dependency.
- **Disposition:** **BOOK** — record the sort-stability reliance (add a one-line comment +
  a lock-test for same-percent ordering) and the add-time-duration coupling. No behavior change
  warranted; this is a documentation/test-hardening note, honestly low value.
- **Isomorphism:** N/A (doc/test only).

---

## FC-8 — What is ALREADY SOTA in the FrameCompiler (do not manufacture work here)

- **`varIndex` reconciliation** (`frame-compiler.ts:203-216`, comment :199-202): the
  O(frames²) "next occurrence" findIndex was already replaced with a pre-built name→indices
  map. Correctly hardened in D. (Only the *frame-existence* findIndex remains — FC-5.)
- **`allInterpVars` / `flatVars` pre-flatten** (`frame-compiler.ts:319-330`): the per-frame
  `Object.values().flat()` is done **once at compile time**, so the rAF loop iterates a flat
  array with zero allocation — textbook "do the shape work at compile time." (`constants.ts:105-110`
  documents the intent.) Confirmed SOTA; matches `r-wasm-compile-perf.md` F7.
- **`prepareInterpVar` pre-resolved `_lerp`** (consumed via `createInterpVarValue` →
  `value.js/src/units/interpolate.ts:143-150`): the lerp dispatch (numeric/color/computed) is
  resolved once per segment at compile time, not per rAF call. Monomorphic-shape discipline.
- **`tryParseCache` on the per-value parse** (`utils.ts:181-211`): the expensive parse-that
  combinator run is memoized per `(childKey, value)`; steady-state is a `Map.get` + `clone`.
  (Bound it — FC-6 — but the memo itself is the right call.)
- **Live-options reference** (`frame-compiler.ts:86-92`, locked by
  `frame-compiler.test.ts:54-69`): for `duration` and `easing` this is genuinely SOTA (no
  re-link needed). Only `colorSpace`/`hueMethod` break the promise (FC-1).
- **The D.W4 split itself** (`frame-compiler.ts:6-13`): a clock-free, playback-free,
  value-in→frames-out compiler is exactly the right seam — unit-testable without a loop
  (`frame-compiler.test.ts:71-78`). The split is real, not cosmetic.
- **Disposition:** **ALREADY-SOTA** — flagged so the lane doesn't invent perf work where the
  engine is at the frontier. The *runtime* interpolation path needs nothing from this lane;
  the open items are compile-time correctness (FC-1, FC-2) and dead-work trimming (FC-3),
  not hot-path speed.

---

## value.js hand-off (FOLD-VALUEJS-HANDOFF) — propose a value.js tranche

> value.js is dirty + active; these are *proposals* for the value.js owner to formalize. Do
> not write value.js from keyframes.js. (Consistent with `r-wasm-compile-perf.md` H1.)

### H1 — Bound the parse/normalize memo caches (LRU) + LRU-on-hit
- **Where:** `value.js/src/utils.ts:108-153` `memoize` (default `maxCacheSize = Infinity`,
  :114; eviction is insertion-order FIFO via `cache.keys().next().value`, :142) and its
  unbounded consumers (`parsing/index.ts`, `parsing/units.ts:114`, `parsing/color.ts:613`,
  `parsing/stylesheet.ts:514`, `units/normalize.ts`). keyframes.js's own `tryParseCache`
  (FC-6) mirrors this hazard and will be bounded on the kf side.
- **Proposal:** (a) give parse-entry memos a generous default cap (e.g. 1024) so real working
  sets never evict; (b) upgrade eviction from insertion-order FIFO to true LRU (`delete`+`set`
  on hit). Closes the unbounded-memory hazard for generated/keystroke CSS at zero steady-state
  cost. **This is the same handoff as `r-wasm-compile-perf.md` H1 — they should be merged into
  one value.js tranche item, not duplicated.**
- **Isomorphism:** hits stay byte-identical; only cold-entry eviction timing changes.

### H2 — `normalizeValueUnits` / `prepareInterpVar` re-normalize seam for colorSpace change
- **Where:** `value.js/src/units/interpolate.ts:143-150` (`prepareInterpVar`),
  `normalizeValueUnits` (consumed at `kf utils.ts:281`).
- **Context:** FC-1's cleanest fix (re-normalize existing segments on `setColorSpace` without a
  full re-parse) wants a value.js entry that re-derives an already-normalized `InterpolatedVar`
  into a new color space from its `start`/`stop` source — i.e. a "renormalize in space X"
  helper that doesn't require re-running the whole parse→flatten path. value.js may already
  expose enough (`normalizeValueUnits` over the retained `start`/`stop`); if so this is a
  no-op handoff and FC-1(a) is purely a keyframes.js fold. **Propose:** confirm value.js's
  normalize surface supports re-normalizing a live `InterpolatedVar` cheaply; if not, expose
  one. **Low priority** — only needed if FC-1 picks option (a).
- **Isomorphism:** identical interpolated values for a given space; pure compile-time
  re-derivation.

---

## Summary table

| ID | Title | Disposition | Priority | Overlap |
|----|-------|-------------|----------|---------|
| FC-1 | colorSpace/hueMethod compile-stale; comment lies | FOLD-E | **High** (correctness) | new |
| FC-2 | `parse()` non-incremental + `frameId` non-deterministic | FOLD-E (frameId) / BOOK (incremental) | **Med-High** (determinism) | new |
| FC-3 | dead `frame.vars = unflattenObject` on CSS path | FOLD-E | Med | new |
| FC-4 | `AnimationFrame` layout: SoA / per-tick `Object.assign` | BOOK (+FOLD-E sliver, gated on bench) | Low | new |
| FC-5 | reconcileVars findIndex + redundant `Object.keys` | FOLD-E | Low | ⊇ F4 |
| FC-6 | `tryParseCache` unbounded + clone-storm on reparse | FOLD-E | Med | = F3 / via FC-2 |
| FC-7 | sort-stability reliance + add-time-duration coupling | BOOK | Low | new |
| FC-8 | varIndex / pre-flatten / prepareInterpVar / split | ALREADY-SOTA | — | ⊇ F7 |
| H1 | Bound value.js memo caches (LRU) | FOLD-VALUEJS-HANDOFF | Med | = F3/H1 (merge) |
| H2 | value.js re-normalize seam for colorSpace change | FOLD-VALUEJS-HANDOFF | Low | new (enables FC-1a) |

**Net.** The FrameCompiler's *hot path is SOTA* (FC-8) — the D.W4 hardening (varIndex,
pre-flatten, prepareInterpVar) hit the frontier. The open work is **compile-time correctness
and hygiene**, not speed: fix the colorSpace staleness (FC-1, the one real correctness bug),
make `parse()` deterministic/idempotent (FC-2 `frameId`), trim the dead `unflattenObject`
(FC-3), and finish the indexing discipline (FC-5). Layout SoA (FC-4) and incremental compile
(FC-2 incremental) are **BOOK** — record the design, build only on a measured bottleneck no
current demo exhibits. Two value.js handoffs (H1 cache bound — merge with the existing handoff;
H2 a re-normalize seam that would make FC-1's clean fix possible).
