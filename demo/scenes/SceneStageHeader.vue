<template>
    <!-- X.KF.W13X.sections · A2-KE-L1-8 — THE scene stage header, one component.
         Five stages (Spring, Sequence, Easing, Square, @starting-style) each
         hand-assembled the same header: the scene's name at the display rung,
         its live readouts, and (Spring, Square) the settled/tracking status
         badge, whose span was copied with an identical class string. The title
         is glass's section-title primitive (`CardTitle`, an h2 by default); the
         readouts are the stage's own (glass `Metric` where the stage has one);
         the status word is authored ONCE, here, as the scene's live region.
         Each stage keeps its own placement: its classes land on the root
         (`class`), the identity column (`idClass`) and the aside (`asideClass`).
         The badge's skin is the demo's `.status-badge` idiom until glass Badge
         ships a soft status tone (UIA-KF-201 → O-59, ADOPT-AT-LANDING).
         X-DS pass 6 (KF-C6-05) — ONE PLACE FOR THE STATE. The badge rode each
         scene's aside, so one markup stood in two places (under Square's x/y
         readout, in Spring's top-right corner). It now has one fixed slot: the
         title's row, trailing the title on its baseline, in every scene that
         reports a state. The aside keeps the scene's own readouts only. -->
    <header data-scene-stage-header>
        <div :class="idClass">
            <div v-if="status !== undefined" class="flex items-baseline gap-2">
                <slot name="title">
                    <CardTitle as="h2" :class="['text-display text-foreground', titleClass]">{{ title }}</CardTitle>
                </slot>
                <span
                    class="status-badge text-mono-micro uppercase px-2 py-0.5 rounded-full"
                    :class="status === 'settled' ? 'settled-badge' : 'tracking-badge'"
                    role="status"
                    >{{ status }}</span
                >
            </div>
            <slot v-else name="title">
                <CardTitle as="h2" :class="['text-display text-foreground', titleClass]">{{ title }}</CardTitle>
            </slot>
            <slot name="readouts" />
        </div>
        <div v-if="$slots.aside" :class="asideClass">
            <slot name="aside" />
        </div>
    </header>
</template>

<script setup lang="ts">
import { CardTitle } from "@mkbabb/glass-ui/card";

defineProps<{
    /** The scene's name (the `#title` slot replaces it where the title animates). */
    title?: string;
    /** The status word (settled · tracking · derby); the badge renders only when it is given, and only `settled` wears the settled tone. */
    status?: string;
    titleClass?: string;
    idClass?: string;
    asideClass?: string;
}>();
</script>
