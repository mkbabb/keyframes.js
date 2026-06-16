/**
 * K.W12 ED-4 — the color-fidelity conformance CORPUS.
 *
 * A reproducible set of color pairs spanning the perceptual gamut: the lane's
 * canonical chromatic pair (`#C462D8 → #E85252`, ecosystem-distribution.md
 * §5.4), achromatic pairs (where naive RGB and oklab nearly agree — the easy
 * case), and saturated cross-hue pairs (where RGB mixing drifts FAR from the
 * perceptual path — the case that showcases the axis). Each pair is animated
 * `background-color: from → to`, sampled at the midpoint, and ΔE-compared to the
 * CSS Color 4 oklab reference.
 *
 * Shared by `test/color-fidelity.test.ts` (the behaviour proof) and
 * `scripts/color-fidelity-harness.mjs` (the published-artifact generator) — ONE
 * corpus, two consumers, so the published ΔE numbers ARE the gated ones.
 */
export interface ColorPair {
    /** The start `background-color` (any CSS color syntax the engine parses). */
    from: string;
    /** The end `background-color`. */
    to: string;
    /** A human label for the published table. */
    note: string;
}

export const COLOR_PAIRS: ColorPair[] = [
    {
        from: "#C462D8",
        to: "#E85252",
        note: "the canonical chromatic pair (orchid → coral; the lane's headline)",
    },
    {
        from: "#FF0000",
        to: "#0000FF",
        note: "red → blue (the maximal cross-hue sweep; RGB mixing drifts hardest)",
    },
    {
        from: "#00FF00",
        to: "#FF00FF",
        note: "green → magenta (complementary; a perceptual mid no sRGB average hits)",
    },
    {
        from: "#FFD700",
        to: "#00CED1",
        note: "gold → dark-turquoise (warm → cool across the chroma plane)",
    },
    {
        from: "#1A1A1A",
        to: "#E0E0E0",
        note: "near-black → near-white (the achromatic ramp; the easy case)",
    },
    {
        from: "#2E8B57",
        to: "#FF6347",
        note: "sea-green → tomato (mid-chroma diagonal)",
    },
    {
        from: "#4B0082",
        to: "#FFA500",
        note: "indigo → orange (deep cool → bright warm; a long perceptual arc)",
    },
    {
        from: "#008080",
        to: "#800080",
        note: "teal → purple (equal-luminance hue rotation)",
    },
];
