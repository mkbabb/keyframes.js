import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothProgress } from "../src/animation/smooth";
import { SpringProgress } from "../src/animation/spring";

/**
 * D.W4 D-6a — `proof:snap-symmetry`: the two steppers' reduced-motion snap is
 * contract-equivalent. Both `SmoothProgress._snapSettled` and
 * `SpringProgress._snapSettled` now value-set + settle + emit-once + stop the
 * managed loop, so a reduced-motion snap leaves NO scheduled `drive` frame on
 * either stepper (the asymmetry the audit named: smooth used to skip the
 * `_playback.stop()` the spring did).
 *
 * The "loop stopped" half is enforced structurally by the engine source gate
 * (both `_snapSettled` bodies call `_playback.stop()` — falsifiable by grep);
 * this asserts the observable settled contract both steppers satisfy.
 */
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

describe("proof:snap-symmetry — reduced-motion snap, both steppers", () => {
    beforeEach(() => mockReducedMotion(true));
    afterEach(() => mockReducedMotion(false));

    it("SmoothProgress: snaps to target, settles, emits the snap once", () => {
        const sp = new SmoothProgress({
            damping: 0.5,
            respectReducedMotion: true,
        });
        const frames: number[] = [];
        sp.play((v) => frames.push(v)); // settled at 0 → one snap emit
        const baseline = frames.length;
        sp.setTarget(1); // reduced → _snapSettled → snap to 1, settle, stop

        expect(sp.settled).toBe(true);
        expect(sp.current).toBe(1);
        // Smooth's `_snapSettled` emits via the `_onFrame` callback: exactly
        // one synchronous emit (the snap), no loop re-firing.
        expect(frames.length).toBe(baseline + 1);
        expect(frames.at(-1)).toBe(1);
    });

    it("SpringProgress: snaps to target, settles, no spinning loop", () => {
        const sp = new SpringProgress({ respectReducedMotion: true });
        sp.play();
        sp.target = 1; // reduced → _snapSettled → snap to 1, settle, stop

        // Spring's `_snapSettled` emits via its event channel (not `_onFrame`),
        // so the symmetric assertion is the SETTLED STATE: value at target,
        // settled true, zero velocity — and the `_playback.stop()` (verified by
        // the engine source gate) leaves no scheduled frame.
        expect(sp.settled).toBe(true);
        expect(sp.value).toBe(1);
        expect(sp.velocity).toBe(0);
    });

    it("symmetry: identical settled contract after a reduced-motion snap", () => {
        const smooth = new SmoothProgress({ respectReducedMotion: true });
        const spring = new SpringProgress({ respectReducedMotion: true });
        smooth.play();
        spring.play();

        smooth.setTarget(0.75);
        spring.target = 0.75;

        // Same terminal state: settled true, value at target, velocity zeroed.
        expect(smooth.settled).toBe(true);
        expect(spring.settled).toBe(true);
        expect(smooth.current).toBe(0.75);
        expect(spring.value).toBe(0.75);
        expect(spring.velocity).toBe(0);
    });
});
