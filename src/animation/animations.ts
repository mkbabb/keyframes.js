import { CSSCubicBezier, steppedEase } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "./engine";
import { springTimingFunction } from "./springTimingFunction";
import type { InputAnimationOptions } from "./constants";

const fadeInKeyframes = /*css*/ `
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
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

const fadeOutKeyframes = /*css*/ `
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;
export const fadeOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(fadeOutKeyframes);

const pulseKeyframes = /*css*/ `
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;
export const pulse = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(pulseKeyframes);

const shakeKeyframes = /*css*/ `
8%,
41% {
    transform: translateX(-10px);
}
25%,
58% {
    transform: translateX(10px);
}
75% {
    transform: translateX(-5px);
}
92% {
    transform: translateX(5px);
}
0%,
100% {
    transform: translateX(0);
}
`;
export const shake = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 820,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(shakeKeyframes);

const bounceKeyframes = /*css*/ `
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;
export const bounce = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.28, 0.84, 0.42, 1),
        ...(options ?? {}),
    }).fromString(bounceKeyframes);

const flipKeyframes = /*css*/ `
  0% {
    transform: perspective(400px) rotateY(0);
    animation-timing-function: ease-out;
  }
  40% {
    transform: perspective(400px) translateZ(150px) rotateY(170deg);
    animation-timing-function: ease-out;
  }
  50% {
    transform: perspective(400px) translateZ(150px) rotateY(190deg) scale(1);
    animation-timing-function: ease-in;
  }
  80% {
    transform: perspective(400px) rotateY(360deg) scale(.95);
    animation-timing-function: ease-in;
  }
  100% {
    transform: perspective(400px) scale(1);
    animation-timing-function: ease-in;
  }
`;
/**
 * The card-flip attention preset.
 *
 * ── PKG-3 RENAME (L.W8 §S4 · audit W126). Formerly the preset `flip`. Renamed
 * `flip` → `flipPreset` because the rolled-up `dist/keyframes.d.ts` placed this
 * preset (reachable as `presets.flip`) and the LIGHT top-level `flip` export
 * (the FLIP-layout helper in `flip.ts`) under the same name `flip`, so API
 * Extractor renamed this one with a numeric suffix and re-exported it under the
 * `flip` name inside the `AnimationPresets` namespace — a numeric-suffixed alias
 * `proof:pkg3-clean` greps for. Naming the preset `flipPreset` (distinct from the
 * light `flip`) clears the collision. BREAKING (5.0.0): the access path is now
 * `presets.flipPreset`; the nested taxonomy key `attentionPresets.flip` is
 * unchanged (a property name, not a top-level declaration — no collision).
 */
export const flipPreset = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(flipKeyframes);

const rotateInKeyframes = /*css*/ `
  0% {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
  }
  100% {
    transform-origin: center;
    transform: none;
    opacity: 1;
  }
`;
export const rotateIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(rotateInKeyframes);

const slideInKeyframes = /*css*/ `
  0% {
    transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
export const slideIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInKeyframes);

const heartbeatKeyframes = /*css*/ `
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
`;
export const heartbeat = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1500,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(heartbeatKeyframes);

const glowKeyframes = /*css*/ `
  0%, 100% {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  }
`;
export const glow = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(glowKeyframes);

const typewriterKeyframes = /*css*/ `
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;
export const typewriter = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: steppedEase(40, "jump-end"),
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(typewriterKeyframes);

const rainbowTextKeyframes = /*css*/ `
  0% {
    color: red;
  }
  15% {
    color: orange;
  }
  30% {
    color: yellow;
  }
  45% {
    color: green;
  }
  60% {
    color: blue;
  }
  75% {
    color: indigo;
  }
  90% {
    color: violet;
  }
  100% {
    color: red;
  }
`;
export const rainbowText = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 5000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(rainbowTextKeyframes);

const warpLeftKeyframes =
    /*css*/
    `@keyframes keyframeDelete {
    0% {
        transform: translateX(0%) rotate(0deg);
        opacity: 1;
    }
    25% {
        transform: translateX(0%) rotate(5deg);
        opacity: 1;
    }
    50% {
        transform: translateX(25%) rotate(10deg);
        opacity: 0.5;
    }
    75% {
        transform: translateX(0%) rotate(0deg);
        opacity: 0.25;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
}`;

export const warpLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(warpLeftKeyframes);

const warpRightKeyframes =
    /*css*/
    `@keyframes keyframeDelete {
    0% {
        transform: translateX(0%) rotate(0deg);
        opacity: 1;
    }
    25% {
        transform: translateX(0%) rotate(-5deg);
        opacity: 1;
    }
    50% {
        transform: translateX(-25%) rotate(-10deg);
        opacity: 0.5;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}`;

export const warpRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(warpRightKeyframes);

const blurInKeyframes = /*css*/ `
0% {
  filter: blur(10px);
  opacity: 0;
}
100% {
  filter: blur(0px);
  opacity: 1;
}
`;

export const blurIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurInKeyframes);

const blurOutKeyframes = /*css*/ `
0% {
  filter: blur(0px);
  opacity: 1;
}
100% {
  filter: blur(10px);
  opacity: 0;
}
`;
export const blurOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurOutKeyframes);

const blurInOutKeyframes = /*css*/ `
0% {
  filter: blur(0px);
}
50% {
  filter: blur(10px);
}
100% {
  filter: blur(0px);
}
`;
export const blurInOut = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(blurInOutKeyframes);

const progressBarKeyframes = /*css*/ `
0% {
  width: 0%;
  background-color: #ff9999;
}
25% {
  width: 25%;
  background-color: #ffcc99;
}
50% {
  width: 50%;
  background-color: #ffff99;
}
75% {
  width: 75%;
  background-color: #99ff99;
}
100% {
  width: 100%;
  background-color: #99ccff;
}
`;
export const progressBar = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: "linear",
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(progressBarKeyframes);

const skeletonLoadingKeyframes = /*css*/ `
0% {
  background-position: -200% 0;
}
100% {
  background-position: 200% 0;
}
`;
export const skeletonLoading = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1500,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(skeletonLoadingKeyframes);

const textFocusBlurKeyframes = /*css*/ `
0%, 100% {
  filter: blur(0px);
  opacity: 1;
}
50% {
  filter: blur(4px);
  opacity: 0.5;
}
`;
export const textFocusBlur = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromString(textFocusBlurKeyframes);

const gradientBackgroundKeyframes = /*css*/ `
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`;
export const gradientBackground = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 5000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(gradientBackgroundKeyframes);

const rotateScaleKeyframes = /*css*/ `
0% {
  transform: rotate(0deg) scale(1);
}
25% {
  transform: rotate(90deg) scale(1.1);
}
50% {
  transform: rotate(180deg) scale(1);
}
75% {
  transform: rotate(270deg) scale(0.9);
}
100% {
  transform: rotate(360deg) scale(1);
}
`;
export const rotateScale = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2500,
        timingFunction: CSSCubicBezier(0.68, -0.55, 0.265, 1.55),
        ...(options ?? {}),
    }).fromString(rotateScaleKeyframes);

const typingCursorKeyframes = /*css*/ `
0%, 100% {
  border-right-color: transparent;
}
50% {
  border-right-color: black;
}
`;
export const typingCursor = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 800,
        timingFunction: steppedEase(2, "jump-start"),
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(typingCursorKeyframes);

const accordionExpandKeyframes = /*css*/ `
0% {
  max-height: 0;
  opacity: 0;
}
100% {
  max-height: 1000px;
  opacity: 1;
}
`;
export const accordionExpand = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 500,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        fillMode: "forwards",
        ...(options ?? {}),
    }).fromString(accordionExpandKeyframes);

const notificationBounceKeyframes = /*css*/ `
0%, 100% {
  transform: translateY(0);
}
25% {
  transform: translateY(-10px);
}
50% {
  transform: translateY(0);
}
75% {
  transform: translateY(-5px);
}
`;
export const notificationBounce = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.28, 0.84, 0.42, 1),
        ...(options ?? {}),
    }).fromString(notificationBounceKeyframes);

const spinnerKeyframes = /*css*/ `
0% {
  transform: rotate(0deg);
  border-radius: 50%;
}
25% {
  transform: rotate(90deg);
  border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
}
50% {
  transform: rotate(180deg);
  border-radius: 50%;
}
75% {
  transform: rotate(270deg);
  border-radius: 60% 40% 40% 60% / 60% 60% 40% 40%;
}
100% {
  transform: rotate(360deg);
  border-radius: 50%;
}
`;
export const spinner = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(spinnerKeyframes);

const parallaxScrollKeyframes = /*css*/ `
0% {
  background-position: 50% 0%;
}
100% {
  background-position: 50% 100%;
}
`;
export const parallaxScroll = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 10000,
        timingFunction: "linear",
        iterationCount: Infinity,
        ...(options ?? {}),
    }).fromString(parallaxScrollKeyframes);

export const slideInLeftKeyframes = /*css*/ `
0% {
  transform: translateX(-100%);
  opacity: 0;
}
100% {
  transform: translateX(0);
  opacity: 1;
}
`;
export const slideInLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInLeftKeyframes);

const slideOutLeftKeyframes = /*css*/ `
0% {
  transform: translateX(0);
  opacity: 1;
}
100% {
  transform: translateX(-100%);
  opacity: 0;
}
`;

export const slideOutLeft = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideOutLeftKeyframes);

export const slideInRightKeyframes = /*css*/ `
0% {
  transform: translateX(100%);
  opacity: 0;
}
100% {
  transform: translateX(0);
  opacity: 1;
}
`;
export const slideInRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideInRightKeyframes);

const slideOutRightKeyframes = /*css*/ `
0% {
  transform: translateX(0%);
  opacity: 1;

}
100% {
  transform: translateX(100%);
  opacity: 0;
}
`;
export const slideOutRight = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: CSSCubicBezier(0.25, 0.46, 0.45, 0.94),
        ...(options ?? {}),
    }).fromString(slideOutRightKeyframes);

const hoverKeyframes = /*css*/ `
0% {
  transform: translateY(0px);
}
50% {
  transform: translateY(5px);
}
100% {
  transform: translateY(0px);
}
`;

export const hover = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 3000,
        timingFunction: "ease-in-out",
        iterationCount: Infinity,
        fillMode: "none",
        direction: "alternate",
        ...(options ?? {}),
    }).fromString(hoverKeyframes);

const jumpUpKeyframes = /*css*/ `@keyframes keyframeShift {
0% {
    transform: translateY(0%);
    opacity: 1;
}

50% {
    transform: translateY(-50%);
    opacity: 0.75;
}

100% {
    transform: translateY(-100%);
    opacity: 1;
}
}`;

export const jumpUp = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(jumpUpKeyframes);

const jumpDownKeyframes = /*css*/ `@keyframes keyframeShift {
0% {
    transform: translateY(0%);
    opacity: 1;
}

50% {
    transform: translateY(50%);
    opacity: 0.75;
}

100% {
    transform: translateY(100%);
    opacity: 1;
}
}`;

export const jumpDown = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "bounce-in-ease",
        ...(options ?? {}),
    }).fromString(jumpDownKeyframes);

// ── Spring-eased presets (E.W10 §S6) ─────────────────────────────────────
//
// The preset library above leans on `cubic-bezier`/keyword easings. These
// reach for the in-house analytic spring via `springTimingFunction` — the
// same solver `springLinearStops` drives, paired with its CSS `linear()` twin
// so a WAAPI delegation runs the true overshoot on the compositor. `(response,
// dampingFraction)` is the SwiftUI-canonical surface; the values below mirror
// the four glass-ui `--spring-*` token presets (smooth / snappy / bouncy /
// gentle) so demo and engine speak one spring vocabulary.

/** The four canonical iOS spring presets, as typed `Easing` curves. */
const SPRING_SMOOTH = { response: 0.5, dampingFraction: 0.86 } as const;
const SPRING_SNAPPY = { response: 0.35, dampingFraction: 0.78 } as const;
const SPRING_BOUNCY = { response: 0.5, dampingFraction: 0.5 } as const;
const SPRING_GENTLE = { response: 0.7, dampingFraction: 0.95 } as const;

const springScaleInKeyframes = /*css*/ `
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;
/**
 * Spring-eased scale-in entrance — the canonical iOS "pop" with overshoot.
 * Uses the bouncy spring (ζ 0.5) so the element settles past 1 before resting.
 */
export const springScaleIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 600,
        timingFunction: springTimingFunction(SPRING_BOUNCY),
        ...(options ?? {}),
    }).fromString(springScaleInKeyframes);

const springSlideInKeyframes = /*css*/ `
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
/** Spring-eased slide-up entrance — the snappy spring (ζ 0.78). */
export const springSlideIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 600,
        timingFunction: springTimingFunction(SPRING_SNAPPY),
        ...(options ?? {}),
    }).fromString(springSlideInKeyframes);

const springPopKeyframes = /*css*/ `
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
`;
/** Spring-eased attention "pop" — the bouncy spring drives the scale pulse. */
export const springPop = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: springTimingFunction(SPRING_BOUNCY),
        ...(options ?? {}),
    }).fromString(springPopKeyframes);

const springWobbleKeyframes = /*css*/ `
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(8deg);
  }
`;
/** Spring-eased wobble — gentle spring (ζ 0.95) for a soft attention nudge. */
export const springWobble = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 800,
        timingFunction: springTimingFunction(SPRING_GENTLE),
        ...(options ?? {}),
    }).fromString(springWobbleKeyframes);

// ── Preset taxonomy (E.W10 §S6) ──────────────────────────────────────────
//
// An enter / exit / attention / loop grouping over the existing preset
// library — the categories the genre (Motion variants, anime.js, animate.css)
// leads with. Pure organization: every value is an existing exported factory,
// so the taxonomy adds no new pixels — it makes the library DISCOVERABLE by
// intent ("show me the entrances") without re-implementing a single preset.

/** Entrance animations — bring an element INTO view. */
export const enterPresets = {
    fadeIn,
    slideIn,
    slideInLeft,
    slideInRight,
    rotateIn,
    blurIn,
    springScaleIn,
    springSlideIn,
    jumpUp,
} as const;

/** Exit animations — take an element OUT of view. */
export const exitPresets = {
    fadeOut,
    slideOutLeft,
    slideOutRight,
    blurOut,
    warpLeft,
    warpRight,
    jumpDown,
} as const;

/** Attention animations — a one-shot nudge to draw the eye. */
export const attentionPresets = {
    pulse,
    shake,
    bounce,
    // The taxonomy key stays `flip` (a nested property — no top-level
    // collision); the factory is the renamed `flipPreset` (PKG-3, L.W8 §S4).
    flip: flipPreset,
    notificationBounce,
    springPop,
    springWobble,
} as const;

/** Looping animations — run continuously (`iterationCount: Infinity`). */
export const loopPresets = {
    heartbeat,
    glow,
    spinner,
    rainbowText,
    skeletonLoading,
    gradientBackground,
    parallaxScroll,
    hover,
    typingCursor,
} as const;

/**
 * The full preset taxonomy, grouped by intent. Each leaf is one of the
 * existing exported factory functions — the taxonomy is a discovery index over
 * the library, not a second copy of it.
 */
export const presetTaxonomy = {
    enter: enterPresets,
    exit: exitPresets,
    attention: attentionPresets,
    loop: loopPresets,
} as const;
