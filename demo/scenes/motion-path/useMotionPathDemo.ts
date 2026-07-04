import { computed, markRaw, ref, shallowRef } from "vue";

import { kfEngine } from "@utils/kfEngine";
import type {
    AnimationGroup,
    CSSKeyframesAnimation,
} from "@mkbabb/keyframes.js";

import {
    createGroupAdapter,
    useSceneMachine,
} from "@state";

import {
    buildPathD,
    DEFAULT_POINTS,
    type PathPoint,
} from "./motionPathGeometry";

/**
 * useMotionPathDemo — the dogfood of the CSS-native MotionPath primitive
 * (F.W12.S3). It drives an element along an author `offset-path` by sweeping
 * `offset-distance` via `fromMotionPath` — proving the primitive the way the
 * cube proves `AnimationGroup`.
 *
 * The MotionPath animation IS a `CSSKeyframesAnimation`, so it slots straight
 * into a contract `AnimationGroup` and rides the editor's EXISTING bottom-bar
 * transport (play/pause/scrub) — no custom loop. The traveller element only
 * exists after mount (the factory sets `offset-path` on a live element), so the
 * scene registers its animation on mount and swaps the reactive group; the
 * App's scene-machine group watcher binds the new group instance and registers
 * its ScenePlayback adapter (H.W1).
 *
 * INTERACTIVITY (H.W5.S4a): the traveller is draggable ALONG its own path. The
 * gesture composable (`useMotionPathGesture`, H.W12.S2 / I9) projects the
 * pointer onto the SVG `<path>` and re-seats the engine playhead via
 * `group.setChildTime(...).render()` — the SAME scrub seam the bottom-bar slider
 * uses, so the drag and the scrub share ONE progress source (DRY).
 *
 * EDITABLE PATH (H.W12.S6 / I3 — the F4 elevation): the author path is no longer
 * fixed. This composable owns the reactive editable control net ({@link points})
 * + its compiled `d` ({@link pathD}) — the SINGLE source both the SVG guide
 * `<path>` and the traveller's `offset-path` re-read in lockstep. A control
 * handle drag (in `useMotionPathGesture`) mutates a point through {@link movePoint};
 * the guide binds `pathD` and the gesture re-writes the traveller's
 * `offset-path` to the same `pathD`, so the two can never drift
 * (proof:motion-path-editable). {@link copyablePath} is the copy-paste artifact
 * (proof:motion-path-copy).
 */
export function useMotionPathDemo() {
    // HEAVY constructor from the warmed engine (kfEngine(), L.W8 S1 dogfood
    // inversion) — synchronous, since the warm resolves before any scene mounts.
    // The `AnimationGroup` TYPE flows from the barrel (separate namespace).
    const { AnimationGroup } = kfEngine();

    // Starts empty; the traveller's MotionPath animation is registered on mount.
    const animationGroup = shallowRef<AnimationGroup<any>>(
        markRaw(new AnimationGroup()),
    );
    const isStarted = ref(true);

    // ── Playback intent: MACHINE-NATIVE, not a private shadow (S5c / D12) ──────
    // The former `isPlaying = ref(false)` was the un-migrated D12 SHADOW-AUTHORITY:
    // the gesture engine mutated it at four callsites BESIDE the machine (a pause-
    // for-drag / resume-on-release that bypassed the single playback authority), so
    // the cold-mount play state and the bottom-bar transport could disagree with
    // what the engine group was actually doing. Migrated to the same pattern the
    // sibling rAF scenes use: `isPlaying` is a READ-ONLY projection of the machine
    // status; play/pause DISPATCH to the machine, whose group adapter (the
    // `scenePlayback` exposed below) suspends/resumes the engine group. The gesture
    // engine now routes its transient pause/resume through `play()`/`pause()` — no
    // shadow ref to drift, and the traveller's position round-trips through the
    // group snapshot (each anim's `t`) by construction.
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");

    /** Resume the engine group via the machine (the gesture resume-on-release). */
    const play = (): void => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };
    /** Pause the engine group via the machine (the gesture pause-for-drag). */
    const pause = (): void => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };

    // ── The ScenePlayback adapter (S5c — the App registers THIS on SCENE_READY) ─
    // MotionPath IS a group scene (the `fromMotionPath` CSSKeyframesAnimation rides
    // a contract `AnimationGroup`), so the machine-native adapter is the group
    // adapter — the SAME contract cube/amiga ride. Exposing it makes the App treat
    // playback as machine-owned (`ownsPlayback` true ⇒ it never writes the readonly
    // `isPlaying` computed), and the group snapshot round-trips the traveller's
    // offset-distance position (`anim.t`) across suspend/restore. The getter reads
    // the LIVE group (lazily) so it tracks the post-`registerAnimation` swap.
    const scenePlayback = createGroupAdapter(() => animationGroup.value);

    // ── The editable control net (the single source, H.W12.S6 / I3) ──────────
    // A mutable copy of the default figure-loop points (DEFAULT_POINTS is a
    // readonly const witness). Dragging a handle mutates one point's x/y; the
    // compiled `pathD` re-emits, and BOTH consumers re-read it.
    const points = ref<PathPoint[]>(DEFAULT_POINTS.map((p) => ({ ...p })));

    /** The ONE `d` string — the guide `<path>` d AND the traveller offset-path. */
    const pathD = computed(() => buildPathD(points.value));

    /** Move one editable point (by id) to new user-unit coords. The compiled
     *  `pathD` recomputes, re-emitting the single source. */
    const movePoint = (id: string, x: number, y: number): void => {
        const pt = points.value.find((p) => p.id === id);
        if (!pt) return;
        pt.x = x;
        pt.y = y;
        // Reassign to trigger the computed (the array identity is stable, but the
        // ref's deep reactivity tracks the mutation; nudge it explicitly so a
        // shallowRef-style consumer also re-reads).
        points.value = [...points.value];
    };

    /** Reset the path to the default figure-loop (the egg/“revert” affordance). */
    const resetPath = (): void => {
        points.value = DEFAULT_POINTS.map((p) => ({ ...p }));
    };

    /** The copy-paste artifact: the full `offset-path` declaration, ready to
     *  paste into a stylesheet (the second copy artifact beside Discrete's
     *  linear(), proof:motion-path-copy). */
    const copyablePath = computed(
        () => `offset-path: path('${pathD.value}');`,
    );

    /**
     * Register the traveller's MotionPath animation (built on mount, once the
     * DOM element exists for the `offset-path` set). Wraps it in a fresh
     * contract `AnimationGroup` and publishes it reactively.
     */
    const registerAnimation = (anim: CSSKeyframesAnimation<any>): void => {
        anim.superKey = "MotionPath";
        animationGroup.value = markRaw(new AnimationGroup(anim));
    };

    return {
        animationGroup,
        isStarted,
        // Machine-native playback (S5c): a read-only projection + dispatchers + the
        // group ScenePlayback adapter the App registers (NO shadow `isPlaying` ref).
        isPlaying,
        play,
        pause,
        scenePlayback,
        registerAnimation,
        // The editable geometry (H.W12.S6 / I3) — the single source.
        points,
        pathD,
        movePoint,
        resetPath,
        copyablePath,
    };
}

export type MotionPathDemo = ReturnType<typeof useMotionPathDemo>;
