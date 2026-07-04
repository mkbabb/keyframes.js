/**
 * orchestration/ — temporal/multi-target helpers over the physics steppers or
 * the engine (R.W1). LIGHT (mostly): `stagger` (pure delay distribution), `flip`
 * (layout FLIP over ElementMorph), `drag` (gesture physics over SpringProgress),
 * `timeline` (the progress-driver family + native bridge), `sequence` (the
 * temporal orchestrator). The package barrel re-exports these by zone path; this
 * barrel is the zone's single surface (and what `proof:no-flat-siblings` asserts).
 */
export { stagger } from "./stagger";
export type { StaggerOrigin, StaggerOptions, StaggerFn } from "./stagger";
export { flip, flipShared } from "./flip";
export type { FlipOptions } from "./flip";
// S.B4 (a02 F4) — explicit-named barrel policy: `export *` is reserved for the
// leaf tier, so the sub-zone surfaces are re-exported by name (a new sub-zone
// export joins the package surface only through a reviewed barrel edit).
export { drag, Draggable, drag2D } from "./drag";
export type {
    DragOptions,
    DragAxis,
    DragSubscriber,
    Drag2DHandle,
} from "./drag";
export {
    Timeline,
    KeyframesScrollTimeline,
    ManualTimeline,
    createNativeTimeline,
} from "./timeline";
export type {
    TimelineOptions,
    KeyframesScrollTimelineOptions,
    NativeTimelineSpec,
} from "./timeline";
export { Sequence } from "./sequence";
export type {
    SequencePosition,
    SequenceOptions,
    SequenceEntry,
    SequenceEvent,
    SequenceSegmentSubscriber,
    SequenceLabelSubscriber,
    SequenceSubscriber,
} from "./sequence";
export { splitText, SplitTextRefusalError } from "./split-text";
export type {
    SplitBy,
    SplitTextOptions,
    SplitTextResult,
    SplitTextRefusalReason,
    TextSegment,
} from "./split-text";
