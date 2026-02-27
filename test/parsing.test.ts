import { describe, expect, it } from "vitest";
import {
    parseCSSTime,
    reverseCSSTime,
    reverseCSSIterationCount,
    parseCSSKeyframes,
    parseCSSAnimationKeyframes,
} from "../src/parsing/keyframes";

describe("parseCSSTime", () => {
    it("parses seconds to milliseconds", () => {
        expect(parseCSSTime("1s")).toBe(1000);
        expect(parseCSSTime("0.5s")).toBe(500);
        expect(parseCSSTime("0s")).toBe(0);
    });

    it("parses milliseconds", () => {
        expect(parseCSSTime("1ms")).toBe(1);
        expect(parseCSSTime("100ms")).toBe(100);
        expect(parseCSSTime("500ms")).toBe(500);
    });
});

describe("reverseCSSIterationCount", () => {
    it("Infinity → 'infinite'", () => {
        expect(reverseCSSIterationCount(Infinity)).toBe("infinite");
    });

    it("3 → '3'", () => {
        expect(reverseCSSIterationCount(3)).toBe("3");
    });

    it("1 → '1'", () => {
        expect(reverseCSSIterationCount(1)).toBe("1");
    });
});

describe("parseCSSAnimationKeyframes", () => {
    it("parses full .animation + @keyframes input", () => {
        const input = /*css*/ `
            .animation {
                animation-duration: 1000ms;
                animation-timing-function: ease-in-out;
                animation-iteration-count: 1;
                animation-direction: normal;
                animation-fill-mode: forwards;
            }

            @keyframes animation {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `;

        const result = parseCSSAnimationKeyframes(input);
        expect(result).toHaveProperty("keyframes");
        expect(result.keyframes.size).toBe(2);
    });
});

describe("parseCSSKeyframes", () => {
    it("parses multi-stop keyframes", () => {
        const input = /*css*/ `
            @keyframes test {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.5);
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(3);
        expect(frames.has("0%")).toBe(true);
        expect(frames.has("50%")).toBe(true);
        expect(frames.has("100%")).toBe(true);
    });

    it("parses bare keyframes (no @keyframes wrapper)", () => {
        const input = /*css*/ `
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
        expect(frames.has("0%")).toBe(true);
        expect(frames.has("100%")).toBe(true);
    });

    it("parses from/to keywords", () => {
        const input = /*css*/ `
            @keyframes test {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
    });

    it("strips CSS comments and parses correctly", () => {
        const input = /*css*/ `
            @keyframes test {
                /* Start frame */
                0% {
                    opacity: 0; /* fully transparent */
                }
                /* End frame */
                100% {
                    opacity: 1;
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
        expect(frames.has("0%")).toBe(true);
        expect(frames.has("100%")).toBe(true);
    });

    it("ignores !important in keyframe declarations", () => {
        const input = /*css*/ `
            @keyframes test {
                0% {
                    opacity: 0 !important;
                }
                100% {
                    opacity: 1 !important;
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
        expect(frames.has("0%")).toBe(true);
        expect(frames.has("100%")).toBe(true);
    });

    it("handles optional trailing semicolons", () => {
        const input = /*css*/ `
            @keyframes test {
                0% {
                    opacity: 0
                }
                100% {
                    opacity: 1
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
        expect(frames.has("0%")).toBe(true);
        expect(frames.has("100%")).toBe(true);
    });

    it("parses per-keyframe animation-timing-function", () => {
        const input = /*css*/ `
            @keyframes test {
                0% {
                    opacity: 0;
                    animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
                }
                100% {
                    opacity: 1;
                }
            }
        `;

        const frames = parseCSSKeyframes(input);
        expect(frames.size).toBe(2);
        expect(frames.has("0%")).toBe(true);
        // The timing function should be parsed as part of the frame
        const frame0 = frames.get("0%");
        expect(frame0).toBeDefined();
        expect(frame0.animationTimingFunction).toBeDefined();
    });
});
