/**
 * group-composite.bench.ts — the AnimationGroup compositor-BLEND bench (Tranche
 * P / P.W2 S1, the MEASURE-FIRST step P.W1 S2 flagged absent).
 *
 * The SoA compositor win (the validated 3.7× — `scripts/group-soa-decision.json`)
 * was benched in the isolated spike (`bench/group-soa-validate.mjs`); this is the
 * FORMAL vitest bench on `AnimationGroup.transformFramesGrouped`'s OWN blend path
 * — the three blend arms (`replace` / `add` / `weighted`) benched SEPARATELY in
 * the SAME report, at a K-ladder (K∈{3,8,12} children).
 *
 * The bench ISOLATES the BLEND substrate (the cost the SoA fold attacks), NOT the
 * whole frame: the children are sampled ONCE up front, then the timed loop runs
 * ONLY the blend over the stable (frame-stable, in-place-mutated) leaves —
 * exactly the `group-soa-validate.mjs` methodology, but driving the REAL
 * `group.ts` blend (`soaBlendLayer` over the precomputed plan vs the boxed
 * `boxedBlendArm` per-element AoS loop). interpFrames, the null-fill, the
 * compaction, and the transform call are EXCLUDED — they are the same fixed cost
 * for both substrates (the Amdahl share the integration spike measures), so
 * isolating the blend is what makes the per-arm ratio meaningful.
 *
 * The three arms are NOT uniform (P.W2.md §Context):
 *   - `replace` (the DEFAULT) — a bare reference-assign, ALREADY dispatch-free.
 *     Benched to CONFIRM there is nothing for the SoA fold to win here.
 *   - `add` / `weighted` (NON-default) — the boxed-AoS arms the SoA fold targets.
 *     Each arm benches the SoA fold AGAINST the boxed AoS loop, SAME-REPORT, so
 *     the per-arm ratio is device-independent BY CONSTRUCTION (numerator and
 *     denominator in the same pass — the inv-L-device-honesty discipline).
 *
 * `proof:soa-composite` reads this report, computes the per-arm `soaOverBoxed`
 * ratio at K=8, and records the ADOPT/KILL verdict in
 * `scripts/soa-composite-decision.json` (the P-inv-28 durable terminal), whose
 * `$comment` SCOPES the ratio to `transformFramesGrouped` — never a transplanted
 * `SpringProgress.setTargets` number from a different codepath.
 *
 * Imports the VALUE modules `engine` + `group` directly, never the type-only
 * barrel `../src/animation`.
 */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

// A realistic multi-property transform keyframe — several numeric leaves
// (translateX/Y, scaleX/Y/Z, rotateZ, opacity) + a multi-component `margin`
// leaf, the shape `transformFramesGrouped` blends every frame.
const CSS = `0% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 1; margin: 0px 0px }
             100% { transform: translate(120px, 60px) scale(1.4) rotate(45deg); opacity: 0.4; margin: 10px 20px }`;

const makeAnim = () =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromString(CSS);

type BlendMode = "replace" | "add" | "weighted";

/** A group of `k` children: a base `replace` layer + (k-1) `mode` layers. */
const makeGroup = (k: number, mode: BlendMode): AnimationGroup<any> => {
    const entries: any[] = [
        { animation: makeAnim(), layer: { blendMode: "replace", zIndex: 0 } },
    ];
    for (let i = 1; i < k; i++) {
        entries.push({
            animation: makeAnim(),
            layer: { blendMode: mode, zIndex: i, weight: 0.5 },
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
const primeGroup = (k: number, mode: BlendMode) => {
    const group = makeGroup(k, mode) as any;
    // Sample every child once at the mid-frame so the leaves carry real values.
    for (const e of group.getEntries()) e.animation.t = 500;
    // Two warm composites: the first builds the SoA plan; the second confirms the
    // SoA path is live. The leaves are frame-stable (mutated in place), so the
    // captured plan + carrier refs are valid for the timed loop.
    group.transformFramesGrouped(0);
    group.transformFramesGrouped(0);

    const entries = group.getEntries();
    const grouped: Record<string, unknown> = group._grouped;
    const plans = group._soaPlans as any[];

    // Re-seat the `_grouped` carriers by running the replace base layer once (the
    // blend bodies below assume the base layer has parked its leaves), then sample
    // the non-replace layers into the carrier so each blend op starts from a known
    // state. Both bodies operate on the SAME primed state per call.
    const reseat = () => {
        for (const entry of entries) {
            const v = entry.values;
            if (entry.layer.blendMode === "replace") {
                for (const key in v) grouped[key] = v[key];
            }
        }
    };
    reseat();

    // SoA body — run the real `soaBlendLayer` over each non-replace layer's plan.
    const soaBody = () => {
        for (let i = 0; i < plans.length; i++) group.soaBlendLayer(plans[i]);
    };
    // Boxed body — run the real `boxedBlendArm` (the per-element AoS loop) over
    // each non-replace layer.
    const boxedBody = () => {
        for (const entry of entries) {
            if (entry.layer.blendMode === "replace") continue;
            group.boxedBlendArm(
                entry.layer,
                entry.values,
                grouped,
                entry.layer.properties,
            );
        }
    };
    return { soaBody, boxedBody };
};

const KS = [3, 8, 12] as const;

describe("transformFramesGrouped — replace arm (DEFAULT, dispatch-free)", () => {
    for (const k of KS) {
        const group = makeGroup(k, "replace") as any;
        for (const e of group.getEntries()) e.animation.t = 500;
        group.transformFramesGrouped(0);
        const entries = group.getEntries();
        const grouped: Record<string, unknown> = group._grouped;
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
        const { soaBody, boxedBody } = primeGroup(k, "add");
        bench(`add boxed · K=${k}`, boxedBody);
        bench(`add SoA · K=${k}`, soaBody);
    }
});

describe("transformFramesGrouped — weighted arm", () => {
    for (const k of KS) {
        const { soaBody, boxedBody } = primeGroup(k, "weighted");
        bench(`weighted boxed · K=${k}`, boxedBody);
        bench(`weighted SoA · K=${k}`, soaBody);
    }
});
