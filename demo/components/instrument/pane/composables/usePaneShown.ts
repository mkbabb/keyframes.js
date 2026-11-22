import { inject, shallowRef, type InjectionKey, type Ref } from "vue";

/**
 * P2f — whether the controls pane can be seen.
 *
 * An upright phone's pane is mounted when a visitor reaches for the Controls
 * seat, and from then on it stays mounted for its scene: while the sheet is
 * shut it waits unseen in a hidden park (ControlsPaneWrapper). A parked pane
 * reads nothing per frame: the Sequence lanes hold their last playhead, the
 * keyframe Timeline's scrub stops, the channel's read-back stops, and a
 * Keyframes surface mounts no editor until the pane is shown. Everywhere else
 * (the landscape rail, the desk column, a host mounted on its own) the pane
 * counts as shown, as before.
 */
export const PANE_SHOWN_KEY: InjectionKey<Readonly<Ref<boolean>>> = Symbol("pane-shown");

const SHOWN: Readonly<Ref<boolean>> = shallowRef(true);

/** The pane's side: whether what it holds can be seen. */
export const usePaneShown = (): Readonly<Ref<boolean>> => inject(PANE_SHOWN_KEY, SHOWN);
