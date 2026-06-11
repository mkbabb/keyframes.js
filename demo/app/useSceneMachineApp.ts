// ─────────────────────────────────────────────────────────────────────────────
// THE SCENE-MACHINE ↔ APP-SHELL RECONCILE (H.W1 — extracted from App.vue).
//
// One cohesive concern: binding the active scene's ScenePlayback adapter to the
// machine, emitting the targets-attached SCENE_READY, and routing the bottom
// bar's play/pause + the dock's scene switch through the machine (the single
// authority). Lives beside App.vue (its only consumer) so the shell stays a thin
// template + a wiring list (proof:app-shell-thinness).
// ─────────────────────────────────────────────────────────────────────────────

import { markRaw, watch, type ComputedRef, type Ref, type ShallowRef } from "vue";
import { useDocumentVisibility } from "@vueuse/core";
import { AnimationGroup } from "@src/animation/group";
import type { ScenePlayback } from "@components/custom/animation-controls/stores";
import {
    getStoredAnimationGroupControlOptions,
    useSceneMachine,
    createGroupAdapter,
} from "@components/custom/animation-controls/stores";
import { sceneMap } from "./scenes";

export function useSceneMachineApp(opts: {
    sceneRef: ShallowRef<any>;
    currentSceneId: ComputedRef<string>;
    currentSuperKey: ComputedRef<string>;
    isHome: ComputedRef<boolean>;
    currentAnimationGroup: ShallowRef<AnimationGroup<any>>;
    autoPlayNext: Ref<boolean>;
    /** Lazily read the VT-wrapped scene switcher (defined after this composable
     *  in App's setup; read at event time, so the later binding resolves). */
    getRunSceneSwitch: () => (id: string) => void;
}) {
    const {
        sceneRef,
        currentSceneId,
        currentSuperKey,
        isHome,
        currentAnimationGroup,
        autoPlayNext,
        getRunSceneSwitch,
    } = opts;

    const machine = useSceneMachine();

    // ── The adapter registration (S2) ────────────────────────────────────────
    let releaseAdapter: (() => void) | null = null;

    /**
     * Bind the active scene's ScenePlayback adapter to the machine. Home
     * registers NONE (no group — the cube backdrop drives no playback). A scene
     * may expose its OWN adapter (the raw-rAF scenes — easing); otherwise the
     * group is wrapped (cube/amiga/square + the dummy-group scenes' bottom-bar
     * contract). Idempotent — tears the prior registration down first.
     */
    function bindSceneAdapter() {
        releaseAdapter?.();
        releaseAdapter = null;

        const group = sceneRef.value?.animationGroup;
        if (!group || isHome.value) {
            currentAnimationGroup.value = markRaw(new AnimationGroup());
            return;
        }

        currentAnimationGroup.value = markRaw(group);

        // Pick the first animation when none is selected yet (the controls panel
        // needs a selection to render anything).
        const controls = getStoredAnimationGroupControlOptions(currentSuperKey.value);
        if (!controls.selectedAnimation) {
            const names = Object.keys(group.animations);
            if (names.length > 0) controls.selectedAnimation = names[0]!;
        }
        // J.W7a S5 / XH-1 (D20) — the desktop force-open applies ONLY to scenes
        // whose DFA control-surface set is non-empty. An empty-DFA scene
        // (sequence/motion-path) has NOTHING to put in the rail; force-opening
        // it was the structural source of the hollow 400px ghost rail (the
        // [rail] track held open showing a vacant card, cross-hierarchy #1).
        if (window.innerWidth >= 1024 && machine.controlSurfaces.value.length > 0) {
            controls.isControlsPanelOpen = true;
        }

        const exposed = sceneRef.value?.scenePlayback as ScenePlayback | undefined;
        const adapter = exposed ?? createGroupAdapter(() => currentAnimationGroup.value);
        releaseAdapter = machine.register(currentSceneId.value, adapter);
    }

    // ── The SCENE_READY emit (S4 — once per entry, targets-attached) ──────────
    // `readyFor` is the scene-id the last SCENE_READY fired for; a new scene-id
    // (or a remount of the same id) re-arms it. NOT a nextTick count.
    let readyFor: string | null = null;

    /**
     * Mark the active scene ready: bind its adapter, emit SCENE_READY (the
     * restore), and apply the auto-play intent. Fires once the scene's
     * `defineExpose` surface is reachable through `sceneRef` (the genuine
     * targets-attached moment). Driven from BOTH the <Suspense> @resolve and the
     * group watcher — the once-per-entry guard makes the double-drive safe.
     */
    function markSceneReady() {
        if (readyFor === currentSceneId.value) return; // already fired this entry

        // The targets-attached precondition (S4 / WV-W1-MED-5): for a non-home
        // scene, `sceneRef` must be bound to THE CURRENT scene (its exposed
        // `superKey` matches) — NOT a stale/transient ref from the outgoing
        // scene's teardown. Without this gate the group watcher fires once with
        // `animationGroup === undefined` mid-swap and would prematurely consume
        // the once-per-entry guard before the real scene exposes `autoPlays`.
        // Home is the one scene that is "ready" with no group.
        const boundToCurrent =
            isHome.value ||
            sceneRef.value?.superKey === currentSuperKey.value;
        if (!boundToCurrent) return;

        // Bind the adapter now the scene is genuinely the current one.
        bindSceneAdapter();
        readyFor = currentSceneId.value;

        machine.dispatch({ type: "SCENE_READY" });

        // Auto-play: a raw-rAF preview scene that exposes `autoPlays: true`
        // (easing) plays on EVERY entry (the scenes remount on swap — the
        // historical `isPlaying = ref(true)` auto-started each mount); a group
        // scene plays only on an explicit gesture (`autoPlayNext`/the home Play).
        // Otherwise the restore honors the snapshot's `playing` (a paused cube
        // stays paused on return).
        const autoPlays = sceneRef.value?.autoPlays === true;
        if (!isHome.value && (autoPlays || autoPlayNext.value)) {
            machine.dispatch({ type: "PLAY" });
        }
        autoPlayNext.value = false;
    }

    // Re-bind + mark ready when the scene's exposed group becomes available (a
    // fresh scene mounts and `sceneRef` binds — the sceneRef-bound path).
    watch(() => sceneRef.value?.animationGroup, markSceneReady);

    // Re-arm the guard on every machine scene change; drive readiness DIRECTLY
    // for the home ↔ cube no-remount transition (shared Suspense key 'cube' → no
    // @resolve / no group-watch change). A genuine remount is driven by the
    // group watcher / @resolve when the new scene's surface binds (NOT here —
    // sceneRef is still the old one).
    watch(currentSceneId, (id, prev) => {
        readyFor = null;
        const shared = (s: string) => s === "home" || s === "cube";
        if (shared(id) && shared(prev)) markSceneReady();
    });

    /** The <Suspense> @resolve — belt-and-braces drive for the remount path. */
    function onSceneResolved() {
        markSceneReady();
    }

    // ── Playback events from the bottom bar → the machine (S2) ────────────────
    function onPlayStateChange(playing: boolean) {
        // Home "play" is a user gesture — it navigates to cube and auto-plays.
        // Gate on the empty home group so re-activating a cached scene whose
        // group was already started can't spuriously warp us away.
        const group = currentAnimationGroup.value;
        const isHomeEmptyGroup = Object.keys(group.animations).length === 0;
        if (isHome.value && playing && isHomeEmptyGroup) {
            autoPlayNext.value = true;
            getRunSceneSwitch()("cube");
            return;
        }
        machine.dispatch({ type: playing ? "PLAY" : "PAUSE" });

        // Push the play state onto scenes that hold a WRITABLE `isPlaying` ref
        // (cube/amiga — CubeTarget reads it as a prop). A scene that exposes its
        // own `scenePlayback` adapter (easing) owns playback via the machine; its
        // `isPlaying` is a READONLY machine-derived computed, so the App must NOT
        // write it (that throws "computed value is readonly").
        const ownsPlayback = !!sceneRef.value?.scenePlayback;
        if (!ownsPlayback && sceneRef.value && "isPlaying" in sceneRef.value) {
            sceneRef.value.isPlaying = playing;
        }
    }

    function onStartStateChange(started: boolean) {
        // Write via handler (not inline template) so the assignment is scheduled
        // against `sceneRef.value` at call time, not a stale template closure.
        if (sceneRef.value && "isStarted" in sceneRef.value) {
            sceneRef.value.isStarted = started;
        }
    }

    // ── The scene switch — a single NAVIGATE dispatch (S5/S7) ─────────────────
    // The machine's captureActive() snapshots + SUSPENDs the leaving scene's
    // loop BEFORE the new one starts (genuine suspend, no orphan rAF); the writer
    // projects the new active scene onto the URL. No hand-poked codec.
    function switchScene(id: string) {
        if (!sceneMap.has(id)) return;
        machine.dispatch({ type: "NAVIGATE", to: id });
    }

    // ── Tab-visibility fold (S5/S9.d) — TAB_HIDDEN/TAB_SHOWN ──────────────────
    // The machine's `status` axis tracks tab visibility; the preserved per-scene
    // `useSceneVisibilityPause` (autoPaused) owns the loop pause/resume, so the
    // machine drives NO adapter here (it would double-act).
    const visibility = useDocumentVisibility();
    watch(visibility, (state) => {
        machine.dispatch({ type: state === "hidden" ? "TAB_HIDDEN" : "TAB_SHOWN" });
    });

    return {
        onSceneResolved,
        onPlayStateChange,
        onStartStateChange,
        switchScene,
    };
}
