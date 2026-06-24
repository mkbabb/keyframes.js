/**
 * `resolve-values.ts` (P.W13 — the emerging-CSS lowering pass).
 *
 * ONE recursive rewriter that lowers the ELEMENT-INDEPENDENT emerging-CSS
 * features value.js PARSES VERBATIM but the platform does not (yet) animate,
 * down to concrete animatable values AT COMPILE TIME — the `springTimingFunction`
 * precedent generalized: the engine already computes a value the platform lacks
 * (a spring `linear()`); this module makes `if(supports/media)` and `spring()`
 * resolve in EVERY browser, the library leading the platform.
 *
 * The seam (the gestalt — ONE pass, invoked at the element-INDEPENDENT call
 * site): between `resolveKeyframes` (`adapter.ts`) and `FrameCompiler.parse →
 * parseAndFlattenObject` (`utils.ts`), at flatten time. The rewriter returns the
 * SAME node types (`ValueArray | FunctionValue | ValueUnit`), so frame-compile +
 * interpolation run EXACTLY as today (zero hot-path change) — the frame pair just
 * holds two CONCRETE values where it used to hold an unresolved `FunctionValue`.
 *
 * Phase split by element-dependence (the full-loop RE-SCOPE, ledger line 353):
 *   - Phase 1 (NOW, here): `if(supports(...))` / `if(media(...))` + `spring()`.
 *     These resolve with ZERO target context (`CSS.supports` / `matchMedia` /
 *     the kf physics) — `resolveKeyframes(input: string | Stylesheet)` has no
 *     element at flatten time, and these need none.
 *   - Phase 2 (deferred, a typed seam below): `if(style(--p))`, `sibling-index()`,
 *     `sibling-count()` — read the resolved target, so they run post-`setTargets`.
 *   - value.js-P-gated (a typed seam below): the `@function` CALL-inlining —
 *     value.js's generic producer drops a dashed-function call's args today, so
 *     the call site does not parse; the descriptor REGISTRY is threaded now
 *     (`ResolveContext.functions`) so the arm lands greenable the moment value.js
 *     publishes the call-parse arm.
 *
 * `ctx.env` is threaded by INJECTION exactly as `ScrollTimeline` injects
 * `getScrollY`/`getViewportHeight` (`timeline.ts`), and defaults to SSR-safe
 * no-ops (`supports → false`, `matchMedia → {matches:false}`) so a server compile
 * picks the else-branch deterministically. HEAVY (it imports value.js
 * `FunctionValue`/`ValueUnit`/`parseCSSValue`) — reached only behind
 * `loadAnimationEngine()`.
 */
import {
    coerceToSyntax,
    FunctionValue,
    parseCSSValue,
    ValueArray,
    ValueUnit,
    type CustomFunctionDescriptor,
    type CustomFunctionParameter,
} from "@mkbabb/value.js";
import { springTimingFunction } from "./springTimingFunction";
import type { Easing } from "./constants";

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
 * call-inlining that CONSUMES it is value.js-P-gated (see {@link resolveValues}'s
 * dashed-function seam). `seen` + `depth` are the cycle-guard the recursive
 * rewriter carries (a self-referential `@function`, a pathological nesting).
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
}

/** The deepest the recursive rewriter descends before bailing (cycle-guard). */
const MAX_RESOLVE_DEPTH = 32;

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
): ResolveContext => ({
    functions,
    env: { ...defaultResolveEnv(), ...env },
    seen: new Set<string>(),
    depth: 0,
});

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

/** CSS spring physics (`mass`, `stiffness`, `damping`, `velocity`) → the kf
 * `(response, dampingFraction)` surface. kf OWNS validation + defaults-fill:
 * value.js parses `spring(...)` via its GENERIC function producer (no validation,
 * no defaults), so the algebra + the `1/100/10/0` fill live HERE. */
export interface SpringCssOptions {
    response: number;
    dampingFraction: number;
    initialVelocity: number;
}

/** The CSS `spring()` defaults (WebKit-canonical: `mass 1 / stiffness 100 /
 * damping 10 / velocity 0`), filled by kf because the generic value.js producer
 * fills none. */
const SPRING_DEFAULTS = { mass: 1, stiffness: 100, damping: 10, velocity: 0 };

/**
 * `spring(mass stiffness damping velocity)` → `{ response, dampingFraction,
 * initialVelocity }` by the standard 2nd-order-ODE algebra kf already uses
 * (`spring.ts`: `x'' + 2ζω₀x' + ω₀²x = ω₀²·target`, `ω₀ = 2π/response`,
 * `ζ = dampingFraction`):
 *
 *   ω₀ = √(k/m)  ⟹  response = 2π/ω₀ = 2π·√(m/k)
 *   ζ  = c / (2·√(k·m))  =  dampingFraction
 *   v₀ passes straight through to `SpringProgress.initialVelocity`.
 *
 * kf OWNS validation + the defaults-fill: omitted positionals take
 * `SPRING_DEFAULTS`; `mass > 0` and `stiffness > 0` are required (a
 * non-positive value falls back to the default rather than producing a NaN
 * curve), `damping ≥ 0`. The settle horizon is fixed at the kf default
 * (`response·4`, via `springTimingFunction`) — a deliberate self-consistent
 * choice, NOT WebKit native-parity (CSS `spring()` carries no duration, so the
 * normalized curve shape depends entirely on the horizon — native parity is
 * unattainable as a gate assertion).
 */
export const springCssToOptions = (
    args: readonly number[],
): SpringCssOptions => {
    const pos = (i: number, fallback: number): number => {
        const v = args[i];
        return typeof v === "number" && Number.isFinite(v) ? v : fallback;
    };
    let mass = pos(0, SPRING_DEFAULTS.mass);
    let stiffness = pos(1, SPRING_DEFAULTS.stiffness);
    let damping = pos(2, SPRING_DEFAULTS.damping);
    const velocity = pos(3, SPRING_DEFAULTS.velocity);

    // Defaults-fill on the physically-invalid edges (kf-owned — the generic
    // value.js producer provides none). A non-positive mass/stiffness would
    // make ω₀ NaN/∞; clamp them to the canonical defaults rather than emit a
    // dead curve.
    if (!(mass > 0)) mass = SPRING_DEFAULTS.mass;
    if (!(stiffness > 0)) stiffness = SPRING_DEFAULTS.stiffness;
    if (!(damping >= 0)) damping = SPRING_DEFAULTS.damping;

    const response = 2 * Math.PI * Math.sqrt(mass / stiffness);
    const dampingFraction = damping / (2 * Math.sqrt(stiffness * mass));
    return { response, dampingFraction, initialVelocity: velocity };
};

/**
 * Resolve a parsed `spring(...)` `FunctionValue` to a typed {@link Easing} via
 * `springCssToOptions` → the existing `springTimingFunction` (kf already owns the
 * physics + the `linear()` twin). The timing-function-position consumer — the
 * keyframe-value-position rewriter ({@link resolveValues}) lowers a bare
 * `spring()` leaf to its settled-position value, but a `spring()` is genuinely an
 * EASING, so the natural home is timing-function resolution.
 *
 * NOTE: the `getTimingFunction` (`utils.ts`) `SPRING_PAREN` branch that wires
 * this into per-keyframe `animation-timing-function` strings is the utils-lane
 * seam; this helper is the kf-owned core both call sites consume.
 */
export const resolveSpringTiming = (fn: FunctionValue): Easing => {
    const args = fn.values.map((v) =>
        v instanceof ValueUnit ? Number(v.value) : NaN,
    );
    const { response, dampingFraction } = springCssToOptions(args);
    return springTimingFunction({ response, dampingFraction });
};

/**
 * Extract the inner argument string of a single-function condition leaf:
 * `supports(color: lch(0 0 0))` → `color: lch(0 0 0)`. value.js parses the
 * condition VERBATIM as an opaque string `ValueUnit`; kf re-parses it with
 * value.js's OWN `parseCSSValue` (no hand-rolled cond parser) to read the
 * function name, then slices the inner query to hand to `CSS.supports` /
 * `matchMedia`. Returns `undefined` for anything that is not a single
 * `name(...)` form.
 */
const splitCondition = (
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
        // Bare keyword or non-`name(...)` shape — re-parse to see if value.js
        // produced a structured function (defensive; `parseCSSValue` round-trips
        // `supports(...)`/`media(...)`), else treat as an unmatched condition.
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
 * unit:"string")` — NOT a typed color/length. Lowered into a keyframe value, that
 * string leaf would interpolate against the OTHER endpoint as a raw string, not
 * the perceptual color/numeric lerp the concrete value gets. So the resolved
 * branch is re-parsed through value.js's own `parseCSSValue` (the same producer
 * the rest of the pipeline uses), turning `"red"` → `rgb(255 0 0)` (a `color`
 * unit) — exactly the node a direct `color: red` keyframe would have carried.
 * A leaf that is already typed (a numeric/length/color unit) re-parses to an
 * equal node; a parse miss leaves the original leaf intact.
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
 * The dashed-ident + the registered `<syntax>` of an `@function` parameter,
 * normalized off the value.js `CustomFunctionParameter` shape. value.js 1.2.0's
 * `extractFunctions` does NOT cleanly split the typed-param grammar: it hands
 * `@function --f(--x <length>: 0px)` back as `{ name: "--x <length>", type:
 * "0px" }` — the `<syntax>` glued onto `name`, the DEFAULT mis-landed on `type`.
 * kf does NOT re-author value.js's `@function` grammar (inv-16); it READS the
 * descriptor value.js produced and splits the dashed-ident (the leading
 * `--token`) from the trailing `<syntax>` already present on `name`, and reads
 * the default from whichever field carries it (`defaultValue` in a clean build,
 * `type` in the 1.2.0 build). The `<syntax>` is handed VERBATIM to value.js's
 * own `coerceToSyntax` — no kf-local syntax checker.
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
 * `var()` to an UNbound name is left intact (its own `var()` fallback / the
 * downstream computed-unit pass owns it); a `FunctionValue` recurses into its
 * children.
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
 * (Q.WB2 — the CSS Functions & Mixins L1 call-inlining). The descriptor REGISTRY
 * is threaded onto `ctx.functions` (collected via value.js `extractFunctions`);
 * value.js 1.2.0 now PARSES the dashed call into `FunctionValue("--ident",
 * [arg0, …])`, so the call reaches here as a structured node.
 *
 * The lowering: bind → coerce → substitute → evaluate.
 *   - BIND each positional arg to the descriptor's parameters; a MISSING
 *     positional takes the param's `defaultValue` (re-parsed); a SURPLUS arg
 *     (more args than params) is a guaranteed-invalid call shape → {@link DROP}.
 *   - COERCE each bound arg through value.js's `coerceToSyntax` against the
 *     param's registered `<syntax>` (a mismatch falls back to the default; no
 *     default → DROP) — never a NaN-bearing substitution.
 *   - SUBSTITUTE each `var(--param)` in the descriptor's `result` with its bound
 *     value (a node rewrite over a CLONE of the shared `result`).
 *   - EVALUATE: recurse `resolveNode` over the substituted result so a nested
 *     `calc()` / `if()` / another `--fn()` lowers too.
 *
 * Cycle-guarded by `ctx.seen`: the function name is pushed before recursing into
 * its `result` and popped after; a self-referential `@function` (`--a` calls
 * `--a`) hits the guard at FIRST re-entry and DROPs (guaranteed-invalid), never
 * recursing to the depth ceiling and never blowing the stack.
 */
const resolveFunctionCall = (
    node: FunctionValue,
    ctx: ResolveContext,
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
    // node returns bare; a multi-node result wraps in a FunctionValue-free
    // sequence is not representable as a single node, so a multi-node `result`
    // collapses to its first concrete node (the @function single-value contract
    // — `result:` is one value, value.js may slot a leading whitespace leaf).
    if (out.length === 0) return DROP;
    return out[0]!;
};

/**
 * Resolve a parsed `if(...)` `FunctionValue`. value.js produces the common
 * 2-branch shape `if(<cond>, <value>, <else>)` as `FunctionValue("if",
 * [condUnit, valueUnit, elseUnit])` (the condition + consequent, then the else
 * consequent). First-true wins; `else` is the fallback. A guaranteed-invalid
 * `if()` (no matching branch, no else) → {@link DROP}. If the condition is
 * Phase-2 (`style(--p)`, undecidable here), the `if()` is returned UNCHANGED so
 * the element-aware second pass can finish it.
 *
 * value.js's `if()` producer is lossy for >2 clauses today (it collapses 3
 * clauses to first-consequent + else, dropping the middle) — the common 2-branch
 * case ships NOW; multi-branch is a value.js follow-up.
 */
const resolveIf = (
    fn: FunctionValue,
    ctx: ResolveContext,
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
 * Resolve a single NODE (a `ValueUnit` leaf or a `FunctionValue`). A leaf is
 * returned as-is (already concrete). A `FunctionValue` dispatches on `.name`:
 * `if` → {@link resolveIf}; `spring` is handled at the timing-function seam (left
 * intact as a keyframe value — a bare `spring()` keyframe value is degenerate;
 * the gate exercises spring via {@link resolveSpringTiming}); a dashed
 * `@function` call is the value.js-P-gated seam (registry threaded, call-parse
 * pending); everything else recurses into its children.
 */
const resolveNode = (
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
        return resolveIf(node, { ...ctx, depth: ctx.depth + 1 });
    }

    // Q.WB1 — the Phase-2 element-aware `sibling-index()`/`sibling-count()` arm.
    // value.js parses them as a bare `FunctionValue(name, [])` (zero args). When
    // the element-populated env is present (the SECOND pass, post-`setTargets`),
    // resolve to an integer-position `ValueUnit` (unitless number, exactly the
    // node a direct `2` keyframe value would carry). When the env field is ABSENT
    // (Phase 1, no element), the node is returned UNCHANGED — the second pass
    // finishes it (the same deferred posture `style(--p)` holds in Phase 1).
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

    // Q.WB2 — the dashed-function `@function` CALL-inlining arm (now LIVE on the
    // value.js 1.2.0 dashed-call parse). The descriptor REGISTRY is threaded
    // (`ctx.functions`, collected via value.js `extractFunctions`); value.js 1.2.0
    // PARSES the dashed call into `FunctionValue("--ident", [args])`, so the call
    // reaches here as a structured node. `resolveFunctionCall` binds params →
    // coerces each arg through value.js's `coerceToSyntax` → substitutes into the
    // descriptor's `result` → recurses (nested `calc`/`if`/`--fn` lowered),
    // cycle-guarded by `ctx.seen` (self-reference → DROP at first re-entry).
    if (node.name.startsWith("--") && ctx.functions.has(node.name)) {
        return resolveFunctionCall(node, ctx);
    }

    // A non-lowered function (calc, color-mix, scale, …) — recurse into its
    // children so a nested `if()`/`spring()` inside is still resolved, then
    // rebuild the FunctionValue with the resolved children. A child that DROPs
    // is omitted (it cannot be represented as a function arg).
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
 * Whether an `if()` `FunctionValue`'s condition is a `style(...)` form — the
 * Phase-2 element-aware condition (`if(style(--p))` / `if(style(--p: v))`). The
 * condition is the FIRST `if()` value, parsed VERBATIM as an opaque
 * `ValueUnit("style(--p)", "string")` (value.js does not structure the
 * condition), so the sniff re-reads its function name via {@link splitCondition}.
 */
const isStyleConditionIf = (node: FunctionValue): boolean => {
    if (node.name !== "if") return false;
    const cond = node.values[0];
    if (cond === undefined) return false;
    const raw = String(cond instanceof ValueUnit ? cond.value : cond).trim();
    return splitCondition(raw)?.name === "style";
};

/**
 * Whether a declaration value CONTAINS a lowerable node, so the adapter only
 * pays the rewrite cost on the declarations that need it (the common
 * all-concrete keyframe is untouched). A cheap structural scan — no resolution,
 * no env.
 *
 * Q.WB1 widens this beyond the Phase-1 set (`if(...)`/`spring(...)`) to admit the
 * Phase-2 element-aware nodes — `sibling-index()`/`sibling-count()` and an `if()`
 * whose condition is a `style(...)` form — so a Phase-2-ONLY declaration (e.g.
 * `transform: translateX(calc(sibling-index() * 10px))`) enters the pass at all
 * (GAP 3, the precondition). The Phase-1 pass leaves these residual (it has no
 * element); the SECOND pass post-`setTargets` finishes them.
 */
export const hasResolvableValue = (value: unknown): boolean => {
    if (value instanceof FunctionValue) {
        if (value.name === "if" || value.name === "spring") return true;
        if (value.name === "sibling-index" || value.name === "sibling-count") {
            return true;
        }
        // Q.WB2 — a dashed-function CALL (`--ident(args)`, a `FunctionValue`
        // whose name is a `<dashed-ident>`) is the `@function` inlining arm. A
        // plain `var()` is a `ValueUnit` (unit `"var"`), NOT a `FunctionValue`,
        // so this admits ONLY the call form; the registry-membership check (which
        // needs `ctx`) lives in `resolveNode`.
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
 * form. A pure-Phase-1 declaration (`if(supports)`/`if(media)`/`spring()`, already
 * concrete after Phase 1) returns FALSE, so the SECOND pass (post-`setTargets`)
 * skips it entirely — zero second-pass cost on the common case, and the
 * double-resolution guard's gate (a Phase-1-concrete leaf is never re-walked
 * because its declaration has no Phase-2 node).
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
