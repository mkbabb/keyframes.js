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
    type ValueUnit,
} from "@mkbabb/value.js";
import type { Animation } from "./engine";
import type { Vars } from "./constants";

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
    animation: Animation<V>,
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

/**
 * CC-2 — the densified `@keyframes` block for an animation carrying a color
 * track. For each ADJACENT declared stop pair where the SINGLE animated color
 * property changes, bake N `oklab()` stops sampled from value.js's
 * `sampleColorRamp` (kf's perceptual ramp) at evenly-spaced percentages, so the
 * browser's piecewise-linear sRGB fill TRACKS kf's perceptual oklab lerp.
 *
 * Returns `{ block }` (the densified `@keyframes` string) when the densify ships
 * under ΔE-ε, `{ refused: true, delta }` when it drifts past the threshold, or
 * `null` when no single-color densify applies (the caller falls back to the
 * verbatim declared block — exact when there is no color interpolation).
 *
 * The ΔE proof: the platform interpolates BETWEEN the emitted `oklab()` stops by
 * a per-channel lerp (NOT kf's perceptual curve). The densify is faithful iff
 * that inter-stop browser-lerp tracks kf's JS perceptual lerp under ΔE-ε. We
 * measure the WORST drift at the MIDPOINT between each adjacent emitted-stop pair
 * (the browser's oklab channel-lerp midpoint vs kf's perceptual color at the same
 * global t). A coarse densify drifts MORE → it refuses; a dense one holds the
 * band → it ships. MEASURE-FIRST (a drifting densify is worse than a refusal).
 */
export function densifyColorBlock<V extends Vars>(
    animation: Animation<V>,
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

    // The canonical densify is single-color (one perceptual track baked into
    // dense oklab() stops). A multi-color animation keeps the verbatim block (the
    // headline is the one-color case; multi-color densify is BOOK).
    if (colorKeys.length > 1) return null;

    const key = colorKeys[0]!;
    const stopCount = Math.max(3, n);
    const cssProp = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

    const space = (
        animation.options.colorSpace === "oklch" ? "oklch" : "oklab"
    ) as "oklab" | "oklch";
    const hueOpt = animation.options.hueMethod
        ? { hueMethod: animation.options.hueMethod }
        : {};

    // Build the full ordered densified stop list across every changing segment.
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

    if (worstDelta > epsilon) {
        return { refused: true, delta: worstDelta };
    }

    let body = "";
    for (const { pct, css } of stops) {
        body += `${pct}% {\n  ${cssProp}: ${css};\n}\n`;
    }
    return { block: `@keyframes ${name} {\n${body}}` };
}
