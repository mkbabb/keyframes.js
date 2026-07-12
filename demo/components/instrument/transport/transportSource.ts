// ─────────────────────────────────────────────────────────────────────────────
// THE TRANSPORT-SOURCE CONTRACT (T.B1-β STAGE 1 — lane 21 rec 3, the transport-
// typing angle on the `SceneFacility` keystone).
//
// The transport suite (AnimationControlsGroup / ControlsPaneWrapper /
// TransportDock / PlaybackRibbon) is CHANNEL-CAPABLE: when the active scene
// exposes a `SceneFacility`, its `channels` (structurally this shape — the
// app-side `ChannelHandle` is assignable) drive the host mounts, the
// transport-select labels, the selection axis, and the scrub round-trip. A
// scene without a facility falls back to the legacy `AnimationGroup` axis
// (`Object.keys(group.animations)`), so a standalone host is unaffected.
//
// A channel that carries a painting `animation` renders the HONEST triad host;
// a light channel exposes only the `progress()`/`setProgress()` scalar
// round-trip (the `TransportSource` contract — `{paused, started, t, duration,
// play/pause}` is exactly what this plus the facility's `playback` expose, so
// the transport never needs an impersonating group).
// ─────────────────────────────────────────────────────────────────────────────

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

/** One transport channel — the shared-tier structural twin of the app-side
 *  `ChannelHandle` (demo/composables/scene-facility/index.ts). */
export interface TransportChannel {
    /** The transport-select label. */
    name: string;
    /** Present ⇒ the channel paints; the triad host mounts on it. */
    animation?: KeyframesAnimation<any>;
    /** The channel's normalized [0,1] playhead. */
    progress(): number;
    /** Seat the channel's normalized [0,1] playhead. */
    setProgress(t: number): void;
}
