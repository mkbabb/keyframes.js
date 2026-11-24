import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { createGlobalState } from "@vueuse/core";
import { ref } from "vue";
import { defaultControlSurfaceFor } from "./controlSurfaces";
import { getAnimationSuperKey } from "./storeUtils";
import type { SceneId } from "./sceneMachine";

/** The cube's skins: the pinned crayon die, the ppmycota brand skin, and
 *  Daraksha's register (her eight colours, CubeTarget.css). */
export type CubeSkin = "crayon" | "ppmycota" | "daraksha";

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    // `null` is the honest "no animation selected" state (the clear/validate
    // paths assign it) — typed so the assignment needs no `as any` (J.W2 S6 /
    // LS-20).
    selectedAnimation: string | null;
    isTimelineExpanded: boolean;
    isControlsPanelOpen: boolean;
    /** The cube's skin (the `cube` bucket only); absent = `"crayon"`. One
     *  writer (MbabbMenu's radio group), one reader (CubeScene → CubeTarget). */
    cubeSkin?: CubeSkin;
    /** OA-61 — the ball preview's visibility (the one PreviewToggle eye),
     *  per scene; absent = shown. */
    ballPreview?: "shown" | "hidden";
    matrixOptions?: MatrixOptions;
};

/**
 * The cube matrix editor's own stored slice: the cell its slider drives, written
 * and seeded by `MatrixEditor.vue`. Declared here, at the one authority for the
 * stored shape, rather than re-asserted at each reader (the X.KF.W4 gate hole).
 * X.KF.W13X.matrix (UIA-KF-028): the `fixed` flag is deleted with the ribbon's
 * Fixed/Free toggle, its only writer — nothing ever read it.
 */
export type MatrixOptions = {
    selectedMatrixCell: number;
};

export type StoredAnimationGroupsControlOptions = {
    [name: string]: StoredAnimationGroupControlOptions | undefined;
};

const defaultStoredAnimationGroupControlOptions: StoredAnimationGroupControlOptions =
    {
        selectedControl: "controls",
        selectedAnimation: "",
        isTimelineExpanded: false,
        isControlsPanelOpen: true,
    };

/**
 * Where the controls rest when nothing has said otherwise: open beside the
 * stage on a desk (1024 px and wider, the rail), closed on a phone, where the
 * sheet would take the bottom half of the screen. The one predicate the URL's
 * `sheet` fallback, the store's seed and the desk force-open all read.
 */
export const controlsOpenAtRest = (): boolean =>
    typeof window === "undefined" || window.innerWidth >= 1024;

/**
 * A press on the phone's Controls seat: the sheet it opens is a surface the
 * person asked for, so the URL's next `sheet` write pushes an entry (Back then
 * closes it). Any other change of the sheet (a side effect) replaces. The
 * mark is good for one write, and only briefly.
 */
let sheetPressAt = -Infinity;
export const markSheetPress = (): void => {
    sheetPressAt = Date.now();
};
export const takeSheetPress = (): boolean => {
    const fresh = Date.now() - sheetPressAt < 1000;
    sheetPressAt = -Infinity;
    return fresh;
};

const seedOptions = (): StoredAnimationGroupControlOptions => ({
    ...structuredClone(defaultStoredAnimationGroupControlOptions),
    isControlsPanelOpen: controlsOpenAtRest(),
});

/**
 * The scenes' view state (the channel, the surface, the pane, the skin, ...)
 * for this page's life. It is never written to browser storage: the address
 * carries the view (`useSceneUrlState`, `CubeScene`), and a bare link opens a
 * scene at its defaults (owner, FORTY-SIXTH E).
 */
export const useAnimationGroupsControlOptionsStore = createGlobalState(() =>
    ref<StoredAnimationGroupsControlOptions>({}),
);

export const getStoredAnimationGroupControlOptions = (
    // T.B9 — the ONE keyspace: the store keys by the registry `SceneId` (or an
    // animation whose `.superKey` field IS the SceneId). No divergent PascalCase.
    superKey: KeyframesAnimation<any> | SceneId | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    const animationGroupsControlOptionsStore =
        useAnimationGroupsControlOptionsStore();

    if (!animationGroupsControlOptionsStore.value[superKey]) {
        // item-7a (the ratified refinement) — a fresh bucket seeds the
        // SCENE-AWARE default surface: easing opens on its Curve facet,
        // spring on Physics. A stored (user-picked) bucket is untouched.
        animationGroupsControlOptionsStore.value[superKey] = {
            ...seedOptions(),
            selectedControl: defaultControlSurfaceFor(superKey),
        };
    }

    const controls = animationGroupsControlOptionsStore.value[
        superKey
    ] as StoredAnimationGroupControlOptions;

    // The store owns this one default boundary; consumers only read. A bucket
    // can arrive PARTIAL (a probe or a test that sets only the surface), so
    // every default member is backfilled, not one by name (X-DS kf pass 3 ·
    // KF-C3-15: `isControlsPanelOpen` read `undefined` and ChromeDock's toggle
    // logic ran on it).
    // `null` is a stored value (no animation selected), so only an ABSENT
    // member is filled.
    const bucket = controls as Record<string, unknown>;
    for (const [key, value] of Object.entries(seedOptions())) {
        if (bucket[key] === undefined) bucket[key] = structuredClone(value);
    }

    return controls;
};

/** Reset the store to defaults (used by resetAllStores). */
export const _resetAnimationGroupsControlOptionsStore = () => {
    useAnimationGroupsControlOptionsStore().value = {};
};
