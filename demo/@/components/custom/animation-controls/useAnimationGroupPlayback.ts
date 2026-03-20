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
        isPlaying.value = playing;
        isStarted.value = animationGroup.started;
        emit("playStateChange", playing);
        emit("startStateChange", animationGroup.started);
    };

    const findAnimationGroupObject = (animation: Animation<any>) => {
        return Object.values(getAnimationGroup().animations).find(
            (a) => a.animation.id == animation.id,
        );
    };

    const setAnimationScrubTime = (animation: Animation<any>, t: number) => {
        animation.t = t;

        // Record the logical pause point so Animation.tick() can correctly
        // adjust startTime on resume without a timestamp mismatch.
        if (animation.startTime !== undefined) {
            animation.pausedTime = animation.startTime + t;
        }
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
                storedControls.isControlsPanelOpen = false;
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
        const animationGroup = getAnimationGroup();
        const selectedDuration = animation.options.duration ?? 1000;
        const selectedEffectiveT = animation.reversed
            ? selectedDuration - t
            : t;
        const normalizedProgress = selectedDuration > 0
            ? Math.max(0, Math.min(1, selectedEffectiveT / selectedDuration))
            : 0;

        for (const groupObject of Object.values(animationGroup.animations)) {
            const childAnimation = groupObject.animation;
            const childDuration = childAnimation.options.duration ?? 1000;
            const childEffectiveT = normalizedProgress * childDuration;
            const childRawT = childAnimation.reversed
                ? childDuration - childEffectiveT
                : childEffectiveT;

            setAnimationScrubTime(childAnimation, childRawT);

            const vars = childAnimation.interpFrames(childAnimation.t, false);
            Object.assign(groupObject.values, vars);
        }

        if (animationGroup.singleTarget) {
            animationGroup.transformFramesGrouped(t);
            return;
        }

        animationGroup.done = Object.values(animationGroup.animations)
            .map(({ animation: childAnimation }) => {
                childAnimation.interpFrames(childAnimation.t, true);
                return childAnimation.done;
            })
            .every(Boolean);
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
