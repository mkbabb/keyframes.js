import { SpringProgress } from "@mkbabb/keyframes.js";
import { parseCSSColor } from "@mkbabb/value.js/parsing";
import { RGBColor, color2, sampleColorRampAt } from "@mkbabb/value.js/color";
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

    const asColor = (css: string): RGBColor => {
        const { r, g, b, alpha } = parseCSSColor(css).value as unknown as {
            r: number; g: number; b: number; alpha?: number;
        };
        return new RGBColor(r / 255, g / 255, b / 255, alpha ?? 1);
    };

    const colorAt = (t: number): string => {
        const span = hues.length - 1;
        const index = Math.min(span - 1, Math.floor(t * span));
        const mixed = sampleColorRampAt(
            asColor(hues[index]!),
            asColor(hues[index + 1]!),
            t * span - index,
            { space: "oklab" },
        );
        const rgb = color2(mixed, "rgb") as unknown as { r: number; g: number; b: number };
        return `rgb(${Math.round(rgb.r * 255)} ${Math.round(rgb.g * 255)} ${Math.round(rgb.b * 255)})`;
    };

    const tumble = () => {
        target += 360;
        spin.target = target;
        startLoop();
    };

    onScopeDispose(() => spin.dispose());
    return { spin, colorAt, tumble };
}
