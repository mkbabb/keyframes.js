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
    lerp as vLerp,
    scale as vScale,
} from "@mkbabb/value.js";
import { clamp, lerp, scale } from "../src/animation/internal/leaves";

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
});
