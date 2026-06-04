/**
 * Dev-only Long Animation Frames (LoAF) observer — the causal half of the
 * engine's `scheduler.yield()` INP-relief claim (B.W4 §4, the two-tranche
 * chronic finally landed with its consumers: the prod-perf measurement and
 * the demo bench).
 *
 * Records every long animation frame over `thresholdMs` with its duration,
 * blocking duration, and best-effort script attribution, and exposes the
 * ring on `window.__kfLoaf` so the Playwright >50ms-trace gate and the
 * bench can read it. Chromium-only by API (`long-animation-frame` is not
 * Baseline); feature-detected so every other engine no-ops.
 */

export interface LoAFRecord {
    /** Entry start time (ms, performance clock). */
    ts: number;
    /** Total frame duration (ms). */
    duration: number;
    /** Main-thread blocking duration (ms). */
    blocking: number;
    /** Best-effort attribution — the first script's source URL or invoker. */
    source: string;
}

interface LoAFScriptAttribution {
    sourceURL?: string;
    invoker?: string;
}

interface LoAFEntry extends PerformanceEntry {
    blockingDuration?: number;
    scripts?: LoAFScriptAttribution[];
}

declare global {
    interface Window {
        __kfLoaf?: LoAFRecord[];
    }
}

/**
 * Start observing long animation frames. Returns a disconnect handle, or
 * `undefined` when the API is unavailable (non-Chromium, SSR).
 */
export function observeLongAnimationFrames(
    thresholdMs = 50,
): (() => void) | undefined {
    if (
        typeof window === "undefined" ||
        typeof PerformanceObserver === "undefined" ||
        !PerformanceObserver.supportedEntryTypes?.includes(
            "long-animation-frame",
        )
    ) {
        return undefined;
    }

    const records: LoAFRecord[] = (window.__kfLoaf ??= []);

    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LoAFEntry[]) {
            if (entry.duration < thresholdMs) continue;
            const script = entry.scripts?.[0];
            records.push({
                ts: entry.startTime,
                duration: entry.duration,
                blocking: entry.blockingDuration ?? 0,
                source:
                    script?.sourceURL || script?.invoker || "(unattributed)",
            });
            // Dev console signal — the observer itself is dev-only (DCE'd
            // from production by main.ts's import.meta.env.DEV guard).
            console.debug(
                `[kf:loaf] ${entry.duration.toFixed(1)}ms frame ` +
                    `(blocking ${(entry.blockingDuration ?? 0).toFixed(1)}ms) — ` +
                    (script?.sourceURL || script?.invoker || "unattributed"),
            );
        }
    });

    observer.observe({ type: "long-animation-frame", buffered: true });
    return () => observer.disconnect();
}
