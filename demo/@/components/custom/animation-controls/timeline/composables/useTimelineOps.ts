import type { Ref } from "vue";
import { createKeyframeId } from "./timelineTypes";
import type { TimelineKeyframe, TimelineState } from "./timelineTypes";
import { captureSnapshot } from "../utils/snapshotCapture";
import { toast } from "vue-sonner";

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
    const snapshot = (percent?: number) => {
        const target = targets.value[0];
        if (!target) {
            toast.error("No target element to snapshot");
            return;
        }

        const p = percent ?? scrubT.value * 100;
        const kf = captureSnapshot(target, p, state.value.captureProperties);

        state.value.keyframes.push(kf);
        rebuild();

        toast.success(`Keyframe captured at ${Math.round(p)}%`);
    };

    const addKeyframe = (percent: number, vars?: Record<string, string>) => {
        const kf: TimelineKeyframe = {
            id: createKeyframeId(),
            percent,
            vars: vars ?? {},
        };
        state.value.keyframes.push(kf);
        rebuild();
    };

    const removeKeyframe = (id: string) => {
        const idx = state.value.keyframes.findIndex((kf) => kf.id === id);
        if (idx !== -1) {
            state.value.keyframes.splice(idx, 1);
            rebuild();
        }
    };

    const moveKeyframe = (id: string, newPercent: number) => {
        const kf = state.value.keyframes.find((k) => k.id === id);
        if (kf) {
            kf.percent = Math.max(0, Math.min(100, newPercent));
            rebuild();
        }
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
            rebuild();
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
