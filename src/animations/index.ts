import { CSSKeyframesAnimation, InputAnimationOptions } from "../animation";
import { CSSCubicBezier, steppedEase } from "../easing";

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
        ...(options ?? {}),
    }).fromCSSKeyframes(fadeInKeyframes);

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
    }).fromCSSKeyframes(fadeOutKeyframes);

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
    }).fromCSSKeyframes(pulseKeyframes);

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
    }).fromCSSKeyframes(shakeKeyframes);

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
    }).fromCSSKeyframes(bounceKeyframes);

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
export const flip = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "ease-in-out",
        ...(options ?? {}),
    }).fromCSSKeyframes(flipKeyframes);

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
    }).fromCSSKeyframes(rotateInKeyframes);

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
    }).fromCSSKeyframes(slideInKeyframes);

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
    }).fromCSSKeyframes(heartbeatKeyframes);

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
    }).fromCSSKeyframes(glowKeyframes);

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
    }).fromCSSKeyframes(typewriterKeyframes);

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
    }).fromCSSKeyframes(rainbowTextKeyframes);

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
    }).fromCSSKeyframes(warpLeftKeyframes);

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
    }).fromCSSKeyframes(warpRightKeyframes);

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
    }).fromCSSKeyframes(blurInKeyframes);

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
    }).fromCSSKeyframes(blurOutKeyframes);

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
    }).fromCSSKeyframes(blurInOutKeyframes);

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
    }).fromCSSKeyframes(progressBarKeyframes);

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
    }).fromCSSKeyframes(skeletonLoadingKeyframes);

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
    }).fromCSSKeyframes(textFocusBlurKeyframes);

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
    }).fromCSSKeyframes(gradientBackgroundKeyframes);

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
    }).fromCSSKeyframes(rotateScaleKeyframes);

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
    }).fromCSSKeyframes(typingCursorKeyframes);

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
    }).fromCSSKeyframes(accordionExpandKeyframes);

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
    }).fromCSSKeyframes(notificationBounceKeyframes);

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
    }).fromCSSKeyframes(spinnerKeyframes);

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
    }).fromCSSKeyframes(parallaxScrollKeyframes);

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
    }).fromCSSKeyframes(slideInLeftKeyframes);

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
    }).fromCSSKeyframes(slideOutLeftKeyframes);

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
    }).fromCSSKeyframes(slideInRightKeyframes);

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
    }).fromCSSKeyframes(slideOutRightKeyframes);

const hoverKeyframes = /*css*/ `
0% {
  transform: translateY(0px);
}
50% {
  transform: translateY(10px);
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
        // fillMode: "both",
        direction: "alternate",
        ...(options ?? {}),
    }).fromCSSKeyframes(hoverKeyframes);

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
    }).fromCSSKeyframes(jumpUpKeyframes);

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
    }).fromCSSKeyframes(jumpDownKeyframes);
