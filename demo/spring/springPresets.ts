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
