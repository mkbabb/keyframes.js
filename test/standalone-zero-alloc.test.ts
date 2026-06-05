/**
 * E.W7 `proof:standalone-zero-alloc` (inv ν) — the standalone play loop reuses
 * ONE interp output buffer across frames, the primitive-level analogue of the
 * group composite's hoisted `_grouped` (gated by `test/zero-alloc.test.ts`).
 *
 * BITE: revert `_frame` to `interpFrames(t, true)` (the `out = {}` default) and
 * the per-frame-buffer assertion reds (no buffered call is made); un-hoist
 * `_interpOut` to a fresh `{}` per frame and the single-reference assertion reds.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import type { ValueUnit } from "@mkbabb/value.js";

describe("E.W7 proof:standalone-zero-alloc — inv ν", () => {
    it("interpFrames returns the SAME buffer it is handed (zero-alloc contract)", () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({ duration: 100 }, el);
        a.fromString(`@keyframes p { from { left: 0px } to { left: 100px } }`);
        const buf: Record<string, ValueUnit[]> = {};
        const r1 = a.interpFrames(10, false, buf);
        const r2 = a.interpFrames(80, false, buf);
        expect(r1).toBe(buf);
        expect(r2).toBe(buf);
        expect(r1).toBe(r2);
    });

    it("the standalone rAF play loop passes ONE hoisted buffer every frame", async () => {
        const el = document.createElement("div");
        // useWAAPI:false forces the rAF standalone path (WAAPI takes no buffer).
        const a = new CSSKeyframesAnimation(
            { duration: 30, useWAAPI: false },
            el,
        );
        a.fromString(`@keyframes p { from { left: 0px } to { left: 100px } }`);

        const seen = new Set<object>();
        let buffered = 0;
        const orig = a.interpFrames.bind(a);
        (a as any).interpFrames = (t: number, tf?: boolean, out?: any) => {
            if (out) {
                seen.add(out);
                buffered++;
            }
            return orig(t, tf, out);
        };

        await a.play();

        // The play loop ran at least one non-terminal frame through a buffer,
        // and every buffered frame used the SAME object — no per-frame alloc.
        expect(buffered).toBeGreaterThan(0);
        expect(seen.size).toBe(1);
    });
});
