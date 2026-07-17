/**
 * withSetup — the shared composable mount harness (TC-5 · V.W9, from
 * R2-07's gate/test-prune blueprint).
 *
 * A composable that registers component lifecycle hooks (`onMounted`,
 * `onUnmounted`, `onScopeDispose`, a `watch`/`useRafLoop` that stops on
 * unmount) cannot exercise its TEARDOWN under a bare `effectScope().run(fn)` +
 * `scope.stop()`: `effectScope` fires `onScopeDispose` but NEVER `onMounted`/
 * `onUnmounted`, so a `useRafLoop(...); onUnmounted(stop)` composable's loop is
 * never actually disposed by the test — the "teardown ran" claim is vacuous.
 *
 * `withSetup` mounts the composable inside a real (headless) component instance
 * via `createApp`, so `onMounted` fires on mount and `onUnmounted` fires on
 * `app.unmount()` — the disposal the composable owns genuinely runs. Mirrors the
 * canonical VueUse composable-test harness.
 *
 * Usage:
 *   const [anim, app] = withSetup(() => useSquareDemo(ref(null)));
 *   try { ...assertions... } finally { app.unmount(); }
 *
 * The mount host is a detached `<div>` (jsdom): no document attachment needed
 * for lifecycle to fire, and nothing leaks into the test document.
 */
import { createApp } from "vue";
import type { App } from "vue";

/**
 * Run `composable` inside a mounted component instance and return its result
 * plus the owning `App`. Call `app.unmount()` (typically in a `finally`) to run
 * the composable's real teardown.
 */
export function withSetup<T>(composable: () => T): [T, App] {
    let result!: T;
    const app = createApp({
        setup() {
            result = composable();
            // No template — the harness exercises the composable, not a render.
            return () => null;
        },
    });
    app.mount(document.createElement("div"));
    return [result, app];
}
