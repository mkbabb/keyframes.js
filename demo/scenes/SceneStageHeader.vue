<template>
    <!-- X.KF.W13X.sections · A2-KE-L1-8 — THE scene stage header, one component.
         Each stage hands it its name at the display rung and its live
         readouts. Restraint (value.js docs/precepts/restraint.md): no status
         badge; the moving subject is the state.
         X-DS r3 pass 2 (KF-C21-02) — the title keeps its step over the
         controls' chrome at every width: below lg, glass's display-1 rung
         floors at 1.618rem, the size of the Configurator's section label
         ('Physics', 'Stagger', 'Easing'), so the chrome read as loud as the
         subject. ONE rule here (the style block below) puts every stage title,
         the slotted Easing name included, on display-2 below lg. The glass
         half (display-1 collapsing onto the section label at phone width) is
         cited under O-87 proportion, not overridden. -->
    <header data-scene-stage-header>
        <div :class="idClass">
            <slot name="title">
                <CardTitle v-if="title" as="h2" :class="['text-display text-foreground', titleClass]">{{ title }}</CardTitle>
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
    titleClass?: string;
    idClass?: string;
    asideClass?: string;
}>();
</script>

<style>
/* X-DS r3 pass 2 (KF-C21-02) — the stage title's rung below lg (unscoped so the
   slotted Easing name, a `text-display` h2 of its own, takes it too). */
@media (max-width: 1023px) {
    [data-scene-stage-header] .text-display {
        font-size: var(--type-display-2);
    }
}
/* K-D2 (value.js X realization) — THE SHORT PLATE. When the phone stage's
   visible box is short (a landscape phone: the stage cell is the size
   container `stage`, 229 px at 844x390), the header is ONE baseline row —
   title, status and readouts — and the title steps down one rung of the same
   display ladder (display-2 → display-1; the face, weight and ink are the
   owner's and do not change). The instrument below takes the remainder. */
@container stage (max-block-size: 20rem) {
    [data-scene-stage-header] .text-display {
        font-size: var(--type-display-1);
    }
    [data-scene-stage-header] > :first-child {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: baseline;
        column-gap: var(--space-family, 1rem);
    }
}
</style>
