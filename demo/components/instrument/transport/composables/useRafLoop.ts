import type { Ref } from "vue";
import { useDemoTicker } from "@components/instrument/transport/composables/useDemoTicker";

/**
 * A per-frame loop with an optional reactive guard.
 *
 * WHAT THIS ACTUALLY IS, because the previous docblock described a mechanism
 * this function does not use. It called itself "a thin reactive skin over the
 * engine's `RAFPlayback.loop` driver" and located the self-rescheduling
 * lifecycle "in `RAFPlayback`, not here" — a per-caller `RAFPlayback` that this
 * file has not owned for some time. Every call forwards to
 * {@link useDemoTicker}, which is a different arrangement: ONE module-level
 * `RAFPlayback` and ONE document-visible loop SHARED by every demo subscriber,
 * started and stopped by reconciling the union of the subscribers' guards
 * against `document.visibilityState`. That is why a hidden tab costs nothing
 * and why N controls do not schedule N rasters — properties the old text did
 * not describe and a reader could not have inferred from it.
 *
 * This wrapper adds exactly one thing over `useDemoTicker`: the options-bag
 * call shape (`{ guard }`) its two callers use. It is kept rather than inlined
 * because both of those callers live outside what this change may touch;
 * inlining it means repointing both in one commit, which is the other half of
 * this row and is not taken here.
 *
 * When `guard` is provided, the loop runs while the guard is true and the
 * document is visible, and stops otherwise. Without a guard, it runs until
 * `stop()` — again, only while the document is visible.
 */
export function useRafLoop(
    callback: (time: DOMHighResTimeStamp) => void,
    options?: { guard?: Ref<boolean> },
) {
    return useDemoTicker(callback, options?.guard);
}
