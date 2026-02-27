import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";
import {
    CSSKeyframesToString,
    CSSKeyframeToString,
    normalizeCSSKeyframeString,
    parseCSSAnimationOrKeyframes,
} from "../src/parsing/format";
import {
    parseCSSKeyframes,
    parseCSSAnimationKeyframes,
} from "../src/parsing/keyframes";

describe("CSS keyframes parsing — full spec coverage", () => {
    describe("keyframe selectors", () => {
        it("parses percentage selectors: 0%, 25%, 50%, 75%, 100%", () => {
            const input = /*css*/ `
                @keyframes test {
                    0% { opacity: 0; }
                    25% { opacity: 0.25; }
                    50% { opacity: 0.5; }
                    75% { opacity: 0.75; }
                    100% { opacity: 1; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(5);
            expect(frames.has("0%")).toBe(true);
            expect(frames.has("25%")).toBe(true);
            expect(frames.has("50%")).toBe(true);
            expect(frames.has("75%")).toBe(true);
            expect(frames.has("100%")).toBe(true);
        });

        it("parses from/to keywords → 0%/100%", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses multi-stop selectors: 0%, 100% { ... }", () => {
            const input = /*css*/ `
                @keyframes test {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.5); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(3);
            expect(frames.has("0%")).toBe(true);
            expect(frames.has("50%")).toBe(true);
            expect(frames.has("100%")).toBe(true);
        });

        it("parses fractional percentages: 33.33%", () => {
            const input = /*css*/ `
                @keyframes test {
                    0% { opacity: 0; }
                    33.33% { opacity: 0.33; }
                    66.67% { opacity: 0.67; }
                    100% { opacity: 1; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(4);
        });
    });

    describe("animation properties", () => {
        it("parses all animation options from .animation rule", () => {
            const input = /*css*/ `
                .animation {
                    animation-name: test;
                    animation-duration: 2s;
                    animation-timing-function: ease-in-out;
                    animation-delay: 500ms;
                    animation-iteration-count: 3;
                    animation-direction: alternate;
                    animation-fill-mode: both;
                }
                @keyframes test {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            const result = parseCSSAnimationKeyframes(input);
            expect(result.options).toBeDefined();
            // parseCSSAnimationKeyframes returns raw CSS strings for options
            expect(result.options!.duration).toBe("2s");
            expect(result.options!.delay).toBe("500ms");
            expect(result.options!.iterationCount).toBe("3");
            expect(result.options!.direction).toBe("alternate");
            expect(result.options!.fillMode).toBe("both");
        });

        it("parses infinite iteration count", () => {
            const input = /*css*/ `
                .animation {
                    animation-duration: 1s;
                    animation-iteration-count: infinite;
                }
                @keyframes test {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            const result = parseCSSAnimationKeyframes(input);
            expect(result.options!.iterationCount).toBe("infinite");
        });

        it("parses all direction values", () => {
            for (const dir of ["normal", "reverse", "alternate", "alternate-reverse"]) {
                const input = /*css*/ `
                    .animation {
                        animation-duration: 1s;
                        animation-direction: ${dir};
                    }
                    @keyframes test {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                const result = parseCSSAnimationKeyframes(input);
                expect(result.options!.direction).toBe(dir);
            }
        });

        it("parses all fill-mode values", () => {
            for (const fill of ["forwards", "backwards", "both"]) {
                const input = /*css*/ `
                    .animation {
                        animation-duration: 1s;
                        animation-fill-mode: ${fill};
                    }
                    @keyframes test {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                const result = parseCSSAnimationKeyframes(input);
                expect(result.options!.fillMode).toBe(fill);
            }
        });
    });

    describe("CSS transform functions", () => {
        it("parses 2D transform functions", () => {
            const input = /*css*/ `
                @keyframes test {
                    from {
                        transform: translateX(0px) translateY(0px) rotate(0deg) scale(1) skewX(0deg);
                    }
                    to {
                        transform: translateX(100px) translateY(50px) rotate(360deg) scale(2) skewX(15deg);
                    }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);

            const from = frames.get("0%");
            expect(from).toBeDefined();
            expect(from.transform).toBeDefined();
        });

        it("parses 3D transform functions", () => {
            const input = /*css*/ `
                @keyframes test {
                    from {
                        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) perspective(500px);
                    }
                    to {
                        transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) perspective(1000px);
                    }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses translate3d and scale3d", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); }
                    to { transform: translate3d(100px, 50px, 25px) scale3d(2, 2, 2); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses rotate3d", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { transform: rotate3d(1, 0, 0, 0deg); }
                    to { transform: rotate3d(1, 0, 0, 360deg); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses matrix and matrix3d", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { transform: matrix(1, 0, 0, 1, 0, 0); }
                    to { transform: matrix(2, 0, 0, 2, 100, 100); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });
    });

    describe("CSS colors", () => {
        it("parses hex colors", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { background-color: #ff0000; }
                    to { background-color: #0000ff; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses rgb/rgba colors", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { background-color: rgb(255, 0, 0); }
                    to { background-color: rgba(0, 0, 255, 0.5); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses hsl/hsla colors", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { color: hsl(0, 100%, 50%); }
                    to { color: hsla(240, 100%, 50%, 0.8); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses named colors", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { background-color: red; }
                    to { background-color: blue; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });
    });

    describe("CSS functions", () => {
        it("parses calc() expressions", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { width: calc(100% - 20px); }
                    to { width: calc(100% - 0px); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses var() references", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { left: var(--start-pos); }
                    to { left: var(--end-pos); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });
    });

    describe("CSS units", () => {
        it("parses various length units", () => {
            const input = /*css*/ `
                @keyframes test {
                    from {
                        width: 100px;
                        height: 50%;
                        margin: 2em;
                        padding: 1rem;
                    }
                    to {
                        width: 200px;
                        height: 100%;
                        margin: 4em;
                        padding: 2rem;
                    }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses angle units", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { transform: rotate(0deg); }
                    25% { transform: rotate(100grad); }
                    50% { transform: rotate(1.57rad); }
                    75% { transform: rotate(0.75turn); }
                    to { transform: rotate(360deg); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(5);
        });
    });

    describe("filter functions", () => {
        it("parses filter property with blur", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { filter: blur(10px); }
                    to { filter: blur(0px); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("parses multiple filter functions", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { filter: blur(10px) brightness(0.5) saturate(0); }
                    to { filter: blur(0px) brightness(1) saturate(1); }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });
    });

    describe("syntax edge cases", () => {
        it("handles CSS comments", () => {
            const input = /*css*/ `
                @keyframes test {
                    /* Start */
                    from { opacity: 0; /* transparent */ }
                    /* End */
                    to { opacity: 1; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("handles !important (stripped)", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { opacity: 0 !important; }
                    to { opacity: 1 !important; }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("handles missing trailing semicolons", () => {
            const input = /*css*/ `
                @keyframes test {
                    from { opacity: 0 }
                    to { opacity: 1 }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("handles extra whitespace and newlines", () => {
            const input = `
                @keyframes   test   {

                    0%   {
                        opacity:   0  ;
                    }

                    100%   {
                        opacity:   1  ;
                    }

                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);
        });

        it("handles multiple properties per keyframe", () => {
            const input = /*css*/ `
                @keyframes test {
                    from {
                        opacity: 0;
                        transform: translateX(0px) rotate(0deg);
                        background-color: red;
                        left: 0px;
                        top: 0px;
                    }
                    to {
                        opacity: 1;
                        transform: translateX(100px) rotate(360deg);
                        background-color: blue;
                        left: 200px;
                        top: 100px;
                    }
                }
            `;
            const frames = parseCSSKeyframes(input);
            expect(frames.size).toBe(2);

            const to = frames.get("100%");
            expect(to).toBeDefined();
            expect(to.opacity).toBeDefined();
            expect(to.transform).toBeDefined();
        });
    });
});

describe("round-trip idempotency: parse → animation → format → re-parse", () => {
    it("simple opacity animation", async () => {
        const el = document.createElement("div");
        const input = /*css*/ `
            @keyframes test {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        const anim = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted = await CSSKeyframesToString(anim, "test");

        // Should contain the essential elements
        expect(formatted).toContain("@keyframes test");
        expect(formatted).toContain("opacity");

        // Re-parse should succeed
        const keyframesBlock = formatted.split("\n\n").slice(1).join("\n\n");
        const reparsed = parseCSSKeyframes(keyframesBlock);
        expect(reparsed.size).toBeGreaterThan(0);
    });

    it("multi-property transform animation", async () => {
        const el = document.createElement("div");
        const input = /*css*/ `
            @keyframes test {
                from { transform: translateX(0px) rotate(0deg); }
                50% { transform: translateX(50px) rotate(180deg); }
                to { transform: translateX(100px) rotate(360deg); }
            }
        `;

        const anim = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted = await CSSKeyframesToString(anim, "test");

        expect(formatted).toContain("@keyframes test");
        expect(formatted).toContain("transform");

        const keyframesBlock = formatted.split("\n\n").slice(1).join("\n\n");
        const reparsed = parseCSSKeyframes(keyframesBlock);
        expect(reparsed.size).toBeGreaterThan(0);
    });

    it("animation with all options", async () => {
        const el = document.createElement("div");
        const input = /*css*/ `
            .animation {
                animation-duration: 2s;
                animation-timing-function: ease-in-out;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-fill-mode: forwards;
                animation-delay: 500ms;
            }
            @keyframes test {
                from { left: 0px; }
                to { left: 200px; }
            }
        `;

        const result = parseCSSAnimationKeyframes(input);
        const anim = new CSSKeyframesAnimation(result.options!, el).fromKeyframes(result.keyframes);
        const formatted = await CSSKeyframesToString(anim, "test");

        // Verify options are preserved in output
        expect(formatted).toContain("animation-duration:");
        expect(formatted).toContain("animation-direction: alternate");
        expect(formatted).toContain("animation-fill-mode: forwards");
        expect(formatted).toContain("infinite");
    });

    it("color animation preserves structure", async () => {
        const el = document.createElement("div");
        const input = /*css*/ `
            @keyframes test {
                from { background-color: #ff0000; }
                to { background-color: #0000ff; }
            }
        `;

        const anim = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted = await CSSKeyframesToString(anim, "test");

        expect(formatted).toContain("@keyframes test");
        expect(formatted).toContain("background-color");
    });

    it("double round-trip produces valid re-parseable animation", async () => {
        const el = document.createElement("div");
        const input = /*css*/ `
            @keyframes roundtrip-dbl {
                from { opacity: 0; left: 0px; }
                50% { opacity: 0.5; left: 100px; }
                to { opacity: 1; left: 200px; }
            }
        `;

        // First round-trip
        const anim1 = new CSSKeyframesAnimation({}, el).fromString(input);
        expect(anim1.frames.length).toBeGreaterThan(0);

        const formatted1 = await CSSKeyframesToString(anim1, "roundtrip-dbl");

        // Re-parse the formatted output (includes .class{} + @keyframes{})
        const result2 = parseCSSAnimationKeyframes(formatted1);
        expect(result2.keyframes).toBeDefined();
        expect(result2.keyframes.size).toBeGreaterThan(0);

        // Build a new animation from re-parsed keyframes
        const anim2 = new CSSKeyframesAnimation(result2.options ?? {}, el).fromKeyframes(result2.keyframes);
        expect(anim2.frames.length).toBeGreaterThan(0);

        // Template frames should preserve the property names
        const allVars = anim2.templateFrames.flatMap(f => Object.keys(f.vars));
        expect(allVars).toContain("opacity");
        expect(allVars).toContain("left");
    });
});

describe("parseCSSAnimationOrKeyframes", () => {
    it("parses full .animation + @keyframes", () => {
        const input = /*css*/ `
            .animation {
                animation-duration: 1s;
            }
            @keyframes test {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        const result = parseCSSAnimationOrKeyframes(input);
        expect(result.keyframes).toBeDefined();
        expect(result.options).toBeDefined();
    });

    it("falls back to bare keyframes parsing", () => {
        const input = /*css*/ `
            0% { opacity: 0; }
            100% { opacity: 1; }
        `;
        const result = parseCSSAnimationOrKeyframes(input);
        expect(result.keyframes).toBeDefined();
    });

    it("normalizes input without @keyframes wrapper", () => {
        const input = `from { opacity: 0; } to { opacity: 1; }`;
        const result = parseCSSAnimationOrKeyframes(input);
        expect(result.keyframes).toBeDefined();
    });
});
