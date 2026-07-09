/**
 * scroll/ — the scroll-grammar parse/serialize + the JS scroll-scene driver (R.W1).
 *
 * HEAVY (value.js-bearing). `grammar.ts` is the value.js scroll-grammar round-trip
 * (parse/serialize); `scene.ts` is the `ScrollScene` JS driver (kf owns TIME,
 * value.js owns the scroll VALUES). The barrel owns the unified surface — the
 * former scene.ts→grammar hub re-export relay is retired here.
 */
export { ScrollScene, createScrollScene } from "./scene";
export type {
    ScrollSceneOptions,
    ScrollBackend,
    ScrollSceneEvent,
    ScrollSceneSubscriber,
    SnapPoints,
} from "./scene";
// T.F22 — the native-vs-JS backend dispatch + the `position:sticky` pin
// synthesis live in the colocated `./dispatch` half (carved off `scene.ts` on
// the driver-vs-decision cohesion seam). The barrel reaches it DIRECTLY.
export { dispatchScrollBackend, pinCSS } from "./dispatch";
export type { ScrollDispatchRequest, ScrollDispatch } from "./dispatch";
// S.B4 (a19 F3) — the range → [0,1] mapping lives in `./range`; the barrel
// reaches it DIRECTLY, not relayed through `./scene` (the half-retired two-hop
// bridge `scene.ts` carried alongside its own `./range` import is deleted there).
export { resolveRange } from "./range";
export type { ResolvedRange } from "./range";
// S.F4 — the DISCRETE `animation-trigger` layer (idle→active→done + backward/
// repeat), realized over the SAME `./range` mapping the scrub lane uses. The
// barrel reaches it DIRECTLY (mirroring `./range` / `./grammar`), no relay.
export {
    TriggerScene,
    createTriggerScene,
    supportsNativeTrigger,
} from "./trigger";
export type { TriggerState, TriggerDirection } from "./trigger";
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
