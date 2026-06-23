# Tranche Q audit digest (23/31 lanes; 8 re-deployed)

## B1-parsethat-fusion
The PT-B3 fusion is sound where it landed: `then` was correctly left un-fused (its only consumers are tuple-load-bearing; value.js uses zero `.then()`), and `fuseAll`/`all` is a clean monomorphic unroll. BUT 0.12.0 shipp

**Findings:** STRENGTH — `then` left un-fused is CORRECT, not a missed opportunity. value.js consumes ZERO `.then()` (it is all `all`/`any`/`dispatch`/`map`). The o · CONTRIVANCE-RISK / zero-consumer surface #1 — `thenMap` (parser.ts:96-119) has ZERO consumers anywhere in the repo, in value.js, or in keyframes (veri · CONTRIVANCE-RISK / zero-consumer surface #2 — `fuse()` (leaf.ts:352-362) is strictly worse than thenMap: zero consumers AND it is NOT exported from th · FINDING — the `dispatch` subTable (2nd-byte widening, leaf.ts:103-215) has ZERO production consumers. value.js color.ts:732 and parsing/index

## B1-valuejs-color
YES — a deeper architectural transposition reaches &lt;12 allocs/call, and it is the SECOND HALF OF VJ-P1 THAT THE IMPL DROPPED, not a new idea. The shipped value.js 1.1.0 cured only the OKLCH->XYZ hub leg (84->37); the 

**Findings:** GROUND-TRUTH CONFIRMED: gamutMap(display-p3 OOG) is exactly 37 Color allocs/call (proof-gamut-alloc.mjs C2-cured PASS, N_TARGET=40). Per-class decompo · ANSWER TO THE LANE QUESTION — YES, a deeper transposition reaches <12, AND IT IS ALREADY NAMED BUT UNSHIPPED. The dominant residual is per-step egress · THE TRANSPOSITION (the converter-layer out-param the gate itself names at proof-gamut-alloc.mjs and the deferral comment at dispatch.ts): add an out-p · THE 9 HUB-INTERMEDIATES (XYZ 4 + OKLAB 4 + OKLCH 1) are the setup/emit conversions OUTSIDE the loop and are individually cheap, but to reach 

## B1-kf-s8-weakmap
S8 is an HONEST chronic, not a regression: the P.W11/O.W16 WeakMap correctly dissolved the foreign-stamp realm breach (proof:no-foreign-symbol-stamp PASSES) but did NOT retire the clone-restamp ceremony, so proof:workaro

**Findings:** GROUND-TRUTH CONFIRMED: the P.W11/O.W16 S8 WeakMap shipped (commit 495484a) and IS realm-clean — proof:no-foreign-symbol-stamp PASSES (zero kf-owned s · THE CEREMONY IS NOT INCIDENTAL — IT'S A STRUCTURAL CONSEQUENCE OF clone(): tryParseLeaves (utils.ts:226) returns shared MASTER leaves from a bounded L · TERMINAL-HOME OPTION A (VJ-L1 value.js fnName field) — VERIFIED VIABLE AND GENUINELY MINIMAL: value.js's ValueUnit clone() (index.ts:120-130) already  · TERMINAL-HOME OPTION B (kf-side clone-aware design) — VERIFIED VIABLE AND FULLY IN-REALM: subProperty CANNOT double as the carrier because pa

## B1-kf-soa
P.W2 SoA compositor fold is GENUINELY COMPLETE and exemplary for what it scoped: shipped (495484a), 5-clause gate green, bit-identical (maxErr=0), zero-alloc, K-monotone (add 2.25→2.38×, weighted 2.19→2.34× over K=3/8/12

**Findings:** STRENGTH: the SoA fold is genuinely shipped + gated, NOT a stub. proof:soa-composite is green with 5 live-observable clauses (measured-first, verdict- · STRENGTH: K-scaling is sound and the ratio HOLDS/GROWS with K. Live bench: add SoA-over-boxed = 2.25× (K=3), 2.29× (K=8), 2.38× (K=12); weighted = 2.1 · STRENGTH: the Amdahl whole-frame share is REAL and large. group-soa-integration.mjs measures blend at 75.9% of transformFramesGrouped (3-layer) / 71.2 · FINDING (first-frame-after-structural-change one-frame boxed gap — DELIBERATE, bounded, NOT a bug): transformFramesGrouped:345 sets useSoA = 

## B1-kf-emerging
Phase-1 of emerging-CSS (if(supports/media) + spring()) genuinely SHIPPED, gated, and clean — a real strength, not contrivance. The two advertised completions are NOT done: (1) the Phase-2 element-DEPENDENT arm is a type

**Findings:** SHIPPED + GREEN (strength): the Phase-1 element-INDEPENDENT arm is genuinely complete and gated. if(supports(...))/if(media(...)) resolve to concrete  · GAP 1 (Phase-2 element-DEPENDENT arm = a complete no-op): the typed seam exists — ResolveEnv carries customProps?/siblingIndex?/siblingCount? (resolve · GAP 2 (sibling-index()/sibling-count() never even ENTER the pass): VERIFIED — value.js 1.1.0 already parses both into FunctionValue('sibling-index'|'s · GAP 3 (the @function CALL-inlining arm is STRUCTURALLY UNREACHABLE — value.js gap, not in-realm): value.js 1.1.0 shipped extractFunctions (th

## B2-ow9-nolegacy
SHIP this wave in Q as Q.W-NOLEGACY, phase NOW. O.W9 is a clean DELETION-ONLY change at the library (3 re-export lines + 2 interface keys + 3 barrel re-exports) because the canonical KeyframesAnimation/KeyframesScrollTim

**Findings:** GROUND TRUTH CONFIRMED: 2 @deprecated value-alias re-exports live (engine.ts:1205 Animation; timeline.ts:218 ScrollTimeline) + 1 type-alias re-export  · MIGRATION SURFACE IS BIGGER THAN THE BRIEF'S 22. The 22 demo sites are ALL `import type { Animation }` used only as type annotation (`Animation<any>`  · DISAMBIGUATION FRICTION (the real trap): `ScrollTimeline` is overloaded — the kf JS class AND the ambient Houdini `globalThis.ScrollTimeline`. test/pl · NO GATE EXISTS over the deprecated-alias surface today. The misleadingly-named proof:no-deprecated-guard.mjs gates an UNRELATED thing (vue-ro

## B2-pw9-nanframe
DM-22 is a confirmed-LIVE, 4-tranche chronic whose original cure (P.W9 Path A: throw in parse()) was correctly REVERTED because parse() is embedded in fromString() and Path A would break the L.W1 S4 opaque-ingest contrac

**Findings:** CONFIRMED ROOT CAUSE of the revert: Path A (throw in parse()) is structurally incompatible with the L.W1 S4 opaque-ingest contract. engine.ts:1365 `fr · The NaN defect is REAL but LATENT-at-sample, not at-ingest. Chain: addFrame stores `new ValueUnit('entry', undefined, [NAMED_SELECTOR_SUPERTYPE])` so  · STRENGTH / KEY DISCOVERY: a complete named-phase→[0,1] resolver ALREADY EXISTS in scroll-scene.ts but is DISCONNECTED from the frame pipeline. PHASE_F · NO-LEGACY VIOLATIONS (two dead artifacts the impl drive left): (1) `NAMED_SELECTOR_SUPERTYPE` (frame-compiler.ts:128) is WRITTEN in addFrame 

## B2-pw7-democontrolpoint
The enabling wave the lane brief worried about (the drag2D LIGHT export) is ALREADY SHIPPED and gate-proven (index.ts:88, proof:drag-gesture S4) — no library wave is needed and the ordering-friction premise as stated is 

**Findings:** LANE-BRIEF INVERSION (the enabling wave is ALREADY DONE): the brief asks 'is drag2D a LIGHT export on index.ts?' — it IS. index.ts:88 `export { drag,  · drag2D IS gate-covered AND it is the L.W5/S4 clause of scripts/proof-drag-gesture.mjs (lines 47,529,609-616): asserts `drag2D` is a function exported  · THE REAL GAP — the O.W5 DemoControlPoint substrate was NEVER BUILT, so the whole P.W7 chain is unbuilt. Verified absent on tree: `find demo -iname '*C · P.W7's three D5 design gaps are all STILL OPEN on the shipped tree, exactly as the spec's born-RED witnesses predicted: (1) the HERO stage is

## B2-pw8-nstage-mobile
P.W8's NOW layer (mobile scroll-snap carousel + typed-directional VT + proof:scene-switcher-mobile) was correctly DEFERRED at the 4.4.0 ship (IMPL-RUN-BOARD names it 'bigger demo builds') and is the spine of my lane's Q 

**Findings:** GAP (THE shelf-driver, CONFIRMED born-RED): mobile is ENTIRELY unbuilt across the scene-switcher. grep max-width over demo/app/ returns ONLY CubeScene · GAP (CONFIRMED born-RED): the scene-switch is DIRECTIONLESS. demo/app/useSceneTransition.ts:32 calls startViewTransition(() => mutate(id)) with no typ · GAP (CONFIRMED by absence): scripts/proof-scene-switcher-mobile.mjs does NOT exist; it is absent from the package.json gate roster (only proof:scene-t · STRENGTH (regression-DOWN on the spec's dependency claim): glass-ui 4.0.1 (installed) ALREADY ships startViewTransition(mutate, { types }) AN

## B2-ow7-enginesplit
KEEP — O.W7 is a REAL elegance transposition, not churn, but ONLY when scoped to the standalone-play loop (NOT interpFrames/at/advanceTo, which are the public sampling/advance API external drivers consume) and lifted as 

**Findings:** GROUND-TRUTH CONFIRMED: engine.ts is 1397L (verified wc -l), 3L under the proof-decomposition.mjs LIBRARY_CEILING_OVERRIDE cap of 1400 (line 132). The · THE NAMED BLOCKER IS ALREADY DISCHARGED: P.W11 SHIPPED. utils.ts:52 now reads `const FN_NAME_MAP = new WeakMap<ValueUnit, string>()` (not the foreign- · REGRESSION DIRECTLY IN MY LANE'S BLAST RADIUS — proof:decomposition is currently RED on HEAD (df78088, exit 1). The P impl drive (commit 495484a, 'SoA · THE WAVE'S group.ts S5 PREMISE IS STALE. O.W7 §S5 and the FULL-LOOP-LEDGER both assert group.ts is '812L under its 820 override (8L headroom)

## B3-chronic-ledger (the P-inv-28 chronic-ledger sweep)
The impl drive made real chronic progress (DM-3 fromMorphSVG, DM-5 S9 parse-that, and the S8 WeakMap realm-clean belt-exit are GENUINE terminals — three 4-to-7-tranche chronics closed) but it also left the ledger in a de

**Findings:** DM-3 fromMorphSVG GENUINELY EXITED (strength). src/animation/morph-svg.ts (13.2KB) exports fromMorphSVG + MorphSVG over the single value.js PathGeomet · DM-2 DemoControlPoint is a P-INVARIANT-28 VIOLATION — a NINTH carry into Q. Declared 'ABSOLUTE FINAL / forbidden-8th-carry CLOSED' at O.W5 (deferred-l · DM-22 named-selector NaN-frame is EXPLICITLY DEFERRED in shipped code. frame-compiler.ts:449 reads verbatim: 'P.W9 (DM-22 named-selector NaN-frame) —  · S8 FN_NAME has a SPLIT STATE — the realm-cleanliness TERMINAL landed but the gate still flags it PENDING. utils.ts:52 is now a kf-MODULE-LOCA

## B3-contrivance-recheck
PASS-WITH-RESIDUE. The shipped impl-drive is contrivance-DISCIPLINED on the two highest-risk paths: Typed-OM was honestly KILLED on a measured 0.68× default-path regression (no permanent dual-path shipped), and the SoA c

**Findings:** STRENGTH — the MEASURE-FIRST discipline HELD on the two highest-risk shipped paths. Typed-OM was correctly KILLED: scripts/typed-om-decision.json reco · STRENGTH — the SoA compositor correctly attaches its perf path to the NON-DEFAULT add/weighted arms ONLY; the default `replace` arm at group.ts:368-37 · CONTRIVANCE RESIDUE (MODERATE) — TRIPLE-VALUED PROVENANCE + DUAL DECISION-JSON for ONE path. Three different SoA ratios coexist: group-soa-decision.js · GAP (MODERATE) — proof:wave-charter WAS NEVER AUTHORED. CONTRIVANCE-AUDIT.md:53 designates it a KEEP and 'the durable enforcing artifact' (th

## B4-prompt-recap — the FULL PROMPT RECAP from the constellation campaign through the impl drive to this audit ask
PARTIAL with two DROPPED-flag obligations. The impl drive genuinely shipped the core DAG (parse-that 0.12.0 + value.js 1.1.0 + kf 4.4.0 + verified redeploy) and closed real chronic work in-realm (S8 WeakMap, S9 parse-tha

**Findings:** CONSOLIDATED RECAP TABLE (the deliverable). The chain A->P is terminal in prompt-recap-P.md (verified held, zero re-litigation). The NEW prompt rows t · PROMPT [impl-1] 'complete the plan IN TOTALITY; publish/push/deploy authorized' (owner, 2026-06-22) -> PARTIAL. The DAG shipped end-to-end (parse-that · PROMPT [impl-2] 'validate, don't abrogate' / 'prototype + research NOW' (owner, 2026-06-22) -> ADDRESSED. SoA spike RAN (5632840/b42c097, ADOPT 2.54x/ · PROMPT [impl-3] 'novel CSS belongs in our grammar; library leads the platform' (owner, 2026-06-22) -> PARTIAL. P.W13 resolve-values.ts shippe

## B4-precept-reckoning
The shipped 4.4.0 HONORS the precepts it claims to honor — inv-16 is clean (parse-that prod dep genuinely removed), record-as-built honesty is the drive's strongest discipline (the HONEST DEFERRED FOLLOW-UPS ledger + the

**Findings:** HONORED — inv-16 is CLEAN in 4.4.0. S9 (utils.ts) removed the direct @mkbabb/parse-that PRODUCTION dep entirely (kf now reaches parse-that only transi · HONORED — record-as-built honesty is the STRONGEST precept in this drive. IMPL-RUN-BOARD.md:23 states the honest call plainly ('kf shipped 4.4.0 MINOR · HONORED — KISS/gestalt in the engine-core batch. The SoA compositor (group.ts) is a single PARTITION dispatch, NOT a legacy dual-path: numeric keys fo · HONORED — performance-above-all is evidenced, not asserted: SoA add 2.54×/weighted 2.35× on the REAL transformFramesGrouped path (Amdahl-scop

## B5-valuejs-arch
value.js's color hot paths are already deeply and idiomatically transposed (B3 ColorChannelPlan SoA, color2Into, DIRECT_PATHS, JND early-exit) — the mature-surface caveat is real, so contrivance discipline matters here. 

**Findings:** STRENGTH: the color hot paths are already deeply transposed — B3 ColorChannelPlan SoA in interpolate.ts (closure-free flat loop, hue ÷360 folded into  · BOTTLENECK (the gate names it itself): gamut-alloc residual is 37 allocs/call, of which ~28 are the per-step EGRESS wrapper `new DisplayP3Color(...)`  · BOTTLENECK (V8 deopt): mixColors (dispatch.ts:577-605) allocates a `resultComponents: number[]` array + a `keys.filter()` array per call AND construct · BOTTLENECK (kf consume, half-value.js): compile-color.ts:196-199 calls `sampleColorRamp(fromColor, toColor_, 1024, ...)` INSIDE the inner ΔE-

## B5-parsethat-arch
parse-that 0.12.0's CORE perf transpositions that got CONSUMED (the dispatch first-char Int8Array LUT, the inlined wrap()/trim() closures, the FLAG-based call() fast-path, the float64 packrat key fix, the SpanParser KILL

**Findings:** UNWIRED PERF API (the headline gap): leaf.ts dispatch()'s 2nd-byte subTable widening (lines 103-209) is BUILT + gated (proof-perf.mjs clause B over a  · DEAD/REDUNDANT EXPORT: leaf.ts fuse() (lines 351-362) is NOT in the barrel (absent from index.ts AND core.ts; only dist/leaf.d.ts:40 declares it) — so · ORPHAN COMBINATOR: parser.ts thenMap() (lines 96-119), the PT-B3 zero-tuple then+map fusion, has ZERO callers (grep finds only its own definition) and · PUBLISHED-BUT-UNCONSUMED TIER: the 16 closure Span builders (stringSpan/regexSpan/manySpan/sepBySpan/wrapSpan/optSpan/skipSpan/nextSpan/altSp

## B5-kf-engine-arch
B5 confirms the shipped impl drive was DISCIPLINED-BUT-PARTIAL on the engine: the measure-first spikes (group SoA ADOPT, Typed-OM KILL, Playhead DROP) were genuinely run and honestly recorded — a real strength to preserv

**Findings:** STRENGTH: the GROUP-blend SoA fold SHIPPED and is real (group.ts:536 soaBlendLayer over a precomputed Float64Array plan; buildSoAPlans rebuilt only on · LOAD-BEARING GAP (the prime B5 finding): the STANDALONE HEAVY interp path was NEVER transposed. processFrame (engine.ts:754) still does `for (const iv · O.W7 NOT DONE: engine.ts is 1397L; engine-playback.ts is ABSENT (only engine-composition/engine-css-metadata/engine-options were split out, all pre-P) · O.W9 / 5.0.0 NOT DONE: 2 @deprecated value aliases remain (engine.ts:1205 `export { KeyframesAnimation as Animation }`; timeline.ts ScrollTim

## B5-kf-demo-arch
The demo shipped a GREEN, well-aligned slice — the spring heatmap, square ARIA cure, cube axis-lock, and three earned eggs are real and live. But the frontend-design HEADLINE of P Band C was substituted: the easing scene

**Findings:** GAP (the spine of Q-demo): DemoControlPoint.vue was NEVER BUILT — demo/@/components/custom/DemoControlPoint.vue does not exist. It was the HARD precon · NO-LEGACY / CONTRIVANCE VIOLATION (active): drag2D + Drag2DHandle are exported from src/animation/index.ts:88,93 but have ZERO live consumers (grep ac · GAP: the easing HERO stage remains read-only — EasingHeroStage.vue:54 aria-hidden='true' + :210 pointer-events:none. The editor is still exiled to the · GAP: the AMIGA scene's P.W5.S2 cures did NOT ship. No AmigaTelemetry.vue (decay() physics still invisible — the scene's entire 'engine drives

## B6-dag-ordering
The Q DAG is acyclic and fully sequenceable with ZERO required mid-tranche deferrals — every deferred/chronic item from the P impl-drive has a concrete terminal Q wave with an explicit phase + predecessor edge. Four crit

**Findings:** DAG ROOT FACTS (verified on-disk): engine.ts=1397L (O.W7 split NOT done); the @deprecated `Animation` alias is live at engine.ts:1206 (`export { Keyfr · CRITICAL BREAKING-CUT ORDERING (the spine of Q's no-legacy band): O.W9.md:254-258 itself mandates `Sequence O.W9 (NOW) before O.W7 (engine-seam)` so t · drag2D → DemoControlPoint → P.W7 chain RESOLVED at the root: drag2D + Drag2DHandle ARE already exported from the LIGHT barrel (index.ts:88,93) — the o · value.js extractFunctions → kf @function inlining edge is NOW SATISFIED: value.js 1.1.0 ships extractFunctions (verified node_modules + src/p

## B6-gate-coverage
The gate INFRASTRUCTURE is in excellent shape and ready to carry Q with NO deferrals. Two system gates already mechanize the hard precepts: proof:chronic-closure enforces the P-invariant-28 exit-only mandate off a machin

**Findings:** GATE-FIRST PATTERN IS HEALTHY: the shipped P-drive gates are strong observable/same-report born-REDs, not source-shape stubs. proof-soa-composite.mjs  · DEFERRED-ITEM GATES ARE SPEC'D BUT ABSENT ON DISK: proof-no-legacy-surface.mjs, proof-named-selector-nan-frame.mjs, proof-waapi-differential.mjs, proo · BLIND-SPOT (CRITICAL): the O.W7 engine-seam split has a gate that is actively UNDERMINED by a masking override. proof-decomposition.mjs:130-132 carrie · BLIND-SPOT (appearance/interaction axis, the memory lesson): the deferred demo-fleet items P.W7 (DemoControlPoint chain) + P.W8 (N-Stage swit

## B6-completeness-critic — the backstop for the "NO deferrals in Q" mandate; sweep for any Q wave that would secretly spawn a mid-tranche deferral (a wave needing a not-yet-shipped sibling API, an unbounded scope, a measurement-not-taken gate, a chronic without a system-gate exit, a breaking change without a migration, a demo wave without an appearance-axis gate) and author the enabling/measure-first redress wave NOW.
The shipped 4.4.0 drive is HONEST and the constellation spine is healthy (S8/S9 exited, value.js 1.1.0 + parse-that 0.12.0 consumed green), but the impl drive deferred a coherent set of NINE items, and EVERY ONE is a lat

**Findings:** STALE DEFERRAL PREMISE (false gate) — the run-board defers P.W7 DemoControlPoint as 'gated on a library drag2D LIGHT export', but drag2D IS ALREADY a  · CHRONIC WITHOUT A SYSTEM-GATE EXIT — DemoControlPoint (O.W5/DM-2) is STILL UNBUILT after the drive (grep DemoControlPoint over demo/ src/ scripts/ = Z · BREAKING CHANGE WITHOUT A MIGRATION ARTIFACT — O.W9/P.W10 (drop @deprecated Animation/ScrollTimeline/ScrollTimelineOptions/presets.flip aliases → 5.0. · MEASUREMENT-NOT-TAKEN GATE (the contrivance enforcer never landed) — the CONTRIVANCE-AUDIT's durable preventive proof:wave-charter (the 7-que

## B6-band-structure
PROCEED with an 8-band Tranche Q mirroring the O/P template but RE-PHASED for the post-impl-drive reality: A apparatus (lint-tier finally lands + drag2D LIGHT export + perf-floor) / B engine-perf + emerging-CSS Phase-2 /

**Findings:** GROUND-TRUTH DELTA: kf shipped 4.4.0 (MINOR), NOT the planned 5.0.0. The 5.0.0 breaking cut is UNDONE — it is the terminal of Q's no-legacy band. engi · Q INHERITS A 16-ITEM DEFERRED SPINE from the impl drive (IMPL-RUN-BOARD.md:27-33 + the memory) — every one needs a Q wave with NO further deferral: (1 · BAND STRUCTURE VERDICT: mirror the O/P 8-band template EXACTLY but RE-PHASE for Q's reality. The O/P bands were authored when most work was NOW-and-un · CONTRIVANCE-RISK / no-legacy reconciliation needed in the charter: O/P split no-legacy (E) and transposition (D) awkwardly (P folded them int

## B7-honesty-record
The tranche record is PARTIALLY HONEST but has SYSTEMATIC STALENESS from a failure to update development-phase docs after the 4.4.0 impl drive. The most severe honesty failures are: (1) IMPL-RUN-BOARD.md Phase table stil

**Findings:** IMPL-RUN-BOARD.md INTERNAL CONTRADICTION: The Phase ledger table (lines 16-18) still shows rows 3a / 3b / 4 as '⬜ PENDING', but the success section be · IMPL-RUN-BOARD.md OVER-CLAIM in Phase 3a scope: Row 3a (line 16) lists 'O.W5 DemoControlPoint' as a 3a deliverable. DemoControlPoint.vue is ABSENT fro · P/PROGRESS.md STALE HEADER: Line 3-4 says 'Branch: tranche-p-dev (P development phase rides the O dev tip; O is RATIFIED — DEVELOPMENT phase docs lock · P/PROGRESS.md STALE VERSION: Line 13 says 'Version in tree: 4.3.0 (the K close cut, unchanged through O dev phase).' Actual version is 4.4.0 

