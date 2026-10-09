import { ref } from "vue";

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

/**
 * The manual reverse-intent surface for a single controls panel.
 *
 * Playback is ALWAYS group-owned now (the scene+playback state machine — H.W1 —
 * is the single authority via the AnimationGroup adapter; every panel mounts
 * under `ControlsPaneWrapper`, which is always grouped); the panel carries no
 * play verb at all — the transport dock's Play is the one control (UIA-KF-051;
 * its inert relay up through the pane was deleted by X.KF.W13X.r4transport) —
 * and there is no SOLO path. The old SOLO branch (panel-owns-the-engine, with `prevT`/
 * `pausedTime` clock bookkeeping) is DELETED: it only ever existed because there
 * was no shared authority.
 *
 * `userReversed` tracks the user's reverse intent (the engine's own `reversed`
 * flag also flips on alternate-direction wrap, so the UI needs a separate
 * user-facing toggle the ribbon reads).
 */
export function usePlaybackToggle(getAnimation: () => KeyframesAnimation<any>) {
    const userReversed = ref(false);

    const toggleReverse = () => {
        getAnimation().reverse();
        userReversed.value = !userReversed.value;
    };

    return { userReversed, toggleReverse };
}
