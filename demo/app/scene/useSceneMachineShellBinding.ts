// ─────────────────────────────────────────────────────────────────────────────
// THE SCENE-MACHINE ↔ APP-SHELL RECONCILE (H.W1 — extracted from App.vue).
//
// One cohesive concern: binding the active scene's ScenePlayback adapter to the
// machine, emitting the targets-attached SCENE_READY, and routing the bottom
// bar's play/pause + the dock's scene switch through the machine (the single
// authority). Lives in the app/scene/ concern sub-zone (S.D1) so the shell stays
// a thin template + a wiring list (proof:app-is-shell).
// ─────────────────────────────────────────────────────────────────────────────

import { markRaw, watch, type ComputedRef, type Ref, type ShallowRef } from "vue";
import { useDocumentVisibility } from "@vueuse/core";
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";
import type { ScenePlayback } from "@state";
import {
    getStoredAnimationGroupControlOptions,
    surfacesFor,
    useSceneMachine,
    createGroupAdapter,
} from "@state";
import { sceneMap } from "./scenes";
import type { SceneExposedApi } from "./sceneExposedApi";

export function useSceneMachineShellBinding(opts: {
    sceneRef: ShallowRef<SceneExposedApi | null>;
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
     * registers NONE (no group — the cube backdrop drives no playback). Every
     * non-home scene exposes a `SceneFacility` (T.B1-β) whose `playback` is the
     * registered adapter; the group-wrap path survives only as the fallback for
     * a facility-less host. Idempotent — tears the prior registration down first.
     */
    function bindSceneAdapter() {
        releaseAdapter?.();
        releaseAdapter = null;

        // T.B1 STAGE 1 — PREFER the SceneFacility when the scene exposes it. A
        // facility carries its OWN `playback` adapter (built from the channels),
        // so the shell registers that instead of wrapping the group. A migrated
        // group scene (cube/amiga/square) still exposes `animationGroup` (the
        // panel group); a facility-only scene (sequence) has none — its
        // `currentAnimationGroup` is an empty placeholder (DFA [] → no panel).
        const facility = sceneRef.value?.facility;
        const group = facility?.group ?? sceneRef.value?.animationGroup;
        if (isHome.value || (!group && !facility)) {
            currentAnimationGroup.value = markRaw(
                new (kfEngine().AnimationGroup)(),
            );
            return;
        }

        currentAnimationGroup.value = markRaw(
            group ?? new (kfEngine().AnimationGroup)(),
        );

        // The selection default + desktop force-open apply when there is a real
        // selection AXIS: the facility's channels (T.B1-β — the honest set) or a
        // real group with members. A facility-only scene with an empty DFA
        // (sequence) still defaults its channel selection (the transport label)
        // but its rail never force-opens (controlSurfaces is empty — the hollow
        // 400px ghost rail, J.W7a S5 / XH-1, stays impossible).
        const axisNames =
            facility?.channels.map((c) => c.name) ??
            (group ? Object.keys(group.animations) : []);
        if (axisNames.length > 0) {
            // Pick the first axis member when none is selected yet (the controls
            // panel needs a selection to render anything).
            const controls = getStoredAnimationGroupControlOptions(
                currentSuperKey.value,
            );
            if (
                !controls.selectedAnimation ||
                !axisNames.includes(controls.selectedAnimation)
            ) {
                controls.selectedAnimation = axisNames[0]!;
            }
            // T.B2 — the desktop force-open reads the DERIVED surface set for the
            // live facility × the selected channel (no longer the table-keyed
            // `machine.controlSurfaces`, which the App feeds reactively and may
            // lag this synchronous bind). A panel-less scene (sequence → []) never
            // force-opens — the hollow ghost rail (XH-1) stays impossible.
            if (
                window.innerWidth >= 1024 &&
                surfacesFor(facility, controls.selectedAnimation ?? undefined)
                    .length > 0
            ) {
                controls.isControlsPanelOpen = true;
            }
        }

        // The playback authority: the facility's adapter first (every migrated
        // scene — the same object the scene's own `scenePlayback` expose carries),
        // then a scene's own raw-rAF adapter, then wrap the group (the
        // facility-less fallback).
        const exposed = sceneRef.value?.scenePlayback as ScenePlayback | undefined;
        const adapter =
            facility?.playback ??
            exposed ??
            createGroupAdapter(() => currentAnimationGroup.value);
        releaseAdapter = machine.register(currentSceneId.value, adapter);
    }

    // ── The SCENE_READY emit (S4 — once per entry, targets-attached) ──────────
    // The once-per-entry guard keys on the (scene-id × BOUND-GROUP-IDENTITY)
    // pair, not the scene-id alone (K.W0). A new scene-id re-arms it; so does a
    // *fresh group object* for the same scene-id — the home→cube hero handoff
    // crosses the `AnimationControlsGroup :key="superKey"` boundary
    // (`__home__`→`Cube`, EditorShell.vue), so CubeScene REMOUNTS and exposes a
    // BRAND-NEW group. Keying on scene-id alone, the synchronous pre-remount
    // drive consumed the guard against the OLD (doomed) group — which the
    // outgoing CubeScene's `onBeforeUnmount` then `stop()`ed — and the genuinely-
    // live post-remount group was blocked from ever re-driving SCENE_READY/PLAY
    // (the cold hero P0: the FSM read playing/started while the live engine was
    // dead). Keying on the group identity, the post-remount group RE-drives.
    let readyFor: string | null = null;
    let readyGroup: object | null = null;

    /**
     * Mark the active scene ready: bind its adapter, emit SCENE_READY (the
     * restore), and apply the auto-play intent. Fires once the scene's
     * `defineExpose` surface is reachable through `sceneRef` (the genuine
     * targets-attached moment). Driven from BOTH the <Suspense> @resolve and the
     * group watcher — the once-per-(entry × group) guard makes the double-drive
     * safe AND re-drives against a fresh group when the scene remounts.
     */
    function markSceneReady() {
        // The live bind-target identity the scene currently exposes. A group
        // scene exposes `animationGroup` (stable); a facility-only scene
        // (sequence) exposes a stable `scenePlayback` adapter instead — either is
        // a stable per-entry identity for the once-per-(entry × target) guard.
        // `null` for home (no target) and transiently mid-remount.
        const liveGroup = (sceneRef.value?.animationGroup ??
            sceneRef.value?.scenePlayback ??
            null) as object | null;

        // Already driven THIS entry against THIS exact group? No-op. A fresh
        // group object for the same scene-id (a remount across the superKey-keyed
        // AnimationControlsGroup boundary) does NOT match `readyGroup`, so it
        // falls through and re-drives the restore/auto-play against the live one.
        if (readyFor === currentSceneId.value && readyGroup === liveGroup) return;

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

        // A non-home scene is genuinely ready ONLY once it exposes its live
        // group (the targets-attached moment). The synchronous pre-remount drive
        // for the home→cube handoff reaches here while `sceneRef` is still the
        // OUTGOING (home-keyed) CubeScene that is about to unmount; binding +
        // PLAYing THAT group is the P0 (its `onBeforeUnmount` `stop()`s it the
        // same tick). Defer to the group-watcher's re-drive once the incoming
        // scene's fresh group binds — `autoPlayNext` is preserved across the
        // deferral, so the live group inherits the gesture's auto-play intent.
        if (!isHome.value && !liveGroup) return;

        // Bind the adapter now the scene is genuinely the current one.
        bindSceneAdapter();
        readyFor = currentSceneId.value;
        readyGroup = liveGroup;

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

    // Re-bind + mark ready when the scene's exposed bind-target becomes available
    // (a fresh scene mounts and `sceneRef` binds — the sceneRef-bound path). A
    // facility-only scene (sequence) has no `animationGroup`, so watch its stable
    // `scenePlayback` too or its readiness would never re-drive.
    watch(
        () => sceneRef.value?.animationGroup ?? sceneRef.value?.scenePlayback,
        markSceneReady,
    );

    // Re-arm the guard on every machine scene change; drive readiness DIRECTLY
    // for the home ↔ cube transition (shared Suspense key 'cube' → no @resolve).
    // home and cube share the CubeScene component but NOT the `superKey`
    // (`__home__` vs `Cube`), so crossing home→cube REMOUNTS the scene across the
    // `AnimationControlsGroup :key="superKey"` boundary — the synchronous drive
    // here lands on the OUTGOING group (no liveGroup yet for the incoming one),
    // so markSceneReady binds nothing playable and DEFERS; the group-watcher's
    // re-drive (the new group's bind) carries the SCENE_READY/PLAY. We still
    // call it here to advance the restore for the home→home / cube→cube echo and
    // to re-arm the guard. A genuine remount of another scene is driven by the
    // group watcher / @resolve when the new scene's surface binds.
    watch(currentSceneId, (id, prev) => {
        readyFor = null;
        readyGroup = null;
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
