# E.W7 — Engine compile + runtime correctness and hot-path (measure-first)

**Phase:** IMPL · **Class:** PATCH (the published library — correctness fixes +
zero-alloc internals; no new public API, the public barrel byte-stable) · **Scope:**
`src/animation/` (the engine) — file-disjoint from the demo waves (W1/W2/W3/W11),
exactly as E.W5 is · **Parallel to:** the demo band (W1/W2/W3/W11); **W8 depends
on this wave** (W7's correctness fixes + benches are the isomorphism guard W8
rides) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** The standalone loop made zero-alloc, the compile-time correctness gaps
closed.

The E.W5 charter found "zero engine GAP" against the *Baseline checklist*, and
that verdict was correct — the engine IS the reference implementation of
`scheduler.yield`/WAAPI-delegation/`linear()`-spring/PRM. The deep SOTA audit
asked a *sharper* question — measured against Motion/GSAP/anime.js v4,
lightningcss/csstree, the V8 cost model, and the W3C platform frontier — and found
a NET-NEW body of file:line-grounded work the checklist did not surface: real
engine correctness gaps the EXEMPLARY verdict masked (the colorSpace setter no-op,
the `createFrame` index conflation, the WAAPI guard that rejects nothing it
documents, the WAAPI animations never committed-then-cancelled on finish, the
engine unable to read back its own emitted `linear()`), and a measured hot-path
tier the "barely edits" posture skipped (the group composite is zero-alloc; the
**standalone** loop is not). W7 folds them — correctness FIRST (pixel-locked by
tests), then hot-path (each behind a shaped bench).

**This does NOT re-open E's honest provenance.** D terminated every
keyframes-owned deferral (zero KFE); these are findings of the post-D **deep**
assay — surfaced by comparing against the libraries and the spec frontier, not
the Baseline-capability checklist. Every item below is `file:line`-grounded +
**verified not asserted** (inv ε) against `tranche-d-impl`. The mandate spine
holds: no-legacy/no-workaround; idiomatic+gestalt; transpositions for perf;
**isomorphic** (deliberate, named, test-locked where currently-wrong); **KISS**
(fold only warranted SOTA work; every perf fold MEASURE-FIRST; recorded-withheld
otherwise — the D-3 / E.W5 `tryParseCache` posture); **inv-16**.

**Provenance.** `audit/sota/a-kf-framecompiler.md` (FC-1, FC-3, FC-5),
`d-framecompiler.md` (D-1), `a-kf-runtime.md` (E-RT-1/2/3/5), `d-runtime.md`
(D-RT-1/2/7/8/9), `a-kf-waapi.md` (F1), `a-kf-computed.md` (F3),
`r-wasm-compile-perf.md` (F2a/F3/F4), `r-waapi.md` (W1 — the WAAPI finish-commit
seam, NEW), `r-css-values.md` (§1) + `r-css-parsers.md` (§5.1) — the `linear()`
consumption gap.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-d-impl`, so the wave's
framing is honest:

1. **`setColorSpace`/`setHueMethod` are compile-stale no-ops.** Verified:
   `engine.ts:428-442,444-457` write `this.options.colorSpace`/`.hueMethod` and
   `return this` with **no `parse()`** — contrast `setDuration` (`:298+`), which
   rescales `frame.time` in place. The color space is baked at compile time into
   the normalized segment (`frame-compiler.ts:262-264` → `prepareInterpVar`), so
   `anim.fromString(css); anim.setColorSpace("lab")` silently keeps interpolating
   in `oklab`. The doc-comment at `frame-compiler.ts:86-92` names colorSpace as an
   example of what's "seen" — **it lies.** (FC-1.)

2. **`createFrame` conflates two index spaces.** `frame-compiler.ts:150-182`
   passes a **templateFrames** index `startIx` into `seekPreviousValue(startIx,
   this.frames, …)` (`:164,174`) which walks the **compiled** frame array. Masked
   in the adjacent loop (the indices coincide) but wrong when `reconcileVars`
   (`:226-256`) calls `createFrame` with non-adjacent template indices. Latent
   today (the default renderer is on every frame); bites the moment a sparse
   per-keyframe `animation-timing-function` must be inherited across a non-adjacent
   reconciled segment. (D-1.)

3. **The WAAPI computed-unit guard rejects nothing it documents.** `waapi.ts` +
   `CLAUDE.md` claim "no computed units (`vh`/`calc`/`var`/`cqw`)"; `isComputedUnit`
   tests `COMPUTED_UNITS = ["var","calc"]` only — `vh`/`cqw`/`%` slip through and
   are delegated with px endpoints frozen at play-time, diverging from the rAF path
   on resize. (WAAPI F1 / `a-kf-computed` F3.)

4. **Delegated WAAPI animations are never `commitStyles()`'d or cancelled on
   finish.** Verified: `toWAAPIOptions` emits `fill: forwards` (`waapi.ts:178,208`
   via `FILL_MAP:166`); `playWAAPI`'s `finally` (`:261-263`) stops the shadow tick
   and clears `_waAnimations = []` but **never calls `commitStyles()` and never
   cancels the still-live WAAPI animations on the happy path**. Per MDN
   (`commitStyles`, Baseline 2020): an indefinitely-filling animation "takes
   precedence over all static styles… can prevent the target from ever being styled
   normally." So a completed delegated play leaves N residual filling
   `globalThis.Animation`s that **fight the inline `paintRest()` write** (the
   compositor fill wins by cascade order) and retain compositor memory — diverging
   observably from the rAF path (which ends in `settle()` with the rest frame as
   inline style and **zero** residual animations). For finite `forwards`
   animations the residue is pure waste that *accumulates* per completed play; for
   `iterationCount: Infinity`, `wa.finished` never resolves (correctly long-lived,
   no change). NEW (`r-waapi.md` W1; not in `a-kf-waapi.md`, which audits
   eligibility/emit/lifecycle-start but not the *finish-commit* seam).

5. **`getTimingFunction` cannot read back the engine's own emitted `linear()`.**
   Verified: `getTimingFunction` (`utils.ts:103-143`) handles a callable, a
   `cubic-bezier(...)` literal (`:114`), a `steps(...)` literal (`:126`),
   `step-start`/`step-end`, then a named registry lookup — **there is no `linear(`
   branch.** A `linear(0, 0.5 25%, 1)` string falls through every match, fails the
   registry lookup, returns `undefined`, and the option setter **silently defaults
   to `easeInOutCubic`.** But the engine *emits* `linear()` from
   `springLinearStops.ts` / `springTimingFunction.ts` (packed as `Easing.css`),
   *stores* per-keyframe `animation-timing-function` strings verbatim, *writes*
   them back out in `format.ts`, and the WAAPI path emits the same `linear()` twin
   (`waapi.ts`) — so a `linear()` the engine produces, or one authored in a
   `@keyframes` block, **round-trips out but not back in**, and the rAF JS curve
   and the compositor curve currently *disagree* on a re-imported `linear()`. NEW
   (`r-css-values.md` §1, `r-css-parsers.md` §5.1).

6. **The standalone loop is not zero-alloc — but the group composite is.**
   `interpFrames` (`engine.ts:550`) defaults `out = {}` and mints a `processFrame`
   closure (`:573`) every frame on the standalone play path (`:699`), `at()`
   (`:526`), and the demo scrub. The group buffer-passes (`_grouped`, proven by
   `test/zero-alloc.test.ts`); the primitive does not. The reused buffer is held
   in **dictionary mode** — `for (const k in result) delete result[k]`
   (`engine.ts:555`, and `group.ts`) forces V8 out of fast-properties mode
   permanently, *defeating the zero-alloc reuse it serves*. (E-RT-1/D-RT-7,
   D-RT-1.)

The wave's job: close the correctness gaps with pixel-locked tests; make the
standalone loop zero-alloc behind shaped benches; land each B-strand fold only on
a measured win, else recorded-withheld. Each closed by a re-runnable instrument
that BITES.

---

## § Goal

**What lands:**
- **Strand A — correctness (pixel-affecting where currently-wrong; test-locked).**
  The colorSpace/hueMethod setters honor the live-options contract their comment
  makes; `createFrame` seeks over the index space that is meaningful; the WAAPI
  guard rejects what its docstrings claim (or the docstrings are corrected to the
  code); finished delegated WAAPI plays `commitStyles()`+`cancel()` (zero residual
  filling animations); `getTimingFunction` reads back a `linear()` to its true
  curve, not `easeInOutCubic`.
- **Strand B — hot-path (pixel-/behaviour-identical; each behind a shaped bench).**
  The standalone `interpFrames` reuses one per-instance buffer + lifts
  `processFrame` to a method; the buffer resets by stable-key (no `delete`-loop
  deopt); the per-frame DOM write is diff-and-skipped when byte-identical; the
  steady-state `advanceTo`/`_frame` async path gets a synchronous fast path; the
  dead `frame.vars` build is gated; `reconcileVars`'s residual `findIndex` +
  `tryParseCache` unbounded growth disposed.
- **The two falsifiable instruments** — `proof:engine-correctness` (Strand A
  lock-tests, each reds today / greens on fix / reds again on revert) and
  `proof:standalone-zero-alloc` (extends `test/zero-alloc.test.ts` to the
  primitive) — wired into CI as the standing proof of inv ν.

**Why:** the EXEMPLARY verdict was true against the Baseline checklist and false
against the cost model + correctness re-read. A setter whose comment promises a
live re-derive but silently no-ops is a *bug*, not polish; a WAAPI path that leaves
the target permanently overridden by a finished animation is a cascade leak; an
engine that cannot read back its own emitted easing is a severed round-trip. The
hot-path tier is the honest completion of D.W4's zero-alloc discipline — it landed
on the group composite; W7 carries it to the primitive, **measure-first**, the way
D-3 and E.W5's `tryParseCache` were withheld until measured.

---

## § Scope

### S1 — `setColorSpace`/`setHueMethod` honor the compiled state (FC-1) — Strand A

**WHAT:** the setters re-derive the compile-baked color machinery on set — the
transposition, with NO documented-limitation escape hatch (a `setColorSpace` that
does not change the color space is the same defect class as the secretly-toggling
`pause` D-5 retired; the mandate forbids pinning the bug as a "contract", and the
hard gate below only passes the real fix). Re-run the normalize step over the
existing `interpVars` on set — re-`createInterpVarValue` from `parsedVars`, **no
re-flatten/re-sort** (the shape work is already done; only the per-`InterpolatedVar`
color resolution depends on `colorSpace`/`hueMethod`). The doc-comment at
`frame-compiler.ts:86-92` and the two `CLAUDE.md` references are corrected to
match the now-true live-re-derive contract.

**WHY:** `anim.fromString(css).setColorSpace("lab")` must change the interpolated
channel values — the API promises a live re-derive (`setDuration` honors it; the
comment names colorSpace as an example) and silently does not. The fix restores
the promise the surface already makes; KISS forbids inventing a re-compile where a
targeted re-normalize suffices.

### S2 — `createFrame` seeks the meaningful index space (D-1) — Strand A

**WHAT:** `seekPreviousValue` (`frame-compiler.ts:164,174`) walks
`this.templateFrames` (where `startIx` is meaningful), not `this.frames` (the
compiled array). Lock-test: a 3-stop animation with a per-keyframe
`animation-timing-function` on the middle stop, with a var reconciling 1→3
(non-adjacent), lands the correct inherited curve.

**WHY:** indexing one array by another's offsets is correct only by coincidence
(the adjacent loop's indices align); the moment a sparse per-keyframe easing must
be inherited across a non-adjacent reconciled segment, the wrong curve is read.
The fix is a one-line index-space correction; the lock-test makes the latent bug
falsifiable.

### S3 — The WAAPI computed-unit guard rejects what it documents (WAAPI F1) — Strand A

**WHAT:** widen the `isComputedUnit` reject predicate from `["var","calc"]` to the
viewport/container relative set (`vh`/`vw`/`vmin`/`vmax`/`%`/`cqw`/`cqh`/`cqi`/
`cqb`/`cqmin`/`cqmax` + the `sv*`/`lv*`/`dv*` family) — the isomorphism-restoring
choice — **and** correct the three docstrings (`waapi.ts:27`, `CLAUDE.md` ×2).
Sharpen the docstring with `r-waapi.md` W4's rationale: a *corrected* predicate
still keeps `var()` out not just because it "needs DOM resolution" but because
**registered `@property` customs do not composite anyway** (they rasterize per
frame) — so the contract reads as *deliberate*, not incidental, even as `@property`
becomes Baseline.

**WHY:** a delegated `cqw` animation freezes its px endpoints at play-time and
diverges from the rAF path on resize — a silent isomorphism break the guard's own
docstring claims it prevents. Restoring the predicate to its documented contract is
pure correctness; folding W4's negative-result reasoning into the docstring keeps a
future `@property`-Baseline reader from re-litigating a settled, correct rejection.

### S4 — WAAPI commit-on-finish (WAAPI W1) — Strand A, isomorphism-RESTORING

**WHAT:** in `playWAAPI`'s non-error, non-cancel completion branch
(`waapi.ts:261-263`), for each finished `wa`: `wa.commitStyles(); wa.cancel();`
(feature-detect `commitStyles` — Baseline 2020, SSR/jsdom-guarded like the
engine's other capability gates). This **removes the need to emit `fill: forwards`
at all**. Pick **one rest-writer** — either `commitStyles()` or the shadow-tick
`paintRest()` inline write (`engine.ts:510-516`), not both — to preserve a single
rest-position contract. Distinguish the already-correct **cancel-on-halt** path
(`_cancelWAAPI` → AbortError swallow) from this new **commit-on-finish** path.

**WHY:** a finished finite delegated play currently leaves N residual filling
animations that fight the inline write (compositor wins by cascade order) and
accumulate per play — a leak + a cascade non-isomorphism vs the rAF path (which
ends with zero residual animations). The fix is strictly isomorphism-*restoring*:
both paths converge to rest-as-inline-style + zero residual animations
(`target.getAnimations()` returns none, a later author style change is honored).

### S5 — `linear()` consumption in `getTimingFunction` — Strand A, isomorphism-RESTORING

**WHAT:** a `LINEAR_LITERAL` regex sibling to `CUBIC_BEZIER_LITERAL`/`STEPS_LITERAL`
(`utils.ts:78-85`) that extracts the stops and feeds value.js's already-importable
`cssLinear(stops)` evaluator (exported from `@mkbabb/value.js` — added to
`utils.ts`'s existing value.js import block at `:2-17`, the heavy surface; **not**
the light `src/animation/easing.ts`, which is deliberately value.js-free) → a
callable curve, slotted into `getTimingFunction` before the registry lookup
(`utils.ts:138`). Lands **independently** of the
value.js `linear()` parser hand-off (the round-trip is only *whole* when both land
— see the value.js charter E1 — but the kf fix closes the silent `easeInOutCubic`
degrade on its own). Strictly additive: no existing input is a `linear()` string
today (it always degraded). Baseline `linear()` 2023-12-11.

**WHY:** the engine emits `linear()` from its spring path, writes it back out in
`format.ts`, and the WAAPI twin emits the same curve — but the rAF path silently
drops a re-imported `linear()` to `easeInOutCubic`, so the JS and compositor curves
disagree. Closing the read-back makes the engine able to consume its own emitted
easing — isomorphism-restoring against the curve it authored.

### S6 — The standalone loop made zero-alloc (E-RT-1/D-RT-7, D-RT-1/2) — Strand B, MEASURE-FIRST

**WHAT:** hoist a per-instance `_interpOut` buffer (as the group hoisted `_grouped`)
+ lift `processFrame` to a private method (kill the per-frame `out={}` +
closure on the standalone path: `engine.ts:550,573,699`, `at():526`); reset the
reused buffer by **stable-key** assignment (kill the `delete`-loop dictionary-mode
deopt at `engine.ts:555` + `group.ts`); and in the single-active-frame majority
case, alias `frame.flatVars` instead of `Object.assign(result, frame.flatVars)`
per frame (`engine.ts:589`).

**MEASURE-FIRST — the gate is a delta, not an assertion.** Each B-strand fold lands
behind a **shaped** `interpolation.bench.ts` variant. The current bench omits the
threaded `out` buffer (the realistic playback shape), so it cannot see
D-RT-1/2/7 — **add it.** A fold that does not move the shaped bench is
recorded-withheld with the measurement in-tree (the D-3 / E.W5 posture).

**WHY:** D.W4 proved the group composite allocates zero bytes/frame; the primitive
loop does not, even though it is the same discipline one level down. The
`delete`-loop *defeats* the zero-alloc reuse it serves (V8 leaves fast-properties
mode permanently). The fix extends D's discipline to the primitive — but a perf
claim ships on a measured win or not at all.

### S7 — The per-frame DOM write diff-and-skip (E-RT-3/D-RT-8) — Strand B, MEASURE-FIRST

**WHAT:** `transformTargetsStyle` (`utils.ts:305-319`) re-serializes via
`unflattenObjectToString` + calls `setProperty` for every key every frame even when
byte-identical to last frame. Add a last-written-string cache per `(target, prop)`
+ diff-and-skip. Behind the shaped bench.

**WHY:** an unconditional `setProperty` for a byte-identical value is a wasted
style invalidation every frame; the skip is behaviour-identical (the same final
style) and removes redundant compositor work. Measure-first: lands on the bench
delta, else withheld.

### S8 — Async fast path + the compile-time residuals (E-RT-2/D-RT-9b, FC-3/FC-5/FC-6, E-RT-5, F2a) — Strand B

**WHAT:** five bounded folds, each isomorphic:
- **E-RT-2** — a synchronous fast path when `step` returns a boolean
  (`playback.ts:99-108` wraps every frame in `Promise.resolve(...).then(...)`;
  `advanceTo`/`_frame` are `async` on a steady-state path that awaits nothing).
  Keep the async branch for boundary frames that genuinely await; keep the
  generation guard.
- **FC-3** — gate the dead `frame.vars = unflattenObject(...)` (`frame-compiler.ts`)
  on `unflatten` (false on the `CSSKeyframesAnimation` default path), or make
  `vars` a lazy getter.
- **FC-5/F4** — complete the indexing discipline in `reconcileVars` (a `Map` on the
  `(startIx,endIx)` composite, retiring the residual `findIndex` + redundant
  `Object.keys` re-walk). Compile-time-only, Low; fold opportunistically.
- **FC-6/F3** — bound `tryParseCache` (`utils.ts:145`, unbounded) with an LRU,
  generous cap (1k). **This is the E.W5-BOOKED item;** W7 lands it with the
  cost-model evidence (or holds it recorded-withheld per E.W5's measure-first
  disposition).
- **E-RT-5/D-RT-9a** — `scale()` throws on a zero-width frame (`engine.ts:575`,
  `start===stop`); snap to the endpoint instead of throwing.
- **F2a** — preset lazy memo: `animations.ts` re-parses on every `fadeIn()` call; a
  module-level memo keyed on serialized options makes 2nd..Nth call O(1).

**WHY:** the async wrapper mints a promise + microtask per frame on a path that
awaits nothing (an INP/GC cost the boundary frames don't need); the dead `vars`
build, the residual `findIndex`, the unbounded cache, and the zero-width throw are
each a small isomorphic robustness/perf fold. `tryParseCache` is the explicit
hand-off from E.W5 — W7 is its measured home.

### S9 — The `proof:engine-correctness` + `proof:standalone-zero-alloc` instruments — the falsifiable close

**WHAT:** two checked-in, re-runnable instruments wired into CI:
- **`proof:engine-correctness`** — a lock-test reds today and greens on fix for
  each Strand-A item: (1) `setColorSpace("lab")` after `fromString` changes the
  interpolated channel values; (2) the 3-stop non-adjacent per-keyframe-easing
  inheritance lands the correct curve; (3) the WAAPI guard rejects a `cqw`
  animation (or the docstrings match the code); (4) after a finite delegated WAAPI
  play completes, `target.getAnimations()` returns **zero** residual animations;
  (5) a `linear(0, 0.5 25%, 1)` fed to `getTimingFunction` resolves to a callable
  curve sampling that linear shape, NOT `easeInOutCubic`.
- **`proof:standalone-zero-alloc`** — a sibling to `test/zero-alloc.test.ts`
  asserting **standalone** `interpFrames` reuses one buffer reference across frames
  (the buffer-identity instrument the group test already uses, applied to
  `Animation`), and a `%DebugPrint`/`--prof` check confirming the buffer stays in
  fast-properties mode after the `delete`→stable-key fix.

**WHY:** correctness is only honest if a gate BITES on the regression's return
(inv ε). Each clause reds on the exact lapse this wave forbids (the colorSpace
no-op, the sparse-easing mis-attribution, the WAAPI residue, the `linear()`
silent-degrade, the standalone alloc), so "the engine is correct + zero-alloc on
the primitive" means what it says.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real lock-test / bench
delta / `--prof` check, not an assertion):

1. **`proof:engine-correctness`** PASSES — all five Strand-A lock-tests green.
   **BITE:** revert any one fix (e.g. drop the `commitStyles()`+`cancel()` branch,
   or the `LINEAR_LITERAL` branch, or re-introduce `this.options.colorSpace =` with
   no re-derive) → the corresponding clause reds. Reds today on the colorSpace
   no-op + the WAAPI residual-fill leak + the `linear()` silent-degrade (all
   verified live); greens on fix.
2. **`proof:standalone-zero-alloc`** PASSES — standalone `interpFrames` reuses one
   buffer reference; the buffer stays in fast-properties mode. **BITE:**
   re-introduce the `out={}` default on the play path → the buffer-identity assert
   reds; re-introduce the `delete`-loop → the fast-properties check reds.
3. **Every Strand-B fold is measure-first.** Each fold lands behind the **shaped**
   `interpolation.bench.ts` variant (the threaded-`out` shape, added this wave) that
   shows the steady-state win; a fold that does not move the bench is
   recorded-withheld with the measurement in-tree. **BITE:** a perf claim with no
   bench delta → the disposition check reds (P-invariant-28: no un-dispositioned
   perf claim). `tryParseCache` carries its E.W5-booked disposition (landed-with-win
   OR recorded-withheld).
4. **No regression — the engine stays exemplary.** `npm test` stays green (Strand B
   is pixel-/behaviour-identical; the event-ordering test guards the sync fast
   path's resolve ordering); `proof:boundary` (the light/heavy edge),
   `proof:zero-alloc` (D.W4's group composite), and the engine's modern-web
   alignment are UNTOUCHED. **BITE:** a test regression → reds.

---

## § Folds

Retires (by finding id):
- **FC-1** (`setColorSpace`/`setHueMethod` compile-staleness) — S1 + S9.1.
- **D-1** (`createFrame` index-space conflation) — S2 + S9.2.
- **WAAPI F1 / `a-kf-computed` F3** (the guard rejects nothing it documents) —
  S3 + S9.3.
- **WAAPI W1** (commit-on-finish, NEW) — S4 + S9.4.
- **`r-css-values` §1 / `r-css-parsers` §5.1** (the `linear()` consumption gap,
  NEW) — S5 + S9.5.
- **E-RT-1/D-RT-7, D-RT-1/2** (standalone zero-alloc + the `delete`-loop deopt) —
  S6 + S9.
- **E-RT-3/D-RT-8** (the unconditional per-frame DOM write) — S7.
- **E-RT-2/D-RT-9b, FC-3, FC-5/F4, FC-6/F3, E-RT-5/D-RT-9a, F2a** (the async fast
  path + compile-time residuals) — S8. **FC-6 is the E.W5-booked `tryParseCache`
  item, landed here with the cost-model evidence.**

**Routed OUTWARD / RECORDED (not this wave):**
- **The value.js per-frame carrier + computed-unit endpoint cache** — the deepest
  structural wins (`ValueUnit` megamorphism; the `lerpComputedValue` re-serialize +
  layout-thrash) are value.js-owned. RECORDED in the value.js charter (Waves C/D);
  kf consumes the published result unchanged (`lerpValue` already dispatches through
  `iv._lerp`). NOT a W7 fold.
- **The `linear()` *parser* half** — value.js charter E1; the round-trip is whole
  only when both land. W7's S5 closes the kf consumption half on its own.

---

## § Design decisions

1. **Correctness FIRST, then hot-path — and the correctness fixes are the
   isomorphism guard W8 rides.** RESOLVED: Strand A lands (and locks) before
   Strand B, and W8 (the FrameCompiler transposition) depends on this wave because
   W7's lock-tests + the shaped bench are the equivalence guard the representation
   change must hold. The only pixel change in W8 is W7's D-1 carried as a
   dependency.

2. **The WAAPI commit-on-finish and the `linear()` read-back are
   isomorphism-RESTORING, not breaking.** RESOLVED + named: every other Strand-A
   item is pixel-identical except where currently *wrong* (the colorSpace no-op,
   the sparse-easing mis-attribution, the WAAPI/rAF resize divergence) — deliberate,
   befitting, test-locked breaks. S4 and S5 *converge* the WAAPI path to the rAF
   path's lifecycle and the re-imported `linear()` to its authored curve — they
   restore isomorphism the engine had broken with itself. Strand B is fully
   pixel-/behaviour-identical (buffer reuse, write-skip of redundant writes, sync
   fast path preserving event/resolve ordering).

3. **Every Strand-B fold is MEASURE-FIRST — the D-3 / E.W5 posture, applied to the
   primitive loop.** RESOLVED: the standalone zero-alloc, the write-skip, the sync
   fast path each land only behind a shaped bench that proves the steady-state win;
   a fold that doesn't move the bench is recorded-withheld with the measurement
   in-tree. The current bench omits the threaded-`out` shape, so this wave *adds*
   the realistic variant before claiming any win. `tryParseCache` (E.W5's booked
   item) lands here on the cost-model evidence or stays the documented unbounded
   memo with the number recorded. No speculative perf machinery.

4. **The `linear()` consumption fix lands independently of the value.js parser.**
   RESOLVED: the round-trip is severed on both ends (kf has no `linear(` branch;
   value.js has no `linear()` *parser* feeding `cssLinear`). The two are *whole*
   only when both land — but the kf `LINEAR_LITERAL` branch closes the silent
   `easeInOutCubic` degrade on its own (it feeds value.js's already-importable
   `cssLinear` evaluator). The value.js parser half is the charter's E1; W7 does
   not block on it (inv-16 — keyframes proposes the value.js tranche, never writes
   it).
