<script setup lang="ts">
import { computed, inject, watch, useTemplateRef } from "vue";
import type { Ref } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "../animation-controls/injectionKeys";
import { Activity, ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { GlassDock, DockLayerGroup } from ".";
import { usePopupMutex } from "@mkbabb/glass-ui";
import {
    DockIconButton,
    DockSelectTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@mkbabb/glass-ui";

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
const dockEl = computed(() => (dockRef.value?.$el as HTMLElement) ?? null);
const { isAnyOpen, popupModel } = usePopupMutex<"scene" | "controls">({ rootEl: dockEl });
const sceneSelectOpen = popupModel("scene");
const controlsSelectOpen = popupModel("controls");

watch(isAnyOpen, (open) => {
    if (open) dockRef.value?.keepOpen();
    else dockRef.value?.release();
});

// ── Multi-layer: main navigation + extensibility for future layers ──
const activeLayer = computed(() => {
    return "main";
});
</script>

<template>
    <div
        class="fixed left-1/2 -translate-x-1/2 z-dock flex items-center justify-center pointer-events-none"
        style="top: calc(var(--work-area-top-offset, 0px) + var(--dock-margin) / 4);"
    >
        <div class="pointer-events-auto">
            <GlassDock ref="dockRef" :collapse-delay="2500" :start-collapsed="true" :fit-content="true" :always-expanded="isMobile">
                <DockLayerGroup :active-layer="activeLayer" v-slot="{ layerProps }">
                    <!-- Main navigation layer -->
                    <div v-bind="layerProps('main')" class="flex items-center gap-2">
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
                            <DockSelectTrigger aria-label="Controls tab" class="instrument-serif text-lg [&>span]:line-clamp-none">
                                <component :is="TAB_ICONS[allControlTabs.find(t => t.value === selectedControl)?.icon ?? 'SlidersHorizontal']" class="icon-md text-muted-foreground" />
                                <SelectValue />
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[12rem]">
                                <SelectGroup class="instrument-serif text-xl">
                                    <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value" class="py-2 px-3" hide-indicator>
                                        <span class="flex items-center gap-2">
                                            <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="icon-md text-muted-foreground" />
                                            <span :class="['status-dot', selectedControl === tab.value ? 'status-dot--active' : 'status-dot--idle']"></span>
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
                            <DockSelectTrigger aria-label="Scene" class="instrument-serif text-lg [&>span]:line-clamp-none">
                                <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-5 h-5 shrink-0 object-contain" />
                                <Home v-else class="icon-sm text-muted-foreground" />
                                <SelectValue />
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[12rem]">
                                <SelectGroup class="instrument-serif text-xl">
                                    <SelectItem :value="homeSceneId" class="py-2 px-3" hide-indicator>
                                        <span class="flex items-center gap-2">
                                            <span :class="['status-dot', currentSceneId === homeSceneId ? 'status-dot--active' : 'status-dot--idle']"></span>
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
                                    >
                                        <span class="flex items-center gap-2">
                                            <span :class="['status-dot', currentSceneId === scene.id ? 'status-dot--active' : 'status-dot--idle']"></span>
                                            <img v-if="sceneIcons[scene.id]" :src="sceneIcons[scene.id]" class="w-5 h-5 shrink-0 object-contain" />
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
                </DockLayerGroup>

                <!-- Collapsed state -->
                <template #collapsed>
                    <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-5 h-5 shrink-0 object-contain" />
                    <Home v-else class="icon-sm text-muted-foreground" />
                    <span class="text-lg instrument-serif font-semibold text-foreground whitespace-nowrap">
                        {{ currentLabel }}
                    </span>
                    <ChevronDown class="icon-xs text-muted-foreground" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>
