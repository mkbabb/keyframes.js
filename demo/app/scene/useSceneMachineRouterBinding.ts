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
// The dock Select model, ?anim=, and localStorage are READ-ONLY projections of
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
import {
    useSceneMachine,
    HOME_SCENE_ID,
    gcAndMigrateSceneKeyspace,
} from "@state";
import { sceneMap, allScenes } from "./scenes";
import { getStoredAnimationGroupControlOptions } from "@state";

/** Map a vue-router route name to a known SceneId, falling back to home. */
function routeToScene(name: unknown): string {
    const id = typeof name === "string" ? name : undefined;
    return id && sceneMap.has(id) ? id : HOME_SCENE_ID;
}

/**
 * Wire the route ⇆ machine reconcile + the first-load seed. Returns nothing —
 * the machine is the single authority; consumers read `useSceneMachine()`.
 *
 * First-load precedence (MED-6): deep-link URL > ?state= (router.beforeEach
 * already redirected to the state's activeScene) > localStorage (the machine's
 * own persisted activeScene, consulted ONLY for bare #/) > ?anim= (applied on
 * SCENE_READY, not here).
 */
export function useSceneMachineRouterBinding(opts: {
    /** Lazily read the VT-wrapped scene switcher (defined after this binding
     *  in App's setup; read at navigation time, so the later binding resolves). */
    getRunSceneSwitch: () => (id: string) => void;
}) {
    const router = useRouter();
    const route = useRoute();
    const machine = useSceneMachine();

    // ── boot migration: a stored dead-route activeScene lands on home (T.E1/T.E3) ──
    // A returning user whose persisted activeScene names a PRUNED scene
    // (compose/morph/motion-path, OD-1) is coerced to home BEFORE the first-load
    // seed dispatches it — no boot onto a route that no longer exists.
    machine.migrateActiveScene(allScenes.map((s) => s.id));

    // ── boot GC + keyspace migration (T.B9): ONE sweep over ALL THREE per-scene
    // tables (the machine's perScene snapshot + both option stores). Prunes
    // orphaned pruned-scene buckets AND migrates any legacy PascalCase option
    // bucket ("Cube") to the registry SceneId ("cube") — the collapse that ends
    // the two-keyspace drift. ──
    gcAndMigrateSceneKeyspace(allScenes.map((s) => s.id));

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
    // loop). Preserves ?anim= (a read-only projection); strips ?state= (a stale
    // snapshot once consumed).
    watch(
        () => machine.activeScene.value,
        (scene) => {
            const current = routeToScene(route.name);
            if (current === scene) return; // ECHO GUARD — route already matches
            const { state: _drop, ...query } = route.query;
            writerEcho = true;
            router.push({ name: scene, query }).catch((e) => {
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

    // ── ?anim= projection (read-only · scene-keyed · S3) ──
    // The query param is a one-way PROJECTION of the active scene's
    // selectedAnimation. Scene-keyed (it keys off the CURRENT scene's superKey)
    // so a stale anim name can never cross a scene boundary. Applied for
    // back/forward navigation; the FIRST-LOAD ?anim= is applied AFTER the seed
    // (MED-6: scene-keyed, after the deep-link scene is known), NOT at setup.
    function applyAnimFromUrl() {
        const anim = route.query.anim;
        if (typeof anim !== "string" || !anim) return;
        const scene = sceneMap.get(machine.activeScene.value);
        if (!scene) return;
        const controls = getStoredAnimationGroupControlOptions(scene.superKey);
        if (controls.selectedAnimation !== anim) {
            controls.selectedAnimation = anim;
        }
    }
    watch(() => route.query.anim, applyAnimFromUrl);

    // ── First-load seed (deep-link wins over localStorage — S5/MED-6) ──
    // The reducer's initial status is `idle` with activeScene = the persisted
    // (localStorage) scene. Seed from the URL: if the URL names a real scene,
    // it WINS; only a bare #/ falls back to the persisted activeScene. The
    // first-load precedence is: deep-link URL > ?state= (router.beforeEach
    // already redirected) > localStorage (the persisted activeScene) > ?anim=
    // (applied LAST, scene-keyed, once the seed scene is known).
    router.isReady().then(() => {
        const urlScene = routeToScene(route.name);
        if (urlScene !== HOME_SCENE_ID) {
            machine.dispatch({ type: "NAVIGATE", to: urlScene });
        } else {
            machine.dispatch({ type: "NAVIGATE", to: machine.activeScene.value });
        }
        // ?anim= applied AFTER the seed — scene-keyed off the resolved scene.
        applyAnimFromUrl();
    });
}
