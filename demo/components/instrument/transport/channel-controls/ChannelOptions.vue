<template>
    <div class="grid items-center gap-4">
        <Card cartoon tier="quiet" class="w-full overflow-visible">
            <CardContent class="relative flex flex-col gap-2 px-4 py-3">
                <!-- Sliding panel container — each panel in its own collapsible row.
                     KF-CO-5 ≡ KF-TFP-7 + KF-CO-46 — a COLLAPSED row is `inert`:
                     `grid-template-rows: 0fr` + `overflow: hidden` + `opacity: 0`
                     hide it from sight and the pointer, but every control inside
                     stayed in the Tab order and the accessibility tree, so a
                     keyboard user tabbed through invisible inputs and a reader
                     announced the collapsed panel's fields as live. The
                     attribute removes the row's subtree from focus, hit-testing
                     and the tree in one stroke. Residual, stated: `inert` also
                     excludes the subtree from find-in-page — the two collapsed
                     rows are not searchable while closed. -->
                <div class="panel-stack relative">
                    <!-- Main controls panel -->
                    <div
                        :class="[
                            'panel-row',
                            !(showDetailPanel || advancedOpen)
                                ? 'panel-row--active'
                                : 'panel-row--inactive',
                        ]"
                        :inert="showDetailPanel || advancedOpen"
                    >
                        <div class="panel-content flex w-full flex-col gap-2">
                            <!-- H.W11.I1 — the label rows share ONE uniform label
                                 column via the `.labeled-field-grid` subgrid idiom
                                 (design-idioms.css §LABEL-subgrid): the WIDEST label
                                 (here "fill mode" / "iterations") sets the track, every
                                 row's label cell resolves the SAME width — REPLACES the
                                 W9-era per-row `:deep(.labeled-field){auto 1fr}` (each
                                 row its own width). -->
                            <div class="labeled-field-grid">
                                <!-- KF-CO-3 — every option handler is ONE guarded
                                     commit (`commitOption`): the engine write is
                                     tried, the store is written ONLY on
                                     acceptance, and a rejection is surfaced
                                     through the producer's `invalid` + `#error`
                                     seam with the engine's own message. -->
                                <LabeledInput
                                    :model-value="
                                        storedAnimationOptions.animationOptions
                                            .duration ?? '5s'
                                    "
                                    label="duration"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Animation length (e.g. 5s, 200ms)"
                                    :invalid="invalidField === 'duration'"
                                    @update:model-value="
                                        (v) =>
                                            commitOption(
                                                'duration',
                                                v,
                                                (d) => animation.setDuration(d),
                                                (d) => {
                                                    storedAnimationOptions.animationOptions.duration =
                                                        d;
                                                },
                                            )
                                    "
                                >
                                    <template #error>{{ invalidMessage }}</template>
                                </LabeledInput>

                                <LabeledInput
                                    :model-value="
                                        storedAnimationOptions.animationOptions
                                            .delay ?? '0ms'
                                    "
                                    label="delay"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Delay before start (e.g. 0s, 500ms)"
                                    :invalid="invalidField === 'delay'"
                                    @update:model-value="
                                        (v) =>
                                            commitOption(
                                                'delay',
                                                v,
                                                (d) => animation.setDelay(d),
                                                (d) => {
                                                    storedAnimationOptions.animationOptions.delay =
                                                        d;
                                                },
                                            )
                                    "
                                >
                                    <template #error>{{ invalidMessage }}</template>
                                </LabeledInput>

                                <!-- N-4 (KF-CO-40) — ONE stored spelling of
                                     forever: the store holds `"infinite"`; the
                                     field DISPLAYS it as `∞`, and a typed `∞`
                                     (which the engine accepts) is persisted as
                                     `"infinite"`. The former `=== Infinity` arm
                                     compared a persisted string against a
                                     number and was unreachable. -->
                                <LabeledInput
                                    :model-value="
                                        storedAnimationOptions.animationOptions
                                            .iterationCount === 'infinite'
                                            ? '∞'
                                            : String(
                                                  storedAnimationOptions
                                                      .animationOptions
                                                      .iterationCount ??
                                                      'infinite',
                                              )
                                    "
                                    label="iterations"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Repeat count (number or 'infinite')"
                                    :invalid="invalidField === 'iterationCount'"
                                    @update:model-value="
                                        (v: string | number) =>
                                            commitOption(
                                                'iterationCount',
                                                v,
                                                (n) =>
                                                    animation.setIterationCount(n),
                                                (n) => {
                                                    storedAnimationOptions.animationOptions.iterationCount =
                                                        n === '∞' ||
                                                        n === 'Infinity'
                                                            ? 'infinite'
                                                            : n;
                                                },
                                            )
                                    "
                                >
                                    <template #error>{{ invalidMessage }}</template>
                                </LabeledInput>

                                <LabeledSelect
                                    :model-value="
                                        storedAnimationOptions.animationOptions
                                            .direction ?? 'normal'
                                    "
                                    :open="isOpen('direction')"
                                    :items="directions"
                                    :descriptions="DIRECTION_DESCRIPTIONS"
                                    label="direction"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Playback direction"
                                    @update:model-value="
                                        (v) => {
                                            if (!isOneOf(directions, v)) return;
                                            commitOption(
                                                'direction',
                                                v,
                                                (d) => animation.setDirection(d),
                                                (d) => {
                                                    storedAnimationOptions.animationOptions.direction =
                                                        d;
                                                },
                                            );
                                        }
                                    "
                                    @update:open="
                                        (v: boolean | undefined) =>
                                            setOpen('direction', v ?? false)
                                    "
                                />

                                <LabeledSelect
                                    :model-value="
                                        storedAnimationOptions.animationOptions
                                            .fillMode ?? 'forwards'
                                    "
                                    :open="isOpen('fillMode')"
                                    :items="fillModes"
                                    :descriptions="FILL_MODE_DESCRIPTIONS"
                                    label="fill mode"
                                    label-class="text-small font-medium text-muted-foreground"
                                    tooltip="Style applied when not playing"
                                    @update:model-value="
                                        (v) => {
                                            if (!isOneOf(fillModes, v)) return;
                                            commitOption(
                                                'fillMode',
                                                v,
                                                (f) => animation.setFillMode(f),
                                                (f) => {
                                                    storedAnimationOptions.animationOptions.fillMode =
                                                        f;
                                                },
                                            );
                                        }
                                    "
                                    @update:open="
                                        (v: boolean | undefined) =>
                                            setOpen('fillMode', v ?? false)
                                    "
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
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <!-- KF-CO-18 (W6-M) — `.gold-shimmer`
                                                 COULD NOT PAINT at this call
                                                 site, and the mechanism is a
                                                 layer contest the call site
                                                 lost unconditionally. The
                                                 producer's utility (measured in
                                                 the installed
                                                 `styles/utilities/base-misc.css`)
                                                 paints a gold gradient and
                                                 CLIPS IT TO THE TEXT, which
                                                 only works because the same
                                                 rule sets `color: transparent`
                                                 — and that whole sheet is
                                                 `@layer components`, while
                                                 `text-muted-foreground` is a
                                                 real utility in the LAST layer.
                                                 The class list handed the
                                                 shimmer a colour it could never
                                                 win against, so the gradient
                                                 sat behind opaque muted ink and
                                                 the ONLY rendered
                                                 acknowledgment that a DETAIL
                                                 easing is selected never
                                                 appeared — which is what makes
                                                 KF-CO-23's dropdown a SILENT
                                                 dead end rather than a merely
                                                 quiet one.
                                                 The cure is the glass-consumption
                                                 half: the colour utility is
                                                 DROPPED while shimmering rather
                                                 than fought with a second
                                                 declaration, so the two are
                                                 alternatives on one axis and
                                                 neither is overridden. (The
                                                 other admissible arm — a vendor
                                                 variant that owns its own ink —
                                                 is the producer's and is not
                                                 authored demo-side.) -->
                                            <label
                                                :class="[
                                                    'text-small cursor-help font-medium',
                                                    isDetailEasing
                                                        ? 'gold-shimmer'
                                                        : 'text-muted-foreground',
                                                ]"
                                                >easing</label
                                            >
                                        </TooltipTrigger>
                                        <TooltipContent>Timing function curve</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                        <!-- `easing-edit-btn` names the pencil and nothing reads
                                             it (KF-CO-33, KF.W6): no rule, no script and no test
                                             selector in the tree keys on the class — it is a label,
                                             not a seam. Delete-or-wire is OPTIONS-UNIT's.
                                             KF-CO-19 — THE INK. This pencil wore `text-gold`, and
                                             gold is a SPARKLE ACCENT: on the light card it is the
                                             lowest-contrast ink the demo ships, and it was the ONLY
                                             ink on an edit affordance. The row's banked cure names
                                             a light-arm gold token at `design-idioms.css:36`, and
                                             that token NO LONGER EXISTS — this wave's own audit
                                             retired the demo's `--color-gold` pin, its two arms and
                                             its `.text-gold` rule as a zero-delta shadow of the
                                             producer's `--gold` (RB-2: the shadow's whole cost was
                                             keeping a producer retune from ever arriving). Re-minting
                                             a demo-side light-arm gold to cure contrast would restore
                                             exactly that shadow one commit after it was retired, so
                                             the cure is taken at the role instead of at the token:
                                             the glyph drops to the producer's OWN muted-icon ink
                                             (`.dock-icon-button` mixes `--foreground` at
                                             `--opacity-icon-muted`), and gold keeps its decorative
                                             homes untouched. Root-styling law, and no demo-side
                                             producer patch.
                                             KF-CO-24 — THE BOX. `compact` is gone. glass's
                                             coarse-pointer floor is written
                                             `.dock-icon-button:not(.dock-icon-button--compact)`, so
                                             the modifier EXCLUDED this control from the only floor
                                             that can reach it — and after KF-SST-30 voided the
                                             producer's decorative hit-expander utility (its expander
                                             carries `pointer-events: none`) and the wave retired the
                                             demo's own hand-authored floor class, which had zero
                                             adopters, the producer's per-component floor is the one
                                             sanctioned
                                             mechanism left. Neither retired name is spelled here, so
                                             the scanner cannot resurrect either into the built sheet;
                                             those rows are annotated, not rewritten (E-3). This control is mounted in the controls
                                             pane, never inside `GlassDock` (the only `.glass-dock`
                                             host is ChromeDock), so the rule's second `:not()` does
                                             not exclude it either. Rendered boxes → SS-13. -->
                                        <DockControl
                                            ref="pencilEl"
                                            shape="icon"
                                            title="Edit easing curve"
                                            class="easing-edit-btn"
                                            @click.stop="openDetailEditor"
                                        >
                                            <Pencil class="icon-sm" />
                                        </DockControl>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit easing curve</TooltipContent>
                                    </Tooltip>
                                </div>
                                <!-- I.W2.S3 — the dropdown's model-value is the
                                     KIND (literal-aware), and the persist is the
                                     ONE seam (`updateTimingFunctionFromName`, which
                                     writes the COMPLETE re-parseable literal).
                                     T.E8 + OD-5 R2 — the bespoke EasingSelect (and
                                     its tiny hand-plotted trigger-curve, the
                                     rejected "top-left curve preview") died with
                                     the instrument/easing cluster: this is the
                                     standard glass-ui Select over the SAME
                                     family-grouped named-curve catalogue; the
                                     CURVE rendering now lives in the vendor
                                     EasingPicker (detail panel) + the T.E6
                                     gallery sparklines. -->
                                <Select
                                    :model-value="selectedCurveKey"
                                    @update:model-value="
                                        (key) =>
                                            updateTimingFunctionFromName(
                                                String(key),
                                            )
                                    "
                                >
                                    <SelectTrigger aria-label="Timing function">
                                        <SelectValue
                                            placeholder="Pick a curve"
                                        />
                                    </SelectTrigger>
                                    <SelectContent
                                        class="max-h-[var(--easing-dropdown-max-h)]"
                                    >
                                        <template
                                            v-for="(group, gi) in EASING_GROUPS"
                                            :key="group.family"
                                        >
                                            <SelectSeparator v-if="gi > 0" />
                                            <SelectGroup>
                                                <!-- KF-CO-25 + KF-CO-30, one register
                                                     pass for the card (W6-G). The
                                                     family heading wore the 10px
                                                     admin-chip register inside a
                                                     dropdown whose items render at
                                                     the dropdown rung, and its
                                                     horizontal padding was inert
                                                     against the primitive's own
                                                     `pl-8` (the `cn` merge keys
                                                     padding-x and padding-left as
                                                     separate groups). A group label
                                                     is a UI label (role (d)): it
                                                     takes SelectLabel's shipped
                                                     register and keeps only the
                                                     muted ink. -->
                                                <SelectLabel class="text-muted-foreground">
                                                    {{ group.family }}
                                                </SelectLabel>
                                                <SelectItem
                                                    v-for="curveItem in group.items"
                                                    :key="curveItem.name"
                                                    :value="curveItem.name"
                                                    class="pr-2"
                                                >
                                                    <span
                                                        class="flex w-full
                                                            min-w-0 items-center
                                                            gap-1.5"
                                                    >
                                                        <!-- KF-CO-30 — the curve NAME
                                                             is a code identifier
                                                             (role (b): mono,
                                                             case-preserving, marked
                                                             for the census); the
                                                             DESCRIPTION is UI prose
                                                             (role (d): the dropdown's
                                                             secondary text rung).
                                                             Both carried a case-
                                                             cancel utility that
                                                             cancelled NOTHING —
                                                             nothing in this portalled
                                                             subtree or the installed
                                                             producer sets a
                                                             transform on select
                                                             items (measured: the only
                                                             producer uppercase rules
                                                             are the timeline
                                                             popover's) — so the
                                                             inert pair is retired
                                                             rather than paired
                                                             (MM-29: a case cancel
                                                             that survives must pair
                                                             its tracking cancel; one
                                                             that cancels nothing is
                                                             removed, and G-W6-8's
                                                             census reads two sites
                                                             fewer). -->
                                                        <span
                                                            data-register="code"
                                                            class="font-mono"
                                                            >{{
                                                                curveItem.name
                                                            }}</span
                                                        >
                                                        <span
                                                            class="text-dropdown-secondary
                                                                text-muted-foreground
                                                                ml-auto pl-2
                                                                leading-tight
                                                                whitespace-nowrap"
                                                            >{{
                                                                curveItem.description
                                                            }}</span
                                                        >
                                                    </span>
                                                </SelectItem>
                                            </SelectGroup>
                                        </template>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator class="my-1" />

                            <!-- Advanced — navigate to sub-pane -->
                            <div
                                ref="advancedRowEl"
                                @click="openAdvanced"
                                role="button"
                                tabindex="0"
                                @keydown.enter="openAdvanced"
                                @keydown.space.prevent="openAdvanced"
                                class="hover:text-foreground
                                    text-muted-foreground flex w-full
                                    cursor-pointer items-center justify-between
                                    gap-x-3 py-1.5 transition-colors"
                            >
                                <span class="text-small font-medium"
                                    >advanced</span
                                >
                                <div class="flex items-center justify-end px-3">
                                    <!-- KF-CO-20 — the ONLY navigability mark in
                                         this pane, and it failed in BOTH theme
                                         arms because `opacity-50` was applied to
                                         an ALREADY-muted role: the parent row
                                         hands down `--muted-foreground` (and
                                         `--foreground` on hover), and halving it
                                         caps the ratio below any arm's reach.
                                         Deleting the alpha IS the real rung —
                                         the row already carries the muted→ink
                                         hover pair the chevron wants. Exact
                                         composites → SS-13. -->
                                    <ChevronRight class="icon-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <div
                        :class="[
                            'panel-row panel-row--detail',
                            showDetailPanel
                                ? 'panel-row--active'
                                : 'panel-row--inactive',
                        ]"
                        :inert="!showDetailPanel"
                    >
                        <div class="panel-content">
                            <!-- KF-CO-16 — the panel mounts only while shown.
                                 The former always-mounted panel carried a
                                 `progress` prop it never read, bound to the
                                 rAF-polled `currentT`: the sole per-frame render
                                 dependency of every INACTIVE channel. Both are
                                 deleted; the picker's truth lives in the store,
                                 so nothing is lost across a close. -->
                            <TimingFunctionPanel
                                v-if="showDetailPanel"
                                ref="detailPanelEl"
                                :stored-animation-options="
                                    storedAnimationOptions
                                "
                                :converted-from="convertedFromName"
                                @exit-detail-panel="closeDetailEditor"
                                @update-timing-function="
                                    updateTimingFunctionFromName
                                "
                            />
                        </div>
                    </div>

                    <!-- Advanced sub-pane -->
                    <div
                        :class="[
                            'panel-row',
                            advancedOpen && !showDetailPanel
                                ? 'panel-row--active'
                                : 'panel-row--inactive',
                        ]"
                        :inert="!(advancedOpen && !showDetailPanel)"
                    >
                        <div class="panel-content flex w-full flex-col gap-2">
                            <div class="mb-1 flex items-center gap-1">
                                <DockControl
                                    ref="advancedBackEl"
                                    shape="icon"
                                    compact
                                    title="Back"
                                    class="text-muted-foreground"
                                    @click="closeAdvanced"
                                >
                                    <ArrowLeft class="icon-md" />
                                </DockControl>
                                <span
                                    class="text-small text-muted-foreground
                                        font-medium"
                                    >advanced</span
                                >
                            </div>

                            <!-- Layer Settings (only when the animation has a layer).
                                 H.W11.I1 — LayerConfigPanel's blend / z-index / weight /
                                 enabled `.labeled-field` rows join the SAME uniform
                                 label-column subgrid (the `.labeled-field-grid` wrapper);
                                 LayerConfigPanel does NOT re-author the rule (one DRY
                                 source, design-idioms.css §LABEL-subgrid). -->
                            <div v-if="layerConfig" class="labeled-field-grid">
                                <!-- KF-CO-1 / LP-2 / LP-16 — the blend select's
                                     open state rides the producer's DECLARED
                                     `open` prop + `update:open` emit (the same
                                     pair the two selects above bind), through
                                     the panel's own `open` model. The former
                                     `isOpen`/`setOpen` callback pair is retired:
                                     a function prop is what let the dead
                                     `is-open` spelling ship silently (a prop
                                     name cannot be checked against a child
                                     that never declares it). -->
                                <LayerConfigPanel
                                    :layer-config="layerConfig"
                                    :blend-available="blendAvailable"
                                    :open="isOpen('blend')"
                                    @update:open="(v) => setOpen('blend', v)"
                                    @update="
                                        (v) => emit('layerConfigUpdate', v)
                                    "
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
                @scrub-start="
                    () => {
                        wake();
                        emit('scrubStart');
                    }
                "
                @scrub-end="emit('scrubEnd')"
                @scrubbed="wake"
                @slider-update="
                    (v) => {
                        wake();
                        emit('sliderUpdate', v);
                    }
                "
                @toggle-play="toggleAnimation"
                @toggle-reverse="toggleReverse"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import {
    Card,
    CardContent,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    Separator,
} from "@mkbabb/glass-ui";
import { DockControl } from "@mkbabb/glass-ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { LabeledSelect, LabeledInput } from "@mkbabb/glass-ui/labeled-field";

import { ChevronRight, ArrowLeft, Pencil } from "@lucide/vue";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import { useAnimationSync } from "./composables/useAnimationSync";
import { usePlaybackToggle } from "./composables/usePlaybackToggle";
import { useTimingFunctionEditor } from "./composables/useTimingFunctionEditor";
// T.E8 — the named-curve catalogue (the thin name→family data adapter the
// deleted EasingSelect consumed; the easing scene co-owns it).
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";

import { Teleport, nextTick, onMounted, ref, toRef, useTemplateRef } from "vue";
import { getStoredAnimationOptions } from "@state";
import { kfEngine } from "@kf-engine";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import {
    DIRECTION_DESCRIPTIONS,
    FILL_MODE_DESCRIPTIONS,
} from "@utils/reference-data/animationDescriptions";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying?: boolean;
    // `| undefined` explicit — bound, never omitted, by `ChannelControls.vue:105`.
    layerConfig?: AnimationLayerConfig | undefined;
    blendAvailable: boolean;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(props.animation);

const {
    advancedOpen,
    convertedFromName,
    isDetailEasing,
    showDetailPanel,
    selectedCurveKey,
    onEditIconClick,
    exitDetailPanel,
    updateTimingFunctionFromName,
} = useTimingFunctionEditor(() => props.animation, storedAnimationOptions);

// ── KF-CO-3 ≡ L·B-1 / C·B-1 (+ N-1, N-15) — ONE guarded option handler ──────
// The engine setters are fail-explicit — a malformed PRESENT value throws an
// `AnimationOptionError` (B.W2). User input mid-keystroke is routinely malformed
// (an empty field, a partial number). The former five handlers each guarded the
// engine write and then PERSISTED THE REJECTED VALUE OUTSIDE THE GUARD (the two
// selects had no guard at all): a mid-keystroke `"5"` landed in the 7-day store
// and bricked the scene's next boot, because the bucket is a constructor
// argument and `normalizeDuration` throws on it. The persist now sits INSIDE
// the guard — only a value the engine ACCEPTED is stored — and the rejection is
// surfaced through the producer's own `invalid` + `#error` seam with the
// engine's message, instead of being swallowed. The field keeps showing the
// text being typed (the producer's Input holds a passive local model), and a
// re-mount round-trips the last ACCEPTED value.
type OptionField = "duration" | "delay" | "iterationCount" | "direction" | "fillMode";
const invalidField = ref<OptionField | null>(null);
const invalidMessage = ref("");

const commitOption = <T>(
    field: OptionField,
    value: T,
    apply: (value: T) => void,
    persist: (value: T) => void,
) => {
    try {
        apply(value);
    } catch (e) {
        if (!(e instanceof Error) || e.name !== "AnimationOptionError") throw e;
        invalidField.value = field;
        invalidMessage.value = e.message;
        return;
    }
    persist(value);
    if (invalidField.value === field) {
        invalidField.value = null;
        invalidMessage.value = "";
    }
};

// The two enumerated options arrive from the producer's select as `string`;
// narrow against the engine's own tuples (no `as any` — N-15).
const isOneOf = <const T extends readonly string[]>(
    list: T,
    value: string,
): value is T[number] => (list as readonly string[]).includes(value);

// ── KF-CO-46 — focus follows the row transition ──────────────────────────────
// Each row swap is a navigation: the control that OPENED a pane is inert once
// the pane is up (its row collapsed), so focus is carried INTO the pane's Back
// control, and carried back OUT to the opener on close — else the browser
// drops focus to `<body>` and a keyboard user restarts from the top of the
// document. The component-ref roots (`$el`) are the producer's own buttons.
const pencilEl = useTemplateRef<InstanceType<typeof DockControl>>("pencilEl");
const detailPanelEl =
    useTemplateRef<InstanceType<typeof TimingFunctionPanel>>("detailPanelEl");
const advancedRowEl = useTemplateRef<HTMLElement>("advancedRowEl");
const advancedBackEl =
    useTemplateRef<InstanceType<typeof DockControl>>("advancedBackEl");

const openDetailEditor = async () => {
    const stored = storedAnimationOptions.animationOptions.timingFunction;
    if (typeof stored !== "string") return;
    onEditIconClick(stored);
    await nextTick();
    detailPanelEl.value?.focusBack();
};
const closeDetailEditor = async () => {
    exitDetailPanel();
    await nextTick();
    pencilEl.value?.$el.focus();
};
const openAdvanced = async () => {
    advancedOpen.value = true;
    await nextTick();
    advancedBackEl.value?.$el.focus();
};
const closeAdvanced = async () => {
    advancedOpen.value = false;
    await nextTick();
    advancedRowEl.value?.focus();
};

// Exclusive select mutex: only one dropdown open at a time
const openSelect = ref<string | null>(null);
const isOpen = (name: string) => openSelect.value === name;
const setOpen = (name: string, open: boolean) => {
    openSelect.value = open ? name : null;
};

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
// isPlaying guard comes from the parent (useAnimationGroupPlayback) — not polled.
const isPlayingRef = toRef(() => props.isPlaying ?? false);
const {
    currentT,
    isPlaying: isAnimPlaying,
    isStarted: isAnimStarted,
    wake,
} = useAnimationSync(() => props.animation, isPlayingRef);

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
// surface) and ride the engine chunk, never a deep @src import. KF-CO-14 ≡
// L·M-6: they are read SYNCHRONOUSLY off the demo's warmed engine (`kfEngine()`
// — `main.ts` awaits the warm before `app.mount()`, and this component's own
// store read above already depends on it). The former `onMounted(async …)`
// sequenced a fallible synchronous call (the timing-function re-apply, which
// throws on a poisoned bucket) AHEAD of an unrelated `await` in an unobservable
// hook, so a throw stranded both tuples as `[]` forever; and even the happy
// path rendered an empty-items frame (KF-CO-39's placeholder residue). Both
// dissolve with the ceremony.
const { DIRECTIONS: directions, FILL_MODES: fillModes } = kfEngine();

onMounted(() => {
    const stored = storedAnimationOptions.animationOptions.timingFunction;
    if (typeof stored !== "string") {
        throw new TypeError(
            `Stored timing function is not a literal: ${JSON.stringify(stored)}.`,
        );
    }
    updateTimingFunctionFromName(stored);
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

/* J.W7b STY-4, corrected at the bytes (KF-CO-19 / KF-CE-41). The former
   `.easing-edit-btn { color: var(--color-gold) }` scoped rule is still deleted,
   but its successor sentence is no longer true twice over: there is no
   "demo-owned `.text-gold` idiom" — the demo's rule and its `--color-gold` pin
   were retired this wave as a zero-delta shadow of glass-ui's `--gold`, and the
   surviving `text-gold` is the utility the PRODUCER's theme bridge generates —
   and this call site no longer wears it at all, because gold is a sparkle accent
   and was the only ink on an edit affordance. `.easing-edit-btn` carries no
   style and, at these bytes, no reader either (KF-CO-33 — see the template
   note; OPTIONS-UNIT decides its fate). */
</style>
