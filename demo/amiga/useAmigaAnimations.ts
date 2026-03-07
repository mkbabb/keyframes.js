import * as THREE from "three";

import { CSSKeyframesAnimation } from "@src/animation";
import { AnimationGroup } from "@src/animation/group";
import { CSSCubicBezier } from "@src/easing";

const BOX_SIZE = 12;

export { BOX_SIZE };

export function useAmigaAnimations(getSphere: () => THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>) {
    const transform = (vars: Record<string, any>) => {
        const sphereMesh = getSphere();
        Object.assign(sphereMesh.position, vars.position);
        Object.assign(sphereMesh.rotation, vars.rotation);

        if (vars.colorT) {
            const colorT = vars.colorT.values[0].value;
            const color = new THREE.Color().setHSL(colorT, 1, 0.95);
            sphereMesh.material.color = color;
        }
    };

    const rotations = new CSSKeyframesAnimation({
        duration: 20000,
        iterationCount: Infinity,
        timingFunction: CSSCubicBezier(0.2, 0.65, 0.6, 1),
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
        timingFunction: CSSCubicBezier(0.2, 0.65, 0.6, 1),
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
    bouncingX.name = "Bouncing X";
    bouncingY.name = "Bouncing Y";
    bouncingZ.name = "Bouncing Z";

    const animationGroup = new AnimationGroup(
        rotations,
        bouncingX,
        bouncingY,
        bouncingZ,
    );

    return { animationGroup, rotations, bouncingX, bouncingY, bouncingZ };
}
