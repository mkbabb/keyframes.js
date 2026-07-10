# U.E — NO-DEFERRAL DISCHARGE + LEGACY ZERO

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Charter sentence (U.md §2).** Terminally adjudicate every machine ledger row —
> the 8 `T_BORNRED_BACKLOG` rows (each cured in-U or converted to a DEADLINED external
> covenant, NONE carries to V), the 36 `FROZEN_SET` appearance-locks (discharged
> wholesale, the restructure IS their declared trigger), the ~33 live chronic-ledger
> FOLD rows + the DM-9..DM-15 defect chronics (each to a live-green witness on the
> merged SHA) — then execute LEGACY ZERO across the source and config: the 26 demo +
> 26 un-patrolled `src/` dead exports swept, `proof:chronic-closure` deleted, ~110KB
> of orphaned assets `git rm`'d, the tranche-tag comment archaeology purged (provenance
> lives in `docs/`), the constants back-compat barrel dissolved, `registerStoreReset` +
> the VJ-L2 pending scaffold + the `SceneExposedApi` dual-path deleted, the
> `proof-deps-current` FLOORS re-based, and the per-version MIGRATION docs consolidated.
>
> **Provenance lanes:** 02 (precepts-conformance — the five structural legacy findings:
> glass-ui band-aid cluster, SceneExposedApi dual-path, deps-current stale floors, VJ-L2
> scaffold, constants label), 04 (deferral-archaeology-docs — the four chronics + the
> honest-defer device as the deferral engine), 05 (deferral-machine-ledgers — the nine
> live ledger structures + the ~90-row bookkeeping bureaucracy), 06 (chronic-census —
> the two unreconciled registers, the stale substrate, the DM-9..DM-15 unverified
> chronics, the RED-on-defect→GREEN-on-SHA acceptance bar), 31 (legacy-census-total —
> the 26+26 dead-export double, the orphaned assets, the speculative seams, the
> back-compat barrel, the MIGRATION phantom).
>
> **Ring-fences honored (U.md §4):** the owner-golden mechanism SURVIVES — the 36
> FROZEN appearance-locks discharge INTO it, not out of existence (fence 3); value.js
> internals are untouched — KF-7 converts to a coordination covenant handed to U.F, no
> in-realm rename (fence 1); the LIGHT/HEAVY boundary is preserved by every src
> dead-export un-export (byte-neutral, no import moves across the static/dynamic seam,
> fence 2). Net gate count only goes DOWN — U.E authors ZERO new standing gates
> (§6 anti-sprawl). DEVELOPMENT ONLY — this is the charter, not the edit.

---

## §E.0 — The measured ground truth (read from the tree @ 5.2.0, `tranche-u-dev`)

| Fact | Value | Source (verified) |
|---|---|---|
| `T_BORNRED_BACKLOG` rows | **8** (6 external, 2 internal) | `import()` over `gate-bands.mjs` — keys enumerated live |
| `FROZEN_SET` rows | **36** live, **0** discharged | `import()` over `gate-bands.mjs` (`:27`) |
| `proof:dock-zorder` DOUBLE-registered | in **both** `FROZEN_SET` (`:54`) AND `T_BORNRED_BACKLOG` | the two-register finding, live |
| `REGRESSION_GUARDS` | **10** | `import()` (folds to lint at U.A3, not U.E) |
| demo dead-export `DEFERRED` rows | **26** (16 reflexive `Use*` types, 2 dead tables, 1 orphan, `registerStoreReset`, 3 glass-ui-gap types, 1 easing type) | `proof-no-dead-export.mjs:70-113` |
| `src/animation` dead exports | **26**, ZERO gate coverage (`EXPORT_ROOT="demo"` only) | lane 31 census; `proof-no-dead-export.mjs:62` |
| chronic-ledger substrate | HARDCODED `docs/tranches/S/PROGRESS.md` (one tranche stale; T never re-pointed) | `proof-chronic-closure.mjs:145,638` |
| live chronic FOLD rows un-witnessed | **~33** | `T/PROMPT-RECAP.md:150`; S ledger `:103` |
| DM defect chronics (7–11 tranche rides) | **DM-9..DM-15**, PRESENT-in-ledger checked, tree-state NEVER asserted | `proof-chronic-closure.mjs:651-664` |
| orphaned binary assets | **2** = 110,472 bytes (`checkerboard.jpg` 103,890 + `cube.png` 6,582) | `ls -la`, zero code refs (lane 31 F4) |
| tranche-tag archaeology (src files) | **117** files carry `S.B1`/`T.M3`/`OD-N`/`R.W`-class provenance comments | `grep -rlE` over `src/animation` |
| `proof-deps-current` FLOORS | value.js pinned to **0.13.0** (pre-1.0, 3 majors stale); `parse-that 0.9.0` for a SEVERED dep | `proof-deps-current.mjs:72-73` |
| MIGRATION docs | `MIGRATION-5.0.0.md` + `MIGRATION-5.1.0.md` exist; `proof:changelog` cites phantom `MIGRATION-5.2.0.md` | `ls docs/MIGRATION*`; `proof-changelog.mjs:31` |
| VJ-L2 pending scaffold | `vjL2LinearLanded` probe + `it.skipIf` + PENDING witness — source ALREADY declares VJ-L2 consumed at value.js ≥1.0.0 | `roundtrip-easing.test.ts:46,163,170`; `easing-registry.ts:106-108` |
| `SceneExposedApi` dual-path | `facility?` + legacy `animationGroup?`/`scenePlayback?` side-by-side; all 6 scenes expose BOTH | `sceneExposedApi.ts:24-31`; `useSceneMachineShellBinding.ts:163,220,266` |

**The one sentence (lanes 04/05/06 convergent).** The deferral corpus is NOT dominated
by open bugs — the concrete ones (EN-a/EN-b) landed in-tree; it is dominated by TWO
kf-owned institutional devices (the born-RED backlog + the chronic ledger) and TWO
genuinely-external chronics (glass-ui dock, value.js KF-7), and the "honest defer"
apparatus is itself the deferral ENGINE that let the same defects ride 4–11 tranches
under green CI. U.E adjudicates every row to terminal state; U.A5 then deletes the
now-empty machinery; nothing carries to V.

---

## §E.1 — The wave table

| # | Title | Substance | Size | Gate / oracle | Edges |
|---|---|---|---|---|---|
| **U.E1** | `T_BORNRED_BACKLOG` — the 8-row terminal adjudication (NONE carries) | Partition the 8 rows: 6 external → DEADLINED covenants handed to U.F (5 glass-ui: `subject-legible`, `blur-not-resampled`, `dock-rest-crisp`, `dock-morph-continuity`, `dock-zorder`; 1 value.js: `no-collision-rename`/KF-7); 2 internal fixed-or-re-judged in-U (`stage-inventory` folds into U.B's rebuilt stage; `roster-ceiling` the "defect" vanishes when U.A's trim lands). The row-by-row disposition table is the deliverable; the register's wholesale deletion is U.A5's motion | M | one-shot: the adjudication table complete + every row's forward-owner named; the register deleted with `gate-bands.mjs` (U.A5) | co-own U.A5 (deletion) + U.F (covenants); after U.A trim settles `roster-ceiling` |
| **U.E2** | `FROZEN_SET` 36 — wholesale discharge into owner-golden | Each of 36 appearance/geometry locks discharged AS the U.B restructure deletes its subject: its surviving live property migrates to `proof:owner-golden` (the T.M3 blessed oracle, U.G authority) OR is killed with a re-run witness (the subject pruned). `FROZEN_SET` EMPTY at close, deleted with `gate-bands.mjs`. The 36-row class-adjudication table is the deliverable | L | `proof:owner-golden` (SURVIVES — fence 3); the FROZEN register absent post-U.A5 | CO-SCHEDULED with U.B moves + U.A4 (the 77-gate appearance dissolution — same commit); needs U.G golden authority |
| **U.E3** | The chronic ledger adjudicated + `proof:chronic-closure` DELETED | Adjudicate the ~33 live FOLD rows to terminal dispositions (fix / delete-subject / external-covenant); run the DM-9..DM-15 cited browser gates on the merged tree → CLOSED-with-live-witness or re-open as a U cure (no defer device to re-book into); collapse the two parallel registers (S ledger + T backlog, U.E1) into ONE terminal sweep; DELETE `proof:chronic-closure` (do NOT re-point the substrate — with no honest-defer device there is no ledger) | L | one-shot: DM-9..DM-15 live-green witnesses recorded in `docs/`; `proof:chronic-closure` deleted (co-U.A5) | U.E1 (T backlog); co-own U.A5; the DM witnesses ride U.A7's nightly roster driver |
| **U.E4** | The dead-export DOUBLE sweep (26 demo + 26 src) + speculative-seam edict | Demo: un-export the 16 reflexive `Use*Options/Return/Deps` interfaces, DELETE the 2 dead description tables (`COLOR_SPACE_DESCRIPTIONS`, `HUE_METHOD_DESCRIPTIONS`) + `captureNonDefaultSnapshot` + `registerStoreReset` (zero consumers, speculative seam), delete the `DEFERRED` array + ratchet. Src: drop `export` on the 26 symbol-grain dead exports (`renderFrame`, `fmtNum`, `SELECTOR_*_RE`, `DensifyResult`, `SpringSolution`, … — byte-neutral, all used in-file); RE-ARM `proof:no-dead-export` to a SECOND root (`src/animation`) so the library blind spot is guarded, floor both at zero | M | `proof:no-dead-export` floors at 0 for BOTH roots (re-armed, not new); a one-shot re-introduction witness reds | co-sched U.B (demo rows sit under `components/custom/` → move WITH the `custom/` dissolution) + U.C (src un-exports touch carved files); the 3 glass-ui-gap types resolve by U.F |
| **U.E5** | Source LEGACY ZERO — orphaned assets + comment archaeology + the constants barrel | `git rm` the 2 orphaned assets (110KB) + their `demo/CLAUDE.md` mentions; purge the tranche-tag comment archaeology across the 117 src files (provenance moves to `docs/`, NO-LEGACY: source narrates behavior, not tranche history); DISSOLVE the constants back-compat barrel (colocation-true: LIGHT importers → `constants/types`, the ≤8 runtime consumers → `constants/defaults`, delete the barrel that exists only to mimic a deleted monolith) | M | `npm test` + `check` green post-move; asset-reachability folds as a clause of an existing hygiene gate (NOT a new gate) | co-sched U.C (constants dissolution touches the carved library); comment purge rides every U.B/U.C move |
| **U.E6** | Stale config + doc + scaffold reconciliation | Re-base `proof-deps-current` FLOORS to the live constellation (value.js → 3.x floor, DELETE the `parse-that 0.9.0` entry for the severed dep, collapse the K/J archaeology comment block); reconcile the VJ-L2 pending scaffold (delete `vjL2LinearLanded` + `skipIf` + PENDING witness, make the round-trip arm UNCONDITIONAL against the shipped 3.x parser); fold the `SceneExposedApi` legacy dual-path (delete `animationGroup?`/`scenePlayback?`, the 3 shell reads → `facility.*`, drop the dual expose from all 6 scenes — rides WITH U.B's SceneFacility subsumption); consolidate `MIGRATION-5.0.0/5.1.0` → one version-sectioned `docs/MIGRATION.md` (fix the `proof:changelog` phantom, or moot it if U.A5 deletes the gate); set the `gcAndMigrateStoreBuckets` sunset condition (retires once the 7-day store TTL guarantees no pre-T.B9 bucket survives) | M | the VJ-L2 arm runs unconditionally (npm test); deps floor bites 3.x; one-shot: `SceneExposedApi` has ONE surface | co-sched U.B (SceneExposedApi) + U.C/U.F (deps floor) + U.F (VJ-L2 consume-edge) |

**Net gate delta (the band's headline):** U.E authors **ZERO new standing gates**.
It DELETES `proof:chronic-closure` (co-U.A5), the dead-export `DEFERRED` ratchet, and
contributes the ROW CONTENTS whose emptying lets U.A5 delete `FROZEN_SET` /
`T_BORNRED_BACKLOG` / `ROSTER_CEILING` wholesale. `proof:no-dead-export` is RE-ARMED
(second root), not added. Asset-reachability + the constants-dissolution invariant fold
into EXISTING hygiene/lint gates. Every external row becomes a deadlined covenant in
U.F, never a standing kf tripwire.

---

## §E.2 — The terminal adjudication tables

### Table 1 — `T_BORNRED_BACKLOG` (8 rows → NONE carries to V)

| Gate | Realm | gap / cause | Disposition | Forward-owner |
|---|---|---|---|---|
| `proof:subject-legible` | glass-ui | resting dock blur over the glyph (GU-1) | DEADLINED covenant | U.F glass-ui letter |
| `proof:blur-not-resampled` | glass-ui | backdrop re-raster per frame (BG-5, VERDICT #19) | DEADLINED covenant | U.F glass-ui letter |
| `proof:dock-rest-crisp` | glass-ui | resting `blur(3px)` (GU-1) | DEADLINED covenant | U.F glass-ui letter |
| `proof:dock-morph-continuity` | glass-ui | 58→14→225px jump-cut (GU-2) | DEADLINED covenant | U.F glass-ui letter |
| `proof:dock-zorder` | glass-ui | Drawer z=140 over dock (BG-11) — ALSO in `FROZEN_SET` | DEADLINED covenant (de-duplicated across registers) | U.F glass-ui letter |
| `proof:no-collision-rename` | value.js | `PropertyDescriptor` collides → `PropertyDescriptor_2` in published d.ts (KF-7) | DEADLINED covenant + keep the ONE consume-verification tripwire until re-pin | U.F value.js letter |
| `proof:stage-inventory` | INTERNAL | browser rendered-set reconciliation unimplemented | FIX in-U — the rebuilt stage carries only the sanctioned inventory; the reconciliation authored as U.B acceptance | U.B (demo restructure) |
| `proof:roster-ceiling` | INTERNAL | 227 > 120 self-referential count | RE-JUDGE not-a-defect — the count "defect" vanishes when U.A's trim collapses the roster; the ceiling gate dies with `gate-bands.mjs` | U.A (trim) + U.A5 |

**The covenant is NOT a tripwire.** A deadlined covenant (U.F) has an absorb-or-expire
deadline (OD-U4 language): kf re-pins the moment the sibling publishes, or the covenant
EXPIRES to an owner decision — never a fifth silent re-carry. This is the ONLY honest
fold for a USER-DOMAIN chronic under NO-MORE-DEFERRALS (lane 06 F4).

### Table 2 — `FROZEN_SET` 36 (discharge classes)

The 36 keys partition by discharge mechanism; each row's SURVIVING live property (if any)
migrates to `proof:owner-golden`, else the subject is pruned with a re-run witness. All
36 discharge AS the U.B restructure lands (the S.G1/S.D3 "demo rewrite" trigger the
freeze declared, finally happening — lane 05 §2).

| Class | Keys (representative) | Count | Discharge |
|---|---|---|---|
| Perceptual/taste locks | `proof:idioms`, `proof:styling-idioms`, `proof:icon-idiom`, `proof:taste-packet`, `proof:demo-elevate`, `proof:demo-usability`, `proof:crayon-preserved`, `proof:dogfood-hero`, `proof:pp-logo-svg` | 9 | → `proof:owner-golden` (the property IS taste) |
| Px-geometry locks | `proof:timeline-rail-width`, `proof:demo-shell-grid`, `proof:label-subgrid`, `proof:single-column-pack`, `proof:layout-cluster`, `proof:scene-card-rounded`, `proof:card-rounded-primitive`, `proof:demo-no-oversize` | 8 | KILL — geometry of a rewritten surface; owner-golden covers the visual result |
| Structural/containment | `proof:stage-within-docks`, `proof:stage-glass-card`, `proof:stage-not-clipped`, `proof:cartoon-shadow-unclipped`, `proof:cartoon-is-panel-depth`, `proof:glass-and-cartoon`, `proof:occlusion`, `proof:dock-zorder` | 8 | KILL (`dock-zorder` → U.E1 covenant); the rest → owner-golden |
| Scene-parity/ribbon | `proof:scene-parity`, `proof:scene-uses-standard-ribbon`, `proof:phi-leaf-zero`, `proof:typing-dots`, `proof:mobile-single-page` | 5 | → `proof:demo-smoke` (behavioral) + owner-golden |
| Interaction/state | `proof:dock-popover-opens`, `proof:single-toggle`, `proof:darkmode-row-toggle`, `proof:idle-fade`, `proof:drawer-spring`, `proof:sequence-rows-draggable` | 6 | → `proof:demo-smoke` (the behavior actuates) |

(`proof:demo-smoke` here is an EXISTING gate RE-ARMED for the behavioral discharge — NOT a new
gate; per OD-U10/U11 there are **NO new standalone gates in U** — `proof:scripts-colocated`
(U.A9) and `proof:chunk-graph` (U.D6) were BOTH DROPPED to clauses on existing gates
(`proof:colocation` + lint; `proof:publish`), net NEW standalone gates = ZERO.)

`FROZEN_SET` (+ the ci-coverage frozen-discharge clause) is EMPTY and DELETED at close.
A frozen px-lock is legacy the moment its surface is rebuilt (lane 05 §2).

### Table 3 — the dead-export double (26 demo + 26 src)

| Cohort | Grain | Action | Notes |
|---|---|---|---|
| 16 reflexive `Use*Options/Return/Deps/Emit/Handlers` (demo transport) | symbol | DROP `export` (used only in-file) | paths under `components/custom/` → move WITH U.B's `custom/` dissolution |
| `COLOR_SPACE_DESCRIPTIONS`, `HUE_METHOD_DESCRIPTIONS` (demo) | data table | DELETE outright | zero consumers; describe controls no longer rendered |
| `captureNonDefaultSnapshot` (demo) | fn | DELETE outright | fully orphaned, never referenced even in-file |
| `registerStoreReset` (demo `@/state`) | fn + export | DELETE (speculative seam, zero consumers) | reverses the DEFERRED "deliberate retention"; NO speculative seams (lane 31 F6) |
| `GlassCapKey`, `GlassUiGap`, `GlassUiGapId` (demo) | type | resolved by the U.F glass-ui consolidation | `glass-ui-gaps.ts` collapses to a thin external registry |
| `CurveGroup`, `ToolbarKeyboard`, `UseKfPillTabsParams` (demo) | type | DROP `export` | reflexive types |
| 26 `src/animation` symbols (`renderFrame`, `fmtNum`, `SELECTOR_PERCENT_RE`, `DensifyResult`, `SpringSolution`, `NormalizedSpringSampleOptions`, `endValueFor`, `emitCompositionFallback`, …) | symbol | DROP `export` (all used in-file) | byte-neutral; shrinks the d.ts / API-Extractor surface; RE-ARM the gate to `src/animation` |

The `DEFERRED` array + ratchet machinery is DELETED — the gate collapses to a pure
"zero dead export, both roots" oracle. No "post-facility" survives (the facility lane
shipped at T; lane 31 F2).

### Table 4 — the chronic ledger (the ≥4-tranche defect rows)

| Chronic | Born | Rides | Cited runtime gate | U disposition |
|---|---|---|---|---|
| DM-9 specular | D | 8→9 | `proof:specular-absent-at-rest` | run on merged SHA → CLOSED-with-witness or re-cure |
| DM-10 typography | D | 9→10 | `proof:font-census` | CLOSED-with-witness |
| DM-11 spring-slider | D | 10→11 | `proof:spring-slider-continuous` | CLOSED-with-witness (highest ride) |
| DM-13 engine-no-throw | A | 8→9 | `proof:engine-diagnostic` (compile-honored) | CLOSED-with-witness |
| DM-14 fsm-suspend | H | 7→8 | `proof:fsm-suspend-resume-live` | CLOSED-with-witness |
| ~33 live FOLD rows (mobile-sheet occlusion, hidden-affordance, square-lying-controls, KfPillTabs-keyboard, …) | S | — | per-row | fix-in-U / delete-subject / U.F covenant |

Acceptance bar (lane 06 F7): **RED-on-defect → GREEN-on-current-SHA with a re-derived
witness** (the row-1 / DM-20 deploy pattern that closed honestly). No chronic exits U
on paperwork. `proof:chronic-closure` is then DELETED — with no honest-defer device
there is no ledger to police, and re-pointing the hardcoded `S/PROGRESS.md` substrate
only perpetuates the per-tranche manual migration that already failed once (S→T,
lane 06 F1).

---

## §E.3 — Wave detail

### U.E1 — `T_BORNRED_BACKLOG` terminal adjudication

**Substance.** The 8 rows (Table 1) partition into 6 external + 2 internal. The 6
external convert to DEADLINED covenants authored in U.F (5 glass-ui into ONE
consolidated BG/BH letter; 1 value.js KF-7 into the `KF-TO-VALUEJS-U.md` letter). The 2
internal resolve in-realm: `proof:stage-inventory` is FIXED as U.B rebuilds the stage
(the browser rendered-set reconciliation is authored as the rewrite's acceptance, not a
standalone born-RED); `proof:roster-ceiling` is RE-JUDGED not-a-defect (the 227>120
"defect" is an artifact of the count game U.A dissolves — the gate dies with
`gate-bands.mjs`).

**Why gestalt.** Lane 04/05/06 converge: the born-RED-exit-0 device is the "honest
defer" the owner terminated, relocated from a markdown table into a JS object. A born-RED
gate is legitimate ONLY as the forward half of a FOLD with an in-tranche owning wave; an
external handoff or a "converges someday" is a deferral. `proof:no-collision-rename` keeps
the ONE value.js consume-verification tripwire (it greens the instant value.js renames +
kf re-points — a legitimate published-consume covenant, NOT a wrong-realm proxy), but
under a DEADLINE, not a standing carry.

**Gate/oracle.** The adjudication table complete with every row's forward-owner; the
register deleted with `gate-bands.mjs` (U.A5, co-owned). No new gate.

**Edges.** Co-own U.A5 (the register's deletion) + U.F (the 6 covenants); `roster-ceiling`
re-judgement follows U.A's trim. `proof:dock-zorder` is de-duplicated across FROZEN_SET
(U.E2) + this backlog in the SAME motion (the two-register collapse, lane 06 F2).

**Evidence.** `gate-bands.mjs` T_BORNRED_BACKLOG 8 keys (live `import()`);
`proof:no-collision-rename` reason (value.js 3.1.0 still un-renamed); `dist/keyframes.d.ts`
(`PropertyDescriptor_2` × 3); `demo/glass-ui-gaps.ts:104,149,159,169`.

---

### U.E2 — `FROZEN_SET` 36 wholesale discharge

**Substance.** All 36 keys (Table 2) discharge AS U.B restructures their subject: the
surviving live property migrates to `proof:owner-golden` (perceptual/structural) or
`proof:demo-smoke` (interaction/scene-parity), or the subject is KILLED with a re-run
witness (px-geometry of a rewritten layout). `FROZEN_SET` is EMPTY at U-close; the freeze
machinery (`FROZEN_SET` + the ci-coverage frozen-discharge clause) is DELETED with
`gate-bands.mjs`.

**Why gestalt + CO-SCHEDULING.** The freeze was authored at S.A4 as a "RED-authorized
ossifying set" to be discharged LATER by the S.G1/S.D3 demo rewrite that kept slipping
(SHELVED in S, never executed in T). U's grand demo restructure IS that event finally
happening — so the discharge rides WITH the U.B move that deletes the subject (never a
window of green-against-moved-files, the lane-32 discipline). This is co-scheduled with
U.A4 (the 77 line-anchored appearance gates) — many FROZEN keys ARE those gates; they
retire in ONE pass.

**Gate/oracle.** `proof:owner-golden` (SURVIVES — fence 3, the appearance genre dissolves
INTO it, not out of existence) + `proof:demo-smoke`. Neither is authored by U.E — both are
U.A4/U.G re-arms; U.E supplies the row-by-row discharge map.

**Edges.** CO-SCHEDULED with U.B (every scene/transport/editor move) + U.A4; HARD-GATED on
U.G ratifying the owner-golden authority + idle-state capture protocol (else the discharge
has no migration target).

**Evidence.** `gate-bands.mjs:8-16` (the freeze's self-declared discharge trigger = "the
demo rewrite, S.G1/S.D3"), `:27-97` (the 36 keys); lane 05 §2.

---

### U.E3 — the chronic ledger adjudicated + `proof:chronic-closure` DELETED

**Substance.** (a) Adjudicate the ~33 live FOLD rows to terminal dispositions
(fix-in-U / delete-subject / U.F covenant). (b) Run the DM-9..DM-15 cited browser gates
(Table 4) on the merged tree — each marked CLOSED-with-live-witness (recorded in `docs/`)
or re-opened as a U cure (no defer device exists to re-book into, so "re-open" = a U wave
fixes it). (c) Collapse the two parallel registers — the S-ledger `## Open deferrals`
rows and the T `T_BORNRED_BACKLOG` (U.E1) — into ONE terminal sweep. (d) DELETE
`proof:chronic-closure` (co-U.A5).

**Why NOT re-point the substrate.** Lane 06 F1: the meta-gate hardcodes the STALE
`docs/tranches/S/PROGRESS.md` (T never re-pointed it — the exact `M/O/P.WZ` no-skip sin
the gate's own header condemns). The idiomatic cure is NOT to re-point to `U/PROGRESS.md`
(that perpetuates the per-tranche manual migration that already failed once) — it is to
DELETE the gate. With the honest-defer device terminated (the owner's edict), there is no
ledger to police; the two registers have nothing left to reconcile once every row is
terminal.

**Gate/oracle.** One-shot: the DM-9..DM-15 live-green witnesses on the merged SHA
recorded in `docs/`; `proof:chronic-closure` absent post-deletion. No new gate.

**Edges.** U.E1 (the T backlog is one of the two registers); co-own U.A5 (deletion); the
DM witnesses ride U.A7's device-agnostic nightly roster driver (no rewrite).

**Evidence.** `proof-chronic-closure.mjs:145,638` (hardcoded S substrate), `:651-664`
(EXPECTED greps PRESENCE not tree-state); `T/PROMPT-RECAP.md:150` (~33 un-witnessed);
S ledger rows 6-14 (DM chronicity 6-11); lane 06 F1/F2/F6/F7.

---

### U.E4 — the dead-export DOUBLE sweep + speculative-seam edict

**Substance.** DEMO (26 rows, Table 3): un-export the 16 reflexive `Use*` interfaces
(a return type consumed only in-file needs no exported alias); DELETE the 2 dead
description tables + `captureNonDefaultSnapshot` + `registerStoreReset` outright; delete
the `DEFERRED` array + ratchet. SRC (26 symbols): drop the `export` keyword on each
symbol-grain dead export (every one is used in-file — byte-neutral to behavior, shrinks
the d.ts). RE-ARM `proof:no-dead-export` to a SECOND export root (`src/animation`, the
same censer, consumer scan spanning all four roots) so the library blind spot the coarse
trio (`no-orphan-module` file-grain, `no-dead-dependency` package-grain) never covered is
guarded at zero.

**Why gestalt.** The reflexive `Use<Name>Return/Options/Deps` idiom is a house habit of
"name the shape you return" — NOT API (no external file imports these). The structural
rule: a composable exports its shapes ONLY when a second file consumes them — enforced by
the generalized gate, not hand-curated exemptions. `registerStoreReset` is a speculative
seam kept "for the next feature store" — YAGNI as a standing exemption; a contract with no
consumer is dead code with a comment (lane 31 F6). NO speculative retention.

**Gate/oracle.** `proof:no-dead-export` floors at 0 for BOTH roots (RE-ARMED, not new — no
anti-sprawl cost); a one-shot re-introduction witness reds. If U.A3 folds dead-export into
lint, the second-root coverage folds with it — coordinate.

**Edges.** Co-sched U.B (the 16 demo rows sit under `components/custom/instrument/…` →
their `export` drops WITH the `custom/` dissolution + `@`→`shared` rename, so the paths
re-point ONCE); co-sched U.C (the src un-exports touch carved library files); the 3
glass-ui-gap types resolve by the U.F consolidation.

**Evidence.** `proof-no-dead-export.mjs:62` (`EXPORT_ROOT="demo"`), `:70-113` (the 26
DEFERRED rows); lane 31 F1 (the 26 src census, `renderFrame` at `play-lifecycle.ts:229`
used only `:224-225`), F2/F3/F6.

---

### U.E5 — source LEGACY ZERO: assets + comment archaeology + the constants barrel

**Substance.** (a) `git rm demo/scenes/amiga/checkerboard.jpg`
`demo/scenes/cube/cube.png` (110KB, zero code refs — both scenes render their imagery in
code; pre-fusion relics never re-wired at R.W5) + remove the 2 `demo/CLAUDE.md` mentions.
(b) Purge the tranche-tag comment archaeology across the 117 src files carrying
`S.B1`/`T.M3`/`OD-N`/`R.W`-class provenance — source narrates BEHAVIOR, not tranche
history; provenance lives in `docs/`. (c) DISSOLVE the constants back-compat barrel: the
colocation-true answer (lane 31 F7 option b) — LIGHT type-only importers target
`constants/types` (already the convention), the ≤8 runtime consumers target
`constants/defaults`, DELETE `constants/index.ts` (it exists only to preserve the surface
of a monolith deleted three tranches ago — legacy by definition).

**Why gestalt.** A barrel earns its keep only if it COMPOSES a zone; a barrel retained to
mimic a deleted file is legacy. The re-label (lane 02 F5 option a) is the tolerant
half-measure; under "colocation, colocation, colocation" + NO-LEGACY, the dissolution is
the idiomatic answer — importers reach the real module, and the "back-compat" narrative
dies. An asset-reachability invariant (every non-code file under `demo/scenes/**` named by
a live `import`/`new URL`/`url()`) folds as a CLAUSE of an existing hygiene gate, not a
new `proof-*.mjs` (anti-sprawl).

**Gate/oracle.** `npm test` + `check` green post-move; asset-reachability + the
"no back-compat barrel" invariant as clauses of existing gates. No new standing gate.

**Edges.** Co-sched U.C (the constants dissolution re-points the carved library's imports
— ONE pass with U.C's moves, never two); the comment-archaeology purge rides every
U.B/U.C edit (touch-once).

**Evidence.** `ls -la` (110,472 bytes, zero grep refs); `grep -rlE` (117 src files with
tranche tags); `constants/index.ts:1-3` (the "preserve the EXACT import surface of the
former monolithic `constants.ts`" header); lane 31 F4/F7, lane 02 F5.

---

### U.E6 — stale config + doc + scaffold reconciliation

**Substance.** (a) Re-base `proof-deps-current.mjs` FLOORS (`:72-73`): value.js floor
`0.13.0` → the current 3.x protection floor (comment states the ONE regression it guards,
not the K/J archaeology), DELETE the `@mkbabb/parse-that 0.9.0` entry (severed dep; clause
3's `!kfRange` branch already handles absence structurally), collapse the `:61-96`
stratigraphy to the single live rationale. (b) Reconcile the VJ-L2 pending scaffold in
`roundtrip-easing.test.ts`: delete the `vjL2LinearLanded` probe + `it.skipIf` guard +
PENDING witness, make the round-trip arm UNCONDITIONAL against the shipped 3.x parser (the
source at `easing-registry.ts:106-108` already declares VJ-L2 CONSUMED at value.js
≥1.0.0). (c) Fold the `SceneExposedApi` dual-path: delete `animationGroup?`/`scenePlayback?`
from the descriptor, rewrite the 3 `useSceneMachineShellBinding` reads (`:163,220,266`) →
`facility.*`, drop the dual expose from all 6 scenes — RIDES WITH U.B's SceneFacility
subsumption. (d) Consolidate `MIGRATION-5.0.0/5.1.0` → one version-sectioned
`docs/MIGRATION.md`, resolved by the changelog gate from the version diff (fix the phantom
`MIGRATION-5.2.0.md` reference — or moot it if U.A5 deletes `proof:changelog` as a
self-policing gate). (e) Set the `gcAndMigrateStoreBuckets` sunset: the pre-T.B9 bucket
migration retires once the 7-day store TTL guarantees no legacy-cased bucket survives (a
retirement condition, NOT a delete — it is a user-data migration, KEEP with a sunset).

**Why gestalt.** Each is a stale scaffold that LIES about the current dependency/surface
state: a floor gate that passes vacuously (`^3.1.0` ≥ `0.13.0` asserts nothing), a test
that documents a hold the source treats as consumed, a dual-path beside its replacement,
a phantom migration doc. NO-DEFERRALS residue = a chronic-defer scaffold whose deferral
already resolved. Reconcile to the single live truth.

**Gate/oracle.** The VJ-L2 arm runs unconditionally (`npm test`); the deps floor bites the
3.x line; one-shot: `SceneExposedApi` carries ONE surface (no fallback chain); one living
`MIGRATION.md`. No new gate.

**Edges.** Co-sched U.B (SceneExposedApi is co-listed as the SceneFacility subsumption) +
U.C/U.F (deps floor re-base pairs with the constellation) + U.F (VJ-L2 is the value.js
consume-edge). `gcAndMigrateStoreBuckets` sunset is standing (verified at close).

**Evidence.** `proof-deps-current.mjs:72-73` (stale floors); `roundtrip-easing.test.ts:46,
163,170,194` + `easing-registry.ts:106-108` (the contradiction); `sceneExposedApi.ts:24-31`
+ `useSceneMachineShellBinding.ts:163,220,266` (the dual-path); `ls docs/MIGRATION*` +
`proof-changelog.mjs:31` (the phantom); `storeUtils.ts:47` (the gc migration); lane 02
F2/F3/F4, lane 31 F8.

---

## Risks + the re-arm map

The stale-era re-arm class is EXPECTED (U.md §5): every U.E discharge/deletion invalidates
some gate's expectation. Disposition is DELETE (the genre/ledger dissolves) or RE-ANCHOR /
RE-ARM (an existing gate survives, re-pointed) — cited per wave. U.E adds NO standing gate.

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **E1** | `T_BORNRED_BACKLOG` (8 rows); `proof:no-collision-rename`; the 5 glass-ui born-RED gates | DELETE the register (co-U.A5); the 6 external → U.F DEADLINED covenants; `no-collision-rename` kept as the ONE value.js consume-verification tripwire until re-pin; the 2 internal FIXED (U.B) / re-judged (U.A) |
| **E2** | `FROZEN_SET` (36) + the ci-coverage frozen-discharge clause; the 77 line-anchored appearance gates (shared with U.A4) | DELETE the freeze machinery (co-U.A5); RE-ARM the surviving properties as `proof:owner-golden` (fence 3) + `proof:demo-smoke` — CO-SCHED U.B/U.A4, HARD-GATED on U.G |
| **E3** | `proof:chronic-closure` (723L) + the S-ledger substrate + the T backlog register | DELETE `proof:chronic-closure` (do NOT re-point — no honest-defer device, no ledger); the DM-9..DM-15 witnesses recorded in `docs/`, not a standing gate |
| **E4** | the demo `DEFERRED` ratchet (26 rows); `proof:no-dead-export`'s `EXPORT_ROOT="demo"` scope; the 26 un-guarded src exports; `any-ceiling` boundary overlap | DELETE the ratchet; RE-ARM the gate to a SECOND root (`src/animation`), floor both at 0; the demo rows re-point WITH U.B's `custom/` dissolution |
| **E5** | 2 orphaned assets; the 117-file tranche-tag comment archaeology; `constants/index.ts` back-compat barrel (52 importers) | `git rm` the assets (asset-reachability → existing hygiene clause); purge the comments (source narrates behavior); DISSOLVE the barrel → `constants/types`+`constants/defaults` (co-U.C, ONE pass) |
| **E6** | `proof-deps-current` stale FLOORS; the VJ-L2 `skipIf` scaffold; the `SceneExposedApi` dual-path; the `MIGRATION-5.2.0.md` phantom; the `gcAndMigrate` migration | RE-BASE the floors to 3.x (DELETE the parse-that entry); make the VJ-L2 arm unconditional; FOLD the dual-path (co-U.B); consolidate MIGRATION (fix/moot the phantom per U.A5); SUNSET the gc migration (KEEP, not delete) |

**Standing invalidation the band CREATES, not clears (forwarded):** U.E2's discharge
targets (`proof:owner-golden` + `proof:demo-smoke`) depend on U.G ratifying the golden
authority + idle-state capture protocol — if U.G slips, the 36-row FROZEN discharge has
no migration home, so E2 is HARD-GATED on U.G (not merely co-scheduled). U.E1's 6 external
covenants depend on U.F authoring the glass-ui BG/BH letter + `KF-TO-VALUEJS-U.md` with
absorb-or-expire DEADLINES — the covenant is the fold; without U.F's deadline the external
rows would silently re-carry (the exact device U terminates). These two are the band's
inter-band load-bearing edges.

**Net gate delta (the band's headline):** U.E authors ZERO new standing gates. It DELETES
`proof:chronic-closure` + the dead-export `DEFERRED` ratchet, and its row-emptying lets
U.A5 delete `FROZEN_SET`/`T_BORNRED_BACKLOG`/`ROSTER_CEILING`/the freeze+ledger machinery
wholesale. `proof:no-dead-export` is RE-ARMED (second root), the asset-reachability +
no-back-compat-barrel invariants FOLD into existing hygiene/lint gates, and every external
row becomes a deadlined U.F covenant — never a standing kf tripwire. Every row of the map
is DOWN or flat. NO row carries to V.
