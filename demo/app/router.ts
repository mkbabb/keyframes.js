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
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Intercept ?state= on initial navigation to restore shared state
// before the first render, matching the timing of the old initFromHash().
let initialNavDone = false;

router.beforeEach((to, _from, next) => {
    if (!initialNavDone && to.query.state) {
        initialNavDone = true;
        const stateParam = to.query.state as string;
        const result = restoreStateFromParam(stateParam);
        const { state: _, ...cleanQuery } = to.query;
        const targetName = result.activeScene ?? (to.name as string);
        next({ name: targetName, query: cleanQuery });
        return;
    }
    initialNavDone = true;
    next();
});
