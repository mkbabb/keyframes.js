<template>
    <ChromeDock
        :current-scene-id="currentSceneId"
        :scenes="scenes"
        :home-scene-id="HOME_SCENE_ID"
        :current-label="currentLabel"
        :has-selected-animation="!!storedControls.selectedAnimation && !isHome"
        :is-controls-panel-open="storedControls.isControlsPanelOpen"
        :selected-control="storedControls.selectedControl"
        :extra-control-tabs="sceneRef?.extraControlTabs ?? []"
        @switch-scene="runSceneSwitch"
        @warm-scene="warmScene"
        @toggle-controls-panel="storedControls.isControlsPanelOpen = !storedControls.isControlsPanelOpen"
        @update-selected-control="(v: string) => { storedControls.selectedControl = v; }"
    >
        <template #items>
            <!-- @mbabb dropdown — S8 (BLK-8): DockDropdownTrigger is itself a
                 reka trigger (mirroring DockSelectTrigger), so it mounts DIRECTLY
                 inside <DropdownMenu>. The former outer <DropdownMenuTrigger
                 as-child> double-wrapped it — two triggers, two click handlers,
                 the inner click swallowed (handlerCount:2, finalOpen:false).
                 Keep-open is acquired IMPERATIVELY via useOptionalDockContext()
                 on @update:open (NOT a v-model:open binding — keepOpen/release
                 are a DI function pair, not a v-model surface). -->
            <DropdownMenu @update:open="onMbabbMenuOpen">
                <DockDropdownTrigger aria-label="@mbabb menu" class="text-mono-caption normal-case lg:text-mono-small">@mbabb</DockDropdownTrigger>
                <DropdownMenuContent align="end" :side-offset="8" class="z-modal min-w-[var(--dock-panel-width)] text-body p-1.5">
                    <!-- Share -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                        <SharePopover :on-scene-restore="(id: string) => runSceneSwitch(id)" />
                        <div class="flex-1 min-w-0">
                            <span class="text-small text-foreground">Share</span>
                            <p class="text-admin-label text-muted-foreground leading-tight">Copy link or load shared state</p>
                        </div>
                    </DropdownMenuItem>

                    <!-- Dark mode -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                        <DarkModeToggle
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
                            <p class="text-admin-label text-muted-foreground leading-tight">&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;</p>
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
import { CONTROLS_PANE_HOVER_KEY, TABS_EXTERNALLY_MANAGED_KEY } from "@components/custom/animation-controls/injectionKeys";

import { EditorShell, EditorStartScreen, SharePopover } from "@components/custom/editor-shell";
import { Avatar, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { DockDropdownTrigger, useOptionalDockContext } from "@mkbabb/glass-ui/dock";
import ChromeDock from "@components/custom/dock/ChromeDock.vue";

import { AnimationGroup } from "@src/animation/group";
import {
    getStoredAnimationGroupControlOptions,
    useSceneMachine,
} from "@components/custom/animation-controls/stores";

import CubeScene from "./scenes/CubeScene.vue";
import { useSceneMachineRouter } from "./useSceneMachineRouter";
import { useSceneMachineApp } from "./useSceneMachineApp";
import { useSceneSwap } from "./useSceneSwap";
import { useSceneTransition } from "./useSceneTransition";
import { scenes, sceneMap, warmScene, HOME_SCENE_ID } from "./scenes";

// Tabs in the controls pane are managed via the ChromeDock controls tab dropdown
provide(TABS_EXTERNALLY_MANAGED_KEY, true);

// Dock hover → controls pane opacity. Provided here so both ChromeDock (sibling)
// and AnimationMenuBar (descendant of EditorShell) share the same ref.
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

// ── S8 (BLK-8): keep the dock expanded while the @mbabb menu is open ──────────
// Imperative DI function pair on DockContext (HD-2) — NOT a v-model surface.
const dockContext = useOptionalDockContext();
function onMbabbMenuOpen(open: boolean) {
    if (open) dockContext?.keepOpen();
    else dockContext?.release();
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
