<template>
    <div class="flex h-full w-full items-center justify-center">
        <div ref="box" class="simple-box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { AnimationGroup } from "@src/animation/group";
import { useSimpleAnimations } from "../../simple/useSimpleAnimations";

const superKey = "Simple";

const box = useTemplateRef<HTMLElement>("box");
const { anim } = useSimpleAnimations();
anim.name = "Keyframes";
anim.superKey = superKey;

const animationGroup = markRaw(new AnimationGroup(anim as any));

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
.simple-box {
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
