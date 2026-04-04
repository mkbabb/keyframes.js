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
        component: defineAsyncComponent({
            loader: () => import("./scenes/AmigaScene.vue"),
            delay: 100,
            loadingComponent: {
                template:
                    '<div class="flex items-center justify-center h-full w-full"><span class="text-muted-foreground instrument-serif text-lg animate-pulse">Loading scene...</span></div>',
            },
        }),
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
];

export const allScenes = [homeScene, ...scenes];
export const sceneMap = new Map(allScenes.map((s) => [s.id, s]));

// Heavy scenes (Amiga/Three.js) load on demand via defineAsyncComponent.
