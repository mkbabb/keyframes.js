<template>
    <div class="animation-controls">
        <select v-show="isSmallScreen" v-model="selectedItem">
            <option value="controls">Controls</option>
            <option value="keyframes">Keyframes</option>
        </select>

        <div class="items">
            <div
                class="controls"
                v-show="!isSmallScreen || selectedItem === 'controls'"
            >
                <div class="options">
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
                                animation.updateDelay(
                                    (e.target as HTMLInputElement).value,
                                )
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
                        <option
                            v-for="timingFunction in Object.keys(timingFunctionsAnd)"
                        >
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
                                    (e) => {
                                        cubicBezierValues = JSON.parse(
                                            JSON.stringify(
                                                bezierPresets[
                                                    (e.target as HTMLInputElement).value
                                                ],
                                            ),
                                        );
                                        updateTimingFunction();
                                    }
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
                                viewBox="-0.125 -1.125 1.25 1.25"
                                xmlns="http://www.w3.org/2000/svg"
                            ></svg>

                            <label class="preset-label" @click="copyToClipboard"
                                >{{ cubicBezierPreset }}
                                <div ref="copyTextEl" class="info">Copied!</div>
                                <font-awesome-icon :icon="['fas', 'clipboard']"
                            /></label>

                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[0]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[1]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[2]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[3]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />
                        </div>
                    </template>
                </div>
                <input
                    class="slider"
                    type="range"
                    :min="0"
                    :max="animation.options.duration"
                    @input="sliderUpdate"
                    :disabled="animation.playing()"
                    v-model.number="animation.t"
                />
                <div class="timing">
                    <button class="toggle" @click="toggle">
                        <font-awesome-icon
                            class="icon"
                            :icon="
                                animation.playing() ? ['fas', 'pause'] : ['fas', 'play']
                            "
                        />
                    </button>
                    <button class="reverse" @click="animation.reverse()">
                        <font-awesome-icon
                            class="icon"
                            :icon="['fas', 'rotate-right']"
                        />
                    </button>
                </div>
            </div>

            <div
                class="keyframes"
                v-show="!isSmallScreen || selectedItem === 'keyframes'"
            >
                <div class="control-bar">
                    <button class="clipboard" @click="copyToClipboard">
                        <div ref="copyTextEl" class="info">Copied!</div>
                        <font-awesome-icon :icon="['fas', 'clipboard']" />
                    </button>

                    <button class="css-apply" @click="cssApply">
                        <font-awesome-icon
                            class="icon"
                            :icon="[
                                'fas',
                                !cssApplied ? 'paint-roller' : 'rotate-right',
                            ]"
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
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import { Animation, CSSKeyframesAnimation } from "../../src/animation";
import { CSSKeyframesToString } from "../../src/parsing/format";
import { timingFunctions, jumpTerms, CSSBezier, bezierPresets } from "../../src/easing";
import {
    reverseCSSTime,
    parseCSSTime,
    CSSClass,
    CSSAnimationKeyframes,
} from "../../src/parsing/keyframes";
import { formatNumber } from "./utils";

import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import css from "highlight.js/lib/languages/css";
import { debounce } from "../../src/utils";
import { svgCubicBezier } from "../../src/math";
import { number } from "../../src/parsing/units";

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

const updateTimingFunction = () => {
    let timingFunction = timingFunctions[timingFunctionKey];
    if (timingFunctionKey === "steps") {
        timingFunction = timingFunctions[timingFunctionKey](steps, jumpTerm);
    } else if (timingFunctionKey === "cubicBezier") {
        timingFunction = CSSBezier(
            ...(cubicBezierValues as [number, number, number, number]),
        );
        cubicBezierPreset = `cubic-bezier(${cubicBezierValues
            .map((v) => v.toFixed(2))
            .join(",")})`;

        const path = svgCubicBezier(
            cubicBezierValues[0],
            cubicBezierValues[1],
            cubicBezierValues[2],
            cubicBezierValues[3],
        );

        svgCubicBezierEl.innerHTML = path;
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
const copyToClipboard = async () => {
    navigator.clipboard.writeText(await cssKeyframesString.value);
    fadeInOut(copyTextEl);
};

let style = $ref(null);
let prevPaused = $ref(false);
let cssApplied = $ref(false);

const cssApply = () => {
    if (cssApplied) {
        style.innerHTML = "";
        animation.paused = prevPaused;
        document.head.removeChild(style);
        animation.target.classList.remove("animation");
    } else {
        prevPaused = animation.paused;
        animation.paused = animation.started;

        style.innerHTML = cssKeyframesString.value;
        document.head.appendChild(style);
        animation.target.classList.add("animation");
    }
    cssApplied = !cssApplied;
};

onMounted(() => {
    style = document.createElement("style");
});
</script>

<style scoped lang="scss">
.animation-controls {
    display: grid;
    align-items: center;

    position: relative;
    z-index: 2;
}

.items {
    height: 100%;
    display: grid;
    gap: 1rem;
}

.toggle {
    white-space: pre;
}

input[type="range"] {
    --color: green;
    margin: 1rem 0;
}

.timing {
    display: grid;
    gap: 0.25rem;
    grid-auto-flow: column;
}

.options {
    display: grid;
    gap: 0.25rem 1rem;
    grid-template-columns: repeat(2, auto);
    align-items: center;
}

.cubic-bezier-controls {
    grid-column: span 2;
    display: grid;
    gap: 1rem 0.5rem;
    grid-template-columns: auto auto;
    align-items: center;

    label {
        overflow: hidden;
        white-space: pre;
        grid-column: span 2;
        max-width: 100%;
    }

    input {
        grid-column: span 2;
        margin: 0;

        background: linear-gradient(
            to right,
            #f00 0%,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            #f00 100%
        ) !important;
    }

    svg::v-deep {
        width: 200px;
        aspect-ratio: 1 / 1;
        --stroke-width: 0.07;

        g {
            circle {
                r: calc(var(--stroke-width) / 2);
                stroke: black;
                stroke-width: 0;
            }
            path {
                stroke: rgb(93, 246, 220);
                stroke-width: var(--stroke-width);
                fill: none;
            }
        }
    }
}

@keyframes shake {
    8%,
    41% {
        transform: translateX(-10px);
    }
    25%,
    58% {
        transform: translateX(10px);
    }
    75% {
        transform: translateX(-5px);
    }
    92% {
        transform: translateX(5px);
    }
    0%,
    100% {
        transform: translateX(0);
    }
}

.keyframes {
    position: relative;
    display: flex;

    height: 75%;
    flex-direction: column;
    gap: 0.5rem;
}

pre {
    font-size: 0.8rem;
    padding: 1rem;
    margin: 0;
    border-radius: 5px;
    overflow: scroll;
    max-height: 300px;

    &.error {
        animation: shake 700ms linear;
        border: 1px solid red;
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

.control-bar {
    --offset: 1.5rem;
    font-size: var(--offset);
    position: absolute;
    top: var(--offset);
    right: var(--offset);
    cursor: pointer;
    color: white;
    background-color: transparent;
    display: flex;
    gap: 1rem;

    * {
        font-size: 1rem;
    }
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
