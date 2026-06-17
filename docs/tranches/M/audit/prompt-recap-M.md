# Tranche M — prompt-recap-M · THE TOTAL PROMPT RECAP (A→L chain-trusted · the M session intake · the 32-lane M-audit · "what of our performance numbers")

**Lane:** `prompt-recap-M` (M.W0 audit, DOCS-ONLY). **Read-only on source/tests/gates/CI/demo** —
this workflow wrote exactly ONE file: this doc. **Tree at authoring:** branch `tranche-l-dev`
tip `4b3d2eb` (the L WZ close `529fcfd` + the M gate-apparatus seed `4b3d2eb`; the K substrate is
`master` tip `9bbc227`, `4.3.0` released at `4737ab3`, live). **Method (inv ε):** every coverage
verdict is VERIFIED against the tree, the L wave commits, the gate exit codes recorded in
`prompt-recap-L.md`, the 32-lane M-audit corpus (`audit/lane-01..32-*.md`, 15,010 lines), the
`L/FINAL.md` boundaries, and the live deploy probe. No row chain-trusted without its anchor named.
The A→L set is chain-trusted to `prompt-recap-L.md` (zero-drops, inv ε), which itself chain-trusts
`prompt-recap-k.md` → `prompt-recap-h/e/d/c`. This doc EXTENDS that spine with the M-session intake
and dispositions every NEW owner request to a terminal verdict. **Zero drops.**

The recap is held to **inv-M-observable-truth** (the gate tests the REAL observable, never a proxy)
and inv ε (cite observed oracles, no overclaim). Every row carries one terminal verdict:
**ADDRESSED** (a wave authors the cure; cite the wave/lane/commit + the gate that bites the REAL
observable) / **HANDOFF** (sibling-gated; the named sibling publish is the tripwire; a born-RED kf
gate is the kf-side instrument) / **USER-DOMAIN** (Mike Babb — the 5.0.0 cut, the npm publishes,
the TASTE verdict, the glass-ui-BB consume + deploy) / **FOLD-INTO-M** (a named M wave folds it; the
born-RED gate is authored kf-side this tranche).

**Phase note (inv-16):** M is DEVELOPMENT-PHASE-ONLY. M.W0 authors `M.md`, the 32 audit lanes, the
14 wave specs (`waves/M.W0..M.WZ.md`), `PROGRESS.md`, this recap, and `KF-CONSUME-SEQUENCING-M.md`.
**No engine/demo/library source is written.** Every "ADDRESSED" verdict below names the M wave that
WILL author the cure on explicit implementation authorization (the L.W0 dev→impl boundary, carried
forward unchanged) — the recap claims the wave is CHARTERED with a born-RED gate, NOT that the cure
has shipped. The `proof:audit-artifacts-M` clause (d) is the dev→impl boundary witness (the actual
`git diff --stat -- src/ demo/` is EMPTY).

---

## 0. The reckoning in one paragraph

A→J was a chain of partial closes corrected by the next tranche's live audit (the canonical
lesson: *a green source-shape gate is not a working product*). K answered the J-blind axes — the
cold-entry P0, the TASTE close, the CSS round-trip SUBSET — and shipped 4.3.0, live. L was chartered
by K's honest subset-status and produced the bi-directional round-trip TOTALITY (replay-equality or
honest refusal), the gate-suite device-honesty transposition, the SOTA-perf increments + the
agent-authoring verb, the dogfood-loop close, the constellation dispatch, and the design refinement
— every Band-A boundary signed born-RED → GREEN at the L close; Band B closed **entirely
un-consumed** (five consume-edges PENDING their named sibling publish). **THIS SESSION** the owner
flagged the gate apparatus as too slow ("why so slow / why not in `test/` / what are proof scripts"),
chose to finish L and charter M, ran a **32-lane deep re-audit** (15,010 lines) that re-verified L
against ground truth and caught **what L's gates structurally could not see** (the inv-ε payoff), and
asked **"what of our performance numbers?"** The audit's headline: L shipped honestly but the gates
**tested the wrong observables** in five places (the NaN-frame breach the L.W1 S4 gate missed is the
keystone). M is the **consolidation tranche** — it transposes the test apparatus to its gestalt,
totalizes the round-trip correctness the L gates missed, consumes the constellation + unblocks the
deploy, measures performance honestly, and terminates the chronic ledger. This recap dispositions
every A→L lineage row (chain-trusted) and every NEW M-session request to a terminal verdict.

**The two factual errors the 32-lane M-audit caught in L-as-built** (the inv-ε payoff, verified
against the tree — not re-asserted from the L docs that shipped them):

1. **The L gates tested PROXIES, not the real observable.** `L.W1 S4` asserted no-throw + string
   round-trip while the genuine breach was **NaN frame-times → every named-selector frame
   always-active** (`NAMED_SELECTOR_NO_TIMELINE` is typed at `errors.ts:46` but **never thrown** — a
   placeholder masquerading as wiring; `lane-01`/`M.md §premise.2`/`⚠M1`). `@property` re-emits from
   `CSSKeyframesToString` but **NOT `compileToCSS`** (the compile artifact drops the block; `lane-02`).
   Multi-color densify emits `oklab()` even for `oklch` space and **drops non-color properties** while
   returning `eligible:true` (`lane-02`/`⚠M2`/`⚠M3`). These greens are honest-LOOKING but bite the
   wrong thing — the **inv-M-observable-truth** invariant is born from exactly this lesson.

2. **DL-L8's L-ledger premise is a FACTUAL ERROR.** The L deferred ledger asserted value.js
   `PathGeometry` was "absent at 0.13.0"; it is **PRESENT** (`M.md §premise.5`/`⚠M5`/`lane-25`). So
   MorphSVG is build-in NOW (M.W14), not a sibling-gated handoff. Additionally `FINAL.md:141-142`
   says "THREE breaking type changes" but the source documents **FOUR**
   (`Animation`→`KeyframesAnimation` `engine.ts:1192`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions`
   `timeline.ts:163`, `ScrollTimeline`→`KeyframesScrollTimeline` `timeline.ts:209`,
   `presets.flip`→`flipPreset` `animations.ts:133`) — an inv-ε under-count
   (`⚠M4`/`lane-12`), corrected at M.WZ's 5.0.0 changelog.

---

## 1. THE STANDING SPINE — the recurring development + design mandate, carried verbatim into M

### 1a — "DEEPLY audit (32 agents in parallel); NO quick solutions / NO workarounds — idiomatic gestalt; architectural transpositions for elegance/simplicity/performance; NO legacy; fold ALL chronics; recap ALL prompts; dev only"

Source: `J/J.md:111-119` (the verbatim recurring mandate, A→L→M). Re-issued this session as the
32-lane M-audit charter (`M.md §provenance`, owner 2026-06-17).

| Clause | M terminal | Evidence / oracle |
|---|---|---|
| DEEPLY audit (32 agents in parallel) | **ADDRESSED — THIS SESSION** — 32 deep lanes on disk (`lane-01..32-*.md`, 15,010 lines), each anchored to `tranche-l-dev` `529fcfd`/`4b3d2eb` with file:line ground truth + re-run gate exit codes | `docs/tranches/M/audit/lane-*.md` (`ls \| wc -l` = 32); `proof:audit-artifacts-M` clause (a) asserts the set stable |
| NO quick solutions / NO workarounds — idiomatic gestalt | **ADDRESSED + NAMED RESIDUALS** — the 9 ⚠M precept findings (`M.md §precept reckoning`) each name an M cure; the apparatus consolidation is the transposition (NOT a patch); the 5 PENDING constellation workarounds are correctly STAGED (named + born-RED-gated, not violations) — each deletes atomically on its sibling consume | `M.md` ⚠M1–⚠M9; `proof:workaround-deletion` 5-PENDING; §5 below |
| Architectural transpositions for elegance/simplicity/performance | **ADDRESSED (chartered, gate-first)** — M.W1 the parallel report-all runner (kills the O(N²) wound); M.W3 the @vitest/browser shared-browser tier; M.W4 the synthetic-clock settle; M.W13 the engine-seam transposition (engine.ts 1397→~900) | `M.md §wave-map` rows M.W1/W3/W4/W13; each born-RED-gated |
| NO legacy beside its replacement | **ADDRESSED (chartered)** — M.W9 deletes the linear() regex + FN_NAME Symbol + direct parse-that dep on the value.js-O consume; M.W10 retires the structural `cssParser` (Option B); M.W13 retires the 1400 override; M.W14 KILLs the unsound packrat tier | `M.md §wave-map` M.W9/W10/W13/W14; `proof:workaround-deletion` arms |
| Fold ALL chronics to terminal or KILL (P-invariant-28) | **ADDRESSED (chartered) → FOLD-INTO-M** — `PROGRESS.md §"Open deferrals"` authored (the L `deferred-ledger-L.md` successor, chronicity +1); the ≥4-tranche terminal belt named (DL-L7/DL-L8 ABSOLUTE terminal at 7-tranche → EXIT via build-in; §8 below) | `docs/tranches/M/PROGRESS.md`; `proof:chronic-closure` re-point L→M at M.WZ; `lane-28` |
| Recap ALL prompts (zero drops) | **ADDRESSED — THIS DOC** — `prompt-recap-L.md` zero-drops chain-trusted; this lane extends it to the M session | this document |
| Dev only (no source) | **HONORED** — M.W0 is DOCS-ONLY; the dev→impl boundary is the REAL observable of `proof:audit-artifacts-M` clause (d): `git diff --stat -- src/ demo/` is EMPTY; inv-16 holds | `M.W0.md §born-RED gate clause (d)`; this lane wrote only this file |

**M implication:** the standing mandate carries forward unchanged. The 32-lane audit IS its first M
motion; the 9 ⚠M precept cures are the second (§5).

### 1b — "Run a frontend design audit; design hierarchy; glass·grid·math·type with colorful audacious pops; glass-ui idioms; find gaps"

Source: `J/J.md:123-130`, recurring each tranche.

| Status at M-open | Evidence |
|---|---|
| **ADDRESSED through K (deployed) + L.W11 (refined); USER-DOMAIN-PENDING TASTE** | K TASTE-approved ("meets the bar" 2026-06-16); F1–F6 deployed on 4.3.0; L.W11 design refinement (the instrument language, the crayons-by-register gate) LANDED with `proof:crayon-preserved`+`proof:design-refinement` GREEN (`4686aa4`). The L.W11 before/after TASTE verdict remains **USER-DOMAIN** (closes only on Mike Babb's "meets the bar"; packet on disk `docs/frontend-design/taste-packets/l-w11/`). M does NOT re-open taste — the design band is the design-instrument egg suite (closed) + the USER-DOMAIN verdict (pending). The dock-flicker residual is dispatched to glass-ui BB (`KF-TO-GLASSUI-BB-ASKS.md`). | `prompt-recap-L.md §1b/§8e`; `4686aa4`; the verdict pending USER-DOMAIN |

---

## 2. THE A→L LINEAGE — chain-trusted to prompt-recap-L.md's zero-drops close

The A→K per-tranche lineage, the U1–U8 edicts, the cold-path P0 seeds, the U-K1..K20 live register,
the F1–F6 findings, and the FULL L-intake (Q1 round-trip / Q2 SOTA / Q3 constellation / Q4 CSS-parity
/ gate-suite blind-spots / completion-lane net-new) are ALL dispositioned to terminal verdicts in
`prompt-recap-L.md` (§1–§11, TOTALS: zero drops) — itself chain-trusting `prompt-recap-k.md` (A→K
zero drops). This lane does **NOT re-litigate them.** It verifies the close held (the live deploy
probe — `keyframes.babb.dev` serves `index-43okVJtx.js`, re-observed at M.W0 authoring — is the proof
every Band-A L row reached the live product) and carries forward only the rows the 32-lane M-audit
**RE-OPENED, CORRECTED, or NET-NEW raised**. The A→L totals stand: **zero drops.**

**The rows the M-audit re-opens or corrects** (each becomes a named M motion below, NOT a drop):

| A→L row | L close state | M re-open / correction | M home |
|---|---|---|---|
| ⚠17 named selectors "ingested without throwing" (`prompt-recap-L.md §8a`, ADDRESSED-with-gate) | claimed GREEN | **CORRECTED** — the cure produced NaN frame-times (always-active); `NAMED_SELECTOR_NO_TIMELINE` typed, never thrown. The L gate tested no-throw (proxy), not the NaN observable | M.W5 (parse-time throw; gate bites the NaN observable) |
| ⚠15 @property "re-emits backward" (`§8a`, ADDRESSED-with-gate) | claimed GREEN | **PARTIAL** — emits from `CSSKeyframesToString` but NOT `compileToCSS` (the compile artifact drops the block) | M.W5 (into `compileToCSS/compileChild`) |
| ⚠28/⚠29 multi-color "ships-or-refuses on ΔE-ε" (`§8a`, ADDRESSED-with-gate) | claimed GREEN | **CORRECTED** — densify emits `oklab()` even for oklch space + drops non-color props while `eligible:true` | M.W6 (dispatch on space; non-color preservation) |
| nested @keyframes walk (L.W3, `§8a` ADDRESSED-with-gate) | claimed GREEN | **PARTIAL** — a nested `@keyframes` cannot find a top-level sibling `animation` rule (cross-depth linkage gap) | M.W7 (shared `siblingTexts` accumulator) |
| DL-L8 MorphSVG "value.js PathGeometry absent at 0.13.0" | HANDOFF (sibling-gated) | **FACTUAL ERROR** — `PathGeometry` is PRESENT at 0.13.0; build-in is unblocked NOW | M.W14 (build-in, no sibling gate) |
| FINAL.md "THREE breaking type changes" | inv-ε close | **UNDER-COUNT** — FOUR (the `ScrollTimeline`→`KeyframesScrollTimeline` class rename `timeline.ts:209` + `presets.flip`→`flipPreset` `animations.ts:133` add two beyond `Animation`/`ScrollTimelineOptions`) | M.WZ (5.0.0 changelog corrects it) |
| the gate apparatus (L.W4 settle primitive cured `openControlsPanel` only) | ADDRESSED-with-gate (the settle PRIMITIVE) | **RE-OPENED as the owner's flag** — the broader corpus is still serial `&&` of 141 clauses, 264 `waitForTimeout`, 72 cold chromium boots, O(N²) iterate-to-green | M.W1–M.W4 (the consolidation) |

---

## 3. THE M SESSION INTAKE — every NEW owner request this session, to a terminal verdict

This is the binding M-SESSION ledger. Every distinct owner request issued THIS session (the L
finish + the apparatus critique + the finish-L+charter-M choice + the 32-lane M-audit + the perf
question) reaches a terminal verdict. **Zero drops.**

### 3a — the apparatus critique: "why so slow / why isn't this in `test/` / what are these proof scripts"

> *(the owner's flag on the gate apparatus — why the iterate-to-green takes hours, why the gates
> aren't vitest tests in `test/`, what the `scripts/proof-*.mjs` node processes are.)*

This is the **keystone M-session request** — it is the genesis of Band A (M.W1–M.W4) and the
`inv-M-one-runner` / `inv-M-two-axis` invariants. Each facet of the critique reaches a terminal
verdict, each anchored to the lane that quantified it.

| Facet of the critique | M terminal | Evidence / oracle |
|---|---|---|
| **"why so slow?"** (the ~3-hour iterate-to-green) | **ADDRESSED (chartered, FOLD-INTO-M)** — quantified: `proof:all` = 142 leaf gates; 72 (51%) spawn a fresh chromium with **zero warm reuse**; chained as a **serial `&&` of 141 clauses with NO report-all** → an **O(N²) iterate-to-green** (5–6 reds × ~30-min full re-run = the 3 hours). 264 `waitForTimeout` settle-sleeps × an 8-scene sweep are the wall-clock. **M.W1** (the keystone) authors the concurrency-limited report-all runner; born-RED: a planted multi-red tree reports ALL reds in ONE pass (today: aborts on first) | `lane-13`/`lane-14`/`lane-15`; `M.md §wave-map` M.W1; `M.md §premise.1` |
| **"why isn't this in `test/`?"** (the two-harness split) | **ADDRESSED (chartered) → the `inv-M-one-runner` invariant** — there is ONE runner (vitest), tiered LINT/UNIT/INTEGRATION-browser/E2E. A "gate" is a test, NOT a hand-rolled node process that re-implements launch/retry/fixtures/reporting. **M.W3** migrates the 72 runtime gates to `*.browser.test.ts` over the served built dist with ONE shared chromium + ONE server (NO coverage lost — each assertion migrated verbatim); the bespoke runner retires. The ⚠M9 finding (W5 drag/sequence additions have ZERO vitest coverage — entirely in the node gate) is cured here | `M.md §invariant set` (inv-M-one-runner); `M.md §wave-map` M.W3; `⚠M9`; `lane-15`/`lane-17` |
| **"what are these proof scripts?"** (the ~33 source-shape lint-class gates run as node processes) | **ADDRESSED (chartered) → the LINT tier + `inv-M-two-axis`** — the ~33 source-shape gates are lint-class checks run as node processes; eslint + dependency-cruiser are **ABSENT today**. **M.W2** authors the LINT tier (one static parse-once pass subsuming the source-shape gates; born-RED — no eslint config exists). The runtime-ONLY precept is reformed to **inv-M-two-axis** (a typed three-axis taxonomy: RUNTIME-browser / NODE-vitest / sub-second STATIC) at **M.W4** — preserving the device-honesty win without forcing data-model truth through a browser | `M.md §invariant set` (inv-M-two-axis); `M.md §wave-map` M.W2/M.W4; `lane-16`/`lane-18` |
| the PRINCIPLE-vs-IMPLEMENTATION distinction (is the apparatus wrong?) | **ADDRESSED (recorded honestly)** — the PRINCIPLE (runtime actuation, device-honesty, the no-silent-drop oracle) is **sound** and caught real bugs jsdom/grep cannot (the I-era blank-out, the NaN-frame breach). The contrivance is the IMPLEMENTATION (the serial runner, the cold boots, the absent lint tier). M consolidates the implementation; it does NOT discard the principle | `M.md §premise.1`; `lane-13 §verdict`; `M.W3` carries the served-dist `page.goto` invariant forward |
| the DX number (the largest measurable perf win of the tranche) | **ADDRESSED (chartered) + RECORD** — the gate-apparatus 3-hour iterate-to-green → **single-digit minutes** (M.W1–W4) is named as the largest measurable performance win of the tranche; the claim is the M.W1 born-RED report-all gate + the M.W3 shared-browser amortization, NOT a stored number yet | `M.md §performance reckoning`; the cure is gate-cited at M.W1–W4 impl |

### 3b — "finish L + charter M" (the finish-L-then-audit-M choice)

> *(the owner's choice this session: finish/close L, then deeply audit + charter M.)*

| Sub-directive | M terminal | Evidence / oracle |
|---|---|---|
| Finish + close L (the WZ close) | **ADDRESSED** — L CLOSED + committed on `tranche-l-dev`: `529fcfd` the WZ close; `FINAL.md` held to inv ε; `proof:chronic-closure` re-pointed K→L; the deferred ledger TERMINATED | `529fcfd`; `prompt-recap-L.md §11`; `L/FINAL.md` |
| Charter M (the consolidation tranche) | **ADDRESSED** — `M.md` on disk (the five bands, the 14-wave DAG with M.W1 the keystone, the three M-born invariants, the 9 ⚠M precept reckoning, the KILL anti-charter); the 14 wave specs `waves/M.W0..M.WZ.md` on disk | `docs/tranches/M/M.md`; `docs/tranches/M/waves/`; `proof:audit-artifacts-M` clauses (a)/(b) |
| Dev-only (no engine/demo/library source) | **HONORED** — M is DEVELOPMENT-PHASE-ONLY; the dev→impl boundary is the REAL observable of `proof:audit-artifacts-M` clause (d) (the `git diff --stat -- src/ demo/` is EMPTY); M.W1–M.W14 impl opens only on explicit authorization | `M.W0.md §born-RED gate clause (d)`; inv-16 |

### 3c — "consider the value.js + parse-that + glass-ui-BB tranches"

> *(consider the sibling tranches in flight when devising the path forward.)*

| Sibling tranche | M terminal | Evidence / oracle |
|---|---|---|
| **glass-ui BB** (4.0.0 published; BB 4.1.0 unpublished) | **HANDOFF (sibling-gated) → M.W8 fires on publish** — its **F-2 peer-cycle is the SOLE deploy blocker** (`proof:peer-satisfied` RED → demo-smoke RED → no auto-deploy). M.W8's ONE atomic consume (re-pin `~4.1.x`; delete BOTH aria suppressions + the `pointerHandled` interim) fires on the BB 4.1.0 publish (peer-widen §3 + RF-17 §2 + SegmentedTabs aria §1) | `lane-21`/`lane-23`; `M.md §wave-map` M.W8; `proof:peer-satisfied` born-RED; tripwire: glass-ui BB 4.1.0 |
| **value.js Tranche O** (0.13.0 published; O/0.14.0 unpublished) | **HANDOFF (sibling-gated) → M.W9 fires on publish** — **zero Tranche-O items shipped**, incl. **two P0 hard-crashes on Baseline CSS** (CSS Nesting THROWS, bare `linear-gradient(red,blue)` THROWS). M.W9's atomic consume (re-pin `^0.14.0`; delete the linear() regex + FN_NAME Symbol + direct parse-that dep; swap inline `lerpArray` for `@mkbabb/value.js/math`; consume the 2 crash fixes) fires on the O 0.14.0 publish | `lane-19`/`lane-24`; `M.md §wave-map` M.W9; `proof:workaround-deletion` S7/S8/S9 born-RED; tripwire: value.js O 0.14.0 |
| **parse-that** (0.9.0 published) | **HANDOFF (sibling-gated) → M.W10 fires on publish (coordinated)** — carries the structural-`cssParser` KISS violation + four bounded defects. M.W10 consumes PT.M1 typesVersions (0.9.1, ships first) + PT.M2 reader API + PT.M3 packrat soundness OR KILL + PT.M5 `permutation`; Option B — value.js owns the ONE CSS grammar, parse-that's structural `cssParser` retired | `lane-20`/`lane-24`; `M.md §wave-map` M.W10; `proof:packrat-sound` born-RED; tripwire: parse-that 0.9.1+ |
| the acyclic spine (the consume-edge ordering) | **ADDRESSED (chartered)** — `KF-CONSUME-SEQUENCING-M.md` authored: **parse-that 0.9.1 → value.js O 0.14.0 → kf re-pin → glass-ui BB consume** (no cycle); per edge it names the born-RED kf-side gate that fires on consume | `docs/tranches/M/KF-CONSUME-SEQUENCING-M.md`; `M.W0.md §S5`; `lane-22` |
| the five PENDING kf workarounds at the consume seam | **HANDOFF (FOLD-on-consume)** — correctly STAGED (named + born-RED-gated, NOT violations); each deletes atomically on its sibling consume (S1/S2 glass-ui BB · S7/S8/S9 value.js O) | `proof:workaround-deletion` 5-PENDING; `lane-26`; §5 below |

### 3d — "the 32-lane M-audit" (THIS lane's parent directive)

> *(DEEPLY audit, 32 agents, the original plan + all changes herein; devise the path forward; recap.)*

| Sub-directive | M terminal | Evidence / oracle |
|---|---|---|
| The 32-lane parallel deep audit | **ADDRESSED** — 32 lanes on disk (`lane-01..32-*.md`, 15,010 lines), each file:line-anchored to `tranche-l-dev` `529fcfd`/`4b3d2eb` | `docs/tranches/M/audit/lane-*.md`; `proof:audit-artifacts-M` clause (a) |
| Devise the path forward (the M charter + wave map) | **ADDRESSED** — `M.md` (five bands, 14-wave DAG, M.W1 keystone, 9 ⚠M precept reckoning, the three M-born invariants, the KILL anti-charter) | `docs/tranches/M/M.md`; `proof:audit-artifacts-M` clause (b) |
| The wave specs (executable depth, born-RED per inv-M-observable-truth) | **ADDRESSED** — `waves/M.W0.md..M.WZ.md` on disk; each authors its gate over the REAL breach FIRST, witnessed born-RED | `docs/tranches/M/waves/` (16 files: W0–W14 + WZ) |
| The consolidated prompt-recap (this) | **ADDRESSED — THIS DOC** | this document |
| The chronic-ledger substrate + consume-edge sequencing | **ADDRESSED** — `PROGRESS.md §"Open deferrals"` (the L successor, chronicity +1) + `KF-CONSUME-SEQUENCING-M.md` on disk | `proof:audit-artifacts-M` clause (c) |
| Dev-only (no engine/demo/library source) | **HONORED** — this lane wrote ONLY this file | `M.W0.md §S7 clause (d)`; inv ε footer |

### 3e — "what of our performance numbers?" (the explicit perf question)

> *(the owner's direct question — what is the state of our measured performance.)*

**ADDRESSED — the full honest reckoning is §8 below.** This is an EXPLICIT recap row, not folded
silently. The measured wins are gated + reproducible; the gaps are named with their M home (M.W12);
the doc error (L.W7.md's 1.56× mis-attribution) is named for correction. See §8 for the per-number
table.

---

## 4. THE 32-LANE M-AUDIT FRONTIERS — the five open frontiers, each to a named M band

The 32-lane audit surfaced five open frontiers L's gates structurally could not see (`M.md §premise`).
Each is folded into a named M band with born-RED gates. **No frontier un-homed.**

| Frontier (lane) | M band · wave | Born-RED gate / the REAL observable |
|---|---|---|
| 1. The gate apparatus over-engineered in IMPLEMENTATION (`lane-13/14/15`) | **Band A — M.W1∥W2∥W3∥W4** | M.W1: a planted multi-red tree reports ALL reds in ONE pass (today: aborts on first); M.W2 `proof:lint-tier`; M.W3 the integration tier runs parallel+warm (per-gate cold-boot deleted); M.W4 `proof:gate-is-data-model` (AXIS-2) + the synthetic clock |
| 2. The round-trip not yet TOTAL — L gates tested the wrong observables (`lane-01/02/03`) | **Band B — M.W5∥W6∥W7** | M.W5: `compileToCSS` emits `@property` + named-selector frames throw OR resolve (never NaN-always-active); M.W6: an oklch fixture asserts `oklch(` + a color+opacity fixture asserts both stops AND `opacity:`; M.W7: a `@media{@keyframes}`+top-level `.foo{animation}` reconstructs replay-equal |
| 3. The constellation dispatched but UN-CONSUMED, the deploy BLOCKED (`lane-09/19..26`) | **Band C — M.W8∥W9∥W10∥W11** | M.W8: `proof:workaround-deletion` S1+S2 GREEN + `proof:peer-satisfied` GREEN; M.W9: S7+S8+S9 GREEN + `proof:boundary` W96 parse-that-scan; M.W10: `proof:packrat-sound`; M.W11: `proof:css-parity` capability matrix born-RED |
| 4. Performance — real wins, un-measured claims + a doc error (`lane-29/30`) | **Band D — M.W12** | `proof:bench-taxonomy` extended (the gap benches budgeted); the postTask probe greens on a real-browser INP measurement or stays KILLed |
| 5. Chronic + deferred items reach their terminal belt; one premise factually wrong (`lane-25/28`) | **Band E — M.W14 + M.WZ** | `proof:morphsvg-consume` (build-in, no sibling gate, on the PRESENT `PathGeometry`); `proof:control-point-live` retired-or-built; the packrat KILL recorded; M.WZ `proof:changelog-5.0.0` (the FOUR breaking changes) |

---

## 5. THE PRECEPT VIOLATIONS — the 9 ⚠M findings (L-as-built debt the gates could not see), each a named M cure

The J/K/L structural spine HELD through L. The 32-lane re-audit found 9 ⚠M rows — L-as-built debt
the gates could not see — each a named M cure, NONE carried forward (`M.md §precept reckoning`).

| ⚠M | Violation (file:line) | Precept | M cure |
|---|---|---|---|
| ⚠M1 | `frame-compiler.ts:128` `NAMED_SELECTOR_SUPERTYPE` written-never-read; `NAMED_SELECTOR_NO_TIMELINE` typed (`errors.ts:46`) never thrown — a placeholder masquerading as wiring; named-selector frames → NaN always-active | no-workaround / inv-M-observable-truth | **M.W5** (the parse-time throw; the gate tests the NaN observable) |
| ⚠M2 | `compile-color.ts:191` `colorToOklabCSS` called unconditionally; `oklch` space emits `oklab()` (wrong space) | inv-L-totality | **M.W6** (dispatch on space) |
| ⚠M3 | densify drops non-color properties from mixed animations, `eligible:true` over a corrupt artifact | inv-L-totality (honest-or-refuse) | **M.W6** (non-color preservation) |
| ⚠M4 | `FINAL.md:141-142` "THREE breaking type changes" but the source documents FOUR | inv-ε (under-count) | **M.WZ** (the 5.0.0 changelog corrects it) |
| ⚠M5 | `deferred-ledger-L.md` "value.js `PathGeometry` absent at 0.13.0"; it is PRESENT | inv-ε (factual error) | **M.W14** (MorphSVG build-in now) |
| ⚠M6 | the serial `&&` chain (141 clauses, no report-all, no parallel) — legacy architecture, no blocking justification | no-legacy / no-workaround | **M.W1** (the parallel report-all runner) |
| ⚠M7 | 264 `waitForTimeout` settle-sleeps in `scripts/*.mjs` — only partially cured by L.W4 | inv-L-device-honesty | **M.W4** (synthetic clock) |
| ⚠M8 | `proof:boundary` W96 parse-that-scan named (`L.W9.md:381`) but NOT implemented | gate-completeness | **M.W9** (authored on the parse-that-dep delete) |
| ⚠M9 | the W5 drag/sequence additions have ZERO vitest coverage (entirely in the node gate) | test-completeness | **M.W3** (the integration tier; vitest-colocated) |

**Net:** 9 ⚠M, all FOLD-INTO-M (each a named cure with a born-RED gate). Two are inv-ε corrections
of L docs (⚠M4 under-count, ⚠M5 factual error) — recorded honestly, not re-asserted. **Zero carried
bare.**

---

## 6. THE KILL ANTI-CHARTER — carried + extended, non-re-litigable

L's 12 KILLs carry into M (VT-A/B, CE-2/3, EPF-2/5, K-T1/T3, CC-7-blanket-@starting-style, ED-6,
PHYS-A, Worker/OffscreenCanvas/GPU). M adds:

| KILL | Status at M |
|---|---|
| L's 12 KILLs (incl. GEN-1 generate-from-intent, L-born) | **KILL — carried, non-re-litigable** (`M.md §KILL anti-charter`; `grep -c "KILL" M.md` ≥ 12) |
| **W100 incremental/streaming parse** | **KILL — re-affirmed** (BOOK-with-tripwire only): full reparse of a 10-keyframe block is sub-ms inside the 300ms editor debounce |
| **`generate()`** | **KILL — re-affirmed** (the L.W6 anti-charter — the LLM generates, kf validates+compiles) |
| **parse-that packrat tier** | **KILL candidate — M.W10/M.W14** (unsound, zero production consumers; the (id,offset) soundness OR KILL decision) |

**RECORD permanent; non-re-litigable in M.**

---

## 7. THE PERFORMANCE RECKONING — "what of our performance numbers?" (the explicit owner question)

Source: `M.md §performance reckoning`; `lane-29-perf-numbers.md`; `lane-30-engine-colormath-perf.md`.
**Every number is verified against the lane's live-command ground truth — not re-asserted from a
prior doc.**

### 7a — Measured wins (gated, reproducible)

| Win | Measured number | Oracle (verified) |
|---|---|---|
| SoA heavy-pipeline interp (J.W6) | **16.6× faster @K=8 full-pipeline** (10,772→179,142 hz; 94.0% reduction); 14.6× dispatch-only | `lane-29:78/297`; `J.W6-impl.md:298/327` |
| NumericAnimation Float64Array zero-alloc | **zero-alloc** (LIGHT-tier sentinel) | `proof:zero-alloc` / `test/zero-alloc.test.ts` 7/7 (`d858044`); `lane-29` |
| spring-vector ADOPT | **3.85×@K=8** (ratio 3.854447, threshold 1.2×) — the FINAL's "3.8×" is rounded-down conservative | `bench/spring-tick.bench.ts`; `proof:spring-vector` (`d858044`); `lane-29:95/100` |
| warmEngine + granular load accessors | cold-page latency (budgeted `floorHz:1000`, absolute not ratio) | `bench/interp-buffer.bench.ts` warmEngine arm; `lane-29` |

### 7b — Gaps M closes (M.W12 — chartered, honest)

| Gap | M terminal | Oracle |
|---|---|---|
| No kf bench covers the value.js color-math alloc claims (VJ.L1–L8) | **ADDRESSED (chartered) + HANDOFF (cross-repo co-bench)** — every oklab playback frame pays per-call alloc in `transformMat3`/`oklab2xyz`/`mixColors`/`gamutMapToRgbSpace`; M.W12 closes the kf-side color-interp integration bench; the zero-alloc rewrite is the value.js-O co-bench | `M.md §wave-map` M.W12; `proof:bench-taxonomy` extended; `lane-30`; tripwire: value.js O color-math |
| `warmEngine`'s `postTask` adoption un-measured (probe SKIPs) | **ADDRESSED (chartered)** — M.W12 the real-browser INP measurement; the postTask probe greens on a real measurement OR stays KILLed | `M.md §wave-map` M.W12 |
| `bench/sync-step.bench.ts` unwired | **ADDRESSED (chartered)** — wired into the taxonomy at M.W12 | `M.md §wave-map` M.W12; `lane-29` |
| `L.W7.md:24` mis-attributes value.js's "1.56× → 4.25×" SoA number as kf's | **ADDRESSED (doc correction)** — the G-era "1.56×–4.25×" numbers are value.js's own microbench at small K, NOT kf's; the kf-side number is the J.W6 16.6×@K=8 | `lane-29:72/82/219`; the correction is recorded here + at M.W12 |

### 7c — The DX number (the largest measurable perf win of the tranche)

The gate-apparatus **3-hour iterate-to-green → single-digit minutes** (M.W1–W4) is named the
largest measurable performance win of the tranche (`M.md §performance reckoning`). The cure is the
M.W1 born-RED report-all gate + the M.W3 shared-browser amortization — a chartered claim, gate-cited
at impl, NOT a stored number yet.

**Honest net:** the measured wins (16.6×, zero-alloc, 3.85×) are gated + reproducible; the gaps are
named with their M home (M.W12); the doc error is named for correction. The value.js color-math
alloc is a STRUCTURAL audit, NOT yet a kf-side benchmark reading — M.W12 measures it before any
VJ-L1..L8 is filed as a kf-side win.

---

## 8. THE DEFERRED FOLD + THE CHRONIC TERMINAL (P-invariant-28)

The L `PROGRESS.md §"Open deferrals"` terminal rows + the carried chronics incremented by one
tranche become the M substrate (`PROGRESS.md §"Open deferrals"`; `proof:chronic-closure` parse
target re-pointed L→M at M.WZ). The **P-invariant-28 terminal belt** at M:

| Chronic (chronicity at M) | M terminal | Oracle / tripwire |
|---|---|---|
| **DL-L7 GlassControlPoint** (E→M = 7-tranche, **ABSOLUTE terminal**) | **FOLD-INTO-M (build-in, no sibling publish)** — Option B: a `DemoControlPoint` over the LIGHT `Draggable`; no 8th ride | **M.W14**; `proof:control-point-live` retired-or-built; `lane-25` |
| **DL-L8 MorphSVG** (C→M = 7-tranche, **ABSOLUTE terminal**) | **FOLD-INTO-M (build-in NOW)** — the L-ledger "PathGeometry absent" premise is a FACTUAL ERROR (⚠M5); `PathGeometry` is PRESENT at value.js 0.13.0; build-in is unblocked | **M.W14**; `proof:morphsvg-consume` (build-in, no sibling gate); `lane-25` |
| **DL-L6 RF-17** (I,J,K,L→M = 4-tranche) | **HANDOFF (sibling-gated, must exit)** — deletes the `pointerHandled`/`onPlayPointerDown` interim on the glass-ui BB 4.1.0 W-DOCK-MORPH-FAMILY consume | **M.W8**; `proof:workaround-deletion`; tripwire: glass-ui BB 4.1.0 |
| **DL-L9 packrat** (E→M = 6-tranche) | **FOLD-INTO-M (KILL)** — unsound tier, zero production consumers; the (id,offset) soundness OR KILL decision resolves to KILL | **M.W10/M.W14**; `proof:packrat-sound`; `lane-28` |
| **CH-6 DFA · scene-control-dfa** (≥4-tranche) | **FOLD-INTO-M (must exit)** — named in `PROGRESS.md`; exit via the M two-axis taxonomy | `PROGRESS.md §"Open deferrals"`; `lane-28` |
| the 5 PENDING workaround arms | **HANDOFF (FOLD-on-consume)** — fold arm-by-arm on the sibling publish (S1/S2 glass-ui BB track M.W8 · S7/S8/S9 value.js O track M.W9) | `proof:workaround-deletion` 5-PENDING; §5/§3c |

**Net:** the two 7-tranche ABSOLUTE-terminal items (DL-L7/DL-L8) EXIT via build-in (no sibling
publish — three handoffs have IMMEDIATE exit paths: MorphSVG build-in, packrat KILL, GlassControlPoint
build-in over the LIGHT `Draggable`); the ≥4-tranche riders exit via consume/KILL; the 5 PENDING
arms FOLD on their sibling publish. The full per-row disposition is authored into
`docs/tranches/M/PROGRESS.md §"Open deferrals"`.

---

## 9. THE CROSS-REPO ASKS + THE CONSUME-EDGE SEQUENCING

The three L dispatch docs **stand unchanged** (the ground-truth ask surface). M adds the
consume-edge sequencing addendum (`KF-CONSUME-SEQUENCING-M.md` — the acyclic spine: **parse-that
0.9.1 → value.js O 0.14.0 → kf re-pin → glass-ui BB consume**).

| Dispatch | Status at M-open | Key asks / consume gate |
|---|---|---|
| `KF-TO-GLASSUI-BB-ASKS.md` (FILED; BB tranche in flight) | **HANDOFF — M.W8 fires on publish** | peer-widen §3 (F-2 deploy unblock, HIGHEST URGENCY) · SegmentedTabs pill-aria §1 · RF-17 §2 → `proof:peer-satisfied` GREEN → deploy; gate: `proof:workaround-deletion` S1+S2 |
| `KF-TO-VALUEJS-O-ASKS.md` (FILED; 12 kf asks, 2 P0 crashes) | **HANDOFF — M.W9 fires on 0.14.0** | the 2 P0 crash fixes (§9 nesting THROW, §13 bare-gradient crash) · VJ-L1 flatLeaf · VJ-L2 linear()-serialize · VJ-L3 parseCSSSubValue · §14 `./math` subpath · VJ.L1–L8 color-math zero-alloc; gate: S7+S8+S9 + `proof:boundary` W96 |
| `KF-TO-PARSE-THAT-ASKS.md` (FILED; 0.9.0) | **HANDOFF — M.W10 fires on 0.9.1+ (coordinated)** | PT.M1 typesVersions (0.9.1, ships first) · PT.M2 reader API · PT.M3 packrat soundness OR KILL · PT.M5 `permutation` · the structural `cssParser` retirement (Option B); gate: `proof:packrat-sound` |
| `KF-CONSUME-SEQUENCING-M.md` (NEW, M.W0) | **ADDRESSED** — the acyclic spine ordering + per-edge born-RED kf gate | `M.W0.md §S5`; the no-cycle order asserted |

**The two value.js P0 crashes (CSS Nesting THROW, bare-gradient crash) are the highest-priority
value.js-O items** — runtime crashes on Baseline-stable CSS, user-facing via `parseCSSValue`. M.W11's
`proof:css-parity` capability matrix is born-RED over these REAL crashes on today's tree.

---

## 10. THE USER-DOMAIN FINALE — named, not asserted done

The close's final motions are USER-DOMAIN (Mike Babb) or sibling-gated. **None is asserted done by
this DOCS-ONLY recap.**

| Finale motion | Terminal shape | Honest state |
|---|---|---|
| Version cut **5.0.0** (the FOUR breaking changes — inv-ε under-count corrected) | **USER-DOMAIN** — the tree carries 4.3.0; the cut is Mike Babb's | `package.json:version 4.3.0` (verified); M.WZ `proof:changelog-5.0.0`; `⚠M4` |
| npm publishes (kf 5.0.0 + `@mkbabb/keyframes-vue` 0.1.0) | **USER-DOMAIN** — `npm publish` is the user's hand | `proof:keyframes-vue-published` clause (b) RED until then |
| TASTE verdict (L.W11 packet) | **USER-DOMAIN-PENDING** — closes only on Mike Babb's "meets the bar" | `docs/frontend-design/taste-packets/l-w11/`; NOT self-certified |
| glass-ui BB consume + the deploy round-trip RE-observed | **HANDOFF (sibling-gated) → M.WZ (gated on M.W8)** — the deploy RE-observation is M.WZ's clause; the live origin currently serves `index-43okVJtx.js` (the K/L chunk — unchanged because no M source has shipped) | live probe at M.W0 authoring: `keyframes.babb.dev` → `index-43okVJtx.js`; master `9bbc227` green; tripwire: glass-ui BB consume |
| `proof:all` GREEN on the consolidated runner | **HANDOFF (M.WZ close-impl)** — closes when Band A+B green, Band C consumed-or-circled, the chronic ledger terminal | `M.md §wave-map` M.WZ; `proof:chronic-closure` re-pointed L→M |

---

## inv ε / inv-16 compliance

This lane wrote ONLY `docs/tranches/M/audit/prompt-recap-M.md`. ZERO source/test/gate/CI/demo edits
(the dev→impl boundary is the REAL observable of `proof:audit-artifacts-M` clause (d): `git diff
--stat -- src/ demo/` is EMPTY). Every status verified against the tree at `tranche-l-dev` tip
`4b3d2eb`: `package.json` (kf `4.3.0`; value.js `^0.13.0`; parse-that `^0.9.0`; glass-ui `~4.0.0` at
`:215`); the L wave commits + the L close (`529fcfd`); the 32-lane M-audit corpus
(`audit/lane-01..32-*.md`, 15,010 lines); the M charter + wave specs (`M.md`; `waves/M.W0..M.WZ.md`);
the deploy live probe (`keyframes.babb.dev` → `index-43okVJtx.js`, master `9bbc227`). The A→L set is
chain-trusted to `prompt-recap-L.md` (zero-drops, inv ε); the two factual-error corrections (the
NaN-frame proxy-test breach, the `PathGeometry`-present premise) are sourced directly from the lane
corpus + the tree — NOT re-asserted from the L docs that shipped them.

**Zero drops. Every distinct owner request A→L (chain-trusted), every NEW M-session edict (the
apparatus critique · finish-L+charter-M · consider-the-siblings · the 32-lane M-audit · "what of our
performance numbers"), every ⚠M precept finding, every 32-lane frontier, every deferred-ledger row,
every Band-B/C dispatch, and every close-finale motion reaches a terminal verdict: ADDRESSED
(wave/lane/commit + a born-RED gate over the REAL observable) / HANDOFF (sibling-gated, born-RED kf
instrument) / USER-DOMAIN (the 5.0.0 cut + publishes + TASTE) / FOLD-INTO-M (a named M wave). The
honest M-open state: M is the consolidation tranche — chartered, gate-first, born-RED; NO cure has
shipped (dev-phase, inv-16); every Band-C consume-edge is UN-CONSUMED (named with its tripwire); the
version 5.0.0 is RECOMMENDED (NOT cut); the deploy round-trip is the K/L origin (RE-observation gated
on the glass-ui BB consume at M.WZ). That is the inv ε open.**

---

## TOTALS

| Category | Count | Status |
|---|---|---|
| Standing-spine MANDATE clauses (§1a) | 7 | 7 — all ADDRESSED or HONORED |
| Design directive (§1b) | 1 | ADDRESSED (K-deployed; L.W11 refined; TASTE USER-DOMAIN-PENDING) |
| A→L lineage (chain-trusted to prompt-recap-L.md) | A→L all | ALL terminal — zero drops; 7 rows RE-OPENED/CORRECTED → named M waves (§2) |
| M-session: apparatus critique (§3a) | 5 facets | 5 ADDRESSED (chartered → Band A M.W1–W4 + inv-M-one-runner/two-axis) |
| M-session: finish-L + charter-M (§3b) | 3 sub | 3 ADDRESSED/HONORED |
| M-session: consider the siblings (§3c) | 5 | 3 HANDOFF (glass-ui/value.js/parse-that) · 1 ADDRESSED (sequencing) · 1 HANDOFF (5 PENDING arms) |
| M-session: the 32-lane M-audit (§3d) | 6 sub | 6 ADDRESSED |
| M-session: "what of our performance numbers" (§3e/§7) | explicit row | ADDRESSED — full reckoning §7 |
| 32-lane frontiers (§4) | 5 | 5 → named M bands (A/B/C/D/E), each born-RED-gated |
| Precept violations ⚠M1–⚠M9 (§5) | 9 | 9 FOLD-INTO-M (each a named cure + born-RED gate; 2 inv-ε corrections) — zero bare |
| KILL anti-charter (§6) | 12 carried + W100 + generate() + packrat-candidate | KILL — non-re-litigable |
| Performance numbers (§7) | — | 16.6×@K=8 + zero-alloc + 3.85× measured; color-math alloc UNMEASURED (M.W12); 1.56× mis-attribution corrected; DX 3h→single-digit-min (M.W1–W4) |
| Deferred / chronic terminal P-inv-28 (§8) | 6 rows | 2 ABSOLUTE-terminal build-in (DL-L7/L8) · 1 HANDOFF (DL-L6) · 1 KILL (DL-L9) · 1 must-exit (CH-6/dfa) · 5 PENDING FOLD-on-consume |
| Cross-repo asks + sequencing (§9) | 4 docs | 3 HANDOFF (FILED, sibling-gated) · 1 ADDRESSED (sequencing) |
| USER-DOMAIN finale (§10) | 5 | USER-DOMAIN (cut · publishes · TASTE) · HANDOFF (deploy RE-observe · proof:all) — NONE asserted done |

**Zero drops. Every request A→L (chain-trusted) and every NEW M-session request reaches a TERMINAL
verdict: ADDRESSED / HANDOFF / USER-DOMAIN / FOLD-INTO-M — each cited by a born-RED gate over the
REAL observable, a named wave/lane/commit, or a named sibling tripwire. The inv-M-observable-truth +
inv ε + inv-16 precepts hold throughout.**
