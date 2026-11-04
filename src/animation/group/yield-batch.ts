/**
 * `group/yield-batch.ts` — the INP-yield batched-advance the `AnimationGroup`
 * draw loop drives (R.W2 — the `group-layer-springs.ts` junk-drawer split; this
 * is the scheduler-yield concern, NOT spring-related; renamed from
 * `group/scheduler.ts` at S.B4 to clear the `scheduler.ts` cross-zone basename
 * collision with `internal/scheduler.ts`'s canonical `yieldToMain` — r3 F7).
 * `advanceSlice` is the
 * sync per-slice advance; `advanceBatched` slices a large group with a
 * `yieldToMain()` between slices. Pure functions of the entries the group
 * passes in.
 */
import { yieldToMain } from "../internal/scheduler";
import type { AnimationGroupEntry } from "./types";

/**
 * Advance one slice of children to absolute clock `t` — synchronous (a child's
 * `advanceTo` is: its delay is a phase on `t`, never a sleep), allocation-free.
 *
 * Skipped: a paused child with a recorded `pausedTime` (it holds its frame),
 * and a FINISHED child. A child that finishes before its siblings holds its
 * end on the group's master clock until the group completes; advancing it
 * again re-entered `onStart` and replayed it from 0 % (6.2.1).
 */
export const advanceSlice = <V extends Record<string, unknown>>(
    slice: AnimationGroupEntry<V>[],
    t: number,
): void => {
    for (let i = 0; i < slice.length; i++) {
        const anim = slice[i]!.animation;
        if (anim.done) continue;
        if (anim.paused && anim.pausedTime !== 0) continue;
        anim.advanceTo(t);
    }
};

/**
 * Batched advance — for a group larger than `YIELD_BATCH`, advance children in
 * slices and `await yieldToMain()` between them so a big per-frame composite
 * doesn't run as one long task (INP relief). Always async (the over-batch path
 * is never the zero-alloc hot path — a group with > 32 children is the rare
 * case).
 */
export const advanceBatched = async <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    t: number,
    batch: number,
): Promise<void> => {
    for (let i = 0; i < entries.length; i += batch) {
        advanceSlice(entries.slice(i, i + batch), t);
        if (i + batch < entries.length) await yieldToMain();
    }
};
