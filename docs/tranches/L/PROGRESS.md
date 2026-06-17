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

> **SUBSTRATE-TRANSITION NOTE (binding — the L ledger is now TERMINAL and READY; K's ledger
> remains the AUTHORITATIVE parse target until the orchestrator's atomic re-point motion).** Through
> L's development phase the authoritative parse target for `proof:chronic-closure` REMAINED
> `K/PROGRESS.md §"Open deferrals"` (`scripts/proof-chronic-closure.mjs:110` `CHRONIC_LEDGER`
> points there as of the K close, terminal and GREEN — verified still pointing at K on this tree).
> **At L.WZ close the 13 DL-L cluster rows below have ALL reached terminal disposition** (FOLD-landed
> / HANDOFF-tripwired / VERIFY-ONLY) — the ledger is READY for the substrate transition. **The
> transition itself — the single path-constant re-point `K/PROGRESS.md → L/PROGRESS.md §"Open
> deferrals"` at `scripts/proof-chronic-closure.mjs:110` — is the ORCHESTRATOR'S ATOMIC FINAL MOTION,
> NOT executed by this ledger-termination workflow** (the re-point + the non-vacuity planted-probe
> proof + the gate GREEN-on-clean-ledger are ONE commit the orchestrator fires; exactly the K.WZ→J
> precedent). The re-point is NOT a vacuous swap: per P-SUBSTRATE (`K/audit/precepts-k.md §3 T6`) the
> grammar must BITE on the new substrate, PROVEN by re-running the gate against deliberately-malformed
> planted L-ledger rows (a FOLD citing a source-shape gate; a HANDOFF targeting an unpublished future
> version; a ≥4-tranche bare BOOK) and witnessing it RED on all three clause shapes before the probes
> are removed and the gate GREENS on this clean terminal L ledger.
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
| **DL-L1 The replay-equality breach family** (!important / @property / per-stop composition / named selectors / scroll-BLIND compiler) — all five silently passed at the audit; the replay-equality lock absent | L (born at the 36-lane audit) | 1 (L) | **FOLD LANDED → L.W1 + L.W2** | **L.W1** (8e386a7) · **L.W2** (4863446) | **TERMINAL — FOLD LANDED.** Non-gate terminal mechanism (a node+vitest data-model lock, off-DOM — a parse/serialize round-trip has no browser to drive): the replay-equality node probe + its vitest fixture corpus (proof:replay-equality, run via `node` + `vitest run test/replay-equality.test.ts`) GREEN on this tree, born-RED→GREEN on the five breach inputs — @property backward-serialize wired, per-stop animation-composition emitted, named-selector ingest accepted, the composite/iteration-composite/play-state OPERATOR floor closed. The compile-replay node probe + vitest corpus (proof:compile-replay, `node` + `vitest run test/compile-roundtrip.test.ts`) GREEN (4863446 — multi-color per-key densify-or-refuse + scroll-driven `animation-timeline`/`animation-range` emit + static-weight + `reverseMs`→`reverseCSSTime` unify). These are data-model round-trip locks (the parser run BACKWARD), correctly off-DOM — named in prose, NOT cited as runtime closure oracles per the citation contract. **S1 NUANCE (spec-faithful correction):** the `opacity:0 !important` keyframe input is SPEC-FAITHFULLY DROPPED (CSS Animations §3 — `!important` is invalid/ignored inside a keyframe; value.js drops it, kf mirrors, the test locks `not.toContain("!important")`); the no-silent-drop *diagnostic* is dispatched to value.js-O (`KF-TO-VALUEJS-O-ASKS.md #12`), consumed Band-B (DLL-26/DL-L11). The verify-lane workaround was REVERTED. (`audit-32-skeleton.txt §HIGH-severity ⚠31/⚠15/⚠16/⚠17/W12`) |
| **DL-L2 The gate-corpus blind-spot** (259 fixed-ms sleeps; serial-AND fail-fast CI; no Linux-container local-repro; source-shape round-trip gates) — the L-era architectural root of the macOS-pass/Linux-fail class | K (CI-greenify session; `completion-lanes-32-36.txt §Lane 33`) | 1 (K→L, born at the CI-greenify session) | **FOLD LANDED → L.W4** | **L.W4** (f94fa7a) | **TERMINAL — FOLD LANDED.** Non-gate terminal mechanism (node-probe source-shape locks, off-DOM — these police the gate corpus' SHAPE, not a browser interaction): the `waitForRender`/settle predicate primitive replaces the fixed-ms render-wait sleeps; the settle-is-predicate node probe (proof:settle-is-predicate) GREEN (verified — `openControlsPanel` settles on state predicates, zero `waitForTimeout`, the `waitForRender(page, predicate, {timeout})` primitive exported from `demo-driver.mjs`). report-all posture for demo-smoke landed; Makefile `ci-linux` local-repro added; the CATEGORY taxonomy + single-source device thresholds in `ci-env.mjs`; the no-single-option-select node probe (proof:no-single-option-select) GREEN (verified — the missing W2 hard-gate authored). Both are source-shape hygiene locks — named in prose, NOT cited as runtime closure oracles. (★ `audit-32-skeleton.txt §HIGH-severity`; W27/W28/W29/W30) |
| **DL-L3 The supply-chain F-2 peer-cycle** (glass-ui peer range rejects value.js 0.13.0; ELSPROBLEMS live; no gate caught it) | K (the K.W1 consume-edge; ⚠8) | 2 (K (born), L (live)) | **FOLD LANDED (gate) + HANDOFF (Band B: glass-ui BB widen + re-pin)** | **L.W4** (gate, f94fa7a) · **L.W9** (Band B cure, 791b3bd) | **TERMINAL — gate FOLD-LANDED + the cure HANDOFF-tripwired.** Non-gate terminal mechanism (a node-probe detector over the installed dep tree, off-DOM — a peer-range satisfaction check has no browser interaction): the peer-satisfied node probe (proof:peer-satisfied) landed and is RED-BY-DESIGN (verified on this tree — glass-ui@4.0.0 declares a value.js peer range capped at the 0.10/0.11 majors but installed is 0.13.0; the F-2 cycle is LIVE). It is a supply-chain hygiene lock named in prose, NOT a runtime closure oracle. **TRIPWIRE (Band-B published-consume-edge):** glass-ui BB ships the widened value.js peer range AND kf re-pins → the peer-satisfied node probe GREENs on the published consume-edge. glass-ui registry-probed at the published **4.0.0** (the widened BB release not yet on the registry), so this stays HANDOFF, consumed the instant the widened range publishes — the kf-side RED is the proof the cross-repo ask is a live defect (P-invariant-28: exit-shaped published-consume-edge, not a punt). `completion-lanes-32-36.txt §Lane 36 ⚠8` |
| **DL-L4 The ED-3 dogfood inversion** (63 demo files imported `@src/animation/*`; zero `@mkbabb/keyframes` barrel imports; the dogfood loop could not close) | K.W12 (STAGED not landed) | 2 (K staged, L open) | **FOLD LANDED → L.W8** | **L.W8** (339d78b) | **TERMINAL — FOLD LANDED.** Non-gate terminal mechanism (a node-probe import-graph boundary lock, off-DOM — a package-boundary import census has no browser to drive): the demo-on-published-surface node probe (proof:demo-on-published-surface) GREEN (verified on this tree with `KFVUE_INVERSION_LANDED=1`: the demo consumes the published barrel ONLY — zero `@src/animation/*` deep imports; the boundary lock at the PACKAGE boundary bites). It is a source-shape boundary lock named in prose, NOT a runtime closure oracle. The inversion is COMPLETE. (★ `audit-32-skeleton.txt §HIGH-severity`; W14/W125) |
| **DL-L5 keyframes-vue 0.1.0 unpublished** (the K.W12 ED-2 discharge; zero publish automation; stale peer floor) | K.W12 (STAGED) | 2 (K staged, L open) | **FOLD LANDED (prep) → L.W8; the npm publish is USER-DOMAIN** | **L.W8** (339d78b) | **TERMINAL — FOLD LANDED (prep) + publish USER-DOMAIN.** Non-gate terminal mechanism (a node-probe publish-surface lock, off-DOM — a built-artifact + peer-floor census has no browser interaction): the adapter is PREPPED and the publish discipline wired — the keyframes-vue-published node probe (proof:keyframes-vue-published) clauses (a) built artifact present and (c) peer floor `>=4.3.0` are GREEN (verified on this tree); the peer floor was lifted off the stale value. It is a publish-surface hygiene lock named in prose, NOT a runtime closure oracle. **Clause (b) is RED-BY-DESIGN — the actual `npm publish @mkbabb/keyframes-vue` is USER-DOMAIN** (Mike Babb; registry-probed E404, package ABSENT). The probe rides the report-all demo-smoke job (continue-on-error), never the blocking hygiene chain. (★; W15/W56) |
| **DL-L6 RF-17 / DL-K9 GlassDock click-strand** (the kf interim `onPlayPointerDown`/`pointerHandled` — REVERTED+BOOKED at K.W1; glass-ui 4.0.0 consumed one-behind) ★ | I (BLK-8 recurred J.WZ) | 3 (I,J,K → L) | **HANDOFF (Band B: glass-ui 4.1.0 RF-17 net-deletion; published-consume-edge)** | **L.W9** (Band B consume, 791b3bd) | **TERMINAL — HANDOFF, published-consume-edge form, tripwire UN-FIRED.** Born-RED kf-side: the `proof:workaround-deletion` S2 arm is PENDING (verified on this tree — `pointerHandled`/`onPlayPointerDown` PRESENT, paired glass-ui fix not yet on the registry). The consume-edge is against the currently-published glass-ui **4.0.0** (consumed one-behind); the kf-side born-RED gate proves the gap is live. **TRIPWIRE:** glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY`/`RF-17` → S2 GREEN (the `pointerHandled` and `onPlayPointerDown` interim strands sweep to zero in `demo/`); the interim DELETED in the same commit as the re-pin. With glass-ui published at **4.0.0**, this stays HANDOFF, consumed the instant 4.1.0 publishes (P-invariant-28: a named sibling tripwire + a published-consume-edge + a born-RED kf gate IS exit-shaped; no interim carries to a 4th tranche under no-workaround). (`audit-32-skeleton.txt §CHRONIC-FOLD ♾ DL-K9`; `K/audit/deferred-ledger-k.md DL-K9`) |
| **DL-L7 GlassControlPoint / DL-K7** (the curve-editor / keyframes-editor enabler; 6-tranche HANDOFF) ★‡ | E (E,F,G,H,I,K as ABSTRACT) | 6 (E,F,G,H,I,J,K → L) | **HANDOFF (Band B: glass-ui BB GlassControlPoint; published-consume-edge)** | **L.W9** (Band B dispatch, 791b3bd) | **TERMINAL — HANDOFF (gate-first, published-consume-edge form, exit-shaped), tripwire UN-FIRED.** `proof:control-point-live` authored gate-first and RED-BY-DESIGN (verified on this tree — `GlassControlPoint` absent from the published `node_modules/@mkbabb/glass-ui/dist/` surface; a report-all tripwire, not a blocking hygiene arm). The consume-edge is against the currently-published glass-ui **4.0.0**; the born-RED kf gate proves the primitive is absent today. **TRIPWIRE:** glass-ui BB future minor ships `GlassControlPoint` → the gate GREENs on the publish + kf re-pin (the published-consume-edge lights). With glass-ui published at 4.0.0 (primitive absent), this stays HANDOFF, consumed when the primitive publishes. **P-invariant-28 (6-tranche ≥4):** the gate-first BOOK exits the belt on the FIRST consume — the re-BOOK option is CLOSED; if absent at the next close it exits as EXITED (shipped) or a named build-in-kf KILL with a concrete spec. (`K/audit/deferred-ledger-k.md DL-K7`; `audit-32-skeleton.txt W34/W45`) |
| **DL-L8 FB-3 MorphSVG remainder** (the real competitor-feature gap; gated on value.js VJ.W4 `getPointAtLength`/`fromMorphSVG`) ★ | C (C,F,G,H,I,K as HANDOFF) | 6 (C,F,G,H,I,J,K → L) | **HANDOFF (Band B: value.js O VJ.W4 arc-length sampler)** | **L.W9** (Band B dispatch, 791b3bd) | **TERMINAL — HANDOFF, tripwire UN-FIRED (sibling UNPUBLISHED).** Born-RED kf-side consume-edge: `fromMorphSVG`/`getPointAtLength` absent in value.js 0.13.0 (the full arc-length sampler is the VJ.W4 remainder). **TRIPWIRE:** value.js O (0.14.0) ships the VJ.W4 remainder → kf ships `fromMorphSVG` over it. value.js registry-probed at **0.13.0** (O/0.14.0 unpublished) → stays HANDOFF (P-invariant-28: 6-tranche ≥4, sibling-owned + published-consume-edge IS exit-shaped). (`K/audit/deferred-ledger-k.md DL-K21 FB-3`; `audit-32-skeleton.txt W44/W51`) |
| **DL-L9 PT-2 parse-that packrat soundness** (id,offset re-key; PT-WAVE soundness; 5-tranche gate-first BOOK) ★‡ | E (E,F,G,H,I,K as BOOK) | 5 (E,F,G,H,I,K → L) | **HANDOFF (Band B: parse-that PT-WAVE-6 soundness publish; published-consume-edge)** | **L.W9** (Band B dispatch, 791b3bd) | **TERMINAL — HANDOFF (gate-first, published-consume-edge form, exit-shaped), tripwire UN-FIRED.** Gate-first BOOK: author `proof:packrat-sound` first when the re-keyed packrat publishes; today's `packrat.ts` self-documents the UNSOUND id-only key (⚠27). The consume-edge is against the currently-published parse-that **0.9.0**. **TRIPWIRE:** parse-that PT-WAVE-6 ships the `(id,offset)` re-keyed packrat → value.js consumes it → kf re-pins (the published-consume-edge lights). With parse-that published at 0.9.0 (PT-WAVE-6 not yet on the registry), this stays HANDOFF, consumed on the publish (P-invariant-28: 5-tranche ≥4, gate-first BOOK with a published-consume-edge exits the belt on the first consume). (`K/audit/deferred-ledger-k.md` PT-2; `audit-32-skeleton.txt W93/W47`) |
| **DL-L10 The kf-owned constellation workarounds** (FN_NAME Symbol stamp ⚠18; `linear()` regex ⚠20; direct `parse-that` dep ⚠24; `:aria-orientation` suppression ⚠1-3) — each a no-workaround / inv-L-acyclic-purity violation | K (all carried as named-but-un-retired items through the K close) | 1 (K→L, born as named violations) | **HANDOFF (Band B: each retires on its sibling publish consume-edge; published-consume-edge form)** | **L.W9** (791b3bd) | **TERMINAL — HANDOFF, published-consume-edge form, all arms PENDING.** The deletion gate landed born-RED + three-state: `proof:workaround-deletion` reports **0 GREEN / 5 PENDING / 0 RED** (verified on this tree — every workaround PRESENT with its paired sibling-fix not yet on the registry; deleting now would break the consumer). Each consume-edge is against the currently-published sibling. **TRIPWIRES (each a published-consume-edge):** (1) FN_NAME → value.js VJ-L1 `FlatLeaf`/typed API (S8); (2) `linear()` regex → value.js VJ-L2 `linearStopsToCSS` (S7); (3) `parse-that` dep → value.js VJ-L3 `parseCSSSubValue` (S9, `proof:boundary` W96 extension also catches direct parse-that imports); (4) `:aria-orientation` (BOTH `SpringSidebar.vue:43` AND `AnimationControls.vue:66` — complete sweep) → glass-ui BB SegmentedTabs pill-variant fix (S1). value.js published at **0.13.0** (the VJ-L set ships in the next value.js cut) + glass-ui published at **4.0.0** → all five stay HANDOFF, each consumed the instant its sibling fix publishes (P-invariant-28: each arm a named publish-and-consume tripwire, born-RED kf-side; no arm carries to a second L tranche). (`audit-32-skeleton.txt ⚠1-3/⚠18-20/⚠24`) |
| **DL-L11 The true-CSS-parity frontier** (CSS Nesting/url-token/modern at-rules silently dropped; two-grammar debt; no serializer in parse-that CSS module) — the coordinated grammar gap | K (detected at the K-close audit; `audit-32-skeleton.txt §HIGH-severity ★`) | 1 (K→L) | **HANDOFF (Band B: research-spike LANDED; W10-IMPL gated on coordinated value.js-O + parse-that publish; published-consume-edge)** | **L.W10** (spike 8c134d9) | **TERMINAL — HANDOFF, published-consume-edge form, tripwire UN-FIRED.** The research-and-challenge SPIKE is LANDED (no code, per the gate-first law): `docs/tranches/L/audit/W10-css-parity-spike.md` records the architectural verdict (Option B — delete parse-that's structural cssParser grammar, value.js owns the one grammar) + the W100 incremental-parse measure-first BOOK. Gate-first BOOK: author `proof:css-parity` first when the coordinated grammar publishes; its RED-today is the HONEST state (CSS Nesting/url-token/modern at-rules silently drop or corrupt on today's siblings). The consume-edge is against the currently-published value.js **0.13.0** / parse-that **0.9.0**. **TRIPWIRE:** the coordinated next value.js cut + parse-that publish + kf re-pin closes the named parity gaps (the published-consume-edge lights). With the coordinated grammar not yet on the registry, this stays HANDOFF; the W10 IMPL does not open until the siblings publish. (`audit-32-skeleton.txt W97/W98/W100/⚠25/⚠26`) |
| **DL-L12 The DL-K11 mobile Lighthouse floors — L carry** (measured-quiet in K; scores declared with headroom; no regression expected but L waves must not breach them) | B-era floors, K measured-quiet | 1 (L carry; K EXITED by measurement) | **VERIFY-ONLY** (measured-quiet on K dist; re-verify on L dist at the close-merge) | L.WZ (re-verify on the L close dist) | **TERMINAL — VERIFY-ONLY.** Non-gate terminal mechanism: a measured quiet-host artifact (runner-calibrated; a load-rest Lighthouse score, never CI-hard-gated per inv-L-device-honesty — named in prose, NOT a runtime closure oracle). The lighthouse-mobile runner (proof:lighthouse-mobile) is re-run with `KF_REQUIRE_LH=1` on the L close dist; the K floors (home 68/cube 66/amiga 52/square 65/easing 63/spring 55) are the hard floor; any regression RED. The re-verification rides the L.WZ close-merge dist (deploy round-trip + version cut are USER-DOMAIN/sibling-gated). |
| **DL-L13 T1 formal resolution** ("collapse the lattice" language persisted; K.WZ.md:524 claimed T1 RESOLVED without naming the chosen option — ⚠9) | K.WZ (the K FINAL overclaim) | 1 (K→L) | **FOLD LANDED → L.W0** (dev-phase; the derivation gate wired) | **L.W0** | **TERMINAL — FOLD LANDED (gate-mechanism).** Non-gate terminal mechanism: the FORMAL DERIVATION RULE, a hygiene-tier node lock wired into the corpus (NOT a runtime closure oracle — named in prose). The gate-is-runtime meta-lock (proof:gate-is-runtime) is AUTHORED + WIRED into `proof:hygiene` (verified on this tree — `package.json:106` script key + membership in the `proof:hygiene` roster `package.json:190`) as the formal T1 resolution — the gate set is DERIVED from `proof:correctness` membership, NOT declared by a hand-edited `WAVE_HARD_GATES` list. This picks K-decision option (b): formally OWN the corpus as deliberate. **HONESTY CORRECTION (inv ε — the ⚠9 lesson, applied to this row itself):** the "collapse the lattice" language is NOT deleted — a grep for "collapse the lattice" over `docs/tranches/K/audit/precepts-k.md` returns **2 hits** (lines 246, 253, both inside `precepts-k.md §3 T1` — the K precepts itself, quoting the I-position and naming the KILL directive). A prior draft of this row asserted "ABSENT (grep → zero)"; that claim does NOT reproduce and is corrected here. The T1 terminal does NOT rest on a language-deletion that did not happen — it rests on the WIRED derivation rule (option (b) ownership), which the grep above proves present. The gate-is-runtime meta-lock currently REDs locally at the close tip (exit 1 — the transport-events jsdom-vs-browser-over-dist roster collision, proof:transport-events; verified) — this is on the orchestrator's close-impl roster-reconciliation list (prompt-recap-L §10/§roster), NOT this DOCS-ONLY termination's to cure. T1 non-re-litigable: the derivation rule is in place. (`audit-32-skeleton.txt W62`; `⚠9`) |
| **CH-1/B7 specular sheen** (the cartoon specular at rest) — K→L carry ★ | D(D14)→H | 4 (D,H,I,K → L) | **RE-AFFIRM** (do not re-litigate; re-verified on the L tree) | L.WZ (re-verify) | `proof:specular-absent-at-rest` GREEN (verified on this tree — correctness-tier RUNTIME gate: opens the built dist + reads the rendered specular at rest across the scenes); glass-ui flat default consumed. **Born-RED** in its origin tranche (the cartoon specular rendered at rest; the gate BIT on that defect tree before the flat-default consume cured it); `proof:specular-handoff` DELETED, the self-guard asserts its absence. Carried from `K/PROGRESS.md §"Open deferrals"` (K: RE-AFFIRM, re-verified across the 3.13.0 dock rewrite); re-verified resolved on the L close tree. |
| **CH-2 φ-hero typography** (re-falsified at the dock voice) — K→L carry ★ | D(D7)→I(TYP-2) | 5 (D,I,J,K → L) | **VERIFY-ONLY** (TERMINATED — re-run on the L dist) | L.WZ (re-run) | `proof:font-census` GREEN (verified on this tree — correctness-tier RUNTIME gate: opens the dist + navToScene-drives a computed-font CENSUS across all scenes). **Born-RED** in K (RE-AFFIRMED at J yet the K live audit re-falsified the dock voice; `proof:demo-fonts` greened while the dock resolved system-sans; font-census BIT on two display tokens). ONE voice-token authority; dock-label binds the display serif; GREEN on the K.W2 root fix (`9e55b4d`). Carried from `K/PROGRESS.md §"Open deferrals"` (K: EXITED K.W2); re-run + re-verified resolved on the L dist. |
| **CH-3 mobile chronic** (desktop-certified; spring slider STEPS; /square broken) — K→L carry ★ | D(D10) | 6 (D,H,I,J,K → L) | **VERIFY-ONLY** (TERMINATED — re-run on the L dist) | L.WZ (re-run) | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (verified on this tree — both correctness-tier RUNTIME gates: drive the live spring slider + the mobile-emulated subject motion over the dist). **Born-RED** in K: thumb `changeCount:0` over 240 frames + "spring slider literally steps" (U-K15) + "none work on /square" (U-K5) — the gates BIT on that tree; GREEN on the K.W4 cure (`358def4`, the 60 Hz painter owns the position; /square cured by the pane-verdict pass). Carried from `K/PROGRESS.md §"Open deferrals"` (K: EXITED K.W4); re-run + re-verified resolved on the L dist. |
| **CH-4 dock** (D5 lag + D9 popover; the felt dock) — K→L carry ★ | D(D5/D9) | 4 (D,H,I,K → L) | **RE-AFFIRM** (D5/D9 lag+popover) + EXITED-reaffirmed (dock anchoring) | L.WZ (re-verify) | `proof:perf-frame-budget` GREEN (verified on this tree — correctness-tier RUNTIME gate: drives the dock interaction + reads the frame budget; D5 lag RE-AFFIRM). The dock-popover-opens lock (D9 popover) and the layout-cluster anchoring lock are named in PLAIN PROSE as hygiene-tier non-gate mechanisms, NOT runtime closure oracles — the anchoring tier EXITED K.W3 (`8e55c03`, the hardcoded offsets replaced by anchor-token derivations). **Born-RED:** `layout-grid-k.md` censused hardcoded dock offsets; `probe-pathological.mjs` showed dock STRETCH at 3440×1440 pre-W3 (the gates BIT); GREEN on the K.W3 tree (derived grid clusters on cinema display and phone alike). Carried from `K/PROGRESS.md §"Open deferrals"` (K: RE-AFFIRM + EXITED K.W3); re-verified resolved on the L tree. |
| **CH-5/B1+B5 `"......"` empty-value crash** — K→L carry ★ | A(W0)→H | 4 (A,H,I,K → L) | **VERIFY-ONLY** (TERMINATED — re-run on the L dist) | L.WZ (re-run) | `proof:engine-no-throw-on-play` GREEN (verified on this tree — correctness-tier RUNTIME gate: opens the dist + clicks play on an empty-value input, asserting no throw). **Born-RED** in its origin tranche (the empty-input parse threw on play; the gate BIT on that crash); `parseCSSValueUnit("")=>{value:0}` no throw (value.js). Carried from `K/PROGRESS.md §"Open deferrals"` (K: VERIFY-ONLY TERMINATED); re-run + re-verified resolved on the L dist. |
| **CH-6/B2 `_gen` DFA suspend crash** — K→L carry | H | 3 (H,I,K → L) | **VERIFY-ONLY** (TERMINATED — re-run on the L dist) | L.WZ (re-run) | `proof:fsm-suspend-resume-live` GREEN (verified on this tree — correctness-tier RUNTIME gate: drives the live FSM suspend/resume over the dist). **Born-RED** in its origin tranche (the `_gen` DFA suspend threw; the gate BIT on that crash); bind-proof RAFPlayback + `useRafScene`. Carried from `K/PROGRESS.md §"Open deferrals"` (K: VERIFY-ONLY TERMINATED); re-run + re-verified resolved on the L dist. |
| **scene-control-dfa** deploy-block + product lag (the I-close net-new chronic) — K→L carry ★ | I (post-close) | 3 (I,J,K → L) | **VERIFY-ONLY** (TERMINATED — re-verify on the L dist) | L.WZ (re-verify) | `proof:control-surface-single-writer` GREEN (verified on this tree — correctness-tier RUNTIME gate: navToScene-drives the dock projection from the DFA per expected state). **Born-RED** on CI run `27228309606` (trigger='null'-under-load BEFORE the cure; the gate BIT); the observed green-CI→auto-deploy round-trip closed it terminally at J.W0. Carried from `K/PROGRESS.md §"Open deferrals"` (K: VERIFY-ONLY TERMINATED, re-verified across the 3.13.0 dock taxonomy); re-verified resolved on the L dist. |

### The L ledger is TERMINAL (L.WZ close)

Every one of the 13 DL-L cluster rows above is at a TERMINAL disposition — the ledger is READY for
the `proof:chronic-closure` substrate transition (the orchestrator's atomic re-point, NOT executed by
this termination workflow). The disposition tally:

| Terminal disposition | Rows |
|---|---|
| **FOLD LANDED** (gate verified GREEN on this tree, exit 0) | DL-L1 (`proof:replay-equality` + `proof:compile-replay`) · DL-L2 (`proof:settle-is-predicate` + `proof:no-single-option-select`) · DL-L4 (`proof:demo-on-published-surface`) |
| **FOLD LANDED** (derivation-gate mechanism) | DL-L13 (T1 — `proof:gate-is-runtime` AUTHORED + WIRED into `proof:hygiene` as the formal derivation rule, the K-decision option (b) "own the corpus"; verified present `package.json:106`/`:190`, currently RED-local at the close tip on the orchestrator's roster-reconciliation list, not this termination's. **Note:** the "collapse the lattice" language is NOT deleted — it survives in `precepts-k.md §3 T1` lines 246/253; the prior "ABSENT (grep → zero)" assertion was corrected for inv ε — the terminal rests on the wired gate, not the language) |
| **FOLD LANDED, publish USER-DOMAIN** | DL-L5 (`proof:keyframes-vue-published` a+c GREEN; clause b RED-by-design — the `npm publish` is Mike Babb's) |
| **FOLD-LANDED gate + HANDOFF cure** | DL-L3 (`proof:peer-satisfied` detector landed RED-by-design; the F-2 cure is glass-ui BB, UN-FIRED) |
| **HANDOFF, tripwire UN-FIRED (sibling UNPUBLISHED)** | DL-L6 (glass-ui 4.1.0) · DL-L7 (glass-ui BB GlassControlPoint) · DL-L8 (value.js O VJ.W4) · DL-L9 (parse-that PT-WAVE-6) · DL-L10 (the 5-arm workaround sweep, all PENDING) · DL-L11 (coordinated value.js-O + parse-that; the W10 spike LANDED, IMPL gated) |
| **VERIFY-ONLY** | DL-L12 (Lighthouse floors re-verified on the L close dist) |

**CHRONICITY + RUNTIME-BAND CITATION CONTRACT PRESERVED.** Every row's Chronicity cell still leads
with its explicit integer (DL-L7/DL-L8 = `6`, DL-L9 = `5`, DL-L6/DL-L3 = `3`/`2`, the rest `1`) — the
`proof:chronic-closure` parser reads the leading integer unchanged. The ≥4-tranche riders (DL-L7,
DL-L8 = 6; DL-L9 = 5) each EXIT via a named sibling tripwire + a born-RED kf gate (P-invariant-28:
exit-shaped, the re-BOOK option CLOSED). No FOLD row cites a source-shape gate as a RUNTIME oracle;
HYGIENE/non-gate mechanisms are named in plain prose (the contract clause holds).

**THE PATH CONSTANT IS NOT RE-POINTED HERE.** `scripts/proof-chronic-closure.mjs:110`
`CHRONIC_LEDGER` still points at `docs/tranches/K/PROGRESS.md` (verified on this tree) — K's ledger
remains the authoritative parse target until the orchestrator's atomic final motion (the re-point +
non-vacuity planted-probe proof + GREEN-on-clean-ledger in ONE commit). This termination only makes
the L rows TERMINAL so the substrate is READY for that transition.

---

## Band-B gated consume-edges — the open deferrals carried as named tripwires (TERMINAL — every tripwire UN-FIRED at close)

The four K-terminal HANDOFF rows + the three new L.W9 cross-repo dispatches, each with its named
tripwire (the condition that lights the born-RED gate to GREEN). None are re-BOOKed
(P-invariant-28 — the named tripwire IS the exit mechanism; a HANDOFF with a named sibling
publish-and-consume-edge is exit-shaped, not a deferral). **At the L.WZ close every tripwire below is
UN-FIRED — the named siblings are UNPUBLISHED (registry-probed on this tree: glass-ui 4.0.0,
value.js 0.13.0, parse-that 0.9.0). Each row therefore stays HANDOFF, born-RED kf-side. This is the
HONEST close state, not a punt (P-invariant-28: a named tripwire + born-RED kf gate IS exit-shaped).**

| Item | Born | Chronicity | Tripwire (the sibling publish that lights the consume-edge) | Born-RED kf gate | Status at close (sibling registry-probed) |
|---|---|---|---|---|---|
| **RF-17 / DL-K9** (GlassDock click-strand interim) | I | 3 (I,J,K→L) | glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY` + the RF-17 dock-layer collapse-crossfade strand fix | `proof:workaround-deletion` S2 — the kf interim (`onPlayPointerDown`/`pointerHandled`) is deleted in the same commit as the re-pin; PENDING (verified) until the deletion is complete | **HANDOFF — UN-FIRED.** glass-ui at 4.0.0 (4.1.0 unpublished); no interim carries to a 4th tranche under no-workaround |
| **GlassControlPoint / DL-K7** (curve-editor / keyframes-editor enabler) | E | 6 (E,F,G,H,I,J,K→L) | glass-ui BB future minor/major ships `GlassControlPoint` primitive | `proof:control-point-live` authored gate-first BEFORE impl; RED-BY-DESIGN (verified — absent from the published glass-ui dist) until the primitive ships + kf consumes it | **HANDOFF — UN-FIRED.** glass-ui at 4.0.0 (primitive absent); gate-first BOOK is exit-shaped for a 6-tranche chronic (exits the P-inv-28 belt on the first impl, not a 7th BOOK) |
| **MorphSVG / FB-3** (`fromMorphSVG` / `getPointAtLength`) | C | 6 (C,F,G,H,I,J,K→L) | value.js O (0.14.0) ships VJ.W4 remainder (`getPointAtLength` / `fromMorphSVG` arc-length sampler) | `proof:morphsvg-consume` born-RED (the VJ.W4 APIs absent in 0.13.0); gate RED until the APIs publish + kf ships `fromMorphSVG` over them | **HANDOFF — UN-FIRED.** value.js at 0.13.0 (O/0.14.0 unpublished); the full sampler (the tripwire half) is the VJ.W4 remainder |
| **parse-that packrat / PT-2** (Warth-Douglass-Millstein (id,offset) soundness) | E | 5 (E,F,G,H,I,K→L) | parse-that PT-WAVE-6 ships the (id,offset) re-keyed packrat (soundness restore) | `proof:packrat-sound` authored gate-first; gate RED on today's UNSOUND id-only cache (`packrat.ts` self-documents unsoundness — ⚠27); greens on the PT-WAVE-6 publish + kf re-pin | **HANDOFF — UN-FIRED.** parse-that at 0.9.0 (PT-WAVE-6 unpublished); value.js consumes parse-that; kf's gate is on the kf re-pin consuming the value.js that consumes the fixed parse-that |

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
