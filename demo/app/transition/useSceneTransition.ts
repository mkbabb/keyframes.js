import { ref, type Ref } from "vue";
import { viewTransition, type ViewTransitionHandle } from "@mkbabb/keyframes.js";

/**
 * Routes the scene-id mutation through the platform's native View Transitions.
 *
 * S.F1 VT-d DOGFOOD — the scene-swap (the demo's most-seen motion) now rides kf's
 * OWN LIGHT `viewTransition` dispatch (`@mkbabb/keyframes.js`), not glass-ui's
 * helper: the library eats its own View-Transitions cooking. `viewTransition`
 * wraps ONLY the synchronous key mutation — never the async `<Suspense>` loader —
 * so the compositor cross-fades the old scene paint into the new one, with the
 * shared-element morph riding the `view-transition-name` on the scene host
 * (`App.vue`, ≤ 1 element per state so names never collide) and the PRM degrade
 * routed through kf's ONE `withReducedMotion` gate (a `reduce` query snaps the
 * mutate directly — `backend: "immediate"`). The glass-ui `view-transition.css`
 * (loaded via `@import "@mkbabb/glass-ui/styles"`) owns the LOOK of the swap (the
 * untyped cross-fade + the `scene-subject` shared-element morph); kf owns the
 * DISPATCH. The demo carries NO `::view-transition-*` CSS of its own (S.G2 S11 /
 * proof:icon-paint-live — those animation glyphs are glass-ui-owned).
 *
 * KFA-136 (X.KF.W13V.u) — the swap is UNTYPED. A `forward`/`backward`
 * `view-transition-type` used to be derived from the scene order and passed on
 * every switch, with two unread test hooks beside it, but no stylesheet keyed
 * on either type: the swap was the untyped cross-fade regardless. The dead
 * derivation is deleted. A directional look is a design decision against
 * glass's installed route grammar (`lateral` + `--route-direction`, which also
 * pushes the root, so the chrome would need its own naming) — not a type
 * emitted into the void.
 *
 * Feature-detect is built into the dispatch: where `document.startViewTransition`
 * is absent it calls `mutate()` synchronously and settles `finished` immediately
 * (`backend: "immediate"`), so the no-VT path falls through to the engine-
 * dogfooding `SpringProgress` cross-dissolve (`useSceneSwap`) UNCHANGED — the
 * dogfood fallback is preserved, not removed.
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
    // KFA-12 (X.KF.W13V.k) — the backend that carried the LAST switch, read
    // off the dispatch's own handle. `useSceneSwap` stands its spring down only
    // when this reads "view-transition": a feature probe said "VT owns the
    // motion" even when the call threw and hard-cut, and a switch that never
    // came through here (a direct hash, back/forward) has no VT at all.
    const lastSwapBackend = ref<ViewTransitionHandle["backend"] | null>(null);

    function runSceneSwitch(id: string) {
        const { finished, backend } = viewTransition(() => mutate(id));
        lastSwapBackend.value = backend;
        finished.finally(() => {
            sceneHost.value?.focus();
        });
    }

    return { runSceneSwitch, lastSwapBackend };
}
