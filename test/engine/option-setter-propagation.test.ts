// SERVED MODEL: claude-opus-5[1m]
/**
 * test/engine/option-setter-propagation.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-OPTSET** — ONE option-setter letter, FOUR legs, and the spec forbids
 * splitting them: B-13 (KF-TFP-21 + KF-TFP-27), B-14 (the `applyTimingFunction`
 * residue of L·B-2), B-15 (KF-CO-48, the emit posture).
 *
 * The contract the four share: **an option setter reaches the frames, or it
 * refuses — and the refusal is the same shape wherever the defect surfaces.**
 *
 *  1. `setTimingFunction`/`applyTimingFunction` normalized the value and stopped:
 *     `addFrame` bakes `options.timingFunction` into every template stop whose
 *     author omitted one, so a later set reached NEITHER the template nor the
 *     compiled frames — a playback no-op not even a re-parse recovered.
 *  2. The propagation must be exact: an AUTHOR-declared per-frame easing is not
 *     the animation's easing and is never re-seated.
 *  3. `animation.frames` yields `[]` both before a parse and for a genuinely
 *     segment-less animation, so a per-frame write could silently no-op while
 *     REPORTING SUCCESS — the precondition was unobservable. `compiled` is it.
 *  4. The emit posture was asymmetric: the same twinless-easing throw produced a
 *     recorded `custom-renderer` refusal from the shorthand and an ESCAPING
 *     exception from the `@keyframes` block emitters, which run first and
 *     (until this wave) unguarded, past a `compileToCSS` with no outer guard.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation, KeyframesAnimation } from "../../src/animation/engine";
import { compileToCSS } from "../../src/animation/compile";
import { resolveEasing } from "../../src/animation/easing";

const CSS = `@keyframes probe {
    0% { opacity: 0; }
    100% { opacity: 1; }
}`;

function parsed() {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const anim = new CSSKeyframesAnimation({ duration: 100, useWAAPI: false });
    anim.setTargets(el);
    anim.fromString(CSS).parse();
    return anim;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("an option setter REACHES the frames (G-OPTSET legs 1–2)", () => {
    it("setTimingFunction re-seats the compiled frames that inherited the easing", async () => {
        const anim = parsed();
        const before = anim.frames[0]!.timingFunction;
        const next = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");

        anim.setTimingFunction(next);

        expect(anim.options.timingFunction).toBe(next);
        // The frames the playback actually samples — the whole point.
        expect(anim.frames[0]!.timingFunction).toBe(next);
        expect(anim.frames[0]!.timingFunction).not.toBe(before);
        // And the template set, so a later re-parse agrees with the setter.
        expect(anim.templateFrames.every((f) => f.timingFunction === next)).toBe(
            true,
        );
    });

    it("the playback SAMPLES the new easing (not just the field)", () => {
        const anim = parsed();
        const el = anim.targets[0]!;

        // Mid-flight under the default easing: half way.
        anim.interpFrames(50, true);
        expect(parseFloat(el.style.opacity)).toBeCloseTo(0.5, 1);

        // A curve nothing could mistake for it: constant 1 at every input.
        anim.setTimingFunction({ fn: () => 1 });
        anim.interpFrames(50, true);
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
    });

    it("an AUTHOR-declared per-frame easing is NOT re-seated", async () => {
        const el = document.createElement("div");
        const declared = await resolveEasing("cubic-bezier(0.1, 0.7, 0.1, 1)");
        const anim = new KeyframesAnimation({ duration: 100, useWAAPI: false });
        anim.setTargets(el);
        anim.addFrame(0, { opacity: 0 }, undefined, declared);
        anim.addFrame(100, { opacity: 1 });
        anim.parse();

        const next = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
        anim.setTimingFunction(next);

        // Stop 0 keeps what its author declared; stop 1 inherited and moves.
        expect(anim.templateFrames[0]!.timingFunction).toBe(declared);
        expect(anim.templateFrames[1]!.timingFunction).toBe(next);
    });

    it("setting the SAME easing changes nothing (no gratuitous re-seat)", async () => {
        const anim = parsed();
        const current = anim.options.timingFunction;
        anim.setTimingFunction(current);
        expect(anim.frames[0]!.timingFunction).toBe(current);
    });
});

describe("the per-frame precondition is OBSERVABLE (G-OPTSET leg 3)", () => {
    it("`compiled` separates 'not parsed yet' from 'no segments'", () => {
        const el = document.createElement("div");
        const anim = new KeyframesAnimation({ duration: 100, useWAAPI: false });
        anim.setTargets(el);
        anim.addFrame(0, { opacity: 0 });
        anim.addFrame(100, { opacity: 1 });

        // Pre-parse: the array a naive per-frame write would iterate is empty,
        // and BEFORE this cure that emptiness was the only signal available.
        expect(anim.frames.length).toBe(0);
        expect(anim.compiled).toBe(false);

        anim.parse();
        expect(anim.compiled).toBe(true);
        expect(anim.frames.length).toBeGreaterThan(0);
    });

    it("a new template stop makes the compiled set stale, and says so", () => {
        const anim = parsed();
        expect(anim.compiled).toBe(true);

        anim.addFrame(50, { opacity: 0.5 });
        expect(anim.compiled).toBe(false);

        anim.parse();
        expect(anim.compiled).toBe(true);
    });

    it("fromString leaves it COMPILED — it parses on its own way out", () => {
        // Recorded because it is the seam a consumer most easily mis-reads:
        // `fromString` ends with `this.parse()`, so the ingest path never leaves
        // a caller holding an un-compiled instance. The stale window is the
        // hand-authored one (`addFrame` without a `parse`), which is the case
        // above — and the one the panel's per-frame write actually lands in.
        const anim = parsed();
        anim.fromString(CSS);
        expect(anim.compiled).toBe(true);
    });
});

describe("the emit posture is SYMMETRIC (G-OPTSET leg 4 · KF-CO-48)", () => {
    /** A custom closure easing: no `.css` twin, not a registry entry. */
    const twinless = { fn: (t: number) => t * t * t };

    // The fixtures are CSS-INGESTED on purpose. A hand-authored
    // `KeyframesAnimation` with no transform compiles to `NOOP_TRANSFORM`, which
    // is not the instance's default DOM renderer, so `probeChildRefusal` refuses
    // it `custom-renderer` up front for an unrelated reason — and an assertion
    // over that refusal would be vacuous, passing with or without this cure.
    // (Measured: it did. The vacuity was caught by running these against the
    // un-cured file before trusting them.)

    it("a twinless PER-STOP easing is REFUSED, not thrown", async () => {
        const anim = parsed();
        anim.name = "per-stop";
        // Animation-level easing stays faithful: only the STOP's is twinless, so
        // the @keyframes block emitter is the ONLY site that can hit the throw —
        // the exact asymmetry, since the shorthand would never notice.
        anim.addFrame("50%", { opacity: 0.5 }, undefined, twinless);
        anim.parse();

        const out = await compileToCSS([anim]);

        expect(out.eligible).toBe(false);
        expect(out.refusals.map((r) => r.reason)).toContain("custom-renderer");
        expect(out.css).toBe("");
    });

    it("a twinless ANIMATION-level easing is refused the SAME way", async () => {
        const anim = parsed();
        anim.name = "animation-level";
        anim.setTimingFunction(twinless);

        const out = await compileToCSS([anim]);

        expect(out.eligible).toBe(false);
        expect(out.refusals.map((r) => r.reason)).toContain("custom-renderer");
    });

    it("an unrelated throw still PROPAGATES (the guard is not a swallow)", async () => {
        const anim = parsed();
        anim.name = "unrelated";
        // Planted where only the guarded region can meet it, and raised as a
        // kind the designed refusal does not name: the shorthand reads
        // `options.iterationCount` inside the try.
        Object.defineProperty(anim.options, "iterationCount", {
            get() {
                throw new RangeError("not an easing refusal");
            },
        });

        await expect(compileToCSS([anim])).rejects.toThrow(RangeError);
    });

    it("a faithful easing still compiles (the guard refuses nothing else)", async () => {
        const anim = parsed();
        anim.name = "faithful";
        const out = await compileToCSS([anim]);
        expect(out.eligible).toBe(true);
        expect(out.css).toContain("@keyframes");
    });
});
