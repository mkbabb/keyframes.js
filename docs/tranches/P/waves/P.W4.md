# P.W4 — the codegen-consume: kf inherits value.js's generated CSS parser + the per-keyframe-shape interp-plan codegen (the campaign's missing perf payload, kf leg)

**Band:** B — engine-perf (the transpositions).
**Phase:** **GATED** — fires atomically on a NAMED sibling trigger: parse-that B ships `@mkbabb/parse-that/codegen` (the BBNF→specialized-monomorphic-TS emitter) AND value.js P generates its CSS-value parser from `css/l4/*.bbnf`. The kf-side consume CANNOT land before both publishes land. (Contrast P.W2/P.W3 — pure NOW.)
**Sequence:** `parse-that B publish ─► value.js P publish ─► P.W4 codegen-consume (GATED) ─► P.WZ close (5.1.x)`. P.W4 is the LAST Band-B wave — it consumes the generated parser AFTER P.W1's perf-gate apparatus + P.W2/P.W3's NOW transpositions land, and feeds P.WZ's 5.1.x cut. The DAG edge: `parse-that Tranche B (0.12.0 codegen) ─► value.js Tranche P (1.2.0 perf, generates parser) ─► keyframes Tranche P (consumer)` (CONSTITUTION §3, §4 — the CODEGEN SPINE).
**Owning DM/idea:** **the CODEGEN SPINE (CONSTITUTION §4) — the surviving form of the falsified §7 thesis.** Two converging digest ideas: **K1** "the codegen-consume" (`AUDIT-DIGEST.md` K1 :434-437 `[incremental·perf]` — the densify-COMPILE leg gated on the value.js-P re-pin) and **X2** the triumvirate-scale codegen spine + the per-keyframe-shape interp-plan codegen (`AUDIT-DIGEST.md` X2 :1014-1017 "Close the codegen spine" + :1034-1037 `[radical·codegen]` "Emit the kf frame-compiler's interp plan as generated specialized code per keyframe-shape"). The spine's four converging audit lanes (V1-N2 · P1 · P4 · X2) are the campaign's documented missing perf payload (CONSTITUTION §4).

This wave is the **kf leg of the CODEGEN SPINE** — and it splits into TWO consume planes:

- **Plane A — the inherited generated parser (GATED, free).** value.js generates its CSS-value parser from `css/l4/*.bbnf` via parse-that's emitter; kf inherits **parity-or-better frame-compilation + spec-as-source maintainability** (the `.bbnf` spec IS the parser — ~700 hand-combinator lines dissolve) **for free** — a re-pin + a parity+throughput gate, NOT a kf-authored emitter (inv-16: the emitter lives in parse-that, value.js owns the generation, kf consumes). The win is GRAMMAR-AS-SOURCE-OF-TRUTH + eliminating combinator-closure overhead, GATED AT PARITY-OR-BETTER throughput (no regression vs the hand-written parser, anchored on the value.js PORTABLE JSON.parse-ratio). This re-wires the DEAD O.W6 SpanParser-jump-table consume edge into a LIVE codegen edge (CONSTITUTION §4).
- **Plane B — the kf-internal interp-plan codegen (NOW-able after Plane A's apparatus, but GUARDED).** The X2 `[radical·codegen]` idea: emit, per FIXED keyframe-shape, straight-line interp arithmetic for the hot long-running rAF loop — guarded against the `new Function` warm-up/CSP cost + the one-shot anti-pattern. This is a kf-internal codegen (no sibling dep) but it RIDES the spine's apparatus (the parity+throughput discipline Plane A ratifies), so it lands in the same wave.

---

## Context

### The spine, grounded (Plane A)

The codegen spine exists end-to-end but is DORMANT (`AUDIT-DIGEST.md` X2 :1005-1007): bbnf-lang ships a full CSS-L4 grammar set (`grammar/css/l4/{stylesheet,color,keyframes,easing}.bbnf`) AND a `CompileTarget::Ts` emitter that generates flat, charCode-dispatched, in-place-offset parsers (verified this session — bbnf-lang EXISTS at `/Users/mkbabb/Programming/bbnf-lang`, a real TS-emitter codegen tool, so the spine is **wiring, not greenfield** — CONSTITUTION §1), yet value.js STILL ships hand-written combinators (`units.ts`, `stylesheet.ts`) and marks its own `.bbnf` "not yet wired to the runtime."

kf is the END consumer: `frame-compiler.ts` calls value.js's `parseCSSValue`/`parseAndFlattenObject` to compile every `@keyframes` block; the editing-session reality (a 50-200-stop keyframe re-parsed on every edit) is kf's hottest parse workload. When value.js's parser becomes a generated specialized scanner, kf's `addFrame → parse → AnimationFrame[]` pipeline (`frame-compiler.ts:426-487`) inherits the throughput WITHOUT a single kf source change — the re-pin IS the consume.

**The falsification guard (the non-negotiable born-RED on every codegen idea).** A.W3 falsified the SpanParser tagged-union as a *runtime* recursive switch (~10-14% slower on V8 — V8 monomorphic-inlines per-site closures better than a hand-rolled dispatch loop). **That falsification must NOT be re-litigated.** Codegen sidesteps it entirely: the emitter produces STRAIGHT-LINE source (every call site monomorphic by construction), never a runtime interpreter dressed as a generated function (CONSTITUTION §4). The kf-side gate enforces this from the CONSUMER vantage: the generated `parseCSSValue` must be **parity-equal** to the hand-rolled one AND **PARITY-OR-BETTER throughput** (no regression vs the hand-written parser — re-founded on the value.js PORTABLE JSON.parse-ratio anchor, not an unsourced absolute figure) — if the re-pinned parser is SLOWER, the spine's value.js leg has emitted a runtime interpreter (the falsified shape) and the gate REDs the consume. The codegen value is GRAMMAR-AS-SOURCE-OF-TRUTH (the `.bbnf` spec IS the parser; ~700 hand-combinator lines dissolve) + eliminating combinator-closure overhead, GATED AT PARITY-OR-BETTER — a maintainability + spec-as-source win, never an asserted speedup multiplier.

### The interp-plan codegen, grounded (Plane B — X2 `[radical·codegen]`)

`frame-compiler.ts` builds `interpVars`/`allInterpVars` (`frame-compiler.ts:497-508` `finalizeFrameVars` — `frame.allInterpVars = Object.values(frame.interpVars).flat()`) and the engine walks them GENERICALLY: `engine.ts:754-756` `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`. For a FIXED keyframe shape (the dominant 2-stop `translate3d`+`scale`+`opacity` case), the per-frame interp is the SAME arithmetic over the SAME leaf layout, every frame, for the life of a long-running animation — yet it pays the generic `lerpValue` closure-dispatch per channel per frame (`AUDIT-DIGEST.md` K1 :413 — "mutates boxed `iv.value` per channel via closure dispatch").

The X2 idea (`AUDIT-DIGEST.md` X2 :1034-1037): emit, per keyframe-shape, a specialized straight-line interp function the way bbnf emits specialized parsers per grammar — collapsing the per-frame interp to branch-free straight-line arithmetic, "the steady-state rAF loop becomes branch-[free]." This is the interp-arithmetic analog of the parser spine: same play (emit specialized straight-line code for a fixed shape), same falsification guard (the codegen must beat the generic walk by ≥20%, never a `new Function` interpreter that's slower than the closure dispatch it replaced).

**The guard the idea NAMES (`AUDIT-DIGEST.md` X2 :1036 — the feasibility caveat the gate must encode):**
1. **`new Function`/codegen warm-up cost.** The compile of the specialized interp function is a one-time cost amortized only over a LONG-running animation. A one-shot animation (play once, dispose) would pay the warm-up and never recoup it — the **one-shot anti-pattern**. The gate must measure a 1000-frame (long-running) run, AND the codegen must be GATED at compile-time behind a "this animation will run long enough" heuristic (iteration-count ≥ N OR infinite), never applied unconditionally.
2. **CSP cost.** `new Function` is forbidden under a strict `script-src` CSP (no `'unsafe-eval'`). The codegen path MUST feature-detect CSP-eval availability and FALL BACK to the generic `lerpValue` walk where eval is denied (the SAME feature-detect-fallback discipline as P.W3's Typed-OM path — a kf pattern, not a new one). A CSP-locked realm keeps the generic path bit-for-bit.
3. **The shape-cache key.** The codegen is keyed by the keyframe SHAPE (the leaf layout — property keys + units), not the values — so a re-target/re-value of the same shape REUSES the compiled function. The cache is a bounded LRU (the `tryParseLeaves` bounded-LRU precedent, `AUDIT-DIGEST.md` K1 rec — "scope OUT … the bounded-LRU is correctly bounded"), never an unbounded `new Function` accumulator.

### Why both planes ride ONE wave

Plane A (the inherited parser) is the GATED trigger — it CANNOT land before the siblings publish. Plane B (the interp-plan codegen) is kf-internal but it RIDES Plane A's apparatus: the parity+throughput-bench discipline, the falsification guard, the feature-detect-fallback pattern, and the decision-JSON terminal home are the SAME machinery. Authoring them in one wave keeps the codegen discipline in one place (gestalt — ONE codegen apparatus, two consume planes) and lets Plane B's interp gate reuse Plane A's portable throughput-ratio harness.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-20) |
|-----|-----------------|------------------------------|
| spine exists | `/Users/mkbabb/Programming/bbnf-lang` | EXISTS — a TS-emitter codegen tool (`CompileTarget::Ts`, `css/l4/*.bbnf` grammars, parity tests). The spine is WIRING, not greenfield (CONSTITUTION §1) |
| spine dormant | `AUDIT-DIGEST.md` X2 :1005-1007 | value.js ships hand-written combinators; its own `.bbnf` is "not yet wired to the runtime" — THE triumvirate-scale lever |
| kf consume edge | `src/animation/frame-compiler.ts:426-487` | `addFrame → parse → AnimationFrame[]` over value.js's parser — the pipeline that inherits the generated throughput for free |
| generic interp walk | `src/animation/engine.ts:754-756` | `for (const iv of frame.allInterpVars) lerpValue(eased, iv)` — the per-channel closure-dispatch the interp-plan codegen specializes |
| interp-var build | `src/animation/frame-compiler.ts:497-508` | `finalizeFrameVars` builds `frame.allInterpVars = Object.values(frame.interpVars).flat()` — the fixed-shape leaf layout the codegen keys on |
| falsification record | CONSTITUTION §4 / `AUDIT-DIGEST.md` V1-N2 :23 | A.W3 falsified the SpanParser RUNTIME switch (~10-14% slower on V8) — codegen must emit STRAIGHT-LINE, never a runtime interpreter; gated to PARITY-OR-BETTER vs hand-rolled (no regression, anchored on the value.js PORTABLE JSON.parse-ratio) |
| spine idea (parser) | `AUDIT-DIGEST.md` X2 :1014-1017 | `[radical·codegen]` "Close the codegen spine … generate value.js's CSS-value parser from `css/l4/*.bbnf`" + `proof:codegen-parity` born-RED |
| spine idea (interp) | `AUDIT-DIGEST.md` X2 :1034-1037 | `[radical·codegen]` "Emit the kf frame-compiler's interp plan as generated specialized code per keyframe-shape" + the `new Function` warm-up/CSP/one-shot guards + the ≥20% born-RED bench |
| densify-COMPILE leg | `AUDIT-DIGEST.md` K1 :434-437 | `[incremental·perf]` the densify COMPILE leg gated on the value.js-P color-math re-pin — the P-inv-28 loop-close on the cross-repo frontier |
| inv-16 ordering | CONSTITUTION §3 / `P.md:190-196` | parse-that B → value.js P → kf-P; kf consumes, never authors the emitter; the gate is born-RED guarded against A.W3 |

---

## Scope

**S0 (the CSS-EMIT DE-RISK SPIKE — the FIRST gated step of the spine, born-RED preconditions BEFORE any CSS-generation commitment)** gates the entire Plane A consume on three preconditions proven on a spike, never asserted: (a) the parse-that emitter actually HANDLES value.js's superType-tagged combinator shapes (the CSS-value grammar is not a flat JSON grammar — it carries superType tags the emitter must emit straight-line code for); (b) a BYTE-IDENTICAL parity corpus — the generated parser's output is byte-identical to the hand-written value.js parser over the full kf `@keyframes` corpus (a single divergence FAILS the spike); (c) a PORTABLE throughput PARITY-OR-BETTER (no regression vs the hand-written parser, on the value.js PORTABLE JSON.parse-ratio anchor). The spike is born-RED (it cannot pass until parse-that B + value.js P emit a CSS-capable parser); a FAIL on any of (a)/(b)/(c) KILLS the Plane A commit BEFORE the re-pin — the spine does NOT proceed on an asserted CSS-emit capability. **S1 (Plane A)** — gated on S0 GREEN — re-pins the published parse-that B + value.js P and consumes the generated CSS-value parser through the UNCHANGED `CSSKeyframesAnimation` facade (the consume is a re-pin — no kf source change beyond the dependency bump). **S2 (Plane A gate)** authors `proof:codegen-parity-throughput` born-RED — the consumer-vantage parity + throughput-ratio gate guarded against the A.W3 falsification. **S3 (Plane B)** authors the kf-internal per-keyframe-shape interp-plan codegen behind a long-running heuristic + a CSP feature-detect fallback. **S4 (Plane B gate)** authors `proof:interp-codegen` born-RED — the ≥20% long-running interp-throughput ratio with the one-shot/CSP guards. **S5** records both verdicts in a decision JSON beside `spring-vector-decision.json` (ADOPT or KILL-with-falsification-record).

### S0 — the CSS-emit de-risk spike (the FIRST gated step, born-RED preconditions)

**Breach.** The spine is asserted to emit a CSS-value parser, but the parse-that emitter's CSS capability is UNPROVEN at the kf consumer vantage: the verified bbnf-lang `CompileTarget::Ts`/`TsEmitter` emits straight-line `charCodeAt` source for JSON-shaped grammars, but value.js's CSS-value grammar carries **superType-tagged combinator shapes** (the `Length`/`Angle`/`Color`/`FunctionArgs` value-domain tags) the emitter must handle without falling back to a runtime interpreter (the A.W3 falsified shape). Committing the Plane A re-pin before this is proven would risk shipping a generated parser that is byte-divergent OR slower — a correctness-or-perf regression discovered only after the consume.

**Cure (gate-first, born-RED — the spike precedes any CSS-generation commitment).** Author the de-risk spike as the FIRST gated step:

1. **superType-tagged shape coverage.** The spike feeds value.js's CSS-value `.bbnf` (the superType-tagged combinator grammar) through the parse-that emitter and asserts the emitted source is STRAIGHT-LINE (every call site monomorphic — `grep` the emitted output for a runtime dispatch loop / tagged-union switch → ZERO; the A.W3 shape is forbidden by construction).
2. **byte-identical parity corpus.** Over the FULL kf `@keyframes` corpus (the editing-session corpus + the round-trip corpus), the generated parser's serialized output is BYTE-IDENTICAL to the hand-written value.js parser's. A single divergence FAILS the spike (the consume is KILLED at S0, the spine does not proceed).
3. **portable throughput parity-or-better.** On the value.js PORTABLE JSON.parse-ratio anchor, the generated parser's throughput is PARITY-OR-BETTER vs the hand-written parser (no regression). A slower spike PROVES the emitter re-introduced a runtime interpreter → FAIL → KILL.

**Constraint (the spine does not proceed on assertion).** S0 is the precondition gate for S1: the Plane A re-pin is FORBIDDEN until S0's three preconditions are GREEN. A FAIL on any precondition records a KILL in `codegen-decision.json` (the P-inv-28 terminal) and the spine's kf leg is NOT shipped — kf stays on the hand-rolled parser. This is the MEASURE-FIRST discipline applied to the CSS-emit capability itself: no CSS-generation commitment before the spike proves (a) the emitter handles the superType shapes, (b) the output is byte-identical, (c) the throughput does not regress.

**Gate bite.** S0 is born-RED today (parse-that B + value.js P have not emitted a CSS-capable parser — the spike cannot run). The bite: a Plane A re-pin (S1) attempted with S0 RED → the spine commits on an unproven CSS-emit capability → the byte-identical parity corpus reds the instant the generated parser diverges, OR the portable throughput arm reds the instant it regresses. S0 forces the falsification BEFORE the commit, not after.

---

## Born-RED gate

### Plane A — `proof:codegen-parity-throughput` (NEW — `scripts/proof-codegen-parity-throughput.mjs`)

A consumer-vantage parity + portable throughput-ratio gate over the re-pinned generated parser. RED today because the siblings have not published the codegen edge.

| Clause | Witness on today's tree (pre-publish) | The REAL observable | GREEN condition |
|---|---|---|---|
| `generated-parser-pinned` | `node -e "require('@mkbabb/value.js/package.json').version"` < value.js P; `grep codegen node_modules/@mkbabb/parse-that/package.json` → no `./codegen` subpath | parse-that B / value.js P are not published — the generated parser is not on the installed tree | parse-that B (`@mkbabb/parse-that/codegen`) + value.js P (generated parser) re-pinned; the value.js parser is the GENERATED one |
| `compile-parity` (correctness — the non-negotiable) | `frame-compiler.ts` compiles over the hand-rolled parser; no generated parser to diff against | the generated `parseCSSValue` output must be STRUCTURALLY identical to the hand-rolled one over the FULL kf `@keyframes` corpus (the editing-session corpus + the round-trip corpus) — a single structural mismatch REDs | over the full corpus, generated-parse `deepEquals` hand-rolled-parse for every fragment (the `proof:codegen-parity` mirror at the kf consumer) |
| `throughput-ratio` (**KEYSTONE** — the falsification guard) | `bench/compile.bench.ts` over the hand-rolled parser is the baseline; no generated arm exists | the generated parser must NOT regress — a re-pin that is SLOWER proves value.js emitted a runtime interpreter (the A.W3 falsified shape) | `generated-compile-hz / hand-rolled-compile-hz ≥ 1.0` (PARITY-OR-BETTER — no regression vs the hand-written parser) over the editing-session re-parse corpus, measured PORTABLE (same-report ratio, P.W1 discipline; re-founded on the value.js PORTABLE JSON.parse-ratio anchor) |

### Plane B — `proof:interp-codegen` (NEW — `scripts/proof-interp-codegen.mjs`)

The kf-internal interp-plan codegen ratio gate with the one-shot/CSP/warm-up guards.

| Clause | Witness on today's tree | The REAL observable | GREEN condition |
|---|---|---|---|
| `codegen-shape-keyed` (source-shape) | `grep -n "new Function\|interpCodegen\|shapePlan" src/animation/` → ZERO | the interp is the generic `lerpValue`-per-iv walk (`engine.ts:754-756`); no per-shape specialization exists | a bounded-LRU shape-keyed codegen emits a straight-line interp fn per keyframe-shape, behind a long-running heuristic |
| `csp-fallback` (feature-detect safety) | a realm with `new Function` denied (strict CSP) | NO fallback exists — a naive `new Function` codegen THROWS under a strict `script-src` CSP | with eval denied, the interp produces bit-for-bit the SAME values as the generic `lerpValue` walk (the codegen falls back, never throws) |
| `one-shot-guard` (the anti-pattern guard) | a 1-iteration animation | NO heuristic gates the codegen — applied unconditionally, a one-shot animation pays the `new Function` warm-up and never recoups it | a 1-iteration animation does NOT trigger codegen (the warm-up is gated on iteration-count ≥ N OR infinite); the generic walk runs |
| `interp-throughput-ratio` (**KEYSTONE** — observable-truth) | `bench/interp-buffer.bench.ts` generic walk is the baseline; no codegen arm | for a 1000-frame run of the dominant 2-stop shape, the codegen'd interp must be ≥20% faster than the generic walk — a codegen that is SLOWER (a `new Function` interpreter heavier than the closure dispatch) REDs | `codegen-interp-hz / generic-interp-hz ≥ 1.20` over a 1000-frame long-running run, measured PORTABLE — AND the warm-up cost is AMORTIZED in the measured window (the gate measures steady-state, not first-compile) |

### How both gates are born-RED via a planted failure

- Plane A is born-RED because the siblings have not published — `generated-parser-pinned` reds on the version probe, and `throughput-ratio` cannot compare a generated arm that does not exist.
- Plane B is born-RED because `grep "new Function\|interpCodegen" src/animation/` → ZERO (the codegen is absent), so `codegen-shape-keyed` reds and `interp-throughput-ratio` has no codegen arm to measure.
- **The DUAL born-RED (the falsification guard).** The keystone clauses are the proxy-trap guard: even if a future stub adds an `interpCodegen` symbol that greens `codegen-shape-keyed` (the name-only source-shape proxy), `interp-throughput-ratio` STILL reds unless the emitted function is GENUINELY straight-line AND ≥20% faster — a stub that emits a `new Function` wrapper around the SAME generic `lerpValue` loop (a runtime interpreter dressed as codegen — the A.W3 falsified shape) measures NO speedup and reds. Likewise Plane A's `throughput-ratio` reds on a generated parser that is a runtime tagged-union switch (slower than hand-rolled). The gates bite the GENUINE observable (the code is faster because it is straight-line monomorphic), never the presence of a codegen symbol.

**Portable PERF gates (not absolute floors).** Both `throughput-ratio` clauses are same-report ratios (generated/hand-rolled and codegen/generic in the SAME bench report) per the P.W1 ratio discipline — robust across the macOS developer machine and the slow Linux runner. No absolute `floorHz`. CI posture: HARD via `declarePosture(hard)` once the apparatus is wired; observe-only where the generated parser is not yet pinned (the GATED-wave posture).

---

## Dependencies

- **GATED on parse-that B publish** (`@mkbabb/parse-that/codegen` — the BBNF→specialized-monomorphic-TS emitter over the retained SpanParser / bbnf-lang `TsEmitter`). Plane A CANNOT land before this. Dispatched in `KF-TO-PARSETHAT-B.md` (CONSTITUTION §2 — the dispatch packet).
- **GATED on value.js P publish** (value.js generates its CSS-value parser from `css/l4/*.bbnf` via parse-that's emitter — value.js 1.2.0 perf leg). Plane A's consume IS the re-pin of this generated parser. Dispatched in `KF-TO-VALUEJS-P.md` (CONSTITUTION §2).
- **inv-16 — kf consumes, never authors the emitter.** The emitter lives in parse-that; value.js owns the generation; kf inherits parity-or-better frame-compilation + spec-as-source maintainability for free (a re-pin + a parity+throughput gate). P.W4 writes NO emitter and NO grammar — it consumes the generated surface. (The kf-internal interp-plan codegen, Plane B, IS kf-authored — but it is a kf-internal codegen over kf's OWN `frame-compiler` interp plan, not a foreign-tree edit.)
- **Rides ATOP P.W1's portable-perf-gate apparatus.** Both `throughput-ratio` keystones are device-independent same-report ratios — they CANNOT be authored before P.W1 ratifies the ratio discipline + the bench harness. P.W1 → P.W4 is a HARD in-tranche ordering.
- **Rides ATOP P.W2/P.W3 (the NOW transpositions).** P.W4 is the LAST Band-B wave; it consumes the generated parser AFTER the SoA-compositor (P.W2) and Typed-OM write-path (P.W3) land. Plane B's interp codegen composes WITH P.W2's SoA fold (the codegen'd straight-line interp can write into P.W2's `Float64Array` SoA buffer — the two codegen the SAME hot loop from different angles), but neither blocks the other.
- **Plane B (interp codegen) is kf-internal — NOW-able in isolation, but BUNDLED here for codegen-apparatus gestalt.** It has no sibling dependency; it is authored in this wave so the parity+throughput discipline, the falsification guard, the feature-detect fallback, and the decision-JSON terminal home live in ONE codegen apparatus. If parse-that B / value.js P slip, Plane B can land standalone (its gate is kf-internal) while Plane A defers — but the wave's IDENTITY is the spine consume, so Plane B's standalone landing is recorded as a partial.
- **Decision-JSON terminal home (P-inv-28).** S5 records both verdicts in `scripts/codegen-decision.json` beside `spring-vector-decision.json`. If `throughput-ratio` (Plane A) fails to clear PARITY (a regression vs the hand-written parser, on the value.js PORTABLE JSON.parse-ratio anchor) on real hardware, the verdict is **KILL the consume** — kf stays on the hand-rolled parser, the falsification is recorded (value.js emitted a runtime interpreter, the A.W3 shape), and the spine's kf leg is NOT shipped. If `interp-throughput-ratio` (Plane B) fails to clear ≥1.20x, the interp codegen is KILLED — the generic `lerpValue` walk stays, the `new Function` warm-up/CSP cost is recorded as not-worth-it (the one-shot anti-pattern confirmed at scale). Neither plane carries forward as a bare deferral — each gets an ADOPT-or-KILL terminal.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W4 — **DOCS ONLY**. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the parser emitter is parse-that's, the parser generation is value.js's, both DISPATCHED — `KF-TO-PARSETHAT-B.md` / `KF-TO-VALUEJS-P.md`). The IMPLEMENTATION (the re-pin consume, the `proof:codegen-parity-throughput` gate, the kf-internal interp-plan codegen, the `proof:interp-codegen` gate, the decision JSON) opens only on the owner's explicit authorization, AND only after the two sibling publishes land (the GATED phase). When it opens it is:

- **gate-first** — both `proof:codegen-parity-throughput` and `proof:interp-codegen` authored born-RED BEFORE the consume / the codegen lands.
- **observable-truth** — the `throughput-ratio` and `interp-throughput-ratio` keystones over REAL bench reports, never a source-shape "the codegen symbol exists" proxy; the DUAL born-RED forbids a `new Function` interpreter dressed as codegen (the A.W3 falsified shape) from false-greening.
- **falsification-guarded (the spine's non-negotiable)** — every codegen clause is gated against the A.W3 record: the generated parser must be STRAIGHT-LINE + PARITY-OR-BETTER vs hand-rolled (Plane A — no regression, anchored on the value.js PORTABLE JSON.parse-ratio); the interp codegen must be straight-line + ≥1.20x generic (Plane B — a kf-internal SoA/codegen win measured against the generic walk, a distinct gate). A SLOWER generated artifact PROVES the runtime tagged-union shape was re-introduced and REDs the consume. The falsification is never re-litigated — it is the gate's foundation.
- **no-legacy** — the hand-rolled parser path (Plane A) and the generic `lerpValue` walk (Plane B) are RETAINED as the explicit feature-detect/CSP FALLBACK (the generic walk is the documented path for CSP-locked realms + short-running animations, gated bit-for-bit), not parallel impls left to rot.
- **KISS** — Plane A is a re-pin (kf authors NO emitter); Plane B is a bounded-LRU shape-keyed codegen behind a long-running heuristic + a CSP feature-detect, not an unconditional codegen of every animation.
- **gestalt** — ONE codegen apparatus (the parity+throughput discipline, the falsification guard, the feature-detect fallback, the decision JSON) serves both consume planes; the spine's kf leg is the terminal home of the SpanParser-retention P-inv-28 (CONSTITUTION §4 — "BUILD the consumer or the retention rationale is KILLED"; this wave's `throughput-ratio` IS the build-or-kill verdict at the kf vantage).
- **P-invariant-28** — both verdicts (ADOPT or KILL) recorded in `codegen-decision.json` (a terminal home, not a perpetual deferral); a KILL ships the fallback alone and records the falsification, never carries the codegen forward as a bare deferral. The densify-COMPILE leg (K1 :434-437) closes its P-inv-28 loop on the value.js-P color-math re-pin in the SAME consume.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| Plane A `generated-parser-pinned` | kf claims the codegen consume while still pinned to the hand-rolled value.js parser — the spine's value.js leg is unconsumed, the "free throughput" is fictional |
| Plane A `compile-parity` | The generated parser silently DIVERGES from the hand-rolled one (a missing unit, a dropped `color()` wrapper) — kf compiles wrong frames over a faster-but-incorrect parser (correctness traded for speed, the cardinal sin) |
| Plane A `throughput-ratio` (KEYSTONE) | value.js emits a RUNTIME tagged-union switch (the A.W3 falsified shape) dressed as a generated parser — the re-pin is SLOWER than hand-rolled and the spine's whole premise is falsified, yet a name-only "generated parser pinned" proxy greens |
| Plane B `codegen-shape-keyed` | The interp stays the generic `lerpValue`-per-iv closure-dispatch walk — the hot long-running rAF loop never specializes, the X2 interp-plan payload is undelivered |
| Plane B `csp-fallback` | The interp codegen THROWS under a strict `script-src` CSP (no `'unsafe-eval'`) — a CSP-locked consumer's animations hard-fail where the generic walk would have run fine |
| Plane B `one-shot-guard` | The codegen is applied UNCONDITIONALLY — a one-shot animation pays the `new Function` warm-up and never recoups it (the named anti-pattern), NET-SLOWER than the generic walk it replaced |
| Plane B `interp-throughput-ratio` (KEYSTONE) | A STUB `interpCodegen` that emits a `new Function` wrapper around the SAME generic loop (a runtime interpreter dressed as codegen) passes a name-only proxy while delivering ZERO speedup — the runtime ratio that should bite the real observable (straight-line ≥20% faster) is silently green |

---

## Excluded from this wave

- **Authoring the BBNF emitter.** The emitter is parse-that B's (`@mkbabb/parse-that/codegen`), dispatched in `KF-TO-PARSETHAT-B.md`. inv-16: kf does not write it.
- **Generating value.js's CSS-value parser.** The generation is value.js P's (from `css/l4/*.bbnf`), dispatched in `KF-TO-VALUEJS-P.md`. kf consumes the generated parser; it does not generate it.
- **The WASM-SIMD structural pre-scan.** The `AUDIT-DIGEST.md` X2 :1026-1029 `[aggressive·perf]` full-stylesheet wasm-prescan is a SEPARATE (and explicitly guilty-until-benched, MED-feasibility) value.js-side frontier — NOT the kf consume. Carried in the dispatch packet's "future" section, not folded here.
- **The SoA interp-arithmetic fold (P.W2) and the Typed-OM write-path (P.W3).** Those are the NOW Band-B transpositions; P.W4 is the GATED codegen consume. Plane B's interp codegen COMPOSES with P.W2's SoA buffer but is a SEPARATE gate.
- **The `: any` cross-realm seam narrowing.** The `parseAny as any` cast at `utils.ts:236` (S9) retires on value.js P's `parseCSSSubValue` (VJ-L3) — Band E (P.W10) owns the `proof:no-cross-realm-cast` structural gate, NOT this codegen wave. (Though the generated parser consume may incidentally clear the direct `@mkbabb/parse-that` production import — that disposition is recorded in P.W10, not here.)
