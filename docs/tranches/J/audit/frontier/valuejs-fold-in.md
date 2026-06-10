# valuejs-fold-in — kf-local code that is generic VALUE territory (kf→value.js)

**Lane:** the FOLD-IN audit. Sweep live kf `src/animation/` (+ the demo curve-editor) with the
boundary hypothesis (value.js owns VALUES — parse/serialize/units/color/easing-math/interp; kf
owns TIME — frames/playback/orchestration). For each kf-local candidate: who consumes it beyond
kf (the abstraction bar — a move needs **>1 real consumer or a structural win**, never tidiness),
the API shape, what kf DELETES, the migration cost, the verdict.

**Provenance:** direct source survey of `/Users/mkbabb/Programming/keyframes.js/src/animation/`
(live HEAD, branch `tranche-j-dev`) + `/Users/mkbabb/Programming/value.js` (HEAD `0cb5dd2`,
published 0.11.2) + the demo. READ-ONLY on both source repos. Rests on
[`valuejs-census.md`](./valuejs-census.md) — read that first.

**Date:** 2026-06-10.

---

## §0 — Two lane-brief premises are FICTION; correcting them reshapes the lane

The lane charter's items (a) and parts of (b) name files that **do not exist in live kf**. The
charter inherited the stale kf CLAUDE.md project tree (the census §0.2 flags it). Corrected:

### §0.1 — (a) "src/parsing/keyframes.ts — the @keyframes grammar via parse-that" — does not exist; the grammar is ALREADY in value.js

There is **no `src/parsing/` in kf** and **no @keyframes grammar in kf** (`find src` → only
`src/animation/` + `env.d.ts`; `grep -rn "@keyframes\|keyframeRule\|parse-that"` finds only
*consumption*, never a grammar definition). The @keyframes grammar lives in
**`value.js/src/parsing/stylesheet.ts`** (`keyframeRule`, `keyframeSelectorList`, `keyframesBody`
— lines 286–373) and kf's `adapter.ts:4` consumes it via `parseCSSStylesheet` + `extractKeyframes`.

**The fold the charter contemplates has already happened.** The "should the grammar move to
value.js leaving kf the animation SEMANTICS" question is *answered in the affirmative, already
shipped*. kf's `adapter.ts` (138 LoC, `resolveKeyframes`) is exactly "kf the SEMANTICS" — it maps
value.js's generic `Stylesheet`/`KeyframeRule` AST onto kf's `Map<percent → vars>` + per-keyframe
timing/composition. The K1/SO-1 grammar-cohesion argument the charter wants is **already realized**:
one CSS-grammar home (value.js) enables K1 live-CSSOM ingestion and SO-1 scroll-grammar-as-CSS
because the parser is generic. **No fold to do. Verdict on (a): already-FOLDED (no item).**

*(Does this weaken or strengthen kf's @keyframes axis-1 identity? It STRENGTHENS it: the
round-trip is kf's axis, but the round-trip is `parse → compile-to-frames → playback → serialize`.
Owning the GRAMMAR was never the axis — owning the frame compilation + the per-keyframe timing/
composition semantics is. kf keeps the semantic half and rents the grammar, which is the clean
seam. The census §2 confirms kf already eats `parseAnimationShorthand` transitively via
`extractAnimationOptions`.)*

### §0.2 — (c) "two normalize.ts" — there is exactly ONE (value.js); kf has none

The charter's (c) "src/units/normalize.ts (kf's DOM-aware computed resolution, layoutEpoch
memoization) vs value.js units/normalize.ts — map both" rests on the same stale tree. **kf has no
`src/units/`.** The DOM-aware computed resolution + the `layoutEpoch` cache + `bumpLayoutEpoch`
ALL live in `value.js/src/units/normalize.ts` (494 LoC); kf consumes `normalizeValueUnits`/
`prepareInterpVar`/`bumpLayoutEpoch` as opaque kernels (census §0.2 establishes this definitively).
**There is nothing to fold IN here — the DOM-resolution middle is already wholly value.js's.** The
charter's "VJ's posture on DOM-dependence" question is therefore live but inverted: value.js
*already accepts* DOM-dependence in `normalize.ts` (it reads `getComputedStyle`, installs a
`window.resize` listener). So DOM-dependence is NOT a fold-blocker for value.js — a precedent that
matters for VJ-2 (the path sampler needs `<path>.getTotalLength()`, a DOM/SVG dependency value.js
has already shown it tolerates in `normalize.ts`). **Verdict on (c): already-FOLDED (no item),
plus a precedent note carried to VJ-2.**

---

## §1 — The real fold-in candidates (the sweep that survives the corrections)

Four candidates survive. One is a clean DO (already census VJ-1, re-confirmed + scoped). One is a
**new** finding this lane surfaces that the census §4 duplication table missed. Two are KILLs/KEEPs
(spring twin, decay) the census already adjudicated — re-confirmed against the boundary bar.

### [FI-1] `parseLinearStops` (utils.ts:106–130) → value.js `parseLinearStops`/`cssLinearFromString` — **DO** (= census VJ-1)

**What it is.** kf owns the `linear(...)` **string → `LinearStop[]`** parser (`utils.ts:106-130`),
feeding value.js's `cssLinear(stops)` **evaluator** (`value.js/src/easing.ts:33`). value.js parses
the curve from pre-built structs but has **no string parser** — confirmed: `easing.ts` has
`cssLinear(stops: LinearStop[])` only, no `parseLinear`/string overload (grep). kf's
`getTimingFunction` (`utils.ts:190-194`) does the string parse then calls `cssLinear`.

**Consumers beyond kf (the bar).** This clears the bar on the **structural-win** axis, not the
≥2-consumer axis: it is the symmetric completion of an existing value.js surface. value.js ALREADY
ships `cssLinear` (the evaluate direction) and `springLinearStops`-style emission would round-trip
through a value.js parse. Any consumer reading a `linear()` string back (glass-ui regenerating its
`--spring-*` tokens, a slides theme reading authored CSS) wants `linear-string → fn` in ONE call,
not "import kf's private shim." And K1 live-CSSOM ingestion will read `animation-timing-function:
linear(...)` off live stylesheets — that string-parse belongs in the grammar home.

**API shape.** `value.js`: `parseLinearStops(inner: string): LinearStop[] | undefined` (the inner
list parser, exactly kf's body), and ideally a `cssLinearFromString(s: string): ((t:number)=>number)
| undefined` convenience that wraps `LINEAR_LITERAL` matching + `parseLinearStops` + `cssLinear`.
The CSS grammar nuance (input `%` magnitude 0–100, not 0–1; flat-segment two-position stops) is
value-domain CSS-Easing-L2 knowledge that belongs beside `cssLinear`'s doc, not in kf.

**What kf DELETES.** `parseLinearStops` (25 LoC) + the `LINEAR_LITERAL` regex + the linear branch
body in `getTimingFunction` collapses to one `cssLinearFromString(timingFunction)` call. kf keeps
`getTimingFunction` (it is the kf-semantic timing-function *resolver* — bezier/steps/registry
dispatch). Net kf deletion ≈ 30 LoC.

**Migration cost.** S. Pure-string-in/struct-out, no DOM, fully unit-testable in value.js
isolation. The risk is the CSS grammar edge cases (the two-position flat-segment form); value.js's
`cssLinear` doc already documents that grammar (`easing.ts:24-26`), so the parser's spec home is
already there. Gated VJ→KF-consume: kf flips to the value.js export when 0.11.3+ ships it.

**Verdict: DO (kf→value.js).** Structural win — symmetric completion of the `cssLinear` surface,
demanded by K1's live-CSSOM ingestion. This is census **VJ-1**; this lane adds the
`cssLinearFromString` convenience-API shape + the K1 pull as the bar-clearing justification.

---

### [FI-2] **NEW** — kf hand-builds @keyframes CSS in `format.ts`; value.js SHIPS a complete `serialize.ts` kf consumes NONE of — **DO-IF-MEASURED / partial DO**

**The finding the census §4 missed.** The census duplication table audits what kf *re-implements
of value.js's math primitives* (`clamp/lerp`, `parseLinearStops`, `spring`). It does **not** audit
the **serialization** axis. Auditing it surfaces a real, unflagged duplication:

- **value.js ships `parsing/serialize.ts` (160 LoC):** `serializeDeclaration`, `serializeKeyframeSelector`,
  `serializeKeyframeRule` (emits `animation-timing-function` + `animation-composition` back inside
  the stop, lines 32-37), `serializeKeyframes`, `serializeStylesheet`, `stylesheetToString`,
  `formatCSS`. It is the structural **inverse** of `parseCSSStylesheet` — same AST, round-trip
  symmetric (`serialize.ts:110-117` documents "structurally equivalent when round-tripped").
- **kf's `format.ts` (195 LoC) consumes NONE of these serializers** (grep
  `serializeKeyframe|serializeStylesheet|serializeDeclaration` in kf src = 0). kf consumes only the
  leaf helpers `formatCSS`, `camelCaseToHyphen`, `reverseCSSTime`, `unflattenObjectToString`,
  `timingFunctions`. kf **hand-assembles** the @keyframes block string: `CSSKeyframeToString`
  (`format.ts:112-122`), `CSSKeyframesToString` (`format.ts:124-194`), `animationOptionsToString`
  (`format.ts:84-110`) all build `\`  ${name}: ${v};\``-style strings by hand and stitch them with
  `\`@keyframes ${name} {...}\``.

**This IS duplication of value.js's serializer** — kf re-derives, by hand, exactly what
`serializeKeyframeRule` already does (per-keyframe `animation-timing-function` emission:
kf `format.ts:164-169` vs value.js `serialize.ts:32-34` — *the same logic, twice*; `@keyframes
NAME { … }` wrapping: kf `format.ts:189` vs value.js `serialize.ts:42-50`).

**Why it's a *partial* not a clean DO — the genuine split.** The charter's (b) asks for the split
between the VALUE-serialization half and the ANIMATION-serialization half. Here it is, sharp:

- **VALUE-serialization half (already value.js's, kf re-derives by hand):** `decl → "name: value"`,
  `selector% → "X%"`, `KeyframeRule → "{ … }"`, `@keyframes NAME { … }` wrapping, the per-stop
  `animation-timing-function`/`animation-composition` re-emission. **→ value.js owns this; kf should
  consume `serializeKeyframeRule`/`serializeKeyframes` instead of hand-stitching.**
- **ANIMATION-serialization half (genuinely kf's, KEEP):** `serializeEasing` (`format.ts:30-45` —
  `Easing → animation-timing-function` token, including the fail-EXPLICIT throw when a custom
  closure has no CSS twin), `animationOptionsToString` (the `.class { animation-* }` block — kf's
  `AnimationOptions` → CSS longhands, NOT a value.js `Stylesheet`), and the
  `templateFrames`/`parsedVars` → keyframe-body mapping with the dedup-by-body grouping
  (`format.ts:175-180`). This is kf time-semantics (it serializes kf's *compiled* frame model),
  NOT generic CSS-value serialization.

**The structural blocker (raises cost, lowers verdict-confidence).** kf does NOT hold a value.js
`Stylesheet`/`KeyframeRule[]` AST at serialize time — it holds `templateFrames` + `parsedVars`
(its own compiled structures, `engine.ts:265-273`). To consume `serializeKeyframeRule`, kf would
first build `KeyframeRule[]` from its template frames (selector + declarations + timingFunction +
composition). That adapter is the **mirror of `adapter.ts`'s `declsToVarMap`/`formatSelectorPercent`
inbound mapping** — a `framesToKeyframeRules` outbound mapping. Once kf has that bridge, the
hand-string-stitching in `CSSKeyframeToString`/`CSSKeyframesToString` collapses to
`serializeKeyframes({ kind, name, rules })` + `formatCSS`.

**What kf DELETES.** The hand-stitched body builders in `CSSKeyframeToString` (10 LoC) and the
keyframe-string assembly in `CSSKeyframesToString` (the `decls.join` + `keyframesString +=` loop,
~40 LoC). kf ADDS a `framesToKeyframeRules` bridge (~25 LoC). Net is closer to wash on LoC — **the
win is not LoC, it is the round-trip invariant**: parse and serialize through ONE value.js AST so
`parseCSSStylesheet ∘ serializeKeyframes = id` is enforced by value.js's own round-trip test
(`serialize.ts:110-117`), not re-proven in kf. Today a value.js serializer fix (e.g. a CSS
escaping bug) silently does NOT reach kf's hand-stitched path — two emitters drift.

**Migration cost.** M. The bridge is mechanical but touches the editor-critical
`CSSKeyframesToString` path (the demo's Monaco round-trip). Needs the kf editor-parsing test suite
(`test/editor-parsing.test.ts`, `test/format.test.ts`) green across the swap. The
`animationOptionsToString` → `reverseAnimationShorthand` sub-swap (see FI-3) rides along.

**Verdict: DO-IF-MEASURED (kf→value.js, value.js side is no-op — it already ships).** The "measure"
is not perf — it is **the round-trip equivalence test**: prove
`serializeKeyframes(framesToKeyframeRules(frames))` byte-matches kf's current hand-stitched output
across `test/format.test.ts` + `test/editor-parsing.test.ts` corpora BEFORE swapping. If the
declared-vs-resolved nuance (`format.ts:147-158`, the I.W0-S2 "serialize from DECLARED template
values" fix) does NOT survive the value.js serializer cleanly, BOOK it instead — the I.W0
declared-value contract is load-bearing and must not regress for the AST tidiness. **A kf-side
item; value.js needs no change. This is the lane's headline NEW finding.**

---

### [FI-3] `animationOptionsToString` (format.ts:84-110) → value.js `reverseAnimationShorthand` — **DO-IF-MEASURED** (rides FI-2; = census KF-2 inverted)

**What it is.** kf's `animationOptionsToString` (`format.ts:84-110`) emits `animation-name`,
`animation-duration`, `animation-timing-function`, `animation-iteration-count`,
`animation-direction`, `animation-fill-mode`, `animation-delay` as **longhands** in a `.class { }`
block. value.js ships `reverseAnimationShorthand(opts: CSSAnimationOptions): string`
(`animation-shorthand.ts:262`) emitting the **shorthand** form, the exact inverse of the
`parseAnimationShorthand` kf already consumes via `extractAnimationOptions`.

**The asymmetry the census KF-2 named, sharpened.** Census KF-2 ("consume `reverseAnimationShorthand`
for CC-1 emit") is a *new-capability* framing. This lane's FOLD-IN framing adds: kf ALREADY emits
the animation declarations, just in longhand by hand — so consuming `reverseAnimationShorthand`
isn't only "new capability for CC-1," it **retires hand-built emission** that duplicates value.js's
emit grammar (the `ms → "1s"` time formatting in kf's `reverseCSSTime` vs value.js's `formatTime`
at `animation-shorthand.ts:282` is the *same* logic in two homes).

**Consumers beyond kf.** Clears the bar via CC-1 (the K compiler emit path wants the shorthand
form) + the duplication retirement. glass-ui/slides reading-back authored CSS want one emit grammar.

**What kf DELETES.** `animationOptionsToString`'s longhand stitching could become: emit the
shorthand via `reverseAnimationShorthand` for the compact form (CC-1), keeping the longhand
`.class` block ONLY where the editor needs per-property rows. Net: kf maps its `AnimationOptions`
→ value.js `CSSAnimationOptions` (a ~10-line field map; `serializeEasing` feeds `timingFunction`),
then calls `reverseAnimationShorthand`. Deletes the per-line `css += ...` ladder (~20 LoC).

**Migration cost.** S–M. The field map is trivial; the friction is that kf emits LONGHANDS (one
per line, editor-row-friendly) and `reverseAnimationShorthand` emits SHORTHAND (one line). These
serve different surfaces (the demo's editable longhand rows vs CC-1's compact emit) — so this is
**additive** (kf gains a shorthand emit via value.js for CC-1) more than a deletion. The longhand
block likely STAYS for the editor.

**Verdict: DO-IF-MEASURED (kf→value.js consume; value.js no-op — already ships).** Consume
`reverseAnimationShorthand` for the CC-1 emit path; the longhand `animationOptionsToString` stays
for the editor surface unless the round-trip test (FI-2) proves the shorthand round-trips through
the editor cleanly. **= census KF-2, re-cast as a fold-in (retire-the-duplicate-emit-grammar)
framing.**

---

### [FI-4] `springLinearStops.ts` + `springTimingFunction.ts` (spring → CSS `linear()` twin) — **KILL the fold** (KEEP in kf)

**The charter (d) asks: the `linear()`-stop emission serves ANY consumer (slides, glass-ui
`--spring-*` tokens) — VJ candidate?** Tested against the bar, the answer is **no fold**:

- **The emission is animation-SEMANTIC, not value-MATH.** `springLinearStops` (`springLinearStops.ts:46`)
  *samples a `SpringProgress` solver over time* — it instantiates `new SpringProgress(...)`,
  `_stepSeconds(dt)`-marches it, reads `.settled`/`.value`, and emits stops. The SOLVER
  (`spring.ts`, 491 LoC) is **wholly kf-local** — value.js has NO spring math (census §5; grep
  `spring/stiffness/damping` in value.js src = 0). You cannot fold the *emitter* without folding
  the *solver*, and the census §5 establishes (correctly) that the solver stays: physics rides the
  time engine; glass-ui already consumes the spring FROM kf, not value.js. Folding the emitter to
  value.js would force value.js to depend on a sampler whose physics value.js doesn't own — an
  inverted edge.
- **The "linear() stop emission" generic core is ALREADY in value.js** — it is `cssLinear` (the
  evaluate) + (after FI-1) `parseLinearStops` (the parse). What kf adds on top is the *spring
  sampling* that produces the stops. That added layer is the animation-semantic part. The generic
  `LinearStop[] → string` *formatting* (the `.toFixed(5)` join, `springLinearStops.ts:67-72`) is
  the only arguably-generic sliver, and it is 6 lines — below any fold bar (a `serializeLinearStops(stops)
  : string` helper in value.js would be tidiness, not a structural win; KILL on the
  >1-consumer/structural-win test).

**glass-ui `--spring-*` tokens** regenerate from `springLinearStops` (per its own doc,
`springLinearStops.ts:38`) — but they consume it FROM kf, exactly the established spring edge. No
second-consumer pull toward value.js.

**Verdict: KILL the fold — KEEP `springLinearStops`/`springTimingFunction` in kf.** Confirms census
§4/§5. The only future fold is the closed-form `decay` *sampler* (pure, clock-free) once a 2nd
consumer exists — already BOOKed in `decay.ts:17` ("collapses to a thin caller once value.js
publishes the canonical surface"), gated, not now.

---

### [FI-5] Demo `timingCurveUtils.ts` (`generateCurveSVGPath`/`getCurvePath`) — **KILL the fold** (demo presentation, no generic core)

**The charter (e) asks: the demo's bezier/curve-editor math — any generic core?** Read in full
(`demo/@/components/custom/animation-controls/controls/timingCurveUtils.ts`, 54 LoC;
`EasingCurveCanvas.vue`, 373 LoC). The verdict is **no fold**:

- `generateCurveSVGPath(fn, n)` SAMPLES a callable `(t)=>number` into an `M x,y L …` SVG polyline
  string (`timingCurveUtils.ts:4-12`) — pure **presentation** (it flips Y for SVG coords,
  `1 - v`). It has no value-domain knowledge; it would sample *any* function. Not value territory.
- The one generic primitive it needs — `CSSCubicBezier` — it **already imports from value.js**
  (`timingCurveUtils.ts:1`). The curve MATH is already value.js's; the demo only does the
  function→SVG-path rendering, which is Vue/SVG demo code.
- `EasingCurveCanvas.vue`'s control-point drag, `rubberBand` overshoot handling, viewBox
  auto-fitting (`:146-165`) are interaction/layout geometry — demo UI, not a reusable value kernel.

**Verdict: KILL the fold.** No generic core beyond `CSSCubicBezier` (already value.js's). The
SVG-path sampler is demo presentation. If a 2nd consumer ever needed "sample a `TimingFunction`
into an SVG path," that is a *charting* helper, not a value.js value-substrate concern — and it
would land in a demo/shared lib, not value.js. KILL on the bar.

---

## §2 — The sweep's negative space (what the sweep cleared — no fold)

A full `grep` of `src/animation/*.ts` for pure math/conversion/parse with NO animation semantics
(`Math.(sin|cos|sqrt|exp|pow)`, `parseFloat`, `/100`, `toFixed`, `matrix`, `rgb`, color) returns
ONLY animation-semantic hits, each correctly kf-local:

| Hit | Why it's NOT a fold |
|---|---|
| `smooth.ts:122` `1 - Math.exp(-damping·dt/16.667)` | the exponential-smoothing STEP — animation physics (the `/16.667` is the 60fps frame normalization). kf TIME. |
| `draw-svg.ts:94` `parseFloat(v)/100` | reads `offset-distance` percent off the DOM — the CSS-native scalar sweep; the heavy geometry (path `d` → length-param sampler) is already routed OUT to value.js VJ-2 (`draw-svg.ts:18-20`). |
| `sequence.ts:237` `parseFloat(relMatch[2])` | relative-offset (`"+=200"`) parse — sequence-timeline semantics. kf TIME. |
| `engine.ts:390` `Number.parseFloat(raw.trim())` | per-frame value read-back — frame compilation. kf TIME. |
| `utils.ts:111,122,162` | `parseLinearStops` (= FI-1) + the bezier-literal `parseFloat` (the kf timing-function RESOLVER dispatch — kf-semantic). |

**No orphaned generic math/conversion/parse found in kf `src/`.** Combined with §0 (grammar +
normalize already in value.js) and §1 (the four candidates), the sweep is exhaustive: the seam is
disciplined; the only NEW fold-in this lane surfaces beyond the census is **FI-2 (the serialize.ts
duplication)**.

---

## §3 — Cross-lane reconciliation

- **FI-1 = census VJ-1.** Same fold; this lane adds the `cssLinearFromString` API shape + K1 pull.
- **FI-3 = census KF-2**, re-cast from "new capability" to "retire duplicate emit grammar."
- **FI-4 confirms census §4/§5 KEEP/KILL** (spring twin stays kf; the boundary hypothesis that
  value.js owns spring MATH is FALSE and the reality is the better design).
- **FI-2 is NET-NEW** — not in the census's duplication table (§4 audited math-primitive
  re-implementation, not the stylesheet-serializer duplication). It is a kf-side consume of a
  value.js surface that ALREADY SHIPS (`serialize.ts`) — value.js needs no change.
- **§0 precedent (value.js already DOM-depends in `normalize.ts`) feeds VJ-2** — DOM/SVG dependence
  is not a fold-blocker for value.js's path sampler.

**Net value.js-side work from this lane:** ONE new export (FI-1 `parseLinearStops`/
`cssLinearFromString` — census VJ-1, S). Everything else is kf-side CONSUME of surfaces value.js
already ships (FI-2 `serialize.ts`, FI-3 `reverseAnimationShorthand`) or KEEP/KILL (FI-4, FI-5).
The boundary hypothesis holds; the only genuine new fold-in pressure is the serializer-duplication
(FI-2), and even that is "kf should consume what value.js already exports," not "move kf code into
value.js."
