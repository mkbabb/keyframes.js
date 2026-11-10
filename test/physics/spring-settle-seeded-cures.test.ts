/**
 * PR #21 adversary cures (6.5.0): the falsifiers for the six defects the check
 * found in `settleTime`, `maxDuration: "settle"` and seeded curves.
 *
 *  1. A seeded curve carries the glide's speed across a reversal at the DEFAULT
 *     sample counts: the first `linear()` segment of `.css` and the first piece
 *     of `.fn` both leave u = 0 at `initialVelocity × T` (within 2 %), and a
 *     Gregg-shaped reversal keeps its px/s.
 *  2. `"settle"` is exactly `settleTime(sameOptions)`, so a consumer reads the
 *     span by calling `settleTime` with the options it passed the curve.
 *  3. The README's reduced-motion rule: at intensity `s` a live spring with
 *     absolute thresholds settles at `settleTime` over `s · D`.
 *  4. An exit from the envelope shorter than the scan step is not missed.
 *  5. A spring damped past the solver's range does not report "undamped".
 *  6. Non-finite ζ and a non-finite `settleThreshold` throw `RangeError`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import * as kf from "../../src/animation";

type Settle = (opts: Record<string, number>) => number;
const settleTime = (kf as unknown as { settleTime: Settle }).settleTime;
type CurveOpts = { response: number; dampingFraction: number };
const curve = (o: object) => o as CurveOpts;
const SETTLE = "settle" as unknown as number;

const PRESETS: Array<[number, number]> = [
    [0.35, 0.9],
    [0.5, 0.86],
    [0.45, 0.75],
    [0.5, 0.45],
    [0.6, 1],
    [0.5, 2],
];

/** The [u, value] knots of a CSS `linear()` string (implicit 0 / 1 ends filled). */
function linearKnots(css: string): Array<[number, number]> {
    const parts = css.slice("linear(".length, -1).split(", ");
    return parts.map((p, i) => {
        const [v, pct] = p.split(" ");
        const u = pct === undefined ? (i === 0 ? 0 : 1) : parseFloat(pct) / 100;
        return [u, parseFloat(v!)];
    });
}

describe("1. seeded curves carry the speed at the default sample counts", () => {
    for (const [response, dampingFraction] of PRESETS) {
        for (const v0 of [-6, -2, 3, 9]) {
            it(`first segment leaves at v0·T (${response}/${dampingFraction}, v0=${v0})`, () => {
                const opts = curve({ response, dampingFraction, initialVelocity: v0, maxDuration: SETTLE });
                const T = settleTime({ response, dampingFraction, initialVelocity: v0 });
                const easing = kf.springTimingFunction(opts);
                const want = v0 * T;
                // .css: the first linear() segment's slope.
                const knots = linearKnots(easing.css!);
                const [u1, x1] = knots[1]!;
                expect(Math.abs(x1 / u1 - want)).toBeLessThanOrEqual(0.02 * Math.abs(want));
                // .fn: the slope off u = 0.
                const du = 1e-7;
                expect(Math.abs(easing.fn(du) / du - want)).toBeLessThanOrEqual(0.02 * Math.abs(want));
                // .fn still agrees with the LUT at its own knots.
                const lut = kf.springTimingLUT(opts);
                const n = lut.length - 1;
                for (let i = 1; i <= n; i++) expect(easing.fn(i / n)).toBe(lut[i]);
                // knots stay strictly increasing (a valid linear()).
                for (let i = 1; i < knots.length; i++) {
                    expect(knots[i]![0]).toBeGreaterThan(knots[i - 1]![0]);
                }
            });
        }
    }

    it("a Gregg-shaped reversal keeps its px/s (100 → 400 px, back at 60 %)", () => {
        for (const [response, dampingFraction] of PRESETS.slice(0, 3)) {
            const glide = new kf.SpringProgress({
                response,
                dampingFraction,
                initial: 100,
                settleThreshold: 1e-300,
                velocitySettleThreshold: 1e-300,
            });
            glide.target = 400;
            let t = 0;
            while (glide.value < 280) glide.tickToTime((t += 1e-4));
            const x = glide.value;
            const v = glide.velocity;
            const D = 100 - x;
            const opts = curve({ response, dampingFraction, initialVelocity: v / D, maxDuration: SETTLE });
            const T = settleTime({ response, dampingFraction, initialVelocity: v / D });
            const P = T; // play over the span itself
            const easing = kf.springTimingFunction(opts);
            const [u1, x1] = linearKnots(easing.css!)[1]!;
            const cssSpeed = ((x1 / u1) * D) / P;
            const du = 1e-7;
            const fnSpeed = ((easing.fn(du) / du) * D) / P;
            expect(Math.abs(cssSpeed - v)).toBeLessThanOrEqual(0.02 * Math.abs(v));
            expect(Math.abs(fnSpeed - v)).toBeLessThanOrEqual(0.02 * Math.abs(v));
            glide.dispose();
        }
    });
});

describe('2. "settle" is settleTime of the same options', () => {
    const cases = [
        { response: 0.3, dampingFraction: 0.88, settleThreshold: 0.02 },
        { response: 0.5, dampingFraction: 0.45, settleThreshold: 0.01 },
        { response: 0.4, dampingFraction: 1.5, settleThreshold: 0.05, initialVelocity: -2 },
        { response: 0.5, dampingFraction: 0.86 },
    ];
    for (const opts of cases) {
        it(JSON.stringify(opts), () => {
            const T = settleTime(opts);
            const settle = curve({ ...opts, maxDuration: SETTLE });
            const fixed = curve({ ...opts, maxDuration: T });
            expect(Array.from(kf.springTimingLUT(settle))).toEqual(Array.from(kf.springTimingLUT(fixed)));
            expect(kf.springLinearStops(settle)).toBe(kf.springLinearStops(fixed));
            expect(kf.springTimingFunction(settle).css).toBe(kf.springTimingFunction(fixed).css);
        });
    }
});

describe("3. reduced-motion intensity settles over the scaled distance", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("intensity 0.3, absolute thresholds: settleTime over s · D", () => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            configurable: true,
            value: (query: string) => ({
                matches: query.includes("prefers-reduced-motion"),
                media: query,
                onchange: null,
                addListener() {},
                removeListener() {},
                addEventListener() {},
                removeEventListener() {},
                dispatchEvent: () => false,
            }),
        });
        try {
            const s = 0.3;
            const D = 1;
            const eps = 1e-3;
            const spring = new kf.SpringProgress({
                response: 0.5,
                dampingFraction: 0.86,
                initial: 0,
                respectReducedMotion: s,
                settleThreshold: 1e-300,
                velocitySettleThreshold: 1e-300,
            });
            spring.target = D;
            // The live trajectory travels to s·D; its last exit from the absolute envelope.
            let last = 0;
            const step = 1e-4;
            for (let t = 0; t <= 3; t += step) {
                spring.tickToTime(t);
                const x = spring.value;
                if (!(Math.abs(x - s * D) < eps && Math.abs(spring.velocity) < eps)) last = t;
            }
            spring.dispose();
            const full = settleTime({ response: 0.5, dampingFraction: 0.86, settleThreshold: eps / D, velocitySettleThreshold: eps / D });
            const scaled = settleTime({
                response: 0.5,
                dampingFraction: 0.86,
                settleThreshold: eps / (s * D),
                velocitySettleThreshold: eps / (s * D),
            });
            expect(Math.abs(scaled - last)).toBeLessThanOrEqual(2 * step);
            expect(scaled).toBeLessThan(full); // sooner, not "unchanged"
        } finally {
            Object.defineProperty(window, "matchMedia", {
                writable: true,
                configurable: true,
                value: (query: string) => ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener() {},
                    removeListener() {},
                    addEventListener() {},
                    removeEventListener() {},
                    dispatchEvent: () => false,
                }),
            });
        }
    });
});

describe("4. a brief exit shorter than the scan step is not missed", () => {
    // 0.5 / 0.45, position only: set the band 1e-12 below each late peak, so the
    // spring pokes out for ~1 µs around the peak, far under response/4096.
    const response = 0.5;
    const dampingFraction = 0.45;
    const omega = (2 * Math.PI) / response;
    const omegaD = omega * Math.sqrt(1 - dampingFraction ** 2);
    for (const k of [2, 3, 4, 5]) {
        it(`peak ${k}`, () => {
            const spring = new kf.SpringProgress({
                response,
                dampingFraction,
                initial: 0,
                settleThreshold: 1e-300,
                velocitySettleThreshold: 1e-300,
            });
            spring.target = 1;
            // Locate the peak on the integrator itself (golden search near k·π/ωd).
            let a = (k * Math.PI) / omegaD - 0.01;
            let b = (k * Math.PI) / omegaD + 0.01;
            const g = (t: number) => {
                spring.tickToTime(t);
                return Math.abs(spring.value - 1);
            };
            for (let i = 0; i < 200; i++) {
                const m1 = a + (b - a) / 3;
                const m2 = b - (b - a) / 3;
                if (g(m1) < g(m2)) a = m1;
                else b = m2;
            }
            const tp = (a + b) / 2;
            const amp = g(tp);
            spring.dispose();
            const T = settleTime({
                response,
                dampingFraction,
                settleThreshold: amp - 1e-12,
                velocitySettleThreshold: Infinity,
            });
            // The exit is ~±1 µs around the peak; the last exit sits on it.
            expect(Math.abs(T - tp)).toBeLessThan(1e-5);
        });
    }
});

describe("5. damping past the solver's range is not called undamped", () => {
    for (const dampingFraction of [1e8, 1e12]) {
        it(`ζ = ${dampingFraction}`, () => {
            expect(settleTime({ response: 0.5, dampingFraction })).toBe(Infinity);
            let message = "";
            try {
                kf.springTimingLUT(curve({ response: 0.5, dampingFraction, maxDuration: SETTLE }));
            } catch (e) {
                message = (e as Error).message;
            }
            expect(message).toMatch(/never settles/);
            expect(message).not.toMatch(/^an undamped spring/);
            expect(message).toMatch(/floating-point/);
        });
    }
    it("ζ = 0 still names the undamped case", () => {
        expect(() =>
            kf.springTimingLUT(curve({ response: 0.5, dampingFraction: 0, maxDuration: SETTLE })),
        ).toThrow(/undamped/);
    });
});

describe("6. degenerate inputs throw", () => {
    it("ζ = Infinity", () => {
        expect(() => settleTime({ response: 0.5, dampingFraction: Infinity })).toThrow(RangeError);
    });
    it("settleThreshold = Infinity", () => {
        expect(() => settleTime({ response: 0.5, dampingFraction: 0.86, settleThreshold: Infinity })).toThrow(
            RangeError,
        );
        expect(() =>
            kf.springTimingLUT(
                curve({ response: 0.5, dampingFraction: 0.86, settleThreshold: Infinity, maxDuration: SETTLE }),
            ),
        ).toThrow(RangeError);
    });
    it('"settle" never yields a zero span (a step curve)', () => {
        // Starts inside a band ≥ 1 and the spring barely moves: no span to take.
        expect(() =>
            kf.springTimingLUT(
                curve({ response: 0.5, dampingFraction: 1e12, settleThreshold: 2, maxDuration: SETTLE }),
            ),
        ).toThrow(RangeError);
    });
});
