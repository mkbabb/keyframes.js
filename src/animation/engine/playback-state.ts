/**
 * `engine/playback-state.ts` — the `PlaybackState` run-state STORE, carved off
 * `engine/play-lifecycle.ts` at S.B2 on the STATE↔BEHAVIOR cohesion seam (the
 * play machine's free functions live in `./play-lifecycle`; the state they mutate lives
 * HERE). A value.js-free leaf struct: it owns the standalone-play machine's OWN
 * run-state so the state has a SINGLE owner instead of being scattered as
 * privates the class re-published through a cast (R.W2 dissolved the
 * `PlaybackHost` privacy-inversion).
 *
 *   - `resolvePromise`   — the standalone-loop deferred resolver (`playRAF`
 *                          arms it, `resolvePlay` fires it).
 *   - `_playingPromise`  — the held in-flight play promise (`get finished`
 *                          exposes it; `play` arms it; the `finally` clears it).
 *   - `_waAnimations`    — the live WAAPI compositor animations during a WAAPI
 *                          delegation (one per target); cancelled on teardown.
 *   - `_boundFrame`      — the frame callback bound ONCE at construction, never
 *                          re-bound per loop (the per-loop-closure-free idiom).
 *   - `_interpOut`       — the ONE hoisted interp buffer the play loop reuses
 *                          every frame (zero-alloc steady state).
 *
 * ── S.B2 (C-15) — PlaybackState is the SOLE STORAGE for the run-state FSM.
 * The eight transition fields (`started`/`done`/`paused`/`reversed`/`iteration`/
 * `t`/`startTime`/`pausedTime`) fold OFF the `KeyframesAnimation` class body and
 * live HERE as the single backing store; the class exposes them as accessor
 * delegates over `this._playback.*` (so the FSM stays a public, externally-written
 * surface — `group/`, `sequence/`, `ingest/`, `waapi/`, the tests, and the demo's
 * `contractAnim.t =` writes all keep working through the accessors). The
 * engine-INTERNAL hot path reads/writes `anim._playback.*` DIRECTLY (one extra
 * monomorphic load — a shape cost, not an allocation; proof:standalone-zero-alloc
 * / proof:interp-fastprops stay green). `managed` is deliberately NOT here — it is
 * loop-OWNERSHIP, not run-state, and never resets in `settle`. The literal
 * single-WRITER hard fold (a public `seek(ms)` verb + MIGRATION) is a future
 * BREAKING wave (§8-3), out of S scope.
 */
export class PlaybackState {
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;
    _playingPromise: Promise<void> | null = null;
    _waAnimations: globalThis.Animation[] = [];
    readonly _boundFrame: (t: number) => boolean | Promise<boolean>;
    readonly _interpOut: Record<string, unknown> = {};

    // ── the run-state FSM (C-15 single-STORAGE; accessor-delegated on the class) ──
    startTime: number | undefined = undefined;
    pausedTime: number = 0;
    t: number = 0;
    iteration: number = 0;
    started: boolean = false;
    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

    constructor(frameCb: (t: number) => boolean | Promise<boolean>) {
        this._boundFrame = frameCb;
    }
}
