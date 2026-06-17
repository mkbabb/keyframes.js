import { computed, ref, watch, type Ref } from "vue";

import type { TransformState } from "@components/custom/orbital-drag";

/**
 * L.W11.S2 — the orientation-coupled RE-LIT die (the cube scene's instrument
 * egg), extracted from CubeTarget.vue as a colocated sub-unit (the demo
 * ≤500L-per-file decomposition discipline; proof:demo-no-oversize). The light
 * is PINNED in the room; the cube turns under it — faces toward the key light
 * brighten and catch a thin specular, faces away sink into a --background veil.
 *
 * It rides the LIVE transform model OrbitalDrag publishes per rotation
 * (syncRotationToModel) — a pure reactive `computed`/`watch` off
 * `transform.value.rotate`, NOT a second rAF (inv ζ). The crayon hue is never
 * touched: the published `--lit`/`--spin-energy` channels modulate LUMINANCE
 * only (proof:crayon-preserved unaffected).
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
    return Math.max(0, Math.min(1, 0.5 + 0.5 * d));
}

export function useCubeRelit(transform: Ref<TransformState>) {
    // Per-face --lit (string for the inline style binding), recomputed reactively
    // off the live rotation — no second rAF.
    const faceLit = computed(() =>
        FACE_NORMALS.map((n) => litFor(n, transform.value.rotate).toFixed(3)),
    );

    // The live attitude readout (rounded degrees; the chip wears .readout-accent).
    const euler = computed(() => ({
        x: Math.round(transform.value.rotate.x),
        y: Math.round(transform.value.rotate.y),
        z: Math.round(transform.value.rotate.z),
    }));

    // --spin-energy (0…1) — the velocity-coupled atmosphere. Derived REACTIVELY
    // from the per-tick rotation-delta magnitude (no rAF: the model already ticks
    // on every rotation). It lifts a faint bloom + drop-shadow while the die
    // turns; the dblclick ROLL flashes it to 1 on landing (the "thunk").
    const spinEnergy = ref(0);
    let lastRot = { x: 0, y: 0, z: 0 };
    watch(
        () => transform.value.rotate,
        (r) => {
            const d =
                Math.abs(r.x - lastRot.x) +
                Math.abs(r.y - lastRot.y) +
                Math.abs(r.z - lastRot.z);
            lastRot = { x: r.x, y: r.y, z: r.z };
            const next = Math.min(1, d / 12);
            if (next > spinEnergy.value) spinEnergy.value = next;
            else spinEnergy.value = spinEnergy.value * 0.82;
        },
        { deep: true },
    );

    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    /** The roll-landing THUNK: flash --spin-energy to 1, then let it bleed off. */
    const flashRoll = () => {
        if (flashTimer != null) clearTimeout(flashTimer);
        flashTimer = setTimeout(() => {
            spinEnergy.value = 1;
            flashTimer = setTimeout(() => {
                spinEnergy.value = 0;
            }, 260);
        }, 900);
    };
    const disposeFlash = () => {
        if (flashTimer != null) clearTimeout(flashTimer);
    };

    return { faceLit, euler, spinEnergy, flashRoll, disposeFlash };
}
