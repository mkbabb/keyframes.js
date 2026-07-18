import type { KeyframeSelector } from "@mkbabb/value.js/css";

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
