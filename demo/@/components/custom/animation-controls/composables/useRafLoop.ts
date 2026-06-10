import { watch, onScopeDispose, ref } from "vue";
import type { Ref } from "vue";
import { RAFPlayback } from "@src/animation/playback";

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
    const playback = new RAFPlayback();
    const isActive = ref(false);

    const guard = options?.guard;

    const start = () => {
        if (playback.running) return;
        isActive.value = true;
        playback.loop((time) => {
            callback(time);
            // Re-check guard AFTER callback (which may update the guard ref)
            // so we stop on the same frame the guard goes false.
            const cont = !guard || guard.value;
            if (!cont) isActive.value = false;
            return cont;
        });
    };

    const stop = () => {
        playback.stop();
        isActive.value = false;
    };

    if (options?.guard) {
        watch(
            options.guard,
            (active) => {
                if (active) {
                    start();
                } else {
                    stop();
                }
            },
            { immediate: true },
        );
    }

    // J.W2 S5 (DS-3/§L) — `onScopeDispose`, not `onUnmounted`: fires on component
    // unmount AND on `effectScope` disposal, so a non-component caller can never
    // leak the rAF loop (the seam every sibling composable already uses, e.g.
    // useSheetSpring).
    onScopeDispose(stop);

    return { start, stop, isActive };
}
