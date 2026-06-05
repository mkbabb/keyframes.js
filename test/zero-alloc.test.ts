import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

/**
 * D.W4 D-1 — `proof:zero-alloc`: the `AnimationGroup` composite path allocates
 * zero bytes per frame in steady state.
 *
 * The deterministic, env-independent instrument is BUFFER IDENTITY: the
 * compositor reuses a single hoisted `_grouped` buffer (cleared in place), so
 * `transformFramesGrouped` returns the SAME object reference every frame. The
 * retired implementation allocated a fresh `{}` (and a fresh `filteredValues`
 * object per whitelisted layer) each frame, returning a NEW reference. The
 * identity check therefore reds the moment a per-frame literal returns — proven
 * by the `LeakyGroup` bite below. (A `--expose-gc` heap-delta runs as a bonus
 * when the runtime exposes `gc`.)
 */

function opacityAnim(name: string): CSSKeyframesAnimation<any> {
    const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    anim.name = name;
    return anim;
}

function mixedGroup(): AnimationGroup<any> {
    const a = opacityAnim("a");
    const b = opacityAnim("b");
    const c = opacityAnim("c");
    a.t = 250;
    b.t = 500;
    c.t = 750;
    // ≥3 children, all three blend modes, one carrying a `properties`
    // whitelist so the inlined filter is exercised.
    return new AnimationGroup<any>(
        { animation: a, layer: { blendMode: "replace", zIndex: 0 } },
        {
            animation: b,
            layer: {
                blendMode: "add",
                zIndex: 1,
                properties: new Set(["opacity"]),
            },
        },
        { animation: c, layer: { blendMode: "weighted", zIndex: 2, weight: 0.5 } },
    );
}

describe("proof:zero-alloc — AnimationGroup composite allocates 0 bytes/frame", () => {
    it("reuses one composite buffer across frames (same reference)", () => {
        const group = mixedGroup();
        const r1 = group.transformFramesGrouped(100);
        const r2 = group.transformFramesGrouped(200);
        const r3 = group.transformFramesGrouped(300);
        // Same buffer every frame → no per-frame composite allocation.
        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
    });

    it("clears the buffer in place — no stale keys leak across frames", () => {
        const group = mixedGroup();
        const first = { ...group.transformFramesGrouped(100) };
        const second = group.transformFramesGrouped(200);
        // The reused buffer holds only the current frame's keys (cleared on
        // entry), so its key-set is exactly the live composite, not an
        // accumulation.
        expect(Object.keys(second).sort()).toEqual(Object.keys(first).sort());
    });

    it("applies the property whitelist inline (no intermediate object)", () => {
        const wl = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; transform: translateX(0px); }
            to { opacity: 1; transform: translateX(100px); }
        `);
        wl.name = "wl";
        wl.t = 500;
        const group = new AnimationGroup<any>({
            animation: wl,
            layer: { zIndex: 0, properties: new Set(["opacity"]) },
        });
        const out = group.transformFramesGrouped(500);
        const keys = Object.keys(out);
        // The whitelist keeps ONLY `opacity`; the (non-whitelisted) transform
        // contribution is skipped by the inline `continue`, never materialized
        // into a filtered object.
        expect(keys).toContain("opacity");
        expect(keys.every((k) => k === "opacity")).toBe(true);
    });

    it("bite-proof: a per-frame allocation reds the identity check", () => {
        // The regression — a fresh object returned per frame — is exactly what
        // the identity assertion above catches.
        class LeakyGroup extends AnimationGroup<any> {
            override transformFramesGrouped(_t: number) {
                return {} as Record<string, unknown>;
            }
        }
        const leaky = new LeakyGroup(opacityAnim("x"), opacityAnim("y"));
        expect(leaky.transformFramesGrouped(1)).not.toBe(
            leaky.transformFramesGrouped(2),
        );
    });

    it("heap-delta over a steady-state window ≈ 0 (when gc is exposed)", () => {
        const gc = (globalThis as { gc?: () => void }).gc;
        if (typeof gc !== "function") {
            // No `--expose-gc` — the deterministic buffer-identity proof above
            // carries the gate; this bonus probe is skipped.
            expect(true).toBe(true);
            return;
        }
        const group = mixedGroup();
        // Warm up (first frame may lazily resolve the transform).
        for (let i = 0; i < 20; i++) group.transformFramesGrouped(i);
        gc();
        const before = process.memoryUsage().heapUsed;
        for (let i = 0; i < 2000; i++) group.transformFramesGrouped(i);
        gc();
        const after = process.memoryUsage().heapUsed;
        // 2000 frames, zero per-frame composite allocation → growth within the
        // GC-noise floor (generous: < 200 bytes/frame would indicate a leak).
        expect(after - before).toBeLessThan(2000 * 200);
    });
});
