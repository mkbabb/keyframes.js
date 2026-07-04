/**
 * scroll/ — the scroll-grammar parse/serialize + the JS scroll-scene driver (R.W1).
 *
 * HEAVY (value.js-bearing). `grammar.ts` is the value.js scroll-grammar round-trip
 * (parse/serialize); `scene.ts` is the `ScrollScene` JS driver (kf owns TIME,
 * value.js owns the scroll VALUES). The barrel owns the unified surface — the
 * former scene.ts→grammar hub re-export relay is retired here.
 */
export { ScrollScene, createScrollScene, dispatchScrollBackend, pinCSS } from "./scene";
export type {
    ScrollSceneOptions,
    ScrollDispatchRequest,
    ScrollDispatch,
    ScrollBackend,
    ScrollSceneEvent,
    ScrollSceneSubscriber,
    SnapPoints,
} from "./scene";
// S.B4 (a19 F3) — the range → [0,1] mapping lives in `./range`; the barrel
// reaches it DIRECTLY, not relayed through `./scene` (the half-retired two-hop
// bridge `scene.ts` carried alongside its own `./range` import is deleted there).
export { resolveRange } from "./range";
export type { ResolvedRange } from "./range";
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
