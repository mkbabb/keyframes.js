<template>
    <div ref="el">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";
import * as animations from "@src/animation/animations";
import { sleep } from "@src/utils";
import { on } from "events";
import {
    Ref,
    getCurrentInstance,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onMounted,
    onRenderTriggered,
    onUnmounted,
    onUpdated,
    watch,
} from "vue";

const fadeIn = $ref(animations.fadeIn());
const fadeOut = $ref(animations.fadeOut());

const instance = getCurrentInstance();

const el = $ref<HTMLElement | null>(null);

let children = $ref<HTMLElement[]>([]);

const enter = fadeIn;
const leave = fadeOut;

const onEnter = async () => {
    console.log("Entering");

    enter.setTargets(...children);
    leave.setTargets(...children);

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
    () => children.some(watcher),
    () => {
        if (children.some(watcher)) {
            onLeave();
        }
    },
);

onMounted(() => {
    // children = instance?.subTree?.children?.map((child) => child.el as HTMLElement);
    children = el.childNodes as unknown as HTMLElement[];
    onEnter();
});

onBeforeUpdate(() => {
    console.log("Before Update");
});

// onBeforeUnmount(async () => {
//     onLeave();
// });
</script>
