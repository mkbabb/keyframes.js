import {
    cancelAnimationFrame,
    clamp,
    requestAnimationFrame,
} from "./internal/leaves";
import { withReducedMotion } from "./internal/reduced-motion";

/** Per-playback options for {@link RAFPlayback.play}. */
export interface RAFPlaybackOptions {
    /**
     * Honor `prefers-reduced-motion: reduce` by snapping to the final frame
     * (`onTick(1)`) in a single paint instead of running the rAF loop. The
     * returned promise resolves on the next microtask. Default false.
     *
     * This is THE shared reduced-motion gate for the light managed-playback
     * surface: `NumericAnimation` (and `ElementMorph`, which composes it)
     * route their `respectReducedMotion` option straight through here, so the
     * snap lives in one place rather than re-implemented per interpolator.
     * SSR-safe — off-DOM `prefersReducedMotion()` is false, so playback runs
     * normally.
     */
    respectReducedMotion?: boolean | undefined;
}

/**
 * A dt-driven stepper the {@link RAFPlayback.drive} loop can own:
 * `SmoothProgress` and `SpringProgress` implement it directly. The driver
 * steps `tickDt(dt)` once per frame until `settled` flips true.
 */
export interface Tickable {
    /** Advance the stepper by `dt` milliseconds; returns the new value. */
    tickDt(dt: number): number;
    /** True when the stepper has converged — the driver stops the loop. */
    readonly settled: boolean;
}

/**
 * THE managed rAF driver. Owns the rAF handle, start timestamp, dt clock,
 * and resolve callback for every loop in the engine. ONE generation-guarded
 * frame-scheduler core ({@link _run}) backs three thin entry shapes:
 *
 * - {@link play} — duration-based progress loop (`NumericAnimation`,
 *   `ElementMorph`), with the light reduced-motion snap gate built in.
 * - {@link drive} — settle-based dt loop over a {@link Tickable}
 *   (`SmoothProgress`, `SpringProgress`): steps until the stepper settles,
 *   auto-stopping; idempotent so target re-seats can re-arm it.
 * - {@link loop} — self-rescheduling frame loop over a maybe-async callback
 *   (`Animation`, `AnimationGroup`, the WAAPI shadow tick): the callback
 *   returns `true` to continue; a thenable result defers rescheduling until
 *   it resolves, so a slow async frame never double-schedules, while a
 *   sync frame (the steady `Animation`/group `_frame`, J.W6 S1) reschedules
 *   inline on the sync fast-path.
 *
 * Because all three ride one core, none can diverge — the generation guard
 * that makes `loop` safe against a `stop()` + restart mid-frame protects
 * `drive` and `play` identically.
 *
 * The formerly hand-rolled copies of this lifecycle — `SmoothProgress` /
 * `SpringProgress` `_startLoop`/`_stopLoop` byte-siblings, the
 * `AnimationGroup` draw loop, `Animation._playRAF`, and the WAAPI shadow
 * loop — all delegate here. No other module owns a rAF handle.
 *
 * BIND-PROOF BY CONSTRUCTION (I.W1 S1). The public control surface —
 * `play`/`drive`/`loop`/`stop` — is declared as ARROW CLASS-FIELDS, not
 * prototype methods, so each captures `this` at construction. A consumer can
 * `const { stop } = playback`, pass `playback.stop` straight as a callback, or
 * call `playback.stop()` as a member — ALL THREE are safe, forever, because the
 * receiver can never be dropped. This closes the entire unbound-method crash
 * class at the engine seam (the `this._gen++` throw a free-standing `stop()`
 * used to raise inside a Vue reactive flush — `rootcause-rc-dfa-gen.md`):
 * binding correctness lives ONCE here, never re-asserted per call site. The
 * arrow fields move these four methods onto the INSTANCE rather than the
 * prototype — a per-instance allocation accepted because `RAFPlayback`
 * instances are FEW and long-lived (one per scene/animation). The private
 * `_run`/`_cleanup` stay prototype methods: they are only ever reached as
 * `this._run(…)` internally, never extracted as values, so they need no bind.
 */
export class RAFPlayback {
    // `requestAnimationFrame` returns `number` in browsers but the
    // shared `requestAnimationFrame` shim falls back to `setTimeout`
    // in non-DOM environments (jsdom/Node) which returns
    // `NodeJS.Timeout`. Either suffices as an opaque cancel handle.
    private _rafId: ReturnType<typeof requestAnimationFrame> | null = null;
    private _startTime: number | undefined = undefined;
    private _lastFrameT: number = 0;
    private _resolve: (() => void) | null = null;
    /**
     * Monotonic generation counter, bumped on every `play`/`drive`/`loop`/
     * `stop`. A loop's async frame captures its generation and reschedules
     * ONLY when it still matches — so a `stop()` + restart while an async
     * frame is mid-flight cannot let the stale callback re-arm a second rAF
     * chain (the generation-unaware `_rafId !== null` guard could, because
     * the restart repopulated `_rafId`).
     */
    private _gen: number = 0;

    /** True while this driver owns a scheduled rAF callback. */
    get running(): boolean {
        return this._rafId !== null;
    }

    /**
     * THE generation-guarded frame-scheduler core. `step(now)` does one
     * frame's work and returns `true` to continue, `false` to finish; it
     * may be async (the next frame waits for it). Every frame captures the
     * generation taken at start, and reschedules ONLY when it still matches
     * — so a `stop()` + restart mid-frame (even while an async `step` is in
     * flight) cannot let a stale chain re-arm a second rAF on top of the
     * restart's freshly-repopulated `_rafId`. On `false` (or a stale
     * generation that finishes) the loop cleans up. `play`/`drive`/`loop`
     * are the three thin entry shapes over this one core.
     */
    private _run(step: (now: number) => boolean | Promise<boolean>): void {
        const gen = ++this._gen;

        const reschedule = (cont: boolean): void => {
            if (gen !== this._gen) return;
            if (cont) {
                this._rafId = requestAnimationFrame(frame);
            } else {
                this._cleanup();
            }
        };

        const frame = (now: number): void => {
            // F.W5 S1 — the sync fast-path. A synchronous `step` (every `drive`
            // stepper: `SmoothProgress`/`SpringProgress`/`Draggable` return a
            // boolean from `tickDt`; and, since J.W6 S1, the steady
            // `Animation`/`AnimationGroup` `_frame`, whose `advanceTo` is sync
            // past the first tick — ordering locked by proof:event-ordering)
            // reschedules INLINE — no `Promise.resolve`, no microtask hop. The
            // async branch is byte-unchanged for the genuinely-async frame (the
            // first-tick delay sleep, the over-batch group yield, the WAAPI
            // shadow tick): the `.then` callback body IS `reschedule`, so
            // behaviour is identical across both shapes. `typeof (result).then
            // === function` is the feature-detect (a thenable → async; a
            // boolean → sync), not a special-case — the async path remains the
            // true path for async work.
            const result = step(now);
            if (
                result &&
                typeof (result as Promise<boolean>).then === "function"
            ) {
                void (result as Promise<boolean>).then(reschedule);
            } else {
                reschedule(result as boolean);
            }
        };

        this._rafId = requestAnimationFrame(frame);
    }

    /**
     * Drive `onTick(progress)` once per frame for `duration` ms.
     * `progress` is clamped to [0, 1]; the loop terminates after the
     * frame at `progress === 1`. The returned promise resolves when
     * the animation completes naturally or is interrupted by `stop()`.
     *
     * Under `options.respectReducedMotion` + an active
     * `prefers-reduced-motion: reduce` query, snaps to the final frame —
     * `onTick(1)` fires once, no rAF loop is spawned, and the promise
     * resolves on the next microtask.
     */
    play = (
        duration: number,
        onTick: (progress: number) => void,
        options?: RAFPlaybackOptions,
    ): Promise<void> => {
        if (duration <= 0) {
            throw new Error("RAFPlayback.play() requires a duration > 0.");
        }

        this.stop();

        return withReducedMotion(
            options?.respectReducedMotion,
            // Reduced-motion: snap to the final frame in a single paint.
            () => {
                onTick(1);
                return Promise.resolve();
            },
            () =>
                new Promise<void>((resolve) => {
                    this._resolve = resolve;
                    this._startTime = undefined;

                    this._run((now) => {
                        if (this._startTime === undefined)
                            this._startTime = now;
                        const progress = clamp(
                            (now - this._startTime) / duration,
                            0,
                            1,
                        );
                        onTick(progress);
                        return progress < 1;
                    });
                }),
        );
    };

    /**
     * Drive a {@link Tickable}'s dt-stepper once per frame until it
     * settles, invoking `onFrame` after each step. Idempotent — a call
     * while the loop is already running is a no-op, so consumers re-arm
     * freely on every target re-seat. The loop auto-stops on settle.
     */
    drive = (tickable: Tickable, onFrame?: () => void): void => {
        if (this._rafId !== null) return;
        this._lastFrameT = 0;

        this._run((now) => {
            const dt = this._lastFrameT ? now - this._lastFrameT : 16.667;
            this._lastFrameT = now;
            tickable.tickDt(dt);
            onFrame?.();
            return !tickable.settled;
        });
    };

    /**
     * Self-rescheduling frame loop over an async callback. `cb(now)`
     * returns `true` to continue; the next frame is scheduled only after
     * the callback (and any awaited work inside it) completes. `stop()`
     * between frames halts the loop — the in-flight callback finishes,
     * no further frame is scheduled.
     */
    loop = (cb: (now: number) => boolean | Promise<boolean>): void => {
        this.stop();
        this._run(cb);
    };

    /** Cancel a running playback. A pending play promise resolves immediately. */
    stop = (): void => {
        this._gen++;
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
        }
        this._cleanup();
    };

    private _cleanup(): void {
        this._rafId = null;
        this._startTime = undefined;
        this._lastFrameT = 0;
        const resolve = this._resolve;
        this._resolve = null;
        resolve?.();
    }
}
