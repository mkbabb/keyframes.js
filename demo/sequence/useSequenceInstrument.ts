import { ref } from "vue";

/**
 * useSequenceInstrument — the L.W11 S7 INSTRUMENT-EGG state, colocated beside
 * useSequenceDemo (the ≤500L demo-ceiling split seam, mirroring SequenceScrubber).
 * This holds ONLY the presentational gesture/boot state the ignition-cascade egg
 * reads — it owns no engine; the cascade MOTION is the engine's own --ball-p
 * fan-out (Sequence.scrub drives each child), never a hand-rolled clock (inv ζ).
 *
 *   • isScrubbing — lifts the stage's --seq-glow while the master scrub is held
 *     (the well runs hotter when you conduct).
 *   • scrubDir (+1 forward / -1 back) — flips the diagonal cascade so the lane
 *     detonation chases the thumb (violet→green forward, cooling on drag-back).
 *   • powerOn — the orchestrated ~700ms boot (ruler clip-wipe → staggered lane
 *     drop), fired ONCE on first entry; PRM-snapped; guarded against re-fire.
 *     Demonstrates `stagger` (the primitive this page exists to prove) on load.
 */
export function useSequenceInstrument() {
    const isScrubbing = ref(false);
    const scrubDir = ref(1);
    const setScrubbing = (on: boolean) => (isScrubbing.value = on);
    const setScrubDir = (dir: number) => (scrubDir.value = dir < 0 ? -1 : 1);

    const isPoweringOn = ref(false);
    let didPowerOn = false;
    const powerOn = () => {
        if (didPowerOn) return;
        didPowerOn = true;
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return; // snap to settled — no boot animation
        isPoweringOn.value = true;
        window.setTimeout(() => (isPoweringOn.value = false), 760);
    };

    return {
        isScrubbing,
        scrubDir,
        setScrubbing,
        setScrubDir,
        isPoweringOn,
        powerOn,
    };
}
