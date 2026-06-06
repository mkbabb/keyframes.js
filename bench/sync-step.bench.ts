/**
 * sync-step.bench.ts — the `RAFPlayback` loop-core dispatch (F.W1 S3,
 * `a-runtime-remeasure RM-2 §A.2`).
 *
 * `RAFPlayback._run` wraps EVERY frame, on every loop shape, in a promise +
 * microtask hop (`void Promise.resolve(step(now)).then(...)`, playback.ts:99-108)
 * before rescheduling the next rAF. `drive` (playback.ts:168) steps a
 * SYNCHRONOUS boolean-returning `Tickable` (`SmoothProgress`/`SpringProgress`
 * `tickDt`) — so it pays a promise + microtask turn it never needs (the
 * 33ns/frame the audit measured). This bench isolates that loop-core dispatch
 * cost: rAF is stubbed to a synchronous immediate queue so the bench measures
 * the promise+microtask loop-core, NOT real frame pacing.
 *
 * It is the harness F5's `proof:sync-step` promise-count clause measures. The
 * tier had ZERO coverage of `playback.ts` before this.
 *
 * Imports the engine VALUE modules directly (`playback`, `spring`, `smooth`) —
 * never the type-only barrel.
 */
import { afterAll, beforeAll, bench, describe } from "vitest";
import { RAFPlayback } from "../src/animation/playback";
import { SmoothProgress } from "../src/animation/smooth";
import { SpringProgress } from "../src/animation/spring";

/**
 * The synchronous rAF stub. The shared shim reaches `window.requestAnimationFrame`
 * when `window` is defined (the jsdom bench env), so stubbing it here is the
 * one seam every `RAFPlayback._run` frame goes through. Callbacks land on a
 * queue with a monotonically advancing synthetic timestamp; the bench body
 * pumps that queue for a bounded window, so no real timer ever fires and the
 * measured cost is purely the loop-core promise+microtask dispatch.
 */
interface QueuedFrame {
    cb: FrameRequestCallback;
}

let queue: QueuedFrame[] = [];
let clock = 0;
let origRAF: typeof window.requestAnimationFrame;
let origCAF: typeof window.cancelAnimationFrame;

beforeAll(() => {
    origRAF = window.requestAnimationFrame;
    origCAF = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
        queue.push({ cb });
        return queue.length; // an opaque, truthy handle
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = (() => {
        // The bounded pump drains the queue itself; cancellation is a no-op
        // here because no real timer backs the stub.
    }) as typeof window.cancelAnimationFrame;
});

afterAll(() => {
    window.requestAnimationFrame = origRAF;
    window.cancelAnimationFrame = origCAF;
    queue = [];
});

/**
 * Pump exactly `frames` loop-core turns. Each turn pops the one rAF the
 * previous frame's `.then` reschedule armed, advances the synthetic clock by a
 * 60Hz step, and fires it; the `await` lets the next frame's `.then` microtask
 * resolve (it re-arms the queue) before the following pop. This is the
 * steady-state window the audit's `drive` overhead lives in.
 */
const pump = async (frames: number): Promise<void> => {
    for (let f = 0; f < frames && queue.length > 0; f++) {
        const next = queue.shift()!;
        clock += 16.667;
        next.cb(clock);
        // Drain the loop-core's `Promise.resolve(step).then` microtask so the
        // reschedule lands on the queue before the next pop.
        await Promise.resolve();
        await Promise.resolve();
    }
    // Quiesce any trailing reschedule so it never leaks into the next sample.
    queue = [];
};

const FRAMES = 600;

describe("RAFPlayback loop-core dispatch (synchronous drive stepper)", () => {
    bench(`drive(SmoothProgress) · ${FRAMES}-frame window`, async () => {
        clock = 0;
        queue = [];
        // A target it will never reach in the window keeps the stepper
        // unsettled, so every pumped frame exercises the loop-core dispatch
        // rather than auto-stopping early.
        const sp = new SmoothProgress({ damping: 0.001, snapThreshold: 1e-9 });
        const pb = new RAFPlayback();
        sp.setTarget(1);
        pb.drive(sp);
        await pump(FRAMES);
        pb.stop();
    });

    bench(`drive(SpringProgress) · ${FRAMES}-frame window`, async () => {
        clock = 0;
        queue = [];
        const sp = new SpringProgress({
            response: 100,
            dampingFraction: 1,
            settleThreshold: 1e-9,
            velocitySettleThreshold: 1e-9,
        });
        const pb = new RAFPlayback();
        sp.target = 1;
        pb.drive(sp);
        await pump(FRAMES);
        pb.stop();
    });
});
