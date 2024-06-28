<template>
    <div class="">
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger
                    >File
                    <Icon
                        icon="radix-icons:moon"
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                /></MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>New Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Share</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Print</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <DarkmodeToggle></DarkmodeToggle>
            </MenubarMenu>
        </Menubar>

        <select v-show="isSmallScreen" v-model="selectedItem">
            <option value="controls">Controls</option>
            <option value="keyframes">Keyframes</option>
        </select>

        <div
            class="grid grid-cols-2"
            v-show="!isSmallScreen || selectedItem === 'controls'"
        >
            <div class="">
                <label>Duration</label>
                <input
                    type="string"
                    :value="reverseCSSTime(animation.options.duration)"
                    @change="
                        (e) =>
                            animation.updateDuration(
                                (e.target as HTMLInputElement).value,
                            )
                    "
                />

                <label>Delay</label>
                <input
                    type="string"
                    :value="reverseCSSTime(animation.options.delay)"
                    @change="
                        (e) =>
                            animation.updateDelay((e.target as HTMLInputElement).value)
                    "
                />

                <label>Iteration Count</label>
                <input
                    type="string"
                    @change="
                        (e) =>
                            animation.updateIterationCount(
                                (e.target as HTMLInputElement).value,
                            )
                    "
                    :value="
                        isFinite(animation.options.iterationCount)
                            ? animation.options.iterationCount
                            : 'infinite'
                    "
                />

                <label>Direction</label>
                <select v-model="animation.options.direction">
                    <option value="normal">Normal</option>
                    <option value="reverse">Reverse</option>
                    <option value="alternate">Alternate</option>
                    <option value="alternate-reverse">Alternate Reverse</option>
                </select>

                <label>Fill Mode</label>
                <select v-model="animation.options.fillMode">
                    <option value="none">None</option>
                    <option value="forwards">Forwards</option>
                    <option value="backwards">Backwards</option>
                    <option value="both">Both</option>
                </select>

                <label>Timing Function</label>
                <select @change="updateTimingFunction" v-model="timingFunctionKey">
                    <option v-for="timingFunction in Object.keys(timingFunctionsAnd)">
                        {{ timingFunction }}
                    </option>
                </select>

                <template v-if="timingFunctionKey === 'steps'">
                    <label>Steps</label>
                    <input
                        @input="updateTimingFunction"
                        type="number"
                        v-model.number="steps"
                    />

                    <label>Jump Term</label>
                    <select @input="updateTimingFunction" v-model="jumpTerm">
                        <option v-for="j in jumpTerms">
                            {{ j }}
                        </option>
                    </select>
                </template>

                <template v-if="timingFunctionKey === 'cubicBezier'">
                    <div class="cubic-bezier-controls">
                        <select
                            @input="updateTimingFunction"
                            @change="
                                (e) =>
                                    updateCubicBezierPreset(
                                        (e.target as HTMLSelectElement).value,
                                    )
                            "
                        >
                            <option
                                v-for="(preset, presetName) in bezierPresets"
                                :value="presetName"
                            >
                                {{ presetName }}
                            </option>
                        </select>

                        <svg
                            ref="svgCubicBezierEl"
                            viewBox="0 -1.5 1 2"
                            xmlns="http://www.w3.org/2000/svg"
                            @mousedown="startCubicBezierDragging"
                            @mousemove="cubicBezierDrag"
                            @mouseup="stopCubicBezierDragging"
                            @mouseleave="stopCubicBezierDragging"
                        >
                            <g ref="cubicBezierPathEl"></g>
                            <circle
                                v-for="(point, index) in controlPoints"
                                :key="index"
                                :cx="point.x"
                                :cy="point.y"
                                :data-index="index"
                                @mouseover="
                                    (e) => {
                                        (e.target as HTMLElement).style.setProperty(
                                            '--stroke-width',
                                            '0.15',
                                        );
                                    }
                                "
                                @mouseleave="
                                    (e) => {
                                        (e.target as HTMLElement).style.setProperty(
                                            '--stroke-width',
                                            '0.1',
                                        );
                                    }
                                "
                            />
                        </svg>

                        <label
                            class="preset-label"
                            @click="() => copyToClipboard(cubicBezierPreset)"
                            >{{ cubicBezierPreset }}
                        </label>
                    </div>
                </template>
            </div>
            <Slider
                type="range"
                :min="0"
                :max="animation.options.duration"
                :step="0.01"
                @input="sliderUpdate"
                :modelValue="[animation.t]"
            />
            <div class="">
                <Button variant="default" class="toggle" @click="toggle">
                    <font-awesome-icon
                        class="icon"
                        :icon="animation.playing() ? ['fas', 'pause'] : ['fas', 'play']"
                    />
                </Button>
                <Button class="reverse" @click="animation.reverse()">
                    <font-awesome-icon class="icon" :icon="['fas', 'rotate-right']" />
                </Button>
            </div>
        </div>

        <div class="keyframes" v-show="!isSmallScreen || selectedItem === 'keyframes'">
            <div class="control-bar">
                <button
                    class="clipboard"
                    @click="async () => copyToClipboard(await cssKeyframesString)"
                >
                    <div ref="copyTextEl" class="info">Copied!</div>
                    <font-awesome-icon :icon="['fas', 'clipboard']" />
                </button>

                <button class="css-apply" @click="cssApply">
                    <font-awesome-icon
                        class="icon"
                        :icon="['fas', !cssApplied ? 'paint-roller' : 'rotate-right']"
                    />
                </button>
            </div>

            <pre
                @input="animateParseCSSKeyframesStringEl"
                @keydown="onKeyDown"
                ref="CSSKeyframesStringEl"
                class="hljs css"
                contenteditable="true"
            ><code>{{ cssKeyframesString }}</code></pre>

            <div ref="progressBarEl" class="progress-bar"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import { Animation, CSSKeyframesAnimation } from "@src/animation";
import { CSSKeyframesToString } from "@src/parsing/format";
import { timingFunctions, jumpTerms, CSSBezier, bezierPresets } from "@src/easing";
import { reverseCSSTime, CSSAnimationKeyframes } from "@src/parsing/keyframes";

import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import css from "highlight.js/lib/languages/css";
import { debounce } from "@src/utils";
import { svgCubicBezier } from "@src/math";

import { Icon } from "@iconify/vue";

import { Slider } from "@components/ui/slider";
import { Button } from "@components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@components/ui/menubar";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import DarkmodeToggle from "@components/custom/DarkmodeToggle.vue";

hljs.registerLanguage("css", css);

let windowHeight = $ref(window.innerHeight);
const isSmallScreen = computed(() => windowHeight < 700 && window.innerWidth < 700);

window.addEventListener("resize", () => {
    windowHeight = window.innerHeight;
});

let timingFunctionsAnd = {
    cubicBezier: "cubicBezier",
    ...timingFunctions,
};

const { animation: tmpAnimation, isGrouped } = defineProps({
    isGrouped: {
        type: Boolean,
        required: false,
        default: false,
    },
    animation: {
        type: Animation,
        required: true,
    },
});

const animation = $ref(tmpAnimation);

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

let selectedItem = $ref("controls");

const sliderUpdate = (e: Event) => {
    const t = parseFloat((e.target as HTMLInputElement).value);

    if (!isGrouped) {
        const paused = animation.paused;
        animation.paused = false;
        animation.transformFrames(t);
        animation.paused = paused;
    } else {
        emit("sliderUpdate", {
            t,
            animationId: animation.id,
        });
    }
};

const setTimingFunction = (timingFunction) => {
    animation.options.timingFunction = timingFunction;
    animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
};

let timingFunctionKey = $ref("linear");

let jumpTerm = $ref("jump-none");
let steps = $ref(10);

let cubicBezierPreset = $ref("ease");
let cubicBezierValues = $ref(
    bezierPresets[cubicBezierPreset] as [number, number, number, number],
);
const svgCubicBezierEl = $ref(null);
const cubicBezierPathEl = $ref(null);

let isDragging = $ref(false);
let currentPointIndex = $ref(null);
let controlPoints = $ref([
    { x: 0.01, y: 0 },
    { x: cubicBezierValues[0], y: cubicBezierValues[1] },
    { x: cubicBezierValues[2], y: cubicBezierValues[3] },
    { x: 0.97, y: 1 },
]);

const bezierPath = computed(() => {
    const scaledValues = cubicBezierValues.map((v) => {
        return v;
    });

    return svgCubicBezier(...(scaledValues as [number, number, number, number]));
});

const startCubicBezierDragging = (event: MouseEvent) => {
    const target = (event.target as SVGElement).closest("circle");

    if (target) {
        isDragging = true;
        currentPointIndex = parseInt(target.getAttribute("data-index"));
    }
};

const stopCubicBezierDragging = () => {
    isDragging = false;
    currentPointIndex = null;
};

let scaleCubicBezierValues = $ref(false);

const cubicBezierDrag = (event: MouseEvent) => {
    if (isDragging && currentPointIndex !== null) {
        // if the current point is a boundary, exit:
        if (currentPointIndex === 0 || currentPointIndex === 3) {
            return;
        }

        const svgRect = cubicBezierPathEl.getBoundingClientRect();

        const { width, height, left, top } = svgRect;

        const x = (event.clientX - left) / width;
        const y = 1 - (event.clientY - top) / height;

        // Update the control point position
        controlPoints[currentPointIndex] = {
            x,
            y,
        };

        // Update cubicBezierValues
        cubicBezierValues = [
            controlPoints[1].x,
            controlPoints[1].y,
            controlPoints[2].x,
            controlPoints[2].y,
        ];

        scaleCubicBezierValues = true;
        updateTimingFunction();
    }
};

const updateCubicBezierPreset = (preset: string) => {
    cubicBezierPreset = preset;
    cubicBezierValues = JSON.parse(JSON.stringify(bezierPresets[preset]));

    // update the control points
    controlPoints[1] = { x: cubicBezierValues[0], y: cubicBezierValues[1] };
    controlPoints[2] = { x: cubicBezierValues[2], y: cubicBezierValues[3] };

    scaleCubicBezierValues = true;
    updateTimingFunction();
};

const updateTimingFunction = () => {
    let timingFunction = timingFunctions[timingFunctionKey];

    if (timingFunctionKey === "steps") {
        timingFunction = timingFunctions[timingFunctionKey](steps, jumpTerm);
    } else if (timingFunctionKey === "cubicBezier") {
        const scaledValues = cubicBezierValues.map((v) => {
            return v;
        });

        timingFunction = CSSBezier(
            ...(scaledValues as [number, number, number, number]),
        );
        cubicBezierPreset = `cubic-bezier(${cubicBezierValues
            .map((v) => v.toFixed(2))
            .join(",")})`;

        cubicBezierPathEl.innerHTML = bezierPath.value;
    }

    setTimingFunction(timingFunction);
};

let prevT = $ref(0);

const toggle = () => {
    if (!animation.started && !isGrouped) {
        animation.play();
    } else {
        animation.pause(!isGrouped);

        if (animation.paused) {
            prevT = animation.t;
        } else {
            animation.pausedTime += animation.t - prevT;
            prevT = 0;
        }
    }
};

let CSSKeyframesStringEl = $ref(null);

const updateCSSKeyframesString = async (keyframes?: string) => {
    const s = keyframes ?? (await CSSKeyframesToString(animation, "animation", 45));

    if (CSSKeyframesStringEl) {
        const h = hljs.highlight(s, { language: "css" });
        CSSKeyframesStringEl.innerHTML = h.value;
    }
    if (style) {
        style.innerHTML = s;
    }

    return s;
};

const cssKeyframesString = computed(async () => {
    return await updateCSSKeyframesString();
});

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

const fadeInOut = (el) => {
    new CSSKeyframesAnimation(
        {
            duration: 300,
            direction: "alternate",
            iterationCount: 2,
            timingFunction: "bounceInEase",
        },
        el,
    )
        .fromVars([
            {
                opacity: 0,
            },
            {
                opacity: 1,
            },
        ])
        .play();
};

let copyTextEl = $ref(null);

const copyToClipboard = async (value: string) => {
    navigator.clipboard.writeText(value);
    fadeInOut(copyTextEl);
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

        style.innerHTML = await cssKeyframesString.value;
        document.head.appendChild(style);
        animation.target.classList.add("animation");
    }
    cssApplied = !cssApplied;
};

onMounted(() => {
    style = document.createElement("style");
});

// export the component
</script>

<style scoped lang="scss">
.cubic-bezier-controls {
    svg::v-deep {
        width: 100%;

        aspect-ratio: 1 / 1;
        --stroke-width: 0.1;
        --circle-color: rgb(226, 61, 61);
        --path-color: rgb(137, 20, 239);

        circle {
            r: calc(var(--stroke-width) / 2);
            stroke: var(--circle-color);
            fill: var(--circle-color);
            stroke-width: 0;

            cursor: move;
        }

        circle:nth-child(5),
        circle:nth-child(2) {
            --circle-color: var(--path-color);
            cursor: not-allowed;
        }

        g {
            path {
                stroke: rgb(137, 20, 239);
                stroke-width: var(--stroke-width);
                fill: none;
            }
        }

        > * {
            --scale: 1;
            transform: scale(var(--scale), calc(-1 * var(--scale)));
        }
    }
}

.info {
    position: absolute;
    transform: translate(-50%, 125%);

    width: fit-content;
    font-size: 1rem;
    color: white;
    background-color: black;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    opacity: 0;
    pointer-events: none;
}

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
