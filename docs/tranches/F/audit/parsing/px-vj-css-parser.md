# px-vj-css-parser — the value.js CSS PARSER, parse-that-first (Tranche F PARSING-SOTA)

**Lane.** `px-vj-css-parser`. **Modality.** Parsing, three-layer: `@mkbabb/parse-that`
(combinator engine, `/Users/mkbabb/Programming/parse-that/typescript/src/parse`) →
`@mkbabb/value.js` (the CSS parser built on it, `/Users/mkbabb/Programming/value.js/src/parsing`)
→ keyframes.js (`@keyframes` grammar consumption, `src/animation/utils.ts` +
`frame-compiler.ts`). **Focus.** value.js's CSS value/unit/color/function parsers, the
`flattenObject`/normalize pipeline, the **65 `any()` dispatch sites**, span/source-location
preservation, single-pass vs multi-pass, the tokenizer — on the heavy surface keyframes drives.

**inv-16.** parse-that AND value.js are SEPARATE `@mkbabb` repos. Every value.js / parse-that
item below is a **HANDOFF PROPOSAL** the respective owner sequences; this lane writes ONLY this
keyframes.js doc and makes ZERO source edits to either repo. **inv ε.** Every claim is
`file:line`-cited against the live trees (re-grounded 2026-06-06); every SOTA claim is web-sourced
(sources at the end). value.js is on branch `docs/constellation-grand-audit-2026-06-03` (tranche M
open); installed pin is `@mkbabb/value.js@0.10.0`.

**Relationship to the prior F + E evidence.** This dive is **parse-that-first and deeper**. I
**cite + extend**, never repeat:
- E `valuejs-sota-handoff.md` Wave A (A1 `any()`→`dispatch()`, A3 spans, A6 numeric fast-path) —
  the shape is correct; I supply the parse-that-side proposal it lacked.
- `vj-parser-aug.md` §1 (the dormant `parseSingleValue`/`cssParser`) and `p-parse-perf-F.md`
  (F-2 A2>A1 re-ranking, F-4 WASM decline, F-5 the C5 unit no-op) — re-confirmed; I do NOT
  re-derive. I add **five parse-that-internal + value.js-architectural findings none of them name.**
- `a-vj-consumption-F.md` (the clean consumption seam) — orthogonal; this is the producer side.

---

## 0. Headline + disposition index

| # | Finding | New vs prior F/E? | Disposition |
|---|---------|-------------------|-------------|
| **PX-1** | **parse-that's packrat MEMO table is keyed by parser `id` ALONE, not `(id, offset)`** — `MEMO.get(this.id)` (`parser.ts:88,104,123,136`) ignores `state.offset`, while the sibling `LEFT_RECURSION_COUNTS` correctly uses `getCijKey = (id<<20)\|offset` (`:75`). A position-independent memo is **not a packrat memo**; `.memoize()` is **latently unsound** and is the reason it's UNUSED. | **NEW (px)** | **parse-that-HANDOFF (correctness) + KILL** the current `.memoize()`/`.mergeMemos()` or re-key to `getCijKey` |
| **PX-2** | **parse-that ALREADY EXPORTS the SOTA reader value.js reimplements** — `cssParser` (whole-sheet, `parsers/css/index.ts`) + `parseSingleValue` (first-char dispatch, `parsers/css/value.ts:11-87`) + `scan.ts` charCode scanners are PUBLIC (`index.ts:8,9,11`). value.js imports **none**. This is **two CSS parsers in one dep chain**, value.js's the slower. `vj-parser-aug` named the file; I add: it is *exported*, *typed* (`CssAtKeyframes`), and shipped in `dist`. | **EXTENDS** vj-parser-aug §1 | **value.js-HANDOFF (adopt) / parse-that-HANDOFF (expose `parseSingleValue` + a `CssValue`→`ValueUnit` adapter)** |
| **PX-3** | **The stylesheet path is THREE passes per declaration value**, not one: `stripCSSComments` full-input regex replace (`stylesheet.ts:87-88`) → `balancedText` char-walk capturing a substring (`:183`) → `parseDeclarationValue` **re-parses that substring** via `CSSValues.Values` (`:212,221`). The middle substring is pure garbage. | **NEW (px)** — sharpens A3 | **value.js-HANDOFF** (single-pass span scan; comment-skip in the scanner) |
| **PX-4** | **The 45-way `LENGTH_UNITS` `any(istring)` (`units.ts:20`) is the worst single dispatch arm** AND carries a **maximal-munch ordering hazard**: `istring` compiles a **non-anchored, non-sticky** RegExp (`utils.ts:5-8`) — `regex()` re-flags it sticky but `.test` at offset still matches a unit as a *prefix* (`svw` vs `sv`, `vmin` vs `vh`). Order-as-correctness is brittle. | **EXTENDS** p-parse-perf F-2 + vj-parser-aug §2 with the **45-count + istring-leaf** root | **value.js-HANDOFF** (`dispatch`/LUT unit classifier with longest-match) |
| **PX-5** | **The whole library has SPAN infrastructure (17 combinators, `span.ts`) and a byte-class scanner (`takeUntilAnySpan`, LUT) — value.js's CSS parser uses ZERO of them.** Every value leaf materializes a substring (`regex` → `substring`, `leaf.ts:213`) that is immediately re-consumed. The no-tokenizer root the field rejected. | **EXTENDS** A3 with the **full unused-surface inventory** | **value.js-HANDOFF** (span leaves on number/unit/ident/keyword) |
| **PX-6** | **kf's consumer hot path stacks a SECOND memo atop value.js's** — `tryParseCache` keyed `childKey:strValue` (`utils.ts:203,240`), **`.clone()` on every get AND set** (`:243,267`). Two memo layers, a clone tax, and a cross-realm `as any` parser cast (`:251,258`) because kf and value.js ship **separate parse-that realms**. | **NEW (px)** — the consumer-side parse cost | **RECORD + kf-wave FOLD** (collapse to one memo once PX-2 lands; the clone is load-bearing only because the parsed `ValueArray` is mutated downstream) |
| **PX-7** | **The named-color transposition (`color.ts:527-552`) is the in-repo PROOF of the right pattern** — one broad ident regex + `Set`/object lookup replaced 155 `istring` branches. The 14-way `CSSColor.Value` `any()` (`:556`) and the 45-way unit `any()` are the *same shape un-transposed*. ALREADY-SOTA exemplar; generalize it. | **NEW (px)** — names the existing template | **value.js-HANDOFF** (apply the proven pattern to color-space + unit dispatch) |
| **PX-8** | **WASM decline HOLDS, re-grounded parse-that-first** — parse-that *has* a Rust crate (`/parse-that/rust`) with no `cdylib`/`wasm_bindgen`; the marshalling tax is fatal to value.js's *per-value* call shape; winnow/csstree both converge on **first-token dispatch + offset spans in-language**, which is exactly PX-2/PX-5, not WASM. | **CONFIRMS** p-parse-perf F-4 | **KILL (recorded) — pure-TS single-pass is the path** |

**One-sentence verdict.** The SOTA CSS reader the field converged on
(**tokenize-once · first-token dispatch · typed-value-per-shape · zero-copy spans · forgiving**)
**already exists, exported and typed, inside parse-that** (`cssParser`/`parseSingleValue` +
`span.ts` + `dispatch`) — value.js **reimplements that exact layer over speculative `any(istring)`
combinators with no spans, a 3-pass stylesheet path, and a 45-way unit alternation** — while
parse-that's own opt-in packrat (`.memoize()`) is **latently unsound** (id-only keyed) and rightly
dead. The gap across all three layers is **adoption + one parse-that correctness fix**, not
invention; the WASM rewrite stays declined.

---

## 1. PX-1 — parse-that's packrat MEMO is id-keyed, not (id, offset)-keyed (UNSOUND)

The decisive parse-that-internal finding, which no prior lane inspected because none of them
opened `.memoize()`.

**The bug.** `Parser.memoize()` (`parser.ts:83-119`) stores and retrieves the cached state with
`MEMO.get(this.id)` / `MEMO.set(this.id, …)` (`:88,104,110,123,136`) — **the offset is not part of
the key.** A packrat memo is by definition keyed on `(rule, position)`: the same parser at offset 0
and at offset 40 are different sub-results. Here, the *first* time parser `P` runs (at some offset),
its result is cached under `P.id`; a later `MEMO.get(P.id)` at a **different** offset returns that
stale state and the guard `cached.offset >= state.offset` (`:90`) either restores a wrong
offset/value or — when `cached.offset < state.offset` — silently re-parses without ever keying the
new position. Contrast the sibling `LEFT_RECURSION_COUNTS`, which is correctly keyed:

```
getCijKey(state): number {
    return (this.id << MEMO_OFFSET_BITS) | (state.offset & MEMO_MAX_OFFSET);  // parser.ts:75
}
```

`getCijKey` is the *correct* packrat key (it's already defined, with a 2^20 offset / 2^11 id
packing). `MEMO` simply does not use it. The infrastructure to fix this is **already in the file.**

**Why it has never bitten.** Because `.memoize()` and `.mergeMemos()` are **called nowhere** —
not in value.js (`grep '\.memoize()\|\.mergeMemos()' value.js/src` = 0), not in parse-that's own
parsers (= 0). `MEMO.clear()` runs on every top-level `parseState` (`parser.ts:43,48`), so even the
left-recursion counters reset per call. The packrat tier is **dead code that does not work.**

**Disposition — parse-that-HANDOFF (correctness) + KILL.** Two honest options for the parse-that
owner: **(a)** re-key `MEMO` to `getCijKey(state)` (one-line per access — the packing already
exists) and write the left-recursion test that would have caught this; or **(b)** **delete**
`.memoize()`/`.mergeMemos()` outright. Given PX-2/PX-5 — CSS value grammars are LL(1)-ish under
first-char dispatch and **do not need packrat** (E synthesis §"do NOT add packrat"; winnow's
`dispatch` is the non-memoized answer) — **(b) KILL is the gestalt choice**: a broken, unused,
unsound memo tier is legacy weight. This is the cleanest "NO legacy" cut in the parsing modality.

---

## 2. PX-2 — parse-that ALREADY EXPORTS the reader value.js reimplements

`vj-parser-aug` §1 named `parseSingleValue` as "the dormant SOTA machine." I extend it with the
**export + type + dist** ground truth that changes the handoff from "port a concept" to "import a
shipped function":

- **`cssParser`** (the whole-stylesheet single-pass parser) is exported from
  `parsers/css/index.ts` and re-exported at the package root: `index.ts:11` (`export * from
  "./parsers/index.js"`) → `parsers/index.ts:3` (`export { cssParser, specificity }`). It is in
  **published `dist`** (`dist/parsers/css/index.d.ts`).
- It emits a **typed CSS AST** including `CssAtKeyframes { name, blocks: KeyframeBlock[] }` and
  `KeyframeStop` (`parsers/css/types.ts`) — i.e. parse-that already models `@keyframes`
  *structurally*, the exact thing value.js's `parseCSSStylesheet` re-derives (`stylesheet.ts:30-58`).
- **`parseSingleValue`** (`parsers/css/value.ts:11-87`) is the first-char dispatch:
  `35 '#'`→hex, `34/39`→string, `44 ','`→comma, `47 '/'`→slash (comment-guarded, `:34`),
  digit/`-`/`+`/`.`→number→`%`|unit|bare (`:43-57`), `33 '!'`→`!important`, ident→function|ident.
  Its scanners (`scan.ts`) are pure `charCodeAt` — **no substring until a token is captured.**
- **value.js imports none of it** — re-confirmed: no `value.js/src` file imports `parsers/css`,
  `cssParser`, or `parseSingleValue`. `units.ts`, `index.ts`, `color.ts`, `math.ts` reimplement the
  CSS value layer over `any(istring(...))`.

**The one true gap parse-that has.** `parseSingleValue` returns parse-that's own `CssValue` tagged
union (`types.ts`), **not** value.js's `ValueUnit`/`FunctionValue`/`ValueArray`, and it is **not
individually exported** (only `cssParser` is; `scan.ts:2` even comments "internal — not exported").
So adoption needs a two-sided handoff:

- **parse-that-HANDOFF:** export `parseSingleValue` (and `parseFunctionArgs`) from the package root.
- **value.js-HANDOFF:** write a thin `CssValue → ValueUnit` adapter (the *shape* map is mechanical:
  `dimension`→`ValueUnit(value, unit, superType)`, `color`→the existing color constructors,
  `function`→`FunctionValue`), then make `parseCSSValueUnit`/`parseCSSValue` route through it. This
  is the E handoff's "multi-week parity-gated transposition," now with **the producer half named**:
  it is not "invent a tokenizer," it is "export one function and write one adapter."

**Disposition — value.js-HANDOFF (adopt) + parse-that-HANDOFF (expose).** Sequence AFTER the cheap
isomorphic Wave-A wins (PX-3/PX-4/PX-5), as E correctly ordered. The parity gate is exact:
`parseSingleValue`-via-adapter output **deep-equal** to the current `any()` output over the full
value.js + kf `parsing`/`units`/`editor-parsing` corpus.

---

## 3. PX-3 — the stylesheet path is THREE passes per declaration value

The `@keyframes` heavy surface kf drives most. The path from raw CSS text to a `ValueArray`
traverses every declaration value **three times**, two of which are avoidable:

1. **`stripCSSComments(input)`** (`stylesheet.ts:87-88`, called at `:516`) — a full-input
   `String.replace(/\/\*…\*\//g)` BEFORE parsing begins. One allocation of the whole sheet minus
   comments. parse-that's `skipWsAndComments` (`scan.ts:34-49`) does comment-skipping **inside the
   scan loop** at zero extra cost — the SOTA placement.
2. **`balancedText`** (`stylesheet.ts:99-181`) — a hand-written `charCodeAt`-ish walk (it indexes
   `input[i]`, a UTF-16 *string* read, not `charCodeAt`) that captures the declaration value as a
   **substring** (`:179-180 input.slice(start, i)`).
3. **`parseDeclarationValue(text)`** (`stylesheet.ts:212-235`) — **re-parses that substring** via
   `utils.parseResult(CSSValues.Values, trimmed)` (`:221`). So the value text is scanned in (2) only
   to be re-scanned from byte 0 in (3); the intermediate substring is pure GC pressure.

This is the "no-tokenizer / re-scan twice" root E's A3 named, here with the exact 3× count and the
extra `stripCSSComments` pass the prior docs did not flag. On a large `@keyframes` sheet (the editor
corpus) this is `O(declarations)` redundant substrings + one whole-sheet copy.

**Disposition — value.js-HANDOFF.** Fold the three into one: a span-returning balanced scanner that
skips comments inline and hands the value **span** (offsets, not a substring) straight to the value
parser — which, post-PX-2, is `parseSingleValue` reading the *same* `state` at those offsets. No
intermediate string. Isomorphic (output value-equal); the win is allocation-rate on first-paint +
editor-keystroke parses.

---

## 4. PX-4 — the 45-way unit `any()` is the worst arm + a maximal-munch hazard

`p-parse-perf-F` F-2 measured the unit-alternation cost (`px` 583ns → `cqmax` 2435ns, 4.2×) and
re-ranked A2 ahead of A1; `vj-parser-aug` §2 flagged the non-anchored `istring` hazard. I supply the
**joint root** with the exact counts:

- **`lengthUnit = any(...LENGTH_UNITS.map(istring))`** (`units.ts:20`) is a **45-way** sequential
  alternation: `LENGTH_UNITS` = 7 `ABSOLUTE` + 38 `RELATIVE` (`units/constants.ts:1-45`). The
  modern units kf animates — `dvh` (pos ~28), `cqw`/`cqmin`/`cqmax` (pos 33-40) — sit at the
  **tail**, so the *common-in-2026* viewport/container units are the *slowest* to classify. The
  ordering is alloc-historical (absolute-first), not frequency- or correctness-ordered.
- **`istring`** (`utils.ts:5-8`) compiles a **fresh, non-anchored** `RegExp(str, "i")` per call.
  `regex()` (`leaf.ts:185`) re-creates it sticky (`+"y"`) and `.test`s at `lastIndex = offset`
  (`:196,207`) — but stickiness only anchors the *start*, not the *end*. So `istring("sv")` matches
  the `sv` prefix of `svw`, and the `any()` returns the **first** arm whose prefix matches, not the
  **longest** unit. Correctness rides entirely on array order (e.g. `svmin`/`svmax` must precede
  `sv*` shorter forms, `vmin`/`vmax` interplay with `v*`). This is a **latent correctness** lever,
  not only perf — a reordering or a new unit silently breaks maximal munch.
- 9 such `any(istring)` unit alternations exist in `units.ts` alone (length/angle/time/frequency/
  resolution/flex/percentage + the `Value` fork + `TimePercentage`).

**Disposition — value.js-HANDOFF.** Replace the per-dimension `any(istring)` with a **single
longest-match unit classifier** — either parse-that's `dispatch` keyed on the unit's first char
then a per-bucket trie/`Set`, or the `parseUnit` LUT regex parse-that already ships
(`scan.ts:73-74,91` — one anchored alternation with the units **ordered longest-first** inside the
regex, which the regex engine *does* munch maximally). The latter is the smaller handoff: it's a
single sticky regex that already encodes the modern unit set. Round-trip-equivalence gate over the
unit corpus; **add a maximal-munch test** (`svmin` must not classify as `sv`+`min`) — that test is
the falsifiable proof the current order-dependence is fragile.

---

## 5. PX-5 — a full span/byte-class surface exists; value.js's CSS parser uses none of it

`span.ts` (548 lines) ships **17 span-producing combinators** — `regexSpan`, `stringSpan`,
`manySpan`, `sepBySpan`, `wrapSpan`, `altSpan`, `optSpan`, `skipSpan`, `nextSpan`, the five
assertion-span variants, and crucially **`takeUntilAnySpan`** (`span.ts:361-397`), a
`Uint8Array(128)` byte-class scanner (Rust `take_until_any_span` parity) that walks `charCodeAt`
and returns `{start, end}` with **zero allocation**. All are exported at the package root
(`index.ts:9`). A `Span` is `{start, end}` offsets into the shared `src`, materialized lazily via
`spanToString(span, src)` (`state.ts:13-15`) only when a string is actually needed.

**value.js's CSS parser uses ZERO span combinators** (`grep 'Span\|regexSpan\|takeUntilAny\|altSpan'
value.js/src/parsing` = 0). Every value leaf is a substring-materializing `regex`/`string`
(`leaf.ts:213 state.src.substring(...)`). Consequences specific to value.js:

- `utils.number` (`utils.ts:16`) materializes the numeric substring then `.map(Number)` — the
  substring is thrown away after the `Number()` cast. A span + `Number(src.slice(span...))` defers
  the one allocation to the single place it's consumed; better, a `parseNumber`-style charCode walk
  (`scan.ts:87`) needs no substring at all for the common integer/decimal shape.
- The kf per-frame computed path (E's A6) re-parses a fresh `getComputedStyle` string **per rAF
  tick** for an animating `calc(100cqw - 100%)` (`normalize.ts` → `parseCSSValueUnit`). Every such
  re-parse allocates the number substring + unit substring + the `ValueUnit`. Span leaves cut the
  first two per tick — the one place parse-alloc shows up *in the frame budget*, not just first-paint.

**Disposition — value.js-HANDOFF.** Span-ify the value leaves (number/unit/ident/keyword) — the
combinators are imported, not invented. This is the A3 win with the **complete unused-surface
inventory** attached so the value.js owner can see it is a *consumption*, not a *build*. Pairs with
PX-2 (post-adoption, `parseSingleValue`/`scan.ts` already do this natively — PX-5 is the
*incremental* path if full adoption is deferred).

---

## 6. PX-6 — kf stacks a second memo + a clone tax on the consumer hot path

The keyframes.js side of the parse pipeline (`parseAndFlattenObject`, `utils.ts:205-281`) — the
function `frame-compiler.ts:315` drives at compile time — wraps value.js's already-memoized parsers
in a **second** cache:

- `tryParseCache` (`utils.ts:203`), keyed `${childKey}:${strValue}` (`:240`).
- **`.clone()` on the cache HIT** (`:243 cached.clone()`) AND on the cache **SET** (`:267
  tryParseCache.set(cacheKey, parsed.clone())`). So every parse pays a deep `ValueArray` clone
  whether hit or miss, because the cached value must not be mutated by the downstream
  `setProperty`/`setSubProperty` (`:251-255`).
- A cross-realm `as any` cast on the parser itself (`:251,258`) — kf and value.js each bundle their
  **own** `@mkbabb/parse-that` realm (comment `:246-250`), so the `Parser<T>` classes are nominally
  distinct; `parseAny(fnArgs, CSSValues.Value)` is cast through `any` to bypass it.

This is a real, un-audited consumer cost: two memo layers (value.js's identity-keyed result memo +
kf's `childKey:strValue` memo), a mandatory clone on the kf layer, and a dual-realm parse-that.

**Disposition — RECORD + kf-wave FOLD.** The clone is *load-bearing today* (the parsed `ValueArray`
is mutated by `applyPropertyContext`/`setSubProperty`), so it is NOT a free delete. The right
sequencing: once PX-2 lands a span/typed-value reader in value.js, the kf layer can cache the
**immutable typed value** and apply property context as a *non-mutating projection*, collapsing to
one memo with no clone. The dual-realm parse-that is a `package.json`/dedupe concern (a single
hoisted `@mkbabb/parse-that`) — out of parsing-modality scope, RECORDED for the consumption lane.

---

## 7. PX-7 — the named-color transposition is the in-repo proof of the target pattern

value.js **already did this transposition once, correctly**, and left the receipt in a comment.
`color.ts:527-552` (the `nameParser`): rather than 155 `istring` branches in a 155-way `any()`
(155 sequential regex tests + 155 RegExp allocations at module init), it matches **one** broad
identifier regex (`namedColorIdent`, `:538`) then does an **O(1) `Set`/object lookup**
(`KNOWN_COLOR_NAMES.has(key)`, `:536,542`). The comment (`:529-535`) states the transposition
explicitly and notes case-insensitivity is preserved by lowercasing before lookup.

The two biggest remaining `any()` forks are **the same shape, un-transposed**:

- **`CSSColor.Value`** (`color.ts:556`) — a **14-way** `any(colorMix, colorFunction, hex, kelvin,
  rgbParser, hslParser, hsvParser, hwbParser, labParser, lchParser, oklabParser, oklchParser,
  xyzParser, nameParser)`. Every color parse tries `colorMix`→`colorFunction`→`hex`→… in order; a
  `#fff` hex reaches its arm only 3rd, an `oklch(...)` 12th. First-char dispatch is exact here:
  `#`→hex, `r`→rgb, `h`→hsl/hsv/hwb (sub-fork), `l`→lab/lch, `o`→oklab/oklch, `c`→colorMix/
  colorFunction, `x`→xyz, `k`/digit→kelvin, else→nameParser. Priority is preserved *inside* each
  bucket (e.g. `colorMix` before `colorFunction` both under `c`).
- The 45-way unit `any()` (PX-4) and the ~22-way `allMathFunctions` `any()` (`math.ts:200-223`) are
  the same.

**Disposition — value.js-HANDOFF (ALREADY-SOTA exemplar; generalize).** The pattern is not
hypothetical — it is **shipped in the same file**. Apply `nameParser`'s "broad match once + table
lookup" / `dispatch` to the color-space fork (largest single hot-loop win, per E's A1), the unit
fork (PX-4), and the math-function fork. The transposition is **isomorphic** (dispatch reaches the
same parser `any` would, priority preserved per bucket) — the E A1 isomorphism gate applies verbatim.

---

## 8. PX-8 — WASM decline holds, re-grounded parse-that-first

The E synthesis declined a full Rust/WASM CSS-parser rewrite; `p-parse-perf-F` F-4 re-confirmed it
(lightningcss-wasm is whole-sheet-only; Typed OM `CSSStyleValue.parse()` is not-Baseline 2026). I
re-examine **from the parse-that side** with current evidence and find the decline *strengthened*:

- parse-that **has** a Rust workspace (`/Users/mkbabb/Programming/parse-that/rust`,
  `rust-toolchain.toml`, `.cargo`) — but it ships **no `cdylib`/`wasm_bindgen`** target. There is no
  WASM artifact to consume, and building one is the multi-month effort E priced out.
- The marshalling tax is **fatal to value.js's call shape specifically.** lightningcss-wasm's own
  docs name `TextEncoder`/`TextDecoder` string↔heap copy as the dominant cost — amortized fine over
  a whole Bootstrap sheet (one boundary crossing), but value.js's hot surface is **per-value**
  (`parseCSSValueUnit("12px")`, `parseCSSColor("#fff")`, the per-frame computed re-parse). One WASM
  boundary crossing **per value** dwarfs the ~600ns–2.4µs cold-parse it would replace.
- The frontier converges **in-language, not in-WASM.** winnow's `dispatch` macro is the canonical
  "dispatch on first token when prefixes are unique, faster than `alt`" — i.e. PX-7's pattern, in
  Rust, without WASM. csstree separates tokenization from parsing because "string-to-tokens takes
  more time than parsing" and emits `(type, start, end)` **offset spans** — i.e. PX-5, in JS. Both
  SOTA references land **exactly where parse-that already is** (`dispatch` + `span.ts`), confirming
  the path is *adopt the in-language primitives*, not cross the WASM boundary.

**Disposition — KILL (decline recorded) + RECORD.** No WASM. The pure-TS single-pass
first-char-dispatched span-preserving reader (PX-2/PX-5/PX-7) is the SOTA target and it is already
written in parse-that.

---

## 9. ALREADY-SOTA — manufacture no work (stated plainly, per the KISS clause)

- **The parse-that leaf engine** — mutable single-`ParserState` with offset-rewind (`state.ts`,
  `parser.ts`), the zero-alloc `regex`/`string`/`whitespace` leaves with charCode fast-paths
  (`leaf.ts:138-176`, `180-232`, `235-254`), the `Int8Array(128)` `dispatch` primitive
  (`leaf.ts:60-104`), the `flags`-gated `trim`/`eof` fast path (`parser.ts:501-544`), and the
  flag-based whitespace-trim that avoids two frames (`:554-587`). This is a genuinely fast combinator
  core; the issue is what *consumes* it.
- **`parseSingleValue` + `cssParser` + `scan.ts` + the full `span.ts` surface** — the SOTA reader
  exists, typed and exported. PX-2/PX-5 are *adoption*, not build.
- **The `nameParser` transposition** (`color.ts:527-552`) — the correct pattern, already shipped.
- **value.js grammar COVERAGE** — 15 color spaces, relative-color syntax, full L4 math
  (`math.ts`), `@property`, the `chain`-based at-rule dispatcher (`stylesheet.ts:490-497`, which
  already avoids backtracking — the *one* place value.js dispatches instead of trialing). Broad and
  modern; the gap is the value-leaf *mechanism*, not the feature set.
- **The kf consumption seam** — `a-vj-consumption-F` covers it; the single `lerpValue → iv._lerp`
  dispatch lets value.js swap the whole parser internals with zero kf edits. The parser handoffs
  here are consumed transparently *by construction*.

---

## 10. The value.js-parser F-handoff shape (what this lane proposes, sequenced)

The cross-repo edge, ordered cheap-isomorphic-first (E's correct sequencing), with the **parse-that
half named** where prior lanes named only the value.js half:

| Seq | Item | Repo(s) | Gate | Iso? |
|-----|------|---------|------|------|
| **1** | **KILL or re-key `.memoize()`** (PX-1) — id-only MEMO is unsound; re-key to `getCijKey` or delete the dead tier | parse-that | a left-recursion/position test (re-key path) or zero-callers proof (kill path) | n/a (dead code) |
| **2** | **`dispatch`/LUT the color-space + unit + math-fn forks** (PX-4, PX-7) — generalize `nameParser`'s proven pattern | value.js | deep-equal over parsing/units/editor corpus; **+ maximal-munch test** | **isomorphic** |
| **3** | **Span leaves on number/unit/ident/keyword** (PX-5) — consume the imported `span.ts`/`takeUntilAnySpan` | value.js | value-equal; alloc-rate drop on the editor sheet + per-frame computed path | **isomorphic** |
| **4** | **Single-pass stylesheet** (PX-3) — fold `stripCSSComments`+`balancedText`+re-parse into one span scan with inline comment-skip | value.js | value-equal; one whole-sheet pass | **isomorphic** |
| **5** | **Expose `parseSingleValue`/`parseFunctionArgs`** at the package root (PX-2) | parse-that | additive export; existing parse-that tests | additive |
| **6** | **Adopt `parseSingleValue` as value.js's value layer** via a `CssValue→ValueUnit` adapter (PX-2) | value.js | deep-equal over the full corpus; the named multi-week parity tranche | parity-gated |
| **7** | **kf FOLD: collapse the double memo + clone** (PX-6) once #6 lands an immutable typed value | keyframes.js (a kf wave, not this lane) | parse-output-equal; clone-count drop | iso |

Items 1–4 are cheap and isomorphic (land first); 5–6 are the named architectural transposition
(sequence after); 7 is the kf consumer fold gated on 6. **No WASM** (PX-8). **No new packrat** (PX-1
kill + dispatch obviates it).

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/parsing/px-vj-css-parser.md` and made **ZERO** source
edits to keyframes.js, value.js, or parse-that. Every parse-that item (PX-1 MEMO re-key/kill, PX-2
export) is a **parse-that-HANDOFF**; every value.js item (PX-2 adopt, PX-3/4/5 single-pass/dispatch/
spans, PX-7 generalize) is a **value.js-HANDOFF**; the one kf item (PX-6) is RECORDED for a future
kf wave. Each is a *proposal* the respective `@mkbabb` owner sequences against its own tranche
discipline. Every claim is `file:line`-cited against the live trees
(`/Users/mkbabb/Programming/parse-that/typescript/src/parse`,
`/Users/mkbabb/Programming/value.js/src/parsing`, `keyframes.js/src/animation`), re-grounded
2026-06-06; every SOTA claim is web-sourced.

**Sources.**
- winnow `dispatch` (first-token dispatch, faster than `alt` for unique prefixes):
  <https://docs.rs/winnow/latest/winnow/combinator/macro.dispatch.html>,
  <https://epage.github.io/blog/2023/07/winnow-0-5-the-fastest-rust-parser-combinator-library/>
- csstree (separate tokenization from parsing — "string-to-tokens takes more time than parsing"; `(type, start, end)` offset spans):
  <https://github.com/csstree/csstree/blob/master/docs/parsing.md>,
  <https://github.com/csstree/csstree>
- CSS Syntax Module Level 3 (the tokenizer the field implements): <https://www.w3.org/TR/css-syntax-3/>
