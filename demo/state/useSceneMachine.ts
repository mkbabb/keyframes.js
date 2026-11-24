// ─────────────────────────────────────────────────────────────────────────────
// THE SCENE-MACHINE STORE (H.W1 keystone — the effect layer).
//
// The reactive `createGlobalState` shell around the PURE reducer (`transition`,
// in sceneMachine.ts). Co-located with the pure core it drives: the core is
// unit-testable in isolation; THIS file wires it to Vue reactivity + the
// adapter registry + the effects the reducer's purity forbids.
//
// THE ADDRESS IS THE PAGE (owner, FORTY-SIXTH E). The context lives in memory
// for this page's life only: a return to a scene within the page resumes it as
// it was left (item 7), and a reload or a new tab starts from the URL. Nothing
// of it is written to or read from browser storage.
//
// MUTATION BOUNDARY (MED-4): createGlobalState gives NO mutation boundary by
// itself, so this exports ONLY `dispatch()` + READONLY refs (status, activeScene,
// perScene) + the `register()` adapter registry. There is NO writable
// activeScene/.status surface — proof:single-writer greps that no file outside
// this one assigns them.
// ─────────────────────────────────────────────────────────────────────────────

import { createGlobalState } from "@vueuse/core";
import {
    computed,
    readonly,
    ref,
    shallowRef,
    type DeepReadonly,
    type Ref,
} from "vue";
import {
    transition,
    HOME_SCENE_ID,
    type MachineState,
    type PlaybackSnapshot,
    type SceneEvent,
    type SceneId,
    type ScenePlayback,
} from "./sceneMachine";
import {
    extraTabsFrom,
    selectedSurfaceFrom,
    type ControlSurface,
    type ControlSurfaceTab,
} from "./controlSurfaces";

export const useSceneMachine = createGlobalState(() => {
    // The live machine value: Home, with no scene entered yet. `status` is
    // derived per entry (SCENE_READY); `perScene` holds the snapshots of the
    // scenes left in this page.
    const machine = shallowRef<MachineState>({
        status: "idle",
        context: { activeScene: HOME_SCENE_ID, perScene: {} },
    });

    // The adapter registry — scenes register their ScenePlayback on mount,
    // unregister on unmount. The machine's effect layer calls the CONTRACT.
    const adapters = new Map<SceneId, ScenePlayback>();

    function register(sceneId: SceneId, adapter: ScenePlayback): () => void {
        adapters.set(sceneId, adapter);
        return () => {
            if (adapters.get(sceneId) === adapter) adapters.delete(sceneId);
        };
    }

    /** Get the adapter for a scene (effect layer only). */
    function adapterFor(sceneId: SceneId): ScenePlayback | undefined {
        return adapters.get(sceneId);
    }

    // ── THE ACTIVE CONTROL-SURFACE SET (T.B2 — the derivation seam) ───────────
    // The control-surface axis INVERTED (T.B2): the valid set is no longer a
    // table row keyed by `activeScene` — it is DERIVED by the App from the live
    // scene facility × the selected channel (`surfacesFor(facility, selected)`),
    // which only the App can see (the facility lives on the mounted scene's
    // exposed surface, not in the machine). The App feeds the derived set here via
    // `setActiveSurfaces`; the projections below (`controlSurfaces`,
    // `extraControlTabs`, `selectedControlSurface`) read it. Empty for home /
    // a panel-less scene (sequence) → no control affordance renders.
    const activeSurfaces = ref<ControlSurface[]>([]);

    /** The App's single write of the derived surface set (T.B2). Idempotent —
     *  a re-derivation to the same set is a no-op (ref equality on the array). */
    function setActiveSurfaces(surfaces: ControlSurface[]): void {
        activeSurfaces.value = surfaces;
    }

    // ── THE SINGLE WRITER ────────────────────────────────────────────────────
    // The ONLY surface that mutates `machine`. The pure reducer cannot read the
    // live adapter (it is side-effect-free), so the writer does the impure work:
    // it CAPTURES the leaving scene's live state into the context BEFORE running
    // the reducer (so the captured snapshot flows INTO the transition, not lost
    // beside it), runs `transition`, then drives the adapters AFTER.
    function dispatch(event: SceneEvent): void {
        let prev = machine.value;

        // ── pre-transition capture (the live → snapshot read + genuine SUSPEND) ──
        // On a scene LEAVE (NAVIGATE-away, explicit SUSPEND) snapshot + STOP the
        // current scene's loop BEFORE the new one starts (S5 — ONE suspend path,
        // no orphan rAF). The capture is folded into `prev` so the reducer's
        // perScene carries it.
        //
        // TAB_HIDDEN/TAB_SHOWN are deliberately NOT a leave: the preserved
        // per-scene `useSceneVisibilityPause` (autoPaused — "only resume what IT
        // paused") owns the loop pause/resume on tab-visibility, so the machine
        // must NOT also stop/restart the loop (it would double-act and could
        // resume a scene the user had paused). For those events the machine only
        // parks the `status` axis so it stays consistent (the fold per S9.d).
        const leaving =
            (event.type === "NAVIGATE" &&
                event.to !== prev.context.activeScene) ||
            event.type === "SUSPEND";
        if (leaving) {
            prev = captureActive(prev, event.type === "NAVIGATE" && event.stays === true);
        }

        // ── KFA-69: a scrub records the scene's live clocks ──
        // The pure reducer cannot read the group; the writer reads the per-child
        // clocks the scrub's seek just seated (each child at its own phase of
        // one master time) through the contract, and the event carries them.
        if (event.type === "SCRUB" && !event.animations) {
            const live = adapters.get(prev.context.activeScene)?.snapshot().animations;
            if (live && Object.keys(live).length > 0) event = { ...event, animations: live };
        }

        // ── the pure reducer ──
        const next = transition(prev, event);

        // ── short-circuit: a genuine no-op writes nothing (echo-guard twin) ──
        if (next === prev && next === machine.value) return;

        machine.value = next;

        // ── post-transition effects (drive the adapters into the new state) ──
        applyEffects(next, event, next !== prev);
    }

    /**
     * Capture the active scene's live state into its snapshot and STOP its loop
     * (the genuine pre-leave suspend). Returns a NEW state with the captured
     * snapshot folded into `perScene` so the reducer transitions off the
     * captured truth (not the stale pre-capture context). Pure w.r.t. the store
     * — it does NOT write `machine`; the writer does.
     */
    function captureActive(state: MachineState, stays = false): MachineState {
        const adapter = adapters.get(state.context.activeScene);
        if (!adapter) return state;
        // Stop the loop NOW (before any new scene starts). A scene that stays
        // in view (the cube under Home) comes to rest by the eased stop
        // (FORTY-SIXTH E1: Pause's 150 ms ramp, never in one frame); one that
        // unmounts is stopped at once (the swap shows its last frame).
        let snap: PlaybackSnapshot;
        if (stays && adapter.leave) snap = adapter.leave();
        else {
            snap = adapter.snapshot();
            adapter.suspend();
        }
        return {
            status: state.status,
            context: {
                activeScene: state.context.activeScene,
                perScene: {
                    ...state.context.perScene,
                    [state.context.activeScene]: snap,
                },
            },
        };
    }

    /** Run the adapter-side effects a transition implies. */
    function applyEffects(
        state: MachineState,
        event: SceneEvent,
        changed: boolean,
    ): void {
        const adapter = adapters.get(state.context.activeScene);

        switch (event.type) {
            case "SCENE_READY": {
                // The ONE explicit restore point (S4) — targets are attached, so
                // interpFrames can resolve computed units. Restore the snapshot
                // this page captured when it left the scene, through the CONTRACT.
                if (!adapter) return;
                const snap = state.context.perScene[state.context.activeScene];
                if (snap && (snap.started || snap.playing)) {
                    adapter.restore(snap);
                }
                break;
            }
            case "PLAY":
                // KFA-226 — a PLAY during a scrub records the intent; the
                // scrub's release (SCRUB_END) is what re-arms the loop.
                // FORTY-SIXTH E1 — and a start gathers its speed: the loop's
                // clock is walked up to speed while the scene still means to
                // play (a Pause meanwhile ends the walk where it stands).
                if (changed && !state.scrubbing) {
                    const scene = state.context.activeScene;
                    if (adapter?.easeIn) {
                        adapter.easeIn(
                            () =>
                                machine.value.status === "playing" &&
                                !machine.value.scrubbing &&
                                machine.value.context.activeScene === scene,
                        );
                    } else adapter?.resume();
                }
                break;
            case "PAUSE":
                // FORTY-SIXTH E1 — a stop is eased too: the loop comes to rest
                // over a short ramp instead of freezing in one frame.
                if (changed) {
                    if (adapter?.easeOut) adapter.easeOut();
                    else adapter?.suspend();
                }
                break;
            case "RESUME":
                if (changed && state.status === "playing" && !state.scrubbing) {
                    adapter?.resume();
                }
                break;
            case "SCRUB_START":
                // KFA-226 — the scrub HOLDS the loop (the drag owns the clock);
                // the play intent stays as it was.
                if (changed && state.status === "playing") adapter?.suspend();
                break;
            case "SCRUB_END":
                // The release resumes from the released position iff the
                // intent standing NOW is to play.
                if (changed && state.status === "playing") adapter?.resume();
                break;
            case "RESET":
                // KFA-39 — the effect arm RESET lacked: rewind the scene to its
                // born state through the contract (the reducer has already
                // rested the snapshot paused at progress 0).
                adapter?.reset?.();
                break;
            // TAB_HIDDEN / TAB_SHOWN are status-only: the preserved per-scene
            // `useSceneVisibilityPause` (autoPaused) owns the loop on tab
            // visibility, so the machine drives NO adapter here.
            // NAVIGATE / SUSPEND handled their leaving-scene effect in
            // captureActive (pre-transition); the incoming scene's effect fires
            // on its SCENE_READY.
            default:
                break;
        }
    }

    return {
        // READONLY refs — the only read surface (MED-4 mutation boundary).
        // Derived from the single `machine` ref so a consumer can never write
        // status/activeScene back; the lone writer is dispatch().
        status: readonly(computed(() => machine.value.status)),
        activeScene: readonly(computed(() => machine.value.context.activeScene)),
        perScene: readonly(computed(() => machine.value.context.perScene)),
        machine: readonly(machine) as DeepReadonly<Ref<MachineState>>,

        // ── THE CONTROL-SURFACE PROJECTION (T.B2 — the derived axis) ──────────
        // A reactive READ of the App-fed derived surface set (`setActiveSurfaces`
        // ← `surfacesFor(facility, selected)`). NOT a reducer mutation and NOT a
        // table row — the machine's W1 identity is untouched
        // (proof:scene-machine-irrefragable stays green). The tab hosts read
        // `controlSurfaces` to gate what renders (a light-only scene like
        // sequence derives [], so NO control node exists for it).
        controlSurfaces: readonly(computed<ControlSurface[]>(() => activeSurfaces.value)),
        /** The App's single write of the derived surface set (T.B2). */
        setActiveSurfaces,

        // ── THE EXTRA-TAB PROJECTION (J.W0.S3 — the dock trigger born-correct) ─
        // The scene-specific facet surfaces' TAB METADATA (easing→Easing,
        // spring→Spring, cube→Matrix Controls) as a projection of the DERIVED
        // set through the ONE `SURFACE_META` registry — settling synchronously
        // with the App's `setActiveSurfaces`, never a tick-late scene re-bind.
        extraControlTabs: (): ControlSurfaceTab[] =>
            extraTabsFrom(activeSurfaces.value),

        // ── THE SELECTED-SURFACE SINGLE AUTHORITY (I.W2.S1) ───────────────────
        // The SELECTED control surface, resolved as a PURE FUNCTION of (the
        // DERIVED set × a preferred pick). The tab host binds `<Tabs>
        // :model-value` to THIS (not a free `storedControls.selectedControl`),
        // so on a switch the value is born correct on the mounting tick — the
        // reka `passive`-latch is taken with the valid surface, not undefined/
        // stale (the B4 desync cure). A stale/cross-scene pick falls back to the
        // set's first surface AT the authority.
        selectedControlSurface: (
            preferred?: string,
        ): ControlSurface | undefined =>
            selectedSurfaceFrom(activeSurfaces.value, preferred),

        // The single WRITE surface.
        dispatch,

        // The adapter registry.
        register,
        adapterFor,
    };
});
