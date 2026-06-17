import { computed, markRaw, onScopeDispose, ref, watch } from "vue";

import { kfEngine } from "@utils/kfEngine";
import { SpringProgress } from "@mkbabb/keyframes.js";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { NumericAnimation } from "@mkbabb/keyframes.js";

import { useRafScene } from "../app/useRafScene";
import { useSceneMachine } from "@components/custom/animation-controls/stores";
import { SPRING_PRESETS } from "./springPresets";
import { useSpringHotPath, type SpringTrack } from "./useSpringHotPath";
import { useSpringKeyframesEditor } from "./useSpringKeyframesEditor";
import { useSpringDerby } from "./useSpringDerby";

// The comparison-row vocabulary stays importable from the demo composable (the
// sidebar consumes it here); the interface itself lives with the hot-path seam.
export type { SpringPreset } from "./springPresets";
export type { SpringTrack } from "./useSpringHotPath";

const SETTLE = 1e-4;
const SAMPLER_DURATION = 1400;

/**
 * Drives the SpringProgress / springTimingFunction showcase.
 *
 * - one *interactive* SpringProgress whose `target` re-seats on a tap/drag,
 *   parameterised by the live `response` / `dampingFraction` sliders;
 * - the four canonical presets (`smooth`/`snappy`/`bouncy`/`gentle`), each
 *   its own SpringProgress, all re-seated together so the comparison is fair;
 * - a `springTimingFunction` sampled from the interactive params, fed to a
 *   `NumericAnimation` so the JS-easing sampler is visible alongside the
 *   live physics tracker.
 *
 * One owned `RAFPlayback` `loop`s the whole comparison row off a single
 * shared clock — the SpringProgress solver is analytic, so a global clock
 * keeps every row phase-aligned (and the `loop` driver carries the engine's
 * `_gen` generation-guard, so a rapid pause/resume can never double-schedule).
 *
 * PLAYBACK AUTHORITY (H.W1): the loop GATES on the scene machine (the single
 * authority) — NOT a private `isPlaying` shadow. The former private
 * `isPlaying = ref(true)` + the dummy-group paused-mirror were the D12
 * shadow-authority smell; DELETED. `isPlaying` is now a read-only projection of
 * `machine.status === 'playing'`; play/pause dispatch to the machine; the scene
 * round-trips its sweep phase + play intent through the raw-rAF ScenePlayback
 * contract (WV-W1-HIGH-3).
 */
export function useSpringDemo() {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts.
    const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();

    // ── Sub-view selection (H.W5.S3 — the Discrete→Spring merge) ──────
    // The Spring scene now hosts TWO views of one spring curve:
    //   • "solver"   — the live SpringProgress rail + springTimingFunction sweep;
    //   • "discrete" — that same spring linear() easing a real @starting-style /
    //                  allow-discrete CSS transition (the former standalone
    //                  Discrete scene, merged here in one motion).
    // Both surface the artifact through the ONE useSpringLinearStops composable
    // (the 2→1 fold). The active view + the discrete card's visibility are owned
    // HERE so they live within the spring scene's SINGLE ScenePlayback
    // registration — NO second scene, NO second adapter.
    const view = ref<"solver" | "discrete">("solver");

    // The discrete-transition card's visibility (folded from the former
    // useStartingStyleDemo). The user drives it; the spring scene owns it.
    const visible = ref(true);
    const toggleDiscrete = () => {
        visible.value = !visible.value;
    };

    // ── Interactive params ───────────────────────────────────────────
    const response = ref(0.5);
    const dampingFraction = ref(0.86);

    // Live target the interactive spring chases. 0 = left rail, 1 = right.
    const target = ref(1);

    let liveSpring = markRaw(
        new SpringProgress({
            response: response.value,
            dampingFraction: dampingFraction.value,
            initial: 0,
            settleThreshold: SETTLE,
            velocitySettleThreshold: SETTLE,
        }),
    );
    liveSpring.target = target.value;

    // ── Canonical preset trackers ────────────────────────────────────
    const tracks = SPRING_PRESETS.map<SpringTrack>((preset) => {
        const spring = markRaw(
            new SpringProgress({
                response: preset.response,
                dampingFraction: preset.dampingFraction,
                initial: 0,
                settleThreshold: SETTLE,
                velocitySettleThreshold: SETTLE,
            }),
        );
        spring.target = 1;
        return {
            preset,
            spring,
            value: ref(0),
            velocity: ref(0),
            settled: ref(false),
        };
    });

    // ── J.W2 S5 (DS-3) — the non-reactive hot path + few-Hz readout mirrors ──
    // Extracted to the colocated useSpringHotPath (the W2-grown concern seam):
    // it owns the NON-reactive `springLive` snapshot (`.phase` is the raw sweep
    // phase) + the painter registry the hot path drives (direct `style` writes)
    // + the reactive READOUT mirrors flushed at a few Hz — the 60 Hz loop below
    // never touches the Vue render graph.
    const {
        liveValue,
        liveVelocity,
        liveSettled,
        sampled,
        progress,
        scrubberPhase,
        paintScrubberPhase,
        springLive,
        registerSpringPainter,
        repaintSprings,
        flushReadouts,
        maybeFlushReadouts,
    } = useSpringHotPath(tracks);

    // ── springTimingFunction sampler → NumericAnimation ──────────────
    // Sample the *same* (response, dampingFraction) the user is editing so the
    // sampled JS easing visibly mirrors the live physics tracker. The ping-pong
    // (0→1→0) is the keyframe sequence itself — a linear phase sweep through it
    // alternates for free, so the showcase owns no hand-synced phase math.
    const samplerCss = computed(
        () =>
            `springTimingFunction({ response: ${response.value.toFixed(2)}, dampingFraction: ${dampingFraction.value.toFixed(2)} })`,
    );

    // ── K.W4 S1 — the PROPER keyframes EDITOR animation (the cube grammar) ────
    // Colocated in `useSpringKeyframesEditor` (its own concern seam — the same
    // split shape as `useSpringHotPath`): the engine-owned KeyframesEditor's
    // two-way `CSSKeyframesAnimation` (per-stop value, add/remove stop) that
    // RETIRES the read-only viewer. The editor is the PRIMARY authoring path; a
    // typed edit PERSISTS (the solver presets are a derived convenience). The
    // `seedKeyframes()` action re-seeds ONLY on the explicit "re-sample" gesture.
    const { springEditAnim, seedKeyframes } = useSpringKeyframesEditor(
        () => response.value,
        () => dampingFraction.value,
        SAMPLER_DURATION,
    );

    let samplerAnim = markRaw(buildSamplerAnimation());
    function buildSamplerAnimation(): NumericAnimation<{ x: number }> {
        const fn = springTimingFunction({
            response: response.value,
            dampingFraction: dampingFraction.value,
        });
        return new NumericAnimation<{ x: number }>(
            [{ x: 0 }, { x: 1 }, { x: 0 }],
            { timingFunction: fn },
        );
    }

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ──
    // The former private `isPlaying = ref(true)` + the dummy-group paused-mirror
    // watch were the SHADOW playback authority (the D12 smell). DELETED: the
    // play-intent is a read-only projection of `machine.status === 'playing'`,
    // and play/pause dispatch to the machine (the single authority).
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");

    // ── Shared rAF loop ──────────────────────────────────────────────
    // The loop's start timestamp, rebased from `progress` on (re)arm so the
    // sweep resumes in phase. Mirrors easing's `startTime` discipline.
    let startTime = 0;
    let lastNow = 0;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        // The loop GATES on the machine (the single authority) — not a private
        // isPlaying. When the machine leaves `playing` the loop self-terminates,
        // reconciling the reactive readouts to the LIVE values so the contract
        // authority (`progress`, what the ScenePlayback adapter snapshots)
        // matches the painted state whenever the loop is idle.
        if (machine.status.value !== "playing") {
            flushReadouts();
            // K.W4 S2 — reconcile the continuous channels to the live phase on
            // the loop's last frame so the scrubber thumb + the visualizer twin
            // rest EXACTLY where the loop left them (no snap-back to a stale 6 Hz
            // mirror when the machine pauses mid-sweep).
            paintScrubberPhase();
            contractAnim.t = springLive.phase * contractAnim.options.duration;
            return false;
        }

        // dt from the single shared clock. First frame seeds the clock and
        // steps by zero (tickDt(0) is a no-op) — no magic-number dt seed.
        const dt = lastNow ? now - lastNow : 0;
        lastNow = now;

        // Interactive spring → the non-reactive snapshot (hot path).
        liveSpring.tickDt(dt);
        springLive.value = liveSpring.value;
        springLive.velocity = liveSpring.velocity;
        springLive.settled = liveSpring.settled;

        // Canonical presets → the snapshot (hot path).
        for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i]!;
            t.spring.tickDt(dt);
            springLive.trackValues[i] = t.spring.value;
        }

        // springTimingFunction sweep — `direction: alternate` as keyframes. The
        // normalized phase IS `progress`, so a restore re-seeds it directly.
        springLive.phase = ((now - startTime) / SAMPLER_DURATION) % 1;
        springLive.sampled = samplerAnim.at(springLive.phase).x;

        // Hot path — direct DOM writes, NO Vue reactivity (D4 transposed).
        repaintSprings();

        // K.W4 S2 — the CONTINUOUS scrubber position, written EVERY frame (60 Hz):
        // `scrubberPhase` (one position ref) drives the reka <Slider> thumb
        // born-continuous (never the 6 Hz step); `contractAnim.t` (markRaw) is the
        // visualizer ball's time-twin. Neither touches the badges (those ride the
        // 6 Hz throttle below) — the painter channel, NOT a re-paint storm.
        paintScrubberPhase();
        contractAnim.t = springLive.phase * contractAnim.options.duration;

        // Cold path — the reactive readout mirrors at a few Hz only.
        maybeFlushReadouts(now);

        return true;
    };

    // ── The raw-rAF scene recipe (I.W1 S2 — consolidated in useRafScene) ──
    // useRafScene OWNS the RAFPlayback, the BOUND startLoop/stopLoop, the
    // createRafAdapter wiring, the onScopeDispose(stopLoop) seam, AND the
    // useSceneVisibilityPause registration with BOUND callbacks (no scene can
    // re-introduce the unbound `playback.stop` that threw `this._gen`). The
    // scene supplies only the per-frame work + the per-arm clock rebase.
    const { startLoop, scenePlayback } = useRafScene({
        frame,
        // Re-seed the shared clock (lastNow = 0 so the first frame steps by dt=0)
        // + rebase startTime from the LIVE phase so the sweep resumes in phase
        // (the loop reconciles `progress` to `springLive.phase` on stop, so the
        // two agree whenever the loop is idle — the resume anchor is exact).
        onArm: () => {
            lastNow = 0;
            startTime = performance.now() - springLive.phase * SAMPLER_DURATION;
        },
        // `progress` is the CONTRACT authority the ScenePlayback adapter
        // snapshots/restores (reconciled to the live value on every loop stop).
        // The painters read `springLive` directly — the hot path never routes
        // through this reactive ref.
        getProgress: () => progress.value,
        setProgress: (t) => scrubTo(t),
        getPlaying: () => machine.status.value === "playing",
    });

    // ── K.W4 S2 + F5 — the ONE scrub seam (scrub-while-idle) ──────────────────
    // A scrub / restore writes the sweep position: readouts + live snapshot +
    // painted balls + the continuous scrubber channel + the contract twin move
    // TOGETHER (a discrete event), so a scrub-while-idle (the loop not running)
    // STILL moves the thumb/visualizer/ball — the playhead is set WITHOUT play
    // first (F5). The SAME body the adapter's `setProgress` restore uses; the
    // transport-scrubber drag calls it directly (the former `progress.value = v`
    // wrote only the 6 Hz mirror + repainted nothing while idle).
    function scrubTo(t: number): void {
        const clamped = Math.max(0, Math.min(1, t));
        springLive.phase = clamped;
        springLive.sampled = samplerAnim.at(clamped).x;
        flushReadouts();
        repaintSprings();
        paintScrubberPhase();
        contractAnim.t = clamped * contractAnim.options.duration;
    }

    // ── Methods ──────────────────────────────────────────────────────

    /** Re-seat the interactive target *and* all canonical trackers together. */
    const reseat = (value: number) => {
        const v = Math.max(0, Math.min(1, value));
        target.value = v;
        liveSpring.target = v;
        for (const t of tracks) t.spring.target = v;
        startLoop();
    };

    /** Flip the target between the two rails — the showcase "go" gesture. */
    const toggleTarget = () => {
        reseat(target.value > 0.5 ? 0 : 1);
    };

    // ── EASTER EGG — "the Derby" (H.W12.S6) ──────────────────────────────────
    // Colocated in `useSpringDerby` (its own concern seam): the staggered-wave
    // launch of the canonical trackers so their different damping fractions are
    // SEEN racing. The live ball joins the wave last (`launchLive`), then the
    // whole field bounces home (`settle`); the shared loop is the sole driver.
    const { derby } = useSpringDerby(
        tracks,
        () => {
            liveSpring.target = 1;
            target.value = 1;
        },
        () => reseat(0),
        () => startLoop(),
    );

    /** Rebuild the interactive spring when params change, preserving state. */
    const rebuildLiveSpring = () => {
        const carriedValue = liveSpring.value;
        const carriedVelocity = liveSpring.velocity;
        liveSpring.dispose();
        liveSpring = markRaw(
            new SpringProgress({
                response: response.value,
                dampingFraction: dampingFraction.value,
                initial: carriedValue,
                initialVelocity: carriedVelocity,
                settleThreshold: SETTLE,
                velocitySettleThreshold: SETTLE,
            }),
        );
        liveSpring.target = target.value;
        // Re-sample the timing function on the new params.
        samplerAnim = markRaw(buildSamplerAnimation());
        startLoop();
    };

    watch([response, dampingFraction], rebuildLiveSpring);

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
        liveSpring.reset(0);
        target.value = 1;
        liveSpring.target = 1;
        for (const t of tracks) {
            t.spring.reset(0);
            t.spring.target = 1;
        }
        // Re-seed the live snapshot + phase, then drive the readouts and the
        // painted balls to the reset state at once (a discrete event).
        springLive.phase = 0;
        springLive.value = liveSpring.value;
        springLive.velocity = liveSpring.velocity;
        springLive.settled = liveSpring.settled;
        for (let i = 0; i < tracks.length; i++) {
            springLive.trackValues[i] = tracks[i]!.spring.value;
        }
        springLive.sampled = samplerAnim.at(0).x;
        flushReadouts();
        repaintSprings();
        paintScrubberPhase();
        contractAnim.t = 0;
        startTime = performance.now();
        machine.dispatch({ type: "RESET" });
    };

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

    // (The derby's pending-timer teardown is owned by `useSpringDerby`'s own
    // onScopeDispose; the raw RAFPlayback teardown by useRafScene's.)

    // ── Scene-contract group (the bottom-bar transport host) ──────────
    // The bottom bar's transport (`AnimationControlsGroup`) requires an
    // `AnimationGroup`; this scene's motion is the light SpringProgress /
    // NumericAnimation trackers above, so the group is a minimal placeholder
    // whose `paused` flag is a ONE-WAY projection of the machine status — it
    // drives no motion and is NOT a playback authority anymore.
    // [DOCUMENTED EXPECTATION, WV-W1 lane escape hatch: the group is retained
    // ONLY as the transport host; deleting it outright would strand the bottom-
    // bar contract. The playback authority is the machine + the raw-rAF adapter.]
    const contractAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: SAMPLER_DURATION,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: springTimingFunction({
                response: 0.5,
                dampingFraction: 0.45,
            }),
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    contractAnim.name = "Spring Preview";
    contractAnim.superKey = "Spring";

    const animationGroup = markRaw(new AnimationGroup(contractAnim));
    animationGroup.started = true;
    animationGroup.paused = false;

    // ONE-WAY projection: the transport host's `paused` mirrors the machine
    // status so the bottom-bar play button reflects the true playback state.
    // This is a read-only projection (the machine is the authority) — NOT the
    // former bidirectional hand-sync that made the group a shadow authority.
    watch(
        isPlaying,
        (playing) => {
            animationGroup.paused = !playing;
        },
        { immediate: true },
    );

    // G3 (H.W10.S2) — the contract animation's clock mirrors the sweep phase so
    // the STANDARD PlaybackRibbon (the AnimationVisualizer ball — it polls
    // `effectiveT/duration` on its own rAF) tracks the live sweep. The contract
    // anim drives NO motion (no DOM target) — a pure time-twin.
    //
    // K.W4 S2 — the per-frame `contractAnim.t` write now lives in `frame()` (the
    // 60 Hz hot path) + every scrub/reset/restore seam, so the visualizer twin is
    // born-CONTINUOUS like the scrubber thumb — NOT the former 6 Hz `watch(progress)`
    // mirror that stepped the position (live-spring-sequence-mp-verdict.md §2b).
    // The watch is RETIRED (no-legacy); this is the ONE-TIME mount sync so the
    // twin is seated before the loop's first frame.
    contractAnim.t = progress.value * contractAnim.options.duration;

    return {
        // Sub-view (H.W5.S3 — the merged Discrete view)
        view,
        visible,
        toggleDiscrete,

        // Params
        response,
        dampingFraction,
        target,

        // Live interactive tracker — READOUT mirrors (few-Hz; J.W2 S5)
        liveValue,
        liveVelocity,
        liveSettled,

        // J.W2 S5 (DS-3) — the non-reactive hot-path seam: the always-current
        // live snapshot + the painter registry the view layer wires its moving
        // balls through (direct `style` writes, off the Vue render graph — the
        // I.W4 D4 DotPainter idiom, transposed from easing).
        springLive,
        registerSpringPainter,
        repaintSprings,

        // Canonical presets
        tracks,

        // springTimingFunction
        sampled,
        samplerCss,

        // Playback
        isPlaying,
        progress,
        // K.W4 S2 — the continuous 60 Hz scrubber-position channel (the cured
        // slider reads THIS, not the 6 Hz `progress` text mirror).
        scrubberPhase,

        // Methods
        reseat,
        toggleTarget,
        derby,
        reset,
        play,
        pause,
        togglePlay,
        // K.W4 S2 + F5 — the transport-scrubber scrub seam (scrub-while-idle).
        scrubTo,
        // K.W4 S1 — the engine-owned KeyframesEditor animation (two-way, per-stop)
        // + the explicit "re-sample from spring" seed action.
        springEditAnim,
        seedKeyframes,

        // Scene contract
        animationGroup,
        // The contract animation (the time-twin the standard PlaybackRibbon binds
        // its scrubber + visualizer to — G3/H.W10.S2).
        contractAnim,
        // The raw-rAF ScenePlayback adapter — the App registers this on
        // SCENE_READY so suspend/restore route through the contract (the
        // spring↔cube cross-pair the group gate misses).
        scenePlayback,
    };
}
