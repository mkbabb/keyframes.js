// SoA-compositor VALIDATION spike (Tranche P / P.W2). Owner: "test the SoA
// rewrite rather than outright abrogating it." This is the measure-first bench on
// the ACTUAL target path — the AnimationGroup weighted/add blend over ValueUnit[]
// leaves — comparing the CURRENT boxed-AoS inner loop against an SoA Float64Array
// fold that keeps the group's ValueUnit[] OUTPUT contract (the transform consumes
// ValueUnit[]). Honest verdict → spring-vector-style decision JSON.
import { ValueUnit } from "@mkbabb/value.js";

const lerp = (a, b, t) => a + (b - a) * t;
const isNumericUnit = (v) => v instanceof ValueUnit && typeof v.value === "number";

// Representative transform group: L layers (a crossfade is 2-3; we stress L=4),
// K keys, each a ValueUnit[] leaf (scalars + a multi-component). This is the
// shape transformFramesGrouped blends every frame in the non-default add/weighted
// arms (the only arms with per-element dispatch — `replace` is a bare assign).
const L = 4;   // layers (incl. the base)
const K = 8;   // keys per layer (translateX/Y, scale, rotate, opacity, + 3 multi)
const leafSizes = [1, 1, 1, 1, 1, 3, 2, 4]; // scalar + multi-component leaves

function makeLayer(seed) {
    const o = {};
    for (let k = 0; k < K; k++) {
        const arr = [];
        for (let i = 0; i < leafSizes[k]; i++) arr.push(new ValueUnit((seed + k + i) * 0.137, "px"));
        o["k" + k] = arr;
    }
    return o;
}
const layers = Array.from({ length: L }, (_, s) => makeLayer(s + 1));
const keys = Object.keys(layers[0]);

// ── The accumulator (the group's `_grouped` reuse buffer) ──
function makeAcc() {
    const o = {};
    for (const key of keys) o[key] = layers[0][key].map((u) => new ValueUnit(u.value, "px"));
    return o;
}

// ── A) the CURRENT boxed-AoS weighted blend (group.ts:336-360, isolated) ──
function boxedWeighted(acc, w) {
    for (let li = 1; li < L; li++) {
        const values = layers[li];
        for (const key in values) {
            const incoming = values[key];
            if (incoming === undefined) continue;
            const existing = acc[key];
            if (Array.isArray(existing) && Array.isArray(incoming)) {
                const n = Math.min(existing.length, incoming.length);
                for (let i = 0; i < n; i++) {
                    if (isNumericUnit(existing[i]) && isNumericUnit(incoming[i])) {
                        existing[i].value = lerp(existing[i].value, incoming[i].value, w);
                    } else {
                        existing[i] = incoming[i];
                    }
                }
            } else {
                acc[key] = incoming;
            }
        }
    }
}

// ── B) the SoA Float64Array fold (precomputed flat numeric-slot layout) ──
// At structural-change time, build: slotUnits[s] = the OUTPUT ValueUnit to write,
// and per layer a parallel array of incoming ValueUnit refs. Per frame: fold into
// a Float64Array `accF`, then write back to slotUnits (the ValueUnit[] contract).
function buildSoALayout(acc) {
    const slotUnits = [];           // output ValueUnit per numeric slot
    const layerSlots = Array.from({ length: L }, () => []); // incoming ValueUnit per slot per layer
    for (const key of keys) {
        const existing = acc[key];
        for (let i = 0; i < existing.length; i++) {
            if (!isNumericUnit(existing[i])) continue;
            // require all layers numeric at this slot (the stable-partition invariant)
            let allNum = true;
            for (let li = 1; li < L; li++) { if (!isNumericUnit(layers[li][key]?.[i])) { allNum = false; break; } }
            if (!allNum) continue;
            const s = slotUnits.length;
            slotUnits.push(existing[i]);
            for (let li = 1; li < L; li++) layerSlots[li][s] = layers[li][key][i];
        }
    }
    return { slotUnits, layerSlots, accF: new Float64Array(slotUnits.length) };
}
function soaWeighted(layout, w) {
    const { slotUnits, layerSlots, accF } = layout;
    const S = slotUnits.length;
    for (let s = 0; s < S; s++) accF[s] = slotUnits[s].value;     // seed from base
    for (let li = 1; li < L; li++) {
        const ls = layerSlots[li];
        for (let s = 0; s < S; s++) accF[s] = lerp(accF[s], ls[s].value, w); // Float64 fold
    }
    for (let s = 0; s < S; s++) slotUnits[s].value = accF[s];      // write back to ValueUnit[]
}

// add-arm variants (the OTHER non-default blend), for completeness
function boxedAdd(acc, _w) {
    for (let li = 1; li < L; li++) {
        const values = layers[li];
        for (const key in values) {
            const existing = acc[key], incoming = values[key];
            if (Array.isArray(existing) && Array.isArray(incoming)) {
                const n = Math.min(existing.length, incoming.length);
                for (let i = 0; i < n; i++) {
                    if (isNumericUnit(existing[i]) && isNumericUnit(incoming[i])) existing[i].value += incoming[i].value;
                    else existing[i] = incoming[i];
                }
            } else acc[key] = incoming;
        }
    }
}
function soaAdd(layout, _w) {
    const { slotUnits, layerSlots, accF } = layout, S = slotUnits.length;
    for (let s = 0; s < S; s++) accF[s] = slotUnits[s].value;
    for (let li = 1; li < L; li++) { const ls = layerSlots[li]; for (let s = 0; s < S; s++) accF[s] += ls[s].value; }
    for (let s = 0; s < S; s++) slotUnits[s].value = accF[s];
}

// ── CORRECTNESS: one blend from fresh state must produce identical output ──
function correctness(boxedFn, soaFn) {
    const a = makeAcc(), b = makeAcc(), lay = buildSoALayout(b);
    boxedFn(a, 0.5); soaFn(lay, 0.5);
    let maxErr = 0;
    for (const key of keys) for (let i = 0; i < a[key].length; i++) {
        if (isNumericUnit(a[key][i]) && isNumericUnit(b[key][i])) maxErr = Math.max(maxErr, Math.abs(a[key][i].value - b[key][i].value));
    }
    return maxErr;
}

// ── timing (3 trials, report median) ──
function time(fn, iters) {
    for (let i = 0; i < 2000; i++) fn();
    const t0 = performance.now();
    for (let i = 0; i < iters; i++) fn();
    return iters / ((performance.now() - t0) / 1000);
}
function median3(mk) { const r = [mk(), mk(), mk()].sort((x, y) => x - y); return r[1]; }

const ITERS = 400000;
const errW = correctness(boxedWeighted, soaWeighted);
const errA = correctness(boxedAdd, soaAdd);

const accA = makeAcc(), accB = makeAcc(), layoutB = buildSoALayout(accB);
const accA2 = makeAcc(), accB2 = makeAcc(), layoutB2 = buildSoALayout(accB2);
const hzBoxedW = median3(() => time(() => boxedWeighted(accA, 0.5), ITERS));
const hzSoAW = median3(() => time(() => soaWeighted(layoutB, 0.5), ITERS));
const hzBoxedA = median3(() => time(() => boxedAdd(accA2, 0.5), ITERS));
const hzSoAA = median3(() => time(() => soaAdd(layoutB2, 0.5), ITERS));

const v = (r) => r >= 1.2 ? "ADOPT (≥1.2x on the real path)" : r >= 1.0 ? "MARGINAL (<1.2x — not worth the rewrite)" : "KILL (SoA slower)";
const rW = hzSoAW / hzBoxedW, rA = hzSoAA / hzBoxedA;
console.log(JSON.stringify({
  $comment: "SoA-vs-boxed blend on transformFramesGrouped's ACTUAL leaf shape (ValueUnit[] output kept; default `replace` arm untouched). 3-trial median.",
  target: "AnimationGroup.transformFramesGrouped (add/weighted arms ONLY)",
  L, K, numericSlots: layoutB.slotUnits.length,
  correctness: { weightedMaxErr: errW, addMaxErr: errA, identical: errW < 1e-9 && errA < 1e-9 },
  weighted: { hzBoxed: Math.round(hzBoxedW), hzSoA: Math.round(hzSoAW), soaOverBoxed: +rW.toFixed(3), verdict: v(rW) },
  add: { hzBoxed: Math.round(hzBoxedA), hzSoA: Math.round(hzSoAA), soaOverBoxed: +rA.toFixed(3), verdict: v(rA) },
}, null, 2));
