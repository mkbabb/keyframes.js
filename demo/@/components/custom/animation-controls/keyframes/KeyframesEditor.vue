<template>
    <div class="contents">
        <Card class="glass-card p-0 m-0">
            <CardContent class="p-2 m-0 mt-0 grid gap-4 relative">
                <template v-for="(s, i) in templateFrameStrings" :key="animation.templateFrames[i]?.id ?? i">
                    <KeyframeCard
                        :ref="(el: any) => (keyframeRefs[i] = el?.$el ?? el)"
                        :frame-string="s"
                        :formatted-c-s-s="formatCSSKeyframeString(s)"
                        :frame-start="animation.templateFrames[i].start.toString()"
                        :index="i"
                        @update-start="(val) => {
                            animation.templateFrames[i].start = parseCSSValueUnit(val);
                            updateAllStringsAndAnimation();
                        }"
                        @update-c-s-s="(value) => {
                            updateAnimationFromKeyframeString(value, i);
                            animateProgressBar(progressBarKeyframesEl!);
                        }"
                        @remove="(e) => removeKeyframe(e, i)"
                        @keydown="onKeyDown"
                    />

                    <Separator
                        class="w-full"
                        v-if="i < templateFrameStrings.length - 1"
                    />
                </template>
            </CardContent>
        </Card>

        <div class="grid gap-4 sticky bottom-0 bg-background rounded-panel p-4 pt-4 m-4">
            <Slider
                :model-value="
                    animation.templateFrames.map((frame) => frame.start.value)
                "
                @update:model-value="
                    (starts) => {
                        animation.templateFrames.forEach((frame, i) => {
                            frame.start.value = starts![i];
                        });
                        updateAllStringsAndAnimation();
                    }
                "
                :min="-10"
                :max="110"
                :step="1"
            >
            </Slider>

            <Menubar class="w-full mt-4 flex justify-evenly gap-2 overflow-x-scroll">
                <MenubarMenu>
                    <MenubarTrigger>
                        <WandSparkles></WandSparkles>
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <Dialog
                            v-model:open="kfControls.dialogOpen"
                            @update:open="
                                (value) => {
                                    kfControls.dialogOpen = value;
                                }
                            "
                        >
                            <DialogTrigger as-child>
                                <FilePlus2
                                    class="cursor-pointer hover:scale-105 rounded-lg stroke-2"
                                ></FilePlus2
                            ></DialogTrigger>

                            <DialogContent
                                @interact-outside="
                                    (event) => {
                                        const target = event.target as HTMLElement;
                                        if (target?.closest('[data-sonner-toaster]'))
                                            return event.preventDefault();
                                    }
                                "
                            >
                                <DialogTitle>
                                    <CardTitle class="text-3xl"
                                        >Add keyframes</CardTitle
                                    >
                                    <DialogDescription class="instrument-serif">
                                        Add keyframes to the animation
                                    </DialogDescription>
                                </DialogTitle>
                                <div>
                                    <pre
                                        ref="addKeyframesEl"
                                        @keydown="onKeyDown"
                                        @input="
                                            (e) => {
                                                const value = (e.target as HTMLElement)
                                                    .innerText;

                                                kfControls.addKeyframes =
                                                    value;
                                                addKeyframesString = value;
                                            }
                                        "
                                        class="hljs css min-h-[25vh] p-2 cursor-text rounded-lg text-sm bg-transparent outline-none border-none relative"
                                        contenteditable="true"
                                    ><code>{{ addKeyframesString }}</code></pre>
                                </div>
                                <DialogFooter class="sticky bottom-0 class grid">
                                    <Button
                                        type="submit"
                                        @click="
                                            () => {
                                                addKeyframesStringToAnimation(
                                                    addKeyframesString,
                                                );
                                                animateProgressBar(
                                                    progressBarAddKeyframesEl!,
                                                );
                                            }
                                        "
                                        >Add Keyframes<FileIcon></FileIcon
                                    ></Button>

                                    <div
                                        ref="progressBarAddKeyframesEl"
                                        class="progress-bar w-full bottom mt-2"
                                    ></div>
                                </DialogFooter>
                            </DialogContent> </Dialog
                    ></MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <CopyButton
                            class="w-6 h-6 hover:scale-105"
                            :text="cssKeyframesString"
                        />
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <Paintbrush
                            ref="brush"
                            @click="
                                () => {
                                    applyCSSStyles();
                                }
                            "
                            class="cursor-pointer bg-transparent hover:bg-transparent hover:scale-105"
                        />
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom mt-2"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation/index";
import { formatCSSKeyframeString } from "@src/parsing/format";

import {
    Slider,
    Card,
    CardContent,
    CardTitle,
    Separator,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
    useGlobalDark,
} from "@mkbabb/glass-ui";

import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { useApplyCSS } from "./composables/useApplyCSS";

import CopyButton from "@components/custom/CopyButton.vue";
import KeyframeCard from "./KeyframeCard.vue";

import {
    FileIcon,
    FilePlus2,
    Paintbrush,
    WandSparkles,
    X,
} from "lucide-vue-next";

import githubDark from "highlight.js/styles/github-dark.css?inline";
import githubLight from "highlight.js/styles/github.css?inline";

import hljs from "highlight.js";

import css from "highlight.js/lib/languages/css";
import { Menubar, MenubarTrigger, MenubarMenu } from "@components/ui/menubar";

import { parseCSSValueUnit } from "@src/parsing/units";

import { useMagicKeys } from "@vueuse/core";
import * as animations from "@src/animation/animations";

import { useKeyframesEditor } from "./composables/useKeyframesEditor";

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

const {
    cssKeyframesString,
    addKeyframesString,
    templateFrameStrings,
    animationUUID,
    keyframesStyleId,
    storedControls,
    kfControls,
    updateAllStrings,
    updateAllStringsAndAnimation,
    updateAnimationFromKeyframesString,
    updateAnimationFromKeyframeString,
    updateAddKeyframesString: composableUpdateAddKeyframesString,
    addKeyframesStringToAnimation,
    removeKeyframeData,
} = useKeyframesEditor(() => animation, emit);

const cssKeyframesStringEl = useTemplateRef<HTMLElement>("cssKeyframesStringEl");
const addKeyframesEl = useTemplateRef<HTMLElement>("addKeyframesEl");
const keyframeRefs = ref<any[]>([]);

const setHighlightingString = (el: HTMLElement, s: string) => {
    if (el) {
        el.setAttribute("highlighted", "");
        el.innerHTML = s;
    }
};

const keys = useMagicKeys({ reactive: true });

watch(
    () => {
        return (keys["Shift"] && keys["Alt"] && keys["F"]) || keys["Ï"];
    },
    (v) => {
        if (v && kfControls.dialogOpen) {
            updateAddKeyframesString(addKeyframesString.value);
        }
    },
);

const updateAddKeyframesString = async (keyframesString: string) => {
    const formatted = await composableUpdateAddKeyframesString(keyframesString);

    setHighlightingString(addKeyframesEl.value!, formatted);
    highlightCSS();

    const sel = window.getSelection();
    if (sel) {
        sel.collapseToEnd();
    }
};

function onKeyDown(e: KeyboardEvent) {
    const { target, key } = e;

    if (key === "Ï") {
        e.preventDefault();
        return;
    }

    if (key === "Tab") {
        e.preventDefault();

        // @ts-ignore
        const doc = target.ownerDocument.defaultView;
        const sel = doc.getSelection();
        const range = sel.getRangeAt(0);

        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    highlightCSS();
}

const removeKeyframe = async (e: Event, frameIx: number) => {
    if (animation.templateFrames.length <= 1) {
        return;
    }

    const el1 = keyframeRefs.value[frameIx];
    const el2 =
        frameIx < keyframeRefs.value.length - 1
            ? keyframeRefs.value[frameIx + 1]
            : keyframeRefs.value[frameIx - 1];

    await animations
        .warpLeft()
        .setTargets(el1)
        .group(animations.jumpUp().setTargets(el2))
        .play();

    removeKeyframeData(frameIx);
};

const progressBarKeyframesEl = useTemplateRef<HTMLElement>("progressBarKeyframesEl");
const progressBarAddKeyframesEl = useTemplateRef<HTMLElement>("progressBarAddKeyframesEl");

const animateProgressBar = (el: HTMLElement) => {
    new CSSKeyframesAnimation(
        {
            duration: 1000,
        },
        el,
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

const hljsStyle = ref<HTMLStyleElement | null>(null);

const { isApplied: cssApplied, toggle: toggleApplyCSS, clear: clearApplyCSS } = useApplyCSS({
    getAnimation: () => animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    getClassName: () => keyframesStyleId,
});

const applyCSSStyles = () => {
    toggleApplyCSS();
    if (cssApplied.value) {
        brushAnimation.play();
    } else {
        brushAnimation.pause();
    }
};

const brush = useTemplateRef<HTMLElement>("brush");

const brushAnimation = new CSSKeyframesAnimation({
    duration: 700,
    timingFunction: "linear",
    iterationCount: "infinite",
    direction: "alternate",
}).fromString(
    /*css*/
    `@keyframes paintbrushWipe {
                0%, 100% {
                    transform: rotate(0deg);
                }
                20%, 30%, 40% {
                    transform: rotate(30deg);
                }
                60%, 70%, 80% {
                    transform: rotate(-90deg);
                }
            }`,
);

const { isDark } = useGlobalDark();
const setCodeTheme = () => {
    if (!hljsStyle.value) {
        return;
    }

    hljsStyle.value.textContent = isDark.value ? githubDark : githubLight;
};
watch(isDark, () => {
    setCodeTheme();
});

const highlightCSS = (el?: HTMLElement) => {
    const existingHLJSStyle = document.head.querySelector("#highlightjs-theme");

    if (!existingHLJSStyle) {
        hljsStyle.value = document.createElement("style");
        hljsStyle.value.id = "highlightjs-theme";

        document.head.appendChild(hljsStyle.value);
    } else {
        hljsStyle.value = existingHLJSStyle as HTMLStyleElement;
    }

    setCodeTheme();

    const highlight = (e: HTMLElement) => {
        if (!e || e.getAttribute("highlighted")) {
            return;
        }

        const s = e.innerText;
        const h = hljs.highlight(s, { language: "css" });
        e.innerHTML = h.value;

        e.setAttribute("highlighted", "true");
    };

    highlight(el!);
    highlight(cssKeyframesStringEl.value!);

    const pres = document.querySelectorAll("pre");
    pres.forEach(highlight);
};

// Watch cssKeyframesString to apply highlighting when it changes
watch(cssKeyframesString, (newVal) => {
    setHighlightingString(cssKeyframesStringEl.value!, newVal);
    highlightCSS();
});

watch(
    () => addKeyframesEl.value,
    () => {
        if (!addKeyframesEl.value) {
            return;
        }
        highlightCSS(addKeyframesEl.value);
    },
);

onMounted(() => {
    brushAnimation.setTargets(brush.value!);

    updateAllStrings();
});

onUnmounted(() => {
    // Clean up hljs style element injected into document.head
    hljsStyle.value?.remove();
    // Stop brush animation
    brushAnimation.pause();
});
</script>

<style scoped>
.progress-bar {
    @apply h-2 rounded-md;
    background: linear-gradient(
        to right,
        var(--rainbow-red) 0%,
        var(--rainbow-yellow) 17%,
        var(--rainbow-green) 33%,
        hsl(180 80% 50%) 50%,
        var(--rainbow-blue) 67%,
        var(--rainbow-violet) 83%,
        var(--rainbow-red) 100%
    );
}
</style>
