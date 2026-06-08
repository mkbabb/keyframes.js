import { ref } from "vue";

import type { Animation } from "@src/animation/engine";

/**
 * The manual reverse-intent + play/pause toggle surface for a single controls
 * panel.
 *
 * Playback is ALWAYS group-owned now (the scene+playback state machine — H.W1 —
 * is the single authority via the AnimationGroup adapter; every panel mounts
 * under `ControlsPaneWrapper`, which is always grouped). The panel only emits
 * `togglePlay` upward and lets the machine/group drive the engine — there is no
 * SOLO path. The old SOLO branch (panel-owns-the-engine, with `prevT`/
 * `pausedTime` clock bookkeeping) is DELETED: it only ever existed because there
 * was no shared authority.
 *
 * `userReversed` tracks the user's reverse intent (the engine's own `reversed`
 * flag also flips on alternate-direction wrap, so the UI needs a separate
 * user-facing toggle the ribbon reads).
 */
export function usePlaybackToggle(
    getAnimation: () => Animation<any>,
    emitTogglePlay: () => void,
) {
    const userReversed = ref(false);

    const toggleReverse = () => {
        getAnimation().reverse();
        userReversed.value = !userReversed.value;
    };

    const toggleAnimation = () => {
        emitTogglePlay();
    };

    return { userReversed, toggleAnimation, toggleReverse };
}
