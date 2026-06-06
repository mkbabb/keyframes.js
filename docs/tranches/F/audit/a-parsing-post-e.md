# Tranche F deep-SOTA audit — lane `a-parsing-post-e`

**Scope.** keyframes.js' parsing surface AFTER D+E landed: the @keyframes
consumption seam (`src/animation/adapter.ts` → `engine.ts fromString`), the
timing-function reader (`src/animation/utils.ts getTimingFunction`), and the
serializer (`src/animation/format.ts` via value.js `formatCSS`/Prettier).
value.js owns the grammar (`parseCSSStylesheet` + `extract*`); kf consumes its
typed AST. inv-16: value.js findings are HANDOFFs; I write only this doc and
make ZERO source edits.

**Orientation correction (binding for downstream lanes).** The CLAUDE.md project
tree is STALE: there is no `src/parsing/` and no local `keyframes.ts` grammar.
The @keyframes grammar moved wholesale into value.js (`parseCSSStylesheet` +
`extractKeyframes`/`extractProperties`/`extractAnimationOptions`/`serialize.ts`),
and the kf-side parsing files now live under `src/animation/`: `adapter.ts`
(the AST→frame normaliser, the one parse entry), `utils.ts` (the
timing-function/value reader), `format.ts` (the serializer). The test list in
CLAUDE.md (`editor-parsing.test.ts`, `parsing.test.ts`) no longer exists — those
were value.js-grammar tests. The kf-side parse tests are `format.test.ts`,
`equivalence.test.ts`, and the `linear()` lock in `engine-correctness.test.ts`.

**Headline.** The kf-side *grammar coverage* is now value.js's job and is broad
and current (it is ALREADY-SOTA — say so plainly, §0). The real F-scope is a
cluster of **consumption-seam gaps in the adapter**: value.js parses three
keyframe-level / style-rule features that the adapter silently DROPS on the floor
(`composition`, the style-rule `options`, the scroll-named selectors), plus an
**asymmetric serializer** that loses per-keyframe timing on round-trip. None is a
value.js gap — every one is kf-side, the data is already on the typed AST or the
template frame, and the fix is to *read what is already there*. The one genuine
value.js piece (the `linear()` PARSER, E1) stays a handoff; E.W7 closed the
kf-consume half and that half is exemplary.

---

## §0. ALREADY-SOTA — manufacture no work here

- **Grammar breadth (value.js, consumed unchanged).** `parseCSSStylesheet`
  covers `from`/`to` → 0%/100% (`value.js stylesheet.ts:268-272`), bare-number
  selectors (`:274`, authoring-tool leniency), percent selectors, multi-selector
  bodies (`0%, 50% { … }`), `@property` with `syntax`/`inherits`/`initial-value`
  (`extract.ts:51-80`), per-keyframe `animation-timing-function` and
  `animation-composition` lift (`stylesheet.ts:299-336`), `!important`-in-keyframe
  drop per spec §3 (`stylesheet.ts:317-323`), and scroll-driven named selectors
  `entry`/`exit`/`cover`/`contain` (`stylesheet.ts:258-266`). This is meaningfully
  ahead of every JS animation lib's @keyframes reader. **Do not churn it.**

- **The `linear()` kf-consume half (E.W7 S5) is exemplary.** `getTimingFunction`
  (`utils.ts:148-201`) is a complete CSS Easing L1 reader plus the L2 `linear()`
  branch: `CUBIC_BEZIER_LITERAL`/`STEPS_LITERAL`/`step-start`/`step-end`
  (`utils.ts:80-87,159-181`) and `LINEAR_LITERAL` → `parseLinearStops` →
  `cssLinear` (`utils.ts:96-130,190-194`). The fail-soft fall-through is correct
  (returns `undefined`, the setter throws / `fromString` inherits). The
  `parseLinearStops` two-input flat-segment handling (`:118-127`) is spec-faithful
  and the "never a silent wrong curve" contract (`:106` docstring + the
  `>= 2` guard `:129`) is honest. Locked by `engine-correctness.test.ts:139-153`
  with a real BITE (probes t=0.25 where `linear` and `easeInOutCubic` diverge).
  **ALREADY-SOTA.**

- **The lenient-parse / fail-explicit-API split is correct.** `fromString` keeps
  parsing LENIENT — an unrecognised per-keyframe timing function inherits rather
  than throws (`engine.ts:1083-1096`); the typed `AnimationOptionError` is
  reserved for the explicit setter/`addFrame` path. This is the right CSS-is-a-
  forgiving-language posture. **ALREADY-SOTA.**

- **`@property` registration (D-LIB-1) is feature-detected and idiomatic.**
  `registerProperties` (`engine.ts:1125-1156`) guards `CSS.registerProperty`,
  skips `syntax == null`, and swallows the per-name `InvalidModificationError`
  from the process-wide registry — exactly the Baseline-2024-07 shape. **SOTA.**

- **Parse-cache hygiene.** `fromString` clones the memoized frame before mutation
  (`engine.ts:1076-1082`) and `parseAndFlattenObject` keeps its own
  `tryParseCache` keyed `childKey:value` (`utils.ts:203,240-243,267`) — locked by
  `equivalence.test.ts:19-66` ("does not corrupt the memoized parse cache").
  E's `tryParseCache`-eviction withhold (FINAL.md §Recorded-WITHHELD) re-measured
  below (F-5); the small-working-set call holds.

---

## §1. The findings (F-scope: kf-side consumption seam)

### F-1 · The serializer drops per-keyframe timing functions — round-trip is ASYMMETRIC — **SHIP-in-F** (HIGH)

- **file:line.** `fromString` READS per-keyframe `animation-timing-function`
  (`engine.ts:1089-1096`) and stores it per-frame: `addFrame(...,
  resolvedFn ? { fn } : undefined)` → `FrameCompiler.addFrame` writes
  `templateFrame.timingFunction` (`frame-compiler.ts:150-155`), and the type
  carries it (`constants.ts:80` `TemplateAnimationFrame.timingFunction?: Easing`).
  But `CSSKeyframesToString` (`format.ts:105-151`) iterates
  `animation.templateFrames` (`:117`) reading ONLY `templateFrame.start` (`:118`)
  and the sampled vars — it **never reads `templateFrame.timingFunction`**, and
  the only `animation-timing-function` it emits is the single animation-level one
  in `animationOptionsToString` (`format.ts:65-76`).
- **Consequence.** Parse a multi-stop animation with distinct per-keyframe easings
  (`0% { … animation-timing-function: ease-in } 50% { … animation-timing-function:
  linear(0,1) }`), serialize it, re-parse it → every stop now inherits the one
  animation-level curve. The per-stop curves are silently lost. The round-trip the
  `format.test.ts:46-67` tests assert ("same frame count", "preserves property
  names") does NOT cover timing fidelity — so the gap is untested *and* unlocked.
- **Why SHIP (not handoff).** Entirely kf-side; the data is already on the
  template frame the serializer is already iterating. The serializer would emit a
  per-keyframe `animation-timing-function` whenever `templateFrame.timingFunction`
  differs from the animation default — using the SAME `Easing.css`-faithful /
  registry-reverse-lookup logic already in `animationOptionsToString:65-74`
  (factor it into a `serializeEasing(easing)` helper, reuse at both altitudes).
- **Isomorphism.** Befitting + STRICTLY more correct: a value that currently
  round-trips WRONG starts round-tripping right. No existing-correct output
  regresses (a uniform-easing animation emits nothing per-keyframe, byte-stable).
  Gate: extend `format.test.ts` with a per-keyframe-easing round-trip that asserts
  the re-parsed frame curves match — it BITES today.

### F-2 · `animation-composition` is parsed by value.js but the adapter drops it — **SHIP-in-F** (MED, with a BOOK seam)

- **file:line.** value.js lifts per-keyframe composition: `liftKeyframeMetadata`
  → `rule.composition: "replace" | "add" | "accumulate"` (`stylesheet.ts:304,
  327-333,349-353`) and `extractAnimationOptions` recognises the style-rule
  longhand → `options.composition` (`extract.ts:162-168`). kf's `ResolvedKeyframes`
  interface (`adapter.ts:18-31`) carries **neither** — `resolveKeyframes` reads
  `rule.timingFunction` (`:112-114`) but never `rule.composition`, and the
  `options` it returns is `extractAnimationOptions(...)` whose `.composition` is
  also dropped. grep `composition` across `src/animation/*.ts` finds only
  unrelated comments (`drag.ts`/`group.ts`/`flip.ts`) — the AnimationGroup's
  blend modes (`replace`/`add`/`weighted`, the layer compositor) are a SEPARATE
  axis and do NOT consume the parsed keyframe `composition`.
- **Consequence.** An author writing the spec'd CSS Animations L2
  `animation-composition: add` gets it parsed and then silently ignored — the
  WAAPI path (which natively honours `composite`) and the rAF path diverge from
  the authored intent.
- **Disposition split.** The *adapter capture* — adding `composition` to
  `ResolvedKeyframes` and surfacing it — is a clean SHIP (read what value.js
  already gives). The *engine honouring* it (mapping keyframe `composition` →
  WAAPI `KeyframeEffect.composite` and an rAF-side accumulate) is a deeper
  behaviour change that touches the interpolation accumulate semantics — **BOOK**
  that as its own scoped item; do NOT half-wire it. SHIP the capture + a queryable
  field now so the data stops being thrown away; BOOK the honouring.
- **Isomorphism.** Capture is additive/inert (new field, no behaviour change).
  The honouring is a NAMED behaviour change → its BOOK entry carries the gate.

### F-3 · `resolveKeyframes.options` (style-rule `animation` shorthand/longhands) is computed then NEVER consumed — **SHIP-in-F** (MED)

- **file:line.** `resolveKeyframes` computes `options: extractAnimationOptions(ast)`
  (`adapter.ts:121`) and the `ResolvedKeyframes.options` field documents it
  recovers duration/easing/direction from a sibling style rule's `animation`
  shorthand/longhands (`adapter.ts:25-30`). But `fromString` reads only
  `resolved.properties` (`:1073`), `resolved.keyframes` (`:1075`) and
  `resolved.timingFunctions` (`:1089`) — grep `resolved.options` in `engine.ts`
  → **zero hits**. `extractAnimationOptions` walks every top-level style rule and
  builds a full `CSSAnimationOptions` (`value.js extract.ts:189-200`,
  duration/delay/iterationCount/direction/fillMode/timingFunction/composition) —
  all discarded.
- **Consequence.** `new CSSKeyframesAnimation({}, el).fromString('.foo { animation:
  2s ease-in-out infinite alternate; } @keyframes foo { … }')` runs at the 1000ms
  default, easeInOutCubic, 1 iteration — the authored `animation` shorthand is
  parsed and ignored. The dead `options` field is also a maintenance lie (a typed
  surface a consumer reasonably assumes is wired).
- **Why SHIP.** kf-side; the value is already on `resolved.options`. Apply it as
  the base for the animation's options BEFORE the per-keyframe loop, with the
  constructor `options` arg overriding (constructor-explicit wins over
  parsed-from-CSS) — `setOptions(merge(resolved.options, ctorOptions))`. The
  `timingFunction` string flows through `getTimingFunction` (the same path that
  already handles the per-keyframe case), so `linear()`/`cubic-bezier()` in the
  shorthand resolve for free.
- **Isomorphism.** Behaviour change at one input shape (CSS that carries a style
  rule) — befitting (it makes the documented field do what it says) and NAMED.
  Inputs with no sibling style rule are byte-identical (`extractAnimationOptions`
  returns `{}`). Gate: a `fromString` test asserting the shorthand duration/easing
  takes effect, and that an explicit ctor option still overrides it.

### F-4 · Scroll-named selectors (`entry`/`exit`/`cover`/`contain`) silently collapse to 0% — **BOOK** (correctness hole; crosses E.W9 ScrollTimeline)

- **file:line.** `formatSelectorPercent` surfaces a non-percent selector as its
  literal NAME string (`adapter.ts:44-57`, the `else` branch `out.push(sel.name)`).
  That name flows to `addFrame(percent=…name…)` → `FrameCompiler.addFrame` →
  `parseCSSValueUnit(start)` (`frame-compiler.ts:143`) → `convertFrameStart`
  (`:112-127`): a bare keyword like `"entry"` parses to a `ValueUnit` with no
  numeric value, the unit branch (`:113-122`) writes
  `(NaN/duration)*100`, and `clamp(NaN, 0, 100)` (`:125`) → **0**. So every named
  scroll stop silently becomes 0% — not an error, not a ScrollTimeline range.
- **Consequence.** value.js correctly parses the CSS-Scroll-Snap-L1 named ranges;
  kf swallows them into a degenerate 0% frame. An author using the scroll-driven
  named-range syntax gets a broken animation with no diagnostic. The adapter
  comment (`:51` "aren't yet wired into the animation engine; surface them as
  their literal name for the consumer to handle") acknowledges this — but the
  literal name does NOT survive to the consumer; it's eaten by `convertFrameStart`.
- **Why BOOK (not SHIP).** The right fix is to WIRE named ranges to the
  `ScrollTimeline` range model E.W9 shipped (the native ScrollTimeline bridge +
  the JS `ScrollTimeline` sampler) — a real feature, not a one-liner. The
  interim-correct move is a fail-loud reject (drop the frame with a diagnostic
  rather than a silent 0%). BOOK the wiring; the diagnostics-reject could ride F
  as a small guard if a wave has room, but the architecturally-right home is the
  ScrollTimeline graduation. Cross-ref the E.W9 native-ScrollTimeline lane and the
  F scroll/VT lane (`docs/tranches/F/audit/r-scroll-vt-2026.md`).

### F-5 · `tryParseCache` is unbounded — re-measured E withhold, still RECORD-withheld — **RECORD**

- **file:line.** `utils.ts:203` `const tryParseCache = new Map<string,
  ValueArray>()` — module-level, never evicted, keyed `childKey:strValue`
  (`:240`). E recorded the eviction as measure-first WITHHELD (FINAL.md §Recorded-
  WITHHELD: "a small working set; an LRU would be speculative complexity").
- **Re-measure.** The working set is the distinct `(subProperty, value-string)`
  pairs across all `fromString`/`addFrame` calls in a process. For the demo and
  any fixed animation library this is bounded by the CSS authored, not by time —
  it does not grow per-frame (the per-frame hot path is `iv._lerp`, never
  `parseAndFlattenObject`). The one unbounded driver is an EDITOR generating fresh
  CSS per keystroke (each distinct value string is a new key). That mirrors the
  value.js handoff F3 ("bounded LRU memo … editor per-keystroke generated CSS")
  — i.e. the unbounded-memo hazard is REAL but its terminal home is the value.js
  result-cache layer, not this kf-local mirror. **Disposition: RECORD** — the
  withhold holds for the library/demo; if a bounded LRU lands, land it once in
  value.js (the handoff already names it) and let this local cache inherit the
  pattern, rather than growing a second eviction policy here. No F write.

### F-6 · `linear()` PARSER (value.js E1) — the one genuine value.js piece — **value.js-HANDOFF** (carry forward, unchanged)

- **Status (re-grounded live).** The consumed `@mkbabb/value.js@^0.10.0`
  (`package.json:76`, installed `node_modules/@mkbabb/value.js@0.10.0`) ships
  `cssLinear` (the evaluator) + the `LinearStop` shape (`value.js easing.ts:33,28`)
  but **no parser** that turns the CSS string `linear(0, 0.5 25%, 1)` into
  `LinearStop[]` — grep `parseLinear`/`linearStops` in the installed dist → empty;
  the only `linear` parser hits are gradient stops (`value.js parsing/index.ts:127-
  207`). So `linear()` appearing in `@keyframes` reaches kf as a RAW STRING via
  `rule.timingFunction = d.value.toString().trim()` (`value.js stylesheet.ts:322`)
  → `resolved.timingFunctions` → kf's own `LINEAR_LITERAL`/`parseLinearStops`
  (utils.ts) does the structuring. **The seam works today** precisely because kf
  re-implemented the parse on its side (E.W7 S5).
- **Why it stays a handoff.** The kf-side `parseLinearStops` is a faithful but
  DUPLICATE of the parser value.js should own (E1 in `valuejs-sota-handoff.md`
  Wave E1). The SOTA-correct end state is: value.js parses `linear()` into
  `LinearStop[]` at the value-grammar level (so `parseCSSValue("linear(…)")` and
  any property carrying it structures uniformly), kf's `getTimingFunction` then
  consumes the structured stops instead of re-regexing the string. Until value.js
  ships E1, kf's `LINEAR_LITERAL` branch is the correct bridge — keep it. This is
  the inv-16 hand-off, already charted; F re-confirms it is still open at 0.10.0
  and adds the cross-repo note that the kf-side `parseLinearStops` is the
  duplicate to RETIRE when E1 lands (a paired FOLD, not a new write).
- **Spec/Baseline.** `linear()` is Baseline 2023-12-11 (modern-web-guidance
  `physics-based-easing`, featuresUsed "linear() easing"; Chrome/Edge 113, FF 112,
  Safari 17.2). No feature-detection needed for the PARSE (it's pure string→stops);
  the emit side already guards (WAAPI `Easing.css`). **value.js-HANDOFF (E1).**

### F-7 · `from`/`to`/bare-number selectors + multi-keyframes — **ALREADY-SOTA / KILL any work**

- value.js handles `from`→0% / `to`→100% (`stylesheet.ts:268-272`), bare-number
  authoring-tool selectors (`:274-278`), and multi-`@keyframes` (`extractKeyframes`
  groups by name, `extract.ts:34-49`). kf's `pickKeyframes` (`adapter.ts:65-71`)
  deliberately takes the FIRST named block (documented `:59-64`: "the legacy
  `fromString` interface assumed one; … call `parseCSSStylesheet` directly if you
  need the full set"). This is a reasonable, documented boundary — a single
  `CSSKeyframesAnimation` IS one animation. Multi-animation orchestration is the
  AnimationGroup/`sequence`/`animate` tier's job (E.W10), fed by separate
  `fromString` calls. **No gap. KILL any proposal to make `fromString`
  multi-animation** — it would muddy the one-animation contract; the
  `parseCSSStylesheet` escape hatch is the right seam.

---

## §2. Disposition summary

| # | Finding | file:line | Disposition |
|---|---------|-----------|-------------|
| F-1 | Serializer drops per-keyframe timing — asymmetric round-trip | `format.ts:105-151` vs `engine.ts:1089-1096` + `constants.ts:80` | **SHIP-in-F** (HIGH) |
| F-2 | `animation-composition` parsed, dropped by adapter | `adapter.ts:18-31,112-121` vs `value.js stylesheet.ts:327-333` | **SHIP-in-F** (capture) + **BOOK** (engine honouring) |
| F-3 | `resolveKeyframes.options` computed then never consumed | `adapter.ts:121` vs `engine.ts:1072-1097` | **SHIP-in-F** (MED) |
| F-4 | Scroll-named selectors collapse to 0% silently | `adapter.ts:44-57` → `frame-compiler.ts:112-125` | **BOOK** (wire to E.W9 ScrollTimeline; interim fail-loud) |
| F-5 | `tryParseCache` unbounded | `utils.ts:203` | **RECORD** (withhold holds; eviction belongs in value.js) |
| F-6 | `linear()` PARSER (kf-side dup of E1) | `utils.ts:96-130` ; `value.js easing.ts:33` | **value.js-HANDOFF** (E1; retire kf dup when it lands) |
| F-7 | `from`/`to`/bare-number/multi-keyframes | `value.js stylesheet.ts:268-278` ; `adapter.ts:65-71` | **ALREADY-SOTA / KILL** |

**The F parsing-scope, stated plainly.** The grammar is value.js's and is SOTA
(§0). The kf-side parsing F-scope is the **adapter consumption seam**: three
parsed-but-dropped features (F-2 composition, F-3 options, F-4 named selectors)
and one **asymmetric serializer** (F-1). F-1/F-2-capture/F-3 are clean SHIPs —
each reads data value.js already hands over or the template frame already holds,
and each closes a silent-data-loss hole. F-4 is a BOOK (its right home is the
E.W9 ScrollTimeline). F-6 (the `linear()` parser) is the one value.js-HANDOFF and
is already charted (E1) — F's only addition is the cross-repo note to retire kf's
duplicate `parseLinearStops` when E1 lands. No work is manufactured: the
`linear()` kf-consume half, the lenient-parse posture, `@property` registration,
and the broad selector grammar are ALREADY-SOTA and left untouched.

---

## Sources
- modern-web-guidance `physics-based-easing` (linear() easing, Baseline 2023-12-11).
- CSS Animations L2 — `animation-composition` (`replace`/`add`/`accumulate`).
- CSS Easing L2 — `linear()` stop-list grammar.
- value.js@0.10.0 live tree: `src/parsing/{stylesheet,extract,serialize}.ts`,
  `src/easing.ts` (cited file:line inline).
- Prior E audits diffed (NOT repeated): `audit/sota/a-vj-parser.md` (C1 linear
  parser, B2 grammar-broad), `audit/sota/d-vj-parse.md` (§5.1 linear),
  `valuejs-sota-handoff.md` (Wave E1, F3 bounded-LRU), `FINAL.md`
  (§Recorded-WITHHELD tryParseCache; W7 linear read-back; E.W9 ScrollTimeline).
