/**
 * `waapi-densify.ts` — the WAAPI curvature-adaptive sub-segment densify machinery
 * (Q.WB4), lifted off `waapi.ts` as a cohesive INTERNAL gestalt seam (Q.WF1
 * Band-F decomposition — mirrors `group-soa.ts`: a self-contained perf-fold unit
 * a host module statically imports + re-exports).
 *
 * The densify replaces the retired fixed-8 uniform interior-stop emit with a
 * best-first, budget-bounded curvature refinement: it spends interior keyframe
 * stops WHERE the true rAF curve bends and NONE where it is near-linear. The
 * headline metric is FIDELITY + keyframe-COUNT (a BUILD-time emit, not a hot
 * path — the win is a smaller keyframe set on the common case + a provably-
 * no-worse chord-to-curve fill, both DETERMINISTIC and device-independent),
 * never a wall-clock perf claim. Gated by `proof:waapi-adaptive-densify` (the
 * corpus fidelity/count measurement) + `proof:platform-adopt` S3 (the bounded
 * interior sampling) — both grep `waapi.ts`, which re-exports this module's
 * surface so the anchored tokens stay textually present at the host.
 *
 * Cohesion (the decomposition seam): the densify reaches the animation ONLY
 * through `interpFrames(t, false)` (the public sampler) — it has NO dependency
 * on the WAAPI eligibility predicate, the `toWAAPIOptions` emission, or the
 * play/scroll delegation that are the reason `waapi.ts`'s remaining code stays.
 * Three pieces move whole + their helpers: the per-segment budget const, the
 * chord tolerance, the channel sampler/range scanner, the flatness predicate,
 * and the best-first refinement (`densifyInteriorTimes`).
 *
 * value.js is NOT reached here — the densify drives the host's numeric sampler,
 * never the parser; it rides the heavy chunk only because `waapi.ts` imports it
 * statically (KISS — the established colocated-internal pattern, no new boundary).
 */
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

/**
 * The TOTAL interior-stop budget per segment — a running CAP, NOT a recursion
 * depth (a depth-bounded recursion is exponential: 2^D stops at depth D). The
 * curvature-adaptive densify ({@link densifyInteriorTimes}) draws every interior
 * stop from ONE shared budget, so the emit is ALWAYS ≤ this cap on a segment — a
 * near-linear segment spends 0, a sharply-bending one approaches (and stops at)
 * the cap. 16 is double the retired fixed 8 (Q.WB4): a sharp bend may emit MORE
 * stops than the old uniform 8 (tightening the fill where it bent), while the
 * common case emits FAR fewer.
 */
export const WAAPI_MAX_SUBSEGMENT_STOPS = 16;

/**
 * The perceptual chord-to-curve tolerance — the fraction of a channel's FULL
 * value range within which the WAAPI piecewise-linear fill is treated as
 * matching the true rAF curve, so no interior stop is spent. 0.5% of the range
 * is a sub-pixel threshold on a typical animated sweep (a 200px range tolerates
 * a 1px chord gap), below visual perception. A channel is normalized by its OWN
 * full range, so a large-range and a small-range channel share ONE dimensionless
 * tolerance. The refinement spends an interior stop ONLY where the worst-channel
 * normalized error EXCEEDS this — dense where the curve bends, none where linear.
 */
export const WAAPI_CHORD_TOLERANCE = 0.005;

/**
 * The set of numeric channels an interp sample carries, flattened to a stable
 * key→scalar map. {@link Animation.interpFrames} returns `Record<string,
 * ValueUnit[]>` whose leaves MAY be a multi-component vector (a `translate(x,y)`
 * → length-2 `ValueUnit[]`); each component is a distinct curvature channel, so
 * the key is suffixed by component index. The numeric `.value` is copied OUT
 * eagerly — `interpFrames(t, false)` may alias a frame's live `flatVars` buffer
 * (the single-active-frame fast-path, engine.ts), so concurrent samples cannot
 * all read the same aliased object; the copy decouples them. Non-finite /
 * non-numeric leaves are skipped (they carry no curvature).
 */
type ChannelSample = Map<string, number>;

const sampleChannels = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    t: number,
): ChannelSample => {
    const out: ChannelSample = new Map();
    const vars = animation.interpFrames(t, false);
    for (const key in vars) {
        const leaf = vars[key];
        if (leaf === undefined) continue;
        for (let i = 0; i < leaf.length; i++) {
            const v = leaf[i]?.value;
            if (typeof v === "number" && Number.isFinite(v)) {
                out.set(leaf.length > 1 ? `${key}.${i}` : key, v);
            }
        }
    }
    return out;
};

/** Per-channel full value RANGE over the animation — the error normalizer. */
type ChannelRanges = Map<string, number>;

/**
 * The coarse pre-scan probe count whose extent fixes each channel's full value
 * RANGE (the error normalizer). The range must be the channel's WHOLE swing
 * across the segment — NOT a per-sub-segment span — so a sub-pixel wiggle in a
 * flat tail (a settled spring at 200px ± 0.3px) reads as a negligible fraction
 * of the 200px range (well below tolerance) and the refinement budget is NOT
 * wasted chasing settled-curve noise; it is spent on the genuine bend (the
 * overshoot peak). 64 probes resolve the extent of every realistic easing (a
 * spring overshoot, a bezier inflection) deterministically.
 */
const RANGE_SCAN_PROBES = 64;

const scanChannelRanges = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    startTime: number,
    stopTime: number,
): ChannelRanges => {
    const min = new Map<string, number>();
    const max = new Map<string, number>();
    const span = stopTime - startTime;
    for (let p = 0; p <= RANGE_SCAN_PROBES; p++) {
        const sample = sampleChannels(
            animation,
            startTime + (span * p) / RANGE_SCAN_PROBES,
        );
        for (const [key, v] of sample) {
            const lo = min.get(key);
            const hi = max.get(key);
            if (lo === undefined || v < lo) min.set(key, v);
            if (hi === undefined || v > hi) max.set(key, v);
        }
    }
    const ranges: ChannelRanges = new Map();
    for (const [key, lo] of min) ranges.set(key, (max.get(key) ?? lo) - lo);
    return ranges;
};

/**
 * The worst-channel chord-to-curve FLATNESS error of a segment `[a, b]`,
 * measured at the segment's INTERIOR — NOT at the midpoint alone. A single
 * midpoint probe is BLIND to a symmetric S-curve (a `cubic-bezier(.9,0,.1,1)`,
 * the canonical sharp inflection): its true midpoint lands EXACTLY on the chord,
 * so a midpoint-only test reads "flat" while the quarter-points bend hugely. The
 * predicate therefore probes TWO interior points — `a + (b−a)/4` and
 * `a + 3(b−a)/4` — and takes the worst chord deviation there. For each channel
 * present at both endpoints, the chord prediction at a probe `t` is the linear
 * interp of `(a, b)`; the error is `|true(t) − chord(t)|` normalized by the
 * channel's FULL range (NOT the sub-segment span — normalizing by the span makes
 * a sub-pixel wiggle in a flat tail read as a huge fraction and misdirects the
 * budget onto settled-curve noise; the full range keeps the error a TRUE
 * perceptual fraction so the budget chases the real bend). A channel with a
 * zero/absent full range (constant everywhere) contributes no error. Returns the
 * MAX over both probes and all channels — one bend anywhere forces the split.
 */
export const segmentFlatnessError = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    a: number,
    sampleA: ChannelSample,
    b: number,
    sampleB: ChannelSample,
    ranges: ChannelRanges,
): number => {
    const span = b - a;
    let worst = 0;
    for (const frac of [0.25, 0.75] as const) {
        const t = a + span * frac;
        const sampleT = sampleChannels(animation, t);
        for (const [key, trueV] of sampleT) {
            const av = sampleA.get(key);
            const bv = sampleB.get(key);
            if (av === undefined || bv === undefined) continue;
            const range = ranges.get(key);
            if (range === undefined || range === 0) continue;
            const chord = av + (bv - av) * frac;
            const err = Math.abs(trueV - chord) / range;
            if (err > worst) worst = err;
        }
    }
    return worst;
};

/**
 * One candidate sub-segment in the best-first refinement queue — its endpoints
 * (time + cached sample) and the worst-channel flatness error across its
 * interior (the priority key: the sub-segment that bends MOST is split first).
 */
interface DensifyCandidate {
    a: number;
    sampleA: ChannelSample;
    b: number;
    sampleB: ChannelSample;
    error: number;
}

/**
 * The curvature-adaptive interior-stop densify (Q.WB4) — replaces the retired
 * fixed-8 uniform loop. A BEST-FIRST (largest-bend-first) bounded refinement: for
 * each boundary segment it scans the per-channel full range, seeds a candidate
 * `[a, b]`, and — while the per-segment budget ({@link WAAPI_MAX_SUBSEGMENT_STOPS})
 * is unspent — repeatedly splits the candidate with the LARGEST chord-to-curve
 * flatness error at its MIDPOINT, emitting that midpoint as an interior stop and
 * re-queuing the two halves (re-scored). This is the key over a naive depth-first
 * split: a depth-first left-first recursion exhausts a shared budget on the
 * leftmost sub-intervals (concentrating every stop on one side and leaving the
 * other COARSER than the uniform fixed-8 — a fidelity REGRESSION); best-first
 * instead always spends the next stop where the curve bends worst GLOBALLY, so
 * each emitted stop monotonically lowers the max chord error and the result is
 * never coarser than uniform for the same count. The flatness predicate
 * ({@link segmentFlatnessError}, quarter-point probed, full-range normalized)
 * defeats the symmetric-inflection blind spot AND the settled-tail-noise trap. A
 * candidate already within {@link WAAPI_CHORD_TOLERANCE} is never split → a
 * near-linear segment emits ZERO interior stops. The total per segment is bounded
 * by the budget (NOT 2^D). The boundary endpoints are NEVER touched — only the
 * INTERIOR is redistributed. Reuses the EXISTING `interpFrames` sampler (no new
 * curve evaluator). Returns the union of every emitted interior time.
 */
export function densifyInteriorTimes<V extends Vars>(
    animation: KeyframesAnimation<V>,
    sortedTimes: readonly number[],
    duration: number,
): Set<number> {
    const interior = new Set<number>();
    if (duration <= 0) return interior;

    for (let i = 1; i < sortedTimes.length; i++) {
        const startTime = sortedTimes[i - 1]!;
        const stopTime = sortedTimes[i]!;
        if (stopTime - startTime <= 0) continue;

        const ranges = scanChannelRanges(animation, startTime, stopTime);
        const startSample = sampleChannels(animation, startTime);
        const stopSample = sampleChannels(animation, stopTime);

        const mkCandidate = (
            a: number,
            sampleA: ChannelSample,
            b: number,
            sampleB: ChannelSample,
        ): DensifyCandidate => ({
            a,
            sampleA,
            b,
            sampleB,
            error: segmentFlatnessError(
                animation,
                a,
                sampleA,
                b,
                sampleB,
                ranges,
            ),
        });

        // The active sub-segment queue (small — bounded by the budget — so a
        // linear scan for the max-error candidate is cheaper than a heap).
        const queue: DensifyCandidate[] = [
            mkCandidate(startTime, startSample, stopTime, stopSample),
        ];

        let budget = WAAPI_MAX_SUBSEGMENT_STOPS;
        while (budget > 0) {
            // Pick the candidate that bends the MOST (best-first refinement);
            // skip every candidate already within tolerance.
            let worstIdx = -1;
            let worstErr = WAAPI_CHORD_TOLERANCE;
            for (let q = 0; q < queue.length; q++) {
                if (queue[q]!.error > worstErr) {
                    worstErr = queue[q]!.error;
                    worstIdx = q;
                }
            }
            if (worstIdx === -1) break; // every candidate is within tolerance

            const seg = queue[worstIdx]!;
            const m = (seg.a + seg.b) / 2;
            // A degenerate split (midpoint coincides with an endpoint under
            // float precision) cannot be refined further — retire it.
            if (m <= seg.a || m >= seg.b) {
                queue.splice(worstIdx, 1);
                continue;
            }
            const sampleM = sampleChannels(animation, m);
            interior.add(m);
            budget--;
            // Replace the split candidate with its two re-scored halves.
            queue.splice(
                worstIdx,
                1,
                mkCandidate(seg.a, seg.sampleA, m, sampleM),
                mkCandidate(m, sampleM, seg.b, seg.sampleB),
            );
        }
    }

    return interior;
}
