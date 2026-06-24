import { onScopeDispose, ref, watch, type Ref } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

/**
 * useKfAnimation — the generic settle-and-pause kernel (K.W12 ED-2).
 *
 * A kf `Animation` (or any subclass — `CSSKeyframesAnimation`, the engine
 * playback) mutates its own internal state outside Vue's reactivity (the engine
 * objects are deliberately un-proxied — Vue cannot track an rAF-driven mutation).
 * This kernel bridges that gap: it POLLS the animation's `effectiveT` / `started`
 * / `reversed` on a rAF loop and exposes them as reactive refs.
 *
 * THE HARD-WON DISCIPLINE — "gate on inputs, not outputs" (the deadlock-safe
 * idiom, distilled from the demo's `useAnimationSync`). The loop must idle when
 * the animation is at rest (else every mounted consumer burns a frame forever),
 * but gating the loop on `started` (an OUTPUT this loop COMPUTES) deadlocks —
 * `started` never flips because the loop that would flip it is gated off. The
 * fix: idle only when the polled state has been STABLE for a settle window, and
 * RESUME on `isPlaying` (an INPUT the caller owns, not an output of this loop).
 * A scrub that mutates `effectiveT` without touching `isPlaying` is re-armed by
 * the exported `wake()`.
 *
 * This is the ONE genuinely hard-won correctness property worth shipping as a
 * library primitive (ecosystem-distribution.md §2.2) — it is NOT the demo's
 * `ScenePlayback`/`sceneMachine`-coupled composables (those are demo-app
 * concepts, researched-FALSE to extract).
 *
 * @param getAnimation a thunk returning the kf Animation to track (a thunk, not
 *   a value, so the caller can swap the animation without re-invoking the hook).
 * @param isPlaying an optional play-state ref (the INPUT the resume gates on).
 *   When omitted the loop runs until the state settles and idles thereafter.
 */
const SETTLE_FRAMES = 30; // ~0.5s at 60fps: the hold-stable window before idling.

export interface KfAnimationState {
    /** The animation's current effective progress `t` ∈ [0,1]. */
    t: Ref<number>;
    /** Whether the animation has started (the engine's `started` flag). */
    started: Ref<boolean>;
    /** Whether the animation is currently reversed. */
    reversed: Ref<boolean>;
    /** Re-arm the poll loop (call after an input-driven scrub at rest). */
    wake: () => void;
}

export function useKfAnimation(
    getAnimation: () => KeyframesAnimation,
    isPlaying?: Ref<boolean>,
): KfAnimationState {
    const t = ref(getAnimation().effectiveT);
    const started = ref(getAnimation().started);
    const reversed = ref(getAnimation().reversed);

    let stableFrames = 0;
    let rafId: number | null = null;

    const isActive = () => rafId !== null;

    const tick = () => {
        const animation = getAnimation();
        const nextT = animation.effectiveT;
        const nextStarted = animation.started;
        const nextReversed = animation.reversed;

        const changed =
            nextT !== t.value ||
            nextStarted !== started.value ||
            nextReversed !== reversed.value;

        t.value = nextT;
        started.value = nextStarted;
        reversed.value = nextReversed;

        // While playing, never idle — the happy path is untouched.
        if (isPlaying?.value) {
            stableFrames = 0;
        } else if (changed) {
            stableFrames = 0;
        } else if (++stableFrames >= SETTLE_FRAMES) {
            pause();
            return;
        }
        rafId = requestAnimationFrame(tick);
    };

    const resume = () => {
        if (rafId === null) rafId = requestAnimationFrame(tick);
    };
    const pause = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const wake = () => {
        stableFrames = 0;
        if (!isActive()) resume();
    };

    // Resume on ANY play-state change (an INPUT, not an output → no deadlock):
    // the rising edge wakes the happy path; the falling edge re-arms the settle
    // window so the loop runs once more to capture the post-stop frame.
    if (isPlaying) watch(isPlaying, () => wake());

    resume();
    onScopeDispose(pause);

    return { t, started, reversed, wake };
}
