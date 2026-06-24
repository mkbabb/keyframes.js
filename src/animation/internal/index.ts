/**
 * internal/ — the value.js-free leaf barrel (R.W1; challenge-library §2 / R.md §2).
 *
 * A NEW convention this wave introduces for genuine consistency: every zone
 * directory carries an `index.ts` barrel, and `internal/` is no exception (it had
 * none before — consumers imported by direct path). The barrel is additive:
 * existing direct-path imports (`from "./internal/leaves"`, …) keep resolving;
 * this is the WHERE for the LIGHT/HEAVY re-export seam consistency. The leaves are
 * value.js-free by the `leaf-no-engine-no-valuejs` lint rule.
 */
export * from "./binarySearch";
export * from "./errors";
export * from "./leaves";
export * from "./reduced-motion";
export * from "./scheduler";
export * from "./scroll-phases";
