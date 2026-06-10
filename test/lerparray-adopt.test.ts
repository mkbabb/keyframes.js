/**
 * lerparray-adopt.test.ts — the J.W6 S2 ADOPT guard (the consume-edge lock).
 *
 * J.W6 S2 benched the SoA `Float64Array`+`lerpArray` shape against the
 * engine's per-channel `lerpValue → iv._lerp` closure dispatch on the real-K
 * corpus (K=8, the demo's cube transform shape) and the delta cleared the
 * ADOPT threshold (`perf-frontier.md:236` — ≥20% wall-time reduction at K=8)
 * by an order of magnitude (`bench/interp-buffer.bench.ts`, the J.W6 S2 arm;
 * artifact in the wave note). The SoA ADOPT is therefore ELECTED; the
 * FrameCompiler-side transposition is a separate authorized motion
 * (`J.W6.md §S2` — HIGH-risk, routed to engine-totality, NOT this wave).
 *
 * THIS test is the consume-edge guard that makes the ADOPT durable across
 * value.js re-pins, three clauses:
 *
 *  (a) API LOCK — the pinned value.js exports `lerpArray` as a function
 *      (the dependency the elected refactor consumes; reds on a re-pin that
 *      drops or renames it — the same probe class as `proof:repin-witness`).
 *  (b) SEMANTICS LOCK — `lerpArray(from, to, t, out)` writes `out` in place,
 *      returns `out`, and computes `(1-t)*from[k] + t*to[k]` per channel
 *      (endpoint-exact at t=0/1).
 *  (c) EQUIVALENCE WITNESS — on the real-K corpus (the compiled K=8 cube
 *      animation), every interpolating channel is plain-numeric and ONE
 *      `lerpArray` call over the packed `Float64Array` segment buffers
 *      reproduces the engine's `interpFrames` per-channel values at sampled
 *      playhead positions. This is the correctness oracle the elected
 *      refactor lands behind: if the engine's lerp semantics and the SoA
 *      lerp ever diverge, this reds BEFORE any FrameCompiler change ships.
 */
import { lerpArray } from "@mkbabb/value.js";
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

const makeCubeAnim = () => {
    const STOPS = 5;
    const css = Array.from({ length: STOPS }, (_, s) => {
        const pct = Math.round((s / (STOPS - 1)) * 100);
        const k = s / (STOPS - 1);
        return `${pct}% { transform: translate3d(${k * 160}px, ${k * 40}px, ${
            k * 20
        }px) scale3d(${1 + k * 0.8}, ${1 + k * 0.4}, 1) rotateZ(${
            k * 180
        }deg); opacity: ${k}; }`;
    }).join("\n");
    return new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
};

describe("J.W6 S2 — SoA lerpArray ADOPT guard (consume-edge lock)", () => {
    it("(a) the pinned value.js publishes lerpArray", () => {
        expect(typeof lerpArray).toBe("function");
    });

    it("(b) lerpArray writes and returns `out` with (1-t)·from + t·to", () => {
        const from = new Float64Array([0, 10, -5, 1, 100, 0.5, 180, 2]);
        const to = new Float64Array([8, 0, 5, 3, 50, 1.5, 0, 4]);
        const out = new Float64Array(8);

        const r0 = lerpArray(from, to, 0, out);
        expect(r0).toBe(out);
        expect(Array.from(r0)).toEqual(Array.from(from));

        lerpArray(from, to, 1, out);
        expect(Array.from(out)).toEqual(Array.from(to));

        lerpArray(from, to, 0.25, out);
        for (let k = 0; k < 8; k++) {
            expect(out[k]).toBeCloseTo(
                0.75 * from[k]! + 0.25 * to[k]!,
                12,
            );
        }
    });

    it("(c) one lerpArray call reproduces interpFrames on the K=8 cube corpus", () => {
        const anim = makeCubeAnim();

        // The corpus invariant the SoA packing depends on: every channel of
        // every compiled frame is plain-numeric (no color, no computed) —
        // exactly K=8 channels (translate3d×3 + scale3d×3 + rotateZ + opacity).
        for (const frame of anim.frames) {
            expect(frame.allInterpVars.length).toBe(8);
            for (const iv of frame.allInterpVars) {
                expect(typeof iv.start.value).toBe("number");
                expect(typeof iv.stop.value).toBe("number");
                expect(iv.computed ?? false).toBe(false);
            }
        }

        // Compile-time analog of the SoA emission: pack per-segment buffers.
        const segs = anim.frames.map((frame) => ({
            start: frame.time.start,
            stop: frame.time.stop,
            fn: frame.timingFunction.fn,
            ivs: frame.allInterpVars,
            from: new Float64Array(
                frame.allInterpVars.map((iv) => iv.start.value as number),
            ),
            to: new Float64Array(
                frame.allInterpVars.map((iv) => iv.stop.value as number),
            ),
        }));
        const out = new Float64Array(8);

        // Sample the playhead across every segment (interior + boundary).
        for (const t of [0, 62.5, 125, 250, 333, 500, 700, 875, 999]) {
            anim.interpFrames(t, false);

            const seg = segs.find((s) => t >= s.start && t <= s.stop)!;
            const scaled =
                seg.start === seg.stop
                    ? 1
                    : (t - seg.start) / (seg.stop - seg.start);
            lerpArray(seg.from, seg.to, seg.fn(scaled), out);

            for (let k = 0; k < 8; k++) {
                // The engine path mutated iv.value in place; the SoA path
                // wrote out[k]. Equal within float-rounding of the two lerp
                // formulations.
                expect(out[k]).toBeCloseTo(
                    seg.ivs[k]!.value.value as number,
                    9,
                );
            }
        }
    });
});
