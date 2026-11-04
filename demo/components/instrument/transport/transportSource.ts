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

import type { InjectionKey } from "vue";
import type { ChannelHandle } from "@composables/scene-facility";

/** One transport channel — the members of the app-side `ChannelHandle`
 *  (demo/composables/scene-facility/index.ts) the transport reads: the label,
 *  the painting `animation`, a master-clock `sequence`, and the [0,1] playhead
 *  round-trip. A `Pick<>`, so a channel member is declared once (A2-KE-L1-14). */
export type TransportChannel = Pick<
    ChannelHandle,
    "name" | "animation" | "sequence" | "progress" | "setProgress"
>;

/** UIA-KF-026 (X.KF.W13X.r4transport) — THE GROUP'S PAINTS, observable by the
 *  transport's read-backs. A read-back (the channel ribbon's `currentT` sync)
 *  idles while paused and was woken only by its own scrubs and by play/pause
 *  flips, so a paint it did not cause — Reset's rewind after a takeover had
 *  already paused the group — left the rail at the old time. The host that
 *  owns the group provides its `onRender` here; a read-back re-derives on
 *  every frame the group paints. Returns the unsubscribe. */
export type ObserveGroupPaints = (listener: () => void) => () => void;
export const GROUP_PAINTS_KEY: InjectionKey<ObserveGroupPaints> = Symbol("groupPaints");

/**
 * KF-M1 (value.js COHESION §0hm) — the phone sheet's reserve on the stage,
 * published by the pane (useStageReserve) and bound by the controls group on
 * `.controls-layout` (AnimationControlsGroup).
 *  · `block` / `inline` — the sheet's settled PEEK size on the axis it rests
 *    on; the stage cell reserves it in layout, the same at every rung.
 *  · `liftBlock` / `liftInline` — how much further it reaches at OPEN (0 at
 *    PEEK and FULL); the stage answers it on the compositor.
 */
export interface StageReserve {
    block: number;
    inline: number;
    liftBlock: number;
    liftInline: number;
}

export const NO_STAGE_RESERVE: StageReserve = { block: 0, inline: 0, liftBlock: 0, liftInline: 0 };
