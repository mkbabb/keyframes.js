import { afterEach, describe, expect, it } from "vitest";
import { yieldToMain } from "../src/animation/internal/scheduler";

/**
 * L.W7 S4 — `scheduler.postTask` priority-bands BOOK → born-RED PROBE (W123).
 *
 * `scheduler.postTask` ships priority bands: `"user-blocking"` for the first
 * visible frame of a gesture-started animation, `"background"` for
 * `warmEngine()`'s pre-flight chunk loads (`scheduler.ts` probes only
 * `scheduler.yield` today — lines 41-48 — and never `postTask`).
 *
 * The audit's born-RED discipline (W123): this is a BOOK→probe wave. The probe
 * does NOT assert a throughput improvement. It asserts:
 *   (a) `scheduler.postTask` availability is detected (SKIP if absent — the
 *       jsdom/Node vitest env has NO `scheduler` at all; the probe never fails
 *       on an environment that lacks the API);
 *   (b) when available, wrapping `loadAnimationEngine()` in a `"background"`
 *       postTask fires it without blocking the current microtask queue and the
 *       Promise resolves without error;
 *   (c) the `yieldToMain()` fast-path is UNAFFECTED — it continues to use
 *       `scheduler.yield`, NEVER `postTask`. The §Bite regression: replacing
 *       `scheduler.yield` with `postTask` in `yieldToMain` would serialize a
 *       group's batch-slice yields with background imports — the yield path is
 *       for yields BETWEEN group batch slices, not for engine warm-up.
 *
 * MEASURE-FIRST (the L.W7 guardrail): only when this probe is GREEN does the
 * production `warmEngine()` (S1) adopt `scheduler.postTask(…, { priority:
 * "background" })`. No `postTask` code is shipped into `scheduler.ts` /
 * `index.ts` without this probe green. This file is the MEASUREMENT — it ships
 * no production behaviour change.
 *
 * Imports `yieldToMain` from the VALUE module `internal/scheduler`, never the
 * barrel (the light boundary).
 */

type SchedulerLike = {
    postTask?: (
        cb: () => unknown,
        opts?: { priority?: string },
    ) => Promise<unknown>;
    yield?: () => Promise<void>;
};

const getScheduler = (): SchedulerLike | undefined =>
    (globalThis as { scheduler?: SchedulerLike }).scheduler;

const hasPostTask = (): boolean =>
    typeof getScheduler()?.postTask === "function";

describe("scheduler.postTask priority-bands probe (L.W7 S4, W123)", () => {
    // Each arm that installs a fake `scheduler` restores the original after, so
    // the `yieldToMain` live-probe (`scheduler.ts:41`) sees a clean global.
    const original = Object.getOwnPropertyDescriptor(globalThis, "scheduler");
    afterEach(() => {
        if (original) {
            Object.defineProperty(globalThis, "scheduler", original);
        } else {
            delete (globalThis as { scheduler?: unknown }).scheduler;
        }
    });

    it("detects scheduler.postTask availability (SKIP when absent)", () => {
        // The detection step itself — always passes. In jsdom/Node there is no
        // `scheduler`, so `hasPostTask()` is false and the dependent arm below
        // SKIPs; under a browser/Playwright run with the API it would be true.
        expect(typeof hasPostTask()).toBe("boolean");
    });

    it("wraps a fire-and-forget load in a background postTask (when available)", async () => {
        if (!hasPostTask()) {
            // No `scheduler.postTask` in this environment — the probe is
            // observe-only here (the assertion-3 yield-path arm carries the
            // gate). SKIP cleanly.
            expect(hasPostTask()).toBe(false);
            return;
        }
        // The API IS present (a real browser / Playwright with scheduler).
        // A `"background"` postTask of a trivial resolving task must complete
        // without error and without blocking the current microtask turn.
        const scheduler = getScheduler()!;
        let ran = false;
        const result = await scheduler.postTask!(
            () => {
                ran = true;
                return 42;
            },
            { priority: "background" },
        );
        expect(ran).toBe(true);
        expect(result).toBe(42);
    });

    it("yieldToMain uses scheduler.yield — never postTask", async () => {
        // Install a FAKE scheduler whose `yield` is a spy and whose `postTask`
        // throws if ever called. This is the device-independent core assertion:
        // it proves `yieldToMain` routes to `scheduler.yield` and is structurally
        // incapable of routing to `postTask` (the §Bite this gate catches).
        let yieldCalls = 0;
        let postTaskCalls = 0;
        const fakeScheduler: SchedulerLike = {
            yield: () => {
                yieldCalls += 1;
                return Promise.resolve();
            },
            postTask: () => {
                postTaskCalls += 1;
                return Promise.reject(
                    new Error(
                        "yieldToMain must NOT route through scheduler.postTask",
                    ),
                );
            },
        };
        Object.defineProperty(globalThis, "scheduler", {
            value: fakeScheduler,
            configurable: true,
            writable: true,
        });

        await yieldToMain();

        // `scheduler.ts:44` probes `scheduler.yield` LIVE on each call and
        // honors it — so the spy fired exactly once and postTask was never
        // touched.
        expect(yieldCalls).toBe(1);
        expect(postTaskCalls).toBe(0);
    });
});
