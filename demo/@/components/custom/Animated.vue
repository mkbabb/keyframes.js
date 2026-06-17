<template>
    <div ref="el">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import { onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";

// The fade presets are HEAVY (each returns a CSSKeyframesAnimation); they ride
// loadAnimationEngine() rather than a deep @src import. Built once at mount.
const enter = shallowRef<CSSKeyframesAnimation<any> | null>(null);
const leave = shallowRef<CSSKeyframesAnimation<any> | null>(null);

const el = useTemplateRef<HTMLElement>("el");

const children = ref<HTMLElement[]>([]);

const onEnter = async () => {
    if (!enter.value || !leave.value) return;
    enter.value.setTargets(...children.value);
    leave.value.setTargets(...children.value);

    leave.value.stop();
    enter.value.play();
};

const onLeave = async () => {
    if (!enter.value || !leave.value) return;
    enter.value.stop();
    await leave.value.play();
};

const isHidden = (el: HTMLElement) =>
    el.style.display === "none" ||
    el.hasAttribute("hidden") ||
    el.hasAttribute("leaving");

watch(
    () => children.value.some(isHidden),
    (hidden) => {
        if (hidden) {
            onLeave();
        }
    },
);

onMounted(async () => {
    const { presets } = await loadAnimationEngine();
    enter.value = presets.fadeIn();
    leave.value = presets.fadeOut();

    children.value = el.value!.childNodes as unknown as HTMLElement[];
    onEnter();
});
</script>
