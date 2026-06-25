// ─────────────────────────────────────────────────────────────────────────────
// The MorphSVG scene's shape library (Q.WC4 S3). A curated ring of SVG `d`
// strings the morph interpolates BETWEEN — each authored in the SAME
// `0 0 VIEW VIEW` user space so a morph between any two reads cleanly on the
// stage. The morph is `fromMorphSVG(shape[i], shape[i+1])`: sample both at a
// uniform arc-length count, pair the points, lerp the (x, y) pairs across `t`.
//
// The shapes are deliberately of DIFFERING command count / topology (a 3-vertex
// triangle, a 4-vertex square, a 5-point star, a smooth 4-cubic blob) — the
// morph's uniform arc-length resampling is exactly what makes a triangle→star
// morph engine-valid despite the mismatched vertex counts (the O.W6 floor).
// ─────────────────────────────────────────────────────────────────────────────

/** The author/stage coordinate space — a square viewBox the shapes are drawn in. */
export const VIEW = 200;

/** One named shape the morph ring travels through. */
export interface MorphShape {
    id: string;
    label: string;
    /** The SVG path `d` string, in the `0 0 VIEW VIEW` user space. */
    d: string;
}

const C = VIEW / 2; // 100 — the shape centre.
const R = VIEW * 0.42; // 84 — the shape "radius" (kept off the stage edge).

/** A regular polygon `d` (n vertices), rotated so a vertex points up. */
const polygon = (n: number, radius = R): string => {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = C + radius * Math.cos(a);
        const y = C + radius * Math.sin(a);
        pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
};

/** An n-point star `d` (alternating outer/inner radius). */
const star = (points: number, outer = R, inner = R * 0.45): string => {
    const pts: string[] = [];
    for (let i = 0; i < points * 2; i++) {
        const a = -Math.PI / 2 + (i / (points * 2)) * Math.PI * 2;
        const radius = i % 2 === 0 ? outer : inner;
        const x = C + radius * Math.cos(a);
        const y = C + radius * Math.sin(a);
        pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
};

/** A smooth, lobed blob `d` (four cubic segments around the centre) — the one
 *  curved member, so the morph reads as straight-edges⇄curves, not just
 *  vertex-shuffling. */
const blob = (): string => {
    const r = R * 0.96;
    const k = r * 0.62; // the cubic control reach (a soft, organic lobe).
    const top = `${C} ${C - r}`;
    const right = `${C + r} ${C}`;
    const bottom = `${C} ${C + r * 0.82}`;
    const left = `${C - r} ${C}`;
    return (
        `M ${top} ` +
        `C ${C + k} ${C - r}, ${C + r} ${C - k}, ${right} ` +
        `C ${C + r} ${C + k}, ${C + k * 0.8} ${C + r * 0.82}, ${bottom} ` +
        `C ${C - k * 0.8} ${C + r * 0.82}, ${C - r} ${C + k}, ${left} ` +
        `C ${C - r} ${C - k}, ${C - k} ${C - r}, ${top} Z`
    );
};

/**
 * The morph ring — the scene cycles `shape[i]` → `shape[(i + 1) % len]`. A
 * triangle, square, five-point star, and a smooth blob: enough topological
 * variety that every adjacent morph visibly re-shapes the body (the
 * mid-`t`-distinct observable the scene gate asserts).
 */
export const MORPH_SHAPES: MorphShape[] = [
    { id: "triangle", label: "Triangle", d: polygon(3) },
    { id: "square", label: "Square", d: polygon(4) },
    { id: "star", label: "Star", d: star(5) },
    { id: "blob", label: "Blob", d: blob() },
];
