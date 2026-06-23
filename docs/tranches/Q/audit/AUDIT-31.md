# Tranche Q — 31-lane audit digest (the wave-authoring evidence base)

> Raw lane outputs: the wr33rzcqc (23) + wijlkkw6p (8) task outputs. This digest carries each lane verdict + its proposed waves + the deferred items it terminalizes + the mid-tranche friction it pre-empts.

## B1-parsethat-fusion

**Verdict:** The PT-B3 fusion is sound where it landed: `then` was correctly left un-fused (its only consumers are tuple-load-bearing; value.js uses zero `.then()`), and `fuseAll`/`all` is a clean monomorphic unroll. BUT 0.12.0 shipped FOUR zero-consumer surfaces that collide with Q's NO-legacy / NO-deferral precepts: (1) the 15 *Span builders — KEPT only to honor a within-tranche BC-additive promise, yet pinned by two gates as 'canonical public API,' directly contradicting parse-that's own substrate audit t

**Findings:**
- STRENGTH — `then` left un-fused is CORRECT, not a missed opportunity. value.js consumes ZERO `.then()` (it is all `all`/`any`/`dispatch`/`map`). The only `.then()` consumers in-realm are json.ts:31 and parsers/utils.ts:8, and json.ts:31 (`.then(jsonValue.trim())`) is DELIBERATELY
- CONTRIVANCE-RISK / zero-consumer surface #1 — `thenMap` (parser.ts:96-119) has ZERO consumers anywhere in the repo, in value.js, or in keyframes (verified: only the definition + dist/parser.d.ts reference it). It is a speculative `then().map(f)` fusion seam whose target shape doe
- CONTRIVANCE-RISK / zero-consumer surface #2 — `fuse()` (leaf.ts:352-362) is strictly worse than thenMap: zero consumers AND it is NOT exported from the barrel (absent from index.ts line 9 and core.ts). It is byte-identical to `all()` (same `fuseAll` core, same `createParserContex
- FINDING — the `dispatch` subTable (2nd-byte widening, leaf.ts:103-215) has ZERO production consumers. value.js color.ts:732 and parsing/index.ts:425 call single-arg `dispatch(table)`; json.ts:40 single-arg; the ONLY 2-arg call is test/benchmarks/pt-b3-fusion.bench.ts:72. The wide
- FINDING — the 15 *Span builders (span.ts: stringSpan/regexSpan/manySpan/sepBySpan/wrapSpan/optSpan/skipSpan/nextSpan/altSpan/takeUntilAnySpan/negateSpan/peekSpan/notSpan/minusSpan/lookAheadSpan) have ZERO consumers constellation-wide (verified across parse-that src/, value.js/src
- NO-LEGACY VIOLATION (tension) — keeping a 15-function, zero-consumer published surface directly contradicts parse-that's OWN substrate-deadcode audit precept: 03-substrate-deadcode.md:64 / :239 rules `make_alphabet` = "public surface with zero workspace consumers → DELETE" and :9
- FINDING — proof:perf (scripts/proof-perf.mjs) and the pt-b3-fusion bench measure the fusion + widening, but BOTH benchmark synthetic corpora (string('a')/string('b')/string('c'); a hand-built calc/clamp/cubic corpus) — there is NO measurement that the fusion/widening actually mov

**Deferred/chronic terminalized:**
- The 15 *Span builders (span.ts) — zero-consumer published+gated surface, KEPT at B.W0 only to preserve the 0.12.0 BC-additive promise (IMPL-RUN-BOARD.md:46); th → **Q wave Q-PT1 (DISPATCH to parse-that): a deprecate-then-remove-in-a-major decision. EITHER (a) adopt them — migrate valu**
- thenMap (parser.ts:96) — zero-consumer speculative public method born in 0.12.0. → **Q wave Q-PT2 (DISPATCH to parse-that): same fork as the span builders but cheaper to resolve — either find/create one re**
- fuse() (leaf.ts:352) — zero-consumer, non-barrel-exported, byte-identical-to-all() duplicate. → **Q wave Q-PT2 (DISPATCH to parse-that): DELETE. It is unreachable from the package root (not in index.ts/core.ts), it dup**
- dispatch subTable 2nd-byte widening — correct + gated but with zero production consumers; the residual `c`-bucket perf frontier it was built for (value.js calc/ → **Q wave Q-VJ1 (DISPATCH to value.js): migrate value.js's function-name dispatch (parsing/index.ts:425 Function_, color.ts**

**Proposed waves:**
- [DISPATCH] **Q-PT1** — parse-that: decide the *Span surface — adopt (migrate value.js span scanners onto it) OR deprecate-then-remove in 1.0.0; resolve the zero-consumer-published-surface chronic. · gate: proof:span-surface-resolved.mjs — born-RED: asserts EITHER (a) at least one value.js/keyframes sourc
- [DISPATCH] **Q-PT2** — parse-that: delete the never-consumed 0.12.0 additions — fuse() (leaf.ts:352) and thenMap (parser.ts:96) — as dead new API with no BC obligation; OR prove a consumer for thenMap. · gate: proof:no-dead-combinator.mjs — born-RED: greps the parse-that surface for any export with zero in-re
- [DISPATCH] **Q-VJ1** — value.js: consume the dispatch subTable widening on the function-name hot path (Function_ / color Value) and re-baseline proof:perf-target on the real CSS corpus; retract the widen · gate: proof:perf-target — extend with a clause that the function-name dispatch parses the megamorphic c-bu
- [DISPATCH] **Q-PT3** — parse-that: lift the proof:perf measurement from synthetic corpora to the constellation's real grammar — measure fusion+dispatch over value.js's actual CSS parse so the in-vitro pe · gate: proof:perf-onpath.mjs — born-RED: runs the value.js CSS parser (the real consumer) through a fixed C

**Friction pre-empted:**
- FRICTION: Q-VJ1 (value.js consumes subTable) and Q-PT1 option-a (value.js consumes *Span scanners) both require value.js source edits, which would normally spawn a mid-tranche 'value.js needs a republ
- FRICTION: Q-PT1 deprecation path (option-b) deletes the *Span surface in parse-that 1.0.0, which would force the dist-surface.test.ts:52 '15 span fns' gate and proof-span-parser-killed.mjs's 'must rem
- FRICTION: deleting fuse()/thenMap (Q-PT2) could break a downstream that imported them between 0.12.0 publish and Q — a silent BC break. PRE-EMPT: gate Q-PT2 on a registry/usage check (npm + the conste
- FRICTION: if Q-VJ1's ≥40% on-path clause comes back NEGATIVE, the wave must pivot from 'consume' to 'retract', which is a different change shape (revert leaf.ts) — a classic mid-tranche fork. PRE-EMPT

---

## B1-valuejs-color

**Verdict:** YES — a deeper architectural transposition reaches &lt;12 allocs/call, and it is the SECOND HALF OF VJ-P1 THAT THE IMPL DROPPED, not a new idea. The shipped value.js 1.1.0 cured only the OKLCH->XYZ hub leg (84->37); the planned 1.2.0 egress-converter out-param (xyz2rgbFamilyInto + getXyzFromIntoFn, eliminating the ~25 per-step DisplayP3 wrapper allocs that copyChannelsInto immediately discards) was never shipped — there is no value.js 1.2.0. Instrumented decomposition proves the residual 37 is 2

**Findings:**
- GROUND-TRUTH CONFIRMED: gamutMap(display-p3 OOG) is exactly 37 Color allocs/call (proof-gamut-alloc.mjs C2-cured PASS, N_TARGET=40). Per-class decomposition (instrumented, ONE call): DisplayP3Color=28, XYZColor=4, OKLABColor=4, OKLCHColor=1. The agent's '37 are converter-owned eg
- ANSWER TO THE LANE QUESTION — YES, a deeper transposition reaches <12, AND IT IS ALREADY NAMED BUT UNSHIPPED. The dominant residual is per-step egress-wrapper boxing: color2Into's OKLCH fast path (dispatch.ts:272-277) calls fromXYZFn(xyz)=xyz2displayP3 which `return new DisplayP3
- THE TRANSPOSITION (the converter-layer out-param the gate itself names at proof-gamut-alloc.mjs and the deferral comment at dispatch.ts): add an out-param egress family — xyz2rgbFamilyInto(xyz, fromXyzMatrix, transferEncode, out: Color) that uses transformMat3Into (matrix.ts:34, 
- THE 9 HUB-INTERMEDIATES (XYZ 4 + OKLAB 4 + OKLCH 1) are the setup/emit conversions OUTSIDE the loop and are individually cheap, but to reach the <12 target cleanly they should also be tuple-routed: gamutMapToRgbSpace's seed color2(color,'oklch') (dispatch.ts:330) and gamutMap's t
- NO-LEGACY / CONTRIVANCE: the cure is NOT contrived — it is the half of VJ-P1 that the plan EXPLICITLY scoped and the impl silently truncated. The mechanism is already half-built: transformMat3Into exists (matrix.ts:34, aliasing-safe doc-comment), oklab.ts already runs zero-tuple-
- VERSION-SPLIT REGRESSION (the real gap): P.md lines 317-326 and FULL-LOOP-LEDGER line 723 specced a 1.1.0 (API: VJ-L3) THEN 1.2.0 (perf: VJ-P1 color zero-alloc) split, with the ledger's brainstorm (line 721) anticipating the post-cure residual as '<12 given C2-jnd already hits 5'
- STRENGTH: the proof-gamut-alloc.mjs gate is genuinely MEASURE-FIRST and born-RED honest (C1 witnesses N_BASELINE=104 to prove it sees real allocs; C3-epsilon bit-stability golden via color-into.test.ts). The instrument (constructor-count via __proto__ swap on dist/subpaths/color.

**Deferred/chronic terminalized:**
- VJ-P1 egress-converter out-param (xyz2rgbFamilyInto / getXyzFromIntoFn) — the deeper transposition that eliminates the 24+1 per-step egress wrappers and drives  → **value.js-Q DISPATCH wave VJ-Q1 (see proposedWaves) — a value.js-side converter-layer rewrite, consumed by kf via a ^1.2.**
- The 9 setup/emit hub-intermediates (the seed OKLCH + two JND OKLAB + emit round-trips boxing OKLABColor/XYZColor outside the bisection loop) — secondary to the  → **Same value.js-Q wave VJ-Q1, sub-step S2: add *2oklabTuple/*2oklchTuple companions to gamut.ts oklchToXYZTuple and route **
- value.js 1.2.0 perf cut + kf ^1.2.0 re-pin + proof-gamut-alloc N_TARGET re-baseline (40 -> 12) — the constellation plumbing the truncated 1.1.0 left dangling. → **kf Tranche Q consume wave KF-Q-COLORPIN (GATED on VJ-Q1 publish) — re-pin package.json to ^1.2.0, re-run proof:perf-targ**

**Proposed waves:**
- [DISPATCH] **VJ-Q1** — value.js egress-converter out-param: add xyz2rgbFamilyInto(xyz, fromXyzMatrix, transferEncode, out) using transformMat3Into into a module Vec3 + setChannel writes (zero new), wire  · gate: proof:gamut-alloc with N_TARGET lowered 40->12: C2-cured RED today at 37 (>12), GREEN only after the
- [GATED] **KF-Q-COLORPIN** — Consume value.js 1.2.0: re-pin keyframes.js package.json '@mkbabb/value.js' ^1.1.0 -> ^1.2.0, re-baseline any kf-mirrored gamut-alloc expectation, confirm compile-color.ts color2 c · gate: proof:perf-target (kf side) + a kf rAF wide-gamut co-bench (mirror bench/color-alloc-hotpath.mjs kf 

**Friction pre-empted:**
- FRICTION: VJ-Q1 is a value.js-repo wave; if Q only authors the kf consume (KF-Q-COLORPIN) without the value.js dispatch wave, KF-Q-COLORPIN becomes a blocked harness (permanently RED until a sibling s
- FRICTION: C3 bit-faithfulness — the egress-Into cure must be arithmetically identical to xyz2rgbFamily (same transformMat3 math, same transfer encode, same wrap-channel order) or the C3-epsilon golden
- FRICTION: the aliasing hazard — the egress `out` MUST be a caller-owned scratch never aliasing the XYZ hub scratch nor the source (a source-aliased out corrupts the bisection probe mid-step). PRE-EMPT

---

## B1-kf-s8-weakmap

**Verdict:** S8 is an HONEST chronic, not a regression: the P.W11/O.W16 WeakMap correctly dissolved the foreign-stamp realm breach (proof:no-foreign-symbol-stamp PASSES) but did NOT retire the clone-restamp ceremony, so proof:workaround-deletion S8 sits PENDING at 5 utils.ts sites. The prior tranche's 'WeakMap is terminal' framing is incomplete and, under Q's no-deferral precept, must be overturned. The OWNER-FAVORED terminal is the in-realm kf-side parallel-array design (Q.W-S8-TERMINAL, Option B, NOW) — it

**Findings:**
- GROUND-TRUTH CONFIRMED: the P.W11/O.W16 S8 WeakMap shipped (commit 495484a) and IS realm-clean — proof:no-foreign-symbol-stamp PASSES (zero kf-owned stamp on any value.js instance; the ValueUnit is a key, never mutated). But proof:workaround-deletion arm S8 is HONESTLY PENDING, n
- THE CEREMONY IS NOT INCIDENTAL — IT'S A STRUCTURAL CONSEQUENCE OF clone(): tryParseLeaves (utils.ts:226) returns shared MASTER leaves from a bounded LRU; each call clone()s them (utils.ts:291-292) for per-use-site property context; a clone is a fresh ValueUnit instance ABSENT fro
- TERMINAL-HOME OPTION A (VJ-L1 value.js fnName field) — VERIFIED VIABLE AND GENUINELY MINIMAL: value.js's ValueUnit clone() (index.ts:120-130) already copies subProperty/property/superType into the new instance. A 7th optional ctor field `fnName?: string` copied in clone() would s
- TERMINAL-HOME OPTION B (kf-side clone-aware design) — VERIFIED VIABLE AND FULLY IN-REALM: subProperty CANNOT double as the carrier because parseCSSSubValue (value.js parsing/index.ts:524-531) overwrites every leaf's subProperty with opts.subProperty=childKey ('transform'), CLOBBE
- STRENGTH: the realm-cleanliness gate (proof:no-foreign-symbol-stamp) is excellent and SHAPE-matching (it bites RENAMED Symbols, type-intersection annotations, and `as any` escape-hatch writes — not just the literal 'kf.fnName'). It correctly stays distinct from proof:workaround-d
- CROSS-LANE OBSERVATION (not my arm, flag for the owner): proof:workaround-deletion currently EXITS 1 (FAIL) with S1=RED and S2=RED — two OTHER arms whose sibling fixes are PUBLISHED but whose kf workarounds are still PRESENT. S8 is correctly PENDING. So the gate is already red on
- NO-LEGACY / CONTRIVANCE CHECK: the WeakMap itself is NOT legacy or contrivance — it is a correct, minimal, realm-clean intermediate. The contrivance RISK is leaving S8 PENDING indefinitely while calling it 'terminal' (the CONTRIVANCE-AUDIT's demote-to-spike framing), which conver

**Deferred/chronic terminalized:**
- S8 / P-inv-28 chronic: the FN_NAME clone-restamp ceremony (utils.ts:52,55,59,287,341) — proof:workaround-deletion arm S8 PENDING; the WeakMap dissolved the fore → **Q.W-S8-TERMINAL — adopt OPTION B (kf-side clone-aware parallel-array design) as the PRIMARY terminal, with OPTION A (val**

**Proposed waves:**
- [NOW] **Q.W-S8-TERMINAL** — Retire the FN_NAME WeakMap + the clone-restamp ceremony by threading flatten-origin fnName as a parallel (string|undefined)[] aligned to the flattened leaf array through tryParseLe · gate: proof:workaround-deletion arm S8 flips PENDING→GREEN (ABSENT) — the /FN_NAME|Symbol\(\s*["']kf\./ pa
- [DISPATCH] **Q.W-VJL1-DISPATCH** — DISPATCH to value.js Q: add an optional 7th ctor field `fnName?: string` on ValueUnit, copied by clone() (units/index.ts:120-130) and populated by flattenObject from the enclosing  · gate: value.js: a new vitest asserting `new ValueUnit(2,'',undefined,undefined,undefined,undefined,'scale'
- [GATED] **Q.W-S8-GATE-RECONCILE** — After the terminal lands, update proof-workaround-deletion.mjs arm S8 (scripts/proof-workaround-deletion.mjs:247-274) to assert the ABSENT-GREEN end-state and DELETE the now-stale  · gate: proof:ci-coverage (scripts/proof-ci-coverage.mjs) confirms S8 is no longer enumerated as a report-al

**Friction pre-empted:**
- FRICTION: Q.W-S8-TERMINAL Option B changes the SHAPE of tryParseLeaves' return (ValueUnit[] → {leaves, fnNames}) and the memoize cache value. If any OTHER consumer of tryParseLeaves exists it would br
- FRICTION: choosing BOTH Option A (VJ-L1) and Option B (kf parallel-array) would double-implement the cure and leave a vestigial value.js field or a vestigial WeakMap. PRE-EMPT: the two waves are decla
- FRICTION: the prior CONTRIVANCE-AUDIT's 'WeakMap is terminal, VJ-L1 demote-to-spike' framing (CONTRIVANCE-AUDIT.md:57; KF-TO-VALUEJS-P.md:44) directly contradicts Q's no-deferral precept (a forever-PE
- FRICTION: Q.W-S8-GATE-RECONCILE edits proof-workaround-deletion.mjs while S1/S2 arms are independently RED (the gate currently exits 1 for non-S8 reasons). A naive S8 edit could mask or be masked by t

---

## B1-kf-soa

**Verdict:** P.W2 SoA compositor fold is GENUINELY COMPLETE and exemplary for what it scoped: shipped (495484a), 5-clause gate green, bit-identical (maxErr=0), zero-alloc, K-monotone (add 2.25→2.38×, weighted 2.19→2.34× over K=3/8/12), whole-frame Amdahl win 2.07–2.23× (blend is 71–76% of the frame). No contrivance, no legacy, no workaround — the 3.86× transplant was correctly dropped and the verdict is measure-first/device-honest. The residual boxed paths (first-frame seed, mixed-leaf, first-touch scalar, m

**Findings:**
- STRENGTH: the SoA fold is genuinely shipped + gated, NOT a stub. proof:soa-composite is green with 5 live-observable clauses (measured-first, verdict-scope, soa-path-taken via soaBlendLayer-call-count=612, bit-identical maxErr=0, zero-alloc buffer-identity-stable across 200 frame
- STRENGTH: K-scaling is sound and the ratio HOLDS/GROWS with K. Live bench: add SoA-over-boxed = 2.25× (K=3), 2.29× (K=8), 2.38× (K=12); weighted = 2.19× / 2.27× / 2.34×. Boxed degrades steeper than SoA as K rises (boxed K=12 is 12.3× slower than SoA K=3; SoA K=12 only 5.15×), so 
- STRENGTH: the Amdahl whole-frame share is REAL and large. group-soa-integration.mjs measures blend at 75.9% of transformFramesGrouped (3-layer) / 71.2% (4-layer); applying the measured blend speedup gives whole-frame 2.23× / 2.07×. The blend is NOT a negligible Amdahl slice — it 
- FINDING (first-frame-after-structural-change one-frame boxed gap — DELIBERATE, bounded, NOT a bug): transformFramesGrouped:345 sets useSoA = (_soaPlans !== null); the first frame after _groupedKeysDirty drops _soaPlans=null (line 323) runs the full boxed path AND builds the plan 
- FINDING (mixed-leaf falls ENTIRELY to boxed — DELIBERATE K3 partition, realistically near-empty): buildSoAPlans:616-632 classifies a key BOXED if ANY blended element is non-numeric (never splits a key across both paths — would double-blend). A 'mixed leaf' means a key is numeric 
- FINDING (residual boxed paths enumerated — all CORRECT-by-construction, none a fold-able regression): (1) first-touch/scalar non-array carrier → boxedKeys (635-642), correct since there is no carrier array to fold into yet; (2) the per-frame boxedBlendArm over plan.boxedKeys runs
- FINDING (the K-scaling verdict is UNDER-WITNESSED in the durable terminal): scripts/soa-composite-decision.json records ONLY K=8 (add 2.536× / weighted 2.35×). The bench measures K=3/8/12 but proof-soa-composite.mjs:149-152 reads only the K=8 pair and writes only K=8 to the decis
- FINDING (ratio is run-variable but always safely above floor — NOT a flake risk): the decision-JSON recorded add 2.536× but a fresh gate run produced add 1.973× / weighted 2.325×; the K-ladder bench gave add 2.29× at K=8. The ratio swings ~1.97–2.54× across runs (V8 JIT/GC noise 
- NO-LEGACY / CONTRIVANCE CHECK (clean): zero @deprecated in group.ts. The boxed boxedBlendArm is NOT dead parallel code — it is the live seed-frame path AND the per-frame mixed/non-numeric residual (documented at 439-451). buildSoAPlans walks NON-destructively (reads .value to cla

**Deferred/chronic terminalized:**
- K3 processFrame-SoA: extend the SoA Float64 fold from the GROUP compositor (transformFramesGrouped, multi-animation) to the SINGLE-animation per-frame interp (C → **Q.W-SOA-PROCESSFRAME (NOW phase): bench interpFrames' pure-numeric-segment path SoA-vs-boxed via the existing interp-buf**
- K-scaling under-witnessed in the durable verdict: soa-composite-decision.json records only K=8; the K=3/K=12 monotonicity (the proof the fold scales) is never d → **Folded into Q.W-SOA-VERDICT-LADDER (NOW): extend proof-soa-composite.mjs to read + record ALL THREE K-rungs (3/8/12) int**
- Color-channel SoA (the non-numeric tail): the boxed residual permanently holds color/computed leaves because a Color cannot live in a Float64Array. P.W2 line 20 → **Q.W-COLOR-SOA-DISPATCH (DISPATCH to value.js): dispatch a value.js ask for a ColorChannelPlan (a Float64 oklab-channel l**

**Proposed waves:**
- [NOW] **Q.W-SOA-VERDICT-LADDER** — Extend proof-soa-composite.mjs + soa-composite-decision.json to durably record ALL THREE K-rungs (3/8/12) and assert SoA-over-boxed monotonicity in K, closing the K-scaling witness · gate: proof:soa-composite gains a 'k-ladder-monotone' clause: reds today because the decision-JSON has no 
- [NOW] **Q.W-SOA-PROCESSFRAME** — Extend the SoA Float64 fold from the group compositor to the single-animation per-frame interp (interpFrames pure-numeric segments) — the K3 processFrame-SoA, the next SoA frontier · gate: proof:processframe-soa (NEW, born-RED): a new processframe-soa-decision.json is absent today → red; 
- [DISPATCH] **Q.W-COLOR-SOA-DISPATCH** — Dispatch a value.js ColorChannelPlan so the compositor can fold the permanently-boxed color/computed leaf tail through a Float64 oklab-channel layout instead of per-element Color.l · gate: proof:color-soa (NEW, born-RED): reds because no ColorChannelPlan consume exists; greens when a colo

**Friction pre-empted:**
- FRICTION: Q.W-SOA-PROCESSFRAME shares the interp-buffer.bench.ts arm + the AnimationFrame.interpVars layout with any other Q wave touching the per-frame interp hot path (e.g. an engine.ts split lane o
- FRICTION: Q.W-COLOR-SOA-DISPATCH is GATED on a value.js publish (the ColorChannelPlan surface); consuming an unpublished sibling would violate the DAG-ordered invariant (IMPL-RUN-BOARD line 51). PRE-E
- FRICTION: the SoA ratio is run-variable (1.97–2.54× observed on the same machine). If Q adds any HARD absolute-hz floor to a SoA gate, it will flake RED on the slow Linux CI runner (the device-depende

---

## B1-kf-emerging

**Verdict:** Phase-1 of emerging-CSS (if(supports/media) + spring()) genuinely SHIPPED, gated, and clean — a real strength, not contrivance. The two advertised completions are NOT done: (1) the Phase-2 element-DEPENDENT arm is a typed seam with NO pass behind it — if(style(--p)) stays unresolved forever and sibling-index()/sibling-count() never enter the pass (hasResolvableValue is too narrow), even though value.js 1.1.0 already parses all three nodes, so this is FULLY in-realm and lands NOW as Q.W-EMERGE-P2

**Findings:**
- SHIPPED + GREEN (strength): the Phase-1 element-INDEPENDENT arm is genuinely complete and gated. if(supports(...))/if(media(...)) resolve to concrete re-parsed values (red -> rgb(255 0 0)), spring(m k c v0) maps to the kf curve via springCssToOptions, the guaranteed-invalid DROP 
- GAP 1 (Phase-2 element-DEPENDENT arm = a complete no-op): the typed seam exists — ResolveEnv carries customProps?/siblingIndex?/siblingCount? (resolve-values.ts:62-67), evalCondition returns `undefined` for style(...) leaving the if() intact (resolve-values.ts:284, 350-354), and 
- GAP 2 (sibling-index()/sibling-count() never even ENTER the pass): VERIFIED — value.js 1.1.0 already parses both into FunctionValue('sibling-index'|'sibling-count', []) via its generic producer (standalone AND nested in calc(sibling-index() * 10px)), so the PARSE half is free (no
- GAP 3 (the @function CALL-inlining arm is STRUCTURALLY UNREACHABLE — value.js gap, not in-realm): value.js 1.1.0 shipped extractFunctions (the @function DEFINITION registry collector — confirmed in dist/index.d.ts + src/parsing/extract.ts:124, and kf 4.4.0 consumes it at adapter.
- TYPED-ARG COERCION is the genuinely-hard, unspecced part of @function inlining (flagged in EMERGING-CSS-RESEARCH.md:18 + ledger:383): the CSS Mixins L1 spec validates each bound arg against the param's registered <syntax> at computed-value time and falls back to the param default
- CONTRIVANCE / scope check: the natural consumer for resolved sibling-index() is the existing stagger(count, opts) delay distribution (ledger:399-401) — a real, grounded betterment, not a manufactured one. But there is NO live demo/test that animates over DOM siblings today, so bu

**Deferred/chronic terminalized:**
- Phase-2 element-DEPENDENT emerging-CSS arm: if(style(--p)) + sibling-index()/sibling-count() resolved against the target element, post-setTargets. Typed seam pr → **Q.W-EMERGE-P2 (NOW — fully in-realm; value.js already parses all three nodes)**
- @function CALL-inlining (--double(2) -> substitute params -> coerce typed args -> evaluate result). Seam at resolve-values.ts:402 + registry threaded, but the c → **Q.W-VJ-FNCALL (DISPATCH to value.js — the call-parse arm) THEN Q.W-EMERGE-FN (GATED — kf inlining + typed-arg coercion, **
- hasResolvableValue is too narrow: only catches if/spring, so sibling-*/style()-bearing nodes that should enter the Phase-2 pass are skipped at the adapter guard → **Folded into Q.W-EMERGE-P2 (the guard widen is a precondition of the Phase-2 pass running at all)**

**Proposed waves:**
- [NOW] **Q.W-EMERGE-P2** — Build the Phase-2 element-aware resolve pass: re-run resolveValues post-setTargets with a populated ResolveEnv (customProps from getComputedStyle(target).getPropertyValue, siblingI · gate: proof:emerging-css-resolve-P2 — a jsdom test that (a) attaches a target whose --p custom prop is set
- [DISPATCH] **Q.W-VJ-FNCALL** — DISPATCH to value.js (a 1.2.0 grammar additive): add the dashed-function CALL parse arm so --ident(args) parses to FunctionValue('--ident', [arg0, arg1, ...]) instead of dropping a · gate: value.js round-trip test: parseCSSValue('--double(2, 3px)') is a FunctionValue named '--double' with
- [GATED] **Q.W-EMERGE-FN** — kf @function inlining over the now-parsing call site: when resolveNode meets a FunctionValue whose dashed name is in ctx.functions, bind the descriptor parameters to the call args, · gate: proof:emerging-css-resolve-fn — resolveKeyframes of `@function --double(--x) { result: calc(var(--x)

**Friction pre-empted:**
- FRICTION: Q.W-EMERGE-P2's element-aware re-resolve must run AFTER setTargets but must not double-resolve the Phase-1 nodes (already-concrete if(supports)/spring values) — re-running the full pass woul
- FRICTION: the Phase-2 lifecycle point is ambiguous — setTargets (engine.ts:1170) currently re-runs compiler.parse(this.targets) (line 353) which re-flattens from decl.value, but the Phase-1 resolution
- FRICTION: Q.W-EMERGE-FN is GATED on Q.W-VJ-FNCALL publishing — if Q tries to author the inlining before the dispatch lands, it cannot even born-RED (nothing parses), recreating the exact P.W13 mid-tra
- FRICTION: typed-arg coercion (Q.W-EMERGE-FN) needs value.js's @property syntax-validator, which kf does not currently import on the resolve path. PRE-EMPT: confirm in Q.W-VJ-FNCALL's dispatch that val

---

## B2-ow9-nolegacy

**Verdict:** SHIP this wave in Q as Q.W-NOLEGACY, phase NOW. O.W9 is a clean DELETION-ONLY change at the library (3 re-export lines + 2 interface keys + 3 barrel re-exports) because the canonical KeyframesAnimation/KeyframesScrollTimeline rename already shipped cleanly in L.W8 §S4. The real work is (a) the ~33-site consumer migration — LARGER than the brief's 22 (it omitted 5 test value-imports + kf-ScrollTimeline test/README sites + the type-side interface keys), and (b) a born-RED proof:no-legacy-surface o

**Findings:**
- GROUND TRUTH CONFIRMED: 2 @deprecated value-alias re-exports live (engine.ts:1205 Animation; timeline.ts:218 ScrollTimeline) + 1 type-alias re-export (timeline.ts:171 ScrollTimelineOptions) + 2 interface-key aliases (load-engine.ts:127, :258). All ship into the built d.ts (dist/k
- MIGRATION SURFACE IS BIGGER THAN THE BRIEF'S 22. The 22 demo sites are ALL `import type { Animation }` used only as type annotation (`Animation<any>` in function params / defineEmits / store fns) — zero `new Animation()` / `instanceof Animation` runtime sites in demo. But there a
- DISAMBIGUATION FRICTION (the real trap): `ScrollTimeline` is overloaded — the kf JS class AND the ambient Houdini `globalThis.ScrollTimeline`. test/platform-adopt.test.ts:28 ALREADY imports the kf class as `ScrollTimeline as JSScrollTimeline` to disambiguate from the global it de
- NO GATE EXISTS over the deprecated-alias surface today. The misleadingly-named proof:no-deprecated-guard.mjs gates an UNRELATED thing (vue-router's `next()` callback in demo/app/router.ts) — it does NOT touch the Animation/ScrollTimeline aliases. proof:published-surface.mjs reads
- STRENGTH — the canonical rename already shipped cleanly. KeyframesAnimation (engine.ts) + KeyframesScrollTimeline/KeyframesScrollTimelineOptions (timeline.ts) are the canonical declarations; the aliases are pure re-exports that emit WITHOUT numeric-suffix collision (the whole poi
- CONTRIVANCE-RISK / NO-LEGACY NUANCE: the migration must NOT leave a CHANGELOG/migration-shim or a `/** @deprecated kept for one more minor */` half-measure — the owner's NO-LEGACY + NO-DEFERRALS directive means the aliases are GONE in 5.0.0, full stop, and a MIGRATION.md (breakin
- SEMVER GATE: package.json is 4.4.0 pinning value.js ^1.1.0. The alias drop is a genuine BREAKING change (a consumer's `import { Animation }` / `import { ScrollTimeline }` value import stops resolving) → MUST cut 5.0.0 MAJOR, not 4.5.0. IMPL-RUN-BOARD:23 explicitly states 4.4.0 sh
- NO REGRESSION from prior tranches found — the aliases are doing exactly what L.W8 §S4 designed; nothing decayed. The only 'incompletion' is that O.W9 was DEFERRED (correctly, as breaking + owner-review), which is precisely what this lane terminalizes.

**Deferred/chronic terminalized:**
- O.W9 no-legacy alias drop → 5.0.0 (the @deprecated Animation / ScrollTimeline / ScrollTimelineOptions re-exports + the 2 AnimationEngine/EngineCore interface ke → **Q.W-NOLEGACY (this lane's primary wave) — full alias drop + consumer migration + proof:no-legacy-surface born-RED gate +**
- The ~33-site consumer migration (22 demo type-imports + 5 test value-imports + 2-3 test kf-ScrollTimeline + 3 README) from the old names to KeyframesAnimation/K → **Q.W-NOLEGACY sub-step S2 (consumer migration) — must precede the alias drop (S3) so the demo/test build never sees a mis**
- The missing 5.0.0 MIGRATION/breaking-change note (no CHANGELOG/MIGRATION.md exists; semver-honesty requirement per IMPL-RUN-BOARD:23) → **Q.W-NOLEGACY sub-step S5 — author docs/MIGRATION-5.0.0.md (the one permitted legacy-adjacent artifact: documentation of **

**Proposed waves:**
- [NOW] **Q.W-NOLEGACY** — Drop the 4 @deprecated alias surfaces (engine.ts:1205 Animation re-export; timeline.ts:218 ScrollTimeline re-export; timeline.ts:171 ScrollTimelineOptions type re-export; load-engi · gate: proof:no-legacy-surface (NEW) — builds the lib (build:lib precondition, same as proof:published-surf
- [NOW] **Q.W-NOLEGACY-S2-MIGRATE** — Sub-step (sequenced BEFORE the drop within Q.W-NOLEGACY): rewrite the 22 demo `import type { Animation }`→`KeyframesAnimation` + the 5 test value-imports + the kf-bound ScrollTimel · gate: npm run check (tsc --noEmit) + npm test must stay GREEN AFTER S2 and BEFORE S3's alias drop — i.e. t
- [NOW] **Q.W-NOLEGACY-S5-MIGRATION-DOC** — Author docs/MIGRATION-5.0.0.md: the one breaking change (Animation→KeyframesAnimation, ScrollTimeline→KeyframesScrollTimeline, ScrollTimelineOptions→KeyframesScrollTimelineOptions) · gate: proof:published-surface clause extension (or a small new assertion): the built README + MIGRATION do

**Friction pre-empted:**
- FRICTION: ScrollTimeline name-overload (kf class vs Houdini globalThis.ScrollTimeline). A blanket rename would corrupt the native-bridge tests/README. PRE-EMPT: Q.W-NOLEGACY-S2 must operate ONLY on im
- FRICTION: the 22 demo sites are type-only AND value-position type uses (`Animation<any>` in defineEmits payload types / store-fn params), so a sed of the import line alone leaves dangling `Animation<a
- FRICTION: dropping engine.ts:1205 also silently drops the runtime loadAnimationEngine().Animation key (it flows via Object.assign({...}, engine) at load-engine.ts:364) — but the AnimationEngine/Engine
- FRICTION: gate ordering — proof:no-legacy-surface needs the BUILT d.ts, so it must run AFTER build:lib in CI (same precondition as proof:published-surface). PRE-EMPT: wire proof:no-legacy-surface into
- FRICTION: NO mid-tranche deferral can be spawned by this wave — it is deletion + mechanical migration + one new gate + one doc. The only enabling dependency is owner authorization of the 5.0.0 publish

---

## B2-pw9-nanframe

**Verdict:** DM-22 is a confirmed-LIVE, 4-tranche chronic whose original cure (P.W9 Path A: throw in parse()) was correctly REVERTED because parse() is embedded in fromString() and Path A would break the L.W1 S4 opaque-ingest contract (replay-equality.test.ts:83). The proper cure is Path B (deferred resolution): named selectors stay opaque/round-trip at ingest; a bindTimeline() seam resolves them to numeric % via the ALREADY-EXISTING scroll-scene PHASE_FRACTIONS table; the NAMED_SELECTOR_NO_TIMELINE throw mo

**Findings:**
- CONFIRMED ROOT CAUSE of the revert: Path A (throw in parse()) is structurally incompatible with the L.W1 S4 opaque-ingest contract. engine.ts:1365 `fromString` calls `this.parse()` UNCONDITIONALLY; replay-equality.test.ts:83 asserts `fromString(entry/exit css)` does NOT throw. A 
- The NaN defect is REAL but LATENT-at-sample, not at-ingest. Chain: addFrame stores `new ValueUnit('entry', undefined, [NAMED_SELECTOR_SUPERTYPE])` so `.value === 'entry'` (a STRING). parse():462 sort `a.start.value - b.start.value` → `'entry' - 'exit'` = NaN. utils.ts:398 calcFra
- STRENGTH / KEY DISCOVERY: a complete named-phase→[0,1] resolver ALREADY EXISTS in scroll-scene.ts but is DISCONNECTED from the frame pipeline. PHASE_FRACTIONS (99-107: entry→{0,0.25}, exit→{0.75,1}, cover→{0.25,0.75}, contain→{0.375,0.625}), boundaryFraction (134-154, with the `e
- NO-LEGACY VIOLATIONS (two dead artifacts the impl drive left): (1) `NAMED_SELECTOR_SUPERTYPE` (frame-compiler.ts:128) is WRITTEN in addFrame but never READ anywhere — a dead write (confirmed by grep: only addFrame-context hits + the parse() comment). (2) `NAMED_SELECTOR_NO_TIMELI
- NO ATTACH/BINDING SEAM EXISTS on the engine. There is no `bindTimeline`/`attachTimeline`/`setScrollTimeline` method on Animation/CSSKeyframesAnimation. `scrollOptions` (engine.ts:1287) is recovered by fromString but consumed ONLY by compileToCSS to re-emit the longhands (the EMIT
- CONTRIVANCE-RISK in the original P.W9 grammar-fuzz (S3) + differential-oracle (S4) scope: these are bundled into the SAME wave as the NaN cure on the thin rationale 'correctness is only observable at runtime'. They are genuinely independent (different files, different siblings, f
- GAP in the L.W1 S4 test: replay-equality.test.ts:76-88 asserts ingest + round-trip of `entry`/`exit` but NEVER samples (`at()`/play) — so it is BLIND to the NaN. The deferred-ledger's `proof:replay-equality` S4 clause is a source-shape regex `/entry|exit|cover|contain/` over fram
- The bare-form mapping is UNDER-SPECIFIED: frame-compiler.ts:107 comment says bare `entry` maps to `entry 0% 100%`, but PHASE_FRACTIONS gives entry→{0,0.25}. A keyframe selector is a SINGLE position (the offset within the phase), not a range — so a bare per-keyframe `entry` must r

**Deferred/chronic terminalized:**
- DM-22 — named-selector frames → NaN-always-active (chronic since L.W1 S4; chartered M.W5 → O.W3 spec → P.W9 spec → REVERTED Path A; the IMPL-RUN-BOARD HONEST-DE → **Q.W-NANFRAME (NOW) — the deferred-resolution + play-time-guard cure specified below. This is the TERMINAL wave: DM-22 ha**
- NAMED_SELECTOR_SUPERTYPE dead write (frame-compiler.ts:128) + NAMED_SELECTOR_NO_TIMELINE typed-never-thrown (errors.ts:46) — the no-legacy debt the cure must re → **Q.W-NANFRAME (NOW) — both made live by the cure: SUPERTYPE read at the resolve seam, NO_TIMELINE thrown at the play/samp**
- P.W9 S3 grammar-fuzz harness (fast-check round-trip oracle) + S4 kf-vs-browser differential oracle — bundled into P.W9 but independent of the NaN cure; never im → **Q.W-CORRECTNESS-ORACLES (NOW, SPLIT from the NaN cure) — author proof:grammar-fuzz (fast-check devDep, GREEN-today arms **

**Proposed waves:**
- [NOW] **Q.W-NANFRAME** — Deferred-resolution + play-time guard for named scroll selectors: named selectors stay OPAQUE/round-trip at ingest (parse() never throws — L.W1 S4 floor preserved); a `resolveNamed · gate: proof:named-selector-nan-frame with FOUR clauses, ALL born-RED today: (1) `s4-ingest-roundtrip` — `f
- [NOW] **Q.W-NANFRAME-BIND** — The engine timeline-binding seam (the enabling sub-wave that pre-empts Q.W-NANFRAME's own mid-tranche deferral): add `bindTimeline(timeline: Timeline)` to CSSKeyframesAnimation tha · gate: proof:named-selector-bind: `namedSelectorToFraction('entry')===0`, `namedSelectorToFraction('cover')
- [NOW] **Q.W-CORRECTNESS-ORACLES** — SPLIT P.W9 S3+S4 into their own wave: proof:grammar-fuzz (fast-check model arbitraries — plain oklch/rgb/color-mix/calc/clamp GREEN-today arms + expected-failure tripwires for the  · gate: proof:grammar-fuzz exits 1 today (`fast-check` absent from devDependencies — grep confirms zero hits

**Friction pre-empted:**
- FRICTION: Q.W-NANFRAME needs a place to PUT the resolved numeric % AND a method to TRIGGER resolution, but the engine has NO timeline-attach seam today (no bindTimeline/attach — confirmed by grep). If
- FRICTION: the bare-form resolution rule is under-specified (frame-compiler.ts:107 says bare `entry`→`entry 0% 100%`, a RANGE, but a keyframe selector is a single POSITION). If left ambiguous, the reso
- FRICTION: re-using scroll-scene.ts PHASE_FRACTIONS in the frame pipeline crosses the LIGHT/HEAVY boundary — scroll-scene.ts is HEAVY (reached via loadAnimationEngine), and the namedSelectorToFraction 
- FRICTION: changing the play/at() path to throw NAMED_SELECTOR_NO_TIMELINE could break OTHER callers that sample un-timeline'd animations (e.g. the differential oracle, the demo). PRE-EMPT: scope the t
- FRICTION: coupling the NaN cure's gate-GREEN to the value.js-P-dispatched grammar-fuzz broken arms (none→NaN, color()-wrapper, round()) would block the cure on a sibling. PRE-EMPT: the SPLIT itself (Q

---

## B2-pw7-democontrolpoint

**Verdict:** The enabling wave the lane brief worried about (the drag2D LIGHT export) is ALREADY SHIPPED and gate-proven (index.ts:88, proof:drag-gesture S4) — no library wave is needed and the ordering-friction premise as stated is moot. The REAL incompletion is one layer up: the O.W5 DemoControlPoint substrate was NEVER built and P.W7 shipped only cosmetic sidebar polish (commit 97afd32), leaving DM-2 — an 8-tranche P-inv-28 ABSOLUTE terminal with 'no 9th ride' — functionally riding a forbidden carry into 

**Findings:**
- LANE-BRIEF INVERSION (the enabling wave is ALREADY DONE): the brief asks 'is drag2D a LIGHT export on index.ts?' — it IS. index.ts:88 `export { drag, Draggable, drag2D } from './drag'` + index.ts:94 `Drag2DHandle` type. drag2D lives in src/animation/drag-2d.ts:59 (re-exported THR
- drag2D IS gate-covered AND it is the L.W5/S4 clause of scripts/proof-drag-gesture.mjs (lines 47,529,609-616): asserts `drag2D` is a function exported off the LIGHT barrel, constructs a 2-D drag, and asserts `handle.value.y ≈ 120` — this gate was born-RED on the pre-L.W5 tree (`dr
- THE REAL GAP — the O.W5 DemoControlPoint substrate was NEVER BUILT, so the whole P.W7 chain is unbuilt. Verified absent on tree: `find demo -iname '*ControlPoint*'` → ZERO; demo/@/components/custom/DemoControlPoint.vue ABSENT; scripts/proof-demo-control-point.mjs ABSENT (only the
- P.W7's three D5 design gaps are all STILL OPEN on the shipped tree, exactly as the spec's born-RED witnesses predicted: (1) the HERO stage is read-only — EasingHeroStage.vue:54 `aria-hidden="true"` on the curve SVG + :210 `pointer-events: none` (verified by Read); the editable ca
- THE SHIPPED P.W7 COMMIT IS A MISNOMER — commit 97afd32 'impl(P.W5/W6/W7 Band C): demo-fleet polish' touched ONLY demo/easing/EasingSidebar.vue (+184 lines: telemetry + name-that-curve egg). It did NOT: build DemoControlPoint.vue, author proof-easing-curve-editor.mjs, promote the 
- NO-LEGACY VIOLATION (terminal-able in Q): scripts/proof-control-point-live.mjs is dead legacy — its premise (a glass-ui GlassControlPoint component) was killed by BC (`grep GlassControlPoint node_modules/@mkbabb/glass-ui/dist/` → zero). O.W5 was chartered to RETIRE it (O/PROGRESS
- DM-2 is an ABSOLUTE TERMINAL at extreme risk: O/PROGRESS.md:210 records DM-2 GlassControlPoint→DemoControlPoint as 8 carries (E,F,G,H,I,J,K,L,M→O) under P-inv-28 with 'no 9th ride under any scenario'. O charters it as the forbidden-8th-carry BUILD-IN at O.W5 — but O.W5 was NEVER 
- STRENGTH: the substrate is genuinely solid and the design is well-grounded. drag2D's per-axis architecture (two one-axis Draggables, drag-2d.ts) is the CORRECT substrate for the hero stage's non-uniform `preserveAspectRatio="none"` (EasingHeroStage.vue:54) because the per-axis CT

**Deferred/chronic terminalized:**
- DM-2 GlassControlPoint→DemoControlPoint (8-tranche P-inv-28 ABSOLUTE terminal, born E, no 9th ride) — O.W5 chartered the build-in but never implemented; P.W7 in → **Q.W-CONTROLPOINT (NOW) — build demo/@/components/custom/DemoControlPoint.vue over LIGHT drag2D (springOptions:{dampingFr**
- P.W7 DemoControlPoint chain — the easing curve-editor design layer (hero promotion, critically-damped drag, diff-ghost, writable numeric readout, closed-form vi → **Q.W-EASING-EDITOR (NOW, DAG-after Q.W-CONTROLPOINT) — implement P.W7 S1-S5 verbatim; author scripts/proof-easing-curve-e**
- drag2D RE-SCOPE keeper (CONTRIVANCE-AUDIT.md:48) — drag2D/Drag2DHandle exported from the barrel with ZERO live demo consumer; the audit RE-SCOPED it as 'keep if → **DISCHARGED-BY Q.W-CONTROLPOINT — DemoControlPoint.vue becomes the live drag2D consumer; record the discharge in the Q PR**
- unify-all-demo-drag-handles-onto-drag2D follow-on (P.W7.md:162, CONTRIVANCE-AUDIT.md:32 SIMPLIFY verdict — drop the aspirational proof:drag-primitive-unified ga → **Q-LEDGER BOOK (no wave) — per CONTRIVANCE-AUDIT.md:32, record as a BOOK note WITHOUT a named-gate obligation. Each surfa**

**Proposed waves:**
- [NOW] **Q.W-CONTROLPOINT** — Build demo/@/components/custom/DemoControlPoint.vue over LIGHT drag2D (the O.W5 substrate that never landed): SVG circle + control-line, drag2D(handleEl,{x,y}) with springOptions:{ · gate: proof:demo-control-point (NEW, scripts/proof-demo-control-point.mjs) — born-RED TODAY (DemoControlPo
- [NOW] **Q.W-EASING-EDITOR** — Implement P.W7.md S1-S5 verbatim over the Q.W-CONTROLPOINT handle: S1 critically-damp the drag (pure demo construction, springOptions confirmed passable drag.ts:56→:169); S2 promot · gate: proof:easing-curve-editor (NEW, scripts/proof-easing-curve-editor.mjs) — born-RED TODAY on 4 verifie

**Friction pre-empted:**
- ORDERING FRICTION (the lane's named concern) — Q.W-EASING-EDITOR is HARD DAG-blocked on Q.W-CONTROLPOINT: P.W7.md:194 states both DemoControlPoint.vue AND proof-demo-control-point.mjs must exist befor
- STALE-GATE FRICTION — if Q.W-CONTROLPOINT builds DemoControlPoint but does NOT delete scripts/proof-control-point-live.mjs in the SAME wave, the dead GlassControlPoint-premise gate lingers and re-intr
- GATE-DUPLICATION FRICTION — proof:easing-curve-editor's hero-editable clause must NOT re-implement the existing scripts/proof-easing-editor-live.mjs drag-reshapes-curve assertion (FULL-LOOP-LEDGER P.W
- PAINTER-DISCIPLINE REGRESSION RISK — promoting handles to the hero must not pull the imperative dot-painter (useEasingDemo.ts:189-228 registerDotPainter, off the Vue render graph) back onto the 60Hz r

---

## B2-pw8-nstage-mobile

**Verdict:** P.W8's NOW layer (mobile scroll-snap carousel + typed-directional VT + proof:scene-switcher-mobile) was correctly DEFERRED at the 4.4.0 ship (IMPL-RUN-BOARD names it 'bigger demo builds') and is the spine of my lane's Q work. Ground truth confirms every born-RED claim: zero max-width across the switcher subtree, the directionless startViewTransition at useSceneTransition.ts:32, and proof:scene-switcher-mobile absent. The DEV spec is sound and modern-web-grounded (all 3 cited guides corpus-confir

**Findings:**
- GAP (THE shelf-driver, CONFIRMED born-RED): mobile is ENTIRELY unbuilt across the scene-switcher. grep max-width over demo/app/ returns ONLY CubeScene.vue:1 (a scene-internal rule, NOT the switcher); the scene-stage subtree on n-stage-impl carries ZERO max-width (only @media pref
- GAP (CONFIRMED born-RED): the scene-switch is DIRECTIONLESS. demo/app/useSceneTransition.ts:32 calls startViewTransition(() => mutate(id)) with no types. The dock order carries no spatial meaning; NI-1 (typed-directional VT) is left on the floor.
- GAP (CONFIRMED by absence): scripts/proof-scene-switcher-mobile.mjs does NOT exist; it is absent from the package.json gate roster (only proof:scene-transition-perf + proof:mobile-single-page + proof:live-session-mobile cover adjacent surfaces, none cover the switcher carousel no
- STRENGTH (regression-DOWN on the spec's dependency claim): glass-ui 4.0.1 (installed) ALREADY ships startViewTransition(mutate, { types }) AND navigate(go, { types }) per node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts:6-19,57-74 — types is feature-de
- STRENGTH: scroll-driven view-timeline is genuinely net-new — grep animation-timeline/view-timeline over demo/ (excluding /dist/) returns ZERO hits. The @supports floor pattern is already established in the demo (anchor-name in @/styles/style.css + design-idioms.css), so the manda
- SCENE-MACHINE FRICTION (the precise seam): useSceneTransition(mutate, sceneHost) does NOT receive the current scene id, and scenes.ts exports NO sceneIndex(id) helper (only sceneMap for id→descriptor + the ordered scenes/allScenes arrays). To compute sign(targetIndex − currentInd
- REUSE STRENGTH (un-noted by the spec): n-stage-impl:StageArrows.vue already implements prev/next/fire(dir) directional semantics (lines 34-35,119-123) with aria-labels — the direction vocabulary the unshelf (Arm B/C) needs already exists in the shelved code, and matches the forwa
- CONTRIVANCE-RISK (the keystone trap, spec already guards it): the mobile-layout clause MUST bite RENDERED 390px geometry (getBoundingClientRect within [0,390]±bleed + no chrome overlap), NOT a source-grep that a bare @media(max-width:720px) rule would false-green. The prototype's
- STRENGTH: the harness substrate is fully present — scripts/lib/demo-driver.mjs withPage forwards opts.context to browser.newContext (viewport/isMobile/hasTouch, line 508,534-537), and navToScene already drives real cross-scene navs (used by proof:scene-transition-perf:254-257). T
- GATED correctness: the S4 unshelf is correctly GATED on the glass-ui BC cut + constellation re-pin (n-stage-impl carries stale ^0.9.0 parse-that/^0.13.0 value.js/~4.0.0 glass-ui pins it must rebase off). The CONTRIVANCE-AUDIT (line 49) names Arm C (enhance dock Select + SpringPro

**Deferred/chronic terminalized:**
- Mobile scene-switcher build (THE D6 shelf-driver) — the native scroll-snap carousel + scroll-driven view-timeline falloff; zero max-width across the switcher su → **Q.W-MOBILE-SWITCHER (NOW) — builds S1: the phone-narrow native scroll-snap carousel (useScrollSnapScene composable + the**
- Typed-directional scene-switch VT (NI-1) — the directionless cross-fade at useSceneTransition.ts:32 → **Q.W-VT-DIRECTIONAL (NOW) — builds S2: pass {types:[delta>0?'forward':'backward']} via the ALREADY-PRESENT glass-ui 4.0.1**
- proof:scene-switcher-mobile gate (absent today) — the keystone observable-truth gate for mobile-layout + vt-directional → **Q.W-SCENE-SWITCHER-MOBILE-GATE (NOW, gate-FIRST) — authors scripts/proof-scene-switcher-mobile.mjs born-RED BEFORE the b**
- N-Stage unshelf decision (DM-24 / O.W15) — the ~3,500-LOC n-stage-impl branch shelved on the BC cut + stale pins; the 'grows from the trigger' stage-portal morp → **Q.W-NSTAGE-UNSHELF (GATED on the glass-ui BC cut + re-pin) — the full terminal SPEC NOW: gate-first proof:n-stage-bounda**

**Proposed waves:**
- [NOW] **Q.W-SCENE-INDEX** — Add the ordered-index seam: export sceneIndex(id):number (or an ordered id list) from demo/app/scenes.ts over allScenes, and thread currentSceneId into useSceneTransition so the co · gate: proof:scene-switcher-mobile vt-directional clause is UNBUILDABLE until the composable can read both 
- [NOW] **Q.W-SCENE-SWITCHER-MOBILE-GATE** — Author scripts/proof-scene-switcher-mobile.mjs (gate-FIRST, born-RED), runtime over the built dist via withPage(context:{viewport:{width:390,height:844},isMobile:true,hasTouch:true · gate: node scripts/proof-scene-switcher-mobile.mjs exits 1 TODAY: at 390px there is no scroll-snap scrolle
- [NOW] **Q.W-VT-DIRECTIONAL** — Build S2: compute the directional type from the scene-index delta and pass {types:[delta>0?'forward':'backward']} through the EXISTING glass-ui 4.0.1 startViewTransition(mutate,{ty · gate: proof:scene-switcher-mobile vt-directional GREEN: a real cube→amiga nav reads active type 'forward',
- [NOW] **Q.W-MOBILE-SWITCHER** — Build S1: the phone-narrow native scroll-snap carousel — useScrollSnapScene composable + a scroller (overflow-x:scroll; scroll-snap-type:x mandatory) of preview cards (scroll-snap- · gate: proof:scene-switcher-mobile mobile-layout GREEN: at 390px a horizontally-snapping scroller renders, 
- [GATED] **Q.W-NSTAGE-UNSHELF** — The full GATED terminal SPEC for the N-Stage unshelf (DM-24/O.W15): (Arm A) author proof:n-stage-boundary (bundled demo import-graph walk rooted at SceneStage.vue, HEAVY engine.ts/ · gate: proof:n-stage-boundary exits 1 on a planted heavy import in a stage module; the stage-portal VT obse

**Friction pre-empted:**
- FRICTION: Q.W-VT-DIRECTIONAL needs sign(targetIndex−currentIndex), but useSceneTransition(mutate,sceneHost) does NOT receive the current scene id and scenes.ts exports no sceneIndex(id). If built ad-h
- FRICTION: the keystone mobile-layout clause could regress to a source-grep ('a @media rule exists') that false-greens over a still-colliding 390px layout (the exact prototype trap — the radius-tweak r
- FRICTION: Q.W-NSTAGE-UNSHELF is GATED on the glass-ui BC cut + re-pin (n-stage-impl carries stale pins) — if left as a bare 'deferred' it would spawn a mid-tranche scramble when the cut lands. PRE-EMP
- FRICTION: the top-layer toolbar caveat (the Popover-API stage paints above the normal-layer Theme/Reduce-motion toggles — harden-findings.md:[med] TOOLBAR UNREACHABLE) is a recorded UNSHELF preconditi

---

## B2-ow7-enginesplit

**Verdict:** KEEP — O.W7 is a REAL elegance transposition, not churn, but ONLY when scoped to the standalone-play loop (NOT interpFrames/at/advanceTo, which are the public sampling/advance API external drivers consume) and lifted as a bound free-function host (the engine-composition.ts precedent), NOT a Playhead value-object (P.md DROPPED that as pure indirection). It cures the single largest named structural debt (DF-11-A, deferred D→M→P) at the seam the D.W4 audit named, relieving BOTH the 1400 file cap AN

**Findings:**
- GROUND-TRUTH CONFIRMED: engine.ts is 1397L (verified wc -l), 3L under the proof-decomposition.mjs LIBRARY_CEILING_OVERRIDE cap of 1400 (line 132). The KeyframesAnimation class body is 1088L vs proof:engine's ANIMATION_CLASS_CEILING=1100 — only 12L of headroom, a chronicity tell: 
- THE NAMED BLOCKER IS ALREADY DISCHARGED: P.W11 SHIPPED. utils.ts:52 now reads `const FN_NAME_MAP = new WeakMap<ValueUnit, string>()` (not the foreign-ValueUnit Symbol). proof:no-foreign-symbol-stamp is in proof:hygiene. The S8 'split-blocking coupling' the O.W7 spec cited (utils.
- REGRESSION DIRECTLY IN MY LANE'S BLAST RADIUS — proof:decomposition is currently RED on HEAD (df78088, exit 1). The P impl drive (commit 495484a, 'SoA compositor') grew group.ts from 812L to 1083L — PAST its 820L override cap — and added load-engine.ts (564L) + frame-compiler.ts 
- THE WAVE'S group.ts S5 PREMISE IS STALE. O.W7 §S5 and the FULL-LOOP-LEDGER both assert group.ts is '812L under its 820 override (8L headroom)'. That is FALSE post-impl: group.ts is 1083L, 263L OVER its override. The group-layer-springs.ts externalization (10974 bytes, exists) was
- THE SEAM SUBTLETY IS REAL AND DECISIVE: interpFrames is NOT a private playback method — it is the engine's PUBLIC sampling API consumed externally by group.ts:358/929, group-layer-springs.ts:201/221, ingest.ts:268, morph-svg.ts:281, sequence.ts:300. advanceTo is likewise driven b
- ELEGANCE-VS-CHURN VERDICT — IT IS A REAL TRANSPOSITION, NARROWLY. The standalone-play machine mutates ~12 instance fields (startTime/t/iteration/paused/pausedTime/done/started/reversed/_playingPromise/resolvePromise/_waAnimations/waapiIneligibleReason) and owns this.playback. A p
- CONTRIVANCE RISK IF MIS-SCOPED: passing `this` to a free function and re-calling 18 methods as `playRAF(this)` is a thin win if it is ONLY a file-line move — the danger is 'extract-for-line-count' the proof:engine §Mandate explicitly forbids. The legitimacy test is the DISCRIMINA
- STRENGTH: the extraction PRECEDENT is proven and idiomatic — engine-composition.ts/engine-options.ts/engine-css-metadata.ts are three colocated INTERNAL modules engine.ts already statically imports and never re-exports. engine-playback.ts is the fourth instance of an established 
- P.md and IMPL-RUN-BOARD already converged on the HONEST framing: O.W7 is the FILE-SPLIT, the Playhead value-object is DROPPED (P.W3 S4 retired), and the deferred-follow-ups list calls it 'risky re-org' / 'internal cleanliness/infra.' The owner's Q precept (NO deferrals, every chr

**Deferred/chronic terminalized:**
- DF-11-A — the FULL engine-seam transposition (the 1100-line god-object lifted off the frame-compile facade); deferred D→E→F→G→H→I→J→K→L→M→O→P, the single most-d → **Q.W-ENGINE-SPLIT (NOW phase) — the file-split lands this tranche: lift the standalone-play loop into engine-playback.ts **
- DF-11-B — the co-deferred group.ts compositor-seam split (P-inv-28), now AGGRAVATED: group.ts grew from 812L to 1083L (263L over its 820 cap) via the P.W2 SoA c → **Q.W-GROUP-DECOMP (NOW phase) — must precede or accompany Q.W-ENGINE-SPLIT: extract the SoA fold machinery (_soaPlans/_co**
- The proof:decomposition RED baseline (load-engine.ts 564L + frame-compiler.ts 552L over the 550L base, committed at HEAD df78088) — a regression the P impl driv → **Q.W-DECOMP-GREEN (NOW phase) — restore proof:decomposition to green BEFORE Q.W-ENGINE-SPLIT authors its born-RED witness**

**Proposed waves:**
- [NOW] **Q.W-DECOMP-GREEN** — Restore proof:decomposition to a clean green baseline: split or rationale-override the three files the P impl drive pushed over cap (group.ts 1083 / load-engine.ts 564 / frame-comp · gate: proof:decomposition exits 1 TODAY (verified live, naming group.ts:1084L / load-engine.ts:565L / fram
- [NOW] **Q.W-GROUP-DECOMP** — Discharge DF-11-B: extract the P.W2 SoA fold machinery (_soaPlans/_compositeBuf/SoALayerPlan, group.ts:44-185 + frame-loop) into an INTERNAL group-soa.ts beside group-layer-springs · gate: proof:decomposition group.ts clause exits 1 at 1084L > 820 (live today); plus a discriminating-bite 
- [NOW] **Q.W-ENGINE-SPLIT** — Lift the STANDALONE-PLAY LOOP (play/pause/resume/toggle/stop/reset/settle/paintRest/fill*/onStart/onEnd/advanceTo/_advance/_frame/_renderFrame/_resolvePlay/_playRAF/_playWAAPI/_can · gate: proof:decomposition with the engine.ts:1400 override REMOVED → exit 1 naming engine.ts:1397L over th

**Friction pre-empted:**
- FRICTION: if Q.W-ENGINE-SPLIT runs while proof:decomposition is RED for OTHER files (group/load-engine/frame-compiler), the born-RED witness (override-removed → exit 1 on engine.ts) cannot be isolated
- FRICTION: the wave spec's §S1 lists interpFrames inside 'concern 3 (the lifecycle/playback machine)' in one place but correctly in 'concern 1 facade' in another — an implementer reading §S1 literally 
- FRICTION: O.W9 (no-legacy: drop the @deprecated `Animation` alias on engine.ts:1205 + migrate 22 demo consumers) touches engine.ts in a disjoint region but MUST sequence before the class-body move so 
- FRICTION: the host-passing style (`playFrame(anim, t)` re-calling 18 methods) risks degrading the zero-alloc steady-state path if the bound _frame callback re-allocates a closure per loop start. Today
- FRICTION: P.md DROPPED the Playhead value-object but a future implementer might 're-deepen' the lift into a typed handle for elegance, re-introducing pure delegating-accessor indirection (smell-test Q

---

## B3-chronic-ledger (the P-inv-28 chronic-ledger sweep)

**Verdict:** The impl drive made real chronic progress (DM-3 fromMorphSVG, DM-5 S9 parse-that, and the S8 WeakMap realm-clean belt-exit are GENUINE terminals — three 4-to-7-tranche chronics closed) but it also left the ledger in a deceptive state that violates the owner's NO-DEFERRAL precept. THREE structural failures dominate: (1) DM-2 DemoControlPoint is a NINTH carry — declared 'ABSOLUTE FINAL' at both O.W5 and P.W7 yet never built, the single clearest P-inv-28 violation; (2) proof:chronic-closure has bee

**Findings:**
- DM-3 fromMorphSVG GENUINELY EXITED (strength). src/animation/morph-svg.ts (13.2KB) exports fromMorphSVG + MorphSVG over the single value.js PathGeometry edge (line 45); rides loadAnimationEngine() (HEAVY); test/morph-svg.test.ts has 13 tests; proof:morphsvg-consume PASSES (live: 
- DM-2 DemoControlPoint is a P-INVARIANT-28 VIOLATION — a NINTH carry into Q. Declared 'ABSOLUTE FINAL / forbidden-8th-carry CLOSED' at O.W5 (deferred-ledger-O.md:94) AND 'ABSOLUTE FINAL' at P.W7 (deferred-ledger-P.md:177), but grep -rn 'DemoControlPoint' demo/ src/ → ZERO. The sub
- DM-22 named-selector NaN-frame is EXPLICITLY DEFERRED in shipped code. frame-compiler.ts:449 reads verbatim: 'P.W9 (DM-22 named-selector NaN-frame) — DEFERRED to a follow-up wave'; lines 453-460 explain the agent's parse-time throw broke the L.W1 S4 opaque-ingest contract and was
- S8 FN_NAME has a SPLIT STATE — the realm-cleanliness TERMINAL landed but the gate still flags it PENDING. utils.ts:52 is now a kf-MODULE-LOCAL WeakMap<ValueUnit,string> (FN_NAME_MAP); proof:no-foreign-symbol-stamp PASSES live ('the realm is clean, zero kf-owned own-property on va
- S9 parse-that direct import GENUINELY EXITED (strength). utils.ts:9 now imports parseCSSSubValue from value.js (1.1.0 VJ-L3); the @mkbabb/parse-that production dep is REMOVED from package.json (undefined); proof:boundary PASSES with '0 direct @mkbabb/parse-that specifier(s) acros
- S1 aria-orientation suppress is STILL CHRONIC + the gate is FALSE-RED. The two suppress sites PERSIST: demo/spring/SpringSidebar.vue:43 and demo/@/.../AnimationControls.vue:72 (:aria-orientation="undefined"). glass-ui is pinned ~4.0.0 / installed 4.0.1, and tabs.js:306 STILL emit
- S2 dock (RF-17) is STILL CHRONIC + ALSO FALSE-RED (same gate bug). TransportDock.vue:15/151/196/342/348/358/361/366/373 still carry pointerHandled/onPlayPointerDown. glass-ui dock.js DOES contain useDockClickIntegrity (the root fix) in 4.0.1, but the S2 arm (proof-workaround-dele
- proof:chronic-closure SUBSTRATE RE-POINT WAS NEVER EXECUTED — the meta-gate is auditing 3-tranche-stale paperwork. scripts/proof-chronic-closure.mjs:114 STILL reads CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md. The M.WZ atomic re-point (lane-28 §10), the O.WZ re-point, and the P.
- O.W9 / the 5.0.0 no-legacy cut is UNDONE — the @deprecated runtime ALIASES persist. index.ts:57 (ScrollTimeline), :64 (ScrollTimelineOptions), :218 (Animation), load-engine.ts:26/127/258 (Animation) are still LIVE value exports. kf shipped 4.4.0 (MINOR) precisely because the brea
- DM-7 keyframes-vue at chronicity-4-belt is UNFIRED: npm show @mkbabb/keyframes-vue → E404; packages/keyframes-vue/package.json is built (0.1.0) with peer >=4.3.0. P ledger said 'P-inv-28 belt FIRES THIS TRANCHE, no 5th carry' — it carried. USER-DOMAIN but the peer-floor bump to >

**Deferred/chronic terminalized:**
- DM-2 GlassControlPoint / DemoControlPoint (born E, NOW NINTH carry — P-inv-28 violation: declared ABSOLUTE-FINAL twice, never built) → **Q.W-CTRLPT (NOW): build DemoControlPoint.vue over the LIGHT drag2D export with springOptions:{dampingFraction:1} (critic**
- DM-22 named-selector NaN-frame (explicitly deferred in frame-compiler.ts:449; the agent's parse-throw was reverted) → **Q.W-NANFRAME (NOW): implement the deferred-resolution + PLAY-time guard cure (NOT a parse-throw — that broke L.W1 S4 opa**
- DM-5 S1 aria-orientation suppress (still chronic; glass-ui 4.0.1 has no guard; gate FALSE-RED) + DM-1/S2 dock RF-17 (chronicity 7; gate FALSE-RED) → **Q.W-WKAROUND-GATE (NOW, gate-fix) + Q.W-GLASSUI-CONSUME (GATED on glass-ui BC cut). FIRST fix the gate: add apiPresent t**
- DM-5 S8 FN_NAME clone-restamp residual (realm-clean TERMINAL landed via WeakMap, but ceremony stays + gate PENDING on unshipped VJ-L1) → **Q.W-S8-CLOSE (NOW gate-honesty + DISPATCH): the P-inv-28 BELT is satisfied (proof:no-foreign-symbol-stamp GREEN) — RE-CL**
- proof:chronic-closure substrate stuck at L/PROGRESS.md (M.WZ/O.WZ/P.WZ re-points all skipped — the closure machine is itself chronically deferred) → **Q.WZ (NOW close motion): the atomic re-point in ONE commit — scripts/proof-chronic-closure.mjs:114 CHRONIC_LEDGER L->Q/P**
- DM-16 5.0.0 cut + O.W9 deprecated-alias drop (Animation/ScrollTimeline/ScrollTimelineOptions still live) + DM-7 keyframes-vue publish (E404, peer floor stale) → **Q.W-5.0.0 (NOW author + USER-DOMAIN publish): drop the 3 runtime aliases (index.ts:57/64/218, load-engine.ts:26) + migra**

**Proposed waves:**
- [NOW] **Q.WZ-LEDGER-REPIN** — Atomic re-point proof:chronic-closure CHRONIC_LEDGER from the 3-tranche-stale L/PROGRESS.md to docs/tranches/Q/PROGRESS.md + author the canonical Q 'Open deferrals' substrate cover · gate: proof:chronic-closure: 3 planted malformed Q rows (FOLD-citing-source-shape-gate, phantom-version HA
- [NOW] **Q.W-CTRLPT** — Build DemoControlPoint.vue over the LIGHT drag2D export (springOptions:{dampingFraction:1}, critically damped) + dogfood it as the easing bezier handle, retiring the bespoke ref/CT · gate: proof:demo-control-point: born-RED on absent component; GREEN when DemoControlPoint mounts, a live d
- [NOW] **Q.W-NANFRAME** — Cure DM-22 named-selector NaN-frame via deferred-resolution + a PLAY-time guard throwing the typed NAMED_SELECTOR_NO_TIMELINE (NOT a parse-throw — preserve the L.W1 S4 verbatim rou · gate: proof:named-selector-no-nan: a named-selector keyframe yields a structured throw at play OR a non-Na
- [NOW] **Q.W-WKAROUND-GATE** — Fix the S1/S2 FALSE-RED: add apiPresent content-present probes (S1=role=group-conditional aria guard in installed tabs.js; S2=useDockClickIntegrity in installed dock.js) + re-class · gate: proof:workaround-deletion: S1 reports PENDING (guard absent from installed dist, not FALSE-RED on a 
- [GATED] **Q.W-GLASSUI-CONSUME** — On the glass-ui BC cut: re-pin, delete S2 dock interim (TransportDock.vue 9 sites) atomically, and delete S1 suppress (SpringSidebar.vue:43 + AnimationControls.vue:72) once the SFC · gate: proof:workaround-deletion S1+S2 GREEN (ABSENT) after re-pin; proof:peer-satisfied GREEN; if BC slips
- [NOW author / DISPATCH publish (USER-DOMAIN)] **Q.W-5.0.0** — Drop the @deprecated runtime aliases (Animation/ScrollTimeline/ScrollTimelineOptions) + migrate demo consumers + cut 5.0.0 (breaking) + bump keyframes-vue peer floor to >=5.0.0 and · gate: proof:no-deprecated-alias (grep @deprecated runtime export across src/animation → 0) + proof:keyfram
- [DISPATCH] **Q.W-S8-DISPATCH** — Re-send the KF-TO-VALUEJS VJ-L1 flatLeaf ask (clone()-preserved provenance) to retire the S8 clone-restamp ceremony residual — the only remaining S8 inferiority after the realm-cle · gate: on value.js publishing VJ-L1: proof:workaround-deletion S8 ceremony-clause GREEN (the FN_NAME_MAP cl

**Friction pre-empted:**
- FRICTION: Q.WZ-LEDGER-REPIN would normally happen LAST (the close motion), but every other Q chronic wave needs the re-pointed ledger to be gate-visible — if Q.WZ is last, the chronics land 'invisibly
- FRICTION: Q.W-CTRLPT (DemoControlPoint) and the easing-demo dogfood are coupled — building the primitive but NOT retiring the bespoke easing handle math would leave a dual implementation (a no-legacy 
- FRICTION: Q.W-GLASSUI-CONSUME (S1/S2) is GATED on the glass-ui BC cut, which is cross-repo and may slip — the classic chronic-spawning point (it has slipped I->J->K->L->M->O->P already). PRE-EMPT: pre
- FRICTION: Q.W-5.0.0 (alias drop) breaks the 22 demo consumers and keyframes-vue, and is USER-DOMAIN to publish — a half-done alias drop (src cut but consumers unmigrated) would RED the build mid-tranc
- FRICTION: Q.W-NANFRAME could tempt a parse-time throw again (the impl drive already made + reverted this mistake), which would re-break L.W1 S4 opaque-ingest and spawn a revert + re-defer. PRE-EMPT: t

---

## B3-contrivance-recheck

**Verdict:** PASS-WITH-RESIDUE. The shipped impl-drive is contrivance-DISCIPLINED on the two highest-risk paths: Typed-OM was honestly KILLED on a measured 0.68× default-path regression (no permanent dual-path shipped), and the SoA compositor correctly confines its perf transposition to the non-default add/weighted arms with bit-identical output and a name-match gate that rejects the transplanted 3.86×. No no-legacy violation was introduced (parse-that prod-dep removed, foreign-Symbol retired to WeakMap). BU

**Findings:**
- STRENGTH — the MEASURE-FIRST discipline HELD on the two highest-risk shipped paths. Typed-OM was correctly KILLED: scripts/typed-om-decision.json records tomOverString=0.68 on the DEFAULT multi-property shape (real Chromium, playwright-core 1.60.0); the permanent dual-path was NO
- STRENGTH — the SoA compositor correctly attaches its perf path to the NON-DEFAULT add/weighted arms ONLY; the default `replace` arm at group.ts:368-377 is dispatch-free and byte-unchanged (useSoA never engages for a replace-only group — empty plan). Output is bit-identical (maxEr
- CONTRIVANCE RESIDUE (MODERATE) — TRIPLE-VALUED PROVENANCE + DUAL DECISION-JSON for ONE path. Three different SoA ratios coexist: group-soa-decision.json (committed spike) says 3.764×/3.703× (isolated blend); soa-composite-decision.json (gate-written, 2026-06-23T14:40) says 1.973×
- GAP (MODERATE) — proof:wave-charter WAS NEVER AUTHORED. CONTRIVANCE-AUDIT.md:53 designates it a KEEP and 'the durable enforcing artifact' (the docs-and-presence gate that bites a [radical] wave with no smell-test header, a perf wave whose bench baseline name-mismatches its declar
- CONTRIVANCE TELL (MODERATE) — the spring-heatmap 507× is an ASSERTED number citing a DELETED bench. FULL-LOOP-LEDGER.md:133 + P.W6.md:92 + SpringHeatmap.vue:8,95 + SpringSidebar.vue:77 all cite `spring-heatmap-probe` (2026-06-22) for the 272×/507× claim, but the bench is `/tmp/sp
- INCOMPLETION (not contrivance) — emerging-CSS resolve-values.ts shipped ONLY the Phase-1 element-INDEPENDENT arm (if(supports/media), spring()); Phase-2 (if(style(--p)), sibling-index/count) is a typed-but-EMPTY seam (resolve-values.ts:62-66 declares the fields, never resolves th
- STRENGTH — no no-legacy violation introduced by the drive: the parse-that PRODUCTION dependency was genuinely REMOVED (S9 → parseCSSSubValue; grep confirms package.json carries no @mkbabb/parse-that), and the foreign-Symbol stamp on value.js ValueUnit was retired to a kf-internal

**Deferred/chronic terminalized:**
- proof:wave-charter — the durable smell-test enforcer gate (CONTRIVANCE-AUDIT.md:53 KEEP) never authored; the smell-test lives only as prose → **Q.W-CHARTER (NOW) — author scripts/proof-wave-charter.mjs as a docs-and-presence gate: scan every docs/tranches/*/waves/**
- SoA dual decision-JSON + triple-valued provenance (group-soa-decision.json stale 3.7× vs soa-composite-decision.json live 1.97×/2.32× vs group.ts:163 comment ci → **Q.W-SOA-PROV (NOW) — delete the stale scripts/group-soa-decision.json (the spike artifact, superseded by the gate-writte**
- spring-heatmap 507× cited from a deleted /tmp bench; no checked-in bench or decision-JSON → **Q.W-HEATMAP-EVID (NOW) — promote /tmp/spring-heatmap-probe.mts to bench/spring-heatmap.bench.ts (closed-form overshoot v**
- emerging-CSS Phase-2 element-AWARE arm (if(style(--p)), sibling-index(), sibling-count()) shipped as an empty typed seam in resolve-values.ts:62-66 → **Q.W-RESOLVE-P2 (GATED on value.js parser support for these productions) — implement the element-aware resolve arm at the**

**Proposed waves:**
- [NOW] **Q.W-CHARTER** — Author proof:wave-charter — the docs-and-presence gate that enforces the 7-question smell-test header + target-name-matched born-RED bench + no-undecided-dual-path on every PERF/[r · gate: proof:wave-charter — born-RED today (no such script; the SoA triple-provenance + heatmap deleted-ben
- [NOW] **Q.W-SOA-PROV** — Collapse the SoA provenance to ONE decision-JSON: delete stale group-soa-decision.json, repoint group.ts:163 + all docs to the live soa-composite-decision.json figure (1.97×/2.32×) · gate: proof:wave-charter single-decision-per-target clause — born-RED while two SoA decision-JSONs exist f
- [NOW] **Q.W-HEATMAP-EVID** — Promote /tmp/spring-heatmap-probe.mts to bench/spring-heatmap.bench.ts + spring-heatmap-decision.json; make proof:spring-heatmap READ the measured ratio, not just source-presence. · gate: proof:spring-heatmap (extended) — born-RED today: it asserts no checked-in bench/decision-JSON backs
- [GATED] **Q.W-RESOLVE-P2** — Implement the emerging-CSS element-AWARE arm (if(style(--p))/sibling-index()/sibling-count()) at the getComputedValue seam, terminalizing the empty Phase-2 typed seam in resolve-va · gate: proof:emerging-css-resolve-element — born-RED: a fixed corpus of if(style(--p)) + sibling-index() ke

**Friction pre-empted:**
- Q.W-CHARTER would itself spawn mid-tranche friction: authoring the gate AFTER the other Q waves are chartered means those waves' headers won't carry the MEASURE-FIRST line the gate demands, forcing a 
- Q.W-SOA-PROV risks a mid-tranche deferral if the question 'which ratio is canonical' reopens the spike: the isolated-blend 3.7× and the Amdahl-scoped 2.5× and the gate's 1.97× are all real measurement
- Q.W-HEATMAP-EVID could spawn an accuracy-relitigation deferral (the closed-form settle-time carries 26% mean error per FULL-LOOP-LEDGER.md:133; only overshoot is <1%). PRE-EMPT by locking the wave to 
- Q.W-RESOLVE-P2 is GATED on value.js parser support for if(style(--p))/sibling-index()/sibling-count(); if that support is absent it would spawn a mid-tranche cross-repo dispatch. PRE-EMPT by filing th

---

## B4-prompt-recap — the FULL PROMPT RECAP from the constellation campaign through the impl drive to this audit ask

**Verdict:** PARTIAL with two DROPPED-flag obligations. The impl drive genuinely shipped the core DAG (parse-that 0.12.0 + value.js 1.1.0 + kf 4.4.0 + verified redeploy) and closed real chronic work in-realm (S8 WeakMap, S9 parse-that-dep removal, _styleOut, SoA, heatmap, fromMorphSVG) — these are ADDRESSED and must be recorded as such, not re-opened. But 'totality' was NOT achieved: ~10 planned waves deferred, and TWO crossed precept lines stand out as the sharpest Q obligations — (1) the keyframes-vue P-in

**Findings:**
- CONSOLIDATED RECAP TABLE (the deliverable). The chain A->P is terminal in prompt-recap-P.md (verified held, zero re-litigation). The NEW prompt rows the impl drive generated, each with a terminal verdict:
- PROMPT [impl-1] 'complete the plan IN TOTALITY; publish/push/deploy authorized' (owner, 2026-06-22) -> PARTIAL. The DAG shipped end-to-end (parse-that 0.12.0 + value.js 1.1.0 + kf 4.4.0 + redeploy verified) but ~10 planned waves did NOT land and were honestly logged as DEFERRED i
- PROMPT [impl-2] 'validate, don't abrogate' / 'prototype + research NOW' (owner, 2026-06-22) -> ADDRESSED. SoA spike RAN (5632840/b42c097, ADOPT 2.54x/2.35x bit-identical), Typed-OM spike RAN (e0547cd, KILL 0.69x), emerging-CSS researched (78e201f). The measure-first method gave o
- PROMPT [impl-3] 'novel CSS belongs in our grammar; library leads the platform' (owner, 2026-06-22) -> PARTIAL. P.W13 resolve-values.ts shipped the ELEMENT-INDEPENDENT arm ONLY (if(supports/media)+spring() NOW). The element-DEPENDENT arm (if(style(--p)), sibling-index(), sibling-c
- PROMPT [impl-4] 'harden, prototype, brainstorm, prune EVERY item' (the full-tranche loop, owner) -> ADDRESSED (docs, bcbbbda — 67 items, 33 changed, evidence-backed FULL-LOOP-LEDGER.md). The loop's verdicts (heatmap ADOPT 272-507x, WeakMap S8 terminal, fromMorphSVG proven, PT-B4 
- PROMPT [standing] the immutable 7-clause mandate (NO workarounds/gestalt/no-legacy/fold-all-chronics/recap-all/dev-or-impl) -> carried; but the impl drive crossed two no-legacy/chronic lines (see DROPPED-FLAG findings).
- DROPPED-FLAG #1 (the sharpest finding): DM-7 keyframes-vue was declared a P-inv-28 BELT item at chronicity 4 with terminal 'USER-DOMAIN publish at P.WZ, NO 5th carry' (deferred-ledger-P.md:68,183). The impl drive PUBLISHED kf 4.4.0 (c69bbb0) WITHOUT publishing keyframes-vue (stil
- DROPPED-FLAG #2: the planned 5.0.0 cut (O.WZ no-legacy renames) did NOT happen; kf shipped 4.4.0 (MINOR) instead. This is HONEST semver (the board admits it, line 23) — but it means O.W9 (drop @deprecated Animation/ScrollTimeline aliases + migrate 22 demo consumers) is UNDONE, th
- FINDING #3 (doc-drift / record-as-built): CHANGELOG.md top entry is STILL 4.3.0 — the 4.4.0 publish never wrote a CHANGELOG entry. The impl drive shipped a published version with no changelog row. A born-RED proof:changelog-current gate would have caught this.
- FINDING #4 (strength + stale-premise correction): drag2D IS already a LIGHT static export (index.ts:88, drag.ts:462). IMPL-RUN-BOARD.md:32 says P.W7 DemoControlPoint chain is 'gated on a library drag2D LIGHT export' — that premise is now STALE: the export landed, so P.W7/O.W5 Dem
- FINDING #5 (genuine wins, record-as-built): S8 (FN_NAME->WeakMap, utils.ts:52) and S9 (parse-that dep removed, parseCSSSubValue consumed utils.ts:9) BOTH landed in-realm — two chronicity-4 belt items CLOSED. _styleOut (utils.ts:414), SoA (group.ts), portable-perf apparatus (P.W1-
- FINDING #6 (the meta-gap this lane exists to close): NO prompt-recap doc covers the impl-drive intake. prompt-recap-P.md (the latest) is dated to the DEVELOP phase and predates impl-1..impl-4. So the impl drive's prompts live ONLY in IMPL-RUN-BOARD.md + memory, never in a chain-t
- FINDING #7 (contrivance-risk, low): the proposed Q recap risks being a pure docs-restatement of the IMPL-RUN-BOARD deferred list. Counter: every Q recap row must cite a VERIFIED tree probe (file:line) as its oracle, not chain-trust the board's self-report — the board claimed 'tot

**Deferred/chronic terminalized:**
- The impl-drive prompt intake (impl-1 'totality', impl-2 'validate don't abrogate', impl-3 'novel CSS in our grammar', impl-4 'full-tranche loop') has NO chain-t → **Q.W-RECAP: author docs/tranches/Q/audit/prompt-recap-Q.md chain-trusting prompt-recap-P.md (A->P verified held), absorbi**
- DM-7 keyframes-vue — P-inv-28 belt CROSSED. Declared 'no 5th carry, terminal P.WZ' at chronicity 4; kf 4.4.0 published WITHOUT it; now chronicity 5, no terminal → **Q.W-VUE-TERMINAL: a complete terminal spec NOW — either (a) the USER-DOMAIN publish runbook (peer floor >=4.4.0, types v**
- O.W9 no-legacy alias-drop -> 5.0.0. The @deprecated Animation/ScrollTimeline/ScrollTimelineOptions aliases are STILL on the PUBLISHED 4.4.0 surface; 22 demo con → **Q.W-NOLEGACY-50: the breaking major cut — drop the 4 aliases, migrate the 22 consumers, author proof:changelog-5.0.0 bor**
- O.W7 engine.ts split (1397L, target ~900L) — the god-object un-split; the 7-tranche-named transposition still undone → **Q.W-ENGINE-SEAM: lift the playback machine into engine-playback.ts, 1397->~900L. Born-RED: proof:decomposition / engine.**
- P.W9 NaN-frame cure — explicitly DEFERRED with a code comment (frame-compiler.ts:449); the agent's parse-time throw broke the L.W1 S4 opaque-ingest contract and → **Q.W-NANFRAME: the proper cure = deferred-resolution + a PLAY-time guard (NOT a parse throw). Born-RED: a named-selector **
- P.W13 emerging-CSS Phase-2 (element-dependent arm) + @function call-inlining + contrast-color() — the resolve-values element-DEPENDENT seam is typed-but-empty ( → **Q.W-EMERGING-2 (NOW: the if(style)/sibling-index/sibling-count post-setTargets pass over the existing typed ctx seam) + **
- P.W1 lint tier (eslint-flat + dep-cruiser) — 3-tranche carry (M.W2/O.W1/P.W1), STILL absent (no config, not a devDep) → **Q.W-LINT: eslint.config.mjs (import/no-cycle + no-restricted-imports for the LIGHT boundary) + dep-cruiser; born-RED pro**
- P.W10 leaves.ts bundle-externalization TRAP — leaves.ts (124L) still duplicates value.js/math; the no-legacy cut needs the W97 math-subpath-clean clause first ( → **Q.W-LEAVES-TRAP: author proof:boundary W97 math-subpath-clean clause, then bundle-externalize @mkbabb/value.js/math (NOT**
- P.W8 N-Stage switcher + the ENTIRELY-UNBUILT mobile (the shelf-driver, DP-4) → **Q.W-NSTAGE-MOBILE: CSS scroll-snap transposition (not a patch); born-RED proof:n-stage-mobile (zero scroll-snap on 390px**
- P.W12 dock S2-delete + S1 aria-guard — cross-repo (glass-ui BC state); S1 false-RED tripwire never retargeted to a content-present probe → **Q.W-GLASSUI-CONSUME: retarget the S1 tripwire to a content-present grep NOW (the proof-script bug, deferred-ledger-P.md:**

**Proposed waves:**
- [NOW] **Q.W-RECAP** — Author prompt-recap-Q.md: chain-trust prompt-recap-P.md (A->P verified held), absorb the impl-drive intake (impl-1 totality / impl-2 validate / impl-3 novel-CSS / impl-4 full-loop) · gate: proof:prompt-recap-Q: the doc exists AND every 'ADDRESSED' row names a passing oracle (file:line or 
- [NOW] **Q.W-VUE-TERMINAL** — Terminal the CROSSED keyframes-vue P-inv-28 belt: author the USER-DOMAIN publish runbook + gate, OR an owner-ratified KILL — no 6th carry · gate: proof:keyframes-vue-published clause: registry returns a version with peer floor >=4.4.0 (GREEN on p
- [GATED] **Q.W-NOLEGACY-50** — The 5.0.0 breaking cut: drop the 4 @deprecated aliases, migrate the 22 demo consumers, author the changelog 5.0.0 entry · gate: proof:changelog-5.0.0: asserts the breaking set (Animation/ScrollTimeline/ScrollTimelineOptions alia
- [NOW] **Q.W-ENGINE-SEAM** — Split engine.ts 1397->~900L, lifting the playback machine into engine-playback.ts (the O.W7 transposition, NOT VJ-L1-gated) · gate: proof:decomposition: engine.ts <= 900L AND engine-playback.ts exists AND has zero import of the comp
- [NOW] **Q.W-NANFRAME** — P.W9 NaN-frame cure via deferred-resolution + a PLAY-time guard (the reverted parse-throw is forbidden — it broke L.W1 S4 opaque-ingest) · gate: proof:nan-frame: a named-selector frame is NOT NaN at play time AND NAMED_SELECTOR_NO_TIMELINE is th
- [NOW] **Q.W-EMERGING-2** — P.W13 Phase-2: implement the element-DEPENDENT resolve-values arm (if(style(--p)), sibling-index(), sibling-count()) over the existing typed post-setTargets ctx seam · gate: proof:emerging-css-phase2: a fixture with if(style(--p)) and sibling-index() resolves to the concret
- [DISPATCH] **Q.W-EMERGING-DISPATCH** — DISPATCH to value.js: contrast-color() parser (Baseline April 2026, HIGH — library is now BEHIND platform) + if() multibranch + @function call-parse; kf @function call-inlining GAT · gate: proof:contrast-color-consume + proof:function-inline: born-RED today (value.js 1.1.0 lacks contrast-
- [NOW] **Q.W-LINT** — P.W1 lint tier (3-tranche carry): eslint.config.mjs (import/no-cycle + no-restricted-imports LIGHT boundary) + dep-cruiser, wired to proof:hygiene · gate: proof:lint-clean: eslint+dep-cruiser run exit 0 AND config files exist; born-RED today (no config, n
- [NOW] **Q.W-LEAVES-TRAP** — P.W10 leaves.ts bundle-externalization (NOT a delete): author proof:boundary W97 math-subpath-clean, then externalize @mkbabb/value.js/math in the LIGHT build · gate: proof:boundary W97: @mkbabb/value.js/math is a declared bundle-external AND its static graph touches
- [NOW] **Q.W-NSTAGE-MOBILE** — P.W8 N-Stage + the unbuilt mobile via a CSS scroll-snap transposition; the N-Stage unshelf stays BC-dock-gated · gate: proof:n-stage-mobile: a @media(max-width:430px) scroll-snap carousel rule exists AND zero loadAnimat
- [NOW] **Q.W-DCP-BUILDIN** — Build DemoControlPoint.vue over the now-LIGHT drag2D export (DM-2 born-E ABSOLUTE BUILD-IN, the twin of the landed fromMorphSVG) + dogfood it as the easing curve-editor handle (P.W · gate: proof:demo-control-point: DemoControlPoint.vue exists AND the easing hero stage has >=2 draggable ha
- [NOW] **Q.W-GLASSUI-CONSUME** — Glass-ui consume: retarget the S1 aria tripwire to a content-present grep NOW (fix the proof-script version-probe bug), delete S2 if useDockClickIntegrity is installed, hold S1 del · gate: proof:workaround-deletion S1/S2 arms: S1 probes the installed dist for the role=group-conditional ar

**Friction pre-empted:**
- FRICTION: Q.W-RECAP cannot mark impl-1..impl-4 'terminal' until every other Q wave that owns a deferred item is CHARTERED — otherwise the recap row 'totality -> DEFERRED-TO-Q' points at nothing (the e
- FRICTION: Q.W-NOLEGACY-50 (the 5.0.0 cut) would spawn a mid-tranche deferral if the 22 demo-consumer migration is discovered to depend on the O.W7 split (renamed exports moving across files). PRE-EMPT
- FRICTION: Q.W-EMERGING-DISPATCH (contrast-color/if-multibranch/@function-call-parse) is cross-repo; if Q opens kf-only it would re-spawn the same 'value.js-P-gated' deferral the impl drive left. PRE-E
- FRICTION: Q.W-VUE-TERMINAL is USER-DOMAIN (publish or KILL is the owner's hand) — if left as a bare 'USER-DOMAIN' row it repeats the dropped P.WZ belt. PRE-EMPT: the wave must ship the COMPLETE runboo
- FRICTION: Q.W-NSTAGE-MOBILE's N-Stage UNSHELF is BC-dock-gated, but the MOBILE scroll-snap build is NOT — conflating them would gate a NOW item on a sibling. PRE-EMPT: split the wave explicitly — the 
- FRICTION: the Q recap risks chain-trusting the IMPL-RUN-BOARD's self-report (which claimed 'totality' then retracted it), re-importing the board's optimism. PRE-EMPT: mandate that every Q recap 'ADDRE

---

## B4-precept-reckoning

**Verdict:** The shipped 4.4.0 HONORS the precepts it claims to honor — inv-16 is clean (parse-that prod dep genuinely removed), record-as-built honesty is the drive's strongest discipline (the HONEST DEFERRED FOLLOW-UPS ledger + the honest-inferiority S8 record + the corrected spring prose are exemplary), and the engine-core batch (SoA partition, _styleOut, resolve-values one-pass) is genuinely gestalt/KISS/performant. BUT the precept reckoning exposes that 4.4.0 is honestly-recorded as roughly HALF of the 

**Findings:**
- HONORED — inv-16 is CLEAN in 4.4.0. S9 (utils.ts) removed the direct @mkbabb/parse-that PRODUCTION dep entirely (kf now reaches parse-that only transitively through value.js — acyclic spine restored), gained proof:boundary W96 parse-that source-scan. All value.js needs were DISPA
- HONORED — record-as-built honesty is the STRONGEST precept in this drive. IMPL-RUN-BOARD.md:23 states the honest call plainly ('kf shipped 4.4.0 MINOR... the planned 5.0.0 awaits the deferred O.W9 breaking alias-drops') and lines 27-33 enumerate a HONEST DEFERRED FOLLOW-UPS secti
- HONORED — KISS/gestalt in the engine-core batch. The SoA compositor (group.ts) is a single PARTITION dispatch, NOT a legacy dual-path: numeric keys fold through the Float64 SoA plan; the non-numeric (color/computed/string/mixed) tail keeps the boxed path via the boxedKeys split (
- HONORED — performance-above-all is evidenced, not asserted: SoA add 2.54×/weighted 2.35× on the REAL transformFramesGrouped path (Amdahl-scoped, not the inflated 3.7× isolated figure — honest framing), color2Into 84→37 allocs (56%) in value.js, spring heatmap closed-form 272-507×
- VIOLATION (no-legacy, RECORDED-but-DEFERRED) — the 2 @deprecated PKG-3 aliases survive: `Animation`→KeyframesAnimation (load-engine.ts:126,257 + index.ts:214) and `ScrollTimeline`→KeyframesScrollTimeline (index.ts:52, timeline.ts:163-209). O.md:69-71 explicitly lists these under 
- VIOLATION (no-legacy duplication) — internal/leaves.ts still re-implements value.js's clamp/scale/lerp/lerpArray 'byte-for-byte equivalent' (leaves.ts:14,56-62). The O.W9/P.W10 cure was to externalize to a value.js /math subpath. The file's OWN comment (leaves.ts:57-58) records W
- RISK (P-inv-28, perpetual-punt) — P.W9 NaN-frame: the agent's parse()-time throw was REVERTED ('poisoned the L.W1 S4 opaque-ingest floor') and 'the shipped tranche-L behavior is restored (NaN is latent at sample-without-timeline only)' (495484a commit body). A KNOWN bug is now la
- RISK (mid-tranche deferral baked into shipped code) — resolve-values.ts ships ONLY the element-INDEPENDENT arm (resolve-values.ts:11,18-23,435). Phase 2 (style(--p), sibling-index(), attr(), anchor-size() — the element-AWARE cases) is left as a 'typed seam below' (resolve-values.
- VIOLATION (gestalt/KISS, god-object) — engine.ts is 1397 lines; O.W7's engine-seam split (1397→~900) was NOT done, recorded as 'risky re-org' (IMPL-RUN-BOARD.md:41). The Animation+CSSKeyframesAnimation god-object persists. This is a pure-NOW kf-internal cleanliness deferral with 
- GAP (record/gate) — proof:changelog-5.0.0 is ABSENT (no scripts/proof-changelog-5*.mjs, no package.json key). O.md:153-154 specced this as the born-RED gate asserting the breaking set (alias drops + multi-color refusal semantic). The gate that would PROVE the 5.0.0 semver claim w
- STRENGTH (S8 terminal honesty) — the S8 WeakMap (FN_NAME_MAP, utils.ts:52) genuinely retired the foreign-Symbol-stamp realm breach (proof:no-foreign-symbol-stamp HARD, GREEN). The instance is a KEY never mutated — realm-clean. The remaining clone-restamp ceremony is honestly labe
- OBSERVATION (semver call is correct, but the planning DAG lied) — the constellation DAG (IMPL-RUN-BOARD.md:7) named 'keyframes O+P (5.0.0 major)'. Shipping 4.4.0 MINOR is the HONEST semver call (no breaking change actually landed). The friction is that the PLAN promised a major a

**Deferred/chronic terminalized:**
- O.W9 no-legacy: drop the 2 @deprecated aliases (Animation, ScrollTimeline) + migrate the 22 demo consumers — the breaking change that gates the honest 5.0.0 cut → **Q.W-NOLEGACY-ALIAS (NOW, kf-side) — the alias drop + consumer migration + proof:changelog-5.0.0 author, cut as the 5.0.0**
- internal/leaves.ts duplicating value.js clamp/scale/lerp/lerpArray (the isomorphic/no-legacy math debt) → **Q.W-LEAVES-EXTERNALIZE (GATED on a value.js /math subpath ask) — dispatch the value.js /math tree-shakeable subpath, the**
- P.W9 named-selector NaN-frame: the reverted parse-throw; NaN latent at sample-without-timeline (the L→M→O chronic) → **Q.W-NAN-FRAME-TERMINAL (NOW, kf-side) — the deferred-resolution + PLAY-time guard cure (NOT a parse throw, which broke t**
- resolve-values.ts Phase 2 element-AWARE arm (style(--p), sibling-index(), attr(), anchor-size()) left as a typed seam → **Q.W-RESOLVE-ELEMENT-DEP (NOW kf-side for the seam-fill; the value.js extractFunctions/sibling-index inputs are already p**
- O.W7 engine.ts 1397-line god-object split (the gestalt transposition) → **Q.W-ENGINE-SEAM (NOW, kf-side, pure-internal) — split Animation/CSSKeyframesAnimation along the frame-pipeline/playback/**
- S8 WeakMap clone-restamp ceremony (honest inferiority — VJ-L1 .fnName strictly preferred) → **Q.W-S8-VJL1-CONSUME (GATED on value.js VJ-L1 first-class .fnName field) — dispatch VJ-L1 now, consume + retire the FN_NA**
- proof:changelog-5.0.0 born-RED gate (never authored) → **Folded into Q.W-NOLEGACY-ALIAS — author proof:changelog-5.0.0 as that wave's born-RED gate (asserts the breaking set: al**

**Proposed waves:**
- [NOW] **Q.W-NOLEGACY-ALIAS** — Drop the @deprecated Animation + ScrollTimeline aliases (index.ts/load-engine.ts/timeline.ts), migrate the 22 demo consumers to KeyframesAnimation/KeyframesScrollTimeline, author p · gate: proof:changelog-5.0.0 — born-RED today (no CHANGELOG 5.0.0 entry, no gate file); asserts the breakin
- [NOW] **Q.W-NAN-FRAME-TERMINAL** — Cure the named-selector-without-timeline NaN-frame at PLAY time via deferred-resolution + a play-time guard (NOT a parse throw — that broke L.W1 S4 opaque-ingest), so named frames  · gate: proof:named-selector-nan-frame (re-targeted) — constructs a named-selector animation, asserts (a) fr
- [NOW] **Q.W-ENGINE-SEAM** — Split engine.ts (1397 lines) along frame-pipeline / playback / format seams to ~900 lines; the full 912-test suite is the no-behavior-change oracle (O.W7, deferred as 'risky re-org · gate: proof:engine-seam-size — asserts engine.ts < 1000 lines AND the public engine surface (proof:publish
- [NOW] **Q.W-RESOLVE-ELEMENT-DEP** — Implement the resolve-values.ts Phase-2 element-AWARE arm (style(--p), sibling-index(), attr(), anchor-size()) over the existing CSSResolveEnv seam in a post-setTargets pass; value · gate: proof:emerging-css-resolve-element-dep — born-RED today (the typed seam exists but no element-aware 
- [GATED] **Q.W-LEAVES-EXTERNALIZE** — Consume a value.js /math tree-shakeable subpath (dispatched ask) and DELETE the kf internal/leaves.ts clamp/scale/lerp/lerpArray duplicates — the isomorphic/no-legacy math debt ter · gate: proof:no-math-duplication — born-RED while leaves.ts re-implements value.js math; asserts kf imports
- [GATED] **Q.W-S8-VJL1-CONSUME** — Consume value.js VJ-L1 first-class ValueUnit.fnName field and retire the FN_NAME_MAP WeakMap + the clone-restamp ceremony in utils.ts — the S8 chronic TERMINAL (honest inferiority  · gate: proof:no-fnname-weakmap — born-RED while FN_NAME_MAP exists; asserts utils.ts reads .fnName off the 
- [DISPATCH] **Q.W-MATH-FNNAME-DISPATCH** — The value.js ask bundle that enables Q.W-LEAVES-EXTERNALIZE + Q.W-S8-VJL1-CONSUME: a /math tree-shakeable subpath export AND a first-class ValueUnit.fnName field surviving .clone() · gate: (value.js-side) proof:math-subpath + proof:valueunit-fnname-clone-preserved — authored in value.js, 

**Friction pre-empted:**
- FRICTION: Q.W-NOLEGACY-ALIAS could spawn a mid-tranche deferral when the 22-consumer demo migration uncovers a consumer that depends on alias-specific behavior. PRE-EMPT: enumerate all 22 consumers NO
- FRICTION: Q.W-ENGINE-SEAM (the 'risky re-org' the drive twice declined) could spawn a mid-tranche deferral if a split surfaces a circular import (frame-compiler ↔ engine ↔ playback). PRE-EMPT: author 
- FRICTION: the two GATED waves (Q.W-LEAVES-EXTERNALIZE, Q.W-S8-VJL1-CONSUME) could become perpetual punts if value.js never ships the enabling surface — the exact P-inv-28 failure. PRE-EMPT: bind them 
- FRICTION: Q.W-RESOLVE-ELEMENT-DEP runs a post-setTargets pass that touches the same resolveKeyframes→flatten seam as the shipped Phase-1 arm; a naive second pass could double-rewrite. PRE-EMPT: spec t
- FRICTION: the honest 4.4.0→5.0.0 semver gap means Q's 5.0.0 cut bundles MULTIPLE breaking changes (alias drops + the multi-color refusal). If they land in separate waves, the semver bumps could fight.

---

## B5-valuejs-arch

**Verdict:** value.js's color hot paths are already deeply and idiomatically transposed (B3 ColorChannelPlan SoA, color2Into, DIRECT_PATHS, JND early-exit) — the mature-surface caveat is real, so contrivance discipline matters here. But three GROUNDED transposition seams survive, each named by the existing gates or visible in the consume path: (1) the gamut egress-wrapper alloc tail (proof-gamut-alloc.mjs itself defers the xyz2*Into converter-layer cure, 37→~5 allocs), (2) mixColors' per-call array+spread-co

**Findings:**
- STRENGTH: the color hot paths are already deeply transposed — B3 ColorChannelPlan SoA in interpolate.ts (closure-free flat loop, hue ÷360 folded into the plan), color2Into out-param zero-alloc (84→37 allocs), the DIRECT_PATHS direct-path table, the JND early-exit skipping the 24-
- BOTTLENECK (the gate names it itself): gamut-alloc residual is 37 allocs/call, of which ~28 are the per-step EGRESS wrapper `new DisplayP3Color(...)` inside `gamutMapToRgbSpace`'s 24-step bisection. proof-gamut-alloc.mjs:36-40 explicitly diagnoses the cure: the per-space xyz2* co
- BOTTLENECK (V8 deopt): mixColors (dispatch.ts:577-605) allocates a `resultComponents: number[]` array + a `keys.filter()` array per call AND constructs via the variadic spread `new ResultClass(...resultComponents, resultAlpha)` — a monomorphic-constructor megamorphic-spread deopt
- BOTTLENECK (kf consume, half-value.js): compile-color.ts:196-199 calls `sampleColorRamp(fromColor, toColor_, 1024, ...)` INSIDE the inner ΔE-proof loop (once per midpoint `s`), building a full 1024-element ramp (each stop a mixColors + a gamutMap = potentially a 24-step bisection
- BOTTLENECK (allocation backbone): utils.ts:7-22 `clone()` deep-clones objects via `Object.entries().map().reduce()` — three array allocations + a reduce-closure per object level. It is the engine of ValueUnit.clone (units/index.ts:120) and FunctionValue.clone (266), which kf invo
- CONTRIVANCE-RISK FLAGGED: the parser (parsing/index.ts) rides parse-that combinators (Parser.lazy/sepBy/wrap) and was already transposed in O.W6 (byte-scanners scanIdentFast/scanNumberFast + dispatch() first-char table, +23-32% A/B-proven). A further 'rewrite the parser' wave wou
- NO-LEGACY: value.js src is clean of dead/legacy arms in my slice; no @deprecated, no commented-out alternates. The `as` casts in dispatch.ts (getXyzToFn/getDirectPath) are documented index-narrowings, not type-erasure. coalesce()'s inplace/non-inplace fork (index.ts:132) is live 
- GAP (measure coverage): there is NO bench/gate for mixColors alloc, sampleColorRamp throughput, or ValueUnit/FunctionValue clone alloc — the three transposition seams above are unmeasured, so a Q wave MUST land its born-RED measure FIRST. proof-gamut-alloc.mjs is the template (ru

**Deferred/chronic terminalized:**
- VJ-CSS3 contrast-color() + if() multibranch (deferred in IMPL-RUN-BOARD as a new value.js patch 1.1.1/1.2.0) → **Q-VJ.W4 — grammar+resolver wave (DISPATCH to value.js). Not in the B5-arch perf slice proper, but it is the one OUTSTAND**
- gamut egress-wrapper alloc tail (37 allocs/call residual — the deeper converter-layer cure proof-gamut-alloc.mjs:36-40 explicitly defers) → **Q-VJ.W1 (below) — the xyz2*Into out-param converter family. This is the natural terminal of the O.W3→VJ-P1 alloc-reducti**
- proof:perf-target near-floor flakiness under concurrent CPU load (memory + run-board: 'flakes near its floor only under heavy concurrent CPU load; do NOT lower  → **Q-VJ.W5 (below) — re-base the perf gate on a per-run isolation-normalized ratio with a warmup-discard + best-of-N (not m**

**Proposed waves:**
- [DISPATCH] **Q-VJ.W1** — xyz2*Into out-param family (xyz2rgbInto/xyz2displayP3Into/xyz2rec2020Into/…) in conversions/xyz-extended.ts + color2Into egress leg writes through `out` directly — closes the gamut · gate: proof:gamut-alloc C2 threshold tightened N_TARGET 40→8 (measured residual after egress *Into ≈5); th
- [DISPATCH] **Q-VJ.W2** — mixColorsInto(c1,c2,p1,p2,space,hue,out) out-param mirroring color2Into — write channels via setChannel, kill the resultComponents[] + keys.filter() arrays and the variadic-spread  · gate: NEW proof:mix-alloc (clone the CountingColor shim from proof-gamut-alloc.mjs): asserts mixColors bas
- [DISPATCH] **Q-VJ.W3** — sampleColorRampAt(from,to,t,opts) single-t perceptual sampler (the array-free read) + kf compile-color.ts hoists the 1024-ramp OUT of the inner loop to use it — eliminates the O(st · gate: NEW value.js proof:ramp-at-equiv — sampleColorRampAt(a,b,i/(n-1)) === sampleColorRamp(a,b,n)[i] bit-
- [GATED] **Q-VJ.W4** — Structural clone transposition — replace the Object.entries/map/reduce reflective `clone()` (utils.ts:7) with a direct structural clone; ValueUnit/FunctionValue clone() short-circu · gate: NEW proof:clone-alloc — an allocation-count harness (object-count via a Proxy/heap-delta sample) ass
- [NOW] **Q-VJ.W5** — proof:perf-target estimator hardening — warmup-discard + best-of-N (drop the slowest samples) replacing median-of-9, with the JSON normaliser sampled INTERLEAVED per-run so a trans · gate: proof:perf-target self-test: run under a synthetic co-located CPU-hog and assert the ratio clause st

**Friction pre-empted:**
- FRICTION: Q-VJ.W1/W2 (xyz2*Into + mixColorsInto) ship new value.js API that kf's compile-color/interpolate must then consume to realize the win — a cross-repo DAG edge. PRE-EMPT: publish value.js Q FI
- FRICTION: Q-VJ.W3's win is SPLIT across repos (value.js sampleColorRampAt + kf hoist), risking a mid-tranche 'value.js shipped but kf still recomputes' half-state. PRE-EMPT: specify BOTH halves NOW as
- FRICTION: Q-VJ.W4 (clone transposition) touches the ValueUnit/FunctionValue model that EVERY consumer's instanceof/clone semantics depend on — a regression here is silent and wide. PRE-EMPT: gate it G
- FRICTION: any Q perf wave inherits proof:perf-target's near-floor flakiness (documented in memory: it flakes under concurrent CPU load), which could RED a perfectly-good Q perf wave and stall the tran

---

## B5-parsethat-arch

**Verdict:** parse-that 0.12.0's CORE perf transpositions that got CONSUMED (the dispatch first-char Int8Array LUT, the inlined wrap()/trim() closures, the FLAG-based call() fast-path, the float64 packrat key fix, the SpanParser KILL) are genuinely sound and load-bearing. But the PT-B3 'frontier beyond' lane shipped THREE perf APIs the only real consumer (value.js) never wired: the dispatch subTable widening (its named target — the c-bucket — is still a 4-deep any()), the fuse() export (dead + redundant with

**Findings:**
- UNWIRED PERF API (the headline gap): leaf.ts dispatch()'s 2nd-byte subTable widening (lines 103-209) is BUILT + gated (proof-perf.mjs clause B over a synthetic ca/cl/cu corpus) but has ZERO real consumers. value.js's ONLY dispatch() call (src/parsing/index.ts:425) passes NO subTa
- DEAD/REDUNDANT EXPORT: leaf.ts fuse() (lines 351-362) is NOT in the barrel (absent from index.ts AND core.ts; only dist/leaf.d.ts:40 declares it) — so no consumer can even import it — AND it is redundant: all() already routes through fuseAll() internally (leaf.ts:225), so value.j
- ORPHAN COMBINATOR: parser.ts thenMap() (lines 96-119), the PT-B3 zero-tuple then+map fusion, has ZERO callers (grep finds only its own definition) and value.js has ZERO `.then().map()` chains in its grammar (grep `\.then(` over src/parsing/*.ts = no hits). The fused seam optimize
- PUBLISHED-BUT-UNCONSUMED TIER: the 16 closure Span builders (stringSpan/regexSpan/manySpan/sepBySpan/wrapSpan/optSpan/skipSpan/nextSpan/altSpan/takeUntilAnySpan/negateSpan/peekSpan/notSpan/minusSpan/lookAheadSpan in span.ts) have ZERO consumers in value.js (grep over src/parsing/
- BYTE-SCANNER SPLIT: trimStateWhitespace (leaf.ts:461-480) is a hand-rolled charCode byte-scanner with fast-exit, but `whitespace = regex(/\s*/)` (leaf.ts:486) still rides the sticky-regex path. The .trim()/wrap whitespace path and the flag-based FLAG_TRIM_WS path use DIFFERENT sc
- PACKRAT is correct but ORPHANED on the real path: the WDM left-recursion + (id,offset) float64 key (getCijKey, packrat.ts:56-68, fixes the int32 <<20 overflow at id>=4096) + src-epoch cross-input guard are SOUND (born-RED gate proof-packrat-cross-input.mjs green). But value.js's 
- STRENGTH: the dispatch() primitive ITSELF (the 128-entry Int8Array first-char LUT) IS consumed and load-bearing — value.js index.ts:425 (15 buckets) + color.ts:732 use it on the function-name hot path. The Int8Array LUT + intern-by-identity is the genuine, harvested win. The subT
- STRENGTH: parser.ts wrap()/trim() inline their start.next(this).skip(end) into a single closure (lines 411-443) eliminating 2 frame allocs/call — a real, consumed fusion (value.js uses .wrap()/.trim() heavily). The FLAG-based call() fast-path (flags===0 / ===FLAG_TRIM_WS, lines 4
- CONTRIVANCE-RISK: proof-perf.mjs clause B tests dispatch-widening over a SYNTHETIC ca/cl/cu corpus the gate itself constructs — it does NOT assert the win on value.js's actual c-bucket. A gate that proves a transposition on a corpus no consumer runs is a green that misses the app
- NO no-legacy violation found in parse-that core: span.ts SpanParser tagged-union tier was correctly KILLED (proof-span-parser-killed.mjs green); the remaining *Span closures are the intended surface. The `parserNames` union (state.ts:141-182) still lists 14 *Span names (regexSpan

**Deferred/chronic terminalized:**
- PT-B3 dispatch subTable widening built but UNCONSUMED — value.js's c-bucket (calc/clamp/cos/conic/cubic) still a 4-deep any() → **Q wave PT-Q1 (DISPATCH): value.js consumes the subTable in its dispatch({...}) call to flatten the c/r/s buckets, with a**
- fuse() dead/redundant export (not in barrel, all() already fuses) → **Q wave PT-Q4 (no-legacy): RETIRE fuse() from leaf.ts entirely (it is unexported + redundant with all()'s internal fuseAl**
- thenMap() orphan combinator (zero callers, no real .then().map() shape) → **Q wave PT-Q4 (no-legacy): decide-and-record — either WIRE it (find the real then+map seam in value.js, if any) or RETIRE**
- Span/byte-scanner tier published-but-unconsumed (16 closure builders, 0 value.js consumers) → **Q wave PT-Q3 (Span-consume-or-record): EITHER wire value.js's takeUntilAnySpan/regexSpan into one hot leaf (e.g. the gen**
- whitespace=regex(/\s*/) does not use the trimStateWhitespace byte scanner → **Q wave PT-Q2 (byte-scanner unify): replace the whitespace leaf's regex body with the charCode scanner so the .trim()/wra**

**Proposed waves:**
- [DISPATCH] **PT-Q1** — value.js consumes parse-that's dispatch() subTable to flatten its c/r/s function-name buckets (the multi-token first-char collisions); harvest the already-built PT-B3 widening on t · gate: proof:perf-consumer (new, in value.js): the value.js CSS-function parse corpus (a real calc()/conic-
- [NOW] **PT-Q2** — Unify the whitespace byte-scanner: re-body the `whitespace` leaf (leaf.ts:486) to use the trimStateWhitespace charCode scanner so the .trim()/wrap path and the FLAG_TRIM_WS path sh · gate: proof:perf clause D (new): a whitespace-heavy parse corpus retains strictly less heap/op AND no rege
- [DISPATCH] **PT-Q3** — Span-tier consume-or-record: wire value.js's hottest leaf scan (generic ident / number run) onto takeUntilAnySpan/regexSpan to harvest the zero-alloc Span path on ONE real seam, pr · gate: proof:span-consumed (new): EITHER (consume arm) a named value.js leaf parses through a Span builder 
- [NOW] **PT-Q4** — no-legacy sweep of orphan combinator-exports: RETIRE fuse() (unexported + redundant with all()'s internal fuseAll) and resolve thenMap() (zero callers) via WIRE-or-CUT recorded in  · gate: proof:no-orphan-export (new): assert every value-export reachable from the barrel (index.ts/core.ts)
- [GATED] **PT-Q5** — Consumer-anchored perf gate: re-scope proof-perf.mjs clause B from the SYNTHETIC ca/cl/cu corpus to assert the dispatch-widening win on value.js's ACTUAL c-bucket grammar (closes t · gate: proof:perf clause B' asserts speedup over the value.js bucketC grammar shape (imported as a fixture)

**Friction pre-empted:**
- FRICTION: PT-Q1 (value.js consumes subTable) is a value.js-side change but its born-RED gate measures against a parse-that surface — a cross-repo DAG edge. If Q wires it without first confirming the s
- FRICTION: PT-Q3's consume arm could spawn a mid-tranche deferral if NO clean value.js Span seam exists (the grammar is built on substring-returning regex()/string(), not Span). PRE-EMPT: specify BOTH 
- FRICTION: PT-Q4 retiring fuse()/thenMap() touches dist/leaf.d.ts which proof:published-surface-style gates (if any in parse-that) snapshot — a surface-change could red an unrelated dist-surface test m
- FRICTION: the packrat tier (sound but consumer-dead) tempts a Q wave to 'optimize the orphan' — pure contrivance since no consumer exercises it. PRE-EMPT: explicitly DECLARE packrat out-of-scope for Q
- FRICTION: codegen/bbnf-lang temptation — the dispatch/fusion frontier visually invites a 'generate the dispatch table from a grammar' codegen step. This is explicitly OUT (bbnf-lang's separate session

---

## B5-kf-engine-arch

**Verdict:** B5 confirms the shipped impl drive was DISCIPLINED-BUT-PARTIAL on the engine: the measure-first spikes (group SoA ADOPT, Typed-OM KILL, Playhead DROP) were genuinely run and honestly recorded — a real strength to preserve. But the engine's HIGHEST-leverage performance transposition was left unbuilt: the standalone interp path (processFrame's per-channel boxed lerpValue, engine.ts:754) — which EVERY preset/fromString/single animation rides — is still megamorphic boxed-AoS while only the non-defau

**Findings:**
- STRENGTH: the GROUP-blend SoA fold SHIPPED and is real (group.ts:536 soaBlendLayer over a precomputed Float64Array plan; buildSoAPlans rebuilt only on structural change; bit-identical maxErr=0; group-soa-decision.json add 3.70x/weighted 3.76x, soa-composite-decision.json add 1.97
- LOAD-BEARING GAP (the prime B5 finding): the STANDALONE HEAVY interp path was NEVER transposed. processFrame (engine.ts:754) still does `for (const iv of frame.allInterpVars) lerpValue(eased, iv)` — a boxed, megamorphic per-InterpolatedVar dispatch — on the DOMINANT real-world pa
- O.W7 NOT DONE: engine.ts is 1397L; engine-playback.ts is ABSENT (only engine-composition/engine-css-metadata/engine-options were split out, all pre-P). The lifecycle/playback machine (onStart/onEnd/advanceTo/_advance/_frame/_renderFrame/_playRAF/_playWAAPI/_snapToReducedMotion/pl
- O.W9 / 5.0.0 NOT DONE: 2 @deprecated value aliases remain (engine.ts:1205 `export { KeyframesAnimation as Animation }`; timeline.ts ScrollTimeline→KeyframesScrollTimeline) plus presets.flip alias. kf shipped 4.4.0 (MINOR), NOT the planned 5.0.0 major. 33 demo files still import t
- P.W9 NaN-frame DEFERRED in source: frame-compiler.ts:449 carries an explicit `P.W9 (DM-22) — DEFERRED to a follow-up wave` comment. A named scroll-range selector (entry/exit/cover/contain) with NO timeline produces NaN frame.time at parse, and binarySearchRange returns it as alwa
- emerging-CSS P.W13 is HALF-SHIPPED: resolve-values.ts Phase-1 (if(supports/media) + spring()) is wired into adapter.ts:151 (hasResolvableValue→resolveValues, gated so all-concrete keyframes pay nothing). But Phase-2 (the element-AWARE arm: if(style(--p)), sibling-index(), sibling
- WAAPI eligibility is conservative-correct but leaves a measured perf opportunity on the table: every viewport/container unit + every % (except offset-distance) + every CSS-twinned multi-segment easing forces rAF. The sub-segment densify (waapi.ts:249, WAAPI_SUBSEGMENT_STOPS=8) ti
- at() allocates: at(progress) (engine.ts:608) always returns a fresh object even on the single-active-frame fast path (it returns the aliased flatVars, which is correct for the play loop but at() is a query whose result the caller keeps — so a scrub UI calling at() per frame alloc
- CONTRIVANCE-RISK avoided well: the Typed-OM write path was spiked and KILLED (typed-om-decision.json 0.69x on multi-property), the Playhead value-object was DROPPED (no perf claim), VJ-L1 flatLeaf demoted-to-spike. The team correctly refused paper-charters. This is a strength to 
- spring-vector-decision.json is the only dirty file (git status) — re-recorded 2026-06-22 (ratio 3.85x, still ADOPT, just a fresh timestamp). The SpringProgress.setTargets(Float64Array) vector sugar is ADOPT-verdicted but the run-board does not confirm the setTargets(Float64Array)

**Deferred/chronic terminalized:**
- O.W7 engine.ts seam split (1397L→~900, lift the playback machine into engine-playback.ts) → **Q.W-ENG1 (NOW) — a pure file-split lifting the lifecycle/playback methods off KeyframesAnimation behind a thin composed **
- Standalone HEAVY interp boxed-AoS path (processFrame per-channel lerpValue) — never transposed; the dominant real path → **Q.W-ENG2 (NOW) — ship the Float64Array SoA pack + value.js lerpArray fold into processFrame/interpFrames for the all-num**
- P.W9 named-selector NaN-frame proper cure (deferred-resolution + PLAY-time guard) → **Q.W-ENG3 (NOW) — the deferred phase-resolution step (named selector → numeric % under a ScrollTimeline/ManualTimeline at**
- O.W9 @deprecated alias drop (Animation/ScrollTimeline/presets.flip) + 5.0.0 major cut + 33-demo-consumer migration → **Q.W-ENG4 (NOW author / USER-DOMAIN publish) — the breaking no-legacy purge; born-RED proof:no-deprecated-alias asserting**
- resolve-values.ts Phase-2 element-aware arm (if(style(--p)), sibling-index(), sibling-count()) — typed seam, no second pass → **Q.W-ENG5 (NOW) — the post-setTargets second resolution pass over the SAME ResolveContext shape, reading the resolved tar**
- @function call-inlining (resolve-values.ts:402 stub) — value.js-P-gated on extractFunctions + call-parse → **Q.W-ENG6 (GATED on value.js extractFunctions + dashed-call parse publish) — bind params→substitute→evaluate, cycle-guard**
- SpringProgress.setTargets(Float64Array) vector sugar — ADOPT-verdicted (spring-vector-decision.json) but ship-status unconfirmed → **Q.W-ENG2 companion — a confirm-or-ship clause inside the interp-SoA wave; the vector setTargets is the same Float64Array**

**Proposed waves:**
- [NOW] **Q.W-ENG1** — engine.ts seam split (O.W7 landed): lift the playback/lifecycle machine into engine-playback.ts, shrinking engine.ts from 1397L to ~900L, KeyframesAnimation composing a Playback un · gate: proof:engine-seam-split — asserts engine.ts ≤ 950L AND engine-playback.ts exists AND a byte-equality
- [NOW] **Q.W-ENG2** — Standalone-interp SoA transposition: replace processFrame's per-channel boxed `for (iv of allInterpVars) lerpValue` with a Float64Array SoA pack + value.js lerpArray fold for the a · gate: proof:interp-soa — reads a same-report ratio bench (the existing interp-buffer.bench.ts:202 SoA arm 
- [NOW] **Q.W-ENG3** — P.W9 NaN-frame proper cure: deferred phase-resolution mapping named scroll-range selectors → numeric % at ScrollTimeline/ManualTimeline attach, refusing with structured NAMED_SELEC · gate: proof:named-selector-nan-frame — constructs an entry/exit animation, asserts (a) fromString+parse do
- [NOW] **Q.W-ENG4** — O.W9 no-legacy alias purge + 5.0.0 cut: drop the @deprecated Animation/ScrollTimeline/presets.flip re-exports, migrate the 33 demo consumers to KeyframesAnimation/KeyframesScrollTi · gate: proof:no-deprecated-alias — greps src for `@deprecated` value re-exports (must be 0) AND greps demo/
- [NOW] **Q.W-ENG5** — resolve-values.ts Phase-2: the post-setTargets second resolution pass over the SAME ResolveContext, evaluating if(style(--p))/sibling-index()/sibling-count() against the resolved t · gate: proof:resolve-values-phase2 — compiles a keyframe carrying `sibling-index()` against an injected sib
- [GATED] **Q.W-ENG6** — @function call-inlining: on the value.js extractFunctions + dashed-call parse publish, bind params→substitute→evaluate a registered --ident(args) call at resolve-values.ts (registr · gate: proof:function-inline — lowers `width: --double(50px)` against a registered @function --double regis
- [NOW] **Q.W-ENG7** — WAAPI curvature-adaptive sub-segment densify: replace the fixed WAAPI_SUBSEGMENT_STOPS=8 with a curvature-driven stop count (dense where the rAF curve bends past a tolerance, spars · gate: proof:waapi-adaptive-densify — a same-report bench asserting the adaptive emit produces ≤ the fixed-

**Friction pre-empted:**
- Q.W-ENG2 (standalone SoA) RIDES ON Q.W-ENG1 (the seam split): folding the SoA path into a 1397L god-file is the exact churn the split exists to avoid, and a mid-tranche realization 'we should split fi
- Q.W-ENG2's SoA fold needs the all-numeric-frame classification (which leaves are pure-numeric ValueUnit[] vs color/computed/mixed) — the SAME partition group.ts:buildSoAPlans already implements. PRE-E
- Q.W-ENG6 (@function inline) is value.js-P-GATED and could spawn a 'value.js not ready' mid-tranche block. PRE-EMPT: author the wave NOW as a typed seam over the already-threaded ctx.functions registry
- Q.W-ENG4 (5.0.0 alias purge) migrates 33 demo consumers — a mid-tranche 'the demo broke' churn risk. PRE-EMPT: specify a codemod-shaped single-pass rename + the proof:no-deprecated-alias gate authored
- Q.W-ENG3 (NaN-frame cure) touches the parse()→attach→play pipeline that Q.W-ENG1's split is relocating. PRE-EMPT: land Q.W-ENG1 first OR scope Q.W-ENG3's change to frame-compiler.ts (compile-side, unt

---

## B5-kf-demo-arch

**Verdict:** The demo shipped a GREEN, well-aligned slice — the spring heatmap, square ARIA cure, cube axis-lock, and three earned eggs are real and live. But the frontend-design HEADLINE of P Band C was substituted: the easing scene was specced as the demo's protagonist DIRECT-MANIPULATION instrument (hero-editable curve over DemoControlPoint) and shipped instead as a passive sidebar TELEMETRY readout. The root cause is a single unbuilt substrate — DemoControlPoint.vue over LIGHT drag2D — the 7+-tranche DM-

**Findings:**
- GAP (the spine of Q-demo): DemoControlPoint.vue was NEVER BUILT — demo/@/components/custom/DemoControlPoint.vue does not exist. It was the HARD precondition (O.W5) for the entire P.W7 easing curve-editor showcase. The impl drive shipped only a curve-physics TELEMETRY readout + 'n
- NO-LEGACY / CONTRIVANCE VIOLATION (active): drag2D + Drag2DHandle are exported from src/animation/index.ts:88,93 but have ZERO live consumers (grep across demo/ src/ test/ bench/ = empty). The CONTRIVANCE-AUDIT explicitly RE-SCOPED this: 'do not export drag2D/Drag2DHandle from th
- GAP: the easing HERO stage remains read-only — EasingHeroStage.vue:54 aria-hidden='true' + :210 pointer-events:none. The editor is still exiled to the ~300px sidebar with BESPOKE pointer handlers (EasingCurveCanvas.vue:20 @pointerdown='startDragging', :119/:126 .control-point.han
- GAP: the AMIGA scene's P.W5.S2 cures did NOT ship. No AmigaTelemetry.vue (decay() physics still invisible — the scene's entire 'engine drives a non-DOM Three.js target' dogfood claim is unwitnessed); material is still MeshLambertMaterial (utils.ts:61, the flat unlit ball, not the
- GAP: fromMorphSVG is a DEAD HEAVY export demo-side. The library exports it (index.ts) + test/morph-svg.test.ts consumes it, but NO demo scene showcases it. P.md:65,267-268 promised 'a morph scene showcases fromMorphSVG (P.W5/W6)'. The 3rd HEAVY geometry front door (after MotionPa
- GAP: P.W8 shipped NOTHING. No directional/typed View Transition (useSceneTransition.ts passes no types — grep for 'forward|backward|view-transition-type' = empty; the scene-switch is a directionless cross-fade over the single scene-subject VT at App.vue). No mobile scroll-snap sc
- GATE NAMING COLLISION RISK: proof:control-point-live (scripts/proof-control-point-live.mjs) is a glass-ui BB HANDOFF tripwire for GlassControlPoint (a published-surface import probe, born-RED-by-design, report-all posture) — it is NOT the kf DemoControlPoint-over-drag2D gate. A Q
- STRENGTH: the demo IS well-aligned and a lot DID ship — the spring parameter-space heatmap (demo/spring/SpringHeatmap.vue 338L, closed-form 272-507x, live + hash-verified), the square WCAG 4.1.2 ARIA cure (role=group + two visually-hidden per-axis role=slider children, SquareScen
- CONTRIVANCE-RISK: the run-board claims '5.0.0/5.1.x' demo fleet but shipped 4.4.0 with the curve-editor showcase reduced to a sidebar telemetry readout. The frontend-design lens reveals the headline P-Band-C promise (the easing scene as the demo's protagonist DIRECT-MANIPULATION 
- MODERN-WEB GAP: the scene-switch leaves directional-navigation-transitions (a Baseline-newly typed VT, free over the existing scene-subject name) on the floor (NI-1). And size-aware-styling/@container is under-used in the scene-stage subtree (zero responsive breakpoint), so the d

**Deferred/chronic terminalized:**
- DemoControlPoint.vue over LIGHT drag2D (the DM-2 chronic terminal, named-but-never-built since tranche M.W14, 7+ tranche carries; O.W5 chartered it, P.W7 dogfoo → **Q.W-DCP (NOW, intra-repo) — build DemoControlPoint.vue + the proof:demo-control-point keystone (live page.mouse drag re-**
- drag2D / Drag2DHandle orphan LIGHT export (CONTRIVANCE-AUDIT RE-SCOPE: 'no barrel export without a live consumer' — currently VIOLATED) → **Q.W-DCP (same wave) — DemoControlPoint IS the live consumer that discharges the RE-SCOPE. The born-RED gate proof:demo-c**
- P.W7 easing hero-editable + diff-ghost + precision authoring (the curve-editor as the demo's protagonist instrument; substituted by a passive telemetry readout) → **Q.W-EASING-HERO (NOW, sequences after Q.W-DCP) — promote two DemoControlPoint handles onto EasingHeroStage (de-decorate **
- P.W5.S2 amiga telemetry + specular material + engine-driven boing (the decay() physics made visible; the post-teardown setTimeout race) → **Q.W-AMIGA (NOW, intra-repo) — build AmigaTelemetry.vue (angularVelocity readout), swap MeshLambert→MeshPhong, replace bo**
- fromMorphSVG demo scene (the 3rd HEAVY geometry front door, library-built but never demoed) → **Q.W-MORPH-SCENE (NOW, intra-repo) — author a MorphScene.vue (triangle->square->star keystone over fromMorphSVG/value.js **
- P.W8 N-Stage scene-switcher + mobile + directional VT (the shelf-driver; n-stage-impl ~3,500 LOC shelved on the BC cut) → **Split: Q.W-VT-DIRECTIONAL + Q.W-MOBILE-SWITCHER (NOW, no sibling dep — typed VT + scroll-snap carousel) ship now; the 3D**

**Proposed waves:**
- [NOW] **Q.W-DCP** — Build DemoControlPoint.vue over LIGHT drag2D (critically-damped springOptions:{dampingFraction:1}); consolidate EasingCurveCanvas's bespoke startDragging handles onto it; discharge · gate: proof:demo-control-point (NEW) — live-drag clause: a real page.mouse.down->move->up over a DemoContr
- [NOW] **Q.W-EASING-HERO** — Promote two DemoControlPoint handles onto the EasingHeroStage (de-decorate the handle layer only — drop aria-hidden/pointer-events:none there), fold the closed-form cubic-bezier co · gate: proof:easing-curve-editor (NEW) hero-editable KEYSTONE: navigate #/easing, assert >=2 draggable hand
- [NOW] **Q.W-AMIGA** — Cure the amiga: build AmigaTelemetry.vue (angularVelocity readout via Math.hypot of the already-tracked velX/velY/glideX/glideY), swap MeshLambertMaterial->MeshPhongMaterial (specu · gate: proof:amiga-decay-visible (NEW) amiga-telemetry-live KEYSTONE: drag+release the sphere, assert .amig
- [NOW] **Q.W-MORPH-SCENE** — Author MorphScene.vue showcasing fromMorphSVG (the library-built but un-demoed 3rd HEAVY geometry front door) over value.js PathGeometry — a triangle->square->star morph subject; r · gate: proof:morph-scene-live (NEW): navigate #/morph, play the morph, assert the subject's path d at mid-t
- [NOW] **Q.W-VT-DIRECTIONAL** — Add a typed-directional scene-switch View Transition: compute sign(targetIndex-currentIndex) from scenes.ts order, pass {types:[forward|backward]} to startViewTransition, key the s · gate: extend proof:scene-transition-perf with a vt-directional clause: a nav scene[i]->scene[i+1] reads th
- [NOW] **Q.W-MOBILE-SWITCHER** — Build a phone-correct scene switcher: a native CSS scroll-snap carousel (overflow-x scroll; scroll-snap-type x mandatory) of scene preview cards, each card's scale/opacity falloff  · gate: proof:scene-switcher-mobile (NEW) mobile-layout KEYSTONE: at a real 390px emulated viewport, assert 
- [GATED] **Q.W-NSTAGE-GATED** — SPEC (not execute) the N-Stage unshelf decision: author proof:n-stage-boundary (the bundled DEMO import-graph walk from SceneStage.vue asserting the HEAVY engine chunk is absent fr · gate: proof:n-stage-boundary (NAMED, authored on the BC cut) — born-RED on a planted heavy import in a sta

**Friction pre-empted:**
- FRICTION: Q.W-EASING-HERO, Q.W-AMIGA's drag2D dogfood, and the easing-bespoke-drag consolidation ALL depend on DemoControlPoint existing. If Q starts the design waves before the substrate lands, each 
- FRICTION: the drag2D barrel RE-SCOPE is a no-legacy breach that will recur as a CONTRIVANCE finding every audit until resolved. If Q.W-DCP slips for any reason, the export stays orphaned and the next 
- FRICTION: the gate name proof:demo-control-point collides semantically with the EXISTING proof:control-point-live (the glass-ui GlassControlPoint handoff tripwire). An implementer could wire the wrong
- FRICTION: Q.W-MORPH-SCENE adds a new scene to scenes.ts + the dock + the scene-machine — this touches proof:scene-contract-identity, proof:scene-parity, proof:scene-machine-irrefragable, and the dock 
- FRICTION: Q.W-MOBILE-SWITCHER and Q.W-NSTAGE-GATED both touch the scene-switcher; the mobile scroll-snap layout is the phone VIEW the GATED 3D-ring would reuse (P.W8 S4 Arm B step 3). If they run in d
- FRICTION: the demo design waves are appearance/interaction/state axes that green source-shape gates MISS (the gate-blindspot lesson + MEMORY feedback). A Q wave that ships a component but no runtime g

---

## B6-dag-ordering

**Verdict:** The Q DAG is acyclic and fully sequenceable with ZERO required mid-tranche deferrals — every deferred/chronic item from the P impl-drive has a concrete terminal Q wave with an explicit phase + predecessor edge. Four critical ordering chains carry real merge-correctness risk and are pre-empted by gate-enforced sequencing: (1) alias-drop → engine-seam-split → 5.0.0-cut (the breaking-cut spine; O.W9.md mandates this order); (2) leaves-decision-JSON → leaves-delete (proof:boundary trap); (3) glass-u

**Findings:**
- DAG ROOT FACTS (verified on-disk): engine.ts=1397L (O.W7 split NOT done); the @deprecated `Animation` alias is live at engine.ts:1206 (`export { KeyframesAnimation as Animation }`) with EXACTLY 22 demo consumers (grep confirms 22) (O.W9 S1 NOT done); ScrollTimeline/ScrollTimeline
- CRITICAL BREAKING-CUT ORDERING (the spine of Q's no-legacy band): O.W9.md:254-258 itself mandates `Sequence O.W9 (NOW) before O.W7 (engine-seam)` so the deprecated alias line (engine.ts:1206) is already deleted when O.W7 lifts the class body — they touch engine.ts in disjoint reg
- drag2D → DemoControlPoint → P.W7 chain RESOLVED at the root: drag2D + Drag2DHandle ARE already exported from the LIGHT barrel (index.ts:88,93) — the old CONTRIVANCE-AUDIT 'do not export drag2D' RE-SCOPE is OBSOLETE; the live consumer (DemoControlPoint) now justifies the keep. So 
- value.js extractFunctions → kf @function inlining edge is NOW SATISFIED: value.js 1.1.0 ships extractFunctions (verified node_modules + src/parsing/extract.ts:124). resolve-values.ts:375,394,399 carries the @function CALL-inlining seam explicitly tagged 'value.js-P-gated' — the r
- resolve-values.ts Phase-2 ELEMENT-AWARE arm is typed-but-unbuilt (ground-truth confirmed): only the element-INDEPENDENT arm shipped (if(supports/media) + spring(), lines 18-22). The element-aware fields customProps/siblingIndex/siblingCount are typed (lines 62-66) for a 'second-p
- P.W9 NaN-frame: the error TYPE NAMED_SELECTOR_NO_TIMELINE IS wired (errors.ts:46, frame-compiler.ts) but the CURE is explicitly deferred IN-CODE: frame-compiler.ts:455-462 says 'The correct cure is NOT a throw at parse()... it is a deferred-resolution step that maps the named pha
- glass-ui consume ordering CONTRADICTION (live): installed glass-ui is 4.0.1 (node_modules verified), NOT the 4.1.0 the plan + proof:workaround-deletion both pin. P.md:81-83 claims 'glass-ui 4.1.0 published BUT SegmentedTabs still emits aria-orientation' and 'S2/dock IS deletable 
- P.W10 leaves.ts externalization-TRAP ordering: scripts/leaves-externalization-decision.json is ABSENT (P.W10 not run). The trap (O.W9.md:51-68): a naive `export from @mkbabb/value.js/math` REDs proof:boundary (the regex @mkbabb\/value\.js(?:\/[^"']*)? matches the subpath). value.
- P Band C morph-scene SHOWCASE is uncovered + unbuilt: fromMorphSVG/MorphSVG ARE built+barrel-wired (index.ts:143-150, load-engine.ts:46-47) + gated by proof:morphsvg-consume — BUT that gate has ZERO demo/scene clauses (grep for 'scene|demo|Scene' in the gate returns nothing); no 
- STRENGTH: the core constellation DAG (parse-that B → value.js P → kf O+P) executed acyclically and the S9 parse-that production-dep REMOVAL restored the acyclic spine (utils.ts now consumes value.js parseCSSSubValue, 0 parse-that specifiers per proof:boundary). The portable-perf 

**Deferred/chronic terminalized:**
- O.W9 deprecated-alias drop (Animation + ScrollTimeline/ScrollTimelineOptions) + 22-demo-consumer migration → the 5.0.0 breaking cut → **Q.W-NOLEGACY (NOW): author proof:no-legacy-surface (keystone reads the BUILT dist/keyframes.d.ts for zero @deprecated) F**
- O.W7 engine.ts seam split (1397→~900, lift the playback machine into engine-playback.ts) → **Q.W-ENGINE-SPLIT (NOW, NOT VJ-L1-gated per O.W7.md:3): runs AFTER Q.W-NOLEGACY so it lifts a class body with no trailing**
- P.W9 NaN-frame deferred-resolution cure + PLAY-time guard + proof:named-selector-nan-frame born-RED gate → **Q.W-NANFRAME (NOW): internal ordering — (a) attach-time deferred-resolution (named phase→numeric % under a ScrollTimelin**
- P.W7 DemoControlPoint chain (retire useEasingCurveDrag onto the published drag2D primitive) — DAG-blocked on O.W5 → **Q.W-DEMOCTRLPOINT (NOW, 2-stage): stage 1 build DemoControlPoint.vue over the already-exported LIGHT drag2D + author pro**
- P.W10 leaves.ts /math externalization-trap (Arm A externalize vs Arm B documented-keep) → **Q.W-LEAVES-EXTERN (NOW): produce scripts/leaves-externalization-decision.json FIRST (Arm A: vite external-widen + proof:**
- P.W12 glass-ui S1 aria-suppress delete (3 files) + S2 dock-pointer delete — gated on glass-ui ≥4.1.0 + the SegmentedTabs aria root fix → **Q.W-GLASSUI-CONSUME (GATED): enabling-wave is a glass-ui DISPATCH (BC SegmentedTabs aria root fix + a real ≥4.1.0 publis**
- P Band C morph-scene demo showcase (dogfood fromMorphSVG) — primitive built + gated, scene unbuilt + ungated → **Q.W-MORPH-SCENE (NOW): build MorphScene.vue dogfooding fromMorphSVG; EXTEND proof:morphsvg-consume with a demo-scene cla**
- resolve-values.ts Phase-2 element-aware arm (if(style(--p)), sibling-index(), sibling-count(), attr()) → **Q.W-EMERGING-CSS-P2 (NOW): wire the second resolution pass through the element-dependent getComputedValue call site (the**
- value.js VJ-CSS3 contrast-color() + if() multibranch (MISSING from value.js 1.1.0 — verified absent in src + dist) → **Q-DISPATCH → value.js 1.2.0 (KF-TO-VALUEJS-Q): author the dispatch packet NOW; the kf-side consume wave (resolve-values.**
- P.W1 S1 eslint-flat + dep-cruiser lint-tier (eslint.config.mjs ABSENT — 3-tranche carry M→O→P→Q) → **Q.W-LINT-TIER (NOW): author eslint.config.mjs (import/no-cycle + no-restricted-imports for the LIGHT→value.js boundary) **

**Proposed waves:**
- [NOW] **Q.DAG0** — Author the Q DAG manifest (docs/tranches/Q/DAG.md) — a machine-readable node+edge list of every Q wave, its phase (NOW/DISPATCH/GATED), and its hard predecessors, with the 4 critic · gate: proof:dag-acyclic — parses DAG.md, asserts (a) no cycles, (b) every wave with phase GATED names a pu
- [NOW] **Q.W-NOLEGACY** — Drop the @deprecated Animation (engine.ts:1206) + ScrollTimeline/ScrollTimelineOptions (timeline.ts) aliases; migrate the 22 demo `import type { Animation }` consumers to Keyframes · gate: proof:no-legacy-surface — keystone builds the lib + asserts ZERO @deprecated on the rolled-up dist/k
- [NOW] **Q.W-ENGINE-SPLIT** — Lift the lifecycle/playback machine out of engine.ts (1397→~900) into engine-playback.ts; runs AFTER Q.W-NOLEGACY so the moved class body carries no trailing alias; Playhead deepen · gate: proof:engine-seam — asserts engine.ts ≤ ~950L AND engine-playback.ts exists AND the playback methods
- [NOW] **Q.W-NANFRAME** — Implement the NaN-frame deferred-resolution cure: attach-time named-phase→numeric-% mapping under a ScrollTimeline/ManualTimeline, then a PLAY-without-timeline NAMED_SELECTOR_NO_TI · gate: proof:named-selector-nan-frame — constructs a named-selector animation, asserts (a) fromString round
- [NOW] **Q.W-DEMOCTRLPOINT** — Build DemoControlPoint.vue over the already-LIGHT-exported drag2D (stage 1); retire the bespoke useEasingCurveDrag.ts CTM-transform onto it in the easing curve editor (stage 2, the · gate: proof:demo-control-point — runs the served demo, asserts a draggable handle exists, drives a real po
- [NOW] **Q.W-LEAVES-EXTERN** — Resolve the leaves.ts→/math externalization trap: pick Arm A (vite external-widen of @mkbabb/value.js/math + boundary allow-list + H4 rolldown smoke-test) or Arm B (documented-keep · gate: proof:boundary (extended W97 math-subpath-clean clause) + presence of leaves-externalization-decisio
- [NOW] **Q.W-EMERGING-CSS-P2** — Wire the resolve-values.ts Phase-2 element-aware pass (if(style(--p)), sibling-index(), sibling-count(), attr()) through the element-dependent getComputedValue call site; ENABLING  · gate: proof:emerging-css-element-aware — over a served element, asserts if(style(--custom)) resolves to th
- [NOW] **Q.W-FUNCTION-INLINE** — Wire the @function CALL-inlining arm in resolve-values.ts (lines 375/394 seam): bind params→substitute body using value.js extractFunctions (shipped 1.1.0); sequence AFTER Q.W-EMER · gate: proof:function-inline — compiles a keyframe using a registered @function --double(x), asserts the ca
- [NOW] **Q.W-MORPH-SCENE** — Build MorphScene.vue dogfooding fromMorphSVG (the P Band C showcase the primitive enables); extend proof:morphsvg-consume with a demo-scene clause. · gate: proof:morphsvg-consume (extended) — adds a clause asserting MorphScene.vue exists + consumes fromMor
- [NOW] **Q.W-LINT-TIER** — Author eslint.config.mjs (import/no-cycle + no-restricted-imports LIGHT→value.js) + .dependency-cruiser.cjs + proof:lint-clean; wire into proof:hygiene in ONE atomic commit (the M→ · gate: proof:lint-clean — runs eslint flat + dep-cruiser, asserts zero import cycles + zero LIGHT-source va
- [GATED] **Q.W-GLASSUI-CONSUME** — On a glass-ui ≥4.1.0 publish carrying the SegmentedTabs aria root fix: re-pin → author proof:glassui-segmentedtabs-aria-guard BEFORE the S1 delete → delete S1 aria-suppress (Spring · gate: proof:glassui-segmentedtabs-aria-guard — asserts the installed glass-ui SegmentedTabs no longer emit
- [DISPATCH] **Q-DISPATCH-VALUEJS** — Author KF-TO-VALUEJS-Q dispatch packet: VJ-CSS3 contrast-color() + if() multibranch (both MISSING from 1.1.0) for value.js 1.2.0; spec the kf-side consume wave (resolve-values.ts a · gate: proof:emerging-css-contrast (kf-side, GATED) — born-RED until value.js 1.2.0 ships contrast-color/mu

**Friction pre-empted:**
- FRICTION: engine-split over a class still carrying the @deprecated alias → the lift touches engine.ts:1206 region ambiguously. PRE-EMPT: Q.DAG0 hard-orders Q.W-NOLEGACY before Q.W-ENGINE-SPLIT (O.W9.m
- FRICTION: the 5.0.0 changelog asserting a breaking set that doesn't match the actual dropped aliases (the autonomous drive shipped 4.4.0 precisely because the alias-drops were deferred — a changelog/s
- FRICTION: the NaN-frame play-time guard throw landing BEFORE the attach-time deferred-resolution → breaks the L.W1 S4 opaque-ingest round-trip (this exact inversion caused a revert in the autonomous d
- FRICTION: deleting the leaves.ts duplicates + re-pointing to @mkbabb/value.js/math BEFORE widening the bundle-external → proof:boundary reds (the regex matches the subpath specifier in LIGHT source). 
- FRICTION: deleting the S1 aria-suppress while installed glass-ui still double-emits aria-orientation (installed is 4.0.1, NOT the 4.1.0 the plan assumed) → an a11y regression with no tripwire. PRE-EMP
- FRICTION: building the @function inline arm without the element-aware Phase-2 pass → a @function whose body reads a custom-prop / sibling-index hits the unbuilt Phase-2 seam mid-wave → a deferral. PRE
- FRICTION: P.W7 (retire useEasingCurveDrag) authored before O.W5 (DemoControlPoint) exists → no substrate, a mid-tranche stall. PRE-EMPT: Q.W-DEMOCTRLPOINT is a single 2-stage wave (build-the-primitive
- FRICTION: contrast-color() / if()-multibranch arms authored in resolve-values.ts before value.js 1.2.0 ships them → kf consumes an unpublished sibling surface (DAG violation). PRE-EMPT: Q-DISPATCH-VAL
- FRICTION: a transient proof:ci-coverage red window when the lint-tier gates are added but not yet wired into proof:hygiene. PRE-EMPT: Q.W-LINT-TIER authors eslint.config.mjs + .dependency-cruiser.cjs 

---

## B6-gate-coverage

**Verdict:** The gate INFRASTRUCTURE is in excellent shape and ready to carry Q with NO deferrals. Two system gates already mechanize the hard precepts: proof:chronic-closure enforces the P-invariant-28 exit-only mandate off a machine-readable Chronicity integer (every >=4-tranche chronic MUST land an EXIT-shaped, runtime-gate-backed disposition — so 'no deferrals in Q' is checkable, not aspirational), and proof:ci-coverage's bidirectional clauses guarantee every authored gate is wired into CI + proof:all. T

**Findings:**
- GATE-FIRST PATTERN IS HEALTHY: the shipped P-drive gates are strong observable/same-report born-REDs, not source-shape stubs. proof-soa-composite.mjs measures transformFramesGrouped's OWN add/weighted ratio (rejects the transplanted 3.86x SpringProgress number), asserts bit-ident
- DEFERRED-ITEM GATES ARE SPEC'D BUT ABSENT ON DISK: proof-no-legacy-surface.mjs, proof-named-selector-nan-frame.mjs, proof-waapi-differential.mjs, proof-lint-clean.mjs, proof-leaves-externalization.mjs ALL absent (verified). The FULL-LOOP-LEDGER already authored their exact born-R
- BLIND-SPOT (CRITICAL): the O.W7 engine-seam split has a gate that is actively UNDERMINED by a masking override. proof-decomposition.mjs:130-132 carries cap:1400 for engine.ts (currently 1397L), so the 1397L god-module passes GREEN today. A split wave whose gate is merely 'engine.
- BLIND-SPOT (appearance/interaction axis, the memory lesson): the deferred demo-fleet items P.W7 (DemoControlPoint chain) + P.W8 (N-Stage switcher + the UNBUILT mobile) are exactly the source-shape-green-but-visually-wrong class. proof-control-point-live.mjs exists but the P.W8 mo
- EMERGING-CSS PHASE-2 IS UN-GATED: proof-emerging-css-resolve-now.mjs covers ONLY the Phase-1 element-INDEPENDENT arm (if(supports/media)+spring()). resolve-values.ts:62-66 declares typed Phase-2 element-aware seams (style(--p), sibling-index(), sibling-count(), attr()) that are d
- CHRONIC-EXIT MACHINERY IS SOUND + ENFORCED: proof-chronic-closure.mjs already mechanizes the P-invariant-28 exit-only rule off a Chronicity-INTEGER column (line 251-277), requires EXIT-shaped dispositions for >=4-tranche rows, RUNTIME-gate-that-BIT for FOLD/VERIFY-ONLY rows, and 
- proof:ci-coverage IS BIDIRECTIONAL + WILL CATCH UN-WIRED Q GATES: every new proof:* must be invoked in ci.yml (clause 0) AND reachable from proof:all (clause 0b) or named in the EXCLUDED set. So a Q wave that authors a gate but forgets to wire it into proof:correctness/proof:hygi
- WEAK-GATE RISK (lint-clean placement): the FULL-LOOP-LEDGER brainstorm notes proof:lint-clean could go in proof:correctness OR proof:hygiene. For a no-legacy/no-workaround tranche the lint gate is hygiene-class (structural), but if it gates a CHRONIC closure it must ride proof:co
- NO REGRESSION in the gate roster from the 4.4.0 ship: proof:correctness gained emerging-css-resolve-now + spring-heatmap; proof:hygiene gained no-foreign-symbol-stamp + soa-composite + morphsvg-consume + portable-perf. proof:all (run-all.mjs --all) + the bidirectional ci-coverage

**Deferred/chronic terminalized:**
- O.W9 no-legacy alias drop (2 @deprecated alias families: engine.ts:1192 Animation, timeline.ts:163/209 ScrollTimeline/Options) + 22 demo consumer migration -> 5 → **Q wave Q.W-NOLEGACY: author proof:no-legacy-surface born-RED (npm run build then grep dist/keyframes.d.ts for ZERO @depr**
- P.W9 NaN-frame proper cure (deferred-resolution + PLAY-time guard, NOT the reverted parse-throw) → **Q wave Q.W-NANFRAME: author proof:named-selector-nan-frame born-RED (parse([]) yields NaN frames today; assert throw-or-**
- leaves.ts -> value.js/math TRAP (DP-6): internal/leaves.ts duplicates clamp/scale/lerp/lerpArray/deCasteljau/cubicBezier that value.js ./math exports, but proof → **Q wave Q.W-LEAVES: the W97 bundle-the-graph oracle decides Arm A (externalize @mkbabb/value.js/math as a bundle-external**
- P.W1 S1 eslint/dep-cruiser lint-tier (the structural lint gate never landed) → **Q wave Q.W-LINT: author proof:lint-clean born-RED (eslint --max-warnings 0 + eslint.config.mjs) — place in proof:hygiene**
- P.W12 dock click-strand + glass-ui SegmentedTabs aria-orientation double-emit (cross-repo, chronicity ~6: I,J,K,L,M,O->Q) → **Q HANDOFF ledger row: exit ONLY via a PUBLISHED glass-ui version (SegmentedTabs aria-guard SFC fix) + a kf consume-edge **
- emerging-CSS Phase-2 element-aware arm (style(--p), sibling-index/count(), attr()) — typed-seam-declared, UN-GATED → **Q wave Q.W-EMERGING2: extend resolve-values.ts to the element-DEPENDENT arm (the ctx.env element-reader seams at resolve**
- WAAPI-vs-rAF browser-divergence differential (the purely-JS replay oracles CANNOT detect browser divergence) → **Q wave Q.W-WAAPI-DIFF: author proof:waapi-differential born-RED over a 4-fixture WAAPI-eligible subset — compare kf at(0**

**Proposed waves:**
- [NOW] **Q.GATE-NOLEGACY** — author proof:no-legacy-surface born-RED (build then grep dist/keyframes.d.ts for ZERO @deprecated) backing the O.W9 alias-drop + 22-consumer migration · gate: proof:no-legacy-surface — RED on today's built d.ts (3 @deprecated aliases present); GREEN only when
- [NOW] **Q.GATE-ENGINE-SPLIT** — O.W7 engine-seam split gate that REMOVES the proof-decomposition.mjs cap:1400 override (the god-module mask) + asserts engine.ts<~900 + engine-playback.ts exists · gate: proof:decomposition with the cap:1400 override DELETED — RED today (engine.ts=1397L exceeds the base
- [NOW] **Q.GATE-NANFRAME** — author proof:named-selector-nan-frame born-RED (parse([]) NaN-frame, throw-or-finite at PLAY) + re-target proof:replay-equality:173-178 from source-shape regex to behavioral anchor · gate: proof:named-selector-nan-frame — RED today (Number.isFinite(start)===false on parse([]) with no thro
- [NOW] **Q.GATE-LEAVES** — W97 bundle-the-graph oracle decides leaves.ts externalization (Arm A) vs documented-keep (Arm B); record in scripts/leaves-externalization-decision.json · gate: proof:leaves-externalization / extended proof:boundary — the W97 graph oracle (bundle @mkbabb/value.
- [NOW] **Q.GATE-LINT** — author proof:lint-clean born-RED (eslint --max-warnings 0 + eslint.config.mjs) — the P.W1 S1 structural lint tier · gate: proof:lint-clean — RED on today's un-linted tree (warnings present); GREEN at zero warnings. proof:h
- [NOW] **Q.GATE-EMERGING2** — extend resolve-values.ts element-aware arm (style(--p)/sibling-index/count()/attr()) + author the Phase-2 born-RED clause so the Phase-1-only gate cannot pass vacuously · gate: proof:emerging-css-resolve-now Phase-2 clause — RED today (resolve-values.ts returns if() UNCHANGED 
- [GATED] **Q.GATE-WAAPI-DIFF** — author proof:waapi-differential born-RED — kf at(0.5) vs browser getKeyframes() over a 4-fixture WAAPI-eligible subset (the JS oracles cannot see browser divergence) · gate: proof:waapi-differential — born-RED via a deliberately-perturbed fixture; the real bite is the kf-vs
- [DISPATCH] **Q.GATE-DOCK-HANDOFF** — Q ledger HANDOFF row for the dock click-strand + glass-ui aria double-emit, gated by proof-workaround-deletion three-state + a kf consume-edge runtime aria gate · gate: proof:workaround-deletion dock+aria arms — PENDING until glass-ui publishes the SegmentedTabs aria-g
- [NOW] **Q.GATE-CHRONIC-LEDGER** — build the Q PROGRESS.md 'Open deferrals' ledger with the Chronicity-INTEGER column so proof:chronic-closure re-points to it and mechanically enforces the NO-deferrals-in-Q precept · gate: proof:chronic-closure re-pointed to Q/PROGRESS.md — every >=4-tranche row must carry an EXIT-shaped 
- [NOW] **Q.GATE-CI-WIRE** — wire every new Q gate into proof:correctness/proof:hygiene + ci.yml so proof:ci-coverage's bidirectional clauses stay GREEN · gate: proof:ci-coverage — RED if any new Q proof:* is in package.json but absent from ci.yml (clause 0) or

**Friction pre-empted:**
- FRICTION: Q.GATE-ENGINE-SPLIT could spawn a mid-tranche deferral if the split lands but the cap:1400 override is left in place 'temporarily' — the gate then passes vacuously and the god-module silentl
- FRICTION: the leaves.ts externalization (Q.GATE-LEAVES Arm A) reds proof-boundary.mjs assertion-1 (the isValueJs module-set filter flags the math chunk under node_modules/@mkbabb/value.js/) NOT just a
- FRICTION: Q.GATE-EMERGING2 (Phase-2 element-aware) needs a value.js published surface for style(--p)/sibling-index resolution that may not exist — a cross-repo dependency that could mid-tranche-defer.
- FRICTION: a new Q gate landed in proof:hygiene that actually closes a CHRONIC will pass chronic-closure's RESOLVE clause but FAIL the CORRECTNESS-TIER clause (rule 2 requires chronic-closing gates rid
- FRICTION: the WAAPI differential (Q.GATE-WAAPI-DIFF) is browser/device-dependent — on the slow Linux CI runner it will flake (render/timing variance, the device-dependence-greening lesson). A naive HA

---

## B6-completeness-critic — the backstop for the "NO deferrals in Q" mandate; sweep for any Q wave that would secretly spawn a mid-tranche deferral (a wave needing a not-yet-shipped sibling API, an unbounded scope, a measurement-not-taken gate, a chronic without a system-gate exit, a breaking change without a migration, a demo wave without an appearance-axis gate) and author the enabling/measure-first redress wave NOW.

**Verdict:** The shipped 4.4.0 drive is HONEST and the constellation spine is healthy (S8/S9 exited, value.js 1.1.0 + parse-that 0.12.0 consumed green), but the impl drive deferred a coherent set of NINE items, and EVERY ONE is a latent mid-tranche-deferral spring for Q: a stale/false gate (P.W7 'needs drag2D' — already shipped), an unbuilt 7-tranche chronic (DemoControlPoint), a breaking major with no migration (5.0.0 aliases), a never-wired measurement enforcer (proof:wave-charter), an engine chronic maske

**Findings:**
- STALE DEFERRAL PREMISE (false gate) — the run-board defers P.W7 DemoControlPoint as 'gated on a library drag2D LIGHT export', but drag2D IS ALREADY a LIGHT barrel export (src/animation/index.ts:88 `export { drag, Draggable, drag2D } from "./drag"`, re-exported from drag-2d.ts:462
- CHRONIC WITHOUT A SYSTEM-GATE EXIT — DemoControlPoint (O.W5/DM-2) is STILL UNBUILT after the drive (grep DemoControlPoint over demo/ src/ scripts/ = ZERO). This is the 7+-tranche P-inv-28 chronic (born E/C, carried D→...→P) whose ONLY terminal was O.W5, which the impl drive silen
- BREAKING CHANGE WITHOUT A MIGRATION ARTIFACT — O.W9/P.W10 (drop @deprecated Animation/ScrollTimeline/ScrollTimelineOptions/presets.flip aliases → 5.0.0 major) is deferred with NO migration codemod, NO MIGRATION.md, and a CONSUMER COUNT DRIFT: the run-board says '22 demo consumers
- MEASUREMENT-NOT-TAKEN GATE (the contrivance enforcer never landed) — the CONTRIVANCE-AUDIT's durable preventive proof:wave-charter (the 7-question pre-charter smell-test + the transplanted-ratio bite, CONTRIVANCE-AUDIT.md:53,154) is ABSENT (no scripts/proof-wave-charter.mjs, no p
- ENGINE-SPLIT MASKED BY ITS OWN OVERRIDE (a chronic hidden behind a green gate) — O.W7 (engine.ts 1397→~900) is deferred, and proof:decomposition.mjs carries a LIBRARY_CEILING_OVERRIDE cap:1400 (line 132) that masks the god-object: the file is 3L under cap and the KeyframesAnimati
- P.W13 PHASE-2 IS A WAVE SECRETLY NEEDING A NOT-YET-SHIPPED SIBLING API — resolve-values.ts shipped ONLY the element-INDEPENDENT arm (Phase 1: if(supports/media)+spring()). Phase 2 (if(style(--p)), sibling-index/count — the post-setTargets element-aware pass) is UNWIRED (the Resol
- CORRECTNESS CHRONIC WITHOUT A LANDED CURE — P.W9 NaN-frame (DM-22): the impl agent's parse-time throw broke the L.W1 S4 opaque-ingest contract and was REVERTED, so the NaN-always-active named-selector frame is STILL LIVE (confirmed by the FULL-LOOP probe at ledger line 507: fromS
- UNBOUNDED-SCOPE DEMO WAVE WITH A REAL APPEARANCE GATE (the one done right — strength) — P.W8 (N-Stage switcher + the entirely-unbuilt mobile) correctly carries a born-RED appearance-axis gate (proof:scene-switcher-mobile / the 390px live mobile-layout assertion over demo-driver.m
- NO-LEGACY TERMINAL ARTIFACTS ABSENT — P.W10's terminal home scripts/leaves-externalization-decision.json (the DP-6 leaves.ts→/math TRAP verdict, recording Arm A externalize vs Arm B documented-keep) does NOT exist, and proof:no-cross-realm-cast / proof:no-legacy-surface gates are
- STRENGTH — the constellation spine is HEALTHY and acyclic: S9 EXITED (parse-that production dep REMOVED from package.json, ZERO parse-that imports in src/animation/, proof:boundary clean), S8 TERMINAL shipped (WeakMap<ValueUnit,string>, proof:no-foreign-symbol-stamp green), value

**Deferred/chronic terminalized:**
- DemoControlPoint / O.W5 (DM-2) — the 7+-tranche chronic terminal, STILL UNBUILT; the false 'gated on drag2D' premise → **Q.W-CTRLPT (NOW): build DemoControlPoint over the ALREADY-LIGHT drag2D + keyboard-operable a11y axis; author the missing**
- O.W9/P.W10 alias-drop → 5.0.0 BREAKING — no migration artifact, consumer count drift (22 vs 23+keyframes-vue) → **Q.W-MIGRATE (NOW): author a codemod (jscodeshift/ts-morph) + MIGRATION.md + CHANGELOG 5.0.0 entry that renames Animation**
- P.W9 NaN-frame (DM-22) — correctness chronic; the parse-throw cure was reverted, NaN still live → **Q.W-NANFRAME (NOW): implement the deferred-resolution + PLAY-time guard cure (NOT a parse throw — preserves the L.W1 S4 **
- O.W7 engine.ts split (1397→~900) — chronic masked behind proof:decomposition cap:1400 override → **Q.W-ENGINESPLIT (NOW): lift concern-3 playback into engine-playback.ts via the bound-free-function host (KISS, not a Pla**
- P.W13 Phase-2 element-aware (if(style)/sibling-index/count) + @function call-inlining + VJ-CSS3 contrast-color/if-multibranch — split across kf + an unshipped v → **Q.W-EMERGE2 (kf NOW for sibling-* Phase-2; DISPATCH for value.js): wire the post-setTargets second call site for the ALR**
- P.W12 S1 aria (DM-5) + S2 dock (DM-1) — glass-ui consume; installed 4.0.1, aria-orientation unconditional → **Q.W-GLASSUI (NOW S2 re-pin once 4.1.0 installed; GATED S1): re-pin glass-ui ~4.0.0→~4.1.0 + npm install + delete the 9 d**
- proof:wave-charter — the contrivance smell-test enforcer never wired (the 'aggressively optimize' trap re-armed in Q) → **Q.W-CHARTER (NOW, lands FIRST): author scripts/proof-wave-charter.mjs as a docs-and-presence gate enforcing the 7-questi**
- leaves.ts→/math DP-6 TRAP — structurally-forced duplication with no recorded verdict (proof:boundary bans the /math subpath in LIGHT) → **Q.W-LEAVES (NOW): author scripts/leaves-externalization-decision.json recording the W97-measured verdict (Arm B document**

**Proposed waves:**
- [NOW] **Q.W-CHARTER** — Author proof:wave-charter (the 7-question pre-charter smell-test + transplanted-ratio bite) and wire it into proof:hygiene; lands FIRST so every Q perf wave is gate-protected from  · gate: proof:wave-charter — born-RED today (scripts/proof-wave-charter.mjs ABSENT, no package.json entry); 
- [NOW] **Q.W-CTRLPT** — Build DemoControlPoint over the already-LIGHT drag2D primitive with a keyboard-operable a11y axis; this terminates the 7+-tranche DM-2 chronic and UNBLOCKS P.W7 with zero sibling g · gate: proof:demo-control-point — born-RED on grep DemoControlPoint = ZERO (and the dead-premise proof:cont
- [NOW] **Q.W-MIGRATE** — Author the alias-drop codemod (ts-morph) + MIGRATION.md + CHANGELOG 5.0.0 entry covering all 23 demo consumers + the keyframes-vue peer, THEN drop the @deprecated Animation/ScrollT · gate: proof:no-legacy-surface — born-RED on the BUILT keyframes.d.ts still exporting the @deprecated alias
- [NOW] **Q.W-NANFRAME** — Cure DM-22 named-selector NaN frames via deferred-resolution + a PLAY-time guard (NOT a parse throw — preserves the L.W1 S4 opaque-ingest contract); the impl drive's parse-throw wa · gate: proof:named-selector-nan-frame — born-RED on the live probe fromString('@keyframes x{entry{}exit{}}'
- [NOW] **Q.W-ENGINESPLIT** — Lift engine.ts concern-3 (playback machine) into engine-playback.ts via a bound-free-function host (1397→~900); removes the proof:decomposition cap:1400 override that masks the god · gate: proof:decomposition with the LIBRARY_CEILING_OVERRIDE cap:1400 entry REMOVED — born-RED on the real 
- [DISPATCH] **Q.W-EMERGE2** — Wire the resolve-values.ts post-setTargets Phase-2 call site for the already-parseable sibling-index()/sibling-count() (feeding stagger) NOW; DISPATCH KF-TO-VALUEJS-Q for the @func · gate: proof:emerging-css-resolve-phase2 — born-RED on a sibling-index() input that resolves UNCHANGED toda
- [GATED] **Q.W-GLASSUI** — Re-pin glass-ui ~4.0.0→~4.1.0 + install + delete the 9 dock pointerHandled sites atomically (S2 root fix already published); HOLD S1 aria-suppress deletion GATED on the BC SFC role · gate: proof:workaround-deletion — S2 arm born-RED on the 9 live TransportDock pointerHandled sites; S1 arm
- [NOW] **Q.W-LEAVES** — Author scripts/leaves-externalization-decision.json recording the W97-measured DP-6 verdict (Arm B documented-keep, evidence-favored — externalize REDs proof:boundary), correct the · gate: proof:no-cross-realm-cast (+ the decision-JSON presence) — born-RED on leaves-externalization-decisi

**Friction pre-empted:**
- FRICTION: P.W7 (curve-editor dogfooding DemoControlPoint) would stall mid-Q because its substrate DemoControlPoint is unbuilt — and the run-board mislabels the blocker as 'a library drag2D LIGHT expor
- FRICTION: a Q '5.0.0 cut' wave would stall when it reaches 23+ scattered alias consumers with no automated transform and no migration doc (and the count itself is wrong in the run-board: 22 vs the ver
- FRICTION: a Q 'complete emerging-CSS' wave would discover mid-flight that @function call-inlining + contrast-color() + if()-multibranch need value.js arms that 1.1.0 did NOT ship (verified ABSENT in v
- FRICTION: any Q perf wave (a SoA-redux, a new compositor path, a typed channel) could re-charter on a transplanted ratio and force a mid-tranche measure-first reversal — the exact 3.86× trap the impl 
- FRICTION: a Q wave that touches engine.ts (e.g. a new playback feature) could silently push the KeyframesAnimation class past its 1100 cap (12L headroom today) or the file past 1400, discovering the O
- FRICTION: a Q glass-ui-consume wave could fire the S1 aria-suppress deletion before the BC SFC guard ships (installed glass-ui is still 4.0.1, aria-orientation unconditional), introducing a live ARIA-
- FRICTION: the P.W9 NaN-frame cure could re-spawn the same mid-tranche revert the impl drive hit (a naive parse-throw breaks the opaque-ingest contract). PRE-EMPT: Q.W-NANFRAME specs the cure as deferr
- FRICTION: a Q no-legacy wave could naively 'just import @mkbabb/value.js/math' to kill the leaves.ts duplication and RED proof:boundary mid-tranche (the gate bans the subpath in LIGHT source). PRE-EMP

---

## B6-band-structure

**Verdict:** PROCEED with an 8-band Tranche Q mirroring the O/P template but RE-PHASED for the post-impl-drive reality: A apparatus (lint-tier finally lands + drag2D LIGHT export + perf-floor) / B engine-perf + emerging-CSS Phase-2 / C demo-fleet (DemoControlPoint + mobile + N-Stage transposition) / D correctness (the proper NaN-frame deferred-resolution cure) / E no-legacy (the 5.0.0 terminal: alias drops + leaves.ts externalization) / F transposition (the O.W7 engine-seam split, SEPARATED from E so neither

**Findings:**
- GROUND-TRUTH DELTA: kf shipped 4.4.0 (MINOR), NOT the planned 5.0.0. The 5.0.0 breaking cut is UNDONE — it is the terminal of Q's no-legacy band. engine.ts is 1397L (O.W7 seam split never landed); 10 @deprecated alias sites remain (Animation/ScrollTimeline/ScrollTimelineOptions/p
- Q INHERITS A 16-ITEM DEFERRED SPINE from the impl drive (IMPL-RUN-BOARD.md:27-33 + the memory) — every one needs a Q wave with NO further deferral: (1) O.W7 engine.ts split 1397->~900; (2) O.W9 alias-drop -> 5.0.0 + 22-consumer migration; (3) P.W9 NaN-frame cure (deferred-resolut
- BAND STRUCTURE VERDICT: mirror the O/P 8-band template EXACTLY but RE-PHASE for Q's reality. The O/P bands were authored when most work was NOW-and-unbuilt; in Q, the engine/correctness/demo work is ALL NOW-executable (siblings already published 0.12.0/1.1.0), the ONE genuinely-G
- CONTRIVANCE-RISK / no-legacy reconciliation needed in the charter: O/P split no-legacy (E) and transposition (D) awkwardly (P folded them into one Band E, O kept O.W7 in Band D). For Q I recommend SEPARATING them: the engine.ts seam split (F-transposition, structural, no API delt
- STRENGTH: the deferred-ledger-P.md is already a near-complete Q intake — it tags every DM-1..DM-24 / DP-1..DP-6 / S1..S9 row with (a) tag, (b) named wave, (c) tripwire. Q's charter can adopt its TAG SET (FOLD-LANDED / BUILD-IN / HANDOFF / KILL / DISPATCH / VERIFY-ONLY / USER-DOMA
- CONTRIVANCE-RISK: the spring-vector-decision.json shows as MODIFIED in git status (uncommitted) — a stale decision artifact from the impl drive. Q's apparatus band should sweep these decision-JSONs (group-soa/typed-om/leaves-externalization) to FINAL committed state so the perf-g
- NO-LEGACY VIOLATION still live: useEasingCurveDrag.ts (bespoke CTM-transform drag composable in demo/@/components/custom/composables/) is the legacy the P.W7 DemoControlPoint chain was meant to RETIRE onto the published drag2D primitive. Shipping DemoControlPoint without deleting

**Deferred/chronic terminalized:**
- The Q BAND STRUCTURE itself (this lane's deliverable) — the 8-band skeleton folding all 16 deferred items + chronic ledger into bands → **Q.W0 (charter authoring wave) — the orchestrator authors Q.md from this skeleton; the band table + DAG + phase-axis + P-**
- O.W7 engine.ts seam split (1397->~900, lift playback machine into engine-playback.ts) — DEFERRED in impl drive as 'risky re-org' → **Q Band F (transposition) — Q.WF1; NOW phase, born-RED proof:decomposition (engine.ts<=900L)**
- O.W9 @deprecated alias-drop (Animation/ScrollTimeline/ScrollTimelineOptions/presets.flip) + 22-demo-consumer migration -> the 5.0.0 breaking cut → **Q Band E (no-legacy) -> Q.WE1 (alias drop + consumer migration) terminating at Q Band Z's 5.0.0 cut; NOW-author / USER-D**
- P.W9 NaN-frame cure (deferred-resolution + PLAY-time guard, NOT the reverted parse-throw) — frame-compiler.ts:449 explicitly carries this DEFERRED → **Q Band D (correctness) — Q.WD1; NOW phase, born-RED proof:named-selector-no-nan (throw-or-finite at PLAY, opaque-ingest **
- P.W10 leaves.ts bundle-externalization TRAP (@mkbabb/value.js/math as bundle-external, NOT a src import that would RED proof:boundary) → **Q Band E (no-legacy) — Q.WE2; NOW phase, born-RED proof:boundary W97 math-subpath-clean clause + vite.config external de**
- P.W1 S1 eslint-flat + dep-cruiser lint-tier (import/no-cycle + no-restricted-imports LIGHT-boundary) — the 4-tranche M->O->P carry, still absent → **Q Band A (apparatus) — Q.WA1; NOW phase, born-RED proof:lint-clean wired into proof:hygiene**
- P.W12 S2 dock-delete (NOW, root fix shipped 4.0.1) + S1 aria-suppress (GATED on glass-ui BC SegmentedTabs role=group SFC guard) → **Q Band G (consume) — Q.WG1 (S2 NOW) + Q.WG2 (S1 GATED on BC SFC guard; the ONE remaining gated edge)**
- P.W7 DemoControlPoint demo chain (easing curve-editor handle over LIGHT drag2D, dampingFraction:1) + retire useEasingCurveDrag bespoke composable → **Q Band C (demo-fleet) — Q.WC1; NOW phase (requires a LIGHT drag2D barrel-export decision in Q.WA2 first), born-RED proof**
- P.W8 N-Stage scene-switcher + entirely-unbuilt mobile (CSS scroll-snap carousel, zero max-width in scene-stage subtree) → **Q Band C (demo-fleet) — Q.WC2 (mobile scroll-snap NOW) + Q.WC3 (N-Stage dock-Select+VT transposition per contrivance-aud**
- value.js VJ-CSS3 contrast-color() + if() multibranch (the >2-clause if collapse) — a value.js 1.1.1/1.2.0 follow-up the kf resolve-values.ts Phase-1 stubs await → **Q Band G (consume/dispatch) — Q.WG3 (KF-TO-VALUEJS-Q dispatch packet, authored in-tree) + the GATED kf resolve-values mu**
- resolve-values.ts Phase-2 element-aware arm (if(style(--p)), sibling-index(), sibling-count()) — typed-but-stubbed at resolve-values.ts:62-67, the post-setTarge → **Q Band B (engine-perf+emerging-CSS) — Q.WB3; NOW phase (element context exists post-setTargets), born-RED proof:emerging**
- resolve-values.ts @function CALL-inlining seam (--ident(args) bind+substitute+evaluate) — registry threaded but call-parse value.js-P-gated; a typed seam awaiti → **Q Band G (consume) — Q.WG3 dispatch + the GATED resolve-values @function arm landing atomically on the value.js call-par**
- keyframes-vue 0.1.0 unpublished (DM-7, P-inv-28 belt, E404 at registry) + peer floor bump to >=5.0.0 → **Q Band Z (close) — Q.WZ; USER-DOMAIN publish after the 5.0.0 cut, peer floor >=5.0.0**

**Proposed waves:**
- [NOW] **Q.W0** — Charter + band-structure synthesis: author Q.md from this 8-band skeleton (A apparatus / B engine-perf+emerging-CSS-Phase2 / C demo-fleet / D correctness / E no-legacy / F transpos · gate: proof:chronic-closure (CHRONIC_LEDGER repointed P->Q; the 3 planted-malformed-row probes RED then re
- [NOW] **Q.WA1** — Apparatus: land the M->O->P-carried eslint-flat + dep-cruiser lint-tier (import/no-cycle + no-restricted-imports for the LIGHT-imports-value.js boundary) + commit the stale decisio · gate: proof:lint-clean (born-RED: no eslint.config.mjs exists today) wired into proof:hygiene; proof:ci-co
- [NOW] **Q.WA2** — Apparatus: decide + ship the LIGHT drag2D barrel-export contract (drag2D is exported at index.ts:88 but undocumented as LIGHT) so DemoControlPoint has a published, boundary-clean p · gate: proof:boundary (drag2D entry bundles with zero static value.js edge) + proof:published-surface (drag
- [NOW] **Q.WB1** — Engine-perf: the perf wins NOT yet shipped — verify the SoA add/weighted fold (2.54x/2.35x, already landed) holds + close any remaining MEASURE-FIRST spike (Typed-OM KILLed, _style · gate: proof:soa-composite (portable same-report ratio over transformFramesGrouped) + proof:portable-perf (
- [NOW] **Q.WB3** — Emerging-CSS Phase 2: wire the typed-but-stubbed element-aware arm (if(style(--p)), sibling-index(), sibling-count()) as the post-setTargets second resolution pass — ONE rewriter,  · gate: proof:emerging-css-phase2 (born-RED: a sibling-index() keyframe resolves to the wrong value today; G
- [NOW] **Q.WC1** — Demo-fleet: build DemoControlPoint.vue over LIGHT drag2D (dampingFraction:1 critically-damped) as the easing curve-editor draggable handle AND atomically DELETE the bespoke useEasi · gate: proof:demo-control-point (born-RED: component absent today) + proof:easing-curve-editor (live-drag e
- [NOW] **Q.WC2** — Demo-fleet: build the entirely-unbuilt mobile layer — CSS scroll-snap carousel for the N-Stage scene-switcher (zero max-width in the scene-stage subtree today) with typed-direction · gate: proof:scene-switcher-mobile (born-RED: 390px viewport has no scroll-snap-type, cards overflow; GREEN
- [NOW] **Q.WC3** — Demo-fleet: N-Stage switcher transposition per the contrivance-audit RE-SCOPE — enhance the dock Select with a SpringProgress + view-transition morph (NOT revive the 3500-LOC 3D-ri · gate: proof:n-stage-switcher (GATE-ZERO: the STAGE-SPEC perf trace decides ring-vs-dock-Select; the chosen
- [NOW] **Q.WD1** — Correctness: the PROPER NaN-frame cure (frame-compiler.ts:449's named deferral) — deferred-resolution mapping named phase->numeric % under a ScrollTimeline/ManualTimeline at attach · gate: proof:named-selector-no-nan (born-RED: parse([]) yields NaN frame-times today; GREEN when sample-tim
- [NOW] **Q.WE1** — No-legacy: drop the 10 @deprecated alias sites (Animation/ScrollTimeline/ScrollTimelineOptions/presets.flip) + migrate the 22 demo consumers to the canonical names — the breaking s · gate: proof:changelog-5.0.0 (born-RED: asserts the breaking alias-drop set is documented) + proof:publishe
- [NOW] **Q.WE2** — No-legacy: the leaves.ts bundle-externalization TRAP — teach the LIGHT build to treat @mkbabb/value.js/math as a bundle-external (provably grammar-free), NOT a src import that REDs · gate: proof:boundary W97 math-subpath-clean (born-RED: leaves.ts present + /math not externalized; GREEN w
- [NOW] **Q.WF1** — Transposition: the O.W7 engine-seam split — lift the lifecycle/playback machine off the frame-compile facade (engine.ts 1397->~900, engine-playback.ts), this-bound re-derive preser · gate: proof:decomposition (born-RED: engine.ts>900L today under the 1400 override; GREEN at <=900L with th
- [NOW] **Q.WG1** — Consume: delete the S2 dock-pointer interim (onPlayPointerDown/pointerHandled in TransportDock.vue) atomically on the glass-ui BC re-pin — the useDockClickIntegrity root fix shippe · gate: proof:workaround-deletion S2 arm (content-present probe: useDockClickIntegrity in dist; S2=GREEN aft
- [GATED] **Q.WG2** — Consume: delete the S1 aria-suppress (SpringSidebar.vue:43 + AnimationControls.vue:72) — GATED on glass-ui BC shipping the SegmentedTabs role=group conditional aria guard (the ONE  · gate: proof:workaround-deletion S1 arm (RETARGETED to content-present guard probe, not version; PENDING un
- [DISPATCH] **Q.WG3** — Consume/dispatch: author KF-TO-VALUEJS-Q.md (VJ-CSS3 contrast-color() + if() multibranch + @function call-parse/extractFunctions) + land the GATED kf resolve-values arms (multibran · gate: proof:emerging-css-multibranch (born-RED: a 3-clause if() collapses today; GREEN on value.js publish
- [GATED] **Q.WZ** — Close + the 5.0.0 cut: bump 4.4.0->5.0.0 (major — the alias drops + named-selector-refusal semantic), Oscillator/additive tail in published dist, keyframes-vue publish (peer >=5.0. · gate: proof:changelog-5.0.0 (born-RED until the 5.0.0 entry exists) + proof:keyframes-vue-published (E404 

**Friction pre-empted:**
- FRICTION: Q.WC1 (DemoControlPoint) DAG-blocks on a LIGHT drag2D barrel export — without it the demo build either reaches into a non-LIGHT surface (boundary breach) or the curve-editor handle has no pu
- FRICTION: Q.WF1 (engine.ts split) and Q.WE1 (alias drop) both rewrite engine.ts surface — if sequenced naively they collide (the split moves the @deprecated Animation export the alias-drop deletes). P
- FRICTION: Q.WD1 (NaN-frame cure) touches the parse->play pipeline that P.W9's reverted parse-throw already broke once (the L.W1 S4 opaque-ingest contract). A naive re-attempt re-breaks fromString roun
- FRICTION: Q.WG3 (value.js VJ-CSS3 + @function call-parse) is a cross-repo DISPATCH — if Q treats the kf resolve-values multibranch/@function arms as NOW, they stall on the unpublished sibling (the exa
- FRICTION: Q.WZ (5.0.0 cut) is GATED on Q.WE1 (alias drop) + the GATED edges (Q.WG2 S1 aria, Q.WG3 value.js) resolving — if any GATED edge slips, the close stalls indefinitely (the perpetual-punt risk 
- FRICTION: the Q apparatus band must ratify the perf-gate floor (portable-perf helper) BEFORE Bands B/C/F open, or a regression in the engine split / SoA hold stays green (the device-dependence + trans

---

## B7-honesty-record

**Verdict:** The tranche record is PARTIALLY HONEST but has SYSTEMATIC STALENESS from a failure to update development-phase docs after the 4.4.0 impl drive. The most severe honesty failures are: (1) IMPL-RUN-BOARD.md Phase table still shows 3a/3b/4 as PENDING despite the 'DRIVE COMPLETE' section below it — an internal self-contradiction in the primary impl record; (2) P/PROGRESS.md and O/PROGRESS.md still carry 'DEVELOPMENT PHASE' headers and the O/PROGRESS.md wave board for O.W7 contradicts O.md on gating; 

**Findings:**
- IMPL-RUN-BOARD.md INTERNAL CONTRADICTION: The Phase ledger table (lines 16-18) still shows rows 3a / 3b / 4 as '⬜ PENDING', but the success section below (lines 20-25) says 'DRIVE COMPLETE — All 4 phases shipped + verified + live.' The table was never updated to ✅ DONE after the 
- IMPL-RUN-BOARD.md OVER-CLAIM in Phase 3a scope: Row 3a (line 16) lists 'O.W5 DemoControlPoint' as a 3a deliverable. DemoControlPoint.vue is ABSENT from the tree (find demo -name DemoControlPoint.vue → empty). The deferred list (line 32) correctly says it did NOT ship. The table s
- P/PROGRESS.md STALE HEADER: Line 3-4 says 'Branch: tranche-p-dev (P development phase rides the O dev tip; O is RATIFIED — DEVELOPMENT phase docs locked 2026-06-20; O implementation NOT yet authorized)' and line 5 says 'DEVELOPMENT PHASE.' kf 4.4.0 shipped on 2026-06-23 implement
- P/PROGRESS.md STALE VERSION: Line 13 says 'Version in tree: 4.3.0 (the K close cut, unchanged through O dev phase).' Actual version is 4.4.0 (package.json confirmed). The claimed 5.1.x version plan also did not materialize; the drive shipped as 4.4.0 MINOR.
- O/PROGRESS.md STALE HEADER: Line 7 says 'DEVELOPMENT PHASE.' The O.W6 fromMorphSVG chronic terminal was built as part of the 4.4.0 impl drive (morph-svg.ts exists, commit 69ca7bf). The O/PROGRESS.md was never updated to reflect partial implementation.
- O/PROGRESS.md ↔ O.md INTER-DOC CONTRADICTION on O.W7 gating: O/PROGRESS.md wave board (line 77) tags O.W7 as 'GATED (VJ-P)' with 'Unblocked by VJ-L1 flatLeaf.' O.md (line 97) says 'NOW (all three — VJ-L1 gate removed from O.W7; see CONTRIVANCE-AUDIT.md #3)'. The PROGRESS.md wave 
- proof-chronic-closure.mjs DOUBLE-STALE LEDGER POINTER: CHRONIC_LEDGER (line 114) points at docs/tranches/L/PROGRESS.md; LEDGER_LABEL (line 468) says 'K/PROGRESS.md'. Both are wrong. O.WZ was supposed to re-point to O/PROGRESS.md; P.WZ was supposed to re-point to P/PROGRESS.md. Ne
- CLAUDE.md HEAVY surface list STALE: Line 74 lists 'Animation' as the canonical HEAVY export. 'Animation' is the @deprecated PKG-3 backward-compat alias (engine.ts:1205 exports 'KeyframesAnimation as Animation'). 'KeyframesAnimation' is the canonical name. CLAUDE.md should lead wi
- CLAUDE.md HEAVY surface list MISSING fromMorphSVG/MorphSVG: The HEAVY list (line 74) does not include 'MorphSVG'/'fromMorphSVG', which shipped in 4.4.0 (morph-svg.ts, load-engine.ts:153-154, commit 69ca7bf). The list was not updated post-implementation.
- CLAUDE.md LIGHT surface list MISSING Oscillator/waveformValue: The LIGHT list (line 73) does not include Oscillator or waveformValue. Both are exported from src/animation/index.ts:74 ('export { Oscillator, waveformValue } from ./oscillator'). Oscillator was a chronic item (DO-6 i
- CLAUDE.md LIGHT surface list MISSING drag2D: Line 73 lists 'drag'/'Draggable' but omits drag2D. src/animation/index.ts:88 exports 'drag, Draggable, drag2D' from './drag'. drag2D is a public LIGHT export and is missing from the CLAUDE.md inventory.
- CLAUDE.md LIGHT surface list uses DEPRECATED alias ScrollTimeline: Line 73 lists 'ScrollTimeline' as the LIGHT export. The canonical name is 'KeyframesScrollTimeline' (timeline.ts:189); 'ScrollTimeline' is the @deprecated PKG-3 alias (timeline.ts:218). CLAUDE.md should list 'Keyf
- CLAUDE.md file tree comment STALE for engine.ts: Line 24 says 'engine.ts # HEAVY: Animation + CSSKeyframesAnimation'. 'Animation' is the deprecated alias; canonical is 'KeyframesAnimation'. MorphSVG is now a co-resident HEAVY front door (morph-svg.ts), not in engine.ts, so that i
- CLAUDE.md file tree comment STALE for timeline.ts: Line 43 says 'timeline.ts # Timeline (abstract), ScrollTimeline, ManualTimeline'. Should be 'KeyframesScrollTimeline, ScrollTimeline (deprecated alias), ManualTimeline'.
- MEMORY.md Tranche P entry STALE 'IMPL NOT authorized': The Tranches section (line 52) says 'IMPL NOT authorized.' kf 4.4.0 shipped on 2026-06-23 (memory file project_constellation_impl_drive_shipped.md line 64 correctly records this). The Tranche P memory bullet was not updated.
- MEMORY.md Tranche O entry STALE 'IMPL NOT yet authorized': Line 55 says 'IMPL NOT yet authorized.' O.W6 fromMorphSVG (the O.W6 chronic terminal) shipped in 4.4.0. The Tranche O bullet should say 'PARTIALLY IMPLEMENTED' — fromMorphSVG shipped; engine split (O.W7), DemoControlPoint
- MEMORY.md Tranche P entry MENTIONS DROPPED ITEMS: Line 52 describes the P plan as including 'Playhead/Typed-OM'. The Contrivance Audit DROPPED the Playhead value-object and KILLED the Typed-OM write path (measured 0.69x in a real browser) BEFORE implementation. The memory entry w
- DM-2 DemoControlPoint is the ABSOLUTE terminal (8+ carries): The IMPL-RUN-BOARD deferred list (line 32) correctly notes DemoControlPoint is NOT built. P/PROGRESS.md §3 P-inv-28 table marks it as BUILD-IN ABSOLUTE terminal with 'no further carry.' Q inherits this unambiguous BUILD
- O.W9 @deprecated alias drop is DEFERRED: engine.ts:1205 'export { KeyframesAnimation as Animation }' and timeline.ts:218 'export { KeyframesScrollTimeline as ScrollTimeline }' plus type alias timeline.ts:171 remain. The IMPL-RUN-BOARD (line 28) correctly defers this. This is the 
- P.W9 NaN-frame cure is DEFERRED: proof-named-selector-nan-frame.mjs does not exist. The NaN frame defect (entry/exit named selectors producing NaN times in frame-compiler.ts) remains live. The IMPL-RUN-BOARD correctly records this as deferred with note that the parse-time throw w
- proof-demo-control-point.mjs gate is MISSING: The O.W5 wave was supposed to author this gate born-RED. Neither the gate script nor DemoControlPoint.vue shipped. This means the P-inv-28 chronic terminal (DM-2) has no closure oracle at all — neither the gate nor the implementation 
- STRENGTH — project_constellation_impl_drive_shipped.md is accurate: This memory file correctly records what shipped (4.4.0 MINOR, fromMorphSVG, SoA, WeakMap, _styleOut, S9 dep removal, emerging-CSS, spring heatmap, demo fleet), what was deferred (O.W7/O.W9/P.W9/P.W12/DemoControlP
- STRENGTH — CLAUDE.md test/bench counts are accurate: 92 test files (verified), 9 bench files (verified), note says 'O+P impl-drive' as the count anchor with correct instruction to derive rather than trust — good practice.
- STRENGTH — IMPL-RUN-BOARD.md deferred section is honest: The 'HONEST DEFERRED FOLLOW-UPS' section (lines 27-33) and 'Last-completed leg' section (lines 36-41) accurately list what shipped vs. what did not, with correct technical rationale for each deferral. The contradiction is o

**Deferred/chronic terminalized:**
- DM-2 DemoControlPoint.vue BUILD-IN (ABSOLUTE terminal, 8+ tranche carry): proof-demo-control-point.mjs gate ABSENT + DemoControlPoint.vue ABSENT — neither gate  → **Q.W0 record-hygiene MUST note the missing gate script as a Q BUILD-IN obligation; the gate (born-RED on absent component**
- O.W9 @deprecated alias drop (Animation / ScrollTimeline / ScrollTimelineOptions re-exports, engine.ts:1205 + timeline.ts:218 + timeline.ts:171): the 5.0.0 major → **Q wave that closes the 5.0.0 major cut — a dedicated Q.Wx 'no-legacy close + 5.0.0 publish' wave**
- O.W7 engine.ts split (1397L → ~900L into engine-playback.ts): engine-playback.ts ABSENT, engine.ts still 1397L, IMPL-RUN-BOARD correctly defers this as 'risky r → **Q.Wx engine-seam wave (NOW — not VJ-L1-gated per CONTRIVANCE-AUDIT; executable any time)**
- P.W9 NaN-frame cure (DM-22): named-selector/entry/exit produces NaN frame times in frame-compiler.ts; proof-named-selector-nan-frame.mjs ABSENT, the parse-time  → **Q.Wx correctness wave (NOW — kf-internal, deferred-resolution + PLAY-time guard)**
- proof-chronic-closure.mjs LEDGER_LABEL='K/PROGRESS.md' + CHRONIC_LEDGER=L/PROGRESS.md: triple-stale pointer (K label reading L data when substrate should be Q/P → **Q.W0 record-hygiene wave — re-point CHRONIC_LEDGER to Q/PROGRESS.md and correct LEDGER_LABEL atomically**
- P.W12 S2 dock workaround (DM-1 RF-17, chronicity 6+): TransportDock.vue still carries the useDockClickIntegrity HANDOFF comments; S2 delete not executed in the  → **Q.Wx glass-ui BC consume wave (GATED on BC cut confirming useDockClickIntegrity in installed dist)**

**Proposed waves:**
- [NOW] **Q.W0** — Record-hygiene wave: (S1) update IMPL-RUN-BOARD.md Phase table rows 3a/3b/4 from ⬜ PENDING to ✅ DONE with accurate delivery scope (removing O.W5/O.W9/O.W7/P.W7/P.W8/P.W9/P.W10/P.W1 · gate: proof:record-hygiene (NEW): (a) grep P/PROGRESS.md for '4.3.0' — must return zero hits (stale versio
- [NOW] **Q.W1** — No-legacy close + 5.0.0 major cut: (S1) drop the 3 @deprecated alias re-exports: engine.ts:1205 'export { KeyframesAnimation as Animation }' deleted, timeline.ts:218 'export { Keyf · gate: proof:changelog-5.0.0 (NEW): imports the built dist; asserts that dist/keyframes.d.ts does NOT conta
- [NOW] **Q.W2** — DemoControlPoint BUILD-IN (DM-2 ABSOLUTE terminal): (S0) born-RED gate first — proof-demo-control-point.mjs must exist and fire RED on the absent component before any source is wri · gate: proof:demo-control-point (NEW, authored at Q.W0): ls demo/@/components/DemoControlPoint.vue → ENOENT
- [NOW] **Q.W3** — NaN-frame cure (DM-22 / P.W9): (S1) author proof:named-selector-nan-frame gate born-RED (construct a CSSKeyframesAnimation with entry/exit named selectors, call parse([]), assert N · gate: proof:named-selector-nan-frame (NEW): construct 'new CSSKeyframesAnimation().fromString('@keyframes 
- [NOW] **Q.W4** — Engine-seam split (O.W7): lift the playback machine (RAFPlayback ownership, the lifecycle methods play/pause/resume/drive/loop, and the frame-dispatch cadence) out of engine.ts (~8 · gate: proof:decomposition (EXISTING — extend): the LIBRARY_CEILING_OVERRIDE entry for engine.ts is removed

**Friction pre-empted:**
- Q.W0 FRICTION — proof-chronic-closure.mjs re-point is self-referential: the gate must read Q/PROGRESS.md but Q/PROGRESS.md doesn't exist yet at Q.W0 time. PRE-EMPT: author a minimal Q/PROGRESS.md stub
- Q.W0 FRICTION — MEMORY.md updates require a separate /update-memory call: the memory system is not a file on disk that can be patched with Edit. PRE-EMPT: the Q.W0 wave should produce a MEMORY-UPDATE-
- Q.W1 FRICTION — 22 demo consumers of deprecated Animation alias: the alias drop will break demo imports. PRE-EMPT: run 'grep -rn "import.*\bAnimation\b" demo/' as Q.W1 S0 to enumerate ALL consumers; b
- Q.W1 FRICTION — load-engine.ts EngineCore/AnimationEngine interface fields: removing 'Animation: typeof Animation' from the public return type of loadAnimationEngine() is a BREAKING API change (consum
- Q.W2 FRICTION — DemoControlPoint needs drag2D from LIGHT surface: drag2D is already exported from index.ts:88, so the substrate is present. However, the CONTRIVANCE-AUDIT noted that drag2D was 'no-liv
- Q.W3 FRICTION — the PLAY-time guard vs parse-time guard distinction: the impl drive reverted a parse-time throw because it broke the L.W1 S4 opaque-ingest contract (a stylesheet with named selectors m
- Q.W4 FRICTION — engine.ts split risks 912-test regression: any lift of playback machine methods risks breaking the timing contract for tests in test/engine-correctness.test.ts and test/compose*.test.t

---

## B1-parsethat-packrat

**Verdict:** NOT TERMINAL — the PT-B1 cure resolves the cross-input soundness BLOCKER correctly for the non-re-entrant single-parse path (12 tests + gate green, value.js consumes green), but it is NOT a terminal fix. The per-memoizeFn-call src-epoch guard (packrat.ts:281) introduces a re-entrancy REGRESSION proven by live probe: a nested memoized .parse(differentSrc) mid-grow throws TypeError at packrat.ts:249 because the nested reset wipes the outer in-progress grow. This is exactly the arm the ledger warne

**Findings:**
- CRITICAL / NOT-TERMINAL — the src-epoch guard introduces a re-entrancy REGRESSION (a throw, not a stale answer). packrat.ts:281-284 fires resetPackrat() per-memoizeFn-call whenever state.src !== CURRENT_SRC. A memoized parser that runs a nested top-level .parse(differentSrc) mid-
- The FULL-LOOP-LEDGER explicitly recommended the SAFE arm and it was NOT taken. FULL-LOOP-LEDGER.md:797 states the cure should reset 'at the parseState ENTRY boundary, not per-memoizeFn-call, for zero per-node cost'. A parseState-entry reset (parser.ts:33-34, where each top-level 
- The try/finally hardening that the ledger folded INTO PT-B1 was NOT implemented. FULL-LOOP-LEDGER.md:457 names 'the try/finally around evalParser' as a 'load-bearing correctness item that should be explicitly named within PT-B1's cure section'. grep confirms ZERO try/finally/catc
- float64 multiply-key boundary claim is off-by-one. packrat.ts:62-63 comment claims `id * 2^20 + offset` is 'exact for id up to 2^33 with offset < 2^20'. Live probe: at id=2^33 exactly, offset=5, the key is 2^53+5 which is NOT float64-exact (mantissa gap=2), and `% MEMO_OFFSET_SPA
- The `% MEMO_OFFSET_SPAN`-vs-`& MEMO_MAX_OFFSET` justification at packrat.ts:64-66 is technically WRONG (though the chosen `%` is fine). The comment claims `& MEMO_MAX_OFFSET` 'would re-truncate to int32 on a large key'. Live probe over 200k ids: `&` NEVER disagrees with `%` for v
- RESIDUAL HAZARD — sources >= 2^20 (1,048,576 chars) silently alias memo cells. packrat.ts:67 masks the offset with `& MEMO_MAX_OFFSET` (20 bits). Live probe: getCijKey(1, 2^20+3) === getCijKey(1, 3) (true). A memoized parse of a >1MB source mis-restores cells from offsets 1MB apa
- STRENGTH — the cross-input soundness fix itself is correct and minimal for the non-re-entrant path. All 12 memoize/reentrancy tests pass; the born-RED gate proof:packrat-cross-input exercises the real built barrel; the (id, offset) keying + the int32-overflow (id>=4096) multiply-
- STRENGTH — recovery is total. After the re-entrancy throw, a manual resetPackrat() fully restores correctness (verified: a fresh independent parse post-crash returns the right answer). The blast radius is confined to the in-flight re-entrant parse; the module is not permanently p

**Deferred/chronic terminalized:**
- The re-entrancy regression: src-epoch per-node reset wipes an outer in-progress grow when a nested .parse(differentSrc) runs mid-grow (throw at packrat.ts:249). → **Q.W-PACKRAT-REENTRANCY (NOW) — move the reset to the parseState entry boundary OR scope the epoch to a parse-stack depth**
- The try/finally hardening around evalParser/growLR, flagged in FULL-LOOP-LEDGER.md:457 as 'folded into PT-B1' but never implemented — leaves LR_STACK/GROWING/HE → **Q.W-PACKRAT-REENTRANCY (NOW) — same wave; the unwind-on-throw is part of the re-entrancy cure, not a separate item.**
- The 1MB-source offset truncation (offset & 2^20-1) aliases memo cells for inputs >= 1,048,576 chars — a silent-wrong-answer residual. → **Q.W-PACKRAT-KEY (NOW) — widen the offset budget to the float64 mantissa headroom (or guard+throw on offset >= span); bor**
- The float64 boundary off-by-one comment + the wrong `&`-vs-`%` justification at packrat.ts:62-66. → **Q.W-PACKRAT-KEY (NOW) — comment correctness rides the same key-hardening wave (no behavior change for the comment, but t**
- The lane's WeakRef-epoch question: is a WeakRef-epoch lifecycle needed to harden the cure? The ledger (FULL-LOOP-LEDGER.md) PARKED arm (b) WeakRef-epoch as 'Fin → **Q.W-PACKRAT-REENTRANCY (NOW) — the wave's spec explicitly REJECTS WeakRef-epoch (async GC timing is wrong for a synchron**

**Proposed waves:**
- [DISPATCH] **Q.W-PACKRAT-REENTRANCY** — Make the packrat cross-input cure re-entrancy-safe by replacing the per-memoizeFn-call src-epoch guard (packrat.ts:281-284) with a SYNCHRONOUS parse-stack epoch. Two viable forms,  · gate: proof:packrat-reentrant — a memoized LR parser whose .map runs a nested memoize().parse(differentSrc
- [DISPATCH] **Q.W-PACKRAT-KEY** — Harden getCijKey (packrat.ts:56-68) against the 1MB-source offset-truncation residual and correct the two comment defects. Either (a) widen the offset budget: float64 affords ~53 b · gate: proof:packrat-large-offset — memoize a parser, parse a source of length > current MEMO_OFFSET_SPAN, 
- [GATED] **Q.W-PACKRAT-GATE-WIDEN** — Widen scripts/proof-packrat-cross-input.mjs (or split into a proof:packrat roster) to assert the full PT-B1 surface against the BUILT barrel: the re-entrancy invariant from Q.W-PAC · gate: The widened gate IS the born-RED artifact — it must RED on the current 0.12.0 tree (re-entrant claus

**Friction pre-empted:**
- FRICTION: Q.W-PACKRAT-REENTRANCY changes where the reset fires (parseState entry vs per-node). If it lands AFTER the gate-widen (Q.W-PACKRAT-GATE-WIDEN), the new born-RED reentrancy assertion will blo
- FRICTION: the parseState-entry-reset form (arm a) requires touching parser.ts (parseState, parser.ts:33) which is the hot default path — a careless guard could re-introduce the per-parse MEMO.clear() 
- FRICTION: widening the offset budget (Q.W-PACKRAT-KEY arm a) changes the numeric key space, which could perturb any cached/serialized key assumptions or the getCijKey unit tests in memoize.test.ts:161

---

## B1-valuejs-cssgaps

**Verdict:** Both lane gaps are REAL, SMALL, and ADDITIVE — neither blocks anything published, and both have complete eager-eval infrastructure already on the value.js tree to model against. VJ-CSS3 (contrast-color L7) is the higher-value gap: it parses ONLY as an opaque verbatim FunctionValue today (color.ts has ZERO contrast handling; C7 test asserts parse-only), leaving the library behind a Baseline-April-2026 feature for the first time — and it drags a no-legacy violation (the dead unwired colorContrast 

**Findings:**
- GAP (VJ-CSS3 confirmed ABSENT): contrast-color() does NOT eagerly evaluate to a concrete Color. grep for colorContrast/contrast in value.js/src/parsing/color.ts returns ZERO — the only contrast handling is the generic handleFunc fall-through, which emits a VERBATIM FunctionValue(
- NO-LEGACY VIOLATION (the dead stub): grammars/css-color.bbnf:95-101 defines `colorContrast = 'color-contrast'(...vs...)` — the never-shipped CSS Color L6 legacy `color-contrast()`. It is NOT wired into color.ts's combinator dispatch (grep colorContrast in color.ts → ZERO) and not
- GAP (VJ-CSS4 confirmed lossy): if() collapses to first-consequent + first-else, dropping the middle. value.js/src/parsing/index.ts:336-348 — splitIfClauses (255-295) correctly computes the FULL ordered clause array `clauses` (N branches, each {condition, value}), but handleIf the
- DOWNSTREAM CONSUMER ALREADY BLOCKED ON CSS4: kf's resolve-values.ts:334-367 (resolveIf) hard-codes the 2-branch shape `vals[0]=cond, vals[1]=consequent, vals[2]=else` (lines 340-342) with the explicit self-documenting comment at :330-332 'value.js's if() producer is lossy for >2 
- STRENGTH: the eager-eval infrastructure for contrast-color() already exists in value.js. units/color/index.ts has RGBColor (545) + LinearSRGBColor (782) + color2() conversion; the color-mix() combinator (color.ts:449-499) is a complete, gated template for an eager FunctionValue→C
- CONTRIVANCE-RISK: the existing units/color/contrast.ts (computeSafeAccent/safeAccentColor, exported at index.ts:151-155) is OKLab-LIGHTNESS-distance based (DEFAULT_MIN_CONTRAST=0.35 in OKLab L, contrast.ts:8-11), NOT WCAG sRGB-relative-luminance. The L7 contrast-color(<color>) sp
- DISPATCH-DOC HYGIENE (incomplete spec, FULL-LOOP flagged but verify-on-tree): KF-TO-VALUEJS-P.md version-split table (442-447) lists only VJ-L3→1.1.0, VJ-P1/VJ-P3→1.2.0 — the VJ-CSS rows (401-404) carry NO version-column value (confirmed: lines 401-402 rightmost cell is 'kf inher
- VERSION-COHERENCE: kf 4.4.0 pins ^1.1.0 (package.json verified). A caret pin auto-consumes 1.1.x AND 1.2.x. So VJ-CSS3 (contrast-color, additive) shipped as 1.1.1 is consumed transparently by the existing kf pin with NO kf re-pin needed; VJ-CSS4 (if multibranch, additive producer

**Deferred/chronic terminalized:**
- VJ-CSS3 — contrast-color() (L7) eager-evaluation arm; deferred on IMPL-RUN-BOARD.md:31,41 as 'a new value.js patch (1.1.1/1.2.0)' → **Q.W-VJ-CSS3 (DISPATCH to value.js, ships 1.1.1)**
- Retire the dead legacy colorContrast() grammar stub (css-color.bbnf:95-101) — never-shipped CSS Color L6, not wired into dispatch → **Q.W-VJ-CSS3 (same wave — the no-legacy cleanup is atomic with adding the real arm)**
- VJ-CSS4 — if() multibranch full-clause-list producer; deferred on IMPL-RUN-BOARD.md:31,41 + KF-TO-VALUEJS-P.md:402 as a follow-up → **Q.W-VJ-CSS4 (DISPATCH to value.js, ships 1.2.0)**
- kf N-branch if() resolver (resolve-values.ts:334-367 hard-codes 2-branch; comment at :330-332 names the deferral) — the downstream consumer of VJ-CSS4 → **Q.W-KF-IFN (GATED on VJ-CSS4 publish; re-pins ^1.2.0)**
- WCAG relative-luminance leaf helper (wcagRelativeLuminance + wcagContrastRatio) — net-new, required by VJ-CSS3, must NOT reuse the OKLab accent helper → **Q.W-VJ-CSS3 (S1 of that wave — author the leaf before the combinator arm)**
- KF-TO-VALUEJS-P dispatch-doc version-row gap (VJ-CSS rows lack version assignments; Net-Actions omits VJ-CSS) → **Q.W-VJ-CSS3 S0 (doc-fix bundled into the dispatch authoring)**

**Proposed waves:**
- [DISPATCH] **Q.W-VJ-CSS3** — value.js DISPATCH (ships 1.1.1). (S0) Fix KF-TO-VALUEJS-P.md: add the VJ-CSS3 version row → 1.1.1, add a Net-Actions VJ-CSS item. (S1) Author a clean WCAG leaf in value.js units/co · gate: value.js proof:grammar-2026 (or a new proof:contrast-color.mjs) born-RED: asserts parseCSSValue('con
- [DISPATCH] **Q.W-VJ-CSS4** — value.js DISPATCH (ships 1.2.0, rides the VJ-P1/VJ-P3 perf minor). In parsing/index.ts handleIf (336-348), STOP collapsing to first-consequent + first-else. Emit the FULL ordered c · gate: value.js proof:grammar-2026 (new arm) born-RED: parseCSSValue('if(media(min-width: 100px): 1px; supp
- [GATED] **Q.W-KF-IFN** — keyframes.js GATED on Q.W-VJ-CSS4 publish. Re-pin @mkbabb/value.js ^1.2.0. Generalize resolve-values.ts resolveIf (334-367) from the hard-coded [cond, consequent, else] triple to w · gate: kf proof:emerging-css (or a new test) born-RED: resolveKeyframes over a keyframe carrying a 3-branch

**Friction pre-empted:**
- FRICTION: Q.W-KF-IFN cannot even prototype until value.js publishes the N-branch clause list — nothing parses the middle branch, so an in-realm kf-only fix is impossible (exactly the if() inv-16 trap 
- FRICTION: the child-layout choice in Q.W-VJ-CSS4 (flat-pairs vs N-tuple) is a value.js↔kf contract that, if value.js picks unilaterally, forces a kf re-fit and a possible second round-trip. PRE-EMPTIO
- FRICTION: Q.W-VJ-CSS3's WCAG luminance helper could be 'cheaply' faked by reusing the OKLab accent helper (contrast.ts), producing a subtly-wrong contrast-color() that picks the wrong black/white near
- FRICTION: retiring the dead colorContrast grammar stub (css-color.bbnf:95-101) in the same wave as adding the L7 arm risks a momentary state where a `color-contrast(a vs b)` input that previously pars
- FRICTION: kf 4.4.0's caret pin ^1.1.0 auto-consumes 1.1.1 (CSS3) transparently — good — but the if()-multibranch (1.2.0) consume needs an explicit ^1.2.0 re-pin, and if Q.W-KF-IFN forgets it, kf silen

---

## B1-deploy-ci

**Verdict:** CI is RED on the impl-drive tree and the verified-deploy-of-record is structurally dead — both must be cured in Q before anything else ships. Two independent reds compound: (a) proof:ci-coverage exits 1 because 6 impl-drive gates were added to package.json but never wired into ci.yml (the fast library `gates` job fails), and (b) the demo-smoke terminal aggregator includes the 3 born-RED-by-design tripwires in its exit-1 set, so demo-smoke can NEVER be green — which is why deploy-pages.yml has sk

**Findings:**
- BLOCKER — CI is RED on the impl-drive tree: `proof:ci-coverage` exits 1 (verified: `node scripts/proof-ci-coverage.mjs` → exit 1). Six new impl-drive gates are declared in package.json but NEVER wired into .github/workflows/ci.yml as steps: proof:emerging-css-resolve-now, proof:m
- BLOCKER — the demo-smoke job can structurally NEVER be green, so the verified-deploy-of-record is permanently broken. The terminal check-failures step (ci.yml:1590-1689, `if: always()`) ADDS the three born-RED-by-design tripwires to the `failed` list and exits 1: ci.yml:1594 proo
- BLOCKER — master never received the constellation impl-drive: `git rev-list --left-right --count master...tranche-p-dev` = 0 / 18 (master 0 ahead, 18 behind). The 4.4.0 publish commit c69bbb0 is contained ONLY in tranche-p-dev; master's tip is the M-era aef3ef3. So the green-CI d
- The 2026-06-23 deploy BYPASSED the green-CI deploy-pages.yml gate. IMPL-RUN-BOARD.md:22-24 + the impl-drive memory both state Phase 4 was shipped via `bash scripts/pages-deploy.sh` from the host shell (creds in fourier-analysis/.env, account 07119f…), NOT via deploy-pages.yml's w
- The deploy round-trip 'oracle' is NOT mechanized. scripts/pages-deploy.sh captures a rollback target (lines 65-78) and its header comment (line 20) references 'if post-deploy validation fails', but the script performs NO post-deploy validation — after `wrangler pages deploy` (lin
- F-7 migration gap is real and unactioned: 15 device-INDEPENDENT static gates ride the slow 50m demo-smoke browser job instead of the fast 10m library `gates` job — proof:decomposition (ci.yml:833), proof:no-deprecated-guard (:837), proof:single-writer (:841), proof:composable-enc
- The local hygiene tier is still a serial fail-fast chain at odds with the report-all cure. `proof:hygiene` in package.json is a single 132-link `&& npm run proof:*` chain ending in `vitest run` — aborts on first red → the O(N^2) iterate-to-green wound the device-dependence-greeni
- No gate enforces the 5.0.0 O.W9 breaking alias-drop. proof:no-deprecated-guard (scripts/proof-no-deprecated-guard.mjs) is about the vue-router `next()` callback, NOT the @deprecated Animation/ScrollTimeline aliases. The aliases live at src/animation/engine.ts:1205 (`export { Keyf
- STRENGTHS: the library boundary is healthy — `npm run proof:boundary` PASSES (0 value.js static edges on every light entry; 0 direct @mkbabb/parse-that specifiers — the S9 acyclic-spine restoration is real). release.yml's publish ordering is sound (value.js→kf→keyframes-vue via `

**Deferred/chronic terminalized:**
- O.W9 no-legacy → 5.0.0 breaking cut: drop the @deprecated Animation/ScrollTimeline aliases (engine.ts:1205, timeline.ts:209, load-engine.ts:126/257) + migrate t → **Q.W-FIVE-OH (NOW for the gate authoring + demo migration; GATED for the user-domain `npm publish` of the 5.0.0 tag)**
- CI green on the impl-drive tree — the unblocked merge of tranche-p-dev (4.4.0) into master with a genuinely-green ci.yml so the verified-deploy-of-record can fi → **Q.W-CI-GREEN (NOW)**
- Deploy round-trip oracle — mechanize the post-deploy HTTP-200 + bundle-hash validation in pages-deploy.sh + a born-RED proof:deploy-roundtrip gate, so the 'veri → **Q.W-ROUNDTRIP-ORACLE (NOW)**
- The giant proof:hygiene 132-&& serial chain + the 15-gate F-7 static-gate migration out of demo-smoke (the device-dependence wall-clock + iterate-to-green cure) → **Q.W-CI-HARDEN (NOW)**
- The 6 unwired impl-drive gates (proof:portable-perf/soa-composite/morphsvg-consume/emerging-css-resolve-now/spring-heatmap/no-foreign-symbol-stamp) absent from  → **Q.W-CI-GREEN (NOW) — folded into the same wave as the merge-unblock**

**Proposed waves:**
- [NOW] **Q.W-CI-GREEN** — Make ci.yml genuinely green on the impl-drive tree and merge tranche-p-dev→master so the deploy gate can fire. (1) Wire the 6 unwired gates into ci.yml: the 5 static/library ones ( · gate: proof:ci-coverage extended with a new clause `terminal-aggregate-excludes-bornred`: parse ci.yml's c
- [NOW] **Q.W-ROUNDTRIP-ORACLE** — Mechanize the deploy round-trip. (1) Add a post-deploy validation block to scripts/pages-deploy.sh: after `wrangler pages deploy`, poll the production origin (keyframes.babb.dev) f · gate: proof:deploy-roundtrip: born-RED on the current pages-deploy.sh (no validation block exists — grep f
- [NOW] **Q.W-CI-HARDEN** — Cure the device-dependence wall + the serial-chain iterate-to-green wound, in ONE pass (per the device-dependence-greening precept — never peel one-per-round). (1) F-7 migration: m · gate: Extend proof:ci-coverage with a clause `static-gate-placement`: each gate whose script opens NO brow
- [NOW] **Q.W-FIVE-OH** — The 5.0.0 breaking cut, gate-first. (1) Author scripts/proof-alias-dropped.mjs (the no-legacy gate the codebase lacks): assert the @deprecated Animation/ScrollTimeline runtime alia · gate: proof:alias-dropped — born-RED on today's tree (Animation alias at engine.ts:1205, ScrollTimeline at

**Friction pre-empted:**
- Q.W-FIVE-OH (the 5.0.0 alias-drop) will surface a mid-tranche deferral: the demo consumers are `import type { Animation }` (erased), but the runtime `loadAnimationEngine()` destructure sites (demo/cub
- Q.W-CI-GREEN's merge of tranche-p-dev→master will trigger the FIRST real master demo-smoke run with the impl-drive gates AND the real (non-born-RED) reds that the last master run 27834937954 showed (p
- Q.W-ROUNDTRIP-ORACLE's live-origin fetch is inherently network-dependent and will flake in CI (CF edge propagation latency after a deploy). PRE-EMPT by making the proof:deploy-roundtrip CI leg an obse
- Q.W-CI-HARDEN's move of 15 static gates into the library `gates` job pushes that job past its 10m ceiling. PRE-EMPT by measuring each migrated gate's wall-clock first (they are sub-second greps, so th

---

## B1-kf-morphsvg

**Verdict:** O.W6 fromMorphSVG is a GENUINE chronic exit — the DM-3 7-tranche P-inv-28 terminal is closed, idiomatically (value.js owns geometry, kf owns the compositor, exactly one value.js edge, honest-or-refuse on degenerate paths, a real born-RED keystone). But it shipped as the engine-compatibility FLOOR with four named extensions BOOKED-OUT and one honesty gap. The most acute defect is the --morph-d target-write that the docstring promises but the code never performs (morph-svg.ts:58-66) — a target-bea

**Findings:**
- STRENGTH: O.W6 genuinely EXITS the DM-3 7-tranche P-inv-28 chronic — fromMorphSVG + MorphSVG are BUILT (morph-svg.ts:127, :243), wired behind loadAnimationEngine() (index.ts:143-150 type-only barrel), gated born-RED with a live triangle→square keystone whose mid-t is distinct fro
- STRENGTH: the seam is idiomatic and contrivance-clean — value.js owns the geometry (the d-parse + arc-length table, built ONCE per path, morph-svg.ts:196-197), kf owns the compositor (sample both polylines at the SAME `samples` count → matched point counts → an engine-interpolabl
- GAP (contrivance-risk, HIGH): the `target` option is documented to write the interpolated `d` onto the target's `--morph-d` CSS custom property each frame (morph-svg.ts:58-66 docstring), but NO such write exists. The keyframes carry ONLY the ~130 numeric `--morph-{i}-x/y` custom 
- GAP (the lane's core BOOKED extensions are entirely UNBUILT, all named in the morph-svg.ts header as QUALITY follow-ons): (1) orient-along-path — PathGeometry.sampleAtLength already PUBLISHES the tangent `angle` (value.js path.ts:512-543, atan2 of the local direction) — the enabl
- GAP (no-target render path missing): unlike fromDrawSVG/fromMotionPath which animate a REAL CSS property the browser renders (stroke-dashoffset / offset-distance), fromMorphSVG's animated channel (numeric custom props) is NOT renderable as a shape without an author-side reader. T
- CONTRIVANCE-RISK (minor): sampleD(t) calls anim.interpFrames(ms, false) (morph-svg.ts:291) which allocates a fresh result object per call (engine.ts interpFrames without the hoisted buffer) — fine for a one-off pull, but if a demo/author samples sampleD every frame for the `d:` r
- OBSERVATION (not a defect): samples default 64 → 130 numeric custom props per frame (morph-svg.ts:88 DEFAULT_SAMPLES). The morph is WAAPI-INELIGIBLE by construction (custom props are not the default DOM renderer's animatable set; waapi.ts rejects non-default channels) — it always

**Deferred/chronic terminalized:**
- DM-3 follow-on: orient-along-path for MorphSVG (consume PathGeometry.sampleAtLength's published tangent `angle`) — UNBUILT → **Q.W-MORPH-ORIENT (NOW) — a complete terminal wave, no deferral**
- DM-3 follow-on: topology-aware vertex correspondence (replace naive uniform point-pairing; command-count matching + rotation/start-offset minimization) — degene → **Q.W-MORPH-CORRESPONDENCE (NOW; DISPATCH a value.js arm if the matcher belongs in PathGeometry)**
- DM-3 follow-on: animate({morph}) dispatch arm — ABSENT from animate.ts → **Q.W-MORPH-DISPATCH (NOW)**
- DM-3 follow-on: MorphSVG demo scene (gate-blindspot — unobserved in running demo) — ABSENT → **Q.W-MORPH-SCENE (NOW)**
- Target-write / on-DOM render path (the documented --morph-d write that does not exist; the CSS `d:` render path) — the honest render contract → **Q.W-MORPH-RENDER (NOW) — fold into the orient/dispatch terminal as the render half**

**Proposed waves:**
- [NOW] **Q.W-MORPH-RENDER** — Terminalize the morph's on-DOM render contract — the honest half O.W6 left as vapor. (a) DELETE the false --morph-d docstring claim (morph-svg.ts:58-66) and REPLACE the target writ · gate: proof:morph-renders-d (NEW, born-RED) — clause `d-written`: a target-bearing morph, driven one frame
- [NOW] **Q.W-MORPH-ORIENT** — Orient-along-path for MorphSVG — consume PathGeometry.sampleAtLength's ALREADY-PUBLISHED tangent `angle` (value.js path.ts:512-543), which O.W6 left unconsumed. Add an `orient` opt · gate: proof:morph-orients (NEW, born-RED) — clause `angle-channel`: with `orient: true`, the keyframe set 
- [DISPATCH] **Q.W-MORPH-CORRESPONDENCE** — Topology-aware vertex correspondence — replace the naive uniform arc-length point-pairing (samplePolyline) with a correspondence pass so dissimilar shapes morph without self-crossi · gate: proof:morph-correspondence (NEW, born-RED) — clause `no-tumble`: a star→circle (or rotated-square→sq
- [NOW] **Q.W-MORPH-DISPATCH** — animate({morph}) dispatch arm — add the morph shape to animate.ts's construction-time dispatch, completing the from*-factory parity (animate already routes MotionPath via isMotionP · gate: proof:animate-morph-arm (NEW, born-RED) — clause `morph-shape-routed`: animate(el, { morph: { from: 
- [NOW] **Q.W-MORPH-SCENE** — MorphSVG demo scene — close the gate-blindspot (a green source-shape gate misses appearance/interaction; MEMORY feedback). A MorphSVGScene.vue in demo/app/scenes/ (beside MotionPat · gate: proof:morph-scene (NEW, born-RED, playwright-headless) — clause `scene-registered`: the scene machin

**Friction pre-empted:**
- Q.W-MORPH-CORRESPONDENCE sub-decision (2) (command-count / sub-path matching) could spawn a mid-tranche deferral the moment it needs segment-topology (sub-path boundaries, command kinds) that value.js
- Q.W-MORPH-RENDER's CSS `d:` property render path has uneven browser support (Chromium + recent Safari render path() in `d`; Firefox lags). PRE-EMPT: the render wave writes BOTH the `d:` property AND t
- Q.W-MORPH-ORIENT adds a per-point angle channel that, at samples=64, adds 65 more interpolable keys (~195 total) — could spawn a 'morph is too heavy' perf deferral. PRE-EMPT: gate orient behind the op

---

## B2-pw12-dock-aria — P.W12 dock + glass-ui aria cross-repo deferred (kf S1 aria-suppress GATED on glass-ui SegmentedTabs aria guard; the TransportDock S2 dock consume)

**Verdict:** RED-GATE / FALSE-RED CHRONIC — actionable in Q with a fully-terminated wave set, but the deletes are legitimately gated on a user-domain glass-ui publish. The decisive truth: the glass-ui SegmentedTabs aria guard IS authored (SegmentedTabs.vue:406, branch prototype/liquid-dock) and built in the branch dist, but is NOT in the published npm 4.1.0 (verified: published dist/tabs.js emits aria-orientation unconditionally on role=group) — it is hard-gated behind the unexecuted user-domain BD.W-CUT. Th

**Findings:**
- DECISIVE GROUND TRUTH — the aria guard is AUTHORED but NOT PUBLISHED. glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406 (branch prototype/liquid-dock) ALREADY has the correct conditional guard `:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : un
- kf S1 GATE IS A CONFIRMED FALSE-RED, AND IT FAILS CI. `node scripts/proof-workaround-deletion.mjs` exits 1 (verified) with S1=RED S2=RED, printing 'the deletion is now SAFE and OVERDUE — delete the workaround and re-pin.' This is WRONG: deleting the S1 suppress now re-introduces 
- ROOT CAUSE OF THE FALSE-RED — the P.W12 retarget that FULL-LOOP-LEDGER mandated was NEVER applied. proof-workaround-deletion.mjs S1 arm (lines 203-217) and S2 arm (lines 218-229) have NO `apiPresent` field — unlike S7/S8/S9 which all carry `apiPresent: vjsCaps.*`. The script's ow
- S2 (DOCK) IS A SECOND FALSE-RED WITH A DEEPER PROBLEM: ITS CURE IS ORPHANED IN BOTH REPOS. The S2 arm's sibling.name is 'BB W-DOCK-MORPH-FAMILY click-strand cure' but its witness/version probe only checks that glass-ui@4.1.0 is published — and the ONLY dock fix present in publish
- kf DOES NOT CONSUME 4.1.0 — THE PIN IS STALE. keyframes.js/package.json pins glass-ui `~4.0.0` (optionalDependencies), installing 4.0.1. So even the published-4.1.0 sibling the gate's version sentinel keys on is not actually installed. The S1 apiPresent content-probe (which must 
- NO kf-SIDE CONTENT-AWARE GATE EXISTS. glass-ui's BD.W-ARIA-ORIENTATION-GUARD.md:127 + BD.W-CUT.md:14,32 repeatedly reference kf's `proof:glassui-aria-ask` as the bilateral content-aware lock that 'mounts the published pill, asserts role=group carries aria-orientation===null.' But
- GLASS-UI GUARD-PUBLISH IS GATED BEHIND BD.W-CUT, WHICH IS USER-DOMAIN + UNEXECUTED. BD.W-CUT.md:7,22,34 states the cut is 'EXECUTION-PHASE ONLY... EXECUTES NOTHING (no tag, no publish, no push) until the user greenlights.' The guard ships only when the next 4.x-over-4.1.0 is cut+
- STRENGTH: the kf suppress sites are semantically correct and minimal. SpringSidebar.vue:43 and AnimationControls.vue:72 both carry exactly `:aria-orientation="undefined"` on pill strips — the right band-aid (Vue drops an undefined-bound attr). They are NOT contrivance; they are h
- STRENGTH: the glass-ui fix, once published, is idiomatic and gestalt — it transplants the EXACT PagerDots.vue:124 role-keyed-undefined-drop idiom (BD.W-ARIA-ORIENTATION-GUARD.md §3), so the library speaks ONE aria-orientation discipline (emit-iff-on-an-allow-listed-role). No new 

**Deferred/chronic terminalized:**
- DM-5 S1 — kf aria-orientation suppress (SpringSidebar.vue:43 + AnimationControls.vue:72), chronicity 5 (K,L,M,O,P→Q); P-inv-28 belt long-overdue. The two `:aria → **Q.W-ARIA-S1-DELETE (kf, GATED) — deletes both suppress lines the moment the apiPresent content-probe fires true on a re-**
- S1 false-RED gate bug — proof-workaround-deletion.mjs S1 arm (lines 203-217) lacks apiPresent; fires RED on version-publish alone; fails proof:hygiene in CI tod → **Q.W-S1S2-GATE-HYGIENE (kf, NOW) — adds a glassCaps block grepping installed dist; wires S1.apiPresent + S2.apiPresent.**
- DM-5 S2 / RF-17 — kf TransportDock pointerHandled/onPlayPointerDown twin (TransportDock.vue:348-375); the dock collapse-crossfade click-strand. False-RED in the → **Q.W-DOCK-STRAND-DISPATCH (glass-ui DISPATCH) authoring the collapse-crossfade layer-keepalive cure + Q.W-S2-GATE-CORRECT**
- Missing kf content-aware bilateral gate — proof:glassui-aria-ask referenced by glass-ui's cut runbook (BD.W-CUT.md:14) but absent from scripts/. → **Q.W-S1S2-GATE-HYGIENE authors scripts/proof-glassui-aria-ask.mjs (the runtime DOM-readback half of the bilateral lock).**
- Stale kf glass-ui pin ~4.0.0 (installs 4.0.1) — must re-pin to the BD cut version when it publishes the guard. → **Q.W-ARIA-S1-DELETE includes the re-pin (consume-and-delete in one atomic wave, the constellation no-orphan-pin disciplin**

**Proposed waves:**
- [NOW] **Q.W-S1S2-GATE-HYGIENE** — kf NOW — retarget the proof-workaround-deletion.mjs S1+S2 arms to be content-aware (close the false-RED that fails proof:hygiene today). Add a `glassCaps` block at the top of the s · gate: proof:workaround-deletion S1+S2 transition from RED → PENDING (the false-RED is closed; with install
- [DISPATCH] **Q.W-GLASSUI-ARIA-DISPATCH** — DISPATCH (KF-TO-GLASSUI ask) — the cross-repo ask to PUBLISH the already-authored SegmentedTabs aria guard. The guard is DONE in source (SegmentedTabs.vue:406, branch prototype/liq · gate: The dispatch is satisfied when `npm view @mkbabb/glass-ui@<cut> dist/tabs.js` (or the published tarb
- [GATED] **Q.W-ARIA-S1-DELETE** — kf GATED — the atomic consume-and-delete: when the glass-ui aria cut publishes (Q.W-GLASSUI-ARIA-DISPATCH lands), re-pin keyframes.js/package.json glass-ui from ~4.0.0 to the cut v · gate: proof:workaround-deletion S1 RED→GREEN (witness ABSENT — the suppress lines are gone, apiPresent tru
- [DISPATCH] **Q.W-DOCK-STRAND-DISPATCH** — DISPATCH (KF-TO-GLASSUI ask) + kf NOW gate-correction — the S2/RF-17 collapse-crossfade click-strand. The ask to glass-ui: author a dock-internal cure so the .dock-layer carrying a · gate: proof:workaround-deletion S2 RED→PENDING immediately (apiPresent retargeted off the wrong useDockCli
- [GATED] **Q.W-S2-DOCK-DELETE** — kf GATED — when Q.W-DOCK-STRAND-DISPATCH's glass-ui cure publishes, re-pin glass-ui, delete the TransportDock pointerHandled/onPlayPointerDown twin (lines 348-375 + the @pointerdow · gate: proof:workaround-deletion S2 GREEN (witness ABSENT). proof:live-session S5 motion-path PLAY produces

**Friction pre-empted:**
- FRICTION: Q.W-ARIA-S1-DELETE and Q.W-S2-DOCK-DELETE are both GATED on a USER-DOMAIN glass-ui publish (BD.W-CUT is confirm-first, never auto-tag). If the BD cut does not ship during Q, the deletes cann
- FRICTION: Q.W-S1S2-GATE-HYGIENE needs the EXACT keepalive API name from Q.W-DOCK-STRAND-DISPATCH to write glassCaps.dockStrandKeepalive's grep pattern — a forward dependency on a dispatch that glass-u
- FRICTION: re-pinning glass-ui ~4.0.0 → the BD cut (a 4.x or possibly major bump) could pull unrelated BD changes (deep-glass 20px, aurora WGSL, forms-card-fold) into the kf demo, spawning visual regre
- FRICTION: the missing proof:glassui-aria-ask gate must run over the BUILT demo (it's a DOM-readback), so it's a device-bearing gate that can flake on the slow Linux CI runner (the device-dependence-gr

---

## B2-pw1-lint-pw10-leaves

**Verdict:** Both deferred items in my lane are REAL and GROUNDED-NOW, but the 4.4.0 impl drive substantially RESHAPED them — a Q author who trusts the P.W1/P.W10 specs verbatim will mis-scope. Net state: P.W10 S2 (W96 parse-that scan) is DISCHARGED (shipped as proof-boundary assertion 4b under O.W16 — RETIRE, don't re-author). P.W1 S2/S3 (bench scenarios + portable-perf helper) SHIPPED. What genuinely SURVIVES as Q work: (1) P.W1 S1 the lint-tier — UNBUILT across four tranches, but the eslint half is contri

**Findings:**
- GROUND TRUTH SHIFT (the impl drive moved my lane's witnesses): the S9 parse-that consume + S8 WeakMap already LANDED at 495484a. src/animation/utils.ts no longer imports @mkbabb/parse-that (line 1 now imports parseCSSSubValue from value.js); package.json has ZERO @mkbabb/parse-th
- P.W10 S2 ALREADY SHIPPED (under a different owner): the W96 parse-that source-scan is LIVE in scripts/proof-boundary.mjs as assertion 4b (holdsParseThatSpecifier at :135, scan at :443-465), attributed to O.W16 §S1 not P.W10. It is GREEN today (no direct parse-that import in src/a
- P.W1 S3 ALREADY SHIPPED: scripts/lib/portable-perf.mjs (ratioGate + absoluteGate with mandatory marginComment) + scripts/proof-portable-perf.mjs exist and proof:portable-perf is wired into proof:hygiene (package.json:197). P.W1 S2 PARTIALLY shipped: bench/group-composite.bench.ts
- P.W1 S1 (lint tier) GENUINELY UNBUILT and not even installed: `ls .eslintrc* eslint.config.* .dependency-cruiser*` -> no matches; node_modules/.bin/eslint + node_modules/.bin/depcruise absent; package.json has no eslint/dependency-cruiser devDep and no `lint` script; check = `tsc
- P.W10 S3/S4/S6 (leaves TRAP) is HALF-DONE and left in an INCONSISTENT state — a no-legacy violation introduced BY the impl drive. test/leaves-parity.test.ts EXISTS (the Arm-B byte-equivalence parity test: clamp/lerp/scale/lerpArray vs value.js across a 14-point grid + K=8 channel
- P.W10 S3 (W97 math-subpath-clean clause) NOT authored: grep for 'math-subpath'/'W97'/'value.js/math' in scripts/proof-boundary.mjs -> no matches. The boundary gate still cannot distinguish a grammar-pulling value.js subpath from the parse-that-FREE ./math leaf, so it still bans t
- I VERIFIED the W97 empirical premise on the live tree (so a Q wave does not have to re-probe): the ./math subpath's static graph is grammar/parse-that-free. dist/subpaths/math.js re-exports from dist/math-UeasWV-i.js (1229 bytes), whose imports[] is EMPTY and which mentions neith
- P.W10 S1 (proof:no-cross-realm-cast) NOT MOOT despite the parse-that casts vanishing — the WITNESSES MOVED to value.js Color casts. Live cross-realm casts over value.js types: src/animation/compile-color.ts:59 (`normalizeColorUnit(vu as never).value as unknown as Color`), :63 (`c
- P.W10 S5 (deprecated-alias drops) NOT done — 3 aliases live: engine.ts:1205 `export { KeyframesAnimation as Animation }` (@deprecated at :1192); timeline.ts:171 `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions }` (@deprecated at :163); timeline.ts:209 the @d
- STRENGTH — the apparatus that DID land is idiomatic and gestalt: portable-perf.mjs is the single ratioGate/absoluteGate seam over ci-env.mjs's declarePosture (no re-implemented floor math), and there are now four durable *-decision.json verdicts (spring-vector, group-soa, soa-com
- CONTRIVANCE-RISK (lint tier): P.W1 S1 as specced wants BOTH eslint (import/no-cycle + no-restricted-imports) AND dep-cruiser (3 boundary rules) — TWO new toolchains + a `depcruise src` invocation, for invariants that proof:boundary (assertion 1 the per-entry isValueJs graph filte
- NO-LEGACY VIOLATION introduced by the impl drive: leaves.ts:55-58's stale comment is a false structural claim shipped INTO 4.4.0. This is the precise failure mode the no-legacy precept guards against, and it was created by landing Arm-B's substance (keep + parity test) WITHOUT Ar

**Deferred/chronic terminalized:**
- P.W1 S1 — the eslint/dep-cruiser lint-tier (the O-Band-A carry M.W2->O.W1->P.W1, now unbuilt across FOUR tranches; eslint/dep-cruiser not even installed) → **Q.W-LINT (NOW) — install dep-cruiser only, author .dependency-cruiser.cjs (no-cycle + no-restricted-paths boundary rules**
- P.W10 S3/S4/S6 — the leaves.ts->/math TRAP: stale comment uncorrected + no W97 clause + no decision JSON (Arm B half-landed inconsistently in 4.4.0) → **Q.W-LEAVES-TRAP (NOW) — finish Arm B: correct leaves.ts:55-58 to the TRUE rationale (the boundary gate bans even the ver**
- P.W10 S1 — proof:no-cross-realm-cast (gate never authored; witnesses moved from the now-gone parse-that casts to value.js Color casts at compile-color.ts:59,63, → **Q.W-XREALM-CAST (NOW) — author scripts/proof-no-cross-realm-cast.mjs scanning src/animation/** for `as any`/`as unknown **
- P.W10 S5 — drop the 3 @deprecated aliases (Animation/ScrollTimelineOptions/ScrollTimeline) + migrate the demo consumers + proof:no-legacy-surface; explicitly DE → **Q.W-ALIAS-DROP (GATED on the 5.0.0 version cut) — drop all three aliases on the published d.ts, migrate the 46 demo Anim**
- P.W10 S2 — the W96 parse-that source-scan (DISCHARGED, not deferred — already live as proof-boundary assertion 4b) → **RETIRE in Q (no wave): the W96 scan shipped under O.W16 §S1 and is GREEN. The Q tranche board must record S2 as DONE and**

**Proposed waves:**
- [NOW] **Q.W-LINT** — The SLIM lint-tier (the O-Band-A carry, KILLED-down to its load-bearing half). Install dependency-cruiser ONLY (NOT eslint — tsc strict + prettier-organize-imports already own the  · gate: proof:lint-clean (NEW): .dependency-cruiser.cjs exists + `npm run lint` exits 0 on the clean tree. B
- [NOW] **Q.W-LEAVES-TRAP** — Finish P.W10's Arm-B terminal cleanly (4.4.0 landed the substance but left the no-legacy violation). Three moves: (1) correct src/animation/internal/leaves.ts:55-58 — replace the F · gate: Extend proof:no-deprecated-guard (or a new proof:comment-honest clause) to bite the stale leaves.ts 
- [NOW] **Q.W-XREALM-CAST** — Author proof:no-cross-realm-cast (P.W10 S1, re-anchored to the moved witnesses). scripts/proof-no-cross-realm-cast.mjs scans src/animation/** for `as any` / `as unknown as` / `as n · gate: proof:no-cross-realm-cast born-RED on today's tree: compile-color.ts:59,63,99 are live UN-annotated 
- [GATED] **Q.W-ALIAS-DROP** — Drop the three @deprecated aliases (P.W10 S5, the breaking-major tail the impl-drive deferred). Delete engine.ts:1205 `Animation` alias, timeline.ts:171 `ScrollTimelineOptions` ali · gate: proof:no-legacy-surface (NEW): grep @deprecated on the BUILT dist/keyframes.d.ts -> 3 aliases presen

**Friction pre-empted:**
- FRICTION: Q.W-ALIAS-DROP migrates 46 demo files from `Animation` to `KeyframesAnimation` — a mechanical sweep that can silently miss a consumer (e.g. a re-export, a `typeof Animation`, or a string in 
- FRICTION: Q.W-LEAVES-TRAP's W97 clause adds a SECOND value.js bundleEntry to proof-boundary.mjs (the ./math subpath as its own entry). If a future value.js republish renames the math chunk hash (today
- FRICTION: Q.W-XREALM-CAST's annotation requirement touches compile-color.ts (a hot K.W10 densify module) — a future refactor that moves the Color casts loses the annotation and reds the gate. PRE-EMPT
- FRICTION: Q.W-LINT killing eslint (keeping only dep-cruiser) departs from the P.W1 spec text (which mandates eslint.config.mjs). If the Q board treats the spec as authoritative, a reviewer could re-ad

---

## B6-crossrepo-versions

**Verdict:** PROCEED. The Q cross-repo version chain is acyclic and fully sequenceable with ZERO required mid-tranche deferrals IF the master-merge reconciliation lands NOW. The publish-ordering is: Q.W-MERGE-RECONCILE (NOW, all 3 repos) → parse-that 0.13.0 (DISPATCH, dead-API resolution: delete thenMap+fuse, keep *Span, resolve dispatch-widening) → value.js 1.2.0 (DISPATCH, the deferred color-arch tail + VJ-CSS3 contrast-color + extractFunctions) → glass-ui BC patch (DISPATCH, carve aria+dock off liquid-doc

**Findings:**
- GROUND-TRUTH VERSION STATE (verified): kf published 4.4.0 (tag v4.4.0) — MINOR, NOT the planned 5.0.0. Tree is on `tranche-p-dev` @ df78088. value.js published 1.1.0 (tag v1.1.0, branch tranche-p). parse-that published 0.12.0 (tag v0.12.0, branch tranche-b). glass-ui tree is 4.1.
- REGRESSION / MERGE-STATE DIVERGENCE (the prime version-lane finding): the 4.4.0 impl drive (df78088) is NOT merged to master — `git log master` tops out at aef3ef3 (the M consume-edge commit). Three siblings published from non-master branches (kf tranche-p-dev, value.js tranche-p
- kf pins value.js ^1.1.0 (package.json) — the caret means a future value.js 1.2.0 is auto-consumed without a re-pin, which is correct for additive 1.2.0 BUT means the VJ-CSS3 contrast-color()/VJ-P1 color2Into-tail features land silently with no kf consume-edge gate flip. The caret
- parse-that DEAD-API resolution (verified zero-consumer across the whole constellation): `thenMap` (parser.ts:96-119) and `fuse` (leaf.ts) have ZERO callers in parse-that, value.js, or kf. value.js DOES consume `dispatch()` (parsing/index.ts:425, color.ts:732) — so dispatch is liv
- CONTRIVANCE-RISK in the 0.13.0 dead-API plan: deleting thenMap+fuse is a clean no-consumer deletion (good), but deleting the *Span closure builders would BREAK the published 0.12.0 BC-additive promise (FULL-LOOP-LEDGER already recorded 'PT-B2 delete-them overreached'). The B5-par
- value.js contrast-color() is NOT YET PARSED (verified: grep over src/parsing/ + src/units/color/ for 'contrast-color'/'contrastColor' returns ZERO hits). Only an internal `computeSafeAccent` helper exists in src/units/color/contrast.ts. VJ-CSS3 (contrast-color() eager-evaluate, B
- value.js color2Into shipped the OKLCH→XYZ hub leg only (84→37 allocs, gamut.ts:353). The B1-valuejs-color + B5-valuejs-arch lanes confirm the SECOND HALF (the per-step DisplayP3 egress wrapper, ~28 of the residual 37 allocs at dispatch.ts) was DROPPED. The <12-alloc transposition
- glass-ui BC aria correction: the SegmentedTabs.vue:406 fix IS in the 4.1.0 tree (`:aria-orientation=isUnderline ? ... : undefined` — correctly omits the prohibited attribute on the role=group pill arm). BUT kf installs 4.0.1, whose dist STILL emits the prohibited attribute (tabs.
- O.W9 no-legacy / 5.0.0 MAJOR is the ONLY breaking cut in the chain and is NOT done: 2 @deprecated value-alias re-exports live (engine.ts:1205 `export { KeyframesAnimation as Animation }`; timeline.ts:218 `export { KeyframesScrollTimeline as ScrollTimeline }`) + 1 type-alias (time
- STALE DISPATCH DOCS (cross-doc consistency regression): KF-TO-PARSETHAT-B.md §constellation-version-split (lines ~303-305) cites VJ-L1 (demoted-to-spike) + VJ-P2 (dropped) as the value.js 1.1.0/1.2.0 contents — contradicting KF-TO-VALUEJS-P-ASKS.md. The FULL-LOOP-LEDGER (line 463
- STRENGTH: the consume-edge DISCIPLINE held in the impl drive — S9 genuinely removed the @mkbabb/parse-that production dep (kf reaches parse-that only transitively now; proof:boundary shows 0 specifiers; inv-16 clean). The DAG-acyclic-spine was restored. The honest-semver call (4.
- NO-LEGACY VIOLATION carried forward: the 5.0.0 PKG-3 renames were AUTHORED into the JSDoc (`@deprecated ... in 5.0.0`) but the version that ships them is unset — the @deprecated tags now point at a phantom 5.0.0 the impl drive never cut. Either 5.0.0 ships in Q (dropping the alia

**Deferred/chronic terminalized:**
- O.W9 / PKG-3 no-legacy alias-drop → the 5.0.0 BREAKING MAJOR cut (drop Animation/ScrollTimeline/ScrollTimelineOptions @deprecated aliases + migrate 22 demo type → **Q.W-NOLEGACY-50 (phase NOW) — library deletion + demo migration; the 5.0.0 cut. Born-RED: proof:no-legacy-surface assert**
- value.js 1.2.0 dispatch — VJ-P1 color2Into egress-tail (<12 allocs/call), VJ-CSS3 contrast-color() eager-evaluate (UNSHIPPED — not yet parsed), VJ-CSS1 extractF → **Q.W-VJ-DISPATCH-120 (phase DISPATCH) — authors the value.js 1.2.0 cross-repo ASK doc (KF-TO-VALUEJS-Q); kf re-pins ^1.2.**
- parse-that 0.13.0 dispatch — the B5 transpositions consume (wire dispatch-widening into value.js OR drop unwired) + the *Span/thenMap/fuse dead-API resolution ( → **Q.W-PT-DISPATCH-013 (phase DISPATCH) — authors KF-TO-PARSETHAT-Q; parse-that deletes thenMap+fuse, decides dispatch-wide**
- glass-ui BC aria correction publish — the 4.1.0-tree SegmentedTabs aria-orientation fix is unpublished to a kf-consumable patch; entangled with the liquid-dock  → **Q.W-GLASSUI-BC-PUBLISH (phase DISPATCH) — authors the glass-ui BC publish-readiness ask (carve a BC-only aria/dock patch**
- master-merge reconciliation — three siblings published from non-master branches (kf tranche-p-dev, value.js tranche-p, parse-that tranche-b); 4.4.0 is NOT on kf → **Q.W-MERGE-RECONCILE (phase NOW) — merge the published tranche tips to master across all 3 repos before the 5.0.0 cut, so**

**Proposed waves:**
- [NOW] **Q.W-MERGE-RECONCILE** — Merge the three published tranche tips to master before any new cut: kf tranche-p-dev(df78088, v4.4.0)→master, value.js tranche-p(v1.1.0)→master, parse-that tranche-b(v0.12.0)→mast · gate: proof:published-on-master — RED today because v4.4.0(df78088) is NOT an ancestor of kf master(aef3ef
- [NOW] **Q.W-NOLEGACY-50** — The 5.0.0 BREAKING MAJOR cut. Drop the 2 @deprecated value-aliases (engine.ts:1205 Animation, timeline.ts:218 ScrollTimeline) + the 1 type-alias (timeline.ts:171 ScrollTimelineOpti · gate: proof:no-legacy-surface.mjs — RED today (2 @deprecated aliases live in the published d.ts); asserts 
- [DISPATCH] **Q.W-PT-DISPATCH-013** — parse-that 0.13.0 cross-repo dispatch. Author docs/tranches/Q/KF-TO-PARSETHAT-Q.md: (1) DELETE the 2 true-orphan combinators thenMap(parser.ts:96-119)+fuse(leaf.ts) — zero consumer · gate: proof:dead-api-zero.mjs (parse-that) — asserts thenMap+fuse absent from published surface; vacuity-g
- [DISPATCH] **Q.W-VJ-DISPATCH-120** — value.js 1.2.0 cross-repo dispatch + consume. Author docs/tranches/Q/KF-TO-VALUEJS-Q.md formalizing: VJ-P1-tail (color2Into egress out-param → <12 allocs, the named-but-unshipped s · gate: proof:gamut-alloc N_TARGET<12 (value.js) + kf proof:emerging-css-phase2 asserting if(contrast-color(
- [DISPATCH] **Q.W-GLASSUI-BC-PUBLISH** — glass-ui BC dispatch. The aria-orientation fix is already in the 4.1.0 tree (SegmentedTabs.vue:406 correctly omits the attribute on the role=group pill arm) but unpublished to a kf · gate: proof:no-prohibited-aria.mjs — asserts (a) the consumed glass-ui dist emits zero aria-orientation on
- [GATED] **Q.W-5.1.x-CUT** — The 5.1.x MINOR over 5.0.0 — the additive perf+demo+emerging-CSS-Phase-2 surface that consumes value.js 1.2.0 + parse-that 0.13.0. One additive LIGHT export (springLinearStopsArray · gate: proof:changelog-5.1.0 + proof:consume-edges-pinned asserting kf pins value.js^1.2.0, the glass-ui BC

**Friction pre-empted:**
- FRICTION: Q.W-NOLEGACY-50 (5.0.0) and Q.W-VJ-DISPATCH-120 (value.js 1.2.0 consume) both touch kf version + pins; if 5.0.0 ships before value.js 1.2.0 is published, the 1.2.0 consume would force a SECO
- FRICTION: VJ-CSS3 contrast-color() is UNSHIPPED (not even parsed in value.js) — a kf wave that consumes it (resolve-values.ts Phase-2) would silently spawn a 'value.js must parse contrast-color first'
- FRICTION: glass-ui 4.1.0 is entangled with the in-flight prototype/liquid-dock BF tranche — asking glass-ui to publish a BC aria patch could pull in unrelated unstable liquid-dock work → an unbounded-
- FRICTION: the parse-that thenMap removal is technically breaking IF thenMap is a barrel export (it lives in parser.ts as a method) — a naive 0.13.0 MINOR cut would be a semver lie. PRE-EMPT: Q.W-PT-DI
- FRICTION: the caret pin (value.js ^1.1.0) auto-consumes 1.2.0 with NO consume-edge observable — a future audit can't tell whether the 1.2.0 features are actually wired. PRE-EMPT: Q.W-VJ-DISPATCH-120 r

---

## B7-shipped-regression

**Verdict:** NO SHIPPED-CODE REGRESSION. The 4.4.0 impl drive is sound at the code/deploy/pin layer: all 4 named gates (proof:boundary, proof:published-surface, proof:soa-composite, proof:no-foreign-symbol-stamp) PASS on HEAD; version pins are fully consistent across the 4 repos AND the npm registry (kf@4.4.0 → value.js ^1.1.0, value.js 1.1.0 → parse-that ^0.12.0, glass-ui 4.0.1 satisfies ~4.0.0); the live keyframes.babb.dev serves the single, locally-built bundle index-DwKmrGBp.js (round-trip genuine). The 

**Findings:**
- STRENGTH / NO REGRESSION: all 4 named kf gates PASS on HEAD. proof:boundary — every barrel light entry value.js-free, 0 parse-that specifiers in src (the S9 dep-removal held), inv-α holds. proof:published-surface — packed tarball == declared dist, AnimationEngine interface 41 key
- STRENGTH: version pins are FULLY CONSISTENT across the constellation and registry-honest. Local package.json (value.js ^1.1.0, glass-ui ~4.0.0) == installed (value.js 1.1.0, parse-that 0.12.0 transitive, glass-ui 4.0.1 satisfies ~4.0.0) == value.js's own parse-that ^0.12.0 pin ==
- STRENGTH: the DEPLOY SERVES THE RIGHT BUNDLE. Live keyframes.babb.dev serves a SINGLE bundle index-DwKmrGBp.js (no stale dual-serve), byte-identical-named to the locally-built dist/gh-pages/assets/index-DwKmrGBp.js — the round-trip is genuine. MEMORY.md line 64 + project_constell
- RECORD-HONESTY FAILURE (HIGH) — IMPL-RUN-BOARD.md internal contradiction: the Phase ledger TABLE (lines 16-18) still marks rows 3a/3b/4 as '⬜ PENDING', while the banner directly below (lines 20-25) declares 'CORE DAG COMPLETE (2026-06-23)' + 'DRIVE COMPLETE. All 4 phases shipped 
- RECORD-HONESTY FAILURE (MEDIUM) — IMPL-RUN-BOARD.md carries TWO conflicting deploy hashes both labeled authoritative: line 22 'serving index-e9_Uza8v.js (the exact deployed hash)' vs line 24 'index-DwKmrGBp.js serving HTTP 200, hash-verified'. The LIVE site serves DwKmrGBp; e9_Uz
- RECORD-HONESTY FAILURE (HIGH) — P/PROGRESS.md is STALE post-drive: 0 mentions of 4.4.0; line 13 verbatim 'Version in tree: 4.3.0 (the K close cut, unchanged through O dev phase)' (actual tree is 4.4.0, tag v4.4.0 exists); the header (lines 3-15) still reads 'TRANCHE P — DEVELOPME
- RECORD-HONESTY FAILURE (MEDIUM) — P.md (the P charter) header still asserts 'DEVELOPMENT PHASE — DOCS ONLY ... No engine, demo, or library source is written here ... implementation opens only on the owner's explicit authorization'. That precondition was met (owner authorized 2026
- PROCESS REGRESSION (HIGH) — the drive tip df78088 (v4.4.0) is NOT merged to master. master tip is aef3ef3 (the M consume-edge); `git merge-base --is-ancestor df78088 master` = NO. The published 4.4.0 + the live deploy were cut from tranche-p-dev. The constellation precept (MEMORY
- RECORD-HONESTY TRAP (MEDIUM) — proof:no-deprecated-guard is MISLEADINGLY NAMED: it gates the vue-router next()-callback removal (H.W1 S5), NOT the @deprecated Animation/ScrollTimeline kf aliases. A reviewer scanning the gate roster would assume the deprecated-alias surface is cov
- RECORD-HYGIENE SMELL (LOW) — uncommitted gate-decision artifacts: scripts/soa-composite-decision.json (add 2.536→2.916, weighted 2.35→3.011) + scripts/spring-vector-decision.json are dirty in the working tree. These are device-dependent re-measurements written on gate run (both s
- VERIFIED-CLEAN (no regression): glass-ui ~4.0.0 pin is satisfied by installed 4.0.1 (tilde admits 4.0.x). The engine.ts=1397L / 2 @deprecated aliases / 92 tests / 9 benches ground-truth claims in the prompt are all confirmed on-disk — the records that DO carry these (IMPL-RUN-BOA

**Deferred/chronic terminalized:**
- IMPL-RUN-BOARD.md internal contradiction (3a/3b/4 PENDING vs DRIVE-COMPLETE banner; frozen 'Phase 3a IN PROGRESS' last-leg) → **Q.W0 (record-hygiene), phase NOW — reconcile the Phase ledger table to ✅, collapse the stale last-completed-leg narrativ**
- IMPL-RUN-BOARD.md dual deploy-hash (e9_Uza8v vs DwKmrGBp, both 'the exact deployed hash') → **Q.W0 — mark e9_Uza8v SUPERSEDED; assert DwKmrGBp as the single live hash, gate-witnessed by the live curl**
- P/PROGRESS.md + P.md + O/PROGRESS.md stale DEVELOPMENT-PHASE headers + 'Version in tree: 4.3.0' → **Q.W0 — re-header to 'PARTIALLY IMPLEMENTED in 4.4.0' + correct the in-tree version to 4.4.0 across all P/O boards**
- drive tip df78088 / v4.4.0 NOT merged to master (constellation master-merge precept unhonored) → **Q.W0 S-merge — merge tranche-p-dev→master at the Q close (or explicitly record the deliberate branch-strategy if intenti**
- proof:no-deprecated-guard misleading name (gates vue next(), not the kf @deprecated aliases) + NO gate over the deprecated-alias surface → **Q.W0 names the misnomer + dispatches the actual deprecated-alias gate (proof:no-legacy-surface) to the Q no-legacy wave **
- uncommitted scripts/*-decision.json (device-dependent re-measurements dirtying the tree) → **Q.W0 — commit or revert the decision-JSONs to the recorded verdict; add a .gitignore-or-deterministic-write note so gate**

**Proposed waves:**
- [NOW] **Q.W0** — RECORD-HYGIENE + SHIPPED-TRUTH RECONCILIATION (the Tranche Q opener, mirroring O.W0/P.W0). Five sub-clauses, all DOCS+gate only, NO source change: (S1) Reconcile IMPL-RUN-BOARD.md  · gate: proof:record-truth (NEW) — a runtime gate that: (a) greps IMPL-RUN-BOARD.md and FAILS if any Phase r
- [NOW] **Q.W0b** — GATE-NAME HONESTY + ALIAS-SURFACE COVERAGE HANDOFF. (S1) Rename/alias proof:no-deprecated-guard to proof:no-vue-next-callback (its true subject) OR add a docstring banner so no rea · gate: proof:gate-name-honesty (NEW, lightweight) — asserts every proof:*-guard / proof:no-* gate's docstri
- [NOW] **Q.W0c** — CONSTELLATION PIN-LEDGER WITNESS (pre-empt future pin drift). Author a single machine-readable docs/tranches/Q/PIN-LEDGER.json recording the SHIPPED pins (kf 4.4.0 → value.js ^1.1. · gate: proof:pin-ledger-current (NEW) — regenerates the pin set from package.json + `npm view @mkbabb/keyfr

**Friction pre-empted:**
- FRICTION: Q.W0's record-reconciliation touches IMPL-RUN-BOARD.md / P-PROGRESS / O-PROGRESS — the SAME docs that other Q lanes' waves (B2-ow9 no-legacy, B6 band-structure) will re-edit when they author
- FRICTION: the proof:record-truth clause (d) 'v4.4.0 tag is ancestor of master' will FAIL the moment it lands unless the master-merge actually happens — but merging tranche-p-dev→master is an owner-dom
- FRICTION: proof:record-truth clause (b) curls the live site, making it network-dependent (the same device-dependence class the CI-greening memory warns about — it would flake offline / on the slow Lin
- FRICTION: clause (e) 'no dirty scripts/*-decision.json' will itself flake because the soa/spring decision JSONs are REWRITTEN by their own gates on every run (device-dependent ratios) — running proof:

---

