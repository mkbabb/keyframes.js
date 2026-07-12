import {
    camelCaseToHyphen,
    CSSCubicBezier,
    cubicBezierToString,
    steppedEase,
    stepEnd,
    stepStart,
    timingFunctions,
} from "@mkbabb/value.js";
import { computed, markRaw, ref, watch } from "vue";
import { useThrottledReadout } from "@composables/useThrottledReadout";

import { NumericAnimation } from "@mkbabb/keyframes.js";
import type { TimingFunction } from "@mkbabb/keyframes.js";

import {
    generateCurveSVGPath,
    generateStepSVGPath,
} from "@utils/reference-data/timingCurveUtils";
import { NAMED_EASING_BEZIER } from "@utils/reference-data/animationDescriptions";
import { useRafScene } from "@composables/scene-runtime/useRafScene";
import { useSceneTransport } from "@composables/scene-runtime/useSceneTransport";
import type { SceneFacility } from "@composables/scene-facility";
import { PROGRESS_READOUT_HZ } from "@utils/rafConstants";
import { useSceneMachine } from "@state";
import { kfEngine } from "@utils/kfEngine";
import { EASING_SCENE_ID } from "./easingKeys";
import { getFamilyForCurve, getFamilyCurves } from "@utils/reference-data/easingGroups";

// ── Static data ────────────────────────────────────────────────────

// R.W6 C.2 — module-level const (synchronous pure derivation, no side-effects).
// Replaces the former `let _timingFunctionsAnd` mutable singleton + guarded-init.
// `Record<string, unknown>` captures the mixed bag: named TimingFunctions, the
// "cubic-bezier" string sentinel, and parameterized factory functions (steppedEase
// etc.) — the callers guard with `typeof fn === "function"` before using as a
// TimingFunction.
const timingFunctionsAnd: Record<string, unknown> = Object.fromEntries(
    Object.entries({
        "cubic-bezier": "cubic-bezier",
        ...timingFunctions,
    }).map(([k, v]) => [camelCaseToHyphen(k), v]),
);

// J.W2 S6 (LS-20) — the jump-term union the `steppedEase` signature expects,
// derived FROM that signature (one authority; no `as any` laundering the type).
type JumpTerm = NonNullable<Parameters<typeof steppedEase>[1]>;

// ── Composable ─────────────────────────────────────────────────────

export function useEasingDemo() {

    // ── Reactive state ─────────────────────────────────────────────

    const currentEasingName = ref("ease");
    const bezierControlPoints = ref<[number, number, number, number]>([0.25, 0.1, 0.25, 1.0]);
    const stepOptions = ref<{ steps: number; jumpTerm: JumpTerm }>({
        steps: 4,
        jumpTerm: "jump-end",
    });
    const duration = ref(1500);

    // (T.E6 / OD-7 — the comparison-DIFF ghost + the drag-bend smear DIED with
    // the singular hero: the specimen drawer IS the scene, every curve's
    // portrait is always on stage, so a ghost baseline has nothing to diff
    // against and the smear has no beam to smear. useEasingGhost.ts +
    // useEasingTraceSmear.ts are deleted; the former design-refinement S5 arm
    // was already retired at batch ⑧ — this removes its surface.)

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ──
    // The former private `isPlaying = ref(true)` + the dummy-group paused-mirror
    // were the SHADOW playback authority (the D12 smell). `useSceneTransport`
    // (R.W5 B.2) projects `isPlaying` read-only off `machine.status` and routes
    // play/pause/togglePlay to dispatch — the machine is the single authority.
    const machine = useSceneMachine();
    const { isPlaying, play, pause, togglePlay } = useSceneTransport(machine);

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
            return steppedEase(stepOptions.value.steps, stepOptions.value.jumpTerm);
        }
        if (name === "step-start") return stepStart();
        if (name === "step-end") return stepEnd();

        const fn = timingFunctionsAnd[name];
        return typeof fn === "function" ? (fn as TimingFunction) : (t: number) => t;
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
                    fn: typeof fn === "function" ? (fn as TimingFunction) : (t: number) => t,
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

    let startTime = 0;

    // ── I.W4 D4 — THE HOT POSITIONAL UPDATE OFF THE VUE RENDER GRAPH ──────────
    // The former `frame()` wrote `progress.value = sweep.at(phase).p` EVERY frame.
    // `progress` is a Vue `ref` with many reactive consumers (the hero ball, every
    // comparison-track ball, the curve-canvas dot, the `f(p)=` readout, the
    // contract time-twin watch) → a full re-render of the 243-node SVG gallery per
    // frame (21.6 ms / 36 dropped, ~46 fps — b16 §1). Reactivity is the WRONG tool
    // for a 60 Hz positional update.
    //
    // The cure (square's exact discipline): the loop drives the dot positions via
    // DIRECT, non-reactive `style.transform` writes — registered "dot painters"
    // the view layer hands us (each owns the geometry for ONE moving dot and
    // imperatively positions it). The reactive `progress` ref is written at most a
    // few Hz (`PROGRESS_READOUT_HZ`) for the human-readable readouts + the contract
    // time-twin — NOT once per frame. The result is the cube-parity 60 fps.
    //
    // `liveProgress()` is the always-current sweep value the painters + the scrub
    // path read (the reactive `progress` lags it by ≤ 1 readout tick, by design).
    let livePhaseValue = 0; // the raw eased sweep value [0,1], updated every frame
    // T.F23(c) — the cold-path readout cadence rides the ONE shared seam
    // (useThrottledReadout), not a hand-rolled accumulator (lane 21 rec 4).
    const readout = useThrottledReadout(PROGRESS_READOUT_HZ);

    /** A dot painter: position one moving dot for the given raw sweep value. The
     *  view layer registers these; the loop calls them imperatively each frame. */
    type DotPainter = (phase: number) => void;
    const dotPainters = new Set<DotPainter>();

    /** Register a non-reactive dot painter (returns an unregister fn). The view
     *  layer hands us a closure that writes `el.style.transform` directly — the
     *  loop drives it off the render graph. Paints once immediately so the dot is
     *  correct at registration time (e.g. on a paused scene). */
    const registerDotPainter = (paint: DotPainter): (() => void) => {
        dotPainters.add(paint);
        paint(livePhaseValue);
        return () => dotPainters.delete(paint);
    };

    /** Repaint every registered dot at the current live phase (used after a scrub
     *  / curve change so the dots track even while the loop is paused). */
    const repaintDots = (): void => {
        for (const paint of dotPainters) paint(livePhaseValue);
    };

    /** The always-current raw sweep value [0,1] (the painters + scrub read this;
     *  the reactive `progress` lags it by ≤ one readout tick, by design). */
    const liveProgress = (): number => livePhaseValue;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        // The loop GATES on the machine (the single authority) — not a private
        // isPlaying. When the machine leaves `playing` the loop self-terminates.
        if (machine.status.value !== "playing") {
            // On stop, reconcile the reactive readout to the LIVE value so the
            // contract authority (`progress`, what the ScenePlayback adapter
            // snapshots/restores) matches the painted position whenever the loop
            // is idle — no ≤1-tick lag survives a pause.
            progress.value = livePhaseValue;
            return false;
        }
        // One full alternate cycle (0→1→0) per `2 * duration`.
        const phase = ((now - startTime) / (duration.value * 2)) % 1;
        livePhaseValue = sweep.at(phase).p;
        // Hot path — direct DOM writes, NO Vue reactivity (D4).
        for (const paint of dotPainters) paint(livePhaseValue);
        // Cold path — write the reactive readout at a few Hz only (the `f(p)=`
        // text + the contract time-twin), NOT per frame.
        readout.maybeFlush(now, () => {
            progress.value = livePhaseValue;
        });
        return true;
    };

    // ── The raw-rAF scene recipe (I.W1 S2 — consolidated in useRafScene) ──
    // useRafScene OWNS the RAFPlayback, the BOUND startLoop/stopLoop, the
    // createRafAdapter wiring, the onScopeDispose(stopLoop) seam, AND the
    // useSceneVisibilityPause registration with BOUND callbacks (no scene can
    // re-introduce the unbound `playback.stop` that threw `this._gen`). The
    // scene supplies only the per-frame work + the per-arm clock rebase.
    const { playback, startLoop, scenePlayback } = useRafScene({
        frame,
        // Re-seed startTime from the LIVE phase so the sweep resumes in phase. The
        // loop reconciles `progress` to `livePhaseValue` on stop, so the two agree
        // whenever the loop is idle (the resume anchor is exact).
        onArm: () => {
            startTime = performance.now() - livePhaseValue * duration.value * 2;
        },
        // `progress` is the CONTRACT authority the ScenePlayback adapter snapshots/
        // restores (a discrete scrub position, reconciled to the live value on
        // every loop stop). The painters read `livePhaseValue` directly — the hot
        // path never routes through this reactive ref.
        getProgress: () => progress.value,
        setProgress: (t) => {
            // A scrub / restore writes the sweep position: keep the reactive
            // readout, the live value, AND the painted dots all in lock-step (a
            // discrete event, not the 60 Hz hot path — the reactive write here is
            // correct: it drives the readouts + dots to the scrubbed value at once).
            progress.value = t;
            livePhaseValue = t;
            repaintDots();
        },
        getPlaying: () => machine.status.value === "playing",
    });

    // play/pause/togglePlay come from useSceneTransport (above) — they dispatch
    // to the machine (the authority); the adapter re-arms/stops the loop.

    const reset = () => {
        livePhaseValue = 0;
        progress.value = 0;
        startTime = performance.now();
        repaintDots();
        machine.dispatch({ type: "RESET" });
    };

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

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

    // ("the Gallery" tour — RETIRED at T.E7, VERDICT #15: the tour + its door
    //  button were owner-ruled removals; the T.E6/OD-7 redesigned scene IS the
    //  gallery.)

    const updateBezierPoints = (points: [number, number, number, number]) => {
        bezierControlPoints.value = points;
        // If editing a named curve's bezier, switch to custom
        if (currentEasingName.value !== "cubic-bezier") {
            currentEasingName.value = "cubic-bezier";
        }
    };

    // S.G2 S6 — the former `parseCSSValue` typed-literal round-trip (Q.WC2 S2,
    // consumed ONLY by the deleted writable value-input row in EasingSidebar) is
    // REMOVED with its sole consumer. Precision authoring rides the glass-ui
    // EasingPicker (T.E8 — handle drag + native steps mode); named curves ride
    // the gallery tiles (T.E6) + the picker's preset dropdown.

    // ── THE EASING PREVIEW CHANNEL (T.B1-β/T.B7 — the decoy is DEAD) ──────────
    // The former contract-group opacity decoy ("Easing Preview", a fake
    // group whose keyframes painted nothing) is DELETED. The transport rides ONE
    // REAL `CSSKeyframesAnimation` whose keyframes ARE the preview sweep
    // (translateX 0→100%, the ball's rail) and whose `timingFunction` IS the
    // edited easing (the CSS-string twin `cssValue` — H.W0 H-A1: a custom
    // TimingFunction has no `animation-timing-function` string; edits re-seat it
    // via the watch below, honest by construction). Its clock is the sweep
    // time-twin the standard PlaybackRibbon binds (scrubber + visualizer).
    const { CSSKeyframesAnimation } = kfEngine();
    const previewAnim = markRaw(
        new CSSKeyframesAnimation<{ transform: { translateX: number } }>({
            duration: duration.value,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: cssValue.value,
        }).fromString(
            `@keyframes easing-preview {
    from { transform: translateX(0%); }
    to   { transform: translateX(100%); }
}`,
        ),
    );
    previewAnim.name = "Easing";
    previewAnim.superKey = EASING_SCENE_ID;

    // The edited easing + duration RE-SEAT the preview animation's options (the
    // decoy captured construction-time values and never tracked an edit — the
    // dishonesty class T.B1 kills). `setTimingFunction` normalizes the CSS twin.
    watch(cssValue, (v) => {
        try {
            previewAnim.setTimingFunction(v);
        } catch {
            // KEEP: a mid-edit twin (e.g. a transiently bare name) keeps the
            // last valid timing function — fail-soft on the live edit path.
        }
    });
    watch(duration, (d) => {
        previewAnim.setDuration(d);
    });

    // G3 (H.W10.S2) — mirror the linear sweep onto the preview animation's clock
    // so the STANDARD PlaybackRibbon (the scrubber Slider + the AnimationVisualizer
    // ball, mounted in the scene's ribbonContent slot) tracks the real progress:
    // the visualizer reads `effectiveT/duration`, the scrubber reads `currentT`.
    // A watch (not the rAF frame) keeps the twin write off the hot path.
    watch(progress, (p) => {
        previewAnim.t = p * previewAnim.options.duration;
        // I.W4 D4 — keep the imperatively-painted dots in lock-step with a PAUSED
        // scrub. The scene's scrubber writes `demo.progress.value` directly (a
        // discrete paused-scrub event), so when the loop is idle a `progress`
        // change must reconcile the live value + repaint the dots. While the loop
        // RUNS it owns `livePhaseValue` (the 12 Hz reactive write must NOT bounce
        // back through here), so we gate on the loop being idle.
        if (!playback.running) {
            livePhaseValue = p;
            repaintDots();
        }
    }, { immediate: true });

    // ── THE EASING FACILITY (T.B1-β) ──────────────────────────────────────────
    // ONE real channel ("Easing" — the preview animation above; its triad is
    // honest: the edited easing IS its timingFunction) + the `easing` facet (the
    // curve editor surface) + the SAME raw-rAF ScenePlayback adapter the machine
    // registers. The scrub round-trip seats the reactive `progress` authority;
    // the idle-gated watch above reconciles the live value + repaints the dots.
    const facility: SceneFacility = {
        channels: [
            {
                name: "Easing",
                animation: previewAnim,
                progress: () => liveProgress(),
                setProgress: (t: number) => {
                    progress.value = Math.max(0, Math.min(1, t));
                },
            },
        ],
        facets: [{ surface: "easing", label: "Curve", icon: "Activity" }],
        playback: scenePlayback,
    };

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

        // I.W4 D4 — the non-reactive hot-path seam: the always-current raw sweep
        // value + the dot-painter registry the view layer wires its moving dots
        // through (direct `style.transform` writes, off the Vue render graph).
        liveProgress,
        registerDotPainter,
        repaintDots,

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
        play,
        pause,
        togglePlay,
        reset,

        // T.B1-β — the SceneFacility descriptor (the ONE real preview channel +
        // the `easing` facet + the raw-rAF playback).
        facility,
        // The preview animation (the REAL channel animation the standard
        // PlaybackRibbon binds its scrubber + visualizer to — G3/H.W10.S2).
        previewAnim,
        // The raw-rAF ScenePlayback adapter — the App registers this on
        // SCENE_READY so suspend/restore route through the contract (the easing↔
        // cube cross-pair the group gate misses). Also `facility.playback`.
        scenePlayback,
    };
}
