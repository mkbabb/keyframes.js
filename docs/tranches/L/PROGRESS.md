# Tranche L — PROGRESS (the board + the L open-deferrals chronic ledger)

**Branch:** `tranche-l-dev` (forked off `master` @ `9bbc227` — the K-close tip; kf `4.3.0` published
via `release.yml` run `27640592021`; value.js `^0.13.0`, glass-ui `~4.0.0`, parse-that `^0.9.0`
consumed PUBLISHED).
**Type:** TRANCHE L — **DEVELOPMENT PHASE.** This board records the wave plan + the
consolidated L open-deferrals ledger. §1 carries each wave's status (DEVELOPED with born-RED gate
named; impl opens on explicit authorization); the §"Open deferrals" ledger is the NEXT
chronic-closure parse substrate (K's remains AUTHORITATIVE until L.WZ — see the SUBSTRATE-TRANSITION
note).
**Dev-phase date:** 2026-06-16 — the 36-lane audit completed; all twelve waves DEVELOPED; the
Band-B gated consume-edges named and tripwired; the born-RED gate discipline applied to every Band-A
wave before any cure. **Version in tree:** `4.3.0` (the K close cut); L's version cut + publish +
close-merge round-trip are USER-DOMAIN (Mike Babb, confirm-first), proposed at L.WZ (the MAJOR
5.0.0 vs MINOR 4.4.0 decision).

This board is the spine of the tranche-development phase: the §0 headline (why L exists — the three
questions K's subset-status leaves open, the 36-lane evidence, the replay-equality breach family +
the gate-blind corpus), the §1 wave board with each wave's headline gate (both bands), the §2
finding-cluster ledger with evidence anchors from the audit, the §3 precept reckoning, and the
§"Open deferrals" chronic ledger that folds every K-terminal HANDOFF + the Band-B gated consume-edges
into the next parse substrate. Companion documents:

- **`L.md`** — THE binding charter (the two bands — Band A kf-internal TOTALITY, Band B CONSTELLATION
  coordination; the 12-wave map; the gate-first/born-RED discipline; the three L-born invariants;
  the KILL anti-charter re-confirmed 12; the deferred fold + precept scorecard).
- **`audit/audit-32-skeleton.txt`** — the 32-agent deep audit corpus (31 lane summaries + 34
  precept violations + 129 wave proposals + CROSS-REPO-ASK / KILL / CHRONIC-FOLD findings). The §2
  cluster ledger and §"Open deferrals" substrate cite this by `W#` and `⚠#`.
- **`audit/completion-lanes-32-36.txt`** — the 5 completion lanes: gesture/transport DX (Lane 32),
  agent-authoring verb (Lane 35), gate/test/bench corpus coverage (Lane 33), demo-UX/docs (Lane 34),
  release-pipeline/supply-chain (Lane 36). Lane 33 delivers the load-bearing gate-corpus finding
  (ALL FIVE replay-equality breaches silently pass; `proof:replay-equality` does NOT exist).

---

## §0 — THE HEADLINE (why Tranche L exists)

Tranche K answered *"can the authoring object BE CSS, round-tripped?"* — yes, for a well-defined
SUBSET (the core animation shorthand; per-kf steps()/cubic-bezier(); oklab-densified single-color
tracks; scroll parse+dispatch; ingest CSSOM → replay-equal). `K/FINAL.md` is honest on the subset
status; inv ε holds. L is chartered by that honesty: it answers the **three questions K's
subset-status leaves open**.

**1. Is the round-trip TOTAL?** No. The 36-lane audit found a family of **replay-equality breaches
in the SHIPPED surface**: `!important` silently dropped (`adapter.ts` `declsToVarMap` — ⚠31; `W116`),
`@property` registrations never re-emitted backward (`engine.ts:1225` — ⚠15; `W75`), per-stop
`animation-composition` asymmetric (`format.ts:81-103` — ⚠16; `W76`), named keyframe selectors
`entry/exit/cover/contain` ingested-then-THROWN (`frame-compiler.ts:179-188` — ⚠17; `W77`), the
**compiler is scroll-BLIND** (W9+W10 do not compose — `compile.ts` has zero timeline emit — `W12`),
and **multi-color densify ships a non-faithful sRGB block with `eligible:true`** while a
single-color drift HARD-REFUSES (`compile-color.ts:188-190` — ⚠28/⚠29; `W113`). Lane 33 finds the
decisive meta-breach: NONE of these five are gated — the round-trip corpus has no fixture that
exercises any of them, `proof:replay-equality` does not exist, and the source-shape gates green over
the exact lossy inputs they should catch (`completion-lanes-32-36.txt` §Lane 33).

**2. Is it SOTA?** The engine perf is exemplary. The frontier is the **value.js color-math hot paths**
(`transformMat3`/`oklab2xyz`/`mixColors`/`gamutMapToRgbSpace` allocate per-call — `W78-W85`; ★ in
`audit-32-skeleton.txt §HIGH-severity`), the kf **granular dynamic boundary** (`loadAnimationEngine()`
Promise.all's all 8 chunks — `W124`; `★src/animation/index.ts:334-363`), the **lerpArray consume**
on the LIGHT tier (published in value.js 0.13.0, un-consumed — `W122`; ⚠34), and the
`warmEngine()`/`scheduler.postTask` increments (`W121`/`W123`).

**3. Is the constellation complete?** No. **ED-3 dogfood-inversion is STAGED, not landed** — the
demo still imports `@src/animation/*` (63 files; zero `@mkbabb/keyframes` barrel imports — `W125`;
★`audit-32-skeleton.txt §HIGH-severity`); **keyframes-vue 0.1.0 is unpublished** (`W15`/`W56`;
★`packages/keyframes-vue/package.json`); and the cross-repo seam carries **kf-local workarounds for
sibling defects** (the `linear()` regex `utils.ts:193-196` — ⚠20/`W87`; the `FN_NAME` Symbol stamp
`utils.ts:42-57` — ⚠18/`W86`; the direct `parse-that` dep — ⚠24/`W94`; the `:aria-orientation`
suppression `SpringSidebar.vue:43` — ⚠1/⚠2/⚠3) that the no-workaround precept and inv-L-acyclic-purity
indict — each is a value.js/glass-ui/parse-that fix-and-re-pin, not a kf patch.

Additionally, **the gate-suite itself violates inv-L-device-honesty**: 259 fixed-ms
`waitForTimeout()` sleeps are the macOS-pass/Linux-fail render-race root (`W28`;
★`audit-32-skeleton.txt §HIGH-severity`); the CI demo-smoke job is serial-AND fail-fast with no
report-all mode (`W27`); and no Linux-container local-repro exists (`W29`). These are the CI-greenify
era's architectural roots — L makes them terminal.

---

## §1 — THE WAVE BOARD (DEVELOPED statuses + headline gates)

The DAG (`L.md §wave map`): **L.W0 (now) → Band A (W1 ∥ W2 ∥ W3 ∥ W4 ∥ W5 ∥ W7 ∥ W8; W6 gates on
W1+W2; largely file-disjoint) · Band B (W9 dispatch immediately, consume-on-publish; W10
research-spike then coordinate) · L.WZ closes when Band A is green and Band B's edges have consumed
or honestly circled-back.** Status legend: **DEVELOPED** = the wave plan is authored this dev phase,
born-RED gate named; impl opens on explicit authorization. The born-RED gate is named-now /
authored-in-impl (the gate SOURCE is written in the impl phase, never here — exactly the K
precedent).

**Gate-first / born-RED discipline (inv-L; the load-bearing L law).** The audit's Lane 33
(`completion-lanes-32-36.txt §Lane 33`) finds the corpus does NOT gate the L work: all five
replay-equality breaches silently pass, `proof:replay-equality` does NOT exist, and the round-trip
gates are source-shape. Therefore every Band-A wave authors its born-RED gate FIRST, over the REAL
breach inputs — the gate must RED on today's tree before the cure greens it. A wave with no born-RED
gate is not started.

| Wave | Band | Title | Status | Headline gate(s) (born-RED) | Born-RED witness (the defect the oracle bites) | DAG |
|---|---|---|---|---|---|---|
| **L.W0** | — | Audit-fold + path forward | **DEVELOPED** (now) | the artifacts on disk, re-runnable (`L.md`, `PROGRESS.md`, `audit/*`, cross-repo dispatches authored) | the 36-lane evidence + this board + the `audit-32-skeleton.txt` CROSS-REPO-ASK finding family | **LEADS** — the charter + board are the impl-phase substrate |
| **L.W1** | A | Replay-equality FLOOR | **DEVELOPED** | **`proof:replay-equality` (NEW)** — parse→serialize→parse identity over a fixture set that CONTAINS all five breach inputs: an `opacity:0 !important` frame (⚠31), a `@property --x <number>` block (⚠15), a per-stop `animation-composition: add` (⚠16), an `entry`-selector rule (⚠17), an `OPERATOR-FLOOR composite/iteration-composite/play-state` option (W117); gate must RED on today's tree, GREEN on the cure | Born-RED: `adapter.ts` `declsToVarMap` drops `Declaration.important`; `engine.ts:1225` never calls `serializeStylesheetItem`; `format.ts:81-103` emits per-stop easing but NOT per-stop composition; `frame-compiler.ts:179-188` throws on `entry/exit/cover/contain`; all five silently pass all current gates (`audit-32-skeleton.txt §Lane-33`) | **LEADS Band A** — its engine surface is the precondition for L.W6 (validate/explain project a TOTAL refusal surface) |
| **L.W2** | A | Compiler completeness | **DEVELOPED** | **`proof:compile-replay` extended** — NEW multi-color fixture + multi-color refusal/densify assertion (⚠28/⚠29; `W113`/`W114`); NEW scroll-driven compile fixture (`W12` — the scroll-BLIND headline; `compile.ts` zero timeline emit); `CC-5` static-weight pre-multiply (`W36`); unify time-serialize on `reverseCSSTime` deleting bespoke `reverseMs` (`W115`; ⚠30); `animation-timeline`/`animation-range` emit from `compileToCSS` (`W119`) | Born-RED: multi-color track emits verbatim sRGB with `eligible:true` ΔE=0.82 (`compile-color.ts:188-190`; ★ in `audit-32-skeleton.txt §HIGH-severity`); `compileToCSS` has zero `animation-timeline` emit for scroll-driven inputs; `reverseMs(1000)='1s'` while `reverseCSSTime(1000)='1000ms'` coexist (⚠30); multi-color fixture ABSENT from `test/fixtures/keyframes/manifest.json` | ∥ W1; value.js 0.13.0-sufficient (sampleColorRamp/deltaEOK published, ^0.13.0 in tree) |
| **L.W3** | A | Ingest deepening | **DEVELOPED** | **`proof:ingest-replay` extended** — NEW delay-reset arm (`seedAtTime` delay>0 frozen — `★src/animation/ingest.ts:258-272`; `W8`); NEW nested group-rule arm (`W7`); NEW `ADOPT_REFUSE` diagnostics arm (`W9`); NEW adoptedStyleSheets/Shadow-DOM arm (`W10`); NEW scroll-time `currentTime` arm (`W11`) | Born-RED: `seedAtTime` on a source animation with `animation-delay: 0.5s` freezes the takeover at time=0 (`ingest.ts:258-272`; ★ `audit-32-skeleton.txt §HIGH-severity`); no current ingest test exercises any of the four new arms (Lane 33 gap-table) | ∥ W1, W2 — follows K.W8's surface; no new sibling gate |
| **L.W4** | A | Gate-suite transposition | **DEVELOPED** | **report-all posture** for demo-smoke (W27 — zero serial-AND fail-fast; first RED no longer aborts corpus); **`waitForRender/settle` lib primitive** replacing the 259 fixed-ms `waitForTimeout()` sleeps (W28 — the macOS-pass/Linux-fail render-race root; ★`scripts/*.mjs`); **Linux-container local-repro** (W29 — Docker/act on dev box); **single-source device thresholds** (`ci-env.mjs` authority — W30); **NEW `proof:peer-satisfied`** (catches the live F-2 ELSPROBLEMS peer-cycle — ⚠8; `W36` §Lane 36); **release.yml hardening**: run `proof:published-surface` + `proof:deps-current` before npm publish (`W36`); **NEW `proof:no-single-option-select`** (the W2 missing CI hard-gate; product fix in place, gate-only gap); **NEW `proof:live-session-mobile` M2 touch path** (W19) | Born-RED for render-settle: `grep waitForTimeout scripts/*.mjs` = 259 hits (★ `audit-32-skeleton.txt §HIGH-severity`); `proof:peer-satisfied` RED on today's tree because glass-ui `^0.10.0||^0.11.0` does not admit value.js 0.13.0 (⚠8; `completion-lanes-32-36.txt §Lane 36`); report-all: CI demo-smoke is ~70 sequential gates, first-red-aborts | ∥ all Band A; no sibling gate |
| **L.W5** | A | Orchestration-tier SOTA-DX | **DEVELOPED** | **`proof:drag-gesture` extended** — born-RED bounds/snap/rubber-band arms (GSAP-Draggable/Motion-dragConstraints parity hole; Lane 32); **NEW `proof:transport-events`** born-RED (Sequence segment-lifecycle callbacks fire; `label-callback` channel; LIGHT-path subscribe hook mirroring ScrollScene `.on`; `W-TRANSPORT-EVENTS`) | Born-RED: no `bounds`/`snap`/`rubber-band` API exists on `Draggable` (Lane 32 gap: "no bounds / snap / rubber-band — GSAP Draggable + InertiaPlugin parity hole"); no per-segment lifecycle callback on `Sequence` (Lane 32 "GAP (orchestration observability)"); both confirmed absent by grep | ∥ other Band A; LIGHT, value.js-free |
| **L.W6** | A | Agent-authoring surface (`validate`) | **DEVELOPED** | **NEW `proof:agent-validate`** born-RED (the verb does NOT exist today — Lane 35 "The agent-authoring VERB is genuinely net-new"; `W-AGENT-VALIDATE`); **`proof:agent-surface` extended** to admit the new verb | Born-RED: no `validate(css)` export exists on the published surface (`grep -r "validate" src/animation/index.ts` → 0 matching exported symbols; Lane 35); the verb is a read-only projection over `resolveKeyframes`/`compileToCSS`/`isWAAPIEligible` — the three channels already CI-gated, the verb un-wired | **gates on L.W1+L.W2** (the refusal surface it projects must be TOTAL before the verb ships; HEAVY path) |
| **L.W7** | A | SOTA performance | **DEVELOPED** | **`proof:zero-alloc` extended** to the LIGHT tier (NumericAnimation/SpringProgress — ⚠34; `W122`); **NEW budgeted bench taxonomy** (no kf bench covers value.js color-math alloc claims today — Lane 33 "NO bench covers the SOTA value.js color-math alloc claims"); **`warmEngine()` idle-warmer probe** born-RED (`W121`); **granular `loadAnimationEngine()` per-capability accessor** probe born-RED (`W124`; ★`src/animation/index.ts:334-363`) | Born-RED: `proof:zero-alloc` covers ONLY the AnimationGroup compositor (Lane 33); LIGHT tier (NumericAnimation, SpringProgress) is un-instrumented; `loadAnimationEngine()` Promise.all's 8 chunks in one all-or-nothing call (`index.ts:334-363`; K/FINAL.md:66 records this as an explicit kf-owned follow-up); value.js lerpArray published (0.13.0) and un-consumed on NumericAnimation path (⚠34) | ∥ W1-W5; value.js lerpArray published (no new sibling gate) |
| **L.W8** | A | SOTA usability + publish/dogfood | **DEVELOPED** | **`proof:demo-on-published-surface` GREEN** (demo imports the barrel — 63 files `@src` → `@mkbabb/keyframes`; `W125`; ★ `audit-32-skeleton.txt §HIGH-severity`); **keyframes-vue `proof:published-surface`** gate (0.1.0 published under the same release discipline; `W15`/`W56`); **PKG-3 d.ts collision-aliases retired** (`Animation_2 as Animation` — `W126`); **README prose** for 6 undocumented 4.3.0 exports (`W-DOCS`; Lane 34) | Born-RED: `grep @mkbabb/keyframes demo/` → 0 hits today (★ `audit-32-skeleton.txt §HIGH-severity`); `packages/keyframes-vue/package.json` version `0.1.0` is unpublished (★); `Animation_2 as Animation` alias live in `dist/keyframes.d.ts` (W126) | after W1-W7 land (publish/dogfood honest only on TOTAL substrate); value.js 0.13.0-sufficient |
| **L.W9** | B | Constellation cross-repo dispatch | **DEVELOPED** | each ask dispatched (the three KF-TO-* docs + their born-RED consume-edges kf-side); **workaround-deletion gates** born-RED on consume: `linear()` regex deletion (`utils.ts:193-196` — ⚠20), `FN_NAME` Symbol deletion (`utils.ts:42-57` — ⚠18), `parse-that` direct dep deletion (⚠24), `:aria-orientation` suppression deletion (⚠1/⚠3 — the COMPLETE sweep including `AnimationControls.vue:66` not just `SpringSidebar.vue:43`) | Born-RED: **F-2 peer-cycle LIVE TODAY** — glass-ui `^0.10.0||^0.11.0` rejects value.js 0.13.0 (ELSPROBLEMS; ⚠8; `completion-lanes-32-36.txt §Lane 36 HIGH-severity`); `:aria-orientation=undefined` suppresses glass-ui defect at consume seam while leaving `AnimationControls.vue:66` un-suppressed (⚠1/⚠2/⚠3); `FN_NAME` stamps owned type on external class (⚠18); `linear()` regex workarounds a published sibling bug (⚠20) | **Band B — dispatch immediately; each consume born-RED kf-side; greens on sibling publish** (glass-ui 4.1.0 · value.js O (0.14.0) · parse-that) |
| **L.W10** | B | True-CSS-parity frontier | **DEVELOPED** | **research-and-challenge spike FIRST** (no code — L.md gate-first law); then coordinated value.js+parse-that publish + kf re-pin; **NEW `proof:css-parity` capability matrix** born-RED (CSS Nesting/url-token/modern at-rules/structured gradients/env()/attr()/system-colors all silently dropped — ⚠11; `W98`/`W101-W110`; ★`audit-32-skeleton.txt §HIGH-severity`) | Born-RED: CSS Nesting (Baseline-2023) silently dropped (★ `audit-32-skeleton.txt`); url-token mis-tokenized (★); `@container/@layer/@scope` degrade to opaque genericAtRule (★); NO serializer in parse-that's CSS module (⚠26; ★); the grammar gap family has zero kf tests gating it (Lane 33 "CSS-grammar gap closure is entirely un-instrumented kf-side") | **Band B — gated on value.js O + parse-that coordinated publish; W10 research-spike PRECEDES any code** |
| **L.W11** | A | Design refinement (the instrument language) | **DEVELOPED** | **NEW `proof:crayon-preserved`** born-RED on any keeper-token recolor (the `--rainbow-*`/`--accent-red`/`--color-progress`/hoisted `--face-1…6`/`--spring-lane-*`/`--amiga-red` hues must equal 4.3.0); per-scene `proof:design-refinement` arms (easter-egg DOM present + engine-dogfooded, inv ζ); `proof:visual-lock` re-baseline (HYGIENE); `proof:taste-packet` well-formed | Born-RED: `proof:crayon-preserved` reds if a refinement mutes/removes/recolors a kept crayon (the user's explicit keeper); the per-scene arm reds if an egg hand-rolls a rAF instead of dogfooding the engine. **The TASTE boundary is USER-DOMAIN** — closes ONLY on the user's "meets the bar" on the `docs/frontend-design/` before/after packet (the K precedent) | **Band A — kf demo; REFINE-not-abrogate the four pillars (glass·paper·audacious-type·mathematics); the value.js pair is a cross-repo design note** |
| **L.WZ** | — | Close | **DEVELOPED** | `proof:all` GREEN; the deploy round-trip RE-observed (CI→deploy→live bytes); FINAL.md held to inv ε; the prompt-recap confirmed; **version cadence** decision (MAJOR `5.0.0` criteria: the round-trip-totality + barrel-dogfood + keyframes-vue-publish set; USER-DOMAIN); the deferred ledger TERMINATED; `proof:chronic-closure` re-pointed K→L; the **L.W11 TASTE verdict given** | Born-RED: `proof:chronic-closure` re-point gated non-vacuous (planted malformed L-ledger rows red on the three clause shapes, per the K.WZ precedent — FOLD citing source-shape gate; HANDOFF targeting unpublished future version; ≥4-tranche bare BOOK); the gate must RED on the three planted rows before the clean terminal ledger greens it | **CLOSES** — after Band A green; Band B edges consumed or honestly circled-back; USER-DOMAIN version cut before L.WZ |

---

## §2 — THE FINDING-CLUSTER LEDGER (evidence anchors from the 36-lane audit)

The charter's finding-cluster→wave table expanded per cluster. Severity from the audit fleet: the
five **replay-equality breaches** (the Band-A P0 band), the **gate-corpus blind-spot** (Lane 33), the
**supply-chain chronics** (Lane 36), the **constellation workarounds** (Band-B P0 band). Evidence
anchors: `audit-32-skeleton.txt §PRECEPT-VIOLATIONS` (`⚠#`), `§L-WAVE-PROPOSALS` (`W#`), `§HIGH-severity` (★),
`completion-lanes-32-36.txt §Lane #`.

### 2.1 — The replay-equality breach family → L.W1 + L.W2

| Finding | Evidence anchor | ⚠# / W# |
|---|---|---|
| `!important` silently dropped — `adapter.ts` `declsToVarMap` reads only `decl.name`/`decl.value`, drops `Declaration.important`; format.ts never emits it | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠31`; `adapter.ts` `declsToVarMap` | ⚠31 · W116 |
| `@property` registrations never re-emitted backward — `engine.ts:1225` parses + registers but `CSSKeyframesToString`/`compileToCSS` never calls `serializeStylesheetItem` | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠15`; `engine.ts:1225` | ⚠15 · W75 |
| Per-stop `animation-composition` serialization asymmetric — `format.ts:81-103` emits per-stop easing but NOT per-stop composition; survives only as a layer-level longhand | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠16`; `format.ts:81-103` | ⚠16 · W76 |
| Named keyframe selectors (`entry/exit/cover/contain`) ingested-then-THROWN — `frame-compiler.ts:179-188` accepts only `from/to/percent`, throws `AnimationOptionError` on named selectors that value.js produces | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠17`; `frame-compiler.ts:179-188` | ⚠17 · W77 · W118 |
| Compiler scroll-BLIND — `compile.ts` has zero `animation-timeline`/`animation-range` emit; W9+W10 DO NOT COMPOSE for the round-trip | `audit-32-skeleton.txt §HIGH-severity ★`; `compile.ts` (zero timeline emit) | W12 · W119 |
| Multi-color densify ships non-faithful sRGB with `eligible:true` ΔE=0.82 — while single-color drift at same magnitude HARD-REFUSES; the honest-refusal clause (⚠28/⚠29) violated | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠28/⚠29`; `compile-color.ts:188-190` | ⚠28 · ⚠29 · W113 |
| `proof:replay-equality` does NOT EXIST — NONE of the five breach inputs are exercised by any fixture; the round-trip corpus is source-shape | `completion-lanes-32-36.txt §Lane 33 KEY FINDINGS`; `test/fixtures/keyframes/manifest.json` (no multi-color, no !important, no @property, no named-selector fixture) | W89 · Lane 33 |
| `reverseMs` in `compile.ts:241` re-authors `reverseCSSTime` already imported by `format.ts` — two divergent time serializers coexist | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠30`; `compile.ts:241` vs `format.ts` import | ⚠30 · W115 |

### 2.2 — The gate-corpus blind-spot → L.W4

| Finding | Evidence anchor | ⚠# / W# |
|---|---|---|
| 259 fixed-ms `waitForTimeout()` sleeps are the macOS-pass/Linux-fail render-race root; the settle-on-state cure applied to ONE function only | `audit-32-skeleton.txt §HIGH-severity ★`; `grep waitForTimeout scripts/*.mjs = 259`; `scripts/lib/demo-driver.mjs:654-713` | W28 · Lane 33 |
| CI demo-smoke job is serial-AND fail-fast (~70 sequential gates; first RED aborts all; no report-all mode) | `audit-32-skeleton.txt §HIGH-severity ★`; `.github/workflows/ci.yml` demo-smoke job | W27 · Lane 33 |
| No Linux-container local-repro; only feedback channel for a Linux-specific flake is push + ~30min CI | `audit-32-skeleton.txt §HIGH-severity ★`; no Docker/container/act/Makefile in `.github` | W29 · Lane 33 |
| `proof:no-single-option-select` is a named MISSING CI hard-gate — product fix in place, gate-only gap | `completion-lanes-32-36.txt §Lane 33`; U4 BUILT but not hard-gated | W2 · Lane 33 |
| Device-independent threshold authority absent — the runner-calibration started but not single-sourced | `completion-lanes-32-36.txt §Lane 33` | W30 · Lane 33 |

### 2.3 — The supply-chain / publish-path gaps → L.W4 + L.W8

| Finding | Evidence anchor | ⚠# / W# |
|---|---|---|
| **F-2 peer-cycle LIVE** — glass-ui `^0.10.0||^0.11.0` does NOT admit value.js 0.13.0 (ELSPROBLEMS on every kf consumer that installs glass-ui + value.js today) | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠8`; `completion-lanes-32-36.txt §Lane 36 HIGH-severity` | ⚠8 · W36 (Lane 36) |
| `release.yml` publish job runs a thinner gate roster than `ci.yml` — omits `proof:published-surface` and `proof:deps-current` | `completion-lanes-32-36.txt §Lane 36 KEY FINDINGS`; `release.yml` vs `ci.yml` roster comparison | W36 (Lane 36) |
| keyframes-vue UNPUBLISHED — `packages/keyframes-vue/package.json` version `0.1.0` with zero publish automation and a stale peer floor (>=4.2.0 rather than >=4.3.0) | `audit-32-skeleton.txt §HIGH-severity ★`; `packages/keyframes-vue/package.json` | W15 · W56 · Lane 36 |

### 2.4 — The constellation workarounds → L.W9 (Band B)

| Finding | Evidence anchor | ⚠# / W# |
|---|---|---|
| `:aria-orientation="undefined"` on `SpringSidebar.vue:43` suppresses a glass-ui defect at the kf consume seam — AND leaves `AnimationControls.vue:66` un-suppressed (the same defect on every scene) | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠1/⚠2/⚠3`; `demo/spring/SpringSidebar.vue:43`; `demo/@/animation-controls/AnimationControls.vue:66` | ⚠1 · ⚠2 · ⚠3 · W24/W25 |
| `FN_NAME` Symbol stamps kf state onto a published value.js `ValueUnit` class it does not own (`utils.ts:42-57`) — invisible to `.clone()`, not typed, not documented | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠18`; `src/animation/utils.ts:42-57,292-299` | ⚠18 · W86 |
| `linear()` serialize/parse asymmetry kf-workaround at `utils.ts:193-196` — explicit comment "a value.js 0.12.0 serialize/parse asymmetry" | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠19/⚠20`; `src/animation/utils.ts:187-196` | ⚠19 · ⚠20 · W87 |
| `@mkbabb/parse-that` as a first-class production dependency solely for the `any` combinator over value.js parsers — the composition belongs in value.js (`utils.ts`; ⚠24) | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠24`; `src/animation/utils.ts` (parse-that import); `package.json` dep | ⚠24 · W94 |
| RF-17 / DL-K9 kf interim (`onPlayPointerDown`/`pointerHandled`) is a workaround of a glass-ui primitive defect — inv-16 and no-workaround indict it; was REVERTED+BOOKED at K.W1, still open | `audit-32-skeleton.txt §CHRONIC-FOLD ♾ DL-K9`; `K/audit/deferred-ledger-k.md §1b DL-K9` | DL-K9 · W18 · W43 |

### 2.5 — The SOTA performance frontier → L.W7

| Finding | Evidence anchor | ⚠# / W# |
|---|---|---|
| `transformMat3` allocates a new Vec3 tuple every call — hot path in all oklab/oklch conversions | `audit-32-skeleton.txt §HIGH-severity ★`; value.js `src/utils/*.ts` | W78 · VJ.L1 |
| `mixColors()` allocates a `resultComponents` array + `c1.keys()` + `filter()` on every call — paid on every `sampleColorRamp` stop | `audit-32-skeleton.txt §HIGH-severity ★`; value.js `src/utils/*.ts` | W79-W81 · VJ.L1-L4 |
| `gamutMapToRgbSpace` constructs a new `OKLCHColor` + calls `color2()` twice inside each of 24 binary-search iterations (48 Color allocations per out-of-gamut wide-gamut pixel) | `audit-32-skeleton.txt §HIGH-severity ★`; value.js | W80 · VJ.L3 |
| `loadAnimationEngine()` eagerly `Promise.all`'s all 8 heavy chunks — the static/dynamic boundary is one all-or-nothing door, not granular; `K/FINAL.md:66` recorded this as a kf-owned follow-up | `audit-32-skeleton.txt §HIGH-severity ★`; `src/animation/index.ts:334-363` | W124 · L-PERF-GBR |
| value.js `lerpArray` published (0.13.0) and un-consumed on the LIGHT `NumericAnimation`/`SpringProgress` path | `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠34`; `src/animation/numeric.ts` | W122 · L-PERF-2 |

### 2.6 — The agent-authoring surface → L.W6

| Finding | Evidence anchor | Lane |
|---|---|---|
| The agent-authoring VERB is genuinely net-new — not captured by W127 or anywhere in the existing wave map; every PART already exists (`resolveKeyframes` diagnostics, `compileToCSS` refusals, `isWAAPIEligible`); the verb is a pure read-only projection | `completion-lanes-32-36.txt §Lane 35 HIGH-severity`; `adapter.ts:25-93`; `compile.ts:74-134` | Lane 35 |
| `generate()` / generate-from-intent is KILLED — KISS/inv-16/moat-gestalt; LLM generates, kf validates+compiles | `completion-lanes-32-36.txt §Lane 35 KILL`; L.md anti-charter | Lane 35 · GEN-1 KILL |
| Boundary placement unambiguous: `validate`/`explain` are HEAVY, add NO new static value.js edge | `completion-lanes-32-36.txt §Lane 35`; the existing HEAVY/LIGHT partition | Lane 35 |

### 2.7 — The orchestration-tier DX frontier → L.W5

| Finding | Evidence anchor | Lane |
|---|---|---|
| Draggable has no bounds / snap / rubber-band — GSAP Draggable + InertiaPlugin parity hole; the entire gesture-constraint DX surface is absent | `completion-lanes-32-36.txt §Lane 32 KEY FINDINGS [med]`; `src/animation/drag.ts` | Lane 32 · W-GESTURE-BOUNDS |
| Sequence + animate have no per-segment lifecycle callbacks / label-events | `completion-lanes-32-36.txt §Lane 32 KEY FINDINGS [med]`; `src/animation/sequence.ts` | Lane 32 · W-TRANSPORT-EVENTS |

### 2.8 — CLOSE → L.WZ

| Finding | Evidence anchor |
|---|---|
| FINAL.md held to inv ε; the prompt-recap extended through the close | `audit-32-skeleton.txt §Lane prompt-ledger-A→K` (zero drops carried into L) |
| The version cadence decision (the round-trip-totality + barrel-dogfood + keyframes-vue-publish set argues a MAJOR `5.0.0`; USER-DOMAIN; L.WZ proposes the criteria) | `completion-lanes-32-36.txt §Lane 36 KEY FINDINGS [med/L-WAVE-CANDIDATE]` · L.md §WZ |
| The chronic-closure substrate transition K→L (the `proof:chronic-closure` re-point) | `scripts/proof-chronic-closure.mjs:110` (`CHRONIC_LEDGER` path constant) |

---

## §3 — THE PRECEPT RECKONING

The J/K structural spine + the K-born invariants + the three new L-born invariants + the tensions K
carried that L resolves. Full violation register: `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠1-⚠34`.

### 3.1 — The structural spine (A→K, all HELD)

| # | Precept | K status | L form |
|---|---|---|---|
| P1 | no-legacy | HELD | `proof:no-deprecated-guard` continues; the workaround-deletion gates (L.W9 Band-B consume) ADD new born-RED legs targeting the three kf-owned sibling-patches |
| P6 | inv α — boundary gated, value.js-free LIGHT | HELD | `proof:boundary` extended (W96): also catch direct `@mkbabb/parse-that` imports in light modules (the ⚠24 gap) |
| P7 | inv β — library glass-ui-free | HELD | unchanged |
| P11 | inv ζ — dogfood | HELD (rAF allowlist) | L.W8 ED-3 flips the demo onto the PUBLISHED barrel — the dogfood becomes PUBLISHED-SURFACE-level, not source-level |
| P13 | inv-16 — consume published siblings | HELD | the three kf-owned workarounds (FN_NAME, linear-regex, parse-that-dep) are each an inv-16 spirit violation; L.W9 Band-B retires them on the sibling-publish consume-edge |

### 3.2 — The K-born invariants (carried into L)

| inv | K statement | L carry |
|---|---|---|
| COLD-axis | exercised from cold/default entry | unchanged — L.W8 dogfood proof adds a cold-import arm |
| engine-write disambiguation | oracle reads engine's own write channel | unchanged — Band-A replay-equality gates are born-RED on RUNTIME fixtures, not source-shape |
| TASTE boundary | design band closes on user's verdict | unchanged — the Band-A waves are engine-internal + publish/DX; the TASTE step is L.WZ for any appearance deltas in L.W8 |
| replay-equality | round-trip = parser run backward; honest refusal on failure | **EXTENDED in L** — inv-L-totality: the TOTAL surface (not a subset); five breach classes all closed or refused with a named reason |
| acyclic-spine | value.js ships values; kf consumes one tranche behind; no `file:` | **HARDENED** — inv-L-acyclic-purity extends it: kf-owned sibling-patches are deleted on consume-edge, never re-patched |

### 3.3 — The three new L-born invariants

| inv | Statement | Owning wave(s) · gate |
|---|---|---|
| **inv-L-totality (replay-equality TOTAL)** | The round-trip is the parser run backward for the FULL parsed surface, or a named `CompileRefusal` — never a silent drop or wrong-color ship. The `format.ts` THROW idiom for un-serializable easing is the law; L extends it to `!important`, `@property`, composition, named-selectors, scroll-timeline, and multi-color. | L.W1/L.W2 · `proof:replay-equality` (born-RED today; all five breach inputs must RED before the cure greens them) |
| **inv-L-acyclic-purity (no consumer-side sibling-patch)** | A defect in a published sibling is fixed AT THE SIBLING and consumed via re-pin — NEVER corrected at the kf consume seam. Every existing workaround (⚠1-3/⚠18-20/⚠24) is a born-RED L deletion gated on the sibling publish. | L.W9 · the workaround-deletion gates (each born-RED on consume) |
| **inv-L-device-honesty (the gate-suite law)** | A CI gate asserts a device-INDEPENDENT predicate, or declares `observe-only` with a CATEGORY (wall-clock / pixel-render / physics-settle) and a recorded architectural cure. 259 fixed-ms sleeps are the violation; the `waitForRender/settle` lib is the cure. No gate passes on the fast dev box yet fails on the slow runner. | L.W4 · `waitForRender/settle` primitive + category taxonomy (born-RED: 259 `waitForTimeout` hits today) |

### 3.4 — The tensions K left open that L resolves

| # | Tension | Resolution in L |
|---|---|---|
| T1 (KISS vs gate corpus) | K.WZ.md:524 claims T1 "RESOLVED" without naming the option chosen; FINAL.md silent on T1; "collapse the lattice" language persists uncancelled (⚠9) | L.W0 dev-phase: own the corpus + KILL the "collapse the lattice" language — `proof:gate-is-runtime` meta-gate formally derives the gate set; T1 non-re-litigable thereafter (`W62`) |
| T-workaround (the Band-B sibling-patch class — ⚠1/⚠2/⚠3/⚠18/⚠19/⚠20/⚠24) | K carried all five kf-owned workarounds as named-but-un-retired items; no born-RED deletion gate existed | L.W9 Band-B: each workaround has a named tripwire (the sibling publish) and a born-RED deletion gate — the kf-side gate goes RED on consume and the workaround line is deleted in the same commit |

---

## Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the L consolidated
open-deferrals ledger.** This is the consolidated K→L deferred/chronic ledger built from
`K/PROGRESS.md §"Open deferrals"` (the authoritative K substrate) + the K.WZ Band-B HANDOFF rows
(DL-K9/DL-K7/DL-K21-FB-3/DL-K47-PT-2) + the L.W0 net-new finding rows (the replay-equality breach
family, the gate-corpus blind-spot, the supply-chain chronics, the constellation workarounds).

> **SUBSTRATE-TRANSITION NOTE (binding — NOT YET EXECUTED; K's ledger remains AUTHORITATIVE until
> L.WZ).** Through L's development phase the authoritative parse target for `proof:chronic-closure`
> REMAINS `K/PROGRESS.md §"Open deferrals"` (`scripts/proof-chronic-closure.mjs:110` `CHRONIC_LEDGER`
> points there as of the K close, terminal and GREEN). **The substrate TRANSITION to THIS L ledger is
> a L.WZ IMPLEMENTATION-PHASE motion** (the single path-constant re-point `K/PROGRESS.md →
> L/PROGRESS.md §"Open deferrals"`, executed in ONE motion alongside the L ledger becoming
> authoritative — exactly the K.WZ→J precedent). The re-point is NOT a vacuous swap: per P-SUBSTRATE
> (`K/audit/precepts-k.md §3 T6`) the grammar must BITE on the new substrate, PROVEN by
> re-running the gate against deliberately-malformed planted L-ledger rows (a FOLD citing a
> source-shape gate; a HANDOFF targeting an unpublished future version; a ≥4-tranche bare BOOK) and
> witnessing it RED on all three clause shapes before the probes are removed and the gate GREENS on
> this clean terminal L ledger.
>
> **CHRONICITY COLUMN SHAPE:** Every row's Chronicity cell leads with an explicit INTEGER
> tranche-span count, the tranche-letter provenance following in parentheses
> (e.g. `3 (I,J,K)`, `7 (C,D,E,F,G,H,I)`). The gate reads the leading integer ONLY. The ≥4-tranche
> EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer.
>
> **DISPOSITION VOCABULARY: FOLD** (into an L wave) · **HANDOFF** (sibling-owned, paired with a
> published consume-edge or born-RED kf gate) · **RE-AFFIRM** · **VERIFY-ONLY** · **BOOK** (net-new,
> terminal home named) · **RECORD** · **KILL** · **USER-DOMAIN** · **OUT** (permanently out of
> scope). A Band-B FOLD row's consume-edge is born-RED kf-side; it greens when the sibling publishes.
>
> **THE RUNTIME-BAND CITATION CONTRACT:** A FOLD row's CLOSURE-CELL grammar is exact: any
> `` `proof:*` `` it backticks is treated as a load-bearing closure ORACLE that MUST — once authored in
> the impl phase — resolve to a `package.json` key, run in the `proof:correctness` tier, AND be a
> RUNTIME gate (open a browser over the built dist via `lib/demo-driver.mjs`). A HYGIENE /
> source-shape gate is named in PLAIN PROSE and the row's terminal mechanism is the non-gate keyword
> the parser's `nonGateMechanism` clause reads.

| Item (chronic / deferral) | Born | Chronicity | Disposition | Owning wave | The gate / evidence (the closure oracle) |
|---|---|---|---|---|---|
| **DL-L1 The replay-equality breach family** (!important / @property / per-stop composition / named selectors / scroll-BLIND compiler) — all five silently pass today; `proof:replay-equality` absent | L (born at the 36-lane audit) | 1 (L) | **FOLD → L.W1 + L.W2** | **L.W1** (breach cases 1-4) · **L.W2** (scroll-BLIND + multi-color + time-serialize) | `proof:replay-equality` authored born-RED on all five breach inputs (the gate must RED on today's tree) → GREEN on the L.W1+L.W2 cure; born-RED witness: `adapter.ts` `declsToVarMap` drops `Declaration.important`; `engine.ts:1225` never calls `serializeStylesheetItem`; `format.ts:81-103` omits per-stop composition; `frame-compiler.ts:179-188` throws on `entry/exit/cover/contain`; `compile.ts` zero timeline emit (`audit-32-skeleton.txt §HIGH-severity ⚠31/⚠15/⚠16/⚠17/W12`) |
| **DL-L2 The gate-corpus blind-spot** (259 fixed-ms sleeps; serial-AND fail-fast CI; no Linux-container local-repro; source-shape round-trip gates) — the L-era architectural root of the macOS-pass/Linux-fail class | K (CI-greenify session; `completion-lanes-32-36.txt §Lane 33`) | 1 (K→L, born at the CI-greenify session) | **FOLD → L.W4** | **L.W4** | `waitForRender/settle` lib primitive replaces the 259 `waitForTimeout` sleeps; report-all posture for demo-smoke; Linux-container local-repro; single-source device thresholds; born-RED witness: `grep waitForTimeout scripts/*.mjs = 259` (★ `audit-32-skeleton.txt §HIGH-severity`); CI demo-smoke serial-AND fail-fast (`.github/workflows/ci.yml`) |
| **DL-L3 The supply-chain F-2 peer-cycle** (glass-ui `^0.10.0||^0.11.0` rejects value.js 0.13.0; ELSPROBLEMS live today; no gate catches it) | K (the K.W1 consume-edge; ⚠8) | 2 (K (born), L (live)) | **FOLD → L.W4** (NEW `proof:peer-satisfied`) + **HANDOFF (Band B: glass-ui BB fix + re-pin)** | **L.W4** (gate) · **L.W9** (Band B cure) | `proof:peer-satisfied` born-RED today (ELSPROBLEMS on `npm install` with glass-ui + value.js 0.13.0; `completion-lanes-32-36.txt §Lane 36 ⚠8`); greens when glass-ui BB ships the widened peer range + kf re-pins |
| **DL-L4 The ED-3 dogfood inversion** (63 demo files import `@src/animation/*`; zero `@mkbabb/keyframes` barrel imports; the dogfood loop cannot close) | K.W12 (STAGED not landed) | 2 (K staged, L open) | **FOLD → L.W8** | **L.W8** | `proof:demo-on-published-surface` born-RED on today's tree (`grep @mkbabb/keyframes demo/ → 0 hits` ★); GREEN when all 63 files use the published barrel |
| **DL-L5 keyframes-vue 0.1.0 unpublished** (the K.W12 ED-2 discharge; zero publish automation; stale peer floor) | K.W12 (STAGED) | 2 (K staged, L open) | **FOLD → L.W8** | **L.W8** | keyframes-vue `proof:published-surface` gate born-RED (package exists locally, NOT on npm today ★); greens on the first npm publish under the same release discipline as kf |
| **DL-L6 RF-17 / DL-K9 GlassDock click-strand** (the kf interim `onPlayPointerDown`/`pointerHandled` — REVERTED+BOOKED at K.W1; glass-ui 4.0.0 consumed one-behind) ★ | I (BLK-8 recurred J.WZ) | 3 (I,J,K → L) | **HANDOFF (Band B: glass-ui 4.1.0 RF-17 net-deletion)** | **L.W9** (Band B consume) | Born-RED kf-side gate: the workaround deletion gate fires RED on the current tree; greens when glass-ui 4.1.0 ships the `W-DOCK-MORPH-FAMILY`/`RF-17` fix + kf re-pins and the interim is DELETED in the same commit (`audit-32-skeleton.txt §CHRONIC-FOLD ♾ DL-K9`; `K/audit/deferred-ledger-k.md DL-K9`) |
| **DL-L7 GlassControlPoint / DL-K7** (the curve-editor / keyframes-editor enabler; 5-tranche HANDOFF exited K) ★‡ | E (5-tranche: E,F,G,H,I,K as ABSTRACT) | 6 (E,F,G,H,I,J,K → L) | **HANDOFF (Band B: glass-ui BB GlassControlPoint)** | **L.W9** (Band B dispatch) | Gate-first BOOK: `proof:control-point-live` authored BEFORE any impl; then glass-ui 4.x ships GlassControlPoint; kf consumes. The gate goes born-RED (the primitive absent); greens on the glass-ui publish + kf re-pin (`K/audit/deferred-ledger-k.md DL-K7`; `audit-32-skeleton.txt W34/W45`) |
| **DL-L8 FB-3 MorphSVG remainder** (the real competitor-feature gap; gated on value.js VJ.W4 `getPointAtLength`/`fromMorphSVG`) ★ | C (5-tranche: C,F,G,H,I,K as HANDOFF) | 6 (C,F,G,H,I,J,K → L) | **HANDOFF (Band B: value.js O VJ.W4 arc-length sampler)** | **L.W9** (Band B dispatch) | The born-RED consume-edge gate fires RED on today's tree (the VJ.W4 arc-length sampler publish is the tripwire; `fromMorphSVG`/`getPointAtLength` absent in 0.13.0); greens on the value.js O (0.14.0) publish + kf re-pin (`K/audit/deferred-ledger-k.md DL-K21 FB-3`; `audit-32-skeleton.txt W44/W51`) |
| **DL-L9 PT-2 parse-that packrat soundness** (id,offset re-key; PT-WAVE-2 completion; 4-tranche gate-first BOOK) ★‡ | E (4-tranche: E,F,G,H,I,K as BOOK) | 5 (E,F,G,H,I,K → L) | **HANDOFF (Band B: parse-that PT-WAVE-6 soundness publish)** | **L.W9** (Band B dispatch) | Gate-first BOOK: `proof:packrat-sound` authored BEFORE any impl (the born-RED gate fires on today's tree, which uses `packrat.ts` self-documented-UNSOUND id-only key — ⚠27); greens on parse-that PT-WAVE-6 publish + kf re-pin consuming the (id,offset) keyed cache (`K/audit/deferred-ledger-k.md` PT-2; `audit-32-skeleton.txt W93/W47`) |
| **DL-L10 The kf-owned constellation workarounds** (FN_NAME Symbol stamp ⚠18; `linear()` regex ⚠20; direct `parse-that` dep ⚠24; `:aria-orientation` suppression ⚠1-3) — each a no-workaround / inv-L-acyclic-purity violation | K (all carried as named-but-un-retired items through the K close) | 1 (K→L, born as named violations) | **FOLD → L.W9 Band B** (each retiring on its sibling publish consume-edge) | **L.W9** | Each workaround has a named tripwire and a born-RED deletion gate: (1) FN_NAME: born-RED = `utils.ts:42-57` stamps `FN_NAME` on `ValueUnit`; greens when value.js VJ-L1 ships `FlatLeaf`/typed first-class API + kf re-pins. (2) `linear()` regex: born-RED = `utils.ts:193-196` regex normalize; greens when value.js VJ-L2 ships `linearStopsToCSS` + kf re-pins. (3) `parse-that` dep: born-RED = `package.json` dep on `@mkbabb/parse-that`; greens when value.js VJ-L3 ships `parseCSSSubValue` + kf re-pins and the import is deleted. (4) `:aria-orientation`: born-RED = BOTH `SpringSidebar.vue:43` AND `AnimationControls.vue:66` (the COMPLETE fleet sweep); greens when glass-ui BB ships the SegmentedTabs pill-variant fix + kf re-pins (`audit-32-skeleton.txt ⚠1-3/⚠18-20/⚠24`) |
| **DL-L11 The true-CSS-parity frontier** (CSS Nesting/url-token/modern at-rules silently dropped; two-grammar debt; no serializer in parse-that CSS module) — the coordinated grammar gap | K (detected at the K-close audit; `audit-32-skeleton.txt §HIGH-severity ★`) | 1 (K→L) | **FOLD → L.W10 Band B** (research spike + coordinated value.js O + parse-that publish) | **L.W10** | Research-and-challenge spike FIRST (no code); then `proof:css-parity` capability matrix born-RED on today's tree (CSS Nesting/url-token/modern at-rules all silently drop or corrupt — ★`audit-32-skeleton.txt`); greens on the coordinated value.js O + parse-that publish + kf re-pin that closes the named parity gaps (`audit-32-skeleton.txt W97/W98/W100/⚠25/⚠26`) |
| **DL-L12 The DL-K11 mobile Lighthouse floors — L carry** (measured-quiet in K; scores declared with headroom; no regression expected but L waves must not breach them) | B-era floors, K measured-quiet | 1 (L carry; K EXITED by measurement) | **VERIFY-ONLY** (measured-quiet on K dist; re-verify on L dist) | L.WZ (re-verify on the L close dist) | Re-run `proof:lighthouse-mobile` with `KF_REQUIRE_LH=1` on the L dist; the K scores (home 68/cube 66/amiga 52/square 65/easing 63/spring 55) are the floor; any regression RED. Non-gate mechanism: a measured quiet-host artifact (runner-calibrated; never CI-hard-gated per inv-L-device-honesty) |
| **DL-L13 T1 formal resolution** ("collapse the lattice" language persists; K.WZ.md:524 claims T1 RESOLVED without naming the chosen option — ⚠9) | K.WZ (the K FINAL overclaim) | 1 (K→L) | **FOLD → L.W0** (dev-phase; documentation + language deletion) | **L.W0** | Non-gate mechanism: the "collapse the lattice" language is DELETED from precepts-k.md in L.W0; `proof:gate-is-runtime` is formally the T1 resolution (the gate set is DERIVED, not declared by a WAVE_HARD_GATES list); T1 marked non-re-litigable (`audit-32-skeleton.txt W62`; `⚠9`) |

---

## Band-B gated consume-edges — the open deferrals carried as named tripwires

The four K-terminal HANDOFF rows + the three new L.W9 cross-repo dispatches, each with its named
tripwire (the condition that lights the born-RED gate to GREEN). None are re-BOOKed
(P-invariant-28 — the named tripwire IS the exit mechanism; a HANDOFF with a named sibling
publish-and-consume-edge is exit-shaped, not a deferral).

| Item | Born | Chronicity | Tripwire (the sibling publish that lights the consume-edge) | Born-RED kf gate | Note |
|---|---|---|---|---|---|
| **RF-17 / DL-K9** (GlassDock click-strand interim) | I | 3 (I,J,K→L) | glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY` + the RF-17 dock-layer collapse-crossfade strand fix | `proof:rf17-net-deletion` — the kf interim (`onPlayPointerDown`/`pointerHandled`) is deleted in the same commit as the re-pin; the gate RED until the deletion is complete | no interim carries to a 4th tranche under no-workaround |
| **GlassControlPoint / DL-K7** (curve-editor / keyframes-editor enabler) | E | 6 (E,F,G,H,I,J,K→L) | glass-ui BB future minor/major ships `GlassControlPoint` primitive | `proof:control-point-live` authored gate-first BEFORE impl; gate RED until the primitive ships + kf consumes it | gate-first BOOK is exit-shaped for a 6-tranche chronic (exits the P-inv-28 belt on the first impl, not a 7th BOOK) |
| **MorphSVG / FB-3** (`fromMorphSVG` / `getPointAtLength`) | C | 6 (C,F,G,H,I,J,K→L) | value.js O (0.14.0) ships VJ.W4 remainder (`getPointAtLength` / `fromMorphSVG` arc-length sampler) | `proof:morphsvg-consume` born-RED (the VJ.W4 APIs absent in 0.13.0); gate RED until the APIs publish + kf ships `fromMorphSVG` over them | the arc-length PARTIAL (VJ.W4) is in 0.13.0; the full sampler (the tripwire half) is the VJ.W4 remainder |
| **parse-that packrat / PT-2** (Warth-Douglass-Millstein (id,offset) soundness) | E | 5 (E,F,G,H,I,K→L) | parse-that PT-WAVE-6 ships the (id,offset) re-keyed packrat (soundness restore) | `proof:packrat-sound` authored gate-first; gate RED on today's UNSOUND id-only cache (`packrat.ts` self-documents unsoundness — ⚠27); greens on the PT-WAVE-6 publish + kf re-pin | value.js consumes parse-that; kf's gate is on the kf re-pin consuming the value.js that consumes the fixed parse-that |

---

## Gate-first discipline note

Every Band-A wave in this board **authors its born-RED gate before any source cure**. The five
replay-equality breach gates (`proof:replay-equality` with all five input classes), the multi-color
compile fixture (`proof:compile-replay` extended), the ingest arms (`proof:ingest-replay` extended),
the device-honesty primitive (`waitForRender/settle` replacing 259 sleeps), the drag-gesture/transport-
event gates, the agent-validate gate, and the dogfood/publish surface gates are all born-RED on
today's tree. The Band-B gates (workaround-deletion gates, GlassControlPoint, MorphSVG, packrat) are
born-RED kf-side and wait for the sibling publish to green. **No wave starts impl without a born-RED
gate on disk that REDs on the unfixed tree.** This is the non-negotiable load-bearing law of
Tranche L (`L.md §wave map`; `completion-lanes-32-36.txt §Lane 33` — the gate blind-spot is
both the cause of K's CI-greenify session AND the structural motivation for every born-RED gate in
this board).
