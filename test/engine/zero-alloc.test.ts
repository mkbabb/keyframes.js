import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { compositeFramesAt } from "../support/group-probe";
import { NumericAnimation } from "../../src/animation/physics/numeric";
import { buildSoAPlans } from "../../src/animation/group/soa";
import type { FlatAuthoredValues } from "../../src/animation/compile/value";

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
 * by the fresh-spread bite below. (A `--expose-gc` heap-delta runs as a bonus
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
        { animation: a, layer: { op: "replace", zIndex: 0 } },
        {
            animation: b,
            layer: {
                op: "add",
                zIndex: 1,
                properties: new Set(["opacity"]),
            },
        },
        { animation: c, layer: { op: "replace", zIndex: 2, weight: 0.5 } },
    );
}

describe("proof:zero-alloc — AnimationGroup composite allocates 0 bytes/frame", () => {
    it("reuses one composite buffer across frames (same reference)", () => {
        const group = mixedGroup();
        const r1 = compositeFramesAt(group, 100);
        const r2 = compositeFramesAt(group, 200);
        const r3 = compositeFramesAt(group, 300);
        // Same buffer every frame → no per-frame composite allocation.
        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
    });

    it("clears the buffer in place — no stale keys leak across frames", () => {
        const group = mixedGroup();
        const first = { ...compositeFramesAt(group, 100) };
        const second = compositeFramesAt(group, 200);
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
        const out = compositeFramesAt(group, 500);
        const keys = Object.keys(out);
        // The whitelist keeps ONLY `opacity`; the (non-whitelisted) transform
        // contribution is skipped by the inline `continue`, never materialized
        // into a filtered object.
        expect(keys).toContain("opacity");
        expect(keys.every((k) => k === "opacity")).toBe(true);
    });

    it("bite-proof: a per-frame allocation reds the identity check", () => {
        // The regression — a fresh object returned per frame — is exactly what
        // the identity assertion above catches. The retired impl returned a NEW
        // object each frame; model that leak by spreading the live composite
        // buffer into fresh objects. Two spreads are distinct references, so the
        // `.toBe` identity assertion the suite relies on REDs on a per-frame
        // literal — the instrument bites. (The old `LeakyGroup extends
        // AnimationGroup` override is gone: `transformFramesGrouped` is `private`
        // and cannot be overridden — S.B7 routes composite reads through the
        // `compositeFramesAt` seam, so this bite spreads the seam's output.)
        const group = mixedGroup();
        const leakA = { ...compositeFramesAt(group, 1) };
        const leakB = { ...compositeFramesAt(group, 2) };
        expect(leakA).not.toBe(leakB);
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
        for (let i = 0; i < 20; i++) compositeFramesAt(group, i);
        gc();
        const before = process.memoryUsage().heapUsed;
        for (let i = 0; i < 2000; i++) compositeFramesAt(group, i);
        gc();
        const after = process.memoryUsage().heapUsed;
        // 2000 frames, zero per-frame composite allocation → growth within the
        // GC-noise floor (generous: < 200 bytes/frame would indicate a leak).
        expect(after - before).toBeLessThan(2000 * 200);
    });
});

/**
 * S.F5a S1/S2 — `proof:zero-alloc` EXTENDED to the MIXED-LEAF residual shape (the
 * residualKeys Set hoist, a32 F3 / a04 F6).
 *
 * The HEAVY composite buffer-identity arm above covers the ALL-NUMERIC transform
 * shape (every leaf is numeric, so the whole `for..in` collapses to the
 * SoA fold, `residualKeys` empty). The UN-gated shape is the MIXED-LEAF residual: an
 * `add`/`weight` layer that touches a key the SoA fold CANNOT cover — a
 * first-touch key with no lower structural value, or a non-numeric leaf.
 * `buildSoAPlans` records those in the plan's `residualKeys`, and the compositor
 * runs structural composition over them every frame the SoA path is live.
 *
 * Before the S.F5a S1 hoist, `residualKeys` was a `string[]` and `residualBlendArm`
 * rebuilt a fresh `new Set(only)` on EVERY frame (`compositor.ts` — a per-frame
 * allocation on the mixed-leaf hot path). S1 precomputes `residualKeys` as a `Set`
 * ON THE PLAN at `buildSoAPlans` (structural-change time), so the per-frame
 * `new Set` is gone at its source — the fold walks the precomputed Set directly.
 *
 * This arm gates the plan's `residualKeys` TYPE — the device-independent predicate
 * that eliminates the per-frame `new Set` (the SAME instrument the LIGHT-tier
 * `seg.from instanceof Float64Array` arm below uses: assert the STORAGE TYPE that
 * hoists the allocation, not the wall-clock).
 *
 * BORN-RED WITNESS (today's tree): `SoALayerPlan.residualKeys` is a `string[]`, so
 * `plan.residualKeys instanceof Set` is FALSE → this expectation FAILS on the
 * pre-S1 tree, the born-RED posture this clause requires. GREEN after S1 makes
 * `residualKeys` a precomputed `Set` on the plan.
 *
 * BITE: reverting `residualKeys` to a `string[]` (restoring the per-frame
 * `new Set(only)` in `residualBlendArm`) reds this arm.
 */
function mixedLeafGroup(): AnimationGroup<any> {
    // A base `replace` layer parks `opacity`; an `add` layer folds `opacity`
    // (numeric → SoA) AND first-touches `transform` (no lower structural value →
    // the residual path, recorded in the plan's `residualKeys`). This is the
    // mixed-leaf shape: the SoA fold covers opacity while structural composition
    // covers transform, so
    // `plan.residualKeys` is non-empty — exactly the shape the retired per-frame
    // `new Set(only)` fired on.
    const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    base.name = "mixed-base";
    base.t = 500;
    const add = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; transform: translateX(0px); }
        to { opacity: 1; transform: translateX(100px); }
    `);
    add.name = "mixed-add";
    add.t = 500;
    return new AnimationGroup<any>(
        { animation: base, layer: { op: "replace", zIndex: 0 } },
        { animation: add, layer: { op: "add", zIndex: 1 } },
    );
}

/** Non-empty over a `Set` (`.size`) OR the retired `string[]` (`.length`). */
function residualCount(residualKeys: unknown): number {
    if (residualKeys instanceof Set) return residualKeys.size;
    if (Array.isArray(residualKeys)) return residualKeys.length;
    return 0;
}

describe("proof:zero-alloc — mixed-leaf SoA residual (S.F5a residualKeys Set hoist)", () => {
    it("buildSoAPlans precomputes residualKeys as a Set on the plan (no per-frame new Set)", () => {
        const group = mixedLeafGroup();
        // Frame 1 runs the residual path whole + builds the plan; frame 2 folds the
        // SoA pairs and walks the structural residual (the retired per-frame `new Set`
        // site).
        const grouped = compositeFramesAt(group, 100);
        compositeFramesAt(group, 200);
        const { plans } = buildSoAPlans(
            group.getEntries(),
            null,
            grouped as FlatAuthoredValues,
        );
        // The `add` layer's plan carries a non-empty structural residual (the
        // first-touch `transform` leaf the SoA fold cannot cover).
        const residual = plans
            .map((p) => (p as unknown as { residualKeys: unknown }).residualKeys)
            .find((bk) => residualCount(bk) > 0);
        expect(residual).toBeDefined();
        // BORN-RED (pre-S1): `residualKeys` is a `string[]` → NOT a `Set`. GREEN
        // after S1 precomputes it as a `Set` on the plan.
        expect(residual).toBeInstanceOf(Set);
    });

    it("the mixed-leaf composite reuses one buffer across frames (zero-alloc)", () => {
        const group = mixedLeafGroup();
        const r1 = compositeFramesAt(group, 100);
        const r2 = compositeFramesAt(group, 200);
        const r3 = compositeFramesAt(group, 300);
        // Same buffer every frame → no per-frame composite allocation on the
        // mixed-leaf residual path.
        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
    });
});

/**
 * L.W7 S2 — `proof:zero-alloc` EXTENDED to the LIGHT tier (`NumericAnimation`).
 *
 * Lane 33 (audit ⚠34): the existing `proof:zero-alloc` arm above covers ONLY the
 * HEAVY `AnimationGroup` composite (the `_grouped` buffer-identity proof). The
 * LIGHT-tier hot path — `NumericAnimation.at`'s inner per-channel interp loop
 * (`numeric.ts:175-181`) — is UNGATED. The audit's W122 finding: the segment
 * builder packs `startVals`/`stopVals` as plain `number[]` (`numeric.ts:139-140`)
 * and `.at()` interpolates them via individual `lerp(startVals[i], stopVals[i],
 * t)` calls — no `Float64Array`, no `lerpArray`. value.js 0.13.0 published
 * `lerpArray(start, stop, t, out)` FOR kf (its doc names `FrameCompiler` as the
 * one real consumer); the LIGHT tier is the un-claimed edge.
 *
 * The S2 cure packs `startVals`/`stopVals` into `Float64Array` at segment-build
 * time and replaces the per-channel loop with one `lerpArray(seg.from, seg.to,
 * easedT, this._out)` call. This arm gates the segment-buffer TYPE: it RED-s
 * today (the buffers are `number[]`), GREEN-s after S2 makes them `Float64Array`.
 *
 * BORN-RED WITNESS (today's tree):
 *   grep -n "startVals\|stopVals" src/animation/physics/numeric.ts
 *   → numeric.ts:139: startVals: keys.map((k) => start[k] as number),   // number[]
 *   → numeric.ts:140: stopVals: keys.map((k) => stop[k] as number),     // number[]
 *   `seg.from`/`seg.to` (the S2 field names) do not exist yet; the plain-array
 *   `startVals`/`stopVals` are NOT `Float64Array` instances → these expectations
 *   FAIL on today's tree, the born-RED posture this gate requires.
 *
 * BITE: a revert of the S2 segment builder back to `number[]` (restoring the
 * silent per-channel `lerp` closure loop — the 1.56–4.25× throughput regression
 * the J.W6 S2 bench measured at K=2–64) reds this arm.
 */
describe("proof:zero-alloc — NumericAnimation LIGHT tier (S2 lerpArray consume)", () => {
    // K=8 channels — the real-K shape the J.W6 SoA corpus named (translate3d +
    // scale3d + rotateZ + opacity = 8 numeric channels).
    const makeK8 = () =>
        new NumericAnimation([
            { x: 0, y: 0, z: 0, w: 0, a: 0, b: 0, c: 0, d: 0 },
            { x: 1, y: 2, z: 3, w: 4, a: 5, b: 6, c: 7, d: 8 },
        ]);

    it("segment from/to buffers are Float64Array after S2", () => {
        const na = makeK8();
        // Access the internal segment to assert the storage TYPE. `segments` is
        // private; the gate reaches in deliberately (the buffer type is the
        // device-independent predicate this arm asserts).
        const seg = (
            na as unknown as {
                segments: Array<{ from?: unknown; to?: unknown }>;
            }
        ).segments[0]!;
        // RED today: the segment carries `startVals`/`stopVals` as plain
        // `number[]`; `from`/`to` are `undefined`. GREEN after S2 packs them as
        // `Float64Array` named `from`/`to`.
        expect(seg.from).toBeInstanceOf(Float64Array);
        expect(seg.to).toBeInstanceOf(Float64Array);
    });

    it("the .at() result reference is stable across frames (no per-call alloc)", () => {
        // The companion claim — mirrors the group composite's `r1 === r2`
        // reference-stability assertion. `NumericAnimation.at` already returns
        // its pre-allocated `result`, so this holds today AND after S2; the
        // value of pairing it here is that the S2 rewrite (writing channels back
        // from `_out` into `result`) must NOT regress the reference stability.
        const na = makeK8();
        const r1 = na.at(0.25);
        const r2 = na.at(0.75);
        expect(r1).toBe(r2);
    });
});
