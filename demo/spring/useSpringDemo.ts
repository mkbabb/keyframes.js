import {
    computed,
    markRaw,
    onActivated,
    onDeactivated,
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

    // The sampler runs on its own normalized clock so its 0→1→0 sweep loops
    // independently of the live target re-seats.
    let samplerStart = 0;

    // ── Shared rAF loop ──────────────────────────────────────────────
    const isPlaying = ref(true);
    const playback = markRaw(new RAFPlayback());
    let lastNow = 0;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        if (!isPlaying.value) return false;

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

        // springTimingFunction sweep — `direction: alternate` as keyframes.
        if (!samplerStart) samplerStart = now;
        const phase = ((now - samplerStart) / SAMPLER_DURATION) % 1;
        sampled.value = samplerAnim.at(phase).x;

        return true;
    };

    const ensureLoop = () => {
        if (isPlaying.value && !playback.running) {
            lastNow = 0;
            playback.loop(frame);
        }
    };

    // ── Methods ──────────────────────────────────────────────────────

    /** Re-seat the interactive target *and* all canonical trackers together. */
    const reseat = (value: number) => {
        const v = Math.max(0, Math.min(1, value));
        target.value = v;
        liveSpring.target = v;
        for (const t of tracks) t.spring.target = v;
        ensureLoop();
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
        ensureLoop();
    };

    watch([response, dampingFraction], rebuildLiveSpring);

    const reset = () => {
        liveSpring.reset(0);
        target.value = 1;
        liveSpring.target = 1;
        for (const t of tracks) {
            t.spring.reset(0);
            t.spring.target = 1;
        }
        samplerStart = 0;
        ensureLoop();
    };

    const play = () => {
        if (isPlaying.value) return;
        isPlaying.value = true;
        ensureLoop();
    };
    const pause = () => {
        isPlaying.value = false;
        playback.stop();
    };
    const togglePlay = () => (isPlaying.value ? pause() : play());

    watch(
        isPlaying,
        (playing) => {
            if (playing) ensureLoop();
        },
        { immediate: true },
    );

    // ── KeepAlive lifecycle ──────────────────────────────────────────
    onActivated(ensureLoop);
    onDeactivated(() => playback.stop());

    // ── Scene-contract group ─────────────────────────────────────────
    // The bottom bar's transport (`AnimationControlsGroup`) requires an
    // `AnimationGroup`; this scene's motion is the light SpringProgress /
    // NumericAnimation trackers above, so the group is a minimal placeholder
    // whose `paused` flag mirrors the preview loop — it drives no motion.
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

    watch(isPlaying, (playing) => {
        animationGroup.paused = !playing;
    });

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

        // Methods
        reseat,
        toggleTarget,
        reset,
        play,
        pause,
        togglePlay,

        // Scene contract
        animationGroup,
    };
}
