<template>
    <Card>
        <CardContent class="mt-4 grid grid-cols-1 gap-2 overflow-scroll">
            <div class="relative">
                <div class="absolute top-2 right-2 grid grid-cols-2 gap-2 items-center">
                    <CopyButton :text="cssKeyframesString" />
                    <Paintbrush
                        class="text-background relative bg-transparent hover:bg-transparent hover:scale-105"
                    />
                </div>
                <pre
                    @input="animateParseCSSKeyframesStringEl"
                    @keydown="onKeyDown"
                    ref="CSSKeyframesStringEl"
                    class="hljs css p-2 rounded-md text-sm"
                    contenteditable="true"
                >
                    <code>{{ cssKeyframesString }}</code>
                </pre>
            </div>

            <div ref="progressBarEl" class="progress-bar sticky bottom-0"></div>
        </CardContent>
    </Card>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation";
import { CSSKeyframesToString } from "@src/parsing/format";
import { CSSAnimationKeyframes } from "@src/parsing/keyframes";
import { debounce } from "@src/utils";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { computed, onMounted } from "vue";

import CopyButton from "@components/custom/CopyButton.vue";

import { Paintbrush } from "lucide-vue-next";

import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import css from "highlight.js/lib/languages/css";

hljs.registerLanguage("css", css);

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animationId: number;
        },
    ): void;
    (
        e: "keyframesUpdate",
        val: {
            animation: Animation<any>;
        },
    ): void;
}>();

let CSSKeyframesStringEl = $ref(null);
let cssKeyframesString = $ref("");

const updateCSSKeyframesString = async (keyframes?: string) => {
    const s = keyframes ?? (await CSSKeyframesToString(animation, "animation", 45));

    cssKeyframesString = s;

    if (CSSKeyframesStringEl) {
        const h = hljs.highlight(s, { language: "css" });
        CSSKeyframesStringEl.innerHTML = h.value;
    }
    if (style) {
        style.innerHTML = s;
    }

    return s;
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Tab") {
        e.preventDefault();

        const doc = CSSKeyframesStringEl.ownerDocument.defaultView;
        const sel = doc.getSelection();
        const range = sel.getRangeAt(0);

        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

const parseCSSKeyframesStringEl = debounce((event: Event) => {
    const parseAndUpdate = () => {
        // @ts-ignore
        const s: string = event.target.innerText;

        const { options, values, keyframes } = CSSAnimationKeyframes.Values.tryParse(s);

        const anim = new CSSKeyframesAnimation(
            options,
            animation.target,
        ).fromCSSKeyframes(keyframes).animation;

        for (const key of Object.keys(animation)) {
            if (anim[key]) {
                Object.assign(animation[key], anim[key]);
            }
        }

        updateCSSKeyframesString();

        emit("keyframesUpdate", {
            animation,
        });
    };
    try {
        parseAndUpdate();
        CSSKeyframesStringEl.classList.remove("error");
    } catch (e) {
        console.error(e);
        CSSKeyframesStringEl.classList.add("error");
    }
}, 1000);

const progressBarEl = $ref(null);
const animateParseCSSKeyframesStringEl = (event: Event) => {
    parseCSSKeyframesStringEl(event);

    new CSSKeyframesAnimation(
        {
            duration: 1000,
        },
        progressBarEl,
    )
        .fromVars([
            {
                width: "0%",
            },
            {
                width: "100%",
            },
        ])
        .play();
};

let style = $ref(null);
let prevPaused = $ref(false);
let cssApplied = $ref(false);

const cssApply = async () => {
    if (cssApplied) {
        style.innerHTML = "";
        animation.paused = prevPaused;
        document.head.removeChild(style);
        animation.target.classList.remove("animation");
    } else {
        prevPaused = animation.paused;
        animation.paused = animation.started;

        style.innerHTML = cssKeyframesString;
        document.head.appendChild(style);
        animation.target.classList.add("animation");
    }
    cssApplied = !cssApplied;
};

onMounted(() => {
    style = document.createElement("style");
    updateCSSKeyframesString();
});
</script>

<style scoped lang="scss">
.progress-bar {
    --height: 0.5rem;
    width: 100%;

    height: var(--height);

    bottom: var(--offset);
    border-radius: 5px;
    background-image: linear-gradient(
        to right,
        #f00 0%,
        #ff0 17%,
        #0f0 33%,
        #0ff 50%,
        #00f 67%,
        #f0f 83%,
        #f00 100%
    );
}
</style>
