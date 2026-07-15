export interface TimelineKeyframe {
    id: string;
    percent: number; // 0–100
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
