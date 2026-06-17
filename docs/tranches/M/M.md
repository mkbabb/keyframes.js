# Tranche M — the test-architecture transposition · constellation completion · correctness totality

> **DEVELOPMENT PHASE ONLY.** This authors `docs/tranches/M/{M.md, PROGRESS.md,
> waves/M.W0–M.WZ.md, audit/*}` + the cross-repo dispatch updates. **No
> engine/demo/library source is written.** M.W1–M.WZ implementation opens only on
> explicit authorization — exactly the L.W0 dev→impl boundary. inv-16 holds throughout.

## Provenance

Tranche L **CLOSED + committed** on `tranche-l-dev` (`529fcfd` the WZ close; `proof:all`
GREEN). L totalized the bi-directional CSS round-trip (replay-equality across `@property`
/ per-stop-composition / named-selectors / multi-color / scroll), made the gate-suite
device-honest, shipped SOTA-perf increments + the agent-authoring verb, closed the dogfood
loop, dispatched + armed the constellation, and refined the instrument-language design. The
L close also produced the **gate-apparatus audit** (`L/audit/gate-apparatus-*.md`) — the
owner-flagged 3-hour iterate-to-green diagnosed.

M is chartered by the owner (2026-06-17): **DEEPLY audit (32 agents) the original plan +
all changes made herein; consider the value.js + parse-that + glass-ui-BB tranches; devise a
path forward holding NO quick solutions / NO workarounds / idiomatic-gestalt / NO legacy /
architectural-transpositions-for-elegance-simplicity-performance; fold the chronically-deferred
+ deferred items; recap all prompts; "what of our performance numbers?"** It is grounded in a
**32-lane deep audit** (`audit/lane-01..32-*.md`) that re-verified L against ground truth and
caught what the L gates missed (the inv-ε payoff).

## The premise — what M is

L answered *"is the round-trip TOTAL, is it SOTA, is the constellation complete?"* — and
shipped, but the 32-lane re-audit finds **five open frontiers** L's gates structurally could
not see:

1. **The gate apparatus is over-engineered in its IMPLEMENTATION** (the owner's flag, now
   quantified): 142 leaf gates in `proof:all`; 72 (51%) spawn a fresh chromium per process
   with **zero warm reuse**, chained as a **serial `&&` of 141 clauses with no report-all**,
   producing an **O(N²) iterate-to-green** loop (5–6 reds × ~30-min full re-run = the 3 hours).
   264 `waitForTimeout` settle-sleeps × an 8-scene sweep are the wall-clock; eslint +
   dependency-cruiser are **absent** (the ~33 source-shape gates are lint-class checks run as
   node processes). The PRINCIPLE — runtime actuation, device-honesty, the no-silent-drop
   oracle — is **sound** and caught real bugs jsdom/grep cannot; the consolidation is the
   transposition to **one parallel three-tier vitest architecture**.

2. **The round-trip is not yet TOTAL — the L gates tested the wrong observables.** The audit
   live-probed real breaches the green gates missed: `@property` re-emits from
   `CSSKeyframesToString` but **NOT `compileToCSS`** (the compile artifact drops the block);
   named-selectors no longer throw but produce **NaN frame-times → every frame always-active**
   (`NAMED_SELECTOR_NO_TIMELINE` is typed but **never thrown** — a placeholder masquerading as
   wiring); multi-color densify **emits `oklab()` even for `oklch` space** and **drops non-color
   properties** from mixed animations while returning `eligible:true`; nested `@keyframes` can't
   find a top-level sibling `animation` rule (cross-depth linkage gap).

3. **The constellation is dispatched but UN-CONSUMED, and the deploy is BLOCKED.** value.js is
   at 0.13.0 with **zero Tranche-O items shipped** (12 kf asks open, incl. **two P0 hard-crashes
   on Baseline CSS** — CSS Nesting THROWS, bare `linear-gradient(red,blue)` THROWS); glass-ui
   is at 4.0.0 (BB's 4.1.0 unpublished), and its **F-2 peer-cycle is the SOLE deploy blocker**
   (`proof:peer-satisfied` RED → demo-smoke RED → no auto-deploy); parse-that 0.9.0 carries the
   structural-cssParser KISS violation + four bounded defects. Five kf workarounds sit PENDING
   at the consume seam (correctly STAGED, not violations — each a sibling-fix-and-re-pin).

4. **Performance shipped real wins but with un-measured claims + a doc error.** Measured: SoA
   heavy-pipeline **16.6×**, NumericAnimation Float64Array zero-alloc, spring-vector **3.85×@K=8**,
   warmEngine/granular accessors. Gaps: **no kf bench covers the value.js color-math alloc
   claims** (VJ.L1–L8); `warmEngine`'s `postTask` adoption is un-measured (probe SKIPs);
   `L.W7.md` mis-attributes value.js's "1.56×" SoA number as kf's.

5. **Chronic + deferred items reach their terminal belt, and one premise was factually wrong.**
   Two 7-tranche items (DL-L7 GlassControlPoint, DL-L8 MorphSVG) are **ABSOLUTE terminal at M**
   (P-invariant-28); three more hit ≥4-tranche; and DL-L8's L-ledger premise ("value.js
   `PathGeometry` absent at 0.13.0") is a **factual error** — it is present, so MorphSVG is
   build-in NOW. FINAL.md's "three breaking type changes" is an **inv-ε under-count** (four).

So **M is the consolidation tranche**: it transposes the test apparatus to its gestalt, totalizes
the round-trip correctness the L gates missed, consumes the constellation + unblocks the deploy,
measures the performance honestly, and terminates the chronic ledger — every move an architectural
transposition for elegance, simplicity, and performance, with NO workaround carried forward.

## The invariant set carried into M

The J/K/L spine holds (inv-L-totality, inv-L-acyclic-purity, inv-L-device-honesty, the acyclic
constellation spine, inv-16, inv-ε, no-legacy, gestalt/KISS, P-invariant-28). M adds three:

- **inv-M-one-runner (the single test harness):** there is ONE test runner (vitest), tiered
  LINT / UNIT / INTEGRATION-browser / E2E. A "gate" is a test, not a hand-rolled node process
  that re-implements launch/retry/fixtures/reporting. Report-all by default; parallel by default;
  a warm shared browser. No second runner. (M.W1–W4 · the apparatus consolidation.)
- **inv-M-observable-truth (the gate tests the REAL observable):** a gate asserts the failure
  mode that ACTUALLY breaks, verified by a live born-RED probe — never a proxy (the L.W1 S4 gate
  tested no-throw + string round-trip while the real breach was NaN frame-times). Every gate's
  born-RED witness is the genuine defect. (the keystone lesson; M.W5–W7.)
- **inv-M-two-axis (typed gate taxonomy):** a chronic/gate closes via the axis that fits — a
  RUNTIME (browser) gate for a UI/interaction chronic, a fast NODE/VITEST gate for a data-model
  chronic, a sub-second STATIC rule for a source-shape invariant. The runtime-ONLY precept is
  reformed to a typed three-axis, preserving the device-honesty win without forcing data-model
  truth through a browser. (M.W4 · the precept reform.)

## The bands + the wave map

**Gate-first / born-RED throughout** (the L law, sharpened by inv-M-observable-truth): every
wave authors its gate over the REAL breach FIRST, witnessed born-RED on today's tree, before the
cure. A wave whose gate does not bite the genuine defect is not started.

| Wave | Band | Title | Folds (lane #) | Born-RED gate / observable | Sibling dep |
|---|---|---|---|---|---|
| **M.W0** | — | Audit-fold + path forward (DEV, now) | this charter + the 32-lane evidence + ledger + recap + cross-repo dispatch | the artifacts on disk, re-runnable | — |
| **M.W1** | A | The parallel report-all runner (the O(N²) kill) | L12/L13/L14/L15: serial `&&` → a concurrency-limited node orchestrator (or `npm-run-all -p`); report-all; ports `listen(0)`, posture stateless, dist read-only | a planted multi-red tree reports ALL reds in ONE pass (today: aborts on first) | — |
| **M.W2** | A | The LINT tier (eslint + dependency-cruiser) | L13/L15/L16: the ~33 source-shape gates → static rules (max-lines, import/no-restricted-paths, no-dup, the boundary edge-scan); both tools ABSENT today | `proof:lint-tier` — one static pass subsumes the source-shape gates; born-RED (no eslint config exists) | — |
| **M.W3** | A | The @vitest/browser integration tier (shared browser) | L13/L15/L17: the 72 runtime gates → `*.browser.test.ts` over the served built dist with ONE shared chromium + ONE server; the bespoke runner retires | the integration tier runs the runtime assertions parallel + warm; per-gate cold-boot deleted; NO coverage lost (each assertion migrated verbatim) | — |
| **M.W4** | A | Synthetic-clock settle · superfluity prune · two-axis taxonomy | L16/L17/L18: the 264 `waitForTimeout` → a synthetic rAF clock (deterministic settle); the ~13 redundant clauses pruned (subsumption-cited); the runtime-ONLY precept reformed to inv-M-two-axis | `proof:gate-is-data-model` meta-gate (AXIS-2) born-RED; the settle is virtual-time not wall-clock-slept | — |
| **M.W5** | B | Compile-surface totality (the round-trip the gates missed) | L1: `@property` into `compileToCSS/compileChild` (compile-artifact gap); named-selector `parse()`-time `throw NAMED_SELECTOR_NO_TIMELINE` (the NaN-frame dead-code cure) | `proof:replay-equality` extended — compileToCSS emits `@property`; named-selector frames throw OR resolve (never NaN-always-active); born-RED on today's tree | value.js 0.13.0 (has `serializeStylesheetItem`) |
| **M.W6** | B | Multi-color densify fidelity | L2: `densifyKey` emits `oklch()` for oklch space (not always `oklab()`); non-color properties survive the densified block (the `eligible:true` corruption cured); the 1024-ramp recompute hoisted | `proof:compile-replay` extended — an oklch fixture asserts `oklch(`; a `color+opacity` fixture asserts both stops AND `opacity:` | value.js 0.13.0 (`color2`/`COLOR_SPACE_RANGES.oklch`) |
| **M.W7** | B | Ingest deepening II | L3: cross-depth sibling linkage (a shared `siblingTexts` accumulator through `walkSheet`); the live-web residual arms | `proof:ingest-replay` extended — a `@media{@keyframes}` + top-level `.foo{animation}` reconstructs replay-equal (today: engine-default) | — |
| **M.W8** | C | The glass-ui BB consume — THE deploy UNLOCK | L9/L21/L23/L26: on glass-ui 4.1.0 publish, ONE atomic commit: re-pin `~4.1.x`; delete BOTH `:aria-orientation` suppressions (SpringSidebar:43 + AnimationControls:72); delete the `pointerHandled`/`onPlayPointerDown` interim (TransportDock); `proof:peer-satisfied` GREEN → green CI → auto-deploy | `proof:workaround-deletion` S1+S2 GREEN; `proof:peer-satisfied` GREEN | **glass-ui BB 4.1.0** (peer-widen + RF-17 + SegmentedTabs aria) |
| **M.W9** | C | The value.js Tranche-O consume | L19/L24/L26: on value.js 0.14.0 publish, ONE atomic commit: re-pin `^0.14.0`; delete the `linear()` regex (utils.ts:185-196), the `FN_NAME` Symbol (utils.ts:45-57), the direct parse-that dep (utils.ts:1 + package.json); swap the inline `lerpArray` for `@mkbabb/value.js/math`; consume the 2 crash fixes | `proof:workaround-deletion` S7+S8+S9 GREEN; `proof:boundary` W96 parse-that-scan (named at L.W9 but NOT implemented — authored here, born-RED) | **value.js O 0.14.0** (VJ-L1/L2/L3 + §9/§13 crash fixes + §14 math subpath) |
| **M.W10** | C | The parse-that consume + the two-grammar consolidation | L20/L24: consume PT.M1 typesVersions (0.9.1 patch, ships first) + PT.M2 `parseSingleValue`/`parseFunctionArgs` + PT.M3 packrat (id,offset) soundness OR KILL the unsound tier + PT.M5 `permutation`; Option B — value.js owns the ONE CSS grammar, parse-that's structural `cssParser` retired | `proof:packrat-sound` (gate-first BOOK); the typesVersions-absent arm of `proof:deps-current` | **parse-that 0.9.1+ · value.js O** (coordinated) |
| **M.W11** | C | The true-CSS-parity frontier | L24: author `proof:css-parity` NOW (Band A — 8 runtime-invocation rows over value.js's REAL 0.13.0 failure modes: nesting/url/@container/@layer/@scope/bare-gradient/env/system-color); then the coordinated value.js+parse-that grammar closes it; W100 incremental-parse KILL re-affirmed (BOOK-with-tripwire) | `proof:css-parity` capability matrix born-RED (the real crashes/drops bite today) | value.js O + parse-that (coordinated grammar) |
| **M.W12** | D | Performance closure (honest measurement) | L29/L30: the bench gaps closed (numeric-SoA kf-side bench, color-interp integration bench, the sync-step bench wired); the `postTask` real-browser INP measurement; the budgeted-floor enforcement; the value.js color-math co-bench dispatched | `proof:bench-taxonomy` extended (the gap benches budgeted); the postTask probe greens on a real measurement or stays KILLed | value.js O (color-math co-bench, cross-repo) |
| **M.W13** | D | The engine-seam transposition | L11: lift the lifecycle/playback machine off the `CSSKeyframesAnimation` frame-compile facade (engine.ts 1397→~900; the 1400 override retired; group.ts compositor split co-deferred — the D.W4 born-RED HANDOFF) | `proof:decomposition` — engine.ts under ceiling WITHOUT the override; the seam is cohesive | value.js VJ-L1 flatLeaf (removes the FN_NAME stamp the split is blocked on) |
| **M.W14** | E | The terminal-belt handoff exits (P-inv-28) | L25/L28: DL-L8 MorphSVG build-in over the ALREADY-PUBLISHED value.js `PathGeometry` (the L-ledger "absent API" premise is a FACTUAL ERROR — corrected); DL-L9 packrat → KILL (unsound tier, zero consumers); DL-L7 GlassControlPoint → build-in Option B (a `DemoControlPoint` over the LIGHT `Draggable`) | `proof:morphsvg-consume` (build-in, no sibling gate); `proof:control-point-live` retired-or-built; the KILL recorded | value.js 0.13.0 (`PathGeometry` present) |
| **M.WZ** | — | Close (recap · deferred terminal · 5.0.0 prep · deploy) | the chronic ledger terminated K→L→M; `proof:changelog-5.0.0` (the FOUR breaking changes — inv-ε under-count corrected); the version cut + publishes USER-DOMAIN; the deploy round-trip RE-observed (gated on M.W8) | `proof:all` GREEN on the consolidated runner; `proof:chronic-closure` re-pointed L→M; the deploy observed | glass-ui BB (deploy) · USER-DOMAIN (cut) |

**DAG:** M.W0 (now) → **Band A** (M.W1 LEADS — the runner unblocks fast iteration for every
other wave; M.W2∥M.W3∥M.W4 follow) · **Band B** (M.W5∥M.W6∥M.W7 — kf-internal correctness, value.js-0.13.0-sufficient,
parallel) · **Band C** (M.W8 fires on glass-ui BB; M.W9 on value.js O; M.W10 coordinated;
M.W11 Band-A gate now + coordinated close — each born-RED kf-side, consume-on-publish) ·
**Band D** (M.W12 perf; M.W13 gated on value.js VJ-L1) · **Band E** (M.W14 the immediate exits;
M.WZ closes when Band A+B green, Band C consumed-or-circled, the chronic ledger terminal, and the
deploy observed on the glass-ui BB consume). **M.W1 is the keystone** — it kills the O(N²) wound
the owner flagged and makes every subsequent wave iterate in minutes, not hours.

## The precept reckoning (the audit's findings — what M cures)

The J/K/L structural spine HELD through L. The violations the 32-lane re-audit found are L-as-built
debt the gates could not see — each a named M cure, NONE carried forward:

| # | Violation (file:line) | Precept | M cure |
|---|---|---|---|
| ⚠M1 | `frame-compiler.ts:128` — `NAMED_SELECTOR_SUPERTYPE` written, never read; `NAMED_SELECTOR_NO_TIMELINE` typed (`errors.ts:46`), never thrown — a placeholder masquerading as wiring; named-selector frames → NaN always-active | no-workaround / inv-M-observable-truth | M.W5 (the parse-time throw; the gate tests the NaN observable) |
| ⚠M2 | `compile-color.ts:191` — `colorToOklabCSS` called unconditionally; `oklch` space emits `oklab()` (wrong space) | inv-L-totality (faithful round-trip) | M.W6 (dispatch on space) |
| ⚠M3 | densify drops non-color properties from mixed animations, `eligible:true` over a corrupt artifact | inv-L-totality (honest-or-refuse) | M.W6 (non-color preservation) |
| ⚠M4 | `FINAL.md:141-142` — "THREE breaking type changes" but the source documents FOUR (`Animation`→`KeyframesAnimation` `engine.ts:1192`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` `timeline.ts:163`, `ScrollTimeline`→`KeyframesScrollTimeline` `timeline.ts:209`, `presets.flip`→`flipPreset` `animations.ts:133`) | inv-ε (under-count) | M.WZ (the 5.0.0 changelog corrects it) |
| ⚠M5 | `deferred-ledger-L.md DLL-21` — "value.js `PathGeometry` absent at 0.13.0"; it is PRESENT | inv-ε (factual error) | M.W14 (MorphSVG build-in now) |
| ⚠M6 | the serial `&&` chain (141 clauses, no report-all, no parallel) — a legacy architecture with no blocking justification (ports `listen(0)`, posture stateless, dist read-only) | no-legacy / no-workaround | M.W1 (the parallel report-all runner) |
| ⚠M7 | 264 `waitForTimeout` settle-sleeps in `scripts/*.mjs` — only partially cured by L.W4 | inv-L-device-honesty | M.W4 (synthetic clock) |
| ⚠M8 | the `proof:boundary` W96 parse-that-scan named (`L.W9.md:381`) but NOT implemented | gate-completeness | M.W9 (authored on the parse-that-dep delete) |
| ⚠M9 | the W5 drag/sequence additions have ZERO vitest coverage (entirely in the node gate) | test-completeness | M.W3 (the integration tier; vitest-colocated) |

## The deferred fold + the chronic terminal

The L `PROGRESS.md §"Open deferrals"` terminal rows + the 7 carried K-chronics incremented by one
tranche become the M substrate (`proof:chronic-closure` parse target at M.WZ). The **P-invariant-28
terminal belt**: DL-L7 GlassControlPoint (7-tranche) + DL-L8 MorphSVG (7-tranche) are **ABSOLUTE
terminal at M** — they EXIT (build-in or KILL), no 8th ride; DL-L6 RF-17, CH-6 DFA, scene-control-dfa
hit ≥4-tranche and must exit. The five PENDING workaround arms FOLD arm-by-arm on their sibling
publish (M.W8 glass-ui track · M.W9 value.js track). **Three handoffs have IMMEDIATE exit paths**
(L25): MorphSVG build-in (value.js `PathGeometry` is published), packrat KILL (unsound, zero
consumers), GlassControlPoint build-in (Option B over the LIGHT `Draggable`) — none need a sibling
publish. The full per-row terminal disposition is authored into `M/PROGRESS.md §"Open deferrals"`.

## The cross-repo dispatch (the constellation consume map)

The three L dispatch docs (`KF-TO-GLASSUI-BB-ASKS.md` / `KF-TO-VALUEJS-O-ASKS.md` /
`KF-TO-PARSE-THAT-ASKS.md`) stand; M adds the **consume-edge sequencing** (the acyclic spine:
parse-that 0.9.1 → value.js O 0.14.0 → kf re-pin → glass-ui BB consume):

- **glass-ui BB 4.1.0** (the deploy unblock — HIGHEST URGENCY): widen the `@mkbabb/value.js` peer
  to admit 0.13.0+ (§3, F-2); SegmentedTabs pill-branch aria guard (§1); RF-17 W-DOCK-MORPH-FAMILY
  (§2). All three fire M.W8's atomic consume → `proof:peer-satisfied` GREEN → deploy.
- **value.js O 0.14.0:** the 2 P0 crash fixes (§9 CSS Nesting THROW, §13 bare-gradient crash —
  user-facing on Baseline CSS); VJ-L1 flatLeaf (retires FN_NAME), VJ-L2 linear()/FunctionValue
  serialize (retires the regex), VJ-L3 parseCSSSubValue (retires the parse-that dep); §14 `./math`
  subpath (retires the inline `lerpArray`); VJ.L1–L8 color-math zero-alloc (the perf frontier);
  §11 playState + §12 invalid-keyframe-decl diagnostic.
- **parse-that 0.9.1+:** typesVersions surgery (ships first, lowest-risk); the `parseSingleValue`/
  `parseFunctionArgs` value-reader API value.js's parseCSSSubValue composes; packrat (id,offset)
  soundness OR KILL; the `permutation` combinator; the structural `cssParser` retirement (Option B).

## The performance reckoning ("what of our performance numbers?")

**Measured wins (gated, reproducible):** SoA heavy-pipeline **16.6×** (10,772→179,142 hz @K=8,
J.W6); NumericAnimation **Float64Array zero-alloc** (`proof:zero-alloc` LIGHT-tier); spring-vector
**3.85×@K=8** (51,007 vs 13,233 hz — the FINAL's "3.8×" is rounded-down conservative);
warmEngine + granular load accessors (cold-page latency). **Gaps M closes (M.W12):** no kf bench
covers the value.js color-math alloc claims (VJ.L1–L8, cross-repo); `warmEngine`'s `postTask`
adoption is un-measured (probe SKIPs — real-browser INP measurement or stay KILLed); the
`bench/sync-step.bench.ts` is unwired; `L.W7.md` mis-attributes value.js's "1.56×" SoA number as
kf's (a doc correction). **The frontier (M.W12/W13):** the value.js color-math hot paths allocate
per-call (transformMat3/oklab2xyz/mixColors/gamutMapToRgbSpace) — paid on every densify/lerp; the
co-bench + the zero-alloc rewrite are the cross-repo perf transposition. **The DX number:** the
gate apparatus 3-hour iterate-to-green → single-digit minutes (M.W1–W4) is the largest measurable
performance win of the tranche.

## The KILL anti-charter (carried + extended)

L's 12 KILLs carry (VT-A/B, CE-2/3, EPF-2/5, K-T1/T3, CC-7-blanket-@starting-style, ED-6, PHYS-A,
Worker/OffscreenCanvas/GPU). M adds: **W100 incremental/streaming parse** (re-affirmed KILL — full
reparse of a 10-keyframe block is sub-ms inside the 300ms editor debounce; BOOK-with-tripwire only);
**`generate()`** (the L.W6 anti-charter — the LLM generates, kf validates+compiles). The unsound
**parse-that packrat tier** is a KILL candidate (M.W10 — zero production consumers).

## Prompt recap (all addressed — see `audit/prompt-recap-M.md`)

Every distinct owner request across the campaign (begin-the-tranche · NO-quick-solutions ·
maximal-parallelism+workflows · batches-of-3 · the crayons-by-register design verdict ·
wait-on-glass-ui · complete-in-totality · the apparatus critique [why-so-slow, why-not-in-`test/`,
what-are-proof-scripts] · consider-value.js+parse-that+glass-ui · this 32-lane M-audit ·
"what of our performance numbers") is ADDRESSED (cite the wave/commit), HANDOFF (sibling-gated),
USER-DOMAIN (the 5.0.0 cut + publishes + TASTE verdict), or FOLD-INTO-M. Zero drops. The recap
table is the audit's honesty instrument; the full per-request disposition is authored into the recap.
