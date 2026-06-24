# Tranche R — Demo-Targets Lane Audit

**Lane:** demo-targets  
**Audited files:** `demo/{cube,sequence,spring,easing,morph,motion-path}/*Target.vue`  
**Date:** 2026-06-24

---

## 1. Line Counts

| File | Total | Template | Script | Style |
|------|-------|----------|--------|-------|
| `CubeTarget.vue` | **560** | L1–151 | L152–288 | L289–560 (271L) |
| `SequenceTarget.vue` | 499 | L1–133 | L134–266 | L267–499 |
| `MotionPathTarget.vue` | 492 | L1–191 | L192–278 | L279–492 |
| `SpringTarget.vue` | 436 | L1–159 | L160–250 | L251–436 |
| `EasingTarget.vue` | 429 | L1–140 | L141–358 | L359–429 |
| `MorphTarget.vue` | 329 | L1–118 | L119–182 | L183–329 |

`CubeTarget.vue` is the only file over the 500L gate. `SequenceTarget.vue` and `MotionPathTarget.vue` are borderline (499L, 492L). The others are under-gate but carry cross-cutting concerns warranting extraction.

---

## 2. Finding Index

| # | Title | Severity | Category |
|---|-------|----------|----------|
| DT-1 | CubeTarget.vue > 500L — style block not extracted | high | decomposition |
| DT-2 | EasingTarget rebuilds `resolvedFunctions` ignoring `demo.timingFunctionsAnd` | high | dry |
| DT-3 | `onHandleKeydown` orphaned in MotionPathTarget instead of `useMotionPathGesture` | medium | encapsulation |
| DT-4 | MorphTarget uses `onBeforeUnmount` while all peers use `onScopeDispose` | medium | brittleness |
| DT-5 | Blueprint-ground 2D grid CSS duplicated verbatim between MorphTarget and MotionPathTarget | medium | dry |
| DT-6 | Subgrid double-declaration fallback in SequenceTarget — dead in 2026 | low | legacy |
| DT-7 | Inject-based Targets share identical "demo plumbing" with no shared composable | medium | decomposition |
| DT-8 | CubeTarget uses `defineProps` while all other Targets use `inject(DEMO_KEY)` | medium | encapsulation |
| DT-9 | `setTimeout` in CubeTarget `onRoll` to clear `rolling` flag — not tied to animation end | low | brittleness |
| DT-10 | Typed "reel" trigger buffer (`reelBuffer`) inline in SequenceTarget template script | low | decomposition |

---

## 3. Detailed Findings

### DT-1 — CubeTarget.vue > 500L: style block not extracted

**File:** `demo/cube/CubeTarget.vue` (560L total; 271L style block, L289–560)

CubeTarget is the only file above the 500L gate. The template (151L) and script (137L) are not excessive — the problem is the style block (271L) which encodes the entire 3D CSS material system inline. The block contains six independent concerns:

- `@property` declarations for `--lit`, `--spin-energy`, `--axis-active` (L291–307)
- Cube geometry + responsive sizing `.cube`, `.cube-side`, `@media max-width:1023px` (L340–397)
- Face material system `.face-lacquer`, `.face-relit`, `.face-numeral`, `.face-axis-tag` (L401–453)
- Bloom + drop-shadow `.cube--relit`, `::after` (L457–485)
- Attitude readout `.cube-attitude`, `.cube-attitude__axis` (L489–512)
- Axis-lock reveal `.axis-line` (L514–558)

None of these classes are used by any other component (they are scoped to `CubeTarget`). They are not candidates for global promotion but they are candidates for extraction into a colocated **`cube-3d.css`** (or the `<style scoped>` remains but only if the file is otherwise split).

**Proposal:** Extract the style block to `demo/cube/cube-3d.css` and import it in the component (`import "./cube-3d.css"` inside `<script setup>`). The script and template are already lean — no further split is required. This brings the `.vue` file to ~290L.

---

### DT-2 — EasingTarget rebuilds `resolvedFunctions` ignoring `demo.timingFunctionsAnd`

**File:** `demo/easing/EasingTarget.vue` L217–258

```typescript
// EasingTarget.vue L217-229 — re-walks timingFunctions from scratch
const resolvedFunctions: Record<string, TimingFunction> = {};
for (const [k, v] of Object.entries(timingFunctions)) {
    if (typeof v !== "function") continue;
    const key = camelCaseToHyphen(k);
    if (key === "steps") continue;
    if (v.length === 0) {
        const result = (v as () => TimingFunction)();
        if (typeof result === "function") {
            resolvedFunctions[key] = result;
        }
    } else if (v.length <= 1) {
        resolvedFunctions[key] = v as TimingFunction;
    }
}
```

`useEasingDemo` already exports `timingFunctionsAnd` (a module-level singleton built with `getTimingFunctionsAnd()`, `demo/easing/useEasingDemo.ts` L30–41) which does the same `camelCaseToHyphen` walk and is already present on the injected `demo` object (returned at L460). The `EasingTarget` never reads `demo.timingFunctionsAnd`; it re-derives the same map with a fragile `v.length === 0` / `v.length <= 1` heuristic that differs from the demo's implementation.

Additionally, `visibleCurves` (L237–258) drives the multi-mode comparison list. The demo already exposes `comparisonCurves` (family-scoped), but `visibleCurves` extends this to "all" mode — it should still use `demo.timingFunctionsAnd` for function lookup instead of the private `resolvedFunctions`.

**Proposal:**
1. Delete `resolvedFunctions` and the import of `timingFunctions`/`camelCaseToHyphen` from `EasingTarget`.
2. Replace `resolvedFunctions[item.name]` lookups with `demo.timingFunctionsAnd[item.name]` (type-narrow with `typeof fn === "function" ? fn : (t: number) => t`, the pattern the demo itself uses at L147).
3. Remove the `import type { TimingFunction }` in the target if only used for `resolvedFunctions`.

---

### DT-3 — `onHandleKeydown` orphaned in MotionPathTarget

**Files:** `demo/motion-path/MotionPathTarget.vue` L263–276 vs `demo/motion-path/useMotionPathGesture.ts` L340–356

`useMotionPathGesture` already returns `onHandlePointerDown` for the pointer-drag path. The keyboard nudge for the same handles lives entirely in the Target:

```typescript
// MotionPathTarget.vue L263-276
const HANDLE_STEP = 6;
const onHandleKeydown = (id: string, e: KeyboardEvent) => {
    const pt = demo.points.value.find((p) => p.id === id);
    if (!pt) return;
    let dx = 0; let dy = 0;
    if (e.key === "ArrowRight") dx = HANDLE_STEP;
    else if (e.key === "ArrowLeft") dx = -HANDLE_STEP;
    else if (e.key === "ArrowDown") dy = HANDLE_STEP;
    else if (e.key === "ArrowUp") dy = -HANDLE_STEP;
    else return;
    e.preventDefault();
    demo.movePoint(id, pt.x + dx, pt.y + dy);
};
```

This is the keyboard half of the same gesture `onHandlePointerDown` owns. The composable already references `demo.movePoint` (L324). Split responsibility: pointer handler in the composable, keyboard handler in the template.

**Proposal:** Move `HANDLE_STEP`, `onHandleKeydown` into `useMotionPathGesture` alongside `onHandlePointerDown`. The composable accepts `demo` already, so `demo.movePoint` and `demo.points` are already in scope. Export `onHandleKeydown` from the composable.

---

### DT-4 — MorphTarget uses `onBeforeUnmount` while all peers use `onScopeDispose`

**File:** `demo/morph/MorphTarget.vue` L120, L176

```typescript
import { inject, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
// ...
onBeforeUnmount(() => pausePoll());
```

All other Targets that need cleanup use `onScopeDispose`:
- `SpringTarget.vue` L218: `onScopeDispose(() => unregisterPainter?.())`
- `EasingTarget.vue` L340: `onScopeDispose(() => unregisterPainter?.())`
- `CubeTarget.vue` L283: `onScopeDispose(() => { rollAnim?.stop(); disposeFlash(); })`

`onBeforeUnmount` only fires when the component unmounts; `onScopeDispose` fires on scope disposal (which includes unmount, but also `<KeepAlive>` deactivation and scope teardown). The app uses `<KeepAlive>` for scenes (App.vue); `onBeforeUnmount` will NOT fire when a scene is swapped out under KeepAlive, leaving the `useRafFn` loop running in a stale state.

**Proposal:** Replace `onBeforeUnmount` with `onScopeDispose` in `MorphTarget`. Since `useRafFn` from `@vueuse/core` already registers cleanup on the component scope, this may be redundant anyway — but the explicit call must use the correct hook.

---

### DT-5 — Blueprint-ground 2D grid CSS duplicated verbatim between MorphTarget and MotionPathTarget

**Files:** `demo/morph/MorphTarget.vue` L194–233 (`.morph-stage`) vs `demo/motion-path/MotionPathTarget.vue` L295–315 (`.mp-stage`)

Both `.morph-stage` and `.mp-stage` declare identical structural CSS for the SVG blueprint ground:
- `block-size: min(100%, var(--XXX-stage-max))` — identical pattern, different custom property name
- `aspect-ratio: 1` — identical
- `--c: var(--ball-tone, var(--color-progress))` — identical
- `background-color: color-mix(in srgb, var(--c) var(--stage-field-tint, 4%), var(--background))` — identical
- Center crosshair (two linear-gradients) — identical logic
- `border-radius: var(--radius-card)` — identical
- `box-shadow: inset 0 0 32px color-mix(in srgb, var(--c) 6%, transparent)` — identical

The grids differ slightly in the repeating layer count (MorphTarget: 2-layer single pitch at 6%; MotionPathTarget: 4-layer dual-pitch major+fine at 8%/4%), so a verbatim class extraction would not be 1:1. However, the pattern is close enough that `design-idioms.css` already defines `--graph-pitch` / `--graph-major` / `--stage-field-tint` tokens for this exact purpose.

**Proposal:** Add a `.stage-canvas-ground` class to `design-idioms.css` that encodes the common structure (background-color, aspect-ratio, border-radius, box-shadow, the crosshair), parameterized by `--c`. Each Target scene overrides only the `--c` alias and the grid pitch layers via the established tokens. The 271L scoped style blocks in each Target shrink by ~30L each.

---

### DT-6 — Subgrid double-declaration fallback in SequenceTarget (dead in 2026)

**File:** `demo/sequence/SequenceTarget.vue` L325–327 and L333–334

```css
.seq-rows {
    /* Same-cascade fallback (Baseline 2023) then subgrid. */
    grid-template-columns: var(--label-col) 1fr;
    grid-template-columns: subgrid;
}
.seq-row {
    grid-template-columns: var(--label-col) 1fr;
    grid-template-columns: subgrid;
}
```

CSS subgrid is Baseline 2023 and fully supported (Chrome 117+, Safari 16+, Firefox 71+). As of 2026 there is no supported browser that would need the fallback. The double declaration silently continues to deliver the fallback to browsers that will never exist in the demo's user population. This is exactly the "fallback/fall-through behavior" pattern the precepts require to be excised.

**Proposal:** Remove the first `grid-template-columns: var(--label-col) 1fr` from both `.seq-rows` and `.seq-row`. Keep only `grid-template-columns: subgrid`. No visual change on any supported browser.

---

### DT-7 — Inject-based Targets share identical "demo plumbing" with no shared composable

**Files:** all five inject-based Targets

Every Target that follows the inject pattern has the same structural boilerplate:

```typescript
// SpringTarget.vue L167
const demo = inject(SPRING_DEMO_KEY)!;
// EasingTarget.vue L164
const demo = inject(EASING_DEMO_KEY)!;
// SequenceTarget.vue L151
const demo = inject(SEQUENCE_DEMO_KEY)!;
// MorphTarget.vue L133
const demo = inject(MORPH_DEMO_KEY)!;
// MotionPathTarget.vue L210
const demo = inject(MOTION_PATH_DEMO_KEY)!;
```

All five also follow the pattern:
1. Inject the demo key with a non-null assertion
2. Wire `onMounted` to register painters / build the engine target / trigger init
3. `onScopeDispose` (or the wrong `onBeforeUnmount` in Morph) to clean up painters

The non-null assertion `inject(KEY)!` is a silent failure: if the key is missing (wrong scene nesting, test harness, future refactor), the component proceeds with `undefined` and throws at runtime with no diagnostic. None of the five targets do a runtime guard.

This is not necessarily a reason to create a shared `useTargetBase` composable (the inject keys differ per scene and the demo shapes are dissimilar). But the bare `inject(KEY)!` assertion should at minimum throw explicitly:

```typescript
// Proposed: fail explicitly, not silently
const demo = inject(SPRING_DEMO_KEY);
if (!demo) throw new Error("SpringTarget: SPRING_DEMO_KEY not provided — must be mounted under SpringScene");
```

**Proposal:** Convert all five `inject(KEY)!` bare assertions to explicit null-check throws. This is a one-liner change per file; the failure mode is now explicit instead of a property-access TypeError with no context.

---

### DT-8 — CubeTarget uses `defineProps` while all other Targets use `inject(DEMO_KEY)`

**File:** `demo/cube/CubeTarget.vue` L161–166

```typescript
const props = defineProps<{
    isPlaying: boolean;
    isStarted: boolean;
    ppMode: boolean;
    showLoader: boolean;
}>();
```

All other Targets inject their demo composable from the scene provider. CubeTarget is architecturally different: it receives scalar booleans as props from CubeScene.vue (L17–19), not a demo composable. The cube has no `useCubeDemo` — instead, `useCubeAnimations` runs in CubeScene and passes scalar state down.

This is a meaningful architectural divergence but not in itself wrong — the cube is fundamentally different (the engine is managed at the scene level through `useCubeAnimations`, there is no domain-level composable to inject). However, the divergence is undocumented and `CubeTarget` is the only Target that does not follow the inject contract, making the Target family incoherent for anyone reading across scenes.

**Proposal:** Document the divergence with a brief inline comment on the `defineProps` block noting why Cube uses props instead of inject. Alternatively — the lower-friction path — extract the relevant state into a `CUBE_DEMO_KEY` provide/inject just as the other scenes do, wrapping the 4 booleans in a thin reactive object that CubeScene provides. This would make all 6 Targets architecturally uniform.

---

### DT-9 — `setTimeout` in CubeTarget `onRoll` to clear `rolling` flag

**File:** `demo/cube/CubeTarget.vue` L280

```typescript
// Release the gesture lock after the arc; the fillMode:forwards leaves the
// die resting on its rolled face (the next drag/animation re-bases as usual).
setTimeout(() => { rolling.value = false; }, 1200);
```

The animation is constructed with `duration: 1100` and the timeout is 1200ms — a 100ms fudge-factor that is NOT tied to the animation's actual completion. If the animation duration changes, the timeout must be manually updated. This is brittleness: the rolling lock is released by clock time, not by animation-end.

`CSSKeyframesAnimation` should expose a completion signal (`.onFinish`, `.finished`, or a promise). If it does, the timeout can be replaced with a proper animation-end callback. If it does not yet expose this, the timeout should at minimum `clearTimeout` the previous timer in `onScopeDispose` (it currently does not):

```typescript
// Current: no cleanup of the timeout
onScopeDispose(() => {
    rollAnim?.stop();
    disposeFlash();
    // missing: clearTimeout(rollTimer)
});
```

**Proposal:**
1. Check if `CSSKeyframesAnimation` exposes `.finished` or a callback. If yes, replace `setTimeout` with the completion signal.
2. If no, save the timer ID and cancel it in `onScopeDispose` alongside `rollAnim?.stop()`.

---

### DT-10 — Typed "reel" trigger buffer inline in SequenceTarget

**File:** `demo/sequence/SequenceTarget.vue` L248–263

```typescript
const REEL_CODE = "reel";
let reelBuffer = "";
useEventListener(window, "keydown", (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
        return;
    if (e.key.length !== 1) return;
    reelBuffer = (reelBuffer + e.key.toLowerCase()).slice(-REEL_CODE.length);
    if (reelBuffer === REEL_CODE) {
        reelBuffer = "";
        demo.playReel();
    }
});
```

This is a generic "typed sequence detector" pattern (ring buffer on `window.keydown`, skip editable targets). It encodes the same pattern that could serve any scene's typed easter egg, but it is entirely inline in `SequenceTarget`. The ring buffer is a `let` (module-level mutable state in a SFC setup function) rather than a `ref` or a contained scope.

This is low severity because the Sequence scene is the only consumer, but if another scene wants a typed trigger, this code would be copy-pasted. A `useTypedTrigger(code, cb)` composable in `@composables/` would be the right extraction.

**Proposal:** Extract to `demo/@/composables/useTypedTrigger.ts` with signature `useTypedTrigger(code: string, onMatch: () => void): void`. The composable handles the window listener, editable-target guard, and ring buffer internally; it uses `useEventListener` (already a dependency) and scopes cleanup to the caller's effect scope. `SequenceTarget` becomes a two-liner: `useTypedTrigger("reel", () => demo.playReel())`.

---

## 4. Cross-Cutting: Target Structural Pattern (not a bug, but a design note)

Four of the six Targets (MotionPath, Morph, Sequence, Spring) share an identical outer wrapper:

```html
<div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
  <Card :shadow="false" class="... flex flex-col overflow-hidden">
    <div class="flex flex-wrap items-center justify-between ... px-4 py-2.5 border-b border-border/40 shrink-0">
      <!-- scene name (text-display) + MetricBadge(s) + action button -->
    </div>
    <!-- stage -->
    <p class="text-small text-muted-foreground text-center"><!-- description --></p>
  </Card>
</div>
```

This is consistent DESIGN LANGUAGE, not a bug. The pattern is intentionally not extracted into a "SceneCard" wrapper component because the inner contents differ radically. Forcing a slot-based wrapper would add a layer of indirection with little payoff. The structural repetition is benign at this grain size.

---

## 5. Summary Table

| Finding | File(s) | Action | Effort |
|---------|---------|--------|--------|
| DT-1 | `CubeTarget.vue` L289–560 | Extract style → `cube-3d.css` | Low |
| DT-2 | `EasingTarget.vue` L217–258 | Delete `resolvedFunctions`, use `demo.timingFunctionsAnd` | Low |
| DT-3 | `MotionPathTarget.vue` L263–276 | Move `onHandleKeydown` → `useMotionPathGesture` | Low |
| DT-4 | `MorphTarget.vue` L176 | Replace `onBeforeUnmount` → `onScopeDispose` | Trivial |
| DT-5 | `MorphTarget.vue` + `MotionPathTarget.vue` | Add `.stage-canvas-ground` to `design-idioms.css` | Medium |
| DT-6 | `SequenceTarget.vue` L325–327, L333–334 | Delete the subgrid fallback declarations | Trivial |
| DT-7 | All 5 inject Targets | Replace `inject(KEY)!` with explicit-throw guard | Low |
| DT-8 | `CubeTarget.vue` L161–166 | Document or refactor to `CUBE_DEMO_KEY` provide/inject | Medium |
| DT-9 | `CubeTarget.vue` L280 + L283 | Tie `rolling = false` to animation-end; cancel timer in dispose | Low |
| DT-10 | `SequenceTarget.vue` L248–263 | Extract to `useTypedTrigger` composable | Low |
