import { ref } from "vue";
import { mat4 } from "gl-matrix";
import type { TransformState } from "@components/custom/orbital-drag";

/**
 * Shared cube transform state — persists across home ↔ cube scene transitions.
 * The home screen CubeTarget and CubeScene both read/write from this ref.
 */
export const sharedCubeTransform = ref<TransformState>({
    rotate: { x: 0, y: 0, z: 0 },
    translate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    matrix: mat4.create(),
});
