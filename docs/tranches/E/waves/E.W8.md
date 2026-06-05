# E.W8 — The FrameCompiler transposition (NumericAnimation SoA + incremental)

*"`AnimationFrame` is a `NumericSegment` that forgot it was one."*

**Phase:** IMPL · **Class:** PATCH (perf/scheduling transposition — pixel-/behaviour-
identical; the only carried pixel change is W7's D-1 per-keyframe-easing fix, the
dependency) · **Scope:** `src/animation/` (the published library — `frame-compiler.ts`
+ `engine.ts`, file-disjoint from the demo waves W1/W2/W3/W11) + ONE demo-side
prerequisite (`useKeyframeOps.ts`, pure cleanup) · **Depends on:** E.W7 (W7's
correctness fixes + the shaped benches are the isomorphism guard W8 rides — the
D-1 per-keyframe-easing fix in particular is carried here as the one allowed
pixel delta) · **Parallel to:** E.W9 / E.W10 (independent of W7/W8) and the demo
band · **Gated on:** keyframes' own green CI (inv-27) + W7 green.

The codebase maintains **two parallel keyframe engines.** `NumericAnimation`
(light / numeric) is SOTA: a struct-of-arrays segment layout plus an incremental
`updateKeyframe` that recomputes only the 1–2 adjacent segments touched by an
edit. `FrameCompiler` (heavy / CSS) is not: an object-of-arrays-of-objects layout
compiled by a whole-program, non-incremental `parse()` whose frame ids accumulate
across re-parses. The two engines have the **same shape** — a sorted segment list
indexed by a scalar progress range, interpolated per active segment — but only one
of them is written like it knows that.

W8 transposes `NumericAnimation`'s discipline up to `FrameCompiler` in four
independently-isomorphic sub-moves: a parallel typed time index, compile-time
output slots, an incremental `updateSegments(touchedKeyframeIx)`, and a
deterministic content-derived `frameId`. The target shape is **not hypothetical** —
it is a tested, shipping unit in the same repo (`numeric.ts`). And the workload is
**not hypothetical** either: the demo's own keyframe editor double-compiles the
whole program on every debounced keystroke. Every sub-move is gated **byte-equal**
to a full `parse()`; the incremental path is additionally gated **measure-first**
(the D-3 / E.W5 `tryParseCache` posture) — it lands only on a measured
editor-workload win, else recorded-withheld with the number in-tree.

---

## § Provenance

- **`d-framecompiler.md` D-2** — the editor re-parse workload (the demo's keyframe
  editor recompiles the whole program per debounced keystroke; the headline
  interactive surface paying O(F·V) reconcile + clone-storm twice per edit).
- **`d-framecompiler.md` D-3** — the named transposition: *port `NumericAnimation`'s
  SoA + incremental-segment discipline up to `FrameCompiler`*.
- **`a-kf-framecompiler.md` FC-2** — the idempotence/determinism BOOK (the
  monotonic `frameId++` is a purity hole; two `parse()`s on identical input do not
  yield byte-identical frames).
- **`a-kf-framecompiler.md` FC-4** — the SoA layout BOOK (object-of-arrays-of-objects
  vs the numeric engine's flat typed arrays).
- **`d-runtime.md` D-RT-4** — the per-tick key-copy churn the slot map removes.

This is the single move that *unifies* FC-2 (idempotence/determinism), FC-4 (SoA
layout), and the incremental rebuild into one coherent architecture whose target
shape is already a tested, shipping unit in the same repo (`numeric.ts`). It is a
**wave, not a W7 fold**, because it is a structural transposition of the compiler's
representation + scheduling discipline (four coupled sub-moves with their own
byte-equality CI guard), not a point correctness fix or a hoist.

---

## § State (re-grounded · file:line · verified not asserted)

The live facts, read-confirmed on `tranche-d-impl`, so the wave's framing is honest
(inv ε). **Re-grounded against live source** — the synthesis cites are accurate
except where noted:

1. **`NumericAnimation` IS the target shape — SoA + incremental, shipping + tested.**
   - The segment is a struct-of-arrays: `interface NumericSegment` carries
     `startPos`/`stopPos` (scalar progress range) + `keys[]`/`startVals[]`/`stopVals[]`
     + `timingFunction` (`numeric.ts:8-15`).
   - `at(progress)` indexes the segment list by `binarySearchRange(... (s) =>
     s.startPos, (s) => s.stopPos)` (`numeric.ts:159-160`) and writes interpolated
     results into a **stable `this.result` buffer by key slot** (`numeric.ts:176`,
     `this.result[seg.keys[i]] = lerp(...)`) — zero per-tick allocation.
   - `updateKeyframe(index, values)` (`numeric.ts:187-205`) mutates the touched
     keyframe in place, then **rebuilds only the 1–2 adjacent segments** via
     `buildSegment(index-1)` / `buildSegment(index)` (`:198,:201`) — everything
     else retained. `buildSegment(index)` (`numeric.ts:130-137`) recomputes one
     segment from `this.positions[index]`/`[index+1]`.

2. **`FrameCompiler` is the laggard — object frames, whole-program `parse()`,
   monotonic `frameId`.**
   - `frameId` is a monotonic counter (`frame-compiler.ts:84` `frameId: number = 0`),
     incremented on every `addFrame` (`:147` `this.frameId += 1`) **and on every
     `createFrame`** (`:182` `const id = this.frameId++`). It is exposed read-only via
     `Animation.frameId` → `this.compiler.frameId` (`engine.ts:228-229`). **The purity
     hole (FC-2):** because the counter accumulates and `createFrame` bumps it, two
     `parse()`s on identical input produce `frames[]` with **different ids** — `parse()`
     is not deterministic.
   - `parse(targets)` (`frame-compiler.ts:278-331`) is whole-program: it re-`map`s
     `parseAndFlattenObject` over **every** template frame (`:283-293`), rebuilds the
     whole `frames[]` (`:295-297`), reconciles every var (`:300-301`), re-sorts,
     re-filters, and re-derives `flatVars`/`vars`/`allInterpVars` per frame
     (`:319-330`). There is **no incremental path** — an edit to one keyframe pays the
     full program cost.
   - `createInterpVarValue` bakes the color space at compile time: the per-segment
     interp var is built with `this.options.colorSpace`/`this.options.hueMethod`
     (`frame-compiler.ts:258-265`) — the same compile-time bake W7's FC-1 makes the
     setters honor.

3. **`createFrame` index-space conflation (D-1 — the carried W7 dependency).**
   `createFrame(startIx, endIx)` (`frame-compiler.ts:150`) passes a **template-frame**
   index `startIx` into `seekPreviousValue(startIx, this.frames, …)` (`:164` for
   `transform`, `:174` for `timingFunction`) — but `this.frames` is the **compiled**
   array. The indices coincide on the adjacent-pair loop (`:295-297`, `createFrame(i,
   i+1)`), masking the bug; they diverge the moment `reconcileVars` calls
   `createFrame(startIx, endIx)` with a **non-adjacent** template pair (`:256`). W8
   carries the D-1 fix (seek over `this.templateFrames`, where `startIx` is
   meaningful) as its dependency — it is the only pixel delta in the whole wave.

4. **The standalone hot path chases `f.time.start`/`.stop` closures, key-copies per
   frame.** `interpFrames` (`engine.ts:561-566`) indexes via `binarySearchRange(frames,
   t, (f) => f.time.start, (f) => f.time.stop)` — a closure deref per probe, not a flat
   typed-array read (contrast `numeric.ts:159-160`). It mints a `processFrame` closure
   per call (`engine.ts:573`) and `Object.assign(result, frame.flatVars)` per active
   frame (`:589`) — the per-tick key-copy churn D-RT-4 names, the SoA slot map removes.

5. **The editor double-compiles per keystroke — D-2's real workload, re-grounded.**
   The demo's keyframe-string edit op
   (`demo/@/components/custom/animation-controls/keyframes/composables/useKeyframeOps.ts`)
   debounces a handler (`useKeyframeOps.ts:47-80`) that:
   - constructs a **throwaway** `new CSSKeyframesAnimation(options, ...targets)
     .fromKeyframes(keyframes)` (`:61-64`) — and `fromKeyframes` **calls `parse()`
     internally** (`engine.ts:984`), so the throwaway is fully compiled (compile #1);
   - assigns its `options`/`templateFrames` onto the live animation (`:66-67`) and
     then calls `animation.parse()` (`:69`) — **compile #2** on the live one.

   So every debounced keystroke pays **two full whole-program compiles** of the entire
   keyframe set. The add/remove ops are the same shape — `addKeyframesStringToAnimation`
   compiles a `tmpAnimation` (`:151`) then the live one (`:159`); `removeKeyframeData`
   likewise (`:192` then `:196`). The editor is a frame-by-frame builder, the headline
   interactive surface of the project, and it pays the full reconcile + clone cost
   **twice per edit** on every keystroke.

6. **The byte-equality instrument already exists in spirit.** `test/zero-alloc.test.ts`
   carries the buffer-identity instrument the group composite uses; `bench/interpolation.bench.ts`
   exercises `interpFrames` but calls it as `interpFrames(t, false)` (`:24,:30,:36`) —
   **without threading an `out` buffer**, so it cannot see the realistic playback shape
   (the same blind-spot W7's measure-first clause widens). The byte-equality + editor
   workload guards W8 needs are net-new but slot into the existing test + bench files.

**Correction folded (not regressed).** The synthesis frames D-2 as "O(F²·V) reconcile";
`reconcileVars` is now O(F·V) per frame via the pre-built `buildVarIndex` Map
(`frame-compiler.ts:203-216`, used at `:300`) — the residual O(F) `findIndex` at
`:250-252` is the FC-5/F4 cleanup W7 folds opportunistically, not a W8 concern. W8's
incremental win is the **whole-program → touched-segment** reduction, independent of
the per-frame reconcile complexity.

---

## § Goal

**What lands:**

- **A parallel typed time index** on `FrameCompiler` — `Float64Array
  startTimes`/`stopTimes` compiled alongside `frames[]`, so `binarySearchRange`
  reads flat arrays instead of chasing `f.time.start`/`.stop` closures
  (`engine.ts:561-566`). A direct port of `NumericSegment.startPos`/`stopPos`.
- **Compile-time output slots** — each output key gets a stable slot; `lerpValue`
  results write into a stable `result` buffer by slot (as `numeric.ts:176` does),
  removing the per-tick `Object.assign(result, frame.flatVars)` key-copy churn
  (`engine.ts:589` / D-RT-4). The `ValueUnit` aliasing contract is preserved — the
  SoA discipline applies to the **time index + slot map**, NOT to flattening the
  rich leaves.
- **An incremental `updateSegments(touchedKeyframeIx)`** — a port of
  `numeric.ts:186-205`: an edit re-runs `parseAndFlattenObject` for the touched
  template frame only, re-`createInterpVarValue`s the incident segments (`(prev→k)`,
  `(k→next)`, + the reconciled non-adjacent segments from `varIndex`), and retains
  everything else. The FOLD-E answer to D-2 + FC-2's incremental BOOK in one move.
  **Ships only on a measured editor-workload win**, else recorded-withheld.
- **A deterministic content-derived `frameId`** — the monotonic counter
  (`frame-compiler.ts:147,182`) replaced by a content-derived id keyed on the stable
  `(startIx,stopIx)` pair already in `ixs` (`:154-157`). Two `parse()`s on identical
  input then yield **byte-identical** `frames[]`, ids included.
- **The demo-side prerequisite** — D-2(a): the editor compiles **once**, not via a
  throwaway `CSSKeyframesAnimation` (which parses) *and* again on the live one
  (`useKeyframeOps.ts:61-69`). Behaviour-identical, halves the per-keystroke cost
  **before** the engine change (pure cleanup; lands first).

**Why:** the codebase ships the SOTA target (`NumericAnimation`) and the laggard
(`FrameCompiler`) side by side, and the demo's headline surface makes the gap a real
workload, not a benchmark fiction. The transposition is the no-legacy / gestalt move:
two engines of the same shape should share the same discipline; the heavy one should
not pay whole-program cost for a one-keyframe edit when the light one already proves
the incremental answer. KISS bounds the scope — the SoA discipline touches the **time
index + slot map**, never value.js's mutable `ValueUnit` leaves (do not fight the
object model). Determinism is FC-2's correctness debt; incrementality is D-2's
performance debt — one move closes both, byte-equality-gated so it can never regress.

---

## § Scope

W8 lands one **demo-side prerequisite** (pure cleanup, first) + **four engine
sub-moves**, each independently isomorphic + bench-guardable.

### S0 — Demo-side prerequisite: stop the editor's double-compile — D-2(a)

**WHAT:** in `useKeyframeOps.ts`, compile **once**. The keyframe-string edit op
(`:47-80`) currently builds a throwaway `CSSKeyframesAnimation(...).fromKeyframes(...)`
— which itself calls `parse()` (`engine.ts:984`) — then assigns its
`options`/`templateFrames` to the live animation and calls `animation.parse()` again
(`:66-69`). Collapse to a single compile: set the live animation's
`options`/`templateFrames` from the parsed input directly, then call
`animation.parse()` **once** (skip the throwaway compile). Apply the same single-compile
shape to `addKeyframesStringToAnimation` (`:151` + `:159`) and `removeKeyframeData`
(`:192` + `:196`).

**WHY:** behaviour-identical, halves the per-keystroke cost **before** the engine
change — the honest ordering (clean up the caller's redundant work first, then make
the remaining compile incremental). Pure cleanup; lands first; demo-only (file-disjoint
from the engine sub-moves). Seam: `useKeyframeOps.ts:61-69,151,159,192,196`.

### S1 — Parallel typed time index — FC-4 / port of `NumericSegment.startPos/stopPos`

**WHAT:** compile `Float64Array startTimes` / `Float64Array stopTimes` alongside
`frames[]` in `parse()` (`frame-compiler.ts:278-331`, after the final sort+filter).
Re-point the standalone `binarySearchRange` (`engine.ts:561-566`) to index the flat
arrays via scalar accessors instead of the `(f) => f.time.start` / `(f) => f.time.stop`
closures. The frame objects keep `time.start`/`.stop` (no consumer break); the typed
arrays are the **index**, the objects are the **payload** — exactly the
`NumericSegment` split.

**WHY:** a flat `Float64Array` read is a monomorphic, cache-friendly index probe; the
closure deref chases an object property per probe. The numeric engine already proves
the shape (`numeric.ts:159-160`). Pure representation change — identical search result,
identical interpolation. Seam: `frame-compiler.ts` (compile the arrays),
`engine.ts:561-566` (re-point the search).

### S2 — Compile-time output slots, not per-tick key-copy — D-RT-4 / port of `numeric.ts:176`

**WHAT:** assign each output key a stable slot at compile time (a `keys[]` + a
slot-indexed `result` buffer on the compiler/animation, as `numeric.ts:176` writes by
`seg.keys[i]`). In `interpFrames`, write `lerpValue` results into the stable buffer by
slot, removing the per-active-frame `Object.assign(result, frame.flatVars)`
(`engine.ts:589`). **The `ValueUnit` aliasing contract is preserved** — the slot map
indexes the **output keys**, NOT the rich leaves; `lerpValue` still mutates the live
`ValueUnit`s `frame.allInterpVars` holds (the honest, bounded scope — do not flatten or
copy value.js's mutable object model).

**WHY:** the per-tick `Object.assign` re-copies a stable dict whose values are the
units `lerpValue` just mutated (D-RT-2/D-RT-4) — wasted work the numeric engine's
slot-write avoids. Behaviour-identical output; less per-frame churn. Bounded: this is
the SoA discipline for the **slot map**, not a rewrite of the leaf representation.
Seam: `engine.ts:573-590` (the `processFrame` body + the slot write).

### S3 — Incremental `updateSegments(touchedKeyframeIx)` — D-2 + FC-2 incremental · MEASURE-FIRST

**WHAT:** a port of `numeric.ts:186-205` to `FrameCompiler`. An edit to template
keyframe `k`:
- re-runs `parseAndFlattenObject` for **that template frame only** (the slice of
  `frame-compiler.ts:283-293` for index `k`), re-binding targets;
- re-`createInterpVarValue`s the **incident segments** — `(prev→k)`, `(k→next)`, plus
  the reconciled non-adjacent segments `varIndex` (`:203-216`) maps as incident on `k`
  — via the same `createInterpVarValue(..., colorSpace, hueMethod)` call `parse()` uses
  (`:258-265`);
- retains every other compiled frame untouched (no whole-program rebuild/sort/filter
  unless `k`'s start time moved its sort position).

**MEASURE-FIRST (the gate is a delta, not just an assertion).** S3 ships **only** on a
measured editor-workload win (the shaped bench below shows the incremental path drops
per-edit cost to the touched segments). If the measured win is within noise (e.g. the
realistic stop-count is small enough that whole-program `parse()` is already cheap
after S0–S2), S3 is **recorded-withheld with the measurement** in-tree (the D-3 /
E.W5 `tryParseCache` posture) — the byte-equality lock still lands as the spec for the
future fold, the code does not.

**WHY:** this is the FOLD-E answer to the headline workload — the editor's
double-(now-single-after-S0)-compile becomes a touched-segment recompute. The numeric
engine proves the incremental discipline is correct and cheap; the byte-equality CI
guard (below) makes it **safe** (it can never silently diverge from a full compile).
Measure-first because "incremental" is a complexity cost that must earn its keep on a
real workload. Seam: `frame-compiler.ts` (the new `updateSegments` + the
`Animation`-level delegate), exercised by `useKeyframeOps.ts` post-S0.

### S4 — Deterministic content-derived `frameId` — FC-2 purity hole

**WHAT:** replace the monotonic counter (`frame-compiler.ts:84,147,182`) with a
content-derived id keyed on the stable `(startIx,stopIx)` pair already in `ixs`
(`:154-157`). `createFrame` derives the id from its inputs, not a mutable counter;
`addFrame`'s `frameId += 1` (`:147`) is removed or made derivation-only. Two `parse()`s
on identical input then produce **byte-identical** `frames[]` (ids included).

**WHY:** the monotonic counter is FC-2's purity hole — it makes `parse()` non-idempotent
(re-parsing the same input yields different ids), which defeats any byte-equality lock
(S3's CI guard requires determinism to compare). Content-derived ids are the standard
fix for a compile-determinism debt. No consumer keys on `frame.id` —
`getAnimationId` reads the **animation** id (`engine.ts:73-76`, `animation.name ??
String(animation.id)`), never the frame id — so the value change is invisible.
Seam: `frame-compiler.ts:84,147,182` (the counter → derived id).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave extends **inv ν** (the synthesis names `proof:compile-deterministic` +
`proof:compile-incremental` as W8's byte-equality gates). Every clause is a real
test / bench, not an assertion — it reds today (or on regression) and greens on fix:

### 1. `proof:compile-deterministic` — `parse()` is idempotent (byte-identical frames)

Two `parse()`s on **identical** input produce **byte-identical** `frames[]` — ids
included. **BITE:** reds **today** — the monotonic `frameId` accumulates across
re-parses (`frame-compiler.ts:182`, `this.frameId++`), so frame ids differ between the
first and second compile (verified live). Greens on the content-derived id (S4).
**Bite-proven** by re-introducing `this.frameId++` → the byte-equality assert reds.

### 2. `proof:compile-incremental` — `updateSegments(k)` ≡ full `parse()` (the CI guard for S3)

`updateSegments(k)` produces `frames[]` **byte-equal** to a full whole-program
`parse()` for the same edit, asserted in CI. **The incremental path may NOT ship
without this equivalence assertion green** — S3 is gated on it. **BITE:** mutate the
incremental recompute to skip one incident segment (e.g. drop the `(k→next)` rebuild)
→ the byte-equality assert reds against the full-parse oracle. (This clause lands as
the spec even if S3 is recorded-withheld measure-first — it is the contract the future
fold must satisfy.)

### 3. `proof:compile-incremental` (measure clause) — the editor workload win is MEASURED

A **shaped** bench — the editor's edit-per-keystroke profile: re-compile an F-stop
animation N times, simulating the debounced-keystroke workload S0 already halved.
**S3 ships only if** the bench shows the incremental path drops per-edit cost to the
touched segments (a forced-reflow / clone-count / wall-time delta recorded in-tree).
Sub-moves S1/S2/S4 land on the byte-equality + interpolation guards **regardless** (they
are pure representation/determinism changes with no measure precondition); **S3 lands
only on the measured win, else recorded-withheld** with the number. **BITE:** an S3 fold
that does not move the shaped bench is recorded-withheld (P-invariant-28: no
un-dispositioned perf item) — a claim of an incremental win with no bench delta reds.
The shaped bench is net-new: `bench/interpolation.bench.ts` today omits the threaded
`out` buffer and the editor profile (`:24,:30,:36`); W8 adds the editor-workload
variant (shared with W7's measure-first widening).

### 4. The interpolation output is unchanged (S1/S2 isomorphism) — `proof:zero-alloc` + benches

The existing interpolation benches + `test/zero-alloc.test.ts` stay green: the typed
time index (S1) returns the identical search result; the slot map (S2) writes the
identical interpolated values with no extra allocation (the slot buffer is reused, the
`ValueUnit` aliasing contract is preserved). **BITE:** an S1 index off-by-one or an S2
slot-map collision → the interpolation bench's equivalence assert reds; an S2 buffer
re-allocation per frame → the zero-alloc buffer-identity assert reds.

### 5. No regression — the engine stays exemplary

`npm test` stays green (the no-regression baseline is the live count at W8-open);
`proof:boundary` (the light/heavy edge — W8 touches only the heavy `engine.ts`/
`frame-compiler.ts`, no new static value.js edge, inv α) and W7's
`proof:engine-correctness` (which W8 depends on) are UNTOUCHED. **BITE:** any test
regression, or a new static value.js import on a light barrel export, reds.

---

## § Folds

Retires (by finding id):
- **`d-framecompiler.md` D-3** (the named SoA + incremental transposition) — S1 + S2 + S3.
- **`d-framecompiler.md` D-2** (the editor re-parse workload) — S0 (the demo-side
  double-compile cleanup) + S3 (the incremental compile, on measure) + clause 3 (the
  shaped editor-workload bench).
- **`a-kf-framecompiler.md` FC-2** (idempotence/determinism) — S4 + `proof:compile-deterministic`.
- **`a-kf-framecompiler.md` FC-4** (SoA layout) — S1 (time index) + S2 (slot map).
- **`d-runtime.md` D-RT-4** (per-tick key-copy churn) — S2.

**Carried as the W7 dependency (the one allowed pixel delta):**
- **D-1** (`createFrame` index-space conflation — `frame-compiler.ts:164,174` seek over
  `this.frames` with a template `startIx`) — fixed in W7 (seek over
  `this.templateFrames`); W8 rides it as the only pixel change in the wave (the
  non-adjacent reconciled-segment per-keyframe-easing inheritance). W8 does **not**
  re-fix it.

**Routed OUTWARD / RECORDED (not this wave):**
- **FC-5 / F4** (the residual `findIndex` at `frame-compiler.ts:250-252` + the redundant
  `Object.keys` re-walk) — W7's opportunistic compile-time cleanup, not W8 (W8's
  incremental win is independent of the per-frame reconcile complexity). RECORDED.
- **FC-3** (`frame.vars = unflattenObject` built per frame, `frame-compiler.ts:327`) —
  W7's dead-line gate. RECORDED.
- **`NumericAnimation` itself** — ALREADY-SOTA (the source of the transposition, not a
  target). The `r-interpolation.md` A-3 re-affirm holds; do NOT re-open the numeric
  core. RECORDED.

---

## § Isomorphism

Every sub-move is a **pure representation / scheduling change with identical
interpolated output**:

- **S0** is behaviour-identical (a redundant compile removed; the surviving single
  compile is bit-for-bit the work the old path's second compile did).
- **S1** returns the identical `binarySearchRange` result (the typed arrays carry the
  same `start`/`stop` values the closures dereferenced).
- **S2** writes the identical interpolated values (the slot map is a stable-key
  reorganization of the same `frame.flatVars` keys; the `ValueUnit` aliasing contract
  — `lerpValue` mutating the live units — is **preserved**, untouched).
- **S3** produces `frames[]` **byte-equal** to a full `parse()` (the CI guard, clause 2
  — it cannot ship otherwise).
- **S4** changes `frame.id` *values* but **no consumer keys on them** —
  `getAnimationId` reads the *animation* id (`engine.ts:73-76`), never the frame id.

Guarded by the interpolation benches + the byte-equality locks. **The only pixel
change in the whole wave is W7's D-1 per-keyframe-easing fix**, carried here as the
dependency (the non-adjacent reconciled-segment easing inheritance) — a deliberate,
test-locked break W7 owns, not a W8 regression. Everything W8 itself does is
pixel-/behaviour-identical.

---

## § Design decisions

1. **The transposition is real because the target is shipping + tested — not a
   redesign.** RESOLVED: `NumericAnimation` is the SOTA shape *in the same repo*
   (`numeric.ts:8-15,159-160,176,187-205`), with its own test coverage. W8 ports its
   discipline to `FrameCompiler`; it does not invent an architecture. The two engines
   are the same shape (sorted segments indexed by a scalar range) — W8 makes the heavy
   one written like it knows that. No-legacy + gestalt: two engines of one shape should
   share one discipline.

2. **SoA bounds itself to the time index + slot map — NOT the rich leaves.** RESOLVED
   (the KISS line): the win is a flat typed time index (S1) + a stable output-slot map
   (S2); it does **not** flatten value.js's mutable `ValueUnit` object model. The
   `ValueUnit` aliasing contract — `lerpValue` mutating the live units `frame.allInterpVars`
   holds — is the engine's interpolation substrate and is preserved untouched. Fighting
   the object model would be a value.js-shaped rewrite (out of scope, inv-16) and would
   break the aliasing contract the hot path depends on. The honest, bounded scope:
   transpose the *scheduling discipline*, not the *leaf representation*.

3. **Incrementality is MEASURE-FIRST; determinism is unconditional.** RESOLVED: S4
   (deterministic `frameId`) is a **correctness** fix — `parse()` should be idempotent
   regardless of any perf story (FC-2), and S3's byte-equality lock *requires* it — so
   it lands unconditionally. S3 (incremental `updateSegments`) is a **performance**
   transposition whose complexity must earn its keep on the real editor workload — so it
   ships only on the shaped bench's measured win, else recorded-withheld with the number
   (the D-3 / E.W5 `tryParseCache` discipline). The byte-equality contract (clause 2)
   lands as the spec either way, so a future fold of S3 is already gated.

4. **The byte-equality oracle makes the incremental path safe — it cannot silently
   diverge.** RESOLVED: the deepest risk of an incremental compiler is a subtle
   divergence from the whole-program result (a missed incident segment, a stale
   reconciled var). `proof:compile-incremental` clause 2 pins `updateSegments(k)`
   byte-equal to a full `parse()` in CI — the incremental path is **forbidden to ship
   without** the equivalence assertion green. Determinism (S4) is the precondition that
   makes the byte comparison possible. Together they make the transposition provably
   isomorphic, not hopefully so.

5. **S0 lands first — clean up the caller before optimizing the callee.** RESOLVED:
   the editor's double-compile (`useKeyframeOps.ts:61-69` — a throwaway
   `fromKeyframes` that parses + a live `parse()`) is the caller paying redundant work.
   Halving it (S0) is behaviour-identical, demo-only, file-disjoint from the engine
   sub-moves, and it makes the *remaining* compile the honest baseline the incremental
   bench (clause 3) measures against. The ordering is the discipline: remove the
   caller's redundant compile, then make the surviving one incremental — never optimize
   a callee a caller calls twice for no reason.

6. **W8 depends on W7, carries D-1, re-fixes nothing.** RESOLVED: W7's correctness
   fixes + shaped benches are W8's isomorphism guard. The D-1 `createFrame`
   index-space fix (seek over `this.templateFrames`) is W7's; it is the **one** pixel
   delta W8 carries (the non-adjacent reconciled-segment per-keyframe-easing
   inheritance W8's incremental path exercises). W8 does not re-fix D-1, does not fold
   FC-5/FC-3 (W7's), and does not touch the numeric core (ALREADY-SOTA). The
   dependency is the sequencing the synthesis DAG names — W8 follows W7 in the engine
   band, parallel to W9/W10 and the demo waves.
