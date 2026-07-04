/**
 * The author `offset-path` geometry for the MotionPath demo scene (F.W12.S3;
 * H.W12.S6 / I3 — made EDITABLE, the F4 elevation).
 *
 * A self-crossing loop authored in a square `0 0 VIEW VIEW` viewBox. ONE `d`
 * string drives BOTH the SVG guide `<path>` (the visible dashed track) and the
 * traveller's CSS `offset-path: path('…')` (the geometry the browser resolves
 * positions from) — so the guide and the traversal can never drift.
 *
 * keyframes.js parses NONE of this — the browser owns the path → position
 * resolution; the engine only sweeps the scalar `offset-distance` (F.W12.S1).
 *
 * ── THE SINGLE SOURCE (H.W12.S6 / I3 / proof:motion-path-editable)
 * The path is no longer a frozen `d` literal: it is a list of {@link PathPoint}s
 * (anchors + explicit cubic control points). {@link buildPathD} compiles them to
 * the ONE `d` string both consumers re-read in lockstep when a control handle
 * moves. {@link DEFAULT_POINTS} reproduces the original figure exactly — the
 * compiler expands the former `S` (smooth-cubic) shorthands into the equivalent
 * explicit `C` cubics (same curve, every control point now independently
 * draggable), so the un-dragged path is pixel-identical to the former const.
 * {@link LEGACY_PATH_D} is the geometry witness.
 */

/** The square viewBox side the path is authored in (user units). */
export const VIEW = 400;

/**
 * One editable path point in user (viewBox) units. `kind` distinguishes the
 * draggable handle's role:
 *   • `anchor`  — a point ON the path (a node the curve passes through);
 *   • `control` — a cubic control point (off the path; shapes a segment).
 * `id` is the stable drag key; `cmd` tags which path command the point belongs
 * to (for the compiler) — the compiler walks points in array order.
 */
export interface PathPoint {
    id: string;
    kind: "anchor" | "control";
    x: number;
    y: number;
}

/**
 * The editable control net for the default figure-loop. Walking the points:
 *   M (anchor a0)
 *   C (control c0, control c1) → (anchor a1)
 *   C (control c2, control c3) → (anchor a2)
 *   C (control c4, control c5) → (anchor a0, the close)
 * The original used two `S` (smooth-cubic) shorthands whose first control point
 * is the reflection of the previous one; the editable net makes ALL six control
 * points explicit (the reflected points written out), so every handle is
 * independently draggable. `buildPathD(DEFAULT_POINTS)` equals the original
 * literal (see {@link LEGACY_PATH_D}).
 */
export const DEFAULT_POINTS: readonly PathPoint[] = [
    { id: "a0", kind: "anchor", x: 60, y: 200 },
    { id: "c0", kind: "control", x: 60, y: 80 },
    { id: "c1", kind: "control", x: 200, y: 80 },
    { id: "a1", kind: "anchor", x: 200, y: 200 },
    // S 340 320, 340 200 → the reflected first control of the prior C is
    // (200,200) + ((200,200) − (200,80)) = (200,320).
    { id: "c2", kind: "control", x: 200, y: 320 },
    { id: "c3", kind: "control", x: 340, y: 320 },
    { id: "a2", kind: "anchor", x: 340, y: 200 },
    // S 200 60, 60 200 → the reflected first control of the prior C is
    // (340,200) + ((340,200) − (340,320)) = (340,80).
    { id: "c4", kind: "control", x: 340, y: 80 },
    { id: "c5", kind: "control", x: 200, y: 60 },
] as const;

/**
 * The original frozen `d` (pre-H.W12) in its `S`-shorthand form. Kept ONLY as
 * the geometry witness: `buildPathD(DEFAULT_POINTS)` traces the SAME curve (the
 * `S` controls expanded to explicit `C` controls), so the editable refactor
 * moved NO pixels at rest. Not consumed by the scene.
 */
const LEGACY_PATH_D =
    "M 60 200 C 60 80, 200 80, 200 200 S 340 320, 340 200 S 200 60, 60 200 Z";

/** Round to a stable precision so the emitted `d` is clean to copy/paste. */
const r = (n: number): number => Math.round(n * 100) / 100;

/**
 * Compile the editable control net to the ONE `offset-path`/guide `d` string.
 * The net is [anchor, (control, control, anchor)×N], closed with `Z` back to the
 * first anchor — three explicit cubic segments for the figure loop. This is the
 * single source: a handle drag mutates a point, this re-emits `d`, and BOTH the
 * guide `<path>` and the traveller's `offset-path` re-read it (no drift).
 */
export function buildPathD(points: readonly PathPoint[]): string {
    if (points.length < 4) return "";
    const p = points;
    const seg = (i: number) =>
        `C ${r(p[i]!.x)} ${r(p[i]!.y)}, ${r(p[i + 1]!.x)} ${r(p[i + 1]!.y)}, ${r(p[i + 2]!.x)} ${r(p[i + 2]!.y)}`;
    // a0 ; C c0 c1 a1 ; C c2 c3 a2 ; C c4 c5 (back to a0) Z
    return [
        `M ${r(p[0]!.x)} ${r(p[0]!.y)}`,
        seg(1), // c0 c1 a1
        seg(4), // c2 c3 a2
        `C ${r(p[7]!.x)} ${r(p[7]!.y)}, ${r(p[8]!.x)} ${r(p[8]!.y)}, ${r(p[0]!.x)} ${r(p[0]!.y)}`,
        "Z",
    ].join(" ");
}

/**
 * The default `d` — the editable net compiled at rest. Equal to
 * {@link LEGACY_PATH_D} by construction (the isomorphism the scene relies on so
 * the un-dragged path is pixel-identical to the former const).
 */
export const PATH_D = buildPathD(DEFAULT_POINTS);

/**
 * THE square-viewBox coupling, asserted in ONE place (H.W12.S4 / I11 /
 * proof:no-brittle-selector). Both projections in the scene — the traveller's
 * nearest-point-on-path search AND the control-handle drag — map client px to
 * SVG user units. That mapping is UNIFORM on both axes ONLY because the stage is
 * square (`.mp-stage { aspect-ratio: 1 }`) and the guide fills it with the
 * square viewBox `0 0 VIEW VIEW`. This helper is the SINGLE home of that scale,
 * so a future non-square stage cannot silently mis-project in two hand-rolled
 * copies: it would break HERE, visibly, at one site.
 *
 * `rect` is the stage's bounding box (square by the `aspect-ratio: 1` invariant;
 * a defensive `min(width,height)` keeps a sub-pixel rounding asymmetry from
 * skewing the mapping). Returns the pointer in user units, or `null` when the
 * rect is degenerate (un-laid-out) so callers fall back cleanly.
 */
export function clientToUserUnits(
    rect: { left: number; top: number; width: number; height: number },
    clientX: number,
    clientY: number,
): { x: number; y: number } | null {
    if (rect.width <= 0 || rect.height <= 0) return null;
    // INVARIANT: the stage is square — one scale governs both axes. We read the
    // shorter side so a fractional layout asymmetry never biases one axis.
    const side = Math.min(rect.width, rect.height);
    return {
        x: ((clientX - rect.left) / side) * VIEW,
        y: ((clientY - rect.top) / side) * VIEW,
    };
}

/**
 * THE TRAVELLER-SCALE FIX (S.G2 S1 / fold row 68). The SVG guide `<path>` rides a
 * `0 0 VIEW VIEW` viewBox scaled to fill the stage (`width/height: 100%`), so the
 * guide auto-scales to the RENDERED stage size. The traveller is a plain absolute
 * `<div>` whose CSS `offset-path: path('…')` is resolved in STAGE PIXELS, not
 * viewBox units — so an UNSCALED author `d` (authored in 0..VIEW user units)
 * detaches the traveller from the guide on any stage narrower than `VIEW` px
 * (~400px): the creature escapes the plate at the mobile 375px width (the defect).
 *
 * The cure keeps ONE author `d` (the copy artifact + the guide stay author-unit —
 * `copyablePath` re-reads the unscaled source) and scales ONLY the traveller's
 * live `offset-path` to the stage: `scale = stageSidePx / VIEW`. `buildPathD`
 * emits absolute `M`/`C`/`Z` with numeric coordinates ONLY, so a uniform multiply
 * of every numeric token scales the whole figure exactly (command letters +
 * separators pass through; `Z` carries no number). Re-run on a ResizeObserver so
 * the traveller tracks the guide across every stage resize (the rendered-rect
 * oracle: traveller ⊂ stage at 375px).
 */
export function scalePathD(d: string, scale: number): string {
    if (!Number.isFinite(scale) || scale <= 0 || scale === 1) return d;
    return d.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi, (token) => {
        const scaled = parseFloat(token) * scale;
        // Match buildPathD's 2-dp rounding so the emitted path stays clean.
        return String(Math.round(scaled * 100) / 100);
    });
}
