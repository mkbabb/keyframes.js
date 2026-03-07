import { CSSKeyframesAnimation } from "@src/animation";

export function useSimpleAnimations() {
    const anim = new CSSKeyframesAnimation({
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
        fillMode: "forwards",
    });

    const CSSKeyframes = /*css*/ `
@keyframes mijn-keyframes {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(0turn);
        background-color: #C462D8;
    }
    100% {
        transform: translateX(50%) translateY(75%) rotate(1turn);
        background-color: #E85252;
    }
}
`;

    anim.fromString(CSSKeyframes);

    return { anim };
}
