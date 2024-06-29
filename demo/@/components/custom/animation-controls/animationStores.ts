import { Animation, InputAnimationOptions } from "@src/animation";
import { jumpTerms } from "@src/easing";

export type StoredAnimationOptions = {
    animationOptions: InputAnimationOptions;
    animationState: {
        t: number,
        startTime: number,
        pauseTime: number,
        paused: boolean,
    }
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
    timingFunction: "linear",
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

const animationGroupsOptionsStore = useStorage(
    "animation-groups-options-store",
    {} as StoredAnimationGroupsOptions,
);

export const getAnimationId = (animation: Animation<any> | string): string => {
    if (typeof animation === "string") return animation;

    return animation.name ?? String(animation.id);
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

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    selectedAnimation: string;
};

export type StoredAnimationGroupsControlOptions = {
    [name: string]: StoredAnimationGroupControlOptions;
};

const defaultStoredAnimationGroupControlOptions = {
    selectedControl: "controls",
    selectedAnimation: "",
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
