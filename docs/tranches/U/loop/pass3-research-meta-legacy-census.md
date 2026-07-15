# pass3-research-meta-legacy-census — the META/LEGACY FILE CLASS sweep

**Lane:** `meta-legacy-file-census` (pass-3, a NEW loop item from the owner's row-7
structure escalation) · **Date:** 2026-07-10 · **Authority:** OD-U20 (OWNER-ASKS row 7
verbatim: *"legacy and meta files like `demo/glass-ui-gaps.ts` are to as well be
deleted"*) · **Mode:** READ-ONLY; this is the one report. · **Precepts:** no
workarounds, idiomatic gestalt, plain language, every term of art glossed at first use.

---

## 0. What a "meta/legacy file" IS (the class definition, glossed)

The owner named ONE specimen (`demo/glass-ui-gaps.ts`) and a family
(*"in-tree meta-ledgers, workaround registries, decision JSONs, tombstone/provenance
files"*). Distilling the common shape so the sweep is principled, not a name-match:

- **meta-ledger** — a file whose CONTENT is *about the codebase's own history or
  process* (a record of a decision, a workaround, a retirement) rather than an input
  the shipped product or a genuine correctness check needs at run time.
- **decision JSON** — a machine-readable file recording a **one-time design verdict**
  (ADOPT / DECLINE a rewrite), usually carrying a `recordedAt:` wall-clock timestamp
  and a `$comment:` narrating the reasoning. A timestamp is the tell: a live build
  input has no birthday; a tombstone does.
- **workaround registry** — a file that catalogues band-aids the demo carries because
  an upstream dependency has not shipped a fix (`glass-ui-gaps.ts` exactly).
- **tombstone / provenance** — a file left behind by a *retired* mechanism (debris),
  or one whose only job is to narrate "this is why this exists, tranche X, verdict Y".

**Glossed terms used below:** *gate* = a `scripts/proof-*.mjs` check run in CI;
*load-bearing* = a gate/test/build actually `readFileSync`/`JSON.parse`s the file and
would break without it (as opposed to a mere prose mention of its name in a comment);
*tripwire* = a gate that goes RED the instant an upstream fix ships, to force the
band-aid's deletion; *born-RED* = a gate authored to fail on today's tree first;
*absorb* = where a deleted file's genuinely-live content is re-homed.

**Scope boundary (stated once, binding on this census):**
- `docs/tranches/**` is the **tranche archive** — the historical record system. The
  owner's own qualifier was *"PIN-LEDGER-class docs OUTSIDE `docs/tranches/`"*, so the
  archive itself is OUT of the delete scope. Where a *live gate* reaches INTO the
  archive for a build input (§5), I flag the coupling but leave the archive file KEEP.
- `docs/precepts/**` and `.agents/skills/**` are the **development-process / harness-skill
  corpus** (methodology, not shipped-codebase meta) — OUT of scope.
- The census targets the **active codebase tree**: `src/`, `demo/`, `scripts/`,
  `test/`, `bench/`, and root config.

---

## 1. THE NAMED SPECIMEN — `demo/glass-ui-gaps.ts` → **DELETE** (OD-U20 verbatim)

The 210-line `GLASS_UI_GAPS` registry is a **workaround ledger**: one table every
demo band-aid imports and cites so a reviewer sees "these die when glass-ui BG/BH
lands", plus the `proof:glass-ui-gap-tripwire` machinery that reds when a gap's fix
ships in the consumed dist. The owner ruled it DELETE; OD-U20's rationale is already on
record (*"the tripwire machinery was already U.A-condemned"*). Its content splits two
ways, and **nothing is lost**:

- **The 5 tripwire-arm entries** (`segmentedTabsAriaOrientation`, `dockStrandKeepalive`,
  `dockDropdownPointerdown`, `dockDismissHold`, `drawerDetentInset`) each name a live
  workaround SITE. Absorb: at OD-U4's glass-ui 5.0.0 re-pin the underlying glass-ui fix
  lands and the workaround is DELETED at its site; **until then**, the cap becomes a
  plain one-line comment at each of the (8) workaround sites — *"workaround: glass-ui
  <defect>; remove when glass-ui ships <fix> (KF-TO-GLASSUI letter §0)."* No shared
  ledger, no tripwire; the letter is the single durable home for the ask.
- **The 6 no-band-aid "recorded gaps"** (`dockRestBlur`, `dockMorphMeasure`,
  `staticBackdrop`, `fontDisplayWeight`, `specularWriterPublic`, and the render/perf
  asks) carry `workaroundSites: []` — they are pure upstream ASKS with nothing in-tree
  to strand. They already dispatch to `KF-TO-GLASSUI-BG.md §0`; that letter is their
  home. Delete the in-tree rows outright.

**Cascade (the satellite apparatus that dies WITH the specimen — flag for the
gate-apparatus lane, not this census's authority to delete alone):**
`scripts/proof-glass-ui-gap-tripwire.mjs`, `scripts/proof-workaround-deletion.mjs`,
`scripts/lib/glass-caps.mjs` (the single `glassCaps` dist-content prober), and the
`GLASS_UI`/tripwire arrays in `scripts/gate-bands.mjs` exist **only** to service this
ledger and have no referent once it is gone. The 12 importers (`App.vue`,
`ChromeDock.vue`, `MbabbMenu.vue`, `TransportDock.vue`, `KfPillTabs.vue`,
`useKfPillTabs.ts`, `usePlayActuation.ts`, `ControlsPaneWrapper.vue`, plus the 4
gate/lib files) all drop their `glassUiGap(...)` citation import in the same motion.

---

## 2. THE DECISION-JSON CLASS — `scripts/*-decision.json` (8 files) → **DELETE all 8**

Eight machine-readable **one-time verdicts** from the P/Q aggressive-optimization
campaign, every one carrying a `recordedAt:` timestamp (`2026-06-24…`) and a `$comment:`
narrating the reasoning — the exact tombstone shape OD-U20 names. Lane-23's audit
(`docs/tranches/U/audit/lane-23-scripts-tooling-backend.md` §F8) already found the
0-reader subset dead; this census generalizes the verdict to the whole class per the
owner's row-7 ethos ("NO legacy code"), because even the still-read ones are
apparatus, not product.

| decision JSON | load-bearing gate(s) that `JSON.parse` it | already narrated in code? | verdict |
|---|---|---|---|
| `leaves-externalization-decision.json` | **NONE** (0 readers — lane-23 §F8) | — | **DELETE** (pure tombstone) |
| `typed-om-decision.json` | **NONE** | verdict in code | **DELETE** |
| `reseat-vs-decay-decision.json` | **NONE** (only prose comments at `orchestration/drag/draggable.ts:361` + `bench/spring-tick.bench.ts:231`) | yes — the "reseat beats decay" verdict is the comment at `draggable.ts:361` | **DELETE** |
| `color-soa-decision.json` | `proof-color-soa.mjs` | yes — the DECLINE verdict is the file's own `$comment`, duplicating the seam | **DELETE** |
| `soa-composite-decision.json` | `proof-soa-composite.mjs`, `proof-record-truth.mjs` (dirty-check) | yes — `src/animation/group/soa.ts:8,108` already narrate the bit-identical verdict | **DELETE** |
| `processframe-soa-decision.json` | `proof-processframe-soa.mjs` | yes (soa seam prose) | **DELETE** |
| `spring-vector-decision.json` | `proof-processframe-soa.mjs`, `proof-wave-charter.mjs`, `proof-record-truth.mjs`, `proof-spring-vector.mjs`, `lib/portable-perf.mjs` | yes (spring kernel prose) | **DELETE** |
| `waapi-densify-decision.json` | `proof-waapi-adaptive-densify.mjs` | yes (densify seam prose) | **DELETE** |

**Why the still-read ones ALSO delete (the principled argument, not a blanket sweep).**
A decision JSON records a **frozen design conclusion** — "we DECLINED building a
kf-side parallel color-SoA arm because value.js's leaf already folds it";
"the SoA fold is bit-identical (`maxErr=0`) to the boxed reference". That conclusion is
durable knowledge and belongs as **one plain comment at the code seam** — and in every
case it ALREADY is there (the table's third column). What the JSON adds on top is (a) a
`recordedAt` birthday and a measured-ratio audit trail with no live meaning, and (b) a
`proof:*-soa` gate whose entire job is to re-COMPARE a measured verdict against the
committed JSON. That compare-gate is the apparatus the owner's 557x-scripts-growth
question indicts. Two disciplined absorptions dissolve any real invariant hiding inside:

- **A genuine correctness invariant** (e.g. "the SoA fold must stay bit-identical to
  the boxed reference") is a **test**, not a JSON+gate compare — hand it to
  `test/group/` as a direct `expect(soaResult).toEqual(boxedReference)`. Name it in the
  wave charter; do not let it die silently.
- **A genuine perf floor** belongs in **`bench/taxonomy.json`** — the ONE live
  bench-budget authority (§4), whose `budgeted` category already exists for exactly
  this. The decision-JSON `foldedOverBoxed` ratios migrate there or die as one-time
  measurements.

Net: the design verdicts survive as code comments (already written); the real checks
survive as tests/bench-budgets (named, re-homed); the tombstones and their
compare-gates die.

---

## 3. RETIRED-MECHANISM DEBRIS & THE known-violations FILE

| file / tree | status | verdict |
|---|---|---|
| `scripts/baselines/visual-lock/_diff/` (44 `*.diff.png`) | `gate-bands.mjs:95` records `proof:visual-lock RETIRED at the T.M3 blessing`; commit `71e0fb4` confirms. The 44 diff PNGs are debris the retirement left behind (lane-23 §F8; SPEC-B2 §6 P4 deliverable-2). | **DELETE the whole `visual-lock/` tree** |
| `.dependency-cruiser-known-violations.json` (root) | The dependency-cruiser suppression baseline. **P4 already kills it** — SPEC-B2 §6 deliverable-1 is ratified at 95%+ (baseline deleted, `--ignore-known` dropped everywhere, `npm run lint` is now plain `depcruise src`). | **DELETE** (cross-reference — already scheduled; listed here for class-completeness, not a new action) |

---

## 4. THE MANIFEST / BASELINE CLASS — KEEP (load-bearing), de-narrate the meta-cruft

These wear the manifest/baseline shape but are **genuine live inputs** a gate, test, or
the build reads every run. They KEEP — but several carry heavy tranche-provenance
narration in a `_doc`/`$comment` header that IS meta-cruft and should be trimmed to the
bare contract (the data is load-bearing; the story of which tranche authored it is not).

| file | live consumer | verdict |
|---|---|---|
| `test/fixtures/keyframes/manifest.json` | `test/compile/roundtrip-fidelity.test.ts` — the authoritative `@keyframes` parse corpus (per-fixture AST lock). | **KEEP** — a real test-input fixture, not meta. |
| `demo/@/styles/font-roles.json` (owner-named "font-roles.json" class) | `proof:font-census` + `proof:colocation` — the live selector→role tuple contract the census enforces on the shipped DOM. | **KEEP** the data; **trim** the `_doc` T.D-provenance narration to the bare contract. It is a live design gate input, NOT a tombstone. |
| `bench/taxonomy.json` | `proof:bench-taxonomy` + `proof:bench-runs` — the live per-bench budget/category manifest. | **KEEP** — and it is the correct home to ABSORB any real perf floor the deleted decision-JSONs (§2) guarded. Trim the L.W7/P.W1 provenance narration. |
| `scripts/baselines/amiga-checkerboard.json` | `proof:scene-perf-budget` (live regression floor) | **KEEP** (live floor). Flag: same "baseline capture" family — if its gate is apparatus-condemned by the perf-gate lane, it follows. |
| `scripts/baselines/crayon-preserved.json` | `proof:crayon-preserved` | **KEEP** (live floor); same flag. |
| `scripts/baselines/lighthouse-mobile-after.json` | `proof:lighthouse-mobile` — the live per-scene mobile no-regression floor. | **KEEP**. |
| `scripts/baselines/lighthouse-mobile-t-open.json` | `proof:lighthouse-mobile` T.G9 `baseline-below-floor` integrity clause + `gate-authority.mjs:203`. | **KEEP (borderline)** — an era-stamped "T-open BEFORE" snapshot, but currently a device-independent integrity referent a live gate reads. Flag for the perf-gate lane: if T.G9's integrity clause retires, this snapshot is a tombstone and follows. |
| `scripts/epf1-baseline.json` | `proof:epf1-measure` | **KEEP-with-flag** — load-bearing only as long as the `epf1` gate survives the apparatus review; not meta on its own. |
| `docs/color-fidelity-data.json` | `proof:color-fidelity` (`scripts/proof-color-fidelity.mjs:59`) + `test/engine/color-fidelity.test.ts:56` (generated measurement I/O). | **KEEP** the data; it is mis-homed under `docs/` — **relocate beside its consumers** (a generated gate/test artifact, not a doc). |
| `demo/@/.../monaco-themes/{Dracula,GitHub}.json` | the Monaco editor wrapper (real editor theme data). | **KEEP** — not meta. |
| `.changeset/config.json`, `.prettierrc.json`, `tsconfig*.json`, `components.json`, `api-extractor*.json`, `.vscode/*` | build/format/publish config. | **KEEP** — not meta. |

---

## 5. LEDGER-GATES READING INTO THE ARCHIVE (flag only — outside this census's delete authority)

These are the "PIN-LEDGER-class" the owner named, but the ledger FILE lives inside
`docs/tranches/**` (the archive, OUT of delete scope) while a LIVE gate reads it. The
GATE is apparatus (the gate-apparatus / scripts-restructure lane owns it); the ledger
JSON is archive. Recorded so SPEC-B3 and the gate lane see the coupling:

- `docs/tranches/Q/PIN-LEDGER.json` ← `proof:pin-ledger-current`
- `docs/tranches/T/stage-manifests/*.json` ← `proof:stage-inventory`
- `docs/tranches/T/verdicts/APPEARANCE-WAVES.json`, `docs/tranches/T/goldens/BLESSED.json` ← T-era gates
- **in-code ledgers** in `scripts/gate-bands.mjs`: `RETIREMENT_LEDGER` (`:441`),
  `T_BORNRED_BACKLOG` (`:609`), and the `GLASS_UI` tripwire arrays. These are
  registries-as-code from the T tranche; the `GLASS_UI` set dies with §1's specimen,
  and the T-era `RETIREMENT_LEDGER`/`_BACKLOG` should be re-examined by the gate lane
  now that their coupled features have shipped.

---

## 6. FALSE POSITIVES (name matched the class; content did NOT) — KEEP, stated so no pass re-hunts

- `demo/@/composables/gestureSelectSuppression.ts` — name says "suppression" but it is
  a **live runtime composable** (the drag-in-flight `body.is-dragging` select-suppression
  token every drag seam routes through). Not a suppression *file* in the gate sense. KEEP.
- `src/animation/compile/easing-registry.ts` — name says "registry" but it is the
  **library's live easing-name→timing-function lookup** (`getTimingFunction`). Product
  code. KEEP.

---

## Verdicts for SPEC-B3

1. **DELETE `demo/glass-ui-gaps.ts`** (OD-U20 verbatim). Absorb the 5 tripwire-arm caps
   as a plain one-line "workaround; remove on glass-ui re-pin" comment at each of the 8
   workaround sites (fixed for real at OD-U4's glass-ui 5.0.0 re-pin); the 6 no-band-aid
   recorded gaps carry to `KF-TO-GLASSUI-BG.md §0` only. Drop the 12 `glassUiGap(...)`
   citation imports.
2. **DELETE the satellite tripwire apparatus in the SAME motion:**
   `proof-glass-ui-gap-tripwire.mjs`, `proof-workaround-deletion.mjs`,
   `scripts/lib/glass-caps.mjs`, and the `GLASS_UI`/tripwire arrays in `gate-bands.mjs`
   — they have no referent once the ledger is gone. Retire their `package.json` gate
   keys per G12 (dead-gate-retire) in the delete commit.
3. **DELETE all 8 `scripts/*-decision.json`.** The frozen design verdict of each already
   lives as a code comment at its seam (verified for soa/spring/reseat/color); leave it
   there. For the 4 that a `proof:*-soa`/`spring-vector` gate `JSON.parse`s, dissolve the
   compare-gate: migrate any genuine correctness invariant to a direct `test/group/`
   assertion and any genuine perf floor to `bench/taxonomy.json`'s `budgeted` category —
   NAME each re-home in the wave charter; nothing dies silently. Retire the emptied
   `proof:color-soa` / `proof:soa-composite` / `proof:processframe-soa` /
   `proof:spring-vector` / `proof:waapi-densify` keys per G12; drop the
   `proof:record-truth` decision-JSON dirty-check clause.
4. **DELETE `scripts/baselines/visual-lock/`** (44 `_diff/*.diff.png` — debris of the
   T.M3-retired `proof:visual-lock`; lane-23 §F8).
5. **DELETE `.dependency-cruiser-known-violations.json`** — CONFIRM it is already killed
   by P4 (SPEC-B2 §6 deliverable-1); this is a cross-reference, not a second action.
6. **KEEP** the live manifest/baseline inputs (§4): `test/fixtures/keyframes/manifest.json`,
   `demo/@/styles/font-roles.json`, `bench/taxonomy.json`, the live `scripts/baselines/*`
   perf floors, Monaco theme JSONs, and root build config. For `font-roles.json` and
   `bench/taxonomy.json`, **trim the tranche-provenance narration** in their
   `_doc`/`$comment` headers to the bare contract (the data is load-bearing; the
   authoring-tranche story is meta-cruft).
7. **RELOCATE `docs/color-fidelity-data.json`** beside its gate/test consumers — it is a
   generated measurement artifact mis-homed under `docs/`, not a document.
8. **KEEP `bench/taxonomy.json` as the single perf-floor home** — it absorbs any real
   floor rescued from the deleted decision-JSONs (verdict 3), so no perf regression check
   is lost in the sweep.
9. **FLAG (hand to the gate-apparatus / scripts-restructure lane, do NOT delete here):**
   the archive-reading ledger-gates (`proof:pin-ledger-current`, `proof:stage-inventory`)
   and the T-era in-code ledgers (`gate-bands.mjs` `RETIREMENT_LEDGER`,
   `T_BORNRED_BACKLOG`) — their coupled features have shipped; re-examine for retirement.
   The ledger JSONs themselves stay in `docs/tranches/**` (the archive is out of scope).
10. **RECORD the false positives** (`gestureSelectSuppression.ts`, `easing-registry.ts`)
    as KEEP so no later pass re-hunts them by name.
