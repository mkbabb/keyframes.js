<script setup lang="ts">
import { computed, inject, ref, watch, useTemplateRef } from "vue";
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

import cubeIcon from "@assets/icons/cube-icon-sm.png";
import amigaIcon from "@assets/icons/amiga-icon-sm.png";
import squareIcon from "@assets/icons/square-icon-sm.png";
import easingIcon from "@assets/icons/easing-icon-sm.svg";

const sceneIcons: Record<string, string> = {
    cube: cubeIcon,
    amiga: amigaIcon,
    square: squareIcon,
    easing: easingIcon,
};

const CONTROL_TABS: { value: string; label: string; icon?: string }[] = [
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
    scenes: { id: string; label: string }[];
    homeSceneId: string;
    currentLabel: string;
    hasSelectedAnimation: boolean;
    isControlsPanelOpen: boolean;
    selectedControl?: string;
    extraControlTabs?: { value: string; label: string; icon?: string }[];
}>();

const allControlTabs = computed(() => {
    const tabs = [...CONTROL_TABS];
    if (props.extraControlTabs) tabs.push(...props.extraControlTabs);
    return tabs;
});

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
                            v-if="hasSelectedAnimation"
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

                        <div v-if="hasSelectedAnimation" class="dock-separator"></div>

                        <!-- Controls tab selector -->
                        <Select
                            v-if="hasSelectedAnimation"
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

                        <div v-if="hasSelectedAnimation" class="dock-separator"></div>

                        <!-- Scene selector -->
                        <Select
                            :model-value="currentSceneId"
                            :open="sceneSelectOpen"
                            @update:open="sceneSelectOpen = $event"
                            @update:model-value="(id) => emit('switchScene', String(id))"
                        >
                            <DockSelectTrigger aria-label="Scene" class="dock-label [&>span]:line-clamp-none">
                                <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" :alt="`${currentSceneId} scene`" class="w-5 h-5 shrink-0 object-contain" />
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
                                            <img v-if="sceneIcons[scene.id]" :src="sceneIcons[scene.id]" :alt="`${scene.label} scene`" class="w-5 h-5 shrink-0 object-contain" />
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
                    <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" :alt="`${currentSceneId} scene`" class="w-5 h-5 shrink-0 object-contain" />
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
