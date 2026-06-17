/**
 * Leaf math + rAF shims, inlined locally so the light engines
 * (`SpringProgress`, `SmoothProgress`, `NumericAnimation`, `RAFPlayback`)
 * carry ZERO static import edge to `@mkbabb/value.js`.
 *
 * These are trivial, pure helpers — value.js owns the canonical copies,
 * but re-homing them here is the only way to sever the static edge: an
 * external `@mkbabb/value.js` import survives bundling as a bare module
 * specifier even when the symbol is a one-liner, so a spring-only
 * consumer would otherwise drag value.js into its graph. The heavy
 * parsing surface (`Animation` / `CSSKeyframesAnimation`) keeps importing
 * value.js directly — it genuinely needs `ValueUnit`/`Color`/parse.
 *
 * Kept byte-for-byte equivalent to value.js's `clamp`/`scale`/`lerp`
 * (src/math.ts) and `requestAnimationFrame`/`cancelAnimationFrame`
 * (src/utils.ts) so behaviour is identical across the seam.
 */

/** 60 fps frame budget in milliseconds — the non-DOM rAF fallback delay. */
export const FRAME_RATE = 1000 / 60;

/** Constrain a value between a lower and upper bound. */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Linear mapping of a value from one range to another. */
export function scale(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number = 0,
    toMax: number = 1,
): number {
    if (fromMax === fromMin) {
        throw new Error("fromMax and fromMin cannot be equal");
    }
    const slope = (toMax - toMin) / (fromMax - fromMin);
    return (value - fromMin) * slope + toMin;
}

/**
 * Linear interpolation between two values.
 * Canonical (a, b, t) — value-pair first, parameter last.
 */
export function lerp(start: number, end: number, t: number): number {
    return (1 - t) * start + t * end;
}

/**
 * Parallel linear interpolation over `Float64Array` channels — one fused loop
 * instead of K scalar `lerp` calls. Pixel-identical to K independent `lerp()`
 * calls: `out[i] = (1 - t)·start[i] + t·stop[i]`.
 *
 * Inlined here (the value.js-free leaf home) rather than imported from
 * `@mkbabb/value.js` (its `src/math.ts:60` `lerpArray`). value.js exposes ONLY
 * its barrel export (`@mkbabb/value.js` → `dist/value.js`) — no tree-shakeable
 * `./math` subpath — so a static `import { lerpArray } from "@mkbabb/value.js"`
 * here would pull value.js's CSS-grammar static init into the LIGHT bundle and
 * red `proof:boundary` (the source-grep assertion bans ANY static value.js
 * specifier in a light module). Re-homing it locally severs that edge — the
 * same discipline as `clamp`/`scale`/`lerp` above. Kept byte-equivalent to
 * value.js's copy so behaviour is identical across the seam.
 *
 * `start`, `stop`, `out` must share the same length; only `out` is written.
 * Returns `out`.
 */
export function lerpArray(
    start: Float64Array,
    stop: Float64Array,
    t: number,
    out: Float64Array,
): Float64Array {
    const n = start.length;
    const u = 1 - t;
    for (let i = 0; i < n; i++) {
        out[i] = u * start[i]! + t * stop[i]!;
    }
    return out;
}

/**
 * rAF shim with a `setTimeout` fallback for non-DOM environments
 * (jsdom / Node), where it returns a `NodeJS.Timeout` rather than a
 * numeric handle. Either suffices as an opaque cancel handle.
 */
export function requestAnimationFrame(callback: FrameRequestCallback) {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }

    let delay = FRAME_RATE;
    let prevT = Date.now();

    return setTimeout(() => {
        const t = Date.now();
        const delta = t - prevT;

        prevT = t;
        delay = Math.max(0, FRAME_RATE - delta);

        callback(t);
    }, delay);
}

/** Cancel a handle from the local `requestAnimationFrame` shim. */
export function cancelAnimationFrame(
    handle: number | ReturnType<typeof setTimeout> | undefined | null,
) {
    if (handle == null) return;

    // A numeric handle from `window.requestAnimationFrame` cancels through
    // the DOM API; a `setTimeout` fallback handle clears as a timer. The
    // shim's two return shapes pair with their two cancel paths.
    if (
        typeof handle === "number" &&
        typeof window !== "undefined" &&
        window.cancelAnimationFrame
    ) {
        return window.cancelAnimationFrame(handle);
    }

    clearTimeout(handle);
}
