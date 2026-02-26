<template>
    <div class="container">
        <AnimationControls :animation="anim" />
        <div ref="box" class="box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { CSSKeyframesAnimation } from "@src/animation";
import { AnimationControls } from "@components/custom/animation-controls";
import "@styles/style.css";

const box = useTemplateRef<HTMLElement>("box");

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

const CSSKeyframes = /*css*/ `
@keyframes mijn-keyframes {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(0turn);
        background-color: #C462D8;
    }
    100% {
        transform: translateX(50%) translateY(75%) rotate(1turn);
        background-color: #E85252;
    }
}
`;

anim.fromString(CSSKeyframes);

onMounted(() => {
    anim.setTargets(box.value!);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&display=swap");

* {
    font-family: "Fira Code", monospace;
}

.container {
    display: grid;

    --padding: 0.5rem;
    padding: var(--padding);
    min-height: calc(100% - 2 * var(--padding));
    width: calc(100% - 2 * var(--padding));

    grid-template-areas: "animation-controls box";
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
}

.box {
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
    background-color: aquamarine;

    box-shadow: 0 0 0 0.5rem rgba(255, 255, 255, 0.5);
}
</style>
