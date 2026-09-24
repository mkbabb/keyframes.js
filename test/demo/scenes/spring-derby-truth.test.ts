/**
 * X.KF.W11.c — G-KFW11-3's witness (the spring packet).
 *
 * Born RED against `ba12b2ba`. The gate's four cases are the home record's own
 * (`kf-SpringTarget.md`, the NO-WAVE-OWNER test obligation):
 *
 *   (a) C-1 — a paused-entry rail tap MOVES THE BALL. On the scene's documented
 *       entry state (`autoPlays: false`, machine `paused`) `reseat` armed a loop
 *       whose first frame self-terminated before the solver ticked, so the ghost
 *       marker and `aria-valuenow` responded while the protagonist stayed parked.
 *       The other half of the same contract is asserted here too, because a cure
 *       that bought motion by dispatching PLAY would re-open VERDICT #19: the
 *       SAMPLER SWEEP must stay parked while the transport rests.
 *
 *   (b) M-3 — the trace's first/last plotted x = 0/100. **NOT WRITTEN HERE, and
 *       deliberately not skipped.** The cure it witnesses is `M-4→M-3`, whose
 *       bytes are the parser, the two dead guards and the regex in
 *       `SpringTrace.vue` — a file §Bounds `:118` assigns to unit `.e`, not to
 *       this unit, while §Commit-plan 4 assigns the COMMIT to `.c`. This seat
 *       does not write outside its writable set to resolve a conflict between two
 *       sections of the spec, and a `test.skip` standing in for a cure that was
 *       never authorized would be worse than its absence. The case is returned
 *       with the family as ESCALATION KF11-E(c1); whichever seat lands the swap
 *       lands this case beside it.
 *
 *   (c) M-5 — a double-tap at t≈1500 ms leaves the overlay mounted through the
 *       race. The guard (`derbyRunning`) cleared at ~1340 ms while the flag the
 *       overlay renders on (`derbyActive`) cleared at ~2040 ms, so a re-entry in
 *       that 700 ms window passed the guard and `derbyTimers.length = 0` orphaned
 *       the pending hide-timer — which then unmounted the lanes mid-race.
 *
 *   (d) D-2 — the settle confirmation belongs at the TARGET, not at value 1.
 *       Two limbs: the field no longer always ends at 0 (the derby restores the
 *       pose it interrupted), and the pulse rides the target-positioned marker
 *       rather than the rule pinned to one end of the axis.
 *
 * §3a note — the M-5 race is reproduced under a DETERMINISTIC harness (a
 * controllable rAF queue, the idiom this tree already owns at
 * `scene-raf-leak.test.ts`, plus vitest fake timers), so the three-reproduction
 * halt condition is not reached and nothing is escalated on that account.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { useSpringDerby } from "../../../demo/scenes/spring/useSpringDerby";
import { SPRING_PRESETS } from "../../../demo/scenes/spring/springPresets";
import type { SpringTrack } from "../../../demo/scenes/spring/useSpringHotPath";
import { SpringProgress } from "../../../src/animation/physics/spring";
import { useSceneMachine } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";

const SPRING_TARGET_SRC = readFileSync(
    resolve(process.cwd(), "demo/scenes/spring/SpringTarget.vue"),
    "utf8",
);

/**
 * A controllable rAF queue: `requestAnimationFrame` enqueues, `flush()` drains
 * the CURRENT queue once so a loop can reschedule into the next. The same shape
 * `scene-raf-leak.test.ts` established — the loop under test is driven, never
 * raced.
 */
function installControllableRaf() {
    let nextId = 1;
    let queue = new Map<number, FrameRequestCallback>();
    const prevRaf = (window as any).requestAnimationFrame;
    const prevCancel = (window as any).cancelAnimationFrame;

    (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
        const id = nextId++;
        queue.set(id, cb);
        return id;
    };
    (window as any).cancelAnimationFrame = (id: number) => {
        queue.delete(id);
    };

    let clock = 0;
    return {
        /** Drain one frame; returns how many callbacks ran. */
        flush(dt = 16): number {
            clock += dt;
            const current = queue;
            queue = new Map();
            for (const cb of current.values()) cb(clock);
            return current.size;
        },
        /** Drain up to `n` frames, stopping early once the loop stops asking. */
        run(n: number, dt = 16): number {
            let frames = 0;
            for (let i = 0; i < n; i++) {
                if (this.flush(dt) === 0) break;
                frames++;
            }
            return frames;
        },
        pending(): number {
            return queue.size;
        },
        restore() {
            (window as any).requestAnimationFrame = prevRaf;
            (window as any).cancelAnimationFrame = prevCancel;
        },
    };
}

/** Park the shared scene machine on the spring scene, PAUSED — the entry state
 *  the scene's own `autoPlays: false` expose declares and C-1 is charged at. */
function parkPausedOnSpring() {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: "spring" });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PAUSE" });
    return machine;
}

describe("X.KF.W11.c (a) — C-1: a paused-entry rail tap moves the ball", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("runs the solver to settle on a re-seat while the machine rests, and never starts the sweep", () => {
        const raf = installControllableRaf();
        const machine = parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            expect(machine.status.value).toBe("paused");

            // Rest on entry is the posture superlative 5 protects and the cure
            // must not spend: the mount arms the loop, and the loop's first frame
            // finds no intent and stops.
            raf.flush();
            expect(raf.pending()).toBe(0);

            const phaseAtRest = demo.springLive.phase;
            const valueAtRest = demo.springLive.value;

            // The rail's gesture. NOT the transport's.
            demo.reseat(0.5);
            expect(raf.pending()).toBe(1);

            const frames = raf.run(400);
            expect(frames).toBeGreaterThan(1);

            // THE CASE: the protagonist actually travelled, on a machine that
            // never left `paused`.
            expect(machine.status.value).toBe("paused");
            expect(demo.springLive.value).not.toBe(valueAtRest);
            expect(demo.springLive.value).toBeCloseTo(0.5, 2);
            expect(demo.springLive.settled).toBe(true);

            // The other half of the contract: play-intent was NOT dispatched, so
            // the unbounded sampler sweep is exactly where it was left.
            expect(demo.springLive.phase).toBe(phaseAtRest);

            // And the chase is self-terminating — the loop gave the frames back.
            expect(raf.pending()).toBe(0);
        } finally {
            app.unmount();
            raf.restore();
        }
    });

    it("re-arms for each new gesture rather than latching the loop on", () => {
        const raf = installControllableRaf();
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            raf.flush();
            demo.reseat(1);
            raf.run(400);
            expect(raf.pending()).toBe(0);

            demo.reseat(0);
            expect(raf.pending()).toBe(1);
            raf.run(400);
            expect(demo.springLive.value).toBeCloseTo(0, 2);
            expect(raf.pending()).toBe(0);
        } finally {
            app.unmount();
            raf.restore();
        }
    });
});

describe("X.KF.W11.c (c) — M-5: a re-entry inside the hold window orphans nothing", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    /** Four real preset trackers — the derby reads `preset.name`,
     *  `preset.dampingFraction` and writes `spring.target`. */
    const makeTracks = (): SpringTrack[] =>
        SPRING_PRESETS.map((preset) => ({
            preset,
            spring: new SpringProgress({
                response: preset.response,
                dampingFraction: preset.dampingFraction,
                initial: 0,
            }),
            value: { value: 0 } as any,
            velocity: { value: 0 } as any,
            settled: { value: false } as any,
        }));

    it("refuses a second launch while the overlay is still up, and schedules nothing new", () => {
        vi.useFakeTimers();
        const { derby, derbyActive } = useSpringDerby(
            makeTracks(),
            () => {},
            () => {},
            () => {},
        );

        derby();
        expect(derbyActive.value).toBe(true);

        // t ≈ 1500 ms: past the old private guard's clear (~1340 ms) and inside
        // the 700 ms hold the overlay is still rendered through.
        vi.advanceTimersByTime(1500);
        expect(derbyActive.value).toBe(true);

        const scheduledBefore = vi.getTimerCount();
        derby();
        // THE CASE. The old code admitted this launch, then dropped the handle of
        // the still-pending hide-timer — which fired mid-race and unmounted the
        // lanes. Nothing new is scheduled, and nothing pending is abandoned.
        expect(vi.getTimerCount()).toBe(scheduledBefore);
        expect(derbyActive.value).toBe(true);
    });

    it("keeps the lanes up to their own hide time and then leaves", () => {
        vi.useFakeTimers();
        const { derby, derbyActive } = useSpringDerby(
            makeTracks(),
            () => {},
            () => {},
            () => {},
        );

        derby();
        vi.advanceTimersByTime(1500);
        derby(); // the double-tap that used to truncate the timer list
        vi.advanceTimersByTime(500); // t = 2000: still inside the hold
        expect(derbyActive.value).toBe(true);

        vi.advanceTimersByTime(100); // t = 2100: past the race's own hide
        expect(derbyActive.value).toBe(false);
        expect(vi.getTimerCount()).toBe(0);

        // And the egg is re-enterable once its overlay has left.
        derby();
        expect(derbyActive.value).toBe(true);
    });
});

describe("X.KF.W11.c (d) — D-2: the settle confirmation sits at the target", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("restores the pose the derby interrupted, so the field does not always end at 0", async () => {
        vi.useFakeTimers();
        const raf = installControllableRaf();
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            demo.reseat(0.4);
            raf.run(400);
            expect(demo.target.value).toBeCloseTo(0.4, 5);

            demo.derby();
            expect(demo.derbyActive.value).toBe(true);

            // Drive the egg to its settle (launch span 4 × 110 + 900 ms).
            vi.advanceTimersByTime(1400);
            raf.run(600);

            // THE CASE. `settle = () => reseat(0)` meant every derby ended with
            // the whole field commanded to 0 — which is why the confirmation
            // flashed at the rail's far end every time, whatever the user had
            // posed. The egg is a round trip now.
            expect(demo.target.value).toBeCloseTo(0.4, 5);
        } finally {
            app.unmount();
            raf.restore();
            vi.useRealTimers();
        }
    });

    it("binds the pulse to the target-positioned marker, not to the value-1 rule", () => {
        // A structural reading of the settled bytes: `SpringTarget.vue` imports
        // glass-ui's `Card`, whose built chunk resolves `@mkbabb/keyframes.js` by
        // bare specifier from `node_modules`, which the demo vitest project has no
        // alias for — so this component cannot be MOUNTED here. (The one-line fix
        // is in `vitest.config.ts`, a §Bounds "Do NOT touch" row; it is asked for,
        // not taken. `.b` and `.d` both hit and reported the same wall.) The
        // invariant is asserted over the source rather than faked with a mock.

        // The pulse rides the element positioned from the live target…
        const marker = SPRING_TARGET_SRC.slice(
            SPRING_TARGET_SRC.indexOf('class="spring-target-marker'),
        ).slice(0, 400);
        expect(marker).toContain("settle-pulse");
        expect(marker).toContain("settle-pulse--fire");
        expect(marker).toContain("railPct(demo.target.value)");

        // …and the fixed value-1 reference carries no pulse at all.
        const line = SPRING_TARGET_SRC.slice(
            SPRING_TARGET_SRC.indexOf('class="spring-target-line'),
        ).slice(0, 200);
        expect(line).not.toContain("settle-pulse");

        // The pulse animates a property the marker actually declares: the marker
        // has a full `border`, so a `border-right-color` keyframe (what the rule
        // carried while it lived on the line) would animate nothing visible.
        expect(SPRING_TARGET_SRC).toContain("@keyframes spring-settle-pulse");
        const kf = SPRING_TARGET_SRC.slice(
            SPRING_TARGET_SRC.indexOf("@keyframes spring-settle-pulse"),
        ).slice(0, 400);
        expect(kf).toContain("border-color:");
        expect(kf).not.toContain("border-right-color:");
    });
});

describe("X.KF.W11.c — M-2/D-7: the value axis never paints a ball off the plate", () => {
    /** The file's own map, re-derived here from the constants it states, so the
     *  test fails if the axis is widened past what the geometry can hold. */
    const OVERSHOOT_ALLOWANCE = 0.18;
    const RAIL_SPAN = 1 + 2 * OVERSHOOT_ALLOWANCE;
    const railPct = (v: number) =>
        ((Math.min(Math.max(v, -OVERSHOOT_ALLOWANCE), 1 + OVERSHOOT_ALLOWANCE) +
            OVERSHOOT_ALLOWANCE) /
            RAIL_SPAN) *
        100;

    it("states the same allowance the file paints with", () => {
        expect(SPRING_TARGET_SRC).toContain("const OVERSHOOT_ALLOWANCE = 0.18;");
        expect(SPRING_TARGET_SRC).toContain("const RAIL_SPAN = 1 + 2 * OVERSHOOT_ALLOWANCE;");
        // EVERY positional write goes through the one map. Asserted over the
        // write sites themselves rather than over the whole file, because the
        // file quotes the old unclamped expression in the note that explains why
        // it is gone — and a prose mention must not be able to fail a gate about
        // behaviour, nor to pass one.
        const painterWrites = SPRING_TARGET_SRC.split("\n").filter((l) =>
            l.includes(".style.transform ="),
        );
        // X.KF.W13W.b (OA-56): the live ball and the sweep sampler left the rail
        // for the plotted trace, so a write is either a RAIL mark through the
        // one rail map or a TRACE mark through the trace's own plot — never a
        // third, unmapped geometry.
        expect(painterWrites.length).toBeGreaterThanOrEqual(3);
        for (const line of painterWrites) expect(line).toMatch(/railPct\(|plot\.place\(/);
        expect(SPRING_TARGET_SRC).toContain("railPct(live.value)");
        expect(painterWrites.filter((l) => l.includes("plot.place(")).length).toBe(2);
    });

    it("keeps every clamped value inside the rail, and puts value 1 short of its end", () => {
        for (const v of [-5, -0.18, 0, 0.5, 1, 1.18, 1.205, 42]) {
            const p = railPct(v);
            expect(p).toBeGreaterThanOrEqual(0);
            expect(p).toBeLessThanOrEqual(100);
        }
        expect(railPct(0)).toBeCloseTo(13.2353, 3);
        expect(railPct(1)).toBeCloseTo(86.7647, 3);
        // The engine's documented worst peak (1.205 at zeta 0.45) is ABOVE the
        // stated allowance, so it is held at the allowance rather than painted
        // off the plate — the clamp is explicit, not silent truncation at 1.
        expect(railPct(1.205)).toBe(railPct(1.18));
        expect(railPct(1.18)).toBe(100);
    });

    it("is the inverse of the projector the drag reads", () => {
        const railValue = (ratio: number) => ratio * RAIL_SPAN - OVERSHOOT_ALLOWANCE;
        for (const v of [0, 0.25, 0.5, 0.75, 1]) {
            expect(railValue(railPct(v) / 100)).toBeCloseTo(v, 10);
        }
        // Either reserved band reads as out-of-range and `reseat` clamps it.
        expect(railValue(0)).toBeCloseTo(-0.18, 10);
        expect(railValue(1)).toBeCloseTo(1.18, 10);
    });
});
