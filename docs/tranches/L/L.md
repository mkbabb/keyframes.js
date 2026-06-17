# Tranche L — bi-directional TOTALITY · SOTA · constellation completion

> **DEVELOPMENT PHASE ONLY.** This authors `docs/tranches/L/{L.md, PROGRESS.md,
> waves/L.W0–L.WZ.md, audit/*}` + the cross-repo dispatch. **No engine/demo/library
> source is written.** L.W1–L.WZ implementation opens only on explicit authorization
> — exactly the D.W0/E.W0/H.W0 dev→impl boundary. inv-16 holds throughout.

## Provenance

Tranche K **CLOSED + DEPLOYED 2026-06-16** — `4.3.0` live on keyframes.babb.dev
(master `9bbc227` green → deploy → live serves `index-43okVJtx.js`). K folded the
whole CSS-@keyframes round-trip frontier (the J K-SEED) into its Band II and proved
**replay-equality for a well-defined SUBSET**. The K close was honest (inv ε; the
36-lane audit re-certified every FINAL.md boundary). The green came after a ~6-round
CI-greenify session whose three architectural roots (fail-fast, 259 fixed-ms sleeps,
the Monaco-flake) L makes terminal.

L is chartered by the user (2026-06-16): **further true CSS parity; SOTA performance
and usability; true bi-directional CSS facilities with the compiler + frame-compiler;
the status of value.js and parse-that.** It is grounded in a **36-lane deep audit**
(`audit/audit-32-skeleton.txt` is the 31-lane skeleton file; the 5 completion lanes
32-36 live in `audit/completion-lanes-32-36.txt` + the per-lane records) that produced 129 wave
candidates, 34 precept-violation findings, the re-confirmed 12-KILL anti-charter, and
the full A→K + this-session prompt/precept recap. The audit's one dissent ("no L
exists — K folded everything") is **evidence-of-record only**: K folded the round-trip
*existence*; L is its **TOTALITY** (every CSS feature parses → animates → compiles back
OR honestly refuses), the **SOTA** push, the **publish/dogfood** completion, and the
**constellation coordination** the round-trip's subset-status makes net-new.

## The premise — what L is

K answered *"can the authoring object BE CSS, round-tripped?"* — yes, for the core
animation grammar. L answers the three questions K's subset-status leaves open:

1. **Is the round-trip TOTAL?** No. The audit found a family of **replay-equality
   breaches in the SHIPPED surface**: `!important` silently dropped
   (`adapter.ts` `declsToVarMap`), `@property` registrations never re-emitted backward
   (`engine.ts:1225`), per-stop `animation-composition` asymmetric (`format.ts:81-103`),
   named keyframe selectors (`entry/exit/cover/contain`) ingested-then-THROWN
   (`frame-compiler.ts:179-188`), the **compiler is scroll-BLIND** (W9 + W10 do not
   compose — `compile.ts` has zero timeline emit), and **multi-color densify ships a
   non-faithful sRGB block with `eligible:true`** while a single-color drift HARD-REFUSES
   (`compile-color.ts:188-190` — the honest-refusal clause violated). L closes each, or
   refuses with a named reason — never silently approximates.

2. **Is it SOTA?** The engine perf is exemplary (zero-alloc compositor, monomorphic
   dispatch, WAAPI-isomorphic). The frontier is the **value.js color-math hot paths**
   (`transformMat3`/`oklab2xyz`/`mixColors`/`gamutMapToRgbSpace` allocate per-call —
   VJ.L1–L8), the kf **granular dynamic boundary** (`loadAnimationEngine()` Promise.all's
   all 8 chunks), the **lerpArray consume** on the LIGHT tier (published, un-consumed),
   and `warmEngine()`/`scheduler.postTask` increments.

3. **Is the constellation complete?** No. **ED-3 dogfood-inversion is STAGED, not landed**
   (the demo still imports `@src/animation/*` — zero `@mkbabb/keyframes` barrel imports);
   **keyframes-vue 0.1.0 is unpublished**; and the cross-repo seam carries **kf-local
   workarounds for sibling defects** (the `linear()` regex, the `FN_NAME` Symbol stamp,
   the direct `parse-that` dep, the `:aria-orientation` suppression) that the no-workaround
   precept indicts — each is a value.js/glass-ui/parse-that fix-and-re-pin, not a kf patch.

## The invariant set carried into L

The J/K spine holds; L adds three:

- **inv-L-totality (replay-equality TOTAL):** the round-trip is the parser run backward
  for the FULL parsed surface, or a **named CompileRefusal** — never a silent drop or a
  wrong-color ship. The `format.ts` THROW idiom for un-serializable easing is the law;
  L extends it to `!important`, `@property`, composition, and multi-color.
- **inv-L-acyclic-purity (no consumer-side sibling-patch):** a defect in a published
  sibling is fixed AT THE SIBLING and consumed via re-pin — NEVER corrected at the kf
  consume seam. Every existing such workaround (the audit's ⚠1-3, ⚠18-20, ⚠24) is a
  born-RED L deletion gated on the sibling publish.
- **inv-L-device-honesty (the gate-suite law, from the CI-greenify lesson):** a CI gate
  asserts a device-INDEPENDENT predicate, or declares `observe-only` with a CATEGORY
  (wall-clock / pixel-render / physics-settle) and a recorded architectural cure. No gate
  passes on the fast dev box yet fails on the slow runner. See
  [[project_ci_device_dependence_greening]].

P-invariant-28 (no perpetual punts — the audit found H→J mis-terminated DL-K1/2/3/4/10
via source-shape gates that never drove the cold path; K.W0 rebuilt the oracle), inv-16,
no-legacy, gestalt/KISS, and the acyclic-spine all carry forward.

## The two bands

**Band A — kf-internal TOTALITY (value.js-0.13.0-and-4.3.0-sufficient; no new sibling gate):**
proceeds immediately. The replay-equality floor, the compiler completeness, the ingest
deepening, the gate-suite transposition, the SOTA-perf increments, the usability +
publish/dogfood completion. K already shipped the substrate; Band A makes it total.

**Band B — CONSTELLATION coordination (gated on sibling publishes):** the cross-repo
dispatch. **glass-ui's BB tranche is IN EXECUTION (in flight)** — the asks land into a
live tranche; **value.js is Tranche N (0.13.0) heading to O**; **parse-that is 0.9.0
(PT-WAVE-3)**. Band B dispatches + consumes-on-publish, born-RED-gated kf-side, never a
`file:`/vendored link.

## The wave map

**Gate-first / born-RED discipline (Lane 33 — the load-bearing L law).** The audit's
gate-coverage lane found the corpus does NOT gate the L work: ALL FIVE replay-equality
breaches **silently pass** because no fixture exercises them, `proof:replay-equality`
does NOT exist, and the round-trip gates are SOURCE-SHAPE (they grep test anchors, they
do not enumerate the input space — the `gate-is-runtime` blind-spot). Therefore **every
Band-A wave authors its born-RED gate FIRST**, over the REAL breach inputs (an
`opacity:0 !important` keyframe, a registered `--prop` @property block, a per-stop `add`,
a `entry/exit` named selector, a 2+-changing-color track, a scroll-driven compile) — the
gate must RED on today's tree before the cure greens it. A wave with no born-RED gate is
not started.

| Wave | Band | Title | Folds (audit W#) | Born-RED gate | Sibling dep |
|---|---|---|---|---|---|
| **L.W0** | — | Audit-fold + path forward (DEV, now) | this charter + the **36-lane** evidence + ledger + recap + cross-repo dispatch | the artifacts on disk, re-runnable | — |
| **L.W1** | A | Replay-equality FLOOR (bi-directional totality) | !important honor (W116; adapter.ts:declsToVarMap drops `Declaration.important`), @property backward-serialize (W75), per-stop composition symmetry (W76), named-selector animate (W118), OPERATOR-floor composite/iteration-composite/play-state (W117) | **`proof:replay-equality` (NEW, W89)** — parse→serialize→parse identity over a fixture set that CONTAINS all 5 breach inputs; RED today | value.js 0.13.0 (has the data) |
| **L.W2** | A | Compiler completeness (close the compose gaps) | CC-6 compile the scroll grammar (W12 — the scroll-BLIND headline), CC-3.5 multi-color refuse-or-densify (W113 — the asymmetric honest-refusal), CC-5 static-weight pre-multiply (W36), animation-timeline/range emit (W119), unify time-serialize on reverseCSSTime (W115) | `proof:compile-replay` + **NEW multi-color + scroll-driven fixtures** (W114) — the gate bites the lossy case it currently skips | value.js 0.13.0 (sampleColorRamp/deltaEOK) |
| **L.W3** | A | Ingest deepening (live-stylesheet parity) | seedAtTime delay reset (W8 — adoptRunning FREEZES on delay>0), recursive group-rule walk for nested @keyframes (W7), ADOPT_REFUSE diagnostics (W9), adoptedStyleSheets/Shadow-DOM walk (W10), scroll-time currentTime (W11) | `proof:ingest-replay` extended — NEW delay/nested/shadow/refuse arms | — |
| **L.W4** | A | The gate-suite transposition + publish-path hardening (end the whack-a-mole) | report-all non-fail-fast posture (W27), the waitForRender/settle lib primitive over **259 fixed-ms sleeps** (W28), Linux-container local-repro (W29), single-source device thresholds + observe-only CATEGORY taxonomy (W22/W30), the missing gates (proof:no-single-option-select W2, M2 touch path W19); **publish-path:** run proof:published-surface + proof:deps-current in release.yml, **NEW `proof:peer-satisfied`** (catches the live F-2 peer-cycle) | the demo-smoke job runs report-all; zero fixed-ms sleeps in the render-wait seam; release.yml runs ci.yml's gate roster | — |
| **L.W5** | A | Orchestration-tier SOTA-DX (the gesture/transport parity — Lane 32) | Draggable **bounds + snap + rubber-band** over the shipped decay/spring (W-GESTURE-BOUNDS — the GSAP-Draggable/Motion-dragConstraints hole), Sequence **segment-lifecycle + label-callback** channel + a LIGHT-path subscribe hook mirroring ScrollScene `.on` (W-TRANSPORT-EVENTS), the 2-D drag single-call sugar | `proof:drag-gesture` extended (bounds/snap) + a `proof:transport-events` born-RED (segment callbacks fire) | — (LIGHT, value.js-free) |
| **L.W6** | A | Agent-authoring surface (the moat's FORWARD verb — Lanes 32/35) | **`validate(css)`/`explain(css)`** — a read-only projection over the EXISTING diagnostics (DiagnosticCode) + CompileRefusal + WAAPIEligibility channels → one agent-shaped `{parseable, eligible, refusals, diagnostics, waapi}`; the llms.txt **validate→fix→compile LOOP** teaching; **`generate()` is KILLed** (KISS/inv-16/moat-gestalt — the LLM generates, kf validates+compiles) | `proof:agent-validate` born-RED + proof:agent-surface admits the verb | value.js 0.13.0 (HEAVY; **gated on L.W1+L.W2** so the refusal surface it projects is TOTAL) |
| **L.W7** | A | SOTA performance (kf-internal) | warmEngine idle-warmer (W121), lerpArray consume on the LIGHT tier (W122), scheduler.postTask priority bands born-RED probe (W123), granular loadAnimationEngine per-capability accessors (W124), EPF-1 read/write phase separation measure-first (W40) | `proof:zero-alloc` extended (LIGHT-tier) + a **budgeted bench taxonomy** (no kf bench covers the value.js color-math alloc claims today) | value.js lerpArray (published) |
| **L.W8** | A | SOTA usability + publish/dogfood completion | **ED-3 dogfood inversion** flip demo→published barrel (W125 — 63 files still `@src`), **publish keyframes-vue 0.1.0** (W56 — STAGED-not-shipped), extend animate() to dispatch the orchestration tier (W127), retire PKG-3 d.ts collision-aliases (W126), keyframes-react BOOK (W129) | `proof:demo-on-published-surface` GREEN (demo imports the barrel); keyframes-vue published-surface gate | 4.3.0 (published) |
| **L.W9** | B | Constellation cross-repo dispatch | **glass-ui BB (in-flight):** SegmentedTabs aria fix + **delete the incomplete kf suppression** (W24/W50; the band-aid is on SpringSidebar only — AnimationControls:66 still leaks), W-DOCK-MORPH-FAMILY/RF-17 4.1.0 (W18/W43), **the LIVE F-2 peer-cycle** (glass-ui ^0.10.0‖^0.11.0 rejects value.js 0.13.0 — ELSPROBLEMS today; ⚠8), GlassControlPoint (W34), KF-OSCILLATOR co-schedule (W128). **value.js Tranche O:** comma-list grammar (W74), transform axis fix (⚠12), color() replay-equal (W71), @property syntax (W73), linear()/FunctionValue serialize (VJ-L2/⚠23), partial-input honesty (⚠10/13), perf VJ.L1-L8 (W78-85), parseCSSSubValue to **drop kf's direct parse-that dep** (W94). **parse-that:** packrat soundness id,offset (W93), permutation combinator (W105), typesVersions surgery (W91) | each ask dispatched (the three KF-TO-* docs); each consume born-RED kf-side; the **workaround-deletion gates** (linear-regex, FN_NAME, parse-that-dep, aria-suppress) bite on consume | glass-ui 4.1.0 · value.js O (0.14.0) · parse-that |
| **L.W10** | B | True-CSS-parity frontier (the coordinated grammar) | the grammar-gap closure — CSS Nesting (Baseline-2023, silently dropped), url-token, modern at-rules (@container/@layer/@scope/@property/@page), structured gradients, env()/attr()/system-colors (W98/W101-110); **the architectural decision: unify on ONE CSS grammar** — delete parse-that/parsers/css OR promote it to the tokenizer value.js's typed layer consumes (W97); the incremental/streaming-parse SOTA research (W100) | a research-and-challenge spike FIRST (no code); then a coordinated value.js+parse-that publish + kf re-pin; a `proof:css-parity` capability matrix | value.js O + parse-that (coordinated) |
| **L.WZ** | — | Close (recap · deferred terminal · release) | FINAL.md (inv ε); the deferred ledger TERMINATED; the prompt-recap confirmed; **the version cadence** — the round-trip-totality + barrel-dogfood + keyframes-vue-publish set argues a MAJOR `5.0.0` (USER-DOMAIN; L.WZ proposes the criteria) | proof:all green; the deploy round-trip re-observed | — |

**DAG:** L.W0 (now) → Band A (W1∥W2∥W3∥W4∥W5∥W6∥W7∥W8 — largely file-disjoint; W2 composes W1's engine, W6 gates on W1+W2, the rest independent) · Band B (W9 dispatch immediately, consume-on-publish; W10 research-spike then coordinate) · L.WZ closes when Band A is green and Band B's edges have consumed or honestly circled-back. **Gate-first throughout: each Band-A wave's born-RED gate lands before its cure.**

## The KILL anti-charter (12, re-confirmed — non-re-litigable)

VT-A/B (View-Transition dispatch + ::view-transition @keyframes — inv-16/kf-owns-time),
CE-2/3 (@property-for-compositing + compositor-oklab — platform physics unchanged),
EPF-2 (interpolation JIT — dispatch already monomorphic; CSP/KISS-hostile for <25%),
EPF-5 (LoAF adaptive-quality — sheds author-declared intent), K-T1 (kf splitText — a11y
hazard, off-axis), K-T3 (Custom-Highlight animation — paint mask not motion), CC-7
(blanket @starting-style — platform-incorrect), ED-6 (JSR publish — loses the static/
dynamic boundary), PHYS-A (coupled vector springs — equivalent to N independent),
Worker/OffscreenCanvas/AnimationWorklet + GPU/WebGPU compute (no DOM-style write path
off-main-thread — re-examined 2026, STILL-KILL). These are L's standing anti-charter
(L.W-KILL-GUARD re-confirms; a value.js AST extension would gate any future re-look).

## The deferred fold + the precept scorecard

The K ledger closed terminal (`proof:chronic-closure` 44 rows, all ten ≥4-tranche riders
exited). L inherits the OUT/HANDOFF items as **Band B gated consume-edges** (RF-17/DL-K9,
GlassControlPoint/DL-K7, MorphSVG/FB-3, parse-that-packrat/PT-2) — each with a named
tripwire, none re-BOOKed (P-invariant-28). The precept scorecard: the J/K structural spine
held through all 12 K waves + the CI-greenify session; the violations the audit DID find
are the CI-greenify-era **consumer-side band-aids** (the `:aria-orientation` suppression —
incomplete + wrong-layer, the `linear()`/`FN_NAME`/`parse-that`-dep workarounds, the
multi-color silent-densify, the !important/@property silent-drops) — every one is a named
L cure (Band A engine-internal, or Band B fix-at-sibling), NOT carried forward. The full
A→K + this-session prompt ledger has **zero drops** (`audit/prompt-recap-L.md`); the live
re-raised findings (dock/controls/hover/scrubber/scrub-idle/collapsed-dock) are K Band I,
TASTE-approved, now DEPLOYED — L's L.W0 verifies the deployed build shows them and L.W7
dispatches the dock-flicker residual to the in-flight BB tranche.
