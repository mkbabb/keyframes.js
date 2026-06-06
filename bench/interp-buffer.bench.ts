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
