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
        </div>

        <!-- Timeline Track -->
        <div
            ref="trackEl"
            class="timeline-track relative h-12 rounded-lg border border-border bg-muted/30 cursor-pointer select-none"
            style="touch-action: none"
            @pointerdown="onTrackPointerDown"
            @pointermove="onTrackPointerMove"
            @pointerup="onTrackPointerUp"
            @pointercancel="onTrackPointerUp"
        >
            <!-- Tick marks -->
            <div
                v-for="tick in [0, 25, 50, 75, 100]"
                :key="tick"
                class="absolute top-0 h-full border-l border-border/30"
                :style="{ left: `${tick}%` }"
            >
                <span
                    class="fira-code absolute -top-5 left-0 -translate-x-1/2 text-[10px] text-muted-foreground"
                    >{{ tick }}%</span
                >
            </div>

            <!-- Playhead -->
            <div
                class="absolute top-0 h-full w-0.5 bg-primary z-10 pointer-events-none transition-[left] duration-75"
                :style="{ left: `${scrubT * 100}%` }"
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
                :style="{ left: `${kf.percent}%` }"
                @pointerdown.stop="onMarkerPointerDown($event, kf.id)"
            ></div>
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
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import type { Ref } from "vue";
import {
    Camera,
    Download,
    Upload,
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

const selectedKeyframe = computed(() =>
    state.value.keyframes.find((kf) => kf.id === selectedKeyframeId.value),
);

const getPercentFromPointer = (event: PointerEvent): number => {
    if (!trackEl.value) return 0;
    const rect = trackEl.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
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
