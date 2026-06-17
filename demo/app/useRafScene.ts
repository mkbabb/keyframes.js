import { markRaw, onScopeDispose } from "vue";

import { RAFPlayback } from "@mkbabb/keyframes.js";
import {
    createRafAdapter,
    type ScenePlayback,
} from "@components/custom/animation-controls/stores";

import { useSceneVisibilityPause } from "./useSceneVisibilityPause";

/**
 * THE raw-rAF scene recipe, consolidated (I.W1 S2 — the structural transposition).
 *
 * The easing + spring scenes HAND-WIRED the identical recipe — own a
 * `RAFPlayback`, expose `startLoop`/`stopLoop`, build a `createRafAdapter`,
 * register it, AND wire `useSceneVisibilityPause` — and BOTH made the SAME
 * binding mistake at the same line: they passed the UNBOUND `playback.stop` as
 * the visibility-pause `pause` callback, so the watcher invoked it free-standing
 * (`this === undefined` → `this._gen++` threw inside a Vue reactive flush →
 * blank controls — `rootcause-rc-dfa-gen.md`). The bug was the duplication's
 * symptom.
 *
 * This composable folds that recipe into ONE place. It owns:
 *
 *   • the `markRaw(new RAFPlayback())` (few + long-lived, so markRaw is right);
 *   • the BOUND `startLoop`/`stopLoop` — `startLoop` is idempotent (a no-op while
 *     the loop already runs) and calls the caller's `onArm()` to re-seed the
 *     scene's own clock from its current progress BEFORE arming, so the sweep
 *     resumes in phase with no jump; `stopLoop` is the genuine suspend;
 *   • the `createRafAdapter` wiring (the ScenePlayback contract the App registers
 *     on SCENE_READY) — the caller supplies only the progress/intent getters;
 *   • the `onScopeDispose(stopLoop)` unmount seam (the host has NO <KeepAlive>,
 *     so this is the genuine teardown that prevents a leaked loop on swap);
 *   • the `useSceneVisibilityPause` registration WITH BOUND callbacks — `stopLoop`
 *     and `startLoop` are local arrows, NEVER the bare `playback.stop`. No scene
 *     can re-introduce the unbound reference: the binding + the visibility-pause
 *     registration are STRUCTURAL here, not per-author discipline. (S1 also makes
 *     `RAFPlayback.stop` itself bind-proof at the engine — defense in depth.)
 *
 * The scene composable supplies the per-FRAME work (`frame`) and the per-ARM
 * clock rebase (`onArm`); everything else is owned here.
 */
export interface RafSceneOptions {
    /**
     * The per-frame work. Returns `true` to keep the loop running, `false` to
     * self-terminate (e.g. when the scene machine leaves `playing`). The loop
     * gates on whatever authority the scene reads inside this callback.
     */
    frame: (now: DOMHighResTimeStamp) => boolean;
    /**
     * Re-seed the scene's own clock from its current progress, called by
     * `startLoop` IMMEDIATELY BEFORE the rAF loop arms (and only when the loop
     * was not already running). This is where a scene rebases its `startTime`
     * (and any `lastNow`/dt seed) so the resumed sweep is in phase. Runs after
     * the idempotency check, so it never fires on a redundant re-arm.
     */
    onArm: () => void;
    /** The normalized [0,1] sweep parameter (the scene's `progress` ref read). */
    getProgress: () => number;
    /** Write the sweep parameter (restore the scrub position on SCENE_READY). */
    setProgress: (t: number) => void;
    /** True iff the scene WANTS to play (its machine-projected intent). */
    getPlaying: () => boolean;
}

export interface RafSceneHandleApi {
    /** THE owned managed rAF driver (read `.running` for the loop state). */
    readonly playback: RAFPlayback;
    /** Re-arm the rAF loop (idempotent; re-seeds the clock via `onArm` first). */
    startLoop: () => void;
    /** Stop the rAF loop (genuine suspend — no orphan rAF). */
    stopLoop: () => void;
    /** The ScenePlayback adapter the App registers on SCENE_READY. */
    scenePlayback: ScenePlayback;
}

export function useRafScene(opts: RafSceneOptions): RafSceneHandleApi {
    const playback = markRaw(new RAFPlayback());

    /** Re-arm the rAF loop. Idempotent — a no-op while already running; on a
     *  genuine (re)arm it rebases the scene clock via `onArm` then loops. */
    const startLoop = (): void => {
        if (!playback.running) {
            opts.onArm();
            playback.loop(opts.frame);
        }
    };

    /** Stop the loop (genuine suspend). Bound — NEVER the bare `playback.stop`. */
    const stopLoop = (): void => {
        playback.stop();
    };

    // The raw-rAF ScenePlayback adapter — the App registers this on SCENE_READY
    // so suspend/restore route through the contract (the easing/spring↔cube
    // cross-pair the group gate misses).
    const scenePlayback: ScenePlayback = createRafAdapter({
        getProgress: opts.getProgress,
        setProgress: opts.setProgress,
        getPlaying: opts.getPlaying,
        // setPlaying is a no-op marker: the machine status IS the intent; the
        // loop is driven by start/stopLoop. Kept for contract symmetry.
        setPlaying: () => {},
        isLoopRunning: () => playback.running,
        stopLoop,
        startLoop,
    });

    // Stop the raw RAFPlayback on scope dispose (the genuine unmount seam — the
    // scene host has NO <KeepAlive>, so onDeactivated never fires and would leak
    // this loop on swap).
    onScopeDispose(stopLoop);

    // B-3: idle the preview rAF while the tab is hidden, without disturbing the
    // machine's play/pause intent (PRESERVED autoPaused contract — "only resume
    // what IT paused"). The pause callback is the BOUND `stopLoop` (NOT the bare
    // `playback.stop` that used to throw `this._gen` free-standing); `startLoop`
    // re-seeds the clock via `onArm`, so the sweep resumes in phase with no jump.
    useSceneVisibilityPause(() => playback.running, stopLoop, startLoop);

    return { playback, startLoop, stopLoop, scenePlayback };
}
