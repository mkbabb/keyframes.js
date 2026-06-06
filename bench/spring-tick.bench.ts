/**
 * spring-tick.bench.ts — `SpringProgress.tickDt` throughput (F.W1 S4b,
 * `a-test-quality §4`).
 *
 * The orchestration tier's hot stepper (`spring.ts:289` `tickDt`), shipped
 * E.W10 with ZERO throughput coverage — the highest-profile E public API with
 * no bench. `tickDt` delegates to the analytic `_stepSeconds` → `evaluateAt`,
 * whose three branches (underdamped ζ<1 / critically damped ζ=1 / overdamped
 * ζ>1) take genuinely different transcendental paths, so each is benched.
 *
 * A long settle window (a far target + tiny thresholds) keeps the spring
 * integrating across the whole frame loop rather than snapping settled early.
 * Imports `SpringProgress` from the VALUE module `spring`, never the barrel.
 */
import { bench, describe } from "vitest";
import { SpringProgress } from "../src/animation/spring";

const FRAMES = 600;
const DT = 16.667; // a 60Hz step, the unit `tickDt` takes (milliseconds)

/**
 * A spring tuned to integrate for the whole window: a slow response + tiny
 * settle thresholds mean `checkSettled` never trips inside `FRAMES` steps, so
 * every `tickDt` exercises the analytic solver rather than the settled
 * fast-return.
 */
const makeSpring = (dampingFraction: number) =>
    new SpringProgress({
        response: 100,
        dampingFraction,
        settleThreshold: 1e-12,
        velocitySettleThreshold: 1e-12,
    });

describe("SpringProgress.tickDt throughput (analytic solver)", () => {
    const regimes: ReadonlyArray<readonly [string, number]> = [
        ["underdamped (ζ=0.5)", 0.5],
        ["critically damped (ζ=1)", 1],
        ["overdamped (ζ=1.5)", 1.5],
    ];

    for (const [label, zeta] of regimes) {
        bench(`${label} · ${FRAMES} tickDt steps`, () => {
            const spring = makeSpring(zeta);
            spring.target = 1000;
            for (let f = 0; f < FRAMES; f++) {
                spring.tickDt(DT);
            }
        });
    }

    // The live-target re-seat path: each `target` set re-seats the closed-form
    // solution from the current (x, v) state (`reseatTarget` → `evaluateAt`),
    // the gesture-follow / drag shape the spring exists for.
    bench(`live re-seat · ${FRAMES} target changes + ticks`, () => {
        const spring = makeSpring(0.86);
        for (let f = 0; f < FRAMES; f++) {
            spring.target = (f % 2) * 1000;
            spring.tickDt(DT);
        }
    });
});
