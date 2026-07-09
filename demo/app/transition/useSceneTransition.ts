import type { Ref } from "vue";
import { viewTransition } from "@mkbabb/keyframes.js";

import { sceneIndex } from "../scene/scenes";

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
 * Q.WC3 S3 (NI-1) — the scene-switch DERIVES DIRECTION. `sign(sceneIndex(target) −
 * sceneIndex(current))` (over the `sceneIndex` ordered-index seam, S1) derives a
 * `view-transition-type` of `forward` / `backward`, passed to kf's `viewTransition`
 * as `{ types }`. The type is set on the live transition (`:active-view-transition-
 * type()` becomes queryable for its duration), so a generic glass-ui type-keyed
 * slide recipe — the owner-domain HANDOFF (S.G2 S11: the typed slide belongs in
 * glass-ui's `view-transition.css`, not demo-side) — would consume it with no demo
 * CSS. Until then the untyped cross-fade is the look on every engine. Where
 * `view-transition-type` is unsupported (Firefox/Safari as of 2026) kf's dispatch
 * drops the arg; the single VT name (`scene-subject`) is PRESERVED — direction
 * rides `view-transition-type`, never a second name.
 *
 * NOTE the call shape: kf's `viewTransition` takes the mutate callback as the
 * FIRST positional arg and `{ types }` as the SECOND options arg — it feature-
 * detects the native typed-`update` object overload internally and DROPS `types`
 * (the untyped cross-fade) on a callback-only engine, never a throw.
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
        if (import.meta.env.DEV && typeof window !== "undefined") {
            (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes =
                types;
        }
        sceneHost.value?.setAttribute(
            "data-last-vt-type",
            types[0] ?? "",
        );

        const { finished } = viewTransition(
            () => mutate(id),
            types.length ? { types } : {},
        );
        finished.finally(() => {
            sceneHost.value?.focus();
        });
    }

    return { runSceneSwitch };
}
