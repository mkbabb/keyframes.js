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
        :channels="currentChannels"
        :super-key="currentSuperKey"
        :show-start-screen="isHome"
        :auto-play="autoPlayNext"
        :stage-mode="stageMode"
        :has-control-surfaces="controlSurfaces.length > 0"
        @play-state-change="onPlayStateChange"
        @start-state-change="onStartStateChange"
    >
        <!-- T.D13 (OD-2: AURORA-ON-HERO, more subtle) — glass-ui's Aurora as
             the home hero's ambient background, mounted BY DEFAULT (the owner
             blessed the P-HERO ?light=1 fork AS the default; the review-lever
             query toggle is gone). Home only; navigating away tears the layer
             down. The subtlety bound lives in HeroAurora
             (HERO_AURORA_OPACITY_CEILING, proof:cursor-light-subtle). -->
        <template v-if="isHome" #backdrop>
            <HeroAurora />
        </template>

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
                        <SceneSkeleton />
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
// S.G2 S11 — the demo carries NO `::view-transition-*` CSS of its own (fold row
// 5 backlog, proof:icon-paint-live clause (e-grep)). The animation glyphs that
// paint the scene swap are glass-ui-owned (its `view-transition.css`, loaded via
// `@import "@mkbabb/glass-ui/styles"`): the untyped cross-fade + the `scene-subject`
// shared-element morph are the default UA/glass-ui look. The former Q.WC3 demo-side
// `scene-transition.css` (the typed `forward`/`backward` `::view-transition-old/new`
// slide keyframes) was demo-side VT residue the gate forbids — DELETED here. The
// direction is still DERIVED and passed as `view-transition-type` (useSceneTransition
// S.F1 dogfood over kf's `viewTransition`), so when glass-ui ships a generic
// type-keyed slide recipe (the owner-domain HANDOFF), the directional look returns
// for free with no demo CSS.

import {
    computed,
    markRaw,
    provide,
    ref,
    shallowRef,
    useTemplateRef,
    watchEffect,
} from "vue";
import {
    ACTIVE_SCENE_KEY,
    CONTROLS_PANE_HOVER_KEY,
    TABS_EXTERNALLY_MANAGED_KEY,
} from "@components/instrument/transport/injectionKeys";

import { EditorShell, EditorStartScreen } from "@components/instrument/shell";
// T.D13 — the home hero's Aurora backdrop (colocated in editor-shell/ beside
// the start screen it backs; imported directly, not via the barrel — a
// single-consumer leaf, the P-HERO import shape).
import HeroAurora from "@components/instrument/shell/HeroAurora.vue";
import SceneSkeleton from "./App.skeleton.vue";
import { ChromeDock, MbabbMenu } from "@components/dock";

import type { AnimationGroup } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";
import {
    getStoredAnimationGroupControlOptions,
    surfacesFor,
    useSceneMachine,
} from "@state";

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
// T.B8 — the `machinePlaying` computed (the machine → transport intent edge) is
// RETIRED: `useAnimationGroupPlayback` derives `isPlaying` directly from
// `machine.status` now, so the transport can never read a stale `false` — the
// S.A0 race it papered over is impossible by construction. No prop is threaded.
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

// T.B1-β STAGE 1 — the transport axis comes from the active scene's
// `SceneFacility.channels` when it exposes one (the honest channel set: labels,
// host mounts, selection, the scrub round-trip); `undefined` for home / a
// non-facility scene, in which case the transport falls back to the group keys.
const currentChannels = computed(() => sceneRef.value?.facility?.channels);

const storedControls = computed(() => getStoredAnimationGroupControlOptions(currentSuperKey.value));

provide(ACTIVE_SCENE_KEY, currentSuperKey);

// ── THE CONTROL-SURFACE DERIVATION (T.B2 — the inversion) ────────────────────
// The valid surface set is DERIVED from the active scene's live facility × the
// selected channel (`surfacesFor`), no longer a table row keyed by `activeScene`.
// The triad is COMPUTED from "does the selected channel paint" (a painting group
// can never be denied it — the #25 asymmetry cure), unioned with the facility's
// additive facets (easing Curve, spring Physics) and the SELECTED channel's own
// conditional facets (cube's matrix-controls — visible only while the Matrix
// channel is selected, so the old `activeControlConditionals` threading DIED).
// The App is the only place both the facility (on the mounted scene) and the
// selection are visible, so it feeds the derived set to the machine — the ONE
// writer the dock/panel projections read (`machine.controlSurfaces`).
// Home renders the SAME CubeScene component (the backdrop) — so `sceneRef` on
// home exposes cube's PAINTING facility. Home is the landing with NO controls
// (the start screen), so it derives [] explicitly, never cube's triad (the
// home↔cube split — home registers no adapter, shows no rail).
const derivedSurfaces = computed(() =>
    isHome.value
        ? []
        : surfacesFor(
              sceneRef.value?.facility,
              storedControls.value.selectedAnimation ?? undefined,
          ),
);
watchEffect(() => machine.setActiveSurfaces(derivedSurfaces.value));

// ── The dock's extra control tabs — DERIVED (T.B2 / J.W0.S3) ─────────────────
// The scene-specific facet surfaces' tab metadata (easing→Easing, spring→Spring,
// cube→Matrix Controls) derives from the machine's fed surface SET through the
// ONE `SURFACE_META` registry, so the dock trigger label settles synchronously
// with `setActiveSurfaces` — never a tick-late `sceneRef.extraControlTabs`
// re-bind gated on the destination's <Suspense> mount.
const extraControlTabs = computed(() => machine.extraControlTabs());

// The dock trigger's SELECTED surface — the SAME I.W2 machine projection the
// in-panel tab host binds (`AnimationControls` `<Tabs> :model-value`), extended
// to the dock READ. The raw `storedControls.selectedControl` is the per-superKey
// stored PICK; on a transition-arrival it can hold an invalid surface for the
// destination until the single writer corrects the store — binding the
// projection makes the trigger label born-correct on the rest tick.
const dockSelectedControl = computed(
    () =>
        machine.selectedControlSurface(storedControls.value.selectedControl) ??
        storedControls.value.selectedControl,
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
        machine.selectedControlSurface(v) ?? v;
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
// lives in @components/dock/MbabbMenu.vue (S.D1 · a23 F2). It surfaces its
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

    /* T.G1 (THE BLUR DE-LAYER — the perf keystone). The former `contain: paint`
       here was a FALSIFIED mitigation: lane-11 CDP sampling measured it
       neutral-to-WORSE (cube 90→73, home 95→84), and the mechanism proves why —
       `contain: paint` on the scene-host *sibling* cannot remove the moving
       subject's pixels from a *sibling* glass surface's `backdrop-filter`
       BACKDROP. A live `backdrop-filter` re-rasterizes whenever ANY paint in its
       backdrop root changes within its footprint, so every frame the stage
       subject animates the glass chrome's blur re-samples it (over the surviving
       scene set the `easing` stage is heaviest-coupled: 26→65fps here / the
       wave's 33→39.5fps @1440×dpr2 when the chrome blur is neutralized — VERDICT
       #19 root cause #1). The de-layer contract this host now holds: it is composited
       OUTSIDE any `backdrop-filter` ANCESTOR subtree (the stage never sits inside
       a filtered subtree — proof:blur-not-resampled's kf-side clause locks this)
       and carries NO falsified paint-wall. The remaining coupling — the glass
       chrome's LIVE blur re-sampling the moving stage as its backdrop — has NO
       pure-CSS kf-side cure (isolation/z-index/radius-cap/geometry all measured
       neutral); it is the glass-ui `blur-source="static"` frozen-backdrop
       capability, absent today → the BG-5 staticBackdrop gap (demo/glass-ui-gaps.ts,
       GLASSUI-GAP: staticBackdrop) handed off to T.H. proof:blur-not-resampled's
       runtime toggle-delta clause is BORN-RED and greens on that publish. */
}

/* The host is `tabindex="-1"` solely to receive PROGRAMMATIC focus after the
   transition (the a11y route); it is not a keyboard tab-stop, so suppress its
   focus ring — the focus moves context for AT without a stray outline. */
.scene-host:focus {
    outline: none;
}
</style>
