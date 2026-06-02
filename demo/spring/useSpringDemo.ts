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
 * A single shared rAF loop ticks every tracker — the SpringProgress solver is
 * analytic, so a global clock keeps all rows phase-aligned.
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
    // sampled JS easing visibly mirrors the live physics tracker.
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
            [{ x: 0 }, { x: 1 }],
            { timingFunction: fn, duration: 1400 },
        );
    }

    // The sampler runs on its own normalized clock so its [0,1] sweep loops
    // independently of the live target re-seats.
    const samplerDuration = 1400;
    let samplerStart = 0;

    // ── Shared rAF loop ──────────────────────────────────────────────
    const isPlaying = ref(true);
    let rafId: number | null = null;
    let lastT = 0;

    const tick = (now: DOMHighResTimeStamp) => {
        if (!isPlaying.value) {
            rafId = null;
            return;
        }

        const dtMs = lastT ? now - lastT : 16.667;
        lastT = now;
        const dt = dtMs / 1000;

        // Interactive spring.
        liveSpring.tick(dt);
        liveValue.value = liveSpring.value;
        liveVelocity.value = liveSpring.velocity;
        liveSettled.value = liveSpring.settled;

        // Canonical presets.
        for (const t of tracks) {
            t.spring.tick(dt);
            t.value.value = t.spring.value;
            t.velocity.value = t.spring.velocity;
            t.settled.value = t.spring.settled;
        }

        // springTimingFunction sweep (ping-pong 0→1→0).
        if (!samplerStart) samplerStart = now;
        const cycle = ((now - samplerStart) / samplerDuration) % 2;
        const phase = cycle <= 1 ? cycle : 2 - cycle;
        sampled.value = samplerAnim.at(phase).x;

        rafId = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
        if (rafId === null && isPlaying.value) {
            lastT = 0;
            rafId = requestAnimationFrame(tick);
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
    onDeactivated(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });

    // ── Dummy animation for the scene contract ───────────────────────
    // The cockpit's bottom bar drives `animationGroup`; keep a no-op group
    // whose paused flag mirrors our rAF loop (mirrors useEasingDemo).
    const dummyAnimation = markRaw(
        new CSSKeyframesAnimation({
            duration: samplerDuration,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: springTimingFunction({
                response: 0.5,
                dampingFraction: 0.45,
            }),
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    dummyAnimation.name = "Spring Preview";
    dummyAnimation.superKey = "Spring";

    const animationGroup = markRaw(new AnimationGroup(dummyAnimation));
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
