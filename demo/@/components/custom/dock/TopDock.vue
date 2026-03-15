<script setup lang="ts">
import { inject, ref } from "vue";
import { ChevronDown, Home, PanelLeftClose, PanelLeftOpen } from "lucide-vue-next";
import { GlassDock } from ".";
import { DockPopover } from ".";
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

const props = defineProps<{
    currentSceneId: string;
    scenes: { id: string; label: string }[];
    homeSceneId: string;
    currentLabel: string;
    hasSelectedAnimation: boolean;
    isControlsPanelOpen: boolean;
}>();

const emit = defineEmits<{
    (e: "switchScene", id: string): void;
    (e: "toggleControlsPanel"): void;
}>();

// Hold parent dock open while Select dropdown is open
const dockKeepOpen = inject<(() => void) | null>("dockKeepOpen", null);
const dockRelease = inject<(() => void) | null>("dockRelease", null);

function onSelectOpenChange(open: boolean) {
    if (open) dockKeepOpen?.();
    else dockRelease?.();
}
</script>

<template>
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none">
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
                        <PanelLeftClose v-if="isControlsPanelOpen" class="w-4 h-4" />
                        <PanelLeftOpen v-else class="w-4 h-4" />
                    </button>

                    <div v-if="hasSelectedAnimation" class="dock-separator"></div>

                    <!-- Scene selector -->
                    <div class="flex items-center gap-0.5">
                        <Select
                            :model-value="currentSceneId"
                            @update:model-value="(id) => emit('switchScene', String(id))"
                            @update:open="onSelectOpenChange"
                        >
                            <SelectTrigger class="border-none h-auto p-0 px-1 focus:ring-0 bg-transparent instrument-serif text-base gap-1.5">
                                <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-4 h-4 shrink-0 object-contain" />
                                <Home v-else class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="instrument-serif text-base">
                                    <SelectItem :value="homeSceneId">
                                        <span class="flex items-center gap-2">
                                            <span :class="['inline-block w-2 h-2 rounded-full shrink-0', currentSceneId === homeSceneId ? 'bg-green-500' : 'bg-gray-400']"></span>
                                            <Home class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                            <span :class="currentSceneId === homeSceneId ? 'font-bold' : ''">Home</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        v-for="scene in scenes"
                                        :key="scene.id"
                                        :value="scene.id"
                                    >
                                        <span class="flex items-center gap-2">
                                            <span :class="['inline-block w-2 h-2 rounded-full shrink-0', currentSceneId === scene.id ? 'bg-green-500' : 'bg-gray-400']"></span>
                                            <img v-if="sceneIcons[scene.id]" :src="sceneIcons[scene.id]" class="w-4 h-4 shrink-0 object-contain" />
                                            <span :class="currentSceneId === scene.id ? 'font-bold' : ''">{{ scene.label }}</span>
                                        </span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="dock-separator mr-1"></div>

                    <!-- Header items slot -->
                    <slot name="items" />
                </div>

                <!-- Collapsed state -->
                <template #collapsed>
                    <img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" class="w-4 h-4 shrink-0 object-contain" />
                    <Home v-else class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span class="text-base instrument-serif font-semibold text-foreground whitespace-nowrap">
                        {{ currentLabel }}
                    </span>
                    <ChevronDown class="w-3 h-3 text-muted-foreground shrink-0" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>
