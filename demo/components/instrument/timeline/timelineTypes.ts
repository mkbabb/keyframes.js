import type { KeyframeSelector } from "@mkbabb/value.js/css";
import { selectorText } from "@utils/keyframeSelector";

export interface TimelineKeyframe {
    id: string;
    /** Normalized authored selector retained for CSS round-trip. */
    selector: KeyframeSelector;
    /** Resolved 0–100 presentation position used by the timeline UI. */
    percent: number;
    vars: Record<string, string>; // CSS property → value pairs
    easing?: string;
    label?: string;
}

export interface TimelineState {
    keyframes: TimelineKeyframe[];
    captureProperties: string[];
    animationName: string;
}

/**
 * A STOP — the unit the engine compiles and the track renders (KF.W7 G5).
 *
 * Keyframes whose selectors serialize to ONE text (`selectorText`) are one
 * rule in the built `@keyframes` block and in the exported CSS — CSS merges
 * same-selector blocks, later declarations winning — so they are ONE stop:
 * one marker, one caret, and a marker that says how many keyframes it holds.
 * Both consumers read this partition and nothing else, which is what makes
 * "the UI and the artifact agree on the count" structural rather than policed.
 */
export interface TimelineStop {
    /** The merge key — `selectorText(keyframes[0].selector)`. */
    key: string;
    /** The stop's presentation position (its first member's). */
    percent: number;
    /** Members in state order (stable across the percent sort); never empty. */
    keyframes: [TimelineKeyframe, ...TimelineKeyframe[]];
    /** The merged declaration set — later members win, as CSS does. */
    vars: Record<string, string>;
}

/**
 * Partition keyframes into stops: stable sort by percent (equal percents keep
 * state order), group by the engine's merge key, merge `vars` later-wins. The
 * ONE derivation `buildAnimationFromTimeline` compiles from and the track
 * paints from.
 */
export function coalesceKeyframes(
    keyframes: readonly TimelineKeyframe[],
): TimelineStop[] {
    const stops = new Map<string, TimelineStop>();
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);

    for (const kf of sorted) {
        const key = selectorText(kf.selector);
        const stop = stops.get(key);
        if (stop) {
            stop.keyframes.push(kf);
            Object.assign(stop.vars, kf.vars);
        } else {
            stops.set(key, {
                key,
                percent: kf.percent,
                keyframes: [kf],
                vars: { ...kf.vars },
            });
        }
    }

    return [...stops.values()];
}

export const DEFAULT_CAPTURE_PROPERTIES = [
    "transform",
    "opacity",
    "background-color",
    "color",
    "border-color",
    "box-shadow",
    "filter",
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin",
    "padding",
    "border-radius",
    "font-size",
];

let _nextId = 0;
export const createKeyframeId = (): string => `kf-${Date.now()}-${_nextId++}`;
