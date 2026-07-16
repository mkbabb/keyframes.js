/**
 * resolve/ — the emerging-CSS lowering pass barrel (P.W13 / Q.WB1; thinned to a
 * pure re-export surface at S.B4 — a02 F3/F4, the last zone barrel that wore a
 * barrel's filename over 289L of core recursion).
 *
 * ONE recursive rewriter lowers the emerging-CSS features value.js PARSES
 * VERBATIM but the platform does not (yet) animate, down to concrete animatable
 * values AT COMPILE TIME. The zone's members:
 *   - `./core`         — the recursion (`resolveValues`/`hasResolvableValue`/
 *                        `hasPhase2Node`) + the internal `resolveNode` seam
 *   - `./spring-css`   — the CSS `spring()` → kf-Easing helpers (the
 *                        timing-function seam)
 *   - `./env`          — the injectable env + context (`makeResolveContext`,
 *                        the SSR-safe `defaultResolveEnv`, the `DROP` sentinel)
 *   - `./resolve-if`       — the `if()` condition resolution
 *   - `./resolve-function` — the `@function` CALL-inlining
 *   - `./element-resolve`  — the Phase-2 element-AWARE SECOND pass
 *
 * HEAVY (Value 4 structural `CssValue` calls/lists/scalars and CSS metadata) —
 * reached only behind `loadAnimationEngine()`.
 */
export type { ResolveEnv, ResolveContext } from "./env";
export {
    defaultResolveEnv,
    makeResolveContext,
    DROP,
    type Resolved,
} from "./env";
export { resolveValues, hasResolvableValue, hasPhase2Node } from "./core";
export {
    springCssToOptions,
    resolveSpringTiming,
    type SpringCssOptions,
} from "./spring-css";
export { resolveIf } from "./resolve-if";
