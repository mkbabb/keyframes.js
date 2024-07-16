import { Animation } from "@src/animation";
import { AnimationFrame, AnimationOptions, Vars } from "@src/animation/constants";
import { ValueUnit } from "@src/units";
import { unflattenObjectToString } from "@src/units/utils";
import prettier from "prettier";
import prettierPostCSSPlugin from "prettier/plugins/postcss";
import { timingFunctions } from "../easing";
import { camelCaseToHyphen } from "../utils";
import {
    parseCSSAnimationKeyframes,
    parseCSSKeyframes,
    reverseCSSTime,
} from "./keyframes";

const DEFAULT_WIDTH = 80;

export async function formatCSS(
    css: string,
    printWidth: number | undefined = undefined,
) {
    return await prettier.format(css, {
        parser: "scss",
        plugins: [prettierPostCSSPlugin],
        printWidth: printWidth ?? DEFAULT_WIDTH,
    });
}

const DEFAULT_KEYFRAME_HEADER = `@keyframes animation {\n`;
const DEFAULT_KEYFRAME_FOOTER = `\n}`;

export function normalizeCSSKeyframeString(keyframe: string) {
    keyframe = keyframe.trim();

    if (keyframe.startsWith("{") && keyframe.endsWith("}")) {
        keyframe = keyframe.slice(1, -1);
    }

    if (!keyframe.includes("@keyframes")) {
        keyframe = DEFAULT_KEYFRAME_HEADER + keyframe + DEFAULT_KEYFRAME_FOOTER;
    }

    return keyframe;
}

export function parseCSSAnimationOrKeyframes(keyframes: string): {
    keyframes: any;
    options?: AnimationOptions;
    values?: any;
} {
    keyframes = normalizeCSSKeyframeString(keyframes);

    try {
        return parseCSSAnimationKeyframes(keyframes);
    } catch (e) {
        return {
            keyframes: parseCSSKeyframes(keyframes),
        };
    }
}

export const CSSKeyframesToStrings = async <V>(animation: Animation<V>) => {
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

    let timingFunctionName =
        Object.entries(timingFunctions)
            .filter(([name, func]) => func === options.timingFunction)
            .map(([name]) => name)?.[0] ?? "linear";

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

    css = `.animation {\n${css}}\n`;

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
    const keyframesMap = new Map<string, ValueUnit[]>();

    animation.frames.forEach(async (frame) => {
        const cssString = CSSKeyframeToString(frame);

        if (!keyframesMap.has(cssString)) {
            keyframesMap.set(cssString, [frame.start]);
        } else {
            keyframesMap.get(cssString).push(frame.start);
        }
    });

    let keyframesString = "";
    for (let [css, percents] of keyframesMap) {
        keyframesString += `${percents.join(", ")} ${css}`;
    }

    const animationOptionsString = animationOptionsToString(options, name);

    const keyframes = `${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await formatCSS(keyframes, printWidth);

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
