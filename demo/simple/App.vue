<template>
    <div ref="box" class="box">heyyyy</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { CSSKeyframesAnimation } from "../../src/animation";

const box = $ref<HTMLElement>();

onMounted(() => {
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

    anim.fromFrames({
        0: [
            {
                rotate: "0turn",
                transform: transformStart,
                backgroundColor: "#C462D8",
            },
            transformFunc,
        ],
        50: [
            {
                backgroundColor: "#6280D8",
            },
        ],
        75: [
            {
                backgroundColor: "#52E898",
                fontSize: "1rem",
            },
        ],
        100: [
            {
                rotate: "1turn",
                transform: transformEnd,
                backgroundColor: "#E85252",
                fontSize: "3rem",
            },
        ],
    });
    anim.play();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&display=swap");

* {
    font-family: "Fira Code", monospace;
}

html,
body {
    height: 100%;
    width: 100%;
    margin: 0;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
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

    box-shadow: 0 0 0 0.5rem rgba(255, 255, 255, 0.5);
}
</style>
