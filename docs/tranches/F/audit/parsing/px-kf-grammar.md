# Tranche F deep-SOTA audit — lane `px-kf-grammar`

**Scope.** The keyframes.js-OWNED parsing surface, parse-that-first, across the
three modalities the F charter names — **grammar coverage** (the "single grammar,
no regex pre-detection" claim in `engine.ts:1068-1071`), **round-trip fidelity**
(`format.ts` Animation→CSS serializer + the `linear()` emit→parse round-trip
E.W7 "half-closed"), and **error recovery + diagnostics**. The deep question
this lane answers: *what is the kf-SIDE parsing F-scope — the part keyframes
OWNS vs the value.js-handoff?* file:line for every claim (inv ε).

**Method.** Live `tranche-e-impl` tree (the real layout: there is no
`src/parsing/`; the kf parse seam is `adapter.ts` + `utils.ts getTimingFunction`
+ `format.ts`, the grammar moved wholesale into value.js). value.js claims
grounded against the installed `@mkbabb/value.js@0.10.0` dist (`package.json` pin
`^0.10.0`) AND the live source `/Users/mkbabb/Programming/value.js/src/parsing/*`.
parse-that `@mkbabb/parse-that@0.8.2`. **inv-16:** value.js + parse-that are
SEPARATE repos — every value.js/parse-that item is a HANDOFF proposal; this lane
writes ONLY this doc, ZERO source edits.

**Relationship to the sibling F lanes (diff + EXTEND, never repeat).** Three F
lanes already cover adjacent ground and I cite, not re-derive, them:
- `a-parsing-post-e.md` — the **consumption-correctness seam** (F-1 serializer
  drops per-keyframe timing; F-2 `composition` dropped; F-3 `options` dropped;
  F-4 named selectors → 0%; F-6 the `linear()` value.js-HANDOFF). My lane goes
  DEEPER on the three modalities the charter assigns me (grammar/round-trip/
  diagnostics) and adds **four findings not in any sibling**: the live-editor
  round-trip consumer (PX-2), the `wrapBareKeyframes` regex that contradicts the
  "no pre-detection" claim (PX-1), the spring `linear()` round-trip lock GAP
  (PX-3), and the kf diagnostics-blindness posture (PX-5).
- `p-parse-perf-F.md` — the **parse-time PERFORMANCE** axis (`any()`→`dispatch`,
  `tryParseCache` 116×, `splitPathKey` double-split). Orthogonal to mine; I do
  not touch perf.
- `r-css-parsers-wasm.md` — the **CSS-parser-architecture SOTA + WASM** frontier,
  and F-1 there (kf grew a PRIVATE CSS-easing parser). My PX-3/PX-4 sharpen its
  F-1 with the round-trip-lock evidence and the BBNF-grammar end-state.

---

## §0. ALREADY-SOTA — manufacture no work here (state it plainly)

The brief's binding KISS clause: name where keyframes is at or ahead of SOTA so
no work is manufactured.

- **The "single grammar" claim is TRUE at the value.js layer — and it is SOTA.**
  `engine.ts:1068-1071` asserts "Single grammar in value.js handles every input
  shape … No regex pre-detection or fallback parser path." Verified: value.js's
  `parseCSSStylesheet` (`value.js stylesheet.ts:514`) is ONE grammar —
  `stylesheetItem = any(atRule, styleRule)` (`:501`), `atRule` dispatching
  `@keyframes`/`@property`/unknown-at-rule (`:490-501`), `styleRule` (`:456`) the
  `.class { … }` shape. There is no second parser, no `if (looksLikeKeyframes)`
  fork — the legacy `parseCSSKeyframes`/`parseCSSStyleBlock`/
  `parseCSSAnimationKeyframes` triple the adapter docstring names (`adapter.ts:90`)
  is GONE, collapsed into the one `resolveKeyframes` entry. This is the
  csstree/lightningcss "one tokenize-once grammar, no mode pre-detection" shape
  the SOTA field converged on. **Do not churn the single-entry design.**

- **The selector grammar is broad and current.** ONE `keyframeSelectorList`
  parses `from`→0% (`stylesheet.ts:268-270`), `to`→100% (`:271-272`), percent
  (`:276`), bare-number authoring-tool leniency (`:283`), AND the CSS-Scroll-Snap
  scroll-driven named ranges `entry`/`exit`/`cover`/`contain` (`:259-265`,
  `kind: "named"`). This is meaningfully ahead of every JS animation library's
  @keyframes reader (GSAP/Motion/anime all regex-split selectors). **SOTA.**

- **Per-keyframe metadata lift is spec-faithful.** `liftKeyframeMetadata`
  (`stylesheet.ts:310-336`) hoists `animation-timing-function` →
  `rule.timingFunction` and `animation-composition` → `rule.composition`, and
  DROPS `!important` declarations per CSS Animations spec §3 ("the entire
  declaration is ignored", `:314-323`) — exactly right, drop-without-error.
  **SOTA.**

- **`@property` registration (D-LIB-1) is exemplary.** `registerProperties`
  (`engine.ts:1125-1156`) feature-detects `CSS.registerProperty`, skips
  `syntax == null`, serializes `initialValue` via value.js canonical
  `ValueArray.toString()`, and swallows the process-wide-registry duplicate
  `InvalidModificationError` per-descriptor. Baseline 2024-07-09 shape. **SOTA.**

- **The lenient-parse / fail-explicit-API split is correct (and is the SOTA
  forgiving-parser posture).** `fromString` keeps the per-keyframe
  timing-function read LENIENT — an unresolvable curve inherits rather than
  throws (`engine.ts:1083-1096`); the typed `AnimationOptionError` is reserved
  for the explicit setter/`addFrame` path (`frame-compiler.ts:152-155`). This
  IS the csstree "tolerant by default, Raw node on bad content" /
  `@csstools` "forgiving, won't stop on a parse error" contract — kf gets the
  CSS-is-forgiving spec posture right. **SOTA** (modulo the diagnostics gap,
  PX-5).

- **The kf-side `linear()` CONSUME branch (E.W7 S5) is faithful.**
  `getTimingFunction` (`utils.ts:148-201`) is a complete CSS-Easing-L1 reader +
  the L2 `linear()` branch (`:190-194`), locked by `engine-correctness.test.ts:
  139-153` with a real BITE. The branch EXISTS and is correct; the residue is its
  hand-rolled-parser FORM (the value.js-HANDOFF, PX-4) and its round-trip-lock
  GAP (PX-3) — not its existence. **Credit it; the gaps are named below.**

---

## §1. The findings — grammar / round-trip / diagnostics

### PX-1 · The "no regex pre-detection" claim is contradicted TWICE — one kf-side, one value.js-side — **SHIP-in-F** (the kf half, LOW) + **value.js-HANDOFF** (the vj half)

The single most-precise grammar finding, and one no sibling lane states.

- **The claim.** `engine.ts:1068-1071`: *"Single grammar in value.js handles
  every input shape … No regex pre-detection or fallback parser path."* The
  comment is the project's stated grammar contract. It is FALSE at two seams.

- **kf-side violation (the one kf OWNS).** `resolveKeyframes` does NOT pass the
  input straight to the grammar — it runs `wrapBareKeyframes(input)` first
  (`adapter.ts:97`), which is a **regex pre-detection**:
  `if (/@keyframes\b/i.test(trimmed)) return input;` (`adapter.ts:81`). A bare
  stop-list (`from { … } to { … }`) is regex-sniffed and string-wrapped in a
  synthetic `@keyframes anonymous { … }` (`:83`) BEFORE the grammar sees it. So
  the "no regex pre-detection" contract is broken by the adapter the comment
  sits two lines above. This is not merely cosmetic: a CSS comment containing the
  literal `@keyframes` (`/* @keyframes foo */ from { … }`) defeats the sniff and
  the bare list is NOT wrapped → the grammar rejects it → silent empty parse.

- **Why SHIP (kf half).** The architecturally-correct move is to delete the
  regex and let the GRAMMAR decide the input shape — value.js already parses a
  bare declaration list at the style-rule/keyframe-body level; the wrap is a
  legacy crutch from before the single-grammar collapse. The idiomatic fix is a
  value.js grammar entry that accepts an unwrapped keyframe-stop list directly
  (a `parseKeyframeBody`-shaped reader) so kf passes the raw input and the
  comment-defeat bug vanishes. The bounded interim kf-side SHIP: make
  `wrapBareKeyframes` decide on the PARSED AST (parse once; if zero keyframes
  rules surfaced AND the input is a bare body, re-wrap) rather than a regex sniff
  — but the gestalt end-state is the value.js entry (no kf string-munging at all).

- **value.js-side violation (HANDOFF, already charted as Wave A4).** value.js
  itself runs a **whole-input regex pre-pass**: `stripCSSComments(input) =
  input.replace(/\/\*[\s\S]*?\*\//g, "")` (`stylesheet.ts:87`), invoked before
  the grammar. This is the exact Wave A4 item (`valuejs-sota-handoff.md` A4:
  "inline comment-skip during whitespace consumption, replacing the
  `stripCSSComments` whole-input regex pre-pass") — it destroys error-offset
  fidelity (every diagnostic offset is shifted by the stripped comment lengths)
  and is a second-scan the SOTA field (csstree skips comments inline in the
  tokenizer) rejects. **Carry the A4 HANDOFF forward; F adds that this pre-pass
  is the value.js half of the same broken "no pre-detection" contract the kf
  comment asserts.**

- **Disposition.** kf half: **SHIP-in-F** (LOW — delete the regex sniff, decide
  on the AST; or the deeper value.js grammar entry). value.js half:
  **value.js-HANDOFF** (Wave A4, unchanged — F links it to the contract claim).
  **Isomorphism:** the kf-side fix is befitting + STRICTLY more correct (the
  comment-defeat bug disappears); a no-comment bare list parses byte-identically.
  Gate: a `resolveKeyframes` test with `/* @keyframes x */ from { opacity: 0 }
  to { opacity: 1 }` asserting two frames (BITES today — returns zero).

### PX-2 · The serializer round-trip is the LIVE EDITOR's display-and-reapply seam — F-1's blast radius is larger than `a-parsing-post-e` scoped — **SHIP-in-F** (HIGH, sharpens F-1)

`a-parsing-post-e` F-1 correctly found the serializer drops per-keyframe timing.
F's px-lane adds the **consumer evidence** that makes it HIGH, not academic.

- **The serializer is not a debug printer — it round-trips through the editor on
  every keystroke.** `CSSKeyframesToString` (`format.ts:105-151`) is consumed by
  the live demo editor: `useKeyframesParsing.ts:38,51` calls it
  (`CSSKeyframesToString` + `CSSKeyframesToStrings`), and `useKeyframeOps`
  (threaded at `:62-63`) feeds the formatted string straight BACK through
  `updateAnimationFromKeyframesString` → `fromString`. The
  `timelineEngine.ts:62` `exportTimelineToCSS` and `KeyframesStringControls.vue:
  95` "apply" action do the same. **So the serializer's fidelity IS the editor's
  parse→format→re-parse fidelity — every infidelity is live data loss in the
  authoring tool, not a cosmetic format diff.**

- **What is lost on that round-trip (verified).** The serializer emits the
  animation-level `animation-timing-function` ONLY (`format.ts:65-76`, reading
  `options.timingFunction`) and NEVER reads `templateFrame.timingFunction`
  (grep `timingFunction` in `format.ts` → only the `options.` altitude; the
  `CSSKeyframesToString` loop `:117-137` reads `templateFrame.start` + sampled
  vars, nothing else). Yet `fromString` READ per-keyframe easings
  (`engine.ts:1089-1096`) and stored them per-frame
  (`frame-compiler.ts:152-155`). **Per MDN/CSS-Animations-L1: a keyframe's easing
  applies "on a property-by-property basis from the keyframe on which it is
  specified until the next keyframe specifying that property."** Collapsing all
  per-stop curves to one animation-level curve is a SPEC violation, and in the
  editor it means: author types `50% { … animation-timing-function: ease-in }`,
  the editor reformats, and the `ease-in` vanishes from the displayed AND
  reapplied CSS. Silent, every-keystroke.

- **Disposition — SHIP-in-F (HIGH), per `a-parsing-post-e` F-1's fix.** Factor
  the `Easing.css`-faithful / registry-reverse-lookup logic already at
  `format.ts:65-74` into a `serializeEasing(easing)` helper; emit a per-keyframe
  `animation-timing-function` whenever `templateFrame.timingFunction` differs
  from the animation default. **Isomorphism:** strictly more correct; a uniform-
  easing animation emits nothing per-keyframe (byte-stable). **F's added gate
  (stronger than F-1's):** an EDITOR-PATH round-trip — `fromString` a
  per-keyframe-easing CSS, `CSSKeyframesToString`, `fromString` again, assert the
  re-parsed `templateFrame[i].timingFunction.fn` matches. It bites today AND it
  guards the live editor seam, not just the library API.

### PX-3 · The spring `linear()` emit→parse round-trip is UNLOCKED — E.W7 "half-closed" made precise — **SHIP-in-F** (MED, test-only)

The charter explicitly flags "the linear() round-trip E.W7 half-closed." Here is
exactly which half, and the gap.

- **The two halves.** The `linear()` round-trip has two legs: (a) the engine
  EMITS a spring as `linear(0, 0.234 4.17%, …, 1)` via `springLinearStops`
  (`springLinearStops.ts:46,72`) / `springTimingFunction` (the `.css` twin); (b)
  the engine READS a `linear()` string back to the true curve via
  `getTimingFunction` → `parseLinearStops` → `cssLinear` (`utils.ts:190-194`).
  E.W7 S5 closed leg (b) — and locked it with `engine-correctness.test.ts:139`.

- **The gap: the lock tests a HAND-AUTHORED linear, never the engine's OWN
  emission.** `engine-correctness.test.ts:140` probes
  `getTimingFunction("linear(0, 0.25 25%, 0.75 75%, 1)")` — a literal the test
  author wrote. There is NO test that takes `springLinearStops({…})` OUTPUT and
  feeds it through `getTimingFunction`. The `springLinearStops.test.ts` suite
  (`:85-110`) checks the EMIT shape only (overshoot > 1, the `<num> <pct>%`
  regex) — it `parseStops` with its OWN private regex (`:5-11`), never
  `getTimingFunction`. **So the actual round-trip the engine relies on — emit a
  spring, re-import it, get the same curve — is UNLOCKED.** This matters because
  `springLinearStops` emits magnitudes the kf `parseLinearStops` must read
  identically: `parseLinearStops` passes the percent magnitude UN-normalized to
  `cssLinear` (`utils.ts:119-124`), and the two-input flat-segment form
  (`:118-127`) is exactly the shape `springLinearStops` can emit on a plateau —
  a divergence here is a silent wrong curve with no test to catch it.

- **Disposition — SHIP-in-F (MED, test-only, zero source change).** Add a
  round-trip lock: `const css = springLinearStops({response, dampingFraction});
  const fn = getTimingFunction(css);` then assert `fn` samples within epsilon of
  the spring's own `springTimingFunction(...).fn` at t ∈ {0.1,…,0.9}. This closes
  the E.W7 "half" the charter names — the half that was never the parse BRANCH
  (that shipped) but the parse-back FIDELITY against the engine's own emission.
  **Isomorphism:** test-only, no behaviour change. **Why now:** it is the gate
  that guards PX-4's eventual value.js-handoff fold (when value.js ships the
  `linear()` parser, this test is the byte-match corpus the consolidation must
  pass).

### PX-4 · The kf-PRIVATE `linear()`/`cubic-bezier()`/`steps()` regex parser is the one grammar seam kf re-implements — **value.js-HANDOFF** (Wave E1/E2; retire kf dup when it lands)

`r-css-parsers-wasm` F-1 found this; F's px-lane confirms it live and adds the
grammar-end-state framing + the retire-corpus.

- **The seam.** kf's `getTimingFunction` hand-rolls three CSS-easing matchers in
  `utils.ts`: `CUBIC_BEZIER_LITERAL` (`:80-81`), `STEPS_LITERAL` (`:86-87`),
  `LINEAR_LITERAL` (`:96`), plus `parseLinearStops` (`:106-130`) doing
  `inner.split(",")` → per-part `trim().split(/\s+/)` → `parseFloat` → `%`-strip.
  This is the ONE place kf re-implements CSS syntax (every other value/time/
  keyframe parse delegates to value.js: `parseCSSValueUnit`
  `frame-compiler.ts:143`, `tryParseTime`→`parseCSSTime` `engine.ts:55`,
  `parseAndFlattenObject`→value.js `utils.ts:205`). It is a THIRD hand-rolled CSS
  parser in the graph (after value.js's combinator grammar + parse-that's dormant
  `parsers/css/` scanner).

- **Why it exists + why it's a HANDOFF not a kf-SHIP.** value.js has the
  EVALUATORS (`cssLinear` `value.js easing.ts:33`, `steppedEase`,
  `CSSCubicBezier`) but NOT the PARSERS that turn the CSS string into the
  evaluator's input — re-verified live: grep `parseLinear`/`linearStops` in the
  installed `value.js@0.10.0` dist → the only hits are gradient stops, not the
  easing parser. So `linear()` reaches kf as a RAW STRING
  (`value.js stylesheet.ts:322` `rule.timingFunction = d.value.toString().trim()`)
  and kf MUST structure it itself. E.W7 S5 was correct to ship the kf branch
  (deleting it re-severs the round-trip). The SOTA end-state is value.js Wave
  E1/E2: value.js parses `linear()`/`steps()` at the value-grammar level →
  `parseCSSValue("linear(…)")` structures uniformly → kf's `getTimingFunction`
  consumes typed stops and DELETES its three regexes + `parseLinearStops`. One
  CSS parser, owned by value.js (inv-16 hand-off, already charted).

- **Disposition — value.js-HANDOFF (Wave E1/E2). Booked-for-deletion, not
  delete-now.** Keep the kf regexes until E1/E2 land (ripping them out unilaterally
  re-severs the round-trip — the Mandate forbids legacy, but it equally forbids a
  regression). **F's added note:** the consolidation MUST be byte-matched against
  PX-3's spring-emission corpus — value.js's `linear()` parser must reproduce
  kf's `parseLinearStops` semantics (positional distribution; %-magnitude
  un-normalized vs 0–1 fraction, `utils.ts:119-124`; the two-input flat-segment
  form) over kf's own `springLinearStops` output. PX-3's round-trip lock IS that
  corpus. **Isomorphism:** byte-identical typed-stop output (the fold is iso by
  construction or it is not a fold).

### PX-5 · kf is DIAGNOSTICS-BLIND on a malformed parse — no error surface, silent empty-frame — **BOOK** (correctness/DX; the kf-side error-recovery gap)

The charter's third modality — "error recovery + diagnostics." The honest finding:
kf has NONE of its own, and inherits value.js's forgiving-but-silent posture
without surfacing it.

- **What happens on a bad parse.** `resolveKeyframes` calls `parseCSSStylesheet`
  (`adapter.ts:97`), which is forgiving (value.js wraps unparseable content
  rather than throwing — the SOTA csstree/`@csstools` "Raw node / forgiving"
  posture, `value.js stylesheet.ts` unknown-at-rule `:467-490`). `pickKeyframes`
  (`adapter.ts:65-71`) takes the first non-empty keyframes block or returns `[]`.
  **So a malformed `@keyframes` (a typo'd selector, an unbalanced brace, a
  garbled value) yields zero frames — `fromString` runs the loop zero times
  (`engine.ts:1075`), calls `parse()` on an empty animation, and returns `this`
  with NO error, NO warning, NO diagnostic.** The author sees a no-op animation
  and no signal why. There is no `parseErrors` field on `ResolvedKeyframes`
  (`adapter.ts:18-31`), no `onParseError` hook, no `console.warn`.

- **The named-selector silent collapse is a special case of this (cross-ref
  `a-parsing-post-e` F-4).** A scroll-named selector (`entry`/`exit`/…) surfaces
  its literal name (`adapter.ts:53`), flows to `addFrame` → `parseCSSValueUnit
  ("entry")` → `convertFrameStart`: a bare keyword has no numeric value, so
  `(NaN/duration)*100` then `clamp(NaN, 0, 100)` (`frame-compiler.ts:121,124`)
  → 0. Every named stop silently becomes 0% — the same diagnostics-blind failure
  mode, value.js parses it correctly and kf swallows it.

- **The SOTA frame.** csstree exposes `onParseError` (continue, collect errors),
  `@csstools/css-parser-algorithms` is forgiving-with-a-returned-error-list, and
  the CSS spec itself says recover by "throwing away only the minimum content."
  kf gets the FORGIVING half (it doesn't throw) but not the DIAGNOSTIC half (it
  can't TELL you what it threw away). For an authoring tool — and the live editor
  IS the consumer (PX-2) — that is the wrong trade: a forgiving parser in an
  editor needs a diagnostic channel or the author flies blind.

- **Disposition — BOOK.** The architecturally-right move is a diagnostics
  channel: surface a `ResolvedKeyframes.diagnostics` (parse warnings: unparseable
  declarations, dropped `!important`, unwired named selectors, zero-frame result)
  that the editor can render and the library can `console.warn` behind a
  dev-only flag — mirroring csstree's `onParseError`. This needs value.js to
  expose its forgiving-parse error sink (today it swallows into `unknown`
  rules / `console.error` on top-level fail — the `p-parse-perf-F` F-P5 leak,
  which is the WRONG channel) — so it pairs a **value.js-HANDOFF** (expose a
  structured parse-error list, the csstree `onParseError` shape) with a kf-side
  **BOOK** (the `diagnostics` field + editor surface). It is a real feature, not
  a one-liner — BOOK it. **Interim:** PX-1's fix removes the most common silent
  failure (the bare-list comment-defeat); F-4's interim fail-loud (drop the named
  frame with a warning instead of a silent 0%) could ride a wave with room.

### PX-6 · `pickKeyframes` first-block + multi-`@keyframes` — **ALREADY-SOTA / KILL** (confirms `a-parsing-post-e` F-7)

- value.js groups multi-`@keyframes` by name (`extractKeyframes`,
  `extract.ts:34-49`); kf's `pickKeyframes` (`adapter.ts:65-71`) deliberately
  takes the FIRST named block, documented (`:59-64`) as a one-animation
  contract with `parseCSSStylesheet` as the escape hatch for the full set. A
  single `CSSKeyframesAnimation` IS one animation; multi-animation orchestration
  is the AnimationGroup/`sequence` tier's job (fed by separate `fromString`
  calls). **No gap. KILL any proposal to make `fromString` multi-animation** — it
  muddies the one-animation contract; the escape hatch is the right seam. (F
  concurs with `a-parsing-post-e` F-7; no new evidence, recorded for completeness
  so a future pass does not re-open it.)

---

## §2. Disposition summary

| # | Finding | file:line | kf-owns or handoff | Disposition |
|---|---------|-----------|--------------------|-------------|
| PX-1 | "No regex pre-detection" claim contradicted — `wrapBareKeyframes` regex (kf) + `stripCSSComments` pre-pass (vj) | `adapter.ts:81,97`; `engine.ts:1068-1071`; `value.js stylesheet.ts:87` | **kf** (sniff) + **vj** (strip) | **SHIP-in-F** (kf half, LOW) + **value.js-HANDOFF** (Wave A4) |
| PX-2 | Serializer round-trip IS the live-editor reapply seam — per-keyframe easing lost every keystroke | `format.ts:65-76,105-151` vs `engine.ts:1089-1096`; consumer `useKeyframesParsing.ts:38,51,62` | **kf** | **SHIP-in-F** (HIGH; sharpens `a-parsing-post-e` F-1 with the editor-path gate) |
| PX-3 | Spring `linear()` emit→parse round-trip UNLOCKED — the lock tests a hand-authored literal, not the engine's emission | `engine-correctness.test.ts:139-153`; `springLinearStops.test.ts:85-110`; `utils.ts:106-130,190-194` | **kf** | **SHIP-in-F** (MED, test-only — closes the E.W7 "half") |
| PX-4 | kf-private `linear()`/`cubic-bezier()`/`steps()` regex parser — the one re-implemented grammar seam | `utils.ts:80-130` ; `value.js easing.ts:33` | **value.js** | **value.js-HANDOFF** (Wave E1/E2; retire kf dup, byte-match PX-3 corpus) |
| PX-5 | Diagnostics-blind on malformed parse — forgiving but silent; no error surface | `adapter.ts:65-71,18-31`; `engine.ts:1075`; `frame-compiler.ts:121,124` | **kf** (surface) + **vj** (error sink) | **BOOK** (`diagnostics` field + editor surface; pairs vj-HANDOFF: csstree-shape `onParseError`) |
| PX-6 | `pickKeyframes` first-block / multi-keyframes one-animation contract | `adapter.ts:65-71` ; `value.js extract.ts:34-49` | **kf** | **ALREADY-SOTA / KILL** (confirms `a-parsing-post-e` F-7) |

**The kf-SIDE parsing F-scope, stated plainly (the charter's core question).**
The GRAMMAR is value.js's and is SOTA — one `parseCSSStylesheet`, the broad
selector set, the metadata lift, `@property`, the forgiving posture (§0). The
kf-OWNED parsing F-scope is **three modalities, four kf-side actionables**:
1. **Grammar contract** — PX-1: the "no regex pre-detection" claim is FALSE on
   kf's side (`wrapBareKeyframes` sniff, with a real comment-defeat bug). A clean
   SHIP (delete the regex, decide on the AST / value.js grammar entry).
2. **Round-trip fidelity** — PX-2 (serializer drops per-keyframe easing, and the
   serializer is the LIVE EDITOR's reapply path — HIGH) + PX-3 (the spring
   `linear()` round-trip is unlocked — a test-only SHIP closing the E.W7 half).
   Both kf-owned; the data is already on the template frame / the emission is
   already produced.
3. **Diagnostics** — PX-5: kf is forgiving-but-silent; it inherits value.js's
   no-throw posture without a diagnostic channel, and the live editor consumer
   needs one. A BOOK (the `diagnostics` field + the csstree-`onParseError`-shape
   value.js sink).

The two **value.js-HANDOFFs** are PX-4 (the `linear()`/`steps()` PARSER, Wave
E1/E2 — kf carries the private regex dup until it lands) and the PX-1/PX-5 value.js
halves (Wave A4 comment-skip; the structured parse-error sink). No work is
manufactured: the single grammar, the selector breadth, `@property`, the lenient
posture, and the `linear()` consume branch are ALREADY-SOTA and untouched (§0).

---

## §3. inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/parsing/px-kf-grammar.md`. ZERO source
edits to keyframes.js, value.js, or parse-that. Every kf claim is `file:line`-
grounded against live `tranche-e-impl`; every value.js claim against the installed
`@mkbabb/value.js@0.10.0` dist (the code kf runs) AND the live value.js source
(`/Users/mkbabb/Programming/value.js/src/parsing/{stylesheet,extract}.ts`); every
parse-that claim against `@mkbabb/parse-that@0.8.2`. Every SOTA claim is grounded
in a cited source. The value.js + parse-that items (PX-1 vj half, PX-4, PX-5 vj
half) are HANDOFFs the value.js owner sequences against its own tranche discipline.

## Sources
- **kf live** (cited inline): `src/animation/{adapter,engine,frame-compiler,utils,
  format,springLinearStops,springTimingFunction}.ts`; `test/{format,equivalence,
  engine-correctness,springLinearStops}.test.ts`; demo `useKeyframesParsing.ts`,
  `timelineEngine.ts`, `KeyframesStringControls.vue` (the live-editor round-trip
  consumer evidence, PX-2).
- **value.js live** (`/Users/mkbabb/Programming/value.js/src/parsing/`):
  `stylesheet.ts` (the single grammar `:501,514`; selectors `:259-283`; metadata
  lift + `!important` drop `:310-336`; `stripCSSComments` `:87`); `extract.ts`
  (`composition`/`options` `:24,163-167`); installed `value.js@0.10.0` dist (no
  `linear()` parser — re-verified, PX-4).
- **Sibling F lanes** DIFFED + EXTENDED (not repeated): `a-parsing-post-e.md`
  (F-1 serializer, F-2/F-3 dropped, F-4 named selectors, F-6 linear handoff —
  PX-2/PX-5 sharpen, do not duplicate); `p-parse-perf-F.md` (orthogonal perf
  axis); `r-css-parsers-wasm.md` (F-1 kf-private parser — PX-3/PX-4 add the
  round-trip-lock + retire-corpus). E `valuejs-sota-handoff.md` (Wave A4 comment-
  skip, Wave E1/E2 linear/steps parsers, the cross-repo edge).
- **SOTA field (2026-06):** csstree `onParseError` / "tolerant by default, Raw
  node on bad content" + "throw away only the minimum content" (csstree docs,
  parsing.md); `@csstools/css-parser-algorithms` forgiving-no-stop; MDN/CSS-
  Animations-L1 per-keyframe `animation-timing-function` "property-by-property
  from the keyframe on which it is specified" (the PX-2 spec ground); MDN CSS
  error-handling.
