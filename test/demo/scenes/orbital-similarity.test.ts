// SERVED MODEL: claude-opus-5-5
/**
 * KF-M2 · G2.3 (value.js COHESION §0hm) — two pointers, one similarity, pure.
 * D-7 (pinch was additive: 2× the finger distance scaled 1.064×), D-13
 * (two-finger drag panned 1.43×), D-30 (the twist sentinel dropped a valid
 * 0 rad frame: 87° for a 90° twist). Born RED: `similarity.ts` does not exist
 * at the pre-cure bytes.
 */
import { describe, expect, it } from "vitest";
import {
    anchoredTranslate,
    clampToBox,
    engagePair,
    readPair,
    softDeadzone,
    TWIST_DEADZONE_RAD,
} from "../../../demo/scenes/cube/orbital-drag/similarity";

const P = (x: number, y: number) => ({ x, y });
const DEG = Math.PI / 180;

/** Fingers at ±r about a centre, at angle a (rad). */
const pair = (cx: number, cy: number, r: number, a: number) =>
    [P(cx - r * Math.cos(a), cy - r * Math.sin(a)), P(cx + r * Math.cos(a), cy + r * Math.sin(a))] as const;

describe("G2.3 (a) — a spread with the centroid fixed is zoom only", () => {
    it("80 → 160 px gives k = 2 ± 1e-9, no roll, no pan", () => {
        const [a0, b0] = pair(200, 300, 40, 0.3);
        const [a, b] = pair(200, 300, 80, 0.3);
        const r = readPair(a0, b0, a, b);
        expect(Math.abs(r.k - 2)).toBeLessThan(1e-9);
        expect(Math.abs(r.dTheta)).toBeLessThan(1e-12);
        expect(Math.hypot(r.dm.x, r.dm.y)).toBeLessThan(1e-12);
        const e = engagePair(r);
        expect(e.dTheta).toBe(0);
        expect(e.dm).toEqual({ x: 0, y: 0 });
        // After the dead zone is paid back, the zoom is within 0.01 of 2.
        expect(Math.abs(e.k - 2)).toBeLessThan(0.01);
    });
});

describe("G2.3 (b) — a twist at constant distance is roll only", () => {
    it("a 90° twist reads 90° ± 0.5° and k = 1 ± 0.005 (the former 87°)", () => {
        const [a0, b0] = pair(200, 300, 60, 0);
        const [a, b] = pair(200, 300, 60, 90 * DEG);
        const r = readPair(a0, b0, a, b);
        expect(r.dTheta / DEG).toBeCloseTo(90, 9);
        const e = engagePair(r);
        expect(Math.abs(e.dTheta / DEG - 90)).toBeLessThan(0.5);
        expect(Math.abs(e.k - 1)).toBeLessThan(0.005);
        expect(e.dm).toEqual({ x: 0, y: 0 });
    });

    it("D-30 — parallel fingers read exactly 0 rad (no sentinel)", () => {
        const [a0, b0] = pair(100, 100, 50, 0.2);
        const r = readPair(a0, b0, P(a0.x + 30, a0.y), P(b0.x + 30, b0.y));
        expect(r.dTheta).toBe(0);
    });

    it("a clockwise twist (y down) reads positive", () => {
        const [a0, b0] = pair(0, 0, 50, 0);
        const [a, b] = pair(0, 0, 50, 10 * DEG);
        expect(readPair(a0, b0, a, b).dTheta).toBeGreaterThan(0);
    });
});

describe("G2.3 (c) — a two-finger drag pans 1:1", () => {
    it("a 100 px drag moves the projected centre 100 ± 1 px (the former 142.6)", () => {
        const [a0, b0] = pair(200, 300, 50, 0);
        const r = readPair(a0, b0, P(a0.x, a0.y + 100), P(b0.x, b0.y + 100));
        const e = engagePair(r);
        const t = anchoredTranslate(P(0, 0), e.dm, e.k, P(200, 300), r.m0);
        expect(Math.abs(t.y - 100)).toBeLessThan(1);
        expect(Math.abs(t.x)).toBeLessThan(1e-9);
        expect(e.k).toBe(1);
        expect(e.dTheta).toBe(0);
    });
});

describe("G2.3 (d) — the content under the centroid stays under the fingers", () => {
    it("through a 1× → 2× pinch about an off-centre centroid, within 1 px", () => {
        const c0 = P(195, 410);
        const m0 = P(240, 380);
        for (const k of [1, 1.25, 1.5, 1.75, 2]) {
            const t = anchoredTranslate(P(0, 0), P(0, 0), k, c0, m0);
            // The content point under m0 sits at offset (m0 − c0) from the
            // centre; after scale k about the new centre c0 + t it is at:
            const x = c0.x + t.x + k * (m0.x - c0.x);
            const y = c0.y + t.y + k * (m0.y - c0.y);
            expect(Math.hypot(x - m0.x, y - m0.y)).toBeLessThan(1);
        }
    });
});

describe("G2.3 (e) — a pinch with ±3° wobble does not roll", () => {
    it("every wobble frame gives 0 roll", () => {
        const [a0, b0] = pair(200, 300, 40, 0);
        for (const w of [-3, -1.5, 0, 1.5, 3]) {
            const [a, b] = pair(200, 300, 70, w * DEG);
            expect(engagePair(readPair(a0, b0, a, b)).dTheta).toBe(0);
        }
    });

    it("the dead zone engages from zero (continuous at the threshold)", () => {
        expect(softDeadzone(TWIST_DEADZONE_RAD, TWIST_DEADZONE_RAD)).toBe(0);
        expect(softDeadzone(TWIST_DEADZONE_RAD * 1.001, TWIST_DEADZONE_RAD)).toBeLessThan(1e-3 * TWIST_DEADZONE_RAD * 3);
    });
});

describe("G2.3 (f) — the clamp holds the centre inside V", () => {
    it("a point outside the box lands on its edge", () => {
        const box = { left: 16, top: 107, right: 374, bottom: 545 };
        expect(clampToBox(P(500, 900), box)).toEqual(P(374, 545));
        expect(clampToBox(P(-10, 50), box)).toEqual(P(16, 107));
        expect(clampToBox(P(200, 300), box)).toEqual(P(200, 300));
        expect(clampToBox(P(500, 900), null)).toEqual(P(500, 900));
    });
});
