import { describe, expect, it } from "vitest";
import { FrameCompiler } from "../src/animation/frame-compiler";
import { defaultOptions } from "../src/animation/constants";

/**
 * D.W4 D-4 — the `FrameCompiler` seam. The compilation half of the former
 * ~1019-line `Animation` god-object is now a standalone unit, exercised here
 * WITHOUT a clock, a playback loop, or an `Animation` — the proof that the
 * split is real (a pure value-in → frames-out compiler), not a cosmetic move.
 */
// The default renderer the real callers (`Animation`/`CSSKeyframesAnimation`)
// always supply — the compiler inherits the same "every frame carries a
// transform" contract, so the tests provide it just as the engine does.
const render = (): void => {};

describe("FrameCompiler — compile without a clock", () => {
    it("compiles template frames into sampled frames (no playback, no DOM)", () => {
        const fc = new FrameCompiler({ ...defaultOptions, duration: 1000 });
        fc.addFrame(0, { opacity: 0 }, render);
        fc.addFrame(100, { opacity: 1 }, render);
        fc.parse([]); // no targets — pure compilation

        expect(fc.templateFrames).toHaveLength(2);
        expect(fc.frames.length).toBeGreaterThan(0);

        const f = fc.frames[0]!;
        expect(f.time.start).toBe(0);
        expect(f.time.stop).toBe(1000);
        expect("opacity" in f.interpVars).toBe(true);
    });

    it("honours `options.duration` in the computed frame times", () => {
        const fc = new FrameCompiler({ ...defaultOptions, duration: 500 });
        fc.addFrame(0, { opacity: 0 }, render);
        fc.addFrame(100, { opacity: 1 }, render);
        fc.parse([]);

        expect(fc.frames[0]!.time.stop).toBe(500);
    });

    it("reconciles a variable across non-adjacent keyframes", () => {
        const fc = new FrameCompiler({ ...defaultOptions, duration: 1000 });
        fc.addFrame(0, { x: 0 }, render);
        fc.addFrame(50, { y: 5 }, render);
        fc.addFrame(100, { x: 100 }, render);
        fc.parse([]);

        // `x` appears at 0% and 100% (non-adjacent) — the compiler must build a
        // segment spanning them, independent of any playback clock.
        const spansX = fc.frames.some((f) => "x" in f.interpVars);
        expect(spansX).toBe(true);
    });

    it("reads the LIVE options object — post-construction mutations are seen", () => {
        // The compiler holds a REFERENCE to the options object (not a copy), so
        // `Animation.setDuration`'s in-place mutation is reflected on the next
        // compile. A copy here would silently desync duration/colorSpace from
        // the playback class — the split's subtlest failure mode.
        const opts = { ...defaultOptions, duration: 1000 };
        const fc = new FrameCompiler(opts);
        fc.addFrame(0, { opacity: 0 }, render);
        fc.addFrame(100, { opacity: 1 }, render);
        fc.parse([]);
        expect(fc.frames[0]!.time.stop).toBe(1000);

        opts.duration = 2000; // the same object Animation's setters mutate
        fc.parse([]);
        expect(fc.frames[0]!.time.stop).toBe(2000);
    });

    it("carries no playback state — it is constructed from options alone", () => {
        const fc = new FrameCompiler({ ...defaultOptions });
        // No `started`/`paused`/`done`/`playback` — a FrameCompiler has none of
        // the run-state the Animation owns; it is a data + pipeline unit.
        expect("playback" in fc).toBe(false);
        expect("started" in fc).toBe(false);
        expect("paused" in fc).toBe(false);
    });
});
