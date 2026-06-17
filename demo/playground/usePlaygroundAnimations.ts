import { markRaw } from "vue";
import { kfEngine } from "@utils/kfEngine";

const SUPER_KEY = "playground";

/**
 * Creates a default AnimationGroup with several preset animations
 * that can be bound to assets in the playground.
 */
export function usePlaygroundAnimations() {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood
    // inversion) — synchronous, warmed before the playground app mounts.
    const { AnimationGroup, presets } = kfEngine();

    const bounce = presets.bounce({
        duration: 1500,
        iterationCount: Infinity,
        direction: "alternate",
    });
    bounce.name = "bounce";

    const fadeIn = presets.fadeIn({
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
    });
    fadeIn.name = "fade-in";

    const pulse = presets.pulse({
        duration: 1200,
        iterationCount: Infinity,
        direction: "alternate",
    });
    pulse.name = "pulse";

    const rotateScale = presets.rotateScale({
        duration: 3000,
        iterationCount: Infinity,
        direction: "alternate",
    });
    rotateScale.name = "rotate-scale";

    const shake = presets.shake({
        duration: 800,
        iterationCount: Infinity,
        direction: "alternate",
    });
    shake.name = "shake";

    // Placeholder targets — will be reassigned when assets bind
    const placeholder = document.createElement("div");

    bounce.setTargets(placeholder);
    fadeIn.setTargets(placeholder);
    pulse.setTargets(placeholder);
    rotateScale.setTargets(placeholder);
    shake.setTargets(placeholder);

    const animationGroup = markRaw(
        new AnimationGroup(bounce, fadeIn, pulse, rotateScale, shake).setSuperKey(SUPER_KEY),
    );

    const animationNames = Object.keys(animationGroup.animations);

    return {
        animationGroup,
        animationNames,
        superKey: SUPER_KEY,
    };
}
