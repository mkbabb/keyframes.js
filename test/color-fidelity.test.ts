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
 *   3. REFERENCE  the CSS Color 4 oklab midpoint: `mixColors(A, B, 0.5, 0.5,
 *      "oklab")` (the SAME perceptual lerp the spec's `color-mix(in oklab, …)`
 *      defines), via value.js — the producer kf consumes PUBLISHED (inv-16).
 *   4. ΔE  `deltaEOK(kfMidpoint, referenceMidpoint)` — the perceptual distance.
 *
 * THE CONFORMANCE THRESHOLD. The midpoint ΔE must be UNDER `DELTA_E_OK_JND`
 * (value.js's just-noticeable-difference constant) — i.e. kf's oklab lerp is
 * PERCEPTUALLY INDISTINGUISHABLE from the CSS Color 4 reference. A lossy lerp
 * (an RGB-mixed midpoint, a wrong perceptual path) would exceed the JND and red.
 *
 * The ΔE numbers are PUBLISHED to `docs/color-fidelity.md` by the harness
 * (`scripts/color-fidelity-harness.mjs`); `proof:color-fidelity` asserts the
 * published artifact matches a fresh run + the source-grep locks. This is the
 * PUBLIC face of the same `deltaEOK` fidelity discipline K.W10's CC-2 densify
 * gates on internally (css-compiler.md §7) — one producer, two consumers.
 *
 * No throughput benchmark (the credibility trap, BOOK — L-SEED §5). No
 * re-authored ΔE kernel (the `deltaEOK` producer is consumed PUBLISHED).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import {
    COLOR_SPACE_RANGES,
    color2,
    deltaEOK,
    DELTA_E_OK_JND,
    mixColors,
    normalizeColorUnit,
    scale,
    type Color,
    type ValueUnit,
} from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { COLOR_PAIRS } from "./fixtures/color-fidelity-corpus";

const HERE = dirname(fileURLToPath(import.meta.url));
// The harness data sink — the gated engine measurement the PUBLISHED artifact
// (`docs/color-fidelity.md`) renders from. ONE measurement, gated AND published.
const DATA_OUT = join(HERE, "..", "docs", "color-fidelity-data.json");
const measured: Array<{
    from: string;
    to: string;
    note: string;
    deltaE: number;
}> = [];

// ── the ΔE-OK domain (the perceptual distance the harness reads) ──────────────
const A_MIN = COLOR_SPACE_RANGES.oklab.a.number.min;
const A_MAX = COLOR_SPACE_RANGES.oklab.a.number.max;
const B_MIN = COLOR_SPACE_RANGES.oklab.b.number.min;
const B_MAX = COLOR_SPACE_RANGES.oklab.b.number.max;

const rawOklab = (c: Color): [number, number, number] => {
    const ok = color2(c, "oklab") as unknown as {
        l: number;
        a: number;
        b: number;
    };
    return [ok.l, scale(ok.a, 0, 1, A_MIN, A_MAX), scale(ok.b, 0, 1, B_MIN, B_MAX)];
};

const dE = (c1: Color, c2: Color): number => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return deltaEOK(L1, a1, b1, L2, a2, b2);
};

/** A CSS color string → a value.js `Color`, parsed through the engine's path. */
const parseColor = (cssColor: string): Color => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({ duration: 1 }, el);
    a.fromString(
        `@keyframes z { 0% { color: ${cssColor} } 100% { color: ${cssColor} } }`,
    );
    const vu = (a.parsedVars[0]!["color"] as ValueUnit[]).find(
        (v) => v.unit === "color",
    )!;
    return normalizeColorUnit(vu as never).value as unknown as Color;
};

/**
 * The midpoint of kf's ENGINE playback: parse the two-stop background-color
 * track, sample at t=0.5, and lift the rendered color to a value.js `Color`.
 * This is what the engine WOULD paint at the animation's midpoint.
 */
const kfMidpoint = (from: string, to: string): Color => {
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
            const reference = mixColors(a, b, 0.5, 0.5, "oklab");

            // kf's engine-rendered midpoint.
            const mid = kfMidpoint(from, to);

            const delta = dE(mid, reference);
            measured.push({ from, to, note, deltaE: delta });

            // CONFORMANCE: kf's oklab lerp is perceptually indistinguishable
            // from the CSS Color 4 reference — under the just-noticeable
            // difference. A lossy (RGB-mixed) midpoint would exceed the JND.
            expect(delta).toBeLessThan(DELTA_E_OK_JND);
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
                        jnd: DELTA_E_OK_JND,
                        space: "oklab",
                        reference: "CSS Color 4 — color-mix(in oklab) midpoint",
                        producer: "@mkbabb/value.js deltaEOK + mixColors",
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
        const reference = mixColors(a, b, 0.5, 0.5, "oklab");

        // The sRGB channel-average midpoint (what Motion/anime would render).
        const srgbMid = parseColor("#800080"); // (255+0)/2, (0+0)/2, (0+255)/2

        // Sanity: ΔE of a color with itself is 0 (the metric is well-formed).
        expect(dE(a, a)).toBe(0);

        const srgbDelta = dE(srgbMid, reference);
        // The naive sRGB midpoint is perceptually distinguishable from the spec
        // reference — well over the JND. If this ever drops under the JND the
        // negative control is dead and the conformance assert above is vacuous.
        expect(srgbDelta).toBeGreaterThan(DELTA_E_OK_JND);
    });
});
