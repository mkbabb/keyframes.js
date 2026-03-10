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
        const groupObject = findAnimationGroupObject(animation);
        const groupAnimation = groupObject!.animation;

        groupAnimation.t = t;

        // Record the logical pause point so Animation.tick() can correctly
        // adjust startTime on resume without a timestamp mismatch.
        if (groupAnimation.startTime !== undefined) {
            groupAnimation.pausedTime = groupAnimation.startTime + t;
        }

        // Explicitly interpolate the scrubbed animation's frames so that
        // transformFramesGrouped picks up the new values. Without this,
        // the paused guard inside transformFramesGrouped skips interpFrames
        // and the visual stays frozen at the pre-scrub position.
        const vars = groupAnimation.interpFrames(groupAnimation.t, false);
        Object.assign(groupObject!.values, vars);

        animationGroup.transformFramesGrouped(t);
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
