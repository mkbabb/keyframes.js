import { defineAsyncComponent, type Component } from "vue";

export interface SceneDescriptor {
    id: string;
    label: string;
    superKey: string;
    component?: Component;
    showStartScreen?: boolean;
    gridBackground?: boolean;
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
        component: defineAsyncComponent(
            () => import("./scenes/CubeScene.vue"),
        ),
    },
    {
        id: "amiga",
        label: "Amiga",
        superKey: "Amiga",
        component: defineAsyncComponent(
            () => import("./scenes/AmigaScene.vue"),
        ),
    },
    {
        id: "square",
        label: "Square",
        superKey: "Square",
        component: defineAsyncComponent(
            () => import("./scenes/SquareScene.vue"),
        ),
    },
    {
        id: "easing",
        label: "Easing",
        superKey: "Easing",
        component: defineAsyncComponent(
            () => import("./scenes/EasingScene.vue"),
        ),
    },
    {
        id: "spring",
        label: "Spring",
        superKey: "Spring",
        component: defineAsyncComponent(
            () => import("./scenes/SpringScene.vue"),
        ),
    },
];

export const allScenes = [homeScene, ...scenes];
export const sceneMap = new Map(allScenes.map((s) => [s.id, s]));

// All scenes load on demand via defineAsyncComponent for code-splitting.
// App.vue mounts each under <Suspense> so the async chunk resolves before
// the scene <Transition> sees its vnode — the loading surface is the
// <Suspense> #fallback slot, so the descriptors carry no loadingComponent.
