/**
 * internal/scroll-phases.ts — the FOUR keyframe-reachable scroll-range phase
 * spans, value.js-free (R.W1; lib-scroll-ingest F7 / lib-compile F5). The single
 * source of the named-phase default fractions, dissolving the BOOK duplication
 * between `scroll/scene.ts` (`PHASE_FRACTIONS`) and `compile/frame-compiler.ts`
 * (`NAMED_SELECTOR_PHASES`). These are the four phases reachable from the
 * keyframe-selector grammar (`entry`/`cover`/`contain`/`exit`); the
 * `normal`/`*-crossing` phases scroll/scene adds are not in the selector grammar
 * and are layered on there.
 */
export const PHASE_FRACTIONS: Record<string, { start: number; end: number }> = {
    entry: { start: 0, end: 0.25 },
    cover: { start: 0.25, end: 0.75 },
    contain: { start: 0.375, end: 0.625 },
    exit: { start: 0.75, end: 1 },
};
