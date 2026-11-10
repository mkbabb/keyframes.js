/**
 * Peer asks (6.5.0): `settleTime`, the `"settle"` span, and seeded spring curves.
 *
 * Falsifiers, all against the PUBLIC barrel:
 *  1. `settleTime` is the LAST exit of the integrator's own trajectory from the
 *     rest envelope (a fine scan of `SpringProgress.tickToTime`, not its settle
 *     flag), over presets × initial velocities × both envelopes.
 *  2. With `velocitySettleThreshold: Infinity` it reproduces glass's settle clock
 *     (last `|1 − x| ≥ band` on a 0.5 ms grid) to within the grid.
 *  3. Edge cases: ζ = 0, ζ across 1, overdamped, bad input.
 *  4. `maxDuration: "settle"` spans `settleTime`, `.fn` and `.css` agree, and the
 *     pinned end jumps by at most `settleThreshold`.
 *  5. `initialVelocity` seeds the curve: it is the closed form from (0, v0), its
 *     slope at u = 0 is v0 × T, and v0 = 0 is today's curve byte for byte.
 */
import { describe, expect, it } from "vitest";
import * as kf from "../../src/animation";

type Settle = (opts: Record<string, number>) => number;
const settleTime = (kf as unknown as { settleTime: Settle }).settleTime;

const PRESETS: Array<[number, number]> = [
    [0.5, 0.45],
    [0.55, 0.3],
    [0.35, 0.8],
    [0.5, 0.86],
    [0.6, 1],
    [0.4, 1.6],
    [0.5, 2],
];
const VELOCITIES = [0, -3, 2, 8];

/** The integrator's trajectory on (0 → 1, v0), never flagged settled. */
function trajectory(response: number, dampingFraction: number, v0: number) {
    const spring = new kf.SpringProgress({
        response,
        dampingFraction,
        initial: 0,
        initialVelocity: v0,
        settleThreshold: 1e-300,
        velocitySettleThreshold: 1e-300,
    });
    spring.target = 1;
    return (t: number): [number, number] => {
        spring.tickToTime(t);
        return [spring.value, spring.velocity];
    };
}

/** Reference: the last grid time the trajectory is outside the envelope. */
function lastExit(
    at: (t: number) => [number, number],
    eps: number,
    epsV: number,
    horizon: number,
    step: number,
): number {
    let last = 0;
    for (let t = 0; t <= horizon; t += step) {
        const [x, v] = at(t);
        if (!(Math.abs(x - 1) < eps && Math.abs(v) < epsV)) last = t;
    }
    return last;
}

describe("settleTime", () => {
    it("is exported from the public barrel", () => {
        expect(typeof settleTime).toBe("function");
    });

    for (const [response, dampingFraction] of PRESETS) {
        for (const v0 of VELOCITIES) {
            for (const epsV of [1e-3, Infinity]) {
                it(`is the trajectory's last exit (${response}/${dampingFraction}, v0=${v0}, εv=${epsV})`, () => {
                    const T = settleTime({
                        response,
                        dampingFraction,
                        initialVelocity: v0,
                        velocitySettleThreshold: epsV,
                    });
                    const step = 1e-5;
                    const ref = lastExit(
                        trajectory(response, dampingFraction, v0),
                        1e-3,
                        epsV,
                        T * 1.5 + response,
                        step,
                    );
                    expect(Math.abs(T - ref)).toBeLessThan(2 * step);
                });
            }
        }
    }

    it("is never earlier than the integrator's settle flag allows, and the flag can fire early", () => {
        // 0.5/0.45 rings back out of the envelope after a 60 fps frame lands inside it.
        const T = settleTime({ response: 0.5, dampingFraction: 0.45 });
        const spring = new kf.SpringProgress({ response: 0.5, dampingFraction: 0.45 });
        spring.target = 1;
        let t = 0;
        while (!spring.settled) {
            spring.tickDt(1000 / 60);
            t += 1 / 60;
        }
        expect(t).toBeLessThan(T + 1 / 60);
        expect(T).toBeGreaterThan(1.6);
        expect(T).toBeLessThan(1.62);
    });

    it("reproduces glass's position-only settle clock", () => {
        for (const [response, dampingFraction] of PRESETS) {
            for (const band of [1e-3, 5e-3]) {
                const at = trajectory(response, dampingFraction, 0);
                let glass = 0;
                for (let t = 0; t < 10; t += 0.0005) {
                    if (Math.abs(1 - at(t)[0]) >= band) glass = t;
                }
                const T = settleTime({
                    response,
                    dampingFraction,
                    settleThreshold: band,
                    velocitySettleThreshold: Infinity,
                });
                expect(Math.abs(T - glass)).toBeLessThan(0.0006);
            }
        }
    });

    it("overdamped: the slow mode sets the time", () => {
        expect(settleTime({ response: 0.5, dampingFraction: 2 })).toBeCloseTo(2.434, 3);
    });

    it("is continuous across critical damping", () => {
        const a = settleTime({ response: 0.5, dampingFraction: 0.999 });
        const b = settleTime({ response: 0.5, dampingFraction: 1 });
        const c = settleTime({ response: 0.5, dampingFraction: 1.001 });
        expect(a).toBeCloseTo(0.9452, 3);
        expect(b).toBeCloseTo(0.9483, 3);
        expect(c).toBeCloseTo(0.9514, 3);
    });

    it("undamped: Infinity, or 0 when the motion fits inside the envelope", () => {
        expect(settleTime({ response: 0.5, dampingFraction: 0 })).toBe(Infinity);
        expect(
            settleTime({
                response: 0.5,
                dampingFraction: 0,
                settleThreshold: 2,
                velocitySettleThreshold: 100,
            }),
        ).toBe(0);
    });

    it("velocity against the target takes longer", () => {
        const base = settleTime({ response: 0.5, dampingFraction: 1 });
        expect(settleTime({ response: 0.5, dampingFraction: 1, initialVelocity: -3 })).toBeGreaterThan(base);
    });

    it("throws RangeError on bad input", () => {
        const bad: Array<Record<string, number>> = [
            { response: 0, dampingFraction: 0.5 },
            { response: Infinity, dampingFraction: 0.5 },
            { response: 0.5, dampingFraction: -0.1 },
            { response: 0.5, dampingFraction: NaN },
            { response: 0.5, dampingFraction: 0.5, settleThreshold: 0 },
            { response: 0.5, dampingFraction: 0.5, settleThreshold: NaN },
            { response: 0.5, dampingFraction: 0.5, velocitySettleThreshold: 0 },
            { response: 0.5, dampingFraction: 0.5, initialVelocity: Infinity },
        ];
        for (const opts of bad) expect(() => settleTime(opts)).toThrow(RangeError);
    });
});

describe('maxDuration: "settle"', () => {
    const settle = "settle" as unknown as number;

    for (const [response, dampingFraction] of PRESETS) {
        it(`spans settleTime; .fn and .css agree (${response}/${dampingFraction})`, () => {
            const T = settleTime({ response, dampingFraction });
            const lut = kf.springTimingLUT({ response, dampingFraction, maxDuration: settle });
            expect(Array.from(lut)).toEqual(
                Array.from(kf.springTimingLUT({ response, dampingFraction, maxDuration: T })),
            );
            const easing = kf.springTimingFunction({ response, dampingFraction, maxDuration: settle });
            expect(easing.css).toBe(
                kf.springLinearStops({ response, dampingFraction, maxDuration: settle }),
            );
            expect(easing.css).toBe(kf.springLinearStops({ response, dampingFraction, maxDuration: T }));
            // The pinned end stop jumps by at most the envelope.
            const [x] = trajectory(response, dampingFraction, 0)(T);
            expect(Math.abs(1 - x)).toBeLessThanOrEqual(1e-3);
        });
    }

    it("throws for an undamped spring", () => {
        expect(() =>
            kf.springTimingLUT({ response: 0.5, dampingFraction: 0, maxDuration: settle }),
        ).toThrow(RangeError);
    });
});

describe("seeded spring curves (initialVelocity)", () => {
    const seed = (o: object) => o as { response: number; dampingFraction: number };

    it("v0 = 0 is today's curve byte for byte", () => {
        for (const [response, dampingFraction] of PRESETS) {
            expect(
                Array.from(kf.springTimingLUT(seed({ response, dampingFraction, initialVelocity: 0 }))),
            ).toEqual(Array.from(kf.springTimingLUT({ response, dampingFraction })));
            expect(kf.springTimingFunction(seed({ response, dampingFraction, initialVelocity: 0 })).css).toBe(
                kf.springTimingFunction({ response, dampingFraction }).css,
            );
        }
    });

    for (const [response, dampingFraction] of PRESETS) {
        for (const v0 of [-3, 2, 8]) {
            it(`is the closed form from (0, v0) (${response}/${dampingFraction}, v0=${v0})`, () => {
                const n = 256;
                const T = response * 4;
                const lut = kf.springTimingLUT(
                    seed({ response, dampingFraction, sampleCount: n, initialVelocity: v0, settleThreshold: 1e-9 }),
                );
                const at = trajectory(response, dampingFraction, v0);
                for (let i = 1; i < n; i++) {
                    expect(lut[i]).toBeCloseTo(at((i / n) * T)[0], 8);
                }
                // (the settle pin moves a sample by < settleThreshold = 1e-9)
                // Slope at u = 0 is v0 × T: the curve bends round, no corner.
                const fine = kf.springTimingLUT(
                    seed({ response, dampingFraction, sampleCount: 4096, initialVelocity: v0 }),
                );
                expect((fine[1]! - fine[0]!) * 4096).toBeCloseTo(v0 * T, 0);
                if (v0 < 0) expect(Math.min(...lut)).toBeLessThan(0);
            });
        }
    }

    it("forwards the seed to .css and to springLinearStops", () => {
        const opts = seed({ response: 0.5, dampingFraction: 0.86, initialVelocity: -2 });
        const easing = kf.springTimingFunction(opts);
        expect(easing.css).toBe(kf.springLinearStops(opts));
        expect(easing.css).not.toBe(kf.springLinearStops({ response: 0.5, dampingFraction: 0.86 }));
    });

    it('"settle" includes the seed', () => {
        const opts = seed({ response: 0.5, dampingFraction: 1, initialVelocity: -3, maxDuration: "settle" });
        const T = settleTime({ response: 0.5, dampingFraction: 1, initialVelocity: -3 });
        expect(kf.springTimingFunction(opts).css).toBe(
            kf.springLinearStops(seed({ response: 0.5, dampingFraction: 1, initialVelocity: -3, maxDuration: T })),
        );
        const [x] = trajectory(0.5, 1, -3)(T);
        expect(Math.abs(1 - x)).toBeLessThanOrEqual(1e-3);
    });
});
