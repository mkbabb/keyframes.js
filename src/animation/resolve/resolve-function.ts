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

/** The injected core node resolver (the recursion seam — `resolve/index.ts`). */
export type ResolveNode = (
    node: ValueUnit | FunctionValue,
    ctx: ResolveContext,
) => Resolved<ValueUnit | FunctionValue>;

/**
 * The dashed-ident + the registered `<syntax>` of an `@function` parameter,
 * normalized off the value.js `CustomFunctionParameter` shape. value.js 1.2.0's
 * `extractFunctions` does NOT cleanly split the typed-param grammar: it hands
 * `@function --f(--x <length>: 0px)` back as `{ name: "--x <length>", type:
 * "0px" }` — the `<syntax>` glued onto `name`, the DEFAULT mis-landed on `type`.
 * kf does NOT re-author value.js's `@function` grammar (inv-16); it READS the
 * descriptor value.js produced and splits the dashed-ident from the trailing
 * `<syntax>`, and reads the default from whichever field carries it.
 */
interface NormalizedParam {
    /** The `<dashed-ident>` the call binds positionally (e.g. `--x`). */
    ident: string;
    /** The registered `<syntax>` string (e.g. `<length>`), or `undefined`. */
    syntax: string | undefined;
    /** The optional default value VERBATIM (e.g. `0px`), or `undefined`. */
    defaultValue: string | undefined;
}

/**
 * Normalize a `CustomFunctionParameter` into {@link NormalizedParam}. Splits the
 * value.js-glued `name` (`"--x <length>"`) into the dashed-ident + the `<syntax>`
 * tail, and recovers the default from `defaultValue` (a clean build) or `type`
 * (the 1.2.0 build mis-assigns the default there). A bare untyped param
 * (`{ name: "--x" }`) yields `{ ident: "--x", syntax: undefined, defaultValue }`.
 */
const normalizeParam = (param: CustomFunctionParameter): NormalizedParam => {
    const rawName = param.name.trim();
    // The dashed-ident is the leading `--token`; an optional `<syntax>` tail
    // (everything after the first whitespace) value.js glued onto `name`.
    const ws = rawName.search(/\s/);
    const ident = ws === -1 ? rawName : rawName.slice(0, ws);
    const nameTail = ws === -1 ? "" : rawName.slice(ws).trim();
    // A `<...>` syntax glued onto the name wins; else there is no declared syntax.
    const syntax =
        nameTail.startsWith("<") && nameTail.endsWith(">")
            ? nameTail
            : undefined;
    // The default lives on `defaultValue` (a clean value.js build) OR on `type`
    // (the 1.2.0 build mis-assigns the default-value string there). Prefer the
    // explicit `defaultValue`; fall back to `type` only when it is NOT itself a
    // `<syntax>` token (a `<length>` on `type` is a syntax, not a default).
    const fromType =
        param.type !== undefined &&
        !(param.type.startsWith("<") && param.type.endsWith(">"))
            ? param.type
            : undefined;
    const defaultValue = param.defaultValue ?? fromType;
    return { ident, syntax, defaultValue };
};

/**
 * Coerce ONE bound call-arg against the param's registered `<syntax>` (the CSS
 * Functions & Mixins L1 typed-arg coercion). value.js 1.2.0 exposes
 * `coerceToSyntax(valueText, syntax)` on the resolve path EXACTLY for this consume
 * (inv-16 — kf consumes the validator, never re-authors a parallel checker).
 *
 * Returns the coerced node when the arg satisfies the syntax; otherwise the
 * re-parsed `defaultValue` (the spec fallback); otherwise `DROP` (a mismatched
 * arg with NO default is a guaranteed-invalid call — never a NaN substitution).
 * When the param declares NO `<syntax>` (an untyped param), the arg passes
 * through as-is (presence-validate-only — there is nothing to coerce against).
 */
const coerceArg = (
    arg: ValueUnit | FunctionValue,
    param: NormalizedParam,
): Resolved<ValueUnit | FunctionValue> => {
    if (param.syntax === undefined) return arg;
    const coerced = coerceToSyntax(String(arg), param.syntax);
    if (coerced !== null) return coerced;
    // Type mismatch → the param default (re-parsed), never a spliced-in garbage
    // arg that would lerp to NaN. No default → guaranteed-invalid → DROP.
    if (param.defaultValue === undefined) return DROP;
    try {
        return parseCSSValue(param.defaultValue);
    } catch {
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
 *     positional takes the param's `defaultValue` (re-parsed); a SURPLUS arg → DROP.
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

    const params = (desc.parameters ?? []).map(normalizeParam);
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
            if (param.defaultValue === undefined) return DROP;
            try {
                bound = parseCSSValue(param.defaultValue);
            } catch {
                return DROP;
            }
        } else {
            bound = coerceArg(arg, param);
        }
        if (bound === DROP) return DROP;
        binding.set(param.ident, bound);
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
