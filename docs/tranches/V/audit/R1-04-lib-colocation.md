# R1-04 — Library Colocation + Module-Structure Census

**Lane:** R1-04 · **Prefix:** LC- · **Date:** 2026-07-16 · **Scope:** `src/` (145 `.ts` files, all under `src/animation/`) READ-ONLY census against the glass-ui BI STRUCTURE-ADDENDA idiom.

## Verdict

The library is *partially* colocated — R.W1's 11-zone partition + S.B sub-zones did real work, and several of the edict's named suspicions do **not** survive contact (all `index.ts` barrels are pure; `compiled-frame.ts` is a legitimately-shared 8-consumer type contract, not a bad split; `physics/spring/` is well-encapsulated). But the census confirms the owner's core charge and adds a P1 the prior U lane missed: **there is no structural enforcement gate at HEAD at all** — `proof:no-flat-siblings` and `proof:zone-cohesion` are cited as live gates in four source-file comments (and by the U lane-16 audit) yet do not exist anywhere in the repo; the only gates are `proof:publish` and `proof:owner-golden`. So every structural defect below is unguarded and will re-drift. Concretely present: a prefix-stutter epidemic the edict named (`easing-option`/`easing-registry`), one genuine single-consumer fragment (`numeric-plan.ts`), eight >400-line code god-modules with nameable internal seams (`play-lifecycle.ts` 482L / 24 functions is the worst), three long-flat zones that should sub-modularize (`group/` 14, `compile/` root 8 incl. the frame-compilation kernel, `emit/` backward-triad), and a hollow fragment-facade in `presets/` whose barrel doc-comment misdescribes its own files. Findings are ranked P1 structural → P2 idiom → P3 nit.

Counts verified this session (`wc -l`, `find`, `grep`): 145 `.ts` + 1 stray `src/.DS_Store`; 8 code files >400 lines; 24 `index.ts` barrels, all pure.

---

## LC-01 — Prefix-stutter epidemic (dir name repeated in filename) · P2 · family: naming-stutter

The edict's named example is real and generalizes. A normalized dir-prefix scan (`basename` starts with parent-dir name, hyphen-insensitive) plus a manual false-positive filter yields two classes:

**Class A — genuine stutter with a distinguishing suffix (drop the prefix):**
| current | proposed | evidence |
|---|---|---|
| `compile/easing/easing-option.ts` | `compile/easing/option.ts` | edict-named; 66L |
| `compile/easing/easing-registry.ts` | `compile/easing/registry.ts` | edict-named; 136L |
| `waapi/waapi-options.ts` | `waapi/options.ts` | 113L; dir `waapi/` |
| `resolve/resolve-function.ts` | `resolve/function.ts` (or `fn.ts`) | dir `resolve/` |
| `resolve/resolve-if.ts` | `resolve/conditional.ts` | dir `resolve/`; `if.ts` is awkward |
| `engine/css/css-animation.ts` | `engine/css/animation.ts` | 256L; dir `engine/css/` (no collision — sibling `engine/animation.ts` is a different dir) |

**Class B — shared-prefix siblings that want a sub-dir, not a rename** (see LC-06): `emit/backward.ts` + `emit/backward-color.ts` + `emit/backward-walk.ts`; `emit/format.ts` + `emit/format-options.ts`.

**False positives correctly excluded** (reported as negatives, not fixes): `drag/draggable.ts` ("draggable" ≠ stutter of "drag"), `compile/compiled-frame.ts` ("compiled" is a distinct word), and the eponymous `dir/dir.ts` family (LC-09, separate finding).

**Disposition:** BUILD one `W-STUTTER-RENAME` wave — mechanical `git mv` + import repoint for the six Class-A files; honors the `./engine` subpath and public surface (none of these are export keys — verified `exports` map is only `.` + `./engine`). Land behind the LC-04 gate so it can't regress.

---

## LC-02 — Fragment files: one genuine, one refuted · P2 · family: fragment-split

The edict hypothesized `compiled-frame.ts` (32L) and `numeric-plan.ts` (32L) as causeless splits. Importer census (grep of relative-import specifiers):

- **`compile/numeric-plan.ts` (32L, one exported fn `buildNumericPlan`) — CONFIRMED single-consumer fragment.** Sole importer: `compile/frame-compiler.ts`. Violates glass-ui *colocate-iff-single-owner*. It is the frame hot-path's numeric/residual partition builder — belongs inside the frame kernel.
- **`compile/compiled-frame.ts` (32L, 2 interfaces) — REFUTED.** Eight cross-zone importers: `waapi/eligibility.ts`, `waapi/densify.ts`, `resolve/element-resolve.ts`, `engine/composition.ts`, `engine/interpolate.ts`, `engine/compile-bridge.ts`, plus `frame-compiler.ts` + `numeric-plan.ts`. This is a correctly-extracted shared type contract (a kind-named own-runtime sibling in glass-ui terms). **Keep it.** The edict's premise here is wrong and should not drive a move.

**Disposition:** FOLD `numeric-plan.ts` into the `compile/frame/` kernel module (LC-06), not as a standalone rename. Explicitly RETIRE the `compiled-frame.ts` split proposal.

---

## LC-03 — God-modules >400 lines with nameable seams · P1 · family: god-module

Eight **code** files exceed 400 raw lines (glass-ui ~500 ceiling is looser, but the edict explicitly asks why fragmentation coexists with 461L modules). `presets/classic-data.ts` (458L) is a flat data table — excluded as legitimate. The real code god-modules, with internal seams read from source:

| file | L | seam analysis (verified export/section grep) |
|---|---|---|
| `physics/spring/progress.ts` | 484 | single `class SpringProgress` (line 67→EOF). God-class; largest file in `src/`. Candidate carves: solver-driving vs CSS-projection vs managed-play delegation. |
| `engine/play-lifecycle.ts` | 482 | **24 exported free functions** — the clearest "should be a module" case. Natural sub-files: events (`dispatchAnimationEvent`/`shouldReverse`/`reverse`), start-end (`onStart`/`onEnd`), frame (`advanceTo`/`playFrame`/`renderFrame`), strategies (`playRAF`/`playViaWAAPI`/`cancelWAAPI`/`playReducedMotion`/`snapToReducedMotion`/`play`), transport (`pause`/`resume`/`toggle`/`stop`/`playing`/`effectiveT`/`settle`/`reset`). |
| `engine/animation.ts` | 478 | single `class KeyframesAnimation` (line 58). God-class; delegates to play-lifecycle. Cohesive-as-class but oversized. |
| `orchestration/drag/draggable.ts` | 470 | types (25-124) + `class Draggable` (127-456, ~330L) + `drag()` factory (457). Class dominates. |
| `ingest/cssom.ts` | 466 | 3 interfaces + `resolveLiveKeyframes` (308) + `fromStyleSheets` (400) + `fromLiveAnimations` (418). Types+3 ingest entrypoints. |
| `compile/frame-compiler.ts` | 461 | single `class FrameCompiler` (line 83). Edict-named. |
| `compile/emit/entry.ts` | 459 | 5 interfaces/types (51-100) + one big `async compileToEntry` (363-459). Type-block + one fn. |
| `group/group.ts` | 437 | single `class AnimationGroup` (line 42). |

Just below the line: `compile/value-ast.ts` (exactly 400L) is the worst *cohesion* offender — it mixes AST type declarations (`ParsedVarMap`/`CompiledValue`/`AuthoredSink`), a parser (`parseAndFlattenObject`), a value compiler (`compileValuePair`), interpolation (`interpolateCompiledValue`), serialization (`serializeCompiledValue`), and four sink-builders. 17 importers → any split must stay a stable public-ish contract.

**Disposition:** BUILD `W-GODMODULE-CARVE` as several small waves, prioritized: (1) `play-lifecycle.ts` → `engine/play-lifecycle/{events,frame,strategies,transport,index}.ts` (24 free functions split cleanly, lowest risk); (2) `value-ast.ts` → split AST types from the value-compile functions (`compile/value/{ast,compile,sink}.ts`); (3) the god-classes (`SpringProgress`/`FrameCompiler`/`AnimationGroup`/`Draggable`) are class-cohesive — carve only helper methods into colocated `*-internals.ts`, do not shatter the class. Gate with a line-ceiling rung added under LC-04.

---

## LC-04 — No structural gate exists + phantom gate references · P1 · family: vacuous-gate / green-over-broken

**The library structure is completely unguarded, and source comments falsely assert otherwise.** Evidence:

- `package.json` defines exactly two proof gates: `proof:publish` (`scripts/gates/surface/index.mjs`) and `proof:owner-golden` (`scripts/gates/visual/index.mjs`). `scripts/gates/` contains only `surface/` and `visual/`. There is **no** no-flat-siblings, zone-cohesion, no-god-module, or colocation gate anywhere in `scripts/` or `test/`.
- Yet four source files document `proof:no-flat-siblings` as a live enforcing gate:
  - `orchestration/index.ts:7` — "…what `proof:no-flat-siblings` asserts"
  - `orchestration/view-transition/index.ts:12`
  - `orchestration/split-text/index.ts:9`
  - `physics/index.ts:9` — "…what `proof:no-flat-siblings` asserts present"
- `grep -rl "no-flat-siblings\|zone-cohesion"` (excluding `node_modules`/`docs`) returns only those source comments + `demo/DESIGN.md`. The gate names otherwise live only in `docs/tranches/{R,U}/…`.
- The prior **U lane-16** audit (`docs/tranches/U/audit/lane-16-lib-colocation-map.md`) asserted these gates *exist but are weak* ("`proof:no-flat-siblings` guards only the zone ROOT… `proof:zone-cohesion` measures per-FILE line count with an 11-entry allowlist"). At this HEAD they are **absent**, not weak — either removed since U or never real. Do not inherit U's premise.

This is the load-bearing P1: the edict says "enforce by standing gate, not one-time moves" (THE GRAND COLOCATION EDICT). Any V restructure lands on sand without a gate, and the current comments actively mislead a reader into believing the invariant is enforced.

**Disposition:** BUILD `W-STRUCTURE-GATE` FIRST in V, before any move wave: a `scripts/gates/structure/index.mjs` that fails on (a) hyphen-prefix-stutter, (b) files >N lines outside a justified allowlist, (c) single-`.ts` earned-dir violations, (d) single-consumer fragments. Then either implement the referenced `proof:no-flat-siblings`/`proof:zone-cohesion` names or FOLD the four stale comments. Born-RED so the backlog is the charter.

---

## LC-05 — `presets/` fragment-facade + misdescribing barrel · P2 · family: hollow-shim

`presets/` real content lives in `catalog.ts` (386L) + `classic-data.ts` (458L). The three "kind" files are hollow re-export shims:
- `presets/classic.ts` (36L) — pure `export { … } from "./catalog"`
- `presets/spring.ts` (6L) — pure `export { springScaleIn, … } from "./catalog"`
- `presets/taxonomy.ts` (7L) — pure `export { enterPresets, … } from "./catalog"`

Then `presets/index.ts` re-exports the *same names* a second time from `./classic`/`./spring`/`./taxonomy` — a double barrel hop (`index → classic → catalog`). Worse, `index.ts:5-8` doc-comment describes these files as the substance ("`classic.ts` (34 cubic-bezier/stepped presets), `spring.ts` (the spring-eased factories), `taxonomy.ts` (the … discovery index)") — factually wrong; they contain zero presets, only re-exports. The comment describes a "former 886L `animations.ts`" split that was subsequently re-consolidated into `catalog.ts`, leaving the kind-files as vestigial shims and the comment stale.

**Disposition:** FOLD — delete the three shims, point `presets/index.ts` directly at `catalog.ts`/`classic-data.ts` by-name, correct the doc-comment. Zero external-surface change (the named exports are unchanged; only the internal hop collapses).

---

## LC-06 — Long-flat zones wanting sub-modules · P2 · family: flat-sibling

Import-cohesion clustering (grep of intra-zone relative imports) exposes three flat dirs with natural encapsulated sub-modules:

- **`group/` (14 flat `.ts`)** — the largest flat zone. A tight `composite-*` triad exists: `composite-state.ts`→imported by `compositor.ts`+`composite-storage.ts`; `composite-storage.ts`→`compositor.ts`+`group.ts`. Propose `group/composite/{state,storage,compositor,index}.ts`.
- **`compile/` root (8 `.ts`)** — the edict's exact question ("should frame compilation be a module?"). The frame kernel is four tightly-coupled files: `frame-compiler.ts` (461) + `compiled-frame.ts` (32, the shared type) + `numeric-plan.ts` (32, single-consumer per LC-02) + `interp-slot.ts` (350). Propose `compile/frame/{compiler,frame,numeric-plan,interp-slot,index}.ts`. Leaves `compile/{value-ast,adapter,selector,index}.ts` as the value/adapt layer.
- **`compile/emit/` (12 flat)** — a `backward` triad: `backward.ts` (393) + `backward-color.ts` (385) + `backward-walk.ts` (148) = 926L → `emit/backward/{index,color,walk}.ts` (also resolves the LC-01 Class-B prefix). `format.ts`+`format-options.ts` similarly → `emit/format/`.

`physics/spring/` (14 files recursive) is **NOT** a violation — it already has `css/` and `solver/` sub-dirs; reported as a negative.

**Disposition:** BUILD `W-ZONE-SUBMODULE` waves per zone (group-composite, compile-frame, emit-backward), each a `git mv` + relative-import repoint, gated by LC-04. Merge LC-02's `numeric-plan` fold into the compile-frame wave.

---

## LC-07 — `internal/` naming + `transport/` over-nest · P2/P3 · family: grab-bag / earned-dir

The edict flags `internal/` as a grab-bag. Importer census **partly refutes** this — most members are genuine cross-zone shared substrate, not a dumping ground: `leaves.ts` (12 importers), `errors.ts` (11), `reduced-motion.ts` (10), `animation-id.ts` (4), `binarySearch.ts` (2), `scheduler.ts` (2), `scroll-phases.ts` (2). Only `helpers.ts` is near-single-owner (5 of 6 importers in `compile/`). So the *cohesion* is fine; the defects are naming/nesting:

- **`internal/transport/core.ts` (36L) — earned-dir violation (P3).** Single `.ts` file in its own directory (the only such case in `src/`). 3 importers (`group/lifecycle`, `orchestration/sequence/lifecycle`, `engine/play-lifecycle`). FOLD → `internal/transport-core.ts`.
- **`internal/binarySearch.ts` — the sole camelCase filename in `src/` (P3).** Every other file is kebab-case (`animation-id`, `scroll-phases`, `reduced-motion`). RENAME → `binary-search.ts`.
- **Naming (P3):** glass-ui's idiom name for this tier is `shared/`, not `internal/`. Optional rename; the grouping itself is sound — do **not** scatter these into consumers.

**Disposition:** FOLD `transport/` + rename `binarySearch`; treat `helpers.ts`→`compile/` as OPTIONAL (has 1 engine consumer, borderline). Explicitly retire the "scatter internal/" reading.

---

## LC-08 — `easing.ts` vs `compile/easing/` name collision · P3 · family: naming-collision

`src/animation/easing.ts` (root, 3 exports: `toEasing`/`cssTwinFor`/`resolveEasing` — the light/heavy boundary easing resolver) collides conceptually with `compile/easing/` (`easing-option.ts`+`easing-registry.ts` — the compile-side easing option parsing). They are genuinely **different concerns** (boundary resolution vs compile registry), so this is not a merge — but the shared name is a navigation hazard. Consider `easing-boundary.ts` for the root file, or documenting the split. Low priority.

**Disposition:** POLISH — rename or cross-reference doc-comment; not a move.

---

## LC-09 — Eponymous `dir/dir.ts` + redundant barrel · P3 · family: idiom

Six dirs carry an eponymous impl file alongside an `index.ts` barrel: `group/group.ts`, `orchestration/sequence/sequence.ts`, `orchestration/timeline/timeline.ts`, `orchestration/split-text/split-text.ts`, `orchestration/view-transition/view-transition.ts`, `physics/spring/solver/solver.ts`. The pattern (`dir/index.ts` re-exports `dir/dir.ts`) is defensible but doubles the layering vs glass-ui's kind-named-sibling idiom. Not urgent; note for consistency. (These are the LC-01 stutter-scan false positives, reported here for completeness.)

**Disposition:** POLISH / defer — a taste call for the owner, not a scheduled move.

---

## Proposed target tree (deltas only; unchanged files elided)

```
src/
  animation/
    compile/
      frame/                    # NEW module (LC-06) — the frame-compilation kernel
        compiler.ts             # ← frame-compiler.ts (carve helpers per LC-03)
        frame.ts                # ← compiled-frame.ts (shared type contract, KEEP content)
        numeric-plan.ts         # ← compile/numeric-plan.ts (LC-02 single-consumer fold)
        interp-slot.ts          # ← compile/interp-slot.ts
        index.ts
      value/                    # NEW (LC-03) — split value-ast.ts by concern
        ast.ts                  # types: ParsedVarMap/CompiledValue/AuthoredSink
        compile.ts              # parseAndFlattenObject/compileValuePair/interpolate/serialize
        sink.ts                 # buildAuthoredSink family
        index.ts
      adapter.ts  selector.ts  index.ts
      easing/
        option.ts               # ← easing-option.ts (LC-01)
        registry.ts             # ← easing-registry.ts (LC-01)
        index.ts
      emit/
        backward/               # NEW (LC-06) — backward-emit triad
          index.ts              # ← backward.ts
          color.ts              # ← backward-color.ts
          walk.ts               # ← backward-walk.ts
        format/                 # NEW — format pair
          index.ts              # ← format.ts
          options.ts            # ← format-options.ts
        entry.ts (carve) css-text.ts densify.ts easing-serialize.ts refusal-probes.ts view-transition.ts index.ts
    engine/
      play-lifecycle/           # NEW module (LC-03) — 24 free functions
        events.ts frame.ts strategies.ts transport.ts index.ts
      animation.ts (carve helpers) options.ts compile-bridge.ts …
      css/
        animation.ts            # ← css-animation.ts (LC-01)
        metadata.ts index.ts
    group/
      composite/                # NEW (LC-06) — composite triad
        state.ts storage.ts compositor.ts index.ts
      group.ts entries.ts layer-api.ts lifecycle.ts soa.ts springs.ts types.ts waapi.ts weight.ts yield-batch.ts index.ts
    resolve/
      function.ts               # ← resolve-function.ts (LC-01)
      conditional.ts            # ← resolve-if.ts (LC-01)
      …
    waapi/
      options.ts                # ← waapi-options.ts (LC-01)
      …
    internal/                   # (optionally → shared/) mostly-legit substrate (LC-07)
      transport-core.ts         # ← internal/transport/core.ts (fold single-file dir)
      binary-search.ts          # ← binarySearch.ts (kebab-case)
      animation-id.ts errors.ts helpers.ts leaves.ts reduced-motion.ts scheduler.ts scroll-phases.ts
    presets/                    # LC-05 — delete hollow shims
      catalog.ts classic-data.ts index.ts   # index re-exports catalog/classic-data directly
      # DELETED: classic.ts, spring.ts, taxonomy.ts
    easing.ts (→ easing-boundary.ts, optional LC-08)  validate.ts  public.ts  index.ts
```

## Move/merge/split/rename table

| # | old → new | op | rationale | finding |
|---|---|---|---|---|
| 1 | `compile/easing/easing-option.ts` → `compile/easing/option.ts` | rename | drop dir-stutter | LC-01 |
| 2 | `compile/easing/easing-registry.ts` → `compile/easing/registry.ts` | rename | drop dir-stutter | LC-01 |
| 3 | `waapi/waapi-options.ts` → `waapi/options.ts` | rename | drop dir-stutter | LC-01 |
| 4 | `resolve/resolve-function.ts` → `resolve/function.ts` | rename | drop dir-stutter | LC-01 |
| 5 | `resolve/resolve-if.ts` → `resolve/conditional.ts` | rename | drop dir-stutter + clarity | LC-01 |
| 6 | `engine/css/css-animation.ts` → `engine/css/animation.ts` | rename | drop dir-stutter | LC-01 |
| 7 | `compile/{frame-compiler,compiled-frame,numeric-plan,interp-slot}.ts` → `compile/frame/*` | split-into-module | frame kernel is a module; folds LC-02 fragment | LC-06/LC-02 |
| 8 | `compile/value-ast.ts` → `compile/value/{ast,compile,sink}.ts` | split | 400L mixes types+parser+compiler+sinks | LC-03 |
| 9 | `engine/play-lifecycle.ts` → `engine/play-lifecycle/{events,frame,strategies,transport}.ts` | split-into-module | 24 free functions | LC-03 |
| 10 | `compile/emit/backward{,-color,-walk}.ts` → `emit/backward/{index,color,walk}.ts` | merge-into-module | 3-file cluster, 926L | LC-06/LC-01B |
| 11 | `compile/emit/format{,-options}.ts` → `emit/format/{index,options}.ts` | merge-into-module | pair cluster | LC-06/LC-01B |
| 12 | `group/{composite-state,composite-storage,compositor}.ts` → `group/composite/{state,storage,compositor}.ts` | merge-into-module | tight import triad | LC-06 |
| 13 | `presets/{classic,spring,taxonomy}.ts` → DELETE | delete | hollow re-export shims over catalog.ts | LC-05 |
| 14 | `internal/transport/core.ts` → `internal/transport-core.ts` | fold-dir | single-file earned-dir violation | LC-07 |
| 15 | `internal/binarySearch.ts` → `internal/binary-search.ts` | rename | kebab-case convention | LC-07 |
| 16 | `src/.DS_Store` → DELETE + gitignore | delete | stray artifact in tracked tree | (hygiene) |
| 17 | god-class helper carves (`SpringProgress`/`FrameCompiler`/`AnimationGroup`/`Draggable`) | carve | trim >400L classes without shattering | LC-03 |

All 17 preserve the published surface: `package.json` `exports` is only `.` (`src/animation/index.ts`) and `./engine` (`src/animation/public.ts`); none of the renamed/moved files are export keys. Internal `import` repoints only.

---

## Negatives (checked and found sound)

- **All 24 `index.ts` barrels are PURE** — grep for `const|function|class|let|var` definitions and real statements across every `index.ts` returns zero. The impure-barrel hypothesis is refuted (my initial line-heuristic false-positived on multi-line named-export lists in `presets/index.ts` and `orchestration/index.ts`; manual read confirms pure re-exports).
- **`compiled-frame.ts` is correctly split** — 8 cross-zone consumers make it a legitimate shared type contract, not a causeless fragment (LC-02).
- **`physics/spring/` is well-encapsulated** — already has `css/` and `solver/` sub-dirs; not a flat-sibling violation.
- **`constants/` is a legitimate earned dir** — 3 members (`defaults`, `types` 259L, `index` barrel); `constants/types.ts` is the library's LIGHT-pure global type tier, correctly shared (10 LIGHT importers per CLAUDE.md).
- **`internal/` cohesion is mostly sound** — 7 of 9 members have ≥2 cross-zone consumers; the grab-bag charge is only partly true (naming + one over-nested dir), not a scatter mandate.
- **`easing.ts` vs `compile/easing/`** are genuinely different concerns (boundary resolution vs compile registry), not a mistaken duplicate.

## Coverage gaps

- Did **not** run a full `npm run build` / `vite dts` — verified the public surface only at the `package.json` `exports`-map + entry-source level (`src/animation/index.ts`, `src/animation/public.ts`). A restructure wave must re-verify `dist/keyframes.d.ts` + `dist/engine/index.d.ts` emit unchanged.
- Import-graph clustering used `grep` of relative specifiers, not a compiled dependency graph — the sub-module boundaries in LC-06 are cohesion-motivated but a codemod should re-derive exact cut sets.
- God-class internal carves (LC-03 items 8-9-17) name seams from export/section reading, not a full call-graph — the exact method partitions need per-file design.
- Did not audit `demo/` structure (out of lane — library `src/` only). The `proof:no-flat-siblings` phantom-gate reference also appears in `demo/DESIGN.md`; a demo-lane should confirm.
- The line-ceiling threshold (glass-ui ~500 raw vs the edict's implicit ~400) is a policy choice left to the LC-04 gate design, not fixed here.
