import { springTimingFunction } from "../physics/spring";
import { CSSKeyframesAnimation } from "../engine";
import type { InputAnimationOptions } from "../constants";
import * as classicData from "./classic-data";
type PresetGroup = "enter" | "exit" | "attention" | "loop";
type PresetFactory = (
    options?: InputAnimationOptions,
) => CSSKeyframesAnimation<any>;
type PresetSpec = {
    css: string;
    options: InputAnimationOptions;
    group?: PresetGroup;
    taxonomyName?: string;
};
const bare = (css: string) =>
    /^\s*@keyframes\s+[^\s{]+\s*\{([\s\S]*)\}\s*$/.exec(css)?.[1] ?? css;
const SPRING_SNAPPY = { response: 0.35, dampingFraction: 0.78 } as const;
const SPRING_BOUNCY = { response: 0.5, dampingFraction: 0.5 } as const;
const SPRING_GENTLE = { response: 0.7, dampingFraction: 0.95 } as const;
const springCss = {
    springScaleInKeyframes:
        "\n  0% {\n    transform: scale(0.6);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n",
    springSlideInKeyframes:
        "\n  0% {\n    transform: translateY(40px);\n    opacity: 0;\n  }\n  100% {\n    transform: translateY(0);\n    opacity: 1;\n  }\n",
    springPopKeyframes:
        "\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.15);\n  }\n",
    springWobbleKeyframes:
        "\n  0%, 100% {\n    transform: rotate(0deg);\n  }\n  50% {\n    transform: rotate(8deg);\n  }\n",
};
export const PRESET_SPECS = {
    fadeIn: {
        css: bare(classicData.fadeInKeyframes),
        options: { duration: 700, timingFunction: "ease-in-out" },
        group: "enter",
    },
    fadeOut: {
        css: bare(classicData.fadeOutKeyframes),
        options: { duration: 700, timingFunction: "ease-in-out" },
        group: "exit",
    },
    pulse: {
        css: bare(classicData.pulseKeyframes),
        options: {
            duration: 1000,
            timingFunction: "ease-in-out",
            iterationCount: Infinity,
        },
        group: "attention",
    },
    shake: {
        css: bare(classicData.shakeKeyframes),
        options: { duration: 820, timingFunction: "ease-in-out" },
        group: "attention",
    },
    bounce: {
        css: bare(classicData.bounceKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.28, 0.84, 0.42, 1)",
        },
        group: "attention",
    },
    flipPreset: {
        css: bare(classicData.flipKeyframes),
        options: { duration: 1000, timingFunction: "ease-in-out" },
        group: "attention",
        taxonomyName: "flip",
    },
    rotateIn: {
        css: bare(classicData.rotateInKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "enter",
    },
    slideIn: {
        css: bare(classicData.slideInKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "enter",
    },
    heartbeat: {
        css: bare(classicData.heartbeatKeyframes),
        options: {
            duration: 1500,
            timingFunction: "ease-in-out",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    glow: {
        css: bare(classicData.glowKeyframes),
        options: {
            duration: 2000,
            timingFunction: "ease-in-out",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    typewriter: {
        css: bare(classicData.typewriterKeyframes),
        options: {
            duration: 3000,
            timingFunction: "steps(40, jump-end)",
            fillMode: "forwards",
        },
    },
    rainbowText: {
        css: bare(classicData.rainbowTextKeyframes),
        options: {
            duration: 5000,
            timingFunction: "linear",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    warpLeft: {
        css: bare(classicData.warpLeftKeyframes),
        options: { duration: 700, timingFunction: "ease-in-bounce" },
        group: "exit",
    },
    warpRight: {
        css: bare(classicData.warpRightKeyframes),
        options: { duration: 700, timingFunction: "ease-in-bounce" },
        group: "exit",
    },
    blurIn: {
        css: bare(classicData.blurInKeyframes),
        options: { duration: 2000, timingFunction: "ease-in-out" },
        group: "enter",
    },
    blurOut: {
        css: bare(classicData.blurOutKeyframes),
        options: { duration: 2000, timingFunction: "ease-in-out" },
        group: "exit",
    },
    blurInOut: {
        css: bare(classicData.blurInOutKeyframes),
        options: { duration: 2000, timingFunction: "ease-in-out" },
    },
    progressBar: {
        css: bare(classicData.progressBarKeyframes),
        options: {
            duration: 3000,
            timingFunction: "linear",
            fillMode: "forwards",
        },
    },
    skeletonLoading: {
        css: bare(classicData.skeletonLoadingKeyframes),
        options: {
            duration: 1500,
            timingFunction: "linear",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    textFocusBlur: {
        css: bare(classicData.textFocusBlurKeyframes),
        options: { duration: 2000, timingFunction: "ease-in-out" },
    },
    gradientBackground: {
        css: bare(classicData.gradientBackgroundKeyframes),
        options: {
            duration: 5000,
            timingFunction: "ease-in-out",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    rotateScale: {
        css: bare(classicData.rotateScaleKeyframes),
        options: {
            duration: 2500,
            timingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        },
    },
    typingCursor: {
        css: bare(classicData.typingCursorKeyframes),
        options: {
            duration: 800,
            timingFunction: "steps(2, jump-start)",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    accordionExpand: {
        css: bare(classicData.accordionExpandKeyframes),
        options: {
            duration: 500,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fillMode: "forwards",
        },
    },
    notificationBounce: {
        css: bare(classicData.notificationBounceKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.28, 0.84, 0.42, 1)",
        },
        group: "attention",
    },
    spinner: {
        css: bare(classicData.spinnerKeyframes),
        options: {
            duration: 2000,
            timingFunction: "linear",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    parallaxScroll: {
        css: bare(classicData.parallaxScrollKeyframes),
        options: {
            duration: 10000,
            timingFunction: "linear",
            iterationCount: Infinity,
        },
        group: "loop",
    },
    slideInLeft: {
        css: bare(classicData.slideInLeftKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "enter",
    },
    slideOutLeft: {
        css: bare(classicData.slideOutLeftKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "exit",
    },
    slideInRight: {
        css: bare(classicData.slideInRightKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "enter",
    },
    slideOutRight: {
        css: bare(classicData.slideOutRightKeyframes),
        options: {
            duration: 1000,
            timingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
        group: "exit",
    },
    hover: {
        css: bare(classicData.hoverKeyframes),
        options: {
            duration: 3000,
            timingFunction: "ease-in-out",
            iterationCount: Infinity,
            fillMode: "none",
            direction: "alternate",
        },
        group: "loop",
    },
    jumpUp: {
        css: bare(classicData.jumpUpKeyframes),
        options: { duration: 700, timingFunction: "ease-in-bounce" },
        group: "enter",
    },
    jumpDown: {
        css: bare(classicData.jumpDownKeyframes),
        options: { duration: 700, timingFunction: "ease-in-bounce" },
        group: "exit",
    },
    springScaleIn: {
        css: springCss.springScaleInKeyframes,
        options: {
            duration: 600,
            timingFunction: springTimingFunction(SPRING_BOUNCY),
        },
        group: "enter",
    },
    springSlideIn: {
        css: springCss.springSlideInKeyframes,
        options: {
            duration: 600,
            timingFunction: springTimingFunction(SPRING_SNAPPY),
        },
        group: "enter",
    },
    springPop: {
        css: springCss.springPopKeyframes,
        options: {
            duration: 700,
            timingFunction: springTimingFunction(SPRING_BOUNCY),
        },
        group: "attention",
    },
    springWobble: {
        css: springCss.springWobbleKeyframes,
        options: {
            duration: 800,
            timingFunction: springTimingFunction(SPRING_GENTLE),
        },
        group: "attention",
    },
} as const satisfies Record<string, PresetSpec>;
const definePreset =
    (spec: PresetSpec): PresetFactory =>
    (options) =>
        new CSSKeyframesAnimation({
            ...spec.options,
            ...(options ?? {}),
        }).fromString(spec.css);
export const presetFactories = Object.fromEntries(
    Object.entries(PRESET_SPECS).map(([name, spec]) => [
        name,
        definePreset(spec),
    ]),
) as { [K in keyof typeof PRESET_SPECS]: PresetFactory };
export const {
    fadeIn,
    fadeOut,
    pulse,
    shake,
    bounce,
    flipPreset,
    rotateIn,
    slideIn,
    heartbeat,
    glow,
    typewriter,
    rainbowText,
    warpLeft,
    warpRight,
    blurIn,
    blurOut,
    blurInOut,
    progressBar,
    skeletonLoading,
    textFocusBlur,
    gradientBackground,
    rotateScale,
    typingCursor,
    accordionExpand,
    notificationBounce,
    spinner,
    parallaxScroll,
    slideInLeft,
    slideOutLeft,
    slideInRight,
    slideOutRight,
    hover,
    jumpUp,
    jumpDown,
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
} = presetFactories;
const group = (wanted: PresetGroup): Readonly<Record<string, PresetFactory>> =>
    Object.fromEntries(
        (
            Object.entries(PRESET_SPECS) as [
                keyof typeof PRESET_SPECS,
                PresetSpec,
            ][]
        )
            .filter(([, s]) => s.group === wanted)
            .map(([name, s]) => [
                s.taxonomyName ?? name,
                presetFactories[name as keyof typeof presetFactories],
            ]),
    );
export const enterPresets = group("enter");
export const exitPresets = group("exit");
export const attentionPresets = group("attention");
export const loopPresets = group("loop");
export const presetTaxonomy = {
    enter: enterPresets,
    exit: exitPresets,
    attention: attentionPresets,
    loop: loopPresets,
} as const;
