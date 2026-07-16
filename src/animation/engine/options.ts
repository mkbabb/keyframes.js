/**
 * The fail-explicit option-NORMALIZER surface (the `Animation` setter contract,
 * lifted off the engine god-object). Each normalizer is a PURE function over its
 * raw input: genuine omission (`undefined`/`null`) returns the supplied default
 * (or a sentinel the caller treats as "leave unset"); present-but-malformed
 * input THROWS a typed `AnimationOptionError` naming the option and the
 * offending value — the same posture the layer API chose ("silent no-ops were
 * hiding consumer bugs") applied to the whole options surface.
 *
 * INTERNAL colocated module — NOT a barrel export. The engine setters stay thin
 * (assign `this.options.X = normalizeX(raw)` + the chainable `return this` + any
 * live-options side-effect like the frame re-time or the color renormalize);
 * the VALIDATION/parse logic — the bulk — lives here, value.js-free, so the
 * `engine.ts` class sheds it WITHOUT changing the `loadAnimationEngine()`
 * boundary. ZERO behavior change.
 */
import { parseCssScalar } from "@mkbabb/value.js/css";
import {
    COLOR_SPACES,
    DIRECTIONS,
    FILL_MODES,
    HUE_METHODS,
    defaultOptions,
} from "../constants";
import type { AnimationOptions, InputAnimationOptions } from "../constants";
import { resolveEasingOption } from "../compile/easing/easing-option";
import { AnimationOptionError, parseOption } from "../internal/errors";

/** Parse one CSS time scalar and convert it to milliseconds. */
const tryParseTime = (raw: string): number | undefined => {
    const parsed = parseCssScalar(raw);
    if (!parsed.ok || parsed.value.payload.type !== "number") return undefined;
    const { value, unit } = parsed.value.payload;
    if (!Number.isFinite(value)) return undefined;
    if (unit === "ms") return value;
    if (unit === "s") return value * 1000;
    return undefined;
};

/** Normalize `timingFunction` — omission → the default easing. */
export function normalizeTimingFunction(
    timingFunction: InputAnimationOptions["timingFunction"],
): AnimationOptions["timingFunction"] {
    return timingFunction == null
        ? defaultOptions.timingFunction
        : resolveEasingOption("timingFunction", timingFunction);
}

/** Normalize `iterationCount` — omission → default; `"infinite"`/`"∞"`/Infinity → Infinity. */
export function normalizeIterationCount(
    iterationCount: InputAnimationOptions["iterationCount"],
): number {
    if (iterationCount == null) {
        return defaultOptions.iterationCount;
    }
    if (
        iterationCount === "infinite" ||
        iterationCount === "∞" ||
        iterationCount === "Infinity" ||
        iterationCount === Infinity
    ) {
        return Infinity;
    }
    return parseOption(
        "iterationCount",
        iterationCount,
        (raw) => {
            const n =
                typeof raw === "string"
                    ? Number.parseFloat(raw.trim())
                    : (raw as number);
            return typeof n === "number" && !Number.isNaN(n) && n >= 0
                ? n
                : undefined;
        },
        'expected a non-negative count, "infinite", or Infinity',
    );
}

/**
 * Normalize `duration` — omission returns `undefined` (the caller keeps the
 * current value: a bare `setDuration()` is a no-op, the constructor always seeds
 * the default). A present value parses to a positive number-of-ms or throws.
 */
export function normalizeDuration(
    duration: InputAnimationOptions["duration"],
): number | undefined {
    if (duration == null) return undefined;
    return parseOption(
        "duration",
        duration,
        (raw) => {
            const n =
                typeof raw === "string" ? tryParseTime(raw) : (raw as number);
            return typeof n === "number" && isFinite(n) && n > 0
                ? n
                : undefined;
        },
        "expected a positive duration in milliseconds or a CSS time string",
    );
}

/** Normalize `delay` — omission → default; negative delays are valid CSS. */
export function normalizeDelay(
    delay: InputAnimationOptions["delay"],
): number {
    if (delay == null) return defaultOptions.delay;
    return parseOption(
        "delay",
        delay,
        (raw) => {
            const n =
                typeof raw === "string" ? tryParseTime(raw) : (raw as number);
            // Negative delays are valid CSS (start mid-animation).
            return typeof n === "number" && isFinite(n) ? n : undefined;
        },
        "expected a delay in milliseconds or a CSS time string",
    );
}

/** Normalize `direction` — omission → default; an off-enum value throws. */
export function normalizeDirection(
    direction: InputAnimationOptions["direction"],
): AnimationOptions["direction"] {
    if (direction == null) return defaultOptions.direction;
    if (!DIRECTIONS.includes(direction)) {
        throw new AnimationOptionError(
            "direction",
            direction,
            `expected one of: ${DIRECTIONS.join(", ")}`,
        );
    }
    return direction;
}

/** Normalize `fillMode` — omission → default; an off-enum value throws. */
export function normalizeFillMode(
    fillMode: InputAnimationOptions["fillMode"],
): AnimationOptions["fillMode"] {
    if (fillMode == null) return defaultOptions.fillMode;
    if (!FILL_MODES.includes(fillMode)) {
        throw new AnimationOptionError(
            "fillMode",
            fillMode,
            `expected one of: ${FILL_MODES.join(", ")}`,
        );
    }
    return fillMode;
}

/** Normalize a boolean option (`useWAAPI`/`respectReducedMotion`) — omission → default. */
export function normalizeBoolean(
    option: "useWAAPI" | "respectReducedMotion",
    value: boolean | undefined | null,
): boolean {
    if (value == null) return defaultOptions[option];
    if (typeof value !== "boolean") {
        throw new AnimationOptionError(option, value, "expected a boolean");
    }
    return value;
}

/** Normalize `colorSpace` — omission → default; an off-enum value throws. */
export function normalizeColorSpace(
    colorSpace: InputAnimationOptions["colorSpace"],
): AnimationOptions["colorSpace"] {
    if (colorSpace == null) return defaultOptions.colorSpace;
    if (!COLOR_SPACES.includes(colorSpace)) {
        throw new AnimationOptionError(
            "colorSpace",
            colorSpace,
            `expected one of: ${COLOR_SPACES.join(", ")}`,
        );
    }
    return colorSpace;
}

/**
 * Normalize `hueMethod` — omission returns `undefined` (leave unset; the color
 * machinery picks the space's default), a present-but-malformed value throws.
 */
export function normalizeHueMethod(
    hueMethod: InputAnimationOptions["hueMethod"],
): AnimationOptions["hueMethod"] | undefined {
    if (hueMethod == null) return undefined;
    if (!(HUE_METHODS as readonly string[]).includes(hueMethod)) {
        throw new AnimationOptionError(
            "hueMethod",
            hueMethod,
            `expected one of: ${HUE_METHODS.join(", ")}`,
        );
    }
    return hueMethod;
}
