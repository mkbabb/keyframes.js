<template>
    <div
        class="flex flex-col items-center justify-center gap-5 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset"
        :style="{ '--spring-ease': springCss }"
    >
        <!-- The discrete-transition stage. The card enters from nothing
             (@starting-style) and exits to display:none (allow-discrete),
             eased by the keyframes.js spring linear() in --spring-ease. -->
        <div class="stage glass-card w-full flex-1 min-h-0 flex flex-col">
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <span class="text-heading text-foreground truncate">@starting-style</span>
                <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                    eased by springLinearStops()
                </span>
            </div>

            <div class="flex-1 min-h-0 flex flex-col items-center justify-center gap-5 px-8 py-6">
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
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-small text-foreground">transition-timing-function</span>
                    <CopyButton class="shrink-0 w-4 h-4" :text="copyableCss" />
                </div>
                <code class="artifact text-mono-caption tabular-nums text-muted-foreground block w-full overflow-x-auto whitespace-nowrap">{{ springCss }}</code>
            </div>
        </div>

        <!-- Preset switch — re-samples the spring, so the artifact + the live
             transition update in lockstep (same solver, same preset). -->
        <div class="grid grid-cols-4 gap-2 w-full">
            <Button
                v-for="p in SPRING_PRESETS"
                :key="p.name"
                variant="outline"
                size="sm"
                class="h-auto py-1.5 flex flex-col items-center gap-0.5 btn-interactive"
                :class="{ 'preset-active': p.name === preset.name }"
                @click="preset = p"
            >
                <span class="text-small text-foreground capitalize">{{ p.name }}</span>
                <span class="text-admin-label text-muted-foreground tabular-nums">{{ p.response }} / {{ p.dampingFraction }}</span>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@mkbabb/glass-ui";
import { Eye, EyeOff } from "@lucide/vue";

import { springLinearStops } from "@src/animation/springLinearStops";
import CopyButton from "@components/custom/CopyButton.vue";

import { SPRING_PRESETS, type SpringPreset } from "./springPresets";

const visible = ref(true);
const toggle = () => { visible.value = !visible.value; };

// The "bouncy" preset makes the overshoot legible — the whole point of a spring
// linear(). The four canonical presets are switchable so the artifact + the
// live transition re-sample together (one solver, one curve).
const preset = ref<SpringPreset>(
    SPRING_PRESETS.find((p) => p.name === "bouncy") ?? SPRING_PRESETS[0]!,
);

// The emitted CSS linear() — the same springLinearStops() path the Spring scene
// surfaces, here driving a real @starting-style transition AND offered as the
// copy-pasteable artifact a designer pastes into their own stylesheet.
const springCss = computed(() =>
    springLinearStops({
        response: preset.value.response,
        dampingFraction: preset.value.dampingFraction,
    }),
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

.preset-active {
    border-color: var(--color-progress);
    box-shadow: 0 0 0 1px var(--color-progress) inset;
}

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
