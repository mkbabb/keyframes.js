import { Animation, InputAnimationOptions } from "@src/animation";
import { jumpTerms } from "@src/easing";

export type StoredAnimationOptions = {
    animationOptions: InputAnimationOptions;
    stepOptions: {
        steps: number;
        jumpTerm: (typeof jumpTerms)[number];
    };
    cubicBezierOptions: {
        controlPoints: [number, number, number, number];
    };
};

export type StoredAnimationsOptions = {
    [name: string]: StoredAnimationOptions;
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

const animationOptionsStore = useStorage(
    "animation-options-store",
    {} as StoredAnimationsOptions,
);

export const getStoredAnimationOptions = (
    animation: Animation<any> | string,
): StoredAnimationOptions => {
    const animationId =
        typeof animation === "string" ? animation : animation.name ?? animation.id;

    if (!animationOptionsStore.value[animationId]) {
        animationOptionsStore.value[animationId] = JSON.parse(
            JSON.stringify(defaultStoredAnimationOptions),
        );
    }
    const storedAnimationOptions = animationOptionsStore.value[animationId];

    return storedAnimationOptions;
};
