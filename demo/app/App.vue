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
        @switch-scene="switchScene"
        @toggle-controls-panel="storedControls.isControlsPanelOpen = !storedControls.isControlsPanelOpen"
        @update-selected-control="(v: string) => { storedControls.selectedControl = v; }"
    >
        <template #items>
            <!-- @mbabb popover -->
            <DockPopover direction="down" :collapse-delay="1200">
                <template #trigger>
                    <span class="text-xs lg:text-sm font-mono cursor-pointer">@mbabb</span>
                </template>
                <div class="p-2.5 min-w-[16rem] flex flex-col gap-1.5">
                    <!-- Share -->
                    <div class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-foreground/5 transition-colors">
                        <SharePopover :on-scene-restore="(id: string) => switchScene(id)" />
                        <div class="flex-1 min-w-0">
                            <span class="instrument-serif text-sm text-foreground">Share</span>
                            <p class="instrument-serif text-[11px] text-muted-foreground leading-tight">Copy link or load shared state</p>
                        </div>
                    </div>

                    <!-- Dark mode -->
                    <div class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-foreground/5 transition-colors">
                        <DarkModeToggle
                            title="Toggle dark mode"
                            class="aspect-square w-5"
                        />
                        <span class="instrument-serif text-sm text-foreground">Dark mode</span>
                    </div>

                    <hr class="border-border/40 my-0.5" />

                    <!-- ppmycota logo — toggles pp mode -->
                    <div class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer" @click="togglePpMode">
                        <div class="ppmycota-logo-sm w-7 h-7 shrink-0 hover:scale-105 transition-transform"></div>
                        <div class="flex-1 min-w-0">
                            <span class="instrument-serif text-sm text-[hsl(var(--ppmycota-primary))]">ppmycota</span>
                            <p class="instrument-serif text-[11px] text-muted-foreground leading-tight">&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;</p>
                            <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="instrument-serif text-[10px] text-muted-foreground hover:text-foreground hover:underline transition-colors" @click.stop>ppmycota.com</a>
                        </div>
                    </div>

                    <!-- @mbabb -->
                    <div class="flex items-center gap-2.5 px-1.5 py-1">
                        <Avatar class="w-7 h-7">
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            ></AvatarImage>
                        </Avatar>
                        <div class="flex-1 min-w-0">
                            <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-xs font-semibold text-foreground hover:underline">@mbabb</a>
                            <p class="instrument-serif text-[11px] text-muted-foreground leading-tight">CSS keyframe animation engine</p>
                            <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="instrument-serif text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors">View the project on Github 🎉</a>
                        </div>
                    </div>
                </div>
            </DockPopover>
        </template>
    </TopDock>

    <EditorShell
        :animation-group="currentAnimationGroup"
        :super-key="currentSuperKey"
        :show-start-screen="isHome"
        :auto-play="autoPlayNext"
        @play-state-change="onPlayStateChange"
        @start-state-change="(v: boolean) => { if (sceneRef) sceneRef.isStarted = v; }"
    >
        <template #start-screen>
            <EditorStartScreen
                title="Select an animation"
                ellipsis="..."
                subtitle="from the list"
                subtitleSuffix="below."
                hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;"
            />
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
            <Transition name="scene" mode="out-in">
                <!-- Home + Cube share the same CubeScene instance (same key = no remount).
                     Transform state persists across home ↔ cube transitions. -->
                <CubeScene
                    v-if="isHome || currentSceneId === 'cube'"
                    key="cube"
                    ref="sceneRef"
                    :hide-loader="isHome"
                />
                <component
                    v-else-if="currentScene.component"
                    :is="currentScene.component"
                    :key="currentSceneId"
                    ref="sceneRef"
                />
            </Transition>
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
import { computed, markRaw, nextTick, provide, ref, shallowRef, watch } from "vue";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import { SharePopover } from "@components/custom/editor-shell";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { TopDock, DockPopover } from "@components/custom/dock";

import { AnimationGroup } from "@src/animation/group";
import { getStoredAnimationGroupControlOptions, setActiveScene, saveScenePlaybackState, getScenePlaybackState, clearScenePlaybackState, initFromHash } from "@components/custom/animation-controls/animationStores";
import type { ScenePlaybackState } from "@components/custom/animation-controls/animationStores";

// Restore shared state from URL hash before components read stored options
initFromHash();

// Tabs in the controls pane are managed via the TopDock controls tab dropdown
provide("tabsExternallyManaged", true);

// Dock hover → controls pane opacity. Provided here so both TopDock (sibling)
// and AnimationMenuBar (descendant of EditorShell) share the same ref.
const dockHoveredRef = ref(false);
provide("controlsPaneHover", dockHoveredRef);

import CubeScene from "./scenes/CubeScene.vue";
import { useSceneManager } from "./useSceneManager";
import { scenes, sceneMap, HOME_SCENE_ID } from "./scenes";

const { currentSceneId, currentScene, isHome, switchScene: rawSwitchScene } = useSceneManager();

// Keep share state in sync with the active scene
setActiveScene(currentSceneId.value);
watch(currentSceneId, (id) => setActiveScene(id));

const sceneRef = shallowRef<any>(null);

// Start with an empty AnimationGroup. Use the scene's actual superKey from the
// start so ACG mounts with the correct key — avoids an unnecessary remount cycle
// (double-mount) on initial page load that causes visual clipping.
const currentAnimationGroup = shallowRef<AnimationGroup<any>>(markRaw(new AnimationGroup()));
const currentSuperKey = shallowRef<string>(currentScene.value.superKey);
const autoPlayNext = ref(false);

const currentLabel = computed(
    () => sceneMap.get(currentSceneId.value)?.label ?? "Home",
);

const storedControls = computed(() => getStoredAnimationGroupControlOptions(currentSuperKey.value));

function togglePpMode() {
    storedControls.value.ppMode = !(storedControls.value.ppMode ?? false);
}

function onPlayStateChange(playing: boolean) {
    // If play is pressed while on the home screen, switch to cube and auto-play
    if (isHome.value) {
        autoPlayNext.value = true;
        switchScene("cube");
        return;
    }
    if (sceneRef.value && 'isPlaying' in sceneRef.value) {
        sceneRef.value.isPlaying = playing;
    }
}

/** Snapshot the current scene's animation playback state before leaving. */
function saveCurrentPlaybackState() {
    const key = currentSuperKey.value;
    const group = currentAnimationGroup.value;
    if (!key || key.startsWith("__") || !group.started) return;

    const animations: Record<string, { t: number; reversed: boolean; iteration: number }> = {};
    for (const [name, { animation }] of Object.entries(group.animations)) {
        animations[name] = {
            t: animation.t,
            reversed: animation.reversed,
            iteration: animation.iteration,
        };
    }
    saveScenePlaybackState(key, {
        playing: group.playing(),
        started: group.started,
        animations,
    });
}

/**
 * Restore a saved playback state onto a fresh AnimationGroup.
 * Sets each animation to the saved T value (with correct direction),
 * renders the frame, and resumes playing if it was playing before.
 */
function restoreGroupPlaybackState(group: AnimationGroup<any>, savedState: ScenePlaybackState) {
    const now = performance.now();

    group.started = true;
    group.lastTickTime = now;

    for (const [name, groupObject] of Object.entries(group.animations)) {
        const snap = savedState.animations[name];
        if (!snap) continue;

        const anim = groupObject.animation;

        anim.managed = true;
        anim.started = true;
        anim.reversed = snap.reversed;
        anim.iteration = snap.iteration;
        anim.startTime = now - snap.t;
        anim.t = snap.t;
        anim.paused = true;
        anim.pausedTime = now;

        // Interpolate frames at the saved T to populate values
        const vars = anim.interpFrames(snap.t, false);
        Object.assign(groupObject.values, vars);
    }

    // Render the restored frame
    group.paused = true;
    group.transformFramesGrouped(now);

    if (savedState.playing) {
        // Toggle from paused → playing: unpauses children and starts rAF loop
        group.pause();
    }
}

// Sync controls-panel-open state across scene switches
function switchScene(id: string) {
    const prevControls = getStoredAnimationGroupControlOptions(currentSuperKey.value);
    const wasOpen = prevControls.isControlsPanelOpen;
    const wasHome = isHome.value;
    const wasCubeOrHome = wasHome || currentSceneId.value === "cube";

    // Save playback state before switching
    saveCurrentPlaybackState();

    rawSwitchScene(id);

    // Home↔Cube: CubeScene stays mounted (same key), just toggle controls
    if (id === HOME_SCENE_ID && wasCubeOrHome) {
        // Going to home from cube — keep CubeScene mounted, hide controls
        // showStartScreen is bound to isHome, so start screen appears automatically
        const cubeControls = getStoredAnimationGroupControlOptions("Cube");
        cubeControls.isControlsPanelOpen = false;
        return;
    }

    if (id === HOME_SCENE_ID) {
        // Going to home from a non-cube scene — CubeScene will mount fresh
        currentSuperKey.value = "__home__";
        currentAnimationGroup.value = markRaw(new AnimationGroup());
        sceneRef.value = null;
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

watch(
    () => sceneRef.value?.animationGroup,
    (group) => {
        if (!group) return;
        const superKey = sceneRef.value!.superKey;

        // Detect the "stable" fire: when superKey hasn't changed, this is
        // the second watcher fire after ACG's key-triggered remount cycle.
        // The scene has remounted inside the new ACG, targets are set,
        // and this group instance is the one that will stick around.
        const isStableFire = currentSuperKey.value === superKey;

        // Configure controls BEFORE updating superKey — the key change
        // remounts AnimationControlsGroup which reads these during setup.
        const controls = getStoredAnimationGroupControlOptions(superKey);
        if (isHome.value) {
            controls.isControlsPanelOpen = false;
        } else if (!controls.selectedAnimation) {
            const names = Object.keys(group.animations);
            if (names.length > 0) {
                controls.selectedAnimation = names[0]!;
                controls.isControlsPanelOpen = window.innerWidth >= 1024;
            }
        }

        currentSuperKey.value = superKey;
        currentAnimationGroup.value = markRaw(group);

        // Restore saved playback state on the stable (second) fire.
        // By this point the scene has mounted and set targets, so
        // interpFrames can resolve computed CSS values.
        if (isStableFire) {
            const savedState = getScenePlaybackState(superKey);
            if (savedState) {
                restoreGroupPlaybackState(group, savedState);
                clearScenePlaybackState(superKey);
            }
        }

        // Clear autoPlay flag after the scene has mounted and the
        // AnimationControlsGroup consumed it via the prop.
        if (autoPlayNext.value) {
            // Keep it true for this render cycle so AnimationControlsGroup
            // sees it during its mount. Clear on next tick.
            nextTick(() => { autoPlayNext.value = false; });
        }
    },
);
</script>

<style>
.scene-enter-active {
    transition:
        opacity 0.35s ease-out,
        transform 0.4s var(--ease-spring);
}
.scene-leave-active {
    transition:
        opacity 0.25s ease-in,
        transform 0.25s ease-in;
}
.scene-enter-from {
    opacity: 0;
    transform: scale(0.97);
}
.scene-leave-to {
    opacity: 0;
    transform: scale(1.02);
}
</style>
