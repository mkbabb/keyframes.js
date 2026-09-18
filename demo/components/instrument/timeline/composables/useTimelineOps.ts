import type { Ref } from "vue";
import { createKeyframeId } from "../timelineTypes";
import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import { captureSnapshot } from "../utils/snapshotCapture";
import { toast } from "vue-sonner";
import { clamp } from "@mkbabb/value.js/math";
import { percentSelector } from "@utils/keyframeSelector";

/**
 * The OPS half of the timeline: keyframe-array CRUD — snapshot the current
 * target, add/remove/move keyframes, edit a keyframe's properties. Each
 * mutation triggers the passed-in `rebuild` so the build half re-derives the
 * animation. Pure array operations over `state.keyframes`; no engine object.
 */
export function useTimelineOps(
    state: Ref<TimelineState>,
    scrubT: Ref<number>,
    targets: Ref<HTMLElement[]>,
    rebuild: () => void,
) {
    // --- Rebuild economics (KF.W7 G4 / RR-B missed-1..2) ---
    //
    // Every mutation below re-derives the animation, and re-deriving it is
    // EXPENSIVE by the builder's own docblock ("ASYNC because the engine
    // constructor is HEAVY"): a full engine construction plus a CSS parse. A
    // marker drag (or a held arrow's auto-repeat) calls `moveKeyframe` at
    // pointer rate — 60–120 times a second — so an unconditional `rebuild()`
    // per call builds the animation dozens of times per painted frame.
    //
    // ONE latch answers both halves of the row: calls made inside a frame
    // COALESCE into a single build on the next animation frame, and a write
    // that changes nothing (a drag held past the rail end, where every move
    // clamps to the same percent) never reaches the latch at all — see
    // `moveKeyframe`'s dirty check. The latch is the ops layer's only route to
    // `rebuild`, so no caller can re-open the hole by calling it directly.
    let rebuildFrame: number | null = null;

    const scheduleRebuild = () => {
        if (rebuildFrame !== null) return;
        rebuildFrame = requestAnimationFrame(() => {
            rebuildFrame = null;
            rebuild();
        });
    };

    const snapshot = (percent?: number) => {
        const target = targets.value[0];
        if (!target) {
            toast.error("No target element to snapshot");
            return;
        }

        const p = percent ?? scrubT.value * 100;
        const kf = captureSnapshot(target, p, state.value.captureProperties);

        state.value.keyframes.push(kf);
        scheduleRebuild();

        toast.success(`Keyframe captured at ${Math.round(p)}%`);
    };

    const addKeyframe = (percent: number, vars?: Record<string, string>) => {
        const kf: TimelineKeyframe = {
            id: createKeyframeId(),
            selector: percentSelector(percent),
            percent,
            vars: vars ?? {},
        };
        state.value.keyframes.push(kf);
        scheduleRebuild();
    };

    const removeKeyframe = (id: string) => {
        const idx = state.value.keyframes.findIndex((kf) => kf.id === id);
        if (idx !== -1) {
            state.value.keyframes.splice(idx, 1);
            scheduleRebuild();
        }
    };

    const moveKeyframe = (id: string, newPercent: number) => {
        const kf = state.value.keyframes.find((k) => k.id === id);
        if (!kf) {
            // A dangling id — a frame deleted under a live drag (L-m-14). The
            // gesture reconciles its own set every move, so reaching here is a
            // caller's invariant break, not a user failure: say so rather than
            // no-op in silence (the row's "surface the miss" half).
            console.warn(`[timeline] moveKeyframe: no keyframe with id ${id}`);
            return;
        }
        // The DIRTY CHECK (G4): a drag held past a rail end clamps every move
        // to the same percent. A write that changes nothing must not re-derive
        // the animation, and — because `useRefHistory` is deep-cloned over this
        // very state — must not bank an undo step either. It is also what makes
        // the caret's read gesture (G7) free: an unchanged commit writes nothing.
        const next = clamp(newPercent, 0, 100);
        if (next === kf.percent) return;
        kf.percent = next;
        kf.selector = percentSelector(next);
        scheduleRebuild();
    };

    const updateKeyframeProperty = (
        id: string,
        prop: string,
        value: string,
    ) => {
        const kf = state.value.keyframes.find((k) => k.id === id);
        if (kf) {
            if (value.trim() === "") {
                delete kf.vars[prop];
            } else {
                kf.vars[prop] = value;
            }
            scheduleRebuild();
        }
    };

    return {
        snapshot,
        addKeyframe,
        removeKeyframe,
        moveKeyframe,
        updateKeyframeProperty,
    };
}
