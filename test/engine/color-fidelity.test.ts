/**
 * K.W12 ED-4 — the public color-FIDELITY conformance harness (the behaviour half).
 *
 * The ONE benchmark only kf can publish honestly (ecosystem-distribution.md
 * §5.4): a CORRECTNESS benchmark, not a throughput one. It measures kf's UNIQUE
 * axis-2 — perceptual color — against the CSS Color 4 SPEC reference, and is
 * un-spinnable: it measures correctness against a spec, NOT speed against a
 * rival. GSAP animates oklch incorrectly (its own forums); Motion/anime mix in
 * RGB; kf interpolates in perceptual oklab by default — this harness PROVES it.
 *
 * THE MEASUREMENT. For each color pair in the corpus:
 *   1. PARSE  `@keyframes { 0% { background-color: A } 100% { …: B } }` through
 *      the REAL engine (`CSSKeyframesAnimation.fromString`, oklab colorSpace).
 *   2. SAMPLE  the midpoint of kf's playback — `interpFrames(0.5)` → the
 *      background-color the engine WOULD render at t=0.5.
 *   3. REFERENCE  the CSS Color 4 oklab midpoint through Value 4's
 *      `mixColors(A, B, 0.5, { space: "oklab" })` Result contract.
 *   4. ΔE  Euclidean distance between the two final OKLab coordinates.
 *
 * THE CONFORMANCE THRESHOLD. The midpoint ΔE must be UNDER Keyframes'
 * compiler-owned densification tolerance — i.e. kf's oklab lerp is
 * PERCEPTUALLY INDISTINGUISHABLE from the CSS Color 4 reference. A lossy lerp
 * (an RGB-mixed midpoint, a wrong perceptual path) would exceed the JND and red.
 *
 * The ΔE numbers are PUBLISHED to `docs/color-fidelity.md` by the harness
 * (`scripts/color-fidelity-harness.mjs`); `proof:color-fidelity` asserts the
 * published artifact matches a fresh run + the source-grep locks. This is the
 * PUBLIC face of the same OKLab fidelity discipline K.W10's CC-2 densify gates
 * on internally (css-compiler.md §7).
 *
 * No throughput benchmark (the credibility trap, BOOK — L-SEED §5). No
 * alternate color parser or interpolation fallback.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { convertColor, mixColors, type AnyColor } from "@mkbabb/value.js/color";
import { parseCssColor } from "@mkbabb/value.js/css";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { DEFAULT_DELTA_E_EPSILON } from "../../src/animation/compile";
import { COLOR_PAIRS } from "../fixtures/color-fidelity-corpus";

const HERE = dirname(fileURLToPath(import.meta.url));
// The harness data sink — the gated engine measurement the PUBLISHED artifact
// (`docs/color-fidelity.md`) renders from. ONE measurement, gated AND published.
const DATA_OUT = join(HERE, "..", "..", "docs", "color-fidelity-data.json");
const measured: Array<{
    from: string;
    to: string;
    note: string;
    deltaE: number;
}> = [];

// ── the ΔE-OK domain (the perceptual distance the harness reads) ──────────────
const rawOklab = (color: AnyColor): [number, number, number] => {
    const converted = convertColor(color, "oklab");
    if (!converted.ok) throw new TypeError(`Color conversion failed: ${converted.error.code}`);
    const [l, a, b] = converted.value.channels;
    if (typeof l !== "number" || typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Color fidelity requires numeric OKLab channels.");
    }
    return [l, a, b];
};

const dE = (c1: AnyColor, c2: AnyColor): number => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return Math.hypot(L2 - L1, a2 - a1, b2 - b1);
};

/** A CSS color string → Value 4's final immutable color. */
const parseColor = (cssColor: string): AnyColor => {
    const parsed = parseCssColor(cssColor);
    if (!parsed.ok) throw new TypeError(`Invalid color fixture: ${cssColor}`);
    return parsed.value;
};

/**
 * The midpoint of kf's ENGINE playback: parse the two-stop background-color
 * track, sample at t=0.5, and lift the rendered color to a value.js `Color`.
 * This is what the engine WOULD paint at the animation's midpoint.
 */
const kfMidpoint = (from: string, to: string): AnyColor => {
    const el = document.createElement("div");
    const anim = new CSSKeyframesAnimation(
        { duration: 1000, colorSpace: "oklab" },
        el,
    );
    anim.fromString(
        `@keyframes m { 0% { background-color: ${from} } 100% { background-color: ${to} } }`,
    );
    const mid = anim.at(0.5) as Record<string, unknown>;
    const value = mid["background-color"];
    // `at(0.5)` returns the interpolated value; lift it to a Color through the
    // same parse path so the ΔE is computed in the canonical oklab domain.
    return parseColor(String(value));
};

describe("K.W12 ED-4 — color-fidelity conformance (kf oklab lerp vs CSS Color 4)", () => {
    it("the corpus is non-trivial (≥ 6 perceptual color pairs)", () => {
        expect(COLOR_PAIRS.length).toBeGreaterThanOrEqual(6);
    });

    it.each(COLOR_PAIRS)(
        "midpoint ΔE under the JND: $from → $to",
        ({ from, to, note }) => {
            const a = parseColor(from);
            const b = parseColor(to);

            // The CSS Color 4 reference midpoint — the perceptual oklab lerp the
            // spec's color-mix(in oklab, …) defines (value.js, the PUBLISHED
            // producer; NOT a re-authored kernel).
            const referenceResult = mixColors(a, b, 0.5, { space: "oklab" });
            if (!referenceResult.ok) {
                throw new TypeError(`Reference mix failed: ${referenceResult.error.code}`);
            }
            const reference = referenceResult.value;

            // kf's engine-rendered midpoint.
            const mid = kfMidpoint(from, to);

            const delta = dE(mid, reference);
            measured.push({ from, to, note, deltaE: delta });

            // CONFORMANCE: kf's oklab lerp is perceptually indistinguishable
            // from the CSS Color 4 reference — under the just-noticeable
            // difference. A lossy (RGB-mixed) midpoint would exceed the JND.
            expect(delta).toBeLessThan(DEFAULT_DELTA_E_EPSILON);
        },
    );

    // Emit the gated measurement for the published artifact. The harness
    // (`scripts/color-fidelity-harness.mjs`) renders docs/color-fidelity.md
    // from THIS data, so the published ΔE numbers ARE the gated ones.
    afterAll(() => {
        if (measured.length === COLOR_PAIRS.length) {
            writeFileSync(
                DATA_OUT,
                JSON.stringify(
                    {
                        jnd: DEFAULT_DELTA_E_EPSILON,
                        space: "oklab",
                        reference: "CSS Color 4 — color-mix(in oklab) midpoint",
                        producer: "@mkbabb/value.js mixColors + Keyframes OKLab metric",
                        pairs: measured,
                    },
                    null,
                    2,
                ) + "\n",
            );
        }
    });

    it("a deliberate RGB-mixed midpoint EXCEEDS the JND (the harness BITES)", () => {
        // The negative control: the naive sRGB channel-average midpoint of a
        // MAXIMAL cross-hue pair drifts FAR from the perceptual reference —
        // proving the harness is a real conformance instrument, not a vacuous
        // pass. red → blue is the worst case: sRGB-averaging gives a muddy
        // #800080-ish purple, perceptually far from the oklab arc that passes
        // through a brighter, more chromatic mid (the exact failure mode
        // Motion/anime exhibit by mixing in RGB).
        const a = parseColor("#FF0000");
        const b = parseColor("#0000FF");
        const referenceResult = mixColors(a, b, 0.5, { space: "oklab" });
        if (!referenceResult.ok) {
            throw new TypeError(`Reference mix failed: ${referenceResult.error.code}`);
        }
        const reference = referenceResult.value;

        // The sRGB channel-average midpoint (what Motion/anime would render).
        const srgbMid = parseColor("#800080"); // (255+0)/2, (0+0)/2, (0+255)/2

        // Sanity: ΔE of a color with itself is 0 (the metric is well-formed).
        expect(dE(a, a)).toBe(0);

        const srgbDelta = dE(srgbMid, reference);
        // The naive sRGB midpoint is perceptually distinguishable from the spec
        // reference — well over the JND. If this ever drops under the JND the
        // negative control is dead and the conformance assert above is vacuous.
        expect(srgbDelta).toBeGreaterThan(DEFAULT_DELTA_E_EPSILON);
    });
});
