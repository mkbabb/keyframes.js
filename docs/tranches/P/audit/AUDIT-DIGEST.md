# Tranche P — the 32-lane TRIUMVIRATE optimization audit (DIGEST)

> 32 agents (Sonnet/Opus), batches of 3, ~3.8M tokens, 2026-06-20. 297 findings (12 BLOCKER/74 HIGH) + 172 novel ideas (29 radical/65 aggressive). The aggressive-optimization + frontend-design-fleet pass.

## V1-perf-frontier

value.js's +23-30% SOTA floor rests on two real wins: scanIdentFast/scanNumberFast byte-loop scanners (parsing/utils.ts:48-129) and a first-char dispatch() LUT (parsing/index.ts:425-444). The ground-truth's "NO bench/" precondition is FALSE — value.js has 9 bench files, a portable JSON.parse-ratio gate (proof-perf-target.mjs), and a deterministic gamut-alloc gate; the perf infrastructure exists and is the right foundation to challenge. The richest untapped frontier is the color hot path: gamut still allocates ~84 Color objects/call (O.W3 only got 104->84, and the color2Into out-param that closes it is explicitly DEFERRED at dispatch.ts:245), and Color is a per-instance AoS class with string-keyed channel access driving megamorphic reads in interpolation loops. The parser frontier is a codegen-specialized CSS parser consuming parse-that's RETAINED SpanParser tagged-union (span.ts:549, kept expressly as the BBNF codegen foundation) plus a two-char/value-dispatch widening — but the SpanParser runtime-dispatch and SIMD-on-V8 arms are already falsified, so every idea below carries that tempting-but-wrong guard explicitly.

**Critical findings:**

- **[HIGH·deferred]** Gamut hot path still allocates ~84 Color/call — the color2Into out-param that closes it is explicitly deferred
  - _ev:_ dispatch.ts:245 'eliminating it requires a `color2Into` out-param (deferred, O.W5 scope)'; proof-gamut-alloc.mjs:25 'residual ~84 are the per-step color2 XYZ-hub conversion intermediates'; xyz-extende
  - _→_ This is the single largest remaining GC win on the rAF wide-gamut egress path and the matrix layer ALREADY proves the scratch pattern (matrix.ts:34 transformMat

**Novel ideas:**

- [aggressive·perf] **V1-N1: color2Into — out-param conversion that writes channels into a caller-owned scratch Color, collapsing the gamut bisection from ~84 all**
  - _mech:_ Mirror the proven matrix.ts:34 transformMat3Into scratch pattern up one level. Add `color2Into(src, to, out)` that writes r/g/b (or l/c/h) into a reused `out` Color instead of `return new XYZColor(...
  - _payoff:_ ~84 -> <12 allocs/call on the wide-gamut rAF egress — the dominant per-frame GC pressure for P3/rec2020 color animation. · _feas:_ HIGH. The scratch+single-threaded-reentrancy argument is already documented and accepted (dispatch.ts:226). TEMPTING-BUT-WRONG: do
  - _gate:_ Born-RED: tighten proof-gamut-alloc.mjs C2 from N_TARGET=90 to N_TARGET=15 over the BUILT dist/subpaths/color.js constru
- [radical·codegen] **V1-N2: a generated, closure-free CSS-value parser (BBNF codegen) that consumes parse-that's retained SpanParser as its IR, emitting one mono**
  - _mech:_ Walk the SpanParser tagged-union data structure (span.ts:599 SpanParser type — flat, no captured closures, retained EXPRESSLY for this) and emit a single specialized JS function for the CSS @keyframes
  - _payoff:_ future-research §11 targets closing the BBNF-vs-hand-rolled gap to 0.75-0.85x; a value-grammar-specialized emit could ma · _feas:_ MED, high effort. Born-RED-gated against the engine reality: §7 falsified the *recursive runtime switch* on V8 — codegen must emit
  - _gate:_ Born-RED: a new bench scenario in css-parse-perf.mjs running the CODEGEN parser over VALUE_CORPUS, gated in proof-perf-t
- [aggressive·perf] **V1-N3: a typed Float64 channel view over Color for internal interp/conversion loops — SoA-adjacent without breaking the public AoS shape**
  - _mech:_ Give each Color an optional packed `_ch: Float64Array` (r,g,b,alpha) lazily materialized, and have interpolate.ts:117 lerpColorValue + the conversion converters read/write `_ch[i]` instead of `color[k
  - _payoff:_ Eliminates string-keyed megamorphic property reads in the per-frame color interp + the per-conversion channel destructur · _feas:_ MED. TEMPTING-BUT-WRONG: do NOT replace the named fields (the [key:string]:any index signature is KEEP-documented at index.ts:264 
  - _gate:_ Born-RED: bench/color-channel-access.mjs + color-interp.mjs gated in a new proof clause asserting the Float64-view inter
- [incremental·perf] **V1-N4: widen dispatch() to a 2-char (length+second-byte) discriminator to flatten the residual 3-4-deep any() buckets**
  - _mech:_ The 'c','r','s' buckets still run any(fnMath,fnGradient,fnCubicBezier,fnGeneric)-style chains (parsing/index.ts:416-419) — first-char dispatch only halved the megamorphism. Add a second-level discrimi
  - _payoff:_ Removes the residual sequential-closure trials on the hottest function-name buckets — the part of the dispatch() win tha · _feas:_ HIGH, low-risk, additive over the existing dispatch() primitive (parse-that/leaf.ts:60). IDENTICAL-RESULT discipline already docum
  - _gate:_ Born-RED: extend bench/parser-namelookup.mjs with a 2nd-char-collision corpus (calc/clamp/cos/conic), gate the value-par
- [radical·perf] **V1-N5: a WASM hot-scanner for the stylesheet ingest path (the one place a different engine can legitimately beat V8's closure dispatch)**
  - _mech:_ Compile the byte-level ident/number/whitespace/string scanners (the scanIdentFast/scanNumberFast family, parsing/utils.ts:48) to a tiny WASM module operating over a shared ArrayBuffer view of the inpu
  - _payoff:_ future-research §15 cites 20-40% on string-heavy inputs via SIMD — only reachable in WASM (V8 JS has no portable SIMD).  · _feas:_ LOW-MED, high effort + a real risk it LOSES. TEMPTING-BUT-WRONG: the WASM<->JS boundary + string-encoding copy can erase the scan 
  - _gate:_ Born-RED: a new bench scenario parsing a >50KB synthetic stylesheet through the WASM scanner vs the current TS scanners,

**Recs:** BUILD V1-N1 (color2Into) first — highest payoff, lowest risk, the born-RED gate already exists (proof-gamut-alloc, just tighten N_TARGET 90->15), the  · Correct the tranche brief: value.js DOES have bench/ (9 files) + proof-perf-target.mjs + proof-gamut-alloc.mjs. Do not author a 'create benchmarks' ta · Gate every parser-perf idea against the TWO prior falsifications (SpanParser switch-dispatch is slower on V8; SIMD-in-plain-JS is a non-starter). V1-N · Resolve the SpanParser P-inv-28 status: it is retained solely as the BBNF codegen foundation (span.ts:573). Either authorize V1-N2 (the codegen consum · Sequence V1-N3 (Float64 channel view) AFTER V1-N1 so the new internal scratch Colors inherit the packed view; keep both strictly internal — the public · Treat V1-N4 (2-char dispatch) as a quick high-confidence stacking win on top of the shipped dispatch() — it closes the residual megamorphism the first

---

## V2-arch-transpose

value.js's value model is a string-tagged mutable bag (ValueUnit: 6 positional ctor fields, a `[key:string]:any` Color index signature, two parallel container types FunctionValue/ValueArray with 18 instanceof branch sites) — sound and battle-hardened, but with three transposable seams: (1) a tuple-first color core that already exists in `gamut.ts` yet is wrapped in per-call Color allocations at the `color2` boundary (the named-deferred `color2Into` terminal); (2) a flatLeaf-first provenance model that VJ-L1 already wants and that would let the leaf ValueUnit be the canonical shape rather than a flatten side-effect; (3) a BBNF grammar that sits as spec-only documentation, never the runtime source of truth — a real codegen-or-delete fork. NO-legacy audit is largely clean: the "legacy" hits are CSS-spec color-family domain terms, not code rot; the only genuine code smell is the O(n²) no-op `FunctionValue` constructor forEach. The ground-truth "NO bench/ dir" claim is FALSE — 9 bench files exist, so every perf transposition below has a measurement substrate already.

**Critical findings:**

- **[HIGH·deferred]** VJ-L1 flatLeaf provenance is deferred — the FN_NAME Symbol sidechannel persists in the consumer
  - _ev:_ keyframes.js docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md:26 + :44-49 — kf carries S8, a `Symbol("kf.fnName")` stamped onto value.js ValueUnit instances and re-stamped after every clone() because `ValueUni
  - _→_ DISPATCHED to value.js Tranche P (kf already authored the dispatch). The deeper transposition: rather than bolt a 7th positional field onto an already-6-wide ct

**Novel ideas:**

- [aggressive·perf] **color2Into: a tuple/out-param color conversion core — push the zero-alloc tuple discipline that already exists in gamut.ts through the whole**
  - _mech:_ The math is ALREADY tuple-based: gamut.ts:247/283/313 (`gamutMapOKLab`, `srgbToOKLab`, `oklabToLinearSRGB`) return `[number,number,number]` allocation-free. The waste is the wrapper: color2() (dispatc
  - _payoff:_ Eliminates the residual O.W3 gap (84→~5 allocs/call on the wide-gamut egress path) and unlocks the same kernel for lerpC · _feas:_ HIGH for the kernel (math is proven correct in tuple form already; the conversion functions are pure). TEMPTING-BUT-WRONG risk (re
  - _gate:_ proof:gamut-alloc tightened: instrument Color constructor calls across a 600-frame display-p3 egress animation, assert a
- [radical·arch] **flatLeaf-first value model: make the leaf ValueUnit (with provenance) the canonical parsed shape, so flattenObject becomes a no-op projectio**
  - _mech:_ Today parsing builds a FunctionValue/ValueArray TREE (units/index.ts:164-309), then flattenObject (utils.ts:85-139) dissolves it to `{key: ValueArray<leaf>}` — DROPPING FunctionValue.name, which is ex
  - _payoff:_ Dissolves the entire S8 sidechannel class (kf's FN_NAME Symbol + re-stamp ceremony at utils.ts:64,289-294 vanishes — pro · _feas:_ MED — radical: the FunctionValue tree is the serialize source of truth (toString special-cases calc/if/linear/color at index.ts:19
  - _gate:_ proof:flatleaf-roundtrip — born-RED: parse a corpus of nested-function CSS (`transform: scale(2) translateX(calc(10px + 
- [incremental·arch] **Collapse ValueUnit's 6 positional ctor fields into value+unit+a single meta record — stop accreting provenance as positional args**
  - _mech:_ ValueUnit ctor (units/index.ts:26-33) is 6 positional optionals; clone()/coalesce()/normalizeNumericUnits re-thread all 6 by index (:120-130, :150-160; normalize.ts:432-449), and VJ-L1 wants a 7th — t
  - _payoff:_ clone/coalesce/normalize shrink to value+unit+one spread; VJ-L1's fnName becomes a meta-record field with zero ctor-sign · _feas:_ HIGH but BREAKING — ValueUnit is barrel-exported (index.ts:2) and the positional ctor is public surface, so this is a 5.0.0/major 
  - _gate:_ proof:valueunit-shape — assert `new ValueUnit(1,'px').meta === undefined` and `new ValueUnit(1,'px',{fnName:'scale'}).me
- [aggressive·codegen] **Resolve the BBNF grammar limbo: make it the codegen source (parse-that SpanParser as the codegen substrate) OR delete it — kill the spec-vs-**
  - _mech:_ css-values.bbnf/css-color.bbnf (src/parsing/grammars/) explicitly say `not yet wired to the runtime` (css-values.bbnf:6) — the hand-written units.ts parser table is the real source. Ground-truth: pars
  - _payoff:_ One grammar source of truth instead of two (the .bbnf and the hand-written combinators that silently drift); a unit adde · _feas:_ MED-LOW — depends on parse-that's BBNF codegen being mature enough to emit the exact combinator shapes units.ts hand-tunes (some h
  - _gate:_ proof:grammar-parity — born-RED: for every unit in constants.ts UNITS, assert the .bbnf-generated parser and the live pa
- [radical·arch] **Unified numeric value AST: one tagged-union Value node (scalar | dimension | color | fn | list) replacing the ValueUnit/FunctionValue/ValueA**
  - _mech:_ Three container classes (ValueUnit, FunctionValue, ValueArray — index.ts:16/164/269) with 18 instanceof branch sites force every consumer to type-test. A single `type Value = {kind:'scalar',n,unit?} |
  - _payoff:_ One traversal primitive, one clone, one provenance carrier; instanceof dispatch (18 sites) → a switch on a string litera · _feas:_ LOW/radical — this is a 1.x→2.0 rewrite touching every parser, serializer, and the kf consume-edge. TEMPTING-BUT-WRONG (the strong
  - _gate:_ proof:value-ast-dispatch — a born-RED bench gate: the unified-AST flatten+interpolate path must be ≥ the current class-b

**Recs:** Dispatch the color2Into out-param (novelIdea #1) as the terminal home for the O.W3 alloc partial — it is the named deferral at dispatch.ts:245 and the · Ship VJ-L1 fnName as a meta-record field, NOT a 7th positional ctor arg — pair the value.js-P flatLeaf provenance with the ValueUnit ctor reshape (nov · Resolve the BBNF grammar limbo this tranche (novelIdea #4): either wire it as the parse-that-SpanParser codegen source with a parity gate, or DELETE b · Fix the FunctionValue constructor O(n²) no-op forEach (index.ts:169-171) in any P-tranche pass — a one-line correctness cleanup. · Treat the unified-AST and flatLeaf-first transpositions (novelIdeas #2, #5) as PROTOTYPE-AND-BENCH-FIRST, born-RED-gated experiments, not commitments  · Correct the orchestrator's ground-truth: value.js DOES have a bench/ dir (9 files: color-alloc-hotpath, color-interp, numeric-soa, etc.), so every per

---

## V3-grammar-correct

value.js@1.0.2 ships a rich 2026+ CSS grammar with three former P0 crashes fixed (linear-gradient no-direction, CSS Nesting, linear() stop spacing) and all 1871 tests green. The semantic-idempotence invariant (inv-O-2) holds for the 21-item CORPUS but three confirmed breaches exist outside it: (1) the `none` missing-channel keyword serializes to `NaN` which then fails color re-parsing on the second parse; (2) CSS Color 4 `color()` predefined spaces (display-p3, a98-rgb, prophoto-rgb, rec2020, srgb-linear) lose their `color(` wrapper in `Color.toString()`, causing the round-trip to fall through to a generic FunctionValue; (3) `round()` with the strategy argument omitted throws `t is not iterable`. Additionally, dashed-ident custom function calls (`--brand-color(0.5)`) silently drop the argument list via CSSString greedy match, and the CORPUS contains one non-standard grammar item (`color(in oklch ...)`) whose idempotence is vacuous. Novel oracle opportunities are large: the gaps above are exactly the kind property-based / differential-fuzz testing would surface automatically.

**Critical findings:**

- **[HIGH·correctness]** inv-O-2 breach: CSS 'none' channel → 'NaN' string → type change on re-parse
  - _ev:_ value.js/src/units/color/index.ts:46-57 (formatColor joins channel values with String coercion; NaN.toFixed(2)='NaN'); confirmed: parseCSSValue('oklch(0.5 none 200)') → unit='color', .toString()='oklc
  - _→_ Cure: (a) serialize missing channels back to the keyword 'none' instead of Number-coercing NaN. In formatColor, check isNaN(Number(v)) && replace with 'none'. (
- **[HIGH·correctness]** inv-O-2 breach: color() predefined spaces emit bare function name, losing color() wrapper
  - _ev:_ value.js/src/units/color/index.ts:46-57 (formatColor: always emits 'colorSpace(...)' without checking COLOR_FUNCTION_FORM); src/units/color/constants.ts:266-272 (COLOR_FUNCTION_FORM marks display-p3, 
  - _→_ Cure: make Color.toString() consult COLOR_FUNCTION_FORM and emit 'color(space channels)' for the 'color' form, matching toAnimationString(). The fix is ~5 lines
- **[HIGH·correctness]** round() with omitted strategy argument throws 't is not iterable'
  - _ev:_ value.js/src/parsing/math.ts:144-154 (roundFn: all(roundStrategy.skip(comma).opt(), calcArgList)). When strategy is omitted, opt() returns undefined; parse-that all() DROPS the undefined element, so t
  - _→_ Cure: replace the all(strategy.opt(), calcArgList) pattern with an explicit two-branch any(): branch 1 = all(strategy.skip(comma), calcArgList); branch 2 = calc

**Novel ideas:**

- [aggressive·correctness] **Property-based differential oracle: fast-check corpus vs Chromium DevTools Protocol computed style**
  - _mech:_ Use fast-check (npm) arbitraries to generate random color values (r/g/b in [0,255], oklch(L/C/H), color-mix(...)) → serialize via value.js → inject into a hidden DOM element via Playwright CDP → read 
  - _payoff:_ Catches silent wrong-color bugs (none→NaN, color() wrapper loss, gamut-mapping drift) against the browser's authoritativ · _feas:_ Requires Playwright setup (already present in keyframes.js); CDP evaluate is a well-known pattern. The main risk: browser color co
  - _gate:_ Born-RED: for at least 10 randomly generated oklch / color-mix values, value.js.parseCSSValue(s).toString() injected int
- [incremental·correctness] **Canonical Color.toString() unification: make toString() and toAnimationString() the same for 'color()' predefined spaces**
  - _mech:_ In value.js/src/units/color/index.ts:46-57 (formatColor), consult COLOR_FUNCTION_FORM (already imported from constants.ts:256-273). When COLOR_FUNCTION_FORM[colorSpace]==='color', emit 'color(<space> 
  - _payoff:_ Closes Breach 2 (inv-O-2) for display-p3, a98-rgb, prophoto-rgb, rec2020, srgb-linear, xyz. Makes value.js output valid  · _feas:_ High feasibility — the COLOR_FUNCTION_FORM lookup is already at hand. The only risk is that existing snapshot tests or animation i
  - _gate:_ Born-RED: parseCSSValue('color(display-p3 1 0 0)').toString() === 'color(display-p3 1 0 0)' AND parseCSSValue('color(dis
- [incremental·correctness] **CSS Color 4 'none' keyword: preserve as keyword through the entire serialize/re-parse pipeline**
  - _mech:_ Two changes: (1) In formatColor (color/index.ts:46-57), check if a channel value is NaN and emit 'none' instead. The channel is a number (from Color<number>) but NaN signals a missing component per CS
  - _payoff:_ Closes Breach 1 (inv-O-2 none→NaN→type-change). Produces browser-valid CSS: browsers accept 'oklch(0.5 none 200)' (it is · _feas:_ High feasibility — the NaN check is straightforward. The colorValue change is a one-line addition. The NaN literal as a parseable 
  - _gate:_ Born-RED: parseCSSValue('oklch(0.5 none 200)').toString() === 'oklch(0.5 none 200)' AND unit of re-parse is 'color'.
- [aggressive·arch] **VJ-L3 (deferred): parseCSSSubValue — typed re-entry parser for var() fallback and @function body values**
  - _mech:_ Currently var() captures its fallback VERBATIM as a raw string (parsing/index.ts:36-48 handleVar). The fallback 'oklch(0.5 0.1 200)' inside 'var(--x, oklch(0.5 0.1 200))' is never parsed to a Color. V
  - _payoff:_ Enables keyframes.js consumers to inspect and diff var() fallback colors (for theme-switching logic), and enables @funct · _feas:_ Medium complexity. The re-entry parser already exists (CSSValues.Value). The main risk is circular parsing (a fallback that contai
  - _gate:_ Born-RED: parseCSSSubValue('oklch(0.5 0.1 200)') must return ValueUnit with unit='color' and the full Color object, as a
- [radical·correctness] **Grammar fuzz harness: fast-check model-based CSS generator with structural equality oracle**
  - _mech:_ Define a fast-check Arbitrary<CSSFragment> that generates structurally valid CSS fragments (color functions, math expressions, gradient stops, keyframe rules) from a model grammar — not from raw strin
  - _payoff:_ Would have caught the none→NaN breach, the color() wrapper loss, and the round() strategy-omit throw before shipping. Th · _feas:_ Medium-high effort. fast-check arbitrary composition is non-trivial for deeply nested CSS. The main risk: the model grammar must b
  - _gate:_ Born-RED: fast-check runs 200 color-function cases without finding a structural mismatch between the model and parseCSSV
- [incremental·correctness] **Dashed-ident function dispatch: extend scanIdentFast to support '--' prefix for CSS custom function calls**
  - _mech:_ In value.js/src/parsing/utils.ts:48-57 (scanIdentFast), add a two-dash path: if (src[i]==='-' && src[i+1]==='-' && isAsciiLetter(src[i+2])), consume '--' + ident. Then in parsing/index.ts Function_ di
  - _payoff:_ Enables round-trip of CSS Functions and Mixins L1 call sites — e.g. 'color: --brand-color(0.5)' in a style block. Curren · _feas:_ Low complexity — the scanIdentFast change is 4 lines; the dispatch addition is 2 lines. The only risk: a bare '--my-custom-propert
  - _gate:_ Born-RED: parseCSSValue('--brand-color(0.5)') returns FunctionValue with name='--brand-color' and values=[VU(0.5)].

**Recs:** Fix Breach 2 first (color() predefined spaces toString): it is the highest-impact / lowest-effort change (~8 lines in formatColor), and it will make t · Fix Breach 1 (none → 'none' serialization) immediately after: emit 'none' in formatColor when channel isNaN, and add 'NaN' as a colorValue fallback ke · Fix Breach 3 (round() strategy-omitted) using the D8 two-branch any() pattern already proven in handleGradient: replace all(strategy.opt(), calcArgLis · Replace the invalid 'color(in oklch ...)' corpus item in round-trip.test.ts with 'color(display-p3 0.5 0.3 0.8)' after Breach 2 is fixed, so the CORPU · Add a differential oracle gate (proof:differential-color) using Playwright CDP to compare value.js color serialization against browser getComputedStyl · Prioritize dashed-ident function call parsing (scanIdentFast '--' prefix) as a VJ-P item once CSS Functions and Mixins L1 shipping status in browsers  · Do NOT invest in radial-gradient shape+position parsing until a born-RED gate is established — the current behavior is self-idempotent at the corrupte

---

## V4-vjl1-vjl3

The kf-dispatched ASKS doc (docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md) is a strong, well-grounded contract, but my adversarial probe of the real value.js parser surface uncovered a load-bearing correctness trap in the VJ-L3 design that the doc papers over. The doc claims VJ-L3 "wraps the existing tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value)) composition value.js already owns internally" and even hints it is near-equivalent to the shipped parseCSSValue — but parseCSSValue (= tryParse(ValuesValue)) only parses the FIRST sub-value of a multi-function string ("scale(2) rotate(45deg)" yields just scaleX/Y/Z(2), truncating rotate), whereas kf's FunctionArgs-FIRST composition parses the full list. The ordering of `any(FunctionArgs, Value)` is itself load-bearing (FunctionArgs-first always wraps in a ValueArray, even for bare "10px", which is exactly what kf's flattenToValueUnits consumes). VJ-L1 is genuinely small and clean as designed; my only refinements are the clone() positional-arg wart (targets is deliberately omitted, so fnName as a 7th positional means passing undefined for targets) and an opportunity to fold flatLeaf into the existing functionIdentityValue value-domain home for a more elegant provenance API. Both asks correctly dissolve S8/S9 and the gate machinery (apiPresent probes, born-RED W96) is real and well-specified.

**Critical findings:**

- **[HIGH·correctness]** VJ-L3 is NOT a thin alias of parseCSSValue — the FunctionArgs-first composition is load-bearing and truncation-prone if mis-specified
  - _ev:_ value.js/src/parsing/index.ts:446 `const Value = any(CSSWideKeyword, CSSValueUnit.Value, Function_, CSSString)` and :473 `parseCSSValue = memoize(tryParse(ValuesValue,...))`. My probe: `parseCSSValue(
  - _→_ VJ-L3 MUST internalize the EXACT `any(CSSFunction.FunctionArgs, CSSValues.Value)` parser with FunctionArgs FIRST — NOT delegate to parseCSSValue/ValuesValue. Th

**Novel ideas:**

- [aggressive·arch] **Fuse VJ-L1 + VJ-L3 into ONE provenance-carrying parse helper: parseCSSSubValue's internal flatten stamps fnName, so the two asks become a si**
  - _mech:_ Today kf does parseCSSSubValue-equivalent (utils.ts:235-238) THEN a separate flattenToValueUnits (utils.ts:59-83) that re-derives fnName by walking the FunctionValue tree. If VJ-L3's internal composit
  - _payoff:_ Collapses two asks + kf's entire flattenToValueUnits + the clone-restamp ceremony into one consume. Reduces utils.ts by  · _feas:_ Feasible and BC-additive. RISK (tempting-but-wrong): if VJ-L3 returns fnName-stamped leaves but kf STILL re-clones them per use-si
  - _gate:_ Born-RED: `parseCSSSubValue('scale(2) translateX(10px)').flat().map(l=>l.fnName)` deepEquals `['scale','scale','scale','
- [incremental·arch] **Make fnName a value-domain provenance API co-located with functionIdentityValue, not a bare ValueUnit field — 'the function this leaf came f**
  - _mech:_ value.js/src/units/utils.ts:71-83 already owns functionIdentityValue(name) — the inverse-direction value-domain knowledge (name→identity leaf). fnName is the forward direction (leaf→name). Rather than
  - _payoff:_ Elegance + a validation seam: a leaf claiming fnName='scale' is checkable against the same FUNCTION_IDENTITY table that  · _feas:_ Feasible, BC-additive. RISK: over-engineering a 10-LoC ask — the ASKS doc budgets VJ-L1 at ~10 LoC and a factory/validation layer 
  - _gate:_ Born-RED: `functionIdentityValue('scale')?.unit === undefined && new ValueUnit(2,undefined,undefined,undefined,undefined
- [incremental·correctness] **Ship parseCSSSubValue with an explicit parse-error sink (OnParseError) wired to value.js's existing VJ-F2 diagnostic infrastructure, turning**
  - _mech:_ value.js/src/parsing/utils.ts:334-346 tryParse already accepts an optional onParseError sink (VJ-F2 diagnostics, :356-366 parseResult). kf's getTimingFunction (utils.ts:164-198) wraps EVERY value.js p
  - _payoff:_ Turns 4 silent swallow-and-fall-through sites (utils.ts:168,:195 + the tryParseLeaves throw) into observable, testable p · _feas:_ Feasible, BC-additive (opts.onParseError optional). RISK: kf's fall-through behavior is intentional (a malformed steps() SHOULD de
  - _gate:_ Born-RED: `parseCSSSubValue('scale(', {onParseError: d => captured.push(d)})` populates captured with a ParseDiagnostic 

**Recs:** VJ-L3 MUST internalize `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` with FunctionArgs FIRST — do NOT delegate to the shipped pars · The VJ-L3 born-RED gate must use a MULTI-function input (e.g. 'scale(2) rotate(45deg)' or 'translateX(10px) translateY(20px)') and assert the FULL Val · Re-ground VJ-L1's population site: it is NOT value.js's flattenObject (a string-keyed Record builder, units/utils.ts:85-139) — fnName must be stamped  · Surface to value.js P: the 7-positional ValueUnit ctor (with clone() dropping targets but coalesce() carrying it) is a latent maintainability wart — f · Lock the VJ-L3 round-trip-equality gate over kf's EXACT current input corpus INCLUDING the throwing cases (bare 'red' color keyword errors in both com · Confirm the WeakMap S8-KILL fallback (P-inv-28 arm a) is documented as NOT clone-surviving — it leaves the restamp ceremony intact, so VJ-L1 remains s

---

## V5-defer-plan

value.js Tranche O executed all six library waves (O.W0–O.W6) and reached 1.0.2 on master, but its PROGRESS.md was never updated from "DEVELOPMENT — charter only" — the authoritative close record is permanently stale. Two dispatched cross-repo APIs (VJ-L1 flatLeaf, VJ-L3 parseCSSSubValue) that kf explicitly depended on were never scoped into O's wave plan and remain absent from 1.0.2, leaving kf's FN_NAME Symbol sidechannel (S8) and direct @mkbabb/parse-that production dep (S9) PENDING at chronicity 3 heading into kf-P, one tranche from the P-inv-28 belt. The O.W3 gamut-alloc reduction is partial (104→84 allocs/call; 24 per-step color2() Color allocations persist because color2Into was explicitly deferred). O.W7-demo (Parse-Lab pane + gamut-truth indicator) was chartered, authored as a spec, and never implemented. A latent O(N²) setSubProperty bug in FunctionValue constructor (src/units/index.ts:169-170) was identified in the 32-lane audit but never fixed. Tranche P's founding mandate is clear: VJ-L1 + VJ-L3 first (the kf-unblock), then color2Into + mixColorsInto (alloc completion), @function full evaluation engine, and the deferred demo pane.

**Critical findings:**

- **[HIGH·legacy]** value.js O PROGRESS.md permanently stale — 'DEVELOPMENT — charter only' on a fully-executed CLOSED tranche
  - _ev:_ /Users/mkbabb/Programming/value.js/docs/tranches/O/PROGRESS.md:1-8 — header reads 'O is DEVELOPMENT — charter only. O.W0 is DEV (authored 2026-06-18). O.W1–O.W6 dispatch on explicit user ratification 
  - _→_ value.js Tranche P.W0 doc wave: update PROGRESS.md to CLOSED with per-wave status: O.W0 SHIPPED 0.13.1, O.W1+O.W2 SHIPPED 0.14.0, O.W3 SHIPPED (0.15.0 integrate
- **[BLOCKER·deferred]** VJ-L1 (flatLeaf provenance API) NEVER SHIPPED — absent from value.js 1.0.2, blocking kf S8 FN_NAME Symbol delete and O.W7 engine-seam
  - _ev:_ /Users/mkbabb/Programming/value.js/src/units/index.ts:57-80 — ValueUnit ctor has NO fnName field; runtime confirms 'fnName' in new ValueUnit(0,'px') === false. KF-TO-VALUEJS-P-ASKS.md:26 — VJ-L1 ask: 
  - _→_ value.js Tranche P first wave: add fnName?: string to ValueUnit ctor + clone() + flattenObject FunctionValue branch (~10 LoC, BC-additive). Proof arm: proof:wor
- **[BLOCKER·deferred]** VJ-L3 (parseCSSSubValue helper) NEVER SHIPPED — kf direct @mkbabb/parse-that production dep (S9) persists at chronicity 3
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/src/animation/utils.ts:1 — 'import { any as parseAny } from "@mkbabb/parse-that"'; :229,236 — two 'as any' cross-realm casts. Runtime: typeof vj.parseCSSSubValue
  - _→_ value.js Tranche P first wave alongside VJ-L1: expose parseCSSSubValue wrapping tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value) already owned in
- **[HIGH·correctness]** O(N²) setSubProperty bug in FunctionValue constructor — calls this.setSubProperty(N) N times (O(N²) walk) instead of v.setSubProperty(name)
  - _ev:_ /Users/mkbabb/Programming/value.js/src/units/index.ts:169-171 — 'values.forEach((v) => { this.setSubProperty(name); });' — iterates over N values, calling setSubProperty on 'this' (which itself walks 
  - _→_ value.js Tranche P.W0 one-liner fix: values.forEach((v) => v.setSubProperty(name)). No API change. Existing test suite is the regression oracle. Should ship as 

**Novel ideas:**

- [incremental·arch] **VJ-L1 + VJ-L3 as a single atomic value.js 1.1.0 patch — co-ship both APIs in one publish to fire both kf tripwires simultaneously**
  - _mech:_ VJ-L1 (~10 LoC in ValueUnit ctor + clone() + flattenObject FunctionValue branch at value.js/src/units/index.ts:30-50 and src/units/utils.ts:85) + VJ-L3 (~15 LoC at value.js root export wrapping the al
  - _payoff:_ Eliminates two kf workarounds (S8/S9) and the @mkbabb/parse-that production dep from kf in a single value.js publish. Un · _feas:_ Both are small leaf additions with no blast radius on existing API. Risk: the fnName field name is value.js's naming call — docume
  - _gate:_ proof:workaround-deletion S8=GREEN AND S9=GREEN in a single kf commit. Born-RED today: S8='flatLeaf in vjs === false', S
- [aggressive·perf] **color2Into out-param + mixColorsInto out-param: fully zero-alloc gamut + mix hot paths in a single value.js P perf wave**
  - _mech:_ gamutMapToRgbSpace at value.js/src/units/color/dispatch.ts:257 still calls color2(probe, target) inside the 24-step loop — one Color allocation per step = 24 per call remaining after O.W3's OKLCHColor
  - _payoff:_ Reduces gamutMapToRgbSpace from 84 to ≤6 allocs/call (the 5 bookend allocs). Eliminates per-frame GC pressure for color- · _feas:_ color2Into is a public API surface change — must be BC-additive (new overload or separate export). The module-scoped egress scratc
  - _gate:_ proof:gamut-alloc extended with N_target_v2 clause: gamutMapToRgbSpace allocs/call ≤ 40, born-RED on today's 84. GREEN r
- [incremental·arch] **value.js ./timing or ./easing-fn parse-that-free subpath — let kf LIGHT surface import easing functions without pulling the grammar**
  - _mech:_ kf's resolveEasing() (src/animation/easing.ts) imports parseLinearStops, parseSteps, parseCubicBezier from value.js root — pulling the full grammar into the LIGHT boundary. value.js already has the ./
  - _payoff:_ kf consumers using only SpringProgress, SmoothProgress, stagger, Sequence, flip never need the @keyframes grammar. A ./t · _feas:_ Requires value.js to audit which easing parsers depend on CSSValues grammar (parseLinearStops uses the expression grammar — non-tr
  - _gate:_ proof:subpath-budget extended: importing '@mkbabb/value.js/timing' in an isolated bundle has zero @keyframes grammar mod
- [incremental·perf] **Committed perf-baseline.json in value.js alongside proof:perf-target — make the +23-30% A/B claim historically verifiable from any machine**
  - _mech:_ proof-perf-target.mjs uses a JSON.parse ratio normalizer (portable) but records no absolute baseline on disk. Add bench/perf-baseline.json storing: {value_parser: {baseline_mb_per_s, date, git_sha}, s
  - _payoff:_ Makes the 'SOTA +23-30%' claim auditable by any contributor or future agent. Eliminates the hidden-baseline problem wher · _feas:_ Trivial implementation. Risk: perf-baseline.json could drift from the actual runtime if not refreshed — CI should refresh it on ta
  - _gate:_ proof:perf-target extended: if bench/perf-baseline.json exists, assert that the measured MB/s is within 20% of the recor
- [incremental·correctness] **FunctionValue O(N²) setSubProperty fix + unit test for large N (gradient stops) as a born-RED perf correctness gate**
  - _mech:_ src/units/index.ts:169-171 — values.forEach((v) => { this.setSubProperty(name); }) calls setSubProperty(N) N times → O(N²). Fix: values.forEach((v) => v.setSubProperty(name)). This is a one-liner. Add
  - _payoff:_ Fixes a real per-parse allocation and time regression for complex gradients and transform lists. linear-gradient(…100 st · _feas:_ Zero risk — the fix is a typo correction (v unused in the loop). Test is straightforward. The only question is whether any consume
  - _gate:_ Born-RED: a test asserting that constructing FunctionValue('f', [v1,v2,...,vN]) calls setSubProperty exactly N times (no
- [aggressive·correctness] **parse-that Tranche B charter with all() footgun W0 as first wave — make the grammar semantics of all() vs any() safe by default**
  - _mech:_ AUDIT-DIGEST.md B9 identifies the all() global-opt-filter semantics as a footgun: all() in parse-that 0.11.0 silently drops undefined opt() results from the result tuple in some call paths (the D8 dec
  - _payoff:_ Eliminates an entire class of parse-that consumer bug that currently requires defensive null-checks or local branch-guar · _feas:_ Moderate. Changing all() semantics is potentially BC-breaking for consumers who relied on the undefined-drop behavior. Mitigation:
  - _gate:_ Born-RED: parse-that test asserting allStrict(any(a,b).opt(), c).parse('c') returns [undefined, cResult] (arity 2, posit

**Recs:** Ship value.js 1.1.0 with VJ-L1 (ValueUnit.fnName + clone + flattenObject population, ~10 LoC) AND VJ-L3 (parseCSSSubValue root export, ~15 LoC) in a S · Fix the O(N²) setSubProperty bug in value.js src/units/index.ts:169-171 immediately as a 1.0.3 patch: change 'values.forEach((v) => { this.setSubPrope · Update value.js docs/tranches/O/PROGRESS.md from 'DEVELOPMENT — charter only' to CLOSED with per-wave committed status — this is the authoritative clo · Wire proof:gamut-alloc and proof:perf-target into value.js ci.yml with observe-only posture on the Linux runner — both scripts exist, pass locally, an · Scope value.js Tranche P.W3 as the color2Into + mixColorsInto completion wave — the O.W3 partial left 84 allocs/call vs the ≤6 achievable target; exte · Charter parse-that Tranche B with the all() footgun fix (D8) as W0 and setDiagnosticLogger as W1 — three deferred items name 'Tranche B' as their term · Scope O.W7-demo (Parse-Lab pane + gamut-truth indicator) as value.js P.W1 — the spec is authored at docs/tranches/O/waves/O.W7-demo.md, the born-RED g

---

## P1-perf-frontier

parse-that@0.11.0 (typescript/src/parse/) is already a tight, well-instrumented combinator core: a 128-entry Int8Array dispatch() LUT (leaf.ts:60), inline byte-scanners (utils.ts skipWhitespace/skipBlockComments, span.ts takeUntilAnySpan LUT), WDM (id,offset) packrat (packrat.ts), and the honestly-falsified SpanParser tagged-union retained as the BBNF-codegen data foundation (span.ts:549-902). The biggest unrealized win is NOT inside parse-that's own benches but at the consumer boundary: value.js's dominant hot path is an 11-arm sequential any() trial (units.ts:79 Value = any(Length, Angle, Time, ...)) plus 96 any()/59 all()/123 trim() call sites — the span tier is dead weight on that path and per-call all() allocates a fresh matches[] array (leaf.ts:113). The aggressive, novel, grounded plays are: (1) revive the falsified SpanParser as a REAL codegen target — a BBNF→specialized-monomorphic-TS emitter (the WASM bytecode VM already exists per wasm-json.bench.ts; a TS-source emitter is the missing tier), (2) combinator FUSION that collapses any()/all()/map chains into one monomorphic closure with zero intermediate tuples, and (3) a first-char dispatch() codegen for value.js's any() alternations (color.ts already proves the win). Critical evaluative finding: there is NO bench/ dir and no npm bench script — the entire perf frontier is un-CI-gated against regression (future-research.md §6 names this).

**Critical findings:**

- **[HIGH·gap]** No bench script / no CI perf gate — the whole perf frontier is regression-blind
  - _ev:_ parse-that/typescript/package.json scripts has test/proof:manifest/proof:no-css-surface/proof:subpath but NO bench target; benches exist (test/benchmarks/*.bench.ts incl span-dispatch.bench.ts, json-c
  - _→_ Add `"bench": "vitest bench"` + a `proof:perf` gate that fails CI if json-comprehensive parse-that (hand) regresses >X% vs a checked-in baseline JSON. Born-RED:
- **[HIGH·workaround]** value.js Value alternation is an 11-arm sequential any() — the true constellation hot path, un-dispatched
  - _ev:_ value.js/src/parsing/units.ts:79 `const Value = any(Length, Angle, Time, Frequency, Resolution, Flex, Percentage, Color, Slash, number.map(...), none.map(...))`. Every token re-runs Length→fail, Angle
  - _→_ parse-that ships dispatch(); value.js owns the call site. Either (a) value.js re-routes Value through dispatch() on first char ([0-9.+- ]→numeric arms, a-z→iden

**Novel ideas:**

- [radical·codegen] **BBNF→specialized-monomorphic-TS codegen emitter (the SpanParser union becomes a REAL target): walk the flat SpanParser data (or a BBNF AST) **
  - _mech:_ The falsified A.W3 conclusion (span.ts:564) is precise: a RUNTIME recursive switch loses to V8's per-site monomorphic closure inlining. But a CODEGEN emitter sidesteps that entirely — it inlines each 
  - _payoff:_ Closes the documented BBNF-vs-hand-rolled gap (future-research.md §11: 540 vs 926 MB/s = 0.58x → target 0.85x) on the TS · _feas:_ HIGH feasibility for the emitter; the TEMPTING-BUT-WRONG trap (recall SpanParser) is re-attempting RUNTIME dispatch — do NOT; the 
  - _gate:_ Born-RED: a bench (test/benchmarks/codegen-json.bench.ts) that compiles the JSON grammar to flat TS source and asserts t
- [aggressive·perf] **Combinator FUSION pass: collapse a static chain like a.then(b).map(f) / all(a,b,c) / any(a,b,c) into ONE closure that threads state with pos**
  - _mech:_ Today then() allocates `[value1, state.value]` per call (parser.ts:72), all() allocates matches[] per call (leaf.ts:113), and each combinator is a distinct closure shape → a chain is N function frames
  - _payoff:_ Removes per-call tuple/array allocation on the hottest value.js shapes (59 all(), the then-chains inside all()), and col · _feas:_ MED — fusion must preserve EXACT backtracking/offset-restore + the all() drop-undefined semantics (A.md D8) and error-merge (merge
  - _gate:_ Born-RED: an alloc-counting bench (--expose-gc + process.memoryUsage delta) asserting fuse(all(a,b,c)) does ZERO array a
- [aggressive·perf] **dispatch()-codegen for any() alternations: auto-derive a first-char Int8Array LUT from the leading literals/char-classes of an any()'s arms,**
  - _mech:_ value.js/units.ts:79 Value=any(11 arms) is pure sequential trial; color.ts:732 already hand-writes the dispatch() equivalent and wins. parse-that already HAS the engine (leaf.ts:60 dispatch). A toDisp
  - _payoff:_ Turns the 11-arm Value trial from avg ~5.5 failed-arm trips per token to 1 LUT index + 1 arm. On a CSS-value-heavy parse · _feas:_ MED-HIGH — first-char extraction is mechanical for string()/regex-anchored arms; the trap is an arm whose first char overlaps anot
  - _gate:_ Born-RED: a bench asserting toDispatch(any(Length,Angle,Time,...)) parses a 6000-token CSS-value stream ≥40% faster than
- [incremental·perf] **Zero-alloc Span-native value path end-to-end: make the default leaf parsers emit Spans (offsets) not substrings, materializing the string ON**
  - _mech:_ regex() default path already does state.src.substring(savedOffset,end) per match (leaf.ts:213) and string() sets the literal (cheap). The span tier (span.ts) proves the offset-only representation; spa
  - _payoff:_ Cuts substring allocations on number/ident-heavy inputs (canada.json is number-heavy; future-research.md §14 arena item  · _feas:_ HIGH mechanically; the trap is that value.js's .map() callbacks expect strings (174 map() sites) — a blanket switch breaks them. M
  - _gate:_ Born-RED: a heap-delta bench asserting a Span-native number-array parse allocates ≥50% fewer bytes than the substring pa
- [aggressive·perf] **Columnar/open-addressing packrat memo: replace the 3 Maps (MEMO/HEADS/GROWING) + per-step Answer/LR/Set allocations with a flat typed-array **
  - _mech:_ packrat.ts:90-99 uses Map<number,MemoCell> + snapshot() object allocs (packrat.ts:101) + new Set per grow (packrat.ts:222). Since keys are already dense-ish packed ints (getCijKey), a columnar layout 
  - _payoff:_ For a hot LEFT-RECURSIVE grammar, removes the per-recall Map.get hash + per-step object churn. future-research.md §4 nam · _feas:_ LOW-priority / speculative — packrat is OFF the default path (packrat.ts:11) and the constellation has ZERO hot left-recursive con
  - _gate:_ Born-RED: a left-recursive-grammar bench (the mSL/math grammars in memoize.test.ts) asserting the columnar memo is ≥15% 

**Recs:** PRIORITIZE the BBNF→specialized-monomorphic-TS codegen emitter: it is the ONLY play that honors the falsified-SpanParser record (build-time emission,  · FIX the regression-blindness FIRST (cheap, unblocking): add `bench` + a `proof:perf` baseline gate to package.json (future-research.md §6). Without it · The highest REALIZED consumer win is cross-repo: value.js/units.ts:79's 11-arm any(Value) should route through dispatch() (color.ts:732 already proves · Combinator FUSION is the second parse-that-internal play — generalize the already-shipped wrap() hand-fusion (parser.ts:375) to all()/then()/skip() ch · DECIDE the SpanParser union's fate explicitly: if the codegen emitter is authorized, it becomes the emitter's input AST (KEEP); if not, KILL it and re · Do NOT build the columnar packrat memo yet — it optimizes the cold opt-in LR path with no hot consumer; record it as a born-RED gate that stays UNBUIL

---

## P2-arch-transpose

parse-that's post-CSS-deletion primitives surface is genuinely lean and the subpath split (./core ./diagnostics ./packrat ./utils) is clean and gated. But the architecture carries two unresolved transposition debts that the campaign's own narrative papers over: (1) the FALSIFIED SpanParser tagged-union (span.ts:540-902, ~40% of the file) is retained on an unbuilt "BBNF-codegen foundation" rationale with ZERO consumer — a P-inv-28 deferral with no terminal home, and it ships a `const enum` without `isolatedModules` (a real build hazard); (2) the cross-realm `Parser<T>` nominal seam forces `(parseAny as any)(...)` at keyframes utils.ts:236 — the single most important integration boundary in the whole constellation is fully type-erased, and value.js does not re-export `Parser` so no consumer can recover one nominal type. The biggest generative win is a structural/branded `Parser<T>` seam plus collapsing the value.js manual per-char dispatch bucketing into a first-class data-driven `dispatch` that parse-that owns. The combinator core itself (mutable single-ParserState threaded by reference, flag-based `call()` fast paths) is idiomatic and fast; no rewrite warranted there.

**Critical findings:**

- **[HIGH·deferred]** FALSIFIED SpanParser tagged-union retained with no terminal consumer (P-inv-28 deferral)
  - _ev:_ parse-that span.ts:540-902 (~360 lines, ~40% of the file): `SpanParserKind`, `SpanParser` union, 10 `*Node` constructors, and `callSpan()` switch. The header (span.ts:551-571) MEASURES it ~10-14% SLOW
  - _→_ Per P-invariant-28 this deferral needs a terminal home or a named KILL. Recommend KILL: delete span.ts:540-902 + the bench, and record the falsification as a on
- **[HIGH·transposition]** Cross-realm Parser<T> nominal seam fully type-erases the constellation's key integration boundary
  - _ev:_ keyframes utils.ts:223-238: value.js and keyframes each bundle their own @mkbabb/parse-that realm, so `Parser<T>` is nominally distinct; the fix is `(CSSFunction.FunctionArgs as any).map(...)` and `(p
  - _→_ GESTALT FIX, not a cast. parse-that's `Parser<T>` is a closure-wrapping class with no private brand — it is already structurally interchangeable across realms; 

**Novel ideas:**

- [aggressive·arch] **Structural ParserLike<T> seam — kill the cross-realm `any` casts with a re-exported nominal type or a structural interface**
  - _mech:_ Two paths, both grounded at kf utils.ts:223-238 + value.js parsing barrel. (A) value.js re-exports `export type { Parser, ParserState, ParserContext } from '@mkbabb/parse-that'` from its ./parsing sub
  - _payoff:_ Removes the 2 `as any` casts at the single most important seam in the constellation; restores full type-checking on the  · _feas:_ Path A is ~5 lines + a realm-dedup assertion; risk is that npm hoisting is NOT guaranteed (kf bundles its own 0.11.0 copy per the 
  - _gate:_ Born-RED: a `proof:cross-realm-types` gate that compiles a fixture importing value.js's `CSSValues.Value` and passing it
- [incremental·arch] **KILL the SpanParser tagged-union; replace the 'codegen foundation' with a born-RED codegen gate or a docs note**
  - _mech:_ Delete span.ts:540-902 + span-dispatch.bench.ts. The falsification is preserved as a single docs/future-research.md paragraph (the OBSERVATION is the asset; the dead code is not). This drops span.ts f
  - _payoff:_ Removes ~360 lines of dead source + the const-enum/isolatedModules hazard; honors P-inv-28 (every deferral gets a termin · _feas:_ Trivial deletion; the only consumer is the bench. Risk: if the owner truly intends codegen, deletion loses the data shape — but th
  - _gate:_ Born-RED: `proof:no-dead-export` greps src for exported symbols with zero non-test importers — RED on `callSpan`/`SpanPa
- [aggressive·perf] **First-class data-driven dispatch — fold value.js's hand-rolled per-char bucketing into a parse-that `dispatchByFirstChar` primitive**
  - _mech:_ value.js parsing/index.ts:360-451 hand-maintains the char→bucket table + a prose comment of first-char→parser membership. parse-that's `dispatch` (leaf.ts:60-104) already owns the Int8Array LUT. Add `
  - _payoff:_ Eliminates the under-inclusion footgun the value.js comment itself warns about ('under-inclusion would change results'); · _feas:_ Parsers don't currently declare their first-char set, so the derivation needs either a `firstCharOf` callback (caller-supplied, wh
  - _gate:_ Born-RED: a `dispatchByFirstChar`-vs-`any` equivalence fuzz gate — for 10k random tokens, assert the derived-bucket disp
- [radical·arch] **Generate the 16 Span combinators from the value combinators (single source of control-flow truth)**
  - _mech:_ span.ts duplicates every value combinator's save/restore/mergeError plumbing as a Span twin (compare parser.ts `many` lines 501-541 vs span.ts `manySpan` 85-120 — identical control flow, the only delt
  - _payoff:_ Removes ~400 lines of copy-pasted backtracking plumbing; a bug fixed in `many`'s backtracking is fixed in `manySpan` aut · _feas:_ Radical: risks the zero-alloc property that justifies span combinators (a generic collector closure could deopt vs the inlined spa
  - _gate:_ Born-RED: a perf gate asserting the collector-parametric `manySpan`/`sepBySpan` are within 5% of the current hand-writte

**Recs:** KILL the FALSIFIED SpanParser tagged-union (span.ts:540-902 + span-dispatch.bench.ts), preserving only the falsification record as a docs/future-resea · Fix the cross-realm Parser<T> seam as a GESTALT type fix, not a cast: re-export `Parser`/`ParserState` from value.js's ./parsing subpath (or extract a · If SpanParser is retained against the KILL recommendation, eliminate the const-enum hazard: convert `const enum SpanParserKind` to a plain enum or con · Promote value.js's hand-rolled per-char dispatch bucketing (parsing/index.ts:360-451, ~90 lines + a hand-verified comment) into a first-class parse-th · Do NOT rewrite the mutable single-ParserState combinator core or transpose to immutable state — the FALSIFIED SpanParser bench proves V8 punishes per-

---

## P3-correct-packrat

The parse-that@0.11.0 packrat tier (typescript/src/parse/packrat.ts) is mostly sound: the A.W2 (id,offset) fix was correctly implemented using getCijKey, the WDM seed-grow algorithm is faithfully rendered, and the GROWING-table epsilon logic correctly tiles multi-occurrence heads. However, two concrete correctness defects remain undetected by the test suite. First, the MEMO cache has no source-string identity component, so applying a memoized parser to input A and then input B without calling resetPackrat() returns input A's cached result for input B — a confirmed silent-wrong-answer bug verified at runtime. Second, getCijKey uses JS 32-bit bitwise operators, so parser IDs that are multiples of 4096 alias to the same key as IDs 0–4095 — confirmed via runtime collision testing; the current constellation stays under the 4096 threshold but a multiply-based key would eliminate the hazard at zero cost. The test suite's beforeEach(resetPackrat) discipline masks the first defect, and the reset-tax-gone test creates false confidence about cross-parse safety. The LR_STACK also leaks if a map callback throws (no try/finally), leaving global state corrupt until the next resetPackrat call. The SpanParser falsification (A.W3) and the subpath split are both correctly implemented and documented.

**Critical findings:**

- **[BLOCKER·correctness]** Cross-input cache pollution: memoize() returns wrong result when resetPackrat() is not called between different inputs
  - _ev:_ typescript/src/parse/packrat.ts:90 — MEMO = new Map<number, MemoCell>() has no src component in the key. Confirmed: memoize(regex(/[a-z]+/)).parse('hello') seeds MEMO[(P.id,0)]; subsequent parse on Pa
  - _→_ Needs born-RED gate: 'cross-input pollution — memoize without reset returns stale result'. Fix: auto-reset on src change (one ptr comparison per memoizeFn call,
- **[HIGH·correctness]** getCijKey 32-bit overflow: parser IDs >= 4096 alias to IDs 0–4095, silently mixing memo cells
  - _ev:_ typescript/src/parse/packrat.ts:55-57 — getCijKey = (id << 20) | (offset & MEMO_MAX_OFFSET). JS bitwise ops coerce to 32-bit signed int; (4096 << 20) === 0. Runtime-confirmed: ids 4096..8191 produce i
  - _→_ Replace (id << MEMO_OFFSET_BITS) | (offset & MEMO_MAX_OFFSET) with id * 1048576 + offset (pure float64, no overflow until id > 2^33). Benchmarked: multiply is ~

**Novel ideas:**

- [incremental·correctness] **Auto-reset on src change: src-identity guard in memoizeFn eliminates cross-input cache pollution transparently**
  - _mech:_ Add module-global let CURRENT_SRC: string | undefined = undefined. In memoizeFn (packrat.ts:253), insert: if (state.src !== CURRENT_SRC) { resetPackrat(); CURRENT_SRC = state.src; }. Cost: one === com
  - _payoff:_ Eliminates the confirmed cross-input pollution defect without requiring callers to manually call resetPackrat() between  · _feas:_ Straightforward. One risk: if the same string literal is used as input for two different logical parse sessions (same content, dif
  - _gate:_ Born-RED test: memoize(regex(/[a-z]+/)).parse('hello'); then apply same memoized parser to ParserState('CAPS123') WITHOU
- [incremental·perf] **Float64-safe multiply key: replace (id << 20) | offset with id * 1048576 + offset to eliminate 32-bit overflow at id >= 4096**
  - _mech:_ Replace getCijKey in packrat.ts:55-57: return id * 1048576 + (offset); (no bitwise AND needed for offset if offset < 2^20, or keep & MEMO_MAX_OFFSET for the offset clamp). The result lives in JS float
  - _payoff:_ Eliminates the id-overflow collision at id >= 4096 AND provides a marginal speed improvement. Two problems fixed with on · _feas:_ Drop-in replacement. Only concern: the offset must be < 2^20 (1MB) to avoid collisions in the float64 key. This is the same constr
  - _gate:_ Born-RED test: create 4096 dummy parsers, verify getCijKey(ids[0], 0) !== getCijKey(ids[4096], 0). Passes immediately af
- [aggressive·arch] **Split MEMO into MEMO_DONE and MEMO_LR: separate Answer cache from in-progress LR markers for a cleaner hot path**
  - _mech:_ Replace the single MEMO: Map<number, MemoCell> with two maps: MEMO_DONE: Map<number, Answer> (plain results only) and MEMO_LR: Map<number, LR> (in-progress markers only). In memoizeFn: check MEMO_LR f
  - _payoff:_ Eliminates the isLR() type guard check on every cache hit, removes the MemoCell wrapper allocation (each cell is now jus · _feas:_ Non-trivial refactor of ~60 lines, but the algorithm is unchanged. Tempting-but-wrong risk: the shared MEMO is required for WDM mu
  - _gate:_ All existing memoize.test.ts tests pass (7 tests including mSL, sS, math again, and the soundness oracle). Plus: add a t
- [radical·arch] **Per-src WeakRef epoch counter: make resetPackrat() automatic and scope the cache to the live src object's lifetime**
  - _mech:_ Instead of a string-keyed src guard (which requires the same string object for identity), maintain CURRENT_SRC_REF: WeakRef<object> where the 'object' is a thin wrapper around the src string created a
  - _payoff:_ Fully automatic, zero-user-discipline cache lifecycle. No manual resetPackrat() calls ever needed. Cache entries for com · _feas:_ Complex: requires coordinating WeakRef + FinalizationRegistry + epoch arithmetic. FinalizationRegistry callbacks are async (fire o
  - _gate:_ Born-RED test: same as cross-input pollution test. GREEN only after epoch-based cache is implemented AND the Finalizatio
- [incremental·correctness] **try/finally guard on LR_STACK pop + MEMO cleanup to make memoizeFn exception-safe**
  - _mech:_ In packrat.ts:264-284 (memoizeFn), wrap the evalParser call: try { evalParser(state, pos); } finally { LR_STACK = lr.next; }. Also: if the exception path leaves a key in MEMO pointing to an LR marker 
  - _payoff:_ Makes the packrat tier exception-safe. After any thrown error, LR_STACK and MEMO are consistent, allowing continued use  · _feas:_ Straightforward. The only concern is performance: try/finally adds a minor overhead on the hot path. In V8, try/finally without an
  - _gate:_ Born-RED test: create memoize(string('a').map(() => { throw new Error(); })), call parse('a'), catch exception, then wit

**Recs:** Add a born-RED correctness gate to memoize.test.ts: 'cross-input pollution — memoize without reset gives wrong result for different src'. This makes t · Replace (id << MEMO_OFFSET_BITS) | (offset & MEMO_MAX_OFFSET) with id * 1048576 + offset in getCijKey (packrat.ts:55-57). This eliminates the 32-bit o · Add try/finally around the evalParser call in memoizeFn (packrat.ts:270) to restore LR_STACK even when a downstream parser or map callback throws. Two · Consider implementing auto-reset on src change (if (state.src !== CURRENT_SRC) { resetPackrat(); CURRENT_SRC = state.src; } at the top of memoizeFn) a · Document the snapshot() by-reference constraint explicitly in the memoize() JSDoc: 'Memoized parsers must not mutate their output values; the Answer c

---

## P4-codegen-span

SpanParser §7's runtime jump-table premise was correctly FALSIFIED on V8 (~10-14% slower than closure dispatch; parse-that/typescript/src/parse/span.ts:558-573), but the falsification record was honest enough to PRESERVE the right artifact: callSpan() is a tree-walking INTERPRETER over a flat, closure-free tagged-union (SpanParser type, span.ts:599-609) — exactly the introspectable data foundation a codegen needs. The unrealized, boldest cross-repo play is to flip interpretation into COMPILATION: a BBNF/SpanParser→JS code generator that emits one monomorphic, near-zero-alloc specialized function for value.js's CSS-value grammar, attacking a measured ~4.7 MB/s value-parser / ~7.9 MB/s stylesheet floor (value.js/bench/css-parse-perf.mjs, observed live) that is 10-50x slower than even Rust's BBNF-generated 61-159 MB/s. value.js already proved the LUT win it could harvest (dispatch() first-char table, leaf.ts:60 / value.js index.ts:425) but ABANDONED the SpanParser jump-table consume O.W6 planned (O.W6.md:51-52, 237-239) because the premise died — leaving the consume-spine on a closure combinator tree whose ~30-way bucket ICs and per-token .map() semantic-action allocations (value.js parsing: 200 .map/any/all callsites across 4886 LoC) are precisely what codegen erases. The codegen tier is the only path that recovers the §7 perf thesis without re-attempting the falsified runtime switch.

**Critical findings:**

- **[HIGH·deferred]** §7 SpanParser runtime-dispatch perf premise FALSIFIED on V8, correctly retired but unreplaced — the perf thesis has no terminal home
  - _ev:_ parse-that/typescript/src/parse/span.ts:558-564 'the tagged callSpan switch-dispatch is ~10-14% SLOWER than the closure altSpan lane ... V8's monomorphic-per-call-site closure dispatch with inlining b
  - _→_ Open a codegen tranche that owns the §7 perf thesis's surviving form: BBNF/SpanParser→specialized-JS. The falsification explicitly blesses 'a generated speciali
- **[HIGH·deferred]** value.js O.W6 PLANNED to consume SpanParser jump-table for its hot path, then silently fell back to dispatch() LUT only — the cross-repo consume edge is dead
  - _ev:_ value.js/docs/tranches/O/waves/O.W6.md:9-10 'the V8 jump-table optimization in S3 requires consuming the SpanParser API from parse-that ./core' and :51-52 'parse-that A.W3's SpanParser tagged-union ex
  - _→_ Record the consume-edge as KILLED-by-falsification in the campaign ledger, and re-route value.js's intended speedup through the codegen tier instead — same spin
- **[HIGH·risk]** value.js CSS value-parser measured at ~4.7 MB/s — the consume spine kf frame-compilation rides is 10-50x slower than Rust's own BBNF-generated path
  - _ev:_ Ran value.js/bench/css-parse-perf.mjs live: 'value-parser 4.7 MB/s, stylesheet-parser 7.9 MB/s'. parse-that future-research.md (Resolved §5): 'CSS L1.75: 229-457 MB/s. BBNF CSS: 61-159 MB/s'. kf consu
  - _→_ Set the codegen born-RED gate's target from this measured 4.7 MB/s floor (MEASURE-FIRST, per O.W6.md:76-81), not from a claimed percentage. A 2-3x close to ~10-

**Novel ideas:**

- [radical·codegen] **BBNF→specialized-JS codegen: emit ONE monomorphic recognizer function for value.js's CSS-value grammar (the cross-repo perf spine), compilin**
  - _mech:_ Walk the SpanParser tagged-union (span.ts:599-609, already closure-free + introspectable) — or value.js's grammar declared in a BBNF source — and EMIT JS source as a string: each Alt becomes a first-c
  - _payoff:_ Recovers the §7 perf thesis that runtime dispatch could not. Target: close value.js's measured 4.7 MB/s value-parser tow · _feas:_ HIGH-RISK/HIGH-REWARD. The TEMPTING-BUT-WRONG trap (recall SpanParser itself): do NOT codegen a runtime interpreter dressed as a f
  - _gate:_ Born-RED, MEASURE-FIRST, two-clause: (A) generated-parser AST output is byte-identical to the combinator parser over val
- [aggressive·perf] **Linearize the SpanParser TREE into a flat Int32Array op-tape + emit a single non-recursive driver — the IR that makes codegen tractable and **
  - _mech:_ Today callSpan (span.ts:684-886) RECURSES and allocates a Span object literal per match (e.g. line 752 unsafeSetValue({start, end})). Lower the SpanParser tree to a flat op-array: each node → an opcod
  - _payoff:_ Removes the recursion overhead AND the per-match allocation that callSpan still pays — the prerequisite IR for emit, and · _feas:_ MED. The flat-tape IR is well-trodden (it's how regex VMs and the Rust regex/generated.rs path work). Risk: the manual-stack inter
  - _gate:_ Born-RED: a heap-alloc-count gate (mirror value.js's proof:gamut-alloc, O.md:343) over a Many(takeUntilAny) scan of a 60
- [aggressive·arch] **Build-time grammar-to-source generation: ship value.js's CSS-value parser as a GENERATED, checked-in .ts file (no runtime eval), with the co**
  - _mech:_ Declare value.js's CSS-value grammar once (BBNF or the SpanParser builders span.ts:614-672). A build step (parse-that codegen) emits src/parsing/generated-value-parser.ts — straight-line, no combinato
  - _payoff:_ Decouples the perf surface from the spec surface: the grammar stays readable + correct; the shipped parser is fast + mon · _feas:_ MED-HIGH. Build-time emit dodges eval/CSP. Risk: keeping generated≡spec green as the grammar evolves (O.W4/O.W5 added grammar) — m
  - _gate:_ Born-RED, two-clause: (A) CI equivalence gate — generated-value-parser AST ≡ combinator AST over the full value.js test 
- [radical·arch] **Cross-repo codegen as the campaign's perf SPINE: parse-that ships the codegen tool → value.js consumes it to generate its parser → kf inheri**
  - _mech:_ Re-wire the abandoned O.W6 consume edge (O.W6.md:51,237 — SpanParser jump-table, now dead) into a codegen edge: parse-that exports a @mkbabb/parse-that/codegen subpath (a new entry alongside ./core, A
  - _payoff:_ Gives the constellation campaign its missing perf payload: A.W3 delivered subpaths + a FALSIFIED dispatch optimization;  · _feas:_ HIGH-RISK (3-repo coordination, DAG-ordered builds) but the campaign already operates in this exact DAG order (parse-that→value.js
  - _gate:_ Born-RED, end-to-end: a kf-side bench — compile a representative @keyframes template via frame-compiler (frame-compiler.

**Recs:** Open a dedicated CODEGEN tranche that owns the surviving §7 perf thesis (BBNF/SpanParser→specialized-JS). The falsification at parse-that/typescript/s · Set every codegen gate's target from the LIVE-measured value.js baseline (4.7 MB/s value-parser, 7.9 MB/s stylesheet via value.js/bench/css-parse-perf · Emit at BUILD time into a checked-in generated .ts in value.js (not runtime new Function) to dodge CSP/eval and keep the output reviewable; retain the · Lower the SpanParser tree to a flat op-tape IR FIRST (the future-research §7 'flat array-of-ops'); this both enables straight-line emit and independen · Re-route the dead parse-that→value.js SpanParser-consume edge (value.js O.W6.md:51,237, abandoned post-falsification) into a codegen subpath edge (new · If no codegen tranche is scheduled this campaign, set a named KILL for the retained SpanParser tagged-union + its bench (span.ts:549-902) per P-inv-28

---

## P5-defer-plan

parse-that Tranche A delivered all four waves cleanly against 0.11.0 (CLOSED 2026-06-19), but three plan premises were falsified at implementation time, each producing a durable deferred item or constraint on Tranche B scope. The SpanParser perf hypothesis (D7) is dead as a dispatch-speed win but survives as an internal codegen-data foundation. The packrat surgical fix (D4) was algorithmically wrong and the full WDM algorithm landed instead, which is correct. The A.W1 gate was unsound (grepped the barrel's export-star lines instead of the bundled runtime surface, corrected in-flight). One structural latent risk is live: getCijKey uses JS signed-int32 bit-shift, overflowing silently for parser IDs >= 2048, which a large statically-constructed grammar could approach. Three items from the A KILL/deferred ledger are unaddressed and ready to charter: the all() drop-undefined footgun (D8), the console.error diagnostic leak in parser.ts:50, and the BBNF codegen tier built on the SpanParser tagged-union as an AST foundation. A Tranche B should be correctness + codegen focused: fix all() with a new allStrict() variant, add setDiagnosticLogger(), address the packrat key overflow for inputs over 1MB or grammars over 2048 parsers, and build the BBNF codegen tier that the falsified SpanParser perf bench now validates as a pure codegen data structure.

**Critical findings:**

- **[HIGH·deferred]** all() drop-undefined footgun (D8) — DEFERRED, still live in leaf.ts:125
  - _ev:_ parse-that/typescript/src/parse/leaf.ts:125 — 'if (state.value !== undefined) { matches.push(state.value); }'. value.js/src/parsing/index.ts:188-196 documents the D8 workaround: 'D8 (O.W0): the body i
  - _→_ The footgun is still present and value.js still routes around it. The blast radius of changing all() global semantics is constellation-wide. The correct Tranche
- **[HIGH·risk]** getCijKey signed-int32 overflow for parser IDs >= 2048 — latent correctness risk
  - _ev:_ parse-that/typescript/src/parse/packrat.ts:52-56 — 'const MEMO_OFFSET_BITS = 20; function getCijKey(parser, offset) { return (parser.id << MEMO_OFFSET_BITS) | (offset & MEMO_MAX_OFFSET); }'. JavaScrip
  - _→_ Any grammar that constructs more than 2048 Parser instances silently collides memo keys (negative key wraps into the positive range, colliding with parsers havi

**Novel ideas:**

- [incremental·correctness] **allStrict() combinator — undefined-preserving variant of all() with optional behavior flag**
  - _mech:_ leaf.ts:107-136 — add allStrict() as a new export that does NOT have the 'if (state.value !== undefined) matches.push(state.value)' exclusion clause. The existing all() stays unchanged (backward-compa
  - _payoff:_ Eliminates a footgun that caused a P0 crash in value.js (the linear-gradient parser). Future consumers building optional · _feas:_ Zero blast radius to existing consumers — all() behavior unchanged. allStrict() is purely additive. Risk: some callers may be rely
  - _gate:_ test/all-strict.test.ts: allStrict(string('x').opt()).parse('y') === [undefined]; all(string('x').opt()).parse('y') === 
- [incremental·correctness] **Composite BigInt/string memo key to eliminate getCijKey int32 overflow and offset truncation**
  - _mech:_ packrat.ts:55-56 — replace getCijKey with a Map<string, MemoCell> keyed on `${p.id}:${offset}` (template-literal string key, no bit arithmetic). Eliminates both the id >= 2048 overflow and the offset 
  - _payoff:_ Makes the packrat tier safe for grammars with any number of parsers parsing inputs of any size. Eliminates a latent corr · _feas:_ The WDM algorithm itself is correct — only the key encoding is broken. Template-literal string Map key is a 3-line change. Perf im
  - _gate:_ memoize.test.ts: construct 2049 memoized parsers and assert that parser 2048 at offset 0 does not collide with parser 0 
- [aggressive·codegen] **BBNF codegen tier: SpanParser tree-walk to emit a specialized flat-function grammar**
  - _mech:_ span.ts:549-902 — SpanParser tagged-union is already the correct AST: it is allocation-free, serializable, and walkable. A new ./codegen subpath exports a function spanParserToFunction(sp: SpanParser,
  - _payoff:_ Closes the 0.58x BBNF-to-hand-rolled gap identified in future-research §11. The emitted function avoids the recursive sw · _feas:_ Tempting but potentially overfit: the SpanParser AST is complete enough to walk, but emitting correct JS for all 10 node kinds (in
  - _gate:_ test/codegen.test.ts: spanParserToFunction(manySpanNode(regexSpanNode(/[a-z]+/)), 'ident') emits a string that, when eva
- [incremental·arch] **setDiagnosticLogger() redirect API — replace hard-coded console.error at parser.ts:50**
  - _mech:_ utils.ts (the ./diagnostics subpath) — add a module-level let diagnosticLogger: (msg: string) => void = console.error and a setDiagnosticLogger(fn) export. parser.ts:50's console.error(this.state.toSt
  - _payoff:_ Consumers (value.js, keyframes.js, test harnesses) can redirect or suppress diagnostic output without monkey-patching co · _feas:_ Zero blast radius — additive, backward-compatible. The default behavior (console.error on diagnostic-enabled parse failure) is unc
  - _gate:_ test/diagnostic-logger.test.ts: const captured = []; setDiagnosticLogger(msg => captured.push(msg)); enableDiagnostics()
- [incremental·perf] **Bench CI automation — GitHub Actions step posts throughput delta as PR comment**
  - _mech:_ package.json scripts: add 'bench': 'vitest bench --reporter=json --outputFile=bench-results.json'. Add .github/workflows/bench.yml that runs npm run bench on PRs, compares to base-branch result (cache
  - _payoff:_ Prevents silent perf regressions. The SpanParser falsification record (span-dispatch.bench.ts) becomes a CI artifact tha · _feas:_ Mechanical CI addition. Risk: benchmark noise on GitHub-hosted runners (shared VMs give non-deterministic results). Mitigation: po
  - _gate:_ A PR that introduces a 15% regression in json-comprehensive receives an automated comment flagging it. Born-RED today: n

**Recs:** Tranche B.W0 (immediate, low-risk): add setDiagnosticLogger() to ./diagnostics subpath; fix parser.ts:50 console.error hard-coding; add package.json ' · Tranche B.W1 (correctness): add allStrict() to leaf.ts as undefined-preserving variant of all(); coordinate with value.js to retire the D8 workaround  · Tranche B.W2 (soundness): replace getCijKey int32 bit-shift scheme in packrat.ts with a composite string or BigInt key that is safe for any parser ID  · Tranche B.W3 (codegen foundation): build ./codegen subpath that walks the internal SpanParser tagged-union and emits specialized flat-function JS; sta · Do NOT re-attempt SpanParser as a dispatch-speed optimization on V8/TS: future-research.md §7 explicitly records the falsification record. Any future  · Adopt the corrected gate discipline from A.W1: for any new subpath or dist-surface gate, inspect the compiled bundled output (dist/core.js, dist/packr

---

## K1-engine-perf

The keyframes.js engine is genuinely SOTA in its STEADY-STATE allocation discipline (the F.W4 stable-key null-fill, the alias fast-path, the C1 computed-endpoint cache, the B3 color SoA plan in value.js) — O.W8 correctly declares "the engine perf is already SOTA" and ships zero engine code beyond two micro-edits. But the INTERPOLATION ARITHMETIC itself is still AoS: the HEAVY path (CSSKeyframesAnimation.processFrame, AnimationGroup.transformFramesGrouped) lerps over BOXED ValueUnit objects per-channel via lerpValue closure-dispatch and blends with for..in over Record<string,ValueUnit[]>, while the LIGHT NumericAnimation already proved Float64Array+lerpArray SoA wins (3.86x in spring-vector-decision.json; a bench-only J.W6 S2 prototype in interp-buffer.bench.ts shows the same on the engine corpus but was NEVER adopted). The largest unclaimed wins: (1) a real SoA Float64Array compositor over the numeric leaf subset, (2) the two O.W8-scoped micro-edits (DOM-write out-buffer, reconcileVars O(N²)→O(1)) which remain UN-IMPLEMENTED on the real tree, (3) WAAPI maximalism — color/computed today hard-bail to main-thread rAF. O.W8 is purely a MEASUREMENT wave; the actual transpositions are the generative frontier this lane owns.

**Critical findings:**

- **[HIGH·correctness]** reconcileVars O(N²) findIndex inner scan — the CF-2 guard's O(1) claim is defeated
  - _ev:_ keyframes.js frame-compiler.ts:418 `const frameIx = this.frames.findIndex((f) => f.ixs.start === startIx && f.ixs.stop === endIx)` runs inside the per-var loop (line 400 `for (const v of Object.keys(s
  - _→_ O.W8 S9 scopes the cure (a Map keyed by startIx*FRAME_ID_SCALE+endIx) but it is DOCS-ONLY/UN-IMPLEMENTED. A real compile-time quadratic at large stop counts; th
- **[HIGH·gap]** transformTargetsStyle allocates a fresh Record<string,string> EVERY rAF frame on the DOM-write path
  - _ev:_ keyframes.js utils.ts:417 `const styleStringVars = unflattenObjectToString(vars)` — called with NO `out` buffer on the default-renderer apply path (reached from processFrame→frame.transform every fram
  - _→_ O.W8 S8 scopes a module-scope `const _styleOut = {}` passed as `out`, gated by a proof:standalone-zero-alloc heap-delta extension. DOCS-ONLY/UN-IMPLEMENTED. The
- **[HIGH·transposition]** HEAVY interp path is per-channel boxed-ValueUnit AoS while LIGHT NumericAnimation already runs Float64Array SoA — proven 3.86x but never transposed to the engine
  - _ev:_ keyframes.js engine.ts:754 `for (const iv of frame.allInterpVars) lerpValue(eased, iv)` mutates boxed `iv.value` per channel via closure dispatch; numeric.ts:201 `lerpArray(seg.from, seg.to, eased, _o
  - _→_ The J.W6 S2 SoA arm was an ADOPT-or-KILL bench prototype (≥20% at K=8) that was never wired into the engine. This is the lane's primary generative target — see 

**Novel ideas:**

- [aggressive·perf] **SoA Float64Array interpolation in the real engine: emit a per-frame numeric SoA plan at parse (from/to Float64Array + a destination-ValueUni**
  - _mech:_ frame-compiler.ts:497 finalizeFrameVars already builds `allInterpVars = Object.values(frame.interpVars).flat()`; extend it to partition numeric-only leaves into `frame.soaFrom/soaTo: Float64Array` + `
  - _payoff:_ The dispatch-only arm (interp-buffer.bench.ts:251-263) isolates the K=8 closure-dispatch overhead; spring-vector-decisio · _feas:_ HIGH — value.js's lerpArray is published and already imported in the bench; the LIGHT tier proves the pattern. TEMPTING-BUT-WRONG 
  - _gate:_ Born-RED: a `proof:soa-interp` ratio arm in taxonomy.json — SoA-engine-hz / per-channel-engine-hz at K=8 over the FULL i
- [radical·arch] **SoA composite buffer for AnimationGroup: replace the per-layer `Record<string,ValueUnit[]>` blend with a single contiguous Float64Array comp**
  - _mech:_ group.ts:302-360 blends boxed leaves with for..in + Array.isArray + per-element isNumericUnit. Transpose: at structural-change time (the existing _groupedKeysDirty seam, group.ts:249) build a flat (ke
  - _payoff:_ The compositor is the multi-animation hot path (every group draw frame, every child). A contiguous typed-array fold is v · _feas:_ MED — the key-stability invariant already exists (_groupedKeys, computeGroupedKeys); the hard part is the numeric/non-numeric part
  - _gate:_ Born-RED: extend proof:zero-alloc's heap-delta arm (test/zero-alloc.test.ts:107) into a throughput ratio — SoA-composite
- [aggressive·perf] **WAAPI color maximalism: when an animation's ONLY ineligibility is color interpolation, pre-densify the perceptual (oklab) ramp into N interm**
  - _mech:_ waapi.ts:225-228 currently hard-bails color (`requires perceptual lerp`). value.js already densifies oklch/oklab ramps at the COMPILE leg (the densify arm O.W8 S2 benches). Pre-sample the perceptual c
  - _payoff:_ Lifts every color animation (a huge fraction of real keyframes content) off main-thread rAF onto the compositor — INP/ja · _feas:_ MED — needs a compile-time densify-to-sRGB-stops helper and a faithfulness gate. TEMPTING-BUT-WRONG: densified stops are only HW-a
  - _gate:_ Born-RED: a playwright pixel-readback gate (precedent: proof:computed-real-dom, bench/playwright.bench.ts) — the densifi
- [aggressive·perf] **WAAPI computed-unit maximalism: delegate viewport/container-unit (vh/cqw/calc) animations to the compositor by baking the C1-resolved px end**
  - _mech:_ waapi.ts:220 force-rejects layout-dependent units (`would freeze to px under WAAPI`). But value.js's C1 cache (interpolate.ts:38) ALREADY resolves these to fixed px per (target,epoch) — the exact 'fre
  - _payoff:_ Lifts cq*/vh/calc animations (the demo's signature AnimationVisualizer ball) onto the compositor; today they are the sin · _feas:_ MED-LOW — the rebuild-on-epoch lifecycle is the cost; the booked per-target ResizeObserver non-action (engine CLAUDE.md) is the sa
  - _gate:_ Born-RED: proof:waapi-computed — a vh-animation under WAAPI must report waapiDelegated===true AND, after a synthetic bum
- [incremental·perf] **Compile-leg SoA densify cache: when value.js Tranche P ships the color-math zero-alloc rewrites, gate the engine's densify COMPILE leg on a **
  - _mech:_ O.W8 S2 stubs bench/color-interp.bench.ts with a densify-COMPILE arm but classifies it observe-only and DEFERS the budgeted graduation to the value.js-P consume (O.W8.md:99-102, KF-TO-VALUEJS-P-ASKS.m
  - _payoff:_ Closes the P-inv-28 loop on the value.js-P color-math dispatch — turns a tracked-but-unmeasured cross-repo frontier into · _feas:_ HIGH — the bench scaffold and the crossRepo[] dispatch already exist (taxonomy.json:264); only the graduation trigger is deferred.
  - _gate:_ Born-RED: on the value.js-P re-pin, color-interp.bench.ts densify-COMPILE hz must exceed the recorded pre-P baseline × 1

**Recs:** Implement the two O.W8-scoped micro-edits FIRST (they are docs-only/un-implemented on the real tree): utils.ts:417 transformTargetsStyle gets a module · Promote the J.W6 S2 SoA arm from bench-only prototype to a real engine path: partition numeric leaves in finalizeFrameVars into per-frame Float64Array · Pursue the SoA composite buffer for AnimationGroup as the radical compositor transposition: a contiguous Float64Array accumulator indexed by the exist · Frame WAAPI maximalism (color densify, computed px-bake) as the compositor-coverage expansion: today two whole animation classes hard-bail to main-thr · Record each transposition's verdict in a decision JSON beside spring-vector-decision.json (P-inv-28 terminal home): ADOPT authorizes the engine edit,  · Scope OUT of the perf frontier: the tryParseLeaves bounded-LRU (compile-time, correctly bounded) and the computed-unit per-frame round-trip (already e

---

## K2-arch-transpose

O.W7's engine-seam plan (1397→~900L via a colocated INTERNAL `engine-playback.ts`, the `engine-composition.ts` precedent) is sound but UNDER-ambitious: it is a file-shrink, not a transposition. The deeper truth the plan misses is that the "lifecycle/playback machine" is NOT engine-internal — `advanceTo`/`interpFrames`/`startTime`/`pausedTime`/`settle` are a public DRIVER PROTOCOL that `Sequence` (sequence.ts:426,497), `AnimationGroup` (group-layer-springs.ts:164,201), and `ingest` (ingest.ts:268,345) all reach into directly. Lifting it into a `this`-delegate helper preserves the god-object's coupling under a new filename; the elegant move is to FORMALIZE that protocol (a `Playhead`/`Driver` interface RAFPlayback already half-implies) and make `KeyframesAnimation` a thin compile-facade that COMPOSES a playhead, killing the inheritance-plus-four-reach-ins shape. Separately, O.W7 stays correctly blocked on value.js-P VJ-L1 (the FN_NAME Symbol on a foreign ValueUnit, utils.ts:45) — a real risk — but O.W9's no-legacy cuts and a clock-injection transposition are unblocked NOW and would each de-risk the eventual seam. The boundary/dynamic-split architecture (load-engine.ts) is genuinely excellent and should not be touched.

**Critical findings:**

- **[HIGH·deferred]** O.W7 lifts concern-3 as a `this`-delegate helper — preserves the god-object coupling under a new filename, not a true transposition
  - _ev:_ docs/tranches/O/waves/O.W7.md:129-133 (`Playback methods become thin `this`-delegates whose bodies live in `engine-playback.ts``) + M.W13.md:104-108 names the binding choice (a) `this`-delegate or (b)
  - _→_ Push O.W7 to choose binding (b) AND formalize the host as a published `Driver`/`Playhead` protocol, not a private `PlaybackHost`. The acceptance is not ~900L; i
- **[HIGH·transposition]** The 'lifecycle/playback machine' is a PUBLIC driver protocol reached by 3 external modules — not engine-internal as O.W7/M.W13 frame it
  - _ev:_ `advanceTo`/`interpFrames`/`startTime`/`pausedTime`/`settle` are reached into from OUTSIDE engine.ts: sequence.ts:426 (`animation.startTime = at`), :497 (`await animation.advanceTo(phase)`), group-lay
  - _→_ This is the real seam D.W4 named and every tranche mis-located. The transposition: extract a `Playhead` value-object (clock + t + iteration + flags + advanceTo/
- **[HIGH·workaround]** FN_NAME Symbol stamped onto foreign value.js ValueUnit instances is the real blocker — a genuine cross-realm invisible-state coupling
  - _ev:_ utils.ts:45 `const FN_NAME = Symbol("kf.fnName")`; stamped at :55, re-stamped on every clone at :64/:293 because `ValueUnit.clone()` drops it (:42-43 docstring). 12 grep hits across utils.ts. kf write
  - _→_ Correctly dispatched to value.js-P VJ-L1 `flatLeaf(valueUnit,{fnName})` (KF-TO-VALUEJS-P-ASKS.md). This is the ONE genuinely-blocked arm. Keep it gated; do NOT 

**Novel ideas:**

- [radical·arch] **Transpose concern-3 into a standalone `Playhead` value-object that the engine COMPOSES and Sequence/Group/ingest DRIVE through a typed handl**
  - _mech:_ Today Sequence pokes `animation.startTime = at` (sequence.ts:426) and `await animation.advanceTo(phase)` (:497); ingest pokes `animation.startTime = now - t` (ingest.ts:345); group-layer-springs calls
  - _payoff:_ Kills the god-object at the TRUE seam (the driver protocol), not a filename. Makes the four external drivers type-safe i · _feas:_ Risk: the `this.options === this.compiler.options` live-options identity (engine.ts:402) + setDuration re-reading this.frames (eng
  - _gate:_ Born-RED: author `proof:playhead-decoupled` asserting `engine-playback.ts` has ZERO import of `KeyframesAnimation` (grep
- [aggressive·arch] **Inject the clock into the engine (a `Clock` seam) so play/advance is driver-agnostic — unifying rAF, WAAPI shadow, Sequence master-playhead,**
  - _mech:_ advanceTo(t) already takes an absolute clock (engine.ts:859) but play() hard-wires `this.playback.loop` (engine.ts:954). Sequence/Group already drive advanceTo from THEIR clock — proving the engine is
  - _payoff:_ Deletes the `startTime = at` raw pokes in Sequence (sequence.ts:426) and ingest (ingest.ts:345) — they become `child.att · _feas:_ RAFPlayback is already the sole rAF owner (playback.ts:60) and arrow-bound bind-proof (playback.ts:63-77), so it satisfies a Clock
  - _gate:_ Born-RED: `proof:manual-clock-drive` — construct an Animation, inject a ManualClock, step it 60 frames, assert effective
- [incremental·arch] **Unify the hand-rolled TRANSPORT shell (play/pause/resume/stop/finished + the re-entrant _playingPromise guard) across engine, group, and seq**
  - _mech:_ engine.ts:1042-1078 (play with _playingPromise re-entry + finally-clear) is near-byte-identical to group.ts:530-548; engine.ts:1120-1125 stop() ≈ group.ts:669-675; `get finished` is identical (engine.
  - _payoff:_ Deletes ~3 copies of the re-entrant play guard + the finished getter + the stop/settle/_resolvePlay triad — the exact du · _feas:_ Low risk — pure structural lift of already-identical code; no behaviour change. The only subtlety is the managed-vs-standalone bra
  - _gate:_ Born-RED: `proof:transport-unified` greps that engine.ts/group.ts/sequence.ts carry NO local `_playingPromise` field dec
- [aggressive·arch] **Collapse the `CSSKeyframesAnimation extends KeyframesAnimation` subtype into a `parseCSS()` free-function factory at the 5.0.0 cut — parsing**
  - _mech:_ CSSKeyframesAnimation overrides NO behaviour (engine.ts:1207-1378) — it only adds parse methods that populate the base + flips `unflatten=false` (:1214). Replace `new CSSKeyframesAnimation(opts).fromS
  - _payoff:_ Retires an inheritance axis that exists only to attach parse methods — the clearest 'wrong abstraction' in the engine. O · _feas:_ BREAKING (the constructor + the published CSSKeyframesAnimation type) — belongs at O.WZ's 5.0.0 cut, NOT O.W7 (M.W13.md:571 correc
  - _gate:_ Born-RED: `proof:no-css-subclass` asserts the published d.ts has NO `CSSKeyframesAnimation extends` declaration + every 

**Recs:** AUTHORIZE the Playhead value-object transposition (novelIdea 1) as the REAL O.W7 — go deeper than ~900L. Re-scope O.W7 so its acceptance gate is `engi · DECOUPLE the structural win from value.js-P: the FN_NAME Symbol (utils.ts:45) lives in the COMPILE half (utils.ts flatten), not the playback machine.  · Land O.W9's no-legacy cuts (drop @deprecated Animation alias engine.ts:1205, ScrollTimeline aliases, leaves.ts→value.js/math) NOW — they are unblocked · Add the clock-injection seam (novelIdea 2) as the testability dividend of the Playhead split — it deletes Sequence/ingest's raw `startTime =` pokes (s · Unify the hand-rolled Transport shell (novelIdea 3) in the SAME pass — the re-entrant _playingPromise guard is copied near-identically in engine.ts:10 · Do NOT touch the LIGHT/HEAVY boundary or load-engine.ts granular accessors — they are the library's best architecture (a strength). Any engine split m · Reserve the CSSKeyframesAnimation-subclass-to-factory inversion (novelIdea 4) for O.WZ's 5.0.0 cut — it is the right elegance but breaking; tie it to  · Remove the `number | Promise<number>` union from advanceTo by awaiting the delay sleep before the loop starts — the once-per-play async case currently

---

## K3-opt-vs-O

O.W8 is an honest measurement-honesty wave: it scopes zero engine-strategy changes and instead adds 7 new bench/gate arms (S1-S9) to close 7 un-measured gaps catalogued by the 32-lane re-audit. The HEAVY engine's interpolation hot path (processFrame→lerpValue per-channel on each iv in frame.allInterpVars) is architecturally SOTA at the NumericAnimation LIGHT tier (Float64Array + lerpArray) but has never received SoA treatment in CSSKeyframesAnimation itself, leaving an unmeasured multi-channel win on the table. Two genuine zero-alloc engine micro-edits (S8: per-frame Record alloc in transformTargetsStyle; S9: O(N) findIndex in reconcileVars) are new — but the main thesis is gate-apparatus, not strategy change. An aggressive-optimization tranche beyond O.W8 would need to: (1) extend SoA to the HEAVY path's processFrame for pure-numeric segments; (2) introduce color-interp SoA with Float64Array channel plans already sketched in value.js's lerpColorValue; (3) resolve the postTask INP keystone with a real-browser measurement; (4) exploit the value.js /math subpath to delete the leaves.ts inline; and (5) drive the warmEngine budgeted floor from an absolute wall-clock to a device-independent ratio. The portable-gate discipline (every HARD predicate as a same-report ratio) is the most durable structural contribution O.W8 ratifies.

**Critical findings:**

- **[HIGH·gap]** bench/numeric-soa.bench.ts and bench/color-interp.bench.ts are ENOENT on the live tree
  - _ev:_ keyframes.js/bench/ — `ls bench/numeric-soa.bench.ts bench/color-interp.bench.ts` → both ENOENT (verified live). O.W8.md:45-53 documents both as un-measured gaps. NumericAnimation.at() SoA claim is ba
  - _→_ O.W8 S1+S2 gate these missing files as born-RED coverage failures in proof:bench-taxonomy. Without them the SoA and color-interp PLAY/COMPILE legs are unvalidat
- **[HIGH·gap]** proof:scheduler-posttask GREEN-by-SKIP — the INP delta has never been measured in a real browser
  - _ev:_ scripts/proof-scheduler-posttask.mjs:31 — the postTask arm SKIPs in jsdom (the only env that gate ever ran in). scripts/scheduler-posttask-decision.json ENOENT (verified). O.W8.md:56-59: 'the gate has
  - _→_ O.W8 S4 re-targets the gate onto a real-browser Playwright-core harness that MEASURES the INP delta and records ADOPT or KILL in scheduler-posttask-decision.jso
- **[HIGH·gap]** taxonomy.json budgeted arms route every floor-miss through declarePosture(observe-only) — a 2× regression stays GREEN
  - _ev:_ bench/taxonomy.json:floorFraction+baselineCase entries exist for SoA and spring-vector arms, but proof-bench-taxonomy.mjs:66-70 + ci-env.mjs:63-65 apply observe-only posture in CI. The warmEngine arm 
  - _→_ O.W8 S5 splits each budgeted arm into a device-INDEPENDENT ratio (HARD via declarePosture(hard), numerator and denominator from same report) + absolute magnitud
- **[HIGH·gap]** transformTargetsStyle allocates a fresh Record<string,string> per rAF frame via unflattenObjectToString without out buffer
  - _ev:_ src/animation/utils.ts:417 — `const styleStringVars = unflattenObjectToString(vars);` with no second argument. value.js/src/units/utils.ts:188-220 — unflattenObjectToString already accepts an optional
  - _→_ O.W8 S8 hoists a module-scope const _styleOut: Record<string,string> = {} in utils.ts and passes it as the out arg, eliminating the per-frame allocation. Gate: 

**Novel ideas:**

- [aggressive·perf] **Extend SoA to CSSKeyframesAnimation.processFrame for pure-numeric segments — pack Float64Array at parse() and call one lerpArray per frame**
  - _mech:_ In FrameCompiler.parse() (frame-compiler.ts:446-487), after finalizeFrameVars, detect segments where every iv in frame.allInterpVars is numeric (start.unit !== 'color', not computed). Pack iv.start.va
  - _payoff:_ ~2× steady-state throughput on the most common multi-channel transform animations (translate3d+scale3d+rotateZ+opacity = · _feas:_ Feasible on today's tree — no sibling publish needed. Risk: mixed segments (color OR computed ivs alongside numeric) cannot use So
  - _gate:_ bench/compile.bench.ts extended with a 'N=200 · SoA-packed segments at parse()' case asserting frame._soaFrom instanceof
- [aggressive·perf] **Float64Array color-channel plan in lerpColorValue as a kf-side dense path — skip the per-Color object dispatch for gamut-straight oklab/oklc**
  - _mech:_ value.js/src/units/interpolate.ts:83-140 already has _colorPlan: buildColorChannelPlan(iv) — a frozen parallel-array plan (keys[], startN[], stopN[], hueIndex, dstVU) built at prepareInterpVar. The ho
  - _payoff:_ Closes the color-interp un-benched gap (O.W8 S2). Makes the value.js P color-math rewrites validatable with a before/aft · _feas:_ The kf-side bench is fully achievable today (no value.js P needed). The densify-COMPILE arm just runs fromString on an oklch ramp.
  - _gate:_ bench/color-interp.bench.ts: 'PLAY · 2-stop oklch (60 frames)', 'PLAY · 11-stop oklch gradient (60 frames)', 'COMPILE · 
- [radical·arch] **Transposing the CSSKeyframesAnimation PLAY path onto a two-phase pipeline (interpolate-all → write-all) to enable batched DOM style mutation**
  - _mech:_ transformTargetsStyle (utils.ts:410-424) calls unflattenObjectToString(vars) → then Object.entries(styleStringVars).forEach((key, value) => target.style.setProperty(key, value)). This is K individual 
  - _payoff:_ Potentially 30-50% DOM-write cost reduction for transform-heavy animations by eliminating the string serialization + bro · _feas:_ The Typed OM (CSS Houdini) aggregate API is LIMITED AVAILABILITY (NOT Baseline): Chrome/Edge 66+, Safari 16.4+, NO Firefox for the aggregate attributeStyleMap/StylePropertyMap API. PROGRESSIVE ENHANCEMENT only — feature-detect-gated with a string-setProperty fallback (the universal floor, incl. ALL of Firefox). Risk: StylePropertyMap.set() with CSSTransf
  - _gate:_ proof:typed-om-eligible: in a real browser, assert that CSSKeyframesAnimation's apply path for a pure-transform animatio
- [incremental·perf] **Portable HARD bench floor via ratio anchoring: retire all absolute floorHz numbers and make every budgeted arm a device-independent ratio me**
  - _mech:_ bench/taxonomy.json carries one absolute floor: warmEngine 'floorHz':1000. O.W8 S5 is the mandate to replace it with a baselineCase×floorFraction pair where baseline and candidate run in the SAME vite
  - _payoff:_ Makes CI perf gates robust across macOS developer machines and slow Linux runners (the device-dependence-greening lesson · _feas:_ Entirely within bench/taxonomy.json + proof-bench-taxonomy.mjs. No engine change. The only risk: if the cold and warm arms run in 
  - _gate:_ bench/interp-buffer.bench.ts: add 'warmEngine COLD — loadAnimationEngine() first call (no prior warmEngine())'. taxonomy
- [incremental·perf] **scheduler.postTask('background') for loadAnimationEngine() idle pre-warm — measure INP delta with a Playwright-core trace and record ADOPT o**
  - _mech:_ src/animation/index.ts exports warmEngine() which calls void loadAnimationEngine() fire-and-forget. The hypothesis (L.W7 S4): wrapping the idle import in scheduler.postTask('background', { priority: '
  - _payoff:_ If ADOPT: every app using warmEngine() gets reduced INP on first interaction with a one-line change. If KILL: the decisi · _feas:_ Playwright-core is already used in bench/playwright.bench.ts and proof-computed-real-dom scripts. The bench/loaf-scene.html patter
  - _gate:_ scripts/scheduler-posttask-decision.json: ENOENT today → proof:scheduler-posttask reds immediately (the re-targeted gate
- [aggressive·arch] **Oscillator (springLinearStops + springTimingFunction) as a published zero-dep subpath — make the most-used library primitive tree-shakeable **
  - _mech:_ springLinearStops.ts and springTimingFunction.ts are already LIGHT (no value.js edge); they compose SpringProgress (spring.ts) + internal/leaves.ts. They are on the static barrel (index.ts) but NOT cu
  - _payoff:_ A CSS-animation consumer who only wants spring-generated linear() easing curves gets a 2KB subpath instead of the full ~ · _feas:_ Requires vite.config.ts lib.entry to add ./spring-stops as a named entry (the same mechanism as the existing engine/animate/motion
  - _gate:_ proof:published-surface extended: assert 'springTimingFunction' is in the ./spring-stops subpath exports AND that bundli
- [incremental·correctness] **WAAPIreasoning gate: assert a set of known-eligible animations ARE WAAPI-delegated in the real browser, not silently falling back to rAF, as**
  - _mech:_ src/animation/waapi.ts defines eligibility: DOM target, default renderer, uniform timing, no multi-segment CSS-twin easing, no computed units, no color interp, not WebKit with linear() easing. A simpl
  - _payoff:_ Prevents silent WAAPI regression — a class of animations that previously ran on the compositor thread silently falling b · _feas:_ Playwright-core is available; the real-browser bench harness exists. Risk: document.getAnimations() returns Web Animations API ent
  - _gate:_ proof:waapi-eligible (NEW): [C1] jsdom: new CSSKeyframesAnimation({useWAAPI:true}).fromString('from{opacity:0}to{opacity

**Recs:** Implement O.W8 S1+S2 immediately: author bench/numeric-soa.bench.ts (K-ladder K∈{2,5,12,32} at 600-frame window) and bench/color-interp.bench.ts (PLAY · Ship O.W8 S8 (transformTargetsStyle out-buffer) as the only engine micro-edit in O.W8: hoist const _styleOut: Record<string,string> = {} in utils.ts:4 · Ship O.W8 S9 (reconcileVars O(1) Map): add a Map<number, AnimationFrame> in frame-compiler.ts reconcileVars alongside buildVarIndex to replace the fin · Convert the warmEngine budgeted floor from absolute floorHz:1000 to a baselineCase×floorFraction ratio (O.W8 S5): author a 'warmEngine COLD — no prior · Wire sync-step.bench.ts into taxonomy.json suites (O.W8 S3) and classify the 4 loop-core cases: drive(SmoothProgress)/drive(SpringProgress) as run-che · Extend SoA adoption from NumericAnimation to CSSKeyframesAnimation.processFrame for pure-numeric segments (the bold perf idea above). The J.W6 S2 benc · Delete the lerpArray inline from internal/leaves.ts and re-export from @mkbabb/value.js/math (NOW — unblocked, no VJ-P needed). Add a proof:workaround · Author the scheduler.postTask real-browser INP measurement (O.W8 S4): extend bench/playwright.bench.ts or author a dedicated proof:scheduler-posttask 

---

## K4-demo-engine

The demo's engine-consumption layer is architecturally sound after the H→L tranche series: the centralized RAFPlayback recipe (useRafScene), the I.W4 D4 hot-path painter discipline (direct style.transform writes off the Vue render graph for all moving dots/balls), the machine-as-single-authority playback dispatch, and the two-channel split (reactive few-Hz readout + 60 Hz painter channel for scrubber/visualizer) are all consistently applied across easing, spring, and sequence scenes. The loaf-observer / playwright.bench.ts LoAF gate provides real main-thread-blocking evidence. Key remaining gaps: the AnimationVisualizer spawns its OWN unconditional rAF loop (useRafLoop with no guard) alongside the scene's loop; the contractAnim dummy-group pattern in easing/spring is a documented escape-hatch with zero engine-validation (no born-RED gate on the fact it drives no motion); the DemoControlPoint (DM-2, P-inv-28 forbidden 8th carry) and fromMorphSVG (DM-3, same) are O.W5/O.W6 BUILD-IN obligations that remain ZERO files on disk; and the loaf-observer is DCE'd from prod, creating an unverifiable prod-LoAF gap. Novel opportunities exist for a shared rAF multiplexer (one rAF per frame for all co-active painters), WAAPI delegation for the scene swap spring, and a Scheduler.yield()-aware painter flush to eliminate any 60 Hz re-render jank under heavy composite loads.

**Critical findings:**

- **[HIGH·deferred]** DemoControlPoint (DM-2, P-inv-28 forbidden 8th carry) and fromMorphSVG (DM-3) are ZERO files on disk — O.W5/O.W6 BUILD-IN obligations unexecuted
  - _ev:_ docs/tranches/O/audit/deferred-ledger-O.md §1b — DM-2 (born E, 7 carries through M) and DM-3 (born C, 7 carries) are mandated BUILD-IN at O.W5/O.W6. `grep -rn 'DemoControlPoint' demo/` → ZERO; `grep -
  - _→_ O.W5: author DemoControlPoint.vue in demo/@/components/ over the LIGHT drag2D primitive; retire proof:control-point-live; author proof:demo-control-point born-R

**Novel ideas:**

- [aggressive·perf] **SharedRAFBus: one rAF handle for all frame work in a scene mount**
  - _mech:_ Introduce a `useSharedRAFBus()` composable (LIGHT, scope-bound) that registers a single `requestAnimationFrame` callback for the scope and dispatches `now` to an ordered list of frame handlers. Every 
  - _payoff:_ Reduces the browser's rAF callback overhead from N separate callbacks (up to 4 on easing scene) to 1. Eliminates orderin · _feas:_ The engine's RAFPlayback is already the single rAF authority for the library; the bus is a demo-layer composable above it, not a l
  - _gate:_ Born-RED: write a proof:shared-raf-bus test that mounts two useRafLoop instances and asserts they share a single window.
- [incremental·perf] **Painter-channel slider: bypass Vue reactivity for the PlaybackRibbon scrubber thumb entirely**
  - _mech:_ Extend the painter registration pattern (already used for easing dots and spring balls) to the PlaybackRibbon scrubber. The reka Slider's thumb element ref is accessible via a slot or template ref. In
  - _payoff:_ Removes the last 60 Hz Vue ref write in the spring (and analogously easing) scene hot path, eliminating the reactive sch · _feas:_ Reka's Slider renders its thumb at a DOM location readable via template ref. The main risk is reka internals changing the thumb's 
  - _gate:_ Born-RED: proof:slider-thumb-direct-paint that mounts PlaybackRibbon in a jsdom-like env, fires the painter with a known
- [incremental·perf] **Lazy perScene localStorage persist — batch on PAUSE/NAVIGATE only, never on PLAY/SCRUB**
  - _mech:_ In useSceneMachine.ts:dispatch(), gate the `persisted.value = …` write behind an event filter: only persist on NAVIGATE, PAUSE, RESET (state worth restoring), not on PLAY or SCRUB. For SCRUB specifica
  - _payoff:_ Eliminates up to 60 localStorage writes/second during scrub gestures. localStorage.setItem is synchronous and blocks the · _feas:_ The SCRUB event's perScene update is already pure (sceneMachine.ts:210-223 writes a new perScene object); gating the localStorage 
  - _gate:_ Born-RED: proof:machine-persist-budget — mount useSceneMachine in a test, fire 60 SCRUB events, spy on useStorage writes
- [aggressive·arch] **WAAPI-delegate the scene-swap SpringProgress cross-dissolve to compositor-thread CSS animation**
  - _mech:_ The scene-swap cross-dissolve (useSceneSwap.ts) currently runs SpringProgress + RAFPlayback on the main thread, writing `sceneOpacity.value` (a reactive ref → Vue re-render) every frame. Since opacity
  - _payoff:_ Moves the swap animation off the main thread entirely. Eliminates the SpringProgress rAF loop + the reactive opacity wri · _feas:_ The spring timing function's CSS form (linear() stops string) is already computed by springTimingFunction at demo/spring/useSpring
  - _gate:_ Born-RED: proof:swap-waapi-delegated — mount the scene host, trigger a swap, assert no calls to requestAnimationFrame fr
- [incremental·demo] **DemoControlPoint: drag2D-backed 2D control point widget as a LIGHT engine dogfood primitive for the demo**
  - _mech:_ O.W5 mandates building DemoControlPoint.vue over the LIGHT drag2D primitive. The natural architecture: `drag2D` (src/animation/drag.ts, LIGHT) provides the raw 2D spring drag; `DemoControlPoint` wraps
  - _payoff:_ Closes the P-inv-28 forbidden 8th carry for DM-2. Provides a reusable LIGHT drag primitive that the easing bezier handle · _feas:_ drag2D exists in the LIGHT barrel. The main implementation question is whether drag2D exposes the right surface for a 2D spring dr
  - _gate:_ Born-RED: proof:demo-control-point — grep for DemoControlPoint.vue absent → exit 1. GREEN: component present, rendered i
- [aggressive·arch] **fromMorphSVG: SVG path morphing via value.js PathGeometry — the missing HEAVY engine primitive**
  - _mech:_ O.W6 mandates building fromMorphSVG in src/animation/ (HEAVY, behind loadAnimationEngine). value.js 1.0.2 exports PathGeometry at dist/transform/path.d.ts:36-67 with getTotalLength, getPointAtLength, 
  - _payoff:_ Closes the P-inv-28 forbidden 8th carry for DM-3. Adds a long-missing HEAVY engine primitive (SVG morphing) that compete · _feas:_ The PathGeometry API (getTotalLength, getPointAtT) is confirmed present in value.js 1.0.2. The main challenge is path normalizatio
  - _gate:_ Born-RED: proof:morphsvg-consume — fromMorphSVG absent → exit 1. GREEN: mid-t sample of a circle→square morph produces a
- [incremental·perf] **Hot-path painter registry as a micro-scheduler: batch all scene painters into a single forEach after a yield check**
  - _mech:_ The easing and spring scenes maintain a `Set<DotPainter>` / `Set<SpringPainter>` and call `for (const paint of painters) paint(phase)` inside the rAF callback. If a scene has many painters (e.g. the e
  - _payoff:_ Prevents the easing comparison-all mode (40+ painters, each doing style.transform write + easing function evaluation) fr · _feas:_ The scheduler.yield() implementation (src/animation/internal/scheduler.ts) is already available as an internal. Exposing it at the
  - _gate:_ Born-RED: extend the playwright.bench.ts LoAF gate to cover the easing comparison-all mode (40+ painters). GREEN when no

**Recs:** Add an idle guard (SETTLE_FRAMES-style) to AnimationVisualizer's unconditional useRafLoop — it is the one remaining always-on rAF loop that runs even  · Batch the useSceneMachine localStorage persist to PAUSE/NAVIGATE events only — firing useStorage.value= on every SCRUB event at 60 Hz causes up to 30m · Investigate replacing the 60 Hz scrubberPhase Vue ref write with the direct painter discipline (style.transform on the slider thumb element) to remove · Author the O.W5 DemoControlPoint.vue (drag2D-backed 2D control point) and O.W6 fromMorphSVG (PathGeometry-backed SVG morphing) immediately — these are · Expand proof:scene-contract-identity to assert: (a) contractAnim has zero DOM targets, (b) the group's own playback is never driving rAF while the raw · Prototype a SharedRAFBus composable (one rAF handle per scope, ordering-guaranteed dispatch to all registered frame handlers) to eliminate the N-concu · Consider delegating the VT-absent scene-swap spring animation to WAAPI (Element.animate with the spring's linear() CSS twin) to move the cross-dissolv

---

## K5-defer-O

Tranche O is ratified-but-unimplemented: every wave was DEVELOPED (docs authored, born-RED gates named) but NONE have been implemented pending explicit owner authorization. The M-as-built delta is large — only 5 of M's 17 waves landed on master (aef3ef3). Two P-inv-28 ABSOLUTE chronics (DM-2 GlassControlPoint 8-tranche, DM-3 MorphSVG 8-tranche) remain unbuilt despite carrying "no 8th ride" mandates since M. Three live gate dishonesty problems surface on the current tree: (1) proof:workaround-deletion S1 shows FALSE RED — glass-ui 4.1.0 IS published but the aria conditional guard is NOT in it (the O.W2 DO-2 retarget is unexecuted); (2) S2 shows RED and may be genuinely actionable (useDockClickIntegrity IS in 4.0.1 and 4.1.0); (3) proof:chronic-closure LEDGER_LABEL is "K/PROGRESS.md" while CHRONIC_LEDGER points at L/PROGRESS.md — a two-constant staleness from O.W2 DO-3. The N-Stage branch (n-stage-impl, 15 commits behind master, carrying stale ^0.9.0 parse-that and ^0.13.0 value.js pins) is shelved and awaits the glass-ui BC cut unshelf trigger per DM-24/O.W15.

**Critical findings:**

- **[BLOCKER·chronic]** DM-2 + DM-3: 8-tranche P-inv-28 ABSOLUTE chronics unbuilt — forbidden 8th carry executed
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1b: `grep -rn 'DemoControlPoint' demo/ src/` → ZERO; `grep -rn 'fromMorphSVG' src/animation/` → ZERO; `ls scripts/proof-demo-control-point.mjs`
  - _→_ O.W5 builds DemoControlPoint.vue over LIGHT drag2D (NOW, no sibling gate). O.W6 builds fromMorphSVG over value.js 1.0.2 PathGeometry (NOW, PathGeometry already 
- **[HIGH·gap]** proof:workaround-deletion S1 is FALSE RED — glass-ui 4.1.0 published but aria guard absent from it
  - _ev:_ keyframes.js/scripts/proof-workaround-deletion.mjs: S1 probe checks `npm show @mkbabb/glass-ui@4.1.0 version` → published (exit 0) → marks S1 RED. But glass-ui 4.1.0 tabs.js line 306: `'aria-orientati
  - _→_ O.W2 must retarget S1 tripwire from `glass-ui@4.1.0` version probe to a content-present grep for `aria-orientation.*tablist` conditional guard in the installed 
- **[HIGH·gap]** proof:chronic-closure LEDGER_LABEL stale ('K/PROGRESS.md') while CHRONIC_LEDGER points at L/PROGRESS.md
  - _ev:_ keyframes.js/scripts/proof-chronic-closure.mjs:114 `CHRONIC_LEDGER = path.join(REPO, 'docs/tranches/L/PROGRESS.md')` and line 468 `LEDGER_LABEL = 'K/PROGRESS.md'`. DO-3 in deferred-ledger-O.md confirm
  - _→_ One-line label fix at O.W2 (DO-3): correct LEDGER_LABEL to 'L/PROGRESS.md'. The CHRONIC_LEDGER re-point to O/PROGRESS.md is the O.WZ atomic final motion — do no
- **[HIGH·correctness]** DM-22: named-selector frames produce NaN frame-times (always-active bug) — NAMED_SELECTOR_NO_TIMELINE never thrown
  - _ev:_ keyframes.js/src/animation/utils.ts:398: `start: (start.value * duration) / 100` — when startFrame.start is a NAMED_SELECTOR ValueUnit ('entry', 'exit'), .value is the STRING 'entry'; 'entry' * 1000 /
  - _→_ O.W3 fix: at the deferred phase-resolution site (when a named-selector frame is used without a ScrollTimeline), throw AnimationOptionError('NAMED_SELECTOR_NO_TI
- **[HIGH·gap]** O.W8 bench gaps: numeric-soa, color-interp absent; sync-step unwired from taxonomy; postTask GREEN-by-SKIP
  - _ev:_ keyframes.js/bench/: ls shows no numeric-soa.bench.ts, no color-interp.bench.ts; bench/taxonomy.json suites = ['bench/interpolation.bench.ts','bench/parser.bench.ts','bench/interp-buffer.bench.ts','be
  - _→_ O.W8 is NOW (no sibling gate). Author numeric-soa.bench.ts, color-interp.bench.ts, wire sync-step into taxonomy suites, re-target scheduler-posttask to real-bro

**Novel ideas:**

- [aggressive·arch] **fromMorphSVG with topology-aware vertex correspondence via PathGeometry arc-length resampling at build time**
  - _mech:_ O.W6 spec (morph-svg.ts) uses uniform arc-length sampling. Bold extension: after PathGeometry.getPointAtT(t) sampling, run a Procrustes-alignment pass (translate centroids to origin, find optimal rota
  - _payoff:_ Eliminates the most common complaint about SVG morphing (paths with different winding orders producing 'inside-out' anim · _feas:_ Feasible after O.W6 base is built. Procrustes alignment adds O(N) cost at construction (acceptable — construction is once). Risk: 
  - _gate:_ Born-RED: author test/morph-svg-topology.test.ts asserting that a triangle (clockwise) morphed to a triangle (counter-cl
- [aggressive·arch] **Lift engine.ts playback machine into engine-playback.ts NOW using a provisional WeakMap<ValueUnit,string> for FN_NAME (kf-internal, no VJ-L1**
  - _mech:_ O.W7 is gated on value.js P VJ-L1 flatLeaf. The blocking coupling is the FN_NAME Symbol stamped onto value.js ValueUnit instances (utils.ts:45-57). O.W7 spec §S8 fallback mentions a 'kf-side WeakMap<V
  - _payoff:_ Unblocks the engine.ts 1397L→~900L split IMMEDIATELY (no value.js P wait). The god-object split delivers the largest arc · _feas:_ The deferred-ledger-O.md explicitly documents this as 'two-arm fallback: (a) kf-side WeakMap... BUT does NOT survive ValueUnit.clo
  - _gate:_ Born-RED: remove the LIBRARY_CEILING_OVERRIDE engine.ts:1400 entry → proof:decomposition exits 1 naming engine.ts at 139
- [incremental·perf] **Zero-alloc DOM-write path: module-scope _styleOut buffer + unflattenObjectToString out param, eliminating per-frame Record<string,string>**
  - _mech:_ keyframes.js/src/animation/utils.ts:417: `const styleStringVars = unflattenObjectToString(vars)` — allocates a fresh Record<string,string> on EVERY rAF frame. value.js unflattenObjectToString signatur
  - _payoff:_ Eliminates one GC-pressure allocation per rAF frame for every animation with DOM targets. At 60fps with 3 concurrent ani · _feas:_ Straightforward. The main risk is that unflattenObjectToString's out param semantics require the caller to ensure the buffer is cl
  - _gate:_ Born-RED: proof:standalone-zero-alloc extension asserting zero fresh objects allocated during the DOM-write phase of a 6
- [incremental·perf] **reconcileVars O(1) frame-dedup via composite key Map: eliminate the O(N) findIndex inner scan at frame-compiler.ts:418**
  - _mech:_ keyframes.js/src/animation/frame-compiler.ts:418: `const frameIx = this.frames.findIndex((f) => f.ixs.start === startIx && f.ixs.stop === endIx)` — O(N) scan on every variable in reconcileVars, called
  - _payoff:_ Converts compile-time from O(N²) to O(N) for animations with many keyframe stops. Observable as a ratio inversion at N=1 · _feas:_ Straightforward — the composite key pattern is already used (createFrame at line 338-342). The FRAME_ID_SCALE constant needs to be
  - _gate:_ Born-RED: bench/compile.bench.ts case at N=1000 stops shows quadratic ratio inversion vs N=10 baseline. GREEN after Map 
- [aggressive·demo] **N-Stage DK64-style scene switcher as a live demo of the library's orchestration tier (Sequence + SpringProgress + stagger + RAFPlayback)**
  - _mech:_ The N-Stage branch (n-stage-impl) has 4 impl commits: CarouselDisk.vue (404L), SceneStage.vue (498L), StageArrows.vue (245L), useCarouselOrbit.ts (232L), useLivePreviewLOD.ts (299L) — real implementat
  - _payoff:_ Transforms the demo from a static scene dropdown to a theatrical showcase that IS the library — visitors see SpringProgr · _feas:_ The branch has substantial working code. Main risks: (1) rebase conflicts on value.js pin (the S7 flat-comma regex must be kept-de
  - _gate:_ Born-RED: proof:n-stage-boundary — import-graph walk of the built demo asserting ZERO loadAnimationEngine() imports in a
- [incremental·demo] **Structural framing: emit DemoControlPoint.vue's drag as a REAL demo of drag2D (self-dogfooding showcase)**
  - _mech:_ The O.W5 DemoControlPoint.vue spec builds a curve-editor handle over the LIGHT drag2D primitive. Currently EasingCurveCanvas.vue hand-rolls a bespoke pointer-to-SVG CTM transform (useEasingCurveDrag.t
  - _payoff:_ Zero additional library code. Converts a hidden internal (drag2D uses SpringProgress) into a visible demonstration. User · _feas:_ Straightforward — drag2D exposes a Drag2DHandle with .value, .velocity, .settled. A Vue reactive shim (markRaw + watchEffect on su
  - _gate:_ Born-RED: proof:demo-control-point live-drag clause (O.W5 S3 keystone) already covers the handle drag emitting an update

**Recs:** Authorize O.W5 + O.W6 immediately: both are NOW-phase with zero sibling dependencies and their BUILD-IN substrates are already published (drag2D in LI · Fix the S1 false-RED in proof:workaround-deletion (DO-2) before any BC consume work: retarget the S1 tripwire from `glass-ui@4.1.0` version probe to a · Fix proof:chronic-closure LEDGER_LABEL from 'K/PROGRESS.md' to 'L/PROGRESS.md' (DO-3 one-liner, O.W2 hygiene wave) immediately to keep the chronic led · Execute O.W8 S8 + S9 micro-edits first among the O.W8 items: the transformTargetsStyle out-buffer fix (utils.ts:417) and the reconcileVars Map O(1) fi · Unblock O.W7 engine-seam via the kf-side WeakMap<ValueUnit,string> fallback: this avoids waiting for value.js Tranche P VJ-L1 (which has no timeline,  · Treat the N-Stage rebase as a gate-first task: author proof:n-stage-boundary FIRST (the import-graph walk asserting HEAVY chunk absent from stage modu · Prioritize Band A + B + C + D.W8/D.W9 as an atomic NOW batch: all 9 waves have zero sibling dependencies. Sequencing: W0 charter hygiene → W1 lint → W

---

## D1-cube

The Cube 3D scene has received meaningful L.W11 design work (per-face `--lit` relighting, `--spin-energy` bloom, axis-tag drafting stamps, euler attitude readout, roll easter-egg thunk) but several medium-impact design gaps from the `docs/frontend-design/demo/cube.md` proposal remain unimplemented: grab/release cursor feedback (`cursor: move` never swaps to `grabbing`), the Loader2 spinner on the idle cube (a generic throbber, not the proposed Lissajous-path idle drift), the matrix editor's 20%-opacity axis labels in light mode (near-invisible), the rainbow-wrapper shimmer class that has no CSS definition (a ghost class — the shimmer simply does not play), and the golden-center spatial offset. A correctness issue exists in the axis-tag labeling convention (top face `−Y` is technically CSS-Y-down correct but immediately confusing to anyone expecting Y-up). Discoverability is the most critical gap: nothing on the cube surface signals that it is draggable, double-clickable to roll, or that the matrix editor cells can be scrubbed.

**Critical findings:**

- **[HIGH·correctness]** rainbow-wrapper shimmer is a ghost class — the shimmer effect does not exist
  - _ev:_ demo/cube/CubeTarget.vue:56-59 applies `rainbow-wrapper opacity-100` / `rainbow-wrapper opacity-25` to a `<span>` inside each face. `rainbowTimings` (CubeTarget.vue:182-185) writes `animationDelay`/`a
  - _→_ Author a `.rainbow-wrapper` scoped rule in CubeTarget.vue with an `animation` property keying a shimmer keyframe (e.g. a diagonal `background-position` sweep on

**Novel ideas:**

- [incremental·demo] **Face hover spotlight with CSS `@property` `--hover-lit` tween driven by `:hover` on each face element**
  - _mech:_ Each `.cube-side` already has `transition: --lit 160ms linear` (CubeTarget.vue:331). Add a second registered `@property --hover-lit { syntax: '<number>'; initial-value: 0 }` that overrides `--lit` tow
  - _payoff:_ Free 'the face you look at catches the light' micro-beat the design doc calls for (cube.md:249-252), pure CSS, zero cost · _feas:_ `@property` is Baseline Widely Available. The `transition: --hover-lit` on `:hover` activates/deactivates cleanly. Risk: on touch 
  - _gate:_ Born-RED `proof:cube-hover-spotlight`: Playwright pointer-hover on `.cube-side.front` → assert computed `--hover-lit` > 
- [incremental·demo] **Keyboard-driven axis-lock drag: holding X/Y/Z constrains OrbitalDrag to single-axis rotation, with the matching axis line brightening as a r**
  - _mech:_ OrbitalDrag.vue already tracks `pressedKeys.x/y/z` (OrbitalDrag.vue:185-203) and routes to `updateAxisRotation` (line 132-148). The axis lines (`CubeTarget.vue:113-115`) currently have no dynamic stat
  - _payoff:_ Makes the already-implemented axis-lock feature discoverable and spatially grounded. Zero new architecture — rides exist · _feas:_ OrbitalDrag must expose `pressedKeys` to the parent (already internal ref; add to slot-props or emit). Risk: window keydown listen
  - _gate:_ Born-RED: `proof:cube-axis-lock-indicator` — hold X key → assert `.axis-line.x` has `--axis-active` > 0 and the drop-sha
- [aggressive·demo] **Easter-egg: 'Face reveal mode' — long-press any face to expand it fullscreen (CSS anchor-positioned popover) showing the face number in mass**
  - _mech:_ On `pointerdown` held >500ms on a `.cube-side`, add a `[popover]` element (CSS native popover API, Baseline 2024) that uses CSS anchor positioning (`anchor-name` on the face, `position-anchor` on the 
  - _payoff:_ A unique, platform-native interaction that shows off keyframes.js's composability AND demonstrates a modern CSS API (anc · _feas:_ CSS anchor positioning + `[popover]` are Baseline Widely Available as of 2024/2025. The long-press threshold (500ms) conflicts wit
  - _gate:_ Born-RED: `proof:cube-face-reveal` — long-press `.cube-side.front` 600ms → assert `[popover]:popover-open` exists in DOM
- [incremental·demo] **Axis-origin bloom: a single radial-gradient pseudo-element at the crossing of the three axis lines, colored by `color-mix` of `--axis-x/y/z`**
  - _mech:_ The `.graph` element (CubeTarget.vue:9) is a `preserve-3d grid` centered on the cube origin. Add a `::before` pseudo-element on `.graph` absolutely positioned at 50%/50%, `border-radius: 50%`, `width/
  - _payoff:_ The axis-crossing becomes the most confident point on the stage — the three axes converge there visually. Cost: 4 lines  · _feas:_ Trivial CSS addition. Risk: the `preserve-3d` context may clip or misplace the pseudo-element — use `position: absolute; z-index: 
  - _gate:_ Born-RED: `proof:cube-origin-bloom` — assert `.graph::before` has a non-zero `opacity` and a `background` using `color-m
- [radical·arch] **Architecture: move `--lit` computation from Vue reactive `computed` into a CSS Houdini Paint Worklet or a registered CSS property driven by **
  - _mech:_ Currently `useCubeRelit.ts:71-73` computes `litFor(n, transform.value.rotate)` inside a Vue `computed` — reactive JS runs on every rotation tick. A Houdini approach: register a CSS `@property --rotate
  - _payoff:_ Zero Vue reactive allocations in the hot rotation path; lighting computed in the paint worklet off the main thread (in b · _feas:_ CSS Houdini Paint Worklet (`CSS.paintWorklet.addModule`) is NOT in Baseline — CHROMIUM-ONLY (no Firefox, no Safari). PROGRESSIVE ENHANCEMENT only — feature-detect-gated (`CSS.paintWorklet`) with the existing Vue-computed `litFor` path as the universal fallback for non-Chromium realms. The registered-CSS-property (`@property`) leg is separately Baseline; the worklet leg is the Chromium-only enhancement.
  - _gate:_ Born-RED: `proof:cube-lit-worklet` — only GREEN if `CSS.paintWorklet` available AND per-rotation JS allocation drops to 
- [aggressive·demo] **The 'Physics transparency' panel: a collapsible HUD chip in the cube stage that shows live quaternion (w,x,y,z), angular velocity magnitude,**
  - _mech:_ CubeScene.vue already exposes `headerLeft` via `defineExpose`. Add a second `headerRight` slot function that renders a collapsible glass-ui `<Tooltip>` or `<HoverCard>` over a small chip showing `q: [
  - _payoff:_ Makes the quaternion/inertia physics VISIBLE — the 'best physics in the demo is invisible' critique (cube.md:104-111) is · _feas:_ OrbitalDrag needs to expose two new refs — a `defineExpose` addition. EasingCurveCanvas is already reused by the easing scene. Ris
  - _gate:_ Born-RED: `proof:cube-physics-hud` — after keyboard trigger, assert the quaternion chip is visible with numeric content 
- [aggressive·modern-web] **Replace the idle bob animation with a CSS `animation-timeline: scroll()` or `animation-timeline: view()` alternative that responds to the us**
  - _mech:_ On the home landing (`hideLoader === true`, CubeScene.vue:11), the cube is the hero backdrop. A scroll-driven animation (WAAPI `animation.timeline = new ScrollTimeline({ source: document.scrollingElem
  - _payoff:_ Scroll-driven animation on the hero is a showstopper demo moment: 'this library animates as you scroll, literally.' It d · _feas:_ keyframes.js `ScrollTimeline` is already a LIGHT export. The `hideLoader` prop is already available in `CubeScene` (line 29). Comp
  - _gate:_ Born-RED: `proof:cube-scroll-timeline` — on the home landing, assert that programmatic `window.scrollBy(0, 100)` changes

**Recs:** Fix the ghost `.rainbow-wrapper` class first — it is a zero-cost, high-payoff correctness fix: author a scoped shimmer keyframe in CubeTarget.vue and  · Replace `Loader2 animate-spin` with the proposed Lissajous idle-drift `CSSKeyframesAnimation` — this is the scene's strongest design signal; the gener · Wire `isDragging` from `useOrbitalPointer` to a `[data-dragging]` attribute on OrbitalDrag's container and add `cursor: grabbing; scale: 0.98` in Cube · Raise the matrix editor axis-label opacity from `opacity-20` to `opacity-40` in light mode and add a per-axis-color ring on the selected cell — the co · Add `role="application" aria-label="3D cube — drag to rotate, double-click to roll" tabindex="0"` to OrbitalDrag plus a `@keydown.enter`/`.space` hand · Add a transient first-visit gesture-hint overlay (dismissed to localStorage) indicating drag and double-click affordances — touch users have no `curso · Implement the axis-origin bloom pseudo-element on `.graph::before` — 4 lines of CSS, `color-mix` of the three `--axis-*` tokens, `opacity` keyed to `- · Fix `changeGraphPerspectiveAnim` to guard against replaying on every CubeScene remount with a `hasPlayed` ref in `useCubeAnimations`. · Consider the scroll-timeline hero idea for the home landing: a single `ScrollTimeline` binding on the cube-backdrop makes the library's own primitive 

---

## D2-amiga

The Amiga Three.js scene is architecturally well-grounded after tranches H–L: subject = orbit pivot = framing is maintained, the WebGL present loop rides RAFPlayback correctly, content-visibility is shed, the CRT phosphor overlay is a tasteful L.W11.S3 addition, and the boing + power-on boot eggs are correctly gated on PRM and session state. However, several usability gaps remain: the double-click boing egg has NO progressive-disclosure hint (noted in O AUDIT-DIGEST E23 but unimplemented), the scene exposes NO live engine telemetry (unlike square's x/y readout and cube's euler display), MeshLambertMaterial produces a flat unlighted look instead of the specular "demo ball" quality the 1984 Boing Ball had, the custom UV remap is an O(N·vertices) per-geometry loop that recomputes on every mount, and the boingTimer uses a raw setTimeout (not engine-driven) creating a race if the scene unmounts mid-arc. The easter-egg story is the ONLY interaction affordance — the scene has no on-aesthetic secondary indicator showing the engine driving a non-DOM target, which is the scene's entire dogfooding claim. There are also novel architectural opportunities: replacing the hand-wired pointerdown capture with a useSphereSpin2 that consumes the engine's own `drag2D` LIGHT export (the same surface DemoControlPoint would use), adding a real-time angular-velocity readout analogous to the square's spring readout to make the decay() physics legible, and upgrading to MeshPhongMaterial or a minimal PBR variant to restore the ball's specular pop.

**Critical findings:**

- **[HIGH·gap]** No progressive-disclosure hint for the double-click boing egg
  - _ev:_ demo/app/scenes/AmigaScene.vue:168 onBoing — dblclick triggers the 1984 boing arc; AmigaScene template has NO hint span analogous to SquareInstrument.vue:38-40 'double-click to tumble'. O AUDIT-DIGEST
  - _→_ Add a `boingHintShown` boolean (set true after the first spin-settle where isGliding() transitions false, analogous to square's tumbleHintShown pattern). Render
- **[HIGH·gap]** No live engine telemetry overlay — the decay() physics are invisible
  - _ev:_ demo/app/scenes/AmigaScene.vue:338-356 — the render loop calls sphereSpin.tickGlide() and tracks spinBloom (0..1) but projects it only to the CRT phosphor overlay. The scene's core dogfood claim is 'e
  - _→_ Author a colocated AmigaTelemetry.vue with an angular-velocity readout (`omega = sqrt(velX²+velY²)`, rad/s, 2 decimals) and a 'gliding / settled' status badge u
- **[HIGH·risk]** Raw setTimeout drives the boing arc stop — engine-unaware race on unmount
  - _ev:_ demo/app/scenes/AmigaScene.vue:175-183 `boingTimer = setTimeout(() => { animationGroup.stop(); … }, 4200)` and useAmigaBoot.ts:47-57 `bootTimer = setTimeout(() => { animationGroup.stop(); … }, 3000)`.
  - _→_ Replace both raw timeouts with a single engine-driven completion path: author animationGroup.playOnce(durationMs) or use the existing animationGroup's onComplet

**Novel ideas:**

- [aggressive·arch] **Replace hand-rolled sphere spin with engine's drag2D LIGHT primitive — dogfood the very surface DemoControlPoint would use**
  - _mech:_ src/animation/index.ts exports `drag2D` as a LIGHT static (deferred-ledger-O.md DM-2 BUILD-IN target). Currently useSphereSpin.ts:90-151 hand-rolls pointer capture, NDC hit-test, velocity accumulation
  - _payoff:_ Eliminates ~80 lines of reimplemented drag machinery, makes useSphereSpin the demo's authored proof that `drag2D` drives · _feas:_ drag2D LIGHT export confirmed at src/animation/index.ts (grep: 'export { drag, Draggable, drag2D }'). The hit-test plane is still 
  - _gate:_ proof:amiga-drag2d-drives-mesh — born-RED on the hand-rolled velocity/decay block still present in useSphereSpin.ts; GRE
- [incremental·demo] **Angular velocity readout + glide-energy visual: make the decay() physics literally visible as a live telemetry overlay**
  - _mech:_ Expose `angularVelocity(): number` from useSphereSpin (returns `Math.hypot(velX, velY)` during drag, `Math.hypot(glideX?.velocity ?? 0, glideY?.velocity ?? 0)` during glide). Author AmigaTelemetry.vue
  - _payoff:_ The Amiga scene's entire pedagogical point is 'engine drives non-DOM target'. Currently that claim is invisible. The rea · _feas:_ Straightforward. The velocity is already tracked in useSphereSpin (velX/velY for drag, glideX.velocity for glide). The only new wo
  - _gate:_ proof:amiga-telemetry-live — navigate to /amiga, drag the sphere, release, assert the DOM contains a `.amiga-telemetry` 
- [radical·demo] **Easter-egg chaining: a long-held spin flick > threshold triggers the boing autonomously — no double-click required**
  - _mech:_ In useSphereSpin.ts:endDrag, measure the release angular speed `Math.hypot(velX, velY)`. If it exceeds a threshold (e.g., 8 rad/s — a hard, deliberate flick) AND the boing is not already active, call 
  - _payoff:_ Elevates affordance from 'dblclick hidden trap' to an emergent physics interaction. The moment of discovery is earned by · _feas:_ The endDrag handler is the correct insertion point (useSphereSpin.ts:131). The composable already knows `velX`/`velY`. The only de
  - _gate:_ proof:amiga-boing-from-spin — synthesize a pointer sequence with dx=20px per 16ms for 8 frames (8 moves), release; asser
- [incremental·demo] **Sphere texture hot-swap: press 'T' to cycle textures (checker / wireframe / normal-map / solid) — makes the scene a mini material explorer**
  - _mech:_ Author a small texture-set array: (1) the existing checker CanvasTexture, (2) a Three.js `WireframeGeometry` overlay toggled by a `wireframe: true` prop, (3) a normal-map sphere (white with depth bump
  - _payoff:_ Turns the Amiga scene into a Three.js material demo, not just a ball-bouncer. Users can see the decay() physics apply eq · _feas:_ Three.js material.map hot-swap is a one-liner (`mesh.material.map = newTexture; mesh.material.needsUpdate = true`). The four textu
  - _gate:_ proof:amiga-texture-cycle — synthesize a 'T' keypress on /amiga, assert sphereMesh.material.map differs from the initial
- [aggressive·arch] **Encode the boing arc as true CSS keyframes string — expose it in the Keyframes editor tab as a real copyable artifact**
  - _mech:_ The boing animationGroup (useAmigaAnimations.ts:160-171) is built from four CSSKeyframesAnimation instances (rotations/bouncingX/bouncingY/bouncingZ), each with a full `fromKeyframes`/`fromVars` defin
  - _payoff:_ Turns the hidden boing machinery into a legible artifact. Users can copy the @keyframes blocks and understand the engine · _feas:_ CSSKeyframesToString is already in the heavy surface (format.ts). The Keyframes editor pane is already lazy-loaded per AnimationCo
  - _gate:_ proof:amiga-boing-keyframes-serializable — call CSSKeyframesToString(rotations) and CSSKeyframesToString(bouncingY) in a
- [radical·perf] **SphereGeometry LOD swap during Boing arc: upgrade to 64×64 segments only when the sphere is the ONLY rendered subject (Boing active), downgr**
  - _mech:_ At rest the sphere is a mid-size element in a BOX_SIZE=12 room at dpr<=2 — 32×32 segments (current) produces ~1KB of index data, fine. But during the Boing arc the ball is the visual protagonist bounc
  - _payoff:_ Smoother sphere silhouette during the hero Boing arc moment where it matters most, identical GPU cost at rest. If the UV · _feas:_ The sphere mesh reference is mutable (`let sphereMesh`). However swapping the mesh reference requires re-wiring useSphereSpin's `g
  - _gate:_ proof:amiga-lod-swap — trigger boing, assert sphereMesh.geometry.parameters.widthSegments === 64 during boing; after sto

**Recs:** Add a progressive-disclosure boing hint (mirror SquareInstrument.vue's tumbleHintShown pattern) that appears after the first completed spin-settle, sh · Set `--ball-tone: var(--amiga-red)` on the scene-root div so the AnimationVisualizer scrubber ball in the controls panel wears the Boing Ball's crayon · Replace MeshLambertMaterial with MeshPhongMaterial({ shininess: 80, specular: '#888' }) — a three-character swap in demo/amiga/utils.ts:61 that restor · Replace the inline `spinBloom += (target - value) * 0.08` lerp in AmigaScene.vue:350-352 with the engine's LIGHT `SmoothProgress` primitive — the sing · Add `aria-label='Interactive Amiga Boing Ball — drag to spin, double-click to boing'` and `tabindex='0'` plus `@keydown.enter='onBoing'` to the canvas · Audit the custom UV remapping loop in demo/amiga/utils.ts:66-79 against Three.js's built-in SphereGeometry UVs — if no visible checker seam appears wi · Guard all post-boing/post-boot mesh writes (material.color, position.set, rotation.set) with `if (!sphereMesh || !scene) return` to prevent silent pos · Author `proof:amiga-design-paint` as a born-RED pixel-readback gate (the amiga scene's contribution to the missing M.W-DESIGN-PAINT oracle): sample th

---

## D3-square

The Square drag-box scene is structurally complete after L.W11 S4 (instrument layer, tether, telemetry strip, coordinate field, settled/tracking badge, tumble egg with rainbow token re-sourcing, two-tone material, progressive tumble hint). The physical affordances from the square.md design proposal are largely implemented. However five concrete gaps remain: (1) the contract keyframes in useSquareAnimations still carry two raw hex literals (#C462D8, #52E898) — the live sweep corrects at mount via resolvePaletteSweep but the transport-host keyframes do not, so the bottom-bar keyframe readout shows un-sourced literals; (2) --subject-teal is still a raw hex literal in design-idioms.css rather than an alias to --rainbow-green, breaking the "one identity by construction" guarantee; (3) the .demo-box carries role="slider" without aria-valuemin/aria-valuemax/aria-valuenow, which violates the slider role contract (WCAG 4.1.2); (4) focus-ring class is absent from the demo-box despite the demo-wide .focus-ring contract in design-idioms.css; (5) P2 motion enrichments (velocity-tilt, squash-stretch via separate scaleX/scaleY, phase-trace ghost, quarter-tick snap-glow, grab-pulse, settle-blink) are all absent — the design proposal documents them as P2/P3 future work, and zero gates probe their presence. No visual-truth gate exists for any square instrument element (tether opacity, badge state, readout colour). The mobile composition works correctly at the layout level (stageMode="subject", 0.48 visible-fraction floor), but the drag arena on mobile has no documented interaction guard against the sheet grab gesture stealing the first touch from the demo-box, a latent occlusion risk.

**Critical findings:**

- **[HIGH·gap]** role=slider missing aria-valuemin/aria-valuemax/aria-valuenow — invalid ARIA contract
  - _ev:_ demo/app/scenes/SquareScene.vue:37-39 — `role="slider"` is present but only `aria-label` and `aria-valuetext` are set. The ARIA slider role requires `aria-valuenow` (current value, numeric), `aria-val
  - _→_ Bind `:aria-valuenow` to the geometric mean of springX.target and springY.target (or surface both axes as two separate 2D-slider pattern attributes with a joint

**Novel ideas:**

- [incremental·perf] **Replace hand-rolled sRGB sweepHue with CSS color-mix(in oklab) driven by a single animated custom property**
  - _mech:_ In useSquareAnimations.ts the frame loop currently calls the custom sweepHue() (lines 146-153) and sets el.style.backgroundColor to an `rgb(...)` string. Replace with: set one CSS custom property `--s
  - _payoff:_ Removes ~27 lines of hand-rolled color math, fixes the sRGB desaturation correctness gap, and the animation reads direct · _feas:_ CSS color-mix() in oklab is Baseline 2023 Widely available. The `calc()` expression inside color-mix() percentage is supported in 
  - _gate:_ proof:design-refinement browser probe clause for square: after dblclick, read `document.querySelector('.demo-box').style
- [incremental·demo] **Velocity-tilt + directional squash-stretch as a CSS custom property seam — zero extra rAF, zero extra paint authority**
  - _mech:_ In the existing frame loop (useSquareAnimations.ts:160-217), after computing defl, read `springX.velocity` and `springY.velocity` (already on the public SpringProgress API, spring.ts:250). Set two CSS
  - _payoff:_ Makes the spring physics VISIBLE as mass and inertia — the box banks into the pull and squashes along the drag axis. Thi · _feas:_ Requires a one-time refactor: transformFunc stops writing `el.style.transform` directly and instead sets 5 CSS custom properties (
  - _gate:_ proof:design-refinement browser: during a simulated diagonal drag (pointerdown then pointermove to an off-centre target)
- [incremental·arch] **Transpose useSquareAnimations to use drag2D instead of two hand-rolled SpringProgress trackers, dogfooding the LIGHT 2D drag primitive**
  - _mech:_ Replace `const springX = new SpringProgress(...)` and `const springY = new SpringProgress(...)` (useSquareAnimations.ts:51-52) + their separate `tickDt` calls (lines 163-165) with a `drag2D(box, { spr
  - _payoff:_ The Square scene becomes the DEMO of drag2D -- the library primitive it was always supposed to exercise. Currently the s · _feas:_ drag2D is in the LIGHT barrel (src/animation/index.ts:88) so no new chunk is pulled. The API is subscribe-based (drag-2d.ts:41) wh
  - _gate:_ proof:dogfood (scripts/proof-dogfood.mjs) currently checks that drag/Draggable is consumed in the demo (line 10 mentions
- [aggressive·demo] **Phase-trace ghost via a fixed-length ring buffer written to an SVG polyline — spring trajectory made visible as a fading footprint**
  - _mech:_ In useSquareAnimations.ts, maintain a ring buffer of the last N=32 positions: `const posRing = new Float32Array(64)` (interleaved x,y, wrapping via `writeHead = (writeHead + 2) % 64`). Every frame tic
  - _payoff:_ Makes the spring trajectory beautiful and physically legible: the box leaves a glowing wake as it springs to its target, · _feas:_ Float32Array ring buffer writes are allocation-free (fixed-size typed array). The SVG polyline string construction per frame is ~3
  - _gate:_ proof:design-paint (to be authored in Tranche O): after a simulated drag+release, while `--sheet-t=0` (spring not settle
- [aggressive·modern-web] **Quarter-tick snap-glow as a pure CSS :has() + custom-property threshold effect, zero JS event handling**
  - _mech:_ In the frame loop, instead of detecting threshold crossings in JS (which requires a previous-value comparison), register two CSS custom properties: `--nx` and `--ny` (the live spring target, already c
  - _payoff:_ The coordinate field becomes interactive -- it responds to where you pull the box, not just where the box is. The draugh · _feas:_ data-attribute toggle on threshold crossing is O(1) per frame. The CSS keyframe is a one-shot: the attribute sets it off, the anim
  - _gate:_ proof:design-paint browser clause: drag the box to target ≈ 0.5 on the x axis, then read `document.querySelector('.squar
- [incremental·correctness] **Repoint the tether bow toward the spring VELOCITY VECTOR rather than the perpendicular-to-chord, making the bow a true physical rubber-band**
  - _mech:_ SquareInstrument.vue:68-81 -- the current tether Q control point bows perpendicular to the chord (dx/-dy perpendicular rotation, line 79-80). A physical rubber band under tension bows TOWARD the direc
  - _payoff:_ The tether goes from a fixed-perpendicular static bow (readable but inert) to a true physical rubber-band whip that comm · _feas:_ SpringProgress.velocity is a public getter (spring.ts:250). The onTick callback already runs in the frame loop after tickDt. The v
  - _gate:_ proof:design-paint browser clause: simulate a fast drag release and then poll the SVG path `d` attribute 3 times over 10
- [incremental·modern-web] **Grab-pulse as a CSS @starting-style ring expansion -- single @keyframes, no JS event, zero allocation**
  - _mech:_ In SquareScene.vue, add a `::before` pseudo-element to `.demo-box` that is normally `opacity:0; scale:1`. On `.demo-box--dragging::before`, apply a one-shot CSS animation `grab-pulse 0.4s ease-out for
  - _payoff:_ Zero JS: the 'capture confirmed' tactile ring requires only one CSS @keyframes declaration and a ::before rule. No setTi · _feas:_ @starting-style is Baseline 2024 Newly available (Chrome 117+, Safari 17.5+, Firefox 129+). For non-supporting browsers the pseudo
  - _gate:_ proof:design-paint browser: simulate pointerdown on demo-box, then within 50ms query `getComputedStyle(document.querySel

**Recs:** Fix the three high/med correctness gaps immediately before any P2 work: (1) add aria-valuemin='-1', aria-valuemax='1', :aria-valuenow binding to the r · Replace the sweepHue sRGB lerp (useSquareAnimations.ts:127-153) with a nested CSS color-mix(in oklab) via a --sweep-t custom property -- this removes  · Implement the velocity-tilt + directional squash-stretch as a CSS custom property seam: refactor transformFunc to write --spring-tx/ty/rotate/scale/vx · Author proof:design-paint.mjs (the completely absent visual-truth oracle) with at minimum three square clauses: tether opacity > 0 during simulated dr · Eliminate the two remaining raw hex literals in the transport-host keyframes (useSquareAnimations.ts:287,291) by resolving them from the same --rainbo · Record an explicit KILL or BOOK decision for the phase-trace ghost easter egg (square.md§SPATIAL): if keeping, implement as a Float32Array ring buffer · Investigate the mobile sheet peek overlap risk empirically: instrument proof:mobile-single-page with a measurement of the vertical distance between th

---

## D4-spring

The Spring scene (SpringScene.vue + demo/spring/) is architecturally mature: the hot-path painter registry correctly bypasses Vue reactivity for 60 Hz ball positioning, the scrubberPhase channel cures the 6 Hz slider-step, and the pane-drag dogfoods kf's own Draggable primitive. However the audit found one confirmed correctness bug (SpringTrace.vue's linear() stop parser assigns wrong x-coordinates to the first and last SVG path points), a reactive hot-path leak (scrubberPhase is a 60 Hz Vue ref read inside a slot render function, triggering the ribbon component at 60 Hz), a dangling aria-orientation suppress workaround pending glass-ui BC, a missing Y-axis containment in useSpringPaneDrag, and a focus-ring gap on the role=slider rail. Several bold architectural opportunities emerge: the SpringTrace parser could be eliminated by exposing a springLinearStopsArray() API; the scrubberPhase hot path should exit Vue's reactive graph entirely via a non-reactive callback channel; and the 4 preset tracks could become a single-instance canvas-drawn overlay rather than 4 independent DOM painter registrations.

**Critical findings:**

- **[HIGH·correctness]** SpringTrace.vue: linear() stop parser assigns incorrect x-coordinates to first and last SVG path points
  - _ev:_ demo/spring/SpringTrace.vue:50-86 — the fill algorithm for null-pct stops runs BEFORE the terminal anchoring (pts[0].pct = pts[0].pct ?? 0 at :77). For the first stop '0' (pct=null) and the last stop 
  - _→_ Fix: anchor pts[0].pct = 0 and pts[n-1].pct = 100 BEFORE the fill loop, not after. The CSS linear() spec mandates first stop = 0%, last = 100% by definition — t
- **[HIGH·workaround]** scrubberPhase 60 Hz Vue ref write leaks into ribbon component's render effect
  - _ev:_ demo/spring/useSpringHotPath.ts:80 — const scrubberPhase = ref(0); written at 60 Hz via paintScrubberPhase() (useSpringHotPath.ts:143). Read in demo/app/scenes/SpringScene.vue:113 — demo.scrubberPhase
  - _→_ The scrubberPhase ref should not be reactive at all: replace it with a non-reactive number in springLive (springLive.scrubberPhase) and either (a) wire the Play
- **[HIGH·workaround]** SegmentedTabs aria-orientation suppress workaround still present — BC-gated, P-inv-28 risk
  - _ev:_ demo/spring/SpringSidebar.vue:43 — :aria-orientation='undefined' on the pill SegmentedTabs view switcher. glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406 — emits :aria-orientation='isVertica
  - _→_ Deferred to O.W12 (the BC-gated consume wave). The suppress line at SpringSidebar.vue:43 (and AnimationControls.vue:72) is correctly retained until glass-ui BC 

**Novel ideas:**

- [incremental·arch] **springLinearStopsArray() — a first-class kf API returning [{v, pct}] stops for direct plot consumption**
  - _mech:_ src/animation/springLinearStops.ts:46-73 already computes the (v, pct) pairs internally before formatting them as a CSS string. Adding springLinearStopsArray({response, dampingFraction, sampleCount?, 
  - _payoff:_ Eliminates the SpringTrace parser bug at the root (no inline parser = no wrong-pct bug). Reduces SpringTrace.vue from 95 · _feas:_ Trivial — the array is already computed in springLinearStops.ts:63-68; the refactor is 5-10 LoC. The only risk: adding to the LIGH
  - _gate:_ proof:spring-stops-array — import springLinearStopsArray from the LIGHT barrel; assert first stop pct===0, last stop pct
- [incremental·perf] **Non-reactive scrubberPhase channel: replace the 60 Hz Vue ref write with a registered DOM callback**
  - _mech:_ Replace scrubberPhase = ref(0) in useSpringHotPath.ts:80 with an entry on springLive (springLive.scrubberPhase: number, non-reactive). Add registerScrubberPainter(cb: (phase: number) => void) to the h
  - _payoff:_ Eliminates the 60 Hz re-render of the ribbon functional component in App.vue. The Vue reactive scheduler is called 6× pe · _feas:_ Moderate — requires exposing a painter registration API from useSpringHotPath AND a way to write directly to the glass-ui Slider's
  - _gate:_ proof:spring-scrubber-hot — mount the Spring scene; verify via MutationObserver that the ribbon root element's subtree r
- [aggressive·perf] **Canvas-drawn spring comparison overlay — collapse 4 DOM painter registrations into 1 canvas draw call per frame**
  - _mech:_ Replace the 4 preset-cell ToggleChip balls (each with a registered springPainter in SpringSidebar.vue:177-184) with a single <canvas> overlay on the preset grid. The canvas painter reads springLive.tr
  - _payoff:_ Reduces per-frame DOM work from 4 style mutations to 1 canvas draw. The 4 preset balls become pixel-perfect spring curve · _feas:_ Moderate — requires canvas sizing/dpr handling and CSS token resolution (--ball-tone per preset needs getComputedStyle at mount). 
  - _gate:_ proof:spring-canvas-painter — mount Spring scene; assert document.querySelectorAll('.preset-ball').length === 0 (no ball
- [radical·demo] **Live spring parameter space heatmap — 2D response×damping click-to-jump navigation**
  - _mech:_ Replace or augment the two LabeledSliders (response / dampingFraction) with a 2D scatter plot: a 200×200px canvas grid where x = response [0.1..1.2] and y = dampingFraction [0.2..1.5]. Each cell is ti
  - _payoff:_ Transforms abstract numeric sliders into a navigable physics landscape. The designer learns the spring's behavior surfac · _feas:_ Aggressive but achievable. The settle-time heatmap requires ~400 SpringProgress instances sampled at mount (a one-time ~10ms cost)
  - _gate:_ proof:spring-heatmap-mount — mount Spring scene; assert document.querySelector('.spring-heatmap') exists; assert clickin
- [aggressive·demo] **Velocity phase-plane portrait — draw (x, v) phase-space trajectory as the spring evolves**
  - _mech:_ Add a second SVG panel below SpringTrace in SpringTarget.vue that plots the phase portrait: a 2D curve tracing (x(t), v(t)) as the spring evolves after a re-seat. The x-axis is displacement [0..1.3 fo
  - _payoff:_ Unique educational value: phase portraits appear in every physics textbook but no browser spring animation library has e · _feas:_ Achievable in ~100 LoC (SVG path element, ringbuffer of [x,v] pairs, per-frame point append via painter). The risk: path element g
  - _gate:_ proof:spring-phase-portrait — mount Spring scene; re-seat the target; assert a <path class='phase-trace'> element exists
- [incremental·demo] **Unified spring parameter URL-share — encode (response, dampingFraction, view) in hash for deep-linking**
  - _mech:_ Extend the existing hashSharing.ts (demo/@/components/custom/animation-controls/stores/hashSharing.ts) to include the Spring scene's (response, dampingFraction, view) in the URL hash. The Spring scene
  - _payoff:_ Makes spring configurations shareable and bookmarkable — a designer workflow requirement. Aligns with the existing Share · _feas:_ Low complexity — the hashSharing infrastructure exists; the Spring scene just needs to register its encode/decode pair. The risk: 
  - _gate:_ proof:spring-url-share — navigate to /#spring?r=0.35&z=0.45&v=solver; assert demo.response.value === 0.35 and demo.dampi

**Recs:** Fix the SpringTrace.vue linearPlot parser: anchor pts[0].pct = 0 and pts[n-1].pct = 100 BEFORE the fill loop (SpringTrace.vue:55-76). This is the high · Add class='focus-ring' to the spring rail element in SpringTarget.vue:64. The role=slider interactive element with tabindex='0' and keyboard handlers  · Add Y-axis clamping in useSpringPaneDrag.ts applyTransform(): compute laidOutTop = rect.top - offsetY and clamp offsetY to [8 - laidOutTop, window.inn · Eliminate the 60 Hz scrubberPhase Vue ref write by moving scrubberPhase into the non-reactive springLive snapshot and registering a DOM-direct painter · Scope springLinearStopsArray() into the next kf minor release: expose the [{v, pct}] stop array alongside the CSS string from springLinearStops(). Thi · O.W12 (BC-gated): do NOT delete the :aria-orientation='undefined' suppress lines at SpringSidebar.vue:43 and AnimationControls.vue:72 until proof:glas · Consider the 2D response×dampingFraction heatmap as a replacement for the two LabeledSliders — it would make the Spring scene's parameter navigation a

---

## D5-easing

The easing scene is the demo's headline interactive surface and is genuinely well-built: the hot path is already off the Vue render graph (imperative dot painters via `registerDotPainter`, useEasingDemo.ts:189-228), the curve canvas is container-bounded, and the trace/self-draw delight dogfoods the library's own DrawSVG/SmoothProgress. The O.W5 DemoControlPoint build-in is sound in INTENT (consolidate the hand-rolled `useEasingCurveDrag.ts` CTM/hit-test onto the published LIGHT `drag2D`) but the spec has a load-bearing UX hole it never confronts: `drag2D`'s default spring (`dampingFraction: 0.86`, spring.ts:109) RINGS, so a bezier handle released mid-drag would overshoot past where the user dropped it — a precision regression for a curve editor, the opposite of the bespoke smoothing it replaces. The biggest generative opportunities are (1) making the editor directly draggable on the HERO stage (today the protagonist plate is read-only; you edit in a ~300px sidebar while a separate big ball moves), (2) a comparison/diff overlay so "f(t)=" means something, and (3) replacing the bespoke `pointerToSVG` CTM math + viewBox sampling with modern primitives. Every idea below is grounded in file:line with a born-RED gate.

**Critical findings:**

- **[HIGH·risk]** drag2D default spring rings — a curve handle would overshoot past the release point (O.W5 unaddressed)
  - _ev:_ src/animation/drag.ts:234 `this.spring.subscribe((v,vel)=>this.emit(...))` — DemoControlPoint reads emissions driven by the rAF spring settle; spring.ts:108-109 default `dampingFraction: 0.86` (under-
  - _→_ O.W5 MUST add an S-clause: DemoControlPoint passes `springOptions:{dampingFraction:1}` (critically damped, no overshoot — spring.ts:31) OR a near-instant `respo
- **[HIGH·gap]** The headline 'hero' stage is read-only — you cannot edit the curve where it is largest
  - _ev:_ EasingHeroStage.vue:48-68 renders the projected curve `aria-hidden='true'` with `pointer-events:none` (style :208); the editable canvas is exiled to the sidebar at `clamp(260px,64cqi,360px)` (EasingSi
  - _→_ This is the single highest-leverage demo improvement and the natural home for DemoControlPoint: put the draggable handles on the HERO projection, not (or in add

**Novel ideas:**

- [aggressive·demo] **Make the HERO stage curve directly draggable — promote DemoControlPoint onto the protagonist plate, not just the sidebar**
  - _mech:_ EasingHeroStage.vue:63-68 already renders the live `demo.svgPath` full-bleed (aria-hidden, pointer-events:none). Add two DemoControlPoint handles bound to `demo.bezierControlPoints` over the hero SVG'
  - _payoff:_ The headline demo becomes a direct-manipulation instrument: grab the curve, watch the ball's traversal re-time in real-t · _feas:_ preserveAspectRatio='none' on the hero (EasingHeroStage.vue:54) means NON-uniform scale — the per-axis CTM decouples cleanly (no s
  - _gate:_ born-RED: navigate `#/easing` singular mode, assert ≥2 draggable handles exist ON the hero stage element (not the sideba
- [incremental·demo] **Comparison-DIFF overlay: ghost the previous/named curve behind the edited one so 'f(t)=' has a reference**
  - _mech:_ EasingCurveCanvas.vue:38 already draws the f(t)=t diagonal-ref. Extend: when the user edits a NAMED curve into custom (useEasingDemo.ts:328-330 switches name→cubic-bezier), draw the ORIGINAL named cur
  - _payoff:_ Editing becomes legible — you see how far you've pulled from ease-out, not just an absolute curve. Turns the editor from · _feas:_ Pure additive SVG path; the original bezier is already resolved. No perf cost (one static path). Risk: visual clutter — gate the g
  - _gate:_ born-RED: select 'ease-out', drag a handle, assert a second `.bezier-path--ghost` path with the ORIGINAL ease-out `d` is
- [incremental·correctness] **Replace the 17-sample viewBox overshoot scan + bespoke rubberBand with a single closed-form clamp**
  - _mech:_ EasingCurveCanvas.vue:217-226 samples the fn 17x to find y-extrema. For a cubic bezier the y-extrema are at the endpoints + the two control-point y's (y1,y2) only — `Math.min(0,1,y1,y2)`/`max` is exac
  - _payoff:_ Removes a per-move numeric proxy with an exact analytic bound; KISS. Eliminates 17 fn-evals/pointermove during a drag (t · _feas:_ The convex-hull property holds for the CURVE; the displayed path is the curve, so the hull bound is sound and TIGHTER than 17 samp
  - _gate:_ born-RED: for an extreme back-curve bezier (y2 > 1.5), assert the computed viewBox height EQUALS the analytic `max(contr
- [radical·arch] **Unify ALL demo drag handles (timeline diamonds, motion-path anchors, sequence rows) onto drag2D via DemoControlPoint as the shared primitive**
  - _mech:_ O.W5.md:204 explicitly EXCLUDES this ('a separable refactor'). But the substrate is identical: useDragCapture (the shared seam) + bespoke per-surface coordinate maps. DemoControlPoint generalizes to {
  - _payoff:_ Collapses 3-4 bespoke drag composables into ONE published-primitive consumer — the precept's 'architectural transpositio · _feas:_ AGGRESSIVE — each surface has subtly different physics (timeline diamonds snap to frames, motion-path anchors are unbounded, curve
  - _gate:_ born-RED: a `proof:drag-primitive-unified` asserting ZERO bespoke `pointerToSVG`/hit-test composables remain (grep) AND 
- [incremental·demo] **Add a fine/coarse keyboard-nudge + numeric (x1,y1,x2,y2) inline editing to the handles**
  - _mech:_ O.W5's keyboard-operable clause (O.W5.md:120) gives arrow-key nudge. Extend: shift+arrow = fine (0.001), arrow = coarse (0.01), and an inline editable readout (EasingSidebar.vue:123-131 already builds
  - _payoff:_ Precision authoring — designers can type exact values OR nudge. The parse path ALREADY exists (parseCSSValue); only the  · _feas:_ Low risk — parseCSSValue already handles cubic-bezier/steps/named (useEasingDemo.ts:337-371). The readout is currently read-only (
  - _gate:_ born-RED: focus a handle, shift+ArrowRight, assert x nudges by 0.001 (not 0.01); type 'cubic-bezier(.17,.67,.83,.67)' in

**Recs:** BLOCKER for O.W5 impl: add a spring-tuning S-clause. DemoControlPoint over drag2D MUST construct with `springOptions:{dampingFraction:1}` (critically- · O.W5.md:89's claim that the bespoke CTM math 'moves into drag2D's transform fn' needs a precondition cite: drag2D.transform is per-axis SCALAR, so it  · Highest-leverage demo win (separate from but enabled by O.W5): put DemoControlPoint handles on the HERO stage (EasingHeroStage.vue:63-68), not only th · Keep the `keyboard-operable` clause (O.W5.md:159) BLOCKING — today the SVG-circle handles have zero tabindex/role/arrow support (EasingCurveCanvas.vue · Confirm the live-drag gate exercises BOTH editor hosts (sidebar rail AND in-panel TimingFunctionPanel) or explicitly rely on the shared-EasingCurveCan · Do NOT let the 'unify all demo drag handles onto drag2D' radical idea leak into O.W5 — O.W5.md:204 correctly excludes it; it is a separate tranche wit

---

## D6-shell-switcher

The app shell (App.vue / scenes.ts / router.ts / ChromeDock.vue) is clean, machine-driven, and already View-Transition-wired: scene switching today is a glass-ui dock dropdown Select with hover-warm prefetch + a SpringProgress no-VT cross-dissolve fallback — a competent but ORDINARY picker. The shelved N "Stage" switcher (DK64 downlight carousel) is NOT a paper prototype: a ~3,500-LOC implementation exists on branch n-stage-impl with real rotateX(-15deg) turntable geometry, a single shared RAFPlayback LOD clock, dogfooded SpringProgress orbit/arrows, a clean STAGE_DOCK_KEY provide/inject seam, and unit tests — it was shelved with FOUR specific, identifiable blockers, not a fundamental flaw. The blockers: (1) mobile is COMPLETELY unbuilt (zero @media max-width anywhere in the scene-stage subtree — the prototype's claimed 720px rule does not even exist in the committed HTML); (2) light-mode contrast was cured in the prototype but the cure's transposition to the impl is unverified; (3) the dropdown→nameplate + front-card→scene-host shared-element VT morph (the signature "grows from the trigger" beat) was never wired; (4) the STAGE-SPEC's S0 perf baseline ("SLOW") was never quantified, so the 7 live previews remain an unmeasured risk. The path to unshelf is to MEASURE-FIRST then transpose the JS-spring carousel to a native scroll-driven + scroll-snap CSS carousel on mobile (and arguably everywhere), eliminating the entire mobile gap and most of the perf risk in one architectural move.

**Critical findings:**

- **[BLOCKER·gap]** Mobile is entirely unbuilt — zero responsive layout anywhere in the scene-stage subtree
  - _ev:_ On n-stage-impl, `git show ...CarouselDisk.vue | grep -c max-width` = 0; grep across the whole scene-stage subtree finds only `@media (prefers-reduced-motion)` queries, never a `max-width` breakpoint.
  - _→_ This is THE shelf-driver. The 3D ring cannot shrink to a phone — flanks clip at viewport edges, the nameplate/arrows/hint collide (harden findings:17, screensho
- **[HIGH·gap]** The dropdown→stage shared-element VT morph (the signature 'grows from the trigger' beat) was never wired
  - _ev:_ prototype-harden-findings.md:19 — the dock trigger carries view-transition-name:dock-select-trigger while the nameplate carries stage-nameplate (DISTINCT names), so the open VT 'only blooms stage-root
  - _→_ The liquid-glass entry beat that justifies the whole feature is the missing piece. modern-web same-document-transitions guide gives the exact pattern: apply a s
- **[HIGH·risk]** The STAGE-SPEC's 'SLOW' concern (S0 baseline) was never quantified — 7 live previews remain an unmeasured perf risk
  - _ev:_ docs/tranches/N/STAGE-SPEC.md:26 (S0) mandates 'open the current Stage in Chrome, record a performance trace... the actual FPS during the carousel (the slow quantified)' as 'the number every later sta
  - _→_ MEASURE-FIRST is the governing precept here (observable-truth). The owner named two failures: SLOW and WRONG. SLOW was never measured. An unshelf MUST begin wit

**Novel ideas:**

- [aggressive·modern-web] **Transpose the mobile (and arguably the default) carousel from a JS SpringProgress ring to a native CSS scroll-driven + scroll-snap carousel **
  - _mech:_ On phone-narrow, replace CarouselDisk's 3D turntable with a horizontal `overflow-x: scroll; scroll-snap-type: x mandatory` scroller of preview cards. Each card animates scale/opacity/brightness via `@
  - _payoff:_ (a) The mobile blocker dissolves — native swipe/snap IS the phone-correct gesture, zero bespoke layout. (b) GPU-composit · _feas:_ Baseline-Newly-Available for scroll-driven animations; the guide MANDATES `@supports ((animation-timeline: view()) and (animation-
  - _gate:_ Born-RED: on a 390px emulated viewport (chrome-devtools-mcp), the scene-stage renders a horizontally-snapping scroller w
- [incremental·modern-web] **Wire the signature dropdown-trigger→nameplate→front-card→scene-host shared-element View Transition chain so the Stage literally 'grows from **
  - _mech:_ Per modern-web same-document-transitions: on open, set the SAME `view-transition-name` (e.g. `stage-portal`) on the dock Select trigger AND the stage nameplate immediately before startViewTransition(o
  - _payoff:_ Delivers the design-synthesis.md:76 'grows from the dropdown' + decision-3 'fade-into-scene commit' beats that prototype · _feas:_ View Transitions are already in the stack (useSceneTransition.ts uses glass-ui startViewTransition; App.vue:460 already manages on
  - _gate:_ Born-RED: during stage-open, a single ::view-transition-group(stage-portal) exists in the pseudo-tree and animates from 
- [aggressive·arch] **Add a 'glance' affordance: hovering/long-pressing the dock scene Select peeks a miniature live ring inline (an anchor-positioned popover) be**
  - _mech:_ Use the Popover API + CSS anchor-positioning to tether a compact 3-card ring preview to the dock Select trigger on hover-intent (the warmScene prefetch at scenes.ts:77 already warms the chunks). A cli
  - _payoff:_ Resolves the tension between 'theatrical showcase' (great once) and 'I just want to switch scenes fast' (every other tim · _feas:_ Anchor positioning is Newly-Available (Chromium-only as of 2026; Safari/FF lag) — MUST feature-detect `@supports(anchor-name: --x)
  - _gate:_ Born-RED: hovering the dock Select for >150ms opens an anchor-tethered popover containing a 3-card live ring whose front
- [incremental·perf] **Drive the carousel falloff (opacity/scale/brightness/blur) entirely through registered @property custom properties off ONE ring-angle, so th**
  - _mech:_ useCarouselOrbit.derive(cardIndex) currently returns a per-card bundle {transform,opacity,scale,brightness,blur,zIndex} that the view binds reactively for all 7 cards each spring frame. Instead, write
  - _payoff:_ Collapses 7 reactive Vue style recomputations per frame to a single property write — fewer Vue reactivity invalidations, · _feas:_ @property is Baseline-Widely-Available. CSS trig (sin/cos) is Newly-Available — feature-detect; the JS-derive path (current code) 
  - _gate:_ Born-RED: a perf trace of a spin shows the disk root receives exactly ONE custom-property style mutation per frame (not 
- [incremental·perf] **Replace the amiga (Three.js/WebGL) live preview with a recorded WebCodecs/canvas micro-loop or a CSS-only fake, removing the single WebGL co**
  - _mech:_ STAGE-SPEC S6 (L72) + IMPL-BLUEPRINT:50 both name the amiga WebGL preview as 'the perf ceiling — one WebGL preview' and already concede a 'static last-frame poster' as the only allowed poster. Go furt
  - _payoff:_ Eliminates up to 6 of 7 frames' worth of the most expensive preview (WebGL context + ReadPixels stall the SPEC explicitl · _feas:_ Straightforward — the LOD tier system (sceneStageRegistry.ts has a per-scene LOD tier) already exists to express 'amiga is special
  - _gate:_ Born-RED: a perf trace with all 7 cards shows at most ONE active WebGL context (the front), and switching amiga to front

**Recs:** UNSHELF the N Stage switcher as a scoped finishing tranche, not a rebuild — the n-stage-impl branch (~3,500 LOC, dogfooded, geometry-correct, tested)  · MEASURE-FIRST before any new code: run the STAGE-SPEC S0 chrome-devtools-mcp perf trace on n-stage-impl to quantify the 'SLOW' the owner named (observ · Solve mobile by TRANSPOSITION not patching: build the phone-narrow layout as a native scroll-snap + view-timeline horizontal carousel (modern-web caro · Wire the signature shared-element VT chain (dropdown trigger→nameplate on open, front card→scene-host on commit) via reactive :style view-transition-n · Re-verify the light-mode cure transposed into the impl (pin on-stage ink theme-invariant-light per design decision 4) and give the downlight a genuine · Resolve the top-layer reachability question (Popover stage vs normal-layer bottom-dock arrows) with a chrome-devtools-mcp hit-test before unshelf: a r · Keep the dock <Select> as the documented keyboard/AT fallback (design-synthesis.md:112) — the Stage becomes the primary surface, the Select the access · Route the @mbabb pointerdown-synthesis workaround (App.vue:378-449) and any other glass-ui dock press-scale issues to the glass-ui-BC handoff lane, no

---

## D7-playgrounds

The keyframes.js playground is the most complete of the three, featuring an asset canvas, preset binding, bind-ignition comet-tail (library dogfood), and proper glass-ui integration. Its gaps are: only 5 of 30+ available presets are exposed, image/SVG asset kinds have dead UX paths (no file input or URL field in the properties panel), the SVG sanitization is trivially bypassable via `onerror`/`onclick` inline handlers (only strips `<script>` tags), and asset state is only localStorage-persisted (no URL-share for scenes). The value.js demo is a rich color-picker app but its identity as a library showcase is opaque — the parsing, gradient interpolation, and OKLab math that ARE running are invisible; the hero-lab sub-app is disconnected from the main router, making it effectively hidden. The parse-that playground is four static markdown files covering the core API but missing `altSpan`, `takeUntilAnySpan`, `splitBalanced`, `enableDiagnostics`/`formatDiagnostic`, and the critical `dispatch()` WDM packrat — a significant coverage gap for a perf-first library. None of the three playgrounds has a live interactive editor (REPL/sandpack) — a structural gap given they showcase parsing and animation libraries.

**Critical findings:**

- **[HIGH·gap]** Playground: image and SVG asset kinds have dead UX (no content entry path)
  - _ev:_ keyframes.js/demo/@/components/custom/asset-manager/AssetPropertiesPanel.vue:63 — `v-if="asset.kind !== 'text' && asset.kind !== 'svg'"` shows image/SVG are excluded from the bg-color property block; 
  - _→_ Add a URL `<Input>` for `imageSrc` on image assets and a multiline `<Textarea>` (or paste-target) for `svgContent` on svg assets in AssetPropertiesPanel.vue. Al
- **[HIGH·risk]** Playground: SVG sanitization only strips `<script>` tags — trivially bypassable
  - _ev:_ keyframes.js/demo/@/components/custom/asset-manager/AssetViewport.vue:155-158 — `sanitizeSVG` is a single `svg.replace(/<script[\s\S]*?<\/script>/gi, '')`. This leaves `<img onerror=...>`, `<use xlink
  - _→_ Replace the hand-rolled regex with a real sanitizer: use the Trusted Types API with a DOMParser-based allowlist (strip all event-handler attributes, `xlink:href

**Novel ideas:**

- [incremental·demo] **Live parse-output inspector pane in the keyframes.js playground: show the compiled AnimationFrame[] AST as the user edits CSS keyframes**
  - _mech:_ The playground already embeds Monaco via the EditorShell's `CSSCodeEditor`. On every keyframe edit, pipe the CSS string through the HEAVY engine's `resolveKeyframes()` (reachable synchronously via `kf
  - _payoff:_ Turns the playground from a 'run an animation' demo into a 'understand the library' tool. Shows the `interpVars`, `compu · _feas:_ Incremental: `resolveKeyframes` is synchronous after warm-up; the Monaco editor already emits change events. Risk: large keyframes
  - _gate:_ Born-RED gate: `proof:playground-ast-pane` — mount the playground, paste a 3-keyframe CSS block, assert the AST pane ren
- [aggressive·demo] **Parse-that live interactive REPL as a single-file Vite app: browser-side TypeScript parser execution with Monaco input → JSON tree output**
  - _mech:_ Build `docs/playground/app/` as a self-contained Vite app (no backend). Left panel: Monaco editor pre-populated with a `dispatch`-based JSON parser (mirroring `leaf-parsers.md`). Right panel: renders 
  - _payoff:_ Transforms a static doc site into an exploratory tool. Users can experiment with `altSpan`, `dispatch`, `recover()` with · _feas:_ Aggressive: in-browser TS eval is non-trivial but `@typescript/vfs` is battle-tested (TS playground uses it). Risk: bundling parse
  - _gate:_ Born-RED gate: `proof:playground-repl` — launch the REPL page, type `import { string, regex } from '@mkbabb/parse-that';
- [incremental·demo] **value.js demo: 'library lens' overlay — a floating panel that shows the live value.js AST for the currently displayed color**
  - _mech:_ In `ColorPicker.vue` (or the existing `ColorNutritionLabel` display component), add a collapsible 'Parsed AST' toggle that calls `parseCSSColor(cssColorOpaque)` and renders the returned `Color<T>` obj
  - _payoff:_ Makes value.js's internal color representation visible to developers who are evaluating the library. Currently the demo  · _feas:_ Incremental: purely additive UI in an existing component. Risk: the `Color<T>` object structure may not have a stable `toJSON()` s
  - _gate:_ Born-RED gate: `proof:color-ast-panel` — mount the color picker with `oklch(0.7 0.15 180)`, open the AST panel, assert a
- [aggressive·demo] **keyframes.js playground: preset gallery grid with live thumbnail previews — replace the 5-preset dropdown with a scrollable 4-col grid that **
  - _mech:_ In `AssetLayerPanel.vue`, replace the 5-item `<Select>` with a gallery `<Dialog>` that renders a grid of preset thumbnails. Each thumbnail is a 48×48 `<canvas>` or an absolutely positioned `<div>` tha
  - _payoff:_ The playground becomes a discoverable preset showcase — users browse, preview, and bind rather than typing names they do · _feas:_ Aggressive: requires instantiating 30+ animations in a grid (high memory if all run simultaneously). Mitigation: lazy-instantiate 
  - _gate:_ Born-RED gate: `proof:preset-gallery` — open the playground, open the preset picker, assert more than 20 thumbnail cells
- [aggressive·demo] **Playground: CSS keyframes → `linear()` easing curve export — show users how the library converts spring/custom timing to CSS-native `linear(**
  - _mech:_ Add an 'Export → linear()' button to the playground's control pane. It reads the bound animation's `timingFunction` from `kfEngine()`, calls `springLinearStops(timingFunction.fn, { n: 32 })` (LIGHT st
  - _payoff:_ Showcases `springLinearStops` + `springTimingFunction` (the constellation's VJ-L2 delivery). Users go from 'I bound a sp · _feas:_ Incremental for spring presets (they already carry a `timingFunction.fn`); aggressive for user-authored CSS presets where the timi
  - _gate:_ Born-RED gate: `proof:linear-export` — bind a preset with a spring timingFunction, click 'Export linear()', assert the c
- [radical·demo] **parse-that: add `dispatch()` visual trace — a browser-side tool that renders the 128-entry char-code LUT as a color-coded heatmap (which cha**
  - _mech:_ In the interactive REPL (idea #2 above), add a 'Dispatch Inspector' mode: when a `dispatch({...})` call is detected in the user's parser, extract the table, build the 128-entry LUT (mirroring the inte
  - _payoff:_ The `dispatch()` primitive is parse-that's key perf differentiator vs. `any()`. Making the LUT visible turns a micro-opt · _feas:_ Radical: requires exposing or re-implementing `buildTable` in the browser context. The LUT logic is small (scan key strings, fill 
  - _gate:_ Born-RED gate: `proof:dispatch-inspector` — construct `dispatch({ '"': strParser, '0-9': numParser, '{': objParser })` i
- [incremental·arch] **Playground: 'scene as URL' — encode the full asset state + animation bindings into a URL hash using the existing `hashSharing.ts` infrastruc**
  - _mech:_ Wire `useShareState` (already in `demo/@/components/custom/editor-shell/`) into the playground App.vue. The asset state serialization is just `JSON.stringify(state.value)` (already done for localStora
  - _payoff:_ Shareable playground links become a discovery vehicle for keyframes.js. A user who creates a multi-asset bouncing compos · _feas:_ Incremental: `hashSharing.ts` already encodes/decodes animation options; the asset state just needs to be added to the encode map.
  - _gate:_ Born-RED gate: `proof:playground-share` — add 3 assets with bound animations, click Share, load the URL in a fresh windo

**Recs:** Fix the playground's image/SVG asset UX dead-end first: add a URL `<Input>` for `imageSrc` and a textarea for `svgContent` in AssetPropertiesPanel.vue · Replace the naive `sanitizeSVG` regex (strips only `<script>` tags) with `DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } })`  · Build a parse-that interactive REPL page (`docs/playground/app/`) using the published ESM bundle. Static markdown docs with no runnable examples miss  · Expose the full preset library in the playground: replace the 5-preset hardcode in `usePlaygroundAnimations.ts` with a dynamic load from `kfEngine().p · Add a `diagnostics.md` playground page for parse-that covering `enableDiagnostics` / `getCollectedDiagnostics` / `formatAllDiagnostics` / `formatDiagn · Surface value.js's library identity in the color picker: add a collapsible 'Parsed AST' toggle in `ColorNutritionLabel` or a dedicated display pane th · Add the hero-lab to the value.js main app router (`/hero-lab` route + dock menu entry). The hero-lab showcases WebGL rendering over the glass-ui token · Apply a version guard or 7-day TTL to the asset manager's `useStorage` key (mirroring the animation-controls `storeUtils.ts` pattern). The current unb

---

## X1-perf-gates

The constellation perf-gate discipline is sharply asymmetric across its three repos. keyframes.js operates the constellation's gold standard: a taxonomy.json classifying all 42 bench cases into {run-check, observe-only, budgeted, cross-repo}, ratio-normalized budgeted floors via baselineCase×floorFraction (device-independent by construction), a declarePosture() ci-env.mjs posture taxonomy, and durable ADOPT/KILL verdicts (spring-vector-decision.json). value.js has 9 .mjs bench files but only 4 wired to CI, the rationally portable proof:perf-target (css/json.parse ratio) is NOT wired to CI, and there is no posture-taxonomy or taxonomy manifest at all. parse-that has zero bench infrastructure: test/benchmarks/ contains vitest bench files but the A.W3 born-RED gate ("SpanParser >= 10%") has no asserting script, no CI bench step, and no taxonomy. The VJ.L1-L8 color-math alloc hot paths (dispatched from kf's taxonomy.json as cross-repo) have no value.js bench gate anywhere. The bold opportunity is to lift the kf taxonomy/posture/ratio pattern upward into value.js and parse-that, and to design the missing bench infrastructure for the color-math alloc lane (VJ.L1-L8) and the parse-that dispatch hypothesis.

**Critical findings:**

- **[HIGH·gap]** parse-that has ZERO bench infrastructure in CI
  - _ev:_ parse-that/.github/workflows/ci.yml — no bench step, no proof script, no npm run bench. The A.W3 born-RED gate 'SpanParser >= 10% over closure baseline' is stated at docs/tranches/A/waves/A.W3.md:48 a
  - _→_ Design a portable ratio gate: a proof-span-dispatch.mjs that reads vitest bench --outputJson, extracts tagged/closure hz pair, asserts tagged >= closure * 1.10,
- **[HIGH·gap]** value.js proof:perf-target (ratio-normalized CSS-parse gate) is NOT wired to CI
  - _ev:_ value.js/scripts/proof-perf-target.mjs exists and implements the exact portable pattern (valueMBs/jsonMBs ratio >= VALUE_RATIO_FLOOR 0.0100; sheetMBs/jsonMBs >= 0.0200, 9-sample median) but value.js/.
  - _→_ Add `node scripts/proof-perf-target.mjs` as a CI step after the build step. The gate is already portable (ratio vs in-run JSON.parse normalizer). Mark observe-o
- **[HIGH·gap]** VJ.L1-L8 color-math alloc asks: no bench gate anywhere in the constellation
  - _ev:_ kf/bench/taxonomy.json crossRepo[] lists 8 asks (VJ.L1 transformMat3 zero-alloc through VJ.L8 intra-bucket dispatch) pointing at value.js seams. The taxonomy comment (line 18-22) says 'the bench is va
  - _→_ Author a single value.js bench/color-math-alloc.bench.ts (vitest) or bench/color-math-alloc.mjs covering the 8 hot paths with the constructor-counter shim from 
- **[HIGH·gap]** value.js proof:gamut-alloc NOT wired to CI despite being a DETERMINISTIC (non-device-dependent) gate
  - _ev:_ value.js/scripts/proof-gamut-alloc.mjs counts Color constructor invocations using the prototype-swap shim — this is deterministic, not wall-clock. It counts allocs, not timing. The O.W3 cure target is
  - _→_ Wire `npm run proof:gamut-alloc` to value.js CI immediately after the build step. This is a hard gate, not observe-only — alloc counts are deterministic. Add it

**Novel ideas:**

- [aggressive·arch] **Constellation-unified bench taxonomy: a shared bench-registry.json at the DAG root that all three repos contribute a section to, verified by**
  - _mech:_ A docs/constellation-bench-registry.json (or committed to a shared location, e.g. a sister repo or kf docs/constellation/) contains one section per lib: {repo, cases: [{id, category, floorFraction?, b
  - _payoff:_ Closes the VJ.L1-L8 bench gap without requiring all three repos to adopt identical tooling. The registry is a DAG artifa · _feas:_ Requires authoring the registry file in kf docs/, extending proof:bench-taxonomy to verify it, and value.js to write its bench res
  - _gate:_ BORN-RED: proof:bench-taxonomy cross-repo clause fails until docs/constellation/value-js-bench-registry.json exists and 
- [incremental·perf] **Portable ratio normalization for value.js and parse-that: adopt kf's baselineCase×floorFraction model as a vitest bench reporter plugin**
  - _mech:_ Author a tiny vitest bench reporter (bench/reporters/ratio-gate.ts in each sibling repo) that reads benchmark results, matches case pairs by naming convention (e.g. any bench named '* baseline' is the
  - _payoff:_ Eliminates the per-bench process.exit() duplication across 5 value.js bench files and the inline awk CI assertion. One r · _feas:_ Vitest 3.x supports custom reporters via --reporter path. The ratio-gate reporter needs to parse the vitest bench JSON output (alr
  - _gate:_ BORN-RED: value.js CI exits non-zero when color-interp B3-speedup < 2x or color-dispatch dispatch-speedup < 2x in the sa
- [aggressive·correctness] **Color-math alloc regression suite for value.js: deterministic per-call constructor counter covering all 8 VJ.L hot paths in a single vitest **
  - _mech:_ Port the prototype-swap constructor counter shim from bench/color-alloc-hotpath.mjs into a vitest test file test/color-alloc-regression.test.ts. Each VJ.L ask gets a test case with a hardcoded N_TARGE
  - _payoff:_ Converts the VJ.L1-L8 asks from cross-repo documentation items into CI-enforced regression guards. A future optimization · _feas:_ The prototype-swap shim already works (demonstrated in bench/color-alloc-hotpath.mjs and proof:gamut-alloc). The main feasibility 
  - _gate:_ BORN-RED: vitest exits non-zero when any VJ.L alloc regression test fails. Initial BORN-RED state: the N_TARGET values f
- [incremental·perf] **parse-that: dedicate a bench/ directory with vitest bench files (not test/benchmarks/) and wire a portable ratio gate for the SpanParser win**
  - _mech:_ Create parse-that/typescript/bench/ (mirroring kf's bench/) with two files: dispatch.bench.ts (wrapping the existing span-dispatch.bench.ts logic) and json-throughput.bench.ts (wrapping json-comprehen
  - _payoff:_ Closes the last gap in the constellation: all three repos have born-RED bench gates. The SpanParser falsification (tagge · _feas:_ parse-that already has vitest in devDependencies and the bench files exist. The work is: (1) move/wrap into bench/, (2) add taxono
  - _gate:_ BORN-RED: proof:bench-taxonomy exits non-zero until (a) all bench cases are classified, (b) the SpanParser-tagged vs clo
- [radical·arch] **Shared ci-env.mjs posture module extracted to a constellation-shared package or copy-committed to all three repos**
  - _mech:_ kf/scripts/lib/ci-env.mjs (the declarePosture/IN_CI/POSTURES system) is a self-contained module with no dependencies. Extract it to a tiny constellation-ci-env npm package (or simply copy-commit it as
  - _payoff:_ Makes the device-dependence taxonomy (hard / observe-only / runner-calibrated) a first-class constellation artifact. Any · _feas:_ The module is 80 lines of pure Node.js with zero dependencies (ci-env.mjs uses only process.env and console). Copy-commit is the s
  - _gate:_ BORN-RED: value.js proof:perf-target imports ci-env.mjs and calls declarePosture('observe-only', ...) for its wall-clock
- [aggressive·perf] **Ratio-baseline bootstrapping: a CI artifact that persists bench ratios across runs to detect gradual drift below the floor**
  - _mech:_ kf's baselineCase×floorFraction computes the floor from the SAME RUN's baseline hz, which is fully portable but cannot detect gradual drift where BOTH baseline and budgeted cases slow proportionally (
  - _payoff:_ Catches regression classes the same-run ratio model misses: a V8 de-optimization that hurts the SoA Float64Array path mo · _feas:_ GitHub Actions supports artifact upload/download between runs. The main risk is that CI runner hardware differences between runs m
  - _gate:_ BORN-RED: CI exits non-zero when the current ratio for any budgeted case falls below persisted_ratio * 0.90, where persi

**Recs:** Wire value.js proof:gamut-alloc to CI immediately -- it is deterministic (alloc count, not timing) and requires no device-dependence posture. A regres · Wire value.js proof:perf-target to CI after build -- the ratio-vs-JSON.parse normalizer is already device-independent. Mark the wall-clock clauses obs · Author a parse-that proof-span-dispatch.mjs that reads vitest --outputJson, extracts tagged/closure hz pair, and records an ADOPT/KILL verdict in span · Extend value.js bench/computed-endpoint.mjs and bench/numeric-soa.mjs with process.exit(pass ? 0 : 1) gates (the D2 lerpArray >= 1.5x at K=8 threshold · Replace value.js CI inline awk stdout-grep with structured JSON: each .mjs bench emits a small JSON results object that a single proof-bench-validate. · Author value.js bench/taxonomy.json classifying all 9 .mjs bench files and wire proof-bench-taxonomy.mjs to CI -- this is a copy-adapt of kf's existin · Extend kf proof:bench-taxonomy cross-repo clause to verify a value.js-side sentinel confirming VJ.L2-L8 bench arms were actually authored (not just th · For the aggressive-optimization push: design all new bench cases as RATIO gates (new_approach_hz / baseline_hz >= floor) not absolute hz floors. The k

---

## X2-novel-triumvirate

The triumvirate's boldest unrealized lever is the DORMANT codegen spine: bbnf-lang already ships a full CSS-L4 grammar set (`grammar/css/l4/{stylesheet,color,keyframes,easing}.bbnf`) AND a `CompileTarget::Ts` emitter that generates flat, charCode-dispatched, in-place-offset parsers with monolithic kernels (number/quoted_string/identifier/charclass) — yet value.js STILL ships hand-written combinators (`stylesheet.ts`, `units.ts`) and explicitly marks its own `.bbnf` grammars "not yet wired to the runtime." Closing that spine (BBNF→generated specialized value.js CSS parser→kf zero-copy consume) is the one move that would 10x the parse tier WITHOUT re-falsifying SpanParser, because the win comes from generated specialized dispatch + flat structure, not a runtime tagged-union switch. The second lever is allocation: the per-leaf `ValueUnit` is a 6-field fat object deep-`clone()`d per consume, and gamut-map's `color2()` still allocs per bisection step (O.W3 only got 104→84) — a one-allocator SoA transposition (parse straight into typed-array columns, ValueUnit as a typed view) attacks both. WASM/SIMD genuinely wins ONLY at the structural-scan layer (simd-scan's `StructuralIndex` is real and architecture-neutral incl wasm32) but is a tempting-but-wrong loss at the per-frame interp layer where V8 monomorphic closures already win — the SpanParser lesson generalizes.

**Critical findings:**

- **[HIGH·gap]** The codegen spine exists end-to-end but is DORMANT — value.js ships hand-written combinators while its own BBNF grammar is spec-only
  - _ev:_ value.js `src/parsing/grammars/css-values.bbnf:7` — "parseable by BBNF but not yet wired to the runtime. Hand-written combinators in units.ts remain the production parsers"; bbnf-lang `crates/core/tes
  - _→_ This is THE triumvirate-scale lever. Generate the value.js CSS-value parser FROM `css/l4/*.bbnf` via the existing TsEmitter. Born-RED gate: a `proof:codegen-par
- **[HIGH·gap]** ValueUnit is a 6-field fat object deep-cloned per consume — the dominant parse-time alloc the spine never addressed
  - _ev:_ value.js `src/units/index.ts:26` ctor `(value, unit?, superType?, subProperty?, property?, targets?)`; `clone():120` deep-`clone(this.value)` + `clone(this.superType)`; kf `src/animation/utils.ts:291-
  - _→_ A one-allocator SoA: parse straight into typed-array columns (values:Float64Array, units:Uint8Array codes, a string-interning side-table for idents) with ValueU

**Novel ideas:**

- [radical·codegen] **Close the codegen spine: generate value.js's CSS-value parser from bbnf-lang's `css/l4/*.bbnf` via the existing `CompileTarget::Ts` emitter,**
  - _mech:_ bbnf-lang `crates/core/tests/backend_ts.rs` already proves the TsEmitter produces flat charCode-dispatch parsers with `s.offset` in-place mutation and monolithic kernels (`backend/kernels/{number,quot
  - _payoff:_ Eliminates ~700 lines of hand-maintained combinators; the spec IS the parser; future grammar additions (CSS 2026+) are g · _feas:_ HIGH feasibility — the emitter, grammar, and parity tests all exist in bbnf-lang. The tempting-but-wrong trap: do NOT emit a tagge
  - _gate:_ `proof:codegen-parity` (born-RED): over the full CSS corpus, assert the generated `parseCSSValue` output is structurally
- [radical·perf] **One-allocator SoA: parse CSS values straight into typed-array columns with ValueUnit as a {col,idx} view, collapsing clone() to a 2-int copy**
  - _mech:_ value.js `src/units/index.ts:26` ValueUnit is 6 reference fields; `clone():120` deep-clones value+superType; kf `utils.ts:291` clones every leaf per consume. Replace the per-leaf object with column st
  - _payoff:_ Kills the dominant parse-time alloc (a 50-stop keyframe currently mints hundreds of ValueUnits + clones each on consume) · _feas:_ MED — invasive across value.js units/* and kf consume. The tempting-but-wrong trap: do NOT make ValueView carry per-instance closu
  - _gate:_ `proof:valueunit-alloc` (born-RED MEASURE-FIRST, mirrors value.js `proof:gamut-alloc`): instrument allocs/parse-call for
- [incremental·perf] **Finish gamut-map to true zero-alloc with color2Into() out-param — complete the partial O.W3 that named-but-deferred it**
  - _mech:_ value.js `dispatch.ts:244` explicitly defers: "eliminating it requires a `color2Into` out-param (deferred, O.W5 scope)". Add `color2Into(out:Color, color, to)` that writes channels into a passed Color
  - _payoff:_ Closes the wide-gamut rAF egress (oklab color interp — kf's DEFAULT color space per CLAUDE.md) to true zero-alloc; O.W3  · _feas:_ HIGH — the pattern, the re-entrancy argument, and the deferral are all in-source. Low risk; single-threaded scratch is already the
  - _gate:_ Extend `proof:gamut-alloc` (already exists, born-RED capable): assert 0 allocs in the steady bisection loop (currently 8
- [aggressive·perf] **WASM-SIMD structural pre-scan of a full stylesheet (once per parse), feeding a JS combinator walk that O(1)-jumps between structural slots —**
  - _mech:_ bbnf-lang `crates/simd-scan` builds a `StructuralIndex` (positions+kinds) with a wasm32 SIMD kernel (`i8x16.swizzle`+`i8x16.bitmask`). For a full keyframes block (kf's editing-session reality — `compi
  - _payoff:_ future-research §9/§13/§14 project 10-25% on declaration-heavy/structural files; the editing-session re-parse (50-200 st · _feas:_ MED — wasm-bindgen crossing cost is the make-or-break. The tempting-but-wrong trap (the SpanParser lesson, future-research §7): th
  - _gate:_ Born-RED parse-throughput bench: full bootstrap.css/tailwind-output.css (in bbnf bench corpus) wasm-prescan+JS-walk vs p
- [aggressive·arch] **One-clock gestalt: unify the rAF playback clock across the spine so parse-cache invalidation, layout-epoch busting, and frame interpolation **
  - _mech:_ value.js `interpolate.ts` lerpComputedValue caches on `getLayoutEpoch()` (a separate clock from kf's rAF); kf `engine.ts` drives `effectiveT` off RAFPlayback; the parse LRU (`utils.ts:240`) has its ow
  - _payoff:_ Eliminates the class of bug where one cache is stale relative to another after a resize; one place to reason about tempo · _feas:_ MED — touches value.js normalize.ts epoch + kf playback. Risk: the computed-cache epoch is cross-realm (value.js owns it, kf reads
  - _gate:_ Born-RED: a `proof:one-clock` integration test that resizes mid-animation and asserts the computed-value cache, the pars
- [radical·codegen] **Emit the kf frame-compiler's interp plan as generated specialized code per keyframe-shape, the way bbnf emits specialized parsers per gramma**
  - _mech:_ kf `frame-compiler.ts` builds `interpVars`/`allInterpVars` and the engine walks them generically (`engine.ts:754` `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`). For a FIXED keyframe sh
  - _payoff:_ Collapses the per-frame interp to straight-line arithmetic for the common case; the steady-state rAF loop becomes branch · _feas:_ MED-LOW — `new Function`/codegen has a warm-up + CSP cost; only worth it for hot long-running animations. Tempting-but-wrong trap:
  - _gate:_ Born-RED interp bench: for a 1000-frame run of the dominant 2-stop shape, assert the codegen'd interp is ≥20% faster tha

**Recs:** PRIORITIZE closing the codegen spine (value.js CSS parser generated from bbnf-lang css/l4/*.bbnf via the existing TsEmitter) — it is the single highes · Attack alloc at the source (parse-time ValueUnit), not the sink (interp) — the engine hot loop is already zero-alloc; the wins are the 6-field ValueUn · TREAT every WASM/SIMD and codegen-dispatch idea as guilty-until-benched — the SpanParser falsification (parse-that future-research §7) is the governin · RESOLVE the .bbnf source-of-truth fork (value.js's css-values.bbnf vs bbnf-lang's css/l4/*.bbnf) under P-inv-28 — either value.js consumes bbnf-lang's · UNBLOCK the zero-copy consume by shipping VJ-L1 (flatLeaf provenance) on the value.js side — kf's two-arm fallback (a WeakMap that does not survive cl

---

## X3-modern-web

The demo is already modern-web-literate: native View Transitions wrap the scene-id mutation (useSceneTransition.ts), content-visibility caches the inactive Monaco pane (AnimationControls.vue), an IntersectionObserver pauses the WebGL present loop off-screen (AmigaScene.vue), anchor-positioning is @supports-gated for the stage dock (style.css), and container-queries/:has() are in idiomatic use. The HIGH-LEVERAGE frontier is the THREE primitives the demo invokes only at floor strength: (1) View Transitions run on ONE static name (scene-subject) with NO typed/directional transition, NO shared-element morph (dock icon→stage), and NO use of glass-ui's already-shipped gl-list-item / view-transition-type substrate (view-transition.css); (2) scroll-driven animation (animation-timeline) is entirely absent — the scroll-fade is a JS scrollTop/ResizeObserver loop (useScrollFade.ts) that CSS scroll() / view() timelines could replace declaratively; (3) content-visibility:auto is used nowhere for off-screen scene/stage deferral (Tranche O.W14 already plans the gate but no demo usage exists yet). Each is a real reduction of hand-rolled JS with a falsifiable runtime observable. No correctness gaps found; these are GENERATIVE upgrades, not breakage.

**Novel ideas:**

- [incremental·modern-web] **NI-1 TYPED, DIRECTIONAL scene View Transitions — pass `view-transition-type` (forward/back, derived from scene-index delta) so the cross-fad**
  - _mech:_ useSceneTransition.ts:32 currently calls `startViewTransition(() => mutate(id))` with no types. Compute the sign of (targetIndex - currentIndex) from the `scenes[]` order (scenes.ts:92) and pass `{ up
  - _payoff:_ The scene switch gains spatial meaning (next/prev) for free — the dock order becomes legible in motion. Zero new JS stat · _feas:_ Baseline-newly-available (VT since 2025-10; view-transition-type Chrome 125+). PRM degrade already free via glass-ui view-transiti
  - _gate:_ born-RED: `proof:scene-vt-typed` — a Playwright nav from scene[i]→scene[i+1] reads the active `::view-transition-old` co
- [aggressive·modern-web] **NI-2 SHARED-ELEMENT morph: the dock's active scene ICON flies into the stage on switch — assign a transient `view-transition-name: scene-her**
  - _mech:_ ChromeDock.vue:299 renders `<component :is="scene.icon">` per row; the EasingTarget/CubeTarget protagonist plates are stable hosts. On `runSceneSwitch(id)` (App.vue:376), in the pre-transition synchro
  - _payoff:_ The single most-seen motion in the demo gains a designed continuity (the icon you clicked BECOMES the thing on stage) —  · _feas:_ Feasible but the highest-risk idea: the protagonist must NOT be mid-animation at capture (VT snapshots a paused frame — same-docum
  - _gate:_ born-RED: `proof:scene-hero-morph` — Playwright clicks a dock icon, samples the `::view-transition-group(scene-hero)` ge
- [aggressive·modern-web] **NI-3 Replace the JS scroll-fade probe with a CSS scroll-progress timeline — drive the edge-fade mask from `animation-timeline: scroll(self)`**
  - _mech:_ useScrollFade.ts:82-101 toggles classes from `scrollTop/scrollHeight` on every scroll event + a ResizeObserver. Replace with a scroll-driven `@keyframes` that animates the two `--mask-fade-start`/`--m
  - _payoff:_ Deletes a scroll-event listener + ResizeObserver + 3 reactive refs PER scrollable axis (controls pane Y, tab strip X, la · _feas:_ Scroll-driven animations Baseline-newly (Chrome 115+, Firefox 144, Safari 26). RISK (tempting-but-wrong): a NESTED scroller's `scr
  - _gate:_ born-RED: `proof:scroll-fade-css-timeline` — a Playwright test scrolls the controls pane to 50% and asserts the `mask-im
- [incremental·perf] **NI-4 Land the FIRST real content-visibility:auto target — defer the off-screen, non-WebGL scene STAGE content (easing comparison list / spri**
  - _mech:_ O.W14.md:184-189 explicitly conditions `proof:content-visibility-gated` on the demo HAVING active `content-visibility:auto` usage (today: zero, per its grep). Add `content-visibility: auto; contain-in
  - _payoff:_ Skips layout/paint for the off-screen comparison rows on initial scene load (faster first paint of the active stage); an · _feas:_ content-visibility Baseline 2025-09; the @supports-not display:none fallback is in the guide. RISK (tempting-but-wrong): contain-i
  - _gate:_ born-RED: `proof:content-visibility-gated` (the O.W14 gate, authored) — assert the easing comparison-list element resolv
- [incremental·modern-web] **NI-5 :has()-driven stage chrome — collapse the dock/controls affordance via a parent `:has()` selector keyed on the active scene's DFA state**
  - _mech:_ App.vue:248/289 computes `controlSurfaces` and threads `has-control-surfaces` props down to EditorShell to decide whether the controls affordance renders. Where the decision is purely structural (does
  - _payoff:_ Removes a layer of computed-prop → class plumbing for the panel-presence case; the visual state becomes a direct functio · _feas:_ :has() Baseline 2023 (no fallback owed). RISK (tempting-but-wrong): :has() must key on a STABLE structural witness (a `data-contro
  - _gate:_ born-RED: `proof:dock-chrome-has-driven` — assert that on the easing scene (single-surface) the controls-trigger visibil

**Recs:** PRIORITIZE NI-1 (typed directional VT) + NI-3 (scroll-driven fade): both are incremental-to-aggressive, ride substrate glass-ui ALREADY ships (view-tr · Land NI-4 (content-visibility:auto on the easing list / spring sidebar) jointly with Tranche O.W14's proof:content-visibility-gated authoring so the b · Scope NI-2 (dock-icon→stage shared-element morph) to the NON-painted scenes (easing/spring/sequence) FIRST — the cube/amiga live rAF spin violates the · Keep the single `view-transition-name: scene-subject` invariant (App.vue:460) untouched — every VT idea drives DIRECTION via view-transition-TYPE or a · Preserve the AmigaScene IntersectionObserver WebGL-pause (AmigaScene.vue:381) as-is — it is the CORRECT primitive over a rAF canvas; content-visibilit · Every new primitive must carry the established @supports floor: clone the anchor-positioning pattern (style.css:448) — gate the enhancement, keep the 

---

## X4-correctness

The triumvirate's correctness story is architecturally mature — three primary oracles (proof:roundtrip-fidelity, proof:replay-equality, proof:ingest-replay, proof:compile-replay) are all GREEN and their source-shape locks are honest. The DAG of proved invariants is real: parse-that 0.11.0 WDM fix is runtime-confirmed by proof:packrat-sound, value.js P0 grammar crashes are cured by proof:css-parity, and the full replay-equality surface (format.ts ↔ fromString) is gated bidirectionally. However, four live correctness gaps persist on the unimplemented Tranche O tree: (1) named-selector NaN-always-active frame bug (DM-22, no gate yet), (2) two overdue workaround deletions (S1/S2 RED on glass-ui 4.1.0 publish), (3) a constellation-spine parse-that direct-import breach with no W96 boundary scan, and (4) VJ-L1/VJ-L3 Symbol sidechannel still blocking engine-seam decomposition. The corpus coverage is real but thin on the scroll-driven named-selector axis and entirely absent for property-based / differential-vs-browser testing.

**Critical findings:**

- **[BLOCKER·correctness]** DM-22: named-selector NaN-always-active frame bug (O.W3 unimplemented)
  - _ev:_ keyframes.js src/animation/utils.ts:398 — `start.value * duration / 100`; when start is a ValueUnit holding the string `"entry"` (NAMED_SELECTOR_SUPERTYPE), start.value is the string, yielding NaN. Na
  - _→_ The cure must intercept the named-selector path in `calcFrameTime` (frame-compiler.ts:286) before the `start.value * duration / 100` multiply. When `start.super
- **[HIGH·gap]** S1/S2 workaround overdue deletion (glass-ui 4.1.0 published, kf not consuming)
  - _ev:_ keyframes.js scripts/proof-workaround-deletion.mjs output (live 2026-06-20): `S1=RED PRESENT + sibling PUBLISHED` at demo/spring/SpringSidebar.vue:43 and demo/@/components/custom/animation-controls/co
  - _→_ The S1 corrected tripwire requires not just BC version but also the SegmentedTabs.vue `role=group` conditional guard landing (ARIA 1.2 — `:aria-orientation` dis
- **[HIGH·workaround]** S8 FN_NAME Symbol sidechannel onto foreign-realm ValueUnit (VJ-L1 not in value.js 1.0.2)
  - _ev:_ keyframes.js src/animation/utils.ts:45 — `const FN_NAME = Symbol("kf.fnName")` annotating value.js ValueUnit instances from outside. utils.ts:64, :289-294 — re-stamp after every clone() because value.
  - _→_ Blocked on value.js Tranche P shipping VJ-L1 (`fnName?: string` on ValueUnit ctor + preserved by clone()). API-present probe is the tripwire (`"fnName" in new V
- **[HIGH·workaround]** S9 direct @mkbabb/parse-that production dep — constellation-spine breach with no W96 scan
  - _ev:_ keyframes.js src/animation/utils.ts:1 — `import { any as parseAny } from "@mkbabb/parse-that"`. utils.ts:229,236 — two `(CSSFunction.FunctionArgs as any)` / `(parseAny as any)` cross-realm casts. pack
  - _→_ W96 clause must be added to proof-boundary.mjs: scan src/animation/** for `from "@mkbabb/parse-that"` specifiers, assert ZERO. Born-RED today (utils.ts:1). Gree

**Novel ideas:**

- [aggressive·correctness] **Differential browser oracle: compare kf.at(t) against live WAAPI getKeyframes() midpoint for every roundtrip-fidelity corpus fixture**
  - _mech:_ Extend the vitest-browser tier (DM-23 O.W2 cure) to drive each `test/fixtures/keyframes/*.css` fixture through the real browser's `element.animate(keyframes, opts).effect.getKeyframes()`, sample the m
  - _payoff:_ Catches interpolation divergences that are invisible to the pure-JS oracle — e.g. a value.js oklab round-trip float drif · _feas:_ Requires the DM-23 vitest-browser runner (O.W2) to land first. The WAAPI mock in jsdom (used by engine-correctness.test.ts) cannot
  - _gate:_ Born-RED on today's tree: `find test -name '*.browser.test.ts' | wc -l` → 0. Green: ≥1 browser test exists, every `byte`
- [aggressive·correctness] **Property-based grammar fuzz oracle: serialization idempotence over randomly generated CSS value strings**
  - _mech:_ In value.js, author a fast-check (`fc`) property: `fc.string().filter(isValidCSSToken)` → `parseCSSValue(s).toString()` → `parseCSSValue(second).toString()` — assert the two serializations are identic
  - _payoff:_ Finds serializer bugs that hand-crafted corpus cannot anticipate — e.g. an oklab float-precision non-idempotence that on · _feas:_ fast-check is a zero-dep dev dependency already common in the TS ecosystem; adding it to value.js devDependencies is a one-line ch
  - _gate:_ Born-RED: `fast-check` not in value.js devDependencies. Green: `npm run proof:grammar-fuzz` runs 1000 random CSS value s
- [incremental·correctness] **Replay-equality extension: LR stress oracle for parse-that WDM correctness under adversarial grammars**
  - _mech:_ Extend `proof:packrat-sound` (keyframes.js scripts/proof-packrat-sound.mjs) with a C3 clause that generates left-recursive grammars of increasing depth (N=2..10 nesting levels) and verifies the WDM se
  - _payoff:_ The WDM fix (A.W2, parse-that 0.11.0) was verified by one specific LR oracle. CSS grammars like `calc(calc(calc(...)))`  · _feas:_ Entirely in the test/script tier, no src/ mutation. Runs in < 100ms. No browser needed. Builds directly on the existing C1/C2 patt
  - _gate:_ Born-RED: C3 clause absent from proof-packrat-sound.mjs. Green: C3 asserts LR depth 2..5 all converge to the correct par
- [incremental·correctness] **Named-selector phase-mapper integration oracle: assert entry/exit selectors produce correct frame times under a ManualTimeline**
  - _mech:_ After the DM-22 NaN cure (O.W3) lands, add a proof:named-selector-roundtrip gate that: (1) creates a `CSSKeyframesAnimation` with `@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }`, (2) attac
  - _payoff:_ Closes the entire named-selector correctness gap in one gate: ingest without throw (already gated by proof:replay-equali · _feas:_ Straightforward test extension; requires O.W3 to land first. ManualTimeline is already on the LIGHT surface and available in test/
  - _gate:_ Born-RED: `a.at(0.5).opacity` is NaN today. Green: value is 0.5 ± 1e-6 after O.W3 cure + ManualTimeline attachment.
- [aggressive·correctness] **Bidirectional compile-ingest symmetry oracle: compileToCSS output re-ingested via adoptRunning produces numerically equal playback**
  - _mech:_ Add a new test `test/compile-ingest-symmetry.test.ts` that completes the full circle: `AnimationGroup → compileToCSS → CSS string → parseCSSStylesheet → injectIntoDOM → fromStyleSheets → adoptRunning 
  - _payoff:_ The current gates prove: `kf → CSS` is faithful (compile-replay) AND `CSS → kf` is faithful (ingest-replay). But they do · _feas:_ The ingest-cssom walk requires `document.styleSheets` — jsdom supports this via `document.adoptedStyleSheets` injection with a `CS
  - _gate:_ Born-RED: no `test/compile-ingest-symmetry.test.ts` exists (confirmed). Green: for each byte-mode corpus fixture, `|orig
- [radical·correctness] **VJ-L1 WeakMap fallback gate: author the P-inv-28 belt fallback NOW as a parallel cure to unblock O.W7 engine-seam split**
  - _mech:_ Author the kf-internal WeakMap<ValueUnit, string> carrier NOW (before value.js P ships) as the explicit P-inv-28 chronicity-3 early-exit: replace `Symbol('kf.fnName')` with `const FN_NAME_MAP = new We
  - _payoff:_ Unblocks O.W7 (engine.ts 1397→~900 LoC god-object split) which is currently blocked on VJ-L1 per KF-TO-VALUEJS-P-ASKS.md · _feas:_ Pure kf-internal refactor. No value.js API needed. WeakMap<ValueUnit, string> is idiomatic TS. The clone-restamp ceremony stays (W
  - _gate:_ Born-RED: `FN_NAME|Symbol\("kf\.` grep returns hits in utils.ts today. Green: zero hits (Symbol deleted, WeakMap used in
- [incremental·correctness] **W96 proof:boundary parse-that scan: structural gate to prevent S9 silent recurrence**
  - _mech:_ Add the W96 clause to scripts/proof-boundary.mjs: scan all files under `src/animation/**` (excluding node_modules, dist) for any line containing `from "@mkbabb/parse-that"` or `require("@mkbabb/parse-
  - _payoff:_ Closes the gap documented in KF-TO-VALUEJS-P-ASKS.md:158-164 (W96 named since L.W9 but never implemented). Without W96,  · _feas:_ Trivially implementable: 10-15 lines of JS added to proof-boundary.mjs. No dependency changes. Runs headless. The scan must exclud
  - _gate:_ Born-RED: W96 scan absent from proof-boundary.mjs (confirmed by grep returning zero hits). Green: scan present and exits

**Recs:** DM-22 NaN-always-active frame bug is a BLOCKER: any @keyframes with entry/exit selectors silently produces always-active frames (NaN time). Fix calcFr · The W96 parse-that scan (10-15 lines in proof-boundary.mjs) should be authored immediately — it is the structural guard preventing S9 silent recurrenc · Add two born-RED corpus fixtures to test/fixtures/keyframes/: a named-selector (entry/exit) row in `text` roundtrip mode and a @layer-nested @keyframe · The WeakMap kf-internal fallback for S8 (radical idea above) should be seriously considered: it unblocks O.W7 (engine.ts god-object split) without wai · The S1/S2 workaround deletions are overdue (proof:workaround-deletion live output shows RED). The S1 corrected tripwire requires both the BC version A · The differential-vs-browser oracle (novel idea #1) is the most impactful correctness investment for the long term: it closes the gap between kf's JS-m · value.js proof:round-trip-idempotent GREEN is a strong correctness signal but hand-crafted. A fast-check property-based fuzz (novel idea #2) over the 

---

## X5-design-coherence

The demo's design system is architecturally sophisticated and largely coherent: the --ball-tone seam is an elegant single-token scene identity contract that cascades the whole idiom palette (rail/ball/readout/badge/tint), the coordinate grammar (.stage-field-x/.stage-field-y) unifies cross-scene physics visualization, and the typographic register (Instrument Serif + Fira Code + system-ui) is consistently applied via glass-ui tokens. However, several token-ladder leaks erode this coherence: --amiga-phosphor is a raw oklch literal outside the design-idioms.css token family, the cube's --face-1..6 use rgba() primaries with no oklch/hsl/dark-mode path, and the SquareScene's .demo-box uses `black` not `var(--foreground)` creating an AA dark-mode risk. The two most actionable generative opportunities are: (1) extending the motion-path blueprint-ground visual grammar to all storyboard scenes for a unified "storyboard mode" aesthetic identity, and (2) a data-scene attribute system that makes the scene identity contract declarative and inspectable at the EditorShell root, enabling CSS-only per-scene ambient theming without per-scene setup code.

**Critical findings:**

- **[HIGH·risk]** SquareScene .demo-box text color uses `black` not `var(--foreground)` — dark-mode AA risk
  - _ev:_ demo/app/scenes/SquareScene.vue:289 — `color: color-mix(in oklab, var(--subject-teal) 25%, black)`. In dark mode --subject-teal (#52e898 = high-L green) color-mixed 25% toward black produces a still-d
  - _→_ Replace `black` with `var(--foreground)` or use `color-mix(in oklab, var(--subject-teal) 25%, var(--foreground))` so the contrast relationship tracks the dark-m

**Novel ideas:**

- [incremental·arch] **data-scene attribute at EditorShell root: declarative scene identity for CSS-ambient theming**
  - _mech:_ Add `data-scene="easing"` (etc.) to the EditorShell root div when the active scene changes (demo/app/App.vue or EditorShell.vue, driven by the scene machine). Then in design-idioms.css: `[data-scene='
  - _payoff:_ Eliminates per-scene manual --ball-tone root declarations scattered across 7 scene target files. Makes the icon→tone map · _feas:_ Trivial to implement: one `data-scene` attribute write in useSceneMachineApp.ts or EditorShell.vue. The risk is transitioning scen
  - _gate:_ Born-RED: all 7 scenes render with the wrong accent (--scene-accent undefined) until `[data-scene]` attribute wiring lan
- [aggressive·demo] **Unified 'working-surface' tinted-ground layer for all storyboard/editor stages**
  - _mech:_ Extract the motion-path blueprint-ground (MotionPathTarget.vue:303-315: 6-layer background-image tinted from --ball-tone + inner-vignette box-shadow) into a `.stage-ground` utility class in design-idi
  - _payoff:_ Transforms the 'storyboard' and 'editor' stage modes from plain bounded frames into a coherent 'working surface' registe · _feas:_ Medium effort: the motion-path blueprint uses 6 background-image layers in a fixed order; a `.stage-ground` utility must make the 
  - _gate:_ Born-RED: SequenceTarget .seq-stage and SpringTarget outer stage show plain white/muted background (no tinted ground) un
- [incremental·perf] **useDemoAtmosphere composable: shared @property pointer key-light across playground + start screen**
  - _mech:_ Extract the playground's `@property --mouse-x/--mouse-y` pointer-tracking key-light (playground/App.vue) into a shared `@composables/useDemoAtmosphere.ts` composable. Register the two @property <perce
  - _payoff:_ The start screen gains the same 'casting floor' warmth as the playground with ~10 lines of composable call. Unifies the  · _feas:_ Low risk. The @property registrations for --mouse-x/--mouse-y need to move to design-idioms.css (global) — currently they are in p
  - _gate:_ Born-RED: start screen shows no key-light warmth (flat white/glass background) until useDemoAtmosphere is applied to Edi
- [incremental·demo] **Mobile kf-source-egg: simplified 3-line version for screens below lg**
  - _mech:_ EditorStartScreen.vue:265 hides the entire kf-source-egg panel below lg breakpoint (`display: none`). A mobile user gets no live @keyframes round-trip moment. Add a condensed version: a single `<pre>`
  - _payoff:_ Mobile users currently see only the Instrument Serif hero title. A lightweight code snippet (no Monaco, no lazy-load) gi · _feas:_ Low effort: a `<pre class="font-mono text-sm">` with CSS-animated cursor blink and `@keyframes kf-source-rise` for entrance. No JS
  - _gate:_ Born-RED: mobile viewport (<lg) shows no code snippet on the start screen until the simplified egg is implemented.
- [incremental·correctness] **HERO_BALL_SIZE desync elimination: read --ball-size via getComputedStyle at mount**
  - _mech:_ Replace the JS constant `HERO_BALL_SIZE = 56` in EasingHeroStage.vue:113 with a reactive ref initialized in `onMounted` via `parseInt(getComputedStyle(heroBallEl.value!).getPropertyValue('--ball-size'
  - _payoff:_ Eliminates the silent desync risk between CSS and JS. Any CSS refactor that changes --ball-size (e.g. responsive clamp)  · _feas:_ Trivial. The risk is timing: getComputedStyle must be called after the element is mounted and the CSS has applied. onMounted with 
  - _gate:_ Born-RED: hero ball positioning math uses stale constant (56) while CSS --ball-size is set to a different value in a tes
- [radical·demo] **Scene transition ambient color: CSS @starting-style + color-mix to tint the scene-subject view-transition snapshot per destination scene**
  - _mech:_ The `view-transition-name: scene-subject` paint boundary (App.vue: `.scene-host { view-transition-name: scene-subject; contain: paint }`) gives a ::view-transition-new(scene-subject) pseudo-element du
  - _payoff:_ Zero-cost (pure CSS) per-scene transition personality. Each of the 7 navigations has a unique tint — the user subliminal · _feas:_ Requires the `data-scene` attribute system (see idea #1 above) to be in place first. The ::view-transition-new pseudo is supported
  - _gate:_ Born-RED: all scene transitions show the same neutral cross-fade (no tint variation) until data-scene attribute + ::view

**Recs:** IMMEDIATE (before Tranche O impl): Author the missing design contracts in DESIGN.md — the --ball-tone seam, icon→tone table (easing=violet/mp=cyan/spr · FIX dark-mode AA risk in SquareScene.vue:289: replace `black` with `var(--foreground)` in `color: color-mix(in oklab, var(--subject-teal) 25%, black)` · Move --amiga-phosphor to design-idioms.css :root alongside --amiga-red so the amiga CRT color family is on the shared token ladder. · Replace :global(.dark) in AmigaCrtOverlay.vue:58 with the @custom-variant dark (&:where(.dark, .dark *)) pattern used by all other scenes. · Move @property --ball-p, --lit, --spin-energy (all inherits:true) out of <style scoped> blocks and into design-idioms.css global scope to eliminate th · Eliminate HERO_BALL_SIZE=56 JS constant duplication in EasingHeroStage.vue:113 by reading --ball-size via getComputedStyle at mount. · Adopt the data-scene attribute approach (novelIdeas #1) as the canonical implementation path for Tranche O: it makes the scene identity contract decla · Author .stage-ground utility in design-idioms.css (novelIdeas #2) and apply to SequenceTarget .seq-stage and SpringTarget outer stage to unify 'storyb

---

## F1-chronic

The P-inv-28 reckoning across the triumvirate reveals a mixed state. parse-that Tranche A is CLOSED and PUBLISHED (0.11.0); every deferral from A has a named terminal home or KILL record, with two items (all() footgun, console.error diagnostic leak, SpanParser-codegen) formally deferred to post-A tranches. value.js O is FULLY IMPLEMENTED and PUBLISHED (1.0.2); its deferrals are architectural (byte-lossless CST, anchor/view-transition grammar, postcss integration) with BOOK-with-trigger forms, plus the two critical VJ-L1/VJ-L3 APIs that kf critically depends on — both absent from 1.0.2. keyframes.js carries the most acute chronics: DM-2 (GlassControlPoint, born E, 8 carries) and DM-3 (MorphSVG, born C, 8 carries) are BUILD-IN items chartered in O but NOT YET IMPLEMENTED; S1 and S2 workarounds are now genuinely RED (glass-ui 4.1.0 published, deletion overdue); the proof:chronic-closure still points at the L ledger (stale); and keyframes-vue remains E404. The single most urgent gap is the S1/S2 RED state — the glass-ui BC consume is overdue and blocking the DM-1/DM-5 cascade.

**Critical findings:**

- **[BLOCKER·chronic]** S1+S2 workarounds are now genuinely RED — glass-ui 4.1.0 published, deletion overdue
  - _ev:_ keyframes.js/scripts/proof-workaround-deletion.mjs — live run 2026-06-20: S1=RED (aria-orientation suppress at AnimationControls.vue:72 + SpringSidebar.vue:43; @mkbabb/glass-ui@4.1.0 IS published); S2
  - _→_ DM-1 (chronicity 5) and DM-5 S1/S2 must exit in O.W12 in ONE atomic commit: npm install @mkbabb/glass-ui@~4.1.0, delete the two S1 suppresses, delete the S2 Tra
- **[BLOCKER·chronic]** DM-2 GlassControlPoint (born E) — 8th carry, BUILD-IN chartered O.W5 but NOT IMPLEMENTED
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1b: 'BUILD-IN (O.W5) — FORBIDDEN 8TH CARRY CLOSED.' `grep -rn 'DemoControlPoint' demo/ src/` → ZERO (verified 2026-06-19). proof:demo-control-p
  - _→_ O.W5 must implement DemoControlPoint.vue over the LIGHT drag2D (src/animation/index.ts:88 exports it). Author proof:demo-control-point born-RED on the absent co
- **[BLOCKER·chronic]** DM-3 MorphSVG/fromMorphSVG (born C) — 8th carry, BUILD-IN chartered O.W6 but NOT IMPLEMENTED
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1b: 'BUILD-IN (O.W6) — FORBIDDEN 8TH CARRY CLOSED.' `grep -rn 'fromMorphSVG' src/animation/` → ZERO. `ls scripts/proof-morphsvg-consume.mjs` → 
  - _→_ O.W6 must implement fromMorphSVG over published PathGeometry. Author proof:morphsvg-consume born-RED (4 clauses; keystone: mid-t sample DISTINCT from endpoints)
- **[HIGH·gap]** proof:chronic-closure substrate stale — still points at L PROGRESS, not M or O
  - _ev:_ keyframes.js/scripts/proof-chronic-closure.mjs:114: `const CHRONIC_LEDGER = path.join(REPO, 'docs/tranches/L/PROGRESS.md')` — LEDGER_LABEL='K/PROGRESS.md'. The O deferred-ledger §7 specifies the atomi
  - _→_ O.W2 (apparatus/ledger hygiene per kf O.md Band A): atomic re-point of CHRONIC_LEDGER to docs/tranches/O/PROGRESS.md + LEDGER_LABEL to 'O/PROGRESS.md' in ONE co
- **[HIGH·deferred]** S8/S9 workarounds PENDING — VJ-L1 (flatLeaf) and VJ-L3 (parseCSSSubValue) absent from value.js 1.0.2
  - _ev:_ keyframes.js/scripts/proof-workaround-deletion.mjs live run: S8=PENDING ('value.js O shipped VJ-L2 only — flatLeaf provenance API NOT landed'); S9=PENDING ('parseCSSSubValue helper NOT landed'). src/a
  - _→_ Named terminal: value.js P (VJ-L1 + VJ-L3). Chronicity 3 (K,L,M→O); P-inv-28 belt fires at chronicity 4 (kf-P) if value.js P slips. Tripwires: api-present probe
- **[HIGH·deferred]** DM-7 keyframes-vue@0.1.0 E404 — USER-DOMAIN publish still blocking the deploy round-trip
  - _ev:_ `npm show @mkbabb/keyframes-vue` → E404 (verified 2026-06-20). packages/keyframes-vue/dist/keyframes-vue.js PRESENT (clause a GREEN); clause b RED-by-design. Chronicity 3 (K,L,M→O). proof:keyframes-vu
  - _→_ USER-DOMAIN (Mike Babb). The npm publish is `npm publish --access public` in packages/keyframes-vue/. Rides the 5.0.0 cut (DM-16). Terminal at O.WZ — if the 5.0
- **[HIGH·correctness]** DM-22 named-selector frames → NaN-always-active (kf engine correctness) — Band-B-fold NOW, chartered O.W3 but not yet implemented
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1f/DM-22: 'Band-B-fold NOW — NAMED_SELECTOR_NO_TIMELINE typed at errors.ts:46 but NEVER thrown; frame-compiler.ts:128 writes supertype, never r
  - _→_ O.W3 (kf) Band-B correctness fold: make NAMED_SELECTOR_NO_TIMELINE throw at parse time OR resolve frames so they never compute NaN times. Author proof:named-sel
- **[HIGH·correctness]** DM-21 @property drops from compileToCSS — Band-B-fold NOW, chartered O.W3 but not yet implemented
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1f/DM-21: '@property drops from compileToCSS — Band-B-fold NOW — serializeStylesheetItem published in value.js 1.0.2. compileToCSS/compileChild
  - _→_ O.W3 (kf) Band-B correctness fold: wire @property into compileToCSS/compileChild using serializeStylesheetItem from value.js 1.0.2. Extend proof:replay-equality

**Novel ideas:**

- [aggressive·codegen] **parse-that Tranche B: BBNF-codegen pipeline that emits optimized per-rule TS from the SpanParser tagged-union data structure**
  - _mech:_ SpanParser is already kept module-internal in parse-that/typescript/src/parse/span.ts as a data foundation. A codegen pass walks the SpanParser discriminated union and emits a specialized, inlinable T
  - _payoff:_ Closes the BBNF-to-hand-rolled gap from 0.58x to 0.75-0.85x (per future-research.md §11 estimate). The generated CSS-ide · _feas:_ The SpanParser type exists and has byte-identical behavior (verified A.W3). The codegen layer is new work but bounded — it only ne
  - _gate:_ Born-RED: a codegen CLI (`npx parse-that-codegen --rule css-ident --out generated/css-ident.ts`) produces a file that do
- [incremental·arch] **value.js Tranche P: VJ-L1 flatLeaf provenance API — add optional fnName to ValueUnit, preserved by clone()**
  - _mech:_ keyframes.js/src/animation/utils.ts:45-57 stamps a FN_NAME Symbol onto value.js ValueUnit objects to track which CSS function a flattened value came from. This is a foreign-object annotation breach. T
  - _payoff:_ Eliminates the S8 workaround (7 sites in utils.ts:45-57, 213, 289, 342). Kills the FN_NAME Symbol sidechannel and the cl · _feas:_ Additive BC-clean change to ValueUnit. The clone() preservation is the critical invariant — must be verified in value.js tests. Ri
  - _gate:_ Born-RED: proof:workaround-deletion S8 arm — `'flatLeaf' in vjs === false`. GREEN: `'flatLeaf' in vjs === true` + `grep 
- [incremental·arch] **value.js Tranche P: VJ-L3 parseCSSSubValue — expose a single helper that wraps the internal CSS sub-value grammar**
  - _mech:_ keyframes.js/src/animation/utils.ts:1 directly imports from @mkbabb/parse-that and utils.ts:229,236 has two `as any` casts to handle the cross-realm nominal-type seam. The fix (VJ-L3): expose `parseCS
  - _payoff:_ Eliminates S9 (direct @mkbabb/parse-that import + package.json production dep). Reduces kf's dependency surface; proof:b · _feas:_ The internal tryParse + any() + CSSValues.Value grammar already exists in value.js. The exposure is a thin wrapper. Risk: the API 
  - _gate:_ Born-RED: proof:workaround-deletion S9 arm — `'parseCSSSubValue' in vjs === false` AND proof:boundary W96 scan RED on ut
- [radical·arch] **keyframes.js Tranche P: migrate the proof apparatus from the serial mjs chain to vitest-browser shared-chromium (the DM-23 full transpositio**
  - _mech:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1f/DM-23: '276 waitForTimeout settle-sleeps; 72 cold-Chromium launches per run; serial && chain aborts on first red; no eslint/dep-cruiser.' Th
  - _payoff:_ 3-hour → single-digit minutes CI run (the owner's explicit flag). Report-all mode (no serial && abort on first red). Sha · _feas:_ @vitest/browser + playwright is production-ready (Vitest 2.x). The synthetic rAF clock (vi.useFakeTimers + advanceTimersByTime) wo
  - _gate:_ Born-RED: `find test -name '*.browser.test.ts'` → ZERO. GREEN: ≥ 3 former proof:*.mjs gates migrated to *.browser.test.t
- [aggressive·arch] **keyframes.js Tranche O.W6: fromMorphSVG with uniform-arc-length resampling over value.js PathGeometry — a novel motion-path morphing primiti**
  - _mech:_ value.js/node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67: PathGeometry.getTotalLength() + getPointAtLength(length) are published. fromMorphSVG(from: string, to: string, t: number): string
  - _payoff:_ Terminates the 8-tranche DM-3 chronic (born C). Adds a genuinely novel competitor-feature gap-closer (SVG morphing witho · _feas:_ PathGeometry is already published and tested. The only kf-side work is the compositor loop (N=32 sample points is sufficient for s
  - _gate:_ Born-RED: `grep -rn 'fromMorphSVG' src/animation/` → ZERO; proof:morphsvg-consume exits 1. GREEN: fromMorphSVG exports f

**Recs:** IMMEDIATE (before any O implementation): execute the S1+S2 atomic delete — re-pin glass-ui to ~4.1.0, delete AriaOrientation suppress at AnimationCont · O.W2 (apparatus/ledger hygiene): update proof-chronic-closure.mjs:114 CHRONIC_LEDGER from 'docs/tranches/L/PROGRESS.md' to 'docs/tranches/O/PROGRESS.m · O.W3 (Band-B correctness): implement DM-21 @property wiring into compileToCSS/compileChild using value.js 1.0.2 serializeStylesheetItem; implement DM- · O.W5 (DemoControlPoint BUILD-IN, P-inv-28 ABSOLUTE terminus): implement DemoControlPoint.vue over the LIGHT drag2D; author proof:demo-control-point bo · O.W6 (fromMorphSVG BUILD-IN, P-inv-28 ABSOLUTE terminus): implement fromMorphSVG in morph-svg.ts over value.js 1.0.2 PathGeometry (getTotalLength/getP · Dispatch value.js P charter for VJ-L1 (flatLeaf provenance) + VJ-L3 (parseCSSSubValue) as the named terminal home for S8/S9 chronics (chronicity 3, P- · parse-that Tranche B must formally inherit: (1) all() drop-undefined footgun (leaf.ts:125, D8 deferred); (2) console.error diagnostic leak (parser.ts:

---

## F2-defer

The deferred ledger across the three-repo constellation is structurally sound but carries four classes of open debt at the keyframes O boundary: (1) two P-invariant-28 absolutes (DM-2/DM-3) are RATIFIED for BUILD-IN in O.W5/W6 but not yet implemented; (2) two value.js-P-gated workarounds (S8 FN_NAME Symbol / S9 parse-that direct dep) have named terminal homes in value.js Tranche P but VJ-L1 and VJ-L3 have never shipped from any value.js version; (3) glass-ui BC cut remains unpublished (latest is 4.0.1), blocking S1/S2 workaround deletions and DM-1 RF-17 at its 5th chronicity carry; (4) parse-that Tranche B has three clean deferred items from A's kill/defer ledger (all() footgun, console.error diagnostic leak, BBNF codegen tier). value.js's PROGRESS.md was never updated from DEVELOPMENT status despite v1.0.2 shipping all O waves — a doc-honesty gap that feeds the kf-O ground-truth chain. The value.js O.W3 gamut-alloc partial (84 allocs/call, down from 104 but still carrying 24 per-bisection color2() intermediates) is explicitly documented-deferred into value.js P.

**Critical findings:**

- **[BLOCKER·deferred]** VJ-L1 flatLeaf provenance API never shipped from any value.js version
  - _ev:_ keyframes.js/docs/tranches/O/audit/AUDIT-DIGEST.md:158 — 'VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) were never shipped — they are absent from 1.0.2 dist and were not part of 
  - _→_ HANDOFF → value.js Tranche P. kf O.W16 deletes S8 (FN_NAME Symbol sidechannel, utils.ts:45-57) atomically on the VJ-L1 publish. The P-inv-28 >=4 belt fires at k
- **[BLOCKER·deferred]** VJ-L3 parseCSSSubValue helper never shipped — kf carries live parse-that production dep (S9)
  - _ev:_ keyframes.js/src/animation/utils.ts:1 — `import { any as parseAny } from "@mkbabb/parse-that"` is the live production dep; package.json:~215 carries `"@mkbabb/parse-that": "^0.11.0"`; probe: `node -e 
  - _→_ HANDOFF → value.js Tranche P. kf O.W16 deletes S9 (import + two `as any` casts + production dep) + authors proof:boundary W96 parse-that scan (born-RED today on
- **[HIGH·deferred]** O.W7 engine-seam transposition (engine.ts 1397→~900) is VJ-L1-gated and deferred to value.js P
  - _ev:_ keyframes.js/docs/tranches/O/waves/O.W7.md:1-8 — 'Phase: VJ-L1-GATED (fires atomically on value.js Tranche P shipping VJ-L1 flatLeaf, consumed via O.W16; NOT NOW)'; engine.ts confirmed 1397L on 2026-0
  - _→_ HANDOFF (VJ-L1-gated). Wave chain: O.W10 dispatch → value.js P publish VJ-L1 → O.W16 deletes FN_NAME → O.W7 splits engine over cleared seam. Born-RED gate: proo
- **[HIGH·chronic]** DM-1 RF-17 dock crossfade S2 interim at chronicity 5 — BC cut still unpublished
  - _ev:_ keyframes.js/docs/tranches/O/audit/deferred-ledger-O.md §1a — 'DM-1 … 5 (I,J,K,L,M→O) … P-inv-28 belt ACTIVE'; TransportDock.vue:313-338 K.W1 RE-OBSERVED comment; proof:workaround-deletion.mjs:228 har
  - _→_ HANDOFF → O.W12 (BC-gated). Pre-authored CONTINGENCY KILL stands in deferred-ledger-O.md §6 — if O.WZ closes without BC cut, reclassify S2 as a declared kf-inte
- **[HIGH·gap]** S1 aria-orientation workaround blocked: BC misidentified the fix, SegmentedTabs.vue:406 still unconditional
  - _ev:_ glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406 — ':aria-orientation="isVertical ? 'vertical' : 'horizontal'"' unconditional regardless of role; KF-BC.md:37-43 declares 'CONFIRMED' which is 
  - _→_ DISPATCH → glass-ui BC (O.W11). S1 delete gates on BC authoring a NEW SFC wave that guards ':aria-orientation' to tablist-only (not merely on BC cut version num
- **[HIGH·deferred]** DM-7 keyframes-vue 0.1.0 unpublished (E404) — second auto-deploy tripwire
  - _ev:_ keyframes.js/docs/tranches/O/waves/O.WZ.md:42 — 'proof:keyframes-vue-published clause (b) RED-by-design (E404; scripts/proof-keyframes-vue-published.mjs:121 "STAYS RED until the user runs npm publish 
  - _→_ USER-DOMAIN (Mike Babb) at O.WZ. Bump PEER_FLOOR to '5.0.0' in scripts/proof-keyframes-vue-published.mjs:63 and packages/keyframes-vue/package.json peerDependen
- **[HIGH·gap]** value.js PROGRESS.md never updated from 'DEVELOPMENT — charter only' despite v1.0.2 CLOSED
  - _ev:_ value.js/docs/tranches/O/PROGRESS.md:3 — 'Status board. O is DEVELOPMENT — charter only.' at file head; this is the authoritative PROGRESS.md for a tranche that shipped to v1.0.2 (waves O.W0–O.W6 all 
  - _→_ FOLD into value.js P.W0 (doc hygiene wave). Per-wave status: O.W0 SHIPPED 0.13.1, O.W1+O.W2 SHIPPED 0.14.0, O.W3 SHIPPED (integrated into 0.15.0), O.W4/O.W4b SH
- **[HIGH·deferred]** DM-16 5.0.0 version cut and DM-20 deploy round-trip are USER-DOMAIN at O.WZ — no proof:changelog-5.0.0 gate yet
  - _ev:_ keyframes.js/docs/tranches/O/waves/O.WZ.md:35 — 'ls scripts/proof-changelog* → no matches (verified live: zsh no matches found)'; four breaking renames confirmed at engine.ts:1192, timeline.ts:163/209
  - _→_ O.WZ S1: author proof:changelog-5.0.0 (born-RED, gate-first) before the cut. Wire into release.yml as a pre-publish step. The gate reads CHANGELOG.md and assert

**Novel ideas:**

- [incremental·arch] **value.js P: ship VJ-L1 and VJ-L3 as a single 1.1.0 patch — both are <30 LoC additive BC-clean changes that unblock the engine-seam split and**
  - _mech:_ VJ-L1 adds `fnName?: string` to ValueUnit ctor (value.js/src/units/index.ts:30-31) and `clone()` (src/units/index.ts:120-127); flattenObject's FunctionValue branch sets `leaf.fnName = obj.name`. VJ-L3
  - _payoff:_ Unblocks the engine-seam transposition (engine.ts 1397→~900), drops parse-that as a kf production dep, dissolves two act · _feas:_ Both are value.js-internal wrappers over existing code paths. VJ-L3 is the riskier one — the `any(CSSFunction.FunctionArgs, CSSVal
  - _gate:_ Born-RED: `'parseCSSSubValue' in require('@mkbabb/value.js')` → false today on 1.0.2. GREEN: `typeof vj.parseCSSSubValue
- [incremental·correctness] **parse-that Tranche B: ship `allStrict()` (undefined-preserving variant) and `setDiagnosticLogger()` as a single 0.12.0 patch rather than a f**
  - _mech:_ `allStrict()` in leaf.ts: a variant of `all()` that does NOT filter undefined from the result array — the semantics value.js D8 wanted but couldn't risk globally. `setDiagnosticLogger(fn)` in diagnost
  - _payoff:_ Closes two A kill/defer items cleanly. The `allStrict()` name is permanently discoverable; the D8 workaround in value.js · _feas:_ High feasibility. `allStrict()` is a 5-line addition (copy of `all()` minus the undefined filter). The diagnostic logger is a 3-li
  - _gate:_ Born-RED for allStrict: `import { allStrict } from '@mkbabb/parse-that'` → ERR_PACKAGE_PATH_NOT_EXPORTED today (symbol a
- [aggressive·perf] **value.js P: color2Into out-param + mixColorsInto API — eliminate the remaining 24 per-bisection Color allocs in gamutMapToRgbSpace, pushing **
  - _mech:_ dispatch.ts:231 — the `probe OKLCHColor` is already scratch-reused; the remaining allocs are `color2(probe, target)` calls (one Color per bisection step × 24 steps). A `color2Into(src, dest, outColor)
  - _payoff:_ gamutMapToRgbSpace is on the critical path for every wide-gamut animation frame (display-p3/rec2020 keyframes). Reducing · _feas:_ The `color2()` dispatch is a typed switch over colorspace pairs — adding an out-param variant is a signature addition without beha
  - _gate:_ Born-RED: proof:gamut-alloc N_target_v2 clause at <=40 allocs/call exits 1 today (current floor is 84). GREEN: `color2In
- [incremental·correctness] **kf O: FunctionValue.setSubProperty O(N²) loop — a value.js correctness bug that blocks every large keyframe compile**
  - _mech:_ AUDIT-DIGEST.md:188 — 'FunctionValue constructor has an O(N²) setSubProperty loop (v is unused; `this.setSubProperty(name)` called N times each triggering a full N-child walk).' The fix is in value.js
  - _payoff:_ For a keyframe with a large transform list (e.g. `matrix3d(...)` with 16 args), the O(N²) setSubProperty cost is a compi · _feas:_ The fix requires understanding the setSubProperty propagation contract in value.js — whether children inherit subProperty lazily o
  - _gate:_ Born-RED: a bench that constructs a FunctionValue with 16 args and calls setSubProperty shows O(N²) scaling (each call i

**Recs:** value.js Tranche P must ship VJ-L1 (fnName?: string on ValueUnit + clone() preservation) and VJ-L3 (parseCSSSubValue root export) as a single 1.1.0 pu · value.js PROGRESS.md must be updated from 'DEVELOPMENT — charter only' to CLOSED with per-wave status (O.W0–O.W6 shipped, O.W7-demo DEFERRED) before k · parse-that Tranche B should fold three A-deferred items cleanly in one 0.12.0 patch: allStrict() undefined-preserving variant (closes D8 without blast · kf proof:workaround-deletion.mjs:228 must retarget S2 from the stale `@mkbabb/glass-ui@4.1.0` version sentinel to a content-present probe (grep for `u · DM-1 RF-17 at chronicity 5 must receive a NAMED terminal at O.WZ: either (a) BC cut ships and S2 deletes atomically at O.W12, or (b) the PRE-AUTHORED  · proof:changelog-5.0.0 must be authored born-RED (gate-first, before any other O.WZ action) and wired into release.yml as a pre-publish step. The CHANG · value.js P should include a color2Into out-param wave (eliminating the remaining 24 per-bisection Color allocs in gamutMapToRgbSpace, pushing from 84→

---

## F3-prompt-recap

The A→O prompt-recap spine is structurally sound: six versioned prompt-recap docs (C/D/E/H/K→L→M→O) form a verified zero-drop chain, each chain-trusting its predecessor and extending to new session requests. The M recap correctly recaps the apparatus-critique + 32-lane-audit + perf-question intake. The O recap correctly absorbs the constellation campaign (totality/no-workarounds/maximal-parallelism, D1–D11, parse-that A + value.js O deliverables, master merge, demo-gate cascade) and the four IMPL-OPEN post-M-charter events (N-tranche excursion, reorient pivot, re-audit + CONSTELLATION-CAMPAIGN.md, M.W1 impl). One genuine gap: the four post-M-charter events were never folded into prompt-recap-M.md (M-RECONCILIATION §11 IMPL-OPEN); the O recap absorbed them via §7 — the gap was real and is now closed. The current workflow's NEW ask — CHALLENGE the triumvirate with AGGRESSIVE OPTIMIZATION + NOVEL architectural approaches above all (perf + arch), plus a frontend-design fleet for demo usability/clarity/correctness — postdates the O ratification commit (44e7fae 2026-06-20) and has no prompt-recap row anywhere in the tree. This is the only open drop: it must be captured as a new top-level session intake in the next prompt-recap (tranche-P or the O implementation session opener). The governing precepts (NO quick solutions / NO workarounds / architectural transpositions / NO legacy / KISS / observable-truth / born-RED / P-invariant-28) have been carried verbatim from J/J.md:111-119 through every tranche; they are properly the immutable standing spine, not a per-session request.

**Critical findings:**

- **[BLOCKER·gap]** NEW ASK NOT CAPTURED: optimization+triumvirate+frontend-design-fleet
  - _ev:_ keyframes.js docs/tranches/O/audit/prompt-recap-O.md: last row is the O-ratification (44e7fae 2026-06-20). The current workflow prompt ('CHALLENGE the triumvirate with AGGRESSIVE OPTIMIZATION + NOVEL 
  - _→_ UNCAPTURED — the next prompt-recap (the O implementation session opener or a tranche-P recap) MUST add this as a top-level new session intake row: (a) the optim

**Novel ideas:**

- [incremental·arch] **Add a 'new-session-intake' prologue gate to every prompt-recap that runs at session-open to catch any new asks before the dev work begins**
  - _mech:_ A scripts/proof-session-intake.mjs that checks for a mandatory §N-session-intake section in the current branch's prompt-recap doc (docs/tranches/X/audit/prompt-recap-X.md). If the section is absent an
  - _payoff:_ Eliminates the class of 'new ask not captured' BLOCKERs that this lane found. Every future tranche's prompt-recap is gat · _feas:_ Trivial to implement — a file-presence + section-header grep. The risk is over-enforcement (gates that RED on every new branch eve
  - _gate:_ proof:session-intake REDs on a branch that has any commit newer than the last 'RATIFIED' tag in O.md but whose prompt-re
- [aggressive·arch] **Machine-readable prompt-recap schema (YAML frontmatter per row) to enable automated cross-tranche coverage checks**
  - _mech:_ Each prompt-recap row becomes a YAML-fenced block with fields: {id, tranche, source-commit, verdict, wave, gate, evidence}. A scripts/proof-recap-schema.mjs validates the schema and asserts (a) every 
  - _payoff:_ The orchestrator's synthesis could directly read the structured rows; the 'zero drops' claim becomes a gate exit code no · _feas:_ Non-trivial migration (8 existing docs, ~400 rows). Risk: YAML frontmatter in markdown has tooling variance. Mitigation: use a fen
  - _gate:_ proof:recap-schema REDs on a prompt-recap doc that has ≥1 section header matching '### [0-9]+[a-z]?' but no ```yaml row 
- [incremental·arch] **Separate the 'GOVERNING PRECEPTS' (standing spine) from 'SESSION INTAKE' (per-session new asks) in the prompt-recap structure — the spine is**
  - _mech:_ The standing spine (J/J.md:111-119 — the 7 clauses) is extracted to docs/MANDATE.md (versioned, non-tranche-specific). Each prompt-recap §1a merely cites 'MANDATE.md v1.0' + the per-tranche deltas. Se
  - _payoff:_ The 7-clause standing mandate stops being re-copied per tranche (saving ~30 lines per recap); the session-intake section · _feas:_ Low migration cost — the existing §1a sections already cite 'J/J.md:111-119'; extracting to MANDATE.md is a refactor, not a rewrit
  - _gate:_ proof:mandate-stable: assert (a) docs/MANDATE.md exists, (b) the sha256 of its 7-clause section is unchanged from the pr

**Recs:** IMMEDIATE: Add a new session-intake row to the next prompt-recap (O implementation opener or tranche-P) capturing the current workflow's optimization+ · Add a risk row to the O prompt-recap (or the next recap) for the DM-1 RF-17 contingency-KILL scenario: 'IF BC cut does not publish before O.WZ → CONTI · The frontend-design-fleet ask requires the L.W11 TASTE verdict (USER-DOMAIN-PENDING) to be resolved before a new per-scene design fleet baseline is se · Consider extracting the 7-clause standing mandate (J/J.md:111-119) to docs/MANDATE.md so each future prompt-recap §1a can cite a stable versioned refe · The 'optimization+triumvirate' intensification of the architectural-transpositions clause should be chartered as active challenge work (falsify-first 

---

## F4-precept

The precept reckoning across the triumvirate finds the bulk of the "no-legacy/no-workaround" violations already NAMED with terminal homes in Tranche O docs, but several carry real architectural traps the next tranches must transpose rather than band-aid. The headline live workarounds are kf's S8 FN_NAME Symbol sidechannel + S9 direct parse-that cross-realm import (both fully live in src/animation/utils.ts, gated on value.js VJ-L1/VJ-L3 which value.js O DEFERRED) and the 1397-line engine.ts god-object (O.W7, VJ-L1-blocked). The deepest transposition trap is the internal/leaves.ts math duplication: O.md claims it can be retired by importing value.js's new ./math subpath, but proof:boundary bans EVEN the subpath specifier from light source — so the "no-legacy" cut as written would red the gate; this needs a real bundle-externalization transposition, not a delete. value.js carries non-gestalt allocation hot-paths (gamut.ts tuple-return everywhere; O.W3 only reached 104→84 partial) and a `: any`-typed property/subProperty seam (units/index.ts) that erodes the strict-mode invariant; parse-that's SpanParser tagged-union is correctly retired-but-retained as a codegen foundation (the one falsification handled idiomatically).

**Critical findings:**

- **[HIGH·workaround]** kf S8 FN_NAME Symbol sidechannel — foreign-realm object annotation (live workaround)
  - _ev:_ keyframes.js/src/animation/utils.ts:45 `const FN_NAME = Symbol("kf.fnName")`; :47 `type NamedValueUnit = ValueUnit & {[FN_NAME]?:string}`; :54 stampFnName; :64 stamp-on-clone; :289-294 re-stamp after 
  - _→_ TRANSPOSE via value.js VJ-L1 (fnName?:string ctor field preserved by clone(), populated by flattenObject). Dispatched in KF-TO-VALUEJS-P-ASKS.md as O.W10; consu
- **[HIGH·workaround]** kf S9 direct parse-that import + 2 cross-realm `as any` casts (live workaround + extra production dep)
  - _ev:_ keyframes.js/src/animation/utils.ts:1 `import {any as parseAny} from "@mkbabb/parse-that"`; :229 `(CSSFunction.FunctionArgs as any).map(...)`; :236 `(parseAny as any)(fnArgs, CSSValues.Value)`. kf rea
  - _→_ TRANSPOSE via value.js VJ-L3 (parseCSSSubValue root helper wrapping the exact `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` composition same
- **[HIGH·transposition]** kf engine.ts 1397-line god-object — the un-split KeyframesAnimation
  - _ev:_ keyframes.js/src/animation/engine.ts:101 `export class KeyframesAnimation<V extends Vars = any>` spans 1397 lines mixing 15+ config setters (:437-558), frame interpolation (interpFrames :633, processF
  - _→_ TRANSPOSE: O.W7 engine-seam split, BUT it is VJ-L1-gated — the FN_NAME Symbol stamp threads through the flatten/parse seam the split must relocate (KF-TO-VALUEJ
- **[HIGH·risk]** kf internal/leaves.ts math duplication — the no-legacy cut as written would RED proof:boundary
  - _ev:_ O.md:70 claims `internal/leaves.ts duplicating clamp/scale/lerp/lerpArray that value.js 1.0.2's ./math subpath now exports → import the canonical (verify proof:boundary holds)`. value.js/src/subpaths/
  - _→_ TRANSPOSE — NOT a simple delete. The leaves.ts duplication is STRUCTURALLY FORCED by the boundary gate, not legacy. The O.W9 no-legacy claim is self-contradicto

**Novel ideas:**

- [aggressive·arch] **Externalize value.js/math as a bundle-external in the kf LIGHT build so internal/leaves.ts can consume the canonical @mkbabb/value.js/math w**
  - _mech:_ value.js/src/subpaths/math.ts is already parse-that-free + grammar-free (verified: exports clamp/scale/lerp/lerpArray/deCasteljau/cubicBezier from ../math with zero unit/color/parse edges). Teach proo
  - _payoff:_ Retires a genuine duplication the O.md no-legacy band names but cannot currently execute; turns a 4-function parity-test · _feas:_ Tempting-but-wrong risk: if value.js/math's transitive graph EVER picks up a grammar edge (a future refactor that imports easing f
  - _gate:_ proof:boundary gains a `math-subpath-clean` clause: bundle `@mkbabb/value.js/math` as its own entry and assert its stati
- [aggressive·perf] **A single value.js `vec3` out-param scratch convention that eliminates the gamut.ts tuple-return alloc chain library-wide — not just gamutMap**
  - _mech:_ value.js/src/units/color/gamut.ts returns [number,number,number] from 8+ functions that chain (gamutMapSRGB:307 allocates 3-4 tuples per call via oklabToLinearSRGB→srgbToOKLab→gamutMapOKLab→oklabToLin
  - _payoff:_ Color interpolation is the hottest kf path (every oklab keyframe lerp). Eliminating ~80 allocs/mixColors-call removes GC · _feas:_ Out-param scratch is not reentrancy-safe if a conversion calls another conversion that reuses the SAME scratch mid-computation — g
  - _gate:_ proof:gamut-alloc C2 (already authored, born-RED): after-cure alloc count ≤ N_target where N_target < 84 (the O.W3 parti
- [incremental·correctness] **A constellation-wide `proof:no-cross-realm-cast` structural gate that bans `as any` over imported library types — making the S9-class breach**
  - _mech:_ The S9 breach (kf utils.ts:229,:236 `as any` to bridge nominally-distinct Parser<T> across node_modules realms) is invisible to tsc and only caught by a bespoke W96 scan that was NAMED-but-never-built
  - _payoff:_ Turns the precept (no workarounds) into an enforced invariant. The cross-realm cast is the single most insidious workaro · _feas:_ Risk of false-positives: some `as any` over a library type is legitimately unavoidable (genuinely cross-realm types with no shared
  - _gate:_ proof:no-cross-realm-cast born-RED today (kf utils.ts:1/:229/:236 are live violators; value.js units/index.ts:57 etc.). 
- [radical·codegen] **Codegen the value.js Color 15-subclass family from a single channel-spec table at BUILD time — keeping the nominal types but deleting the ha**
  - _mech:_ value.js/src/units/color/index.ts has 15 near-identical subclasses (~24 lines each: declare fields + super(space,alpha) + DEV asserts + N field assigns). A build-time codegen (the SpanParser-retained-
  - _payoff:_ ~360 lines of error-prone copy-paste (each new color space = another hand-written subclass) collapses to a table row + a · _feas:_ TEMPTING-BUT-WRONG risk, flagged hard: codegen'd .ts that consumers import-type from must produce STABLE, diffable, committed outp
  - _gate:_ proof:color-codegen-stable: regenerate the subclass file in CI and assert byte-identical to the committed copy (drift ga
- [radical·codegen] **Promote the SpanParser tagged-union (already retained internal) into the first BBNF→hand-rolled codegen tier in parse-that — cashing the fal**
  - _mech:_ parse-that/typescript/src/parse/span.ts:548-620 keeps the SpanParser flat discriminated union explicitly AS `the prerequisite for the deferred BBNF codegen tier (a serializer/codegen cannot walk opaqu
  - _payoff:_ Closes the BBNF→hand-rolled perf gap (§11 target 0.75-0.85x from 0.58x) by generating the dispatch the runtime switch fa · _feas:_ This is the EXACT thing §7 warns against re-attempting naively: `Do not re-attempt the perf claim on V8 without a fundamentally di
  - _gate:_ proof:bbnf-codegen-perf (MEASURE-FIRST, born-RED): baseline the BBNF-generated parser at 0.58x hand-rolled (C1 records t

**Recs:** TREAT internal/leaves.ts as the priority transposition TRAP, not a delete: O.md:70's 'import the canonical ./math' would RED proof:boundary (keyframes · The S8/S9 workarounds (kf utils.ts:1/:45-57/:229-294) are FULLY LIVE because value.js O DEFERRED VJ-L1+VJ-L3. The terminal is value.js Tranche P BEFOR · Finish the O.W3 gamut-alloc transposition in value.js Tranche P: the tuple-return chain in units/color/gamut.ts is the unfinished 84-alloc floor (O.W3 · Narrow the value.js `: any` property/subProperty seam (units/index.ts:57/:61/:174/:178/:274/:278) to `string` — it erodes the strict-mode/exactOptiona · DO NOT reflexively collapse the value.js Color 15-subclass family or the parse-that SpanParser tagged-union — both are gestalt-justified (nominal doma · Author the missing lint/dep-cruiser tier (O Band A names it; no eslint/dep-cruiser config exists today) and add a proof:no-cross-realm-cast structural

---

## F5-path-forward

The constellation's next-tranche shape is a keyframes-HOSTED optimization tranche (kf-P / "Tranche P-kf") that owns its own engine-perf + demo-frontend-design work AND carries the two sibling dispatch packets (value.js Tranche P, parse-that Tranche B) — NOT three independently-authored per-repo tranches. This is the established, proven inv-16 fence pattern: kf already ships KF-TO-VALUEJS-P-ASKS.md and the BC aria correction as in-tree dispatches that the siblings schedule into their own trees; replicating per-repo authored tranches would violate the single-session-drives-all discipline (D1) and create coordination-cycle risk. The DAG is unchanged from the campaign: parse-that B → value.js P → keyframes opt-tranche (consumer). Two concrete corrections surfaced: (1) value.js O tranche docs are UNCOMMITTED (`docs/tranches/O/` untracked) and its PROGRESS.md still reads "DEVELOPMENT — charter only" despite 1.0.2 having shipped — a record-as-built lie that must be the FIRST P action; (2) the ground-truth "NO bench/ dir" claim is false for both siblings (value.js has `bench/`, parse-that has `typescript/test/benchmarks/`) — the perf frontier has a measurement substrate already.

**Critical findings:**

- **[HIGH·gap]** value.js Tranche O docs are UNCOMMITTED while 1.0.2 shipped — the record-as-built lie
  - _ev:_ value.js `git status`: `?? docs/tranches/O/` (entire O tranche untracked); `docs/tranches/O/PROGRESS.md:3` still reads 'O is DEVELOPMENT — charter only' and `:21` marks O.W0 'PLANNED', yet ground trut
  - _→_ value.js Tranche P's FIRST wave (P.W0) must commit + reconcile the O record: per-wave CLOSED status, the as-shipped version cadence (1.0.0→1.0.2), the VJ-L2-shi
- **[HIGH·deferred]** value.js P deferred-fold inheritance: VJ-L1, VJ-L3, plus FOUR O-internal defers the kf dispatch did NOT name
  - _ev:_ kf names only VJ-L1 (flatLeaf, KF-TO-VALUEJS-P-ASKS.md:26) + VJ-L3 (parseCSSSubValue, :27). But value.js O's OWN wave docs defer more: O.W3.md 'Excluded' tail defers `mixColorsInto`/`color2Into` out-p
  - _→_ value.js P's deferred-fold must enumerate: VJ-L1, VJ-L3 (kf-dispatched), VJ-L4 mixColorsInto/color2Into out-params (O.W3-deferred), the gamut-alloc completion (

**Novel ideas:**

- [incremental·arch] **ONE keyframes-hosted 'Constellation-Optimization Tranche' (kf-P) that owns kf-internal perf+demo+consume-gates AND carries TWO dispatch pack**
  - _mech:_ Replicate the O.md:8-9 inv-16 fence + the KF-TO-VALUEJS-P-ASKS.md:278-282 publish-then-re-pin contract. The kf tranche's DAG is parse-that B → value.js P → kf-internal (engine split O.W7-analog gated 
  - _payoff:_ Single coherent session-of-record (D1); the consume gates (proof:workaround-deletion S8/S9 apiPresent, proof:boundary W9 · _feas:_ HIGH — this IS the proven M→O pattern. Tempting-but-wrong alternative: authoring full per-repo tranche docs in value.js/parse-that
  - _gate:_ proof:dispatch-coverage (kf-hosted, born-RED): assert KF-TO-VALUEJS-P-ASKS.md enumerates VJ-L1+VJ-L3+VJ-L4(out-params)+g
- [incremental·arch] **value.js Tranche P as a TWO-VERSION cut: 1.1.0 (the BC-additive VJ-L1+VJ-L3+VJ-L4 API surface — closes the kf workarounds) then 1.2.0 (the p**
  - _mech:_ KF-TO-VALUEJS-P-ASKS.md:18 already states 'a single value.js patch (e.g. 1.1.0) closes both [VJ-L1/L3]'. Extend: VJ-L4 (mixColorsInto/color2Into, O.W3.md-deferred out-params) is also BC-additive → rid
  - _payoff:_ Decouples the kf 5.0.0-cut blocker (S8/S9 must delete before the major per KF-TO-VALUEJS-P-ASKS.md:177) from value.js's  · _feas:_ HIGH — both cuts are BC-clean (additive API + no-API perf). The P-inv-28 belt (KF-TO-VALUEJS-P-ASKS.md:194-226) already names the 
  - _gate:_ proof:workaround-deletion S8/S9 apiPresent probe (already authored, KF-TO-VALUEJS-P-ASKS.md:228-233): '"fnName" in new V
- [radical·codegen] **parse-that Tranche B = the BBNF→hand-rolled CODEGEN tranche: turn the falsified-but-retained SpanParser tagged-union into a serializable gra**
  - _mech:_ future-research.md:93-99: the SpanParser tagged-union 'survives as the introspectable, allocation-free data representation of a span grammar (a flat structure, no captured closures) — the prerequisite
  - _payoff:_ Closes the BBNF-to-hand-rolled gap (0.58x→0.75-0.85x of hand-rolled per §11) WITHOUT the megamorphic-IC ceiling — V8 mon · _feas:_ MED — radical but grounded; the data substrate (SpanParser) already exists internal to span.ts. RISK (the SpanParser lesson, liter
  - _gate:_ A parse-that B bench (extend span-dispatch.bench.ts): the codegen-generated dispatcher for a representative CSS-value gr
- [aggressive·demo] **The kf demo-frontend fleet ships a 'Constellation Parse-Lab' scene that VISUALIZES the value.js grammar + perf — a live bidirectional CSS↔AS**
  - _mech:_ value.js O.W7-demo.md already authored a 'Parse-Lab pane + gamut-truth indicator + hero-lab shell' in VALUE.JS's demo (value.js/docs/tranches/O/PROGRESS.md:29). kf's demo can consume the PUBLISHED val
  - _payoff:_ Demonstrates the WHOLE constellation in one scene (parse-that primitives → value.js grammar → kf animation), turns the a · _feas:_ MED — value.js publishes the grammar (consumed, not re-authored); kf builds the scene over LIGHT imports. RISK: do not duplicate v
  - _gate:_ proof:parse-lab-scene (kf-hosted, born-RED): the scene mounts, calls parseCSSValue on author input, and asserts the re-s
- [incremental·arch] **Author a single cross-repo CONSTELLATION-OPTIMIZATION-CAMPAIGN.md (successor to CONSTELLATION-CAMPAIGN.md) in kf's tree that locks the kf-P/**
  - _mech:_ The M-era CONSTELLATION-CAMPAIGN.md (docs/tranches/M/) is the precedent: 64 lanes, locked decisions D1-D11, the multi-repo DAG §5, the verify-before-fold ledger §6. The successor locks: D1' (kf-hosted
  - _payoff:_ One constitution the three sibling sessions cite; prevents the per-tranche drift that left value.js O's PROGRESS.md stal · _feas:_ HIGH — pure docs, kf-tree-internal (inv-16 clean). The campaign-doc pattern is proven (M shipped on it).
  - _gate:_ proof:constellation-truth (kf-hosted, born-RED): assert the campaign doc's version-cadence table matches the live regist

**Recs:** TOPOLOGY (the F5 decision): author ONE keyframes-HOSTED constellation-optimization tranche (kf-P) that owns kf-internal perf + demo-frontend-design +  · DAG (unchanged from the campaign): parse-that B → value.js P → keyframes opt-tranche (consumer). The hardest coupling is the kf engine.ts split (1397→ · value.js Tranche P shape: P.W0 = COMMIT the uncommitted O tranche docs + reconcile the stale 'DEVELOPMENT — charter only' PROGRESS.md to CLOSED-with-p · parse-that Tranche B shape: the BBNF→hand-rolled CODEGEN tranche (the surviving SpanParser data foundation per future-research.md §7→§11), the byte-ta · kf demo-frontend-design fleet: FIRST discharge the P-inv-28 chronic terminals (DemoControlPoint O.W5-analog over LIGHT drag2D; fromMorphSVG O.W6-analo · Author a successor CONSTELLATION-OPTIMIZATION-CAMPAIGN.md in kf's tree as the single constitution the three sessions cite — locking the topology, the  · Correct two ground-truth errors before any perf work: (1) value.js HAS bench/ (color-alloc-hotpath.mjs, css-parse-perf.mjs, numeric-soa.mjs…) and pars

---

