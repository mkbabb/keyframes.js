# Lane 24 — W10 True-CSS-Parity Frontier: Tranche M Audit

**Lane:** 24 · **Tranche:** M (seed audit) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `529fcfd` / `4b3d2eb`)
**Subject:** CSS-parity gap matrix, two-grammar architecture, Option B verdict, W100 kill,
`proof:css-parity` gate design, M-wave proposals for value.js-O + parse-that coordination
**Gate status:** `proof:css-parity` — ABSENT from tree (`scripts/proof-css-parity.mjs` does not
exist; not in `package.json`). The born-RED gate is the DECLARED frontier, honestly un-authored.

---

## §0 — Verdict summary

The W10 CSS-parity spike (`docs/tranches/L/audit/W10-css-parity-spike.md`) is the most rigorously
self-corrected doc in the L corpus: it adversarially re-probed every row the 36-lane audit claimed,
found systematic mis-attribution (parse-that behaviours wrongly attributed to value.js), and
corrected the failure modes row-by-row against the installed 0.13.0 tree. That document is the
charter-binding architectural record for M.

This lane re-runs the live probes, verifies the spike's corrections against ground truth, and
translates the findings into M-wave candidates and precept findings. The W100 kill is re-affirmed.

| Finding | Severity | Disposition |
|---------|----------|-------------|
| Two genuine value.js hard-crashes (nesting + bare `linear-gradient`) | HIGH | M-Wave M.W(valuejs-O) Band B, already tripwired |
| Two-grammar redundancy — value.js has the weaker structural shell | HIGH (arch) | Option B verdict: consolidate in value.js; M COORDINATES this |
| `proof:css-parity` gate unwritten | HIGH | M Band A gate-first work; born-RED design confirmed |
| kf direct parse-that dep + FN_NAME workarounds PENDING (5 arms) | HIGH | Already tripwired; M opens on sibling publish |
| radial/conic head corruption (parses-and-mangles, not throw) | MEDIUM | M-Wave value.js-O §13 |
| env()/attr()/system-color untyped (faithful round-trip, wrong shape) | MEDIUM | M-Wave value.js-O §5/§6 |
| W100 incremental parse | — | KILL confirmed; bench tripwire books the re-open condition |

---

## §1 — The gap matrix: live re-verification against ground truth

Every row re-probed against value.js `0.13.0` (installed at
`node_modules/@mkbabb/value.js/dist/value.js`) and parse-that `0.9.0`
(`node_modules/@mkbabb/parse-that/dist/parse.js`). Probe session: 2026-06-17.

**The L.W1 lesson applied here.** The spike (`W10-css-parity-spike.md §1.1`) found the 36-lane
audit had probed `cssParser.parse(...)` (parse-that) for nesting/url/at-rule rows, then the L.W10
wave-spec witness-table (`L.W10.md:341-347`) re-attributed those parse-that behaviours to value.js.
This lane independently re-ran each probe on BOTH grammars and records both results.

### Row 1 — CSS Nesting `.card{color:red; & .inner{color:blue}}`

**Live probe:**
```
parseCSSStylesheet('.card{color:red; & .inner{color:blue}}')
  → THROW: "Parse error at offset 17: ...or:red; & .inner..."
```
value.js `stylesheet.ts:503-510` enforces full-input consumption at the top level; the `&` at
offset 17 is not in the `any(atRule, styleRule)` production set (`stylesheet.ts:501`), so the
WHOLE parse aborts.

parse-that `cssParser` (run via `cp.parser(new ParserState(...))`) returns a single qualified rule
`.card` with **1 declaration** (`color:red` only) — the `& .inner` rule is silently gone from
`declarations`. Confirmed: `declarations.length === 1`, `declarations[0].property === "color"`.

**Spike verdict: CONFIRMED (row 1 THROW, not silent drop)** — this is the spike's key correction
over the L.W10 wave spec witness table. kf's visible behaviour is the value.js THROW, not
parse-that's silent drop.

**M severity: HIGH.** Baseline-2023 CSS. Any kf consumer feeding a stylesheet with CSS nesting
gets a hard `Parse error` today — not a degraded animation, a crash.

### Row 2 — url-token `url(img/hero.png)` (unquoted)

**Live probe:**
```
parseCSSValue('url(img/hero.png)')
  → OK: FunctionValue("url", …), .toString() === "url(img/hero.png)"
```
value.js returns an opaque-but-WHOLE `FunctionValue` via the generic `handleFunc()` arm
(`index.ts:230`). The round-trip is faithful (the toString reproduces the original). NOT shredded.

parse-that's `cssParser` on `.x{background:url(img/hero.png)}` would shred the url args (the
spike confirmed: `function url [ident img, slash, ident hero, ident png]`); but kf NEVER reaches
parse-that's CSS module — kf calls `parseCSSStylesheet`, not `cssParser`.

**Spike verdict: CONFIRMED (mode correction)** — value.js returns opaque-whole, not shredded.
The url-token gap is real (no typed `UrlValue` node, no unquoted-vs-quoted distinction) but the
kf-visible failure mode is "untyped FunctionValue", not "shred". The gate predicate must assert
the CURED shape (a typed url node) not the absence of shredding.

**M severity: MEDIUM.** Functionally tolerable today (the round-trip is string-faithful) but
breaks gradient-with-url replay-equality and prevents a semantic `UrlValue` animation primitive.

### Row 3 — `@container sidebar (min-width:300px){.x{color:red}}`

**Live probe:**
```
parseCSSStylesheet('@container sidebar (min-width:300px){.x{color:red}}')
  → OK: [{kind:"unknown", atName:"container", prelude:"sidebar (min-width:300px)", body:".x{color:red}"}]
  (body is typeof string)
```
Confirmed: `kind === "unknown"`, body is an UNPARSED STRING.

**Important L.W3 distinction.** The L.W3 ingest-deepening recursive walk (`proof:ingest-replay`
nested-walk arm GREEN) operates on the CSSOM LIVE path (`ingest-cssom.ts` — walking
`CSSGroupingRule.cssRules` recursively). That walk handles `@media`/`@supports`/`@layer`/
`@container` in live stylesheets because the BROWSER already parsed them into typed
`CSSGroupingRule` nodes. The static string-parse path (`adapter.ts:145-146 pickKeyframes` →
`extractKeyframes`) walks a FLAT `StylesheetItem[]` from value.js and sees only top-level items —
it CANNOT recurse into an opaque string body. So:

- Live ingest (`fromStyleSheets`/`adoptRunning`): nested `@keyframes` inside `@media`/`@layer`/
  `@container` are already reachable via L.W3's CSSOM walk (GREEN).
- Static string ingest (`fromString` → `resolveKeyframes` → `adapter.ts`): nested `@keyframes`
  inside `@container`/`@layer` in a CSS STRING are STILL invisible — blocked on value.js O S3
  typed recursive bodies.

The gap is specifically in the string-parse path. The CSSOM path is already fixed.

parse-that's `genericAtRule` would recurse the body into typed `CssNode[]` (W10 spike row 3
confirmed); but kf doesn't reach parse-that's CSS module.

**M severity: HIGH.** Every modern animation-in-context stylesheet uses `@container`/`@layer`.
kf's ingest is blind to nested `@keyframes`.

### Row 4 — `@layer base{.x{color:red}}`

**Live probe:**
```
parseCSSStylesheet('@layer base{.x{color:red}}')
  → OK: [{kind:"unknown", atName:"layer", prelude:"base", body:".x{color:red}"}]
```
Same opaque-string body pattern as `@container`. The L.W3 ingest-deepening recursive walk (already
shipped, `proof:ingest-replay` GREEN) walks typed recursive bodies — but the bodies are STRINGS
today, not typed, so the walk cannot help until value.js O ships typed recursive at-rule bodies.

**M severity: HIGH** (same as `@container`).

### Row 5 — bare `linear-gradient(red, blue)`

**Live probe:**
```
parseCSSValue('linear-gradient(red, blue)')   → THROW: "t is not iterable"
parseCSSValue('linear-gradient(90deg, red, blue)') → OK (with explicit direction)
```
The `.opt()` arm at `value.js/src/parsing/index.ts:188-205` has a bug on the direction-optional
path. Confirmed crash at 0.13.0. Any kf consumer animating a background with a bare
`linear-gradient` gets a hard `TypeError`.

**M severity: HIGH.** `linear-gradient(red, blue)` is Baseline-stable since forever. This is
the most user-facing crash of the two genuine hard-crashes.

### Row 6 — `radial-gradient(circle at center, red, blue)`

**Live probe:**
```
parseCSSValue('radial-gradient(circle at center, red, blue)')
  → OK: .toString() === "radial-gradient(circle, at, center, rgb(255 0 0), rgb(0 0 255))"
```
The head is MANGLED: `circle`, `at`, `center` shredded into raw comma-joined idents. NOT a
throw — a parse-and-corrupt. The gradient animates, but the head structure is lost, so
gradient-morph (animating between two radial gradients with different heads) is impossible.

**M severity: MEDIUM.** Silent corruption on the forward leg — invisible to kf's compile-side
refusal gates.

### Row 7 — `conic-gradient(from 90deg at center, red, blue)`

**Live probe:**
```
parseCSSValue('conic-gradient(from 90deg at center, red, blue)')
  → OK: .toString() === "conic-gradient(0%, 90deg, at, center, rgb(255 0 0), rgb(0 0 255))"
```
The `from 90deg` partially survives but the output has a spurious `0%` prepended. The `at center`
position is NOT preserved faithfully. The spike noted `at center` was SILENTLY DROPPED; the
live-probe shows it is present but CORRUPTED (the `at` and `center` become raw idents, and `0%`
appears — likely a partial mis-parse of `from`). Either way: parse-and-corrupt, not a throw.

**M severity: MEDIUM** (same class as row 6).

### Row 8 — `env(--safe-area-inset-top, 0px)`

**Live probe:**
```
parseCSSValue('env(--safe-area-inset-top, 0px)')
  → OK: FunctionValue("env", [ValueUnit("--safe-area-inset-top", "ident"), ValueUnit("0px", "px")])
  .toString() === "env(--safe-area-inset-top, 0px)"
```
NOT a throw (the spike corrected this from an earlier audit interpretation). Parses faithfully to
a generic `FunctionValue`. The fallback `0px` is present in args but NOT semantically separated
as `{ name, fallback }`. The `.bbnf` grammar declares `envFn` (`css-values.bbnf:82`) but the live
parser has no `handleEnv` arm (`index.ts:224` — generic `Function_` fallthrough).

**M severity: MEDIUM.** kf cannot distinguish `env()` from any other unknown function at
interpolation time. The fallback is present-but-untyped.

### Row 9 — `attr(data-speed number, 0)`

Same pattern as `env()`: `FunctionValue("attr", …)`, faithful round-trip, type-hint `number`
not separated. `.bbnf` declares `attrFn` (`css-values.bbnf:85`) but no `handleAttr` arm.

**M severity: LOW** (uncommon in animation CSS).

### Row 10 — `color: Canvas`

**Live probe:**
```
parseCSSValue('Canvas')
  → OK: ValueUnit with {value:"Canvas", unit:undefined, ...} — constructor name matches ValueUnit
parseCSSColor('Canvas') → THROW: "Parse error at offset 0"
```
`Canvas` (a CSS system color) falls through to the `CSSString` fallback (`index.ts:222,235`),
returning a bare `ValueUnit` string. If kf tries to interpolate `Canvas → red` in oklab, the
system color is treated as a literal ident, producing a wrong or thrown interpolation.

**M severity: LOW-MEDIUM.** Rare in animation CSS; system colors matter for dark-mode
transitions.

### Summary table (ground-truth verified)

| Row | Input | value.js 0.13.0 actual behaviour | Severity | L.W10 spike correct? |
|-----|-------|----------------------------------|----------|----------------------|
| 1 | CSS Nesting `&` | THROW `Parse error at offset 17` | HIGH | YES — corrects wave-spec "silent drop" |
| 2 | url-token unquoted | opaque-whole `FunctionValue("url",…)` | MEDIUM | YES — corrects "shred" attribution |
| 3 | `@container` | `kind:"unknown"`, opaque STRING body | HIGH | YES |
| 4 | `@layer`/`@scope`/`@page` | same opaque-string pattern | HIGH | YES |
| 5 | bare `linear-gradient(red,blue)` | THROW `t is not iterable` | HIGH | YES |
| 6 | `radial-gradient` head | parses-but-MANGLES (`circle,at,center` as raw idents) | MEDIUM | YES (refined: corrupt not opaque) |
| 7 | `conic-gradient` head | parses-but-CORRUPTS (spurious `0%`, `at` position mangled) | MEDIUM | PARTIAL — spike said "at center SILENTLY DROPPED"; live probe shows corruption not drop, but class is the same |
| 8 | `env()` | `FunctionValue("env",…)` faithful round-trip, untyped | MEDIUM | YES — corrects earlier "throw" mis-read |
| 9 | `attr()` | same as env() | LOW | YES |
| 10 | `Canvas` system-color | `ValueUnit` string fallback (parseCSSColor THROWS) | LOW-MEDIUM | YES |

**Two genuine hard-crashes on Baseline CSS:** rows 1 and 5. Everything else is a typed-shape
gap or a corruption on the forward leg — serious but non-crashing.

---

## §2 — The two-grammar architecture: ground-truth verdict

### §2.1 What the two grammars actually are (verified against installed 0.9.0 and 0.13.0)

**parse-that `parsers/css/`:** exported at the package root as `cssParser`,
`parseSingleValue`, `parseFunctionArgs`, `specificity` (confirmed: all are
top-level exports of `@mkbabb/parse-that`). NOT dead-code — a published root API.
Structural grammar: typed `@media`/`@supports`, `CssAtKeyframes`, specificity,
`CssDeclaration.important`, recursive `genericAtRule` body. Gaps: no
`@container`/`@layer`/`@scope`/`@page` typed nodes, no nesting production,
no `url` `CssValue` variant, no serializer, no `Span`/`loc` on any AST node.
Deletion is a parse-that MAJOR bump.

**value.js `src/parsing/`:** built on parse-that's low-level combinators (`all`,
`any`, `regex`, `string`, `whitespace` — imported at `stylesheet.ts:1-8` and
`index.ts:1`). NEVER imports parse-that's CSS module. Provides typed `@keyframes`
(the full animation-domain grammar), typed `@property`, typed VALUE grammar
(transforms/colors/calc/linear-gradient-with-direction), and a block serializer
(`serializeStylesheetItem`/`serializeStylesheet`). Gaps: no CSS nesting, opaque
at-rule bodies, untyped env/attr/system-color, gradient head corruption.

**kf:** imports `parseCSSStylesheet` and related APIs from `@mkbabb/value.js`
(`adapter.ts:1-11`). ALSO imports `any` directly from `@mkbabb/parse-that`
(`utils.ts:1`) — the ⚠24 seam that violates `inv-L-acyclic-purity`. The direct
parse-that dep is confirmed PRESENT and PENDING deletion (verified by
`proof-workaround-deletion.mjs` run 2026-06-17: arm S9 PENDING, workaround at
`utils.ts:1`, `@mkbabb/value.js@0.14.0` NOT published E404).

### §2.2 The Option B verdict: confirmed correct

The spike's three-point evidence for Option B (W10-css-parity-spike.md §3.2):

1. **Parse-surface delta favours B.** Every gap class (nesting, url,
   @container, structured-gradient, env, system-color) is a VALUE-or-`@keyframes`
   domain extension that value.js's grammar is the natural home for. value.js
   already has `handleGradient`, `handleFunc`, `Function_`, the recursive
   `keyframeRule.many()` machinery. Promoting parse-that (Option A) would impose
   CSS5 tokenizer responsibility on a GENERAL combinator library.

2. **Serializer/replay design favours B.** value.js ALREADY ships
   `serializeStylesheetItem`/`serializeStylesheet`/`serializeDeclaration` (root
   exports, live-confirmed). Extending them to the new typed nodes is incremental.
   Option A requires a NET-NEW Span-anchored serializer in parse-that PLUS Span
   threading through value.js's typed layer.

3. **Acyclic-spine impact favours B decisively.** Option B is the ONLY path that
   retires kf's ⚠24 direct parse-that dep: value.js ships `parseCSSSubValue`
   (composing `parseSingleValue`/`parseFunctionArgs`), kf deletes `utils.ts:1`'s
   `import { any }` + the `@mkbabb/parse-that` dep, and `proof:boundary` (W96)
   asserts zero parse-that imports in `src/`. Option A keeps parse-that's CSS
   module a first-class structural grammar and does NOT retire the direct dep.

**The Option B nuance (important for M).** Option B deletes parse-that's
STRUCTURAL grammar (`cssParser`/`CssNode`/`CssSelector`/`parseSelectorList`) but
KEEPS the value readers (`parseSingleValue`/`parseFunctionArgs`) that value.js's
`parseCSSSubValue` will consume (the §8 ask). The structural deletion is a
parse-that MAJOR that can LAG the value.js O / kf re-pin indefinitely — nothing
consumes `cssParser` today, so the lag has zero user impact.

### §2.3 Precept violations the two-grammar architecture creates

**Violation: KISS / no-redundant-grammar (P-precept / inv-ε-aligned).** Two
structural CSS grammars in the spine, the weaker one consumed. The structural
work is done twice: parse-that's `parseSelectorList`/`parseMediaQueryList` AND
value.js's hand-rolled `selectorListText`/`balancedText`; value.js's copy is
weaker (opaque bodies, no media typing). (`W10-css-parity-spike.md §2.2`)

**Violation: inv-L-acyclic-purity.** kf has a direct production dependency on
`@mkbabb/parse-that` (`package.json`) solely for the `any` combinator at
`utils.ts:1`. This is a consumer-side workaround for a missing value.js API
(`parseCSSSubValue`). `proof-workaround-deletion.mjs` arm S9 confirms this is
PRESENT + PENDING (not yet deletable — waiting for value.js 0.14.0).
(`src/animation/utils.ts:1`; `KF-TO-VALUEJS-O-ASKS.md §8`)

**Violation: no-workaround / no-consumer-side-sibling-patch (the FN_NAME stamp).** kf
stamps a `FN_NAME` Symbol onto value.js `ValueUnit` instances (`utils.ts:45-57`)
and RE-STAMPS on every `.clone()` (`utils.ts:294-298`) because `ValueUnit.clone()`
drops the stamp. This is writing state onto a class kf does not own. arm S8
confirms PRESENT + PENDING. (`src/animation/utils.ts:45-55`)

**Violation: no-workaround (the `linear()` regex).** `utils.ts:119` defines
`LINEAR_PAREN_PREFIX` and `utils.ts:185-193` normalizes value.js's flat `linear()`
comma list back to the canonical space-joined form — a consumer-side correction
of a sibling serialize bug (VJ-L2). arm S7 confirms PRESENT + PENDING.
(`src/animation/utils.ts:119,185-193`)

---

## §3 — The `proof:css-parity` gate design: M's born-RED obligation

### §3.1 Current state

`scripts/proof-css-parity.mjs` does NOT exist (confirmed: `ls scripts/ | grep
css-parity` → empty). Not in `package.json` scripts. The gate is a DECLARED
DESIGN-ONLY frontier at L's close — "the gate CANNOT be faked by a grep; it must
INVOKE the REAL installed parser" (`W10-css-parity-spike.md §4`).

### §3.2 The gate must assert value.js's REAL behaviour (not the mis-attributed parse-that shapes)

The spike's key design correction: the gate asserts value.js's REAL failure modes (§1 above), NOT
the wave-spec witness table's parse-that attributions:

| Row | Born-RED reason (what value.js ACTUALLY does today) | GREEN condition (value.js O cure) |
|-----|-----------------------------------------------------|-----------------------------------|
| `nesting` | THROWS `Parse error at offset 17` (not "silent drop") | parse succeeds; a `kind:"nested"` child item carries the inner declarations |
| `url-token` | opaque-whole `FunctionValue("url",…)` (not shredded — shred is parse-that's) | a typed `UrlValue` node preserving the literal path, replay-equal |
| `at-container` | `kind:"unknown"`, opaque STRING body (confirmed) | `kind:"container"` with parsed condition + RECURSIVE typed body |
| `at-layer` | `kind:"unknown"`, opaque string body | `kind:"layer"` typed, recursive body |
| `bare-linear-gradient` | THROWS `t is not iterable` | no throw; direction defaults to `to bottom`; typed FunctionValue |
| `radial-gradient` | parses-and-MANGLES head (circle/at/center as raw comma-idents) | typed head with `shape`, `position`; replay-equal |
| `env` | `FunctionValue("env",…)` faithful string, untyped | typed `EnvValue{name, fallback}` |
| `system-color` | `ValueUnit` string fallback; `parseCSSColor` THROWS | typed `SystemColor{name}` |

**Gate design requirements:**
- Each row INVOKES `parseCSSStylesheet` or `parseCSSValue` (the INSTALLED value.js, never a
  source grep or a mock).
- The nesting row asserts `parse SUCCEEDS` (no throw) AND the resulting AST contains a
  `kind:"nested"` item — two distinct assertions, both required.
- The bare-linear-gradient row asserts NO `TypeError` is thrown AND the result has a valid
  `FunctionValue` shape.
- All other rows assert the TYPED shape, not merely the absence of a throw.
- Modeled on `proof-deps-current.mjs`: each clause is a real invocation with a typed-shape
  assertion. Cannot be gamed by a source diff.

### §3.3 The gate's two-phase structure for M

Phase 1 (M Band A — author the gate, born-RED against 0.13.0):
- Author `scripts/proof-css-parity.mjs` with the full row set above.
- Add `"proof:css-parity": "node scripts/proof-css-parity.mjs"` to `package.json`.
- Wire into the `proof:all` report-all roster (NOT the blocking hygiene chain — this gate
  STAYS RED until value.js O publishes; it must never block CI on a GREEN tree).
- Confirm exit 1 on the 0.13.0 tree for each row.

Phase 2 (M Band B — consume value.js O 0.14.0):
- Re-pin `@mkbabb/value.js: ^0.13.0 → ^0.14.0`.
- Delete `utils.ts:1` `import { any } from "@mkbabb/parse-that"` and the dep from `package.json`.
- Confirm `proof:css-parity` GREEN for all rows.
- Confirm `proof:boundary` (W96) GREEN with zero parse-that imports.
- Confirm `proof-workaround-deletion.mjs` arms S7/S8/S9 GREEN (regex, FN_NAME, parse-that dep).

---

## §4 — M-wave proposals

### M.W(css-parity-gate) — Band A: author `proof:css-parity` born-RED

**What:** Author `scripts/proof-css-parity.mjs` exactly as designed in §3.2 above. The gate
exercises every row against the installed value.js 0.13.0 and asserts exit 1 for each failing
row. Wire into `proof:all` report-all lane.

**Why M Band A (kf-internal, no sibling publish needed):** authoring a gate against known-broken
behaviour is kf's obligation. The gate must be WRITTEN before any value.js O consume can claim
green — that is the gate-first law the L charter established. Absence of the gate while the
frontier is open violates inv-L-totality's spirit (the un-gated breach class) and the
gate-apparatus precept (gates must be runtime-invocations, not source-shape).

**Precept:** gate-first law (L.md §wave map), no-gate-without-oracle (gate-apparatus-VERDICT.md).
**DAG:** M Band A; no sibling gate needed; LEADS the Band B consume.
**Born-RED oracle:** `node scripts/proof-css-parity.mjs` → exit 1 on each of the 8 rows in §3.2,
on today's 0.13.0 tree.

### M.W(valuejs-O) — Band B: coordinate value.js Tranche O grammar totality + consume

**What:** The coordinated value.js O + kf re-pin sequence from the spike (§3.3):

```
value.js Tranche O (0.14.0):
  · §9  nesting: nestedRule production in styleRule (CURES THE THROW)
  · §13 gradient: bare-linear-gradient .opt() crash fix + typed radial/conic head
  · §3  @container/@layer typed recursive bodies (L.W3 ingest substrate)
  · §2  url-token: typed UrlValue arm in Function_/Value
  · §5  env()/attr(): handleEnv/handleAttr arms in Function_
  · §6  system-color: SystemColor{name} in the color parser
  · §8  parseCSSSubValue/parseCSSValueOrArgs (enables kf dep deletion)
  [§1/§4/§7 VJ.L1-L8 perf are value.js-O companions tracked in lane-07/lane-19]

kf re-pin commit (single atomic):
  · @mkbabb/value.js ^0.13.0 → ^0.14.0
  · DELETE utils.ts:1 import { any } from "@mkbabb/parse-that"
  · DELETE @mkbabb/parse-that from package.json
  · CALL parseCSSSubValue (value.js API) instead of the any combinator seam
  · proof:css-parity GREEN
  · proof:boundary (W96) GREEN
  · proof-workaround-deletion arms S7/S8/S9 GREEN

L.W3 ingest walk extension (coordinated with value.js §3):
  · adapter.ts pickKeyframes / extractKeyframes must recurse into kind:"container"
    and kind:"layer" typed bodies once value.js O provides them — today the walk
    is flat (adapter.ts:145-146 extractKeyframes returns only top-level @keyframes)
  · proof:ingest-replay nested-at-rule arm GREEN (already born-RED per L.W3)
```

**Tripwire:** `@mkbabb/value.js@0.14.0` published on npm (currently E404, confirmed by
`proof-workaround-deletion.mjs` 2026-06-17). The kf re-pin commit is born-RED-gated; it cannot
land until the tripwire fires.

**No `file:` pin, no `overrides`, no vendored grammar.** `inv-L-acyclic-purity` and the
constellation spine law (`CLAUDE.md §Dependencies`) are absolute.

**Precept:** inv-L-acyclic-purity, no-workaround, KISS.
**DAG:** M Band B; gates on value.js O 0.14.0 publish; LEADS proof:css-parity GREEN.

### M.W(parse-that-structural) — Band B: the parse-that MAJOR (can lag)

**What:** parse-that ships a MAJOR that deletes the structural CSS grammar
(`cssParser`/`CssNode`/`CssSelector`/`parseSelectorList`/`parseMediaQueryList`/
`CssAtMedia`/`CssAtSupports`/`CssAtKeyframes` etc.) while RETAINING the value
readers (`parseSingleValue`/`parseFunctionArgs`). This is a parse-that MAJOR
because `cssParser` is a published root export (`@mkbabb/parse-that` top-level,
confirmed in 0.9.0 exports). Value readers stay because value.js's O §8
`parseCSSSubValue` consumes them.

**Can lag indefinitely.** Nothing in the constellation CONSUMES `cssParser` at
runtime today (kf reaches parse-that only via `utils.ts:1`'s `any` combinator,
not via `cssParser`). The MAJOR can ship after value.js O + kf re-pin complete
without breaking anything. The grammar redundancy is the design violation; the
deletion is the cleanup.

**kf-side gate:** `proof:boundary` (W96 extension) stays GREEN after the deletion
(it already asserts zero parse-that imports in `src/` after the §8 consume). A
`proof:deps-current` `typesVersions-absent` clause (from `KF-TO-PARSE-THAT-ASKS.md
§4`) asserts the stale `dist/src/parse/index.d.ts` path is gone after the PT-WAVE-4
publish.

**DAG:** M Band B, after value.js O consume; parse-that's own tranche schedule.

---

## §5 — The W100 incremental-parse kill: re-affirmed

The spike (`W10-css-parity-spike.md §5`) argued for KILL with three evidence points:

1. **Span unavailability.** parse-that's CSS AST nodes carry NO `Span`/`loc`
   (`parsers/css/types.ts` confirmed — zero offset fields). Incremental-parse
   models (a) persistent rope tree and (b) Span-anchored subtree reuse are
   STRUCTURALLY ABSENT at 0.9.0.

2. **Budget says no.** `parseCSSStylesheet` is memoized on input identity
   (`stylesheet.ts:514-519`). A live edit → new string → cache miss → full reparse.
   Full reparse of a 10-keyframe block is sub-millisecond; K's demo debounce is
   300ms. Incremental parse buys nothing on the realistic workload.

3. **kf's rAF loop reads precompiled `AnimationFrame[].interpVars`** — it NEVER
   re-parses. The only incremental-parse candidate is the editor/ingest path,
   where the sub-ms full reparse is lost in the debounce window.

**M re-affirmation:** KILL confirmed. The W100 ask to value.js is NOT filed for
Tranche M. The bench tripwire from the spike is CARRIED as a deferred-ledger row:

> "Author a bench fixture of a 500-keyframe stylesheet under a per-keystroke
> re-parse loop; if the full reparse exceeds the 300ms debounce window on the CI
> Linux runner, RE-OPEN W100 with option (c) chunked re-parse FIRST (no Span
> retrofit). Only escalate to a Span retrofit if (c) is insufficient."

This tripwire is a BOOK row in `PROGRESS.md §"Open deferrals"` for M. No code,
no value.js ask, until that bench reds.

---

## §6 — Precept violations (L-as-built)

| Violation | File:line | Precept | Status |
|-----------|-----------|---------|--------|
| Direct `@mkbabb/parse-that` production dep + `any` import — consumer-side reach through value.js's parser abstraction | `src/animation/utils.ts:1`; `package.json` | inv-L-acyclic-purity / no-workaround / inv-16 | PENDING tripwire: value.js 0.14.0 `parseCSSSubValue`; arm S9 PENDING |
| `FN_NAME` Symbol stamped onto value.js `ValueUnit` (kf writes state onto a class it doesn't own); re-stamped on every `.clone()` because `ValueUnit.clone()` drops it | `src/animation/utils.ts:45,47,51,55,294-298` | inv-L-acyclic-purity / no-workaround | PENDING tripwire: value.js 0.14.0 VJ-L1 `flatLeaf`; arm S8 PENDING |
| `linear()` flat-comma normalize regex — consumer-side correction of value.js VJ-L2 serialize bug | `src/animation/utils.ts:119,185-193` | inv-L-acyclic-purity / no-workaround | PENDING tripwire: value.js 0.14.0 VJ-L2; arm S7 PENDING |
| `proof:css-parity` gate unwritten — an open HIGH-severity gap family (two genuine crashes + multiple corruption classes) has ZERO runtime assertions | `scripts/` (absent) | gate-first law / gate-apparatus-VERDICT.md | M Band A obligation |
| Two structural CSS grammars in the spine (value.js re-implements the structural shell that parse-that already provides, and the value.js copy is weaker) | `value.js/src/parsing/stylesheet.ts` re-inventing `selectorListText`/`balancedText` over parse-that's combinators | KISS / no-redundant-grammar | Architectural; cured by Option B (value.js O extends its grammar, parse-that MAJOR removes the structural layer) |

**None of the three PENDING workarounds are newly introduced by L.** They are
band-B consume-edges that were already tripwired at L.WZ. The gate absence is
the genuine M Band A obligation.

---

## §7 — Deferred folds

| Item | Class | Tripwire | Owner |
|------|-------|----------|-------|
| W100 incremental-parse | BOOK | "500-keyframe bench exceeds 300ms debounce" | M PROGRESS.md deferred ledger |
| value.js §4 `@property` typed `<syntax>` grammar | Band-B consume | value.js O 0.14.0 | M.W(valuejs-O) |
| parse-that §2 packrat `(id,offset)` re-key | Band-B consume | parse-that PT-WAVE-6 | `KF-TO-PARSE-THAT-ASKS.md §2`; no kf gate |
| parse-that §3 `permutation` combinator | Band-B consume | parse-that PT-WAVE-5 | `KF-TO-PARSE-THAT-ASKS.md §3` |
| parse-that §4 `typesVersions` surgery | Band-B consume | parse-that PT-WAVE-4 (lowest-risk, ships FIRST) | `proof:deps-current` typesVersions-absent clause |
| parse-that §6 non-ASCII `dispatch()` fallback | Band-B consume | parse-that PT-WAVE-5/6 | `proof:replay-equality` non-ASCII-ident arm |
| value.js VJ.L1-L8 perf (color hot-path alloc) | Band-B consume | value.js O 0.14.0 | lane-07 / lane-19 |

---

## §8 — Cross-repo asks

### value.js Tranche O (the primary M cross-repo coordinate)

Fourteen asks filed in `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`. CSS-parity relevant subset:

- **§9 nesting**: `nestedRule` production in `stylesheet.ts:501`; THROWS today (HIGH)
- **§13 gradient**: bare-linear crash fix + typed radial/conic head (HIGH/MEDIUM)
- S3 @container/@layer typed recursive bodies (HIGH; L.W3 ingest substrate)
- S2 url-token typed arm (MEDIUM)
- S5 env()/attr() typed arms (MEDIUM)
- S6 system-color `SystemColor{name}` (LOW-MEDIUM)
- S8 `parseCSSSubValue`/`parseCSSValueOrArgs` (RETIRES kf's direct parse-that dep — HIGH by
  acyclic-spine impact)

Priority ordering for value.js O: §9 nesting THROW + §13 gradient THROW FIRST (highest
user-facing severity — crashes on Baseline CSS); then §8 parseCSSSubValue (retires the ⚠24
acyclic violation); then S3/S2/S5/S6 (typed shapes, no crashes).

### parse-that (secondary M coordinate)

Six asks filed in `docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md`.

- **PT-WAVE-4 typesVersions surgery** — ships FIRST (package.json only, lowest risk). Stale
  `typesVersions` pointing to `dist/src/parse/index.d.ts` (non-existent at 0.9.0) causes
  resolution warnings on `moduleResolution: bundler`. The `exports` map already covers types.
- **Structural MAJOR** (parse-that MAJOR, lags) — delete `cssParser`/`CssNode` structural
  grammar; keep `parseSingleValue`/`parseFunctionArgs` value readers.
- Parse-that PT-WAVE-5/6 items (packrat, permutation, non-ASCII dispatch) are tracked in
  lane-20; no direct kf gate beyond the consume cascades.

---

## §9 — Performance numbers

No new M-specific perf numbers for this lane. The relevant perf findings belong to:
- value.js color hot-path alloc (VJ.L1-L8) — tracked in lane-07 + lane-19
- parse time for the css-parity gap rows: all sub-millisecond (confirmed conceptually —
  even the THROW rows fail fast; the full reparse is not a perf concern in the kf context)

The W100 kill (§5) rests on the budget calculation: sub-ms full reparse in a 300ms debounce
window. No bench is needed to confirm this for the M decision; the bench tripwire is the
re-open condition.

---

## §10 — Evidence anchors

| Claim | File:line |
|-------|-----------|
| `parseCSSStylesheet` THROWS on CSS nesting | Live probe 2026-06-17; `value.js/src/parsing/stylesheet.ts:503-510` (full-consume); `:501` (`any(atRule, styleRule)` — no nestedRule arm) |
| bare `linear-gradient` THROWS `t is not iterable` | Live probe 2026-06-17; `value.js/src/parsing/index.ts:188-205` (`linearGradient` `.opt()` bug) |
| `@container` body is opaque string | Live probe 2026-06-17; `value.js/src/parsing/stylesheet.ts:471-485` (`unknownBody`) |
| parse-that CSS nesting: silent-drop (1 decl not 2) | Live probe 2026-06-17 via `cp.parser(new ParserState(...))` |
| kf direct parse-that dep PRESENT + PENDING | `proof-workaround-deletion.mjs` run 2026-06-17 arm S9; `src/animation/utils.ts:1` |
| FN_NAME Symbol workaround PRESENT + PENDING | `proof-workaround-deletion.mjs` arm S8; `src/animation/utils.ts:45,47,51,55,294-298` |
| linear() regex workaround PRESENT + PENDING | `proof-workaround-deletion.mjs` arm S7; `src/animation/utils.ts:119,185-193` |
| `proof:css-parity` gate absent | `ls scripts/ \| grep css-parity` → empty; `package.json` has no `proof:css-parity` entry |
| adapter.ts flat `pickKeyframes` walk | `src/animation/adapter.ts:145-146` |
| value.js 0.13.0 / parse-that 0.9.0 published | `npm show @mkbabb/value.js version` → `0.13.0`; `npm show @mkbabb/parse-that version` → `0.9.0` (run 2026-06-17) |
| Option B evidence record | `docs/tranches/L/audit/W10-css-parity-spike.md §3.2` |
| W100 kill evidence record | `docs/tranches/L/audit/W10-css-parity-spike.md §5` |
