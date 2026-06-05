<template>
    <div class="flex flex-col items-center gap-1.5">
        <span class="text-mono-caption font-semibold">{{ Math.round(keyframe.percent) }}%</span>
        <!-- html2canvas capture (non-3D targets) -->
        <img
            v-if="previewSrc"
            :src="previewSrc"
            :alt="`Rendered preview of the keyframe at ${Math.round(keyframe.percent)}%`"
            class="w-36 h-auto rounded border border-border/30"
        />
        <!-- Ghost box preview from CSS vars -->
        <div
            v-else-if="Object.keys(ghostStyle).length > 0"
            class="w-16 h-16 rounded border border-border/30 bg-muted/30"
            :style="ghostStyle"
        ></div>
        <div v-if="loading" class="text-muted-foreground text-admin-label font-mono">
            Capturing...
        </div>
        <div class="font-mono text-admin-label text-muted-foreground max-h-24 overflow-y-auto w-full">
            <div v-for="[prop, val] in Object.entries(keyframe.vars)" :key="prop" class="truncate">
                <span class="text-foreground/70">{{ prop }}</span>: {{ val }}
            </div>
            <div v-if="Object.keys(keyframe.vars).length === 0" class="italic">No properties</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TimelineKeyframe } from "../composables/timelineTypes";

defineProps<{
    keyframe: TimelineKeyframe;
    previewSrc?: string;
    loading?: boolean;
    ghostStyle: Record<string, string>;
}>();
</script>
