// ─────────────────────────────────────────────────────────────────────────────
// THE ROUTE RECONCILE (H.W1 S3 · WV-W1-HIGH-2: the route is an EXTERNAL input).
//
// The browser OWNS the URL via popstate (the route storm's FIRST nav is always
// popStateHandler) — so a pure reducer cannot OWN activeScene without a
// reconcile rule. The route is reconciled with EXACTLY:
//
//   • ONE READER  — router.afterEach → dispatch(NAVIGATE(to))  (covers popstate,
//     deep-link, and the dock Select push alike: every URL change funnels here).
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
import { useSceneMachine, HOME_SCENE_ID } from "@components/custom/animation-controls/stores";
import { sceneMap, allScenes } from "./scenes";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

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
export function useSceneMachineRouter() {
    const router = useRouter();
    const route = useRoute();
    const machine = useSceneMachine();

    // ── boot GC: prune orphan superKeys from prior sessions (ST-7) ──
    machine.gcOrphans(allScenes.map((s) => s.id));

    // The echo guard's generation: the WRITER bumps it before a push so the
    // immediately-following afterEach (the echo of our own push) is recognised
    // and not re-dispatched. Combined with the activeScene-equality check below
    // this gives a single, stable fixed point.
    let writerEcho = false;

    // ── THE ONE READER ──
    // Every URL change (popstate, deep-link, the dock push, a programmatic
    // push) funnels through afterEach → NAVIGATE. The machine reconciles.
    router.afterEach((to) => {
        const scene = routeToScene(to.name);
        if (writerEcho) {
            // This afterEach is the echo of OUR OWN push — already in sync.
            writerEcho = false;
            return;
        }
        if (scene === machine.activeScene.value) return; // already reconciled
        machine.dispatch({ type: "NAVIGATE", to: scene });
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
            router.push({ name: scene, query }).catch(() => {
                writerEcho = false;
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
