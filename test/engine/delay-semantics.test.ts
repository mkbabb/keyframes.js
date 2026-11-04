// SERVED MODEL: claude-opus-5[1m]
/**
 * test/engine/delay-semantics.test.ts — X.KF.W5 arm B (`.c`), gate **G-DELAY**
 * (row B-8 ≡ KF-TD-5).
 *
 * THE RULING CAME FIRST (RULE-BEFORE-FIX, §Sequencing S-2). COHESION §0j.C
 * **KF-W5R4(2)**: *"`delay` is PER-PLAY — one phase offset at play start, never
 * re-slept per iteration"*. This spec asserts THAT contract; it is not free to
 * pick a reading, and a first-iteration guard landed without the ruling would
 * have silently chosen "per-play" for every consumer.
 *
 * THE DEFECT IT REPLACES: `onEnd` clears `startTime` at every iteration
 * boundary, so `advanceTo` re-entered `onStart` for iterations 2..N — which
 * re-slept the WHOLE delay and re-offset `startTime` by it. The JS-side period
 * was `duration + delay` against a compositor clock ticking `duration`, a
 * monotone drift (the banked witness: 27 %/cycle, unbounded), and `iteration`
 * bookkeeping went with it.
 *
 * The oracle is the MECHANISM, driven through `advanceTo` with an explicit
 * clock — not wall-clock timing, which in jsdom would measure the scheduler
 * rather than the contract. Two facts per iteration say everything: where
 * `startTime` landed (t = no phase offset applied) and the local time it gives.
 *
 * 6.2.1 — the delay is a PHASE on the driving clock, never a wall-clock sleep:
 * every step is SYNC, and before the delay elapses the local time is negative
 * (the CSS before-phase). `animationstart` fires when the clock reaches the
 * anchor (test/group/child-delay-master-clock.test.ts carries the group leg).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

const DURATION = 40;
const DELAY = 60;

function delayedAnim(iterationCount: number) {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const anim = new CSSKeyframesAnimation({
        duration: DURATION,
        delay: DELAY,
        iterationCount,
        useWAAPI: false,
    }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    anim.setTargets(el);
    anim.parse();
    return { el, anim };
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("`delay` is PER-PLAY (G-DELAY · KF-W5R4(2))", () => {
    it("iteration 1 takes the delay as a phase: startTime is offset, the step is sync", () => {
        const { anim } = delayedAnim(3);
        const starts = vi
            .spyOn(anim, "dispatchAnimationEvent")
            .mock.calls;

        // Before-phase: local time counts up from −delay; no animationstart yet.
        expect(anim.advanceTo(1000)).toBe(-DELAY);
        expect(anim._playback.startTime).toBe(1000 + DELAY);
        expect(anim.advanceTo(1000 + DELAY / 2)).toBe(-DELAY / 2);
        expect(starts.filter(([type]) => type === "animationstart")).toEqual([]);

        // The active phase opens when the clock reaches the anchor.
        expect(anim.advanceTo(1000 + DELAY + 10)).toBe(10);
        expect(starts.filter(([type]) => type === "animationstart")).toHaveLength(1);
    });

    it("iterations 2..N take NO delay: the step is sync and startTime is bare", () => {
        const { anim } = delayedAnim(3);

        // Iteration 1, to its end.
        anim.advanceTo(1000);
        const end1 = anim.advanceTo(1000 + DELAY + DURATION);
        expect(typeof end1).toBe("number");
        expect(anim._playback.iteration).toBe(1);
        // KFA-145 (X.KF.W13X.r4lib): the crossing frame opens iteration 2 on
        // the bare boundary — no second phase offset.
        expect(anim._playback.startTime).toBe(1000 + DELAY + DURATION);

        // Iteration 2 — the re-entry the defect lived in.
        const t2 = 1000 + DELAY + DURATION;
        const step2 = anim.advanceTo(t2);
        expect(typeof step2).toBe("number"); // no re-sleep
        expect(anim._playback.startTime).toBe(t2); // no second phase offset
        expect(step2).toBe(0); // local time starts at 0, never at -delay

        // Iteration 3 — and the last one ends the play.
        anim.advanceTo(t2 + DURATION);
        expect(anim._playback.iteration).toBe(2);
        const t3 = t2 + DURATION;
        const step3 = anim.advanceTo(t3);
        expect(typeof step3).toBe("number");
        expect(anim._playback.startTime).toBe(t3);
    });

    it("the whole play costs delay + N·duration, not N·(delay + duration)", () => {
        const iterations = 4;
        const { anim } = delayedAnim(iterations);

        const start = 5_000;
        anim.advanceTo(start);
        let clock = start + DELAY;
        for (let i = 0; i < iterations; i++) {
            clock += DURATION;
            const stepped = anim.advanceTo(clock);
            // Every step is sync.
            expect(typeof stepped).toBe("number");
            if (i < iterations - 1) anim.advanceTo(clock);
        }

        expect(anim._playback.done).toBe(true);
        // The ruled budget: ONE delay for the play.
        expect(clock - start).toBe(DELAY + iterations * DURATION);
    });

    it("a fresh PLAY takes the delay again (per-play, not once-per-instance)", () => {
        const { anim } = delayedAnim(1);

        anim.advanceTo(1000);
        anim.advanceTo(1000 + DELAY + DURATION);
        expect(anim._playback.done).toBe(true);

        anim.settle();
        expect(anim.advanceTo(9000)).toBe(-DELAY);
        expect(anim._playback.startTime).toBe(9000 + DELAY);
    });

    it("`delay: 0` stays fully sync (the no-delay path is unchanged)", () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: DURATION,
            iterationCount: 2,
            useWAAPI: false,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        anim.setTargets(el);
        anim.parse();

        const first = anim.advanceTo(1000);
        expect(typeof first).toBe("number");
        expect(anim._playback.startTime).toBe(1000);
    });
});
