# Pass 1 · Research · demo-module-census

> Lane: `demo-module-census` (step 1 of the OD-U18 5-step convergence loop, pass 1).
> READ-ONLY. Scope: `demo/` (`app/`, `scenes/`, `@/`) — per-file LOC/exports/importers
> + CARVE/KEEP/INLINE verdict seeds, reconciled against the chartered **U.B** target
> trees (`waves/U.B.md`) and the glass-ui post-BH skeleton
> (`audit/glassui-idioms-post-bh.md`).
> Mandate anchors: OWNER-ASKS row 6 (convergence loop); OD-U2 (glass-ui idiom + `@`
> dissolution), OD-U12 (facet loading model), OD-U15 (CLAUDE.md deletion), OD-U16
> (granularity BOTH directions), OD-U18 (the loop).

## §0 — Census totals (evidence, `demo/`, worktrees excluded)

- **188 source files / 27,246 LOC.** By type: 58 `.vue`, 115 `.ts`, 12 `.css`, 3 `.json`.
- By top area: `app/` (3 vue / 15 ts / 0 css), `scenes/` (22 vue / 37 ts / 4 css),
  `@/` (33 vue / 62 ts / 8 css), plus `demo/glass-ui-gaps.ts` at root.
- **NO file exceeds the glass-ui 500-LOC `proof:no-god-module` ceiling.** The tallest is
  `scenes/spring/useSpringDemo.ts` at 496. So U's carves are **cohesion carves** (extract a
  real concern) and **CSS splits**, NOT line-count carves — the opposite discipline that
  manufactured the orphan `transport/composables/` drawer (`proof:demo-no-oversize`, retired
  at U.B2).
- **The structural defect is DEPTH + FLATNESS, not file length.** Deepest path is 8 levels
  (`@/components/custom/instrument/transport/controls/AnimationControls.vue`); the flat
  `transport/composables/` holds 18 barrel-less files. Both are the shadcn-vestige wrapper
  tax OD-U2 dissolves.

## §1 — Root-level structural findings (the U.B1 keystone surface)

| item | current | evidence | verdict seed |
|---|---|---|---|
| `demo/@/` on-disk dir | real directory, 5 children (`components`,`composables`,`state`,`styles`,`utils`) | `find demo -type d` | **DISSOLVE** → hoist 5 children to `demo/{…}/`; alias spellings unchanged; `grep 'from "@/' demo` = 0 hits ⇒ **0 import edits** (OD-U2 part 2, U.B1) |
| `demo/@/components/custom/` | holds exactly `{instrument/, CopyButton.vue}` | `ls` | **DISSOLVE** → `components/instrument/`, `components/CopyButton.vue` (drops depth 8→6, U.B1) |
| `demo/CLAUDE.md` | present (also `keyframes.js/CLAUDE.md`, `src/animation/CLAUDE.md`) | `find -name CLAUDE.md` | **DELETE** all 3 (OD-U15); content re-homed inline/README; kill the gates that read them (claude-paths-live etc.) |
| `demo/DESIGN.md` | present at demo root | `ls -a demo` | **QUESTION for spec** — OD-U15 names only CLAUDE.md; DESIGN.md is a design doc. Verdict seed: fold into README or `docs/` per the "docs live inline or in README" spirit; NOT a CLAUDE.md so not auto-deleted. |
| `demo/glass-ui-gaps.ts` | 209 LOC at demo root, 8 importers | wc + grep | **RE-HOME** to shared tier (spans app/ + @/); named U.B9 |

## §2 — `@/components/custom/instrument/` — the facility (deepest, most nested)

Recut per lane 24 §9.4 to the glass-ui feature-dir shape (kebab dir · PascalCase SFC ·
`index.ts` re-export barrel · `constants.ts` types-through-barrel · per-component
`composables/`). Current members and verdicts:

### transport/ (the three-drawer pile — U.B2/U.B3)
| file | LOC | verdict seed |
|---|---|---|
| `transport/composables/` (18 flat `.ts`, **no barrel**) | — | **DISSOLVE the drawer.** 15 of 18 single-owner → move INTO owner module dir (U.B2 dependency table). The 3 genuine multi-consumers hoist to `@/composables/`: `useScrollFade.ts` (129), `useDragCapture.ts` (70), `useRafLoop.ts` (63 → folds into the ONE `useDemoTicker`, U.B3) |
| `TransportDock.vue` | 464 | **CARVE (cohesion)** → `useMenubarMeasure.ts` (`:255-321`) + `useIconSpin.ts` (`:398-434`), colocated in a `TransportDock/` module (U.B2) |
| `controls/AnimationControls.vue` | 456 | **RECUT** to `AnimationControls/` module; hosts the 3 single-owner composables (`useSelectedControlSurface`,`useKeyframesPaneReveal`,`useTabStripScroll`) (U.B2) |
| `controls/AnimationControlsControls.vue` | 432 | **RENAME** (`AnimationControlsControls`→ratified lexicon e.g. `TransportChannelControls`, U.B2) + **DE-TANGLE** the 6-level scene import (`:264` → `../../../../../../scenes/easing/easingGroups`, U.B3) |
| `AnimationControlsGroup.vue` (+`.css` 223) | 334 | recut to `AnimationControlsGroup/` per-parent module (U.B2); `defineSlots` (4 sites, U.B12) |
| `components/ControlsPaneWrapper.vue` (+`.css` 148) | 320 | **COLLAPSE** the `components/` peer bag → per-parent module (RibbonBar renders INSIDE it yet sits as a peer, U.B2) |
| `controls/AnimationVisualizer.vue` | 256 | **HOIST** to `@/components/playback/` + drop the unconditional "always poll" rAF (`:236-250`, U.B3) |
| `controls/PlaybackRibbon.vue` | 239 | **HOIST** to `@/components/playback/`; delete side-effect `import "./playback-button.css"` (`:82`) → `design-idioms.css` (U.B3) |
| `components/RibbonBar.vue` | 151 | into `ControlsPaneWrapper/` module (U.B2) |
| `controls/TimingFunctionPanel.vue` | 166 | KEEP; into controls module |
| `controls/LayerConfigPanel.vue` | 81 | **FIX (OD-U14 D4)** — gate the blend selector OFF for multi-target groups (`:69`; no-op on `singleTarget=false`, U.B3) |
| `components/DemoGlobalChrome.vue` | 49 | **RE-HOME** to document-singleton tier beside app chrome (U.B3) |
| `animationDescriptions.ts` (10 exp) · `controls/timingCurveUtils.ts` (54) · `scenes/easing/easingGroups.ts` | — | **HOIST** to `@/` shared reference-data (breaks the transport↔easing cycle, U.B3) |
| `KfPillTabs.vue` (130) + `composables/useKfPillTabs.ts` (95) | — | **DE-VANITIZE** (drop `Kf`; adopt glass-ui `SegmentedTabs` where it merely re-wraps public tabs, U.B12/U.R4) |
| `transportSource.ts` (33) · `injectionKeys.ts` (15) · `index.ts` (14) | — | KEEP as module `constants.ts`/barrel members (injectionKeys → `constants.ts`) |

### keyframes/ (the oldest demo code — U.B4)
| file | LOC | verdict seed |
|---|---|---|
| `KeyframesStringControls.vue` | 309 | **UNIFY** on `useKeyframesEditor` — deletes the inline serialize/parse (`:100-209`) (U.B4) |
| `KeyframesEditor.vue` | 291 | fold brush dup into one `useKeyframeBrushApply` (`:231-290`); retire `Ï` magic-char (`:190`) (U.B4) |
| `CSSCodeEditor.vue` (227) + `monaco-themes/` (GitHub.json 246, Dracula.json 207) | — | **HOIST** to `instrument/`-shared Monaco leaf (timeline stops reaching in, U.B4) |
| `composables/` (useKeyframeOps 204, useHighlightCSS 125, useKeyframesParsing 113, useToolbarKeyboard 111, useKeyframesState 72, useApplyCSS 69, useKeyframesEditor 56) | — | consolidate onto ONE authoring core; `useKeyframesEditor` becomes THE `animation⇄CSS` engine (U.B4) |
| `components/KeyframesAddDialog.vue` (161), `KeyframeCardList.vue` (82) · `KeyframeCard.vue` (81) | — | KEEP; module children |
| `utils/parseAnimationCSS.ts` (42) · `contenteditable.ts` (23) | — | **INLINE candidate** — `contenteditable.ts` (one fn, 1 importer) → into its sole consumer OR the module `utils` barrel (§4) |
| `index.ts` (11, 3 async exports) | — | KEEP (lazy barrel contract) |

### timeline/ (U.B4 hoist consumer)
| file | LOC | verdict seed |
|---|---|---|
| `KeyframeTimeline.vue` | 295 | stop hand-parsing declarations (`:229-248`) → `useKeyframesEditor`; consume hoisted `CSSCodeEditor` (`:156`) (U.B4) |
| `components/TimelineTrack.vue` (245), `TimelineHoverPreview.vue` (38); `TimelineCaret.vue` (69) | — | KEEP; `defineModel` for `TimelineTrack` manual `update:*` (`:129`, U.B12) |
| `CSSPasteDialog.vue` (80) | — | KEEP |
| `composables/useTimelineBuild.ts` (200), `useTimeline.ts` (129), `useTimelineOps.ts` (84), `useZoomPan.ts` (109) | — | KEEP as per-component composables |
| `utils/timelineEngine.ts` (101), `snapshotCapture.ts` (62), `flattenVars.ts` (33) | — | KEEP; `flattenVars.ts` (33, one concern) is an **INLINE watch** — merge into `timelineEngine.ts` if single-owner (§4) |
| `timelineTypes.ts` (36) · `index.ts` (8) | — | **INLINE** `timelineTypes.ts` → module `constants.ts` (types-through-barrel idiom) |

### shell/ (three tenants conflated — U.B5)
| file | LOC | verdict seed |
|---|---|---|
| `EditorHeader.vue` | 108 | **DELETE** — ZERO runtime importers (only `demo/CLAUDE.md` + `layout.css` comment + `shell/index.ts` re-export; the barrel hides it from `proof:no-dead-export`) (U.B5) |
| `HeroAurora.vue` (135), `AnimatedText.vue` (126), `TypingDots.vue` (130) | — | **MOVE to `app/`** — home-hero identity, not shared editor facility (U.B5) |
| `EditorShell.vue` (261), `EditorStartScreen.vue` (191), `SharePopover.vue` (62), `KeyboardShortcutsModal.vue` (69), `useShareState.ts` (95) | — | **TIER** the residual editor-chrome to §9 skeleton (add `components/`+`composables/`, U.B5) |
| `index.ts` (4) | — | drop the EditorHeader line |

### instrument facility root
| file | LOC | verdict seed |
|---|---|---|
| `instrument/index.ts` (27, `export *` ×4) | — | **DELETE** — zero runtime importers, `export *` violates barrel policy; unconsumed surface = legacy (U.B11) |
| `custom/CopyButton.vue` (119, 6 importers) | — | **HOIST** to `components/CopyButton.vue` (cross-tier legit) (U.B1) |

## §3 — `scenes/` (six scenes, un-converged — U.B8/U.B13)

| file | LOC | verdict seed |
|---|---|---|
| `spring/useSpringDemo.ts` | 496 | tallest file; **CARVE** onto `useSweepScene` recipe (U.B8) — drops well under ceiling |
| `sequence/useSequenceDemo.ts` | 482 | route through `useManagedLoop`; **KILL** the 60 Hz reactive-progress write (`:179-195`, U.B8) |
| `square/useSquareDemo.ts` | 471 | **DOGFOOD** — delete hand-rolled `num()` (`:75-87`)→`ValueUnit`, `toRGB`/`sweepHue` (`:187-214`)→`Color`; bare `new RAFPlayback()` (`:217`)→`useManagedLoop` (U.B8) |
| `spring/SpringTarget.vue` | 471 | **CSS SPLIT** — 200-LOC `<style scoped>` block (confirmed) → `<style scoped src="./SpringTarget.css">` (U.B12) |
| `easing/useEasingDemo.ts` | 442 | onto `useSweepScene` + `usePainterRegistry` (dotPainters `:186-201`, U.B8) |
| `spring/SpringHeatmap.vue` (337), `SpringScene.vue` (206), `SpringPhysicsFacet.vue` (242), `SpringTrace.vue` (129), `StartingStyleTarget.vue` (216) | — | spring → `target/`, `heatmap/`, `physics-facet/` sub-modules (U.B8 §9.4). **`SpringPhysicsFacet.vue:133`** eager-imports `KeyframesEditor` = the OD-U12 named "inline monaco editor for spring" 906 KB leak → **async facet seam** (U.B11) |
| `square/SquareScene.vue` (331, +`.css` 159), `SquareInstrument.vue` (212), `useSquareKeyboard.ts` (102) | — | recut; colocate tumble egg → `useSquareTumble.ts` (U.B8) |
| `easing/EasingTarget.vue` (309, +`.css` 193), `EasingSidebar.vue` (236), `EasingScene.vue` (134) | — | KEEP; scene module members |
| `amiga/*` (AmigaScene 270, useAmigaThree 272, useSphereSpin 245, useAmigaDemo 158, utils 91) | — | **U.B13 cure** — one symmetric suspend seam (render loop + group clock) on `useManagedLoop`; consumes U.C14 library freeze fix |
| `sequence/*` (SequenceTarget 255 +`.css` 259, SequenceScrubber 163, SequencePlayhead 86, SequenceScene 45, SequenceAxis 49, useSequenceInstrument 45, useTypedTrigger 31) | — | KEEP; converge on `useManagedLoop` |
| `cube/*` — see §3a | — | |

### §3a — cube/ (charter-UNDER-specified — a GAP)
| file | LOC | verdict seed |
|---|---|---|
| `orbital-drag/OrbitalDrag.vue` | 352 | **CHARTER GAP** — U.B8 mentions "cube's matrix" facet but never details `orbital-drag/`. Module already has `composables/{useOrbitalPointer 249, useOrbitalPinch 201, useOrbitalInertia 144, inertiaDecay 34}` + `quaternionEuler.ts` (64) + `types.ts` (15). Verdict seed: KEEP module (already §9-shaped); but `index.ts` (116 LOC of TransformState/Bounds/Velocity interfaces+defaults) is **mis-named** — a barrel should be re-export-only; move the interface/defaults body to `constants.ts` (U.B11 barrel-purity) |
| `matrix-editor/MatrixEditor.vue` (159), `useTransformState.ts` (241), `transformMath.ts` (55, 7 exp), `index.ts` (1 line) | — | KEEP module; `index.ts` (single re-export, 1 LOC) is an **INLINE candidate** (§4) |
| `CubeScene.vue` (288), `CubeTarget.vue` (239 +`.css` 154), `CubeAxisLines.vue` (90), `useCubeDemo.ts` (149), `useCubeRelit.ts` (86), `cubeTransformStore.ts` (20) | — | KEEP; converge on `useManagedLoop` |

## §4 — Absurdly-small modules → INLINE targets (OD-U16 lower bound)

Owner: "absurdly small modules should be abrogated for superfluity and instead made inline."

| module | LOC | content | INLINE target |
|---|---|---|---|
| `scenes/cube/cubeKeys.ts` | 7 | one `CUBE_SCENE_ID` string const | inline into `useCubeDemo.ts` (owner) — export the id there; `scenes.ts` imports from it. Same for `squareKeys.ts` (5) → `useSquareDemo.ts`/`SquareScene.vue`, `amigaKeys.ts` (5) → `useAmigaDemo.ts`. These carry NO InjectionKey, only a bare id string — no keys-module justification. |
| `scenes/{spring,easing,sequence}Keys.ts` | 8-10 | id const + `InjectionKey<Context>` (`ReturnType`-derived) | **KEEP** — a real injection-key module (the context type dodge needs a file); but note §7's "context DECLARED not `ReturnType`-derived" (lane 24 §7) — convert the ReturnType type, then the file earns its place. |
| `scenes/cube/matrix-editor/index.ts` | 1 | single `export { default as MatrixEditor }` | **INLINE** — a 1-line barrel over a 1-component module is pure ceremony; import `MatrixEditor.vue` directly, delete the barrel |
| `@/utils/clipboard.ts` | 8 | one `copyText()`, 5 importers | **KEEP** (5 consumers = genuine shared util) but the charter leaves it with CopyButton (U.B9) — reconcile: 5 importers earns `@/utils/` |
| `@/utils/iosTextEntry.ts` | 18 | 3 iOS fns, 2 importers | **RE-HOME** → `instrument/utils/` (both consumers instrument, U.B9); not inline (3 fns, real concern) |
| `@/utils/toastGuard.ts` | 28 | vue-sonner private-DOM guard, 2 importers | **RE-HOME** → `instrument/utils/` (U.B9); keep as a file (documents a private contract) |
| `app/runtime/rafConstants.ts` | 15 | one `PROGRESS_READOUT_HZ = 6` | **INLINE** into the shared ticker/`scene-runtime` module (U.B3/B8 fold it there anyway) |
| `keyframes/utils/contenteditable.ts` | 23 | one `insertTabAtCursor()`, ≤1 importer | **INLINE** into sole consumer OR keep in a module `utils` barrel — resolve by importer count at recut |
| `keyframes/utils/flattenVars.ts` | 33 | one concern | **INLINE-watch** → merge into `timeline/utils/timelineEngine.ts` if single-owner |
| `timeline/timelineTypes.ts` | 36 | 4 type exports | **INLINE** → module `constants.ts` (types-through-barrel) |
| `scenes/cube/orbital-drag/types.ts` | 15 | `GestureEvent`/`PressedKeys` | **INLINE** → module `constants.ts` (already re-exported by `index.ts`) |
| barrels `keyframes/index.ts` (11), `transport/index.ts` (14), `timeline/index.ts` (8), `shell/index.ts` (4) | — | **KEEP** — real lazy/`defineAsyncComponent` contracts (NOT ceremony); but `instrument/index.ts` (27, `export *`, 0 importers) **DELETES** (U.B11) |
| `@/styles/brand.css` | 31 | brand tokens | KEEP (token partial) |

**Rule seed:** a `.ts` whose ENTIRE content is one string constant or one type (no
InjectionKey, no shared multi-consumer contract) inlines into its owner; a 1-line
re-export barrel over a single-component module inlines; a `types.ts`/`*Types.ts`
folds into the module's `constants.ts`.

## §5 — `@/state`, `@/composables`, `@/styles`, `app/` (the honest-global tiers)

| file | LOC | importers | verdict seed |
|---|---|---|---|
| `@/state/controlSurfaceDFA.ts` | 309 | — | **SPLIT** → pure `controlSurfaces.ts` (→`@/state`) + `surfaceTabs.ts` (dock presentation → instrument facility) (U.B6) |
| `@/state/useSceneMachine.ts` (342) · `sceneMachine.ts` (270) · `scenePlaybackAdapters.ts` (219) · `animationOptionsStore.ts` (132) · `controlOptionsStore.ts` (99) · `hashSharing.ts` (72) · `storeUtils.ts` (73) · `index.ts` (135) | — | KEEP as honest-global state; **U.B6** — disciplined `applySharedState(patch)` writer (`hashSharing.ts:59-67` bypasses the single-writer boundary); collapse duplicated `selectedKeyframesControl` (`controlOptionsStore.ts:18` vs `:20-25`, U.B4). NOTE: `useSceneMachine.ts` at 342 is the state core — KEEP (under ceiling). |
| `@/composables/useDragScrub.ts` (150, 6 imp) · `useDoubleTap.ts` (84, 3 imp) · `useThrottledReadout.ts` (83, 2 imp) | — | KEEP — genuine cross-area (≥2 consumers earn the seat) |
| `@/composables/gestureSelectSuppression.ts` (35, 2 imp) | — | **KEEP w/ recorded justification** — global singleton token (`body.is-dragging`); the DEFERRED-map tolerance around it DELETES (U.B9) |
| `@/utils/kfEngine.ts` (56, 16 imp) | — | **HOIST** to `shared/kf-engine.ts` (widest fan-out, the universal engine-loader seam, U.B9) |
| `@/components/skeletons/SceneSkeleton.vue` (101, 1 imp) | — | **RE-HOME** → `app/` beside `App.vue`; delete the one-member `skeletons/` tier (forbidden category-bin, U.B9/B10) |
| `@/styles/{design-idioms 299, style 295, layout 210, brand 31}.css` + `font-roles.json` (84) | — | KEEP the central cascade; `font-roles.json` (gate-only manifest) → `scripts/` (U.B9). `@apply` confine to `@/styles/` (U.B12) |
| `app/App.vue` (386) · `main.ts` (65) | — | async-tolerant engine contract (hero has zero engine dep; mount before warm, U.B8/U.D5) |
| `app/runtime/` (useRafScene 122, useSceneTransport 93, useSceneVisibilityPause 52, rafConstants 15, loaf-observer 85, useMonacoCancellationGuard 33) | — | **SPLIT** — 4 scene-recipes → `shared/composables/scene-runtime/`; 2 app-guards → `app/lifecycle/` (U.B8/B9). `useRafScene`→`useManagedLoop`. |
| `app/scene/` (sceneFacility 114, scenes 227, useSceneMachineShellBinding 304, useSceneMachineRouterBinding 150, sceneExposedApi 44, router 60) | — | **HOIST** `sceneFacility.ts` contract → `shared/scene-facility/`; DELETE dual-path `animationGroup?`/`scenePlayback?`/`ownsPlayback` (U.B7). `useSceneMachineShellBinding.ts` (304) — dead `?? animationGroup` fallback (`:67`) deletes. |
| `app/transition/` (useSceneTransition 95, useSceneSwap 54) | — | KEEP |

### §5a — `app/dock/` (charter GAP)
| file | LOC | verdict seed |
|---|---|---|
| `app/dock/ChromeDock.vue` | 386 | **CHARTER GAP** — U.B.md never names `app/dock/`, `ChromeDock`, or `MbabbMenu`. 386 LOC (under ceiling but the demo's 2nd-tallest SFC). Verdict seed: assay for a cohesion carve (dock-layout vs dock-state composable) at recut; confirm it already reads to §9 or needs a `composables/` tier. FLAG to synthesis. |
| `app/dock/MbabbMenu.vue` | 245 | KEEP; dock module member; verify glass-ui dock idiom homogeneity (MEMORY: dock changes belong in glass-ui root, not patched here) |

## §6 — Reconciliation with the charter (what U.B COVERS vs MISSES)

**Covered well (verdicts already cut, my census confirms the cites):** the `@/`+`custom/`
dissolution (U.B1), the transport three-drawer recut (U.B2/B3), the editor unification
(U.B4), the shell purge (U.B5), state hygiene (U.B6), SceneFacility subsumption (U.B7),
scene convergence + dogfood (U.B8), shared-tier re-homing (U.B9), skeletons (U.B10), barrel
+ facet async seams (U.B11), grammar/CSS sweep (U.B12), amiga cure (U.B13). Every file:line
in §2-§5 above matches a chartered wave.

**GAPS the charter under-specifies (surface to the synthesis agent):**
1. **`app/dock/` (ChromeDock 386, MbabbMenu 245)** — never named in U.B.md. Second-tallest
   SFC in the demo. Needs a colocation/carve verdict + a glass-ui-dock homogeneity check.
2. **`scenes/cube/orbital-drag/index.ts` (116 LOC)** — a "barrel" carrying 116 LOC of
   interface + default-object bodies. Violates the barrel-purity rule U.B11 asserts for
   the demo, but U.B11's examples are instrument-side only. Move bodies → `constants.ts`.
3. **`scenes/cube/orbital-drag/OrbitalDrag.vue` (352)** — no explicit recut verdict (U.B8
   details spring/square/easing/sequence, mentions cube only via "matrix facet").
4. **`demo/DESIGN.md`** — OD-U15 names only CLAUDE.md; DESIGN.md's disposition is unstated.
5. **The scene `*Keys.ts` split** — U.B keeps them implicitly; OD-U16's lower bound argues
   the 3 pure-id files (cube/square/amiga, 5-7 LOC, no InjectionKey) should inline. The
   charter does NOT rule on this — a live OD-U16 question for the loop.

## §7 — Small-module INVENTORY (the OD-U16 lower-bound worklist)

Files ≤40 LOC that are NOT self-justifying (excluding real lazy barrels + token partials):
`matrix-editor/index.ts` (1), `{amiga,square,cube}Keys.ts` (5-7), `rafConstants.ts` (15),
`orbital-drag/types.ts` (15), `contenteditable.ts` (23), `timelineTypes.ts` (36),
`flattenVars.ts` (33), `transportSource.ts` (33, but holds `TransportChannel` type re-export
— borderline KEEP). Total inline-candidate reduction: **~8-10 files erased**, each folded
into an owner or a module `constants.ts`.

## Rules/verdicts for the spec

1. **Depth, not length, is the demo's defect.** No demo file breaks the 500-LOC ceiling; U's
   carves are cohesion carves + CSS splits, never line-count carves. The line-count gate
   (`proof:demo-no-oversize`) RETIRES — it manufactured the orphan drawer.
2. **`demo/@/` DISSOLVES** to `demo/{components,composables,state,styles,utils}/` (0 import
   edits — `grep 'from "@/' demo`=0; alias spellings unchanged, declared in all 3 planes).
   **`components/custom/` DISSOLVES** (`{instrument/,CopyButton.vue}`→ up one level).
3. **Every component → glass-ui feature-dir shape:** kebab dir · PascalCase SFC · `index.ts`
   re-export-only barrel · `constants.ts` (types-through-barrel) · per-component
   `composables/useXxx.ts`; `>500L` renderers carve (none today) — the shape is the law even
   under the ceiling.
4. **A barrel is re-export-only.** `instrument/index.ts` (27, `export *`, 0 importers) DELETES;
   `orbital-drag/index.ts`'s 116 LOC of interface/default bodies move to `constants.ts`;
   `matrix-editor/index.ts` (1-line) inlines.
5. **INLINE the absurdly-small (OD-U16 lower bound):** a `.ts` whose entire body is one
   string const or one type (no InjectionKey, no ≥2-consumer contract) folds into its owner;
   `*Types.ts` folds into `constants.ts`; pure-id scene keys (cube/square/amiga) inline into
   their `useXDemo`; injection-key files (spring/easing/sequence) KEEP but drop the
   `ReturnType`-derived context for a DECLARED interface.
6. **Shared-tier seat = ≥2 consumers** across areas (verified: `useDragScrub` 6, `useDoubleTap`
   3, `kfEngine` 16 → hoist to `shared/`; single-owner satellites move INTO their owner).
7. **DELETE all 3 CLAUDE.md + the gates that read them (OD-U15);** rule on DESIGN.md
   (README-fold seed). **Delete the DEFERRED tolerance machinery** in `proof-colocation.mjs`
   (`:69-96`) once its residuals re-home (`kfEngine`, `gestureSelectSuppression`) — an
   exception changes the RULE, never enrolls in a list.
8. **`proof:colocation` re-forges tolerant→REQUIRING** (assert hoisted homes EXIST, `@`/`custom`
   do NOT); a keystone that cannot fail on the rejected tree is retired. All new assertions are
   CLAUSES on existing gates — net standalone gates in U.B = ZERO.
9. **Facet async seams (OD-U12):** heavy editors load only when their facet is SHOWN. The named
   violation `SpringPhysicsFacet.vue:133` (eager `KeyframesEditor` → 906 KB `vendor-highlight`
   in SpringScene's chunk) becomes a `defineAsyncComponent` facet seam.
10. **GAPS for synthesis to charter:** `app/dock/` (ChromeDock 386 / MbabbMenu 245),
    `orbital-drag/` recut + barrel-body move, `DESIGN.md`, the scene-keys inline ruling — none
    fully specified in `waves/U.B.md`.
