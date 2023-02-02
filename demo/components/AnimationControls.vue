<template>
    <div class="controls">
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
        </div>

        <input
            class="slider"
            type="range"
            v-model.number="sliderValue"
            :min="0"
            :disabled="!animation.paused"
            :max="animation.options.duration"
            @input="interpFrames"
        />

        <div class="timing">
            <button class="toggle" @click="toggle">
                {{ pauseValue }}
                <font-awesome-icon
                    :icon="!animation.paused ? ['fas', 'pause'] : ['fas', 'play']"
                />
            </button>
            <button class="reverse" @click="animation.reverse()">
                Reverse
                <font-awesome-icon :icon="['fas', 'undo']" />
            </button>
            <button class="reset" @click="animation.reset()">
                Reset
                <font-awesome-icon :icon="['fas', 'undo-alt']" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { Animation } from "../../src/animation";

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const sliderValue = $ref(0);
let pauseValue = $ref("Pause");

const interpFrames = () => {
    animation.interpFrames(sliderValue);
};

const toggle = () => {
    if (!animation.started) {
        animation.play();
    } else {
        animation.pause();
    }
    pauseValue = animation.paused ? "Play" : "Pause";
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&display=swap");

* {
    font-family: "Fira Code", monospace;
}

.animation-controls {
    display: flex;

    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    z-index: 1;
    opacity: 0.95;
}

.timing {
    display: grid;
    gap: 0.5rem;
    grid-auto-flow: column;

    margin-right: 10px;
}

.options {
    display: grid;
    gap: 0.25rem 1rem;
    grid-template-columns: repeat(2, 1fr);
}

label {
    font-size: 1.25rem;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
}

input[type="number"],
select {
    font-size: 1rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border: none;
    border-radius: 5px;
    padding: 0.25rem 0.5rem;
    width: auto;
}

input[type="range"] {
    --color: rgb(75, 204, 63);
    width: 100%;
    background: var(--color);
    outline: none;
    opacity: 0.8;
    text-align: center;
    transition: opacity color 0.2s;
    

    &:disabled {
        --color: gray;
    }

    &:hover {
        opacity: 1;
    }

    &[type="range"] {
        appearance: none;
        height: 6px;
        border-radius: 10px;
        background: var(--color);

        &::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--color);
            cursor: pointer;
        }

        &::-moz-range-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--color);
            cursor: pointer;
        }
    }
}

.slider {
    margin: 1rem 0;
}

button {
    font-size: 1.25rem;
    padding: 0.25rem 1rem;
    border-radius: 5px;
    border: none;
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    cursor: pointer;
}
</style>
