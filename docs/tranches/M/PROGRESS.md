# Tranche M — PROGRESS (the board + the M open-deferrals chronic ledger)

**Branch:** `tranche-l-dev` (M's development phase rides the L close tip; L CLOSED + committed
@ `529fcfd` the WZ close, `proof:chronic-closure` re-pointed K→L, `proof:all` GREEN; kf `4.3.0`
in tree; value.js `^0.13.0`, glass-ui `~4.0.0`, parse-that `^0.9.0` consumed PUBLISHED — all
registry-probed live at the 32-lane audit: glass-ui `4.0.0`, value.js `0.13.0`, parse-that `0.9.0`).
**Type:** TRANCHE M — **DEVELOPMENT PHASE.** This board records the wave plan + the consolidated
M open-deferrals ledger. §1 carries each wave's status (DEVELOPED with born-RED gate named; impl
opens on explicit authorization — exactly the L.W0 dev→impl boundary); the §"Open deferrals" ledger
is the NEXT chronic-closure parse substrate (L's `L/PROGRESS.md §"Open deferrals"` remains the
AUTHORITATIVE parse target until the orchestrator's atomic M.WZ re-point — `scripts/proof-chronic-closure.mjs:114`
`CHRONIC_LEDGER` still cites `docs/tranches/L/PROGRESS.md`, verified on this tree).
**Dev-phase date:** 2026-06-17 — the 32-lane deep audit completed (`audit/lane-01..32-*.md`); all
sixteen waves DEVELOPED; the Band-C gated consume-edges named and tripwired; the born-RED gate
discipline (sharpened by **inv-M-observable-truth** — the gate bites the REAL observable, never a
proxy) applied to every wave before any cure. **Version in tree:** `4.3.0` (the K close cut); M's
version cut (`5.0.0` — the FOUR breaking changes) + publishes + close-merge round-trip are
USER-DOMAIN (Mike Babb, confirm-first), proposed at M.WZ.

This board is the spine of the tranche-development phase: §0 (why M exists — the five open frontiers
the L gates structurally could not see, the 32-lane re-audit, the inv-ε payoff), §1 (the wave board
with each wave DEVELOPED + its headline born-RED gate + its REAL observable, both bands), §2 (the
finding-cluster ledger with file:line evidence anchors from the 32 lanes), §3 (the precept reckoning
— the 9 viol-M items), and §"Open deferrals" (the M chronic substrate — the L-terminal rows + the 7
K-chronics incremented one tranche, with P-invariant-28 terminal dispositions). Companion documents:

- **`M.md`** — THE binding charter (the five open frontiers; the 16-wave map; the gate-first /
  born-RED discipline sharpened by inv-M-observable-truth; the three M-born invariants —
  inv-M-one-runner, inv-M-observable-truth, inv-M-two-axis; the precept reckoning ⚠M1–⚠M9; the
  KILL anti-charter carried + extended; the performance reckoning; the prompt recap).
- **`audit/lane-01..32-*.md`** — the 32-agent deep audit corpus. Every §1 born-RED witness, the §2
  cluster anchors, the §3 precept rows, and the §"Open deferrals" substrate cite these lanes by
  `lane-NN §S` + a re-runnable `file:line` or gate exit observed on this tree.
- **`audit/prompt-recap-M.md`** (lane 32) — the full per-request disposition (every owner request
  A→L to a terminal verdict; zero drops; inv-ε held).
- **`docs/tranches/L/PROGRESS.md §"Open deferrals"`** — the L terminal ledger this board succeeds
  (20 rows parsed by `proof:chronic-closure` today; the M substrate increments each chronicity by one
  tranche and adds the M net-new rows).

---

## §0 — THE HEADLINE (why Tranche M exists)

Tranche L answered *"is the round-trip TOTAL, is it SOTA, is the constellation complete?"* — and
SHIPPED: it totalized the bi-directional CSS round-trip (replay-equality across `@property` /
per-stop-composition / named-selectors / multi-color / scroll), made the gate-suite device-honest,
shipped SOTA-perf increments + the agent-authoring verb, dispatched + armed the constellation, and
refined the instrument language. `L/FINAL.md` is honest on the close; inv ε holds. M is chartered by
the owner (2026-06-17): **DEEPLY audit (32 agents) the original plan + all changes; consider the
value.js + parse-that + glass-ui-BB tranches; devise a path forward holding NO quick solutions / NO
workarounds / idiomatic-gestalt / NO legacy / architectural-transpositions-for-elegance-simplicity-performance;
fold the chronically-deferred + deferred items; recap all prompts; "what of our performance numbers?"**

The 32-lane re-audit (the inv-ε payoff — it re-verified L against ground truth and caught what the L
gates missed) finds **five open frontiers L's gates structurally could not see**:

**1. The gate apparatus is over-engineered in its IMPLEMENTATION** (the owner's flag, now
quantified). 142 leaf gates in `proof:all`; 72 (51%) spawn a fresh chromium per process with **zero
warm reuse**, chained as a **serial `&&` of 141 clauses with no report-all**, producing an **O(N²)
iterate-to-green** loop (5–6 reds × ~30-min full re-run = the owner's measured ~3 hours). 264
`waitForTimeout` settle-sleeps survive across 61 scripts (L.W4 cured ONE function); eslint +
dependency-cruiser are ABSENT (the ~33 source-shape gates run as node processes). The PRINCIPLE —
runtime actuation, device-honesty, the no-silent-drop oracle — is **sound** and caught real bugs
jsdom/grep cannot; the consolidation is the transposition to **one parallel three-tier vitest
architecture** (Band A — M.W1–W4).

**2. The round-trip is not yet TOTAL — the L gates tested the wrong observables.** The audit
live-probed real breaches the green gates missed: `@property` re-emits from `CSSKeyframesToString`
but **NOT `compileToCSS`** (the compile artifact drops the block); named-selectors no longer throw
but produce **NaN frame-times → every frame always-active** (`NAMED_SELECTOR_NO_TIMELINE` is typed at
`errors.ts:46` but **never thrown** — a placeholder masquerading as wiring at `frame-compiler.ts:128`);
multi-color densify **emits `oklab()` even for `oklch` space** (`compile-color.ts:191`) and **drops
non-color properties** from mixed animations while returning `eligible:true`; nested `@keyframes`
can't find a top-level sibling `animation` rule (cross-depth linkage gap). **This is the
inv-M-observable-truth keystone: the L.W1 S4 gate tested a proxy (no-throw + string round-trip) while
the real breach was NaN frame-times** (Band B — M.W5–W7).

**3. The constellation is dispatched but UN-CONSUMED, and the deploy is BLOCKED.** value.js is at
0.13.0 with **zero Tranche-O items shipped** (incl. two P0 hard-crashes on Baseline CSS — CSS Nesting
THROWS, bare `linear-gradient(red,blue)` THROWS); glass-ui is at 4.0.0 (BB's 4.1.0 unpublished), and
its **F-2 peer-cycle is the SOLE deploy blocker** (`proof:peer-satisfied` RED → demo-smoke RED → no
auto-deploy); parse-that 0.9.0 carries the structural-cssParser KISS violation. Five kf workarounds
sit PENDING at the consume seam (correctly STAGED, not violations — each a sibling-fix-and-re-pin)
(Band C — M.W8–W11).

**4. Performance shipped real wins but with un-measured claims + a doc error.** Measured: SoA
heavy-pipeline **16.6×**, NumericAnimation Float64Array zero-alloc, spring-vector **3.85×@K=8**,
warmEngine/granular accessors. Gaps: **no kf bench covers the value.js color-math alloc claims**;
`warmEngine`'s `postTask` adoption is un-measured (probe SKIPs — the EXACT inv-M-observable-truth
failure the L.W1 S4 gate committed); `L.W7.md` mis-attributes value.js's "1.56×" SoA number as kf's
(Band D — M.W12–W13).

**5. Chronic + deferred items reach their terminal belt, and one premise was factually wrong.** Two
7-tranche items (DL-L7 GlassControlPoint, DL-L8 MorphSVG) are **ABSOLUTE terminal at M**
(P-invariant-28); three more hit ≥4-tranche; DL-L8's L-ledger premise ("value.js `PathGeometry`
absent at 0.13.0") is a **factual error** — it is PRESENT, so MorphSVG is build-in NOW. FINAL.md's
"three breaking type changes" is an **inv-ε under-count** (four) (Band E — M.W14 + M.WZ).

So **M is the consolidation tranche**: it transposes the test apparatus to its gestalt, totalizes the
round-trip correctness the L gates missed, consumes the constellation + unblocks the deploy, measures
the performance honestly, and terminates the chronic ledger — every move an architectural transposition
for elegance, simplicity, and performance, with NO workaround carried forward.

---

## §1 — THE WAVE BOARD (DEVELOPED statuses + headline gates + the REAL observable)

The DAG (`M.md §wave map`): **M.W0 (now) → Band A (M.W1 LEADS — the runner unblocks fast iteration
for every other wave; M.W2 ∥ M.W3 ∥ M.W4 follow) · Band B (M.W5 ∥ M.W6 ∥ M.W7 — kf-internal
correctness, value.js-0.13.0-sufficient, parallel) · Band C (M.W8 fires on glass-ui BB; M.W9 on
value.js O; M.W10 coordinated; M.W11 Band-A gate now + coordinated close — each born-RED kf-side,
consume-on-publish) · Band D (M.W12 perf; M.W13 gated on value.js VJ-L1) · Band E (M.W14 the immediate
exits; M.WZ closes when Band A+B green, Band C consumed-or-circled, the chronic ledger terminal, and
the deploy observed on the glass-ui BB consume).** Status legend: **DEVELOPED** = the wave plan is
authored this dev phase, born-RED gate named; impl opens on explicit authorization. The born-RED gate
SOURCE is written in the impl phase, never here (the K/L precedent).

**Gate-first / born-RED discipline (the L law, sharpened by inv-M-observable-truth — the load-bearing
M law).** Every wave authors its gate over the REAL breach FIRST, witnessed born-RED on today's tree,
before the cure. **A gate that tests a proxy is not a gate** (the L.W1 S4 lesson: it tested no-throw +
string round-trip while the real breach was NaN frame-times). A wave whose gate does not bite the
genuine defect is not started.

| Wave | Band | Title | Status | Headline born-RED gate(s) | The REAL observable (the genuine defect the oracle bites — inv-M-observable-truth) | DAG |
|---|---|---|---|---|---|---|
| **M.W0** | — | Audit-fold + path forward | **DEVELOPED** (now) | **`proof:audit-artifacts-M`** (NEW) — the on-disk artifact set + the dev→impl boundary witness | the actual artifacts re-runnable on disk (`M.md`, this board, `audit/lane-01..32-*.md`, the cross-repo dispatches); born-RED if an artifact is absent or the dev→impl boundary is breached | **LEADS** — the charter + board are the impl-phase substrate |
| **M.W1** | A | The parallel report-all runner (the O(N²) kill) | **✅ IMPLEMENTED** (2026-06-18) — `scripts/run-all.mjs` + `proof:report-all` GREEN (6/6 clauses, born-RED→cured); `proof:all` re-pointed (0 `&&`); wired into ci.yml; `gate-is-runtime`+`ci-coverage` survive | **`proof:report-all`** (NEW — hygiene meta-gate over the runner) | a planted **multi-red tree** reports ALL reds in ONE pass — today the serial `&&` aborts on the FIRST red (141 clauses, no report-all); the gate plants the real multi-red tree and observes the real one-pass surfacing | **KEYSTONE of Band A** — unblocks fast iteration for every subsequent wave |
| **M.W2** | A | The LINT tier (eslint + dependency-cruiser) | **DEVELOPED** | **`proof:lint-tier`** (NEW — absent in `package.json`/`scripts/`, verified 2026-06-17) | a planted source-shape violation (oversize file / restricted import / dup / boundary-edge) reds the ONE static pass that subsumes the ~33 source-shape gates; born-RED because **no eslint config exists** today (the planted defect is the REAL failure mode, not a grep proxy) | ∥ M.W3 ∥ M.W4 (after M.W1) |
| **M.W3** | A | The @vitest/browser integration tier (shared browser, the runner retires) | **DEVELOPED** | **`proof:integration-tier`** (NEW — absent, verified 2026-06-17) | the integration tier runs the runtime assertions **parallel + warm** over the SERVED built dist with ONE shared chromium + ONE server; per-gate cold-boot deleted; the meta-gate reds if any `*.browser.test.ts` navigates Vite-transformed `@src/*` instead of the served dist (the built-dist invariant — the inv-M-observable-truth keystone) | ∥ M.W2 ∥ M.W4 (after M.W1) |
| **M.W4** | A | Synthetic-clock settle · superfluity prune · two-axis taxonomy | **DEVELOPED** | **`proof:gate-is-data-model`** (AXIS-2 meta-gate, NEW) + **`proof:no-animation-sleep`** (the structural settle gate) | the 264 `waitForTimeout` → a synthetic rAF clock (deterministic settle): the settle is **virtual-time, not wall-clock-slept** (the proxy to avoid: a grep that greens while the sleep regresses); `proof:gate-is-data-model` born-RED — the runtime-ONLY precept reformed to inv-M-two-axis | ∥ M.W2 ∥ M.W3 (after M.W1) |
| **M.W5** | B | Compile-surface totality (the round-trip the L gates missed) | **DEVELOPED** | **`proof:replay-equality`** (EXISTING — EXTENDS the `@property`-compile clause; RE-TARGETS the S4 named-selector clause) | `compileToCSS` emits `@property` (today the compile artifact DROPS the block); the named-selector frames assert `frame.time.start`/`.stop` are **NOT NaN** OR the `NAMED_SELECTOR_NO_TIMELINE` throw fires — never NaN-always-active (today the typed error is dead code at `frame-compiler.ts:128`; the S4 clause is a SOURCE-SHAPE regex proxy, `proof-replay-equality.mjs:173-178`) | ∥ M.W6 ∥ M.W7 · value.js 0.13.0-sufficient |
| **M.W6** | B | Multi-color densify fidelity (the space the gate emitted wrong) | **DEVELOPED** | **`proof:compile-replay`** (EXISTING — ADDS `oklch-densify-emits-oklch` + `densify-preserves-non-color`) | an oklch fixture asserts the EMITTED CSS contains `oklch(` (today `colorToOklabCSS` is called unconditionally at `compile-color.ts:191` — `oklch` space emits `oklab()`); a `color+opacity` fixture asserts BOTH the color stops AND `opacity:` survive (today densify drops non-color props while returning `eligible:true`) — the emitted-CSS observable read from the real artifact, not the ΔE proxy | ∥ M.W5 ∥ M.W7 · value.js 0.13.0-sufficient |
| **M.W7** | B | Ingest deepening II (cross-depth sibling linkage + the live-web residuals) | **DEVELOPED** | **`proof:ingest-replay`** (EXISTING — extended with cross-depth linkage clauses) | a `@media{@keyframes}` + a top-level `.foo{animation}` reconstructs replay-equal via a shared `siblingTexts` accumulator through `walkSheet` (today the nested keyframes can't find the top-level sibling `animation` rule → engine-default duration, the REAL observable) | ∥ M.W5 ∥ M.W6 |
| **M.W8** | C | The glass-ui BB consume — THE deploy UNLOCK | **DEVELOPED** | **`proof:peer-satisfied`** + **`proof:workaround-deletion`** S1 + S2 (EXISTING — this wave is the CONSUME that GREENs them) | on glass-ui 4.1.0 publish, ONE atomic commit re-pins `~4.1.x`, deletes BOTH `:aria-orientation` suppressions (`SpringSidebar.vue:43` + `AnimationControls.vue:72`) and the `pointerHandled`/`onPlayPointerDown` interim (`TransportDock.vue`) → `proof:peer-satisfied` GREEN → green CI → auto-deploy. The deploy DONE is the **live-byte equality** (`CI <run> → deploy <run> → live serves index-<hash>.js exact`), not the gate exit code | **Band C — fires on glass-ui BB 4.1.0** (peer-widen + RF-17 + SegmentedTabs aria) |
| **M.W9** | C | The value.js Tranche-O consume | **DEVELOPED** | **`proof:workaround-deletion`** S7 + S8 + S9 (EXISTING) + **`proof:boundary` W96 parse-that-scan** (AUTHORED HERE — named at `L.W9.md:381` but NOT implemented) | on value.js 0.14.0 publish, ONE atomic commit: delete the `linear()` regex (`utils.ts:119,185`, S7), the `FN_NAME` Symbol (`utils.ts:45-55`, S8), the direct parse-that dep (`utils.ts:1` + `package.json`, S9); swap the inline `lerpArray` for `@mkbabb/value.js/math`; consume the 2 P0 crash fixes. W96 born-RED: a planted light-module parse-that import reds `proof:boundary` (today it scans only value.js specifiers) | **Band C — fires on value.js O 0.14.0** (VJ-L1/L2/L3 + §9/§13 crash fixes + §14 math subpath) |
| **M.W10** | C | The parse-that consume + the two-grammar consolidation | **DEVELOPED** | **`proof:packrat-sound`** (NEW — gate-first, born-RED on 0.9.0) + the `typesVersions-absent` arm of `proof:deps-current` (EXTENDED) | consume PT.M1 typesVersions (0.9.1) + PT.M2 value-reader API + PT.M3 packrat `(id,offset)` soundness **OR KILL the unsound tier** + PT.M5 `permutation`; Option B — value.js owns the ONE CSS grammar, parse-that's structural `cssParser` retired. `proof:packrat-sound` born-RED against the LIVE installed parser (not a grep, not a mock) | **Band C — parse-that 0.9.1+ · value.js O** (coordinated) |
| **M.W11** | C | The true-CSS-parity frontier (author `proof:css-parity` born-RED NOW) | **DEVELOPED** | **`proof:css-parity`** (NEW — `scripts/proof-css-parity.mjs`; the FIRST brand-new born-RED gate script in M; absent today) | a Band-A capability matrix — 8 **runtime-invocation** rows over value.js's REAL 0.13.0 failure modes (nesting THROWS / url-opaque / @container / @layer / @scope / bare-gradient THROWS / env / system-color), each asserting the CURED shape — NOT a grep, NOT lane-24's transcription, re-confirmed against the live parser; the coordinated value.js+parse-that grammar closes it | **Band C — value.js O + parse-that (coordinated grammar); the Band-A gate authored NOW** |
| **M.W12** | D | Performance closure (honest measurement) | **DEVELOPED** | **`proof:bench-taxonomy`** (EXTENDED — the gap benches budgeted) + **`proof:scheduler-posttask`** (RE-TARGETED onto a REAL-BROWSER INP measurement) | the bench gaps closed (numeric-SoA kf-side bench, color-interp integration bench, the unwired `sync-step.bench.ts`); the `postTask` probe greens on a **real-browser INP delta** of `warmEngine()` wrapping or stays KILLed — NOT the `typeof scheduler.postTask === "function"` proxy that SKIPs (the EXACT inv-M-observable-truth failure the L.W1 S4 gate committed) | **Band D — value.js O (color-math co-bench, cross-repo)** |
| **M.W13** | D | The engine-seam transposition | **DEVELOPED** | **`proof:decomposition`** with the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry REMOVED (the cap reverts to the 550L base — the born-RED trigger this wave authors FIRST) | engine.ts (1397→~900) under the ceiling **WITHOUT** the override; the lifecycle/playback machine lifted off the `CSSKeyframesAnimation` frame-compile facade; the full engine/playback gate suite GREEN through the move (the behaviour-byte-identical observable, not the line count); group.ts compositor split co-deferred (the D.W4 born-RED HANDOFF) | **Band D — value.js VJ-L1 flatLeaf** (removes the FN_NAME stamp the split is blocked on) |
| **M.W14** | E | The terminal-belt handoff exits (P-invariant-28) | **DEVELOPED** | **`proof:morphsvg-consume`** (NEW — build-in, no sibling gate; the keystone over the REAL observable) + the packrat KILL recorded (no gate) | a **live morph** over two `d` strings produces a frame sample that differs from both endpoints (the observable a real consumer sees — NOT a grep that `fromMorphSVG` exists); DL-L8 build-in over the ALREADY-PUBLISHED value.js `PathGeometry` (the L-ledger "absent API" premise CORRECTED); DL-L9 packrat → KILL (unsound tier, zero consumers); DL-L7 GlassControlPoint → build-in Option B over the LIGHT `Draggable` | **Band E — value.js 0.13.0 (`PathGeometry` present)** |
| **M.WZ** | — | Close (recap · deferred terminal · 5.0.0 prep · deploy) | **DEVELOPED** | **`proof:changelog-5.0.0`** (NEW — the FOUR breaking changes) + **`proof:chronic-closure`** (re-pointed L→M, the atomic non-vacuity motion) + **`proof:all`** GREEN on the consolidated M runner | the chronic ledger terminated K→L→M; the FOUR breaking changes (inv-ε under-count corrected: `Animation`→`KeyframesAnimation` `engine.ts:1192`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` `timeline.ts:163`, `ScrollTimeline`→`KeyframesScrollTimeline` `timeline.ts:209`, `presets.flip`→`flipPreset` `animations.ts:133`); the deploy round-trip RE-observed (gated on M.W8 clearing F-2) — the live bytes the site serves, not the gate exit code | **CLOSES — glass-ui BB (deploy) · USER-DOMAIN (cut)** |

---

## §2 — THE FINDING-CLUSTER LEDGER (evidence anchors from the 32-lane audit)

The charter's five-frontier finding family expanded per cluster. Severity from the audit fleet: the
**gate-apparatus over-engineering** (the owner's flag, the M P0 — Band A), the **round-trip
observable-truth breaches** (Band B), the **constellation un-consume + deploy block** (Band C), the
**un-measured perf + the engine seam** (Band D), the **terminal chronic belt** (Band E). Evidence
anchors: `audit/lane-NN-*.md §S` + a re-runnable `file:line` or gate exit observed on this tree.

### 2.1 — The gate-apparatus over-engineering → M.W1 + M.W2 + M.W3 + M.W4 (the M P0)

| Finding | Evidence anchor | Wave |
|---|---|---|
| 142 leaf gates in `proof:all`; 72 (51%) cold-boot a fresh chromium with ZERO warm reuse; chained as a serial `&&` of 141 clauses with no report-all → O(N²) iterate-to-green (5–6 reds × ~30-min re-run = ~3 hours) | `lane-13-apparatus-sota.md §1` (serial `&&` chain, ~67 hand-rolled chromium-launch scripts); `lane-14-serial-o-n2-.md §1` (the 141-clause chain) | M.W1 |
| 264 `waitForTimeout` settle-sleeps survive across 61 scripts (L.W4 cured ONE function, `openControlsPanel`); the render-race root the K CI-greenify epic traced | `lane-31 §3.1` (`grep -c waitForTimeout scripts/proof-*.mjs` = 264 / 61 files, verified); `lane-16-superfluity.md`; `lane-17-browser-coldboot.md` | M.W4 |
| eslint ABSENT (`node_modules/eslint` does not exist) + dependency-cruiser ABSENT; the ~33 source-shape gates run as independent node processes (~0.18s fork each + independent tree-read) | `lane-31 §3.1` (verified absent); `lane-13-apparatus-sota.md`; `lane-15-two-harness.md` | M.W2 |
| `@vitest/browser` ABSENT (`node_modules/@vitest/browser` does not exist); the 72 runtime gates hand-roll launch/retry/fixtures/reporting per process; the built-dist navigation constraint (`page.goto` the served dist, NOT Vite-transformed source) is the load-bearing thing a naive "just use vitest" migration loses | `lane-31 §3.1` (verified absent); `lane-17-browser-coldboot.md`; `lane-13-apparatus-sota.md §4` (the counterpoint) | M.W3 |
| ~13 redundant browser clauses (subsumption-citable); the runtime-ONLY precept is over-broad — a data-model chronic forced through a browser | `lane-16-superfluity.md` (the ~13 redundant clauses); `lane-18-precept-contrivance.md` (the precept reform to inv-M-two-axis) | M.W4 |

### 2.2 — The round-trip observable-truth breaches → M.W5 + M.W6 + M.W7 (Band B)

| Finding | Evidence anchor | Wave |
|---|---|---|
| `@property` re-emits from `CSSKeyframesToString` but NOT `compileToCSS` — the compile artifact DROPS the block; the L gate tested the string-serializer path only | `lane-01-w1-replay-equality.md §4`; `lane-02-w2-compiler.md` (the `compileToCSS`/`compileChild` gap) | M.W5 |
| `NAMED_SELECTOR_NO_TIMELINE` typed (`errors.ts:46`) but NEVER thrown; `NAMED_SELECTOR_SUPERTYPE` written never read (`frame-compiler.ts:128`) — named-selector frames → NaN frame-times → every frame always-active; the L.W1 S4 gate tested a SOURCE-SHAPE regex proxy (`proof-replay-equality.mjs:173-178`), blind to the NaN observable | `lane-01-w1-replay-equality.md §4` (the proxy clause); `errors.ts:46` + `frame-compiler.ts:112-128` (Read-verified) | M.W5 |
| `colorToOklabCSS` called unconditionally (`compile-color.ts:191`) — `oklch` space emits `oklab()` (wrong space); the ΔE math is right, the EMITTED CSS is wrong (the proxy-vs-observable split) | `lane-02-w2-compiler.md`; `compile-color.ts:191` (Read-verified) | M.W6 |
| densify drops non-color properties from mixed animations while returning `eligible:true` — a corrupt artifact shipped as eligible | `lane-02-w2-compiler.md`; `lane-01-w1-replay-equality.md` (the eligible-over-corrupt finding) | M.W6 |
| nested `@keyframes` can't find a top-level sibling `animation` rule (cross-depth linkage gap) → engine-default duration | `lane-03-w3-ingest.md` (the cross-depth `siblingTexts` accumulator gap) | M.W7 |

### 2.3 — The constellation un-consume + the deploy block → M.W8 + M.W9 + M.W10 + M.W11 (Band C)

| Finding | Evidence anchor | Wave |
|---|---|---|
| F-2 peer-cycle LIVE — glass-ui 4.0.0 peer `@mkbabb/value.js "^0.10.0\|\|^0.11.0"` REJECTS installed 0.13.0 (ELSPROBLEMS); `proof:peer-satisfied` RED → demo-smoke RED → no auto-deploy (the SOLE deploy blocker) | `lane-23-f-2-deploy-blocker.md`; `lane-21-glass-ui-bb.md`; `proof:peer-satisfied` exit 1 BORN-RED-BY-DESIGN (re-run live, `lane-28 §0`) | M.W8 |
| 5 kf-owned workarounds PENDING at the consume seam — `linear()` regex (`utils.ts:119,185`, S7), `FN_NAME` Symbol (`utils.ts:45-55`, S8), direct parse-that dep (`utils.ts:1`, S9), `:aria-orientation` (`SpringSidebar.vue:43` + `AnimationControls.vue:72`, S1), `onPlayPointerDown` interim (`TransportDock.vue`, S2) | `lane-26-workaround-deletion.md`; `lane-31 §3.3`; `proof:workaround-deletion` 0 GREEN / 5 PENDING / 0 RED (re-run live) | M.W8/M.W9 |
| `proof:boundary` W96 parse-that-scan named (`L.W9.md:381`) but NOT implemented — `holdsValueJsSpecifier` (`proof-boundary.mjs:93`) scans only value.js specifiers, not parse-that in light modules | `lane-19-value-js-o.md`; `lane-31 §2.6/§3.2`; `scripts/proof-boundary.mjs:93` (Read-verified) | M.W9 |
| value.js two P0 hard-crashes on Baseline CSS — bare `linear-gradient(red,blue)` (`TypeError: t is not iterable`), CSS Nesting THROWS; parse-that structural-cssParser KISS violation (two divergent CSS grammars in the spine) | `lane-24-css-parity.md`; `lane-19-value-js-o.md`; `lane-20-parse-that.md`; `W10-css-parity-spike.md §1` (corrected against the live parser) | M.W10/M.W11 |
| value.js color-math hot paths allocate per-call (transformMat3/oklab2xyz/mixColors/gamutMapToRgbSpace) — paid on every densify/lerp; the co-bench + zero-alloc rewrite are the cross-repo perf transposition | `lane-30-engine-colormath-perf.md`; `lane-19-value-js-o.md` (VJ.L1–L8) | M.W12 (co-bench) |

### 2.4 — The un-measured perf + the engine seam → M.W12 + M.W13 (Band D)

| Finding | Evidence anchor | Wave |
|---|---|---|
| No kf bench covers the value.js color-math alloc claims (VJ.L1–L8); the budgeted bench taxonomy frames the frontier but claims NO measured number | `lane-29-perf-numbers.md`; `lane-30-engine-colormath-perf.md` | M.W12 |
| `warmEngine`'s `scheduler.postTask` adoption un-measured — the probe SKIPs in jsdom; `load-engine.ts:524-534` documents the measure-first deferral; the EXACT inv-M-observable-truth failure the L.W1 S4 gate committed | `lane-29-perf-numbers.md`; `lane-31 §2.2`; `load-engine.ts:536` (Read-verified) | M.W12 |
| `bench/sync-step.bench.ts` unwired; `L.W7.md` mis-attributes value.js's "1.56×" SoA number as kf's (a doc correction) | `lane-29-perf-numbers.md`; `lane-07-w7-perf.md` | M.W12 |
| engine.ts 1397L rides only on the `LIBRARY_CEILING_OVERRIDE` (`proof-decomposition.mjs:151-157` carries the BORN-RED HANDOFF text verbatim — "the FULL engine-seam transposition… DEFERRED… NOT a silent punt"); the split is blocked on the FN_NAME stamp value.js VJ-L1 flatLeaf removes | `lane-11-decompositions.md §6 DF-11-A`; `proof-decomposition.mjs:151-157` (Read-verified) | M.W13 |

### 2.5 — The terminal chronic belt + the factual error → M.W14 + M.WZ (Band E)

| Finding | Evidence anchor | Wave |
|---|---|---|
| DL-L7 GlassControlPoint (7-tranche) + DL-L8 MorphSVG (7-tranche) are ABSOLUTE terminal at M (P-invariant-28); re-BOOK CLOSED since L.WZ — each must EXIT (build-in or KILL) | `lane-28-chronic-ledger.md §4` (the P-inv-28 roll-up); `lane-25-band-b-handoffs.md §2/§3` | M.W14 |
| DL-L8's L-ledger premise ("value.js `PathGeometry` absent at 0.13.0") is a FACTUAL ERROR — `PathGeometry.getLength()` + point sampling are PRESENT; `fromMorphSVG` is a kf-side compositor over published primitives (build-in NOW) | `lane-25-band-b-handoffs.md §3`; `lane-28-chronic-ledger.md §2a DM-3` | M.W14 |
| DL-L9 packrat — the LR grow-path `id`-only unsoundness is OFF the value.js-consumed path (the 0.9.0 dist uses composite `(id,offset)` key; `packrat: true` opt-in not used by value.js's grammar); zero production consumers → KILL | `lane-25-band-b-handoffs.md §4`; `lane-28-chronic-ledger.md §5` | M.W14 |
| FINAL.md "THREE breaking type changes" is an inv-ε UNDER-COUNT — FOUR documented: `Animation`→`KeyframesAnimation` (`engine.ts:1192`), `ScrollTimelineOptions` (`timeline.ts:163`), `ScrollTimeline` (`timeline.ts:209`), `presets.flip`→`presets.flipPreset` (`animations.ts:133`) | `lane-27-user-domain-finale.md §1`; `lane-28-chronic-ledger.md §3 DM-16`; the four `@deprecated`/`BREAKING` annotations (Read-verified) | M.WZ |
| The deploy round-trip was HANDOFF (never observed) at the L close — gated on `proof:all` GREEN + `proof:peer-satisfied` GREEN (glass-ui BB) + USER-DOMAIN version cut | `lane-08-w8-dogfood-publish.md`; `lane-28-chronic-ledger.md §2d DM-20`; `L/FINAL.md §S6` | M.WZ (gated on M.W8) |

---

## §3 — THE PRECEPT RECKONING (the 9 viol-M items)

The J/K/L structural spine HELD through L (`lane-31-precept-reckoning.md §1`: NO-quick-solutions
HELD, NO-legacy HELD, KISS HELD, acyclic-spine HELD at the bundle boundary, inv-16 HELD structurally,
inv-ε HELD — three overclaims CAUGHT and CORRECTED during L). The violations the 32-lane re-audit
found are **L-as-built debt the gates could not see** — each a named M cure, NONE carried forward.
Full register: `M.md §precept reckoning` (⚠M1–⚠M9); the per-finding evidence in
`lane-31-precept-reckoning.md` + the cited lanes.

| # | Violation (file:line) | Precept | M cure | Evidence anchor |
|---|---|---|---|---|
| **⚠M1** | `frame-compiler.ts:128` — `NAMED_SELECTOR_SUPERTYPE` written, never read; `NAMED_SELECTOR_NO_TIMELINE` typed (`errors.ts:46`), never thrown — a placeholder masquerading as wiring; named-selector frames → NaN always-active | no-workaround / inv-M-observable-truth | **M.W5** (the parse-time throw; the gate tests the NaN observable, not the source-shape regex proxy) | `lane-01-w1-replay-equality.md §4`; `frame-compiler.ts:112-128` + `errors.ts:46` (Read) |
| **⚠M2** | `compile-color.ts:191` — `colorToOklabCSS` called unconditionally; `oklch` space emits `oklab()` (wrong space) | inv-L-totality (faithful round-trip) | **M.W6** (dispatch on space — the emitted-CSS observable) | `lane-02-w2-compiler.md`; `compile-color.ts:191` (Read) |
| **⚠M3** | densify drops non-color properties from mixed animations, `eligible:true` over a corrupt artifact | inv-L-totality (honest-or-refuse) | **M.W6** (non-color preservation — both stops AND `opacity:` survive) | `lane-02-w2-compiler.md`; `lane-01-w1-replay-equality.md` |
| **⚠M4** | `FINAL.md:141-142` — "THREE breaking type changes" but the source documents FOUR (`Animation`→`KeyframesAnimation` `engine.ts:1192`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` `timeline.ts:163`, `ScrollTimeline`→`KeyframesScrollTimeline` `timeline.ts:209`, `presets.flip`→`flipPreset` `animations.ts:133`) | inv-ε (under-count) | **M.WZ** (the 5.0.0 changelog corrects it; `proof:changelog-5.0.0`) | `lane-27-user-domain-finale.md §1`; `engine.ts:1192` / `timeline.ts:163,209` / `animations.ts:133` (Read) |
| **⚠M5** | `deferred-ledger-L.md DLL-21` — "value.js `PathGeometry` absent at 0.13.0"; it is PRESENT | inv-ε (factual error) | **M.W14** (MorphSVG build-in now over published `PathGeometry`) | `lane-25-band-b-handoffs.md §3`; value.js 0.13.0 `PathGeometry` present |
| **⚠M6** | the serial `&&` chain (141 clauses, no report-all, no parallel) — a legacy architecture with no blocking justification (ports `listen(0)`, posture stateless, dist read-only) | no-legacy / no-workaround | **M.W1** (the parallel report-all runner) | `lane-14-serial-o-n2-.md §1`; `lane-13-apparatus-sota.md §1`; `package.json:190` (124 `&&`, Read) |
| **⚠M7** | 264 `waitForTimeout` settle-sleeps in `scripts/*.mjs` — only partially cured by L.W4 (one function) | inv-L-device-honesty | **M.W4** (synthetic clock — virtual-time settle, not wall-clock) | `lane-31 §3.1` (264 / 61 files, verified); `lane-16-superfluity.md` |
| **⚠M8** | the `proof:boundary` W96 parse-that-scan named (`L.W9.md:381`) but NOT implemented | gate-completeness | **M.W9** (authored on the parse-that-dep delete; born-RED on a planted light-module import) | `lane-31 §2.6/§3.2`; `scripts/proof-boundary.mjs:93` (Read) |
| **⚠M9** | the L.W5 drag/sequence additions have ZERO vitest coverage (entirely in the node gate) | test-completeness | **M.W3** (the integration tier; vitest-colocated) | `lane-05-w5-orchestration.md`; `lane-15-two-harness.md` |

**The structural-spine HELD findings (NOT violations — recorded for inv-ε completeness):** the
`!important` verify-lane workaround was caught + REVERTED (HELD); the `lerpArray` inline copy is a
NECESSARY DRY tension (value.js exposes no `./math` subpath — `lane-31 §2.5`), pending the value.js-O
`./math` ask; the `warmEngine` `postTask` deferral is measure-first-correct (`lane-31 §2.2`); the
decomposition extractions are cohesive, not manufactured (`lane-31 §2.4`); the three inv-ε corrections
(the `!important` spec-reread, the W10 parser mis-attribution, the `proof:all` roster reds) are L's
strongest precept signal — the discipline enforces itself when implementation catches what audit
missed (`lane-31 §5`). **M must hold the same adversarial verification posture** (inv-ε / inv-M-observable-truth):
a born-RED gate on a wrong premise is a liability, not a benefit.

---

## Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the M consolidated
open-deferrals ledger.** This is the consolidated L→M deferred/chronic ledger built from
`L/PROGRESS.md §"Open deferrals"` (the authoritative L substrate — 20 rows parsed by
`proof:chronic-closure` today) + the L-terminal Band-B HANDOFF rows + the 7 carried K-chronics, each
**chronicity integer incremented by one tranche** for M, with the M net-new finding rows. Built and
cross-verified in `lane-28-chronic-ledger.md` (every sibling publish registry-probed live; every gate
output re-run directly on this tree).

> **SUBSTRATE-TRANSITION NOTE (binding — the M ledger is DEVELOPED and will be TERMINAL at M.WZ; L's
> ledger remains the AUTHORITATIVE parse target until the orchestrator's atomic re-point motion).**
> Through M's development phase the authoritative parse target for `proof:chronic-closure` REMAINS
> `L/PROGRESS.md §"Open deferrals"` (`scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` points
> there, terminal and GREEN — verified still pointing at L on this tree). The DM rows below form the
> proposed M substrate; M.WZ refines and finalizes them. **The transition itself — the single
> path-constant re-point `L/PROGRESS.md → M/PROGRESS.md §"Open deferrals"` at
> `scripts/proof-chronic-closure.mjs:114` — is the ORCHESTRATOR'S ATOMIC FINAL MOTION at M.WZ, NOT
> executed by this DOCS-ONLY development board** (the re-point + the non-vacuity planted-probe proof +
> the gate GREEN-on-clean-ledger are ONE commit the orchestrator fires; exactly the K.WZ→L and L.WZ→M
> precedent). The re-point is NOT a vacuous swap: per P-SUBSTRATE the grammar must BITE on the new
> substrate, PROVEN by re-running the gate against deliberately-malformed planted M-ledger rows (a
> FOLD citing a source-shape gate; a HANDOFF targeting an unpublished future version with no
> consume-edge; a ≥4-tranche bare BOOK) and witnessing it RED on all three clause shapes before the
> probes are removed and the gate GREENS on this clean terminal M ledger.
>
> **CHRONICITY COLUMN SHAPE (binding — the grammar contract):** Every row's Chronicity cell leads
> with an explicit INTEGER tranche-span count, the tranche-letter provenance following in parentheses
> (e.g. `4 (I,J,K,L→M)`, `7 (E,F,G,H,I,J,K,L→M)`). The gate reads the leading integer ONLY. The
> ≥4-tranche EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer.
>
> **DISPOSITION VOCABULARY: FOLD** (into an M wave) · **HANDOFF** (sibling-owned, paired with a
> published consume-edge or born-RED kf gate) · **RE-AFFIRM** · **VERIFY-ONLY** · **BOOK** (net-new,
> terminal home named) · **RECORD** · **KILL** · **USER-DOMAIN** · **OUT** (permanently out of scope).
> A Band-C FOLD/HANDOFF row's consume-edge is born-RED kf-side; it greens when the sibling publishes.
>
> **THE RUNTIME-BAND CITATION CONTRACT (binding — the parser's grammar):** A FOLD row's CLOSURE-CELL
> grammar is exact: any `` `proof:*` `` it backticks is treated as a load-bearing closure ORACLE that
> MUST — once authored in the impl phase — resolve to a `package.json` key, run in the
> `proof:correctness` tier, AND be a RUNTIME gate (open a browser over the built dist via
> `lib/demo-driver.mjs`, OR — post-M.W3 — a `*.browser.test.ts` over the served dist on the
> consolidated runner). A HYGIENE / source-shape / off-DOM data-model gate is named in PLAIN PROSE and
> the row's terminal mechanism is the non-gate keyword the parser's `nonGateMechanism` clause reads.
> (inv-M-two-axis: a data-model chronic closes via a fast NODE/VITEST gate named in prose, not forced
> through a browser.)

### A — HANDOFF rows (sibling-gated; tripwires UN-FIRED at this audit — the P-invariant-28 belt)

| Item (chronic / deferral) | Born | Chronicity | Disposition | Owning wave | The gate / evidence (the closure oracle) |
|---|---|---|---|---|---|
| **DM-1 RF-17 / DL-K9 / DL-L6 GlassDock click-strand interim** (`onPlayPointerDown`/`pointerHandled` in `TransportDock.vue` — a glass-ui dock-layer crossfade defect worked around kf-side) | I (BLK-8) | **4 (I,J,K,L→M)** | **HANDOFF — consume glass-ui 4.1.0 + delete S2 in ONE commit** | **M.W8** | `proof:workaround-deletion` S2 PENDING (verified — `TransportDock.vue:15,151,196,342,348,358,361,366,373`); glass-ui@4.1.0 E404. **TRIPWIRE:** glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY` → S2 GREEN on re-pin + simultaneous deletion. **P-inv-28 (NEWLY 4-tranche at M):** no-workaround forbids a 5th carry independently; MUST consume or KILL at M. `lane-25 §1` verdict: genuinely sibling-gated, build-in NOT viable under inv-16. (`lane-28 §2a DM-1`) |
| **DM-2 GlassControlPoint / DL-K7 / DL-L7** (the curve-editor primitive; absent from glass-ui@4.0.0 dist; 7-tranche) ★‡ | E | **7 (E,F,G,H,I,J,K,L→M)** | **HANDOFF — consume on glass-ui BB publish OR build-in Option B OR named KILL (ABSOLUTE terminal at M)** | **M.W14** (build-in) / **M.W8** (consume) | `proof:control-point-live` RED-BY-DESIGN (verified — ZERO hits in `node_modules/@mkbabb/glass-ui/dist/`). **TRIPWIRE:** glass-ui BB ships `GlassControlPoint`. **P-inv-28 (7-tranche, re-BOOK CLOSED since L.WZ, ABSOLUTE terminal at M):** `lane-25 §2` — if BB declares option C (out-of-scope), kf builds a thin internal `DemoControlPoint` over the LIGHT `Draggable` and the KILL/build-in form closes it permanently. At M.WZ this row has a commit hash (EXITED) or a named permanent-no with a concrete spec — no 8th BOOK. (`lane-28 §2a DM-2`) |
| **DM-3 MorphSVG / FB-3 / DL-L8** (`fromMorphSVG`/`getPointAtLength` arc-length sampler) ★‡ | C | **7 (C,F,G,H,I,J,K,L→M)** | **FOLD-LANDED (build-in over PUBLISHED `PathGeometry`) — the L-ledger "absent API" premise is a FACTUAL ERROR, corrected (ABSOLUTE terminal at M)** | **M.W14** | **TERMINAL — build-in, no sibling gate.** `proof:morphsvg-consume` born-RED over the **live-morph** observable (a frame sample differs from both `d` endpoints — `M.W14.md §S3`, inv-M-observable-truth keystone — NOT a grep that `fromMorphSVG` exists). `lane-25 §3` + `⚠M5`: value.js 0.13.0 ALREADY exposes `PathGeometry.getLength()` + point sampling; `fromMorphSVG` is a kf-side compositor over published primitives — the DL-L8 "value.js PathGeometry absent at 0.13.0" premise (`deferred-ledger-L.md DLL-21`) is corrected. **P-inv-28 (7-tranche, ABSOLUTE terminal):** build-in NOW; no 8th BOOK. (`lane-28 §2a DM-3`; `lane-25 §3`) |
| **DM-4 PT-2 parse-that packrat / DL-L9** (Warth-Douglass-Millstein (id,offset) soundness; `packrat.ts` self-documents UNSOUND id-only key) ★‡ | E | **6 (E,F,G,H,I,K,L→M)** | **KILL (the unsoundness is OFF the value.js-consumed path; zero production consumers; ABSOLUTE terminal at M)** | **M.W14** (KILL recorded, no gate) | **TERMINAL — KILL.** `lane-25 §4` + `lane-28 §5` (verified against the published 0.9.0 dist): the LR grow-path `id`-only key is NOT exercised by value.js's grammar (`packrat: true` opt-in not used); the 0.9.0 dist uses composite `(id,offset)` key on all production code paths; `proof:packrat-sound` ABSENT through 6 tranches (E,F,G,H,I,K,L) is the clearest signal the unsoundness is theoretical. **KILL form:** any future opt-in consumer of the LR grow path must author `proof:packrat-sound` as its OWN gate-first obligation. **P-inv-28 (6-tranche):** the KILL is the KISS-respecting exit; no re-BOOK. (`lane-28 §5 DM-4`; `lane-25 §4`) |
| **DM-5 Constellation workarounds / DL-L10** (FN_NAME Symbol ⚠18/⚠M-track; linear() regex ⚠20; direct parse-that dep ⚠24/⚠M8; aria-orientation suppress ⚠1-3) | K | **2 (K,L→M)** | **HANDOFF (each retires on its sibling publish consume-edge; all 5 arms PENDING)** | **M.W8** (S1/S2) · **M.W9** (S7/S8/S9) | `proof:workaround-deletion` 0 GREEN / 5 PENDING / 0 RED (re-run live). Each arm PENDING because the paired sibling-fix is UNPUBLISHED (glass-ui@4.1.0 E404; value.js@0.14.0 E404). **TRIPWIRES (each a published-consume-edge):** (S1) glass-ui 4.1.0 SegmentedTabs aria fix → both `:aria-orientation` lines deleted; (S2) glass-ui 4.1.0 RF-17 → `pointerHandled`/`onPlayPointerDown` deleted; (S7) value.js VJ-L2 `linearStopsToCSS`; (S8) value.js VJ-L1 `flatLeaf`; (S9) value.js VJ-L3 `parseCSSSubValue`. Each deletion is ONE commit per sibling, atomic with the re-pin. (`lane-26-workaround-deletion.md`; `lane-28 §2a DM-5`) |
| **DM-6 True-CSS-parity frontier / DL-L11** (CSS Nesting THROWS; url-token opaque; @container/@layer/@scope; bare-gradient crash; W10 spike landed; IMPL gated on coordinated publish) | K | **2 (K,L→M)** | **HANDOFF (coordinated value.js-O + parse-that publish; M.W11 Band-A gate authored NOW, IMPL gated)** | **M.W11** | `proof:css-parity` AUTHORED NOW (Band-A, born-RED — the FIRST brand-new M gate script): 8 runtime-invocation rows over value.js's REAL 0.13.0 failure modes assert the CURED shape (`M.W11.md §Born-RED gate`; corrected against the live parser per `W10-css-parity-spike.md §1`, NOT lane-24's transcription). **TRIPWIRE:** value.js O (0.14.0) + parse-that (post-0.9.0) coordinated grammar → the gate GREENs on re-pin. W10-IMPL does NOT open until the siblings publish; Option B (value.js owns the ONE grammar; parse-that's structural `cssParser` retired). W100 incremental-parse KILL re-affirmed (BOOK-with-tripwire). (`lane-24-css-parity.md`; `lane-28 §2a DM-6`) |

### B — USER-DOMAIN rows

| Item | Born | Chronicity | Disposition | Owning wave | The gate / evidence |
|---|---|---|---|---|---|
| **DM-7 keyframes-vue 0.1.0 unpublished / DL-L5** (the `packages/keyframes-vue` adapter is PREPPED; clause (b) of `proof:keyframes-vue-published` RED — E404) | K.W12 | 2 (K,L→M) | **HANDOFF (USER-DOMAIN — Mike Babb)** | **M.WZ** (the version cut wave) | `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (re-run: E404). The adapter is BUILT (clause (a) GREEN); the peer floor lifted (clause (c) GREEN). The `npm publish --access public` is USER-DOMAIN. M also carries the `5.0.0` version cut (the FOUR breaking changes + the silent-lossy multi-color refusal + the barrel-dogfood flip). The USER-DOMAIN cut is the M.WZ precondition for the deploy round-trip. (`lane-28 §2b DM-7`) |
| **DM-16 5.0.0 version cut** (the FOUR documented breaking type changes — inv-ε under-count corrected; the multi-color refusal semantic break; the barrel-dogfood flip; L recommends `5.0.0` MAJOR) | L.W8 | 1 (L→M) | **USER-DOMAIN** (Mike Babb authorizes the version string) | **M.WZ** (with the npm publish motion) | `proof:changelog-5.0.0` (NEW — born-RED on today's tree) asserts the FOUR breaking changes: `Animation`→`KeyframesAnimation` (`engine.ts:1192`), `ScrollTimelineOptions` (`timeline.ts:163`), `ScrollTimeline` (`timeline.ts:209`), `presets.flip`→`presets.flipPreset` (`animations.ts:133`). FINAL.md:141-142's "THREE" is the ⚠M4 under-count. The exact version string is USER-DOMAIN; M.WZ proposes the criteria. (`lane-27-user-domain-finale.md §1`; `lane-28 §2d DM-16`) |
| **DM-20 deploy round-trip not yet observed at L close** (gated on `proof:all` GREEN + glass-ui BB peer fix + USER-DOMAIN version cut) | L.WZ | 1 (L→M) | **USER-DOMAIN + HANDOFF (the round-trip is HANDOFF until all three preconditions satisfy)** | **M.WZ** (gated on M.W8) | `L/FINAL.md §S6`: the round-trip is cited gated-and-pending, never observed. Preconditions: (1) `proof:all` GREEN on the consolidated M runner; (2) `proof:peer-satisfied` GREEN (M.W8 ⇒ the F-2 cure); (3) USER-DOMAIN version cut (DM-16 + DM-7). M.WZ closes all three and OBSERVES the CI→deploy→live bytes round-trip (the live-byte equality `CI <run> → deploy <run> → live serves index-<hash>.js exact`, inv-M-observable-truth applied to the deploy — the bytes the site serves, not the gate exit code), recorded in M/FINAL.md with the EXACT build hash. (`lane-28 §2d DM-20`) |

### C — VERIFY-ONLY / RE-AFFIRM rows (the 7 carried K-chronics — terminated defects; re-verified on each new dist)

Each row below is a TERMINATED chronic carried from `L/PROGRESS.md §"Open deferrals"`: the defect was
cured, the gate was born-RED on the defect tree, and the gate is GREEN on the L close tree. The M
obligation is RE-VERIFY the GREEN state on the M dist. If any gate reverts RED, that is a NEW M
regression to wave-assign. **P-invariant-28 satisfaction:** each row's chronicity integer counts ALL
tranches of CARRY (including the terminated era); the items exit the belt by the BORN-RED oracle fact
(`proof:chronic-closure` rules 1–4 — a GREEN gate with documented born-RED provenance IS the exit
form). Each closure oracle is a correctness-tier RUNTIME gate (the runtime-band citation contract).

| Item | Born | Chronicity | Disposition | Owning wave | The gate / evidence (the closure oracle) |
|---|---|---|---|---|---|
| **DM-8 Lighthouse floors / DL-L12** (K floors: home 68 / cube 66 / amiga 52 / square 65 / easing 63 / spring 55) | B-era | 2 (L,M; K EXITED by measurement) | **VERIFY-ONLY** | **M.WZ** (re-verify on the M close dist) | Non-gate terminal mechanism (a measured quiet-host artifact, runner-calibrated, never CI-hard-gated per inv-L-device-honesty — named in PROSE, NOT a runtime closure oracle): the lighthouse-mobile runner re-run with `KF_REQUIRE_LH=1` on the M close dist; the K floors are the hard floor; any regression RED. The re-verification rides the M.WZ close-merge dist (deploy round-trip + version cut are USER-DOMAIN/sibling-gated). (`lane-28 §2c DM-8`) |
| **DM-9 CH-1/B7 specular sheen** (the cartoon specular at rest) | D(D14)→H | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** (do not re-litigate; re-verify on the M dist) | **M.WZ** (re-verify) | `proof:specular-absent-at-rest` GREEN (verified on the L tree — correctness-tier RUNTIME gate: opens the built dist + reads the rendered specular at rest across the scenes). **Born-RED** in its origin tranche (the cartoon specular rendered at rest; the gate BIT before the flat-default consume cured it); `proof:specular-handoff` DELETED, the self-guard asserts its absence. Carried from L (RE-AFFIRM); re-verify on the M dist. P-inv-28 (5-tranche): the GREEN gate + documented born-RED provenance IS the exit form. (`lane-28 §2c DM-9`) |
| **DM-10 CH-2 typography** (φ-hero typography, re-falsified at the dock voice) | D(D7)→I(TYP-2) | **6 (D,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED — re-run on the M dist)** | **M.WZ** (re-run) | `proof:font-census` GREEN (verified on the L tree — correctness-tier RUNTIME gate: opens the dist + navToScene-drives a computed-font CENSUS across all scenes). **Born-RED** in K (the K live audit re-falsified the dock voice → system-sans; font-census BIT on two display tokens); ONE voice-token authority, dock-label binds the display serif. Carried from L; re-run on the M dist. P-inv-28 (6-tranche): GREEN gate + born-RED provenance IS the exit form. (`lane-28 §2c DM-10`) |
| **DM-11 CH-3 mobile chronic** (desktop-certified; spring slider STEPS; /square broken) | D(D10) | **7 (D,H,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED — re-run on the M dist)** | **M.WZ** (re-run) | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (verified on the L tree — both correctness-tier RUNTIME gates: drive the live spring slider + the mobile-emulated subject motion over the dist). **Born-RED** in K (thumb `changeCount:0` over 240 frames + "spring slider literally steps" + "none work on /square"; both gates BIT); the 60 Hz painter owns the position; /square cured by K.W4. Carried from L; re-run on the M dist. P-inv-28 (7-tranche): GREEN gate + born-RED provenance IS the exit form. (`lane-28 §2c DM-11`) |
| **DM-12 CH-4 dock** (D5 lag + D9 popover; the felt dock) | D(D5/D9) | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** (D5/D9 lag+popover) + EXITED-reaffirmed (dock anchoring) | **M.WZ** (re-verify) | `proof:perf-frame-budget` GREEN (verified on the L tree — correctness-tier RUNTIME gate: drives the dock interaction + reads the frame budget; D5 lag RE-AFFIRM). The dock-popover-opens lock (D9) and the anchoring lock are named in PLAIN PROSE as hygiene-tier non-gate mechanisms (NOT runtime closure oracles) — the anchoring tier EXITED K.W3. **Born-RED:** the censused hardcoded dock offsets + the dock STRETCH at 3440×1440 pre-K.W3 (the gates BIT). Carried from L; re-verify on the M dist. P-inv-28 (5-tranche): GREEN gate + born-RED provenance IS the exit form. (`lane-28 §2c DM-12`) |
| **DM-13 CH-5/B1+B5 `"......"` empty-value crash** | A(W0)→H | **5 (A,H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED — re-run on the M dist)** | **M.WZ** (re-run) | `proof:engine-no-throw-on-play` GREEN (verified on the L tree — correctness-tier RUNTIME gate: opens the dist + clicks play on an empty-value input, asserting no throw). **Born-RED** in its origin tranche (the empty-input parse threw on play; the gate BIT); `parseCSSValueUnit("")=>{value:0}` no throw (value.js). Carried from L; re-run on the M dist. P-inv-28 (5-tranche): GREEN gate + born-RED provenance IS the exit form. (`lane-28 §2c DM-13`) |
| **DM-14 CH-6/B2 `_gen` DFA suspend crash** | H | **4 (H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED — re-run on the M dist)** | **M.WZ** (re-run) | `proof:fsm-suspend-resume-live` GREEN (verified on the L tree — correctness-tier RUNTIME gate: drives the live FSM suspend/resume over the dist). **Born-RED** in its origin tranche (the `_gen` DFA suspend threw; the gate BIT); bind-proof RAFPlayback + `useRafScene`. Carried from L; re-run on the M dist. **P-inv-28 (NEWLY 4-tranche at M):** GREEN gate + documented born-RED provenance IS the exit form (no re-BOOK). (`lane-28 §2c DM-14 / §4`) |
| **DM-15 scene-control-dfa** (deploy-block + product lag; the I-close net-new chronic) | I (post-close) | **4 (I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED — re-verify on the M dist)** | **M.WZ** (re-verify) | `proof:control-surface-single-writer` GREEN (verified on the L tree — correctness-tier RUNTIME gate: navToScene-drives the dock projection from the DFA per expected state). **Born-RED** on CI run `27228309606` (trigger='null'-under-load BEFORE the cure; the gate BIT); the observed green-CI→auto-deploy round-trip closed it terminally at J.W0. Carried from L; re-verify on the M dist. **P-inv-28 (NEWLY 4-tranche at M):** GREEN gate + documented born-RED provenance IS the exit form (no re-BOOK). (`lane-28 §2c DM-15 / §4`) |

### D — NET-NEW M obligations (gate-first BOOK / verify; not carried as a DL-L row)

| Item | Born | Chronicity | Disposition | Owning wave | The gate / evidence |
|---|---|---|---|---|---|
| **DM-17 `proof:packrat-sound` gate absent** (named in DL-L9 but NOT authored in `scripts/`) — subsumed by the DM-4 KILL | L.WZ | 1 (L→M) | **KILL-FOLD (DM-4 closes it)** | **M.W14** | `grep "proof:packrat-sound" scripts/` → ZERO (verified). The DM-4 KILL (the unsoundness off the consumed path) means the gate is never authored; any future LR-opt-in consumer authors it as its own gate-first obligation. NOT a precept violation — the gate-first discipline correctly does NOT author a gate before the feature exists. (`lane-28 §2d DM-17 / §3`) |
| **DM-18 `proof:css-parity` gate absent** (named in DL-L11; CORRECTLY deferred) — folded into M.W11 | L.WZ | 1 (L→M) | **FOLD → M.W11 (author NOW, born-RED Band-A)** | **M.W11** | `ls scripts/proof-css-parity.mjs` → not found (verified). M.W11 authors it NOW as the Band-A born-RED matrix over value.js's REAL 0.13.0 failure modes (the M.md M.W11 row reverses the L "defer until publish" — the gate is authored NOW, the IMPL closes on the coordinated publish). NOT a precept finding. (`lane-28 §2d DM-18 / §3`) |
| **DM-19 `proof:rf17-net-deletion` name ambiguity** (named in `KF-TO-GLASSUI-BB-ASKS.md §2`; the `proof:workaround-deletion` S2 arm subsumes it) | L.W9 | 1 (L→M) | **CANONICALIZE (S2 is the authoritative oracle; retire the name — KISS)** | **M.W8** | `grep "proof:rf17-net-deletion" scripts/ package.json` → ZERO (verified). The S2 arm IS the net-deletion check (`grep -rn 'pointerHandled\|onPlayPointerDown' demo/` → zero on the re-pin commit). M.W8 retires the `rf17-net-deletion` name and uses S2 directly. (`lane-28 §2d DM-19 / §7 DMM-A`) |

### The M ledger disposition tally (DEVELOPED — TERMINAL at M.WZ)

| Disposition | Rows |
|---|---|
| **HANDOFF, tripwire UN-FIRED (sibling-gated)** | DM-1 (glass-ui 4.1.0) · DM-2 (glass-ui BB GlassControlPoint, ABSOLUTE terminal) · DM-5 (the 5-arm workaround sweep) · DM-6 (coordinated grammar; the W11 gate authored NOW) |
| **FOLD-LANDED (build-in over PUBLISHED primitive — the ⚠M5 factual-error correction)** | DM-3 MorphSVG (build-in over value.js 0.13.0 `PathGeometry`; ABSOLUTE terminal) |
| **KILL (ABSOLUTE terminal; off-consumed-path, zero consumers)** | DM-4 packrat soundness (+ DM-17 subsumed) |
| **USER-DOMAIN** | DM-7 (keyframes-vue publish) · DM-16 (5.0.0 cut) · DM-20 (deploy round-trip, gated on M.W8) |
| **VERIFY-ONLY / RE-AFFIRM (the 7 carried K-chronics + DL-L12)** | DM-8 (Lighthouse) · DM-9 (specular) · DM-10 (typography) · DM-11 (mobile) · DM-12 (dock) · DM-13 (empty-value) · DM-14 (DFA suspend, NEWLY ≥4) · DM-15 (scene-control-dfa, NEWLY ≥4) |
| **FOLD / CANONICALIZE (net-new M obligations)** | DM-18 (`proof:css-parity` → M.W11) · DM-19 (`rf17-net-deletion` name → S2) |

**P-INVARIANT-28 TERMINAL DISPOSITIONS (the ≥4-tranche mandatory-exit roster).** Items at
M-chronicity ≥4 that P-invariant-28 governs:

- **DL-L7 / DM-2 GlassControlPoint (7-tranche) + DL-L8 / DM-3 MorphSVG (7-tranche) = ABSOLUTE-terminal
  exits at M** (re-BOOK CLOSED since L.WZ): DM-3 EXITS via build-in over the published `PathGeometry`
  (the ⚠M5 factual-error correction — the L "absent API" premise is wrong); DM-2 EXITS via consume on
  the glass-ui BB publish OR build-in Option B over the LIGHT `Draggable` OR a named permanent KILL —
  no 8th BOOK.
- **The 5 workaround arms (DM-5) FOLD-on-publish:** each retires arm-by-arm on its sibling publish
  consume-edge (S1/S2 on glass-ui 4.1.0 = M.W8; S7/S8/S9 on value.js O 0.14.0 = M.W9); born-RED
  kf-side, atomic delete-with-re-pin; no arm carries to a second M tranche.
- **The 3 immediate exits (no sibling publish needed):** DM-3 MorphSVG build-in (value.js `PathGeometry`
  PUBLISHED), DM-4 packrat KILL (unsound, zero consumers), DM-2 GlassControlPoint build-in Option B
  over the LIGHT `Draggable` (if BB declares out-of-scope).
- **DM-1 RF-17 (NEWLY 4-tranche):** no-workaround forbids a 5th carry; MUST consume on glass-ui 4.1.0
  (M.W8) or KILL. **DM-14 CH-6 DFA + DM-15 scene-control-dfa (NEWLY 4-tranche):** VERIFY-ONLY-TERMINATED
  — the GREEN gate + documented born-RED provenance satisfies P-inv-28 (no re-BOOK); re-verify on the M dist.

**CHRONICITY + RUNTIME-BAND CITATION CONTRACT PRESERVED.** Every row's Chronicity cell leads with its
explicit integer (DM-2/DM-3 = `7`, DM-4 = `6`, DM-11 = `7`, DM-10 = `6`, DM-9/DM-12/DM-13 = `5`,
DM-1/DM-14/DM-15 = `4`, the rest `2`/`1`) — the `proof:chronic-closure` parser reads the leading
integer unchanged. No FOLD row cites a source-shape / off-DOM gate as a RUNTIME oracle; HYGIENE /
data-model / non-gate mechanisms are named in plain prose (the contract clause holds, sharpened by
inv-M-two-axis).

**THE PATH CONSTANT IS NOT RE-POINTED HERE.** `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER`
still points at `docs/tranches/L/PROGRESS.md` (verified on this tree) — L's ledger remains the
authoritative parse target until the orchestrator's atomic final motion at M.WZ (the re-point +
non-vacuity planted-probe proof + GREEN-on-clean-ledger in ONE commit). This DEVELOPMENT board only
defines the M rows so the substrate is READY for that transition.

---

## Gate-first discipline note

Every M wave in this board **authors its born-RED gate before any source cure**, and — per
**inv-M-observable-truth** — the gate bites the REAL observable, never a proxy. The keystone lesson:
the L.W1 S4 gate tested no-throw + string round-trip while the real breach was NaN frame-times; M.W5
RE-TARGETS that clause onto the genuine NaN observable. The Band-A apparatus gates (`proof:report-all`
plants a real multi-red tree; `proof:lint-tier`/`proof:integration-tier` plant the real source-shape /
built-dist violations; `proof:gate-is-data-model`/`proof:no-animation-sleep` assert virtual-time
settle), the Band-B correctness gates (`proof:replay-equality` over the emitted `@property` + the NaN
named-selector frames; `proof:compile-replay` over the emitted `oklch(` + the surviving `opacity:`;
`proof:ingest-replay` over the engine-default cross-depth duration), the Band-C consume gates
(`proof:peer-satisfied` + `proof:workaround-deletion` born-RED kf-side, GREEN on the sibling publish;
`proof:boundary` W96; `proof:packrat-sound`; `proof:css-parity` over the live parser), the Band-D perf
gates (`proof:bench-taxonomy`; `proof:scheduler-posttask` over the real-browser INP delta;
`proof:decomposition` with the override removed), and the Band-E terminal gates
(`proof:morphsvg-consume` over the live-morph sample) are all born-RED on today's tree (the Band-C
sibling-gated arms born-RED kf-side, awaiting the sibling publish to green). **No wave starts impl
without a born-RED gate on disk that bites the GENUINE defect on the unfixed tree.** This is the
non-negotiable load-bearing law of Tranche M (`M.md §bands`; the inv-M-observable-truth keystone — the
L.W1 S4 proxy-vs-observable lesson is the structural motivation for every born-RED gate in this board).
