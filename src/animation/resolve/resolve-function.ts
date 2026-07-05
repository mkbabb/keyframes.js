/**
 * resolve/resolve-function.ts — the `@function` CALL-inlining (Q.WB2, carved off
 * `resolve/index.ts` in R.W2b).
 *
 * Lower a registered `@function` CALL (`--ident(args)`) to its concrete value
 * (CSS Functions & Mixins L1). The descriptor REGISTRY is threaded onto
 * `ctx.functions` (collected via value.js `extractFunctions`); the lowering is
 * bind → coerce → substitute → evaluate. The EVALUATE step recurses the shared
 * node resolver, injected as `resolveNode` to break the mutual recursion with the
 * core dispatch (`resolve/index.ts`). HEAVY (value.js `coerceToSyntax`/`parseCSSValue`).
 */
import {
    coerceToSyntax,
    FunctionValue,
    parseCSSValue,
    ValueUnit,
    type CustomFunctionParameter,
} from "@mkbabb/value.js";
import { DROP, type ResolveContext, type Resolved } from "./env";

/**
 * S.C4/S2 (owner rulings 5+6, the value.js-2.0.0 consume-edge) — the R.W3 §2C
 * recovery apparatus is DELETED. value.js 2.0.x fixed the `@function` param
 * grammar at the source (KF-1: whitespace-split name/`<css-type>`, the default
 * at the first depth-0 string-safe top-level colon; `type→syntax`,
 * `defaultValue→default`), so `CustomFunctionParameter` arrives CLEAN and is
 * threaded DIRECTLY — `.name`/`.syntax`/`.default` reads, no shim, no version
 * assertion (the S7 lifecycle completed: upstream fix → consume → delete).
 */

/** The injected core node resolver (the recursion seam — `resolve/index.ts`). */
export type ResolveNode = (
    node: ValueUnit | FunctionValue,
    ctx: ResolveContext,
) => Resolved<ValueUnit | FunctionValue>;

/**
 * Coerce ONE bound call-arg against the param's registered `<syntax>` (the CSS
 * Functions & Mixins L1 typed-arg coercion). value.js exposes
 * `coerceToSyntax(valueText, syntax)` on the resolve path EXACTLY for this consume
 * (inv-16 — kf consumes the validator, never re-authors a parallel checker).
 *
 * Returns the coerced node when the arg satisfies the syntax; otherwise the
 * re-parsed `default` (the spec fallback); otherwise `DROP` (a mismatched
 * arg with NO default is a guaranteed-invalid call — never a NaN substitution).
 * When the param declares NO `<syntax>` (an untyped param), the arg passes
 * through as-is (presence-validate-only — there is nothing to coerce against).
 *
 * R.W3 §2C (FAIL-EXPLICIT): when the default re-parse throws (value.js 1.2.0 bug —
 * the default was mis-assigned to `type`), push a `CUSTOM_FN_ARG_DROP` diagnostic
 * instead of silently absorbing the drop. The `diagnostics` channel is optional;
 * its presence is checked before pushing.
 */
const coerceArg = (
    arg: ValueUnit | FunctionValue,
    param: CustomFunctionParameter,
    diagnostics: ResolveContext["diagnostics"],
): Resolved<ValueUnit | FunctionValue> => {
    if (param.syntax === undefined) return arg;
    const coerced = coerceToSyntax(String(arg), param.syntax);
    if (coerced !== null) return coerced;
    // Type mismatch → the param default (re-parsed), never a spliced-in garbage
    // arg that would lerp to NaN. No default → guaranteed-invalid → DROP.
    if (param.default === undefined) return DROP;
    try {
        return parseCSSValue(param.default);
    } catch (err) {
        // FAIL-EXPLICIT: a default the author wrote that does not parse is a
        // surfaced absorption, never a silent drop (the generic arm — the
        // 1.2.0 mis-assignment arm retired with the S2 consume).
        diagnostics?.push({
            code: "CUSTOM_FN_ARG_DROP",
            property: param.name,
            message: `--fn() arg coercion: default for ${param.name} failed to parse (${String(err)})`,
        });
        return DROP;
    }
};

/**
 * Whether a `var(--p)` leaf references the param `ident`. value.js parses a
 * `var(--x)` body into `ValueUnit(value: "--x", unit: "var")`, and a
 * `var(--x, fallback)` into `ValueUnit(value: "--x, fallback", unit: "var")` —
 * so the match is "the leading dashed-ident (before any comma) equals `ident`".
 */
const isVarRef = (node: ValueUnit | FunctionValue, ident: string): boolean => {
    if (!(node instanceof ValueUnit) || node.unit !== "var") return false;
    const head = String(node.value).split(",", 1)[0]?.trim();
    return head === ident;
};

/**
 * Substitute every `var(--param)` leaf in a `result` node tree with its
 * bound-and-coerced value, returning a NEW tree (the descriptor's `result` is
 * shared across every call site, so the rewrite must not mutate it). A node that
 * is a `var()` ref to a bound param becomes a CLONE of the bound value; a
 * `var()` to an UNbound name is left intact; a `FunctionValue` recurses.
 */
const substituteParams = (
    node: ValueUnit | FunctionValue,
    binding: Map<string, ValueUnit | FunctionValue>,
): ValueUnit | FunctionValue => {
    if (node instanceof ValueUnit) {
        if (node.unit === "var") {
            for (const [ident, value] of binding) {
                if (isVarRef(node, ident)) return value.clone();
            }
        }
        return node;
    }
    const out = node.values.map((child) => substituteParams(child, binding));
    return new FunctionValue(node.name, out);
};

/**
 * Lower a registered `@function` CALL (`--ident(args)`) to its concrete value
 * (Q.WB2 — the CSS Functions & Mixins L1 call-inlining). The lowering: bind →
 * coerce → substitute → evaluate.
 *   - BIND each positional arg to the descriptor's parameters; a MISSING
 *     positional takes the param's `default` (re-parsed); a SURPLUS arg → DROP.
 *   - COERCE each bound arg through value.js's `coerceToSyntax` against the param's
 *     registered `<syntax>` (a mismatch falls back to the default; no default → DROP).
 *   - SUBSTITUTE each `var(--param)` in the descriptor's `result` with its bound value.
 *   - EVALUATE: recurse the injected `resolveNode` over the substituted result so a
 *     nested `calc()`/`if()`/`--fn()` lowers too.
 *
 * Cycle-guarded by `ctx.seen`: the function name is pushed before recursing into
 * its `result` and popped after; a self-referential `@function` hits the guard at
 * FIRST re-entry and DROPs (guaranteed-invalid), never blowing the stack.
 */
export const resolveFunctionCall = (
    node: FunctionValue,
    ctx: ResolveContext,
    resolveNode: ResolveNode,
): Resolved<ValueUnit | FunctionValue> => {
    // Cycle-guard: a self-reference (or a mutual cycle) DROPs at FIRST re-entry
    // — tighter than (and independent of) the MAX_RESOLVE_DEPTH ceiling.
    if (ctx.seen.has(node.name)) return DROP;

    const desc = ctx.functions.get(node.name);
    if (desc === undefined || desc.result === undefined) {
        // Registered name but no result expression — nothing to inline. DROP
        // (a guaranteed-invalid `@function` with no body).
        return DROP;
    }

    const params = desc.parameters ?? [];
    const args = node.values;

    // A SURPLUS arg (more args than params) is a guaranteed-invalid call shape.
    if (args.length > params.length) return DROP;

    // BIND + COERCE each param positionally.
    const binding = new Map<string, ValueUnit | FunctionValue>();
    for (let i = 0; i < params.length; i++) {
        const param = params[i]!;
        const arg = args[i];
        let bound: Resolved<ValueUnit | FunctionValue>;
        if (arg === undefined) {
            // MISSING positional → the param default (re-parsed). No default →
            // guaranteed-invalid call → DROP.
            if (param.default === undefined) return DROP;
            try {
                bound = parseCSSValue(param.default);
            } catch (err) {
                // FAIL-EXPLICIT (the generic arm — the version-bug arm retired
                // with the S2 consume).
                ctx.diagnostics?.push({
                    code: "CUSTOM_FN_ARG_DROP",
                    property: param.name,
                    message:
                        `--fn() missing-positional default for ${param.name} ` +
                        `failed to parse (${String(err)})`,
                });
                return DROP;
            }
        } else {
            bound = coerceArg(arg, param, ctx.diagnostics);
        }
        if (bound === DROP) return DROP;
        binding.set(param.name, bound);
    }

    // SUBSTITUTE var(--param) refs into a CLONE of the shared result expression.
    const result = desc.result.clone();
    const substituted = result.map((n) => substituteParams(n, binding));

    // EVALUATE: recurse so a nested calc()/if()/--fn() inside lowers too,
    // cycle-guarded by `seen` (push name → recurse → pop). A `result` is a
    // ValueArray (possibly multi-node); resolve each node, dropping any DROP.
    ctx.seen.add(node.name);
    const out: Array<ValueUnit | FunctionValue> = [];
    for (const n of substituted) {
        const r = resolveNode(n, { ...ctx, depth: ctx.depth + 1 });
        if (r === DROP) continue;
        out.push(r);
    }
    ctx.seen.delete(node.name);

    // A result that resolved to NOTHING is guaranteed-invalid → DROP. A single
    // node returns bare; a multi-node `result` collapses to its first concrete
    // node (the @function single-value contract — `result:` is one value,
    // value.js may slot a leading whitespace leaf).
    if (out.length === 0) return DROP;
    return out[0]!;
};
