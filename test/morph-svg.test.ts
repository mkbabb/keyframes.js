import { describe, expect, it } from "vitest";
import { MorphSVG, fromMorphSVG } from "../src/animation/morph-svg";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationOptionError } from "../src/animation/internal/errors";

/**
 * O.W6 — SVG path-shape morphing gate (proof:morphsvg-consume), the DM-3
 * 7-tranche chronic terminal.
 *
 * `fromMorphSVG` samples two `d` strings at `samples` uniform arc-length steps
 * over value.js's `PathGeometry`, pairs the points, and interpolates the
 * `(x, y)` pairs from the `from`-polyline (`0%`) to the `to`-polyline (`100%`).
 * The morph IS the engine lerping those per-point coordinates. These tests
 * lock: the `samples`-count keyframe set (matched point counts → an interpolable
 * channel), the degenerate-path `AnimationOptionError` refusal (honest-or-refuse,
 * NOT a silent identity), and THE KEYSTONE — a triangle→square morph whose
 * mid-`t` sample is DISTINCT from BOTH endpoints over the FULL sampled `(x, y)`
 * set (the morph's BODY moves, not just its possibly-shared anchor vertex).
 */

// The keystone fixtures (the full-loop-validated pair). The triangle and square
// SHARE the start vertex `M 0 0` — a single-endpoint compare would be
// degenerate (the clause-4 precision), so the distinctness is over the full set.
const TRIANGLE = "M 0 0 L 100 0 L 50 100 Z";
const SQUARE = "M 0 0 L 100 0 L 100 100 L 0 100 Z";

/** Read the engine's interpolated coordinate keys at a normalized t into a flat map. */
function coordsAt(anim: CSSKeyframesAnimation<any>, t: number): Map<string, number> {
    const ms = t * anim.options.duration;
    const out = anim.interpFrames(ms, false);
    const m = new Map<string, number>();
    for (const k of Object.keys(out)) {
        const v = out[k]?.[0]?.value;
        if (typeof v === "number") m.set(k, v);
    }
    return m;
}

/** The mean per-key absolute distance between two coordinate maps (same key set). */
function meanCoordDist(a: Map<string, number>, b: Map<string, number>): number {
    let sum = 0;
    let n = 0;
    for (const [k, va] of a) {
        const vb = b.get(k);
        if (vb === undefined) continue;
        sum += Math.abs(va - vb);
        n++;
    }
    return n === 0 ? 0 : sum / n;
}

describe("MorphSVG — PathGeometry-once construction + samples-count keyframe set (S1)", () => {
    it("emits a 2-stop (0%/100%) keyframe set whose interpolating keys are the per-point coordinates", () => {
        const samples = 16;
        const anim = fromMorphSVG(TRIANGLE, SQUARE, { samples, autoPlay: false });

        // Two endpoint stops — the morph is the engine lerping between them.
        const keys = new Set<string>();
        for (const frame of anim.frames) {
            for (const k of Object.keys(frame.interpVars)) keys.add(k);
        }
        // (samples + 1) point pairs → 2 * (samples + 1) coordinate keys.
        expect(keys.size).toBe(2 * (samples + 1));
        // Every key is a per-point morph coordinate (no stray channel).
        for (const k of keys) {
            expect(k).toMatch(/^--morph-\d+-[xy]$/);
        }
    });

    it("MATCHED point counts between the 0% and 100% frames (the engine-compat floor)", () => {
        // Sampling BOTH paths at the same count is what makes the polyline
        // channel interpolable — the same key set must appear at both endpoints.
        const samples = 24;
        const anim = fromMorphSVG(TRIANGLE, SQUARE, { samples, autoPlay: false });
        const start = coordsAt(anim, 0);
        const end = coordsAt(anim, 1);
        expect([...start.keys()].sort()).toEqual([...end.keys()].sort());
        expect(start.size).toBe(2 * (samples + 1));
    });

    it("default samples is 64 (the keystone-validated resolution)", () => {
        const anim = fromMorphSVG(TRIANGLE, SQUARE, { autoPlay: false });
        const keys = new Set<string>();
        for (const frame of anim.frames)
            for (const k of Object.keys(frame.interpVars)) keys.add(k);
        expect(keys.size).toBe(2 * (64 + 1));
    });
});

describe("MorphSVG — refuse, don't fake: a degenerate path throws AnimationOptionError (S1)", () => {
    it("BITE: a zero-length `from` path throws (not a silent identity morph)", () => {
        // `M 50 50 Z` / `M 50 50` have totalLength === 0.
        expect(() => fromMorphSVG("M 50 50 Z", SQUARE, { autoPlay: false })).toThrow(
            AnimationOptionError,
        );
        expect(() => fromMorphSVG("M 50 50 Z", SQUARE, { autoPlay: false })).toThrow(
            /zero arc-length/i,
        );
    });

    it("BITE: a zero-length `to` path throws", () => {
        expect(() => fromMorphSVG(TRIANGLE, "M 50 50", { autoPlay: false })).toThrow(
            AnimationOptionError,
        );
    });

    it("BITE: an empty `from`/`to` string throws", () => {
        expect(() => fromMorphSVG("", SQUARE, { autoPlay: false })).toThrow(
            AnimationOptionError,
        );
        expect(() => fromMorphSVG(TRIANGLE, "", { autoPlay: false })).toThrow(
            AnimationOptionError,
        );
    });

    it("BITE: samples < 2 (or non-integer) throws — a 1-sample morph has no body", () => {
        expect(() =>
            fromMorphSVG(TRIANGLE, SQUARE, { samples: 1, autoPlay: false }),
        ).toThrow(/samples/i);
        expect(() =>
            fromMorphSVG(TRIANGLE, SQUARE, { samples: 8.5, autoPlay: false }),
        ).toThrow(/samples/i);
    });
});

describe("MorphSVG — THE KEYSTONE: triangle→square mid-t is DISTINCT from BOTH endpoints (S1)", () => {
    it("the mid-t sample differs from BOTH the from-polyline AND the to-polyline (full set)", () => {
        const anim = fromMorphSVG(TRIANGLE, SQUARE, {
            samples: 64,
            autoPlay: false,
        });
        const from = coordsAt(anim, 0);
        const mid = coordsAt(anim, 0.5);
        const to = coordsAt(anim, 1);

        const midVsFrom = meanCoordDist(mid, from);
        const midVsTo = meanCoordDist(mid, to);
        const fromVsTo = meanCoordDist(from, to);

        // The morph MOVES the body: mid is distinct from each endpoint…
        expect(midVsFrom).toBeGreaterThan(1);
        expect(midVsTo).toBeGreaterThan(1);
        // …and, being the point-wise midpoint, sits BETWEEN them (each endpoint
        // distance is smaller than the endpoint-to-endpoint distance). This is
        // the full-loop-validated keystone (mean per-point distance ≈ midway).
        expect(midVsFrom).toBeLessThan(fromVsTo);
        expect(midVsTo).toBeLessThan(fromVsTo);
    });

    it("clause-4 hazard: the SHARED start vertex (M 0 0) is identical across from/mid/to", () => {
        // The single-endpoint compare WOULD be degenerate — proving why the
        // keystone above asserts distinctness over the FULL set, not one vertex.
        const anim = fromMorphSVG(TRIANGLE, SQUARE, { samples: 8, autoPlay: false });
        const from = coordsAt(anim, 0);
        const mid = coordsAt(anim, 0.5);
        const to = coordsAt(anim, 1);
        expect(from.get("--morph-0-x")).toBe(to.get("--morph-0-x"));
        expect(from.get("--morph-0-y")).toBe(to.get("--morph-0-y"));
        expect(mid.get("--morph-0-x")).toBe(from.get("--morph-0-x"));
    });

    it("the produced animation has a frame count > 0 (a real, non-empty morph)", () => {
        const anim = fromMorphSVG(TRIANGLE, SQUARE, { autoPlay: false });
        expect(anim.frames.length).toBeGreaterThan(0);
    });
});

describe("MorphSVG — the class wrapper + the morphed-d sampler", () => {
    it("the class exposes the underlying animation as the control handle", () => {
        const m = new MorphSVG(TRIANGLE, SQUARE, { autoPlay: false });
        expect(m.animation).toBeInstanceOf(CSSKeyframesAnimation);
        expect(m.samples).toBe(64);
    });

    it("sampleD(t) reassembles the morphed `d`, distinct from both endpoint d's at mid-t", () => {
        const m = new MorphSVG(TRIANGLE, SQUARE, { samples: 32, autoPlay: false });
        const dFrom = m.sampleD(0);
        const dMid = m.sampleD(0.5);
        const dTo = m.sampleD(1);
        // Each is a valid polyline `d` (M … L …).
        for (const d of [dFrom, dMid, dTo]) expect(d).toMatch(/^M [\d.-]+ [\d.-]+ L /);
        // The morphed mid `d` is distinct from BOTH endpoint d strings.
        expect(dMid).not.toBe(dFrom);
        expect(dMid).not.toBe(dTo);
        // sampleD clamps t outside [0,1] to the endpoints.
        expect(m.sampleD(-1)).toBe(dFrom);
        expect(m.sampleD(2)).toBe(dTo);
    });

    it("the class exposes .finished over the underlying animation", () => {
        const m = new MorphSVG(TRIANGLE, SQUARE, { autoPlay: false });
        return expect(m.finished).resolves.toBeUndefined();
    });
});
