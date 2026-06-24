# R.W6 — Demo brittleness · state · styling

**Phase:** IMPL (authorized when explicitly opened)
**Depends on:** R.W5 (scene fusion — several files move; R.W6 targets them at their post-fusion paths;
the brittleness fixes themselves are independent of the fusion and may land before or after, but the
wave spec canonically references post-fusion paths)

---

## 1. Scope

The demo carries a residual layer of brittleness, state-drift, and styling precept violations that
survived the earlier E.W2 + D.W3 hardening passes. This wave closes them in three bands:

**(a) vueuse residuals** — `DemoControlPoint.vue` raw window listeners (currently RED in
`proof:brittleness`); `SpringHeatmap.vue` raw `new ResizeObserver` + raw `new MutationObserver`
(the gate catches the RO; the MO is an untested gap this wave closes); `EasingTarget.vue`
per-frame `el.dataset.curve ?? ""` DOM string-parse in the hot-path painter.

**(b) animation-controls component boundary** — five callbacks passed as props into
`ControlsPaneWrapper` (the inverse-data-flow anti-pattern); the `shallowRef<any>(null)` scene
bridge replaced by a typed `SceneExposedApi` interface; `storedControls: any` in
`useAnimationGroupPlayback` typed properly.

**(c) state drift and styling** — the three state drift-points (`cubeTransformStore` bare `ref`,
`_timingFunctionsAnd` mutable singleton, dead `animationState` field); the `var(--z-content, N)` /
`var(--z-behind, N)` comma-defaults across all surviving scene files (EXCISE per the precept
rubric — no fallback on a guaranteed-present token); the `--spring-snappy` shadow alias.

The chronic-ledger items DM-1 (S2 `pointerHandled`) and DM-5 (S1 `aria-orientation undefined`)
land here: glass-ui-BC delete OR the contingency KILL fires in this wave — no 9th carry on DM-1.

---

## 2. Concrete work

### Band A — vueuse residuals

#### A.1 `DemoControlPoint.vue` — excise raw window listeners + raw element listener

**Evidence:** `demo-brittleness.md` Finding 1 (lines 30–76); `challenge-demo.md` C.4 (SOUND).
`proof:brittleness` is currently RED with exactly these five sites:

```
demo/@/components/custom/DemoControlPoint.vue:142  window.addEventListener("pointermove", onMove);
demo/@/components/custom/DemoControlPoint.vue:143  window.addEventListener("pointerup", release);
demo/@/components/custom/DemoControlPoint.vue:144  window.addEventListener("pointercancel", release);
demo/@/components/custom/DemoControlPoint.vue:247  handleEl.value?.addEventListener("pointerdown", onHandlePointerDown);
```

**1a — the per-drag window follow-loop (DemoControlPoint.vue lines 131–145):**

```ts
// BEFORE — raw window listeners, no onScopeDispose backstop (leak on mid-drag unmount)
window.addEventListener("pointermove", onMove);
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
```

EXCISE the three bare `window.addEventListener` calls. Replace: capture three `useEventListener`
stop-fns at pointerdown, call them from `release`, AND register an `onScopeDispose` backstop:

```ts
// AFTER — vueuse stop-fns, no leak
let stopMove: (() => void) | null = null;
let stopUp: (() => void) | null = null;
let stopCancel: (() => void) | null = null;

const release = () => {
    releaseSelectSuppression();
    emit("dragend");
    stopMove?.(); stopUp?.(); stopCancel?.();
    stopMove = stopUp = stopCancel = null;
};

// On pointerdown:
stopMove   = useEventListener(window, "pointermove",   onMove   ).stop;
stopUp     = useEventListener(window, "pointerup",     release  ).stop;
stopCancel = useEventListener(window, "pointercancel", release  ).stop;
onScopeDispose(() => { stopMove?.(); stopUp?.(); stopCancel?.(); });
```

**1b — the handle pointerdown listener (DemoControlPoint.vue lines 245–248, 274–278):**

```ts
// BEFORE — manual onMounted/onBeforeUnmount, removeEventListener keyed on nullable ref
onMounted(() => { handleEl.value?.addEventListener("pointerdown", onHandlePointerDown); });
onBeforeUnmount(() => { handleEl.value?.removeEventListener("pointerdown", onHandlePointerDown); });
```

EXCISE the `onMounted`/`onBeforeUnmount` attach-detach pair. Replace with:

```ts
useEventListener(handleEl, "pointerdown", onHandlePointerDown);
```

vueuse re-binds on ref swap; `tryOnScopeDispose` owns cleanup. The `onMounted`/`onBeforeUnmount`
pair is eliminated entirely.

> **Caution:** the `data-index` markup (`DemoControlPoint.vue:31-32`
> `<circle class="control-point handle" :data-index="index">`) is PRESENT and the
> `proof:easing-editor-live` gate selects it correctly. `challenge-demo.md` C.4 confirms the
> brittleness Finding 1 side-note that claimed "NO `data-index`" was a misread. Do NOT remove
> or touch the `:data-index` binding.

#### A.2 `SpringHeatmap.vue` — excise raw ResizeObserver + MutationObserver

**Evidence:** `demo-brittleness.md` Finding 2 (lines 79–116); `challenge-demo.md` C.5 (SOUND).
`proof:brittleness` currently catches the `new ResizeObserver` at `SpringHeatmap.vue:266`.
The `new MutationObserver` at line 272 is NOT yet in the gate's regex — this wave extends both.

```js
// BEFORE (SpringHeatmap.vue:260–283) — raw observers, typeof guards, hand-rolled teardown
let ro: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

onMounted(() => {
    paint();
    if (typeof ResizeObserver !== "undefined" && fieldEl.value) {
        ro = new ResizeObserver(() => paint());
        ro.observe(fieldEl.value);
    }
    if (typeof MutationObserver !== "undefined") {
        themeObserver = new MutationObserver(() => paint());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }
});

onScopeDispose(() => {
    ro?.disconnect();
    themeObserver?.disconnect();
});
```

**EXCISE both observers.** Replace:

- `new ResizeObserver` → `useResizeObserver(fieldEl, () => paint())` — drops the `typeof` guard,
  the `let ro`, and the `ro?.disconnect()` line. `useResizeObserver` is already imported elsewhere
  in the demo (`animation-controls/composables/useScrollFade.ts` is the canonical model).

- `new MutationObserver` watching `document.documentElement` class for dark-mode → **EXCISE
  entirely**. Replace with:

  ```ts
  import { useGlobalDark } from "@mkbabb/glass-ui/dark";
  const { isDark } = useGlobalDark();
  watch(isDark, paint);
  ```

  `useGlobalDark` is already imported in `demo/@/components/custom/useHighlightCSS.ts:64` — this
  is an in-tree precedent. Removes the global-document-root reach, the over-broad attribute-filter
  re-paint on ANY `<html>` class change, and both `typeof` fallback guards.

After these two excisions: `let ro`, `let themeObserver`, the `onMounted` block for both
observers, and the `onScopeDispose` teardown are all deleted. The `paint()` call in the original
`onMounted` body is preserved (it is the initial paint, unrelated to the observers).

#### A.3 `EasingTarget.vue` — owned snapshot in `wirePainter`, excise `el.dataset.curve ?? ""`

**Evidence:** `demo-brittleness.md` Finding 4c (lines 176–189); `challenge-demo.md` C.6 (SOUND).

```ts
// BEFORE (EasingTarget.vue:304) — per-frame DOM string-parse in hot painter
for (const el of balls) {
    const name = el.dataset.curve ?? "";       // ← silent "" fallback
    const isActive = name === activeName;
    el.style.transform = `translateX(${trackBallXAt(fnForCurve(name), isActive, phase)}px)`;
}
```

In `wirePainter` (called on `viewMode`/`visibleCurves` re-wire, lines 347-348), build an owned
`{ el: HTMLElement; fn: TimingFunction; curveName: string }[]` snapshot keyed to the same v-for
source the `trackBallEls` refs come from. The painter iterates the snapshot:

```ts
// AFTER — owned snapshot, no per-frame dataset read, no silent ?? "" fallback
type BallEntry = { el: HTMLElement; fn: TimingFunction; curveName: string };
let ballSnapshot: BallEntry[] = [];

function wirePainter() {
    ballSnapshot = trackBallEls.value.map((el, i) => ({
        el,
        curveName: visibleCurves.value[i].name,          // owned ref, not dataset
        fn: fnForCurve(visibleCurves.value[i].name),     // hoisted out of hot loop
    }));
}

// In the hot painter:
for (const { el, fn, curveName } of ballSnapshot) {
    const isActive = curveName === activeName;
    el.style.transform = `translateX(${trackBallXAt(fn, isActive, phase)}px)`;
}
```

EXCISE `el.dataset.curve ?? ""` entirely — missing attr no longer silently maps to an identity fn;
a wrong v-for index is a TS-visible build-time error. The imperative `el.style.transform` write is
**preserved** — it is the intended off-render-graph hot-path optimization, NOT brittleness.

---

### Band B — animation-controls component boundary

#### B.1 Five callbacks-as-props → `defineEmits` + `defineExpose`

**Evidence:** `demo-anim-controls.md` F-1 (lines 64–99); `challenge-demo.md` C.1 (SOUND).
Verified: `AnimationControlsGroup.vue:26-30` passes five fn-typed props;
`ControlsPaneWrapper.vue:39,156-165` declares them as `defineProps`.

**EXCISE the five callback props from `ControlsPaneWrapper.vue:156–165`:**

```ts
// BEFORE (ControlsPaneWrapper.vue props lines 156–165) — callbacks-as-props
onPanelTransitionEnd: (e: TransitionEvent) => void;
onSheetSettled: (settled: boolean) => void;
onPaneMouseEnter: () => void;
onPaneMouseLeave: () => void;
setPaneEl: (el: HTMLElement | null) => void;
```

Replace with `defineEmits` events on `ControlsPaneWrapper`:

```ts
// AFTER — child→parent via emits (idiomatic Vue)
const emit = defineEmits<{
    "panel-transition-end": [e: TransitionEvent];
    "sheet-settled": [settled: boolean];
    "pane-mouseenter": [];
    "pane-mouseleave": [];
}>();
```

For `:set-pane-el` (the ref-teleport): add `defineExpose({ paneEl })` on `ControlsPaneWrapper`
and use `useTemplateRef("controlsPane")` in `AnimationControlsGroup` to access the element
directly. Delete the `:ref="(el: any) => setPaneEl(el)"` ref-teleport prop at
`ControlsPaneWrapper.vue:39`.

In `AnimationControlsGroup.vue`: delete the five `:on-*` / `:set-pane-el` prop bindings (lines
26–30); replace with `@panel-transition-end` / `@sheet-settled` / `@pane-mouseenter` /
`@pane-mouseleave` event handlers + a `ref` to access `paneEl` via the exposed ref.

**Move `useControlsLayout` into `ControlsPaneWrapper`** (`demo-anim-controls.md` F-2): the eight
layout-state props (`isPanelTransitionDone`, `isPaneHovered`, `isPaneIdle`, `scrollFadeClass`,
and the four now-excised callbacks) are all `useControlsLayout`-owned. Move the composable call
down into `ControlsPaneWrapper`; the element ref `controlsPaneEl` declares there. This removes
the entire prop-drilling chain and frees ~80 lines from both files.

**Expected outcome:** both ~499L files drop under 400L.

#### B.2 Typed `SceneExposedApi` — excise `shallowRef<any>(null)`

**Evidence:** `challenge-demo.md` C.3 (the `any` typing is SOUND; the render-fn protocol STAYS);
`demo-anim-controls.md` F-5 (the `sceneRef: ShallowRef<any>` duck-typing chain).
Verified: `demo/app/App.vue:267` `const sceneRef = shallowRef<any>(null);`
`demo/app/useSceneMachineApp.ts:24` `sceneRef: ShallowRef<any>`.

Author a `SceneExposedApi` interface in a new `demo/app/sceneExposedApi.ts`:

```ts
export interface SceneExposedApi {
    /** The active AnimationGroup for the scene (or undefined if not set up yet). */
    animationGroup?: AnimationGroup<CSSKeyframesAnimation>;
    /** The scene's own ScenePlayback handle (optional, owned scenes only). */
    scenePlayback?: ScenePlayback;
    /** Render-fn slot projections (cross-sibling via defineExpose). */
    tabsContent?:   () => VNode;
    ribbonContent?: (slotProps: { selectedControl: string }) => VNode | null;
    headerLeft?:    () => VNode;
    /** The scene's superKey string (used by useSceneMachineApp for group-match). */
    superKey?: string;
    /** True if the scene auto-starts on mount. */
    autoPlays?: boolean;
    /** True if the scene is currently playing (read by useSceneMachineApp). */
    isPlaying?: boolean;
    /** True if the scene has started at least once. */
    isStarted?: boolean;
}
```

Replace `shallowRef<any>(null)` → `shallowRef<SceneExposedApi | null>(null)` in `App.vue:267`
and `useSceneMachineApp.ts:24`. The duck-typed `"isPlaying" in sceneRef.value` (line 214) and
`"isStarted" in sceneRef.value` (line 222) become typed property accesses against the interface.

> **The render-fn slot protocol (defineExpose + h()) STAYS** (`challenge-demo.md` C.3 / R.md §2).
> The `tabsContent`/`ribbonContent`/`headerLeft` render functions project scene content into
> sibling slot positions — this is the idiomatic cross-sibling teleport, not a workaround. Only
> the typing changes.

#### B.3 `storedControls: any` → proper type in `useAnimationGroupPlayback`

**Evidence:** `demo-anim-controls.md` F-5 (lines 178–199); `demo-composables-state.md` F7
(line 196–208). Verified: `useAnimationGroupPlayback.ts:16` `storedControls: any`.

```ts
// BEFORE
export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: any,   // recorded BOOK comment
    emit: AnimationGroupPlaybackEmit,
)

// AFTER
import type { StoredAnimationGroupControlOptions } from "../stores/animationOptionsStore";
export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: StoredAnimationGroupControlOptions,
    emit: AnimationGroupPlaybackEmit,
)
```

EXCISE the "recorded BOOK" comment. The correct type is already imported in adjacent callsite files.

---

### Band C — state drift + styling

#### C.1 `cubeTransformStore.ts` — bare `ref` → `createGlobalState`

**Evidence:** `demo-composables-state.md` Finding 9 (lines 246–265); `challenge-demo.md` D.5
(SOUND). Verified: `demo/app/cubeTransformStore.ts:9` `export const sharedCubeTransform = ref<TransformState>({…})`.

```ts
// BEFORE — bare module-level ref, resets on Vite HMR re-eval
export const sharedCubeTransform = ref<TransformState>({ rotate: …, translate: …, scale: …, matrix: mat4.create() });

// AFTER — createGlobalState, survives HMR, uniform with all other stores
export const useCubeTransform = createGlobalState(() =>
    ref<TransformState>({ rotate: …, translate: …, scale: …, matrix: mat4.create() })
);
```

Update all consumers: `sharedCubeTransform` → `useCubeTransform()`. The number of consumers is
small (search `sharedCubeTransform` in `demo/cube/`).

#### C.2 `_timingFunctionsAnd` mutable singleton → module-level `const`

**Evidence:** `demo-composables-state.md` Finding 10 (lines 267–294). Verified:
`demo/easing/useEasingDemo.ts:30–41` — mutable `let _timingFunctionsAnd: Record<string, any>` with
guarded init.

```ts
// BEFORE — mutable let + guarded init + any type
let _timingFunctionsAnd: Record<string, any> | undefined;
export function getTimingFunctionsAnd(): Record<string, any> {
    if (!_timingFunctionsAnd) {
        _timingFunctionsAnd = Object.fromEntries(…);
    }
    return _timingFunctionsAnd;
}

// AFTER — module-level const (synchronous pure derivation, no side-effects)
const timingFunctionsAnd: Record<string, TimingFunction | string> = Object.fromEntries(
    Object.entries({ "cubic-bezier": "cubic-bezier", ...timingFunctions })
        .map(([k, v]) => [camelCaseToHyphen(k), v])
);
export { timingFunctionsAnd };
```

EXCISE the `let` + guarded-init + `getTimingFunctionsAnd()` function. All callers at lines 55,
109, 144, 323, 381, 460 in `useEasingDemo.ts` import `timingFunctionsAnd` directly. The `any`
return type is replaced with the typed `Record<string, TimingFunction | string>`.

#### C.3 EXCISE dead `animationState` field from `StoredAnimationOptions`

**Evidence:** `demo-composables-state.md` Finding 5 (lines 150–170). Verified:
`demo/@/components/custom/animation-controls/stores/animationOptionsStore.ts:9–14`.
Grep confirms `animationState` is **never accessed by any file in the demo tree** outside its
definition — it is dead state from the pre-machine-era (the machine replaced it at H.W1).

```ts
// BEFORE — dead field persisting in localStorage via structuredClone
export type StoredAnimationOptions = {
    animationOptions: InputAnimationOptions;
    animationState: {        // ← EXCISE
        t: number;
        startTime: number;
        pauseTime: number;
        paused: boolean;
    };
    stepOptions: { … };
    cubicBezierOptions: { … };
};
```

DELETE `animationState` from the type AND from `defaultStoredAnimationOptions`. No callers to
update (zero reads confirmed).

#### C.4 EXCISE `var(--z-content, N)` / `var(--z-behind, N)` comma-defaults — fail-visible

**Evidence:** `demo-styling.md` F2/F3; `challenge-demo.md` D.1 + E.1 (the "normalise to the
contract value" proposal in F2/F3 IS ITSELF a precept violation — the correct move is EXCISE
the comma-default). Verified sites:

`var(--z-content, N)` **— EXCISE the comma-default, write `var(--z-content)`:**

| File | Line | Current fallback |
|---|---|---|
| `demo/easing/EasingHeroStage.vue` | 331 | `,2` |
| `demo/app/scenes/SquareScene.vue` (post-R.W5: `demo/scenes/square/SquareScene.vue`) | 377 | `,2` |
| `demo/amiga/AmigaTelemetry.vue` | 54 | `,2` |
| `demo/amiga/AmigaCrtOverlay.vue` | 39 | `,2` |
| `demo/spring/SpringTarget.vue` | 384 | `,3` |
| `demo/spring/SpringHeatmap.vue` | 330 | `,3` |
| `demo/@/components/custom/EasingCurveCanvas.vue` | 328 | `,2` |
| `demo/playground/App.vue` | 301 | `,1` |
| `demo/cube/CubeTarget.vue` | 438, 452, 493 | `,1` |
| `demo/square/SquareInstrument.vue` | 171, 193 | `,1` |
| `demo/@/.../AnimationControlsGroup.vue` | 418 | `,10` — also EXCISE |
| `demo/@/.../EditorStartScreen.vue` | 245 | `,10` — also EXCISE |

`var(--z-behind, N)` **— EXCISE the comma-default, write `var(--z-behind)`:**

| File | Line | Current fallback |
|---|---|---|
| `demo/app/scenes/SquareScene.vue` | 454 | `,-1` |
| `demo/cube/CubeTarget.vue` | 474 | `,-1` |
| `demo/cube/CubeTarget.vue` | 536 | `,-10` — also EXCISE |
| `demo/playground/App.vue` | 269 | `,0` |
| `demo/@/components/custom/EasingCurveCanvas.vue` | 318 | `,0` |

Per `challenge-demo.md` D.1 and R.md §2: `--z-content` and `--z-behind` are defined in
glass-ui's `scheme-motion.css` (a hard dependency, always loaded) AND `--z-behind` is also
defined locally in `design-idioms.css:245`. These tokens are reliably present — the comma-default
guards a never-occurring condition. A missing token must resolve to CSS `initial` (fail-visible),
not silently produce a wrong z-index.

> **Do NOT use the `z-content` Tailwind utility as a substitute** unless it is already present at
> that template site — the audit found none of these sites currently use the utility class. The
> fix is purely removing the fallback integer from the existing `var(--z-content)` call.

#### C.5 EXCISE `--spring-snappy` shadow alias

**Evidence:** `demo-styling.md` F1 (lines 7–21). Verified: `demo/@/styles/style.css:341`
`--spring-snappy: var(--spring-smooth)` silently clobbers glass-ui's own `--spring-snappy`
(overshoot-carrying curve) with `--spring-smooth` (calmer curve) — an unintentional global
token shadow. Single consumer: `AnimationControlsGroup.vue:331`.

EXCISE the `:root { --spring-snappy: var(--spring-smooth); }` declaration from `style.css:341`.
At the single call site (`AnimationControlsGroup.vue:331`), replace `var(--spring-snappy)` with
`var(--spring-smooth)` explicitly (the intent IS the calmer curve — per the audit comment). This
un-shadows glass-ui's own `--spring-snappy` token for all glass-ui components in the demo.

#### C.6 Chronic-ledger exits: DM-1 and DM-5

**Evidence:** `PROGRESS.md` chronic ledger; `demo-anim-controls.md` F-3 (lines 135–154).
Both are HARD STOP items — DM-1 is the 8th carry (P-invariant-28 forbids a 9th).

**DM-1 — `pointerHandled` + `onPlayPointerDown` (9 sites, 8th carry).**
Verified: `TransportDock.vue:342-373` — `let pointerHandled = false` mutable boolean; `onPlayPointerDown` at lines 358–373; wired at lines 151, 196.

**Primary path:** glass-ui-BC ships `DockDropdownTrigger` fix → delete `onPlayPointerDown` and
the `pointerHandled` boolean from `TransportDock.vue` + all 9 sites. `proof:workaround-deletion` S2 goes GREEN.

**Contingency KILL (if glass-ui-BC is not available at this wave's IMPL):** replace
`onPlayPointerDown` with a kf-internal pointer-clean play/pause handler that does not depend
on the glass-ui collapse-crossfade timing workaround. The band-aid is excised regardless; no
9th carry.

**DM-5 S1 — `aria-orientation: undefined` on `SpringSidebar.vue:43`.**
Verified: `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"`.

**Primary path:** glass-ui-BC ships `SegmentedTabs` `role=group` aria-guard → delete the
`:aria-orientation="undefined"` binding. `proof:workaround-deletion` S1 goes GREEN.

**Contingency KILL (if glass-ui-BC is not available):** replace the `<SegmentedTabs>` component
at this site with a kf-internal ARIA-compliant tab strip that does not require the suppress.
The band-aid is excised regardless; no silent re-book.

---

## 3. Born-RED gate

**Name:** `proof:brittleness` (EXTEND — assertion changes)

**Script:** `scripts/proof-brittleness.mjs` (existing gate — three assertion changes)

### Assertion change 1 — Clause 4 `LISTENER` regex: add `new MutationObserver`

`demo-brittleness.md` Finding 2 shows `SpringHeatmap.vue:272` `new MutationObserver(…)` is a
hand-rolled observer that must ride vueuse (`watch(isDark, paint)`) but is not currently in the
gate's regex. Extend:

```js
// BEFORE (proof-brittleness.mjs:377)
const LISTENER = /\.addEventListener\s*\(|new\s+ResizeObserver\b/;

// AFTER
const LISTENER = /\.addEventListener\s*\(|new\s+ResizeObserver\b|new\s+MutationObserver\b/;
```

The clause 4 description comment also updates to list `new MutationObserver`.

### Assertion change 2 — New clause 5: NO callbacks-as-props

Add clause 5 to `proof:brittleness`: scan all `ControlsPaneWrapper.vue` (or the general pattern
after the fix) for function-typed props that implement reverse data-flow:

```js
// Clause 5 — ZERO function-typed props that are callbacks (child→parent comm
// belongs in defineEmits, not fn-typed props). Pattern: a prop declared as a
// function type signature `(…) => void` in defineProps that is NOT a render
// slot function. The exact allowlist is the ControlsPaneWrapper post-fix state
// (zero fn-typed non-slot props).
//
// BITE: the five callbacks-as-props (onPanelTransitionEnd, onSheetSettled,
// onPaneMouseEnter, onPaneMouseLeave, setPaneEl) red this before B.1 lands.
```

Implementation: scan `demo/**/*.{vue,ts}` for the pattern
`/\b(?:on[A-Z]\w+|set[A-Z]\w+)\s*:\s*\([^)]*\)\s*=>\s*void/` in `defineProps` blocks; red on
any hit outside the documented prop-allowlist (initially empty after B.1).

### Assertion change 3 — New clause 6: NO `var(--guaranteed-token, fallback)`

Add clause 6: for the specific `--z-content` and `--z-behind` tokens (guaranteed present via
glass-ui hard dep + `design-idioms.css`), the gate catches any surviving `var(--z-content,`
or `var(--z-behind,` comma-default:

```js
// Clause 6 — NO comma-fallback on guaranteed design tokens (fail-visible rule).
// The z-index tokens --z-content and --z-behind are defined in BOTH glass-ui's
// scheme-motion.css AND demo/design-idioms.css — they are guaranteed present.
// A var(--z-content, N) comma-default guards a never-occurring condition and
// silently degrades instead of failing visibly. EXCISE the comma-default.
//
// BITE: the 16 `var(--z-content, N)` and 5 `var(--z-behind, N)` sites red this
// before C.4 lands; zero hits after.
const Z_GUARANTEED_COMMA = /var\(\s*--(z-content|z-behind)\s*,/;
```

**Plant test (what RED-state proves each assertion bites):**

- **Clause 4 extended (MutationObserver):** before A.2 lands, keep `new MutationObserver` in
  `SpringHeatmap.vue:272`. Run `proof:brittleness` — clause 4 must RED listing
  `SpringHeatmap.vue:272`. Convert to `watch(isDark, paint)`; confirm GREEN.

- **Clause 5 (callbacks-as-props):** before B.1 lands, `ControlsPaneWrapper.vue` still has the
  five fn-typed props. Run `proof:brittleness` — clause 5 must RED listing all five. Replace with
  `defineEmits`; confirm GREEN.

- **Clause 6 (guaranteed-token comma-default):** before C.4 lands,
  `demo/spring/SpringHeatmap.vue:330` has `z-index: var(--z-content, 3)`. Run
  `proof:brittleness` — clause 6 must RED listing this site. Excise the `,3`; confirm GREEN.

---

## 4. Challenge-tempered cautions

**Render-fn slot protocol STAYS** (`challenge-demo.md` C.3; R.md §2). The `defineExpose({
tabsContent, ribbonContent, headerLeft })` + `<component :is="sceneRef?.tabsContent">` bridge
is the *idiomatic* cross-sibling render teleport — scenes project into sibling slot positions
that Vue named slots structurally cannot reach. Only the `any` typing changes (`SceneExposedApi`
— B.2). The `ribbonContent = (slotProps) => …` render-function shape is a first-class Vue 3 API
and is NOT replaced with mini-SFC files.

**`data-index` markup STAYS and is correct** (`challenge-demo.md` C.4 correction). `DemoControlPoint.vue:31-32` `<circle class="control-point handle" :data-index="index">` is present and the `proof:easing-editor-live` gate correctly selects it. The brittleness Finding 1 side-note that claimed otherwise was a misread of line 15 (the wrapper `<g>`) versus line 31 (the handle `<circle>`). Do NOT touch `:data-index`.

**Template/watchEffect destructure is idiomatic post-Vue-3.5** (project memory — NARROWED J.T5).
The rule gates only a destructured prop passed INTO a composable; template destructure and
`watchEffect` destructure are fine. None of the fixes in this wave create a new reactive-
destructure-into-composable pattern.

**Subgrid same-cascade fallback STAYS** (R.md §2; `challenge-demo.md` D.2). `SequenceTarget.vue`
`grid-template-columns: var(--label-col) 1fr; grid-template-columns: subgrid;` is the
modern-web-guidance recommended idiom (css-layout guide explicitly recommends this two-declaration
pair). DT-6's "excise it" was overreach. This wave does not touch subgrid pairs.

**`useSceneSwap` STAYS** (R.md §2; `challenge-demo.md` D.3). View Transitions is Baseline only
since 2025-10-14 (Firefox 144). The `SpringProgress` cross-dissolve fallback is genuinely
befitting. This wave does not touch `useSceneSwap.ts`.

**DM-1/DM-5 glass-ui-BC primary vs contingency KILL.** The primary path is the BC fix in
glass-ui (USER-DOMAIN) — but P-invariant-28 forbids a 9th carry. If BC is not landed before
this wave's IMPL start, the contingency KILL fires immediately. There is no conditional deferral.

**The three gate co-edits** (assertion changes to `proof:brittleness`) must be committed atomically
with their corresponding Band step, each with a re-RED verify before the fix lands:

- Clause 4 extended → Band A.2 MutationObserver excision (commit together)
- Clause 5 callbacks-as-props → Band B.1 emits migration (commit together)
- Clause 6 guaranteed-token comma-default → Band C.4 z-index excision (commit together)

---

## 5. Verification + DEV/IMPL boundary

**This spec is authored now (R.W0 DEV phase). IMPL opens on explicit authorization.**

Verification steps post-IMPL (in Band order):

**After Band A:**

1. `node scripts/proof-brittleness.mjs` — GREEN (all clauses; clauses 4 extended, 5, 6 must
   also be present by the time Band A commits land).
2. `grep -rn "window\.addEventListener\|handleEl.*addEventListener\|new ResizeObserver\|new MutationObserver" demo/` — zero hits outside `dist/`.
3. `grep -n "dataset\.curve" demo/easing/EasingTarget.vue` — zero hits (the hot-path painter
   reads the owned snapshot, not the DOM).
4. `npm run build` — zero TypeScript errors.

**After Band B:**

5. `grep -n "onPanelTransitionEnd\|onSheetSettled\|onPaneMouseEnter\|onPaneMouseLeave\|setPaneEl" demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` — zero hits in `defineProps`; `defineEmits` has the equivalents.
6. `grep -n "shallowRef<any>" demo/app/App.vue demo/app/useSceneMachineApp.ts` — zero hits.
7. `grep -n "storedControls: any" demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts` — zero hits.
8. `wc -l demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` — both strictly under 400L.
9. `npm run build` — zero TypeScript errors.

**After Band C:**

10. `grep -rn "var(--z-content," demo/` — zero hits.
11. `grep -rn "var(--z-behind," demo/` — zero hits.
12. `grep -n "\-\-spring-snappy" demo/@/styles/style.css` — zero hits.
13. `grep -rn "animationState" demo/@/components/custom/animation-controls/stores/animationOptionsStore.ts` — zero hits in the type definition or `defaultStoredAnimationOptions`.
14. `grep -n "sharedCubeTransform" demo/app/cubeTransformStore.ts` — zero hits; `useCubeTransform` is the export.
15. `grep -n "let _timingFunctionsAnd\|getTimingFunctionsAnd" demo/easing/useEasingDemo.ts` — zero hits.
16. `node scripts/proof-brittleness.mjs` — GREEN (all six clauses).
17. `proof:workaround-deletion` S1 + S2 — GREEN (DM-5/DM-1 exits, primary or contingency KILL).
18. `npm run build` — zero TypeScript errors.
19. Demo dev server: navigate every scene; animations play; dark/light theme toggle re-paints the spring heatmap correctly; control point drag works cleanly including unmount-mid-drag (switch scene during drag — no leaked event listeners).
