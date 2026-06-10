<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         A standard, NON-cartoon glass `<Card>` (the protagonist plate;
         `tier="resting" surface="glass"`, rounded-card by construction → I4 for
         free). The control PANELS stay cartoon+quiet (W2/W9). Dock-band
         containment is the surviving [stage]-track `.stage-cell` PRIMITIVE.
         `shadow={false}` (FORK I5-shadow). `max-w-3xl` rides the content column
         as an optical reading measure. -->
    <Card
        :shadow="false"
        class="flex flex-col items-center justify-center gap-6 h-full w-full px-6 lg:px-8 overflow-hidden"
        :style="{ '--spring-ease': springCss }"
    >
        <!-- Header readout -->
        <div class="flex w-full max-w-3xl items-center justify-between gap-3 shrink-0">
            <span class="text-heading text-foreground truncate">@starting-style</span>
            <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                eased by springLinearStops()
            </span>
        </div>

        <!-- The discrete-transition stage. The card enters from nothing
             (@starting-style) and exits to display:none (allow-discrete),
             eased by the keyframes.js spring linear() in --spring-ease. -->
        <div class="flex w-full max-w-3xl flex-1 min-h-0 flex-col items-center justify-center gap-5">
            <div class="stage-viewport relative w-full flex-1 min-h-0 flex items-center justify-center">
                <!-- The card stays in the DOM; toggling `.is-hidden`
                     transitions display:none via allow-discrete, so the
                     spring eases BOTH the entry (@starting-style) and the
                     exit (transition TO the hidden state) — the declarative
                     discrete-transition primitive, no JS removal timing. -->
                <div class="discrete-card" :class="{ 'is-hidden': !visible }">
                    <span class="text-title text-foreground">Hello, spring.</span>
                    <span class="text-small text-muted-foreground">
                        enters + exits on a physics curve
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                class="btn-playback btn-playback-accent shrink-0"
                @click="toggle"
            >
                <span>{{ visible ? "Dismiss" : "Reveal" }}</span>
                <component :is="visible ? EyeOff : Eye" class="w-4 h-4" />
            </Button>
        </div>

        <!-- The copy-pasteable artifact: the emitted linear() string. -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-small text-foreground">transition-timing-function</span>
                <CopyButton class="shrink-0 w-4 h-4" :text="copyableCss" />
            </div>
            <code class="artifact text-mono-caption tabular-nums text-muted-foreground block w-full overflow-x-auto whitespace-nowrap">{{ springCss }}</code>
        </div>

        <!-- Preset switch — re-samples the spring, so the artifact + the live
             transition update in lockstep (same solver, same preset).
             J.W7b S1b — the published 3.9.0 `<ToggleChip variant="cell">`
             (reka Toggle → `aria-pressed` + `data-state="on"`) replaces the
             hand-rolled `<Button variant="outline">` + scoped active-ring
             twin (deleted in the same motion). The call-site classes are the
             pixel-parity consumer configuration (the cells' existing
             outline-pill geometry/tone + the scene-semantic --color-progress
             active ring, now off the primitive's data-state seam). -->
        <div class="grid grid-cols-4 gap-2 w-full max-w-3xl">
            <ToggleChip
                v-for="p in SPRING_PRESETS"
                :key="p.name"
                variant="cell"
                :model-value="isActivePreset(p)"
                class="rounded-pill border-none bg-background px-3 py-1.5 h-auto gap-0.5 font-medium leading-normal whitespace-nowrap btn-interactive hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-background data-[state=on]:shadow-[inset_0_0_0_1px_var(--color-progress)]"
                @update:model-value="applyPreset(p)"
            >
                <span class="text-small text-foreground capitalize">{{ p.name }}</span>
                <span class="text-admin-label text-muted-foreground tabular-nums">{{ p.response }} / {{ p.dampingFraction }}</span>
            </ToggleChip>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Button, Card } from "@mkbabb/glass-ui";
import { ToggleChip } from "@mkbabb/glass-ui/toggle-chip";
import { Eye, EyeOff } from "@lucide/vue";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/custom/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS, type SpringPreset } from "./springPresets";

// The discrete view of the Spring scene (H.W5.S3 — merged from the former
// standalone Discrete scene). `visible` / `toggle` are owned by the SPRING demo
// composable so the merged sub-view lives within the spring scene's SINGLE
// ScenePlayback registration — this Target only reads + drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

// The preset switch drives the SHARED demo params (response / dampingFraction) —
// ONE solver, two views: switching a preset here also moves the live-solver
// sliders, so the discrete transition + the rail read one source of truth.
const applyPreset = (p: SpringPreset) => {
    demo.response.value = p.response;
    demo.dampingFraction.value = p.dampingFraction;
};
const isActivePreset = (p: SpringPreset) =>
    Math.abs(demo.response.value - p.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6;

// The emitted CSS linear() — the ONE springLinearStops surface
// (useSpringLinearStops, H.W5.S3), sampled off the SAME shared params the
// live-solver rail reads; here it drives a real @starting-style transition AND
// is offered as the copy-pasteable artifact a designer pastes into a stylesheet.
const springCss = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);

// The clipboard payload: the full declaration, ready to paste.
const copyableCss = computed(
    () => `transition-timing-function: ${springCss.value};`,
);
</script>

<style scoped>
.stage-viewport {
    min-height: 7rem;
}

/* The discrete entry/exit card. The visible state is the base; @starting-style
   is the entry FROM-state; .is-hidden is the exit TO-state (display:none). The
   spring linear() (--spring-ease) eases opacity + translate + scale; display
   rides transition-behavior: allow-discrete so the card stays painted through
   the exit instead of vanishing instantly. */
.discrete-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1.5rem 2.5rem;
    border-radius: var(--radius-lg, 1rem);
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--color-progress) 24%, transparent);

    opacity: 1;
    translate: 0 0;
    scale: 1;

    transition:
        opacity var(--duration-slow, 500ms) var(--spring-ease, ease),
        translate var(--duration-slow, 500ms) var(--spring-ease, ease),
        scale var(--duration-slow, 500ms) var(--spring-ease, ease),
        display var(--duration-slow, 500ms);
    /* MANDATORY for the display discrete transition — a separate declaration so
       a non-supporting engine still honors the opacity/translate/scale list. */
    transition-behavior: allow-discrete;
}

/* Entry FROM-state: the browser transitions out of these on first render. */
@starting-style {
    .discrete-card {
        opacity: 0;
        translate: 0 1.25rem;
        scale: 0.9;
    }
}

/* Exit TO-state: the card eases to here, then display:none takes it (discrete). */
.discrete-card.is-hidden {
    display: none;
    opacity: 0;
    translate: 0 1.25rem;
    scale: 0.9;
}

/* The former scoped active-ring rule is DELETED (J.W7b S1b, no-legacy): the
   active affordance hangs off the consumed ToggleChip's `data-state="on"`
   seam, same scene-semantic --color-progress ring via the call-site class. */

.artifact {
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-md, 0.5rem);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
}

/* MANDATORY PRM degrade: no transition under reduced motion — an instant,
   clean toggle (the discrete display change still applies, just without motion). */
@media (prefers-reduced-motion: reduce) {
    .discrete-card {
        transition: none;
    }
}
</style>
