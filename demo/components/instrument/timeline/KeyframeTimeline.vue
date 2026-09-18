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

        <!-- D-15 — the three states the instrument used to leave UNEXPRESSED.
             Empty and single-frame are STATES, not errors (G14 P4b): the `< 2`
             contract lives in `rebuild`, and until now its only expression was
             an export-time toast — the one failure reachable BY TYPING was the
             one that never said anything. A failed rebuild is rendered here
             beside the track, with the message and the same Retry the house
             channel offers. -->
        <p
            v-if="state.keyframes.length === 0"
            class="text-body text-muted-foreground text-center py-2"
        >
            No keyframes yet — <strong>Snapshot</strong> the target's current
            pose, or <strong>Import</strong> CSS <code>@keyframes</code>.
        </p>
        <p
            v-else-if="state.keyframes.length === 1"
            class="text-body text-muted-foreground text-center py-2"
        >
            One keyframe — one more builds the animation.
        </p>
        <div
            v-if="buildError"
            class="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2"
            role="status"
            aria-live="polite"
        >
            <span class="text-admin-label text-destructive"
                >Animation could not be built — {{ buildError }}</span
            >
            <Button size="sm" emphasis="quiet" @click="rebuild()">Retry</Button>
        </div>

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

                <div
                    :aria-invalid="cssEditorError ? 'true' : undefined"
                    :aria-describedby="cssEditorError ? 'kf-css-editor-error' : undefined"
                >
                    <CSSCodeEditor
                        :model-value="selectedKeyframeCSS"
                        height="250px"
                        @update:model-value="onKeyframeCSSChange"
                    />
                    <!-- G14 P2 — the failure is surfaced AT the surface that
                         caused it, politely announced, with the draft intact.
                         (`useUserInvalidAria` on glass `/forms` is the bridge
                         for the day this well becomes a real form control —
                         KF.W6's S-9 swap, not spent here.) -->
                    <p
                        v-if="cssEditorError"
                        id="kf-css-editor-error"
                        class="text-admin-label text-destructive mt-1"
                        role="status"
                        aria-live="polite"
                    >
                        {{ cssEditorError }}
                    </p>
                </div>
            </div>
        </Transition>

        </CardContent>
    </Card>

    <!-- L-16/L-17 — the two paste dialogs differed in four strings and nothing
             else, so they are ONE mount over a descriptor. An in-file `v-for`,
             not a new wrapper component (`feedback_kiss_no_contrivance`). -->
        <CSSPasteDialog
            v-for="dialog in pasteDialogs"
            :key="dialog.key"
            v-model:open="dialog.open.value"
            v-model:text="dialog.text.value"
            :title="dialog.title"
            :description="dialog.description"
            :button-label="dialog.buttonLabel"
            :button-icon="dialog.buttonIcon"
            :submit="dialog.submit"
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
import {
    collectDeclarations,
    collectStyleRules,
    parseStylesheet,
} from "@mkbabb/value.js/css";
import { serializeCssValue } from "@src/animation/compile/emit/css-text";
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
    buildError,
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

// --- The inline editor's INGRESS: the grammar parses, not this file ---
//
// L-6/C-4 — a hand-rolled CSS declaration scanner (`split("\n")` + the first
// `indexOf(":")`) lived here, inside the demo of a CSS engine, and its result
// WHOLE-REPLACED `kf.vars`: anything the scanner failed to recognise was not
// mis-parsed, it was DELETED. The sibling path already honoured the doctrine
// (`timelineEngine.ts` reaches the façade for the same job), which made this a
// BYPASS rather than an omission. The block is now parsed by
// `@mkbabb/value.js/css` — the same grammar, the same `serializeCssValue` the
// import path uses at `timelineEngine.ts`, so the TYPING ingress and the
// IMPORT ingress finally agree about what a declaration is.
type DeclarationParse =
    | { ok: true; vars: Record<string, string> }
    | { ok: false; message: string };

const parseDeclarationBlock = (css: string): DeclarationParse => {
    let parsed;
    try {
        // The editor holds a bare declaration list; the grammar's entry point
        // is a stylesheet, so the block is given the rule it is missing.
        parsed = parseStylesheet(`*{${css}}`);
    } catch (e) {
        // C-7 — a live untrusted-CSS ingress to the megatranche R1 crash shape:
        // the façade THROWS (rather than returning a diagnostic) on a handful of
        // malformed function values — `oklch()` among them, re-measured at these
        // bytes. The crash IDENTITY is R1's and is never re-booked here; what
        // books here is the POSTURE, and a throw is a parse failure like any
        // other: surfaced at the surface the user is operating, never swallowed,
        // and it never reaches `kf.vars`.
        return { ok: false, message: (e as Error).message };
    }

    if (!parsed.ok) {
        const issue = parsed.diagnostics[0];
        const at = issue.actual === null ? "" : ` at ${JSON.stringify(issue.actual)}`;
        return {
            ok: false,
            message: `${issue.code.replace(/_/g, " ")}${at} — expected ${issue.expected.join(" or ")}`,
        };
    }

    const rule = collectStyleRules(parsed.value).at(0)?.rule;
    const vars: Record<string, string> = {};
    for (const [name, declaration] of collectDeclarations(
        rule?.declarations ?? [],
    )) {
        vars[name] = serializeCssValue(declaration.value);
    }
    return { ok: true, vars };
};

const cssEditorError = ref<string | null>(null);

const onKeyframeCSSChange = (css: string) => {
    if (!selectedKeyframeId.value) return;
    const kf = state.value.keyframes.find((k) => k.id === selectedKeyframeId.value);
    if (!kf) return;

    const parsed = parseDeclarationBlock(css);
    if (!parsed.ok) {
        // G14 P2 — IN PLACE, DRAFT-PRESERVING. The editor stays open with the
        // text the user typed; `kf.vars` is NOT assigned, so a half-typed block
        // can no longer destroy a keyframe on its way to being valid.
        cssEditorError.value = parsed.message;
        return;
    }

    cssEditorError.value = null;
    kf.vars = parsed.vars;
    void rebuild();
};

// A failure belongs to the keyframe that was open when it happened.
watch(selectedKeyframeId, () => (cssEditorError.value = null));

// The two paste dialogs, as data. G14 P2: each `submit` is AWAITED by the
// shell — it resolves and the dialog closes, or it rejects and the dialog stays
// open with the message beside the draft (the old handlers closed on a failed
// parse and destroyed the paste). R-3: "Add" MERGES, which is what its
// description has always said; it used to call the same whole-array import the
// Import dialog does, so the button labelled "Add" destroyed everything the
// user had authored.
const importText = ref("");
const addCSSText = ref("");

const pasteDialogs = [
    {
        key: "import",
        open: importDialogOpen,
        text: importText,
        title: "Import CSS @keyframes",
        description: "Paste CSS @keyframes to load into the timeline",
        buttonLabel: "Import",
        buttonIcon: Download,
        submit: async (css: string) => {
            await importCSS(css);
            importText.value = "";
        },
    },
    {
        key: "add",
        open: addCSSDialogOpen,
        text: addCSSText,
        title: "Add CSS @keyframes",
        description: "Paste CSS @keyframes to merge into the timeline",
        buttonLabel: "Add",
        buttonIcon: FilePlus2,
        submit: async (css: string) => {
            await mergeCSS(css);
            addCSSText.value = "";
        },
    },
];

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
