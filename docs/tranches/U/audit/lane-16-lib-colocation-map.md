# Tranche U — Audit Lane 16 · lib-colocation-map

**Charter.** The LIBRARY half of THE GRAND COLOCATION EDICT (T.F22, deferred).
Apply the owner's recursive-colocation edict to `src/animation/`, *"abstracted and
made befitting"* for a TypeScript library. Decide what recursive colocation MEANS
per-zone (types beside implementations? per-feature sub-modules? the `internal/`
leaf tier?), find the long flat dirs, and produce THE target library tree — a
concrete before/after U can charter wave-by-wave. LIGHT/HEAVY boundary is a HARD
constraint.

**Verdict headline.** The library is already ~80% colocated (R.W1's 11-zone
partition + S.B's sub-zones did the heavy lifting), but TWO zones remain long-flat
(`physics/spring/` 11 files, `compile/` 11 root files) and the CSS-emitter trio is
SPLIT across a flat root and a sub-zone. The deeper defect is an ENFORCEMENT GAP:
no gate enforces the edict's *"long running dirs … broken into common modules"* for
INTRA-zone flat directories — `proof:no-flat-siblings` guards only the zone ROOT
against hyphenated siblings, and `proof:zone-cohesion` measures per-FILE line count
with an 11-entry JUSTIFIED allowlist (a line-count deferral device). Both green a
tree with two 11-file flat dirs.

---

## What recursive colocation MEANS for THIS library (the befitting abstraction)

The demo edict (`proof:colocation`, T.F21): a component colocates its
sub-components / composables / skeletons / constants / styles recursively; a
shared `composables/`-style dir is reserved for TRULY module/global members; long
dirs break into encapsulated modules. Abstracted befittingly for a TS library, a
`zone` plays the role of a `component`:

1. **Types beside implementations — DONE, keep.** Per-zone shared types live in a
   colocated `types.ts` (`group/types.ts`, `physics/spring/types.ts`); genuinely
   CROSS-zone types live in the shared `constants/types.ts` tier. This is exactly
   the "shared dir only for truly-global members" rule — correctly applied.
   Verified: `constants/types.ts` is consumed by the 10 LIGHT importers and is
   LIGHT-pure (CLAUDE.md §"Key types"); it is the library's legitimate global
   type tier, NOT a colocation violation.

2. **Per-feature sub-modules — the seam is the CONCERN, not the file.** A zone with
   a natural sub-cluster sitting flat must encapsulate it (the edict's "long dirs →
   common modules", abstracted from dirs-of-dirs to concern-clusters-of-files). The
   precedent already exists — `engine/css/`, `compile/backward/`, `physics/spring/`,
   `orchestration/{drag,sequence,timeline,split-text,view-transition}/`. The
   remaining long-flat dirs simply have NOT had the same treatment.

3. **The `internal/` leaf tier — AFFIRM, do not dissolve.** `internal/` is the
   value.js-free global leaf tier (C-5: barrel-free, excluded from `ZONE_DIRS`). It
   is the library's exact analogue of the demo's global `composables/` dir: a
   shared dir reserved for TRULY module/global members. Verified every leaf is
   multi-zone (below) — a naive colocation pass that tried to push leaves down into
   zones would be WRONG. State this explicitly so U does not mis-charter it.

---

## Evidence — the tree as it stands

### Flat-file census (verified `find … | wc -l`, live tree)

| Zone dir | flat `.ts` (incl. index) | sub-zones | verdict |
|---|---|---|---|
| `physics/spring/` | **11** | none | LONG-FLAT — carve |
| `compile/` (root) | **11** | `backward/` (8) | LONG-FLAT + split emitter trio |
| `group/` | **10** | none | borderline — blend cluster |
| `engine/` | 9 | `css/` (3) | OK (already carved) |
| `compile/backward/` | 8 | — | OK |
| `internal/` | 7 | — | leaf tier — AFFIRM |
| `resolve/` | 7 | none | borderline — resolvers cluster |
| `orchestration/sequence/` | 5 | — | OK |
| `scroll/` `svg/` `waapi/` | 6 each | — | cohesive, OK |
| `presets/` | 5 | — | OK |

### `internal/` leaf consumers (verified grep — every leaf is multi-zone)

```
leaves.ts        → orchestration, physics, physics/spring, scroll, svg, waapi (+index)  [8]
errors.ts        → compile, compile/backward, engine, orchestration, physics, svg, easing.ts (+index) [8]
reduced-motion.ts→ engine, group, orchestration/sequence, orchestration/view-transition, physics, physics/spring [6]
animation-id.ts  → compile/backward, engine, group  [3]
scheduler.ts     → group, load-engine.ts, public.ts  [3]
binarySearch.ts  → engine, physics  [2]
scroll-phases.ts → compile, scroll  [2]
```

No leaf has a single consumer zone → none should colocate down. `internal/` is
correctly the global tier. **AFFIRM.**

### The emitter trio is SPLIT (the colocation defect in `compile/`)

Three "→ zero-runtime CSS" emitters, one concern, three homes:

- `compileToCSS` — `compile/backward/backward.ts` (inside the `backward/` sub-zone)
- `compileToEntry` — `compile/entry.ts` (flat at root, 434L)
- `compileToViewTransition` — `compile/view-transition.ts` (flat at root, 393L)

`compile/index.ts:41-64` re-exports `view-transition`/`entry` as *"compileToCSS's
sibling"* / *"compileToCSS's DECLARED-ENDPOINT sibling"* — the code KNOWS they are
siblings of `backward.ts`, yet they sit a directory apart. `compile/backward/index.ts`
exports `compileChild`/`cssIdent`/`colorUnitToOklabCSS` SPECIFICALLY so the two
root emitters can re-target the same pipeline — i.e. the root emitters depend
UPWARD into the sub-zone. That is the un-colocated seam.

---

## Findings

### F1 (MAJOR) — `physics/spring/` is 11 flat files spanning three concerns

`progress.ts` (492L, the class) · `managed-play.ts` (67L, the managed `.play()`
loop) · `types.ts` (124L) · the **solver-math kernel** `solver.ts` (77) /
`sample.ts` (66) / `vector.ts` (154) / `duration.ts` (83) / `reseat.ts` (98) · the
**CSS `linear()` twins** `linear-stops.ts` (71) / `timing-function.ts` (116).
Three distinct concerns, zero encapsulation. Evidence: `find src/animation/physics/spring
-name '*.ts'` (11 files); file doc-lines confirm the split (`solver.ts:1` "the
closed-form damped-harmonic kernel"; `linear-stops.ts:1` "sampling a spring response
curve into CSS `linear()` stops").

**Proposal (the gestalt, LIGHT-preserving).** Recursively colocate into two
sub-modules mirroring `engine/css/`:

```
physics/spring/
├── index.ts
├── progress.ts        # the per-frame class — HOT PATH, stays
├── managed-play.ts
├── types.ts
├── solver/            # the closed-form damped-harmonic kernel
│   ├── solver.ts · sample.ts · vector.ts · duration.ts · reseat.ts
│   └── index.ts
└── css/               # the CSS linear() twins (springLinearStops / springTimingFunction)
    ├── linear-stops.ts · timing-function.ts
    └── index.ts
```

Both sub-modules stay LIGHT (no value.js edge; the twins emit CSS *strings*, they
do not parse). Hot-path safe: `progress.ts`→`solver/` imports resolve at module
load, NOT per frame (coordinate with T.G only to keep the assertion honest).

### F2 (MAJOR) — `compile/` is 11 flat root files + a split emitter trio

Root holds three concerns flat: the FORWARD pipeline (`parse-flatten` 320 ·
`frame-compiler` 458 · `numeric-plan` 59 · `selector` 170 · `plain-vars` 128 ·
`adapter` 329), the heavy easing resolvers (`easing-registry` 124 · `easing-option`
56), and TWO of the three CSS emitters (`entry` 434 · `view-transition` 393) whose
third sibling lives in `backward/`. Evidence: `compile/index.ts:41-64`;
`compile/backward/index.ts:33-56`.

**Proposal.** Two carves; the FORWARD pipeline stays at root (the zone's primary
concern):

```
compile/
├── index.ts
├── parse-flatten.ts · frame-compiler.ts · numeric-plan.ts · selector.ts · plain-vars.ts · adapter.ts   # FORWARD
├── easing/            # the heavy easing resolvers, colocated
│   ├── easing-registry.ts · easing-option.ts
│   └── index.ts
└── emit/              # ALL THREE →CSS emitters colocated (rename backward/ → emit/)
    ├── backward.ts (compileToCSS) · backward-walk.ts · backward-color.ts
    ├── format.ts · format-options.ts · easing-serialize.ts · densify.ts
    ├── entry.ts            # moved from root
    ├── view-transition.ts  # moved from root
    └── index.ts
```

This gathers the emitter trio under ONE roof (its shared substrate `format`/
`densify`/`backward-color`/`cssIdent` is already there), turning the UPWARD
root→`backward/` dependency into intra-module colocation. The FORWARD↔BACKWARD
zero-edge invariant (a18) survives as FORWARD↔`emit/` — the same seam, renamed to
its true concern. All HEAVY; no boundary crossing.

### F3 (MAJOR, structural) — the ENFORCEMENT GAP: no gate covers intra-zone long-flat dirs

The edict says *"Long running dirs must and always be broken into common modules
and encapsulated thereof."* No gate enforces this INSIDE a zone.
`proof:no-flat-siblings` (`scripts/proof-no-flat-siblings.mjs:19-26`) only forbids
hyphenated siblings at `src/animation/*.ts` ROOT. `proof:zone-cohesion`
(`scripts/proof-zone-cohesion.mjs:64,204-232`) measures per-FILE line count
(`ZONE_COHESION_CEILING = 400`), never per-DIRECTORY flat density. Consequence:
`physics/spring/` (11 flat) and `compile/` (11 flat) sail through BOTH gates green
(verified: `node scripts/proof-zone-cohesion.mjs` → PASS today).

**Proposal.** U charters a per-DIRECTORY concern-density clause (into
`proof:zone-cohesion` or a sibling): a zone directory carrying > N flat `.ts`
across ≥2 identifiable concern-clusters must encapsulate them into sub-modules, OR
declare a single justified cohesive cluster. The line-count clause and the
directory clause TOGETHER express the edict; today only the first exists.

### F4 (MAJOR, structural) — the JUSTIFIED allowlist is a line-count deferral device

`proof-zone-cohesion.mjs:95-171` carries 11 JUSTIFIED single-concern entries. Under
NO-MORE-DEFERRALS this must be re-audited: it green-lights 11 big files as
indivisible WITHOUT ever asking whether their DIRECTORY should cluster. Several
justifications are file-level true but mask the directory-level gap: `entry.ts`
(434L "COHESIVE EMITTER", `:146-150`) and `compile/backward/backward.ts` (475L,
`:138-144`) are two of the three emitters F2 colocates; `physics/spring/progress.ts`
(492L, `:97-102`) is the class F1 keeps but its 5 solver siblings are the carve.
The allowlist is not WRONG per file — it is INCOMPLETE as a colocation instrument.

**Proposal.** Keep the allowlist for GENUINE hot-paths / flat-data-tables
(`presets/classic-data.ts`, `group/group.ts`, `frame-compiler.ts`,
`play-lifecycle.ts`, `progress.ts`). Fold the emitter/pipeline entries INTO F1/F2's
sub-module carves so the justification is retired by structure, not by declaration —
the "carve, don't declare" reading of the edict.

### F5 (MINOR, AFFIRM) — `internal/` and `constants/` are the correct global tiers

Every `internal/` leaf is multi-zone (census above); `constants/types.ts` serves 10
LIGHT importers. These are the library's TRULY-global shared dirs — the edict
EXPRESSLY permits them ("composables/-style shared dirs for module/global members").
**Do NOT dissolve them.** State this in the charter so a downstream lane does not
mistake them for colocation debt. The one shim to retire: `constants/index.ts` is a
"back-compat barrel" (CLAUDE.md §"Key types") that the 10 light importers were
already migrated OFF of; under NO-LEGACY, heavy importers can target `./defaults`
directly and the barrel dissolves. MINOR.

### F6 (MINOR) — `group/` 10 flat: a natural `blend/` cluster

`soa.ts` (265) / `compositor.ts` (274) / `springs.ts` / `yield-batch.ts` are the
zero-alloc SoA blend fold (file headers `group/soa.ts:1`, `group/compositor.ts:1`
confirm "the … compositor fold"). They form a natural `group/blend/` sub-module,
leaving `group.ts` (hot-path class) + `lifecycle.ts` + `entries.ts`/`layer-api.ts` +
`types.ts` at root. Borderline (10 files); charter if F3's directory clause bites,
else defer to a follow-on. Hot-path: `group.ts`→`blend/` is module-load, safe.

### F7 (MINOR) — `resolve/` 6 flat resolvers under `core.ts` dispatch

`core.ts` (193) dispatches to 5 per-function-kind rewriters (`spring-css`,
`resolve-if`, `resolve-function`, `element-resolve`, `env`). A natural
`resolve/resolvers/` cluster (`core.ts` + `index.ts` stay at root). Lowest
priority — 6 files is only borderline-long; charter only if the directory clause
(F3) sets its N ≤ 5.

---

## THE TARGET LIBRARY TREE (before → after, chartable wave-by-wave)

```
BEFORE (live)                          AFTER (U target)
─────────────────────────────         ─────────────────────────────────────────
physics/spring/  (11 flat)            physics/spring/
  progress.ts                           progress.ts  managed-play.ts  types.ts  index.ts
  managed-play.ts  types.ts             solver/   { solver sample vector duration reseat + index }   [F1]
  solver sample vector                  css/      { linear-stops timing-function + index }           [F1]
  duration reseat
  linear-stops timing-function
  index.ts

compile/  (11 root + backward/8)      compile/
  parse-flatten frame-compiler          parse-flatten frame-compiler numeric-plan
  numeric-plan selector plain-vars        selector plain-vars adapter  index.ts        (FORWARD, root)
  adapter                               easing/  { easing-registry easing-option + index }           [F2]
  easing-registry easing-option         emit/    { backward* format* densify easing-serialize
  entry view-transition  index.ts                  entry view-transition + index }  (backward→emit)  [F2]
  backward/ {8}

group/  (10 flat)                     group/
  group lifecycle entries               group lifecycle entries layer-api types index.ts   (root)
  layer-api types soa compositor        blend/ { soa compositor springs yield-batch + index }        [F6]
  springs yield-batch index.ts

resolve/  (7 flat)                    resolve/
  core spring-css resolve-if            core index.ts                                      (root)
  resolve-function element-resolve      resolvers/ { spring-css resolve-if resolve-function
  env index.ts                                       element-resolve env + index }                    [F7]

internal/  (7 flat)         ── AFFIRM, unchanged (the global leaf tier, C-5) ──          [F5]
constants/                  ── AFFIRM types.ts/defaults.ts; dissolve index.ts shim ──     [F5]
engine/ · engine/css/ · orchestration/{drag,sequence,timeline,split-text,view-transition}/
scroll/ · svg/ · waapi/ · presets/ · ingest/  ── already colocated, unchanged ──
```

**Ordering for waves:** F1 (physics/spring — LIGHT, isolated, zero heavy risk) →
F2 (compile/emit + easing — HEAVY, touches the a18 forward↔backward invariant +
`compile/index.ts` barrel) → F3/F4 (the gate + allowlist, authored WITH F1/F2 so
the carve retires the justification) → F6/F7 (optional, gated by F3's N).

---

## What U must charter

- **CHARTER F1**: carve `physics/spring/solver/` + `physics/spring/css/` — recursive
  colocation of the solver kernel and the CSS twins; LIGHT boundary PRESERVED
  (verified no value.js edge in either cluster).
- **CHARTER F2**: carve `compile/emit/` (rename `backward/` → `emit/`, move
  `entry.ts` + `view-transition.ts` in) + `compile/easing/`; gather the three CSS
  emitters under one roof; HEAVY boundary PRESERVED. Rewire the a18 FORWARD↔BACKWARD
  invariant to FORWARD↔`emit/`.
- **CHARTER F3**: add a per-DIRECTORY concern-density clause to `proof:zone-cohesion`
  (or a sibling) enforcing the edict's "long dirs → encapsulated modules" for
  intra-zone flat directories — the clause that is MISSING today.
- **CHARTER F4**: re-audit the 11-entry JUSTIFIED allowlist under NO-DEFERRALS —
  RETIRE the emitter/pipeline entries by structure (F1/F2), KEEP only genuine
  hot-path/data-table declarations.
- **CHARTER F5 (affirm, guard-rail)**: DECLARE `internal/` and `constants/{types,defaults}`
  the correct global tiers — do NOT dissolve them; dissolve only the
  `constants/index.ts` back-compat barrel.
- **CHARTER F6/F7 (optional)**: `group/blend/` + `resolve/resolvers/` — charter only
  if F3's directory-density N brings them in scope.
- **CROSS-CUT**: every carve is a PURE move — coordinate with **T.G** (no per-frame
  indirection; all touched imports resolve at module-load) and RE-ANCHOR every
  path-literal gate (`proof:boundary`, `proof:published-surface`,
  `proof:engine-subpath-mirror`, `proof:zone-cohesion`'s JUSTIFIED map, the
  backward-anchored gates) — the S-drive lesson: gates anchor literal basenames.
- **HARD CONSTRAINT**: LIGHT (`physics/`) carves stay value.js-free; HEAVY
  (`compile/`) carves stay behind `loadAnimationEngine()`. No carve crosses the
  static/dynamic boundary.
