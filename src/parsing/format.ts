import prettier from "prettier";
import prettierPostCSSPlugin from "prettier/plugins/postcss";
import { Animation, AnimationOptions, Vars } from "../animation";
import { timingFunctions } from "../easing";
import {
    FunctionValue,
    ValueArray,
    ValueUnit,
    flattenReverseTransformedObject,
    reverseTransformObject,
} from "../units";
import { camelCaseToHyphen } from "../utils";
import { reverseCSSTime, parseCSSKeyframes } from "./keyframes";

function objectToString(key: string, value: any) {
    if (typeof value === "object" && !(value instanceof ValueArray)) {
        return Object.entries(value)
            .map(([k, v]) => {
                if (v instanceof FunctionValue) {
                    return String(v);
                } else {
                    return `${k}(${v})`;
                }
            })
            .join(" ");
    } else {
        return String(value);
    }
}

export async function formatCSS(css: string, printWidth: number = 80) {
    return await prettier.format(css, {
        parser: "scss",
        plugins: [prettierPostCSSPlugin],
        printWidth,
    });
}

const DEFAULT_KEYFRAME_HEADER = `@keyframes animation {\n`;
const DEFAULT_KEYFRAME_FOOTER = `\n}`;

export function parseCSSKeyframe(keyframe: string) {
    if (!keyframe.includes("@keyframes")) {
        keyframe = DEFAULT_KEYFRAME_HEADER + keyframe + DEFAULT_KEYFRAME_FOOTER;
    }
    return parseCSSKeyframes(keyframe);
}

export const CSSKeyframesToStrings = async <V>(animation: Animation<V>) => {
    const frameStrings = animation.templateFrames.map(async (frame) => {
        let css = CSSKeyframeToString(frame);

        css = `${frame.start}\n${css}\n`;

        css = DEFAULT_KEYFRAME_HEADER + css + DEFAULT_KEYFRAME_FOOTER;

        css = await formatCSS(css, 40);

        return css
            .replace(DEFAULT_KEYFRAME_HEADER, "")
            .replace(DEFAULT_KEYFRAME_FOOTER, "");

        // de-indent the css:
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

    css = `.${name} {\n${css}}\n`;

    return css;
}

export function CSSKeyframeToString<V extends Vars>(
    frame: Animation<V>["templateFrames"][0],
) {
    let css = `{\n`;

    const reversedVars = {};
    Object.entries(frame.vars).forEach(([key, value]: [string, ValueArray]) => {
        reverseTransformObject(key, value, reversedVars);
    });

    for (let [name, v] of Object.entries(reversedVars)) {
        name = camelCaseToHyphen(name);
        let s = objectToString(name, v);
        css += `  ${name}: ${s};\n`;
    }
    css += "  }\n";

    return css;
}

export async function CSSKeyframesToString<V extends Vars>(
    animation: Animation<V>,
    name: string = "animation",
    printWidth: number = 80,
) {
    const options = animation.options;
    const keyframesMap = new Map<string, ValueUnit[]>();

    animation.templateFrames.forEach(async (frame) => {
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

    const animationOptionsString = animationOptionsToString(options);

    const keyframes = `${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await prettier.format(keyframes, {
        parser: "scss",
        plugins: [prettierPostCSSPlugin],
        printWidth,
    });

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
