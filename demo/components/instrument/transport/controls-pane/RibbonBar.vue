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
    <div class="ribbon-bar flex-shrink-0">
        <!-- X-DS pass 2 · KF-C2-09 — ONE rule width per card: the ribbon's
             hairline is inset to the content column (the surfaces' `px-4`), as
             the field separators above it are; it ran full-bleed, edge to edge.
             The end inset is the column's own: the surfaces' `px-4` plus the
             `.panel-content` focus gutter (2px a side, its start pulled back). -->
        <div class="ps-4 pe-5"><Separator /></div>
        <div class="p-3">
            <!-- Controls tab: filled via Teleport from ChannelOptions -->
            <div
                id="controls-ribbon-target"
                v-show="storedControls.selectedControl === 'controls'"
            ></div>

            <!-- Timeline tab — X-DS pass 2 (KF-C2-04): the timeline's verbs
                 are KeyframeTimeline's own row, teleported here while the
                 timeline sits in the pane (the Controls tab's idiom above);
                 expanded, the row stays with the floating card as its footer.
                 (A2-KE-L3-15 · UIA-KF-179's one-row hierarchy moved with it.) -->
            <div
                id="timeline-ribbon-target"
                v-show="storedControls.selectedControl === 'timeline'"
            ></div>

            <!-- Keyframes tab — X.KF.W13X.mobile (UIA-KF-319): ONE row
                 with a hierarchy. Apply CSS is the stateful toggle (the
                 only undo of an applied identity), so it LEADS, labelled;
                 Copy / Format / Export CSS are secondary commands. Four
                 labelled secondary sm Buttons wrapped 3 + 1 in the 26rem
                 rail and left Apply alone on a second row.
                 X-DS pass 4 (KF-C4-12) — the secondaries are QUIET and
                 LABELLED: three icon-only capsules (copy, sparkles,
                 file-code) said nothing a reader could act on without a
                 tooltip, and each wore the full floating skin. The quiet
                 rung has no capsule at rest, so the three short labels fit
                 the one row beside Apply.
                 X-DS pass 5 (KF-C5-02) — the row checked its y and not its
                 label wrap: four shrinkable Buttons squeezed the LEADING one,
                 so the primary broke "Apply / CSS" in its 36px pill. Apply
                 now holds its intrinsic width (`shrink-0 whitespace-nowrap`)
                 and every label is one line; the secondaries YIELD instead,
                 by the row's own width (it is the inline-size container):
                 "Compiled" goes to its glyph below 29rem (the four labels'
                 measured one-row width) and "Format" below 22rem. Each
                 accessible name and `title` is unchanged, so the glyph-only
                 form still names itself and tooltips its word. -->
            <div
                v-if="storedControls.selectedControl === 'keyframes'"
                class="@container flex items-center justify-center gap-2"
            >
                <!-- UIA-KF-175 (X.KF.W13X.sections) — Apply CSS is a toggle,
                     so it says so: `aria-pressed` reads the pane's own
                     `cssApplied` (the rainbow skin is the app's identity
                     hue, kept). -->
                <Button
                    size="sm"
                    emphasis="secondary"
                    class="shrink-0 whitespace-nowrap"
                    :aria-pressed="Boolean(activeKeyframesRef?.cssApplied)"
                    :class="
                        activeKeyframesRef?.cssApplied
                            ? 'rainbow-vivid text-white ribbon-apply--active'
                            : ''
                    "
                    @click="activeKeyframesRef?.applyCSSStyles?.()"
                >
                    <Paintbrush
                        class="icon-sm"
                        :style="
                            !activeKeyframesRef?.cssApplied
                                ? { stroke: 'url(#rainbow-gradient)' }
                                : {}
                        "
                    />
                    Apply CSS
                </Button>
                <!-- UIA-KF-173 — the two clipboard verbs are named for what
                     they copy: the keyframes source, or the zero-runtime CSS
                     compiled from the orchestration graph. -->
                <Button
                    size="sm"
                    emphasis="quiet"
                    class="whitespace-nowrap"
                    aria-label="Copy keyframes"
                    title="Copy keyframes"
                    @click="activeKeyframesRef?.copyCSS?.()"
                >
                    <!-- X-DS pass 1, C1 (KF-C1-14) — the three icon
                         commands share one neutral ink (currentColor): the
                         gold Format and emerald Export tints carried no
                         state and no identity. The rainbow brush on Apply
                         CSS stays, the app's identity CTA. -->
                    <Copy class="icon-sm" />
                    Copy
                </Button>
                <!-- The PRIMARY format path (M-3/C-8 ≡ KF-CE-37): this
                     call is un-awaited BY DESIGN — `formatCSS` is the
                     keyframes pane's `formatEditor`, the ONE format
                     boundary, which catches prettier's rejection, toasts
                     it with Retry and releases the pane's latch, so the
                     promise it returns never rejects. -->
                <Button
                    size="sm"
                    emphasis="quiet"
                    class="whitespace-nowrap"
                    aria-label="Format"
                    title="Format"
                    @click="activeKeyframesRef?.formatCSS?.()"
                >
                    <Sparkles class="icon-sm" />
                    <span class="@max-[22rem]:sr-only">Format</span>
                </Button>
                <!-- K.W10 CC-4 — Export CSS: compile the orchestration graph
                     to a zero-runtime CSS artifact via the gated compileToCSS
                     (the round-trip's BACKWARD half) + the honest CC-3
                     ineligibility report. The editor is a CSS-animation IDE. -->
                <Button
                    size="sm"
                    emphasis="quiet"
                    class="whitespace-nowrap"
                    aria-label="Copy compiled CSS"
                    title="Copy compiled CSS"
                    @click="activeKeyframesRef?.exportCompiledCSS?.()"
                >
                    <FileCode class="icon-sm" />
                    <span class="@max-[29rem]:sr-only">Compiled</span>
                </Button>
            </div>

            <!-- Other tabs (matrix controls, etc.) via slot -->
            <div
                v-else-if="
                    storedControls.selectedControl !== 'controls' &&
                    storedControls.selectedControl !== 'timeline'
                "
                class="ribbon-slot flex items-center justify-center gap-2 flex-wrap"
            >
                <slot
                    name="ribbon-content"
                    :selected-control="storedControls.selectedControl"
                ></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Copy, FileCode, Paintbrush, Sparkles } from "@lucide/vue";
import { watch } from "vue";
import { Button, Separator } from "@mkbabb/glass-ui";
import type { StoredAnimationGroupControlOptions } from "@state";

// The ribbon's Buttons carry NO class string of their own: `size="sm"` +
// `emphasis="secondary"` is the whole request, and the producer answers it
// (CPW D-M11 + D-m12). The former RIBBON_BUTTON_CLASS was five tokens, each
// one of: dead (the phantom `btn-*` utility token — zero rules in the demo,
// the dist and the shipped sheet), unreachable (`h-8` against `.button`'s `min-block-size`, which
// `height` never contests), duplicative (`rounded-full` over `--radius-control`,
// itself the pill), or actively de-scaling (`text-body` / `gap-1.5` pinning a
// rung and a 6px gap where the sm recipe scales both with `--ui-scale`). The
// active Apply state keeps its own three tokens below; nothing else is owed.

const props = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    activeKeyframesRef: any;
}>();

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
// The handle is optional-chained like every other call on this ref — the
// keyframes pane may not be mounted at all on a scene without one.
watch(
    () => props.storedControls.selectedControl === "keyframes",
    (affordanceRendered) => {
        if (!affordanceRendered) props.activeKeyframesRef?.clearAppliedCSS?.();
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
/* X.KF.W13X.sections — no empty ribbon card: a scene slot that renders nothing
   leaves `.ribbon-slot` holding only Vue's comment anchors, which `:empty`
   ignores, so the card is not drawn. */
.ribbon-bar:has(.ribbon-slot:empty) {
    display: none;
}
</style>
