# R3-04 — Cross-Blueprint Consistency + Unified Sequencing DAG

**Lane:** R3-04 · **Prefix:** `XB-` · **Date:** 2026-07-17 · **Model:** opus
**Subject:** mechanical composition-check of the four R2 terminal blueprints into ONE
executable program.
**Inputs (read in full):** `R2-05-lib-target-tree.md` (LT-), `R2-06-demo-target-tree.md`
(DT-), `R2-07-gate-test-prune.md` (GP-), `R2-08-doc-manifest.md` (DM-), `AUDIT-REGISTRY.md`.
**Evidence base:** the REAL tree `/Users/mkbabb/Programming/keyframes.js` @ `a59d3a22` +
in-flight K6 transaction (read-only; every quote is `file:line` + command output below).

## Verdict

The four blueprints **very nearly compose**, and their internal fences are honest — but they
are **NOT yet one executable program**. Three hard defects block a clean linearization:

1. **A double-owned, and incorrect, DD-4 demo over-export sweep** — the *library* adjudicator
   (LT-13 / row A33) schedules the *demo* demotions (`DD-4 11 demo`) in library Batch 5, while
   the demo adjudicator (DT-08) schedules one of them; and the flagship symbol
   (`isIOSLikePlatform`) is **live-imported by a test**, so demoting it as "same-file-only"
   reds the demo suite (XB-01, XB-02).
2. **An unreconciled DM-18 ↔ DT ordering edge** — DM-18 rewords glass-provenance comments by
   demo `file:line` that DT *relocates and renames*; no blueprint names the edge (XB-03).
3. **Two double-scheduled prunes / dangling references** — `mirror.test.ts` is PRUNEd by both
   LT-02a and GP (XB-04); `taxonomy.json` is PRUNEd by GP but keeps four live bench prose
   references it never re-homes (XB-05).

The **completeness (total-coverage) rule holds** on a 20-file sample (10 src + 10 demo, all
present in a move-row or KEEP list). **Line-number drift is essentially zero** — 11/11
spot-checked citations land exact; only DM-08's CHANGELOG *numeric* anchor is off-by-one
(textual anchor robust; XB-08). The **atlas TimingFunction fence and the frozen-exports
fence are correctly scoped** (library-only, and the two barrel-touching batches name their
commands) — the only fence gap is FENCE E's "every batch" claim not being echoed in Batches
1/2/5 acceptance, which I verified is low-risk (XB-07).

The library rail (LT) and demo rail (DT) operate on **disjoint trees** and are safely
parallel *except* the shared `mirror.test.ts` prune-ownership and the demo-test gate. A single
topological order is buildable and given in §3.

---

## 1. CONFLICTS

### XB-01 · P1 · family: double-ownership / scope-bleed — the DD-4 demo sweep is owned twice

**Claim:** the demo over-export encapsulation sweep (finding **DD-4**, 11 demo symbols) is
scheduled in **two** blueprints, one of which is out of its lane.

- LT (the `src/` adjudicator) row **A33**: `DD-3 (~32 src) + DD-4 (11 demo) over-exports |
  demote to file-local (post-move scope) | DD-3/DD-4/LT-13` — and LT-13 body: *"Encapsulation
  sweep (DD-3 ~32 src + DD-4 11 demo — LAST, Batch 5)"* (`R2-05:353`, `R2-05:495`).
- DT (the `demo/` adjudicator) **DT-08**: *"Also demote `iosTextEntry.ts`'s
  `isIOSLikePlatform` export (DD-4, same-file-only) while touching the file."*
  (`R2-06:210`).

**Why it's a conflict:** (a) the *library* blueprint schedules *demo* work — a scope error;
demo demotions belong to DT's rail, not LT Batch 5. (b) The two rails are **disjoint** (library
batches vs demo batches B1–B3) with **no cross-reference**, so both could fire. (c) Neither
fully enumerates the 11: DT names exactly one; LT names it as a lump ("11 demo") computed, by
its own coverage-gap admission, "on the flat tree" for *src* — it never re-derives the demo
set. **Reconciliation is required:** assign the entire DD-4 sweep to a single DEMO wave (after
DT moves settle), strike "DD-4 (11 demo)" from LT-13/A33, and re-derive the 11 against the
post-move demo tree **+ test/ + bench/** (see XB-02).

### XB-02 · P1 · family: correctness / masked-fallback — `isIOSLikePlatform` is NOT same-file-only

**Claim:** DT-08 (and LT-13/A33) classify `isIOSLikePlatform` as a DD-4 "same-file-only"
export and demote it to file-local. It has a **live test consumer**, so the demotion breaks
the demo suite.

Evidence:
```
$ grep -rln isIOSLikePlatform demo test | grep -v iosTextEntry.ts
test/demo/instrument/ios-text-entry.test.ts
$ sed -n '4p;38p' test/demo/instrument/ios-text-entry.test.ts
    isIOSLikePlatform,
        expect(isIOSLikePlatform()).toBe(true);   # + :46 :58 :69 :78 — 5 call-sites
```
`test/demo/instrument/ios-text-entry.test.ts:4` imports `isIOSLikePlatform` from
`.../instrument/utils/iosTextEntry` and asserts on it five times. Demoting the export to
file-local makes that import fail to resolve → the demo suite reds.

**Compounding:** this is the *exact* DC-02 error R2-06 itself caught and warned about — R1-05
"grepped `demo/` only" and missed a `test/` consumer (`R2-06:33-39`). The DD-4 "same-file-only"
set was, per both blueprints' own admissions, computed on `demo/` (LT: "on the flat tree"),
**not** against `test/`. So the **whole DD-4 demotion list is unverified** and at least one
member is provably unsafe. It also collides with the very suite GP MR4 wires into CI: after
MR4, this demotion turns the merge gate red. **Fix:** the DD-4 wave must re-grep `test/` +
`bench/` per symbol (DT's own cautionary precedent) and exclude test-consumed symbols;
`isIOSLikePlatform` stays exported.

### XB-04 · P2 · family: double-scheduled-prune — `mirror.test.ts` owned by LT AND GP

`test/support/mirror.test.ts` → PRUNE appears in **both** blueprints as an owned action:
- LT-02a / row **A1**: *"`test/support/mirror.test.ts` → PRUNE ... Batch 0, strictly before
  any move"* (`R2-05:75`, `R2-05:463`).
- GP test-file table + explicit-decisions: *"`support/mirror.test.ts` | PRUNE"* /
  *"mirror.test.ts (TC-4): PRUNE"* (`R2-07:133`, `R2-07:237`).

Same delete, two owners, no cross-reference. Idempotent so it will not corrupt state, but the
**ownership is unreconciled** — if both waves run, the second `git rm` errors on an
already-deleted path. Assign to exactly one wave (natural home: LT Batch 0, since it must
precede the library moves; GP should defer to it with a one-line note).

### XB-05 · P2 · family: dangling-reference-after-prune — taxonomy.json prune orphans 4 bench comments

GP PRUNEs `taxonomy.json` on the ground *"no consumer ... inert (no gate/script/test reads
it)"* (`R2-07:141`, `R2-07:230`). The *reads* claim is true (all references are prose), but
**five shipped files carry `taxonomy.json` comment references**, and GP re-homes only one:
```
$ grep -rln 'taxonomy.json' bench src | ...
bench/resolve.bench.ts:6         bench/group-composite.bench.ts:29
bench/cold-import.bench.ts:25    bench/spring-tick.bench.ts:233
src/animation/compile/interpolate.ts:257   (the one GP routes to the doc wave, PF-3)
```
GP's table folds only `interpolate.ts:257-259` into the doc wave; the **four bench prose
comments** (`resolve.bench.ts:5-6`, `group-composite.bench.ts:29-31`, `cold-import.bench.ts:25`,
`spring-tick.bench.ts:233`) become stale references to a deleted file, owned by **neither GP
(only interpolate.ts routed) nor DM (bench comments not in the manifest)**. Coverage gap —
route the four bench comment folds into the doc wave alongside PF-3, or keep them as a
docs-note about the retired taxonomy.

## 2. FENCE COVERAGE

### The atlas `TimingFunction` fence (IN-ATLAS-3)
Correctly and **solely** carried by LT-14 **FENCE D**: `TimingFunction` lives at
`src/animation/constants/types.ts:45` (verified: `export type TimingFunction = (t: number) =>
number;`), inside the `constants/` KEEP-AS-IS zone, and **no §A move-row touches it**. The
verification command *is* named (`grep -n 'export type TimingFunction' ...`). **No demo wave
needs to carry this fence** — DT's `TimingFunctionPanel.vue` / `useTimingFunctionEditor.ts`
are demo *components*, not the library type; they never touch `src/`. Negative, sound.

### The frozen-exports fence
LT-14 **FENCE A/B/C/E** governs the `.` and `./engine` barrels. Verified precisely scoped:
```
$ grep -cn 'value-ast' src/animation/public.ts        → 1   (only :172)
$ grep -n 'transformTargetsStyle' src/animation/public.ts → 172: export { transformTargetsStyle } from "./compile/value-ast";
$ grep -n 'presets' src/animation/index.ts            → (none — presets NOT on the . barrel)
```
- **Batch 3** touches FENCE B (`public.ts:172` value-ast repoint, `:171` emit/format) and
  **names** the engine-mirror + d.ts commands. ✔
- **Batch 4** touches FENCE B transparently (`:171`) and names "verify format barrel". ✔
- **Batches 1, 2, 5** provably do **not** touch the barrels: the six renames are file paths,
  not export keys (FENCE A); `presets/*` is not surfaced to `.` (grep above); `isObject`/
  `cloneInterpSlot` are internal (def-line only, verified). So no missing command *matters*.

**XB-07 · P3 · family: fence-command-not-echoed.** FENCE E states *"Every restructure batch
re-emits identical `.d.ts` export rosters"* (`R2-05:371`) — a blanket claim — yet LT-15 names
the d.ts-diff command **only in Batch 3**. Batches 1/2/4/5 acceptance criteria omit it. I
verified those batches can't move the rosters, so this is a belt-and-suspenders gap, not a
break: the cheap `build:lib` + d.ts-grep should still run per batch as the fence literally
requires. **DT carries no frozen-exports fence** — the demo is unpublished; correct (negative).

## 3. ORDERING — the unified dependency DAG

Rails: **R** = external/producer (FAM-01), **L** = library (LT batches), **D** = demo (DT
batches), **G** = gate/test (GP), **M** = doc (DM). Hard edges are named `X ⟶ Y (because Z)`.

```
WAVE 0  R0 · FAM-01 K6 65-path Glass-7 consume slice LANDS + QUIESCE demo tree
        (git status --porcelain demo/ clean at rest)
           │
           ├─⟶ all D waves    (E1: DT FENCE c1 — the transaction modifies 7 transport +
           │                    both dock files; any DT move now clobbers it — R2-06:280)
           └─⟶ M-18           (E2: DM-18 line numbers stabilize only post-transaction)

WAVE 1  (parallel; no source-tree moves)
        G·MR4  add test:demo + CI step ─┐
        G·MR1/MR2/MR3 (observe/deploy)   │ independent
        G·prune taxonomy/PNGs/orphans ───┤   ⟵ coordinate taxonomy prune w/ XB-05 refs
        M·01 regen · M·02/07/08 doc edits│
        M·10..17 FINAL-U/CI/K-era        │
        M·18 glass-provenance comments ──┘  (E3 below)

WAVE 2  LIBRARY RAIL (disjoint from demo; runs anytime after nothing — src not in the txn)
        L·B0 proof:structure born-RED + PRUNE mirror.test.ts + .DS_Store + ceiling policy
          └─⟶ L·B1 renames ─⟶ L·B2 folds/deletes ─⟶ L·B3 compile/frame+value [FENCE B/E]
                                                       └─⟶ L·B4 emit/play-lifecycle/composite
                                                            └─⟶ L·B5 src DD-3 sweep (recompute)

WAVE 3  DEMO RAIL (after WAVE 0 + G·MR4 + M·18)
        D·B1 (DT-02 dock→chrome, DT-08 utils→_shared, DT-09 flatten)
          └─⟶ D·B2 (DT-03 transport ⟶ DT-04 composable dissolve/re-home; 2 shims retire)
          └─⟶ D·B3 (DT-05 keyframes/timeline, DT-06+07 channel-controls)   [B2‖B3 disjoint dirs]

WAVE 4  the DD-4 DEMO encapsulation sweep — SINGLE owner = demo rail, AFTER D settles,
        CORRECTED to exclude test-consumed symbols (XB-02), gated by G·MR4.
```

**Named hard edges:**
- **E1** R0 ⟶ every D wave — *because* the transaction modifies the exact files DT moves
  (clobber); DT FENCE c1 QUIESCE-TREE (`R2-06:280-284`).
- **E2** R0 ⟶ M-18 — *because* DM-18's demo `file:line` anchors are only stable once the
  transaction settles (DM-18 admits this for K6, `R2-08:483-486`).
- **E3 (UNRECONCILED — XB-03)** M-18 ⟶ D — *because* DM-18 rewords comments at demo paths DT
  **relocates/renames** (e.g. `demo/app/dock/ChromeDock.vue:348` → `components/chrome/`; the
  6 `channel-controls/*` + `controls-pane/ControlsPaneWrapper.vue:7,197` sites). If D lands
  first, DM-18's paths are dead. Neither blueprint names this edge; DM-18 only anticipates K6
  drift, not DT moves. **Resolve:** run M-18 before D, OR fold the comment-rewords into the
  DT waves that touch those files, OR re-grep the version-token string post-DT.
- **E4** G·MR4 ⟶ D (and ⟶ WAVE 4) — *because* MR4 gates the 155 demo assertions the
  restructure churns; GP states the intent ("on the eve of the FAM-06 restructure",
  `R2-07:221`), but **DT never names MR4 as a precondition** (coordination gap XB-06).
- **E5 (double-owned — XB-04)** mirror-prune single-owned at L·B0; G defers.
- **E6 (double-owned + unsafe — XB-01/02)** the DD-4 demo sweep is WAVE 4, single-owned by the
  demo rail, struck from L·B5, and correctness-fixed.
- **E7 (dangling — XB-05)** G·taxonomy-prune coordinated with the 4 bench comment folds + the
  interpolate.ts:257 fold (M-doc wave) — else stale references.
- **Internal L ordering** is a clean chain B0→B1→B2→B3→B4→B5 (proof:structure born-RED greens
  progressively; LT-15). **Internal D ordering** B1→(B2‖B3) per R2-06 §d. Both self-consistent.

**Library ⊥ Demo:** the two rails touch disjoint trees; the ONLY couplings are the shared
`mirror.test.ts` prune (mirror *excludes* demo — verified `test/support/mirror.test.ts:8`
`infrastructureDirs` includes `"demo"`, so demo restructure is genuinely unblocked by it, a
correct DT negative) and the demo-test gate (E4). They can run concurrently once WAVE 0/1 land.

## 4. COMPLETENESS SPOT-CHECK (total-coverage rule)

10 src + 10 demo files sampled deterministically (`find … | awk 'NR%N==k'`); each located in
its blueprint's move-table row **or** KEEP list:

| # | src file | disposition | # | demo file | disposition |
|---|---|---|---|---|---|
|1|`compile/easing/easing-option.ts`|A4 rename|1|`app/dock/index.ts`|DT-02 move|
|2|`compile/frame-compiler.ts`|A17 carve|2|`keyframes/composables/useHighlightCSS.ts`|DT-05|
|3|`engine/css/index.ts`|LT-16 KEEP|3|`instrument/surfaceTabs.ts`|KEEP (barrel/const)|
|4|`group/lifecycle.ts`|LT-16 KEEP|4|`transport/AnimationControlsGroup/useControlsKeyboardShortcuts.ts`|DT-03|
|5|`internal/leaves.ts`|LT-16 KEEP|5|`transport/components/DemoGlobalChrome.vue`|DT-03/DT-09|
|6|`orchestration/sequence/transport.ts`|LT-16 KEEP|6|`composables/scene-runtime/useSceneVisibilityPause.ts`|KEEP|
|7|`physics/numeric.ts`|LT-16 KEEP|7|`scenes/cube/matrix-editor/transformMath.ts`|KEEP (scenes)|
|8|`physics/spring/solver/vector.ts`|LT-16 KEEP|8|`scenes/sequence/SequenceScene.vue`|KEEP (scenes)|
|9|`resolve/resolve-function.ts`|A7 rename|9|`scenes/spring/useSpringKeyframesEditor.ts`|KEEP (scenes)|
|10|`svg/motion-path.ts`|LT-16 KEEP|10|`demo/styles/layout.css`|KEEP (styles)|

**20/20 covered.** Total-coverage rule holds on the sample. (Base counts confirmed: 145 src
`.ts`, 196 demo source files — both match the blueprint headers exactly.)

## 5. LINE-NUMBER DRIFT (spot-check)

11 cited anchors verified against the live tree — **10 exact, 1 numeric off-by-one**:

| Blueprint cite | Expected | Live | ✓/✗ |
|---|---|---|---|
| LT-14 FENCE D `types.ts:45` TimingFunction | type decl | `:45` exact | ✓ |
| LT-05 `public.ts:172` transformTargetsStyle | value-ast re-export | `:172` exact | ✓ |
| DT-02 `App.vue:141` ChromeDock/MbabbMenu | `@app/dock` import | `:141` exact | ✓ |
| DM-02 `README.md:428` `weighted-blend` | table row | `:428` exact | ✓ |
| DM-07 `DESIGN.md:67` `Card surface="cartoon"` | prose | `:67` exact | ✓ |
| DT-04 `no-shadow-playback-authority.test.ts:21` | shim import | `:21` exact | ✓ |
| DT-04 `ChannelControls.vue:230` KfPillTabOption | type import | `:230` exact | ✓ |
| DT-03 `ControlsPaneWrapper.vue:172-173` | up-and-over imports | exact | ✓ |
| DM-18 `ChromeDock.vue:348` glass-4.0.0 comment | provenance | `:348` exact | ✓ |
| mirror `test/support/mirror.test.ts:8` demo-excl | infra set | exact | ✓ |
| **DM-08 CHANGELOG anchor** | bullet-end `:22`, blank `:23` | **bullet-end `:21`, blank `:22`, header `:23`** | **✗ off-by-one** |

**XB-08 · P3 · family: doc-anchor-drift.** DM-08 says insert after the interpolation-model
bullet *"which ends `paths.` at CHANGELOG.md:22"* and *"BEFORE the blank line preceding `###
Dependency Changes` (CHANGELOG.md:23)"*. Actual: `paths.` is at **:21**, the blank at **:22**,
`### Dependency Changes` at **:23**. Both numeric anchors are off by one. DM-08's *textual*
anchor is unambiguous and correct, so a careful agent is fine — but a mechanical agent keying
on the stated line numbers misplaces the insert into the blank line. Note the correct numbers.

(Line counts also confirmed load-bearing: `play-lifecycle.ts` 482, `value-ast.ts` 400,
`spring/progress.ts` 484, `ChannelOptions.vue` 609 — all match LT-01 / DT-07 exactly.)

---

## Negatives (checked, sound)

- **Total-coverage holds** — 20/20 sampled files present in a move-row or KEEP list; base
  counts (145 src / 196 demo) match the blueprint headers.
- **FENCE B correctly scoped** — `public.ts:172` is the SOLE `value-ast` specifier (`grep -c`
  = 1); `:171` is the only `emit/format`; both barrel-touching batches (L·B3/B4) name commands.
- **Atlas TimingFunction fence** — library-only at `constants/types.ts:45`, KEEP zone,
  untouched by any move; no demo wave needs it.
- **mirror.test.ts excludes demo** (`:8` `infrastructureDirs ⊇ {"demo"}`) — DT's negative
  ("demo restructure unblocked by the FAM-12 topology gate") is correct.
- **DT-04's DC-02 correction is accurate** — `no-shadow-playback-authority.test.ts:21` really
  does consume the "dead" shim; R2-06's fresh-evidence correction verified.
- **DD-1/DD-2 truly dead** — `isObject` and `cloneInterpSlot` each appear only on their def
  line repo-wide; LT-13's deletes are safe.
- **Library ⊥ demo** — disjoint trees; safe concurrency once WAVE 0/1 land.

## Coverage gaps (this lane)

- **DD-4 completeness:** I proved only `isIOSLikePlatform` is test-consumed; the other ~10
  DD-4 symbols are unverified against `test/`+`bench/`. The WAVE-4 sweep must re-grep both
  (DT's own cautionary precedent) — I did not enumerate the full 11.
- **No build actuation:** I did not run `build:lib` / `check` in the audit copy (adjudication +
  static verification only, matching the source blueprints' own FENCE B/E gaps); the fence
  commands are named for the executing wave, not run here.
- **Transaction assumption:** the DAG assumes the K6 transaction lands the 65-path slice
  *without* moving dirs (DT's own assumption, `R2-06:369-371`); if it does move dirs, DT and
  DM-18 anchors shift further and E2/E3 tighten.
- **GP internal completeness** (69 rows) not re-audited beyond the taxonomy/mirror cross-links
  relevant to composition; MR2 chromium-revision parity remains GP's own open risk.
