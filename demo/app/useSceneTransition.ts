import type { Ref } from "vue";
import { startViewTransition } from "@mkbabb/glass-ui/motion-core";

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
) {
    function runSceneSwitch(id: string) {
        const { finished } = startViewTransition(() => mutate(id));
        finished.finally(() => {
            sceneHost.value?.focus();
        });
    }

    return { runSceneSwitch };
}
