# keyframes.js → parse-that Tranche B — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-20 at the keyframes P development phase (the **Constellation
> Optimization Campaign** — `CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`). parse-that
> is the ROOT of the constellation spine (**parse-that → value.js → keyframes.js
> → glass-ui**). This is the **FIRST kf→parse-that dispatch** — parse-that has
> only **Tranche A** (CLOSED 2026-06-19 at 0.11.0: subpath split + WDM packrat +
> the FALSIFIED SpanParser retained as a codegen foundation). It is a coordination
> record: parse-that's **Tranche B** session formalizes the asks below into its
> own waves. **No parse-that source is written from keyframes.js** (inv-16: kf
> writes only keyframes.js; every cross-repo need is a *dispatch*, never a
> foreign-tree edit). The consume-edge discipline holds: parse-that publishes
> `0.12.0`, value.js P consumes the codegen subpath, kf inherits the generated
> parser — **publish-then-consume, DAG-ordered, never cross-write.**

This dispatch is the binding cross-repo contract behind the **CODEGEN SPINE**
(`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md §4`) — the surviving form of the §7
SpanParser thesis A.W3 falsified as a *runtime* switch. parse-that B is the
spine's ROOT leg: it ships the emitter; value.js P generates its CSS-value
parser from `css/l4/*.bbnf`; kf P (**P.W4**, GATED) inherits faster
frame-compilation behind the same `CSSKeyframesAnimation` facade. The asks are
**BC-additive** (no breaking change to parse-that's published 0.11.0 surface —
the codegen subpath is a NEW entry alongside `./core ./diagnostics ./packrat
./utils`; the packrat fix is internal; the Span-combinator generation is
internal) — a single `0.12.0` minor closes all four.

**The premise correction (record-as-built honesty, campaign §1).** The campaign
audit overturned the "no bench / greenfield codegen" framing: parse-that
**already has a bench substrate** (`typescript/test/benchmarks/` — 11 files incl.
`span-dispatch.bench.ts`, `json-comprehensive.bench.ts`, `wasm-json.bench.ts`),
and **`bbnf-lang` EXISTS** locally (`/Users/mkbabb/Programming/bbnf-lang` — a real
TS-emitter codegen tool with a `CompileTarget::Ts` emitter, `grammar/css/l4/*.bbnf`
grammars, and `crates/core/tests/backend_ts.rs` parity tests). **The codegen
spine is WIRING, not greenfield.** What parse-that B is missing is (a) a published
`./codegen` subpath that exposes the emit as a JS-consumable API, and (b) a
`proof:perf` regression gate over the bench substrate that already exists.

---

## The four ASKs

| # | ASK | parse-that surface (file:line) | parse-that B deliverable | the value.js+kf payoff | proof arm that GREENs (born-RED) |
|---|-----|--------------------------------|--------------------------|------------------------|-----------------------------------|
| **PT-B1** | **`@mkbabb/parse-that/codegen` subpath** — a build-time BBNF/SpanParser→specialized straight-line `charCodeAt` TS emitter (NOT runtime dispatch; guarded against A.W3). | the retained SpanParser tagged-union (`typescript/src/parse/span.ts:580-902` — `SpanParserKind`, the `SpanParser` union, the 10 `*Span` builders, `callSpan()`); the package exports (`typescript/package.json:7-33` — 5 subpaths, no `./codegen`). | a NEW `./codegen` export wrapping `bbnf-lang`'s `TsEmitter` (`bbnf-lang/crates/core/src/backend/ts/code.rs:53`) or a JS port that walks the closure-free `SpanParser` data and emits ONE monomorphic recognizer per grammar. | value.js generates its CSS-value parser from `css/l4/*.bbnf` (replacing ~700 hand-maintained combinator lines); kf inherits a 10–50x-floor-attacking frame-compile path (P.W4). | `proof:codegen-parity` + `proof:codegen-throughput` (born-RED): the emitted parser is AST-byte-identical to the combinator parser over the value corpus AND closes the documented 0.58x BBNF-vs-hand-rolled gap toward ≥0.85x, MEASURE-FIRST from the live 540/926 MB/s baseline. |
| **PT-B2** | **the packrat cross-input pollution FIX** — `memoize()` returns a stale result across different inputs (the MEMO key lacks a `src` component); a real correctness BLOCKER. | `typescript/src/parse/packrat.ts:55-56` (`getCijKey = (parser.id << 20) \| (offset & MAX)` — no `src`); `:90` (`MEMO = new Map<number,MemoCell>()`); `:253` (`memoizeFn`). | a `src`-identity guard in `memoizeFn` (auto-reset on `state.src` change) **OR** a WeakRef-epoch cache lifecycle; PLUS the float64-safe multiply key (`id * 1048576 + offset`) closing the `id ≥ 4096` int32-overflow aliasing. | value.js's parse LRU and kf's memoized timing-function parses become input-safe with zero caller discipline; eliminates a class of silent-wrong-answer the codegen-generated parser would also inherit. | `proof:packrat-cross-input` (born-RED): `memoize(p).parse('hello')` then the SAME memoized parser on `ParserState('CAPS123')` WITHOUT `resetPackrat()` returns the `CAPS123` result, not the cached `hello` one; AND `getCijKey(ids[0],0) !== getCijKey(ids[4096],0)`. |
| **PT-B3** | **generate the 16 Span combinators from the value combinators** — one backtracking-control source; dissolve ~400 lines of copy-pasted save/restore/mergeError plumbing. | `typescript/src/parse/span.ts:16-360` (the 10 `*Span` builders — `stringSpan/regexSpan/manySpan/sepBySpan/wrapSpan/optSpan/skipSpan/nextSpan/altSpan/takeUntilAnySpan`) vs the value twins in `parser.ts`/`leaf.ts` (identical control flow, the only delta = the Span collector). | a collector-parametric combinator factory (the value `many`/`sepBy`/`wrap` parameterized over a Span-accumulator) replacing the hand-written Span twins — one source of save/restore truth feeding BOTH the closure lane AND the codegen IR. | the codegen emitter (PT-B1) walks ONE combinator vocabulary, not two drifting ones; a backtracking bug fixed in `many` is fixed in `manySpan` for free. | `proof:span-combinator-parity` (born-RED): the collector-parametric `manySpan`/`sepBySpan` are byte-identical in output AND within 5% throughput of the current hand-written Span lane (the zero-alloc property is preserved — the gate reds a deopting generic collector). |
| **PT-B4** | **the perf frontier** — combinator FUSION + a 2-char (16-bit) dispatch widening for the residual 3–4-deep `any()` buckets; PLUS a `bench` script + `proof:perf` CI gate (the frontier is currently regression-blind). | `typescript/src/parse/leaf.ts:60-104` (`dispatch()` first-char Int8Array LUT); `:107-136` (`all()` allocs a fresh `matches[]`/call); `parser.ts` then-chains (`[v1, state.value]`/call); `package.json:34-40` (NO `bench` target, NO `proof:perf`). | fuse static `a.then(b).map(f)` / `all(a,b,c)` / `any(a,b,c)` chains into ONE monomorphic closure (zero intermediate tuples); widen `dispatch()` to a length+second-byte discriminator; add `"bench": "vitest bench"` + `proof:perf` over a checked-in baseline JSON. | removes per-call tuple/array alloc on value.js's hottest shapes (59 `all()` sites); flattens the residual megamorphism `dispatch()`'s first-char halving left; makes the spine's perf claims CI-auditable. | `proof:perf` (born-RED): an alloc-counting bench asserts `fuse(all(a,b,c))` does ZERO array allocs (vs ≥1 today); a 2-char-collision corpus (calc/clamp/cos/conic) parses ≥40% faster through the widened dispatch; a 15% `json-comprehensive` regression reds CI. |

---

## PT-B1 — `@mkbabb/parse-that/codegen`: the BBNF→specialized-monomorphic-TS emitter (THE SPINE)

**The constellation need, grounded.** The campaign's missing perf payload is the
**CODEGEN SPINE** (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md §4`). Four independent
audit lanes converged on it — `AUDIT-DIGEST.md` V1-N2, P1 (the
BBNF→specialized-monomorphic-TS emitter), P4-codegen-span (the
SpanParser-tree-walk-to-COMPILATION flip), and X2 (close the DORMANT spine
end-to-end). The win is precise and NOT a re-litigation of the falsified §7:
A.W3 falsified the SpanParser tagged-union as a *runtime* recursive switch
(~10–14% SLOWER on V8 — `span.ts:558-564`; `future-research.md §7`). **Codegen
sidesteps that entirely**: emit, at BUILD TIME, ONE specialized straight-line
`charCodeAt` scanner per grammar — no closures, no `callSpan()` recursion, every
call site monomorphic by construction. The retained SpanParser is the
introspectable, allocation-free *data* foundation (`span.ts:570-573` — "kept
module-internal behind the bench as the falsification record and the codegen
foundation"); `bbnf-lang`'s `TsEmitter` is the proven emit.

**The substrate that ALREADY EXISTS (the spine is wiring).** `bbnf-lang` ships
the entire toolchain end-to-end:

| Asset | Location | What it proves |
|---|---|---|
| `CompileTarget::Ts` + `TsEmitter` | `bbnf-lang/crates/core/src/pipeline.rs:33` (the target enum); `crates/core/src/backend/ts/code.rs:53` (`pub struct TsEmitter`); `crates/core/src/pipeline/compile/target.rs:58-73` (`CompileTarget::Ts =>` constructs the emitter) | a full `.bbnf grammar → GrammarIR → TsEmitter → TS source` pipeline (`crates/core/tests/backend_ts.rs:3`) |
| flat charCode-dispatch kernels | `crates/core/src/backend/kernels/{number,quoted_string,identifier,charclass}.rs` | monolithic, in-place-offset (`s.offset` mutation) scanners — the EXACT straight-line shape the spine wants (NOT a tagged-union interpreter) |
| the CSS-L4 grammar set | `bbnf-lang/grammar/css/l4/{value-unit,color,keyframes,easing,transforms,gradients,filters,...}.bbnf` (15 files) | the spec value.js generates FROM — `value-unit.bbnf` already routes the number rule through `parse_that::scan_number_f64` |
| parity tests | `crates/core/tests/backend_ts.rs`, `gen_ts_parser.rs`, `ts_node_execute.rs`, `backend_ts_typecheck.rs` | the emitter's output type-checks, executes under Node, and round-trips the JSON grammar — the parity discipline PT-B1's gate inherits |

**What parse-that B ADDS.** A published JS-consumable `./codegen` subpath. Two
shapes (B chooses):

- **(A) bbnf-lang as the emit engine** — `./codegen` exposes a thin JS wrapper
  invoking `bbnf-lang`'s `TsEmitter` over a `.bbnf` source string, returning the
  generated TS source. This is the lowest-effort wiring (the emitter, grammars,
  and parity tests all exist in Rust/WASM already).
- **(B) the SpanParser tree-walk in TS** — `./codegen` exports
  `spanParserToFunction(sp: SpanParser, name): string` that walks the closure-free
  `SpanParser` union (`span.ts:599-609`) and emits the recognizer. This keeps the
  emit in-realm but re-implements what bbnf-lang already proves.

The campaign **prefers (A)** (the spine is wiring — `bbnf-lang` is the emit
engine; parse-that ships the JS-consumable seam; value.js generates from
`css/l4/*.bbnf`). But it leaves the encoding to parse-that B (B owns the emitter
tier; kf only consumes the generated value.js parser, two hops down the DAG).

**The falsification guard (born-RED, NON-NEGOTIABLE — CONSTITUTION §4).** The
emitter MUST produce STRAIGHT-LINE source, NEVER a runtime interpreter dressed as
a generated function. The TEMPTING-BUT-WRONG trap (the SpanParser lesson itself,
`future-research.md §7`): do NOT codegen a `switch (sp.kind)` driver — that IS
the falsified A.W3 shape, just relocated. Each grammar alternative becomes a
first-char `charCodeAt` branch; each `many`/`sepBy` becomes an inline `while`
loop; the offset threads as a local `int`, not a re-walked tree.

**The proof arm (PT-B1 → `proof:codegen-parity` + `proof:codegen-throughput`).**
Born-RED, MEASURE-FIRST, two-clause (mirrors the X2/P4 gate spec):

1. **`codegen-parity`** — over the full value corpus (every unit in CSS Values 4
   + the color/transform/gradient grammars), the generated parser's AST output is
   structurally byte-identical to the combinator parser's. RED today: no `./codegen`
   subpath exists, no generated parser to diff. The corpus-parity discipline is
   `backend_ts.rs`'s, lifted into a JS CI gate.
2. **`codegen-throughput`** — a NEW bench scenario (`test/benchmarks/codegen-css.bench.ts`)
   runs the CODEGEN parser over the value corpus and asserts it closes the
   documented gap (BBNF JSON 540 MB/s vs hand-rolled 926 MB/s = 0.58x;
   `future-research.md §11`) toward **≥0.85x** — measured against the live
   value.js floor (`value.js/bench/css-parse-perf.mjs` observed ~4.7 MB/s
   value-parser / ~7.9 MB/s stylesheet; the codegen target is set FROM this
   measured floor, NOT a claimed percentage). Born-RED via a PLANTED FAILURE: a
   stub `./codegen` that emits a `callSpan`-driver wrapper (the falsified runtime
   shape) must FAIL `codegen-throughput` (it cannot beat the closure lane — that
   IS the A.W3 result), so the gate can NEVER false-green on a re-attempted
   runtime interpreter.

---

## PT-B2 — the packrat cross-input pollution FIX (a real correctness BLOCKER)

**The bug, grounded (verified at runtime — `AUDIT-DIGEST.md` P3-correct-packrat).**
The MEMO cache has no source-string identity component, so applying a memoized
parser to input A then input B without `resetPackrat()` returns input A's cached
result for input B — a **confirmed silent-wrong-answer bug**. The key is
`getCijKey(p, offset)` (`packrat.ts:55-56`): `(parser.id << 20) | (offset & MAX)`
— purely `(id, offset)`, no `src`. The MEMO map (`packrat.ts:90`) is module-global
and only cleared by `resetPackrat()` (`packrat.ts:111`). The test suite's
`beforeEach(resetPackrat)` discipline MASKS the defect — the "reset-tax-gone" test
creates false confidence about cross-parse safety.

A SECOND latent defect rides the same key: `getCijKey` uses JS 32-bit bitwise
ops, so `(4096 << 20) === 0` — parser IDs that are multiples of 4096 **alias** to
IDs 0–4095 (runtime-confirmed). The current constellation stays under 4096, but a
large statically-constructed grammar (exactly what the codegen spine generates)
could approach it.

**Why this matters to the spine.** PT-B1's generated parsers are large static
grammars (the CSS-L4 set is ~15 grammars, hundreds of rules → hundreds of Parser
instances). They are the most likely consumers to (a) re-parse different inputs in
a hot session (kf's editing-session re-parse reality) and (b) approach the 4096-ID
ceiling. A correctness bug the spine would amplify must be cured at the root,
BEFORE the spine ships.

**The cure (parse-that B owns the encoding).** Two arms, B chooses:

- **(a) src-identity auto-reset** (`AUDIT-DIGEST.md` P3 idea #1) — a module-global
  `CURRENT_SRC`; in `memoizeFn` (`packrat.ts:253`): `if (state.src !== CURRENT_SRC)
  { resetPackrat(); CURRENT_SRC = state.src; }`. Cost: one `===` per `memoizeFn`
  call. Risk (B weighs): the same string literal used for two logically-distinct
  sessions shares identity — but that is content-identical, so the cache is sound.
- **(b) WeakRef-epoch lifecycle** (the radical arm — `AUDIT-DIGEST.md` P3 idea #4)
  — `CURRENT_SRC_REF: WeakRef<object>` scoping the cache to the live src object's
  lifetime, fully automatic with zero user discipline. More complex
  (FinalizationRegistry async timing).

PLUS the float64-safe key (`AUDIT-DIGEST.md` P3 idea #2): replace `(id << 20) |
(offset & MAX)` with `id * 1048576 + offset` (pure float64, no overflow until
`id > 2^33`) — closes the 4096-ID aliasing at zero cost. The campaign records the
SRC-guard as the BLOCKER cure (the silent-wrong-answer) and the multiply-key as a
stacking one-liner.

Two adjacent correctness hardenings B should fold (P3 ideas #5, #1):
`try/finally` around the `evalParser` call in `memoizeFn` (`packrat.ts:264-284`)
so a throwing map-callback does not leave `LR_STACK`/`MEMO` corrupt; and the
`allStrict()` undefined-preserving variant (`AUDIT-DIGEST.md` P5/B9 — `leaf.ts:125`
drops `undefined` from `all()` tuples, a footgun value.js routes around at
`parsing/index.ts:188-196`).

**The proof arm (PT-B2 → `proof:packrat-cross-input`).** Born-RED:
`memoize(regex(/[a-z]+/)).parse('hello')` seeds the MEMO; the SAME memoized parser
applied to `ParserState('CAPS123')` WITHOUT `resetPackrat()` returns the
`CAPS123` result (today: returns `hello`'s — RED). AND: construct 4096 dummy
parsers, assert `getCijKey(ids[0], 0) !== getCijKey(ids[4096], 0)` (today:
collides — RED). Both flip GREEN on the SRC-guard + multiply-key. The
`beforeEach(resetPackrat)` discipline is REMOVED from this gate's fixture so the
cross-input path is genuinely exercised.

---

## PT-B3 — generate the 16 Span combinators from the value combinators

**The duplication, grounded (`AUDIT-DIGEST.md` P2 idea #4).** `span.ts` duplicates
every value combinator's save/restore/mergeError backtracking plumbing as a Span
twin: compare `parser.ts` `many` (the value lane) vs `span.ts:85-120` `manySpan`
— identical control flow, the ONLY delta is the Span collector (offsets) vs the
value collector. The 10 `*Span` builders (`span.ts:16-360`:
`stringSpan/regexSpan/manySpan/sepBySpan/wrapSpan/optSpan/skipSpan/nextSpan/altSpan`
+ `takeUntilAnySpan`) are ~360 lines of copy-pasted backtracking — a single bug
in `many`'s offset-restore must be fixed twice today.

**Why this matters to the spine.** PT-B1's emitter walks a combinator vocabulary.
If the closure lane and the Span lane drift, the emitter walks a stale IR. ONE
backtracking-control source (the value combinators parameterized over a collector
— Span-accumulator vs value-accumulator) means: the emitter has ONE vocabulary to
walk; a backtracking fix lands in both lanes; the SpanParser IR (`span.ts:599-609`)
stays in lockstep with the runtime semantics it must reproduce.

**The cure (radical, parse-that B owns the risk).** A collector-parametric
combinator factory: `many`/`sepBy`/`wrap`/`opt`/`skip`/`next`/`alt` parameterized
over a collector closure, with the Span lane = `(span-accumulator)` and the value
lane = `(value-accumulator)`. The TEMPTING-BUT-WRONG trap: a generic collector
closure could DEOPT vs the inlined Span body (the zero-alloc property that
justifies the Span lane). The gate guards exactly that.

**The proof arm (PT-B3 → `proof:span-combinator-parity`).** Born-RED, two-clause:
(1) the collector-parametric `manySpan`/`sepBySpan` produce byte-identical Span
output to the current hand-written builders over the span corpus; (2) a perf gate
asserts they are within **5%** throughput of the hand-written Span lane (the
zero-alloc property preserved — a deopting generic collector REDS the gate). The
born-RED witness: today there is no parametric factory; the planted failure is a
naive `Array.map`-based collector that allocates per element — it must RED the 5%
clause.

---

## PT-B4 — the perf frontier (fusion + 2-char dispatch + the regression gate)

**The frontier, grounded (`AUDIT-DIGEST.md` P1/P2/V1-N4).** parse-that's combinator
core is already tight (the 128-entry `dispatch()` Int8Array LUT at `leaf.ts:60`,
inline byte-scanners, WDM packrat), but three residual wins remain — AND the whole
frontier is **regression-blind**: `package.json:34-40` has `test`/`proof:manifest`/
`proof:no-css-surface`/`proof:subpath` but NO `bench` target and NO `proof:perf`
gate, despite the benches existing (`test/benchmarks/*.bench.ts`).

1. **Combinator FUSION** (`AUDIT-DIGEST.md` P1 idea #2) — `then()` allocates
   `[v1, state.value]`/call (`parser.ts`), `all()` allocates a fresh `matches[]`/call
   (`leaf.ts:113`); a static chain is N closures + N allocs. Fuse `a.then(b).map(f)`
   / `all(a,b,c)` / `any(a,b,c)` into ONE monomorphic closure threading state by
   position — zero intermediate tuples. This must preserve the EXACT
   backtracking/offset-restore + the `all()` drop-undefined semantics + error-merge.
2. **2-char (16-bit) dispatch widening** (`AUDIT-DIGEST.md` V1-N4) — the `dispatch()`
   first-char LUT (`leaf.ts:60`) only HALVES the megamorphism on value.js's residual
   `c`/`r`/`s` buckets (`any(fnMath, fnGradient, fnCubicBezier, fnGeneric)` chains —
   calc/clamp/cos/conic collide on first char). A second-level length+second-byte
   discriminator flattens them with IDENTICAL-RESULT discipline.
3. **the `bench` + `proof:perf` gate** (`AUDIT-DIGEST.md` P1/P5 — `future-research.md
   §6`) — add `"bench": "vitest bench"` + a `proof:perf` clause that reds CI when
   `json-comprehensive` (the parse-that baseline shape) regresses >X% vs a
   checked-in baseline JSON. This is the MEASUREMENT substrate every perf ask
   above (and the codegen spine) is gated against.

**Why this matters to the spine.** PT-B1's codegen-throughput gate (and value.js
P's perf waves, and kf P's portable-ratio benches) all need a STABLE, CI-enforced
parse-that baseline. Without `proof:perf`, a fusion that silently regresses, or a
codegen emit that loses, ships unnoticed. The frontier gate is the spine's
regression floor.

**The proof arm (PT-B4 → `proof:perf`).** Born-RED: (1) an alloc-counting bench
(`--expose-gc` + `process.memoryUsage` delta) asserts `fuse(all(a,b,c))` does ZERO
array allocs (today: ≥1 — RED); (2) a 2-char-collision corpus (calc/clamp/cos/conic)
parses ≥40% faster through the widened dispatch than the sequential-trial `any()`
(today: no widened dispatch — RED); (3) a PR introducing a 15% `json-comprehensive`
regression receives a born-RED gate failure (today: no `proof:perf` script exists —
the regression ships silently). The fusion/widening must hold IDENTICAL-RESULT (a
fuzz-equivalence corpus reds any divergence).

---

## INFORM — the constellation context parse-that B needs

### The DAG position: parse-that B is FIRST

parse-that B is the **ROOT** of the campaign DAG (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md §3`):

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0 codegen)         (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
        │                         │                            │
        └── the CODEGEN SPINE ────┴──── generated parser ──────┘
```

- **parse-that B ships first** — value.js P's `1.2.0` perf wave consumes the
  `./codegen` subpath to generate its CSS-value parser; kf P's **P.W4** (GATED) is
  TWO hops down — it consumes the *generated value.js parser*, not parse-that's
  emitter directly. The DAG enforces the inv-16 ordering: parse-that B → value.js
  P → kf-P. **Nothing kf does this tranche unblocks parse-that B; parse-that B
  unblocks everything downstream.**
- **The packrat fix (PT-B2) is the most time-sensitive** — it is a correctness
  BLOCKER the codegen-generated large grammars would amplify (cross-input
  pollution + the 4096-ID aliasing). It should land at parse-that B.W0/W1 (the
  campaign records it as B's FIRST correctness wave), BEFORE the codegen subpath
  ships the large generated grammars.
- **The codegen subpath (PT-B1) is the spine's payload** — it is the move that
  gives the campaign its missing perf payload (A.W3 delivered subpaths + a
  FALSIFIED optimization; PT-B1 delivers the surviving codegen form). value.js P
  cannot generate without it; kf P's frame-compile inheritance rides on it.

### The bench substrate EXISTS (no "create benchmarks" task)

parse-that B should NOT author a "create benchmark infrastructure" task — the
substrate is present:

- `typescript/test/benchmarks/` — 11 files incl. `json-comprehensive.bench.ts`
  (the baseline shape), `span-dispatch.bench.ts` (the A.W3 falsification record —
  a CI artifact proving the runtime switch loses), `wasm-json.bench.ts`,
  `wasm-format.bench.ts`, + the 8-parser comparison matrix (arcsecond, chevrotain,
  nearley, ohm, parjs, parsimmon, peggy, parse-that).
- what is MISSING is the WIRING: a `"bench": "vitest bench"` script + a
  `proof:perf` gate over a checked-in baseline JSON (PT-B4 part 3). The benches
  run; they are just not CI-gated against regression.
- `bbnf-lang` carries its OWN bench corpus (`crates/core/benches/css/ts.rs`,
  `crates/core/benches/json/ts.rs`) — the codegen-throughput numbers PT-B1's gate
  needs have a Rust-side precedent; the JS-side `proof:codegen-throughput` mirrors
  the live `value.js/bench/css-parse-perf.mjs` floor (~4.7 MB/s).

### The SpanParser P-inv-28 limbo: this dispatch chooses BUILD

The retained SpanParser tagged-union (`span.ts:580-902`) has been a **parked asset
with no consumer for multiple tranches** (A retained it "expressly as the codegen
foundation" — `span.ts:570-573`). P-invariant-28 forbids an indefinite no-consumer
deferral: the codegen spine is its terminal home (**BUILD the consumer**) OR the
retention rationale is **KILLED** (`AUDIT-DIGEST.md` P2 idea #2 records the KILL
alternative — delete `span.ts:540-902` + the bench, preserve only the
falsification record as a docs paragraph). **The campaign chooses BUILD** — PT-B1
makes the SpanParser the emitter's input IR. parse-that B must record the SpanParser
disposition as a BUILD-IN terminal (the codegen consumer exists) — NOT a 4th bare
carry. If parse-that B declines PT-B1, the falling-back disposition is the KILL
(the retention has no other terminal home).

### The A.W3 falsification is PRECISE and must NOT be re-litigated

Every codegen idea carries the same guard, stated once here for parse-that B:
A.W3 measured the SpanParser as a *runtime* recursive `switch` — ~10–14% SLOWER
on V8 than the closure lane, across three workloads (`span.ts:558-564`;
`future-research.md §7`; the `span-dispatch.bench.ts` record). That falsification
is **correct and final**. The codegen spine does NOT re-attempt it — it emits
BUILD-TIME straight-line source (no `switch`, no `callSpan` recursion). Any PT-B1
encoding that produces a runtime `switch (sp.kind)` driver IS the falsified shape
relocated, and `proof:codegen-throughput`'s planted-failure clause reds it. The
SpanParser data structure survives as the codegen IR; the runtime-dispatch
*premise* stays retired.

### The constellation version split

- **parse-that B → 0.12.0** — the codegen subpath + the packrat fix + the
  Span-combinator generation + the perf frontier. BC-additive over 0.11.0 (the
  `./codegen` subpath is new; the rest is internal). The SpanParser BUILD-IN
  terminal is recorded.
- **value.js P → 1.1.0** (API: VJ-L1 `flatLeaf` + VJ-L3 `parseCSSSubValue`) then
  **1.2.0** (perf: the codegen-consume generating the CSS-value parser from
  `css/l4/*.bbnf`, + `color2Into`). value.js P consumes parse-that B's `./codegen`.
- **keyframes P → 5.1.x** — inherits the generated value.js parser behind the
  same `CSSKeyframesAnimation` facade (P.W4, GATED on parse-that B + value.js P).

---

## Dependencies

- **parse-that B is the DAG ROOT — it depends on NOTHING in the constellation.**
  It is the FIRST tranche; value.js P and kf P consume its output. The only
  external substrate it consumes is `bbnf-lang` (the TS emitter, if PT-B1 takes
  encoding (A)) — which EXISTS locally and is itself a parse-that consumer
  (`bbnf-path-ts/ts/`), so the realm is already coupled.
- **PT-B2 (the packrat fix) is sequencing-critical** — it should land at B's first
  correctness wave (B.W0/W1), BEFORE PT-B1's large generated grammars consume the
  packrat tier (the cross-input pollution + 4096-ID aliasing the codegen grammars
  would amplify).
- **PT-B1 (the codegen subpath) blocks value.js P's 1.2.0 perf wave** and (two
  hops) kf P's **P.W4** codegen-consume. kf's P.W4 is GATED born-RED — it stays
  RED until `@mkbabb/parse-that/codegen` is published AND value.js P consumes it to
  ship the generated parser. kf does NOT consume parse-that's emitter directly.
- **PT-B3/PT-B4 are parse-that-internal** — they harden the emitter's IR
  (one combinator vocabulary) and the regression floor (`proof:perf`), but kf
  consumes neither directly; they are the spine's structural and measurement
  underpinnings.
- **NO kf publish dependency, NO value.js publish dependency.** parse-that B fires
  entirely on its own tree + `bbnf-lang`. This dispatch is a coordination record —
  kf authors the ASK; parse-that B schedules it into its own waves; kf re-pins +
  consumes (via value.js) ONLY after parse-that B publishes 0.12.0.

---

## dev→impl boundary

This file is the keyframes Tranche P DEVELOPMENT dispatch to parse-that — **DOCS
ONLY**. It writes ZERO parse-that source (inv-16: kf writes only keyframes.js;
every cross-repo need is a *dispatch*, never a foreign-tree edit). The four ASKs
are coordination records for parse-that's Tranche B session to formalize into its
own waves on its own authorization — parse-that owns the emitter encoding (the
SpanParser tree-walk vs the bbnf-lang wrapper), the packrat cure arm (src-guard vs
WeakRef-epoch), the Span-combinator factory's deopt risk, and the fusion's
backtracking-preservation. kf's role is downstream + DAG-ordered: consume the
generated value.js parser (P.W4, GATED) ONLY after parse-that B publishes 0.12.0
AND value.js P publishes the generated parser — publish-then-consume, never
cross-write. The whole packet is observable-truth (every ASK carries a falsifiable
born-RED gate witnessed on parse-that's CURRENT tree — the absent `./codegen`
subpath, the confirmed cross-input pollution, the duplicated Span combinators, the
missing `proof:perf`), no-legacy (the codegen spine is the SpanParser's terminal
home — BUILD or KILL, no 4th bare carry; the Span-combinator generation dissolves
~400 duplicated lines), gestalt (ONE combinator vocabulary feeding both the closure
lane and the codegen IR; ONE perf-regression floor), and P-invariant-28 (the
SpanParser retention gets a BUILD-IN terminal, the packrat BLOCKER gets a born-RED
correctness gate). Implementation opens only on parse-that's owner authorization,
per-repo, DAG-ordered. inv-16 holds throughout.
