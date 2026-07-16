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
import {
    canDensifyWAAPISlots,
    densifyInteriorTimes,
} from "./densify";

/**
 * Convert animation frames to WAAPI Keyframe[] format.
 *
 * Emits every stop boundary. Stable numeric slot/template shapes additionally
 * receive curvature-adaptive interior samples (Q.WB4,
 * {@link densifyInteriorTimes}); structural or changing shapes retain their
 * native per-keyframe CSS easing instead of pretending sparse boundaries are a
 * faithful linearization.
 */
export function toWAAPIKeyframes<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Keyframe[] {
    const duration = animation.options.duration;
    const keyframes: Keyframe[] = [];
    const multiSegment = animation.frames.length > 1;
    const bakeCurve = multiSegment && canDensifyWAAPISlots(animation);
    const segmentEasing = multiSegment && !bakeCurve
        ? animation.frames[0]?.timingFunction.css
        : undefined;
    if (multiSegment && !bakeCurve && segmentEasing === undefined) {
        throw new TypeError(
            "A multi-segment structural WAAPI animation requires a faithful CSS easing.",
        );
    }

    const timePoints = new Set<number>();
    for (const frame of animation.frames) {
        timePoints.add(frame.time.start);
        timePoints.add(frame.time.stop);
    }

    const sortedTimes = [...timePoints].sort((a, b) => a - b);

    // Stable numeric channels can be sampled honestly: interleave adaptive
    // interior times where the true rAF curve bends. Structural/changing slot
    // shapes stay boundary-only and use their native per-keyframe CSS easing.
    const sampleTimes = new Set<number>(sortedTimes);
    if (bakeCurve) {
        for (const t of densifyInteriorTimes(animation, sortedTimes, duration)) {
            sampleTimes.add(t);
        }
    }

    const lastTime = sortedTimes.at(-1);
    for (const t of [...sampleTimes].sort((a, b) => a - b)) {
        const vars = animation.interpFrames(t, false);
        if (Object.keys(vars).length === 0) continue;
        const keyframe: Keyframe = {
            offset: clamp(t / duration, 0, 1),
            ...vars,
        };
        // Non-numeric structural slots cannot be chord-measured honestly.
        // Preserve their native per-segment curve instead of feeding sparse
        // boundaries to a globally linear effect.
        if (segmentEasing !== undefined && t !== lastTime) {
            keyframe.easing = segmentEasing;
        }
        keyframes.push(keyframe);
    }

    return keyframes;
}
