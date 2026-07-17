/**
 * compile-color.ts — K.W10 CC-2 the oklab DENSIFY (the color leg of THE COMPILE).
 *
 * Split out of `compile.ts` at the natural concern seam: this module holds ALL
 * the Value 4 final-color math — a `mixColors`-sampled perceptual densify, the
 * Keyframes-owned ΔE-ε ship-vs-refuse measurement, and small color-slot helpers — so
 * the `compile.ts` walker (CC-1) + refusal surface (CC-3) stay free of the
 * color-space arithmetic. The compiler is the parser run BACKWARD over the SAME
 * data model; this is the one place it OUT-EXPRESSES naive CSS.
 *
 * THE DENSIFY (the one place the compiler beats hand-authored CSS). The platform
 * interpolates a `@keyframes` color in sRGB; kf interpolates in perceptual oklab.
 * So a two-stop color track replayed by the browser would DRIFT from the JS
 * playback. `densifyColorBlock` bakes the perceptual curve into N intermediate
 * `oklab()` stops sampled through Value 4 `mixColors`, so the browser's
 * piecewise-linear fill TRACKS kf's perceptual lerp — gated on the ΔE-ε proof
 * in final OKLab coordinates: the densify ships ONLY where it pixel-matches kf's JS lerp under
 * the threshold; else the caller REFUSES with the perceptual-oklab reason (a
 * drifting densify is worse than an honest refusal).
 *
 * BOUNDARY: HEAVY (value.js-bearing) — imported only by `compile.ts`, which
 * itself rides `loadAnimationEngine()`. NOT the LIGHT static barrel.
 */

import {
    convertColor,
    mixColors,
    oklab,
    type AnyColor,
    type Color,
    type HueInterpolationMethod,
} from "@mkbabb/value.js/color";
import type { KeyframeSelector } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import type { KeyframesAnimation } from "../../../engine";
import type { Vars } from "../../../constants";

/** Round to 4 decimals — the emit quantization the densify ΔE proof measures. */
export const round = (n: number): number => Math.round(n * 1e4) / 1e4;

// ── Color leaf helpers ────────────────────────────────────────────────────────

const isFinalColor = (value: unknown): value is AnyColor =>
    value != null &&
    typeof value === "object" &&
    typeof (value as { space?: unknown }).space === "string" &&
    Array.isArray((value as { channels?: unknown }).channels) &&
    "alpha" in value;

const isCssValue = (value: unknown): value is CssValue => {
    if (value === null || typeof value !== "object") return false;
    const kind = (value as { kind?: unknown }).kind;
    return kind === "scalar" || kind === "call" || kind === "list";
};

const colorIn = (value: CssValue): AnyColor | undefined => {
    if (value.kind === "scalar") {
        return value.payload.type === "color" ? value.payload.value : undefined;
    }
    const children = value.kind === "call" ? value.args : value.items;
    for (const child of children) {
        const color = colorIn(child);
        if (color !== undefined) return color;
    }
    return undefined;
};

/** Narrow a structural Value 4 CSS node to one carrying a final color leaf. */
export const isColorUnit = (value: unknown): value is CssValue =>
    isCssValue(value) && colorIn(value) !== undefined;

/** A declared structural color node → its immutable Value 4 final color. */
const toColor = (value: CssValue): AnyColor => {
    const color = colorIn(value);
    if (color === undefined || !isFinalColor(color)) {
        throw new TypeError("Compiled color slot does not contain a Value 4 final color.");
    }
    return color;
};

const toOklab = (color: AnyColor): Color<"oklab"> => {
    const converted = convertColor(color, "oklab");
    if (!converted.ok) {
        throw new TypeError(`Value 4 color conversion failed: ${converted.error.code}.`);
    }
    return converted.value;
};

/** A final color's raw OKLab `[L, a, b]` coordinates. */
const rawOklab = (color: AnyColor): [number, number, number] => {
    const converted = toOklab(color);
    const [l, a, b] = converted.channels;
    if (typeof l !== "number" || typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("OKLab densification requires numeric channels.");
    }
    return [l, a, b];
};

/** A `Color` → its CSS `oklab(L a b)` string (denormalized to the CSS domain). */
const colorToOklabCSS = (c: AnyColor): string => {
    const converted = toOklab(c);
    const [L, a, b] = rawOklab(converted);
    const alpha = converted.alpha === 1 ? "" : ` / ${converted.alpha}`;
    return `oklab(${round(L)} ${round(a)} ${round(b)}${alpha})`;
};

/**
 * EN-c (S.F3) — a declared color `CssValue` → its `oklab(L a b)` CSS literal.
 * The entry emitter canonicalizes color ENDPOINTS to `oklab()` so the CSS
 * transition interpolates in kf's default perceptual space NATIVELY — CSS Color 4
 * interpolates non-legacy colors in Oklab by default, so an entry ships kf's
 * perceptual default with NO densify + ZERO intermediate stops. This is the
 * `perceptual-oklab` refusal INVERTED to a FEATURE on the transition surface (a
 * two-endpoint transition, unlike a `@keyframes` sRGB fill, needs no ΔE proof).
 */
export const colorUnitToOklabCSS = (vu: CssValue): string =>
    colorToOklabCSS(toColor(vu));

/** ΔE-OK between two Colors (the perceptual distance the densify proof reads). */
const colorDeltaE = (c1: AnyColor, c2: AnyColor): number => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return Math.hypot(L2 - L1, a2 - a1, b2 - b1);
};

/** A `Color` from a raw oklab `[L, a, b]` tuple (the inverse of `rawOklab`). */
const fromRawOklab = (L: number, a: number, b: number): Color<"oklab"> => {
    const result = oklab(L, a, b);
    if (!result.ok) {
        throw new TypeError(`Value 4 OKLab construction failed: ${result.error.code}.`);
    }
    return result.value;
};

/**
 * The browser's piecewise-linear `oklab()` midpoint of two emitted stops — a
 * plain per-channel average in the oklab space the browser interpolates the
 * `@keyframes` color in (CSS Color 4: an `oklab()` `@keyframes` fill is a
 * straight channel lerp). The densify ΔE proof compares THIS against kf's
 * perceptual lerp at the same global t.
 */
const channelMidpoint = (c1: AnyColor, c2: AnyColor): Color<"oklab"> => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return fromRawOklab((L1 + L2) / 2, (a1 + a2) / 2, (b1 + b2) / 2);
};

// ── Template color access ─────────────────────────────────────────────────────

/** A `0%`/`50%` selector CssValue → its numeric percent. */
const percentOf = (start: KeyframeSelector): number => {
    if (start.kind === "percent") return start.value * 100;
    throw new TypeError(
        `Cannot densify named keyframe selector "${start.name}" without a bound timeline.`,
    );
};

/**
 * The declared color CssValue for a flat property `key` at stop `i`, or
 * `undefined` (a color is one carrier — the single `unit === "color"` leaf).
 */
const colorValueAt = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    key: string,
): AnyColor | undefined => {
    const value = (animation.parsedVars[i] ?? {})[key];
    return value === undefined ? undefined : colorIn(value);
};

const sampleRamp = (
    from: AnyColor,
    to: AnyColor,
    count: number,
    space: "oklab" | "oklch",
    hue?: HueInterpolationMethod,
): AnyColor[] => {
    const ramp: AnyColor[] = [];
    for (let index = 0; index < count; index++) {
        const progress = count === 1 ? 0 : index / (count - 1);
        const mixed = mixColors(from, to, progress, {
            space,
            ...(hue === undefined ? {} : { hue }),
        });
        if (!mixed.ok) {
            throw new TypeError(`Value 4 color interpolation failed: ${mixed.error.code}.`);
        }
        ramp.push(mixed.value);
    }
    return ramp;
};

// ── CC-2 the densify (the ship-vs-refuse decision) ────────────────────────────

/**
 * The densify result (EN-b, S.B3 — return contract CHANGED). NO LONGER a finished
 * color-ONLY `@keyframes` block (`{ block }`) — instead the RAW per-percentage
 * color declarations (`byPct`) + the CHANGING color `keys`. The whole-block swap
 * dropped every non-color property (`opacity`/`transform`) on a mixed track (P2-2
 * F5); `compileChild` now threads these into a percentage-keyed MERGE
 * (`densifiedKeyframesBlock`) WITH the declared non-color projection. `keys` also
 * lets EN-b preserve STATIC (unchanging) colors (not in `keys` → ride the verbatim
 * declared projection), which the whole-block swap could not distinguish.
 */
type DensifyResult =
    | { byPct: Map<number, string[]>; keys: string[] }
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
        if (colorToOklabCSS(a) === colorToOklabCSS(b)) {
            stops.push({ pct: pStart, css: colorToOklabCSS(a) });
            continue;
        }
        const fromColor = a;
        const toColor_ = b;
        const ramp = sampleRamp(fromColor, toColor_, stopCount, space, hueOpt.hueMethod);
        for (let s = 0; s < ramp.length; s++) {
            const t = s / (ramp.length - 1);
            const pct = pStart + (pEnd - pStart) * t;
            stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) });
        }
        // ── THE ΔE PROOF (the ship-vs-refuse decision) ──────────────────────
        // S.B3 S4 (a18 F4) — the 1024-sample REFERENCE ramp is LOOP-INVARIANT over
        // the midpoint scan (it depends only on the from/to color pair + space),
        // so hoist it ONCE per declared stop-pair instead of re-sampling per `s`
        // (~15× fewer samples at the default 16-stop densify). REPLAY-EQUALITY-
        // VERIFIED: the sampled values are byte-identical, only the sample COUNT
        // drops — the emitted stops + worstDelta are unchanged.
        const kfRefRamp = sampleRamp(fromColor, toColor_, 1024, space, hueOpt.hueMethod);
        for (let s = 0; s + 1 < ramp.length; s++) {
            const tMid = (s + 0.5) / (ramp.length - 1);
            const kfMid = kfRefRamp[Math.round(tMid * 1023)]!;
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
            stops.push({ pct: lastPct, css: colorToOklabCSS(lastColor) });
        }
    }
    return { cssProp, stops, worstDelta };
}

/**
 * CC-2 — the densified `@keyframes` block for an animation carrying one OR MORE
 * changing color tracks. For each changing color key, and each ADJACENT declared
 * stop pair where it changes, bake N `oklab()` stops sampled from Value 4
 * `mixColors` at evenly-spaced percentages, so the
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
 * EN-b (S.B3, P2-2 F5) — return contract CHANGED. Returns the RAW per-percentage
 * color declarations (`{ byPct, keys }`) when EVERY changing color key ships under
 * ΔE-ε — NOT a finished color-ONLY `@keyframes` block. `compileChild` threads
 * `byPct` into a percentage-keyed MERGE ({@link format.densifiedKeyframesBlock})
 * WITH the declared NON-color projection, so a mixed `opacity+transform+color`
 * track no longer compiles to a color-only artifact (the whole-block swap dropped
 * every non-color property, ⚠ replay-inequality on the SHIPPED surface). `{
 * refused: true, delta }` when ANY key drifts past the threshold (the worst-case
 * key); `null` when no color densify applies (the caller emits the verbatim
 * declared block — exact when there is no color interpolation). The dead `name`
 * param is EXCISED (§5.2 cleanup — the merge, not this producer, owns block
 * assembly now).
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
    n: number,
    epsilon: number,
): DensifyResult {
    // Collect color keys whose track CHANGES across the template.
    const colorKeys: string[] = [];
    const keySeen = new Set<string>();
    for (let i = 0; i + 1 < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const [key, value] of Object.entries(declared)) {
            if (keySeen.has(key)) continue;
            if (!isColorUnit(value)) continue;
            const a = colorValueAt(animation, i, key);
            const b = colorValueAt(animation, i + 1, key);
            if (a && b && colorToOklabCSS(a) !== colorToOklabCSS(b)) {
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
    // key, then by percentage within each key's pass). Returned RAW (EN-b): the
    // caller's `densifiedKeyframesBlock` merges these WITH the declared non-color
    // decls per percentage and owns the final stop ordering.
    const byPct = new Map<number, string[]>();
    for (const key of colorKeys) {
        const traced = densifyKey(animation, key, stopCount, space, hueOpt);
        worstDelta = Math.max(worstDelta, traced.worstDelta);
        for (const { pct, css } of traced.stops) {
            let decls = byPct.get(pct);
            if (!decls) {
                decls = [];
                byPct.set(pct, decls);
            }
            decls.push(`${traced.cssProp}: ${css};`);
        }
    }

    if (worstDelta > epsilon) {
        return { refused: true, delta: worstDelta };
    }

    // EN-b — return the raw per-percentage color declarations + the CHANGING
    // color keys (the caller merges them WITH the declared non-color projection).
    return { byPct, keys: colorKeys };
}
