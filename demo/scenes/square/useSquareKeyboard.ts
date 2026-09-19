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
 * from the double-TAP tumble (which reveals the colour twin); the two never
 * collide (one is keyboard, one is a pointer double-tap — D-17's fourth site:
 * this line used to say "dblclick", the mouse-only verb the handler was
 * deliberately migrated OFF when `useDoubleTap` replaced it).
 *
 * The `c` binding itself lives in the scene's ONE keyboard registry now (D-4),
 * scoped to a focused box; `tourEnvelope` is exported for it. The legs are paced
 * by the spring's own settle, not a fixed timer: each corner waits for the chase
 * to arrive.
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
    /**
     * C-4 — the {playback → keyboard} FSM edge, run BEFORE any re-seat. The
     * two-writer guarantee ("the engine tour and the spring loop are never
     * simultaneous") used to be implemented in the POINTER handler alone, so
     * Play + any arrow put two rAF writers on one `el.style.transform`. Every
     * branch below that re-seats a spring enters through this first, so the
     * guarantee belongs to the edge rather than to one input modality.
     */
    onTakeOver: () => void;
    /** Report the new (nx, ny) target so the scene can sync the aria readout. */
    onTarget: (nx: number, ny: number) => void;
}

export function useSquareKeyboard(opts: SquareKeyboardOptions) {
    const { springX, springY, reseat, onTakeOver, onTarget } = opts;

    let touring = false;
    let tourTimer: ReturnType<typeof setTimeout> | null = null;

    const tourEnvelope = () => {
        if (touring) return;
        onTakeOver();
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

    /**
     * Keyboard nudge (slider posture parity with Spring/MotionPath).
     *
     * D-6/L-6 — BARE KEYS ONLY. The branches below used to match on `e.key`
     * alone and call `preventDefault()` unconditionally, so the box swallowed
     * ⌘←/⌘↑ (and, before the `c` egg moved to the shortcut registry, ⌘C/Ctrl+C
     * outright). A command is not a nudge: any ctrl/meta/alt combination belongs
     * to the app, and this layer declines it. Shift is the one modifier the
     * widget itself claims — APG's fine-grain step.
     *
     * D-19 — THE LADDER IS APG'S NOW. `Home` and `End` both re-centred, so `End`
     * had no meaning of its own (APG assigns it the maximum); the step was fixed
     * at 0.25 with no fine grain, giving nine reachable positions per axis
     * against a continuous pointer path; and PageUp/PageDown were unbound.
     * `Home` keeps the scene's documented return-home verb (it IS the minimum's
     * counterpart for a bipolar field), `End` reaches the far corner, Shift
     * gives a 0.05 fine grain (41 positions), and the Page keys move a half
     * step on the vertical axis.
     */
    const STEP = 0.25;
    const FINE_STEP = 0.05;
    const PAGE_STEP = 0.5;

    const onKeydown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const step = e.shiftKey ? FINE_STEP : STEP;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowRight") dx = step;
        else if (e.key === "ArrowLeft") dx = -step;
        else if (e.key === "ArrowDown") dy = step;
        else if (e.key === "ArrowUp") dy = -step;
        else if (e.key === "PageDown") dy = PAGE_STEP;
        else if (e.key === "PageUp") dy = -PAGE_STEP;
        else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            onTakeOver();
            const at = e.key === "Home" ? 0 : 1;
            reseat(at, at);
            onTarget(at, at);
            return;
        } else return;
        e.preventDefault();
        onTakeOver();
        const nx = clamp(springX.target + dx, -1, 1);
        const ny = clamp(springY.target + dy, -1, 1);
        reseat(nx, ny);
        onTarget(nx, ny);
    };

    onBeforeUnmount(() => {
        if (tourTimer) clearTimeout(tourTimer);
    });

    return { onKeydown, tourEnvelope };
}
