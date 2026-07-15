# Lane 17 — demo-instrument-transport

**Fleet:** Tranche U development audit (32 lanes) · **Scope:**
`demo/@/components/custom/instrument/transport/` (36 files, 5,648 LOC of .vue/.ts/.css).
**Discipline:** read-only; evidence is `file:line` read from the live tree.

---

## Headline

The transport facility is a **three-drawer pile (top-level SFCs · `components/` ·
`controls/` · a flat 18-file `composables/`) that inverts the recursive-colocation
edict**: nearly every composable is single-component-private yet lives in a shared
flat drawer because it was extracted to satisfy a *line-count* gate
(`proof:demo-no-oversize`), not for cohesion — and the very gate meant to catch this
(`proof:colocation`) is GREEN only because the violations are parked in a TOLERANT
`DEFERRED` list, the exact "honest defer" device U terminates.

---

## The real dependency graph (verified — comment-refs excluded)

Every "cross-boundary consumer" flagged by a bare grep was checked against the actual
`import` line. The genuine graph is TIGHT and almost entirely single-owner:

| Composable | REAL consumers (imports) | True scope |
|---|---|---|
| `useAnimationGroupPlayback` | AnimationControlsGroup.vue | ACG-private |
| `useAnimationGroupActions` | AnimationControlsGroup.vue | ACG-private |
| `useAnimationProgress` | AnimationControlsGroup.vue | ACG-private |
| `useControlsKeyboardShortcuts` | AnimationControlsGroup.vue | ACG-private |
| `useControlsLayout` | ControlsPaneWrapper.vue | CPW-private |
| `usePaneRegister` | ControlsPaneWrapper.vue | CPW-private |
| `usePaneHover` | useControlsLayout.ts | sub-helper of useControlsLayout |
| `useSelectedControlSurface` | AnimationControls.vue | AC-private |
| `useKeyframesPaneReveal` | AnimationControls.vue | AC-private |
| `useTabStripScroll` | AnimationControls.vue | AC-private |
| `useKfPillTabs` | KfPillTabs.vue | KfPillTabs-private |
| `usePlayActuation` | TransportDock.vue | TD-private |
| `useAnimationSync` | AnimationControlsControls.vue | ACCtrls-private |
| `usePlaybackToggle` | AnimationControlsControls.vue | ACCtrls-private |
| `useTimingFunctionEditor` | AnimationControlsControls.vue | ACCtrls-private |
| `useScrollFade` | useControlsLayout, useTabStripScroll, AnimationControls | **genuinely shared (3)** |
| `useDragCapture` | AnimationVisualizer, PlaybackRibbon | **shared (2)** |
| `useRafLoop` | useAnimationProgress, AnimationVisualizer | **shared (2)** |

15 of 18 are single-owner. Only `useScrollFade`, `useDragCapture`, `useRafLoop` earn a
shared seat — and all three are *generic demo utilities* (overflow-fade, pointer-capture,
rAF skin), so their home is `@/composables/`, not a transport drawer.
(square's `useSquareDemo.ts:462`, `gestureSelectSuppression.ts:7`, App/EditorShell
mentions are all doc-comments, not imports — verified.)

---

## Findings

### 1 [CRITICAL · colocation] The flat `composables/` drawer is the anti-pattern U forbids; T.F6 flattened it for a line-count gate
`transport/composables/` holds 18 files with **no barrel** (`ls …/composables/index.ts`
→ absent) — a bare-import drawer. CLAUDE.md records the cause: "the flattened one-tier
composables home (T.F6 killed the double-nested `controls/composables/`)". The
extraction rationale is stamped on almost every file — `useAnimationGroupActions.ts:31`,
`useSelectedControlSurface.ts:28`, `useKeyframesPaneReveal.ts:39`, `useTabStripScroll.ts:20`,
`usePaneRegister.ts:22` all read *"lifted out as a colocated composable (the K.WZ
**proof:demo-no-oversize** seam; zero behavior change)"*. These composables exist as
separate files to keep a `.vue` under a line ceiling, then were dumped in ONE flat
drawer — the precise inversion of "components colocate their private composables;
`composables/` dirs only for true module-level members" (ORIGINAL-PROMPT.md §3).
**Evidence:** `transport/composables/` (18 files); `proof:demo-no-oversize` is a live
gate (`package.json:170`).
**Proposal:** dissolve the drawer. Each single-owner composable moves INTO its owner's
module directory (table above). The three genuine module-level utilities
(`useScrollFade`/`useDragCapture`/`useRafLoop`) hoist to `@/composables/` (demo-shared),
where their ≥2-area consumer count actually earns the seat. The `proof:demo-no-oversize`
line-ceiling gate is retired as a CI-trim casualty — a `.vue`'s length is not a defect,
a mis-homed composable is; `proof:colocation` (below) is the real authority.

### 2 [CRITICAL · deferred-device] `proof:colocation` stays GREEN by parking these violations in a TOLERANT `DEFERRED` list — the device U kills
`proof:colocation` (T.F21, "THE GRAND COLOCATION EDICT keystone") declares itself the
standing rule, then defuses itself: *"the pre-edict move waves (T.F13 leaf re-homing,
T.F16 KfPillTabs de-vanity, …) physically relocate the residual violations … named in
DEFERRED so it is honestly-backlogged (mergeable-GREEN). A DEFERRED entry is TOLERANT:
it passes whether the violation is still present (deferred) OR already cured"*
(`scripts/proof-colocation.mjs:31-40`). So the flat transport drawer, KfPillTabs's
vanity home, etc. are all GREEN-because-deferred. U's binding reading #2 ("NO MORE
DEFERRALS — the honest-defer device is terminated for U's scope") makes this
inadmissible.
**Evidence:** `scripts/proof-colocation.mjs:26-40` (the DEFERRED-tolerant clause).
**Proposal:** U charters the physical relocation waves (T.F13/T.F16 et al.) so the
DEFERRED list empties; the gate's tolerant branch is deleted so a residual flat
satellite reds HARD. This is one instance of the standing lesson (MEMORY gate-blindspot):
a green source-shape gate that tolerates its own backlog certifies a tree the owner
rejects on sight.

### 3 [MAJOR · colocation] `components/` vs `controls/` is a meaningless split — both are just "sub-components"
`transport/components/` holds ControlsPaneWrapper + RibbonBar + DemoGlobalChrome;
`transport/controls/` holds AnimationControls + AnimationControlsControls +
AnimationVisualizer + LayerConfigPanel + PlaybackRibbon + TimingFunctionPanel. Neither
has a barrel. The names encode nothing about the render tree: the true hierarchy is
AnimationControlsGroup → ControlsPaneWrapper → AnimationControls →
AnimationControlsControls → {TimingFunctionPanel, PlaybackRibbon → AnimationVisualizer,
LayerConfigPanel}. RibbonBar renders INSIDE ControlsPaneWrapper's shared pane body
(`ControlsPaneWrapper.vue:90`), yet sits in the flat `components/` peer bag.
**Evidence:** import graph across `ControlsPaneWrapper.vue:169-171`, `AnimationControls.vue:252-256`,
`AnimationControlsControls.vue:256-258`.
**Proposal:** both dirs dissolve into per-parent module dirs (target tree below). Each
parent owns a directory containing its `.vue`, its scoped `.css`, its private
composables, and a `children/` (or nested module dirs) for its sub-components. RibbonBar
colocates under ControlsPaneWrapper; TimingFunctionPanel/LayerConfigPanel under the
controls-body module.

### 4 [MAJOR · tangle] Shared widgets/data are buried in `transport/`, producing a bidirectional transport↔easing dependency and a six-level `../` climb
The easing scene reaches DEEP into transport for leaf widgets and data:
`scenes/easing/EasingScene.vue:10` imports `transport/controls/PlaybackRibbon.vue`;
`scenes/easing/useEasingDemo.ts:19-20` + `EasingTarget.vue:123` import
`transport/controls/timingCurveUtils.ts`; `easingGroups.ts:5` + `useEasingDemo.ts:20`
import `transport/animationDescriptions.ts`. In the REVERSE direction transport reaches
into the scene: `AnimationControlsControls.vue:264` imports `EASING_GROUPS` from
`"../../../../../../scenes/easing/easingGroups"` — a **six-level `../` climb from a
control panel into a scene**. `TimingFunctionPanel.vue:52` also imports
`animationDescriptions`. So PlaybackRibbon, timingCurveUtils, animationDescriptions, and
easingGroups are all genuinely-shared vocabulary living on the wrong side of a boundary,
and transport and the easing scene import each other.
**Evidence:** the import lines above; `animationDescriptions.ts` exports 10
data/predicate members consumed on both sides.
**Proposal:** hoist the shared members to a neutral tier and invert the tangle:
`PlaybackRibbon`/`AnimationVisualizer` → a shared playback-widget module (they are the
"standard ribbon" every scene mounts — `proof:scene-uses-standard-ribbon` exists);
`animationDescriptions.ts` + `timingCurveUtils.ts` + the named-curve catalogue
`easingGroups` → `@/` shared reference-data (the easing vocabulary is not scene-private).
After the hoist, transport→scene and scene→transport-deep-path imports both vanish; both
sides depend on the shared tier only (a DAG, not a cycle).

### 5 [MAJOR · performance] Per-host `useAnimationSync` rAF loops + AnimationVisualizer's unconditional "always poll" — N independent pollers for one visible panel
Every mounted control host runs `useAnimationSync` (a `useRafFn` poll of the markRaw
animation) because `AnimationControlsControls` mounts for every host whose surface is
'controls' (`AnimationControls.vue:98`), and the hosts are hidden by `v-show`, not
`v-if` (`ControlsPaneWrapper.vue:49`) — so a group/facility with N channels spins N
sync loops, all awake during playback (`useAnimationSync.ts:40-70`; the settle-idle at
:65 only helps at rest). Separately, `AnimationVisualizer`'s sync loop is started
unconditionally and self-documents the cost: *"Always poll … The cost is one progress
calc + setBallProgress per frame"* with `startSync()` at `AnimationVisualizer.vue:238-250`
— no `isPlaying` guard (contrast `useAnimationProgress.ts:40` which DOES guard). Plus
`useAnimationProgress` reallocates a fresh `Record` and reassigns `.value` every frame
even when the on-screen dot (only visible in an OPEN select dropdown) is unchanged
(`useAnimationProgress.ts:18-38`). This is the grand-edict axis: many small rAF loops
where one shared ticker belongs.
**Evidence:** `useAnimationSync.ts:40`, `AnimationVisualizer.vue:236-250`,
`useAnimationProgress.ts:17-41`.
**Proposal:** ONE demo-level rAF ticker (a single `RAFPlayback` driver in `@/composables`)
that subscribers register frame callbacks with, gated globally on
`documentVisible && (anyPlaying || anyDragging)`. The markRaw→reactive bridge polls the
SELECTED animation only (the sole one whose `currentT` is displayed), not every hidden
host. AnimationVisualizer's ball-sync becomes a subscriber that unsubscribes at rest.
The "always poll" comment is the tell that the seam was never designed — it was
accreted per-composable.

### 6 [MAJOR · colocation/styles] Global side-effect CSS injected from transport controls but consumed by scenes — a fragile mount-order coupling
`PlaybackRibbon.vue:82` does `import "./playback-button.css"` and `AnimationControls.vue:214`
does `import "./tab-trigger.css"` — both are NON-scoped global sheets injected as a side
effect of a transport component mounting. Yet the `.btn-playback` / `.tab-trigger`
classes they define are consumed by `scenes/easing/EasingScene.vue`,
`scenes/spring/SpringScene.vue`, and `scenes/spring/StartingStyleTarget.vue`. A scene's
button is correctly styled ONLY if a transport control happened to mount first and inject
the sheet — an implicit ordering dependency with no declared edge.
**Evidence:** side-effect imports at `PlaybackRibbon.vue:82`, `AnimationControls.vue:214`;
cross-consumers found in easing/spring scene SFCs.
**Proposal:** shared idiom classes are `styles/` vocabulary, not a component's private
scoped sheet (`proof:colocation` CLAUSE (kind) says exactly this —
`scripts/proof-colocation.mjs:22-24`). Move `.btn-playback*` and `.tab-trigger*` into
`@/styles/design-idioms.css` (the single idiom layer the MEMORY design-system note
mandates); delete the two side-effect imports. Truly-private residue stays scoped in the
owning SFC.

### 7 [MAJOR · module-carve] TransportDock.vue (464L) carries two self-contained module concerns inline
Two cohesive engines live inline in the dock SFC: (a) the **menubar-height publisher** —
a `useResizeObserver` + `publish()` + monotonic peak high-water-mark that writes
`--menubar-measured-h`/`-peak` to `:root` and cleans up on unmount
(`TransportDock.vue:255-321`, ~65L with its own invariant); (b) the **reset-icon spin**
— a `CSSKeyframesAnimation` built from an inline `@keyframes` string + `resetIconSpin()`
+ `resolveEl` (`TransportDock.vue:398-434`). Neither is dock-layout markup; both are
liftable engines the "composable owns the engine, host holds refs" precedent
(`proof:composable-encapsulation`) already blesses.
**Evidence:** `TransportDock.vue:290-321`, `398-434`.
**Proposal:** carve `useMenubarMeasure.ts` and `useIconSpin.ts` colocated in the
TransportDock module; the SFC drops to ~330L of genuine dock composition. This is a
cohesion carve (extract a real concern), not a line-count carve — the opposite of the
finding-1 pathology.

### 8 [MINOR · colocation] DemoGlobalChrome (document-level singletons) is mis-homed inside transport
`components/DemoGlobalChrome.vue` renders the rainbow-gradient SVG `<defs>` paint-server
+ the vue-sonner `<Toaster>` teleported to `<html>`. Its own header says both *"resolve
against the DOCUMENT, not this layout grid"* (`DemoGlobalChrome.vue:1-7`). A document-level
global is precisely the "true global-level member" the edict routes OUT of a component
subtree — it does not belong three levels deep in `transport/components/`.
**Evidence:** `DemoGlobalChrome.vue:1-49`; instantiated once at `AnimationControlsGroup.vue:117`.
**Proposal:** hoist to an app/demo-global home (beside App shell chrome, or `@/`
document-singletons). The SVG paint-server registry and the toaster are demo-wide, not
transport-owned.

---

## Target tree (the recursive-colocation cure)

```
transport/
├── index.ts                       # barrel: AnimationControlsGroup (the sole public entry)
├── transportSource.ts             # module contract (TransportChannel) — stays module-level
├── injectionKeys.ts               # module injection keys — stays module-level
├── AnimationControlsGroup/
│   ├── AnimationControlsGroup.vue  +  AnimationControlsGroup.css
│   ├── useAnimationGroupPlayback.ts · useAnimationGroupActions.ts
│   ├── useAnimationProgress.ts     · useControlsKeyboardShortcuts.ts
│   ├── TransportDock/
│   │   ├── TransportDock.vue
│   │   ├── useMenubarMeasure.ts · useIconSpin.ts · usePlayActuation.ts
│   └── ControlsPaneWrapper/
│       ├── ControlsPaneWrapper.vue  +  ControlsPaneWrapper.css
│       ├── useControlsLayout.ts · usePaneHover.ts · usePaneRegister.ts
│       ├── RibbonBar.vue
│       └── AnimationControls/
│           ├── AnimationControls.vue
│           ├── useSelectedControlSurface.ts · useKeyframesPaneReveal.ts · useTabStripScroll.ts
│           ├── KfPillTabs.vue  +  useKfPillTabs.ts
│           └── controls-body/
│               ├── AnimationControlsControls.vue
│               ├── useAnimationSync.ts · usePlaybackToggle.ts · useTimingFunctionEditor.ts
│               └── LayerConfigPanel.vue        # TimingFunctionPanel → moves w/ EasingPicker seam
│
HOISTED OUT of transport (genuinely shared):
@/components/playback/                 # the "standard ribbon" every scene mounts
│   ├── PlaybackRibbon.vue · AnimationVisualizer.vue
@/composables/                         # ≥2-area demo utilities
│   ├── useScrollFade.ts · useDragCapture.ts · useRafLoop.ts (→ folded into the shared ticker)
│   └── useDemoTicker.ts               # the ONE rAF fan-out (finding 5)
@/styles/design-idioms.css            # ← .btn-playback* / .tab-trigger* (finding 6)
@/  (shared reference data)            # animationDescriptions · timingCurveUtils · easingGroups
@/ or app/ (document singletons)       # DemoGlobalChrome
```

DemoGlobalChrome and TimingFunctionPanel's EasingPicker seam are noted; the exact home
for shared reference-data vs `@/state` is a synthesis call.

---

## What U must charter

1. **Dissolve the flat `transport/composables/` drawer** — relocate all 15 single-owner
   composables into their owning component modules (finding 1 table); the target tree
   above is the shape.
2. **Terminate the `proof:colocation` DEFERRED-tolerant device** — empty the DEFERRED
   list by physically relocating every named violation, then delete the tolerant branch
   so a residual flat satellite reds HARD (U reading #2).
3. **Collapse `components/` and `controls/` into per-parent module directories** — each
   parent owns its `.vue` + scoped `.css` + private composables + child modules.
4. **Hoist the genuinely-shared members OUT of transport** — PlaybackRibbon/
   AnimationVisualizer → shared playback module; animationDescriptions/timingCurveUtils/
   easingGroups → shared reference-data; `useScrollFade`/`useDragCapture`/`useRafLoop`
   → `@/composables/`; and INVERT the six-level transport→scenes/easing import.
5. **Unify the rAF polling into ONE visibility-and-play-gated demo ticker** — kill the
   per-host `useAnimationSync` multiplicity and AnimationVisualizer's unconditional
   "always poll"; poll only the selected animation (grand performance edict).
6. **Move `.btn-playback*` / `.tab-trigger*` into `@/styles/design-idioms.css`** and
   delete the side-effect CSS imports that couple scene styling to transport mount order.
7. **Carve `useMenubarMeasure` + `useIconSpin` out of TransportDock.vue** (cohesion
   carve, not line-count) and re-home DemoGlobalChrome to a document-singleton tier.
8. **Retire `proof:demo-no-oversize`** as part of the CI trim — a `.vue`'s line count is
   not a defect and the gate manufactured the finding-1 orphan-composable drawer.
