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
import {
    useSceneMachine,
    createRafAdapter,
    type ScenePlayback,
} from "@components/custom/animation-controls/stores";
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

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ──
    // The former private `isPlaying = ref(true)` + the dummy-group paused-mirror
    // watch were the SHADOW playback authority (the D12 smell — a second source
    // of truth nothing could suspend). DELETED: the play-intent is now a
    // read-only projection of `machine.status === 'playing'`, and play/pause
    // dispatch to the machine (the single authority). The bottom bar + ribbon
    // read THIS computed and write via play/pause/togglePlay below.
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");

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
        // The loop GATES on the machine (the single authority) — not a private
        // isPlaying. When the machine leaves `playing` the loop self-terminates.
        if (machine.status.value !== "playing") return false;
        // One full alternate cycle (0→1→0) per `2 * duration`.
        const phase = ((now - startTime) / (duration.value * 2)) % 1;
        progress.value = sweep.at(phase).p;
        return true;
    };

    /** Re-arm the rAF loop (re-seeds startTime from the current progress so the
     *  sweep resumes in phase). Idempotent — a no-op while already running. */
    const startLoop = () => {
        if (!playback.running) {
            startTime = performance.now() - progress.value * duration.value * 2;
            playback.loop(frame);
        }
    };
    const stopLoop = () => playback.stop();

    // The transport methods dispatch to the machine (the authority); the
    // adapter's resume/suspend re-arms/stops the loop, so play/pause never poke
    // a private flag.
    const play = () => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };
    const pause = () => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };
    const togglePlay = () => {
        if (isPlaying.value) pause();
        else play();
    };

    const reset = () => {
        progress.value = 0;
        startTime = performance.now();
        machine.dispatch({ type: "RESET" });
    };

    // ── The raw-rAF ScenePlayback adapter (WV-W1-HIGH-3) ──
    // Round-trips progress/isPlaying through the contract — the easing↔cube
    // cross-pair the group gate misses. The App registers this on SCENE_READY.
    const scenePlayback: ScenePlayback = createRafAdapter({
        getProgress: () => progress.value,
        setProgress: (t) => { progress.value = t; },
        getPlaying: () => machine.status.value === "playing",
        // setPlaying is a no-op marker: the machine status IS the intent; the
        // loop is driven by start/stopLoop below. Kept for contract symmetry.
        setPlaying: () => {},
        isLoopRunning: () => playback.running,
        stopLoop,
        startLoop,
    });

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

    // Stop the raw RAFPlayback on scope dispose (the genuine unmount seam,
    // mirroring useRafLoop.ts onUnmounted(stop)) — the scene host has NO
    // <KeepAlive>, so onDeactivated never fires and would leak this loop on swap.
    onScopeDispose(() => playback.stop());

    // B-3: idle the preview rAF while the tab is hidden, without disturbing the
    // machine's play/pause intent (PRESERVED autoPaused contract — "only resume
    // what IT paused"). `startLoop` re-seeds startTime from the current
    // progress, so the sweep resumes in phase with no jump.
    useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);

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

    // ── Scene-contract group (the bottom-bar transport host) ──────────
    // AnimationControlsGroup binds an `AnimationGroup` for its transport readout
    // (play button, Keyframes-string serialization). This scene's MOTION is the
    // light `NumericAnimation` sweep above; the group drives NO motion. It is NOT
    // a playback authority anymore — the former hand-synced `paused` mirror (the
    // D12 shadow-authority smell) is replaced by a ONE-WAY projection of the
    // machine status below. Its serializer is safe (the cssValue twin, H.W0).
    // [DOCUMENTED EXPECTATION, WV-W1 lane-4 escape hatch: the group is retained
    // ONLY as the transport host; deleting it outright would strand the entire
    // bottom-bar contract (ControlsPaneWrapper/AnimationMenuBar/readout). The
    // playback authority is the machine + the raw-rAF ScenePlayback adapter.]
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

    // ONE-WAY projection: the transport host's `paused` mirrors the machine
    // status so the bottom-bar play button reflects the true playback state.
    // This is a read-only projection (the machine is the authority) — NOT the
    // former bidirectional hand-sync that made the group a shadow authority.
    watch(isPlaying, (playing) => {
        animationGroup.paused = !playing;
    }, { immediate: true });

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
        // The raw-rAF ScenePlayback adapter — the App registers this on
        // SCENE_READY so suspend/restore route through the contract (the easing↔
        // cube cross-pair the group gate misses).
        scenePlayback,
    };
}
