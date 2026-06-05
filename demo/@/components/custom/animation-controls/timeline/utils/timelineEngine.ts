import { camelCaseToHyphen, hyphenToCamelCase } from "@mkbabb/value.js";
import {
    CSSKeyframesAnimation,
    resolveKeyframes,
} from "@src/animation/engine";
import type { InputAnimationOptions } from "@src/animation/constants";
import { CSSKeyframesToString } from "@src/animation/format";

import type { TimelineKeyframe, TimelineState } from "../composables/timelineTypes";
import { createKeyframeId } from "../composables/timelineTypes";
import { flattenVars } from "./flattenVars";

const parseCSSKeyframes = (input: string) => resolveKeyframes(input).keyframes;

/**
 * Convert timeline keyframes into a CSSKeyframesAnimation.
 */
export function buildAnimationFromTimeline(
    state: TimelineState,
    options: InputAnimationOptions,
    targets: HTMLElement[],
): CSSKeyframesAnimation<any> {
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
    const anim = buildAnimationFromTimeline(state, options, targets);
    return await CSSKeyframesToString(anim, state.animationName);
}

/**
 * Import CSS @keyframes string into timeline keyframes.
 */
export function importCSSToTimeline(css: string): TimelineKeyframe[] {
    const parsed = parseCSSKeyframes(css);
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

