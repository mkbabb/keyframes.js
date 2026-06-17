# M.W11 — The true-CSS-parity frontier (author `proof:css-parity` born-RED NOW)

- **Band:** C · **Class:** Band-A gate-authorship (kf-internal, NO sibling needed) +
  a coordinated Band-B/C close (value.js O + parse-that grammar). The gate is WRITTEN
  in this wave on today's tree; the GREEN cure is a separate coordinated publish.
- **Dep (for the gate authorship):** NONE — `parseCSSStylesheet`/`parseCSSValue`/
  `parseCSSColor` are already exported by the installed value.js 0.13.0 (verified live).
  **Dep (for the GREEN flip):** the coordinated value.js O 0.14.0 + parse-that grammar
  (M.W9 / M.W10 track) — NOT required for this wave's DONE, which is the gate biting RED.
- **Gate (born-RED, NEW):** `proof:css-parity` — a runtime capability matrix of 8 rows,
  EACH invoking the REAL installed value.js parser and asserting the CURED typed shape.
  Exit 1 on today's 0.13.0 tree for all 8 rows — the two genuine hard-crashes (nesting
  THROW, bare-gradient THROW) and the six opaque/corrupt/untyped drops bite live.

---

## Context

L's round-trip totalization answered "is the DEFINED SUBSET faithful?" — yes. M.W11 owns
the orthogonal frontier the L.W10 spike opened and lane-24 re-verified against ground
truth: **the CSS surface kf's grammar DOES NOT cover, and the gate that makes that gap
visible.** The L.W10 spike (`docs/tranches/L/audit/W10-css-parity-spike.md`) is the most
rigorously self-corrected doc in the L corpus — it found the 36-lane audit had probed
parse-that's `cssParser` for the nesting/url/at-rule rows, then the L.W10 wave-spec
witness table (`L.W10.md:341-347`) **re-attributed those parse-that behaviours to
value.js**. Lane-24 re-ran every probe on BOTH grammars and recorded the REAL value.js
0.13.0 behaviour. This wave's gate must assert THAT — the genuine value.js failure mode,
never the mis-attributed parse-that shape (inv-M-observable-truth: the L.W1 S4 gate tested
a proxy and missed the NaN-frame breach; this gate tests the actual crash/drop).

**The gate does not exist** (`ls scripts/ | grep css-parity` → empty; `package.json` has
no `proof:css-parity` entry — both verified this session). It is the DECLARED frontier
honestly un-authored at L's close (lane-24 §0, §3.1). An open HIGH-severity gap family —
**two genuine hard-crashes on Baseline CSS** plus multiple corruption/opaque classes — has
ZERO runtime assertions today. Authoring it is kf's **Band-A obligation**, independent of
any sibling publish: the gate must be WRITTEN before any value.js O consume can claim
green (the gate-first law L established), and its absence is the genuine M Band-A debt
(lane-24 §6 final row: "the gate absence is the genuine M Band A obligation").

### The 8 REAL failure modes (live-probed this session, 2026-06-17, against the installed value.js 0.13.0)

Every row below was re-run live this session via `parseCSSStylesheet` / `parseCSSValue` /
`parseCSSColor` from the installed `@mkbabb/value.js@0.13.0`. The output is the EXACT
ground-truth observable the gate must bite — NOT lane-24's transcription, re-confirmed:

| Row | Probe input | value.js 0.13.0 ACTUAL (live this session) | Class | L.W10-witness-table error corrected |
|-----|-------------|---------------------------------------------|-------|-------------------------------------|
| `nesting` | `parseCSSStylesheet(".card{color:red; & .inner{color:blue}}")` | **THROW** `Parse error at offset 17: "...or:red; & .inner..."` | HARD-CRASH | wave-spec said "silent drop" (that is parse-that's `cssParser`); value.js **THROWS** |
| `url-token` | `parseCSSValue("url(img/hero.png)")` | OK — `FunctionValue("url", …)`, `.toString()==="url(img/hero.png)"` (opaque-whole) | opaque-untyped | wave-spec said "shreds to ident/slash/ident" (that is parse-that's `cssParser`); value.js round-trips opaque-WHOLE |
| `at-container` | `parseCSSStylesheet("@container sidebar (min-width:300px){.x{color:red}}")` | OK — `[{kind:"unknown", atName:"container", prelude:<string>, body:<string>}]` (body is `typeof string`) | opaque-string-body | confirmed |
| `at-layer` | `parseCSSStylesheet("@layer base{.x{color:red}}")` | OK — `[{kind:"unknown", atName:"layer", …}]` opaque string body (`@scope` identical: `kind:"unknown", atName:"scope"`) | opaque-string-body | confirmed |
| `bare-linear-gradient` | `parseCSSValue("linear-gradient(red, blue)")` | **THROW** `t is not iterable` (with explicit `linear-gradient(90deg, red, blue)` → OK) | HARD-CRASH | confirmed (the `.opt()` direction-optional crash, value.js `index.ts:188-205`) |
| `radial-gradient` | `parseCSSValue("radial-gradient(circle at center, red, blue)")` | OK-but-MANGLED — `.toString()==="radial-gradient(circle, at, center, rgb(255 0 0), rgb(0 0 255))"` (head shredded to raw comma-idents) | parse-and-corrupt | confirmed (refined: corrupt, not opaque) |
| `env` | `parseCSSValue("env(--safe-area-inset-top, 0px)")` | OK — `FunctionValue("env", …)` faithful `.toString()`, fallback present but NOT separated `{name, fallback}` | faithful-untyped | corrects an earlier "throw" mis-read |
| `system-color` | `parseCSSValue("Canvas")` → `ValueUnit{value:"Canvas", unit:undefined}`; `parseCSSColor("Canvas")` → **THROW** `Parse error at offset 0: "...Canvas..."` | bare string fallback; color-parse THROWS | confirmed |

**The two genuine hard-crashes on Baseline CSS are rows `nesting` and `bare-linear-gradient`**
— a kf consumer feeding either a stylesheet with CSS nesting (Baseline 2023) or a value
with a bare `linear-gradient(red, blue)` (Baseline-stable forever) gets a hard
`Parse error` / `TypeError`, not a degraded animation. Everything else is a typed-shape
gap or a forward-leg corruption — serious but non-crashing. These are the inv-M-observable-truth
oracle: the gate's RED witness is each of these LIVE crashes/drops, not a source grep.

### The gate must assert the CURED shape, not merely "no throw"

The spike's key design correction (lane-24 §3.2): the gate asserts value.js's REAL
behaviour AND the typed CURE the value.js O grammar will deliver — so a partial fix (e.g.
"nesting stops throwing but produces an empty rule") does NOT green it. The cured-shape map:

| Row | Born-RED reason (value.js 0.13.0 TODAY) | GREEN condition (value.js O cure) |
|-----|-----------------------------------------|-----------------------------------|
| `nesting` | THROWS at offset 17 | parse SUCCEEDS (no throw) **AND** the AST carries a `kind:"nested"` child item with the inner declaration(s) — TWO assertions, both required |
| `url-token` | opaque-whole `FunctionValue("url",…)` | a typed `UrlValue` node preserving the literal `img/hero.png` path, replay-equal |
| `at-container` | `kind:"unknown"`, opaque STRING body | `kind:"container"` with a parsed condition **AND** a RECURSIVE typed body (not a string) |
| `at-layer` | `kind:"unknown"`, opaque string body | `kind:"layer"` typed, recursive body |
| `bare-linear-gradient` | THROWS `t is not iterable` | NO `TypeError` thrown **AND** a valid `FunctionValue` with direction defaulted to `to bottom` |
| `radial-gradient` | parses-and-MANGLES head (`circle, at, center` as raw idents) | a typed head with `shape`/`position`, replay-equal |
| `env` | `FunctionValue("env",…)` faithful but untyped | a typed `EnvValue{name, fallback}` with the fallback semantically separated |
| `system-color` | `ValueUnit` string; `parseCSSColor` THROWS | a typed `SystemColor{name}` (parse-time sentinel; resolved at computed-unit time) |

### W100 incremental-parse — KILL re-affirmed (BOOK-with-tripwire)

The W100 incremental/streaming-parse ask is re-affirmed KILLed (M.md §KILL anti-charter;
lane-24 §5). The evidence (lane-24 §5, spike §5): parse-that's CSS AST nodes carry **no
`Span`/`loc`** (structurally absent at 0.9.0 — the persistent-rope and Span-anchored-reuse
models are unavailable); `parseCSSStylesheet` is memoized on input identity, so a live edit
is a cache-miss → full reparse, and a full reparse of a 10-keyframe block is **sub-ms inside
the 300 ms editor debounce**; kf's rAF loop reads precompiled `AnimationFrame[].interpVars`
and never re-parses. Incremental parse buys nothing on the realistic workload. **No code, no
value.js ask** — only a BOOK row with a falsifiable re-open tripwire (this wave authors the
tripwire fixture, see S9).

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. S1–S8 author one runtime-invocation
row each into `scripts/proof-css-parity.mjs`; S0 is the script scaffold + roster wiring;
S9 is the W100 BOOK-with-tripwire bench fixture. **All authored on today's 0.13.0 tree;
the gate is born-RED the moment it runs.** No engine/library/demo source is touched —
this wave authors ONE new gate script + ONE bench fixture + the `package.json` wiring.

---

### S0 — Author `scripts/proof-css-parity.mjs` + wire into the report-all roster (NOT the blocking chain)

**Breach.** The gate does not exist (`ls scripts/ | grep css-parity` → empty; no
`package.json` entry — verified this session). The HIGH-severity gap family (two crashes +
six drops) has ZERO runtime assertions.

**Deliverable.** Author `scripts/proof-css-parity.mjs` modeled on `proof-deps-current.mjs`
(lane-24 §3.2: "modeled on `proof-deps-current.mjs`: each clause is a real invocation with a
typed-shape assertion. Cannot be gamed by a source diff"): a `fail[]`/`pass[]` accumulator,
one clause per row (S1–S8), a `process.exit(1)` on any fail, the verdict block. Add
`"proof:css-parity": "node scripts/proof-css-parity.mjs"` to `package.json` scripts.

**The roster placement (critical — this gate STAYS RED until value.js O publishes).**
Wire `proof:css-parity` into the `proof:all` **report-all lane**, NOT the blocking
`proof:hygiene` `&&` chain. This gate is RED-by-design on a GREEN tree (the frontier is
open) and **must never block CI on an otherwise-green tree** (lane-24 §3.3 Phase 1; M.md
M.W11 row). The placement composes with M.W1's report-all runner: once M.W1 lands, this
gate is one node the orchestrator reports alongside the other reds in a single pass without
aborting. On today's serial `&&` tree it is wired into the report-all surface only (e.g.
the `continue-on-error` posture that `proof:peer-satisfied` uses — `ci.yml:355`), never the
fail-fast hygiene chain. The script's own exit code is 1 (RED), but the roster wiring makes
that RED a SURFACED tripwire, not a green-tree blocker.

**The invocation discipline (inv-M-observable-truth — cannot be a grep).** Each row
`import`s the parser from the INSTALLED `@mkbabb/value.js` (the artifact npm resolved in
`node_modules`, the same realm kf ships against), never a source-shape grep, never a mock.
The two THROW rows wrap the call in `try/catch` and assert on the caught error OR the cured
no-throw shape; the six non-throw rows assert the typed-shape predicate on the returned
node. Each clause is a real invocation with a typed-shape assertion (lane-24 §3.2).

**Gate bite.** `node scripts/proof-css-parity.mjs` → exit 1 on today's 0.13.0 tree (all 8
rows born-RED). The script runs without a sibling publish (the parser is already installed).

---

### S1 — Row `nesting`: assert SUCCEEDS + `kind:"nested"` (the hard-crash row, TWO assertions)

**Breach (live).** `parseCSSStylesheet(".card{color:red; & .inner{color:blue}}")`
**THROWS** `Parse error at offset 17: "...or:red; & .inner..."`. value.js
`stylesheet.ts:503-510` enforces full-input consumption at the top level; the `&` at offset
17 is not in the `any(atRule, styleRule)` production set (`stylesheet.ts:501`), so the WHOLE
parse aborts. This is parse-that's silent-drop's OPPOSITE — kf's visible behaviour is the
value.js THROW (the spike's key correction over the L.W10 wave-spec witness table).

**Assertion (born-RED today).** The row wraps the call in `try/catch`. TWO required
predicates: (a) the call does NOT throw, AND (b) the resulting AST contains an item with
`kind === "nested"` carrying the inner `color:blue` declaration. Today predicate (a) fails
(the THROW) → the row reds. After value.js O ships the `nestedRule` production (M.md M.W9 /
KF-TO-VALUEJS-O-ASKS §9), both predicates hold.

**Why both, not just "no throw".** A partial value.js fix that swallows the `&` into the
parent's declaration list (parse-but-lose) would pass "no throw" while losing the nested
rule. The `kind:"nested"` assertion forbids that (lane-24 §3.2: "two distinct assertions,
both required").

---

### S2 — Row `url-token`: assert a typed `UrlValue` (not opaque-whole, not absence-of-shred)

**Breach (live).** `parseCSSValue("url(img/hero.png)")` returns an opaque-whole
`FunctionValue("url", …)` whose `.toString()` round-trips the original — faithful but
untyped. (parse-that's `cssParser` would SHRED the path into `ident/slash/ident`, but kf
NEVER reaches parse-that's CSS module — it calls `parseCSSValue`. The gate must assert the
CURED shape, NOT "absence of shredding," because shredding is parse-that's failure mode, not
value.js's — lane-24 §3.2.)

**Assertion (born-RED today).** Assert the returned node is a typed `UrlValue` (the value.js
O cure) preserving the literal `img/hero.png`. Today the node is a generic `FunctionValue`
with `name==="url"` (verified: `ctor` is the minified `FunctionValue`, `name:"url"`) — no
`UrlValue` type → the typed-shape predicate fails → the row reds.

---

### S3 — Row `at-container`: assert `kind:"container"` + a RECURSIVE typed body (not a string body)

**Breach (live).** `parseCSSStylesheet("@container sidebar (min-width:300px){.x{color:red}}")`
returns `[{kind:"unknown", atName:"container", prelude:<string>, body:<string>}]` — the body
is `typeof string` (verified this session: `body typeof: string`). The inner rule tree is
LOST to an opaque string. The static string-ingest path (`adapter.ts:145-146` flat
`extractKeyframes`) cannot recurse into an opaque string body, so a `@keyframes` nested in a
`@container` in a CSS STRING is invisible (lane-24 §1 Row 3: live ingest via the CSSOM walk
is already fixed by L.W3; the STRING-parse path is still blind).

**Assertion (born-RED today).** Assert `kind === "container"` AND `typeof body !== "string"`
(a typed recursive body — an array of `StylesheetItem`). Today `kind === "unknown"` and
`typeof body === "string"` → both predicates fail → the row reds. After value.js O ships
typed recursive at-rule bodies (KF-TO-VALUEJS-O-ASKS §3; the L.W3 ingest substrate), the
predicates hold and `adapter.ts` can recurse for nested `@keyframes`.

---

### S4 — Row `at-layer`: assert `kind:"layer"` + recursive body (the same opaque-body class)

**Breach (live).** `parseCSSStylesheet("@layer base{.x{color:red}}")` →
`[{kind:"unknown", atName:"layer", …}]` opaque string body — same pattern as `@container`
(`@scope` identical: `kind:"unknown", atName:"scope"`, verified this session).

**Assertion (born-RED today).** Assert `kind === "layer"` AND a typed recursive body. Today
`kind === "unknown"`, string body → reds. (The row exercises `@layer`; `@scope`/`@page` are
the same opaque-body class — the gate row covers `@layer` as the representative, with a
comment noting the shared `kind:"unknown"` fall-through so a future grammar partial covering
only `@container` and not `@layer` still reds this row.)

---

### S5 — Row `bare-linear-gradient`: assert NO `TypeError` + a valid `FunctionValue` (the second hard-crash row)

**Breach (live).** `parseCSSValue("linear-gradient(red, blue)")` **THROWS** `t is not
iterable`; `parseCSSValue("linear-gradient(90deg, red, blue)")` (explicit direction) is OK.
The `.opt()` direction-optional arm crashes (value.js `index.ts:188-205`). This is the most
user-facing of the two crashes — `linear-gradient(red, blue)` is Baseline-stable forever
(lane-24 §1 Row 5).

**Assertion (born-RED today).** Wrap in `try/catch`. Assert (a) NO `TypeError`/throw, AND
(b) the result is a valid `FunctionValue` (name `"linear-gradient"`) — the value.js O cure
defaults the missing direction to `to bottom`. Today predicate (a) fails (the `t is not
iterable` throw) → the row reds.

---

### S6 — Row `radial-gradient`: assert a typed head (`shape`/`position`), not the mangled comma-ident blob

**Breach (live).** `parseCSSValue("radial-gradient(circle at center, red, blue)")` parses
but MANGLES the head: `.toString() === "radial-gradient(circle, at, center, rgb(255 0 0),
rgb(0 0 255))"` — `circle`/`at`/`center` shredded into raw comma-joined idents (verified
this session). NOT a throw — a parse-and-corrupt; the gradient animates but the head
structure is lost, so gradient-morph between two radial gradients with different heads is
impossible (lane-24 §1 Row 6). This is a SILENT corruption on the forward leg — invisible to
kf's compile-side refusal gates, which is why it needs a parity-row oracle.

**Assertion (born-RED today).** Assert the typed head exposes `shape`/`position` fields
(the value.js O cure) — NOT the raw comma-ident serialization. The gate asserts the cured
TYPED shape, not "the string is different," because the corruption is structural. Today the
head is raw idents → the typed-shape predicate fails → reds.

---

### S7 — Row `env`: assert a typed `EnvValue{name, fallback}` (the fallback semantically separated)

**Breach (live).** `parseCSSValue("env(--safe-area-inset-top, 0px)")` returns a faithful
`FunctionValue("env", …)` whose `.toString()` round-trips — but the fallback `0px` lives in
the generic `values[]` array, NOT separated as `{name, fallback}` (verified: `env arrays:
['values']`, `name:"env"`). The `.bbnf` grammar declares `envFn` (`css-values.bbnf:82`) but
the live parser has no `handleEnv` arm (generic `Function_` fall-through, `index.ts:224`).
kf cannot distinguish `env()` from any unknown function at interpolation time (lane-24 §1
Row 8).

**Assertion (born-RED today).** Assert the returned node is a typed `EnvValue` with a
separated `{name:"--safe-area-inset-top", fallback}` shape. Today the node is a generic
`FunctionValue` with no `fallback` field → reds. After value.js O ships `handleEnv`
(KF-TO-VALUEJS-O-ASKS §5), the typed shape holds.

---

### S8 — Row `system-color`: assert a typed `SystemColor{name}` (not the bare-string fallback / color-parse THROW)

**Breach (live).** `parseCSSValue("Canvas")` returns a bare `ValueUnit{value:"Canvas",
unit:undefined}` (verified); `parseCSSColor("Canvas")` **THROWS** `Parse error at offset 0`
(verified). `Canvas` (a CSS system color) falls through to the `CSSString` fallback
(`index.ts:222,235`). If kf interpolates `Canvas → red` in oklab, the system color is a
literal ident → wrong or thrown interpolation; system colors matter for dark-mode
transitions (lane-24 §1 Row 10).

**Assertion (born-RED today).** Assert `parseCSSValue("Canvas")` yields a typed
`SystemColor{name:"Canvas"}` (the value.js O cure — a parse-time sentinel resolved at
computed-unit time). Today the result is a bare `ValueUnit` string → the typed-shape
predicate fails → reds. (The row also records that `parseCSSColor("Canvas")` THROWS today,
as a secondary witness — but the GREEN predicate is the typed `SystemColor` from
`parseCSSValue`, the path kf's value pipeline actually takes.)

---

### S9 — The W100 BOOK-with-tripwire: a 500-keyframe per-keystroke bench fixture (KILL re-affirmed)

**Breach.** W100 incremental-parse is KILLed (no code, no value.js ask), but the KILL rests
on a BUDGET claim ("full reparse of a 10-keyframe block is sub-ms inside the 300 ms
debounce") that must carry a falsifiable re-open condition (lane-24 §5, §7). Today no fixture
holds that tripwire.

**Deliverable.** Author a bench fixture (`bench/css-parity-reparse.bench.ts` or
`bench/incremental-parse.bench.ts`, matching the `bench/*.bench.ts` convention) of a
**500-keyframe stylesheet under a per-keystroke `parseCSSStylesheet` re-parse loop**. The
fixture MEASURES the full-reparse wall-time of the worst-case document. It is a BOOK row in
`PROGRESS.md §"Open deferrals"` with the explicit tripwire (lane-24 §5):

> "If the full reparse of a 500-keyframe stylesheet exceeds the 300 ms debounce window on
> the CI Linux runner, RE-OPEN W100 with option (c) chunked re-parse FIRST (no Span
> retrofit). Only escalate to a Span retrofit if (c) is insufficient."

**Why a fixture, not a gate.** This is NOT a born-RED gate — it is a measurement that BOOKS
the re-open condition. It is wired into `bench/taxonomy.json` (so `proof:bench-taxonomy`
sees it) but does NOT gate `proof:all` (the KILL stands until the tripwire fires). No
`proof:css-parity` row depends on it; it is the W100 disposition's evidence anchor.

**Bite.** Prevents the W100 KILL from being an UN-FALSIFIABLE assertion: if a real consumer
workload makes the full reparse exceed the debounce, the bench reds and the BOOK row's
tripwire fires (the KILL re-opens with a bounded, Span-free first option).

---

## Born-RED gate

**Gate:** `proof:css-parity` (NEW — `scripts/proof-css-parity.mjs`, authored in this wave;
absent today). This is the FIRST wave in M to author a brand-new born-RED gate script (the
other M Band-B/C waves EXTEND or CONSUME existing gates). Modeled on
`proof-deps-current.mjs` — a `fail[]`/`pass[]` accumulator, one clause per row, exit 1 on
any fail (lane-24 §3.2).

**The REAL observable (inv-M-observable-truth).** Each row INVOKES the installed value.js
parser and asserts the typed CURE — the born-RED witness is the GENUINE crash/drop, live-probed
this session, NOT a proxy (the gate CANNOT be faked by a source grep; it must call the REAL
installed parser and assert the output node type — lane-24 §3.2):

| Row | Live witness on today's 0.13.0 tree (this session) | Failure mode (the REAL observable) | GREEN after value.js O |
|-----|----------------------------------------------------|-------------------------------------|------------------------|
| `nesting` | `parseCSSStylesheet(".card{color:red; & .inner{…}}")` | **THROWS** `Parse error at offset 17` — a hard crash on Baseline-2023 CSS | parse succeeds + `kind:"nested"` child present (both) |
| `url-token` | `parseCSSValue("url(img/hero.png)")` | opaque-whole `FunctionValue("url",…)` — no typed `UrlValue` | typed `UrlValue` preserving the path |
| `at-container` | `parseCSSStylesheet("@container …{…}")` | `kind:"unknown"`, `typeof body==="string"` — recursive tree LOST | `kind:"container"` + recursive typed body |
| `at-layer` | `parseCSSStylesheet("@layer base{…}")` | `kind:"unknown"`, opaque string body (`@scope` identical) | `kind:"layer"` + recursive typed body |
| `bare-linear-gradient` | `parseCSSValue("linear-gradient(red, blue)")` | **THROWS** `t is not iterable` — a hard crash on Baseline CSS | no throw + valid `FunctionValue` (dir → `to bottom`) |
| `radial-gradient` | `parseCSSValue("radial-gradient(circle at center, …)")` | parses-but-MANGLES head (`circle, at, center` raw idents) — silent forward-leg corruption | typed head `shape`/`position`, replay-equal |
| `env` | `parseCSSValue("env(--safe-area-inset-top, 0px)")` | `FunctionValue("env",…)` faithful but untyped; fallback un-separated | typed `EnvValue{name, fallback}` |
| `system-color` | `parseCSSValue("Canvas")` / `parseCSSColor("Canvas")` | bare `ValueUnit` string; `parseCSSColor` **THROWS** at offset 0 | typed `SystemColor{name}` |

**Today's tree result.** `node scripts/proof-css-parity.mjs` exits 1 with all 8 rows RED:
two THROW rows (`nesting`, `bare-linear-gradient` — the genuine hard-crashes caught by
`try/catch`), one parse-and-corrupt row (`radial-gradient`), two opaque-string-body rows
(`at-container`, `at-layer`), two untyped-faithful rows (`url-token`, `env`), one
string-fallback row (`system-color`). The born-RED is the LIVE crash/drop the value.js O
grammar will cure — not a stand-in. inv-M-observable-truth met: the gate bites the actual
breach (the L.W1 S4 gate tested a no-throw + string-round-trip proxy and missed the NaN
breach; this gate asserts the typed cure, so a partial "no-throw-but-empty" fix does NOT
green it).

**Green condition.** All 8 rows pass — which requires the coordinated value.js O 0.14.0 +
parse-that grammar (M.W9 / M.W10: the `nestedRule` production, the bare-gradient `.opt()`
crash fix + typed radial head, the typed recursive at-rule bodies, the `UrlValue`/`EnvValue`/
`SystemColor` arms, `parseCSSSubValue`) AND a kf re-pin to `^0.14.0`. The cure lives ENTIRELY
in value.js — kf does NOT patch the parser at the consume seam (inv-L-acyclic-purity; no
`file:` pin, no `overrides`, no vendored grammar — M.md §cross-repo / lane-24 §4).

**The two-phase structure (lane-24 §3.3).** Phase 1 = THIS wave: author the gate, born-RED
against 0.13.0, wired into the report-all lane (never the blocking chain). Phase 2 = M.W9
(value.js O consume): the re-pin flips every row GREEN, alongside the `proof:boundary` W96
parse-that-scan and the `proof:workaround-deletion` arms S7/S8/S9. **This wave's DONE is
Phase 1 — the gate biting RED.** The GREEN flip is M.W9's, gated on the value.js O publish.

---

## Deps

| Dep | For | Status |
|-----|-----|--------|
| value.js 0.13.0 (already pinned) | the gate AUTHORSHIP (Phase 1) | INSTALLED — `parseCSSStylesheet`/`parseCSSValue`/`parseCSSColor` are published top-level exports (verified this session); the gate runs born-RED with NO sibling publish |
| value.js O 0.14.0 | the GREEN flip (Phase 2, M.W9) | NOT published (E404). Carries §9 nesting `nestedRule`, §13 bare-gradient crash fix + typed radial/conic head, §3 typed recursive at-rule bodies, §2 `UrlValue`, §5 `EnvValue`/`AttrValue`, §6 `SystemColor`, §8 `parseCSSSubValue` (KF-TO-VALUEJS-O-ASKS) |
| parse-that (coordinated) | the structural MAJOR (can LAG) | the `cssParser` structural-grammar retirement (Option B); nothing consumes `cssParser` at runtime, so it lags the value.js O / kf re-pin with zero user impact (M.W10 / lane-24 §2.3) |

- **This wave needs NO sibling publish to land.** Authoring a runtime gate against
  known-broken installed behaviour is kf-internal — the Band-A obligation (lane-24 §4
  M.W(css-parity-gate): "kf-internal, no sibling publish needed"). The gate is WRITTEN and
  RED on today's tree; that is its DONE.
- **The GREEN flip is M.W9's, not this wave's.** This wave is the gate-first half of the
  coordinated close: it LEADS the Band-B/C value.js O consume (M.W9 flips it GREEN). The
  acyclic spine sequences parse-that 0.9.1 → value.js O 0.14.0 → kf re-pin (M.md §cross-repo).
- **Composes with M.W1 (does NOT require it).** Once M.W1's report-all runner lands,
  `proof:css-parity` is one RED node the orchestrator surfaces in a single pass without
  aborting. On today's serial `&&` tree it is wired into the report-all surface only (the
  `continue-on-error` posture), never the fail-fast hygiene chain — so a green tree is not
  blocked by this RED-by-design frontier gate.
- **Parallel with M.W5∥M.W6∥M.W7 (no file collision).** This wave authors ONE new gate
  script (`scripts/proof-css-parity.mjs`) + ONE bench fixture + the `package.json` wiring —
  it touches no engine/compile/ingest surface (M.W5 `compile.ts`/`format.ts`, M.W6
  `compile-color.ts`, M.W7 `walkSheet`).

---

## Bite — what regression each clause catches

| S-clause | Regression the gate catches |
|----------|------------------------------|
| S0 (author + roster) | The HIGH-severity CSS-parity gap family (two crashes + six drops) regresses to ZERO runtime coverage — the gate-first law's exact failure (a frontier open with no oracle); OR the gate is mis-wired into the blocking hygiene chain and reds a green tree (it must be a report-all surfaced tripwire, RED-by-design) |
| S1 (nesting) | A kf consumer feeding a Baseline-2023 nested stylesheet (`& .child`) gets a hard `Parse error at offset N` — and a future partial value.js fix that swallows the `&` into the parent declaration list (no-throw-but-lose) is NOT caught (the `kind:"nested"` assertion forbids the parse-but-lose regression) |
| S2 (url-token) | `background: url(…)` cannot become a typed `UrlValue` animation primitive — the gradient-with-url replay-equality breaks; OR the gate is mis-written to assert "absence of shredding" (parse-that's failure mode) instead of the typed cure (value.js's), locking the wrong observable |
| S3 (@container) | A `@keyframes` rule nested inside a `@container` block in a CSS STRING is invisible to `fromString()` ingest (the static string-parse path stays flat) — the L.W3 ingest depth never reaches the string path |
| S4 (@layer) | Same as S3 for `@layer`/`@scope`/`@page` — and a grammar partial that types only `@container` and leaves `@layer` opaque is NOT silently passed (the row reds on the `kind:"unknown"` fall-through) |
| S5 (bare-gradient) | A kf consumer animating a background with a bare `linear-gradient(red, blue)` gets a hard `TypeError: t is not iterable` — the most user-facing of the two crashes regresses unguarded |
| S6 (radial-gradient) | A silent forward-leg head corruption (`circle at center` → raw comma-idents) ships unnoticed — gradient-morph between differing radial heads is impossible, and the corruption is invisible to compile-side refusal gates (only a parity-row oracle catches it) |
| S7 (env) | `env(--safe-area-inset-top, 0px)` in a keyframe stop degrades to an opaque `FunctionValue` string-lerp instead of a runtime-resolved typed `EnvValue` — safe-area-aware animation silently breaks |
| S8 (system-color) | `color: Canvas` interpolates as a literal ident (or throws in `parseCSSColor`) instead of resolving the UA-dependent system color at computed-unit time — dark/light-mode color transitions break silently |
| S9 (W100 BOOK fixture) | The W100 KILL becomes an UN-FALSIFIABLE assertion — without the 500-keyframe re-parse bench, a real consumer workload exceeding the 300 ms debounce never trips the documented re-open tripwire (the KILL would stand on an unmeasured budget claim) |

---

## Excluded from this wave

- **The value.js O 0.14.0 grammar cure + the kf re-pin** — that is M.W9 (the GREEN flip).
  This wave authors the born-RED gate only; the re-pin that greens it (delete `utils.ts:1`
  `import { any }`, swap to `parseCSSSubValue`, `proof:boundary` W96 GREEN, the
  `proof:workaround-deletion` arms S7/S8/S9) lands on the value.js O publish (M.md M.W9).
- **The parse-that structural `cssParser` MAJOR retirement** — M.W10 / the parse-that
  tranche; it can LAG indefinitely (zero runtime consumers — lane-24 §2.3). NOT this wave.
- **`@property` typed `<syntax>` grammar** (lane-24 §7 / L.W10 S4) — a value.js O Band-B
  consume tracked separately; the `@property` COMPILE-surface gap (the artifact-drop) is
  M.W5's, distinct from this parity frontier.
- **`attr()` typed arm** — value.js O §5 companion to `env`; LOW severity (uncommon in
  animation CSS — lane-24 §1 Row 9). The gate covers `env` as the representative row; `attr`
  rides the same `handleEnv`/`handleAttr` value.js cure and is recorded in
  KF-TO-VALUEJS-O-ASKS, not gated as a separate row here.
- **W100 incremental-parse implementation** — KILLed (M.md §KILL anti-charter). S9 authors
  only the BOOK-with-tripwire bench fixture (the re-open evidence), no parse code.
