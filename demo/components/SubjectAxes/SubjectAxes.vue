<template>
    <!-- X.KF.W13X.r4shared · A2-KE-L1-18 — the keyboard-operable two-axis
         subject's accessible subtree, authored once. The subject itself (a
         canvas, a box) is the scene's `role="group"` keyboard target; this is
         what it holds: the description its `aria-describedby` points at, and one
         read-out per axis. The values are `role="status"` read-outs, never
         `role="slider"`: the keys belong to the group, and a slider that takes
         no focus and no keys is an inert widget (UIA-KF-291). Every node wears
         `.subject-axes-hidden` (design-idioms.css), so the subtree costs the
         stage no paint and no layout. -->
    <span :id="helpId" class="subject-axes-hidden"><slot /></span>
    <span v-for="axis in axes" :key="axis.label" class="subject-axes-hidden" role="status"
        >{{ axis.label }} {{ axis.value }}</span
    >
</template>

<script setup lang="ts">
defineProps<{
    /** The id the subject's `aria-describedby` names (the scene's `useId()`). */
    helpId: string;
    /** One entry per axis: its short name and its value as it is announced. */
    axes: readonly { label: string; value: string }[];
}>();
</script>
