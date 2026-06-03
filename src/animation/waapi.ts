import { COMPUTED_UNITS, unflattenObjectToString } from "@mkbabb/value.js";
import { getCSSEasing } from "./internal/css-easing";
import type { Animation } from "./engine";
import type { Vars } from "./constants";

const isComputedUnit = (
    unit: unknown,
): unit is (typeof COMPUTED_UNITS)[number] =>
    typeof unit === "string" &&
    (COMPUTED_UNITS as readonly string[]).includes(unit);

const DEFAULT_RENDERER = Symbol.for("keyframes.defaultRenderer");

const isDefaultTransform = (fn: unknown): boolean =>
    typeof fn === "function" && (fn as any)[DEFAULT_RENDERER] === true;

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
        if (!isDefaultTransform(frame.transform)) {
            return {
                eligible: false,
                reason: "custom transform function (not the default DOM renderer)",
            };
        }
    }

    if (animation.frames.length > 1) {
        const firstTF = animation.frames[0]!.timingFunction;
        for (let i = 1; i < animation.frames.length; i++) {
            if (animation.frames[i]!.timingFunction !== firstTF) {
                return {
                    eligible: false,
                    reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)",
                };
            }
        }
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
    // function carries a CSS easing string — today a spring's `linear()`
    // stops, which `springTimingFunction` tags its closure with — emit it so
    // the compositor runs the true curve between the sampled keyframe
    // endpoints. Otherwise fall back to bare `linear` (the keyframe stops
    // carry whatever intent JS interpolation baked in). Eligibility already
    // guaranteed a uniform timing function, so reading frame 0's is enough.
    //
    // NOTE: WAAPI applies this easing PER SEGMENT (between consecutive
    // keyframe stops). For the dominant spring case — a 2-stop from→to — that
    // is the whole animation. A spring across 3+ stops would restart the curve
    // each segment; uniform-timing eligibility plus the typical 2-stop spring
    // keep that edge rare.
    const uniformTiming =
        animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
    const easing = getCSSEasing(uniformTiming) ?? "linear";

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

    // Shadow rAF tick — drives lifecycle (onStart / iteration /
    // onEnd / events / pause / resume) so WAAPI playback has the
    // same observable state as the rAF path. No interpFrames calls;
    // WAAPI handles the visuals.
    let cancelled = false;
    const tickLoop = (now: number) => {
        if (cancelled || animation.done) return;
        animation.tick(now);
        if (animation.paused) {
            for (const wa of waAnimations) wa.pause();
        } else {
            for (const wa of waAnimations) {
                if (wa.playState === "paused") wa.play();
            }
        }
        animation.handleId = requestAnimationFrame(tickLoop);
    };
    animation.handleId = requestAnimationFrame(tickLoop);

    try {
        await Promise.all(waAnimations.map((wa) => wa.finished));
    } finally {
        cancelled = true;
    }
}
