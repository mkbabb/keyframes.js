import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { restoreStateFromParam } from "@components/custom/animation-controls/stores/hashSharing";

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

const routes: RouteRecordRaw[] = [
    { path: "/", name: "home", component: Stub },
    { path: "/cube", name: "cube", component: Stub },
    { path: "/amiga", name: "amiga", component: Stub },
    { path: "/square", name: "square", component: Stub },
    { path: "/easing", name: "easing", component: Stub },
    { path: "/spring", name: "spring", component: Stub },
    { path: "/sequence", name: "sequence", component: Stub },
    { path: "/motion-path", name: "motion-path", component: Stub },
    // The standalone /starting-style route was REMOVED in one motion with its
    // scene + descriptor (H.W5.S3): the Discrete (@starting-style) mode is now a
    // sub-view of the Spring scene (Spring → "Discrete transition"), not its own
    // route. No legacy alias — a /starting-style deep-link falls to the catch-all
    // redirect home (the scene id no longer exists). Survivor route set:
    // home/cube/amiga/square/easing/spring/sequence/motion-path.
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
