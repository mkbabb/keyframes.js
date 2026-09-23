<template>
    <Card tier="quiet" class="cartoon-surface">
        <CardContent class="grid items-center justify-center gap-3 p-3">
            <div
                class="matrix-grid relative m-0 grid h-fit w-full grid-cols-4
                    items-center justify-items-stretch gap-1 p-0"
            >
                <div
                    class="relative grid aspect-square min-h-[3.5rem] rounded-lg
                        shadow-sm"
                    v-for="(value, i) in matrix3dEnd.args"
                    :key="i"
                    @focusin="editingCell = i"
                    @focusout="editingCell = null"
                >
                    <!-- z-10 on the Input below is LOCAL stacking: the editable
                         value field overlays the decorative axis-label div within
                         the same matrix cell; not an editor z-contract layer. -->
                    <Input
                        :class="
                            `text-small absolute top-0 left-0 z-10 h-full w-full
                            bg-transparent p-0 text-center font-mono tabular-nums
                            text-ellipsis` +
                            [
                                storedControls.matrixOptions
                                    .selectedMatrixCell === i
                                    ? 'font-bold focus:font-bold'
                                    : '',
                            ]
                        "
                        :title="matrixCellEditText((value as MatrixScalar).payload.value)"
                        :model-value="cellText(value as MatrixScalar, i)"
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
import { ref } from "vue";
import { Slider, Card, CardContent } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/input";
import {
    matrixCellDisplayText,
    matrixCellEditText,
} from "./transformMath";
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

// ME-39 — the `resetMatrix` emit and its local raiser are DELETED with their
// diagnostic. LAW A census before the act: the emit had exactly one declared
// consumer (`CubeScene`'s `onResetMatrix`), and it was unreachable — the raiser
// had zero call sites, no template binding among them, so the component could
// never fire it. The LIVE Reset is the ribbon Button calling the composable's
// own `resetMatrix` directly; that path is untouched.
const emit = defineEmits<{
    (e: "updateMatrixCell", to: number | string, ix: number): void;
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

/**
 * ME-42 — THE DIGIT POLICY, stated for BOTH representations.
 *
 * This field has no model behind it: its rendered text IS its editable state,
 * and `@update:model-value` re-commits whatever that text became. So a 2-dp
 * DISPLAY string was also the WRITE path — touching a cell holding
 * `0.7071067811865476` (the ordinary content of the six cosine cells after any
 * 45° composition) silently re-committed a value derived from `"0.71"`.
 *
 * The two representations are therefore separated by the only state that
 * distinguishes them — whether the cell is being edited:
 *
 *   · DISPLAY (at rest): 2 dp, the tabular column the lattice reads as a grid.
 *   · EDIT (focused): the cell's FULL stored precision, so an edit opens on the
 *     true value and a committed-unchanged field round-trips exactly.
 *
 * Both live in `transformMath` beside the values they format — one readable
 * pair, gate-reachable without mounting a glass-ui subtree.
 *
 * The `title` beside it carries the full value in BOTH states — ME-43's
 * recovery affordance, for a fixed ~56 px cell that can hold `-1000`
 * (`transformMath`'s translate bounds) and had no way to show what it clipped.
 */
const editingCell = ref<number | null>(null);

const cellText = (cell: MatrixScalar, index: number): string =>
    editingCell.value === index
        ? matrixCellEditText(cell.payload.value)
        : matrixCellDisplayText(cell.payload.value);

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
