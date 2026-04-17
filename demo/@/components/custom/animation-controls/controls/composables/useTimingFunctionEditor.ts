import {
    camelCaseToHyphen,
    CSSCubicBezier,
    timingFunctions,
} from "@mkbabb/value.js";
import { Animation } from "@src/animation/index";

import type {
    TimingFunction,
    TimingFunctionNames,
} from "@src/animation/constants";
import type { StoredAnimationOptions } from "../../stores";

import {
    getCurvePath,
    generateCurveSVGPath,
    generateStepSVGPath,
} from "./timingCurveUtils";
import {
    NAMED_EASING_BEZIER,
    DETAIL_TIMING_FUNCTIONS,
} from "../../animationDescriptions";

import { computed, ref, watch } from "vue";

// ── Static data (shared across all instances) ────────────────────────

let _timingFunctionsAnd: Record<string, any> | undefined;

function getTimingFunctionsAnd(): Record<string, any> {
    if (!_timingFunctionsAnd) {
        _timingFunctionsAnd = Object.fromEntries(
            Object.entries({
                "cubic-bezier": "cubic-bezier",
                ...timingFunctions,
            }).map(([k, v]) => [camelCaseToHyphen(k), v]),
        );
    }
    return _timingFunctionsAnd;
}

let _easingItems: { value: string }[] | undefined;

function getEasingItems(): { value: string }[] {
    if (!_easingItems) {
        _easingItems = Object.keys(getTimingFunctionsAnd()).map((key) => ({
            value: key,
        }));
    }
    return _easingItems;
}

// ── Composable ───────────────────────────────────────────────────────

export function useTimingFunctionEditor(
    getAnimation: () => Animation<any>,
    storedAnimationOptions: StoredAnimationOptions,
) {
    const timingFunctionsAnd = getTimingFunctionsAnd();
    const easingItems = getEasingItems();

    /** The name of the easing we auto-converted FROM (for subtitle display) */
    const convertedFromName = ref<string | null>(null);

    /** Whether the detail panel (cubic-bezier / steps) is open */
    const advancedOpen = ref(false);

    /** User dismissed the detail panel without changing the timing function */
    const detailPanelDismissed = ref(true);

    /** Only auto-open the editor when the edit icon was used, not from dropdown */
    const openEditorOnChange = ref(false);

    /** True when the current timing function has a dedicated editor (cubic-bezier, steps) */
    const isDetailEasing = computed(() =>
        DETAIL_TIMING_FUNCTIONS.has(
            storedAnimationOptions.animationOptions.timingFunction as string,
        ),
    );

    /** Whether the detail panel should be visible */
    const showDetailPanel = computed(
        () =>
            DETAIL_TIMING_FUNCTIONS.has(
                storedAnimationOptions.animationOptions.timingFunction as string,
            ) && !detailPanelDismissed.value,
    );

    /** Reactive SVG path for the current timing function */
    const activeCurvePath = computed(() => {
        const name = storedAnimationOptions.animationOptions
            .timingFunction as string;
        if (name === "cubic-bezier") {
            const [x1, y1, x2, y2] =
                storedAnimationOptions.cubicBezierOptions.controlPoints;
            return generateCurveSVGPath(CSSCubicBezier(x1, y1, x2, y2));
        }
        if (name === "steps") {
            const { steps } = storedAnimationOptions.stepOptions;
            return generateStepSVGPath(steps);
        }
        return getCurvePath(name, timingFunctionsAnd);
    });

    // Re-open the detail panel only when triggered via edit icon
    watch(
        () => storedAnimationOptions.animationOptions.timingFunction as string,
        () => {
            if (openEditorOnChange.value) {
                detailPanelDismissed.value = false;
                openEditorOnChange.value = false;
            }
        },
    );

    // ── Mutators ─────────────────────────────────────────────────────

    const setAnimationTimingFunction = (timingFunction: TimingFunction) => {
        const animation = getAnimation();
        animation.options.timingFunction = timingFunction;
        animation.frames.forEach((frame) => {
            frame.timingFunction = timingFunction;
        });
    };

    const updateTimingFunctionFromName = (
        key: TimingFunctionNames | "cubic-bezier",
    ) => {
        let timingFunction = (
            timingFunctions as Record<
                string,
                TimingFunction | ((...args: any[]) => TimingFunction)
            >
        )[key] as TimingFunction;

        if (key === "steps") {
            const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
            timingFunction = timingFunctions[key](steps, jumpTerm);
        } else if (key === "cubic-bezier") {
            timingFunction = CSSCubicBezier(
                ...storedAnimationOptions.cubicBezierOptions.controlPoints,
            );
        }
        setAnimationTimingFunction(timingFunction);
    };

    /** Called from the edit icon — opens the curve editor */
    const onEditIconClick = (currentEasing: string) => {
        openEditorOnChange.value = true;
        onEasingLabelClick(currentEasing);
    };

    const onEasingLabelClick = (currentEasing: string) => {
        if (currentEasing === "steps") {
            storedAnimationOptions.animationOptions.timingFunction =
                "steps" as any;
            detailPanelDismissed.value = false;
            return;
        }

        if (currentEasing === "cubic-bezier") {
            detailPanelDismissed.value = false;
            convertedFromName.value = null;
            return;
        }

        // Named easing → auto-convert to cubic-bezier
        const bezierPoints = NAMED_EASING_BEZIER[currentEasing];
        if (bezierPoints) {
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                ...bezierPoints,
            ];
            convertedFromName.value = currentEasing;
        } else {
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                0, 0, 1, 1,
            ];
            convertedFromName.value = currentEasing;
        }
        storedAnimationOptions.animationOptions.timingFunction =
            "cubic-bezier" as any;
        updateTimingFunctionFromName("cubic-bezier");
        detailPanelDismissed.value = false;
    };

    const exitDetailPanel = () => {
        detailPanelDismissed.value = true;
        convertedFromName.value = null;
    };

    return {
        // Static data
        timingFunctionsAnd,
        easingItems,

        // Reactive state
        convertedFromName,
        advancedOpen,
        isDetailEasing,
        showDetailPanel,
        activeCurvePath,

        // Actions
        onEditIconClick,
        onEasingLabelClick,
        exitDetailPanel,
        setAnimationTimingFunction,
        updateTimingFunctionFromName,
    };
}
