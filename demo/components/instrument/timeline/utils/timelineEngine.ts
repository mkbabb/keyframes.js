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
 * The ONE subject the timeline's engine paints (KF.W7 G2 / C-6). A deep clone
 * of the instrumented scene element, made inert — out of the tab order and the
 * AT tree, never a pointer target, carrying no `id` the document already owns
 * (a duplicate would hijack `Teleport to="#…"`, `<label for>` and `aria-*`
 * references) — so the engine's inline-style writes land on a node the scene
 * does not own. The owner mounts it in its preview stage and rebinds every
 * built animation to it before a frame is applied.
 */
export function createPreviewSubject(source: HTMLElement): HTMLElement {
    const subject = source.cloneNode(true) as HTMLElement;
    for (const el of [
        subject,
        ...subject.querySelectorAll<HTMLElement>("[id], [tabindex]"),
    ]) {
        el.removeAttribute("id");
        el.removeAttribute("tabindex");
    }
    subject.inert = true;
    subject.setAttribute("aria-hidden", "true");
    subject.dataset.timelinePreviewSubject = "";
    subject.style.pointerEvents = "none";
    return subject;
}

/**
 * Convert timeline keyframes into a CSSKeyframesAnimation. ASYNC because the
 * engine constructor is HEAVY (reached via `loadAnimationEngine()` after the
 * L.W8 S1 dogfood inversion).
 *
 * KF.W7 G2 / C-6 — THE ENGINE NEVER PAINTS THE SCENE. `targets` is the caller's
 * contract (`useTimelineBuild`): the elements the compile is constructed over —
 * construction performs no DOM write. What the engine PAINTS is bound by the
 * OWNER: `KeyframeTimeline` rebinds every built animation to its preview
 * subject ({@link createPreviewSubject}) synchronously on publication, before
 * any frame is applied. Terminal shape (published to `.e`): `useTimeline`
 * splits `source` (what `snapshot()` reads) from `subject` (what the engine
 * paints), and this build is constructed over the subject directly.
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
