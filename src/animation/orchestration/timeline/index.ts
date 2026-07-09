/**
 * orchestration/timeline/ — the progress-driver family barrel (R.W1; thinned to a
 * pure re-export surface at S.B4 — r3 F4 / a02, so the barrel no longer carries
 * the class bodies). The `Timeline` family (`./timeline`) + the native
 * platform-timeline feature-detect (`./native`). LIGHT (value.js-free).
 */
export {
    Timeline,
    KeyframesScrollTimeline,
    ManualTimeline,
} from "./timeline";
export type {
    TimelineOptions,
    KeyframesScrollTimelineOptions,
} from "./timeline";
// The native platform-timeline feature-detect lives in `./native` (split by the
// HEAVY waapi/ consumer seam; lib-light F-9). Re-exported so the package barrel
// resolves `createNativeTimeline` / `NativeTimelineSpec` through this barrel
// exactly as before.
export { createNativeTimeline } from "./native";
export type { NativeTimelineSpec } from "./native";
