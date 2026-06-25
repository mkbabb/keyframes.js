/**
 * compile-color.ts — K.W10 CC-2 the oklab DENSIFY (the color leg of THE COMPILE).
 *
 * Split out of `compile.ts` at the natural concern seam: this module holds ALL
 * the value.js color math — the perceptual `sampleColorRamp` densify, the
 * `deltaEOK` ΔE-ε ship-vs-refuse proof, and the small color-leaf helpers — so
 * the `compile.ts` walker (CC-1) + refusal surface (CC-3) stay free of the
 * color-space arithmetic. The compiler is the parser run BACKWARD over the SAME
 * data model; this is the one place it OUT-EXPRESSES naive CSS.
 *
 * THE DENSIFY (the one place the compiler beats hand-authored CSS). The platform
 * interpolates a `@keyframes` color in sRGB; kf interpolates in perceptual oklab.
 * So a two-stop color track replayed by the browser would DRIFT from the JS
 * playback. `densifyColorBlock` bakes the perceptual curve into N intermediate
 * `oklab()` stops sampled from value.js's `sampleColorRamp`, so the browser's
 * piecewise-linear fill TRACKS kf's perceptual lerp — gated on the ΔE-ε proof
 * (`deltaEOK`): the densify ships ONLY where it pixel-matches kf's JS lerp under
 * the threshold; else the caller REFUSES with the perceptual-oklab reason (a
 * drifting densify is worse than an honest refusal).
 *
 * BOUNDARY: HEAVY (value.js-bearing) — imported only by `compile.ts`, which
 * itself rides `loadAnimationEngine()`. NOT the LIGHT static barrel.
 */

import {
    color2,
    COLOR_SPACE_RANGES,
    deltaEOK,
    normalizeColorUnit,
    sampleColorRamp,
    scale,
    type Color,
    type HueInterpolationMethod,
    type ValueUnit,
} from "@mkbabb/value.js";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

// ── ΔE / oklab domain constants ───────────────────────────────────────────────

const OKLAB_A_MIN = COLOR_SPACE_RANGES.oklab.a.number.min;
const OKLAB_A_MAX = COLOR_SPACE_RANGES.oklab.a.number.max;
const OKLAB_B_MIN = COLOR_SPACE_RANGES.oklab.b.number.min;
const OKLAB_B_MAX = COLOR_SPACE_RANGES.oklab.b.number.max;

/** Round to 4 decimals — the emit quantization the densify ΔE proof measures. */
export const round = (n: number): number => Math.round(n * 1e4) / 1e4;

// ── Color leaf helpers ────────────────────────────────────────────────────────

/** Narrow a `ValueArray` element to a color-carrying `ValueUnit`. */
export const isColorUnit = (v: unknown): v is ValueUnit =>
    v != null &&
    typeof v === "object" &&
    (v as { unit?: unknown }).unit === "color";

/** A declared color ValueUnit → its normalized value.js `Color` (for the ramp). */
const toColor = (vu: ValueUnit): Color =>
    // @cross-realm: value.js and kf each bundle their OWN nominal `Color`/`ValueUnit`
    // (a structural seam tsc cannot reconcile); the densify path has no value.js
    // typed accessor, so the realm-bridge is irreducible here (K.W10).
    normalizeColorUnit(vu as never).value as unknown as Color;

/** A `Color`'s raw oklab `[L, a, b]` (the `deltaEOK` + CSS `oklab()` domain). */
const rawOklab = (c: Color): [number, number, number] => {
    const ok = color2(c, "oklab") as unknown as {
        l: number;
        a: number;
        b: number;
    };
    return [
        ok.l,
        scale(ok.a, 0, 1, OKLAB_A_MIN, OKLAB_A_MAX),
        scale(ok.b, 0, 1, OKLAB_B_MIN, OKLAB_B_MAX),
    ];
};

/** A `Color` → its CSS `oklab(L a b)` string (denormalized to the CSS domain). */
const colorToOklabCSS = (c: Color): string => {
    const [L, a, b] = rawOklab(c);
    return `oklab(${round(L)} ${round(a)} ${round(b)})`;
};

/** ΔE-OK between two Colors (the perceptual distance the densify proof reads). */
const colorDeltaE = (c1: Color, c2: Color): number => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return deltaEOK(L1, a1, b1, L2, a2, b2);
};

/** A `Color` from a raw oklab `[L, a, b]` tuple (the inverse of `rawOklab`). */
const fromRawOklab = (L: number, a: number, b: number): Color =>
    // @cross-realm: the `color2` color-literal input + the returned `Color` cross
    // the value.js nominal seam (kf vs value.js each carry their own `Color`); no
    // value.js typed constructor accepts kf's literal shape, so the bridge is
    // irreducible on the densify path (K.W10).
    color2(
        {
            colorSpace: "oklab",
            l: L,
            a: scale(a, OKLAB_A_MIN, OKLAB_A_MAX, 0, 1),
            b: scale(b, OKLAB_B_MIN, OKLAB_B_MAX, 0, 1),
            alpha: 1,
        } as never,
        "oklab",
    ) as unknown as Color;

/**
 * The browser's piecewise-linear `oklab()` midpoint of two emitted stops — a
 * plain per-channel average in the oklab space the browser interpolates the
 * `@keyframes` color in (CSS Color 4: an `oklab()` `@keyframes` fill is a
 * straight channel lerp). The densify ΔE proof compares THIS against kf's
 * perceptual lerp at the same global t.
 */
const channelMidpoint = (c1: Color, c2: Color): Color => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return fromRawOklab((L1 + L2) / 2, (a1 + a2) / 2, (b1 + b2) / 2);
};

// ── Template color access ─────────────────────────────────────────────────────

/** A `0%`/`50%` selector ValueUnit → its numeric percent. */
const percentOf = (start: ValueUnit): number => {
    const m = /([\d.]+)\s*%/.exec(start.toString());
    return m ? parseFloat(m[1]!) : 0;
};

/**
 * The declared color ValueUnit for a flat property `key` at stop `i`, or
 * `undefined` (a color is one carrier — the single `unit === "color"` leaf).
 */
const colorValueAt = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    key: string,
): ValueUnit | undefined => {
    const arr = (animation.parsedVars[i] ?? {})[key];
    if (!Array.isArray(arr)) return undefined;
    return (arr as ValueUnit[]).find((v) => isColorUnit(v));
};

// ── CC-2 the densify (the ship-vs-refuse decision) ────────────────────────────

/** The densify result: a ready `@keyframes` block, a refusal, or no-densify. */
export type DensifyResult =
    | { block: string }
    | { refused: true; delta: number }
    | null;

/** One key's densify trace: its ordered stops + the worst inter-stop ΔE drift. */
interface KeyDensify {
    /** The CSS longhand property name (`background-color`, `color`, …). */
    cssProp: string;
    /** The densified stops for THIS key — `{ pct, css }` at evenly-spaced %. */
    stops: { pct: number; css: string }[];
    /** The WORST midpoint ΔE this key drifts (the per-key ship-vs-refuse term). */
    worstDelta: number;
}

/**
 * CC-2 — densify ONE changing color key into dense `oklab()` stops, measuring the
 * worst inter-stop ΔE drift. Factored out of {@link densifyColorBlock} so the
 * multi-color path (L.W2 S2 Option A) densifies EACH key independently and merges
 * the per-key stop sets — the single-key logic generalized, no architectural
 * change. Returns the key's `{ cssProp, stops, worstDelta }` trace.
 */
function densifyKey<V extends Vars>(
    animation: KeyframesAnimation<V>,
    key: string,
    stopCount: number,
    space: "oklab" | "oklch",
    hueOpt: { hueMethod?: HueInterpolationMethod },
): KeyDensify {
    const cssProp = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const stops: { pct: number; css: string }[] = [];
    let worstDelta = 0;

    for (let i = 0; i + 1 < animation.templateFrames.length; i++) {
        const a = colorValueAt(animation, i, key);
        const b = colorValueAt(animation, i + 1, key);
        if (!a || !b) continue;
        const pStart = percentOf(animation.templateFrames[i]!.start);
        const pEnd = percentOf(animation.templateFrames[i + 1]!.start);
        if (a.toString() === b.toString()) {
            stops.push({ pct: pStart, css: a.toString() });
            continue;
        }
        const fromColor = toColor(a);
        const toColor_ = toColor(b);
        const ramp = sampleColorRamp(fromColor, toColor_, stopCount, {
            space,
            ...hueOpt,
        });
        for (let s = 0; s < ramp.length; s++) {
            const t = s / (ramp.length - 1);
            const pct = pStart + (pEnd - pStart) * t;
            stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) });
        }
        // ── THE ΔE PROOF (the ship-vs-refuse decision) ──────────────────────
        for (let s = 0; s + 1 < ramp.length; s++) {
            const tMid = (s + 0.5) / (ramp.length - 1);
            const kfMid = sampleColorRamp(fromColor, toColor_, 1024, {
                space,
                ...hueOpt,
            })[Math.round(tMid * 1023)]!;
            const browserMid = channelMidpoint(ramp[s]!, ramp[s + 1]!);
            worstDelta = Math.max(worstDelta, colorDeltaE(browserMid, kfMid));
        }
    }
    // Always include the final stop (verbatim — the declared endpoint).
    const lastIdx = animation.templateFrames.length - 1;
    const lastColor = colorValueAt(animation, lastIdx, key);
    if (lastColor) {
        const lastPct = percentOf(animation.templateFrames[lastIdx]!.start);
        if (stops[stops.length - 1]?.pct !== lastPct) {
            stops.push({ pct: lastPct, css: lastColor.toString() });
        }
    }
    return { cssProp, stops, worstDelta };
}

/**
 * CC-2 — the densified `@keyframes` block for an animation carrying one OR MORE
 * changing color tracks. For each changing color key, and each ADJACENT declared
 * stop pair where it changes, bake N `oklab()` stops sampled from value.js's
 * `sampleColorRamp` (kf's perceptual ramp) at evenly-spaced percentages, so the
 * browser's piecewise-linear sRGB fill TRACKS kf's perceptual oklab lerp.
 *
 * L.W2 S2 Option A — multi-color is HONEST. A two-changing-color track (e.g.
 * `color` + `background-color`) used to early-out at `colorKeys.length > 1`,
 * shipping the verbatim two-stop sRGB block with `eligible: true` (the SAME ΔE
 * drift the single-color path REFUSES, here shipped silently — ⚠28/⚠29, viol28).
 * The fix generalizes the densify: EACH changing color key densifies
 * INDEPENDENTLY ({@link densifyKey}), the per-key stop sets merge by percentage
 * into one block, and `worstDelta` is the MAX over every key — so a multi-color
 * track ships ONLY if EVERY key holds under ΔE-ε, else it refuses. No new refusal
 * reason: the existing `perceptual-oklab` decision covers the worst-case key.
 *
 * Returns `{ block }` (the densified `@keyframes` string) when EVERY changing
 * color key ships under ΔE-ε, `{ refused: true, delta }` when ANY key drifts past
 * the threshold (the worst-case key), or `null` when no color densify applies
 * (the caller falls back to the verbatim declared block — exact when there is no
 * color interpolation).
 *
 * The ΔE proof: the platform interpolates BETWEEN the emitted `oklab()` stops by
 * a per-channel lerp (NOT kf's perceptual curve). The densify is faithful iff
 * that inter-stop browser-lerp tracks kf's JS perceptual lerp under ΔE-ε. We
 * measure the WORST drift at the MIDPOINT between each adjacent emitted-stop pair
 * (the browser's oklab channel-lerp midpoint vs kf's perceptual color at the same
 * global t), over EVERY changing key. A coarse densify drifts MORE → it refuses;
 * a dense one holds the band → it ships. MEASURE-FIRST (a drifting densify is
 * worse than a refusal).
 */
export function densifyColorBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    n: number,
    epsilon: number,
): DensifyResult {
    // Collect color keys whose track CHANGES across the template.
    const colorKeys: string[] = [];
    const keySeen = new Set<string>();
    for (let i = 0; i + 1 < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const [key, arr] of Object.entries(declared)) {
            if (keySeen.has(key)) continue;
            if (!Array.isArray(arr) || !arr.some((v) => isColorUnit(v))) continue;
            const a = colorValueAt(animation, i, key);
            const b = colorValueAt(animation, i + 1, key);
            if (a && b && a.toString() !== b.toString()) {
                colorKeys.push(key);
                keySeen.add(key);
            }
        }
    }
    if (colorKeys.length === 0) return null;

    const stopCount = Math.max(3, n);
    const space = (
        animation.options.colorSpace === "oklch" ? "oklch" : "oklab"
    ) as "oklab" | "oklch";
    const hueOpt = animation.options.hueMethod
        ? { hueMethod: animation.options.hueMethod }
        : {};

    // L.W2 S2 Option A — densify EVERY changing color key independently and merge
    // the per-key stop sets by percentage. `worstDelta` is the MAX over all keys
    // (the WORST-CASE key governs ship-vs-refuse — never the average), so a
    // multi-color track ships ONLY if every key holds under ΔE-ε. The per-key
    // densified percentages align (every key densifies the SAME template stop
    // intervals), so the merge is a clean per-percentage declaration accumulation.
    let worstDelta = 0;
    // pct → ordered list of `cssProp: css` declarations (insertion-ordered by
    // key, then by percentage within each key's pass).
    const byPct = new Map<number, string[]>();
    const pctOrder: number[] = [];
    for (const key of colorKeys) {
        const traced = densifyKey(animation, key, stopCount, space, hueOpt);
        worstDelta = Math.max(worstDelta, traced.worstDelta);
        for (const { pct, css } of traced.stops) {
            let decls = byPct.get(pct);
            if (!decls) {
                decls = [];
                byPct.set(pct, decls);
                pctOrder.push(pct);
            }
            decls.push(`${traced.cssProp}: ${css};`);
        }
    }

    if (worstDelta > epsilon) {
        return { refused: true, delta: worstDelta };
    }

    // Emit the merged block in ascending percentage order (a stable, canonical
    // stop ordering the re-parse reads identically).
    pctOrder.sort((p, q) => p - q);
    let body = "";
    for (const pct of pctOrder) {
        const decls = byPct.get(pct)!;
        body += `${pct}% {\n  ${decls.join("\n  ")}\n}\n`;
    }
    return { block: `@keyframes ${name} {\n${body}}` };
}
