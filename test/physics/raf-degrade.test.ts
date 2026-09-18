// SERVED MODEL: claude-opus-5[1m]
/**
 * raf-degrade.test.ts — X.KF.W5 `.d` · **G-RAF**.
 *
 * `RAFPlayback` degrades, never wedges. The row (C-2, kf-SquareScene
 * D-27/L-7/C-9): `_run`'s `const result = step(now)` had **no failure path**, so
 * a frame that threw skipped `reschedule`, never reached `_cleanup`, and left
 * `_rafId` populated — `running` stays **true forever**, a pending `play()`
 * promise never settles, and every consumer guarding on `!playback.running`
 * (`useSweepScene`'s `startLoop`) becomes a permanent no-op for the mount's
 * lifetime. Drag, keyboard and tumble die silently. Reachable through the SAME
 * editor path G-RENDERER opens: `calc()` is ordinary authored CSS, and a
 * per-frame re-parse moves the throw from a survivable init site into the frame.
 *
 * The cure is stated as a contract, and the gate FAILS ON A SWALLOW: a failed
 * frame winds the loop down through the generation-guarded path and then
 * RE-RAISES the failure unchanged — *"fail a frame loudly and recoverably, not
 * wedge."* Clause (d) is the anti-swallow clause: the error object that reaches
 * the host is the identical one the step threw.
 *
 * WHERE THE BITE IS. *"It throws"* is **vacuous** — the un-cured frame throws
 * too; that is the whole defect's delivery. Every bite below is a RECOVERY
 * assertion (`running`, the settled promise, the re-arm) that the un-cured loop
 * cannot satisfy. Measured born-RED against the un-cured file: **5 failed | 2
 * passed** (the 2 = the loudness clauses, which are the letter of the gate and
 * not its measurement).
 *
 * The async arm is driven through a SYNCHRONOUS thenable rather than a real
 * `Promise`. The engine's own feature-detect is `typeof result.then ===
 * "function"` (its comment: *"a thenable → async"*), so this is the declared
 * shape, not a mock of one; it is chosen so the re-raise is OBSERVABLE at the
 * pump instead of leaving a floating rejected promise in the runner. A real
 * `Promise` takes the identical two branches one microtask later.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RAFPlayback } from "../../src/animation/physics/playback";

describe("G-RAF — a failed frame degrades loudly, and the driver recovers", () => {
    let pending: Array<(now: number) => void>;
    let cancelled: number;
    let realRAF: typeof globalThis.requestAnimationFrame;
    let realCAF: typeof globalThis.cancelAnimationFrame;

    beforeEach(() => {
        pending = [];
        cancelled = 0;
        realRAF = globalThis.requestAnimationFrame;
        realCAF = globalThis.cancelAnimationFrame;
        let id = 0;
        globalThis.requestAnimationFrame = ((cb: (now: number) => void) => {
            pending.push(cb);
            return ++id;
        }) as typeof globalThis.requestAnimationFrame;
        globalThis.cancelAnimationFrame = (() => {
            cancelled += 1;
        }) as typeof globalThis.cancelAnimationFrame;
    });
    afterEach(() => {
        globalThis.requestAnimationFrame = realRAF;
        globalThis.cancelAnimationFrame = realCAF;
    });

    /** Run the one scheduled frame, returning what it threw (if anything). */
    const pump = (now: number): unknown => {
        const cb = pending.shift();
        if (cb === undefined) throw new Error("no frame was scheduled");
        try {
            cb(now);
            return undefined;
        } catch (error) {
            return error;
        }
    };

    /** A thenable whose `then` delivers a rejection SYNCHRONOUSLY. */
    const rejectingThenable = (error: unknown) => ({
        then(
            _onFulfilled: (value: boolean) => void,
            onRejected?: (reason: unknown) => void,
        ) {
            // Absent `onRejected` a rejection passes through untouched — which
            // is exactly what the un-cured `.then(reschedule)` does with it.
            onRejected?.(error);
        },
    });

    it("(a) a sync throw does not wedge the driver — `running` goes false", () => {
        const pb = new RAFPlayback();
        const boom = new Error("boom");

        pb.loop(() => {
            throw boom;
        });
        expect(pb.running).toBe(true);
        expect(pending.length).toBe(1);

        // Loud: the failure reaches the host's uncaught-error channel, exactly
        // as any rAF callback's throw does. (Vacuous alone — see the header.)
        expect(pump(16)).toBe(boom);

        // BITE: un-cured, `reschedule` is skipped, `_cleanup` never runs, and
        // `_rafId` still holds the fired handle → `running` stays TRUE forever.
        expect(pb.running).toBe(false);
        expect(pending.length).toBe(0);
    });

    it("(b) the driver RE-ARMS after a failed frame (the `!running` guard is not a permanent no-op)", () => {
        const pb = new RAFPlayback();

        pb.loop(() => {
            throw new Error("boom");
        });
        pump(16);

        // The `useSweepScene` shape, verbatim: a consumer that re-arms only
        // when the driver is idle.
        const seen: number[] = [];
        if (!pb.running) {
            pb.loop((now) => {
                seen.push(now);
                return false;
            });
        }
        // BITE: un-cured, the guard above never opens — `startLoop` is a no-op
        // for the mount's lifetime and NOTHING below ever runs.
        expect(pending.length).toBe(1);
        pump(32);
        expect(seen).toEqual([32]);
        expect(pb.running).toBe(false);
    });

    it("(c) a pending `play()` promise SETTLES when its frame fails", async () => {
        const pb = new RAFPlayback();
        let settled = false;

        const playing = pb.play(100, () => {
            throw new Error("boom");
        });
        void playing.then(() => {
            settled = true;
        });

        pump(16);
        await new Promise((resolve) => setTimeout(resolve, 0));

        // BITE: un-cured, `_cleanup` never runs, so `_resolve` is never called
        // and every `await playback.play(...)` is stranded forever.
        expect(settled).toBe(true);
        expect(pb.running).toBe(false);
    });

    it("(d) the failure is NOT swallowed — the same error reaches the host", () => {
        const pb = new RAFPlayback();
        const boom = new TypeError("num() received an ERR from parseCssScalar");

        pb.drive({
            tickDt: () => {
                throw boom;
            },
            get settled() {
                return false;
            },
        });

        // BITE (the gate's own falsifier): a cure that catches and returns
        // `false` would wind down quietly and this clause reds. The error is
        // re-raised unchanged — same object, same message, same stack.
        expect(pump(16)).toBe(boom);
        expect(pb.running).toBe(false);
    });

    it("(e) an ASYNC frame's rejection winds the loop down too", () => {
        const pb = new RAFPlayback();
        const boom = new Error("async boom");

        pb.loop(() => rejectingThenable(boom) as unknown as Promise<boolean>);
        expect(pb.running).toBe(true);

        const raised = pump(16);

        // BITE: un-cured, `.then(reschedule)` passes NO rejection handler, so
        // the rejection escapes into an unhandled-rejection report and the loop
        // wedges in exactly the same way the sync throw does.
        expect(pb.running).toBe(false);
        expect(raised).toBe(boom);
    });

    it("(f) a STALE generation's failure does not clobber the loop that replaced it", () => {
        const pb = new RAFPlayback();

        pb.loop(() => {
            throw new Error("boom");
        });
        const staleFrame = pending.shift()!;

        // A restart lands BEFORE the stale frame runs — the generation guard's
        // whole reason for existing.
        const seen: number[] = [];
        pb.loop((now) => {
            seen.push(now);
            return true;
        });
        expect(pending.length).toBe(1);

        expect(() => staleFrame(16)).toThrow("boom");

        // BITE: a failure path that cleans up UNCONDITIONALLY would null the
        // fresh loop's `_rafId` and strand it — the stale frame must wind down
        // only its OWN generation, i.e. not at all.
        expect(pb.running).toBe(true);
        pump(32);
        expect(seen).toEqual([32]);
        pb.stop();
    });

    it("(g) a healthy loop is untouched — the regression floor", () => {
        const pb = new RAFPlayback();
        const seen: number[] = [];

        pb.loop((now) => {
            seen.push(now);
            return seen.length < 3;
        });
        let now = 0;
        while (pending.length) {
            now += 16;
            pump(now);
        }

        expect(seen).toEqual([16, 32, 48]);
        expect(pb.running).toBe(false);
        expect(cancelled).toBe(0);
    });
});
