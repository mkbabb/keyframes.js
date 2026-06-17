# L.W10 — True-CSS-parity frontier

- **Band:** B · **Class:** research-spike-first, coordinated publish · **Dep:**
  value.js O (0.14.0) + parse-that (coordinated minor) — both gated; no kf code
  until siblings publish
- **Gate (born-RED):** `proof:css-parity` capability matrix — RED today on at
  least six class inputs; GREEN only after the coordinated grammar lands and kf
  re-pins

---

## Context

K answered "can the round-trip exist?" — yes, for the DEFINED SUBSET. L.W1
through L.W3 close the SUBSET's internal breaches (the five replay-equality
holes, the scroll-blind compiler, the ingest gaps). L.W10 asks the orthogonal
question: **what is the CSS surface the subset DOES NOT COVER, and what is the
architectural path to covering it?**

The 36-lane audit (audit-32-skeleton.txt is the 31-lane skeleton file;
completion-lanes-32-36.txt carries lanes 32–36) produced a convergent verdict
across three independent lanes (Lane 19 value.js CSS-grammar coverage, Lane 25
parse-that + value.js CSS grammar parity, Lane 29 CSS-parity grand round-trip)
and 12 HIGH-severity findings (the ★ block in the audit). The finding set is:

| Breach class | Audit ref | Live evidence |
|---|---|---|
| CSS Nesting (`& .child`, bare `&`) — Baseline 2023 | ★ audit:285, viol25 | `value.js/src/parsing/stylesheet.ts:501` — `stylesheetItem = any(atRule, styleRule)` — no nested-rule production; `&` parses as unknown |
| `url-token` mis-tokenized | ★ audit:286 | parse-that `CssValue` type has no `url` variant (`parsers/css/types.d.ts:50-74`); unquoted `url(a/b.png)` shreds into ident/slash/ident |
| Modern at-rules `@container`/`@layer`/`@scope`/`@page` degrade to opaque `CssGenericAtRule` | ★ audit:287 | parse-that `CssNode` union (`types.d.ts:1`): `CssAtContainer`, `CssAtLayer`, `CssAtScope`, `CssAtPage` are ALL absent — falls through to `CssGenericAtRule.prelude: string` |
| `@property` syntax-string opaque | ★ audit:289, CROSS-REPO audit | `value.js/src/parsing/stylesheet.ts:379-407` `buildPropertyItem`: `syntax` field is stored as a raw string, not parsed against the CSS Properties & Values Level 1 grammar (`<syntax>` = `<integer>` | `<color>` | `<length>` | …) |
| Structured gradients — `radial-gradient` head, `conic-gradient` body | ★ audit:219, W109 | `value.js/src/parsing/index.ts:125-208` `handleGradient`: `radial-gradient` / `conic-gradient` bodies parsed opaquely — `at`, shape, size, position keywords emitted as raw tokens; `linear-gradient` direction alone typed |
| `env()` / `attr()` / system-colors fall through to generic `FunctionValue` | ★ audit:223, W107/W108 | `value.js/src/parsing/grammars/css-values.bbnf:82-85` defines `envFn` and `attrFn` grammar rules; the PRODUCTION parser (`index.ts:224-233`) has no `handleEnv`/`handleAttr` arm — both fall through to the generic `Function_` handler, returning an untyped `FunctionValue("env", …)` with no semantic resolution |
| No CSS serializer / format-backward in parse-that's CSS module | ★ audit:288, viol26 | `grep serialize\|toCss` over `bbnf-lang/node_modules/@mkbabb/parse-that/dist/parsers/css/` → zero hits; `CssNode` carries no `Span`/`loc` fields (`types.d.ts` entire file) — structural impossibility |
| Two divergent CSS grammars in the spine (viol25) | ★ audit:284, W97 | parse-that owns `parsers/css/` (structural AST: selectors, `@media`, `@supports`, `@keyframes`); value.js re-implements its own stylesheet+value grammar on parse-that's LOW-LEVEL combinators (`import { any, all, … } from "@mkbabb/parse-that"` — `value.js/src/parsing/stylesheet.ts:8`); kf NEVER reaches parse-that's `parsers/css/` module |

The **architectural root** (viol25, W97) underlies every class above: two CSS
grammars coexist in the constellation spine and neither is complete. The W10
scope is:

1. A **research-spike** that settles the architectural DECISION — which grammar
   is promoted and which is deleted or demoted — before any code is written.
2. The **grammar-gap closure** deliverables that follow, each a concrete
   S-clause, coordinated across value.js O + parse-that + kf re-pin.
3. The **incremental/streaming parse SOTA** research (W100) — a prerequisite
   investigation for whether live-ingest (re-parse-on-edit, document-fragment
   reuse) is structurally achievable over the chosen grammar, before any
   implementation.

The born-RED gate **precedes the cure**: `proof:css-parity` is authored now,
RED on today's tree over six capability-matrix inputs, so no implementation
phase can claim green without passing every row.

### The K substrate L.W10 rides

K shipped:
- value.js 0.13.0 pinned (`^0.13.0`, `package.json:194`): the scroll grammar,
  `sampleColorRamp`, `reverseCSSTime`, `serializeStylesheetItem`, `@property`
  body parser (the `syntax` field is present even though the grammar is opaque)
- parse-that 0.9.0 (`^0.9.0` in value.js, `^0.9.0` direct in kf
  `package.json:194`): `parseSingleValue`/`parseFunctionArgs` exposed at root
  (PT-WAVE-3 §1.5, `typescript/src/parse/parsers/css/index.ts`) — the **produce
  half** with no consume half (`⚠22`)
- kf `src/animation/utils.ts:1` direct `import { any as parseAny } from
  "@mkbabb/parse-that"` — the acyclic-spine debt (`⚠24`, W94) that the
  grammar unification MUST retire

---

## Scope

The research-spike and the S-clauses are ordered: spike FIRST (S0), then the
architectural decision gates S1–S7, then the incremental-parse investigation
(S8) runs in parallel with S1–S7 but does not block them.

### S0 — Architectural decision: unify on ONE CSS grammar (W97, viol25) — RESEARCH SPIKE

**No code is written until S0 produces a written decision record.**

The spine has two grammars:

- **parse-that's `parsers/css/`** — structural (`CssQualifiedRule`,
  `CssAtKeyframes`, `CssAtMedia`, `CssAtSupports`, `CssDeclaration.important`
  typed, `CssGenericAtRule` for unknown at-rules). No serializer. No `Span`/loc.
  No `@container`/`@layer`/`@scope`/`@page`. `CssValue` has no `url` variant.
  `CssNode` union has no nesting production.
- **value.js's `src/parsing/stylesheet.ts`** — keyframes-domain (typed
  `@keyframes`, `@property`, opaque-body `unknownBody` for everything else,
  `parseCSSStylesheet` with full-input-consumption enforcement). No `@container`.
  No recursive nested rules. No `env`/`attr` typed arms. Opaque gradient heads.

Two options:

**Option A — Promote parse-that's `parsers/css/` to the spec-complete CSS5
tokenizer layer that value.js's typed production layer CONSUMES.** parse-that
carries the structural grammar (selectors, specificity, `@media`/`@supports`);
value.js carries the semantic layer (value parsing, `@keyframes` semantics,
`@property` typing). Parse-that `parsers/css/` is EXTENDED to cover the missing
at-rules + url-token + nesting + a serializer; value.js's `stylesheet.ts`
DELEGATES its selector and at-rule tokenization to parse-that. The result: one
structural tokenizer + one semantic layer, acyclic, DRY. Cost: parse-that
`parsers/css/` is a substantial extension surface (add `CssAtContainer`,
`CssAtLayer`, `CssAtScope`, `CssAtPage`; add url variant; add nesting
production; add a serializer that OUTPUTS Span-anchored text); the CSS5
tokenizer spec is 150+ pages. Risk: misaligned ownership — parse-that is a
general combinator lib; a CSS5 tokenizer is a domain product.

**Option B — Delete parse-that's `parsers/css/` and consolidate in value.js.**
value.js's `stylesheet.ts` is already the CONSUMING grammar (it parses the full
animation-relevant CSS surface kf actually uses); parse-that's CSS module has
**zero constellation consumers** (`kf` only reaches `parsers/css/` indirectly
via bbnf-lang, not at runtime). Extend `stylesheet.ts` to cover the gap classes
(nesting, `@container`, url-token, env/attr typed arms, structured gradients).
Add a `serializeStylesheetItem` companion that covers the full parsed surface
(format-backward). The result: ONE grammar in one place, smaller surface, no
serializer design conflict. Cost: a larger value.js surface; the `parsers/css/`
module is a published API (parse-that 0.9.0 exports it) — deletion requires a
parse-that major + a coordinated kf `proof:boundary` extension (W96 — extend
`holdsValueJsSpecifier` to also catch direct `@mkbabb/parse-that` imports in
light modules, since today's `utils.ts:1` import would survive the grammar
unification but the light-boundary gate does not flag it).

**The research-spike decision protocol:**

1. Probe both options against the six gap-class inputs in the born-RED fixture
   set (nesting, url-token, @container, structured gradient, env(), system-color
   sentinel) — assess parse-surface delta for each.
2. Assess the serializer design for each option: can `parse(serialize(ast)) ===
   ast` hold structurally? Option A requires Span-anchored parse-that AST nodes
   (currently absent). Option B requires extending `serializeStylesheetItem` to
   cover the full typed surface.
3. Assess the acyclic-spine impact: does Option A add a new kf→parse-that HEAVY
   static edge? Does Option B shrink the direct kf→parse-that dep to zero
   (retiring `utils.ts:1` import via W94 `parseCSSSubValue` on value.js)?
4. Produce a written decision record (one paragraph, naming the chosen option
   and the three evidence points) as the S0 artifact. No code until the record
   is written and accepted.

**The spike is not blocked on any sibling publish** — it is a reading +
probing exercise over the existing published surfaces.

### S1 — CSS Nesting (Baseline 2023, silently dropped — W98, ★ audit:285)

**Breach.** `value.js/src/parsing/stylesheet.ts:501`:
```
const stylesheetItem: Parser<StylesheetItem> = any(atRule, styleRule).trim(ws);
```
The `styleRule` production (`src/parsing/stylesheet.ts:452-465`) parses
`selectorText` as the raw text up to `{`, then a `declarationList`. There is no
`nestedRule` arm. A nested rule (`& .child { color: red }`) inside a parent
block is consumed by `declarationList` as an unknown declaration, SILENTLY
DROPPED (partial parse succeeds; the `kind:"style"` node has an empty or
malformed declarations list and the nested rule is gone). The full-input
consumption check (`stylesheet:503-510`) is ONLY on the TOP-LEVEL stylesheet
parser, not per-rule — so the inner malformed parse does NOT fail.

**Cure (value.js O, coordinated).** Extend `styleRule` to recognise a
nested-rule production: a `{`-prefixed block following a nested selector is
parsed recursively as a `StylesheetItem`, emitted as a `kind:"nested"` child.
The selector may be `&`, `& .class`, `@media` (nesting-at-rule), etc. Baseline
2023 means real-world CSS already uses this. The cure is PURELY in value.js;
parse-that's CSS module currently has no nesting production either (its
`CssQualifiedRule` has no nested body field), but value.js can implement it on
parse-that's lower-level combinators without waiting for parse-that to ship
structural nesting.

**kf consequence.** The kf ingest path (`ingest-cssom.ts`, `adapter.ts`) does
not consume nested style rules directly — it walks `StylesheetItem[]` for
`kind:"keyframes"` (the primary path). Nested rules inside a parent selector
are currently invisible. Once value.js surfaces them as `kind:"nested"`, kf
ingest IGNORES them (correct behavior — a nested style rule is not a @keyframes
block). The cure is value.js-side; kf gets nesting-aware ingest for free.

### S2 — `url-token` (W98, ★ audit:286)

**Breach.** parse-that's `CssValue` type (`parsers/css/types.d.ts:50-74`) has
no `url` variant. Unquoted `url(a/b.png)` is mis-tokenized: the scanner reads
`url` as an ident, `(` opens a function, `a/b.png` shreds into ident/slash
sequences. The issue is in the TOKENIZER layer (parse-that's `parsers/css/`
scanner, OR value.js's `stylesheet.ts` value grammar depending on the S0
decision).

**Cure (coordinated, depends on S0 decision).** Under Option A: extend
parse-that's CSS scanner to emit a `url-token` terminal; add a `{ type: "url";
value: string }` variant to `CssValue`. Under Option B: extend value.js's
`CSSValues.Value` grammar to match `url(` and parse as a typed `FunctionValue`
or dedicated `UrlValue` node, consuming the quoted-or-unquoted path without
shredding. Either path: replay-equality requires a `url-token` serializer that
outputs the original unquoted form for unquoted inputs.

### S3 — Modern at-rules: `@container` / `@layer` / `@scope` / `@page` (W98, W101/W102, ★ audit:287)

**Breach.** parse-that's `CssNode` union (`types.d.ts:1`): the type set is
`CssQualifiedRule | CssAtMedia | CssAtSupports | CssAtFontFace | CssAtImport |
CssAtKeyframes | CssGenericAtRule | CssCommentNode`. `CssAtContainer`,
`CssAtLayer`, `CssAtScope`, `CssAtPage` are absent — all four degrade to
`CssGenericAtRule` with an OPAQUE `prelude: string`. value.js's `stylesheet.ts`
`atRule` dispatcher (`stylesheet.ts:490-497`) routes only `@keyframes` and
`@property` to typed parsers; every other at-rule falls to `unknownBody` —
opaque body string. This means `@container (min-width: 200px) { .x { … } }` is
parsed as `{ kind: "unknown", atName: "container", prelude: "(min-width: 200px)",
body: "…" }` — the inner rule tree is LOST.

**Cure (coordinated, value.js O + parse-that, depends on S0).** VJ-NEST
(W101): extend `atRule` dispatcher in `stylesheet.ts` to route `@container`,
`@layer`, `@scope`, `@page` to typed parsers with RECURSIVE body parse (the
inner `stylesheetItem.many()` production, reused). VJ-CONTAINER (W102): typed
`@container` condition parse (size queries + `style()` branch). These two are
value.js-only (the combinator core for condition parsing already exists in
parse-that's `parsers/css/media.d.ts` — `MediaQuery`/`MediaFeature` — and the
`@container` condition grammar is structurally parallel). `@layer` and `@scope`
are simpler (named layer, no condition); `@page` has a margin-at-rule body.

**kf consequence.** The ingest path (`adapter.ts`, `ingest-cssom.ts`) currently
looks for `kind:"keyframes"` items inside a flat `Stylesheet`. Once value.js
surfaces nested `@container`/`@layer` typed nodes with a recursive body, kf
must extend its ingest walk to recurse into `kind:"container"` / `kind:"layer"`
bodies for nested `kind:"keyframes"` blocks. This is L.W3's `recursive
group-rule walk` (W7) — **L.W10 is a prerequisite for the full ingest depth**;
L.W3 books the walk; L.W10 provides the substrate.

### S4 — `@property` syntax-string typed (W98, W103, W73, ★ audit:225)

**Breach.** `value.js/src/parsing/stylesheet.ts:379-407` `buildPropertyItem`:
the `syntax` field of a `@property` rule is stored as a raw string, not parsed
against the CSS Properties & Values Level 1 `<syntax>` grammar (`<integer>` |
`<color>` | `<length>` | `<percentage>` | `<number>` | `<angle>` | `<time>` |
`<resolution>` | `<transform-list>` | `<custom-ident>` | `*` | compound
`|`-separated). The `initial-value` is also untyped against the `syntax`. This
means kf's typed-custom-property animation (the `@property`/`inherits`/`initial-value`/`syntax`
round-trip, W75 in L.W1) cannot verify that the interpolation VALUE produced
matches the declared `<syntax>` type.

**Cure (value.js O, VJ-PROPERTY-SYNTAX W103).** Parse `syntax` into a typed
`SyntaxDescriptor` node (a union of `{ type: "keyword"; value: string }` and
`{ type: "component-value-type"; name: string }` and `{ type: "any" }`). Expose
`parseSyntaxString(s: string): SyntaxDescriptor` on the public API. kf's engine
(`engine.ts:1225` `propertyRegistry`) then resolves the registered `--prop` type
at interpolation time against the descriptor — enabling type-directed easing
(`<color>` → oklab, `<angle>` → shortest-arc, etc.).

### S5 — `env()` / `attr()` typed (W107, W98, ★ audit:223)

**Breach.** `value.js/src/parsing/grammars/css-values.bbnf:82-85` declares
`envFn` and `attrFn` as grammar rules. The production parser
(`index.ts:224-233`) has no `handleEnv`/`handleAttr` arm — both fall through to
the generic `Function_` → `FunctionValue("env", …)` path with opaque args and
no semantic resolution. `env(--safe-area-inset-top, 0px)` therefore produces
`FunctionValue("env", [ValueUnit("--safe-area-inset-top", "ident"), ValueUnit("0px",
"px")])` — unresolvable at interpolation time. `attr(data-speed number, 0)`
produces `FunctionValue("attr", …)` with the type-hint unparsed.

**Cure (value.js O, VJ-ENV-ATTR W107).** Add `handleEnv` and `handleAttr` arms
to the `Function_` parser (`index.ts:224`): typed `EnvValue { name: string;
fallback?: ValueUnit }` and `AttrValue { name: string; type?: string; fallback?:
ValueUnit }` node classes. Expose runtime resolution hooks (`resolveEnv(name) =>
ValueUnit`, `resolveAttr(element, name, type) => ValueUnit`) that kf's computed-unit
pipeline can invoke alongside the existing `getComputedValue` DOM probe.

### S6 — System-color sentinels (W108, ★ audit)

**Breach.** `value.js/src/parsing/grammars/css-color.bbnf:110` declares
`systemColor = "Canvas" | "CanvasText" | "LinkText" | ...`. The production color
parser does NOT produce a typed `SystemColor` node — `Canvas` parses as a
named-color `ValueUnit` or falls through to a generic string. kf's oklab
interpolation path cannot distinguish a resolved-at-render-time system color
from a concrete sRGB value, producing wrong interpolation for dark/light mode
transitions.

**Cure (value.js O, VJ-SYSTEM-COLORS W108).** Add `SystemColor { name: string
}` as a deferred-VJ-3-pattern node: not resolved at parse time (the value is
UA-dependent), surfaced as a typed sentinel. kf's interpolation pipeline treats
`SystemColor` as a computed unit — calls `getComputedStyle` to resolve the
concrete `rgb(…)` value at first frame, then caches the resolved color against
`layoutEpoch` (same pattern as `cqw`/`var()`).

### S7 — Structured gradients: `radial-gradient` / `conic-gradient` full head (W109, ★ audit:219)

**Breach.** `value.js/src/parsing/index.ts:125-208` `handleGradient`:
`radial-gradient` head grammar (`ellipse/circle`, `at <position>`, `<size>`)
and `conic-gradient` head grammar (`from <angle>`, `at <position>`) are parsed
opaquely — `at`, shape, size, and position keywords are emitted as raw tokens or
THROW `t is not iterable` on a bare `linear-gradient(red, blue)` (audit
CROSS-REPO finding: `src/parsing/index.ts:188-205`). Only
`linear-gradient` direction typing is complete.

**Cure (value.js O, VJ-GRADIENT-FULL W109).** Complete `handleGradient` to
produce typed `GradientHead` nodes for all three gradient types. This is a
large, largely mechanical grammar extension; it is a **candidate for its own
value.js tranche wave**. kf's interpolation path already handles gradient stops
via `flattenObject`; the head is currently OPAQUE and cannot be interpolated
between two gradients whose heads differ (e.g. `ellipse at center` vs `circle at
top`). A typed head enables gradient-morph animations.

### S8 — Incremental / streaming parse SOTA research (W100) — PARALLEL

**No code.** A research-and-challenge wave running in PARALLEL with S1–S7:

**Question.** parse-that's mutable-state `ParserState` is designed for
single-pass descent (`src/state.ts` — zero-alloc mutable cursor). An
incremental parser (re-parse only the CHANGED tokens on edit, reuse the
unchanged subtree) requires either (a) a persistent/immutable rope tree
(tree-sitter model), (b) a positioned-input protocol with Span-anchored AST
nodes so unchanged spans are identified by offset, or (c) a document-fragment
chunking discipline (re-parse only the `@keyframes` block whose character range
changed). parse-that's AST nodes carry NO `Span`/`loc` fields
(`parsers/css/types.d.ts` — confirmed, the full type file was read). This makes
(a) and (b) structurally unavailable at 0.9.0. Option (c) — chunked re-parse of
changed `@keyframes` blocks — is feasible over the existing `parseCSSStylesheet`
if the CSSOM `MutationObserver` / `CSSStyleSheet.replace` signal is confined to
a NAMED keyframe block.

**Challenge.** Is there a REAL workload where incremental parse buys a
measurable win over a full re-parse? `parseCSSStylesheet` is memoized on input
identity (`memoize({ keyFn: (s) => s })`). A live-edit scenario that changes ONE
keyframe stop produces a new string → cache miss → full reparse. The question is
whether the reparse time is in the animation critical path or in the editor
debounce window. K's demo shows re-parse on every editor keystroke: the
debounce is 300ms; the full reparse is < 1ms for a typical 10-keyframe block.
The BUDGET question: is there a document-size threshold (e.g. 500-keyframe
library-stylesheet) where incremental parse becomes necessary, and is that
threshold real for kf consumers?

**Deliverable.** A one-page written research note (the S8 artifact, not a wave):
the threshold calculation, the Span-availability verdict, and a go/no-go
recommendation for whether incremental parse is a value.js O ask or a BOOK for
a later tranche.

---

## Born-RED gate

**Gate name:** `proof:css-parity`

**Location:** `scripts/proof-css-parity.mjs` (NEW — does not exist today)

**Witness inputs** (the gate runs all six; RED if any row fails):

| Row | Input | Expected | Today's result |
|-----|-------|----------|----------------|
| `nesting` | `.card { color: red; & .inner { color: blue } }` | `kind:"nested"` item in declarations | SILENTLY DROPS inner rule — output has 1 declaration, not 2 |
| `url-token` | `.x { background: url(img/hero.png) }` | typed `url` value preserving `img/hero.png` | shreds to `ident("img")/slash/ident("hero")/ident("png")` |
| `at-container` | `@container sidebar (min-width: 300px) { .x { color: red } }` | typed `kind:"container"` item with parsed condition + recursive body | `kind:"unknown"`, opaque prelude string, body string |
| `structured-gradient` | `radial-gradient(circle at center, red, blue)` | typed head with `shape:"circle"`, `position: center` | THROWS or returns opaque token list |
| `env` | `margin-top: env(--safe-area-inset-top, 0px)` | typed `EnvValue { name:"--safe-area-inset-top", fallback: 0px }` | `FunctionValue("env", [ident, ValueUnit])` — untyped fallback |
| `system-color` | `color: Canvas` | typed `SystemColor { name: "Canvas" }` | falls through to named-color or generic string |

**RED oracle:** the gate script calls `parseCSSStylesheet` (value.js) or
`parseRule` (parse-that) on each row and asserts the expected typed shape.
Every row FAILS on today's 0.13.0 tree → gate RED on today's tree (confirmed:
`nesting` confirmed via `stylesheet.ts:501` production set; others confirmed via
the audit CROSS-REPO probes). The gate CANNOT be faked by a source-shape grep;
it must INVOKE the REAL parser and assert the output node type.

**GREEN condition:** all six rows pass. This requires a coordinated value.js O
(0.14.0+) publish AND a kf re-pin to `^0.14.0`.

**Sibling publish gate protocol (inv-L-acyclic-purity).** kf does NOT patch
value.js behavior at the consume seam. The cure lives entirely in value.js O.
The gate stays RED in kf CI until the re-pin lands. A BOOK row is created in
`PROGRESS.md` for each S-clause with a named tripwire: "value.js ≥0.14.0
published on npm" — the CI run that first installs 0.14.0 will fire the
tripwire. No workaround, no `file:` pin, no `overrides` block.

---

## Deps

| Dep | Version | Status |
|-----|---------|--------|
| value.js O | 0.14.0 (S1–S7 grammar extensions) | NOT YET published — value.js currently at 0.13.0 (`^0.13.0` in `package.json:194`) |
| parse-that | coordinated minor (S2 url-token under Option A; S0 spike settles) | NOT YET published — parse-that at 0.9.0 |
| kf `proof:boundary` W96 | extend `holdsValueJsSpecifier` to catch direct `@mkbabb/parse-that` imports in LIGHT modules | kf-owned, no sibling dep — lands as part of the W94 `parseCSSSubValue` consume-edge (L.W9) |

**DAG within L.W10:** S0 (spike, no code) → S1–S7 (value.js O deliverables,
coordinated) ∥ S8 (research, parallel) → kf re-pin → `proof:css-parity` GREEN.
S3 (at-rules with recursive body) is a **prerequisite subtrate for the full L.W3
ingest depth** (the recursive group-rule walk, W7) — L.W10.S3 and L.W3 are
sequenced: L.W10.S3 lands in value.js O first; L.W3's recursive-walk kf-side
cure consumes it.

---

## Bite (what regression each clause gate catches)

| S-clause | Regression gate catches |
|----------|------------------------|
| S0 (architectural decision) | Prevents acyclic-spine violation: kf continues to carry `import { any } from "@mkbabb/parse-that"` (`utils.ts:1`, ⚠24) if the grammar is NOT unified — the gate's GREEN condition requires the parse-that dep to be eliminated via W94 `parseCSSSubValue` on value.js, else `proof:boundary` W96 extension would RED |
| S1 (nesting) | `proof:css-parity` nesting row — re-ingesting a real-world stylesheet that uses `& .child` no longer silently drops nested rules |
| S2 (url-token) | `proof:css-parity` url-token row — `background: url(…)` values survive the parse→animate→format round-trip without shredding into ident sequences |
| S3 (@container/@layer) | `proof:css-parity` at-container row + L.W3 ingest walk — a `@keyframes` rule nested inside a `@container` block is reachable by `fromStyleSheets()` ingest |
| S4 (@property typed) | `proof:replay-equality` @property row (L.W1 S2) gets deeper: the `syntax` descriptor types the interpolation, not just the re-emit; a `<color>` custom property animates via oklab, not raw string lerp |
| S5 (env/attr typed) | `proof:css-parity` env row — `env(--safe-area-inset-top, 0px)` in a keyframe stop is resolved at runtime, not passed through as an opaque FunctionValue that degrades to a string lerp |
| S6 (system-colors) | `proof:css-parity` system-color row — `color: Canvas` in a keyframe stop is resolved at computed-unit time, not silently interpolated as a literal ident |
| S7 (structured gradients) | `proof:css-parity` gradient row (gated in a future extension of the matrix, value.js O timing) — `radial-gradient(circle at center, …)` animates with a typed head, not an opaque blob |
| S8 (incremental parse research) | No regression gate — the artifact is a go/no-go recommendation; a BOOK row if deferred |
