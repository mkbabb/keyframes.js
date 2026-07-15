# Lane 05 — The MACHINE Deferral Ledgers

**Fleet:** Tranche U development audit (32-lane), lane 5/32.
**Charter:** enumerate every row of the machine-readable deferral ledgers — what it
defers, why, external vs internal, and the U disposition (fold-in / discharge /
external-tripwire). Evidence read from the live tree (git `master`-post-T, 5.2.0).

**Headline:** The codebase carries a full *deferral bureaucracy* — 227 proof:*
gates against a declared ceiling of 120, 36 FROZEN appearance-locks awaiting a demo
rewrite that never came, 26 chronic dead-exports, 2 permanently-tolerated colocation
violations, an `any` floor stalled at 99, plus five ledger structures (FROZEN /
DISCHARGE / RETIREMENT / REGRESSION-GUARDS / BORN-RED-BACKLOG) whose only job is to
make deferral auditable. The owner's edict ("CI trimmed substantially / most
tautological", "NO MORE DEFERRALS", "NO legacy code") is a direct instruction to
*dissolve this machine*, not to keep feeding it convergence rows.

---

## 0. The live census (all numbers read from the tree, not the board)

| Ledger | Location | Live size | Kind |
|---|---|---|---|
| Total proof:* roster | `package.json` | **227** | vs `ROSTER_CEILING` **120** → 107 over |
| `FROZEN_SET` | `gate-bands.mjs:27` | **36** live, **0** discharged | demo-appearance locks |
| `DISCHARGE` | `gate-bands.mjs:122` | **17** records | retired-gate migration/kill ledger |
| `RETIREMENT_LEDGER` | `gate-bands.mjs:441` | **19** rows | feature-coupled retire tracking |
| `REGRESSION_GUARDS` | `gate-bands.mjs:404` | **10** | absence/excision guards |
| `T_BORNRED_BACKLOG` | `gate-bands.mjs:609` | **8** live rows | 6 external, 2 internal |
| dead-export `DEFERRED` | `proof-no-dead-export.mjs:70` | **26** rows | 16+ reflexive `Use*` interfaces |
| any-ceiling `CEILING` | `proof-any-ceiling.mjs:52` | **99** | demo `any`-line floor |
| colocation `DEFERRED` | `proof-colocation.mjs:69` | **2 live + 1 stale** | edict violations, TOLERATED |

Verified live: `proof:roster-ceiling` FAILs at **227 > 120**
(`proof-roster-ceiling.mjs:47`); `proof:any-ceiling` PASSes at exactly 99;
`proof:no-dead-export` PASSes with 26 carried; `proof:colocation` PASSes with 2
deferred + 1 "already cleared".

---

## 1. The roster ceiling is uncloseable by its own mechanism (CRITICAL)

`ROSTER_CEILING = 120` (`gate-bands.mjs:595`); live roster **227**
(`proof-roster-ceiling.mjs` output). The gate's own comment
(`gate-bands.mjs:588-594`, `proof-roster-ceiling.mjs:6-8`) records the failure mode
in its own words: *"S.A4's headline was 190 → ~138 → ~120 … the tree INVERTED to
203+ (each altitude band authored MORE structural born-RED oracles)."* Then T added
more still: 227 today.

The convergence design is **structurally incapable** of reaching 120: the ceiling is
supposed to fall as feature-coupled retirements land, but every audit band authors
new born-RED oracles faster than retirements remove them. This is precisely the
"tautological CI" the owner named — a self-perpetuating gate factory.

**Why it defers:** it treats 227→120 as a slow organic convergence via
`RETIREMENT_LEDGER` deletions.
**External/internal:** internal (self-referential count gate).
**U disposition — DISCHARGE via TRIM, not convergence.** The idiomatic cure is a
CI-trim band that *deletes tautological gates wholesale* (the owner's explicit
ruling), not a ledger that waits for features to die one at a time. Target: the
roster drops below 120 in ONE restructuring pass — the 36 FROZEN discharge with the
demo rewrite (finding 2), the 8 aggregator chains collapse, the absence-guards
consolidate (finding 8) — then `ROSTER_CEILING` + `proof:roster-ceiling` itself are
DELETED (a count-ceiling gate is scaffolding once the real trim lands).

---

## 2. FROZEN_SET — 36 appearance-locks awaiting a demo rewrite that never came (CRITICAL)

`FROZEN_SET` (`gate-bands.mjs:27-97`) is 36 demo-appearance/geometry gates
"FROZEN IN PLACE at S.A4 as a RED-authorized ossifying set" to be discharged "LATER
(S.G1 / S.D3, the demo rewrite)" by migration-to-successor or witnessed kill
(`gate-bands.mjs:8-16`). Live check: **all 36 are still live, 0 discharged**
(`proof:roster-ceiling` note: "FROZEN_SET 36: 36 live, 0 discharged/gone").

The "demo rewrite" that was to discharge them (S.G1/S.D3) was SHELVED in S (the
scene-stage prototype the owner ruled "looks awful" — MEMORY) and never executed in
T. So 36 gates freeze px-arithmetic geometry (`proof:timeline-rail-width`,
`proof:card-rounded-primitive`, `proof:demo-shell-grid`, `proof:stage-within-docks`,
…) of a demo the owner has now ordered wholly restructured.

**Why it defers:** the discharge is coupled to a demo rewrite that kept slipping.
**External/internal:** internal (demo appearance).
**U disposition — DISCHARGE en masse.** U's grand demo restructure (the owner's
central U edict) IS the S.G1/S.D3 event finally happening. Every FROZEN key is
discharged as the rewrite lands: its surviving live property migrates to
`proof:owner-golden` (the T.M3 blessed visual oracle — already the successor pattern
in `DISCHARGE`), or is killed with a re-run witness. `FROZEN_SET` should be EMPTY at
U-close and the freeze machinery (`FROZEN_SET` + the ci-coverage frozen-discharge
clause) deleted. A frozen px-lock is legacy code the moment the surface is rebuilt.

---

## 3. proof:colocation DEFERRED tolerates the keystone edict's own violations forever (MAJOR)

`proof:colocation` is "THE GRAND COLOCATION EDICT keystone (OWNER-ASKS row 1)"
(`proof-colocation.mjs:2`). Yet its `DEFERRED` map (`proof-colocation.mjs:69-82`)
carries three residuals, and the entries are declared **TOLERANT**: *"satisfied
whether the violation is still present (deferred) OR already cured"*
(`proof-colocation.mjs:34-36, 89-95`). Live run confirms two violations are STILL
PRESENT and green-passed:

- `demo/@/composables/gestureSelectSuppression.ts` — a plain body-class counter
  mis-filed in the composables tier; promised "T.F13 re-homes it to utils/". File
  still at that path (verified `ls`).
- `demo/@/utils/kfEngine.ts` — engine-loader boot infra mis-filed in utils/;
  promised "T.F13 promotes it beside state/". File still at that path.

T.F13 shipped in T without executing either move. The keystone colocation gate
therefore **green-lies on two live violations of the owner's #1 edict**. A third row
(`components/custom/animation-transport/useKfPillTabs.ts`,
`proof-colocation.mjs:78`) is a STALE key — the file is now at
`instrument/transport/composables/useKfPillTabs.ts` (verified `find`); the gate
reports it "already cleared" but its own comment admits *"We cannot distinguish
'cured' from 'typo'"* (`proof-colocation.mjs:256-258`) — a silent blind spot.

**Why it defers:** the pre-edict move waves never physically relocated the files.
**External/internal:** internal (demo colocation).
**U disposition — EXECUTE + STRICTEN.** U performs the two moves (gestureSelect →
`utils/`, kfEngine → beside `state/`), DELETES the `DEFERRED` map entirely, and
removes the TOLERANT clause so the keystone gate is strict. Under "colocation,
colocation, colocation," a colocation gate that tolerates known violations is a
contradiction in terms.

---

## 4. dead-export DEFERRED — 26 chronic zero-consumer exports (MAJOR)

`proof-no-dead-export.mjs` `DEFERRED` (`:70-113`) carries 26 dead demo exports the
T.F23(a) purge "could NOT excise this batch" because they were "ENTANGLED with the
facility lane's in-flight files" and would be swept "post-facility" (`:41-47`). The
facility lane (T.F5 `instrument/` fold) LANDED in T; the post-facility sweep never
ran. 16+ of the 26 are reflexive composable interfaces (`UsePaneRegisterReturn`,
`UseScrollFadeOptions`, `PlayActuationHandlers`, `UseTabStripScrollReturn`, …)
exported out of a composable but consumed only inside their own file
(`proof-no-dead-export.mjs:72-99`) — exactly the "reflexive `Use…Return`/`…Options`"
residue the gate's own header names as the defect class (`:8-11`).

**Why it defers:** the export granularity sweep was staged behind the facility fold.
**External/internal:** internal (demo export hygiene).
**U disposition — SWEEP + FLOOR.** As part of the demo restructure, un-export or
inline all 26 (a reflexive `UseXReturn` interface used only in its own file just
drops the `export` keyword). Delete the `DEFERRED` array; the ratchet header itself
says "the sweep completes when DEFERRED is empty and this array is deleted"
(`:47`). No legacy code = no exported symbol with zero consumer.

---

## 5. any-ceiling — a demo `any`-floor stalled at 99 (MAJOR)

`CEILING = 99` (`proof-any-ceiling.mjs:52`); live count exactly 99. The ratchet was
authored at 109 (T.F23(b)) and has crept down only to 99 over two tranches
(`:24-27`). The header states the cluster is "the store/composable/keyframes-editor
boundaries" (`:11-13`) — the exact demo surfaces U is restructuring. The gate is a
one-way debt ratchet, not a cure.

**Why it defers:** the ~100 `any` cluster was "entangled with the facility-lane
files" and the AGGRESSIVE-PURGE "does NOT sweep them this batch" (`:9-11`).
**External/internal:** internal (demo type debt).
**U disposition — DRIVE TO ZERO + RETIRE.** The grand demo restructure re-types the
store/composable/keyframes-editor boundaries (the scene/app transform seams already
adopted the library's `Vars` contract per the header — extend that pattern). Drive
the count to ~0, then DELETE `proof:any-ceiling` — a demo that shares `src`'s
`strict` posture needs no separate `any` floor once the debt is paid.

---

## 6. proof:no-collision-rename — the ONE legitimate value.js external tripwire (MAJOR)

`T_BORNRED_BACKLOG["proof:no-collision-rename"]` (`gate-bands.mjs:693-705`, KF-7):
value.js exports a type `PropertyDescriptor` that collides with the ambient DOM
global, so API-Extractor mangles it into kf's PUBLISHED `dist/keyframes.d.ts` as
`PropertyDescriptor_2`. Verified LIVE: **`grep -c PropertyDescriptor_2
dist/keyframes.d.ts` = 3**. The row notes value.js 2.0.1 / 3.0.0 / 3.1.0 all still
export it un-renamed; kf is pinned `@mkbabb/value.js: ^3.1.0` (verified `package.json`).

**Why it defers:** genuinely EXTERNAL — kf cannot rename value.js's export.
**External/internal:** EXTERNAL (value.js). The owner note: value.js's tranche is in
active development elsewhere; U charters the consume-edge/coordination letter only.
**U disposition — EXTERNAL TRIPWIRE (keep, coordinate).** This is the model of a
legitimate deferral that survives U: a real external defect with a version-tripwire
that greens the instant value.js renames + kf re-points. U charters a value.js
coordination letter asking for `CSSPropertyDescriptor` (collision-free), and keeps
this ONE tripwire. It must NOT be folded/executed internally.

---

## 7. Five glass-ui external born-RED rows need a single coordination letter, not five tripwires (MAJOR)

Of the 8 live `T_BORNRED_BACKLOG` rows, five are glass-ui external handoffs, each
also mirrored in `demo/glass-ui-gaps.ts`:

| Gate | gap id | glass-ui ask | Evidence |
|---|---|---|---|
| `proof:dock-rest-crisp` | dockRestBlur | GU-1 | `gate-bands.mjs:714`; resting dock `blur(3px)` |
| `proof:dock-morph-continuity` | dockMorphMeasure | GU-2 | `gate-bands.mjs:726`; 58→14→225px jump-cut |
| `proof:subject-legible` | (dock icon) | GU-1 | `gate-bands.mjs:626`; resting blur over glyph |
| `proof:blur-not-resampled` | staticBackdrop | BG-5 | `gate-bands.mjs:636`; backdrop re-raster/frame |
| `proof:dock-zorder` | drawerDetentInset | BG-11 | `gate-bands.mjs:738`; Drawer z=140 over dock |

`glass-ui-gaps.ts` additionally carries 4 workaround-bearing gaps
(segmentedTabsAriaOrientation, dockStrandKeepalive, dockDropdownPointerdown,
dockDismissHold) with LIVE band-aid sites, plus BG-6/BG-7 recorded no-band-aid gaps.

**Why they defer:** MEMORY is explicit — kf NEVER patches glass-ui in-demo; every
fix is a glass-ui-root publish + re-pin.
**External/internal:** EXTERNAL (glass-ui).
**U disposition — ONE coordination letter, adopt-vs-replace per gap.** The owner
ruled the demo restructure + glass-ui coordination. U charters a single glass-ui
BG/BH coordination letter that resolves all gaps together and rules adopt-vs-replace
per gap (the BG-11 Drawer was already ADOPTED under owner override, T.H3). The 5
tripwires collapse to the one letter's acceptance set; `glass-ui-gaps.ts` becomes a
thin external-handoff registry, not a growing band-aid ledger. The 3 dead-export
rows for `GlassCapKey`/`GlassUiGap`/`GlassUiGapId` (`proof-no-dead-export.mjs:108-110`)
are resolved by that consolidation.

---

## 8. The ledger machinery itself is the legacy the owner is condemning (MAJOR)

`DISCHARGE` (17) + `RETIREMENT_LEDGER` (19) + `REGRESSION_GUARDS` (10) +
`T_BORNRED_BACKLOG` (8) + `FROZEN_SET` (36) + the two `CEILING` constants together
are ~90 rows of *bookkeeping about deferral* — a bureaucracy erected precisely
because deferral was the operating mode. Structural evidence: `RETIREMENT_LEDGER`
entries are "DERIVED FROM THE TREE, never hand-maintained" (`gate-bands.mjs:428`) —
the machinery exists to track deletions the bands were going to do anyway;
`DISCHARGE` exists so a retired gate can be deleted "without free-prose deletion"
(`gate-bands.mjs:17`); `T_BORNRED_BACKLOG` exists so "failing ⊆ declared backlog,
exactly" (`gate-bands.mjs:606`). All three are apparatus for *managing* deferral,
not for *asserting product truth*.

The 10 `REGRESSION_GUARDS` (`gate-bands.mjs:404-419`) are absence-guards that keep a
deleted anti-pattern deleted (`proof:no-deprecated-guard`, `proof:alias-dropped`,
`proof:no-single-option-select`, …). A few are genuine standing invariants
(`proof:no-hand-rolled-cursor-tracker` guards a pattern authored twice); most guard
legacy that is already gone and will not return once the surface is rebuilt.

**Why it defers:** each ledger was the "honest defer" device the owner has now
terminated for U.
**External/internal:** internal (CI apparatus).
**U disposition — COLLAPSE the machine.** Once findings 1–5 execute (FROZEN
discharged, dead-exports swept, colocation moved, any-floored, roster trimmed), the
DISCHARGE / RETIREMENT / FROZEN / CEILING structures have nothing left to track and
are DELETED. What survives is ONE small `external-handoffs.mjs` registry holding
only the genuine external tripwires (value.js PropertyDescriptor rename +
consolidated glass-ui BG/BH letter). Regression-guards are audited individually:
keep the future-guarding invariants, delete the guards for legacy that cannot recur
post-rebuild. This is the "no more deferrals / no legacy code" edict applied to the
gate roster itself.

---

## Cross-cutting: the internal born-RED remnant

Two `T_BORNRED_BACKLOG` rows are internal, not external:

- `proof:stage-inventory` (`gate-bands.mjs:610`) — the negative-space stage gate;
  RED because the browser rendered-set reconciliation (`KF_REQUIRE_BROWSER=1`) is
  unimplemented and remaining forbidden-chrome DOM prunes are pending. **Folds into
  the demo restructure** (the rebuilt stage carries only the sanctioned inventory;
  the browser reconciliation is authored as part of the rewrite's acceptance).
- `proof:roster-ceiling` — self-referential (finding 1); dies when the trim lands.

Neither is external; both discharge inside U's demo+CI work.

---

## What U must charter

1. **Charter a CI-TRIM band** that deletes tautological gates wholesale and drives
   the roster from 227 to below 120 in ONE pass — then DELETES `ROSTER_CEILING` +
   `proof:roster-ceiling` (a count gate is scaffolding once the trim is real).
2. **Charter the grand demo restructure to DISCHARGE all 36 FROZEN appearance-locks**
   via migration-to-`proof:owner-golden` or witnessed kill; `FROZEN_SET` and the
   frozen-discharge machinery must be EMPTY/DELETED at U-close.
3. **Charter the colocation EXECUTION**: move `gestureSelectSuppression.ts`→`utils/`
   and `kfEngine.ts`→beside `state/`, delete the `proof-colocation.mjs` DEFERRED map,
   and remove its TOLERANT clause so the keystone gate is strict.
4. **Charter the dead-export sweep**: un-export/inline all 26 DEFERRED symbols (esp.
   the 16 reflexive `Use*Return/Options/Deps` interfaces), then delete the `DEFERRED`
   array so `proof:no-dead-export` floors at zero.
5. **Charter the any-ceiling drive-to-zero**: re-type the store/composable/
   keyframes-editor boundaries in the demo restructure, then RETIRE `proof:any-ceiling`.
6. **Charter a value.js coordination letter** requesting `PropertyDescriptor` →
   `CSSPropertyDescriptor` (collision-free); keep `proof:no-collision-rename` as the
   sole value.js external tripwire until the re-pin — do NOT fold internally.
7. **Charter ONE consolidated glass-ui BG/BH coordination letter** resolving the 5
   external born-RED dock/blur/drawer gaps + the 4 workaround-bearing gaps
   adopt-vs-replace; collapse the 5 tripwires + `glass-ui-gaps.ts` to that letter's
   acceptance set.
8. **Charter the collapse of the deferral machinery**: after 1–7 land, delete
   `DISCHARGE`/`RETIREMENT_LEDGER`/`FROZEN_SET`/`T_BORNRED_BACKLOG`/both CEILINGs,
   keeping only a single `external-handoffs` registry (value.js + glass-ui) and the
   future-guarding regression invariants; audit-delete the legacy-only guards.
