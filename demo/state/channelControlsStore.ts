import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { reactive, toRaw } from "vue";

/**
 * THE PER-CHANNEL CONTROL STATE (X.KF.W13X.esc1 · ESC-mobile-1 · A2-KE-L1-10 ·
 * KFA-156 · UIA-KF-104).
 *
 * The controls pane used to mount one full `ChannelControls` host per channel
 * behind `v-show`, because the channel's UI state lived in those component
 * instances: the card's drill-in pane (`usePaneStack`), the Keyframes surface's
 * warm flag (`useKeyframesPaneReveal`) and the CSS editor's buffer and parse
 * status (`useKeyframesState`). Hiding a host was the only way to keep them, so
 * every scene facet, timeline and editor was mounted N times.
 *
 * The state belongs to the CHANNEL, so it lives here, keyed by the channel's own
 * animation (stable for the channel's life; the entry is collected with it, the
 * same owner rule as the timeline session, KFA-58). The pane mounts ONE host for
 * the selected channel, and a host that mounts for a channel reads back exactly
 * what the channel had when it was last shown. Session state, not a preference:
 * nothing here is persisted to storage.
 */

/** The channel card's drill-in panes: the card itself, the easing detail, the
 *  layer (blend) panel. */
export type ChannelPane = "main" | "detail" | "layer";

export interface ChannelControlsState {
    /** The card's open drill-in pane. */
    pane: ChannelPane;
    /** The Keyframes surface was warmed (its editor chunk requested) for this
     *  channel; a later mount does not wait for idle again. */
    keyframesWarmed: boolean;
    /** The CSS editor's buffer — the user's text, parsed or not. */
    keyframesText: string;
    /** The stylesheet text Apply injects (the style id's own name). */
    keyframesSheet: string;
    /** Whether `keyframesText` parsed. "error" marks a draft the engine does not
     *  hold, which a remount must show as written, never re-project over. */
    parseState: "parsed" | "error";
}

const channelStates = new WeakMap<object, ChannelControlsState>();

const freshState = (): ChannelControlsState => ({
    pane: "main",
    keyframesWarmed: false,
    keyframesText: "",
    keyframesSheet: "",
    parseState: "parsed",
});

/** The channel's control state — one reactive record per channel animation,
 *  created on first read. */
export function getChannelControlsState(
    animation: KeyframesAnimation<any>,
): ChannelControlsState {
    const key = toRaw(animation) as object;
    let state = channelStates.get(key);
    if (state === undefined) {
        state = reactive(freshState()) as ChannelControlsState;
        channelStates.set(key, state);
    }
    return state;
}
