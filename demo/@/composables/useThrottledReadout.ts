/**
 * useThrottledReadout — T.F23(c) (the throttle-DRY extraction; lane 21 rec 4).
 *
 * THE DUPLICATED SEAM. Four+ scenes hand-roll the SAME "few-Hz cold-path readout"
 * throttle: a `lastReadoutAt` accumulator gating a flush at `PROGRESS_READOUT_HZ`,
 * called every frame from the shared 60 Hz loop, plus a RECONCILE on settle/scrub
 * that flushes unconditionally so the reactive mirrors land on the LIVE value the
 * instant the loop stops (`useEasingDemo` / `useSpringHotPath` / `useSpringDemo`,
 * and historically `AmigaScene` / `useSequenceDemo` before their readouts were
 * removed). The hot/cold split is the CORRECT perf idiom (the reactive refs are
 * READOUT MIRRORS lagging the non-reactive hot path by ≤ one readout tick, by
 * design) — this extraction keeps the idiom and removes the copy-paste.
 *
 * WHY A CADENCE GATE, not a `(source, hz)` reactive wrapper. The real sites do not
 * throttle ONE reactive source — they flush a CLUSTER of mirrors (a ball position
 * + a velocity badge + a settled flag + a `f(p)=` readout) together, driven by an
 * EXTERNAL clock (the scene's own 60 Hz rAF loop passes its `now`). So the honest
 * common denominator is a clock-gated `maybeFlush(now, flush)` the loop calls, not
 * a ref this composable owns and polls. This is a PURE helper (no rAF, no reactive
 * state of its own) — the scene keeps ownership of both the loop and the mirrors.
 *
 * USAGE (the deferred swap — T.F23(c) authors the seam; the easing/spring sites
 * are facility-lane in-flight this batch, so their swap rides the facility-settled
 * batch):
 *
 *   const readout = useThrottledReadout(PROGRESS_READOUT_HZ);
 *   // in the 60 Hz loop:
 *   readout.maybeFlush(now, () => { liveValue.value = live; badge.value = v; });
 *   // on settle / scrub / restore — land on the LIVE value immediately:
 *   readout.reconcile(now, () => { liveValue.value = live; badge.value = v; });
 */

/** A clock-gated readout throttle — the shared few-Hz cold-path flush seam. */
export interface ThrottledReadout {
    /**
     * Flush IFF at least `1000 / hz` ms have elapsed since the last flush (the
     * cold-path cadence gate). Called every frame from the loop with its `now`.
     * @returns whether the flush ran this call.
     */
    maybeFlush(now: DOMHighResTimeStamp, flush: () => void): boolean;
    /**
     * Flush UNCONDITIONALLY and re-seat the cadence clock to `now` — the
     * settle/scrub/restore reconcile that lands the mirrors on the LIVE value the
     * instant the loop stops (the "≤ one readout tick" lag closes to zero here).
     */
    reconcile(now: DOMHighResTimeStamp, flush: () => void): void;
    /** Re-arm so the very next `maybeFlush` fires (e.g. on loop (re)start). */
    reset(): void;
}

/**
 * @param hz the readout cadence in flushes/second (e.g. `PROGRESS_READOUT_HZ`).
 *           Must be > 0; a non-positive hz would make the interval non-finite and
 *           never flush — treated as "flush every call" (interval 0).
 */
export function useThrottledReadout(hz: number): ThrottledReadout {
    const intervalMs = hz > 0 ? 1000 / hz : 0;
    // -Infinity so the first maybeFlush always fires (no phantom initial delay).
    let lastAt = -Infinity;

    const maybeFlush = (
        now: DOMHighResTimeStamp,
        flush: () => void,
    ): boolean => {
        if (now - lastAt >= intervalMs) {
            lastAt = now;
            flush();
            return true;
        }
        return false;
    };

    const reconcile = (now: DOMHighResTimeStamp, flush: () => void): void => {
        lastAt = now;
        flush();
    };

    const reset = (): void => {
        lastAt = -Infinity;
    };

    return { maybeFlush, reconcile, reset };
}
