import { ref } from "vue";
import type { Animation } from "@src/animation/engine";
import type { AnimationGroup } from "@src/animation/group";

/** The playback emit contract this composable drives — typed to the host
 *  component's `defineEmits` signature so the call site needs no `emit as any`
 *  (J.W2 S6 / LS-20; the DS-5 emit half. The `storedControls: any` half stays
 *  a recorded BOOK — it does not change the writer count and is not the cure). */
export interface AnimationGroupPlaybackEmit {
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}

export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: any,
    emit: AnimationGroupPlaybackEmit,
) {
    const isPlaying = ref(getAnimationGroup().playing());
    const isStarted = ref(getAnimationGroup().started);

    let wasPlayingBeforeScrub = false;

    const syncPlayState = (playing?: boolean) => {
        const animationGroup = getAnimationGroup();
        if (playing === undefined) {
            playing = animationGroup.playing();
        }
        // `group.started` only flips to true on the first rAF tick (via
        // `onStart()`), which is *after* `play()` returns. Callers that just
        // asked the group to start won't see `group.started === true` yet,
        // so derive from intent: if we're telling the world we're playing,
        // the group is by definition "started" (or about to be).
        const started = playing || animationGroup.started;
        isPlaying.value = playing;
        isStarted.value = started;
        emit("playStateChange", playing);
        emit("startStateChange", started);
    };

    const findAnimationGroupObject = (animation: Animation<any>) => {
        return Object.values(getAnimationGroup().animations).find(
            (a) => a.animation.id == animation.id,
        );
    };

    const onSelectAnimation = (name: string) => {
        const animationGroup = getAnimationGroup();
        storedControls.selectedAnimation = name;
        if (!animationGroup.started) {
            animationGroup.play();
            syncPlayState(true);
        }
    };

    const toggleAnimationGroup = () => {
        const animationGroup = getAnimationGroup();
        // I.W0 S3 — a childless group (the empty HOME backdrop) has nothing to
        // play; invert the order so the rainbow-play click reaches the home
        // navigate-intercept (`onPlayStateChange`) via the emit, INSTEAD of
        // running the group draw loop's composite transform on an empty group
        // first. (The library is also robust to this now — `AnimationGroup`'s
        // no-op `transform` default, I.W0 S3 — but the gesture should navigate,
        // not no-op-play.)
        if (Object.keys(animationGroup.animations).length === 0) {
            syncPlayState(true);
            return;
        }
        if (!animationGroup.started) {
            if (!storedControls.selectedAnimation) {
                const allNames = Object.keys(animationGroup.animations);
                storedControls.selectedAnimation = allNames[0] ?? null;
            }

            animationGroup.play();
            syncPlayState(true);
        } else {
            animationGroup.toggle();
            syncPlayState();
        }
    };

    const onScrubStart = () => {
        const animationGroup = getAnimationGroup();
        wasPlayingBeforeScrub = animationGroup.playing();
        if (wasPlayingBeforeScrub) {
            animationGroup.pause();
            syncPlayState();
        }
    };

    const onScrubEnd = () => {
        if (wasPlayingBeforeScrub) {
            getAnimationGroup().resume();
            syncPlayState(true);
            wasPlayingBeforeScrub = false;
        }
    };

    const sliderUpdate = ({ t, animation }: { t: number; animation: Animation<any> }) => {
        // Scrubbing a single animation in a group must NOT drag its
        // siblings along. The library's setChildTime mutates just
        // this animation; render() re-composes the frame using every
        // child's current t (siblings unchanged).
        getAnimationGroup().setChildTime(animation, t).render();
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
        if (!animationGroup.started) {
            animationGroup.play();
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
