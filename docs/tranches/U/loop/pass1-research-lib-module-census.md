# Tranche U — Loop Pass 1 · Research · lib-module-census

**Lane.** `lib-module-census` (step 1 of the owner 5-step convergence loop, pass 1).
**Mandate.** OWNER-ASKS row 6 + OD-U16 ("Module granularity, BOTH directions"):
every library module assayed against BOTH bounds — long files → module dirs (owner's
named example `compile/easing-option.ts` → `compile/easing/`), "absurdly small
modules abrogated for superfluity and made inline". READ-ONLY census.

**Scope.** Every `.ts` under `src/animation/` (80 source files + 1 `CLAUDE.md`),
`find + wc -l + grep`. Reconciled with the prior audit (lane-16 colocation-map,
lane-11..15 zone lanes) and the chartered waves (U.C8 `compile/{emit,easing}/`, U.C
physics/spring carves, U.C3/C14/C15 group redesign).

---

## Headline

The library is ~80% already-colocated (R.W1's 11-zone partition + S.B sub-zones).
The census confirms the shape lane-16 mapped and the U.C waves charter, and adds the
per-file granularity seed OD-U16 demands. **Net: 4 directory CARVES (compile/,
physics/spring/, group/, resolve/), ~6 individual long-file carves, 3 DELETE/DISSOLVE
(the `constants/index.ts` back-compat barrel, the `physics/spring/vector.ts` verbatim
copy, `CLAUDE.md`), and — critically — ONLY ONE genuine INLINE candidate under the
"absurdly small" bound (`internal/scroll-phases.ts`, 16 LOC), and even that is a
SHARED leaf so inlining would DUPLICATE.** The owner's own named example
(`easing-option.ts`, 56 LOC) is itself SMALL — its correct disposition is
RELOCATE-into-`compile/easing/` (U.C8), not carve-open and not inline; the owner's
example was pointing at the long-flat `compile/` DIRECTORY, not the file. There is
almost no "absurdly small" debt in this library; the granularity pressure is nearly
all in the long-file / long-flat-dir direction.

Legend — **verdict**: CARVE-DIR (relocate into a new/renamed sub-module dir) ·
CARVE-FILE (split an over-ceiling file internally) · KEEP · INLINE (fold into named
target + delete) · DELETE (remove; dead/duplicate/legacy). Importer counts are
`grep`-approximate (path-segment match across `src/animation`, self excluded);
index barrels counted as importers where they re-export.

---

## Root files (`src/animation/*.ts`)

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `index.ts` | 310 | 54 | 1 | **CARVE-FILE** | Package barrel. Carries the ~150-line hand-spelled type re-list U.C deletes ("AnimationEngine type derived not hand-spelled; index.ts's 150-line type re-list deleted"). The LIGHT static surface stays; the type mirror collapses. |
| `load-engine.ts` | 391 | 3 | 2 | **CARVE-FILE / near-DELETE** | U.C surface collapse: `loadAnimationEngine = () => import("./public")`. The 391-line `Promise.all`-over-chunks merge dissolves once `public.ts` is the single dynamic import target. Most of this file evaporates. |
| `public.ts` | 169 | 20 | 0 | **KEEP** | HEAVY static mirror (`./engine` subpath). Becomes the SOLE dynamic-import target after U.C. imp=0 is correct (it is an entry point, not imported). |
| `easing.ts` | 97 | 3 | 6 | **KEEP** | `resolveEasing`/`toEasing`/`cssTwinFor` boundary factory. Root-level cross-zone facade — correct home (C-9). NOTE lane-10 F4: the sibling `test/easing/` is a false zone (tests value.js, not kf) — a TEST-tree finding, out of this census's src scope. |
| `validate.ts` | 242 | 4 | 3 | **KEEP** | `validate`/`explain` — the FORWARD read-only projection facade. Stays root as a HEAVY cross-zone verb (C-9). |

---

## `constants/`

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `types.ts` | 322 | 15 | 27 | **KEEP** | The library's legitimate LIGHT-pure global type tier (10 LIGHT importers + 17 heavy). AFFIRM (lane-16 F5). Zero non-`import type` edges. |
| `defaults.ts` | 80 | 7 | 2 | **KEEP** | The two value.js-bearing consts (`defaultOptions`/`defaultLayerConfig`). Correct split. |
| `index.ts` | 15 | 2 | 1 | **DELETE (dissolve)** | Back-compat barrel; the 10 LIGHT importers already migrated to `./types`. Under NO-LEGACY, the remaining heavy importers retarget `./defaults`/`./types` directly and the barrel dissolves (lane-16 F5). The clearest small-module abrogation in the tree. |

---

## `physics/` (LIGHT) + `physics/spring/`

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `numeric.ts` | 265 | 3 | 3 | **KEEP** | `NumericAnimation` zero-alloc interp. |
| `smooth.ts` | 201 | 3 | 4 | **KEEP** | `SmoothProgress`. U.C notes a managed-play carve to be *completed* (symmetry with spring). |
| `oscillator.ts` | 149 | 4 | 2 | **KEEP** | |
| `decay.ts` | 100 | 4 | 4 | **KEEP** | Pure closed-form math. |
| `morph.ts` | 122 | 3 | 3 | **KEEP** | `ElementMorph`. |
| `playback.ts` | 250 | 3 | 10 | **KEEP** | `RAFPlayback` — THE rAF driver, hot-path, high fan-in. |
| `index.ts` | 41 | 14 | 1 | **KEEP** | Zone barrel. |
| `spring/progress.ts` | 492 | 1 | 3 | **KEEP** | The hot-path `SpringProgress` class (F4 justified). Over-ceiling but a single cohesive hot-path class — KEEP, do not carve the class body. |
| `spring/managed-play.ts` | 67 | 3 | 1 | **KEEP** | Sole consumer `progress.ts` (already over-ceiling) — carving out the managed loop is CORRECT; do NOT inline back. |
| `spring/types.ts` | 124 | 6 | 27 | **KEEP** | Colocated zone types. |
| `spring/solver.ts` | 77 | 2 | 1 | **CARVE-DIR** | → `physics/spring/solver/` (lane-16 F1; U.C7). Closed-form damped-harmonic kernel. |
| `spring/sample.ts` | 66 | 2 | 2 | **CARVE-DIR** | → `solver/`. |
| `spring/vector.ts` | 154 | 2 | 1 | **DELETE** | U.C4: "the spring closed-form unified into ONE modal kernel (the vector.ts verbatim copy deleted)". This is a duplication, not a carve target — it is REMOVED by the modal-kernel unification, then the survivors move into `solver/` (U.C4 BEFORE U.C7). |
| `spring/duration.ts` | 83 | 2 | 2 | **CARVE-DIR** | → `solver/`. |
| `spring/reseat.ts` | 98 | 3 | 1 | **CARVE-DIR** | → `solver/`. Velocity-continuous interruption seam. |
| `spring/linear-stops.ts` | 71 | 2 | 2 | **CARVE-DIR** | → `physics/spring/css/` (F1). CSS `linear()` twin — LIGHT (emits strings). |
| `spring/timing-function.ts` | 116 | 2 | 1 | **CARVE-DIR** | → `physics/spring/css/`. |
| `spring/index.ts` | 30 | 11 | 1 | **KEEP** | Sub-zone barrel (re-anchor to new `solver/`+`css/`). |

Spring carve nets: `spring/` root keeps `progress.ts` · `managed-play.ts` ·
`types.ts` · `index.ts`; `solver/` = {solver, sample, duration, reseat (+ survivor
of vector's fold) + index}; `css/` = {linear-stops, timing-function + index}.

---

## `orchestration/` (LIGHT)

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `stagger.ts` | 177 | 4 | 3 | **KEEP** | |
| `flip.ts` | 176 | 3 | 3 | **KEEP** | |
| `index.ts` | 57 | 14 | 1 | **KEEP** | Zone barrel. |
| `drag/draggable.ts` | 471 | 5 | 2 | **CARVE-FILE (watch)** | Over-ceiling (471). Pointer-capture + fling + bounds/snap/rubberBand in one file — candidate for a `drag/` internal split (gesture-state vs physics-seat). Borderline; loop should score. |
| `drag/drag-2d.ts` | 115 | 2 | 1 | **KEEP** | 2-D sugar. |
| `drag/index.ts` | 13 | 4 | 1 | **KEEP** | Sub-zone barrel. |
| `sequence/sequence.ts` | 402 | 4 | 6 | **CARVE-FILE (watch)** | Over-ceiling (402); the master-playhead class. U.C touches sequence as one of the "three copied play FSMs" folded into the Transport core — carve pressure is the FSM dedup, not a cosmetic split. |
| `sequence/events.ts` | 216 | 6 | 2 | **KEEP** | |
| `sequence/lifecycle.ts` | 172 | 8 | 4 | **KEEP** | |
| `sequence/transport.ts` | 300 | 12 | 2 | **KEEP** | (folds into the unified Transport, U.C.) |
| `sequence/index.ts` | 18 | 2 | 1 | **KEEP** | |
| `split-text/split-text.ts` | 345 | 4 | 3 | **KEEP** | At ceiling; cohesive. |
| `split-text/segment.ts` | 77 | 3 | 1 | **KEEP** | Sole consumer split-text.ts (at ceiling) — carve is correct. |
| `split-text/refuse.ts` | 64 | 2 | 2 | **KEEP** | Refusal error + guard; 2 consumers. |
| `split-text/index.ts` | 19 | 5 | 1 | **KEEP** | |
| `timeline/timeline.ts` | 221 | 5 | 4 | **KEEP** | |
| `timeline/native.ts` | 80 | 3 | 3 | **KEEP** | |
| `timeline/index.ts` | 21 | 4 | 1 | **KEEP** | |
| `view-transition/view-transition.ts` | 260 | 4 | 6 | **KEEP** | |
| `view-transition/index.ts` | 19 | 4 | 1 | **KEEP** | |

---

## `engine/` (HEAVY) + `engine/css/`

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `animation.ts` | 483 | 2 | 8 | **KEEP** | Base `KeyframesAnimation`. Already carved (play-lifecycle/interpolate/option-setters/etc). Over-ceiling but the residual class after the S.B carves — KEEP (F4). U.C dedups its play FSM into the shared Transport core. |
| `play-lifecycle.ts` | 489 | 23 | 2 | **CARVE-FILE / DEDUP** | Over-ceiling (489); one of the THREE copied play FSMs (engine/group/sequence) U.C dissolves into ONE value.js-free Transport core. Not a cosmetic carve — a de-duplication that shrinks it. |
| `interpolate.ts` | 332 | 5 | 1 | **KEEP** | Per-frame lerp+apply hot path. |
| `playback-state.ts` | 55 | 1 | 1 | **KEEP** | The `PlaybackState` single-STORAGE store (S.B2 C-15). Small + single-consumer BUT deliberately carved as the sole backing store — inlining would re-merge FSM state into the class body it was extracted from. Do NOT inline. |
| `option-setters.ts` | 159 | 12 | 1 | **KEEP** | |
| `options.ts` | 193 | 9 | 5 | **KEEP** | |
| `compile-bridge.ts` | 101 | 4 | 1 | **KEEP** | FrameCompiler bridge. |
| `composition.ts` | 221 | 7 | 2 | **KEEP** | |
| `index.ts` | 29 | 6 | 1 | **KEEP** | Zone barrel. |
| `css/css-animation.ts` | 274 | 1 | 1 | **KEEP** | `CSSKeyframesAnimation` — the PRIMARY "in". |
| `css/metadata.ts` | 179 | 3 | 1 | **KEEP** | @property + scroll-timeline recovery. |
| `css/index.ts` | 15 | 1 | 1 | **KEEP** | Sub-zone barrel. |

---

## `group/` (HEAVY) — the OD-U14 compositor redesign zone

The owner's named "primary issue" (compositing/stacking/layering, OD-U14). U.C3
re-charters the zone: a `group/draw.ts` renderer + owned `CompositeState` store;
`plain-vars.ts` moves OUT of `compile/` INTO the renderer seam; lane-16 F6 carves a
`group/blend/`. So this zone is REDESIGNED, not merely relocated.

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `group.ts` | 440 | 2 | 9 | **KEEP (redesign)** | Hot-path class (F4). U.C3 moves draw-scratch fields into `CompositeState`; the class thins. |
| `lifecycle.ts` | 158 | 9 | 4 | **KEEP / DEDUP** | Transport free-functions — one of the three FSMs unified in U.C. |
| `entries.ts` | 127 | 6 | 4 | **KEEP** | |
| `layer-api.ts` | 91 | 4 | 1 | **CARVE-DIR** | → `group/blend/` (F6). Sole consumer group.ts. |
| `types.ts` | 28 | 3 | 27 | **KEEP** | Colocated zone types. |
| `soa.ts` | 265 | 4 | 2 | **CARVE-DIR** | → `group/blend/`. Zero-alloc SoA fold. U.C15 (`replace\|add\|accumulate` op axis) rewrites its interior. |
| `compositor.ts` | 274 | 2 | 2 | **CARVE-DIR** | → `group/blend/`. The stale-leaf freeze class lives here (OD-U14/C14). |
| `springs.ts` | 92 | 3 | 2 | **CARVE-DIR** | → `group/blend/`. |
| `yield-batch.ts` | 55 | 2 | 1 | **CARVE-DIR** | → `group/blend/` (or keep root — INP batching helper, sole consumer group.ts). Small; loop scores keep-vs-move. |
| `index.ts` | 20 | 2 | 1 | **KEEP** | Zone barrel. |

Nets (reconciled with U.C3+F6): `group/` root = {group, lifecycle, entries, types,
index} + the new `draw.ts` renderer + `CompositeState`; `blend/` = {soa, compositor,
springs, layer-api (+maybe yield-batch)}. NOTE U.C3 also relocates
`compile/plain-vars.ts` INTO this zone's renderer seam (see compile/ below).

---

## `compile/` (HEAVY) — U.C8 `{emit,easing}/` + U.C9 de-accretion

The owner's named example dir. The FIX (lane-16 F2, chartered U.C8): the FORWARD
pipeline stays at root; the heavy easing resolvers cluster into `easing/`; the three
`→CSS` emitters gather under `emit/` (rename `backward/` → `emit/`, move `entry.ts`
+ `view-transition.ts` in).

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `parse-flatten.ts` | 320 | 4 | 8 | **KEEP** (root, FORWARD) | |
| `frame-compiler.ts` | 458 | 1 | 2 | **CARVE-FILE (watch)** | Over-ceiling (458), hot-path (F4 keeps). U.C9 de-accretion may shave; but it is the FORWARD core — favor KEEP unless a clean concern splits out. |
| `numeric-plan.ts` | 59 | 1 | 1 | **KEEP** (root, FORWARD) | Sole consumer frame-compiler.ts (already over-ceiling) — do NOT inline into it. Distinct numeric-SoA-plan concern. |
| `selector.ts` | 170 | 8 | 4 | **KEEP** (root, FORWARD) | |
| `plain-vars.ts` | 128 | 4 | 4 | **RELOCATE (zone move)** | U.C3: moves OUT of `compile/` INTO the `group/` renderer seam (`Renderer` plain-object projection). Not a compile concern. |
| `adapter.ts` | 329 | 4 | 8 | **KEEP** (root, FORWARD) | `resolveKeyframes` (C-9). |
| `easing-registry.ts` | 124 | 1 | 4 | **CARVE-DIR** | → `compile/easing/` (U.C8). NOTE lane-27 F2: `getTimingFunction` re-authors a CSS timing-function dispatcher that value.js should own — a constellation-edge de-dup on top of the relocate. |
| `easing-option.ts` | 56 | 1 | 3 | **CARVE-DIR** | → `compile/easing/` (U.C8). **The owner's literal named example.** It is SMALL (56 LOC) — correct disposition is RELOCATE into the `easing/` module, NOT carve-open (nothing to split) and NOT inline (3 consumers: frame-compiler `addFrame`, engine/options default, + re-export). The owner's "broken into modules, like easing/" was naming the long-flat `compile/` DIRECTORY, resolved by the `easing/` cluster. |
| `entry.ts` | 434 | 6 | 4 | **CARVE-DIR + watch** | → `compile/emit/` (U.C8). Over-ceiling; F4 keeps as a cohesive emitter, U.C9 may de-accrete >350L interior. |
| `view-transition.ts` | 393 | 6 | 6 | **CARVE-DIR** | → `compile/emit/` (U.C8). |
| `index.ts` | 68 | 13 | 1 | **KEEP** (re-anchor) | Zone barrel; re-anchor to `easing/`+`emit/`. |
| `backward/backward.ts` | 475 | 9 | 4 | **CARVE-FILE + rename** | `compileToCSS`; dir renames `backward/`→`emit/`. Over-ceiling (475) — U.C9 >350L carve + `refusal-probes.ts` extraction. |
| `backward/backward-walk.ts` | 143 | 6 | 2 | **KEEP** (→emit/) | |
| `backward/backward-color.ts` | 353 | 5 | 2 | **CARVE-FILE (watch)** | Over-ceiling (353); oklab densify. U.C9 candidate. |
| `backward/format.ts` | 336 | 7 | ~ | **KEEP** (→emit/) | @keyframes serializer. |
| `backward/format-options.ts` | 158 | 4 | 2 | **KEEP** (→emit/) | |
| `backward/easing-serialize.ts` | 88 | 4 | 4 | **KEEP** (→emit/) | |
| `backward/densify.ts` | 131 | 1 | 3 | **KEEP** (→emit/) | |
| `backward/index.ts` | 47 | 9 | 1 | **KEEP** (→emit/index.ts) | |

Nets: `compile/` root = FORWARD {parse-flatten, frame-compiler, numeric-plan,
selector, adapter, index} (plain-vars LEAVES to group/); `easing/` =
{easing-registry, easing-option, index}; `emit/` = {backward*, format*,
easing-serialize, densify, entry, view-transition, refusal-probes(new), index}.

---

## `resolve/` (HEAVY) — lane-16 F7 optional `resolvers/`

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `core.ts` | 193 | 3 | 1 | **KEEP** (root) | The recursion + `resolveNode` dispatch seam. |
| `spring-css.ts` | 87 | 3 | (via core) | **CARVE-DIR** | → `resolve/resolvers/` (F7). |
| `resolve-if.ts` | 199 | 3 | 2 | **CARVE-DIR** | → `resolvers/`. |
| `resolve-function.ts` | 206 | 2 | 2 | **CARVE-DIR** | → `resolvers/`. |
| `element-resolve.ts` | 195 | 2 | 1 | **CARVE-DIR** | → `resolvers/`. |
| `env.ts` | 134 | 6 | 4 | **CARVE-DIR** | → `resolvers/`. |
| `index.ts` | 30 | 5 | 1 | **KEEP** | Zone barrel. |

Optional (lane-16 F7): charter only if F3's directory-density N ≤ 5. 6 per-kind
rewriters under one dispatcher — a clean `resolvers/` cluster.

---

## `ingest/` · `scroll/` · `waapi/` · `svg/` · `presets/` (HEAVY)

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `ingest/cssom.ts` | 466 | 6 | 2 | **CARVE-FILE (watch)** | Over-ceiling (466); the CSSOM walk. Candidate internal split. |
| `ingest/adopt.ts` | 349 | 5 | 1 | **KEEP** | At ceiling; temporal takeover. U.C adds the `seekAndPlay` primitive here. |
| `ingest/index.ts` | 20 | 4 | 1 | **KEEP** | |
| `scroll/grammar.ts` | 137 | 6 | 1 | **KEEP** | |
| `scroll/scene.ts` | 319 | 7 | 1 | **KEEP** | |
| `scroll/dispatch.ts` | 140 | 4 | 1 | **KEEP** | |
| `scroll/range.ts` | 116 | 2 | 3 | **KEEP** | |
| `scroll/trigger.ts` | 317 | 5 | 1 | **KEEP** | |
| `scroll/index.ts` | 49 | 10 | 1 | **KEEP** | Zone barrel. |
| `waapi/eligibility.ts` | 269 | 2 | 2 | **KEEP** | |
| `waapi/emission.ts` | 66 | 1 | 1 | **KEEP** | Sole consumer delegation.ts (151L, has room). Borderline INLINE, but a named pipeline stage (`toWAAPIKeyframes`) — favor KEEP for pipeline legibility; loop may score inline. |
| `waapi/waapi-options.ts` | 116 | 2 | 2 | **KEEP** | |
| `waapi/delegation.ts` | 151 | 3 | 1 | **KEEP** | |
| `waapi/densify.ts` | 287 | 4 | 3 | **KEEP** | |
| `waapi/index.ts` | 25 | 7 | 1 | **KEEP** | Zone barrel. |
| `svg/motion-path.ts` | 177 | 4 | 3 | **KEEP** | |
| `svg/draw-svg.ts` | 194 | 4 | 3 | **KEEP** | |
| `svg/morph-svg.ts` | 348 | 4 | 3 | **KEEP** | At ceiling; public factory + class. |
| `svg/morph-geometry.ts` | 170 | 11 | 1 | **KEEP** | Geometry sampler (T.F22 carve). |
| `svg/handle.ts` | 53 | 1 | 3 | **KEEP** | Abstract base (closes `.finished` asymmetry); 3 consumers — shared base, do NOT inline. |
| `svg/index.ts` | 14 | 6 | 1 | **KEEP** | Zone barrel. |
| `presets/classic.ts` | 304 | 2 | 2 | **KEEP** | |
| `presets/classic-data.ts` | 458 | 34 | 1 | **KEEP** | Flat DATA table (F4 justified). OD-U6 folds the 34×4 parallel hand-lists into ONE data table — a de-dup INSIDE presets, not a carve. |
| `presets/spring.ts` | 93 | 4 | 10 | **KEEP** | |
| `presets/taxonomy.ts` | 105 | 5 | 1 | **KEEP** | |
| `presets/index.ts` | 61 | 3 | 1 | **KEEP** | Zone barrel. |

---

## `internal/` — the value.js-free global LEAF tier (C-5, AFFIRM)

Every leaf verified multi-zone (lane-16 F5) → none colocates down, none inlines
(inlining a multi-consumer leaf DUPLICATES). This is the library's legitimate
"composables/-style shared dir for truly-global members" (the colocation edict
EXPRESSLY permits it). **AFFIRM, do not dissolve.**

| File | LOC | exp | imp | Verdict | Note |
|---|---|---|---|---|---|
| `leaves.ts` | 75 | 4 | 12 | **KEEP** | rAF shims + re-exported value.js math (kills the light→grammar edge). |
| `errors.ts` | 108 | 4 | 11 | **KEEP** | |
| `reduced-motion.ts` | 162 | 5 | 10 | **KEEP** | The ONE reduced-motion gate. |
| `animation-id.ts` | 34 | 2 | 4 | **KEEP** | Small (34) BUT 4 cross-zone consumers; the R.W2c edge-break leaf. Inlining would re-introduce the `group→engine` edge. Do NOT inline. |
| `scheduler.ts` | 49 | 1 | 3 | **KEEP** | `yieldToMain` — 3 consumers. |
| `binarySearch.ts` | 37 | 1 | 2 | **KEEP** | 2 consumers (engine + physics). |
| `scroll-phases.ts` | 16 | 1 | 2 | **KEEP (flag)** | **The ONLY genuinely "absurdly small" file (16 LOC) in the tree** — the OD-U16 archetype. BUT shared by `scroll/range.ts` + `compile/selector.ts` (2 zones); inlining would duplicate the phase constants across zones. Correct as a leaf. If a future pass finds it single-consumer it inlines; today it stays. |

---

## Documentation

| File | LOC | Verdict | Note |
|---|---|---|---|
| `src/animation/CLAUDE.md` | 395 | **DELETE** | OD-U15: ALL CLAUDE.md deleted TOTALLY; load-bearing content re-homed inline (docstrings) or deftly into the README. This 395-line file is the richest of the three — its per-file inventory, the two-package-"in" doctrine, the boundary contract, and the computed-unit container contract must be re-homed BEFORE deletion (the loop's re-home inventory). The gates that read it (claude-paths-live, claude-structure-sync) die in the same motion. |

---

## Aggregate granularity findings (OD-U16, both bounds)

**Long bound (carve).** 12 files ≥ 400 LOC, 5 more in 350–399:
- Hot-path/data KEEP-as-is (F4 justified): `physics/spring/progress.ts` (492),
  `group/group.ts` (440), `presets/classic-data.ts` (458, data), `engine/animation.ts` (483, residual class), `frame-compiler.ts` (458, FORWARD core).
- Genuine carve/de-dup pressure: `engine/play-lifecycle.ts` (489 — FSM dedup, U.C),
  `orchestration/drag/draggable.ts` (471), `compile/backward/backward.ts` (475 — U.C9 >350 carve + refusal-probes), `ingest/cssom.ts` (466), `compile/entry.ts` (434 — U.C9), `orchestration/sequence/sequence.ts` (402 — FSM dedup), `compile/view-transition.ts` (393 — relocate to emit/), `load-engine.ts` (391 — near-dissolved by U.C), `compile/backward/backward-color.ts` (353), `svg/morph-svg.ts` (348), `orchestration/split-text/split-text.ts` (345).

**Long-flat-DIR bound (carve into sub-modules).** 4 directories:
`physics/spring/` (11→root+solver/+css/), `compile/` (11 root→root+easing/+emit/),
`group/` (10→root+blend/), `resolve/` (7→root+resolvers/ optional). This is the
enforcement gap lane-16 F3 names — no gate today covers intra-zone flat density.

**Small bound (inline/abrogate).** NEARLY EMPTY — the striking census result. Real
DELETE/DISSOLVE: `constants/index.ts` (back-compat barrel, dead), `physics/spring/vector.ts`
(verbatim-copy duplication, U.C4), `CLAUDE.md` (OD-U15). Only ONE file meets the
literal "absurdly small" bar (`internal/scroll-phases.ts`, 16 LOC) and it is a
SHARED leaf → KEEP. The ~10 files in the 49–67 LOC band are all either single-concern
carve-outs FROM an over-ceiling parent (playback-state, managed-play, numeric-plan,
yield-batch, refuse, emission) — where inlining REVERSES a deliberate decomposition —
or multi-consumer leaves (animation-id, scheduler, binarySearch, scroll-phases). The
owner's own named example (`easing-option.ts`) is in this band and its disposition is
RELOCATE, not inline. **The small-module-inlining direction of OD-U16 has almost no
targets in the LIBRARY; the granularity work is overwhelmingly the long direction and
the 4 directory carves.**

---

## Rules/verdicts for the spec

1. **The owner's named example is a RELOCATE, not a carve-open or an inline.**
   `compile/easing-option.ts` (56 LOC, 3 consumers) moves whole into `compile/easing/`
   beside `easing-registry.ts` (U.C8). The owner's "broken into modules, like easing/"
   named the long-flat `compile/` DIRECTORY, not the file. Spec must state this so the
   loop does not try to split a 56-line file or inline a 3-consumer one.

2. **Four directory carves are the library's granularity payload** (each a PURE move
   preserving LIGHT/HEAVY): `physics/spring/{solver,css}/` (LIGHT, U.C4→U.C7),
   `compile/{easing,emit}/` (HEAVY, U.C8; `backward/`→`emit/` rename, `entry.ts` +
   `view-transition.ts` move in), `group/blend/` (HEAVY, F6, folds into the U.C3
   redesign), `resolve/resolvers/` (HEAVY, F7, optional on directory-density N).

3. **The "absurdly small → inline" direction has essentially NO library targets.**
   The 49–67 LOC band is deliberate decomposition (carve-outs from over-ceiling
   parents) or multi-consumer leaves; inlining any would REVERSE an architectural
   decision (single-storage `playback-state`, edge-break `animation-id`,
   FSM-carve `managed-play`) or DUPLICATE a shared leaf. Spec: assert the inline bound
   was assayed and found near-vacuous in the library (it may bite harder in the demo).

4. **Three genuine DELETE/DISSOLVE (not carves):** `constants/index.ts` (dead
   back-compat barrel — heavy importers retarget `./defaults`/`./types`),
   `physics/spring/vector.ts` (verbatim-copy duplication removed by the U.C4 modal-kernel
   unification, ORDERED before the `solver/` carve), `CLAUDE.md` (OD-U15 — re-home its
   load-bearing content inline/README FIRST, then delete with its reader-gates).

5. **KEEP the two global tiers** — `internal/` (7 multi-zone leaves) and
   `constants/{types,defaults}` — AFFIRM as legitimate shared dirs; dissolve ONLY the
   `constants/index.ts` shim. Do not let a naive colocation pass push leaves into zones.

6. **Zone moves that CROSS zones** (beyond directory carves): `compile/plain-vars.ts`
   → the `group/` renderer seam (U.C3, it is a projection concern not a compile one).
   Spec must sequence this with the group redesign, not the compile carve.

7. **Long-flat-DIR enforcement is the standing gap** (lane-16 F3): no gate covers
   intra-zone flat density; `proof:no-flat-siblings` guards only the zone ROOT and
   `proof:zone-cohesion` counts per-FILE lines with an 11-entry JUSTIFIED deferral
   allowlist. Spec: add a per-directory concern-density clause AND retire the
   allowlist entries that the four carves make structural (carve, don't declare).

8. **Every carve re-anchors path-literal gates** (`proof:boundary`,
   `proof:published-surface`, `proof:engine-subpath-mirror`, `proof:zone-cohesion`
   JUSTIFIED map, backward-anchored gates) and MUST resolve all touched imports at
   module-load (no per-frame indirection) — the LIGHT (`physics/`) carves stay
   value.js-free, the HEAVY carves stay behind `loadAnimationEngine()`.

9. **Surface collapse (U.C, orthogonal to granularity but same files):** `index.ts`
   sheds its ~150-line hand-spelled type re-list (AnimationEngine derived from the
   d.ts); `load-engine.ts` collapses to `loadAnimationEngine = () => import("./public")`
   — these two root files SHRINK dramatically, changing their census weight next pass.
