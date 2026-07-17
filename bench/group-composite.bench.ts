/**
 * group-composite.bench.ts — the AnimationGroup compositor-BLEND bench (Tranche
 * P / P.W2 S1, the MEASURE-FIRST step P.W1 S2 flagged absent).
 *
 * The SoA compositor win (the validated ADOPT: >=1.2× at K=8, bit-identical)
 * was benched in the isolated spike (`bench/group-soa-validate.mjs`); this is the
 * FORMAL vitest bench on `AnimationGroup.transformFramesGrouped`'s OWN blend path
 * — the three blend arms (`replace` / `add` / `weight`) benched SEPARATELY in
 * the SAME report, at a K-ladder (K∈{3,8,12} children).
 *
 * The bench ISOLATES the BLEND substrate (the cost the SoA fold attacks), NOT the
 * whole frame: the children are sampled ONCE up front, then the timed loop runs
 * ONLY the blend over the stable (frame-stable, in-place-mutated) leaves —
 * exactly the `group-soa-validate.mjs` methodology, but driving the REAL
 * `group.ts` blend (`soaBlendLayer` over the precomputed plan vs the residual
 * `residualBlendArm` per-element AoS loop). interpFrames, the null-fill, the
 * compaction, and the transform call are EXCLUDED — they are the same fixed cost
 * for both substrates (the Amdahl share the integration spike measures), so
 * isolating the blend is what makes the per-arm ratio meaningful.
 *
 * The three arms are NOT uniform (P.W2.md §Context):
 *   - `replace` (the DEFAULT) — a bare reference-assign, ALREADY dispatch-free.
 *     Benched to CONFIRM there is nothing for the SoA fold to win here.
 *   - `add` / `weight` (NON-default) — the residual-AoS arms the SoA fold targets.
 *     Each arm benches the SoA fold AGAINST the residual AoS loop, SAME-REPORT, so
 *     the per-arm ratio is device-independent BY CONSTRUCTION (numerator and
 *     denominator in the same pass — the inv-L-device-honesty discipline).
 *
 * Each non-default arm reads its `SoA · K=8` pass as the numerator and its
 * `residual · K=8` twin as the same-report denominator; the per-arm
 * `soaOverResidual` ratio must clear the 1.2× ADOPT expectation — a same-report,
 * device-independent ratio computed in THIS bench (the surviving artifact),
 * scoped to `transformFramesGrouped`, never a transplanted
 * `SpringProgress.setTargets` number from a different codepath. (U.N2: the former
 * SoA composite decision-JSON gate dissolved into this same-report ratio + the
 * identity test.)
 *
 * Imports the VALUE modules `engine` + `group` directly, never the type-only
 * barrel `../src/animation`.
 */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import type { FlatAuthoredValues } from "../src/animation/compile/value-ast";
// R.W2 — the SoA fold + the residual blend arm are colocated INTERNAL functions
// (`./group/soa` + `./group/compositor`); the bench calls them DIRECTLY with
// explicit args (no `group.soaBlendLayer`/`group.residualBlendArm` private monkey-
// patch — the `soaBlendLayer` wrapper was excised, `residualBlendArm` carved out).
import {
    buildSoAPlans,
    groupSoABlendLayer,
} from "../src/animation/group/soa";
import { residualBlendArm } from "../src/animation/group/compositor";

// A realistic multi-property transform keyframe — several numeric leaves
// (translateX/Y, scaleX/Y/Z, rotateZ, opacity) + a multi-component `margin`
// leaf, the shape `transformFramesGrouped` blends every frame.
const CSS = `0% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 1; margin: 0px 0px }
             100% { transform: translate(120px, 60px) scale(1.4) rotate(45deg); opacity: 0.4; margin: 10px 20px }`;

const makeAnim = () =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromString(CSS);

type LayerCase = "replace" | "add" | "weight";

/** A group of `k` children: a base `replace` layer + (k-1) `mode` layers. */
const makeGroup = (k: number, mode: LayerCase): AnimationGroup<any> => {
    const entries: any[] = [
        { animation: makeAnim(), layer: { op: "replace", zIndex: 0 } },
    ];
    for (let i = 1; i < k; i++) {
        entries.push({
            animation: makeAnim(),
            layer: {
                op: mode === "weight" ? "replace" : mode,
                zIndex: i,
                weight: mode === "weight" ? 0.5 : 1,
            },
        });
    }
    return new AnimationGroup<any>(...entries);
};

/**
 * A group primed for the ISOLATED-blend bench: every child sampled at the
 * mid-frame, the SoA plan built (one warm composite), and the per-frame helpers
 * + buffers reached off the instance (TS-private, reachable at runtime in the
 * bench). Returns closures that run ONLY the blend substrate.
 */
const primeGroup = (k: number, mode: LayerCase) => {
    const group = makeGroup(k, mode) as any;
    // Sample every child once at the mid-frame so the leaves carry real values.
    for (const e of group.getEntries()) e.animation.t = 500;
    // Two warm composites: the first builds the SoA plan; the second confirms the
    // SoA path is live. The leaves are frame-stable (mutated in place), so the
    // captured plan + carrier refs are valid for the timed loop.
    const grouped = group.transformFramesGrouped(0) as FlatAuthoredValues;
    group.transformFramesGrouped(0);

    const entries = group.getEntries();
    const { plans, compositeBuf } = buildSoAPlans(entries, null, grouped);

    // Re-seat the `_grouped` carriers by running the replace base layer once (the
    // blend bodies below assume the base layer has parked its leaves), then sample
    // the non-replace layers into the carrier so each blend op starts from a known
    // state. Both bodies operate on the SAME primed state per call.
    const reseat = () => {
        for (const entry of entries) {
            const v = entry.values;
            if (entry.layer.op === "replace" && entry.layer.weight === 1) {
                for (const key in v) grouped[key] = v[key];
            }
        }
    };
    reseat();

    // SoA body — run the real `groupSoABlendLayer` fold over each non-replace
    // layer's plan, with the group's `_compositeBuf` scratch (the args the excised
    // `soaBlendLayer` wrapper forwarded).
    const soaBody = () => {
        for (let i = 0; i < plans.length; i++)
            groupSoABlendLayer(compositeBuf!, plans[i]!);
    };
    // Residual body — run the real `residualBlendArm` (the per-element AoS loop) over
    // each non-replace layer.
    const residualBody = () => {
        for (const entry of entries) {
            if (entry.layer.op === "replace" && entry.layer.weight === 1) continue;
            residualBlendArm(
                entry.layer,
                entry.values,
                grouped,
                entry.layer.properties,
            );
        }
    };
    return { soaBody, residualBody };
};

const KS = [3, 8, 12] as const;

describe("transformFramesGrouped — replace arm (DEFAULT, dispatch-free)", () => {
    for (const k of KS) {
        const group = makeGroup(k, "replace") as any;
        for (const e of group.getEntries()) e.animation.t = 500;
        const grouped = group.transformFramesGrouped(0) as Record<string, unknown>;
        const entries = group.getEntries();
        bench(`replace · K=${k}`, () => {
            // The bare reference-assign — already dispatch-free, nothing to fold.
            for (const entry of entries) {
                const v = entry.values;
                for (const key in v) grouped[key] = v[key];
            }
        });
    }
});

describe("transformFramesGrouped — add arm", () => {
    for (const k of KS) {
        const { soaBody, residualBody } = primeGroup(k, "add");
        bench(`add residual · K=${k}`, residualBody);
        bench(`add SoA · K=${k}`, soaBody);
    }
});

describe("transformFramesGrouped — weight arm", () => {
    for (const k of KS) {
        const { soaBody, residualBody } = primeGroup(k, "weight");
        bench(`weight residual · K=${k}`, residualBody);
        bench(`weight SoA · K=${k}`, soaBody);
    }
});
