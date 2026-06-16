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
        :items-popup-open="mbabbMenuOpen || mbabbPressing"
        @switch-scene="runSceneSwitch"
        @warm-scene="warmScene"
        @toggle-controls-panel="storedControls.isControlsPanelOpen = !storedControls.isControlsPanelOpen"
        @update-selected-control="onDockSelectControl"
    >
        <template #items>
            <!-- @mbabb dropdown — S8 (BLK-8) / D9 re-cure: DockDropdownTrigger is
                 itself a reka trigger (mirroring DockSelectTrigger), so it mounts
                 DIRECTLY inside <DropdownMenu>. The former outer
                 <DropdownMenuTrigger as-child> double-wrapped it (two triggers,
                 the inner click swallowed); that wrap is GONE. reka still OWNS the
                 open/close latch (uncontrolled) — a clean single toggle.

                 The D9 race re-surfaced under the J.W7c U1 golden-proportion dock:
                 reka's DockSelectTrigger opens on POINTERDOWN (wins instantly), but
                 DockDropdownTrigger opens on CLICK — it needs pointerdown AND
                 pointerup on the SAME node. The dock-control press-scale
                 (`:active { scale: var(--scale-press-dock) /* .96 */ }`, glass-ui's
                 affordance shared with the Select) shrinks the pill mid-press, so
                 pointerup lands off the trigger and no `click` is ever synthesised →
                 the menu never opens (the deterministic born-RED in a fresh context).

                 FIX (product seam, no reka/glass-ui patch): on the trigger's
                 POINTERDOWN we SYNTHESISE the click reka needs (a reflow-immune
                 actuation mirroring the Select's pointerdown-wins behaviour) and kill
                 the trailing native click, leaving reka in sole control of the
                 toggle; and we surface the menu's open state to ChromeDock
                 (`:items-popup-open`) so the DOCK holds itself open — keeping the
                 trigger's expanded layer mounted while the menu is open (the slot's
                 own useOptionalDockContext can't reach the GlassDock provider). See
                 the handlers below for the full rationale. -->
            <DropdownMenu @update:open="onMbabbMenuOpen">
                <DockDropdownTrigger aria-label="@mbabb menu" class="text-mono-caption normal-case lg:text-mono-small" @pointerenter="onMbabbTriggerEnter" @pointerleave="onMbabbTriggerLeave" @pointerdown="onMbabbTriggerPointerdown" @click.capture="onMbabbTriggerClickCapture">@mbabb</DockDropdownTrigger>
                <DropdownMenuContent align="end" :side-offset="8" class="z-modal min-w-[var(--dock-panel-width)] text-body p-1.5">
                    <!-- Share -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                        <SharePopover :on-scene-restore="(id: string) => runSceneSwitch(id)" />
                        <div class="flex-1 min-w-0">
                            <span class="text-small text-foreground">Share</span>
                            <p class="text-admin-label text-muted-foreground leading-tight">Copy link or load shared state</p>
                        </div>
                    </DropdownMenuItem>

                    <!-- Dark mode — the whole row is the toggle target (F5,
                         mirroring the ppmycota row below): a row-level @click
                         flips the theme, and <DarkModeToggle passive> makes the
                         inner icon a pure INDICATOR (`@click="!passive &&
                         toggleDark()"` short-circuits) so the row fires exactly
                         once — no double-toggle. -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="toggleDark()">
                        <DarkModeToggle
                            passive
                            title="Toggle dark mode"
                            class="aspect-square w-5"
                        />
                        <span class="text-small text-foreground">Dark mode</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <!-- ppmycota logo — toggles pp mode -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="togglePpMode">
                        <div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>
                        <div class="flex-1 min-w-0">
                            <!-- Brand colour consumes the --ppmycota-primary token
                                 directly (inline, not a text-[var(...)] arbitrary
                                 utility): the dropdown content is portalled, so an
                                 inline style is the portal-safe home for the token
                                 ref while it co-locates with the brand mark (S2). -->
                            <span class="text-small" :style="{ color: 'var(--ppmycota-primary)' }">ppmycota</span>
                            <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors" @click.stop>ppmycota.com</a>
                        </div>
                    </DropdownMenuItem>

                    <!-- @mbabb -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1">
                        <Avatar class="w-7 h-7">
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            ></AvatarImage>
                        </Avatar>
                        <div class="flex-1 min-w-0">
                            <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="text-mono-caption normal-case font-semibold text-foreground hover:underline">@mbabb</a>
                            <p class="text-admin-label text-muted-foreground leading-tight">CSS keyframe animation engine</p>
                            <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors">View the project on Github &#x1F389;</a>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </template>
    </ChromeDock>

    <EditorShell
        :animation-group="currentAnimationGroup"
        :super-key="currentSuperKey"
        :show-start-screen="isHome"
        :auto-play="autoPlayNext"
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

import { computed, markRaw, provide, ref, shallowRef, useTemplateRef } from "vue";
import {
    ACTIVE_CONTROL_CONDITIONALS_KEY,
    ACTIVE_SUPER_KEY,
    CONTROLS_PANE_HOVER_KEY,
    TABS_EXTERNALLY_MANAGED_KEY,
} from "@components/custom/animation-controls/injectionKeys";
import type { ControlSurface } from "@components/custom/animation-controls/stores";

import { EditorShell, EditorStartScreen, SharePopover } from "@components/custom/editor-shell";
import { Avatar, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { DockDropdownTrigger } from "@mkbabb/glass-ui/dock";
import ChromeDock from "@components/custom/dock/ChromeDock.vue";

import { AnimationGroup } from "@src/animation/group";
import {
    getStoredAnimationGroupControlOptions,
    useSceneMachine,
} from "@components/custom/animation-controls/stores";

import { CUBE_ANIMATION_NAMES } from "../cube/useCubeAnimations";
import CubeScene from "./scenes/CubeScene.vue";
import { useSceneMachineRouter } from "./useSceneMachineRouter";
import { useSceneMachineApp } from "./useSceneMachineApp";
import { useSceneSwap } from "./useSceneSwap";
import { useSceneTransition } from "./useSceneTransition";
import { scenes, sceneMap, warmScene, stageModeFor, HOME_SCENE_ID } from "./scenes";
import { useMonacoCancellationGuard } from "./useMonacoCancellationGuard";

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
// + the ?anim= projection + boot GC all live in useSceneMachineRouter (it owns
// the router binding). App reads the machine's readonly refs only.
const machine = useSceneMachine();
useSceneMachineRouter();

const currentSceneId = computed(() => machine.activeScene.value);
const isHome = computed(() => currentSceneId.value === HOME_SCENE_ID);
const currentScene = computed(() => sceneMap.get(currentSceneId.value) ?? sceneMap.get(HOME_SCENE_ID)!);
const currentSuperKey = computed(() => currentScene.value.superKey);
const currentLabel = computed(() => currentScene.value.label ?? "Home");

// The mobile STAGE mode-class (H.W7.S1c) — drives whether the mobile overlay
// full-bleeds the stage (subject: cube/amiga/square) or keeps a content card
// (editor: easing; storyboard: spring/sequence/path). Derived from the active
// scene id (the mode IS scene data, single-sourced in scenes.ts).
const stageMode = computed(() => stageModeFor(currentSceneId.value));

// The control-surface DFA projection (H.W11.S4 / I2) — the active scene's valid
// BUILT-IN editor triad ({controls,keyframes,timeline} subset). The dock renders
// the triad FROM this set (the easing scene → [], so NO keyframes/timeline tab
// node exists for it), then unions the machine-projected `extraControlTabs`
// (below). The DFA gates what CAN render per scene — the reka-tab-fallback
// hacks the scenes carried are SUPERSEDED.
const controlSurfaces = computed(() => machine.controlSurfaces.value);

const sceneRef = shallowRef<any>(null);

// The scene-swap subject: the host the View Transition morphs and the focus
// target routed to on `transition.finished` (the a11y MANDATORY).
const sceneHostEl = useTemplateRef<HTMLElement>("sceneHostEl");

// Start with an empty AnimationGroup. The active scene's real group is bound
// once the scene exposes it (after mount). markRaw groups are NEVER held in the
// machine context (MED-6) — only their serializable snapshots are.
const currentAnimationGroup = shallowRef<AnimationGroup<any>>(markRaw(new AnimationGroup()));
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

function togglePpMode() {
    storedControls.value.ppMode = !(storedControls.value.ppMode ?? false);
}

// J.W2 S2 — the dock's pick lands as a DFA PROJECTION of the pick, never the
// raw value: the store (keyed by the ACTIVE superKey, atomic with the scene)
// only ever holds projections of the single authority. The dock itself renders
// only DFA-valid tabs, so this is normally an identity — the projection is the
// belt against a mid-transition emit racing the store key.
function onDockSelectControl(v: string) {
    storedControls.value.selectedControl =
        machine.selectedControlSurface(v, activeControlConditionals.value) ?? v;
}

// F5 — the dark-mode dropdown row's click target. The same singleton glass-ui
// `useGlobalDark` the CSS editor consumes (CSSCodeEditor.vue); the row fires
// `toggleDark()` while `<DarkModeToggle passive>` becomes a pure indicator, so
// the theme flips exactly once per row click (no double-toggle).
const { toggleDark } = useGlobalDark();

// ── The scene-machine ↔ App-shell reconcile (S2/S4/S5) ───────────────────────
// Adapter registration, the targets-attached SCENE_READY emit, the bottom-bar
// play/pause routing, the scene switch, and the tab-visibility fold all live in
// the colocated composable (proof:app-shell-thinness). `runSceneSwitch` is read
// lazily (defined just below — the VT wrap), resolving the cyclic reference.
const {
    onSceneResolved,
    onPlayStateChange,
    onStartStateChange,
    switchScene,
} = useSceneMachineApp({
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
const { runSceneSwitch } = useSceneTransition(switchScene, sceneHostEl);

// ── S8/BLK-8 (D9): the @mbabb menu opens on POINTERDOWN, dock pinned while open ──
//
// THE RACE (BLK-8 root, re-surfaced by the J.W7c U1 golden-proportion dock): reka's
// `DockSelectTrigger` opens on `pointerdown` (it wins instantly), but the
// `DockDropdownTrigger` opens on `click` — it needs pointerdown AND pointerup to
// land on the SAME element. The collapsed dock only stays expanded on hover, and
// the press reflows/collapses the pill between down and up, moving the trigger out
// from under the pointer; no `click` is synthesised → the menu never opens
// (aria-expanded:false, finalOpen:false — the exact born-RED, deterministic in a
// fresh context).
//
// FIX (product seam, no reka/glass-ui patch), two coupled parts:
//
//  (1) THE PRESS-SCALE REFLOW. The dock-control press affordance
//      (`:active { scale: var(--scale-press-dock) /* .96 */ }`, glass-ui, shared
//      with the Select) shrinks the pill mid-press, so the native pointerup/click
//      lands off the trigger and reka — which opens on CLICK — never sees one. On
//      the trigger's POINTERDOWN we SYNTHESISE the click reka listens for (a
//      reflow-immune actuation that mirrors the Select's pointerdown-wins
//      behaviour), and KILL the trailing native click in the capture phase so the
//      latch toggles exactly once. reka stays UNCONTROLLED and owns open/close — a
//      naturally clean toggle (closed→open→closed→open).
//
//  (2) THE LAYER COLLAPSE. The trigger lives in the dock's EXPANDED layer; once the
//      dock collapses, that layer goes `visibility:hidden` and the trigger vanishes
//      (so a second click can't reach it to close). The slot content is set up in
//      App.vue, so its `useOptionalDockContext()` resolves ABOVE the GlassDock
//      provider and CANNOT hold the dock — the prior S8 keep-open here was a silent
//      no-op. We instead surface the menu's open state to ChromeDock
//      (`:items-popup-open`), which holds the dock via its OWN dockRef — the same
//      hold the scene/controls Selects ride.
const mbabbMenuOpen = ref(false);
// Pins the dock the instant the pointer is over the @mbabb trigger — BEFORE the
// reka open-state round-trips back through @update:open — so a collapse already
// scheduled (the pointer was parked off the dock) is suppressed before it can hide
// the trigger's layer mid-press. Cleared on leave once the menu isn't open.
const mbabbPressing = ref(false);
// True only while OUR synthetic click is in flight — the capture-phase guard lets
// that one reach reka and kills every native (reflow-prone) click.
let mbabbSynthClick = false;
function onMbabbTriggerEnter() {
    mbabbPressing.value = true; // pin the dock open across the hover→press window
}
function onMbabbTriggerLeave() {
    if (!mbabbMenuOpen.value) mbabbPressing.value = false;
}
function onMbabbTriggerPointerdown(event: PointerEvent) {
    // Primary-button, non-ctrl only (match reka's Select pointerdown gate). Mouse,
    // pen AND touch all actuate here: the press-scale reflow can swallow the native
    // click on any input, so we synthesise on pointerdown across the board and kill
    // the trailing native click (the capture guard) for a single clean toggle (D9).
    if (event.button !== 0 || event.ctrlKey) return;
    event.preventDefault();
    mbabbPressing.value = true;
    const el = event.currentTarget as HTMLElement | null;
    mbabbSynthClick = true;
    el?.click(); // reka's trigger onClick toggles on THIS synthetic, reflow-immune click
    mbabbSynthClick = false;
}
function onMbabbTriggerClickCapture(event: MouseEvent) {
    // Our synthetic click passes through to reka; a trailing NATIVE click (if the
    // reflow even let one land) is killed in capture so it cannot double-toggle.
    if (mbabbSynthClick) return;
    event.preventDefault();
    event.stopPropagation();
}
function onMbabbMenuOpen(open: boolean) {
    // reka owns the latch; mirror its open state to ChromeDock's dock hold so the
    // trigger's layer stays mounted (visible) while the menu is open.
    mbabbMenuOpen.value = open;
    if (!open) mbabbPressing.value = false; // closed → drop the press pin
}
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
