# L.W10 — The CSS-parity research-and-challenge spike (S0 decision record)

**Authored 2026-06-17 (L.W10, Band B).** RESEARCH ONLY — no code, no
manifest edits, no gate authoring. This doc is the S0 artifact the wave spec
(`docs/tranches/L/waves/L.W10.md §S0`) requires *before any implementation phase
may claim green*: a written architectural decision record, grounded in **live
runtime probes** of the actual consumed artifacts (value.js 0.13.0 +
parse-that 0.9.0 as installed in `node_modules/@mkbabb/`), with the audit's gap
claims VERIFIED row-by-row against ground truth.

**The L.W1 lesson applied.** L.W1 found the audit's `!important` premise was
factually wrong (value.js spec-correctly DROPS keyframe `!important`; the audit
had it as a kf band-aid). This spike applied the same adversarial posture and
found **the audit's degradation-mode predictions are systematically
mis-attributed**: the 36-lane audit ran its nesting/url/at-rule live-probes
against **parse-that's `cssParser`** (`audit-32-skeleton.txt:285-288` — every
row reads `Live: cssParser.parse(...)`), then the L.W10 witness table
(`L.W10.md §Born-RED gate`) re-attributed those parse-that behaviours to
**value.js's `parseCSSStylesheet`**, which behaves DIFFERENTLY on the same
inputs. The two grammars fail in opposite ways. §1 corrects every row.

---

## §1 — The verified gap matrix

Each row probed live. Probe harness: `parseCSSStylesheet` / `parseCSSValue`
from `node_modules/@mkbabb/value.js/dist/value.js` (0.13.0) and `cssParser`
from `node_modules/@mkbabb/parse-that/dist/parse.js` (0.9.0). Source anchors
are against the `.ts` SOURCE trees (`value.js/src/parsing/`,
`parse-that/typescript/src/parse/parsers/css/`).

| # | Gap | Audit / L.W10-witness CLAIM | GROUND-TRUTH behaviour today (live-probed) | Source anchor | Verdict | Severity |
|---|-----|-----------------------------|--------------------------------------------|---------------|---------|----------|
| 1 | **CSS Nesting** `.card{color:red; & .inner{…}}` | L.W10 witness: "SILENTLY DROPS inner rule — output has 1 declaration, not 2" (`L.W10.md:341`) | **value.js THROWS** `Parse error at offset 17` (the `&`). NOT a silent drop — the top-level full-consume check (`stylesheet.ts:503-510`) fails at the `&`, aborting the WHOLE parse. **parse-that** does the silent-drop the audit described: `cssParser` returns `.card` with `color:red` ONLY, `& .inner` gone, no error. | value.js `stylesheet.ts:501` (`any(atRule, styleRule)` — no `nestedRule` arm) + `:503-510` (full-consume); parse-that `rule.ts:111-137` (declaration list stops at `{`, body recursion never re-enters) | **CONFIRMED gap, REFUTED mode** — value.js throws (not silent); the "silent drop" is parse-that's. kf never reaches parse-that here, so the kf-visible behaviour is a THROW. | HIGH |
| 2 | **url-token** `url(img/hero.png)` (unquoted) | L.W10 witness: "shreds to `ident('img')/slash/ident('hero')/ident('png')`" (`L.W10.md:342`); audit:286 same | **value.js does NOT shred** — `parseCSSValue("url(img/hero.png)")` returns a generic `FunctionValue("url", …)` (`.toString() === "url(img/hero.png)"`), captured whole via `handleFunc()`. **parse-that DOES shred** exactly as predicted: `function url [ident img, slash, ident hero, ident png]`. The url-token is untyped in BOTH but only parse-that shreds. | value.js `index.ts:230` (generic `handleFunc()` arm; no url special-case in `Function_:224`); parse-that `value.ts:71-84` (generic function) + `value.ts:89-103` (`parseFunctionArgs` slash-splits) | **CONFIRMED gap, mode is grammar-specific** — value.js: opaque-but-whole FunctionValue; parse-that: shredded. The witness's shred is parse-that's. | MEDIUM |
| 3 | **@container** `@container sidebar (min-width:300px){.x{…}}` | audit:287 / witness: degrades to `kind:"unknown"`, opaque prelude+body string (`L.W10.md:343`) | **value.js CONFIRMED**: `{kind:"unknown", atName:"container", prelude:"sidebar (min-width:300px)", body:".x{color:red}"}` — body is an UNPARSED string. **parse-that is BETTER**: `{type:"genericAtRule", name:"container", prelude:"sidebar (min-width:300px)", body:[CssQualifiedRule…]}` — it RECURSES the body into a typed `CssNode[]`. Only the prelude is opaque in parse-that. | value.js `stylesheet.ts:471-485` (`unknownBody` → opaque string body) + `:496`; parse-that `rule.ts:204-219` (genericAtRule recurses body via `parseBlockRules`) | **CONFIRMED** for value.js opaque body; **PARTIALLY REFUTED** for parse-that — its body IS a recursive typed tree, not a string. | HIGH |
| 4 | **@layer / @scope / @page** | audit:287: all four absent from parse-that `CssNode`, degrade to genericAtRule | value.js: all → `kind:"unknown"` (opaque body string) — `@layer base{…}`→`prelude:"base"`, `@scope (.a){…}`→`prelude:"(.a)"`, `@page{margin:1cm}`→`prelude:"", body:"margin:1cm"`. parse-that: `genericAtRule` with recursive body (no typed prelude). `CssNode` union (`types.ts:3-11`) has NO `CssAtContainer/Layer/Scope/Page`. | value.js `stylesheet.ts:490-497`; parse-that `types.ts:3-11` + `rule.ts:204-219` | **CONFIRMED** | HIGH (`@layer`/`@scope`) / MEDIUM (`@page`) |
| 5 | **@property** `syntax` string | audit:289 / §S4: `syntax` stored as raw string, not parsed against `<syntax>` grammar; initial-value untyped against it (`L.W10.md:224-232`) | **CONFIRMED**: `buildPropertyDescriptor` stores `syntax:"<color>"` verbatim (only strips quotes, `:386`); `initial-value:red` IS parsed (to an RGBColor) but NOT validated against the `<syntax>`. `serializeStylesheetItem` round-trips the block but re-emits `syntax:"<color>"` opaque + `initial-value: rgb(255 0 0)` (the color is normalized, the syntax is a pass-through string). | value.js `stylesheet.ts:379-395` (`buildPropertyDescriptor`); `serialize.ts`/`serializeStylesheetItem` (round-trips, untyped) | **CONFIRMED** | MEDIUM |
| 6 | **structured gradient — radial** `radial-gradient(circle at center, …)` | audit:219 / witness: "THROWS or returns opaque token list"; head shape/size/position opaque (`L.W10.md:344`) | **value.js parses but MANGLES**: returns `FunctionValue("radial-gradient", …)` whose `.toString() === "radial-gradient(circle, at, center, rgb(…), rgb(…))"` — `circle`, `at`, `center` emitted as separate raw comma-joined idents (the head structure is LOST, not opaque — corrupted). Does NOT throw. | value.js `index.ts:125-208` (`handleGradient` — only `linearGradient` built; radial/conic fall through the `colorStopList` mis-parse) | **CONFIRMED gap, mode REFINED** — parses-and-corrupts, not throw | MEDIUM |
| 7 | **structured gradient — conic** `conic-gradient(from 90deg at center, …)` | audit:219 / §S7: opaque head | value.js parses but DROPS position: `.toString() === "conic-gradient(90deg, rgb(…), rgb(…))"` — the `from 90deg` survives (via `fromAngle:161`) but `at center` is SILENTLY DROPPED. | value.js `index.ts:161-166, 188-205` | **CONFIRMED** (position silently dropped) | MEDIUM |
| 8 | **structured gradient — bare linear** `linear-gradient(red, blue)` | audit:283 CROSS-REPO: "THROWS `t is not iterable`" (`L.W10.md:283`) | **CONFIRMED throw**: `parseCSSValue("linear-gradient(red, blue)")` → `TypeError: t is not iterable`. With a direction it works: `linear-gradient(to right, red, blue)` → typed `FunctionValue("linear-gradient", [90deg, …])`. The direction-optional path (`:191` `.opt()`) has the bug. | value.js `index.ts:188-205` (`linearGradient`, the `any(fromAngle, direction).skip(comma).opt()` arm) | **CONFIRMED** — a genuine crash on Baseline-stable CSS | HIGH |
| 9 | **env()** `env(--safe-area-inset-top, 0px)` | audit:223 / §S5: "fall through to generic FunctionValue, no semantic resolution" (`L.W10.md:243-251`). L.W10 witness: typed `EnvValue` expected; today `FunctionValue("env",[ident, ValueUnit])` (`L.W10.md:345`) | **CONFIRMED**: parses to `FunctionValue("env", …)`, `.toString()` round-trips faithfully (`"env(--safe-area-inset-top, 0px)"`). Untyped — no `EnvValue` node, no fallback separation. Note: the `.bbnf` grammar (`css-values.bbnf:82`) DECLARES `envFn` but `.bbnf` is **non-executable reference doc** (imported only as `*.bbnf?raw`, `vite-env.d.ts:3`); the LIVE parser is the hand-rolled `Function_` (`index.ts:224`) with no `handleEnv` arm. | value.js `index.ts:224-233` (no `handleEnv`); grammar-rule-vs-production gap: `css-values.bbnf:82` (doc) vs `index.ts:224` (live) | **CONFIRMED** | MEDIUM |
| 10 | **attr()** `attr(data-speed number, 0)` | audit:223 / §S5: generic FunctionValue, type-hint unparsed | **CONFIRMED**: `FunctionValue("attr", …)`, faithful `.toString()`, untyped (no `AttrValue`, type-hint `number` not separated). Same `.bbnf`-declares-but-`Function_`-ignores pattern (`css-values.bbnf:85`). | value.js `index.ts:224-233` (no `handleAttr`); `css-values.bbnf:85` (doc) | **CONFIRMED** | LOW |
| 11 | **system-color** `color: Canvas` | audit / §S6: "no typed SystemColor; falls through to named-color or generic string" (`L.W10.md:346`) | **CONFIRMED**: `parseCSSValue("Canvas")` → bare `ValueUnit("Canvas")` via the `CSSString` fallback (`index.ts:222,235`); NOT a typed `SystemColor`. `parseCSSColor("Canvas")` THROWS (`Parse error at offset 0`) — Canvas is not in the color grammar's named-color set. So a `color: Canvas` keyframe stop ingests as a literal ident string, unresolvable as a UA-dependent color. `.bbnf` declares `systemColor` (`css-color.bbnf:110`) but it is doc-only. | value.js `index.ts:222` (`CSSString` fallback) + `:235` (`Value` routes Canvas here); `parseCSSColor` has no systemColor arm; `css-color.bbnf:110` (doc) | **CONFIRMED** | LOW–MEDIUM |

### §1.1 The two-grammar conflation (the audit-level correction)

The audit's headline live-probe rows (`audit-32-skeleton.txt:285-288`) for
nesting, url-token, and at-rules ALL read `Live: cssParser.parse(...)` —
i.e. they probed **parse-that**, not value.js. The L.W10 witness table
(`L.W10.md:339-347`) then describes the EXPECTED kf-visible behaviour as if
value.js produced those outputs. **kf consumes value.js's `parseCSSStylesheet`,
never parse-that's `cssParser`** (confirmed: `adapter.ts:5,201` imports
`parseCSSStylesheet`; zero kf reach to `cssParser`). So the kf-visible
behaviour for rows 1–2 is value.js's (THROW on nesting; opaque-whole
FunctionValue on url), NOT parse-that's (silent-drop; shred). The gate
(§4) must assert against value.js's REAL behaviour, or it will be born-RED
for the wrong reason and could go green on a fix that doesn't match the
witness.

### §1.2 Net verdict

Every gap class is a REAL, CONFIRMED gap — there is no row where value.js
already does the right thing. But the **failure modes** the audit/witness
predicted are wrong in 5 of 11 rows (nesting, url, @container-body,
radial-gradient, conic-gradient), and one row (env/attr) was earlier mis-read
as a THROW (a JSON-serialization artifact of the probe, not the parser — the
FunctionValue has no `toJSON`; the parser succeeds). The two genuine
hard-crashes in value.js are **nesting (row 1)** and **bare linear-gradient
(row 8)** — both on Baseline-stable CSS, both HIGH severity.

---

## §2 — The two-grammar architecture

### §2.1 What each layer actually is

**parse-that `parsers/css/`** — a genuine, reachable, PUBLISHED structural CSS
grammar, not the dead-code the audit implied:

- Exported at the package ROOT: `cssParser`, `parseSingleValue`,
  `parseFunctionArgs`, `specificity` are all top-level
  `@mkbabb/parse-that` exports (live-confirmed against
  `dist/parse.js`; `parse-that .../css/index.ts:34-39`). It is NOT an internal
  module — deleting it is a breaking API change.
- `CssNode` union (`types.ts:3-11`): `CssQualifiedRule | CssAtMedia |
  CssAtSupports | CssAtFontFace | CssAtImport | CssAtKeyframes |
  CssGenericAtRule | CssCommentNode`. TYPED `@media` (full `MediaQuery` /
  `MediaFeature` / range-interval AST, `types.ts:116-133`), TYPED `@supports`
  (`SupportsCondition`, `:137-141`), TYPED `@keyframes` (`:41-45,104-112`),
  TYPED selectors with specificity (`:82-102`), `CssDeclaration.important`
  typed (`:62`).
- Recursive at-rule bodies: even `genericAtRule` recurses its body into
  `CssNode[]` (`rule.ts:204-219` + live-probe row 3) — STRONGER than value.js.
- Gaps (all CONFIRMED): no `url` variant in `CssValue` (`:65-75`); no
  `@container/@layer/@scope/@page` in `CssNode`; no nesting production
  (declaration list stops at `{`, never re-enters as a child rule); **no
  serializer** (`grep serialize|toCss .../css/ → 0`); **no `Span`/`loc` on any
  AST node** (`types.ts` carries none — confirmed) even though parse-that's
  CORE has full `Span` machinery (`span.ts`, `stringSpan`/`regexSpan` root
  exports). Replay-equality (parse-run-backward) is STRUCTURALLY absent here.

**value.js `src/parsing/`** — a keyframes-and-value-domain grammar built ON
parse-that's LOW-LEVEL combinators, IGNORING parse-that's CSS module:

- `stylesheet.ts` imports `{ all, any, regex, string, whitespace }` from
  `@mkbabb/parse-that` (`stylesheet.ts:1-8`) — the COMBINATOR core, never
  `cssParser`. `index.ts:1` does the same.
- TYPED `@keyframes` (with `from`/`to`/`%`/named scroll selectors,
  per-keyframe `animation-timing-function`/`animation-composition` lift,
  keyframe `!important` spec-drop — `stylesheet.ts:308-375`), TYPED
  `@property` (opaque `syntax`), a rich VALUE grammar
  (`calc`/`var`/transforms/colors/linear-gradient-with-direction,
  `index.ts:224-256`), and a BLOCK serializer (`serializeStylesheetItem`,
  `serializeStylesheet`, `serializeDeclaration` — root exports, live-confirmed).
- Opaque everything else: every non-`@keyframes`/`@property` at-rule →
  `kind:"unknown"` with a STRING body (`stylesheet.ts:471-485`); no nesting
  production (`:501`); no recursive group-rule body parse.
- Full-input-consumption enforced at the TOP level only (`:503-510`), which is
  why nesting THROWS (the `&` is unconsumable) while a declaration-value
  partial parse silently truncates (the §6/§1 silent-loss class in
  `KF-TO-VALUEJS-O-ASKS.md`).

**kf** — `src/animation/utils.ts:1` imports `any` from `@mkbabb/parse-that`
directly (the ⚠24 seam) SOLELY to compose value.js's typed parsers across the
cross-realm nominal-type boundary (`utils.ts:234-243` — `(parseAny as any)(fnArgs,
CSSValues.Value)`). kf's ingest (`adapter.ts:201` → `pickKeyframes` →
`extractKeyframes`, `:145-151`) walks the FLAT `StylesheetItem[]` for
`kind:"keyframes"` ONLY; a `@keyframes` nested inside `@container`/`@layer`
(value.js's opaque-string body) is invisible to it.

### §2.2 Redundancy-vs-layering verdict

**It is genuine REDUNDANCY, not a clean layering — but the redundancy runs the
OPPOSITE direction from what the audit assumed.** The audit framed value.js as
the complete consuming grammar and parse-that's CSS module as the dead
structural one. Ground truth:

- The two grammars are **disjoint in capability**: parse-that owns the
  STRUCTURAL surface value.js LACKS (typed `@media`/`@supports`, recursive
  at-rule bodies, typed selectors+specificity); value.js owns the VALUE +
  `@keyframes` surface parse-that lacks (typed transforms, colors, calc,
  `@keyframes` semantics, `@property`). NEITHER subsumes the other.
- value.js does NOT consume parse-that's CSS module at all — it re-derives its
  own structural shell (`styleRule`, `atRule`, `splitSelectorList`) on the bare
  combinators. So the structural work is done TWICE (parse-that's
  `parseSelectorList`/`parseMediaQueryList` AND value.js's hand-rolled
  `selectorListText`/`balancedText`), and value.js's copy is WEAKER (opaque
  bodies, no media typing).
- The KISS/no-redundant-grammar precept is violated: two CSS structural
  grammars exist, value.js's is the weaker one, and it is the one kf depends
  on. parse-that's stronger structural grammar is published-but-unconsumed.

This is the architectural root the W97 decision must resolve.

---

## §3 — The architectural decision (W97)

### §3.1 The three options, weighed against ground truth

**Option A — Promote parse-that's `parsers/css/` to THE tokenizer/structural
layer that value.js consumes.** Ground-truth support: parse-that's structural
grammar is already STRONGER than value.js's hand-rolled shell (typed media,
recursive bodies, typed selectors). value.js would delegate `selectorListText`
+ the `atRule` dispatcher + `balancedText` to parse-that's `cssParser`/
`parseSelectorList`/`parseRule`, keeping its typed VALUE + `@keyframes` layer
ABOVE. **Cost (large):** parse-that must add (a) the `url` `CssValue` variant,
(b) the `@container/@layer/@scope/@page` `CssNode` variants, (c) the nesting
production, AND (d) **`Span`/`loc` on every node + a format-backward
serializer** — none of which exist, and the Span requirement is the hard one
(every node, threaded through value.js's typed layer, so kf's
`CSSKeyframesToString` can emit source-faithful output). It also makes kf's
acyclic spine WORSE in one sense: value.js gains a hard static edge to
parse-that's CSS module (today it only touches combinators), though this is
internal to value.js, not a kf edge.

**Option B — Delete parse-that's `parsers/css/`, consolidate in value.js.**
Ground-truth COMPLICATION the wave spec under-weighted: parse-that's CSS
module is a **published root export** (`cssParser` et al.), so deletion is a
parse-that MAJOR bump, not a quiet removal — and it would orphan
`parseSingleValue`/`parseFunctionArgs` (the §1.5 produce-half value.js is
about to consume per `KF-TO-VALUEJS-O-ASKS.md §8`). Deleting the structural
grammar but keeping the value readers is fine; deleting the readers breaks the
§8 consume. value.js then extends its OWN `stylesheet.ts` to cover nesting +
`@container/@layer/@scope/@page` (recursive typed bodies) + the url-token +
typed env/attr/system-color + the structured-gradient head, AND extends
`serializeStylesheetItem` to the full surface. **Cost:** a larger value.js
surface, but ONE grammar in ONE place, ONE serializer, and the Span/replay
design lives where the typed layer already is.

**Option C — Status quo (two grammars).** Rejected: violates KISS/
no-redundant-grammar (two structural CSS grammars, the weaker one consumed),
keeps kf's ⚠24 direct parse-that dep alive, and leaves replay-equality
structurally impossible on whichever path lacks a serializer. Named only to be
killed.

### §3.2 RECOMMENDATION — **Option B (delete the parsers/css/ STRUCTURAL grammar; keep the value readers; consolidate in value.js)**

Three evidence points (the S0 protocol's required triad,
`L.W10.md:124-137`):

1. **Parse-surface delta favours B.** Every one of the six gap-class inputs
   (nesting, url, @container, structured-gradient, env, system-color) is a
   VALUE-or-`@keyframes`-domain extension that value.js's grammar is the
   natural home for — value.js already owns transforms/colors/calc/gradients
   and the recursive `keyframeRule.many()` machinery the nested-body parse
   reuses (`stylesheet.ts:360-375`). Promoting parse-that (Option A) means
   teaching a GENERAL combinator library a 150-page CSS5 tokenizer spec +
   per-node Spans — a domain-product burden on a library whose job is
   combinators. The audit's own §1.1 names this risk ("misaligned ownership —
   parse-that is a general combinator lib; a CSS5 tokenizer is a domain
   product").

2. **Serializer/replay design favours B.** `parse(serialize(ast)) === ast`
   needs a format-backward emitter over the typed surface. value.js ALREADY
   ships `serializeStylesheetItem`/`serializeStylesheet`/`serializeDeclaration`
   (live-confirmed root exports) and round-trips `@property` blocks today.
   Extending THAT to the new gap classes is incremental. Option A requires a
   NET-NEW Span-anchored serializer in parse-that AND Span threading through
   value.js's layer — two new surfaces vs one extension.

3. **Acyclic-spine impact favours B decisively.** Option B is the ONLY path
   that retires kf's ⚠24 direct parse-that dependency: value.js ships
   `parseCSSSubValue` (composing `parseSingleValue`/`parseFunctionArgs`, the
   §8 ask), kf deletes `utils.ts:1`'s `any` import + the `@mkbabb/parse-that`
   dep, and `proof:boundary` (W96-extended) asserts zero parse-that imports in
   `src/`. Option A keeps parse-that's CSS module a first-class consumed
   surface and does NOT, by itself, retire the kf direct dep. The spine
   becomes the clean `parse-that (combinators + value readers) → value.js
   (the ONE typed CSS grammar) → kf` edge the charter claims.

**Nuance that keeps B compatible with the §8 cascade:** delete parse-that's
STRUCTURAL grammar (`cssParser`, `parseRule`, `parseSelectorList`,
`parseMediaQueryList`, the `types.ts` `CssNode`/`CssSelector` surface) but
KEEP `parseSingleValue`/`parseFunctionArgs` (the §1.5 value readers value.js's
`parseCSSSubValue` is about to adopt). Those readers are the SOTA single-pass
value scanner — value.js consumes them, kf consumes value.js. The structural
AST is the redundant part; the value readers are the layered part.

### §3.3 Migration path

1. **value.js Tranche O** extends `stylesheet.ts`:
   - S1 nesting: add a `nestedRule` production to `styleRule` (recursive
     `stylesheetItem`-as-child, `kind:"nested"`), so `&`/`& .child` no longer
     aborts the parse (cures the row-1 THROW).
   - S3 at-rules: route `@container`/`@layer`/`@scope`/`@page` in the `atRule`
     dispatcher (`:490-497`) to typed parsers with RECURSIVE typed bodies
     (reusing `stylesheetItem.many()`), replacing the opaque-string `unknownBody`.
   - S2 url-token: add a `url(` arm to `Function_`/`Value` (`index.ts:224/235`)
     producing a typed `UrlValue` (or a flagged FunctionValue) that consumes
     the quoted-OR-unquoted path without shredding.
   - S5/S6 env/attr/system-color: add `handleEnv`/`handleAttr` arms to
     `Function_` and a `systemColor` arm to the color parser — typed
     sentinels, runtime-resolved like `cqw`/`var()`.
   - S7 structured gradient: complete `handleGradient` for radial/conic heads
     (cures the row-6/7 corruption) AND fix the bare-`linear-gradient` `.opt()`
     crash (row 8).
   - S4 @property: parse `<syntax>` into a typed descriptor; type
     `initial-value` against it.
   - Extend `serializeStylesheetItem` to every new typed node (replay-equal).
2. **value.js Tranche O** ALSO ships `parseCSSSubValue`/`parseCSSValueOrArgs`
   (§8) composing parse-that's `parseSingleValue`/`parseFunctionArgs`.
3. **parse-that** ships the cleanup (PT-WAVE-4: `typesVersions` surgery — the
   stale `dist/src/parse/index.d.ts` path + the CJS `require` audit, both
   live-confirmed present, see §6) and — on B — a MAJOR that deletes the
   structural `cssParser`/`types.ts` AST while RETAINING the value readers.
   (The major can lag; nothing consumes `cssParser` today.)
4. **kf re-pin** `@mkbabb/value.js ^0.13.0 → ^0.14.0`; delete `utils.ts:1`'s
   `any` import + the `@mkbabb/parse-that` dep; consume `parseCSSSubValue`.

### §3.4 Coordinated publish sequence + the kf consume-edge

```
parse-that PT-WAVE-4  (typesVersions + CJS cleanup — package.json only; lowest risk, ships FIRST)
   └─► value.js Tranche O consumes parseSingleValue/parseFunctionArgs in parseCSSSubValue
        + extends stylesheet.ts (nesting, @container/@layer/@scope/@page, url, env/attr,
          system-color, structured gradients) + serializeStylesheetItem widening
        + publishes 0.14.0
            └─► kf re-pin ^0.14.0  (a SINGLE commit):
                  · delete utils.ts:1 `import { any } from "@mkbabb/parse-that"`
                  · delete the `@mkbabb/parse-that` dep from package.json
                  · call value.js `parseCSSSubValue` in tryParseLeaves
                  · L.W3 recursive group-rule walk consumes the typed @container/@layer bodies
                      └─► proof:css-parity GREEN (all rows) + proof:boundary (W96) GREEN
parse-that MAJOR  (delete structural cssParser/CssNode; keep value readers) — may lag; no live consumer
```

The kf consume-edge is born-RED-gated kf-side per `inv-L-acyclic-purity`: NO
`file:` pin, NO `overrides`, NO consume-seam patch. The gate stays RED in kf CI
until `0.14.0` installs; a `PROGRESS.md` BOOK row carries the tripwire
"value.js ≥0.14.0 published on npm" for each S-clause.

---

## §4 — `proof:css-parity` capability-matrix gate DESIGN (born-RED; design only)

**Gate:** `proof:css-parity` → `scripts/proof-css-parity.mjs` (NEW; the impl
phase authors the script, NOT this spike). Modeled on the existing
`proof-deps-current.mjs` born-RED-tripwire shape (each clause BITES — a real
`parseCSSStylesheet`/`parseCSSValue` invocation + a typed-shape assertion, NOT
a source grep). It CANNOT be faked by a grep; it must INVOKE the real installed
value.js parser and assert the output node type.

**The design correction this spike forces:** assert against value.js's REAL
behaviour (§1 ground truth), NOT the witness table's mis-attributed
parse-that behaviour. Each row asserts the CURED shape (born-RED today because
value.js throws/mangles/opaque-ifies, GREEN only on the 0.14.0 consume).

| Row | Witness input | Today's REAL value.js behaviour (born-RED reason) | The cured assertion (GREEN condition) |
|-----|---------------|---------------------------------------------------|----------------------------------------|
| `nesting` | `.card{color:red; & .inner{color:blue}}` | THROWS `Parse error at offset 17` (not the witness's "1 declaration") | parse succeeds; a `kind:"nested"` (or `kind:"style"` child) item carries the inner `color:blue` |
| `url-token` | `.x{background:url(img/hero.png)}` | generic `FunctionValue("url",…)`, untyped (NOT the witness's shred — that's parse-that) | a typed url node preserving the literal `img/hero.png`, replay-equal |
| `at-container` | `@container sidebar (min-width:300px){.x{color:red}}` | `kind:"unknown"`, opaque STRING body (CONFIRMED) | `kind:"container"` with a parsed condition + a RECURSIVE typed body reachable by `pickKeyframes` |
| `at-layer` | `@layer base{.x{color:red}}` | `kind:"unknown"`, opaque string body | `kind:"layer"` typed, recursive body |
| `structured-gradient` | `radial-gradient(circle at center, red, blue)` | parses to a MANGLED `FunctionValue` (`circle, at, center` as raw idents) — and bare `linear-gradient(red,blue)` THROWS | typed head with `shape:"circle"`, `position:center`; bare linear-gradient no longer throws |
| `env` | `margin-top: env(--safe-area-inset-top, 0px)` | generic `FunctionValue("env",…)` (CONFIRMED, NOT a throw) | typed `EnvValue{name, fallback}` |
| `system-color` | `color: Canvas` | bare `ValueUnit("Canvas")` via `CSSString` fallback (CONFIRMED) | typed `SystemColor{name:"Canvas"}` |

**RED oracle:** today the gate REDS because every row throws OR returns the
untyped/opaque/mangled shape above. **GREEN condition:** all rows assert the
cured typed shape — requires value.js 0.14.0 + kf re-pin. The gate is authored
NOW (born-RED on today's 0.13.0 tree) so no implementation phase claims green
without it. A `gradient`/`@property`/`attr` row MAY be added in a later matrix
extension tracking value.js O timing (per the wave's Bite table).

---

## §5 — Incremental / streaming parse (W100) — recommendation: **KILL (BOOK a tripwire-only ledger row, do NOT ask value.js O)**

**The measure-first ground truth.**

1. **Span-availability verdict: STRUCTURALLY ABSENT at 0.9.0.** parse-that's
   CORE has full `Span` machinery (`span.ts`: `Span{start,end}`, `spanToString`,
   `mergeSpans`; root exports `stringSpan`/`regexSpan`/`manySpan`…), but the CSS
   AST nodes carry NO `Span`/`loc` (confirmed: `parsers/css/types.ts` has zero
   offset fields). value.js's `StylesheetItem` likewise carries none
   (`stylesheet.ts:43-56`). So incremental-parse models (a) persistent rope tree
   and (b) Span-anchored subtree reuse are UNAVAILABLE without a grammar-wide
   Span retrofit — a cost out of all proportion to any measured need.

2. **The budget calculation says no.** `parseCSSStylesheet` is memoized on input
   identity (`stylesheet.ts:514-519`, `keyFn: input => input`). A live edit
   changing one keyframe stop produces a NEW string → cache miss → full reparse.
   But: K's demo debounce is 300ms; a full reparse of a typical 10-keyframe
   block is sub-millisecond and runs in the editor debounce window, NOT the
   animation critical path (the rAF loop reads precompiled
   `AnimationFrame[].interpVars`, never re-parses). Incremental parse would buy
   nothing on the realistic workload.

3. **The threshold is not real for kf consumers.** The only regime where
   incremental parse could matter is a 500+-keyframe library-stylesheet
   re-parsed on every keystroke — but no kf consumer ingests at that scale on a
   per-keystroke loop, and even there option (c) (chunked re-parse of only the
   changed NAMED `@keyframes` block via a `CSSStyleSheet.replace` / CSSOM
   signal confined to one block) is feasible over the EXISTING
   `parseCSSStylesheet` WITHOUT any Span retrofit — so the expensive options
   (a)/(b) are never justified.

**Recommendation:** KILL the incremental-parse ask for value.js Tranche O.
BOOK a single deferred-ledger row (`docs/tranches/L/audit/deferred-ledger-L.md`)
with a NAMED, MEASURED tripwire: *"author a bench fixture of a 500-keyframe
stylesheet under a per-keystroke re-parse loop; if the full reparse exceeds the
300ms debounce window on the CI Linux runner, RE-OPEN W100 with option (c)
chunked re-parse FIRST (no Span retrofit), and only escalate to a Span retrofit
if (c) is insufficient."* No code, no value.js ask, until that bench reds.
This is the measure-first posture the L charter mandates (`KF-TO-VALUEJS-O §7`
precedent: a budgeted bench gates the claim, not a speculative rewrite).

---

## §6 — Open questions / risks for the coordinated publish

1. **parse-that CSS module is PUBLISHED, not dead-code.** The wave spec's
   Option-B cost note ("the `parsers/css/` module is a published API …
   deletion requires a parse-that major", `L.W10.md:116-121`) is CORRECT and
   live-confirmed (`cssParser`/`parseSingleValue`/`parseFunctionArgs`/
   `specificity` are ROOT exports of `@mkbabb/parse-that`). The Option-B
   recommendation REFINES it: delete only the STRUCTURAL grammar
   (`cssParser`/`CssNode`/selectors); KEEP the value readers (`parseSingleValue`/
   `parseFunctionArgs`) that value.js's §8 `parseCSSSubValue` consumes. The
   parse-that major can lag the value.js O / kf re-pin indefinitely — nothing
   consumes the structural `cssParser` today.

2. **`typesVersions` + CJS hygiene (PT-WAVE-4) is independently live-RED.**
   Confirmed in the installed 0.9.0: `typesVersions` points to the stale
   `dist/src/parse/index.d.ts` (the `exports` map already covers types), and
   the `exports["."].require` ships a `./dist/parse.cjs` CJS artifact in an
   ESM-only spine. Both are `KF-TO-PARSE-THAT-ASKS.md §4` (W91) and should ship
   FIRST as the lowest-risk cut. (Owned by the concurrent parse-that workflow;
   named here only as a publish-sequence dependency.)

3. **The L.W3 ingest-depth dependency.** value.js O's S3 (typed recursive
   `@container`/`@layer` bodies) is the PREREQUISITE substrate for L.W3's
   recursive group-rule walk (W7). kf's `pickKeyframes`/`extractKeyframes`
   (`adapter.ts:145-151`) walks the FLAT `StylesheetItem[]` today; it must be
   extended to recurse into `kind:"container"`/`kind:"layer"` typed bodies. If
   value.js O's S3 slips, L.W3's nested-`@keyframes` arm stays RED — sequence
   L.W10.S3 (value.js) BEFORE L.W3 (kf-side walk).

4. **The two genuine value.js THROWS are user-facing crashes today.** Nesting
   (Baseline-2023) and bare `linear-gradient(red, blue)` (Baseline-stable since
   forever) both CRASH value.js's `parseCSSStylesheet`/`parseCSSValue` right
   now. Any kf consumer feeding such CSS gets a hard parse error, not a
   degraded animation. These should be the FIRST value.js O fixes (highest
   user-impact), and the gate's `nesting`/`structured-gradient` rows assert
   the throw is gone, not merely that the shape is typed.

5. **Replay-equality serializer ownership is settled by Option B** — it lives
   in value.js's `serializeStylesheetItem` (already shipping, already
   round-trips `@property`). No Span retrofit needed at the value.js level;
   Span-level author-fidelity (the parse-that Option-A path) is declared
   OUT OF SCOPE for this spine, which the kf gate predicate
   (`KF-TO-PARSE-THAT-ASKS.md §1.3`) can now assert honestly.

6. **Cross-realm `any` seam survives until §8 lands.** kf's `utils.ts:1` import
   and the `FN_NAME` Symbol restamp (`utils.ts:45-57,294-298`) both depend on
   value.js shipping `parseCSSSubValue` + a preserved `fnName` field. Until
   then `proof:boundary`'s W96 extension stays born-RED. The risk: if value.js
   O ships the grammar fixes but NOT `parseCSSSubValue`, the gap rows green but
   the boundary/acyclic-spine gate stays red — they must ship together.
