# Tranche R Audit — Lane `retro-deferred-ledger`

**Scope.** Sweep EVERY chronically-deferred and deferred item across the constellation history and
produce the COMPLETE roster with each item's age (tranche-count), current status (re-verified against
the LIVE tree on `tranche-r-dev`, not the doc claim), and a FOLD-TO-R disposition. The user's binding
precepts for this lane: *"Delineate any chronically deferred items and fold them into this new tranche"*
+ *"Delineate any deferred items and fold them into this tranche."* The glass-ui-BC-gated items
(S1/S2 workaround deletes, N-Stage unshelf) are included HONESTLY.

**Method.** Read the canonical chronic substrate `docs/tranches/Q/PROGRESS.md §"Open deferrals"` (the
live `CHRONIC_LEDGER` target of `scripts/proof-chronic-closure.mjs`), the P-inv-28 terminal register,
`docs/tranches/Q/FINAL.md`, the M/N/O/P deferred sections, and the R.W0 commit `23a6867`. Each row's
status was RE-CHECKED against the working tree (`grep`, `wc -l`, `git show`, and by RUNNING the gates
`proof:chronic-closure`, `proof:decomposition`).

---

## HEADLINE

**The Q close declared "the P-inv-28 ledger TERMINATED" and that `proof:chronic-closure` exits 0 — that
claim is FALSE on the current tree.** Running the gate today REDS:

```
✗ [[C] DM-7 keyframes-vue 0.1.0 unpublished] sibling/historical band names
  `proof:keyframes-vue-published` as present but it does NOT resolve — a DANGLING reference.
✗ proof:chronic-closure — the chronic ledger is not closed to RUNTIME discipline
```

The cause: **R.W0 (`23a6867`) retracted keyframes-vue in totality** (un-published from npm, deleted
`packages/keyframes-vue/`, deleted `scripts/proof-keyframes-vue-published.mjs` + its package.json key +
its CI tripwire) — but the **Q chronic ledger** (the live parse substrate) still cites
`proof:keyframes-vue-published` as a resolving closure oracle for DM-7. So the SAME meta-gate the Q
close celebrated as the P-inv-28 terminal is now RED, and it runs in `proof:hygiene-chain` (CI-reachable).
This is the FIRST and most urgent R fold item: **the chronic ledger must be re-pointed Q→R and DM-7
re-stated as a KILL (keyframes-vue retracted), not a published HANDOFF.**

Secondarily: **three Q dispatches/consumes were silently dropped** (DQ-3 contrast-color never consumed
kf-side; the VJ-Q9 color-serialization change at the re-pin edge un-gated; the S8 cure's verification),
and **the BC-gated trio (DM-1 S2, DM-5 S1, DM-24 N-Stage)** remains correctly-pending but has now ridden
a further tranche and must be re-stated with incremented chronicity so P-inv-28 keeps biting.

---

## THE COMPLETE DEFERRED ROSTER (every item, age, live status, R disposition)

Legend — **Age** = tranche-span carried (P-inv-28 integer). **Live status** = re-verified on `tranche-r-dev`.

### Group 1 — LEDGER-INTEGRITY (the gate is RED NOW)

| Item | Born | Age | Q claim | LIVE status (re-verified) | FOLD-TO-R |
|---|---|---|---|---|---|
| **DM-7 keyframes-vue** | K.W12 | **6 (K,L,M,O,P,Q→R)** | "USER-DOMAIN PUBLISHED — belt EXITS" | **RETRACTED at R.W0** (`23a6867`): npm-unpublished, `packages/keyframes-vue/` deleted, `proof-keyframes-vue-published.mjs` deleted. But `docs/tranches/Q/PROGRESS.md` (live CHRONIC_LEDGER) STILL cites the deleted gate → **`proof:chronic-closure` RED** (dangling reference). | **FOLD → R.W0/close.** Re-point `CHRONIC_LEDGER` Q→R (the M/O/P re-points were skipped before — do NOT skip again). Re-state DM-7 as **KILL** (overfit adapter retracted, owner-ratified) with a RECORD row. The dangling `proof:keyframes-vue-published` reference must be excised from the R ledger. **Gate must go green before R closes.** |

### Group 2 — BC-GATED (glass-ui BC unpublished; correctly PENDING, but aged a tranche)

The workaround source is STILL PRESENT in the tree (re-verified):
- **DM-5 S1** — `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"` (live; `AnimationControls.vue` site).
- **DM-1 S2** — `demo/@/components/custom/animation-controls/TransportDock.vue` `pointerHandled`/`onPlayPointerDown` (**9 sites**, re-counted live).
- **DM-24 N-Stage** — the ~3,500-LOC `n-stage-impl` branch shelved; `Q.WC3-NSTAGE-UNSHELF` row marked `⬜ DEFERRED (glass-ui BC)` in `docs/tranches/Q/IMPL-RUN-BOARD.md:41`.

| Item | Born | Age | Disposition | LIVE status | FOLD-TO-R |
|---|---|---|---|---|---|
| **DM-1 RF-17 dock click-strand** (`pointerHandled`/`onPlayPointerDown`, 9 sites) | I (BLK-8) | **8 (I,J,K,L,M,O,P,Q→R)** | HANDOFF — delete S2 atomically on BC cut | PRESENT; `proof:workaround-deletion` S2 born-PENDING (BC unpublished). **Q's P-inv-28 register said "NO 8th carry" — this is now the 8th carry.** | **FOLD → R.** Re-state S2 with chronicity **8** and HONOR the no-8th-carry vow: either (a) the BC cut lands in R and S2 deletes atomically, or (b) the **contingency KILL** fires (a kf-internal ARIA/pointer-clean replacement, the band-aid excised, NOT a 9th carry). No silent re-BOOK. |
| **DM-5 S1 aria-orientation suppress** (`SpringSidebar.vue:43`) | K | **6 (K,L,M,O,P,Q→R)** | HANDOFF — S1 delete on BC SegmentedTabs `role=group` aria guard | PRESENT; S1 born-PENDING. | **FOLD → R.** Re-state chronicity **6**. Same fork: BC SFC-guard publish + kf delete, OR the contingency kf-internal ARIA-compliant replacement (KILL of the band-aid). |
| **DM-24 N-Stage unshelf** | N | **3 (N,O,P→Q; shelved across Q)** | HANDOFF (BC-gated) | The mobile scroll-snap carousel + typed VT WAS built in Q.WC3 (per FINAL.md:28). The **`n-stage-impl` branch unshelf-rebase** stays GATED on BC + the constellation re-pin (stale `^0.9.0` parse-that / `^0.13.0` value.js / `~4.0.0` glass-ui pins). | **FOLD → R (or explicit KILL).** Decide in R: either the BC cut lands and the ~3,500-LOC branch rebases off the 5.0.0 constellation pins + unshelfs, OR the branch is formally KILLED (the mobile shelf-driver already shipped in Q.WC3, so the unshelf may be redundant — R must rule, not re-defer). |

### Group 3 — DROPPED Q DISPATCHES / CONSUMES (Q claimed done; live tree disagrees)

| Item | Born | Age | Q claim | LIVE status | FOLD-TO-R |
|---|---|---|---|---|---|
| **DQ-3 value.js `contrast-color()` consume** | Q | 1 (Q→R) | gate-first HANDOFF: author `proof:contrast-color-consume`, light on value.js 1.1.1 publish + re-pin | **value.js 1.2.0 SHIPPED `contrast-color` (registry-confirmed, FINAL.md:11), but NO `proof:contrast-color-consume` gate exists in `scripts/`, and ZERO kf source references `contrast-color`/`contrastColor`.** The published-consume-edge was never consumed. | **FOLD → R.** The sibling shipped the root cure; the kf consume is now OVERDUE (the gate's own RED state for a PRESENT-but-unconsumed published fix). Author the consume gate + wire the resolve, OR ratify a KILL with a reason. Do not let it vanish. |
| **VJ-Q9 color-serialization consume-edge** (`display-p3(…)` → `color(display-p3 …)`) | Q | 1 (Q→R) | IMPL-RUN-BOARD.md:22 flagged "⚠️ WATCH the kf consume edge at re-pin (Stage 5)" | Q re-pinned value.js ^1.2.0; **no gate pins the serialization shape kf consumes.** A WATCH note with no gate is exactly the born-RED-that-never-bites the constellation forbids. | **FOLD → R.** Either author a consume-shape lock (assert kf parses the new `color(display-p3 …)` form round-trip) or record it terminally. A "WATCH" that survives a close is an un-discharged deferral. |
| **DM-5 S8 FN_NAME cure verification** | K | **5 (K,L,M,O,P,Q→R)** | HANDOFF(PRIMARY VJ-Q4 `.fnName`) — S8 flips PENDING→GREEN on consume; WeakMap retired | `src/animation/utils.ts` still references `fnName`; Q.WG4 claims the WeakMap was retired onto VJ-Q4 `.fnName`. **Re-verify the S8 arm actually GREENED** (the ledger says "GATED on value.js 1.2.0" which shipped). | **VERIFY-ONLY → R.** Confirm `proof:workaround-deletion` S8 is GREEN (not still PENDING) on the 1.2.0 dist; if PENDING, fold the consume. |

### Group 4 — VERIFY-ONLY / RE-AFFIRM chronics (terminated; re-verify on the R dist)

These exited Q via a GREEN gate that satisfies P-inv-28. The LAST live re-verify was the Q 5.0.0 dist;
R inherits them as a re-verify obligation (any gate that reverts RED is a NEW R regression to wave-assign).

| Item | Born | Age at Q | Disposition | R obligation |
|---|---|---|---|---|
| DM-9 specular | D(D14)→H | 8 | RE-AFFIRM (`proof:specular-absent-at-rest`) | Re-verify on R dist |
| DM-10 typography | D(D7)→I | 9 (TERMINATED) | VERIFY-ONLY (`proof:font-census`) | Re-verify |
| DM-11 mobile | D(D10) | 10 (TERMINATED) | VERIFY-ONLY (`proof:spring-slider-continuous`+`proof:subject-animates`) | Re-verify |
| DM-12 dock perf | D(D5/D9) | 8 | RE-AFFIRM (`proof:perf-frame-budget`) | Re-verify WITH SoA-processFrame + engine split |
| DM-13 empty-value | A(W0)→H | 8 | VERIFY-ONLY (`proof:engine-no-throw-on-play`) | Re-verify WITH NaN-guard interlock |
| DM-14 DFA suspend | H | 7 | VERIFY-ONLY (`proof:fsm-suspend-resume-live`) | Re-verify |
| DM-15 scene-control-dfa | I (post-close) | 7 | VERIFY-ONLY (`proof:control-surface-single-writer`) | Re-verify |
| DM-8 Lighthouse floors | B-era | 5 | VERIFY-ONLY (`proof:lighthouse-mobile`, `KF_REQUIRE_LH=1`) | Re-run on R dist (K/M floors are hard) |

### Group 5 — FOLD-LANDED / BUILT (terminal; no carry — recorded for completeness)

| Item | Disposition | Note |
|---|---|---|
| DM-2 GlassControlPoint (`DemoControlPoint`) | BUILD-IN LANDED (Q.WC1, the 9th-carry chronic GENUINELY EXITS) | `proof:demo-control-point` GREEN; the bespoke `useEasingCurveDrag` CTM handler removed |
| DM-22 named-selector NaN-frame | BUILD-IN LANDED (Q.WD1) | `proof:nan-frame` GREEN; deferred-resolution + play-time guard |
| DM-3 MorphSVG (`fromMorphSVG`) | FOLD-LANDED (`69ca7bf`) | 7-tranche ABSOLUTE, built |
| DM-5 S7 linear() flat-comma | FOLD-LANDED (RETIRED, M.W9) | regex removed |
| DM-5 S9 parse-that direct import | FOLD-LANDED | prod dep removed; `utils.ts:9` consumes value.js |
| DM-4, DM-6, DM-17, DM-18, DM-19, DM-25 | FOLD-LANDED (O.W2 intakes) | per-gate node-probes GREEN |
| DQ-1 parse-that re-entrancy | DISPATCHED (parse-that 0.13.0 PUBLISHED) | try/finally hardening shipped |
| DQ-2 parse-that dead API | DISPATCHED (parse-that 0.13.0) | `*Span` deprecated, `subTable` retracted |
| DQ-4 false-RED S1/S2 arms | FOLD (Q.WG3 content-probe retarget) | |
| DQ-5 ci-coverage RED | FOLD (Q.WA3 CI-wire) — **but R.W0 re-touched ci-coverage roster** (keyframes-vue removed) | Re-verify `proof:ci-coverage` GREEN post-R.W0 (commit claims 177 gates GREEN) |
| DQ-6 emerging-CSS Phase-2 | FOLD (Q.WB1) | `proof:emerging-css-resolve-p2` |
| DQ-7 wave-charter enforcer | FOLD (Q.WA4) | `proof:wave-charter` |

### Group 6 — NET-NEW R-BORN deferrals surfaced by R.W0 + this audit

| Item | Disposition |
|---|---|
| **Root-file deletions left in working tree** (`CLAUDE.md`, `CONTRIBUTING.md`, `llms.txt`, `llms-full.txt`, `.dependency-cruiser.cjs`, `.dependency-cruiser-known-violations.json`, `src/animation/CLAUDE.md`) — R.W0 commit msg explicitly says "LEFT in the working tree for the Tranche R audit to assess (junk vs load-bearing)" | **FOLD → R.** Uncommitted deletions cannot survive the audit unresolved. R must rule per file: re-instate (load-bearing — e.g. CLAUDE.md is the codebase memory; `.dependency-cruiser` may gate the boundary census) or commit the deletion (junk). A dirty tree with deleted governance files is itself a deferral. |
| **`proof:chronic-closure` / `proof:decomposition` RED on the R branch** (see Headline + the decomposition lane) | **FOLD → R.** Both are CI-reachable (chronic-closure in `proof:hygiene-chain`); both RED today. They are the entry tripwires for R's whole charter. |

---

## P-INVARIANT-28 RE-RECKONING AT R

P-inv-28: *a deferred item carried ≥4 tranches CANNOT ride to a 5th without a terminal verdict.* Q claimed
the ledger TERMINATED. Re-counting the LIVE carries into R:

- **DM-1 (8 tranches)** — Q's register said "NO 8th carry"; it IS now the 8th carry into R. **HARD STOP:**
  R must land the BC delete OR fire the contingency KILL. A 9th carry is a direct invariant breach.
- **DM-5 S1 (6), DM-5 S8 (5)** — still BC/consume-gated; each must terminalize in R.
- **DM-7 (6)** — KILLED at R.W0 but the ledger doesn't say so → re-state as KILL (a clean terminal).
- **DM-24 (3→4 if it rides R)** — about to cross the ≥4 belt; R must rule (unshelf or KILL), not BOOK.

**The structural lesson:** the M.WZ/O.WZ/P.WZ ledger re-points were ALL skipped, leaving the live pin
3 tranches stale at L before Q re-pointed L→Q directly. The SAME skip is recurring: R.W0 changed the
ground truth (keyframes-vue gone) without re-pointing the ledger, so the gate RED. **R must re-point
Q→R atomically with its gate co-edits**, exactly as Q.WZ §S1 did — and this time keep the no-skip
discipline so the next tranche inherits a GREEN, accurate substrate.

---

## DISPOSITION SUMMARY (what R must fold)

1. **DM-7** — re-point the chronic ledger Q→R, re-state DM-7 as KILL (keyframes-vue retracted), excise
   the dangling `proof:keyframes-vue-published` reference. **Unblocks `proof:chronic-closure`.**
2. **DM-1 S2 (8th carry)** — BC delete OR contingency KILL. No 9th carry.
3. **DM-5 S1 (6th carry)** — BC SFC-guard delete OR contingency KILL.
4. **DM-24 N-Stage** — unshelf+rebase off 5.0.0 pins OR formal KILL (mobile already shipped Q.WC3).
5. **DQ-3 contrast-color** — author the consume + wire it (value.js shipped the parser), OR KILL.
6. **VJ-Q9 serialization** — lock the consume shape OR record terminally; retire the bare "WATCH".
7. **DM-5 S8** — VERIFY the WeakMap-retire actually GREENED on 1.2.0; fold if PENDING.
8. **Group 4 VERIFY-ONLY chronics (×8)** — re-verify on the R dist; any RED revert is a NEW R wave.
9. **R.W0 root-file deletions** — rule per file (re-instate load-bearing / commit junk); clean the tree.
10. **DQ-5 ci-coverage** — re-verify GREEN after R.W0's roster edits.
