import { getAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { getAnimationGroupsControlOptionsStore } from "./controlOptionsStore";
import { _setActiveSceneId, getActiveScene } from "./scenePlayback";

// --- URL hash sharing (lossless, compressed) ---

export const encodeStateToHash = (state: object): string => {
    const json = JSON.stringify(state);
    // Use base64 encoding (no fflate dependency needed for basic sharing)
    return btoa(encodeURIComponent(json));
};

export const decodeStateFromHash = (hash: string): object | null => {
    try {
        const json = decodeURIComponent(atob(hash));
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getAllState = (): object => {
    // Strip _storeTimestamp so the same logical state always produces the same hash
    const { _storeTimestamp: _1, ...options } =
        getAnimationGroupsOptionsStore().value;
    const { _storeTimestamp: _2, ...controls } =
        getAnimationGroupsControlOptionsStore().value;
    return { options, controls, activeScene: getActiveScene() };
};

const isValidState = (
    state: unknown,
): state is { options?: object; controls?: object; activeScene?: string } => {
    if (typeof state !== "object" || state === null) return false;
    const s = state as Record<string, unknown>;
    if (
        s.options !== undefined &&
        (typeof s.options !== "object" || s.options === null)
    )
        return false;
    if (
        s.controls !== undefined &&
        (typeof s.controls !== "object" || s.controls === null)
    )
        return false;
    return true;
};

export const restoreStateFromHash = (): {
    restored: boolean;
    activeScene?: string;
} => {
    const hash = window.location.hash.slice(1);
    if (!hash) return { restored: false };

    const state = decodeStateFromHash(hash);
    if (!state || !isValidState(state)) return { restored: false };

    if (state.options) {
        Object.assign(getAnimationGroupsOptionsStore().value, state.options);
    }
    if (state.controls) {
        Object.assign(
            getAnimationGroupsControlOptionsStore().value,
            state.controls,
        );
    }

    // Clear hash after restoring to avoid stale state
    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
    );

    return state.activeScene === undefined
        ? { restored: true }
        : { restored: true, activeScene: state.activeScene };
};

/**
 * Initialize state from URL hash. Call explicitly in App.vue onMounted
 * instead of relying on module-level side effects.
 */
export const initFromHash = (): {
    restored: boolean;
    activeScene?: string;
} => {
    const result = restoreStateFromHash();
    if (result.activeScene) {
        _setActiveSceneId(result.activeScene);
    }
    return result;
};
