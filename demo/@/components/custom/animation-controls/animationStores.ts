import { Animation, InputAnimationOptions, getAnimationId } from "@src/animation";
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
    [name: string]: StoredAnimationGroupOptions;
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

const animationGroupsOptionsStore = useStorage(
    "animation-groups-options-store",
    {} as StoredAnimationGroupsOptions,
);

export const getAnimationSuperKey = (
    superKey: Animation<any> | string | undefined,
    animation: Animation<any> | string | undefined = undefined,
): string => {
    if (superKey) {
        if (typeof superKey === "string") return superKey;
        return superKey.superKey ?? "default";
    }

    if (typeof animation === "string") return animation;
    return animation.superKey ?? "default";
};

export const getStoredAnimationOptions = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationOptions => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId);

    let animationGroupOptions = animationGroupsOptionsStore.value[superKey];

    if (!animationGroupOptions) {
        animationGroupsOptionsStore.value[superKey] = {
            [animationId]: {},
        } as StoredAnimationGroupOptions;

        animationGroupOptions = animationGroupsOptionsStore.value[superKey];
    }

    if (
        !animationGroupOptions[animationId] ||
        Object.keys(animationGroupOptions[animationId]).length === 0
    ) {
        animationGroupsOptionsStore.value[superKey][animationId] = JSON.parse(
            JSON.stringify(defaultStoredAnimationOptions),
        );
    }

    return animationGroupsOptionsStore.value[superKey][animationId];
};

export const createAnimationUUId = (
    animationId: Animation<any> | string | undefined = undefined,
    superKey: Animation<any> | string | undefined = undefined,
) => {
    superKey = getAnimationSuperKey(superKey, animationId);
    animationId = getAnimationId(animationId);

    return `${superKey}-${animationId}`;
};

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    selectedAnimation: string;
    selectedKeyframesControl: string;
    [name: string]: any;
};

export type StoredAnimationGroupsControlOptions = {
    [name: string]: StoredAnimationGroupControlOptions;
};

const defaultStoredAnimationGroupControlOptions = {
    selectedControl: "controls",
    selectedAnimation: null,
};

const animationGroupsControlOptionsStore = useStorage(
    "animation-groups-control-options-store",
    {} as StoredAnimationGroupsControlOptions,
);

export const getStoredAnimationGroupControlOptions = (
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    if (!animationGroupsControlOptionsStore.value[superKey]) {
        animationGroupsControlOptionsStore.value[superKey] = JSON.parse(
            JSON.stringify(defaultStoredAnimationGroupControlOptions),
        );
    }

    return animationGroupsControlOptionsStore.value[superKey];
};

export const resetAllStores = () => {
    animationGroupsOptionsStore.value = {};
    animationGroupsControlOptionsStore.value = {};
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

// resetAllStores();
