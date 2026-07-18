import { SpringProgress } from "@mkbabb/keyframes.js";
import { parseCssColor, serializeCssColor, type CssColor } from "@mkbabb/value.js/css";
import { mixColors } from "@mkbabb/value.js/color";
import { onMounted, onScopeDispose } from "vue";

/** The square's private tumble egg: spin state plus perceptual palette sampling. */
export function useSquareTumble(startLoop: () => void) {
    const spin = new SpringProgress({ response: 0.55, dampingFraction: 0.58, initial: 0 });
    const hues = ["#C462D8", "#7E6BE8", "#52E898"];
    let target = 0;

    onMounted(() => {
        const style = getComputedStyle(document.documentElement);
        const tokens = ["--rainbow-violet", "--rainbow-cyan", "--rainbow-green"];
        tokens.forEach((token, index) => {
            const value = style.getPropertyValue(token).trim();
            if (value) hues[index] = value;
        });
    });

    const asColor = (css: string): CssColor => {
        const parsed = parseCssColor(css);
        if (!parsed.ok) throw new TypeError(`Invalid square palette color: ${css}`);
        return parsed.value;
    };

    const colorAt = (t: number): string => {
        const span = hues.length - 1;
        const index = Math.min(span - 1, Math.floor(t * span));
        const mixed = mixColors(
            asColor(hues[index]!),
            asColor(hues[index + 1]!),
            t * span - index,
            { space: "oklab" },
        );
        if (!mixed.ok) throw new TypeError("Square palette interpolation failed.");
        const serialized = serializeCssColor(mixed.value as CssColor);
        if (!serialized.ok) throw new TypeError("Square palette serialization failed.");
        return serialized.value;
    };

    const tumble = () => {
        target += 360;
        spin.target = target;
        startLoop();
    };

    onScopeDispose(() => spin.dispose());
    return { spin, colorAt, tumble };
}
