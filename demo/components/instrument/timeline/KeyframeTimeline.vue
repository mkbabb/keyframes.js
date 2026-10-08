<template>
    <div class="flex flex-col gap-3">
    <!-- UIA-KF-085 — the Card IS the surface in both modes: expanded, it
         floats over the stage at glass's floating tier instead of having its
         material stripped by class overrides inside a hand-dressed wash cell
         (the cell is now a placement slot, AnimationControlsGroup.vue).
         X-DS pass 1, C1 (KF-C1-07) — in the pane (collapsed) the timeline
         draws no card of its own: the pane host draws the one frame
         (ControlsPaneWrapper). Expanded, it floats over the stage, so there
         the Card is still the surface. -->
    <component
        :is="props.expanded ? Card : 'div'"
        v-bind="props.expanded ? { tier: 'floating' } : {}"
        :class="['w-full overflow-visible', props.expanded ? 'cartoon-surface' : '']"
    >
        <!-- X-DS pass 9 (KF-C9-07) — the pane's ONE inset and ONE title rung:
             the inline inset is glass's `--configurator-pad-inline` and the
             title wears glass's configurator section label, as every scene
             facet's ConfiguratorLayer does (16 px and `text-subheading` made a
             second anatomy in the same pane slot). -->
        <CardContent class="relative flex flex-col gap-3 px-(--configurator-pad-inline) py-4">
        <!-- Pane action buttons.
             D-6 + the wave's ONE min-block-size policy (D-8), both spent by
             deleting the same class attribute rather than by writing a second
             one. INK: `opacity-50 hover:opacity-100` multiplied a token that was
             already correct — glass's quiet emphasis ships exactly the rung pair
             the demo was re-authoring in alpha (`color: var(--muted-foreground)`
             at rest, `var(--foreground)` on hover) — and opacity is not a
             contrast mechanism, so the pane icons composited far under the bar
             while Clear and Expand are never disabled and claim no exemption.
             BOX: `h-7 w-7 p-0` overrode height on a glass CONTROL, which the
             policy forbids — a control's block size comes from its `size` prop
             and the producer's `min-block-size`, because `h-*` sets `height`
             while the producer sets `min-block-size`/`block-size` and the two
             disagree exactly where the coarse-pointer floor lives. `size="sm"
             icon-only` already names the rung wanted here, so the override was
             the only thing standing between this row and the producer's floor.
             Container minimums elsewhere are layout, not control overrides, and
             are untouched.

             THE POLICY IS THE DEMO'S, NOT THIS FILE'S (W6-M, unit `.k`) — it is
             stated once, here, and two folds are named against it so a later
             sweep finds them at the rule rather than at four scattered sites:
             · kf-SequenceScene **D22**'s height limb — its claim of a 28×28
               box from the override named two lines up — was KILLED on this
               exact mechanism: `h-*` sets `height` while the producer sets
               `min-block-size`, which is no cascade contest, so the element
               renders 28×40 fine / 28×60 coarse and never 28×28. Fold, never a
               re-booking; D22's surviving WIDTH and `iconOnly` conformance
               limbs ride kf-SequenceScene D9 and are NO-WAVE-OWNER. The live
               instance of that override (`SequenceTarget.vue`'s reel button) is
               outside this unit's writable set and is DECLARED upward, never
               reached across. `SequenceScene.vue` itself, which IS in this
               unit's set, receives zero bytes for D22 and that is a
               measurement, not an omission: it holds no `h-*`, no `min-h-*`
               and no Card — D22's subject was never there.
               (The forbidden class triple is spelled ONCE in this block, at
               the policy statement above, so a sweep for live overrides is not
               answered by the rule that forbids them.)
             · kf-ControlsPaneWrapper **D-m12** is the same mechanism at a third
               site and is already banked as such.
             · kf-StartingStyleTarget **KF-SST-39** folds by reference to banked
               KF-CB-14 + KF-CB-5 (the 16×16 zero-padding copy target) and is
               DISCHARGED at the bytes: the S-7 reshell removed the caller's
               `w-4 h-4` box, so the copy control owns its own geometry from the
               primitive's size vocabulary — the same policy read from the
               caller's side.
             · ONE RESIDUE FOUND BY THIS SWEEP, DECLARED WITH ITS MECHANISM
               rather than half-cured. `SpringScene.vue`'s domain "Re-seat"
               ribbon button (in this unit's set) carries five utilities on a
               glass `Button` that re-author, inline, the demo's OWN
               `.btn-playback` class used by the sibling button two statements
               up in the same render function: 2rem height, full width, 0.5rem
               gap, pill radius, body size — `playback-idiom.css:18-29` declares
               exactly those five and adds the ruled medium weight the inline
               copy lost. So the interesting defect is not the height utility;
               it is an idiom duplicated one call away from its own class.
               NEITHER cure is this seat's to spend, and the reason is the
               finding: adopting the class does NOT satisfy this policy, because
               `.btn-playback` sets `height` on a glass control too — the
               violation would only move from a utility into a shared class —
               while striking the height outright leaves Re-seat at the
               producer's `md` rung beside a 2rem sibling and visibly breaks the
               ribbon. The subject is the whole `.btn-playback` idiom, shared
               with `PlaybackRibbon.vue` and the easing scene, and its file is
               outside this unit's bounds. Measured for whoever takes it: the
               producer's published rungs are `--control-h-xs` 1.75rem ·
               `-sm` 2.25rem · `-md` 2.5rem · `-lg` 2.75rem (installed dist), so
               2rem names no rung and the ask is a producer rung, never a demo
               height. Routed up as one decision over one idiom.

             D-5 — DISCHARGED, and verified rather than assumed. The row's
             finding was PIXEL IDENTITY: a disabled Undo/Redo looked exactly
             like an enabled one because the demo's own `opacity-50` was the
             SAME value the producer's `:disabled` rule applies
             (`--opacity-disabled: 0.5`), so the disabled state multiplied a
             plate that was already halved and nothing changed. With that
             utility gone (above), the enabled control paints at full ink and
             the disabled one at the producer's half — distinct by construction.
             The row's second clause is PRODUCER-SIDE and stays declared: the
             same rule sets `pointer-events: none`, so its `cursor: not-allowed`
             can never paint and `:hover` never engages. Not cured demo-side. -->
        <!-- X-DS pass 1 (KF-P1-17) — the row LEADS with the pane's name (the
             Keyframes pane's own title rung): it was four right-aligned glyphs
             over an empty left half, so the cluster floated and the pane never
             named itself. -->
        <div class="flex items-center gap-1">
            <h3 class="configurator-section-label mr-auto min-w-0 truncate">Timeline</h3>
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
                        aria-label="Redo"
                        :disabled="!canRedo"
                        @click="redo()"
                    >
                        <Redo2 class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Mod+Shift+Z)</TooltipContent>
            </Tooltip>
            <!-- D-14 — THE DESTRUCTIVE PAIR STOPS SHIPPING UNDIFFERENTIATED.
                 Clear-all (here) and Remove-keyframe (below) carried the same
                 `size` / `emphasis` / geometry / ink as Undo, Redo and Expand:
                 one of these five empties the whole array and nulls the engine,
                 and nothing on screen said so. `tone` is PUBLISHED on the
                 primitive and was unused, and it is not decorative at this
                 emphasis — measured in the installed sheet, `.button
                 [data-emphasis="quiet"]:not([data-tone="neutral"])` paints
                 `color: var(--button-tone)` AT REST, so the destructive rung
                 reads as destructive before the pointer arrives rather than
                 only on hover. Undo is the standing mitigation that holds the
                 row at MAJOR instead of promoting it; it is not a substitute
                 for the control saying what it does.
                 X-DS pass 3 · KF-C3-08 — with nothing to clear it is disabled,
                 so glass's quiet disabled ink mutes the red at rest; the tone
                 returns with the first keyframe.
                 X-DS pass 4 (KF-C4-13) — and at REST it wears its siblings'
                 neutral ink: an alarm hue on an idle control was the loudest
                 mark in the pane. The tone stays bound, so the red arrives
                 where it means something: on hover (glass's quiet hover inks
                 `--button-tone`) and in the press. -->
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        tone="destructive"
                        icon-only
                        class="[--button-quiet-ink:var(--muted-foreground)]"
                        aria-label="Clear all keyframes"
                        :disabled="state.keyframes.length === 0"
                        @click="clearAll()"
                    >
                        <Trash class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all keyframes</TooltipContent>
            </Tooltip>
            <!-- X-DS pass 3 · KF-C3-09 — the affordance says what it does. The
                 unfolded timeline stays in the rail's column (H.W3.S4: a
                 vertical extension of the rail, never a full-grid span, and the
                 stage column's foot is the transport's), so unfolding buys the
                 track HEIGHT (46 → 126px of lanes), not width. "Expand" and the
                 maximize glyph promised a larger surface it never delivered;
                 the vertical unfold/fold pair names the real change. -->
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        icon-only
                        :aria-label="props.expanded ? 'Fold timeline into the pane' : 'Unfold timeline'"
                        @click="emit('toggleExpand')"
                    >
                        <component :is="props.expanded ? FoldVertical : UnfoldVertical" class="icon-sm" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{{ props.expanded ? "Fold timeline into the pane" : "Unfold timeline (taller track)" }}</TooltipContent>
            </Tooltip>
        </div>

        <!-- Preview stage — the ONE subject this instrument's engine paints
             (KF.W7 G2 / C-6): an inert clone of the instrumented element, driven
             by the timeline's own animation. The scene's element is READ by
             `snapshot()` and never written here — the scene keeps its single
             engine.
             UIA-KF-083 — shown only once two keyframes build an animation to
             pose; before that the empty state owns the space.
             UIA-KF-186 — one height in both modes: expanding buys the TRACK
             room, and the preview stays a thumbnail beside it.
             A2-KE-X-2 — `contain: paint` makes the stage the containing block
             and the clip for every descendant of the clone (its faces are
             positioned against the scene, so `overflow` alone let them paint
             over the ruler and the track). -->
        <div
            v-show="state.keyframes.length >= 2"
            ref="previewStage"
            class="timeline-preview-stage relative h-24 overflow-clip [contain:paint] rounded-[var(--radius-media)] border border-border bg-muted/30"
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
            :preview-source="props.targets[0] ?? null"
            @update:scrub-t="scrub"
            @move-keyframe="moveKeyframe"
            @select="(id) => (selectedKeyframeId = id)"
        />

        <!-- D-15 — the three states the instrument used to leave UNEXPRESSED.
             Empty and single-frame are STATES, not errors (G14 P4b): the `< 2`
             contract lives in `rebuild`, and until now its only expression was
             an export-time toast — the one failure reachable BY TYPING was the
             one that never said anything. A failed rebuild is rendered here
             beside the track, with the message and the same Retry the house
             channel offers. -->
        <!-- X-DS pass 3 · KF-C3-12 — both captions take ONE alignment,
             centred and balanced: at 0 keyframes the long line filled the
             card and read start-aligned, at 1 it read centred. -->
        <p
            v-if="state.keyframes.length === 0"
            class="text-body text-muted-foreground text-center text-balance py-2"
        >
            No keyframes yet — <strong>Snapshot</strong> the target's current
            pose, or <strong>Import</strong> CSS <code>@keyframes</code>.
        </p>
        <p
            v-else-if="state.keyframes.length === 1"
            class="text-body text-muted-foreground text-center text-balance py-2"
        >
            One keyframe — one more builds the animation.
        </p>
        <!-- UIA-KF-054 — a failed build is a glass Alert in sentence case,
             not a raw engine message in the uppercase micro-mono eyebrow
             register; the engine's own words stay in the console, where
             `rebuild` already logs them. -->
        <Alert v-if="buildError" tone="destructive" announce="polite">
            <AlertTitle>The animation could not be built</AlertTitle>
            <AlertDescription class="flex items-center justify-between gap-3">
                <span>A keyframe holds a value the engine can't animate.</span>
                <Button size="sm" emphasis="quiet" @click="rebuild()">Retry</Button>
            </AlertDescription>
        </Alert>

        <!-- The selected stop. UIA-KF-045 — the timeline no longer embeds a
             second, per-stop Monaco CSS editor (a third keyframes editor beside
             the Keyframes pane: the owner's one-idiom order, OA-37). The stop
             shows its label (editable), its declarations as a read-only
             summary, and its Remove; the rail's caret says its percent
             (UIA-KF-178). UIA-KF-021 goes with it: there is no 250 px editor
             left to clip in the expanded cell. The enter/leave set is the
             producer's `metric-swap` (D-1/L-1/C-3, PRM-bracketed). -->
        <Transition name="metric-swap">
            <div v-if="selectedKeyframe" class="flex flex-col gap-3">
                <Separator />
                <div class="flex items-center justify-between gap-2">
                    <!-- D-9 + M8 — the user's OWN label, in glass Input's
                         size-driven register (≥16px where iOS zooms), no
                         transform; `aria-label` names it (a placeholder is not
                         a name). UIA-KF-281: the edge is glass Input's own
                         (`.glass-control-edge`); this call site adds none. -->
                    <Input
                        v-model="selectedKeyframeLabel"
                        placeholder="Label..."
                        aria-label="Keyframe label"
                        class="w-40"
                    />
                    <!-- UIA-KF-278 — the destructive glyph family and size the
                         toolbar's Clear uses (a red × read as "close"), named
                         in a tooltip. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                size="sm"
                                emphasis="quiet"
                                tone="destructive"
                                icon-only
                                aria-label="Remove keyframe"
                                @click="removeSelectedKeyframe()"
                            >
                                <Trash2 class="icon-sm" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove keyframe</TooltipContent>
                    </Tooltip>
                </div>
                <dl
                    class="timeline-stop-summary text-mono-small text-muted-foreground flex flex-col gap-0.5"
                    data-register="code"
                >
                    <div
                        v-for="[prop, val] in Object.entries(selectedKeyframe.vars)"
                        :key="prop"
                        class="flex gap-2 break-words"
                    >
                        <dt class="text-foreground shrink-0">{{ prop }}</dt>
                        <dd class="min-w-0">{{ val }}</dd>
                    </div>
                </dl>
            </div>
        </Transition>

        <!-- X-DS pass 2 · KF-C2-04 — THE VERBS TRAVEL WITH THEIR OBJECT. The
             timeline's own authoring row (Snapshot leads, labelled; the three
             CSS paths are named icon commands — A2-KE-L3-15 · UIA-KF-179) is
             THIS component's. In the pane it is teleported to the frame's
             ribbon section, under the pane's one hairline, as the Controls
             surface's playback row is (ChannelOptions → #controls-ribbon-target).
             Expanded, the teleport is off, so the row renders HERE, as the
             floating card's footer: it used to stay behind in the rail as a
             titleless card holding only these four buttons, ~450px from the
             track they act on. A timeline mounted with no pane ribbon in the
             document (`ribbonHost`, read once the tree is in) keeps the row
             in place rather than teleporting into nothing. -->
        <Teleport to="#timeline-ribbon-target" :disabled="props.expanded || !ribbonHost" defer>
            <div class="flex flex-col gap-3">
                <Separator v-if="props.expanded" />
                <div class="flex items-center justify-center gap-2">
                    <Button size="sm" emphasis="secondary" @click="snapshot()">
                        <Camera class="icon-sm" /> Snapshot
                    </Button>
                    <!-- X-DS pass 4 (KF-C4-12) — the three CSS paths are QUIET
                         and LABELLED: download / file-plus / upload never said
                         which was import and which export, and each wore the
                         full capsule skin. The visible word leads each
                         accessible name. -->
                    <Button
                        size="sm"
                        emphasis="quiet"
                        aria-label="Import CSS, replacing the timeline"
                        title="Import CSS (replaces the timeline)"
                        @click="openImportDialog()"
                    >
                        <Download class="icon-sm" /> Import
                    </Button>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        aria-label="Add CSS, merging into the timeline"
                        title="Add CSS (merges into the timeline)"
                        @click="openAddCSSDialog()"
                    >
                        <FilePlus2 class="icon-sm" /> Add
                    </Button>
                    <Button
                        size="sm"
                        emphasis="quiet"
                        aria-label="Export CSS"
                        title="Export CSS"
                        @click="exportCSS()"
                    >
                        <Upload class="icon-sm" /> Export
                    </Button>
                </div>
            </div>
        </Teleport>

        </CardContent>
    </component>

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
import { computed, h, onMounted, ref, shallowRef, toRaw, useTemplateRef, watch } from "vue";
import type { Ref } from "vue";
import {
    Camera,
    Download,
    FoldVertical,
    UnfoldVertical,
    FilePlus2,
    Trash,
    Trash2,
    Undo2,
    Redo2,
    Upload,
} from "@lucide/vue";
import CSSPasteDialog from "./CSSPasteDialog.vue";
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { toast, ToastAction } from "@mkbabb/glass-ui/toast";
import { Input } from "@mkbabb/glass-ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { useTimeline } from "./composables/useTimeline";
import TimelineTrack from "./components/TimelineTrack.vue";
import { createPreviewSubject, fitPreviewSubject } from "./utils/timelineEngine";
import type { TransportClock } from "./timelineTypes";
import { useRafFn, useResizeObserver } from "@vueuse/core";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";

const props = defineProps<{
    targets: HTMLElement[];
    animationOptions?: InputAnimationOptions;
    /** The channel's playing animation — the transport's clock (KFA-55). */
    clock?: TransportClock;
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
    exportCSS,
    importCSS,
    mergeCSS,
    clear,
    undo,
    redo,
    canUndo,
    canRedo,
} = useTimeline(targetsRef, optionsRef, toRaw(props.targets));

// --- The preview subject: what the engine paints (KF.W7 G2 / C-6) ---
//
// Minted once per SOURCE (the instrumented element) and per STAGE, never per
// build — the DOM node is stable across rebuilds. Mounted post-render (no
// write→render edge, LP-1).
// KFA-55 — the timeline is wired to the transport. Scrubbing used to be the
// ONLY driver of `scrubT` (and `scrub` pins the timeline's own engine paused),
// so Play, Pause and Space moved the scene while the playhead and the preview
// stood still. While the channel's clock runs, this one rAF owner mirrors its
// normalized time into the timeline's engine through the same `scrub` a drag
// uses, so the playhead and the painted preview are one position with the
// scene. A paused or unstarted clock leaves the timeline where the user put it.
useRafFn(() => {
    const clock = props.clock;
    if (!clock || !clock.started || clock.paused || !animation.value) return;
    const duration = clock.options.duration;
    if (duration > 0) scrub(clock.t / duration);
});

const previewStage = useTemplateRef<HTMLElement>("previewStage");
const previewSubject = shallowRef<HTMLElement | null>(null);

watch(
    [() => props.targets[0], previewStage],
    ([source, stage]) => {
        const subject = source && stage ? createPreviewSubject(source) : null;
        previewSubject.value = subject;
        if (stage && subject && source) fitPreviewSubject(stage, subject, source);
        else stage?.replaceChildren();
    },
    { immediate: true, flush: "post" },
);

// The stage is shown only once there is an animation to pose (UIA-KF-083), and
// it changes size with the pane: re-fit whenever its box does.
useResizeObserver(previewStage, () => {
    const stage = previewStage.value;
    const subject = previewSubject.value;
    const source = props.targets[0];
    if (stage && subject && source) fitPreviewSubject(stage, subject, source);
});

// THE INVARIANT: every animation this instrument builds is rebound to the
// subject in the same synchronous step that publishes it (`flush: "sync"`
// fires inside `animation.value = …`), so no frame is ever applied to a scene
// element. With no subject yet, the engine is bound to NOTHING — it paints
// nowhere rather than the scene.
watch(
    [animation, previewSubject],
    ([anim, subject]) => {
        anim?.setTargets(...(subject ? [subject] : []));
        // KFA-121 — a fresh subject or a fresh build shows the PLAYHEAD's pose
        // at once, not whatever pose the clone was made in.
        if (anim && subject) scrub(scrubT.value);
    },
    { immediate: true, flush: "sync" },
);

// X-DS pass 2 · KF-C2-04 — the pane ribbon the verbs teleport to while the
// timeline sits in the pane. Read after mount: the ribbon is a LATER sibling in
// the pane host, so its element exists only once the whole tree is inserted.
const ribbonHost = ref(false);
onMounted(() => {
    ribbonHost.value = document.getElementById("timeline-ribbon-target") !== null;
});

const selectedKeyframeId = ref<string | null>(null);
const importDialogOpen = ref(false);
const addCSSDialogOpen = ref(false);

const selectedKeyframe = computed(() =>
    state.value.keyframes.find((kf) => kf.id === selectedKeyframeId.value),
);

// N-2 — `label` is optional, and an empty box means "no label", not "the empty
// label": writing `""` into state would deep-clone an empty string into all 50
// undo snapshots. The model is also what makes the control typed honestly
// against `exactOptionalPropertyTypes` (the `string | undefined` the raw field
// carried is not assignable to the Input's model).
const selectedKeyframeLabel = computed<string>({
    get: () => selectedKeyframe.value?.label ?? "",
    set: (value) => {
        const kf = selectedKeyframe.value;
        if (!kf) return;
        if (value === "") delete kf.label;
        else kf.label = value;
    },
});

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

/**
 * UIA-KF-182 — Clear all empties the timeline in one press; it now says so and
 * offers the way back in the same breath (the house toast with an Undo action),
 * as the app's other destructive clears do. Undo restores exactly the stops
 * that were cleared and rebuilds.
 */
const clearAll = () => {
    const cleared = state.value.keyframes;
    if (cleared.length === 0) return;
    clear();
    selectedKeyframeId.value = null;
    toast({
        title: `Cleared ${cleared.length} keyframe${cleared.length === 1 ? "" : "s"}`,
        action: h(
            ToastAction,
            {
                altText: "Undo clear",
                onClick: () => {
                    state.value.keyframes = cleared;
                    void rebuild();
                },
            },
            () => "Undo",
        ),
    });
};

const removeSelectedKeyframe = () => {
    if (selectedKeyframeId.value) {
        removeKeyframe(selectedKeyframeId.value);
        selectedKeyframeId.value = null;
    }
};

// L-12/C-8 — the published contract is the SEVEN verbs its consumers actually
// call, measured at the frontier: `snapshot` · `openImportDialog` · `exportCSS`
// · `openAddCSSDialog` (RibbonBar) and `removeSelectedKeyframe` · `undo` ·
// `redo` (useControlsKeyboardShortcuts). `selectedKeyframeId`, `canUndo` and
// `canRedo` were published and taken by NOBODY — three reads that made the
// instrument's private state look like an API. `canUndo`/`canRedo` stay LIVE
// inside this component (they bound the two buttons above) and on the
// composable; they are simply not part of what this component publishes.
defineExpose({
    snapshot,
    openImportDialog,
    openAddCSSDialog,
    exportCSS,
    removeSelectedKeyframe,
    undo,
    redo,
});
</script>

<!-- J.W7b S1d — the 4 hand-rolled enter/leave transition rules are GONE: the
     inline keyframe editor consumes a PUBLISHED, PRM-guarded <Transition> class
     set instead of re-authoring one. D-1/L-1/C-3: the set it named until now
     (`fade-slide`) is retired at the producer and ships in no artifact, so the
     transition was a no-op under a comment that claimed a line range; it now
     names `metric-swap`, which the installed `styles/transitions.css` really
     carries, PRM bracket included. -->
