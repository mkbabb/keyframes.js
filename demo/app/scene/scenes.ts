import { defineAsyncComponent, type Component } from "vue";

// KF.W13U.d2 (OA-32) — each scene's icon is a LIVING miniature the scene
// exports from its own directory: its motion is the scene's own animation data
// (the same keyframes / easing / spring / sequence the stage plays, driven by
// keyframes.js), its layers the stage's stacking in miniature. The descriptor's
// `icon` below stays the ONE binding; the dock renders it unchanged in role.
// Every miniature is a light SFC over a light data module (`*Motion.ts`, the
// spring presets, the Amiga group), so the static import carries no scene
// runtime — the scenes themselves stay route-lazy.
import CubeIcon from "../../scenes/cube/CubeMini.vue";
import AmigaIcon from "../../scenes/amiga/AmigaMini.vue";
import SquareIcon from "../../scenes/square/SquareMini.vue";
import EasingIcon from "../../scenes/easing/EasingMini.vue";
import SpringIcon from "../../scenes/spring/SpringMini.vue";
import SequenceIcon from "../../scenes/sequence/SequenceMini.vue";

// The per-scene registry-id single-source (R.W5 C.4 / T.B9 — the ONE keyspace):
// each scene's keys module OWNS its `*_SCENE_ID` constant; the descriptor below
// (its `id` AND the store-keying `superKey`) AND the scene SFC both import it, so
// the id literal is declared in exactly one file the scene owns. The `superKey`
// field now === the `id` (the divergent PascalCase super-key constant is retired).
import { EASING_SCENE_ID } from "../../scenes/easing/easingKeys";
import { SEQUENCE_SCENE_ID } from "../../scenes/sequence/sequenceKeys";
import { SQUARE_SCENE_ID } from "../../scenes/square/squareKeys";
import { SPRING_SCENE_ID } from "../../scenes/spring/springKeys";
import { AMIGA_SCENE_ID } from "../../scenes/amiga/amigaKeys";
import { CUBE_SCENE_ID } from "../../scenes/cube/cubeKeys";

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
 *   • `storyboard` — the draggable rows ARE the content (sequence/spring): an
 *                    authored timeline the user manipulates. Also a contained
 *                    card, not a background.
 *
 * Only `subject` expands toward a full-bleed background on mobile; `editor` and
 * `storyboard` keep their content card. UNKNOWN/home falls back to `subject`
 * (the conservative full-bleed default for the cube backdrop landing).
 */
// Internal-only (T.F23a un-export): consumed solely by this module's
// SceneDescriptor.stageMode + STAGE_MODES record; no external importer.
type StageMode = "subject" | "editor" | "storyboard";

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
     * The scene's nav glyph — the scene's LIVING miniature (KF.W13U.d2 / OA-32):
     * an SFC the scene exports from its own directory, rendering real DOM (never
     * a theme-blind `<img>` — the D8 defense) and taking one prop, `live`: the
     * dock's chosen scene plays its miniature, every other rendering rests. The
     * dock renders it with `<component :is="scene.icon" class="dock-glyph" />`.
     * The icon is data and lives WITH the scene (single-source: the dock
     * iterates `scene.icon`, never a parallel string-keyed map that drifts on a
     * rename).
     *
     * Populated per-survivor by each scene (its `*Mini.vue`);
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
 * S5 — warm a scene's dynamic-import chunk on INTENT — pointer-enter or
 * keyboard focus of its nav row (X.KF.W13U.d5) — so a subsequent switch has no
 * chunk-fetch stall. Pure prefetch: the loader's
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
    superKey: HOME_SCENE_ID,
    stageMode: "subject",
    showStartScreen: true,
};

export const scenes: SceneDescriptor[] = [
    {
        id: "cube",
        label: "Cube",
        superKey: CUBE_SCENE_ID,
        stageMode: "subject",
        icon: CubeIcon,
        component: lazyScene("cube", () => import("../../scenes/cube/CubeScene.vue")),
    },
    {
        id: "amiga",
        label: "Amiga",
        superKey: AMIGA_SCENE_ID,
        stageMode: "subject",
        icon: AmigaIcon,
        component: lazyScene("amiga", () => import("../../scenes/amiga/AmigaScene.vue")),
    },
    {
        id: "square",
        label: "Square",
        superKey: SQUARE_SCENE_ID,
        stageMode: "subject",
        icon: SquareIcon,
        component: lazyScene("square", () => import("../../scenes/square/SquareScene.vue")),
    },
    {
        id: "easing",
        label: "Easing",
        superKey: EASING_SCENE_ID,
        stageMode: "editor",
        icon: EasingIcon,
        component: lazyScene("easing", () => import("../../scenes/easing/EasingScene.vue")),
    },
    {
        id: "spring",
        label: "Spring",
        superKey: SPRING_SCENE_ID,
        stageMode: "storyboard",
        icon: SpringIcon,
        component: lazyScene("spring", () => import("../../scenes/spring/SpringScene.vue")),
    },
    {
        // The Sequence + stagger storyboard (F.W10.S3): N children positioned
        // along one master clock by the `stagger` distribution, driven through
        // the F.W9 transport (play/pause/reverse/timeScale/scrub). Dogfoods the
        // engine's TEMPORAL orchestrator the way the cube proves the compositor.
        id: "sequence",
        label: "Sequence",
        superKey: SEQUENCE_SCENE_ID,
        stageMode: "storyboard",
        icon: SequenceIcon,
        component: lazyScene(
            "sequence",
            () => import("../../scenes/sequence/SequenceScene.vue"),
        ),
    },
    // The standalone @starting-style "Discrete" scene was MERGED into the Spring
    // scene as a sub-view in one motion (H.W5.S3): Discrete is Spring's twin (the
    // same spring solver + linear() artifact on a different primitive). The fold
    // removed this descriptor, its /starting-style route, and StartingStyleScene
    // .vue together — no legacy alias. The discrete-transition view now lives at
    // Spring → "Discrete transition" (SpringScene.vue + spring/StartingStyleTarget
    // .vue). Survivor new-mode set = { spring, sequence }.
];

export const allScenes = [homeScene, ...scenes];
export const sceneMap = new Map(allScenes.map((s) => [s.id, s]));

// R.W5 C.5 — the `STAGE_MODES: Record<string, StageMode>` parallel record + its
// `stageModeFor` selector are DELETED. The mode is now a required `stageMode`
// field on each `SceneDescriptor` (inlined above) — single-sourced WITH the
// scene, so a new scene CANNOT silently fall through to `subject` (the type
// forces a mode on every descriptor). App.vue reads `currentScene.value.stageMode`.

// All scenes load on demand via defineAsyncComponent for code-splitting.
// App.vue mounts each under <Suspense> so the async chunk resolves before
// the scene <Transition> sees its vnode — the loading surface is the
// <Suspense> #fallback slot, so the descriptors carry no loadingComponent.
