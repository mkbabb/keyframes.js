/**
 * waapi/ — the WAAPI eligibility + emission + options + delegation surface (R.W1/R.W2).
 *
 * HEAVY (value.js-bearing). The barrel is the unified surface, carved into four
 * cohesive concerns (R.W2):
 *   - `eligibility.ts` — the `isWAAPIEligible` predicate + its layout-unit guard
 *   - `emission.ts`    — `toWAAPIKeyframes` (rides the curvature-adaptive densify)
 *   - `options.ts`     — `toWAAPIOptions` (the direction/fill/composite/easing map)
 *   - `delegation.ts`  — `playWAAPI` + the additive `attachNativeScrollTimeline` bridge
 * plus the curvature-adaptive densify (`densify.ts`). `emission.ts` imports
 * `densify.ts` directly within the directory; the densify public tokens are
 * re-exported here. No flat-sibling relay survives — the barrel owns the surface.
 */
export type { WAAPIEligibility } from "./eligibility";
export { isWAAPIEligible } from "./eligibility";
export { toWAAPIKeyframes } from "./emission";
export { toWAAPIOptions } from "./waapi-options";
export type { NativeScrollAttachment } from "./delegation";
export { playWAAPI, attachNativeScrollTimeline } from "./delegation";
export {
    densifyInteriorTimes,
    segmentFlatnessError,
    WAAPI_MAX_SUBSEGMENT_STOPS,
    WAAPI_CHORD_TOLERANCE,
} from "./densify";
