import { nextTick, ref, type Ref } from "vue";
import { viewTransition, type ViewTransitionHandle } from "@mkbabb/keyframes.js";
import { loadScene, warmScenesAtIdle } from "../scene/scenes";

/**
 * Routes the scene-id mutation through the platform's native View Transitions.
 *
 * S.F1 VT-d DOGFOOD — the scene-swap (the demo's most-seen motion) now rides kf's
 * OWN LIGHT `viewTransition` dispatch (`@mkbabb/keyframes.js`), not glass-ui's
 * helper: the library eats its own View-Transitions cooking. The
 * compositor cross-fades the old scene paint into the new one, with the
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
 * KFA-25 / KFA-76 / KFA-26 / KFA-201 (X.KF.W13X.scene) — the swap is ONE
 * cross-dissolve from the source scene to the destination scene, whole:
 *   1. BEFORE the transition starts, the destination chunk is resolved
 *      (`loadScene`; every chunk is also warmed at idle after first paint) and
 *      any overlay mid-exit (the Scene Select the pick just closed) is taken
 *      out in one frame — so the old-state capture carries no popover, and no
 *      ghost rows linger over the new scene.
 *   2. The update callback mutates the scene id and then AWAITS the scene's
 *      commit point (`whenSceneReady`: the new scene bound, the chrome flipped
 *      with it) — so the new-state capture is the resolved scene, never the
 *      `<Suspense>` skeleton, and the chunk's evaluation never lands inside the
 *      visible cross-fade (the platform holds the old paint while it runs).
 * A newer switch supersedes one still preparing (a generation count), so a
 * fast double pick lands on the last pick only.
 *
 * KFA-24 — this is the ONE scene-nav entry: the dock pick, the SharePopover
 * restore AND every URL change (a direct hash, back/forward — the route
 * reader in `useSceneMachineRouterBinding`) run through `runSceneSwitch`.
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
export function useSceneTransition(opts: {
    mutate: (id: string) => void;
    sceneHost: Ref<HTMLElement | null>;
    whenSceneReady: (id: string) => Promise<void>;
}) {
    const { mutate, sceneHost, whenSceneReady } = opts;

    // KFA-12 (X.KF.W13V.k) — the backend that carried the LAST switch, read
    // off the dispatch's own handle. `useSceneSwap` stands its spring down only
    // when this reads "view-transition": a feature probe said "VT owns the
    // motion" even when the call threw and hard-cut.
    const lastSwapBackend = ref<ViewTransitionHandle["backend"] | null>(null);

    // KF-RES-1 (OD19 residue-2, COHESION §0gq.3) — the idle warm of every
    // scene chunk starts once the FIRST scene's content has painted, never at
    // the shell's mount. An idle callback has no deadline: on a deep link the
    // main thread idles while the route's own chunk is in flight, so a warm
    // armed at mount fetched every other scene (and Home's Aurora) before the
    // route's content (cold #/amiga: 1707 KB against 1427). `onSceneContent`
    // is the scene host's <Suspense> resolve; the warm is armed in the next
    // frame, so its idle period comes after that frame's paint.
    let warmArmed = false;
    function onSceneContent() {
        if (warmArmed) return;
        warmArmed = true;
        requestAnimationFrame(warmScenesAtIdle);
    }

    let generation = 0;

    async function runSceneSwitch(id: string) {
        const gen = ++generation;
        const start = performance.mark("scene-swap:start").startTime;
        // A rejected chunk is not handled here: the mount below surfaces it
        // through <Suspense>, exactly as an un-preloaded switch would.
        await Promise.allSettled([loadScene(id), settleClosingOverlays()]);
        if (gen !== generation) return;
        performance.measure("scene-swap:prepare", { start });
        const { finished, backend } = viewTransition(async () => {
            const commit = performance.now();
            const ready = whenSceneReady(id);
            mutate(id);
            await ready;
            await nextTick();
            performance.measure("scene-swap:commit", { start: commit });
        });
        lastSwapBackend.value = backend;
        finished.finally(() => {
            performance.measure("scene-swap:total", { start });
            sceneHost.value?.focus();
        });
    }

    return { runSceneSwitch, lastSwapBackend, onSceneContent };
}

/**
 * KFA-26 / KFA-201 — take every overlay that is mid-exit out of the old-state
 * capture in ONE frame. A pick closes its Select in the same event that asks
 * for the switch; one frame later the closing content carries reka's
 * `data-state="closed"` and starts its exit animation. The cross-dissolve
 * about to start IS that content's exit, so its own exit animation is
 * finished at once (not awaited: awaiting it held the swap ~300 ms,
 * OD19 KF-P4): `finish()` fires `animationend`, the presence unmounts the
 * content, and the capture carries no popover, so no ghost rows dissolve over
 * the new scene. An infinite animation is not an exit and is left alone.
 */
async function settleClosingOverlays(): Promise<void> {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    for (const a of document.getAnimations()) {
        const target = (a.effect as KeyframeEffect | null)?.target;
        if (
            target instanceof Element &&
            target.closest('[data-state="closed"]') !== null &&
            a.effect?.getComputedTiming().endTime !== Infinity
        ) {
            a.finish();
        }
    }
    await nextTick();
}
