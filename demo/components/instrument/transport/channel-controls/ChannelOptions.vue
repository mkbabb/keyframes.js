<template>
    <!-- KF-CO-33 — the dead layout is gone: the root grid's `gap-4 items-center`
         had one in-flow child (the Teleport renders elsewhere), CardContent's
         `gap-2` had one child, both `relative`s positioned nothing, and
         `.panel-stack` was styled nowhere. -->
    <div>
        <Card cartoon tier="quiet" class="w-full overflow-visible">
            <CardContent class="flex flex-col px-4 py-3">
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
                <div>
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
                                 row its own width).
                                 KF-CO-2 ≡ LP-4 + KF-CO-31 + KF-CO-47 — the phantom
                                 explanatory layer is DELETED, not renamed: `tooltip`,
                                 `label-class` and `:descriptions` are declared by no
                                 installed labeled-field component (7.0.0 `types.d.ts`
                                 `LabeledFieldCommonProps { label; description?;
                                 requirement?; layout?; errorLive? }`; `inheritAttrs`
                                 0) and reached nothing. The decision per field
                                 (KF-CO-47): `description` is persistent copy rendered
                                 INSIDE `.labeled-field-copy` — grid item #1, the
                                 shared `auto` label track of this very subgrid — so
                                 five glosses would widen the label column for every
                                 row (LP-4's geometry rider); hover is unavailable on a
                                 LabeledField row (no label-action slot in 7.0.0,
                                 L·I-6). Neither seam fits, so the glosses go; what a
                                 field ACCEPTS surfaces through the `#error` seam on
                                 rejection (KF-CO-3), and the labels take the
                                 producer's one `.glass-label` register (KF-CO-31).
                                 The per-item `:descriptions` gloss is a producer ask
                                 (a LabeledSelect item-description slot → SS-6). -->
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
                                                    railDuration =
                                                        animation.options.duration;
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

                                <LabeledField
                                    label="direction"
                                    v-slot="{ controlId, labelledBy, describedBy }"
                                >
                                    <Select
                                        :model-value="
                                            storedAnimationOptions.animationOptions
                                                .direction ?? 'normal'
                                        "
                                        :open="isOpen('direction')"
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
                                            (v: boolean) => setOpen('direction', v)
                                        "
                                    >
                                        <SelectTrigger
                                            :id="controlId"
                                            :aria-labelledby="labelledBy"
                                            :aria-describedby="describedBy"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem
                                                    v-for="item in directions"
                                                    :key="item"
                                                    :value="item"
                                                >
                                                    {{ item }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </LabeledField>

                                <LabeledField
                                    label="fill mode"
                                    v-slot="{ controlId, labelledBy, describedBy }"
                                >
                                    <Select
                                        :model-value="
                                            storedAnimationOptions.animationOptions
                                                .fillMode ?? 'forwards'
                                        "
                                        :open="isOpen('fillMode')"
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
                                            (v: boolean) => setOpen('fillMode', v)
                                        "
                                    >
                                        <SelectTrigger
                                            :id="controlId"
                                            :aria-labelledby="labelledBy"
                                            :aria-describedby="describedBy"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem
                                                    v-for="item in fillModes"
                                                    :key="item"
                                                    :value="item"
                                                >
                                                    {{ item }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </LabeledField>

                                <!-- Easing field — KF-CO-41: the unit sits INSIDE
                                     the `.labeled-field-grid` as a SUBGRID row
                                     (the idiom spans a non-`.labeled-field` child
                                     1/-1; `grid-cols-subgrid` re-adopts the two
                                     tracks), so its label sits in the SAME derived
                                     label column as the five rows above and the
                                     trigger spans both tracks below it. The former
                                     `flex flex-col` unit outside the grid was the
                                     card's second row grammar. glass-ui 7.0.0
                                     `LabeledField` still exposes no label-action
                                     slot (L·I-6; a producer ask → SS-6), so the
                                     label row is hand-rolled — and wired:
                                     KF-CO-21/22 — the visible `easing` IS the
                                     accessible name (`aria-labelledby` from the
                                     trigger to the label's `id`; the former
                                     `aria-label="Timing function"` named the
                                     control something the screen never showed,
                                     WCAG 2.5.3), and the mouse-only label Tooltip
                                     (as-child onto a non-focusable `<label>`) is
                                     gone with the `cursor-help` cue. -->
                                <div
                                    class="col-span-full grid grid-cols-subgrid
                                        gap-y-1"
                                >
                                    <div class="col-start-1 flex items-center gap-1.5">
                                        <!-- KF-CO-18 (W6-M) — `.gold-shimmer` clips
                                             a gold gradient to the text by setting
                                             `color: transparent` in `@layer
                                             components`; a colour utility beside it
                                             wins the cascade and paints opaque ink
                                             over the gradient, so the two are
                                             ALTERNATIVES on one axis, never
                                             stacked. -->
                                        <label
                                            :id="easingLabelId"
                                            :class="[
                                                'text-small font-medium',
                                                isDetailEasing
                                                    ? 'gold-shimmer'
                                                    : 'text-muted-foreground',
                                            ]"
                                            >easing</label
                                        >
                                        <!-- KF-CO-42 (root of KF-CO-24 / -27 / half of
                                             -28) — the pencil is the producer's
                                             `Button emphasis="quiet" icon-only`, the
                                             primitive the SAME card's Back button
                                             already is. `DockControl` was a dock
                                             control mounted in a Card: its declared
                                             hit-cell guarantee is dock-scoped, its
                                             coarse-pointer floor excluded the
                                             `compact` variant (KF-CO-24 — re-scoped:
                                             the Button's own box is the floor now),
                                             and it declared no `title`, so the pencil
                                             wore a fallen-through native title AND a
                                             reka Tooltip with the same string on two
                                             timings (KF-CO-27) — ONE name now, the
                                             `aria-label`. KF-CO-19's ink cure holds:
                                             the glyph takes the quiet Button's own
                                             muted ink; no gold, no demo-side token.
                                             `easing-edit-btn` named the control for
                                             no reader (KF-CO-33) and is deleted. -->
                                        <Button
                                            ref="pencilEl"
                                            emphasis="quiet"
                                            icon-only
                                            class="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Edit easing curve"
                                            @click.stop="openDetailEditor"
                                        >
                                            <Pencil class="icon-sm" />
                                        </Button>
                                    </div>
                                    <!-- I.W2.S3 — the dropdown's model-value is the
                                         selected catalogue key (KF-CO-10), and the
                                         persist is the ONE seam
                                         (`updateTimingFunctionFromName`, which
                                         writes the COMPLETE re-parseable literal);
                                         KF-CO-23 — a pick routes through
                                         `onCurvePicked`, so the two DRAFT-kind rows
                                         open the editor they name.
                                         T.E8 + OD-5 R2 — the bespoke EasingSelect
                                         (and its tiny hand-plotted trigger-curve,
                                         the rejected "top-left curve preview") died
                                         with the instrument/easing cluster: this is
                                         the standard glass-ui Select over the SAME
                                         family-grouped named-curve catalogue; the
                                         CURVE rendering now lives in the vendor
                                         EasingPicker (detail panel) + the T.E6
                                         gallery sparklines. -->
                                    <Select
                                        :model-value="selectedCurveKey"
                                        @update:model-value="
                                            (key) => onCurvePicked(String(key))
                                        "
                                    >
                                        <SelectTrigger
                                            class="col-span-full"
                                            :aria-labelledby="easingLabelId"
                                        >
                                            <!-- OA-28 / OA-31 (§0be · §0bg) — the
                                                 closed trigger shows the CURRENT
                                                 curve: its glyph (sampled from the
                                                 easing the key installs, the same
                                                 `curveGlyphs` map every row reads)
                                                 and its NAME only — the description
                                                 never renders inline here. Drawn
                                                 through the producer SelectValue's
                                                 own default slot (`modelValue`); a
                                                 key that matches no row (the
                                                 poisoned-bucket case) keeps the
                                                 producer's placeholder. -->
                                            <SelectValue
                                                v-slot="{ modelValue }"
                                                :placeholder="CURVE_PLACEHOLDER"
                                            >
                                                <span
                                                    v-if="
                                                        curveGlyphs.has(
                                                            String(modelValue),
                                                        )
                                                    "
                                                    class="flex min-w-0
                                                        items-center gap-1.5"
                                                >
                                                    <svg
                                                        class="curve-glyph"
                                                        viewBox="0 0 1 1"
                                                        preserveAspectRatio="none"
                                                        overflow="visible"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            :d="
                                                                curveGlyphs.get(
                                                                    String(
                                                                        modelValue,
                                                                    ),
                                                                )
                                                            "
                                                            vector-effect="non-scaling-stroke"
                                                        />
                                                    </svg>
                                                    <span
                                                        data-register="code"
                                                        class="truncate font-mono"
                                                        >{{ modelValue }}</span
                                                    >
                                                </span>
                                                <template v-else>{{
                                                    CURVE_PLACEHOLDER
                                                }}</template>
                                            </SelectValue>
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
                                                <!-- KF-CO-6 — `text-value` is what
                                                     the closed trigger PRINTS
                                                     (reka publishes the item's
                                                     textContent otherwise, so the
                                                     trigger read the run-on
                                                     `ease-in-outslow start & end`).
                                                     The name alone is the value. -->
                                                <SelectItem
                                                    v-for="curveItem in group.items"
                                                    :key="curveItem.name"
                                                    :value="curveItem.name"
                                                    :text-value="curveItem.name"
                                                    :aria-describedby="curveDescriptionId(curveItem.name)"
                                                    class="pe-2"
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
                                                        <!-- OA-7 — the row's curve
                                                             glyph, plotted from the
                                                             easing the row installs
                                                             (never a sprite); one
                                                             text line tall, 3:2,
                                                             drawn in the row's ink.
                                                             Back curves overshoot
                                                             the unit box, so the
                                                             svg paints its overflow. -->
                                                        <svg
                                                            class="curve-glyph"
                                                            viewBox="0 0 1 1"
                                                            preserveAspectRatio="none"
                                                            overflow="visible"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                :d="
                                                                    curveGlyphs.get(
                                                                        curveItem.name,
                                                                    )
                                                                "
                                                                vector-effect="non-scaling-stroke"
                                                            />
                                                        </svg>
                                                        <span
                                                            data-register="code"
                                                            class="font-mono"
                                                            >{{
                                                                curveItem.name
                                                            }}</span
                                                        >
                                                    </span>
                                                    <!-- OA-28 / OA-31 — the
                                                         description rides the
                                                         producer SelectItem's own
                                                         `description` slot: OUTSIDE
                                                         its SelectItemText, so the
                                                         item's registered label is
                                                         the NAME alone, and on its
                                                         own secondary line (visual
                                                         separation). It is the
                                                         option's accessible
                                                         DESCRIPTION, not part of its
                                                         name: aria-hidden here and
                                                         referenced by the item's
                                                         aria-describedby. -->
                                                    <template #description>
                                                        <span
                                                            :id="curveDescriptionId(curveItem.name)"
                                                            aria-hidden="true"
                                                            class="text-dropdown-secondary
                                                                text-muted-foreground
                                                                leading-tight
                                                                whitespace-nowrap"
                                                            >{{
                                                                curveItem.description
                                                            }}</span
                                                        >
                                                    </template>
                                                </SelectItem>
                                            </SelectGroup>
                                        </template>
                                    </SelectContent>
                                </Select>
                                </div>
                            </div>

                            <Separator class="my-1" />

                            <!-- Advanced — navigate to the sub-pane. KF-CO-26 — a
                                 real `<button>` (Enter/Space are the element's
                                 own; the hand-rolled `div[role=button]` + two
                                 keydown handlers die) carrying `aria-expanded`
                                 and `aria-controls` onto the pane row, and the
                                 demo's `.kf-focus-ring`. KF-CO-28 — enter and
                                 exit chrome share ONE grammar: `text-small
                                 font-medium`, muted→foreground hover, `icon-sm`,
                                 `gap-1.5`, `py-1.5`. KF-CO-29 — the chevron sits
                                 on the row's own right edge; the `px-3` wrapper,
                                 the inert `gap-x-3` and the inert `justify-end`
                                 are gone. -->
                            <button
                                ref="advancedRowEl"
                                type="button"
                                class="kf-focus-ring hover:text-foreground
                                    text-muted-foreground flex w-full
                                    cursor-pointer items-center justify-between
                                    gap-1.5 py-1.5 transition-colors"
                                :aria-expanded="advancedOpen"
                                :aria-controls="advancedPaneId"
                                @click="openAdvanced"
                            >
                                <span class="text-small font-medium">advanced</span>
                                <!-- KF-CO-20 — the ONLY navigability mark in this
                                     pane, and it failed in BOTH theme arms because
                                     `opacity-50` was applied to an ALREADY-muted
                                     role: the parent row hands down
                                     `--muted-foreground` (and `--foreground` on
                                     hover), and halving it caps the ratio below any
                                     arm's reach. Deleting the alpha IS the real rung
                                     — the row already carries the muted→ink hover
                                     pair the chevron wants. Exact composites →
                                     SS-13. -->
                                <ChevronRight class="icon-sm" />
                            </button>
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
                                @authored="onEasingAuthored"
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
                        :id="advancedPaneId"
                        :inert="!(advancedOpen && !showDetailPanel)"
                    >
                        <div class="panel-content flex w-full flex-col gap-2">
                            <!-- KF-CO-42 / KF-CO-28 — the exit chrome: the same
                                 quiet icon-only Button as the pencil and the
                                 detail pane's Back, one accessible name, the
                                 enter row's type/ink/glyph rung. -->
                            <div
                                class="flex items-center gap-1.5 py-1.5
                                    text-muted-foreground"
                            >
                                <Button
                                    ref="advancedBackEl"
                                    emphasis="quiet"
                                    icon-only
                                    class="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Back to controls"
                                    @click="closeAdvanced"
                                >
                                    <ArrowLeft class="icon-sm" />
                                </Button>
                                <span class="text-small font-medium">advanced</span>
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
                :duration="railDuration"
                :current-t="currentT"
                :is-anim-playing="isAnimPlaying"
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
    Button,
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
import { LabeledField, LabeledInput } from "@mkbabb/glass-ui/labeled-field";

import { ChevronRight, ArrowLeft, Pencil } from "@lucide/vue";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import type { EasingPickerValue } from "@mkbabb/glass-ui/easing";
import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import { useAnimationSync } from "./composables/useAnimationSync";
import { usePlaybackToggle } from "./composables/usePlaybackToggle";
import { useTimingFunctionEditor } from "./composables/useTimingFunctionEditor";
// T.E8 — the named-curve catalogue (the thin name→family data adapter the
// deleted EasingSelect consumed; the easing scene co-owns it).
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";

// L·N-16 — `Teleport` is a built-in the template compiler resolves; it is not
// imported.
import {
    computed,
    nextTick,
    onMounted,
    ref,
    toRef,
    useId,
    useTemplateRef,
    watch,
} from "vue";
import { getStoredAnimationOptions } from "@state";
import { kfEngine } from "@kf-engine";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying?: boolean;
    // `| undefined` explicit — bound, never omitted, by `ChannelControls.vue:105`.
    layerConfig?: AnimationLayerConfig | undefined;
    blendAvailable: boolean;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(props.animation);

// ── KF-CO-15 (the X.KF.W13.b carve, joint with the ribbon's C-2 contract) ────
// The rail's scale is a REACTIVE read of the engine's duration. `animation` is
// markRaw, so a computed over `options.duration` inside the ribbon froze the
// `:max` at mount while `setDuration` mutated the engine in place; and the
// ribbon's own inversion read the duration FRESH one function below, so a stale
// 5000 rail over a fresh 2000 pivot emitted a signed seek (rawT = −3000) under
// Reverse. This card is the ONE writer of the duration (`commitOption` above),
// so it publishes the accepted value on the same edge that persists it and
// hands the ribbon one scale for both its rail and its inversion.
const railDuration = ref(props.animation.options.duration);
watch(
    () => props.animation,
    (a) => {
        railDuration.value = a.options.duration;
    },
);

const {
    advancedOpen,
    convertedFromName,
    isDetailEasing,
    showDetailPanel,
    selectedCurveKey,
    onEditIconClick,
    onCurvePicked,
    exitDetailPanel,
    updateTimingFunctionFromName,
    curveGlyphPath,
} = useTimingFunctionEditor(() => props.animation, storedAnimationOptions);

// X.KF.W13T.k3 · ESC-k2-1 (§0ar) — this card HOLDS the stored-options key
// (`storedAnimationOptions` above), so the detail panel's authored curve is
// written HERE: the step or quad options first, then the kind is installed
// through the one persist seam, in the order the panel used to do both.
const onEasingAuthored = (v: EasingPickerValue): void => {
    if (v.mode === "steps") {
        storedAnimationOptions.stepOptions.steps = v.steps;
        storedAnimationOptions.stepOptions.jumpTerm = v.term;
        updateTimingFunctionFromName("steps");
        return;
    }
    storedAnimationOptions.cubicBezierOptions.controlPoints = [...v.points];
    updateTimingFunctionFromName("cubic-bezier");
};

// OA-7 (§0ao.1) — every picker row's curve glyph, keyed by row name: the path
// is sampled from the easing the row installs (`curveGlyphPath`), so the
// draft-kind rows track the store's live quad / step options reactively.
const curveGlyphs = computed(
    () =>
        // Keyed by `string`: the trigger's slot hands back the producer's
        // scalar `modelValue`, looked up by its string form.
        new Map<string, string>(
            EASING_GROUPS.flatMap((g) =>
                g.items.map((i) => [i.name, curveGlyphPath(i.name)] as const),
            ),
        ),
);

// KF-CO-21 / KF-CO-26 — the ids the hand-rolled label row and the advanced
// disclosure wire their ARIA relations through (SSR-stable, per instance).
const easingLabelId = useId();
// OA-28 / OA-31 — each picker row's description element id (the row's
// aria-describedby target), per instance: the card mounts once per layout seat.
const curveDescriptionIdBase = useId();
const curveDescriptionId = (name: string): string =>
    `${curveDescriptionIdBase}-desc-${name}`;
// The trigger's placeholder, read by the producer prop AND by the slot's
// no-match arm (a slot replaces the producer's own placeholder fallback).
const CURVE_PLACEHOLDER = "Pick a curve";
const advancedPaneId = useId();

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

// The two enumerated options arrive from the producer's Select as its
// `SelectionValue` (`string | number`); narrow against the engine's own tuples
// (no `as any` — N-15).
const isOneOf = <const T extends readonly string[]>(
    list: T,
    value: string | number,
): value is T[number] => (list as readonly (string | number)[]).includes(value);

// ── KF-CO-46 — focus follows the row transition ──────────────────────────────
// Each row swap is a navigation: the control that OPENED a pane is inert once
// the pane is up (its row collapsed), so focus is carried INTO the pane's Back
// control, and carried back OUT to the opener on close — else the browser
// drops focus to `<body>` and a keyboard user restarts from the top of the
// document. The component-ref roots (`$el`) are the producer's own buttons.
const pencilEl = useTemplateRef<InstanceType<typeof Button>>("pencilEl");
const detailPanelEl =
    useTemplateRef<InstanceType<typeof TimingFunctionPanel>>("detailPanelEl");
const advancedRowEl = useTemplateRef<HTMLButtonElement>("advancedRowEl");
const advancedBackEl =
    useTemplateRef<InstanceType<typeof Button>>("advancedBackEl");

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
/* OA-7 — the picker row's curve glyph: sized to the row's text line (em, so it
   follows the dropdown rung), inked by the row's own colour. */
.curve-glyph {
    flex: none;
    width: 1.5em;
    height: 1em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
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

/* J.W7b STY-4 → KF-CO-19 / KF-CO-33 — no gold on the pencil (a sparkle accent
   was the only ink on an edit affordance; the demo's `--color-gold` shadow of
   the producer's `--gold` is retired), and no `.easing-edit-btn` hook: the
   class styled nothing and was read by nothing, so the control carries the
   producer's quiet Button ink and no name of its own. */
</style>
