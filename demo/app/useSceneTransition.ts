import type { Ref } from "vue";
import { startViewTransition } from "@mkbabb/glass-ui/motion-core";

import { sceneIndex } from "./scenes";

/**
 * Routes the scene-id mutation through the platform's native View Transitions.
 *
 * The scene-swap is the demo's most-seen motion. `startViewTransition` (glass-ui's
 * shipped helper) wraps ONLY the synchronous key mutation — never the async
 * `<Suspense>` loader — so the compositor cross-fades the old scene paint into the
 * new one, with the shared-element morph riding the `view-transition-name` on the
 * scene host (`App.vue`, ≤ 1 element per state so names never collide) and the PRM
 * degrade free in glass-ui's `view-transition.css` (already loaded via the demo's
 * `@import "@mkbabb/glass-ui/styles"`).
 *
 * Q.WC3 S3 (NI-1) — the scene-switch carries DIRECTION. `sign(sceneIndex(target) −
 * sceneIndex(current))` (over the `sceneIndex` ordered-index seam, S1) derives a
 * `view-transition-type` of `forward` / `backward`, passed as glass-ui's two-arg
 * `startViewTransition(mutate, { types })`. The type-keyed CSS (in `App.vue`,
 * beside the `scene-subject` rule) slides the old/new scene the right way; where
 * `view-transition-type` is unsupported (Firefox/Safari as of 2026) glass-ui's
 * wrapper feature-detect drops the arg and the untyped cross-fade is the free
 * degrade. The single VT name (`scene-subject`) is PRESERVED — direction rides
 * `view-transition-type`, not a second name.
 *
 * NOTE the call shape: glass-ui's wrapper takes the mutate callback as the FIRST
 * positional arg and `{ types }` as the SECOND options arg — NOT the native
 * `document.startViewTransition({ update, types })` object overload (passing
 * `{ update, types }` to the glass-ui wrapper would treat the whole object as the
 * mutate callback and silently drop `types`).
 *
 * Feature-detect is built into the helper: where `document.startViewTransition` is
 * absent it calls `mutate()` synchronously and settles `finished` immediately, so
 * the no-VT path falls through to the engine-dogfooding `SpringProgress`
 * cross-dissolve (`useSceneSwap`) UNCHANGED — the dogfood fallback is preserved,
 * not removed.
 *
 * a11y MANDATORY: View Transitions morph layout but do not manage focus. On
 * `finished` we route focus to the new scene's host container (`tabindex="-1"`),
 * announcing the context change to keyboard/AT users — an upgrade the spring fade
 * lacked. The helper's `finished` never rejects (a skipped/aborted transition
 * settles cleanly), so the focus route always runs.
 */
export function useSceneTransition(
    mutate: (id: string) => void,
    sceneHost: Ref<HTMLElement | null>,
    currentSceneId: Ref<string>,
) {
    function runSceneSwitch(id: string) {
        // Q.WC3 S3 — the directional type from the ordered-index delta. A forward
        // move (target later in `allScenes`) slides left→right; a backward move
        // mirrors it. An unknown index (−1) or a same-index re-entry yields no
        // direction (the untyped cross-fade).
        const from = sceneIndex(currentSceneId.value);
        const to = sceneIndex(id);
        const types: string[] =
            from < 0 || to < 0 || from === to
                ? []
                : to > from
                  ? ["forward"]
                  : ["backward"];

        // The test hook the runtime gate reads (the directional-derivation
        // observable — `:active-view-transition-type()` is live for only the
        // transition's duration, so the gate observes the resolved types here, not
        // a mid-transition snapshot race). The SAME committed-state instrumentation
        // pattern the perf gate uses.
        if (typeof window !== "undefined") {
            (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes =
                types;
        }
        sceneHost.value?.setAttribute(
            "data-last-vt-type",
            types[0] ?? "",
        );

        const { finished } = startViewTransition(
            () => mutate(id),
            types.length ? { types } : undefined,
        );
        finished.finally(() => {
            sceneHost.value?.focus();
        });
    }

    return { runSceneSwitch };
}
