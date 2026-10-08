/**
 * The spring scene's ONE time base (ESC-spring-1 · KFA-191, KF-W13.md addendum
 * (g), COHESION §0er).
 *
 * The emitter's default sampling horizon — `springLinearStops` spreads its
 * stops over `maxDuration = 4 × response` seconds — in milliseconds. The trace
 * labels its time axis with it (`0` … `horizon ms`), and the Sweep's sampler
 * runs each leg over it: one forward sweep of the horizon, then its mirror. The
 * axis and the sampler read this one function, so they cannot disagree (the
 * banked defect: the axis said `2000 ms` while each sampler leg was a fixed
 * 700 ms). The trace's unit test binds it to the engine by sampling
 * `sampleNormalizedSpring` at `horizon / 25` and requiring the stop values to
 * match.
 */
export const SPRING_HORIZON_PERIODS = 4;
export const springHorizonMs = (response: number): number =>
    Math.round(response * SPRING_HORIZON_PERIODS * 1000);

/**
 * `direction: alternate`, folded: the Sweep's cycle phase `p ∈ [0, 1)` (a
 * forward leg then its mirror, each one horizon long) → the leg's time on the
 * labelled axis, `u ∈ [0, 1]` of the horizon. `u` rises 0 → 1 over the first
 * half of the cycle and falls 1 → 0 over the second.
 */
export const foldSweepPhase = (phase: number): number =>
    phase <= 0.5 ? phase * 2 : 2 - phase * 2;
