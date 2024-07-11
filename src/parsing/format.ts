// import prettier from "prettier";
// import prettierPostCSSPlugin from "prettier/plugins/postcss";
// import { Animation, AnimationOptions, Vars } from "../animation";
// import { timingFunctions } from "../easing";
// import {
//     ValueUnit,
//     flattenReverseTransformedObject,
//     reverseTransformObject,
// } from "../units";
// import { camelCaseToHyphen } from "../utils";
// import {
//     reverseCSSTime,
//     parseCSSKeyframes,
//     parseCSSAnimationKeyframes,
// } from "./keyframes";

// const DEFAULT_WIDTH = 80 / 2;

// export async function formatCSS(
//     css: string,
//     printWidth: number | undefined = undefined,
// ) {
//     return await prettier.format(css, {
//         parser: "scss",
//         plugins: [prettierPostCSSPlugin],
//         printWidth: printWidth ?? DEFAULT_WIDTH,
//     });
// }

// const DEFAULT_KEYFRAME_HEADER = `@keyframes animation {\n`;
// const DEFAULT_KEYFRAME_FOOTER = `\n}`;

// export function normalizeCSSKeyframeString(keyframe: string) {
//     keyframe = keyframe.trim();

//     if (keyframe.startsWith("{") && keyframe.endsWith("}")) {
//         keyframe = keyframe.slice(1, -1);
//     }

//     if (!keyframe.includes("@keyframes")) {
//         keyframe = DEFAULT_KEYFRAME_HEADER + keyframe + DEFAULT_KEYFRAME_FOOTER;
//     }

//     return keyframe;
// }

// export function parseCSSAnimationOrKeyframes(keyframes: string): {
//     keyframes: any;
//     options?: AnimationOptions;
//     values?: any;
// } {
//     keyframes = normalizeCSSKeyframeString(keyframes);

//     try {
//         return parseCSSAnimationKeyframes(keyframes);
//     } catch (e) {
//         return {
//             keyframes: parseCSSKeyframes(keyframes),
//         };
//     }
// }

// export const CSSKeyframesToStrings = async <V>(animation: Animation<V>) => {
//     const frameStrings = animation.templateFrames.map(async (frame) => {
//         let css = CSSKeyframeToString(frame);

//         css = `${frame.start}\n${css}\n`;

//         css = DEFAULT_KEYFRAME_HEADER + css + DEFAULT_KEYFRAME_FOOTER;

//         css = await formatCSS(css, 40);

//         return css
//             .replace(DEFAULT_KEYFRAME_HEADER, "")
//             .replace(DEFAULT_KEYFRAME_FOOTER, "");

//         // de-indent the css:
//     });

//     return Promise.all(frameStrings);
// };

// export function formatCSSKeyframeString(keyframe: string) {
//     let s = keyframe
//         .replace(/^[^{]*{/, "")
//         .replace(/^  /gm, "")
//         .replace(/}\s*$/, "");

//     s = s.trim();

//     s = s.replace(/^  /, "");

//     return s;
// }

// export function animationOptionsToString(
//     options: AnimationOptions,
//     name: string = "animation",
// ) {
//     let css = "";

//     css += `  animation-name: ${name};\n`;

//     const duration = reverseCSSTime(options.duration);
//     css += `  animation-duration: ${duration};\n`;

//     let timingFunctionName =
//         Object.entries(timingFunctions)
//             .filter(([name, func]) => func === options.timingFunction)
//             .map(([name]) => name)?.[0] ?? "linear";

//     timingFunctionName = camelCaseToHyphen(timingFunctionName);

//     css += `  animation-timing-function: ${timingFunctionName};\n`;

//     css += `  animation-iteration-count: ${
//         isFinite(options.iterationCount) ? options.iterationCount : "infinite"
//     };\n`;
//     css += `  animation-direction: ${options.direction};\n`;
//     css += `  animation-fill-mode: ${options.fillMode};\n`;

//     if (options.delay > 0) {
//         css += `  animation-delay: ${reverseCSSTime(options.delay)};\n`;
//     }

//     css = `.animation {\n${css}}\n`;

//     return css;
// }

// export function CSSKeyframeToString<V extends Vars>(
//     frame: Animation<V>["templateFrames"][0],
// ) {
//     let css = `{\n`;

//     const reversedVars = {};
//     Object.entries(frame.vars).forEach(([key, value]: [string, ValueArray]) => {
//         reverseTransformObject(key, value, reversedVars);
//     });

//     for (let [name, v] of Object.entries(reversedVars)) {
//         name = camelCaseToHyphen(name);
//         let s = objectToString(name, v);
//         css += `  ${name}: ${s};\n`;
//     }
//     css += "  }\n";

//     return css;
// }

// export async function CSSKeyframesToString<V extends Vars>(
//     animation: Animation<V>,
//     name: string = "animation",
//     printWidth: number | undefined = undefined,
// ) {
//     const options = animation.options;
//     const keyframesMap = new Map<string, ValueUnit[]>();

//     animation.templateFrames.forEach(async (frame) => {
//         const cssString = CSSKeyframeToString(frame);

//         if (!keyframesMap.has(cssString)) {
//             keyframesMap.set(cssString, [frame.start]);
//         } else {
//             keyframesMap.get(cssString).push(frame.start);
//         }
//     });

//     let keyframesString = "";
//     for (let [css, percents] of keyframesMap) {
//         keyframesString += `${percents.join(", ")} ${css}`;
//     }

//     const animationOptionsString = animationOptionsToString(options, name);

//     const keyframes = `${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

//     const out = await formatCSS(keyframes, printWidth);

//     return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
// }
