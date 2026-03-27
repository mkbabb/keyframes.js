<template>
    <Card>
        <CardContent class="grid items-center justify-center gap-3 p-3">
            <div
                class="matrix-grid relative m-0 grid h-[fit-content] w-full grid-cols-4 items-center justify-items-stretch gap-1 p-0"
            >
                <div
                    class="relative grid aspect-square min-h-[3.5rem] rounded-lg shadow-sm"
                    v-for="(value, i) in matrix3dEnd.values"
                >
                    <Input
                        :class="
                            `fira-code absolute left-0 top-0 z-10 h-full w-full text-ellipsis bg-transparent
                            p-0 text-center text-base` +
                            [
                                storedControls.matrixOptions
                                    .selectedMatrixCell === i
                                    ? 'font-bold focus:font-bold'
                                    : '',
                            ]
                        "
                        :model-value="
                            (
                                Math.round(
                                    (value.valueOf() as number) * 100,
                                ) / 100
                            )
                                .toFixed(2)
                                .replace(/\.0*$/, '')
                        "
                        @update:model-value="
                            (v) => updateMatrixCell(v, i)
                        "
                        :start="
                            matrixCellMeta[i].sliderOptions.bounds[0]
                        "
                        :end="
                            matrixCellMeta[i].sliderOptions.bounds[1]
                        "
                        :step="matrixCellMeta[i].sliderOptions.step"
                        @click="
                            storedControls.matrixOptions.selectedMatrixCell = i
                        "
                    />
                    <div
                        :class="
                            `instrument-serif absolute left-0 top-0 flex h-full w-full items-center justify-center
                            justify-items-center p-0 text-center text-3xl opacity-20 dark:opacity-75 ` +
                            [matrixCellMeta[i].axis.toLocaleLowerCase()]
                        "
                    >
                        <template
                            v-if="matrixCellMeta[i].transform !== ''"
                        >
                            {{ matrixCellMeta[i].transform
                            }}<sub>{{
                                matrixCellMeta[i].axis.toLowerCase()
                            }}</sub>
                        </template>
                        <template v-else>{{
                            matrixCellMeta[i].axis
                        }}</template>
                    </div>
                </div>
            </div>

            <Slider
                :model-value="[
                    matrix3dEnd.values[
                        storedControls.matrixOptions.selectedMatrixCell
                    ].valueOf() as number,
                ]"
                @update:model-value="
                    (val: any) => {
                        matrix3dEnd.values[
                            storedControls.matrixOptions.selectedMatrixCell
                        ].setValue(val[0]);
                    }
                "
                :min="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ].sliderOptions.bounds[0]
                "
                :max="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ].sliderOptions.bounds[1]
                "
                :step="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ].sliderOptions.step
                "
                class="w-full"
            ></Slider>

        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import type { ComputedRef, Ref } from "vue";
import { Slider, Card, CardContent, Input } from "@mkbabb/glass-ui";
import type { FunctionValue } from "@src/units";
import type { MatrixCellMeta } from "./useTransformState";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

const props = defineProps<{
    matrix3dEnd: FunctionValue;
    matrixCellMeta: MatrixCellMeta[];
    superKey: string;
}>();

const emit = defineEmits<{
    (e: "updateMatrixCell", to: number | string, ix: number): void;
    (e: "resetMatrix"): void;
}>();

const storedControls = getStoredAnimationGroupControlOptions(props.superKey);

const defaultMatrixOptions = {
    fixed: true,
    selectedMatrixCell: 0,
};

storedControls.matrixOptions ??= defaultMatrixOptions;

const updateMatrixCell = (to: number | string, ix: number) => {
    emit("updateMatrixCell", to, ix);
};

const resetMatrix = () => {
    emit("resetMatrix");
};
</script>

<style scoped>
.x {
    --color: var(--axis-x);
    color: var(--color);
}
.y {
    --color: var(--axis-y);
    color: var(--color);
}
.z {
    --color: var(--axis-z);
    color: var(--color);
}
.w {
    --color: var(--axis-w);
    color: var(--color);
}
</style>
