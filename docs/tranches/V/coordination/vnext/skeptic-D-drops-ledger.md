# SKEPTIC D (Fable seat) — the DROPS-LEDGER (panel-2, thrice-panel TWO)

Posture: every pruning destroyed something genuine until the record proves otherwise; classify
honestly. Read-only. Cites verified on disk today: value.js HEAD `91fa1368` (Tranche V, v4.0.0
producer), keyframes-v-exec HEAD `c2c8915f` (v6.0.0). Cut boundary = tag diffs of the PUBLIC
surface (export maps + subpath barrels + kf root/`./engine` roster) and the FILE census.

**One-line headline.** The pre-v4 era was ALL-ADDITIVE (the surface grew: R added okhsl/deltaE/
gamut-boundary, S added ICtCp/Jzazbz). The mass extinction is the **single v4 cut `164343c1`**
(Tranche V, 2026-07-16) — the "exact-seven immutable capability surface": it removed the root
barrel + `/parsing` + `/units`, flipped OO→functional, AND silently deleted ~15 shipped color
capabilities under the implicit "no audited consumer" rule. The owner's V-next prompt says exactly
this class ("consumer count is NOT enough") and names two of these drops (gamut mapping, the
measured parser) as unjust. keyframes.js lost almost nothing at the library level (its cuts are
NO-LEGACY alias hygiene + the R zone-refactor + one zombie deletion); its damage is INDIRECT —
value's v4 color drops forced a kf-local color/threshold duplication.

---

## PART A — value.js per-cut DROP tables

### Export-map timeline (git show `<tag>:package.json`)
| Cut | subpath keys | Δ |
|---|---|---|
| 0.1.0 (`pre-modernization`) | `.` only | single-file origin |
| 0.16.0 → 3.1.0 | `.`,`/color`,`/parsing`,`/math`,`/easing`,`/transform`,`/units`,`/quantize` | **STABLE across 1.0/2.0/3.0** — subpath-level surface unchanged; drops in this era are symbol-level only |
| **v4.0.0** | `/color`,`/value`,`/css`,`/easing`,`/math`,`/transform`,`/quantize` | **`.` root REMOVED · `/parsing`→`/css` · `/units`→`/value`** |

### A1. pre-v4 symbol drops (only two real prunings in the whole 0.x→3.1 era)
| Symbol/feature | did | why dropped (cite) | class |
|---|---|---|---|
| `buildColorChannelPlan`·`packColorChannels`·`lerpColorChannels`·`ColorChannelPlan` (`color-soa.ts`) | **SoA packed-color-channel batch interpolation** — the classic zero-alloc color-fold path | 3.0.0 CHANGELOG + R.W1 cut: "orphan API, phantom keyframes.js consumer, zero real consumers (Q3 EXCISE)". Public exports cut 3.0.0; the `color-soa.ts` FILE lingered to v3.1.0, deleted entirely at v4 (`v4.0.0` census: 0 files) | **UNCLEAR→UNJUST** — rationale was pure consumer-count; owner now demands "near-perfected zero-alloc color facilities for all spaces" and SoA channel-packing is the canonical vehicle. Re-litigate under the zero-alloc mandate. |
| `logerp(t,start,end)` → `logerp(start,end,t)` | arg reorder (not a drop) | 3.0.0 Q2 FLIP, match `lerp` | RIGHTLY (signature, capability intact) |
| `@mkbabb/value.js` self-dependency | forced stale nested self-install | 3.0.0 W0-9: harmful stale nested major | RIGHTLY |

### A2. THE v4 cut (`164343c1` + `7334c793` "exact-seven immutable capability surface") — COLOR
Baseline `v3.1.0:src/subpaths/color.ts` (≈70 value exports) vs `v4.0.0:src/subpaths/color.ts`
(23 exports). Verified GONE from source (`git grep <sym> HEAD src` = **0 files** for every row
below). Recorded rationale for these lives NOWHERE in the cut (see SILENT-DROPS).

| Symbol / family | what it did | recorded rationale | class |
|---|---|---|---|
| `gamutMapOKLabRaytrace` · `gamutMapSRGBRaytrace` | **raytrace EXACT-boundary gamut oracle** — the §13.2 reference twin, lands on the sRGB surface (`git 60bb64e9` S.W1-10 "the exact-boundary reference", agrees ΔE-OK<1e-3) | **NONE** in V docs (`raytrace` = 0 hits in `docs/tranches/V`) | **UNJUSTLY-DROPPED — owner's named seed** ("gamut mapping was a major loss"). Current `mapColorToGamut` (operations.ts) is a 32-iter hold-L&H chroma-reduction with NO deltaEOK / NO clip-vs-reduced (MINDE) / NO L-endpoint short-circuit — a §13.2 **simplification**, no reference oracle survives |
| `deltaEOK` · `deltaE2000` (14 Sharma vectors) · `deltaEITP` · `xyzToICtCp`/`ictcpToXYZ` explicit | perceptual color-difference metrics (built 2.0.0) | NONE in V docs (`deltaE2000`=0 hits in V) | **UNJUSTLY-DROPPED** — no successor; kf now re-derives a local oklab threshold (see C1). deltaEOK is the JND gate the gamut map needs |
| `mixColorsInto` · `color2Into` · `toRgba8Into` · `sampleGamutBoundaryInto` · `sampleOKLChSliceBoundaryInto` | **zero-alloc into-variant color ops** (out-buffer idiom) | Partial: **D54 SCI-1 → SHIP-4.1.x** restores `mixColorsInto`+`toRgba8Into` ONLY (~3,243 marks/frame atlas consumer, "mirroring the blessed `lerpArray` out-buffer idiom") | **UNJUSTLY-DROPPED — panel-1/skeptic-A seed.** Restore booked but UNDER-SCOPED: `color2Into`, `sampleGamutBoundaryInto`, and the 10³–10⁴-alloc gamut hot path (`mapColorToGamutInto`/`safeAccentColorInto`) are NOT covered |
| `mixColorsN` · `sampleColorRamp` · `sampleColorRampAt` (+`SampleRampOptions`) | **N-stop perceptual color-ramp sampler** — batch multi-stop interpolation | NONE in V docs (`sampleColorRamp`=0 hits in V) | **UNJUSTLY-DROPPED** — kf's compiler (`compile/emit/backward`) formerly sampled `oklab()` stops via value's `sampleColorRamp`; now falls back to per-pair `mixColors` + local densify. Owner's zero-alloc-batch mandate wants exactly this |
| `sampleGamutBoundary` · `sampleOKLChSliceBoundary` (+ `GamutBoundary*` types) | wide-RGB sRGB-excess contour / OKLCh L×C cusp polyline — gamut-VISUALIZATION data | Indirect: demo `SpectrumCanvas` gamut-truth overlay family "**terminally retired**, superseded by veil semantics" (`DECISIONS D46b`, ~−983 LoC) | **UNCLEAR→UNJUST** — the DEMO consumer was ruled retired, but the value-level PRIMITIVE was deleted silently, not tombstoned; owner's V-next puts frontend focus back on value.js gamut viz |
| `okhslToSrgb`/`srgbToOkhsl`/`okhsvToSrgb`/`srgbToOkhsv` | OKHSL/OKHSV perceptual color-PICKER spaces (built 2.0.0) | NONE in V docs (`okhsl`=0 hits in V) | **UNJUSTLY-DROPPED** — a picker primitive; owner wants SOTA color across all spaces |
| `rgb2ColorFilter` · `cssFiltersToString` | **CSS filter-chain recolor solver** (target color → `filter:` chain) | NONE anywhere in V | **UNCLEAR** — niche, no live consumer found; but a genuine capability with zero recorded death-rationale (process defect) |
| `contrastColor` · `wcagContrastRatio` · `wcagRelativeLuminance` · `needsContrastAdjustment` · `getOklchLightness` · `computeSafeAccent` · `safeAccentCssString` | WCAG contrast suite + CSS Color 5 `contrast-color()` leaf | Partial: `safeAccentColor` kept ("actual typed surface plus requested WCAG ratio", CONSUMER-CUT §2) | **UNCLEAR** — `contrast-color()` (a stabilized 2026 CSS feature) + the raw WCAG ratio/luminance helpers lost their public home; owner wants "total spec coverage" |
| 16 OO `Color`/`RGBColor`/`OKLCHColor`… classes | mutable class color model | **D17/D18** "disciplined final objects… removes subclass forest, SCCs, DOM coupling, facade duplication while preserving object ergonomics" | **RIGHTLY-DROPPED** (tombstone: paradigm shift OO→functional factories; capability preserved via `rgb()`/`oklch()`/`convertColor`) |
| `color2`→`convertColor`, `srgbToOKLab`/`oklabToRgb255`→`toRgba8`, matrix `transformMat3`… , all color CONSTANTS/white-points/ranges | dispatch + raw primitives + internal constants | CONSUMER-CUT §2 "final-object construction/conversion and sole byte projection; exact vectors retained, all raw/direct names deleted" | **RIGHTLY-DROPPED** (tombstone: rename/consolidation + internal-primitive hiding; vectors retained) |
| `COLOR_NAMES`/`registerColorNames`/custom-name registry | runtime color-name registry | folded into `/css` `parseCssColor` closed union | RIGHTLY (moved) |

### A3. THE v4 cut — PARSING (`/parsing` → `/css`)
Baseline `v3.1.0:src/subpaths/parsing.ts` vs `v4.0.0:src/subpaths/css.ts`.

| Symbol / family | what it did | recorded rationale | class |
|---|---|---|---|
| `evaluateMathFunction` | **calc()/math-function EVALUATOR** (AST → number) | NONE in V (`evaluateMathFunction`=12 hits but all pre-V archaeology) | **UNJUSTLY-DROPPED** — `foundation/math.ts` has bezier/lerp only, NO evaluator; W9 grammar PARSES `calc(1px+2px)` but the EVALUATE surface is gone. calc resolution is core (kf MEMORY: calc atomic → DOM resolve) |
| `parseSpring` · `lowerSpringEasing` (+`spring()`) | CSS `spring()` easing parse + linear() lowering | NONE (`parseSpring`=2 hits, pre-V) | **UNCLEAR→UNJUST** — value-level `spring()` syntax support deleted (`spring` at HEAD = only a named color). kf keeps physics `SpringProgress` but the CSS producer-grammar for `spring()` is gone |
| `serializeStylesheet` · `stylesheetToString` · `formatCSS` (Prettier wrapper) | full-document stylesheet SERIALIZER + pretty-print (parse↔serialize round-trip) | CONSUMER-CUT §2: `formatCSS`/`serializeStylesheetItem`/`reverseAnimationShorthand`/`reverseCSSTime` "move once to Keyframes-local `css-text.ts`" | **UNCLEAR** — `serializeStylesheetItem`/`reverseCSSTime` DID land in kf `compile/emit/css-text.ts` (verified). But `formatCSS` (Prettier) + full `stylesheetToString` document round-trip is NOT in the move manifest → the pretty-print round-trip capability narrowed with no successor named |
| `validateSyntax` · `parseSyntaxDescriptor` (+`SyntaxComponentName`) | `@property` `<syntax>` descriptor validator/parser | CONSUMER-CUT §2: only `coerceToSyntax` kept ("no second consumer validator") | **UNCLEAR** — the standalone `<syntax>` validator + descriptor parser (a 2026 `@property` feature) lost its public surface; `coerceToSyntax` is coercion, not validation |
| `parseAnimationShorthand` (forward) | `animation:` shorthand → structured | CONSUMER-CUT §2: absorbed into `collectAnimationOptions` ("structurally expands shorthand") | **RIGHTLY** (forward preserved under new name) |
| `reverseAnimationShorthand`·`reverseCSSTime`·`serializeStylesheetItem`·`reverseCSSIterationCount` | reverse serializers | moved to kf `compile/emit/css-text.ts` (verified on disk) | **RIGHTLY** (moved, not lost) |
| `parseCSSStylesheet`→`parseStylesheet`, `extract*`→`collect*`, `CSSColor`/`parseCSSColor`→`parseCssColor`, `parseCSSValueUnit`→`parseCssScalar`, `CSSValueUnit`/`CSSString`/`CSSFunction` grammar objects | parser renames + Result-ification | CONSUMER-CUT §2 full migration table; `ParseResult<T>` (CHANGELOG 4.0) | **RIGHTLY** (rename + fail-explicit; capability intact) |
| `istring`/`identifier`/`none`/`integer`/`number`/`succeed`/`fail`/`tryParse`/`parseResult` | re-exported parse-that combinators | consumers import parse-that directly | **RIGHTLY** (de-duplication) |

### A4. THE v4 cut — UNITS (`/units` → `/value`) + easing/math
`v3.1.0:src/subpaths/units.ts` (≈35 exports) vs `v4.0.0:src/subpaths/value.ts` (1 export: `isLayoutTrackingUnit`).

| Symbol / family | what it did | rationale | class |
|---|---|---|---|
| `flattenObject`·`unflattenObject`·`unflattenObjectToString` | nested-object ↔ flat-key (the calc/frame-pairing spine per kf MEMORY) | **D54 §C** `unflattenObject` DECLINE "concept deleted, zero survivors"; `flattenObject` (D-GAP-5) "**DECLINED—superseded**… two timeline callers consume compiler/typed-declaration output instead" | **RIGHTLY-DROPPED** (tombstone: superseded by typed compiler output; verified kf callers migrated) |
| `convertToPixels`·`convertToMs`·`convertToDegrees`·`convertToHz`·`convertToDPI`·`convertAbsoluteUnitToPixels`·`convert2` | unit CONVERSION (incl. container-query units cqw/cqi per kf MEMORY) | CONSUMER-CUT §2: `parseCSSTime`→"Keyframes-local explicit s/ms conversion"; "value moves the sole live computed-resolution mechanism into Keyframes" | **UNCLEAR** — DOM/computed-unit resolution intentionally moved to kf, BUT the pure numeric converters (deg/Hz/DPI) have no named successor; container-query-unit resolution home is unverified |
| `ValueUnit`/`FunctionValue`/`ValueArray` + all UNIT CONSTANTS + `STYLE_NAMES` | OO value model + data tables | **D18** functional kernel + kf-owned `InterpSlot`; CONSUMER-CUT §2 | **RIGHTLY-DROPPED** (tombstone: → immutable `CssValue`/`CssScalar`/`CssCall`; `isLayoutTrackingUnit` the one semantic classifier) |
| `cubicBezierToSVG` | bezier → SVG path | **D54 §I** DECLINE "unused whole-element helper" (reopens as 4.1 `sampleBezier` only on shared need) | **RIGHTLY** |
| `timingFunctions` aggregate · `timingFunctionDescriptions` | dynamic registry + display prose | CONSUMER-CUT §2: `easing(name)` Result replaces aggregate; prose → each consumer | **RIGHTLY** (fail-explicit lookup; prose colocated) |

---

## PART B — keyframes.js per-cut DROP tables
Export map stable (`.`+`./engine` since 5.1.0). Story = symbol drops + the R zone-refactor.

| Cut (tranche) | dropped | rationale (cite) | class |
|---|---|---|---|
| 4.4.0→**5.0.0** (Q) | `Animation` @deprecated alias of `KeyframesAnimation`; `ScrollTimeline`/`ScrollTimelineOptions` @deprecated aliases | index.ts prose + `docs/MIGRATION-5.0.0.md`: "DROPPED in 5.0.0 (Q.WE1 — **NO-LEGACY**)"; cleared `globalThis.ScrollTimeline` d.ts collision | **RIGHTLY** (alias hygiene) |
| 5.0.0→**5.1.0** (R) | flat `animation/*.ts` (≈40 files) → 7 zones; `loadEngine`/`loadCompiler`/`loadIngest` granular accessors + `EngineCore`/`CompilerSurface`/`IngestSurface` types EXCISED | R.W1 §2f "zero real call sites" (index.ts prose) | **RIGHTLY** (reorg + dead-accessor cut; capability via `loadAnimationEngine`) |
| 5.1.0→**5.2/5.3** (S) | `animate.ts` + `AnimateInput`/`AnimateOptions`/`KeyframeMap` (the standalone `animate()` fn) | `aed363ed` "S.C1: DELETE the animate.ts **zombie** cluster (T6)" | **RIGHTLY** (dead code; superseded by the class API) |
| 5.3.x→**6.0.0** (U/V) | value.js symbol consumption re-homed (see A3 moves); no kf capability lost | consume immutable value 4.0.0 | RIGHTLY (moves) |

**kf's real damage is INDIRECT (cross-repo).** value's v4 color drops (A2) landed on kf's compiler:
`compile/emit/backward/color.ts` now samples ramps via value's `mixColors` per-pair + a **LOCAL**
oklab-ΔE threshold — the stale docstring at `backward.ts:30,47` still names value's dropped
`sampleColorRamp`/`deltaEOK`. That is a **duplication born of the value drop** (kf re-derives what
value deleted), not a clean kf-owned decision. Restoring value's ramp/deltaEOK (A2) should
re-consolidate it.

---

## PART C — RESTORE candidate list (for UNJUSTLY-DROPPED rows)
Home = today's value.js tree (`src/color/`, `src/css/`, `src/foundation/`). No `subpaths/` shim
(owner: "subpaths/ … code smell supreme" — but it still EXISTS at HEAD).

| # | Restore | shape | lands in |
|---|---|---|---|
| R1 | **§13.2 MINDE gamut map + raytrace reference twin** (owner seed #1) | restore-**modernized**: `mapColorToGamut` gains deltaEOK + clip-vs-reduced + L≥100→white/L≤0→black short-circuit; raytrace as the WPT-gated exact oracle | `src/color/gamut.ts` (new leaf) + `operations.ts` |
| R2 | `deltaEOK`/`deltaE2000`/`deltaEITP` + ICtCp/Jzazbz transforms | restore-as-was (exact Sharma vectors survive in R docs) | `src/color/difference.ts` (new leaf) — kf compiler drops its local copy |
| R3 | zero-alloc **into-variants** (owner seed #2 / panel-1) | restore-as-new-primitive, EXTEND D54 SCI-1: add `color2Into`, `sampleGamutBoundaryInto`, **`mapColorToGamutInto`/`safeAccentColorInto`** (the 10³–10⁴-alloc hot path) | `src/color/operations.ts` (mirror `lerpArray` out-buffer) |
| R4 | **N-stop ramp** `sampleColorRamp`/`mixColorsN`/`sampleColorRampAt` | restore-modernized (SoA-backed → satisfies the zero-alloc-batch mandate) | `src/color/ramp.ts`; kf `compile/emit/backward` consumes it |
| R5 | SoA packed-color-channel fold (`color-soa` capability) | restore-as-new-primitive under the zero-alloc mandate (re-litigate the 3.0.0 consumer-count excision) | `src/color/` |
| R6 | OKHSL/OKHSV pickers | restore-as-was | `src/color/operations.ts` |
| R7 | `evaluateMathFunction` (calc EVALUATOR) | restore-modernized over the W9 calc AST | `src/css/` (grammar-adjacent) |
| R8 | WCAG `contrast-color()` + raw `wcagContrastRatio`/`wcagRelativeLuminance` | restore-as-was (2026 CSS Color 5) | `src/color/operations.ts` |
| R9 | gamut-boundary contour samplers | restore-as-new-primitive IFF the demo gamut-viz is rebuilt on value.js (owner's frontend focus) | `src/color/gamut.ts` |
| R10 | `spring()` CSS easing parse/lowering | restore in grammar; decide value-owns vs kf-physics-owns | `src/css/grammar.ts` / `src/easing.ts` |
| R11 (low) | CSS filter-chain recolor solver | restore-as-was only on a named consumer | `src/color/filter.ts` |

---

## PART D — SILENT DROPS (most dangerous — no tranche row, no CHANGELOG line; diff-only)
The v4 CHANGELOG enumerates the STRUCTURAL breaks (root/`/parsing`/`/units` removed, OO→functional,
`Result` types) and CONSUMER-CUT §2 tables the RENAMES. **Neither enumerates a single one of the
~15 color/parser capability DELETIONS.** They fell out under the unstated "no audited consumer"
rule — the exact rule the owner's V-next voids ("consumer count is NOT enough"). Proof: in
`docs/tranches/V/**`, `raytrace`/`okhsl`/`colorFilter`/`sampleColorRamp`/`mixColorsN`/`deltaE2000`
= **0 hits each** (all documented in R/S where BUILT, invisible in V where KILLED — the silent-drop
signature). Flagged loudly:

1. **raytrace gamut oracle** (`gamutMapOKLabRaytrace`/`SRGBRaytrace`) — silent; owner seed. LOUDEST.
2. **perceptual ΔE metrics** (`deltaEOK`/`deltaE2000`/`deltaEITP`) — silent; forced kf duplication.
3. **N-stop ramp** (`sampleColorRamp`/`mixColorsN`) — silent; broke kf's batch color-compile path.
4. **OKHSL/OKHSV** pickers — silent.
5. **CSS filter solver** (`rgb2ColorFilter`/`cssFiltersToString`) — silent, zero rationale anywhere.
6. **`evaluateMathFunction`** (calc evaluator) — silent; parse-without-evaluate gap.
7. **gamut-boundary samplers** (`sampleGamutBoundary`/`sampleOKLChSliceBoundary`) — value primitive
   deleted silently even though only the DEMO consumer (SpectrumCanvas) got a D46b tombstone.
8. **`spring()` parse + `contrast-color()`/WCAG helpers** — silent narrowing of 2026-CSS coverage.
9. **`gamutMapOKLabRaytrace` bench (`bench/gamut-boundary.mjs`)** deleted in the same commit — the
   measurement that could defend/refute the simplification died with the capability.

Process defect (name it): **no capability-preservation gate on major rewrites** (skeptic-A concurs).
A "green consumer compile" gate cannot see a capability that had no first-party consumer at cut time.

---

## PART E — keyframes.js regex-census (addendum §1: PARSING sites = text→value, not string utils)
| Site | parses | regex? | successor class |
|---|---|---|---|
| `src/animation/easing.ts:30` `CSS_NATIVE_KEYWORD=/^(linear\|ease\|ease-in\|ease-out\|ease-in-out)$/` | classifies easing string: CSS-native → pass verbatim vs kf-registry | **REGEX** | **consume value `parseTimingFunction`** as oracle (skeptic-A R5) — or state the hot-path perf reason to keep a local table-driven classifier (NOT a fresh regex) |
| `src/animation/easing.ts:39` `CSS_FUNCTION_EASING=/^(cubic-bezier(\|steps(\|linear(\|step-start$\|step-end$)/` | same, function-form easings | **REGEX** | same — duplicates value's `grammar.ts:438,444,453,466` name table |
| `src/animation/compile/emit/easing-serialize.ts:20` `/^(linear\|ease\|…\|step-start\|step-end)$/` | SERIALIZE-side: is this value CSS-native → emit verbatim | **REGEX** | **dedupe** — share ONE name-table with `easing.ts` (currently a THIRD copy of the same set); consume value classifier |
| `src/animation/scroll/grammar.ts` | (misnamed) | **NO regex, NO productions** | pure value.js consume-adapter → **rename** for filename honesty (skeptic-A G2/R5); NOT a parser |
| `src/animation/ingest/**` | CSSOM object walk | none | PASS — reads live CSSOM objects, no text parse |
| `src/animation/resolve/**` | interpolation | none | PASS |
| `src/animation/engine/options.ts` | s/ms time (sole `parseCssScalar` consumer, CONSUMER-CUT §2) | none | PASS — delegates to value `parseCssScalar` + explicit s/ms |
| `compile/emit/{css-text,format,backward,walk,view-transition}.ts` | value→string (`.split`/`.replace` formatting) | regex-for-format | OUT OF SCOPE — SERIALIZERS, not text→value parsers |

**Census headline:** keyframes.js does **essentially ZERO text-parsing** — every real CSS parse
delegates to value.js/`css`. The ONLY regex "parse" sites are the **easing NAME-TABLE classifiers**
(`easing.ts` ×2 + `easing-serialize.ts` ×1 = THREE copies of the CSS-native easing set), a
duplication of value's `parseTimingFunction`. The owner's "abrogate regex parsing in kf" reduces to
one decision: consume value's timing-function classifier vs keep ONE deduped local table-dispatch
for the hot path. No byte-scanner/parse-that contest exists on the kf side.

---

## 10-LINE SUMMARY
1. **The whole drops archaeology is ONE cut**: value.js v4 `164343c1` (Tranche V) — pre-v4 was all-additive; v6.0.0 kf lost only aliases + a zombie.
2. **Biggest unjust loss #1 (owner seed): the §13.2/raytrace gamut oracle** — `gamutMapOKLab/SRGBRaytrace` + deltaEOK deleted; current `mapColorToGamut` is a hold-L&H chroma-reduction with no MINDE, no ΔE, no reference twin.
3. **Biggest unjust loss #2 (panel-1 seed): zero-alloc into-variants** — deleted; D54 SCI-1 restores only `mixColorsInto`+`toRgba8Into`, leaving `color2Into`/`sampleGamutBoundaryInto`/the 10³–10⁴-alloc gamut hot path uncovered.
4. **Biggest unjust loss #3: the N-stop ramp + ΔE metrics** — `sampleColorRamp`/`mixColorsN`/`deltaEOK`/`deltaE2000`/`deltaEITP` deleted; kf's compiler had to re-derive a local oklab threshold (duplication born of the drop).
5. **Also unjustly/unclear-dropped**: OKHSL/OKHSV pickers, `evaluateMathFunction` (calc evaluator — parse survives, evaluate gone), `spring()` parser, `contrast-color()`+WCAG helpers, gamut-boundary samplers, CSS filter solver, the SoA color-channel fold (3.0.0, re-litigate under zero-alloc).
6. **Biggest SILENT drops**: ~15 color capabilities deleted at v4 with ZERO tranche-V doc mention (raytrace/okhsl/colorFilter/sampleColorRamp/mixColorsN/deltaE2000 all = 0 hits in `docs/tranches/V`) — documented in R/S where built, invisible where killed.
7. **Root-cause process defect**: no capability-preservation gate on major rewrites; the v4 "green-consumer-compile" gate is blind to capabilities that had no first-party consumer — the exact class the owner's V-next voids ("consumer count is NOT enough").
8. **Rightly-dropped (tombstoned, never re-litigate)**: OO Color/ValueUnit classes → functional (D17/D18), legacy `Animation`/`ScrollTimeline` aliases (NO-LEGACY), `animate.ts` zombie, `flattenObject`/`unflattenObject`/`cubicBezierToSVG`/`timingFunctions`-aggregate (D54), parse-that combinator re-exports.
9. **kf regex-census headline**: kf does essentially NO text parsing (all CSS → value.js); the only regex parse sites are THREE copies of the CSS-native easing name-table (`easing.ts` ×2 + `easing-serialize.ts` ×1) — successor = consume value's `parseTimingFunction` or keep ONE deduped table-dispatch. No byte-scanner-vs-parse-that contest exists kf-side.
10. **RESTORE priority for V-next**: R1 (MINDE+raytrace gamut) → R3 (into-variants, extend SCI-1) → R2/R4 (ΔE + N-ramp, kill the kf duplication) → R6/R7 (OKHSL, calc-eval); all land in `src/color/`+`src/css/`, no `subpaths/` shim.
</content>
</invoke>
