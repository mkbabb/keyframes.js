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
import type { ValueUnit } from "@mkbabb/value.js";

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
