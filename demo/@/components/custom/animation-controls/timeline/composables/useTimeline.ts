import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useRefHistory, debounceFilter } from "@vueuse/core";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";
import { defaultAnimationOptions } from "../../stores";
import { DEFAULT_CAPTURE_PROPERTIES } from "../timelineTypes";
import type { TimelineState } from "../timelineTypes";
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

    // --- Undo / redo over the centralized keyframe state (F.W14.S1) ---
    //
    // The editor's primary surfaces are DESTRUCTIVE — `clear()` wipes the whole
    // set, `removeKeyframe()` deletes a frame, the inline CSS edits rewrite a
    // frame's vars — all irreversible until now. The seam is idiomatic + cheap:
    // the keyframes already live in ONE centralized reactive `state` ref driving
    // one `rebuild`, so vueuse's `useRefHistory` (already a dep) is a composable
    // BIND over that ref, not a hand-rolled snapshot stack or a per-op undo
    // registry.
    //
    //   • `deep` + `clone`  — the ops mutate the state IN PLACE (`kf.percent`,
    //     `kf.vars`, `keyframes.push/splice`), so the history must walk + CLONE
    //     each snapshot; without `clone` the recorded snapshots would alias the
    //     live mutable objects and undo would restore nothing.
    //   • `eventFilter: debounceFilter(...)` — capture on COMMIT, not per
    //     keystroke. A multi-keystroke CSS edit collapses to ONE undo step (the
    //     wave's correctness keystone), mirroring the existing
    //     `useKeyframesEditor` 100ms debounce so an undo step is an edit the user
    //     perceives as an edit, not a single character (gate clause 2 bites a
    //     per-keystroke regression).
    //   • `capacity` — bound the trail so long editing sessions stay memory-safe.
    const {
        undo: undoHistory,
        redo: redoHistory,
        canUndo,
        canRedo,
        clear: clearHistory,
    } = useRefHistory(state, {
        deep: true,
        clone: true,
        capacity: 50,
        eventFilter: debounceFilter(100),
    });

    // Restoring a snapshot re-seats `state`; the live `Animation` re-derives
    // through the existing `rebuild` (the state is the single source). `clear()`
    // sets `animation.value = null`, so an undo back THROUGH a clear also needs a
    // rebuild to re-materialize the engine object.
    const undo = () => {
        if (!canUndo.value) return;
        undoHistory();
        rebuild();
    };
    const redo = () => {
        if (!canRedo.value) return;
        redoHistory();
        rebuild();
    };

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
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
    };
}
