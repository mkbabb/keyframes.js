<template>
    <div ref="el">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";
import * as animations from "@src/animation/animations";
import { sleep } from "@src/utils";
import {
    getCurrentInstance,
    onBeforeUpdate,
    onMounted,
    ref,
    useTemplateRef,
    watch,
} from "vue";

const fadeIn = ref(animations.fadeIn());
const fadeOut = ref(animations.fadeOut());

const instance = getCurrentInstance();

const el = useTemplateRef<HTMLElement>("el");

const children = ref<HTMLElement[]>([]);

const enter = fadeIn.value;
const leave = fadeOut.value;

const onEnter = async () => {
    console.log("Entering");

    enter.setTargets(...children.value);
    leave.setTargets(...children.value);

    leave.stop();
    enter.play();
};

const onLeave = async () => {
    console.log("Leaving");
    enter.stop();
    await leave.play();
};

const watcher = (el: HTMLElement) => {
    const isHidden =
        el.style.display === "none" ||
        el.hasAttribute("hidden") ||
        el.hasAttribute("leaving");

    return isHidden;
};

watch(
    () => children.value.some(watcher),
    () => {
        if (children.value.some(watcher)) {
            onLeave();
        }
    },
);

onMounted(() => {
    // children = instance?.subTree?.children?.map((child) => child.el as HTMLElement);
    children.value = el.value!.childNodes as unknown as HTMLElement[];
    onEnter();
});

onBeforeUpdate(() => {
    console.log("Before Update");
});

// onBeforeUnmount(async () => {
//     onLeave();
// });
</script>
