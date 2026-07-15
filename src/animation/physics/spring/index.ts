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
export { SpringProgress } from "./progress";
// The barrel owns the unified surface: re-export each colocated member from its
// OWN module (no relay through the class module). The progress↔duration↔reseat
// ring is broken because `types.ts` is the shared options/default home.
export { probeVelocity, reseatToSpring } from "./solver";
export type { VelocityProbe } from "./solver";
export { DEFAULT_SPRING_RESPONSE } from "./types";
export type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
} from "./types";
export { durationToSpringOptions } from "./solver";
export type { SpringDurationOptions } from "./solver";
export { springLinearStops, springTimingFunction } from "./css";
export type { SpringLinearStopsOptions, SpringTimingFunctionOptions } from "./css";
