<template>
    <Card cartoon tier="quiet">
        <CardContent class="grid items-center justify-center gap-3 p-3">
            <div
                class="matrix-grid relative m-0 grid h-fit w-full grid-cols-4
                    items-center justify-items-stretch gap-1 p-0"
            >
                <div
                    class="relative grid aspect-square min-h-[3.5rem] rounded-lg
                        shadow-sm"
                    v-for="(value, i) in matrix3dEnd.args"
                >
                    <!-- z-10 on the Input below is LOCAL stacking: the editable
                         value field overlays the decorative axis-label div within
                         the same matrix cell; not an editor z-contract layer. -->
                    <Input
                        :class="
                            `text-body absolute top-0 left-0 z-10 h-full w-full
                            bg-transparent p-0 text-center font-mono
                            text-ellipsis` +
                            [
                                storedControls.matrixOptions
                                    .selectedMatrixCell === i
                                    ? 'font-bold focus:font-bold'
                                    : '',
                            ]
                        "
                        :model-value="
                            (Math.round(value.payload.value * 100) / 100)
                                .toFixed(2)
                                .replace(/\.0*$/, '')
                        "
                        @update:model-value="(v) => updateMatrixCell(v, i)"
                        :start="matrixCellMeta[i].sliderOptions.bounds[0]"
                        :end="matrixCellMeta[i].sliderOptions.bounds[1]"
                        :step="matrixCellMeta[i].sliderOptions.step"
                        @click="
                            storedControls.matrixOptions.selectedMatrixCell = i
                        "
                    />
                    <div
                        :class="
                            `text-heading absolute top-0 left-0 flex h-full
                            w-full items-center justify-center
                            justify-items-center p-0 text-center opacity-20
                            dark:opacity-75 ` +
                            [matrixCellMeta[i].axis.toLocaleLowerCase()]
                        "
                    >
                        <template v-if="matrixCellMeta[i].transform !== ''">
                            {{ matrixCellMeta[i].transform
                            }}<sub>{{
                                matrixCellMeta[i].axis.toLowerCase()
                            }}</sub>
                        </template>
                        <template v-else>{{ matrixCellMeta[i].axis }}</template>
                    </div>
                </div>
            </div>

            <Slider
                :model-value="[
                    matrixCellValue(
                        storedControls.matrixOptions.selectedMatrixCell,
                    ),
                ]"
                @update:model-value="
                    (val: number[]) => {
                        updateMatrixCell(
                            val[0],
                            storedControls.matrixOptions.selectedMatrixCell,
                        );
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
import { Slider, Card, CardContent } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import type { Matrix3dCall, MatrixCellMeta } from "./transformMath";
import { getStoredAnimationGroupControlOptions } from "@state";

const props = defineProps<{
    matrix3dEnd: Matrix3dCall;
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

const matrixCellValue = (index: number): number => {
    const cell = props.matrix3dEnd.args[index];
    if (cell === undefined) {
        throw new RangeError(
            `Matrix cell ${index} is outside the matrix3d value.`,
        );
    }
    return cell.payload.value;
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
