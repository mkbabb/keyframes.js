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
    FunctionValue,
    parseCSSValue,
    ValueArray,
    ValueUnit,
    type CustomFunctionDescriptor,
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
    // element — Phase 2. The NOW pass cannot evaluate it (no element here), so
    // signal "undecidable in this pass" → the whole if() is left unresolved.
    if (name === "style") return undefined;

    return false;
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

    // The dashed-function `@function` CALL-inlining seam (value.js-P-gated). The
    // descriptor REGISTRY is threaded (`ctx.functions`), but value.js's generic
    // producer drops a `--ident(args)` call's args today (the call does not
    // parse → a bare `ValueUnit`, name undefined), so the call site never lands
    // here as a `FunctionValue("--ident", …)`. When value.js-P publishes the
    // call-parse arm + `extractFunctions`, this branch binds params → substitutes
    // → evaluates, cycle-guarded by `ctx.seen`. Left as a typed seam (inv-16: kf
    // does not block on the sibling; the registry is wired now).
    if (node.name.startsWith("--") && ctx.functions.has(node.name)) {
        // Registry present, call-parse pending — return UNCHANGED (no guess).
        // (When value.js-P lands: bind + substitute + evaluate here.)
        return node;
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
 * Whether a declaration value CONTAINS an element-independent lowerable node
 * (`if(...)` or `spring(...)`), so the adapter only pays the rewrite cost on the
 * declarations that need it (the common all-concrete keyframe is untouched). A
 * cheap structural scan — no resolution, no env.
 */
export const hasResolvableValue = (value: unknown): boolean => {
    if (value instanceof FunctionValue) {
        if (value.name === "if" || value.name === "spring") return true;
        return value.values.some((v) => hasResolvableValue(v));
    }
    if (value instanceof ValueArray) {
        return value.some((v) => hasResolvableValue(v));
    }
    return false;
};
