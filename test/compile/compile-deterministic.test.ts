/**
 * E.W8 `proof:compile-deterministic` (FC-2) — `parse()` is idempotent: two
 * compiles of identical template input produce byte-identical `frames[]`, ids
 * included.
 *
 * BITE: revert `createFrame`'s id to the monotonic `this.frameId++` and the
 * second compile's frame ids shift (the counter accumulated across the first
 * compile) — the id-equality assertion reds.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

const snapshot = (a: CSSKeyframesAnimation<any>) =>
    a.frames.map((f) => ({
        id: f.id,
        ixs: { ...f.ixs },
        time: { start: f.time.start, stop: f.time.stop },
        keys: Object.keys(f.interpVars).sort(),
    }));

describe("E.W8 proof:compile-deterministic — FC-2", () => {
    it("two parse()s on identical input produce byte-identical frames[] (ids included)", () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            `@keyframes p {
                0%   { left: 0px;   top: 0px }
                40%  { left: 40px }
                100% { left: 100px; top: 50px }
            }`,
        );
        const first = snapshot(a);
        // Re-compile the SAME templateFrames.
        a.parse();
        const second = snapshot(a);
        expect(second).toEqual(first);
        // Ids are content-derived (startIx*SCALE + stopIx), so they are stable
        // and unique — never a monotonic counter that drifts on re-parse.
        const ids = first.map((f) => f.id);
        expect(new Set(ids).size).toBe(ids.length);
        // A third compile is identical too (true idempotence, not first-pair luck).
        a.parse();
        expect(snapshot(a)).toEqual(first);
    });
});
