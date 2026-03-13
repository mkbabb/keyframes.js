import { computed, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { mat4 } from "gl-matrix";
import { CSSKeyframesAnimation } from "@src/animation/index";
import { easeInBounce } from "@src/easing";
import { transformTargetsStyle } from "@src/animation/utils";
import type { TransformState } from "@components/custom/orbital-drag";
import {
    MATRIX_AXES,
    transformSliderOptions,
    createMatrix,
    getAxisFromIx,
    getTransformFromIx,
    getSliderOptionsFromIx,
} from "./transformMath";
import type { MatrixCellMeta } from "./transformMath";
export type { MatrixCellMeta } from "./transformMath";

export function useTransformState(
    isGroupPlaying: Ref<boolean>,
    isGroupStarted: Ref<boolean>,
    targetRef: Ref<HTMLElement | undefined>,
    initialTransform?: TransformState,
) {
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

    const matrixCellMeta: ComputedRef<MatrixCellMeta[]> = computed(() =>
        Array.from({ length: 16 }, (_, i) => ({
            axis: getAxisFromIx(i),
            transform: getTransformFromIx(i),
            sliderOptions: getSliderOptionsFromIx(i),
        })),
    );

    const syncTransformations = (reset: boolean = false) => {
        const values = matrix3dEnd.value.valueOf();

        transformSliderValues.value.translate.x = values[12];
        transformSliderValues.value.translate.y = values[13];
        transformSliderValues.value.translate.z = values[14];

        if (!reset) return;

        transformSliderValues.value.rotate.x = Math.acos(values[0]);
        transformSliderValues.value.rotate.y = Math.acos(values[5]);
        transformSliderValues.value.rotate.z = Math.acos(values[10]);

        transformSliderValues.value.scale.x = values[0];
        transformSliderValues.value.scale.y = values[5];
        transformSliderValues.value.scale.z = values[10];
    };

    const updateMatrixCell = (to: number | string, ix: number) => {
        const toNum = typeof to === "string" ? parseFloat(to) : to;
        const from = matrix3dEnd.value.valueOf()[ix];

        new CSSKeyframesAnimation({ duration: 300 })
            .fromVars(
                [{ value: from }, { value: toNum }],
                ({ value }) => {
                    matrix3dEnd.value.setValue(value.valueOf(), ix);
                    syncTransformations();
                },
            )
            .play();
    };

    const animateUpdateMatrix = (
        fromMatrix: mat4,
        toMatrix: mat4,
        reset: boolean = false,
    ) => {
        const transformFunc = ({ transform: { matrix3d } }: any) => {
            const matrixValues = matrix3d.valueOf();

            matrix3dEnd.value.values.forEach((value, i) => {
                value.setValue(matrixValues[i]);
                syncTransformations(reset);
            });

            if (targetRef.value) {
                transformTargetsStyle(
                    { transform: { matrix3d: matrix3dEnd.value } },
                    [targetRef.value],
                    false,
                );
            }
        };

        new CSSKeyframesAnimation({
            duration: 500,
            timingFunction: easeInBounce,
        })
            .fromVars(
                [
                    { transform: { matrix3d: fromMatrix } },
                    { transform: { matrix3d: toMatrix } },
                ],
                transformFunc,
            )
            .play();
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
        mat4.multiply(
            transformationMatrix,
            translationMatrix,
            rotationMatrix,
        );
        mat4.multiply(
            transformationMatrix,
            transformationMatrix,
            scalingMatrix,
        );

        matrix3dEnd.value.values.forEach((value, i) => {
            value.setValue(transformationMatrix[i]!);
        });
        matrix3dStart.value.values.forEach((value, i) => {
            value.setValue(transformationMatrix[i]!);
        });

        syncTransformations();
    }

    const resetMatrix = () => {
        const toMatrix = mat4.create();
        const fromMatrix = matrix3dEnd.value.values.map((value) =>
            value.valueOf(),
        ) as mat4;

        animateUpdateMatrix(fromMatrix, toMatrix, true);
    };

    // rAF-debounced watcher for transform slider changes
    let transformUpdateScheduled = false;
    watch(
        transformSliderValues,
        () => {
            if (!transformUpdateScheduled) {
                transformUpdateScheduled = true;
                requestAnimationFrame(() => {
                    transformUpdateScheduled = false;
                    updateTransformations();

                    // Only write to the target element when the animation has
                    // never been started. When started (playing or paused),
                    // OrbitalDrag's container handles the drag transform and
                    // AnimationGroup handles the target element.
                    if (!isGroupStarted.value && targetRef.value) {
                        transformTargetsStyle(
                            {
                                transform: {
                                    matrix3d: matrix3dEnd.value,
                                },
                            },
                            [targetRef.value],
                            false,
                        );
                    }
                });
            }
        },
        { deep: true },
    );

    return {
        matrix3dStart,
        matrix3dEnd,
        transformSliderValues,
        matrixCellMeta,
        updateMatrixCell,
        resetMatrix,
        syncTransformations,
        updateTransformations,
    };
}
