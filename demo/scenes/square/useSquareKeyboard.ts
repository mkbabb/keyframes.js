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
 *
 * MISS-3 / N-SQ-9 — AND THAT LAST SENTENCE IS TRUE NOW. It sat 46 lines above
 * a fixed 520 ms timer, with the springs destructured into scope
 * and never consulted for `.settled`, and the inline comment beside the timer
 * quietly conceded it ("settles well under 520ms"). The cleanest instance of the
 * corpus's own false-invariant thesis, and not merely a prose defect:
 * OPEN-LOOP pacing cuts short any leg whose spring has not arrived — a slow
 * device, a reduced-motion amplitude scale or a re-tuned response all break the
 * tour's one promise. The scene's spring loop already publishes the exact signal
 * ("the loop came fully to rest"); `notifySettled` is the keyboard's ear for it,
 * and there is no timer left in this file. A comment-stated invariant is an
 * assertion, so the assertion is in `square-scene.test.ts` beside this cure, in
 * the same commit.
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
    let leg = 0;

    /** Seat the next corner, or finish. The tour advances ONLY from here. */
    const stepTour = () => {
        const next = ENVELOPE_LEGS[leg];
        if (!next) {
            touring = false;
            return;
        }
        leg += 1;
        const [nx, ny] = next;
        reseat(nx, ny);
        onTarget(nx, ny);
    };

    const tourEnvelope = () => {
        if (touring) return;
        onTakeOver();
        touring = true;
        leg = 0;
        stepTour();
    };

    /**
     * The scene calls this the frame its spring loop comes fully to rest — the
     * chase HAS arrived at the current corner, so the next leg opens. This is
     * the whole of the tour's clock: no timer, no second rAF, no polling. A leg
     * that takes longer (a slow device, a reduced-motion amplitude scale, a
     * re-tuned response) simply holds longer, which is what the docblock above
     * has always claimed.
     */
    const notifySettled = () => {
        if (touring) stepTour();
    };

    /** A pointer grab, a Play press or an arrow nudge takes the box over — the
     *  tour yields rather than fighting the new authority for the springs. */
    const cancelTour = () => {
        touring = false;
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
            cancelTour();
            onTakeOver();
            const at = e.key === "Home" ? 0 : 1;
            reseat(at, at);
            onTarget(at, at);
            return;
        } else return;
        e.preventDefault();
        cancelTour();
        onTakeOver();
        const nx = clamp(springX.target + dx, -1, 1);
        const ny = clamp(springY.target + dy, -1, 1);
        reseat(nx, ny);
        onTarget(nx, ny);
    };

    // L-18 — the `onBeforeUnmount(clearTimeout)` teardown this file used to carry
    // (against the folder's `onScopeDispose` idiom, and called bare inside the
    // suite's own harness where no component lifecycle exists) is GONE with the
    // timer it cleaned up. LAW A census before the delete: `tourTimer` had four
    // references, all inside this file — the declaration, two writes and the one
    // teardown read — and no consumer of any kind elsewhere in the tree.

    return { onKeydown, tourEnvelope, notifySettled, cancelTour };
}
