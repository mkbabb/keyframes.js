import * as THREE from "three";

import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";

const BOX_SIZE = 12;

export { BOX_SIZE };

// I.W3 S1 — the ONE centred home for the interactive subject. The sphere is the
// dominant centred subject (the room origin = the box centre = the camera look-at
// = `OrbitControls.target`); subject = orbit pivot = framing. The boing-bounce
// extents below swing SYMMETRICALLY about this home, and AmigaScene imports the
// same constant for the rest pose, so there is exactly ONE home used everywhere.
export const SPHERE_HOME = 0;

// The AUTHORED bounce amplitude — how far each axis swings from the centred
// home, kept inside the room walls (BOX_SIZE/2 = 6) so the egg arcs about the
// centred subject rather than re-cementing a far corner. J.W7a D3 (fix-round 1):
// the room walls are no longer the binding bound — the D3 protagonist frustum
// is NARROWER than the room, so the scene maps this authored amplitude through
// a per-axis frustum-fit scale (the `getBounceScale` seam below) and the
// PLAYING envelope stays inside the live frame.
export const BOUNCE = BOX_SIZE / 2 - 1;

// J.W7a D3 (fix-round 1) — the frustum-fit seam: per-axis scale factors the
// SCENE derives from its camera (subject = pivot = framing — the framing owner
// owns the fit). The transform maps every keyframed position through it about
// SPHERE_HOME, so the keyframes stay authored at ±BOUNCE while the rendered
// excursion is contained by the frame that actually shows it.
export type BounceScale = { x: number; y: number; z: number };

export const SUPER_KEY = "Amiga";

export function useAmigaAnimations(
    getSphere: () => THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>,
    getBounceScale?: () => BounceScale,
) {
    const transform = (vars: Record<string, any>) => {
        const sphereMesh = getSphere();
        if (!sphereMesh) return;
        if (vars.position) {
            const scale = getBounceScale?.();
            for (const axis of ["x", "y", "z"] as const) {
                const v = vars.position[axis];
                if (v == null) continue;
                const s = scale?.[axis] ?? 1;
                sphereMesh.position[axis] =
                    SPHERE_HOME + (v - SPHERE_HOME) * s;
            }
        }
        Object.assign(sphereMesh.rotation, vars.rotation);

        if (vars.colorT) {
            const raw = vars.colorT;
            const colorT = Array.isArray(raw) ? raw[0].value : raw;
            const color = new THREE.Color().setHSL(colorT, 1, 0.95);
            sphereMesh.material.color = color;
        }
    };

    const rotations = new CSSKeyframesAnimation({
        duration: 20000,
        iterationCount: Infinity,
        timingFunction: "cubic-bezier(0.2, 0.65, 0.6, 1)",
    }).fromVars(
        [
            {
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                colorT: 0,
            },
            {
                rotation: {
                    x: 2 * Math.PI,
                    y: 2 * Math.PI,
                    z: 2 * Math.PI,
                },
                colorT: 1,
            },
        ],
        transform,
    );

    const bouncingX = new CSSKeyframesAnimation({
        duration: 10000,
        iterationCount: Infinity,
        direction: "alternate",
        timingFunction: "linear",
    }).fromKeyframes(
        {
            "0%": { position: { x: SPHERE_HOME - BOUNCE } },
            "25%": { position: { x: SPHERE_HOME + BOUNCE } },
            "50%": { position: { x: SPHERE_HOME - BOUNCE } },
            "75%": { position: { x: SPHERE_HOME + BOUNCE } },
            "100%": { position: { x: SPHERE_HOME - BOUNCE } },
        },
        transform,
    );

    const bouncingY = new CSSKeyframesAnimation({
        duration: 700,
        iterationCount: Infinity,
        direction: "alternate",
        timingFunction: "cubic-bezier(0.2, 0.65, 0.6, 1)",
    }).fromVars(
        [
            {
                position: {
                    y: SPHERE_HOME - BOUNCE,
                },
            },

            {
                position: {
                    y: SPHERE_HOME + BOUNCE,
                },
            },
        ],
        transform,
    );

    const bouncingZ = new CSSKeyframesAnimation({
        duration: 20000,
        iterationCount: Infinity,
        direction: "alternate",
        timingFunction: "linear",
    }).fromKeyframes(
        {
            "0%": { position: { z: SPHERE_HOME - BOUNCE } },
            "25%": { position: { z: SPHERE_HOME + BOUNCE } },
            "50%": { position: { z: SPHERE_HOME - BOUNCE } },
            "75%": { position: { z: SPHERE_HOME + BOUNCE } },
            "100%": { position: { z: SPHERE_HOME - BOUNCE } },
        },
        transform,
    );

    rotations.name = "Rotations";
    rotations.superKey = SUPER_KEY;
    bouncingX.name = "Bouncing X";
    bouncingX.superKey = SUPER_KEY;
    bouncingY.name = "Bouncing Y";
    bouncingY.superKey = SUPER_KEY;
    bouncingZ.name = "Bouncing Z";
    bouncingZ.superKey = SUPER_KEY;

    const animationGroup = new AnimationGroup(
        rotations,
        bouncingX,
        bouncingY,
        bouncingZ,
    );

    // Force per-animation transform path — the grouped path passes flat ValueUnit
    // values which don't match the nested object structure our transform expects.
    animationGroup.singleTarget = false;

    return { animationGroup, rotations, bouncingX, bouncingY, bouncingZ };
}
