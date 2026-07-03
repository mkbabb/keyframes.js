// ─────────────────────────────────────────────────────────────────────────────
// THE SCENE + PLAYBACK STATE MACHINE — pure core (H.W1 keystone).
//
// ONE finite machine that OWNS the active-scene fact + the per-scene playback
// snapshot, replacing the five-authority lattice + the three playback
// authorities (§2.1 adjudication: a pure reducer, NOT Pinia / XState). TWO
// ORTHOGONAL AXES (CP-LOW-4 / a-demo-architecture F3): the SCENE axis
// (`context.activeScene`) and the PLAYBACK-status axis (`state` ∈ idle|loading|
// playing|paused|suspended); `context.perScene` keys playback BY scene. A scene
// switch (NAVIGATE) and a play/pause (PLAY/PAUSE) are DISTINCT events.
//
// `transition(state, event) → state` is a PURE function — unit-testable, no Vue,
// no DOM, no side effects. The reactive `createGlobalState` store that DRIVES it
// is the co-located `useSceneMachine.ts` (the effect layer); this is the core.
// ─────────────────────────────────────────────────────────────────────────────

// ── The two axes ─────────────────────────────────────────────────────────────

/** The SCENE axis — the 9 scenes (8 + home). Kept a bare string so scenes.ts
 *  remains the single registry; the reducer never enumerates them. */
export type SceneId = string;

/** The PLAYBACK-status axis — the reducer's `state`. */
export type PlaybackStatus =
    | "idle"
    | "loading"
    | "playing"
    | "paused"
    | "suspended";

export const HOME_SCENE_ID = "home";

// ── The per-scene playback snapshot (re-homed from scenePlayback.ts) ──────────
// MED-6 / markRaw: the context holds SERIALIZABLE snapshots ONLY — never the
// live markRaw AnimationGroup (it would dangle on unmount). Adapters read the
// live group at suspend time and write it back at restore time.

/** One animation's clock state — the byte-identity field set the matrix gate
 *  asserts on round-trip. */
export interface AnimationPlaybackSnapshot {
    t: number;
    reversed: boolean;
    iteration: number;
}

/**
 * THE per-scene playback snapshot — covers BOTH architectures (WV-W1-HIGH-3):
 * AnimationGroup scenes populate `animations`; raw-rAF scenes populate
 * `progress` (the contractAnim dummy group has NO position). All fields JSON-safe.
 */
export interface PlaybackSnapshot {
    playing: boolean;
    started: boolean;
    /** AnimationGroup scenes: per-animation clock snapshot (keyed by name). */
    animations: Record<string, AnimationPlaybackSnapshot>;
    /** raw-rAF scenes: the normalized [0,1] sweep parameter. */
    progress?: number;
    /** raw-rAF scenes: the loop's start timestamp (rebased on restore). */
    startTime?: number;
}

// ── The reducer context (the SCENE axis + the keyed playback map) ─────────────

export interface SceneContext {
    /** The SCENE axis — the one fact this machine owns. */
    activeScene: SceneId;
    /** The PLAYBACK axis, keyed BY scene. Persisted (ST-6). */
    perScene: Record<SceneId, PlaybackSnapshot>;
}

// ── The events (S1 + the folded TAB_HIDDEN/TAB_SHOWN) ─────────────────────────

export type SceneEvent =
    | { type: "NAVIGATE"; to: SceneId }
    | { type: "SCENE_READY" }
    | { type: "PLAY" }
    | { type: "PAUSE" }
    | { type: "SCRUB"; t: number }
    | { type: "SUSPEND" }
    | { type: "RESUME" }
    | { type: "RESET" }
    | { type: "TAB_HIDDEN" }
    | { type: "TAB_SHOWN" };

/** The full machine value — the playback `status` + the scene/playback context. */
export interface MachineState {
    status: PlaybackStatus;
    context: SceneContext;
}

// ── THE PURE REDUCER ─────────────────────────────────────────────────────────
// `transition(state, event) → state`. Side-effect free (no rAF/router/adapter —
// those are the store's effect layer). Same (state, event) → same next state.

/** The snapshot a freshly-seen scene gets before its first SCENE_READY. */
const freshSnapshot = (): PlaybackSnapshot => ({
    playing: false,
    started: false,
    animations: {},
});

export function transition(state: MachineState, event: SceneEvent): MachineState {
    const { status, context } = state;

    switch (event.type) {
        case "NAVIGATE": {
            // A scene switch is DISTINCT from a play/pause. Leaving SUSPENDs the
            // current scene (the effect layer stops its loop); the incoming
            // scene enters `loading` until its SCENE_READY arrives. No-op when
            // already on the target (the echo-guard's reducer twin).
            if (event.to === context.activeScene && status !== "idle") {
                return state;
            }
            const perScene = { ...context.perScene };
            if (!perScene[event.to]) perScene[event.to] = freshSnapshot();
            return {
                status: "loading",
                context: { activeScene: event.to, perScene },
            };
        }

        case "SCENE_READY": {
            // Targets attached — restore; the snapshot's `playing` decides (S4).
            const snap = context.perScene[context.activeScene] ?? freshSnapshot();
            return { status: snap.playing ? "playing" : "paused", context };
        }

        case "PLAY": {
            if (status === "idle") return state;
            // S.A0 — queue-then-start-on-arm (the amiga cold-race, reproduced on
            // the Linux runner + locally under 20× CPU throttle): on a slow
            // device the dock play gesture can land while the scene chunk is
            // still LOADING. Dropping the event here (the pre-S.A0 behavior)
            // silently discarded a real user gesture while the transport's
            // optimistic aria flipped to "Pause" — the machine never entered
            // `playing` and the engine never started. Instead, RECORD the intent
            // onto the scene's snapshot (status stays `loading`); the arriving
            // SCENE_READY reads `snap.playing` and starts playback — the first
            // gesture a human makes WORKS, however slow the device.
            if (status === "loading") {
                return {
                    status,
                    context: writeSnapshot(context, { playing: true, started: true }),
                };
            }
            return {
                status: "playing",
                context: writeSnapshot(context, { playing: true, started: true }),
            };
        }

        case "PAUSE": {
            if (status === "idle") return state;
            // Symmetric un-queue: a second press during loading (the transport
            // now honestly reads "Pause" for a queued play) withdraws the queued
            // intent — SCENE_READY then rests `paused`, exactly what the user
            // asked for. Status stays `loading`.
            if (status === "loading") {
                return {
                    status,
                    context: writeSnapshot(context, { playing: false }),
                };
            }
            return {
                status: "paused",
                context: writeSnapshot(context, { playing: false }),
            };
        }

        case "SCRUB": {
            // A scrub does not change the playing/paused axis; it records `t`
            // onto every animation snapshot the scene owns (the group scenes)
            // and the raw `progress` (the raw-rAF scenes).
            return { status, context: scrub(context, event.t) };
        }

        case "SUSPEND": {
            // The leaving scene's loop is stopped by the effect layer; the
            // status parks at `suspended` so the next SCENE_READY restores.
            if (status === "idle") return state;
            return { status: "suspended", context };
        }

        case "RESUME": {
            // Symmetric to SUSPEND for the tab-visibility / re-enter path.
            const snap = context.perScene[context.activeScene] ?? freshSnapshot();
            return { status: snap.playing ? "playing" : "paused", context };
        }

        case "RESET": {
            return {
                status: "paused",
                context: writeSnapshot(context, {
                    playing: false,
                    started: false,
                    animations: {},
                    progress: 0,
                }),
            };
        }

        case "TAB_HIDDEN": {
            // Folded useSceneVisibilityPause: only suspend what was running (the
            // "only resume what IT paused" autoPaused contract). Status-only park.
            if (status !== "playing") return state;
            return { status: "suspended", context };
        }

        case "TAB_SHOWN": {
            if (status !== "suspended") return state;
            const snap = context.perScene[context.activeScene] ?? freshSnapshot();
            return { status: snap.playing ? "playing" : "paused", context };
        }

        default:
            return state;
    }
}

/** Merge a partial snapshot onto the active scene's entry (pure). */
function writeSnapshot(
    context: SceneContext,
    patch: Partial<PlaybackSnapshot>,
): SceneContext {
    const prev = context.perScene[context.activeScene] ?? freshSnapshot();
    return {
        activeScene: context.activeScene,
        perScene: {
            ...context.perScene,
            [context.activeScene]: { ...prev, ...patch },
        },
    };
}

/** Record a scrub `t` onto the active scene's snapshot (pure). */
function scrub(context: SceneContext, t: number): SceneContext {
    const prev = context.perScene[context.activeScene] ?? freshSnapshot();
    const animations: Record<string, AnimationPlaybackSnapshot> = {};
    for (const [name, snap] of Object.entries(prev.animations)) {
        animations[name] = { ...snap, t };
    }
    return {
        activeScene: context.activeScene,
        perScene: {
            ...context.perScene,
            [context.activeScene]: { ...prev, animations, progress: t },
        },
    };
}

// ── THE ScenePlayback CONTRACT (WV-W1-HIGH-3) ────────────────────────────────
//
// BOTH architectures implement this dual contract; the machine calls the
// CONTRACT, not the group. The AnimationGroup adapter wraps the existing
// imperative restoreGroupPlaybackState (the engine serialize()/hydrate() is the
// S6 born-RED HANDOFF). The raw-rAF adapter round-trips progress/isPlaying/
// startTime (those scenes have NO AnimationGroup position).

export interface ScenePlayback {
    /** Capture this scene's live state into a serializable snapshot. */
    snapshot(): PlaybackSnapshot;
    /** Re-seat this scene from a saved snapshot (targets are attached). */
    restore(snap: PlaybackSnapshot): void;
    /** Stop the scene's loop (genuine SUSPEND — no orphan rAF). */
    suspend(): void;
    /** Restart the scene's loop. */
    resume(): void;
    /** True iff the scene's loop is currently driving motion. */
    isPlaying(): boolean;
}
