/**
 * The Sequence scene's storyboard DATA — the row count, each row's glide
 * (duration, spring easing, keyframes) and the stagger spacing — declared once
 * and read by both the scene (`useSequenceDemo`) and its dock miniature
 * (`SequenceMini.vue`, KF.W13U.d2 / OA-32). A light module: the dock imports
 * it statically, so it carries no scene runtime.
 */

/** How many staggered storyboard rows the sequence orchestrates. */
export const ROW_COUNT = 5;

/** Per-row child glide duration (ms). */
export const ROW_DURATION = 900;

/** The stagger increment between adjacent rows (ms) — the `at:` spacing. */
export const STAGGER_EACH = 260;

/** The row glide's spring (fed to `springTimingFunction`). */
export const ROW_GLIDE = { response: 0.45, dampingFraction: 0.62 } as const;

/** The per-row child keyframe vars the engine paints onto each traveller. */
export type BallVars = {
    "--ball-p": number;
    opacity: number;
    scale: number;
};

/**
 * One row's glide: `--ball-p` 0 → 1 along the rail, a fade-in, a settle pop.
 *
 * KFA-47 (X.KF.W13X.sequence): the travel is ONE segment. The engine eases
 * each keyframe interval of each property on its own (CSS semantics,
 * `interpolate.ts`), and the spring settles inside the first quarter of any
 * interval it eases, so a `--ball-p` stop at 70% made every ball dash to 0.74,
 * hold at 0.700 for ~450 ms and snap the last 30% in two frames. `--ball-p`
 * therefore declares only its two ends, and the engine reconciles it into a
 * single 0% → 100% segment under the spring; the fade and the pop keep their
 * own stops (their 70% peak is the pop's crest, not a travel waypoint).
 */
export const sequenceRowKeyframes = () => ({
    "0%": { "--ball-p": 0, opacity: 0.25, scale: 0.7 },
    "70%": { opacity: 1, scale: 1.12 },
    "100%": { "--ball-p": 1, opacity: 1, scale: 1 },
});

/**
 * The per-row spectrum map, row 0 violet … row 4 green (the sequence icon's
 * ascending bars), all from the owned --rainbow-* family (J.W7a S3 · D12/CP-2).
 * The fourth is the token-derived cyan→green midpoint (the glyph ships four
 * stops over five rows — the bridge stop is mixed, never a new literal). ONE
 * cardinality (L-9): the tuple's length is checked against ROW_COUNT at compile
 * time. Declared here (X.KF.W13V.s2) because TWO surfaces wear it: the stage's
 * rows and the Timeline pane's lanes that re-time them.
 */
export const ROW_TONES = [
    "var(--rainbow-violet)",
    "var(--rainbow-blue)",
    "var(--rainbow-cyan)",
    "color-mix(in oklab, var(--rainbow-cyan) 45%, var(--rainbow-green))",
    "var(--rainbow-green)",
] as const satisfies { readonly length: typeof ROW_COUNT };
