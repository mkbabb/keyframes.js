import {
    computed,
    markRaw,
    onScopeDispose,
    ref,
    watch,
    type Ref,
} from "vue";

import { AnimationGroup } from "@src/animation/group";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { SpringProgress } from "@src/animation/spring";
import { springTimingFunction } from "@src/animation/springTimingFunction";
import { NumericAnimation } from "@src/animation/numeric";
import { RAFPlayback } from "@src/animation/playback";

import { useSceneVisibilityPause } from "../app/useSceneVisibilityPause";
import {
    useSceneMachine,
    createRafAdapter,
    type ScenePlayback,
} from "@components/custom/animation-controls/stores";
import { SPRING_PRESETS, type SpringPreset } from "./springPresets";

/** One live tracker plus its reactive read-out, for the comparison row. */
export interface SpringTrack {
    preset: SpringPreset;
    spring: SpringProgress;
    /** Reactive mirror of the spring's current value (0–1). */
    value: Ref<number>;
    /** Reactive mirror of the spring's current velocity. */
    velocity: Ref<number>;
    settled: Ref<boolean>;
}

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
    // ── Interactive params ───────────────────────────────────────────
    const response = ref(0.5);
    const dampingFraction = ref(0.86);

    // Live target the interactive spring chases. 0 = left rail, 1 = right.
    const target = ref(1);

    // Reactive mirrors of the interactive spring.
    const liveValue = ref(0);
    const liveVelocity = ref(0);
    const liveSettled = ref(false);

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

    // ── springTimingFunction sampler → NumericAnimation ──────────────
    // Sample the *same* (response, dampingFraction) the user is editing so the
    // sampled JS easing visibly mirrors the live physics tracker. The ping-pong
    // (0→1→0) is the keyframe sequence itself — a linear phase sweep through it
    // alternates for free, so the showcase owns no hand-synced phase math.
    const sampled = ref(0);
    const samplerCss = computed(
        () =>
            `springTimingFunction({ response: ${response.value.toFixed(2)}, dampingFraction: ${dampingFraction.value.toFixed(2)} })`,
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

    // The normalized [0,1] sweep phase the comparison row runs on. It is the one
    // round-trippable scalar the raw-rAF ScenePlayback contract preserves across
    // a scene switch (the live markRaw springs are re-created on remount, so the
    // phase IS the scene's restorable position). The scrubber-equivalent.
    const progress = ref(0);

    // ── Shared rAF loop ──────────────────────────────────────────────
    const playback = markRaw(new RAFPlayback());
    // The loop's start timestamp, rebased from `progress` on (re)arm so the
    // sweep resumes in phase. Mirrors easing's `startTime` discipline.
    let startTime = 0;
    let lastNow = 0;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        // The loop GATES on the machine (the single authority) — not a private
        // isPlaying. When the machine leaves `playing` the loop self-terminates.
        if (machine.status.value !== "playing") return false;

        // dt from the single shared clock. First frame seeds the clock and
        // steps by zero (tickDt(0) is a no-op) — no magic-number dt seed.
        const dt = lastNow ? now - lastNow : 0;
        lastNow = now;

        // Interactive spring.
        liveSpring.tickDt(dt);
        liveValue.value = liveSpring.value;
        liveVelocity.value = liveSpring.velocity;
        liveSettled.value = liveSpring.settled;

        // Canonical presets.
        for (const t of tracks) {
            t.spring.tickDt(dt);
            t.value.value = t.spring.value;
            t.velocity.value = t.spring.velocity;
            t.settled.value = t.spring.settled;
        }

        // springTimingFunction sweep — `direction: alternate` as keyframes. The
        // normalized phase IS `progress`, so a restore re-seeds it directly.
        const phase = ((now - startTime) / SAMPLER_DURATION) % 1;
        progress.value = phase;
        sampled.value = samplerAnim.at(phase).x;

        return true;
    };

    /** Re-arm the rAF loop (re-seeds startTime from the current sweep phase so
     *  the sampler resumes in phase). Idempotent — a no-op while running. */
    const startLoop = () => {
        if (!playback.running) {
            lastNow = 0;
            startTime = performance.now() - progress.value * SAMPLER_DURATION;
            playback.loop(frame);
        }
    };
    const stopLoop = () => playback.stop();

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
        progress.value = 0;
        startTime = performance.now();
        machine.dispatch({ type: "RESET" });
    };

    // ── The raw-rAF ScenePlayback adapter (WV-W1-HIGH-3) ──
    // Round-trips the sweep phase + play intent through the contract — the same
    // dual contract the easing scene implements. The App registers this on
    // SCENE_READY so suspend/restore route through the CONTRACT, not the dummy
    // transport group (which has no position to snapshot).
    const scenePlayback: ScenePlayback = createRafAdapter({
        getProgress: () => progress.value,
        setProgress: (t) => {
            progress.value = t;
        },
        getPlaying: () => machine.status.value === "playing",
        // setPlaying is a no-op marker: the machine status IS the intent; the
        // loop is driven by start/stopLoop. Kept for contract symmetry.
        setPlaying: () => {},
        isLoopRunning: () => playback.running,
        stopLoop,
        startLoop,
    });

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

    // ── Dispose seam ─────────────────────────────────────────────────
    // Stop the raw RAFPlayback on scope dispose (the genuine unmount seam,
    // mirroring useRafLoop.ts onUnmounted(stop)). The host has NO <KeepAlive>,
    // so onDeactivated never fires and would leak this loop on a play-then-swap.
    onScopeDispose(() => playback.stop());

    // B-3: idle the shared spring rAF while the tab is hidden without touching
    // the machine's play/pause intent (PRESERVED autoPaused contract — "only
    // resume what IT paused"). `startLoop` reseeds the shared clock (`lastNow =
    // 0`) + rebases from `progress`, so the first frame after resume steps by
    // dt=0 — the comparison row resumes in phase, no jump.
    useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);

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

    return {
        // Params
        response,
        dampingFraction,
        target,

        // Live interactive tracker
        liveValue,
        liveVelocity,
        liveSettled,

        // Canonical presets
        tracks,

        // springTimingFunction
        sampled,
        samplerCss,

        // Playback
        isPlaying,
        progress,

        // Methods
        reseat,
        toggleTarget,
        reset,
        play,
        pause,
        togglePlay,

        // Scene contract
        animationGroup,
        // The raw-rAF ScenePlayback adapter — the App registers this on
        // SCENE_READY so suspend/restore route through the contract (the
        // spring↔cube cross-pair the group gate misses).
        scenePlayback,
    };
}
