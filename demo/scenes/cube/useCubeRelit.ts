import { computed, type Ref } from "vue";

import type { TransformState } from "./orbital-drag";
import { clamp } from "@mkbabb/value.js/math";

/**
 * L.W11.S2 — the orientation-coupled RE-LIT die (the cube scene's instrument
 * egg), extracted from CubeTarget.vue as a colocated sub-unit (the demo
 * ≤500L-per-file decomposition discipline; proof:demo-no-oversize). The light
 * is PINNED in the room; the cube turns under it — faces toward the key light
 * brighten and catch a thin specular, faces away sink into a --background veil.
 *
 * It rides the LIVE transform model OrbitalDrag publishes per rotation
 * (syncRotationToModel) — a pure reactive `computed` off
 * `transform.value.rotate`, NOT a second rAF (inv ζ). The crayon hue is never
 * touched: the published `--lit` channel modulates LUMINANCE only
 * (proof:crayon-preserved unaffected).
 */

// The pinned key light (up-and-right-and-toward-viewer), normalized once.
const KEY_LIGHT = (() => {
    const v = [0.45, 0.6, 0.66];
    const m = Math.hypot(v[0]!, v[1]!, v[2]!);
    return [v[0]! / m, v[1]! / m, v[2]! / m] as const;
})();

const DEG = Math.PI / 180;

/** The six facet outward normals in the cube's local frame (rest pose: front
 *  toward +Z, the screen). Index-aligned to the cubeSides order. */
export const FACE_NORMALS: ReadonlyArray<readonly [number, number, number]> = [
    [0, 0, 1], // front  — +Z
    [1, 0, 0], // right  — +X
    [0, 0, -1], // back  — −Z
    [-1, 0, 0], // left  — −X
    [0, -1, 0], // top   — −Y
    [0, 1, 0], // bottom — +Y
];

/**
 * Rotate a local face normal by the die's current Euler triple (Rx·Ry·Rz, the
 * demo's quaternion↔Euler convention) into the room frame, then dot with the
 * pinned key light → a clamped 0…1 "litness". Mapped with a soft ambient floor
 * so a shadowed face never goes fully black (a re-light, not an extinguish).
 */
function litFor(n: readonly number[], r: { x: number; y: number; z: number }) {
    const rx = r.x * DEG;
    const ry = r.y * DEG;
    const rz = r.z * DEG;
    let x = n[0]!;
    let y = n[1]!;
    let z = n[2]!;
    // Rz
    let c = Math.cos(rz);
    let s = Math.sin(rz);
    [x, y] = [x * c - y * s, x * s + y * c];
    // Ry
    c = Math.cos(ry);
    s = Math.sin(ry);
    [x, z] = [x * c + z * s, -x * s + z * c];
    // Rx
    c = Math.cos(rx);
    s = Math.sin(rx);
    [y, z] = [y * c - z * s, y * s + z * c];
    const d = x * KEY_LIGHT[0] + y * KEY_LIGHT[1] + z * KEY_LIGHT[2];
    return clamp(0.5 + 0.5 * d, 0, 1);
}

export function useCubeRelit(transform: Ref<TransformState>) {
    // Per-face --lit (string for the inline style binding), recomputed reactively
    // off the live rotation — no second rAF.
    //
    // T.A5 — QUANTIZE to skip no-op repaints. Each per-face `--lit` write triggers
    // a `color-mix` + two-gradient repaint (.face-relit). The former `toFixed(3)`
    // produced a distinct 0…1 string on nearly every rotation tick, so a fine orbit
    // drag fired a per-face style INVALIDATION on essentially every pointermove.
    // Rounding to `toFixed(2)` collapses the high-frequency fine ticks of a real
    // drag onto the same rounded string, so Vue's `style.setProperty('--lit', …)`
    // re-set is a NO-OP the browser skips (setting a custom property to its current
    // value does not invalidate) — an order-of-magnitude fewer real repaints during
    // an orbit. The 1% luminance step is imperceptible, so the capture is unchanged.
    const faceLit = computed(() =>
        FACE_NORMALS.map((n) => litFor(n, transform.value.rotate).toFixed(2)),
    );

    return { faceLit };
}
