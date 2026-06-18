import { markRaw, onScopeDispose } from "vue";

import { SmoothProgress } from "@mkbabb/keyframes.js";

/**
 * EASTER EGG — "the drag-bend SMEAR" (L.W11 S5), colocated as its own concern
 * seam (the natural egg unit, split out of useEasingDemo to hold the host
 * composable under the demo line ceiling).
 *
 * Dragging a bezier handle SMEARS the trace proportional to the per-frame handle
 * velocity, decaying to zero on release via the engine's own `SmoothProgress`
 * (the inv ζ dogfood — NO hand-rolled rAF; the managed SmoothProgress loop owns
 * its own RAFPlayback). The hero stage reads `amount()` and applies it as a
 * directional motion-blur on the projected trace, so the curve flexes like a
 * live oscilloscope beam rather than snapping between static states. PRM: the
 * SmoothProgress snaps to its target immediately (no decay loop) so the blur is
 * suppressed.
 */
export function useEasingTraceSmear() {
    const smear = markRaw(new SmoothProgress({ damping: 6, initial: 0, clamp: true }));

    // The managed SmoothProgress loop decays the smear toward 0 each frame; the
    // hero stage reads the LIVE smoothed value off this getter (no reactive
    // storm — the hero samples it on its own paint).
    const amount = (): number => smear.current;

    /** Kick the smear from a handle update's velocity (the sum of the four
     *  control-point deltas) as an IMPULSE: spike the smoothed value to the
     *  velocity-proportional peak, then relax to 0 over the managed loop — the
     *  oscilloscope-beam model (each handle jitter injects energy the loop decays
     *  crisp). Pass the previous + next bezier control points. */
    const kickFromPoints = (
        prev: readonly [number, number, number, number],
        next: readonly [number, number, number, number],
    ): void => {
        const vel =
            Math.abs(next[0] - prev[0]) +
            Math.abs(next[1] - prev[1]) +
            Math.abs(next[2] - prev[2]) +
            Math.abs(next[3] - prev[3]);
        const peak = Math.min(1, vel * 6);
        if (peak <= 0) return;
        // IMPULSE: lift `current` to the peak instantly (an earlier `setTarget`
        // only smooths TOWARD the peak — and a same-tick re-aim at 0 cancels it
        // before any frame renders), aim back at 0, then (re)start the managed
        // decay loop. `reset` settles + stops the loop, so the explicit `play()`
        // re-drives it; `play` is idempotent (no second loop). The hero stage
        // samples `current` off its own paint (no bound onFrame here).
        smear.reset(Math.max(smear.current, peak));
        smear.setTarget(0);
        smear.play();
    };

    onScopeDispose(() => smear.stop());

    return { amount, kickFromPoints };
}
