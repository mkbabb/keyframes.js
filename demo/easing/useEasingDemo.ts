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
import type { TimingFunction } from "@src/animation/constants";

import {
    generateCurveSVGPath,
    generateStepSVGPath,
} from "@components/custom/animation-controls/controls/timingCurveUtils";
import { NAMED_EASING_BEZIER } from "@components/custom/animation-controls/animationDescriptions";
import { useRafScene } from "../app/useRafScene";
import { useSceneMachine } from "@components/custom/animation-controls/stores";
import { getFamilyForCurve, getFamilyCurves, type CurveGroupItem } from "./easingGroups";
import { useEasingGallery } from "./useEasingGallery";

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
    const PROGRESS_READOUT_HZ = 6; // reactive readout cadence (a few Hz, not 60)
    let lastReadoutAt = 0;

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
        if (now - lastReadoutAt >= 1000 / PROGRESS_READOUT_HZ) {
            lastReadoutAt = now;
            progress.value = livePhaseValue;
        }
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

    // Stop the gallery's pending timers on scope dispose (the raw RAFPlayback's
    // own teardown is owned by useRafScene's onScopeDispose(stopLoop)).
    onScopeDispose(() => {
        disposeGallery();
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

    // EASTER EGG — "the Gallery" (H.W12.S6): the self-playing curve tour, a
    // colocated sub-unit (useEasingGallery — the natural easter-egg concern seam).
    const { gallery, disposeGallery } = useEasingGallery(
        selectEasing,
        currentEasingName,
        timingFunctionsAnd,
    );

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

    // G3 (H.W10.S2) — mirror the linear sweep onto the contract animation's clock
    // so the STANDARD PlaybackRibbon (the scrubber Slider + the AnimationVisualizer
    // ball, mounted in the scene's ribbonContent slot) tracks the real progress:
    // the visualizer reads `effectiveT/duration`, the scrubber reads `currentT`.
    // The contract anim still drives NO motion (it has no DOM target) — this is a
    // pure time-twin so the standard transport reflects the live sweep. A watch
    // (not the rAF frame) avoids the contractAnim TDZ — the loop arms at mount
    // before this `const` is declared.
    watch(progress, (p) => {
        contractAnim.t = p * contractAnim.options.duration;
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
        parseCSSValue,
        gallery,
        play,
        pause,
        togglePlay,
        reset,

        // Scene contract
        animationGroup,
        // The contract animation (the time-twin the standard PlaybackRibbon binds
        // its scrubber + visualizer to — G3/H.W10.S2).
        contractAnim,
        // The raw-rAF ScenePlayback adapter — the App registers this on
        // SCENE_READY so suspend/restore route through the contract (the easing↔
        // cube cross-pair the group gate misses).
        scenePlayback,
    };
}
