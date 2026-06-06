/**
 * The author `offset-path` geometry for the MotionPath demo scene (F.W12.S3).
 *
 * A self-crossing loop drawn in a square `0 0 VIEW VIEW` viewBox — the SAME `d`
 * string drives BOTH the SVG guide `<path>` (the visible dashed track) and the
 * traveller's CSS `offset-path: path('…')` (the geometry the browser resolves
 * positions from). One source so the guide and the traversal can never drift.
 *
 * keyframes.js parses NONE of this — the browser owns the path → position
 * resolution; the engine only sweeps the scalar `offset-distance` (F.W12.S1).
 */

/** The square viewBox side the path is authored in (user units). */
export const VIEW = 400;

/** The author path `d` — a looping figure that reads well as a traversal. */
export const PATH_D =
    "M 60 200 C 60 80, 200 80, 200 200 S 340 320, 340 200 S 200 60, 60 200 Z";
