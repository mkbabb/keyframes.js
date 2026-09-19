import { easeInBounce } from "@mkbabb/value.js/easing";
import { NumericAnimation } from "@mkbabb/keyframes.js";
import { computed, onScopeDispose, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { mat4 } from "gl-matrix";
import { kfEngine } from "@kf-engine";
import type { TransformState } from "../orbital-drag";
import {
    createMatrix,
    matrix3dCss,
    getAxisFromIx,
    getTransformFromIx,
    getSliderOptionsFromIx,
    matrixValues,
    withMatrixCell,
} from "./transformMath";
import type { MatrixCellMeta } from "./transformMath";
export type { MatrixCellMeta } from "./transformMath";

/** The T·R·S triple the sliders carry — the channel the matrix projects onto. */
type SliderTriple = Pick<TransformState, "translate" | "rotate" | "scale">;

const snapshotTriple = (state: SliderTriple): SliderTriple => ({
    translate: { ...state.translate },
    rotate: { ...state.rotate },
    scale: { ...state.scale },
});

const sameTriple = (a: SliderTriple, b: SliderTriple): boolean =>
    (["translate", "rotate", "scale"] as const).every((channel) =>
        (["x", "y", "z"] as const).every(
            (axis) => a[channel][axis] === b[channel][axis],
        ),
    );

/**
 * THE SYNC TOPOLOGY (kf-CubeScene L-4+M-6 ≡ ME-30 · kf-CubeScene L-3 ≡ ME-31,
 * with ME-7's retain-and-retarget) — ONE spec, written before its patches.
 *
 * The matrix and the T·R·S sliders are two views of one pose, and the old shape
 * let each of them overwrite the other with no ownership at all:
 *
 *   1. **ONE writer per channel, and the writer is an INTENT, never an echo.**
 *      `matrix3dEnd` is written by exactly two intents — a direct cell edit
 *      (`updateMatrixCell`) and a slider compose (`updateTransformations`). The
 *      deep watcher composes only on a REAL T·R·S delta. Formerly a cell edit
 *      fed its own translate back into the sliders, the watcher read that echo
 *      as a fresh intent, and the T·R·S recompose destroyed every hand-edited
 *      non-T·R·S cell (ME-30's born-RED gate: edit cell 1, then cell 12, and
 *      cell 1 must survive). The echo guard is the house form — OrbitalDrag
 *      guards its own quaternion↔Euler round trip exactly this way.
 *   2. **Never write both endpoints from one pose.** `updateTransformations`
 *      wrote `matrix3dStart` AND `matrix3dEnd` from the same composition, so the
 *      Matrix channel's start→end delta collapsed to zero and Play animated
 *      nothing on it. `matrix3dStart` is the channel's identity baseline and is
 *      written by nothing.
 *   3. **`acos(diagonal)` is not a rotation read.** The reset arm wrote
 *      `Math.acos(m00|m11|m22)` RADIANS into a DEGREES field — a 57.3×
 *      dimensional error — and returned NaN for any diagonal outside [-1,1],
 *      which the scale slider's own `[0.4, 3]` preset reaches. The NaN fired the
 *      deep watcher, `fromXRotation(NaN)` poisoned the composite, and
 *      `createMatrix` threw a TypeError from inside a rAF callback, bricking the
 *      free-transform path until reload. The projection now writes only what the
 *      matrix EXACTLY carries (the translation, m12/13/14); Reset writes the
 *      triple it is resetting TO — identity, by construction, never inferred.
 *   4. **One retained animation per concern** (ME-7 ≡ kf-CubeScene C-7/L-13/L-14):
 *      each emission formerly spawned a fresh un-cancelled 300 ms animation with
 *      its own private rAF chain, no handle, no dedupe and no disposal. Two
 *      instances are retained, stopped-and-retargeted per emission, and stopped
 *      on scope dispose.
 */
export function useTransformState(
    isGroupStarted: Ref<boolean>,
    targetRef: Ref<HTMLElement | undefined>,
    initialTransform?: TransformState,
) {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood
    // inversion) — synchronous, since the warm resolves before any scene mounts.
    // `transformTargetsStyle` paints a Vars snapshot onto DOM targets. It is the
    // same painter the run loop drives — but the run loop feeds it SERIALIZED
    // leaves, and this call site feeds it a snapshot it authors itself. #53: a
    // structural `Matrix3dCall` handed here is silently skipped (the painter's
    // object guard), so this site serializes with `matrix3dCss` before painting.
    const { transformTargetsStyle } = kfEngine();

    // The Matrix channel's START pose. It is the identity baseline and NOTHING
    // writes it (topology 2): an endpoint written from the same pose as the end
    // is an animation with no delta.
    const matrix3dStart = ref(createMatrix());
    const matrix3dEnd = ref(createMatrix());

    const transformSliderValues = ref<TransformState>(
        initialTransform
            ? {
                  translate: { ...initialTransform.translate },
                  rotate: { ...initialTransform.rotate },
                  scale: { ...initialTransform.scale },
                  matrix: mat4.clone(initialTransform.matrix ?? mat4.create()),
              }
            : {
                  translate: { x: 0, y: 0, z: 0 },
                  rotate: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                  matrix: mat4.create(),
              },
    );

    // The last triple THIS composable projected into the sliders. The watcher
    // compares against it to tell an echo from an intent (topology 1).
    let lastProjected: SliderTriple = snapshotTriple(transformSliderValues.value);

    const matrixCellMeta: ComputedRef<MatrixCellMeta[]> = computed(() =>
        Array.from({ length: 16 }, (_, i) => ({
            axis: getAxisFromIx(i),
            transform: getTransformFromIx(i),
            sliderOptions: getSliderOptionsFromIx(i),
        })),
    );

    const paintTarget = () => {
        if (!targetRef.value) return;
        transformTargetsStyle({ transform: matrix3dCss(matrix3dEnd.value) }, [
            targetRef.value,
        ]);
    };

    /** matrix → sliders, for the ONE channel a matrix3d carries exactly: the
     *  translation. Marked as this composable's own write so the watcher does
     *  not read it back as a user intent. */
    const syncTransformations = () => {
        const values = matrixValues(matrix3dEnd.value);

        transformSliderValues.value.translate.x = values[12];
        transformSliderValues.value.translate.y = values[13];
        transformSliderValues.value.translate.z = values[14];

        lastProjected = snapshotTriple(transformSliderValues.value);
    };

    // ME-7 — two retained instances, stopped-and-retargeted per emission.
    const cellTween = new NumericAnimation([{ value: 0 }, { value: 0 }], {
        duration: 300,
    });

    const matrixFrame = (matrix: ArrayLike<number>): Record<string, number> =>
        Object.fromEntries(
            Array.from(matrix, (value, index) => [`m${index}`, value]),
        );

    const resetTween = new NumericAnimation(
        [matrixFrame(mat4.create()), matrixFrame(mat4.create())],
        { duration: 500, timingFunction: easeInBounce },
    );

    const updateMatrixCell = (to: number | string, ix: number) => {
        const toNum = typeof to === "string" ? parseFloat(to) : to;
        const from = matrixValues(matrix3dEnd.value)[ix];
        if (from === undefined) {
            throw new RangeError(
                `Matrix cell ${ix} is outside the matrix3d value.`,
            );
        }
        // ME-1 — an incomplete numeric literal (`""`, `"-"`, `"."`) is a field
        // MID-EDIT, not a value. Refuse it here, at the parse boundary, and the
        // cell keeps its last good number; the former shape let the NaN through
        // to `withMatrixCell`, which threw a TypeError from inside a rAF callback
        // on every such keystroke.
        if (!Number.isFinite(toNum)) return;

        cellTween.stop();
        cellTween.updateKeyframe(0, { value: from });
        cellTween.updateKeyframe(1, { value: toNum });
        void cellTween.play(({ value }) => {
            matrix3dEnd.value = withMatrixCell(matrix3dEnd.value, ix, value);
            syncTransformations();
            paintTarget();
        });
    };

    function updateTransformations() {
        const { translate, rotate, scale } = transformSliderValues.value;

        const translationMatrix = mat4.fromTranslation(mat4.create(), [
            translate.x,
            translate.y,
            translate.z,
        ]);
        const scalingMatrix = mat4.fromScaling(mat4.create(), [
            scale.x,
            scale.y,
            scale.z,
        ]);

        const rotationX = mat4.fromXRotation(
            mat4.create(),
            rotate.x * (Math.PI / 180),
        );
        const rotationY = mat4.fromYRotation(
            mat4.create(),
            rotate.y * (Math.PI / 180),
        );
        const rotationZ = mat4.fromZRotation(
            mat4.create(),
            rotate.z * (Math.PI / 180),
        );

        const rotationMatrix = mat4.multiply(
            mat4.create(),
            rotationX,
            rotationY,
        );
        mat4.multiply(rotationMatrix, rotationMatrix, rotationZ);

        const transformationMatrix = mat4.create();
        mat4.multiply(transformationMatrix, translationMatrix, rotationMatrix);
        mat4.multiply(
            transformationMatrix,
            transformationMatrix,
            scalingMatrix,
        );

        matrix3dEnd.value = createMatrix(transformationMatrix);
        lastProjected = snapshotTriple(transformSliderValues.value);
    }

    const resetMatrix = () => {
        const fromMatrix = matrixValues(matrix3dEnd.value);
        const toMatrix = mat4.create();

        resetTween.stop();
        resetTween.updateKeyframe(0, matrixFrame(fromMatrix));
        resetTween.updateKeyframe(1, matrixFrame(toMatrix));
        void resetTween
            .play((values) => {
                const matrix = Array.from({ length: 16 }, (_, index) => {
                    const value = values[`m${index}`];
                    if (typeof value !== "number" || !Number.isFinite(value)) {
                        throw new TypeError(
                            `Numeric matrix frame is missing finite m${index}.`,
                        );
                    }
                    return value;
                });
                matrix3dEnd.value = createMatrix(matrix);
                syncTransformations();
                paintTarget();
            })
            .then(() => {
                // Topology 3 — Reset's destination is identity BY CONSTRUCTION,
                // so the triple is written, never inferred from a diagonal.
                const slider = transformSliderValues.value;
                slider.rotate.x = 0;
                slider.rotate.y = 0;
                slider.rotate.z = 0;
                slider.scale.x = 1;
                slider.scale.y = 1;
                slider.scale.z = 1;
                lastProjected = snapshotTriple(slider);
            });
    };

    // rAF-debounced watcher for genuine T·R·S changes (a slider edit, or a live
    // OrbitalDrag frame — the drag's rotation is what turns the die before the
    // group has started, since the container renders no pose until then).
    //
    // When the animation group is started (playing or paused), the drag rotation
    // is applied to OrbitalDrag's container element via CSS compose — the
    // AnimationGroup owns the cube's transform and its end-keyframe matrix must
    // stay stable so interpolation is smooth. Rebuilding `matrix3dEnd` from drag
    // rotation mid-play moved the animation's endpoint every frame.
    //
    // The ECHO GUARD is what makes the gate meaningful: a change this composable
    // itself projected into the sliders is not an intent to recompose, so a cell
    // edit no longer destroys its neighbours through its own write-back.
    let transformUpdateScheduled = false;
    watch(
        transformSliderValues,
        () => {
            if (isGroupStarted.value) return;
            if (sameTriple(transformSliderValues.value, lastProjected)) return;
            if (transformUpdateScheduled) return;
            transformUpdateScheduled = true;
            requestAnimationFrame(() => {
                transformUpdateScheduled = false;
                if (sameTriple(transformSliderValues.value, lastProjected)) return;
                updateTransformations();
                paintTarget();
            });
        },
        { deep: true },
    );

    onScopeDispose(() => {
        cellTween.stop();
        resetTween.stop();
    });

    // ME-39 — `syncTransformations`/`updateTransformations` had zero consumers
    // tree-wide and are the composable's own internals; returning them is what
    // let a stale excuse ("matrix editor sliders still call
    // updateTransformations() explicitly") survive for as long as it did.
    return {
        matrix3dStart,
        matrix3dEnd,
        transformSliderValues,
        matrixCellMeta,
        updateMatrixCell,
        resetMatrix,
    };
}
