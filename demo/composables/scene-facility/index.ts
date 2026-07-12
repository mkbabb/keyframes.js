// ─────────────────────────────────────────────────────────────────────────────
// THE SceneFacility DESCRIPTOR (T.B1 — STAGE 1, the batch-④′ α lane).
//
// The unification seam that replaces the `animationGroup?` + `scenePlayback?` +
// decoy triple with ONE descriptor: `{ channels[], facets[], playback }`. A
// channel carries a painting `animation` (⇒ its triad is HONEST) OR declares the
// honest subset of `surfaces` it supports (a light channel — spring's Physics);
// there is no third "decoy" state. This is lane 21 rec 3's `TransportSource`
// contract named from the transport-typing angle — the channel's
// `progress()`/`setProgress()` + `playback` IS what `{paused, started, t,
// duration, play/pause}` exposed, so no impersonation.
//
// T.B1-β/T.B7 (batch ⑥′) — THE KEYSTONE IS COMPLETE: every scene exposes a
// facility. The GROUP scenes (cube/amiga/square) ride `facilityFromGroup`;
// SEQUENCE + EASING + SPRING assemble theirs over their raw-rAF playback
// (sequence one master channel; easing ONE real preview animation; spring the
// Sweep/Entry channel pair). The contract-group decoy (useContractAnim…) is
// DELETED — proof:scene-facility's decoy-zero clause is GREEN and blocking.
// ─────────────────────────────────────────────────────────────────────────────

import type { AnimationGroup, KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { ControlSurface, ScenePlayback } from "@state";
import { createGroupAdapter } from "@state";

/**
 * ONE transport channel. `name` is the transport-select label. A channel that
 * carries a painting `animation` renders the HONEST triad (Controls/Keyframes/
 * Timeline); a light channel instead declares the honest subset of `surfaces` it
 * supports. `progress()`/`setProgress()` are the uniform raf round-trip.
 */
export interface ChannelHandle {
    /** The transport-select label. */
    name: string;
    /** Present ⇒ the triad is HONEST for this channel (it paints). */
    animation?: KeyframesAnimation<any>;
    /** A light channel's honest surface subset (no fictional keyframes). */
    surfaces?: ControlSurface[];
    /** Conditional facets contributed to the derived surface set ONLY while THIS
     *  channel is selected (T.B2 — cube's Matrix channel → matrix-controls, so
     *  selection-gating is just "which channel is selected"). */
    facets?: SceneFacet[];
    /** The channel's normalized [0,1] playhead. */
    progress(): number;
    /** Seat the channel's normalized [0,1] playhead. */
    setProgress(t: number): void;
}

/** An additive scene surface (easing Curve, spring Physics, cube Matrix). */
export interface SceneFacet {
    surface: ControlSurface;
    label?: string;
    icon?: string;
}

/**
 * The descriptor every migrated scene exposes. `channels` is ≥1 for any live
 * scene (NEVER a decoy); `playback` is ONE adapter built FROM the channels;
 * `group` is the real `AnimationGroup` a group-clocked scene rides (absent for a
 * progress-scalar scene — sequence), used by the shell binding as the panel
 * group.
 */
export interface SceneFacility {
    channels: ChannelHandle[];
    facets: SceneFacet[];
    playback: ScenePlayback;
    /** The real group a group-clocked scene rides (cube/amiga/square). */
    group?: AnimationGroup<any>;
}

/**
 * Build a `SceneFacility` from a live `AnimationGroup` — the cube/amiga/square
 * path. Each group member becomes a painting channel (its triad is honest by
 * construction); the playback is the standard group adapter. The group is read
 * LAZILY (`getGroup`) so a scene whose group object is replaced (a relit rebuild)
 * re-reads the live one; the adapter never holds the markRaw group.
 */
export function facilityFromGroup(
    getGroup: () => AnimationGroup<any>,
    opts?: {
        facets?: SceneFacet[];
        /** Per-channel CONDITIONAL facets keyed by channel name (T.B2 — cube's
         *  Matrix channel → matrix-controls). Contributed to the derived surface
         *  set only while that channel is selected. */
        channelFacets?: Record<string, SceneFacet[]>;
    },
): SceneFacility {
    const group = getGroup();
    const channels: ChannelHandle[] = Object.entries(group.animations).map(
        ([name, groupObj]) => {
            const anim = groupObj.animation;
            const facets = opts?.channelFacets?.[name];
            return {
                name,
                animation: anim,
                ...(facets ? { facets } : {}),
                progress: () => {
                    const dur = anim.options.duration ?? 1000;
                    return dur > 0 ? anim.t / dur : 0;
                },
                setProgress: (t: number) => {
                    const dur = anim.options.duration ?? 1000;
                    const clamped = Math.max(0, Math.min(1, t));
                    getGroup().setChildTime(anim, clamped * dur).render();
                },
            };
        },
    );
    return {
        channels,
        facets: opts?.facets ?? [],
        playback: createGroupAdapter(getGroup),
        group,
    };
}
