/**
 * resolve/env.ts — the injectable resolution environment + context (P.W13 / Q.WB1,
 * carved off `resolve/index.ts` in R.W2b).
 *
 * `ctx.env` is threaded by INJECTION exactly as `ScrollTimeline` injects
 * `getScrollY`/`getViewportHeight`, and defaults to SSR-safe no-ops (`supports →
 * false`, `matchMedia → {matches:false}`) so a server compile picks the
 * else-branch deterministically. The recursive rewriter (`resolve/index.ts`)
 * threads a {@link ResolveContext} built by {@link makeResolveContext}.
 */
import type { CustomFunctionDescriptor } from "@mkbabb/value.js";

/**
 * The injectable environment a Phase-1 resolution evaluates against. Every field
 * is OPTIONAL with an SSR-safe default ({@link defaultResolveEnv}); a test injects
 * a deterministic `supports`/`matchMedia` (jsdom carries neither faithfully) the
 * way `ScrollTimeline` is handed a `getScrollY`. The Phase-2 element-aware fields
 * (`customProps`/`siblingIndex`/`siblingCount`) are typed here so the second-pass
 * call site (post-`setTargets`) threads the SAME context shape — ONE rewriter,
 * two lifecycle points, not two divergent context types.
 */
export interface ResolveEnv {
    /** `CSS.supports(query)` — the `if(supports(...))` evaluator. SSR → `false`. */
    supports?: (query: string) => boolean;
    /** `matchMedia(query)` — the `if(media(...))` evaluator. SSR → `{matches:false}`. */
    matchMedia?: (query: string) => { matches: boolean };
    /** Phase 2 — resolved custom-prop reader for `if(style(--p))` (element-aware). */
    customProps?: (name: string) => string | undefined;
    /** Phase 2 — 1-based DOM position for `sibling-index()` (element-aware). */
    siblingIndex?: () => number;
    /** Phase 2 — sibling total for `sibling-count()` (element-aware). */
    siblingCount?: () => number;
}

/**
 * The resolution context threaded from `adapter.ts`. `functions` is the
 * `@function` descriptor REGISTRY (populated NOW via value.js `extractFunctions`,
 * mirroring how `properties` is populated via `extractProperties`); the
 * call-inlining that CONSUMES it is value.js-P-gated. `seen` + `depth` are the
 * cycle-guard the recursive rewriter carries (a self-referential `@function`, a
 * pathological nesting).
 */
export interface ResolveContext {
    /** `@function` descriptor registry, keyed by dashed name (`--double`). */
    functions: Map<string, CustomFunctionDescriptor>;
    /** The injectable Phase-1 environment (SSR-safe defaults if omitted). */
    env: ResolveEnv;
    /** Cycle-guard: function-call names currently on the resolution stack. */
    seen: Set<string>;
    /** Recursion-depth ceiling guard (a pathological nesting bomb). */
    depth: number;
    /**
     * R.W3 §2C — optional structured diagnostics channel. When present,
     * the `@function` resolver pushes `CUSTOM_FN_ARG_DROP` rows for silent
     * DROP events (a value.js 1.2.0 bug — the arg default fails to re-parse)
     * so the absorption is citable rather than silent. Optional so callers
     * that don't need the channel (the Phase-2 element-aware pass,
     * `element-resolve.ts`) don't have to thread it.
     *
     * A structurally minimal push interface — the adapter's full `Diagnostic`
     * type (which imports this file) would create a circular dep; this shape
     * is assignment-compatible with `Diagnostic[]` (the adapter's channel is
     * the actual array, narrowed to its push-required fields here).
     */
    diagnostics?: Array<{ code: string; property?: string; message: string }>;
}

/**
 * SSR-safe environment defaults. `supports → false` and `matchMedia → no-match`
 * make a server compile (and a jsdom test with no injection) pick the
 * deterministic ELSE branch — never a thrown ReferenceError on an absent global,
 * never a non-deterministic outcome.
 */
export const defaultResolveEnv = (): Required<
    Pick<ResolveEnv, "supports" | "matchMedia">
> => {
    const hasCSS =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as { CSS?: { supports?: unknown } }).CSS
            ?.supports === "function";
    const hasMM =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as { matchMedia?: unknown }).matchMedia ===
            "function";
    return {
        supports: hasCSS
            ? (q: string) =>
                  (
                      globalThis as unknown as {
                          CSS: { supports: (q: string) => boolean };
                      }
                  ).CSS.supports(q)
            : () => false,
        matchMedia: hasMM
            ? (q: string) =>
                  (
                      globalThis as unknown as {
                          matchMedia: (q: string) => { matches: boolean };
                      }
                  ).matchMedia(q)
            : () => ({ matches: false }),
    };
};

/** Build a fresh {@link ResolveContext} with SSR-safe env defaults + the registry. */
export const makeResolveContext = (
    functions: Map<string, CustomFunctionDescriptor>,
    env?: ResolveEnv,
    diagnostics?: ResolveContext["diagnostics"],
): ResolveContext => {
    const ctx: ResolveContext = {
        functions,
        env: { ...defaultResolveEnv(), ...env },
        seen: new Set<string>(),
        depth: 0,
    };
    // R.W3 §2C: thread the diagnostics channel when provided (optional — callers
    // that don't need it, like the Phase-2 element-aware pass, omit it).
    // Under exactOptionalPropertyTypes we must NOT assign undefined to the
    // optional field — only set it when the caller supplied the channel.
    if (diagnostics !== undefined) ctx.diagnostics = diagnostics;
    return ctx;
};

/**
 * A sentinel the rewriter returns when a node RESOLVES-TO-NOTHING: a
 * guaranteed-invalid `if()` with no matching branch and no `else`. The CALLER
 * (the adapter's declaration loop) treats a `DROP` as "omit this declaration"
 * — the prior/initial value wins per the CSS guaranteed-invalid rule. Emitting an
 * empty-string `ValueUnit` would corrupt frame interpolation (it would lerp `''`),
 * so the DROP is a distinct, explicit outcome, NOT a value.
 */
export const DROP = Symbol("kf.resolve.drop");
export type Resolved<T> = T | typeof DROP;
