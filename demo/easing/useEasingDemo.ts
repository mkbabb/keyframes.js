import {
    camelCaseToHyphen,
    CSSCubicBezier,
    cubicBezierToString,
    steppedEase,
    stepEnd,
    stepStart,
    timingFunctions,
} from "@mkbabb/value.js";
import { computed, markRaw, onScopeDispose, ref, watch } from "vue";

import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";
import { NumericAnimation } from "@src/animation/numeric";
import { RAFPlayback } from "@src/animation/playback";
import type { TimingFunction } from "@src/animation/constants";

import {
    generateCurveSVGPath,
    generateStepSVGPath,
} from "@components/custom/animation-controls/controls/timingCurveUtils";
import { NAMED_EASING_BEZIER } from "@components/custom/animation-controls/animationDescriptions";
import { useSceneVisibilityPause } from "../app/useSceneVisibilityPause";
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
    // The raw [0,1] time parameter the preview sweeps. Each curve (the selected
    // one and every comparison track) eases THIS in the view layer, so it stays
    // the linear time axis — the scrubber writes it directly while paused.
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

    // ── Preview sweep: NumericAnimation (direction: "alternate") ────
    // The 0→1→0 ping-pong is the keyframe sequence itself — a normalized phase
    // sweep through it alternates for free, so the preview owns no hand-synced
    // ping-pong math. The animation is linear: `progress` is the raw time axis
    // the view layer eases per-curve, so the preview must NOT pre-ease it.
    const sweep = markRaw(
        new NumericAnimation<{ p: number }>([{ p: 0 }, { p: 1 }, { p: 0 }]),
    );

    const playback = markRaw(new RAFPlayback());
    let startTime = 0;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        if (!isPlaying.value) return false;
        // One full alternate cycle (0→1→0) per `2 * duration`.
        const phase = ((now - startTime) / (duration.value * 2)) % 1;
        progress.value = sweep.at(phase).p;
        return true;
    };

    const ensureLoop = () => {
        if (isPlaying.value && !playback.running) {
            startTime = performance.now() - progress.value * duration.value * 2;
            playback.loop(frame);
        }
    };

    const play = () => {
        if (isPlaying.value) return;
        isPlaying.value = true;
        ensureLoop();
    };

    const pause = () => {
        if (!isPlaying.value) return;
        isPlaying.value = false;
        playback.stop();
    };

    const togglePlay = () => {
        if (isPlaying.value) pause();
        else play();
    };

    const reset = () => {
        progress.value = 0;
        startTime = performance.now();
    };

    // Auto-start: the immediate watcher starts the loop on mount (each swap-in
    // re-mounts the scene under the bare keyed <Suspense>, so mount-time start is
    // the single, complete start authority).
    watch(isPlaying, (playing) => {
        if (playing) ensureLoop();
    }, { immediate: true });

    // Stop the raw RAFPlayback on scope dispose (the genuine unmount seam,
    // mirroring useRafLoop.ts onUnmounted(stop)) — the scene host has NO
    // <KeepAlive>, so onDeactivated never fires and would leak this loop on swap.
    onScopeDispose(() => playback.stop());

    // B-3: idle the preview rAF while the tab is hidden, without disturbing the
    // user's play/pause intent. `isPlaying` is left untouched (the play button
    // stays as-is); on return `ensureLoop` only re-arms if the user had it
    // playing. `ensureLoop` re-seeds `startTime` from the current `progress`, so
    // the sweep resumes in phase with no jump.
    useSceneVisibilityPause(() => playback.running, playback.stop, ensureLoop);

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

    // ── Scene-contract group ───────────────────────────────────────
    // The bottom bar's transport (`AnimationControlsGroup`) requires an
    // `AnimationGroup`; this scene's motion is the light `NumericAnimation`
    // above, so the group is a minimal placeholder whose `paused` flag mirrors
    // the preview loop — it drives no motion (no per-frame re-seat). Its easing
    // mirrors the selected curve only so the bottom-bar readout matches.
    const contractAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: duration.value,
            iterationCount: "infinite",
            direction: "alternate",
            // Pass the CSS-string twin (not the bare `currentEasingFn` closure):
            // a custom `TimingFunction` has no `animation-timing-function`
            // representation, so the bottom-bar Keyframes-string readout
            // (`serializeEasing`) THROWS on a bare closure (H.W0 H-A1). The
            // string form resolves to a twinned `Easing {fn, css}` via the
            // engine, so the readout round-trips and the curve is preserved.
            timingFunction: cssValue.value,
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    contractAnim.name = "Easing Preview";
    contractAnim.superKey = "Easing";

    const animationGroup = markRaw(new AnimationGroup(contractAnim as any));

    // Pre-start the group so the bottom bar sees it as "playing" and
    // toggleAnimationGroup correctly toggles pause instead of first-start.
    animationGroup.started = true;
    animationGroup.paused = false;

    // Keep the group's paused flag in sync with the preview loop so the bottom
    // bar's play button reflects (and toggles) the actual preview state.
    watch(isPlaying, (playing) => {
        animationGroup.paused = !playing;
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
