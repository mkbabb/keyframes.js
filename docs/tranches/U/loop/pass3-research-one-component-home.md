# Pass-3 research — THE ONE COMPONENT HOME (OD-U19, OWNER-ASKS row 7)

**Date:** 2026-07-10 · **Lane:** pass-3 `one-component-home` (a NEW loop item from the
owner's row-7 structure escalation) · **Authority:** OD-U19 (the ONE component home) +
OD-U2 (the `@`-dissolution RECO) + OWNER-ASKS row 7 (verbatim, two IDE screenshots) ·
**Inputs read in full:** the live `demo/` tree (every `.vue` + module), SPEC-B2 §0–§9,
PASS-2 rulings 9–15, the glass-ui post-BH idiom audit, the P5 recut worktree
(`wf_ca7d0632-287-17` — the blessed component-module shape), and audit lanes 20
(demo-app-shared-tier), 24 (design-restructure-system), 32 (target-tree-synthesis).
**Discipline:** READ-ONLY; this report is the ONE deliverable. Plain language; every
term of art glossed at first use.

> **Term glossary (first-use, per PASS ruling 6).**
> **home** = the directory a component's files live in. **component home** = a directory
> whose job is to *hold components*. **scatter** = the same kind of thing living in
> several unrelated homes. **shell** = the SPA machinery (`App.vue` root, the router, the
> scene state-machine bindings, the transition bindings) — orchestration, not a reusable
> component library. **facility** = a multi-module feature component (the instrument =
> transport + keyframes + timeline + shell). **recursive unit** = the one dir shape every
> component module takes, applied at every depth (the owner-blessed `keyframes/` shape).
> **kind-bin** = a dir grouped by *what a file is* (`composables/`, `utils/`,
> `components/`) rather than *what owns it* — the anti-pattern the colocation edict kills.
> **skeleton** = a loading placeholder shown while a lazy chunk fetches. **shadcn vestige**
> = a directory (`@/`, `custom/`) that exists only because the shadcn scaffold created it;
> its reason died when `ui/` was deleted (S.C3b).

---

## 1. The scatter, diagnosed (what the owner is looking at)

The owner's screenshots show demo components living in **four unrelated homes**, and the
deepest one is **6 wrapper dirs before a file**:

| # | Home today | What sits there | Why it is wrong |
|---|---|---|---|
| 1 | `demo/@/components/custom/` | the whole `instrument/` facility + `CopyButton.vue` | `@` is a shadcn alias materialized as a real dir (OD-U2); `custom/` was the "not-`ui/`" bucket and `ui/` was deleted at S.C3b — **two dead wrapper layers stacked** |
| 2 | `demo/@/components/skeletons/` | `SceneSkeleton.vue` (one file) | a "tier" with ONE member in a kind-bin — the exact shape `proof:colocation` forbids (lane 24 §2) |
| 3 | `demo/app/` | `App.vue` (root) + the shell wiring | legitimate SHELL — but it also *illegitimately owns* the dock (below) and cross-scene runtime recipes (lane 20 F-3/F-4) |
| 4 | `demo/app/dock/` | `ChromeDock.vue` · `MbabbMenu.vue` | a **component home nested inside the shell** — the owner: "this needs to be straight up extirpated" |

The worst path, disk-verified:
`demo/@/components/custom/instrument/transport/controls/AnimationControls.vue`
— `@ · components · custom · instrument · transport · controls` = **6 wrapper dirs**, of
which `@` and `custom` carry ZERO meaning. Scenes (`demo/scenes/<name>/`) are NOT part of
this scatter — R.W5 already fused them into self-contained per-scene homes, and the owner
named `keyframes/` (a colocated sub-component dir) as the shape that "seems reasonable."

**The one true rule the four buckets violate** (lane 24 §9.2, ratified here): *a component
lives at the lowest directory that contains all of its consumers.* Cross-scene shared →
the one shared home; single-scene → that scene's dir; shell-private → the shell. The four
ad-hoc buckets collapse into exactly **two principled homes** under this one rule:
`demo/components/` (shared) and `demo/scenes/<name>/` (per-scene). Everything else is
either the shell or non-component infrastructure.

---

## 2. THE ONE COMPONENT HOME — the complete target tree

Under OD-U2 the `@/` shadcn dir **dissolves to `demo/` root** (the glass-ui `src/` shape —
NO `shared/` wrapper; this **supersedes** lane 20/32's earlier `demo/shared/` proposal,
which pre-dated the owner's ruling). The shared component library becomes the direct child
`demo/components/`. That is THE one component home the owner demands.

```
demo/
├── app/                          # ★ THE SHELL — orchestration only, NO component library
│   ├── App.vue                   #   the root SPA component (the ONE component the shell owns)
│   ├── App.skeleton.vue          #   ← SceneSkeleton re-homed: the scene-host <Suspense> plate,
│   │                             #     shell-private (App.vue is its sole consumer). §5.
│   ├── main.ts · index.html
│   ├── lifecycle/                #   loaf-observer.ts · useMonacoCancellationGuard.ts  [lane 20 F-4]
│   ├── scene/                    #   router.ts · scenes.ts · sceneExposedApi.ts
│   │                             #     · useSceneMachineRouterBinding.ts · useSceneMachineShellBinding.ts
│   │                             #     (sceneFacility.ts HOISTED OUT → demo/scene-facility/  [lane 20 F-3])
│   └── transition/               #   useSceneSwap.ts · useSceneTransition.ts
│
├── scenes/                       # per-scene homes (BLESSED, R.W5 — the SECOND principled home)
│   └── <amiga|cube|easing|sequence|spring|square>/
│       # each already colocates <Name>Scene.vue + its Target/facet SFCs + composables + <name>Keys.ts
│       # + the cube's matrix-editor/ & orbital-drag/ sub-modules — the recursive unit, already applied
│
├── components/                   # ★★ THE ONE SHARED COMPONENT HOME (was @/components/custom/
│   │                             #      + @/components/skeletons/ + app/dock/ — three buckets → one)
│   ├── instrument/               #   THE control facility (was custom/instrument/) — recursive unit at every level
│   │   ├── transport/            #     P5-recut: channel-group/ + channel-controls/ sub-modules (SPEC-B2 §4.5)
│   │   ├── keyframes/            #     the Monaco CSS-keyframes editor module (owner: "seems reasonable" — the EXEMPLAR)
│   │   ├── timeline/             #     the draggable keyframe-timeline module
│   │   ├── shell/                #     EditorShell + EditorHeader + EditorStartScreen + SharePopover + HeroAurora
│   │   ├── utils/                #     ← iosTextEntry.ts · toastGuard.ts colocated (instrument-only)  [lane 20 F-5]
│   │   └── index.ts              #     the lazy facility barrel (export type + defineAsyncComponent)
│   ├── dock/                     #   ← RE-HOMED from app/dock/  [OD-U19 "extirpated"]
│   │   ├── ChromeDock.vue · MbabbMenu.vue · index.ts
│   └── copy-button/              #   ← CopyButton.vue, the one genuinely cross-tier leaf, as its own module
│       └── CopyButton.vue · index.ts        (or stay a flat components/CopyButton.vue leaf — §4)
│
├── scene-facility/               # ← the scene-authoring contract HOISTED out of app/scene/  [lane 20 F-3]
│                                 #     (contract + facilityFromGroup) — consumed by scenes ∪ instrument ∪ state
├── composables/                  # cross-scene composables (was @/composables/)
│   └── scene-runtime/            #   ← useRafScene · useSceneVisibilityPause · useSceneTransport · rafConstants  [lane 20 F-4]
├── state/                        # the global state layer (was @/state/) — imports the real SceneFacility type now
├── styles/                       # brand · design-idioms · layout · style (was @/styles/; font-roles.json → scripts/)
└── utils/                        # kfEngine.ts · clipboard.ts only (ios/toast → instrument/utils/)  [lane 20 F-5]
   # (demo/glass-ui-gaps.ts DELETES — OD-U20, sibling lane)
```

**The two homes, and why that is still "ONE home" in the owner's sense.** The owner's
complaint is *scatter of the same kind of thing across unrelated buckets*. After the
restructure there is exactly ONE rule and exactly TWO destinations it produces: a component
shared across scenes lands in `demo/components/`; a component owned by one scene lands in
that scene's dir. There is no third bucket, no `@`, no `custom`, no dock-in-the-shell. That
is the honest reading of "one home": one *rule*, not one *directory* — because a per-scene
Target genuinely belongs with its scene, and the owner blessed exactly that (`keyframes/`,
the fused scenes). The scatter dies; the principled colocation stays.

---

## 3. The recursive unit — the `keyframes/`-style dir (owner-blessed)

The owner named `keyframes/` as the reasonable shape. It IS the ratified recursive unit —
lane 24 §9.1, and the glass-ui post-BH idiom (`custom/easing/`, `custom/dock/`). Every
component module, at every depth, takes this shape:

```
<component-name>/                 # kebab-case dir = one component module
├── <ComponentName>.vue           # the entry SFC (PascalCase; the ratified lexicon — lane 24 §8)
├── <ComponentName>.css           # scoped style sibling, <style scoped src="./X.css">, MANDATORY once > ~40L
├── <ComponentName>.skeleton.vue  # loading plate — MANDATORY iff the module is delivered lazily (§5)
├── <sub-component>/              # each private child that itself owns satellites → RECURSIVELY this shape
├── <SubLeaf>.vue                 # a satellite-less private child stays flat
├── use<Concern>.ts               # SINGLE-owner composable sits FLAT beside its owner (no composables/ bin)
├── composables/                  # ONLY for ≥2-consumer hooks shared inside this module
├── constants.ts · types.ts       # typed constants / DECLARED contracts (never ReturnType-derived; never in the barrel)
└── index.ts                      # RE-EXPORT ONLY — zero definitions; lazy when heavy, plain otherwise
```

`keyframes/` today already instantiates it (SFCs at root, `index.ts` lazy barrel,
`components/` for private children, `composables/` for the hooks, `utils/` for
`contenteditable`/`parseAnimationCSS`). It is the reference; every module in
`components/instrument/` and every kind-bin (lane 24 §5 — `transport/composables/` 21 files,
the timeline nesting inversion) recuts to it under the **ownership placement rule** (§9.2):
a single-owner satellite sits beside its owner; a bin survives ONLY at facility/shared level
with ≥2 real consumers. That internal recut is lane 24's charter (U.B drive); THIS lane
fixes the HOME — where `instrument/`, `dock/`, `copy-button/` live — not the per-file
interior.

---

## 4. `copy-button` and the leaf question

`CopyButton.vue` is genuinely cross-tier (consumed by `scenes/easing/EasingTarget.vue`,
`scenes/spring/StartingStyleTarget.vue`, and four instrument files — lane 20 F-2). It is a
legitimate shared-home member. Two honest forms:

- **(a) module:** `components/copy-button/{CopyButton.vue, index.ts}` — uniform with the
  recursive unit, symmetrical with glass-ui's per-component dirs.
- **(b) flat leaf:** `components/CopyButton.vue` — a satellite-less shared leaf may stay
  flat (the recursive unit's own flat-leaf clause, lane 24 §9.1).

**Verdict: (b) flat leaf.** A one-SFC component with no CSS split, no skeleton, no
sub-components, and no composables is exactly the "absurdly small module" OD-U16 forbids
wrapping in ceremony (the same logic that INLINEd `matrix-editor/index.ts` at SPEC-B2 §3).
It becomes a direct `components/CopyButton.vue` child, beside `instrument/` and `dock/`.
Its runtime-object `defineProps` (the tree's only such site — lane 24 §3) converts to the
house reactive-destructure grammar during the move.

---

## 5. Skeletons — colocated per module (T.F8 / U.B)

The owner mandates "skeletons colocated per module." The rule (lane 24 §2/§9): a skeleton
is a MEMBER of the lazy module it stands in for, wired by that module's own barrel
(`defineAsyncComponent({ loader, loadingComponent, delay })`), so the placeholder ships in
the eager barrel chunk while the payload stays split. Three applications:

1. **`SceneSkeleton.vue`** (today the lone member of the forbidden `@/components/skeletons/`
   kind-bin) is the app-shell's `<Suspense>` fallback for the scene host — App.vue is its
   ONE consumer (lane 20 F-7, lane 24 §2, lane 32 F3 all concur). It re-homes into the SHELL
   beside `App.vue` as **`app/App.skeleton.vue`** (the scene-host plate is shell
   infrastructure — the shell owns the `<Suspense>`). The kind-bin `skeletons/` DELETES.
2. **`instrument/keyframes/` and `instrument/timeline/`** are lazy (Monaco/highlight.js
   chunks) but ship NO placeholder — the pane renders blank during the fetch (lane 24 §2,
   `AnimationControls.vue:252–253`). Each gains a `<Name>.skeleton.vue` wired by its own
   barrel. (U.B build work; charter it here.)
3. **The per-scene generalization** (lane 24 §2 aspiration): each lazily-delivered scene
   ultimately owns its own `<Scene>.skeleton.vue`, dissolving even the shared plate. Recorded
   as the U.B target; the shared `App.skeleton.vue` is the interim single-plate.

**On "app/ = ZERO components."** Read literally this is impossible — `App.vue` is a
component (the root) and a shell needs a loading plate. The honest reading, stated for the
agglomerator: app/ holds **no shared/cross-cutting component LIBRARY** — the scatter the
owner named (the dock masquerading as shell chrome) leaves; only the root shell and its
private scene-loading plate remain, and both are shell infrastructure, not reusable
components. `proof:app-is-shell` grows a born-RED clause to enforce exactly this (§7).

---

## 6. The wrapper-collapse map (which path segments die)

| segment | fate | authority | levels saved |
|---|---|---|---|
| `@/` | **DIES** — dissolve, hoist children to `demo/` root | OD-U2 | 1 |
| `components/custom/` → `components/` | **`custom/` DIES** — shadcn "not-ui/" bucket, `ui/` gone at S.C3b | lane 20 F-2, lane 32 F1 | 1 |
| `components/skeletons/` | **DIES** — per-module skeleton (§5); `SceneSkeleton`→`app/` | lane 24 §2 | (kind-bin removed) |
| `app/dock/` (as a component home) | **DIES** — dock → `components/dock/` | OD-U19 "extirpated" | (bucket removed) |
| `app/scene/sceneFacility.ts` (in the shell) | **HOISTS** → `demo/scene-facility/` | lane 20 F-3 | — |
| `app/runtime/` (as a scene library) | **SPLITS** — recipes → `composables/scene-runtime/`; guards → `app/lifecycle/` | lane 20 F-4 | — |
| `instrument/` · `transport/` · `keyframes/` · `timeline/` · `shell/` | **SURVIVE** — each a real cohesive module | R.W5 / SPEC-B2 | — |
| `transport/controls/` | **CANDIDATE flatten** — if `controls/` is a redundant inner label under `transport/`, hoist its members (AnimationVisualizer, PlaybackRibbon) to their owners; else keep. Defer to the ownership rule. | lane 32 F7, lane 24 §5 | 0–1 |

**Worst path, before → after:**

```
BEFORE (6 wrapper dirs):  demo/@/components/custom/instrument/transport/controls/AnimationControls.vue
AFTER  (3–4 wrapper dirs): demo/components/instrument/transport/[controls/]AnimationControls.vue
```

The owner's "5 levels before content" collapses to 3 (4 if `controls/` proves a real
sub-facet). Two dead layers (`@`, `custom`) and one nested component-home (`app/dock/`)
are gone; every surviving segment encapsulates a real module.

---

## 7. The alias / config / gate re-anchor list

**Config (2 files, ZERO source-import churn for the `@`→root RHS swap — the alias TOKENS
are unchanged; only their RHS moves; lane 20 F-1):**

| plane | file | change |
|---|---|---|
| Vite | `vite.config.ts:331–338` | 5 alias RHS `demo/@/{styles,state,components,utils,composables}` → `demo/{…}`; `@app` unchanged (`demo/app`); optional new `@scene-facility` → `demo/scene-facility` |
| Type | `tsconfig.json:31–43` | 7 path RHS `./demo/@/{…}` → `./demo/{…}` |

**Source imports (the move-driven edits):**

- **18 sites** spell `components/custom/…` → drop `custom/` (`@components/custom/instrument/…`
  → `@components/instrument/…`; `@components/custom/CopyButton.vue` → `@components/CopyButton.vue`).
- **1 site** (`app/App.vue:140`) `@components/skeletons/SceneSkeleton.vue` → `./App.skeleton.vue`.
- **App.vue dock imports** (`./dock/ChromeDock.vue`, `./dock/MbabbMenu.vue`) →
  `@components/dock` (dock re-homed). MbabbMenu↔ChromeDock internal import stays intra-module.
- **~10 sites** re-point per lane 20 F-3/F-4/F-5 (sceneFacility hoist, runtime split,
  ios/toast colocate) — lane-20-owned, co-scheduled.

**Gate scripts (path-literal re-anchors — must ride the SAME commit as each move, G10):**

- **38** scripts hardcode `demo/@/` → `demo/`.
- **35** scripts hardcode `components/custom` → `components/`.
- Dock-path gates (`proof-dock-grammar`, `proof-dock-rest-crisp`, `proof-app-is-shell`,
  `proof-pp-logo-svg`, `proof-decomposition`, `proof-scene-control-dfa`) re-anchor
  `app/dock` → `components/dock`.
- Structural cluster (`proof:colocation`, `proof:scene-colocated`,
  `proof:shared-has-n-consumers`, `proof:demo-no-oversize`, `proof:style-file-ceiling`)
  — path roots re-anchor `demo/@` → `demo/`; co-schedule with the CI-trim band (lane 32
  cross-lane note) so gates never lag the moves.
- **`proof:app-is-shell`** gains a **born-RED clause**: no component module (`.vue` other
  than `App.vue` + `App.skeleton.vue`) may live under `demo/app/`. It reds on today's tree
  (the dock), greens when the dock re-homes — the enforcement arm of OD-U19's "extirpated."
- **`proof:colocation`** gains lane 24 §10's clauses (single-owner-member-in-a-bin → RED;
  barrel-purity; lazy-barrel-without-skeleton → RED) so the recursive unit is a STANDING
  gate, not a one-time move.

**Zero of these changes alter a published library surface** — the whole restructure is
demo-internal.

---

## 8. Sequencing (move-once; lane 32's ordered transposition, adopted)

1. **Dissolve `@/` → `demo/` root** (OD-U2) + **dissolve `custom/`** (the keystone
   highest-fanout move) in one coordinated commit; re-anchor the 38+35 gate literals and
   the config RHS in the same commit (else deeper moves re-point imports twice).
2. **Re-home the dock** `app/dock/` → `components/dock/`; born-RED `proof:app-is-shell`
   clause flips green.
3. **Re-home the singletons:** `SceneSkeleton` → `app/App.skeleton.vue` (delete
   `skeletons/`); `sceneFacility` → `demo/scene-facility/`; split `app/runtime/`.
4. **Interior recut** (lane 24 §9.4): the instrument kind-bins → ownership shape; the
   keyframes/timeline skeletons; the `transport/controls/` flatten candidate — LAST, all
   intra-facility.
5. **`demo/CLAUDE.md` DELETES** (OD-U15/P3) — the demo-tree map re-homes to `DESIGN.md`;
   no map survives to drift against this tree.

---

## Verdicts for SPEC-B3

1. **RATIFY `demo/components/` as THE ONE shared component home.** It absorbs three of the
   four scattered buckets — `@/components/custom/instrument/` (as `components/instrument/`),
   `@/components/skeletons/` (dissolved, §5), and `app/dock/` (as `components/dock/`). The
   `@/` and `custom/` wrapper segments DIE (OD-U2; lane 20 F-2). No `shared/` wrapper — the
   glass-ui `src/` root shape (this SUPERSEDES lane 20/32's earlier `demo/shared/` proposal).

2. **STATE the one placement rule (lane 24 §9.2) as the law that ends the scatter:** a
   component lives at the lowest dir containing all its consumers → cross-scene ⇒
   `demo/components/`; single-scene ⇒ that scene's dir (`demo/scenes/<name>/`, R.W5-blessed);
   shell-private ⇒ `demo/app/`. Two principled homes, one rule — no third bucket.

3. **EXTIRPATE `app/dock/` — dock re-homes to `components/dock/`** (`ChromeDock.vue` +
   `MbabbMenu.vue` + `index.ts`). App.vue imports it via `@components/dock`. This is a
   COMPONENT module, not shell wiring (OD-U19 verbatim).

4. **RATIFY the recursive unit = the `keyframes/`-style dir** (lane 24 §9.1 shape + §9.2
   placement + §9.3 API grammar), the owner-blessed exemplar. Every module under
   `components/instrument/` and every scene sub-module recuts to it; kind-bins survive ONLY
   at facility/shared level with ≥2 real consumers.

5. **REDUCE `app/` to the shell** — `App.vue` (root) + `App.skeleton.vue` (the scene-host
   plate, §5) + `main.ts`/`index.html` + `scene/` (router, scenes registry, machine
   bindings, sceneExposedApi) + `transition/` + `lifecycle/` (loaf-observer,
   Monaco-cancellation guard). NO shared component library, NO cross-scene recipe library.
   `sceneFacility` HOISTS to `demo/scene-facility/`; `runtime/` recipes SPLIT to
   `composables/scene-runtime/` (lane 20 F-3/F-4). Read "ZERO components" as "zero
   shared/cross-cutting component library" — the root shell + its private loading plate are
   infrastructure, not the scatter.

6. **COLOCATE skeletons per module** (T.F8/U.B): `SceneSkeleton.vue` → `app/App.skeleton.vue`
   (delete the `skeletons/` kind-bin); `instrument/keyframes/` and `instrument/timeline/`
   each gain a `<Name>.skeleton.vue` wired by their own lazy barrel; the per-scene
   generalization is the U.B target.

7. **CopyButton stays a FLAT shared leaf** `demo/components/CopyButton.vue` (OD-U16: no
   ceremony dir around a satellite-less one-SFC leaf); its runtime-object `defineProps`
   converts to the house grammar in the move.

8. **CANDIDATE-flatten `transport/controls/`** (lane 32 F7) — evaluate at interior-recut
   time (step 4): hoist its members to their owners if `controls/` is a redundant label,
   else keep. Depth alone is not a defect when each layer is a real module.

9. **RE-ANCHOR in lockstep** (§7): config RHS (2 files) + 18 `custom/` import sites + 1
   skeleton import + dock imports + 38 `demo/@/` gate literals + 35 `components/custom` gate
   literals, each in the SAME commit as its move (G10). Add the born-RED
   `proof:app-is-shell` clause (no component `.vue` besides `App.vue`/`App.skeleton.vue`
   under `app/`) and lane 24 §10's `proof:colocation` clauses so the home is gate-enforced.

10. **SEQUENCE move-once** (§8): dissolve `@/`+`custom/` (keystone) → re-home dock →
    re-home singletons (skeleton/sceneFacility/runtime) → interior recut →
    `demo/CLAUDE.md` deletes last. Co-schedule with the CI-trim band so gates re-anchor with
    the moves, never lag them.

11. **CROSS-REFERENCE the sibling row-7 lanes:** `demo/glass-ui-gaps.ts` DELETES (OD-U20);
    the demo↔library duplication census (OD-U21) runs beside this — neither is this lane's
    scope, but both share the same commit window as the `@/`-dissolution sweep.
