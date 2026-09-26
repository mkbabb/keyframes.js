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

import type { ChannelHandle } from "@composables/scene-facility";

/** One transport channel — the members of the app-side `ChannelHandle`
 *  (demo/composables/scene-facility/index.ts) the transport reads: the label,
 *  the painting `animation`, a master-clock `sequence`, and the [0,1] playhead
 *  round-trip. A `Pick<>`, so a channel member is declared once (A2-KE-L1-14). */
export type TransportChannel = Pick<
    ChannelHandle,
    "name" | "animation" | "sequence" | "progress" | "setProgress"
>;
