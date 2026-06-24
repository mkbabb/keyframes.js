import { describe, expect, it, vi } from "vitest";
import { animate } from "../src/animation/animate";
import { AnimationGroup } from "../src/animation/group";
import { Sequence } from "../src/animation/orchestration/sequence";
import { CSSKeyframesAnimation } from "../src/animation/engine";

/**
 * proof:animate-orchestration — L.W8 S3 (the W127 front-door gap).
 *
 * `animate()` dispatches FOUR `CSSKeyframesAnimation` shapes (CSS string,
 * keyframe map, vars array, MotionPath spec). The orchestration tier —
 * `AnimationGroup` (the SPATIAL per-frame blender) and `Sequence` (the TEMPORAL
 * master-playhead) — is wholly LIGHT and wholly UNREACHABLE through the single
 * front door: a consumer wanting a staggered multi-element sequence had no
 * `animate(...)` entry point, only the manual `new Sequence(...)` / `new
 * AnimationGroup(...)` lifecycle.
 *
 * This gate is BORN-RED on today's tree: with NO orchestration-dispatch branch,
 * an `AnimationGroup` / `Sequence` instance is a non-array, non-Map OBJECT, so
 * `isKeyframeMap()` (animate.ts:166) accepts it and routes it to
 * `fromKeyframes(group)` — which throws an `AnimationOptionError` (the
 * instance's enumerable property keys, e.g. "entries"/"animations", are read as
 * keyframe selectors and rejected). So `animate(el, group)` THROWS instead of
 * dispatching to `.play()` and never returns the group — clauses (a)/(b)/(a')
 * red. (A genuinely-unrecognized input that is NOT an object — a number — DOES
 * reach the bare `throw new Error("animate(): unrecognized input — …")` at
 * animate.ts:169; clause (c) locks that, and passes today.)
 *
 * The cure (S3) adds a fifth dispatch branch BEFORE the object-shape checks:
 * `if (input instanceof AnimationGroup || input instanceof Sequence) { …
 * input.play(); return input; }`. After the patch, (a)/(b)/(a') GREEN; (c)
 * still GREENs because the bare-Error branch is PRESERVED for genuinely
 * unrecognized inputs.
 *
 * The behavioral assertions ((a)/(b): `.play()` fired + the instance returned
 * BY REFERENCE) are independent of which error today's tree throws — they pin
 * the post-cure contract. Clause (c) asserts the ACTUAL thrown class — a plain
 * `Error`, NOT the typed `AnimationOptionError` (the throw at animate.ts:169 is
 * a bare `Error`).
 */
describe("proof:animate-orchestration — animate() dispatches the orchestration tier (W127)", () => {
    it("(a) animate(el, group) dispatches to group.play() and RETURNS the group", () => {
        const el = document.createElement("div");
        const group = new AnimationGroup();
        // Stub play so the rAF loop does not start under jsdom; record the call.
        const play = vi
            .spyOn(group, "play")
            .mockImplementation(async () => {});

        const returned = animate(el, group as never);

        // The group's own play() fired (the group OWNS its loop — animate must
        // NOT wrap it in a new CSSKeyframesAnimation).
        expect(play).toHaveBeenCalledTimes(1);
        // The returned control handle IS the group — by reference, not a clone
        // and not a CSSKeyframesAnimation.
        expect(returned).toBe(group);
        expect(returned).not.toBeInstanceOf(CSSKeyframesAnimation);

        play.mockRestore();
    });

    it("(b) animate(el, seq) dispatches to seq.play() and RETURNS the sequence", () => {
        const el = document.createElement("div");
        const seq = new Sequence();
        const play = vi
            .spyOn(seq, "play")
            .mockImplementation(async () => {});

        const returned = animate(el, seq as never);

        expect(play).toHaveBeenCalledTimes(1);
        expect(returned).toBe(seq);
        expect(returned).not.toBeInstanceOf(CSSKeyframesAnimation);

        play.mockRestore();
    });

    it("(a') autoPlay:false does NOT call group.play() but still returns the group", () => {
        // The `autoPlay` option gates the `.play()` call with the SAME semantics
        // as every other shape — a constructed/targeted handle the caller drives.
        const el = document.createElement("div");
        const group = new AnimationGroup();
        const play = vi
            .spyOn(group, "play")
            .mockImplementation(async () => {});

        const returned = animate(el, group as never, { autoPlay: false });

        expect(play).not.toHaveBeenCalled();
        expect(returned).toBe(group);

        play.mockRestore();
    });

    it("(c) an UNRECOGNIZED object still throws the bare Error 'animate(): unrecognized input'", () => {
        // The error branch at animate.ts:169 is PRESERVED for genuinely
        // unrecognized inputs — a number is none of the six shapes. The thrown
        // class is a plain Error (NOT AnimationOptionError); the gate matches the
        // ACTUAL class and message fragment.
        const el = document.createElement("div");
        expect(() => animate(el, 42 as never)).toThrow(
            /animate\(\): unrecognized input/,
        );
        // The thrown value is a bare Error, not the typed AnimationOptionError.
        try {
            animate(el, 42 as never);
            throw new Error("expected animate() to throw on an unrecognized input");
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect((err as Error).constructor.name).toBe("Error");
        }
    });
});
