# Lane 20 — demo-app-shared-tier

**Fleet:** Tranche U (development-only) · **Lane:** 20/32 · **Slug:** demo-app-shared-tier
**Charter:** the demo root target tree under the grand colocation edict — the `demo/@ → shared/`
rename (F1), the `components/custom/` dissolve (F2), the `app/` shell↔scene boundary honesty, the
`@/composables`+`@/utils` globalness audit, style-tier colocation, and the alias/config change map.
**Discipline:** read-only; evidence is file:line from the live tree (`master`, post-T, 5.2.0).

---

## Headline

The demo's shared tier is mis-drawn by legacy convention, not by dependency truth: the `@/` directory
name is a shadcn vestige whose S.D4 "keep it" ruling rests on a **factually false premise** (no file
imports `@/…`), `components/custom/` is a single-child wrapper around one facility, and the `app/`
shell dir illegitimately **owns two cross-scene contracts** (`app/scene/sceneFacility.ts`,
`app/runtime/*`) that the scene tier depends *upward* into — a dependency inversion the colocation
edict must cut.

---

## Evidence & findings

### F-1 (MAJOR) — the `@/` → `shared/` rename: the S.D4 "keep" ruling rests on a false premise

`demo/CLAUDE.md` (the "ruled terminally" block) justifies keeping the literal `@` directory with:
*"imported everywhere as `@/…` … every consumer already spells the short form … a rename would touch
every import in the tree."* **Every clause is false.** No file imports `@/…`:

- `grep -rn 'from "@/' demo` → **0 hits**. Consumers spell the *sub-aliases* `@components/`,
  `@utils/`, `@composables/`, `@styles/`, `@state/` — never a bare `@/`.
- Those aliases are declared as *dir aliases whose RHS happens to contain `@`*: `vite.config.ts:331-337`
  (`"@styles": …"demo/@/styles"`, `@state`, `@components`, `@utils`, `@composables`) and
  `tsconfig.json:31-41` (`"@styles/*": ["./demo/@/styles/*"]` …). The LHS token (`@components`) is
  independent of the on-disk folder name.

Therefore the rename `demo/@/` → `demo/shared/` touches **zero `.vue`/`.ts` import statements**. Its
entire footprint is:
- `vite.config.ts:331-337` — 5 alias RHS strings (`demo/@/…` → `demo/shared/…`).
- `tsconfig.json:31-41` — 7 path RHS strings (`./demo/@/…` → `./demo/shared/…`).
- ~34 proof-gate scripts that hardcode the literal fs path `demo/@/…` (e.g.
  `scripts/proof-decomposition.mjs:87-89,167`, `scripts/proof-hero-two-focal.mjs:58`,
  `scripts/proof-pp-logo-svg.mjs:141`, `scripts/proof-stage-within-docks.mjs:362`).

`@` is a shadcn-era convention (the same lineage as the now-deleted `components/ui` and `custom/`).
Under U's "NO legacy code" + "self-explaining structure" edict the vestige should die; the S.D4
cost argument is void.

**PROPOSAL (gestalt):** Rename the physical directory `demo/@/` → `demo/shared/`. **Keep the sub-alias
tokens unchanged** (`@components`, `@utils`, `@composables`, `@styles`, `@state`) — they are good short
handles and re-pointing their RHS is a 12-line config edit. The change is a mechanical config+gate-path
sweep with **no source-import churn**, so it is safe and reversible. Fold the ~34 gate fs-path literals
into the same sweep (and see F-8: most of those gates are CI-trim candidates anyway). Excise the
"ruled terminally to keep `@/`" paragraph from `demo/CLAUDE.md`.

---

### F-2 (MAJOR) — `components/custom/` is a single-child legacy wrapper; dissolve it

`demo/@/components/` holds exactly two children: `custom/` and `skeletons/`. `custom/` in turn holds
exactly `instrument/` (the whole control facility) + `CopyButton.vue`. The `custom/` layer was the
shadcn "not-`ui/`" bucket; `ui/` was deleted at S.C3b, leaving `custom/` a **one-facility-plus-one-leaf
wrapper with no sibling** — pure legacy nesting the edict forbids ("long dirs → encapsulated modules"
is the opposite of "vestigial single-child dir").

Footprint of the dissolve:
- 17 import sites spell `@components/custom/…` (`grep -rl 'components/custom/' demo` → 17). They become
  `@components/instrument/…` and `@components/CopyButton.vue`.
- 34 proof scripts reference `components/custom/` as a literal fs path.

**PROPOSAL (gestalt):** Dissolve `custom/`: `components/custom/instrument/` → `components/instrument/`,
`components/custom/CopyButton.vue` → `components/CopyButton.vue`. `@components` alias RHS is unchanged
(still `demo/shared/components`). Verify CopyButton's shared-tier legitimacy is preserved — it is
genuinely cross-tier (consumed by `scenes/easing/EasingTarget.vue`, `scenes/spring/StartingStyleTarget.vue`
**and** four instrument files), so it correctly stays a flat shared leaf beside `instrument/`.

---

### F-3 (CRITICAL) — `app/scene/sceneFacility.ts` is a scene-tier contract mislocated in the shell

`app/` is declared (demo/CLAUDE.md) as *"THE multi-scene SPA shell (NO scene content)"*. Yet
`app/scene/sceneFacility.ts` **defines the `SceneFacility`/`ChannelHandle`/`SceneFacet` contract that
every scene implements** and is imported **upward** by the entire scene tier:

- Consumers (`grep sceneFacility`): `scenes/easing/useEasingDemo.ts`, `scenes/square/SquareScene.vue`,
  `scenes/cube/CubeScene.vue`, `scenes/amiga/AmigaScene.vue`, `scenes/sequence/useSequenceDemo.ts`,
  `scenes/spring/useSpringDemo.ts`, **and** `@components/…/instrument/transport/transportSource.ts`.
- It depends *sideways* into state: `sceneFacility.ts:22-23` `import type { ControlSurface, ScenePlayback }
  from "@state"; import { createGroupAdapter } from "@state"`.
- `@state` in turn only *structurally* mirrors the shape to stay pure:
  `state/controlSurfaceDFA.ts:58-59` — *"reads the live `SceneFacility` STRUCTURALLY … so this pure"* —
  an explicit dependency dodge that exists only because the contract lives in the wrong tier.

Six scenes + the instrument transport + the state DFA all orbit a contract that sits inside the shell.
Scenes importing `@app/scene/sceneFacility` is a **dependency inversion** (leaf → shell).

**PROPOSAL (gestalt / architectural transposition):** Hoist the scene-authoring contract OUT of `app/`
into the shared tier as `shared/scene-facility/` (contract + `facilityFromGroup` factory), consumed by
scenes, the instrument transport, and `@state` alike. `app/` then *depends on* the contract (the shell
binds scenes through it) instead of *owning* it — the dependency arrow flips to shell → contract ← scenes,
and `@state/controlSurfaceDFA.ts` can import the real type instead of duck-typing it. `app/scene/` keeps
only the true shell wiring: `router.ts`, `scenes.ts` (registry), `useSceneMachine*Binding.ts`,
`sceneExposedApi.ts`.

---

### F-4 (MAJOR) — `app/runtime/` is a scene-serving library wearing the shell's dir

`app/runtime/` is described as "cross-scene recipes" — but "cross-scene" is the antithesis of
"shell-private". Consumer map (`grep runtime/<f>`):

| runtime file | consumers | true home |
|---|---|---|
| `useRafScene.ts` | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringDemo.ts` | **shared** |
| `useSceneVisibilityPause.ts` | `scenes/cube`, `scenes/amiga`, `scenes/sequence` | **shared** |
| `useSceneTransport.ts` | `scenes/easing`, `scenes/sequence`, `scenes/spring`, **`instrument/transport/composables/useAnimationGroupPlayback.ts`** | **shared** |
| `rafConstants.ts` | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringHotPath.ts` | **shared** |
| `loaf-observer.ts` | `app/main.ts` only | app-private |
| `useMonacoCancellationGuard.ts` | `app/App.vue` only | app-private |

Four of six `runtime/` files are consumed exclusively by the scene tier (one also by instrument) — they
are the shared cross-scene composable library, buried under the shell dir. Only `loaf-observer` and
`useMonacoCancellationGuard` are genuinely app-private.

**PROPOSAL (gestalt):** Split `runtime/`. The scene-serving recipes (`useRafScene`,
`useSceneVisibilityPause`, `useSceneTransport`, `rafConstants`) move to the shared composables tier
(`shared/composables/scene-runtime/` — an encapsulated module, not four loose files). The two truly
app-lifetime guards (`loaf-observer`, `useMonacoCancellationGuard`) stay in `app/` colocated with their
sole consumers (`main.ts` / `App.vue`) — or fold into an `app/lifecycle/` module. This makes `app/` honest:
it holds shell wiring, not a scene utility belt.

---

### F-5 (MAJOR) — three of four `@/utils` are instrument-only, not global

Consumer audit of `@/utils`:

- `kfEngine.ts` — **truly global**: consumed across scenes, `app/App.vue`, `app/main.ts`,
  `@state/animationOptionsStore.ts`, `app/scene/useSceneMachineShellBinding.ts`, and instrument. Keep in
  the shared root (`shared/kf-engine.ts` — the engine loader is the demo's one universal seam).
- `iosTextEntry.ts` — consumed **only** by `instrument/shell/EditorShell.vue` +
  `instrument/keyframes/CSSCodeEditor.vue` (both inside `instrument/`).
- `toastGuard.ts` — consumed **only** by `instrument/keyframes/components/KeyframesAddDialog.vue` +
  `instrument/timeline/CSSPasteDialog.vue` (both inside `instrument/`).
- `clipboard.ts` — consumed by `components/CopyButton.vue` (shared leaf) +
  `instrument/shell/useShareState.ts` + `instrument/keyframes/KeyframesStringControls.vue`. Borderline;
  its only non-instrument consumer is CopyButton, which is itself a shared leaf.

Two utils (`iosTextEntry`, `toastGuard`) never touch a scene, the app, or state — they are instrument
implementation detail living in the global tier, exactly the colocation the edict forbids.

**PROPOSAL (gestalt):** Colocate `iosTextEntry.ts` and `toastGuard.ts` into
`components/instrument/` as an `instrument/utils/` module (used across ≥2 instrument peers → the
facility's own shared tier, not any single peer). Keep `kfEngine.ts` at the shared root. Keep
`clipboard.ts` in the shared tier paired with `CopyButton.vue` (its shared consumer). Result:
`shared/utils/` shrinks to the genuinely-global `kfEngine` + `clipboard` — the rest is colocated with
the facility that owns it.

---

### F-6 (MINOR) — `@/composables` globalness is honest; one entry is over-hoisted

Consumer audit of `@/composables` (charter's core question — verified all four):

- `useDoubleTap.ts` — `scenes/square`, `scenes/cube`, `scenes/spring` → **genuinely cross-scene, keep global**.
- `useDragScrub.ts` — `scenes/square`, `scenes/sequence` (×2), `scenes/spring` → **keep global**.
- `useThrottledReadout.ts` — `scenes/easing`, `scenes/spring` → **keep global**.
- `gestureSelectSuppression.ts` — consumed by `useDragScrub.ts:6` (the scene-tier drag seam) **and**
  `instrument/transport/composables/useDragCapture.ts` (the control-surface drag seam). Genuinely
  cross-tier (scene ∪ instrument) → **keep global**. (Note: demo/CLAUDE.md's composables list is stale —
  it omits `useDoubleTap` and `useThrottledReadout`, which are present on disk.)

The composables tier is the ONE part of the shared surface that is honestly global. Its consuming CSS
rule (`body.is-dragging *`) lives in `design-idioms.css` (per `gestureSelectSuppression.ts:12-14`), which
is correct (a shared idiom). No move warranted — but the doc must be reconciled.

**PROPOSAL:** Reconcile `demo/CLAUDE.md`'s composables inventory to the 4 real files. No structural
change — this tier passes the edict.

---

### F-7 (MINOR) — `SceneSkeleton` and `font-roles.json` are mislocated singletons

- `components/skeletons/SceneSkeleton.vue` is consumed **only** by `app/App.vue` (the `<Suspense>`
  fallback for the scene host). A single-consumer shell fallback sitting in the shared components tier is
  a colocation miss — it belongs with the scene host that owns it (`app/`).
- `styles/font-roles.json` is consumed **only** by `scripts/proof-colocation.mjs` and
  `scripts/proof-font-census.mjs` — never by any runtime code. It is a gate manifest masquerading as a
  style asset in the shared tier.

**PROPOSAL:** Move `SceneSkeleton.vue` into `app/` colocated with `App.vue` (the scene host is its only
consumer; when the scene-facility contract hoists at F-3, `app/` becomes the clean shell home). Relocate
`font-roles.json` next to its gates under `scripts/` (or retire it with the CI trim, F-8) — it is not a
style.

---

### F-8 (MINOR) — the style tier is largely honest; note only singletons + the gate-path coupling

Contrary to the charter's hypothesis of heavy per-component style leakage, the shared `styles/` tier
(`brand.css` 31L, `design-idioms.css` 299L, `layout.css` 210L, `style.css` 295L — all under the 300L
ceiling) is mostly genuine shared vocabulary: idiom classes are multi-consumer (`.progress-ball` 5 vue
files, `.progress-rail` 5, `.settled-badge`/`.tracking-badge` 3 each, `.stage-field-x` 2), and `layout.css`
is `:root` tokens + `@media`/`@supports`/`@container` geometry — genuinely global. Component-specific CSS
is *already* colocated (`instrument/transport/AnimationControlsGroup.css`,
`components/ControlsPaneWrapper.css`, `controls/playback-button.css`, `controls/tab-trigger.css`) — good
precedent. Only two idiom classes are true singletons (`.progress-dot` 1 file, `.reverse-badge` 1 file).

**PROPOSAL:** Leave the style tier's shared vocabulary intact (moving multi-consumer idioms would break
colocation, not serve it). Optionally colocate the two singleton idiom classes into their sole consumer's
scoped block. The real style-tier action is the fs-path rename (F-1) and dropping `font-roles.json` (F-7).

---

## THE demo root target tree (under the edict)

```
demo/
├── app/                         # THE shell — shell wiring ONLY, no scene/shared content
│   ├── App.vue · main.ts · index.html
│   ├── SceneSkeleton.vue        # ← from components/skeletons/ (App-only Suspense fallback) [F-7]
│   ├── lifecycle/               # loaf-observer.ts · useMonacoCancellationGuard.ts [F-4, app-private]
│   ├── dock/                    # ChromeDock.vue · MbabbMenu.vue (unchanged — genuinely app-private)
│   ├── scene/                   # router.ts · scenes.ts · sceneExposedApi.ts · useSceneMachine*Binding.ts
│   │                            #   (sceneFacility.ts HOISTED OUT → shared/ [F-3])
│   └── transition/              # useSceneSwap.ts · useSceneTransition.ts (App-only — correct)
├── scenes/                      # unchanged (already fully colocated per R.W5 — not this lane's scope)
│   └── <amiga|cube|easing|sequence|spring|square>/
└── shared/                      # ← RENAMED from @/ [F-1]; alias tokens (@components/@utils/…) unchanged
    ├── kf-engine.ts             # the one universal seam (was utils/kfEngine.ts) [F-5]
    ├── scene-facility/          # ← HOISTED from app/scene/ [F-3]: contract + facilityFromGroup
    ├── state/                   # unchanged (@state) — imports the real SceneFacility type now [F-3]
    ├── components/              # ← custom/ DISSOLVED [F-2]
    │   ├── CopyButton.vue       #   genuinely cross-tier shared leaf
    │   └── instrument/          # THE facility (was custom/instrument/)
    │       └── utils/           # iosTextEntry.ts · toastGuard.ts ← from shared/utils [F-5]
    ├── composables/             # gestureSelectSuppression · useDoubleTap · useDragScrub · useThrottledReadout
    │   └── scene-runtime/       # ← useRafScene · useSceneVisibilityPause · useSceneTransport · rafConstants [F-4]
    ├── utils/                   # clipboard.ts only (kfEngine hoisted; ios/toast colocated) [F-5]
    └── styles/                  # brand · design-idioms · layout · style (font-roles.json → scripts/) [F-7,F-8]
```

## Alias / config change map

| target | change | files touched | source-import churn |
|---|---|---|---|
| `@/` dir → `shared/` | RHS `demo/@/…` → `demo/shared/…` | `vite.config.ts:331-337` (5), `tsconfig.json:31-41` (7), ~34 proof scripts | **0 `.vue`/`.ts` imports** |
| dissolve `custom/` | move `instrument/`+`CopyButton.vue` up one level | 17 import sites (`custom/…`→`…`), 34 proof scripts; `@components` RHS unchanged | 17 import edits |
| hoist `sceneFacility` | `app/scene/` → `shared/scene-facility/`; add alias `@scene-facility` (or reuse `@state`-style dir alias) | `vite.config.ts`, `tsconfig.json`, 7 consumers, `controlSurfaceDFA.ts` (drop the structural dodge) | 7 import edits |
| split `runtime/` | scene-recipes → `@composables/scene-runtime`; guards → `@app/lifecycle` | `vite.config.ts`/`tsconfig` unchanged (dir aliases); ~10 consumers | ~10 import edits |
| `kfEngine`/`ios`/`toast`/`clipboard` | `kfEngine`→shared root; `ios`+`toast`→`instrument/utils`; `clipboard`→shared utils | ~20 consumers of kfEngine, 2+2 of ios/toast | ~24 import edits |

**Zero of these changes alter a public library surface** — this is entirely demo-internal restructure.

---

## What U must charter

1. **Rename `demo/@/` → `demo/shared/`** and strike the S.D4 "ruled terminally to keep `@/`" ruling —
   its cost premise (`grep 'from "@/'` → 0) is false; the rename is a config+gate-path sweep with zero
   source-import churn.
2. **Dissolve `components/custom/`** — hoist `instrument/` and `CopyButton.vue` to `components/`; the
   single-child shadcn wrapper is legacy the "NO legacy code" edict forbids.
3. **Hoist the `SceneFacility` contract out of `app/scene/` into `shared/scene-facility/`** — six scenes
   + the instrument transport + the state DFA depend on it; the shell must depend on the contract, not
   own it (kill the `controlSurfaceDFA.ts` structural-duck-type dodge).
4. **Split `app/runtime/`** — move the four scene-consumed recipes to `@composables/scene-runtime/`;
   keep only `loaf-observer` + `useMonacoCancellationGuard` in `app/` (as `app/lifecycle/`). `app/` must
   be the shell, not a scene utility belt.
5. **Colocate the instrument-only utils** — `iosTextEntry` + `toastGuard` into
   `components/instrument/utils/`; hoist `kfEngine` to the shared root; leave `clipboard` with CopyButton.
   `@/utils` must hold only genuinely-global helpers.
6. **Colocate `SceneSkeleton.vue` into `app/`** (App-only fallback) and **relocate `font-roles.json` to
   `scripts/`** (a gate manifest, not a style).
7. **Reconcile `demo/CLAUDE.md`** to the real tree — the composables inventory is stale (omits
   `useDoubleTap`, `useThrottledReadout`) and `app/scene/sceneFacility.ts` is undocumented.
8. **Sequence this against the CI-trim band** — ~34 proof scripts hardcode `demo/@/…` fs paths; do the
   rename and the gate-roster reduction in one coordinated pass so the path sweep and the gate cull don't
   double-touch the same files.
