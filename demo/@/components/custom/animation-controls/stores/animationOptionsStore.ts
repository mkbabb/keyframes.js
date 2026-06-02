import { jumpTerms } from "@mkbabb/value.js";
import { getAnimationId, Animation } from "@src/animation/engine";
import type { InputAnimationOptions } from "@src/animation/constants";
import { createGlobalState, useStorage } from "@vueuse/core";
import { checkAndResetExpiredStore, getAnimationSuperKey } from "./storeUtils";

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

export const useAnimationGroupsOptionsStore = createGlobalState(() => {
    const store = useStorage<StoredAnimationGroupsOptions>(
        "animation-groups-options-store",
        { _storeTimestamp: Date.now() } as StoredAnimationGroupsOptions,
    );
    checkAndResetExpiredStore(store, { _storeTimestamp: Date.now() });
    return store;
});

export const getStoredAnimationOptions = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationOptions => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId!);

    const animationGroupsOptionsStore = useAnimationGroupsOptionsStore();

    let animationGroupOptions = animationGroupsOptionsStore.value[
        superKey
    ] as StoredAnimationGroupOptions | undefined;

    if (!animationGroupOptions) {
        animationGroupsOptionsStore.value[superKey] = {
            [animationId]: {},
        } as StoredAnimationGroupOptions;

        animationGroupOptions = animationGroupsOptionsStore.value[
            superKey
        ] as StoredAnimationGroupOptions;
    }

    const existing = animationGroupOptions[animationId];
    if (!existing || Object.keys(existing).length === 0) {
        (
            animationGroupsOptionsStore.value[
                superKey
            ] as StoredAnimationGroupOptions
        )[animationId] = structuredClone(defaultStoredAnimationOptions);
    }

    return (
        animationGroupsOptionsStore.value[
            superKey
        ] as StoredAnimationGroupOptions
    )[animationId]!;
};

export const createAnimationUUId = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
) => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId!);

    return `${superKey}-${animationId}`;
};

/** Reset the store to defaults (used by resetAllStores). */
export const _resetAnimationGroupsOptionsStore = () => {
    const store = useAnimationGroupsOptionsStore();
    store.value = { _storeTimestamp: Date.now() } as StoredAnimationGroupsOptions;
};
