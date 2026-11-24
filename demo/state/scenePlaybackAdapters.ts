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

import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type {
    AnimationPlaybackSnapshot,
    PlaybackSnapshot,
    ScenePlayback,
} from "./sceneMachine";

// ── The clock walks: a start and a stop of a group, eased ────────────────────

/** A loop gathering its speed (a start), in ms. */
export const EASE_IN_MS = 250;
/** A loop coming to rest (a stop): about six tenths of the start. */
export const EASE_OUT_MS = 150;
/** One frame at 60 Hz: the most of a walk its first drawn frame covers. */
const ONE_FRAME_MS = 1000 / 60;

/**
 * Walk a PAUSED group's clock forward at a rate that rises 0 → 1 (`rise`) or
 * falls 1 → 0 (`fall`) on a smoothstep over `ms`, its children kept in phase by
 * the group seek. A rise ends at rate 1 and calls `done` (the caller resumes
 * the loop, which takes the clock over on that same frame and carries the
 * speed on without a step); a fall ends at rest. The group stays paused
 * throughout; when `keepGoing()` fails, or the group is resumed or stopped
 * meanwhile, the walk ends where it stands (a rise calls `done`). Returns the
 * walk's cancel.
 *
 * Rate r(u) = 3u² − 2u³ (rise) or 1 − (3u² − 2u³) (fall); the clock it covers
 * is ms·(u³ − u⁴/2) or ms·(u − u³ + u⁴/2).
 */
export function walkGroupClock(
    group: AnimationGroup<any>,
    { ms, shape }: { ms: number; shape: "rise" | "fall" },
    done: () => void,
    keepGoing: () => boolean = () => true,
): () => void {
    const from = groupClock(group);
    const covered = (u: number) => walkCovered(ms, shape, u);
    // The walk's clock starts at the frame it is asked in (the swap's
    // landing, the hand's release), on the frames' own clock, so the first
    // frame after it already moves: a start taken at the first frame's own
    // time held one more frame still. Without a document timeline, the first
    // frame's time.
    //
    // A stall does not eat the ramp. A page change's update holds the frames
    // while it runs (150 ms at 4x CPU), and a stop asked in it then came to
    // rest in the first frame drawn after. So the first frame covers at most
    // one frame of the walk, and a stop's later frames at most two each: the
    // ramp is drawn, frame by frame, whatever the frames' pace. (A start keeps
    // the frames' own clock past its first frame: the loop it hands on to does.)
    const asked = document.timeline?.currentTime;
    const start: number | null = typeof asked === "number" ? asked : null;
    const maxStep = shape === "fall" ? 2 * ONE_FRAME_MS : Infinity;
    let walked = 0;
    let last: number | null = null;
    let cancelled = false;
    let frame = requestAnimationFrame(function step(now: number) {
        frame = 0;
        if (cancelled) return;
        if (!keepGoing() || !group.started || !group.paused) return shape === "rise" ? done() : undefined;
        walked += last === null ? Math.min(ONE_FRAME_MS, Math.max(0, now - (start ?? now))) : Math.min(maxStep, now - last);
        last = now;
        const u = Math.min(1, walked / ms);
        // A rise past its end already runs at rate 1: the frame that ends it
        // draws the time past the end too. Clamped to the end, that frame
        // stood still (the last ramp frame sits within a frame of it).
        const past = shape === "rise" ? Math.max(0, walked - ms) : 0;
        group.seek(from + covered(u) + past).render();
        if (u < 1) {
            frame = requestAnimationFrame(step);
            return;
        }
        if (shape === "fall") return done();
        // At full speed: `done` resumes the loop. A resume re-bases the clock
        // on the loop's next frame and shows this instant again there (a held
        // frame); a seat guessed one frame on is off by the next frame's
        // jitter. The re-base is taken on this frame instead, so the loop's
        // next frame moves on by exactly its own interval.
        done();
        if (group.started && !group.paused) void group.advanceTo(now);
    });
    return () => {
        cancelled = true;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
    };
}

/** The clock a walk of `ms` has covered at `u` (0..1) of its length. */
function walkCovered(ms: number, shape: "rise" | "fall", u: number): number {
    return ms * (shape === "rise" ? u ** 3 - u ** 4 / 2 : u - u ** 3 + u ** 4 / 2);
}

/** A group's one master clock: the furthest of its children's elapsed times
 *  (the clock a walk starts from and the group seek seats every child at). */
function groupClock(group: AnimationGroup<any>): number {
    const children = Object.values(group.animations).map((entry) => entry.animation);
    return Math.max(0, ...children.map((child) => group.elapsedOf(child)));
}

// ── The AnimationGroup adapter ───────────────────────────────────────────────

/**
 * Wrap a live `AnimationGroup` getter in the ScenePlayback contract. The group
 * is read LAZILY via the getter — the adapter never holds the markRaw group
 * (MED-6: it would dangle on unmount); the snapshot it produces is plain JSON.
 */
export function createGroupAdapter(
    getGroup: () => AnimationGroup<any>,
): ScenePlayback {
    // The walk in flight (an eased start or stop); any other verb ends it.
    let walk: (() => void) | null = null;
    const endWalk = () => {
        walk?.();
        walk = null;
    };
    const adapter: ScenePlayback = {
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
            endWalk();
            const group = getGroup();
            // S.A0 — the QUEUED fresh-play intent (the amiga cold-race): a PLAY
            // that lands while the scene chunk is still LOADING is recorded by
            // the reducer as {playing:true, started:true, animations:{}} — a
            // snapshot with NO per-animation clocks (a live group's snapshot()
            // always carries its children's entries; only the pre-arm queue is
            // empty). There is nothing to re-seat: this is a START, not a
            // restore — `group.play()` is the total, jump-free path (the same
            // semantics resume() has for a never-started group). A fresh-empty
            // snapshot with playing:false (a withdrawn queue / a never-played
            // scene) rests as-is — the cold default keeps the engine off until
            // a gesture.
            if (Object.keys(snap.animations).length === 0) {
                if (snap.playing) {
                    if (!group.started) void group.play();
                    else if (group.paused) group.resume();
                }
                return;
            }
            restoreGroupPlaybackState(group, snap);
        },

        suspend(): void {
            endWalk();
            const group = getGroup();
            // Stop the draw loop without rewinding (genuine suspend — the
            // snapshot already captured the clock). `pause()` is idempotent and
            // renders the final frame so the visual matches the pause moment.
            if (group.started && !group.paused) group.pause();
            else group.playback.stop();
        },

        resume(): void {
            endWalk();
            const group = getGroup();
            if (!group.started) group.play();          // START a fresh group (the P0 cure)
            else if (group.paused) group.resume();     // un-pause a started one (the extant behavior)
        },

        easeIn(keepGoing: () => boolean): void {
            endWalk();
            const group = getGroup();
            if (!group.started || !group.paused) {
                if (!group.started) group.play();
                return;
            }
            walk = walkGroupClock(group, { ms: EASE_IN_MS, shape: "rise" }, () => {
                walk = null;
                if (keepGoing() && group.started && group.paused) group.resume();
            }, keepGoing);
        },

        easeOut(): void {
            endWalk();
            const group = getGroup();
            if (!group.started || group.paused) return;
            group.pause();
            walk = walkGroupClock(group, { ms: EASE_OUT_MS, shape: "fall" }, () => {
                walk = null;
            });
        },

        leave(): PlaybackSnapshot {
            // The snapshot keeps the play intent as it stands (a re-entry
            // restores it), and its clocks are where the eased stop brings the
            // loop to rest, so a return restores the pose the page last showed.
            const snap = adapter.snapshot();
            const group = getGroup();
            if (!group.started || group.paused) {
                adapter.suspend();
                return snap;
            }
            adapter.easeOut!();
            const from = groupClock(group);
            group.seek(from + walkCovered(EASE_OUT_MS, "fall", 1));
            const rest = adapter.snapshot().animations;
            group.seek(from);
            return { ...snap, animations: rest };
        },

        isPlaying(): boolean {
            const group = getGroup();
            return group.started && group.playing();
        },

        reset(): void {
            endWalk();
            // KFA-39 — `stop()` rewinds every child to its initial frame and
            // halts the draw loop: the group's born state.
            getGroup().stop();
        },
    };
    return adapter;
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
        // OD19 residue-2 (COHESION §0gq.3): a PLAYING restore does not — see below.
        if (snap.playing) continue;
        const vars = anim.interpFrames(animSnap.t, false);
        Object.assign(groupObject.values, vars);
    }

    group.paused = true;

    if (snap.playing) {
        // Resume from the restored paused state: unpauses children + restarts
        // the draw loop, whose first frame samples and paints the restored
        // clocks before the frame is drawn.
        //
        // OD19 residue-2 (COHESION §0gq.3) — A RESUMED RESTORE PAINTS ONCE, IN
        // THE LOOP. The restore used to sample and paint the saved clocks here,
        // inside the swap's commit (SCENE_READY runs in the View Transition's
        // update callback), and the loop sampled and painted them again in the
        // same rendering step. On the cube that sample is a computed endpoint
        // (`var(--rotationX)`), whose `probeBrowserScalar` forced a style recalc
        // of the half-mounted scene (5-8 ms of the sequence -> cube commit on
        // the real-GPU cell). The loop's own first frame is the one paint, read
        // after the commit's DOM work is done.
        group.resume();
        return;
    }

    // Render the restored frame. R.W2 — `render(now)` is the PUBLIC single-frame
    // paint entry (passing the explicit restored clock); `transformFramesGrouped`
    // is now private (the demo no longer reaches into group internals).
    group.render(now);
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
    /** KFA-39 — rewind the scene to its born state (absent: nothing beyond the clock). */
    reset?(): void;
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

        reset(): void {
            handle.reset?.();
        },
    };
}
