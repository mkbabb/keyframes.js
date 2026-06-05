import { computed, ref } from "vue";
import type { Ref } from "vue";
import type { InputAnimationOptions } from "@src/animation/constants";
import { defaultAnimationOptions } from "../../stores";
import { DEFAULT_CAPTURE_PROPERTIES } from "./timelineTypes";
import type { TimelineState } from "./timelineTypes";
import { useTimelineBuild } from "./useTimelineBuild";
import { useTimelineOps } from "./useTimelineOps";

/**
 * Timeline orchestrator: owns the reactive state (keyframes, scrub position,
 * play flag) and wires the two concern-split sub-composables —
 * {@link useTimelineBuild} (the engine `CSSKeyframesAnimation` object: rebuild,
 * scrub, capture, CSS import/export) and {@link useTimelineOps} (keyframe-array
 * CRUD). The public surface is unchanged; this file is the entry seam.
 */
export function useTimeline(
    targets: Ref<HTMLElement[]>,
    options?: Ref<InputAnimationOptions>,
) {
    const state = ref<TimelineState>({
        keyframes: [],
        captureProperties: [...DEFAULT_CAPTURE_PROPERTIES],
        animationName: "timeline-animation",
    });

    const animOptions = options ?? ref({ ...defaultAnimationOptions });

    const scrubT = ref(0);
    const isPlaying = ref(false);

    const sortedKeyframes = computed(() =>
        [...state.value.keyframes].sort((a, b) => a.percent - b.percent),
    );

    const {
        animation,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        loadPreset,
        clear,
    } = useTimelineBuild(state, scrubT, animOptions, targets);

    const {
        snapshot,
        addKeyframe,
        removeKeyframe,
        moveKeyframe,
        updateKeyframeProperty,
    } = useTimelineOps(state, scrubT, targets, rebuild);

    return {
        state,
        animation,
        scrubT,
        isPlaying,
        sortedKeyframes,
        snapshot,
        addKeyframe,
        removeKeyframe,
        moveKeyframe,
        updateKeyframeProperty,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        loadPreset,
        clear,
    };
}
