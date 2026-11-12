<template>
    <!-- X.KF.W13X.sections · A2-KE-L1-8 — THE scene stage header, one component.
         Each stage hands it its live readouts. Restraint (value.js
         docs/precepts/restraint.md): no status badge; the moving subject is
         the state.
         owner-1112 (item 10, "remove the header like 'Spring'") — the stage
         names nothing: the dock already says which scene this is, so the
         display-rung title ("Spring", "Square", "Sequence", "@starting-style")
         is gone from every stage at once, here at its one owner. What stays
         is the readout row. -->
    <header data-scene-stage-header>
        <div :class="idClass">
            <slot name="readouts" />
        </div>
        <div v-if="$slots.aside" :class="asideClass">
            <slot name="aside" />
        </div>
    </header>
</template>

<script setup lang="ts">
defineProps<{
    idClass?: string;
    asideClass?: string;
}>();
</script>

<style>
/* K-D2 (value.js X realization) — THE SHORT PLATE. When the phone stage's
   visible box is short (a landscape phone: the stage cell is the size
   container `stage`), the readouts are ONE baseline row. The instrument below
   takes the remainder. */
@container stage (max-block-size: 20rem) {
    [data-scene-stage-header] > :first-child {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: baseline;
        column-gap: var(--space-family, 1rem);
    }
}
</style>
