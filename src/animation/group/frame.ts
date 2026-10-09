/**
 * group/frame.ts — one frame of the `AnimationGroup` draw loop: the per-frame
 * ADVANCE + RENDER leg, carved off `group.ts` the way the engine carved
 * `engine/play-lifecycle/frame.ts` (X.KF.W13X.r4lib — the group's 500-line
 * ceiling, reached when the draw loop gained the KFA-70 present-anchor step
 * and the KFA-31 render observers).
 *
 * The group keeps the composite itself (`advanceTo` / `render` /
 * `transformFramesGrouped`); this leg sequences a rAF tick over it: advance
 * every child, read completion, paint (which notifies the `onRender`
 * observers), and settle on done. The back-edge to the class is TYPE-only, as in `./lifecycle`.
 */
import { resolvePlay } from "./lifecycle";
import type { Vars } from "../constants";
import type { AnimationGroup } from "./group";
import type { AnimationGroupEntry } from "./types";

/** One frame of the group's draw loop: tick all children, then render. */
export function drawFrame<V extends Vars>(
    group: AnimationGroup<V>,
    t: number,
): boolean | Promise<boolean> {
    const advanced = group.advanceTo(t);
    return typeof (advanced as Promise<unknown>).then === "function"
        ? (advanced as Promise<unknown>).then(() => renderDrawFrame(group, t))
        : renderDrawFrame(group, t);
}

/** The post-advance render half of `drawFrame` — paint, or settle on done. */
function renderDrawFrame<V extends Vars>(
    group: AnimationGroup<V>,
    t: number,
): boolean {
    if (group.paused) {
        return false;
    }

    // Completion is read BEFORE the paint (a paint never changes it): delegated
    // native effects own visual output until the terminal tick, and `render`
    // composites exactly that tick. `render` notifies the `onRender` observers.
    group.done = allChildrenDone(group.getEntries());
    group.render(t);

    if (!group.done) {
        return true;
    }

    // Completion: every child already painted its rest frame + the composite
    // rendered the blend, so settle is pure teardown, never a repaint (a
    // completion `reset()` would end a fadeIn group invisible at frame 0).
    group.settle();
    resolvePlay(group);
    return false;
}

/** True when every child is done — an indexed fold, so the steady draw loop
 *  allocates nothing. */
function allChildrenDone<V extends Vars>(
    entries: AnimationGroupEntry<V>[],
): boolean {
    for (let i = 0; i < entries.length; i++) {
        if (!entries[i]!.animation.done) return false;
    }
    return true;
}
