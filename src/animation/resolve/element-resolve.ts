/**
 * `resolve/element-resolve.ts` — the emerging-CSS Phase-2 element-AWARE
 * resolution pass (Q.WB1), lifted off the `KeyframesAnimation` god-object
 * (R.W2 — lib-engine F-7) and RE-HOMED into the `resolve/` zone at S.B2 (a17 F5,
 * RULED): it coheres with the `resolve/` resolution engine (its full dependency
 * set — `resolveValues`/`makeResolveContext`/`hasPhase2Node`), NOT with the
 * engine's playback/interpolation concerns. It reaches the animation only through
 * the PUBLIC compiler/targets/parse surface (a TYPE-only edge to `../engine`), so
 * the engine→resolve direction is one-way (no runtime cycle). The FIRST pass
 * (Phase 1, at `resolveKeyframes`
 * flatten time) had no element and deliberately left the element-aware nodes
 * UNRESOLVED: `if(style(--p))` (a `style(...)`-condition `if()` `resolveIf`
 * returned intact), and the `sibling-index()`/`sibling-count()` `CssCall` nodes.
 * Once `setTargets` binds a target, this SECOND pass re-runs the SAME
 * `resolveValues` rewriter over the pre-flatten template snapshot against an
 * element-POPULATED env, then re-`parse()`s.
 *
 * This logic coheres with `resolve-values.ts` (its full resolution-engine
 * dependency set), not with the interpolation or playback concerns of the
 * animation class — so it lives here as a free function over the animation's
 * PUBLIC compiler/targets/parse surface, called from `setTargets` as a
 * one-line delegate.
 */
import { type CustomFunctionDescriptor } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import {
    DROP,
    hasPhase2Node,
    makeResolveContext,
    resolveValues,
    type ResolveEnv,
} from "../resolve";
import type { Vars } from "../constants";
import type { KeyframesAnimation } from "../engine/animation";
import type { CompiledAnimationFrame } from "../compile/compiled-frame";
import { bindInterpSlotTarget } from "../compile/interp-slot";

/**
 * Q.WB1 — the emerging-CSS Phase-2 SECOND resolution pass (the gestalt P.W13
 * designed: ONE rewriter, a SECOND lifecycle point — element-populated env,
 * SAME `ResolveContext` shape). Runs over the PRE-FLATTEN
 * `compiler.templateFrames[i].vars` snapshot (the Phase-1-resolved, unflattened
 * `Record<string, CssValue>` `parse()` re-flattens via
 * `parseAndFlattenObject`), so a Phase-1-resolved leaf — already a concrete
 * `CssValue` — is returned as-is by `resolveNode`, making the pass idempotent
 * over the Phase-1 result. Gated by `hasPhase2Node`: a declaration with NO
 * element-aware node is never re-resolved (zero second-pass cost).
 *
 * SSR-safe: with no bound target (or a target with no `parentElement`) the env
 * fields are OMITTED, so a residual node stays unresolved (never a throw on
 * `getComputedStyle(undefined)`) — the same posture Phase 1 holds for
 * `style(--p)` today.
 *
 * @returns `true` iff at least one template carried a Phase-2 node and the
 *   compiler was re-`parse()`d (so `setTargets` skips its fast propagate).
 */
export function resolveElementAwareValues<V extends Vars>(
    animation: KeyframesAnimation<V>,
): boolean {
    const templates = animation.templateFrames;
    // Gate: only run the element-aware pass when SOME template carries a
    // Phase-2 node — the common case (percent/from/to + concrete values, or a
    // pure-Phase-1 if(supports)/spring()) pays zero second-pass cost.
    let anyPhase2 = false;
    for (const frame of templates) {
        const vars = frame.vars as Record<string, unknown>;
        for (const key in vars) {
            if (hasPhase2Node(vars[key])) {
                anyPhase2 = true;
                break;
            }
        }
        if (anyPhase2) break;
    }
    if (!anyPhase2) return false;

    const env = buildElementAwareEnv(animation);
    // No element-populated env (SSR / no target) → leave the residual nodes
    // intact (idempotent, never a throw). Nothing to re-resolve.
    if (env === undefined) return false;

    // The SAME ResolveContext shape Phase 1 uses; the ONLY delta is the
    // element-populated env. The `@function` registry is irrelevant to the
    // Phase-2 arms (style/sibling-*), so an empty Map suffices.
    const ctx = makeResolveContext(
        new Map<string, CustomFunctionDescriptor>(),
        env,
    );

    let rewrote = false;
    for (const frame of templates) {
        const vars = frame.vars as Record<string, unknown>;
        for (const key in vars) {
            const value = vars[key];
            if (!isCssValue(value) || !hasPhase2Node(value)) {
                continue;
            }
            const resolved = resolveValues(value, ctx);
            if (resolved === DROP) {
                // Guaranteed-invalid (a style(--p) if() with no branch + no
                // else) → OMIT the declaration (the CSS guaranteed-invalid
                // rule), exactly as the Phase-1 adapter path does.
                delete vars[key];
                rewrote = true;
                continue;
            }
            if (resolved !== value) {
                vars[key] = resolved;
                rewrote = true;
            }
        }
    }

    if (!rewrote) return false;

    // Re-flatten/recompile from the now-Phase-2-resolved templates. The existing
    // `parse()` re-runs `parseAndFlattenObject` over the rewritten
    // `templateFrames[i].vars` AND binds the live targets (so computed-unit
    // resolution reads the box) — one re-`parse()` per `setTargets`, paid ONLY
    // on the Phase-2 path.
    animation.parse();
    return true;
}

/**
 * Bind the just-assigned `animation.targets` onto the compiled animation — the
 * body of `KeyframesAnimation.setTargets` (S.B2 — carved here so the class keeps
 * a thin delegate and the element-binding logic lives with the resolve zone it
 * belongs to). Runs the emerging-CSS Phase-2 element-AWARE resolution pass
 * ({@link resolveElementAwareValues}); if that did NOT re-parse (the common
 * all-concrete animation), directly rebinds only computed interpolation slots.
 * An empty target list clears their previous ownership and cache without
 * replacing compiled frames or authored sinks. Idempotent + SSR-safe. The
 * caller assigns `animation.targets` first.
 */
export function bindTargets<V extends Vars>(
    animation: KeyframesAnimation<V>,
): void {
    const rebuilt = resolveElementAwareValues(animation);
    if (rebuilt) return;
    const target = animation.targets[0];
    const frames = animation.frames as CompiledAnimationFrame<V>[];
    for (const frame of frames) {
        for (const value of Object.values(frame.interpVars)) {
            for (const slot of value.slots) bindInterpSlotTarget(slot, target);
        }
    }
}

const isCssValue = (value: unknown): value is CssValue =>
    value !== null &&
    typeof value === "object" &&
    "kind" in value &&
    ((value as { kind?: unknown }).kind === "scalar" ||
        (value as { kind?: unknown }).kind === "call" ||
        (value as { kind?: unknown }).kind === "list");

/**
 * Q.WB1 — build the element-AWARE {@link ResolveEnv} from the bound target (the
 * precondition for the Phase-2 second pass). SSR-safe: with no target / no
 * `parentElement`, the relevant field is OMITTED (not assigned), so the residual
 * node stays unresolved rather than throwing. Built ONCE per `setTargets` — the
 * pass is a compile-time lowering, never on the hot path.
 *
 * @returns the populated env, or `undefined` when no target is bound at all
 *   (the whole pass is skipped — nothing element-aware can resolve).
 */
function buildElementAwareEnv<V extends Vars>(
    animation: KeyframesAnimation<V>,
): ResolveEnv | undefined {
    const target = animation.targets[0];
    if (target == null) return undefined;
    // The custom-prop reader: prefer the COMPUTED value, fall back to the INLINE
    // `style.getPropertyValue` (jsdom does not resolve inline/registered custom
    // props into `getComputedStyle` reliably). Returns `undefined` for an unset
    // prop — the presence/equality contract `evalStyleCondition` consumes.
    //
    // R.W3 §2B (FAIL-EXPLICIT): `getComputedStyle` only throws for a null /
    // non-Element arg. Guard the argument with `instanceof Element` explicitly
    // instead of doing feature-detection-by-exception (the try/catch masked a
    // genuine detached-node / cross-origin throw as "prop unset"). A true throw
    // on a confirmed Element arg is not possible and is never masked.
    const env: ResolveEnv = {
        customProps: (name: string) => {
            let v = "";
            if (
                target instanceof Element &&
                typeof getComputedStyle === "function"
            ) {
                v = getComputedStyle(target).getPropertyValue(name).trim();
            }
            if (v === "") v = target.style.getPropertyValue(name).trim();
            return v === "" ? undefined : v;
        },
    };
    const parent = target.parentElement;
    if (parent != null) {
        // 1-based DOM position (per the CSS `sibling-index()` definition).
        env.siblingIndex = () =>
            Array.prototype.indexOf.call(parent.children, target) + 1;
        env.siblingCount = () => parent.children.length;
    }
    return env;
}
