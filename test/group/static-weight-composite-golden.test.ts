// proof:static-weight-composite — BV-2 (V.W9 · from R2-02 DISPOSITIONS probe7).
//
// R2-02 (BV-2) flagged the static-`weight` composite as "monotonically growing
// past the peak" and asked V formation to "confirm the op+weight fold's
// steady-state math (static weight → symmetric composite) with a born-checked
// golden." This IS that golden, and it CLOSES BV-2 as documentation.
//
// THE FINDING (run live on this tree, V.W9):
//   • Read PER FRAME (a fresh group seeked to each t), the static-weight
//     composite of two SYMMETRIC triangle layers IS SYMMETRIC — peak at the
//     triangle apex (t=2000 of a 4000 ms span), equal values equidistant from
//     the apex, 0 at both endpoints. BV-2's premise HOLDS.
//   • The "monotonic growth" R2-02 observed was NOT the K.W11 weight-spring
//     ramp (a STATIC `weight` creates no `weightSpring`, so `_hasLayerSprings`
//     is false and no `advanceLayerSprings` ramp runs — see group/weight.ts
//     `isWeightBlend` + group/springs.ts). It is a REPEATED-READ ACCUMULATION
//     artifact of the private composite seam: `transformFramesGrouped` folds the
//     current frame into a persisted composite buffer, so compositing the SAME
//     clock twice INTEGRATES (150 → 300 → 450). Driving `advanceTo`/`render`
//     over ascending clocks (R2-02's method) therefore reads the running SUM of
//     the symmetric triangle — a monotone climb — not a per-frame semantic. The
//     per-frame contract, which is what a painted frame reflects, is symmetric.
//     (R2-02 BV-N2 independently confirmed the LIVE `add` blend is correct —
//     22/33/27.5/22 across the boundary — so this artifact does not paint.)
//   • `weight` is INERT on the `op:'add'` arm: `isWeightBlend` engages ONLY for
//     `op:'replace'` with a non-unit weight (group/weight.ts:4-6), so
//     `op:'add' + weight:0.5` is byte-identical to plain `op:'add'`. The
//     weighted-blend axis is `op:'replace' + weight`, which is ALSO symmetric.
//
// BORN-CHECKED: the exact per-frame values below were measured on this tree; a
// regression that de-symmetrises the static-weight composite (or that lets
// `weight` leak an asymmetry into the `add` arm) reds this golden.

import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import type { AnimationLayerConfig } from "../../src/animation/constants";
import { compositeFramesAt } from "../support/group-probe";

const DUR = 4000;
const APEX = DUR / 2; // 2000 — the symmetric triangle's peak

/** A symmetric triangle layer: 0 → `peak` (at 50%) → 0. */
function triangle(name: string, peak: number): CSSKeyframesAnimation<any> {
    const a = new CSSKeyframesAnimation({ duration: DUR }).fromString(`
        0% { opacity: 0; }
        50% { opacity: ${peak}; }
        100% { opacity: 0; }
    `);
    a.name = name;
    return a;
}

/**
 * The two-layer symmetric group under test. Both children peak at t=APEX.
 * A FRESH group is built per read (below) so each composite is the honest
 * single-frame value, not the repeated-read integral.
 */
function symmetricGroup(
    layer: (z: number) => AnimationLayerConfig,
): AnimationGroup<any> {
    return new AnimationGroup<any>(
        { animation: triangle("a", 100), layer: layer(0) },
        { animation: triangle("b", 200), layer: layer(1) },
    );
}

/** Composite the symmetric group at child-clock `t`, read from a FRESH group. */
function frameAt(layer: (z: number) => AnimationLayerConfig, t: number): number {
    const g = symmetricGroup(layer);
    for (const k of Object.keys(g.animations)) g.animations[k]!.animation.t = t;
    const c = compositeFramesAt(g, t) as { opacity?: number };
    return c.opacity ?? 0;
}

const addWeight = (z: number): AnimationLayerConfig => ({
    op: "add",
    zIndex: z,
    weight: 0.5,
});
const addPlain = (z: number): AnimationLayerConfig => ({ op: "add", zIndex: z });
const replaceWeight = (z: number): AnimationLayerConfig => ({
    op: "replace",
    zIndex: z,
    weight: 0.5,
});

describe("proof:static-weight-composite — BV-2 symmetric static-weight golden", () => {
    it("op:add + weight:0.5 composite is symmetric per frame (born-checked)", () => {
        // Measured on this tree — the exact per-frame composite of the two
        // symmetric triangles (a peak 100, b peak 200), read fresh per clock.
        const golden: Record<number, number> = {
            0: 0,
            500: 18.75,
            1000: 150,
            1500: 281.25,
            2000: 300,
            2500: 281.25,
            3000: 150,
            3500: 18.75,
            4000: 0,
        };
        for (const [tStr, expected] of Object.entries(golden)) {
            expect(frameAt(addWeight, Number(tStr))).toBeCloseTo(expected, 6);
        }
    });

    it("is symmetric about the apex and peaks there (not a monotone climb)", () => {
        const peak = frameAt(addWeight, APEX);
        // The apex is the strict maximum — the R2-02 "grows past the peak" shape
        // does NOT hold per frame.
        for (const d of [500, 1000, 1500, 2000]) {
            const before = frameAt(addWeight, APEX - d);
            const after = frameAt(addWeight, APEX + d);
            expect(before).toBeCloseTo(after, 6); // symmetric pair
            expect(before).toBeLessThan(peak + 1e-9); // apex is the max
        }
        // Endpoints return to the additive identity.
        expect(frameAt(addWeight, 0)).toBeCloseTo(0, 6);
        expect(frameAt(addWeight, DUR)).toBeCloseTo(0, 6);
    });

    it("weight is inert on the op:add arm (add ≡ add+weight — isWeightBlend needs op:replace)", () => {
        for (const t of [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]) {
            expect(frameAt(addWeight, t)).toBeCloseTo(frameAt(addPlain, t), 9);
        }
    });

    it("the real weighted-blend axis (op:replace + weight) is ALSO symmetric", () => {
        // isWeightBlend(op:'replace', weight≠1) → the weightBlend lerp arm; the
        // static weight yields a symmetric composite too (peak 125 at the apex).
        const peak = frameAt(replaceWeight, APEX);
        expect(peak).toBeCloseTo(125, 6);
        for (const d of [500, 1000, 1500]) {
            expect(frameAt(replaceWeight, APEX - d)).toBeCloseTo(
                frameAt(replaceWeight, APEX + d),
                6,
            );
        }
        expect(frameAt(replaceWeight, 0)).toBeCloseTo(0, 6);
        expect(frameAt(replaceWeight, DUR)).toBeCloseTo(0, 6);
    });
});
