import prettier from "prettier";
import prettierPostCSSPlugin from "prettier/plugins/postcss";
import { Animation, Vars } from "../animation";
import { timingFunctions } from "../easing";
import { FunctionValue, ValueArray, ValueUnit, reverseTransformObject } from "../units";
import { camelCaseToHyphen } from "../utils";
import { reverseCSSTime } from "./keyframes";

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

export async function CSSKeyframesToString<V extends Vars>(
    animation: Animation<V>,
    name: string = "animation",
    printWidth: number = 80,
) {
    const options = animation.options;
    const keyframesMap = new Map<string, ValueUnit[]>();
    animation.templateFrames.forEach((frame) => {
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
        if (!keyframesMap.has(css)) {
            keyframesMap.set(css, [frame.start]);
        } else {
            keyframesMap.get(css).push(frame.start);
        }
    });
    let keyframesString = "";
    for (let [css, percents] of keyframesMap) {
        keyframesString += `${percents.join(", ")} ${css}`;
    }

    let animationCss = `.${name} {\n`;

    animationCss += `  animation-name: ${name};\n`;

    const duration = reverseCSSTime(options.duration);
    animationCss += `  animation-duration: ${duration};\n`;

    let timingFunctionName =
        Object.entries(timingFunctions)
            .filter(([name, func]) => func === options.timingFunction)
            .map(([name]) => name)?.[0] ?? "linear";

    animationCss += `  animation-timing-function: ${timingFunctionName};\n`;

    animationCss += `  animation-iteration-count: ${
        isFinite(options.iterationCount) ? options.iterationCount : "infinite"
    };\n`;
    animationCss += `  animation-direction: ${options.direction};\n`;
    animationCss += `  animation-fill-mode: ${options.fillMode};\n`;

    if (options.delay > 0) {
        animationCss += `  animation-delay: ${reverseCSSTime(options.delay)};\n`;
    }

    animationCss += `}\n`;

    const keyframes = `${animationCss}\n@keyframes ${name} {\n${keyframesString}}`;

    const out = await prettier.format(keyframes, {
        parser: "scss",
        plugins: [prettierPostCSSPlugin],
        printWidth,
    });

    return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
