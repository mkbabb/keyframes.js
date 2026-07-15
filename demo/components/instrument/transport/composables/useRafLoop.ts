import type { Ref } from "vue";
import { useDemoTicker } from "@components/instrument/transport/composables/useDemoTicker";

/**
 * A composable that manages a per-frame loop with optional reactive guard.
 *
 * A thin reactive skin over the engine's {@link RAFPlayback.loop} driver: the
 * self-rescheduling lifecycle (and its `_gen` restart-safety against
 * double-scheduling on rapid start/stop) lives in `RAFPlayback`, not here.
 *
 * When `guard` is provided, the loop auto-starts when guard becomes true and
 * auto-stops when it becomes false. Without a guard, the loop must be started manually.
 */
export function useRafLoop(
    callback: (time: DOMHighResTimeStamp) => void,
    options?: { guard?: Ref<boolean> },
) {
    return useDemoTicker(callback, options?.guard);
}
