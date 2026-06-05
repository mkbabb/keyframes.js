# SOTA Audit — value.js CSS Parser (parse-that combinators + CSS grammar)

**Lane:** A — value.js parser. **Scope:** `value.js/src/parsing/*` + the
`@mkbabb/parse-that` combinator engine it stands on. **Disposition policy
(inv-16):** value.js is dirty + active — every finding here is a
**FOLD-VALUEJS-HANDOFF** (a value.js tranche the value.js owner formalizes) or
**ALREADY-SOTA**. Nothing in this lane is written directly.

**Repos read (file:line grounded):**
- `value.js/src/parsing/{utils,units,color,math,index,stylesheet,extract,animation-shorthand}.ts`
- `value.js/src/parsing/grammars/{css-values,css-color}.bbnf`
- `value.js/src/easing.ts` (the `linear()` evaluator)
- `parse-that/typescript/src/parse/{parser,state,leaf,lazy,utils}.ts` (the engine)
- `parse-that/typescript/src/parse/parsers/css/{index,value,scan,rule,selector,media}.ts`
  (parse-that's OWN scannerless CSS parser — exported as `cssParser`)

**Baseline / spec cites:** CSS Values L4, CSS Color L4 + L5, CSS Easing L2.
SOTA libs compared: lightningcss (Rust / Mozilla `cssparser`), csstree
(tokenizer + lexer), `@csstools`. modern-web-guidance corpus is UI-focused (no
parser guide); platform-feature baselines pulled via WebSearch and cited inline.

**Headline:** **MAJOR-OPPORTUNITY.** The CSS grammar coverage is genuinely
broad and largely up-to-spec (15 color spaces, relative color syntax, `color()`,
`color-mix()`, the full L4 math-function set, `@property`, keyframe composition).
But the parse **architecture** is one SOTA-generation behind, and — the sharp
finding — **parse-that already ships the SOTA architecture (`cssParser`: a
scannerless, charCode-driven, typed-value CSS parser) and value.js uses none of
it**, reimplementing CSS value parsing with the slower `any()`-combinator
backtracking layer. Plus two correctness/perf landmines in the engine hot path
(`console.error` on every parse failure; dead packrat machinery cleared per
parse) and a handful of genuine spec gaps (`linear()` has an evaluator but no
parser; no `light-dark()` / system colors / `currentColor` in the production
color parser despite the BBNF documenting them).

---

## A. Engine-level (parse-that) — parse-time performance

### A1. `console.error` fires on EVERY parse failure in the hot path — FOLD-VALUEJS-HANDOFF (HIGH)
- **file:line:** `parse-that/typescript/src/parse/parser.ts:59` and `:63` —
  `parseState()` calls `console.error(this.state.toString())` (and
  `state.toString()`) whenever `state.isError`.
- **SOTA gap:** This is a debug artifact left in the production parse entry. It
  is catastrophic for the value.js usage pattern, which is *built on expected
  failures*: `parseCSSColor` (`color.ts:613`) calls `parseResult(Value, input)`
  and on the (common, non-exceptional) fallback path re-runs `tryParse`; every
  `any(...)` alternation, every `.opt()`, every fallback branch that fails
  reaches `mergeErrorState`, and any top-level `parseState` that ends in error
  synchronously serializes the entire furthest-error state to a string
  (`statePrint`) and writes it to the console. `toString()` alone (building the
  caret/context render) is heavy; doing it on the parse hot path — and during
  speculative branch failures that are *part of normal parsing* — is a large,
  invisible tax. SOTA parsers (lightningcss, csstree) never log on failure;
  failure is data, returned to the caller.
- **perf/elegance rationale:** Removing the two `console.error` calls (gate them
  behind a `debug`/diagnostics flag — the module already has
  `isDiagnosticsEnabled()` in `utils.ts:14`) eliminates a string-materialization
  + I/O on every failed parse. For value.js's "try the rich parser, fall back to
  a string ValueUnit" pattern (`stylesheet.ts:221`, `index.ts:235`/`:251`
  `CSSString` fallthrough) this is on the *success* path of real stylesheets.
- **isomorphism note:** Pure observability change — zero behaviour/pixel impact;
  callers already inspect `state.isError`. Strictly removes side effects.

### A2. Packrat memo + left-recursion machinery is allocated and cleared per parse but never used — FOLD-VALUEJS-HANDOFF (MED)
- **file:line:** `parser.ts:19-20` (`MEMO`, `LEFT_RECURSION_COUNTS` module
  Maps), `:41-45` (`reset()` → `MEMO.clear(); LEFT_RECURSION_COUNTS.clear()`),
  invoked by `parseState()` at `:48`. The `.memoize()` / `.mergeMemos()`
  combinators (`:83-147`) that populate these are the *only* writers — and
  `grep` across `value.js/src` finds **zero** call sites (`.memoize()` is dead
  code; the CLAUDE.md "memoized via `utils.memoize()`" refers to the value.js
  result-cache `memoize`, a different mechanism at `value.js/src/utils.ts:108`).
- **SOTA gap:** Two global Maps are `.clear()`ed on every single `parseState`
  call to support a packrat path nothing takes. The intended SOTA win
  (linear-time packrat / Warth-style left-recursion) is unrealized; meanwhile the
  grammar has no left recursion (calc is expressed iteratively via `.many()` at
  `math.ts:74-95`), so packrat isn't even needed. This is carrying the *cost* of
  a packrat parser (the per-parse clear, the `getCijKey` bit-packing ceremony,
  the 2048-parser / 1M-char ID ceiling at `:24-25`) with **none of the benefit**.
- **perf/elegance rationale:** Either (a) delete the dead packrat surface
  entirely (smaller engine, no per-parse Map churn), or (b) actually wire
  `.memoize()` into the expensive shared sub-parsers (`CSSValueUnit.Value`,
  `CSSColor.Value`) so repeated speculative descent in `any(...)` is cached
  within a single parse. (a) is the KISS choice given no left recursion exists.
- **isomorphism note:** Removing unused code is byte-isomorphic. Wiring memo
  (option b) must be parity-tested — packrat changes furthest-error tracking,
  which feeds the error-context window (`utils.ts:41` `tryParse`).

### A3. `any()` is linear sequential trial; SOTA dispatch exists but is unused at value.js's hottest fork — FOLD-VALUEJS-HANDOFF (MED)
- **file:line:** `leaf.ts:28-49` (`any` = for-loop, try each, reset offset on
  fail) vs `leaf.ts:60-104` (`dispatch` = `Int8Array(128)` first-char table,
  O(1)). value.js's main color fork tries **14 parsers in sequence**
  (`color.ts:556` `Value = any(colorMix, colorFunction, hex, kelvin, rgbParser,
  hslParser, hsvParser, hwbParser, labParser, lchParser, oklabParser,
  oklchParser, xyzParser, nameParser)`); the top-level value fork
  (`units.ts:78` `Value = any(Length, Angle, Time, Frequency, Resolution, Flex,
  Percentage, Color, Slash, number, none)`) tries up to 11; `index.ts:251`
  `ValuesValue` chains 6 including the whole color subtree.
- **SOTA gap:** Every color parse that lands on `nameParser` (a bare keyword like
  `red`) first fails `colorMix`→`colorFunction`→`hex`→`kelvin`→ all five
  `relativeColorParser`-fronted space parsers, each of which itself runs an
  `any(relativeColorParser(...), colorOptionalAlpha(...))` and a nested
  `istring()` regex test. That's ~13 failed speculative descents (each touching
  `mergeErrorState`, see A1) before the keyword resolves. A first-char
  `dispatch` ('#'→hex, 'r'→{rgb…}, 'o'→{oklab,oklch}, 'c'→{color,color-mix},
  digit→kelvin, letter→name) collapses this to one table lookup + the right
  branch. lightningcss/csstree both dispatch on the first token, never linear
  trial-and-error.
- **perf/elegance rationale:** The biggest realistic value.js parse hot path is
  "parse this color / dimension token." Dispatch turns an O(branches) fork into
  O(1) and (combined with A1) erases the speculative-failure `mergeErrorState`
  storm. parse-that *already* ships `dispatch` — this is leverage of an existing,
  exported primitive, not new machinery.
- **isomorphism note:** Dispatch must preserve the current *priority order* where
  prefixes overlap (e.g. `srgb-linear` before `srgb` in `colorMixSpace`,
  `color.ts:391`; `oklab`/`oklch` share 'o'). Within a dispatch bucket the
  existing `any` ordering is retained, so it stays isomorphic. Needs a parity
  test over the full color/dimension corpus.

### A4. Mutable single-state combinator design — ALREADY-SOTA (note)
- **file:line:** `state.ts:21-117` (one mutable `ParserState`, offset rewind on
  backtrack), `parser.ts:149-495` (`then`/`or`/`wrap`/`many`/`sepBy` all mutate
  + restore `state.offset` rather than allocating new states), `leaf.ts:189-226`
  (`regex` uses sticky `y`-flag + `test()` zero-alloc path, `exec()` only when a
  match-fn needs the array), `leaf.ts:138-176` (`string` single-char
  `charCodeAt` fast path), `leaf.ts:235-254` (charCode whitespace skip with
  fast-exit), `state.ts:8-19` (zero-copy `Span` offsets).
- **assessment:** This is genuinely modern and well-tuned — the mutable-state +
  offset-rewind model is exactly how high-perf hand parsers avoid per-node
  allocation, and the regex/string/whitespace leaf paths are carefully zero-alloc.
  The `flags`-based `trim`/`eof` fast path (`parser.ts:501-544`) and inlined
  `wrap` (`:456-495`) are real optimizations. **Do not manufacture work here.**
  The ceiling on this design is A3/A1 (linear `any`, console side effects), not
  the state model.

---

## B. Architecture transposition — the headline

### B1. parse-that already ships a SOTA scannerless CSS parser; value.js uses NONE of it — FOLD-VALUEJS-HANDOFF (HIGH — strategic)
- **file:line:** `parse-that/typescript/src/parse/parsers/css/` is a complete,
  **publicly exported** (`cssParser`, re-exported through
  `parsers/index.ts:6` → engine barrel `index.ts:28` `export *`) charCode-driven
  CSS parser: `scan.ts` (charCode token scanners — `parseNumber`, `parseUnit`,
  `parseIdent`, `parseString`, `skipWsAndComments`, all `charCodeAt`-based),
  `value.ts` (`parseSingleValue` — branchless first-char dispatch:
  35='#'→hex, 34/39=string, 44=comma, 47='/'→slash, digit/`-`/`+`/`.`→number+unit,
  typed `CssValue`), `rule.ts`/`selector.ts`/`media.ts` (qualified rules,
  selectors with specificity, `@media`/`@supports` range syntax, `@keyframes`,
  `@font-face`, `@import`). This is the **same architecture as lightningcss
  (Mozilla `cssparser`) and csstree's tokenizer→parser** — scan once into typed
  tokens, dispatch on first char, no speculative combinator backtracking.
- **SOTA gap:** value.js's `src/parsing/` is a *parallel, independent*
  reimplementation of CSS parsing on top of the slower `any()`-combinator layer
  — confirmed by grep: **no** `value.js/src` file imports `parsers/css`,
  `cssParser`, `parseSingleValue`, or `scan`. value.js even hand-rolls the
  balanced-text scanning that `cssParser` already does internally
  (`stylesheet.ts:99-181` `balancedText`, `:411-454` `splitSelectorList`), and
  re-implements the declaration/at-rule/keyframe-selector grammar
  (`stylesheet.ts:237-510`) that `css/rule.ts` covers. Two CSS parsers in one
  dependency graph, the faster one dormant.
- **perf/elegance rationale:** This is the single biggest elegance + performance
  lever in the lane. The scannerless parser is structurally faster (one pass, no
  branch-failure storm, no `mergeErrorState` thrash) AND it deletes a large body
  of duplicated grammar from value.js. The transposition is *not* "rewrite the
  parser" — it's "value.js's `CSSValueUnit`/`CSSColor` value semantics layer over
  parse-that's `parseSingleValue` typed-token output instead of over raw
  combinators." The combinator parser stays available for the bespoke pieces
  (relative-color resolution, the `ValueUnit`/`Color` mapping, Kelvin).
- **isomorphism note:** HIGH-risk transposition — the two parsers will not be
  token-for-token identical at the edges (value.js's `CSSString` fallthrough at
  `index.ts:235`/`:251` accepts arbitrary non-delimiter tokens; `cssParser` is
  stricter). This is a value.js-owner-scoped tranche with a full parity corpus
  (every test in `value.js` + keyframes.js `editor-parsing`/`parsing`/`units`
  suites) as the gate. Sequence it AFTER A1/A3 (which are cheap, isomorphic wins
  that stand alone). Flag explicitly: this may be a multi-week value.js tranche,
  not a quick fold.

### B2. value.js's combinator grammar is broad and correct — ALREADY-SOTA (note)
- Setting the architecture aside, the *grammar coverage* is strong and modern:
  15 color spaces incl. `oklab`/`oklch`/`lab`/`lch`/`xyz` + extended-gamut
  `color()` spaces (`color.ts:478-525`); relative color syntax CSS L5
  (`color.ts:155-312`) with a real calc-evaluator (no `eval`/`new Function` —
  `color.ts:104-133`, invariant D6); `color-mix()` with hue-interpolation methods
  and percentage-complement logic per spec (`color.ts:424-474`); the complete L4
  math-function set incl. `round`/`mod`/`rem`/trig/exp/`hypot` + CSS constants
  `pi`/`e`/`infinity` with `.not(identContinuation)` boundary guards
  (`math.ts:191-223`); `@property` with `syntax`/`inherits`/`initial-value`
  (`stylesheet.ts:377-407`); keyframe `animation-composition` lift
  (`stylesheet.ts:300-336`) and scroll-driven named ranges
  (`entry`/`exit`/`cover`/`contain`, `stylesheet.ts:258-266`). This is
  meaningfully ahead of most JS animation libs. Credit it; don't churn it.

---

## C. Spec coverage gaps (CSS Values L4 / Color L4+L5 / Easing L2)

### C1. `linear()` easing: evaluator exists, PARSER does not — FOLD-VALUEJS-HANDOFF (MED)
- **file:line:** `value.js/src/easing.ts:38` exports `cssLinear(stops:
  LinearStop[])` — a correct piecewise-linear *evaluator* with gap-fill — but
  grep finds **no parser** that turns the CSS string `linear(0, 0.25 75%, 1)`
  into `LinearStop[]`. The only callers of `cssLinear`/`LinearStop` are the
  barrel re-exports (`index.ts:211`,`:213`). The keyframes.js consumer confirms
  the gap: its `CSS_FUNCTION_EASING` regex (`keyframes.js/src/animation/easing.ts:32`)
  recognizes only `cubic-bezier(`, `steps(`, `step-start/end` — **`linear()` is
  absent**, and `CSS_NATIVE_KEYWORD` (`:30`) matches only the bare `linear`
  *keyword*, not the function.
- **SOTA gap:** CSS Easing L2 `linear()` is Baseline-shipping (Chrome 113+,
  Firefox 112+, Safari 17.4+ — per WebSearch, css-easing-2 / MDN). It is *the*
  modern primitive for spring/arbitrary curves and value.js can already
  *evaluate* it — it just can't *read* it from a stylesheet. An author who writes
  `animation-timing-function: linear(0, 0.5 25%, 1)` in `@keyframes` gets no
  curve. The parse side: `linear( <number> <percentage>{0,2} (',' …)* )` with
  the stop-list grammar from the spec parsing algorithm.
- **perf/elegance rationale:** Small, self-contained parser (a `sepBy` of
  `number` + optional 1–2 percentages) feeding the existing `cssLinear`. Closes
  a real authoring gap with high leverage / low surface.
- **isomorphism note:** Purely additive — no existing input changes meaning. The
  keyframes.js-side wiring (registering the parsed stops as a `TimingFunction`)
  is a FOLD-E concern (see Handoff list); the *parser* is the value.js piece.

### C2. `light-dark()`, system colors, `currentColor` — documented in BBNF, absent from the production color parser — FOLD-VALUEJS-HANDOFF (MED)
- **file:line:** `grammars/css-color.bbnf` documents `lightDark` (`:line` "—
  light-dark()"), `systemColor` (the 19-name L4 set), `colorContrast`, and
  `namedColor` — but the production parser `color.ts:556` `Value` includes
  **none** of: `light-dark()`, `color-contrast()`/`contrast-color()`, the
  `systemColor` keyword set (`Canvas`, `CanvasText`, `AccentColor`, …), or
  `currentColor`. grep for `light-dark|lightDark|color-contrast|systemColor|
  currentColor` in `color.ts` returns empty. The BBNF header even says
  "Hand-written combinators in color.ts remain the production parsers" — i.e. the
  BBNF is aspirational doc, and the combinator parser hasn't caught up.
- **SOTA gap:** `light-dark()` is Baseline 2024 (Chrome/Edge 123, Firefox 120,
  Safari 17.5 — WebSearch / css-color-5). `currentColor` is universally
  supported and extremely common in real CSS — its absence means any keyframe
  animating *to/from* `currentColor` falls through to the `CSSString`
  pass-through (`index.ts:235`) as an opaque string, silently un-interpolable.
  System colors are L4 Baseline. `contrast-color()` (renamed from
  `color-contrast()`) is newer (Safari/Firefox only as of 2026 — WebSearch),
  reasonably BOOKed, but `light-dark()` and `currentColor` are real gaps.
- **perf/elegance rationale:** `currentColor` and `light-dark()` are the
  highest-value adds. `light-dark()` resolves with a scheme flag (mirror the
  existing `color-mix` resolution shape, `color.ts:424`); `currentColor` parses
  to a sentinel `ValueUnit` the DOM-resolution layer fills from
  `getComputedStyle().color` (the computed-value pipeline already exists per the
  MEMORY.md `getComputedValue` flow).
- **isomorphism note:** Additive for `light-dark`/system colors. `currentColor`
  changes a token that *currently* falls through to an opaque string — so adding
  it makes a previously un-interpolable value interpolable. Befitting (it's
  strictly more correct), but it is a behaviour change at that one token — flag
  it and parity-test the `CSSString` fallthrough corpus.

### C3. No `env()` / `attr()` (typed) / `image-set()` / intrinsic sizing keywords — BOOK (LOW)
- **file:line:** `index.ts` handles `var()` (`:26-48`), the transform family,
  gradients, `cubic-bezier`, generic `function()`, and the math set — but grep
  finds no `env(`, no typed `attr()` (CSS Values L5), no `image-set()`, no
  `min-content`/`max-content`/`fit-content()`. `var()` itself is handled as an
  opaque-string passthrough (`handleVar`, `:26`) which is correct for an
  animation lib (resolution is the renderer's job).
- **SOTA gap:** Minor. `env()` (Baseline) would be the most justifiable add for a
  layout-aware animation lib; the rest are rarely animated. Honest call: these
  are **BOOK**, not gaps to fold now — animating `attr()`/`image-set()` is exotic.
- **isomorphism note:** Additive if/when taken.

### C4. `var()` nested-paren handling is a hand-rolled recursive regex combinator — FOLD-VALUEJS-HANDOFF (LOW)
- **file:line:** `index.ts:26-48` `handleVar` — `varContent` recurses via
  `Parser.lazy` over `any(regex(/[^()]+/), nested.many(1).wrap(lparen,rparen))`
  to balance parens inside `var(--x, calc(...))`, then re-`.join("")`s the parts
  back into a string.
- **SOTA gap:** This duplicates the balanced-scan logic that exists twice
  elsewhere (`stylesheet.ts:99` `balancedText`, and parse-that's
  `split.ts` `splitBalanced` / `css/scan.ts`). It's correct but it's a
  third copy of "balance parens" and the `.many(1).wrap(...).flat(Infinity)`
  string round-trip is allocation-heavy for a hot construct.
- **perf/elegance rationale:** Replace with the engine's `splitBalanced` /
  `containsDelimiter` (exported, `index.ts:` engine barrel) or a single
  charCode scan. Consolidates three balanced-scanners into one.
- **isomorphism note:** Must preserve the exact captured-string shape `var()`
  produces today (it feeds `ValueUnit(value, "var")` and is re-serialized
  verbatim). Parity-test on nested `var(--a, var(--b, calc(1px + 2px)))`.

### C5. `CSSString` catch-all masks invalid CSS / arbitrary-token acceptance — FOLD-VALUEJS-HANDOFF (LOW, correctness)
- **file:line:** `index.ts:222` `CSSString = regex(/[^\(\)\{\}\s,;]+/)` →
  `ValueUnit(x)`, used as the **last** branch of both `Value` (`:235`) and
  `ValuesValue` (`:251`). Because `any()` is total once this branch is present,
  *any* non-delimiter run parses successfully as a string ValueUnit — invalid
  dimensions (`10pxx`), typos (`rbg(...)`), and malformed functions degrade
  silently instead of failing.
- **SOTA gap:** lightningcss/csstree *validate* against the property grammar and
  surface errors; value.js's "accept anything as a string" is lenient by design
  (good for an animation lib that must not crash on author input) but it means
  the parser cannot *report* a bad value — it just produces an opaque token. The
  diagnostics surface (`enableDiagnostics`, `utils.ts:6`) exists in the engine
  but the `CSSString` fallthrough preempts it.
- **perf/elegance rationale / disposition:** This is a *deliberate* leniency, so
  the handoff is "make the fallthrough *observable*" — emit a diagnostic (or set
  a flag on the ValueUnit) when the catch-all fires, so consumers like the demo's
  error toasts (referenced in `utils.ts:38`) can warn without the parser
  hard-failing. Keep the leniency; add the signal.
- **isomorphism note:** Behaviour-preserving if the diagnostic is opt-in
  (gated by `isDiagnosticsEnabled()`); no token changes meaning.

---

## D. Memoization / cache layer (value.js result cache)

### D1. Result-cache `keyFn: identity` is correct and SOTA for single-string parsers — ALREADY-SOTA (note)
- **file:line:** `value.js/src/utils.ts:108` `memoize` (Map + TTL + maxCacheSize
  LRU-by-insertion eviction `:141-143`); every public parser overrides the
  default `JSON.stringify` keyFn with identity (`units.ts:114-118`,
  `index.ts:262-291`, `color.ts:613-630`, `stylesheet.ts:514-519`) — the
  E.W1 transposition that avoids synthesizing a quoted copy of the input on every
  call. The cache-invalidation contract on custom color names is correct
  (`color.ts:586-598` clears `parseCSSColor.cache`).
- **assessment:** This layer is well-designed and honestly documented. The
  shared-instance memo contract ("callers MUST NOT mutate") is a real footgun but
  it's documented at every entry. **ALREADY-SOTA — no action.**

### D2. TTL on a pure parser cache is dead config — FOLD-VALUEJS-HANDOFF (LOW)
- **file:line:** `utils.ts:108-152` — the `memoize` `ttl` + `timestamp` check
  (`:127-133`) runs on every cache hit. CSS parsing is a *pure function of the
  input string* — there is no time-varying correctness, so the TTL path is pure
  overhead (a `Date.now()`/`performance.now()` read + compare per hit) for the
  parser callers, which never pass a `ttl`.
- **perf/elegance rationale:** A parser-specific memo (or a `ttl: Infinity`
  fast-path that skips the timestamp read) shaves the clock read off every cache
  hit. Micro, but it's on the hottest path (cache hits dominate in a steady
  animation editor).
- **isomorphism note:** Parsers pass no TTL today, so behaviour is unchanged;
  this only removes a no-op branch for them.

---

## E. Comparison summary vs lightningcss / csstree (honest scorecard)

| Dimension | value.js parser | SOTA (lightningcss / csstree) | Verdict |
|---|---|---|---|
| Architecture | combinator backtracking (`any` linear trial) | scannerless / tokenizer-first, first-char dispatch | **behind** — but parse-that *ships* the SOTA one unused (B1) |
| Color L4/L5 coverage | 15 spaces, RCS, `color()`, `color-mix()` | full | **at parity** (B2) — missing `light-dark`/system/`currentColor` (C2) |
| Math L4 | full set + constants | full | **at parity** (B2) |
| Easing L2 `linear()` | evaluator only, no parser | full | **gap** (C1) |
| Error reporting | furthest-offset + context window, but `console.error` leak + lenient catch-all | typed errors, no logging, validation | **behind** (A1, C5) |
| Per-parse overhead | dead packrat clear, console I/O on fail | none | **fixable wins** (A1, A2) |
| Memo (result cache) | identity-keyed, invalidatable | n/a (Rust is fast enough raw) | **SOTA** (D1) |

---

## Disposition index

**FOLD-VALUEJS-HANDOFF (propose as value.js tranche, owner formalizes):**
- A1 — strip/gate `console.error` in `parser.ts:59,63` (HIGH, isomorphic, cheap)
- A3 — `dispatch` the color/value `any(...)` forks (`color.ts:556`,
  `units.ts:78`) (MED, isomorphic with priority-bucket care)
- A2 — delete dead packrat (`parser.ts:19-20,41-45,83-147`) OR wire `.memoize()`
  into shared sub-parsers (MED; prefer delete — no left recursion exists)
- B1 — **strategic:** adopt parse-that's exported `cssParser` scannerless parser;
  retire value.js's parallel grammar reimplementation (HIGH, multi-week,
  parity-gated — sequence after A1/A3)
- C1 — add a `linear()` *parser* feeding the existing `cssLinear` evaluator
  (`easing.ts:38`) (MED, additive)
- C2 — add `currentColor` + `light-dark()` (+ system colors) to `color.ts:556`
  `Value` (MED; `currentColor` is a befitting behaviour change at one token)
- C4 — consolidate `handleVar` balanced-scan onto engine `splitBalanced` (LOW)
- C5 — make the `CSSString` catch-all (`index.ts:222`) emit a diagnostic (LOW)
- D2 — TTL-free fast path for the pure parser memo (`utils.ts:127`) (LOW)

**BOOK:** C3 (`env()`/typed `attr()`/`image-set()`/intrinsic sizing keywords) —
exotic for an animation lib; `contrast-color()` (newer, limited baseline).

**ALREADY-SOTA (do not churn):** A4 (mutable-state engine + zero-alloc leaf
paths), B2 (broad correct grammar — 15 color spaces, RCS, math L4, `@property`,
scroll ranges, composition), D1 (identity-keyed invalidatable result cache).

---

## Cross-tranche handoff (for FOLD-E / other lanes — NOT this lane's writes)

These surfaced in value.js space but the *consumer* fix lives in keyframes.js
(FOLD-E), recorded so they aren't lost:

- **keyframes.js `linear()` wiring:** once value.js can parse `linear(...)`
  (C1), keyframes.js's `CSS_FUNCTION_EASING` (`src/animation/easing.ts:32`) and
  `cssTwinFor`/`getTimingFunction` path must register the parsed stops as a
  `TimingFunction` + a `linear()` CSS twin (it already *emits* spring `linear()`
  via `springLinearStops` for WAAPI — so the twin plumbing exists; only the
  *input* direction is missing). **FOLD-E.**
- **keyframes.js `currentColor` interpolation:** if C2 lands, the DOM-resolution
  layer (`getComputedValue` per MEMORY.md) must fill the `currentColor` sentinel
  from `getComputedStyle().color`. **FOLD-E.**

## Sources
- Lightning CSS — https://lightningcss.dev/ ; parcel-bundler/lightningcss (Mozilla `cssparser`/`selectors`)
- csstree — https://github.com/csstree/csstree (tokenizer + lexer, W3C-spec-based)
- CSS Color L5 — https://www.w3.org/TR/css-color-5/ ; `contrast-color()` MDN ; `light-dark()` baseline
- CSS Easing L2 — https://www.w3.org/TR/css-easing-2/ ; `linear()` MDN blog
- Parser combinator vs recursive descent perf — HN/Lobsters threads (cited inline)
