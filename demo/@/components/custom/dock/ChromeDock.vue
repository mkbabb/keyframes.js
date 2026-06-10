<script setup lang="ts">
import { computed, inject, ref, watch, useTemplateRef, type Component } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "../animation-controls/injectionKeys";
import { Activity, ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";
import {
    GlassDock,
    DockIconButton,
    DockSelectTrigger,
} from "@mkbabb/glass-ui/dock";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@mkbabb/glass-ui";
import { StatusDot } from "@mkbabb/glass-ui/status-dot";

// H.W5.S1/S2: the dock no longer holds a parallel string-keyed `sceneIcons`
// Record of imported image URLs (the D8 drift root cause). Each scene carries
// its own inline-SVG `icon` component on the descriptor (scenes.ts); the dock
// renders `<component :is="scene.icon">` so the binding is single-sourced and
// every survivor themes via currentColor. <Home> remains the icon for the
// explicit home descriptor ALONE (the single fallback).

// The BUILT-IN editor tab descriptors (label + icon for the {controls,keyframes,
// timeline} triad). The DFA (controlSurfaceDFA.ts) is the AUTHORITY on WHICH of
// these render per scene — `allControlTabs` filters this list against the
// `controlSurfaces` prop (the active scene's valid set). The easing scene's set
// is ['easing'] (a scene-specific surface carried by `extraControlTabs`), so NONE
// of this triad renders for it — NO keyframes/timeline tab node exists there.
const BUILT_IN_CONTROL_TABS: { value: string; label: string; icon?: string }[] = [
    { value: "controls", label: "Controls", icon: "SlidersHorizontal" },
    { value: "keyframes", label: "Keyframes", icon: "Braces" },
    { value: "timeline", label: "Timeline", icon: "Clock" },
];

const TAB_ICONS: Record<string, any> = {
    SlidersHorizontal,
    Braces,
    Clock,
    Grid3X3,
    Activity,
};

const props = defineProps<{
    currentSceneId: string;
    scenes: { id: string; label: string; icon?: Component }[];
    homeSceneId: string;
    currentLabel: string;
    isControlsPanelOpen: boolean;
    selectedControl?: string;
    /** The active scene's valid BUILT-IN editor surfaces (the DFA projection,
     *  H.W11.S4 / I2). The dock renders the {controls,keyframes,timeline} triad
     *  FROM this set — an invalid built-in surface CANNOT render. Defaults to the
     *  full triad when absent (non-App hosts that don't drive the DFA). */
    controlSurfaces?: string[];
    extraControlTabs?: { value: string; label: string; icon?: string }[];
}>();

// The active scene's inline-SVG glyph for the trigger + collapsed pill; the
// home descriptor (and any not-yet-resolved id) has no icon → <Home> fallback.
const currentIcon = computed<Component | undefined>(
    () => props.scenes.find((s) => s.id === props.currentSceneId)?.icon,
);

// The effective control-tab set the dock renders = the DFA-VALID built-in triad
// for the active scene + the machine-PROJECTED `extraControlTabs` (the
// scene-specific surfaces' tab metadata: easing→Easing, spring→Spring,
// cube→Matrix Controls — derived from `activeScene` through the DFA's tab table
// in the App, J.W0.S3, so the trigger label settles synchronously with the
// route, never a tick late on the destination scene's mount).
// When `controlSurfaces` is absent (a non-App host that doesn't drive the DFA)
// the full built-in triad is the conservative default — total, never undefined.
const allControlTabs = computed(() => {
    const valid = props.controlSurfaces;
    const builtIn = valid
        ? BUILT_IN_CONTROL_TABS.filter((t) => valid.includes(t.value))
        : [...BUILT_IN_CONTROL_TABS];
    return props.extraControlTabs ? [...builtIn, ...props.extraControlTabs] : builtIn;
});

// The control-panel affordances (the collapse toggle + the tab selector) appear
// ONLY when the scene has at least one control surface to show (the DFA set is
// non-empty). For home/sequence/motion-path the DFA set is [] — so NO control
// affordance renders, which is the DFA-driven supersession of those scenes'
// former `isControlsPanelOpen = false` poke-sets (one authority for "this scene
// has no panel", not a per-scene imperative write). J.W0.S3: the former
// `hasSelectedAnimation` AND-clause is DEAD — it keyed the affordance on a
// per-superKey stored fact seeded only at SCENE_READY (post-mount), so on a
// cross-scene nav the trigger VANISHED for the mount window (clause (b)'s
// forbidden `null`). The DFA projection is born-correct on the rest tick; the
// affordance presence now settles synchronously with the route.
const hasControlPanel = computed(() => allControlTabs.value.length > 0);

const isMobile = useMediaQuery("(max-width: 1023px)");

const emit = defineEmits<{
    (e: "switchScene", id: string): void;
    (e: "warmScene", id: string): void;
    (e: "toggleControlsPanel"): void;
    (e: "updateSelectedControl", value: string): void;
}>();

// ── Dock ref + controls pane hover sync ──
const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");
const controlsPaneHover = inject(CONTROLS_PANE_HOVER_KEY, null);

watch(() => dockRef.value?.expanded, (isExpanded) => {
    if (controlsPaneHover) controlsPaneHover.value = !!isExpanded;
});

// ── Popup mutex: only one dropdown at a time ──
type PopupKey = "scene" | "controls";
const openPopup = ref<PopupKey | null>(null);
const isAnyOpen = computed(() => openPopup.value !== null);
function popupModel(key: PopupKey) {
    return computed({
        get: () => openPopup.value === key,
        set: (open: boolean) => {
            if (open) {
                openPopup.value = key;
            } else if (openPopup.value === key) {
                openPopup.value = null;
            }
        },
    });
}
const sceneSelectOpen = popupModel("scene");
const controlsSelectOpen = popupModel("controls");

watch(isAnyOpen, (open) => {
    if (open) dockRef.value?.keepOpen();
    else dockRef.value?.release();
});
</script>

<template>
    <div
        class="fixed left-1/2 -translate-x-1/2 z-dock flex items-center justify-center pointer-events-none"
        style="top: calc(max(var(--work-area-top-offset, 0px), env(safe-area-inset-top, 0px)) + var(--dock-margin) / 4);"
    >
        <div class="pointer-events-auto">
            <!-- G.W12.S2: the :always-expanded="isMobile" occlusion-dodge mask is
                 REMOVED — glass-ui's rebuilt 3.3.0 dock owns the no-occlusion
                 contract; the occlusion gate re-runs mask-free as the lock. The
                 dead single-layer DockLayerGroup/DockLayer costume is collapsed —
                 the items mount directly in the GlassDock default slot. -->
            <GlassDock ref="dockRef" :collapse-delay="2500" :start-collapsed="true" :fit-content="true">
                <div class="flex items-center gap-2">
                        <!-- Controls collapse -->
                        <DockIconButton
                            v-if="hasControlPanel"
                            :title="isControlsPanelOpen ? 'Close controls' : 'Open controls'"
                            @click="emit('toggleControlsPanel')"
                        >
                            <template v-if="isMobile">
                                <ChevronUp v-if="isControlsPanelOpen" class="icon-lg" />
                                <ChevronDown v-else class="icon-lg" />
                            </template>
                            <template v-else>
                                <PanelLeftClose v-if="isControlsPanelOpen" class="icon-lg" />
                                <PanelLeftOpen v-else class="icon-lg" />
                            </template>
                        </DockIconButton>

                        <div v-if="hasControlPanel" class="dock-separator"></div>

                        <!-- Controls tab selector -->
                        <Select
                            v-if="hasControlPanel"
                            :model-value="selectedControl ?? 'controls'"
                            :open="controlsSelectOpen"
                            @update:open="controlsSelectOpen = $event"
                            @update:model-value="(v) => emit('updateSelectedControl', String(v))"
                        >
                            <DockSelectTrigger aria-label="Controls tab" class="dock-label [&>span]:line-clamp-none">
                                <component :is="TAB_ICONS[allControlTabs.find(t => t.value === selectedControl)?.icon ?? 'SlidersHorizontal']" class="icon-md text-muted-foreground" />
                                <SelectValue />
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                <SelectGroup class="dock-label">
                                    <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value" class="py-2 px-3" hide-indicator>
                                        <span class="flex items-center gap-2">
                                            <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="icon-md text-muted-foreground" />
                                            <StatusDot :variant="selectedControl === tab.value ? 'active' : 'idle'" />
                                            <span :class="selectedControl === tab.value ? 'font-bold' : ''">{{ tab.label }}</span>
                                        </span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div v-if="hasControlPanel" class="dock-separator"></div>

                        <!-- Scene selector -->
                        <Select
                            :model-value="currentSceneId"
                            :open="sceneSelectOpen"
                            @update:open="sceneSelectOpen = $event"
                            @update:model-value="(id) => emit('switchScene', String(id))"
                        >
                            <DockSelectTrigger aria-label="Scene" class="dock-label [&>span]:line-clamp-none">
                                <component v-if="currentIcon" :is="currentIcon" class="icon-sm shrink-0 text-muted-foreground" />
                                <Home v-else class="icon-sm text-muted-foreground" />
                                <SelectValue />
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                <SelectGroup class="dock-label">
                                    <SelectItem :value="homeSceneId" class="py-2 px-3" hide-indicator>
                                        <span class="flex items-center gap-2">
                                            <StatusDot :variant="currentSceneId === homeSceneId ? 'active' : 'idle'" />
                                            <Home class="icon-sm text-muted-foreground" />
                                            <span :class="currentSceneId === homeSceneId ? 'font-bold' : ''">Home</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        v-for="scene in scenes"
                                        :key="scene.id"
                                        :value="scene.id"
                                        class="py-2 px-3"
                                        hide-indicator
                                        @pointerenter="emit('warmScene', scene.id)"
                                    >
                                        <span class="flex items-center gap-2">
                                            <StatusDot :variant="currentSceneId === scene.id ? 'active' : 'idle'" />
                                            <component v-if="scene.icon" :is="scene.icon" class="icon-sm shrink-0 text-muted-foreground" />
                                            <span :class="currentSceneId === scene.id ? 'font-bold' : ''">{{ scene.label }}</span>
                                        </span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div class="dock-separator"></div>

                        <!-- Header items slot -->
                        <slot name="items" />
                </div>

                <!-- Collapsed state -->
                <template #collapsed>
                    <component v-if="currentIcon" :is="currentIcon" class="icon-sm shrink-0 text-muted-foreground" />
                    <Home v-else class="icon-sm text-muted-foreground" />
                    <span class="dock-label font-semibold text-foreground whitespace-nowrap">
                        {{ currentLabel }}
                    </span>
                    <ChevronDown class="icon-xs text-muted-foreground" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>
