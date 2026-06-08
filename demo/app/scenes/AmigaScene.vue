<template>
    <div
        ref="sceneRoot"
        class="scene-root relative h-full w-full"
    >
        <canvas
            ref="canvas"
            class="amiga-canvas h-full w-full rounded-lg"
            :class="{ 'amiga-canvas--boing': boinging }"
            @dblclick="onBoing"
        ></canvas>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { tesselateSphere } from "../../amiga/utils";
import { useAmigaAnimations, BOX_SIZE } from "../../amiga/useAmigaAnimations";
import { useSphereSpin } from "../../amiga/useSphereSpin";
import { useSceneVisibilityPause } from "../useSceneVisibilityPause";

const superKey = "Amiga";

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");
const sceneRootEl = useTemplateRef<HTMLElement>("sceneRoot");

let sphereMesh: ReturnType<typeof tesselateSphere>;
let renderer: THREE.WebGLRenderer | undefined;
let rafId: number | undefined;
let controls: OrbitControls | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;

const { animationGroup } = useAmigaAnimations(() => sphereMesh);

// A5 (REBUILD): the SPHERE is the interactive subject. A pointer-drag on the
// mesh spins it; on release the engine `decay()` glide coasts the spin to rest
// — the engine driving a non-DOM Three.js target, independent of camera orbit.
// The raycast hit-test routes a sphere-grab to the spin gesture (orbit stands
// down for its duration) and a background-grab to OrbitControls (disjoint
// landlords, never racing).
const sphereSpin = useSphereSpin({
    getMesh: () => sphereMesh,
    getCamera: () => camera,
    setOrbitEnabled: (enabled) => {
        if (controls) controls.enabled = enabled;
    },
});

// ── EASTER EGG — "the Boing" (H.W12.S6) ──────────────────────────────────────
// Double-click the stage → the 1984 Amiga Boing Ball wakes up. The boing
// animationGroup (the X/Y/Z bounce + spin + hue cycle) is BUILT by
// useAmigaAnimations but otherwise DORMANT — the scene's live subject is the
// spin-on-drag sphere. The egg DOGFOODS that already-built engine group (inv ζ:
// the engine drives the non-DOM Three.js mesh through one satisfying boing arc),
// then stops it and re-seats the sphere home so the scene returns to rest. A
// hidden, on-aesthetic trigger that resurrects the demo's own namesake.
const boinging = ref(false);
let boingTimer: ReturnType<typeof setTimeout> | undefined;
const SPHERE_HOME = -BOX_SIZE / 2 + 1;

const onBoing = () => {
    if (boinging.value || !sphereMesh) return;
    boinging.value = true;
    // Cancel any in-flight spin glide so the boing owns the mesh cleanly.
    void animationGroup.play();
    // One boing arc (≈ the 2.1s bounce period × ~3) then settle back home — the
    // group is infinite, so we stop it on a timer and restore the rest pose.
    boingTimer = setTimeout(() => {
        animationGroup.stop();
        if (sphereMesh) {
            sphereMesh.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
            sphereMesh.rotation.set(0, 0, 0);
            sphereMesh.material.color = new THREE.Color("white");
        }
        boinging.value = false;
    }, 4200);
};

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
    // S1d (H.W7) — `alpha: true` so the canvas composites over the demo's
    // themed backdrop instead of an opaque white fill. Once the mobile stage
    // goes full-bleed (fixed; inset:0), an opaque-white clear would OBLITERATE
    // the grid-bg + dark mode. The clear is now TRANSPARENT (below) and a themed
    // CSS backdrop (`.amiga-canvas` background) supplies the surround.
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
    // A2 (MEASURE-FIRST): cap the device-pixel-ratio at 2 — the former
    // `devicePixelRatio * 2` rendered a 4× CSS-pixel buffer (a 16× fragment
    // count vs. CSS pixels on a dpr=2 retina surface; 4× vs. the cap). MSAA
    // (`antialias: true`) already carries the edge quality, so the extra
    // super-sampling was pure fill-rate waste — capping to min(dpr, 2) cuts the
    // shaded fragments 4× at dpr=2 (proof:amiga-pixel-cap, getPixelRatio() ≤ 2).
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // S1d (H.W7) — THEME the clear-color before full-bleed: clear to TRANSPARENT
    // (alpha 0) so the canvas composites over the themed CSS backdrop
    // (`.amiga-canvas` background, light/dark-aware) instead of obliterating the
    // grid-bg + dark mode with an opaque white sheet. The boing-ball surround
    // (the `<box>` BackSide mesh) still renders the classic Amiga checker room;
    // only the OUTSIDE-the-room clear is themed.
    renderer.setClearColor(0xffffff, 0);

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

    // Wire the sphere-spin gesture onto the canvas (capture-phase hit-test runs
    // before OrbitControls' own pointerdown).
    sphereSpin.attach(canvas);

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
        // Advance the engine `decay()` release glide — drives the sphere mesh
        // rotation for ≥N frames after a flick (the A5 engine-drives-mesh story).
        sphereSpin.tickGlide();
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

// B-3: pause the WebGL present loop while the tab is backgrounded (a hidden tab
// otherwise drives a full render per frame — pure battery waste). OrbitControls
// damping continues from rest on resume; nothing to re-base (the render is
// clock-free), so the sphere picks up exactly where it stood.
useSceneVisibilityPause(
    () => rafId != null,
    stopRenderLoop,
    startRenderLoop,
);

// G5 (just-in-time): the scene root carries `content-visibility: auto`. When the
// browser SKIPS its render (occluded — e.g. a mobile sheet expanded over the
// stage, or scrolled off-screen) it fires `contentvisibilityautostatechange`;
// stand the WebGL present loop down then, and re-arm just before the browser
// paints it again. Composes with the tab-visibility pause above (the same
// stop/start handles) so an off-screen WebGL surface stops re-blurring. The
// event does not bubble in every engine — bound DIRECTLY on the owning element.
function onContentVisibilityChange(e: Event) {
    if ((e as Event & { skipped: boolean }).skipped) stopRenderLoop();
    else startRenderLoop();
}
// Bound via @vueuse/core's useEventListener (the inv-ζ dogfood discipline —
// auto-release on scope dispose, binds when the template ref resolves), DIRECTLY
// on the owning element because `contentvisibilityautostatechange` does not
// bubble in every engine.
useEventListener(
    sceneRootEl,
    "contentvisibilityautostatechange",
    onContentVisibilityChange,
);

onBeforeUnmount(() => {
    if (boingTimer != null) clearTimeout(boingTimer);
    animationGroup.stop();
    stopRenderLoop();
    sphereSpin.detach();
    // (the contentvisibility listener auto-releases via useEventListener)
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

<style scoped>
/* G5: content-visibility on the scene root. When this scene is occluded (a
   mobile sheet expanded over the stage, or scrolled off-screen) the browser
   skips its render work — the WebGL present loop also stands down via the
   `contentvisibilityautostatechange` listener (composing with the tab-pause).
   contain-intrinsic-size is MANDATORY here: without it the skipped root
   collapses to 0px (layout-shift); `auto … auto …` lets the browser remember
   the painted size and re-use it as the placeholder. The full-bleed stage fills
   its grid cell, so the placeholder is nominal — the auto-remembered size wins
   once painted. */
.scene-root {
    content-visibility: auto;
    contain-intrinsic-size: auto none auto 600px;
}

/* The drag/spin surface. `touch-action: none` lets the sphere-spin pointer
   gesture own touch input on the canvas (no scroll/zoom hijack) — the disjoint
   gesture model: a sphere-hit drag spins the mesh, a miss orbits the camera.

   AFFORDANCE (H.W12 frontend-design pass): the sphere is the interactive
   subject (drag to spin, release to glide) but the static checkered ball gave
   NO grab signal. `cursor: grab` advertises the manipulable surface — a
   befitting, isomorphic affordance cue (no layout/visual change, just the
   pointer hint the square scene's box already carries). */
.amiga-canvas {
    touch-action: none;
    cursor: grab;
    /* S1d (H.W7) — the THEMED backdrop the transparent clear composites over.
       Replaces the renderer's former opaque-white clear so the full-bleed mobile
       stage no longer obliterates the grid-bg + dark mode. A soft vertical wash
       evoking the Amiga sky/ground gradient (the HemisphereLight's CSS twin),
       light/dark-aware via the theme tokens. */
    background: linear-gradient(
        to bottom,
        var(--muted, hsl(0 0% 96%)),
        var(--background, hsl(0 0% 100%))
    );
}
.amiga-canvas:active {
    cursor: grabbing;
}
/* While the Boing egg arc plays, the grab cursor stands down (nothing to grab
   mid-boing — the engine owns the mesh). */
.amiga-canvas--boing {
    cursor: default;
}
</style>
