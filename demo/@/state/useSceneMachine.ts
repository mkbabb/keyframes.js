// ─────────────────────────────────────────────────────────────────────────────
// THE SCENE-MACHINE STORE (H.W1 keystone — the effect layer).
//
// The reactive `createGlobalState` shell around the PURE reducer (`transition`,
// in sceneMachine.ts). Co-located with the pure core it drives: the core is
// unit-testable in isolation; THIS file wires it to Vue reactivity + persistence
// + the adapter registry + the effects the reducer's purity forbids.
//
// MUTATION BOUNDARY (MED-4): createGlobalState gives NO mutation boundary by
// itself, so this exports ONLY `dispatch()` + READONLY refs (status, activeScene,
// perScene) + the `register()` adapter registry. There is NO writable
// activeScene/.status surface — proof:single-writer greps that no file outside
// this one assigns them.
// ─────────────────────────────────────────────────────────────────────────────

import { createGlobalState, useStorage } from "@vueuse/core";
import {
    computed,
    readonly,
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
    controlSurfacesFor,
    extraControlTabsFor,
    selectedControlSurfaceFor,
    type ControlSurface,
    type ControlSurfaceTab,
} from "./controlSurfaceDFA";

/** The localStorage key the machine context persists under (ST-6). Exported so
 *  `resetAllStores()` (storeUtils STORE_KEYS) wipes it in the same motion — the
 *  active-scene fact lives HERE now, not the deleted raw `keyframes-js-active-
 *  scene` key. Single-sourced so the key is never duplicated as a string. */
export const SCENE_MACHINE_PERSIST_KEY = "keyframes-js-scene-machine";

/** What persists across reloads — the active scene + the keyed snapshot map
 *  (ST-6). Plain JSON; the markRaw groups are NEVER persisted (MED-6). */
interface PersistedContext {
    activeScene: SceneId;
    perScene: Record<SceneId, PlaybackSnapshot>;
}

/**
 * K.W0 S4-C — coerce a hydrated per-scene snapshot map to COLD-BOOT-PAUSED. Each
 * entry keeps its `started` flag + scrub state (`animations`/`progress`) so the
 * SCENE_READY restore re-seats the position faithfully, but `playing` is forced
 * false so NO scene auto-resumes its loop on a gestureless cold boot (K4-C). Pure
 * — returns a fresh map; the persisted store on disk is untouched (the next
 * single-writer dispatch re-persists from the live, session-true context).
 */
function coerceColdBootPaused(
    perScene: Record<SceneId, PlaybackSnapshot>,
): Record<SceneId, PlaybackSnapshot> {
    const out: Record<SceneId, PlaybackSnapshot> = {};
    for (const [id, snap] of Object.entries(perScene)) {
        out[id] = { ...snap, playing: false };
    }
    return out;
}

export const useSceneMachine = createGlobalState(() => {
    // The persisted half of the context. @vueuse/useStorage = persistence
    // (ST-6) — NOT the mutation discipline (MED-4); the discipline is the
    // exported surface below.
    const persisted = useStorage<PersistedContext>(SCENE_MACHINE_PERSIST_KEY, {
        activeScene: HOME_SCENE_ID,
        perScene: {},
    });

    // The live machine value. `status` is ephemeral (never persisted — a reload
    // re-derives it from the snapshot on SCENE_READY). `context` mirrors the
    // persisted store so a single writer keeps them in lockstep.
    //
    // K.W0 S4-C — THE COLD-BOOT-STARTS-PAUSED policy (the gesture-gated-playback
    // policy, restore face). A COLD APP BOOT (the context hydrated from
    // localStorage at startup, NO user gesture yet this session) must restore the
    // scrub POSITION faithfully but start PAUSED — no scene auto-resumes its
    // animation without a user gesture (K4-C: the amiga bounce auto-resumed on a
    // gestureless cold reload because the hydrated `playing:true` flowed through
    // the SCENE_READY restore → restoreGroupPlaybackState → group.resume()). We
    // coerce the hydrated per-scene snapshot's `playing → false` ONCE here, at the
    // hydration seam, keeping `started` + the `animations`/`progress` scrub state
    // so the restore still re-seats the position (paused). A subsequent IN-SESSION
    // scene switch is faithful (the live `captureActive` snapshot carries the
    // session's true `playing`, not this hydrated value). This is the same
    // gesture-gated-playback policy as S1: S1 makes a USER GESTURE start the
    // engine; S4-C makes a GESTURELESS cold boot NOT auto-resume.
    const machine = shallowRef<MachineState>({
        status: "idle",
        context: {
            activeScene: persisted.value.activeScene,
            perScene: coerceColdBootPaused(persisted.value.perScene ?? {}),
        },
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

    // ── THE SINGLE WRITER ────────────────────────────────────────────────────
    // The ONLY surface that mutates `machine`. The pure reducer cannot read the
    // live adapter (it is side-effect-free), so the writer does the impure work:
    // it CAPTURES the leaving scene's live state into the context BEFORE running
    // the reducer (so the captured snapshot flows INTO the transition, not lost
    // beside it), runs `transition`, persists, then drives the adapters AFTER.
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
            prev = captureActive(prev);
        }

        // ── the pure reducer ──
        const next = transition(prev, event);

        // ── short-circuit: a genuine no-op writes nothing (echo-guard twin) ──
        if (next === prev && next === machine.value) return;

        machine.value = next;

        // ── persist the context half (status is ephemeral) ──
        persisted.value = {
            activeScene: next.context.activeScene,
            perScene: next.context.perScene,
        };

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
    function captureActive(state: MachineState): MachineState {
        const adapter = adapters.get(state.context.activeScene);
        if (!adapter) return state;
        const snap = adapter.snapshot();
        // Stop the loop NOW (before any new scene starts).
        adapter.suspend();
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
                // interpFrames can resolve computed units. Restore from the
                // persisted snapshot through the CONTRACT.
                if (!adapter) return;
                const snap = state.context.perScene[state.context.activeScene];
                if (snap && (snap.started || snap.playing)) {
                    adapter.restore(snap);
                }
                break;
            }
            case "PLAY":
                if (changed) adapter?.resume();
                break;
            case "PAUSE":
                if (changed) adapter?.suspend();
                break;
            case "RESUME":
                if (changed && state.status === "playing") adapter?.resume();
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

    // ── boot migration: a stored dead-route activeScene lands on home (T.E1/T.E3)
    // ─────────────────────────────────────────────────────────────────────────
    // A returning user whose persisted `activeScene` names a scene that no longer
    // exists in the registry (a PRUNED scene — compose/morph/motion-path per OD-1)
    // must NOT boot onto a dead route: the router writer would `router.push` a
    // name with no route and the machine would rest on a phantom scene. Coerce the
    // hydrated activeScene to HOME_SCENE_ID when it is not a live registry id
    // BEFORE the first-load seed dispatches it. Called at boot from the router
    // binding (which owns the valid-id set via `allScenes`), beside `gcOrphans`.
    function migrateActiveScene(validSceneIds: Iterable<SceneId>): void {
        const valid = new Set(validSceneIds);
        const active = machine.value.context.activeScene;
        if (valid.has(active)) return;
        const context = { ...machine.value.context, activeScene: HOME_SCENE_ID };
        machine.value = { status: machine.value.status, context };
        persisted.value = {
            activeScene: HOME_SCENE_ID,
            perScene: context.perScene,
        };
    }

    // ── boot GC: drop orphan superKeys (ST-7) ────────────────────────────────
    // Prunes snapshot entries for scenes that no longer exist in the registry.
    function gcOrphans(validSceneIds: Iterable<SceneId>): void {
        const valid = new Set(validSceneIds);
        const perScene: Record<SceneId, PlaybackSnapshot> = {};
        let pruned = false;
        for (const [id, snap] of Object.entries(machine.value.context.perScene)) {
            if (valid.has(id)) perScene[id] = snap;
            else pruned = true;
        }
        if (!pruned) return;
        const context = { ...machine.value.context, perScene };
        machine.value = { status: machine.value.status, context };
        persisted.value = { activeScene: context.activeScene, perScene };
    }

    return {
        // READONLY refs — the only read surface (MED-4 mutation boundary).
        // Derived from the single `machine` ref so a consumer can never write
        // status/activeScene back; the lone writer is dispatch().
        status: readonly(computed(() => machine.value.status)),
        activeScene: readonly(computed(() => machine.value.context.activeScene)),
        perScene: readonly(computed(() => machine.value.context.perScene)),
        machine: readonly(machine) as DeepReadonly<Ref<MachineState>>,

        // ── THE CONTROL-SURFACE PROJECTION (H.W11.S4 / I2 — the third axis) ───
        // A PURE, reactive projection of the active scene onto its valid
        // control-surface set (the DFA table in controlSurfaceDFA.ts). NOT a
        // reducer mutation — it derives from `activeScene` ONLY, so the W1
        // machine's identity is untouched (proof:scene-machine-irrefragable
        // stays green). The tab hosts read `controlSurfaces` to gate what
        // renders per scene (the easing scene → ['easing'], so NO keyframes/
        // timeline tab node exists for it).
        controlSurfaces: readonly(
            computed<ControlSurface[]>(() =>
                controlSurfacesFor(machine.value.context.activeScene),
            ),
        ),
        /** The DFA selector for an ARBITRARY scene (the navigation-matrix
         *  totality the gate asserts: every scene resolves a DEFINED set). */
        controlSurfacesFor,

        // ── THE EXTRA-TAB PROJECTION (J.W0.S3 — the dock trigger born-correct) ─
        // The scene-specific surfaces' TAB METADATA (easing→Easing,
        // spring→Spring) as a projection of `activeScene` through the DFA's
        // metadata table — NOT a value that arrives a tick LATE through the
        // scene component's `extraControlTabs` re-bind on <Suspense> mount. The
        // dock binds THIS, so the trigger label is correct on the very tick
        // `activeScene` rests on the destination (the I.W2 single-authority
        // extended from the SELECTED surface to the tab PROJECTION).
        // `activeConditionals` carries the caller-supplied conditional surfaces
        // (cube's matrix-controls while the Matrix animation is selected).
        extraControlTabsFor,
        /** The active scene's scene-specific control tabs — reactive on
         *  `activeScene`, synchronously correct per tick. */
        extraControlTabs: (
            activeConditionals?: readonly ControlSurface[],
        ): ControlSurfaceTab[] =>
            extraControlTabsFor(
                machine.value.context.activeScene,
                activeConditionals,
            ),

        // ── THE SELECTED-SURFACE SINGLE AUTHORITY (I.W2.S1) ───────────────────
        // The order-independent control-panel mount projection I.W1's S3
        // consumes: the SELECTED control surface for the active scene, resolved
        // as a PURE FUNCTION of (the DFA-valid set × a preferred pick). The tab
        // host binds `<Tabs> :model-value` to THIS (not a free
        // `storedControls.selectedControl`), so on a switch the model-value is
        // born correct on the mounting tick — the reka `passive`-latch is taken
        // `"easing"`, not `undefined`/stale (the B4 desync cure). The pure
        // selector is exposed for a host that carries its OWN preference ref.
        selectedControlSurfaceFor,
        /** The active scene's selected surface, given a preferred pick (+ the
         *  caller-supplied ACTIVE conditional surfaces, J.W2 S2 — cube's
         *  `matrix-controls` while the Matrix animation is selected). A reactive
         *  PROJECTION of `activeScene` × the caller's preference — the value
         *  `<Tabs> :model-value` reads, synchronously correct per tick. */
        selectedControlSurface: (
            preferred?: string,
            activeConditionals?: readonly ControlSurface[],
        ): ControlSurface | undefined =>
            selectedControlSurfaceFor(
                machine.value.context.activeScene,
                preferred,
                activeConditionals,
            ),

        // The single WRITE surface.
        dispatch,

        // The adapter registry.
        register,
        adapterFor,
        gcOrphans,
        migrateActiveScene,
    };
});
