import { ref, watch, type Ref } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { useDemoTicker } from "@components/instrument/transport/composables/useDemoTicker";

/**
 * Syncs reactive refs to a markRaw animation's state via rAF polling.
 * Animation objects are markRaw so Vue can't track their internal changes.
 *
 * GATING (D.W3.S4) — the loop no longer runs unconditionally. The original
 * burned a frame every tick for the lifetime of every mounted controls panel,
 * even at rest. It now PAUSES when the animation is provably static and RESUMES
 * when it can change again, using vueuse's `useRafFn` pause/resume.
 *
 * The hazard the prior docstring named was real: gating on `isStarted` (an
 * OUTPUT this loop COMPUTES) deadlocks — `isStarted` never flips because the
 * loop that would flip it is gated off. The gate here avoids that by resuming
 * on INPUTS the loop does NOT own:
 *   • `isPlaying` (the group's externally-set play state) — its rising edge
 *     resumes the loop; the happy path (animating) is byte-identical.
 *   • document visibility — returning to a visible tab resumes once to re-sync
 *     (the animation may have advanced while the tab was hidden).
 * and pauses only when the animation is settled: the three polled values have
 * held stable across a short window AND `isPlaying` is false. A change in any
 * polled value re-arms the window, so a still-transitioning animation keeps the
 * loop alive without depending on any output of the loop itself.
 */
const SETTLE_FRAMES = 30; // ~0.5s at 60fps: hold-stable window before idling.

export function useAnimationSync(
    getAnimation: () => KeyframesAnimation<any>,
    isPlaying: Ref<boolean>,
) {
    const currentT = ref(getAnimation().effectiveT);
    const isStarted = ref(getAnimation().started);
    const isReversed = ref(getAnimation().reversed);

    // Frames the polled state has held identical while not playing.
    let stableFrames = 0;

    const tickerActive = ref(true);
    useDemoTicker(
        () => {
            const animation = getAnimation();
            const t = animation.effectiveT;
            const started = animation.started;
            const reversed = animation.reversed;

            const changed =
                t !== currentT.value ||
                started !== isStarted.value ||
                reversed !== isReversed.value;

            currentT.value = t;
            isStarted.value = started;
            isReversed.value = reversed;

            // While playing, never idle — the happy path is untouched.
            if (isPlaying.value) {
                stableFrames = 0;
                return;
            }

            // Not playing: idle once the state has been stable for the window.
            if (changed) {
                stableFrames = 0;
            } else if (++stableFrames >= SETTLE_FRAMES) {
                tickerActive.value = false;
            }
        },
        tickerActive,
    );

    const wake = () => {
        stableFrames = 0;
        tickerActive.value = true;
    };

    // Resume on ANY play-state change (an input, not an output → no deadlock):
    // the rising edge wakes for the happy path; the FALLING edge (pause/stop)
    // re-arms the settle window so the loop runs once more to capture the
    // post-stop frame before idling (else `isStarted`/`currentT` could stick at
    // the pre-stop value). Pausing is left to the settle-detect.
    watch(isPlaying, () => wake());

    // Re-sync when the tab becomes visible again (it may have advanced/changed
    // while hidden, and rAF is throttled/paused by the browser when hidden).
    // `wake` is exported so SCRUB entry points can re-arm the loop: scrubbing a
    // SETTLED (non-playing) animation mutates `effectiveT` via setChildTime()
    // without touching `isPlaying`, so without this the idled loop would never
    // observe the scrub and the slider binding (`currentT`) would go stale.
    // An input-driven wake — no deadlock.
    return { currentT, isPlaying, isStarted, isReversed, wake };
}
