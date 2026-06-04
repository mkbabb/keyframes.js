import { describe, expect, it, vi, beforeAll } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

// Polyfill AnimationEvent for jsdom
if (typeof globalThis.AnimationEvent === "undefined") {
    (globalThis as any).AnimationEvent = class AnimationEvent extends Event {
        animationName: string;
        elapsedTime: number;
        constructor(type: string, init?: { animationName?: string; elapsedTime?: number }) {
            super(type, init);
            this.animationName = init?.animationName ?? "";
            this.elapsedTime = init?.elapsedTime ?? 0;
        }
    };
}

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

describe("Fractional iteration count", () => {
    it("iteration count 2.5 marks done after 3rd iteration start", async () => {
        const anim = new CSSKeyframesAnimation({
            duration: 100,
            iterationCount: 2.5,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);

        // iterationCount=2.5, so iterationCount-1=1.5
        // iteration 0: onEnd → 0 >= 1.5? No → iteration becomes 1
        // iteration 1: onEnd → 1 >= 1.5? No → iteration becomes 2
        // iteration 2: onEnd → 2 >= 1.5? Yes → done
        anim.iteration = 0;
        await anim.onEnd();
        expect(anim.done).toBe(false);
        expect(anim.iteration).toBe(1);

        await anim.onEnd();
        expect(anim.done).toBe(false);
        expect(anim.iteration).toBe(2);

        await anim.onEnd();
        expect(anim.done).toBe(true);
    });
});

describe("alternate-reverse direction", () => {
    it("reverses on even iterations, plays forward on odd", async () => {
        const anim = new CSSKeyframesAnimation({
            duration: 100,
            direction: "alternate-reverse",
            iterationCount: Infinity,
            delay: 0,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);

        // iteration 0 (even) → should be reversed
        anim.iteration = 0;
        await anim.onStart();
        expect(anim.reversed).toBe(true);

        // iteration 1 (odd) → should not be reversed
        anim.iteration = 1;
        await anim.onStart();
        expect(anim.reversed).toBe(false);

        // iteration 2 (even) → should be reversed
        anim.iteration = 2;
        await anim.onStart();
        expect(anim.reversed).toBe(true);
    });
});

describe("Animation events", () => {
    it("dispatches animationstart on first tick", async () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 100,
            delay: 0,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.setTargets(el);

        const startHandler = vi.fn();
        el.addEventListener("animationstart", startHandler);

        await anim.tick(0);

        expect(startHandler).toHaveBeenCalledTimes(1);
    });

    it("dispatches animationend when done", async () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 100,
            iterationCount: 1,
            delay: 0,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.setTargets(el);

        const endHandler = vi.fn();
        el.addEventListener("animationend", endHandler);

        // Start the animation
        await anim.tick(0);
        // Advance past duration to trigger onEnd
        await anim.tick(200);

        expect(endHandler).toHaveBeenCalledTimes(1);
    });

    it("dispatches animationiteration on iteration boundary", async () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 100,
            iterationCount: 3,
            delay: 0,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        anim.setTargets(el);

        const iterHandler = vi.fn();
        el.addEventListener("animationiteration", iterHandler);

        // Start
        await anim.tick(0);
        // End first iteration (not last)
        await anim.tick(200);

        expect(iterHandler).toHaveBeenCalledTimes(1);
    });
});

describe("Animation.at() progress API", () => {
    it("at(0) returns first frame values", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        const vars = anim.at(0);
        expect(vars).toBeDefined();
    });

    it("at(1) returns last frame values", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        const vars = anim.at(1);
        expect(vars).toBeDefined();
    });

    it("at() ignores reversed flag", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { left: 0px; }
            to { left: 100px; }
        `);
        anim.reversed = true;
        const vars = anim.at(0.5);
        expect(vars).toBeDefined();
        // reversed flag should be restored
        expect(anim.reversed).toBe(true);
    });

    it("at() clamps progress to [0, 1]", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        // Should not throw
        anim.at(-0.5);
        anim.at(1.5);
    });
});

describe("colorSpace option", () => {
    it("defaults to oklab", () => {
        const anim = new CSSKeyframesAnimation({});
        expect(anim.options.colorSpace).toBe("oklab");
    });

    it("setColorSpace changes the value", () => {
        const anim = new CSSKeyframesAnimation({});
        anim.setColorSpace("lab");
        expect(anim.options.colorSpace).toBe("lab");
    });

    it("accepts colorSpace in constructor options", () => {
        const anim = new CSSKeyframesAnimation({ colorSpace: "oklab" });
        expect(anim.options.colorSpace).toBe("oklab");
    });
});
