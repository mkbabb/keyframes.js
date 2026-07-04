/**
 * interp-fastprops.test.ts — F.W4 (the dict-mode buffer fold + the single-frame
 * alias), the vitest half of the gate. The `%HasFastProperties` mechanism probe
 * + the wall-time fallback live in `scripts/proof-interp-fastprops.mjs` (a V8
 * intrinsic the esbuild/tsc transform rejects). This file carries the clauses
 * that need no intrinsic:
 *
 *  3. round-trip / pixel-identical — the single-frame alias and the buffer-merge
 *     paths produce the SAME values; a reused buffer never leaks a stale key.
 *  4. alias-correctness — the alias fires ONLY for the no-buffer standalone
 *     return; a caller that passes its own buffer (the group's `entry.values`)
 *     always takes the buffer path, so no consumer mutates a shared frame object.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { compositeFramesAt } from "./support/group-probe";

const v = (arr: unknown): number => (arr as { value: number }[])[0]!.value;

describe("F.W4 — single-frame alias (S3)", () => {
    it("aliases the frame's own flatVars for the no-buffer single-frame path", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        const r = a.interpFrames(500, false);
        // The 2-stop shape has exactly one active frame; the no-buffer path
        // returns that frame's own flatVars by reference (no clear, no copy).
        expect(r).toBe(a.frames[0]!.flatVars);
    });

    it("returns the passed buffer (NOT the alias) when a buffer is provided", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        const out: Record<string, unknown> = {};
        const r = a.interpFrames(500, false, out as never);
        expect(r).toBe(out);
        expect(r).not.toBe(a.frames[0]!.flatVars);
    });

    it("the alias path and the buffer path produce identical values", () => {
        const css = "from { opacity: 0; } to { opacity: 1; }";
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        for (const t of [0, 250, 500, 750, 1000]) {
            const alias = a.interpFrames(t, false); // no buffer → alias
            const buffered = b.interpFrames(t, false, {} as never); // buffer path
            expect(v(buffered.opacity)).toBeCloseTo(v(alias.opacity), 10);
        }
    });

    it("endpoints are exact (t=0 → start, t=duration → end)", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        expect(v(a.interpFrames(0, false).opacity)).toBeCloseTo(0, 10);
        expect(v(a.interpFrames(1000, false).opacity)).toBeCloseTo(1, 10);
    });
});

describe("F.W4 — stable-key merge + no stale leak (S1)", () => {
    // opacity spans [0,100]; color spans [50,100]. At t<50 only opacity is
    // active (1 frame); at t≥50 both are (2 frames → merge).
    const css = `
        0% { opacity: 0; }
        50% { opacity: 0.5; color: rgb(0,0,0); }
        100% { opacity: 1; color: rgb(255,255,255); }
    `;

    it("merges ≥2 active frames with every key present and none undefined", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        const out: Record<string, unknown> = {};
        a.interpFrames(750, false, out as never); // both opacity + color active
        expect(out.opacity).toBeDefined();
        expect(out.color).toBeDefined();
        // no stale/undefined leaked into the merged buffer's live keys
        for (const k of Object.keys(out)) expect(out[k]).not.toBeUndefined();
    });

    it("a reused buffer never leaks a stale key when the active set shrinks", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        const out: Record<string, unknown> = {};
        a.interpFrames(750, false, out as never); // color is active here
        expect(out.color).toBeDefined();
        a.interpFrames(250, false, out as never); // color NOT active here
        // The stable-key null-fill leaves the inactive key `undefined` (the
        // delete-loop's only job: no stale value leaks); consumers skip it.
        expect(out.color).toBeUndefined();
        expect(out.opacity).toBeDefined();
    });
});

describe("F.W4 — the alias never fires for the group (S3 aliasing-correctness)", () => {
    it("composites two children correctly without aliasing a frame's flatVars", () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        a.name = "a";
        a.targets = [el];
        a.started = true;
        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { transform: translateX(0px); } to { transform: translateX(100px); }",
        );
        b.name = "b";
        b.targets = [el];
        b.started = true;

        const group = new AnimationGroup(a as never, b as never);
        for (const obj of Object.values(group.animations)) {
            obj.animation.t = 500;
        }
        const composed = compositeFramesAt(group, 500) as Record<
            string,
            unknown
        >;

        // Both layers contributed; the composite is its OWN buffer, never a child
        // frame's flatVars (the group passes `entry.values`, so the alias path is
        // structurally unreachable for it). `transform: translateX()` flattens to
        // the dotted key `transform.translateX`.
        expect(composed.opacity).toBeDefined();
        expect(composed["transform.translateX"]).toBeDefined();
        expect(composed).not.toBe(a.frames[0]!.flatVars);
        expect(composed).not.toBe(b.frames[0]!.flatVars);
    });
});
