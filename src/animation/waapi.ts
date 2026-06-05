import { COMPUTED_UNITS, unflattenObjectToString } from "@mkbabb/value.js";
import type { Animation } from "./engine";
import type { Vars } from "./constants";

const isComputedUnit = (
    unit: unknown,
): unit is (typeof COMPUTED_UNITS)[number] =>
    typeof unit === "string" &&
    (COMPUTED_UNITS as readonly string[]).includes(unit);

export type WAAPIEligibility =
    | { eligible: true }
    | { eligible: false; reason: string };

/**
 * Decide whether an animation can be delegated to the Web Animations
 * API for compositor-thread playback. Single source of truth — the
 * `Animation.play()` dispatcher consults this once, with no inline
 * pre-checks or post-failure fallbacks.
 *
 * Eligibility requires ALL of:
 * 1. At least one DOM target with `Element.animate()` available.
 * 2. Every frame uses the default DOM-style renderer (no user
 *    transform that WAAPI can't see).
 * 3. All frames share the same timing function (WAAPI exposes
 *    one easing per animation, not per stop).
 * 4. No computed units (`var`, `calc`, `vh`, `cqw`, etc.) — those
 *    require live DOM resolution at interpolation time.
 * 5. No color interpolation — handled by perceptual color spaces in
 *    JS, not by WAAPI's RGB lerp.
 *
 * On failure returns a diagnostic `reason` so callers can surface it
 * to debug builds without a console.warn falling out of the engine.
 */
export function isWAAPIEligible<V extends Vars>(
    animation: Animation<V>,
): WAAPIEligibility {
    if (!animation.targets || animation.targets.length === 0) {
        return { eligible: false, reason: "no DOM targets" };
    }
    if (typeof animation.targets[0]?.animate !== "function") {
        return {
            eligible: false,
            reason: "target does not implement Element.animate()",
        };
    }

    for (const frame of animation.frames) {
        // Reference comparison against the instance's ONE default renderer —
        // typed and bind-proof, unlike the former Symbol tag (which
        // `Function.prototype.bind` silently dropped, making every
        // CSSKeyframesAnimation read as "custom transform" and the whole
        // WAAPI path dead in practice).
        if (!animation.usesDefaultRenderer(frame.transform)) {
            return {
                eligible: false,
                reason: "custom transform function (not the default DOM renderer)",
            };
        }
    }

    const firstTF = animation.frames[0]?.timingFunction;
    if (firstTF && animation.frames.length > 1) {
        for (let i = 1; i < animation.frames.length; i++) {
            // Compare the CALLABLE identity, not the Easing wrapper — two
            // frames eased by the same resolved `fn` wrapped in distinct
            // `{ fn }` objects are uniform.
            if (animation.frames[i]!.timingFunction.fn !== firstTF.fn) {
                return {
                    eligible: false,
                    reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)",
                };
            }
        }
        // WAAPI applies its single easing PER SEGMENT (between consecutive
        // keyframe stops). A CSS-twinned easing (a spring's `linear()`)
        // across 2+ segments would restart the curve at every stop —
        // silently wrong on the compositor — so it stays on the rAF path,
        // which runs the true curve across the whole span.
        if (firstTF.css !== undefined) {
            return {
                eligible: false,
                reason: "CSS-twinned easing across multiple segments (WAAPI restarts the curve per segment)",
            };
        }
    }

    // WAAPI may delegate ONLY when the (uniform) easing has a FAITHFUL CSS
    // representation — a `.css` twin (a spring's `linear()`, an explicit
    // `cubic-bezier()`/CSS-keyword/`steps()` easing). A bespoke callable
    // (the value.js `easeInOutCubic` default, `easeOutCubic`, `bounceInEase`,
    // a user closure) has NO faithful CSS twin, so delegating it would run
    // BARE LINEAR on the compositor — a silent visual regression. Those stay
    // on the rAF path, which runs the true curve. (Pre-KF-B1 the WAAPI path
    // was dead in practice, so this keeps the resurrection faithful:
    // delegate only when the curve round-trips to CSS.)
    if (firstTF && firstTF.css === undefined) {
        return {
            eligible: false,
            reason: "easing has no faithful CSS twin (would run bare linear on the compositor)",
        };
    }

    for (const frame of animation.frames) {
        for (const interpVarArr of Object.values(frame.interpVars)) {
            for (const iv of interpVarArr) {
                if (
                    isComputedUnit(iv.start?.unit) ||
                    isComputedUnit(iv.stop?.unit)
                ) {
                    return {
                        eligible: false,
                        reason: `computed unit (${String(iv.start?.unit ?? iv.stop?.unit)}) requires DOM resolution`,
                    };
                }
                if (iv.start?.unit === "color" || iv.stop?.unit === "color") {
                    return {
                        eligible: false,
                        reason: "color interpolation requires perceptual lerp",
                    };
                }
            }
        }
    }

    return { eligible: true };
}

/**
 * Convert animation frames to WAAPI Keyframe[] format.
 */
export function toWAAPIKeyframes<V extends Vars>(
    animation: Animation<V>,
): Keyframe[] {
    const duration = animation.options.duration;
    const keyframes: Keyframe[] = [];

    const timePoints = new Set<number>();
    for (const frame of animation.frames) {
        timePoints.add(frame.time.start);
        timePoints.add(frame.time.stop);
    }

    const sortedTimes = [...timePoints].sort((a, b) => a - b);

    for (const t of sortedTimes) {
        const vars = animation.interpFrames(t, false);
        if (Object.keys(vars).length === 0) continue;
        const styleVars = unflattenObjectToString(vars);
        keyframes.push({
            offset: Math.max(0, Math.min(1, t / duration)),
            ...styleVars,
        });
    }

    return keyframes;
}

const DIRECTION_MAP: Record<string, PlaybackDirection> = {
    normal: "normal",
    reverse: "reverse",
    alternate: "alternate",
    "alternate-reverse": "alternate-reverse",
};

const FILL_MAP: Record<string, FillMode> = {
    none: "none",
    forwards: "forwards",
    backwards: "backwards",
    both: "both",
};

export function toWAAPIOptions<V extends Vars>(
    animation: Animation<V>,
): KeyframeEffectOptions {
    const opts = animation.options;
    const direction = DIRECTION_MAP[opts.direction];
    const fill = FILL_MAP[opts.fillMode];
    if (direction == null) {
        throw new TypeError(
            `Unrecognised animation direction "${opts.direction}".`,
        );
    }
    if (fill == null) {
        throw new TypeError(
            `Unrecognised animation fill mode "${opts.fillMode}".`,
        );
    }

    // WAAPI exposes ONE easing per animation. When the uniform timing
    // function carries a CSS twin — `Easing.css`, e.g. a spring's `linear()`
    // stops from `springTimingFunction` — emit it so the compositor runs the
    // true curve between the sampled keyframe endpoints. Otherwise fall back
    // to bare `linear` (the keyframe stops carry whatever intent JS
    // interpolation baked in). Eligibility already guaranteed a uniform
    // timing function AND rejects a CSS-twinned easing across multiple
    // segments (per-segment curve restart), so reading frame 0's is enough.
    const uniformTiming =
        animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
    const easing = uniformTiming.css ?? "linear";

    return {
        duration: opts.duration,
        delay: opts.delay,
        iterations:
            opts.iterationCount === Infinity ? Infinity : opts.iterationCount,
        direction,
        fill,
        easing,
    };
}

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
    animation: Animation<V>,
): Promise<void> {
    const keyframes = toWAAPIKeyframes(animation);
    const options = toWAAPIOptions(animation);

    const waAnimations: globalThis.Animation[] = animation.targets.map(
        (target) => target.animate(keyframes, options),
    );
    // Expose the handles on the instance so the engine's lifecycle methods
    // (`stop`/`reset`) can cancel the compositor animations — cancelling
    // rejects `wa.finished`, which the catch below treats as a halt.
    animation._waAnimations = waAnimations;

    // Shadow tick loop — drives lifecycle (onStart / iteration /
    // onEnd / events / pause / resume) so WAAPI playback has the
    // same observable state as the rAF path. No interpFrames calls;
    // WAAPI handles the visuals. Rides the animation's own RAFPlayback
    // driver so `stop()` halts it uniformly with every other loop.
    animation.playback.loop(async (now: number) => {
        if (animation.done) return false;
        await animation.advanceTo(now);
        if (animation.paused) {
            for (const wa of waAnimations) wa.pause();
        } else {
            for (const wa of waAnimations) {
                if (wa.playState === "paused") wa.play();
            }
        }
        return !animation.done;
    });

    try {
        await Promise.all(waAnimations.map((wa) => wa.finished));
    } catch {
        // `Animation.stop()`/`reset()` cancelled the compositor animations,
        // rejecting `finished` with an AbortError — a deliberate halt, not
        // an error. Swallow it so the awaited `play()` resolves cleanly.
    } finally {
        animation.playback.stop();
        animation._waAnimations = [];
    }
}
