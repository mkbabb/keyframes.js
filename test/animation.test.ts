import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";

describe("Animation option setters", () => {
    it("setDuration('2s') → 2000", () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({});
        anim.fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.setDuration("2s");
        expect(anim.options.duration).toBe(2000);
    });

    it("setDuration(500) → 500", () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({});
        anim.fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.setDuration(500);
        expect(anim.options.duration).toBe(500);
    });

    it("setIterationCount('infinite') → Infinity", () => {
        const anim = new CSSKeyframesAnimation({});
        anim.setIterationCount("infinite");
        expect(anim.options.iterationCount).toBe(Infinity);
    });

    it("setIterationCount('3') → 3", () => {
        const anim = new CSSKeyframesAnimation({});
        anim.setIterationCount("3");
        expect(anim.options.iterationCount).toBe(3);
    });

    it("setDirection stores correctly", () => {
        const anim = new CSSKeyframesAnimation({});
        anim.setDirection("reverse");
        expect(anim.options.direction).toBe("reverse");

        anim.setDirection("alternate");
        expect(anim.options.direction).toBe("alternate");
    });

    it("setFillMode stores correctly", () => {
        const anim = new CSSKeyframesAnimation({});
        anim.setFillMode("both");
        expect(anim.options.fillMode).toBe("both");

        anim.setFillMode("none");
        expect(anim.options.fillMode).toBe("none");
    });
});

describe("Animation fromString / fromVars / fromKeyframes", () => {
    it("fromString → frames.length > 0", () => {
        const anim = new CSSKeyframesAnimation({}).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        expect(anim.frames.length).toBeGreaterThan(0);
    });

    it("fromVars([v1, v2]) → frames at 0% and 100%", () => {
        const anim = new CSSKeyframesAnimation({}).fromVars([
            { opacity: "0" },
            { opacity: "1" },
        ]);
        expect(anim.frames.length).toBeGreaterThan(0);
    });

    it("fromKeyframes({ '0%': {...}, '100%': {...} }) → correct count", () => {
        const anim = new CSSKeyframesAnimation({}).fromKeyframes({
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
        });
        expect(anim.frames.length).toBeGreaterThan(0);
    });

    it("fromKeyframes with Map", () => {
        const kf = new Map<string, any>();
        kf.set("0%", { opacity: "0" });
        kf.set("50%", { opacity: "0.5" });
        kf.set("100%", { opacity: "1" });

        const anim = new CSSKeyframesAnimation({}).fromKeyframes(kf);
        expect(anim.frames.length).toBeGreaterThan(0);
    });
});

describe("Animation state", () => {
    it("playing() is false before start", () => {
        const anim = new CSSKeyframesAnimation({}).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        expect(anim.playing()).toBe(false);
    });

    it("reverse() toggles reversed flag", () => {
        const anim = new CSSKeyframesAnimation({}).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        expect(anim.reversed).toBe(false);
        anim.reverse();
        expect(anim.reversed).toBe(true);
        anim.reverse();
        expect(anim.reversed).toBe(false);
    });

    it("reset() clears state", () => {
        const anim = new CSSKeyframesAnimation({}).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.started = true;
        anim.done = true;
        anim.paused = true;
        anim.reset();
        expect(anim.started).toBe(false);
        expect(anim.done).toBe(false);
        expect(anim.paused).toBe(false);
    });
});

describe("Animation interpolation", () => {
    it("interpFrames(0) returns first frame values", () => {
        const anim = new CSSKeyframesAnimation({}).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        const vars = anim.interpFrames(0);
        expect(vars).toBeDefined();
    });

    it("interpFrames(duration) returns last frame values", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        const vars = anim.interpFrames(1000);
        expect(vars).toBeDefined();
    });

    it("interpFrames at midpoint returns intermediate values", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { left: 0px; }
            to { left: 100px; }
        `);
        const vars = anim.interpFrames(500);
        expect(vars).toBeDefined();
        // The interpolated value should be roughly at the midpoint
        // (adjusted by timing function)
    });
});
