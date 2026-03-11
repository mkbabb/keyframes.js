import { describe, expect, it } from "vitest";
import {
    clampIOSNoZoomFontSize,
    isIOSLikePlatform,
} from "../demo/@/utils/iosTextEntry";

describe("ios text entry helpers", () => {
    it("detects iPhone and iPad user agents as iOS", () => {
        expect(
            isIOSLikePlatform({
                userAgent:
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
                platform: "iPhone",
                maxTouchPoints: 5,
            }),
        ).toBe(true);

        expect(
            isIOSLikePlatform({
                userAgent:
                    "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
                platform: "iPad",
                maxTouchPoints: 5,
            }),
        ).toBe(true);
    });

    it("detects iPadOS desktop mode on MacIntel with touch support", () => {
        expect(
            isIOSLikePlatform({
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15",
                platform: "MacIntel",
                maxTouchPoints: 5,
            }),
        ).toBe(true);
    });

    it("does not treat non-iOS platforms as iOS", () => {
        expect(
            isIOSLikePlatform({
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                platform: "MacIntel",
                maxTouchPoints: 0,
            }),
        ).toBe(false);

        expect(
            isIOSLikePlatform({
                userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
                platform: "Win32",
                maxTouchPoints: 0,
            }),
        ).toBe(false);
    });

    it("clamps sub-16px font sizes on iOS only", () => {
        expect(
            clampIOSNoZoomFontSize(14, {
                userAgent:
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
                platform: "iPhone",
                maxTouchPoints: 5,
            }),
        ).toBe(16);

        expect(
            clampIOSNoZoomFontSize(16, {
                userAgent:
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
                platform: "iPhone",
                maxTouchPoints: 5,
            }),
        ).toBe(16);

        expect(
            clampIOSNoZoomFontSize(14, {
                userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
                platform: "Win32",
                maxTouchPoints: 0,
            }),
        ).toBe(14);
    });
});
