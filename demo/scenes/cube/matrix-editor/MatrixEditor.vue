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
                            (Math.round((value as MatrixScalar).payload.value * 100) / 100)
                                .toFixed(2)
                                .replace(/\.0*$/, '')
                        "
                        @update:model-value="(v) => updateMatrixCell(v, i)"
                        :start="matrixCellMeta[i]!.sliderOptions.bounds[0]"
                        :end="matrixCellMeta[i]!.sliderOptions.bounds[1]"
                        :step="matrixCellMeta[i]!.sliderOptions.step"
                        @click="
                            storedControls.matrixOptions.selectedMatrixCell = i
                        "
                    />
                    <div
                        :class="
                            `matrix-axis-label text-heading absolute top-0 left-0 flex h-full w-full items-center justify-center justify-items-center p-0 text-center ` +
                            [matrixCellMeta[i]!.axis.toLocaleLowerCase()]
                        "
                    >
                        <template v-if="matrixCellMeta[i]!.transform !== ''">
                            {{ matrixCellMeta[i]!.transform
                            }}<sub>{{
                                matrixCellMeta[i]!.axis.toLowerCase()
                            }}</sub>
                        </template>
                        <template v-else>{{
                            matrixCellMeta[i]!.axis
                        }}</template>
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
                    (val: number[] | undefined) => {
                        updateMatrixCell(
                            val![0]!,
                            storedControls.matrixOptions.selectedMatrixCell,
                        );
                    }
                "
                :min="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ]!.sliderOptions.bounds[0]
                "
                :max="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ]!.sliderOptions.bounds[1]
                "
                :step="
                    matrixCellMeta[
                        storedControls.matrixOptions.selectedMatrixCell
                    ]!.sliderOptions.step
                "
                class="w-full"
            ></Slider>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Slider, Card, CardContent } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import type { Matrix3dCall, MatrixCellMeta, MatrixScalar } from "./transformMath";
import {
    getStoredAnimationGroupControlOptions,
    type MatrixOptions,
    type StoredAnimationGroupControlOptions,
} from "@state";

const props = defineProps<{
    matrix3dEnd: Matrix3dCall;
    matrixCellMeta: MatrixCellMeta[];
    superKey: string;
}>();

const emit = defineEmits<{
    (e: "updateMatrixCell", to: number | string, ix: number): void;
    (e: "resetMatrix"): void;
}>();

// The store keeps `matrixOptions` OPTIONAL because a persisted pre-matrix bucket
// may predate the member; the `??=` below is what discharges that for this
// editor, and it runs to completion before the render function is ever evaluated.
// The annotation states exactly that post-condition, so the template reads the
// seeded member instead of re-asserting its presence at each of its ten sites.
const storedControls = getStoredAnimationGroupControlOptions(
    props.superKey,
) as StoredAnimationGroupControlOptions & { matrixOptions: MatrixOptions };

const defaultMatrixOptions: MatrixOptions = {
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
    // The editor only ever paints a matrix built by `createMatrix`, whose args
    // are all `MatrixScalar`; the shared type keeps the open union so that
    // `matrixValueAt`'s rejection of a non-scalar arg stays expressible.
    return (cell as MatrixScalar).payload.value;
};

const resetMatrix = () => {
    emit("resetMatrix");
};
</script>

<style scoped>
/* KF.W6 ME-13 — the axis label is the SOLE per-cell identification in this grid,
   and it was denominated in ALPHA — a 20 % opacity utility in light, a 75 % one
   in dark. Two magic numbers for one decision, and opacity is not a
   contrast mechanism — it multiplies whatever the token resolved to, so the
   light arm sat under a ceiling no theme could raise and the repo's own design
   doc had already written the diagnosis down ("nearly invisible in light mode")
   and scheduled a cure that never landed.

   The cure is theme-aware INK, not alpha (the banked ruling), and the demo's own
   doc floor rides: instead of fading the axis colour, the label paints a real
   muted RUNG mixed from that same colour toward the page. One fraction, both
   arms, resolved per theme because --background flips — the light arm gains the
   presence the doc asked for, the dark arm keeps a solid hue-true ink rather
   than a 75% wash, and the token language stays exactly what the tree defended
   twice (--axis-w is deliberately the neutral). Nothing here is transparent, so
   nothing composites unpredictably over the cell surface beneath.
   Painted ratios: KF.W9 / SS-13. */
.matrix-axis-label {
    color: color-mix(in oklab, var(--color) 55%, var(--background));
}
.x {
    --color: var(--axis-x);
}
.y {
    --color: var(--axis-y);
}
.z {
    --color: var(--axis-z);
}
.w {
    --color: var(--axis-w);
}
</style>
