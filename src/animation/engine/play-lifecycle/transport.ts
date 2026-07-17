/**
 * engine/play-lifecycle/transport.ts — the TRANSPORT verbs of the standalone-play
 * machine (V.W5 LT-07 carve off `play-lifecycle.ts`).
 *
 * The user-facing transport surface (`pause`/`resume`/`toggle`/`stop`/`playing`/
 * `effectiveT`/`settle`/`reset`) plus the two teardown LEAVES it shares with the
 * frame + strategy legs — `cancelWAAPI` (WAAPI-handle teardown) and `resolvePlay`
 * (play-promise release). Those two are co-located HERE, beside `settle`, so the
 * module graph is a clean DAG: `strategies.ts` and `frame.ts` depend DOWN on this
 * leaf (they consume `settle`/`cancelWAAPI`/`resolvePlay`), and this file imports
 * NO sibling. Homing `cancelWAAPI` with the teardown leaves — rather than in
 * `strategies.ts` per LT-07's cohesion-motivated seam sketch — is the exact
 * cut-set the blueprint defers to execution (R2-05 coverage-gap: "a codemod
 * should re-derive exact symbol→file assignment"): the seam-literal placement
 * (`cancelWAAPI` in strategies, consumed by `stop`/`reset` here) would close a
 * runtime `strategies ↔ transport` import cycle, which `depcruise`'s no-cycle
 * rule (severity error, runtime edges) forbids. `cancelWAAPI`/`resolvePlay` are
 * module-internal cross-file exports (kept `export`, barrel-EXCLUDED). value.js
 * is untouched here.
 */
import {
    playing as transportPlaying,
    toggle as transportToggle,
} from "../../internal/transport-core";
import type { Vars } from "../../constants";
import type { KeyframesAnimation } from "../animation";

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

// ── Teardown leaves (module-internal, barrel-EXCLUDED) ────────────────────────
// Co-located with `settle` so the strategy + frame legs depend DOWN on this leaf
// with no back-edge (the cycle-break — see the file header).

export function resolvePlay<V extends Vars>(anim: KeyframesAnimation<V>): void {
    const resolve = anim._playback.resolvePromise;
    anim._playback.resolvePromise = null;
    resolve?.();
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
