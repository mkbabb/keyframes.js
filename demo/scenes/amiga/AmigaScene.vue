<template>
    <div
        ref="sceneRoot"
        class="scene-root relative h-full w-full"
    >
        <!-- The amiga stage: ONE full-bleed WebGL canvas. The grid-room (floor +
             back-wall paper-grid), the boing ball and its contact-shadow are all
             drawn IN the canvas, and nothing stands on the DOM stage between the
             canvas and the page (T.A10). The canvas composites over the SHELL's
             themed paper-grid backdrop (`.grid-background`, fixed behind every
             scene) — renderer alpha:true, and nothing of this scene's own paints
             over it. `rounded-card` on a raw element is this tree's only such
             site and is RETAINED: with the wash gone it rounds only the stage
             boundary, and whether a full-bleed mobile layer should carry card
             chrome at all is a rendered-silhouette verdict, KF.W9's.
             (D-13/L-i7 — the removal changelog that used to live in this
             template, naming four deleted DOM layers a reader cannot see, is
             gone: a rendered template states what IS. The deletions live in the
             tranche record that made them.) -->
        <!-- D-2 — THE SUBJECT IS OPERABLE AND NAMED. The rendered DOM was one
             bare `<canvas>`: no role, no accessible name, no tabindex, no
             keydown, no fallback content, both interactions pointer-only — while
             the in-repo counter-example (SquareScene's `role="group"` subject
             with its two axis sliders) sat one directory away, and the Suspense
             skeleton was more accessible than the scene it loads. The idiom here
             is BORROWED from that landed cure (X.KF.W11.b, `3af1422b`), not
             re-invented: the subject is the `role="group"` container, its
             `aria-keyshortcuts` publishes the bindings, `aria-describedby`
             points at a real description, and TWO `role="slider"` children carry
             the per-axis WCAG 4.1.2 contract — a single scalar slider is a lossy
             misrepresentation of a two-axis spin.

             The children are the canvas's FALLBACK CONTENT: the accessible
             subtree of a replaced element, which the browser never paints. That
             is the whole of the a11y layer's cost here — no DOM layer joins the
             stage, so the scene's own `:6-18` stage-inventory ruling stands.

             MISSED-A, declared not glossed: on TOUCH there is still no VISIBLE
             affordance for the drag — `cursor: grab` is a desktop-only story and
             the gesture legend was deleted at T.A10. The two shapes that would
             fix it are (i) a DOM layer on the stage, which the ruling above
             forecloses, and (ii) an in-canvas painted legend, which is a
             taste act inside the grid-room composition (PENDING-OWNER). This
             seat opens the AT channel and routes the visible-affordance half
             rather than re-opening a ruling it does not own; SS-13 confirms
             on-device. -->
        <canvas
            ref="canvas"
            class="amiga-canvas kf-focus-ring h-full w-full rounded-card"
            :class="{ 'amiga-canvas--unavailable': roomFailed }"
            role="group"
            :aria-label="
                roomFailed
                    ? 'The Boing ball stage is unavailable — this browser gave the page no WebGL context'
                    : 'Spin the Boing ball — drag it, or nudge it with the arrow keys'
            "
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Home"
            :aria-describedby="keyboardHelpId"
            tabindex="0"
            @keydown="onKeydown"
        >
            <span :id="keyboardHelpId">
                Arrow keys spin the ball a sixteenth of a turn; hold Shift for a
                fine nudge; Home returns it to its rest attitude. A pointer drag
                spins it too, and on release the spin coasts to rest.
            </span>
            <span
                role="slider"
                aria-label="Yaw — the spin about the ball's vertical axis"
                aria-orientation="horizontal"
                aria-valuemin="-180"
                aria-valuemax="180"
                :aria-valuenow="spinNow.yaw"
                :aria-valuetext="`yaw ${spinNow.yaw}°`"
            />
            <span
                role="slider"
                aria-label="Pitch — the spin about the ball's horizontal axis"
                aria-orientation="vertical"
                aria-valuemin="-180"
                aria-valuemax="180"
                :aria-valuenow="spinNow.pitch"
                :aria-valuetext="`pitch ${spinNow.pitch}°`"
            />
        </canvas>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, useId, useTemplateRef } from "vue";
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
    type AmigaPose,
    type PoseOffset,
} from "./useAmigaDemo";
import { useSphereSpin } from "./useSphereSpin";
import { useSceneVisibilityPause } from "@composables/scene-runtime/useSceneVisibilityPause";
import { facilityFromGroup } from "@composables/scene-facility";
import { AMIGA_SCENE_ID } from "./amigaKeys";

/** The dev-only sampling probe's shape (L-M3/C-11 — the `__kfLoaf` idiom). */
interface AmigaProbe {
    /** The gesture layer's current angular speed (rad/s). */
    omega(): number;
    /** The rendered world pose + the additive gesture offset. */
    pose(): {
        px: number;
        py: number;
        spin: number;
        ox: number;
        oy: number;
        playing: boolean;
    };
}
declare global {
    interface Window {
        __kfAmigaProbe?: AmigaProbe;
    }
}

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
// D-8 — the room's failure state (no WebGL, a refused context, a lost context).
// The subject's affordances must not outlive the object they advertise.
const roomFailed = three.failed;

const sphereSpin = useSphereSpin({
    getMesh: () => three.getSphere(),
    getCamera: () => three.getCamera(),
    setOrbitEnabled: (enabled) => three.setOrbitEnabled(enabled),
});

// ── D-2: the subject's keyboard route + its per-axis read-out ────────────────
/** The id the canvas's `aria-describedby` points at (its own fallback content). */
const keyboardHelpId = useId();

/** A sixteenth of a turn per press; a sixtieth with Shift (the fine nudge). */
const NUDGE_RAD = Math.PI / 8;
const FINE_NUDGE_RAD = Math.PI / 30;

// The per-axis `aria-valuenow`, in DEGREES wrapped to (−180, 180]. Written at
// the few-Hz cadence the keyboard/pointer gestures END at — never on the 60 Hz
// paint loop, which would put Vue work on the hot path for a value no one reads
// between announcements (the SquareScene read-out discipline, borrowed).
const spinNow = reactive({ yaw: 0, pitch: 0 });

const wrapDegrees = (radians: number): number => {
    const deg = (radians * 180) / Math.PI;
    return Math.round(((((deg + 180) % 360) + 360) % 360) - 180);
};

const syncSpinReadout = (): void => {
    spinNow.yaw = wrapDegrees(sphereSpin.offset.y);
    spinNow.pitch = wrapDegrees(sphereSpin.offset.x);
};

// A keyboard nudge is a ONE-FRAME render edge, declared the same way the scrub
// edge is (the scene reports its own liveness; the room never guesses).
let keyboardEdge = false;

function onKeydown(event: KeyboardEvent): void {
    const step = event.shiftKey ? FINE_NUDGE_RAD : NUDGE_RAD;
    let pitch = 0;
    let yaw = 0;
    switch (event.key) {
        case "ArrowLeft":
            yaw = -step;
            break;
        case "ArrowRight":
            yaw = step;
            break;
        case "ArrowUp":
            pitch = -step;
            break;
        case "ArrowDown":
            pitch = step;
            break;
        case "Home":
            sphereSpin.rest();
            break;
        default:
            return;
    }
    if (pitch !== 0 || yaw !== 0) sphereSpin.nudge(pitch, yaw);
    syncSpinReadout();
    keyboardEdge = true;
    event.preventDefault();
}

// ── The compose (T.A7 / T.A9): the ONE mesh writer ───────────────────────────
// The classic Boing spins LINEARLY about a ~16°-tilted vertical axis; the gesture
// adds a pitch/yaw offset on top. The rendered pose follows the group while it
// plays or while the user scrubs it, and settles HOME through the continuity
// lanes when the group stops (T.A8 — never a `position.set` teleport). The offset
// PERSISTS across every seam (the user's accumulated spin is preserved).
//
// C-17 — the ORDERING contract, which the T.A7 apparatus specified WHO for and
// never WHEN. Two independent `RAFPlayback` loops meet at `pose`: the group's
// writes it, this one reads it, and they are not phase-locked. So the pose this
// compose reads is the last one the group WROTE, which may be from the previous
// frame — bounded at one frame, never torn (a pose is written field-by-field
// within a single synchronous transform call, and read the same way). The
// authority machine below compares VALUES, so a repeated pose is indistinguishable
// from a still one, which is exactly the right reading of both.
// MISSED-I — the spin is an AESTHETIC choice, not a rolling derivation. A true
// roll across the 10-unit crossing would turn 10 rad; the authored peak is ±π,
// a 3.18× slip. The comments around it frame the motion physically, so this one
// says plainly that the ball slides: recorded so no later reader tunes the
// keyframes in search of a derivation that was never made.
const TILT_ANGLE = 0.28; // ~16° — the authentic Boing-Ball tilt
const tiltAxis = new THREE.Vector3(
    Math.sin(TILT_ANGLE),
    Math.cos(TILT_ANGLE),
    0,
).normalize();
const qSpin = new THREE.Quaternion();
const qGesture = new THREE.Quaternion();
const eGesture = new THREE.Euler(0, 0, 0, "XYZ");

// The rendered pose (what actually reaches the mesh), distinct from the group's
// composite `pose` so the re-seat can drive it home without the group stomping it.
const rendered: AmigaPose = { px: SPHERE_HOME, py: SPHERE_HOME, spin: 0 };
// D-1 — the pose the compose last CONSUMED. The group authors `pose` in two
// ways, and only one of them used to reach the stage: a played frame, and a
// SCRUB — `setChildTime(anim, t).render()`, the transport's own seam
// (scene-facility/index.ts), which runs this group's `transform` exactly as a
// played frame does. Comparing the live pose against this record is how the
// scene sees the second kind at all.
const lastPose: AmigaPose = { px: SPHERE_HOME, py: SPHERE_HOME, spin: 0 };

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
let gestureWasLive = false;
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
    // D-2 — the keyboard nudge's own edge, consumed once.
    const nudged = keyboardEdge;
    keyboardEdge = false;
    // The per-axis read-out is published on the gesture's FALLING edge (release
    // + glide settled), where a screen reader's next query will find it.
    const gestureLive = dragging || gliding;
    if (gestureWasLive && !gestureLive) syncSpinReadout();
    gestureWasLive = gestureLive;

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
    rendered.spin = targetSpin + continuity.offset.spin;

    renderedVelocity.px = (rendered.px - prevRendered.px) / dtSeconds;
    renderedVelocity.py = (rendered.py - prevRendered.py) / dtSeconds;
    renderedVelocity.spin = (rendered.spin - prevRendered.spin) / dtSeconds;
    prevRendered.px = rendered.px;
    prevRendered.py = rendered.py;
    prevRendered.spin = rendered.spin;

    lastPose.px = pose.px;
    lastPose.py = pose.py;
    lastPose.spin = pose.spin;

    // Compose: spin about the tilted axis, then the additive gesture pitch/yaw.
    const mesh = three.getSphere();
    if (mesh) {
        qSpin.setFromAxisAngle(tiltAxis, rendered.spin);
        eGesture.set(sphereSpin.offset.x, sphereSpin.offset.y, 0);
        qGesture.setFromEuler(eGesture);
        mesh.quaternion.copy(qGesture).multiply(qSpin);
        // C-10 — the ball rides the room's home plane in Z; the original Boing
        // is planar and no channel has ever written otherwise.
        mesh.position.set(rendered.px, rendered.py, SPHERE_HOME);
    }

    // The fake contact-shadow tracks the ball's x, scaling/fading with height.
    const shadow = three.getContactShadow();
    if (shadow && !Array.isArray(shadow.material)) {
        const h = (rendered.py - FLOOR_Y) / (APEX_Y - FLOOR_Y); // 0 floor → 1 apex
        const t = clamp(h, 0, 1);
        // L-m3 — only X moves; the shadow's own plane is a CONSTANT the room
        // seated at construction, and re-deriving it here made one invariant two.
        shadow.position.x = rendered.px;
        shadow.scale.setScalar(lerp(1, 1.9, t));
        // M-6 — `opacity` is on the Material BASE class, so the array case is
        // NARROWED rather than cast away: the teardown handles an array, and an
        // unchecked cast in the hot path was the one place that did not.
        shadow.material.opacity = lerp(0.5, 0.12, t);
    }

    // T.A12 — the scene declares itself LIVE (forcing a render) while the group
    // plays, the user SCRUBS a paused stage (D-1's second edge — the transport's
    // seat never marks the room dirty, so the frame that consumes a seek must
    // say so itself), the user DRAGS the subject (L-B1), a glide is coasting, or
    // a seam is still settling. At rest the present loop skips the render.
    return (
        playing || scrubbed || dragging || nudged || gliding || continuity.live
    );
}

onMounted(() => {
    // Build the Three.js room now the canvas ref is live.
    three.setup();
    // Wire the sphere-spin gesture onto the canvas (capture-phase hit-test runs
    // before OrbitControls' own pointerdown).
    sphereSpin.attach(canvasEl.value!);

    // T.A11 / L-M3 · C-11 — the NON-DOM sampling probe. It is a genuine
    // instrument: the live-session audits of this scene read the world-unit pose
    // and the coasting angular velocity through it, which is why it is kept
    // rather than deleted. Two things about it were false and are not any more.
    //
    //  · It named ORACLES THAT DO NOT EXIST. The old comments credited
    //    `proof:amiga-decay-visible` and the T.A7/T.A8/T.A9 physics oracles as
    //    wired readers of this object; nothing in the tree reads it at runtime
    //    (census: two hits, both in this file). Its real readers are a human
    //    with a console and the dated audit records that quote it.
    //  · It shipped to PRODUCTION through a double cast, the only
    //    `(window as unknown as …)` in demo/, beside the typed `__kfLoaf` idiom
    //    one directory away. It is typed like its sibling now and mounted only
    //    under DEV.
    if (import.meta.env.DEV) {
        window.__kfAmigaProbe = {
            omega: () => sphereSpin.angularVelocity(),
            pose: () => ({
                px: rendered.px,
                py: rendered.py,
                spin: rendered.spin,
                ox: sphereSpin.offset.x,
                oy: sphereSpin.offset.y,
                playing: animationGroup.started && animationGroup.playing(),
            }),
        };
    }
});

// B-3: pause the WebGL present loop while the tab is backgrounded. C-18 — the
// frame clock is RE-ARMED on the way back in: the first frame after a suspend
// must not hand the continuity lanes the whole background window as one dt.
useSceneVisibilityPause(
    () => three.running,
    () => three.stop(),
    () => {
        // C-9 limb 1 — the ONLY live resume path was also the one path that
        // never marked the room dirty: the loop came back at rest, the render
        // gate saw nothing live, and the first painted frame waited for an
        // interaction. Fatal exactly when composed with a context loss.
        armFrameClock();
        three.markRenderDirty();
        three.start();
    },
);

// I.W3 S2 — the occlusion pause over the live WebGL canvas: an
// IntersectionObserver stands the present loop down when the scene leaves the
// viewport and re-arms it a viewport ahead of re-entry.
//
// C-16, measured and stated rather than asserted: at TODAY's containment chain
// this scene never scrolls — the shell is `overflow-hidden h-dvh w-dvw` and the
// mobile stage is viewport-fixed — so the off-screen arm does not fire and the
// intersecting arm fires once, at mount, where `setup()` has already armed the
// loop. The observer is RETAINED as the seam that fires the day a scroller
// appears in that chain; what is removed is the comment's claim that it is
// doing work today.
//
// The SECOND-AUTHORITY hazard, named because it is the real risk here: the tab
// -visibility pause below owns the loop under an explicit honesty contract
// ("only resumes what IT paused"), and a second authority that can only ever say
// START could resume a loop that contract deliberately stopped — a WebGL present
// loop running in a hidden tab. The intersecting arm therefore declines while
// the document is hidden; the visibility pause resumes it on its own terms.
useIntersectionObserver(
    sceneRootEl,
    ([entry]) => {
        if (entry?.isIntersecting) {
            if (document.visibilityState === "hidden") return;
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
    delete window.__kfAmigaProbe;
    // (the Three.js room + IntersectionObserver auto-release on scope dispose)
});

const facility = facilityFromGroup(() => animationGroup);

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: amiga's REAL group members are
    // the painting channels; the legacy `animationGroup` stays for the panel
    // group. The facility's playback is the standard group adapter.
    facility,
    // C-13 — the exposed KEY is the shell's contract and keeps its name; the
    // local alias that made one id read as three is gone.
    superKey: AMIGA_SCENE_ID,
});
</script>

<style scoped>
/* I.W3 S2 — the scene root carries NO `content-visibility: auto` (wrong over a
   live WebGL present loop — a per-frame ReadPixels stall). The occlusion-pause
   intent rides the IntersectionObserver above, composed with the tab-visibility
   pause. */

/* The drag/spin surface. MISSED-F — `touch-action` is `pinch-zoom`, not `none`:
   the single-finger gesture still belongs to the scene (a sphere-hit drag spins
   the mesh, a miss orbits the camera), but the browser keeps the PINCH, so the
   viewport-filling mobile canvas no longer suppresses zoom over most of the
   screen. The page-level escape (the viewport meta) was intact and is not the
   point: a user who needs to magnify the subject should not have to leave it.
   The idiom is house-wide — six scene sites, of which this is the largest
   surface; the other five are other units' files and ride the receipt.
   `cursor: grab` advertises the manipulable subject to a POINTER; the keyboard
   and AT affordances are on the element itself (D-2), and the touch-visible
   affordance is MISSED-A's declared residual. */
.amiga-canvas {
    touch-action: pinch-zoom;
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
/* D-8 — an affordance for an object that does not exist is a lie. When the room
   could not be built (or its GL context was taken), the grab cursor goes with
   it; the accessible name says what happened in the same motion. */
.amiga-canvas--unavailable,
.amiga-canvas--unavailable:active {
    cursor: default;
}

/* D-15 — under forced-colors the UA drops `box-shadow`, and the inset hairline
   above IS the stage boundary: without it the stage has no edge at all in the
   one mode that most needs one. The boundary keeps its meaning through a
   system-coloured outline, the same shape the house's `kf-focus-ring` forced-
   colors arm takes. (The CANVAS ITSELF is exempt — a replaced element's pixels
   are not re-coloured — so this is the whole of the scene's forced-colors
   surface, which is why it is one rule.) */
@media (forced-colors: active) {
    .amiga-canvas {
        box-shadow: none;
        outline: 1px solid CanvasText;
    }
}
</style>
