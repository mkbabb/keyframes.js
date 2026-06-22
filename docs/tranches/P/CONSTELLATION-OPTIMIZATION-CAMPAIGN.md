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

**The CONTRIVANCE-AUDIT is the new discipline** (`P/CONTRIVANCE-AUDIT.md`, 2026-06-22; 31 items in
the codegen-spine vein). After the codegen retraction a conservative fastidious audit hunted the
same contrivance skeleton across the recent specs — *a speculative-payoff perf/arch claim, justified
by a TRANSPLANTED or ASSERTED number, attached to a NON-DEFAULT or NOT-YET-REAL path, carrying NEW
abstraction or DUAL maintenance, chartered BEFORE the bottleneck was measured born-RED on the wave's
OWN target path on the SAME report*. Its principle: the **smallest grounded change; measure-first;
single-path; no speculative deps; no public API without a live consumer**. Every future wave answers
the **7-question pre-charter smell-test** IN ITS HEADER before chartering (verbatim in
`CONTRIVANCE-AUDIT.md §smell-test`): (1) MEASURED-BOTTLENECK? (2) DEFAULT-PATH? (3) IN-REALM-SOLVABLE?
(4) SINGLE-PATH? (5) SMALLEST-CHANGE? (6) SAME-REPORT-RATIO? (7) EXTERNAL-BEHAVIOR-DELTA? — ANY "no" on
1/3/4/6 → DEMOTE-TO-SPIKE or MEASURE-FIRST before charter. The aggressive shell across the triumvirate
(kf SoA/Typed-OM/Playhead; value.js VJ-L1/VJ-P2) is reformulated per that audit (§4/§5 record each
disposition); the grounded in-realm core survives. This is the discipline this constitution now binds.

**DISPATCH note — the value.js-side contrivances (recorded, NOT edited from kf; inv-16).** The audit
also flagged value.js-side items for the value.js Tranche P session to reformulate in its OWN tree
(kf does not edit them — this is a dispatch record only): **O.W4 experimental grammar** (`if()`,
`@function`, sibling-index/sibling-count, contrast-color) → RE-SCOPE (split O.W4-core from
O.W4-experimental; the experimental clauses gate on a stable browser baseline); **O.W5 spring()-supersede
+ @function-lowering** (`lowerCustomFunction`) → DROP (unshipped CSS — no consumer beyond kf-internal);
**O.W6 byte-loop scanner rewrite + SpanParser harvest** → DEMOTE-TO-SPIKE (keep only the born-RED
baseline bench S1 + the `proof:perf-target` gate S5; require a same-report MB/s ratio before adopting
the byte-loop). These are value.js's to land per inv-16; kf records them so the constellation coordination
is durable.

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
        └── packrat-fix + ────────┴──── VJ-L3 API ───────────┘
            perf-floor (proof:perf)      + perf-floor consume
```

The coupling is the **API + correctness + perf-floor consume**, NOT a generated parser: parse-that
ships the packrat cross-input correctness fix + the perf-frontier (the `proof:perf` floor); value.js P
consumes that correct/fast parser substrate and exposes the **VJ-L3** API (the surviving binding ask;
VJ-L1 is demoted-to-spike — kf's P.W11 WeakMap is the terminal S8 cure, so VJ-L1 is not on the consume
critical path); keyframes P consumes the VJ-L3 API + inherits the perf floor. No codegen subpath
crosses any edge of this DAG.

- **parse-that B → 0.12.0** — the **packrat cross-input bug fix** (the BLOCKER) + the **Span-combinator
  DEDUP** (one collector-parametric backtracking vocabulary) + the **perf frontier** (combinator fusion +
  2-char dispatch widening + the `proof:perf` regression gate). NO codegen subpath.
- **value.js P → 1.1.0** (API: VJ-L3 `parseCSSSubValue` — the surviving binding ask) **then
  1.2.0** (perf: VJ-P1 `color2Into` gamut zero-alloc tail + the `: any` seam narrowing VJ-P3) — and
  **VJ-P.W0 = commit the uncommitted O docs + reconcile the stale "DEVELOPMENT — charter only"
  PROGRESS to CLOSED-as-built** (record-as-built honesty, the FIRST P action). Per the
  CONTRIVANCE-AUDIT: **VJ-L1 `flatLeaf` is DEMOTED-TO-SPIKE** (kf's P.W11 WeakMap is the terminal S8
  cure — VJ-L1's only residual is retiring the clone-restamp ceremony) and **VJ-P2 the typed Float64
  channel view is DROPPED** (its premises are falsified by shipped value.js). *There is NO kf P.W0 —
  the kf roster starts at P.W1; `VJ-P.W0` is value.js Tranche P's first (DISPATCH) wave, namespaced to
  avoid colliding with the kf P-wave space.*
- **keyframes P → 5.1.x** (perf is non-breaking; rides after O's 5.0.0 cut) — the **grounded
  in-realm core** (the `_styleOut` out-buffer alloc-cure, the engine-seam split O.W7, the
  demo-frontend-design refinements, the correctness cures); the **aggressive shell** (SoA compositor /
  Typed-OM write path / Playhead value-object) is **demoted-to-spike or dropped** per the
  CONTRIVANCE-AUDIT (§4 below) — each gated on a MEASURE-FIRST born-RED bench of its OWN target path.

The engine-seam coupling, restated: kf's `engine.ts` god-object split (O.W7, 1397→~900) is
**executable NOW** — **NOT VJ-L1-gated** (per the CONTRIVANCE-AUDIT). kf's **P.W11 realm-clean
`WeakMap<ValueUnit, string>`** (or simply the file-split itself) makes the flatten/parse seam in-realm
— the **TERMINAL S8 cure** with zero value.js dependency, the **P-inv-28 chronicity-4 belt exit** for
S8 (born E; the belt fires THIS tranche). S9 (born C) exits on the VJ-L3 consume (O.W16). The S8/S9
chronicity is
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
  ~84 → the measured post-cure residual) + `parseCSSSubValue` (VJ-L3, the surviving API ask) + the
  **`: any`→string seam narrowing** (VJ-P3). The 1.2.0 wave is the **color/alloc/perf work only** — it
  does NOT generate its CSS parser. Per the CONTRIVANCE-AUDIT: **VJ-L1 `flatLeaf` is demoted-to-spike**
  (kf's P.W11 WeakMap is the terminal S8 cure) and **VJ-P2 the typed Float64 channel view is DROPPED**
  (the string-keyed read it claimed to cure is already routed around in shipped value.js; a residual
  suspicion widens value.js's own `interpolate.ts buildColorChannels`, NOT a new public Color shape).
- **keyframes** — the **`_styleOut` module-scope out-buffer alloc-cure** of `transformTargetsStyle`
  (the P.W3 S2 FLOOR — a proven-pattern alloc cure of the per-frame `Record<string,string>` mint,
  single-path, no dual maintenance) is the **grounded engine-perf payload**. The **aggressive shell**
  is demoted/dropped per the CONTRIVANCE-AUDIT: the **SoA composite buffer** for AnimationGroup is
  **DEMOTE-TO-SPIKE** (the default `replace` blend is already dispatch-free + untouched; the megamorphic
  boxed-AoS blend lives ONLY in the non-default add/weighted arms — charter the SoA engine edit ONLY if
  those arms clear the bar on a `bench/group-composite.bench.ts` that measures `transformFramesGrouped`
  SPECIFICALLY, same-report ratio); the **Typed-OM (`StylePropertyMap`) write path** is
  **DEMOTE-TO-SPIKE** (a permanent dual-path — Typed-OM is Limited Availability, no Firefox — gated on a
  write-cost Playwright measurement FIRST; on KILL ship the S2 out-buffer ALONE); the **`Playhead`
  value-object** is **DROPPED** (no perf claim, pure delegating-accessor indirection, depends on the
  unlanded O.W7 — the engine.ts shrink is O.W7's file-split, not a value-object).
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
- **VJ-P1** `color2Into` out-param — collapse the gamut bisection from ~84 → the MEASURED post-cure
  residual (the deferred O.W3/O.W5 tail; the `matrix.transformMat3Into` scratch pattern proven one
  layer down; `proof:gamut-alloc N_TARGET` set to that measurement + margin, not a guessed floor).
  [grounded alloc cure]
- **VJ-L3** `parseCSSSubValue` (FunctionArgs-first in-realm door) — the surviving binding API ask; a
  real cross-realm breach kf cannot self-solve (the direct parse-that import + two `as any` casts +
  the prod dep). [grounded · BC-additive]
- narrow the `: any` property/subProperty seam → `string` (VJ-P3, strict-mode invariant; verified by
  the existing repo-wide strict `tsc`, no bespoke gate). [precept]
- **VJ-L1** `flatLeaf` `fnName` field — **DEMOTE-TO-SPIKE** per the CONTRIVANCE-AUDIT: kf's P.W11
  realm-clean WeakMap is the TERMINAL S8 cure (in-realm, no sibling API); VJ-L1's only residual is
  retiring the clone-restamp ceremony — re-opened only on a measured need, NOT the O.W7 unblocker.
  [spike-gated]
- **VJ-P2** typed Float64 channel view — **DROPPED** per the CONTRIVANCE-AUDIT: premises falsified by
  shipped value.js (the string-keyed megamorphic read is already routed around). A residual suspicion
  widens value.js's own `interpolate.ts buildColorChannels`, NOT a new public `Color._ch` shape. [dropped]

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

**keyframes (5.1.x) — the GROUNDED in-realm core (the aggressive shell demoted/dropped per the
CONTRIVANCE-AUDIT):**
- the **`_styleOut` module-scope out-buffer alloc-cure** of `transformTargetsStyle` (P.W3 S2 FLOOR) —
  a proven-pattern alloc cure: hoist a reuse `Record` and pass it as the `out` arg to value.js's
  `unflattenObjectToString` (the sink already accepts it). Single-path, no dual maintenance, measured
  allocation. **The wave's grounded payload.** [grounded]
- the **engine-seam split (O.W7, 1397L→~900L)** — lifting the playback machine into
  `engine-playback.ts`. **Executable NOW** (NOT VJ-L1-gated); the file-split (and the P.W11 WeakMap)
  makes the seam in-realm. [grounded structural cure]
- the **leaves.ts→value.js/math TRAP** (precept correction to O.W9): a plain "import the canonical
  ./math" would **RED `proof:boundary`** (the subpath specifier is banned in LIGHT source) — the
  no-legacy cut is a **bundle-externalization transposition**, not a delete. [precept BLOCKER]
- the **SoA composite buffer for AnimationGroup** — **DEMOTE-TO-SPIKE.** The default `replace` blend
  (`group.ts:289-294`) is a bare reference-assign with ZERO per-element dispatch — the megamorphic
  boxed-AoS blend lives ONLY in the non-default add/weighted arms. The wave's FIRST step is
  `bench/group-composite.bench.ts` measuring `transformFramesGrouped` SPECIFICALLY (default replace +
  add/weighted arms separately, same-report ratio); charter the SoA engine edit ONLY if the
  add/weighted arms clear the bar. The 3.86x headline (which measured `SpringProgress.setTargets`, a
  DIFFERENT path) is RETIRED as the justification. [demote-to-spike]
- the **Typed-OM (Houdini `StylePropertyMap`) write path** — **DEMOTE-TO-SPIKE.** A PERMANENT
  dual-path (Typed-OM is **LIMITED AVAILABILITY** — Chrome/Edge 66+, Safari 16.4+, NO Firefox for the
  aggregate API) for a Chromium-mostly win on the least-common multi-property shape. Run the
  write-cost Playwright gate FIRST as a measurement; on KILL ship the `_styleOut` out-buffer ALONE.
  [demote-to-spike]
- the **`Playhead` value-object** — **DROPPED.** No perf claim; pure delegating-accessor indirection
  (BC-preserving by construction = zero observable delta); depends on the unlanded O.W7. The engine.ts
  shrink is O.W7's file-split, not a value-object. [dropped]

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
