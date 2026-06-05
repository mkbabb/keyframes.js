import { describe, expect, it, vi } from "vitest";
import { animate } from "../src/animation/animate";
import { CSSKeyframesAnimation } from "../src/animation/engine";

describe("animate() — front-door dispatch", () => {
    it("a CSS string routes to fromString (NOT fromKeyframes / fromVars)", () => {
        const fromString = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromString",
        );
        const fromKeyframes = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromKeyframes",
        );
        const fromVars = vi.spyOn(CSSKeyframesAnimation.prototype, "fromVars");

        const el = document.createElement("div");
        animate(el, `from { opacity: 0 } to { opacity: 1 }`, {
            autoPlay: false,
        });

        expect(fromString).toHaveBeenCalledTimes(1);
        expect(fromKeyframes).not.toHaveBeenCalled();
        expect(fromVars).not.toHaveBeenCalled();

        fromString.mockRestore();
        fromKeyframes.mockRestore();
        fromVars.mockRestore();
    });

    it("a keyframe map routes to fromKeyframes", () => {
        const fromString = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromString",
        );
        const fromKeyframes = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromKeyframes",
        );
        const fromVars = vi.spyOn(CSSKeyframesAnimation.prototype, "fromVars");

        const el = document.createElement("div");
        animate(
            el,
            { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
            { autoPlay: false },
        );

        expect(fromKeyframes).toHaveBeenCalledTimes(1);
        expect(fromString).not.toHaveBeenCalled();
        expect(fromVars).not.toHaveBeenCalled();

        fromString.mockRestore();
        fromKeyframes.mockRestore();
        fromVars.mockRestore();
    });

    it("a Map keyframe input routes to fromKeyframes", () => {
        const fromKeyframes = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromKeyframes",
        );

        const el = document.createElement("div");
        const map = new Map<string, any>([
            ["0%", { opacity: 0 }],
            ["100%", { opacity: 1 }],
        ]);
        animate(el, map, { autoPlay: false });

        expect(fromKeyframes).toHaveBeenCalledTimes(1);
        fromKeyframes.mockRestore();
    });

    it("a vars array routes to fromVars", () => {
        const fromString = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromString",
        );
        const fromKeyframes = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromKeyframes",
        );
        const fromVars = vi.spyOn(CSSKeyframesAnimation.prototype, "fromVars");

        const el = document.createElement("div");
        animate(el, [{ opacity: 0 }, { opacity: 1 }], { autoPlay: false });

        expect(fromVars).toHaveBeenCalledTimes(1);
        expect(fromString).not.toHaveBeenCalled();
        expect(fromKeyframes).not.toHaveBeenCalled();

        fromString.mockRestore();
        fromKeyframes.mockRestore();
        fromVars.mockRestore();
    });
});

describe("animate() — targeting, play, and the control handle", () => {
    it("returns the constructed animation as the control handle", () => {
        const el = document.createElement("div");
        const handle = animate(el, `from { opacity: 0 } to { opacity: 1 }`, {
            autoPlay: false,
        });
        expect(handle).toBeInstanceOf(CSSKeyframesAnimation);
        // The handle carries the lifecycle control surface.
        expect(typeof handle.play).toBe("function");
        expect(typeof handle.pause).toBe("function");
        expect(typeof handle.stop).toBe("function");
    });

    it("auto-targets the supplied element", () => {
        const el = document.createElement("div");
        const handle = animate(el, [{ opacity: 0 }, { opacity: 1 }], {
            autoPlay: false,
        });
        expect(handle.targets).toEqual([el]);
    });

    it("accepts an array of targets", () => {
        const a = document.createElement("div");
        const b = document.createElement("div");
        const handle = animate([a, b], [{ opacity: 0 }, { opacity: 1 }], {
            autoPlay: false,
        });
        expect(handle.targets).toEqual([a, b]);
    });

    it("forwards animation options to the constructed animation", () => {
        const el = document.createElement("div");
        const handle = animate(el, [{ opacity: 0 }, { opacity: 1 }], {
            duration: 333,
            autoPlay: false,
        });
        expect(handle.options.duration).toBe(333);
    });

    it("autoPlay defaults to true — play() is kicked off", () => {
        const play = vi.spyOn(CSSKeyframesAnimation.prototype, "play");
        const el = document.createElement("div");
        const handle = animate(el, [{ opacity: 0 }, { opacity: 1 }], {
            duration: 50,
        });
        expect(play).toHaveBeenCalledTimes(1);
        play.mockRestore();
        return handle.play(); // re-entrant; awaits completion to settle the loop
    });

    it("autoPlay: false constructs + targets WITHOUT playing", () => {
        const play = vi.spyOn(CSSKeyframesAnimation.prototype, "play");
        const el = document.createElement("div");
        animate(el, [{ opacity: 0 }, { opacity: 1 }], { autoPlay: false });
        expect(play).not.toHaveBeenCalled();
        play.mockRestore();
    });

    it("a played handle reaches its final frame", async () => {
        const el = document.createElement("div");
        const handle = animate(
            el,
            `from { opacity: 0 } to { opacity: 1 }`,
            { duration: 50, useWAAPI: false },
        );
        await handle.play(); // re-entrant — same promise the front door started
        expect(Number.parseFloat(el.style.opacity)).toBeCloseTo(1, 5);
    });
});
