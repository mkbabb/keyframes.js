import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";
import { CSSKeyframesToString } from "../src/animation/format";

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

describe("memoized parser cache isolation", () => {
    it("two fromString calls with identical CSS produce independent animations", () => {
        const css = `
            @keyframes cache-test {
                0% { opacity: 0; transform: translateX(0px); }
                100% { opacity: 1; transform: translateX(100px); }
            }
        `;

        const anim1 = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "linear",
        }).fromString(css);

        const anim2 = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "linear",
        }).fromString(css);

        // Interpolate anim1 to t=1000 (end)
        anim1.interpFrames(1000);

        // anim2 at t=0 should still return the start values, not anim1's end values
        const anim2At0 = parseFloat(String(anim2.interpFrames(0)["opacity"]));
        expect(anim2At0).toBeCloseTo(0, 1);
    });

    it("fromString does not corrupt the memoized parse cache", () => {
        const css = `
            @keyframes corruption-test {
                0% { left: 0px; }
                100% { left: 200px; }
            }
        `;

        const anim1 = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "linear",
        }).fromString(css);

        // Mutate anim1's state
        anim1.interpFrames(500);
        anim1.interpFrames(1000);

        // Create a second animation from the same CSS — should get fresh values
        const anim2 = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "linear",
        }).fromString(css);

        const val = parseFloat(String(anim2.interpFrames(250)["left"]));
        expect(val).toBeCloseTo(50, 0);
    });
});

describe("animation interpolation equivalence", () => {
    describe("linear interpolation via fromVars", () => {
        it("interpolates linearly at midpoint (t=0.5)", () => {
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromVars([
                { opacity: "0" },
                { opacity: "1" },
            ]);

            const vars = anim.interpFrames(500);
            const opacityVal = parseFloat(String(vars["opacity"]));
            expect(opacityVal).toBeCloseTo(0.5, 1);
        });

        it("interpolates linearly at quarter points", () => {
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromVars([
                { left: "0px" },
                { left: "100px" },
            ]);

            // Extract values immediately — interpFrames mutates InterpolatedVar.value in-place,
            // so a second call overwrites flatVars references from the first call.
            const val25 = parseFloat(String(anim.interpFrames(250)["left"]));
            const val75 = parseFloat(String(anim.interpFrames(750)["left"]));

            expect(val25).toBeCloseTo(25, 0);
            expect(val75).toBeCloseTo(75, 0);
        });

        it("returns exact start/end values at boundaries", () => {
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromVars([
                { top: "11px" },
                { top: "211px" },
            ]);

            // Extract immediately — interpFrames mutates in-place, second call overwrites first.
            const val0 = parseFloat(String(anim.interpFrames(0)["top"]));
            const val1000 = parseFloat(String(anim.interpFrames(1000)["top"]));

            expect(val0).toBeCloseTo(11, 0);
            expect(val1000).toBeCloseTo(211, 0);
        });
    });

    describe("multi-stop keyframes interpolation", () => {
        it("interpolates across 3 keyframe stops", () => {
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromKeyframes({
                "0%": { width: "0px" },
                "50%": { width: "100px" },
                "100%": { width: "0px" },
            });

            const at250 = anim.interpFrames(250);
            expect(parseFloat(String(at250["width"]))).toBeCloseTo(50, 0);

            const at500 = anim.interpFrames(500);
            expect(parseFloat(String(at500["width"]))).toBeCloseTo(100, 0);

            const at750 = anim.interpFrames(750);
            expect(parseFloat(String(at750["width"]))).toBeCloseTo(50, 0);
        });
    });

    describe("direction equivalence", () => {
        it("reverse direction flips interpolation", () => {
            const normal = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
                direction: "normal",
            }).fromVars([
                { height: "0px" },
                { height: "100px" },
            ]);

            const reverse = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
                direction: "reverse",
            }).fromVars([
                { right: "0px" },
                { right: "100px" },
            ]);
            reverse.reversed = true;

            // Normal at t=250 should equal reverse at t=750
            const normalAt250 = parseFloat(String(normal.interpFrames(250)["height"]));
            const reverseAt750 = parseFloat(String(reverse.interpFrames(750)["right"]));

            expect(normalAt250).toBeCloseTo(reverseAt750, 0);
        });
    });

    describe("fill mode behavior", () => {
        it("fillForwards applies last frame values", () => {
            const el = document.createElement("div");
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                fillMode: "forwards",
                timingFunction: "linear",
            }, el).fromVars([
                { bottom: "0px" },
                { bottom: "100px" },
            ]);

            anim.fillForwards();

            const vars = anim.interpFrames(1000);
            expect(parseFloat(String(vars["bottom"]))).toBeCloseTo(100, 0);
        });

        it("fillBackwards applies first frame values", () => {
            const el = document.createElement("div");
            const anim = new CSSKeyframesAnimation({
                duration: 1000,
                fillMode: "backwards",
                timingFunction: "linear",
            }, el).fromVars([
                { margin: "10px" },
                { margin: "50px" },
            ]);

            anim.fillBackwards();

            const vars = anim.interpFrames(0);
            expect(parseFloat(String(vars["margin"]))).toBeCloseTo(10, 0);
        });
    });

    describe("iteration count behavior", () => {
        it("single iteration ends correctly", async () => {
            const anim = new CSSKeyframesAnimation({
                duration: 100,
                iterationCount: 1,
                useWAAPI: false,
            }).fromVars([
                { padding: "0px" },
                { padding: "10px" },
            ]);

            anim.iteration = 0;
            await anim.onEnd();
            expect(anim.done).toBe(true);
        });

        it("multiple iterations don't end early", async () => {
            const anim = new CSSKeyframesAnimation({
                duration: 100,
                iterationCount: 3,
                useWAAPI: false,
            }).fromVars([
                { padding: "20px" },
                { padding: "30px" },
            ]);

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

        it("infinite iteration never ends", async () => {
            const anim = new CSSKeyframesAnimation({
                duration: 100,
                iterationCount: Infinity,
                useWAAPI: false,
            }).fromVars([
                { padding: "40px" },
                { padding: "50px" },
            ]);

            for (let i = 0; i < 100; i++) {
                anim.iteration = i;
                await anim.onEnd();
                expect(anim.done).toBe(false);
            }
        });
    });

    describe("alternate direction behavior", () => {
        it("alternate: even iterations forward, odd iterations reversed", async () => {
            const anim = new CSSKeyframesAnimation({
                duration: 100,
                direction: "alternate",
                iterationCount: Infinity,
                useWAAPI: false,
            }).fromVars([
                { padding: "60px" },
                { padding: "70px" },
            ]);

            anim.iteration = 0;
            await anim.onStart();
            expect(anim.reversed).toBe(false);

            anim.iteration = 1;
            await anim.onStart();
            expect(anim.reversed).toBe(true);

            anim.iteration = 2;
            await anim.onStart();
            expect(anim.reversed).toBe(false);
        });

        it("alternate-reverse: even iterations reversed, odd iterations forward", async () => {
            const anim = new CSSKeyframesAnimation({
                duration: 100,
                direction: "alternate-reverse",
                iterationCount: Infinity,
                useWAAPI: false,
            }).fromVars([
                { padding: "80px" },
                { padding: "90px" },
            ]);

            anim.iteration = 0;
            await anim.onStart();
            expect(anim.reversed).toBe(true);

            anim.iteration = 1;
            await anim.onStart();
            expect(anim.reversed).toBe(false);
        });
    });

    describe("CSS output matches library state", () => {
        it("generated CSS string represents the animation faithfully", async () => {
            const el = document.createElement("div");
            const name = "css-output-test";
            const anim = new CSSKeyframesAnimation({
                duration: 2000,
                iterationCount: 3,
                direction: "alternate",
                fillMode: "forwards",
                timingFunction: "ease-in-out",
            }, el).fromString(`
                @keyframes ${name} {
                    0% { opacity: 0; transform: translateX(0px); }
                    50% { opacity: 0.5; transform: translateX(50px); }
                    100% { opacity: 1; transform: translateX(100px); }
                }
            `);

            const cssOutput = await CSSKeyframesToString(anim, name);

            expect(cssOutput).toContain("animation-duration: 2000ms");
            expect(cssOutput).toContain("animation-iteration-count: 3");
            expect(cssOutput).toContain("animation-direction: alternate");
            expect(cssOutput).toContain("animation-fill-mode: forwards");
            expect(cssOutput).toContain("ease-in-out");
            expect(cssOutput).toContain(`@keyframes ${name}`);
            expect(cssOutput).toContain("opacity");
            expect(cssOutput).toContain("transform");
        });

        it("fromString then CSSKeyframesToString preserves animation name", async () => {
            const el = document.createElement("div");
            const name = "preserve-name-test";
            const anim = new CSSKeyframesAnimation({}, el).fromString(`
                @keyframes ${name} {
                    0% { left: 0px; }
                    100% { left: 100px; }
                }
            `);

            const output = await CSSKeyframesToString(anim, name);
            expect(output).toContain(`@keyframes ${name}`);
            expect(output).toContain(`animation-name: ${name}`);
        });
    });

    describe("easing functions affect interpolation", () => {
        it("ease-in produces slower start than linear", () => {
            const linear = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromVars([
                { left: "200px" },
                { left: "400px" },
            ]);

            const easeIn = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "ease-in",
            }).fromVars([
                { left: "500px" },
                { left: "700px" },
            ]);

            const linearAt250 = parseFloat(String(linear.interpFrames(250)["left"]));
            const easeInAt250 = parseFloat(String(easeIn.interpFrames(250)["left"]));

            // Normalize: linear goes 200→400 (range 200), easeIn goes 500→700 (range 200)
            const linearPct = (linearAt250 - 200) / 200;
            const easeInPct = (easeInAt250 - 500) / 200;

            // ease-in should have less progress than linear at t=0.25
            expect(easeInPct).toBeLessThan(linearPct);
        });

        it("ease-out produces faster start than linear", () => {
            const linear = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "linear",
            }).fromVars([
                { left: "800px" },
                { left: "1000px" },
            ]);

            const easeOut = new CSSKeyframesAnimation({
                duration: 1000,
                timingFunction: "ease-out",
            }).fromVars([
                { left: "1100px" },
                { left: "1300px" },
            ]);

            const linearAt250 = parseFloat(String(linear.interpFrames(250)["left"]));
            const easeOutAt250 = parseFloat(String(easeOut.interpFrames(250)["left"]));

            const linearPct = (linearAt250 - 800) / 200;
            const easeOutPct = (easeOutAt250 - 1100) / 200;

            // ease-out should have more progress than linear at t=0.25
            expect(easeOutPct).toBeGreaterThan(linearPct);
        });
    });
});
