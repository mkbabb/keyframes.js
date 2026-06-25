/**
 * scroll/ — the scroll-grammar parse/serialize + the JS scroll-scene driver (R.W1).
 *
 * HEAVY (value.js-bearing). `grammar.ts` is the value.js scroll-grammar round-trip
 * (parse/serialize); `scene.ts` is the `ScrollScene` JS driver (kf owns TIME,
 * value.js owns the scroll VALUES). The barrel owns the unified surface — the
 * former scene.ts→grammar hub re-export relay is retired here.
 */
export { ScrollScene, createScrollScene, resolveRange, dispatchScrollBackend, pinCSS } from "./scene";
export type {
    ScrollSceneOptions,
    ScrollDispatchRequest,
    ScrollDispatch,
    ScrollBackend,
    ScrollSceneEvent,
    ScrollSceneSubscriber,
    ResolvedRange,
    SnapPoints,
} from "./scene";
export {
    parseScrollTimeline,
    parseScrollRange,
    parseScrollCSS,
    serializeScrollOptions,
    roundTripScrollCSS,
} from "./grammar";
export type {
    AnimationTimelineValue,
    AnimationRangeValue,
    CSSTimelineOptions,
    RangeBoundary,
    RangePhase,
} from "./grammar";
