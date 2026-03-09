import { watch, onUnmounted, ref } from "vue";
import type { Ref } from "vue";

/**
 * A composable that manages a requestAnimationFrame loop with optional reactive guard.
 *
 * When `guard` is provided, the loop auto-starts when guard becomes true and
 * auto-stops when it becomes false. Without a guard, the loop must be started manually.
 */
export function useRafLoop(
    callback: (time: DOMHighResTimeStamp) => void,
    options?: { guard?: Ref<boolean> },
) {
    let rafId: number | null = null;
    const isActive = ref(false);

    const loop = (time: DOMHighResTimeStamp) => {
        callback(time);
        rafId = requestAnimationFrame(loop);
    };

    const start = () => {
        if (rafId !== null) return;
        isActive.value = true;
        rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
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

    onUnmounted(stop);

    return { start, stop, isActive };
}
