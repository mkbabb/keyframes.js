/**
 * compile/numeric-plan.ts — the per-frame numeric SoA fold plan (Q.WB3 S2),
 * carved off `frame-compiler.ts` in R.W2b.
 *
 * `FrameCompiler.finalizeFrameVars` builds one `NumericFoldPlan` per compiled
 * frame: partition the frame's `allInterpVars` into the pure-NUMERIC subset
 * (packed into `from`/`to` endpoint `Float64Array`s, folded via one `lerpArray`)
 * and the BOXED residual (color/computed/mixed — the per-element `lerpValue`
 * path). The numeric carriers' `value` `ValueUnit`s ARE the write-back slots, so
 * the strided write-back is bit-identical (`proof:processframe-soa` interp-equal).
 *
 * value.js-free at runtime (the `InterpolatedVar`/`NumericFoldPlan` types erase);
 * rides the heavy compile chunk only because `frame-compiler.ts` imports it.
 */
import type { InterpolatedVar, NumericFoldPlan, Vars } from "../constants";

/**
 * Q.WB3 S2 — whether an `InterpolatedVar` is a pure-NUMERIC leaf the SoA fold
 * covers: BOTH endpoints are numeric, the leaf is NOT computed (a
 * `var`/`calc`/`vh`/`cq*` re-resolves against the live box every frame — kept
 * boxed), NOT a color (a `Color` cannot live in a `Float64Array`), and has no
 * frozen `_colorPlan`. The SAME K3 partition discipline `group.ts`'s
 * `isNumericUnit` runs for the compositor.
 */
const isNumericInterpVar = (iv: InterpolatedVar<unknown>): boolean =>
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
 * numeric carriers' `value` `ValueUnit`s ARE the write-back slots, so the strided
 * write-back is bit-identical (`proof:processframe-soa` interp-equal).
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
