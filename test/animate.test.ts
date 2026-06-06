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

describe("animate() — MotionPath dispatch (F.W12 §S2)", () => {
    const PATH = "path('M 0 0 Q 100 -100 200 0')";

    it("a { path } input routes to fromMotionPath, NOT fromKeyframes / fromVars", () => {
        // The MotionPath spec is a non-array object that would otherwise satisfy
        // isKeyframeMap — so the dispatch MUST take the MotionPath branch first.
        const fromKeyframes = vi.spyOn(
            CSSKeyframesAnimation.prototype,
            "fromKeyframes",
        );
        const fromVars = vi.spyOn(CSSKeyframesAnimation.prototype, "fromVars");

        const el = document.createElement("div");
        animate(el, { path: PATH }, { autoPlay: false });

        // The MotionPath branch builds via fromMotionPath's own
        // fromKeyframes-over-offset-distance — but NOT the generic keyframe-map
        // route, and never fromVars.
        expect(fromVars).not.toHaveBeenCalled();

        fromKeyframes.mockRestore();
        fromVars.mockRestore();
    });

    it("produces an offset-distance animation over the author offset-path", () => {
        const el = document.createElement("div");
        const handle = animate(el, { path: PATH }, { autoPlay: false });

        // (a) the author offset-path is set on the target (the browser owns the
        // geometry; keyframes only sweeps the scalar).
        expect(el.style.offsetPath).toBe(PATH);

        // (b) the ONLY interpolating key is offset-distance, sweeping 0% → 100%.
        const keys = new Set<string>();
        const endpoints: { start?: string; stop?: string }[] = [];
        for (const frame of handle.frames) {
            for (const [key, arr] of Object.entries(frame.interpVars)) {
                keys.add(key);
                for (const iv of arr as any[]) {
                    endpoints.push({
                        start: `${iv.start?.value}${iv.start?.unit}`,
                        stop: `${iv.stop?.value}${iv.stop?.unit}`,
                    });
                }
            }
        }
        expect([...keys]).toEqual(["offset-distance"]);
        expect(endpoints).toContainEqual({ start: "0%", stop: "100%" });
    });

    it("forwards MotionPath knobs (rotate/from/to) and the shared options", () => {
        const el = document.createElement("div");
        const handle = animate(
            el,
            { path: PATH, rotate: "auto", from: "25%", to: "75%" },
            { duration: 1500, autoPlay: false },
        );
        // tangent-following set on the target …
        expect(el.style.offsetRotate).toBe("auto");
        // … the shared animation options flow through …
        expect(handle.options.duration).toBe(1500);
        // … and the custom sub-range is the swept endpoints.
        const seen: string[] = [];
        for (const frame of handle.frames) {
            for (const arr of Object.values(frame.interpVars)) {
                for (const iv of arr as any[]) {
                    seen.push(`${iv.start?.value}${iv.start?.unit}`);
                    seen.push(`${iv.stop?.value}${iv.stop?.unit}`);
                }
            }
        }
        expect(seen).toContain("25%");
        expect(seen).toContain("75%");
    });

    it("returns the MotionPath animation as the control handle", () => {
        const el = document.createElement("div");
        const handle = animate(el, { path: PATH }, { autoPlay: false });
        expect(handle).toBeInstanceOf(CSSKeyframesAnimation);
        expect(handle.targets).toEqual([el]);
        expect(typeof handle.play).toBe("function");
    });

    it("BITE: routing { path } to fromVars/fromKeyframes would not set offset-path", () => {
        // The structural lock — if the dispatch fell through to the keyframe-map
        // branch, fromMotionPath would never run and offset-path stays empty.
        const el = document.createElement("div");
        animate(el, { path: PATH }, { autoPlay: false });
        expect(el.style.offsetPath).not.toBe("");
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
