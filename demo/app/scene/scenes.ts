import { defineAsyncComponent, type Component } from "vue";
import { HOME_SCENE_ID } from "@state";

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
import HomeIcon from "../../components/instrument/shell/HomeMini.vue";

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
// A2-KE-L1-13 (X.KF.W13X.scene) — the cube has ONE load path: the static
// import. The cube is the boot scene AND home's backdrop, so it is in the boot
// chunk regardless; the lazy loader its descriptor also declared was never
// mounted (App rendered this static component for cube and home alike).
import CubeScene from "../../scenes/cube/CubeScene.vue";

/** A scene's dynamic-import loader — the exact thunk `defineAsyncComponent`
 *  wraps, retained so `loadScene` / `warmScene` resolve the same chunk. */
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
     * Populated per-survivor by each scene (its `*Mini.vue`), and for home by
     * `HomeMini.vue` (X.KF.W13X.esc2 · ESC-dock-3, UIA-KF-132: the hero's
     * ellipsis, so Home is no longer the one lucide monochrome glyph among
     * colour miniatures). REQUIRED on every descriptor, home included, so an
     * icon-less descriptor does not typecheck and the dock needs no fallback
     * glyph — the permanent cure for the D8 regression class.
     */
    icon: Component;
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
 * KFA-25 / KFA-76 (X.KF.W13X.scene) — resolve a scene's chunk: the promise the
 * scene switch awaits BEFORE it starts the View Transition, so the swap never
 * captures (or shows) the `<Suspense>` fallback. A scene with no loader (home,
 * the static cube) is already resolved. The same thunk `defineAsyncComponent`
 * wraps, so Vite's module cache makes the later mount a cache hit. A rejected
 * load is NOT swallowed here: the caller mounts anyway and `<Suspense>`
 * surfaces the error, exactly as a switch without the preload would.
 */
export function loadScene(id: string): Promise<unknown> {
    return sceneLoaders.get(id)?.() ?? Promise.resolve();
}

/**
 * S5 — warm a scene's dynamic-import chunk on INTENT: the dock emits it for
 * every scene row when its Scene menu opens (`ChromeDock` `warmScene`). Pure
 * prefetch: the loader's promise is fired and dropped (Vite caches the module),
 * with NO behaviour change — a rejected warm is swallowed (the real mount
 * surfaces the error via `<Suspense>`). The Vite dynamic-import warmup, NOT
 * Speculation Rules: the demo is an SPA (client-routed scenes, no document
 * navigation), and Speculation Rules DO NOT apply to SPAs.
 */
export function warmScene(id: string): void {
    // KEEP: cosmetic prefetch — a rejected warm is swallowed; the real mount
    // surfaces the error via <Suspense> (see the docblock above).
    void loadScene(id).catch(() => {});
}

/**
 * KFA-76 (X.KF.W13X.scene) — warm EVERY scene chunk once the page is idle after
 * first paint, so a first-visit switch evaluates no chunk on the swap tick.
 * `requestIdleCallback` where the engine ships it (Safari does not), else one
 * macrotask after load; either way the warm never competes with first paint.
 */
export function warmScenesAtIdle(): void {
    const warmAll = () => {
        for (const id of sceneLoaders.keys()) warmScene(id);
    };
    if ("requestIdleCallback" in window) requestIdleCallback(warmAll);
    else setTimeout(warmAll, 0);
}

/**
 * The home/hero landing: the cube backdrop under the start screen.
 *
 * KFA-22 (X.KF.W13X.r4shell) — HOME STORES UNDER THE CUBE'S KEY. Home IS the
 * cube scene (the same `CubeScene`, the same `<Suspense>` key, App.vue), and
 * its transport lists the cube's channels. It kept a store key of its own, and
 * `EditorShell` keys its `AnimationControlsGroup` on the store key, so the home
 * Play (a hop to the cube) tore down the transport and the scene slot inside
 * it and mounted both again inside the swap: the 230-320 ms frame gap after
 * Play. One key keeps the one scene mounted across the hop (the shell binding
 * re-binds the group on the shared-scene id change), and a pick on home's list
 * is the cube's pick by construction: there is no second bucket to carry it
 * out of (UIA-KF-004's carry is deleted with the bucket).
 */
export const homeScene: SceneDescriptor = {
    id: HOME_SCENE_ID,
    label: "Home",
    superKey: CUBE_SCENE_ID,
    stageMode: "subject",
    icon: HomeIcon,
    component: CubeScene,
};

export const scenes: SceneDescriptor[] = [
    {
        id: CUBE_SCENE_ID,
        label: "Cube",
        superKey: CUBE_SCENE_ID,
        stageMode: "subject",
        icon: CubeIcon,
        component: CubeScene,
    },
    {
        id: AMIGA_SCENE_ID,
        label: "Amiga",
        superKey: AMIGA_SCENE_ID,
        stageMode: "subject",
        icon: AmigaIcon,
        component: lazyScene(AMIGA_SCENE_ID, () => import("../../scenes/amiga/AmigaScene.vue")),
    },
    {
        id: SQUARE_SCENE_ID,
        label: "Square",
        superKey: SQUARE_SCENE_ID,
        stageMode: "subject",
        icon: SquareIcon,
        component: lazyScene(SQUARE_SCENE_ID, () => import("../../scenes/square/SquareScene.vue")),
    },
    {
        id: EASING_SCENE_ID,
        label: "Easing",
        superKey: EASING_SCENE_ID,
        stageMode: "editor",
        icon: EasingIcon,
        component: lazyScene(EASING_SCENE_ID, () => import("../../scenes/easing/EasingScene.vue")),
    },
    {
        id: SPRING_SCENE_ID,
        label: "Spring",
        superKey: SPRING_SCENE_ID,
        stageMode: "storyboard",
        icon: SpringIcon,
        component: lazyScene(SPRING_SCENE_ID, () => import("../../scenes/spring/SpringScene.vue")),
    },
    {
        // The Sequence + stagger storyboard (F.W10.S3): N children positioned
        // along one master clock by the `stagger` distribution, driven through
        // the F.W9 transport (play/pause/reverse/timeScale/scrub). Dogfoods the
        // engine's TEMPORAL orchestrator the way the cube proves the compositor.
        id: SEQUENCE_SCENE_ID,
        label: "Sequence",
        superKey: SEQUENCE_SCENE_ID,
        stageMode: "storyboard",
        icon: SequenceIcon,
        component: lazyScene(
            SEQUENCE_SCENE_ID,
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

// Every scene but the cube loads on demand via defineAsyncComponent for
// code-splitting; App.vue mounts the active one under a keyed <Suspense>, whose
// #fallback is the loading surface (a hard load's only one — an in-app switch
// awaits `loadScene` first), so the descriptors carry no loadingComponent.
