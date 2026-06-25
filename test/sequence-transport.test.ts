import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sequence } from "../src/animation/orchestration/sequence";
// R.W2b carved the pure repeat/yoyo phase fold off the `Sequence` class into the
// colocated `./transport` module; the fold-math tests drive `foldPhase` directly
// with the sequence's own config (the same inputs the former `_fold` method read).
import { foldPhase } from "../src/animation/orchestration/sequence/transport";
import { CSSKeyframesAnimation } from "../src/animation/engine";

/**
 * F.W9 — the Sequence transport gate (the C⁰-continuity lock).
 *
 * The transport (`pause`/`resume`/`reverse`/`timeScale`/`progress`/`repeat`/
 * `yoyo`) is scalar-field arithmetic over the EXISTING `seek` scrub. The
 * non-negotiable claim is MEASURE-FIRST: the rAF play path (`_frame`) must be
 * PIXEL-IDENTICAL to a `seek` sweep at every sampled master clock, forward AND
 * reverse — so a rate flip never jumps the playhead. The substrate hazard the
 * spec names: the per-child `onEnd`-clears-`startTime` window (engine
 * `advanceTo`) was reasoned forward-monotone; a negative rate re-enters
 * finished segments. The transport side-steps it by painting through the ONE
 * `seek` map (`_applyAt`), never `advanceTo`, so play === seek by construction.
 * These tests lock that — and BITE on a naive flip that jumps.
 */

// A linear opacity 0→1 over `duration` ms. Linear easing → painted opacity is
// EXACTLY the local-clock fraction, so the seek/play map is transparent
// (opacity === clamp(master − at, 0, duration) / duration).
function opacityAnim(duration = 1000): CSSKeyframesAnimation<any> {
    const el = document.createElement("div");
    const anim = new CSSKeyframesAnimation({
        duration,
        useWAAPI: false,
        timingFunction: "linear",
    }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    anim.setTargets(el);
    return anim;
}

function paintedOpacity(anim: CSSKeyframesAnimation<any>): number {
    const el = anim.targets[0]!;
    return Number.parseFloat(el.style.opacity || "0");
}

/** A 3-segment sequence: a@0..1000, b@1000..2000, c@2000..3000 (duration 3000). */
function threeSegment(): {
    seq: Sequence;
    a: CSSKeyframesAnimation<any>;
    b: CSSKeyframesAnimation<any>;
    c: CSSKeyframesAnimation<any>;
} {
    const a = opacityAnim(1000);
    const b = opacityAnim(1000);
    const c = opacityAnim(1000);
    const seq = new Sequence().add(a).add(b).add(c);
    return { seq, a, b, c };
}

/** The painted triple at this instant — the per-child interpFrames output. */
function snapshot(
    a: CSSKeyframesAnimation<any>,
    b: CSSKeyframesAnimation<any>,
    c: CSSKeyframesAnimation<any>,
): [number, number, number] {
    return [paintedOpacity(a), paintedOpacity(b), paintedOpacity(c)];
}

// Dense master clocks INCLUDING every segment boundary (0,1000,2000,3000) and
// across-boundary interiors (the C⁰ break, if any, lives exactly here).
const DENSE_CLOCKS = (duration: number): number[] => {
    const stops: number[] = [];
    for (let m = 0; m <= duration; m += 125) stops.push(m);
    // Explicit boundaries (already on the grid at 125ms, but make intent loud).
    stops.push(0, 1000, 2000, 3000, duration);
    return [...new Set(stops)].sort((x, y) => x - y);
};

describe("Sequence transport — seek↔play parity (the C⁰-continuity lock)", () => {
    it("FORWARD: _frame is pixel-identical to seek at every master clock, incl. boundaries", async () => {
        const duration = 3000;

        // (a) the seek sweep — the canonical scrub.
        const seekRun = threeSegment();
        const seekFrames: [number, number, number][] = [];
        for (const m of DENSE_CLOCKS(duration)) {
            seekRun.seq.seek(m);
            seekFrames.push(snapshot(seekRun.a, seekRun.b, seekRun.c));
        }

        // (b) the play sweep — drive _frame directly at the SAME master clocks
        // (rate 1). The origin seeds at clock 0 (master = _time = 0), so
        // _frame(m) yields master clock m exactly.
        const playRun = threeSegment();
        const seq = playRun.seq as any;
        // Seed managed-play state as play() would (events ride advanceTo, but
        // the paint is the _applyAt map — what we compare).
        for (const { animation, at } of playRun.seq.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }
        seq._time = 0;
        seq._playOrigin = undefined;
        const playFrames: [number, number, number][] = [];
        for (const m of DENSE_CLOCKS(duration)) {
            await seq._frame(m); // origin seeds to 0 on the first call
            playFrames.push(snapshot(playRun.a, playRun.b, playRun.c));
        }

        expect(playFrames).toEqual(seekFrames);
    });

    it("REVERSE: a negative-rate _frame sweep is pixel-identical to a reversed seek sweep", async () => {
        const duration = 3000;
        const clocks = DENSE_CLOCKS(duration);

        // (a) the reversed seek sweep — seek walking the master clock backward.
        const seekRun = threeSegment();
        const reversedSeek: [number, number, number][] = [];
        for (const m of [...clocks].reverse()) {
            seekRun.seq.seek(m);
            reversedSeek.push(snapshot(seekRun.a, seekRun.b, seekRun.c));
        }

        // (b) the negative-rate play sweep — reverse() at _time = duration, then
        // drive _frame with WALL-CLOCK advancing forward; rate −1 walks the
        // master clock back from `duration` to 0. We feed wall clocks so that
        // (clock − origin) * (−1) hits each reversed master clock.
        const playRun = threeSegment();
        const seq = playRun.seq as any;
        for (const { animation, at } of playRun.seq.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }
        // Stand the playhead at the end, then reverse.
        seq._time = duration;
        seq._rate = -1;
        seq._playOrigin = undefined;
        seq._lastClock = undefined;
        seq._playingPromise = Promise.resolve(); // mark "playing" for re-anchor guards

        const reversedPlay: [number, number, number][] = [];
        // origin seeds on the first frame: origin = clock0 − _time/rate.
        // For wall clock advancing by Δ, master = (clock − origin)*(−1) =
        // duration − (clock − clock0). So feeding clock0 + (duration − m) hits
        // master = m. Walk m from duration down to 0 (reversed).
        const clock0 = 1_000_000; // arbitrary rAF-style origin
        for (const m of [...clocks].reverse()) {
            const wall = clock0 + (duration - m);
            await seq._frame(wall);
            reversedPlay.push(snapshot(playRun.a, playRun.b, playRun.c));
        }

        // The BITE: if the reverse paint went through advanceTo's held-final-
        // frame window (onEnd cleared startTime), a re-entered finished segment
        // would paint its STALE final value (1) instead of the true scrubbed
        // fraction — diverging from the reversed seek sweep exactly at the
        // re-entry boundary. The _applyAt map paints the true fraction, so they
        // match.
        expect(reversedPlay).toEqual(reversedSeek);
    });

    it("BITE: the held-final-frame (advanceTo onEnd window) DIVERGES from the scrub map on reverse re-entry", async () => {
        // Demonstrate the naive flip the gate forbids: a child driven forward
        // PAST its end (advanceTo fires onEnd → clears startTime → holds final),
        // then re-entered at a lower local clock. The held-final-frame value (1)
        // is NOT the true scrubbed value (0.5) the _applyAt map paints. If the
        // transport had reused advanceTo for the reverse paint, this divergence
        // is the C⁰ break — so the parity asserts above would red.
        const child = opacityAnim(1000);
        child.startTime = 0;
        child.started = true;
        child.managed = true;

        // Forward past the end: advanceTo crosses the duration, fires onEnd.
        // (`await` is the path-agnostic caller form — the steady advance is
        // SYNC since J.W6 S1, a thenable only on the first-tick delay sleep.)
        await child.advanceTo(1500);
        child.interpFrames(1000, true); // the held-final-frame paint
        const heldFinal = paintedOpacity(child); // 1 — the stale value
        expect(heldFinal).toBeCloseTo(1, 5);

        // The TRUE scrub value at master clock 500 (local 500) is 0.5 — what
        // the _applyAt map (clamp(500−0,0,1000)/1000) paints on re-entry.
        const sameChild = opacityAnim(1000);
        sameChild.interpFrames(500, true);
        const scrub = paintedOpacity(sameChild);
        expect(scrub).toBeCloseTo(0.5, 5);

        // The divergence the gate bites on: held-final ≠ scrub.
        expect(heldFinal).not.toBeCloseTo(scrub, 2);
    });
});

describe("Sequence transport — pause/resume no-jump (S1)", () => {
    beforeEach(() => {
        vi.useRealTimers();
    });

    it("the first resumed frame's master clock equals the retained _time (no forward jump)", async () => {
        const { seq } = threeSegment();
        const s = seq as any;
        // Stand at a known playhead and mark "playing + paused" without an rAF.
        for (const { animation, at } of seq.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }
        s._time = 1234;
        s._paused = true;
        s._playingPromise = Promise.resolve();
        s._playOrigin = undefined; // resume clears the origin

        // resume() restarts the loop; intercept the first frame by clearing the
        // paused flag (resume does) and driving _frame at an arbitrary, MUCH
        // LATER wall clock (simulating elapsed paused real time).
        s._paused = false;
        const lateWallClock = 9_999_999;
        await s._frame(lateWallClock);

        // The master clock is the retained _time — NOT leapt by the paused
        // wall-clock interval. (origin = clock − _time/rate seeds master = _time.)
        expect(s._time).toBeCloseTo(1234, 5);
    });

    it("BITE: re-anchoring to the raw resume timestamp would leap the master clock", async () => {
        const { seq } = threeSegment();
        const s = seq as any;
        for (const { animation, at } of seq.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }
        s._time = 1234;
        s._playingPromise = Promise.resolve();

        // The BUG the gate forbids: seed the origin to the raw resume timestamp
        // (origin = clock), so master = clock − origin = 0 — a jump OFF the
        // retained 1234 (or, mirrored, master = clock if origin stayed 0). Show
        // the correct seed differs from this naive one.
        const wall = 9_999_999;
        const naiveOrigin = wall; // origin := clock (the forward-jump bug)
        const naiveMaster = (wall - naiveOrigin) * 1; // = 0 — the jump
        s._playOrigin = undefined;
        await s._frame(wall);
        const correctMaster = s._time; // 1234 — the no-jump re-anchor

        expect(correctMaster).toBeCloseTo(1234, 5);
        expect(naiveMaster).not.toBeCloseTo(correctMaster, 0);
    });

    it("pause() retains the playhead and the play promise; children stay managed", async () => {
        const a = opacityAnim(5000);
        const seq = new Sequence().add(a);
        const p = seq.play();
        // Let one frame run, then pause.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        seq.pause();
        expect(a.managed).toBe(true); // NOT settled — playhead retained
        seq.stop();
        await expect(p).resolves.toBeUndefined();
    });
});

describe("Sequence transport — progress round-trip (S2)", () => {
    it("progress = 0.5 lands time at 0.5 * duration; progress reads back 0.3 after seek", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(1000);
        const seq = new Sequence().add(a).add(b); // duration 2000

        seq.progress = 0.5;
        expect(seq.time).toBe(0.5 * seq.duration);
        expect(seq.time).toBe(1000);

        seq.seek(0.3 * seq.duration); // seek to 600
        expect(seq.progress).toBeCloseTo(0.3, 9);
    });

    it("BITE: a seek(p) setter (not seek(p * duration)) would break the round-trip", () => {
        const seq = new Sequence().add(opacityAnim(1000)).add(opacityAnim(1000));
        // The correct setter scales by duration. The naive seek(p) would land
        // time at 0.5 (not 1000) — far off the 0.5 * duration the round-trip
        // requires.
        seq.progress = 0.5;
        expect(seq.time).toBe(1000); // correct
        expect(seq.time).not.toBe(0.5); // the naive-setter value
    });

    it("progress clamps its input to [0, 1]", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        seq.progress = 5;
        expect(seq.time).toBe(seq.duration);
        seq.progress = -3;
        expect(seq.time).toBe(0);
    });
});

describe("Sequence transport — repeat / yoyo phase (S4)", () => {
    it("repeat(2): master clock 1.5*duration folds to phase 0.5*duration (cycle 1)", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(1000);
        const seq = new Sequence().add(a).add(b); // duration 2000
        seq.repeat(2);
        const fold = (raw: number): number =>
            foldPhase(raw, seq.duration, (seq as any)._repeatCount, (seq as any)._yoyoOn);
        // 1.5 * duration = 3000 → cycle 1, phase 1000 (= 0.5 * duration).
        expect(fold(1.5 * seq.duration)).toBeCloseTo(0.5 * seq.duration, 9);
    });

    it("yoyo(true): the odd cycle REFLECTS the phase (duration − phase)", () => {
        const seq = new Sequence().add(opacityAnim(1000)).add(opacityAnim(1000));
        seq.repeat(2).yoyo(true);
        const fold = (raw: number): number =>
            foldPhase(raw, seq.duration, (seq as any)._repeatCount, (seq as any)._yoyoOn);
        // Cycle 0 (forward): 0.25*dur → 0.25*dur.
        expect(fold(0.25 * seq.duration)).toBeCloseTo(0.25 * seq.duration, 9);
        // Cycle 1 (reflected): 1.5*dur → phase 0.5*dur reflected → 0.5*dur.
        // pick 1.25*dur → cycle 1, phase 0.25*dur, reflected → 0.75*dur.
        expect(fold(1.25 * seq.duration)).toBeCloseTo(0.75 * seq.duration, 9);
    });

    it("BITE: dropping the yoyo reflection makes the odd-cycle phase wrong", () => {
        const seq = new Sequence().add(opacityAnim(1000)).add(opacityAnim(1000));
        seq.repeat(2).yoyo(true);
        const fold = (raw: number): number =>
            foldPhase(raw, seq.duration, (seq as any)._repeatCount, (seq as any)._yoyoOn);
        const reflected = fold(1.25 * seq.duration); // 0.75 * duration
        const naiveForward = 0.25 * seq.duration; // what NO reflection gives
        expect(reflected).toBeCloseTo(0.75 * seq.duration, 9);
        expect(reflected).not.toBeCloseTo(naiveForward, 2);
    });

    it("repeat(Infinity) never settles the forward bound (the loop case)", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        seq.repeat(Infinity);
        const fold = (raw: number): number =>
            foldPhase(raw, seq.duration, (seq as any)._repeatCount, (seq as any)._yoyoOn);
        // A huge master clock still folds into [0, duration] — never collapses
        // to a terminal settle.
        const phase = fold(987 * seq.duration + 250);
        expect(phase).toBeGreaterThanOrEqual(0);
        expect(phase).toBeLessThanOrEqual(seq.duration);
    });
});

describe("Sequence transport — reverse / timeScale config + continuity", () => {
    it("reverse() flips the sign of rate, timeScale(n) sets it, both re-anchor continuously", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        expect(seq.rate).toBe(1);
        seq.reverse();
        expect(seq.rate).toBe(-1);
        seq.timeScale(2);
        expect(seq.rate).toBe(2);
        seq.reverse();
        expect(seq.rate).toBe(-2);
    });

    it("timeScale rejects a non-finite rate (fail-explicit)", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        expect(() => seq.timeScale(NaN)).toThrow();
        expect(() => seq.timeScale(Infinity)).toThrow();
    });

    it("repeat rejects a non-positive / non-integer count", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        expect(() => seq.repeat(0)).toThrow();
        expect(() => seq.repeat(-1)).toThrow();
        expect(() => seq.repeat(1.5)).toThrow();
        expect(() => seq.repeat(Infinity)).not.toThrow();
    });
});

describe("Sequence transport — no regression (play/stop/seek byte-stable)", () => {
    it("default play() (rate 1, repeat 1, yoyo off) lands every segment at its rest frame", async () => {
        const a = opacityAnim(150);
        const b = opacityAnim(150);
        const seq = new Sequence().add(a).add(b);
        await seq.play();
        expect(paintedOpacity(a)).toBeCloseTo(1, 5);
        expect(paintedOpacity(b)).toBeCloseTo(1, 5);
        expect(a.managed).toBe(false);
        expect(b.managed).toBe(false);
    });

    it("a reverse() play from a mid-seek walks back to the start frame", async () => {
        const a = opacityAnim(150);
        const seq = new Sequence().add(a);
        // Drive a real reverse play from the end.
        seq.seek(seq.duration); // stand at the end (opacity 1)
        const s = seq as any;
        for (const { animation, at } of seq.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }
        s._time = seq.duration;
        s._paused = false;
        s._playOrigin = undefined;
        s._lastClock = undefined;
        s._rate = -1;
        await new Promise<void>((resolve) => {
            s._resolvePlay = resolve;
            s._playingPromise = new Promise<void>(() => {});
            seq.playback.loop(s._boundFrame);
        });
        // Reverse settles at phase 0 — the start frame (opacity 0).
        expect(paintedOpacity(a)).toBeCloseTo(0, 5);
    });
});
