<template>
    <div class="flex flex-col gap-3">
    <Card :class="['w-full overflow-visible transition-all duration-[var(--duration-fast)]', props.expanded ? 'border-0 shadow-none bg-transparent' : '']">
        <CardContent :class="['relative flex flex-col gap-3', props.expanded ? 'p-2 px-0' : 'p-4']">
        <!-- Pane action buttons -->
        <div class="flex items-center justify-end gap-1">
            <IconTooltip text="Clear all keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    aria-label="Clear all keyframes"
                    @click="clear()"
                >
                    <Trash class="w-3.5 h-3.5" />
                </Button>
            </IconTooltip>
            <IconTooltip :text="props.expanded ? 'Collapse timeline' : 'Expand timeline'">
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    :aria-label="props.expanded ? 'Collapse timeline' : 'Expand timeline'"
                    @click="emit('toggleExpand')"
                >
                    <component :is="props.expanded ? Minimize2 : Maximize2" class="w-3.5 h-3.5" />
                </Button>
            </IconTooltip>
        </div>

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
            <span class="instrument-serif text-sm text-muted-foreground shrink-0">{{ zoomLevel.toFixed(1) }}x</span>
        </div>

        <!-- Timeline Track -->
        <div
            ref="trackEl"
            :class="[
                'timeline-track relative rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-all duration-[var(--duration-fast)] cursor-pointer select-none overflow-x-clip overflow-y-visible touch-none',
                props.expanded ? 'h-32' : 'h-12',
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
                        'instrument-serif absolute -top-5 left-0 text-sm text-muted-foreground whitespace-nowrap',
                        percentToPosition(tick) <= 2 ? 'translate-x-0' : percentToPosition(tick) >= 98 ? '-translate-x-full' : '-translate-x-1/2',
                    ]"
                >{{ tick }}%</span>
            </div>

            <!-- Playhead -->
            <div
                class="absolute top-0 h-full w-0.5 bg-primary z-10 pointer-events-none"
                :style="{ left: `${percentToPosition(scrubT * 100)}%` }"
            ></div>

            <!-- Keyframe markers -->
            <Tooltip v-for="kf in sortedKeyframes" :key="kf.id">
                <TooltipTrigger as-child>
                    <div
                        :class="[
                            'keyframe-marker absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
                            props.expanded ? 'w-6 h-6' : 'w-4 h-4',
                            'rotate-45 rounded-sm cursor-grab',
                            'border-2 transition-all',
                            selectedKeyframeId === kf.id
                                ? 'bg-primary border-primary scale-125'
                                : 'bg-background border-foreground/50 hover:border-primary hover:scale-105',
                        ]"
                        :style="{ left: `${percentToPosition(kf.percent)}%` }"
                        @pointerdown.stop="onMarkerPointerDown($event, kf.id)"
                        @mouseenter="onDiamondHover(kf)"
                    ></div>
                </TooltipTrigger>
                <TooltipContent side="top" :side-offset="8" class="p-2 max-w-56">
                    <div class="flex flex-col items-center gap-1.5">
                        <span class="fira-code text-xs font-semibold">{{ Math.round(kf.percent) }}%</span>
                        <!-- html2canvas capture (non-3D targets) -->
                        <img
                            v-if="previewCache[kf.id]"
                            :src="previewCache[kf.id]"
                            class="w-36 h-auto rounded border border-border/30"
                        />
                        <!-- Ghost box preview from CSS vars -->
                        <div
                            v-else-if="Object.keys(getGhostStyle(kf.vars)).length > 0"
                            class="w-16 h-16 rounded border border-border/30 bg-muted/30"
                            :style="getGhostStyle(kf.vars)"
                        ></div>
                        <div v-if="previewLoading[kf.id]" class="text-muted-foreground text-2xs fira-code">
                            Capturing...
                        </div>
                        <div class="fira-code text-2xs text-muted-foreground max-h-24 overflow-y-auto w-full">
                            <div v-for="[prop, val] in Object.entries(kf.vars)" :key="prop" class="truncate">
                                <span class="text-foreground/70">{{ prop }}</span>: {{ val }}
                            </div>
                            <div v-if="Object.keys(kf.vars).length === 0" class="italic">No properties</div>
                        </div>
                    </div>
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
                @update:percent="(p) => moveKeyframe(kf.id, p)"
                @select="selectedKeyframeId = kf.id"
            />
        </div>
        <!-- Selected Keyframe Editor (inline) -->
        <Transition name="kf-editor">
            <div v-if="selectedKeyframe" class="flex flex-col gap-3">
                <Separator />

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="fira-code text-sm font-semibold"
                            >{{ Math.round(selectedKeyframe.percent) }}%</span
                        >
                        <Input
                            v-model="selectedKeyframe.label"
                            placeholder="Label..."
                            class="fira-code text-xs h-6 w-32"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        class="h-6 w-6 p-0"
                        aria-label="Remove keyframe"
                        @click="removeKeyframe(selectedKeyframeId!)"
                    >
                        <X class="w-3 h-3" />
                    </Button>
                </div>

                <CSSCodeEditor
                    :model-value="selectedKeyframeCSS"
                    height="250px"
                    @update:model-value="onKeyframeCSSChange"
                />
            </div>
        </Transition>

        </CardContent>
    </Card>

    <!-- Import dialog -->
        <CSSPasteDialog
            v-model:open="importDialogOpen"
            title="Import CSS @keyframes"
            description="Paste CSS @keyframes to load into the timeline"
            button-label="Import"
            :button-icon="Download"
            @submit="doImport"
        />

        <!-- Add CSS dialog -->
        <CSSPasteDialog
            v-model:open="addCSSDialogOpen"
            title="Add CSS @keyframes"
            description="Paste CSS @keyframes to merge into the timeline"
            button-label="Add"
            :button-icon="FilePlus2"
            @submit="doAddCSS"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef } from "vue";
import type { Ref } from "vue";
import {
    Download,
    Maximize2,
    Minimize2,
    FilePlus2,
    Trash,
    X,
} from "lucide-vue-next";
import CSSPasteDialog from "@components/custom/CSSPasteDialog.vue";
import {
    IconTooltip,
    Button,
    Card,
    CardContent,
    Input,
    Separator,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui";
import CSSCodeEditor from "../keyframes/CSSCodeEditor.vue";
import { useTimeline } from "./composables/useTimeline";
import { useZoomPan } from "./composables/useZoomPan";
import TimelineCaret from "./TimelineCaret.vue";
import type { InputAnimationOptions } from "@src/animation/constants";

const props = defineProps<{
    targets: HTMLElement[];
    animationOptions?: InputAnimationOptions;
    expanded?: boolean;
}>();

const emit = defineEmits<{
    (e: "toggleExpand"): void;
}>();

const targetsRef = computed(() => props.targets) as unknown as Ref<HTMLElement[]>;
const optionsRef = props.animationOptions
    ? (computed(() => props.animationOptions!) as unknown as Ref<InputAnimationOptions>)
    : undefined;

const {
    state,
    sortedKeyframes,
    scrubT,
    snapshot,
    removeKeyframe,
    moveKeyframe,
    updateKeyframeProperty,
    rebuild,
    scrubAndCapture,
    exportCSS,
    importCSS,
    clear,
} = useTimeline(targetsRef, optionsRef);

const trackEl = useTemplateRef<HTMLElement>("trackEl");
const selectedKeyframeId = ref<string | null>(null);
const draggingKeyframeId = ref<string | null>(null);
const importDialogOpen = ref(false);
const addCSSDialogOpen = ref(false);

// --- Preview cache for diamond hover ---
import type { TimelineKeyframe } from "./composables/timelineTypes";

const previewCache = reactive<Record<string, string>>({});
const previewLoading = reactive<Record<string, boolean>>({});

const getGhostStyle = (vars: Record<string, string>): Record<string, string> => {
    const style: Record<string, string> = {};
    if (vars["background-color"]) style.backgroundColor = vars["background-color"];
    if (vars["opacity"]) style.opacity = vars["opacity"];
    if (vars["transform"]) style.transform = `scale(0.3) ${vars["transform"]}`;
    if (vars["border-radius"]) style.borderRadius = vars["border-radius"];
    return style;
};

const onDiamondHover = async (kf: TimelineKeyframe) => {
    if (previewCache[kf.id] || previewLoading[kf.id]) return;
    previewLoading[kf.id] = true;
    try {
        const canvas = await scrubAndCapture(kf.percent);
        if (canvas) {
            previewCache[kf.id] = canvas.toDataURL("image/png");
        }
    } catch {
        // Capture failed (no animation, 3D not supported, etc.) — ghost preview shown as fallback
    } finally {
        previewLoading[kf.id] = false;
    }
};

// --- Zoom/Pan state ---
const {
    zoomLevel,
    panOffset,
    percentToPosition,
    positionToPercent,
    clampPan,
    visibleTicks,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
} = useZoomPan(trackEl);

const selectedKeyframe = computed(() =>
    state.value.keyframes.find((kf) => kf.id === selectedKeyframeId.value),
);

const selectedKeyframeCSS = computed(() => {
    if (!selectedKeyframe.value) return "";
    return Object.entries(selectedKeyframe.value.vars)
        .map(([prop, value]) => `${prop}: ${value};`)
        .join("\n");
});

const onKeyframeCSSChange = (css: string) => {
    if (!selectedKeyframeId.value) return;
    const kf = state.value.keyframes.find((k) => k.id === selectedKeyframeId.value);
    if (!kf) return;

    const newVars: Record<string, string> = {};
    for (const line of css.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("/*")) continue;
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx === -1) continue;
        const prop = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();
        if (value.endsWith(";")) value = value.slice(0, -1).trim();
        if (prop && value) newVars[prop] = value;
    }

    kf.vars = newVars;
    rebuild();
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
    scrubT.value = percent / 100;
    (event.target as Element).setPointerCapture(event.pointerId);
};

const onTrackPointerMove = (event: PointerEvent) => {
    if (draggingKeyframeId.value) {
        const percent = getPercentFromPointer(event);
        moveKeyframe(draggingKeyframeId.value, percent);
        return;
    }

    // Only scrub if pointer is captured (button held)
    if (event.buttons > 0 && !draggingKeyframeId.value) {
        const percent = getPercentFromPointer(event);
        scrubT.value = percent / 100;
    }
};

const onTrackPointerUp = () => {
    draggingKeyframeId.value = null;
};

const onMarkerPointerDown = (event: PointerEvent, id: string) => {
    selectedKeyframeId.value = id;
    draggingKeyframeId.value = id;
    (event.target as Element).setPointerCapture(event.pointerId);
};

const doImport = (text: string) => {
    if (text.trim()) {
        importCSS(text);
        importDialogOpen.value = false;
    }
};

const doAddCSS = (text: string) => {
    if (text.trim()) {
        importCSS(text);
        addCSSDialogOpen.value = false;
    }
};

const openImportDialog = () => {
    importDialogOpen.value = true;
};

const openAddCSSDialog = () => {
    addCSSDialogOpen.value = true;
};

const removeSelectedKeyframe = () => {
    if (selectedKeyframeId.value) {
        removeKeyframe(selectedKeyframeId.value);
        selectedKeyframeId.value = null;
    }
};

defineExpose({
    snapshot,
    openImportDialog,
    openAddCSSDialog,
    exportCSS,
    removeSelectedKeyframe,
    selectedKeyframeId,
});
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

.kf-editor-enter-active { transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard); }
.kf-editor-leave-active { transition: opacity var(--duration-instant) var(--ease-standard), transform var(--duration-instant) var(--ease-standard); }
.kf-editor-enter-from { opacity: 0; transform: translateY(-8px); }
.kf-editor-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
