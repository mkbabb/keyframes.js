<template>
    <div class="relative h-full w-full">
        <canvas
            ref="canvas"
            class="h-full w-full rounded-lg"
        ></canvas>
    </div>
</template>

<script setup lang="ts">
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { tesselateSphere } from "../../amiga/utils";
import { useAmigaAnimations, BOX_SIZE } from "../../amiga/useAmigaAnimations";
import { useSceneVisibilityPause } from "../useSceneVisibilityPause";

const superKey = "Amiga";

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");

let sphereMesh: ReturnType<typeof tesselateSphere>;
let renderer: THREE.WebGLRenderer | undefined;
let rafId: number | undefined;
let controls: OrbitControls | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;

const { animationGroup } = useAmigaAnimations(() => sphereMesh);

onMounted(() => {
    const canvas = canvasEl.value!;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000,
    );

    camera.position.z = BOX_SIZE;
    camera.position.y = BOX_SIZE / 3;
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setClearColor("white", 1);

    // Hemisphere light for natural sky/ground gradient fill
    const hemi = new THREE.HemisphereLight("white", "#b0b0b0", 1.8);
    scene.add(hemi);

    // Main spot light — top-front, soft edges for directional shadow
    const spot = new THREE.SpotLight("white", 0.6, 0, Math.PI / 2, 0.9);
    spot.position.set(0, BOX_SIZE - 1, BOX_SIZE / 2);
    scene.add(spot);

    const boxGeometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
    const boxMaterial = new THREE.MeshLambertMaterial({
        color: "rgb(220, 220, 220)",
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

    // Set renderer size to match canvas layout dimensions
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;

    startRenderLoop();
});

// Canvas resize → camera-aspect. A plain reactive DOM observer (not the
// imperative present loop) — vueuse owns its lifecycle (tryOnScopeDispose
// cleanup) and reads the owned `canvasEl` ref. The guard covers the pre-mount
// window before `camera`/`renderer` exist.
useResizeObserver(canvasEl, () => {
    if (!camera || !renderer) return;
    const w = canvasEl.value!.clientWidth;
    const h = canvasEl.value!.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
});

function startRenderLoop() {
    if (rafId != null) return;
    function animate() {
        rafId = requestAnimationFrame(animate);
        controls?.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }
    animate();
}

function stopRenderLoop() {
    if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = undefined;
    }
}

onDeactivated(() => {
    stopRenderLoop();
});

onActivated(() => {
    startRenderLoop();
});

// B-3: pause the WebGL present loop while the tab is backgrounded (a hidden tab
// otherwise drives a full render per frame — pure battery waste). OrbitControls
// damping continues from rest on resume; nothing to re-base (the render is
// clock-free), so the sphere picks up exactly where it stood.
useSceneVisibilityPause(
    () => rafId != null,
    stopRenderLoop,
    startRenderLoop,
);

onBeforeUnmount(() => {
    animationGroup.stop();
    stopRenderLoop();
    controls?.dispose();

    // Dispose all Three.js geometries and materials to free GPU memory
    scene?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose());
            } else {
                obj.material?.dispose();
            }
        }
    });

    renderer?.dispose();
});

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey,
});
</script>
