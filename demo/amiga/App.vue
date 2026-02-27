<template>
    <div class="container">
        <AnimationControlsGroup :animation-group="animationGroup" />
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { CSSKeyframesAnimation } from "@src/animation";
import { AnimationGroup } from "@src/animation/group";
import { CSSCubicBezier } from "@src/easing";
import { AnimationControlsGroup } from "@components/custom/animation-controls/";

import "@styles/style.css";

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");

const tesselateSphere = (color1: string, color2: string, radius: number) => {
    const tileSize = 64;
    const boardSize = tileSize * 16;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = boardSize;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.fillStyle = color2;
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if ((x + y) % 2 === 0) {
                ctx.fillRect(x * 64, y * 64, 64, 64);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({
        map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);

    const uvs: number[] = [];
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
        const v = 0.5 - Math.asin(y) / Math.PI;

        uvs.push(u, v);
    }

    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return mesh;
};

let sphereMesh: ReturnType<typeof tesselateSphere>;
const boxSize = 12;

const transform = (vars: Record<string, any>) => {
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
        "0%": { position: { x: -boxSize / 2 + 1 } },
        "25%": { position: { x: boxSize / 2 - 1 } },
        "50%": { position: { x: -boxSize / 2 + 1 } },
        "75%": { position: { x: boxSize / 2 - 1 } },
        "100%": { position: { x: -boxSize / 2 + 1 } },
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
                y: -boxSize / 2 + 1,
            },
        },

        {
            position: {
                y: boxSize / 4 - 1,
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
        "0%": { position: { z: -boxSize / 2 + 1 } },
        "25%": { position: { z: boxSize / 2 - 1 } },
        "50%": { position: { z: -boxSize / 2 + 1 } },
        "75%": { position: { z: boxSize / 2 - 1 } },
        "100%": { position: { z: -boxSize / 2 + 1 } },
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

onMounted(() => {
    const canvas = canvasEl.value!;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000,
    );

    camera.position.z = boxSize;
    camera.position.y = boxSize / 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setClearColor("white", 1);

    const light = new THREE.SpotLight("white", 0.75, 0, Math.PI / 2, 1);
    light.position.set(0, boxSize - 1, boxSize / 2);

    scene.add(light);

    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

    const boxMaterial = new THREE.MeshLambertMaterial({
        color: "rgb(128, 128, 128)",
        side: THREE.BackSide,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(0, 0, 0);
    scene.add(boxMesh);

    sphereMesh = tesselateSphere("white", "red", 1);
    sphereMesh.position.set(-boxSize / 2 + 1, -boxSize / 2 + 1, -boxSize / 2 + 1);
    scene.add(sphereMesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    animate();
});
</script>

<style>
body {
    background-size: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%202%202%22%3E%3Cpath%20d%3D%22M1%202V0h1v1H0v1z%22%20fill-opacity%3D%22.05%22%2F%3E%3C%2Fsvg%3E");
}

.container {
    --padding: 0.5rem;
    display: grid;
    padding: var(--padding);

    width: 100%;
    height: 100%;

    grid-template-areas: "animation-controls animation";
    grid-template-columns: 25% 1fr;

    gap: 1rem;
    overflow: hidden;
}

canvas {
    background-color: #fff;
    height: 100%;
    width: 100%;

    grid-area: animation;
}
</style>
