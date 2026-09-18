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
 * rather than the contract. Two facts per iteration say everything: whether the
 * step was SYNC (a number = no sleep was taken) and where `startTime` landed
 * (t = no phase offset applied).
 */
import { beforeEach, describe, expect, it } from "vitest";
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
    it("iteration 1 takes the delay: the step is async and startTime is offset", async () => {
        const { anim } = delayedAnim(3);

        const first = anim.advanceTo(1000);
        // A thenable is the observable signature of the delay sleep.
        expect(typeof first).not.toBe("number");
        await first;

        expect(anim._playback.startTime).toBe(1000 + DELAY);
    });

    it("iterations 2..N take NO delay: the step is sync and startTime is bare", async () => {
        const { anim } = delayedAnim(3);

        // Iteration 1, to its end.
        await anim.advanceTo(1000);
        const end1 = anim.advanceTo(1000 + DELAY + DURATION);
        expect(typeof end1).toBe("number");
        expect(anim._playback.iteration).toBe(1);
        expect(anim._playback.startTime).toBeUndefined();

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

    it("the whole play costs delay + N·duration, not N·(delay + duration)", async () => {
        const iterations = 4;
        const { anim } = delayedAnim(iterations);

        const start = 5_000;
        await anim.advanceTo(start);
        let clock = start + DELAY;
        for (let i = 0; i < iterations; i++) {
            clock += DURATION;
            const stepped = anim.advanceTo(clock);
            // Every post-first step is sync — a single awaited sleep in the play.
            expect(typeof stepped).toBe("number");
            if (i < iterations - 1) anim.advanceTo(clock);
        }

        expect(anim._playback.done).toBe(true);
        // The ruled budget: ONE delay for the play.
        expect(clock - start).toBe(DELAY + iterations * DURATION);
    });

    it("a fresh PLAY takes the delay again (per-play, not once-per-instance)", async () => {
        const { anim } = delayedAnim(1);

        await anim.advanceTo(1000);
        anim.advanceTo(1000 + DELAY + DURATION);
        expect(anim._playback.done).toBe(true);

        anim.settle();
        const replay = anim.advanceTo(9000);
        expect(typeof replay).not.toBe("number");
        await replay;
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
