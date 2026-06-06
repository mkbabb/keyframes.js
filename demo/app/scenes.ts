import { defineAsyncComponent, type Component } from "vue";

/** A scene's dynamic-import loader — the exact thunk `defineAsyncComponent`
 *  wraps, retained so `warmScene` can warm the chunk on hover (S5). */
type SceneLoader = () => Promise<unknown>;

export interface SceneDescriptor {
    id: string;
    label: string;
    superKey: string;
    component?: Component;
    showStartScreen?: boolean;
    gridBackground?: boolean;
}

// id → the raw dynamic-import thunk. Built from the SAME loader the scene's
// `defineAsyncComponent` wraps (declared once below), so warming and mounting
// share one import edge — Vite dedupes the in-flight/settled module, so a warmed
// chunk is reused (no double fetch) when the scene actually mounts.
const sceneLoaders = new Map<string, SceneLoader>();

/** Declare a route-lazy scene once: register its loader for hover-warmup AND
 *  wrap it in `defineAsyncComponent` for `<Suspense>` mount. One source of the
 *  import thunk — warm and mount can never drift onto different chunks. */
function lazyScene(id: string, loader: SceneLoader): Component {
    sceneLoaders.set(id, loader);
    return defineAsyncComponent(loader as () => Promise<Component>);
}

/**
 * S5 — warm a scene's dynamic-import chunk on pointer-enter of its nav target,
 * so a subsequent switch has no chunk-fetch stall. Pure prefetch: the loader's
 * promise is fired and dropped (Vite caches the module), with NO behaviour
 * change — a rejected warm is swallowed (the real mount surfaces the error via
 * `<Suspense>`). The Vite dynamic-import warmup, NOT Speculation Rules: the demo
 * is an SPA (client-routed scenes, no document navigation), and the guide is
 * explicit that Speculation Rules DO NOT apply to SPAs.
 */
export function warmScene(id: string): void {
    const loader = sceneLoaders.get(id);
    if (loader) void loader().catch(() => {});
}

/** The home/hero landing scene — no component, just the start screen. */
export const HOME_SCENE_ID = "home";

export const homeScene: SceneDescriptor = {
    id: HOME_SCENE_ID,
    label: "Home",
    superKey: "__home__",
    showStartScreen: true,
};

export const scenes: SceneDescriptor[] = [
    {
        id: "cube",
        label: "Cube",
        superKey: "Cube",
        component: lazyScene("cube", () => import("./scenes/CubeScene.vue")),
    },
    {
        id: "amiga",
        label: "Amiga",
        superKey: "Amiga",
        component: lazyScene("amiga", () => import("./scenes/AmigaScene.vue")),
    },
    {
        id: "square",
        label: "Square",
        superKey: "Square",
        component: lazyScene("square", () => import("./scenes/SquareScene.vue")),
    },
    {
        id: "easing",
        label: "Easing",
        superKey: "Easing",
        component: lazyScene("easing", () => import("./scenes/EasingScene.vue")),
    },
    {
        id: "spring",
        label: "Spring",
        superKey: "Spring",
        component: lazyScene("spring", () => import("./scenes/SpringScene.vue")),
    },
    {
        // The Sequence + stagger storyboard (F.W10.S3): N children positioned
        // along one master clock by the `stagger` distribution, driven through
        // the F.W9 transport (play/pause/reverse/timeScale/scrub). Dogfoods the
        // engine's TEMPORAL orchestrator the way the cube proves the compositor.
        id: "sequence",
        label: "Sequence",
        superKey: "Sequence",
        component: lazyScene(
            "sequence",
            () => import("./scenes/SequenceScene.vue"),
        ),
    },
    {
        // The CSS-native MotionPath shop-window (F.W12.S3): a traveller swept
        // along an author offset-path via fromMotionPath (offset-distance
        // 0%→100%). WAAPI-eligible, zero geometry math — the browser owns the
        // path, the engine sweeps the scalar.
        id: "motion-path",
        label: "Path",
        superKey: "MotionPath",
        component: lazyScene(
            "motion-path",
            () => import("./scenes/MotionPathScene.vue"),
        ),
    },
    {
        // The @starting-style + spring-linear() copy-paste artifact scene: a
        // discrete entry/exit transition eased by a keyframes.js spring, with
        // the emitted linear(...) surfaced behind a copy button.
        id: "starting-style",
        label: "Discrete",
        superKey: "StartingStyle",
        component: lazyScene(
            "starting-style",
            () => import("./scenes/StartingStyleScene.vue"),
        ),
    },
];

export const allScenes = [homeScene, ...scenes];
export const sceneMap = new Map(allScenes.map((s) => [s.id, s]));

// All scenes load on demand via defineAsyncComponent for code-splitting.
// App.vue mounts each under <Suspense> so the async chunk resolves before
// the scene <Transition> sees its vnode — the loading surface is the
// <Suspense> #fallback slot, so the descriptors carry no loadingComponent.
