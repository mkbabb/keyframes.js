<template>
    <Tabs
        class="relative w-full grid"
        :model-value="storedControls.keyframeControls.selectedKeyframesControl"
        @update:model-value="
            (key) => {
                storedControls.keyframeControls.selectedKeyframesControl =
                    key.toString();
            }
        "
    >
        <TabsList
            ref="tabsListEl"
            class="w-full flex gap-2 sticky top-0 z-[100] overflow-x-scroll"
        >
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

                                updateAnimationFromKeyframesString(value);
                                animateProgressBar(progressBarKeyframesEl);
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
                <CardContent class="p-2 m-0 mt-0 grid gap-4 relative">
                    <template v-for="(s, i) in templateFrameStrings" :key="i">
                        <div class="grid" :ref="(el) => (keyframeRefs[i] = el)">
                            <Input
                                class="sticky z-[100] bg-transparent top-0 text-2xl w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight border-transparent p-0 m-0 shadow-none focus:border-transparent focus:shadow-none border-none"
                                :model-value="
                                    animation.templateFrames[i].start.toString()
                                "
                                @update:model-value="
                                    (val) => {
                                        animation.templateFrames[i].start =
                                            parseCSSValueUnit(String(val));
                                        updateAllStringsAndAnimation();
                                    }
                                "
                            >
                            </Input>

                            <div class="relative">
                                <div
                                    class="absolute top-2 right-4 grid gap-1 items-end justify-end justify-items-end"
                                >
                                    <X
                                        @click="(e) => removeKeyframe(e, i)"
                                        class="p-0 m-0 hover:scale-105 cursor-pointer stroke-2 w-8 h-8 text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent"
                                    >
                                    </X>
                                    <CopyButton
                                        class="cursor-pointer text-foreground relative bg-transparent hover:bg-transparent hover:scale-105"
                                        :text="s"
                                    />
                                    <div
                                        class="italic opacity-25 z-0 pointer-events-none grid gap-1"
                                    >
                                        <Label
                                            class="text-sm font-light leading-none fira-code"
                                            >f {{ i }}</Label
                                        >
                                        <Label
                                            class="text-sm font-light leading-none fira-code"
                                            >s
                                            {{
                                                animation.templateFrames[i].start
                                            }}</Label
                                        >
                                    </div>
                                </div>
                                <pre
                                    @input="
                                        (e) => {
                                            const value = (e.target as HTMLElement)
                                                .innerText;

                                            updateAnimationFromKeyframeString(value, i);
                                            animateProgressBar(progressBarKeyframesEl);
                                        }
                                    "
                                    @keydown="onKeyDown"
                                    class="hljs css p-2 min-h-32 cursor-text rounded-md text-sm bg-transparent outline-none border-none z-100"
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

        <div class="grid gap-4 sticky bottom-0 bg-background rounded-md p-2 pt-4">
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
                            v-model:open="storedControls.keyframeControls.dialogOpen"
                            @update:open="
                                (value) => {
                                    storedControls.keyframeControls.dialogOpen = value;
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
                                    <DialogDescription class="fraunces">
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

                                                storedControls.keyframeControls.addKeyframes =
                                                    value;
                                                addKeyframesString = value;
                                            }
                                        "
                                        class="hljs css min-h-[25vh] p-2 cursor-text rounded-md text-sm bg-transparent outline-none border-none z-100"
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
                                                    progressBarAddKeyframesEl,
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

            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom mt-2"
            ></div>
        </div>
    </Tabs>
</template>
<script setup lang="ts">
import { Animation, AnimationGroup, CSSKeyframesAnimation } from "@src/animation";
import {
    CSSKeyframeToString,
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSS,
    formatCSSKeyframeString,
    normalizeCSSKeyframeString,
    parseCSSAnimationOrKeyframes,
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

import { computed, onMounted, ref, watch } from "vue";

import CopyButton from "@components/custom/CopyButton.vue";

import { Toggle } from "@components/ui/toggle";

import { FileIcon, FilePlus2, Minus, Paintbrush, Plus, X } from "lucide-vue-next";

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

import { parseCSSValueUnit } from "@src/parsing/units";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";

import { toast } from "vue-sonner";

import { Label } from "@components/ui/label";

import { useMagicKeys } from "@vueuse/core";
import { convertToCh } from "@src/units";
import { all } from "parsimmon";

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

const animationUUID = createAnimationUUId(animation, animation.superKey);
const keyframesStyleId = `keyframes-style-${animationUUID}`;

const defaultKeyframeControls = {
    selectedKeyframesControl: "keyframes",
    dialogOpen: false,
    keyframes: "",
    addKeyframes: "",
};

const storedControls = getStoredAnimationGroupControlOptions(animation);

storedControls.keyframeControls ??= defaultKeyframeControls;

const cssKeyframesStringEl = $ref(null);
let cssKeyframesString = $ref("");

const addKeyframesEl = $ref(null);
let addKeyframesString = $ref(storedControls.keyframeControls.addKeyframes);

let templateFrameStrings = $ref<string[]>([]);

const keyframeRefs = $ref([]);

const tabsListEl = $ref(null);

const setHighlightingString = (el: HTMLElement, s: string) => {
    if (el) {
        el.setAttribute("highlighted", "");
        el.innerHTML = s;
    }
};

const getFormatWidth = (el?: HTMLElement) => {
    el ??= tabsListEl;

    if (el == null || el.offsetWidth == null) {
        return undefined;
    }

    return convertToCh(el.offsetWidth, "px", el);
};

const getTmpAnimationName = () => {
    return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
};

const updateCSSAnimationKeyframesStringFromAnimation = async (
    cssAnimationKeyframes?: string,
) => {
    const keyframesString =
        cssAnimationKeyframes ??
        (await CSSKeyframesToString(
            animation,
            getTmpAnimationName(),
            getFormatWidth(),
        ));

    cssKeyframesString = keyframesString;
    setHighlightingString(cssKeyframesStringEl, keyframesString);

    highlightCSS();

    emit("keyframesUpdate", {
        animation,
    });

    return keyframesString;
};

const keys = useMagicKeys({ reactive: true });

watch(
    () => {
        return (keys["Shift"] && keys["Alt"] && keys["F"]) || keys["Ï"];
    },
    (v) => {
        if (v && storedControls.keyframeControls.dialogOpen) {
            updateAddKeyframesString(addKeyframesString);
        }
    },
);

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

const updateAnimationFromKeyframesString = debounce((keyframesString: string) => {
    storedControls.keyframeControls.keyframes = keyframesString;

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
        toast.error("Could not update keyframes", {
            description: e.message,
            duration: 10000,
            action: {
                label: "Retry",
                onClick: () => {
                    updateAnimationFromKeyframesString(keyframesString);
                },
            },
        });
        console.error(e);
    }
}, 1000);

const updateAnimationFromKeyframeString = debounce(
    async (keyframeString: string, frameIx: number) => {
        const parseAndUpdate = async () => {
            const start = animation.templateFrames[frameIx].start;
            keyframeString = `${start} { ${keyframeString} }`;

            const { keyframes, options } = parseCSSAnimationOrKeyframes(keyframeString);
            const [_, newVars] = Object.entries(keyframes)[0];

            Object.assign(animation.options, options ?? animation.options);
            Object.assign(animation.templateFrames[frameIx].vars, newVars);

            animation.parse();

            updateAllStringsAndAnimation();
        };

        try {
            await parseAndUpdate();
        } catch (e) {
            toast.error("Could not update keyframe", {
                description: e.message,
                duration: 10000,
                action: {
                    label: "Retry",
                    onClick: () => {
                        updateAnimationFromKeyframeString(keyframeString, frameIx);
                    },
                },
            });

            console.error(e);
        }
    },
    1000,
);

const updateAddKeyframesString = (keyframesString: string) => {
    formatCSS(keyframesString, getFormatWidth()).then((formatted) => {
        const sel = window.getSelection();

        storedControls.keyframeControls.addKeyframes = formatted;
        addKeyframesString = formatted;

        setHighlightingString(addKeyframesEl, addKeyframesString);

        highlightCSS();

        if (sel) {
            sel.collapseToEnd();
        }
    });
};

const addKeyframesStringToAnimation = (keyframesString: string) => {
    addKeyframesString = keyframesString;
    storedControls.keyframeControls.addKeyframes = keyframesString;

    const parseAndUpdate = () => {
        const { options, values, keyframes } =
            parseCSSAnimationOrKeyframes(keyframesString);

        const tmpAnimation = new Animation(
            options ?? animation.options,
            animation.target,
        );

        animation.templateFrames.forEach((f) => {
            tmpAnimation.frame(f.start, f.vars, f.transform, f.timingFunction);
        });
        Object.entries(keyframes).forEach(([start, vars]) => {
            tmpAnimation.frame(parseFloat(start), vars);
        });

        tmpAnimation.parse();

        Object.assign(animation.options, tmpAnimation.options);
        Object.assign(animation.templateFrames, tmpAnimation.templateFrames);

        animation.parse();

        updateAllStrings();

        storedControls.keyframeControls.dialogOpen = false;

        addKeyframesString = "";
        storedControls.keyframeControls.addKeyframes = "";
    };

    try {
        parseAndUpdate();
    } catch (e) {
        toast.error("Could not add keyframes", {
            description: e.message,
            duration: 10000,
            action: {
                label: "Retry",
                onClick: () => {
                    addKeyframesStringToAnimation(keyframesString);
                },
            },
        });

        console.error(e);
    }
};

const removeKeyframe = (e: Event, frameIx: number) => {
    if (animation.templateFrames.length <= 1) {
        return;
    }

    let el = keyframeRefs[frameIx];

    const anim1 = new CSSKeyframesAnimation(
        {
            duration: 700,
            timingFunction: "bounce-in-ease",
        },
        el,
    ).fromCSSKeyframes(
        /*css*/
        `@keyframes keyframeDelete {
                0% {
                    transform: translateX(0%) rotate(0deg);
                    opacity: 1;
                }
                25% {
                    transform: translateX(0%) rotate(5deg);
                    opacity: 1;
                }
                50% {
                    transform: translateX(25%) rotate(10deg);
                    opacity: 0.5;
                }
                100% {
                    transform: translateX(-100%);
                    opacity: 0;
                }
            }`,
    );

    let anim2 = null;
    if (keyframeRefs.length > 1) {
        const el2 =
            frameIx < keyframeRefs.length - 1
                ? keyframeRefs[frameIx + 1]
                : keyframeRefs[frameIx - 1];

        anim2 = new CSSKeyframesAnimation(
            {
                duration: 700,
                timingFunction: "bounce-in-ease",
            },
            el2,
        ).fromCSSKeyframes(
            /*css*/
            `@keyframes keyframeShift {
                    0% {
                        transform: translateY(0%);
                        opacity: 1;
                    }

                    50% {
                        transform: translateY(-50%);
                        opacity: 0.75;
                    }

                    100% {
                        transform: translateY(-107%);
                        opacity: 1;
                    }
                }`,
        );
    }

    const group = new AnimationGroup(anim1.animation, anim2?.animation);
    group.singleTarget = false;

    group.play();

    setTimeout(() => {
        const tmpAnimation = new Animation(animation.options, animation.target);

        animation.templateFrames.forEach((f, i) => {
            if (i !== frameIx) {
                tmpAnimation.frame(f.start, f.vars, f.transform, f.timingFunction);
            }
        });

        tmpAnimation.parse();

        Object.assign(animation.options, tmpAnimation.options);
        Object.assign(animation.templateFrames, tmpAnimation.templateFrames);

        animation.parse();

        updateAllStrings();
    }, 700);
};

const progressBarKeyframesEl = $ref(null);
const progressBarAddKeyframesEl = $ref(null);

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

const highlightCSS = (el?: HTMLElement) => {
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

    const highlight = (e: HTMLElement) => {
        if (!e || e.getAttribute("highlighted")) {
            return;
        }

        const s = e.innerText;
        const h = hljs.highlight(s, { language: "css" });
        e.innerHTML = h.value;

        e.setAttribute("highlighted", "true");
    };

    highlight(el);
    highlight(cssKeyframesStringEl);

    const pres = document.querySelectorAll("pre");
    pres.forEach(highlight);
};

const updateAllStrings = async () => {
    templateFrameStrings = [];

    templateFrameStrings = await CSSKeyframesToStrings(animation);

    const keyframesString = await updateCSSAnimationKeyframesStringFromAnimation();

    return keyframesString;
};

const updateAllStringsAndAnimation = async () => {
    const reversedKeyframesString = await updateAllStrings();
    updateAnimationFromKeyframesString(reversedKeyframesString);
};

watch(
    () => storedControls.keyframeControls.selectedKeyframesControl,
    () => {
        updateAllStrings();
    },
);

watch(animation.templateFrames, async () => {
    updateAllStrings();
});

watch(
    () => addKeyframesEl,
    () => {
        if (!addKeyframesEl) {
            return;
        }
        highlightCSS(addKeyframesEl);
    },
);

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
