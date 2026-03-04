<template>
    <div class="flex flex-col gap-3">
    <Card :class="['w-full overflow-hidden transition-all duration-150', props.expanded ? 'border-0 shadow-none bg-transparent' : '']">
        <CardContent :class="['flex flex-col gap-3', props.expanded ? 'p-2 px-0' : 'p-4']">
        <!-- Toolbar -->
        <div class="flex items-center gap-1.5 flex-wrap">
            <IconTooltip text="Snapshot current state">
                <Button
                    size="sm"
                    variant="ghost"
                    class="gap-1.5 cursor-pointer fira-code text-xs h-7 px-2"
                    @click="snapshot()"
                >
                    <Camera class="w-3.5 h-3.5" />
                    Snapshot
                </Button>
            </IconTooltip>

            <IconTooltip text="Import CSS @keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="gap-1.5 cursor-pointer fira-code text-xs h-7 px-2"
                    @click="importDialogOpen = true"
                >
                    <Download class="w-3.5 h-3.5" />
                    Import
                </Button>
            </IconTooltip>

            <IconTooltip text="Export as CSS @keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="gap-1.5 cursor-pointer fira-code text-xs h-7 px-2"
                    @click="exportCSS()"
                >
                    <Upload class="w-3.5 h-3.5" />
                    Export
                </Button>
            </IconTooltip>

            <IconTooltip text="Add CSS @keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="gap-1.5 cursor-pointer fira-code text-xs h-7 px-2"
                    @click="addCSSDialogOpen = true"
                >
                    <FilePlus2 class="w-3.5 h-3.5" />
                    Add CSS
                </Button>
            </IconTooltip>

            <div class="flex-1"></div>

            <IconTooltip text="Clear all keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="cursor-pointer h-7 w-7 p-0"
                    @click="clear()"
                >
                    <Trash class="w-3.5 h-3.5" />
                </Button>
            </IconTooltip>

            <IconTooltip :text="props.expanded ? 'Collapse timeline' : 'Expand timeline'">
                <Button
                    size="sm"
                    variant="ghost"
                    class="cursor-pointer h-7 w-7 p-0"
                    @click="emit('toggleExpand')"
                >
                    <component :is="props.expanded ? Minimize2 : Maximize2" class="w-3.5 h-3.5" />
                </Button>
            </IconTooltip>

            <!-- Zoom indicator -->
            <span
                v-if="zoomLevel > 1"
                class="fira-code text-[10px] text-muted-foreground"
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
            :class="[
                'timeline-track relative rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-all duration-150 cursor-pointer select-none overflow-x-clip overflow-y-visible',
                props.expanded ? 'h-32' : 'h-12',
            ]"
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
                                : 'bg-background border-foreground/50 hover:border-primary hover:scale-110',
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
                        <div v-if="previewLoading[kf.id]" class="text-muted-foreground text-[10px] fira-code">
                            Capturing...
                        </div>
                        <div class="fira-code text-[10px] text-muted-foreground max-h-24 overflow-y-auto w-full">
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
                        class="h-6 w-6 p-0 cursor-pointer"
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

        <!-- Empty state -->
        <div
            v-if="!selectedKeyframe && sortedKeyframes.length === 0"
            class="text-center py-6 text-muted-foreground text-sm"
        >
            <p class="fira-code">Click "Snapshot" or click the timeline to add keyframes</p>
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
import { computed, reactive, ref, useTemplateRef } from "vue";
import type { Ref } from "vue";
import {
    Camera,
    Download,
    Maximize2,
    Minimize2,
    Upload,
    FilePlus2,
    Trash,
    X,
} from "lucide-vue-next";
import IconTooltip from "@components/custom/IconTooltip.vue";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import CSSCodeEditor from "./CSSCodeEditor.vue";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { useTimeline } from "./useTimeline";
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
const importText = ref("");
const addCSSDialogOpen = ref(false);
const addCSSText = ref("");

// --- Preview cache for diamond hover ---
import type { TimelineKeyframe } from "./timelineTypes";

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

const openImportDialog = () => {
    importDialogOpen.value = true;
};

defineExpose({
    snapshot,
    openImportDialog,
});
</script>

<style scoped>
.timeline-track {
    margin-top: 1.25rem;
    margin-bottom: 1rem;
}

.keyframe-marker {
    transition:
        transform 0.15s ease,
        border-color 0.15s ease;
}

.keyframe-marker:active {
    cursor: grabbing;
}

.kf-editor-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.kf-editor-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.kf-editor-enter-from { opacity: 0; transform: translateY(-8px); }
.kf-editor-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
