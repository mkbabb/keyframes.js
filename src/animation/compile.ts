/**
 * compile.ts — K.W10 THE COMPILE (the XL anchor of the round-trip's BACKWARD
 * direction).
 *
 * `compileToCSS` walks an orchestration graph — an `AnimationGroup`
 * (spatial blend), a `Sequence` (temporal positioning), or a bare list of
 * children (e.g. a `stagger`-delayed cohort) — and emits a PURE, ZERO-RUNTIME
 * CSS artifact: one `@keyframes` block + one `animation` shorthand per child,
 * the `replace`/`add` layering as `animation-composition`, springs as
 * `linear()`, materialized stagger delays, and computed units
 * (`vh`/`cqw`/`calc()`/`var()`) VERBATIM. A human pastes the result into a
 * stylesheet and ships it with ZERO kf bytes on the page.
 *
 * ── THE MOAT — the parser run BACKWARD over the SAME data model. ──────────────
 * kf's internal model IS parsed CSS keyframes. So compiling back to CSS is the
 * parser's INVERSE over the SAME data structure — `format.ts` is `keyframes.ts`
 * run backward. The emit projects from the DECLARED template
 * (`animation.parsedVars[i]` via `unflattenObjectToString`, never a DOM-resolved
 * `at(progress)` sample), so a `var()`/`matrix3d()`/`cqw` round-trips VERBATIM.
 * The per-child `animation` shorthand is value.js's OWN `reverseAnimationShorthand`
 * (the published inverse of its shorthand parser), NOT a bespoke re-derivation.
 * GSAP/Motion/anime author in a bespoke tween model — "export to CSS" for them
 * is a lossy re-derivation nobody ships. The faithfulness is the moat; a lossy
 * emitter forfeits it (`K.md §MANDATE`).
 *
 * ── CC-2 — the oklab densify (the one place the compiler OUT-EXPRESSES CSS). ──
 * The platform's `@keyframes` interpolates color in sRGB; kf interpolates in
 * perceptual oklab. So a two-stop color track replayed by the browser would
 * DRIFT from the JS playback. CC-2 bakes the perceptual curve into N intermediate
 * `oklab()` stops sampled from value.js's `sampleColorRamp` (the dispatched
 * 0.13.0/N.W11.D fold), so the browser's piecewise-linear fill TRACKS kf's
 * perceptual lerp — gated on the ΔE-ε proof (`deltaEOK`): the densify ships ONLY
 * where it pixel-matches kf's JS lerp under the threshold; else CC-3 REFUSES.
 *
 * ── CC-3 — the ineligibility report (the trust surface). ─────────────────────
 * `waapiIneligibleReason` generalized to the CSS-compile domain. What cannot
 * round-trip faithfully is REFUSED with a NAMED reason, never silently
 * approximated (the replay-equality invariant's honest-refusal clause). The four
 * refusals: a `weighted` blend (no `animation-composition` twin — proves
 * axis-3's uniqueness), a custom renderer (a closure cannot be CSS), a
 * perceptual oklab track CC-2 cannot densify under ΔE-ε, and a computed-unit
 * drift residue (the narrow case verbatim emit would be wrong — NOT a blanket
 * reject, since the compiler is STRICTLY BETTER than WAAPI on computed units).
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). ──────────────────────────────────────
 * This module statically imports `@mkbabb/value.js` (`reverseAnimationShorthand`
 * via `format.ts`, `sampleColorRamp`/`deltaEOK`/the color kernels here) and the
 * `./engine`/`./group`/`./sequence` runtime. It is reached ONLY via
 * `loadAnimationEngine()` — NEVER the LIGHT static barrel, so `proof:boundary`
 * stays green (the value.js-free light surface stays value.js-free).
 */

import { formatCSS, reverseCSSTime } from "@mkbabb/value.js";
import type { Animation } from "./engine";
import { AnimationGroup } from "./group";
import { getAnimationId } from "./engine";
import { Sequence } from "./sequence";
import {
    animationComposition,
    animationShorthand,
    keyframesBlock,
    premultipliedKeyframesBlock,
} from "./format";
import { densifyColorBlock, round } from "./compile-color";
import { serializeScrollOptions } from "./scroll-grammar";
import type { CSSTimelineOptions } from "./scroll-grammar";
import type { CompositeOperator, Vars } from "./constants";

// ── The ineligibility report (CC-3) — the four named refusals ────────────────

/**
 * The reason a child could not compile faithfully. Generalizes
 * `waapiIneligibleReason` to the CSS-compile domain — the trust surface. Each
 * names the kf axis that exceeds pure CSS (the refusal is marketing for the
 * moat). A refused child's JS playback is the only faithful path.
 */
export type CompileRefusalReason =
    | "weighted-blend"
    | "custom-renderer"
    | "perceptual-oklab"
    | "computed-unit-drift";

/** A single refusal — the child name + a typed reason + a human message. */
export interface CompileRefusal {
    /** The compiled child's class/animation name. */
    name: string;
    reason: CompileRefusalReason;
    /** The verbatim message the demo's ineligibility UI shows (CC-4). */
    message: string;
}

/** Options for {@link compileToCSS}. */
export interface CompileOptions {
    /**
     * Per-child stagger delays (ms), index-aligned with the walked children —
     * the materialized output of `stagger.delays(total)`. CC-1 emits these as
     * literal per-child `animation-delay`, expressing an eased origin-aware
     * curve `sibling-index()` cannot (the universal literal-delay form;
     * `@supports (sibling-index)` is CC-6 BOOK, not the default).
     */
    staggerDelays?: readonly number[];
    /**
     * CC-2 — the oklab densify stop count (the N intermediate `oklab()` stops
     * baked per color segment, INCLUSIVE of endpoints). Default
     * {@link DEFAULT_DENSIFY_STOPS}. Raise it for a longer color arc; the ΔE
     * proof decides ship-vs-refuse.
     */
    densifyStops?: number;
    /**
     * CC-2 — the ΔE-ε ship-vs-refuse threshold (the perceptual-distance band the
     * densified `oklab()` stops must hold against kf's JS lerp). Default
     * {@link DEFAULT_DELTA_E_EPSILON}. A track whose densify exceeds this REFUSES
     * with the perceptual-oklab reason (a drifting densify is worse than an
     * honest refusal).
     */
    deltaEEpsilon?: number;
    /** Prettier print-width for the emitted artifact. Omit for the default. */
    printWidth?: number;
}

/** The compile result — the artifact + the CC-3 ineligibility report. */
export interface CompiledCSS {
    /**
     * The zero-runtime CSS artifact — `@keyframes` blocks + `.class { animation }`
     * rules. Empty string when EVERY child refused (then `refusals` carries the
     * whole story).
     */
    css: string;
    /**
     * True iff EVERY walked child compiled faithfully. False when one or more
     * refused — `refusals` names each, and the JS playback is the only faithful
     * path for those.
     */
    eligible: boolean;
    /** The CC-3 refusals — one per child that could not compile faithfully. */
    refusals: CompileRefusal[];
}

/**
 * The default ΔE-ε ship-vs-refuse threshold for the oklab densify. ~ a couple
 * just-noticeable-difference bands, so a densify that holds within a few JNDs of
 * kf's JS lerp SHIPS, and a wider drift REFUSES.
 */
export const DEFAULT_DELTA_E_EPSILON = 0.04;

/** The default oklab densify stop count (CC-2), inclusive of endpoints. */
export const DEFAULT_DENSIFY_STOPS = 16;

// ── The compile walker (CC-1) ────────────────────────────────────────────────

/** A walked child — its animation + the layer/sequence metadata the compile reads. */
interface CompileChild<V extends Vars> {
    animation: Animation<V>;
    name: string;
    /** The CSS `animation-composition` operator for this child's layering (CC-1 inverting W7). */
    composition: CompositeOperator;
    /**
     * A SPRING-driven `weighted` blend (a live `weightSpring` crossfade) forces a
     * refusal (CC-3 §3a) — it has no static CSS twin. A STATIC `weighted` layer is
     * NOT this: it pre-multiplies into an `accumulate` layer (see {@link staticWeight}).
     */
    weighted: boolean;
    /**
     * CC-5 (L.W2 S3) — a STATIC `weighted` layer's constant blend scalar. When
     * defined, `compileChild` pre-multiplies the child's numeric keyframe leaves by
     * this weight (CLONE-only — never mutates `parsedVars`) and emits the result as
     * an `animation-composition: accumulate` layer (exact CSS, no spring, no
     * runtime). `undefined` for a `replace`/`add` layer or a spring crossfade.
     */
    staticWeight?: number;
    /** An absolute offset (ms) — a Sequence position / stagger delay, emitted as `animation-delay`. */
    delay: number;
}

/** The input shapes `compileToCSS` accepts. */
export type CompileInput<V extends Vars = any> =
    | AnimationGroup<V>
    | Sequence<V>
    | ReadonlyArray<Animation<V> | { animation: Animation<V> }>;

/**
 * Walk an `AnimationGroup` into compile children. The layer `blendMode` maps to
 * the CSS `animation-composition` operator: `replace` → `replace`, `add` → `add`
 * (INVERTING W7's honoring — the operator W7 taught the engine to READ is now
 * EMITTED).
 *
 * CC-5 (L.W2 S3) — the `weighted` blend PARTITIONS:
 *   • a SPRING-driven `weighted` (a live `weightSpring` crossfade) has no static
 *     CSS twin → a REFUSAL flag (`springWeighted` → `weighted: true`), the §3a
 *     refusal that PROVES axis-3's uniqueness.
 *   • a STATIC `weighted` (constant scalar, `weightSpring == null`) is the simple
 *     pre-compositing case: the keyframe values pre-multiply by the scalar at
 *     compile time and the layer emits as `animation-composition: accumulate` —
 *     exact CSS, no spring, no JS runtime. Carried on `staticWeight`.
 */
function walkGroup<V extends Vars>(group: AnimationGroup<V>): CompileChild<V>[] {
    const children: CompileChild<V>[] = [];
    for (const key of Object.keys(group.animations)) {
        const entry = group.animations[key]!;
        const blend = entry.layer.blendMode;
        const springWeighted =
            blend === "weighted" && entry.layer.weightSpring != null;
        const staticWeighted =
            blend === "weighted" && entry.layer.weightSpring == null;
        const composition: CompositeOperator =
            blend === "add" ? "add" : staticWeighted ? "accumulate" : "replace";
        children.push({
            animation: entry.animation,
            name: cssIdent(getAnimationId(entry.animation)),
            composition,
            weighted: springWeighted,
            ...(staticWeighted ? { staticWeight: entry.layer.weight } : {}),
            delay: 0,
        });
    }
    return children;
}

/**
 * Walk a `Sequence` into compile children. Each entry's absolute `at` offset on
 * the master clock materializes as the child's `animation-delay` — the temporal
 * positioning emitted as a literal delay (a Sequence is `replace`-layered:
 * children paint their own targets along one clock, not a per-frame blend).
 */
function walkSequence<V extends Vars>(seq: Sequence<V>): CompileChild<V>[] {
    return seq.entries.map((entry) => ({
        animation: entry.animation,
        name: cssIdent(getAnimationId(entry.animation)),
        composition: "replace" as const,
        weighted: false,
        delay: entry.at,
    }));
}

/** Walk a bare child list (e.g. a `stagger`-delayed cohort). All `replace`. */
function walkList<V extends Vars>(
    list: ReadonlyArray<Animation<V> | { animation: Animation<V> }>,
): CompileChild<V>[] {
    return list.map((item, i) => {
        const anim = (
            "animation" in (item as { animation?: unknown })
                ? (item as { animation: Animation<V> }).animation
                : (item as Animation<V>)
        ) as Animation<V>;
        return {
            animation: anim,
            name: cssIdent(getAnimationId(anim) || `anim-${i}`),
            composition: "replace" as const,
            weighted: false,
            delay: 0,
        };
    });
}

/**
 * Normalize a child name to a CSS-safe ident (the `@keyframes`/class name). A
 * bare numeric id (`getAnimationId` falls back to `String(id)`) gets an `a`
 * prefix so the `@keyframes` name is a valid CSS identifier; collisions are
 * de-duped by the walker via a `-2`/`-3` suffix.
 */
function cssIdent(name: string): string {
    const cleaned = name.replace(/[^a-zA-Z0-9_-]/g, "-");
    return /^[a-zA-Z_]/.test(cleaned) ? cleaned : `a${cleaned}`;
}

/**
 * Detect a computed-unit DRIFT residue (CC-3 §3e). Returns the first flat
 * property key whose declared value array is EMPTY (so `unflattenObjectToString`
 * would emit nothing — the verbatim emit would silently drop the property).
 * `undefined` in the universal case: `vh`/`cqw`/`calc()`/`var()` all carry a
 * verbatim string and round-trip. NOT a blanket computed-unit reject — the
 * compiler is STRICTLY BETTER than WAAPI here (it emits the unit string and CSS
 * re-resolves natively, where WAAPI freezes to px once).
 */
function findComputedDrift<V extends Vars>(
    animation: Animation<V>,
): string | undefined {
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const [key, arr] of Object.entries(declared)) {
            if (!Array.isArray(arr) || arr.length === 0) return key;
        }
    }
    return undefined;
}

/**
 * The per-child compile: project the `@keyframes` block (with CC-2 densify where
 * a color leg admits it) + the `animation` shorthand, OR record a CC-3 refusal.
 * Returns the child's CSS chunk or `null` when refused.
 */
function compileChild<V extends Vars>(
    child: CompileChild<V>,
    opts: CompileOptions,
    refusals: CompileRefusal[],
): string | null {
    const { animation, name } = child;

    // CC-3 §3a — a `weighted` layer blend has NO CSS twin (proves axis-3's
    // uniqueness from the other side). REFUSE, never silently approximate.
    if (child.weighted) {
        refusals.push({
            name,
            reason: "weighted-blend",
            message:
                "weighted layer blend has no animation-composition equivalent " +
                "(CSS composites replace/add/accumulate only); the weighted axis is " +
                "kf's unique blend tier — the JS playback is the only faithful path",
        });
        return null;
    }

    // CC-3 §3b — a custom renderer (a transform closure that is NOT the default
    // DOM-style renderer) cannot be CSS (same gate as WAAPI's reject).
    for (const frame of animation.frames) {
        if (!animation.usesDefaultRenderer(frame.transform)) {
            refusals.push({
                name,
                reason: "custom-renderer",
                message:
                    "custom renderer (a transform closure, not the default DOM-style " +
                    "renderer) cannot be expressed as CSS — the JS playback is the only " +
                    "faithful path",
            });
            return null;
        }
    }

    // CC-3 §3e — the computed-unit DRIFT residue (NOT a blanket reject —
    // vh/cqw/calc()/var() emit VERBATIM and re-resolve natively).
    const driftKey = findComputedDrift(animation);
    if (driftKey) {
        refusals.push({
            name,
            reason: "computed-unit-drift",
            message:
                `computed-unit drift on "${driftKey}" — the declared value cannot be ` +
                "re-emitted as a faithful authored string; the JS playback is the only " +
                "faithful path",
        });
        return null;
    }

    // CC-2 — densify a color track into perceptual oklab() stops, gated on ΔE-ε.
    const densify = densifyColorBlock(
        animation,
        name,
        opts.densifyStops ?? DEFAULT_DENSIFY_STOPS,
        opts.deltaEEpsilon ?? DEFAULT_DELTA_E_EPSILON,
    );
    if (densify && "refused" in densify) {
        refusals.push({
            name,
            reason: "perceptual-oklab",
            message:
                `perceptual oklab color track exceeds the densify ΔE-ε threshold ` +
                `(ΔE ${round(densify.delta)} > ${opts.deltaEEpsilon ?? DEFAULT_DELTA_E_EPSILON}) — ` +
                "a faithful pure-CSS twin is not available; the JS playback is the only " +
                "faithful path",
        });
        return null;
    }

    // CC-5 (L.W2 S3) — a STATIC-weight layer pre-multiplies its numeric keyframe
    // leaves by the constant scalar and emits as `accumulate` (exact CSS, no
    // spring). The pre-multiply CLONES the declared leaves (never mutates
    // parsedVars); a non-numeric leaf (color/string) has no scalar pre-multiply →
    // a weighted-blend refusal (the JS playback is the faithful path). The
    // `accumulate` composition is set by walkGroup's static partition.
    let staticBlock: string | undefined;
    if (child.staticWeight != null) {
        const premul = premultipliedKeyframesBlock(
            animation,
            name,
            child.staticWeight,
        );
        if ("refused" in premul) {
            refusals.push({
                name,
                reason: "weighted-blend",
                message:
                    `static-weight pre-multiply cannot scale the non-numeric leaf ` +
                    `"${premul.key}" (a color/string has no scalar weight) — the ` +
                    "weighted blend is kf's unique tier; the JS playback is the only " +
                    "faithful path",
            });
            return null;
        }
        staticBlock = premul.block;
    }

    // CC-1 — the @keyframes block: the static-weight pre-multiply (CC-5), else the
    // densified color block (CC-2), else the verbatim declared-template projection
    // + the animation shorthand (reverseAnimationShorthand).
    const block =
        staticBlock ??
        (densify && "block" in densify
            ? densify.block
            : keyframesBlock(animation, name));

    // The per-child `animation` shorthand; `serializeEasing` THROWS for a custom
    // closure easing with no CSS twin — caught + recorded as a custom-renderer
    // refusal (the easing channel of the same axis).
    let shorthand: string;
    try {
        shorthand = animationShorthand(animation.options, name);
    } catch {
        refusals.push({
            name,
            reason: "custom-renderer",
            message:
                "easing has no faithful CSS timing-function twin (a custom closure " +
                "cannot be CSS) — attach an Easing.css twin or use a registry name / " +
                "cubic-bezier() / linear(); the JS playback is the only faithful path",
        });
        return null;
    }

    // CC-1 §W7 inversion — `animation-composition` as a SEPARATE longhand (NOT
    // folded into the shorthand; it is not a shorthand sub-property). The `add`
    // layer/per-stop operator W7 taught the engine to READ is now EMITTED.
    const compositionDecl = animationComposition(child.composition);
    const compositionLine = compositionDecl ? `\n  ${compositionDecl}` : "";

    // The stagger / sequence delay rides as `animation-delay` (materialized
    // literal — the universal default; an eased curve sibling-index() cannot
    // express). `reverseAnimationShorthand` already emits `options.delay`; the
    // EXTERNAL stagger/sequence offset layers on top here.
    const delayDecl =
        child.delay > 0
            ? `\n  animation-delay: ${reverseCSSTime(child.delay)};`
            : "";

    // CC-6 (L.W2 S1) — the scroll grammar EMIT half. When the source carried
    // scroll grammar (`animation-timeline`/`animation-range`, parsed on ingest
    // onto `animation.scrollOptions`), append the VERBATIM longhands via value.js's
    // `serializeScrollOptions` (the inverse serializer run backward over the parsed
    // typed options — the SAME moat law as the `animation` shorthand). Without
    // this the compiled `.class` block is SCROLL-BLIND: the browser plays it on
    // the time clock, semantically wrong relative to the JS source. The longhands
    // are NOT shorthand sub-properties (CSS Animations L2), so they ride as
    // separate longhands — parallel to `animation-composition`.
    const scrollDecl = scrollLonghands(animation);

    const rule = `.${name} {\n  animation: ${shorthand};${compositionLine}${delayDecl}${scrollDecl}\n}`;

    return `${block}\n\n${rule}`;
}

/**
 * CC-6 (L.W2 S1) — the scroll-grammar longhand declarations for a child, or `""`.
 * Reads the parsed `scrollOptions` (`CSSKeyframesAnimation.fromString` populates
 * it from `extractTimelineOptions`) and runs value.js's `serializeScrollOptions`
 * BACKWARD over the typed options to the canonical `animation-timeline` /
 * `animation-range` (/ `timeline-scope` / `animation-trigger`) longhands. Returns
 * the newline-prefixed declarations for the `.class` rule body, or `""` for a
 * plain time-clock animation (`scrollOptions` `undefined`). The field lives on
 * `CSSKeyframesAnimation` only — a plain `Animation` (no field) yields `""`.
 */
function scrollLonghands<V extends Vars>(animation: Animation<V>): string {
    const opts = (
        animation as Animation<V> & { scrollOptions?: CSSTimelineOptions }
    ).scrollOptions;
    if (opts == null) return "";
    const decls = serializeScrollOptions(opts);
    let out = "";
    for (const [prop, value] of Object.entries(decls)) {
        if (value != null) out += `\n  ${prop}: ${value};`;
    }
    return out;
}

/**
 * THE compiler (CC-1/CC-2/CC-3) — compile an orchestration graph to zero-runtime
 * CSS. Walks the input (`AnimationGroup` / `Sequence` / child list), emits one
 * `@keyframes` + one `animation` shorthand per child (the `replace`/`add`
 * layering as `animation-composition`, springs as `linear()`, stagger delays
 * materialized, computed units verbatim, color tracks densified into perceptual
 * `oklab()` stops under the ΔE-ε proof), and REFUSES with a NAMED reason what
 * cannot compile faithfully (CC-3 — the replay-equality invariant's honest
 * refusal). The result is async because `formatCSS` (Prettier) is.
 *
 * @returns `{ css, eligible, refusals }` — the artifact + the trust surface.
 */
export async function compileToCSS<V extends Vars>(
    input: CompileInput<V>,
    opts: CompileOptions = {},
): Promise<CompiledCSS> {
    const children =
        input instanceof AnimationGroup
            ? walkGroup(input)
            : input instanceof Sequence
              ? walkSequence(input)
              : walkList(input as ReadonlyArray<Animation<V>>);

    // De-dup colliding names (two children with the same id) — append -2/-3.
    const nameCounts = new Map<string, number>();
    for (const child of children) {
        const seen = nameCounts.get(child.name) ?? 0;
        nameCounts.set(child.name, seen + 1);
        if (seen > 0) child.name = `${child.name}-${seen + 1}`;
    }

    // Layer the materialized stagger delays onto the children (index-aligned).
    if (opts.staggerDelays) {
        children.forEach((child, i) => {
            const d = opts.staggerDelays![i];
            if (typeof d === "number" && d > 0) child.delay += d;
        });
    }

    const refusals: CompileRefusal[] = [];
    const chunks: string[] = [];
    for (const child of children) {
        const chunk = compileChild(child, opts, refusals);
        if (chunk) chunks.push(chunk);
    }

    const eligible = refusals.length === 0;
    if (chunks.length === 0) {
        return { css: "", eligible, refusals };
    }

    const raw = chunks.join("\n\n");
    let css: string;
    try {
        css = await formatCSS(raw, opts.printWidth);
    } catch {
        // formatCSS is a cosmetic pass — a Prettier hiccup never forfeits the
        // artifact; fall back to the un-formatted (still valid) CSS.
        css = raw;
    }

    return { css, eligible, refusals };
}
