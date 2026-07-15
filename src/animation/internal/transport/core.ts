/** Value-free transport primitives shared by animation, group, and sequence drivers. */
export interface HeldPlayState {
    _playingPromise: Promise<void> | null;
}

export interface RunFlags {
    started: boolean;
    paused: boolean;
}

/** Re-entrant play: every caller observes one held promise until settlement. */
export function beginPlay(
    state: HeldPlayState,
    start: () => Promise<void>,
): Promise<void> {
    if (state._playingPromise) return state._playingPromise;
    const result = start();
    state._playingPromise = result;
    result.finally(() => {
        if (state._playingPromise === result) state._playingPromise = null;
    });
    return result;
}

export function playing(state: RunFlags): boolean {
    return state.started && !state.paused;
}

export function toggle(
    state: Pick<RunFlags, "paused">,
    pause: () => void,
    resume: () => void,
): void {
    if (state.paused) resume();
    else pause();
}
