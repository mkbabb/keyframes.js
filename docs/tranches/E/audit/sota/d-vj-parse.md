# SOTA Audit — value.js parse-time architecture (lane d-vj-parse)

> Tranche E · research + findings ONLY (no implementation).
> Scope: the value.js CSS parser — `src/parsing/*` and the `@mkbabb/parse-that`
> engine it runs on — measured against W3C specs, the modern-web-guidance
> BASELINE corpus, and the SOTA CSS-parsing field (lightningcss/cssparser,
> csstree, @csstools, Servo/Stylo).
> inv-16: every value.js finding is a **FOLD-VALUEJS-HANDOFF** — a proposal the
> value.js owner formalizes into a value.js tranche. value.js is dirty + active;
> nothing here is a directive to edit it.

This lane goes deeper than the prior `a-vj-parser` pass: it proposes a concrete
SOTA parse architecture (dispatch tokenizer · zero-copy spans · fast-paths ·
packrat scoping · an existing Rust/WASM path) with perf + spec-coverage shapes.

---

## 0. Orientation — what the parser actually is today

value.js does **not** ship a tokenizer. It builds parser-combinator grammars
directly on `@mkbabb/parse-that` primitives (`string`, `regex`, `any`, `all`,
`Parser.lazy`) and threads a single mutable `ParserState` (offset + value +
isError) through them. Public entry points are memoized at the *function-result*
level (one `Map<string, result>` per `parseCSSValue` / `parseCSSColor` /
`parseCSSValueUnit` / `parseCSSTime` / `parseCSSStylesheet` /
`parseAnimationShorthand`), keyed by the raw input string.

The engine underneath is already strong (this matters — see §1 ALREADY-SOTA):

- Mutable single-state threading, no per-step allocation
  (`parse-that/typescript/src/parse/parser.ts`, `state.ts`).
- Zero-copy `Span { start, end }` + `spanToString` and a whole family of
  span-combinators (`regexSpan`, `stringSpan`, `manySpan`, `sepBySpan`,
  `wrapSpan`, `takeUntilAnySpan`) — `parse-that/.../span.ts`,
  `state.ts:119` parserNames.
- An O(1) first-char `dispatch()` (Int8Array[128] LUT) —
  `parse-that/.../leaf.ts:60`.
- `string()`/`regex()` fast paths: single-char `charCodeAt`, sticky-regex
  `test()` with no `RegExpMatchArray` alloc on the default path —
  `leaf.ts:139,180`.
- Packrat `.memoize()` / `.mergeMemos()` with a numeric `(id<<20)|offset` memo
  key and left-recursion guard — `parser.ts:74,83`.
- A complete **Rust** workspace (`parse-that/rust/`) with an enum-dispatched
  vtable-free `SpanParser`, a bespoke HIR→NFA→DFA regex engine, Eisel-Lemire
  f64 scanning, SIMD (`memchr2`), and a **CSS L1.75 typed-AST parser** already
  benchmarked against lightningcss + cssparser.

The headline: **value.js leaves almost all of this on the table.** It uses
`any()` (sequential trial) where `dispatch()` exists; it materializes substrings
where spans exist; it never calls `.memoize()`; and it re-implements in TS a CSS
value/token layer that parse-that already ships hand-written in both TS
(`parsers/css/scan.ts` + `value.ts`) and Rust.

---

## 1. ALREADY-SOTA — do not manufacture work here

**1.1 · The combinator engine is genuinely fast and allocation-frugal.**
The mutable-state design (`ParserState.ok/err/from` mutate in place,
`unsafeSetValue`), the inlined `wrap`/`trim` flag fast-paths
(`parser.ts:456,501`), the `Int8Array` dispatch LUT, and the sticky-regex
zero-alloc `test()` path are all current best practice for a JS PEG/combinator
runtime. **Disposition: ALREADY-SOTA.** No handoff.

**1.2 · Function-result memoization with identity keyFn is correct and cheap.**
`parseCSSValue`/`parseCSSColor`/`parseCSSValueUnit`/`parseCSSTime` use
`keyFn: (input) => input` (`index.ts:266`, `units.ts:118`, `color.ts:630`) — the
E.W1 fix that dropped the `JSON.stringify` quoted-copy synthesis. For a
single-string parser, raw-identity is both faster and the right cache-key shape.
**Disposition: ALREADY-SOTA.**

**1.3 · CSS Color L4/L5 coverage is broad and current.** `color.ts` parses 15
spaces, `color-mix()` with hue-interpolation methods, the `color()` function
(srgb-linear, display-p3, a98-rgb, prophoto-rgb, rec2020, xyz-d50/d65 with
Bradford), and **CSS Color L5 relative-color syntax** (`rgb(from … calc(r*.5) …)`)
routed through `evaluateMathFunction` (no `eval`, no `new Function` — invariant
D6 honored, `color.ts:104-133`). The 155-name lookup is already transposed from a
155-branch `any()` to a single broad-ident regex + `Set.has` (`color.ts:536-552`;
bench `parser-namelookup.mjs` gates ≥5× speedup). This is at or ahead of
@csstools for spec breadth. **Disposition: ALREADY-SOTA.**

**1.4 · CSS Values L4 math is spec-faithful.** `math.ts` parses the full
`<calc-sum>`/`<calc-product>` grammar with correct operator precedence, unary
+/-, nested parens, and the complete function set (min/max/clamp, round w/
strategies, mod/rem with correct sign semantics, abs/sign, trig, exp, hypot, log)
plus the `e`/`pi`/`infinity`/`NaN` constants guarded against ident-prefix
collision (`math.ts:191-198`). **Disposition: ALREADY-SOTA** for what it covers
(gaps are L4/L5 *additions*, see §5).

**1.5 · The at-rule dispatcher already avoids backtracking.** `stylesheet.ts:490`
consumes `@<name>` then `chain()`s to exactly one body parser — no
trial-and-error across keyframes/property/unknown. The balanced-text scanners
(`balancedText`, `splitSelectorList`, `tokeniseShorthand`) are hand-written
char-walk loops, which is the correct shape for delimiter-respecting scans.
**Disposition: ALREADY-SOTA.**

---

## 2. FLAGSHIP FINDING — the parser ignores the engine's fast tier

### 2.1 · `any()` sequential trial where `dispatch()` (O(1) first-char) applies
- **Where:** `units.ts:78` (`Value = any(Length, Angle, Time, Frequency,
  Resolution, Flex, Percentage, Color, Slash, number, none)`); `index.ts:224`
  (`Function_ = any(handleTransform, handleVar, MathFunction, handleGradient,
  handleCubicBezier, handleFunc)`); `index.ts:235` (`Value = any(CSSWideKeyword,
  CSSValueUnit.Value, Function_, CSSString)`); `color.ts:556` (`Value =
  any(colorMix, colorFunction, hex, kelvin, rgbParser, hslParser, …, nameParser)`).
  54 `any(...)` sites across `src/parsing/` (grep: math 9, color 20, stylesheet 8,
  index 17, units 11).
- **Gap:** parse-that ships `dispatch(table)` — an `Int8Array(128)` char→parser
  LUT giving O(1) branch selection instead of N sequential attempts
  (`leaf.ts:60`). value.js uses it **nowhere** (grep for `dispatch` in
  `value.js/src` hits only the *color-space* dispatch table, unrelated). Every
  CSS value parse currently walks the `any()` chain: a `hex` color tries
  `colorMix`→`colorFunction` first (two failed `istring`s) before reaching `#`;
  a `12px` length re-runs `utils.number` up to 7× (Length, Angle, Time,
  Frequency, Resolution, Flex, Percentage each begin `all(utils.number, …)`).
- **SOTA shape:** the CSS value layer is *perfectly* first-char dispatchable —
  `#`→hex, `0-9 . + -`→number-prefixed dimension/percentage, `(`-free idents→
  function/keyword/color-name. A `dispatch` front for `CSSColor.Value` (`#`→hex,
  `r`→rgb, `h`→hsl/hsv/hwb, `l`→lab/lch, `o`→oklab/oklch, `x`→xyz, `c`→color/
  color-mix, default→name) collapses ~14 sequential branches to one LUT read +
  one branch. Same for the top-level `Value` and the math-function set.
- **Perf rationale:** lightningcss/cssparser and csstree both dispatch on the
  first token's type/char before attempting a production — this is the single
  biggest structural win. On the per-frame hot path (§3) it compounds.
- **Isomorphism:** pixel/behavior-identical — `dispatch` selects the *same*
  parser that `any` would have reached; only the selection cost changes. Order-
  sensitive branches (e.g. `alpha` before `a` in relative-color refs,
  `infinity`/`-infinity` ordering) stay inside their sub-parser, untouched.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 2.2 · Per-dimension `any(...UNITS.map(istring))` rebuilds the unit alphabet
- **Where:** `units.ts:20-26` — `lengthUnit = any(...LENGTH_UNITS.map(istring))`
  and six siblings. `LENGTH_UNITS` is 43 entries (`units/constants.ts:42`); each
  `istring` allocates a fresh case-insensitive `RegExp` at module init
  (`utils.ts:5`), and matching tries them sequentially (longest-match is **not**
  guaranteed — `vmin` vs `vmax` vs `vb` ordering is alphabetic from the const
  array, which is a correctness smell as well as a perf one).
- **Gap vs SOTA:** the right shape is the one parse-that already uses in its own
  CSS scanner — a single combined unit regex (`scan.ts:73` `cssUnitRe`) read
  once, then a `Set`/`Map` classification to assign superType. That is exactly
  the §1.3 transposition already applied to color *names*; it has not been
  applied to *units*. One regex test replaces up to 43 sequential `RegExp.test`
  calls per dimension token.
- **Latent correctness note (isomorphism caveat):** sequential `istring`
  alternation can match a *prefix* unit before the longer one (e.g. `s` before
  `svw`, `vh` before `vmin` depending on array order). A single maximal-munch
  unit regex with explicit longest-first ordering is both faster *and* more
  correct. Flag as a behavior-fix-that-is-also-a-perf-win.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 2.3 · Substring materialization where spans are free
- **Where:** `leaf.ts:213` `regex` calls `state.src.substring(start, end)` to
  produce the matched string; every `.map(Number)` (`utils.ts:14,16`),
  `istring`, and ident match allocates a substring that is immediately consumed
  (parsed to a number, lowercased, or `Set`-looked-up) and discarded.
- **Gap:** parse-that exposes `regexSpan`/`stringSpan`/`manySpan` (`span.ts`,
  `index.d.ts:8`) that carry `{start,end}` offsets and defer/avoid the substring.
  For the common case — `utils.number` (parse to `Number`), unit classification
  (`Set.has` on a slice), keyword match (compare without materializing) — value.js
  could read directly off `state.src` via charCode scanning or span-aware leaves
  and skip the allocation entirely. The Rust side already does this
  (`number_span_fast`, Eisel-Lemire); the TS side has the primitives but the
  value.js grammar doesn't use them.
- **Perf rationale:** for `canada.json`-class inputs (the parse-that benches show
  99%-number payloads), substring + `Number()` per token dominates. For CSS the
  analogue is large keyframe sheets and `tailwind-output.css`-scale stylesheets.
- **Isomorphism:** identical outputs (numbers/classifications are value-equal);
  only intermediate string garbage is removed.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

---

## 3. The per-frame hot path makes parse *speed* a runtime concern, not just compile-time

- **Where:** `value.js/src/units/normalize.ts:145,170` — `getComputedValue`
  calls `parseCSSValueUnit(computed)` (for `var`) and `parseCSSValue(computed)`
  (for `calc`, after writing the expression to the element and reading back
  `getComputedStyle`). `getComputedValue` is itself memoized (`normalize.ts:136`),
  but its cache key is `(ValueUnit, target)` and the *computed string changes
  every frame* for an animating `calc()`/`var()` (e.g. `calc(100cqw - 100%)` whose
  resolved px differs each tick). So the inner `parseCSSValue(computed)` re-parses
  a fresh string per frame → its own memo also churns.
- **Consequence:** the §2 dispatch/span/fast-path wins are not merely build-time
  ergonomics — they cut per-frame allocation and branch cost for every animation
  that touches a computed unit. keyframes.js's documented pipeline
  (`lerpValue → lerpComputedValue → getComputedValue → parse`) routes through here.
- **SOTA shape:** two complementary moves —
  (a) a **numeric fast-path** in `parseCSSValueUnit`: a hand-written charCode scan
  for the overwhelmingly common `<number><unit>` / bare-`<number>` / `<n>px` shape
  that `getComputedStyle` returns, bypassing the full `any()` value grammar
  entirely (the matrix/`calc` cases stay on the slow path). This mirrors
  lightningcss's "specific value type per property" and csstree's tokenizer
  fast-lane.
  (b) optionally, resolve the computed-unit numeric *without* a string round-trip
  where the math AST is already known (see §5.4 calc caching).
- **Isomorphism:** the fast-path must produce a `ValueUnit` byte-identical to the
  grammar's output for the shapes it claims; everything else falls through. This
  is the one finding where a regression would be visible *in pixels*, so the
  handoff should require a round-trip equivalence gate (parse via fast-path vs
  grammar, assert deep-equal) before it lands.
- **Disposition: FOLD-VALUEJS-HANDOFF.** (Cross-ref keyframes.js FOLD-E: the
  engine could also memoize the *resolved px per (expr, layout-epoch)* so the
  parser isn't re-entered while layout is stable — tagged below for the value.js
  hand-off since the parse round-trip lives in value.js.)

---

## 4. Double-parse and re-tokenization waste in the stylesheet path

### 4.1 · Every declaration value is parsed by the full value grammar, then string-fallback
- **Where:** `stylesheet.ts:212` `parseDeclarationValue` runs
  `CSSValues.Values` over the whole value text; on failure (or empty array) it
  *re-wraps* the raw text as a single string `ValueUnit`. For values the value
  grammar can't model (e.g. `font-family: Arial, sans-serif`, grid templates,
  `cubic-bezier(...)` mixed with keywords) this is a full speculative parse that
  is thrown away. `balancedText` already walked the value once to find its
  bounds; the value grammar walks it again.
- **Gap:** SOTA CSS parsers tokenize once and keep the token stream; the AST
  builder consumes tokens, it does not re-scan source. value.js scans the value
  span (`declarationValueText`), then re-parses the materialized substring from
  scratch with a different parser. parse-that's own `parsers/css/value.ts`
  (`parseSingleValue` + `parseFunctionArgs`) is a single-pass char-dispatched
  value reader that produces a typed `CssValue` without the speculative double
  pass — value.js could adopt that shape (or the Rust one) for declaration
  values.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 4.2 · `stripCSSComments` is a whole-input regex pre-pass
- **Where:** `stylesheet.ts:87,516` — `parseCSSStylesheet` does
  `input.replace(/\/\*[\s\S]*?\*\//g, "")` over the *entire* stylesheet before
  parsing, allocating a second full copy of the source and destroying offset
  fidelity (so error spans point at post-strip offsets, not the user's source).
- **Gap:** parse-that ships comment-aware scanning inline (`scan.ts:34`
  `skipWsAndComments`, Rust `ws_comment.rs`). Comments should be skipped *during*
  whitespace consumption, not pre-stripped. This removes the full-copy alloc and
  preserves source offsets for diagnostics (the engine's furthest-offset error
  machinery is otherwise undermined for any sheet with comments).
- **Isomorphism:** identical AST; *better* diagnostics (offsets stay true).
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 4.3 · Three near-duplicate hand-rolled balanced splitters
- **Where:** `stylesheet.ts:99 balancedText`, `stylesheet.ts:411
  splitSelectorList`, `animation-shorthand.ts:11 tokeniseShorthand` +
  `:210 splitTopLevelCommas` — four separate string-walk loops that each
  re-implement "scan respecting `()[]{}` depth and `'"` strings."
- **Gap:** parse-that exports `splitBalanced` / `containsDelimiter`
  (`index.d.ts:9`, Rust `split.rs` with a `memchr` fast-path guard). One shared
  primitive replaces four bespoke loops — less surface to drift, and the
  `containsDelimiter` guard short-circuits the common no-delimiter case.
- **Disposition: FOLD-VALUEJS-HANDOFF.** (Elegance/KISS more than raw perf, but
  the `containsDelimiter` fast-path is a real win on comma-free values.)

---

## 5. Spec-coverage gaps — modern CSS the parser does not (fully) model

### 5.1 · `linear()` easing (Easing L2) — runtime exists, parser does not  [HIGH VALUE]
- **Where:** `easing.ts:33` `cssLinear(stops)` fully implements the Easing L2
  piecewise-linear evaluator (input-position resolution, flat segments,
  monotonicity, binary-search sampling). But **no parser produces those stops**:
  grep shows `linear(` is only ever matched by the generic `handleFunc()`
  (`index.ts:230`), which yields a flat `FunctionValue("linear", [v0, v1, …])`
  with no notion of stop *input percentages* or flat `0.5 25% 75%` segments. So
  `linear(0, 0.5 25% 75%, 1)` parses but loses its structure; the evaluator can
  never be fed correctly from a parsed value.
- **Spec/guide:** modern-web-guidance `physics-based-easing` — "**Baseline since
  2023-12-11**" (Chrome/Edge 113, Firefox 112, Safari 17.2). `linear()` is *the*
  modern primitive for spring/bounce easing and the guidance treats it as the
  recommended path.
- **SOTA gap:** a dedicated `linear()` parser producing `LinearStop[]`
  (output + optional input %, supporting the two-position flat-segment form),
  wired so `parseCSSValue("linear(…)")` → structured stops → `cssLinear`. This is
  the cleanest, highest-leverage spec win in the lane: the math is *already
  written*, only the parse bridge is missing.
- **Isomorphism:** additive — currently-degenerate `linear()` values become
  correctly structured; nothing regresses.
- **Disposition: FOLD-VALUEJS-HANDOFF** (and a paired keyframes.js FOLD-E to
  consume structured stops in the timing-function dispatch).

### 5.2 · `steps()` has no dedicated parser either
- **Where:** `easing.ts:293` `steppedEase(steps, jumpTerm)` + the `jumpTerms`
  union exist; `animation-shorthand.ts:73` recognizes `steps` as a timing *token*
  but does not parse its `(n, jump-*)` arguments into structure. In
  `parseCSSValue`, `steps(4, jump-end)` falls to generic `handleFunc`.
- **Gap:** a `steps()` parser → `{ count, jumpTerm }` feeding `steppedEase`.
  Small, mirrors §5.1.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 5.3 · `env()` is in the grammar spec but not in the runtime parser
- **Where:** `grammars/css-values.bbnf:82` defines `envFn`, but `index.ts`'s
  `Function_` has no `env()` branch — it would fall to generic `handleFunc`,
  losing the fallback-value semantics that `var()` gets via `handleVar`
  (`index.ts:26`). The BBNF grammar and the runtime have drifted.
- **Gap:** treat `env()` like `var()` (ident + optional fallback, nested-paren
  aware). Low effort, closes a grammar/runtime drift.
- **Disposition: FOLD-VALUEJS-HANDOFF.**

### 5.4 · CSS Values L4/L5 math additions absent
- **Where:** `math.ts:200` `allMathFunctions`.
- **Gaps vs current drafts (W3C css-values-4 / css-values-5, 2025):**
  - `calc-size()` (L4, interpolating to/from intrinsic sizes) — not parsed.
  - Tree-counting `sibling-index()` / `sibling-count()` (L5 WD) and `random()`
    (L5) — not parsed. These are *emerging*, not Baseline; flag as BOOK/GAP, not
    urgent — but they're the leading edge of "math in values."
  - **`progress()`** and **`media-progress()`/`container-progress()`** (L5) — the
    canonical primitives for the scroll/animation-driven interpolation this whole
    stack is about. Worth a BOOK entry given the project's animation focus.
- **Perf/elegance angle (a real near-term win):** `evaluateMathFunction`
  (`math.ts:473`) re-walks the AST twice — once to fold to a number
  (`evaluateMathFunctionInternal`) and once to infer the result unit
  (`inferResultUnit`, `math.ts:488`). A single annotated fold that carries
  `{value, unit, superType}` through the recursion removes the second traversal
  and the unit-inference heuristic ("first unit-bearing leaf wins") that is
  *incorrect* for mixed-type calc (e.g. `calc(100% / 2)` → unitless, `calc(10px *
  2)` → px). CSS Values L4 defines real dimensional type algebra; the current
  first-leaf heuristic is a workaround. Folding type *with* value is both faster
  and more correct.
- **Disposition:** `calc-size`/`progress`/L5 math → **GAP-NAMED / BOOK**; the
  two-pass-eval + dimensional-type fold → **FOLD-VALUEJS-HANDOFF**.

### 5.5 · `var()` is captured as an opaque string, not a structured node
- **Where:** `index.ts:26-48` `handleVar` flattens `var(--x, fallback)` to a
  single `ValueUnit(rawString, "var")`. The fallback and the custom-property name
  are not separated into structure; downstream (`normalize.ts:141`)
  re-`getComputedStyle`s and re-parses.
- **Gap:** SOTA parsers keep `var()` as `{ name, fallback }`. Structured capture
  would let the fallback be parsed once and let consumers resolve without a
  string round-trip. Modest; mostly elegance + enables §3(b).
- **Disposition: FOLD-VALUEJS-HANDOFF.**

---

## 6. The Rust → WASM path — the deepest architectural option

- **What exists (verified):** `parse-that/rust/` is a full Cargo workspace
  (`rust/CLAUDE.md`) containing
  - `SpanParser` — enum-dispatched, **vtable-free** parser tier with zero-copy
    `Span<'a>` borrowing source, `Cow<'a,str>` for decoded strings;
  - a bespoke `bbnf-regex` HIR→NFA→DFA engine with generated DFA tables
    (`regex/generated.rs`) and a global `Arc<Regex>` cache;
  - Eisel-Lemire f64 fast-path (`scan/number_f64.rs`, `eisel_lemire/`) and
    `memchr2` SIMD string scanning;
  - **a CSS L1.75 typed-AST parser** (`parsers/css/{types,scan,value,selector,
    declaration,media,specificity}.rs`) already benchmarked against
    `lightningcss` and `cssparser` (`benches/competitors/`), over
    `normalize.css` / `bootstrap.css` / `tailwind-output.css`.
- **What's missing:** **no `wasm-bindgen` / `cdylib` target** — grep for
  `wasm`/`cdylib` across the Rust workspace returns nothing; the only crate-types
  are the default workspace bins/libs. So the WASM path is *unbuilt scaffolding
  that is 90% there.*
- **The opportunity:** value.js's parse surface
  (`parseCSSValue`/`parseCSSColor`/`parseCSSStylesheet`) could become a thin TS
  facade over a WASM build of the Rust CSS parser, with the current
  combinator-TS path retained as the pure-JS fallback (feature-detect / lazy
  import, exactly as `formatCSS` lazy-loads Prettier today). The Rust CSS parser
  already produces a typed AST; the bridge is `ValueUnit`/`FunctionValue`
  construction at the WASM boundary.
- **Honest cost/benefit:**
  - WASM call-boundary overhead (string in, struct out) means it pays off for
    *large* inputs (full stylesheets, big keyframe blocks) and **loses** for
    single short values on the per-frame hot path (§3) — there the JS numeric
    fast-path (§3a) is the right tool. So this is a **two-tier** recommendation,
    not a wholesale replacement: WASM for `parseCSSStylesheet`-scale work, JS
    fast-path for per-token runtime parsing.
  - Maintaining a second parser implementation is real cost; the mitigant is
    that the Rust one *already exists and is tested* — this is "ship what's
    built," not "build a new thing."
- **SOTA framing:** this is precisely how lightningcss/Servo win — a Rust core
  with the heavy grammar, exposed to JS. value.js is one `wasm-bindgen` shim away
  from the same architecture, for the stylesheet tier.
- **Disposition: GAP-NAMED** (named, scoped, costed) + **FOLD-VALUEJS-HANDOFF**
  for the bridge design. Not a Tranche-E directive; a value.js-owner decision
  with a clear ROI boundary (stylesheet-scale yes, per-token no).

---

## 7. Packrat / memoization scoping

- **Where:** parse-that's `.memoize()` (`parser.ts:83`) is a real packrat with a
  numeric memo key and left-recursion guard, but value.js calls it **nowhere**
  (grep `.memoize()` in `value.js/src` → 0 hits; the only "memoize" is the
  *result*-cache `utils.memoize`). The global `MEMO`/`LEFT_RECURSION_COUNTS` maps
  are cleared per top-level `parseState` (`parser.ts:41-45`).
- **Assessment (honest):** for value.js's grammar, full packrat is likely **not**
  worth it — CSS value grammars are mostly LL(1)-ish once first-char dispatch
  (§2.1) removes the speculative `any()` retries, and packrat's per-parser clone
  cost (`parser.ts:110` `state.clone()`) can exceed the re-parse it saves for
  shallow grammars. The right move is §2.1 dispatch (which removes the
  backtracking that would motivate packrat) **rather than** bolting on
  `.memoize()`. Flag explicitly so a future pass doesn't reach for packrat as a
  first resort.
- **One genuine packrat candidate:** the relative-color `componentExpr` calc
  re-parse (`color.ts:104-133` builds a fresh `createCalcParser` lazily and
  `tryParse`s a substituted string) — but that's better solved by §5.5 structured
  capture than by memoization.
- **Disposition:** mostly **ALREADY-SOTA / NO-OP** (don't add packrat); the
  relative-color re-parse → **FOLD-VALUEJS-HANDOFF** via structured capture.

---

## 8. Smaller correctness/quality notes (parse-time)

- **8.1 · `Slash` as a `ValueUnit("/","string")` in the value stream**
  (`units.ts:74`) is a tokenization smell — the slash is a *separator* (alpha in
  colors, ratio in `aspect-ratio`, position in shorthands), not a value. SOTA
  parsers emit a delimiter token. Minor; structural cleanliness.
  **FOLD-VALUEJS-HANDOFF.**
- **8.2 · `fail()` ignores its message** (`utils.ts:26-30` — takes `message` but
  calls `state.err(undefined, 0)` without it), so `nameParser`'s
  `utils.fail("Invalid color name: …")` (`color.ts:551`) produces no diagnostic.
  The engine *has* a furthest-offset/expected-set error system
  (`mergeErrorState`, `parser.ts`); `fail` should feed it. Diagnostics quality.
  **FOLD-VALUEJS-HANDOFF.**
- **8.3 · `CSSJSON` in the value grammar** (`index.ts:243`, `{ … }` →
  `JSON.parse`) is a non-CSS extension living in the CSS value parser; it widens
  the `any()` for every value parse for a niche feature. Consider gating it out of
  the default `Value` path. Elegance/KISS. **FOLD-VALUEJS-HANDOFF.**
- **8.4 · Gradient parser is partial** (`index.ts:125` only models
  linear/radial/conic *names* but the body parser is the linear shape; radial/
  conic geometry — `circle at center`, size keywords, `from <angle> at <pos>` —
  isn't fully modeled). Spec-completeness gap, not perf. **GAP-NAMED.**

---

## 9. Disposition summary

| # | Finding | Disposition |
|---|---|---|
| 1.1–1.5 | Engine speed, result-memo, Color L4/L5, math L4, at-rule dispatch | **ALREADY-SOTA** |
| 2.1 | `any()` → `dispatch()` (O(1) first-char) across value/color/function/math | **FOLD-VALUEJS-HANDOFF** |
| 2.2 | Per-dimension `any(istring)` → single unit regex + Set (perf + longest-match correctness) | **FOLD-VALUEJS-HANDOFF** |
| 2.3 | Substring materialization → span/charCode leaves | **FOLD-VALUEJS-HANDOFF** |
| 3 | Per-frame computed-unit re-parse → numeric fast-path in `parseCSSValueUnit` | **FOLD-VALUEJS-HANDOFF** (+ keyframes.js FOLD-E) |
| 4.1 | Declaration double-parse (grammar then string-fallback) → single-pass value reader | **FOLD-VALUEJS-HANDOFF** |
| 4.2 | `stripCSSComments` full-copy pre-pass → inline comment-skip | **FOLD-VALUEJS-HANDOFF** |
| 4.3 | 4 bespoke balanced splitters → shared `splitBalanced`/`containsDelimiter` | **FOLD-VALUEJS-HANDOFF** |
| 5.1 | `linear()` easing parser (evaluator already exists) — Baseline 2023 | **FOLD-VALUEJS-HANDOFF** (high value) |
| 5.2 | `steps()` argument parser | **FOLD-VALUEJS-HANDOFF** |
| 5.3 | `env()` runtime parser (grammar/runtime drift) | **FOLD-VALUEJS-HANDOFF** |
| 5.4 | calc two-pass eval + dimensional-type fold | **FOLD-VALUEJS-HANDOFF**; `calc-size`/`progress`/L5 math | **GAP-NAMED / BOOK** |
| 5.5 | `var()` structured capture | **FOLD-VALUEJS-HANDOFF** |
| 6 | Rust→WASM stylesheet-tier path (scaffolding 90% built, no `wasm-bindgen`) | **GAP-NAMED** + handoff for bridge |
| 7 | Do NOT add packrat; dispatch (§2.1) obviates it | **ALREADY-SOTA / NO-OP** |
| 8.1–8.4 | Slash token, `fail()` message, CSSJSON gating, gradient geometry | **FOLD-VALUEJS-HANDOFF** (8.4 GAP-NAMED) |

---

## 10. FOLD-VALUEJS-HANDOFF — proposed value.js tranche shape

A coherent "value.js parse-perf + spec" tranche the value.js owner can formalize,
ordered by leverage:

1. **W1 — first-char dispatch tier.** Replace the speculative `any()` fronts in
   `CSSColor.Value`, the top-level `Value`, `Function_`, and `allMathFunctions`
   with `dispatch(table)` (§2.1). Gate: parse-output deep-equal vs current on the
   full test corpus; bench the value/color hot loop (expect the biggest single
   win). Isomorphic.
2. **W2 — unit + number fast-path.** Single combined unit regex + Set
   classification (§2.2, fixes longest-match), and a charCode numeric fast-path in
   `parseCSSValueUnit` for the `getComputedStyle` shapes on the per-frame path
   (§3). Gate: round-trip equivalence (fast-path vs grammar) — this one can move
   pixels, so the gate is mandatory.
3. **W3 — easing parsers.** `linear()` → `LinearStop[]` feeding the existing
   `cssLinear`; `steps()` → `steppedEase` args (§5.1, §5.2). Additive, Baseline.
4. **W4 — stylesheet single-pass.** Inline comment-skip (§4.2, restores
   diagnostic offsets), shared `splitBalanced` (§4.3), drop the declaration
   double-parse (§4.1).
5. **W5 — math fold + `env()` + `var()` structure.** Single annotated calc fold
   with real dimensional types (§5.4), `env()` parser (§5.3), structured `var()`
   capture (§5.5).
6. **W6 (decision gate, not a directive) — WASM stylesheet tier.** `wasm-bindgen`
   shim over the existing Rust CSS parser as a lazy-loaded fast tier for
   `parseCSSStylesheet`-scale inputs, JS fallback retained (§6). Costed: yes for
   stylesheet-scale, no for per-token runtime.

Every item above is parse-time, isomorphic unless flagged, and grounded at the
file:line / spec-cite given in the body.
