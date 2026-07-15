/**
 * resolve/resolve-if.ts — the `if()` condition resolution (P.W13 / Q.WB1, carved
 * off `resolve/index.ts` in R.W2b).
 *
 * Evaluate a parsed `if(<cond>, <value>, <else>)` against the injectable env:
 * `supports(...)` / `media(...)` resolve in Phase 1 (element-INDEPENDENT);
 * `style(--p)` is Phase-2 (element-aware) and is left UNRESOLVED in Phase 1 so
 * the second pass finishes it. The chosen consequent is re-parsed into its
 * CONCRETE typed node (`reparseLeaf`) so a lowered `if()` interpolates as the
 * color/numeric it denotes, not a raw string. The consequent recursion is the
 * injected `resolveNode` (the recursion seam with `resolve/index.ts`).
 */
import { FunctionValue, ValueUnit } from "@mkbabb/value.js/units";
import { parseCSSValue } from "@mkbabb/value.js/parsing";
import { DROP, type ResolveContext, type Resolved } from "./env";
import type { ResolveNode } from "./resolve-function";

/**
 * Extract the inner argument string of a single-function condition leaf:
 * `supports(color: lch(0 0 0))` → `color: lch(0 0 0)`. value.js parses the
 * condition VERBATIM as an opaque string `ValueUnit`; kf re-reads the function
 * name + slices the inner query to hand to `CSS.supports` / `matchMedia`. Returns
 * `undefined` for anything that is not a single `name(...)` form.
 */
export const splitCondition = (
    raw: string,
): { name: string; query: string } | undefined => {
    const open = raw.indexOf("(");
    if (open <= 0 || !raw.trimEnd().endsWith(")")) return undefined;
    const name = raw.slice(0, open).trim().toLowerCase();
    const query = raw.slice(open + 1, raw.lastIndexOf(")")).trim();
    if (!name || !query) return undefined;
    return { name, query };
};

/**
 * Evaluate ONE `if()` condition leaf against the env. `else` is always TRUE (the
 * fallback clause). `supports(...)` → `ctx.env.supports`; `media(...)` →
 * `ctx.env.matchMedia(...).matches`. `style(--p)` is Phase-2 (element-aware) and
 * returns `undefined` here so the NOW pass leaves the whole `if()` UNRESOLVED for
 * the second pass rather than guessing. An unrecognized condition → `false`.
 */
const evalCondition = (
    condUnit: ValueUnit | FunctionValue,
    ctx: ResolveContext,
): boolean | undefined => {
    const raw = String(
        condUnit instanceof ValueUnit ? condUnit.value : condUnit,
    ).trim();
    if (raw === "else" || raw === "") return true;

    const split = splitCondition(raw);
    if (!split) {
        // Bare keyword or non-`name(...)` shape — treat as an unmatched condition.
        return false;
    }
    const { name, query } = split;

    if (name === "supports") {
        return ctx.env.supports?.(query) ?? false;
    }
    if (name === "media") {
        return ctx.env.matchMedia?.(query)?.matches ?? false;
    }
    // `style(--p)` (and `style(--p: v)`) reads a RESOLVED custom-prop off the
    // element — Phase 2. When `ctx.env.customProps` is PRESENT (the element-aware
    // SECOND pass, post-`setTargets`), read the resolved prop and evaluate
    // presence/equality. When ABSENT (Phase 1, no element), return `undefined`
    // so the whole if() is left UNRESOLVED for the second pass — the existing
    // Phase-1 posture, unchanged.
    if (name === "style") {
        if (ctx.env.customProps === undefined) return undefined;
        return evalStyleCondition(query, ctx.env.customProps);
    }

    return false;
};

/**
 * Q.WB1 — evaluate a `style(...)` condition's inner query against the resolved
 * custom-prop reader (the Phase-2 element-aware branch). Two CSS forms:
 *   - `style(--p)` (PRESENCE) — true iff `--p` is a set custom-prop.
 *   - `style(--p: value)` (EQUALITY) — true iff the resolved `--p` equals
 *     `value` (whitespace-normalized comparison).
 * The `customProps` reader returns `undefined` for an unset prop (the S2
 * contract), so presence is a simple non-`undefined` test.
 */
const evalStyleCondition = (
    query: string,
    customProps: (name: string) => string | undefined,
): boolean => {
    const colon = query.indexOf(":");
    if (colon === -1) {
        // Presence form: `style(--p)`.
        const prop = query.trim();
        if (prop === "") return false;
        return customProps(prop) !== undefined;
    }
    // Equality form: `style(--p: value)`.
    const prop = query.slice(0, colon).trim();
    const expected = query.slice(colon + 1).trim();
    if (prop === "") return false;
    const actual = customProps(prop);
    if (actual === undefined) return false;
    // Whitespace-normalized compare (the resolved computed value may carry
    // different internal spacing than the authored literal).
    const norm = (s: string) => s.trim().replace(/\s+/g, " ");
    return norm(actual) === norm(expected);
};

/** Whether a node is an EMPTY-string leaf — value.js's padding for an absent
 * `if()` else slot (it always emits 3 `if()` values, filling a missing else with
 * `ValueUnit("")`). An empty leaf is "no value", never a real branch. */
const isEmptyLeaf = (node: ValueUnit | FunctionValue): boolean =>
    node instanceof ValueUnit && String(node.value).trim() === "";

/**
 * Re-parse a chosen `if()` consequent into its CONCRETE typed node. value.js
 * parses an `if()` consequent VERBATIM as an opaque `ValueUnit(value:"red",
 * unit:"string")` — NOT a typed color/length. So the resolved branch is re-parsed
 * through value.js's own `parseCSSValue`, turning `"red"` → `rgb(255 0 0)` (a
 * `color` unit) — exactly the node a direct `color: red` keyframe would carry. A
 * leaf already typed re-parses to an equal node; a parse miss leaves it intact.
 */
const reparseLeaf = (
    node: Resolved<ValueUnit | FunctionValue>,
): Resolved<ValueUnit | FunctionValue> => {
    if (node === DROP) return node;
    if (node instanceof ValueUnit && node.unit === "string") {
        try {
            return parseCSSValue(String(node.value));
        } catch {
            return node;
        }
    }
    return node;
};

/**
 * Resolve a parsed `if(...)` `FunctionValue`. value.js produces the common
 * 2-branch shape `if(<cond>, <value>, <else>)` as `FunctionValue("if",
 * [condUnit, valueUnit, elseUnit])`. First-true wins; `else` is the fallback. A
 * guaranteed-invalid `if()` (no matching branch, no else) → {@link DROP}. If the
 * condition is Phase-2 (`style(--p)`, undecidable here), the `if()` is returned
 * UNCHANGED so the element-aware second pass can finish it. The consequent
 * recursion is the injected `resolveNode`.
 *
 * value.js's `if()` producer is lossy for >2 clauses today (it collapses 3 clauses
 * to first-consequent + else); the common 2-branch case ships NOW.
 */
export const resolveIf = (
    fn: FunctionValue,
    ctx: ResolveContext,
    resolveNode: ResolveNode,
): Resolved<ValueUnit | FunctionValue> => {
    const vals = fn.values;
    // The 2-branch shape value.js emits: [cond, consequent, else?].
    const cond = vals[0];
    const consequent = vals[1];
    const elseVal = vals[2];

    if (cond === undefined || consequent === undefined) {
        // Malformed if() — guaranteed-invalid, drop the declaration.
        return DROP;
    }

    const decided = evalCondition(cond, ctx);
    if (decided === undefined) {
        // Phase-2 (style(--p)) — leave the if() intact for the element-aware
        // pass; do NOT guess a branch here.
        return fn;
    }
    if (decided) {
        return reparseLeaf(resolveNode(consequent, ctx));
    }
    // value.js ALWAYS emits a 3rd `if()` slot, padding a MISSING `else` with an
    // empty-string `ValueUnit("")`. So an "else present" test is "the 3rd slot is
    // a NON-EMPTY value", not merely "!== undefined".
    if (elseVal !== undefined && !isEmptyLeaf(elseVal)) {
        return reparseLeaf(resolveNode(elseVal, ctx));
    }
    // No matching branch, no else → guaranteed-invalid → DROP (NOT empty-string,
    // which would corrupt interpolation).
    return DROP;
};

/**
 * Whether an `if()` `FunctionValue`'s condition is a `style(...)` form — the
 * Phase-2 element-aware condition (`if(style(--p))` / `if(style(--p: v))`). The
 * condition is the FIRST `if()` value, parsed VERBATIM as an opaque
 * `ValueUnit("style(--p)", "string")`, so the sniff re-reads its function name
 * via {@link splitCondition}.
 */
export const isStyleConditionIf = (node: FunctionValue): boolean => {
    if (node.name !== "if") return false;
    const cond = node.values[0];
    if (cond === undefined) return false;
    const raw = String(cond instanceof ValueUnit ? cond.value : cond).trim();
    return splitCondition(raw)?.name === "style";
};
