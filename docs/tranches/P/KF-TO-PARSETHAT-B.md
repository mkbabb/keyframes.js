# keyframes.js → parse-that Tranche B — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-20 at the keyframes P development phase (the **Constellation
> Optimization Campaign** — `CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`). parse-that
> is the ROOT of the constellation spine (**parse-that → value.js → keyframes.js
> → glass-ui**). This is the **FIRST kf→parse-that dispatch** — parse-that has
> only **Tranche A** (CLOSED 2026-06-19 at 0.11.0: subpath split + WDM packrat +
> the FALSIFIED SpanParser retained behind the bench as the A.W3 record). It is a
> coordination record: parse-that's **Tranche B** session formalizes the asks
> below into its own waves. **No parse-that source is written from keyframes.js**
> (inv-16: kf writes only keyframes.js; every cross-repo need is a *dispatch*,
> never a foreign-tree edit). The consume-edge discipline holds: parse-that
> publishes `0.12.0`, value.js P consumes the packrat-correctness fix + the
> perf-floor gate, kf inherits a faster, input-safe parser — **publish-then-consume,
> DAG-ordered, never cross-write.**

This dispatch is the binding cross-repo contract for parse-that's leg of the
campaign's **IN-REALM optimization payload**
(`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md §4`). parse-that B is the DAG ROOT leg of
the constellation (parse-that → value.js → kf → glass-ui), and it ships **two
grounded in-realm deliverables + one no-consumer KILL** (the FULL-LOOP reformulation
folded the Span-combinator DEDUP into the KILL — see below): the packrat cross-input
pollution FIX (the correctness BLOCKER, **ADOPT**), and the perf frontier (combinator
fusion + 2-char dispatch widening + the `proof:perf` regression gate, **ADOPT**) — plus
the SpanParser KILL (P-inv-28: it has no in-realm consumer, so the tier + its bench are
deleted, keeping the A.W3 falsification as a docs paragraph). The **Span-combinator DEDUP
is RE-SCOPED**: the 15 `*Span` builders have ZERO production consumers (measured), so
the dedup is moot — the zero-consumer `*Span` lane folds into the PT-B4 KILL (delete dead
code, do not dedup it), not a collector-parametric factory. value.js P consumes the
packrat-correctness fix + the perf-floor; kf P inherits a faster, input-safe
parser behind the same `CSSKeyframesAnimation` facade. The asks are **BC-additive**
(no breaking change to parse-that's published 0.11.0 surface — the packrat fix is
internal; the KILL removes only module-internal no-consumer tiers) — a single `0.12.0`
minor closes the deliverables.

> **Codegen is explicitly OUT of this campaign (owner directive, 2026-06-22).**
> parse-that ships NO codegen subpath, NO `./codegen`, NO SpanParser→TS emitter,
> NO "grammar-as-source-of-truth" generated parser, and NO de-risk spike for one.
> Codegen is BBNF-lang's job, to be done in a **completely separate session** —
> out of this campaign's scope. `bbnf-lang` is not referenced here as a dependency,
> substrate, fallback, or design reference; it is simply out of scope.

**The premise correction (record-as-built honesty, campaign §1).** The campaign
audit overturned the "no bench" framing: parse-that **already has a bench
substrate** (`typescript/test/benchmarks/` — 11 files incl.
`json-comprehensive.bench.ts`, `wasm-json.bench.ts`); what is missing is the
WIRING (a `bench` script + a `proof:perf` regression gate over it).

---

## The ASKs (two in-realm deliverables + the SpanParser KILL; PT-B2 folded into the KILL)

| # | ASK | parse-that surface (file:line) | parse-that B deliverable | the value.js+kf payoff | proof arm that GREENs (born-RED) |
|---|-----|--------------------------------|--------------------------|------------------------|-----------------------------------|
| **PT-B1** | **the packrat cross-input pollution FIX** (the BLOCKER, lands FIRST) — `memoize()` returns a stale result across different inputs (the MEMO key lacks a `src` component); a real correctness BLOCKER. | `typescript/src/parse/packrat.ts:55-56` (`getCijKey = (parser.id << 20) \| (offset & MAX)` — no `src`); `:90` (`MEMO = new Map<number,MemoCell>()`); `:253` (`memoizeFn`). | a `src`-identity guard in `memoizeFn` (auto-reset on `state.src` change) **OR** a WeakRef-epoch cache lifecycle; PLUS the float64-safe multiply key (`id * 1048576 + offset`) closing the `id ≥ 4096` int32-overflow aliasing. | value.js's parse LRU and kf's memoized timing-function parses become input-safe with zero caller discipline; eliminates a class of silent-wrong-answer in any hot re-parse session. | `proof:packrat-cross-input` (born-RED): `memoize(p).parse('hello')` then the SAME memoized parser on `ParserState('CAPS123')` WITHOUT `resetPackrat()` returns the `CAPS123` result, not the cached `hello` one; AND `getCijKey(ids[0],0) !== getCijKey(ids[4096],0)`. |
| **PT-B2** *(RE-SCOPE → FOLD into PT-B4)* | **the Span-combinator lane** — originally a DEDUP of the ~400 copy-pasted `*Span` lines; **MEASURED: the 15 `*Span` builders have ZERO production consumers**, so the dedup is moot. Do NOT dedup dead code — fold the zero-consumer lane's disposition into the PT-B4 KILL. | `typescript/src/parse/span.ts:16-360` (the 15 `*Span`/`*Node` builders); grep over `value.js/src`, `kf/src`, `parse-that/src/parse/parsers` → ZERO production hits (all route through `dispatch()+regex`/`all`/`any`). | NO collector-parametric factory. parse-that B EITHER (a) defers the dedup as opportunistic if a future `json`/`csv` consumer materializes, OR (b) raises a P-inv-28 terminal verdict on the `*Span` public surface (delete it with the SpanParser KILL). | no parametric-factory investment to protect a zero-consumer lane; a no-consumer surface gets a terminal disposition, not a refactor. | NO `proof:span-combinator-parity` perf gate (it would protect a zero-alloc property of a zero-consumer lane). If the lane is deleted (option b), only the BC export-removal note is recorded. |
| **PT-B3** | **the perf frontier** — combinator FUSION + a 2-char (16-bit) dispatch widening for the residual 3–4-deep `any()` buckets; PLUS a `bench` script + `proof:perf` CI gate (the frontier is currently regression-blind). | `typescript/src/parse/leaf.ts:60-104` (`dispatch()` first-char Int8Array LUT); `:107-136` (`all()` allocs a fresh `matches[]`/call); `parser.ts` then-chains (`[v1, state.value]`/call); `package.json:34-40` (NO `bench` target, NO `proof:perf`). | fuse static `a.then(b).map(f)` / `all(a,b,c)` / `any(a,b,c)` chains into ONE monomorphic closure (zero intermediate tuples); widen `dispatch()` to a length+second-byte discriminator; add `"bench": "vitest bench"` + `proof:perf` over a checked-in baseline JSON. | removes per-call tuple/array alloc on value.js's hottest shapes (59 `all()` sites); flattens the residual megamorphism `dispatch()`'s first-char halving left; makes the campaign's perf claims CI-auditable. | `proof:perf` (born-RED): an alloc-counting bench asserts `fuse(all(a,b,c))` does ZERO array allocs (vs ≥1 today); a 2-char-collision corpus (calc/clamp/cos/conic) parses ≥40% faster through the widened dispatch; a 15% `json-comprehensive` regression reds CI. |
| **PT-B4** | **the SpanParser KILL** (P-inv-28 resolves to KILL) — the retained SpanParser introspection tier has NO in-realm consumer (its only rationale was the codegen foundation; codegen moved to a separate bbnf-lang session), so DELETE the tier + its bench, keeping the A.W3 falsification as a docs paragraph. | the retained SpanParser introspection tier (`typescript/src/parse/span.ts:540-902` — `SpanParserKind`, the `SpanParser` tagged-union, `callSpan()`); the `span-dispatch.bench.ts` A.W3 record. (The live `*Span` builders at `span.ts:16-360` are a SEPARATE no-consumer lane — PT-B2 RE-SCOPE folds their disposition here: deleted as zero-consumer surface, not deduped.) | delete `span.ts:540-902` + `span-dispatch.bench.ts`; preserve ONLY the A.W3 falsification as a docs paragraph (the runtime-switch loss record). (parse-that's session decides; the recommendation is KILL.) | removes a parked, no-consumer tier from the surface; the A.W3 lesson survives as documentation, not as dead module-internal code. | `proof:span-parser-killed` (or fold into PT-B2's housekeeping): no `SpanParser` tagged-union / `callSpan()` remain in `span.ts`; the `span-dispatch.bench.ts` artifact is gone; the A.W3 paragraph is present in `future-research.md §7`. |

---

## PT-B1 — the packrat cross-input pollution FIX (the BLOCKER, lands FIRST)

> **FULL-LOOP verdict (2026-06-22): ADOPT — the campaign's correctness BLOCKER, lands FIRST
> (parse-that B.W0/W1).** Both defects REPRODUCED at runtime (vitest probe, `beforeEach(resetPackrat)`
> removed): `memoize(regex(/[a-z]+/)).parse('hello')` then the SAME parser `.parse('world')`
> returns `'hello'` (STALE); `memoize(all(word,'-',num)).parse('abc-123')` then `.parse('xyz-789')`
> returns `['abc','-','123']` (STALE); and `getCijKey(0,0) === getCijKey(4096,0) === 0` (the int32
> overflow aliasing). **Cure (refined): src-identity auto-reset at the parseState ENTRY boundary**
> (NOT a per-`memoizeFn`-call `CURRENT_SRC` compare — gate the reset where a top-level `parse()`
> already knows its src, for zero per-node cost) **+ the free float64-safe multiply-key**
> (`id*1048576+offset`). Stack the `try/finally` hardening + the `allStrict()` undefined-preserving
> variant so value.js can retire its drop-undefined workaround. The born-RED gate
> `proof:packrat-cross-input` drops `beforeEach(resetPackrat)` and asserts BOTH the stale-clause
> (witnessed RED) AND the post-fix positive (B correct + A re-memoizes). See
> `docs/tranches/P/FULL-LOOP-LEDGER.md §parsethat-B-asks`. DISPATCH only (inv-16).

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
large statically-constructed grammar could approach it.

**Why this lands FIRST.** This is the campaign's correctness BLOCKER. value.js's
parse LRU and kf's memoized timing-function parses both re-parse different inputs
in a hot session (kf's editing-session re-parse reality) — exactly the path the
cross-input pollution corrupts. A silent-wrong-answer at the parse root must be
cured BEFORE value.js P and kf P consume parse-that 0.12.0. It should land at
parse-that B.W0/W1, the FIRST correctness wave.

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

**The proof arm (PT-B1 → `proof:packrat-cross-input`).** Born-RED:
`memoize(regex(/[a-z]+/)).parse('hello')` seeds the MEMO; the SAME memoized parser
applied to `ParserState('CAPS123')` WITHOUT `resetPackrat()` returns the
`CAPS123` result (today: returns `hello`'s — RED). AND: construct 4096 dummy
parsers, assert `getCijKey(ids[0], 0) !== getCijKey(ids[4096], 0)` (today:
collides — RED). Both flip GREEN on the SRC-guard + multiply-key. The
`beforeEach(resetPackrat)` discipline is REMOVED from this gate's fixture so the
cross-input path is genuinely exercised.

---

## PT-B2 — the Span-combinator lane (RE-SCOPE: the *Span builders have ZERO consumers → FOLD into the PT-B4 KILL)

> **FULL-LOOP verdict (2026-06-22): RE-SCOPE — the DEDUP is MOOT (measured: zero consumers).**
> The original ask was a collector-parametric factory collapsing the ~400 copy-pasted `*Span`
> lines. The MEASURED finding overturns it: a grep across all three trees
> (`manySpan|sepBySpan|regexSpan|wrapSpan|altSpan|takeUntilAnySpan|stringSpan|optSpan|skipSpan|nextSpan`)
> over `value.js/src`, `kf/src`, `parse-that/src/parse/parsers` returns **ZERO production hits** —
> value.js consumes parse-that via `all`/`any`/`regex`/`string`/`dispatch` (never a `*Span`
> builder), and parse-that's own `json.ts`/`csv.ts` use `dispatch()+regex`. The 15 `*Span`
> builders (`span.ts:16-360`) are an **unexercised lane**. A parametric-factory refactor + a 5%
> perf gate would de-risk dead weight and land deopt risk on code nobody runs. **Do NOT dedup
> dead code: FOLD the disposition into the PT-B4 KILL** — if the `*Span` runtime lane has no
> consumer that will ever materialize, it is a P-inv-28 no-consumer surface and is deleted with
> the SpanParser tier, not factored. See `docs/tranches/P/FULL-LOOP-LEDGER.md §parsethat-B-asks`.

**The MEASURED finding (grep over all three trees).** The 10 `*Span` builders + the 5 `*Node`
builders (15 total, `span.ts:16-360`) have ZERO production consumers: value.js, kf, and
parse-that's own `json.ts`/`csv.ts` parsers all route through `dispatch()+regex`/`all`/`any`,
never a `*Span`. The "a bug in `many`'s offset-restore is fixed once not twice" payoff applies
to a lane with **no live bug surface** — the duplication is real but it duplicates code nobody
exercises in production.

**The disposition (parse-that B owns the call — recommend FOLD into PT-B4).** Two grounded
options, NOT a parametric-factory build:
- **(a) defer-opportunistic** — if parse-that keeps the lane for a future `json`/`csv` use, the
  DEDUP is deferred to a future tranche and made OPPORTUNISTIC (fix `many`-restore bugs in both
  copies when touched). No factory now.
- **(b) P-inv-28 surface disposition (recommended)** — raise a terminal verdict on the `*Span`
  public surface itself: since no consumer will ever materialize, **deprecate/delete it alongside
  the PT-B4 SpanParser KILL** (one atomic `span.ts` diff). This is the no-legacy move — a
  no-consumer surface gets a terminal disposition, not a parametric-factory investment.

**No `proof:span-combinator-parity` perf gate is authored.** Spending a parametric factory + a
5% zero-alloc gate to protect a zero-consumer lane is exactly the contrivance the FULL-LOOP
reformulation retires. If parse-that B does delete the lane (option b), the only gate needed is
that the published surface change is recorded (the BC note on the export removal).

---

## PT-B3 — the perf frontier (fusion + 2-char dispatch + the regression gate)

> **FULL-LOOP verdict (2026-06-22): ADOPT — the alloc/dispatch wins are MEASURED on a real
> value.js consumer.** vitest probes confirm: `all()` allocates a fresh `matches[]` per call
> (**~7.0 MB heap delta / 2M calls**, 56.7 ns/op); `then()` allocates `[v1, state.value]` per
> call (40.3 ns/op); the 4-deep `c`-bucket `any()` worst-case (`conic`, 4th) is **60.8 ns/op**
> vs best-case (`calc`, 1st) 21.9 ns/op = a **2.8× penalty**; `package.json` has NO `bench`, NO
> `proof:perf`. ADOPT as three ordered sub-deliverables. **ONE scope correction:** the 2-char
> widening only DISAMBIGUATES the 2nd-byte-distinct tokens — probed `{ca:[calc], cl:[clamp],
> co:[cos,conic], cu:[cubic]}`, so the `co` bucket STILL collides (cos vs conic); the gate's
> ≥40% clause must scope to ca/cl/cu (fully flattened) and treat `co` honestly as a 2-deep
> residual, NOT over-claim a full flatten. See `docs/tranches/P/FULL-LOOP-LEDGER.md §parsethat-B-asks`.

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
   above is gated against.

**Why this matters downstream.** value.js P's perf waves and kf P's portable-ratio
benches need a STABLE, CI-enforced parse-that baseline. Without `proof:perf`, a
fusion that silently regresses ships unnoticed. The frontier gate is the campaign's
parse-that regression floor.

**The proof arm (PT-B3 → `proof:perf`).** Born-RED: (1) an alloc-counting bench
(`--expose-gc` + `process.memoryUsage` delta) asserts `fuse(all(a,b,c))` does ZERO
array allocs (today: ≥1 — RED); (2) a 2-char-collision corpus (calc/clamp/cos/conic)
parses ≥40% faster through the widened dispatch than the sequential-trial `any()`
(today: no widened dispatch — RED); (3) a PR introducing a 15% `json-comprehensive`
regression receives a born-RED gate failure (today: no `proof:perf` script exists —
the regression ships silently). The fusion/widening must hold IDENTICAL-RESULT (a
fuzz-equivalence corpus reds any divergence).

---

## PT-B4 — the SpanParser KILL (P-inv-28 resolves to KILL)

> **FULL-LOOP verdict (2026-06-22): KILL — confirmed, zero consumers across all three trees.**
> A grep over `parse-that/src`, `value.js/src`, `kf/src`
> (`callSpan|SpanParserKind|spanParserToParser|SpanParser\b|stringSpanNode|manySpanNode|altSpanNode`)
> returns **ZERO consumers** outside `span.ts`; the tier is NOT re-exported (the `index.ts:11`
> hit is a comment). The tier (`span.ts:540-902` — `SpanParserKind`, the tagged-union, the
> `*Node` builders, `callSpan`, `spanParserToParser`) + `span-dispatch.bench.ts` exist on the
> current tree (RED). Its only rationale (the codegen foundation) moved to a separate bbnf-lang
> session OUT of scope — P-inv-28 resolves to KILL. Preserve ONLY the A.W3 falsification (the 3
> workloads + the ~10-14% V8 slowdown) as a `future-research.md §7` paragraph. **RECOMMEND
> folding into one atomic `span.ts` diff with the PT-B2 RE-SCOPE** (the `*Span` lane has the
> same zero-consumer disposition); verify the `parserNames` tuple is pruned of any SpanParser-only
> orphans. See `docs/tranches/P/FULL-LOOP-LEDGER.md §parsethat-B-asks`. DISPATCH only (inv-16).

**The disposition, resolved.** The retained SpanParser introspection tier
(`span.ts:540-902` — `SpanParserKind`, the `SpanParser` tagged-union, `callSpan()`)
was retained at Tranche A "expressly as the codegen foundation"
(`span.ts:570-573`). That was its **only** rationale. Codegen has now moved to a
separate bbnf-lang session, OUT of this campaign's scope (owner directive,
2026-06-22) — so this tier has **NO in-realm consumer**. P-invariant-28 forbids an
indefinite no-consumer carry; with the codegen foundation gone, the resolution is
**KILL** (no parked asset held for an external prototype).

**The cure (KILL — parse-that's session decides; the recommendation is KILL).**
Delete `span.ts:540-902` (the `SpanParser` tagged-union + `callSpan()`) and the
`span-dispatch.bench.ts` artifact. Preserve ONLY the **A.W3 falsification as a docs
paragraph** (`future-research.md §7`): the SpanParser tagged-union, measured as a
*runtime* recursive `switch`, was ~10–14% SLOWER on V8 than the closure lane across
three workloads — a correct, final falsification that survives as documentation,
not as dead module-internal code. **Scope precision (PT-B2 RE-SCOPE folds in here):** the
KILL primarily targets the dormant introspection tier (`span.ts:540-902`). The `*Span` runtime
builders (`span.ts:16-360`) have the SAME zero-consumer disposition (measured: ZERO production
hits across value.js/kf/parse-that) — PT-B2 is RE-SCOPED so the `*Span` lane is NOT deduped via
a collector-parametric factory but folded into this KILL: parse-that B EITHER defers them
opportunistically OR deletes them with the introspection tier (one atomic `span.ts` diff).

**The proof arm (PT-B4 → `proof:span-parser-killed`).** Born-RED: today the
`SpanParser` tagged-union + `callSpan()` still live at `span.ts:540-902` and
`span-dispatch.bench.ts` still exists (RED). The gate GREENs when: no `SpanParser`
tagged-union, no `callSpan()`, and no `span-dispatch.bench.ts` remain (the live
`*Span` builders at `span.ts:16-360` are untouched); AND the A.W3 falsification
paragraph is present in `future-research.md §7`.

---

## INFORM — the constellation context parse-that B needs

### The DAG position: parse-that B is FIRST

parse-that B is the **ROOT** of the campaign DAG (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md §3`):

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0: packrat-fix       (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
   + Span-dedup + perf)             │                            │
        │                          │                            │
        └── packrat-correctness + perf-floor consume ───────────┘
```

- **parse-that B ships first** — value.js P and kf P consume parse-that B's
  packrat-correctness FIX + its perf-floor (`proof:perf`) gate; the coupling is the
  API + correctness + perf-floor, NOT a generated parser. The DAG enforces the
  inv-16 ordering: parse-that B → value.js P → kf-P. **Nothing kf does this tranche
  unblocks parse-that B; parse-that B unblocks everything downstream.**
- **The packrat fix (PT-B1) is the most time-sensitive** — it is a correctness
  BLOCKER any hot re-parse session would amplify (cross-input pollution + the
  4096-ID aliasing). It lands FIRST, at parse-that B.W0/W1 (the campaign records it
  as B's FIRST correctness wave), BEFORE value.js P and kf P consume 0.12.0.
- **Codegen is OUT** — the campaign's perf payload is parse-that's IN-REALM
  optimizations (PT-B3 fusion + dispatch widening + the `proof:perf` floor), value.js
  P's color/alloc work, and kf P's SoA/Playhead/Typed-OM. There is no generated
  parser in this campaign; codegen is BBNF-lang's separate session.

### The bench substrate EXISTS (no "create benchmarks" task)

parse-that B should NOT author a "create benchmark infrastructure" task — the
substrate is present:

- `typescript/test/benchmarks/` — incl. `json-comprehensive.bench.ts` (the
  baseline shape), `wasm-json.bench.ts`, `wasm-format.bench.ts`, + the 8-parser
  comparison matrix (arcsecond, chevrotain, nearley, ohm, parjs, parsimmon, peggy,
  parse-that). (The `span-dispatch.bench.ts` A.W3 record is deleted with the
  SpanParser KILL — PT-B4; its result survives as the `future-research.md §7`
  paragraph.)
- what is MISSING is the WIRING: a `"bench": "vitest bench"` script + a
  `proof:perf` gate over a checked-in baseline JSON (PT-B3 part 3). The benches
  run; they are just not CI-gated against regression.

### The SpanParser P-inv-28 disposition: this dispatch resolves to KILL

The retained SpanParser tagged-union (`span.ts:540-902`) has been a **parked asset
with no consumer for multiple tranches** (A retained it "expressly as the codegen
foundation" — `span.ts:570-573`). P-invariant-28 forbids an indefinite no-consumer
deferral. Its only rationale was the codegen foundation, and codegen has moved to a
separate bbnf-lang session OUT of this campaign's scope (owner directive,
2026-06-22) — so it has **no in-realm consumer**. P-inv-28 therefore resolves to
**KILL** (`AUDIT-DIGEST.md` P2 idea #2 records the KILL — delete `span.ts:540-902`
+ the `span-dispatch.bench.ts`, preserve only the A.W3 falsification as a docs
paragraph). This is PT-B4 (or folds into PT-B2's housekeeping). No parked asset is
held for an external prototype — bbnf-lang is a separate session and does NOT
consume parse-that's SpanParser.

### The A.W3 falsification is PRECISE and survives as documentation

The A.W3 falsification stays correct and final, and the SpanParser KILL (PT-B4)
preserves it as a docs paragraph. A.W3 measured the SpanParser as a *runtime*
recursive `switch` — ~10–14% SLOWER on V8 than the closure lane, across three
workloads (`span.ts:558-564`; `future-research.md §7`; the `span-dispatch.bench.ts`
record). The KILL deletes the dead tier + its bench but keeps the lesson in
`future-research.md §7`: the runtime-dispatch *premise* stays retired, recorded as
documentation rather than as no-consumer code.

### The constellation version split

- **parse-that B → 0.12.0** — the packrat-fix (PT-B1, ADOPT) + the perf frontier
  (PT-B3, ADOPT) + the SpanParser KILL (PT-B4, KILL — folding in the PT-B2 RE-SCOPE:
  the zero-consumer `*Span` lane is deleted, not deduped). BC-additive over 0.11.0
  (the packrat fix is internal; the KILL removes only module-internal no-consumer
  tiers).
- **value.js P → 1.1.0** (API: VJ-L3 `parseCSSSubValue` — the surviving binding ask;
  VJ-L1 `flatLeaf` is **DEMOTED-TO-SPIKE**, not on the publish path) then
  **1.2.0** (perf: VJ-P1 `color2Into` (ADOPT) + the VJ-P3 `:any`→`string` seam
  narrowing — the color/alloc/perf work, NOT a generated parser; **VJ-P2 typed-channel
  -view is DROPPED**, falsified premises). The authoritative version split is
  `KF-TO-VALUEJS-P.md`. value.js P consumes parse-that B's packrat fix + perf floor.
- **keyframes P → 5.1.x** — inherits a faster, input-safe value.js parser behind
  the same `CSSKeyframesAnimation` facade (GATED on parse-that B + value.js P).

---

## Dependencies

- **parse-that B is the DAG ROOT — it depends on NOTHING in the constellation,
  and NOTHING external.** It is the FIRST tranche; value.js P and kf P consume its
  output. All deliverables are IN-REALM over parse-that's own tree (the
  packrat fix, the perf frontier, the SpanParser KILL — with the RE-SCOPED `*Span`
  lane folded into the KILL); none takes
  an external substrate. **bbnf-lang is NOT a dependency, NOT a substrate, NOT a
  design reference** — codegen is its own separate session, OUT of this campaign's
  scope (owner directive, 2026-06-22).
- **PT-B1 (the packrat fix) is sequencing-critical and lands FIRST** — it is the
  correctness BLOCKER. It should land at B's first correctness wave (B.W0/W1),
  BEFORE value.js P and kf P consume parse-that 0.12.0 (the cross-input pollution +
  4096-ID aliasing any hot re-parse session would amplify).
- **value.js P and kf P consume parse-that B's correctness + perf-floor, not a
  generated parser.** value.js P's 1.2.0 perf work rides on a faster, input-safe
  parse-that; kf P inherits it two hops down via the value.js parser. kf's downstream
  wave is GATED born-RED — it stays RED until parse-that B publishes 0.12.0 AND
  value.js P re-pins it.
- **PT-B2/PT-B3/PT-B4 are parse-that-internal** — the `*Span` lane disposition
  (RE-SCOPED: folded into the KILL, no factory), the perf-regression floor
  (`proof:perf`), and the SpanParser KILL. kf consumes the perf floor's stability but
  none of these tiers directly.
- **NO kf publish dependency, NO value.js publish dependency.** parse-that B fires
  entirely on its own tree. This dispatch is a coordination record — kf authors the
  ASK; parse-that B schedules it into its own waves; kf re-pins + consumes (via
  value.js) ONLY after parse-that B publishes 0.12.0.

---

## dev→impl boundary

This file is the keyframes Tranche P DEVELOPMENT dispatch to parse-that — **DOCS
ONLY**. It writes ZERO parse-that source (inv-16: kf writes only keyframes.js;
every cross-repo need is a *dispatch*, never a foreign-tree edit). The ASKs
(the packrat fix (ADOPT), the perf frontier (ADOPT), the SpanParser KILL — with the
RE-SCOPED `*Span` lane folded in) are
coordination records for parse-that's Tranche B session to formalize into its own
waves on its own authorization — parse-that owns the packrat cure arm (src-guard at the
parseState entry boundary vs WeakRef-epoch), the `*Span` lane disposition (defer vs delete),
the fusion's backtracking-preservation, and the SpanParser KILL's housekeeping. kf's role is
downstream + DAG-ordered: consume the faster, input-safe value.js parser (GATED)
ONLY after parse-that B publishes 0.12.0 AND value.js P re-pins it —
publish-then-consume, never cross-write. The whole packet is observable-truth
(every ASK carries a falsifiable born-RED gate witnessed on parse-that's CURRENT
tree — the confirmed cross-input pollution, the ZERO-consumer `*Span` lane, the
missing `proof:perf`, the no-consumer SpanParser tier), no-legacy (the SpanParser
AND the zero-consumer `*Span` lane get a terminal disposition — KILL, no 4th bare carry),
gestalt (ONE perf-regression floor), and P-invariant-28 (the SpanParser retention
resolves to KILL, the packrat BLOCKER gets a born-RED correctness gate).
**Codegen is explicitly OUT** — it is BBNF-lang's job in a completely separate
session, not part of this campaign. Implementation opens only on parse-that's owner
authorization, per-repo, DAG-ordered. inv-16 holds throughout.
