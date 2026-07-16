/**
 * compile/easing/ — the FORWARD leg's easing sub-zone (U.C8; the owner's named
 * example carve). Two cohesive-but-distinct concerns behind one barrel:
 *
 *   - `easing-registry.ts` — the internal synchronous timing-function
 *     resolver (a callable / registry name / CSS `cubic-bezier()`/`steps()`/
 *     `linear()` literal → a callable `TimingFunction`). The value.js registry +
 *     CSS-parser edge.
 *   - `easing-option.ts` — `resolveEasingOption`, the heavy-surface easing-INPUT
 *     resolver (normalizes the four easing inputs to a typed `Easing`, attaching
 *     the faithful CSS twin). Rides the internal resolver.
 *
 * The two flat `easing-*` siblings that once sat in `compile/` root are grouped
 * here — the cure the owner named was the long-FLAT `compile/` directory, not the
 * files (G1: cohesion, not line count, decides). This barrel is the sub-zone's
 * single surface; the parent `compile/index.ts` re-exports the public names from
 * HERE, and value-narrowing consumers (`easing.ts`'s dynamic-import chunk-narrow;
 * the a18 "import the real module" discipline) still reach the individual files
 * directly.
 *
 * HEAVY (value.js-bearing) — reached only via `loadAnimationEngine()`.
 */
export { resolveEasingOption } from "./easing-option";
