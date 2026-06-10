import {
    camelCaseToHyphen,
    formatCSS,
    reverseCSSTime,
    timingFunctions,
    unflattenObjectToString,
    ValueUnit,
} from "@mkbabb/value.js";
import type { Animation } from "./engine";
import type { AnimationOptions, Easing, Vars } from "./constants";
import { AnimationOptionError } from "./internal/errors";
import type { ParsedVarMap } from "./utils";

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
    animation: Animation<V>,
    i: number,
    defaultEasing: string,
): string {
    const declared: ParsedVarMap = animation.parsedVars[i] ?? {};

    const decls = Object.entries(unflattenObjectToString(declared)).map(
        ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
    );

    const templateFrame = animation.templateFrames[i]!;
    const frameEasing = templateFrame.timingFunction
        ? serializeEasing(templateFrame.timingFunction)
        : defaultEasing;
    if (frameEasing !== defaultEasing) {
        decls.push(`  animation-timing-function: ${frameEasing};`);
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
    animation: Animation<V>,
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

    css = `.${name} {\n${css}}\n`;

    return css;
}

export async function CSSKeyframesToString<V extends Vars>(
    animation: Animation<V>,
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

    const keyframes = `${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await formatCSS(keyframes, printWidth);

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
