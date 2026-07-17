import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

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

/**
 * Map the engine's `animation-composition` operator (K.W7) to the WAAPI
 * `CompositeOperation` keyword — a Baseline keyword pass-through (Chrome/Edge
 * 112, Safari 16, Firefox 115). `replace`/`add`/`accumulate` are the exact CSS
 * composite operators WAAPI's `KeyframeEffectOptions.composite` accepts, so the
 * forward is identity. value.js + the engine guarantee the operator is one of
 * the three (the adapter only captures the CSS grammar's three keywords); a
 * stray value degrades to `replace` (the default composite), never a throw.
 */
const COMPOSITE_MAP: Record<string, CompositeOperation> = {
    replace: "replace",
    add: "add",
    accumulate: "accumulate",
};

/**
 * The UNIFORM `animation-composition` operator across an animation's compiled
 * frames (K.W7 S2). WAAPI exposes ONE effect-level `composite` per animation
 * (the per-keyframe `composite` member is the alternative; the effect-level
 * keyword is the faithful forward for a single-operator animation). Returns the
 * first non-`replace` composition found, or `replace` (the default) when none
 * is declared. Eligibility (`isWAAPIEligible`) already guaranteed the
 * operator is uniform when it admitted an `add`/`accumulate` animation, so
 * reading the first composited frame's operator is enough.
 */
const uniformComposite = <V extends Vars>(
    animation: KeyframesAnimation<V>,
): CompositeOperation => {
    for (const frame of animation.frames) {
        const op = frame.composition;
        if (op != null && op !== "replace") {
            return COMPOSITE_MAP[op] ?? "replace";
        }
    }
    return "replace";
};

export function toWAAPIOptions<V extends Vars>(
    animation: KeyframesAnimation<V>,
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

    // WAAPI exposes ONE effect easing per animation (applied to the whole
    // iteration progress). Two cases:
    //   - SINGLE segment (from/to): emit the uniform timing function's CSS twin
    //     (`Easing.css`, e.g. a spring's `linear()` stops) so the compositor runs
    //     the true curve between the two keyframe endpoints; bare `linear` when
    //     there is no twin (the endpoints carry whatever JS interpolation baked).
    //   - MULTI segment (S.F5c S2): emit bare `linear`. Numeric compiled slots
    //     are densely sampled from the true per-segment curve; structural slots
    //     that cannot be chord-measured retain the CSS twin on each boundary
    //     keyframe instead. Both forms therefore own easing exactly once.
    // Eligibility already guaranteed a uniform timing function and holds
    // `linear()` twins on rAF for WebKit (CE-1.0 — HW-accel refused), so reading
    // frame 0's is enough; `frames.length` is the segment count (from/to → 1).
    const uniformTiming =
        animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
    const easing =
        animation.frames.length > 1
            ? "linear"
            : (uniformTiming.css ?? "linear");

    // K.W7 S2 — the Baseline `composite` keyword pass-through. The compositor
    // honors `add`/`accumulate` by compositing the keyframe effect onto the
    // element's UNDERLYING value (the same base the rAF path snapshots), so the
    // SAME `composite:add` keyframe produces the SAME SUM on both backends (the
    // rAF↔WAAPI parity the §gate's clause (c) asserts). A pure-`replace`
    // animation emits `replace` — byte-identical to the pre-K.W7 options.
    const composite = uniformComposite(animation);

    const result: KeyframeEffectOptions = {
        duration: opts.duration,
        delay: opts.delay,
        iterations:
            opts.iterationCount === Infinity ? Infinity : opts.iterationCount,
        direction,
        fill,
        easing,
    };
    // Only emit a non-default composite — keep the options byte-identical for
    // the overwhelming `replace` majority (no behavioural change on that path).
    if (composite !== "replace") result.composite = composite;
    return result;
}
