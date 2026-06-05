# SOTA Audit — CSS parsers vs. value.js architecture (lane r-css-parsers)

> Tranche E · forward-SOTA research, findings ONLY (no implementation).
> Scope: the **architecture** of value.js's CSS parser (`value.js/src/parsing/*`)
> and the `@mkbabb/parse-that` engine it rides, measured against the SOTA
> CSS-parsing field — lightningcss (Rust/`cssparser`/`selectors`), Servo/Stylo,
> csstree, `@csstools/css-parser-algorithms` + `@csstools/css-tokenizer`, PostCSS.
> inv-16: **every** value.js finding here is **FOLD-VALUEJS-HANDOFF** — a proposal
> the value.js owner formalizes into a value.js tranche. value.js is dirty +
> active; nothing here is a directive to edit it. Keyframes findings (none of
> substance arise in this architecture lane) would be FOLD-E.
>
> This lane is the dedicated **forward-SOTA parse-architecture** pass that failed
> on the first execution. It is deliberately scoped to *confirm + deepen* the
> two prior findings (`d-vj-parse`, `r-wasm-compile-perf`) against the actual
> SOTA-parser architecture literature, and to name the one structural gap they
> circled but did not center: **value.js has no tokenizer and re-scans source.**
> It does **not** re-derive every per-grammar finding in `d-vj-parse` (those
> stand); it sets them in the SOTA architectural frame and adds the parser-field
> citations + one new verified finding (the `console.error` top-level-fail leak
> on a *legitimate* path).

---

## 0. The SOTA reference architecture — what every fast CSS parser shares

Read across lightningcss, Servo `cssparser`, csstree, and `@csstools`, the field
has converged on one shape. All four implement **CSS Syntax Level 3** (W3C,
2021-12) and share these invariants:

1. **Tokenize once, parse over a *token stream*, never re-scan source.**
   csstree is explicit: "the parser… operates over tokens, not source string, as
   it would be a very inefficient operation… uses mostly `nextToken`/`back`"
   (csstree `docs/parsing.md`). CSS Syntax L3 §5: "The input to the parsing stage
   is a stream or list of tokens from the tokenization stage"
   ([w3.org/TR/css-syntax-3](https://www.w3.org/TR/css-syntax-3/)).
   `@csstools/css-parser-algorithms` "only accepts tokenized CSS and must be used
   together with `@csstools/css-tokenizer`"
   ([npmjs.com/@csstools/css-parser-algorithms](https://www.npmjs.com/package/@csstools/css-parser-algorithms)).
2. **Two-stage split is for *performance + complexity abstraction*** — csstree:
   "the main reasons to separate tokenization from parsing… are performance and
   abstracting complexity." Tokenization "never fails; output may contain error
   tokens" (Servo `cssparser`,
   [docs.rs/cssparser](https://docs.rs/cssparser/latest/cssparser/enum.Token.html)).
3. **Typed value per property, not an untyped token soup.** lightningcss "parses
   all values using the grammar from the CSS specification, and exposes a
   *specific value type for each property*… rather than treating values as an
   untyped series of tokens"
   ([github.com/parcel-bundler/lightningcss](https://github.com/parcel-bundler/lightningcss)).
4. **Zero-copy / borrow.** lightningcss uses `Cow` "to borrow from the original
   input string and avoid allocating/copying when possible." `cssparser` yields
   borrowed token slices.
5. **Forgiving error recovery, no throw.** csstree wraps bad content in a `Raw`
   node and invokes `onParseError`; `@csstools` "won't stop when a parse error is
   encountered… set a callback." Parse failure is a *value*, never a side effect.
6. **Dispatch on the first token before attempting a production.** This is
   structural in the L3 algorithm ("the *current input token*… the token… being
   operated on") and in every hand-written tokenizer's per-codepoint `switch`.

value.js inverts items **1, 4, 5, and 6** and is partially SOTA on **3**. That
inversion is the architectural gap this lane centers.

---

## 1. ALREADY-SOTA — do not manufacture work here

The combinator **engine** value.js rides is genuinely current; the SOTA gap is
in *how value.js's grammar uses it*, not the engine. Confirmed by reading
parse-that source (not just CLAUDE.md):

- **1.1 · Zero-alloc mutable-state machine.** `ParserState` mutates in place
  (`state.ts:24` ctor; `ok()` does `unsafeSetValue`, no per-step object;
  `string()`/`regex()` use `charCodeAt`/sticky-`test()` with no `RegExpMatchArray`
  on the default path — `leaf.ts:147,207`). `trimStateWhitespace` is a charCode
  loop with a `>32` fast-exit (`leaf.ts:235-254`). This is textbook for a JS
  PEG runtime. **ALREADY-SOTA.**
- **1.2 · The fast tier *exists and is publicly exported*.** parse-that exports
  `dispatch` (O(1) `Int8Array(128)` first-char LUT, `leaf.ts:60-104`,
  `index.ts:8`), the full span family (`regexSpan`/`stringSpan`/`manySpan`/
  `sepBySpan`/`wrapSpan`/`takeUntilAnySpan`/…, `index.ts:9`), and
  `splitBalanced`/`containsDelimiter` (`index.ts:10`). Packrat `.memoize()` with
  numeric `(id<<20)|offset` key + left-recursion guard (`parser.ts:83-119`).
  **The engine is SOTA-complete.** (The *gap* is §2: value.js imports none of it.)
- **1.3 · Result-level memoization with identity keyFn** — `parseCSSValue`/
  `parseCSSValueUnit`/`parseCSSColor`/`parseCSSTime` use `keyFn: (input)=>input`
  (`index.ts:266`, `units.ts:118`, `color.ts:630`), the E.W1 fix that dropped the
  `JSON.stringify` quoted-copy. Correct shape for single-string parsers.
  **ALREADY-SOTA.**
- **1.4 · parse-that *itself* already ships the SOTA shape it's missing in
  value.js.** `parsers/css/scan.ts` + `value.ts` are a hand-written,
  single-pass, **first-char-dispatched** CSS value reader
  (`parseSingleValue`: `ch===35`→hex, `34/39`→string, `44`→comma, digit/`+-.`→
  number→`%`/unit/operator, ident→function/keyword — `value.ts:11-87`), reading
  off `state.src.charCodeAt` with a single combined `cssUnitRe`
  (`scan.ts:73-75`) and `skipWsAndComments` inline comment-skip
  (`scan.ts:34-49`). **This is the exact architecture §2-§4 below recommend —
  it already exists in the dependency, hand-written, unused by value.js.** That
  reframes the whole handoff: it is "adopt the shape parse-that already proved,"
  not "invent a tokenizer." **ALREADY-SOTA (in parse-that); the gap is adoption.**

---

## 2. FLAGSHIP — value.js leaves the engine's entire fast tier on the table

### 2.1 · The grammar is built only from `any/all/regex/string` — `dispatch`, spans, and `splitBalanced` are imported nowhere
- **Where:** every parsing file imports the *same six* primitives —
  `import { Parser, all, any, regex, string, whitespace }` (`index.ts:1`,
  `units.ts:1`, `color.ts:22`, `math.ts`, `stylesheet.ts`). Grep across
  `value.js/src` for `dispatch`/`Span`/`splitBalanced`/`.memoize()` in the CSS
  grammar → **zero** hits (the only "dispatch" is the unrelated *color-space*
  conversion table in `units/color/dispatch.ts`). **65** `any(...)` call sites
  in `src/parsing/*` (index 17, color 20, units 11, math 9, stylesheet 8).
- **Gap (the SOTA inversion):** SOTA parsers dispatch on the first token *before*
  attempting a production (§0.6). value.js does the opposite — sequential trial:
  a `12px` length re-enters `utils.number` up to **7×** (`Length`,`Angle`,`Time`,
  `Frequency`,`Resolution`,`Flex`,`Percentage` each open `all(utils.number,…)`,
  `units.ts:32-70`); a `#fff` hex tries `colorMix`→`colorFunction` (two failed
  `istring`s) before reaching `#` (`color.ts` `Value` chain). The top-level
  `Value = any(CSSWideKeyword, CSSValueUnit.Value, Function_, CSSString)`
  (`index.ts:235`) and `Function_ = any(handleTransform, handleVar, MathFunction,
  handleGradient, handleCubicBezier, handleFunc)` (`index.ts:224`) are
  perfectly first-char-dispatchable.
- **SOTA shape:** the dispatch table parse-that already provides — exactly the
  `parseSingleValue` switch (§1.4) — collapses the `any()` chains to one LUT read
  + one branch. `#`→hex, `0-9 . + -`→number-prefixed dimension/percentage,
  `r/h/l/o/x/c`→the matching color function, default ident→function/keyword/name.
- **Perf/elegance rationale:** this is the single biggest *structural* win and it
  compounds on the per-frame computed-unit path (§3). It is the move lightningcss
  and csstree make by construction.
- **Disposition: FOLD-VALUEJS-HANDOFF.** (Confirms + sharpens `d-vj-parse §2.1`
  by grounding it in the SOTA-parser dispatch invariant and the fact that the
  table already exists in parse-that.)
- **Isomorphism:** pixel/byte-identical — `dispatch` selects the *same* parser
  `any` would have reached; only selection cost changes. Order-sensitive
  sub-branches (e.g. `alpha`-before-`a` in relative color, `infinity`/`-infinity`)
  stay inside their sub-parser.

### 2.2 · No tokenizer → source is re-scanned, substrings materialized per token
- **Where:** `leaf.ts:213` `regex` does `state.src.substring(start, end)` and
  every `utils.number` (`utils.ts:14,16`), `istring`, and ident match allocates a
  substring consumed-and-discarded (parsed to `Number`, lowercased, `Set`-looked
  up). The stylesheet path re-scans: `balancedText` walks a value to find bounds,
  then `CSSValues.Values` re-parses the materialized substring from scratch
  (`stylesheet.ts:212` — confirmed in `d-vj-parse §4.1`).
- **Gap (the SOTA inversion, item §0.1+§0.4):** SOTA parsers tokenize **once**
  and the AST builder consumes *tokens*, never re-scanning source; borrowed
  slices (`Cow`/span) avoid the copy. parse-that ships the span family and the
  `scan.ts` charCode scanners precisely for this — value.js's grammar uses neither.
- **Perf rationale:** for stylesheet-scale and large keyframe inputs, substring +
  `Number()` per token dominates; on the per-frame hot path (§3) it is per-tick
  garbage. The remedy is the span/charCode leaves and the single-pass reader that
  parse-that already hand-wrote.
- **Disposition: FOLD-VALUEJS-HANDOFF.** (Confirms `d-vj-parse §2.3`+`§4.1`;
  reframes as the *no-tokenizer* architectural root, not two separate findings.)
- **Isomorphism:** identical outputs; only intermediate string garbage removed.

### 2.3 · Per-dimension `any(...UNITS.map(istring))` rebuilds the unit alphabet, and is not maximal-munch
- **Where:** `units.ts:20-26` — `lengthUnit = any(...LENGTH_UNITS.map(istring))`
  + six siblings. Each `istring` allocates a fresh case-insensitive `RegExp` at
  init (`utils.ts:5-8`) and the alternation is tried **sequentially in array
  order**, so a prefix unit can match before a longer one (`vmin`/`vmax`/`vb`
  ordering, `s` vs `svw`). That is a **correctness smell**, not just perf.
- **SOTA shape:** parse-that's own scanner already does the right thing — one
  combined `cssUnitRe` (`scan.ts:73`) read once, then `Set`/`Map` classification.
  The same transposition `d-vj-parse §1.3` notes was already applied to color
  *names* (155-branch `any`→broad regex + `Set.has`) but **not** to *units*.
- **Disposition: FOLD-VALUEJS-HANDOFF** — a behavior-fix (longest-match) that is
  also a perf win. (Confirms `d-vj-parse §2.2`.)
- **Isomorphism:** outputs identical for well-formed input; *more correct* for
  ambiguous-prefix units (a deliberate, flagged behavior fix).

---

## 3. The per-frame computed-unit path makes parse *speed* a runtime concern
- **Where:** `value.js/src/units/normalize.ts` `getComputedValue` calls
  `parseCSSValueUnit(computed)` / `parseCSSValue(computed)` after writing a
  `calc()`/`var()` expression to the element and reading `getComputedStyle` back.
  The outer memo is keyed `(ValueUnit, target)` but the *computed string changes
  every frame* for an animating `calc(100cqw - 100%)` → the inner
  `parseCSSValue(computed)` re-parses a fresh string per tick and its own memo
  churns. keyframes.js's pipeline
  (`lerpValue → lerpComputedValue → getComputedValue → parse`) routes here.
- **Why it matters for *this* lane:** the §2 dispatch/span/single-pass wins are
  not merely build-time ergonomics — on this path they cut **per-frame**
  allocation and branch cost. This is where the no-tokenizer re-scan (§2.2) is
  most expensive.
- **SOTA shape:** lightningcss's "specific value type per property" and csstree's
  tokenizer fast-lane both have a fast path for the dominant
  `<number><unit>`/bare-`<number>` shape that `getComputedStyle` returns. value.js
  should add a charCode numeric fast-path in `parseCSSValueUnit` that bypasses the
  full `any()` value grammar for that shape (matrix/`calc` cases fall through).
- **Disposition: FOLD-VALUEJS-HANDOFF**, with a **mandatory round-trip
  equivalence gate** (fast-path output deep-equal to grammar output) — this is the
  one finding where a regression is visible *in pixels*. (Confirms `d-vj-parse §3`
  + `r-wasm-compile-perf F7`'s caution that runtime is otherwise SOTA.)
- **Isomorphism:** fast-path must be byte-identical for the shapes it claims;
  everything else falls through.

---

## 4. NEW (verified this lane) — `console.error` fires on a *legitimate* parse path
- **Where:** parse-that `parser.ts:59` **and** `:63` — `parseState()` calls
  `console.error(this.state.toString())` on **every** top-level parse failure.
  This ships in the published dist (`dist/parse.js:708,712`). `toString()` →
  `statePrint(...)` builds a full **ANSI error display** (furthest-offset window,
  expected-set) — a non-trivial allocation/format on the failure path.
- **The leak (this is the bug):** value.js's `parseCSSColor` (`color.ts:613-628`)
  runs `utils.parseResult(Value, input)` first; on `status === false` it falls
  back to the custom-color-name map (`registerColorNames`). `parseResult` →
  `parseState` → **`console.error` fires every time a registered custom color
  name is parsed** (the first attempt *must* fail for the fallback to run). So a
  perfectly valid, documented feature (custom color names) spams the console with
  a formatted error tree and pays the `statePrint` cost on each call — and it is
  un-memoizable on the cold path. Same hazard for any consumer that uses
  `tryParse`/`parseResult` with failure-as-control-flow.
- **SOTA contrast (item §0.5):** every SOTA parser treats parse failure as a
  *returned value* routed to an opt-in `onParseError` callback (csstree `Raw`,
  `@csstools` callback). An unconditional `console.error` inside the parse entry
  is the anti-pattern — it makes "failure is normal" leak I/O and formatting cost.
- **Disposition: FOLD-VALUEJS-HANDOFF** (the *fix* lives in parse-that, but the
  value.js owner stewards both repos and `color.ts`'s fallback is the trigger).
  Cross-ref `r-wasm-compile-perf F6`/`d-vj-parse §0`: parse-that is the third
  sibling repo — the concrete ask is "make `parseState` not log; route to an
  optional diagnostic sink," and value.js's `parseCSSColor` reordering (try the
  custom-name map *before* the speculative `parseResult`) sidesteps it entirely
  without touching parse-that.
- **Isomorphism:** removing the log changes *no parse output*; only console I/O
  and `statePrint` cost on the failure path disappear. Behavior-stable, strictly
  faster + quieter.

---

## 5. Spec-coverage architecture gaps (typed-value parsing, item §0.3)

lightningcss's defining trait is a **typed value per property**; value.js is
partially there (`ValueUnit`/`FunctionValue` carry superType) but degrades
several modern productions to opaque strings/flat `FunctionValue`s. These confirm
`d-vj-parse §5` and are restated here as *typed-value-architecture* gaps:

- **5.1 · `linear()` easing parses to a flat `FunctionValue`, losing stop
  structure.** `easing.ts:33` `cssLinear(stops)` fully implements the Easing L2
  evaluator, but no parser produces `LinearStop[]` — `linear(0, .5 25% 75%, 1)`
  falls to generic `handleFunc` (`index.ts:230`) and loses input-position %s.
  **Baseline 2023-12-11** (modern-web-guidance `physics-based-easing`, similarity
  **0.79**; Chrome/Edge 113, Firefox 112, Safari 17.2 — retrieved this lane).
  This is the highest-leverage spec win: the math is already written; only the
  typed-parse bridge is missing. **FOLD-VALUEJS-HANDOFF** (+ paired keyframes.js
  FOLD-E to consume structured stops in the timing-function dispatch).
- **5.2 · `steps()` has no typed parser** — `easing.ts:293 steppedEase` exists;
  `steps(4, jump-end)` falls to `handleFunc`. **FOLD-VALUEJS-HANDOFF.**
- **5.3 · `var()`/`env()` captured as opaque strings.** `handleVar`
  (`index.ts:26-48`) flattens `var(--x, fb)` to `ValueUnit(raw, "var")` — name +
  fallback not separated; `env()` isn't in `Function_` at all (grammar/runtime
  drift, `d-vj-parse §5.3/§5.5`). SOTA keeps `{ name, fallback }`. Structured
  capture also enables resolving the computed path (§3) without a string
  round-trip. **FOLD-VALUEJS-HANDOFF.**
- **5.4 · calc math is two-pass (untyped-then-infer), not typed-fold.**
  `evaluateMathFunction` (`math.ts:473`) folds to a number
  (`evaluateMathFunctionInternal`, `:288`) **then re-walks the AST** to infer the
  unit (`inferResultUnit`, `:478/488`). The "first unit-bearing leaf wins"
  heuristic is *wrong* for mixed-type calc (`calc(100% / 2)`→unitless,
  `calc(10px * 2)`→px). CSS Values L4 defines real dimensional-type algebra; a
  single annotated fold carrying `{value, unit, superType}` is both faster (one
  pass) and more correct. **FOLD-VALUEJS-HANDOFF.**
- **5.5 · L5 math/values not modeled** — `calc-size()` (Baseline-adjacent,
  guide `animate-to-intrinsic-sizes`), `progress()`/`media-progress()`/
  `container-progress()`, `random()`, `sibling-index()`/`sibling-count()` (guide
  `dynamic-sibling-animations`). Emerging, not Baseline; the animation focus makes
  `progress()` worth a **BOOK** entry. **GAP-NAMED / BOOK.**

---

## 6. WASM — the decline holds; the *non-WASM* SOTA path is the recommendation
- **Verified this lane:** parse-that's Rust workspace (`rust/parse_that/src/
  parsers/css/{value,selector,declaration,media,specificity,types}.rs`) is a real
  typed-AST CSS parser benchmarked against `lightningcss` + `cssparser`
  (`benches/competitors/{lightningcss,cssparser,nom,winnow,pest}.rs`). But **no
  `cdylib` crate-type and no `#[wasm_bindgen]` in any source file** (verified:
  `find … -name Cargo.toml -exec grep cdylib` → empty; `grep wasm_bindgen
  rust/parse_that/src` → empty; the `wasm-bindgen` in `Cargo.lock` is purely a
  transitive dev/lock entry). So the WASM path is **unbuilt scaffolding** — and
  per the lane's explicit instruction (and `r-wasm-compile-perf F1`), **WASM for
  the per-token path is declined and stays declined.**
- **The SOTA path that is *not* WASM:** lightningcss/csstree prove the win is
  *architectural* (tokenize-once, dispatch, typed values, no re-scan) — all of
  which are achievable in pure TS, and all of which **parse-that already
  hand-wrote** in `parsers/css/` (§1.4). The recommendation is therefore
  unambiguous: **adopt the TS single-pass dispatched reader value.js's own
  dependency already ships, not compile Rust to WASM.** WASM would only pay off
  for whole-stylesheet ingestion (thousands of rules) — not a keyframes.js
  workload (`r-wasm-compile-perf F1.1`, boundary-marshalling cost of reconstructing
  `ValueUnit`/`FunctionValue` graphs per call).
- **Disposition: GAP-NAMED** (WASM declined, reasoning recorded) + the
  *non-WASM* architecture moves are the §2-§4 **FOLD-VALUEJS-HANDOFF**s.
- **Isomorphism:** N/A (decline = no change).

---

## 7. Packrat — do NOT add it; dispatch obviates it (ALREADY-SOTA / NO-OP)
- parse-that's `.memoize()` (`parser.ts:83`) is a real packrat, called **nowhere**
  in value.js. For value.js's grammar, full packrat is **not** worth it — CSS
  value grammars are LL(1)-ish once first-char dispatch (§2.1) removes the
  speculative `any()` retries, and packrat's per-parser `state.clone()`
  (`parser.ts:110`) can exceed the re-parse it saves for shallow grammars. SOTA
  parsers are linear single-pass token consumers, not packrat. The right move is
  §2.1 dispatch (which *removes* the backtracking that would motivate packrat),
  not bolting on `.memoize()`. Flag explicitly so a future pass doesn't reach for
  packrat first. **ALREADY-SOTA / NO-OP.** (Confirms `d-vj-parse §7`.)

---

## 8. Disposition summary

| # | Finding | SOTA invariant violated | Disposition |
|---|---------|------------------------|-------------|
| 0 | SOTA reference: tokenize-once · token-stream · typed values · borrow · forgiving errors · first-token dispatch | — | context |
| 1.1–1.4 | parse-that engine zero-alloc + ships `dispatch`/spans/`splitBalanced` + a hand-written single-pass CSS reader | — | **ALREADY-SOTA** |
| 2.1 | grammar uses only `any/all/regex/string`; 65 `any()` sites; `dispatch` imported nowhere | §0.6 first-token dispatch | **FOLD-VALUEJS-HANDOFF** |
| 2.2 | no tokenizer → source re-scanned, substrings materialized per token | §0.1 token-stream · §0.4 borrow | **FOLD-VALUEJS-HANDOFF** |
| 2.3 | per-dimension `any(istring)` — alloc + not maximal-munch | §0.1 · correctness | **FOLD-VALUEJS-HANDOFF** |
| 3 | per-frame computed-unit re-parse → numeric fast-path (pixel-gated) | §0.3 typed fast path | **FOLD-VALUEJS-HANDOFF** + kf FOLD-E |
| 4 | `console.error` on every top-level fail; fires on the *custom-color-name* path | §0.5 forgiving/no-I/O errors | **FOLD-VALUEJS-HANDOFF** (NEW) |
| 5.1 | `linear()` → flat `FunctionValue`, loses stops (Baseline 2023) | §0.3 typed values | **FOLD-VALUEJS-HANDOFF** (high value) |
| 5.2–5.3 | `steps()`/`var()`/`env()` opaque, not typed nodes | §0.3 | **FOLD-VALUEJS-HANDOFF** |
| 5.4 | calc two-pass eval + first-leaf unit heuristic (wrong for mixed-type) | §0.3 typed dimensional algebra | **FOLD-VALUEJS-HANDOFF** |
| 5.5 | `calc-size`/`progress`/L5 math/sibling not modeled | emerging | **GAP-NAMED / BOOK** |
| 6 | Rust CSS parser real + benched but no `cdylib`/`wasm-bindgen`; WASM declined; adopt the *TS* single-pass reader instead | — | **GAP-NAMED** (decline) |
| 7 | do NOT add packrat — dispatch obviates it | — | **ALREADY-SOTA / NO-OP** |

---

## 9. The one-sentence architectural verdict

value.js rides a **SOTA combinator engine that already ships, hand-written and
benchmarked, the exact tokenize-once + first-char-dispatch + single-pass CSS
value reader the SOTA field (lightningcss/csstree/@csstools) converged on** —
and uses **none** of it, parsing instead by sequential `any()` trial directly
over re-scanned source. The forward-SOTA path is therefore **not** WASM and
**not** a new tokenizer: it is **adopting the fast tier parse-that already
exports** (`dispatch`, the span family, `splitBalanced`, and the `parsers/css`
single-pass reader), folding parse failure into a returned value instead of a
`console.error`, and lifting `linear()`/`steps()`/`var()`/`env()`/calc into typed
nodes. Every move is isomorphic (the §3 numeric fast-path pixel-gated), and every
one is **FOLD-VALUEJS-HANDOFF** — proposals for the value.js owner, never edits
made from keyframes.js.

---

### Sources
- W3C CSS Syntax Module Level 3 — https://www.w3.org/TR/css-syntax-3/
- lightningcss — https://github.com/parcel-bundler/lightningcss · https://lightningcss.dev/
- Servo `cssparser` (`Token`) — https://docs.rs/cssparser/latest/cssparser/enum.Token.html
- csstree — https://github.com/csstree/csstree · `docs/parsing.md`
- `@csstools/css-parser-algorithms` — https://www.npmjs.com/package/@csstools/css-parser-algorithms
- modern-web-guidance `physics-based-easing` (Baseline 2023-12-11), `animate-to-intrinsic-sizes`, `dynamic-sibling-animations`
- parse-that (sibling repo) — `typescript/src/parse/{leaf,parser,state,span,split}.ts`, `parsers/css/{scan,value}.ts`; `rust/parse_that/src/parsers/css/`, `benches/competitors/`
- value.js (sibling repo) — `src/parsing/{index,units,utils,color,math,stylesheet}.ts`
