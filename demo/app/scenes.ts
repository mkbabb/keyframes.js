import { defineAsyncComponent, type Component } from "vue";

// The EXPRESSIVE, COLORFUL inline-SVG icon family (H.W10.S1/G1 — reverses W5's
// monochrome `stroke="currentColor"` flip). The 4 ORIGINALS are RE-INSTANTIATED
// 1:1 from 084feb9: cube/amiga/square are the colorful 32×32 rasters embedded
// pixel-faithfully as `<svg><image href="data:image/png;base64,…"/></svg>`,
// easing is the original violet `hsl(248,88%,71%)` vector restored verbatim. The
// 3 NEW colorful glyphs (spring/sequence/motion-path — the primitives that
// LACKED an icon) paint from the demo's `--rainbow-*`/`--color-progress` tokens
// (currentColor fallback). ALL resolve through the unchanged W5 `?component`
// seam (vite.config.ts svgLoader, `convertColors:false`) to an inline-`<svg>`
// SFC — NOT an `<img :src>` URL (theme-blind by construction; the D8 defense
// holds: even the raster-embeds render as inline `<svg><image>`, never `<img>`).
// The icon is data and lives WITH the scene's other data.
import CubeIcon from "@assets/icons/cube.svg?component";
import AmigaIcon from "@assets/icons/amiga.svg?component";
import SquareIcon from "@assets/icons/square.svg?component";
import EasingIcon from "@assets/icons/easing.svg?component";
import SpringIcon from "@assets/icons/spring.svg?component";
import SequenceIcon from "@assets/icons/sequence.svg?component";
import MotionPathIcon from "@assets/icons/motion-path.svg?component";

/** A scene's dynamic-import loader — the exact thunk `defineAsyncComponent`
 *  wraps, retained so `warmScene` can warm the chunk on hover (S5). */
type SceneLoader = () => Promise<unknown>;

export interface SceneDescriptor {
    id: string;
    label: string;
    superKey: string;
    component?: Component;
    /**
     * The scene's nav glyph — an EXPRESSIVE, COLORFUL inline-`<svg>` SFC imported
     * via the `?component` seam (`import CubeIcon from "@assets/icons/cube.svg
     * ?component"`), NOT an `<img :src>` URL. Inline-SVG is the reference mechanism
     * that keeps the glyph a real DOM `<svg>` (a colorful raster is embedded as
     * `<svg><image href="data:…"/></svg>`, never a theme-blind `<img>` — the D8
     * defense), so the dock renders it with `<component :is="scene.icon"
     * class="icon-sm text-muted-foreground" />`. The icon is data and lives WITH
     * the scene (single-source: the dock iterates `scene.icon`, never a parallel
     * string-keyed map that drifts on a rename).
     *
     * Populated per-survivor by the Build/icons lane (it authors the SVGs first);
     * the home descriptor carries no `icon` and the dock falls back to `<Home>`
     * for it alone. Every other (non-home) descriptor MUST define `icon`
     * (proof:scene-icons coverage), so an icon-less scene is structurally
     * unshippable — the permanent cure for the D8 regression class.
     */
    icon?: Component;
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
        icon: CubeIcon,
        component: lazyScene("cube", () => import("./scenes/CubeScene.vue")),
    },
    {
        id: "amiga",
        label: "Amiga",
        superKey: "Amiga",
        icon: AmigaIcon,
        component: lazyScene("amiga", () => import("./scenes/AmigaScene.vue")),
    },
    {
        id: "square",
        label: "Square",
        superKey: "Square",
        icon: SquareIcon,
        component: lazyScene("square", () => import("./scenes/SquareScene.vue")),
    },
    {
        id: "easing",
        label: "Easing",
        superKey: "Easing",
        icon: EasingIcon,
        component: lazyScene("easing", () => import("./scenes/EasingScene.vue")),
    },
    {
        id: "spring",
        label: "Spring",
        superKey: "Spring",
        icon: SpringIcon,
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
        icon: SequenceIcon,
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
        icon: MotionPathIcon,
        component: lazyScene(
            "motion-path",
            () => import("./scenes/MotionPathScene.vue"),
        ),
    },
    // The standalone @starting-style "Discrete" scene was MERGED into the Spring
    // scene as a sub-view in one motion (H.W5.S3): Discrete is Spring's twin (the
    // same spring solver + linear() artifact on a different primitive). The fold
    // removed this descriptor, its /starting-style route, and StartingStyleScene
    // .vue together — no legacy alias. The discrete-transition view now lives at
    // Spring → "Discrete transition" (SpringScene.vue + spring/StartingStyleTarget
    // .vue). Survivor new-mode set = { spring, sequence, motion-path }.
];

export const allScenes = [homeScene, ...scenes];
export const sceneMap = new Map(allScenes.map((s) => [s.id, s]));

// All scenes load on demand via defineAsyncComponent for code-splitting.
// App.vue mounts each under <Suspense> so the async chunk resolves before
// the scene <Transition> sees its vnode — the loading surface is the
// <Suspense> #fallback slot, so the descriptors carry no loadingComponent.
