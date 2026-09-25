/**
 * The four canonical iOS-style spring presets, named after their feel.
 *
 * `snappy` (ζ 0.65) and `bouncy` (ζ 0.45) carry the glass-ui-retuned damping
 * fractions — the same values glass-ui's `--spring-*` tokens were retuned to
 * (G-AJ / AC.W*). `smooth` and `gentle` match the SpringProgress defaults
 * (ζ 0.86 critically-ish damped, ζ 1.0 critically damped).
 */
export interface SpringPreset {
    name: string;
    response: number;
    dampingFraction: number;
    /** Short descriptor for the comparison card. */
    blurb: string;
}

export const SPRING_PRESETS: readonly SpringPreset[] = [
    {
        name: "smooth",
        response: 0.5,
        dampingFraction: 0.86,
        blurb: "iOS default — settles without ringing",
    },
    {
        name: "snappy",
        response: 0.35,
        dampingFraction: 0.65,
        blurb: "quick with a touch of overshoot",
    },
    {
        name: "bouncy",
        response: 0.5,
        dampingFraction: 0.45,
        blurb: "pronounced overshoot, playful ring",
    },
    {
        name: "gentle",
        response: 0.7,
        dampingFraction: 1.0,
        blurb: "critically damped — slow, no overshoot",
    },
] as const;

/** The solver settle floor every spring in the field shares, in VISIBLE units
 *  (X.KF.W13X.spring, KFA-103). It was 1e-4 for both, ≈0.05 px on the 1440
 *  value track, so "settled" and the settle pulse fired 130-650 ms after the ball
 *  visibly stopped, on an invisible sub-pixel tail. Position: 1e-3 of the value
 *  axis (≈0.55 px on the 551 px 1440 track, ≈0.2 px at 390) — below a visible
 *  step. Velocity (value units/s): 1e-2 — at 60 Hz a further frame moves less
 *  than 2e-4 of the axis, invisible at every width. */
const SETTLE_POSITION = 1e-3;
const SETTLE_VELOCITY = 1e-2;

/**
 * D-3 — THE DECLINED ENGINE FLAG, NOW PASSED AT EVERY CONSTRUCTION SITE.
 *
 * The scene's `prefers-reduced-motion` story reached only three cosmetic CSS
 * declarations; the 60 Hz SOLVER path had no PRM gate anywhere, while the engine
 * has shipped the opt-in all along (`respectReducedMotion`, default FALSE) and a
 * sibling scene proves the route (EasingTarget's `useMediaQuery` gate). CSS
 * cannot govern engine motion — the banked kf-CubeScene ruling — so the gate has
 * to be the option, and it has to be on every spring in the field or the field
 * disagrees with itself. Under PRM `set target` SNAPS and settles, which the
 * C-1 chase contract reads as "already settled": the loop terminates on its
 * first frame and a reduced-motion user gets the new state with no travel.
 */
export const SPRING_BASE = {
    initial: 0,
    settleThreshold: SETTLE_POSITION,
    velocitySettleThreshold: SETTLE_VELOCITY,
    respectReducedMotion: true,
} as const;
