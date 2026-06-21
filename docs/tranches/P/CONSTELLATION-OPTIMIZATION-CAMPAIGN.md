# The Constellation Optimization Campaign — the triumvirate challenge

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-20 from a 32-agent triumvirate
> re-audit (`P/audit/AUDIT-DIGEST.md`, ~3.8M tokens; 297 findings · **172 novel ideas**,
> 29 radical). This is the **constitution** the three sibling sessions cite — it locks the
> topology, the DAG, the codegen spine, and the version split. **No engine/demo/library
> source is written here.** Implementation opens only on the owner's explicit authorization.
> inv-16 holds: keyframes writes only keyframes.js; every cross-repo need is a *dispatch*.

## 1 — The mandate

The owner's standing precepts (verbatim, immutable since J.md:111-119), **intensified** this
pass into an active *challenge*: **NO quick solutions, NO workarounds; idiomatic + gestalt;
architectural transpositions for elegance/simplicity/PERFORMANCE above all are necessary +
desirable; NO legacy code; KISS; observable-truth; born-RED; P-invariant-28.** The new intake:
**aggressively optimize the triumvirate** (value.js · parse-that · keyframes), **brainstorm
novel architectural approaches that challenge each library**, and **improve the demos'
usability/clarity/correctness via a frontend-design fleet.** Falsify-first, not passive.

The audit corrected three stale premises up front (record-as-built honesty): both siblings
**already have bench infrastructure** (value.js `bench/` + a portable JSON.parse-ratio gate;
parse-that `typescript/test/benchmarks/`) — the perf frontier has a measurement substrate;
**`bbnf-lang` exists** locally (a real codegen tool with a `CompileTarget::Ts` emitter +
`css/l4/*.bbnf` grammars + parity tests) — the codegen spine is *wiring*, not greenfield; and
**glass-ui 4.1.0 published but `SegmentedTabs.vue:406` still emits `aria-orientation`
unconditionally** — the kf S1 deletion is NOT yet safe (the O aria-guard dispatch stands).

## 2 — The topology (the F5 decision)

**ONE keyframes-hosted optimization tranche (keyframes Tranche P) + TWO dispatch packets** —
NOT three independently-authored per-repo tranches. This is the proven inv-16 fence pattern
(a single session drives all; the siblings schedule the dispatched asks into their own trees,
as they did for the O VJ-L1/L3 ask + the BC aria correction). Per-repo authored tranches would
break the single-session discipline and risk a coordination cycle. value.js (16 dirty) +
parse-that (5 dirty) have active trees — another reason kf does not write them.

```
keyframes.js/docs/tranches/P/
├── CONSTELLATION-OPTIMIZATION-CAMPAIGN.md   ← this constitution (the shared constitution)
├── P.md · PROGRESS.md                        ← the kf-P optimization+demo-design tranche
├── audit/{AUDIT-DIGEST, deferred-ledger-P, prompt-recap-P}.md
├── waves/P.W*.md                             ← kf-P waves (engine-perf · demo-fleet · correctness · no-legacy · consume)
├── KF-TO-VALUEJS-P.md                        ← dispatch packet → value.js Tranche P
└── KF-TO-PARSETHAT-B.md                       ← dispatch packet → parse-that Tranche B
```

## 3 — The DAG (unchanged from the campaign) + the version split

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0 codegen)         (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
        │                         │                            │
        └── the CODEGEN SPINE ────┴──── generated parser ──────┘
```

- **parse-that B → 0.12.0** — the BBNF-codegen subpath (`@mkbabb/parse-that/codegen`) over the
  retained SpanParser / bbnf-lang TsEmitter + the perf frontier + the **packrat cross-input bug fix**.
- **value.js P → 1.1.0** (API: VJ-L1 `flatLeaf` provenance + VJ-L3 `parseCSSSubValue`) **then
  1.2.0** (perf: VJ-P1 `color2Into` gamut zero-alloc tail, VJ-P2 the typed Float64 channel view, the
  codegen-consume, the `: any` seam narrowing) — and **VJ-P.W0 = commit the uncommitted O docs +
  reconcile the stale "DEVELOPMENT — charter only" PROGRESS to CLOSED-as-built** (record-as-built
  honesty, the FIRST P action). *There is NO kf P.W0 — the kf roster starts at P.W1; `VJ-P.W0` is
  value.js Tranche P's first (DISPATCH) wave, namespaced to avoid colliding with the kf P-wave space.*
- **keyframes P → 5.1.x** (perf is non-breaking; rides after O's 5.0.0 cut) — the SoA compositor,
  the Typed-OM write path, the codegen-consume, the demo-frontend-design fleet, the correctness cures.

The hardest coupling: kf's `engine.ts` god-object split (O.W7, 1397→~900) is **VJ-L1-gated** — it
sequences AFTER value.js P ships `flatLeaf` (which dissolves kf's S8 `FN_NAME` sidechannel). The
**VJ-L1 WeakMap fallback** (X4 radical idea) is the kf-internal early-cure that unblocks O.W7 NOW
if value.js P slips — the **P-inv-28 chronicity-4 belt exit** for S8/S9 (born E / born C respectively;
S8/S9 are at chronicity 4 — K,L,M,O→P — the belt fires THIS tranche). The S8/S9 chronicity is
canonical: **DM-2 (born E) / DM-3 (born C) · 7 carries through M · O CHARTERS the forbidden-8th-carry
close (O.W5/O.W6) · P INHERITS + IMPLEMENTS the build-in (chartered, never built; P.W5/P.W7 are the
impl)** — never a "chronicity 9 / 8-tranche / 9th carry" framing.

## 4 — THE CODEGEN SPINE (the campaign's missing perf payload)

Four independent audit lanes (V1-N2 · P1 · P4 · X2) converged on the same radical play, and it is
the **surviving form of the falsified §7 thesis**. A.W3 falsified the SpanParser tagged-union as a
*runtime* recursive switch (~10-14% slower on V8 — V8 monomorphic-inlines per-site closures better
than a hand-rolled dispatch loop). That falsification is precise and must NOT be re-litigated. But
**codegen sidesteps it entirely**: emit, at BUILD TIME, ONE specialized straight-line `charCodeAt`
scanner per grammar — no closures, no `callSpan` recursion, every call site monomorphic by
construction. The retained SpanParser (`span.ts:549`, kept "expressly as the codegen foundation")
+ `bbnf-lang`'s proven `TsEmitter` are the substrate.

**The play (parse-that B → value.js P → kf):** parse-that ships `@mkbabb/parse-that/codegen`
(the SpanParser-tree-walk / bbnf-lang TS emitter); value.js generates its CSS-value parser from
`css/l4/*.bbnf`, replacing ~700 lines of hand-maintained combinators (**the spec becomes the parser** —
the `.bbnf` "not yet wired to runtime" limbo is resolved); keyframes inherits a parity-or-better,
spec-as-source-of-truth frame-compilation pipeline. This re-wires the DEAD O.W6 SpanParser-jump-table
consume edge into a LIVE codegen edge.

**The CSS-EMIT DE-RISK SPIKE (the FIRST gated step of the spine — born-RED preconditions before any
CSS-generation commitment).** bbnf-lang has a genuine `CompileTarget::Ts` / `TsEmitter` emitting
STRAIGHT-LINE `charCodeAt` source (verified) — but the spine MUST NOT commit to CSS generation until a
spike discharges three born-RED preconditions: (1) the emitter handles value.js's superType-tagged
combinator shapes; (2) a BYTE-IDENTICAL parity corpus vs the hand-written parser; (3) a PORTABLE
throughput **parity-or-better** vs the hand-written parser. Only after this spike greens does value.js
P commit to generating its CSS-value parser.

**The two implementation paths (annotated in `KF-TO-PARSETHAT-B.md`):** **option A** = bbnf-lang
directly (needs a wasm-binding + a publish — cross-realm); **option B** = a pure-TS SpanParser
tree-walk (IN-REALM, zero bbnf-lang publish dep — the **PREFERRED in-realm path**).

**P-invariant-28 on the SpanParser retention:** it has been a parked asset with no consumer for
multiple tranches — the codegen spine is its terminal home (BUILD the consumer) **or** the retention
rationale is KILLED. This campaign chooses BUILD. **The falsification guard (born-RED on every codegen
idea):** the emitter must produce STRAIGHT-LINE source, never a runtime interpreter dressed as a
generated function — gated against the A.W3 falsification record + a parity+throughput bench. **The
perf claim is GRAMMAR-AS-SOURCE-OF-TRUTH** (the `.bbnf` spec IS the parser; ~700 hand-combinator lines
dissolved) **+ eliminating combinator-closure overhead**, GATED AT PARITY-OR-BETTER throughput
(re-founded on the value.js PORTABLE JSON.parse-ratio anchor — no regression vs the hand-written
parser). The win is **spec-as-source maintainability + parity-or-better throughput**, NOT an unsourced
speedup multiple.

## 5 — The headline novel ideas, by library (grounded; full set in the digest)

**value.js (1.1.0 API · 1.2.0 perf):**
- **VJ-P1** `color2Into` out-param — collapse the gamut bisection from ~84 → <12 allocs/call (the
  deferred O.W3/O.W5 tail; the `matrix.transformMat3Into` scratch pattern proven one layer down).
  [aggressive]
- `flatLeaf`-FIRST: the **COMMITTED path is the CONSERVATIVE gated form** — value.js adds an ADDITIVE
  `fnName` field (VJ-L1); `FunctionValue` STAYS the serialize source-of-truth (the kf S8 sidechannel
  retires on the additive provenance, not on a model reshape). The **RADICAL "make the flat leaf
  canonical" reshape is DEMOTED to a SPIKE-GATED investigation** (precondition: a `FunctionValue.toString`
  round-trip corpus). [committed: precept-conservative · radical: spike-gated]
- **VJ-P2** typed Float64 channel view for the interp/conversion loops (kill the string-keyed
  megamorphic `[key:string]:any` reads without removing the public dynamic shape). [aggressive]
- narrow the `: any` property/subProperty seam → `string` (strict-mode invariant). [precept]

**parse-that (0.12.0):**
- the **BBNF→specialized-monomorphic-TS codegen** (§4 — the spine). [radical/codegen]
- **packrat cross-input pollution FIX** — `memoize()` returns a stale result across different inputs
  (the MEMO key has no `src` component); a real correctness bug. The WeakRef-epoch / auto-reset cure. [BLOCKER]
- generate the 16 Span combinators from the value combinators (one source of backtracking-control
  truth; ~400 lines of copy-paste plumbing dissolved). [radical]
- combinator fusion + a 2-char (16-bit) dispatch widening for the residual 3-4-deep `any()` buckets. [aggressive]

**keyframes (5.1.x):**
- **SoA composite buffer for AnimationGroup** — a single contiguous `Float64Array` accumulator
  indexed by a stable `(key→offset)` layout; the blend becomes a **branch-free/dispatch-free typed
  fold** (the multi-animation hot path; the win is dispatch-elimination + zero-alloc, NO SIMD claim).
  Gated by `proof:blend` (test/blend.test.ts) + test/group.test.ts/test/iw0-cube-composite.test.ts —
  NOT proof:replay-equality. [radical]
- the **`Playhead` value-object** — transpose the god-object at the TRUE seam (the driver protocol:
  Sequence/Group/ingest poke 4 raw fields today) so `KeyframesAnimation` becomes a thin compile-facade.
  The `Playhead` is INTERNAL; the public `startTime`/`pausedTime` field-write seam +
  `advanceTo`/`interpFrames`/`seek`/`effectiveT` KEEP their published signatures via DELEGATING
  ACCESSORS — BC-additive (the 5.1.x cut, no public engine-class member removed/retyped). [radical]
- the **Typed-OM (Houdini `StylePropertyMap`) write path** — batched DOM style mutation, eliminating
  the per-frame string-serialize + browser CSS re-parse. **LIMITED AVAILABILITY** (Chrome/Edge 66+,
  Safari 16.4+, NO Firefox for the aggregate API) — PROGRESSIVE-ENHANCEMENT with a string-setProperty
  fallback, feature-detect-gated. [aggressive]
- the **leaves.ts→value.js/math TRAP** (precept correction to O.W9): a plain "import the canonical
  ./math" would **RED `proof:boundary`** (the subpath specifier is banned in LIGHT source) — the
  no-legacy cut is a **bundle-externalization transposition**, not a delete. [precept BLOCKER]

**the demos (the frontend-design fleet — 29 ideas):** the easing curve-editor as the DemoControlPoint
showcase; the spring **parameter-space heatmap** (response×damping click-to-navigate); amiga
**flick-to-boing** (earn the easter-egg by gesture); unify the demo drag handles on `drag2D`; the
N-Stage switcher (the **mobile is entirely unbuilt** — THE shelf-driver); View-Transitions for the
scene-switch; per-scene tasteful refinement + an on-aesthetic easter-egg; a parse-that playground
`dispatch()` LUT heatmap (turn the perf differentiator into a teaching tool).

## 6 — Carried-forward chronics + the prompt recap

This campaign **does not orphan** the O work — it sequences atop it. The O chronic terminals
(DM-2 DemoControlPoint / DM-3 fromMorphSVG — the forbidden-8th-carry BUILD-INs) + the DM-22
NaN-frame cure + the BC-gated consumes (now partly live on glass-ui 4.1.0 — S2/dock deletable,
**S1/aria still gated** on the pending guard) are P's inherited foundation, tracked in
`deferred-ledger-P.md`. The **new optimization+triumvirate+frontend-design ask** is captured as a
top-level session intake in `prompt-recap-P.md` (the audit found it was the one uncaptured prompt).
The standing 7-clause mandate is the immutable spine, cited not re-litigated.

## 7 — The dev→impl boundary

The deliverable is this campaign + the kf-P tranche docs + the two dispatch packets — verified by
the audit on disk, the deferred-fold ledger (every chronic a terminal home), the prompt-recap (zero
drops), and each wave's falsifiable born-RED gate (especially the codegen parity+throughput gate and
the portable perf-ratio gates the aggressive optimizations require). Implementation opens only on the
owner's explicit go, per-repo, DAG-ordered. inv-16 holds throughout.
