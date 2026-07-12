/**
 * proof:scene-raf-leak — G.W9 clause 2 (the swap-then-frame witness).
 *
 * Four scene loop-owners wired their rAF cleanup to `onDeactivated` — a
 * `<KeepAlive>`-only hook the bare keyed `<Suspense>` host NEVER fires. For
 * Easing + Spring the dead hook was the ONLY unmount-time `stop()`, so swapping
 * away mid-play LEAKED the rAF preview loop perpetually. G.W9 re-homes the
 * cleanup on `onScopeDispose` (the genuine dispose seam, mirroring
 * useRafLoop.ts onUnmounted(stop)).
 *
 * This witness PROVES the leak is stopped: it mounts the composable inside an
 * effect scope, starts playback (the rAF loop reschedules), disposes the scope
 * (the Suspense hard-cut equivalent — fires onScopeDispose), then advances the
 * rAF clock and asserts NO further frame callback executes. BITE: revert the
 * `onScopeDispose` stop → the loop survives dispose → a frame still fires → reds.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { warmKfEngine } from "../../../demo/utils/kfEngine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";

// L.W8 S1 ED-3 — the demo composables now read the HEAVY engine surface
// synchronously via the warmed `kfEngine()` (the demo warms it before mount).
// In the unit harness there is no app boot, so warm it once up front.
beforeAll(async () => {
    await warmKfEngine();
});
import { useSceneMachine } from "../../../demo/state/useSceneMachine";

/**
 * Drive the (H.W1) scene machine into `playing` for `scene` so the easing
 * raw-rAF loop — which now GATES on `machine.status === 'playing'` (the private
 * `isPlaying` shadow ref is DELETED) — actually arms. NAVIGATE → SCENE_READY
 * (the targets-attached restore) → PLAY mirrors the real App lifecycle.
 */
function seedPlaying(scene: string) {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: scene });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PLAY" });
}

// A controllable rAF queue: each `requestAnimationFrame` enqueues a callback;
// `flush()` drains the CURRENT queue (one frame), letting a loop reschedule into
// the NEXT queue. `cancel()` removes a pending handle (what playback.stop does).
function installControllableRaf() {
    let nextId = 1;
    let queue = new Map<number, FrameRequestCallback>();
    const prevRaf = (window as any).requestAnimationFrame;
    const prevCancel = (window as any).cancelAnimationFrame;

    (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
        const id = nextId++;
        queue.set(id, cb);
        return id;
    };
    (window as any).cancelAnimationFrame = (id: number) => {
        queue.delete(id);
    };

    let clock = 0;
    return {
        /** Drain the current frame queue once (advancing the clock). */
        flush(): number {
            clock += 16;
            const current = queue;
            queue = new Map();
            for (const cb of current.values()) cb(clock);
            return current.size; // how many callbacks fired this frame
        },
        pending(): number {
            return queue.size;
        },
        restore() {
            (window as any).requestAnimationFrame = prevRaf;
            (window as any).cancelAnimationFrame = prevCancel;
        },
    };
}

describe("proof:scene-raf-leak — the preview loop stops on scope dispose", () => {
    let raf: ReturnType<typeof installControllableRaf>;
    beforeEach(() => {
        raf = installControllableRaf();
    });
    afterEach(() => {
        raf.restore();
    });

    it("useEasingDemo: dispose stops the rAF loop (no frame survives unmount)", () => {
        const scope = effectScope();
        const demo = scope.run(() => useEasingDemo())!;

        // The easing loop now gates on the machine (the private isPlaying shadow
        // is DELETED, H.W1) — drive it into `playing` so the loop arms.
        seedPlaying("easing");
        demo.play();
        // The loop is armed: a frame is pending.
        raf.flush();
        expect(raf.pending()).toBeGreaterThan(0); // it rescheduled — loop is live

        // The Suspense hard-cut: dispose the scope (fires onScopeDispose).
        scope.stop();

        // Drain whatever was queued at dispose; the loop must NOT reschedule.
        raf.flush();
        const survivors = raf.flush();
        expect(survivors).toBe(0); // zero callbacks fired — the leak is closed
        expect(raf.pending()).toBe(0);
    });

    it("useSpringDemo: dispose stops the rAF loop (no frame survives unmount)", () => {
        const scope = effectScope();
        const demo = scope.run(() => useSpringDemo())!;

        demo.play();
        raf.flush();
        expect(raf.pending()).toBeGreaterThan(0);

        scope.stop();

        raf.flush();
        const survivors = raf.flush();
        expect(survivors).toBe(0);
        expect(raf.pending()).toBe(0);
    });
});
