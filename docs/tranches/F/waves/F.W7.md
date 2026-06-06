# F.W7 — The serializer round-trip symmetry (the per-keyframe easing data-loss hole)

**Phase:** IMPL · **Class:** PATCH (the published library — a correctness fix to a
WRONG round-trip value; no new public surface, the serializer's signature byte-stable,
uniform-easing output byte-identical) · **Scope:** `src/animation/format.ts` (the
Animation→CSS serializer) — the kf-side consumption-correctness seam, file-disjoint
from the engine perf band (F4/F5/F6) and the orchestration waves (F9/F10/F11) · **DAG:
independent of Bands 0/1** (`F.md §The DAG` — Band 2 shares no surface with
the engine or verification bands; runs in parallel) · **Gated on:** keyframes' own green
CI (inv-27).

**Title.** *`fromString` reads per-keyframe `animation-timing-function`; the serializer
never emits it. Close the asymmetry — one `serializeEasing()` factored, emitted at both
altitudes.*

This is the single sharpest correctness hole in the parsing band: the serializer is
**not** a debug printer — it round-trips through the live editor on every keystroke
(`px-kf-grammar PX-2`), and on that round-trip every per-stop easing curve is silently
discarded. value.js parses the data, `fromString` stores it on the template frame, and
the serializer — already iterating those exact frames — reads everything *except* the
easing. The fix is to read what is already there. It is a CSS-Animations-L1 spec
violation made into live data loss by the editor's parse→format→re-parse loop.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO
workaround: the fix is the gestalt round-trip symmetry (factor `serializeEasing()`, emit
at both altitudes), **not** a one-off inline `if` in the keyframe loop that re-derives
the registry lookup a second time. NO legacy: the animation-level emit at
`format.ts:65-74` and the new per-keyframe emit share **one** helper — no second
spelling of the `Easing.css`-faithful / registry-reverse logic. Measure-first does not
bind (a correctness fix, not a perf claim) — the gate is a falsifiable round-trip bite,
not a bench. Isomorphic-unless-named: a uniform-easing animation emits **nothing**
per-keyframe → byte-stable; the only output that changes is one that round-trips WRONG
today. inv ε: every claim below cites `file:line` against live `tranche-e-impl`,
verified not asserted.

**Provenance.** `a-parsing-post-e F-1` (the asymmetric serializer — SHIP-in-F HIGH),
`px-kf-grammar PX-2` (the live-editor reapply seam — the consumer evidence that makes it
HIGH not academic) + `px-kf-grammar PX-3` (the spring `linear()` round-trip lock that
guards this fix's emission corpus — carried as S2).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`, so the wave's framing is
honest:

1. **`fromString` READS per-keyframe easing and STORES it.** `engine.ts:1089-1096`:
   `const tfText = resolved.timingFunctions.get(percent); const resolvedFn = tfText ?
   getTimingFunction(tfText) : undefined;` then `addFrame(..., resolvedFn ? { fn:
   resolvedFn } : undefined)`. `FrameCompiler.addFrame` writes the result to
   `templateFrame.timingFunction` (`a-parsing-post-e F-1`, `frame-compiler.ts:150-155`),
   and the type carries it: `TemplateAnimationFrame.timingFunction?: Easing`
   (`constants.ts:80`). The data IS on the template frame. (Verified: `constants.ts:80`
   `timingFunction?: Easing;` — the optional per-template easing slot.)

2. **The serializer NEVER reads it.** `CSSKeyframesToString` (`format.ts:105-151`)
   iterates `animation.templateFrames` (`:117`) reading ONLY `templateFrame.start`
   (`:118`) and the sampled vars (`:120` `animation.at(progress, false)`). It never
   touches `templateFrame.timingFunction`. The ONLY `animation-timing-function` it emits
   is the single animation-LEVEL one in `animationOptionsToString` (`format.ts:65-76`,
   reading `options.timingFunction`). (Verified: grep `timingFunction` in `format.ts` →
   the `options.` altitude only; the keyframe loop `:117-137` reads `start` + vars,
   nothing else.)

3. **The animation-level emit already has the reusable logic.** `format.ts:65-74`: a
   `css !== undefined` branch emits the CSS twin VERBATIM (a spring's `linear()`, a
   `cubic-bezier()` literal); the `else` branch reverse-looks-up the callable in
   `timingFunctions` and `camelCaseToHyphen`-s the registry key
   (`easeOutCubic`→`ease-out-cubic`). This is *exactly* the per-keyframe emit logic —
   it is written once, at the wrong altitude only.

4. **The serializer is the LIVE EDITOR's reapply seam.** `CSSKeyframesToString` is
   consumed on every keystroke: `useKeyframesParsing.ts:38,51` calls it (and
   `CSSKeyframesToStrings`), and `useKeyframeOps` (threaded `:62-63`) feeds the formatted
   string straight back through `updateAnimationFromKeyframesString` → `fromString`;
   `timelineEngine.ts:62` `exportTimelineToCSS` and `KeyframesStringControls.vue:95`
   "apply" do the same (`px-kf-grammar PX-2`). So the serializer's fidelity IS the
   editor's parse→format→re-parse fidelity — every infidelity is live data loss in the
   authoring tool.

5. **The consequence (verified, end-to-end).** Parse `0% { … animation-timing-function:
   ease-in } 50% { … animation-timing-function: linear(0,1) }`, serialize, re-parse →
   every stop now inherits the one animation-level curve. Per MDN / CSS-Animations-L1: a
   keyframe's easing applies "on a property-by-property basis from the keyframe on which
   it is specified until the next keyframe specifying that property" (`px-kf-grammar
   PX-2`, the spec ground). Collapsing all per-stop curves to one animation-level curve
   is a SPEC violation, and in the editor it is silent, every-keystroke.

6. **The gap is UNTESTED.** `format.test.ts:46-67` asserts "same frame count" + "preserves
   property names" — it does NOT cover timing fidelity, so the hole is untested *and*
   unlocked (`a-parsing-post-e F-1`).

The wave's job: emit per-keyframe `animation-timing-function` when the template frame's
easing differs from the animation default, through ONE factored helper, locked by a
round-trip test that BITES today.

---

## § Goal

**What lands:**
- **`serializeEasing(easing): string`** — factor the `Easing.css`-faithful / registry-
  reverse-lookup logic out of `animationOptionsToString` (`format.ts:65-74`) into a
  named helper, and CALL it at both altitudes (the animation-level emit, unchanged byte
  output; the new per-keyframe emit).
- **The per-keyframe emit** — in the `CSSKeyframesToString` keyframe body builder
  (`format.ts:117-137`), when `templateFrame.timingFunction` is present AND differs from
  the animation default (`options.timingFunction`), append `animation-timing-function:
  ${serializeEasing(templateFrame.timingFunction)};` to that stop's declaration block.
- **`proof:roundtrip-easing`** (new) — a per-keyframe-easing round-trip lock-test that
  BITES today: `fromString` a multi-stop CSS with distinct per-stop curves →
  `CSSKeyframesToString` → `fromString` again → assert each re-parsed
  `templateFrame[i].timingFunction.fn` samples the same curve as the original. The
  EDITOR-PATH gate (`px-kf-grammar PX-2`): it guards the live reapply seam, not just the
  library API.
- **The spring `linear()` emit→parse round-trip lock** (S2, `px-kf-grammar PX-3`) — a
  test that takes `springLinearStops({…})`'s OWN emission through `getTimingFunction` and
  asserts the re-imported curve matches `springTimingFunction(...).fn` within epsilon.
  This closes the E.W7 "half" (the lock there tested a hand-authored literal, never the
  engine's emission) and seeds the value.js byte-match corpus for PX-4's eventual
  `linear()`-parser fold.

**Why:** a serializer that reads back fewer features than the parser stores is an
asymmetric round-trip — and because this serializer IS the editor's reapply path, the
asymmetry is silent live data loss, not a cosmetic format diff. The data is already on
the template frame the serializer is already iterating; the fix is to read it. The
factored `serializeEasing()` makes the per-keyframe and animation-level emits share one
authority (no second spelling of the registry-reverse logic — the no-legacy discipline).

---

## § Scope

### S1 — Factor `serializeEasing()` and emit per-keyframe easing (`a-parsing-post-e F-1` / `px-kf-grammar PX-2`) — SHIP-in-F (HIGH)

**WHAT:** two coupled moves, one gestalt.

- **Factor.** Extract `format.ts:65-74`'s logic into `serializeEasing(easing: Easing):
  string` — the `easing.css !== undefined ? easing.css : camelCaseToHyphen(registry-
  reverse(easing.fn) ?? "linear")` body, verbatim. `animationOptionsToString` then calls
  `serializeEasing(options.timingFunction)` at `:66-74` (its emitted bytes are
  IDENTICAL — same logic, named).
- **Emit per-keyframe.** In `CSSKeyframesToString`'s keyframe-body builder
  (`format.ts:117-137`), after the vars are serialized for a stop, when
  `templateFrame.timingFunction != null` AND it differs from the animation default
  (compare against `options.timingFunction` — by `.css` when both carry one, else by
  `.fn` identity), append `  animation-timing-function: ${serializeEasing(
  templateFrame.timingFunction)};` into that stop's body BEFORE the body is keyed into
  `keyframesMap`. (Note the keyframe DEDUP at `format.ts:132-135` keys bodies by string;
  two stops with the same vars but different easings now produce distinct bodies — which
  is the correct behaviour, they ARE distinct keyframes.)

**WHY:** the per-stop curve is already stored (`engine.ts:1089-1096` →
`constants.ts:80`) and silently dropped on emit; emitting it closes the asymmetry. The
factoring is the no-legacy move — the registry-reverse logic exists once
(`format.ts:69-73`); the per-keyframe emit reuses it rather than re-inlining a second
copy. The "differs from default" guard is what keeps uniform-easing output byte-stable
(an animation with one easing across all stops emits nothing per-keyframe).

### S2 — The spring `linear()` emit→parse round-trip lock (`px-kf-grammar PX-3`) — SHIP-in-F (MED, test-only, ZERO source change)

**WHAT:** add a round-trip lock (no source change — the engine already emits and reads
`linear()`; the GAP is the unlocked seam between them). `const css =
springLinearStops({ response, dampingFraction }); const fn = getTimingFunction(css);`
then assert `fn` samples within epsilon of `springTimingFunction({ response,
dampingFraction }).fn` at `t ∈ {0.1, …, 0.9}`. This exercises the engine's OWN emission
through its OWN reader — the round-trip the engine relies on but no test covers.

**WHY:** E.W7 S5 closed the `linear()` CONSUME branch (`utils.ts:190-194`) and locked it
with `engine-correctness.test.ts:139-153` — but that lock probes a HAND-AUTHORED literal
(`linear(0, 0.25 25%, 0.75 75%, 1)`), never the engine's emission (`px-kf-grammar PX-3`).
`springLinearStops` can emit the two-input flat-segment form (`utils.ts:118-127`) on a
plateau, and passes the percent magnitude UN-normalized to `cssLinear`
(`utils.ts:119-124`) — a divergence there is a silent wrong curve with no test to catch
it. This lock is also the byte-match corpus that PX-4's eventual value.js `linear()`-
parser fold (Wave E1/E2) must pass — so it is recorded now, before the consolidation.

> **RECORDED in this surface (NOT this wave) — so no future lane re-raises:**
> - **`wrapBareKeyframes` regex-sniff** (`px-kf-grammar PX-1` / charter `NEW-16`) — the
>   "no regex pre-detection" claim at `engine.ts:1068-1071` is contradicted by the
>   `adapter.ts:81` `/@keyframes\b/i.test(...)` sniff (a `/* @keyframes x */`-comment
>   defeats it → silent empty parse). **SHIP-in-F (LOW, kf half — decide on the AST)** —
>   booked to F.W8's adapter surface (the decide-on-the-AST move pairs the F8 adapter
>   capture); the value.js half (the `stripCSSComments` pre-pass) is **value.js-HANDOFF**
>   (Band V Wave A4). Not folded HERE — F.W7 is the serializer-only wave.
> - **diagnostics-blindness** (`px-kf-grammar PX-5` / charter `NEW-18`) — **BOOK** (a
>   `ResolvedKeyframes.diagnostics` field + editor surface) + **value.js-HANDOFF** (VJ-F2,
>   the structured `onParseError` sink). A real feature, not a one-liner.
> - **the kf-private `linear()`/`steps()` regex parser** (`px-kf-grammar PX-4`) —
>   **value.js-HANDOFF** (Wave E1/E2). Booked-for-deletion when value.js ships the
>   value-grammar parser; S2's lock is the retire-corpus. NOT delete-now (ripping it out
>   re-severs the round-trip — the Mandate forbids legacy AND a regression equally).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real lock-test, not an
assertion):

1. **`proof:roundtrip-easing` PASSES — per-keyframe easing survives the round-trip.** A
   test parses `@keyframes x { 0% { opacity: 0; animation-timing-function: ease-in } 50%
   { opacity: 0.5; animation-timing-function: linear(0, 1) } 100% { opacity: 1 } }` →
   `CSSKeyframesToString` → `fromString` again → asserts `templateFrame[0].timingFunction`
   samples `ease-in` and `templateFrame[1].timingFunction` samples the `linear(0,1)`
   shape (probe at `t=0.5` where they diverge from the default `easeInOutCubic`). **BITE:**
   revert the per-keyframe emit (drop the `format.ts:117-137` `animation-timing-function`
   append) → the re-parsed `templateFrame[i].timingFunction` collapses to the default and
   the clause reds. Reds today (the serializer drops it — verified S2 of State).

2. **The `serializeEasing()` factoring is byte-stable at the animation level.** A test
   asserts `CSSKeyframesToString` output for a UNIFORM-easing animation (one
   `animation-timing-function` across all stops) is byte-IDENTICAL before/after the
   factoring (no per-keyframe line appears). **BITE:** drop the "differs from default"
   guard so every stop emits its easing → the uniform-easing snapshot reds (a stray
   per-keyframe line appears). This is the isomorphism lock.

3. **`proof:spring-roundtrip` (S2) PASSES — the engine reads back its OWN `linear()`
   emission.** `getTimingFunction(springLinearStops({response: 0.5, dampingFraction:
   0.86}))` samples within `1e-3` of `springTimingFunction({response: 0.5,
   dampingFraction: 0.86}).fn` at `t ∈ {0.1,…,0.9}`. **BITE:** corrupt the percent-
   magnitude handling in the assertion's expected curve (treat `%` as a 0–1 fraction
   instead of un-normalized) → the epsilon assert reds. Guards the emit↔read seam
   `utils.ts:118-127,190-194`.

4. **No regression — the engine stays exemplary.** `npm test` stays green; `proof:boundary`
   (the light/heavy edge), the existing `format.test.ts` round-trip ("same frame count" /
   "preserves property names") are UNTOUCHED — the per-keyframe emit is strictly additive
   to the output of an animation that carries per-stop easing, and byte-identical for one
   that does not. **BITE:** any `format.test.ts` regression reds.

---

## § Folds

Retires (by finding id):
- **`a-parsing-post-e F-1`** (the serializer drops per-keyframe timing — asymmetric
  round-trip) — S1 + gate clauses 1/2.
- **`px-kf-grammar PX-2`** (the round-trip IS the live-editor reapply seam — HIGH) — S1
  + gate clause 1 (the editor-path round-trip).
- **`px-kf-grammar PX-3`** (the spring `linear()` emit→parse round-trip UNLOCKED — the
  E.W7 "half") — S2 + gate clause 3.

**Routed OUTWARD / RECORDED (not this wave):**
- **`px-kf-grammar PX-1`** (the `wrapBareKeyframes` regex-sniff, kf half) — SHIP-in-F
  LOW, booked to **F.W8** (the adapter surface, where decide-on-the-AST pairs the F8
  capture). The value.js `stripCSSComments` half is **value.js-HANDOFF** (Band V Wave A4).
- **`px-kf-grammar PX-4`** (the kf-private `linear()`/`steps()` regex parser) —
  **value.js-HANDOFF** (Wave E1/E2). Booked-for-deletion, byte-matched against S2's
  corpus when value.js ships the parser.
- **`px-kf-grammar PX-5`** (diagnostics-blindness) — **BOOK** + value.js-HANDOFF (VJ-F2).

---

## § Design decisions

1. **One `serializeEasing()`, called at both altitudes — NOT a second inline copy.**
   RESOLVED: the registry-reverse / `Easing.css`-faithful logic exists once
   (`format.ts:65-74`); the per-keyframe emit could be written as a fresh inline `if` in
   the keyframe loop, but that is the "one concept, N spellings" the codebase has
   surgically eliminated elsewhere (the `reduced-motion.ts` collapse, `a-boundary-arch-F
   §ALREADY-SOTA`). Trade-off: factoring touches the animation-level emit (a working
   path) to share the helper — but gate clause 2 locks its output byte-identical, so the
   factoring is provably inert at that altitude. The gestalt is the symmetry: parser
   reads it, serializer writes it, through one authority.

2. **The emit is GUARDED by "differs from default" — isomorphism, not unconditional.**
   RESOLVED + named: emitting `animation-timing-function` on EVERY stop would be strictly
   more "complete" but would change byte output for every existing uniform-easing
   animation (a named non-isomorphism with no benefit). The guard — emit only when the
   template easing differs from `options.timingFunction` — makes the fix
   isomorphism-RESTORING: a value that round-trips WRONG starts round-tripping right; a
   value that round-trips right stays byte-identical (gate clause 2). The only output
   that changes is the one currently losing data.

3. **S2 is test-only — the round-trip already works; the LOCK is the gap.** RESOLVED:
   the engine emits `linear()` (`springLinearStops.ts`) and reads it (`utils.ts:190-194`,
   E.W7 S5) — both halves shipped. The GAP `px-kf-grammar PX-3` names is that no test
   exercises the engine's OWN emission through its OWN reader (the existing lock tests a
   hand-authored literal). Adding the lock is zero source change and closes the E.W7
   "half" the charter names — AND it is the byte-match corpus PX-4's eventual value.js
   fold must pass, so it is recorded BEFORE the consolidation, not after.

4. **The deeper `composition`/`options` adapter captures are F.W8, not here.** RESOLVED:
   F.W7 is scoped to the serializer's `format.ts` surface ALONE (the round-trip
   symmetry). The sibling consumption-seam holes — `animation-composition` dropped,
   `resolved.options` never consumed (`a-parsing-post-e F-2/F-3`) — live on the
   `adapter.ts`/`engine.ts fromString` surface and fold in **F.W8** (the same band,
   disjoint file). Keeping them apart keeps each wave's gate a clean, single-surface bite.
