import { createNativeTimeline } from "../orchestration/timeline/native";
import type { NativeTimelineSpec } from "../orchestration/timeline/native";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";
import { isWAAPIEligible } from "./eligibility";
import { toWAAPIKeyframes } from "./emission";
import { toWAAPIOptions } from "./waapi-options";

/**
 * Drive an animation via WAAPI for compositor-thread visuals while
 * a parallel rAF loop ticks the JS-side state machine so events
 * (`animationstart`, `animationiteration`, `animationend`),
 * `iteration`, `paused`, and `pausedTime` all stay coherent.
 *
 * Resolves when both the WAAPI animation finishes and the JS state
 * machine reaches `done`. Errors propagate — there is no silent
 * fallback path; eligibility was decided once before this was called.
 */
export async function playWAAPI<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Promise<void> {
    const keyframes = toWAAPIKeyframes(animation);
    const options = toWAAPIOptions(animation);

    const waAnimations: globalThis.Animation[] = animation.targets.map(
        (target) => target.animate(keyframes, options),
    );
    // Expose the handles on the instance so the engine's lifecycle methods
    // (`stop`/`reset`) can cancel the compositor animations — cancelling
    // rejects `wa.finished`, which the catch below treats as a halt.
    animation._playback._waAnimations = waAnimations;

    // Shadow tick loop — drives lifecycle (onStart / iteration /
    // onEnd / events / pause / resume) so WAAPI playback has the
    // same observable state as the rAF path. No interpFrames calls;
    // WAAPI handles the visuals. Rides the animation's own RAFPlayback
    // driver so `stop()` halts it uniformly with every other loop.
    // Keep the steady WAAPI shadow tick on RAFPlayback's synchronous fast path.
    // `advanceTo` is thenable only for a genuinely asynchronous first tick; the
    // old `async` callback forced every frame through a Promise/microtask hop.
    const reconcile = (): boolean => {
        if (animation.paused) {
            for (const wa of waAnimations) wa.pause();
        } else {
            for (const wa of waAnimations) {
                if (wa.playState === "paused") wa.play();
            }
        }
        return !animation.done;
    };

    const shadowTick = (now: number): boolean | Promise<boolean> => {
        if (animation.done) return false;
        const advanced = animation.advanceTo(now);
        if (
            advanced &&
            typeof (advanced as Promise<number>).then === "function"
        ) {
            return (advanced as Promise<number>).then(reconcile);
        }
        return reconcile();
    };
    animation.playback.loop(shadowTick);

    try {
        await Promise.all(waAnimations.map((wa) => wa.finished));
        // Commit-on-finish (WAAPI W1). A finished `fill: forwards` animation
        // otherwise "takes precedence over all static styles" indefinitely
        // (MDN `commitStyles`), overriding the inline rest write and leaking
        // one live compositor animation per completed play. Converge to the
        // rAF path's terminal state — rest frame as inline style, ZERO
        // residual animations — by baking the final value inline (only when
        // it IS the rest, i.e. a forwards/both fill) then cancelling. The
        // shared `onEnd → paintRest` writes the LOGICAL rest for every fill
        // mode; `commitStyles` only guards the forwards case against the
        // finish-before-paint race. Reaching here means a genuine finish (a
        // `stop()`/`reset()` cancel rejects `finished` → the catch below).
        for (const wa of waAnimations) {
            try {
                if (
                    animation.restPosition === "final" &&
                    typeof wa.commitStyles === "function"
                ) {
                    wa.commitStyles();
                }
                wa.cancel();
            } catch {
                /* KEEP: already detached/cancelled — nothing to commit or cancel */
            }
        }
    } catch {
        // KEEP: `Animation.stop()`/`reset()` cancelled the compositor animations,
        // rejecting `finished` with an AbortError — a deliberate halt, not
        // an error (`_cancelWAAPI` already cleared the handles). Swallow it so
        // the awaited `play()` resolves cleanly.
    } finally {
        animation.playback.stop();
        animation._playback._waAnimations = [];
    }
}

export type NativeScrollAttachment =
    | { attached: true; animations: globalThis.Animation[] }
    | { attached: false; reason: string };

/**
 * The ADDITIVE native `ScrollTimeline`/`ViewTimeline` WAAPI bridge
 * (D-LIB-2 / F-5 / S-1) — attach an eligible DOM animation to a native
 * scroll-driven timeline so the compositor samples it from scroll position
 * with ZERO main-thread sampling.
 *
 * Returns `{ attached: false, reason }` (the caller keeps the JS
 * {@link import("./timeline").Timeline} sampler) when:
 *  - the curve is not WAAPI-eligible (reuses the one eligibility gate), or
 *  - the platform lacks the native timeline (`createNativeTimeline` → `null`:
 *    Firefox today, SSR, jsdom — feature-detect, no polyfill).
 *
 * CRITICAL — the ARCH-kill HOLDS. This NEVER replaces the JS sampler: native
 * scroll-driven is Chromium-only / not-Baseline, and the JS `ScrollTimeline`
 * is the general (non-DOM-capable) fallback driver. Pure additive fast lane.
 *
 * Progress-reconciliation caveat (S5 / W3). The JS `ScrollTimeline` applies
 * `SmoothProgress` smoothing + a boundary snap (`timeline.ts` pipeline); the
 * native `animation-range` lane has NEITHER. This bridge attaches the RAW
 * scroll progress — so for behaviour-equivalence the JS lane must run with
 * smoothing disabled (`new ScrollTimeline({ smoothing: false })`), or the
 * divergence is documented. We do NOT smuggle the JS smoother onto the native
 * lane (there is no seam to). The lifecycle is W7-W1-shaped: an infinite scroll
 * timeline never resolves `finished` (correctly long-lived) — the handles are
 * exposed on `animation._playback._waAnimations` so `stop()`/`reset()` cancel them.
 */
export function attachNativeScrollTimeline<V extends Vars>(
    animation: KeyframesAnimation<V>,
    spec: NativeTimelineSpec,
): NativeScrollAttachment {
    const elig = isWAAPIEligible(animation);
    if (!elig.eligible) {
        return { attached: false, reason: elig.reason };
    }

    const timeline = createNativeTimeline(spec);
    if (timeline == null) {
        return {
            attached: false,
            reason: "native scroll/view timeline unavailable (feature absent)",
        };
    }

    const keyframes = toWAAPIKeyframes(animation);
    // A native scroll-driven animation maps its 0→1 progress over the timeline
    // range, NOT wall-clock time — but the easing/direction/fill from the one
    // options builder still shape that progress mapping; `timeline:` swaps the
    // clock for the scroller. No time-based `duration` smoothing is involved:
    // the native lane has no SmoothProgress, by construction (see caveat).
    const options: KeyframeAnimationOptions = {
        ...toWAAPIOptions(animation),
        timeline,
    };

    const animations = animation.targets.map((target) =>
        target.animate(keyframes, options),
    );
    animation._playback._waAnimations = animations;
    return { attached: true, animations };
}
