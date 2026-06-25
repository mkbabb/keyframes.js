/**
 * orchestration/sequence/ — the Sequence temporal orchestrator (R.W1).
 *
 * The master-playhead → child-clock orchestrator (`sequence.ts`) over the
 * `SequenceEventBus` (`events.ts`). LIGHT — Sequence drives the consumer's own
 * `KeyframesAnimation.advanceTo` over a master clock (it holds only the type).
 * The barrel re-exports the public surface unchanged (path-only difference).
 */
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
