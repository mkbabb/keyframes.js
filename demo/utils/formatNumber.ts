/**
 * The demo's one number formatter (K10, value.js §0hz.canon; C-10: few
 * significant digits, one shared formatter).
 *
 * - `digits` is the most decimals shown; trailing zeros are dropped ("0.5",
 *   never "0.50"), unless `fixed` keeps them for a live readout whose width
 *   must not move.
 * - Zero is never signed, and a negative takes the true minus (U+2212).
 * - `pad` reserves the sign's column on a non-negative value with a figure
 *   space (U+2007), so a live readout that crosses zero keeps its width
 *   without printing "+".
 */
export interface FormatNumberOptions {
    fixed?: boolean;
    pad?: boolean;
}

export function formatNumber(
    value: number,
    digits = 2,
    { fixed = false, pad = false }: FormatNumberOptions = {},
): string {
    if (!Number.isFinite(value)) return String(value);
    const scale = 10 ** digits;
    const rounded = Math.round(Math.abs(value) * scale) / scale;
    const negative = value < 0 && rounded !== 0;
    let text = rounded.toFixed(digits);
    if (!fixed && text.includes(".")) text = text.replace(/\.?0+$/, "");
    return `${negative ? "−" : pad ? " " : ""}${text}`;
}

/** A duration in seconds: "0.5 s", "0.35 s". */
export const formatSeconds = (seconds: number): string => `${formatNumber(seconds, 2)} s`;

/** A duration in milliseconds: whole, "260 ms". */
export const formatMs = (ms: number): string => `${formatNumber(ms, 0)} ms`;
