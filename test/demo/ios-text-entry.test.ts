import { afterEach, describe, expect, it, vi } from "vitest";
import {
    clampIOSNoZoomFontSize,
    isIOSLikePlatform,
} from "../../demo/@/utils/iosTextEntry";

// R.W3 §2F replaced the deprecated `navigator.platform` heuristic with the modern
// idiom: UA `iPad|iPhone|iPod` OR (maxTouchPoints > 1 AND the `-webkit-touch-callout`
// feature-detect). The helpers read the GLOBAL `navigator`/`CSS`, so the test stubs
// those globals (the standard pattern for platform-detection code) rather than
// injecting a navigator-like object.
function stubPlatform(opts: {
    userAgent: string;
    maxTouchPoints: number;
    touchCallout: boolean;
}) {
    vi.stubGlobal("navigator", {
        userAgent: opts.userAgent,
        maxTouchPoints: opts.maxTouchPoints,
    });
    vi.stubGlobal("CSS", {
        supports: (q: string) => q.includes("touch-callout") && opts.touchCallout,
    });
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("ios text entry helpers", () => {
    it("detects iPhone and iPad user agents as iOS", () => {
        stubPlatform({
            userAgent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
            maxTouchPoints: 5,
            touchCallout: false,
        });
        expect(isIOSLikePlatform()).toBe(true);

        stubPlatform({
            userAgent:
                "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
            maxTouchPoints: 5,
            touchCallout: false,
        });
        expect(isIOSLikePlatform()).toBe(true);
    });

    it("detects iPadOS desktop mode (Macintosh UA + touch + -webkit-touch-callout)", () => {
        // iPadOS-in-desktop-mode reports a Macintosh UA; the modern signal is
        // touch support PLUS the -webkit-touch-callout feature (Safari/iOS only).
        stubPlatform({
            userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15",
            maxTouchPoints: 5,
            touchCallout: true,
        });
        expect(isIOSLikePlatform()).toBe(true);
    });

    it("does not treat non-iOS platforms as iOS", () => {
        // A real Mac: touch-callout may feature-detect, but maxTouchPoints is 0.
        stubPlatform({
            userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
            maxTouchPoints: 0,
            touchCallout: true,
        });
        expect(isIOSLikePlatform()).toBe(false);

        // Windows + touchscreen: touch-callout does NOT feature-detect.
        stubPlatform({
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
            maxTouchPoints: 10,
            touchCallout: false,
        });
        expect(isIOSLikePlatform()).toBe(false);
    });

    it("clamps sub-16px font sizes on iOS only", () => {
        stubPlatform({
            userAgent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
            maxTouchPoints: 5,
            touchCallout: false,
        });
        expect(clampIOSNoZoomFontSize(14)).toBe(16);
        expect(clampIOSNoZoomFontSize(16)).toBe(16);

        stubPlatform({
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
            maxTouchPoints: 0,
            touchCallout: false,
        });
        expect(clampIOSNoZoomFontSize(14)).toBe(14);
    });
});
