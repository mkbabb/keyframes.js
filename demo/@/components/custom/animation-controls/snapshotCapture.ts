import { createKeyframeId } from "./timelineTypes";
import type { TimelineKeyframe } from "./timelineTypes";

/**
 * Capture a CSS property snapshot from an element's computed style.
 */
export function captureSnapshot(
    element: HTMLElement,
    percent: number,
    properties: string[],
): TimelineKeyframe {
    const computed = getComputedStyle(element);
    const vars: Record<string, string> = {};

    for (const prop of properties) {
        const value = computed.getPropertyValue(prop).trim();
        if (value && value !== "none" && value !== "auto" && value !== "") {
            vars[prop] = value;
        }
    }

    return {
        id: createKeyframeId(),
        percent,
        vars,
    };
}

/**
 * Capture only non-default properties from an element.
 */
export function captureNonDefaultSnapshot(
    element: HTMLElement,
    percent: number,
    properties: string[],
): TimelineKeyframe {
    const computed = getComputedStyle(element);
    const vars: Record<string, string> = {};

    // Create a temporary hidden element to get default values
    const temp = document.createElement(element.tagName);
    temp.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
    document.body.appendChild(temp);
    const defaultComputed = getComputedStyle(temp);

    for (const prop of properties) {
        const value = computed.getPropertyValue(prop).trim();
        const defaultValue = defaultComputed.getPropertyValue(prop).trim();

        if (value && value !== defaultValue) {
            vars[prop] = value;
        }
    }

    document.body.removeChild(temp);

    return {
        id: createKeyframeId(),
        percent,
        vars,
    };
}
