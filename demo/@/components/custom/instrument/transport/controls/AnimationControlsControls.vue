<template>
    <div class="grid items-center gap-4">
        <Card surface="cartoon" tier="quiet" class="w-full overflow-visible">
            <CardContent class="relative flex flex-col gap-2 px-4 py-3">
                <!-- Sliding panel container — each panel in its own collapsible row -->
                <div class="panel-stack relative">
                    <!-- Main controls panel -->
                    <div :class="['panel-row', !(showDetailPanel || advancedOpen) ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content flex flex-col gap-2 w-full">
                            <!-- H.W11.I1 — the label rows share ONE uniform label
                                 column via the `.labeled-field-grid` subgrid idiom
                                 (design-idioms.css §LABEL-subgrid): the WIDEST label
                                 (here "fill mode" / "iterations") sets the track, every
                                 row's label cell resolves the SAME width — REPLACES the
                                 W9-era per-row `:deep(.labeled-field){auto 1fr}` (each
                                 row its own width). -->
                            <div class="labeled-field-grid">
                                <LabeledInput
                                    :model-value="storedAnimationOptions.animationOptions.duration ?? '5s'"
                                    label="duration"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Animation length (e.g. 5s, 200ms)"
                                    @update:model-value="(v) => { trySetOption(() => animation.setDuration(v)); storedAnimationOptions.animationOptions.duration = v; }"
                                />

                                <LabeledInput
                                    :model-value="storedAnimationOptions.animationOptions.delay ?? '0ms'"
                                    label="delay"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Delay before start (e.g. 0s, 500ms)"
                                    @update:model-value="(v) => { trySetOption(() => animation.setDelay(v)); storedAnimationOptions.animationOptions.delay = v; }"
                                />

                                <LabeledInput
                                    :model-value="
                                        storedAnimationOptions.animationOptions.iterationCount === 'infinite' || storedAnimationOptions.animationOptions.iterationCount === Infinity
                                            ? '∞'
                                            : String(storedAnimationOptions.animationOptions.iterationCount ?? 'infinite')
                                    "
                                    label="iterations"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Repeat count (number or 'infinite')"
                                    @update:model-value="
                                        (v: string) => {
                                            trySetOption(() => animation.setIterationCount(v));
                                            storedAnimationOptions.animationOptions.iterationCount = v;
                                        }
                                    "
                                />

                                <LabeledSelect
                                    :model-value="storedAnimationOptions.animationOptions.direction ?? 'normal'"
                                    :is-open="isOpen('direction')"
                                    :items="directions"
                                    :descriptions="DIRECTION_DESCRIPTIONS"
                                    label="direction"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Playback direction"
                                    @update:model-value="(v) => { animation.setDirection(v as any); storedAnimationOptions.animationOptions.direction = v as any; }"
                                    @update:open="(v: boolean | undefined) => setOpen('direction', v ?? false)"
                                />

                                <LabeledSelect
                                    :model-value="storedAnimationOptions.animationOptions.fillMode ?? 'forwards'"
                                    :is-open="isOpen('fillMode')"
                                    :items="fillModes"
                                    :descriptions="FILL_MODE_DESCRIPTIONS"
                                    label="fill mode"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Style applied when not playing"
                                    @update:model-value="(v) => { animation.setFillMode(v as any); storedAnimationOptions.animationOptions.fillMode = v as any; }"
                                    @update:open="(v: boolean | undefined) => setOpen('fillMode', v ?? false)"
                                />
                            </div>

                            <!-- Easing field: ONE full-width unit (the label-row + edit
                                 pencil stacked OVER the EasingSelect), matching the
                                 LabeledField single-cell shape. glass-ui 3.4.0
                                 <LabeledField> exposes only default+error slots (no
                                 label-action slot, VERIFIED LabeledField.vue.d.ts) — so
                                 this is the wrapper fallback (WV-W3-LOW-1); a glass-ui
                                 label-action slot is BOOKED as an OPTIONAL handoff. -->
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-1.5">
                                    <IconTooltip text="Timing function curve">
                                        <label :class="['text-small font-medium text-muted-foreground cursor-help', isDetailEasing ? 'gold-shimmer' : '']">easing</label>
                                    </IconTooltip>
                                    <IconTooltip text="Edit easing curve">
                                        <!-- `easing-edit-btn` is the NAMED BEHAVIORAL SEAM (the
                                             pencil hook proof:bezier-{no-scroll,single-card,grown}
                                             click to open the detail panel) — it carries NO style;
                                             STY-4 deleted only its scoped color RULE (the color now
                                             rides the owned `.text-gold` idiom). -->
                                        <DockIconButton compact title="Edit easing curve" class="easing-edit-btn text-gold" @click.stop="onEditIconClick(storedAnimationOptions.animationOptions.timingFunction as string)">
                                            <Pencil class="icon-sm" />
                                        </DockIconButton>
                                    </IconTooltip>
                                </div>
                                <!-- I.W2.S3 — the dropdown's model-value is the
                                     KIND (literal-aware), and the persist is the
                                     ONE seam (`updateTimingFunctionFromName`, which
                                     writes the COMPLETE re-parseable literal). The
                                     former trailing `= key` poke (which re-wrote
                                     the bare `cubic-bezier`/`steps` token over the
                                     literal → the re-mount `AnimationOptionError`)
                                     is DELETED. -->
                                <EasingSelect
                                    :model-value="timingFunctionKind(storedAnimationOptions.animationOptions.timingFunction)"
                                    :timing-functions-and="timingFunctionsAnd"
                                    @update:model-value="(key: string) => updateTimingFunctionFromName(key)"
                                />
                            </div>

                            <Separator class="my-1" />

                            <!-- Advanced — navigate to sub-pane -->
                            <div
                                @click="advancedOpen = true"
                                role="button"
                                tabindex="0"
                                @keydown.enter="advancedOpen = true"
                                @keydown.space.prevent="advancedOpen = true"
                                class="flex items-center justify-between gap-x-3 w-full py-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
                            >
                                <span class="text-small font-medium">advanced</span>
                                <div class="flex items-center justify-end px-3">
                                    <ChevronRight class="icon-md opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <div :class="['panel-row panel-row--detail', showDetailPanel ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content">
                            <TimingFunctionPanel
                                :animation="animation"
                                :stored-animation-options="storedAnimationOptions"
                                :timing-functions-and="timingFunctionsAnd"
                                :progress="normalizedProgress"
                                @exit-detail-panel="exitDetailPanel"
                                @update-timing-function="updateTimingFunctionFromName"
                            />
                        </div>
                    </div>

                    <!-- Advanced sub-pane -->
                    <div :class="['panel-row', advancedOpen && !showDetailPanel ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content flex flex-col gap-2 w-full">
                            <div class="flex items-center gap-1 mb-1">
                                <DockIconButton
                                    compact
                                    title="Back"
                                    class="text-muted-foreground"
                                    @click="advancedOpen = false"
                                >
                                    <ArrowLeft class="icon-md" />
                                </DockIconButton>
                                <span class="text-small font-medium text-muted-foreground">advanced</span>
                            </div>

                            <!-- Layer Settings (only when the animation has a layer).
                                 H.W11.I1 — LayerConfigPanel's blend / z-index / weight /
                                 enabled `.labeled-field` rows join the SAME uniform
                                 label-column subgrid (the `.labeled-field-grid` wrapper);
                                 LayerConfigPanel does NOT re-author the rule (one DRY
                                 source, design-idioms.css §LABEL-subgrid). -->
                            <div v-if="layerConfig" class="labeled-field-grid">
                                <LayerConfigPanel
                                    :layer-config="layerConfig"
                                    :is-open="isOpen"
                                    :set-open="setOpen"
                                    @update="(v) => emit('layerConfigUpdate', v)"
                                />
                            </div>

                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>

        <!-- Playback controls: teleported to ribbon when this is the active animation -->
        <Teleport v-if="active" to="#controls-ribbon-target" defer>
            <PlaybackRibbon
                :animation="animation"
                :current-t="currentT"
                :is-anim-playing="isAnimPlaying"
                :is-anim-started="isAnimStarted"
                :user-reversed="userReversed"
                @scrub-start="() => { wake(); emit('scrubStart'); }"
                @scrub-end="emit('scrubEnd')"
                @scrubbed="wake"
                @slider-update="(v) => { wake(); emit('sliderUpdate', v); }"
                @toggle-play="toggleAnimation"
                @toggle-reverse="toggleReverse"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import { Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { DockIconButton } from "@mkbabb/glass-ui/dock";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import { LabeledSelect, LabeledInput } from "@mkbabb/glass-ui/labeled-field";

import { ChevronRight, ArrowLeft, Pencil } from "@lucide/vue";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import PlaybackRibbon from "./PlaybackRibbon.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import { useAnimationSync } from "../composables/useAnimationSync";
import { usePlaybackToggle } from "../composables/usePlaybackToggle";
import { useTimingFunctionEditor } from "../composables/useTimingFunctionEditor";
import EasingSelect from "@components/custom/instrument/easing/EasingSelect.vue";

import { Teleport, computed, onMounted, ref, toRef } from "vue";
import {
    getStoredAnimationOptions,
} from "@state";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import type {
    AnimationLayerConfig,
    TimingFunctionNames,
    AnimationOptions,
} from "@mkbabb/keyframes.js";
import {
    DIRECTION_DESCRIPTIONS,
    FILL_MODE_DESCRIPTIONS,
    timingFunctionKind,
} from "../animationDescriptions";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(props.animation);

/**
 * The engine setters are fail-explicit — a malformed PRESENT value throws
 * an `AnimationOptionError` (B.W2). User input mid-keystroke is routinely
 * malformed (an empty field, a partial number), so guard the live handlers:
 * an empty value is omission (no-op), anything else attempts the set and
 * swallows the typed error until the input is valid. The store still
 * records the raw string so the field round-trips.
 */
const trySetOption = (apply: () => void) => {
    try {
        apply();
    } catch (e) {
        if ((e as Error)?.name !== "AnimationOptionError") throw e;
        // malformed-in-progress input — ignore until it parses
    }
};

const {
    timingFunctionsAnd,
    convertedFromName,
    advancedOpen,
    isDetailEasing,
    showDetailPanel,
    onEditIconClick,
    exitDetailPanel,
    updateTimingFunctionFromName,
} = useTimingFunctionEditor(() => props.animation, storedAnimationOptions);

// Exclusive select mutex: only one dropdown open at a time
const openSelect = ref<string | null>(null);
const isOpen = (name: string) => openSelect.value === name;
const setOpen = (name: string, open: boolean) => { openSelect.value = open ? name : null; };

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
// isPlaying guard comes from the parent (useAnimationGroupPlayback) — not polled.
const isPlayingRef = toRef(() => props.isPlaying ?? false);
const { currentT, isPlaying: isAnimPlaying, isStarted: isAnimStarted, wake } = useAnimationSync(() => props.animation, isPlayingRef);

const normalizedProgress = computed(() => {
    const dur = props.animation.options.duration;
    if (!dur || dur <= 0) return 0;
    return Math.max(0, Math.min(1, currentT.value / dur));
});

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: KeyframesAnimation<any>;
        },
    ): void;
    (e: "togglePlay"): void;
    (e: "layerConfigUpdate", val: Partial<AnimationLayerConfig>): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

const { userReversed, toggleAnimation, toggleReverse } = usePlaybackToggle(
    () => props.animation,
    () => emit("togglePlay"),
);

// L.W8 S1 ED-3 — DIRECTIONS / FILL_MODES are HEAVY (const tuples on the engine
// surface); they ride loadAnimationEngine() rather than a deep @src import. The
// select items populate within microtasks of mount (well before the panel is
// interactive); until then the dropdowns render empty — an honest pre-load frame.
const directions = ref<readonly AnimationOptions["direction"][]>([]);
const fillModes = ref<readonly AnimationOptions["fillMode"][]>([]);

onMounted(async () => {
    updateTimingFunctionFromName(
        storedAnimationOptions.animationOptions.timingFunction as TimingFunctionNames,
    );

    const engine = await loadAnimationEngine();
    directions.value = engine.DIRECTIONS;
    fillModes.value = engine.FILL_MODES;
});
</script>

<style scoped>
/* Collapsible panel rows: each panel in its own row that animates height via grid-template-rows */
.panel-row {
    /* The crossfade: display:grid + grid-template-rows 0fr↔1fr is the
       collapse animation (ALREADY-SOTA — KEEP display:grid). The former
       subgrid column-template + the 1/-1 column-span were the two-track
       subgrid-propagation chain (H.W3.S1 collapsed the parent to a single
       column) — DELETED; the row is now a single implicit-column grid. */
    display: grid;
    transition: grid-template-rows var(--duration-normal) var(--ease-standard);
}
.panel-row--active {
    grid-template-rows: 1fr;
}
.panel-row--inactive {
    grid-template-rows: 0fr;
}
.panel-content {
    overflow: hidden;
    min-height: 0;
    /* Inset padding so focus rings (ring-2 + ring-offset-2 = 4px) aren't clipped
       by the overflow:hidden required for grid-template-rows collapse animation. */
    padding: 2px;
    margin: -2px;
    transition: opacity var(--duration-normal) var(--ease-standard);
}
.panel-row--active > .panel-content {
    opacity: 1;
    pointer-events: auto;
}
.panel-row--inactive > .panel-content {
    opacity: 0;
    pointer-events: none;
}

/* Constrain detail panel height so the bezier editor doesn't shift the page.
   J.W7b STY-2 — `50dvh` (dynamic viewport): tracks the real visible height on
   mobile (no URL-bar over-reservation); identical to 50vh on desktop. The
   honest host-cap fix, not a scoped override band-aid. */
.panel-row--detail.panel-row--active > .panel-content {
    max-height: min(50dvh, 480px);
    overflow-y: auto;
}

/* H.W11.I1 — the per-row `:deep(.labeled-field){auto 1fr}` rule (W9 F1, each row
   its OWN `auto` label width) is GONE — REPLACED by the `.labeled-field-grid`
   subgrid idiom (design-idioms.css §LABEL-subgrid), applied to the field-row
   wrappers in the template above so the label column is UNIFORM across rows (one
   derived width from the widest label). No legacy beside the replacement: the
   demo CONSUMES the shared idiom, it does not re-author the per-row rule. The
   single-column-pack invariant holds (the subgrid keeps ONE left edge per row).
   The `:deep` was needed because the rule reached glass-ui's `.labeled-field`
   across the shadow boundary; the idiom is GLOBAL (design-idioms.css, unscoped),
   so it reaches `.labeled-field` directly with no `:deep`. */

/* J.W7b STY-4 — the former `.easing-edit-btn { color: var(--color-gold) }`
   scoped rule is DELETED: it bypassed the demo-owned `.text-gold` idiom
   (design-idioms.css) to read the same token. The call site now wears
   `text-gold` directly — one idiom, one home, identical computed color. */
</style>
