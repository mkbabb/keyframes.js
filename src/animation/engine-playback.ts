/**
 * `engine-playback.ts` — the STANDALONE-play lifecycle machine, lifted off the
 * `KeyframesAnimation` god-object (Q.WF1, DF-11-A — the FULL engine-seam
 * transposition the D.W4 audit named, deferred D→E→F→G→H→I→J→K→L→M→O→P).
 *
 * The fourth `engine-*.ts` colocated INTERNAL module (after `engine-composition`,
 * `engine-options`, `engine-css-metadata`): statically imported by `engine.ts`,
 * never re-exported beyond the engine barrel, riding the SAME heavy chunk behind
 * `loadAnimationEngine()`. It owns the standalone-play loop (concern 3 of the
 * four `engine.ts` concerns): the rAF / WAAPI / reduced-motion play DRIVERS, the
 * per-frame render half, and the transport verbs (`play`/`pause`/`resume`/
 * `toggle`/`stop`/`settle`/`reset`/`playing`/`finished`/`effectiveT`).
 *
 * The seam (what STAYS on `engine.ts`): the per-tick ADVANCE (`advanceTo`/
 * `_advance`/`onStart`/`onEnd`) and the SAMPLE (`interpFrames`/`at`) are the
 * engine's PUBLIC sampling API — consumed externally by `group.ts`,
 * `group-layer-springs.ts`, `ingest.ts`, `morph-svg.ts`, `sequence.ts`, and the
 * WAAPI shadow loop — so they remain class methods. The play LOOP that DRIVES
 * `advanceTo` per frame is what moved.
 *
 * The extraction is host-passing (the wave's option `a`): each function accepts
 * the {@link PlaybackHost} the `KeyframesAnimation` class satisfies, and the
 * class methods become thin `this`-delegates. The `this`-bound re-derive
 * contract survives byte-for-byte: `host.options === host.compiler.options`
 * identity is never touched (these functions never reassign `options`), the
 * per-tick `host.frames` read, the `host._interpOut` zero-alloc buffer reuse,
 * the `host._boundFrame` (bound ONCE at construction), and the event ordering
 * all hold exactly as before — `proof:standalone-zero-alloc` / `proof:engine` /
 * `proof:event-ordering` are the discriminating-bite oracles.
 *
 * value.js is reached ONLY for `sleep` (the delay-await on the first tick) — the
 * SAME heavy-surface leaf `engine.ts` already imported. The module rides the
 * heavy chunk because `engine.ts` imports it statically (KISS — the established
 * colocated-internal `engine-*.ts` pattern, no new boundary edge).
 */
import { sleep } from "@mkbabb/value.js";
import type { Vars } from "./constants";
import type { KeyframesAnimation } from "./engine";
import { withReducedMotion } from "./internal/reduced-motion";
import { isWAAPIEligible, playWAAPI } from "./waapi";

/**
 * The host protocol the standalone-play machine drives — the run-state surface
 * + the sampling/fill seam the `KeyframesAnimation` class exposes. The class
 * SATISFIES this structurally (every member is a public/internal field or
 * method on it), so the functions below are `this`-bound through `host` with no
 * `this` of their own. Listing the exact surface here is the contract: a play
 * function reaches ONLY these members, never a private the class did not expose.
 */
export interface PlaybackHost<V extends Vars = any> {
    // ── run-state clocks + flags (the play machine reads/writes) ──────────
    startTime: number | undefined;
    pausedTime: number;
    t: number;
    iteration: number;
    started: boolean;
    done: boolean;
    reversed: boolean;
    paused: boolean;
    managed: boolean;
    waapiIneligibleReason: string | undefined;

    // ── the rAF + WAAPI loop handles ──────────────────────────────────────
    readonly playback: { running: boolean; loop: (cb: any) => void; stop: () => void };
    _waAnimations: globalThis.Animation[];
    /** The held in-flight play promise (`finished` exposes it; `play` arms it). */
    _playingPromise: Promise<void> | null;
    /** The standalone-loop deferred resolver (`_playRAF` arms, `_resolvePlay` fires). */
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null;
    /** The frame callback bound ONCE at construction — never re-bound per loop. */
    readonly _boundFrame: (t: number) => boolean | Promise<boolean>;
    /** The ONE hoisted interp buffer reused every standalone frame (zero-alloc). */
    readonly _interpOut: Record<string, unknown>;

    // ── the compile/options surface the play path reads ───────────────────
    options: {
        duration: number;
        delay: number;
        iterationCount: number;
        direction: string;
        fillMode: string;
        respectReducedMotion: boolean;
        useWAAPI: boolean;
    };
    readonly frames: readonly unknown[];

    // ── the sampling/fill seam (STAYS on engine.ts; the loop drives it) ────
    advanceTo(t: number): number | Promise<number>;
    interpFrames(
        t: number,
        transformFrames?: boolean,
        out?: Record<string, unknown>,
    ): Record<string, unknown>;
    reverse(): unknown;
    paintRest(): void;
    fillForwards(): void;
    fillBackwards(): void;
    dispatchAnimationEvent(type: string): void;
    assertNoUnresolvedNamedSelector(): void;
}

/** SYNC unless `delay > 0` — then a thenable resolving after the sleep. */
export function onStart<V extends Vars>(
    host: PlaybackHost<V>,
): Promise<void> | undefined {
    host.reversed = false;

    if (
        host.options.direction === "reverse" ||
        (host.options.direction === "alternate-reverse" &&
            host.iteration % 2 === 0) ||
        (host.options.direction === "alternate" && host.iteration % 2 === 1)
    ) {
        host.reverse();
    }

    if (
        host.options.fillMode === "backwards" ||
        host.options.fillMode === "both"
    ) {
        host.fillBackwards();
    }

    if (host.options.delay > 0) {
        host.paused = true;
        return sleep(host.options.delay).then(() => {
            host.paused = false;
            host.started = true;
        });
    }

    host.started = true;
    return undefined;
}

export function onEnd<V extends Vars>(host: PlaybackHost<V>): void {
    // Completion paints the rest frame per the fill contract — the one
    // place "where does the playhead rest?" is decided.
    host.paintRest();

    host.startTime = undefined;

    if (host.iteration >= host.options.iterationCount - 1) {
        host.done = true;
        host.iteration = 0;
        host.dispatchAnimationEvent("animationend");
    } else {
        host.iteration += 1;
        host.dispatchAnimationEvent("animationiteration");
    }
}

/**
 * Advance the playhead to absolute clock `t` (a rAF timestamp, NOT a
 * delta). Lazily runs `onStart` on the first call, reconciles the
 * pause/resume clock, and ends the iteration once `t` reaches the
 * duration. This is the DRIVER-layer advance — the one meaning of the
 * absolute-clock step, distinct from the `tickDt(dt)` stepper surface
 * the rest of the engine canonicalized to.
 *
 * SYNC on the steady path (J.W6 S1 — the F.W5 held half, landed): every
 * post-start frame returns a plain number (no per-frame promise+microtask
 * hop); a thenable ONLY when the FIRST tick awaits the genuinely-async
 * delay sleep. Ordering locked by proof:event-ordering.
 */
export function advanceTo<V extends Vars>(
    host: PlaybackHost<V>,
    t: number,
): number | Promise<number> {
    if (host.startTime === undefined) {
        const pending = onStart(host);
        const begin = (): number => {
            host.startTime = t + host.options.delay;
            host.dispatchAnimationEvent("animationstart");
            return advanceBody(host, t);
        };
        return pending ? pending.then(begin) : begin();
    }
    return advanceBody(host, t);
}

/** The post-start advance body — pause clock, local time, iteration end. */
function advanceBody<V extends Vars>(host: PlaybackHost<V>, t: number): number {
    if (host.paused && host.pausedTime === 0) {
        host.pausedTime = t;
        return host.t;
    } else if (host.pausedTime > 0 && !host.paused) {
        const dt = t - host.pausedTime;
        host.startTime! += dt;
        host.pausedTime = 0;
    }

    host.t = t - host.startTime!;

    if (host.t >= host.options.duration) {
        onEnd(host);
        host.t = host.options.duration;
    }
    return host.t;
}

/**
 * One frame of the standalone rAF play path, driven by the shared
 * `RAFPlayback.loop`. Returns whether the loop should continue.
 */
export function playFrame<V extends Vars>(
    host: PlaybackHost<V>,
    t: number,
): boolean | Promise<boolean> {
    // Live reduced-motion: a long/infinite animation that was running when
    // the OS toggled `prefers-reduced-motion: reduce` re-consults the ONE
    // detector per tick and converges to the SAME terminal state the
    // up-front gate produces (snap to the rest frame, settle) — the
    // observation half of the shared detector (D-LIB-3). No-op when the
    // option is off or the preference is unset (the run() branch returns).
    const flipped = withReducedMotion(
        host.options.respectReducedMotion,
        () => true,
        () => false,
    );
    if (flipped) {
        snapToReducedMotion(host);
        return false;
    }

    // Sync steady path (J.W6 S1) — the loop-core reschedules inline.
    const stepped = host.advanceTo(t);
    return typeof stepped === "number"
        ? renderFrame(host, stepped)
        : stepped.then((local) => renderFrame(host, local));
}

/** The post-advance render half of `playFrame` — paint, or settle on done. */
export function renderFrame<V extends Vars>(
    host: PlaybackHost<V>,
    t: number,
): boolean {
    if (host.paused) {
        return false;
    }

    if (!host.done) {
        // Reuse the one hoisted buffer — steady-state playback allocates
        // no per-frame result object (proof:standalone-zero-alloc).
        host.interpFrames(t, true, host._interpOut);
        return true;
    }

    // Completion: `onEnd` (inside tick) ALREADY painted the rest frame
    // per the fill contract. Do NOT re-paint here — an
    // `interpFrames(duration)` would clobber that rest paint with the
    // final frame, so a `fillMode: none` animation would end at its
    // final frame instead of resting at its initial one. settle is pure
    // teardown, never a repaint.
    settle(host);
    resolvePlay(host);
    return false;
}

export function resolvePlay<V extends Vars>(host: PlaybackHost<V>): void {
    const resolve = host.resolvePromise;
    host.resolvePromise = null;
    resolve?.();
}

/** Internal rAF-based play loop — loop ownership rides `host.playback`. */
export function playRAF<V extends Vars>(host: PlaybackHost<V>): Promise<void> {
    return new Promise((resolve) => {
        host.resolvePromise = resolve;
        host.playback.loop(host._boundFrame);
    });
}

/**
 * Play via the Web Animations API. WAAPI handles visuals on the
 * compositor thread; a shadow loop in `playWAAPI` (riding
 * `host.playback`) drives `advanceTo()` so events, iteration count,
 * pause/resume, and other lifecycle state stay coherent with the
 * rAF path.
 *
 * No silent fallback — eligibility is decided once in `play()`
 * before this is invoked, and runtime errors propagate.
 */
export async function playViaWAAPI<V extends Vars>(
    host: PlaybackHost<V>,
): Promise<void> {
    await playWAAPI(host as unknown as KeyframesAnimation<V>);
    settle(host);
}

/**
 * Cancel the live WAAPI compositor animations (if any). Cancelling
 * rejects each `wa.finished`, which `playWAAPI` catches as a halt — so
 * this both stops the compositor paint AND unblocks the awaited play
 * promise. No-op on the rAF path.
 */
export function cancelWAAPI<V extends Vars>(host: PlaybackHost<V>): void {
    if (host._waAnimations.length === 0) return;
    for (const wa of host._waAnimations) {
        try {
            wa.cancel();
        } catch {
            /* a finished/detached WAAPI animation throws on cancel — ignore */
        }
    }
    host._waAnimations = [];
}

/**
 * `prefers-reduced-motion` snap: rest = final, paint it, settle — the
 * SAME terminal path a `fillMode: forwards` completion takes, with the
 * motion elided. The lifecycle stays observable (`animationstart` →
 * final paint → `animationend`) so consumers' event wiring is identical
 * to a completed normal play.
 */
export async function playReducedMotion<V extends Vars>(
    host: PlaybackHost<V>,
): Promise<void> {
    host.started = true;
    host.dispatchAnimationEvent("animationstart");
    host.fillForwards();
    host.iteration = 0;
    host.done = true;
    host.dispatchAnimationEvent("animationend");
    settle(host);
}

/**
 * Mid-flight reduced-motion snap (D-LIB-3). A running rAF loop detected a
 * live flip to `reduce`; converge to the rest frame and resolve the
 * in-flight `play()` exactly as a forwards completion would. Distinct from
 * `playReducedMotion` (the up-front gate) only in that `animationstart`
 * already fired — so here we paint final, mark done, end, settle, and
 * release the awaiter. The WAAPI lane snaps via the same path: the up-front
 * gate already routes reduced-motion away from WAAPI, and a live flip on a
 * WAAPI animation cancels the compositor handles before settling.
 */
export function snapToReducedMotion<V extends Vars>(host: PlaybackHost<V>): void {
    cancelWAAPI(host);
    host.fillForwards();
    host.iteration = 0;
    host.done = true;
    host.dispatchAnimationEvent("animationend");
    settle(host);
    resolvePlay(host);
}

/**
 * The completion front-door's HELD-promise read (G.W13) stays INLINE on the
 * class (`get finished()` reads `this._playingPromise` — a class field — and is
 * gate-anchored there by `proof:finished`'s held-promise identity clause); it is
 * NOT lifted here. `play()` below is what ARMS that held promise.
 */
export async function play<V extends Vars>(host: PlaybackHost<V>): Promise<void> {
    if (host.managed) {
        throw new Error(
            "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead.",
        );
    }

    // Q.WD1 S3 (DM-22) — refuse to start with an UNRESOLVED named-selector
    // frame (no timeline bound) rather than running NaN-poisoned always-active
    // frames. Fired ONLY here (play-without-timeline), NEVER at parse/ingest.
    host.assertNoUnresolvedNamedSelector();

    if (host._playingPromise) return host._playingPromise;

    const result = withReducedMotion(
        host.options.respectReducedMotion,
        // Reduced-motion wins over WAAPI/rAF — snap to the final frame.
        () => {
            host.waapiIneligibleReason = undefined;
            return playReducedMotion(host);
        },
        () => {
            if (host.options.useWAAPI) {
                const elig = isWAAPIEligible(
                    host as unknown as KeyframesAnimation<V>,
                );
                if (elig.eligible) {
                    host.waapiIneligibleReason = undefined;
                    return playViaWAAPI(host);
                }
                host.waapiIneligibleReason = elig.reason;
                return playRAF(host);
            }
            host.waapiIneligibleReason = undefined;
            return playRAF(host);
        },
    );

    host._playingPromise = result;
    result.finally(() => {
        host._playingPromise = null;
    });
    return result;
}

/**
 * Pause playback — idempotent. Pausing an already-paused (or
 * not-yet-started) animation is a no-op, never a resume: a method named
 * `pause` pauses. Use {@link resume} for the explicit resume.
 */
export function pause<V extends Vars>(host: PlaybackHost<V>): void {
    if (host.started) {
        host.paused = true;
    }
}

export function resume<V extends Vars>(host: PlaybackHost<V>): void {
    if (host.started && host.paused) {
        host.paused = false;
        if (host._waAnimations.length > 0) {
            // WAAPI: the shadow loop is still installed (it keeps
            // rescheduling while paused, pausing the compositor each
            // frame), so it resumes the curve on its next tick. Do NOT
            // start the rAF `_frame` loop — that would race the shadow
            // loop and orphan the paused compositor animation. Nudge the
            // compositor directly for an immediate resume.
            for (const wa of host._waAnimations) wa.play();
        } else if (!host.playback.running) {
            host.playback.loop(host._boundFrame);
        }
    }
}

/** The explicit flip: pauses if playing, resumes if paused. */
export function toggle<V extends Vars>(host: PlaybackHost<V>): void {
    if (host.paused) resume(host);
    else pause(host);
}

/**
 * Halt playback where it stands: cancel the loop AND the WAAPI
 * compositor animations, settle state, and resolve any pending `play()`
 * promise. Never paints — `reset()` is the explicit rewind.
 */
export function stop<V extends Vars>(host: PlaybackHost<V>): void {
    cancelWAAPI(host);
    host.playback.stop();
    settle(host);
    resolvePlay(host);
}

export function playing<V extends Vars>(host: PlaybackHost<V>): boolean {
    return !(!host.started || host.paused);
}

/** Returns the effective time accounting for direction reversal. */
export function effectiveT<V extends Vars>(host: PlaybackHost<V>): number {
    return host.reversed ? host.options.duration - host.t : host.t;
}

/**
 * Pure state teardown — flags, clocks, iteration. NEVER paints. This is
 * the terminal half of the rest-position contract: completion paints
 * the rest frame (via `onEnd` → `paintRest`) and then settles; the
 * reduced-motion snap paints final and then settles. Settling is
 * orthogonal to where the pixels rest.
 */
export function settle<V extends Vars>(host: PlaybackHost<V>): void {
    host.done = false;
    host.started = false;
    host.paused = false;
    host.reversed = false;
    host.iteration = 0;
    host.startTime = undefined;
    host.pausedTime = 0;
    host.t = 0;
}

/**
 * Explicit rewind: paint the INITIAL frame, then settle. This is the
 * user-facing "return to start" — rest position `initial`, painted
 * deliberately — distinct from `settle()`, which tears down state and
 * leaves the pixels where they rest.
 */
export function reset<V extends Vars>(host: PlaybackHost<V>): void {
    cancelWAAPI(host);
    if (host.started && host.frames.length > 0) {
        host.fillBackwards();
    }
    settle(host);
}
