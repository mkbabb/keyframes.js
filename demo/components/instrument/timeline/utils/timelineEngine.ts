import {
    camelCaseToHyphen,
    hyphenToCamelCase,
    serializeCssValue,
} from "@utils/helpers";
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
    // KFA-121 — the clone copied the scene's LIVE pose (its inline transform,
    // e.g. rotateX(324deg)), so right after a build the preview disagreed with
    // the playhead until the first scrub. The clone starts from the element's
    // authored rest; the timeline's own engine (or a keyframe's vars) poses it.
    subject.style.removeProperty("transform");
    // X-DS pass 5 · KF-C5-01 — the clone FILLS its frame. A subject sized by
    // custom properties its scene declares on an ancestor (the square's
    // `width: var(--square-size)`, set on the plate's arena) loses them outside
    // the scene: the clone's size fell back to `auto` and the box collapsed to
    // its text line (a 68x15 "drag me" strip pinned to the well's top edge).
    // `fitPreviewSubject` frames the clone at the source's resolved border box,
    // so 100% of that frame IS the source's size, and it follows every re-fit.
    // Set before a pose's vars, so a keyframe that animates a size still wins.
    subject.style.width = "100%";
    subject.style.height = "100%";
    subject.style.boxSizing = "border-box";
    return subject;
}

/**
 * KFA-120 / UIA-KF-083 — the subject FITTED to its box. The clone was mounted
 * at scene size (a 225 px cube in a 96 px stage), so the stage showed a
 * centre-cropped shard of one or two faces. The clone is framed at the
 * SOURCE's layout size (so a percentage-sized subject keeps its proportions)
 * and that frame is scaled by `min(boxW, boxH) / diagonal`, so any rotation of
 * the subject stays inside the box. Re-run it when the box resizes.
 */
export function fitPreviewSubject(
    box: HTMLElement,
    subject: HTMLElement,
    source: HTMLElement,
): void {
    const frame =
        subject.parentElement?.dataset.timelinePreviewFrame !== undefined
            ? subject.parentElement
            : document.createElement("div");
    if (frame !== subject.parentElement) {
        frame.dataset.timelinePreviewFrame = "";
        frame.style.position = "absolute";
        frame.style.left = "50%";
        frame.style.top = "50%";
        frame.append(subject);
    }
    if (frame.parentElement !== box) box.replaceChildren(frame);
    const w = source.offsetWidth;
    const h = source.offsetHeight;
    const scale =
        w > 0 && h > 0 ? Math.min(box.clientWidth, box.clientHeight) / Math.hypot(w, h) : 0;
    frame.style.width = `${w}px`;
    frame.style.height = `${h}px`;
    frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

/**
 * KFA-59 / UIA-KF-022 — a keyframe's pose is its declarations applied to the
 * subject. The hover preview used to RASTERISE the scrubbed scene with
 * html2canvas, which cannot parse CSS `color()` and failed on every hover
 * ("Preview unavailable — Attempting to parse an unsupported color function").
 * The pose is now a clone of the preview subject carrying the stop's vars
 * inline — what the engine paints at that stop, with no capture step to fail.
 */
export function posePreviewSubject(
    source: HTMLElement,
    vars: Readonly<Record<string, string>>,
): HTMLElement {
    const subject = createPreviewSubject(source);
    for (const [property, value] of Object.entries(vars)) {
        subject.style.setProperty(property, value);
    }
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
