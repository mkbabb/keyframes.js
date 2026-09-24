import { markRaw, ref, watch } from "vue";

import { SpringProgress } from "@mkbabb/keyframes.js";
import { clamp } from "@mkbabb/value.js/math";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { NumericAnimation } from "@mkbabb/keyframes.js";

import { useSweepScene } from "@composables/scene-runtime/useSweepScene";
import { useSceneTransport } from "@composables/scene-runtime/useSceneTransport";
import type { SceneFacility } from "@composables/scene-facility";
import { getStoredAnimationGroupControlOptions, useSceneMachine } from "@state";
import { SPRING_SCENE_ID } from "./springKeys";
import { SPRING_BASE, SPRING_PRESETS } from "./springPresets";
import { useSpringHotPath, type SpringTrack } from "./useSpringHotPath";
import { useSpringSweepAnimation } from "./useSpringSweepAnimation";
import { useCompiledEntry } from "./useCompiledEntry";
import { useSpringDerby } from "./useSpringDerby";

// The comparison-row vocabulary stays importable from the demo composable (the
// sidebar consumes it here); the interface itself lives with the hot-path seam.
export type { SpringPreset } from "./springPresets";
export type { SpringTrack } from "./useSpringHotPath";

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
    // The Spring scene hosts TWO views of one spring curve:
    //   • "solver"   — the live SpringProgress rail + springTimingFunction sweep;
    //   • "discrete" — that same spring linear() easing a real @starting-style /
    //                  allow-discrete CSS transition (the former standalone
    //                  Discrete scene, merged here in one motion).
    // T.B7 (T-SPR-3) — THE VIEW FORK IS CHANNEL DATA now, not chrome: the two
    // views ARE the facility's two channels ("Sweep" / "Entry"), so the
    // transport Select forks the stage and the former KfPillTabs pill strip
    // vanished without replacement (the same elision law as T.B5 running in the
    // pluralization direction). `view` DERIVES from the stored channel
    // selection (the watch below); nothing else writes it.
    const view = ref<"solver" | "discrete">("solver");
    const storedControls = getStoredAnimationGroupControlOptions(SPRING_SCENE_ID);
    watch(
        () => storedControls.selectedAnimation,
        (name) => {
            view.value = name === "Entry" ? "discrete" : "solver";
        },
        { immediate: true },
    );

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
            ...SPRING_BASE,
            response: response.value,
            dampingFraction: dampingFraction.value,
        }),
    );
    liveSpring.target = target.value;

    // ── Canonical preset trackers ────────────────────────────────────
    const tracks = SPRING_PRESETS.map<SpringTrack>((preset) => {
        const spring = markRaw(
            new SpringProgress({
                ...SPRING_BASE,
                response: preset.response,
                dampingFraction: preset.dampingFraction,
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
    //
    // KF-SS-33 — `samplerCss` IS GONE. It was a live `computed` re-formatting a
    // `springTimingFunction({…})` call string 6×/s and rendered NOWHERE: its one
    // consumer was `SpringSidebar.vue`, deleted at `277c01ec`. LAW A census at
    // this seat, pasted before the delete — ⟨cmd⟩ `grep -rn samplerCss demo test`
    // minus this file → **0 lines**. Its comment dies with it; the paragraph
    // above survives because it documents the sampler animation, which lives.

    // ── The Sweep channel's keyframes (X.KF.W13V.s) ──────────────────────────
    // Colocated in `useSpringSweepAnimation` (its own concern seam — the same
    // split shape as `useSpringHotPath`). The keyframes are edited in the SHARED
    // Keyframes pane on the Sweep channel (no inline editor, OA-37/46/51); a
    // typed edit PERSISTS, and `seedKeyframes()` re-seeds only on the Physics
    // facet's explicit action.
    const { springEditAnim, seedKeyframes } = useSpringSweepAnimation(
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
    // were the SHADOW playback authority (the D12 smell). `useSceneTransport`
    // (R.W5 B.2) projects `isPlaying` read-only off `machine.status` and routes
    // play/pause/togglePlay to dispatch — the machine is the single authority.
    const machine = useSceneMachine();
    const { isPlaying, play, pause, togglePlay } = useSceneTransport(machine);

    // ── Shared rAF loop ──────────────────────────────────────────────
    // The loop's start timestamp, rebased from `progress` on (re)arm so the
    // sweep resumes in phase. Mirrors easing's `startTime` discipline.
    let startTime = 0;
    let lastNow = 0;

    // ── C-1 / KF-SS-1 — THE PLAY-INTENT CONTRACT, WRITTEN DOWN ────────────────
    // The banked defect: `reseat()` armed a loop whose first frame self-
    // terminated because the machine was not `playing`, so on the scene's
    // DOCUMENTED entry state (`autoPlays: false`) the rail's primary gesture
    // moved the ghost marker and `aria-valuenow` while the solver — and with it
    // the protagonist ball — never ticked. Response without motion.
    //
    // THE CONTRACT: this scene has TWO intents, and they are not the same thing.
    //
    //   • PLAY-intent  — the transport's. It owns the springTimingFunction SWEEP
    //     (`springLive.phase`), an UNBOUNDED periodic clock. Only PLAY starts it,
    //     only PAUSE stops it. Nothing else may dispatch it: a rail tap that
    //     dispatched PLAY would re-open VERDICT #19 (the sampler swept forever at
    //     idle, ~33% of a core with no gesture) — the regression `autoPlays:
    //     false` was measured to cure, which superlative 5 protects.
    //
    //   • CHASE-intent — the rail's. `reseat`/`derby` ask the SOLVER to run to
    //     its own settle: a FINITE motion the physics terminates itself (every
    //     spring here carries `settleThreshold`/`velocitySettleThreshold`). It is
    //     user-initiated, so no PRM user is ambushed, and it costs exactly the
    //     frames the settle takes.
    //
    // Rest-on-entry is preserved EXACTLY: `chaseIntent` is born false, the mount
    // `startLoop()` runs one frame that finds neither intent and returns false —
    // zero rAF ticks, zero style recalc at rest (the proof:perf-counters posture,
    // unchanged). Under `respectReducedMotion` (the D-3 flag pass below) a chase
    // SNAPS at the target-setter, so the settle check below is already true on
    // the first frame and the loop terminates without painting motion at all.
    let chaseIntent = false;

    /** True while any solver in the field is still travelling to its target. */
    const fieldChasing = (): boolean =>
        !liveSpring.settled || tracks.some((t) => !t.spring.settled);

    /** Reconcile every continuous channel to the live phase — the loop's LAST
     *  frame in either exit path, so the thumb/visualizer/readouts rest exactly
     *  where the loop left them (no snap-back to a stale 6 Hz mirror). */
    const reconcileOnStop = (): void => {
        flushReadouts();
        paintScrubberPhase();
        springEditAnim.t = springLive.phase * springEditAnim.options.duration;
    };

    const frame = (now: DOMHighResTimeStamp): boolean => {
        // The loop GATES on the machine (the single authority for PLAY-intent) —
        // not a private isPlaying.
        const playing = machine.status.value === "playing";

        if (!playing) {
            // No play-intent. The sweep stays parked; the SOLVER still owes the
            // user the motion their gesture asked for (C-1).
            if (!chaseIntent) {
                reconcileOnStop();
                return false;
            }

            const dt = lastNow ? now - lastNow : 0;
            lastNow = now;
            tickField(dt);
            // Hot path — direct DOM writes, NO Vue reactivity (D4 transposed).
            repaintSprings();
            maybeFlushReadouts(now);

            // The chase is self-terminating: the field's own settle ends it.
            if (!fieldChasing()) {
                chaseIntent = false;
                reconcileOnStop();
                return false;
            }
            return true;
        }

        // dt from the single shared clock. First frame seeds the clock and
        // steps by zero (tickDt(0) is a no-op) — no magic-number dt seed.
        const dt = lastNow ? now - lastNow : 0;
        lastNow = now;

        tickField(dt);

        // springTimingFunction sweep — `direction: alternate` as keyframes. The
        // normalized phase IS `progress`, so a restore re-seeds it directly.
        springLive.phase = ((now - startTime) / SAMPLER_DURATION) % 1;
        springLive.sampled = samplerAnim.at(springLive.phase).x;

        // Hot path — direct DOM writes, NO Vue reactivity (D4 transposed).
        repaintSprings();

        // K.W4 S2 — the CONTINUOUS scrubber position, written EVERY frame (60 Hz):
        // `scrubberPhase` (one position ref) drives the reka <Slider> thumb
        // born-continuous (never the 6 Hz step). It does not touch the badges
        // (those ride the 6 Hz throttle below) — the painter channel, NOT a
        // re-paint storm.
        paintScrubberPhase();
        springEditAnim.t = springLive.phase * springEditAnim.options.duration;
        advanceSelectedChannel();

        // Cold path — the reactive readout mirrors at a few Hz only.
        maybeFlushReadouts(now);

        return true;
    };

    /** Tick every solver in the field into the non-reactive snapshot (hot path).
     *  The ONE body both loop branches step the physics through. */
    function tickField(dt: number): void {
        liveSpring.tickDt(dt);
        springLive.value = liveSpring.value;
        springLive.velocity = liveSpring.velocity;
        springLive.settled = liveSpring.settled;

        for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i]!;
            t.spring.tickDt(dt);
            springLive.trackValues[i] = t.spring.value;
        }
    }

    // ── The raw-rAF scene recipe (I.W1 S2 — consolidated in useSweepScene) ──
    // useSweepScene OWNS the RAFPlayback, the BOUND startLoop/stopLoop, the
    // createRafAdapter wiring, the onScopeDispose(stopLoop) seam, AND the
    // useSceneVisibilityPause registration with BOUND callbacks (no scene can
    // re-introduce the unbound `playback.stop` that threw `this._gen`). The
    // scene supplies only the per-frame work + the per-arm clock rebase.
    const { startLoop, scenePlayback } = useSweepScene({
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
        const clamped = clamp(t, 0, 1);
        springLive.phase = clamped;
        springLive.sampled = samplerAnim.at(clamped).x;
        flushReadouts();
        repaintSprings();
        paintScrubberPhase();
        springEditAnim.t = clamped * springEditAnim.options.duration;
        advanceSelectedChannel();
    }

    // ── Methods ──────────────────────────────────────────────────────

    /**
     * Re-seat the interactive target *and* all canonical trackers together.
     *
     * C-1 — this is the CHASE-intent dispatcher. It records the intent and arms
     * the loop; the loop runs the solver to its own settle and stops itself. It
     * dispatches NO play-intent: the transport still owns the sweep (see the
     * contract note at the loop).
     *
     * m-11 — THE RACE-TIME RAIL POLICY. While the derby owns the field the rail
     * refuses a re-seat: previously a tap mid-race overwrote all four staggered
     * targets while the stagger timers kept firing behind it (self-inflicted, and
     * it recovered only at settle). The refusal is already legible — `derbyActive`
     * recedes the rail to 0.35 and the lanes read as the foreground — and it is
     * announced on the rail's own status region.
     */
    const reseat = (value: number) => {
        if (derbyActive.value) return;
        const v = clamp(value, 0, 1);
        target.value = v;
        liveSpring.target = v;
        for (const t of tracks) t.spring.target = v;
        chaseIntent = true;
        startLoop();
    };

    /** Flip the target between the two rails — the showcase "go" gesture. */
    const toggleTarget = () => {
        reseat(target.value > 0.5 ? 0 : 1);
    };

    // ── EASTER EGG — "the Derby" (H.W12.S6 + L.W11 S6): the staggered-wave launch
    // of the canonical trackers SEEN racing in four rainbow lanes (colocated in
    // useSpringDerby; the shared loop is the sole driver, inv ζ). ──
    //
    // i-18 — THE EGG NO LONGER DESTROYS THE STATE IT INTERRUPTS. `settle` was
    // `() => reseat(0)`: EVERY derby, however the field was posed, ended with the
    // whole field commanded to 0. The egg now CAPTURES the target as it stands at
    // launch and RESTORES it at settle, so the delight is a round trip rather than
    // a state edit. (That retires D-2's sharpest aggravator too — the settle
    // confirmation no longer fires at the opposite end of the rail every time.)
    //
    // What this does NOT reach, stated: the two launching taps each re-seat on
    // their way in, because `useDragScrub` fires `onScrub` unconditionally on
    // pointerdown. That is the drag seam's own row (KF-SCR-1, `useDragScrub.ts`)
    // and its bytes belong to the drag-seam packet — named, not worked around.
    let preDerbyTarget = target.value;
    const { derby: launchDerby, derbyActive, lanes } = useSpringDerby(
        tracks,
        () => {
            liveSpring.target = 1;
            target.value = 1;
        },
        () => {
            const v = preDerbyTarget;
            target.value = v;
            liveSpring.target = v;
            for (const t of tracks) t.spring.target = v;
            // The settle is a target write, so it owes the same chase-intent
            // `reseat` owes (the egg used to reach `reseat(0)` and inherit it).
            chaseIntent = true;
            startLoop();
        },
        () => {
            chaseIntent = true;
            startLoop();
        },
    );

    /** The egg's one entry point: capture the pose it interrupts, then launch. */
    const derby = (): void => {
        preDerbyTarget = target.value;
        launchDerby();
    };

    /** Rebuild the interactive spring when params change, preserving state. */
    const rebuildLiveSpring = () => {
        const carriedValue = liveSpring.value;
        const carriedVelocity = liveSpring.velocity;
        liveSpring.dispose();
        liveSpring = markRaw(
            new SpringProgress({
                ...SPRING_BASE,
                response: response.value,
                dampingFraction: dampingFraction.value,
                initial: carriedValue,
                initialVelocity: carriedVelocity,
            }),
        );
        liveSpring.target = target.value;
        // Re-sample the timing function on the new params.
        samplerAnim = markRaw(buildSamplerAnimation());
        // C-1 — a rebuild carries value + velocity, so a spring that was MID-CHASE
        // stays mid-chase across a slider move: the intent is re-asserted, never
        // manufactured (a settled field re-arms nothing and the loop rests).
        if (!liveSpring.settled) chaseIntent = true;
        startLoop();
    };

    watch([response, dampingFraction], rebuildLiveSpring);

    // play/pause/togglePlay come from useSceneTransport (above) — they dispatch
    // to the machine (the authority); the adapter re-arms/stops the loop.

    /**
     * Rewind the whole field to the born state.
     *
     * KF-SS-2 — DECLARED, NOT CURED HERE, and the reason is a bound. This body is
     * correct and complete; what is broken is the ROUTE to it. The dock's Reset,
     * the `R` shortcut and `Escape` all end at `machine.dispatch({type:"RESET"})`,
     * and the machine's effect layer has NO `RESET` case at all
     * (`demo/state/useSceneMachine.ts`, `applyEffects` — PLAY/PAUSE/RESUME/
     * SCENE_READY only), so no adapter is ever driven and this function is
     * unreachable from every user-facing Reset. The honest cure is one `RESET`
     * arm in that switch (or a `reset` member on the `ScenePlayback` contract) —
     * BOTH bytes live in `demo/state/**`, outside this unit's §Bounds. A scene-
     * side watcher that sniffed the reset SIGNATURE out of the persisted snapshot
     * would be a shim around a missing contract arm, which this wave's law
     * refuses. Relayed, with the byte named, rather than faked.
     */
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
        springEditAnim.t = 0;
        startTime = performance.now();
        // C-1 — a reset is a discrete event, fully painted above: nothing is left
        // chasing, so the intent is withdrawn rather than left armed.
        chaseIntent = false;
        machine.dispatch({ type: "RESET" });
    };

    // Mount-time start: the scene is created fresh on each swap-in under the bare
    // keyed <Suspense>. Arm the loop now; the machine's SCENE_READY restore (via
    // the adapter) then re-seats progress + the playing/paused status.
    startLoop();

    // (The derby's pending-timer teardown is owned by `useSpringDerby`'s own
    // onScopeDispose; the raw RAFPlayback teardown by useSweepScene's.)

    // ── THE SPRING FACILITY (T.B1-β/T.B7 — the decoy is DEAD) ─────────────────
    // The former contract-group opacity decoy (the "Spring Preview"
    // transport host that painted nothing) is DELETED. The transport now rides
    // TWO REAL channels:
    //   • "Sweep" — `springEditAnim`, the Sweep keyframes the shared Keyframes
    //     pane edits (X.KF.W13V.s). Its clock IS the sweep time-twin (the per-frame `.t` write
    //     in `frame()` + every scrub/reset seam — the K.W4 S2 born-continuous
    //     visualizer channel), so the standard PlaybackRibbon binds an animation
    //     whose keyframes a panel edit really re-shapes.
    //   • "Entry" — the compiled `@starting-style` entry animation from
    //     `useCompiledEntry` (S.F3 EN-d). Selecting it forks the stage to the
    //     discrete view (the `view` watch above — T-SPR-3: the fork is channel
    //     data, not chrome).
    // `playback` is the SAME raw-rAF ScenePlayback adapter the machine registers;
    // the `spring` facet is the scene's additive surface (the DFA reads it).
    const { css: compiledEntryCss, entryAnim } = useCompiledEntry(
        () => response.value,
        () => dampingFraction.value,
    );

    /**
     * KF-SS-8 (scene half) — THE TRANSPORT DRIVES THE SELECTED CHANNEL.
     *
     * The banked defect: with the Entry channel selected, Play advanced every
     * clock in the scene EXCEPT the selected one — the loop wrote `springEditAnim.t`
     * (the Sweep twin) unconditionally and `entryAnim.t` never at all, so the
     * transport moved a clock the stage was not showing. The discrete card's own
     * paint is a CSS transition, which is why the dishonesty was invisible.
     *
     * The loop now advances the channel the transport has SELECTED, off the one
     * sweep phase both channels share. The Sweep twin keeps its unconditional
     * write (it is the visualizer's time-twin and the ribbon binds it).
     *
     * The ribbon-side half of this row — the transport's own `:max`/time-space
     * contract for a channel whose duration is not the sweep's — is KF.W13's C-2
     * and is NOT written here (OP-6; the seam is declared at both ends).
     */
    function advanceSelectedChannel(): void {
        if (view.value !== "discrete") return;
        const dur = entryAnim.options.duration ?? 500;
        if (dur > 0) entryAnim.t = clamp(springLive.phase, 0, 1) * dur;
    }

    // The one-time mount sync so the Sweep twin is seated before the loop's
    // first frame (the per-frame write lives in `frame()` — K.W4 S2).
    springEditAnim.t = progress.value * springEditAnim.options.duration;

    const facility: SceneFacility = {
        identity: scenePlayback,
        channels: [
            {
                name: "Sweep",
                animation: springEditAnim,
                progress: () => springLive.phase,
                setProgress: (t: number) => scrubTo(t),
            },
            {
                name: "Entry",
                animation: entryAnim,
                progress: () => {
                    const dur = entryAnim.options.duration ?? 500;
                    return dur > 0
                        ? clamp(entryAnim.t / dur, 0, 1)
                        : 0;
                },
                setProgress: (t: number) => {
                    const dur = entryAnim.options.duration ?? 500;
                    entryAnim.t = clamp(t, 0, 1) * dur;
                },
            },
        ],
        facets: [{ surface: "spring", label: "Physics", icon: "Activity" }],
        playback: scenePlayback,
        isPlaying: () => scenePlayback.isPlaying(),
    };

    return {
        // T.B1-β — the SceneFacility descriptor (channels + facet + playback).
        facility,
        // S.F3 EN-d — the compiled @starting-style artifact readout (the
        // StartingStyleTarget renders it; the Entry channel rides its animation).
        compiledEntryCss,
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

        // Canonical presets
        tracks,

        // springTimingFunction
        sampled,

        // Playback
        isPlaying,
        // K.W4 S2 — the continuous 60 Hz scrubber-position channel (the cured
        // slider reads THIS, not the 6 Hz `progress` text mirror).
        scrubberPhase,

        // Methods
        reseat,
        toggleTarget,
        derby, // L.W11 S6 — the four-lane derby + its reactive state/lanes:
        derbyActive,
        derbyLanes: lanes,
        reset,
        play,
        pause,
        togglePlay,
        // K.W4 S2 + F5 — the transport-scrubber scrub seam (scrub-while-idle).
        scrubTo,
        // The Sweep channel's keyframes (edited in the shared Keyframes pane)
        // + the Physics facet's explicit re-seed action.
        springEditAnim,
        seedKeyframes,

        // KF-SS-33 — `repaintSprings`, `progress`, `samplerCss` and
        // `scenePlayback` LEFT this bag. Each had ZERO component consumers (LAW A
        // census at this seat, `demo test` minus this file: `repaintSprings` 0 ·
        // `demo.progress` 0 in `demo/scenes/spring` · `samplerCss` 0 ·
        // `demo.scenePlayback` 0), and each is still reachable where it is
        // actually used: the painter seam calls `repaintSprings` INSIDE this
        // composable, `progress` is the contract authority the sweep adapter
        // reads through `getProgress`, and the adapter itself is published ONCE —
        // as `facility.playback` (the same object; publishing it twice is the
        // duplicate the row names). Nothing was deleted that anything reads.
    };
}
