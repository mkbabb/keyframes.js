// --- Per-scene playback state (in-memory, ephemeral) ---

export interface AnimationPlaybackSnapshot {
    t: number;
    reversed: boolean;
    iteration: number;
}

export interface ScenePlaybackState {
    playing: boolean;
    started: boolean;
    /** Per-animation playback snapshot (raw t, reversed flag, iteration) */
    animations: Record<string, AnimationPlaybackSnapshot>;
}

const _scenePlaybackStates = new Map<string, ScenePlaybackState>();

export const saveScenePlaybackState = (
    superKey: string,
    state: ScenePlaybackState,
) => {
    _scenePlaybackStates.set(superKey, state);
};

export const getScenePlaybackState = (
    superKey: string,
): ScenePlaybackState | undefined => {
    return _scenePlaybackStates.get(superKey);
};

export const clearScenePlaybackState = (superKey: string) => {
    _scenePlaybackStates.delete(superKey);
};

// Active scene tracking for share state
let _activeSceneId: string | undefined;

export const setActiveScene = (sceneId: string) => {
    _activeSceneId = sceneId;
};

export const getActiveScene = (): string | undefined => _activeSceneId;

/** Used internally by hashSharing to set active scene from restored state. */
export const _setActiveSceneId = (id: string | undefined) => {
    _activeSceneId = id;
};
