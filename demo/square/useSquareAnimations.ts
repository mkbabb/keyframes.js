import { CSSKeyframesAnimation } from "@src/animation";
import type { Ref } from "vue";

export const SUPER_KEY = "Square";

export function useSquareAnimations(box: Ref<HTMLElement | undefined>) {
    const anim = new CSSKeyframesAnimation({
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
        fillMode: "forwards",
    });

    const transformFunc = (vars: Record<string, any>) => {
        const el = box.value;
        if (!el) return;

        const { transform, backgroundColor, fontSize, rotate } = vars;

        if (transform) {
            el.style.transform = `translate(${transform.x}, ${transform.y}) scale(${transform.a.b.c.d})`;
        }
        if (backgroundColor) {
            el.style.backgroundColor = backgroundColor;
        }
        if (fontSize) {
            el.style.fontSize = fontSize;
        }
        if (rotate) {
            el.style.transform += ` rotate(${rotate})`;
        }
    };

    const transformStart = {
        x: "-100%",
        y: "-100%",
        a: { b: { c: { d: "75%" } } },
    };

    const transformEnd = {
        x: "50%",
        y: "75%",
        a: { b: { c: { d: "200%" } } },
    };

    anim.fromKeyframes(
        {
            "0%": {
                rotate: "0turn",
                transform: transformStart,
                backgroundColor: "#C462D8",
            },
            "50%": {
                backgroundColor: "#6280D8",
            },
            "75%": {
                backgroundColor: "#52E898",
                fontSize: "1rem",
            },
            "100%": {
                rotate: "1turn",
                transform: transformEnd,
                backgroundColor: "#E85252",
                fontSize: "3rem",
            },
        },
        transformFunc,
    );

    return { anim };
}
