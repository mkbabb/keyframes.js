<template>
    <div class="flex flex-col gap-3">
        <!-- Zoom mini range bar -->
        <div
            v-if="zoomLevel > 1"
            class="flex items-center gap-2"
        >
            <div class="relative flex-1 h-1.5 rounded-full bg-muted/50 border border-border/30">
                <div
                    class="absolute top-0 h-full rounded-full bg-primary/40"
                    :style="{
                        left: `${(panOffset / 100) * 100}%`,
                        width: `${(100 / zoomLevel / 100) * 100}%`,
                    }"
                ></div>
            </div>
            <span class="text-small text-muted-foreground shrink-0">{{ zoomLevel.toFixed(1) }}x</span>
        </div>

        <!-- Timeline Track -->
        <div
            ref="trackEl"
            :class="[
                'timeline-track relative rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-all duration-fast cursor-pointer select-none overflow-x-clip overflow-y-visible touch-none',
                expanded ? 'h-32' : 'h-12',
            ]"
            @pointerdown="onTrackPointerDown"
            @pointermove="onTrackPointerMove"
            @pointerup="onTrackPointerUp"
            @pointercancel="onTrackPointerUp"
            @wheel.prevent="onWheel"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
        >
            <!-- Tick marks -->
            <div
                v-for="tick in visibleTicks"
                :key="tick"
                class="absolute top-0 h-full border-l border-border/30"
                :style="{ left: `${percentToPosition(tick)}%` }"
            >
                <span
                    :class="[
                        'text-small absolute -top-5 left-0 text-muted-foreground whitespace-nowrap',
                        percentToPosition(tick) <= 2 ? 'translate-x-0' : percentToPosition(tick) >= 98 ? '-translate-x-full' : '-translate-x-1/2',
                    ]"
                >{{ tick }}%</span>
            </div>

            <!-- Playhead -->
            <div
                class="absolute top-0 h-full w-0.5 bg-primary z-content pointer-events-none"
                :style="{ left: `${percentToPosition(scrubT * 100)}%` }"
            ></div>

            <!-- Keyframe markers -->
            <Tooltip v-for="kf in sortedKeyframes" :key="kf.id">
                <TooltipTrigger as-child>
                    <div
                        :class="[
                            'keyframe-marker absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-controls',
                            expanded ? 'w-6 h-6' : 'w-4 h-4',
                            'rotate-45 rounded-sm cursor-grab',
                            'border-2 transition-all',
                            selectedKeyframeId === kf.id
                                ? 'bg-primary border-primary scale-125'
                                : 'bg-background border-foreground/50 hover:border-primary scale-on-hover',
                        ]"
                        :style="{ left: `${percentToPosition(kf.percent)}%` }"
                        @pointerdown.stop="onMarkerPointerDown($event, kf.id)"
                        @mouseenter="emit('diamondHover', kf)"
                    ></div>
                </TooltipTrigger>
                <TooltipContent side="top" :side-offset="8" class="p-2 max-w-56">
                    <TimelineHoverPreview
                        :keyframe="kf"
                        :preview-src="previewCache[kf.id]"
                        :loading="previewLoading[kf.id]"
                        :ghost-style="getGhostStyle(kf.vars)"
                    />
                </TooltipContent>
            </Tooltip>

            <!-- Timeline Carets -->
            <TimelineCaret
                v-for="kf in sortedKeyframes"
                :key="'caret-' + kf.id"
                :keyframe-id="kf.id"
                :percent="kf.percent"
                :position="percentToPosition(kf.percent)"
                :is-selected="selectedKeyframeId === kf.id"
                @update:percent="(p) => emit('moveKeyframe', kf.id, p)"
                @select="emit('select', kf.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui";
import { useZoomPan } from "../composables/useZoomPan";
import TimelineCaret from "../TimelineCaret.vue";
import TimelineHoverPreview from "./TimelineHoverPreview.vue";
import type { TimelineKeyframe } from "../composables/timelineTypes";

const props = defineProps<{
    sortedKeyframes: TimelineKeyframe[];
    scrubT: number;
    expanded?: boolean;
    selectedKeyframeId: string | null;
    previewCache: Record<string, string>;
    previewLoading: Record<string, boolean>;
}>();

const emit = defineEmits<{
    (e: "update:scrubT", value: number): void;
    (e: "moveKeyframe", id: string, percent: number): void;
    (e: "select", id: string): void;
    (e: "diamondHover", kf: TimelineKeyframe): void;
}>();

const trackEl = useTemplateRef<HTMLElement>("trackEl");
const draggingKeyframeId = ref<string | null>(null);

const {
    zoomLevel,
    panOffset,
    percentToPosition,
    positionToPercent,
    visibleTicks,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
} = useZoomPan(trackEl);

const getGhostStyle = (vars: Record<string, string>): Record<string, string> => {
    const style: Record<string, string> = {};
    if (vars["background-color"]) style.backgroundColor = vars["background-color"];
    if (vars["opacity"]) style.opacity = vars["opacity"];
    if (vars["transform"]) style.transform = `scale(0.3) ${vars["transform"]}`;
    if (vars["border-radius"]) style.borderRadius = vars["border-radius"];
    return style;
};

const getPercentFromPointer = (event: PointerEvent): number => {
    if (!trackEl.value) return 0;
    const rect = trackEl.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const posPercent = (x / rect.width) * 100;
    return Math.max(0, Math.min(100, positionToPercent(posPercent)));
};

const onTrackPointerDown = (event: PointerEvent) => {
    const percent = getPercentFromPointer(event);
    emit("update:scrubT", percent / 100);
    (event.target as Element).setPointerCapture(event.pointerId);
};

const onTrackPointerMove = (event: PointerEvent) => {
    if (draggingKeyframeId.value) {
        const percent = getPercentFromPointer(event);
        emit("moveKeyframe", draggingKeyframeId.value, percent);
        return;
    }

    // Only scrub if pointer is captured (button held)
    if (event.buttons > 0 && !draggingKeyframeId.value) {
        const percent = getPercentFromPointer(event);
        emit("update:scrubT", percent / 100);
    }
};

const onTrackPointerUp = () => {
    draggingKeyframeId.value = null;
};

const onMarkerPointerDown = (event: PointerEvent, id: string) => {
    emit("select", id);
    draggingKeyframeId.value = id;
    (event.target as Element).setPointerCapture(event.pointerId);
};
</script>

<style scoped>
.timeline-track {
    margin-top: 1.25rem;
    margin-bottom: 1rem;
}

.keyframe-marker {
    transition:
        transform var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard);
}

.keyframe-marker:active {
    cursor: grabbing;
}
</style>
