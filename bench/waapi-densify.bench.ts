/**
 * waapi-densify.bench.ts — Q.WB4 the WAAPI sub-segment densify MEASURE-FIRST
 * corpus: the FIXED-8 uniform emit vs the CURVATURE-ADAPTIVE emit over a
 * curvature corpus, recording per-curve the interior-stop COUNT and the
 * chord-to-curve ERROR (the max gap between the emitted stops' piecewise-linear
 * fill and the true rAF `interpFrames` curve, sampled at a fine grid).
 *
 * The headline metric is FIDELITY + keyframe-COUNT, not throughput: the densify
 * is a BUILD-time emit (once per animation construction, NOT per frame), so the
 * win is (a) a smaller keyframe set on the common case + (b) a provably-no-worse
 * chord-to-curve fill — both DETERMINISTIC, device-independent. The `bench()`
 * arms below are an OBSERVE-ONLY throughput note (the emit is build-time, never
 * a hard CI predicate — the device-dependence-greening spine); the
 * count/error VERDICT is computed deterministically by
 * {@link measureDensifyCorpus}. (U.N2: the former
 * The former adaptive-densify decision gate dissolved; the densify
 * fidelity/count/boundary + multi-segment-eligible oracles now live in
 * `test/waapi/waapi-densify.test.ts`.)
 *
 * Imports `CSSKeyframesAnimation` from the VALUE module `engine`, never the
 * type-only barrel `../src/animation`.
 */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { densifyInteriorTimes } from "../src/animation/waapi";
import { springTimingFunction } from "../src/animation/physics/spring";
import { resolveEasing } from "../src/animation/easing";
import type { Easing } from "../src/animation/constants";
import type { KeyframesAnimation } from "../src/animation/engine";

const DURATION = 1000;

/**
 * The retired FIXED-8 uniform interior-stop emit (Q.WB4 deleted from
 * `waapi.ts`), reproduced HERE as the baseline the adaptive emit is measured
 * against — exactly 8 evenly-spaced interior times per segment, curve-agnostic.
 * It lives only in the bench/gate so the source carries ONE emit (no dead
 * parallel path); the comparison is honest (the same boundaries, the same
 * `interpFrames` curve).
 */
const FIXED_SUBSEGMENT_STOPS = 8;

export const fixedInteriorTimes = (
    sortedTimes: readonly number[],
    duration: number,
): Set<number> => {
    const interior = new Set<number>();
    if (FIXED_SUBSEGMENT_STOPS <= 0 || duration <= 0) return interior;
    for (let i = 1; i < sortedTimes.length; i++) {
        const a = sortedTimes[i - 1]!;
        const b = sortedTimes[i]!;
        const span = b - a;
        if (span <= 0) continue;
        for (let s = 1; s <= FIXED_SUBSEGMENT_STOPS; s++) {
            interior.add(a + (span * s) / (FIXED_SUBSEGMENT_STOPS + 1));
        }
    }
    return interior;
};

/** The sorted boundary times of an animation's frames (start + stop of each). */
export const boundaryTimes = <V extends Record<string, number | string>>(
    animation: KeyframesAnimation<V>,
): number[] => {
    const pts = new Set<number>();
    for (const frame of animation.frames) {
        pts.add(frame.time.start);
        pts.add(frame.time.stop);
    }
    return [...pts].sort((a, b) => a - b);
};

/**
 * The chord-to-curve ERROR of an emitted offset set: the MAX gap, over a fine
 * grid of probe times and over every animated channel, between the piecewise-
 * linear fill of the emitted stops (the WAAPI compositor's actual fill) and the
 * true rAF `interpFrames` curve — normalized per channel by the channel's full
 * value range across the animation (so it is a dimensionless fraction, the same
 * perceptual scale the densify's tolerance uses). This is the FIDELITY metric:
 * how far the compositor's piecewise-linear fill can drift from the JS curve.
 */
const GRID = 257; // an odd fine grid → probes land BETWEEN the fixed stops

export const chordToCurveError = <V extends Record<string, number | string>>(
    animation: KeyframesAnimation<V>,
    emittedOffsets: number[],
    duration: number,
): number => {
    // The emitted stops, sorted, in OFFSET space [0,1] — the breakpoints the
    // compositor interpolates piecewise-linearly between. The TRUE curve is
    // sampled at `offset * duration` (the time `interpFrames` consumes), so the
    // fill (offset space) and the curve (time space) are compared at the SAME
    // normalized position — no time/offset unit mix.
    const stops = [...emittedOffsets].sort((a, b) => a - b);
    const sampleAtOffset = (offset: number): Map<string, number> => {
        const out = new Map<string, number>();
        const vars = animation.interpFrames(offset * duration, false);
        for (const key in vars) {
            const leaf = vars[key];
            if (typeof leaf === "number" && Number.isFinite(leaf)) out.set(key, leaf);
        }
        return out;
    };

    const stopSamples = stops.map(sampleAtOffset);

    // Per-channel full range over the whole animation (the normalizer) — built
    // from the fine grid so a channel that only moves between stops is captured.
    const ranges = new Map<string, { min: number; max: number }>();
    const trackRange = (s: Map<string, number>) => {
        for (const [k, v] of s) {
            const r = ranges.get(k);
            if (r === undefined) ranges.set(k, { min: v, max: v });
            else {
                if (v < r.min) r.min = v;
                if (v > r.max) r.max = v;
            }
        }
    };

    const gridSamples: { offset: number; s: Map<string, number> }[] = [];
    for (let g = 0; g <= GRID; g++) {
        const offset = g / GRID;
        const s = sampleAtOffset(offset);
        trackRange(s);
        gridSamples.push({ offset, s });
    }
    for (const s of stopSamples) trackRange(s);

    // The piecewise-linear fill at `offset`: locate the bracketing stop pair and
    // lerp each channel — the EXACT thing WAAPI does between keyframe offsets.
    const fillAt = (offset: number, key: string): number | undefined => {
        let lo = 0;
        let hi = stops.length - 1;
        if (hi < 0) return undefined;
        if (offset <= stops[0]!) return stopSamples[0]!.get(key);
        if (offset >= stops[hi]!) return stopSamples[hi]!.get(key);
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (stops[mid]! <= offset) lo = mid;
            else hi = mid;
        }
        const a = stops[lo]!;
        const b = stops[hi]!;
        const av = stopSamples[lo]!.get(key);
        const bv = stopSamples[hi]!.get(key);
        if (av === undefined || bv === undefined) return av ?? bv;
        const frac = b === a ? 0 : (offset - a) / (b - a);
        return av + (bv - av) * frac;
    };

    let worst = 0;
    for (const { offset, s } of gridSamples) {
        for (const [key, trueV] of s) {
            const r = ranges.get(key)!;
            const span = r.max - r.min;
            if (span === 0) continue; // a constant channel — chord is exact
            const filled = fillAt(offset, key);
            if (filled === undefined) continue;
            const err = Math.abs(trueV - filled) / span;
            if (err > worst) worst = err;
        }
    }
    return worst;
};

/**
 * The corpus: each curve is a CSS-twinned-easing animation whose true rAF curve
 * bends differently —
 *  - cubic-bezier-inflection: a steep S-curve `cubic-bezier(.9,0,.1,1)` (sharp
 *    mid-segment inflection);
 *  - spring-overshoot: an underdamped spring `linear()` twin (overshoots past 1);
 *  - vh-transform: a `vh`-unit translate (kept simple as a px-magnitude sweep —
 *    the curvature corpus exercises the BEND, not the unit-resolution DOM path,
 *    which is jsdom-resolved elsewhere);
 *  - linear-baseline: a `linear()` straight ramp (ZERO interior stops expected).
 */
export type CorpusEntry = {
    name: string;
    build: () => Promise<KeyframesAnimation<Record<string, number | string>>>;
};

/**
 * S.F5c S2 — a MULTI-SEGMENT (3-stop) uniform spring `linear()` twin. Before
 * this wave WAAPI REFUSED any multi-segment CSS-twin easing ("WAAPI restarts the
 * curve per segment"); the densify + single-`linear()` collapse makes it eligible
 * — the composite per-segment spring curve is BAKED into densely-sampled
 * keyframes fed a single bare-`linear` effect easing (identity), so the
 * compositor's piecewise-linear fill tracks the true rAF curve with NO
 * per-segment restart. Reused by `test/waapi/waapi-densify.test.ts`'s eligibility
 * clause (it attaches a fake `{ animate }` target so `isWAAPIEligible` runs in
 * the node probe).
 */
export const buildMultiSegmentSpring = (): KeyframesAnimation<
    Record<string, number | string>
> => {
    const spring = springTimingFunction({
        response: 0.5,
        dampingFraction: 0.6,
    });
    const a = new CSSKeyframesAnimation({
        duration: DURATION,
        timingFunction: spring,
    });
    a.fromString(
        "0% { opacity: 0; } 50% { opacity: 0.75; } 100% { opacity: 1; }",
    );
    return a as unknown as KeyframesAnimation<Record<string, number | string>>;
};

export const buildCorpus = (): CorpusEntry[] => [
    {
        name: "cubic-bezier-inflection",
        build: async () => {
            const easing: Easing = await resolveEasing(
                "cubic-bezier(0.9, 0, 0.1, 1)",
            );
            const a = new CSSKeyframesAnimation({
                duration: DURATION,
                timingFunction: easing,
            });
            a.fromString("from { opacity: 0; } to { opacity: 1; }");
            return a as unknown as KeyframesAnimation<Record<string, number | string>>;
        },
    },
    {
        name: "spring-overshoot",
        build: async () => {
            const spring = springTimingFunction({
                response: 0.5,
                dampingFraction: 0.45,
            });
            const a = new CSSKeyframesAnimation({
                duration: DURATION,
                timingFunction: spring,
            });
            a.fromString("from { opacity: 0; } to { opacity: 1; }");
            return a as unknown as KeyframesAnimation<Record<string, number | string>>;
        },
    },
    {
        name: "sharp-opacity",
        build: async () => {
            // A second sharp-bezier scalar track keeps the curvature comparison
            // on the public authored-value boundary.
            const easing: Easing = await resolveEasing(
                "cubic-bezier(0.7, 0, 0.3, 1)",
            );
            const a = new CSSKeyframesAnimation({
                duration: DURATION,
                timingFunction: easing,
            });
            a.fromString("from { opacity: 0; } to { opacity: 1; }");
            return a as unknown as KeyframesAnimation<Record<string, number | string>>;
        },
    },
    {
        name: "linear-baseline",
        build: async () => {
            const easing: Easing = await resolveEasing("linear");
            const a = new CSSKeyframesAnimation({
                duration: DURATION,
                timingFunction: easing,
            });
            a.fromString("from { opacity: 0; } to { opacity: 1; }");
            return a as unknown as KeyframesAnimation<Record<string, number | string>>;
        },
    },
    {
        // S.F5c S2 — the MULTI-SEGMENT (2-segment) spring, previously REFUSED
        // outright (a CSS-twin easing restarts per segment on WAAPI). The densify
        // bakes the composite per-segment curve into keyframes; the fidelity guard
        // holds it to ≤ the fixed-8 emit exactly as for the single-segment curves.
        name: "multi-segment-spring",
        build: async () => buildMultiSegmentSpring(),
    },
];

export type DensifyMeasure = {
    name: string;
    fixed: { interiorCount: number; chordError: number };
    adaptive: { interiorCount: number; chordError: number };
};

/**
 * The DETERMINISTIC verdict the gate reads: for every corpus curve, the FIXED-8
 * and the CURVATURE-ADAPTIVE emit's (interiorCount, chordError). Pure + device-
 * independent (integer counts + a numeric error over a fixed grid — no
 * wall-clock). `test/waapi/waapi-densify.test.ts` owns the correctness claim.
 */
export const measureDensifyCorpus = async (): Promise<DensifyMeasure[]> => {
    const out: DensifyMeasure[] = [];
    for (const entry of buildCorpus()) {
        const animation = await entry.build();
        const sorted = boundaryTimes(animation);

        const fixedInterior = fixedInteriorTimes(sorted, DURATION);
        const adaptiveInterior = densifyInteriorTimes(
            animation,
            sorted,
            DURATION,
        );

        // The emitted OFFSET set each emit hands WAAPI = the boundaries ∪ the
        // interior, normalized to [0,1] (the keyframe offset space).
        const toOffsets = (interior: Set<number>): number[] => {
            const times = new Set<number>(sorted);
            for (const t of interior) times.add(t);
            return [...times].map((t) => t / DURATION);
        };

        out.push({
            name: entry.name,
            fixed: {
                interiorCount: fixedInterior.size,
                chordError: chordToCurveError(
                    animation,
                    [...sorted, ...fixedInterior].map((t) => t / DURATION),
                    DURATION,
                ),
            },
            adaptive: {
                interiorCount: adaptiveInterior.size,
                chordError: chordToCurveError(
                    animation,
                    toOffsets(adaptiveInterior),
                    DURATION,
                ),
            },
        });
    }
    return out;
};

// ── OBSERVE-ONLY throughput note (the emit is BUILD-time, not a hard CI
// predicate — the device-dependence-greening spine). The gate VERDICT is the
// deterministic count + error above, never this wall-clock.
//
// GUARD: the `describe`/`bench` registration runs ONLY under the vitest worker
// (it reads `import.meta.vitest`-equivalent runner state). The pure helpers
// above (`measureDensifyCorpus`, `chordToCurveError`, …) are importable in a
// bare `tsx` context (the proof's deterministic probe) WITHOUT firing the
// runner-only suite registration that would throw outside a vitest worker. ─────
const underVitest =
    typeof (globalThis as { __vitest_worker__?: unknown }).__vitest_worker__ !==
    "undefined";

if (underVitest)
    describe("WAAPI densify emit (Q.WB4 — build-time, observe-only throughput)", () => {
        let corpus: {
            name: string;
            animation: KeyframesAnimation<Record<string, number | string>>;
            sorted: number[];
        }[] = [];

        bench(
            "curvature-adaptive densify · full corpus",
            () => {
                for (const { animation, sorted } of corpus) {
                    densifyInteriorTimes(animation, sorted, DURATION);
                }
            },
            {
                async setup() {
                    corpus = [];
                    for (const entry of buildCorpus()) {
                        const animation = await entry.build();
                        corpus.push({
                            name: entry.name,
                            animation,
                            sorted: boundaryTimes(animation),
                        });
                    }
                },
            },
        );

        bench(
            "fixed-8 uniform densify · full corpus",
            () => {
                for (const { sorted } of corpus) {
                    fixedInteriorTimes(sorted, DURATION);
                }
            },
            {
                async setup() {
                    corpus = [];
                    for (const entry of buildCorpus()) {
                        const animation = await entry.build();
                        corpus.push({
                            name: entry.name,
                            animation,
                            sorted: boundaryTimes(animation),
                        });
                    }
                },
            },
        );
    });
