import {
    camelCaseToHyphen,
    formatCSS,
    reverseCSSTime,
    timingFunctions,
    unflattenObjectToString,
    ValueUnit,
} from "@mkbabb/value.js";
import type { Animation } from "./engine";
import type { AnimationFrame, AnimationOptions, Vars } from "./constants";

// Animation-domain CSS serialisation. The primitive `formatCSS`
// (Prettier wrapper) lives in value.js — re-exported here for the
// convenience of consumers that already import animation-class
// helpers from this module.
export { formatCSS };

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

    // A CSS-twinned easing serializes as its faithful CSS string (a
    // spring's `linear()`, a `cubic-bezier()` literal); otherwise reverse-
    // look-up the callable in the registry, falling back to `linear`.
    let timingFunctionName =
        options.timingFunction.css ??
        (Object.entries(timingFunctions)
            .filter(([_name, func]) => func === options.timingFunction.fn)
            .map(([name]) => name)?.[0] ??
            "linear");

    timingFunctionName = camelCaseToHyphen(timingFunctionName);

    css += `  animation-timing-function: ${timingFunctionName};\n`;

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

    for (const templateFrame of animation.templateFrames) {
        const percent = templateFrame.start;
        const progress = percent.value / 100;
        const vars = animation.at(progress, false);

        const css = Object.entries(unflattenObjectToString(vars))
            .map(([propName, v]) => {
                propName = camelCaseToHyphen(propName);
                return `  ${propName}: ${v};`;
            })
            .join("\n")
            .trim();

        const body = `{\n${css}\n}`;

        if (!keyframesMap.has(body)) {
            keyframesMap.set(body, [percent]);
        } else {
            keyframesMap.get(body)!.push(percent);
        }
    }

    let keyframesString = "";
    for (const [css, percents] of keyframesMap) {
        keyframesString += `${percents.join(", ")} ${css}`;
    }

    const animationOptionsString = animationOptionsToString(options, name);

    const keyframes = `${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await formatCSS(keyframes, printWidth);

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
