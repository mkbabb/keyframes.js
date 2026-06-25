/**
 * scroll/range.ts — the `animation-range` → [0,1] progress mapping (K.W9,
 * carved off `scene.ts` in R.W2b).
 *
 * kf owns TIME: value.js emits the range phases/offsets VERBATIM (`"40%"` NOT
 * resolved to px); this module turns the parsed `AnimationRangeValue` into the
 * [start,end] scroll-extent fractions the `ScrollScene` driver maps a raw scroll
 * position over. The phase-default placements + the offset-within-phase origin
 * shift are the driver-side fill of the division-of-labour law.
 *
 * value.js-free at runtime — it references the grammar TYPES only (erased under
 * verbatimModuleSyntax). The static value.js edge lives in `./grammar`.
 */
import { PHASE_FRACTIONS as SELECTOR_PHASE_FRACTIONS } from "../internal/scroll-phases";
import type {
    AnimationRangeValue,
    RangeBoundary,
    RangePhase,
} from "@mkbabb/value.js";

/**
 * The named phases of a view-progress timeline, in scroll order, each mapping to
 * a fraction of the subject's view-progress range [0,1]. `entry` spans the
 * subject entering the scrollport (0 → ~0.25), `cover` the fully-in-view band,
 * `exit` the subject leaving — the CSS `<timeline-range-name>` semantics, the
 * conventional default placements a driver fills when the author omits an offset
 * (the division-of-labour law: value.js leaves the offset to the driver). These
 * are the DEFAULT fractions for an omitted offset; an explicit `offset` overrides.
 *
 * The four selector-valid phase spans (`entry`/`cover`/`contain`/`exit`) are the
 * shared `internal/scroll-phases.ts` table (R.W1 — the BOOK duplication with
 * `compile/frame-compiler.ts` dissolved); this driver layers the non-selector
 * `normal`/`*-crossing` phases on top.
 */
const PHASE_FRACTIONS: Record<RangePhase, { start: number; end: number }> = {
    entry: SELECTOR_PHASE_FRACTIONS.entry!,
    cover: SELECTOR_PHASE_FRACTIONS.cover!,
    contain: SELECTOR_PHASE_FRACTIONS.contain!,
    exit: SELECTOR_PHASE_FRACTIONS.exit!,
    normal: { start: 0, end: 1 },
    "entry-crossing": { start: 0, end: 0.25 },
    "exit-crossing": { start: 0.75, end: 1 },
};

/**
 * Parse a `<length-percentage>` offset token VALUE.js emitted VERBATIM into a
 * [0,1] fraction. A `%` is its own fraction (`"40%"` → 0.4); a bare/`px` length
 * cannot be resolved without the live scroll extent and is left to the caller's
 * `sceneExtent` (returned as `null` so the phase default is used). The driver
 * owns this resolution (TIME) — value.js never pre-resolves it (VALUE).
 */
function offsetToFraction(offset: string | undefined): number | null {
    if (offset == null) return null;
    const trimmed = offset.trim();
    if (trimmed.endsWith("%")) {
        const n = Number.parseFloat(trimmed.slice(0, -1));
        return Number.isFinite(n) ? n / 100 : null;
    }
    // A bare/px length needs the live scroll extent — the driver resolves it
    // from `sceneExtent` at sample time; here it is "not a self-contained
    // fraction", so fall back to the phase default.
    return null;
}

/**
 * Resolve ONE `animation-range` boundary to a [0,1] fraction of the scene's
 * scroll extent. `offset` (if a self-contained `%`) wins; else the phase's
 * default placement; else the supplied fallback (0 for start, 1 for end).
 */
function boundaryFraction(
    boundary: RangeBoundary | undefined,
    fallback: number,
): number {
    if (boundary == null) return fallback;
    const explicit = offsetToFraction(boundary.offset);
    if (explicit != null) {
        // The phase shifts the offset's origin: `entry 50%` is 50% THROUGH the
        // entry band, not 50% of the whole timeline. When a phase is named, the
        // offset is interpreted within the phase's span.
        if (boundary.phase != null && boundary.phase !== "normal") {
            const span = PHASE_FRACTIONS[boundary.phase];
            return span.start + explicit * (span.end - span.start);
        }
        return explicit;
    }
    if (boundary.phase != null) {
        return PHASE_FRACTIONS[boundary.phase].start;
    }
    return fallback;
}

/**
 * The resolved [start,end] scroll-extent fractions for a parsed
 * `animation-range`. The driver maps a raw scroll position `p ∈ [0,1]` over the
 * scene's extent into local progress `(p − start)/(end − start)`, clamped.
 */
export interface ResolvedRange {
    start: number;
    end: number;
}

/**
 * Resolve a parsed `AnimationRangeValue` (or `undefined` → the whole [0,1]
 * timeline) into [start,end] extent fractions. The driver-side fill of the
 * division-of-labour law: value.js emits the phases/offsets verbatim, kf turns
 * them into the TIME mapping.
 */
export function resolveRange(
    range: AnimationRangeValue | undefined,
): ResolvedRange {
    if (range == null) return { start: 0, end: 1 };
    const start = boundaryFraction(range.start, 0);
    const end = boundaryFraction(range.end, 1);
    // Guard a degenerate/inverted range — the driver needs a positive span.
    return end > start ? { start, end } : { start: 0, end: 1 };
}
