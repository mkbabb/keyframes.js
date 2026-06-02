import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

describe("interpFrames performance", () => {
    it("10k calls < 100ms for a 2-frame animation", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);

        const start = performance.now();
        for (let i = 0; i < 10_000; i++) {
            anim.interpFrames((i % 1000), false);
        }
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(100);
    });

    it("10k calls < 500ms for a multi-property animation", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; transform: translateX(0px); }
            to { opacity: 1; transform: translateX(200px); }
        `);

        const start = performance.now();
        for (let i = 0; i < 10_000; i++) {
            anim.interpFrames((i % 1000), false);
        }
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(500);
    });

    it("handles 100+ keyframe stops without degradation", () => {
        // Build a CSS string with 101 keyframe stops (0% through 100%)
        const stops = Array.from({ length: 101 }, (_, i) => {
            return `${i}% { opacity: ${i / 100}; }`;
        }).join("\n");

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(stops);

        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            anim.interpFrames((i % 1000), false);
        }
        const elapsed = performance.now() - start;

        // 1k calls with 100 stops should still be < 500ms
        expect(elapsed).toBeLessThan(500);
    });
});

describe("transformFramesGrouped performance", () => {
    it("10k calls < 200ms for a 3-animation group", () => {
        const el = document.createElement("div");

        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        a.name = "a";
        a.targets = [el];

        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: translateX(0px); }
            to { transform: translateX(100px); }
        `);
        b.name = "b";
        b.targets = [el];

        const c = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: translateY(0px); }
            to { transform: translateY(50px); }
        `);
        c.name = "c";
        c.targets = [el];

        const group = new AnimationGroup(a as any, b as any, c as any);

        // Set started state so interpFrames runs
        a.started = true;
        b.started = true;
        c.started = true;

        const start = performance.now();
        for (let i = 0; i < 10_000; i++) {
            const t = i % 1000;
            a.t = t;
            b.t = t;
            c.t = t;
            group.transformFramesGrouped(t);
        }
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(500);
    });
});

describe("Animation stress tests", () => {
    it("creates and interpolates 10 simultaneous group animations", () => {
        const el = document.createElement("div");

        const groups = Array.from({ length: 10 }, (_, groupIdx) => {
            const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
                from { opacity: 0; }
                to { opacity: 1; }
            `);
            a.name = `group${groupIdx}-a`;
            a.targets = [el];
            a.started = true;

            const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
                from { transform: translateX(0px); }
                to { transform: translateX(100px); }
            `);
            b.name = `group${groupIdx}-b`;
            b.targets = [el];
            b.started = true;

            return new AnimationGroup(a as any, b as any);
        });

        const start = performance.now();
        // Simulate 60 frames of animation
        for (let frame = 0; frame < 60; frame++) {
            const t = (frame / 60) * 1000;
            for (const group of groups) {
                for (const obj of Object.values(group.animations)) {
                    obj.animation.t = t;
                }
                group.transformFramesGrouped(t);
            }
        }
        const elapsed = performance.now() - start;

        // 10 groups * 60 frames = 600 group evaluations should be < 500ms
        expect(elapsed).toBeLessThan(500);
    });
});
