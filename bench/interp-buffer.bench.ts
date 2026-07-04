/**
 * interp-buffer.bench.ts — the THREADED out-buffer interp shape (F.W1 S2,
 * `a-runtime-remeasure RM-1 §A.1`).
 *
 * The shaped sibling of `interpolation.bench.ts` the current bench CANNOT be.
 * `interpolation.bench.ts` calls `interpFrames(t, false)` with the DEFAULT `{}`
 * buffer (engine.ts:568) — so every call allocates a fresh fast-mode result
 * object and the GC win MASKS the dict-mode cost. This bench threads ONE
 * long-lived `out` buffer across a ~600-frame steady window (the real playback
 * shape `_frame` takes via the hoisted `_interpOut` buffer, engine.ts:161,747)
 * at the demo's realistic K (2/5/12 flat interpolating keys), so the
 * `delete`-loop dict-mode deopt (engine.ts:573) becomes observable — the shape
 * F4's `proof:interp-fastprops` wall-time clause measures.
 *
 * Imports `CSSKeyframesAnimation` from the VALUE module `engine`, never the
 * type-only barrel `../src/animation` (F.W1 S1).
 */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { loadAnimationEngine, warmEngine } from "../src/animation";
import {
    FunctionValue,
    lerpArray,
    lerpColorValue,
    lerpValue,
    mixColors,
    normalizeValueUnits,
    parseCSSSubValue,
    prepareInterpVar,
    ValueArray,
    ValueUnit,
} from "@mkbabb/value.js";

/**
 * Build an animation whose every keyframe declares exactly `keys` flat
 * interpolating properties — the K the dict-mode deopt scales with. Five
 * stops give the binary-search seed + contiguous-neighbour scan a realistic
 * segment count without conflating K (the per-frame merge width) with the
 * stop count.
 */
const FLAT_KEYS = [
    "opacity",
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin-top",
    "margin-left",
    "padding-top",
    "padding-left",
    "border-width",
] as const;

const makeAnim = (keys: number) => {
    const STOPS = 5;
    const css = Array.from({ length: STOPS }, (_, s) => {
        const pct = Math.round((s / (STOPS - 1)) * 100);
        const decls = FLAT_KEYS.slice(0, keys)
            .map((k, ki) => `${k}: ${((s + ki) % 10) * 10}px`)
            .join("; ");
        // opacity is unitless — override the first key so it stays valid CSS.
        const body = decls.replace(/^opacity: (\d+)px/, "opacity: 0.$1");
        return `${pct}% { ${body}; }`;
    }).join("\n");
    return new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
};

describe("interpFrames — threaded out-buffer (realistic playback)", () => {
    const cases: ReadonlyArray<readonly [string, number]> = [
        ["K=2", 2],
        ["K=5", 5],
        ["K=12", 12],
    ];

    for (const [label, K] of cases) {
        const anim = makeAnim(K);
        // The ONE long-lived buffer — reused across every frame of the
        // window, exactly as `_frame` reuses `_interpOut`. This is the thing
        // the current `interpolation.bench.ts` omits (it passes the default
        // `{}` per call, allocating a fresh fast-mode object every time).
        const out: Record<string, ValueUnit[]> = {};

        bench(`${label} · 600-frame steady window (threaded buffer)`, () => {
            for (let f = 0; f < 600; f++) {
                anim.interpFrames((f / 600) * 1000, false, out);
            }
        });
    }
});

/**
 * The C1 computed-unit variant (G.W2 S4a · the −94% endpoint-memo witness).
 *
 * The FLAT_KEYS animations above are NUMERIC — a bare `lerp(startN, stopN, t)`
 * with no endpoint resolution. This variant animates a COMPUTED endpoint
 * (`calc(100% - …px)` bound to a DOM target), so each steady frame's
 * `lerpValue → iv._lerp` routes through value.js's `lerpComputedValue`
 * (`interpolate.ts` `Wo`), which on `0.10.0` re-resolved both endpoints via
 * `getComputedValue` (a DOM reflow) EVERY frame — O(frames) — and on `0.11.0`
 * memoizes the resolved `(startN, stopN)` keyed on `(target, layoutEpoch)` in
 * `iv._computedCache`, so the steady window pays the resolve ONCE — O(1) — then
 * collapses to a bare `lerp` (`F/FINAL.md:39-44`).
 *
 * This bench is the WALL-TIME face of that drop (the call-count assertion lives
 * in `proof:repin-witness`, which counts `iv._computedCache` fresh-writes — 1
 * over 600 frames, the bite). The re-pin makes the computed window track the
 * numeric window's per-frame cost; on `0.10.0` it would scale with `getComputed
 * Value` reflow cost per frame.
 *
 * Imports `CSSKeyframesAnimation` from the VALUE module `engine`, never the
 * type-only barrel (F.W1 S1). The DOM target is the jsdom `document` the
 * vitest library gate already provides.
 */
const makeComputedAnim = () => {
    // A `container`-typed ancestor so `cqw` could resolve in a real DOM; the
    // calc leaf is the C1 subject either way (it carries `computed: true`).
    const host = document.createElement("div");
    host.style.cssText = "container-type: inline-size; width: 1000px;";
    const box = document.createElement("div");
    host.appendChild(box);
    document.body.appendChild(host);
    const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
        "0% { width: calc(100% - 10px); } 100% { width: calc(100% - 200px); }",
    );
    anim.setTargets(box);
    return anim;
};

describe("interpFrames — computed endpoint (C1 memo, G.W2)", () => {
    const anim = makeComputedAnim();
    const out: Record<string, ValueUnit[]> = {};

    bench("calc() leaf · 600-frame steady window (C1 endpoint memo)", () => {
        for (let f = 0; f < 600; f++) {
            anim.interpFrames((f / 600) * 1000, false, out);
        }
    });
});

/**
 * J.W6 S2 — the SoA `lerpArray` ADOPT-or-KILL arm (`J.W6.md §S2`,
 * `perf-frontier.md §PF-8`, `deferred-ledger.md:102`).
 *
 * The rider: pack the K interpolating channels into `Float64Array` keyframe
 * buffers and interpolate via a SINGLE `lerpArray(from, to, t, out)` call
 * (value.js 0.11.2, published), instead of the engine's per-channel
 * `lerpValue → iv._lerp` closure dispatch (`engine.ts` `processFrame`).
 *
 * Corpus: the REAL-K shape the G measurement named — the demo's cube
 * transform animation, translate3d(3) + scale3d(3) + rotateZ(1) +
 * opacity(1) = exactly K=8 numeric channels (probe-verified:
 * `allInterpVars.length === 8`), 5 stops, threaded over the ~600-frame
 * steady window with a long-lived buffer (the `_frame`/`_interpOut` hoisted
 * shape) so the per-channel dispatch is the measured quantity, not
 * allocation. A K=10 corroborator (bare `rotate` expands to
 * rotateX/Y/Z) brackets the G-era "K=8-10" claim.
 *
 * Two tiers per K:
 *  - FULL-PIPELINE: the current `interpFrames` (segment search + easing +
 *    per-channel lerp + buffer merge) vs a faithful SoA twin that keeps the
 *    work `lerpArray` cannot remove (the same binary segment search over the
 *    compiled frames, the same `timingFunction.fn` easing call) and replaces
 *    ONLY the per-channel loop + merge with one `lerpArray`. This pair is
 *    the DECISION arm: ADOPT iff the SoA twin shows ≥20% wall-time
 *    reduction at K=8 (`perf-frontier.md:236`).
 *  - DISPATCH-ONLY: the bare per-channel `lerpValue` loop vs the bare
 *    `lerpArray` call on identical endpoints — isolates the closure-dispatch
 *    overhead itself (the G-2 "2.5-4×" quantity), a corroborator for WHERE
 *    any full-pipeline delta comes from.
 */
const makeTransformAnim = (rotateFn: "rotateZ" | "rotate") => {
    const STOPS = 5;
    const css = Array.from({ length: STOPS }, (_, s) => {
        const pct = Math.round((s / (STOPS - 1)) * 100);
        const k = s / (STOPS - 1);
        return `${pct}% { transform: translate3d(${k * 160}px, ${k * 40}px, ${
            k * 20
        }px) scale3d(${1 + k * 0.8}, ${1 + k * 0.4}, 1) ${rotateFn}(${
            k * 180
        }deg); opacity: ${k}; }`;
    }).join("\n");
    return new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
};

/**
 * Compile-time analog of the SoA FrameCompiler emission: per compiled frame
 * segment, pack `allInterpVars[k].{start,stop}.value` into `Float64Array`
 * from/to buffers (done ONCE, outside the bench loop — the refactor would do
 * this at `parse()`), carrying the segment window + easing fn beside them.
 */
const packSoA = (anim: ReturnType<typeof makeTransformAnim>) => {
    const segs = anim.frames.map((frame) => {
        const K = frame.allInterpVars.length;
        const from = new Float64Array(K);
        const to = new Float64Array(K);
        frame.allInterpVars.forEach((iv, k) => {
            from[k] = iv.start.value as unknown as number;
            to[k] = iv.stop.value as unknown as number;
        });
        return {
            start: frame.time.start,
            stop: frame.time.stop,
            fn: frame.timingFunction.fn,
            from,
            to,
        };
    });
    return { segs, out: new Float64Array(segs[0]!.from.length) };
};

describe("interpFrames — SoA lerpArray arm (J.W6 S2, real-K corpus)", () => {
    const cases = [
        ["K=8 (translate3d+scale3d+rotateZ+opacity)", "rotateZ"],
        ["K=10 (rotate expands ×3)", "rotate"],
    ] as const;

    for (const [label, rotateFn] of cases) {
        const anim = makeTransformAnim(rotateFn);
        const out: Record<string, ValueUnit[]> = {};
        const { segs, out: soaOut } = packSoA(anim);

        bench(
            `${label} · per-channel _lerp (current) · 600-frame window`,
            () => {
                for (let f = 0; f < 600; f++) {
                    anim.interpFrames((f / 600) * 1000, false, out);
                }
            },
        );

        bench(
            `${label} · SoA Float64Array+lerpArray · 600-frame window`,
            () => {
                for (let f = 0; f < 600; f++) {
                    const t = (f / 600) * 1000;
                    // The same binary segment search the engine pays
                    // (`binarySearchRange` seed) — the SoA refactor cannot
                    // remove it, so the twin keeps it.
                    let lo = 0;
                    let hi = segs.length - 1;
                    while (lo < hi) {
                        const mid = (lo + hi) >> 1;
                        if (segs[mid]!.stop < t) lo = mid + 1;
                        else hi = mid;
                    }
                    const seg = segs[lo]!;
                    const scaled =
                        seg.start === seg.stop
                            ? 1
                            : (t - seg.start) / (seg.stop - seg.start);
                    lerpArray(seg.from, seg.to, seg.fn(scaled), soaOut);
                }
            },
        );
    }

    // DISPATCH-ONLY corroborator at K=8: the bare per-channel closure loop
    // vs the bare fused lerpArray on identical endpoints — no search, no
    // easing, no merge. This is the isolated quantity the G-2 claim named.
    const anim8 = makeTransformAnim("rotateZ");
    const ivs = anim8.frames[0]!.allInterpVars;
    const { segs: segs8 } = packSoA(anim8);
    const seg0 = segs8[0]!;
    const dispatchOut = new Float64Array(seg0.from.length);

    bench("K=8 · dispatch-only · per-channel lerpValue ×8 (current)", () => {
        for (let f = 0; f < 600; f++) {
            const eased = f / 600;
            for (let k = 0; k < ivs.length; k++) {
                lerpValue(eased, ivs[k]!);
            }
        }
    });

    bench("K=8 · dispatch-only · single lerpArray (SoA)", () => {
        for (let f = 0; f < 600; f++) {
            lerpArray(seg0.from, seg0.to, f / 600, dispatchOut);
        }
    });
});

/**
 * Q.WB3 S1/S3 — the single-animation `processFrame` SoA-vs-boxed K-LADDER (the
 * measure-first decision arm + the K-monotonicity witness).
 *
 * `proof:processframe-soa` reads this arm: the BASELINE is the REAL boxed
 * `processFrame` path (`interpFrames(t, false, out)` over the threaded buffer —
 * the per-channel `lerpValue` megamorphic dispatch EVERY preset/`fromString`/
 * single animation rides), the CANDIDATE is the SoA Float64Array+`lerpArray` twin
 * (the same binary segment search + easing, the per-channel loop replaced by ONE
 * `lerpArray`). The ratio (candidate/baseline) is SAME-REPORT (device-independent
 * by construction). Recorded at K=3/8/12 so the gate witnesses SoA-over-boxed
 * MONOTONICITY in K (the proof the fold SCALES with channel count — boxed degrades
 * steeper than SoA as K rises).
 *
 * The case names are gate-parsed: `processFrame boxed · K=<k>` /
 * `processFrame SoA · K=<k>`.
 */
const FLAT_K_KEYS = [
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin-top",
    "margin-left",
    "margin-right",
    "margin-bottom",
    "padding-top",
    "padding-left",
] as const;

/** Build an animation with exactly `K` flat NUMERIC interpolating channels (the
 * `processFrame` numeric fold's subject — every leaf a numeric `ValueUnit`). */
const makeKAnim = (K: number) => {
    const STOPS = 5;
    const css = Array.from({ length: STOPS }, (_, s) => {
        const pct = Math.round((s / (STOPS - 1)) * 100);
        const decls = FLAT_K_KEYS.slice(0, K)
            .map((k, ki) => `${k}: ${((s + ki) % 10) * 10 + 1}px`)
            .join("; ");
        return `${pct}% { ${decls}; }`;
    }).join("\n");
    return new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
};

describe("processFrame — SoA-vs-boxed K-ladder (Q.WB3 S1/S3, measure-first)", () => {
    const KS = [3, 8, 12] as const;

    for (const K of KS) {
        const anim = makeKAnim(K);
        const out: Record<string, ValueUnit[]> = {};
        const { segs, out: soaOut } = packSoA(anim);

        // BASELINE — the REAL boxed processFrame path (per-channel lerpValue).
        bench(`processFrame boxed · K=${K} · 600-frame window`, () => {
            for (let f = 0; f < 600; f++) {
                anim.interpFrames((f / 600) * 1000, false, out);
            }
        });

        // CANDIDATE — the SoA Float64Array+lerpArray twin (same search + easing,
        // the per-channel loop replaced by one lerpArray). The fold the S2
        // processFrame numeric arm performs in-engine.
        bench(`processFrame SoA · K=${K} · 600-frame window`, () => {
            for (let f = 0; f < 600; f++) {
                const t = (f / 600) * 1000;
                let lo = 0;
                let hi = segs.length - 1;
                while (lo < hi) {
                    const mid = (lo + hi) >> 1;
                    if (segs[mid]!.stop < t) lo = mid + 1;
                    else hi = mid;
                }
                const seg = segs[lo]!;
                const scaled =
                    seg.start === seg.stop
                        ? 1
                        : (t - seg.start) / (seg.stop - seg.start);
                lerpArray(seg.from, seg.to, seg.fn(scaled), soaOut);
            }
        });
    }
});

/**
 * Q.WB3 S4 — the COLOR-SoA arm (the GATED color-tail completion, measure-first).
 *
 * `proof:color-soa` reads this arm. The BASELINE is the naive per-element BOXED
 * color reconstruct (`mixColors(start, stop, …)` — the pre-channel-plan path,
 * rebuilding a `Color` per leaf per frame). The CANDIDATE is value.js 1.2.0's
 * `_colorPlan`-FOLDED `lerpColorValue`: `prepareInterpVar`/`normalizeValueUnits`
 * (the SAME helpers kf's `createInterpVarValue` already calls) attach a
 * `_colorPlan` (`{keys, startN, stopN, hueIndex, dstVU}` — a contiguous Float64
 * oklab-channel SoA layout) to every color iv, and `lerpColorValue` folds the
 * channels through it. This is value.js's `ColorChannelPlan` (VJ-Q8) — but
 * SHIPPED INSIDE THE LEAF, so kf's existing boxed color tail (`lerpValue →
 * lerpColorValue`) ALREADY rides the channel-plan fold transparently via the
 * `^1.2.0` re-pin. The case names are gate-parsed:
 * `colorTail boxed · K=<k>` / `colorTail SoA · K=<k>`.
 *
 * The measure proves the channel-plan fold's win AND grounds the DECLINE of a
 * SEPARATE kf-side parallel arm: a kf-built `buildColorChannelPlan` +
 * `lerpColorChannels` fold in `processFrame`/`group.ts` would DUPLICATE the fold
 * value.js already performs in `lerpColorValue` — a dead parallel path the
 * no-legacy precept forbids. The win is real (the gate records the ratio); the
 * kf-side parallel build is redundant (the gate records the DECLINE).
 */
const COLOR_PAIRS: ReadonlyArray<readonly [string, string]> = [
    ["red", "blue"],
    ["green", "orange"],
    ["purple", "cyan"],
    ["yellow", "magenta"],
    ["black", "white"],
    ["teal", "coral"],
    ["navy", "gold"],
    ["lime", "pink"],
    ["maroon", "aqua"],
    ["olive", "fuchsia"],
    ["silver", "indigo"],
    ["crimson", "khaki"],
] as const;

/** A flattened color leaf from a CSS color literal (the densify/interp domain). */
const colorLeaf = (css: string): ValueUnit => {
    const parsed = parseCSSSubValue(css, { subProperty: "color" });
    const flat = (function rec(v: unknown): ValueUnit[] {
        if (v instanceof ValueUnit) return [v];
        if (v instanceof FunctionValue) return v.values.flatMap(rec);
        if (v instanceof ValueArray) return v.flatMap(rec);
        return [];
    })(parsed);
    return flat[0]!;
};

/** A color InterpolatedVar — value.js attaches the `_colorPlan` SoA layout. */
const colorIv = (a: string, b: string) =>
    prepareInterpVar(
        normalizeValueUnits(colorLeaf(a), colorLeaf(b), { colorSpace: "oklab" }),
    );

describe("colorTail — channel-plan SoA vs boxed (Q.WB3 S4, measure-first)", () => {
    const KS = [3, 8, 12] as const;

    for (const K of KS) {
        const ivs = COLOR_PAIRS.slice(0, K).map(([a, b]) => colorIv(a, b));
        const starts = ivs.map((iv) => iv.start.value);
        const stops = ivs.map((iv) => iv.stop.value);

        // BASELINE — the naive per-element boxed color reconstruct (pre-plan):
        // rebuild a `Color` per leaf per frame via `mixColors`.
        bench(`colorTail boxed · K=${K} · 600-frame window`, () => {
            for (let f = 0; f < 600; f++) {
                const e = f / 600;
                for (let k = 0; k < K; k++) {
                    mixColors(starts[k], stops[k], (1 - e) * 100, e * 100, "oklab");
                }
            }
        });

        // CANDIDATE — the `_colorPlan`-folded `lerpColorValue` (SHIPPED in
        // value.js 1.2.0, consumed transparently by kf's existing boxed tail).
        bench(`colorTail SoA · K=${K} · 600-frame window`, () => {
            for (let f = 0; f < 600; f++) {
                const e = f / 600;
                for (let k = 0; k < K; k++) {
                    lerpColorValue(e, ivs[k]!);
                }
            }
        });
    }
});

/**
 * L.W7 S1/S6 — the `warmEngine()` pre-resolve budgeted arm (W121, Lane 33).
 *
 * `warmEngine()` (the LIGHT barrel) fires `loadAnimationEngine()`'s dynamic
 * import fire-and-forget on idle, memoized through the module-scope
 * `_enginePromise`. The CONTRACT this arm measures: after a warm, the first
 * `await loadAnimationEngine()` from an interaction handler resolves against the
 * ALREADY-SETTLED Promise — a sub-millisecond microtask, no second import — so
 * the first `.animate()` / `CSSKeyframesAnimation` is synchronous against a
 * resolved surface, not a cold network+parse+compile stall.
 *
 * The bench warms ONCE at module load (fire-and-forget, exactly as a real shell
 * does in `requestIdleCallback`), then each iteration awaits
 * `loadAnimationEngine()`. After the first settle every iteration measures the
 * memoized fast path (the same in-flight Promise, zero re-import) — the
 * "resolves before first animate" quantity. `proof:bench-taxonomy` names this
 * arm in its `pendingBudgeted` roster: it is BORN-RED until `warmEngine` ships
 * (S1) and this arm exists (S6); GREEN once both land.
 *
 * Imports `warmEngine`/`loadAnimationEngine` from the barrel — both LIGHT static
 * named exports that fire DYNAMIC imports (no static value.js edge; the heavy
 * surface they resolve rides `loadAnimationEngine`'s chunk boundary).
 */
// Fire the idle warm-up once, off the bench's critical path (the shell shape).
warmEngine();

describe("warmEngine pre-resolve (L.W7 S1, W121)", () => {
    bench(
        "warmEngine — loadAnimationEngine resolves before first animate",
        async () => {
            // After the module-load warm settles, this resolves against the memoized
            // `_enginePromise` — one microtask, no second import (the S1 contract).
            const engine = await loadAnimationEngine();
            // Touch the resolved surface so the await is not dead-code-eliminated.
            // `CSSKeyframesAnimation` is the canonical heavy-surface member — the
            // idiomatic "in" the subpath now mirrors.
            if (typeof engine.CSSKeyframesAnimation !== "function") {
                throw new Error(
                    "warmEngine pre-resolve did not settle the engine",
                );
            }
        },
    );
});
