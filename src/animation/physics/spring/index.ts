/**
 * physics/spring/ — the spring physics family barrel (R.W1).
 *
 * The single public surface for the spring sub-zone: the `SpringProgress` closed-
 * form tracker (`progress.ts`), the velocity-continuous interruption seam
 * (`reseat.ts`), the spring-from-duration construction surface (`duration.ts`),
 * and the two CSS-emission helpers (`linear-stops.ts` → `springLinearStops`,
 * `timing-function.ts` → `springTimingFunction`). The package barrel re-exports
 * the LIGHT (value.js-free) symbols from here, so a path change is the only
 * consumer-visible difference. The progress↔duration↔reseat ring is broken by
 * `types.ts` (the shared options/default).
 */
export {
    SpringProgress,
    probeVelocity,
    reseatToSpring,
    DEFAULT_SPRING_RESPONSE,
} from "./progress";
export type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
    VelocityProbe,
    SpringDurationOptions,
} from "./progress";
export { durationToSpringOptions } from "./duration";
export { springLinearStops } from "./linear-stops";
export type { SpringLinearStopsOptions } from "./linear-stops";
export { springTimingFunction } from "./timing-function";
export type { SpringTimingFunctionOptions } from "./timing-function";
