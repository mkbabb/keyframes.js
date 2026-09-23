/**
 * The Square scene's tour DATA — the diamond circuit's options and keyframes —
 * declared once and read by both the scene (`useSquareDemo`) and its dock
 * miniature (`SquareMini.vue`, KF.W13U.d2 / OA-32). A light module: the dock
 * imports it statically, so it carries no scene runtime. `squareTourKeyframes`
 * returns FRESH objects: the scene re-seats its corners in place on resize
 * (D-8), which must never reach the miniature's copy.
 */

/** The tour's five stops, as TOKEN NAMES beside the tokens' own declared
 *  values — one row per authored keyframe, in keyframe order. */
export const TOUR_PALETTE: ReadonlyArray<readonly [token: string, fallback: string]> = [
    ["--rainbow-violet", "hsl(300 75% 60%)"],
    ["--rainbow-blue", "hsl(210 80% 55%)"],
    ["--rainbow-cyan", "hsl(180 80% 50%)"],
    ["--rainbow-green", "hsl(130 70% 50%)"],
    ["--rainbow-violet", "hsl(300 75% 60%)"],
];

export const SQUARE_TOUR_OPTIONS = {
    duration: 2000,
    iterationCount: Infinity,
    fillMode: "forwards",
} as const;

/** The authored corner of the diamond (px), at the desktop envelope. */
export const TOUR_CORNER = 90;

export const squareTourKeyframes = () => ({
    "0%": {
        transform: { x: "0px", y: "0px", rotate: 0, a: { b: { c: { d: "100%" } } } },
        backgroundColor: TOUR_PALETTE[0]![1],
    },
    "25%": {
        transform: { x: `${TOUR_CORNER}px`, y: `-${TOUR_CORNER}px`, rotate: 90, a: { b: { c: { d: "108%" } } } },
        backgroundColor: TOUR_PALETTE[1]![1],
    },
    "50%": {
        transform: { x: "0px", y: `${TOUR_CORNER}px`, rotate: 180, a: { b: { c: { d: "100%" } } } },
        backgroundColor: TOUR_PALETTE[2]![1],
    },
    "75%": {
        transform: { x: `-${TOUR_CORNER}px`, y: `-${TOUR_CORNER}px`, rotate: 270, a: { b: { c: { d: "108%" } } } },
        backgroundColor: TOUR_PALETTE[3]![1],
    },
    "100%": {
        transform: { x: "0px", y: "0px", rotate: 360, a: { b: { c: { d: "100%" } } } },
        backgroundColor: TOUR_PALETTE[4]![1],
    },
});
