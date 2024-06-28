<template>
    <div class="container">
        <AnimationControls :animation="anim.animation" />
        <div ref="box" class="box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import { CSSKeyframesAnimation, Keyframes } from "../../src/animation";
import { AnimationControls } from "@components/custom/animation-controls";
import "../style.scss";

const box = $ref<HTMLElement>();

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

const transformKeyframes = (t: number, vars) => {
    const { transform, backgroundColor, rotate } = vars;

    console.log(vars);

    if (transform) {
        box.style.transform = `translate(${transform.x}, ${transform.y})`;
    }

    if (backgroundColor) {
        box.style.backgroundColor = backgroundColor;
    }

    if (rotate) {
        box.style.transform += ` rotate(${rotate})`;
    }
};

const keyframes: Keyframes<any> = [
    [
        "0%",
        {
            rotate: "0turn",
            transform: {
                x: "-100%",
                y: "-100%",
            },
            backgroundColor: "#C462D8",
        },
        transformKeyframes,
    ],
    [
        "100%",
        {
            rotate: "1turn",
            transform: {
                x: "50%",
                y: "75%",
            },
            backgroundColor: "#E85252",
        },
    ],
];

const CSSKeyframes = /*css*/ `
@keyframes mijn-keyframes {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(0turn);
        background-color: 5000k;
    }
    100% {
        transform: translateX(50%) translateY(75%) rotate(1turn);
        background-color: 1000k;
    }
}
`;

// anim.fromKeyframes(keyframes);

anim.fromCSSKeyframes(CSSKeyframes);

console.log(anim.animation.frames);

onMounted(() => {
    anim.addTargets(box);
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
