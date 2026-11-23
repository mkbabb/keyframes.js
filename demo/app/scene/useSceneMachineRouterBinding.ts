// ─────────────────────────────────────────────────────────────────────────────
// THE ROUTE RECONCILE (H.W1 S3 · WV-W1-HIGH-2: the route is an EXTERNAL input).
//
// The browser OWNS the URL via popstate (the route storm's FIRST nav is always
// popStateHandler) — so a pure reducer cannot OWN activeScene without a
// reconcile rule. The route is reconciled with EXACTLY:
//
//   • ONE READER  — router.afterEach → the scene switch (covers popstate,
//     a direct hash, and the dock Select push alike: every URL change funnels
//     here). KFA-24 (X.KF.W13X.scene): an in-app URL change reconciles through
//     the SAME View-Transition switch the dock uses (`runSceneSwitch`), so a
//     hash or back/forward nav is the same cross-dissolve, never a hard cut. The
//     initial navigation has no source scene to dissolve from and dispatches
//     NAVIGATE directly (the first-load seed below).
//   • ONE WRITER  — watch(machine.activeScene) → router.push   (the machine is
//     the source; the URL projects it).
//   • an ACTIVESCENE-EQUALITY ECHO GUARD — the writer no-ops when the route
//     already equals machine.activeScene (so the reader→NAVIGATE→writer→push
//     cycle cannot re-fire). This kills the route storm at its FIXED POINT —
//     NOT by debouncing harder.
//
// The dock Select model and ?anim= are READ-ONLY projections of
// machine.activeScene; they can never write back into scene selection. This file
// REPLACES useSceneRouter.ts + useSceneUrl.ts in ONE motion (no legacy beside).
// ─────────────────────────────────────────────────────────────────────────────

import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    isNavigationFailure,
    NavigationFailureType,
    START_LOCATION,
} from "vue-router";
import { useSceneMachine, HOME_SCENE_ID } from "@state";
import { sceneMap } from "./scenes";

/** Map a vue-router route name to a known SceneId, falling back to home. */
function routeToScene(name: unknown): string {
    const id = typeof name === "string" ? name : undefined;
    return id && sceneMap.has(id) ? id : HOME_SCENE_ID;
}

/**
 * Wire the route ⇆ machine reconcile + the first-load seed. Returns nothing —
 * the machine is the single authority; consumers read `useSceneMachine()`.
 *
 * First load: the URL, and only the URL (FORTY-SIXTH E). A bare address opens
 * Home; the scene's URL keys apply once it binds.
 */
export function useSceneMachineRouterBinding(opts: {
    /** Lazily read the VT-wrapped scene switcher (defined after this binding
     *  in App's setup; read at navigation time, so the later binding resolves). */
    getRunSceneSwitch: () => (id: string) => void;
}) {
    const router = useRouter();
    const route = useRoute();
    const machine = useSceneMachine();

    // The echo guard's generation: the WRITER bumps it before a push so the
    // immediately-following afterEach (the echo of our own push) is recognised
    // and not re-dispatched. Combined with the activeScene-equality check below
    // this gives a single, stable fixed point.
    let writerEcho = false;

    // ── THE ONE READER ──
    // Every URL change (popstate, a direct hash, the dock push, a programmatic
    // push) funnels through afterEach → the scene switch. The machine reconciles.
    router.afterEach((to, from) => {
        const scene = routeToScene(to.name);
        if (writerEcho) {
            // This afterEach is the echo of OUR OWN push — already in sync.
            writerEcho = false;
            return;
        }
        if (scene === machine.activeScene.value) return; // already reconciled
        if (from === START_LOCATION) {
            machine.dispatch({ type: "NAVIGATE", to: scene });
            return;
        }
        opts.getRunSceneSwitch()(scene);
    });

    // ── THE ONE WRITER ──
    // The machine's activeScene is the source; project it onto the URL. The
    // ECHO GUARD: no-op when the route already matches (breaks the feedback
    // loop). KF-URL — a scene's query is ITS view (urlState.ts), so the push
    // carries none of the leaving scene's keys: the arriving scene writes its
    // own once it binds, and Back restores the leaving scene's from history.
    watch(
        () => machine.activeScene.value,
        (scene) => {
            const current = routeToScene(route.name);
            if (current === scene) return; // ECHO GUARD — route already matches
            writerEcho = true;
            router.push({ name: scene }).catch((e) => {
                writerEcho = false;
                // Re-throw non-navigation errors (e.g. broken route guards);
                // swallow only expected navigation outcomes: duplicate or aborted.
                if (
                    !isNavigationFailure(
                        e,
                        NavigationFailureType.duplicated |
                        NavigationFailureType.aborted,
                    )
                ) {
                    throw e;
                }
            });
        },
    );

    // KF-URL — `?anim=` is no longer a read-only projection here: the channel
    // is one of the scene's URL keys (useSceneUrlState), read on bind and on
    // Back/Forward, and written when the pick changes.

    // ── First-load seed: the route's scene ──
    // The address is the page (FORTY-SIXTH E): a bare #/ opens Home, whatever
    // the last visit showed; a scene link opens that scene.
    //
    // OD19-ALL (load) — the seed runs IN SETUP when the initial navigation has
    // already resolved, which it has on every boot (`main.ts` mounts after the
    // engine chunk resolves, long after `app.use(router)`'s first navigation).
    // Seeded here, the first render is the linked scene. A not-yet-resolved
    // router (no boot path does this) keeps the microtask seat.
    const seed = () => machine.dispatch({ type: "NAVIGATE", to: routeToScene(route.name) });
    if (router.currentRoute.value === START_LOCATION) void router.isReady().then(seed);
    else seed();
}
