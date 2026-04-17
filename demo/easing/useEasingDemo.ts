import {
    camelCaseToHyphen,
    CSSCubicBezier,
    cubicBezierToString,
    steppedEase,
    stepEnd,
    stepStart,
    timingFunctions,
} from "@mkbabb/value.js";
import { computed, markRaw, onActivated, onDeactivated, ref, watch } from "vue";

import { CSSKeyframesAnimation } from "@src/animation/index";
import { AnimationGroup } from "@src/animation/group";
import type { TimingFunction } from "@src/animation/constants";

import {
    generateCurveSVGPath,
    generateStepSVGPath,
} from "@components/custom/animation-controls/controls/composables/timingCurveUtils";
import { NAMED_EASING_BEZIER } from "@components/custom/animation-controls/animationDescriptions";
import { getFamilyForCurve, getFamilyCurves, type CurveGroupItem } from "./easingGroups";

// ── Static data ────────────────────────────────────────────────────

let _timingFunctionsAnd: Record<string, any> | undefined;

export function getTimingFunctionsAnd(): Record<string, any> {
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

// ── Composable ─────────────────────────────────────────────────────

export function useEasingDemo() {
    const timingFunctionsAnd = getTimingFunctionsAnd();

    // ── Reactive state ─────────────────────────────────────────────

    const currentEasingName = ref("ease");
    const bezierControlPoints = ref<[number, number, number, number]>([0.25, 0.1, 0.25, 1.0]);
    const stepOptions = ref({ steps: 4, jumpTerm: "jump-end" as string });
    const duration = ref(1500);
    const isPlaying = ref(true);
    const progress = ref(0);

    // ── Derived state ──────────────────────────────────────────────

    const isSteps = computed(() => {
        const n = currentEasingName.value;
        return n === "steps" || n === "step-start" || n === "step-end";
    });

    const isBezierEditable = computed(() => {
        const n = currentEasingName.value;
        return n === "cubic-bezier" || n in NAMED_EASING_BEZIER;
    });

    const currentEasingFn = computed<TimingFunction>(() => {
        const name = currentEasingName.value;

        if (name === "cubic-bezier") {
            return CSSCubicBezier(...bezierControlPoints.value);
        }
        if (name === "steps") {
            return steppedEase(stepOptions.value.steps, stepOptions.value.jumpTerm as any);
        }
        if (name === "step-start") return stepStart();
        if (name === "step-end") return stepEnd();

        const fn = timingFunctionsAnd[name];
        return typeof fn === "function" ? fn : (t: number) => t;
    });

    const cssValue = computed(() => {
        const name = currentEasingName.value;
        if (name === "cubic-bezier") {
            return cubicBezierToString(...bezierControlPoints.value);
        }
        if (name === "steps") {
            return `steps(${stepOptions.value.steps}, ${stepOptions.value.jumpTerm})`;
        }
        // For named curves with a bezier approximation, show both the name
        // and the bezier value when actively editing
        return name;
    });

    const svgPath = computed(() => {
        const name = currentEasingName.value;
        if (name === "steps") {
            return generateStepSVGPath(stepOptions.value.steps);
        }
        if (name === "step-start") return generateStepSVGPath(1);
        if (name === "step-end") return "M 0,1 L 1,1 L 1,0";
        return generateCurveSVGPath(currentEasingFn.value);
    });

    const currentFamily = computed(() => getFamilyForCurve(currentEasingName.value));

    const comparisonCurves = computed<{ name: string; fn: TimingFunction }[]>(() => {
        const family = getFamilyCurves(currentEasingName.value);
        // Exclude steps/custom from comparison — they need parameters
        return family
            .filter((item) => !item.isDetail)
            .map((item) => {
                const fn = timingFunctionsAnd[item.name];
                return {
                    name: item.name,
                    fn: typeof fn === "function" ? fn : (t: number) => t,
                };
            });
    });

    // ── rAF progress loop ──────────────────────────────────────────

    let startTime = 0;
    let rafId: number | null = null;
    let pausedProgress = 0;

    const tick = (now: DOMHighResTimeStamp) => {
        if (!isPlaying.value) {
            // External pause (e.g. bottom bar). Clean up so the watcher can restart.
            pausedProgress = progress.value;
            rafId = null;
            return;
        }

        const elapsed = now - startTime;
        const dur = duration.value;
        // Ping-pong: forward then reverse
        const cycle = elapsed / dur;
        const phase = cycle % 2;
        progress.value = phase <= 1 ? phase : 2 - phase;

        rafId = requestAnimationFrame(tick);
    };

    const play = () => {
        if (isPlaying.value) return;
        isPlaying.value = true;
        startTime = performance.now() - pausedProgress * duration.value;
        rafId = requestAnimationFrame(tick);
    };

    const pause = () => {
        if (!isPlaying.value) return;
        isPlaying.value = false;
        pausedProgress = progress.value;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const togglePlay = () => {
        if (isPlaying.value) pause();
        else play();
    };

    const reset = () => {
        progress.value = 0;
        pausedProgress = 0;
        startTime = performance.now();
    };

    // Auto-start
    watch(isPlaying, (playing) => {
        if (playing && rafId === null) {
            startTime = performance.now() - pausedProgress * duration.value;
            rafId = requestAnimationFrame(tick);
        }
    }, { immediate: true });

    // KeepAlive lifecycle
    onActivated(() => {
        if (isPlaying.value && rafId === null) {
            startTime = performance.now() - progress.value * duration.value;
            rafId = requestAnimationFrame(tick);
        }
    });

    onDeactivated(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        pausedProgress = progress.value;
    });

    // ── Methods ────────────────────────────────────────────────────

    const selectEasing = (name: string) => {
        currentEasingName.value = name;

        // Load bezier control points if available
        const bezier = NAMED_EASING_BEZIER[name];
        if (bezier) {
            bezierControlPoints.value = [...bezier];
        } else if (name === "cubic-bezier") {
            // Keep current points
        } else {
            // Non-bezier curve: reset to linear approximation
            bezierControlPoints.value = [0, 0, 1, 1];
        }
    };

    const updateBezierPoints = (points: [number, number, number, number]) => {
        bezierControlPoints.value = points;
        // If editing a named curve's bezier, switch to custom
        if (currentEasingName.value !== "cubic-bezier") {
            currentEasingName.value = "cubic-bezier";
        }
    };

    const parseCSSValue = (input: string): boolean => {
        const trimmed = input.trim().toLowerCase();

        // cubic-bezier(x1, y1, x2, y2)
        const bezierMatch = trimmed.match(
            /cubic-bezier\(\s*([\d.e+-]+)\s*,\s*([\d.e+-]+)\s*,\s*([\d.e+-]+)\s*,\s*([\d.e+-]+)\s*\)/,
        );
        if (bezierMatch) {
            const pts: [number, number, number, number] = [
                parseFloat(bezierMatch[1]!),
                parseFloat(bezierMatch[2]!),
                parseFloat(bezierMatch[3]!),
                parseFloat(bezierMatch[4]!),
            ];
            if (pts.every((n) => !isNaN(n))) {
                bezierControlPoints.value = pts;
                currentEasingName.value = "cubic-bezier";
                return true;
            }
        }

        // steps(N, jump-term?)
        const stepsMatch = trimmed.match(
            /steps\(\s*(\d+)\s*(?:,\s*(jump-start|jump-end|jump-none|jump-both|start|end)\s*)?\)/,
        );
        if (stepsMatch) {
            stepOptions.value = {
                steps: parseInt(stepsMatch[1]!, 10),
                jumpTerm: stepsMatch[2] ?? "jump-end",
            };
            currentEasingName.value = "steps";
            return true;
        }

        // Named function
        if (trimmed in timingFunctionsAnd) {
            selectEasing(trimmed);
            return true;
        }

        return false;
    };

    // ── Dummy animation for scene contract ─────────────────────────

    const dummyAnimation = markRaw(
        new CSSKeyframesAnimation({
            duration: duration.value,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: currentEasingFn.value,
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    dummyAnimation.name = "Easing Preview";
    dummyAnimation.superKey = "Easing";

    const animationGroup = markRaw(new AnimationGroup(dummyAnimation as any));

    // Pre-start the group so the bottom bar sees it as "playing" and
    // toggleAnimationGroup correctly toggles pause instead of first-start.
    animationGroup.started = true;
    animationGroup.paused = false;

    // Keep the group's play state in sync with the demo's rAF loop.
    // When the bottom bar toggles play, AnimationControlsGroup calls
    // animationGroup.pause() which flips `paused`. We watch that and
    // sync our rAF loop. Conversely, when the ribbon toggles play,
    // we update the group's paused flag.
    watch(isPlaying, (playing) => {
        animationGroup.paused = !playing;
    });

    // Sync dummy animation's timing function
    watch(currentEasingFn, (fn) => {
        dummyAnimation.options.timingFunction = fn;
        dummyAnimation.frames.forEach((frame) => {
            frame.timingFunction = fn;
        });
    });

    watch(duration, (dur) => {
        dummyAnimation.setDuration(dur);
    });

    return {
        // Static
        timingFunctionsAnd,

        // State
        currentEasingName,
        bezierControlPoints,
        stepOptions,
        duration,
        isPlaying,
        progress,

        // Derived
        currentEasingFn,
        cssValue,
        svgPath,
        isBezierEditable,
        isSteps,
        currentFamily,
        comparisonCurves,

        // Methods
        selectEasing,
        updateBezierPoints,
        parseCSSValue,
        play,
        pause,
        togglePlay,
        reset,

        // Scene contract
        animationGroup,
    };
}
