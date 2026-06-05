<template>
    <TopDock
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
            <!-- @mbabb dropdown -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <DockDropdownTrigger aria-label="@mbabb menu" class="text-mono-caption normal-case lg:text-mono-small">@mbabb</DockDropdownTrigger>
                </DropdownMenuTrigger>
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
    </TopDock>

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
                <Suspense :key="activeSceneKey">
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

import { computed, markRaw, nextTick, provide, ref, shallowRef, useTemplateRef } from "vue";
import { CONTROLS_PANE_HOVER_KEY, TABS_EXTERNALLY_MANAGED_KEY } from "@components/custom/animation-controls/injectionKeys";

import { EditorShell, EditorStartScreen, SharePopover } from "@components/custom/editor-shell";
import { Avatar, AvatarImage, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { DockDropdownTrigger } from "@mkbabb/glass-ui/dock";
import { TopDock } from "@components/custom/dock";

import { AnimationGroup } from "@src/animation/group";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

// Tabs in the controls pane are managed via the TopDock controls tab dropdown
provide(TABS_EXTERNALLY_MANAGED_KEY, true);

// Dock hover → controls pane opacity. Provided here so both TopDock (sibling)
// and AnimationMenuBar (descendant of EditorShell) share the same ref.
const dockHoveredRef = ref(false);
provide(CONTROLS_PANE_HOVER_KEY, dockHoveredRef);

import CubeScene from "./scenes/CubeScene.vue";
import { useSceneRouter } from "./useSceneRouter";
import { useSceneUrl } from "./useSceneUrl";
import { usePlaybackSnapshot } from "./usePlaybackSnapshot";
import { useSceneSwap } from "./useSceneSwap";
import { useSceneTransition } from "./useSceneTransition";
import { useSceneGroupSync } from "./useSceneGroupSync";
import { sceneMap, warmScene, HOME_SCENE_ID } from "./scenes";

const { currentSceneId, currentScene, isHome, ready, scenes, switchScene: rawSwitchScene } = useSceneRouter();

const sceneRef = shallowRef<any>(null);

// The scene-swap subject: the host the View Transition morphs and the focus
// target routed to on `transition.finished` (the a11y MANDATORY).
const sceneHostEl = useTemplateRef<HTMLElement>("sceneHostEl");

// Start with an empty AnimationGroup. Use the scene's actual superKey from the
// start so ACG mounts with the correct key — avoids an unnecessary remount cycle
// (double-mount) on initial page load that causes visual clipping.
const currentAnimationGroup = shallowRef<AnimationGroup<any>>(markRaw(new AnimationGroup()));
const currentSuperKey = shallowRef<string>(currentScene.value.superKey);
const autoPlayNext = ref(false);

// Bidirectional ?anim= query param sync
useSceneUrl(currentSuperKey);

const currentLabel = computed(() => sceneMap.get(currentSceneId.value)?.label ?? "Home");

// Unified scene component/key/props for KeepAlive (requires single child)
const activeSceneComponent = computed(() => {
    if (isHome.value || currentSceneId.value === 'cube') return CubeScene;
    return currentScene.value.component;
});
const activeSceneKey = computed(() => {
    if (isHome.value || currentSceneId.value === 'cube') return 'cube';
    return currentSceneId.value;
});
const activeSceneProps = computed(() => {
    if (isHome.value || currentSceneId.value === 'cube') {
        return { hideLoader: isHome.value };
    }
    return {};
});

// Scene-swap cross-dissolve (SpringProgress) + per-scene playback codec — the
// engine choreography + rationale live in the colocated composables.
const { sceneSwapStyle } = useSceneSwap(activeSceneKey);
const { saveCurrentPlaybackState, restoreGroupPlaybackState } = usePlaybackSnapshot(currentSuperKey, currentAnimationGroup);

const storedControls = computed(() => getStoredAnimationGroupControlOptions(currentSuperKey.value));

function togglePpMode() {
    storedControls.value.ppMode = !(storedControls.value.ppMode ?? false);
}

function onPlayStateChange(playing: boolean) {
    // Home "play" is a user gesture — it navigates to cube and auto-plays.
    // Gate on the empty home group (no animations) so re-activating a cached
    // scene whose group was already started can't spuriously warp us away.
    const group = currentAnimationGroup.value;
    const isHomeEmptyGroup = Object.keys(group.animations).length === 0;
    if (isHome.value && playing && isHomeEmptyGroup) {
        autoPlayNext.value = true;
        // The home Play gesture navigates home→cube — route it through the same
        // View-Transition entry as the dock nav (runSceneSwitch is referenced at
        // event time, after setup, so the later `const` binding is resolved).
        runSceneSwitch("cube");
        return;
    }
    if (sceneRef.value && 'isPlaying' in sceneRef.value) {
        sceneRef.value.isPlaying = playing;
    }
}

function onStartStateChange(started: boolean) {
    // Writing via script handler (not inline template) so the assignment
    // is scheduled against `sceneRef.value` at call time, not captured
    // from a stale template-closure reference. Without this, the sibling
    // CubeScene's `isStarted` ref would remain at its `ref(false)`
    // default, which defeats the drag-during-playback gate in
    // `useTransformState` and produces compositing jitter.
    if (sceneRef.value && 'isStarted' in sceneRef.value) {
        sceneRef.value.isStarted = started;
    }
}

// Sync controls-panel-open state across scene switches
function switchScene(id: string) {
    const prevControls = getStoredAnimationGroupControlOptions(currentSuperKey.value);
    const wasOpen = prevControls.isControlsPanelOpen;
    const wasHome = isHome.value;

    // Save playback state before switching
    saveCurrentPlaybackState();

    rawSwitchScene(id);

    // Home uses the cube component/key unconditionally (activeSceneKey is
    // always 'cube' when isHome), so regardless of the previous scene the
    // KeepAlive slot transitions into the (possibly cached) CubeScene.
    // Hide the cube's controls so only the start screen is visible.
    if (id === HOME_SCENE_ID) {
        const cubeControls = getStoredAnimationGroupControlOptions("Cube");
        cubeControls.isControlsPanelOpen = false;
        return;
    }

    // Home→Cube: CubeScene already mounted, just select first animation
    if (id === "cube" && wasHome) {
        const controls = getStoredAnimationGroupControlOptions("Cube");
        if (!controls.selectedAnimation) {
            const group = sceneRef.value?.animationGroup;
            if (group) {
                const names = Object.keys(group.animations);
                if (names.length > 0) {
                    controls.selectedAnimation = names[0]!;
                }
            }
        }
        controls.isControlsPanelOpen = window.innerWidth >= 1024;
        // Reset autoPlayNext after the watcher in AnimationControlsGroup
        // has had a chance to consume it during this reactive flush.
        nextTick(() => { autoPlayNext.value = false; });
        return;
    }

    const newScene = currentScene.value;
    const newControls = getStoredAnimationGroupControlOptions(newScene.superKey);
    newControls.isControlsPanelOpen = wasOpen;

    // If coming from home, auto-open the controls panel (desktop only)
    if (wasHome && window.innerWidth >= 1024) {
        newControls.isControlsPanelOpen = true;
    }
}

// Native View Transitions wrap the (synchronous) scene-id mutation above; the
// no-VT path falls through to the SpringProgress cross-dissolve unchanged, and
// focus routes to the scene host on `finished` (a11y). Every scene-nav entry
// (the dock @switch-scene, the SharePopover restore) goes through this.
const { runSceneSwitch } = useSceneTransition(switchScene, sceneHostEl);

// The scene-group ↔ controls/playback-store reconcile across ACG's remount
// cycle (the double-fire codec) — extracted to keep the scene shell legible.
useSceneGroupSync({
    sceneRef,
    currentSuperKey,
    currentAnimationGroup,
    isHome,
    autoPlayNext,
    restoreGroupPlaybackState,
});
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
}

/* The host is `tabindex="-1"` solely to receive PROGRAMMATIC focus after the
   transition (the a11y route); it is not a keyboard tab-stop, so suppress its
   focus ring — the focus moves context for AT without a stray outline. */
.scene-host:focus {
    outline: none;
}
</style>
