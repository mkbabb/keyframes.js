/**
 * resolve/core.ts — the emerging-CSS lowering RECURSION (S.B4 — carved off the
 * `resolve/index.ts` barrel so the barrel is a pure re-export surface like every
 * other zone; a02 F3/F4).
 *
 * ONE recursive rewriter that lowers the emerging-CSS features value.js PARSES
 * VERBATIM but the platform does not (yet) animate, down to concrete animatable
 * values AT COMPILE TIME. The seam is between `resolveKeyframes` (`compile/
 * adapter.ts`) and `FrameCompiler.parse → parseAndFlattenObject`, at flatten
 * time. The rewriter returns the SAME node types (`ValueArray | FunctionValue |
 * ValueUnit`), so frame-compile + interpolation run EXACTLY as today (zero
 * hot-path change).
 *
 * Phase split by element-dependence:
 *   - Phase 1 (this file's `resolveValues`): `if(supports/media)` +
 *     the `@function` call-inlining — resolve with ZERO target context.
 *   - Phase 2 (the element-aware second pass, `./element-resolve`):
 *     `if(style(--p))`, `sibling-index()`, `sibling-count()` — read the resolved
 *     target, run post-`setTargets` (gated by {@link hasPhase2Node}).
 *
 * The `resolveNode` injection seam is UNTOUCHED (a19 F9): the if/function helpers
 * take `resolveNode` (injected) to break the mutual recursion across the carved
 * `./resolve-if` / `./resolve-function` files; the `spring()` → Easing helpers
 * live beside it in `./spring-css` (the timing-function seam, not the value
 * rewriter).
 *
 * HEAVY (value.js `FunctionValue`/`ValueUnit`/`ValueArray`) — reached only behind
 * `loadAnimationEngine()`.
 */
import { FunctionValue, ValueArray, ValueUnit } from "@mkbabb/value.js";
import { DROP, type ResolveContext, type Resolved } from "./env";
import { resolveFunctionCall, type ResolveNode } from "./resolve-function";
import { isStyleConditionIf, resolveIf } from "./resolve-if";

/** The deepest the recursive rewriter descends before bailing (cycle-guard). */
const MAX_RESOLVE_DEPTH = 32;

/**
 * Resolve a single NODE (a `ValueUnit` leaf or a `FunctionValue`). A leaf is
 * returned as-is (already concrete). A `FunctionValue` dispatches on `.name`:
 * `if` → {@link resolveIf}; `spring` is handled at the timing-function seam (left
 * intact as a keyframe value); the Phase-2 `sibling-index()`/`sibling-count()`
 * arms resolve only when the element-aware env is present; a dashed `@function`
 * call lowers via {@link resolveFunctionCall}; everything else recurses into its
 * children. The if/function helpers take `resolveNode` (injected) to break the
 * mutual recursion across the carved files.
 */
const resolveNode: ResolveNode = (
    node: ValueUnit | FunctionValue,
    ctx: ResolveContext,
): Resolved<ValueUnit | FunctionValue> => {
    if (ctx.depth > MAX_RESOLVE_DEPTH) {
        // Cycle-guard ceiling — a pathological nesting/self-reference. Drop
        // rather than blow the stack (the guaranteed-invalid posture).
        return DROP;
    }
    if (node instanceof ValueUnit) return node;
    if (!(node instanceof FunctionValue)) return node;

    if (node.name === "if") {
        return resolveIf(node, { ...ctx, depth: ctx.depth + 1 }, resolveNode);
    }

    // Q.WB1 — the Phase-2 element-aware `sibling-index()`/`sibling-count()` arm.
    // value.js parses them as a bare `FunctionValue(name, [])` (zero args). When
    // the element-populated env is present (the SECOND pass, post-`setTargets`),
    // resolve to an integer-position `ValueUnit` (unitless number). When the env
    // field is ABSENT (Phase 1, no element), the node is returned UNCHANGED — the
    // second pass finishes it (the same deferred posture `style(--p)` holds).
    if (node.name === "sibling-index") {
        const fn = ctx.env.siblingIndex;
        if (fn === undefined) return node;
        return new ValueUnit(fn(), "");
    }
    if (node.name === "sibling-count") {
        const fn = ctx.env.siblingCount;
        if (fn === undefined) return node;
        return new ValueUnit(fn(), "");
    }

    // Q.WB2 — the dashed-function `@function` CALL-inlining arm (LIVE on the
    // value.js 1.2.0 dashed-call parse). The descriptor REGISTRY is threaded
    // (`ctx.functions`, via value.js `extractFunctions`); `resolveFunctionCall`
    // binds params → coerces each arg through value.js's `coerceToSyntax` →
    // substitutes into the descriptor's `result` → recurses (nested
    // `calc`/`if`/`--fn` lowered), cycle-guarded by `ctx.seen`.
    if (node.name.startsWith("--") && ctx.functions.has(node.name)) {
        return resolveFunctionCall(node, ctx, resolveNode);
    }

    // A non-lowered function (calc, color-mix, scale, …) — recurse into its
    // children so a nested `if()`/`spring()` inside is still resolved, then
    // rebuild the FunctionValue with the resolved children. A child that DROPs is
    // omitted (it cannot be represented as a function arg).
    const out: Array<ValueUnit | FunctionValue> = [];
    let changed = false;
    for (const child of node.values) {
        const r = resolveNode(child, { ...ctx, depth: ctx.depth + 1 });
        if (r === DROP) {
            changed = true;
            continue;
        }
        if (r !== child) changed = true;
        out.push(r);
    }
    if (!changed) return node;
    return new FunctionValue(node.name, out);
};

/**
 * The public entry: rewrite a keyframe declaration VALUE (a `ValueArray`, the
 * shape `decl.value` carries) by resolving every node. Each element that DROPs is
 * omitted; if EVERY element drops (or the array empties), the whole value is
 * {@link DROP} (the caller omits the declaration). Returns the SAME node type
 * (`ValueArray`) so the downstream flatten/compile is unchanged.
 *
 * Element-INDEPENDENT (Phase 1) ONLY — `ctx.env` carries no element; the
 * `style(--p)`/`sibling-*` cases are deferred to the post-`setTargets` pass.
 */
export const resolveValues = (
    value: ValueArray,
    ctx: ResolveContext,
): Resolved<ValueArray> => {
    const out: Array<ValueUnit | FunctionValue> = [];
    let changed = false;
    for (const node of value) {
        const r = resolveNode(node, ctx);
        if (r === DROP) {
            changed = true;
            continue;
        }
        if (r !== node) changed = true;
        out.push(r);
    }
    if (out.length === 0) return DROP;
    if (!changed) return value;
    return new ValueArray(...out);
};

/**
 * Whether a declaration value CONTAINS a lowerable node, so the adapter only pays
 * the rewrite cost on the declarations that need it (the common all-concrete
 * keyframe is untouched). A cheap structural scan — no resolution, no env.
 *
 * Q.WB1 widens this beyond the Phase-1 set (`if(...)`/`spring(...)`) to admit the
 * Phase-2 element-aware nodes — `sibling-index()`/`sibling-count()` and an `if()`
 * whose condition is a `style(...)` form — so a Phase-2-ONLY declaration enters
 * the pass at all (GAP 3). The Phase-1 pass leaves these residual; the SECOND pass
 * post-`setTargets` finishes them.
 */
export const hasResolvableValue = (value: unknown): boolean => {
    if (value instanceof FunctionValue) {
        if (value.name === "if" || value.name === "spring") return true;
        if (value.name === "sibling-index" || value.name === "sibling-count") {
            return true;
        }
        // Q.WB2 — a dashed-function CALL (`--ident(args)`, a `FunctionValue` whose
        // name is a `<dashed-ident>`) is the `@function` inlining arm. A plain
        // `var()` is a `ValueUnit` (unit `"var"`), NOT a `FunctionValue`, so this
        // admits ONLY the call form; the registry-membership check lives in
        // `resolveNode`.
        if (value.name.startsWith("--")) return true;
        return value.values.some((v) => hasResolvableValue(v));
    }
    if (value instanceof ValueArray) {
        return value.some((v) => hasResolvableValue(v));
    }
    return false;
};

/**
 * Q.WB1 — the Phase-2 SUBSET predicate (a sibling sniff of
 * {@link hasResolvableValue}): true iff the value carries an element-AWARE node
 * the FIRST pass deliberately left UNRESOLVED — a `sibling-index()`/
 * `sibling-count()` `FunctionValue`, OR an `if()` whose condition is a `style(...)`
 * form. A pure-Phase-1 declaration returns FALSE, so the SECOND pass skips it
 * entirely — zero second-pass cost on the common case, and the double-resolution
 * guard (a Phase-1-concrete leaf is never re-walked because its declaration has no
 * Phase-2 node).
 */
export const hasPhase2Node = (value: unknown): boolean => {
    if (value instanceof FunctionValue) {
        if (value.name === "sibling-index" || value.name === "sibling-count") {
            return true;
        }
        if (isStyleConditionIf(value)) return true;
        return value.values.some((v) => hasPhase2Node(v));
    }
    if (value instanceof ValueArray) {
        return value.some((v) => hasPhase2Node(v));
    }
    return false;
};
