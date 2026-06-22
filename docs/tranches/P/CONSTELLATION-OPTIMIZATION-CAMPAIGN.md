# The Constellation Optimization Campaign — the triumvirate challenge

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-20 from a 32-agent triumvirate
> re-audit (`P/audit/AUDIT-DIGEST.md`, ~3.8M tokens; 297 findings · **172 novel ideas**,
> 29 radical). This is the **constitution** the three sibling sessions cite — it locks the
> topology, the DAG, the in-realm optimization payload, and the version split. **No engine/demo/library
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

The audit corrected two stale premises up front (record-as-built honesty): both siblings
**already have bench infrastructure** (value.js `bench/` + a portable JSON.parse-ratio gate;
parse-that `typescript/test/benchmarks/`) — the perf frontier has a measurement substrate; and
**glass-ui 4.1.0 published but `SegmentedTabs.vue:406` still emits `aria-orientation`
unconditionally** — the kf S1 deletion is NOT yet safe (the O aria-guard dispatch stands).

**Codegen is OUT OF SCOPE for this campaign** (owner directive, 2026-06-22): "No codegen or
contrivance like that in parse-that. That's BBNF-lang's job and to be done in a completely
separate session." The triumvirate's perf payload is the IN-REALM optimizations (§4); codegen —
a BBNF-grammar-as-source-of-truth generated parser — is BBNF-lang's job in a separate prototype
session, not referenced here as a dependency, substrate, fallback, OR design-reference.

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

## 3 — The DAG (the consume coupling) + the version split

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0 correctness+perf) (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
        │                         │                            │
        └── packrat-fix + ────────┴──── VJ-L1/L3 API ──────────┘
            perf-floor (proof:perf)      + perf-floor consume
```

The coupling is the **API + correctness + perf-floor consume**, NOT a generated parser: parse-that
ships the packrat cross-input correctness fix + the perf-frontier (the `proof:perf` floor); value.js P
consumes that correct/fast parser substrate and exposes the VJ-L1/L3 API; keyframes P consumes the
VJ-L1/L3 API + inherits the perf floor. No codegen subpath crosses any edge of this DAG.

- **parse-that B → 0.12.0** — the **packrat cross-input bug fix** (the BLOCKER) + the **Span-combinator
  DEDUP** (one collector-parametric backtracking vocabulary) + the **perf frontier** (combinator fusion +
  2-char dispatch widening + the `proof:perf` regression gate). NO codegen subpath.
- **value.js P → 1.1.0** (API: VJ-L1 `flatLeaf` provenance + VJ-L3 `parseCSSSubValue`) **then
  1.2.0** (perf: VJ-P1 `color2Into` gamut zero-alloc tail, VJ-P2 the typed Float64 channel view, the
  `: any` seam narrowing) — and **VJ-P.W0 = commit the uncommitted O docs +
  reconcile the stale "DEVELOPMENT — charter only" PROGRESS to CLOSED-as-built** (record-as-built
  honesty, the FIRST P action). *There is NO kf P.W0 — the kf roster starts at P.W1; `VJ-P.W0` is
  value.js Tranche P's first (DISPATCH) wave, namespaced to avoid colliding with the kf P-wave space.*
- **keyframes P → 5.1.x** (perf is non-breaking; rides after O's 5.0.0 cut) — the SoA compositor,
  the Typed-OM write path, the demo-frontend-design fleet, the correctness cures.

The hardest coupling: kf's `engine.ts` god-object split (O.W7, 1397→~900) is **VJ-L1-gated** — it
sequences AFTER value.js P ships `flatLeaf` (which dissolves kf's S8 `FN_NAME` sidechannel). The
**VJ-L1 WeakMap fallback** (X4 radical idea) is the kf-internal early-cure that unblocks O.W7 NOW
if value.js P slips — the **P-inv-28 chronicity-4 belt exit** for S8/S9 (born E / born C respectively;
S8/S9 are at chronicity 4 — K,L,M,O→P — the belt fires THIS tranche). The S8/S9 chronicity is
canonical: **DM-2 (born E) / DM-3 (born C) · 7 carries through M · O CHARTERS the forbidden-8th-carry
close (O.W5/O.W6) · P INHERITS + IMPLEMENTS the build-in (chartered, never built; P.W5/P.W7 are the
impl)** — never a "chronicity 9 / 8-tranche / 9th carry" framing.

## 4 — THE IN-REALM OPTIMIZATION PAYLOAD (the campaign's perf payload)

> **The codegen spine was RETIRED** (owner directive, 2026-06-22: "No codegen or contrivance like
> that in parse-that. That's BBNF-lang's job and to be done in a completely separate session.").
> The campaign's perf payload is NOT a generated parser — it is the IN-REALM optimizations across
> the three realms. Codegen (a BBNF-grammar-as-source-of-truth emitter) is out of scope: it is
> BBNF-lang's job in a separate prototype session, not consumed, shipped, or referenced here.

The perf win is earned in-realm, per library, each gated at parity-or-better throughput against the
PORTABLE anchors (value.js's JSON.parse-ratio gate; parse-that's `proof:perf` floor) — no unsourced
speedup multiple, no cross-realm codegen dependency.

- **value.js** — the **color zero-alloc tail** (VJ-P1 `color2Into` out-param: gamut bisection from
  ~84 → <12 allocs/call) + the **typed Float64 channel view** (VJ-P2: kill the megamorphic
  `[key:string]:any` reads) + **`flatLeaf` provenance** (VJ-L1, additive `fnName`: dissolves the kf S8
  `FN_NAME` sidechannel) + `parseCSSSubValue` (VJ-L3). The 1.2.0 wave is the **color/alloc/perf work
  only** — it does NOT generate its CSS parser.
- **keyframes** — the **SoA composite buffer** for AnimationGroup (a contiguous `Float64Array`
  accumulator; the blend becomes a branch-free/dispatch-free typed fold) + the **`Playhead`
  value-object** (transpose the engine god-object at the driver seam; BC-additive via delegating
  accessors) + the **Typed-OM write path** (Houdini `StylePropertyMap`, progressive-enhancement
  feature-detected).
- **parse-that** — **correctness + the perf-frontier**: the packrat cross-input pollution FIX (the
  BLOCKER), the Span-combinator DEDUP (one collector-parametric backtracking vocabulary; the ~400
  copy-pasted lines collapse), and combinator fusion + 2-char dispatch widening behind the `proof:perf`
  regression gate.

**On the A.W3 falsification (kept as the historical record, not re-litigated):** A.W3 falsified the
SpanParser tagged-union as a *runtime* recursive switch (~10-14% slower on V8 — V8 monomorphic-inlines
per-site closures better than a hand-rolled dispatch loop). That falsification stands. With codegen out
of scope, the SpanParser tier has **no in-realm consumer** — P-invariant-28 resolves to **KILL** (the
parse-that session's recommendation: delete the SpanParser tier + the span-dispatch bench, keep the
A.W3 falsification as a docs paragraph). No parked asset is held here for an external prototype.

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
- **PT-B1 — the packrat cross-input pollution FIX** (the BLOCKER) — `memoize()` returns a stale result
  across different inputs (the MEMO key has no `src` component, `packrat.ts:55`) + the 4096-ID
  float64-key fix. A real correctness bug; the WeakRef-epoch / auto-reset cure. [BLOCKER]
- **PT-B2 — the Span-combinator DEDUP** — collapse the ~400 lines of copy-pasted Span backtracking
  plumbing (the 10 `*Span` builders in `span.ts`) into ONE collector-parametric vocabulary. A
  no-legacy/gestalt DEDUP (a bug fixed once, not twice) — NOT a codegen IR. [radical]
- **PT-B3 — the perf frontier** — combinator fusion + a 2-char (16-bit) dispatch widening for the
  residual 3-4-deep `any()` buckets + the bench/`proof:perf` regression gate. [aggressive]
- **PT-B4 — the SpanParser KILL** — delete the SpanParser tier (`span.ts:540-902`) + the span-dispatch
  bench (no in-realm consumer once codegen is out of scope); keep the A.W3 falsification as a docs
  paragraph. (May fold into PT-B2's housekeeping.) [P-inv-28 → KILL]

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
drops), and each wave's falsifiable born-RED gate (especially the parse-that `proof:perf` regression
gate and the portable perf-ratio gates the aggressive optimizations require). Implementation opens
only on the owner's explicit go, per-repo, DAG-ordered. inv-16 holds throughout.
