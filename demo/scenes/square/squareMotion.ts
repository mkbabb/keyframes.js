/**
 * The Square scene's tour DATA — the diamond circuit's options and keyframes —
 * declared once and read by both the scene (`useSquareDemo`) and its dock
 * miniature (`SquareMini.vue`, KF.W13U.d2 / OA-32). A light module: the dock
 * imports it statically, so it carries no scene runtime. `squareTourKeyframes`
 * returns FRESH objects: the scene re-seats its corners in place on resize
 * (D-8), which must never reach the miniature's copy.
 */

/** The tour's five stops, as TOKEN NAMES beside the tokens' own declared
 *  values — one row per authored keyframe, in keyframe order.
 *
 *  X.KF.W13X · KFA-90 — THE TOUR LEAVES AND RETURNS ON THE REST IDENTITY. The
 *  0 % and 100 % stops were `--rainbow-violet` while the box rests on
 *  `--subject-teal`, so every Play from rest painted teal → violet in ONE frame
 *  (the pose was continuous, the colour was not), and a Reset rewound to a
 *  violet box that was not the scene's rest. The seam stops are the rest token
 *  now; the rainbow rides the three corners between them (violet → blue → cyan),
 *  its hues kept. */
export const TOUR_PALETTE: ReadonlyArray<readonly [token: string, fallback: string]> = [
    ["--subject-teal", "#52e898"],
    ["--rainbow-violet", "hsl(300 75% 60%)"],
    ["--rainbow-blue", "hsl(210 80% 55%)"],
    ["--rainbow-cyan", "hsl(180 80% 50%)"],
    ["--subject-teal", "#52e898"],
];

/** X.KF.W13X · KFA-91 — the engine's default colour space is `oklab`, whose
 *  straight chord between near-complementary stops collapses the chroma (the
 *  tour passed through grey, C 0.009). `oklch` interpolates the hue around the
 *  wheel at the stops' own chroma. */
export const SQUARE_TOUR_OPTIONS = {
    duration: 2000,
    iterationCount: Infinity,
    fillMode: "forwards",
    colorSpace: "oklch",
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
