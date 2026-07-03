<template>
    <div
        ref="sceneRoot"
        class="scene-root relative h-full w-full"
    >
        <!-- J.W7a S1 (D2 / XH-3 + A-07) — the amiga slab joins the rounded-glass
             register: `rounded-card` (the SAME radius token every stage plate
             resolves — clause (f) reads it computed) + the 1px inset
             stage-boundary hairline (the scoped rule below), so the Three.js
             room reads as a framed glass stage, not a hard-edged gray slab
             bleeding into the page (cross-hierarchy #3). -->
        <canvas
            ref="canvas"
            class="amiga-canvas h-full w-full rounded-card"
            :class="{
                'amiga-canvas--boing': boinging,
                'amiga-canvas--power-on': booting,
            }"
            @dblclick="onBoing"
        ></canvas>

        <!-- L.W11.S3 — the CRT phosphor atmosphere stack (a colocated sub-unit;
             pointer-events:none so the spin/orbit gesture is untouched). The
             `booting` power-on flash + the --spin-bloom flare drive it. -->
        <AmigaCrtOverlay
            :booting="booting"
            :spin-bloom="spinBloom"
        />

        <!-- Q.WC5 S1 — the decay() telemetry: the engine's analytic glide made
             VISIBLE. Reads the angular velocity the composable already tracks
             (sampled at a few Hz into `angularVelocity`, no second integrator) —
             climbs on a drag, decays to zero over the glide (the witnessed
             decay() coast). Coexists with the CRT egg. -->
        <AmigaTelemetry :angular-velocity="angularVelocity" />
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    useTemplateRef,
} from "vue";
import { useIntersectionObserver, usePreferredReducedMotion } from "@vueuse/core";
import * as THREE from "three";

import AmigaCrtOverlay from "./AmigaCrtOverlay.vue";
import AmigaTelemetry from "./AmigaTelemetry.vue";
import { useAmigaThree } from "./useAmigaThree";
import { useAmigaAnimations, SPHERE_HOME } from "./useAmigaAnimations";
import { useAmigaBoot } from "./useAmigaBoot";
import { useSphereSpin } from "./useSphereSpin";
import { useSceneVisibilityPause } from "@app/useSceneVisibilityPause";
import { AMIGA_SUPER_KEY } from "./amigaKeys";

const superKey = AMIGA_SUPER_KEY;

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");
const sceneRootEl = useTemplateRef<HTMLElement>("sceneRoot");

// R.W6-decomp — the Three.js room (renderer · scene · camera · OrbitControls ·
// the boing-ball mesh · the managed present loop · the bounce-fit framing) lives
// in the colocated useAmigaThree sub-unit. This scene owns the EGG orchestration
// the room drives, injected per-frame via the `onFrame` hook below.
const three = useAmigaThree(canvasEl, () => onFrame());

const { animationGroup } = useAmigaAnimations(
    () => three.getSphere(),
    () => three.getBounceScale(),
);

// A5 (REBUILD): the SPHERE is the interactive subject. A pointer-drag on the
// mesh spins it; on release the engine `decay()` glide coasts the spin to rest
// — the engine driving a non-DOM Three.js target, independent of camera orbit.
// The raycast hit-test routes a sphere-grab to the spin gesture (orbit stands
// down for its duration) and a background-grab to OrbitControls (disjoint
// landlords, never racing).
// P.W5.S3 — reduced-motion gate for the flick-to-boing egg.
const prm = usePreferredReducedMotion();

const sphereSpin = useSphereSpin({
    getMesh: () => three.getSphere(),
    getCamera: () => three.getCamera(),
    setOrbitEnabled: (enabled) => three.setOrbitEnabled(enabled),
    // P.W5.S3 EGG — flick-to-boing: a hard flick of the sphere (release speed ≥
    // FLICK_BOING_RAD_S, measured inside useSphereSpin) earns the boing arc
    // without a double-click. PRM-gated; `onBoing`'s own `boinging` guard keeps
    // it from re-firing mid-arc. The dblclick path is KEPT — the flick is purely
    // additive, the discovery earned by gesture.
    onFlick: () => {
        if (prm.value === "reduce") return;
        onBoing();
    },
});

// ── EASTER EGG — "the Boing" (H.W12.S6) ──────────────────────────────────────
// Double-click the stage → the 1984 Amiga Boing Ball wakes up. The boing
// animationGroup (the X/Y/Z bounce + spin + hue cycle) is BUILT by
// useAmigaAnimations but otherwise DORMANT — the scene's live subject is the
// spin-on-drag sphere. The egg DOGFOODS that already-built engine group (inv ζ),
// then stops it and re-seats the sphere home so the scene returns to rest.
const boinging = ref(false);
let boingTimer: ReturnType<typeof setTimeout> | undefined;

// Q.WC5 S1 — the reactive angular-velocity readout the telemetry overlay binds.
// The composable OWNS the velocity; this ref is a few-Hz SNAPSHOT written from
// the present loop — a pure consumer, NEVER a second integrator. The hot path
// stays off the Vue render graph; the readout updates at TELEMETRY_HZ.
const angularVelocity = ref(0);
const TELEMETRY_HZ = 12;
let lastTelemetryAt = 0;

// R.W6-decomp — the scene's per-frame injection the present loop calls each
// frame (after controls.update(), before the render): advance the decay() spin
// glide, snapshot the angular velocity into the telemetry readout at a few Hz,
// and push the phosphor bloom toward 1 while a hard flick is still gliding.
function onFrame() {
    // Advance the engine `decay()` release glide — drives the sphere mesh
    // rotation for ≥N frames after a flick (the A5 engine-drives-mesh story).
    sphereSpin.tickGlide();
    // Q.WC5 S1 — snapshot the already-tracked angular velocity into the reactive
    // readout at a few Hz (NOT 60 Hz — the cold path). The telemetry SEES the
    // decay() coast.
    const now = performance.now();
    if (now - lastTelemetryAt >= 1000 / TELEMETRY_HZ) {
        lastTelemetryAt = now;
        angularVelocity.value = sphereSpin.angularVelocity();
    }
    // L.W11.S3 — spin → phosphor bloom: a hard flick still gliding pushes
    // --spin-bloom toward 1 (the CRT flares); it bleeds off when the glide
    // settles. Sampled INSIDE the managed present loop (no second rAF).
    const gliding = sphereSpin.isGliding();
    const target = gliding ? 1 : 0;
    spinBloom.value += (target - spinBloom.value) * 0.08;
    if (spinBloom.value < 0.002 && !gliding) spinBloom.value = 0;
}

const onBoing = () => {
    const sphereMesh = three.getSphere();
    if (boinging.value || !sphereMesh) return;
    boinging.value = true;
    // Cancel any in-flight spin glide so the boing owns the mesh cleanly.
    void animationGroup.play();
    // One boing arc (≈ the 2.1s bounce period × ~3) then settle back home — the
    // group is infinite, so we stop it on a timer and restore the rest pose.
    boingTimer = setTimeout(() => {
        animationGroup.stop();
        const m = three.getSphere();
        if (m) {
            m.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
            m.rotation.set(0, 0, 0);
            m.material.color = new THREE.Color("white");
        }
        boinging.value = false;
    }, 4200);
};

// L.W11.S3 EASTER EGG — "the power-on BOOT" (a colocated sub-unit, useAmigaBoot).
// On IntersectionObserver re-entry the page boots like a 1984 Amiga: a phosphor
// flash (the .amiga-canvas--power-on marker + the AmigaCrtOverlay flash) snaps the
// CRT on, then the SAME Boing `animationGroup` plays one wall-slam arc (inv ζ — no
// new rAF). PRM-snapped inside the composable. `booting`/`spinBloom` drive the CRT.
const { booting, spinBloom, runBoot, disposeBoot } = useAmigaBoot(
    animationGroup,
    () => three.getSphere(),
    () => boinging.value,
    (v) => (boinging.value = v),
);
// The power-on BOOT is a RE-ENTRY delight, never a cold-arrival auto-play: the
// proof:cold-entry contract holds the engine OFF until the human's dock-play. A
// per-session visited flag (sessionStorage survives the KeepAlive remount)
// excludes the first cold visit; the boot replays on every genuine return.
const AMIGA_VISITED_KEY = "kf-amiga-visited";
const amigaVisitedThisSession = (() => {
    try { return sessionStorage.getItem(AMIGA_VISITED_KEY) === "1"; }
    catch { return false; }
})();
let bootedOnce = false;

onMounted(() => {
    // Build the Three.js room now the canvas ref is live.
    three.setup();

    // Wire the sphere-spin gesture onto the canvas (capture-phase hit-test runs
    // before OrbitControls' own pointerdown).
    sphereSpin.attach(canvasEl.value!);

    // Mark amiga visited THIS session so the NEXT return fires the power-on BOOT
    // (the cold first visit is excluded — proof:cold-entry). Set AFTER mount.
    try { sessionStorage.setItem(AMIGA_VISITED_KEY, "1"); } catch { /* KEEP: private mode */ }
});

// B-3: pause the WebGL present loop while the tab is backgrounded (a hidden tab
// otherwise drives a full render per frame — pure battery waste). OrbitControls
// damping continues from rest on resume; nothing to re-base, so the sphere picks
// up exactly where it stood.
useSceneVisibilityPause(
    () => three.running,
    () => three.stop(),
    () => three.start(),
);

// I.W3 S2 (just-in-time occlusion-pause, the RIGHT primitive over a live WebGL
// canvas): an IntersectionObserver owns "is this surface visible?". When the
// scene root scrolls off-screen / is occluded by a mobile sheet, stand the WebGL
// present loop down; re-arm just before it scrolls back. A `rootMargin` pre-roll
// re-starts the loop a viewport ahead of re-entry so the first painted frame is
// fresh. This composes with the tab-visibility pause (same stop/start handles).
useIntersectionObserver(
    sceneRootEl,
    ([entry]) => {
        if (entry?.isIntersecting) {
            three.start();
            // L.W11.S3 — the power-on BOOT fires on genuine RE-entry only (NEVER
            // on the cold first arrival). The per-session visited flag gates the
            // FIRST cold mount out; the `booting`/`bootedOnce` pair keeps it a
            // once-per-entry delight. (PRM-snapped inside runBoot.)
            if (
                amigaVisitedThisSession &&
                !bootedOnce &&
                (entry.intersectionRatio ?? 0) > 0
            ) {
                bootedOnce = true;
                runBoot();
            }
        } else {
            three.stop();
            // Re-arm so the NEXT scroll-back boots again ("the gift that keeps
            // giving" — the boot replays on each genuine re-entry after the first).
            bootedOnce = false;
        }
    },
    { rootMargin: "200px" },
);

onBeforeUnmount(() => {
    if (boingTimer != null) clearTimeout(boingTimer);
    disposeBoot();
    animationGroup.stop();
    sphereSpin.detach();
    // (the Three.js room + IntersectionObserver auto-release on scope dispose)
});

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey,
});
</script>

<style scoped>
/* I.W3 S2 — the scene root carries NO `content-visibility: auto`. That CSS
   primitive is wrong over a continuously-rAF-painted WebGL canvas: the present
   loop keeps painting a subtree the compositor is told to skip, paying a
   per-frame ReadPixels GPU stall + a "rendering in a subtree hidden by
   content-visibility" warn. The occlusion-pause INTENT (stand the present loop
   down when off-screen / backgrounded) is served entirely off the event/observer
   path — an `IntersectionObserver` drives start/stop of the WebGL loop, composed
   with the tab-visibility pause. One owner of "is this surface visible?", never a
   CSS token racing the GPU. */

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
    /* J.W7a S1 (D2 / A-07) — the 1px inset stage-boundary hairline on the
       border token: the canvas formerly merged seamlessly into the page
       grid-background ("the stage boundary is ambiguous"); the hairline follows
       the rounded-card radius and defines the glass stage's edge without a DOM
       layer or blocking the transparent composite. */
    box-shadow: inset 0 0 0 1px var(--border);
}
.amiga-canvas:active {
    cursor: grabbing;
}
/* While the Boing egg arc plays, the grab cursor stands down (nothing to grab
   mid-boing — the engine owns the mesh). */
.amiga-canvas--boing {
    cursor: default;
}
/* L.W11.S3 — the once-on-enter power-on marker class on the canvas (the CRT
   flash + boot bounces ride `booting`; the CRT atmosphere stack lives in the
   colocated AmigaCrtOverlay child). Isomorphic cursor stand-down during boot. */
.amiga-canvas--power-on {
    cursor: default;
}
</style>
