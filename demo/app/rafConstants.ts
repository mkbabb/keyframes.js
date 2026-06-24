/**
 * Shared rAF-cadence constants for the scene hot paths (R.W5 B.3 — kills the
 * `PROGRESS_READOUT_HZ` duplication between useEasingDemo + useSpringHotPath).
 *
 * A root-level constant module (not a Vue composable) — pure data, no setup
 * lifecycle, so it lives beside `app/` rather than under `app/composables/`.
 */

/**
 * Reactive-readout cadence — a few Hz, NOT 60. The 60 Hz positional truth is
 * driven through non-reactive `style.transform` writes (the painters); the
 * human-readable numerals + the contract time-twin are written at most this
 * often so a hot loop never triggers a per-frame reactive storm.
 */
export const PROGRESS_READOUT_HZ = 6;
