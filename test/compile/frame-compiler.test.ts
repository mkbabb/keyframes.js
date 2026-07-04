import { describe, expect, it } from "vitest";
import { FrameCompiler } from "../../src/animation/compile/frame-compiler";
import { defaultOptions } from "../../src/animation/constants";
import { KeyframesAnimation } from "../../src/animation/engine";

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

/**
 * J.W1 S2 (ENG-2) — `createFrame` is TOTAL on a transform-free template.
 *
 * `seekPreviousValue` returns `number | undefined`; the pre-fix code masked
 * it with `!` and dereferenced `templateFrames[undefined]!.transform` — on a
 * bare `Animation` whose keyframes carry NO transform anywhere (a legitimate
 * numeric/CSS-var animation), the compile THREW the untyped
 * `TypeError: Cannot read properties of undefined (reading 'transform')` —
 * the typed-as-present-but-isn't shape B1 was. The honest resolution is the
 * total no-op default (the I.W0 S3 `NOOP_TRANSFORM` field-default philosophy
 * applied at the compile seam) — a transform-free animation compiles to a
 * no-op transform, never a crash.
 */
describe("J.W1 ENG-2 — createFrame totality (no [undefined]!.transform deref)", () => {
    it("a transform-free template compiles to a callable NO-OP transform (no TypeError)", () => {
        const fc = new FrameCompiler({ ...defaultOptions, duration: 1000 });
        fc.addFrame(0, { x: 0 }); // NO transform on ANY keyframe
        fc.addFrame(100, { x: 100 });

        expect(() => fc.parse([])).not.toThrow();
        expect(fc.frames.length).toBeGreaterThan(0);
        for (const f of fc.frames) {
            expect(typeof f.transform).toBe("function");
            expect(() => f.transform({} as any, 0)).not.toThrow();
        }
    });

    it("the documented public `Animation` surface compiles + interpolates transform-free", () => {
        const a = new KeyframesAnimation({ duration: 1000 });
        a.addFrame(0, { x: 0 });
        a.addFrame(100, { x: 100 });

        expect(() => a.parse()).not.toThrow();
        expect(() => a.interpFrames(500)).not.toThrow();
    });

    it("positive control: a PRECEDING keyframe's transform is still inherited (the seek path)", () => {
        const seen: number[] = [];
        const custom = (_v: unknown, t: number): void => {
            seen.push(t);
        };
        const fc = new FrameCompiler({ ...defaultOptions, duration: 1000 });
        fc.addFrame(0, { x: 0 }, custom as any);
        fc.addFrame(50, { x: 50 }); // transform-free — inherits from 0%
        fc.addFrame(100, { x: 100 }); // transform-free — inherits from 0%
        fc.parse([]);

        for (const f of fc.frames) {
            expect(f.transform).toBe(custom);
        }
    });
});
