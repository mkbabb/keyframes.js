/**
 * presets/classic.ts — the classic preset catalog FACTORIES (S.B5 / fold row 32).
 * Each factory wraps a raw \`@keyframes\` CSS string (imported from \`./classic-data\`
 * — the data-volume split) in a \`CSSKeyframesAnimation\` with its default duration/
 * easing, merging any consumer override (genuine-omission defaulting; malformed
 * PRESENT values still throw in the setters — the fail-explicit seam). HEAVY: each
 * returns a \`CSSKeyframesAnimation\`, so the catalog rides \`loadAnimationEngine()\`.
 */
import { CSSCubicBezier, steppedEase } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../engine";
import type { InputAnimationOptions } from "../constants";
import {
    fadeInKeyframes,
    fadeOutKeyframes,
    pulseKeyframes,
    shakeKeyframes,
    bounceKeyframes,
    flipKeyframes,
    rotateInKeyframes,
    slideInKeyframes,
    heartbeatKeyframes,
    glowKeyframes,
    typewriterKeyframes,
    rainbowTextKeyframes,
    warpLeftKeyframes,
    warpRightKeyframes,
    blurInKeyframes,
    blurOutKeyframes,
    blurInOutKeyframes,
    progressBarKeyframes,
    skeletonLoadingKeyframes,
    textFocusBlurKeyframes,
    gradientBackgroundKeyframes,
    rotateScaleKeyframes,
    typingCursorKeyframes,
    accordionExpandKeyframes,
    notificationBounceKeyframes,
    spinnerKeyframes,
    parallaxScrollKeyframes,
    slideInLeftKeyframes,
    slideOutLeftKeyframes,
    slideInRightKeyframes,
    slideOutRightKeyframes,
    hoverKeyframes,
    jumpUpKeyframes,
    jumpDownKeyframes,
} from "./classic-data";

export const fadeIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "ease-in-out",
        // Preset-default + consumer-override merge: genuine-omission
        // defaulting is the sanctioned contract; malformed PRESENT values
        // throw in the setters (the fail-explicit seam), so the spread
        // cannot mask bad input.
        ...(options ?? {}),
    }).fromString(fadeInKeyframes);

export const fadeOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(fadeOutKeyframes);

export const pulse = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(pulseKeyframes);

export const shake = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 820,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(shakeKeyframes);

export const bounce = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.28, 0.84, 0.42, 1),
        ...(options ?? {}),
    }).fromString(bounceKeyframes);

export const flipPreset = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(flipKeyframes);

export const rotateIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(rotateInKeyframes);

export const slideIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInKeyframes);

export const heartbeat = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1500,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(heartbeatKeyframes);

export const glow = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(glowKeyframes);

export const typewriter = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: steppedEase(40, "jump-end"),
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(typewriterKeyframes);

export const rainbowText = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 5000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(rainbowTextKeyframes);

export const warpLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(warpLeftKeyframes);

export const warpRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(warpRightKeyframes);

export const blurIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurInKeyframes);

export const blurOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurOutKeyframes);

export const blurInOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurInOutKeyframes);

export const progressBar = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: "linear",
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(progressBarKeyframes);

export const skeletonLoading = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1500,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(skeletonLoadingKeyframes);

export const textFocusBlur = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(textFocusBlurKeyframes);

export const gradientBackground = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 5000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(gradientBackgroundKeyframes);

export const rotateScale = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2500,
        timingFunction: CSSCubicBezier(0.68, -0.55, 0.265, 1.55),
        ...(options ?? {}),
    }).fromString(rotateScaleKeyframes);

export const typingCursor = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 800,
        timingFunction: steppedEase(2, "jump-start"),
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(typingCursorKeyframes);

export const accordionExpand = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 500,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(accordionExpandKeyframes);

export const notificationBounce = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.28, 0.84, 0.42, 1),
        ...(options ?? {}),
    }).fromString(notificationBounceKeyframes);

export const spinner = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(spinnerKeyframes);

export const parallaxScroll = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 10000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(parallaxScrollKeyframes);

export const slideInLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInLeftKeyframes);

export const slideOutLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideOutLeftKeyframes);

export const slideInRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInRightKeyframes);

export const slideOutRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideOutRightKeyframes);

export const hover = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        fillMode: "none",
        direction: "alternate",
        ...(options ?? {}),
    }).fromString(hoverKeyframes);

export const jumpUp = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(jumpUpKeyframes);

export const jumpDown = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(jumpDownKeyframes);
