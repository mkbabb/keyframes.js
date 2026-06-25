/**
 * ingest/ — the CSSOM walk + live-animation temporal takeover (R.W1).
 *
 * HEAVY (value.js-bearing). `cssom.ts` walks `document.styleSheets` /
 * `getAnimations()` into kf `CSSKeyframesAnimation` objects; `adopt.ts` takes
 * over a RUNNING CSS animation mid-flight. The barrel is the zone's single
 * surface (reached through `loadAnimationEngine`).
 */
export {
    fromStyleSheets,
    fromLiveAnimations,
    resolveLiveKeyframes,
} from "./cssom";
export type {
    IngestedAnimation,
    IngestResult,
    IngestOptions,
} from "./cssom";
export { adoptRunning } from "./adopt";
export type { AdoptRunningOptions, AdoptResult } from "./adopt";
