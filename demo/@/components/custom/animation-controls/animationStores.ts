import { getAnimationId, Animation } from "@src/animation";
import type { InputAnimationOptions } from "@src/animation/constants";
import { jumpTerms } from "@src/easing";

export type StoredAnimationOptions = {
    animationOptions: InputAnimationOptions;
    animationState: {
        t: number;
        startTime: number;
        pauseTime: number;
        paused: boolean;
    };
    stepOptions: {
        steps: number;
        jumpTerm: (typeof jumpTerms)[number];
    };
    cubicBezierOptions: {
        controlPoints: [number, number, number, number];
    };
};

export type StoredAnimationGroupOptions = {
    [name: string]: StoredAnimationOptions;
};

export type StoredAnimationGroupsOptions = {
    _storeTimestamp?: number;
    [name: string]: StoredAnimationGroupOptions | number | undefined;
};

export const defaultAnimationOptions = {
    duration: "5s",
    delay: "0ms",
    iterationCount: "infinite",
    fillMode: "forwards",
    direction: "alternate",
    timingFunction: "ease-in-out",
} as InputAnimationOptions;

export const defaultStepOptions = {
    steps: 100,
    jumpTerm: jumpTerms[0],
};
export const defaultCubicBezierOptions = {
    controlPoints: [0.2, 0.65, 0.6, 1],
};

export const defaultStoredAnimationOptions = {
    animationOptions: defaultAnimationOptions,
    stepOptions: defaultStepOptions,
    cubicBezierOptions: defaultCubicBezierOptions,
} as StoredAnimationOptions;

import { useStorage } from "@vueuse/core";
import { ref } from "vue";

const STORE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const checkAndResetExpiredStore = <T extends { _storeTimestamp?: number }>(
    store: { value: T },
    defaultValue: T,
) => {
    const timestamp = store.value._storeTimestamp;
    if (timestamp && Date.now() - timestamp > STORE_TTL_MS) {
        store.value = { ...defaultValue, _storeTimestamp: Date.now() };
    } else if (!timestamp) {
        store.value._storeTimestamp = Date.now();
    }
};

const touchTimestamp = <T extends { _storeTimestamp?: number }>(store: { value: T }) => {
    store.value._storeTimestamp = Date.now();
};

let _animationGroupsOptionsStore: ReturnType<typeof useStorage<StoredAnimationGroupsOptions>> | null = null;
const getAnimationGroupsOptionsStore = (): ReturnType<typeof useStorage<StoredAnimationGroupsOptions>> => {
    if (!_animationGroupsOptionsStore) {
        try {
            _animationGroupsOptionsStore = useStorage(
                "animation-groups-options-store",
                { _storeTimestamp: Date.now() } as StoredAnimationGroupsOptions,
            );
            checkAndResetExpiredStore(_animationGroupsOptionsStore, { _storeTimestamp: Date.now() });
        } catch {
            // Safari private browsing or no localStorage — fall back to a plain ref
            _animationGroupsOptionsStore = ref({ _storeTimestamp: Date.now() }) as ReturnType<typeof useStorage<StoredAnimationGroupsOptions>>;
        }
    }
    return _animationGroupsOptionsStore!;
};

let _animationGroupsControlOptionsStore: ReturnType<typeof useStorage<StoredAnimationGroupsControlOptions>> | null = null;
const getAnimationGroupsControlOptionsStore = (): ReturnType<typeof useStorage<StoredAnimationGroupsControlOptions>> => {
    if (!_animationGroupsControlOptionsStore) {
        try {
            _animationGroupsControlOptionsStore = useStorage(
                "animation-groups-control-options-store",
                { _storeTimestamp: Date.now() } as StoredAnimationGroupsControlOptions,
            );
            checkAndResetExpiredStore(_animationGroupsControlOptionsStore, { _storeTimestamp: Date.now() } as StoredAnimationGroupsControlOptions);
        } catch {
            // Safari private browsing or no localStorage — fall back to a plain ref
            _animationGroupsControlOptionsStore = ref({ _storeTimestamp: Date.now() }) as ReturnType<typeof useStorage<StoredAnimationGroupsControlOptions>>;
        }
    }
    return _animationGroupsControlOptionsStore!;
};

export const getAnimationSuperKey = (
    superKey: Animation<any> | string | undefined,
    animation: Animation<any> | string | undefined = undefined,
): string => {
    if (superKey) {
        if (typeof superKey === "string") return superKey;
        return superKey.superKey ?? "default";
    }

    if (typeof animation === "string") return animation;
    return animation!.superKey ?? "default";
};

export const getStoredAnimationOptions = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationOptions => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId!);

    const animationGroupsOptionsStore = getAnimationGroupsOptionsStore();
    touchTimestamp(animationGroupsOptionsStore);

    let animationGroupOptions = animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions | undefined;

    if (!animationGroupOptions) {
        animationGroupsOptionsStore.value[superKey] = {
            [animationId]: {},
        } as StoredAnimationGroupOptions;

        animationGroupOptions = animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions;
    }

    const existing = animationGroupOptions[animationId];
    if (
        !existing ||
        Object.keys(existing).length === 0
    ) {
        (animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions)[animationId] = structuredClone(defaultStoredAnimationOptions);
    }

    return (animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions)[animationId]!;
};

export const createAnimationUUId = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
) => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId!);

    return `${superKey}-${animationId}`;
};

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    selectedAnimation: string;
    selectedKeyframesControl: string;
    isTimelineExpanded: boolean;
    isControlsPanelOpen: boolean;
    [name: string]: any;
};

export type StoredAnimationGroupsControlOptions = {
    _storeTimestamp?: number;
    [name: string]: StoredAnimationGroupControlOptions | number | undefined;
};

const defaultStoredAnimationGroupControlOptions: StoredAnimationGroupControlOptions = {
    selectedControl: "controls",
    selectedAnimation: "",
    selectedKeyframesControl: "string",
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
};

export const getStoredAnimationGroupControlOptions = (
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    const animationGroupsControlOptionsStore = getAnimationGroupsControlOptionsStore();
    touchTimestamp(animationGroupsControlOptionsStore);

    if (!animationGroupsControlOptionsStore.value[superKey]) {
        animationGroupsControlOptionsStore.value[superKey] = structuredClone(defaultStoredAnimationGroupControlOptions);
    }

    const controls = animationGroupsControlOptionsStore.value[superKey] as StoredAnimationGroupControlOptions;

    return controls;
};

const STORE_KEYS = [
    "animation-groups-options-store",
    "animation-groups-control-options-store",
    "asset-manager-state",
] as const;

export const resetAllStores = () => {
    // Reset reactive refs
    getAnimationGroupsOptionsStore().value = { _storeTimestamp: Date.now() };
    getAnimationGroupsControlOptionsStore().value = { _storeTimestamp: Date.now() };

    // Also clear localStorage directly — useStorage writeback may not flush before reload
    try {
        for (const key of STORE_KEYS) {
            localStorage.removeItem(key);
        }
    } catch {
        // Safari private browsing — no-op
    }

    // Clear URL hash so restoreStateFromHash() doesn't re-populate on reload
    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Reset module-level singletons so they're recreated fresh on next access
    _animationGroupsOptionsStore = null;
    _animationGroupsControlOptionsStore = null;
};

export const deepDefaultStore = (store: any, defaultStore: any) => {
    for (const key in defaultStore) {
        if (store[key] === undefined || store[key] === null) {
            store[key] = defaultStore[key];
        } else if (typeof store[key] === "object") {
            deepDefaultStore(store[key], defaultStore[key]);
        }
    }
};

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

// --- Per-scene playback state (in-memory, ephemeral) ---

export interface AnimationPlaybackSnapshot {
    t: number;
    reversed: boolean;
    iteration: number;
}

export interface ScenePlaybackState {
    playing: boolean;
    started: boolean;
    /** Per-animation playback snapshot (raw t, reversed flag, iteration) */
    animations: Record<string, AnimationPlaybackSnapshot>;
}

const _scenePlaybackStates = new Map<string, ScenePlaybackState>();

export const saveScenePlaybackState = (superKey: string, state: ScenePlaybackState) => {
    _scenePlaybackStates.set(superKey, state);
};

export const getScenePlaybackState = (superKey: string): ScenePlaybackState | undefined => {
    return _scenePlaybackStates.get(superKey);
};

export const clearScenePlaybackState = (superKey: string) => {
    _scenePlaybackStates.delete(superKey);
};

// Active scene tracking for share state
let _activeSceneId: string | undefined;

export const setActiveScene = (sceneId: string) => {
    _activeSceneId = sceneId;
};

export const getActiveScene = (): string | undefined => _activeSceneId;

export const getAllState = (): object => {
    // Strip _storeTimestamp so the same logical state always produces the same hash
    const { _storeTimestamp: _1, ...options } = getAnimationGroupsOptionsStore().value;
    const { _storeTimestamp: _2, ...controls } = getAnimationGroupsControlOptionsStore().value;
    return { options, controls, activeScene: _activeSceneId };
};

const isValidState = (state: unknown): state is { options?: object; controls?: object; activeScene?: string } => {
    if (typeof state !== "object" || state === null) return false;
    const s = state as Record<string, unknown>;
    if (s.options !== undefined && (typeof s.options !== "object" || s.options === null)) return false;
    if (s.controls !== undefined && (typeof s.controls !== "object" || s.controls === null)) return false;
    return true;
};

export const restoreStateFromHash = (): { restored: boolean; activeScene?: string } => {
    const hash = window.location.hash.slice(1);
    if (!hash) return { restored: false };

    const state = decodeStateFromHash(hash);
    if (!state || !isValidState(state)) return { restored: false };

    if (state.options) {
        Object.assign(getAnimationGroupsOptionsStore().value, state.options);
    }
    if (state.controls) {
        Object.assign(getAnimationGroupsControlOptionsStore().value, state.controls);
    }

    // Clear hash after restoring to avoid stale state
    history.replaceState(null, "", window.location.pathname + window.location.search);

    return { restored: true, activeScene: state.activeScene };
};

// Attempt to restore state from URL hash on module load
const _hashRestoreResult = restoreStateFromHash();
if (_hashRestoreResult.activeScene) {
    _activeSceneId = _hashRestoreResult.activeScene;
}
