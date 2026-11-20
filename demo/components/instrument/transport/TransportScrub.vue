<template>
    <!-- The phone dock's one scrub: the selected channel's playhead on glass's
         timeline slider, the elapsed range its fill. It carries no "time"
         label (the bar says it); its accessible name is "Time". The face has
         a definite inline size, so the dock's other seats keep theirs, and it
         takes glass's larger touch band (`.scrub-rail`) on a coarse pointer.
         This component is the read-back's render boundary: a playing frame
         re-renders the slider and nothing else in the dock. -->
    <div class="transport-scrub scrub-rail" @pointerdown.capture="onPointerDown">
        <Slider
            variant="scrubber"
            aria-label="Time"
            :value-text="() => `${Math.round(t * 100)} %`"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="[t]"
            @update:model-value="onInput"
            @value-commit="onCommit"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onScopeDispose, shallowRef, watch } from "vue";
import { Slider } from "@mkbabb/glass-ui/slider";
import { useDemoTicker } from "@composables/useDemoTicker";
import { useDragScrub } from "@composables/useDragScrub";
import { GROUP_PAINTS_KEY } from "./transportSource";

const { getT, scrub, isPlaying } = defineProps<{
    /** The selected channel's playhead, normalized to [0, 1]. */
    getT: () => number;
    /** Seat the selected channel at a normalized fraction. */
    scrub: (fraction: number) => void;
    isPlaying: boolean;
}>();

const emit = defineEmits<{
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

/** The playhead as the bar shows it. */
const t = shallowRef(getT());

// The read-back runs while the group plays, and for a short settle window
// after anything that may have moved the playhead while paused (a scrub, a
// paint the dock did not cause, a play-state flip); then it idles.
const SETTLE_FRAMES = 30;
let still = 0;
const awake = shallowRef(true);
const wake = (): void => {
    still = 0;
    awake.value = true;
};
const read = (): boolean => {
    const next = getT();
    const moved = next !== t.value;
    t.value = next;
    return moved;
};
useDemoTicker(
    () => {
        const moved = read();
        if (isPlaying || moved) {
            still = 0;
            return;
        }
        if (++still >= SETTLE_FRAMES) awake.value = false;
    },
    computed(() => isPlaying || awake.value),
);
watch(
    () => isPlaying,
    () => {
        read();
        wake();
    },
);
const observePaints = inject(GROUP_PAINTS_KEY, null);
if (observePaints) onScopeDispose(observePaints(wake));

// The gesture brackets the scrub (pause at the press, resume at the release),
// as the pane's rail does; the Slider owns the value under the finger.
const { dragging, onPointerDown } = useDragScrub({
    onStart: () => emit("scrubStart"),
    onEnd: () => {
        wake();
        emit("scrubEnd");
    },
});

const onInput = (value: number[] | undefined): void => {
    if (!dragging.value) return;
    const next = value?.[0];
    if (next === undefined) return;
    scrub(next);
    t.value = next;
    wake();
};

/** A keyboard step has no gesture: it is bracketed here. */
const onCommit = (value: number[]): void => {
    if (dragging.value) return;
    const next = value[0];
    if (next === undefined) return;
    emit("scrubStart");
    scrub(next);
    t.value = next;
    emit("scrubEnd");
    wake();
};
</script>

<style scoped>
/* A definite inline size: the bar takes what the dock's other seats leave on
   an upright phone (Play and Controls, their gaps and the plate's padding),
   never under 150 px and never wider than a comfortable reach. */
.transport-scrub {
    display: flex;
    align-items: center;
    inline-size: clamp(9.375rem, calc(100vw - 13rem), 18rem);
    padding-inline: 0.25rem;
}
</style>
