/**
 * `stagger` — a construction-time per-index delay generator.
 *
 * The highest-ROI orchestration gap and the cheapest to close: stagger is a
 * pure delay distribution computed ONCE, at construction, then handed to the
 * substrate that already carries it — `AnimationGroup`'s per-child `delay`,
 * which already flows to `toWAAPIOptions` (`delay: opts.delay`). There is no
 * per-frame cost: the generator returns a number per index, nothing more.
 *
 * LIGHT module: it reads Value's rootless `/math` `clamp` through
 * `./internal/leaves` and accepts `ease` as a callable {@link TimingFunction}
 * or a typed {@link Easing} — never a string name. It pulls no parser/color
 * graph or heavy Keyframes engine.
 *
 * ```ts
 * const delay = stagger(items.length, { each: 50, from: "center" });
 * const group = new AnimationGroup(
 *     items.map((el, i) => ({
 *         animation: fadeIn(el),
 *         options: { delay: delay(i, items.length) },
 *     })),
 * );
 * ```
 */
import type { Easing, TimingFunction } from "../constants/types";
import { toEasing } from "../easing";
import { AnimationOptionError } from "../internal/errors";
import { clamp } from "../internal/leaves";

/**
 * Where the stagger originates — the index whose delay is zero, from which
 * the per-step delay grows outward:
 *
 * - `"first"` — index 0 (the default); a monotone ramp `0, each, 2·each, …`.
 * - `"last"`  — the final index; the ramp reversed.
 * - `"center"`— the midpoint; symmetric, growing toward both ends.
 * - `"edges"` — both ends at zero; symmetric, growing toward the center.
 * - a numeric index — an explicit origin; symmetric distance from it.
 */
export type StaggerOrigin = "first" | "last" | "center" | "edges" | number;

export interface StaggerOptions {
    /**
     * Per-step delay in milliseconds — the increment between adjacent indices
     * for a linear `from: "first"` ramp, and the unit the whole distribution
     * scales by. Defaults to `100`.
     */
    each?: number;
    /** The origin of the distribution. Defaults to `"first"`. */
    from?: StaggerOrigin;
    /**
     * Reshapes the (normalized) distance-from-origin distribution before it is
     * scaled by `each` — a callable {@link TimingFunction} or a typed
     * {@link Easing}, value.js-free. A string easing NAME is rejected; resolve
     * it up front via `await resolveEasing(name)`. Defaults to the identity
     * (a linear distribution).
     */
    ease?: TimingFunction | Easing;
}

/**
 * A per-index delay function: `(i, total?) => delayMs`. Carries a
 * `.delays(total?)` helper that materializes the whole distribution as an
 * array — convenient when the count is known up front. Both `total` args are
 * OPTIONAL: the implementation defaults them to the construction-time count
 * (`stagger(items, …)` / `stagger(count, …)`), so `fn(i)` and `fn.delays()`
 * are valid — the type must mirror that (it did not before S.B7, which is why
 * `test/stagger.test.ts`'s defaulting assertions RED'd once `test/` joined the
 * typecheck).
 */
export interface StaggerFn {
    (index: number, total?: number): number;
    /** Materialize the delays for a run of `total` indices (defaults to the
     *  construction-time count). */
    delays(total?: number): number[];
}

/** Resolve the (possibly symbolic) origin to a concrete index in `[0, total)`. */
const originIndex = (from: StaggerOrigin, total: number): number => {
    if (typeof from === "number") return clamp(from, 0, Math.max(0, total - 1));
    switch (from) {
        case "first":
            return 0;
        case "last":
            return total - 1;
        case "center":
            return (total - 1) / 2;
        case "edges":
            // Sentinel handled by the caller — distance is measured to the
            // NEAREST edge, not a single origin index.
            return -1;
    }
};

/**
 * The raw, un-eased distance (in index units) from the origin to `index`. For
 * `"edges"` this is the distance to the nearest end; for every other origin it
 * is `|index − origin|`.
 */
const distanceFromOrigin = (
    index: number,
    total: number,
    from: StaggerOrigin,
): number => {
    if (from === "edges") {
        return Math.min(index, total - 1 - index);
    }
    return Math.abs(index - originIndex(from, total));
};

/**
 * The maximum raw distance any index in `[0, total)` reaches from the origin —
 * the divisor that normalizes the distribution to `[0, 1]` before easing, and
 * the multiplier (× `each`) that scales it back so the largest delay is
 * `each · maxDistance` (adjacent steps are exactly `each` on a linear ramp).
 */
const maxDistance = (total: number, from: StaggerOrigin): number => {
    if (total <= 1) return 0;
    if (from === "edges") {
        return Math.floor((total - 1) / 2);
    }
    const origin = originIndex(from, total);
    return Math.max(origin, total - 1 - origin);
};

/**
 * Build a per-index delay generator. Pure construction-time — the returned
 * function does only arithmetic, so it costs nothing on the hot path.
 *
 * @param countOrItems — the run length, or an array whose `.length` is used.
 * @param options — `{ each, from, ease }`; see {@link StaggerOptions}.
 */
export function stagger(
    countOrItems: number | ArrayLike<unknown>,
    options: StaggerOptions = {},
): StaggerFn {
    const { each = 100, from = "first", ease } = options;
    if (typeof ease === "string") {
        // Fail-explicit, mirroring NumericAnimation: a string name needs the
        // async value.js registry and would otherwise be silently ignored.
        // Resolve it up front via `await resolveEasing(name)`.
        throw new AnimationOptionError(
            "ease",
            ease,
            "stagger accepts a callable TimingFunction or a typed Easing; " +
                "resolve a string name first via `await resolveEasing(name)`.",
        );
    }
    const reshape = ease ? toEasing(ease).fn : undefined;

    const defaultTotal =
        typeof countOrItems === "number" ? countOrItems : countOrItems.length;

    const delayAt = (index: number, total: number): number => {
        if (total <= 1) return 0;

        const max = maxDistance(total, from);
        if (max === 0) return 0;

        const distance = distanceFromOrigin(index, total, from);
        // Un-eased: the delay is exactly `distance · each` — adjacent steps on
        // a linear `from: "first"` ramp are precisely `each`, no float drift.
        if (!reshape) return distance * each;
        // Eased: normalize the distance to [0, 1], reshape with the easing,
        // then scale by `each · max` so the largest delay stays `each · max`
        // (the eased and un-eased distributions share endpoints).
        return reshape(distance / max) * each * max;
    };

    const fn = ((index: number, total: number = defaultTotal): number =>
        delayAt(index, total)) as StaggerFn;

    fn.delays = (total: number = defaultTotal): number[] =>
        Array.from({ length: total }, (_, i) => delayAt(i, total));

    return fn;
}
