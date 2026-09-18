<template>
    <div class="flex flex-col gap-3">
    <Card cartoon tier="quiet" :class="['w-full overflow-visible', props.expanded ? 'border-0 shadow-none bg-transparent' : '']">
        <CardContent :class="['relative flex flex-col gap-3', props.expanded ? 'p-2 px-0' : 'p-4']">
        <!-- Pane action buttons -->
        <div class="flex items-center justify-end gap-1">
            <!-- Undo / redo (F.W14.S2) — the discoverable affordance for the
                 Mod+Z / Mod+Shift+Z bindings; bounded by the same canUndo/canRedo
                 history state. Sits in the timeline card (not over the dock band),
                 so it does not occlude the dock (inv δ). -->
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        icon-only
                        class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                        aria-label="Undo"
                        :disabled="!canUndo"
                        @click="undo()"
                    >
                        <Undo2 class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Mod+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        icon-only
                        class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                        aria-label="Redo"
                        :disabled="!canRedo"
                        @click="redo()"
                    >
                        <Redo2 class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Mod+Shift+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        icon-only
                        class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                        aria-label="Clear all keyframes"
                        @click="clear()"
                    >
                        <Trash class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all keyframes</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        icon-only
                        class="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                        :aria-label="props.expanded ? 'Collapse timeline' : 'Expand timeline'"
                        @click="emit('toggleExpand')"
                    >
                        <component :is="props.expanded ? Minimize2 : Maximize2" class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{{ props.expanded ? "Collapse timeline" : "Expand timeline" }}</TooltipContent>
            </Tooltip>
        </div>

        <!-- Preview stage — the ONE subject this instrument's engine paints
             (KF.W7 G2 / C-6): an inert clone of the instrumented element, driven
             by the timeline's own animation. The scene's element is READ by
             `snapshot()` and never written here — the scene keeps its single
             engine. -->
        <div
            ref="previewStage"
            :class="[
                'timeline-preview-stage grid place-items-center overflow-clip rounded-lg border border-border bg-muted/30',
                props.expanded ? 'h-40' : 'h-24',
            ]"
            aria-hidden="true"
        ></div>

        <!-- Timeline track: diamonds, playhead, ticks, carets, zoom/pan. The
             scrub emit drives the ENGINE (`scrub`), not a bare ref: the playhead
             and the painted subject are one position (KF.W7 G2 / C-1). -->
        <TimelineTrack
            :sorted-keyframes="sortedKeyframes"
            :scrub-t="scrubT"
            :expanded="props.expanded"
            :selected-keyframe-id="selectedKeyframeId"
            :preview-cache="previewCache"
            :preview-loading="previewLoading"
            @update:scrub-t="scrub"
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
                        <span class="text-mono-caption font-semibold tabular-nums"
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
                        emphasis="quiet"
                        icon-only
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
import { computed, reactive, ref, shallowRef, useTemplateRef, watch } from "vue";
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
import CSSPasteDialog from "./CSSPasteDialog.vue";
import { Button, Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import CSSCodeEditor from "../keyframes/CSSCodeEditor.vue";
import { useTimeline } from "./composables/useTimeline";
import TimelineTrack from "./components/TimelineTrack.vue";
import { createPreviewSubject } from "./utils/timelineEngine";
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
    animation,
    sortedKeyframes,
    scrubT,
    snapshot,
    removeKeyframe,
    moveKeyframe,
    rebuild,
    scrub,
    scrubAndCapture,
    exportCSS,
    importCSS,
    mergeCSS,
    clear,
    undo,
    redo,
    canUndo,
    canRedo,
} = useTimeline(targetsRef, optionsRef);

// --- The preview subject: what the engine paints (KF.W7 G2 / C-6) ---
//
// Minted once per SOURCE (the instrumented element) and per STAGE, never per
// build — the DOM node is stable across rebuilds. Mounted post-render (no
// write→render edge, LP-1).
const previewStage = useTemplateRef<HTMLElement>("previewStage");
const previewSubject = shallowRef<HTMLElement | null>(null);

watch(
    [() => props.targets[0], previewStage],
    ([source, stage]) => {
        previewSubject.value =
            source && stage ? createPreviewSubject(source) : null;
        stage?.replaceChildren(
            ...(previewSubject.value ? [previewSubject.value] : []),
        );
    },
    { immediate: true, flush: "post" },
);

// THE INVARIANT: every animation this instrument builds is rebound to the
// subject in the same synchronous step that publishes it (`flush: "sync"`
// fires inside `animation.value = …`), so no frame is ever applied to a scene
// element. With no subject yet, the engine is bound to NOTHING — it paints
// nowhere rather than the scene.
watch(
    [animation, previewSubject],
    ([anim, subject]) => {
        anim?.setTargets(...(subject ? [subject] : []));
    },
    { immediate: true, flush: "sync" },
);

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
        // KEEP: capture failed (no animation, 3D not supported, etc.) — ghost preview shown as fallback
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

// R-3 — the Add dialog's copy says MERGE, so Add merges: `mergeCSS` folds the
// pasted stops into the timeline the way CSS does. It used to call the same
// whole-array `importCSS` the Import dialog does, so the button labelled "Add"
// destroyed everything the user had authored.
const doAddCSS = (text: string) => {
    if (text.trim()) {
        mergeCSS(text);
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
