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
            <!-- @mbabb dropdown -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <DockDropdownTrigger aria-label="@mbabb menu" class="text-xs lg:text-sm font-mono">@mbabb</DockDropdownTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" :side-offset="8" class="z-modal min-w-[17rem] text-body p-1.5">
                    <!-- Share -->
                    <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                        <SharePopover :on-scene-restore="(id: string) => switchScene(id)" />
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
                            <span class="text-small text-[var(--ppmycota-primary)]">ppmycota</span>
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
                            <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-xs font-semibold text-foreground hover:underline">@mbabb</a>
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
                 async chunk and shows #fallback while it loads.

                 NO <KeepAlive>, NO wrapping <Transition>: both broke async
                 scene loading outright — a `<Transition mode="out-in">` /
                 `<KeepAlive>` around a keyed `<Suspense>` whose child is a
                 `defineAsyncComponent` never triggered the async loader, so
                 amiga / square / easing / spring shipped a BLANK viewport on
                 every load (the chunk was never even requested — B.W3's
                 headline blocker). The lazy boundary survives on the
                 `<Suspense>` alone (each scene's chunk + its heavy deps —
                 three, monaco — stay code-split); the browser module cache
                 covers revisits, so dropping KeepAlive costs only a cheap
                 scene re-setup, not a re-download.

                 The scene-swap fade is RESTORED by dogfooding the engine, not
                 by re-adding the `<Transition>` B removed for cause: a
                 `SpringProgress` (the canonical iOS "smooth" preset, no
                 overshoot) drives `sceneSwapStyle` on this SIBLING wrapper
                 <div> — a plain reactive style binding, NOT a `<Transition>`
                 around the `<Suspense>`. The async loader stays on the BARE
                 `<Suspense>` below, untouched, so the async-load re-break
                 cannot recur. On `activeSceneKey` change the spring re-seats
                 0→1, fading the new scene in over the previous paint (a
                 cross-dissolve, never a blank gap). Built with
                 `respectReducedMotion: true`, so under prefers-reduced-motion
                 the spring snaps to terminal in one emit — an instant clean
                 swap, the engine's own reduced-motion authority. -->
            <div class="h-full w-full" :style="sceneSwapStyle">
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
import { computed, markRaw, nextTick, provide, ref, shallowRef, watch } from "vue";
import { CONTROLS_PANE_HOVER_KEY, TABS_EXTERNALLY_MANAGED_KEY } from "@components/custom/animation-controls/injectionKeys";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import { SharePopover } from "@components/custom/editor-shell";
import {
    Avatar,
    AvatarImage,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { DockDropdownTrigger } from "@mkbabb/glass-ui/dock";
import { TopDock } from "@components/custom/dock";

import { AnimationGroup } from "@src/animation/group";
import { SpringProgress } from "@src/animation/spring";
import { getStoredAnimationGroupControlOptions, saveScenePlaybackState, getScenePlaybackState, clearScenePlaybackState } from "@components/custom/animation-controls/stores";
import type { ScenePlaybackState } from "@components/custom/animation-controls/stores";

// Tabs in the controls pane are managed via the TopDock controls tab dropdown
provide(TABS_EXTERNALLY_MANAGED_KEY, true);

// Dock hover → controls pane opacity. Provided here so both TopDock (sibling)
// and AnimationMenuBar (descendant of EditorShell) share the same ref.
const dockHoveredRef = ref(false);
provide(CONTROLS_PANE_HOVER_KEY, dockHoveredRef);

import CubeScene from "./scenes/CubeScene.vue";
import { useSceneRouter } from "./useSceneRouter";
import { useSceneUrl } from "./useSceneUrl";
import { sceneMap, HOME_SCENE_ID } from "./scenes";

const { currentSceneId, currentScene, isHome, ready, scenes, switchScene: rawSwitchScene } = useSceneRouter();

const sceneRef = shallowRef<any>(null);

// Start with an empty AnimationGroup. Use the scene's actual superKey from the
// start so ACG mounts with the correct key — avoids an unnecessary remount cycle
// (double-mount) on initial page load that causes visual clipping.
const currentAnimationGroup = shallowRef<AnimationGroup<any>>(markRaw(new AnimationGroup()));
const currentSuperKey = shallowRef<string>(currentScene.value.superKey);
const autoPlayNext = ref(false);

// Bidirectional ?anim= query param sync
useSceneUrl(currentSuperKey);

const currentLabel = computed(
    () => sceneMap.get(currentSceneId.value)?.label ?? "Home",
);

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

// Engine-driven scene-swap fade. The keyed <Suspense> hard-cuts the scene;
// this SpringProgress dogfoods the engine to fade the new scene in over the
// previous paint (cross-dissolve, no blank gap) via a sibling style binding —
// NOT a <Transition> wrapper (which re-broke the async loader, B.W3). The
// default options ARE the iOS "smooth" preset (response 0.5, dampingFraction
// 0.86 — no overshoot, a calm enter); `respectReducedMotion: true` makes the
// spring snap to terminal in one emit under prefers-reduced-motion.
const sceneOpacity = ref(1);
const sceneSwapStyle = computed(() => ({
    opacity: sceneOpacity.value,
    // lerp(0.97, 1, v): subtle scale-up as the scene settles in.
    transform: `scale(${0.97 + 0.03 * sceneOpacity.value})`,
}));
const sceneSwapSpring = new SpringProgress({ respectReducedMotion: true });
watch(activeSceneKey, () => {
    sceneSwapSpring.reset(0);
    sceneSwapSpring.play((v) => { sceneOpacity.value = v; });
    sceneSwapSpring.target = 1;
});

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
        switchScene("cube");
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
        // Resume from the restored paused state: unpauses children and
        // restarts the rAF draw loop.
        group.resume();
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
        } else {
            // Pick the first animation when none is selected yet.
            if (!controls.selectedAnimation) {
                const names = Object.keys(group.animations);
                if (names.length > 0) controls.selectedAnimation = names[0]!;
            }
            // Controls panel is open by default whenever a non-home scene
            // mounts (e.g. page reload, direct deep link). User can close
            // it during a session; it reopens on the next scene mount.
            if (window.innerWidth >= 1024) {
                controls.isControlsPanelOpen = true;
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
