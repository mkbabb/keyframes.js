import type { Ref } from "vue";
import { createKeyframeId } from "../timelineTypes";
import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import { captureSnapshot } from "../utils/snapshotCapture";
import { toast } from "@mkbabb/glass-ui/toast";
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
    rebuild: () => Promise<void>,
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
    //
    // --- The settlement of the latched build (KF.W7 G14 · L-11, clause P3:
    // OUTCOME BEFORE ACKNOWLEDGEMENT) ---
    //
    // `rebuild` is ASYNC by the builder's own signature, and this seam used to
    // declare it `() => void`: the fact that a build was still in flight was
    // ERASED at the parameter, so `snapshot` announced "Keyframe captured"
    // before the build it had just triggered had happened — an acknowledgement
    // that preceded its own outcome. The cure is the type plus a handle, never
    // an un-latching: the coalescing above is G4's row and is not traded away
    // for this one. `scheduleRebuild` hands back the promise OF THE BUILD IT
    // LATCHED, so the callers coalesced into one frame all await the same
    // single build, and a caller that needs the outcome can wait for it.
    //
    // The settlement resolves when that build SETTLES. A failed build surfaces
    // through the builder's own channel (G14 P3: `buildError` + `toast.error`
    // with a Retry action) and is rendered by the owner, so this seam mints no
    // second failure channel — one posture, not two — and the fire-and-forget
    // callers below cannot manufacture an unhandled rejection at pointer rate.
    let rebuildFrame: number | null = null;
    let rebuildSettled: Promise<void> = Promise.resolve();

    const scheduleRebuild = (): Promise<void> => {
        if (rebuildFrame !== null) return rebuildSettled;

        // The executor runs synchronously, so the latch is armed before this
        // returns — the same latch, in the same frame, as before.
        rebuildSettled = new Promise<void>((settle) => {
            rebuildFrame = requestAnimationFrame(() => {
                rebuildFrame = null;
                void rebuild().then(settle, settle);
            });
        });
        return rebuildSettled;
    };

    const snapshot = async (percent?: number): Promise<void> => {
        const target = targets.value[0];
        if (!target) {
            toast({ title: "No target element to snapshot", tone: "destructive" });
            return;
        }

        const p = percent ?? scrubT.value * 100;
        const kf = captureSnapshot(target, p, state.value.captureProperties);

        state.value.keyframes.push(kf);
        // The acknowledgement waits for the outcome (G14 P3). What it claims —
        // that a keyframe was captured at this percent — is true whether or not
        // the build that follows succeeds, and a build that fails says so in its
        // own voice rather than through this line's silence.
        await scheduleRebuild();

        toast({ title: `Keyframe captured at ${Math.round(p)}%`, tone: "success" });
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
