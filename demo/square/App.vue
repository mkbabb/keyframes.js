<template>
    <div class="demo-container font-mono">
        <AnimationControls :animation="anim" />
        <div ref="box" class="demo-box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import AnimationControls from "@components/custom/animation-controls/controls/AnimationControls.vue";
import "@styles/style.css";
import "@styles/utils.css";
import { useSquareAnimations } from "./useSquareAnimations";

const box = useTemplateRef<HTMLElement>("box");
const { anim } = useSquareAnimations(box);

onMounted(() => {
    anim.setTargets(box.value!);
});
</script>
