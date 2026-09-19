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
             proof:stage-inventory / T.A10 census). The canvas composites over
             the SHELL's themed paper-grid backdrop (`.grid-background`, fixed
             behind every scene) — renderer alpha:true, and since KF.W6 nothing
             of this scene's own paints over it (see the stage-surface block
             below). `rounded-card` on a raw element is this tree's only such
             site and is RETAINED for now: with the wash gone it rounds only the
             stage boundary, and whether a full-bleed mobile layer should carry
             card chrome at all is a rendered-silhouette verdict, KF.W9's. -->
        <canvas
            ref="canvas"
            class="amiga-canvas h-full w-full rounded-card"
        ></canvas>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { useIntersectionObserver, usePreferredReducedMotion } from "@vueuse/core";
import * as THREE from "three";
// OD-U21 / SPEC-B3 §N3 (D7) — consume value.js's LIGHT lerp primitive.
import { clamp, lerp } from "@mkbabb/value.js/math";

import { useAmigaThree } from "./useAmigaThree";
import {
    useAmigaDemo,
    createPoseContinuity,
    SPHERE_HOME,
    FLOOR_Y,
    APEX_Y,
    SPHERE_RADIUS,
    type AmigaPose,
    type PoseOffset,
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

// T.A7 — the group rides the compositor and writes an authored POSE (not the
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
// D-1 — the pose the compose last CONSUMED. The group authors `pose` in two
// ways, and only one of them used to reach the stage: a played frame, and a
// SCRUB — `setChildTime(anim, t).render()`, the transport's own seam
// (scene-facility/index.ts), which runs this group's `transform` exactly as a
// played frame does. Comparing the live pose against this record is how the
// scene sees the second kind at all.
const lastPose: AmigaPose = { px: SPHERE_HOME, py: SPHERE_HOME, pz: SPHERE_HOME, spin: 0 };

/**
 * D-1 (BLOCKER) — WHO owns the rendered pose this frame.
 *
 * `"pose"`: the group authored it — a played frame, or a user seek while the
 * transport is paused. `"home"`: the group has stopped and the user has not
 * re-authored a pose since, so the stage settles to the centred home (T.A8).
 *
 * The compose used to have no such state: it read `pose` ONLY inside the
 * `playing` branch, so a paused stage was pinned to HOME — the scrubber moved,
 * the pose moved, and the subject did not. The gate was DOUBLED, too: even had
 * the compose read the scrubbed pose, `onFrame` reported the scene dead at rest
 * and the render-on-demand loop discarded the frame. Both edges are below.
 */
type PoseAuthority = "pose" | "home";
let authority: PoseAuthority = "home";
let wasPlaying = false;
let lastFrameAt = 0;

// D-3 + C-18 + M-3 + L-M4/C-2 — the per-channel continuity lanes (useAmigaDemo).
// The stage renders `authority + offset`; the offset is the discontinuity a seam
// introduced and each lane decays ITS OWN channel to zero, seeded with that
// channel's own entry velocity. Allocated ONCE and re-seeded per seam (L-i3).
const continuity = createPoseContinuity();
const seamGap: PoseOffset = { px: 0, py: 0, spin: 0 };
const seamVelocity: PoseOffset = { px: 0, py: 0, spin: 0 };
// The rendered pose one frame back + its measured per-channel velocity (u/s).
const prevRendered: PoseOffset = { px: SPHERE_HOME, py: SPHERE_HOME, spin: 0 };
const renderedVelocity: PoseOffset = { px: 0, py: 0, spin: 0 };

// C-18 / M-3 — the frame delta is BOUNDED. `lastFrameAt` was never re-armed
// across a stop/start, so the first frame after a backgrounded tab handed the
// analytic spring the WHOLE suspend as one dt and it evaluated straight to its
// settled value: a one-frame teleport, the T.A8 contract's own failure mode.
// The clock is re-armed wherever the loop restarts AND the delta is clamped, so
// no single frame can integrate more than a few frames' worth of motion.
const NOMINAL_FRAME_MS = 16;
const MAX_FRAME_MS = 64;

/** Re-arm the frame clock (any path that restarts the present loop). */
const armFrameClock = (): void => {
    lastFrameAt = 0;
};

/** True when the group has written a NEW pose since the last composed frame. */
const poseMoved = (): boolean =>
    pose.px !== lastPose.px ||
    pose.py !== lastPose.py ||
    pose.pz !== lastPose.pz ||
    pose.spin !== lastPose.spin;

function onFrame(): boolean {
    // L-m6 — the glide's liveness is the value `tickGlide()` RETURNS. The scene
    // used to drop that return on the floor and re-derive the answer from
    // `isGliding()`, which reports the SAMPLER'S EXISTENCE — one frame stale
    // against the delta just composed (L-i6's discarded final delta is the same
    // seam, and it is closed by reading the return the function documents).
    const gliding = sphereSpin.tickGlide();
    // L-B1 (BLOCKER) — the primary gesture's OWN edge on the render gate.
    // `isDragging()` existed and nothing consulted it: the drag wrote the
    // additive offset, the compose wrote the quaternion, and the present loop
    // discarded every frame of it — the ball did not turn under the finger.
    const dragging = sphereSpin.isDragging();

    const now = performance.now();
    const dt =
        lastFrameAt === 0
            ? NOMINAL_FRAME_MS
            : Math.min(now - lastFrameAt, MAX_FRAME_MS);
    lastFrameAt = now;
    const dtSeconds = dt / 1000;

    const playing = animationGroup.started && animationGroup.playing();
    // D-1 — a SCRUB is the group authoring a pose while the transport is stopped.
    const scrubbed = !playing && poseMoved();

    // The group owns the stage while it plays AND after any seek; HOME owns it
    // once the group has stopped with no seek since (T.A8).
    const nextAuthority: PoseAuthority =
        playing || scrubbed ? "pose" : wasPlaying ? "home" : authority;
    const targetPx = nextAuthority === "pose" ? pose.px : SPHERE_HOME;
    const targetPy = nextAuthority === "pose" ? pose.py : SPHERE_HOME;
    const targetSpin = nextAuthority === "pose" ? pose.spin : 0;

    if (nextAuthority !== authority) {
        // A SEAM. Hand the lanes the discontinuity this switch introduces — the
        // value gap and the velocity gap, per channel — and the composed stage
        // leaves the seam exactly where it entered it, still moving as it was.
        // The authority's own velocity counts only while the group PLAYS: a
        // scrubbed pose is a position the user chose, not a motion (treating a
        // seek's apparent rate as physics would fling the ball).
        authority = nextAuthority;
        if (prm.value === "reduce") {
            continuity.snap();
        } else {
            const poseVelPx = playing ? (pose.px - lastPose.px) / dtSeconds : 0;
            const poseVelPy = playing ? (pose.py - lastPose.py) / dtSeconds : 0;
            const poseVelSpin = playing
                ? (pose.spin - lastPose.spin) / dtSeconds
                : 0;
            seamGap.px = rendered.px - targetPx;
            seamGap.py = rendered.py - targetPy;
            seamGap.spin = rendered.spin - targetSpin;
            seamVelocity.px = renderedVelocity.px - poseVelPx;
            seamVelocity.py = renderedVelocity.py - poseVelPy;
            seamVelocity.spin = renderedVelocity.spin - poseVelSpin;
            continuity.seed(seamGap, seamVelocity);
        }
    }
    wasPlaying = playing;

    continuity.tick(dt);
    rendered.px = targetPx + continuity.offset.px;
    rendered.py = targetPy + continuity.offset.py;
    rendered.pz = nextAuthority === "pose" ? pose.pz : SPHERE_HOME;
    rendered.spin = targetSpin + continuity.offset.spin;

    renderedVelocity.px = (rendered.px - prevRendered.px) / dtSeconds;
    renderedVelocity.py = (rendered.py - prevRendered.py) / dtSeconds;
    renderedVelocity.spin = (rendered.spin - prevRendered.spin) / dtSeconds;
    prevRendered.px = rendered.px;
    prevRendered.py = rendered.py;
    prevRendered.spin = rendered.spin;

    lastPose.px = pose.px;
    lastPose.py = pose.py;
    lastPose.pz = pose.pz;
    lastPose.spin = pose.spin;

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

    // T.A12 — the scene declares itself LIVE (forcing a render) while the group
    // plays, the user SCRUBS a paused stage (D-1's second edge — the transport's
    // seat never marks the room dirty, so the frame that consumes a seek must
    // say so itself), the user DRAGS the subject (L-B1), a glide is coasting, or
    // a seam is still settling. At rest the present loop skips the render.
    return playing || scrubbed || dragging || gliding || continuity.live;
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

// B-3: pause the WebGL present loop while the tab is backgrounded. C-18 — the
// frame clock is RE-ARMED on the way back in: the first frame after a suspend
// must not hand the continuity lanes the whole background window as one dt.
useSceneVisibilityPause(
    () => three.running,
    () => three.stop(),
    () => {
        armFrameClock();
        three.start();
    },
);

// I.W3 S2 — the just-in-time occlusion pause over the live WebGL canvas: an
// IntersectionObserver stands the present loop down when the scene scrolls
// off-screen and re-arms a viewport ahead of re-entry. (The former power-on BOOT
// re-entry egg is GONE — T.A8/T.A10; this observer now owns ONLY the pause.)
useIntersectionObserver(
    sceneRootEl,
    ([entry]) => {
        if (entry?.isIntersecting) {
            armFrameClock();
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
    /* KF.W6 W6-H — THE STAGE SURFACE, decided once (MISSED-B · D-10 · C-7).
       The renderer clears to TRANSPARENT (alpha:true) expressly so the stage
       composites over "the themed paper-grid backdrop" the template comment
       names. That backdrop is the SHELL's — `.grid-background`, the J.W7a
       two-tier engineering graph paper fixed behind every scene, whose own
       rationale guarantees it stays "PRESENT and legible behind the glass
       plate". This element used to paint its OWN opaque two-stop wash here
       (--muted → --background) and erase it across the whole stage — desktop
       and full-bleed mobile alike — so the one scene that clears to transparent
       was the one scene the substrate never reached. It is REMOVED rather than
       tuned: the wash had no grid in it despite the comment, it measured as a
       flat field in the light arm, and its polarity INVERTED between themes
       because its two stops are neutrals that swap order — one authored intent,
       two opposite renderings, and no translucency setting fixes a sign. The
       transparent composite now lands on the real substrate, which is what both
       the clear colour and the comment already promised. Its two dead fallback
       arms go with it (both tokens ship; the arms were achromatic and
       light-only — the tree's sole such idiom, C-7). Perceptual verdict on the
       restored stage: KF.W9.

       EVALUATED, NOT SWAPPED (C-6/D-12 ≡ census S-9): glass ships `Surface`,
       `PaperBackdrop` and the sibling register's `Card`, and every one of them
       is a DOM LAYER — which this scene's own `:6-12` ruling forecloses ("there
       is nothing on the DOM stage between the canvas and the page"). The
       reduction that ruling does admit is a shared `.stage-plate` RECIPE, and a
       shared recipe belongs in the demo's own sheet, not in one scene's scoped
       block; it is routed there rather than re-authored here. */
    /* J.W7a — the 1px inset stage-boundary hairline defining the glass stage's
       edge without a DOM layer or blocking the transparent composite. It reads
       the producer's LOAD-BEARING surface boundary (--control-surface-border →
       --glass-border-floating), not the decorative --border it used to: this
       edge is the only thing that says where the stage ends, and the bank
       measures the decorative rung below the non-text floor in BOTH arms, worse
       in light (MISSED-D). The rung is the producer's, so nothing is
       re-authored demo-side. */
    box-shadow: inset 0 0 0 1px var(--control-surface-border);
}
.amiga-canvas:active {
    cursor: grabbing;
}
</style>
