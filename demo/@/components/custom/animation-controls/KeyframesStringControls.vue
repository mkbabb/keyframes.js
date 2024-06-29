<template>
    <div class="relative h-full overflow-scroll">
        <Card>
            <CardContent class="m-0 p-0 mt-2 grid grid-cols-1 z-10">
                <div
                    class="absolute top-0 right-0 m-2 grid grid-cols-2 gap-4 items-center bg-foreground rounded-md opacity-75 hover:opacity-100"
                >
                    <CopyButton
                        class="cursor-pointer text-background relative bg-transparent hover:bg-transparent hover:scale-105"
                        :text="cssKeyframesString"
                    />

                    <Paintbrush
                        ref="brush"
                        @click="
                            () => {
                                applyCSSStyles();
                                startBrushAnimation();
                            }
                        "
                        class="cursor-pointer text-background bg-transparent hover:bg-transparent hover:scale-105"
                    />
                </div>
                <pre
                    @input="animateParseCSSKeyframesStringEl"
                    @keydown="onKeyDown"
                    ref="CSSKeyframesStringEl"
                    class="hljs css p-2 cursor-text rounded-md text-sm bg-transparent outline-none border-none"
                    contenteditable="true"
                >
                    <code>{{ cssKeyframesString }}</code>
                </pre>
            </CardContent>
        </Card>

        <div ref="progressBarEl" class="progress-bar sticky bottom-0"></div>
    </div>
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

import { computed, onMounted, watch } from "vue";

import CopyButton from "@components/custom/CopyButton.vue";

import { Toggle } from "@components/ui/toggle";

import { Paintbrush } from "lucide-vue-next";

// @ts-ignore
import githubDark from "highlight.js/styles/github-dark.css?inline";
// @ts-ignore
import githubLight from "highlight.js/styles/github.css?inline";

import { useDark } from "@vueuse/core";

import hljs from "highlight.js";

import css from "highlight.js/lib/languages/css";
import { createAnimationUUId, getAnimationSuperKey } from "./animationStores";
import Button from "@components/ui/button/Button.vue";

hljs.registerLanguage("css", css);

const { animation, superKey } = defineProps<{
    animation: Animation<any>;
    superKey?: string;
}>();

const animationUUID = createAnimationUUId(animation, superKey);
const keyframesStyleId = `keyframes-style-${animationUUID}`;

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
    const s =
        keyframes ?? (await CSSKeyframesToString(animation, keyframesStyleId, 45));

    cssKeyframesString = s;

    if (CSSKeyframesStringEl) {
        const h = hljs.highlight(s, { language: "css" });
        CSSKeyframesStringEl.innerHTML = h.value;
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

let hljsStyle = $ref(null);
let keyframesStyle = $ref(null);

let prevPaused = $ref(false);

const applyCSSStyles = () => {
    const wasApplied =
        keyframesStyle && keyframesStyle.innerHTML.includes(cssKeyframesString);

    if (wasApplied) {
        animation.paused = prevPaused;
        keyframesStyle.innerHTML = "";
        animation.target.classList.remove(keyframesStyleId);
    } else {
        prevPaused = animation.paused;
        animation.paused = animation.started;

        keyframesStyle.innerHTML = cssKeyframesString;
        animation.target.classList.add(keyframesStyleId);
    }
};

const brush = $ref<HTMLElement>(null);

const startBrushAnimation = () => {
    const animation = new CSSKeyframesAnimation(
        {
            duration: 700,
            timingFunction: "ease-in-out",
        },
        brush,
    )
        .fromCSSKeyframes(
            /*css*/
            `@keyframes paintbrushWipe {
                0% {
                    transform: translateX(0) translateY(0) rotate(0deg);
                }
                25% {
                    transform: translateX(0) translateY(0) rotate(30deg);
                }
                50% {
                    transform: translateX(0) translateY(0) rotate(-90deg);
                }
                75% {
                    transform: translateX(0) translateY(0) rotate(30deg);
                }
                100% {
                    transform: translateX(0) translateY(0) rotate(0deg);
                }
            }`,
        )
        .play();
};

const isDark = useDark();

const setCodeTheme = () => {
    hljsStyle.innerHTML = isDark.value ? githubDark : githubLight;
};

watch(isDark, () => {
    setCodeTheme();
});

onMounted(() => {
    const existingHLJSStyle = document.head.querySelector("#highlightjs-theme");

    if (existingHLJSStyle) {
        hljsStyle = existingHLJSStyle;
    } else {
        hljsStyle = document.createElement("style");
        hljsStyle.id = "highlightjs-theme";

        document.head.appendChild(hljsStyle);

        setCodeTheme();
    }

    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (existingKeyframesStyle) {
        keyframesStyle = existingKeyframesStyle;
    } else {
        keyframesStyle = document.createElement("style");
        keyframesStyle.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle);
    }

    updateCSSKeyframesString();
});
</script>

<style scoped lang="scss">
.progress-bar {
    --height: 0.5rem;

    // width: 100%;

    height: var(--height);

    // bottom: var(--offset);
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
