import { ref } from "vue";
import type { Animation } from "@src/animation/index";
import type { AnimationGroup } from "@src/animation/group";

export function useAnimationGroupPlayback(
    animationGroup: AnimationGroup<any>,
    storedControls: any,
    emit: (event: string, ...args: any[]) => void,
) {
    const isPlaying = ref(animationGroup.playing());
    const isStarted = ref(animationGroup.started);

    let wasPlayingBeforeScrub = false;

    const syncPlayState = (playing?: boolean) => {
        if (playing === undefined) {
            playing = animationGroup.playing();
        }
        isPlaying.value = playing;
        isStarted.value = animationGroup.started;
        emit("playStateChange", playing);
        emit("startStateChange", animationGroup.started);
    };

    const findAnimationGroupObject = (animation: Animation<any>) => {
        return Object.values(animationGroup.animations).find(
            (a) => a.animation.id == animation.id,
        );
    };

    const onSelectAnimation = (name: string) => {
        storedControls.selectedAnimation = name;
        if (!animationGroup.started) {
            animationGroup.play();
            syncPlayState(true);
        }
    };

    const toggleAnimationGroup = () => {
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
        wasPlayingBeforeScrub = animationGroup.playing();
        if (wasPlayingBeforeScrub) {
            animationGroup.pause();
            syncPlayState();
        }
    };

    const onScrubEnd = () => {
        if (wasPlayingBeforeScrub) {
            animationGroup.pause(); // toggle back to playing
            syncPlayState(true);
            wasPlayingBeforeScrub = false;
        }
    };

    const sliderUpdate = ({ t, animation }: { t: number; animation: Animation<any> }) => {
        const groupObject = findAnimationGroupObject(animation);
        const groupAnimation = groupObject!.animation;
        const wasPaused = groupAnimation.paused;

        groupAnimation.paused = false;
        groupAnimation.t = t;

        if (groupAnimation.startTime !== undefined) {
            groupAnimation.startTime = performance.now() - t;
            groupAnimation.pausedTime = 0;
        }

        animationGroup.transformFramesGrouped(t);
        groupAnimation.paused = wasPaused;
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
