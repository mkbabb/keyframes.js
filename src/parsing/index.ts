// import { lerp } from "@src/math";
// import config from "../../_tailwind.config";
// import { FunctionValue, ValueArray, ValueUnit } from "../units";
// import { normalizeColorUnits } from "../units/color/normalize";
// import { getComputedValue, normalizeNumericUnits } from "../units/normalize";
// import {
//     flattenObject,
//     isCSSStyleName,
//     unflattenObject,
//     unflattenObjectToString,
// } from "../units/utils";
// import { compileTailwindCss } from "../utils";
// import { CSSKeyframes, parseCSSKeyframes } from "./keyframes";
// import { COMPUTED_UNITS } from "@src/units/constants";
// import { Color } from "@src/units/color/utils";
// import { CSSKeyframesAnimation } from "@src/animation";

// // const ballAnim = /*css*/ `
// //     @keyframes ball {
// //         0% {
// //             color: red;
// //             background-color: theme("colors.gray.400");
// //             border-radius: translate(scale(0), 0) 25% / 25% 25%;
// //             transform: red translateX(0) translateZ(0) ;
// //         }
// //         0% {
// //            width: 10%;
// //         }
// //         25% {
// //             background-color: hsl(50% 100 50);
// //             border-radius: translate(scale(2), 2) 50% / 50% 50%;
// //         }
// //         1000ms {
// //             transform: translate(calc(100% - 20px), calc(50vh + 10%));
// //         }
// //         to {
// //             color: blue;
// //         }
// //     }`;

// const ballAnim = /*css*/ `
// @keyframes identifier {
//     0% {
//       top: 0;
//       left: 0;
//     }
//     30% {
//       top: 50px;
//     }
//     68%,
//     72% {
//       left: 50px;
//     }
//     100% {
//       top: 100px;
//       left: 100%;
//     }
//   }`;

// const parsed = {
//     "0%": {
//         backgroundColor: "gray",
//         borderRadius: [
//             {
//                 translate: [
//                     {
//                         scale: 0,
//                     },
//                     0,
//                 ],
//             },
//             "25%",
//             "/",
//             "25%",
//             "25%",
//         ],
//         transform: [
//             "red",
//             {
//                 translateX: 0,
//             },
//             {
//                 translateZ: 0,
//             },
//         ],
//         width: "10%",
//     },

//     "25%": {
//         backgroundColor: "hsl(50% 100 50)",
//         borderRadius: [
//             {
//                 translate: [
//                     {
//                         scale: 2,
//                     },
//                     2,
//                 ],
//             },
//             "50%",
//             "/",
//             "50%",
//             "50%",
//         ],
//     },

//     "100%": {
//         transform: [
//             {
//                 translate: [
//                     {
//                         calc: "100% - 20px",
//                     },
//                     {
//                         calc: "50vh + 10%",
//                     },
//                 ],
//             },
//         ],
//     },
// };

// async function main() {
//     // const compiled = await compileTailwindCss(ballAnim, config);

//     // const parsed = parseCSSKeyframes(compiled);

//     // const vars = [];
//     // for (const [key, value] of Object.entries(parsed)) {
//     //     // const flat1 = flattenObject(value);
//     //     const flat1 = parseAndFlattenObject(value);

//     //     const string1 = unflattenObjectToString(flat1);

//     //     console.log(key, flat1, string1);

//     //     vars.push(flat1);
//     // }

//     // const frames = [];

//     // for (let i = 0; i < vars.length - 1; i++) {
//     //     const interpVars = reconcileVars(i, vars, frames);
//     //     if (interpVars == null) {
//     //         continue;
//     //     }

//     //     frames.push({ interpVars });
//     // }

//     // for (const frame of frames) {
//     //     frame.vars = Object.entries(frame.interpVars).reduce((acc, [key, value]) => {
//     //         // @ts-ignore
//     //         acc[key] = value.map((v) => v.startValueUnit);
//     //         return acc;
//     //     }, {});
//     // }

//     // for (const frame of frames) {
//     //     Object.values(frame.interpVars).forEach((values) => {
//     //         // @ts-ignore
//     //         values.forEach((v) => {
//     //             lerpValue(0.5, v);
//     //         });
//     //     });

//     //     const s = unflattenObjectToString(frame.vars);
//     //     const o = unflattenObject(frame.vars);

//     //     console.log(s, o);
//     // }

//     // console.log(frames);

//     const anim = new CSSKeyframesAnimation().fromString(ballAnim);

//     console.log(anim);
// }

// main();
