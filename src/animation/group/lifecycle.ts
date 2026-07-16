/**
 * group/lifecycle.ts — the AnimationGroup TRANSPORT verbs (play / pause / resume
 * / stop / settle / reset / playing + the reduced-motion snap), lifted off the
 * `AnimationGroup` class as FREE FUNCTIONS (S.B5 / a19 F1 — the group ceiling
 * carve, mirroring the engine's `engine/play-lifecycle.ts`). The class keeps thin
 * `this`-delegates (`group.pause()` → `lifecycle.pause(this)`) so the PUBLIC
 * transport surface reads unchanged; the BODIES — the `_playingPromise`
 * re-entrancy guard, the reduced-motion snap, the jump-free pause/resume child
 * propagation, and the settle/reset teardown — live here.
 *
 * A colocated INTERNAL group module: statically imported by `group/group.ts`,
 * never re-exported beyond the group barrel, riding the SAME heavy chunk behind
 * `loadAnimationEngine()`. The back-edge to the class is a TYPE-only import
 * (`import type { AnimationGroup }`), so there is NO runtime cycle — the value
 * edge runs one way (group → lifecycle), the type edge is erased.
 *
 * The seam (what STAYS on `group.ts`): the per-frame COMPOSITE/draw half
 * (`advanceTo` / `_frame` / `_renderFrame` / `render` / `transformFramesGrouped`)
 * is the group's blend engine, and the layer-spring API delegates cohere with the
 * compositor — those are not transport. The free functions reach the group's
 * run-state through plain field access (`group.playback`, `group._boundFrame`,
 * `group._playingPromise`, the FSM flags) — the same DI-not-cast posture the
 * engine carve took; there is no `PlaybackHost` protocol and no `this as unknown`
 * cast.
 */
import { withReducedMotion } from "../internal/reduced-motion";
import { setChildrenPaused, snapChildrenToFinal } from "./entries";
import { lowerGroupWAAPI } from "./waapi";
import type { Vars } from "../constants";
import type { AnimationGroup } from "./group";
import { beginPlay, playing as transportPlaying, toggle as transportToggle } from "../internal/transport/core";

/** Cancel native group effects and return to the empty-handle rAF state. */
function cancelDelegatedWAAPI<V extends Vars>(group: AnimationGroup<V>): void {
    for (const animation of group._waAnimations) {
        try {
            animation.cancel?.();
        } catch {
            /* KEEP: detached native effects are already inert. */
        }
    }
    group._waAnimations.length = 0;
    group._waapiDelegated = false;
}

function pauseDelegatedWAAPI<V extends Vars>(group: AnimationGroup<V>): void {
    for (const animation of group._waAnimations) {
        try {
            animation.pause?.();
        } catch {
            /* KEEP: a finished/detached effect is already paused. */
        }
    }
}

function resumeDelegatedWAAPI<V extends Vars>(group: AnimationGroup<V>): void {
    for (const animation of group._waAnimations) {
        try {
            animation.play?.();
        } catch {
            /* KEEP: a finished/detached effect cannot be resumed. */
        }
    }
}

/** Resolve + clear the pending `play()` promise (the completion/stop path). */
export function resolvePlay<V extends Vars>(group: AnimationGroup<V>): void {
    const resolve = group.resolvePromise;
    group.resolvePromise = null;
    resolve?.();
}

/** Start the group. Resolves when all children complete (or on stop/reset).
 * Re-entrant: an in-flight `play()` returns the same held promise. Under
 * `respectReducedMotion` + an active query, snaps to final (no rAF loop). */
export async function play<V extends Vars>(
    group: AnimationGroup<V>,
): Promise<void> {
    return beginPlay(group, () => withReducedMotion(
        group.respectReducedMotion,
        () => playReducedMotion(group),
        () => {
            // Group lowering is deliberately opt-in through every child's
            // existing `useWAAPI` option (the gate rejects any false child).
            // The shadow rAF transport remains authoritative for lifecycle,
            // events, and completion; native effects only replace visual work.
            const native = lowerGroupWAAPI(group);
            if (native) {
                group._waAnimations.push(...native);
                group._waapiDelegated = true;
            }
            return new Promise<void>((resolve) => {
                group.resolvePromise = resolve;
                group.playback.loop(group._boundFrame);
            });
        },
    ));
}

/** `prefers-reduced-motion` snap: rest = final, paint it, settle — the SAME
 * terminal path a completed play takes, motion elided. */
export function playReducedMotion<V extends Vars>(
    group: AnimationGroup<V>,
): Promise<void> {
    group.started = true;
    // The PRM snap is INSTANTANEOUS — no rAF clock; the snap's `t` is
    // non-normative for a pure-CSS transform. No `|| performance.now()` silent
    // fallback (R.W2): the snap's clock IS 0 (the at-rest `lastTickTime`).
    const now = group.lastTickTime;

    // Snap every child to its final frame, then composite one final paint.
    snapChildrenToFinal(group.getEntries());
    if (group.singleTarget) {
        // Drive the same private compositor through the public static-render
        // seam; its long-lived storage remains encapsulated by the group.
        group.render(now);
    }

    group.settle();

    return Promise.resolve();
}

/** Pause the group — idempotent. Pausing an already-paused (or not-yet-started)
 * group is a no-op, NOT a resume. Cancels the rAF loop + renders a final-frame
 * snapshot so the visual matches the pause moment. */
export function pause<V extends Vars>(group: AnimationGroup<V>): void {
    if (!group.started || group.paused) return;

    group.paused = true;
    // A started group has ticked, so `lastTickTime` is set (R.W2 — no
    // `|| performance.now()` fallback for a never-occurring case). Record it on
    // each child's `pausedTime` so resume adjusts startTime jump-free.
    const now = group.lastTickTime;
    for (const entry of group.getEntries()) {
        const anim = entry.animation;
        anim.pause();
        if (anim.pausedTime === 0) {
            anim.pausedTime = now;
        }
    }

    group.playback.stop();
    if (group._waapiDelegated) pauseDelegatedWAAPI(group);
    group.render();
}

/** Resume the group — idempotent. Unpauses every child DIRECTLY (not via
 * `child.resume()` — the group's draw loop owns the ticking) + re-registers it. */
export function resume<V extends Vars>(group: AnimationGroup<V>): void {
    if (!group.started || !group.paused) return;
    group.paused = false;
    setChildrenPaused(group.getEntries(), false);
    if (group._waapiDelegated) resumeDelegatedWAAPI(group);
    group.playback.loop(group._boundFrame);
}

export function toggle<V extends Vars>(group: AnimationGroup<V>): void {
    transportToggle(group, () => pause(group), () => resume(group));
}

/** Pure state teardown — never paints. Releases every child (`managed = false`,
 * `child.settle()`) and clears the group flags, leaving the rest frame painted. */
export function settle<V extends Vars>(group: AnimationGroup<V>): void {
    if (group._waapiDelegated) cancelDelegatedWAAPI(group);
    for (const entry of group.getEntries()) {
        entry.animation.managed = false;
        entry.animation.settle();
    }

    group.started = false;
    group.done = false;
    group.paused = false;
    group.lastTickTime = 0;
}

/** Explicit rewind: paint every started child back to its INITIAL frame, then
 * settle — the user-facing "return to start" (completion does NOT come here). */
export function reset<V extends Vars>(group: AnimationGroup<V>): void {
    for (const entry of group.getEntries()) {
        const anim = entry.animation;
        if (anim.started && anim.frames.length > 0) {
            anim.interpFrames(0, true);
        }
    }

    group.settle();
}

/** Halt the draw loop, rewind to the initial frame (the transport-stop semantic
 * the demo's controls expect), and resolve any pending `play()`. */
export function stop<V extends Vars>(group: AnimationGroup<V>): void {
    group.playback.stop();
    group.reset();
    resolvePlay(group);
}

/** True iff the group is started and not paused. */
export function playing<V extends Vars>(group: AnimationGroup<V>): boolean {
    return transportPlaying(group);
}
