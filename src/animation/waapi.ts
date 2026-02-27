import type { Animation } from ".";
import { unflattenObjectToString } from "../units/utils";
import { COMPUTED_UNITS } from "../units/constants";
import { transformTargetsStyle } from "./utils";
import type { Vars } from "./constants";

/**
 * Compositor-eligible CSS properties that WAAPI can run off main thread.
 */
const COMPOSITOR_PROPERTIES = new Set([
    "opacity",
    "transform",
    "filter",
    "backdrop-filter",
    // Transform sub-properties that get merged into transform
    "translate",
    "rotate",
    "scale",
]);

/**
 * Determines if an animation is eligible for WAAPI delegation.
 *
 * Eligible when ALL of:
 * 1. Has DOM targets
 * 2. Uses default transformTargetsStyle (no custom transform function)
 * 3. All frames use the same timing function (WAAPI only supports per-animation easing)
 * 4. No computed units (vh, vw, calc, var) in interpVars
 * 5. No LAB/OKLAB color interpolation
 */
export function isWAAPIEligible(animation: Animation): boolean {
    // 1. Must have DOM targets
    if (!animation.targets || animation.targets.length === 0) {
        return false;
    }

    // 2. Check for custom transform function — if any frame has a non-default transform,
    // we can't delegate. We compare against transformTargetsStyle identity.
    for (const frame of animation.frames) {
        const tf = frame.transform as Function;
        if (tf !== (transformTargetsStyle as Function) && tf !== (animation as any).transform) {
            return false;
        }
    }

    // 3. All frames must use the same timing function
    if (animation.frames.length > 1) {
        const firstTF = animation.frames[0].timingFunction;
        for (let i = 1; i < animation.frames.length; i++) {
            if (animation.frames[i].timingFunction !== firstTF) {
                return false;
            }
        }
    }

    // 4. No computed units (var, calc) in interpVars
    for (const frame of animation.frames) {
        for (const interpVarArr of Object.values(frame.interpVars)) {
            for (const iv of interpVarArr) {
                const startUnit = iv.start?.unit;
                const stopUnit = iv.stop?.unit;
                if (
                    (startUnit && (COMPUTED_UNITS as readonly string[]).includes(startUnit as string)) ||
                    (stopUnit && (COMPUTED_UNITS as readonly string[]).includes(stopUnit as string))
                ) {
                    return false;
                }
            }
        }
    }

    // 5. No color interpolation (LAB/OKLAB uses custom lerp)
    for (const frame of animation.frames) {
        for (const interpVarArr of Object.values(frame.interpVars)) {
            for (const iv of interpVarArr) {
                if (iv.start?.unit === "color" || iv.stop?.unit === "color") {
                    return false;
                }
            }
        }
    }

    return true;
}

/**
 * Convert animation frames to WAAPI Keyframe[] format.
 */
export function toWAAPIKeyframes(animation: Animation): Keyframe[] {
    const duration = animation.options.duration;
    const keyframes: Keyframe[] = [];

    // Collect all unique time points from template frames
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

        const keyframe: Keyframe = {
            offset: Math.max(0, Math.min(1, t / duration)),
            ...styleVars,
        };

        keyframes.push(keyframe);
    }

    return keyframes;
}

/**
 * Convert AnimationOptions to WAAPI KeyframeEffectOptions.
 */
export function toWAAPIOptions(animation: Animation): KeyframeEffectOptions {
    const opts = animation.options;

    const directionMap: Record<string, PlaybackDirection> = {
        "normal": "normal",
        "reverse": "reverse",
        "alternate": "alternate",
        "alternate-reverse": "alternate-reverse",
    };

    const fillMap: Record<string, FillMode> = {
        "none": "none",
        "forwards": "forwards",
        "backwards": "backwards",
        "both": "both",
    };

    return {
        duration: opts.duration,
        delay: opts.delay,
        iterations: opts.iterationCount === Infinity ? Infinity : opts.iterationCount,
        direction: directionMap[opts.direction] ?? "normal",
        fill: fillMap[opts.fillMode] ?? "forwards",
        // WAAPI easing is set per-animation — we use the frame's timing function name
        // For custom functions we fall back to linear (the JS interpolation handles easing)
        easing: "linear",
    };
}

/**
 * Play an animation using the Web Animations API.
 * Returns a promise that resolves when the animation completes.
 */
export async function playWAAPI(animation: Animation): Promise<globalThis.Animation[]> {
    const keyframes = toWAAPIKeyframes(animation);
    const options = toWAAPIOptions(animation);

    const waAnimations: globalThis.Animation[] = [];

    for (const target of animation.targets) {
        const wa = target.animate(keyframes, options);
        waAnimations.push(wa);
    }

    // Wait for all animations to finish
    await Promise.all(waAnimations.map((wa) => wa.finished));

    return waAnimations;
}
