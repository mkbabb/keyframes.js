import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { restoreStateFromParam } from "@components/custom/animation-controls/stores/hashSharing";
import { allScenes, HOME_SCENE_ID } from "./scenes";

/**
 * Hash-based router for the keyframes.js demo.
 * Uses hash mode for GitHub Pages compatibility (no server-side routing).
 *
 * URL structure: /#/cube?anim=Matrix&state=eyJvcHRp...
 *
 * Each route maps to a scene ID. Actual rendering stays in App.vue via
 * KeepAlive + dynamic <component :is> — routes just control which scene is active.
 */
const Stub = { render: () => null };

// R.W5 C.5 — the route list is GENERATED from the scene registry (`allScenes`),
// not hand-mirrored. Each scene id → its path (`home` → `/`, else `/<id>`); the
// `Stub` is declared ONCE and shared. A new scene in scenes.ts gets its route for
// free — no second list to drift. A removed scene id (e.g. the folded
// /starting-style) is gone here automatically; a stale deep-link falls to the
// catch-all redirect home.
const routes: RouteRecordRaw[] = [
    ...allScenes.map(
        (s): RouteRecordRaw => ({
            path: s.id === HOME_SCENE_ID ? "/" : `/${s.id}`,
            name: s.id,
            component: Stub,
        }),
    ),
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Intercept ?state= on initial navigation to restore shared state before the
// first render, matching the timing of the old initFromHash(). The deprecated
// `next(value)` guard is gone (S5): a guard RETURNS its value (a redirect
// location object or `true`/undefined), per vue-router 5 — the 14× live
// `next() is deprecated` flood (CP-LOW-3) dies with it.
let initialNavDone = false;

router.beforeEach((to) => {
    if (!initialNavDone && to.query.state) {
        initialNavDone = true;
        const stateParam = to.query.state as string;
        const result = restoreStateFromParam(stateParam);
        const { state: _, ...cleanQuery } = to.query;
        // The ?state= guard RETURNS a redirect LOCATION (not `true`): the
        // deep-linked state's activeScene WINS (WV-W1-LOW-1). The machine's
        // first-load seed (useSceneMachineRouter) then reconciles off this URL.
        const targetName = result.activeScene ?? (to.name as string);
        return { name: targetName, query: cleanQuery };
    }
    initialNavDone = true;
    return true;
});
