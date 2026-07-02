# Lane a24 — demo/@ shared-library partition

**Tranche R deep audit (pass 1 / audit32) · design lane**
Auditor: subagent (opus-4.8) · Date: 2026-07-02 · Branch: `tranche-s-dev` (read-only)
Scope: `demo/@/**` — inventory, importer census, per-module SHARED/SCENE-PRIVATE/APP-PRIVATE/DEAD verdict, proposed end-state tree.
Evidence range for R: `a15cd48..18e8617` (read-only `git show`/`git diff`/`git log`).

---

## Executive summary

**The demo/@ shared library was never actually partitioned by Tranche R.** R.W5 fused the
*scenes* (three scattered roots → `demo/scenes/<name>/`) and R.W6 fixed component-*boundary* debt
inside `animation-controls/` (callbacks-as-props → emits, typed `SceneExposedApi`). But the
question this lane asks — *does each `demo/@` module belong in `@`?* — was explicitly ruled
**out of scope** by R's own gestalt audit, which declared `animation-controls/` "the model —
keep it verbatim, do not touch" (`docs/tranches/R/audit/gestalt-demo.md:250,337`) and cited
`orbital-drag`/`matrix-editor` as exemplary shared sub-modules (`gestalt-demo.md:31`) **without
running an importer census on them**. That census is the core deliverable here, and it shows the
`@` partition is dirty.

Hard numbers (verified this session):

- `demo/@` = **~140 files / 18,252 lines** across `components/custom`, `components/ui`,
  `composables`, `styles`, `utils`.
- `animation-controls/` alone = **74 files / 10,093 lines = 55% of the entire shared library.**
  R's audit measured it at 70 files / 9,964 lines (`demo-anim-controls.md:14`); it *grew* during R
  impl and was never structurally touched.
- **Four "shared" modules are actually single-area-private** and misfiled in `@`:
  `dock/` (APP-private, 350L), `matrix-editor/` (CUBE-private, 455L), `orbital-drag/`
  (CUBE-private, 1,175L), `asset-manager/` (PLAYGROUND-private, 1,096L) — **3,076 lines / 20
  files, ~17% of `@`, that do not belong in a *shared* library.**
- The single most-shared surface in the whole demo — the **`stores/` state layer** (scene machine
  + option stores + hash-sharing; 22 external references from app + all scenes + playground) — is
  **buried inside a UI-component directory** (`animation-controls/stores/`). Altitude inversion.
- `ui/menubar/` (16 files) has **exactly one consumer** (`KeyframesEditor.vue`), and its sole
  utility dependency `utils/utils.ts` (`cn()`) is menubar-private (11 refs, all menubar). A full
  shadcn menubar for one call-site.
- `demo/CLAUDE.md`, refreshed by R.W8 (`5a5f7db` "post-fusion refresh"), **still lists three
  files that do not exist**: `Animated.vue`, `ResponsiveSelect.vue` (both deleted by R.W5 Band A),
  and `AnimationMenuBar.vue` (never existed).

Verdict: R did the *scene* half of the demo-cohesion job honestly and well (dead code excised, no
orphans remain — see §7). It left the *shared-library* half undone and, worse, sanctioned the
monolith by fiat. Tranche S inherits an unpartitioned `@` whose largest tenant is a 10k-line
component directory concealing the app's global state layer, plus four mis-homed modules and a
grab-bag of single-consumer "singles."

---

## Full inventory (demo/@)

Top-level shape (`find demo/@ -type d`):

```
demo/@/
├── components/
│   ├── custom/
│   │   ├── animation-controls/   74 files / 10,093 L   ← 55% of @
│   │   ├── asset-manager/          7 files /  1,096 L
│   │   ├── dock/                   1 file  /    350 L   (ChromeDock.vue)
│   │   ├── editor-shell/           7 files /  1,037 L
│   │   ├── matrix-editor/          4 files /    455 L
│   │   ├── orbital-drag/           8 files /  1,175 L
│   │   └── <11 flat "singles">             ~1,749 L
│   └── ui/menubar/                16 files /   ~586 L   (shadcn-vue)
├── composables/                    3 files /    216 L
├── styles/                         3 files /  1,548 L   (design-idioms 874, style 636, brand 38)
└── utils/                          5 files /    119 L
```

Flat singles (`demo/@/components/custom/*.vue`, `*.ts`): AnimatedText (104), CSSPasteDialog (80),
CopyButton (119), DemoControlPoint (328), EasingCurveCanvas (499), EasingEditor (108),
EasingSelect (136), EditableLabel (49), KeyboardShortcutsModal (69), KfPillTabs (128),
TypingDots (130).

---

## Importer census (external consumers only; own-dir refs excluded)

| Module | ext. importers | consumer areas | verdict |
|---|---|---|---|
| `animation-controls/` (whole) | 30 files | scenes(16) · app(11) · playground(1) · @-internal | **SHARED — but monolithic; sub-zone** |
|  ↳ `animation-controls/stores/` | 22 refs | scenes(12) · app(10) · playground(1) | **SHARED core — hoist out of anim-controls** |
| `editor-shell/` | app/App.vue, playground/App.vue | 2 apps | **SHARED-BY-2 (keep)** |
| `dock/ChromeDock.vue` | app/App.vue | app **only** | **APP-PRIVATE → demo/app/** |
| `matrix-editor/` | scenes/cube, orbital-drag | cube (+ cube-only sibling) | **CUBE-PRIVATE → scenes/cube/** |
| `orbital-drag/` | cube/CubeTarget, cube/useCubeRelit, app/cubeTransformStore, matrix-editor | all cube | **CUBE-PRIVATE → scenes/cube/** |
| `asset-manager/` | playground/App.vue, stores/index.ts(reset), storeUtils.ts | playground (+ reset hook) | **PLAYGROUND-PRIVATE → demo/playground/** |
| `ui/menubar/` | KeyframesEditor.vue | anim-controls **only** | **ANIM-CONTROLS-PRIVATE (or replace)** |
| `composables/useDragScrub` | 5 scenes | square, motion-path, sequence×2, spring | **SHARED (keep)** |
| `composables/gestureSelectSuppression` | 3 | spring scene, DemoControlPoint, useDragCapture | **SHARED (keep)** |
| `composables/useTypedTrigger` | sequence/SequenceTarget | sequence **only** | **SCENE-PRIVATE → scenes/sequence/** |
| `utils/kfEngine` | 21 files | scenes+app+playground+@ | **SHARED core (keep)** |
| `utils/{clipboard,iosTextEntry,toastGuard}` | 2–3 each | cross-cut | **SHARED (keep)** |
| `utils/utils.ts` (`cn`) | 11 files | all `ui/menubar` | **menubar-private (travels w/ menubar)** |
| `styles/*` | app + scenes + @ broadly | global | **SHARED (keep)** |

Flat-singles census:

| Single | external consumers | verdict |
|---|---|---|
| `CopyButton` | motion-path, spring targets, EasingEditor, KeyframesEditor, KeyframeCard (5) | **SHARED (keep)** |
| `KfPillTabs` | spring/SpringSidebar, AnimationControls (2) | **SHARED (keep)** |
| `EasingEditor` | easing/EasingSidebar, anim-controls/TimingFunctionPanel (2) | **SHARED — easing-editor cluster** |
| `EasingSelect` | EasingEditor, AnimationControlsControls (2) | **SHARED — easing-editor cluster** |
| `EasingCurveCanvas` | EasingEditor **only** (1) | **easing-editor cluster** |
| `DemoControlPoint` | easing/EasingHeroStage, EasingCurveCanvas (2) | **SHARED — easing-editor cluster** |
| `AnimatedText` | editor-shell/EditorStartScreen **only** | **EDITOR-SHELL-PRIVATE** |
| `TypingDots` | editor-shell/EditorStartScreen **only** | **EDITOR-SHELL-PRIVATE** |
| `KeyboardShortcutsModal` | editor-shell/EditorShell **only** | **EDITOR-SHELL-PRIVATE** |
| `CSSPasteDialog` | anim-controls/timeline/KeyframeTimeline **only** | **ANIM-CONTROLS-PRIVATE** |
| `EditableLabel` | asset-manager/AssetLayer **only** | **ASSET-MANAGER-PRIVATE (→ playground)** |

No **DEAD (0-importer)** files exist in `demo/@` — R.W5 Band A already excised the dead surfaces
(SceneSwitcherCarousel, useScrollSnapScene, Animated, ResponsiveSelect). Credit where due (§7).

---

## Findings

### F1 — [HIGH] `animation-controls/` is a 10k-line monolith R sanctioned by fiat, never partitioned

`animation-controls/` is 74 files / 10,093 lines — **55% of the shared library** by volume, 15
sub-directories deep (`animation-controls/timeline/composables/`,
`animation-controls/controls/composables/`). R's gestalt audit examined it and concluded:
"keep the `animation-controls/` directory shape verbatim; fix only its component-boundary debt…
The subtree is the *model* for the scene-fusion gestalt, not a target for de-nesting"
(`docs/tranches/R/audit/gestalt-demo.md:250`), reinforced by the "do not touch" list at
`gestalt-demo.md:337`. R.W5 §1 then wrote it into the wave charter: "The shared control surface
(`animation-controls/`) is NOT touched — it is the model decomposition"
(`docs/tranches/R/waves/R.W5.md` §1).

This is a Q-close-shaped move: the single largest unit is declared off-limits by asserting it is
*already* the exemplar. But "well sub-directoried" ≠ "correctly scoped." The subtree conflates at
least **five distinct concerns** that are consumed by disjoint audiences:

1. `stores/` — the demo's **global state layer** (see F2), consumed by app + every scene + playground.
2. `controls/` + root shells (`AnimationControlsGroup`, `TransportDock`, `ControlsPaneWrapper`,
   `RibbonBar`, `DemoGlobalChrome`) — the **transport/chrome**, consumed by app and 2 scenes
   (cube, sequence).
3. `keyframes/` — the **Monaco CSS editor** (highlight.js + monaco + monaco-themes), lazy-loaded.
4. `timeline/` — the **draggable keyframe timeline** (html2canvas).
5. `animationDescriptions.ts`, `injectionKeys.ts` — leaf metadata.

**Proposal (S):** stop treating `animation-controls/` as an atom. Sub-zone it into cohesive
peers under `@` (mirroring the R.W1 library-zone method one level down): hoist `stores/` out
entirely (F2); promote `keyframes/` and `timeline/` to `@/components/custom/{keyframes-editor,
keyframe-timeline}/`; keep the transport shells as `@/components/custom/animation-transport/`.
The 500-line-near-misses R's own audit flagged (`ControlsPaneWrapper 497`, `AnimationControlsGroup
477`, `TransportDock 461`, `AnimationControls 452` — `demo-anim-controls.md:16-22`) are the
seams. This is the biggest structural item S inherits.

### F2 — [HIGH] The global state layer (`stores/`) is buried inside a UI-component directory — altitude inversion

`animation-controls/stores/` (9 files, ~1,300 L) contains the **scene state machine**
(`sceneMachine.ts`, `useSceneMachine.ts`, `scenePlaybackAdapters.ts`), the **option stores**
(`animationOptionsStore.ts`, `controlOptionsStore.ts`), the **control-surface DFA**
(`controlSurfaceDFA.ts`), and **URL-hash sharing** (`hashSharing.ts`). Its barrel
(`stores/index.ts`) exports the scene machine, the DFA, `resetAllStores`, and the persist keys.

This is the **single most externally-consumed surface in the demo**: 22 references —
`grep @components/custom/animation-controls/stores`: scenes(12) + app(10) + playground(1). Yet it
lives four levels deep inside a *component* named "animation-controls." Two smells prove the
mislocation:

- `stores/index.ts` reaches sideways into a *different* custom module to wire the global reset:
  `import { _resetAssetManagerStore } from "@components/custom/asset-manager/useAssetManager"`
  (`stores/index.ts`, the `resetAllStores` block). A UI component's store barrel owning
  cross-module reset is a state-layer responsibility, not a control-surface one.
- `app/router.ts`, `app/useSceneMachineApp.ts`, `app/useSceneMachineRouter.ts` — the app shell's
  routing/machine reconcilers — all import the scene machine *through the animation-controls
  component path*. The app depends on a component's internals for its own navigation state.

**Proposal (S):** hoist to `demo/@/state/` (or `demo/@/stores/`) as a first-class peer of
`components/`, `composables/`, `styles/`, `utils/`. The scene machine + DFA + option stores +
hash-sharing are the demo's model; they should not be reachable only via a UI barrel. This also
unblocks F1 (once `stores/` leaves, `animation-controls/` is 65 files of genuinely UI code).

### F3 — [HIGH] Four "shared" modules are single-area-private and misfiled in `@`

R's audit blessed the `@` modules on *directory shape* without an importer census
(`gestalt-demo.md:31` explicitly names `orbital-drag`/`matrix-editor` as "real directory
sub-modules used well"). The census this lane ran shows four modules have exactly one consuming
area and do not meet the bar for a *shared* library:

- **`dock/ChromeDock.vue`** (350 L) — imported by `demo/app/App.vue` **only**
  (`grep -rln custom/dock demo` → single hit). **APP-PRIVATE → `demo/app/`.**
- **`matrix-editor/`** (4 files, 455 L) — imported by `scenes/cube/CubeScene.vue` and by
  `orbital-drag/` (which is itself cube-only). **CUBE-PRIVATE → `scenes/cube/`.**
- **`orbital-drag/`** (8 files, 1,175 L) — imported by `scenes/cube/CubeTarget.vue`,
  `scenes/cube/useCubeRelit.ts`, `app/cubeTransformStore.ts` (the "shared cube matrix state" —
  cube-only despite living in app/), and `matrix-editor/useTransformState.ts`. **Every consumer
  is the cube scene. CUBE-PRIVATE → `scenes/cube/`.** Note it is a general-purpose quaternion 3D
  drag primitive; if a future scene (amiga's three.js sphere) adopts it, promote back — but today
  it is cube-private and `gestalt-demo.md` mis-classified it as shared.
- **`asset-manager/`** (7 files, 1,096 L) — imported by `demo/playground/App.vue`; the only other
  references are the global-reset hook in `stores/index.ts` + `storeUtils.ts`.
  **PLAYGROUND-PRIVATE → `demo/playground/`.**

Corollary: `orbital-drag/OrbitalDrag.vue` ↔ `matrix-editor/useTransformState.ts` are **mutually
coupled** (`OrbitalDrag.vue:103` comments the matrix-editor Reset contract;
`useTransformState.ts:6` `import type { TransformState } from "@components/custom/orbital-drag"`).
Two "shared" modules that only talk to each other and to one scene are one cube-scene concern
split across two `@` directories. Fusing both into `scenes/cube/` removes ~1,630 L / 12 files from
`@` and eliminates the cross-import.

**Total relocation: 3,076 L / 20 files (~17% of `@`) that are not shared.**

### F4 — [MED] `useTypedTrigger` was authored into shared `@/composables` with a single consumer; R.W5's "kills a triplication" claim is false for it

R.W5 §1 lists four Band-B extractions and asserts "each kills a triplication AND shrinks multiple
files" (`R.W5.md:29`). For `useTypedTrigger` this is untrue. R.W5 B.4's own evidence cites a
**single site**: `demo/sequence/SequenceTarget.vue:248-263` (`R.W5.md:186-188`), and the file is
placed in shared `@/composables` not because it is reused but "because gestalt-demo §2 target tree
explicitly names it there" (`R.W5.md:203-205`) — placement by fiat, not by demand. Verified: the
only importer today is `demo/scenes/sequence/SequenceTarget.vue` (`grep -rln useTypedTrigger`).

**SCENE-PRIVATE (sequence) → `demo/scenes/sequence/`.** A one-consumer extraction belongs beside
its consumer; promoting it to `@` inflates the shared surface with sequence-specific logic. (The
sibling extractions `useContractAnimGroup`/`useSceneTransport`/`rafConstants` correctly landed in
`app/`, and `useDragScrub` is genuinely 5-scene shared — so this is the one that went to the wrong
home.)

### F5 — [MED] The flat "singles" bucket is a grab-bag; five are single-consumer and should co-locate

`components/custom/*.{vue,ts}` (11 files) mixes genuinely-shared widgets with single-consumer
components that were never re-homed after their one caller stabilized:

- `AnimatedText`, `TypingDots`, `KeyboardShortcutsModal` → each imported **only** by
  `editor-shell/` → move into `editor-shell/`.
- `CSSPasteDialog` → **only** by `animation-controls/timeline/KeyframeTimeline.vue` → move into
  the keyframe-timeline zone (F1).
- `EditableLabel` → **only** by `asset-manager/AssetLayer.vue` → travels with asset-manager to
  playground (F3).

Separately, four singles form a cohesive **easing-editor cluster** shared between the easing scene
and `animation-controls/controls/TimingFunctionPanel.vue`: `EasingEditor`, `EasingSelect`,
`EasingCurveCanvas`, `DemoControlPoint`. **Proposal:** group into
`@/components/custom/easing-editor/`. Genuinely-shared leaves `CopyButton` (5 consumers) and
`KfPillTabs` (2) stay as flat shared widgets. Net: the flat root shrinks from 11 to ~2.

### F6 — [MED] `ui/menubar/` is a 16-file shadcn component with one consumer; `cn()` is menubar-private

`components/ui/menubar/` (16 files, ~586 L) is imported by exactly one file:
`animation-controls/keyframes/KeyframesEditor.vue` (`grep -rln components/ui/menubar` → single
hit). Its only dependency `utils/utils.ts` (the shadcn `cn()` classnames helper) is imported by 11
files — **all 11 are the menubar components themselves**. So `ui/menubar/` + `utils/utils.ts` form
a closed 17-file island serving one call-site. `demo/CLAUDE.md` even flags it: "the ONE remaining
shadcn-vue component dir (16 files); the rest migrated to `@mkbabb/glass-ui`."

Given S's "no legacy / SOTA uplift, leverage glass-ui idiomatically" mandate (MEMORY: glass-UI
idiom feedback), a full shadcn menubar for a single keyframes-editor menu is over-built legacy.
**Proposal:** replace with glass-ui's menu primitive, or — if kept — relocate the island into the
keyframes-editor zone (F1) and delete the now-empty `ui/` tree and `utils/utils.ts`. Either way it
should not sit in a top-level shared `ui/` directory as if broadly used.

### F7 — [MED / HONESTY] `demo/CLAUDE.md` (R.W8 "post-fusion refresh") documents three files that do not exist

Commit `5a5f7db` is labelled "R.W8: demo/CLAUDE.md post-fusion refresh." Yet the refreshed
`demo/CLAUDE.md` still enumerates deleted/nonexistent files:

- Singles list (`demo/CLAUDE.md` structure block): "…Animated, AnimatedText, …, ResponsiveSelect,
  TypingDots" — but `Animated.vue` and `ResponsiveSelect.vue` were **deleted by R.W5 Band A**
  (`find demo -name Animated.vue` → MISSING; same for ResponsiveSelect.vue).
- Animation-controls section: "Top level: **AnimationControlsGroup.vue**, **AnimationMenuBar.vue**,
  …" — `AnimationMenuBar.vue` **does not exist anywhere** in the tree (`find demo -name
  AnimationMenuBar.vue` → MISSING).

The docs-refresh wave updated the scene section but did a stale copy of the `@` section — evidence
that R's demo/@ documentation was carried forward untouched (consistent with the whole partition
being unaudited). Minor as a bug, but it corroborates the thesis: nobody re-derived the `@`
inventory during R. S must regenerate this section from the actual tree.

### F8 — [LOW] R's audit validated shape, not sharing — the census gap is the method lesson

`gestalt-demo.md:31` asserts "the demo already uses real directory sub-modules well
(`animation-controls/{…}`, `orbital-drag/composables`, `matrix-editor`)" as justification for
declaring the `@` shape sound. But "uses sub-directories" is orthogonal to "is correctly scoped
for a *shared* library." An importer census (this lane) falsifies the sharing claim for
`orbital-drag`, `matrix-editor` (F3) and for `useTypedTrigger`, `ui/menubar` (F4/F6). The method
residue for S: **any "keep verbatim / do not touch" verdict on a shared directory must be backed
by a consumer census, not a shape inspection.** R's demo lanes measured line counts and directory
depth; they did not build the import graph.

### F9 — [INFO] What is genuinely shared and correctly placed (do not churn)

For S's benefit, the correctly-homed shared surface (keep in `@`):
`utils/kfEngine.ts` (21 consumers — the `loadAnimationEngine` wrapper),
`composables/useDragScrub.ts` (5 scenes), `composables/gestureSelectSuppression.ts` (3),
`utils/{clipboard,iosTextEntry,toastGuard}.ts` (2–3 each), `styles/*` (broad;
`design-idioms.css` 874 L has 20 consumers, legit), `editor-shell/` (shared by app + playground),
and the flat `CopyButton`/`KfPillTabs`. No orphans; R's dead-code excision (§7) was clean.

---

## Proposed end-state `demo/@` tree (S target)

```
demo/@/                                # SHARED library — every module has ≥2 consuming AREAS
├── state/                            # ⬆ hoisted from animation-controls/stores/  (F2)
│   ├── sceneMachine.ts · useSceneMachine.ts · scenePlaybackAdapters.ts
│   ├── animationOptionsStore.ts · controlOptionsStore.ts · storeUtils.ts
│   ├── controlSurfaceDFA.ts · hashSharing.ts
│   └── index.ts                      # resetAllStores (reset hook now app-level, not cross-module)
├── components/custom/
│   ├── animation-transport/          # ⬅ animation-controls root shells + controls/ + composables/  (F1)
│   ├── keyframes-editor/             # ⬅ animation-controls/keyframes/ (+ CSSPasteDialog, ui/menubar or glass-ui menu)  (F1,F5,F6)
│   ├── keyframe-timeline/            # ⬅ animation-controls/timeline/  (F1)
│   ├── easing-editor/                # ⬅ EasingEditor + EasingSelect + EasingCurveCanvas + DemoControlPoint  (F5)
│   ├── editor-shell/                 # + AnimatedText, TypingDots, KeyboardShortcutsModal  (F5)
│   ├── CopyButton.vue                # genuinely-shared leaves
│   └── KfPillTabs.vue
├── composables/                      # useDragScrub, gestureSelectSuppression  (useTypedTrigger REMOVED → scenes/sequence)
├── styles/                           # style.css, brand.css, design-idioms.css
└── utils/                            # kfEngine, clipboard, iosTextEntry, toastGuard  (utils.ts/cn REMOVED with menubar)

demo/app/                             # + ChromeDock.vue (was @/…/dock/)  (F3)
demo/playground/                      # + asset-manager/ (7 files) + EditableLabel  (F3,F5)
demo/scenes/cube/                     # + matrix-editor/ (4) + orbital-drag/ (8)  (F3)
demo/scenes/sequence/                 # + useTypedTrigger.ts  (F4)
```

Net effect: `@` sheds ~3,076 L of non-shared code (F3) + ~1,630 L stays but re-zones (F1); the
flat singles root drops 11→2; the state layer surfaces as a peer; the shadcn island is replaced or
localized. Every surviving `@` module has ≥2 consuming areas by construction.

---

## Tranche-S implications (wave-shaped)

1. **S-wave "demo-@ partition" (the headline demo wave R skipped).** Relocate the four
   single-area modules out of `@`: `dock → app/`, `matrix-editor + orbital-drag → scenes/cube/`,
   `asset-manager → playground/` (F3). Pure file-move + import-fix, mechanically identical to
   R.W5's scene fusion — but on the *shared* half. Gate it with a new `proof:shared-has-N-consumers`
   check (fail any `@` module with <2 consuming areas) so the partition cannot silently rot again.

2. **S-wave "state layer hoist."** Extract `animation-controls/stores/ → demo/@/state/` as a
   first-class peer (F2). Move the `_resetAssetManagerStore` cross-module reach into an app-level
   `resetAllStores` composer so the state barrel stops importing a UI component's internals. This
   is the keystone that de-monoliths animation-controls.

3. **S-wave "animation-controls sub-zoning."** Apply the R.W1 zone method one level down: split
   the 65-remaining-file control suite into `animation-transport/`, `keyframes-editor/`,
   `keyframe-timeline/` (F1). Fold the single-consumer singles into their zones (F5:
   `CSSPasteDialog → keyframe-timeline`; `AnimatedText/TypingDots/KeyboardShortcutsModal →
   editor-shell`; the easing cluster → `easing-editor/`).

4. **S-wave "shadcn menubar retirement."** Per the no-legacy mandate, replace `ui/menubar/` (16
   files, 1 consumer) with the glass-ui menu primitive; delete `utils/utils.ts` (`cn`) with it
   (F6). If glass-ui lacks the surface, that is a born-RED handoff to glass-ui, not a reason to
   keep 586 L of shadcn.

5. **S-wave "useTypedTrigger re-home + method fix."** Move `useTypedTrigger → scenes/sequence/`
   (F4). Record the method lesson: R.W5's "kills a triplication" is a template phrase that was not
   re-verified per extraction — S's extraction waves must cite the *actual* consumer count, and a
   single-consumer extraction lands beside its consumer, never in `@`.

6. **S-wave "docs regeneration."** Regenerate the `demo/@` section of `demo/CLAUDE.md` from the
   actual tree, deleting the `Animated`/`ResponsiveSelect`/`AnimationMenuBar` phantoms (F7). Add a
   CI doc-drift guard (the `@` module list is enumerable) so a "docs refresh" wave that stales the
   tree fails a gate.

7. **Method residue for the tranche method itself.** F8: forbid "keep verbatim / do not touch"
   verdicts on shared directories unless backed by an importer census. R's gestalt lane rubber-
   stamped the 55%-of-`@` monolith on shape alone; the census took ~20 min this session and
   overturned four of its classifications. S's audit lanes should ship the import graph as a
   deliverable, not a line-count table.

8. **Scene-switcher tie-in (S mission item).** R.W5 Band A deleted `SceneSwitcherCarousel.vue` +
   `useScrollSnapScene.ts` as dead no-ops (correctly — `demo-scene-switcher.md` F1/F4). S's
   "resurrect the scene-switcher properly" should build the new switcher against the hoisted
   `demo/@/state/` scene machine (F2), not resurrect the deleted carousel — the machine is the
   right seam, and it will be a clean peer import once state leaves animation-controls.
