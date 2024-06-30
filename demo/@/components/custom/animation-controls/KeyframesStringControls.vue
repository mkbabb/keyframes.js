<template>
    <Tabs
        class="relative"
        :model-value="storedControls.selectedKeyframesControl"
        @update:model-value="
            (key) => {
                storedControls.selectedKeyframesControl = key.toString();
            }
        "
    >
        <TabsList class="w-full flex gap-2 overflow-x-scroll">
            <TabsTrigger value="editor"><WandSparkles></WandSparkles> </TabsTrigger>
            <TabsTrigger value="keyframes"><BookOpenText></BookOpenText></TabsTrigger>
        </TabsList>

        <TabsContent value="keyframes">
            <Card>
                <CardContent class="relative m-0 p-0 grid grid-cols-1">
                    <pre
                        @input="
                            (e) => {
                                const value = (e.target as HTMLElement).innerText;

                                updateCSSAnimationKeyframes(value);
                                animateProgressBar();
                            }
                        "
                        @keydown="onKeyDown"
                        ref="cssKeyframesStringEl"
                        class="hljs css p-2 cursor-text rounded-md text-sm bg-transparent outline-none border-none z-100"
                        contenteditable="true"
                    ><code>{{ cssKeyframesString }}</code></pre>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="editor">
            <Card class="p-0 m-0">
                <CardContent class="p-2 m-0 mt-2 grid gap-4">
                    <template v-for="(s, i) in templateFrameStrings">
                        <div class="grid">
                            <Input
                                class="text-2xl w-32 text-ellipsis aspect-square font-semibold leading-none tracking-tight border-transparent p-0 m-0"
                                :model-value="
                                    animation.templateFrames[i].start.toString()
                                "
                                @update:model-value="
                                    (val) => {
                                        animation.templateFrames[i].start =
                                            parseCSSValueUnit(String(val));
                                        updateAllStrings();
                                    }
                                "
                            >
                            </Input>

                            <div class="relative">
                                <div class="italic absolute top-4 right-4 grid gap-2 justify-normal opacity-25 z-0 pointer-events-none">
                                    <Label>Frame {{ i }}</Label>
                                    <Label>Start {{ animation.templateFrames[i].start }}</Label>
                                </div>
                                <pre
                                    @input="
                                        (e) => {
                                            const value = (e.target as HTMLElement)
                                                .innerText;

                                            updateCSSAnimationKeyframe(value, i);
                                            animateProgressBar();
                                        }
                                    "
                                    @keydown="onKeyDown"
                                    class="hljs css p-2 cursor-text rounded-md text-sm bg-transparent outline-none border-none z-100"
                                    contenteditable="true"
                                ><code>{{ formatCSSKeyframeString(s) }}</code></pre>
                            </div>
                        </div>

                        <Separator
                            class="w-full"
                            v-if="i < templateFrameStrings.length - 1"
                        />
                    </template>
                </CardContent>
            </Card>
        </TabsContent>

        <div class="grid gap-4 sticky bottom-0 bg-background rounded-md p-2">
            <Slider
                class="pl-4 pr-4"
                :model-value="
                    animation.templateFrames.map((frame) => frame.start.value)
                "
                @update:model-value="
                    (starts) => {
                        animation.templateFrames.forEach((frame, i) => {
                            frame.start.value = starts[i];
                        });
                        updateAllStrings();
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
                        <CopyButton
                            class="cursor-pointer text-foreground relative bg-transparent hover:bg-transparent hover:scale-105"
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
                                    startBrushAnimation();
                                }
                            "
                            class="cursor-pointer bg-transparent hover:bg-transparent hover:scale-105"
                        />
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            <div ref="progressBarEl" class="progress-bar sticky bottom mt-2"></div>
        </div>
    </Tabs>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation";
import {
    CSSKeyframeToString,
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSS,
    formatCSSKeyframeString,
    parseCSSKeyframe,
} from "@src/parsing/format";
import {
    CSSAnimationKeyframes,
    parseCSSAnimationKeyframes,
    parseCSSKeyframes,
} from "@src/parsing/keyframes";
import { debounce } from "@src/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { Slider } from "@components/ui/slider";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { Input } from "@components/ui/input";

import { computed, onMounted, watch } from "vue";

import CopyButton from "@components/custom/CopyButton.vue";

import { Toggle } from "@components/ui/toggle";

import { Paintbrush } from "lucide-vue-next";

// @ts-ignore
import githubDark from "highlight.js/styles/github-dark.css?inline";
// @ts-ignore
import githubLight from "highlight.js/styles/github.css?inline";

import { useDark } from "@vueuse/core";

import { Separator } from "@components/ui/separator";

import { WandSparkles, BookOpenText } from "lucide-vue-next";

import hljs from "highlight.js";

import css from "highlight.js/lib/languages/css";
import {
    createAnimationUUId,
    getAnimationSuperKey,
    getStoredAnimationGroupControlOptions,
} from "./animationStores";
import Button from "@components/ui/button/Button.vue";
import { set } from "zod";
import { Menubar, MenubarTrigger, MenubarMenu } from "@components/ui/menubar";
import Label from "@components/ui/label/Label.vue";
import { parseCSSValueUnit } from "@src/parsing/units";

hljs.registerLanguage("css", css);

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const animationUUID = createAnimationUUId(animation, animation.superKey);
const keyframesStyleId = `keyframes-style-${animationUUID}`;

const storedControls = getStoredAnimationGroupControlOptions(animation);

storedControls.selectedKeyframesControl ??= "keyframes";

console.log({ storedControls });

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

let cssKeyframesStringEl = $ref(null);
let cssKeyframesString = $ref("");

const updateCSSAnimationKeyframesString = async (keyframes?: string) => {
    const animationName = keyframesStyleId
        .replace("keyframes-style-", "")
        .toLowerCase();

    const s = keyframes ?? (await CSSKeyframesToString(animation, animationName, 45));

    cssKeyframesString = s;
    if (cssKeyframesStringEl) {
        cssKeyframesStringEl.setAttribute("highlighted", "");
        cssKeyframesStringEl.innerHTML = s;
    }

    highlightCSS();

    emit("keyframesUpdate", {
        animation,
    });

    return s;
};

function onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;

    if (e.key === "Tab") {
        e.preventDefault();

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
}

const updateCSSAnimationKeyframes = debounce((keyframesString: string) => {
    const parseAndUpdate = () => {
        const { options, values, keyframes } =
            parseCSSAnimationKeyframes(keyframesString);

        const tmpAnimation = new CSSKeyframesAnimation(
            options,
            animation.target,
        ).fromCSSKeyframes(keyframes).animation;

        animation.updateFrom(tmpAnimation);

        updateAllStrings();
    };

    try {
        parseAndUpdate();
    } catch (e) {
        console.error(e);
    }
}, 1000);

const updateCSSAnimationKeyframe = debounce(
    (keyframeString: string, frameIx: number) => {
        const parseAndUpdate = () => {
            const [newStart, newVars] = Object.entries(
                parseCSSKeyframe(keyframeString),
            )[0];

            const tmpAnimation = new Animation(animation.options, animation.target);

            animation.templateFrames.forEach((f, i) => {
                let { start, vars, transform, timingFunction } = f;
                if (i === frameIx) {
                    start = parseInt(newStart) as any;
                    vars = newVars;
                }
                tmpAnimation.frame(start, vars, transform, timingFunction);
            });

            tmpAnimation.parse();

            animation.updateFrom(tmpAnimation);

            updateAllStrings();
        };

        try {
            parseAndUpdate();
        } catch (e) {
            console.error(e);
        }
    },
    1000,
);

const progressBarEl = $ref(null);
const animateProgressBar = () => {
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
    if (!hljsStyle) {
        return;
    }

    hljsStyle.innerHTML = isDark.value ? githubDark : githubLight;
};

watch(isDark, () => {
    setCodeTheme();
});

const highlightCSS = () => {
    const existingHLJSStyle = document.head.querySelector("#highlightjs-theme");

    if (!existingHLJSStyle) {
        hljsStyle = document.createElement("style");
        hljsStyle.id = "highlightjs-theme";

        document.head.appendChild(hljsStyle);
    } else {
        hljsStyle = existingHLJSStyle;
    }

    setCodeTheme();

    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (!existingKeyframesStyle) {
        keyframesStyle = document.createElement("style");
        keyframesStyle.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle);
    } else {
        keyframesStyle = existingKeyframesStyle;
    }

    const pres = document.querySelectorAll("pre");
    pres.forEach((pre) => {
        if (pre.getAttribute("highlighted")) {
            return;
        }

        const s = pre.innerText;
        const h = hljs.highlight(s, { language: "css" });
        pre.innerHTML = h.value;

        pre.setAttribute("highlighted", "true");
    });
};

let templateFrameStrings = $ref<string[]>([]);

const updateAllStrings = () => {
    templateFrameStrings = [];

    CSSKeyframesToStrings(animation).then((frames) => {
        templateFrameStrings = frames;
        updateCSSAnimationKeyframesString();
    });
};

watch(
    () => storedControls.selectedKeyframesControl,
    () => {
        updateAllStrings();
    },
);

watch(animation.templateFrames, () => {
    updateAllStrings();
});

onMounted(() => {
    updateAllStrings();
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
