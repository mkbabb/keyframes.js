<template>
    <SceneNav :current="currentSceneId" @switch="switchScene" />

    <EditorShell
        :animation-group="currentAnimationGroup"
        :super-key="currentSuperKey"
        :show-start-screen="isHome"
        :auto-play="autoPlayNext"
        @play-state-change="onPlayStateChange"
        @start-state-change="(v: boolean) => { if (sceneRef) sceneRef.isStarted = v; }"
    >
        <template #header-right>
            <component :is="sceneHeaderLeft" v-if="sceneHeaderLeft" />
            <TooltipProvider :delay-duration="300">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <span class="inline-flex">
                            <SharePopover :on-scene-restore="(id: string) => switchScene(id)" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent class="instrument-serif text-base">Share or load animation state</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DarkModeToggle
                title="Toggle dark mode"
                class="aspect-square w-8 hover:scale-105"
            />
        </template>

        <template #header-anchor="{ pinned, toggled }">
            <HoverCard
                v-model:open="hoverCardOpen"
                :open-delay="300"
                :close-delay="200"
            >
                <HoverCardTrigger>
                    <Button
                        :class="[
                            'm-0 cursor-pointer p-0 text-xs lg:text-sm transition-all duration-200 font-mono font-normal',
                            toggled
                                ? 'underline underline-offset-4 text-foreground decoration-2'
                                : pinned
                                    ? 'underline underline-offset-4 text-foreground'
                                    : 'no-underline',
                        ]"
                        variant="link"
                    >@mbabb</Button>
                </HoverCardTrigger>
                <HoverCardContent class="z-[100] p-4 min-w-[17rem] instrument-serif">
                    <div class="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            ></AvatarImage>
                        </Avatar>
                        <div class="flex-1 min-w-0">
                            <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-sm font-semibold text-foreground hover:underline">@mbabb</a>
                            <p class="mt-0.5 text-xs italic text-muted-foreground">CSS keyframe animation engine</p>
                        </div>
                    </div>
                    <hr class="my-2 border-border/50" />
                    <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub &#x1F389;</a>
                </HoverCardContent>
            </HoverCard>
        </template>

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
import { markRaw, nextTick, ref, shallowRef, watch } from "vue";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import { SharePopover } from "@components/custom/editor-shell";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@components/ui/hover-card";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";

import { AnimationGroup } from "@src/animation/group";
import { getStoredAnimationGroupControlOptions, setActiveScene, saveScenePlaybackState, getScenePlaybackState, clearScenePlaybackState, initFromHash } from "@components/custom/animation-controls/animationStores";
import type { ScenePlaybackState } from "@components/custom/animation-controls/animationStores";

// Restore shared state from URL hash before components read stored options
initFromHash();

import CubeScene from "./scenes/CubeScene.vue";
import SceneNav from "./SceneNav.vue";
import { useSceneManager } from "./useSceneManager";
import { HOME_SCENE_ID } from "./scenes";

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
const hoverCardOpen = ref(false);
const autoPlayNext = ref(false);

// Explicit reactive ref for scene-provided slot components.
// shallowRef on sceneRef doesn't track nested property access in templates.
const sceneHeaderLeft = shallowRef<any>(null);

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
        sceneHeaderLeft.value = null;
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
        sceneHeaderLeft.value = sceneRef.value?.headerLeft ?? null;

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
.scene-enter-active,
.scene-leave-active {
    transition: opacity 0.15s ease-out;
}
.scene-enter-from,
.scene-leave-to {
    opacity: 0;
}
</style>
