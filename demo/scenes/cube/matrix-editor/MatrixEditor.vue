<template>
    <!-- X-DS pass 1, C1 (KF-C1-07) — no card of its own: the pane host draws the one frame (ControlsPaneWrapper), so this surface is flat inside it. -->
    <!-- X.KF.W13X.r3res2d (§0fj 4 · the §0fh item 6 idiom · UIA-KF-267 pane
         side) — the title never leaves the short rail. At 844×390 the sheet's
         window is 326 px and this surface 602 px, so the pane's port scrolled
         the "Transform matrix" heading out above it (and at 390×844 too). The
         surface is now a BOUNDED column down to its layer (`flex-col
         min-h-0` on each box, `.pane-bounded` on the layer — the pane's
         idiom, ControlsPaneWrapper.css): the layer's header stays above, and
         the layer's body is the one scroll port (a glass `FadingScroll`, the
         pane's own port kind), so the grid and the slider scroll under a
         title that stays in view. Where the surface fits (1440×900) nothing
         scrolls and nothing moves. -->
    <div class="w-full flex flex-col min-h-0">
        <!-- X-DS pass 9 (KF-C9-07) — the pane's one inset (`--configurator-pad-inline`). -->
        <div class="panel-content px-(--configurator-pad-inline) py-3 flex flex-col min-h-0">
            <!-- X.KF.W13X.matrix (UIA-KF-161 · UIA-KF-267) — the surface is ONE
                 titled glass section, the Spring facet's anatomy: the title names
                 what the panel edits (the facet had no heading and an unnamed
                 panel, so once the dock idled to its glyph nothing on screen said
                 "matrix"), and one caption line is the legend for the S/K/P/T/w
                 role letters the cells wear. -->
            <ConfiguratorLayer
                label="Transform matrix"
                default-open
                class="pane-bounded"
                body-class="flex flex-col max-h-full min-h-0"
            >
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
                <!-- The rows keep their 20 px rhythm: the body's former `gap-3`
                     plus glass's `space-y-2` on each body child (12 + 8 px). -->
                <FadingScroll axis="y" class="flex flex-col gap-5 min-h-0">
                    <p class="text-caption text-muted-foreground">
                        S&nbsp;scale · K&nbsp;shear · P&nbsp;perspective · T&nbsp;translate&nbsp;(px) · w&nbsp;divisor
                    </p>
                    <!-- owner-1112 [44] "put a grid around this and make it look like
                         a proper matrix." — ONE ruled 4 x 4 grid inside square
                         brackets: hairlines between rows and columns, cells flush
                         in the grid (no pill per cell), the figures tabular and
                         right-aligned, each COLUMN printed to one decimal count
                         (its most precise cell's, at most two: "1.00" over "0.35",
                         an all-integer column stays "1" and "0"), so every column
                         reads as one flush column with its points aligned,
                         and the role name a small caption in its axis hue. Hovering
                         a cell tints its row and column; the cell the slider drives
                         keeps the selected tint. The cells are the site's own plain
                         inputs (a matrix cell is not glass's field: its rim and
                         pill are what made sixteen loose fields); glass's
                         `--field-text-floor` keeps them at 16 px under a coarse
                         pointer, so iOS does not zoom. -->
                    <div class="matrix" role="group" aria-label="Matrix entries">
                        <div class="matrix-grid">
                            <div
                                v-for="(value, i) in matrix3dEnd.args"
                                :key="i"
                                class="matrix-cell"
                                :class="{ 'is-active': selectedCell === i }"
                                :data-row="Math.floor(i / 4)"
                                :data-col="i % 4"
                                @focusin="editingCell = i"
                                @focusout="editingCell = null"
                            >
                                <label
                                    :for="`${uid}-${i}`"
                                    :class="['matrix-axis-label', matrixCellMeta[i]!.axis.toLowerCase()]"
                                    >{{ matrixCellMeta[i]!.symbol }}<sub v-if="matrixCellMeta[i]!.sub">{{ matrixCellMeta[i]!.sub }}</sub></label
                                >
                                <!-- UIA-KF-264 — the cell the slider drives is marked for
                                     AT (`aria-current`) and, at rest, by the selected
                                     tint. A cell is selected by focus as well as by
                                     pointer, so the keyboard reaches the slider's cell. -->
                                <input
                                    :id="`${uid}-${i}`"
                                    class="matrix-cell-field focus-ring"
                                    type="text"
                                    inputmode="decimal"
                                    autocomplete="off"
                                    spellcheck="false"
                                    :aria-current="selectedCell === i ? 'true' : undefined"
                                    :title="matrixCellEditText((value as MatrixScalar).payload.value)"
                                    :value="cellText(value as MatrixScalar, i)"
                                    @input="(e: Event) => updateMatrixCell((e.target as HTMLInputElement).value, i)"
                                    @focus="selectedCell = i"
                                    @click="selectedCell = i"
                                />
                            </div>
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
                </FadingScroll>
            </ConfiguratorLayer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { RotateCcw } from "@lucide/vue";
import { Button } from "@mkbabb/glass-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ConfiguratorLayer } from "@mkbabb/glass-ui/configurator";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
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

/** [44] — each visual column (the grid's `i % 4`) prints at its most precise
 *  cell's decimal count, so a column's figures share one point and one end:
 *  "1" beside "0.35" reads as "1.00" over "0.35". Display only, at rest; an
 *  edit opens on the cell's full stored precision (ME-42, below), and the
 *  single-value digit policy (`matrixCellDisplayText`, two at most) is
 *  untouched. */
const decimalsOf = (text: string): number => {
    const dot = text.indexOf(".");
    return dot < 0 ? 0 : text.length - dot - 1;
};
const columnDecimals = computed(() =>
    [0, 1, 2, 3].map((col) =>
        Math.max(
            0,
            ...[0, 1, 2, 3].map((row) =>
                decimalsOf(matrixCellDisplayText(matrixCellValue(row * 4 + col))),
            ),
        ),
    ),
);
const toColumnDecimals = (text: string, decimals: number): string => {
    const have = decimalsOf(text);
    if (have >= decimals) return text;
    return (have === 0 ? `${text}.` : text) + "0".repeat(decimals - have);
};

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
        : toColumnDecimals(
              matrixCellDisplayText(cell.payload.value),
              columnDecimals.value[index % 4] ?? 0,
          );

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
/* owner-1112 [44] — THE MATRIX. One ruled grid in square brackets. The rule
   ink is the field separators' hairline (`--border`); the brackets are the
   foreground at the perimeter rung, drawn as the grid's own edges with short
   serifs top and bottom, as a printed matrix's are. */
.matrix {
    --matrix-rule: var(--border);
    --matrix-bracket: color-mix(in oklab, var(--foreground) 55%, transparent);
    --matrix-serif: 0.4rem;
    position: relative;
    padding-inline: calc(var(--matrix-serif) + 0.15rem);
}
.matrix::before,
.matrix::after {
    content: "";
    position: absolute;
    inset-block: 0;
    width: var(--matrix-serif);
    border: 1.5px solid var(--matrix-bracket);
    pointer-events: none;
}
.matrix::before {
    inset-inline-start: 0;
    border-inline-end: none;
}
.matrix::after {
    inset-inline-end: 0;
    border-inline-start: none;
}
.matrix-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* A cell: its caption at the start, its figure on the decimal column. Rules
   run between cells only, never round the outside (the brackets are that). */
.matrix-cell {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.125rem;
    min-width: 0;
    padding: 0.375rem 0.25rem 0.25rem 0.375rem;
    transition: background-color var(--duration-fast, 150ms) ease;
}
.matrix-cell:not([data-col="0"]) {
    border-inline-start: 1px solid var(--matrix-rule);
}
.matrix-cell:not([data-row="0"]) {
    border-block-start: 1px solid var(--matrix-rule);
}

/* Row and column hover: the hovered cell's whole row and column tint, the
   cell itself a step more (the reading guide a printed matrix lacks). */
.matrix-grid:has([data-row="0"]:hover) [data-row="0"],
.matrix-grid:has([data-row="1"]:hover) [data-row="1"],
.matrix-grid:has([data-row="2"]:hover) [data-row="2"],
.matrix-grid:has([data-row="3"]:hover) [data-row="3"],
.matrix-grid:has([data-col="0"]:hover) [data-col="0"],
.matrix-grid:has([data-col="1"]:hover) [data-col="1"],
.matrix-grid:has([data-col="2"]:hover) [data-col="2"],
.matrix-grid:has([data-col="3"]:hover) [data-col="3"] {
    background-color: color-mix(in oklab, var(--foreground) 4%, transparent);
}
.matrix-grid .matrix-cell:hover {
    background-color: color-mix(in oklab, var(--foreground) 8%, transparent);
}
/* The selected cell (the slider's): glass DESIGN.md's component-scoped
   `.is-active` ground (10 % foreground), so it reads after focus leaves. */
.matrix-grid .matrix-cell.is-active {
    background-color: color-mix(in oklab, var(--foreground) 10%, transparent);
}

.matrix-cell-field {
    min-width: 0;
    width: 100%;
    border: 0;
    border-radius: var(--radius-xs, 4px);
    background: transparent;
    color: var(--foreground);
    font-family: var(--font-mono);
    font-size: max(var(--type-small), var(--field-text-floor, 0px));
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    text-align: end;
    padding: 0;
}

/* The cell NAME, a caption in its axis hue. KF.W6 ME-13's form stands — theme-
   aware INK mixed from the axis colour toward --foreground (it must read as
   text, WCAG 1.4.3); the axis hues are the scene's identity colours, kept. */
.matrix-axis-label {
    font-family: var(--font-mono);
    font-size: var(--type-caption);
    line-height: 1.2;
    text-align: start;
    color: color-mix(in oklab, var(--color) 55%, var(--foreground));
    cursor: text;
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
