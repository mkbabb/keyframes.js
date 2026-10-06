<template>
    <Card tier="quiet" class="cartoon-surface w-full overflow-visible">
        <CardContent class="panel-content px-4 py-3">
            <!-- X.KF.W13X.matrix (UIA-KF-161 · UIA-KF-267) — the surface is ONE
                 titled glass section, the Spring facet's anatomy: the title names
                 what the panel edits (the facet had no heading and an unnamed
                 panel, so once the dock idled to its glyph nothing on screen said
                 "matrix"), and one caption line is the legend for the S/K/P/T/w
                 role letters the cells wear. -->
            <ConfiguratorLayer label="Transform matrix" default-open body-class="flex flex-col gap-3">
                <!-- X.KF.W13X.sections (KF-W13 addendum (c), glass 10.1.0 O-68) — the
                     section's one action rides its header: Reset sat ALONE in a
                     second ribbon card under the editor, a body row away from the
                     title of what it resets. It is now a glass Button in the
                     layer's `#actions` slot (quiet, sm, icon-only, named), the
                     Spring facet's anatomy; `.stop` keeps the press from toggling
                     the layer. -->
                <template #actions>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                emphasis="quiet"
                                size="sm"
                                icon-only
                                aria-label="Reset matrix"
                                @click.stop="emit('resetMatrix')"
                            >
                                <RotateCcw aria-hidden="true" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset matrix: return every entry to the identity</TooltipContent>
                    </Tooltip>
                </template>
                <p class="text-caption text-muted-foreground">
                    S&nbsp;scale · K&nbsp;shear · P&nbsp;perspective · T&nbsp;translate&nbsp;(px) · w&nbsp;divisor
                </p>
                <!-- UIA-KF-063 · UIA-KF-047 · UIA-KF-263/266 — each cell is a
                     field-radius TILE holding its name ABOVE a single-line value
                     field: the name sat under the value as a larger bold
                     watermark (both illegible, worse in dark), and the text input
                     stretched to a 56 px square became a disc (the pill radius
                     clamps to half the block). The grid fills the card instead of
                     shrink-wrapping to a centred island. The field keeps glass's
                     own single-line shape; the card-like single-value FIELD kind
                     is glass's row (O-59, relay-only). -->
                <div class="matrix-grid grid w-full grid-cols-4 gap-1" role="group" aria-label="Matrix entries">
                    <div
                        v-for="(value, i) in matrix3dEnd.args"
                        :key="i"
                        class="matrix-cell"
                        :class="{ 'is-active': selectedCell === i }"
                        @focusin="editingCell = i"
                        @focusout="editingCell = null"
                    >
                        <label
                            :for="`${uid}-${i}`"
                            :class="['matrix-axis-label', matrixCellMeta[i]!.axis.toLowerCase()]"
                            >{{ matrixCellMeta[i]!.symbol }}<sub v-if="matrixCellMeta[i]!.sub">{{ matrixCellMeta[i]!.sub }}</sub></label
                        >
                        <!-- UIA-KF-264 — the cell the slider drives is marked for AT
                             (`aria-current`) and, at rest, by the tile's selected
                             tint (glass DESIGN.md's component-scoped `.is-active`:
                             10 % foreground ground, 25 % foreground edge). A cell
                             is selected by focus as well as by pointer, so the
                             keyboard reaches the slider's cell too. -->
                        <Input
                            :id="`${uid}-${i}`"
                            class="matrix-cell-field text-small text-center font-mono tabular-nums px-1"
                            inputmode="decimal"
                            :aria-current="selectedCell === i ? 'true' : undefined"
                            :title="matrixCellEditText((value as MatrixScalar).payload.value)"
                            :model-value="cellText(value as MatrixScalar, i)"
                            @update:model-value="(v) => updateMatrixCell(v, i)"
                            @focus="selectedCell = i"
                            @click="selectedCell = i"
                        />
                    </div>
                </div>

                <!-- UIA-KF-260 · UIA-KF-106 (consumer half) — the ONE control
                     idiom (OA-45/47, the param row): the slider is named by the
                     cell it drives and the value reads on the label's line; the
                     humane string reaches AT through the producer's `valueText`.
                     The value/unit readout PROP and the extreme-edge mark are
                     glass's half (O-59). -->
                <div class="param-row">
                    <LabeledSlider
                        :model-value="matrixCellValue(selectedCell)"
                        :label="selectedMeta.name"
                        :min="selectedMeta.sliderOptions.bounds[0]"
                        :max="selectedMeta.sliderOptions.bounds[1]"
                        :step="selectedMeta.sliderOptions.step"
                        :value-text="(v: number) => `${selectedMeta.name} ${readout(v)}`"
                        @update:model-value="(v: number) => updateMatrixCell(v, selectedCell)"
                    />
                    <output class="param-value" aria-hidden="true">{{ readout(matrixCellValue(selectedCell)) }}</output>
                </div>
            </ConfiguratorLayer>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { RotateCcw } from "@lucide/vue";
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ConfiguratorLayer } from "@mkbabb/glass-ui/configurator";
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

// ME-39 deleted an unreachable `resetMatrix` emit (no raiser). X.KF.W13X.sections
// restores it WITH its raiser: the header's Reset (`#actions`) is the one
// reset control, and CubeScene binds it to the composable's own `resetMatrix`.
const emit = defineEmits<{
    (e: "updateMatrixCell", to: number | string, ix: number): void;
    (e: "resetMatrix"): void;
}>();

// The store keeps `matrixOptions` OPTIONAL because a persisted pre-matrix bucket
// may predate the member; the `??=` below is what discharges that for this
// editor, and it runs to completion before the render function is ever evaluated.
// The annotation states exactly that post-condition, so the template reads the
// seeded member instead of re-asserting its presence at each site.
const storedControls = getStoredAnimationGroupControlOptions(
    props.superKey,
) as StoredAnimationGroupControlOptions & { matrixOptions: MatrixOptions };

// X.KF.W13X.matrix (UIA-KF-028) — the slice is the selected cell alone. Its
// `fixed` flag was written by the ribbon's Fixed/Free toggle and read by
// nothing: a control that only flipped its own label. Toggle and flag are gone.
storedControls.matrixOptions ??= { selectedMatrixCell: 0 };

const selectedCell = computed({
    get: () => storedControls.matrixOptions.selectedMatrixCell,
    set: (ix: number) => {
        storedControls.matrixOptions.selectedMatrixCell = ix;
    },
});

const selectedMeta = computed(() => {
    const meta = props.matrixCellMeta[selectedCell.value];
    if (meta === undefined) {
        throw new RangeError(
            `Matrix cell ${selectedCell.value} is outside the matrix3d value.`,
        );
    }
    return meta;
});

// The readout: the at-rest digit policy, plus the unit a translate cell carries.
const readout = (value: number): string =>
    matrixCellDisplayText(value) + (selectedMeta.value.symbol === "T" ? " px" : "");

const uid = useId();

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
 * recovery affordance, for a narrow cell that can hold a translate of several
 * hundred px and had no way to show what it clipped.
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
/* X.KF.W13X.matrix — the cell TILE: the name above, the value field below,
   on the card rung glass's radius canon gives multi-line holders
   (`--radius-field`, glass DESIGN.md:386). At rest the tile is transparent; the
   selected tile takes glass's component-scoped `.is-active` recipe (DESIGN.md:
   "10% foreground bg, 25% foreground border"), so the cell the slider drives is
   legible after focus leaves the grid. */
.matrix-cell {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: calc(var(--space-atom) / 2);
    min-width: 0;
    padding: calc(var(--space-atom) / 2);
    border: 1px solid transparent;
    border-radius: var(--radius-field);
}
.matrix-cell.is-active {
    background: color-mix(in oklab, var(--foreground) 10%, transparent);
    border-color: color-mix(in oklab, var(--foreground) 25%, transparent);
}
.matrix-cell-field {
    min-width: 0;
}

/* The cell NAME, in the label register above its field (UIA-KF-063: it was a
   `text-heading` watermark under the value). KF.W6 ME-13's form stands — theme-
   aware INK mixed from the axis colour, one fraction for both themes, never
   alpha — but its pole moves from the page to the TEXT: ME-13 mixed toward
   --background for a decorative watermark under the value, and at caption size
   that rung measured ~1.7:1 on the light card (the label is now the cell's only
   name, so it must read as text, WCAG 1.4.3). Mixed toward --foreground it
   darkens in light and lightens in dark. The axis hues — the scene's identity
   colours — are kept. */
.matrix-axis-label {
    font-family: var(--font-mono);
    font-size: var(--type-caption);
    line-height: 1.2;
    text-align: center;
    color: color-mix(in oklab, var(--color) 55%, var(--foreground));
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
