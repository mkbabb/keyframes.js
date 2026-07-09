import { describe, expect, it, vi } from "vitest";
import {
    useThrottledReadout,
    type ThrottledReadout,
} from "../../demo/@/composables/useThrottledReadout";

// T.F23(c) — the extracted few-Hz cold-path readout throttle. The four+ scenes'
// hand-rolled `1000 / PROGRESS_READOUT_HZ` accumulator + reconcile-on-settle,
// verified once at the seam (the sites' own behavior tests remain the swap's
// contract once the facility-lane files are wired post-facility).

describe("useThrottledReadout", () => {
    it("fires the first maybeFlush immediately (no phantom initial delay)", () => {
        const readout: ThrottledReadout = useThrottledReadout(6);
        const flush = vi.fn();
        expect(readout.maybeFlush(0, flush)).toBe(true);
        expect(flush).toHaveBeenCalledTimes(1);
    });

    it("gates subsequent flushes to at most `hz` per second", () => {
        const readout = useThrottledReadout(6); // interval = 1000/6 ≈ 166.67ms
        const flush = vi.fn();
        readout.maybeFlush(0, flush); // fires (t=0)
        expect(flush).toHaveBeenCalledTimes(1);

        // A 60 Hz loop: ticks every ~16.67ms. None within the interval flush.
        for (let t = 16.67; t < 166.67; t += 16.67) {
            expect(readout.maybeFlush(t, flush)).toBe(false);
        }
        expect(flush).toHaveBeenCalledTimes(1);

        // The first tick at/after the interval boundary flushes again.
        expect(readout.maybeFlush(166.67, flush)).toBe(true);
        expect(flush).toHaveBeenCalledTimes(2);
    });

    it("reconcile flushes unconditionally and re-seats the cadence clock", () => {
        const readout = useThrottledReadout(6);
        const flush = vi.fn();
        readout.maybeFlush(0, flush); // fires (t=0)
        expect(flush).toHaveBeenCalledTimes(1);

        // A reconcile 10ms later (well inside the interval) STILL flushes — the
        // settle/scrub landing on the LIVE value.
        readout.reconcile(10, flush);
        expect(flush).toHaveBeenCalledTimes(2);

        // ...and it re-seated the clock to t=10, so the next cadence flush is
        // gated from THERE (10 + 166.67), not from t=0.
        expect(readout.maybeFlush(100, flush)).toBe(false);
        expect(readout.maybeFlush(176.67, flush)).toBe(true);
        expect(flush).toHaveBeenCalledTimes(3);
    });

    it("reset re-arms so the next maybeFlush fires regardless of elapsed time", () => {
        const readout = useThrottledReadout(6);
        const flush = vi.fn();
        readout.maybeFlush(1000, flush); // fires (t=1000)
        expect(readout.maybeFlush(1010, flush)).toBe(false); // gated

        readout.reset();
        expect(readout.maybeFlush(1010, flush)).toBe(true); // re-armed → fires
        expect(flush).toHaveBeenCalledTimes(2);
    });

    it("treats a non-positive hz as flush-every-call (interval 0, never non-finite)", () => {
        const readout = useThrottledReadout(0);
        const flush = vi.fn();
        expect(readout.maybeFlush(0, flush)).toBe(true);
        expect(readout.maybeFlush(0, flush)).toBe(true); // interval 0 → always fires
        expect(flush).toHaveBeenCalledTimes(2);
    });
});
