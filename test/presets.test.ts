import { describe, expect, it } from "vitest";
import {
    // PKG-3 (L.W8 §S4): the card-flip preset was renamed `flip` → `flipPreset`
    // to clear the d.ts collision with the LIGHT top-level `flip` (FLIP-layout)
    // export. The access path is now `presets.flipPreset`.
    fadeIn, fadeOut, pulse, shake, bounce, flipPreset,
    rotateIn, slideIn, heartbeat, glow, typewriter,
    rainbowText, warpLeft, warpRight,
    blurIn, blurOut, blurInOut,
    progressBar, skeletonLoading, textFocusBlur,
    gradientBackground, rotateScale, typingCursor,
    accordionExpand, notificationBounce, spinner,
    parallaxScroll, slideInLeft, slideOutLeft,
    slideInRight, slideOutRight,
    hover, jumpUp, jumpDown,
} from "../src/animation/presets";

const presets = {
    fadeIn, fadeOut, pulse, shake, bounce, flipPreset,
    rotateIn, slideIn, heartbeat, glow, typewriter,
    rainbowText, warpLeft, warpRight,
    blurIn, blurOut, blurInOut,
    progressBar, skeletonLoading, textFocusBlur,
    gradientBackground, rotateScale, typingCursor,
    accordionExpand, notificationBounce, spinner,
    parallaxScroll, slideInLeft, slideOutLeft,
    slideInRight, slideOutRight,
    hover, jumpUp, jumpDown,
};

describe("animation presets", () => {
    for (const [name, factory] of Object.entries(presets)) {
        it(`${name}() returns CSSKeyframesAnimation with frames.length > 0`, () => {
            const anim = factory();
            expect(anim.frames.length).toBeGreaterThan(0);
        });
    }

    it("options override: fadeIn({ duration: 500 }).options.duration === 500", () => {
        const anim = fadeIn({ duration: 500 });
        expect(anim.options.duration).toBe(500);
    });

    it("options override: bounce({ iterationCount: 3 }) works", () => {
        const anim = bounce({ iterationCount: 3 });
        expect(anim.options.iterationCount).toBe(3);
    });

    describe("edge cases", () => {
        it("shake: multi-stop parse works", () => {
            const anim = shake();
            expect(anim.frames.length).toBeGreaterThan(0);
        });

        it("bounce: multi-stop parse works", () => {
            const anim = bounce();
            expect(anim.frames.length).toBeGreaterThan(0);
        });

        it("typewriter: steppedEase timing function works", () => {
            const anim = typewriter();
            expect(anim.frames.length).toBeGreaterThan(0);
            expect(typeof anim.options.timingFunction.fn).toBe("function");
        });

        it("spinner: border-radius shorthand parses", () => {
            const anim = spinner();
            expect(anim.frames.length).toBeGreaterThan(0);
        });
    });
});
