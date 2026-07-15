/**
 * sync-step.measure.test.ts — J.W6 S1 (FB-2). The measure-first artifact for
 * the `Animation`/`AnimationGroup` async sync-step half (the F.W5 HELD half,
 * F→I rider — `deferred-ledger.md:101`).
 *
 * Drives the REAL play loop (`RAFPlayback.loop` → `_frame` → `advanceTo`)
 * over a 600-frame steady window with rAF stubbed synchronous, and records,
 * per corpus (a K=8 transform `Animation`; a 32-cell `AnimationGroup` at the
 * `YIELD_BATCH` fast-path boundary):
 *
 *   - microtask TURNS per frame — how many microtask-queue drains the
 *     in-flight frame needs before its reschedule lands (0 on a sync
 *     `_frame`; >0 on the async promise chain). THE spec's named metric:
 *     the LAND threshold is a ≥20% turn reduction (`J.W6.md §S1`).
 *   - PROMISE allocations per frame (async_hooks init count, instrument
 *     drains included) — the allocation corroborator.
 *   - wall time per frame (hooks disabled, separate pass; `gc()` between
 *     passes when run under NODE_OPTIONS=--expose-gc).
 *
 * SHAPE-AGNOSTIC: the same pump measures whichever `advanceTo` shape the
 * tree carries, and tags the printed record with the detected arm. The
 * assertions are deliberately arm-neutral (the probe must stay GREEN on
 * both arms; the DECISION is made on-device from the printed numbers per
 * the P6 posture — CI observes, the IMPL host decides).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createHook } from "node:async_hooks";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

if (typeof globalThis.AnimationEvent === "undefined") {
    (globalThis as { AnimationEvent?: unknown }).AnimationEvent =
        class AnimationEvent extends Event {
            animationName: string;
            elapsedTime: number;
            constructor(
                type: string,
                init?: AnimationEventInit,
            ) {
                super(type, init);
                this.animationName = init?.animationName ?? "";
                this.elapsedTime = init?.elapsedTime ?? 0;
            }
        };
}

const FRAMES = 600;
const STEADY_DURATION = 60_000; // 600 × 16.667 ms ≈ 10 s — window stays steady
const K8_KEYFRAMES = `
    from { transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotate(0deg); opacity: 0; }
    to { transform: translate3d(240px, 120px, 60px) scale3d(2, 1.5, 1.25) rotate(360deg); opacity: 1; }
`;

interface QueuedFrame {
    cb: FrameRequestCallback;
}

let queue: QueuedFrame[] = [];
let clock = 0;
let origRAF: typeof window.requestAnimationFrame;
let origCAF: typeof window.cancelAnimationFrame;

beforeEach(() => {
    queue = [];
    clock = 0;
    origRAF = window.requestAnimationFrame;
    origCAF = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
        queue.push({ cb });
        return queue.length;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame =
        (() => {}) as typeof window.cancelAnimationFrame;
});

afterEach(() => {
    window.requestAnimationFrame = origRAF;
    window.cancelAnimationFrame = origCAF;
    queue = [];
});

const makeK8Animation = () => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({
        duration: STEADY_DURATION,
        delay: 0,
        useWAAPI: false,
    }).fromString(K8_KEYFRAMES);
    a.setTargets(el);
    return a;
};

/**
 * Pump `frames` loop turns; returns the total microtask drains needed for
 * the frames' reschedules to land (the per-window microtask-turn count).
 */
const pumpCounting = async (frames: number): Promise<number> => {
    let turns = 0;
    for (let f = 0; f < frames; f++) {
        let drains = 0;
        while (queue.length === 0 && drains < 64) {
            await Promise.resolve();
            drains += 1;
            turns += 1;
        }
        const next = queue.shift();
        if (!next) break;
        clock += 16.667;
        next.cb(clock);
    }
    queue = [];
    return turns;
};

interface Playable {
    play(): Promise<void>;
    stop(): unknown;
    advanceTo(t: number): number | Promise<number> | unknown;
}

const measure = async (label: string, make: () => Playable) => {
    // Arm detection — a throwaway instance, advanced once off-window.
    const shapeProbe = make();
    const stepped = (
        shapeProbe as { advanceTo(t: number): unknown }
    ).advanceTo(0);
    const arm =
        typeof (stepped as { then?: unknown })?.then === "function"
            ? "async-advanceTo"
            : "sync-advanceTo";
    await stepped;
    shapeProbe.stop();
    queue = [];

    // Pass 1 — wall time, hooks disabled.
    (globalThis as { gc?: () => void }).gc?.();
    {
        const subject = make();
        void subject.play();
        const t0 = performance.now();
        await pumpCounting(FRAMES);
        const wallMs = performance.now() - t0;
        subject.stop();

        // Pass 2 — microtask turns + promise allocations, hooks enabled.
        (globalThis as { gc?: () => void }).gc?.();
        let promiseInits = 0;
        const hook = createHook({
            init(_id, type) {
                if (type === "PROMISE") promiseInits += 1;
            },
        });
        const counted = make();
        void counted.play();
        hook.enable();
        const turns = await pumpCounting(FRAMES);
        hook.disable();
        counted.stop();

        const record = {
            rider: "FB-2",
            probe: "sync-step.measure",
            arm,
            corpus: label,
            frames: FRAMES,
            microtaskTurns: turns,
            turnsPerFrame: +(turns / FRAMES).toFixed(3),
            promiseInits,
            promiseInitsPerFrame: +(promiseInits / FRAMES).toFixed(3),
            wallMs: +wallMs.toFixed(2),
            usPerFrame: +((wallMs * 1000) / FRAMES).toFixed(2),
        };
        // eslint-disable-next-line no-console
        console.log(`[FB-2 measure] ${JSON.stringify(record)}`);
        return record;
    }
};

describe("FB-2 measure: advanceTo loop-core microtask/wall cost (600-frame steady window)", () => {
    it("records the Animation (K=8 transform) steady-window cost", async () => {
        const record = await measure("Animation·K=8", makeK8Animation);
        expect(record.frames).toBe(FRAMES);
        expect(record.microtaskTurns).toBeGreaterThanOrEqual(0);
        expect(record.wallMs).toBeGreaterThan(0);
    });

    it("records the AnimationGroup (32 cells · K=8) steady-window cost", async () => {
        const record = await measure(
            "AnimationGroup·32cells·K=8",
            () =>
                new AnimationGroup(
                    ...Array.from({ length: 32 }, makeK8Animation),
                ) as unknown as Playable,
        );
        expect(record.frames).toBe(FRAMES);
        expect(record.microtaskTurns).toBeGreaterThanOrEqual(0);
        expect(record.wallMs).toBeGreaterThan(0);
    });
});
