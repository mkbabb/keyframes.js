# px-parser-sota-libs — the parser SOTA LANDSCAPE + the rewrite-vs-transpose decision (Tranche F PARSING-SOTA)

**Lane.** `px-parser-sota-libs`. **Modality.** Parsing, three layers —
`@mkbabb/parse-that` (combinator engine, `/Users/mkbabb/Programming/parse-that/typescript/src/parse`)
→ `@mkbabb/value.js` (CSS parser built on it, `/Users/mkbabb/Programming/value.js/src/parsing`)
→ keyframes.js (`@keyframes` consumption, `src/animation/{adapter,utils,frame-compiler}.ts`).
**Focus (the one the charter assigns this lane, distinct from its three parsing siblings).**
The **external SOTA library landscape** — lightningcss, csstree, `@csstools/css-tokenizer`
+ `css-parser-algorithms`, nom/winnow, chevrotain, peggy/PEG.js, tree-sitter, and the
**compile-combinators-to-a-table / staged-partial-evaluation** frontier — and the
**rewrite-vs-transpose decision**: an HONEST cost/benefit of (a) a Rust→WASM rewrite vs
(b) transposing parse-that toward a SOTA combinator architecture in pure TS. The E
synthesis DECLINED a full WASM rewrite; this lane **re-examines that decision with
current (2026-06) evidence** and a grounded recommendation, not a reflex.

**inv-16.** parse-that AND value.js are SEPARATE `@mkbabb` repos. Every parse-that /
value.js item is a **HANDOFF proposal** the respective owner sequences; this lane writes
ONLY this keyframes.js doc and makes ZERO source edits to any repo. **inv ε.** Every
in-tree claim is `file:line`-cited against the live trees (re-grounded 2026-06-06); every
SOTA claim is web-sourced (sources at the end). Installed pins (the code kf runs):
`@mkbabb/parse-that@0.8.2`, `@mkbabb/value.js@0.10.0` (verified in
`node_modules/@mkbabb/*/package.json`).

**Relationship to the three sibling parsing lanes (DIFF + EXTEND, never repeat).** This
lane is the **library-survey + decision axis** beneath the three internals lanes. I cite,
never re-derive, their findings:
- `px-parse-that-arch.md` — the parse-that **engine** internals (the dead packrat §3, the
  module-global error state §4, the span double-algebra §5, the Rust port as design oracle
  §6). I consume its "leaf tier is ALREADY-SOTA" verdict and its Rust-port-as-oracle frame.
- `px-vj-css-parser.md` — value.js's **CSS parser** (the `parseSingleValue`/`cssParser`
  dormant reader PX-2, the 3-pass stylesheet PX-3, the 45-way unit `any()` PX-4, the span
  non-use PX-5, the `nameParser` exemplar PX-7, the id-only MEMO unsoundness PX-1). I
  consume its "the SOTA reader already exists, exported, in-tree" ground truth.
- `px-kf-grammar.md` — the kf-OWNED grammar/round-trip/diagnostics surface.
- Cross-tranche: `r-css-parsers-wasm.md` (F-4 WASM decline, F-1 the kf-private easing
  parser), `p-parse-perf-F.md` (the measured `any()`→`dispatch` 3.65× + the compile-time
  bound), and the E `valuejs-sota-handoff.md` Wave A (`any()`→`dispatch()`, spans, WASM
  declined). **My unique contribution is the systematic comparative survey the prior lanes
  cited only as one-liners, and the structured rewrite-vs-transpose ledger they gestured
  at but never tabulated — including the one frontier none of them named: STAGED parser
  combinators (the partial-evaluation "compile to a table" angle the charter explicitly
  asks for).**

---

## 0. Headline + disposition index

**The one sentence.** The CSS-parsing SOTA field has converged — independently, across
Rust (lightningcss, winnow), JS (csstree, `@csstools`), and the theory frontier (staged
combinators) — on a **single shape**: *tokenize-once · first-token/first-char dispatch ·
typed-value-per-shape · zero-copy offset spans · forgiving-no-throw with a diagnostic
callback* — and **parse-that already hand-writes every primitive of that shape** (`dispatch`
LUT, `parseSingleValue` single-pass reader, the `span.ts` family, the forgiving combinator
posture); the **only** gaps are (1) value.js does not ADOPT them and (2) parse-that does
not COMPILE them (the staging frontier). **A WASM rewrite is the WRONG axis** (wrong cost
model for a per-value JS workload, re-confirmed with 2026 evidence); the right axis is
**transpose-in-place toward the shape the field proved**, with the staged-combinator
compile as the one genuinely-new-to-this-stack BOOK item.

| # | Finding | New vs prior F/E? | Disposition |
|---|---------|-------------------|-------------|
| **LIB-1** | **The SOTA convergence is real and parse-that is on the right side of it** — six independent SOTA references (lightningcss/cssparser, winnow, csstree, `@csstools`, the CSS-Syntax-3 spec, staged combinators) share the same six-trait shape; parse-that hand-writes 5 of the 6 primitives, value.js inverts 4 of the 6 in *consumption*. The field is not ahead of parse-that's *engine*; it is ahead of value.js's *use* of it. | **NEW (px-libs)** — the systematic cross-reference; siblings cite individual refs | **RECORD (the convergence) + frames the handoffs below** |
| **LIB-2** | **chevrotain is the one JS toolkit on a genuinely-different and faster model — and it is the wrong product for this stack.** chevrotain is the fastest *pure-JS* parser toolkit because it is a self-analyzing LL(k) engine that builds lookahead TABLES at `performSelfAnalysis()` time and does NOT compose closures at runtime — the opposite of the combinator-algebra model. parse-that benchmarks against it directly (`test/benchmarks/chevrotain.ts`). Adopting chevrotain's model = abandoning the algebraic combinator API (a different library). | **NEW (px-libs)** — sharpens px-parse-that-arch §2.2 with the table-construction mechanism | **KILL (do not chase chevrotain's model) — RECORD why** |
| **LIB-3** | **winnow is parse-that's Rust twin, and it VOTES for exactly the transpositions the siblings propose** — `&mut` state (parse-that has it), `dispatch!` over `alt` for unique-prefix branches (parse-that has `dispatch`, value.js doesn't use it), drop GATs/zero-cost-backprop as not-worth-it (parse-that's Rust port drops packrat — px-parse-that-arch §3). winnow's published 5-7× JSON/TOML wins come from the `&mut` model + inlining + `dispatch`, ALL of which parse-that's leaf tier already realizes. | **NEW (px-libs)** — winnow as the external corroboration of the in-tree direction | **RECORD — external proof the dispatch/`&mut` direction is SOTA** |
| **LIB-4** | **THE STAGED-COMBINATOR FRONTIER is the charter's "compile combinators to a table" — and it is the ONE SOTA lever no sibling named.** Staged/typed parser combinators (Jonnalagedda 2014, Parsley/`flap` 2019-21, "Obliteratingly Fast" 2021) compile a combinator grammar to **specialized first-order code with a first-set dispatch table at staging time**, running **3-9× faster than lex+yacc** and **>25× faster than the un-staged combinators**. This is the *principled* form of the per-combinator-closure fix px-parse-that-arch §2 declared "JS cannot express" — and JS *partially* can (a build-time codegen / a `compile()` that fuses the grammar). The honest sizing: it is a **research-grade BOOK**, not an F-ship. | **NEW (px-libs)** — entirely absent from all prior F/E docs | **BOOK (parse-that) — the staged-compile tranche; the real long-horizon cost-model SOTA** |
| **LIB-5** | **The WASM decline HOLDS and is the correct call — re-examined honestly, not reflexively, with a full cost/benefit ledger.** Three independent 2026 cost facts: (a) lightningcss-wasm's own marshalling is `TextEncoder`/`TextDecoder` string↔heap copy, amortized over a whole sheet, fatal per-value; (b) value.js returns **live mutable `ValueUnit`/`Color` object graphs**, not byte strings — graph reconstruction across the boundary is unbounded; (c) the platform's own parser (CSS Typed OM `CSSStyleValue.parse()`) is STILL not-Baseline 2026. The Rust ports (parse-that's `rust/parse_that`, lightningcss) are SOTA **for whole-buffer ingestion**, the wrong tool for kf's per-token shape. | **CONFIRMS** r-css-parsers-wasm F-4 + px-parse-that-arch §6 — I add the **structured A-vs-B ledger** (§3) | **KILL (WASM rewrite) — recorded with the full ledger, do not re-litigate** |
| **LIB-6** | **The honest rewrite-vs-transpose VERDICT: transpose, in a NAMED dependency order, and the order is already the siblings' waves.** Neither "rewrite to Rust/WASM" nor "rewrite to chevrotain codegen" is correct. The SOTA target is reachable by *adopting in-tree primitives* (dispatch, spans, the `parseSingleValue` reader) — cheap, isomorphic, sibling-charted — with the staged-compile (LIB-4) as the only frontier BOOK. No new architecture is *invented*; the faster machines already exist in the dep chain. | **NEW (px-libs)** — the synthesis the charter asks for | **RECORD — the decision; §4 sequences it** |

---

## 1. The SOTA landscape — a systematic comparative survey (the lane's core deliverable)

The prior lanes cite lightningcss/csstree/winnow/`@csstools` as one-liners. This is the
**comparative architecture table** — what each actually does, and where parse-that/value.js
sit against it. The columns are the six traits the field converged on (the "SOTA shape").

### 1.1 The convergence table

| Tool | Lang | Tokenize-once | First-token dispatch | Typed value / shape | Zero-copy spans | Forgiving (no-throw) | Cost model |
|------|------|--------------|---------------------|--------------------|-----------------|---------------------|------------|
| **lightningcss** (`cssparser`/Servo) | Rust | ✅ token stream | ✅ | ✅ typed AST | ✅ `&str` borrow | ✅ (transform-faithful) | monomorphized, whole-sheet |
| **csstree** | JS | ✅ "tokenize once, reuse" | ✅ (by token type) | ✅ detailed AST, tunable | ✅ `(type, start, end)` offsets | ✅ `onParseError` + `Raw` node | hand-tuned, mem-conscious |
| **`@csstools/css-tokenizer` + `css-parser-algorithms`** | JS | ✅ (separate tokenizer) | ✅ component-value | ✅ CSS-Syntax-3 typed | ✅ token offsets | ✅ "forgiving, won't stop on parse error", errors via callback | spec-faithful, two-package |
| **winnow** | Rust | combinator (no separate lexer) | ✅ `dispatch!` macro | ✅ generic `O` | ✅ `Located`/`&mut` | configurable | **`&mut` state**, inlined, monomorphized — 5-7× nom |
| **nom** | Rust | combinator | `alt` (+ v8 GATs) | ✅ | ✅ | configurable | functional `Fn(I)->Result<(I,O)>` |
| **chevrotain** | JS | ✅ (separate lexer) | ✅ **LL(k) lookahead TABLE** | ✅ CST/visitor | n/a (token objects) | error-recovery built in | **self-analyzing, no runtime closure composition** (fastest pure-JS) |
| **peggy / PEG.js** | JS | scannerless | ordered-choice | codegen AST | n/a | PEG-ordered | **codegen + packrat memo** (linear-time, left-recursion-hostile) |
| **tree-sitter** | C/Rust | ✅ | ✅ GLR | ✅ typed CST | ✅ | ✅ error-recovery | **incremental** (reparse log-time on edit) |
| **parse-that (engine)** | TS | ✅ `parseSingleValue`+`scan.ts` (dormant) | ✅ `dispatch` LUT (`leaf.ts:60-104`) | (combinator returns `T`) | ✅ `span.ts` family (548 lines) | ✅ catch-all combinators | **per-combinator closure** (parsimmon model) + zero-alloc leaves |
| **value.js (CSS parser)** | TS | ❌ 3-pass (`stylesheet.ts:87,183,212`) | ❌ 66 `any()` sites | ✅ `ValueUnit`/`Color` graph | ❌ materializes substrings (`leaf.ts:213`) | ✅ `CSSString` catch-all + unknown-at-rule | inherits parse-that closures; speculative `any()` |

**The reading.** parse-that's *engine* (penultimate row) sits **on the SOTA side of every
column** — it has the dispatch, the single-pass reader, the spans, the forgiving posture.
value.js's *CSS parser* (last row) **inverts four of the six** (no tokenize-once, no
dispatch, no spans, multi-pass) — exactly the px-vj-css-parser PX-2/PX-3/PX-4/PX-5 finding,
here placed in the comparative frame that shows it is not a parse-that deficiency but a
value.js **non-adoption**. The field did not move past parse-that's primitives; value.js
declined to use them.

### 1.2 What each library teaches, specifically (the non-redundant lessons)

- **lightningcss** (Rust, on Mozilla's `cssparser`): the whole-sheet SOTA. 4.16 ms for
  Bootstrap-4 minify (thousands of rules). Its win is **monomorphized combinators over a
  borrowed `&str`** — exactly the model parse-that's *Rust port* realizes (px-parse-that-arch
  §6) and JS cannot. **The lesson is NOT "rewrite in Rust" — it is the SHAPE (token stream
  + typed value + borrow), which is language-independent and already in parse-that's TS.**
  The WASM build (`lightningcss-wasm@1.30.1`) is the deployment trap (§3, LIB-5).

- **csstree** (JS): the **existence proof that the SOTA shape is achievable in pure JS at
  speed.** "Tokenize once, reuse"; `(type, start, end)` offset tokens (spans by another
  name); **"parsing is tolerant by default … any text may be parsed with no raised
  exception"**; `onParseError` callback + `Raw` node for unparseable content; tunable detail
  level (`parseValue`/`parseCustomProperty` flags). This is the single most relevant external
  reference for value.js because it proves a JS CSS parser can be tokenize-once + span-based
  + forgiving-with-diagnostics **without** WASM. It is the template value.js's PX-2 adoption
  and px-kf-grammar's PX-5 diagnostics channel should mirror.

- **`@csstools/css-tokenizer` + `css-parser-algorithms`** (JS): the **CSS-WG-spec-aligned**
  reference (implemented from CSS Syntax L3, CRD-20211224). It enforces the spec's
  separation — a tokenizer package and a parser-algorithms package — and is **"forgiving and
  won't stop when a parse error is encountered; parse errors aren't tokens; to receive
  parsing-error information you set a callback."** This is the **normative** version of
  csstree's tolerant posture. For value.js the lesson is: the forgiving-no-throw +
  error-callback contract is not a csstree quirk, it is the **spec-mandated** CSS parsing
  behavior — and it is the right home for the px-kf-grammar PX-5 diagnostics handoff (the
  `onParseError`-shape sink kf needs but value.js currently routes to `console.error`).

- **winnow** (Rust): the **external corroboration of parse-that's own direction** (LIB-3).
  Its two headline wins are *literally* what parse-that's leaf tier and the sibling waves
  propose: the **`&mut I` state model** ("the return type's size is independent of the size
  of `I`" — parse-that has the mutable single-`ParserState`, `state.ts:21-117`) and the
  **`dispatch!` macro** ("when you want a match statement for parser branches with unique
  prefixes instead of a giant if/else-if ladder … to avoid `alt` overhead" — this is exactly
  value.js's 66 `any()`→`dispatch` handoff). winnow's measured 97 µs JSON vs nom's 341 µs
  (5-7×) is the same `&mut`+inline+dispatch recipe. **winnow is the proof, in a shipping
  SOTA Rust library, that the sibling waves point at the right primitives.**

- **chevrotain** (JS): the **one fundamentally-different-and-faster JS model, and the KILL**
  (LIB-2). It is the fastest pure-JS toolkit precisely because it is **not** a runtime
  combinator composer — it self-analyzes the grammar at `performSelfAnalysis()` and **builds
  cached LL(k) lookahead functions / tables** (chevrotain `lookahead.ts`; docs: "the grammar
  structure is recorded … allowing the parser to dynamically create and cache lookahead
  functions"). This is the *table-driven* end-state — interestingly, the **same destination
  the staged-combinator frontier reaches by a different route** (LIB-4). But adopting
  chevrotain's model means imperative rule-methods, no algebraic `.then`/`.or` composition —
  a *different library*. parse-that benchmarks against it (`test/benchmarks/chevrotain.ts`)
  precisely to know the gap, not to become it. **KILL: do not chevrotain-ize parse-that.**

- **peggy / PEG.js** (JS): the **anti-pattern reference.** PEG.js/peggy is **codegen +
  packrat-by-default** — it generates a parser and memoizes `(rule, position)` for linear
  time, and is **left-recursion-hostile** ("for peggy and PEG.js, left recursion should be
  avoided"). This is the SOTA datapoint that **vindicates the sibling KILL of parse-that's
  dead packrat** (px-parse-that-arch §3, px-vj-css-parser PX-1): even the packrat-native
  toolkits drop left-recursion, and packrat's per-position memo is overhead on the LL(1)-ish
  CSS value grammar once dispatch removes the speculative retries. parse-that benchmarks
  peggy too (`test/benchmarks/peggy.ts`).

- **tree-sitter** (C/Rust): the **incremental-parsing reference, BOOKED-not-relevant.**
  tree-sitter's GLR + incremental reparse (log-time on an edit) is the SOTA for *editor
  syntax trees over large evolving buffers*. The staging frontier's provocative claim
  (LIB-4 source) is that **"millisecond-scale parsing could eliminate the need for
  incremental parsing strategies"** — and for kf this is decisive: kf parses *tiny strings*
  at compile time (`frame-compiler.ts:314`, a 2-11-stop keyframe block), not a 10k-line file
  on every keystroke. **Incremental parsing solves a problem kf does not have.** RECORD as
  not-applicable; the editor re-parses a small generated CSS string, which a fast single-pass
  reader handles whole.

---

## 2. The compile-combinators-to-a-table frontier — the charter's named lever (LIB-4, deep)

The charter explicitly asks about "the compile-combinators-to-a-table / partial-eval
frontier." **No prior F or E lane addresses it.** It is the most architecturally interesting
finding in this lane, and it reframes px-parse-that-arch §2's verdict ("there is no pure-TS
transposition that meaningfully changes parse-that's cost model").

### 2.1 What it is

A combinator grammar (parse-that's `.then`/`.or`/`many`/`any`) is, at runtime, a tree of
closures that re-interpret the grammar on every parse — the per-combinator closure cost
px-parse-that-arch §2 names. **Staged parser combinators** apply *partial evaluation*
(staging / metaprogramming): the grammar is known at build time, so you can **specialize it
into first-order code once**, computing the **first-sets and a dispatch table at staging
time** and emitting a flat recursive-descent function with no closure indirection and no
runtime alternation retries. The literature line:

- **Jonnalagedda et al. (2014/2015), "Staged Parser Combinators"** — a staged parser runs
  **~50% faster than a hand-written recursive-descent parser and >25× faster than the
  un-staged combinator version**; CPS-encoding makes control flow explicit and "continuations
  are fully evaluated at compile time" — "deeply rooted in partial evaluation … mirroring the
  First Futamura Projection."
- **Parsley / `flap` (2019-2021), "Obliteratingly Fast Parser Combinators"** — fuses lexing
  and parsing, "generates specialized **token-free** code that runs **3-9× faster than
  lex+yacc**"; an IR makes "all the invariants needed for fast code generation lexically
  apparent."
- **Parsley (Willis/Wu, ICFP)** — *staged selective* parser combinators: the selective
  applicative structure exposes enough static grammar information to stage the dispatch.

The destination — a **first-set-keyed dispatch table + flat first-order code** — is *the
same table-driven end-state chevrotain reaches by self-analysis* (LIB-2) and *the same
first-char dispatch parse-that already hand-writes in `parseSingleValue`* (`value.ts:11-87`).
The three roads (staging, self-analysis, hand-writing) converge on one shape. **This is the
deep "why" behind the whole sibling Wave A:** `any()`→`dispatch()` is the *manual, per-fork*
version of what staging does *automatically, whole-grammar*.

### 2.2 Honest portability to parse-that (the px-parse-that-arch §2 correction)

px-parse-that-arch §2.3 concluded "the only SOTA improvement to the cost model itself is
compile-time monomorphization, which JS cannot express." That is **half-right**: JS cannot
monomorphize *types*, but JS **can stage** — a `Parser.compile()` that walks the
construction-time combinator tree (it already exists as a graph via `ParserContext`,
`state.ts:168-178`) and emits, once, a specialized closure (or a `new Function` codegen) with
the first-char dispatch pre-baked and the dead `any()` retries elided. The Scala/OCaml
staging work uses LMS/MetaOCaml; the JS analogue is **build-time codegen** (the chevrotain
route without chevrotain's API) or a **runtime `compile()` that fuses the grammar into one
function**. parse-that's own **Rust port is itself a hand-staged instance** — it is what the
grammar looks like after the closures are compiled out.

### 2.3 Disposition — BOOK (parse-that), the real long-horizon cost-model SOTA

This is **not an F-ship and not even a near-term value.js handoff** — it is a parse-that
research-grade tranche: a `compile()`/staging pass over the combinator tree. The honest
sizing: it is the *only* lever that addresses the per-combinator-closure cost
px-parse-that-arch §2 correctly identifies as parse-that's defining non-SOTA property — but
it is a multi-month engine project with a real correctness blast radius (the staged code must
be provably equivalent to the interpreted grammar). **The pragmatic 90% of its win is already
reachable far cheaper:** the sibling Wave-A `dispatch` adoption captures the
first-char-dispatch portion (the dominant cost, p-parse-perf-F's 3.65×) *manually, per fork*,
with no staging machinery. **So: BOOK the staged-compile as the named cost-model SOTA
frontier; SHIP the manual dispatch (sibling Wave A) as the 90% that needs no research.** The
falsifiable gate if the BOOK is ever opened: the staged parser is output-deep-equal to the
interpreted parser over the full value.js + JSON/CSV/CSS benchmark corpus, and the
`test/benchmarks/` cohort shows the >25×-over-un-staged the literature claims (or it is not a
real staging win). **Disposition: BOOK (parse-that) — the one frontier lever no sibling named;
explicitly subordinate to the cheap manual dispatch for F.**

---

## 3. The rewrite-vs-transpose decision — the honest cost/benefit ledger (LIB-5 + LIB-6)

The charter's core ask: re-examine the E WASM decline with current evidence, and decide
(a) WASM-rewrite vs (b) transpose-in-place. Here is the **structured ledger** the prior
lanes gestured at but never tabulated.

### 3.1 Option A — Rust→WASM rewrite of the value.js parser

| Axis | Honest assessment | Source |
|------|-------------------|--------|
| **Engine exists?** | parse-that has a **real, benchmarked typed-AST Rust CSS parser** (`rust/parse_that`, benched vs lightningcss/cssparser/nom/winnow/pest — `benches/competitors/{lightningcss,winnow,nom,pest,cssparser}.rs`) — **but unbuilt for WASM**: re-verified live, the `rust/parse_that/Cargo.toml` has **no `crate-type`/`cdylib`/`wasm_bindgen`** (grep = 0). | live `Cargo.toml`; px-parse-that-arch §6 |
| **Marshalling cost** | lightningcss-wasm's own dominant cost is `TextEncoder`/`TextDecoder` string↔heap copy ("each `Uint8Array` comes with 200 bytes of overhead"; the copy "is still overhead"). Amortized over Bootstrap-4 (one crossing, thousands of rules); **paid per-value for kf** (`parseCSSValueUnit("12px")`, the per-frame `getComputedStyle` re-parse). | lightningcss-wasm npm; HN |
| **Return-graph cost** | **The fatal one, specific to value.js.** lightningcss returns a **string** across the boundary. value.js returns **live mutable `ValueUnit`/`FunctionValue`/`Color` object graphs** (the interp carrier kf mutates per-frame). A WASM parser must **reconstruct that graph in JS** across the boundary — an unbounded per-call cost lightningcss never pays. | px-parse-that-arch §6; value.js `units/index.ts` |
| **Workload fit** | kf parses **per-value, at compile time** (`frame-compiler.ts:314`), tops out at 11 stops (`bench/parser.bench.ts`); the one per-frame parse is value.js's computed-unit re-parse (one tiny string/tick). WASM wins on **whole-buffer** ingestion; kf does none. | p-parse-perf-F §1; r-css-parsers-wasm F-4 |
| **Bundle floor** | WASM adds a 40-50 KB binary + glue floor; kf's whole *point* is a light bundle (`proof:boundary` guards a value.js-free barrel). | r-css-parsers-wasm F-4 |
| **Platform fallback** | The browser's own parser (CSS Typed OM `CSSStyleValue.parse()`) is **STILL not-Baseline 2026** (Firefox lacks it) — no zero-cost platform shortcut exists either. | MDN; r-css-parsers-wasm F-4 |
| **Net** | **NEGATIVE for kf's workload.** The Rust port is SOTA *for whole-buffer Rust-side parsing* (a CLI/build-tool/server) — the **wrong tool** for a per-token JS hot path. | — |

### 3.2 Option B — Transpose parse-that/value.js toward the SOTA combinator shape, in pure TS

| Axis | Honest assessment | Source |
|------|-------------------|--------|
| **Primitives exist?** | **Yes, in-tree, exported, typed.** `dispatch` LUT (`leaf.ts:60-104`), the `parseSingleValue` single-pass first-char reader (`parsers/css/value.ts:11-87`) + `scan.ts` charCode scanners, the full `span.ts` zero-copy family. value.js imports **none** of them. | px-vj-css-parser PX-2/PX-5; verified live |
| **Cost** | **Cheap + isomorphic** for the dispatch/span/single-pass wins (sibling Wave A: deep-equal gate over the corpus). The full `parseSingleValue`-adoption is a **multi-week parity-gated** transposition (px-vj-css-parser PX-2 names the producer half: export `parseSingleValue` + write one `CssValue→ValueUnit` adapter). | E handoff Wave A; px-vj-css-parser §2,§10 |
| **Measured win** | `any()`→`dispatch` is **3.65× at the tail**, 6× branch-position spread on the dominant value shape (p-parse-perf-F F-P1); the unit `any(istring)` is the larger *measured* cold cost (`px` 583 ns → `cqmax` 2435 ns — r-css-parsers-wasm F-2). | p-parse-perf-F; r-css-parsers-wasm F-2 |
| **No marshalling, no graph reconstruction, no bundle floor** | Pure-TS: zero boundary, zero `TextEncoder`, zero 50 KB floor, zero `ValueUnit`-graph rebuild. | — |
| **Frontier ceiling** | The staged-compile (LIB-4) is the long-horizon BOOK that would close the last gap (per-combinator closure) — but the manual dispatch captures ~90% of it now. | §2 |
| **Net** | **POSITIVE.** Cheap, isomorphic, measured, sibling-charted; the faster machine is already in the dependency graph. | — |

### 3.3 The verdict (LIB-6)

**TRANSPOSE (Option B). The WASM rewrite (Option A) is correctly DECLINED — re-examined,
not reflexively.** The decision is not close: every SOTA reference that is *fast in JS*
(csstree, `@csstools`, chevrotain) achieves it **without WASM**, by the in-language shape
parse-that already hand-writes; the Rust ports (parse-that's own, lightningcss) are SOTA for
a workload kf does not have (whole-buffer ingestion); the platform parser is not-Baseline; and
the value.js return-graph makes the marshalling tax *worse* than lightningcss's already-fatal
per-call cost. The transpose path is cheap, measured, isomorphic, and uses machines that
**already exist in the dep chain**. **This re-confirms and structurally grounds the E decline
— with the full ledger the charter asked for, not a reflex.**

---

## 4. The handoff shape this lane contributes (sequenced, cross-repo)

This lane proposes **no new handoff items** the siblings haven't charted — its contribution
is the **landscape grounding and the decision**. It re-affirms the sibling sequencing and
adds the one BOOK frontier (LIB-4):

| Seq | Item | Repo | This lane's contribution | Disposition |
|-----|------|------|--------------------------|-------------|
| 1 | `any()`→`dispatch` at the color/value/unit/math forks | value.js | **winnow's `dispatch!` is the shipping-SOTA external proof** this is the right primitive (LIB-3); chevrotain/staging show it is the *table-driven destination* the whole field reaches (LIB-2, LIB-4) | value.js-HANDOFF (sibling Wave A) |
| 2 | Span leaves + single-pass stylesheet | value.js | **csstree's `(type,start,end)` offset tokens are the shipping-JS proof** spans work at speed without WASM (LIB-1) | value.js-HANDOFF (sibling Wave A) |
| 3 | Adopt `parseSingleValue` as the value layer (export + `CssValue→ValueUnit` adapter) | parse-that + value.js | **lightningcss/csstree's typed-value-per-shape is the convergence target** parse-that's reader already matches (LIB-1) | value.js-HANDOFF (px-vj PX-2, multi-week) |
| 4 | Forgiving-parse **diagnostic sink** (`onParseError`-shape) | value.js + kf | **csstree's `onParseError` + `@csstools`'s spec-mandated "forgiving, errors via callback"** is the normative template for the px-kf-grammar PX-5 diagnostics channel — and the right home for the `console.error` leak (r-css-parsers-wasm F-7) | value.js-HANDOFF + kf BOOK (px-kf PX-5) |
| 5 | **Staged-combinator `compile()`** | parse-that | **The cost-model SOTA frontier no sibling named** (LIB-4) — the principled whole-grammar form of the manual dispatch | **BOOK (parse-that)** — research-grade, subordinate to #1 for F |
| — | Rust→WASM rewrite | — | **The full A-vs-B ledger** (§3) | **KILL (recorded)** |
| — | chevrotain-codegen rewrite | — | Different product; abandons the combinator algebra (LIB-2) | **KILL (recorded)** |

---

## 5. ALREADY-SOTA — manufacture no work (the KISS clause)

Stated plainly, so this lane invents nothing where the stack already leads:

- **parse-that's engine is on the SOTA side of every comparative column** (§1.1) — the
  `dispatch` LUT, the `parseSingleValue` single-pass reader, the `span.ts` family, the
  forgiving combinator posture, the zero-alloc leaves, the `&mut` single-state model (winnow's
  own headline win). The field did not move past it; value.js declined to use it. **Do not
  churn the engine** (consume px-parse-that-arch §1's "leaf tier ALREADY-SOTA" verdict).
- **parse-that benchmarks against the actual field** — `test/benchmarks/{chevrotain,peggy,
  ohm,nearley,parsimmon,arcsecond,parjs}.ts` + `wasm-{json,format}.bench.ts`. It is a
  measured, self-aware library, not a guess. **No measurement work to manufacture.**
- **The WASM decline is correct** (§3) — do not build the Rust→WASM bridge; do not chase
  chevrotain codegen; do not adopt tree-sitter incremental (kf has no large evolving buffer).
- **value.js's grammar COVERAGE is broad + modern** (15 color spaces, L4 math, `@property`,
  scroll ranges) — the gap is the value-leaf *mechanism* (transpose), not the feature set.
- **The kf consumption seam is ideal** — kf delegates all CSS parsing to value.js
  (`frame-compiler.ts:143`, `engine.ts:55`, `utils.ts:205`) behind `lerpValue → iv._lerp`, so
  value.js can swap the entire parser internals (any transpose above) with **zero kf edits**.
  The one exception (the kf-private easing regexes) is the r-css-parsers-wasm F-1 / px-kf PX-4
  handoff, already charted.

---

## 6. inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/parsing/px-parser-sota-libs.md` and made **ZERO**
source edits to keyframes.js, value.js, or parse-that. Every in-tree claim is `file:line`-cited
against the live trees (`/Users/mkbabb/Programming/parse-that/typescript/src/parse`,
`/Users/mkbabb/Programming/value.js/src/parsing`, this repo's `src/animation`), re-grounded
2026-06-06 — including the **verified-live** facts: `parseSingleValue` exists at
`parsers/css/value.ts:11-87`, `dispatch` at `leaf.ts:60-104`, the parse-that Rust crate has
**no `cdylib`/`wasm_bindgen`** in `rust/parse_that/Cargo.toml`, the 66 live `any()` sites in
value.js `src/parsing`, and value.js's only `dispatch` token being an unrelated color-space
*module* import (`color.ts:28`), not the parse-that `dispatch` combinator. Every value.js /
parse-that item is a **HANDOFF proposal** the respective `@mkbabb` owner sequences; the one
frontier item (LIB-4 staged-compile) is a **parse-that BOOK**. Sibling-lane findings (the
dispatch adoption, the spans, the dead packrat, the WASM cost model, the `linear()` parser)
are **cited and diffed, never re-derived** — this lane is the library-survey + decision axis
beneath them. Every SOTA claim is web-sourced below.

## Sources

- **Live in-tree:** parse-that `typescript/src/parse/{leaf.ts:60-104,213, parsers/css/value.ts:11-87, parsers/css/scan.ts, span.ts, parser.ts, state.ts}`, `rust/parse_that/{Cargo.toml,benches/competitors/}`, `test/benchmarks/{chevrotain,peggy,ohm,nearley,parsimmon,arcsecond,parjs}.ts` + `wasm-{json,format}.bench.ts`; value.js `src/parsing/{units.ts:20,78, color.ts:28,556, index.ts:235, stylesheet.ts:87,183,212}`; kf `src/animation/{adapter.ts,utils.ts:205, frame-compiler.ts:143,314, engine.ts:55}`, `bench/parser.bench.ts`. Pins: `node_modules/@mkbabb/{parse-that@0.8.2,value.js@0.10.0}/package.json`.
- **Sibling F parsing lanes (DIFFED, not repeated):** `docs/tranches/F/audit/parsing/{px-parse-that-arch,px-vj-css-parser,px-kf-grammar}.md`; cross-tranche `docs/tranches/F/audit/{r-css-parsers-wasm,p-parse-perf-F,vj-parser-aug}.md`; E `docs/tranches/E/valuejs-sota-handoff.md` (Wave A).
- **lightningcss / cssparser:** <https://github.com/parcel-bundler/lightningcss>, <https://lightningcss.dev/> (Bootstrap-4 4.16 ms whole-sheet); `lightningcss-wasm` npm + <https://news.ycombinator.com/item?id=16688293> (`TextDecoder` single-copy overhead, 200-byte `Uint8Array` floor).
- **csstree:** <https://github.com/csstree/csstree>, <https://github.com/csstree/csstree/blob/master/docs/parsing.md> (tokenize-once, `(type,start,end)` offsets, "tolerant by default … no raised exception", `onParseError`/`Raw`, detail-level flags).
- **@csstools:** <https://www.npmjs.com/package/@csstools/css-parser-algorithms>, <https://github.com/csstools/tokenizer> (CSS Syntax L3 CRD-20211224; "forgiving, won't stop on a parse error; parse errors aren't tokens; callback for error info").
- **winnow / nom:** <https://epage.github.io/blog/2023/07/winnow-0-5-the-fastest-rust-parser-combinator-library/> (`&mut I` state model, 97 µs JSON vs nom 341 µs = 5-7×), <https://docs.rs/winnow/latest/winnow/combinator/macro.dispatch.html> (`dispatch!` "instead of a giant if/else-if ladder … avoid `alt` overhead").
- **chevrotain:** <https://github.com/Chevrotain/chevrotain>, <https://chevrotain.io/docs/features/llk.html>, `lookahead.ts` (self-analyzing LL(k), `performSelfAnalysis()` builds + caches lookahead tables, "NOT a parser generator … without code generation").
- **peggy / PEG.js:** <https://inspirnathan.com/posts/161-peg-parser-for-math-expressions-with-peggy/>, <https://www.oscar.nierstrasz.org/files/slides/2024-04-09-PEGs.pdf> (packrat memo for linear time; left-recursion to be avoided).
- **tree-sitter / incremental PEG:** <https://people.seas.harvard.edu/~chong/pubs/gpeg_sle21.pdf>, <https://zyedidia.github.io/notes/yedidia_thesis.pdf> (incremental reparse log-time on edit).
- **Staged combinators (the compile-to-table frontier, LIB-4):** <https://semantic-domain.blogspot.com/2021/12/obliteratingly-fast-parser-combinators.html> (`flap`, "specialized token-free code … 3-9× faster than lex+yacc"), <https://moleike.github.io/blog/staged-parser-combinators/> + <http://manojo.github.io/2015/09/02/staged-parser-combinators> (Jonnalagedda, ~50% over hand-written RD, >25× over un-staged, First Futamura Projection), <https://mpickering.github.io/papers/parsley-icfp.pdf> (Parsley, staged selective combinators).
- **CSS Syntax spec:** <https://www.w3.org/TR/css-syntax-3/> (the tokenize-once + forgiving model the field implements). **Platform parser:** MDN `CSSStyleValue.parse()` / CSS Typed OM — not-Baseline 2026.
