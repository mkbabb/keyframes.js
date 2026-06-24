/**
 * waapi/ — the WAAPI eligibility + emission + delegation surface (R.W1).
 *
 * HEAVY (value.js-bearing). The barrel is the unified surface: the eligibility
 * predicate + keyframe/option emission + play delegation + native scroll bridge
 * (`waapi.ts`), and the curvature-adaptive densify (`densify.ts`). The flat
 * dual-import relay is retired — `waapi.ts` imports `densify.ts` directly within
 * the directory; the densify public tokens are re-exported here.
 */
export {
    isWAAPIEligible,
    toWAAPIKeyframes,
    toWAAPIOptions,
    playWAAPI,
    attachNativeScrollTimeline,
} from "./waapi";
export type { WAAPIEligibility, NativeScrollAttachment } from "./waapi";
export {
    densifyInteriorTimes,
    segmentFlatnessError,
    WAAPI_MAX_SUBSEGMENT_STOPS,
    WAAPI_CHORD_TOLERANCE,
} from "./densify";
