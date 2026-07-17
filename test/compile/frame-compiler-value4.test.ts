import { describe, expect, it } from "vitest";

import { FrameCompiler } from "../../src/animation/compile/frame";
import {
    interpolateCompiledValue,
    refreshAuthoredSink,
} from "../../src/animation/compile/value-ast";
import type { AnimationOptions } from "../../src/animation/constants";
import type { CompiledAnimationFrame } from "../../src/animation/compile/frame";

const options: AnimationOptions = {
    duration: 1_000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: { fn: (progress) => progress },
    useWAAPI: false,
    respectReducedMotion: false,
    colorSpace: "oklab",
};

describe("FrameCompiler Value 4 structural integration", () => {
    it("compiles selectors, AST values, slots, and stable authored sinks", () => {
        const compiler = new FrameCompiler(options);
        compiler.addFrame(0, { opacity: 0, nested: { x: "10px" } });
        compiler.addFrame(100, { opacity: 1, nested: { x: "30px" } });

        compiler.parse([]);

        expect(compiler.frames).toHaveLength(1);
        const frame = compiler.frames[0]! as CompiledAnimationFrame;
        expect(frame.start).toEqual({ kind: "percent", value: 0 });
        expect(frame.time).toEqual({ start: 0, stop: 1_000 });
        expect(frame.allInterpVars.map((slot) => slot.kind)).toEqual([
            "number",
            "number",
        ]);
        expect(frame.vars).toEqual({ opacity: 0, nested: { x: "10px" } });
        expect(frame.flatVars).toEqual({ opacity: 0, "nested.x": "10px" });

        const root = frame.vars;
        const flat = frame.flatVars;
        for (const value of Object.values(frame.interpVars)) {
            interpolateCompiledValue(value, 0.5);
        }
        refreshAuthoredSink(frame._sink);

        expect(frame.vars).toBe(root);
        expect(frame.flatVars).toBe(flat);
        expect(frame.vars).toEqual({ opacity: 0.5, nested: { x: "20px" } });
        expect(frame.flatVars).toEqual({
            opacity: 0.5,
            "nested.x": "20px",
        });
    });
});
