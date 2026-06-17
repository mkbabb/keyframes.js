import { camelCaseToHyphen, hyphenToCamelCase } from "@mkbabb/value.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import type {
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@mkbabb/keyframes.js";

import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import { createKeyframeId } from "../timelineTypes";
import { flattenVars } from "./flattenVars";

/**
 * Convert timeline keyframes into a CSSKeyframesAnimation. ASYNC because the
 * engine constructor is HEAVY (reached via `loadAnimationEngine()` after the
 * L.W8 S1 dogfood inversion).
 */
export async function buildAnimationFromTimeline(
    state: TimelineState,
    options: InputAnimationOptions,
    targets: HTMLElement[],
): Promise<CSSKeyframesAnimation<any>> {
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    const keyframesMap: Record<string, Record<string, string>> = {};

    // Sort by percent and group
    const sorted = [...state.keyframes].sort((a, b) => a.percent - b.percent);

    for (const kf of sorted) {
        const key =
            kf.percent === 0
                ? "from"
                : kf.percent === 100
                  ? "to"
                  : `${kf.percent}%`;

        // Merge vars into keyframe (multiple keyframes at same percent get merged)
        const existing = keyframesMap[key] ?? {};
        for (const [prop, value] of Object.entries(kf.vars)) {
            const camelProp = hyphenToCamelCase(prop);
            existing[camelProp] = value;
        }
        keyframesMap[key] = existing;
    }

    const anim = new CSSKeyframesAnimation(options, ...targets).fromKeyframes(
        keyframesMap as Record<string, Record<string, string>>,
    );
    anim.name = state.animationName;

    return anim;
}

/**
 * Export timeline state as a CSS @keyframes string.
 */
export async function exportTimelineToCSS(
    state: TimelineState,
    options: InputAnimationOptions,
    targets: HTMLElement[],
): Promise<string> {
    const { CSSKeyframesToString } = await loadAnimationEngine();
    const anim = await buildAnimationFromTimeline(state, options, targets);
    return await CSSKeyframesToString(anim, state.animationName);
}

/**
 * Import CSS @keyframes string into timeline keyframes. ASYNC because
 * `resolveKeyframes` is HEAVY (reached via `loadAnimationEngine()`).
 */
export async function importCSSToTimeline(
    css: string,
): Promise<TimelineKeyframe[]> {
    const { resolveKeyframes } = await loadAnimationEngine();
    const parsed = resolveKeyframes(css).keyframes;
    const keyframes: TimelineKeyframe[] = [];

    for (const [selector, vars] of parsed.entries()) {
        let percent: number;
        if (selector === "from") {
            percent = 0;
        } else if (selector === "to") {
            percent = 100;
        } else {
            percent = parseFloat(selector);
        }

        if (isNaN(percent)) continue;

        const flatVars: Record<string, string> = {};
        flattenVars(vars as Record<string, any>, "", flatVars, camelCaseToHyphen);

        keyframes.push({
            id: createKeyframeId(),
            percent,
            vars: flatVars,
        });
    }

    return keyframes;
}

