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

import { useRafScene } from "../app/useRafScene";
import { useSceneMachine } from "@components/custom/animation-controls/stores";
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

    // ── The raw-rAF scene recipe (I.W1 S2 — consolidated in useRafScene) ──
    // useRafScene OWNS the RAFPlayback, the BOUND startLoop/stopLoop, the
    // createRafAdapter wiring, the onScopeDispose(stopLoop) seam, AND the
    // useSceneVisibilityPause registration with BOUND callbacks (no scene can
    // re-introduce the unbound `playback.stop` that threw `this._gen`). The
    // scene supplies only the per-frame work + the per-arm clock rebase.
    const { startLoop, scenePlayback } = useRafScene({
        frame,
        // Re-seed the shared clock (lastNow = 0 so the first frame steps by dt=0)
        // + rebase startTime from the current phase so the sweep resumes in phase
        // (the former inline startLoop body).
        onArm: () => {
            lastNow = 0;
            startTime = performance.now() - progress.value * SAMPLER_DURATION;
        },
        getProgress: () => progress.value,
        setProgress: (t) => {
            progress.value = t;
        },
        getPlaying: () => machine.status.value === "playing",
    });

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
    // Double-click the rail → a spring DERBY. The canonical trackers
    // (smooth/snappy/bouncy/gentle) are normally re-seated TOGETHER; the egg
    // launches them in a STAGGERED wave (a 110ms cascade) so their different
    // damping fractions are SEEN racing — the bouncy track overshoots and rings
    // while the gentle one glides in late. DOGFOODS each track's own
    // SpringProgress (inv ζ); the shared loop is the sole driver, so the egg only
    // re-seats targets on a timer. Bounces back to 0 after the launch so the
    // showcase returns to rest.
    let derbyRunning = false;
    const derbyTimers: ReturnType<typeof setTimeout>[] = [];
    const STAGGER_MS = 110;

    const derby = () => {
        if (derbyRunning) return;
        derbyRunning = true;
        derbyTimers.length = 0;

        // Launch each canonical track to 1 in a staggered wave.
        tracks.forEach((t, i) => {
            derbyTimers.push(
                setTimeout(() => {
                    t.spring.target = 1;
                    startLoop();
                }, i * STAGGER_MS),
            );
        });
        // The live ball joins the wave last, then the whole field bounces home.
        const launchSpan = tracks.length * STAGGER_MS;
        derbyTimers.push(
            setTimeout(() => {
                liveSpring.target = 1;
                target.value = 1;
                startLoop();
            }, launchSpan),
        );
        derbyTimers.push(
            setTimeout(() => {
                reseat(0);
                derbyRunning = false;
            }, launchSpan + 900),
        );
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

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

    // ── Dispose seam ─────────────────────────────────────────────────
    // Stop the gallery's pending derby timers on scope dispose (the raw
    // RAFPlayback's own teardown is owned by useRafScene's onScopeDispose).
    onScopeDispose(() => {
        derbyTimers.forEach(clearTimeout);
    });

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

    // G3 (H.W10.S2) — mirror the sweep phase onto the contract animation's clock
    // so the STANDARD PlaybackRibbon (scrubber Slider + AnimationVisualizer ball,
    // mounted in the spring scene's ribbonContent slot) tracks the live sweep: the
    // visualizer reads `effectiveT/duration`, the scrubber reads `currentT`. The
    // contract anim drives NO motion (no DOM target) — a pure time-twin. A watch
    // (not the rAF frame) avoids the contractAnim TDZ (the loop arms at mount).
    watch(
        progress,
        (p) => {
            contractAnim.t = p * contractAnim.options.duration;
        },
        { immediate: true },
    );

    return {
        // Sub-view (H.W5.S3 — the merged Discrete view)
        view,
        visible,
        toggleDiscrete,

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
        derby,
        reset,
        play,
        pause,
        togglePlay,

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
