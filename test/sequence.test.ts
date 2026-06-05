import { describe, expect, it } from "vitest";
import { Sequence } from "../src/animation/sequence";
import { CSSKeyframesAnimation } from "../src/animation/engine";

// A simple opacity animation 0→1 over `duration` ms. We read the painted
// opacity off the element's inline style after a seek/advance to assert the
// master-playhead → child-clock map.
function opacityAnim(duration = 1000): CSSKeyframesAnimation<any> {
    const el = document.createElement("div");
    // Linear easing so the painted value is exactly the local-clock fraction —
    // the seek/advance map is then transparent (opacity === local / duration).
    const anim = new CSSKeyframesAnimation({
        duration,
        useWAAPI: false,
        timingFunction: "linear",
    }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    anim.setTargets(el);
    return anim;
}

/** Read the opacity the animation last painted onto its (single) target. */
function paintedOpacity(anim: CSSKeyframesAnimation<any>): number {
    const el = anim.targets[0]!;
    return Number.parseFloat(el.style.opacity || "0");
}

describe("Sequence — booked name + subsumption", () => {
    it("is a class distinct from the published Timeline export", async () => {
        // The booked decision: the orchestrator is `Sequence`, NOT `Timeline`
        // (which is the shipped scroll/manual progress driver). Importing both
        // and asserting distinct identities locks the no-collision contract.
        const { Timeline } = await import("../src/animation/timeline");
        expect(Sequence).not.toBe(Timeline);
        expect(Sequence.name).toBe("Sequence");
    });

    it("sits beside AnimationGroup — it does not extend or wrap it", async () => {
        const { AnimationGroup } = await import("../src/animation/group");
        expect((Sequence.prototype as any) instanceof AnimationGroup).toBe(
            false,
        );
        const seq = new Sequence();
        expect(seq instanceof AnimationGroup).toBe(false);
    });
});

describe("Sequence — position resolution (absolute / relative / label)", () => {
    it("absolute `at: n` anchors a segment at exactly n ms", () => {
        const a = opacityAnim(1000);
        const seq = new Sequence().add(a, 500);
        expect(seq.entries[0]!.at).toBe(500);
    });

    it("auto-append (omitted `at`) starts after the previous segment ends", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(500);
        const seq = new Sequence().add(a).add(b);
        // a at 0..1000, b appended at the cursor (1000).
        expect(seq.entries.find((e) => e.animation === a)!.at).toBe(0);
        expect(seq.entries.find((e) => e.animation === b)!.at).toBe(1000);
    });

    it('relative "+=n" offsets forward from the running cursor', () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(500);
        const seq = new Sequence().add(a).add(b, "+=200");
        // cursor after a is 1000; "+=200" → 1200.
        expect(seq.entries.find((e) => e.animation === b)!.at).toBe(1200);
    });

    it('relative "-=n" overlaps the previous segment', () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(500);
        const seq = new Sequence().add(a).add(b, "-=300");
        // cursor after a is 1000; "-=300" → 700.
        expect(seq.entries.find((e) => e.animation === b)!.at).toBe(700);
    });

    it("labels resolve to their registered position", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(500);
        const seq = new Sequence()
            .add(a)
            .label("mid", 400)
            .add(b, "mid");
        expect(seq.entries.find((e) => e.animation === b)!.at).toBe(400);
    });

    it("an unknown label throws (labels are an explicit contract)", () => {
        const a = opacityAnim(1000);
        const seq = new Sequence();
        expect(() => seq.add(a, "nope")).toThrowError(/unknown position/i);
    });

    it("duration is the latest segment end", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(500);
        const seq = new Sequence().add(a).add(b, "+=200"); // b: 1200..1700
        expect(seq.duration).toBe(1700);
    });
});

describe("Sequence — master playhead → child-clock mapping (seek)", () => {
    it("maps the master clock to each child's local clock", () => {
        const a = opacityAnim(1000); // at 0
        const b = opacityAnim(1000); // at 1000
        const seq = new Sequence().add(a).add(b);

        // master = 500: a is at local 500 (opacity 0.5), b not yet started (0).
        seq.seek(500);
        expect(paintedOpacity(a)).toBeCloseTo(0.5, 5);
        expect(paintedOpacity(b)).toBeCloseTo(0, 5);

        // master = 1500: a finished (1), b at local 500 (0.5).
        seq.seek(1500);
        expect(paintedOpacity(a)).toBeCloseTo(1, 5);
        expect(paintedOpacity(b)).toBeCloseTo(0.5, 5);
    });

    it("BITE: offsetting a child's `at` shifts its mapped local clock", () => {
        const baseB = opacityAnim(1000);
        const seqBase = new Sequence().add(opacityAnim(1000)).add(baseB, 1000);
        seqBase.seek(1500);
        const baseline = paintedOpacity(baseB); // local 500 → 0.5

        const shiftB = opacityAnim(1000);
        // Shift b's `at` later by 250ms — the same master clock now maps to an
        // EARLIER local clock, so the painted value differs.
        const seqShift = new Sequence()
            .add(opacityAnim(1000))
            .add(shiftB, 1250);
        seqShift.seek(1500);
        const shifted = paintedOpacity(shiftB); // local 250 → 0.25

        expect(baseline).toBeCloseTo(0.5, 5);
        expect(shifted).toBeCloseTo(0.25, 5);
        expect(shifted).not.toBeCloseTo(baseline, 2);
    });

    it("seek(0) holds every segment at its initial frame", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(1000);
        const seq = new Sequence().add(a).add(b, 500);
        seq.seek(0);
        expect(paintedOpacity(a)).toBeCloseTo(0, 5);
        expect(paintedOpacity(b)).toBeCloseTo(0, 5);
    });

    it("seek past the end holds every segment at its final frame", () => {
        const a = opacityAnim(1000);
        const b = opacityAnim(1000);
        const seq = new Sequence().add(a).add(b, 1000);
        seq.seek(seq.duration + 100);
        expect(paintedOpacity(a)).toBeCloseTo(1, 5);
        expect(paintedOpacity(b)).toBeCloseTo(1, 5);
    });

    it("seek records the master clock as `time`", () => {
        const seq = new Sequence().add(opacityAnim(1000));
        seq.seek(420);
        expect(seq.time).toBe(420);
    });
});

describe("Sequence — play() drives via advanceTo", () => {
    it("play() resolves and lands every segment at its rest frame", async () => {
        const a = opacityAnim(200); // at 0
        const b = opacityAnim(200); // at 200
        const seq = new Sequence().add(a).add(b);

        await seq.play();

        // Both segments finished — opacity 1, and children released back to
        // standalone ownership (settle clears managed).
        expect(paintedOpacity(a)).toBeCloseTo(1, 5);
        expect(paintedOpacity(b)).toBeCloseTo(1, 5);
        expect(a.managed).toBe(false);
        expect(b.managed).toBe(false);
    });

    it("play() is re-entrant — a second call returns the same promise", () => {
        const seq = new Sequence().add(opacityAnim(200));
        const p1 = seq.play();
        const p2 = seq.play();
        expect(p1).toBe(p2);
        return p1;
    });

    it("stop() halts the loop and resolves the pending play promise", async () => {
        const seq = new Sequence().add(opacityAnim(5000));
        const p = seq.play();
        seq.stop();
        await expect(p).resolves.toBeUndefined();
    });
});
