export {
    prepareDampedHarmonic,
    solveDampedHarmonic,
    solvePreparedDampedHarmonic,
} from "./solver";
export { sampleNormalizedSpring } from "./sample";
export { settleTime } from "./settle";
export type { SpringSettleOptions } from "./settle";
export { SpringVectorLanes, EMPTY_LANES } from "./vector";
export { durationToSpringOptions } from "./duration";
export type { SpringDurationOptions } from "./duration";
export { reseatToSpring, probeVelocity } from "./reseat";
export type { VelocityProbe } from "./reseat";
