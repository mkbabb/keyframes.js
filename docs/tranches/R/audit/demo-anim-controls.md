# Tranche R — Lane: demo-anim-controls
## Audit evidence: `demo/@/components/custom/animation-controls/**`

Date: 2026-06-24  
Auditor: Tranche R subagent (claude-sonnet-4-6)

---

## 1. Structural overview

The subtree contains **70 source files** (`.vue` + `.ts`) across 15 directories, totalling ~9,964 lines.  The four files called out by the audit prompt are all at or below but close to the 500-line threshold:

| File | Lines |
|------|-------|
| `ControlsPaneWrapper.vue` | 499 |
| `AnimationControlsGroup.vue` | 498 |
| `TransportDock.vue` | 484 |
| `AnimationControls.vue` | 445 |

None formally exceeds 500 lines, but three are within 1-16 lines of the limit after commentary-heavy extraction passes.  The audit must assess whether those comment blocks are concealing structural debt.

### Directory tree

```
animation-controls/
  AnimationControlsGroup.vue          # root orchestrator
  TransportDock.vue                   # bottom transport dock
  animationDescriptions.ts            # lookup tables + 2 pure functions
  injectionKeys.ts
  index.ts                            # barrel (intentionally empty for lazy-load)
  components/
    ControlsPaneWrapper.vue           # sheet + rail host
    DemoGlobalChrome.vue              # SVG defs + Toaster teleport
    RibbonBar.vue
    SheetGrabHandle.vue
  composables/                        # 9 composables
  controls/
    AnimationControls.vue             # tab panel host
    AnimationControlsControls.vue     # animation options form
    AnimationVisualizer.vue
    LayerConfigPanel.vue
    PlaybackRibbon.vue
    TimingFunctionPanel.vue
    composables/                      # 7 composables
    playback-button.css
    tab-trigger.css
    timingCurveUtils.ts
  keyframes/                          # keyframes editor sub-module
    components/
    composables/
    monaco-themes/
    utils/
  stores/                             # 7 store-layer files
  timeline/                           # timeline sub-module
    components/
    composables/
    utils/
```

---

## 2. Findings

### F-1 — CRITICAL: Callback functions passed as props to ControlsPaneWrapper

**Category:** encapsulation / api-surface  
**Severity:** high

`AnimationControlsGroup.vue` passes five callback functions as props to `ControlsPaneWrapper`:

```vue
<!-- AnimationControlsGroup.vue lines 26-30 -->
:on-panel-transition-end="onPanelTransitionEnd"
:on-sheet-settled="onSheetSettled"
:on-pane-mouse-enter="onPaneMouseEnter"
:on-pane-mouse-leave="onPaneMouseLeave"
:set-pane-el="(el) => { controlsPaneEl = el; }"
```

These are declared in `ControlsPaneWrapper` props as:

```ts
// ControlsPaneWrapper.vue lines 156–165
onPanelTransitionEnd: (e: TransitionEvent) => void;
onSheetSettled: (settled: boolean) => void;
onPaneMouseEnter: () => void;
onPaneMouseLeave: () => void;
setPaneEl: (el: HTMLElement | null) => void;
```

This is the wrong Vue idiom. Vue's event system exists for child→parent communication. Passing callbacks as props creates invisible reverse data flow (props flow down, callbacks fire back up), defeats Vue DevTools event tracing, and creates a bidirectional coupling that makes both files hard to reason about independently. The only exception (`:set-pane-el`) is especially problematic: it passes a setter that writes a ref owned by the parent, i.e. it is effectively an upward ref-teleport disguised as a prop.

**Proposal:** Replace all five with `defineEmits` events fired by `ControlsPaneWrapper`:
- `@transitionend` already fires on the element — convert `onPanelTransitionEnd` to an emitted `"panel-transition-end"` event.
- `onSheetSettled` → emitted `"sheet-settled"` event.
- `onPaneMouseEnter`/`onPaneMouseLeave` → emitted `"pane-mouseenter"` / `"pane-mouseleave"`.
- `:set-pane-el` → `defineExpose({ paneEl })` on `ControlsPaneWrapper` + `useTemplateRef` in the parent.

This also unblocks removing the 8 redundant props from `ControlsPaneWrapper`'s `defineProps` definition (lines 138–170), which is currently a 33-line block that is roughly half layout-lifecycle callbacks.

---

### F-2 — HIGH: ControlsPaneWrapper bloat caused by pass-through layout state

**Category:** decomposition  
**Severity:** high

`ControlsPaneWrapper` at 499 lines accepts the full layout-reactivity payload computed by `useControlsLayout` as PROPS from its parent:

```ts
// ControlsPaneWrapper.vue props lines 148–165 (8 props)
isPanelTransitionDone: boolean;
isPaneHovered: boolean;
isPaneIdle: boolean;
scrollFadeClass: string;
onPanelTransitionEnd: (e: TransitionEvent) => void;
onSheetSettled: (settled: boolean) => void;
onPaneMouseEnter: () => void;
onPaneMouseLeave: () => void;
setPaneEl: (el: HTMLElement | null) => void;
```

These are exclusively layout concerns owned by `useControlsLayout` (which runs in `AnimationControlsGroup`) and are piped down purely so `ControlsPaneWrapper` can wire them to its own template elements. This is prop-drilling in a 2-level structure where there is no intervening consumer — the only reason they exist as props is because `useControlsLayout` was kept in the parent.

`ControlsPaneWrapper` has a clearly cohesive job (the sheet + rail host) and owns `useSheetState` + `usePaneRegister`. `useControlsLayout` should be moved DOWN into `ControlsPaneWrapper`; the element ref `controlsPaneEl` should be declared there. This removes 8 props, collapses the prop-drilling chain, and frees ~80 lines from both files while making `ControlsPaneWrapper` more self-contained.

After the fix, `AnimationControlsGroup` calls `useControlsLayout` only to receive the `scrollFadeClass` (the outer-element scroll fade); but the scroll fade is on the INNER `.controls-pane` element inside `ControlsPaneWrapper`, so the ref lives there. Moving `useControlsLayout` entirely into `ControlsPaneWrapper` eliminates all 8 props and the entire prop-drilling path.

---

### F-3 — HIGH: TransportDock module-level mutable singletons

**Category:** encapsulation  
**Severity:** high

`TransportDock.vue` constructs two `CSSKeyframesAnimation` instances and a mutable `menubarPeak` counter at `<script setup>` scope (effectively component-instance scope, not module scope, since SFC `<script setup>` runs per instance — but only ONE instance of `TransportDock` ever exists):

```ts
// TransportDock.vue lines 278, 348, 416–433
let menubarPeak = 0;
let pointerHandled = false;

const resetSpinAnim = new CSSKeyframesAnimation({ duration: 400, timingFunction: "easeOutCubic" })
    .fromString(`@keyframes twist { … }`);

const trashShakeAnim = new CSSKeyframesAnimation({ duration: 400, timingFunction: "easeInOutCubic" })
    .fromString(`@keyframes shake { … }`);
```

The two icon animations are constructed inline from raw `@keyframes` CSS string literals. This is a workaround: it couples imperative animation construction to a presentational component that should not own engine objects. The shake/spin are purely presentational micro-interactions with no semantic relationship to the `AnimationGroup` the dock controls. They should be extracted to a colocated `useIconAnimations.ts` composable or (even better) handled via CSS `@keyframes` + a toggle class, which keeps the engine out of the dock entirely.

Additionally, the `let pointerHandled = false` mutable boolean at setup scope is a signal-state workaround for the GlassDock collapse-crossfade STRAND problem. The comment at line 321 explicitly states "RF-17 stays a glass-ui handoff." This is a recorded workaround that must be excised when the glass-ui fix lands — the explicit note should be converted to a `// TODO(RF-17)` tagged comment (or better, a thrown Error guarded on a feature flag) so it doesn't silently remain.

**Proposal:** Extract `useIconAnimations()` composable. Move the two animations and their `resetIconSpin`/`trashIconShake` methods there. Consider replacing with pure CSS `@keyframes` + class toggle to remove engine dependency from the dock entirely.

---

### F-4 — HIGH: AnimationControlsGroup near 500-line threshold — CSS inflation

**Category:** decomposition  
**Severity:** high

`AnimationControlsGroup.vue` is 498 lines: 280 lines of `<script setup>` + 218 lines of `<style scoped>`. The script is well-decomposed by the K.WZ composable-extraction passes. However, the `<style scoped>` is 218 lines of dense layout CSS with inline comment documentation that belongs in a colocated `.css` file or design-idioms layer.

The CSS in this file covers:
- The named `rail·stage·grid` (lines 282–331)
- `controls-layout--closed` / `--railless` track-collapse (lines 338–343)
- Stage-cell dock-safe `padding-block` primitive (lines 363–367)
- Mobile full-bleed stage overlay (lines 388–459)
- Desktop named-track item placements via `@container` (lines 471–497)

The grid layout and container query definitions are tightly coupled to the component's role and cannot be easily separated, but the extensive inline documentation converts what should be 40–60 lines of CSS into 218 lines. This is documentation-as-code-inflation. Each block of CSS is accompanied by 5–25 lines of historical-decision justification that belongs in architecture docs, not scoped styles.

**Proposal:** Strip all inline narrative comments from `<style scoped>` down to brief intent labels (`/* rail track collapse */`, `/* mobile overlay */`). Move historical decision justifications to `docs/tranches/`. This alone brings the file under 350 lines.

---

### F-5 — HIGH: `storedControls: any` in `useAnimationGroupPlayback`

**Category:** brittleness  
**Severity:** high

`useAnimationGroupPlayback.ts` line 16:

```ts
export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: any,   // ← typed `any` with a recorded book note
    emit: AnimationGroupPlaybackEmit,
)
```

The file comment at lines 7–8 explicitly acknowledges this:

> `The storedControls: any` half stays a recorded BOOK — it does not change the writer count and is not the cure.

This is a recorded workaround masquerading as a "booked" item. The correct type is `StoredAnimationGroupControlOptions` (already imported in the callsite file). The `any` propagates to every `.selectedAnimation` / `.selectedControl` write in the composable with no compile-time safety. There is no reason it cannot be typed today.

**Proposal:** Replace `storedControls: any` with `storedControls: StoredAnimationGroupControlOptions`. Remove the book-note comment.

---

### F-6 — MEDIUM: `_storeTimestamp` sentinel mixed into store value type

**Category:** workaround / api-surface  
**Severity:** medium

Both `animationOptionsStore.ts` and `controlOptionsStore.ts` use a discriminated-union type pattern where the timestamp is mixed INTO the payload type:

```ts
// animationOptionsStore.ts lines 29–31
export type StoredAnimationGroupsOptions = {
    _storeTimestamp?: number;
    [name: string]: StoredAnimationGroupOptions | number | undefined;
};
```

The `_storeTimestamp?: number` field is a TTL sentinel mixed into the same object as the keyed animation data. This forces every consumer to either ignore or cast around the sentinel field (the destructuring at `hashSharing.ts` line 22: `const { _storeTimestamp: _1, ...options } = …`). It also makes the index signature `StoredAnimationGroupOptions | number | undefined` — weakening all keyed reads to a union that requires runtime narrowing.

This is a workaround for not having a proper store envelope type. The TTL sentinel should live in a separate wrapper:

```ts
interface StoredEnvelope<T> {
    _storeTimestamp: number;
    data: T;
}
```

And the keyed animations live in `data: Record<string, StoredAnimationOptions>` with a clean `Record<string, StoredAnimationOptions>` index type (no `number | undefined` union bleed).

**Proposal:** Introduce `StoredEnvelope<T>` wrapper type. Separate the timestamp from the keyed data. Update `checkAndResetExpiredStore` accordingly.

---

### F-7 — MEDIUM: `animationDescriptions.ts` mixes unrelated description tables

**Category:** god-module (mini-god)  
**Severity:** medium

`animationDescriptions.ts` (131 lines) is a catch-all for multiple distinct concern groups:

1. Animation playback descriptions (`DIRECTION_DESCRIPTIONS`, `FILL_MODE_DESCRIPTIONS`) — used by `AnimationControlsControls.vue`
2. Timing function data (`TIMING_DESCRIPTIONS`, `NAMED_EASING_BEZIER`, `DETAIL_TIMING_FUNCTIONS`, `timingFunctionKind`, `isDetailTimingFunction`) — used by `useTimingFunctionEditor`
3. Interpolation/blending option descriptions (`COLOR_SPACE_DESCRIPTIONS`, `HUE_METHOD_DESCRIPTIONS`, `BLEND_MODE_DESCRIPTIONS`) — used by `LayerConfigPanel`

The timing-function group (items 2) would be more cohesive colocated with `timingCurveUtils.ts` (inside `controls/`) as a single `controls/timingFunctionData.ts`. The playback descriptions belong closer to the controls component that uses them. The blending descriptions belong with `LayerConfigPanel`.

Also: `TIMING_DESCRIPTIONS` has two entries for the same curve:

```ts
// animationDescriptions.ts lines 46-47
"smooth-step3": "hermite interpolation",
"smooth-step-3": "hermite interpolation",
```

This exact duplicate exists because the camel-to-hyphen conversion of the engine's `smoothStep3` can produce either spelling. The correct fix is to have ONE canonical entry and normalize the key on lookup — not two identical entries.

**Proposal:** Split `animationDescriptions.ts` into `controls/timingFunctionData.ts` (timing descriptions + NAMED_EASING_BEZIER + utilities) and keep the playback/blending descriptions in a renamed `controls/animationOptionData.ts`. Remove the duplicate `smooth-step3`/`smooth-step-3` entry, add a key normalizer.

---

### F-8 — MEDIUM: `controlSurfaceDFA.ts` has a silent fallback for unknown scenes

**Category:** fallback  
**Severity:** medium

`controlSurfacesFor` at line 115 silently falls back to `BUILT_IN_SURFACES` for any unknown scene id:

```ts
// controlSurfaceDFA.ts lines 113-116
export function controlSurfacesFor(sceneId: SceneId): ControlSurface[] {
    const set = CONTROL_SURFACES[sceneId];
    return set ? [...set] : [...BUILT_IN_SURFACES];  // ← silent fallback
}
```

The comment calls this "the conservative default: a never-seen scene gets the standard editor, never an undefined set." This is benign-graceful — exactly the behavior the precepts say must be EXCISED or made EXPLICIT with a failure. An unregistered scene silently getting the full editor triad hides registration gaps. The navigation-matrix gate (`proof:scene-control-dfa`) relies on totality, but the totality is achieved by silently inflating the set, not by asserting that every scene in the app is registered.

**Proposal:** Replace the silent fallback with `console.error` + `throw new Error(\`controlSurfacesFor: unregistered sceneId "${sceneId}"\`)` in development, or at minimum: `if (import.meta.env.DEV && !set) console.error(…)` while keeping the fallback only for production. The registered scene set is finite and known at build time — an unknown id is always a bug.

---

### F-9 — MEDIUM: `parseAnimationCSS.ts` "legacy shape" comment is a misnomer

**Category:** legacy  
**Severity:** low

`keyframes/utils/parseAnimationCSS.ts` line 12:

```ts
/**
 * Produces the legacy `{ keyframes, options, values }` shape from value.js's
 * Stylesheet AST.
 */
```

The word "legacy" in the docstring implies this shape will be superseded, but there is no migration path documented, no replacement shape indicated, and no TODO. If this shape IS the current interface, calling it "legacy" is misleading noise. If it WILL be replaced, there needs to be an explicit tracking item.

**Proposal:** Either remove the word "legacy" from the docstring (the shape is the current interface), or add `// TODO(Tranche-R): migrate to <NewShape> when X ships` with a concrete tracking reference.

---

### F-10 — LOW: `usePlaybackToggle.ts` is a trivially thin wrapper

**Category:** dry / decomposition  
**Severity:** low

`controls/composables/usePlaybackToggle.ts` (37 lines) wraps exactly two functions:

```ts
// usePlaybackToggle.ts lines 27-36
const toggleReverse = () => {
    getAnimation().reverse();
    userReversed.value = !userReversed.value;
};

const toggleAnimation = () => {
    emitTogglePlay();  // literally a passthrough
};
```

`toggleAnimation` is a 1-line passthrough that adds no value. `userReversed` is the one genuine reactive state piece, but it is a single `ref(false)` + one flip. This composable could be inlined into `AnimationControlsControls.vue` at zero cost — it currently makes the controls file import a composable for 3 trivial lines.

**Proposal:** Inline the reverse state directly into `AnimationControlsControls.vue`. Delete `usePlaybackToggle.ts`. This reduces the composable count by 1 and removes one import hop.

---

### F-11 — LOW: `controls/composables/` sub-directory creates `controls/controls/` implied nesting

**Category:** decomposition  
**Severity:** low

The path `controls/composables/` nests a `composables/` directory inside `controls/`, creating:

```
controls/AnimationControls.vue
controls/composables/useAnimationSync.ts
controls/composables/useSelectedControlSurface.ts
…
```

This is a legitimate pattern for a sub-module but creates a naming collision: `animation-controls/composables/` (top-level) and `animation-controls/controls/composables/` (nested) exist simultaneously. A reader scanning `import … from '../composables/useRafLoop'` vs `import … from './composables/useAnimationSync'` inside `controls/*.vue` must track which composables level they are in.

The controls-scoped composables (`useAnimationSync`, `usePlaybackToggle`, `useDragCapture`, `useKeyframesPaneReveal`, `useSelectedControlSurface`, `useTabStripScroll`, `useTimingFunctionEditor`) are all genuinely scoped to the `controls/` panel layer and correctly belong there. The naming confusion is the only issue.

**Proposal:** No structural move needed; document the boundary explicitly in `controls/composables/README.ts` (or a comment at the top of `AnimationControls.vue`): "composables here are scoped to the controls panel; top-level composables are scoped to the AnimationControlsGroup."

---

### F-12 — LOW: `_resetAnimationGroupsOptionsStore` / `_resetAnimationGroupsControlOptionsStore` are exported but not re-exported from `stores/index.ts`

**Category:** api-surface  
**Severity:** low

`animationOptionsStore.ts:117` and `controlOptionsStore.ts:71` export `_reset*` functions with the leading `_` convention indicating internal use. These are imported DIRECTLY by `stores/index.ts` (lines 72–73) and wired into `resetAllStores()` — but they are NOT re-exported from the barrel:

```ts
// stores/index.ts lines 72-80
import { _resetAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { _resetAnimationGroupsControlOptionsStore } from "./controlOptionsStore";
// …
export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
```

This is correct — the internal `_reset*` functions should NOT be re-exported, and the barrel correctly exposes only `resetAllStores`. The naming convention is fine. However, the `export const _resetAnimationGroupsOptionsStore` declaration on the module itself means any direct importer of `animationOptionsStore.ts` (bypassing the barrel) could call them. Since the precepts forbid silent internal surfaces, the functions should be unexported from their home files and instead called via a module-internal reference. But since no bypass import exists in the codebase, this is low priority.

---

## 3. Architecture verdict

The subtree is **well-decomposed in its domain logic** (stores, composables, timeline/keyframes sub-modules) but carries **structural debt in the component boundary layer**:

1. The parent→child callback-as-prop anti-pattern (F-1 + F-2) is the most actionable fix: it affects both the 498-line and 499-line files and would bring both clearly under 400 lines with no loss of functionality.

2. The 500-line files are NOT inflated by logic — they are inflated by inline architecture commentary in `<style scoped>` (F-4) and by the prop-drilling payload imposed by the composable ownership decision (F-1, F-2).

3. The `stores/` sub-directory is well-structured: `sceneMachine.ts` (pure reducer), `useSceneMachine.ts` (reactive effect layer), `controlSurfaceDFA.ts` (pure DFA) are properly separated. The barrel `stores/index.ts` is clean. The one fix needed there is the `_storeTimestamp` type mixing (F-6) and the silent fallback (F-8).

4. The `controls/composables/` layer is well-scoped. The only over-fine composable is `usePlaybackToggle` (F-10).

5. No test files in `src/`. No nested imports. No `require()`. The codebase adheres to ES module conventions throughout.

### What is NOT over-engineered (precept check)

The 5-directory structure (`components/`, `composables/`, `controls/`, `keyframes/`, `timeline/`) is NOT contrivance — each directory has a coherent domain:
- `components/` — layout primitives (wrapper, ribbon, handle)
- `composables/` — group-level reactive logic (playback, layout, sheet, scroll)
- `controls/` — per-animation panel (options form, visualizer, timing editor)
- `keyframes/` — Monaco-heavy CSS editor sub-system
- `timeline/` — timeline editor sub-system

The `controls/composables/` nesting (F-11) is the only borderline case, and it is correct by cohesion even if confusing by name proximity.
