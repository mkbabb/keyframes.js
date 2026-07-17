/**
 * `engine/play-lifecycle.ts` — the STANDALONE-play lifecycle machine (the play/
 * advance/transport FREE FUNCTIONS), lifted off the `KeyframesAnimation`
 * god-object (Q.WF1 / R.W2 — the engine carve; renamed from `engine/playback.ts`
 * at S.B4 to clear the `playback.ts` cross-zone basename collision with
 * `physics/playback.ts`'s canonical `RAFPlayback` — r3 F7). The run-state STORE
 * they mutate — the `PlaybackState` struct — lives beside it in `./playback-state`
 * (S.B2 carved the struct off on the STATE↔BEHAVIOR cohesion seam; the free
 * functions reach it through `anim._playback`).
 *
 * A colocated INTERNAL engine module: statically imported by `engine/animation.ts`,
 * never re-exported beyond the engine barrel, riding the SAME heavy chunk behind
 * `loadAnimationEngine()`. It owns the standalone-play loop (concern 3 of the
 * four engine concerns): the rAF / WAAPI / reduced-motion play DRIVERS, the
 * per-frame render half, and the transport verbs (`play`/`pause`/`resume`/
 * `toggle`/`stop`/`settle`/`reset`/`playing`/`effectiveT`).
 *
 * ── R.W2: PlaybackState OWNS the run-state (DI, not the PlaybackHost cast).
 * The play machine's OWN run-state — the deferred play resolver, the held
 * play promise, the live WAAPI compositor handles, the bound frame callback,
 * and the hoisted zero-alloc interp buffer — lives in the {@link PlaybackState}
 * struct, which `KeyframesAnimation` composes as a `readonly _playback` field.
 * The free functions below take the concrete `KeyframesAnimation` (they read its
 * clocks/flags/options and call its sampling/fill seam directly) and reach the
 * play-machine state through `anim._playback`. There is NO `PlaybackHost`
 * interface re-publishing the class's privates, and NO `this as unknown as`
 * cast threading `this` through a faked protocol: the audit's privacy-inversion
 * (lib-engine F-2/F-9) is dissolved — the collaborator owns its state, the
 * animation owns the rest, and the seam between them is plain field access.
 *
 * The seam (what STAYS on `animation.ts`): the per-tick ADVANCE (`advanceTo`/
 * `onStart`/`onEnd`) and the SAMPLE (`interpFrames`/`at`) are the engine's PUBLIC
 * sampling API — consumed externally by `group.ts`, the WAAPI shadow loop,
 * `ingest.ts`, `morph-svg.ts`, `sequence.ts` — so they remain class methods; the
 * play LOOP that DRIVES `advanceTo` per frame is what moved.
 *
 * The `this`-bound re-derive contract survives byte-for-byte (the functions never
 * reassign `anim.options`; the per-tick `anim.frames` read + the
 * `anim._playback._interpOut`/`._boundFrame` reuse hold — proof:standalone-zero-
 * alloc / proof:engine / proof:event-ordering). value.js is reached ONLY for
 * `sleep` (the first-tick delay-await).
 */
import { sleep } from "../internal/helpers";
import type { FlatAuthoredValues } from "../compile/value-ast";
import type { Vars } from "../constants";
import type { KeyframesAnimation } from "./animation";
import { beginPlay, playing as transportPlaying, toggle as transportToggle } from "../internal/transport-core";
import { withReducedMotion } from "../internal/reduced-motion";
import { isWAAPIEligible, playWAAPI } from "../waapi";

/**
 * Fire a lifecycle `AnimationEvent` on each bound target (R.W2 — F-6). SSR-safe
 * capability contract: `AnimationEvent`/`dispatchEvent` are DOM capabilities —
 * when absent (Node, non-element targets) the lifecycle proceeds without events
 * rather than throwing, mirroring the off-DOM posture of `prefersReducedMotion()`.
 * Event delivery is an observation channel, not a library-internal contract.
 */
export function dispatchAnimationEvent<V extends Vars>(
    anim: KeyframesAnimation<V>,
    type: string,
): void {
    if (typeof AnimationEvent === "undefined") return;
    for (const target of anim.targets) {
        if (typeof target?.dispatchEvent !== "function") continue;
        target.dispatchEvent(
            new AnimationEvent(type, {
                animationName: anim.name ?? "",
                elapsedTime: anim._playback.t / 1000,
            }),
        );
    }
}

/**
 * The three-way direction → reversal predicate (R.W2 F-3 — the DRY fix). Both
 * `setDirection` (mid-iteration direction change) and `onStart` (the play-start
 * reversal) read the SAME test; authored ONCE here so a future direction
 * variant cannot silently diverge between the two sites.
 */
export function shouldReverse(direction: string, iteration: number): boolean {
    return (
        direction === "reverse" ||
        (direction === "alternate-reverse" && iteration % 2 === 0) ||
        (direction === "alternate" && iteration % 2 === 1)
    );
}

/**
 * Flip the direction, adjusting `startTime` so `effectiveT` stays continuous
 * across the flip (R.W2 delegation — body carved off the class at S.B2). Before:
 * `effectiveT = reversed ? duration - t : t`; after the flip we need the SAME
 * `effectiveT`, so shift the raw clock so `t → duration - t`. The class keeps a
 * thin `reverse()` delegate; `onStart` also calls this at play-start.
 */
export function reverse<V extends Vars>(anim: KeyframesAnimation<V>): void {
    if (anim._playback.startTime !== undefined) {
        const rawT = anim._playback.t;
        const shift = anim.options.duration - 2 * rawT;
        anim._playback.startTime -= shift;
    }
    anim._playback.reversed = !anim._playback.reversed;
}

/** SYNC unless `delay > 0` — then a thenable resolving after the sleep. */
export function onStart<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> | undefined {
    anim._playback.reversed = false;

    if (shouldReverse(anim.options.direction, anim._playback.iteration)) {
        reverse(anim);
    }

    if (anim.options.fillMode === "backwards" || anim.options.fillMode === "both") {
        anim.fillBackwards();
    }

    if (anim.options.delay > 0) {
        anim._playback.paused = true;
        return sleep(anim.options.delay).then(() => {
            anim._playback.paused = false;
            anim._playback.started = true;
        });
    }

    anim._playback.started = true;
    return undefined;
}

export function onEnd<V extends Vars>(anim: KeyframesAnimation<V>): void {
    // Completion paints the rest frame per the fill contract — the one
    // place "where does the playhead rest?" is decided.
    anim.paintRest();

    anim._playback.startTime = undefined;

    if (anim._playback.iteration >= anim.options.iterationCount - 1) {
        anim._playback.done = true;
        anim._playback.iteration = 0;
        anim.dispatchAnimationEvent("animationend");
    } else {
        anim._playback.iteration += 1;
        anim.dispatchAnimationEvent("animationiteration");
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
    anim: KeyframesAnimation<V>,
    t: number,
): number | Promise<number> {
    if (anim._playback.startTime === undefined) {
        const pending = onStart(anim);
        const begin = (): number => {
            anim._playback.startTime = t + anim.options.delay;
            anim.dispatchAnimationEvent("animationstart");
            return advanceBody(anim, t);
        };
        return pending ? pending.then(begin) : begin();
    }
    return advanceBody(anim, t);
}

/** The post-start advance body — pause clock, local time, iteration end. */
function advanceBody<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): number {
    if (anim._playback.paused && anim._playback.pausedTime === 0) {
        anim._playback.pausedTime = t;
        return anim._playback.t;
    } else if (anim._playback.pausedTime > 0 && !anim._playback.paused) {
        const dt = t - anim._playback.pausedTime;
        anim._playback.startTime! += dt;
        anim._playback.pausedTime = 0;
    }

    anim._playback.t = t - anim._playback.startTime!;

    if (anim._playback.t >= anim.options.duration) {
        onEnd(anim);
        anim._playback.t = anim.options.duration;
    }
    return anim._playback.t;
}

/**
 * One frame of the standalone rAF play path, driven by the shared
 * `RAFPlayback.loop`. Returns whether the loop should continue.
 */
export function playFrame<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): boolean | Promise<boolean> {
    // Live reduced-motion: a long/infinite animation that was running when
    // the OS toggled `prefers-reduced-motion: reduce` re-consults the ONE
    // detector per tick and converges to the SAME terminal state the
    // up-front gate produces (snap to the rest frame, settle) — the
    // observation half of the shared detector (D-LIB-3). No-op when the
    // option is off or the preference is unset (the run() branch returns).
    const flipped = withReducedMotion(
        anim.options.respectReducedMotion,
        () => true,
        () => false,
    );
    if (flipped) {
        snapToReducedMotion(anim);
        return false;
    }

    // Sync steady path (J.W6 S1) — the loop-core reschedules inline.
    const stepped = anim.advanceTo(t);
    return typeof stepped === "number"
        ? renderFrame(anim, stepped)
        : stepped.then((local) => renderFrame(anim, local));
}

/** The post-advance render half of `playFrame` — paint, or settle on done. */
export function renderFrame<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): boolean {
    if (anim._playback.paused) {
        return false;
    }

    if (!anim._playback.done) {
        // Reuse the one hoisted buffer — steady-state playback allocates
        // no per-frame result object (proof:standalone-zero-alloc).
        anim.interpFrames(
            t,
            true,
            anim._playback._interpOut as FlatAuthoredValues,
        );
        return true;
    }

    // Completion: `onEnd` (inside tick) ALREADY painted the rest frame
    // per the fill contract. Do NOT re-paint here — an
    // `interpFrames(duration)` would clobber that rest paint with the
    // final frame, so a `fillMode: none` animation would end at its
    // final frame instead of resting at its initial one. settle is pure
    // teardown, never a repaint.
    settle(anim);
    resolvePlay(anim);
    return false;
}

export function resolvePlay<V extends Vars>(anim: KeyframesAnimation<V>): void {
    const resolve = anim._playback.resolvePromise;
    anim._playback.resolvePromise = null;
    resolve?.();
}

/** Internal rAF-based play loop — loop ownership rides `anim.playback`. */
export function playRAF<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> {
    return new Promise((resolve) => {
        anim._playback.resolvePromise = resolve;
        anim.playback.loop(anim._playback._boundFrame);
    });
}

/**
 * Play via the Web Animations API. WAAPI handles visuals on the
 * compositor thread; a shadow loop in `playWAAPI` (riding
 * `anim.playback`) drives `advanceTo()` so events, iteration count,
 * pause/resume, and other lifecycle state stay coherent with the
 * rAF path.
 *
 * No silent fallback — eligibility is decided once in `play()`
 * before this is invoked, and runtime errors propagate.
 */
export async function playViaWAAPI<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> {
    await playWAAPI(anim);
    settle(anim);
}

/**
 * Cancel the live WAAPI compositor animations (if any). Cancelling
 * rejects each `wa.finished`, which `playWAAPI` catches as a halt — so
 * this both stops the compositor paint AND unblocks the awaited play
 * promise. No-op on the rAF path.
 */
export function cancelWAAPI<V extends Vars>(anim: KeyframesAnimation<V>): void {
    const waAnimations = anim._playback._waAnimations;
    if (waAnimations.length === 0) return;
    for (const wa of waAnimations) {
        try {
            wa.cancel();
        } catch {
            /* KEEP: a finished/detached WAAPI animation throws on cancel — ignore */
        }
    }
    anim._playback._waAnimations = [];
}

/**
 * `prefers-reduced-motion` snap: rest = final, paint it, settle — the
 * SAME terminal path a `fillMode: forwards` completion takes, with the
 * motion elided. The lifecycle stays observable (`animationstart` →
 * final paint → `animationend`) so consumers' event wiring is identical
 * to a completed normal play.
 */
export async function playReducedMotion<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> {
    anim._playback.started = true;
    anim.dispatchAnimationEvent("animationstart");
    anim.fillForwards();
    anim._playback.iteration = 0;
    anim._playback.done = true;
    anim.dispatchAnimationEvent("animationend");
    settle(anim);
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
export function snapToReducedMotion<V extends Vars>(
    anim: KeyframesAnimation<V>,
): void {
    cancelWAAPI(anim);
    anim.fillForwards();
    anim._playback.iteration = 0;
    anim._playback.done = true;
    anim.dispatchAnimationEvent("animationend");
    settle(anim);
    resolvePlay(anim);
}

/**
 * The completion front-door's HELD-promise read (G.W13) stays INLINE on the
 * class (`get finished()` reads `this._playback._playingPromise` — a field on
 * the composed struct — and is gate-anchored there by `proof:finished`'s
 * held-promise identity clause); it is NOT lifted here. `play()` below is what
 * ARMS that held promise.
 */
export async function play<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> {
    if (anim.managed) {
        throw new Error(
            "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead.",
        );
    }

    // Q.WD1 S3 (DM-22) — refuse to start with an UNRESOLVED named-selector
    // frame (no timeline bound) rather than running NaN-poisoned always-active
    // frames. Fired ONLY here (play-without-timeline), NEVER at parse/ingest.
    anim.assertNoUnresolvedNamedSelector();

    return beginPlay(anim._playback, () => withReducedMotion(
        anim.options.respectReducedMotion,
        // Reduced-motion wins over WAAPI/rAF — snap to the final frame.
        () => {
            anim.waapiIneligibleReason = undefined;
            return playReducedMotion(anim);
        },
        () => {
            if (anim.options.useWAAPI) {
                const elig = isWAAPIEligible(anim);
                if (elig.eligible) {
                    anim.waapiIneligibleReason = undefined;
                    return playViaWAAPI(anim);
                }
                anim.waapiIneligibleReason = elig.reason;
                return playRAF(anim);
            }
            anim.waapiIneligibleReason = undefined;
            return playRAF(anim);
        },
    ));
}

/**
 * Pause playback — idempotent. Pausing an already-paused (or
 * not-yet-started) animation is a no-op, never a resume: a method named
 * `pause` pauses. Use {@link resume} for the explicit resume.
 */
export function pause<V extends Vars>(anim: KeyframesAnimation<V>): void {
    if (anim._playback.started) {
        anim._playback.paused = true;
    }
}

export function resume<V extends Vars>(anim: KeyframesAnimation<V>): void {
    if (anim._playback.started && anim._playback.paused) {
        anim._playback.paused = false;
        if (anim._playback._waAnimations.length > 0) {
            // WAAPI: the shadow loop is still installed (it keeps
            // rescheduling while paused, pausing the compositor each
            // frame), so it resumes the curve on its next tick. Do NOT
            // start the rAF `_frame` loop — that would race the shadow
            // loop and orphan the paused compositor animation. Nudge the
            // compositor directly for an immediate resume.
            for (const wa of anim._playback._waAnimations) wa.play();
        } else if (!anim.playback.running) {
            anim.playback.loop(anim._playback._boundFrame);
        }
    }
}

/** The explicit flip: pauses if playing, resumes if paused. */
export function toggle<V extends Vars>(anim: KeyframesAnimation<V>): void {
    transportToggle(anim._playback, () => pause(anim), () => resume(anim));
}

/**
 * Halt playback where it stands: cancel the loop AND the WAAPI
 * compositor animations, settle state, and resolve any pending `play()`
 * promise. Never paints — `reset()` is the explicit rewind.
 */
export function stop<V extends Vars>(anim: KeyframesAnimation<V>): void {
    cancelWAAPI(anim);
    anim.playback.stop();
    settle(anim);
    resolvePlay(anim);
}

export function playing<V extends Vars>(anim: KeyframesAnimation<V>): boolean {
    return transportPlaying(anim._playback);
}

/** Returns the effective time accounting for direction reversal. */
export function effectiveT<V extends Vars>(anim: KeyframesAnimation<V>): number {
    return anim._playback.reversed ? anim.options.duration - anim._playback.t : anim._playback.t;
}

/**
 * Pure state teardown — flags, clocks, iteration. NEVER paints. This is
 * the terminal half of the rest-position contract: completion paints
 * the rest frame (via `onEnd` → `paintRest`) and then settles; the
 * reduced-motion snap paints final and then settles. Settling is
 * orthogonal to where the pixels rest.
 */
export function settle<V extends Vars>(anim: KeyframesAnimation<V>): void {
    anim._playback.done = false;
    anim._playback.started = false;
    anim._playback.paused = false;
    anim._playback.reversed = false;
    anim._playback.iteration = 0;
    anim._playback.startTime = undefined;
    anim._playback.pausedTime = 0;
    anim._playback.t = 0;
}

/**
 * Explicit rewind: paint the INITIAL frame, then settle. This is the
 * user-facing "return to start" — rest position `initial`, painted
 * deliberately — distinct from `settle()`, which tears down state and
 * leaves the pixels where they rest.
 */
export function reset<V extends Vars>(anim: KeyframesAnimation<V>): void {
    cancelWAAPI(anim);
    if (anim._playback.started && anim.frames.length > 0) {
        anim.fillBackwards();
    }
    settle(anim);
}
