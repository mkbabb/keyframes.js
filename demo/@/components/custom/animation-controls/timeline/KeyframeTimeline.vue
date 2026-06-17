<template>
    <div class="flex flex-col gap-3">
    <Card surface="cartoon" tier="quiet" :class="['w-full overflow-visible', props.expanded ? 'border-0 shadow-none bg-transparent' : '']">
        <CardContent :class="['relative flex flex-col gap-3', props.expanded ? 'p-2 px-0' : 'p-4']">
        <!-- Pane action buttons -->
        <div class="flex items-center justify-end gap-1">
            <!-- Undo / redo (F.W14.S2) — the discoverable affordance for the
                 Mod+Z / Mod+Shift+Z bindings; bounded by the same canUndo/canRedo
                 history state. Sits in the timeline card (not over the dock band),
                 so it does not occlude the dock (inv δ). -->
            <IconTooltip text="Undo (Mod+Z)">
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    aria-label="Undo"
                    :disabled="!canUndo"
                    @click="undo()"
                >
                    <Undo2 class="icon-sm" />
                </Button>
            </IconTooltip>
            <IconTooltip text="Redo (Mod+Shift+Z)">
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    aria-label="Redo"
                    :disabled="!canRedo"
                    @click="redo()"
                >
                    <Redo2 class="icon-sm" />
                </Button>
            </IconTooltip>
            <IconTooltip text="Clear all keyframes">
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    aria-label="Clear all keyframes"
                    @click="clear()"
                >
                    <Trash class="icon-sm" />
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
                    <component :is="props.expanded ? Minimize2 : Maximize2" class="icon-sm" />
                </Button>
            </IconTooltip>
        </div>

        <!-- Timeline track: diamonds, playhead, ticks, carets, zoom/pan -->
        <TimelineTrack
            :sorted-keyframes="sortedKeyframes"
            :scrub-t="scrubT"
            :expanded="props.expanded"
            :selected-keyframe-id="selectedKeyframeId"
            :preview-cache="previewCache"
            :preview-loading="previewLoading"
            @update:scrub-t="(t) => (scrubT = t)"
            @move-keyframe="moveKeyframe"
            @select="(id) => (selectedKeyframeId = id)"
            @diamond-hover="onDiamondHover"
        />

        <!-- Selected Keyframe Editor (inline). J.W7b S1d — the transition is
             glass-ui's published `.fade-slide` class set (transitions.css:23-37):
             the former hand-rolled keyframe-editor transition copy (4 scoped
             rules, a near-exact re-author MISSING the PRM guard) is DELETED in
             the same motion; the published classes carry the
             `prefers-reduced-motion` bracket (transitions.css PRM block) the
             local copy lacked. -->
        <Transition name="fade-slide">
            <div v-if="selectedKeyframe" class="flex flex-col gap-3">
                <Separator />

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-mono-caption font-semibold"
                            >{{ Math.round(selectedKeyframe.percent) }}%</span
                        >
                        <Input
                            v-model="selectedKeyframe.label"
                            placeholder="Label..."
                            class="font-mono text-admin-label h-6 w-32"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        class="h-6 w-6 p-0"
                        aria-label="Remove keyframe"
                        @click="removeKeyframe(selectedKeyframeId!)"
                    >
                        <X class="icon-xs" />
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
import { computed, reactive, ref } from "vue";
import type { Ref } from "vue";
import {
    Download,
    Maximize2,
    Minimize2,
    FilePlus2,
    Trash,
    Undo2,
    Redo2,
    X,
} from "@lucide/vue";
import CSSPasteDialog from "@components/custom/CSSPasteDialog.vue";
import { Button, Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import CSSCodeEditor from "../keyframes/CSSCodeEditor.vue";
import { useTimeline } from "./composables/useTimeline";
import TimelineTrack from "./components/TimelineTrack.vue";
import type { TimelineKeyframe } from "./timelineTypes";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";

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
    rebuild,
    scrubAndCapture,
    exportCSS,
    importCSS,
    clear,
    undo,
    redo,
    canUndo,
    canRedo,
} = useTimeline(targetsRef, optionsRef);

const selectedKeyframeId = ref<string | null>(null);
const importDialogOpen = ref(false);
const addCSSDialogOpen = ref(false);

// --- Preview cache for diamond hover ---
const previewCache = reactive<Record<string, string>>({});
const previewLoading = reactive<Record<string, boolean>>({});

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
    undo,
    redo,
    canUndo,
    canRedo,
});
</script>

<!-- J.W7b S1d — the 4 hand-rolled enter/leave transition rules are GONE: the
     inline keyframe editor consumes glass-ui's published `.fade-slide`
     <Transition> classes (PRM-guarded) instead of re-authoring them. -->
