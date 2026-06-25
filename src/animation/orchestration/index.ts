/**
 * orchestration/ — temporal/multi-target helpers over the physics steppers or
 * the engine (R.W1). LIGHT (mostly): `stagger` (pure delay distribution), `flip`
 * (layout FLIP over ElementMorph), `drag` (gesture physics over SpringProgress),
 * `timeline` (the progress-driver family + native bridge), `sequence` (the
 * temporal orchestrator). The package barrel re-exports these by zone path; this
 * barrel is the zone's single surface (and what `proof:no-flat-siblings` asserts).
 */
export { stagger } from "./stagger";
export type { StaggerOrigin, StaggerOptions, StaggerFn } from "./stagger";
export { flip, flipShared } from "./flip";
export type { FlipOptions } from "./flip";
export * from "./drag";
export * from "./timeline";
export * from "./sequence";
