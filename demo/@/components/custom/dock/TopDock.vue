<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { GlassDock } from ".";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import cubeIcon from "@assets/icons/cube-icon-sm.png";
import amigaIcon from "@assets/icons/amiga-icon-sm.png";
import squareIcon from "@assets/icons/square-icon-sm.png";

const sceneIcons: Record<string, string> = {
    cube: cubeIcon,
    amiga: amigaIcon,
    square: squareIcon,
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
</script>

<template>
    <div
        class="fixed left-1/2 -translate-x-1/2 z-[var(--z-dock)] flex items-center justify-center pointer-events-none"
        style="top: calc(var(--work-area-top-offset, 0px) + var(--dock-margin) / 2);"
    >
        <div class="pointer-events-auto">
            <GlassDock :collapse-delay="2500" :start-collapsed="true" :fit-content="true">
                <!-- Expanded state -->
                <div class="flex items-center gap-2">
                    <!-- Controls collapse -->
                    <button
                        v-if="hasSelectedAnimation"
                        class="dock-icon-btn"
                        @click="emit('toggleControlsPanel')"
                    >
                        <template v-if="isMobile">
                            <ChevronUp v-if="isControlsPanelOpen" class="w-5 h-5" />
                            <ChevronDown v-else class="w-5 h-5" />
                        </template>
                        <template v-else>
                            <PanelLeftClose v-if="isControlsPanelOpen" class="w-5 h-5" />
                            <PanelLeftOpen v-else class="w-5 h-5" />
                        </template>
                    </button>

                    <div v-if="hasSelectedAnimation" class="dock-separator"></div>

                    <!-- Controls tab selector -->
                    <Select
                        v-if="hasSelectedAnimation"
                        :model-value="selectedControl ?? 'controls'"
                        @update:model-value="(v) => emit('updateSelectedControl', String(v))"
                    >
                        <SelectTrigger class="dock-select-trigger border-none h-auto focus:ring-0 bg-transparent instrument-serif text-lg gap-1 w-auto [&>span]:line-clamp-none [&>svg:last-child]:w-3 [&>svg:last-child]:h-3">
                            <component :is="TAB_ICONS[allControlTabs.find(t => t.value === selectedControl)?.icon ?? 'SlidersHorizontal']" class="w-4 h-4 shrink-0 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent class="min-w-[12rem]">
                            <SelectGroup class="instrument-serif text-xl">
                                <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value" class="py-2 px-3" hide-indicator>
                                    <span class="flex items-center gap-2">
                                        <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="w-4 h-4 shrink-0 text-muted-foreground" />
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
                        @update:model-value="(id) => emit('switchScene', String(id))"
                    >
                        <SelectTrigger class="dock-select-trigger border-none h-auto focus:ring-0 bg-transparent instrument-serif text-lg gap-1 w-auto [&>span]:line-clamp-none [&>svg:last-child]:w-3 [&>svg:last-child]:h-3">
                            <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-5 h-5 shrink-0 object-contain" />
                            <Home v-else class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent class="min-w-[12rem]">
                            <SelectGroup class="instrument-serif text-xl">
                                <SelectItem :value="homeSceneId" class="py-2 px-3" hide-indicator>
                                    <span class="flex items-center gap-2">
                                        <span :class="['status-dot', currentSceneId === homeSceneId ? 'status-dot--active' : 'status-dot--idle']"></span>
                                        <Home class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
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

                <!-- Collapsed state -->
                <template #collapsed>
                    <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-5 h-5 shrink-0 object-contain" />
                    <Home v-else class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span class="text-lg instrument-serif font-semibold text-foreground whitespace-nowrap">
                        {{ currentLabel }}
                    </span>
                    <ChevronDown class="w-3 h-3 text-muted-foreground shrink-0" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>
