/**
 * `frame-compiler-numeric.ts` — the Q.WB3 numeric SoA fold-plan machinery,
 * lifted off `frame-compiler.ts` as a cohesive INTERNAL gestalt seam (Q.WF1
 * Band-F decomposition — the third SoA-style extraction this wave makes, beside
 * `group-soa.ts` and `waapi-densify.ts`).
 *
 * The fold plan partitions a frame's `allInterpVars` into the pure-NUMERIC
 * subset (packed into `Float64Array` endpoint buffers, folded via one
 * `lerpArray` on the dominant single-animation path) and the BOXED residual
 * (color/computed/mixed — the per-element `lerpValue` path). The numeric
 * carriers' `value` `ValueUnit`s ARE the write-back slots (the SAME slot
 * `lerpValue` mutates), so the strided write-back is bit-identical
 * (`proof:processframe-soa` interp-equal). The plan is built ONCE per frame at
 * `parse` (the F.W4 zero-alloc discipline — the `Float64Array`s allocated once,
 * reused per frame) and parked on `frame._numericPlan`; the engine's
 * `processFrame` reads it on the hot path.
 *
 * Cohesion (the decomposition seam): the plan builder is a PURE value-in →
 * plan-out unit over the interp-var set — it has NO dependency on the
 * keyframe-selector grammar, the named-selector deferred-resolution, the option
 * setters, or the compile/sort/reconcile pipeline that are the reason
 * `frame-compiler.ts`'s remaining code (and its two gate-pinned grammar
 * surfaces) stay. It mirrors `group.ts`'s `isNumericUnit` per-component K3
 * partition for the compositor. Statically imported by `frame-compiler.ts`,
 * never re-exported beyond the engine barrel; it rides the heavy chunk only
 * because the compiler imports it.
 */
import type {
    InterpolatedVar,
    NumericFoldPlan,
    Vars,
} from "./constants";

/**
 * Q.WB3 S2 — whether an `InterpolatedVar` is a pure-NUMERIC leaf the SoA fold
 * covers: BOTH endpoints are numeric (`typeof start/stop.value === "number"`),
 * the leaf is NOT computed (a `var`/`calc`/`vh`/`cq*` re-resolves against the live
 * box every frame — kept boxed), NOT a color (a `Color` cannot live in a
 * `Float64Array` — the GATED `ColorChannelPlan` frontier), and has no frozen
 * `_colorPlan`. The SAME K3 partition discipline `group.ts`'s `isNumericUnit` per
 * component runs for the compositor.
 */
export const isNumericInterpVar = (iv: InterpolatedVar<unknown>): boolean =>
    typeof iv.start.value === "number" &&
    typeof iv.stop.value === "number" &&
    iv.computed !== true &&
    iv.value.unit !== "color" &&
    iv._colorPlan == null;

/**
 * Q.WB3 S2 — build the numeric SoA fold plan for ONE frame's `allInterpVars`
 * (the F.W4 zero-alloc discipline: the `Float64Array`s are allocated ONCE here,
 * at parse, and reused per frame). Partitions the iv set into the NUMERIC subset
 * (packed into `from`/`to` endpoint buffers, folded via one `lerpArray`) and the
 * BOXED residual (color/computed/mixed — the per-element `lerpValue` path). The
 * numeric carriers' `value` `ValueUnit`s ARE the write-back slots (the SAME slot
 * `lerpValue` mutates), so the strided write-back yields a bit-identical result.
 */
export const buildNumericPlan = <V extends Vars>(
    allInterpVars: Array<InterpolatedVar<V>>,
): NumericFoldPlan<V> => {
    const numeric: Array<InterpolatedVar<V>> = [];
    const boxed: Array<InterpolatedVar<V>> = [];
    for (const iv of allInterpVars) {
        if (isNumericInterpVar(iv as InterpolatedVar<unknown>))
            numeric.push(iv);
        else boxed.push(iv);
    }
    const n = numeric.length;
    const from = new Float64Array(n);
    const to = new Float64Array(n);
    for (let s = 0; s < n; s++) {
        from[s] = numeric[s]!.start.value as unknown as number;
        to[s] = numeric[s]!.stop.value as unknown as number;
    }
    return { numeric, from, to, out: new Float64Array(n), boxed };
};
