/**
 * engine/play-lifecycle/strategies.ts — the PLAY-DRIVER strategies of the
 * standalone-play machine (V.W5 LT-07 carve off `play-lifecycle.ts`).
 *
 * The three play drivers (`playRAF` rAF loop / `playViaWAAPI` compositor +
 * shadow loop / `playReducedMotion` up-front snap), the mid-flight reduced-motion
 * snap (`snapToReducedMotion`), and the `play()` front-door that arbitrates
 * reduced-motion → WAAPI-eligibility → rAF. Depends DOWN on the transport leaf
 * for the teardown primitives (`settle`/`cancelWAAPI`/`resolvePlay`) — no
 * back-edge. `snapToReducedMotion` is a module-internal cross-file export (kept
 * `export`, barrel-EXCLUDED — consumed by `frame.ts`'s `playFrame`).
 */
import { cancelWAAPI, resolvePlay, settle } from "./transport";
import { withReducedMotion } from "../../internal/reduced-motion";
import { beginPlay } from "../../internal/transport-core";
import { isWAAPIEligible, playWAAPI } from "../../waapi";
import type { Vars } from "../../constants";
import type { KeyframesAnimation } from "../animation";

/** Internal rAF-based play loop — loop ownership rides `anim.playback`. */
function playRAF<V extends Vars>(
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
async function playViaWAAPI<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> {
    await playWAAPI(anim);
    settle(anim);
}

/**
 * `prefers-reduced-motion` snap: rest = final, paint it, settle — the
 * SAME terminal path a `fillMode: forwards` completion takes, with the
 * motion elided. The lifecycle stays observable (`animationstart` →
 * final paint → `animationend`) so consumers' event wiring is identical
 * to a completed normal play.
 */
async function playReducedMotion<V extends Vars>(
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
