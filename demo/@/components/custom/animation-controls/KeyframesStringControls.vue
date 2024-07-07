<template>
    <Card class="p-0 m-0">
        <CardContent class="relative m-0 p-0 grid grid-cols-1">
            <div
                @keydown="onKeyDown"
                ref="cssKeyframesStringEl"
                class="h-[75vh] w-full overflow-scroll rounded-sm"
            ></div>
        </CardContent>
    </Card>

    <div class="grid gap-4 sticky bottom-0 rounded-md">
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
                                <CardTitle class="text-3xl">Add keyframes</CardTitle>
                                <DialogDescription class="fraunces">
                                    Add keyframes to the animation
                                </DialogDescription>
                            </DialogTitle>
                            <div>
                                <pre
                                    ref="addKeyframesEl"
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
                                        }
                                    "
                                    >Add Keyframes<FileIcon></FileIcon
                                ></Button>
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
                        ref="brushEl"
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
    </div>
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

import {
    FileIcon,
    FilePlus2,
    Minus,
    Paintbrush,
    Plus,
    X,
    Pencil,
} from "lucide-vue-next";

import DarkTheme from "monaco-themes/themes/Dracula.json";
import LightTheme from "monaco-themes/themes/Github.json";

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
import * as animations from "@src/animations";

import * as monaco from "monaco-editor";

monaco.editor.defineTheme("dark-theme", DarkTheme as any);
monaco.editor.defineTheme("light-theme", LightTheme as any);

monaco.languages.register({ id: "css" });

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

const keyframeRefs = $ref([]);

const tabsListEl = $ref(null);

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

const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    cssKeyframesString = await CSSKeyframesToString(
        animation,
        getTmpAnimationName(),
        getFormatWidth(),
    );

    return cssKeyframesString;
};

const formatCSSKeyframesString = async (
    editor: monaco.editor.IStandaloneCodeEditor,
) => {
    const keyframesString = await formatCSS(editor.getValue(), getFormatWidth());

    const cursorPosition = editor.getPosition();

    editor.setValue(keyframesString);

    editor.setPosition(cursorPosition);

    toast.success("Keyframes formatted");

    return keyframesString;
};

function onKeyDown(e: KeyboardEvent) {
    const { target, key } = e;

    console.log(key);

    if (key === "Ï") {
        e.preventDefault();
        formatCSSKeyframesString(cssKeyframesStringEditor);
        return;
    }
}

const updateAnimationFromKeyframesString = debounce(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
        // get the text content of the el using the monaco editor
        const keyframesString = editor.getValue();

        const parseAndUpdate = () => {
            const { options, values, keyframes } =
                parseCSSAnimationKeyframes(keyframesString);

            const tmpAnimation = new CSSKeyframesAnimation(
                options,
                ...animation.targets,
            ).fromCSSKeyframes(keyframes).animation;

            animation.options = tmpAnimation.options;
            animation.templateFrames = tmpAnimation.templateFrames;

            animation.parse();

            emit("keyframesUpdate", {
                animation,
            });

            storedControls.keyframeControls.keyframes = keyframesString;

            toast.success("Keyframes parsed 🎉");
        };

        try {
            parseAndUpdate();
        } catch (e) {
            parseErrorShake.play();

            toast.error("Failed to parse keyframes 🔧", {
                description: e.message,
                duration: 10000,
                action: {
                    label: "Retry",
                    onClick: () => {
                        updateAnimationFromKeyframesString(editor);
                    },
                },
            });

            console.error(e);
        }
    },
    200,
    true,
);

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
        storedControls.keyframeControls.addKeyframes = formatted;
        addKeyframesString = formatted;
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
            animation.targets,
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

const removeKeyframe = async (e: Event, frameIx: number) => {
    if (animation.templateFrames.length <= 1) {
        toast.error("Cannot remove last keyframe");
        return;
    }

    const el1 = keyframeRefs[frameIx];
    const el2 =
        frameIx < keyframeRefs.length - 1
            ? keyframeRefs[frameIx + 1]
            : keyframeRefs[frameIx - 1];

    await animations
        .warpLeft()
        .setTargets(el1)
        .group(animations.jumpUp().setTargets(el2))
        .play();

    const tmpAnimation = new Animation(animation.options, animation.targets);

    animation.templateFrames.forEach((f, i) => {
        if (i !== frameIx) {
            tmpAnimation.frame(f.start, f.vars, f.transform, f.timingFunction);
        }
    });

    tmpAnimation.parse();

    animation.updateFrom(tmpAnimation);
};

let keyframesStyle = $ref(null);

let prevPaused = $ref(false);

const applyCSSStyles = () => {
    const wasApplied =
        keyframesStyle && keyframesStyle.innerHTML.includes(cssKeyframesString);

    if (wasApplied) {
        animation.paused = prevPaused;
        keyframesStyle.innerHTML = "";

        animation.targets.forEach((t) => t.classList.remove(keyframesStyleId));

        brushAnimation.pause();
    } else {
        prevPaused = animation.paused;
        animation.paused = animation.started;

        keyframesStyle.innerHTML = cssKeyframesString;

        animation.targets.forEach((t) => t.classList.add(keyframesStyleId));

        brushAnimation.play();
    }
};

const brushEl = $ref<HTMLElement>(null);

const brushAnimation = new CSSKeyframesAnimation({
    duration: 700,
    timingFunction: "linear",
    iterationCount: "infinite",
    direction: "alternate",
}).fromCSSKeyframes(
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

const isDark = useDark({ disableTransition: false });
const setCodeTheme = () => {
    monaco.editor.setTheme(isDark.value ? "dark-theme" : "light-theme");
};
watch(isDark, () => {
    setCodeTheme();
});

const createKeyframesStyleEl = (el?: HTMLElement) => {
    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (!existingKeyframesStyle) {
        keyframesStyle = document.createElement("style");
        keyframesStyle.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle);
    } else {
        keyframesStyle = existingKeyframesStyle;
    }
};

let cssKeyframesStringEditor: monaco.editor.IStandaloneCodeEditor;

const parseErrorShake = animations.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl);

    createKeyframesStyleEl();

    await updateCSSAnimationKeyframesStringFromAnimation();

    cssKeyframesStringEditor = monaco.editor.create(cssKeyframesStringEl, {
        value: cssKeyframesString,
        language: "css",
        fontLigatures: true,
        theme: isDark.value ? "dark-theme" : "light-theme",
        fontSize: 14,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
    });

    cssKeyframesStringEditor.onDidChangeModelContent(() => {
        updateAnimationFromKeyframesString(cssKeyframesStringEditor);
    });

    parseErrorShake.setTargets(cssKeyframesStringEl);
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
