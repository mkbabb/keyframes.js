# Tranche V — audit registry (finding families by defect mechanism)

> The steering document for the 32-agent audit. Two findings that share a
> mechanism share a family, however differently worded. Rounds redirect excess
> staffing away from converged families toward underexplored lenses. The
> registry is stable when two consecutive passes surface nothing new.
>
> Round 1 (15 lanes, 2026-07-16→17): 79 findings, 15/15 lanes returned, all
> reports under `audit/R1-*.md`. Lane IDs cite the per-lane reports.

## Families

| Family | Members (lane IDs) | Mechanism | Round-1 verdict |
|---|---|---|---|
| FAM-01 RAIL | CH-01 CH-02 PR-2 XR-1 CT-01 CT-02 DD-6 XR-4 WT-01 WT-02 WT-03 | The Glass-7/K6 external rail is V's real inheritance: FINAL-U's "no V backlog" was superseded within a day by the handoff; the demo consumes an undeclared, unpublished, registry-absent Glass 7 (manifest+lock have NO glass edge, 43 demo files import it); HeaderRibbon Glass-7 consumer edits (drop `mode=`, delete `defineExpose`) unapplied; the 65-path manifest digest is unreproducible (recipe unpinned). | CONFIRMED — the deepest V band; producer-gated, born RED |
| FAM-02 RENDER | DP-01 DP-02 DP-03 | The prepared demo transaction is live-broken: blank on all 7 routes; `EditorShell.vue:30` `<Tooltip>` without root `<TooltipProvider>` (Glass 7); the crash emits zero console.error so console-keyed gates green over a blank app. | CONFIRMED P0 — blocks all visual claims; fix is demo-owned |
| FAM-03 VACUOUS-GATE | GS-01/TC-1 TC-2 TC-3 GS-03 GS-06 PF-2 LC-04 DP-03 DR-1 TC-6 | Gates that cannot fail or never run: 5 browser oracles permanently skip (playwright installed nowhere); demo vitest project (27 files/155 tests) in no CI job; zero-alloc gc arm vacuous; owner-golden wired to no workflow; taxonomy floors have no consumer; phantom `proof:no-flat-siblings` cited in 4 source comments + demo/DESIGN.md; llms.txt "cannot drift" unenforced (and 47+37 lines stale). | CONFIRMED — prune-or-make-real, one wave |
| FAM-04 DEPLOY-BYPASS | GS-02 CH-05 | The last-demo-green ancestry gate is skipped under `workflow_dispatch` — the recorded standard deploy path; "nightly" roster is actually weekly (cron dow=1). | CONFIRMED |
| FAM-05 LIB-STRUCTURE | LC-01 LC-02 LC-03 LC-05 LC-06 LC-07 LC-08 LC-09 PR-3 PR-4 | The library settlement: 6 prefix-stutter files; `numeric-plan.ts` single-consumer fragment; 8 god-modules in the 400–484L band with nameable seams; presets hollow-shim triple; three flat zones wanting sub-modules (group composite triad, compile frame kernel, emit backward triad); `easing.ts` naming collision; eponymous-dir/index double-layering. **Charter amendment: `compiled-frame.ts` split is REFUTED as a defect — 8 cross-zone importers, correctly-extracted shared contract.** All 24 barrels pure; `internal/` mostly sound (7/9 multi-consumer); spring/ already well-shaped. | CONFIRMED, better-bounded than the charter assumed |
| FAM-06 DEMO-STRUCTURE | DC-01..DC-07 PR-1 PR-5 CT-04 | The demo settlement: transport split-brain (components stranded beside their own dirs; `controls-pane/` vs `ControlsPaneWrapper/` casing schism; dead+aliasing shims in the old kind-dir); pervasive `{components,composables,utils}` kind-dirs vs colocation; `ChannelOptions.vue` 609L over the U 500L rule; **app/dock extirpation (OD-U19) is a FALSE CLOSE — ChromeDock.vue 385L + MbabbMenu.vue still tracked there**; single-file dirs; `instrument/utils/` → `_shared/`. scenes/ is the colocation exemplar (negative). | CONFIRMED |
| FAM-07 DEAD-EXPORT | DD-1 DD-2 DD-3 DD-4 | 2 truly-dead exports (`isObject`, `cloneInterpSlot`); ~32 src + 11 demo symbols exported but used only in their own file (encapsulation leak). No orphan files, no commented-out code, no alias smuggling, **no Value-4 grammar fallbacks anywhere** (the P0 trap passes clean). | CONFIRMED, small |
| FAM-08 DOC-DRIFT | DR-2 DR-3 DR-4 CH-03 CH-04 CH-06 XR-5 PL-1 PR-6 DD-5 | Precise doc corrections: **the handoff's own §3 correction list is imprecise — weighted blending is a LIVE feature; only the `BlendMode` type + `"weighted"` op were removed; blind deletion would remove accurate copy**; README `weighted-blend`→`weight-blend`; DESIGN.md cartoon shape; CHANGELOG 6.0.0 omissions; MbabbMenu reword row resolved-by-migration (retire with :6 evidence); "Atlas 2.0"→atlas 7.0.0; Glass 4.x-era comments incl. suspected-dead modelValue remount shims. | CONFIRMED |
| FAM-09 BENCH-TRUTH | PF-1 PF-3 PF-4 PF-5 | taxonomy.json lists 23 interp-buffer cases with ZERO matching the 7 live ones; a shipped hot path cites a deleted bench row as ADOPT provenance; 2 on-disk suites uncovered; the soa mjs bench is an orphan. Hot paths themselves are allocation-lean (negatives strong). | CONFIRMED |
| FAM-10 A11Y | AY-1..AY-5 → owner W11 | Amiga ignores reduced-motion (3 infinite animations); Monaco `accessibilitySupport:"off"`; MatrixEditor 16 unlabeled inputs; TimelineCaret label; inert aria-errormessage. Custom sliders/roving tabindex/live regions all sound (negatives). | CONFIRMED, small builds |
| FAM-11 COORDINATION | XR-2✅ XR-3✅ XR-6 IN-ATLAS-1..4 IN-GLASS-1 | Bi-directional channel housekeeping: Glass's mark re-home DONE 2026-07-17; atlas two-checkout disambiguation DONE (active atlas = sci-report/atlas subtree); exact-V4-pin rationale line owed to atlas; consolidated outbound packets owed at formation close. | ACTIVE |
| FAM-12 TEST-HARNESS | TC-4 TC-5 | `mirror.test.ts` is a topology gate that reds any restructure purely on paths — must be DECIDED before FAM-05/06 waves; composable tests run outside component instances (teardown never exercised). | CONFIRMED |
| FAM-13 CLOSE-PROSE | PL-1 PL-2 WT-02 PR-6 | Misleading measurements in close prose (77-file count included gitignored PNGs; drifting absolute worktree counts; 18→19 scripts). Verify-never-inherit reaffirmed; V re-measures. | CONFIRMED, absorb into FAM-08 wave |

## Charter amendments from Round 1 (refutation-amends-charter)

1. `compiled-frame.ts` is NOT a causeless fragment (8 cross-zone importers) — the
   V restructure keeps it as the shared contract; `numeric-plan.ts` is the real fold.
2. The weighted-blending doc "residue" is partially LIVE feature prose — corrections
   must be surgical, verified against the packed d.ts, not the handoff's phrasing.
3. Library god-modules top out at 484L — under U's 500L rule but against the owner's
   "no godmodules" edict; the ceiling policy (400 vs 500, raw vs code lines) is a
   formation decision, then enforced by ONE structural check, not a gate farm.
4. `internal/` is not a grab-bag; barrels are pure; scenes/ colocation is exemplary —
   the restructure is narrower and more surgical than the charter's "massive
   explosion" framing suggests. The explosion was the apparatus (557x scripts/), and
   U already dissolved it.

## Round-2 synthesis (10/10 lanes, 2026-07-17; reports `audit/R2-*.md`)

Verification: DP-02 causality PROVEN sole crash (AV-1; root provider = documented
Glass-7/reka pattern per CC-03 → demo-owned); the 5 skipped oracles PASS 14/14
under a browser (skip masks green); npm-prune (AV-9), dispatch bypass (AV-4),
phantom gates (AV-5), FINAL-U supersession (AV-6/7), digest unpinned-final
(AV-8) all CONFIRMED. OD-U13/U14 behavior claims VERIFIED live (BV-N1..N5).
Blueprints landed: library (LT-01..14: 500-raw ceiling, two carves, compile/frame/,
KEEP easing.ts+internal/), demo (DT-01..11: kebab-dir grammar, chrome/ extirpation,
flat kind-dir dissolve, DT-04b corrects R1-05's dead-shim claim), gate/test prune
(GP: 4 MAKE-REALs — pageerror-keyed smoke, oracles nightly, dispatch break-glass
input, test:demo CI — against a long prune list), doc manifest (DM-01..19 with
DO-NOT-EDIT guards). Constellation: exact-V4-pin CONFIRMED deliberate (CC-02);
D-GAP-6 needs ship-or-decline; dock ACTIVATION facet unowned in Glass BI (CC-04);
Glass-7 watchlist of 8 queued changes (CC-05); bundle byte-neutral vs fresh Glass.

**New rows Round 2 minted (registry NOT yet stable):**

| Family | New members | Mechanism |
|---|---|---|
| FAM-14 EASING-EDGE (new; splits from FAM-02) | AV-DP02-DELTA DP2-02 DP2-03 | Masked demo↔library easing regressions under Value 4: `bounceInEase` unknown (CopyButton.vue:42 — copy feedback animation dead), anonymous-fn timingFunction no-CSS-repr (useTransformState.ts:107), Invalid-watch-source Vue warns; all invisible behind the FAM-02 crash and console-error-keyed gates |
| FAM-15 DESIGN-PROPORTION (new; the owner's lens, now populated) | DP2-04 DP2-05 DP2-06 DP2-07 + R2-01 gaps (controls-closed invisible-at-rest toggle; mobile dock first-tap intercept — glass-root echo) | Select trigger text collapse; easing card ~130px dead band; duplicated transport affordance per scene class (owner taste); spring slider lozenges off-palette |
| FAM-01 (extended) | CH2-02 | T's four dock-crispness tripwires were DE-TRIPWIRED by apparatus deletion, not resolved — ride the Glass-7 consume ungated |
| FAM-11 (extended) | CC-01 CC-04 | D-GAP-6 undeclined; dock-activation ownerless |

Round-2 corrections to Round 1: DT-04b (shim has a live test consumer — repoint,
don't just delete); GP negatives (workflow_run path DOES enforce ancestry;
verify-diff.mjs is live). Round-1 rows REFUTED: none.

## Round-2 assignment (10 agents; per the owner's routing: Fable deepest, Opus fanout, Sonnet mechanical)

| Lane | Model | Charge |
|---|---|---|
| R2-01 visual-design-reflight | opus | The full proportionality/affordance audit from the patched audit copy (fresh Glass linkage), unblocked from FAM-02 |
| R2-02 amiga+suspend-resume+compositor live verify | opus | OD-U13/OD-U14 "fixed-in-U" claims exercised live (R1-11 coverage gap) |
| R2-03 chronic census completion | opus | Full A..U ledger enumeration (R1-10 sampled only) |
| R2-04 adversarial verify of R1 P0/P1s | opus | Refute-or-confirm: DP-02 causality, oracle-run-with-playwright, demo-project run, GS-02 logic, LC-04 phantoms |
| R2-05 library target tree adjudication | **fable** | THE final file-grain move/merge/split/rename blueprint for src/ |
| R2-06 demo target tree adjudication | **fable** | THE final blueprint for demo/, incl. app/dock extirpation home + ChannelOptions carve + transaction sequencing |
| R2-07 gate/test prune blueprint | opus | The keep/fold/prune table + the small born-RED make-real set (KISS-forward: default prune) |
| R2-08 doc-correction manifest | sonnet | file:line → exact new text for every FAM-08/13 row |
| R2-09 value.js-V + glass-BI cross-check | sonnet | W17b obligations, D-GAP-1/5/6 delivery check, Glass-7 API-change watchlist for the consume wave |
| R2-10 perf/bundle truth completion | sonnet | gh-pages build in the audit copy: bundle bytes, chunk map, Monaco laziness, bench baseline numbers |

## Formation audit (round FA, 3 lanes, 2026-07-17) + convergence verdict

A three-lane formation audit (`audit/FA-1-born-red-truth.md`,
`FA-2-disposition-walk.md`, `FA-3-precepts-compliance.md`) read the formed V
corpus against born-RED truth, disposition completeness, and the precepts
contract. It returned **25 findings (FA1×5, FA2×6, FA3×14)** and **zero new
defect FAMILIES** — every finding is formation-shape residue (citation drift,
missing required sections, ownership-edge omissions, one born-RED scope
conflation), not a new class of product/structure defect. All 25 were absorbed
in the same-day fix pass (this edit).

**Convergence:** Round 3 (`audit/R3-*.md`) minted zero new families and the
formation audit minted zero new families — **two consecutive family-clean
passes**. THE REGISTRY IS STABLE.

The five P1s and their fixes:

| P1 | Defect | Fix |
|---|---|---|
| FA1-01 | `proof:structure` ceiling + kind-dir rules have no src-tree red witness (birth scope conflated src + demo) | Birth scope pinned to `src/` (3 src-live rules red-witnessed); ceiling + kind-dir made preventive on src and staged to red-witness the pre-move demo tree at W8 (V.B W4 Scope 2 / Hard Gate 1; V.C W8 Scope 7 / Hard Gate 4) |
| FA2-01 | FAM-10 a11y quintet asserted-owned but ownerless | AY-1..AY-5 added to W11 Scope / Hard Gate / File Bounds; FAM-10 members annotated `→ owner W11` |
| FA2-02 | CT-04 deep-`@src/animation` imports never entered any family | Folded into W8 Scope (owner-gated surface note) + Hard Gate `grep = 0`; CT-04 appended to FAM-06 members |
| FA3-01 | `package.json` written by W2/W4/W9 with no ordering edge (V.md said "W2-only") | Single-writer chain W4 → W2 → W9 named in V.md ownership block + Ordering DAG edge |
| FA3-02 | `.github/workflows/*` written by W2/W9/W10 with no ordering edge (V.md said "W9-only") | W2 → W9 → W7/W8 + W9 → W10 (ci.yml) edges added; V.md ownership rewritten; W9 `Depends on: W2` |
