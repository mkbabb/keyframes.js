/**
 * `internal/leaves.ts` is a deliberate byte-copy of value.js's
 * `clamp`/`lerp`/`scale` so the light engines carry no static value.js
 * edge. A byte-copy can silently drift from its canonical source — this
 * parity sweep is the gate that catches it (tests are heavy-side, so
 * importing value.js here is fine).
 */
import { describe, expect, it } from "vitest";
import {
    clamp as vClamp,
    lerpArray as vLerpArray,
    lerp as vLerp,
    scale as vScale,
} from "@mkbabb/value.js";
import {
    clamp,
    lerpArray,
    lerp,
    scale,
} from "../src/animation/internal/leaves";

const GRID = [
    -10, -1, -0.5, 0, 0.001, 0.25, 0.5, 0.75, 0.999, 1, 1.5, 2, 10, 1e6,
];

describe("internal/leaves ↔ value.js parity", () => {
    it("clamp matches value.js across the grid", () => {
        for (const v of GRID) {
            expect(clamp(v, 0, 1)).toBe(vClamp(v, 0, 1));
            expect(clamp(v, -5, 5)).toBe(vClamp(v, -5, 5));
        }
    });

    it("lerp matches value.js across the grid", () => {
        for (const t of GRID) {
            expect(lerp(0, 100, t)).toBe(vLerp(0, 100, t));
            expect(lerp(-50, 50, t)).toBe(vLerp(-50, 50, t));
        }
    });

    it("scale matches value.js across the grid", () => {
        for (const v of GRID) {
            expect(scale(v, 0, 10, 0, 1)).toBe(vScale(v, 0, 10, 0, 1));
            expect(scale(v, -1, 1, 0, 100)).toBe(vScale(v, -1, 1, 0, 100));
        }
    });

    it("lerpArray matches value.js across the grid (K=8 channels)", () => {
        // The L.W7 S2 inline — NumericAnimation's per-segment fused interp.
        // Gated against value.js's canonical `lerpArray` exactly like the
        // scalar leaves, so the inlined copy cannot silently drift.
        const start = new Float64Array([0, 1, -50, 0.25, 1e6, -1, 100, 0]);
        const stop = new Float64Array([1, 2, 50, 0.75, -1e6, 1, -100, 8]);
        for (const t of GRID) {
            const mine = new Float64Array(start.length);
            const theirs = new Float64Array(start.length);
            lerpArray(start, stop, t, mine);
            vLerpArray(start, stop, t, theirs);
            for (let i = 0; i < start.length; i++) {
                expect(mine[i]).toBe(theirs[i]);
            }
        }
    });

    it("lerpArray returns the same `out` buffer it writes", () => {
        const start = new Float64Array([0, 0]);
        const stop = new Float64Array([1, 1]);
        const out = new Float64Array(2);
        expect(lerpArray(start, stop, 0.5, out)).toBe(out);
        expect(vLerpArray(start, stop, 0.5, new Float64Array(2))).toEqual(
            out,
        );
    });
});
