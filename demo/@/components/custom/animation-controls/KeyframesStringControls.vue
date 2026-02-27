<template>
    <div class="flex flex-col h-full min-h-0 min-w-0">
    <Card class="p-0 m-0 flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardContent class="relative m-0 p-0 grid grid-cols-1 flex-1 min-h-0">
            <div
                @keydown="onKeyDown"
                ref="cssKeyframesStringEl"
                class="h-full min-h-[350px] w-full rounded-lg"
            ></div>
        </CardContent>

        <div
            class="flex justify-evenly items-center gap-2 px-3 py-1.5"
            :style="{ backgroundColor: editorBgColor }"
        >
            <IconTooltip text="Format CSS">
                <WandSparkles
                    class="w-5 h-5 cursor-pointer hover:scale-105 hover:opacity-50"
                    @click="() => formatCSSKeyframesString(cssKeyframesStringEditor)"
                />
            </IconTooltip>

            <IconTooltip text="Add keyframes">
                <FilePlus2
                    class="w-5 h-5 cursor-pointer hover:scale-105 hover:opacity-50 stroke-2"
                    @click="storedControls.keyframeControls.dialogOpen = true"
                />
            </IconTooltip>

            <Dialog
                v-model:open="storedControls.keyframeControls.dialogOpen"
                @update:open="
                    (value) => {
                        storedControls.keyframeControls.dialogOpen = value;
                    }
                "
            >
                <DialogContent
                    @interact-outside="
                        (event) => {
                            const target = event.target as HTMLElement;
                            if (target?.closest('[data-sonner-toaster]'))
                                return event.preventDefault();
                        }
                    "
                >
                    <DialogTitle class="fira-code text-base font-medium">
                        Add keyframes
                    </DialogTitle>
                    <DialogDescription class="fira-code text-sm text-muted-foreground">
                        Paste CSS @keyframes to merge into the animation
                    </DialogDescription>
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
                        class="fira-code min-h-[20vh] p-3 cursor-text rounded-lg text-sm bg-muted/50 outline-none border border-border"
                        contenteditable="true"
                    ><code>{{ addKeyframesString }}</code></pre>
                    <DialogFooter>
                        <Button
                            class="cursor-pointer gap-2"
                            @click="
                                () => {
                                    addKeyframesStringToAnimation(
                                        addKeyframesString,
                                    );
                                }
                            "
                            >Add<FilePlus2 class="w-4 h-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <IconTooltip text="Copy to clipboard">
                <CopyButton
                    class="w-5 h-5 hover:scale-105"
                    :text="cssKeyframesString"
                />
            </IconTooltip>

            <IconTooltip text="Apply as CSS">
                <Paintbrush
                    ref="brushEl"
                    @click="() => { applyCSSStyles(); }"
                    :class="[
                        'w-5 h-5 cursor-pointer hover:scale-105 transition-colors',
                        cssApplied
                            ? 'paintbrush-rainbow'
                            : 'hover:opacity-50'
                    ]"
                />
            </IconTooltip>
        </div>
    </Card>
    </div>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation/index";

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

import { computed, onMounted, ref, useTemplateRef, watch } from "vue";

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
import LightTheme from "monaco-themes/themes/GitHub.json";

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

import * as animations from "@src/animation/animations";

import * as monaco from "monaco-editor";
import { convert2 } from "@src/units/utils";
import {
    CSSKeyframesToString,
    formatCSS,
    parseCSSAnimationOrKeyframes,
} from "@src/parsing/format";
import IconTooltip from "@components/custom/IconTooltip.vue";

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

const cssKeyframesStringEl = useTemplateRef<HTMLElement>("cssKeyframesStringEl");
const cssKeyframesString = ref("");
const isFormatting = ref(false);
const cssApplied = ref(false);

const addKeyframesEl = useTemplateRef<HTMLElement>("addKeyframesEl");
const addKeyframesString = ref(storedControls.keyframeControls.addKeyframes);

const keyframeRefs = ref<any[]>([]);

const tabsListEl = ref<HTMLElement | null>(null);

const getFormatWidth = (el?: HTMLElement) => {
    el ??= tabsListEl.value!;

    if (el == null || el.offsetWidth == null) {
        return undefined;
    }

    return convert2(el.offsetWidth, "px", "ch", el);
};

const getTmpAnimationName = () => {
    return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
};

const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    cssKeyframesString.value = await CSSKeyframesToString(
        animation,
        getTmpAnimationName(),
        getFormatWidth(),
    );

    return cssKeyframesString.value;
};

const formatCSSKeyframesString = async (
    editor: monaco.editor.IStandaloneCodeEditor,
) => {
    const keyframesString = await formatCSS(editor.getValue(), getFormatWidth());

    const cursorPosition = editor.getPosition();

    isFormatting.value = true;
    editor.setValue(keyframesString);
    editor.setPosition(cursorPosition!);
    setTimeout(() => { isFormatting.value = false; }, 300);

    toast.success("Keyframes formatted");

    return keyframesString;
};

function onKeyDown(e: KeyboardEvent) {
    const { target, key } = e;

    if (key === "Ï") {
        e.preventDefault();
        formatCSSKeyframesString(cssKeyframesStringEditor);
        return;
    }
}

const updateAnimationFromKeyframesString = debounce(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
        const keyframesString = editor.getValue();

        const parseAndUpdate = () => {
            const { options, values, keyframes } =
                parseCSSAnimationKeyframes(keyframesString);

            const tmpAnimation = new CSSKeyframesAnimation(
                options,
                ...animation.targets,
            ).fromKeyframes(keyframes);

            animation.options = tmpAnimation.options;
            animation.templateFrames = tmpAnimation.templateFrames;

            animation.parse();

            emit("keyframesUpdate", {
                animation,
            });

            storedControls.keyframeControls.keyframes = keyframesString;

            if (!isFormatting.value) {
                toast.success("Keyframes parsed 🎉");
            }
        };

        try {
            parseAndUpdate();
        } catch (e: unknown) {
            parseErrorShake.play();

            toast.error("Failed to parse keyframes 🔧", {
                description: (e as Error).message,
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
    false,
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
        } catch (e: unknown) {
            toast.error("Could not update keyframe", {
                description: (e as Error).message,
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
        addKeyframesString.value = formatted;
    });
};

const addKeyframesStringToAnimation = (keyframesString: string) => {
    if (!keyframesString.trim()) {
        storedControls.keyframeControls.dialogOpen = false;
        return;
    }

    addKeyframesString.value = keyframesString;
    storedControls.keyframeControls.addKeyframes = keyframesString;

    const parseAndUpdate = () => {
        const { options, values, keyframes } =
            parseCSSAnimationKeyframes(keyframesString);

        const tmpAnimation = new Animation(
            options ?? animation.options,
            animation.targets,
        );

        animation.templateFrames.forEach((f) => {
            tmpAnimation.addFrame(f.start, f.vars, f.transform, f.timingFunction);
        });
        Object.entries(keyframes).forEach(([start, vars]) => {
            tmpAnimation.addFrame(parseFloat(start), vars as Partial<any>);
        });

        tmpAnimation.parse();

        Object.assign(animation.options, tmpAnimation.options);
        Object.assign(animation.templateFrames, tmpAnimation.templateFrames);

        animation.parse();

        storedControls.keyframeControls.dialogOpen = false;

        addKeyframesString.value = "";
        storedControls.keyframeControls.addKeyframes = "";
    };

    try {
        parseAndUpdate();
    } catch (e: unknown) {
        toast.error("Could not add keyframes", {
            description: (e as Error).message,
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

    const tmpAnimation = new Animation(animation.options, animation.targets);

    animation.templateFrames.forEach((f, i) => {
        if (i !== frameIx) {
            tmpAnimation.addFrame(f.start, f.vars, f.transform, f.timingFunction);
        }
    });

    tmpAnimation.parse();

    // animation.updateFrom(tmpAnimation);
};

const keyframesStyle = ref<HTMLStyleElement | null>(null);

const prevPaused = ref(false);

const applyCSSStyles = () => {
    if (cssApplied.value) {
        animation.paused = prevPaused.value;
        keyframesStyle.value!.innerHTML = "";
        animation.targets.forEach((t) => t.classList.remove(getTmpAnimationName()));
        brushAnimation.pause();
        cssApplied.value = false;
    } else {
        prevPaused.value = animation.paused;
        animation.paused = animation.started;
        keyframesStyle.value!.innerHTML = cssKeyframesString.value;
        animation.targets.forEach((t) => t.classList.add(getTmpAnimationName()));
        brushAnimation.play();
        cssApplied.value = true;
    }
};

const brushEl = useTemplateRef<HTMLElement>("brushEl");

const brushAnimation = new CSSKeyframesAnimation({
    duration: 1200,
    timingFunction: "ease-in-out",
    iterationCount: "infinite",
    direction: "alternate",
}).fromString(
    /*css*/
    `@keyframes paintbrushStroke {
        0% { transform: translateX(0px) rotate(0deg); }
        30% { transform: translateX(2px) rotate(-8deg); }
        70% { transform: translateX(-2px) rotate(8deg); }
        100% { transform: translateX(0px) rotate(0deg); }
    }`,
);

const isDark = useDark({ disableTransition: false });

const editorBgColor = computed(() =>
    isDark.value
        ? (DarkTheme as any).colors?.["editor.background"] ?? "#282a36"
        : (LightTheme as any).colors?.["editor.background"] ?? "#fff",
);

const setCodeTheme = () => {
    monaco.editor.setTheme(isDark.value ? "dark-theme" : "light-theme");
};
watch(isDark, () => {
    setCodeTheme();
});

const createKeyframesStyleEl = (el?: HTMLElement) => {
    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (!existingKeyframesStyle) {
        keyframesStyle.value = document.createElement("style");
        keyframesStyle.value.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle.value);
    } else {
        keyframesStyle.value = existingKeyframesStyle as HTMLStyleElement;
    }
};

let cssKeyframesStringEditor: monaco.editor.IStandaloneCodeEditor;

const parseErrorShake = animations.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl.value!);

    createKeyframesStyleEl();

    await updateCSSAnimationKeyframesStringFromAnimation();

    cssKeyframesStringEditor = monaco.editor.create(cssKeyframesStringEl.value!, {
        value: cssKeyframesString.value,
        language: "css",
        fontLigatures: true,
        theme: isDark.value ? "dark-theme" : "light-theme",
        fontSize: 14,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: {
            top: 16,
            bottom: 16,
        },
    });

    cssKeyframesStringEditor.onDidChangeModelContent(() => {
        updateAnimationFromKeyframesString(cssKeyframesStringEditor);
    });

    parseErrorShake.setTargets(cssKeyframesStringEl.value!);
});
</script>

<style scoped>
.progress-bar {
    --height: 0.5rem;

    /* width: 100%; */

    height: var(--height);

    /* bottom: var(--offset); */
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
