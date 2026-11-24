import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { HOME_SCENE_ID } from "@state";
import { allScenes } from "./scenes";

/**
 * Hash-based router for the keyframes.js demo.
 * Uses hash mode for GitHub Pages compatibility (no server-side routing).
 *
 * URL structure: /#/cube?anim=Matrix&skin=daraksha (the scene's view, urlState.ts).
 *
 * Each route maps to a scene ID. Actual rendering stays in App.vue via
 * keyed <Suspense> + lazy scene imports — routes just control which scene is active.
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

// FORTY-SIXTH E — the address carries the view, key by key, so the old
// `?state=` blob (a dump of the browser-stored options) retired with the
// stores. A link that still carries one opens its scene, and the blob is
// dropped from the address (no decode).
router.beforeEach((to) => {
    if (to.query.state === undefined) return true;
    const { state: _, ...query } = to.query;
    return { path: to.path, query, replace: true };
});
