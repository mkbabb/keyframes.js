<template>
    <!-- X.KF.W13X.sections (KF-W13 addendum (c)) — the ribbon card exists only
         while it carries verbs: a surface whose scene hands it nothing (the
         cube's matrix surface, whose Reset now rides its section header) shows
         no empty second card (`.ribbon-bar:has(.ribbon-slot:empty)`).
         X-DS pass 1, C1 (KF-C1-07) — the ribbon is no longer a second card:
         it is the LAST SECTION of the pane host's one frame
         (ControlsPaneWrapper), under a hairline, at ORIGIN's proportion (one
         card, the transport rows inside it). An empty slot still hides the
         whole section, rule and all. -->
    <!-- X-DS r9 pass 16 (KF-C16-01) — ONE RHYTHM per facet: the rule
         follows the last row (KF-C7-02 / KF-C11-04), and any free block the
         one-foot frame (KF-C10-10) leaves stands UNDER the ribbon, as the
         Controls, Spring and Easing facets serve it. Pass 14's timeline-only
         `mt-auto` (KF-C14-04) put that block above the rule instead, a
         216-327 px blank band in the Timeline card; it is deleted. -->
    <div class="ribbon-bar flex-shrink-0">
        <!-- X-DS pass 2 · KF-C2-09 — ONE rule width per card: the ribbon's
             hairline is inset to the content column (the surfaces' `px-4`), as
             the field separators above it are; it ran full-bleed, edge to edge.
             The end inset is the column's own: the surfaces' `px-4` plus the
             `.panel-content` focus gutter (2px a side, its start pulled back). -->
        <!-- X-DS pass 9 (KF-C9-07) — the column is the pane's ONE inset,
             glass's `--configurator-pad-inline` (the configurator facets'), so
             the transport no longer starts 4 px left of an Easing or Physics
             editor body.
             X-DS r3 pass 3 (KF-C22-05) — and it ENDS on that one inset too: the
             end's extra 0.25rem matched a field column that the focus gutter
             used to shorten; `.panel-content` now keeps the column whole, so
             the fields, their separators, this hairline, the time readout and
             the track all end on one inline-end edge. -->
        <!-- X-DS r9 pass 8 (KF-C8x-01) — ONE edge over the ribbon. The
             Keyframes surface ends in the full-bleed code well, whose own tone
             step already parts it from the ribbon; the inset hairline drew a
             second, misaligned rule 8 px under it. That surface opts out, and
             the well's tone step is the one edge; every other surface keeps
             the hairline. -->
        <div
            v-if="storedControls.selectedControl !== 'keyframes'"
            class="px-(--configurator-pad-inline)"
        >
            <Separator />
        </div>
        <!-- X-DS pass 6 (KF-C6-01) — the ribbon's rows sit on the SAME content
             column as its hairline and the fields above (`ps-4 pe-5`); a
             `p-3` inset started every transport row 4 px left of the label
             column. -->
        <div class="px-(--configurator-pad-inline) py-3">
            <!-- Timeline tab — X-DS pass 2 (KF-C2-04): the timeline's verbs
                 are KeyframeTimeline's own row, teleported here while the
                 timeline sits in the pane;
                 expanded, the row stays with the floating card as its footer.
                 (A2-KE-L3-15 · UIA-KF-179's one-row hierarchy moved with it.) -->
            <div
                id="timeline-ribbon-target"
                v-show="storedControls.selectedControl === 'timeline'"
            ></div>

            <!-- Keyframes tab — X.KF.W13X.mobile (UIA-KF-319): ONE row with a
                 hierarchy. Apply CSS is the stateful toggle (the only undo of an
                 applied identity), so it LEADS; Copy / Format / Compiled are
                 secondary commands, each keeping its word (KF-C14-02). The row's
                 earlier forms (labelled Buttons, then quiet words on the content
                 column, KF-C4-12 .. KF-C14-02) are superseded by [42] below. -->
            <!-- owner-1112 [42] "these buttons should be centred, and in a
                 glass-ui dock." — the four verbs stand CENTRED in one glass
                 dock (never folding: `:collapse="false"`): Apply CSS a
                 labelled seat, the three commands glyph seats with tooltips. Apply CSS stays the one toggle and
                 the one coloured seat (its rainbow brush; the rainbow fill when
                 applied, the app's identity hue, §0dm); a hairline parts it from
                 the three commands. Every accessible name is unchanged. -->
            <div
                v-if="storedControls.selectedControl === 'keyframes'"
                class="ribbon-dock flex justify-center"
            >
                <GlassDock fit-content :collapse="false">
                    <!-- UIA-KF-175 (X.KF.W13X.sections) — Apply CSS is a toggle,
                         so it says so: `active` stamps `aria-pressed` from the
                         pane's own `cssApplied`. -->
                    <DockControl
                        shape="tab"
                        :active="Boolean(keyframes?.cssApplied)"
                        class="gap-(--icon-label-gap) whitespace-nowrap"
                        :class="keyframes?.cssApplied ? 'rainbow-vivid text-white ribbon-apply--active' : ''"
                        @click="keyframes?.applyCSS()"
                    >
                        <Paintbrush
                            class="icon-sm"
                            aria-hidden="true"
                            :style="!keyframes?.cssApplied ? { stroke: 'url(#rainbow-gradient)' } : {}"
                        />
                        Apply CSS
                    </DockControl>
                    <DockSeparator />
                    <!-- UIA-KF-173 — the two clipboard verbs are named for what
                         they copy: the keyframes source, or the zero-runtime CSS
                         compiled from the orchestration graph. In the dock the
                         three commands are its glyph seats (the rail is ~360 px
                         and four glyph-and-word seats need ~455: the fourth
                         scrolled out of the dock); each says its word in a glass
                         tooltip on hover and focus, and keeps its name. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <DockControl shape="icon" aria-label="Copy keyframes" @click="keyframes?.copyKeyframes()">
                                <Copy class="icon-sm" aria-hidden="true" />
                            </DockControl>
                        </TooltipTrigger>
                        <TooltipContent>Copy keyframes</TooltipContent>
                    </Tooltip>
                    <!-- The PRIMARY format path (M-3/C-8 ≡ KF-CE-37): un-awaited BY
                         DESIGN — `formatCSS` is the keyframes pane's `formatEditor`,
                         the ONE format boundary, which catches prettier's rejection,
                         toasts it with Retry and releases the pane's latch. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <DockControl shape="icon" aria-label="Format" @click="keyframes?.format()">
                                <AlignLeft class="icon-sm" aria-hidden="true" />
                            </DockControl>
                        </TooltipTrigger>
                        <TooltipContent>Format the CSS</TooltipContent>
                    </Tooltip>
                    <!-- K.W10 CC-4 — Export CSS: compile the orchestration graph to
                         a zero-runtime CSS artifact via the gated compileToCSS (the
                         round-trip's BACKWARD half) + the honest CC-3 report. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <DockControl shape="icon" aria-label="Copy compiled CSS" @click="keyframes?.copyCompiledCSS()">
                                <FileCode class="icon-sm" aria-hidden="true" />
                            </DockControl>
                        </TooltipTrigger>
                        <TooltipContent>Copy compiled CSS</TooltipContent>
                    </Tooltip>
                </GlassDock>
            </div>

            <!-- X.KF.W13X.r4ribbon · A2-KE-L1-24 — THE ONE TRANSPORT. Every
                 surface but Keyframes and Timeline shows the same component,
                 mounted here and nowhere else, bound off the ribbon seat: the
                 selected channel's transport on Controls, the scene's on a
                 facet surface (easing's Curve, spring's Physics). A surface
                 that publishes none (cube's Matrix) leaves the slot empty and
                 the section undrawn (the `:empty` rule below). -->
            <div
                v-else-if="storedControls.selectedControl !== 'timeline'"
                class="ribbon-slot"
            >
                <PlaybackRibbon v-if="ribbon" v-bind="ribbon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AlignLeft, Copy, FileCode, Paintbrush } from "@lucide/vue";
import { computed, inject, watch } from "vue";
import { Separator } from "@mkbabb/glass-ui";
import { DockControl, DockSeparator, GlassDock } from "@mkbabb/glass-ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import type { StoredAnimationGroupControlOptions } from "@state";
import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";
import { CHANNEL_COMMANDS_KEY, RIBBON_SEAT_KEY } from "../transport/injectionKeys";

// owner-1112 [42] — the verbs are glass DockControls in a GlassDock: the
// producer owns their size, radius, hover plate and press; the active Apply
// state keeps its own three tokens below.

const props = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
}>();

// X.KF.W13X.r4pane · A2-KE-L1-23 — the verbs act on the SELECTED channel's
// typed commands, read from the one seat AnimationControlsGroup provides and
// the channel host publishes into (no `any` component ref handed down).
const commandSeat = inject(CHANNEL_COMMANDS_KEY, null);
const keyframes = computed(() => commandSeat?.current.value?.keyframes ?? null);

// X.KF.W13X.r4ribbon · A2-KE-L1-24 — the transport's binding for the surface
// on show, read from the ribbon seat (`RIBBON_SEAT_KEY`; the App provides it).
// The binding's reactive reads (the playhead, the play state, the eye) are made
// here, so this component is the one that re-renders with them.
const ribbonSeat = inject(RIBBON_SEAT_KEY, null);
const ribbon = computed(() => {
    const surface = props.storedControls.selectedControl;
    return surface === "keyframes" || surface === "timeline"
        ? null
        : (ribbonSeat?.bindingFor(surface) ?? null);
});

// RB-6 (X.KF.W12.e) — THE APPLY STATE AND ITS AFFORDANCE GET ONE LIFETIME.
//
// The Apply CSS toggle above is the ONLY control that can undo an applied
// identity, and it is rendered by the `selectedControl === 'keyframes'` branch.
// The pane that holds the state is force-mounted by the controls wrapper, so
// switching tabs used to unmount the affordance and leave the residue behind:
// the JS animation still forced paused, the injected sheet still in the head,
// the class still on every target, and no visible undo anywhere in the app
// until the user remembered which tab it had been on (banked L-BL-1 bounds the
// visual consequence; it does not bound the incoherence).
//
// The branch's own condition is therefore the state's lifetime, watched here
// rather than approximated anywhere else: when the affordance leaves, the
// identity comes down with it, through the seat's idempotent `clearApplied`
// (which restores the PRIOR pause state and no-ops when nothing is applied).
// The command no-ops when the channel's keyframes pane is not mounted (a scene
// without one), and the seat reads empty when no channel is selected.
watch(
    () => props.storedControls.selectedControl === "keyframes",
    (affordanceRendered) => {
        if (!affordanceRendered) keyframes.value?.clearAppliedCSS();
    },
);
</script>

<style scoped>
/* The active rainbow-vivid Apply button drops its border so the gradient
   reads edge-to-edge — was a `!border-transparent` Tailwind escape at the
   callsite (D.W2.S3); a scoped rule fights the cascade honestly. */
.ribbon-apply--active {
    border-color: transparent;
}
/* X.KF.W13X.sections — no empty ribbon card: a surface with no transport
   leaves `.ribbon-slot` holding only Vue's comment anchor, which `:empty`
   ignores, so the card is not drawn. */
.ribbon-bar:has(.ribbon-slot:empty) {
    display: none;
}
</style>
