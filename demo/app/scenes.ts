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
import MorphIcon from "@assets/icons/morph.svg?component";

// The per-scene `superKey` single-source (R.W5 C.4) — each scene's keys module
// OWNS its superKey constant; the descriptor below AND the scene SFC both import
// it, so no string literal is declared in a file that doesn't own it.
import { MORPH_SUPER_KEY } from "../scenes/morph/morphKeys";
import { MOTION_PATH_SUPER_KEY } from "../scenes/motion-path/motionPathKeys";
import { EASING_SUPER_KEY } from "../scenes/easing/easingKeys";
import { SEQUENCE_SUPER_KEY } from "../scenes/sequence/sequenceKeys";
import { SQUARE_SUPER_KEY } from "../scenes/square/squareKeys";
import { SPRING_SUPER_KEY } from "../scenes/spring/springKeys";
import { AMIGA_SUPER_KEY } from "../scenes/amiga/amigaKeys";
// Cube's superKey single-source is its existing `SUPER_KEY` export (the cube
// keeps its established home in useCubeAnimations; no separate keys module).
import { SUPER_KEY as CUBE_SUPER_KEY } from "../scenes/cube/useCubeAnimations";

/** A scene's dynamic-import loader — the exact thunk `defineAsyncComponent`
 *  wraps, retained so `warmScene` can warm the chunk on hover (S5). */
type SceneLoader = () => Promise<unknown>;

/**
 * The mobile STAGE mode-class (H.W7.S1c) — the three registers the mobile
 * overlay composes the controls sheet against, keyed by the scene's CONTENT
 * shape (the mode IS scene data, so it lives WITH the scene, on the descriptor):
 *
 *   • `subject`    — the subject IS the background (cube/amiga/square): a 3D
 *                    object/canvas that fills the viewport behind the sheet. The
 *                    full-bleed fixed stage is RIGHT here, so the
 *                    `proof:mobile-single-page (a)` 0.45 visible-fraction floor
 *                    applies ONLY to this class.
 *   • `editor`     — the curve/controls ARE the content (easing): the editable
 *                    bezier + the engine ball are the protagonist, not a
 *                    background. The stage keeps its glass-card register (W11
 *                    I5) — full-bleed would be WRONG (the curve is the content).
 *   • `storyboard` — the draggable rows / editable path ARE the content
 *                    (sequence/motion-path/spring/morph): an authored timeline
 *                    the user manipulates. Also a contained card, not a background.
 *
 * Only `subject` expands toward a full-bleed background on mobile; `editor` and
 * `storyboard` keep their content card. UNKNOWN/home falls back to `subject`
 * (the conservative full-bleed default for the cube backdrop landing).
 */
export type StageMode = "subject" | "editor" | "storyboard";

export interface SceneDescriptor {
    id: string;
    label: string;
    superKey: string;
    /** The mobile stage register (R.W5 C.5 — inlined per descriptor; was the
     *  parallel string-keyed `STAGE_MODES` record that silently fell through to
     *  `subject` on a missing id). */
    stageMode: StageMode;
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
    // KEEP: cosmetic prefetch — a rejected warm is swallowed; the real mount
    // surfaces the error via <Suspense> (see the docblock above).
    if (loader) void loader().catch(() => {});
}

/** The home/hero landing scene — no component, just the start screen. */
export const HOME_SCENE_ID = "home";

export const homeScene: SceneDescriptor = {
    id: HOME_SCENE_ID,
    label: "Home",
    superKey: "__home__",
    stageMode: "subject",
    showStartScreen: true,
};

export const scenes: SceneDescriptor[] = [
    {
        id: "cube",
        label: "Cube",
        superKey: CUBE_SUPER_KEY,
        stageMode: "subject",
        icon: CubeIcon,
        component: lazyScene("cube", () => import("../scenes/cube/CubeScene.vue")),
    },
    {
        id: "amiga",
        label: "Amiga",
        superKey: AMIGA_SUPER_KEY,
        stageMode: "subject",
        icon: AmigaIcon,
        component: lazyScene("amiga", () => import("../scenes/amiga/AmigaScene.vue")),
    },
    {
        id: "square",
        label: "Square",
        superKey: SQUARE_SUPER_KEY,
        stageMode: "subject",
        icon: SquareIcon,
        component: lazyScene("square", () => import("../scenes/square/SquareScene.vue")),
    },
    {
        id: "easing",
        label: "Easing",
        superKey: EASING_SUPER_KEY,
        stageMode: "editor",
        icon: EasingIcon,
        component: lazyScene("easing", () => import("../scenes/easing/EasingScene.vue")),
    },
    {
        id: "spring",
        label: "Spring",
        superKey: SPRING_SUPER_KEY,
        stageMode: "storyboard",
        icon: SpringIcon,
        component: lazyScene("spring", () => import("../scenes/spring/SpringScene.vue")),
    },
    {
        // The Sequence + stagger storyboard (F.W10.S3): N children positioned
        // along one master clock by the `stagger` distribution, driven through
        // the F.W9 transport (play/pause/reverse/timeScale/scrub). Dogfoods the
        // engine's TEMPORAL orchestrator the way the cube proves the compositor.
        id: "sequence",
        label: "Sequence",
        superKey: SEQUENCE_SUPER_KEY,
        stageMode: "storyboard",
        icon: SequenceIcon,
        component: lazyScene(
            "sequence",
            () => import("../scenes/sequence/SequenceScene.vue"),
        ),
    },
    {
        // The CSS-native MotionPath shop-window (F.W12.S3): a traveller swept
        // along an author offset-path via fromMotionPath (offset-distance
        // 0%→100%). WAAPI-eligible, zero geometry math — the browser owns the
        // path, the engine sweeps the scalar.
        id: "motion-path",
        label: "Path",
        superKey: MOTION_PATH_SUPER_KEY,
        stageMode: "storyboard",
        icon: MotionPathIcon,
        component: lazyScene(
            "motion-path",
            () => import("../scenes/motion-path/MotionPathScene.vue"),
        ),
    },
    {
        // The MorphSVG shop-window (Q.WC4.S3): the THIRD HEAVY geometry front
        // door demoed — `fromMorphSVG` morphs one SVG `<path>` `d` INTO another
        // over value.js's PathGeometry, and the Q.WC4 S1 render contract paints
        // the morphing shape DIRECTLY on a live `<path>` (the `d:` property +
        // var(--morph-d) fallback). A glyph banks to the tangent (orient-along-
        // path, S2). Beside MotionPath (offset-distance) + DrawSVG (line-drawing).
        id: "morph",
        label: "Morph",
        superKey: MORPH_SUPER_KEY,
        stageMode: "storyboard",
        icon: MorphIcon,
        component: lazyScene(
            "morph",
            () => import("../scenes/morph/MorphSVGScene.vue"),
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

// Q.WC3 S1 — the ordered-index seam: the ONE source of scene-order truth (over
// `allScenes`). `useSceneTransition` reads `sign(sceneIndex(target) −
// sceneIndex(current))` to derive the directional View-Transition type
// (forward/backward), and the mobile scroll-snap carousel reads the SAME order —
// no second hard-coded order list (no-legacy). An unknown id → −1 (a no-op
// direction; the untyped cross-fade degrade).
const sceneOrder = new Map(allScenes.map((s, i) => [s.id, i]));

/** The ordered index of a scene id in `allScenes` (home first, then the
 *  `scenes[]` order), or −1 if unknown. The single source of scene-order truth. */
export function sceneIndex(id: string): number {
    return sceneOrder.get(id) ?? -1;
}

// R.W5 C.5 — the `STAGE_MODES: Record<string, StageMode>` parallel record + its
// `stageModeFor` selector are DELETED. The mode is now a required `stageMode`
// field on each `SceneDescriptor` (inlined above) — single-sourced WITH the
// scene, so a new scene CANNOT silently fall through to `subject` (the type
// forces a mode on every descriptor). App.vue reads `currentScene.value.stageMode`.

// All scenes load on demand via defineAsyncComponent for code-splitting.
// App.vue mounts each under <Suspense> so the async chunk resolves before
// the scene <Transition> sees its vnode — the loading surface is the
// <Suspense> #fallback slot, so the descriptors carry no loadingComponent.
