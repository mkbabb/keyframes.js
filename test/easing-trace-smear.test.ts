import { describe, it, expect } from "vitest";
import { effectScope, nextTick } from "vue";

import { useEasingTraceSmear } from "../demo/easing/useEasingTraceSmear";

// L.W11 S5 — the drag-bend trace-smear egg. The SHIPPED form was silently dead:
// `kickFromPoints` set the smear target then `queueMicrotask(() => setTarget(0))`,
// which fires BEFORE any rAF frame, so `current` never departed 0 (the hero stage
// wrote `--trace-smear: 0.00px` every frame). The cure is an IMPULSE: spike
// `current` to the velocity-proportional peak, relax to 0 over the managed loop.
//
// This is the REAL observable for the egg (inv-M-observable-truth, inv-M-two-axis):
// the smear is a LOGIC property, gated by a deterministic node/vitest test — not a
// flaky synthetic SVG-handle drag in a browser. A regression to the self-cancelling
// form reds here (amount() pinned at 0).
describe("useEasingTraceSmear — the drag-bend smear impulse (L.W11 S5)", () => {
    it("kickFromPoints spikes amount() proportional to handle velocity", () => {
        const scope = effectScope();
        scope.run(() => {
            const { amount, kickFromPoints } = useEasingTraceSmear();
            expect(amount()).toBe(0); // at rest

            // A real handle move: Σ|Δ control points| = .35 + .40 = .75 → peak = min(1, .75·6) = 1
            kickFromPoints([0.25, 0.1, 0.25, 1.0], [0.6, 0.5, 0.25, 1.0]);
            expect(amount()).toBeGreaterThan(0.3); // the impulse landed (was 0 forever)
        });
        scope.stop();
    });

    it("a zero-velocity update does NOT kick (no spurious smear)", () => {
        const scope = effectScope();
        scope.run(() => {
            const { amount, kickFromPoints } = useEasingTraceSmear();
            kickFromPoints([0.25, 0.1, 0.25, 1.0], [0.25, 0.1, 0.25, 1.0]); // no delta
            expect(amount()).toBe(0);
        });
        scope.stop();
    });

    it("a larger handle velocity produces a larger (clamped) spike", async () => {
        const scope = effectScope();
        await scope.run(async () => {
            const small = useEasingTraceSmear();
            small.kickFromPoints([0, 0, 0, 0], [0.02, 0, 0, 0]); // vel .02 → peak .12
            const smallPeak = small.amount();

            const big = useEasingTraceSmear();
            big.kickFromPoints([0, 0, 0, 0], [0.5, 0.3, 0, 0]); // vel .8 → peak clamped 1
            const bigPeak = big.amount();

            expect(bigPeak).toBeGreaterThan(smallPeak);
            expect(bigPeak).toBeLessThanOrEqual(1);
            await nextTick();
        });
        scope.stop();
    });
});
