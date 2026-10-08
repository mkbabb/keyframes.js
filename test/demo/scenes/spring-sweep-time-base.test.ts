/**
 * X.KF.W13X.esc3 — ESC-spring-1 (KFA-191, KF-W13.md addendum (g), COHESION §0er):
 * ONE TIME BASE for the Sweep.
 *
 * The banked defect: the stage trace labels its time axis with the settle
 * horizon (`0` … `2000 ms` = 4 × response at the born response 0.5 s) while the
 * Sweep's sampler ran a fixed 1400 ms cycle of two 700 ms legs, and the
 * channel's `direction: alternate` read as a sawtooth on the scrubber (the thumb
 * ran 0 → 1400 and jumped back). The ruling: the sampler legs are sized to the
 * horizon the axis labels, and `alternate` is folded, so the scrubber reads one
 * forward sweep of the horizon, then its mirror, on the same labelled axis.
 *
 * (1) the Sweep channel's iteration (one leg) and the transport rail's scale
 *     equal the labelled horizon, at the born response and after a response
 *     change;
 * (2) over one played cycle the scrubber position rises 0 → horizon over the
 *     first horizon of clock time and falls back over the second (no jump), and
 *     the channel clock reads the same axis time as the thumb;
 * (3) the sampled value is the timing function AT the axis time the scrubber
 *     shows (the sampler and the axis never disagree), in both legs.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";

import { springTimingFunction } from "@mkbabb/keyframes.js";
import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { useSceneMachine } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";

/** The labelled horizon, computed here from the ruling's own figure
 *  (4 × response, ms) — independent of the module under test. */
const labelledHorizonMs = (response: number) => Math.round(response * 4 * 1000);

function parkPausedOnSpring() {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: "spring" });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PAUSE" });
    return machine;
}

/** A driven rAF clock: `frame(ms)` advances performance.now by `ms` and runs one frame. */
function drivenClock() {
    let clock = 1000;
    let queue = new Map<number, FrameRequestCallback>();
    let id = 1;
    const prevRaf = window.requestAnimationFrame;
    const prevCancel = window.cancelAnimationFrame;
    const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => clock);
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
        queue.set(id, cb);
        return id++;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((h: number) => {
        queue.delete(h);
    }) as typeof window.cancelAnimationFrame;
    const frame = (ms = 16) => {
        clock += ms;
        const cur = queue;
        queue = new Map();
        for (const cb of cur.values()) cb(clock);
    };
    const restore = () => {
        nowSpy.mockRestore();
        window.requestAnimationFrame = prevRaf;
        window.cancelAnimationFrame = prevCancel;
    };
    return { frame, restore };
}

/** The scrubber's displayed time, as SpringScene feeds the ribbon (`currentT`
 *  = the position channel × the rail's scale). The scale is the demo's
 *  published leg when it has one, else the channel clock's duration. */
function railOf(demo: ReturnType<typeof useSpringDemo>) {
    const d = demo as { sweepLegMs?: { value: number } };
    const scale = () => d.sweepLegMs?.value ?? demo.springEditAnim.options.duration;
    return { scale, currentT: () => demo.scrubberPhase.value * scale() };
}

beforeAll(async () => {
    await warmKfEngine();
});

describe("(1) the Sweep leg and the rail's scale are the labelled horizon", () => {
    it("at the born response and after a response change", async () => {
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            const rail = railOf(demo);
            const h0 = labelledHorizonMs(demo.response.value);
            expect(h0).toBe(2000);
            expect(demo.springEditAnim.options.duration, "the channel's leg").toBe(h0);
            expect(rail.scale(), "the rail's scale").toBe(h0);

            demo.response.value = 0.8;
            await Promise.resolve();
            const h1 = labelledHorizonMs(0.8);
            expect(demo.springEditAnim.options.duration, "the leg follows the horizon").toBe(h1);
            expect(rail.scale(), "the rail follows the horizon").toBe(h1);
        } finally {
            app.unmount();
        }
    });
});

describe("(2)(3) one played cycle: a forward sweep of the horizon, then its mirror, on the same axis", () => {
    it("the thumb rises over one horizon and falls over the next, and the sampler reads f(axis time)", () => {
        const clock = drivenClock();
        const machine = parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            const rail = railOf(demo);
            const H = labelledHorizonMs(demo.response.value);
            const fn = springTimingFunction({
                response: demo.response.value,
                dampingFraction: demo.dampingFraction.value,
            });

            demo.play();
            expect(machine.status.value).toBe("playing");
            clock.frame(0); // seeds the loop's clock (dt 0)

            const STEP = 20;
            const samples: { ms: number; t: number; clockT: number; sampled: number }[] = [];
            for (let ms = STEP; ms <= 2 * H; ms += STEP) {
                clock.frame(STEP);
                samples.push({
                    ms,
                    t: rail.currentT(),
                    clockT: demo.springEditAnim.t,
                    sampled: demo.springLive.sampled,
                });
            }

            // The axis time the ruling expects at each clock instant: the
            // forward leg reads `ms`, the mirror leg `2H − ms`.
            const expected = (ms: number) => (ms <= H ? ms : 2 * H - ms);

            let worstAxis = 0;
            let worstClock = 0;
            let worstSampled = 0;
            let maxJump = 0;
            let prev = 0;
            for (const s of samples) {
                const e = expected(s.ms);
                worstAxis = Math.max(worstAxis, Math.abs(s.t - e));
                worstClock = Math.max(worstClock, Math.abs(s.clockT - s.t));
                worstSampled = Math.max(worstSampled, Math.abs(s.sampled - fn.fn(s.t / H)));
                maxJump = Math.max(maxJump, Math.abs(s.t - prev));
                prev = s.t;
            }
            const peak = Math.max(...samples.map((s) => s.t));

            expect(peak, "the forward sweep reaches the labelled horizon").toBeCloseTo(H, 0);
            expect(worstAxis, "thumb = forward sweep, then its mirror (ms)").toBeLessThan(1);
            expect(maxJump, "no sawtooth jump on the scrubber (ms per 20 ms frame)").toBeLessThanOrEqual(STEP + 1);
            expect(worstClock, "the channel clock reads the thumb's axis time (ms)").toBeLessThan(1);
            expect(worstSampled, "the sampler reads f(axis time), both legs").toBeLessThan(1e-6);
        } finally {
            app.unmount();
            clock.restore();
        }
    });
});
