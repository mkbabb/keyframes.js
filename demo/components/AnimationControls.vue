<template>
    <div class="animation-controls">
        <div class="options">
            <label>Duration</label>
            <input type="number" v-model.number="animation.options.duration" />

            <label>Delay</label>
            <input type="number" v-model.number="animation.options.delay" />

            <label>Iteration Count</label>
            <input type="number" v-model.number="animation.options.iterationCount" />

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
                    <select @input="updateTimingFunction" v-model="cubicBezierValues">
                        <option
                            v-for="(preset, presetName) in bezierPresets"
                            :value="preset"
                        >
                            {{ presetName }}
                        </option>
                    </select>

                    <label> X1 {{ formatNumber(cubicBezierValues[0]) }} </label>
                    <input
                        @change="updateTimingFunction"
                        v-model.number="cubicBezierValues[0]"
                        type="range"
                        :min="-2"
                        :max="2"
                        step="0.01"
                    />

                    <label>Y1 {{ formatNumber(cubicBezierValues[1]) }}</label>
                    <input
                        @change="updateTimingFunction"
                        v-model.number="cubicBezierValues[1]"
                        type="range"
                        :min="-2"
                        :max="2"
                        step="0.01"
                    />

                    <label>X2 {{ formatNumber(cubicBezierValues[2]) }}</label>
                    <input
                        @change="updateTimingFunction"
                        v-model.number="cubicBezierValues[2]"
                        type="range"
                        :min="-2"
                        :max="2"
                        step="0.01"
                    />

                    <label>Y2 {{ formatNumber(cubicBezierValues[3]) }}</label>
                    <input
                        @change="updateTimingFunction"
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
            v-model.number="sliderValue"
            :min="0"
            :disabled="!paused"
            :max="animation.options.duration"
            @input="interpFrames"
        />
        <div class="timing">
            <button class="toggle" @click="toggle">
                {{ pausedString }}
                <!-- <font-awesome-icon
                    :icon="!animation.paused ? ['fas', 'pause'] : ['fas', 'play']"
                /> -->
            </button>
            <button class="reverse" @click="animation.reverse()">
                Reverse
                <!-- <font-awesome-icon :icon="['fas', 'undo']" /> -->
            </button>
            <button class="reset" @click="animation.reset()">
                Reset
                <!-- <font-awesome-icon :icon="['fas', 'undo-alt']" /> -->
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Animation, Vars } from "../../src/animation";
import { timingFunctions, jumpTerms, CSSBezier, bezierPresets } from "../../src/easing";
import { ValueArray } from "../../src/units";
import { formatNumber } from "./utils";

let timingFunctionsAnd = {
    cubicBezier: "cubicBezier",
    ...timingFunctions,
};

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            values: Vars<ValueArray>;
            animationId: number;
        }
    ): void;
}>();

const setTimingFunction = (timingFunction) => {
    animation.options.timingFunction = timingFunction;
    animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
};

let timingFunctionKey = $ref("linear");

const updateTimingFunction = () => {
    let timingFunction = timingFunctions[timingFunctionKey];
    if (timingFunctionKey === "steps") {
        timingFunction = timingFunctions[timingFunctionKey](steps, jumpTerm);
    } else if (timingFunctionKey === "cubicBezier") {
        timingFunction = CSSBezier(...cubicBezierValues);
    }

    setTimingFunction(timingFunction);
};

let jumpTerm = $ref("jump-none");
let steps = $ref(10);

let cubicBezierValues = $ref([0, 0, 1, 1]);

const updateBezierPreset = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const preset = target.value;
};

let sliderValue = $ref(0);

const interpFrames = () => {
    const paused = animation.paused;
    animation.paused = false;

    const values: Vars<ValueArray> = {};
    animation.interpFrames(sliderValue, values);

    emit("sliderUpdate", {
        values: values,
        animationId: animation.id,
    });

    animation.paused = paused;
};

let paused = $ref(false);
let pausedString = $ref("Pause");
let prevT = $ref(0);
let prevTime = $ref(0);

const toggle = () => {
    if (!animation.started) {
        animation.play();
    } else {
        animation.pause();
    }

    paused = animation.paused;
    pausedString = animation.paused ? "Play" : "Pause";
    sliderValue = animation.t;

    if (paused) {
        prevTime = performance.now();
        prevT = animation.t;
    } else {
        // animation.pausedTime = performance.now() - prevTime;
        // animation.startTime -= animation.t - prevT;
    }
};
</script>

<style scoped lang="scss">
.animation-controls {
    display: flex;

    flex-direction: column;
    gap: 1rem;

    border-radius: 5px;

    z-index: 1;
    opacity: 0.95;
}

input[type="range"] {
    --color: green;
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
    margin: 0.5rem 0;
    grid-column: span 2;
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 10rem auto;
    align-items: center;

    select {
        grid-column: span 2;
    }

    label {
        text-align: center;
        white-space: pre;
    }

    input {
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
}
</style>
