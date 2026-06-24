import {
    camelCaseToHyphen,
    formatCSS,
    reverseAnimationShorthand,
    reverseCSSTime,
    serializeStylesheetItem,
    timingFunctions,
    unflattenObjectToString,
    ValueArray,
    ValueUnit,
} from "@mkbabb/value.js";
import type {
    CSSAnimationOptions,
    PropertyDescriptor,
} from "@mkbabb/value.js";
import type { KeyframesAnimation } from "../engine";
import type {
    AnimationOptions,
    CompositeOperator,
    Easing,
    Vars,
} from "../constants";
import { AnimationOptionError } from "../internal/errors";
import type { ParsedVarMap } from "./parse-flatten";

/**
 * Serialize an `Easing` to its CSS `animation-timing-function` token (F.W7).
 * A CSS-twinned easing emits its faithful CSS string VERBATIM (a spring's
 * `linear()`, a `cubic-bezier()` literal) — it is already CSS and must NOT be
 * hyphenated (`camelCaseToHyphen` would mangle any uppercase). Otherwise the
 * callable is reverse-looked-up in the registry and the camelCase key is
 * hyphenated (`easeOutCubic` → `ease-out-cubic`). Factored so both the
 * top-level options serializer and the per-keyframe emitter share ONE faithful
 * easing→CSS path (the round-trip symmetry the serializer lacked).
 *
 * A custom closure has no faithful CSS `animation-timing-function` twin (G.W4):
 * when the easing carries no `.css` and is NOT a value.js registry entry, the
 * curve is genuinely unrepresentable in CSS. The Mandate's rule for a real
 * structural limit is fail-EXPLICIT — THROW naming the option + the faithful
 * remedies, rather than silently emitting a WRONG `"linear"` that discards the
 * curve (the silent contract-mask the prior `?? "linear"` was).
 */
export function serializeEasing(easing: Easing): string {
    if (easing.css !== undefined) return easing.css;
    const registryName = Object.entries(timingFunctions).find(
        ([_name, func]) => func === easing.fn,
    )?.[0];
    if (registryName === undefined) {
        throw new AnimationOptionError(
            "timingFunction",
            easing.fn,
            "a custom TimingFunction has no CSS animation-timing-function " +
                "representation — attach a faithful Easing.css twin, or use a " +
                "registry name / cubic-bezier() / linear() literal",
        );
    }
    return camelCaseToHyphen(registryName);
}

const DEFAULT_WIDTH = 80;
const DEFAULT_KEYFRAME_HEADER = `@keyframes animation {\n`;
const DEFAULT_KEYFRAME_FOOTER = `\n}`;

/**
 * THE one declared-template projection (J.W1 S1 — ENG-1). Renders stop `i`'s
 * keyframe body (`{ … }`) from the DECLARED `animation.parsedVars[i]` — the
 * parsed-but-unresolved var map built 1:1 with `templateFrames` in `parse()`
 * (I.W0 S2). A `var()`/`calc()`/`matrix3d()` is already valid CSS and
 * round-trips VERBATIM through `unflattenObjectToString`, never DOM-resolved
 * to a number — a serializer must not need a live, fully-styled DOM to emit
 * CSS text, and the AUTHORED CSS is exactly what re-parses cleanly (so the
 * empty-var read-back parse throw — B1/B5 — is unreachable from here).
 *
 * BOTH serialize surfaces project from THIS function: the aggregate
 * `CSSKeyframesToString` (the whole-block readout) and the per-card
 * `CSSKeyframesToStrings` (the editor's per-stop pane). The pre-transposition
 * sibling that read `frame.flatVars` — the LIVE interpolation buffers,
 * DOM-resolved for computed units and mutated in place by every
 * `interpFrames` pass — is DELETED: ONE serialization authority.
 *
 * F.W7 — a per-stop easing that differs from the animation default rides the
 * body (CSS Animations L1: `animation-timing-function` at a stop applies to
 * the interval STARTING there); a uniform easing stays on the `.class` block
 * so the round-trip is byte-identical.
 */
function declaredKeyframeBody<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): string {
    const declared: ParsedVarMap = animation.parsedVars[i] ?? {};

    const templateFrame = animation.templateFrames[i]!;

    const decls = Object.entries(unflattenObjectToString(declared)).map(
        ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
    );

    const frameEasing = templateFrame.timingFunction
        ? serializeEasing(templateFrame.timingFunction)
        : defaultEasing;
    if (frameEasing !== defaultEasing) {
        decls.push(`  animation-timing-function: ${frameEasing};`);
    }

    // L.W1 S3 — the per-stop `animation-composition` round-trip, symmetric with
    // the per-stop easing emit above. value.js lifts the author's per-keyframe
    // `animation-composition` onto `rule.composition`; the adapter captures it on
    // `templateFrame.composition`; emit it back for any stop whose operator is
    // non-`replace` (the CSS default — omitting it is correct for `replace`), so
    // the declared layering survives parse → serialize → re-parse instead of
    // silently collapsing to `replace`.
    const composition = templateFrame.composition;
    if (composition != null && composition !== "replace") {
        decls.push(`  animation-composition: ${composition};`);
    }

    const css = decls.join("\n").trim();

    return `{\n${css}\n}`;
}

/**
 * Per-stop card serializer for the editor pane — ONE formatted keyframe
 * string per DECLARED template stop, index-aligned with
 * `animation.templateFrames` (the pairing the card list renders by).
 * Unified onto the declared-template authority (J.W1 S1): each card is
 * {@link declaredKeyframeBody} — the AUTHORED values. The former path mapped
 * `animation.frames` (the interp PAIRS — N−1 segments for N stops, so the
 * last card simply did not exist) and read `frame.flatVars` (DOM-resolved,
 * interp-mutated) — both defects die with the unification.
 */
export const CSSKeyframesToStrings = async <V extends Vars>(
    animation: KeyframesAnimation<V>,
) => {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    const frameStrings = animation.templateFrames.map(
        async (templateFrame, i) => {
            let css = declaredKeyframeBody(animation, i, defaultEasing);

            css = `${templateFrame.start}\n${css}\n`;

            css = DEFAULT_KEYFRAME_HEADER + css + DEFAULT_KEYFRAME_FOOTER;

            css = await formatCSS(css, DEFAULT_WIDTH);

            return css
                .replace(DEFAULT_KEYFRAME_HEADER, "")
                .replace(DEFAULT_KEYFRAME_FOOTER, "");
        },
    );

    return Promise.all(frameStrings);
};

export function formatCSSKeyframeString(keyframe: string) {
    let s = keyframe
        .replace(/^[^{]*{/, "")
        .replace(/^  /gm, "")
        .replace(/}\s*$/, "");

    s = s.trim();

    s = s.replace(/^  /, "");

    return s;
}

export function animationOptionsToString(
    options: AnimationOptions,
    name: string = "animation",
) {
    let css = "";

    css += `  animation-name: ${name};\n`;

    const duration = reverseCSSTime(options.duration);
    css += `  animation-duration: ${duration};\n`;

    css += `  animation-timing-function: ${serializeEasing(options.timingFunction)};\n`;

    css += `  animation-iteration-count: ${
        isFinite(options.iterationCount) ? options.iterationCount : "infinite"
    };\n`;
    css += `  animation-direction: ${options.direction};\n`;
    css += `  animation-fill-mode: ${options.fillMode};\n`;

    if (options.delay > 0) {
        css += `  animation-delay: ${reverseCSSTime(options.delay)};\n`;
    }

    // L.W1 S5 (Band A) — the LAYER-level `animation-composition` longhand. An
    // authored `animation-composition: add` that arrived through a sibling
    // `.class { animation: … }` ingest rides `options.composite`; emit it back
    // (via the ONE `animationComposition` longhand authority) for a non-default
    // operator so the layer-level compositing replays on re-parse. `replace` (or
    // omission) emits nothing — the byte-minimal round-trip.
    const compositeDecl =
        options.composite != null
            ? animationComposition(options.composite)
            : undefined;
    if (compositeDecl != null) {
        css += `  ${compositeDecl}\n`;
    }

    css = `.${name} {\n${css}}\n`;

    return css;
}

/**
 * K.W10 CC-1 — the per-stop declared-body projection EXPOSED to the compiler
 * (`compile.ts`). `compileToCSS` walks an orchestration graph and emits one
 * `@keyframes` per child; each stop body is THIS function — the SAME
 * declared-template authority `CSSKeyframesToString` projects from
 * (`parsedVars[i]` via `unflattenObjectToString`), so a child compiled by the
 * group walker is byte-identical to the single-animation serializer's body. The
 * `bodyOverride` arg lets CC-2's oklab densify substitute a DENSER stop set for
 * a color leg WITHOUT re-deriving the projection — the densified `{ … }` body is
 * threaded in, every other key still rides the verbatim declared projection.
 */
export function declaredKeyframeBodyFor<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): string {
    return declaredKeyframeBody(animation, i, defaultEasing);
}

/**
 * K.W10 CC-1 — the `@keyframes <name> { … }` block builder, factored out of
 * {@link CSSKeyframesToString} so the multi-animation compiler (`compile.ts`)
 * emits one block per child from the SAME declared-template authority. Returns
 * the UN-formatted block (caller runs `formatCSS` once over the whole artifact);
 * `bodyByStop` (CC-2 densify) substitutes a per-stop body where provided, else
 * the verbatim declared projection rides. This is the parser run BACKWARD: the
 * block re-parses to the SAME template it serialized from.
 */
export function keyframesBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    bodyByStop?: ReadonlyMap<number, string>,
): string {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    // Coalesce identical stop bodies onto one selector list (`0%, 50% { … }`) —
    // the same de-dup `CSSKeyframesToString` does. A densified stop is unique
    // (it carries its own body), so it never coalesces away.
    const keyframesMap = new Map<string, ValueUnit[]>();
    animation.templateFrames.forEach((templateFrame, i) => {
        const body =
            bodyByStop?.get(i) ??
            declaredKeyframeBody(animation, i, defaultEasing);
        const existing = keyframesMap.get(body);
        if (existing) existing.push(templateFrame.start);
        else keyframesMap.set(body, [templateFrame.start]);
    });

    let stops = "";
    for (const [body, percents] of keyframesMap) {
        stops += `${percents.join(", ")} ${body}\n`;
    }

    return `@keyframes ${name} {\n${stops}}`;
}

/**
 * CC-5 (L.W2 S3) — the STATIC-weight pre-multiply result: a ready `@keyframes`
 * block whose numeric keyframe leaves have been scaled by the constant blend
 * weight (so an `accumulate` layer reproduces the weighted blend in exact CSS), OR
 * a refusal naming the non-numeric leaf that cannot be scaled.
 */
export type PremultiplyResult =
    | { block: string }
    | { refused: true; key: string };

/**
 * CC-5 (L.W2 S3) — pre-multiply a child's numeric keyframe leaves by a STATIC
 * blend `weight` and project the scaled `@keyframes` block. A constant-weight
 * `weighted` layer is the simple pre-compositing case: the author chose a fixed
 * scalar blend, so the output keyframe values can be scaled by `weight` at compile
 * time and the layer emitted as `animation-composition: accumulate` — exact CSS,
 * no spring, no JS runtime (`compile.ts` walkGroup partition).
 *
 * READ-ONLY over the animation: each stop's declared `ValueArray`s are CLONED
 * (`ValueArray.clone()`), and only the CLONES' numeric leaves are scaled —
 * `animation.parsedVars` is NEVER mutated (the compiler is read-only over the
 * animation object). The scaled clones flow through the SAME
 * `unflattenObjectToString` projection {@link declaredKeyframeBody} uses, so a
 * `translateX(120px)` at `weight: 0.5` round-trips as `translateX(60px)`.
 *
 * Only NUMERIC leaves scale. A non-numeric leaf (a `color`, a bare string token —
 * `unit === "color"` or a non-`number` `value`) has no scalar pre-multiply, so a
 * static-weight animation carrying one REFUSES (`{ refused, key }`) — the caller
 * records it as a `weighted-blend` refusal (the JS playback is the faithful path).
 */
export function premultipliedKeyframesBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    weight: number,
): PremultiplyResult {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    const keyframesMap = new Map<string, ValueUnit[]>();
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const templateFrame = animation.templateFrames[i]!;
        const declared: ParsedVarMap = animation.parsedVars[i] ?? {};

        // Clone each declared ValueArray and scale ONLY its numeric leaves; a
        // non-numeric leaf (color/string) refuses. CLONE-only — parsedVars stays
        // untouched (read-only-over-the-animation invariant).
        const scaled: ParsedVarMap = {};
        for (const [key, arr] of Object.entries(declared)) {
            const cloned = (arr as ValueArray).clone();
            for (const leaf of cloned as Iterable<ValueUnit>) {
                if (typeof leaf.value === "number") {
                    leaf.value = leaf.value * weight;
                } else if (leaf.unit === "color" || typeof leaf.value === "string") {
                    return { refused: true, key };
                }
            }
            scaled[key] = cloned;
        }

        const decls = Object.entries(unflattenObjectToString(scaled)).map(
            ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
        );
        const frameEasing = templateFrame.timingFunction
            ? serializeEasing(templateFrame.timingFunction)
            : defaultEasing;
        if (frameEasing !== defaultEasing) {
            decls.push(`  animation-timing-function: ${frameEasing};`);
        }
        const composition = templateFrame.composition;
        if (composition != null && composition !== "replace") {
            decls.push(`  animation-composition: ${composition};`);
        }
        const body = `{\n${decls.join("\n").trim()}\n}`;

        const existing = keyframesMap.get(body);
        if (existing) existing.push(templateFrame.start);
        else keyframesMap.set(body, [templateFrame.start]);
    }

    let stops = "";
    for (const [body, percents] of keyframesMap) {
        stops += `${percents.join(", ")} ${body}\n`;
    }
    return { block: `@keyframes ${name} {\n${stops}}` };
}

/**
 * K.W10 CC-1 — the per-child `animation` SHORTHAND emit via value.js's
 * `reverseAnimationShorthand` (the published 0.12.0 inverse of the
 * `animation`-shorthand parser). This is the round-trip producer for each
 * child's `animation` longhand: kf's {@link AnimationOptions} → the
 * value.js-spec {@link CSSAnimationOptions} → the canonical shorthand string —
 * the parser run BACKWARD over value.js's OWN shorthand grammar, NOT a bespoke
 * re-derivation.
 *
 * `animation-composition` is DELIBERATELY NOT folded into the shorthand here:
 * per the CSS Animations L2 grammar it is NOT a sub-property of the `animation`
 * shorthand (a browser would not parse `animation: … add name` as composition),
 * so the compiler ({@link compileToCSS} via `animationComposition`) emits it as
 * a SEPARATE `animation-composition:` longhand. Keeping it off the shorthand is
 * the faithfulness — the emitted CSS must re-parse to the same layered result.
 *
 * The easing MUST have a faithful CSS twin (`serializeEasing` THROWS otherwise —
 * the CC-3 custom-renderer/closure refusal generalized to the easing channel);
 * a spring's `linear()` flows through verbatim.
 */
export function animationShorthand(options: AnimationOptions, name: string): string {
    const cssOptions: CSSAnimationOptions = {
        name,
        duration: options.duration,
        timingFunction: serializeEasing(options.timingFunction),
        iterationCount: isFinite(options.iterationCount)
            ? options.iterationCount
            : Infinity,
        direction: options.direction,
        fillMode: options.fillMode,
    };
    if (options.delay > 0) cssOptions.delay = options.delay;
    return reverseAnimationShorthand(cssOptions);
}

/**
 * K.W10 CC-1 — the `animation-composition` SEPARATE longhand (CC-1's W7
 * inversion). CSS `animation-composition` is `replace | add | accumulate`; kf's
 * `add` LAYER blend (`BlendMode`) and per-stop `add`/`accumulate` honor (W7)
 * ride here as the standalone longhand, so the emitted CSS replays the SAME
 * layered result the JS playback did. Returns `undefined` for the default
 * `replace` (omitted — the byte-minimal round-trip; `replace` is the CSS
 * default).
 */
export function animationComposition(
    composition: CompositeOperator,
): string | undefined {
    return composition === "replace"
        ? undefined
        : `animation-composition: ${composition};`;
}

/**
 * L.W1 S2 — serialize the `@property` registry BACK to its `@property` blocks.
 * `CSSKeyframesAnimation.fromString` parses `@property --foo { … }` rules into
 * `animation.propertyRegistry` (`Map<string, PropertyDescriptor>`) and registers
 * them with the UA, but the backward serialize path dropped them — a compiled
 * artifact lost its custom-property TYPING block on re-ship (`--foo` falls back
 * to the `<universal>` type, breaking `@property`-typed transitions). Emit each
 * registry entry via value.js's `serializeStylesheetItem` (the published inverse
 * of the `@property` parser) — NOT a bespoke re-derivation. Returns the joined
 * blocks (one per entry) or `""` when the registry is empty. A plain `Animation`
 * (no registry) yields `""` — the field lives on `CSSKeyframesAnimation` only.
 */
function propertyRegistryToString<V extends Vars>(
    animation: KeyframesAnimation<V>,
): string {
    const registry = (
        animation as KeyframesAnimation<V> & {
            propertyRegistry?: ReadonlyMap<string, PropertyDescriptor>;
        }
    ).propertyRegistry;
    if (registry == null || registry.size === 0) return "";
    const blocks: string[] = [];
    for (const [name, descriptor] of registry) {
        blocks.push(
            serializeStylesheetItem({ kind: "property", name, descriptor }),
        );
    }
    return blocks.join("\n");
}

export async function CSSKeyframesToString<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string = "animation",
    printWidth: number | undefined = undefined,
) {
    const options = animation.options;

    // Build keyframes from template frames (the declared stops: 0%, 50%, 100%, etc.)
    // rather than interpolation frames (which are transition pairs, not stops).
    // Sample the animation at each stop's percentage to get the resolved CSS values.
    const keyframesMap = new Map<string, ValueUnit[]>();

    // F.W7 — the per-keyframe easing round-trip. `fromString` READS each stop's
    // `animation-timing-function` (CSS Animations L1: it applies to the interval
    // STARTING at that stop) and stores it on `templateFrame.timingFunction`;
    // the serializer must emit it back or the per-stop curve is silently lost on
    // re-parse. Emit it ONLY when it differs from the top-level default, so a
    // uniform-easing animation stays byte-identical (the default already rides
    // the `.class` block).
    const defaultEasing = serializeEasing(options.timingFunction);

    animation.templateFrames.forEach((templateFrame, i) => {
        const percent = templateFrame.start;
        // I.W0 S2 / J.W1 S1 — serialize from the DECLARED template values,
        // NOT a DOM-resolving interpolation sample: the ONE projection both
        // serialize surfaces share (see `declaredKeyframeBody`).
        const body = declaredKeyframeBody(animation, i, defaultEasing);

        if (!keyframesMap.has(body)) {
            keyframesMap.set(body, [percent]);
        } else {
            keyframesMap.get(body)!.push(percent);
        }
    });

    let keyframesString = "";
    for (const [css, percents] of keyframesMap) {
        keyframesString += `${percents.join(", ")} ${css}`;
    }

    const animationOptionsString = animationOptionsToString(options, name);

    // L.W1 S2 — prepend the `@property` typing blocks (if any) so a parsed
    // `@property --foo { … }` survives the backward serialize. Layout:
    // `@property` blocks + blank line + the `.class` options + `@keyframes`.
    const propertyBlocks = propertyRegistryToString(animation);
    const propertyPrefix = propertyBlocks ? `${propertyBlocks}\n\n` : "";

    const keyframes = `${propertyPrefix}${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await formatCSS(keyframes, printWidth);

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
