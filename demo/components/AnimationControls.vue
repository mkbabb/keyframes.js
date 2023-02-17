<template>
    <div class="animation-controls">
        <select v-model="selectedItem">
            <option value="controls">Controls</option>
            <option value="keyframes">Keyframes</option>
        </select>

        <div class="items">
            <div v-show="selectedItem === 'controls'">
                <div class="options">
                    <label>Duration</label>
                    <input
                        type="string"
                        :value="reverseCSSTime(animation.options.duration)"
                        @change="(e) => animation.updateDuration(e.target.value)"
                    />

                    <label>Delay</label>
                    <input
                        type="string"
                        :value="reverseCSSTime(animation.options.delay)"
                        @change="
                            (e) =>
                                (animation.options.delay = parseCSSTime(e.target.value))
                        "
                    />

                    <label>Iteration Count</label>
                    <input
                        type="string"
                        @change="(e) => animation.updateIterationCount(e.target.value)"
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
                                                bezierPresets[e.target.value]
                                            )
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

                            <label>X1 {{ formatNumber(cubicBezierValues[0]) }} </label>
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[0]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />

                            <label>Y1 {{ formatNumber(cubicBezierValues[1]) }}</label>
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[1]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />

                            <label>X2 {{ formatNumber(cubicBezierValues[2]) }}</label>
                            <input
                                @input="updateTimingFunction"
                                v-model.number="cubicBezierValues[2]"
                                type="range"
                                :min="-2"
                                :max="2"
                                step="0.01"
                            />

                            <label>Y2 {{ formatNumber(cubicBezierValues[3]) }}</label>
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
                    :disabled="!animation.paused"
                    :max="animation.options.duration"
                    @input="sliderUpdate"
                    v-model.number="animation.t"
                />
                <div class="timing">
                    <button class="toggle" @click="toggle">
                        <font-awesome-icon
                            class="icon"
                            :icon="
                                animation.paused || !animation.started
                                    ? ['fas', 'play']
                                    : ['fas', 'pause']
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

            <div v-show="selectedItem === 'keyframes'">
                <div
                    class="css-keyframes-string"
                    v-if="style"
                    @input="animateParseCSSKeyframesStringEl"
                    @keydown="onKeyDown"
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
                        ref="CSSKeyframesStringEl"
                        class="hljs css"
                        contenteditable="true"
                    ><code>{{ cssKeyframesString }}</code></pre>
                    <div ref="progressBarEl" class="progress-bar"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import {
    Animation,
    CSSKeyframesToString,
    CSSKeyframesAnimation,
} from "../../src/animation";
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

hljs.registerLanguage("css", css);

let timingFunctionsAnd = {
    cubicBezier: "cubicBezier",
    ...timingFunctions,
};

const { animation, isGrouped } = defineProps({
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

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animationId: number;
        }
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

let cubicBezierValues = $ref(bezierPresets["ease"]);
const svgCubicBezierEl = $ref(null);

const updateTimingFunction = () => {
    let timingFunction = timingFunctions[timingFunctionKey];
    if (timingFunctionKey === "steps") {
        timingFunction = timingFunctions[timingFunctionKey](steps, jumpTerm);
    } else if (timingFunctionKey === "cubicBezier") {
        timingFunction = CSSBezier(...cubicBezierValues);
        const path = svgCubicBezier(
            cubicBezierValues[0],
            cubicBezierValues[1],
            cubicBezierValues[2],
            cubicBezierValues[3]
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

const updateCSSKeyframesString = (keyframes?: string) => {
    const s = keyframes ?? CSSKeyframesToString(animation, "animation", 45);

    if (CSSKeyframesStringEl) {
        const h = hljs.highlight(s, { language: "css" });
        CSSKeyframesStringEl.innerHTML = h.value;
    }
    if (style) {
        style.innerHTML = s;
    }

    return s;
};

const cssKeyframesString = computed(() => {
    return updateCSSKeyframesString();
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
    const s: string = event.target.innerText;
    console.log(event.key);

    const p = CSSAnimationKeyframes.Values.parse(s);

    if (!p.status) {
        CSSKeyframesStringEl.parentElement.classList.add("error");
    } else {
        CSSKeyframesStringEl.parentElement.classList.remove("error");

        const { options, values, keyframes } = p.value;

        const anim = new CSSKeyframesAnimation(options).fromCSSKeyframes(
            keyframes
        ).animation;

        for (const key of Object.keys(animation)) {
            if (anim[key]) {
                Object.assign(animation[key], anim[key]);
            }
        }

        updateCSSKeyframesString();
    }
}, 1000);

const progressBarEl = $ref(null);
const animateParseCSSKeyframesStringEl = (event: Event) => {
    parseCSSKeyframesStringEl(event);
    new CSSKeyframesAnimation(
        {
            duration: 1000,
        },
        progressBarEl
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
        el
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
const copyToClipboard = () => {
    navigator.clipboard.writeText(cssKeyframesString.value);
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

    gap: 1rem;
    position: relative;
    z-index: 2;
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
    gap: 0.25rem;
    grid-template-columns: 10rem auto;
    align-items: center;

    label {
        text-align: center;
        white-space: pre;
    }

    input {
        margin: 0;
        width: 100%;
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

.css-keyframes-string {
    box-sizing: border-box;
    font-size: 0.8rem;
    position: relative;

    margin: auto;

    z-index: 2;

    pre {
        padding: 1rem;
        border-radius: 5px;

        overflow: scroll;
    }

    &.error {
        animation: shake 700ms linear;
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
    position: absolute;
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
