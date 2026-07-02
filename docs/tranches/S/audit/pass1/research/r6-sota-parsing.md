# Lane r6 — SOTA Research: Parsing + parse-that Uplift

**Scope:** (A) mid-2026 parser-engineering frontier; (B) read-only audit of
`/Users/mkbabb/Programming/parse-that` (TS surface: `typescript/src/parse/`,
v0.13.0 published) as the upriver dep of value.js → keyframes.js.
**Method:** full source inventory (18 TS modules, ~3,219 LOC), combinator-surface
enumeration, consumer-usage diff against value.js (`/Users/mkbabb/Programming/value.js/src`),
packrat/perf-harness read, tranche-A charter read, 6 web-research passes on the
2026 frontier. All citations `file:line` / commit SHA.
**Constraint honored:** bbnf-lang is a *separate repo in active development* — this
lane does **not** consider, plan, or propose any bbnf-lang / codegen work. Where a
parse-that surface exists only to serve bbnf-lang, it is flagged as external-consumer,
not dead.

---

## Executive summary

parse-that's TS combinator core is **already close to the JS/V8 frontier** on the two
axes that matter for the constellation's real workload (LL(1)-ish, one-shot CSS-value
parsing): a `charCodeAt`-indexed `Int8Array(128)` dispatch LUT
(`leaf.ts:100-151`) and a monomorphic, single-array `all()`/`any()` fusion
(`leaf.ts:179-273`) are both textbook-correct implementations of the exact idioms V8
rewards. The library has already *falsified and retired* the one frontier idea that
does **not** transfer from Rust to V8 (the `SpanParser` tagged-union jump-table —
measured 10-14% SLOWER, `future-research.md §7`), which is a sign of a healthy,
evidence-driven perf culture rather than cargo-culting.

The refinement surface is therefore **not** "chase more SOTA primitives." It is three
concrete things, in priority order:

1. **A per-parse allocation tax on the DEFAULT path.** Since 0.13.0 (PT-Q1), *every*
   top-level `parseState()` unconditionally allocates **three fresh `Map`s** via
   `packratEnter()` (`parser.ts:43`, `packrat.ts:189-203`) to make the *opt-in* packrat
   tier re-entrancy-sound. value.js **never opts into parse-that's packrat** (it uses its
   own `memoize` at `value.js/src/utils.ts:116`), so this is 3 Map constructions +
   1 restore per CSS value parsed, on a feature the constellation does not use. This is
   the single highest-leverage measurable win and it flows straight through value.js into
   every keyframes.js compile.

2. **A retired-but-still-gated legacy tier.** The 15 `*Span` combinators (`span.ts`,
   591 LOC — the largest non-`parser.ts` module) are `@deprecated 0.13.0, remove in 1.0.0`
   (`span.ts:13-25`) with **zero constellation consumers** (confirmed: 0 hits across
   value.js), yet `dist-surface.test.ts:70-78` still *asserts all 15 must be present*.
   The keep-gate and the remove-plan are in direct tension. S is the tranche to execute
   the removal (the 1.0.0 cut) or reaffirm — the ledger cannot sit half-open forever.

3. **Documentation rot.** `parse-that/CLAUDE.md` still describes v0.8.2, "14 test files"
   (actually 12), `parsers/css/` (deleted A.W1), and `SpanParser` in `span.ts` (killed
   B.W0) as live — the structural map lies about the current tree.

On **structure**: parse-that does **NOT** need the 7-zone partition keyframes.js got. At
3,219 LOC / 18 files with tiers already latent *and already expressed as subpath entries*
(`./core`, `./diagnostics`, `./packrat`, `./utils`), the layout is proportionate. The one
oversized file is `parser.ts` (707 LOC, the entire `Parser` class + ~25 combinator
methods), and TS class-method cohesion makes splitting it net-negative. Recorded as INFO.

On **capability frontier**: the genuine gaps vs chumsky/tree-sitter/Lezer are
**Pratt/precedence** (value.js hand-rolls it in `math.ts`), **generic input** (parse-that
is `src: string`-only — no token-stream input), **check/emit dual-mode**, and
**incremental/streaming**. Of these, only a **Pratt precedence primitive** has a
plausible in-realm consumer (value.js's `calc()`/math grammar); the rest are frontier
features with no constellation demand and are recorded as deliberate non-goals.

Severity legend: **HIGH** = real debt / measurable perf on the consumer hot path ·
**MEDIUM** = cohesion/correctness/legacy worth a wave · **LOW** = polish · **INFO** =
recorded, no action urged.

---

## Part A — SOTA capability matrix: parse-that vs the mid-2026 frontier

| Capability | Frontier reference (2026) | parse-that TS status | Verdict |
|---|---|---|---|
| **charCode/byte dispatch** | V8 scanner (charCode jump tables), simdjson-style byte dispatch | `dispatch()` — `Int8Array(128)` LUT, range + multi-char keys, O(1) first-char branch (`leaf.ts:100-151`) | **At frontier.** Consumed by value.js (6 sites) + json.ts |
| **Monomorphic sequence fusion** | "stay monomorphic," single-alloc result (V8 IC guidance) | `fuseAll()` — one pre-sized array, arity-2/3 unrolled, no `for…of` iterator, drop-`undefined` preserved (`leaf.ts:179-273`); `any()` arity-2 unrolled (`leaf.ts:39-57`) | **At frontier.** Shipped 0.12.0; value.js's 59 `all()` + 89 `any()` sites benefit |
| **Zero-alloc string scan** | Zero-allocation parsers (8-10× throughput), chumsky `to_slice` | `regex()` uses `test()`+`substring` (one substring alloc) not `exec` (`leaf.ts:344-358`); `whitespace` inline charCode loop, fast-exit (`leaf.ts:372-391`); `Span` tier is zero-copy but **deprecated/unused** | **Partial.** The zero-copy tier being retired is the only frontier regression — but value.js already has its own offset-returning byte-scanners (`value.js/src/parsing/utils.ts`), so the retirement is correct for the real consumer |
| **Farthest-failure + labeled expectations** | PEG-with-labels error reporting; megaparsec | Per-`ParserState` `furthest` offset + accumulated `expected[]` label set, diagnostics-gated (`state.ts:43-45`, `utils.ts:28-49`) | **At frontier** for the report model; label set only populated when `enableDiagnostics()` (zero hot-path cost) |
| **Error recovery / recovery islands** | chumsky `Strategy` (via_parser / skip_until / nested_delimiters); tree-sitter/Lezer recover-to-tree | `recover(sync, sentinel)` — snapshot diagnostic, sync forward, sentinel; multi-error collection via `collectDiagnostic` (`parser.ts:649-684`) + unclosed-delimiter suggestions (`utils.ts:66-80`) | **Core covered**, one strategy vs chumsky's four. Adequate for CSS-value granularity |
| **Packrat + left recursion** | Warth-Douglass-Millstein 2008; **Squirrel Parser (Jan 2026)** — uniform indirect-LR, no preprocessing, linear | Full WDM: `(id,offset)` memo, seed-and-grow, multi-occurrence head, indirect LR (`packrat.ts`, 444 LOC). Sound (cross-input + >1MB key fixed) | **At/near frontier algorithmically**, but **near-zero consumers** — the tier is unexercised weight for the constellation |
| **Operator-precedence / Pratt** | Pratt/binding-power (chumsky `pratt`, Crockford JSLint) | **Absent.** value.js hand-rolls precedence in `value.js/src/parsing/math.ts` | **Gap with a real consumer** |
| **Generic input (token streams)** | chumsky generic over input/token/output/span/error | `src: string` only (`state.ts:48`) — scannerless, char-stream fixed | **Gap, no in-realm demand** (constellation is scannerless by design) |
| **Check/Emit dual mode** | chumsky `Mode` (GAT-specialized validate-vs-build) | **Absent** — always builds values | **Gap, low value** for one-shot value parsing |
| **Incremental / resumable** | tree-sitter / Lezer (Wagner incremental LR) | **Absent** | **Gap, no demand** — the constellation re-parses small independent value strings, not editing large documents |
| **Streaming** | resumable/push parsers | **Absent** | **Gap, no demand** |
| **Grammar DSL / codegen** | PEG generators (peggy), BBNF | Lives in *separate* bbnf-lang repo | **Out of lane scope** |
| **Subpath tree-shaking** | package `exports` conditional subpaths | `./core ./diagnostics ./packrat ./utils` + `sideEffects:false` (`package.json:5,10-35`) | **At frontier** |

**Bottom line:** parse-that is at or near the frontier on every axis its real consumer
exercises, and the gaps are all either no-demand frontier features or (Pratt) a single
well-scoped opportunity. The uplift is *subtraction and tuning*, not addition.

---

## Part B — Ranked uplift candidates (wave-shaped, with evidence)

### 1. [HIGH] Per-parse packrat-epoch allocation taxes the default (non-memoized) path

**Evidence.** `parser.ts:43` — `parseState()` calls `packratEnter()` on **every**
top-level parse, inside a `try/finally`. `packrat.ts:189-203` — `packratEnter()`
allocates `MEMO = new Map()`, `HEADS = new Map()`, `GROWING = new Map()` (three fresh
Maps) and snapshots five refs; `packratExit()` restores them. The header comment
(`parser.ts:36-42`) calls this "a no-op-cost reference swap for non-memoized grammars,"
but that is inaccurate — it is **3 Map constructions + 1 object literal per top-level
parse**, unconditionally.

**Why it flows to value.js/kf (measurable).** value.js does **not** consume parse-that's
`memoize()` — it has its own unrelated `memoize` util (`value.js/src/utils.ts:116`,
imported by `units/normalize.ts`, `parsing/animation-shorthand.ts`, `parsing/stylesheet.ts`).
Zero value.js grammar wraps a parser in parse-that's packrat `memoize`/`mergeMemos`
(confirmed: 0 hits for `mergeMemos`/`resetPackrat`, the single `.memoize` grep hit is
value.js's own util). Therefore **the entire packrat epoch is pure overhead for the
constellation**: every CSS value keyframes.js compiles (colors, `calc()`, transforms,
each keyframe stop) drives a value.js `.parse()` that now allocates 3 Maps it never reads.

**Proposal (KISS, semantics-preserving).** Gate the epoch on whether packrat is *ever*
armed. Add a module-global `PACKRAT_ARMED = false` flag flipped to `true` the first time
`makeMemoized()` runs (`packrat.ts:244`). In `packratEnter`/`packratExit`, early-return a
sentinel when `!PACKRAT_ARMED` — no Map allocation, no swap. A memoized grammar arms the
flag at construction (before any parse), so re-entrancy soundness is preserved for the
tier that actually uses it; the default LL(1) path returns to true zero-per-parse cost.
Gate it with a `proof:perf` clause: retained-heap delta of N non-memoized parses must be
flat (the harness already measures retained heap under `--expose-gc`, `proof-perf.mjs`).
**This is the one uplift that will show up on a value.js/kf parse benchmark.**

### 2. [MEDIUM] Execute (or reaffirm) the `*Span` 1.0.0 removal — the keep-gate contradicts the remove-plan

**Evidence.** All 15 span combinators carry `@deprecated 0.13.0 — zero in-realm
consumers; scheduled for removal in 1.0.0` (`span.ts:13-25` header + per-fn tags). Consumer
diff confirms zero: value.js imports only `Parser, all, any, dispatch, regex, string,
whitespace` and methods `.map/.trim/.next/.wrap/.skip/.opt/.many/.sepBy/.not/.chain/.or`
(grep over `value.js/src`); **no `*Span` symbol appears**. kf has **zero direct parse-that
imports** (only a comment reference, `compile/parse-flatten.ts:128`). Yet
`dist-surface.test.ts:70-78` still asserts *"all 15 span fns are present in the dist"* as a
publish-discipline gate. So one gate mandates keeping them, a doc mandates removing them.

**Weight.** `span.ts` is 591 LOC — the second-largest module, ~18% of the TS source. It is
exported from both the root barrel (`index.ts:9`) and `./core` (`core.ts:29-44`).

**Proposal.** In S's parse-that dispatch: delete `span.ts`, drop the `*Span` exports from
`index.ts`/`core.ts`, and **flip** `dist-surface.test.ts` — replace the "all 15 present"
assertion with a negative "zero `*Span` symbols in dist" assertion (mirroring the
`proof:no-css-surface` pattern from A.W1). Cut 1.0.0. If the coordinated value.js S session
adopts a `*Span` builder on a real hot leaf, drop only that builder's `@deprecated` (the
"adopt arm" the header already anticipates, `span.ts:24-25`) — but on today's evidence the
whole tier goes. Net: −591 LOC, one less barrel surface, the retired zero-copy tier honestly
gone.

### 3. [MEDIUM] `chain()`'s truthiness gate is a latent value-dependent footgun

**Evidence.** `parser.ts:124-140`: `chain(fn, chainError=false)` runs the continuation
only when `state.value || chainError`. Because it is a **truthiness** test, a successfully
parsed value of `0`, `""`, `false`, or `undefined` **silently skips the continuation** and
returns the seed value instead of threading — even though the parse succeeded. value.js
uses `.chain` at 4 sites; a grammar whose first stage can legitimately yield `0`/`""`
(a numeric or empty-string token) would mis-parse with no error.

**Proposal.** Gate on `!state.isError` only (the parse-success signal), not on the value's
truthiness; keep `chainError` as the opt-in "continue even on error" escape. Add a
regression test with a `0`/`""`-yielding first stage. Low blast radius (value.js's 4 sites
chain on non-falsy CSS tokens today), but it is a correctness sharp edge that will cut a
future consumer. Semver: patch (bugfix).

### 4. [LOW] `parse-that/CLAUDE.md` structural map is stale on four counts

**Evidence.** `parse-that/CLAUDE.md`: header says `@mkbabb/parse-that v0.8.2` (actual
0.13.0); "Vitest tests (14 test files)" (actual 12, `ls test/*.test.ts`); the tree lists
`parsers/` "(JSON, CSV, CSS)" and the Rust `span_parser/` + TS Span combinators as live —
but the **TS CSS parser was deleted A.W1** and the **TS `SpanParser` tagged-union was
killed B.W0** (`future-research.md §7`). The map describes a tree two tranches out of date.

**Proposal.** Refresh CLAUDE.md in the S dispatch: version 0.13.0→(1.0.0), test count
derived not frozen, drop TS CSS from `parsers/`, mark the TS `*Span` tier removed, note the
subpath-entry tiers (`core/diagnostics/packrat/utils`) as the de-facto zone map.

### 5. [LOW] Add a Pratt / binding-power precedence primitive (the one frontier gap with a consumer)

**Evidence + rationale.** The frontier consensus (chumsky `pratt`, Crockford, Pratt 1973)
is that precedence-climbing is the right tool for infix/precedence expressions, and
combinators are the wrong one. value.js currently hand-rolls CSS `calc()`/math precedence in
`value.js/src/parsing/math.ts` (113-LOC test surface, `math.test.ts`) with layered
`all()`/`any()`. A small `pratt({ prefix, infix, postfix })` combinator over the existing
`Parser` core would let value.js's math grammar collapse its precedence ladder to a
binding-power table — a DX and maintainability win, and it is the **only** absent frontier
primitive with an identified in-realm consumer.

**Proposal.** DEVELOP-only in S (design a `pratt` combinator signature; do not implement
without a ratified value.js consume-edge). Keep it string-input, zero-new-dependency,
returning a `Parser<T>` so it composes with `dispatch`/`all`/`any`. Explicitly *not* a
grammar-DSL move (that is bbnf-lang's lane).

### 6. [INFO] parse-that does NOT need keyframes.js's zone-partition treatment

**Evidence.** 18 TS files, 3,219 LOC (`wc -l src/parse/*.ts parsers/*.ts`), vs kf's 98
files / ~19k LOC. The tiers are already latent and already crystallized as **subpath
entries** — `core.ts`, `diagnostics.ts`, `packrat-entry.ts`, `utils-entry.ts` (`package.json`
exports). The only oversized module is `parser.ts` (707 LOC: the whole `Parser<T>` class +
~25 methods); TS class-method cohesion means a `combinators/` split would fragment one class
across files for negative benefit. **Recommendation: do not partition.** The subpath map IS
the zone map. Recorded so the S wave design does not reflexively apply the kf template.

### 7. [INFO] The WDM packrat/LR tier is near-frontier but near-consumerless — a KISS candidate

**Evidence.** `packrat.ts` (444 LOC) is a full Warth-Douglass-Millstein implementation
(direct + indirect + multi-occurrence-head left recursion) — algorithmically at the 2008
frontier, and its documented soundness fixes (cross-input PT-B1 at 0.12.0, >1MB float64 key
PT-Q2, re-entrancy PT-Q1) are genuinely careful work. The 2026 frontier has moved past WDM
(the **Squirrel Parser**, arXiv 2601.05012, Jan 2026, handles all recursion types uniformly
with no preprocessing at packrat linearity), but chasing that is unjustified: the tier has
**~zero constellation consumers** (value.js/kf grammars are LL(1)-ish; neither opts in). The
honest question for S is not "upgrade WDM to Squirrel" but "does a 444-LOC LR machine with
no in-realm consumer earn its complexity + its per-parse epoch tax (finding #1)?" Recorded as
a strategic question for the wave design, not a recommendation — the tier is correct and
tested; if it stays, finding #1's arming-flag makes it free for non-users.

### 8. [INFO] Zero-copy is being retired, not extended — verify that is intentional

The frontier direction is *more* zero-copy (chumsky `to_slice`, zero-allocation parsers
at 8-10×). parse-that is going the other way: the `Span` (zero-copy offset) tier is being
removed (#2), and `regex()` allocates a `substring` per match (`leaf.ts:350`). This is
**correct for the real consumer** — value.js does its own zero-copy scanning with
offset-returning byte loops (`value.js/src/parsing/utils.ts`, harvested O.W6) rather than
parse-that Spans — but S should record the decision explicitly so a future "add zero-copy"
impulse knows it was deliberately delegated to value.js's scanner layer, not overlooked.

---

## Part C — Which uplifts flow through to value.js / keyframes.js parse performance, measurably

Ranked by measurable consumer impact:

1. **#1 packrat-epoch arming flag — DIRECT, measurable.** Eliminates 3 Map allocations +
   1 restore per value.js `.parse()`. Every keyframes.js compile parses many CSS values
   through value.js; this is the one change a value.js parse micro-benchmark or a kf
   `frame-compiler` bench would register. Highest leverage, lowest risk (semantics
   unchanged; guarded by the existing retained-heap `proof:perf` clause).

2. **#2 `*Span` removal — bundle/tree-shake win, not runtime.** value.js/kf already never
   import the tier and `sideEffects:false` already lets bundlers drop it, so runtime is
   unaffected; the win is −591 LOC of maintained surface and a smaller `./core` chunk.
   Marginal for consumers, real for the library.

3. **fuseAll / dispatch — ALREADY LANDED (0.12.0), already benefiting consumers.** value.js's
   59 `all()` and 6 `dispatch()` sites already ride the fused monomorphic path
   (`leaf.ts:179-273`, `100-151`). No new work; noted so S does not re-propose it. The
   speculative `dispatch` 2nd-byte `subTable` was correctly *retracted* in 0.13.0
   (`leaf.ts:88-99`) as a no-consumer perf seam — do not resurrect without a real value.js
   `c`-bucket measurement.

4. **#5 Pratt primitive — DX win, negligible runtime.** Math/`calc()` parsing is not a kf
   hot path; the value is maintainability of `value.js/src/parsing/math.ts`, not throughput.

5. **SpanParser tagged-union — DO NOT ATTEMPT.** Already measured 10-14% SLOWER on V8
   (`future-research.md §7`, three workloads, adversarial re-run); the Rust jump-table win
   does not transfer. Recorded to keep it killed.

**Net:** exactly one measurable consumer-facing parse-perf win is on the table (#1). The
rest of the value delivered to value.js/kf is correctness (#3), surface hygiene (#2, #4),
and DX (#5). That is the honest ceiling — parse-that's hot path is already tuned.

---

## Tranche-S implications (wave-shaped)

A parse-that **dispatch tranche** (parse-that owns its own tranche letters — A is founding;
this would be its next, coordinated from S but landing in the parse-that repo and published
independently, then re-pinned per the constellation's "publish-then-re-pin" discipline). Do
**not** create `file:` links; do **not** touch bbnf-lang.

- **Wave PT-S.W1 — packrat-epoch arming flag (the measurable perf win).** Add
  `PACKRAT_ARMED` gate so `packratEnter`/`packratExit` are true no-ops until a `memoize()`
  is constructed. Born-RED gate: a `proof:perf` retained-heap clause asserting N
  non-memoized `.parse()` calls allocate flat heap (fails on today's tree — 3 Maps/parse).
  Semver: patch. **This is the wave that shows up on a value.js/kf bench.** (Finding #1.)

- **Wave PT-S.W2 — the 1.0.0 legacy cut.** Delete `span.ts` (591 LOC) + `*Span` barrel
  exports; flip `dist-surface.test.ts` from "all 15 present" to "zero `*Span` in dist";
  fold the `chain()` truthiness fix (#3) with a `0`/`""` regression test. Refresh
  `parse-that/CLAUDE.md` (#4). This is the "NO legacy/deprecated code anywhere" charter
  applied to the upriver dep — the `@deprecated`-since-0.13.0 tier is exactly the chronic S
  is meant to close. Semver: **1.0.0** (the contracting cut the ledger already scheduled).
  Born-RED: `proof:no-span-surface`.

- **Wave PT-S.W3 (DEVELOP-only) — Pratt precedence primitive design.** Design a `pratt`
  combinator over the existing `Parser` core with an identified value.js `math.ts`
  consume-edge; do **not** implement without value.js ratification. Frontier-aligned, one
  real consumer, zero new deps. (Finding #5.)

- **Strategic question for the S wave design (not a wave): the WDM/LR tier's keep-or-KISS.**
  444 LOC of near-frontier left-recursion machinery with ~zero constellation consumers.
  PT-S.W1's arming flag makes it free-for-non-users, which is the pragmatic answer; but S
  should *decide* explicitly rather than let it drift. (Findings #7.)

- **Non-goals to record (so the wave design doesn't chase them):** generic token-stream
  input, check/emit dual-mode, incremental/streaming parsing, Squirrel-Parser LR upgrade,
  re-adding zero-copy Spans, resurrecting SpanParser or the dispatch subTable. Each is
  either no-demand frontier or already-falsified. (Findings #6, #7, #8; matrix Part A.)

**One-line thesis for S:** parse-that's frontier work is *done and honest*; the S dispatch is
**one measurable perf reclaim (packrat-epoch arming) + one legacy cut (`*Span`/1.0.0) + one
correctness fix (`chain`) + doc truth** — subtraction and tuning, not new SOTA primitives.

---

### Sources (web research)

- [ts-parsec (microsoft) — error handling & ambiguity as first-class](https://github.com/microsoft/ts-parsec)
- [parjs — TS parser combinator, expected-input error reporting](https://github.com/GregRos/parjs)
- [Barretto — error-tolerant parser combinators](https://www.jsbarretto.com/blog/parser-combinators-and-error-recovery/)
- [PEG syntax error reporting & recovery (labeled failures)](https://www.sciencedirect.com/science/article/pii/S0167642319301662)
- [Lezer System Guide — incremental + built-in error recovery](https://lezer.codemirror.net/docs/guide/)
- [tree-sitter — incremental (Wagner) + error recovery](https://github.com/tree-sitter/tree-sitter)
- [Pratt Parsers: Expression Parsing Made Easy (stuffwithstuff)](https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)
- [chumsky — recovery Strategy, zero-copy `to_slice`, Pratt, Check/Emit Mode](https://github.com/zesterer/chumsky)
- [Blazingly fast parsing: optimizing the V8 scanner](https://v8.dev/blog/scanner)
- [Zero-allocation parsers in Node.js (8-10× throughput)](https://mvineetsharma.medium.com/zero-allocation-parsers-in-node-js-a-high-performance-string-processing-e7173b349bd5)
- [Packrat Parsers Can Support Left Recursion — Warth, Douglass, Millstein (PEPM'08)](https://web.cs.ucla.edu/~todd/research/pepm08.pdf)
- [The Squirrel Parser — uniform indirect-LR at packrat linearity (arXiv 2601.05012, Jan 2026)](https://arxiv.org/html/2601.05012)
