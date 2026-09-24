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

// ── THE SEQUENCE MODE of the shared Timeline pane (X.KF.W13V.s2 · §0cw) ──────
// A Sequence is not one Animation's keyframe offsets: it is a master clock with
// one child per item, each placed at its `at` (ms) by the engine's own
// `seq.add(child, at)`. The pane reads that structure through this descriptor,
// which the scene's facility channel carries — the pane never imports a scene.

/** One lane of the Sequence mode: one sequence item at its master-clock `at`. */
export interface SequenceTimelineLane {
    /** The item's index (its lane order). */
    index: number;
    /** The item's start on the master clock (ms) — the engine's placement. */
    at: number;
    /** The item's own run (ms) — the lane's bar spans `[at, at + span]`. */
    span: number;
    /** The lane's tone (a CSS colour), shared with the stage row it drives. */
    tone: string;
}

/** The Sequence descriptor a light channel carries into the Timeline pane. */
export interface SequenceTimelineSource {
    /** The lanes, in item order (reactive reads). */
    lanes(): readonly SequenceTimelineLane[];
    /** The master clock's span (ms) — the lanes' shared time axis. */
    duration(): number;
    /** The editable `at` domain's upper bound (ms). */
    readonly atMax: number;
    /** The master clock's normalized [0,1] playhead. */
    progress(): number;
    /** Whether a master scrub is held (lifts the stage's scrub heat). */
    isScrubbing(): boolean;
    /** Re-time item `index` to `at` ms — rebuilds the master Sequence. */
    reseat(index: number, at: number): void;
    /** Seek the master clock to `p` in [0,1] (pauses a running sequence). */
    scrub(p: number): void;
    setScrubbing(on: boolean): void;
    /** The scrub direction latch (+1 forward, −1 back) the stage cascade reads. */
    setScrubDir(dir: number): void;
    /** Restore the default placement (the re-time's undo). */
    reset(): void;
}
