/**
 * `yieldToMain()` — break a long main-thread task so the browser can service
 * input/render between slices (INP relief). Used by `AnimationGroup.tick()`
 * to keep a large group's per-frame composite from monopolizing the main
 * thread as one long task.
 *
 * Baseline-Newly: prefers the native `scheduler.yield()` (continuation runs
 * at the FRONT of the task queue, so yielding stays cheap); falls back to a
 * `MessageChannel` macrotask, then `setTimeout(0)` — a ≤20 LOC progressive
 * fallback per the Baseline browser policy. SSR-safe: resolves immediately
 * off-DOM (no event loop to yield to that matters for a headless render).
 */

/**
 * Yield to the main thread, resolving on the next scheduler turn.
 *
 * The native `scheduler.yield` is probed LIVE on each call (two cheap
 * checks) — a polyfill or late-installed scheduler is always honored.
 * The fallback choice (`MessageChannel` vs `setTimeout`) IS cached: those
 * capabilities are fixed for the environment's lifetime, so re-detecting
 * them on every yield of a large batched group is pure overhead.
 */
let fallback: (() => Promise<void>) | null = null;

const detectFallback = (): (() => Promise<void>) => {
    if (typeof MessageChannel === "function") {
        return () =>
            new Promise<void>((resolve) => {
                const channel = new MessageChannel();
                channel.port1.onmessage = () => {
                    channel.port1.close();
                    resolve();
                };
                channel.port2.postMessage(undefined);
            });
    }
    return () => new Promise<void>((resolve) => setTimeout(resolve, 0));
};

export function yieldToMain(): Promise<void> {
    const scheduler = (
        globalThis as { scheduler?: { yield?: () => Promise<void> } }
    ).scheduler;
    if (scheduler && typeof scheduler.yield === "function") {
        return scheduler.yield();
    }
    fallback ??= detectFallback();
    return fallback();
}
