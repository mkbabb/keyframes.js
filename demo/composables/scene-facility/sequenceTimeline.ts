// SERVED MODEL: claude-opus-5-5
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
    /** Run item `index` once on the stage after a settled re-time (UIA-KF-317). */
    preview(index: number): void;
    /** The reel: replay every item as a cascading wave (UIA-KF-098 — the
     *  pane's verb beside `reset`, off the stage). */
    playReel(): void;
    /** Whether the reel runs (its Button's `loading` state). */
    isReeling(): boolean;
}
