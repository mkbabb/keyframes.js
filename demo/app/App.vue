<template>
    <ChromeDock
        :current-scene-id="currentSceneId"
        :scenes="scenes"
        :home-scene-id="HOME_SCENE_ID"
        :current-label="currentLabel"
        :is-controls-panel-open="storedControls.isControlsPanelOpen"
        :selected-control="dockSelectedControl"
        :control-surfaces="controlSurfaces"
        :extra-control-tabs="extraControlTabs"
        :items-popup-open="mbabbPopupOpen"
        @switch-scene="runSceneSwitch"
        @warm-scene="warmScene"
        @toggle-controls-panel="storedControls.isControlsPanelOpen = !storedControls.isControlsPanelOpen"
        @update-selected-control="onDockSelectControl"
    >
        <template #items>
            <MbabbMenu
                v-model:open="mbabbPopupOpen"
                :super-key="currentSuperKey"
                :on-scene-restore="runSceneSwitch"
            />
        </template>
    </ChromeDock>

    <EditorShell
        :animation-group="currentAnimationGroup"
        :super-key="currentSuperKey"
        :show-start-screen="isHome"
        :auto-play="autoPlayNext"
        :machine-playing="machinePlaying"
        :stage-mode="stageMode"
        :has-control-surfaces="controlSurfaces.length > 0"
        @play-state-change="onPlayStateChange"
        @start-state-change="onStartStateChange"
    >
        <template #start-screen>
            <EditorStartScreen hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;" />
        </template>

        <template #tabs-trigger="slotProps">
            <component
                :is="sceneRef?.tabsTrigger"
                v-bind="slotProps"
                v-if="sceneRef?.tabsTrigger"
            />
        </template>

        <template #tabs-content>
            <component :is="sceneRef?.tabsContent" v-if="sceneRef?.tabsContent" />
        </template>

        <template #ribbon-content="slotProps">
            <component
                :is="sceneRef?.ribbonContent"
                v-bind="slotProps"
                v-if="sceneRef?.ribbonContent"
            />
        </template>

        <template #target>
            <!-- Scene host. A keyed <Suspense> resolves the active scene's
                 async chunk and shows #fallback while it loads. NO <KeepAlive>,
                 NO wrapping <Transition>: both broke the async loader outright
                 (wrapping a keyed <Suspense> over a `defineAsyncComponent`
                 never triggered the chunk fetch — amiga/square/easing/spring
                 shipped a BLANK viewport, B.W3's headline blocker). The lazy
                 boundary survives on the BARE <Suspense> alone; the fade rides
                 `sceneSwapStyle` on this SIBLING <div> (SpringProgress +
                 rationale in `useSceneSwap`), never a wrapper <Transition>, so
                 the re-break can't recur. -->
            <div
                ref="sceneHostEl"
                class="scene-host h-full w-full"
                tabindex="-1"
                :style="sceneSwapStyle"
            >
                <Suspense :key="activeSceneKey" @resolve="onSceneResolved">
                    <component
                        :is="activeSceneComponent"
                        ref="sceneRef"
                        v-bind="activeSceneProps"
                    />
                    <template #fallback>
                        <div class="flex h-full w-full items-center justify-center">
                            <span class="text-subheading text-muted-foreground animate-pulse">Loading scene&#x2026;</span>
                        </div>
                    </template>
                </Suspense>
            </div>
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
// The ppmycota brand-mark rules (uncaged from utils.css, D.W2.S2) — a single
// non-scoped partial is the smallest shared scope for every brand-mark consumer
// App.vue mounts (header logo, CubeScene hover-card logo, CubeTarget cube face).
import "@styles/brand.css";
// Q.WC3 — the co-located scene-switch motion (the global directional VT
// keyframes; GLOBAL because the `::view-transition-*` pseudo-tree paints at the
// document root, never scoped).
import "./transition/scene-transition.css";

import { computed, markRaw, provide, ref, shallowRef, useTemplateRef } from "vue";
import {
    ACTIVE_CONTROL_CONDITIONALS_KEY,
    ACTIVE_SUPER_KEY,
    CONTROLS_PANE_HOVER_KEY,
    TABS_EXTERNALLY_MANAGED_KEY,
} from "@components/custom/animation-controls/injectionKeys";
import type { ControlSurface } from "@components/custom/animation-controls/stores";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import ChromeDock from "@components/custom/dock/ChromeDock.vue";
import MbabbMenu from "@components/custom/dock/MbabbMenu.vue";

import type { AnimationGroup } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";
import {
    getStoredAnimationGroupControlOptions,
    useSceneMachine,
} from "@components/custom/animation-controls/stores";

import { CUBE_ANIMATION_NAMES } from "../scenes/cube/useCubeAnimations";
import CubeScene from "../scenes/cube/CubeScene.vue";
import { useSceneMachineRouterBinding } from "./scene/useSceneMachineRouterBinding";
import { useSceneMachineShellBinding } from "./scene/useSceneMachineShellBinding";
import { useSceneSwap } from "./transition/useSceneSwap";
import { useSceneTransition } from "./transition/useSceneTransition";
import { scenes, sceneMap, warmScene, HOME_SCENE_ID } from "./scene/scenes";
import type { SceneExposedApi } from "./scene/sceneExposedApi";
import { useMonacoCancellationGuard } from "./runtime/useMonacoCancellationGuard";

// Swallow Monaco's benign "Canceled" CancellationError (keyframes-pane editor
// disposed mid-async on a fast scene switch) — app-lifetime, scope-managed.
useMonacoCancellationGuard();

// Tabs in the controls pane are managed via the ChromeDock controls tab dropdown
provide(TABS_EXTERNALLY_MANAGED_KEY, true);

// Dock hover → controls pane opacity. Provided here so both ChromeDock (sibling)
// and TransportDock (descendant of EditorShell) share the same ref.
const dockHoveredRef = ref(false);
provide(CONTROLS_PANE_HOVER_KEY, dockHoveredRef);

// ── The ONE authority: the scene+playback state machine ──────────────────────
// The machine OWNS the active-scene fact + the per-scene playback snapshot.
// Route reconcile (ONE reader + ONE writer + echo guard) + the first-load seed
// + the ?anim= projection + boot GC all live in useSceneMachineRouterBinding (it
// owns the router binding). App reads the machine's readonly refs only.
const machine = useSceneMachine();
useSceneMachineRouterBinding();

const currentSceneId = computed(() => machine.activeScene.value);
const isHome = computed(() => currentSceneId.value === HOME_SCENE_ID);
// S.A0 — the machine → transport intent edge: the machine's `playing` status,
// threaded down EditorShell → AnimationControlsGroup so a MACHINE-initiated
// start (the queued cold play consumed at SCENE_READY, the hero auto-play)
// reaches the transport's aria even when `group.started` has not yet flipped
// (it flips on the first rAF tick — the throttled cold-race read it stale).
const machinePlaying = computed(() => machine.status.value === "playing");
const currentScene = computed(() => sceneMap.get(currentSceneId.value) ?? sceneMap.get(HOME_SCENE_ID)!);
const currentSuperKey = computed(() => currentScene.value.superKey);
const currentLabel = computed(() => currentScene.value.label ?? "Home");

// The mobile STAGE mode-class (H.W7.S1c) — drives whether the mobile overlay
// full-bleeds the stage (subject: cube/amiga/square) or keeps a content card
// (editor: easing; storyboard: spring/sequence/path). Read off the active
// scene descriptor (the mode IS scene data, single-sourced on the descriptor;
// R.W5 C.5). `currentScene` always resolves (home fallback), so no `?? subject`.
const stageMode = computed(() => currentScene.value.stageMode);

// The control-surface DFA projection (H.W11.S4 / I2) — the active scene's valid
// BUILT-IN editor triad ({controls,keyframes,timeline} subset). The dock renders
// the triad FROM this set (the easing scene → [], so NO keyframes/timeline tab
// node exists for it), then unions the machine-projected `extraControlTabs`
// (below). The DFA gates what CAN render per scene — the reka-tab-fallback
// hacks the scenes carried are SUPERSEDED.
const controlSurfaces = computed(() => machine.controlSurfaces.value);

const sceneRef = shallowRef<SceneExposedApi | null>(null);

// The scene-swap subject: the host the View Transition morphs and the focus
// target routed to on `transition.finished` (the a11y MANDATORY).
const sceneHostEl = useTemplateRef<HTMLElement>("sceneHostEl");

// Start with an empty AnimationGroup. The active scene's real group is bound
// once the scene exposes it (after mount). markRaw groups are NEVER held in the
// machine context (MED-6) — only their serializable snapshots are.
const currentAnimationGroup = shallowRef<AnimationGroup<any>>(
    markRaw(new (kfEngine().AnimationGroup)()),
);
const autoPlayNext = ref(false);

const storedControls = computed(() => getStoredAnimationGroupControlOptions(currentSuperKey.value));

// ── The ACTIVE conditional surfaces (J.W2 S2) ────────────────────────────────
// Cube's `matrix-controls` is the ONE conditional surface: active iff the
// Matrix animation is selected — a stored fact, synchronous with the switch, no
// mount dependency (`CONDITIONAL_SURFACES` keeps the projection total per
// scene). Single-sourced here and PROVIDED (with the active superKey) to the
// AnimationControls derivation-sync — the ONE `selectedControl` writer — so the
// dock read, the panel projection, and the writer all consume the SAME
// conditional fact.
const activeControlConditionals = computed<readonly ControlSurface[]>(() =>
    storedControls.value.selectedAnimation === CUBE_ANIMATION_NAMES.Matrix
        ? ["matrix-controls"]
        : [],
);
provide(ACTIVE_CONTROL_CONDITIONALS_KEY, activeControlConditionals);
provide(ACTIVE_SUPER_KEY, currentSuperKey);

// ── The dock's extra control tabs — machine-PROJECTED (J.W0.S3) ──────────────
// The scene-specific tab metadata (easing→Easing, spring→Spring) derives from
// the machine's `activeScene` through the DFA's tab table, so the dock trigger
// label is BORN-CORRECT on the very tick the route rests on the destination —
// never the SOURCE scene's stale label through a `sceneRef.extraControlTabs`
// re-bind gated on the destination's <Suspense> mount (the scene-control-dfa
// trigger-lag race; that per-scene injection is DELETED).
const extraControlTabs = computed(() =>
    machine.extraControlTabs(activeControlConditionals.value),
);

// The dock trigger's SELECTED surface — the SAME I.W2 machine projection the
// in-panel tab host already binds (`AnimationControls` `<Tabs> :model-value`),
// extended to the dock READ (J.W0.S3). The raw `storedControls.selectedControl`
// is the per-superKey stored PICK; on a transition-arrival it can hold an
// invalid surface for the destination until the J.W2 single writer corrects the
// store — binding the projection (`selectedControlSurfaceFor(activeScene, pick,
// activeConditionals)`) makes the trigger label born-correct on the rest tick.
const dockSelectedControl = computed(
    () =>
        machine.selectedControlSurface(
            storedControls.value.selectedControl,
            activeControlConditionals.value,
        ) ?? storedControls.value.selectedControl,
);

// ── Home ↔ cube SPLIT (the alias is DEAD — two distinct machine states) ──────
// home and cube are DISTINCT states: home = the cube backdrop with NO group +
// the start screen; cube = the same component WITH its group registered. The
// component/key are shared (CubeScene), but `home` registers no adapter and
// shows no controls — the impossible-routed-state source is gone.
const activeSceneComponent = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") return CubeScene;
    return currentScene.value.component;
});
const activeSceneKey = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") return "cube";
    return currentSceneId.value;
});
const activeSceneProps = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") {
        return { hideLoader: isHome.value };
    }
    return {};
});

// Scene-swap cross-dissolve (SpringProgress) — PRESERVED driver (S7). The
// per-scene playback codec is now the machine + its ScenePlayback adapters.
const { sceneSwapStyle } = useSceneSwap(activeSceneKey);

// J.W2 S2 — the dock's pick lands as a DFA PROJECTION of the pick, never the
// raw value: the store (keyed by the ACTIVE superKey, atomic with the scene)
// only ever holds projections of the single authority. The dock itself renders
// only DFA-valid tabs, so this is normally an identity — the projection is the
// belt against a mid-transition emit racing the store key.
function onDockSelectControl(v: string) {
    storedControls.value.selectedControl =
        machine.selectedControlSurface(v, activeControlConditionals.value) ?? v;
}

// ── The scene-machine ↔ App-shell reconcile (S2/S4/S5) ───────────────────────
// Adapter registration, the targets-attached SCENE_READY emit, the bottom-bar
// play/pause routing, the scene switch, and the tab-visibility fold all live in
// the colocated binding (proof:app-is-shell). `runSceneSwitch` is read lazily
// (defined just below — the VT wrap), resolving the cyclic reference.
const {
    onSceneResolved,
    onPlayStateChange,
    onStartStateChange,
    switchScene,
} = useSceneMachineShellBinding({
    sceneRef,
    currentSceneId,
    currentSuperKey,
    isHome,
    currentAnimationGroup,
    autoPlayNext,
    getRunSceneSwitch: () => runSceneSwitch,
});

// Native View Transitions wrap the (synchronous) scene-id mutation; the no-VT
// path falls through to the SpringProgress cross-dissolve unchanged, and focus
// routes to the scene host on `finished` (a11y). Every scene-nav entry (the dock
// @switch-scene, the SharePopover restore) goes through this.
const { runSceneSwitch } = useSceneTransition(
    switchScene,
    sceneHostEl,
    currentSceneId,
);

// The @mbabb dock dropdown (brand menu + the D9 pointerdown-synthesis workaround)
// lives in @/components/custom/dock/MbabbMenu.vue (S.D1 · a23 F2). It surfaces its
// combined open state via `v-model:open` so ChromeDock's `:items-popup-open` holds
// the dock's expanded layer mounted while the menu (or its hover→press window) is
// live — the layer-collapse half of the D9 fix.
const mbabbPopupOpen = ref(false);
</script>

<style scoped>
/* The scene-swap subject for the View Transition: a single, stable
   `view-transition-name` on the scene host means exactly ONE element per VT
   state (so names never collide, the runtime MANDATORY), and the compositor
   morphs the old scene paint into the new across every nav. The PRM degrade
   (`::view-transition-* { animation: none }`) rides glass-ui's
   view-transition.css, already loaded via the demo's `@import
   "@mkbabb/glass-ui/styles"` — no demo-side VT CSS duplicates it. */
.scene-host {
    view-transition-name: scene-subject;

    /* G1 (demo-side, MEASURE-FIRST): paint containment on the perpetually-moving
       scene host. The rail·stage·rail column separation (H.W3) already moved the
       glass panels off this host's stacking context; `contain: paint` then walls
       the host's transforms off so a moving subject (the cube/amiga spin) cannot
       force the sibling panels' backdrop-filter to re-sample — the panel blur is
       no longer invalidated per scene frame (proof:scene-host-contained). */
    contain: paint;
}

/* The host is `tabindex="-1"` solely to receive PROGRAMMATIC focus after the
   transition (the a11y route); it is not a keyboard tab-stop, so suppress its
   focus ring — the focus moves context for AT without a stray outline. */
.scene-host:focus {
    outline: none;
}
</style>
