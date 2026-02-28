<template>
    <div class="flex flex-col gap-3">
        <!-- Toolbar -->
        <div class="flex items-center gap-2 flex-wrap">
            <IconTooltip text="Snapshot current state">
                <Button
                    size="sm"
                    variant="outline"
                    class="gap-1.5 cursor-pointer"
                    @click="snapshot()"
                >
                    <Camera class="w-4 h-4" />
                    Snapshot
                </Button>
            </IconTooltip>

            <IconTooltip text="Import CSS @keyframes">
                <Button
                    size="sm"
                    variant="outline"
                    class="gap-1.5 cursor-pointer"
                    @click="importDialogOpen = true"
                >
                    <Download class="w-4 h-4" />
                    Import
                </Button>
            </IconTooltip>

            <IconTooltip text="Export as CSS @keyframes">
                <Button
                    size="sm"
                    variant="outline"
                    class="gap-1.5 cursor-pointer"
                    @click="exportCSS()"
                >
                    <Upload class="w-4 h-4" />
                    Export
                </Button>
            </IconTooltip>

            <IconTooltip text="Add CSS @keyframes">
                <Button
                    size="sm"
                    variant="outline"
                    class="gap-1.5 cursor-pointer"
                    @click="addCSSDialogOpen = true"
                >
                    <FilePlus2 class="w-4 h-4" />
                    Add CSS
                </Button>
            </IconTooltip>

            <IconTooltip text="Clear all keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="gap-1.5 cursor-pointer"
                    @click="clear()"
                >
                    <Trash class="w-4 h-4" />
                </Button>
            </IconTooltip>

            <!-- Zoom indicator -->
            <span
                v-if="zoomLevel > 1"
                class="fira-code text-[10px] text-muted-foreground ml-auto"
            >{{ zoomLevel.toFixed(1) }}x</span>
        </div>

        <!-- Zoom mini range bar -->
        <div
            v-if="zoomLevel > 1"
            class="relative h-1.5 rounded-full bg-muted/50 border border-border/30"
        >
            <div
                class="absolute top-0 h-full rounded-full bg-primary/40"
                :style="{
                    left: `${(panOffset / 100) * 100}%`,
                    width: `${(100 / zoomLevel / 100) * 100}%`,
                }"
            ></div>
        </div>

        <!-- Timeline Track -->
        <div
            ref="trackEl"
            class="timeline-track relative h-12 rounded-lg border border-border bg-muted/30 cursor-pointer select-none overflow-hidden"
            style="touch-action: none"
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
                    class="fira-code absolute -top-5 left-0 -translate-x-1/2 text-[10px] text-muted-foreground"
                >{{ tick }}%</span>
            </div>

            <!-- Playhead -->
            <div
                class="absolute top-0 h-full w-0.5 bg-primary z-10 pointer-events-none transition-[left] duration-75"
                :style="{ left: `${percentToPosition(scrubT * 100)}%` }"
            ></div>

            <!-- Keyframe markers -->
            <div
                v-for="kf in sortedKeyframes"
                :key="kf.id"
                :class="[
                    'keyframe-marker absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
                    'w-4 h-4 rotate-45 rounded-sm cursor-grab',
                    'border-2 transition-colors',
                    selectedKeyframeId === kf.id
                        ? 'bg-primary border-primary scale-125'
                        : 'bg-background border-foreground/50 hover:border-primary hover:scale-110',
                ]"
                :style="{ left: `${percentToPosition(kf.percent)}%` }"
                @pointerdown.stop="onMarkerPointerDown($event, kf.id)"
            ></div>

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

        <!-- Selected Keyframe Editor -->
        <Card v-if="selectedKeyframe" class="p-0">
            <CardContent class="p-3 grid gap-2">
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
                        class="h-6 w-6 p-0 cursor-pointer"
                        @click="removeKeyframe(selectedKeyframeId!)"
                    >
                        <X class="w-3 h-3" />
                    </Button>
                </div>

                <Separator />

                <div class="grid gap-1.5 max-h-40 overflow-y-auto">
                    <div
                        v-for="[prop, value] in Object.entries(
                            selectedKeyframe.vars,
                        )"
                        :key="prop"
                        class="flex items-center gap-1.5"
                    >
                        <span
                            class="fira-code text-xs text-muted-foreground w-28 truncate shrink-0"
                            :title="prop"
                            >{{ prop }}</span
                        >
                        <Input
                            :model-value="value"
                            @update:model-value="
                                (v) =>
                                    updateKeyframeProperty(
                                        selectedKeyframeId!,
                                        prop,
                                        v as string,
                                    )
                            "
                            class="fira-code text-xs h-6 flex-1"
                        />
                        <Button
                            size="sm"
                            variant="ghost"
                            class="h-6 w-6 p-0 shrink-0 cursor-pointer"
                            @click="
                                updateKeyframeProperty(
                                    selectedKeyframeId!,
                                    prop,
                                    '',
                                )
                            "
                        >
                            <X class="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                <!-- Add property -->
                <div class="flex items-center gap-1.5">
                    <Input
                        v-model="newPropName"
                        placeholder="property..."
                        class="fira-code text-xs h-6 flex-1"
                        @keydown.enter="addPropertyToKeyframe"
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        class="h-6 w-6 p-0 shrink-0 cursor-pointer"
                        @click="addPropertyToKeyframe"
                    >
                        <Plus class="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Empty state -->
        <div
            v-else-if="sortedKeyframes.length === 0"
            class="text-center py-6 text-muted-foreground text-sm"
        >
            <p class="fraunces italic">Click "Snapshot" or click the timeline to add keyframes</p>
        </div>

        <!-- Import dialog -->
        <Dialog v-model:open="importDialogOpen">
            <DialogContent>
                <DialogTitle class="fira-code text-base font-medium"
                    >Import CSS @keyframes</DialogTitle
                >
                <DialogDescription class="fira-code text-sm text-muted-foreground"
                    >Paste CSS @keyframes to load into the timeline</DialogDescription
                >
                <pre
                    ref="importTextEl"
                    @input="
                        (e) => {
                            importText = (e.target as HTMLElement).innerText;
                        }
                    "
                    class="fira-code min-h-[20vh] p-3 cursor-text rounded-lg text-sm bg-muted/50 outline-none border border-border"
                    contenteditable="true"
                ><code>{{ importText }}</code></pre>
                <DialogFooter>
                    <Button
                        class="cursor-pointer gap-2"
                        @click="doImport"
                        >Import<Download class="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Add CSS dialog -->
        <Dialog v-model:open="addCSSDialogOpen">
            <DialogContent>
                <DialogTitle class="fira-code text-base font-medium"
                    >Add CSS @keyframes</DialogTitle
                >
                <DialogDescription class="fira-code text-sm text-muted-foreground"
                    >Paste CSS @keyframes to merge into the timeline</DialogDescription
                >
                <pre
                    ref="addCSSTextEl"
                    @input="
                        (e) => {
                            addCSSText = (e.target as HTMLElement).innerText;
                        }
                    "
                    class="fira-code min-h-[20vh] p-3 cursor-text rounded-lg text-sm bg-muted/50 outline-none border border-border"
                    contenteditable="true"
                ><code>{{ addCSSText }}</code></pre>
                <DialogFooter>
                    <Button
                        class="cursor-pointer gap-2"
                        @click="doAddCSS"
                        >Add<FilePlus2 class="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import type { Ref } from "vue";
import {
    Camera,
    Download,
    Upload,
    FilePlus2,
    Trash,
    X,
    Plus,
} from "lucide-vue-next";
import IconTooltip from "@components/custom/IconTooltip.vue";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@components/ui/dialog";
import { useTimeline } from "./useTimeline";
import TimelineCaret from "./TimelineCaret.vue";
import type { InputAnimationOptions } from "@src/animation/constants";

const props = defineProps<{
    targets: HTMLElement[];
    animationOptions?: InputAnimationOptions;
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
    exportCSS,
    importCSS,
    clear,
} = useTimeline(targetsRef, optionsRef);

const trackEl = useTemplateRef<HTMLElement>("trackEl");
const selectedKeyframeId = ref<string | null>(null);
const draggingKeyframeId = ref<string | null>(null);
const newPropName = ref("");
const importDialogOpen = ref(false);
const importText = ref("");
const addCSSDialogOpen = ref(false);
const addCSSText = ref("");

// --- Zoom/Pan state ---
const zoomLevel = ref(1);
const panOffset = ref(0); // percent units (0-100 range)

const percentToPosition = (pct: number): number => {
    return (pct - panOffset.value) * zoomLevel.value;
};

const positionToPercent = (pos: number): number => {
    return pos / zoomLevel.value + panOffset.value;
};

const clampPan = () => {
    const maxPan = 100 - 100 / zoomLevel.value;
    panOffset.value = Math.max(0, Math.min(maxPan, panOffset.value));
};

// Dynamic tick marks based on zoom level
const visibleTicks = computed(() => {
    let step: number;
    if (zoomLevel.value >= 8) step = 1;
    else if (zoomLevel.value >= 5) step = 5;
    else if (zoomLevel.value >= 3) step = 10;
    else step = 25;

    const ticks: number[] = [];
    const visibleStart = panOffset.value;
    const visibleEnd = panOffset.value + 100 / zoomLevel.value;

    for (let t = 0; t <= 100; t += step) {
        if (t >= visibleStart - step && t <= visibleEnd + step) {
            ticks.push(t);
        }
    }
    return ticks;
});

// --- Zoom handlers ---
const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
        // Zoom centered on pointer
        const rect = trackEl.value!.getBoundingClientRect();
        const pointerX = (event.clientX - rect.left) / rect.width;
        const pointerPercent = positionToPercent(pointerX * 100);

        const factor = event.deltaY < 0 ? 1.05 : 1 / 1.05;
        const newZoom = Math.max(1, Math.min(10, zoomLevel.value * factor));

        // Adjust pan so pointer stays at same percent
        panOffset.value = pointerPercent - (pointerX * 100) / newZoom;
        zoomLevel.value = newZoom;
        clampPan();
    } else if (event.shiftKey && zoomLevel.value > 1) {
        // Horizontal pan
        panOffset.value += event.deltaY * 0.1 / zoomLevel.value;
        clampPan();
    }
};

// Touch pinch zoom
let initialPinchDist = 0;
let initialPinchZoom = 1;

const getTouchDist = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[1]!.clientX - touches[0]!.clientX;
    const dy = touches[1]!.clientY - touches[0]!.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
        initialPinchDist = getTouchDist(event.touches);
        initialPinchZoom = zoomLevel.value;
    }
};

const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2 && initialPinchDist > 0) {
        const dist = getTouchDist(event.touches);
        const scale = dist / initialPinchDist;
        zoomLevel.value = Math.max(1, Math.min(10, initialPinchZoom * scale));
        clampPan();
    }
};

const onTouchEnd = () => {
    initialPinchDist = 0;
};

const selectedKeyframe = computed(() =>
    state.value.keyframes.find((kf) => kf.id === selectedKeyframeId.value),
);

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

const addPropertyToKeyframe = () => {
    if (!selectedKeyframeId.value || !newPropName.value.trim()) return;

    updateKeyframeProperty(
        selectedKeyframeId.value,
        newPropName.value.trim(),
        "",
    );
    newPropName.value = "";
};

const doImport = () => {
    if (importText.value.trim()) {
        importCSS(importText.value);
        importDialogOpen.value = false;
        importText.value = "";
    }
};

const doAddCSS = () => {
    if (addCSSText.value.trim()) {
        importCSS(addCSSText.value);
        addCSSDialogOpen.value = false;
        addCSSText.value = "";
    }
};
</script>

<style scoped>
.timeline-track {
    margin-top: 1.25rem;
}

.keyframe-marker {
    transition:
        transform 0.15s ease,
        border-color 0.15s ease;
}

.keyframe-marker:active {
    cursor: grabbing;
}
</style>
