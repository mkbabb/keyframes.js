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
    duration: 5000,
    iterationCount: Infinity,
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

const animationGroupsOptionsStore = useStorage(
    "animation-groups-options-store",
    { _storeTimestamp: Date.now() } as StoredAnimationGroupsOptions,
);

const animationGroupsControlOptionsStore = useStorage(
    "animation-groups-control-options-store",
    { _storeTimestamp: Date.now() } as StoredAnimationGroupsControlOptions,
);

// Check TTL on module load
checkAndResetExpiredStore(animationGroupsOptionsStore, { _storeTimestamp: Date.now() });
checkAndResetExpiredStore(animationGroupsControlOptionsStore, { _storeTimestamp: Date.now() } as any);

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

    touchTimestamp(animationGroupsOptionsStore);

    let animationGroupOptions = animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions | undefined;

    if (!animationGroupOptions) {
        animationGroupsOptionsStore.value[superKey] = {
            [animationId]: {},
        } as StoredAnimationGroupOptions;

        animationGroupOptions = animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions;
    }

    if (
        !animationGroupOptions[animationId] ||
        Object.keys(animationGroupOptions[animationId]).length === 0
    ) {
        (animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions)[animationId] = JSON.parse(
            JSON.stringify(defaultStoredAnimationOptions),
        );
    }

    return (animationGroupsOptionsStore.value[superKey] as StoredAnimationGroupOptions)[animationId];
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
    [name: string]: any;
};

export type StoredAnimationGroupsControlOptions = {
    _storeTimestamp?: number;
    [name: string]: StoredAnimationGroupControlOptions | number | undefined;
};

const defaultStoredAnimationGroupControlOptions = {
    selectedControl: "controls",
    selectedAnimation: null,
};

export const getStoredAnimationGroupControlOptions = (
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    touchTimestamp(animationGroupsControlOptionsStore);

    if (!animationGroupsControlOptionsStore.value[superKey]) {
        animationGroupsControlOptionsStore.value[superKey] = JSON.parse(
            JSON.stringify(defaultStoredAnimationGroupControlOptions),
        );
    }

    return animationGroupsControlOptionsStore.value[superKey] as StoredAnimationGroupControlOptions;
};

export const resetAllStores = () => {
    animationGroupsOptionsStore.value = { _storeTimestamp: Date.now() };
    animationGroupsControlOptionsStore.value = { _storeTimestamp: Date.now() };
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

export const getAllState = (): object => {
    // Strip _storeTimestamp so the same logical state always produces the same hash
    const { _storeTimestamp: _1, ...options } = animationGroupsOptionsStore.value;
    const { _storeTimestamp: _2, ...controls } = animationGroupsControlOptionsStore.value;
    return { options, controls };
};

export const restoreStateFromHash = () => {
    const hash = window.location.hash.slice(1);
    if (!hash) return false;

    const state = decodeStateFromHash(hash) as any;
    if (!state) return false;

    if (state.options) {
        Object.assign(animationGroupsOptionsStore.value, state.options);
    }
    if (state.controls) {
        Object.assign(animationGroupsControlOptionsStore.value, state.controls);
    }

    // Clear hash after restoring to avoid stale state
    history.replaceState(null, "", window.location.pathname + window.location.search);

    return true;
};

// Attempt to restore state from URL hash on module load
restoreStateFromHash();
