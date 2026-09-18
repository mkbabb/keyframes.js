import { camelCaseToHyphen } from "@src/animation/internal/helpers";
import { hyphenToCamelCase } from "@utils/helpers";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import type {
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@mkbabb/keyframes.js";

import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import { coalesceKeyframes, createKeyframeId } from "../timelineTypes";
import { parseAnimationCSS } from "../../keyframes/utils/parseAnimationCSS";
import {
    requireKeyframeSelector,
    selectorPercent,
} from "@utils/keyframeSelector";
import { serializeCssValue } from "@src/animation/compile/emit/css-text";
import type { CssValue } from "@mkbabb/value.js/value";
import { formatEditorCSS } from "@utils/formatEditorCSS";

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

    // One rule per STOP — the same partition the track paints (KF.W7 G5:
    // `coalesceKeyframes` is the ONE merge; there is no second one here).
    for (const stop of coalesceKeyframes(state.keyframes)) {
        const rule: Record<string, string> = {};
        for (const [prop, value] of Object.entries(stop.vars)) {
            rule[hyphenToCamelCase(prop)] = value;
        }
        keyframesMap[stop.key] = rule;
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
    return formatEditorCSS(
        await CSSKeyframesToString(anim, state.animationName),
    );
}

/**
 * Import CSS @keyframes string into timeline keyframes. ASYNC because
 * `resolveKeyframes` is HEAVY (reached via `loadAnimationEngine()`).
 */
export async function importCSSToTimeline(
    css: string,
): Promise<TimelineKeyframe[]> {
    const { keyframes: parsed } = await parseAnimationCSS(css);
    const keyframes: TimelineKeyframe[] = [];

    for (const [selector, vars] of parsed) {
        const parsedSelector = requireKeyframeSelector(selector);
        const percent = selectorPercent(parsedSelector);

        const flatVars: Record<string, string> = {};
        for (const [property, value] of Object.entries(vars)) {
            flatVars[camelCaseToHyphen(property)] = serializeCssValue(
                value as CssValue,
            );
        }

        keyframes.push({
            id: createKeyframeId(),
            selector: parsedSelector,
            percent,
            vars: flatVars,
        });
    }

    return keyframes;
}
