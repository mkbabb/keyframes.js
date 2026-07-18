import { describe, expect, it } from "vitest";
import {
    requireKeyframeSelector,
    selectorPercent,
    selectorText,
} from "../../../demo/utils/keyframeSelector";
import { parseAnimationCSS } from "../../../demo/components/instrument/keyframes/utils/parseAnimationCSS";
import {
    buildAnimationFromTimeline,
    importCSSToTimeline,
} from "../../../demo/components/instrument/timeline/utils/timelineEngine";
import {
    timingFunctionKind,
    timingFunctionState,
} from "../../../demo/utils/reference-data/animationDescriptions";

describe("Value4 editor boundary", () => {
    it("normalizes percent aliases and round-trips named selectors structurally", () => {
        expect(requireKeyframeSelector("from")).toEqual({
            kind: "percent",
            value: 0,
        });

        const named = requireKeyframeSelector("ENTRY 50%");
        expect(named).toEqual({ kind: "named", name: "entry", offset: 0.5 });
        expect(selectorText(named)).toBe("entry 50%");
        expect(selectorPercent(named)).toBe(12.5);
        expect(() => requireKeyframeSelector("125%")).toThrow(
            /invalid keyframe selector/i,
        );
    });

    it("lets the engine adapter parse a bare stop list even when a comment mentions @keyframes", async () => {
        const parsed = await parseAnimationCSS(`
            /* documentation mentions @keyframes without declaring one */
            from { opacity: 0; }
            to { opacity: 1; }
        `);

        expect([...parsed.keyframes.keys()]).toEqual(["0%", "100%"]);
    });

    it("preserves named selectors through timeline import and rebuild", async () => {
        const keyframes = await importCSSToTimeline(`
            @keyframes reveal {
                entry 50% { opacity: 0; }
                exit 100% { opacity: 1; }
            }
        `);

        expect(keyframes.map((keyframe) => keyframe.selector)).toEqual([
            { kind: "named", name: "entry", offset: 0.5 },
            { kind: "named", name: "exit", offset: 1 },
        ]);
        expect(keyframes.map((keyframe) => keyframe.percent)).toEqual([
            12.5, 100,
        ]);

        const animation = await buildAnimationFromTimeline(
            {
                keyframes,
                captureProperties: [],
                animationName: "reveal",
            },
            { duration: 1_000 },
            [],
        );
        expect(animation.templateFrames.map((frame) => frame.start)).toEqual(
            keyframes.map((keyframe) => keyframe.selector),
        );
    });

    it("classifies complete timing functions through Value and exposes invalid input", () => {
        expect(timingFunctionKind("steps(4, jump-end)")).toBe("steps");
        expect(timingFunctionKind("cubic-bezier(0.2, 0, 0.8, 1)")).toBe(
            "cubic-bezier",
        );
        expect(timingFunctionState("steps")).toEqual({
            status: "draft",
            kind: "steps",
        });
        expect(timingFunctionState("steps(")).toMatchObject({
            status: "invalid",
            source: "steps(",
        });
        expect(timingFunctionKind("steps(")).toBeUndefined();
        expect(timingFunctionState("ease-out-expo")).toEqual({
            status: "registry",
            kind: "ease-out-expo",
        });
    });
});
