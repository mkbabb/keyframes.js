// SoA-compositor INTEGRATION confirm (Tranche P / P.W2 Amdahl step). The isolated
// blend is 3.7x faster (group-soa-validate.mjs); this measures the blend's SHARE of
// the WHOLE transformFramesGrouped on a REAL AnimationGroup with REAL children, then
// derives the whole-frame win the SoA fold actually buys. No group.ts edit — the
// share is measured (full vs interpFrames-only), the 3.7x is applied analytically.
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

// A realistic multi-property transform keyframe (translate/scale/rotate/opacity →
// several numeric leaves). fromString parses; ready to sample.
const css = `0% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 1 }
             100% { transform: translate(120px, 60px) scale(1.4) rotate(45deg); opacity: 0.4 }`;
const mk = () => new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);

// The realistic crossfade: a base (replace) + 2 weighted layers (3 total); 4 = stress.
function makeGroup(nWeighted) {
    const entries = [{ animation: mk(), layer: { blendMode: "replace", zIndex: 0 } }];
    for (let i = 0; i < nWeighted; i++)
        entries.push({ animation: mk(), layer: { blendMode: "weighted", zIndex: i + 1, weight: 0.5 } });
    return new AnimationGroup(...entries);
}

function time(fn, iters) {
    for (let i = 0; i < 3000; i++) fn();
    const t0 = performance.now();
    for (let i = 0; i < iters; i++) fn();
    return iters / ((performance.now() - t0) / 1000);
}
function median3(mk) { const r = [mk(), mk(), mk()].sort((a, b) => a - b); return r[1]; }

const BLEND_SPEEDUP = 3.67; // measured (group-soa-decision.json, weighted arm)
const ITERS = 200000;
const out = {};

for (const n of [2, 3]) { // 2 weighted (3-layer) realistic, 3 weighted (4-layer) stress
    const group = makeGroup(n);
    const entries = group.getEntries(); // (TS-private; reachable at runtime in the bench)
    // per-child scratch buffers for the interpFrames-only measurement
    const bufs = entries.map(() => ({}));

    let tt = 0;
    const hzFull = median3(() => time(() => { tt = (tt + 0.0137) % 1; group.transformFramesGrouped(tt); }, ITERS));
    // interpFrames-only = the child-sampling portion the SoA leaves UNCHANGED
    const hzInterp = median3(() => time(() => {
        tt = (tt + 0.0137) % 1;
        for (let i = 0; i < entries.length; i++) entries[i].animation.interpFrames(entries[i].animation.t, false, bufs[i]);
    }, ITERS));

    const tFull = 1 / hzFull, tInterp = 1 / hzInterp;
    const tBlend = Math.max(0, tFull - tInterp);
    const blendShare = tBlend / tFull;
    const tSoA = tInterp + tBlend / BLEND_SPEEDUP;
    const wholeFrameWin = tFull / tSoA;

    out[`layers_${n + 1}`] = {
        hzFull: Math.round(hzFull), hzInterpOnly: Math.round(hzInterp),
        blendSharePct: +(blendShare * 100).toFixed(1),
        wholeFrameWin: +wholeFrameWin.toFixed(2),
        verdict: wholeFrameWin >= 1.15 ? "WORTH IT (whole-frame ≥1.15x)" : wholeFrameWin >= 1.05 ? "MODEST (1.05-1.15x — blend is a minor share)" : "MARGINAL (blend share too small to matter)",
    };
}

console.log(JSON.stringify({
  $comment: "SoA whole-frame Amdahl confirm: blend share of transformFramesGrouped on a real group, then the 3.67x blend speedup applied. The isolated blend is 3.67x; the WHOLE-FRAME win is the blend's share of the frame.",
  blendSpeedup: BLEND_SPEEDUP, ...out,
}, null, 2));
