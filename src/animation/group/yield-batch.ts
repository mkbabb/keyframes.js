/**
 * `group/yield-batch.ts` — the INP-yield batched-advance the `AnimationGroup`
 * draw loop drives (R.W2 — the `group-layer-springs.ts` junk-drawer split; this
 * is the scheduler-yield concern, NOT spring-related; renamed from
 * `group/scheduler.ts` at S.B4 to clear the `scheduler.ts` cross-zone basename
 * collision with `internal/scheduler.ts`'s canonical `yieldToMain` — r3 F7).
 * `advanceSlice` is the
 * J.W6 S1 sync fast path; `advanceBatched` slices a large group with a
 * `yieldToMain()` between slices. Pure functions of the entries the group
 * passes in.
 */
import { yieldToMain } from "../internal/scheduler";
import type { AnimationGroupEntry } from "./group";

/**
 * Advance one slice of children to absolute clock `t` — the J.W6 S1 sync fast
 * path. Returns `undefined` IFF every child stepped SYNCHRONOUSLY (a plain
 * number from `Animation.advanceTo`); only a genuinely-async child (a thenable)
 * promotes the slice to a `Promise<void>`. The sync return allocates nothing —
 * no `promises` array is created unless an async child needs one — so the
 * steady per-frame composite path is zero-microtask, zero-alloc.
 *
 * A paused child with a recorded `pausedTime` is skipped (it holds its frame).
 */
export const advanceSlice = <V extends Record<string, unknown>>(
    slice: AnimationGroupEntry<V>[],
    t: number,
): Promise<void> | undefined => {
    let promises: Promise<number>[] | undefined;
    for (const entry of slice) {
        const anim = entry.animation;
        if (anim.paused && anim.pausedTime !== 0) continue;
        const stepped = anim.advanceTo(t);
        if (typeof stepped !== "number") (promises ??= []).push(stepped);
    }
    return promises && Promise.all(promises).then(() => undefined);
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
        await advanceSlice(entries.slice(i, i + batch), t);
        if (i + batch < entries.length) await yieldToMain();
    }
};
