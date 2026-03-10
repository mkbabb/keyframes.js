<template>
    <div class="flex h-full w-full items-center justify-center">
        <div ref="box" class="square-box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { AnimationGroup } from "@src/animation/group";
import { useSquareAnimations } from "../../square/useSquareAnimations";

const superKey = "Square";

const box = useTemplateRef<HTMLElement>("box");
const { anim } = useSquareAnimations(box);
anim.name = "Transform";
anim.superKey = superKey;

const animationGroup = markRaw(new AnimationGroup(anim as any));
// Force per-animation transform path — the grouped path passes flat ValueUnit
// values which don't match the nested object structure our transform expects.
animationGroup.singleTarget = false;

onMounted(() => {
    anim.setTargets(box.value!);
});

onBeforeUnmount(() => {
    animationGroup.stop();
});

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey,
});
</script>

<style scoped>
.square-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    --size: 12rem;
    width: var(--size);
    height: var(--size);
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    font-family: "Fira Code", monospace;
    background-color: aquamarine;
    box-shadow: 0 0 0 0.5rem rgba(255, 255, 255, 0.5);
}
</style>
