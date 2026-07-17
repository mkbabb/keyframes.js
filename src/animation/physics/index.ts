/**
 * physics/ — the LIGHT, clock-driven value steppers + the rAF driver (R.W1).
 *
 * Every member is parser/color-free (the LIGHT surface), sharing at most
 * Value's rootless `/math` leaf: a frequency-/spring-/exponential-driven value
 * producer or the managed rAF playback driver.
 * The caller drives the loop (or RAFPlayback owns it); none parses CSS. The
 * package barrel re-exports these by their `./physics/<name>` path; this barrel
 * is the zone's single surface (and what `proof:structure` asserts present).
 */
export { NumericAnimation } from "./numeric";
export type { NumericAnimationOptions, NumericFrameCallback } from "./numeric";
export { SmoothProgress } from "./smooth";
export type { SmoothProgressOptions, SmoothFrameCallback } from "./smooth";
export { RAFPlayback } from "./playback";
export type { RAFPlaybackOptions, Tickable } from "./playback";
export { Oscillator, waveformValue } from "./oscillator";
export type { OscillatorConfig, OscillatorWaveform } from "./oscillator";
export { decay, decayRest } from "./decay";
export type { DecayOptions, DecaySample } from "./decay";
export { ElementMorph } from "./morph";
export type { MorphRect, ElementMorphOptions } from "./morph";
// S.B4 (a02 F4) — explicit-named barrel policy: the spring sub-zone surface is
// re-exported by name (`export *` is reserved for the leaf tier).
export {
    SpringProgress,
    probeVelocity,
    reseatToSpring,
    DEFAULT_SPRING_RESPONSE,
    durationToSpringOptions,
    springLinearStops,
    springTimingFunction,
} from "./spring";
export type {
    VelocityProbe,
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
    SpringDurationOptions,
    SpringLinearStopsOptions,
    SpringTimingFunctionOptions,
} from "./spring";
