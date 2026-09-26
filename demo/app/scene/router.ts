import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { toast } from "@mkbabb/glass-ui/toast";
import { restoreStateFromParam } from "@state/hashSharing";
import { HOME_SCENE_ID } from "@state";
import { allScenes } from "./scenes";

/**
 * Hash-based router for the keyframes.js demo.
 * Uses hash mode for GitHub Pages compatibility (no server-side routing).
 *
 * URL structure: /#/cube?anim=Matrix&state=eyJvcHRp...
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
        // UIA-KF-143 (X.KF.W13X.scene) — a deep link's verdict is announced on
        // the Share popover's own load path (the same copy and tones,
        // `useShareState`): restored → success; unreadable → the link could not
        // be read, instead of silently landing on the route scene. The root
        // Toaster renders the queued toast once it mounts.
        if (result.restored) {
            toast({
                title: "State restored!",
                tone: "success",
                duration: 3000,
                description: "Animation state loaded from shared URL.",
            });
        } else {
            toast({
                title: "Invalid shared state",
                tone: "destructive",
                duration: 3000,
                description: "This link's shared state could not be read.",
            });
        }
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
