/**
 * compile/emit/view-transition.ts — S.F1 VT-c THE VIEW-TRANSITIONS EMITTER (p09).
 *
 * `compileToViewTransition` compiles a NAME-KEYED role spec to a PURE,
 * ZERO-RUNTIME CSS artifact over the `::view-transition-*` pseudo tree — the
 * round-trip engine pointed at the platform's native View Transitions. It is
 * `compileToCSS`'s SIBLING: it re-targets the SAME per-child `compileChild`
 * pipeline (VT-b's selector-factory seam) onto the old/new pseudos, byte-reusing
 * the `@keyframes` block + `animation` shorthand (springs → `linear()`, oklab
 * densify, the CC-3 refusals) the forward compile already produces.
 *
 * ── THE THREE EMISSION SURFACES (SF-2, p09 F2) ───────────────────────────────
 *   1. `old`/`new` get a FULL kf `@keyframes` block + `animation` shorthand on
 *      `::view-transition-old(name)` / `::view-transition-new(name)`.
 *   2. `::view-transition-group(name)` gets a TIMING-ONLY override — duration +
 *      timing-function, NEVER `animation-name`: the UA's dynamically-generated
 *      rect-morph keyframes ARE the free zero-runtime FLIP, and overriding
 *      `animation-name` there would forfeit it. MANDATORY-BY-DEFAULT: omitting
 *      the group emission ships the observed 250ms/ease temporal INCOHERENCE
 *      (the geometry morph lands 100ms before the cross-tracks settle — p09 run 1).
 *   3. a `class` cohort rides `::view-transition-*(.class)` for UNIFORM cohorts;
 *      staggered cohorts (materialized per-child delays) emit per-NAME rules.
 *
 * ── THE FOUR VT REFUSALS (SF-3, p09 F5) — atop the inherited CC-3 four ────────
 *   `vt-scroll-grammar`           — scrollOptions on a VT role (VT pseudos are
 *                                   time-driven; `animation-timeline` is undefined).
 *   `vt-element-scoped-computed`  — element-scoped `var()`/`cq*`: the pseudo tree
 *                                   hangs off the ROOT, so they don't reach it.
 *   `vt-snapshot-inapplicable`    — a layout/content property on a replaced-content
 *                                   snapshot (only transform/opacity/filter apply).
 *                                   REFUSE per property, never a silent drop.
 *   `vt-name-collision`           — two distinct spec keys collapsing to ONE CSS
 *                                   ident (the ≤1-element-per-name platform rule):
 *                                   a REFUSAL, not a silent rename.
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). ──────────────────────────────────────
 * Reached ONLY via `loadAnimationEngine()` + the `./engine` static mirror — never
 * the LIGHT barrel (its LIGHT twin is `orchestration/view-transition`'s dispatch).
 */
import { formatCSS, reverseCSSTime } from "@mkbabb/value.js/parsing";
import type { KeyframesAnimation } from "../../engine";
import type { AnimationOptions, Vars } from "../../constants";
// The emit-substrate helpers, imported from the real sibling FILES inside emit/
// (never the emit/ barrel — the barrel re-exports THIS file, so a barrel import
// would cycle; the same file-not-barrel idiom the easing carve proved).
import { compileChild } from "./backward";
import { cssIdent } from "./backward-walk";
import { declaredKeyframeBodyFor } from "./format";
import { serializeEasing } from "./easing-serialize";
import type { CompileChild } from "./backward-walk";
import type {
    CompileOptions,
    CompiledCSS,
} from "./backward";
import type { CompileRefusal, CompileRefusalReason } from "./refusal-probes";

// ── The role spec + options (p09 §4.1 API contract) ──────────────────────────

/**
 * The per-name VT role mapping (SF-1). A group/Sequence has NO old/new axis (the
 * group-as-primary reading is REJECTED), so the emitter's PRIMARY input is this
 * name-keyed role spec. `old`/`new` are the same `KeyframesAnimation`s
 * `compileToCSS` walks; `group` is timing-only by design.
 */
export type VTRoleSpec<V extends Vars = Vars> = {
    /** The outgoing snapshot's animation (`::view-transition-old(name)`). */
    old?: KeyframesAnimation<V>;
    /** The incoming snapshot's animation (`::view-transition-new(name)`). */
    new?: KeyframesAnimation<V>;
    /**
     * Timing-only for the group pseudo: duration + easing onto the UA geometry
     * morph (NEVER `animation-name`). A `KeyframesAnimation` contributes its
     * `options.duration`/`timingFunction`; a bare `{ duration, timingFunction }`
     * gives them directly. Omit → derived from `new ?? old` (the coherent default).
     */
    group?: Pick<AnimationOptions, "duration" | "timingFunction"> | KeyframesAnimation<V>;
    /** A `view-transition-class` cohort name — uniform cohorts ride one rule. */
    class?: string;
};

/** Options for {@link compileToViewTransition}, extending {@link CompileOptions}. */
export interface ViewTransitionCompileOptions extends CompileOptions {
    /** Typed same-doc VT — wraps every rule in `:root:active-view-transition-type(...)`. */
    types?: readonly string[];
    /** Prepend the cross-doc `@view-transition { navigation: auto }` preamble (opt-in). */
    crossDocument?: boolean;
    /** Append the PRM `animation: none` degrade block (default `true`). */
    reducedMotion?: boolean;
    /**
     * Emit the MANDATORY timing-only group pseudo (default `true`). Turning it
     * OFF ships the 250ms/ease temporal incoherence p09 observed — exposed only
     * so the born-RED gate's falsifiability clause can prove the omission REDs.
     */
    emitGroup?: boolean;
}

/** The four VT refusals atop the inherited CC-3 {@link CompileRefusalReason}. */
export type VTCompileRefusalReason =
    | CompileRefusalReason
    | "vt-scroll-grammar"
    | "vt-element-scoped-computed"
    | "vt-snapshot-inapplicable"
    | "vt-name-collision";

/** A VT refusal — the CC-3 shape widened to the VT reason union. */
export interface VTCompileRefusal extends Omit<CompileRefusal, "reason"> {
    reason: VTCompileRefusalReason;
}

/** The VT compile result — the artifact + the widened refusal report + the names. */
export interface CompiledViewTransitionCSS extends Omit<CompiledCSS, "refusals"> {
    /** One refusal per role that could not compile faithfully (CC-3 ∪ the VT four). */
    refusals: VTCompileRefusal[];
    /** The `view-transition-name` set the consumer assigns to its elements. */
    names: string[];
}

// ── Snapshot-applicability + computed-scope detection ────────────────────────

/**
 * The properties that ANIMATE on a replaced-content VT snapshot (old/new pseudos
 * are images). Layout/content properties do nothing there → `vt-snapshot-
 * inapplicable`. The declared body's top-level prop is checked (normalized
 * hyphenated), so `transform.translateY` reads as `transform`.
 */
const VT_SNAPSHOT_APPLICABLE = new Set([
    "transform",
    "opacity",
    "filter",
    "backdrop-filter",
    "mix-blend-mode",
    "clip-path",
]);

/** A container-query length unit — element-scoped, never reaches the root pseudo. */
const CQ_UNIT_RE = /\b-?\d*\.?\d+cq(w|h|i|b|min|max)\b/i;

/** Parse `prop: value;` pairs out of a `declaredKeyframeBodyFor` body. */
function declaredDecls<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Array<{ prop: string; value: string }> {
    const defaultEasing = serializeEasing(animation.options.timingFunction);
    const decls: Array<{ prop: string; value: string }> = [];
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const body = declaredKeyframeBodyFor(animation, i, defaultEasing);
        for (const m of body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) {
            decls.push({ prop: m[1]!.trim(), value: m[2]!.trim() });
        }
    }
    return decls;
}

/** The top-level CSS prop for a declared key (`transform.translateY` → `transform`). */
const topLevelProp = (prop: string): string =>
    prop
        .split(".")[0]!
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();

// ── The per-role emit ────────────────────────────────────────────────────────

interface RoleEmit {
    chunk: string | null;
    refusals: VTCompileRefusal[];
}

/**
 * Emit one role (old/new). Runs the VT-specific per-animation refusals FIRST
 * (scroll-grammar / element-scoped-computed / snapshot-inapplicable), then — if
 * clean — re-targets `compileChild` onto the pseudo selector (which may still add
 * an inherited CC-3 refusal). A refused role emits no chunk.
 */
function emitRole<V extends Vars>(
    role: "old" | "new",
    ident: string,
    selectorArg: string,
    animation: KeyframesAnimation<V>,
    typePrefix: string,
    opts: ViewTransitionCompileOptions,
): RoleEmit {
    const refusals: VTCompileRefusal[] = [];
    const name = `${ident}-${role}`;

    // vt-scroll-grammar — a VT pseudo is time-driven; `animation-timeline` is undefined.
    const scrollOptions = (
        animation as KeyframesAnimation<V> & { scrollOptions?: unknown }
    ).scrollOptions;
    if (scrollOptions != null) {
        refusals.push({
            name,
            reason: "vt-scroll-grammar",
            message:
                `scroll grammar on the ${role} role has no defined behavior on a ` +
                "time-driven ::view-transition pseudo (animation-timeline is undefined " +
                "there) — the JS ScrollScene driver is the only faithful path",
        });
        return { chunk: null, refusals };
    }

    // vt-element-scoped-computed + vt-snapshot-inapplicable (per declared prop).
    for (const { prop, value } of declaredDecls(animation)) {
        if (CQ_UNIT_RE.test(value) || /\bvar\(/.test(value)) {
            refusals.push({
                name,
                reason: "vt-element-scoped-computed",
                message:
                    `"${prop}" is element-scoped (${CQ_UNIT_RE.test(value) ? "a container-query unit" : "a var()"}) ` +
                    "— the ::view-transition pseudo tree hangs off the ROOT, so an " +
                    "element-scoped custom property / container context does not reach it",
            });
            return { chunk: null, refusals };
        }
        if (!VT_SNAPSHOT_APPLICABLE.has(topLevelProp(prop))) {
            refusals.push({
                name,
                reason: "vt-snapshot-inapplicable",
                message:
                    `"${prop}" does not apply to a replaced-content ::view-transition-${role} ` +
                    "snapshot (only transform/opacity/filter/mix-blend-mode animate there) — " +
                    "refused per property, never silently dropped",
            });
            return { chunk: null, refusals };
        }
    }

    // Clean — re-target the SAME per-child pipeline onto the pseudo selector.
    const selector = `${typePrefix}::view-transition-${role}(${selectorArg})`;
    const child: CompileChild<V> = {
        animation,
        name,
        composition: "replace",
        weighted: false,
        delay: 0,
    };
    const inherited: CompileRefusal[] = [];
    const chunk = compileChild(
        child,
        {
            ...(opts.densifyStops != null ? { densifyStops: opts.densifyStops } : {}),
            ...(opts.deltaEEpsilon != null ? { deltaEEpsilon: opts.deltaEEpsilon } : {}),
            selectorFor: () => selector,
        },
        inherited,
    );
    for (const r of inherited) refusals.push(r);
    return { chunk, refusals };
}

/** Derive the group pseudo's timing (duration + easing), or `null` when un-derivable. */
function groupTiming<V extends Vars>(
    spec: VTRoleSpec<V>,
): { duration: number; easing: string } | null {
    const g = spec.group;
    if (g != null) {
        if ("options" in g && "templateFrames" in g) {
            return {
                duration: g.options.duration,
                easing: serializeEasing(g.options.timingFunction),
            };
        }
        return {
            duration: g.duration,
            easing: serializeEasing(g.timingFunction),
        };
    }
    const src = spec.new ?? spec.old;
    if (src != null) {
        return {
            duration: src.options.duration,
            easing: serializeEasing(src.options.timingFunction),
        };
    }
    return null;
}

/**
 * THE VIEW-TRANSITIONS EMITTER (SF-1/SF-2/SF-3) — compile a name-keyed role spec
 * to a zero-runtime `::view-transition-*` CSS artifact. Emits per name: the
 * old/new `@keyframes` + shorthand, the MANDATORY timing-only group override, an
 * optional class-cohort rule, wrapped in `:active-view-transition-type(...)` when
 * `types` are given; prepends the cross-doc preamble under `crossDocument`; and
 * appends the PRM `animation: none` degrade by default. REFUSES with a NAMED
 * reason (the CC-3 four ∪ the VT four) what cannot round-trip faithfully.
 *
 * @returns `{ css, eligible, refusals, names }` — the artifact + the trust surface.
 */
export async function compileToViewTransition<V extends Vars>(
    spec: Record<string, VTRoleSpec<V>>,
    opts: ViewTransitionCompileOptions = {},
): Promise<CompiledViewTransitionCSS> {
    const refusals: VTCompileRefusal[] = [];
    const chunks: string[] = [];
    const names: string[] = [];

    const types = opts.types;
    const typePrefix =
        types && types.length > 0
            ? `:root:active-view-transition-type(${types.join(", ")})`
            : "";
    const emitGroup = opts.emitGroup ?? true;

    // vt-name-collision — two distinct spec keys collapsing to ONE CSS ident.
    const identToNames = new Map<string, string[]>();
    for (const rawName of Object.keys(spec)) {
        const ident = cssIdent(rawName);
        const arr = identToNames.get(ident);
        if (arr) arr.push(rawName);
        else identToNames.set(ident, [rawName]);
    }
    const collided = new Set<string>();
    for (const [ident, raws] of identToNames) {
        if (raws.length > 1) {
            for (const raw of raws) {
                collided.add(raw);
                refusals.push({
                    name: raw,
                    reason: "vt-name-collision",
                    message:
                        `"${raw}" collapses to the CSS ident "${ident}" already used by ` +
                        `${raws.filter((r) => r !== raw).map((r) => `"${r}"`).join(", ")} — ` +
                        "the ≤1-element-per-view-transition-name platform rule is violated; " +
                        "a REFUSAL, not a silent rename (rename the colliding key)",
                });
            }
        }
    }

    for (const [rawName, role] of Object.entries(spec)) {
        if (collided.has(rawName)) continue;
        const ident = cssIdent(rawName);
        // The class cohort re-targets the selector argument onto `.class`
        // (uniform-cohort form); else the per-name ident.
        const selectorArg = role.class ? `.${cssIdent(role.class)}` : ident;
        names.push(ident);

        for (const which of ["old", "new"] as const) {
            const animation = role[which];
            if (animation == null) continue;
            const { chunk, refusals: roleRefusals } = emitRole(
                which,
                ident,
                selectorArg,
                animation,
                typePrefix,
                opts,
            );
            for (const r of roleRefusals) refusals.push(r);
            if (chunk) chunks.push(chunk);
        }

        // Surface 2 — the MANDATORY timing-only group override (no animation-name).
        if (emitGroup && (role.old != null || role.new != null || role.group != null)) {
            const timing = groupTiming(role);
            if (timing != null) {
                chunks.push(
                    `${typePrefix}::view-transition-group(${selectorArg}) {\n` +
                        `  animation-duration: ${reverseCSSTime(timing.duration)};\n` +
                        `  animation-timing-function: ${timing.easing};\n}`,
                );
            }
        }
    }

    // The cross-doc opt-in preamble (inert where unsupported — honest narrative).
    if (opts.crossDocument) {
        chunks.unshift(`@view-transition {\n  navigation: auto;\n}`);
    }

    // The PRM degrade block, appended by default (the platform's own snap).
    if (opts.reducedMotion ?? true) {
        chunks.push(
            `@media (prefers-reduced-motion: reduce) {\n` +
                `  ::view-transition-group(*),\n` +
                `  ::view-transition-old(*),\n` +
                `  ::view-transition-new(*) {\n` +
                `    animation: none !important;\n  }\n}`,
        );
    }

    const eligible = refusals.length === 0;
    if (chunks.length === 0) {
        return { css: "", eligible, refusals, names };
    }

    const raw = chunks.join("\n\n");
    let css: string;
    try {
        css = await formatCSS(raw, opts.printWidth);
    } catch {
        css = raw;
    }
    return { css, eligible, refusals, names };
}
