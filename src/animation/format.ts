import {
    camelCaseToHyphen,
    formatCSS,
    reverseCSSTime,
    timingFunctions,
    unflattenObjectToString,
    ValueUnit,
} from "@mkbabb/value.js";
import type { Animation } from "./engine";
import type { AnimationFrame, AnimationOptions, Easing, Vars } from "./constants";
import { AnimationOptionError } from "./internal/errors";

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

export const CSSKeyframesToStrings = async <V extends Vars>(
    animation: Animation<V>,
) => {
    const frameStrings = animation.frames.map(async (frame) => {
        let css = CSSKeyframeToString(frame);

        css = `${frame.start}\n${css}\n`;

        css = DEFAULT_KEYFRAME_HEADER + css + DEFAULT_KEYFRAME_FOOTER;

        css = await formatCSS(css, DEFAULT_WIDTH);

        return css
            .replace(DEFAULT_KEYFRAME_HEADER, "")
            .replace(DEFAULT_KEYFRAME_FOOTER, "");
    });

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

export function CSSKeyframeToString<V extends Vars>(frame: AnimationFrame<V>) {
    const css = Object.entries(unflattenObjectToString(frame.flatVars))
        .map(([name, v]) => {
            name = camelCaseToHyphen(name);
            return `  ${name}: ${v};`;
        })
        .join("\n")
        .trim();

    return `{\n${css}\n}`;
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
        // I.W0 S2 — serialize from the DECLARED template values, NOT a
        // DOM-resolving `at(progress)` interpolation sample. `parsedVars[i]` is
        // the parsed-but-unresolved var map for this stop (built 1:1 with
        // `templateFrames` in `parse()`); a `var()`/`matrix3d()` is already
        // valid CSS and round-trips VERBATIM through `unflattenObjectToString`,
        // never DOM-resolved to a number — so the serializer never reaches the
        // empty-var read-back parse throw (B1/B5). The editor shows the AUTHORED
        // CSS, which is exactly what re-parses cleanly.
        const declared = (animation.parsedVars[i] ?? {}) as Record<
            string,
            ValueUnit[]
        >;

        const decls = Object.entries(unflattenObjectToString(declared)).map(
            ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
        );

        const frameEasing = templateFrame.timingFunction
            ? serializeEasing(templateFrame.timingFunction)
            : defaultEasing;
        if (frameEasing !== defaultEasing) {
            decls.push(`  animation-timing-function: ${frameEasing};`);
        }

        const css = decls.join("\n").trim();

        const body = `{\n${css}\n}`;

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
