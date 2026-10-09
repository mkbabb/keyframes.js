/**
 * KFA-69 — the GROUP-LEVEL SEEK. A group's children that were started together
 * share one master clock: each child's position is that clock's elapsed time
 * read against its OWN delay, duration and iteration count. Seeking one child
 * alone (`setChildTime`) moves it off that clock, so phase-locked siblings fall
 * out of phase for the rest of the session (the Amiga ball's X/Y/Spin, the
 * cube's bob against its spin). `seek` seats EVERY child at one master elapsed
 * time, each at its own phase of it; `elapsedOf` reads a child's position back
 * as that master time, so a scrub of one channel becomes a seek of the group.
 */
import { shouldReverse } from "../engine/play-lifecycle";
import { requireEntry } from "./entries";
import type { Vars } from "../constants";
import type { KeyframesAnimation } from "../engine";
import type { AnimationGroup } from "./group";

/** The master elapsed time (ms since the group's start) a child's current
 *  position sits at: its delay, the iterations it has completed, its `t`. */
export function elapsedOf<V extends Vars>(
    group: AnimationGroup<V>,
    nameOrAnim: string | KeyframesAnimation<V>,
): number {
    const anim = requireEntry(group.animations, nameOrAnim, "elapsedOf").animation;
    const { delay, duration } = anim.options;
    return Math.max(0, delay) + anim.iteration * Math.max(0, duration) + anim.t;
}

/** Seat every child at master elapsed time `elapsed`: its local time is the
 *  elapsed time past its delay, folded into its iteration (modulo its
 *  duration), and held at the end of its last iteration when it runs a finite
 *  count. A child whose iteration changes takes that iteration's direction (the
 *  engine's own per-iteration rule); within its current iteration the
 *  direction it carries is kept. `render()` to paint the seated frame. */
export function seek<V extends Vars>(group: AnimationGroup<V>, elapsed: number): void {
    for (const { animation: anim } of Object.values(group.animations)) {
        const { delay, duration, iterationCount, direction } = anim.options;
        const local = Math.max(0, elapsed - Math.max(0, delay));
        let iteration = 0;
        let t = 0;
        if (duration > 0) {
            iteration = Math.floor(local / duration);
            t = local - iteration * duration;
            if (iteration >= iterationCount) {
                iteration = Math.max(0, Math.ceil(iterationCount) - 1);
                t = duration;
            }
        }
        if (iteration !== anim.iteration) {
            anim.iteration = iteration;
            anim.reversed = shouldReverse(direction, iteration);
        }
        group.setChildTime(anim, t);
    }
}
