import { computed } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { StoredAnimationGroupControlOptions } from "@state";
import { useSceneMachine } from "@state";
import { useSceneTransport } from "@app/runtime/useSceneTransport";

/** The playback emit contract this composable drives — typed to the host
 *  component's `defineEmits` signature so the call site needs no `emit as any`
 *  (J.W2 S6 / LS-20; the DS-5 emit half). */
export interface AnimationGroupPlaybackEmit {
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}

/**
 * The group-transport play/scrub surface for AnimationControlsGroup.vue (the
 * cube/amiga/square panel transport + the standalone-host playground).
 *
 * THE MACHINE IS THE SINGLE PLAYBACK AUTHORITY (T.B8 — the D12 sweep's 5th and
 * FINAL carrier retired). The former private `isPlaying = ref(getAnimationGroup().
 * playing())` shadow — plus its `toggleAnimationGroup`/`onScrubStart`/`onScrubEnd`
 * calling `AnimationGroup.play()/.pause()/.toggle()/.resume()` DIRECTLY — was the
 * untouched twin of the four raw-rAF cures (useSpringDemo/useSequenceDemo/
 * useMotionPathDemo/useEasingDemo). Its correctness was "an accident of two
 * independent idempotency guards happening to agree" (the direct call AND the
 * emit→App.onPlayStateChange→machine.dispatch→adapter path BOTH drove the group).
 *
 * Now: `isPlaying` is a read-only projection of `machine.status` (via
 * `useSceneTransport`); the whole-group play/pause axis routes ONLY through the
 * emit (App.onPlayStateChange → `machine.dispatch` → `createGroupAdapter` re-arms/
 * stops the loop). This composable NEVER calls an `AnimationGroup` playback method
 * — `createGroupAdapter` is the ONLY code path that touches them
 * (proof:no-shadow-playback-authority). Kept: the childless-HOME navigate-intercept
 * emit (the rainbow-play → cube gesture) and the per-child `setChildTime` scrub.
 */
export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: StoredAnimationGroupControlOptions,
    emit: AnimationGroupPlaybackEmit,
) {
    // The SINGLE authority: `isPlaying` is derived from the machine status, never
    // a private ref that can drift from it (the S.A0 stale-`false` race that the
    // now-retired `machinePlaying` prop papered over is IMPOSSIBLE by construction
    // — there is no shadow to lag).
    const machine = useSceneMachine();
    const { isPlaying } = useSceneTransport(machine);

    // `started` is cosmetic ONLY (the transport select's paused-vs-idle StatusDot).
    // Derived, not a shadow: playing ⇒ started; else read the group's own flag
    // (`group.started` flips on the first rAF tick — the OR covers the just-started
    // window before the tick fires).
    const isStarted = computed(
        () => isPlaying.value || getAnimationGroup().started,
    );

    let wasPlayingBeforeScrub = false;

    /**
     * Emit the play/start INTENT to the host (App.onPlayStateChange → the machine
     * dispatch → the adapter drives the group). It writes NO ref: `isPlaying`/
     * `isStarted` are machine-derived computeds that re-settle when the dispatch
     * flips `machine.status`. This is the emit seam the childless-HOME
     * navigate-intercept and the App write-back ride.
     */
    const syncPlayState = (playing?: boolean) => {
        const p = playing ?? isPlaying.value;
        const started = p || getAnimationGroup().started;
        emit("playStateChange", p);
        emit("startStateChange", started);
    };

    const findAnimationGroupObject = (animation: KeyframesAnimation<any>) => {
        return Object.values(getAnimationGroup().animations).find(
            (a) => a.animation.id == animation.id,
        );
    };

    const onSelectAnimation = (name: string) => {
        const animationGroup = getAnimationGroup();
        storedControls.selectedAnimation = name;
        // Selecting an animation while the group is idle STARTS it — routed
        // through the machine (the emit → PLAY → adapter.resume() starts a fresh
        // group, the P0 cure), never a direct `group.play()`.
        if (!animationGroup.started) {
            syncPlayState(true);
        }
    };

    const toggleAnimationGroup = () => {
        const animationGroup = getAnimationGroup();
        // I.W0 S3 — a childless group (the empty HOME backdrop) has nothing to
        // play; the toggle emits the FLIP of the synced state so the rainbow-play
        // click reaches the home navigate-intercept (`onPlayStateChange`) via the
        // emit, INSTEAD of running an empty group's draw loop. For the childless
        // HOME backdrop `isPlaying` is false, so this emits `true` and the click
        // navigates to cube (the I.W0 S3 behavior, preserved). No direct group call
        // was ever here — the machine drives everything through the emit.
        if (Object.keys(animationGroup.animations).length === 0) {
            syncPlayState(!isPlaying.value);
            return;
        }
        // A never-started group needs a selection before the panel can render;
        // default it, then let the machine start it via the emit (PLAY →
        // adapter.resume() → group.play()). A started group toggles play/pause —
        // the emit of the flipped state drives PLAY/PAUSE through the machine.
        if (!animationGroup.started && !storedControls.selectedAnimation) {
            const allNames = Object.keys(animationGroup.animations);
            storedControls.selectedAnimation = allNames[0] ?? null;
        }
        syncPlayState(!isPlaying.value);
    };

    const onScrubStart = () => {
        // Pause via the machine for the duration of the scrub (emit false → PAUSE
        // → adapter.suspend() stops the loop without rewinding). Remember the
        // pre-scrub intent from the SINGLE authority, not a group read.
        wasPlayingBeforeScrub = isPlaying.value;
        if (wasPlayingBeforeScrub) {
            syncPlayState(false);
        }
    };

    const onScrubEnd = () => {
        // Resume iff we paused for the scrub (emit true → PLAY → adapter.resume()).
        if (wasPlayingBeforeScrub) {
            syncPlayState(true);
            wasPlayingBeforeScrub = false;
        }
    };

    const sliderUpdate = ({ t, animation }: { t: number; animation: KeyframesAnimation<any> }) => {
        // Scrubbing a single animation in a group must NOT drag its
        // siblings along. The library's setChildTime mutates just
        // this animation; render() re-composes the frame using every
        // child's current t (siblings unchanged).
        getAnimationGroup().setChildTime(animation, t).render();
        // T.B8 — record the scrub onto the machine snapshot so the scrubbed
        // playhead persists WITHOUT waiting for a NAVIGATE/SUSPEND capture (closes
        // the group-scene scrub-persistence gap: cube/amiga/square previously only
        // refreshed `t` at captureActive()/NAVIGATE-away, so a scrub-then-reload
        // lost it). SCRUB records `t` onto every animation snapshot the scene owns
        // (the group scenes are synchronized, so a shared `t` is faithful); the
        // reducer records it purely — no adapter is driven.
        machine.dispatch({ type: "SCRUB", t });
    };

    // ── The keyboard-scrub helpers (the playback half of the shortcut surface;
    // consolidated here from the host component at the J.W7a fix-round
    // proof:demo-no-oversize seam — they read/write ONLY playback state the
    // composable already owns: the selected animation, the child t, the
    // play/sync pair). The registerShortcut BINDINGS stay in the host (.vue)
    // — the ONE registry — these are the actions they dispatch. ──

    /** The selected animation's normalized t ∈ [0,1] (0 when nothing selected). */
    const getActiveT = (): number => {
        const name = storedControls.selectedAnimation;
        if (!name) return 0;
        const groupObj = getAnimationGroup().animations[name];
        if (!groupObj) return 0;
        const anim = groupObj.animation;
        const dur = anim.options.duration ?? 1000;
        return dur > 0 ? anim.t / dur : 0;
    };

    /** Scrub the selected animation to a normalized fraction (clamped). */
    const scrubActive = (fraction: number) => {
        const name = storedControls.selectedAnimation;
        if (!name) return;
        const groupObj = getAnimationGroup().animations[name];
        if (!groupObj) return;
        const anim = groupObj.animation;
        const dur = anim.options.duration ?? 1000;
        const t = Math.max(0, Math.min(dur, fraction * dur));
        sliderUpdate({ t, animation: anim });
    };

    /** Cycle the selection forward/back; start the group if it is idle. */
    const cycleAnimation = (direction: number) => {
        const animationGroup = getAnimationGroup();
        const names = Object.keys(animationGroup.animations);
        if (names.length === 0) return;
        const currentIdx = names.indexOf(storedControls.selectedAnimation ?? "");
        const nextIdx = (currentIdx + direction + names.length) % names.length;
        storedControls.selectedAnimation = names[nextIdx]!;
        // Start an idle group through the machine (emit → PLAY → adapter.resume()),
        // never a direct group.play().
        if (!animationGroup.started) {
            syncPlayState(true);
        }
    };

    return {
        isPlaying,
        isStarted,
        syncPlayState,
        findAnimationGroupObject,
        onSelectAnimation,
        toggleAnimationGroup,
        onScrubStart,
        onScrubEnd,
        sliderUpdate,
        getActiveT,
        scrubActive,
        cycleAnimation,
    };
}
