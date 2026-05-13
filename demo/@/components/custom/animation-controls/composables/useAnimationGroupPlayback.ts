import { ref } from "vue";
import type { Animation } from "@src/animation/index";
import type { AnimationGroup } from "@src/animation/group";

export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: any,
    emit: (event: string, ...args: any[]) => void,
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
        if (!animationGroup.started) {
            if (!storedControls.selectedAnimation) {
                const allNames = Object.keys(animationGroup.animations);
                storedControls.selectedAnimation = allNames[0] ?? null;
            }

            animationGroup.play();
            syncPlayState(true);
        } else {
            animationGroup.pause();
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
            getAnimationGroup().pause(); // toggle back to playing
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
    };
}
