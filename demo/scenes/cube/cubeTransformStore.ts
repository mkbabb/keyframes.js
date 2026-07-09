import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import { mat4 } from "gl-matrix";
import type { TransformState } from "./orbital-drag";

/**
 * Shared cube transform state — persists across home ↔ cube scene transitions.
 * The home screen CubeTarget and CubeScene both read/write from this store.
 *
 * R.W6 C.1: bare module-level `ref` → `createGlobalState` (uniform with all
 * other stores; survives Vite HMR re-eval without state reset).
 */
export const useCubeTransform = createGlobalState(() =>
    ref<TransformState>({
        rotate: { x: 0, y: 0, z: 0 },
        translate: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        matrix: mat4.create(),
    }),
);
