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

import { AnimationControlsGroup } from "@components/custom/animation-controls/";

import "@styles/style.css";

import { tesselateSphere } from "./utils";
import { useAmigaAnimations, BOX_SIZE } from "./useAmigaAnimations";

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");

let sphereMesh: ReturnType<typeof tesselateSphere>;

const { animationGroup } = useAmigaAnimations(() => sphereMesh);

onMounted(() => {
    const canvas = canvasEl.value!;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000,
    );

    camera.position.z = BOX_SIZE;
    camera.position.y = BOX_SIZE / 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setClearColor("white", 1);

    const light = new THREE.SpotLight("white", 0.75, 0, Math.PI / 2, 1);
    light.position.set(0, BOX_SIZE - 1, BOX_SIZE / 2);

    scene.add(light);

    const boxGeometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);

    const boxMaterial = new THREE.MeshLambertMaterial({
        color: "rgb(128, 128, 128)",
        side: THREE.BackSide,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(0, 0, 0);
    scene.add(boxMesh);

    sphereMesh = tesselateSphere("white", "red", 1);
    sphereMesh.position.set(
        -BOX_SIZE / 2 + 1,
        -BOX_SIZE / 2 + 1,
        -BOX_SIZE / 2 + 1,
    );
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
