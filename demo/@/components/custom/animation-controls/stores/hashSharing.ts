import { useAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { useAnimationGroupsControlOptionsStore } from "./controlOptionsStore";

// --- URL state sharing (lossless, base64-encoded) ---

export const encodeStateToHash = (state: object): string => {
    const json = JSON.stringify(state);
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

export const getAllState = (activeScene: string | undefined): object => {
    // Strip _storeTimestamp so the same logical state always produces the same hash
    const { _storeTimestamp: _1, ...options } =
        useAnimationGroupsOptionsStore().value;
    const { _storeTimestamp: _2, ...controls } =
        useAnimationGroupsControlOptionsStore().value;
    return { options, controls, activeScene };
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

/**
 * Restore state from a base64-encoded state param string.
 * Caller is responsible for URL cleanup (the router owns the URL).
 */
export const restoreStateFromParam = (
    stateParam: string,
): { restored: boolean; activeScene?: string } => {
    if (!stateParam) return { restored: false };

    const state = decodeStateFromHash(stateParam);
    if (!state || !isValidState(state)) return { restored: false };

    if (state.options) {
        Object.assign(useAnimationGroupsOptionsStore().value, state.options);
    }
    if (state.controls) {
        Object.assign(
            useAnimationGroupsControlOptionsStore().value,
            state.controls,
        );
    }

    return state.activeScene === undefined
        ? { restored: true }
        : { restored: true, activeScene: state.activeScene };
};
