# Tranche F PARSING-SOTA deep-dive — lane `px-parse-that-arch`

**Lane scope.** `@mkbabb/parse-that` **itself** — the parser-combinator *library* one
layer below value.js, two below keyframes.js. Not its consumption (sibling lanes own
that), not value.js's grammar (sibling lanes own that): the `Parser<T>` design, the
combinator algebra, the `ParserState`/`Span` model, the cost model (closure allocation,
backtracking, the `any()` linear scan, memoization/packrat), and the SOTA frontier
(parsimmon, chevrotain, peggy/PEG.js, nom/winnow, the packrat-memo + left-recursion
literature). The transpositions that would make parse-that SOTA — as a **parse-that
hand-off** (inv-16: I propose, I never write parse-that or value.js source).

**Method (inv ε — verify, do not assert).** Every claim is `file:line`-grounded against
the live trees. Two distinct parse-that artifacts exist and the distinction is
load-bearing:
- **Source** at `/Users/mkbabb/Programming/parse-that/typescript/src/parse/` (HEAD;
  `leaf.ts` mtime 2026-03-30) — the modules: `parser.ts`, `leaf.ts`, `span.ts`,
  `state.ts`, `lazy.ts`, `utils.ts`, `split.ts`, `debug.ts`, `parsers/`.
- **Installed dist** at `keyframes.js/node_modules/@mkbabb/parse-that/dist/` and
  `value.js/node_modules/@mkbabb/parse-that/dist/` — both pinned `0.8.2`, both **a
  staler build** than the source (dist `parse.js` mtime 2026-03-10, 20 days behind the
  source). This is the code kf/value.js actually run.
- **Rust port** at `/Users/mkbabb/Programming/parse-that/rust/parse_that/` — a separate,
  SIMD-accelerated, arena-allocating implementation benchmarked against nom/winnow/pest/
  lightningcss. It is the project's own statement of where SOTA performance lives.

Every SOTA claim is grounded against the live source of the named competitor or the
literature (sources at the end).

**Relationship to the sibling F + E lanes (diff, never repeat).** The dispatch-adoption
(`any()`→`dispatch()`), the `istring` non-anchor, the `console.error` leak, and the WASM
decline are **value.js-consumption** findings the sibling lanes own and measure
(`p-parse-perf-F.md` F-P1/F-P5, `vj-parser-aug.md` §2, `r-css-parsers-wasm.md` F-2/F-4/
F-7, the E `valuejs-sota-handoff.md` Wave A). **I do not re-derive them.** They all
land *on* parse-that's exported surface; my lane audits the *engine that exports it* —
the closure cost model, the global mutable state, the dead-but-tested packrat, the
span-family completeness, and the source↔dist↔Rust drift. Where a sibling finding has a
parse-that-side *root*, I name the root (and the fix's correct home) without re-measuring
the consumer-side number.

---

## §0. Headline — what parse-that IS, stated honestly

parse-that is a **mature, performance-conscious, parsimmon-lineage mutable-state
combinator library** that is, in its hot leaf tier, **already at or near JS-combinator
SOTA** — and it knows it: it ships a 11-way self-benchmark against arcsecond, chevrotain,
nearley, ohm, parjs, parsimmon, and peggy (`typescript/test/benchmarks/`), plus a
*separate Rust port* benchmarked against nom/winnow/pest/lightningcss/cssparser/simd_json
(`rust/parse_that/benches/competitors/`). This is not a toy. The audit's job is to find
the **architectural seams that the SOTA frontier has moved past**, honestly separating
the ALREADY-SOTA from the genuinely-not.

The disposition headlines (full table at §8):

1. **The leaf tier is ALREADY-SOTA.** Mutable single-state with offset-rewind
   (`state.ts:21-117`), zero-alloc `string`/`regex`/whitespace leaves (`leaf.ts:138-262`),
   the `Int8Array(128)` first-char `dispatch` (`leaf.ts:60-104`), the flag-fast-path
   `call()` (`parser.ts:501-544`), and a numeric `(id<<20)|offset` memo key
   (`parser.ts:74-76`). This is the parsimmon/nom-grade hot path. **Manufacture no work
   here.** (§1.)

2. **parse-that's defining cost is the per-combinator closure allocation** — every
   combinator (`then`/`or`/`map`/`many`/…) `new Parser`s a fresh closure capturing its
   children (`parser.ts:149-774`). This is the *parsimmon model* and the *opposite* of the
   nom/winnow *zero-cost-trait-composition* model the Rust port realizes. It is paid
   **once at grammar-construction**, not per-parse — so for a static grammar (value.js/kf)
   it is a one-time startup cost, not a hot-path cost. **The honest call: this is fine for
   parse-that's JS workload; the only SOTA transposition that helps is the one the project
   already built — the Rust port.** (§2.)

3. **The packrat / left-recursion machinery is DEAD on every production path but
   TESTED in isolation** — `.memoize()`/`.mergeMemos()` (`parser.ts:83-147`) plus the
   module-global `MEMO`/`LEFT_RECURSION_COUNTS` maps (`parser.ts:19-20`) have **zero
   call-sites** in parse-that's own `src/`, in value.js, in keyframes.js, AND in the BBNF
   grammar generators (`bbnf-lang`, `bbnf-buddy`) — the only consumer is
   `test/memoize.test.ts`. The README's headline "Handles left recursion" is backed by a
   *test*, not a live grammar. **And the Rust port — the SOTA-performance statement —
   drops left-recursion/packrat entirely** (no `memoize`/`seed`/`grow` in `rust/.../src`).
   This is the clearest single architectural signal in the codebase: SOTA = non-backtracking
   LL(1)-with-dispatch, and parse-that's own fast lane already votes that way. (§3.)

4. **The error/diagnostic substate is MODULE-GLOBAL mutable singletons** — `lastState`,
   `lastFurthestOffset`, `lastExpected`, `collectedDiagnostics` are file-scoped `let`s in
   `utils.ts:31-35,146` mutated by every `mergeErrorState` during a parse and reset by
   `Parser.reset()` (`parser.ts:41-45`). Combined with the global `MEMO`, this makes a
   single `Parser.parse()` call **non-reentrant and non-concurrent**: you cannot parse two
   inputs interleaved, and a parser that *itself runs a sub-parse* mid-rule corrupts the
   furthest-offset tracking. This is the one genuine **architectural soundness** finding —
   the SOTA model (nom/winnow/the Rust port) threads all of this through the `&mut State`,
   never globals. **parse-that-HANDOFF (HIGH, architectural).** (§4.)

5. **The Span subsystem is a near-complete second combinator algebra — but it is
   PARTIALLY UNPUBLISHED and creates a two-world maintenance surface.** `span.ts` mirrors
   the value combinators with zero-substring-alloc twins (`regexSpan`, `manySpan`,
   `sepBySpan`, `wrapSpan`, the full assertion family `negateSpan`/`peekSpan`/`notSpan`/
   `minusSpan`/`lookAheadSpan`, plus `takeUntilAnySpan`/`altSpan`). But the **installed
   dist 0.8.2 exports only 8 of the 15** (`index.d.ts` ships `stringSpan…nextSpan`, omits
   `altSpan`/`takeUntilAnySpan`/the assertion family) while **the same version number**
   in source exports all 15. Source↔dist version drift with no bump. The SOTA answer is
   not "two parallel families" — it is **one span-first core** (the Rust port's model:
   every leaf returns `Span<'a>`, materialization is a consumer concern). (§5.)

6. **The Rust port IS the SOTA frontier, in-tree, unbuilt for the JS consumer** — SIMD
   whitespace bitmaps (`scanners.rs`), 64-byte-padded zero-bounds-check input
   (`state.rs:47-90`), a polymorphic bump-slab arena (`bump_slab.rs`), memchr/aho-corasick
   scanners, byte-class dispatch — benchmarked against winnow/nom/pest with `divan`. The
   WASM bridge is **declined** (sibling lanes measure the marshalling tax; I re-confirm the
   *architectural* reason: the Rust port's wins are arena + SIMD + zero-copy spans over a
   **whole buffer**, none of which survive a per-token string-in/struct-out WASM call).
   But the port is a **design oracle**: it shows precisely which TS transpositions are
   real (spans, dispatch, padded scan-ahead) and which are not (packrat). (§6.)

---

## §1. The leaf tier — ALREADY-SOTA, do not churn

The hot primitives are at or beyond the JS-combinator field:

- **Mutable single-`ParserState`, offset-rewind backtracking** (`state.ts:21-117`). One
  state object threads through the whole parse; combinators save/restore `state.offset`
  (`parser.ts:151,175,255`, …) rather than allocating a new immutable state per step. This
  is strictly faster than parsimmon's `{input, index}` reconstruction and arcsecond's
  immutable `ParserState` — it is the nom/winnow `&mut` model expressed in JS. **SOTA.**

- **Zero-alloc leaves** (`leaf.ts`):
  - `string()` (`:138-176`) — single-char fast path via `charCodeAt` compare (`:147-157`),
    multi-char via `startsWith(str, offset)` (`:160`). No substring until success.
  - `regex()` (`:180-232`) — re-flags to sticky `y` once at construction (`:185`),
    `test()` on the default path advances `lastIndex` **without allocating a
    RegExpMatchArray** (`:207-221`), `exec()` only when a custom match-fn needs the array.
  - `trimStateWhitespace()` (`:235-254`) — charCode loop with a fast-exit when the first
    char is non-WS (`:241`). No regex engine entry for the common case.

- **`dispatch()`** (`:60-104`) — the `Int8Array(128)` first-char LUT with `"0-9"` range
  and multi-char key support. This is the O(1) alternation the whole SOTA field (csstree,
  @csstools, lightningcss, winnow's `dispatch!`) converges on, and it is **already built
  and exported**. The sibling lanes correctly note value.js *doesn't consume it* — but
  parse-that's own reference JSON parser **does** (`test/benchmarks/parse-that.ts:26-37`
  dispatches `{`/`[`/`"`/`-`/`0-9`/`t`/`f`/`n`). The primitive is SOTA and proven in-house.

- **Flag-based `call()`** (`parser.ts:501-544`) — `flags===0` calls the parser directly
  (the overwhelming common case, zero overhead), `FLAG_TRIM_WS` is a dedicated fast path
  (`:506-518`), multi-flag is a cold path (`:519-543`). This is exactly the Rust port's
  `call()` shape (`rust/.../parse.rs:81-95`, the `#[inline(always)]` `flags==0` fast
  return), ported faithfully to JS. **SOTA.**

- **`many`/`sepBy` pre-sized arrays + zero-progress guards** (`parser.ts:589-702`) —
  `many` pre-allocates `new Array(min)` when `min>0` (`:592`), breaks on zero-offset
  progress to avoid infinite loops on nullable inners (`:604`), trims over-allocation
  (`:614`). `sepBy` is strictly-interleaving with a checkpoint-before-separator that
  correctly rejects trailing separators (`:660-684`) — a soundness subtlety many
  combinator libs get wrong (and parse-that's git log shows it was *fixed*: commit
  `597476f` "soundness audit — sep_by trailing"). **SOTA + correct.**

**Disposition — §1 entire: ALREADY-SOTA. Manufacture no parse-that work in the leaf
tier.** Every transposition below is *above* this layer (the state model, the dead
packrat, the span duplication), not in it.

---

## §2. The cost model — per-combinator closure allocation (the parsimmon model)

### 2.1 What it is

Every combinator method returns `new Parser(closure, context)` where the closure captures
`this`, the argument parsers, and re-reads `state` on each call:

- `then` (`parser.ts:149-171`), `or` (`:173-190`), `map` (`:210-224`), `skip` (`:253-274`),
  `many` (`:589-629`), `sepBy` (`:635-702`), `wrap` (`:456-495`), `trim` (`:546-587`) — each
  allocates **one closure + one Parser wrapper + one ParserContext** at construction.

So a grammar of N combinator applications allocates ~3N objects **at build time**. For
value.js's grammar (58 `any()` sites + the full unit/color/math tree) that is a few
thousand objects — **once, at module load**, never per-parse. The closures themselves run
on the hot path, but they allocate nothing per-invocation beyond the result array in
`many`/`all`.

### 2.2 Where this sits vs SOTA

- **parsimmon / arcsecond / parjs (JS):** identical model — combinators build closures.
  parse-that is **faster** than all of them on the leaf tier (§1) because of the mutable
  state and zero-alloc leaves; the self-benchmark (`test/benchmarks/`) is the evidence.
  Against this cohort parse-that is **ahead**.
- **chevrotain (JS):** a different model — a *self-analyzing* LL(k) engine that builds a
  grammar graph and computes lookahead tables, avoiding per-rule closure dispatch. It is
  the fastest pure-JS parser toolkit precisely because it does **not** compose closures at
  runtime. parse-that does not compete on chevrotain's terms and should not — chevrotain's
  ergonomics (imperative rule methods, no algebraic composition) are a different product.
- **nom / winnow (Rust):** zero-cost — combinators are *traits monomorphized at compile
  time*, no closure allocation, no dispatch indirection. **This is the model the Rust port
  realizes** (`rust/.../parse.rs:41-53`: `ParserFn` blanket impl over `Fn`, `SmallBox<dyn
  ParserFn, S32>` inlines small closures into a 32-byte inline buffer — `:62` — avoiding
  heap allocation for the common combinator). The Rust port is *the* SOTA transposition of
  parse-that's cost model, and it already exists.

### 2.3 The honest disposition

The closure-allocation cost is **the parsimmon model**, it is **construction-time not
hot-path**, and for a static grammar it is invisible. The only SOTA improvement to the
*cost model itself* is compile-time monomorphization, which JS cannot express — and the
project already answered this by writing the Rust port. **There is no pure-TS transposition
that meaningfully changes parse-that's cost model without abandoning the algebraic
combinator API** (chevrotain-style code-gen would be a different library).

**Disposition — RECORD (ALREADY-SOTA for the JS workload).** The closure model is correct
for the static-grammar consumers; the Rust port is the cost-model SOTA and is in-tree. No
parse-that-HANDOFF here beyond §3/§4. The *one* micro-note (RECORD, do-not-action): the
`SmallBox<…, S32>` inline-closure trick in the Rust port has **no JS analogue** and should
not be chased — closures are already V8-inlined when monomorphic, and the `createParserContext`
allocation per combinator (`state.ts:168-178`) is the only avoidable build-time alloc (it
exists purely for `debug()`/`toString()` — §7).

---

## §3. The DEAD packrat — tested, unused, and the Rust port votes against it

This is the highest-confidence architectural finding.

### 3.1 The machinery

`parser.ts` carries a full packrat + bounded-left-recursion implementation:
- `MEMO = new Map<number, ParserState>` and `LEFT_RECURSION_COUNTS = new Map<number,
  number>` — **module-global** (`parser.ts:19-20`).
- `getCijKey` (`:74-76`) — the `(id<<20)|offset` numeric memo key (genuinely nice: no
  string alloc per lookup; the 20-bit offset / 11-bit id split is documented `:22-25`).
- `.memoize()` (`:83-119`) — packrat memo with `atLeftRecursionLimit` growth bound
  (`:78-81`): the classic Warth-style seed-and-grow left-recursion via a per-`(parser,
  offset)` count capped at remaining input length.
- `.mergeMemos()` (`:121-147`) — the companion for left-factored alternation.
- `Parser.reset()` (`:41-45`) clears both maps + the error state on **every** top-level
  `parse()` (`:48`).

### 3.2 It is dead on every production path

Grep is unambiguous:
- parse-that `src/` — **zero** `.memoize()`/`.mergeMemos()` call-sites outside the
  combinator definitions themselves (verified across `typescript/src/`).
- value.js `src/` — zero (the only `memoize` token is `utils.memoize()`, an unrelated
  *result*-cache decorator, `value.js/src/parsing/CLAUDE.md:66`).
- keyframes.js — zero (kf consumes value.js parsers as opaque `Parser`s).
- the BBNF grammar generators (`/Users/mkbabb/Programming/bbnf-lang`,
  `/Users/mkbabb/Programming/bbnf-buddy`) — **zero** `.memoize()` emission (verified; the
  one `memoize` hit in `bbnf-buddy/src/main.ts:27` is a comment).
- **The only consumer is `typescript/test/memoize.test.ts`** — four hand-written
  left-recursive grammars (`expr.or(digits).memoize()`, the `mSL`/`mZ`/`mY` mutual
  recursion, `s.then(sS).then(sS)`, the math grammar) that exercise the feature in
  isolation.

So the README's banner feature "**Handles left recursion and left factoring**" is real
*as a capability* but has **no live grammar using it** — it is validated by a unit test,
not exercised by any shipping parser.

### 3.3 The Rust port deletes it

The decisive signal: the **Rust port — the project's own SOTA-performance artifact —
implements no left-recursion or memoization at all** (no `memoize`/`seed`/`grow`/
`recursion`/`packrat` in `rust/parse_that/src/` or `rust/bootstrap/src/`). When the same
author rewrote parse-that for maximum performance, packrat was **dropped**, not ported.
This matches the literature: CSS-value grammars (value.js's whole surface) and the JSON/
CSV reference parsers are **LL(1)-ish** — no left recursion, single-token lookahead — and
once `dispatch` removes the speculative `any()` retries, packrat memoization is pure
overhead (it pays a `Map.get`/`Map.set` + clone per rule to cache results that are never
re-visited at the same offset in a non-backtracking grammar). The sibling `vj-parser-aug.md`
§2.4 reaches the same KILL verdict from the *value.js* side; I reach it from the
*parse-that engine* side and add the Rust-port corroboration.

### 3.4 The cost the dead machinery imposes today

It is not free even unused:
- `Parser.reset()` allocates/clears two global `Map`s on **every** top-level `parse()`
  (`:43-44`) — a tiny but real per-parse cost paid by value.js's per-token compile-time
  parses and the per-frame computed-unit re-parse.
- `parse()` always goes through `parseState` which always `reset()`s (`:48`) — so the
  `MEMO.clear()`/`LEFT_RECURSION_COUNTS.clear()` is on the hot path for the very workload
  (per-value parsing) that has no left recursion to memoize.
- It is **dead surface area** — 65 lines of subtle packrat invariants (`:83-147`) that any
  refactor must preserve or risk breaking the *tested* contract, with no shipping consumer
  to validate against in integration.

### 3.5 Disposition

**parse-that-HANDOFF (MED) — ISOLATE, do not silently delete.** The clean move is *not* a
blunt KILL (the test encodes a real, working capability the BBNF-lang feature could one
day want). The SOTA-idiomatic transposition is to **split packrat out of the default
parse path**:
- Make `.memoize()`/`.mergeMemos()` and the `MEMO`/`LEFT_RECURSION_COUNTS` maps a
  **separate, opt-in module** (`packrat.ts`) the BBNF generator imports *only when a
  grammar is detected left-recursive*, exactly as the Rust port omits it by default.
- The default `parse()`/`reset()` path then carries **no** `MEMO.clear()` — the
  non-backtracking grammars (value.js, kf, JSON, CSV) stop paying for a feature they never
  use.
- The `getCijKey` numeric-memo-key design (`:74-76`) is *good* and should survive into the
  opt-in module — it is the one piece worth keeping verbatim.

This is the gestalt no-legacy move: not "rip out left-recursion" (that loses a real,
tested capability), but "stop making every non-recursive parse pay packrat's reset tax."
The falsifiable gate: the `memoize.test.ts` grammars still pass through the opt-in path;
the JSON/CSV/CSS benchmarks show the per-parse `Map.clear()` gone from the hot loop.

---

## §4. The MODULE-GLOBAL mutable error/memo state — the genuine soundness finding

### 4.1 What is global

`utils.ts` holds the entire error/diagnostic substate as file-scoped mutable singletons:
- `lastFurthestOffset`, `lastState`, `lastExpected`, `lastSuggestions`,
  `lastSecondarySpans` (`:31-35`) — mutated by `mergeErrorState` on **every** failed
  branch during a parse (`:37-76`).
- `collectedDiagnostics` (`:146`) — the error-recovery accumulator, pushed by
  `collectDiagnostic` (`:153-178`), popped by `popLastDiagnostic` (`:188-190`).

Plus `parser.ts`'s `MEMO`/`LEFT_RECURSION_COUNTS` (`:19-20`) and the `PARSER_ID` counter
(`:17`). All module-global.

### 4.2 Why this is a soundness hazard, not just style

`Parser.parse(val)` calls `parseState` → `reset()` (clears all globals) → runs the parse
→ reads `getLastState()`/`getLastFurthestOffset()` to build the error display
(`parser.ts:47-68`). The furthest-offset error tracking is **correct only because
`reset()` runs at the very top and nothing else parses concurrently**. This breaks under
two real scenarios:

1. **Re-entrancy.** A parser whose `.map`/`.chain` callback *itself* invokes
   `someOtherParser.parse(subInput)` mid-rule (e.g. a value combinator that parses an
   embedded expression via a fresh top-level `.parse()`) calls `reset()` in the middle of
   the outer parse — **wiping the outer parse's furthest-offset and collected
   diagnostics**. value.js's grammar does not do this today (it composes via combinators,
   not nested `.parse()`), but it is an undocumented landmine: the API *invites* it (`.parse`
   is the public entry) and it silently corrupts diagnostics.
2. **Concurrency / interleaving.** Two parses cannot run interleaved (no async parser in
   JS today, but a streaming/incremental parser — the SOTA direction, see §6 — would need
   this). The globals make parse-that **fundamentally single-flight**.

This is *the* place parse-that diverges from SOTA. nom/winnow and the Rust port thread
**all** of this through `&mut ParserState` — `state.furthest_offset` is a field
(`rust/.../parse.rs:116`), diagnostics are `#[cfg(feature)]` fields on the state
(`rust/.../state.rs:36-45`), never globals. The `ParserState` class in TS *already has*
the right home: it carries `furthest` (`state.ts:30`) and `expected` (`state.ts:23`) as
**instance fields** — but `mergeErrorState` ignores them and writes the globals instead
(`utils.ts:38-39` writes `lastFurthestOffset`, only *backward-compat-mirrors* to
`state.expected` at `:50-53`). The instance fields are vestigial; the globals are
load-bearing. This is exactly backwards from SOTA.

### 4.3 Disposition

**parse-that-HANDOFF (HIGH — architectural soundness).** Move the furthest-offset /
expected-set / suggestions / collected-diagnostics off the module globals and onto the
`ParserState` instance (which already has `furthest` and `expected` fields ready). Then:
- `mergeErrorState(state, label)` mutates `state.furthest`/`state.expected` in place — no
  globals.
- `parseState` reads `state.furthest`/`state.expected` directly (it already has the state
  object, `parser.ts:50-67`).
- `reset()` shrinks to clearing only `MEMO`/`LEFT_RECURSION_COUNTS` (and per §3, those move
  to the opt-in packrat module — so `reset()` may disappear entirely on the default path).

This is the **direct port of the Rust port's already-correct model** — `state.furthest_offset`
is a field there. It makes parse-that re-entrant and (future) interleave-safe, removes the
diagnostics-corruption landmine, and deletes the global-reset tax. The falsifiable gate:
the full `css-diagnostics`/`css-recovery` test suite passes with state-threaded
diagnostics; a re-entrancy regression test (`outer.map(() => inner.parse(x))` preserving
outer furthest-offset) is added and passes. **Iso:** the error *outputs* are unchanged for
all single-flight parses (the entire current corpus); only the corruption-under-reentrancy
case changes (from wrong to right). The sibling lanes' `console.error` finding
(`p-parse-perf-F.md` F-P5, `parser.ts:59,63`) is downstream of this same error subsystem —
gating those two `console.error`s behind `isDiagnosticsEnabled()` is the cheap surface fix;
moving the state onto the instance is the architectural root that should carry it.

---

## §5. The Span subsystem — a second algebra, half-published, and the source↔dist drift

### 5.1 What exists

`span.ts` (548 lines) is a **complete parallel combinator family** that returns
`Span {start, end}` (`state.ts:8-11`) instead of materialized substrings — the zero-copy
model. It mirrors nearly the whole value algebra:
- leaves: `stringSpan` (`:16-37`), `regexSpan` (`:43-79`), `takeUntilAnySpan`
  (`:361-397`, a `Uint8Array(128)` byte-class scanner — the TS twin of the Rust
  `take_until_any_span`).
- structure: `manySpan` (`:85-120`), `sepBySpan` (`:126-188`), `wrapSpan` (`:193-232`),
  `optSpan`/`skipSpan`/`nextSpan` (`:240-313`), `altSpan` (`:323-354`).
- assertions: `negateSpan`/`peekSpan`/`notSpan`/`minusSpan`/`lookAheadSpan` (`:406-547`) —
  a full lookahead family, each commented as the twin of a named Rust function
  (`negate_span`, `peek_span`, …).

This is excellent SOTA-direction work: spans are exactly how lightningcss/csstree/the Rust
port avoid substring allocation — materialize lazily via `spanToString(span, src)`
(`state.ts:13-15`) only when the consumer needs the text.

### 5.2 The two problems

1. **Source↔dist version drift with no version bump.** The installed dist `0.8.2`
   (`keyframes.js/node_modules/.../dist/index.d.ts`) exports only **8** span functions
   (`stringSpan, regexSpan, manySpan, sepBySpan, wrapSpan, optSpan, skipSpan, nextSpan`) —
   it **omits** `altSpan`, `takeUntilAnySpan`, and the entire assertion family. The source
   at the **same `0.8.2`** (`typescript/src/parse/index.ts:9`) exports all 15. The dist is
   a 2026-03-10 build; the source span work (`git log`: `db19633` "add altSpan and
   takeUntilAnySpan", `597476f` soundness audit) post-dates it. So **consumers can't reach
   half the span algebra**, and the version number lies about it. (kf/value.js don't use
   *any* span functions today — value.js parses to materialized strings via `any()` — so
   this is latent, but it is a real publish-discipline defect.)

2. **Two parallel algebras is itself a maintenance liability.** Every soundness fix must
   land twice — and the git log shows it does: `597476f` is "soundness audit — sep_by
   trailing, **negate/not/minus state**" touching *both* `parser.ts` and `span.ts`. The
   `sepBy` trailing-separator logic exists in `parser.ts:660-684` **and again** in
   `span.ts:152-172`; the assertion semantics exist in `parser.ts:315-454` (`not`/`peek`/
   `lookAhead`/`minus`) **and again** in `span.ts:406-547`. Drift between the two is a
   live risk (and the dist proves they already diverge).

### 5.3 The SOTA answer

The frontier does **not** maintain two algebras — it makes the **span the primitive** and
the materialized value a *consumer-side map*. The Rust port does exactly this:
`take_until_any_span`/`any_span` return `Span<'a>` and the value is `&src[span]` — there is
no parallel "string family," because the string *is* the span lazily viewed. The TS
transposition:
- Make the **leaves return spans by default** (`string`/`regex` produce a `Span`), and
  provide `.text()` / `.str()` as a one-line `.map(span => spanToString(span, src))`
  combinator for consumers that want the substring.
- The structure combinators (`many`/`sepBy`/`wrap`/assertions) then need **one**
  implementation that is span-agnostic (they already only manipulate offsets + the inner
  value); the span-vs-string distinction collapses to *what the leaf returned*.
- Delete `span.ts` as a parallel family; its assertion/scanner *logic* moves into the
  unified combinators (the byte-class `takeUntilAnySpan` scanner `:361-397` is the one
  genuinely-new primitive worth keeping as a first-class leaf).

### 5.4 Disposition

**parse-that-HANDOFF (MED, two items):**
- **(a) publish-discipline, immediate:** rebuild + bump — the dist must export what the
  source exports, or the version must change. The current `0.8.2`-means-two-things state is
  a defect any consumer-side `import { altSpan }` would hit as a runtime `undefined`.
- **(b) architectural, the real fix:** unify the two algebras into **one span-first core**
  with a `.text()` materialization map, per the Rust port's model. This removes the
  double-maintenance (the `sepBy`/assertion logic duplicated across `parser.ts`/`span.ts`)
  and is the SOTA shape. Falsifiable gate: every `*Span` test and every value-combinator
  test passes against the unified core; the JSON/CSS benchmarks show no regression (spans
  are strictly fewer allocations). **Honest sizing:** this is a multi-day core refactor with
  a real blast radius (every combinator touched) — BOOK it as the parse-that
  span-unification tranche, do not bolt it on.

---

## §6. The Rust port — the SOTA frontier, in-tree, and what it teaches the TS engine

The Rust port (`rust/parse_that/`) is not a curiosity — it is the project's **executable
specification of where parse-that performance SOTA lives**, and it benchmarks itself
against the actual frontier (`divan` benches vs winnow, nom, pest, lightningcss,
cssparser, simd_json, sonic_rs, jiter, serde). What it does that the TS engine does not:

- **64-byte zero-padded, 64-byte-aligned input buffer** (`state.rs:47-90`,
  `INPUT_PAD_BYTES=64`, `PaddedChunk([u8;64])` with `repr(C, align(64))`) — lets every
  SIMD kernel load a full stripe across the last byte without per-chunk tail bounds checks.
  Allocated via one `copy_nonoverlapping` + a tiny tail zero (`:82-90`), not a double
  memset+memcpy.
- **SIMD whitespace scanning with cached structural bitmaps** (`scanners.rs`) — a
  three-tier whitespace skip: fast-exit, cached `u64` bitmap shift, `u8x16` SIMD
  scan-and-cache cold path (`scanners.rs:152-179`, `simd_eq` against space/tab/lf/cr).
- **memchr / aho-corasick byte scanners** (`scanners.rs:35,315,367` — `memchr2`,
  `find_first_of`, `find_first_of_3`, cached aho-corasick) for `take_until_any`.
- **Polymorphic bump-slab arena** (`bump_slab.rs`) — a single byte-bump allocator serving
  all parser-allocated types (enums of `&'a` refs, spans, tuples), no per-type slab, no
  Drop (everything trivially destructible). Zero per-node allocation for the AST.
- **`SmallBox<dyn ParserFn, S32>`** (`parse.rs:62`) — small combinator closures inlined
  into a 32-byte buffer, no heap box for the common case (the §2 cost-model SOTA).

**What this teaches (and what is portable to TS):**
- **Spans-first (§5)** — portable and correct; the Rust port proves the model.
- **Padded scan-ahead** — *partially* portable: JS strings can't be byte-padded, but the
  charCode scanners (`scan.ts`) already avoid per-char bounds drama; the gain is small in
  JS. RECORD, do not chase.
- **SIMD** — **not portable** to the parse-that JS engine in any near-term way (the
  WebAssembly SIMD path is the only route, and that is the declined WASM bridge — see
  below). RECORD.
- **Arena allocation** — **not portable** (V8 owns allocation; a JS "arena" of objects
  doesn't beat the GC's bump allocator for short-lived nodes). RECORD.

**The WASM bridge — DECLINED, re-confirmed from the engine side.** The sibling lanes
(`vj-parser-aug.md` §4, `r-css-parsers-wasm.md` F-4, the E handoff) decline WASM on the
*marshalling-tax* cost model and verify the Rust crate has no `cdylib`/`wasm_bindgen`. I
add the **engine-architecture** reason: every one of the Rust port's wins — the
64-byte-padded buffer, the SIMD bitmap, the bump arena, the zero-copy `Span<'a>` borrowing
*the input slice* — is a property of **owning a contiguous byte buffer for the whole
parse**. A per-token WASM call (`parseCSSValueUnit` on one `getComputedStyle` string,
`value.js/src/units/normalize.ts`) gets a fresh string in, must `TextEncoder` it across the
boundary, parses 8 bytes, and `TextDecoder`s a struct back — **none of the Rust wins
survive**, and the marshalling dominates. The Rust port is SOTA *for whole-buffer Rust-side
parsing* (a CLI, a build tool, a server); it is architecturally the **wrong tool for kf's
per-token JS workload**. **Disposition: RECORD — WASM-DECLINED (re-confirmed from the
engine-architecture angle; the Rust port is a design oracle, not a deployment target for
the JS consumer).**

---

## §7. Smaller engine findings (RECORD-grade)

- **`createParserContext` allocates per combinator purely for `debug()`/`toString()`**
  (`state.ts:168-178`, called from every combinator constructor). It builds `{name, parser,
  args}` for introspection (`parserPrint`, `debug.ts`). For a production grammar this is
  pure build-time overhead with no runtime value. **RECORD** — a `__DEV__`-gated context
  (build it only when debug is on) would shave the build-time allocation, but it is
  one-time and tiny; not worth the API churn. Noted so a future pass doesn't mistake it for
  a hot-path cost.
- **`getLineNumber`/`getColumnNumber`/`getLineAndColumn` re-scan from offset 0**
  (`state.ts:89-112`) via `lastIndexOf("\n")` + `split("\n")`. Only called on error
  display (cold path), so the O(offset) scan is fine. **RECORD** — SOTA error reporters
  precompute a line-start index, but only for repeated lookups; parse-that looks up once
  per error. Correct as-is.
- **`any()` collapses to the single child's `.parser` when `length===1`** (`leaf.ts:46`)
  and `all()` likewise (`:133`) — a nice peephole. `altSpan` does the same (`span.ts:333`).
  **ALREADY-SOTA micro-detail**, noted as evidence of the engine's care.
- **The numeric memo key `(id<<20)|offset`** (`parser.ts:74-76`) caps parser IDs at 2^11=2048
  and offsets at ~1M chars (`:22-25`). For value.js's grammar (a few hundred parsers) and
  CSS values (tiny) this is comfortable, but the **2048-parser cap is an undocumented
  global ceiling** — a large generated BBNF grammar could exceed it and silently collide
  memo keys. **RECORD** (moves with the §3 packrat isolation — if packrat is opt-in, the
  cap only binds left-recursive grammars, which are small).

---

## §8. Disposition index

| # | Finding | `file:line` (parse-that, unless noted) | Disposition |
|---|---------|----------------------------------------|-------------|
| §1 | Leaf tier: mutable state, zero-alloc `string`/`regex`/WS, `dispatch` LUT, flag-`call()`, sound `many`/`sepBy` | `state.ts:21-117`, `leaf.ts:60-262`, `parser.ts:501-544,589-702` | **ALREADY-SOTA** (do not churn) |
| §2 | Per-combinator closure allocation = parsimmon model; build-time not hot-path; Rust port is the cost-model SOTA | `parser.ts:149-774`; Rust `parse.rs:41-62` | **RECORD** (ALREADY-SOTA for JS; no pure-TS transposition exists) |
| §3 | Packrat/left-recursion DEAD on all prod paths, tested-only; Rust port drops it; `reset()` tax per parse | `parser.ts:19-20,41-45,83-147`; only consumer `test/memoize.test.ts` | **parse-that-HANDOFF (MED)** — ISOLATE into opt-in module, strip `reset()` tax from default path |
| §4 | Error/diagnostic substate is MODULE-GLOBAL → non-reentrant, diagnostics-corruption landmine; `ParserState` already has the fields | `utils.ts:31-35,37-76,146`; `state.ts:23,30`; Rust `state.rs:36-45`, `parse.rs:116` | **parse-that-HANDOFF (HIGH, soundness)** — thread furthest/expected/diagnostics through `ParserState` |
| §5 | Span subsystem is a full parallel algebra: (a) dist 0.8.2 exports 8/15 (source↔dist drift, no bump); (b) two-algebra double-maintenance | `span.ts:16-547`; dist `index.d.ts` vs src `index.ts:9`; `git 597476f` | **parse-that-HANDOFF (MED)** — (a) rebuild+bump now; (b) BOOK span-first unification |
| §6 | Rust port = SOTA frontier in-tree (SIMD/padded buffer/bump arena/spans), benchmarked vs winnow/nom/pest/lightningcss; design oracle not deploy target | `rust/parse_that/{state.rs,scanners.rs,bump_slab.rs,parse.rs}` | **RECORD — WASM-DECLINED** (re-confirmed engine-side); spans-first (§5) is the one portable lesson |
| §7 | `createParserContext` build-alloc for debug; line/col re-scan (cold); `any/all` length-1 peephole; 2048-parser memo cap | `state.ts:89-178`, `leaf.ts:46,133`, `parser.ts:74-76` | **RECORD** (no action; noted to prevent mis-optimization) |

---

## §9. The gestalt — three transpositions, in dependency order

If a parse-that tranche opens, the idiomatic sequence (each enabling the next):

1. **Thread error/diagnostic state onto `ParserState` (§4, HIGH).** It is the soundness
   root, the fields already exist, and it is the prerequisite for any future
   incremental/interleaved parsing. It also subsumes the sibling `console.error` fix as a
   surface detail. **Do this first.**
2. **Isolate packrat into an opt-in module (§3, MED).** Once errors are state-threaded,
   `reset()` shrinks to the `MEMO` maps; moving those to an opt-in `packrat.ts` (imported
   only by left-recursive BBNF grammars, exactly as the Rust port omits them) removes the
   last global and the per-parse reset tax from the LL(1) hot path.
3. **Unify the span and value algebras into a span-first core (§5b, BOOK).** The largest
   refactor, the clearest SOTA shape (the Rust port proves it), and the one that finally
   makes value.js's eventual `dispatch`/span adoption (the sibling-lane Wave A) land on a
   single, non-duplicated combinator surface.

**What is explicitly NOT proposed (KILL the temptation):** a WASM bridge (§6 — wrong cost
model for per-token JS), a chevrotain-style codegen rewrite (§2 — different product), or a
blunt deletion of left-recursion (§3 — it is a real tested capability; isolate, don't
amputate). And the leaf tier (§1) is **ALREADY-SOTA** — every transposition above is in the
state model and the algebra structure, never in the hot primitives.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/parsing/px-parse-that-arch.md`. ZERO source
edits to parse-that, value.js, or keyframes.js (inv-16: parse-that and value.js are
separate `@mkbabb` repos — every item above is a parse-that-HANDOFF *proposal*). Every
parse-that claim is `file:line`-grounded against the live source
(`/Users/mkbabb/Programming/parse-that/typescript/src/parse/`) and, where the consumer
runs a different build, against the installed dist
(`node_modules/@mkbabb/parse-that/dist/`, `0.8.2`); every Rust claim against
`rust/parse_that/src/`. The dead-packrat and global-state findings are verified by grep
across parse-that, value.js, keyframes.js, and both BBNF generators. Sibling-lane findings
(dispatch adoption, `istring`, `console.error`, WASM marshalling, `linear()`) are
**cited and diffed, never re-derived** — this lane is the parse-that-engine axis beneath
them.

## Sources

- **parse-that TS source:** `typescript/src/parse/{parser,leaf,span,state,lazy,utils,split,debug}.ts`,
  `typescript/test/{memoize,benchmarks/parse-that,benchmarks/parsimmon}.ts`, `README.md`.
- **parse-that installed dist:** `keyframes.js/node_modules/@mkbabb/parse-that/dist/{index.d.ts,leaf.d.ts,state.d.ts}` (`0.8.2`).
- **parse-that Rust port:** `rust/parse_that/src/{parse,state,scanners,bump_slab,leaf}.rs`,
  `rust/parse_that/benches/competitors/{winnow,nom,pest,lightningcss}.rs`.
- **value.js consumption (grounding the dispatch-unused / memoize-unused claims):**
  `value.js/src/parsing/{units,color,index,utils}.ts`, `value.js/src/parsing/CLAUDE.md:66`.
- **BBNF generators (grounding the packrat-dead claim):** `/Users/mkbabb/Programming/bbnf-lang`,
  `/Users/mkbabb/Programming/bbnf-buddy/src/main.ts`.
- **Sibling F lanes diffed (not repeated):** `docs/tranches/F/audit/{p-parse-perf-F,vj-parser-aug,r-css-parsers-wasm}.md`.
- **E evidence diffed:** `docs/tranches/E/valuejs-sota-handoff.md` (Wave A).
- **SOTA literature/competitors:** parsimmon (immutable `{input,index}` model),
  chevrotain (self-analyzing LL(k), no runtime closure composition), peggy/PEG.js
  (packrat by default), nom/winnow (zero-cost trait-monomorphized combinators, `&mut`
  state, `dispatch!`), Warth et al. (packrat left-recursion seed-and-grow);
  lightningcss/csstree/@csstools (tokenize-once · first-char-dispatch · span/zero-copy).
