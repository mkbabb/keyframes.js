# Tranche R — Lane: `demo-legacy-sweep`

**Focus:** Cross-cutting demo legacy/dead-code/workaround/fallback sweep.  
**Date:** 2026-06-24  
**Branch audited:** `tranche-o-dev` (same demo tree as post-Q 5.0.0)

---

## 1. Dead Components — Never Imported

### 1a. `Animated.vue` — completely dead

**File:** `demo/@/components/custom/Animated.vue`

The component exists and has implementation (fade-in/out using `loadAnimationEngine` presets), but a project-wide grep confirms ZERO imports of it anywhere in the demo tree. It was an early-era fade wrapper that was superseded.

**Proposal:** EXCISE entirely. No import, no render, no test — it is dead code that carries a `loadAnimationEngine()` boot cost at the module graph node if ever accidentally referenced.

---

### 1b. `ResponsiveSelect.vue` — never rendered

**File:** `demo/@/components/custom/ResponsiveSelect.vue`

Defines `ResponsiveSelectItem` interface (line 112) and the component (line 118+), but the only reference outside the file itself is a comment in `usePaneRegister.ts` (line 27: "composable in this subtree draws (useControlsLayout / ResponsiveSelect)") — not an import, just a comment. No `import ResponsiveSelect` or `<ResponsiveSelect` appears anywhere in the demo.

**Proposal:** EXCISE entirely. The `usePaneRegister.ts` comment is stale documentation of a component that was never wired or was removed mid-tranche.

---

## 2. Dead / No-Op Exports from Live Composables

### 2a. `onScroll` is a no-op body; `nearestCenterId` returned but never used by consumer

**File:** `demo/@/composables/useScrollSnapScene.ts`, lines 56–71

```ts
const onScroll = (): void => {
    // ...
    void nearestCenterId;  // <-- reference-void, not a call; the function is never called
};
```

`onScroll` is bound in `SceneSwitcherCarousel.vue:15` (`@scroll="onScroll"`), but the body is a literal no-op — `void nearestCenterId` evaluates the function reference and discards it (the function is never invoked). This attaches a scroll listener that does exactly nothing on every scroll event.

`nearestCenterId` is returned from the composable (line 71) but `SceneSwitcherCarousel` destructures only `{ onScroll, scrollToScene }` — `nearestCenterId` is never consumed.

**Proposal:**
- Delete `onScroll` from both the composable and the carousel's `@scroll` binding — it is a zero-overhead listener today but the body is dead code that misleads.
- Delete `nearestCenterId` from the return object (or collapse it into a private function used only by `scrollToScene`). If a future gate needs it, add it back at that time.
- The `scroller` ref is used only by `scrollToScene` via `nearestCenterId`; with `onScroll` deleted the `scroller` ref itself may become removable.

---

## 3. Workarounds / Explicit-Fallback Code

### 3a. `useSceneSwap.ts` — the no-VT SpringProgress fallback

**File:** `demo/app/useSceneSwap.ts`, full file

```ts
/**
 * The engine-dogfooded scene-swap cross-dissolve — the NO-VT FALLBACK. Where
 * the platform ships native View Transitions (`useSceneTransition`), the
 * compositor owns the scene cross-fade and this spring ramp stays at rest…
 */
export function useSceneSwap(activeSceneKey: ComputedRef<string>) {
    const vtOwnsMotion = supportsViewTransitions();
    const sceneOpacity = ref(1);
    const sceneSwapStyle = computed(() => ({ … }));

    if (!vtOwnsMotion) {
        const sceneSwapSpring = new SpringProgress({ … });
        watch(activeSceneKey, () => { … });
    }

    return { sceneSwapStyle };
}
```

This is a documented intentional fallback — View Transitions (baseline 2023, ~97% support by 2026) own the swap; the spring cross-dissolve remains only for the ~3% without VT. The comment states "the dogfood fallback is preserved, not removed."

**Assessment:** This is an explicit, well-scoped fallback for a real coverage gap (Firefox ESR / old Safari). The precept says "NO fallback/fall-through behavior… unless genuinely befitting." A 3% engine-dogfooding graceful-degrade is genuinely befitting — it also dogfoods `SpringProgress`. However: the `sceneSwapStyle` computed is wired UNCONDITIONALLY on the `<div>` in `App.vue` (line 153 `:style="sceneSwapStyle"`) even when VT owns the motion. On a VT-capable browser it binds `{ opacity: 1, transform: scale(1) }` every render — a trivially-redundant binding.

**Proposal (low):** Conditional binding: `v-bind="sceneSwapStyle !== null ? { style: sceneSwapStyle } : {}"` or return `null` from `useSceneSwap` when `vtOwnsMotion` and bind nothing. Not a correctness bug, but a no-op style prop on every render.

---

### 3b. `useMonacoCancellationGuard.ts` — silent swallow of Monaco's `Canceled` error

**File:** `demo/app/useMonacoCancellationGuard.ts`, full file

```ts
export function useMonacoCancellationGuard(): void {
    useEventListener(window, "unhandledrejection", (e) => {
        if (isMonacoCanceled(e.reason)) e.preventDefault();
    });
    useEventListener(window, "error", (e) => {
        if (isMonacoCanceled(e.error)) e.preventDefault();
    });
}
```

The guard swallows Monaco's `CancellationError` (name/message `"Canceled"`) when the editor is disposed mid-async. The comment is explicit: "benign Monaco cancellation signal" suppressed only when the exact signature matches.

**Assessment:** This is a narrow, targeted, named suppression of a well-documented third-party library behavior — precisely what the precept means by "genuinely befitting." It is NOT a silent blanket catch. The guard is documented, single-sourced, and the suppression predicate is exact. No change needed.

---

### 3c. `router.push(...).catch(() => { writerEcho = false; })` — silent catch on nav failure

**File:** `demo/app/useSceneMachineRouter.ts`, line 83–85

```ts
router.push({ name: scene, query }).catch(() => {
    writerEcho = false;
});
```

Vue Router 4 throws a `NavigationDuplicated` error (and other navigation failures) as rejected promises when `router.push` does not result in a navigation. The catch here silently discards ALL navigation errors, only rolling back the `writerEcho` guard. A genuine navigation failure (e.g., a broken route guard) would be silently swallowed.

**Proposal:** Fail explicitly for non-navigation-duplicate errors:

```ts
import { isNavigationFailure, NavigationFailureType } from "vue-router";
router.push({ name: scene, query }).catch((e) => {
    writerEcho = false;
    if (!isNavigationFailure(e, NavigationFailureType.duplicated |
                                   NavigationFailureType.redirected |
                                   NavigationFailureType.aborted)) {
        throw e;
    }
});
```

---

### 3d. `warmScene` catch — intentional silent swallow

**File:** `demo/app/scenes.ts`, line 80

```ts
export function warmScene(id: string): void {
    const loader = sceneLoaders.get(id);
    if (loader) void loader().catch(() => {});
}
```

A warmed chunk that fails should not surface to the user (the real mount surfaces the error via `<Suspense>`). The comment makes this explicit: "a rejected warm is swallowed." This is genuinely befitting — swallowing the prefetch failure is the correct behavior for a speculative preload.

**Assessment:** No change needed. The comment is accurate.

---

## 4. Silent Catches with Logged Console Errors (warn/error)

### 4a. `useTimelineBuild.ts` `rebuild()` — console.error + silent null

**File:** `demo/@/components/custom/animation-controls/timeline/composables/useTimelineBuild.ts`, lines 38–48

```ts
try {
    const anim = await buildAnimationFromTimeline(…);
    animation.value = markRaw(anim);
} catch (e) {
    console.error("Failed to rebuild timeline animation:", e);
    animation.value = null;
}
```

On a rebuild failure the timeline silently goes blank — the user sees nothing, no toast, no explanation.

**Proposal:** Surface via `toast.error(…)` in addition to (or instead of) `console.error`. The `importCSS`/`exportCSS` sibling functions in the same file already do this (lines 134–138, 154–158). The `rebuild` path should match that contract: show a user-visible error, or at minimum call `console.error` AND show a toast.

---

### 4b. `html2canvas` silent null return on failure

**File:** `demo/@/components/custom/animation-controls/timeline/composables/useTimelineBuild.ts`, lines 101–114

```ts
try {
    const { default: html2canvas } = await import("html2canvas");
    return await html2canvas(target, { scale: 0.5, logging: false, backgroundColor: null });
} catch {
    return null;
}
```

`html2canvas` failures return `null` with no indication to the caller. This is the timeline hover preview — a cosmetic failure. Returning `null` causes the hover to show nothing.

**Assessment:** Genuinely befitting — `html2canvas` is a cosmetic enhancement and the fallback (no preview) is appropriate. The pattern is fine as-is. The precept "NO silent or graceful handling unless genuinely befitting" applies here: the feature degrades gracefully and silence is correct for a decorative preview.

---

### 4c. `useHeroSourceEgg.ts` — silent catch on serialize

**File:** `demo/@/components/custom/editor-shell/useHeroSourceEgg.ts`, lines 116–118

```ts
} catch {
    /* the serialize is a flourish; a failure leaves the block alone */
}
```

Same pattern — the serialized output is a flourish on the start screen. A failure leaves `serializedOut.value` unchanged. Genuinely befitting.

**Assessment:** No change needed.

---

### 4d. AmigaScene sessionStorage silent catches — genuinely befitting

**File:** `demo/app/scenes/AmigaScene.vue`, lines 240–241, 351

```ts
try { return sessionStorage.getItem(AMIGA_VISITED_KEY) === "1"; }
catch { return false; }
// ...
try { sessionStorage.setItem(AMIGA_VISITED_KEY, "1"); } catch { /* private mode */ }
```

Storage throws in private/incognito mode. Falling back to "never visited" is exactly right.

**Assessment:** No change needed.

---

## 5. Deprecated Web API

### 5a. `navigator.platform` — deprecated API

**File:** `demo/@/utils/iosTextEntry.ts`, line 14

```ts
const getNavigatorLike = (): NavigatorLike => {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,   // <-- deprecated since Chrome 93 / MDN
        maxTouchPoints: navigator.maxTouchPoints,
    };
};
```

`navigator.platform` is deprecated (MDN: "Do not use") — it was removed from the spec; browsers still implement it for compatibility but it's unreliable (macOS always reports `"MacIntel"` regardless of Apple Silicon). The usage on line 30 of the same file:

```ts
if (/(iPad|iPhone|iPod)/i.test(platform)) { return true; }
return platform === "MacIntel" && maxTouchPoints > 1;
```

The `"MacIntel"` + `maxTouchPoints > 1` heuristic for iPadOS detection is the canonical workaround for the pre-iPadOS-13 era. Modern iPadOS reports `"MacIntel"` + `maxTouchPoints >= 5` (not > 1 for Apple Pencil-only devices).

**Proposal:** Remove `platform` from `NavigatorLike` and the `navigator.platform` read. The `userAgent` test (`/(iPad|iPhone|iPod)/i`) already covers real iOS. The `"MacIntel" + maxTouchPoints > 1` heuristic for iPadOS is a legacy workaround — modern approach is `CSS.supports("(-webkit-touch-callout: none)")` or just checking `userAgent`. Replace the entire function with:

```ts
export const isIOSLikePlatform = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};
```

If iPadOS detection is still needed (iPadOS ≥13 shows desktop UA):

```ts
export const isIOSLikePlatform = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && CSS.supports("(-webkit-touch-callout: none)"))
    );
};
```

---

## 6. Legacy CSS Property

### 6a. `-webkit-overflow-scrolling: touch` — obsolete

**File:** `demo/@/components/custom/SceneSwitcherCarousel.vue`, line 85

```css
.scene-carousel {
    -webkit-overflow-scrolling: touch;
}
```

This property was removed from the CSS spec and from WebKit/Safari (deprecated as of iOS 13, removed in Safari 13+). It has been a no-op since 2019. All mobile Safari versions in use today (iOS 13+) implement inertial scrolling natively on `overflow: auto/scroll` elements.

**Proposal:** EXCISE the line entirely. No fallback needed — the native scroll inertia behavior it historically enabled is now the platform default.

---

## 7. Test Instrumentation in Production Code

### 7a. `window.__lastVtTypes` — test hook in production runtime

**File:** `demo/app/useSceneTransition.ts`, lines 69–76

```ts
if (typeof window !== "undefined") {
    (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes = types;
}
sceneHost.value?.setAttribute("data-last-vt-type", types[0] ?? "");
```

This writes a `__lastVtTypes` global on `window` and a `data-last-vt-type` attribute on the scene host — both are Playwright gate observables, not production features. The comment confirms this: "the test hook the runtime gate reads."

**Assessment:** This is intentional test instrumentation that ships in the production bundle. The `data-` attribute is benign (standard HTML5 mechanism) and the window global is a one-time write. However, the `window.__kfLoaf` observer (in `loaf-observer.ts`) is guarded by `import.meta.env.DEV` and DCE'd. The VT types hook is NOT guarded — it ships in production.

**Proposal (medium):** Gate the `window.__lastVtTypes` write behind `import.meta.env.DEV`:

```ts
if (import.meta.env.DEV && typeof window !== "undefined") {
    (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes = types;
}
```

The `data-last-vt-type` attribute can stay — `data-` attributes are a standard instrumentation mechanism and have negligible production cost.

---

## 8. `as any` Laundering

### 8a. `SquareScene.vue` — `new AnimationGroup(anim as any)`

**File:** `demo/app/scenes/SquareScene.vue`, line 158

```ts
const animationGroup = markRaw(new AnimationGroup(anim as any));
```

`AnimationGroup` is generic; `anim` is typed — the `as any` erases the type to satisfy a likely overly-strict generic bound.

**Proposal:** Type `anim` properly (or use the correct `AnimationGroup<typeof anim>` parametrization) rather than erasing it. Low priority but violates the "no `as any` laundering" principle stated in the easing demo comment (`useEasingDemo.ts:45`).

---

### 8b. `useCubeAnimations.ts` — three consecutive `as any` erases

**File:** `demo/cube/useCubeAnimations.ts`, lines 87–89

```ts
rotationAnim.value as any,
matrixAnim.value as any,
hoverAnim.value as any,
```

Three animations are passed to `AnimationGroup` with `as any`. Same root cause as 8a.

**Proposal:** Fix the `AnimationGroup` construction to accept a union or use the typed overload.

---

### 8c. `TimingFunctionPanel.vue` — `'steps' as any`

**File:** `demo/@/components/custom/animation-controls/controls/TimingFunctionPanel.vue`, lines 72, 85

```ts
emit('updateTimingFunction', 'steps' as any);
```

The emit type contract says `'steps'` is not a valid value (hence the `as any`). The emit type should be widened to include the literal string `'steps'`, or `timingFunctionKind` should return a union that includes it.

---

### 8d. `useTimingFunctionEditor.ts` — discarded `as any`

**File:** `demo/@/components/custom/animation-controls/controls/composables/useTimingFunctionEditor.ts`, line 196

```ts
timingFunctionLiteralFor(key) as any;
```

The result is computed but not assigned — a dead expression. If `timingFunctionLiteralFor(key)` has a side effect, the `as any` is masking a type gap; if it has no side effect, the entire line is dead.

**Proposal:** Either assign the result or delete the line. The `as any` is incidental to the dead-expression bug.

---

## 9. Oversize Files (demo-lane)

The audit precept flags files >500 lines as decomposition targets. The following demo files exceed the threshold:

| File | Lines | Notes |
|---|---|---|
| `demo/cube/CubeTarget.vue` | 560 | Template + 3D CSS cube math + all styles |
| `demo/app/scenes/AmigaScene.vue` | 538 | Three.js scene + orbit + sphere-spin + boot |
| `demo/easing/useEasingDemo.ts` | 511 | Full easing orchestration composable |
| `demo/app/scenes/SquareScene.vue` | 504 | Transform drag + spring + group setup |
| `demo/spring/useSpringDemo.ts` | 499 | Spring physics + derby + keyframes editor |
| `demo/sequence/useSequenceDemo.ts` | 499 | Sequence transport + instrument + scrub |
| `demo/sequence/SequenceTarget.vue` | 499 | Sequence rows + drag + axis |
| `demo/app/App.vue` | 499 | App shell + VT + dock + mbabb menu logic |
| `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` | 499 | Sheet spring + grab handle + pane layout |
| `demo/@/components/custom/EasingCurveCanvas.vue` | 499 | SVG canvas + drag + curve math |

**Note:** All of these are at or just below the 500-line threshold (the `wc -l` count includes blank lines and comments). The concern applies to the `src/` tree more acutely, but for the demo:

- `CubeTarget.vue` (560 lines) is the only genuine over-limit file. The 3D CSS math, the orbital drag wiring, and the `useCubeRelit` call should extract to a composable.
- `AmigaScene.vue` (538 lines) contains the full Three.js scene setup inline. The render-loop + resize + orbit controls setup belongs in a `useAmigaRenderer.ts` composable.
- `useEasingDemo.ts` (511 lines) has the full easing sweep + ghost + gallery + controls wired together. The gallery filtering and the TraceSmear state are sub-concerns that could factor into their own composables (they already exist: `useEasingGallery`, `useEasingGhost`, `useEasingTraceSmear` — but `useEasingDemo` orchestrates all three at 511 lines).

---

## 10. Other Observations

### 10a. `usePaneRegister.ts` comment references `ResponsiveSelect` — stale

**File:** `demo/@/components/custom/animation-controls/composables/usePaneRegister.ts`, line 27

A comment says "composable in this subtree draws (useControlsLayout / ResponsiveSelect)." `ResponsiveSelect` is dead (see 1b). The comment is stale documentation.

**Proposal:** Update the comment when excising `ResponsiveSelect.vue`.

---

### 10b. `router.ts` comment refers to dead "KeepAlive + dynamic `<component :is>`" pattern

**File:** `demo/app/router.ts`, line 12

```
// Actual rendering stays in App.vue via
// KeepAlive + dynamic <component :is> — routes just control which scene is active.
```

`App.vue` uses `<Suspense :key="activeSceneKey">` with no `KeepAlive` — the comment is stale from a prior architecture (pre-B.W3 fix).

**Proposal:** Update the comment to accurately describe the current `<Suspense>` architecture.

---

## Summary Table

| # | Item | File:line | Severity | Action |
|---|---|---|---|---|
| 1a | Dead component `Animated.vue` | `demo/@/components/custom/Animated.vue` | high | EXCISE |
| 1b | Dead component `ResponsiveSelect.vue` | `demo/@/components/custom/ResponsiveSelect.vue` | high | EXCISE |
| 2a | No-op `onScroll` body + dead `nearestCenterId` return | `demo/@/composables/useScrollSnapScene.ts:56-71` | medium | DELETE `onScroll` body; remove from return |
| 3c | Silent catch on `router.push` | `demo/app/useSceneMachineRouter.ts:83` | medium | FAIL-EXPLICIT for non-dup nav errors |
| 4a | `rebuild()` silent null + console.error only | `demo/.../timeline/composables/useTimelineBuild.ts:45` | medium | Add `toast.error` |
| 5a | `navigator.platform` deprecated API | `demo/@/utils/iosTextEntry.ts:14` | medium | Remove; use UA + `CSS.supports` |
| 6a | `-webkit-overflow-scrolling: touch` obsolete | `demo/@/components/custom/SceneSwitcherCarousel.vue:85` | low | EXCISE |
| 7a | `window.__lastVtTypes` production test hook | `demo/app/useSceneTransition.ts:69` | medium | Gate behind `import.meta.env.DEV` |
| 8a | `AnimationGroup(anim as any)` | `demo/app/scenes/SquareScene.vue:158` | low | Fix generic type |
| 8b | Three `as any` in AnimationGroup ctor | `demo/cube/useCubeAnimations.ts:87-89` | low | Fix generic type |
| 8c | `'steps' as any` in emit | `demo/.../controls/TimingFunctionPanel.vue:72,85` | low | Widen emit type |
| 8d | Dead expression `timingFunctionLiteralFor(key) as any` | `demo/.../composables/useTimingFunctionEditor.ts:196` | medium | Delete or assign |
| 9 | `CubeTarget.vue` (560L) over threshold | `demo/cube/CubeTarget.vue` | low | Extract render composable |
| 9 | `AmigaScene.vue` (538L) over threshold | `demo/app/scenes/AmigaScene.vue` | low | Extract `useAmigaRenderer` |
| 10a | Stale comment referencing dead `ResponsiveSelect` | `demo/.../composables/usePaneRegister.ts:27` | low | Update on excision |
| 10b | Stale KeepAlive comment | `demo/app/router.ts:12` | low | Update comment |
