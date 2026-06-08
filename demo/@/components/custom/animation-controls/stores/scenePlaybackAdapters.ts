// ─────────────────────────────────────────────────────────────────────────────
// THE ScenePlayback ADAPTERS (H.W1 S2 · WV-W1-HIGH-3).
//
// The dual contract `{snapshot, restore, suspend, resume, isPlaying}` has TWO
// implementations — one per playback architecture. The machine calls the
// CONTRACT (sceneMachine.applyEffects), never the group directly, so suspend/
// restore is deterministic across BOTH families:
//
//   • createGroupAdapter  — AnimationGroup scenes (cube/amiga/square). Wraps the
//     EXISTING imperative restore (the eight-field re-seat). The engine
//     serialize()/hydrate() seam is the S6 born-RED HANDOFF — when it ships, the
//     restore body reduces to two calls (g.hydrate(g.serialize())); this adapter
//     is the seam where that swap lands. inv-16: NO engine code authored here.
//
//   • createRafAdapter — raw-rAF scenes (easing/spring/sequence/path/
//     starting-style). These keep state in a private isPlaying + RAFPlayback +
//     startTime/progress and have NO AnimationGroup position. The adapter
//     round-trips progress/isPlaying/startTime — the gate proof:scene-contract-
//     identity bites here (proof:group-snapshot-identity passes vacuously on
//     easing, which has no group).
// ─────────────────────────────────────────────────────────────────────────────

import type { AnimationGroup } from "@src/animation/group";
import type {
    AnimationPlaybackSnapshot,
    PlaybackSnapshot,
    ScenePlayback,
} from "./sceneMachine";

// ── The AnimationGroup adapter ───────────────────────────────────────────────

/**
 * Wrap a live `AnimationGroup` getter in the ScenePlayback contract. The group
 * is read LAZILY via the getter — the adapter never holds the markRaw group
 * (MED-6: it would dangle on unmount); the snapshot it produces is plain JSON.
 */
export function createGroupAdapter(
    getGroup: () => AnimationGroup<any>,
): ScenePlayback {
    return {
        snapshot(): PlaybackSnapshot {
            const group = getGroup();
            const animations: Record<string, AnimationPlaybackSnapshot> = {};
            for (const [name, { animation }] of Object.entries(
                group.animations,
            )) {
                animations[name] = {
                    t: animation.t,
                    reversed: animation.reversed,
                    iteration: animation.iteration,
                };
            }
            return {
                // ST-5: a scene paused at t=0 (never ticked) still snapshots —
                // the save side does NOT early-return on `!started`. A cold
                // restore is then faithful instead of starting fresh.
                playing: group.started ? group.playing() : false,
                started: group.started,
                animations,
            };
        },

        restore(snap: PlaybackSnapshot): void {
            restoreGroupPlaybackState(getGroup(), snap);
        },

        suspend(): void {
            const group = getGroup();
            // Stop the draw loop without rewinding (genuine suspend — the
            // snapshot already captured the clock). `pause()` is idempotent and
            // renders the final frame so the visual matches the pause moment.
            if (group.started && !group.paused) group.pause();
            else group.playback.stop();
        },

        resume(): void {
            const group = getGroup();
            if (group.started && group.paused) group.resume();
        },

        isPlaying(): boolean {
            const group = getGroup();
            return group.started && group.playing();
        },
    };
}

/**
 * The imperative AnimationGroup restore (re-homed from usePlaybackSnapshot.ts).
 * Re-seats the eight engine clock fields by hand — the S6 HANDOFF replaces this
 * with `group.hydrate(snap)` when the engine ships serialize()/hydrate(). Kept
 * here, BESIDE its adapter, so the swap is a one-file edit.
 *
 * NO legacy beside replacement: usePlaybackSnapshot.ts is DELETED in the same
 * motion — this is the single home for the group-restore codec now.
 */
export function restoreGroupPlaybackState(
    group: AnimationGroup<any>,
    snap: PlaybackSnapshot,
): void {
    const now = performance.now();

    group.started = true;
    group.lastTickTime = now;

    for (const [name, groupObject] of Object.entries(group.animations)) {
        const animSnap = snap.animations[name];
        if (!animSnap) continue;

        const anim = groupObject.animation;

        anim.managed = true;
        anim.started = true;
        anim.reversed = animSnap.reversed;
        anim.iteration = animSnap.iteration;
        anim.startTime = now - animSnap.t;
        anim.t = animSnap.t;
        anim.paused = true;
        anim.pausedTime = now;

        // Interpolate frames at the saved t to populate values (targets are
        // attached at SCENE_READY, so interpFrames resolves computed units).
        const vars = anim.interpFrames(animSnap.t, false);
        Object.assign(groupObject.values, vars);
    }

    // Render the restored frame.
    group.paused = true;
    group.transformFramesGrouped(now);

    if (snap.playing) {
        // Resume from the restored paused state: unpauses children + restarts
        // the draw loop.
        group.resume();
    }
}

// ── The raw-rAF adapter ──────────────────────────────────────────────────────

/** The live surface a raw-rAF scene exposes to its ScenePlayback adapter. */
export interface RafSceneHandle {
    /** The normalized [0,1] sweep parameter (the scene's `progress` ref). */
    getProgress(): number;
    /** Write the sweep parameter (restore the scrub position). */
    setProgress(t: number): void;
    /** True iff the scene WANTS to play (its `isPlaying` intent ref). */
    getPlaying(): boolean;
    /** Set the play/pause intent (drives the loop on/off via the scene's watch). */
    setPlaying(playing: boolean): void;
    /** True iff the rAF loop is currently scheduled. */
    isLoopRunning(): boolean;
    /** Stop the rAF loop (genuine suspend — no orphan rAF). */
    stopLoop(): void;
    /** Re-arm the rAF loop (re-seeds startTime from the current progress). */
    startLoop(): void;
}

/**
 * Wrap a raw-rAF scene's loop handle in the ScenePlayback contract. Round-trips
 * `progress`/`isPlaying` through the snapshot (the `startTime` is rebased by the
 * scene's own `startLoop`, so it is not persisted — it would be stale across a
 * reload). `animations` stays empty: these scenes have NO AnimationGroup.
 */
export function createRafAdapter(handle: RafSceneHandle): ScenePlayback {
    return {
        snapshot(): PlaybackSnapshot {
            return {
                playing: handle.getPlaying(),
                started: true, // a raw-rAF scene is always "started" once mounted
                animations: {},
                progress: handle.getProgress(),
            };
        },

        restore(snap: PlaybackSnapshot): void {
            if (snap.progress !== undefined) handle.setProgress(snap.progress);
            // Set intent, then drive the loop to match (the scene's `isPlaying`
            // watch re-arms on true; we stop explicitly on false).
            handle.setPlaying(snap.playing);
            if (snap.playing) handle.startLoop();
            else handle.stopLoop();
        },

        suspend(): void {
            handle.stopLoop();
        },

        resume(): void {
            handle.setPlaying(true);
            handle.startLoop();
        },

        isPlaying(): boolean {
            return handle.getPlaying() && handle.isLoopRunning();
        },
    };
}
