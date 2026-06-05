<template>
    <div class="flex h-full w-full items-center justify-center">
        <div ref="box" class="demo-box font-mono">heyyyy</div>
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

<!-- The .demo-box layout (uncaged from utils.css, D.W2.S2). It lands on THIS
     component's own <div> and has exactly one consumer now (the standalone
     `simple` scene was removed), so its smallest shared scope is this SFC's
     own scoped block — the most encapsulated home. The `.demo-container` grid
     it once paired with is dead (zero consumers) and was deleted outright. -->
<style scoped>
.demo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    --size: 12rem;
    width: var(--size);
    height: var(--size);
    border-radius: var(--radius-lg);
    font-weight: bold;
    font-size: var(--type-body);
    background-color: aquamarine;
    box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--background) 50%, transparent);
}
</style>
