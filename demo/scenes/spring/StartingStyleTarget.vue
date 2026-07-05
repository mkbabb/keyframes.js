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

        <!-- S.F3 EN-d DOGFOOD — the copy-pasteable artifact is the REAL
             `compileToEntry` output for THIS card's entry/exit (its opacity/
             transform endpoints eased by the same spring), not a hand-typed
             timing-function line. A designer pastes it verbatim to reproduce the
             discrete transition: base(closed) + `.is-open` + `@starting-style`,
             with `display`/`overlay` `allow-discrete` and the spring `linear()`. -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-small text-foreground">compileToEntry() artifact</span>
                <CopyButton class="shrink-0 w-4 h-4" :text="compiledEntryCss || copyableCss" />
            </div>
            <code class="artifact text-mono-caption tabular-nums text-muted-foreground block w-full max-h-32 overflow-auto whitespace-pre">{{ compiledEntryCss || springCss }}</code>
        </div>

        <!-- K.W4 S5 — the redundant 4-preset ROW is RETIRED (the same four
             presets were shown THREE times: here + the SpringSidebar cells +
             implicitly the sliders, live-spring-sequence-mp-verdict.md §4). The
             ONE preset surface now lives in the SpringSidebar rail; this discrete
             stage demotes to a single QUIET result line naming the active preset
             (the same shared params drive it), so the discrete view stays
             legible about WHICH spring it eases without re-mounting the picker. -->
        <div class="active-preset-line flex w-full max-w-3xl items-center justify-center gap-2 shrink-0">
            <span class="text-caption text-muted-foreground">eased by</span>
            <span class="active-preset-chip text-mono-small capitalize" data-register="code">{{ activePresetName }}</span>
            <span class="text-mono-caption text-muted-foreground tabular-nums">
                ({{ demo.response.value.toFixed(2) }} / {{ demo.dampingFraction.value.toFixed(2) }})
            </span>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Button, Card } from "@mkbabb/glass-ui";
import { Eye, EyeOff } from "@lucide/vue";

import { useSpringLinearStops } from "./useSpringLinearStops";
import { useCompiledEntry } from "./useCompiledEntry";
import CopyButton from "@components/custom/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS } from "./springPresets";

// The discrete view of the Spring scene (H.W5.S3 — merged from the former
// standalone Discrete scene). `visible` / `toggle` are owned by the SPRING demo
// composable so the merged sub-view lives within the spring scene's SINGLE
// ScenePlayback registration — this Target only reads + drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

// K.W4 S5 — the active preset NAME for the quiet result line (the redundant
// 4-cell picker is retired; the ONE preset surface is the SpringSidebar rail).
// Falls back to "custom" when the shared params don't match a canonical preset.
const activePresetName = computed(() => {
    const match = SPRING_PRESETS.find(
        (p) =>
            Math.abs(demo.response.value - p.response) < 1e-6 &&
            Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6,
    );
    return match?.name ?? "custom";
});

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

// S.F3 EN-d — the REAL `compileToEntry` artifact for this card's entry/exit,
// compiled off the SAME shared spring params (dogfood: the demo runs the
// published emitter and shows its verbatim output, not a hand-typed twin).
const { css: compiledEntryCss } = useCompiledEntry(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);
</script>

<style scoped>
.stage-viewport {
    min-height: 7rem;
}

/* ── K.W4 S5 — the quiet active-preset result line (the retired picker's heir) ──
   The discrete view names WHICH spring it eases as a single chip wearing the
   red-dashed motion language (the --color-progress token, repointed red by Lane
   B, as a dashed outline — the settled-state register U-K17 prefers), NOT a
   redundant 4-cell picker. */
.active-preset-chip {
    color: color-mix(in srgb, var(--color-progress) 60%, var(--foreground));
    padding: 0.05rem 0.5rem;
    border-radius: var(--radius-pill);
    outline: 1px dashed color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
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
