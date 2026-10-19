/**
 * spring-settle-exact.test.ts — R-K1-a (ATLAS-INBOUND-2026-10-18-spring-settle-float).
 *
 * A settled spring at full amplitude (s = 1) rests EXACTLY on its target. The
 * pre-cure tree formed the rest as `origin + s·(target − origin)`, which in
 * floating point is not `target` for every origin (origin −0.0069, target 1 →
 * 0.9999999999999999), so a consumer reading `value >= 1` (glass-ui's
 * `useSpringMount`) never saw the spring arrive.
 *
 * At a reduced amplitude (s = 0.5) the rest is the scaled target within 1 ulp —
 * the amplitude-reduction semantics are unchanged.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { SpringProgress } from "../../src/animation/physics/spring";

const FRAME_MS = 1000 / 60;
const ORIGINS = [-0.0069, 0.1, 0.3, 1e-9, -1e-9];

function settle(sp: SpringProgress): void {
    for (let i = 0; i < 6000 && !sp.settled; i++) sp.tickDt(FRAME_MS);
    expect(sp.settled).toBe(true);
}

function mockReducedMotion(matches: boolean): void {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
            matches: query.includes("prefers-reduced-motion") && matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

describe("R-K1-a — a settled spring rests exactly on its target", () => {
    afterEach(() => mockReducedMotion(false));

    it.each(ORIGINS)("s = 1: origin %s → target 1 settles to exactly 1", (origin) => {
        mockReducedMotion(false);
        const sp = new SpringProgress({ initial: origin });
        sp.target = 1;
        settle(sp);
        expect(sp.value).toBe(1);
        expect(sp.value >= 1).toBe(true);
        sp.dispose();
    });

    it.each(ORIGINS)(
        "s = 0.5: origin %s → target 1 settles to the scaled rest within 1 ulp",
        (origin) => {
            mockReducedMotion(true);
            const sp = new SpringProgress({
                initial: origin,
                respectReducedMotion: 0.5,
            });
            sp.target = 1;
            settle(sp);
            const scaled = origin + 0.5 * (1 - origin);
            const ulp = Number.EPSILON * Math.max(1, Math.abs(scaled));
            expect(Math.abs(sp.value - scaled)).toBeLessThanOrEqual(ulp);
            sp.dispose();
        },
    );
});
