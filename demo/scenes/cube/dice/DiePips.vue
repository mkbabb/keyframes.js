<template>
    <!-- One face's pips on its 3 × 3 grid (pips.ts). Flat ink discs, no
         shading: the face is drawn, not lit. -->
    <span class="die-pips" :data-value="value" aria-hidden="true">
        <span
            v-for="([row, col], i) in PIPS[value]"
            :key="i"
            class="die-pip"
            :style="{ gridRow: row, gridColumn: col }"
        ></span>
    </span>
</template>

<script setup lang="ts">
import { PIPS, type DieValue } from "./pips";

defineProps<{ value: DieValue }>();
</script>
