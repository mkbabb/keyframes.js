import { computed, effectScope, ref, shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { useRefHistory, debounceFilter } from "@vueuse/core";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";
import { defaultAnimationOptions } from "@state";
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
function createTimelineSession(
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

    const sortedKeyframes = computed(() =>
        [...state.value.keyframes].sort((a, b) => a.percent - b.percent),
    );

    const {
        animation,
        buildError,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        mergeCSS,
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
        buildError,
        scrubT,
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
        mergeCSS,
        clear,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}

export type TimelineSession = ReturnType<typeof createTimelineSession>;

/**
 * KFA-58 (X.KF.W13X.timeline) — the timeline's keyframes, engine and undo
 * history belong to the CHANNEL, not to the component that happens to render
 * them. The pane mounts `KeyframeTimeline` under a `v-if` + `:key` (the tab
 * gate and the channel switch), so a session scoped to the component died on
 * every Controls → Timeline round trip and took the user's keyframes, the
 * built animation and the undo trail with it.
 *
 * With an `owner` (the channel's own targets array — one per channel, stable
 * for the channel's life) the session is created ONCE in a detached effect
 * scope and handed back to every later mount of the same channel. The scope
 * and the session are reachable only through the `WeakMap` entry, so they are
 * collected with the channel. Each mount feeds the session its live inputs
 * while it is mounted. Without an `owner` the session is the caller's own, as
 * before (tests, one-off mounts).
 */
const sessions = new WeakMap<
    object,
    {
        session: TimelineSession;
        targets: Ref<HTMLElement[]>;
        options: Ref<InputAnimationOptions>;
    }
>();

export function useTimeline(
    targets: Ref<HTMLElement[]>,
    options?: Ref<InputAnimationOptions>,
    owner?: object,
): TimelineSession {
    if (!owner) return createTimelineSession(targets, options);
    let entry = sessions.get(owner);
    if (!entry) {
        const liveTargets = shallowRef(targets.value);
        const liveOptions = shallowRef(options?.value ?? { ...defaultAnimationOptions });
        const session = effectScope(true).run(() =>
            createTimelineSession(liveTargets, liveOptions),
        )!;
        entry = { session, targets: liveTargets, options: liveOptions };
        sessions.set(owner, entry);
    }
    const live = entry;
    watch(targets, (next) => (live.targets.value = next), { immediate: true });
    if (options) {
        watch(options, (next) => (live.options.value = next), { immediate: true });
    }
    return live.session;
}
