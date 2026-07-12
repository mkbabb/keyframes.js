<template>
    <div
        ref="sceneRoot"
        class="scene-root relative h-full w-full"
    >
        <!-- The amiga stage: ONE full-bleed WebGL canvas. The grid-room (floor +
             back-wall paper-grid), the boing ball, and its contact-shadow are all
             drawn IN the canvas (T.A10) — there is nothing on the DOM stage
             between the canvas and the page (the CRT overlay, the gesture legend,
             the parked telemetry readout, and the boot power-on flash are GONE;
             proof:stage-inventory / T.A10 census). The canvas composites over the
             themed paper-grid backdrop (renderer alpha:true). -->
        <canvas
            ref="canvas"
            class="amiga-canvas h-full w-full rounded-card"
        ></canvas>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { useIntersectionObserver, usePreferredReducedMotion } from "@vueuse/core";
import * as THREE from "three";
import { SpringProgress } from "@mkbabb/keyframes.js";
// OD-U21 / SPEC-B3 §N3 (D7) — consume value.js's LIGHT lerp primitive.
import { clamp, lerp } from "@mkbabb/value.js/math";

import { useAmigaThree } from "./useAmigaThree";
import {
    useAmigaDemo,
    SPHERE_HOME,
    FLOOR_Y,
    APEX_Y,
    SPHERE_RADIUS,
    type AmigaPose,
} from "./useAmigaDemo";
import { useSphereSpin } from "./useSphereSpin";
import { useSceneVisibilityPause } from "@composables/scene-runtime/useSceneVisibilityPause";
import { facilityFromGroup } from "@composables/scene-facility";
import { AMIGA_SCENE_ID } from "./amigaKeys";

const superKey = AMIGA_SCENE_ID;

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");
const sceneRootEl = useTemplateRef<HTMLElement>("sceneRoot");

// R.W6-decomp — the Three.js room (renderer · scene · camera · OrbitControls ·
// the boing-ball mesh · the grid-room · the managed render-on-demand present
// loop) lives in the colocated useAmigaThree sub-unit. This scene owns the
// COMPOSE — the SINGLE mesh writer (T.A7) — injected per frame via `onFrame`.
const three = useAmigaThree(canvasEl, () => onFrame());

// T.A7 — the group rides the compositor and writes a plain-vars POSE (not the
// mesh). The scene composes that pose with the additive gesture offset onto the
// mesh; the group is the only pose author, the gesture the only offset author.
const { animationGroup, pose } = useAmigaDemo();

const prm = usePreferredReducedMotion();

// A5 — the sphere is the interactive subject: a pointer-drag on the mesh spins
// it (an ADDITIVE offset), on release the engine `decay()` glide coasts the spin
// to rest. A background-grab falls through to OrbitControls (disjoint landlords).
const sphereSpin = useSphereSpin({
    getMesh: () => three.getSphere(),
    getCamera: () => three.getCamera(),
    setOrbitEnabled: (enabled) => three.setOrbitEnabled(enabled),
});

// ── The compose (T.A7 / T.A9): the ONE mesh writer ───────────────────────────
// The classic Boing spins LINEARLY about a ~16°-tilted vertical axis; the gesture
// adds a pitch/yaw offset on top. The rendered pose follows the group while it
// plays, and settles HOME through a short SpringProgress re-seat on stop (T.A8 —
// never a `position.set` teleport). The offset PERSISTS across the re-seat (the
// user's accumulated spin is preserved).
const TILT_ANGLE = 0.28; // ~16° — the authentic Boing-Ball tilt
const tiltAxis = new THREE.Vector3(
    Math.sin(TILT_ANGLE),
    Math.cos(TILT_ANGLE),
    0,
).normalize();
const qSpin = new THREE.Quaternion();
const qGesture = new THREE.Quaternion();
const eGesture = new THREE.Euler(0, 0, 0, "XYZ");
const CONTACT_FLOOR = FLOOR_Y - SPHERE_RADIUS;

// The rendered pose (what actually reaches the mesh), distinct from the group's
// composite `pose` so the re-seat can drive it home without the group stomping it.
const rendered: AmigaPose = { px: SPHERE_HOME, py: SPHERE_HOME, pz: SPHERE_HOME, spin: 0 };
let wasPlaying = false;
let reseat: SpringProgress | undefined;
const reseatFrom: AmigaPose = { px: 0, py: 0, pz: 0, spin: 0 };
let lastFrameAt = 0;

function onFrame(): boolean {
    // Advance the release glide (mutates the additive gesture offset).
    sphereSpin.tickGlide();

    const now = performance.now();
    const dt = lastFrameAt === 0 ? 16 : now - lastFrameAt;
    lastFrameAt = now;

    const playing = animationGroup.started && animationGroup.playing();

    // Stop transition (T.A8): the group just stopped/paused → settle HOME through
    // a SpringProgress re-seat (PRM snaps). The offset is left untouched.
    if (wasPlaying && !playing) {
        if (prm.value === "reduce") {
            rendered.px = SPHERE_HOME;
            rendered.py = SPHERE_HOME;
            rendered.spin = 0;
            reseat = undefined;
        } else {
            reseatFrom.px = rendered.px;
            reseatFrom.py = rendered.py;
            reseatFrom.spin = rendered.spin;
            reseat = new SpringProgress({
                initial: 0,
                response: 0.4,
                dampingFraction: 1,
            });
            reseat.target = 1;
        }
    }
    wasPlaying = playing;

    if (playing) {
        // Follow the group's composite pose (T.A7 — plain numbers, T.A6).
        rendered.px = pose.px;
        rendered.py = pose.py;
        rendered.pz = pose.pz;
        rendered.spin = pose.spin;
        reseat = undefined;
    } else if (reseat) {
        reseat.tickDt(dt);
        const p = reseat.value;
        rendered.px = lerp(reseatFrom.px, SPHERE_HOME, p);
        rendered.py = lerp(reseatFrom.py, SPHERE_HOME, p);
        rendered.spin = lerp(reseatFrom.spin, 0, p);
        if (reseat.settled) {
            rendered.px = SPHERE_HOME;
            rendered.py = SPHERE_HOME;
            rendered.spin = 0;
            reseat = undefined;
        }
    }

    // Compose: spin about the tilted axis, then the additive gesture pitch/yaw.
    const mesh = three.getSphere();
    if (mesh) {
        qSpin.setFromAxisAngle(tiltAxis, rendered.spin);
        eGesture.set(sphereSpin.offset.x, sphereSpin.offset.y, 0);
        qGesture.setFromEuler(eGesture);
        mesh.quaternion.copy(qGesture).multiply(qSpin);
        mesh.position.set(rendered.px, rendered.py, rendered.pz);
    }

    // The fake contact-shadow tracks the ball's x, scaling/fading with height.
    const shadow = three.getContactShadow();
    if (shadow) {
        const h = (rendered.py - FLOOR_Y) / (APEX_Y - FLOOR_Y); // 0 floor → 1 apex
        const t = clamp(h, 0, 1);
        shadow.position.x = rendered.px;
        shadow.position.y = CONTACT_FLOOR + 0.01;
        shadow.scale.setScalar(lerp(1, 1.9, t));
        (shadow.material as THREE.MeshBasicMaterial).opacity = lerp(0.5, 0.12, t);
    }

    // T.A12 — the scene is LIVE (force a render) while the group plays, a glide
    // is coasting, or the re-seat is settling. At rest the present loop skips the
    // render and the WebGL context idles.
    return playing || sphereSpin.isGliding() || reseat != null;
}

onMounted(() => {
    // Build the Three.js room now the canvas ref is live.
    three.setup();
    // Wire the sphere-spin gesture onto the canvas (capture-phase hit-test runs
    // before OrbitControls' own pointerdown).
    sphereSpin.attach(canvasEl.value!);

    // T.A11 — the decay() dogfood witness is a NON-DOM probe on the gesture layer
    // (the parked telemetry readout is gone). The re-armed proof:amiga-decay-
    // visible reads the coasting angular velocity here instead of a DOM readout.
    (window as unknown as Record<string, unknown>).__kfAmigaProbe = {
        omega: () => sphereSpin.angularVelocity(),
        // The rendered world pose + gesture offset (dev sampling hook, non-DOM) —
        // the physics oracles (T.A7/T.A8/T.A9) read world-unit position / spin
        // here rather than screen pixels.
        pose: () => ({
            px: rendered.px,
            py: rendered.py,
            pz: rendered.pz,
            spin: rendered.spin,
            ox: sphereSpin.offset.x,
            oy: sphereSpin.offset.y,
            playing: animationGroup.started && animationGroup.playing(),
        }),
    };
});

// B-3: pause the WebGL present loop while the tab is backgrounded.
useSceneVisibilityPause(
    () => three.running,
    () => three.stop(),
    () => three.start(),
);

// I.W3 S2 — the just-in-time occlusion pause over the live WebGL canvas: an
// IntersectionObserver stands the present loop down when the scene scrolls
// off-screen and re-arms a viewport ahead of re-entry. (The former power-on BOOT
// re-entry egg is GONE — T.A8/T.A10; this observer now owns ONLY the pause.)
useIntersectionObserver(
    sceneRootEl,
    ([entry]) => {
        if (entry?.isIntersecting) {
            three.markRenderDirty();
            three.start();
        } else {
            three.stop();
        }
    },
    { rootMargin: "200px" },
);

onBeforeUnmount(() => {
    animationGroup.stop();
    sphereSpin.detach();
    delete (window as unknown as Record<string, unknown>).__kfAmigaProbe;
    // (the Three.js room + IntersectionObserver auto-release on scope dispose)
});

const facility = facilityFromGroup(() => animationGroup);

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: amiga's REAL group members are
    // the painting channels; the legacy `animationGroup` stays for the panel
    // group. The facility's playback is the standard group adapter.
    facility,
    superKey,
});
</script>

<style scoped>
/* I.W3 S2 — the scene root carries NO `content-visibility: auto` (wrong over a
   live WebGL present loop — a per-frame ReadPixels stall). The occlusion-pause
   intent rides the IntersectionObserver above, composed with the tab-visibility
   pause. */

/* The drag/spin surface. `touch-action: none` lets the sphere-spin pointer
   gesture own touch input (no scroll/zoom hijack); a sphere-hit drag spins the
   mesh, a miss orbits the camera. `cursor: grab` advertises the manipulable
   subject. */
.amiga-canvas {
    touch-action: none;
    cursor: grab;
    /* The themed paper-grid backdrop the transparent clear composites over (a
       soft vertical wash evoking the Amiga sky/ground gradient, light/dark-aware
       via the theme tokens). */
    background: linear-gradient(
        to bottom,
        var(--muted, hsl(0 0% 96%)),
        var(--background, hsl(0 0% 100%))
    );
    /* J.W7a — the 1px inset stage-boundary hairline defining the glass stage's
       edge without a DOM layer or blocking the transparent composite. */
    box-shadow: inset 0 0 0 1px var(--border);
}
.amiga-canvas:active {
    cursor: grabbing;
}
</style>
