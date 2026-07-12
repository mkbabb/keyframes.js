import { onBeforeUnmount } from "vue";
import type { SpringProgress } from "@mkbabb/keyframes.js";
import { clamp } from "@mkbabb/value.js/math";

/**
 * R.W6-decomp — the square scene's keyboard layer (the arrow/Home nudge + the
 * "envelope tour" REVEAL egg), extracted from SquareScene.vue as a colocated
 * sub-unit (the demo ≤500L-per-file decomposition; proof:demo-no-oversize;
 * R.W5 §4 F2). Both re-seat the SAME per-axis springs the drag uses (no second
 * authority, no new rAF — the spring loop paints) and report each new target
 * through the `onTarget` sync hook the scene wires to the aria readout.
 *
 * ── THE ENVELOPE-TOUR EGG (P.W6) ──
 * Press `c` (corners) on the focused box → the spring tours all four extremes of
 * the [-1,1]² travel field and returns home, REVEALING the bounded coordinate
 * space the instrument field draws. Each leg re-seats the same springs the drag
 * uses so you see the spring chase each corner with the real banking velocity —
 * the egg teaches the reachable envelope AND the spring's feel at once. Distinct
 * from the double-click tumble (which reveals the colour twin); the two never
 * collide (one is keyboard, one is dblclick). The legs are paced by the spring's
 * own settle, not a fixed timer: each corner waits for the chase to arrive.
 */

const ENVELOPE_LEGS: ReadonlyArray<[number, number]> = [
    [1, -1], // top-right
    [1, 1], // bottom-right
    [-1, 1], // bottom-left
    [-1, -1], // top-left
    [0, 0], // home
];

interface SquareKeyboardOptions {
    /** The two per-axis springs the drag re-seats (read for the live target). */
    springX: SpringProgress;
    springY: SpringProgress;
    /** Re-seat both spring targets ∈ [-1, 1] (the drag's own re-seat seam). */
    reseat: (nx: number, ny: number) => void;
    /** Report the new (nx, ny) target so the scene can sync the aria readout. */
    onTarget: (nx: number, ny: number) => void;
}

export function useSquareKeyboard(opts: SquareKeyboardOptions) {
    const { springX, springY, reseat, onTarget } = opts;

    let touring = false;
    let tourTimer: ReturnType<typeof setTimeout> | null = null;

    const tourEnvelope = () => {
        if (touring) return;
        touring = true;
        let i = 0;
        const step = () => {
            if (i >= ENVELOPE_LEGS.length) {
                touring = false;
                tourTimer = null;
                return;
            }
            const [nx, ny] = ENVELOPE_LEGS[i]!;
            i += 1;
            reseat(nx, ny);
            onTarget(nx, ny);
            // Pace each leg by the spring's own travel time (the snappy 0.32
            // response settles well under 520ms) — a hold long enough to SEE the
            // corner before the next leg, but no hand-rolled rAF (the spring
            // loop paints).
            tourTimer = setTimeout(step, 520);
        };
        step();
    };

    // Keyboard nudge (slider posture parity with Spring/MotionPath).
    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === "c" || e.key === "C") {
            e.preventDefault();
            tourEnvelope();
            return;
        }
        const step = 0.25;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowRight") dx = step;
        else if (e.key === "ArrowLeft") dx = -step;
        else if (e.key === "ArrowDown") dy = step;
        else if (e.key === "ArrowUp") dy = -step;
        else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            reseat(0, 0);
            onTarget(0, 0);
            return;
        } else return;
        e.preventDefault();
        const nx = clamp(springX.target + dx, -1, 1);
        const ny = clamp(springY.target + dy, -1, 1);
        reseat(nx, ny);
        onTarget(nx, ny);
    };

    onBeforeUnmount(() => {
        if (tourTimer) clearTimeout(tourTimer);
    });

    return { onKeydown };
}
