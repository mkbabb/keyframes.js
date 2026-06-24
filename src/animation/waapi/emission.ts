import { unflattenObjectToString } from "@mkbabb/value.js";
import { clamp } from "../internal/leaves";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

// ── Curvature-adaptive sub-segment densify (Q.WB4) ────────────────────────
// The best-first, budget-bounded curvature refinement (`densifyInteriorTimes`
// + its `WAAPI_MAX_SUBSEGMENT_STOPS` budget, the chord tolerance, the channel
// sampler/range scanner, and the `segmentFlatnessError` predicate) was lifted
// into the colocated INTERNAL `./densify` module as a cohesive gestalt seam
// (Q.WF1 Band-F decomposition — mirrors `group/soa.ts`). It reaches the
// animation ONLY through `interpFrames` (the public sampler), so it is fully
// separable from the eligibility/options/delegation surface beside it. The
// densify public tokens are re-exported by the `waapi/index.ts` barrel
// (R.W1 — the barrel owns the unified surface; no flat-sibling relay through
// this module). `toWAAPIKeyframes` below imports `densifyInteriorTimes` directly.
import { densifyInteriorTimes } from "./densify";

/**
 * Convert animation frames to WAAPI Keyframe[] format.
 *
 * Emits a keyframe at every stop boundary AND a CURVATURE-ADAPTIVE set of
 * interior samples per segment (Q.WB4, {@link densifyInteriorTimes}) by
 * evaluating the true rAF curve (`interpFrames`, which runs each frame's
 * per-segment easing) at offsets where the curve BENDS — so the compositor's
 * piecewise-linear fill tracks the JS curve, not just its endpoints, while
 * spending NO interior stops on a near-linear segment.
 */
export function toWAAPIKeyframes<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Keyframe[] {
    const duration = animation.options.duration;
    const keyframes: Keyframe[] = [];

    const timePoints = new Set<number>();
    for (const frame of animation.frames) {
        timePoints.add(frame.time.start);
        timePoints.add(frame.time.stop);
    }

    const sortedTimes = [...timePoints].sort((a, b) => a - b);

    // Densify: between each pair of consecutive boundaries, interleave the
    // CURVATURE-ADAPTIVE interior sample times — dense where the true rAF curve
    // bends, ZERO where it is near-linear. The set dedupes against the
    // boundaries, so a zero-width segment (start === stop) contributes nothing
    // and degenerate inputs (duration ≤ 0) stay boundary-only. The boundary
    // endpoints are ALWAYS emitted — the adaptive emit redistributes ONLY the
    // interior, never drops a boundary — so the densify is never a regression.
    const sampleTimes = new Set<number>(sortedTimes);
    for (const t of densifyInteriorTimes(animation, sortedTimes, duration)) {
        sampleTimes.add(t);
    }

    for (const t of [...sampleTimes].sort((a, b) => a - b)) {
        const vars = animation.interpFrames(t, false);
        if (Object.keys(vars).length === 0) continue;
        const styleVars = unflattenObjectToString(vars);
        keyframes.push({
            offset: clamp(t / duration, 0, 1),
            ...styleVars,
        });
    }

    return keyframes;
}
