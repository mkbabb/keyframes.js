<template>
    <div
        class="scene-nav fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div
            :class="[
                'scene-nav-shell pointer-events-auto relative flex items-center',
                'rounded-xl border border-white/20 shadow-lg',
                'bg-white/60 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150',
                'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                isExpanded
                    ? 'px-2 py-1.5 gap-1'
                    : 'px-3 py-1 gap-1.5 h-6 cursor-pointer',
            ]"
            @click="!isExpanded && toggleExpanded()"
        >
            <!-- Collapsed: trigger label -->
            <template v-if="!isExpanded">
                <Layers class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span class="text-sm instrument-serif font-semibold text-foreground whitespace-nowrap">
                    {{ currentLabel }}
                </span>
                <ChevronDown class="w-3 h-3 text-muted-foreground shrink-0" />
            </template>

            <!-- Expanded: home + separator + scene pills -->
            <template v-else>
                <div class="flex items-center gap-0.5 overflow-x-auto max-w-[80vw] scrollbar-none">
                    <!-- Home button -->
                    <button
                        @click="onSelect(HOME_SCENE_ID)"
                        :class="[
                            'whitespace-nowrap px-3.5 py-1.5 text-base instrument-serif cursor-pointer rounded-lg transition-all duration-150 shrink-0',
                            current === HOME_SCENE_ID
                                ? 'bg-foreground/10 text-foreground font-semibold shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
                        ]"
                    >
                        <Home class="w-4 h-4" />
                    </button>

                    <!-- Vertical separator -->
                    <div class="w-px h-5 bg-border/60 mx-1 shrink-0"></div>

                    <!-- Scene pills -->
                    <button
                        v-for="scene in scenes"
                        :key="scene.id"
                        @click="onSelect(scene.id)"
                        :class="[
                            'whitespace-nowrap px-3.5 py-1.5 text-base instrument-serif cursor-pointer rounded-lg transition-all duration-150 shrink-0',
                            scene.id === current
                                ? 'bg-foreground/10 text-foreground font-semibold shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
                        ]"
                    >
                        {{ scene.label }}
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronDown, Home, Layers } from "lucide-vue-next";
import { scenes, sceneMap, HOME_SCENE_ID } from "./scenes";

const props = defineProps<{
    current: string;
}>();

const emit = defineEmits<{
    (e: "switch", id: string): void;
}>();

const isExpanded = ref(false);
let hideTimeout: ReturnType<typeof setTimeout> | undefined;

const currentLabel = computed(
    () => sceneMap.get(props.current)?.label ?? "Home",
);

function clearHideTimeout() {
    if (hideTimeout != null) {
        clearTimeout(hideTimeout);
        hideTimeout = undefined;
    }
}

function toggleExpanded() {
    isExpanded.value = !isExpanded.value;
    clearHideTimeout();
}

function onMouseEnter() {
    clearHideTimeout();
    isExpanded.value = true;
}

function onMouseLeave() {
    clearHideTimeout();
    hideTimeout = setTimeout(() => {
        isExpanded.value = false;
    }, 2500);
}

function onSelect(id: string) {
    emit("switch", id);
    clearHideTimeout();
    hideTimeout = setTimeout(() => {
        isExpanded.value = false;
    }, 3000);
}
</script>

<style scoped>
.scene-nav-shell {
    transition:
        padding 0.5s cubic-bezier(0.4, 1.1, 0.6, 1),
        gap 0.5s cubic-bezier(0.4, 1.1, 0.6, 1),
        box-shadow 0.3s ease;
}

.scrollbar-none {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
</style>
