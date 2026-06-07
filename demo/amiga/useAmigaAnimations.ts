import * as THREE from "three";

import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";

const BOX_SIZE = 12;

export { BOX_SIZE };

export const SUPER_KEY = "Amiga";

export function useAmigaAnimations(getSphere: () => THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>) {
    const transform = (vars: Record<string, any>) => {
        const sphereMesh = getSphere();
        if (!sphereMesh) return;
        Object.assign(sphereMesh.position, vars.position);
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
            "0%": { position: { x: -BOX_SIZE / 2 + 1 } },
            "25%": { position: { x: BOX_SIZE / 2 - 1 } },
            "50%": { position: { x: -BOX_SIZE / 2 + 1 } },
            "75%": { position: { x: BOX_SIZE / 2 - 1 } },
            "100%": { position: { x: -BOX_SIZE / 2 + 1 } },
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
                    y: -BOX_SIZE / 2 + 1,
                },
            },

            {
                position: {
                    y: BOX_SIZE / 4 - 1,
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
            "0%": { position: { z: -BOX_SIZE / 2 + 1 } },
            "25%": { position: { z: BOX_SIZE / 2 - 1 } },
            "50%": { position: { z: -BOX_SIZE / 2 + 1 } },
            "75%": { position: { z: BOX_SIZE / 2 - 1 } },
            "100%": { position: { z: -BOX_SIZE / 2 + 1 } },
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
