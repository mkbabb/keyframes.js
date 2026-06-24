# Tranche R — Demo Brittleness Sweep

**Lane:** demo-brittleness
**Scope:** ALL `demo/**` — manual `addEventListener` / `new ResizeObserver` / `new MutationObserver` / `querySelector` / `closest` / `querySelectorAll` / `[data-*]` couplings / deeply-nested selectors in reactive code; reactivity brittleness (rAF bridges, array watches, listener re-attach).
**Branch:** `tranche-r-dev`
**Date:** 2026-06-24

---

## Executive summary

The demo is **already heavily migrated** to vueuse seams — prior tranches (D.W3, E.W2, inv-ζ) did real, structural work. The canonical model is `demo/@/components/custom/animation-controls/composables/useScrollFade.ts`: it routes the scroll listener through `useEventListener(el, …)` and the observer through `useResizeObserver(observeEl ?? el, …)`, both accepting the ref directly so they auto-detach-on-swap and auto-clean on scope dispose. `useSpringPaneDrag.ts`, `useOrbitalPointer.ts`, `useSphereSpin.ts`, `useDragScrub.ts`, `useMonacoCancellationGuard.ts`, `EasingTarget.vue`, `EasingHeroStage.vue`, `AmigaScene.vue`, `TransportDock.vue`, `AnimationVisualizer.vue`, `SequenceTarget.vue`, `OrbitalDrag.vue` all use vueuse listeners/observers correctly.

The **residual brittleness is concentrated and specific** — five real findings, in descending severity:

1. **`DemoControlPoint.vue`** — the one component that escaped the migration. RAW `window.addEventListener` drag-follow loop + RAW `handleEl.addEventListener("pointerdown")`/`removeEventListener`. Ironically this is the Q-tranche "DM-2 chronic build-in." (HIGH)
2. **`SpringHeatmap.vue`** — RAW `new ResizeObserver` + RAW `new MutationObserver` with hand-rolled `onScopeDispose` teardown + `typeof … !== "undefined"` fallback guards. (HIGH)
3. **`useSceneTransition.ts`** — a test-only DOM coupling baked into production: a DOUBLE write (`window.__lastVtTypes` global AND `sceneHost.setAttribute("data-last-vt-type", …)`) of the same datum, read by NOTHING in the tree. (MEDIUM)
4. **`useScrollSnapScene.ts`** + **`EasingTarget.vue`** — `[data-*]` couplings reading scene-id / curve-name out of DOM datasets in reactive/hot code instead of an owned ref↔id map; plus a dead `onScroll` no-op. (MEDIUM)
5. **`useTabStripScroll.ts`** — `querySelector("[role=tablist]")` / `querySelector("[role=tab][aria-selected=true]")` vendor-DOM walks into glass-ui's `<SegmentedTabs>` internals (no public ref). Documented but genuinely brittle. (LOW — vendor-imposed)

Everything else flagged by the greps is **clean and should NOT be touched**: `toastGuard.ts` (single-sourced, fail-on-rename-documented vendor contract), `useHighlightCSS.ts` (`document.head.querySelector("#id")` is the dynamic-stylesheet idiom, not a tree coupling), `contenteditable.ts` (own-document selection), `loaf-observer.ts` (dev-only diagnostic, feature-detected, returns disconnect handle), the `getBoundingClientRect` reads off owned refs in `playground/App.vue` + `AssetViewport.vue`, and the template `@pointermove`/`data-state` self-bindings.

---

## Finding 1 — DemoControlPoint.vue: raw window + element listeners (the un-migrated handle)

**File:** `demo/@/components/custom/DemoControlPoint.vue`
**Severity:** HIGH · **Category:** brittleness

This is the SINGLE demo component still using bare `addEventListener`/`removeEventListener`. It does it TWICE, in two different shapes:

### 1a. The per-drag window follow-loop (lines 131–145)

```js
const onMove = () => {
    if (!handle || syncing) return;
    emit("update:modelValue", { x: handle.value.x, y: handle.value.y });
};
const release = () => {
    releaseSelectSuppression();
    emit("dragend");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", release);
    window.removeEventListener("pointercancel", release);
};
window.addEventListener("pointermove", onMove);
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
```

These listeners are attached fresh on every `pointerdown` and self-remove on `release`. **The brittleness:** if the component unmounts mid-drag (scene switch, preset flip that re-renders the editor) BEFORE a `pointerup`/`pointercancel` fires, `release` never runs and the three window listeners LEAK — they keep firing `emit` against a destroyed component. There is no `onScopeDispose` backstop. This is exactly the failure mode `useScrollFade`'s doc-comment calls out as "the hand-managed attach-detach bookkeeping" that vueuse makes structural.

### 1b. The handle pointerdown listener (lines 245–248, 274–278)

```js
onMounted(() => {
    buildHandle();
    handleEl.value?.addEventListener("pointerdown", onHandlePointerDown);
});
…
onBeforeUnmount(() => {
    handleEl.value?.removeEventListener("pointerdown", onHandlePointerDown);
    handle?.dispose();
    handle = undefined;
});
```

The `removeEventListener` is keyed on `handleEl.value` at unmount time — if the ref already nulled (it can during teardown), the remove silently no-ops and the listener is orphaned on the detached node. Same hand-managed `onMounted`/`onBeforeUnmount` pattern the whole rest of the demo retired.

**PROPOSAL (excise the bare listeners → vueuse):**
- 1b: replace with `useEventListener(handleEl, "pointerdown", onHandlePointerDown)` — drops the entire `onMounted`/`onBeforeUnmount` attach-detach pair; vueuse re-binds on ref swap and auto-cleans on scope dispose.
- 1a: replace the three window listeners with `useEventListener` returning stop-fns captured at `pointerdown`, called from `release` AND registered for `onScopeDispose` backstop — OR, better, lift this whole drag-follow into the shared `useDragCapture` seam (`controls/composables/useDragCapture.ts`) the rest of the control surface already uses, so the window pointermove/up/cancel + select-suppression token is owned in ONE place (DRY). The comment at line 114–118 explains why it doesn't compose `useDragCapture`'s full capture machinery (the `drag2D` Draggable owns the pointer capture) — but the LISTENER part can still route through vueuse without touching capture.

**Stale-comment side-note:** the template doc-comment (line 9) claims the handle "KEEPS the `.control-point.handle` + `data-index` markup the existing live gate selects" — but the actual rendered root (line 15) is `<g data-demo-control-point>` with NO `data-index`. Either the gate selector changed and the comment is legacy, or the gate is now broken. Verify the `proof:easing-editor-live` clause (b) selector against the real markup and excise the dead comment.

---

## Finding 2 — SpringHeatmap.vue: raw ResizeObserver + MutationObserver

**File:** `demo/spring/SpringHeatmap.vue:260–283`
**Severity:** HIGH · **Category:** brittleness

```js
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

Two raw observers with hand-rolled mutable-`let` handles, `typeof … !== "undefined"` SSR-fallback guards, manual `.observe()`, and a manual `onScopeDispose` teardown. This is the exact `new ResizeObserver` shape the rest of the demo replaced with `useResizeObserver`.

**The `MutationObserver` watching `document.documentElement` class for dark-mode** is the more pointed brittleness: it re-paints on ANY class mutation of `<html>` (not just `.dark`), and it reaches the global document root to discover a theme change the demo ALREADY exposes reactively. `useGlobalDark()` from `@mkbabb/glass-ui/dark` (already used in `useHighlightCSS.ts:64`) gives `isDark` as a ref.

**PROPOSAL:**
- Replace `ResizeObserver` with `useResizeObserver(fieldEl, () => paint())` — drops the `typeof` guard, the `let ro`, and the `ro?.disconnect()` line (vueuse owns the lifecycle via `tryOnScopeDispose`).
- EXCISE the `MutationObserver` entirely. Replace with `const { isDark } = useGlobalDark(); watch(isDark, paint)`. This kills the global-document-root reach AND the over-broad attribute-filter re-paint storm. The `typeof MutationObserver` fallback also goes — explicit reactive source, no graceful DOM-poll fallback.

---

## Finding 3 — useSceneTransition.ts: test-only DOM coupling, double-written, read by nothing

**File:** `demo/app/useSceneTransition.ts:69–76`
**Severity:** MEDIUM · **Category:** workaround (test-hook in production code)

```js
if (typeof window !== "undefined") {
    (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes = types;
}
sceneHost.value?.setAttribute("data-last-vt-type", types[0] ?? "");
```

The SAME view-transition-types datum is written to BOTH a window global (`__lastVtTypes`) AND a DOM attribute (`data-last-vt-type`) on the scene host — purely so an external Playwright gate can read the resolved transition types (the live `:active-view-transition-type()` only exists for the transition's duration). Confirmed by grep: **nothing in the source tree reads either of these** — they are pure external-gate observables, with a redundant double-write.

This violates the precept directly: a test/instrumentation concern is baked into production reactive component code, with a `typeof window` fallback guard and a `(window as unknown as …)` cast hole.

**PROPOSAL:**
- COLLAPSE the double-write to ONE channel. If the gate reads the DOM attr (the more robust, per-element observable), drop `window.__lastVtTypes`. If it reads the global, drop the `setAttribute`. Decide ONE, delete the other.
- BETTER: move the surviving instrumentation behind an `import.meta.env.DEV` (or a dedicated `__kfTestHooks` module) guard so it is DCE'd from production exactly like `loaf-observer.ts` is (which is the established pattern — `main.ts`'s `import.meta.env.DEV` import). As written, this attribute is set in EVERY production scene switch for no production consumer.
- Remove the `(window as unknown as { … })` cast: declare the global on `Window` (as `loaf-observer.ts:35–39` does properly) if it survives.

---

## Finding 4 — [data-*] dataset couplings in reactive/hot code (+ a dead no-op handler)

**Severity:** MEDIUM · **Category:** brittleness

### 4a. useScrollSnapScene.ts — scene ids read out of DOM datasets

**File:** `demo/@/composables/useScrollSnapScene.ts:32, 47`

```js
const el = cards.value.find((c) => c.dataset.sceneId === id);   // :32
…
const id = card.dataset.sceneId ?? "";                          // :47
```

The composable receives `cards: Ref<HTMLElement[]>` and recovers each card's scene-id by reading `el.dataset.sceneId` back OUT of the DOM. The scene-id is authored data the caller already has at v-for time — round-tripping it through a `data-sceneId` attribute is a brittle coupling (a markup rename silently breaks the carousel's `scrollToScene`/`nearestCenterId`; the `?? ""` swallows the miss).

**PROPOSAL:** change the contract from `Ref<HTMLElement[]>` to `Ref<{ id: string; el: HTMLElement }[]>` (an owned ref↔id map — the SAME shape `playground/App.vue` uses with `viewportRef.value.assetElMap[id]`). The `find`/loop then key on the owned `id`, never the DOM. EXCISE both `dataset.sceneId` reads.

### 4b. useScrollSnapScene.ts — dead `onScroll` no-op

**File:** `demo/@/composables/useScrollSnapScene.ts:56–61`

```js
const onScroll = (): void => {
    // …we do not write Vue state per scroll frame…
    void nearestCenterId;
};
```

`onScroll` does nothing but `void nearestCenterId` (a no-op reference to silence unused-var). It's exported and bound by the carousel but performs no work. Per "NO fall-through behavior / make it fail explicitly or excise" — this is dead code dressed as a handler.

**PROPOSAL:** EXCISE `onScroll` and its binding. If the snapped-id sync is genuinely needed, implement it (e.g. `useEventListener(scroller, "scrollend", () => emit(nearestCenterId()))`) — but don't ship an exported no-op.

### 4c. EasingTarget.vue — curve names read out of dataset in the rAF painter

**File:** `demo/easing/EasingTarget.vue:304`

```js
for (const el of balls) {
    const name = el.dataset.curve ?? "";       // :304
    const isActive = name === activeName;
    el.style.transform = `translateX(${trackBallXAt(fnForCurve(name), isActive, phase)}px)`;
}
```

Inside the hot per-frame painter, each ball's curve-name is recovered via `el.dataset.curve` and resolved against `fnForCurve(name)`. The `?? ""` masks a missing `data-curve` as the empty curve (silent identity-fn fallback). The component owns `trackBallEls` (a v-for ref array) and the visible-curve list — it can build a parallel `{ el, name, fn }[]` once per re-wire (it already re-wires on `viewMode`/`visibleCurves` change at lines 347–348) instead of string-parsing the DOM every frame.

**PROPOSAL:** in `wirePainter` build an owned `{ el, fn, isActiveName }[]` snapshot keyed to the same v-for source the refs come from; the painter iterates that array — NO `dataset` read, NO `?? ""` silent fallback, and the per-frame `fnForCurve` map-lookup is hoisted out of the hot loop. Note: this is a hot-path painter so the migration must keep the imperative `el.style.transform` write (that part is the intended off-render-graph optimization, NOT brittleness).

> `square/useSquareAnimations.ts:247` (`setAttribute("data-palette-sweep")`) is a DELIBERATE observable for a CSS bloom + a design-probe, written/removed symmetrically off an owned `box` ref. It is the acceptable shape (self-owned attr, paired add/remove) — leave it, but note its kinship with Finding 3 if the design-probe is test-only.

---

## Finding 5 — useTabStripScroll.ts: querySelector into glass-ui SegmentedTabs internals

**File:** `demo/@/components/custom/animation-controls/controls/composables/useTabStripScroll.ts:52, 72`
**Severity:** LOW (vendor-imposed) · **Category:** brittleness

```js
const activeBtn = tabsHeaderEl.value?.querySelector<HTMLElement>(
    "[role=tab][aria-selected=true]",
);                                                                      // :52
…
tabsListElRef.value =
    tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]") ?? null;   // :72
```

Two `querySelector` DOM walks into glass-ui `<SegmentedTabs>`'s rendered internals — there is no public ref for the `role=tablist` node or the active `role=tab` button (the comment at lines 24–29 documents this as a vendor-DOM contract, the `[data-sonner-toaster]` disposition). The `?? null` swallows a vendor markup change silently (the overflow probe then observes nothing).

This is the WEAKEST finding because it's genuinely vendor-imposed: glass-ui exposes no ref. But it is still a deeply-coupled selector reach in reactive code that breaks silently on a glass-ui internals change.

**PROPOSAL (in priority order):**
1. **Best (cross-repo):** glass-ui `<SegmentedTabs>` should `defineExpose` its `tablistEl` + active-trigger ref (a BB/BC-tranche ask). Then this composable consumes the ref directly — no querySelector. This is the principled fix and matches the memory note "all glass-ui/dock changes must go in glass-ui repo."
2. **In-repo hardening now:** centralize the two selectors into a single named `SEGMENTED_TABS_DOM` contract module (the `toastGuard.ts` shape — one greppable, fail-on-rename-documented source), and make the `?? null` an EXPLICIT throw-or-warn in DEV rather than a silent swallow, so a glass-ui markup change surfaces loudly instead of degrading the overflow fade silently. Per the precept: "made to fail EXPLICITLY."

---

## Confirmed-clean (do NOT touch)

| File:line | Pattern | Why it's fine |
|---|---|---|
| `demo/@/utils/toastGuard.ts:18,27` | `closest("[data-sonner-toaster]")` | Single-sourced vendor contract, fail-on-rename documented, greppable. The reference standard. |
| `demo/@/components/.../useHighlightCSS.ts:14,75` | `document.head.querySelector("#id")` | Dynamic-stylesheet `<style>` idiom (getElementById-equiv into `<head>`), not a component-tree coupling. |
| `demo/@/components/.../keyframes/utils/contenteditable.ts:10` | `target.ownerDocument.defaultView.getSelection()` | Own-document selection, explicitly avoids global `document` reach. |
| `demo/app/loaf-observer.ts:60` | `new PerformanceObserver` | Dev-only (DCE'd via `import.meta.env.DEV`), feature-detected, returns disconnect handle. No vueuse equiv. |
| `demo/playground/App.vue:174,207-208` · `AssetViewport.vue:232` | `getBoundingClientRect()` | Geometry reads off OWNED refs, bound via template `@pointermove`. |
| `demo/@/composables/.../useScrollFade.ts` | (the model) | Canonical `useEventListener` + `useResizeObserver` ref-direct migration. |
| `demo/@/components/.../useOrbitalPointer.ts:225-232` | shared doc-listener array | vueuse stop-fns, drained via `removeDocListeners`; clean dedup. |
| `AnimationControls.vue` `data-state`/`role=tabpanel` | template attrs + CSS comments | Self-owned bindings on the component's OWN panel divs, not vendor walks. |

---

## Decomposition note (cross-lane fold for R)

This lane found no demo god-modules (the demo decomposition is genuinely fine — real directory sub-modules: `animation-controls/{components,composables,controls,keyframes,stores,timeline}`, `orbital-drag/composables`, etc.). The FLAT-hyphenated-sibling anti-pattern the Q post-mortem flagged is in `src/animation/` (engine-*.ts), NOT in demo. Demo's `useTabStripScroll`/`useScrollFade`/`useSheetGesture` are properly colocated composables. The one demo composable worth re-homing: `useScrollSnapScene.ts` lives at `demo/@/composables/` (the 2-file shared bucket) but is single-consumer (the phone carousel) — once Finding 4a/4b land it could move next to its consumer.
