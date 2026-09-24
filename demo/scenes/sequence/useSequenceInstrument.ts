import { onScopeDispose, ref } from "vue";

/**
 * True iff the user prefers reduced motion — the ONE JS-side guard the
 * scene's DECORATIVE motion consults (the power-on boot here, the reel egg in
 * `useSequenceDemo`). The essential motion (the storyboard's own glide) is the
 * engine's and honours the preference through its own contract; this guard
 * exists for the motion the engine cannot see. SSR-safe off-DOM.
 */
export const prefersReducedMotion = (): boolean =>
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * The boot's true span (ms): the last lane's drop starts at
 * `4 × 60ms + 120ms = 360ms` and runs 420ms, so the boot class must hold for
 * 780ms — the former 760ms truncated row 5's drop 20ms early
 * (kf-SequencePlayhead N-17).
 */
const POWER_ON_MS = 780;

/**
 * useSequenceInstrument — the L.W11 S7 INSTRUMENT-EGG state, colocated beside
 * useSequenceDemo (the ≤500L demo-ceiling split seam).
 * This holds ONLY the presentational gesture/boot state the ignition-cascade egg
 * reads — it owns no engine; the cascade MOTION is the engine's own --ball-p
 * fan-out (Sequence.scrub drives each child), never a hand-rolled clock (inv ζ).
 *
 *   • isScrubbing — lifts the stage's --seq-glow while a master-clock scrub is
 *     held — pointer OR keyboard (the well runs hotter when you conduct).
 *   • scrubDir (+1 forward / -1 back) — flips the diagonal cascade so the lane
 *     detonation chases the thumb (violet→green forward, cooling on drag-back).
 *   • powerOn — the orchestrated boot (ruler clip-wipe → staggered lane drop),
 *     fired ONCE on first entry; PRM-snapped; guarded against re-fire; its one
 *     timer is retained and cleared on scope dispose (kf-SequenceAxis SA-5) so
 *     leaving the scene mid-boot leaves no timer writing an orphaned ref.
 *     Demonstrates `stagger` (the primitive this page exists to prove) on load.
 */
export function useSequenceInstrument() {
    const isScrubbing = ref(false);
    const scrubDir = ref(1);
    const setScrubbing = (on: boolean) => (isScrubbing.value = on);
    const setScrubDir = (dir: number) => (scrubDir.value = dir < 0 ? -1 : 1);

    const isPoweringOn = ref(false);
    let didPowerOn = false;
    let powerOnTimer: number | undefined;
    const powerOn = () => {
        if (didPowerOn) return;
        didPowerOn = true;
        if (prefersReducedMotion()) return; // snap to settled — no boot animation
        isPoweringOn.value = true;
        powerOnTimer = window.setTimeout(() => {
            isPoweringOn.value = false;
            powerOnTimer = undefined;
        }, POWER_ON_MS);
    };
    onScopeDispose(() => {
        if (powerOnTimer !== undefined) window.clearTimeout(powerOnTimer);
    });

    return {
        isScrubbing,
        scrubDir,
        setScrubbing,
        setScrubDir,
        isPoweringOn,
        powerOn,
    };
}
