# Lane 32 — Target-Tree Synthesis Scout

**Fleet:** Tranche U development (32/32). **Charter:** given the whole tree today,
draft the CANDIDATE TARGET TREES (library + demo) under the owner edict from first
principles — recursive colocation, encapsulated modules for long dirs, no legacy,
performance-shaped (chunk boundaries, lazy seams) — plus the ordered transposition
sequence (what moves first so everything re-anchors ONCE). This is the synthesis
seed, not the ruling.

**Method:** read all three CLAUDE.md maps, then verified EVERY claim against disk
with `find`/`ls`/`wc`/`grep` and consumer-counted every relocation candidate. All
file:line evidence below is disk-read, never board-trusted.

---

## The load-bearing conclusion

**The LIBRARY tree (`src/animation/`) is already substantially edict-compliant** —
the R.W1 eleven-zone partition + S/T colocation waves landed a clean recursive tree
(deepest path 5 levels: `physics/spring/vector.ts`), each zone barrelled, the
value.js static/dynamic boundary gated. Its residual work is small: a doc-truth
reconciliation and one optional boundary-tier encapsulation.

**The transposition surface is almost entirely the DEMO.** Its single largest
defect is a LEGACY vestige: `demo/@/components/custom/` — the `custom/` layer only
ever existed to distinguish hand-rolls from shadcn's `ui/` primitives, and `ui/`
was deleted at S.C3b. `custom/` now holds only `instrument/` + one leaf, yet it
sits in the middle of the demo's worst path — **8 directory levels deep**
(`demo/@/components/custom/instrument/transport/controls/AnimationControls.vue`,
disk-verified). Dissolving `custom/` is the highest-leverage first move: it removes
a legacy layer AND shortens the deepest path in one re-anchor.

---

## CANDIDATE TARGET TREE — LIBRARY (`src/animation/`)

### BEFORE (disk today — 128 .ts files, 11 zones + leaf tier)

```
src/animation/
├── index.ts · load-engine.ts · public.ts · easing.ts · validate.ts   # 5 LOOSE root files (the boundary tier)
├── constants/{types,defaults,index}.ts
├── physics/{numeric,smooth,oscillator,decay,morph,playback}.ts + spring/{…13…}
├── orchestration/{stagger,flip}.ts + drag/ sequence/ split-text/ timeline/ view-transition/
├── engine/{animation,playback-state,play-lifecycle,interpolate,option-setters,options,
│           compile-bridge,composition}.ts + css/
├── group/{group,lifecycle,soa,compositor,springs,yield-batch,entries,layer-api,types}.ts
├── compile/{parse-flatten,frame-compiler,easing-registry,easing-option,selector,
│            numeric-plan,adapter,entry,view-transition,plain-vars}.ts + backward/{…8…}
├── resolve/{core,spring-css,resolve-if,resolve-function,element-resolve,env}.ts
├── ingest/{cssom,adopt}.ts
├── scroll/{grammar,scene,dispatch,range,trigger}.ts
├── waapi/{eligibility,emission,waapi-options,delegation,densify}.ts
├── presets/{classic,classic-data,spring,taxonomy}.ts
├── svg/{motion-path,draw-svg,morph-svg,morph-geometry,handle}.ts
└── internal/{leaves,binarySearch,animation-id,errors,reduced-motion,scheduler,scroll-phases}.ts
```

### AFTER (candidate — the seed, near-identity + two moves)

```
src/animation/
├── boundary/                      # ← NEW encapsulated module: the static/dynamic SEAM (CANDIDATE, see F2)
│   ├── index.ts                   #   the `.` package barrel (LIGHT + loadAnimationEngine)
│   ├── load-engine.ts             #   the HEAVY dynamic loader
│   ├── public.ts                  #   the ./engine subpath static mirror
│   └── easing.ts                  #   resolveEasing — the one dynamic-import ergonomic
│   # (package.json `exports` + tsconfig re-point to boundary/index.ts, boundary/public.ts)
├── validate.ts                    # STAYS at root — the HEAVY cross-zone compile FACADE (C-9), not a boundary member
├── constants/ physics/ orchestration/ engine/ group/ compile/ resolve/
├── ingest/ scroll/ waapi/ presets/ svg/          # ← UNCHANGED: already edict-clean
└── internal/                      # ← UNCHANGED leaf tier (C-5): every leaf is genuinely ≥2-zone shared
    └── … (scroll-phases.ts CONFIRMED 2-zone: scroll/range.ts + compile/selector.ts — stays)
```

The library "after" is deliberately close to identity — the R.W1/S/T waves already
achieved the edict here. The ONLY structural proposal is the optional `boundary/`
encapsulation of the four package-entry files (F2); everything else is doc-truth
reconciliation (F5). **Do not manufacture churn in a compliant tree.**

---

## CANDIDATE TARGET TREE — DEMO (`demo/`)

### BEFORE (disk today — deepest path 8 levels)

```
demo/
├── glass-ui-gaps.ts               # ← LOOSE at demo root (a cross-cutting consumed ledger)
├── app/{App,main,index.html} + dock/ scene/ transition/ runtime/ public/
├── scenes/{amiga,cube,easing,sequence,spring,square}/     # ← CLEAN (R.W5 fused, self-contained)
└── @/                             # shared library
    ├── components/
    │   ├── custom/                # ← LEGACY shadcn vestige (ui/ deleted S.C3b); holds only:
    │   │   ├── CopyButton.vue
    │   │   └── instrument/{transport/{…controls/…},keyframes/,timeline/,shell/}   # 8-deep worst path
    │   └── skeletons/SceneSkeleton.vue    # ← single member, app-shell-PRIVATE (only App.vue consumes)
    ├── composables/{gestureSelectSuppression,useDoubleTap,useDragScrub,useThrottledReadout}.ts
    ├── state/{…10…}.ts
    ├── styles/{style,layout,design-idioms,brand}.css + font-roles.json
    └── utils/{clipboard,iosTextEntry,kfEngine,toastGuard}.ts
```

### AFTER (candidate — the seed)

```
demo/
├── app/                           # THE shell (unchanged role)
│   ├── App.vue · main.ts · index.html
│   ├── SceneSkeleton.vue          # ← MOVED here: the <Suspense> fallback is shell-PRIVATE (F3)
│   ├── dock/ scene/ transition/ runtime/ public/
├── scenes/{amiga,cube,easing,sequence,spring,square}/     # ← UNCHANGED (already the model)
└── @/
    ├── glass-ui-gaps.ts           # ← MOVED off demo root into the shared tier (F5); cross-@/app ledger
    ├── components/
    │   ├── instrument/            # ← custom/ DISSOLVED (F1): instrument promoted up ONE level
    │   │   ├── transport/         #     (F7: consider flattening transport/controls/ — the redundant inner layer)
    │   │   ├── keyframes/ timeline/ shell/
    │   ├── CopyButton.vue         # ← the one genuinely-shared flat leaf, now a direct components/ child
    │   # (skeletons/ tier DELETED — its sole member was shell-private)
    ├── composables/{gestureSelectSuppression?,useDoubleTap,useDragScrub,useThrottledReadout}.ts   # F6: verify each earns its seat
    ├── state/ styles/ utils/
```

Result: the demo's deepest path drops from **8 → 6** levels
(`@/components/instrument/transport/controls/X.vue`), the last shadcn vestige is
gone (NO-legacy edict satisfied), and every shared-tier member is either ≥2-consumer
justified or relocated to its true single owner.

---

## THE ORDERED TRANSPOSITION SEQUENCE (move-once)

The invariant: an anchor MOVES BEFORE its dependents so every downstream import
re-points exactly ONCE. Path-pinned gates re-anchor in lockstep with each move (not
after — a batch-then-fix would run the tree RED between).

1. **LIBRARY leaf/doc pass FIRST** (smallest, most stable surface). No leaf actually
   moves (scroll-phases is confirmed 2-zone shared — F8 correction); this step is
   the doc-truth reconciliation (F5) + the OPTIONAL `boundary/` encapsulation (F2).
   Do library before demo so the two restructures never contend.
2. **DEMO — dissolve `custom/` (F1) — THE keystone first move.** `custom/instrument/`
   → `components/instrument/`; `custom/CopyButton.vue` → `components/CopyButton.vue`;
   delete the empty `custom/`. This is the HIGHEST-fanout path change — do it before
   any inner instrument restructure, else every deeper move re-points its imports
   TWICE. Re-anchor `proof:colocation`, `proof:scene-colocated`,
   `proof:shared-has-n-consumers`, `proof:demo-no-oversize` path roots in the same
   commit.
3. **Relocate the mislocated singletons** (after the fanout move settles):
   SceneSkeleton → `app/` (F3); `glass-ui-gaps.ts` → `@/` (F5) — re-point its 8 demo
   consumers + 4 gate scripts together.
4. **Optional inner-facility flatten** (F7): collapse `transport/controls/` if the
   layer proves redundant — LAST, since it is contained entirely within instrument/
   and touches no external import.
5. **Reconcile all three CLAUDE.md maps to disk-truth (F5) — final step**, after the
   moves settle, so the map is written once against the final tree.

---

## Findings (file:line evidence, disk-read)

### F1 — MAJOR — `demo/@/components/custom/` is a legacy shadcn vestige creating the 8-deep worst path
`custom/` existed only to separate hand-rolls from shadcn's `ui/` primitives; `ui/`
was deleted at S.C3b (demo/CLAUDE.md:40). On disk `custom/` now holds ONLY
`instrument/` + `CopyButton.vue` (`demo/@/components/custom/` listing), yet it is a
mid-path layer in the deepest demo path, verified 8 levels:
`demo/@/components/custom/instrument/transport/controls/AnimationControls.vue:1`.
**PROPOSAL (gestalt):** dissolve `custom/` entirely — promote `instrument/` and
`CopyButton.vue` to direct `@/components/` children. The `custom` name distinguishes
nothing once `ui/` is gone; keeping it is the exact NO-legacy violation the edict
names. Removes a legacy layer AND shortens the tree in one re-anchor.

### F2 — MAJOR — Five loose boundary-tier files at the library root are an un-encapsulated "long dir" candidate
`src/animation/*.ts` = `index.ts` · `load-engine.ts` · `public.ts` · `easing.ts` ·
`validate.ts` (disk listing). Four of these are ONE cohesive concern — the value.js
static/dynamic SEAM (the two package "in"s + the resolveEasing dynamic-import
ergonomic), documented as such at src/animation/CLAUDE.md:12-72. The edict says long
dirs break into encapsulated modules; the package root is the tree's own "long dir".
**PROPOSAL:** encapsulate the seam as `boundary/{index,load-engine,public,easing}.ts`
and re-point `package.json` `exports` (`.`→`boundary/index.ts`,
`./engine`→`boundary/public.ts`) + tsconfig build entries. Keep `validate.ts` at root
— it is the HEAVY cross-zone compile FACADE (C-9, src/animation/CLAUDE.md:311), not a
boundary member. This is a CANDIDATE for U to rule on, not a mandate — the root files
are few and stable; the win is legibility, weighed against exports-path churn.

### F3 — MAJOR — `@/components/skeletons/SceneSkeleton.vue` is a single-member shared tier that is actually shell-private
Disk shows `skeletons/` holds exactly one file, and its ONLY consumer is
`demo/app/App.vue` (grep: SceneSkeleton consumers = `demo/app/App.vue`). It is the
app-shell `<Suspense>` fallback (the file header, SceneSkeleton.vue:3-7). A shared
tier with one member owned by one consumer is not shared.
**PROPOSAL:** move `SceneSkeleton.vue` into `demo/app/` beside its sole owner (the
shell); delete the `skeletons/` tier. Recursive-colocation: a component's private
skeleton colocates with it.

### F5 — MAJOR — `demo/glass-ui-gaps.ts` is a loose demo-root ledger with no home tier; and the CLAUDE.md maps have drifted from disk
`glass-ui-gaps.ts` sits at `demo/` root (disk listing) but is a genuinely
cross-cutting ledger — consumed by `app/App.vue`, `app/dock/{ChromeDock,MbabbMenu}.vue`,
four `instrument/transport/` files, AND four gate scripts (grep: 8 demo + 4 script
consumers). Separately, the maps omit real files: `compile/plain-vars.ts` is absent
from src/animation/CLAUDE.md's zone map (disk-present, T.A6, plain-vars.ts:1);
`app/scene/sceneFacility.ts` absent from demo/CLAUDE.md (disk-present,
sceneFacility.ts:1); `@/composables/{useDoubleTap,useThrottledReadout}.ts`,
`@/state/storeUtils.ts`, `@/styles/font-roles.json` all disk-present but unmentioned.
**PROPOSAL:** relocate `glass-ui-gaps.ts` into the shared tier (`@/glass-ui-gaps.ts`
or a `@/constellation/` home) since it spans app/ + @/; and reconcile all three
CLAUDE.md maps to disk-truth as the FINAL transposition step. This map-vs-disk drift
is the same "invisible member" defect class `proof:no-flat-siblings` was born to kill
(scripts/proof-no-flat-siblings.mjs:9-16) — now recurring in the docs the gate does
not cover.

### F6 — MINOR — Two `@/composables/` members are single-import; `gestureSelectSuppression` fails the ≥2-consumer bar on its face
Consumer counts (grep): `gestureSelectSuppression` = 1, `useThrottledReadout` = 2,
`useDoubleTap` = 3, `useDragScrub` = 4. The shared-tier bar (`proof:shared-has-n-consumers`)
is ≥2 consuming areas (scripts/proof-colocation.mjs:22). `gestureSelectSuppression`
is a genuine GLOBAL singleton token (`body.is-dragging`, demo/CLAUDE.md:42) — the
edict explicitly permits global infra in `composables/` even at one import — but that
justification must be RECORDED, not assumed.
**PROPOSAL:** U's colocation audit confirms each `@/composables/` member is either
≥2-consumer OR a recorded global singleton; demote any that is a single-owner
satellite into that owner's module (the colocation gate's "colocate" clause,
scripts/proof-colocation.mjs).

### F7 — MINOR — `instrument/transport/controls/` triple-nest is the residual deep layer even after `custom/` drops
After F1, the deepest demo path is still
`@/components/instrument/transport/controls/AnimationControls.vue` (6 levels). The
`transport/` module already sub-folders `components/` + `composables/` + `controls/`;
`controls/` holds the transport's control BODY (AnimationControls +
AnimationControlsControls + Visualizer + panels, disk listing).
**PROPOSAL (candidate):** evaluate whether `transport/` IS the control facility such
that `controls/` is a redundant inner label — if so, hoist `controls/`'s members to
`transport/` root. Contained entirely within instrument/, so it is a safe LAST move.
Do NOT force it if `controls/` is a meaningful sub-facet; depth alone is not a defect
when each layer encapsulates a real module.

### F8 — MINOR (correction, evidence-driven) — `internal/scroll-phases.ts` is CORRECTLY placed; the leaf tier is edict-clean
Initial hypothesis was that `scroll-phases.ts` is scroll/-only and should colocate
INTO `scroll/`. Disk refutes it: consumers are `scroll/range.ts` AND
`compile/selector.ts` (grep) — a genuine 2-zone shared leaf, correctly in the
value.js-free `internal/` leaf tier (C-5, src/animation/CLAUDE.md:176). Recorded so U
does NOT manufacture a wrong move. The `internal/` tier needs no transposition.

---

## What U must charter

- **CHARTER the demo `custom/` dissolution as the keystone first move** — promote
  `instrument/` + `CopyButton.vue` to `@/components/` direct children, delete the
  legacy shadcn `custom/` layer, re-anchor the path-pinned gates in the same commit.
- **RULE on the library `boundary/` encapsulation (F2)** — either adopt the
  `boundary/{index,load-engine,public,easing}.ts` module (re-pointing `package.json`
  exports) or record a terminal keep-at-root, so the loose root tier is a DECISION not
  a default.
- **CHARTER relocation of the mislocated singletons** — SceneSkeleton → `app/`;
  `glass-ui-gaps.ts` → the shared `@/` tier; delete the one-member `skeletons/` tier.
- **CHARTER the CLAUDE.md map ↔ disk reconciliation as a STANDING gate** — the three
  maps drifted (plain-vars, sceneFacility, two composables, storeUtils, font-roles);
  a map-vs-disk gate would make the "invisible member" defect class impossible in docs
  as `no-flat-siblings` made it impossible in `src/`.
- **CHARTER the transposition SEQUENCE, not a batch** — library-first, then the demo
  `custom/` fanout move, then singletons, then optional inner flatten, then docs — each
  anchor before its dependents so imports re-point ONCE and the tree never runs RED.
- **CHARTER the shared-tier consumer audit (F6)** — every `@/composables/`,
  `@/utils/`, `@/styles/` member is ≥2-consumer OR a recorded global singleton;
  single-owner satellites colocate into their owner.
- **NOTE for the CI-trim band (cross-lane):** the restructure invalidates the path
  roots of the structural gate cluster (`proof:colocation`, `scene-colocated`,
  `no-flat-siblings`, `demo-no-oversize`, `style-file-ceiling`, `shared-has-n-consumers`)
  — U's 227→trimmed gate reduction and the transposition must be co-scheduled so gates
  re-anchor with the moves, never lag them.
