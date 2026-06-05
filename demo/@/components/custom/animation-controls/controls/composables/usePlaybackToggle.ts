import { ref } from "vue";

import type { Animation } from "@src/animation/engine";

/**
 * The manual play/pause/reverse state machine for a single controls panel.
 *
 * Two ownership modes share one toggle surface:
 *   • GROUPED — the AnimationGroup owns playback; this panel only emits
 *     `togglePlay` upward and lets the group drive the engine.
 *   • SOLO — this panel owns the engine directly: first press `play()`s, later
 *     presses `toggle()` pause/resume. On each pause we stash `t` into `prevT`;
 *     on resume we fold the elapsed-while-paused span into `pausedTime` so the
 *     clock does not jump (the engine advances on an absolute clock).
 *
 * `userReversed` tracks the user's reverse intent (the engine's own `reversed`
 * flag also flips on alternate-direction wrap, so the UI needs a separate
 * user-facing toggle the ribbon reads).
 */
export function usePlaybackToggle(
    getAnimation: () => Animation<any>,
    isGrouped: () => boolean,
    emitTogglePlay: () => void,
) {
    const userReversed = ref(false);
    const prevT = ref(0);

    const toggleReverse = () => {
        getAnimation().reverse();
        userReversed.value = !userReversed.value;
    };

    const toggleAnimation = () => {
        if (isGrouped()) {
            emitTogglePlay();
            return;
        }

        const animation = getAnimation();
        if (!animation.started) {
            animation.play();
            return;
        }

        animation.toggle();

        if (animation.paused) {
            prevT.value = animation.t;
        } else {
            animation.pausedTime += animation.t - prevT.value;
            prevT.value = 0;
        }
    };

    return { userReversed, toggleAnimation, toggleReverse };
}
