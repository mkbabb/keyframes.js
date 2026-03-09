<template>
    <div ref="el">
        <slot />
    </div>
</template>

<script setup lang="ts">
import * as animations from "@src/animation/animations";
import { onMounted, ref, useTemplateRef, watch } from "vue";

const enter = animations.fadeIn();
const leave = animations.fadeOut();

const el = useTemplateRef<HTMLElement>("el");

const children = ref<HTMLElement[]>([]);

const onEnter = async () => {
    enter.setTargets(...children.value);
    leave.setTargets(...children.value);

    leave.stop();
    enter.play();
};

const onLeave = async () => {
    enter.stop();
    await leave.play();
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

onMounted(() => {
    children.value = el.value!.childNodes as unknown as HTMLElement[];
    onEnter();
});
</script>
