/**
 * waapi-densify.test.ts — Q.WB4 the WAAPI curvature-adaptive sub-segment densify.
 *
 * The densify ({@link densifyInteriorTimes}, consumed by `toWAAPIKeyframes`)
 * replaced the retired fixed-8 uniform interior-stop emit with a best-first,
 * budget-bounded refinement that spends interior stops WHERE the true rAF curve
 * bends and NONE where it is near-linear. These are the contracts the wave's
 * gate (`proof:waapi-adaptive-densify`) measures, asserted here in jsdom:
 *   - a `linear` segment emits ZERO interior stops (the chord matches → no stop);
 *   - a bending segment emits MORE than zero (and is bounded by the cap);
 *   - the boundary endpoints are ALWAYS in the emitted set (never redistributed);
 *   - the adaptive emit's chord-to-curve fill is NEVER worse than the fixed-8's
 *     (the fidelity guard — measured against a local fixed-8 reproduction).
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { densifyInteriorTimes, toWAAPIKeyframes } from "../src/animation/waapi";
import { springTimingFunction } from "../src/animation/springTimingFunction";
import { resolveEasing } from "../src/animation/easing";

const DURATION = 1000;

const boundaryTimes = (anim: CSSKeyframesAnimation): number[] => {
    const pts = new Set<number>();
    for (const frame of anim.frames) {
        pts.add(frame.time.start);
        pts.add(frame.time.stop);
    }
    return [...pts].sort((a, b) => a - b);
};

/** The retired fixed-8 uniform interior emit — the fidelity-guard baseline. */
const fixedInteriorTimes = (
    sorted: readonly number[],
    duration: number,
): Set<number> => {
    const interior = new Set<number>();
    if (duration <= 0) return interior;
    for (let i = 1; i < sorted.length; i++) {
        const a = sorted[i - 1]!;
        const b = sorted[i]!;
        const span = b - a;
        if (span <= 0) continue;
        for (let s = 1; s <= 8; s++) interior.add(a + (span * s) / 9);
    }
    return interior;
};

/** The worst chord-to-curve error of an emitted offset set, fine-grid sampled. */
const chordError = (
    anim: CSSKeyframesAnimation,
    offsets: number[],
    duration: number,
): number => {
    const stops = [...offsets].sort((a, b) => a - b);
    const sample = (offset: number): Map<string, number> => {
        const out = new Map<string, number>();
        const vars = anim.interpFrames(offset * duration, false);
        for (const key in vars) {
            const leaf = vars[key];
            if (leaf === undefined) continue;
            for (let i = 0; i < leaf.length; i++) {
                const v = leaf[i]?.value;
                if (typeof v === "number" && Number.isFinite(v))
                    out.set(leaf.length > 1 ? `${key}.${i}` : key, v);
            }
        }
        return out;
    };
    const stopSamples = stops.map(sample);
    const ranges = new Map<string, { min: number; max: number }>();
    const grid: { offset: number; s: Map<string, number> }[] = [];
    const track = (s: Map<string, number>) => {
        for (const [k, v] of s) {
            const r = ranges.get(k);
            if (r === undefined) ranges.set(k, { min: v, max: v });
            else {
                if (v < r.min) r.min = v;
                if (v > r.max) r.max = v;
            }
        }
    };
    for (let g = 0; g <= 256; g++) {
        const offset = g / 256;
        const s = sample(offset);
        track(s);
        grid.push({ offset, s });
    }
    for (const s of stopSamples) track(s);
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
        const av = stopSamples[lo]!.get(key);
        const bv = stopSamples[hi]!.get(key);
        if (av === undefined || bv === undefined) return av ?? bv;
        const a = stops[lo]!;
        const b = stops[hi]!;
        return av + (bv - av) * (b === a ? 0 : (offset - a) / (b - a));
    };
    let worst = 0;
    for (const { offset, s } of grid) {
        for (const [key, trueV] of s) {
            const r = ranges.get(key)!;
            const span = r.max - r.min;
            if (span === 0) continue;
            const filled = fillAt(offset, key);
            if (filled === undefined) continue;
            const err = Math.abs(trueV - filled) / span;
            if (err > worst) worst = err;
        }
    }
    return worst;
};

const linearAnim = async () => {
    const easing = await resolveEasing("linear");
    const a = new CSSKeyframesAnimation({
        duration: DURATION,
        timingFunction: easing,
    });
    a.fromString(
        `from { transform: translateX(0px); } to { transform: translateX(300px); }`,
    );
    return a;
};

const bezierAnim = async () => {
    const easing = await resolveEasing("cubic-bezier(0.9, 0, 0.1, 1)");
    const a = new CSSKeyframesAnimation({
        duration: DURATION,
        timingFunction: easing,
    });
    a.fromString(
        `from { transform: translateX(0px); } to { transform: translateX(300px); }`,
    );
    return a;
};

const springAnim = () => {
    const spring = springTimingFunction({
        response: 0.5,
        dampingFraction: 0.45,
    });
    const a = new CSSKeyframesAnimation({
        duration: DURATION,
        timingFunction: spring,
    });
    a.fromString(
        `from { transform: translateX(0px); } to { transform: translateX(200px); }`,
    );
    return a;
};

describe("WAAPI curvature-adaptive densify (Q.WB4)", () => {
    it("a linear segment emits ZERO interior stops (the chord matches)", async () => {
        const a = await linearAnim();
        const interior = densifyInteriorTimes(a, boundaryTimes(a), DURATION);
        expect(interior.size).toBe(0);
    });

    it("a sharp cubic-bezier segment emits interior stops, bounded by the cap (16)", async () => {
        const a = await bezierAnim();
        const interior = densifyInteriorTimes(a, boundaryTimes(a), DURATION);
        expect(interior.size).toBeGreaterThan(0);
        expect(interior.size).toBeLessThanOrEqual(16);
    });

    it("a spring overshoot segment emits interior stops, bounded by the cap (16)", () => {
        const a = springAnim();
        const interior = densifyInteriorTimes(a, boundaryTimes(a), DURATION);
        expect(interior.size).toBeGreaterThan(0);
        expect(interior.size).toBeLessThanOrEqual(16);
    });

    it("every boundary endpoint appears in the emitted keyframe offsets", async () => {
        const a = await bezierAnim();
        const keyframes = toWAAPIKeyframes(a);
        const offsets = new Set(keyframes.map((k) => k.offset));
        for (const t of boundaryTimes(a)) {
            expect(offsets.has(t / DURATION)).toBe(true);
        }
    });

    it("the densify never drops a boundary (interior set excludes the boundaries)", async () => {
        const a = await bezierAnim();
        const sorted = boundaryTimes(a);
        const interior = densifyInteriorTimes(a, sorted, DURATION);
        // The interior set is strictly between boundaries — it never contains one.
        for (const t of sorted) expect(interior.has(t)).toBe(false);
    });

    it("FIDELITY GUARD: the adaptive emit is NEVER worse than fixed-8 on any curve", async () => {
        const corpus = [await linearAnim(), await bezierAnim(), springAnim()];
        for (const a of corpus) {
            const sorted = boundaryTimes(a);
            const adaptive = densifyInteriorTimes(a, sorted, DURATION);
            const fixed = fixedInteriorTimes(sorted, DURATION);
            const adaptiveOffsets = [...new Set([...sorted, ...adaptive])].map(
                (t) => t / DURATION,
            );
            const fixedOffsets = [...new Set([...sorted, ...fixed])].map(
                (t) => t / DURATION,
            );
            const adaptiveErr = chordError(a, adaptiveOffsets, DURATION);
            const fixedErr = chordError(a, fixedOffsets, DURATION);
            // Adaptive ≤ fixed-8 (with a tiny float epsilon) on EVERY curve.
            expect(adaptiveErr).toBeLessThanOrEqual(fixedErr + 1e-9);
        }
    });

    it("degenerate inputs (zero duration) emit NO interior stops", async () => {
        const a = await linearAnim();
        expect(densifyInteriorTimes(a, boundaryTimes(a), 0).size).toBe(0);
    });
});
