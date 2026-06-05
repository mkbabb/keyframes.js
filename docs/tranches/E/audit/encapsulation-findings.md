# E audit — encapsulation lane (composables · state · directory shape)

Post-D the demo is in excellent shape: 100% `<script setup>`, the five oversized
D.W1 units decomposed, the stores split by concern, the listener/observer
gestalt begun in D.W3. This lane is a SECOND pass — a refinement of a refined
surface, not a rescue. It finds exactly two units that re-crossed the
"one-file-one-concern" seam after D's churn (`App.vue`, `useOrbitalPointer.ts`),
one large unit that is genuinely cohesive and should be LEFT (`EasingCurveCanvas.vue`),
and a clean bill of health on every other encapsulation axis the E mandate named
(composable naming, colocation, the stores/composables split, `markRaw`,
`provide`/`inject`, directory grouping).

Every figure below is `wc -l` / `grep`-verified against the live tree on
`tranche-d-impl` (2026-06-05), with `file:line` cited — **verified, not
asserted.** The two FOLD findings land in **E.W1** (frontend encapsulation round
2); the wave's hard gate is net-deletion + size ceilings + a render smoke with
zero behaviour change.

This is **net-NEW** content. D's deferred ledger is clean (P-invariant-28: D
terminated every keyframes-owned deferral, zero KFE); nothing here is folded
debt. These are two units that grew past their seam as a side effect of D's
own decomposition + scene-swap-dogfood work, observed fresh in the E assay.

## Findings

| # | Finding | Evidence (file:line) | Severity | E-disposition |
|---|---|---|---|---|
| E1 | `app/App.vue` — 452L; three concerns fused: scene-route orchestration + per-scene playback-snapshot save/restore + the scene-swap `SpringProgress` | `app/App.vue` (452L) | High | **FOLD-E.W1** |
| E2 | `useOrbitalPointer.ts` — 376L; input-plumbing (pointer/wheel/key lifecycle) conflated with transform-business-logic (linear-transform apply + bounds-clamp + emit) | `orbital-drag/composables/useOrbitalPointer.ts` (376L) | High | **FOLD-E.W1** |
| E3 | `EasingCurveCanvas.vue` — 351L; large but COHESIVE — one SVG curve renderer + its own bezier-handle drag; a single responsibility (draw + edit a curve) at one seam | `EasingCurveCanvas.vue` (351L) | — | **LEAVE** (documented) |
| E4 | Composable naming — every composable is `useX`; pure helpers correctly NOT named `useX` | grep over `**/composables/*.ts` | — | **LEAVE** (clean) |
| E5 | Colocation — composables sit beside their owning component in concern dirs | `animation-controls/{keyframes,timeline,controls}/composables/`, `orbital-drag/composables/` | — | **LEAVE** (clean) |
| E6 | Stores / composables split — stores own persistence (localStorage singletons), composables own reactive logic; no leak across the seam | `animation-controls/stores/` (6 files, split by concern) | — | **LEAVE** (clean) |
| E7 | `markRaw` + manual reactive sync — every `markRaw`'d engine object is bridged by an EXPLICIT rAF/watch sync, correctly | `controls/composables/useAnimationSync.ts`, `timeline/composables/useTimelineBuild.ts:44`, `keyframes/composables/useKeyframesParsing.ts:83` | — | **LEAVE** (clean) |
| E8 | `provide` / `inject` — typed `InjectionKey<T>` symbols, provided at the right scope (`App.vue` for app-wide, `AnimationControls.vue` for sub-tree) | `animation-controls/injectionKeys.ts`, `app/App.vue:185,190` | — | **LEAVE** (clean) |
| E9 | Directory grouping — concern-based dirs, no over-fragmentation, no monolith dumping-ground | `@/components/custom/{animation-controls,asset-manager,dock,editor-shell,matrix-editor,orbital-drag}/` | — | **LEAVE** (clean) |

## E1 — `App.vue` (452L): three concerns at one seam

`app/App.vue` is `wc -l` 452 lines. D's scene-swap-dogfood (`a0303fe`-adjacent)
and playback-restore work landed in the app entry, and three genuinely separable
concerns now share the SFC:

1. **Scene-route orchestration.** The primitive router is ALREADY extracted —
   `useSceneRouter` (`app/useSceneRouter.ts`, 69L) and `useSceneUrl`
   (`app/useSceneUrl.ts`, 68L) own the `currentSceneId` / `?anim=` machinery.
   But App.vue retains the route *orchestration* on top of them: `switchScene`
   (`App.vue:349-396`, a 48-line method that saves playback state, calls
   `rawSwitchScene`, then re-derives controls-panel-open state per
   home/cube/other branch) and the big `watch(() => sceneRef.value?.animationGroup, …)`
   (`App.vue:398-451`, 54 lines spanning the stable-fire detection, controls
   config, `currentSuperKey`/`currentAnimationGroup` re-seat, AND the playback
   restore call). This is the active-scene lifecycle, distinct from the URL
   router beneath it.
2. **Per-scene playback-snapshot save/restore.** `saveCurrentPlaybackState`
   (`App.vue:286-304`) walks `group.animations` snapshotting `{t, reversed,
   iteration}` to the store; `restoreGroupPlaybackState`
   (`App.vue:311-346`) rebuilds a fresh `AnimationGroup` from a saved
   `ScenePlaybackState` — setting each child's `managed`/`started`/`startTime`/
   `t`/`paused`, calling `interpFrames`, `transformFramesGrouped`, and
   conditionally `resume()`. This is 50+ lines of engine-state plumbing
   (`saveScenePlaybackState`/`getScenePlaybackState`/`clearScenePlaybackState`
   imports, `App.vue:181-182`) that have nothing to do with routing or the SFC
   template — they reach deep into `AnimationGroup` internals.
3. **The scene-swap `SpringProgress`.** `sceneOpacity` + `sceneSwapStyle` +
   `sceneSwapSpring` (`App.vue:238-249`) dogfood `SpringProgress` to cross-dissolve
   the new scene over the previous paint via a sibling style binding (the
   `<Transition>`-free fade D restored for cause — the long template comment at
   `App.vue:107-135` documents why a `<Transition>` around the keyed `<Suspense>`
   re-broke the async loader). A self-contained 12-line reactive unit.

**Seam → two composables (the plan names them):**
- **`usePlaybackSnapshot`** — lift (2): `saveCurrentPlaybackState` +
  `restoreGroupPlaybackState`, taking the current-group/super-key refs, returning
  `save()` / `restore(group, state)`. The engine-state plumbing leaves App.vue
  entirely; it becomes the named owner of the snapshot contract.
- **`useSceneSwap`** — lift (3): the `SpringProgress` + `sceneOpacity` +
  `sceneSwapStyle`, watching `activeSceneKey`, returning `sceneSwapStyle`. The
  dogfood fade is one named unit; the `<Transition>`-free rationale comment
  travels with it.

After both lifts the App.vue residue is the template + the route orchestration
(1) wired onto `useSceneRouter`/`useSceneUrl` — a thin entry-point shell. The
split is along seams that already hold: (2) and (3) read nothing from the route
machine that isn't passed in, and the route orchestration reads neither the
snapshot internals nor the spring. Net-deletion of in-SFC body; zero behaviour
change (the same save→switch→restore→fade sequence, same `interpFrames`/`resume`
calls, same reduced-motion snap).

## E2 — `useOrbitalPointer.ts` (376L): input-plumbing + transform-business-logic

`orbital-drag/composables/useOrbitalPointer.ts` is `wc -l` 376 lines. It conflates
two genuinely separable concerns:

**(a) Input plumbing** — the pointer/wheel/keyboard lifecycle that turns raw
events into deltas:
- `startDrag` (`:168`), `stopDrag` (`:177`), `drag` (`:196`) — the pointer
  gesture state machine + the touch-pinch bookkeeping (`activeTouchPointers`,
  `justExitedPinch`).
- `handleWheel` (`:242`) — the wheel-delta dampen + the `isWheeling` timeout.
- `updatePressedKeys` (`:287`), `syncModifiers` (`:78`) — modifier tracking.
- `onPointerMove` / `onPointerUp` / `onPointerCancel` / `onPointerDown` +
  `removeDocListeners` (`:308-356`) — the `setPointerCapture` dynamic-document
  listener set (themselves still hand-rolled `doc.addEventListener` /
  `removeEventListener`, `:312-316,353-355` — a vueuse-migration target the E.W2
  brittleness lane owns separately).

**(b) Transform business logic** — applying a delta to the model + clamping +
emitting:
- `updateLinearTransform` (`:88-117`) — writes `model.value[category][axis]`,
  walks `categoryBounds` to `clamp` every axis against `bounds`, then
  `emit("translate"|"scale", …)`. This is domain logic — it owns the bounds
  contract and the emit shape.
- `updateTranslation` (`:119`), `updateScale` (`:131`) — the factor-scaled
  wrappers over `updateLinearTransform`.
- `handleAxisSpecificInput` (`:140-166`) — the per-axis (x/y/z) + modifier
  (shift→translate, ctrl/meta→scale, else→rotate) dispatch that decides WHICH
  transform a delta drives.

The conflation surfaces in the return object (`:358-375`): `OrbitalDrag.vue`
consumes the input-plumbing handlers (`onPointerDown`, `handleWheel`,
`updatePressedKeys` — wired via `useEventListener`, `OrbitalDrag.vue:241-260`)
AND re-exports the transform fns to the sibling gesture composables
(`updateTranslation`/`updateScale` → `useOrbitalPinch`, `OrbitalDrag.vue:199-200`;
`updateLinearTransform` → `useOrbitalInertia`, `:218`). The transform application
is a SHARED domain capability that three consumers (pointer drag, pinch, inertia)
each need — it is mis-housed inside the pointer-input composable rather than
owned by the component (or a thin transform module) that the pinch/inertia
composables also compose.

**Seam → thin the composable; the transform application moves up to OrbitalDrag.vue.**
`OrbitalDrag.vue` (290L) already owns the quaternion core
(`applyRotation`/`updateRotation`/`updateAxisRotation`,
`OrbitalDrag.vue:122-168`) — the rotation half of the transform domain. The
linear-transform half (`updateLinearTransform`/`updateTranslation`/`updateScale`
+ the bounds-clamp + the translate/scale emits) belongs at the SAME seam: the
component composes the transform application and passes it INTO `useOrbitalPointer`
(as it already passes `applyRotation`/`updateRotation` in,
`OrbitalDrag.vue:184-189`), making the pointer composable a pure
event→delta→callback plumb. After the lift `useOrbitalPointer` carries only the
input plumbing (a) — the pinch/inertia composables then receive the linear
transforms from the component directly, not re-exported through the pointer
composable, dissolving the "pointer composable owns shared transform logic"
inversion. The bounds-clamp lands once, beside the rotation core it is a peer of.

Net-deletion of the re-export plumbing; isomorphic (the same model writes, the
same clamps, the same emits — relocated, not changed). The wave gate's render
smoke + the orbital-drag interaction stay green.

## E3 — `EasingCurveCanvas.vue` (351L): cohesive — LEAVE

`EasingCurveCanvas.vue` is `wc -l` 351 lines — over the rough size seam, but
unlike E1/E2 it is a SINGLE cohesive responsibility and should be **left as-is**.
The component draws an easing curve as SVG and lets the user drag its two bezier
handles. Every block serves that one job:
- The template (`:1-103`) is the SVG: grid + axis labels + handle lines + the
  curve `<path>` + the draggable control-point circles + the traveling progress
  dot. ~100 lines of declarative SVG, irreducible.
- The render computeds (`:124-167`) — `controlPointsSvg`, `bezierPathD`,
  `viewBox` (the overshoot-clamped auto-fit). Pure geometry for the same SVG.
- The drag interaction (`:169-264`) — `pointerToSVG` (CTM inverse),
  `rubberBand` + the smoothing (`:188-202`), `startDragging`/`onDrag`/
  `stopDragging`. The handle-editing for the SAME curve.
- The scoped `<style>` (`:267-351`) — ~85 lines of SVG element styling
  (stroke widths, the design-token strokes, hover radii). Component-local
  presentation, correctly scoped (no global leak, all `var(--…)` tokens).

There is no second concern hiding here — the renderer and the editor are two
faces of "show + manipulate ONE curve", and splitting them would sever a
draggable handle from the path it edits, trading cohesion for line-count. The
component is correctly used twice (`easing/EasingSidebar.vue:4`,
`controls/TimingFunctionPanel.vue:38`) as a reusable curve widget. **Documented
as cohesive; no E action.** (Were a future need to render a curve WITHOUT
editing arise, the `editable` prop already gates the drag path — the split seam
exists latent, but is not warranted now: KISS, don't fragment a cohesive unit
speculatively.)

## E4–E9 — the clean encapsulation axes (LEAVE, documented)

The E mandate asked the assay to look for composable-consistency,
colocation, the stores/composables split, `markRaw`/`provide-inject`
correctness, and directory over-fragmentation. Each comes back **clean** —
recorded here so the verdict is on disk, not assumed.

- **E4 — composable naming.** Every composable is `useX`. The pure helpers that
  D.W1 re-homed are correctly NOT named `useX` (they live in `utils/` /
  `*Engine.ts` / `*Capture.ts` / `*Types.ts`, not `composables/`). A grep for
  non-`useX` modules inside `composables/` dirs returns nothing reactive
  mis-named. The naming honestly signals reactivity.
- **E5 — colocation.** Composables sit BESIDE their owning component in the
  concern dir (`keyframes/composables/`, `timeline/composables/`,
  `controls/composables/`, `orbital-drag/composables/`), never hoisted to a
  global `composables/` bucket unless genuinely app-wide
  (`@/composables/{useKeyboardShortcuts,useShareState,useTransformState}.ts` —
  the three that ARE cross-component). The colocation matches the demo's own
  established idiom.
- **E6 — stores / composables split.** `animation-controls/stores/` is six files
  split by concern (`animationOptionsStore` / `controlOptionsStore` /
  `hashSharing` / `scenePlayback` / `storeUtils` / `index` barrel). Stores own
  persistence (lazy localStorage singletons, Safari-private fallback); composables
  own reactive logic. The seam holds — no composable hand-rolls localStorage, no
  store reaches into Vue reactivity. Idiomatic.
- **E7 — `markRaw` + manual reactive sync.** Every `markRaw`'d engine object
  (the `Animation`/`AnimationGroup` instances Vue must not deep-track) is bridged
  to the UI by an EXPLICIT sync, correctly: `useAnimationSync.ts` (rAF polling,
  documented at `:6-7`), `useTimelineBuild.ts:44` (`animation.value =
  markRaw(anim)` with the ops-half watch noted at `:20`),
  `useKeyframesParsing.ts:83` (the explicit watch that covers the un-tracked
  `markRaw` template-frames array, `:83-86`). App.vue's
  `currentAnimationGroup = markRaw(group)` (`App.vue:204,430`) is paired with the
  rAF/watch bridges. No silent reactivity loss.
- **E8 — `provide` / `inject`.** Typed `InjectionKey<T>` symbols
  (`injectionKeys.ts`: `CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>>`,
  `TABS_EXTERNALLY_MANAGED_KEY: InjectionKey<boolean>`), provided at the correct
  scope — `App.vue:185,190` for the app-wide dock-hover/tabs-managed contract
  (TopDock sibling + AnimationMenuBar descendant share one ref),
  `AnimationControls.vue` for its own sub-tree. No string-keyed inject, no
  over-broad provide. Idiomatic.
- **E9 — directory grouping.** `@/components/custom/` is six concern-based dirs
  (`animation-controls` 60 files · `asset-manager` 7 · `dock` 2 ·
  `editor-shell` 6 · `matrix-editor` 4 · `orbital-drag` 6). The large
  `animation-controls` dir is itself sub-grouped by concern
  (`keyframes/`, `timeline/`, `controls/`, `stores/`, `composables/`) — the D.W1
  decomposition. No flat dumping-ground, no single-file dir that should be inlined,
  no over-fragmentation. Well-organized.

## Verification (re-runnable)

```sh
cd demo
# E1/E2/E3 — the size seam (exact):
wc -l app/App.vue \
      @/components/custom/orbital-drag/composables/useOrbitalPointer.ts \
      @/components/custom/EasingCurveCanvas.vue

# E1 — the three concerns are present in App.vue:
grep -n "saveCurrentPlaybackState\|restoreGroupPlaybackState" app/App.vue   # playback-snapshot
grep -n "sceneSwapSpring\|sceneSwapStyle\|SpringProgress"      app/App.vue   # scene-swap-spring
grep -n "switchScene\|sceneRef.value?.animationGroup"          app/App.vue   # route orchestration

# E2 — input-plumbing vs transform-logic both live in useOrbitalPointer:
grep -n "onPointerDown\|handleWheel\|removeDocListeners"  @/components/custom/orbital-drag/composables/useOrbitalPointer.ts
grep -n "updateLinearTransform\|updateTranslation\|updateScale\|handleAxisSpecificInput" @/components/custom/orbital-drag/composables/useOrbitalPointer.ts
# the transform fns are re-exported to the sibling gesture composables:
grep -n "pointer.updateTranslation\|pointer.updateScale\|pointer.updateLinearTransform" @/components/custom/orbital-drag/OrbitalDrag.vue

# E3 — EasingCurveCanvas is used twice (reusable, cohesive):
grep -rln "EasingCurveCanvas" @ demo --include="*.vue" | grep -v node_modules

# E4 — composable dirs hold only useX modules + the re-homed pure utils elsewhere:
find @ -path "*composables*" -name "*.ts" | grep -v node_modules | grep -vE '/use[A-Z]'

# E6 — the stores split:
ls @/components/custom/animation-controls/stores/

# E9 — directory grouping (concern dirs, file counts):
for d in @/components/custom/*/; do echo "$d: $(find "$d" -type f | wc -l) files"; done
```

**Hard gate for E.W1** — `proof:encapsulate`: a checked-in instrument asserting
(a) `wc -l app/App.vue` ≤ a declared ceiling (the thin entry-point shell after
the two lifts — measured, asserted, biting if exceeded); (b)
`usePlaybackSnapshot` + `useSceneSwap` exist and are imported from exactly one
parent (`App.vue`), with App.vue carrying no `interpFrames`/`SpringProgress` body
(the snapshot + spring plumbing moved out — grep = 0); (c)
`wc -l useOrbitalPointer.ts` ≤ its ceiling and `grep -E
'updateLinearTransform|categoryBounds' useOrbitalPointer.ts` = 0 (the
transform-application + bounds-clamp left the input composable); (d) `npm test`
green pre/post (zero behaviour change). Bite: fold the playback snapshot back
into App.vue → (b) reds; leave `updateLinearTransform` in the pointer composable
→ (c) reds. `EasingCurveCanvas.vue` is explicitly OUT of the gate — it is
documented LEAVE, not a target.
