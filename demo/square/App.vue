<template>
    <div class="container">
        <AnimationControls :animation="anim.animation" />
        <div ref="box" class="box">heyyyy</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import { CSSKeyframesAnimation } from "../../src/animation";
import AnimationControls from "../components/AnimationControls.vue";
import "../style.scss";

const box = $ref<HTMLElement>();

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

const transformFunc = (t: number, vars) => {
    const { transform, backgroundColor, fontSize, rotate } = vars;

    if (transform) {
        box.style.transform = `translate(${transform.x}, ${transform.y})`;
        box.style.transform += ` scale(${transform.a.b.c.d})`;
    }
    if (backgroundColor) {
        box.style.backgroundColor = backgroundColor;
    }
    if (fontSize) {
        box.style.fontSize = fontSize;
    }
    if (rotate) {
        box.style.transform += ` rotate(${rotate})`;
    }
};

const transformStart = {
    x: "-100%",
    y: "-100%",
    a: {
        b: {
            c: {
                d: "75%",
            },
        },
    },
};

const transformEnd = {
    x: "50%",
    y: "75%",
    a: {
        b: {
            c: {
                d: "200%",
            },
        },
    },
};
anim.fromKeyframes([
    [
        "0%",
        {
            rotate: "0turn",
            transform: transformStart,
            backgroundColor: "#C462D8",
        },
        transformFunc,
    ],
    [
        "500ms",
        {
            backgroundColor: "#6280D8",
        },
    ],
    [
        75,
        {
            backgroundColor: "#52E898",
            fontSize: "1rem",
        },
    ],
    [
        "100ms",
        {
            rotate: "1turn",
            transform: transformEnd,
            backgroundColor: "#E85252",
            fontSize: "3rem",
        },
    ],
]);

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
