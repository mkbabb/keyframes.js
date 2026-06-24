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
    markRaw,
    onBeforeUnmount,
    onMounted,
    ref,
    useTemplateRef,
} from "vue";
import {
    useIntersectionObserver,
    usePreferredReducedMotion,
    useResizeObserver,
} from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import AmigaCrtOverlay from "./AmigaCrtOverlay.vue";
import AmigaTelemetry from "./AmigaTelemetry.vue";
import { tesselateSphere } from "./utils";
import {
    useAmigaAnimations,
    BOUNCE,
    BOX_SIZE,
    SPHERE_HOME,
} from "./useAmigaAnimations";
import { useAmigaBoot } from "./useAmigaBoot";
import { useSphereSpin } from "./useSphereSpin";
import { useSceneVisibilityPause } from "@app/useSceneVisibilityPause";
import { AMIGA_SUPER_KEY } from "./amigaKeys";

const superKey = AMIGA_SUPER_KEY;

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvas");
const sceneRootEl = useTemplateRef<HTMLElement>("sceneRoot");

let sphereMesh: ReturnType<typeof tesselateSphere>;
let renderer: THREE.WebGLRenderer | undefined;
// L.W11.S3 (inv ζ) — the WebGL present loop now rides the engine's MANAGED
// RAFPlayback driver (the `loop()` self-rescheduling shape) instead of a bare
// `requestAnimationFrame`, so this scene — which now also hosts the engine-
// dogfooded power-on BOOT egg — owns NO hand-rolled rAF. One driver, the engine's,
// for every loop in the scene (the demo's `useRafScene` discipline, applied here).
const present = markRaw(new RAFPlayback());
let controls: OrbitControls | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;

// J.W7a S1 (D3 · fix-round 1) — BOUNCE-AWARE framing. The D3 protagonist
// reframe (FOV 50°, z = 0.7×BOX_SIZE) frames the REST pose; the bounce
// animations translate the sphere ±BOUNCE about home, and at the tightened
// frustum the PLAYING subject left the frame entirely (worst on a 390w
// portrait, where the frustum half-width at the subject plane ≈2.2 units vs
// the ±6 bounce+radius envelope). ONE move at the same subject=pivot=framing
// seam: the bounce amplitude is scaled INTO the live frustum — per-axis fit
// factors derived from the canonical camera (fov / aspect / distance-to-home)
// so home ± scale·BOUNCE + r stays inside the frame even at the simultaneous-
// worst corner (x extreme + y extreme + z nearest). Recomputed on mount +
// canvas resize (aspect-aware); the rest pose and the D3 framing are
// untouched.
const SPHERE_RADIUS = 1;
// K4-B CURE — amplitude reduced from the edge-kiss 0.95 to a tasteful 0.35.
// Decision: BOUNCE_FIT_MARGIN is the sole amplitude knob the refreshBounceFraming()
// fit pipeline exposes; lowering it from 0.95 (edge-kiss BY DESIGN, §Provenance)
// to 0.35 gives a ≈37% of the canvas-half excursion on each axis, so:
//   - at rest the sphere dominates the framed area (the centred subject reads);
//   - on play the bounce is a visible but contained hover arc (~35% of the frame),
//     not a frame-filling sweep (69%w / 37%h measured at 0.95);
//   - the authored BOUNCE constant (=5) stays unchanged so the seam is surgical;
//   - 0.35 was chosen so the simultaneous-worst corner (x+y+z extremes) still
//     keeps the sphere clearly inside the frame on portrait mobile.
const BOUNCE_FIT_MARGIN = 0.35; // tasteful hover arc, NOT edge-kiss
const bounceScale = { x: 1, y: 1, z: 1 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const refreshBounceFraming = () => {
    if (!camera) return;
    // The canonical pose: the camera sits on the y–z plane looking at the
    // centred home (= OrbitControls.target) → screen-horizontal == world-x,
    // while world-y and world-z SHARE screen-vertical and view-depth with
    // mirrored weights (|û_y| = |v̂_z|, |û_z| = |v̂_y|), so the vertical and
    // depth projection sums collapse to the same S below.
    const dx = camera.position.x - SPHERE_HOME;
    const dy = camera.position.y - SPHERE_HOME;
    const dz = camera.position.z - SPHERE_HOME;
    const d0 = Math.hypot(dx, dy, dz);
    const S = d0 > 0 ? (Math.abs(dy) + Math.abs(dz)) / d0 : 0;
    if (!(d0 > 0) || !(S > 0)) return;
    const mT =
        BOUNCE_FIT_MARGIN *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // The y/z pair (screen-vertical + view-depth, coupled) is solved first;
    // the x (screen-horizontal) fit then evaluates at the NEAREST plane the
    // y/z bounce can bring the sphere to — the perspective worst case.
    const sv = clamp01(
        (mT * d0 - SPHERE_RADIUS) / (BOUNCE * S * (1 + mT)),
    );
    const dMin = d0 - sv * BOUNCE * S;
    bounceScale.x = clamp01(
        (mT * camera.aspect * dMin - SPHERE_RADIUS) / BOUNCE,
    );
    bounceScale.y = sv;
    bounceScale.z = sv;
};

const { animationGroup } = useAmigaAnimations(
    () => sphereMesh,
    () => bounceScale,
);

// A5 (REBUILD): the SPHERE is the interactive subject. A pointer-drag on the
// mesh spins it; on release the engine `decay()` glide coasts the spin to rest
// — the engine driving a non-DOM Three.js target, independent of camera orbit.
// The raycast hit-test routes a sphere-grab to the spin gesture (orbit stands
// down for its duration) and a background-grab to OrbitControls (disjoint
// landlords, never racing).
// P.W5.S3 — reduced-motion gate for the flick-to-boing egg (the same OS-respect
// the boot egg keeps): a user who asked for less motion gets the spin/glide but
// NOT the autonomous wall-slam boing arc.
const prm = usePreferredReducedMotion();

const sphereSpin = useSphereSpin({
    getMesh: () => sphereMesh,
    getCamera: () => camera,
    setOrbitEnabled: (enabled) => {
        if (controls) controls.enabled = enabled;
    },
    // P.W5.S3 EGG — flick-to-boing: a hard flick of the sphere (release speed
    // ≥ FLICK_BOING_RAD_S, measured inside useSphereSpin) earns the boing arc
    // without a double-click. PRM-gated; `onBoing`'s own `boinging` guard keeps
    // it from re-firing mid-arc. The dblclick path (the canvas @dblclick) is KEPT
    // — the flick is purely additive, the discovery earned by gesture.
    onFlick: () => {
        if (prm.value === "reduce") return;
        onBoing();
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

// Q.WC5 S1 — the reactive angular-velocity readout the telemetry overlay binds.
// The composable OWNS the velocity (`Math.hypot(velX, velY)` during a drag, the
// decay() sampler's velocity during the glide); this ref is a few-Hz SNAPSHOT of
// `sphereSpin.angularVelocity()` written from the present loop (the SquareScene
// onTick-snapshot precedent) — a pure consumer, NEVER a second integrator. The
// hot path stays off the Vue render graph; the readout updates at TELEMETRY_HZ.
const angularVelocity = ref(0);
const TELEMETRY_HZ = 12;
let lastTelemetryAt = 0;
// I.W3 S1 — the sphere's rest pose is the ONE centred home imported from
// useAmigaAnimations (the room origin = box centre = camera look-at =
// `OrbitControls.target`). The boing-bounce extents swing about this same home,
// so the egg settles back to the centred subject. Subject = orbit pivot =
// framing — there is exactly ONE home used everywhere.

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

// L.W11.S3 EASTER EGG — "the power-on BOOT" (a colocated sub-unit, useAmigaBoot).
// On IntersectionObserver re-entry the page boots like a 1984 Amiga: a phosphor
// flash (the .amiga-canvas--power-on marker + the AmigaCrtOverlay flash) snaps the
// CRT on, then the SAME Boing `animationGroup` plays one wall-slam arc (inv ζ — no
// new rAF). PRM-snapped inside the composable. `booting`/`spinBloom` drive the CRT.
const { booting, spinBloom, runBoot, disposeBoot } = useAmigaBoot(
    animationGroup,
    () => sphereMesh,
    () => boinging.value,
    (v) => (boinging.value = v),
);
// The power-on BOOT is a RE-ENTRY delight, never a cold-arrival auto-play: the
// proof:cold-entry contract holds the engine OFF until the human's dock-play (a
// cold auto-boot would auto-resume the transport group). A per-session visited
// flag (sessionStorage survives the KeepAlive remount) excludes the first cold
// visit; the boot replays on every genuine return — the "gift that keeps giving".
const AMIGA_VISITED_KEY = "kf-amiga-visited";
const amigaVisitedThisSession = (() => {
    try { return sessionStorage.getItem(AMIGA_VISITED_KEY) === "1"; }
    catch { return false; }
})();
let bootedOnce = false;

onMounted(() => {
    const canvas = canvasEl.value!;

    scene = new THREE.Scene();
    // J.W7a S1 (D3 / A-02) — the PROTAGONIST reframe: FOV 75°→50° + the camera
    // pulled in to 0.7×BOX_SIZE. At the former 75°/z=BOX_SIZE the r=1 sphere
    // subtended ~9.5° (<13% of the FOV) — "a ~90px ball in a 900×700 room". The
    // narrowed FOV + closer dolly fill ~20% of the vertical FOV with the sphere
    // while the room walls stay in frame as the contextual surround. Subject =
    // pivot = framing (the I.W3 discipline carried): ONE consistent move — the
    // sphere stays the centred home/look-at/orbit pivot, only the framing
    // tightens. Fix-round 1: this frustum frames the REST pose only — the
    // PLAYING bounce envelope is scaled into it via refreshBounceFraming()
    // (the bounce-aware half of the same framing move, above).
    camera = new THREE.PerspectiveCamera(
        50,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000,
    );

    camera.position.z = BOX_SIZE * 0.7;
    // J.W7a S1 (D6 / A-01) — the camera-space lift the pane-amiga lane names:
    // the eye rises from BOX_SIZE/3 to BOX_SIZE/2 so the mobile-open sheet
    // (whose subject-class detent tightens in the same motion —
    // ControlsPaneWrapper) leaves the sphere clear above the sheet boundary.
    camera.position.y = BOX_SIZE / 2;
    // D3 fix-round 1 — derive the frustum-fit bounce scale from the canonical
    // framing just set (re-derived on every canvas resize below).
    refreshBounceFraming();
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

    // L.W11.S3 — the Boing-Ball crayon red is KEPT but RE-SOURCED: the raw
    // 'red' literal is retired to var(--amiga-red) (→ var(--rainbow-red), the
    // demo's canonical crayon red — hue single-sourced in design-idioms.css).
    // tesselateSphere resolves the CSS var against the live DOM before painting
    // the offscreen 2D checker (Canvas2D fillStyle does not resolve var() on its
    // own), so the ball is painted with the resolved crayon — token-clean AND
    // pixel-correct. '#ffffff' replaces the 'white' keyword for the same retire.
    sphereMesh = tesselateSphere("#ffffff", "var(--amiga-red)", SPHERE_RADIUS);
    // I.W3 S1 — seat the subject at the CENTRED home (the room origin), not the
    // far corner. The cursor lands on the sphere at the canvas centre → a
    // centre-drag HITS the mesh and fires the spin gesture (useSphereSpin),
    // instead of missing through to OrbitControls and tumbling the whole room.
    sphereMesh.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
    scene.add(sphereMesh);

    // Set renderer size to match canvas layout dimensions
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    // I.W3 S1 — the orbit pivot IS the subject: target the sphere's centred home
    // (= the camera look-at) so an empty-space drag orbits ABOUT the subject (the
    // sphere stays framed), not a disjoint origin that sweeps a corner ball across
    // the frame. Subject = orbit pivot = framing — one point.
    controls.target.copy(sphereMesh.position);
    controls.update();

    // Wire the sphere-spin gesture onto the canvas (capture-phase hit-test runs
    // before OrbitControls' own pointerdown).
    sphereSpin.attach(canvas);

    startRenderLoop();

    // Mark amiga visited THIS session so the NEXT return fires the power-on BOOT
    // (the cold first visit is excluded — proof:cold-entry). Set AFTER mount.
    try { sessionStorage.setItem(AMIGA_VISITED_KEY, "1"); } catch { /* private mode */ }
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
    // D3 fix-round 1 — the frustum-fit bounce scale is aspect-dependent;
    // re-derive it with the new frame.
    refreshBounceFraming();
});

function startRenderLoop() {
    if (present.running) return;
    // The managed driver's `loop(cb)` self-reschedules each frame while `cb`
    // returns true; returning true keeps the present loop alive (it is stopped
    // explicitly via `present.stop()`, the genuine suspend seam).
    present.loop(() => {
        controls?.update();
        // Advance the engine `decay()` release glide — drives the sphere mesh
        // rotation for ≥N frames after a flick (the A5 engine-drives-mesh story).
        sphereSpin.tickGlide();
        // Q.WC5 S1 — snapshot the already-tracked angular velocity into the
        // reactive readout at a few Hz (NOT 60 Hz — the cold path, like the easing
        // demo's PROGRESS_READOUT_HZ). The telemetry SEES the decay() coast.
        const now = performance.now();
        if (now - lastTelemetryAt >= 1000 / TELEMETRY_HZ) {
            lastTelemetryAt = now;
            angularVelocity.value = sphereSpin.angularVelocity();
        }
        // L.W11.S3 — spin → phosphor bloom: a hard flick that is still gliding
        // pushes --spin-bloom toward 1 (the CRT flares); it bleeds off when the
        // glide settles. Sampled INSIDE the managed present loop (no second rAF)
        // — the bloom is just a CSS var the .crt-overlay reads.
        const gliding = sphereSpin.isGliding();
        const target = gliding ? 1 : 0;
        spinBloom.value += (target - spinBloom.value) * 0.08;
        if (spinBloom.value < 0.002 && !gliding) spinBloom.value = 0;
        if (renderer && scene && camera) renderer.render(scene, camera);
        return true; // keep presenting until an explicit stop()
    });
}

function stopRenderLoop() {
    present.stop();
}

// B-3: pause the WebGL present loop while the tab is backgrounded (a hidden tab
// otherwise drives a full render per frame — pure battery waste). OrbitControls
// damping continues from rest on resume; nothing to re-base (the render is
// clock-free), so the sphere picks up exactly where it stood.
useSceneVisibilityPause(
    () => present.running,
    stopRenderLoop,
    startRenderLoop,
);

// I.W3 S2 (just-in-time occlusion-pause, the RIGHT primitive over a live WebGL
// canvas): an IntersectionObserver — NOT `content-visibility: auto` — owns "is
// this surface visible?". When the scene root scrolls off-screen / is occluded
// by a mobile sheet, stand the WebGL present loop down; re-arm just before it
// scrolls back. A `rootMargin` pre-roll re-starts the loop a viewport ahead of
// re-entry so the first painted frame is fresh. This composes with the
// tab-visibility pause (useSceneVisibilityPause, same stop/start handles) — one
// event/observer-driven owner of the present loop, never a CSS token racing the
// GPU. useIntersectionObserver auto-releases on scope dispose (inv-ζ dogfood).
useIntersectionObserver(
    sceneRootEl,
    ([entry]) => {
        if (entry?.isIntersecting) {
            startRenderLoop();
            // L.W11.S3 — the power-on BOOT fires on genuine RE-entry only (NEVER on
            // the cold first arrival — the proof:cold-entry contract: the engine
            // starts ONLY on the human's dock-play). The per-session visited flag
            // gates the FIRST cold mount out; the `booting`/`bootedOnce` pair keeps
            // it a once-per-entry delight, never a per-tick re-fire. (PRM-snapped
            // inside runBoot.)
            if (
                amigaVisitedThisSession &&
                !bootedOnce &&
                (entry.intersectionRatio ?? 0) > 0
            ) {
                bootedOnce = true;
                runBoot();
            }
        } else {
            stopRenderLoop();
            // Re-arm so the NEXT scroll-back boots again (the "gift that keeps
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
    stopRenderLoop();
    sphereSpin.detach();
    // (the IntersectionObserver auto-releases via useIntersectionObserver)
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
/* I.W3 S2 — the scene root carries NO `content-visibility: auto`. That CSS
   primitive is wrong over a continuously-rAF-painted WebGL canvas: the present
   loop keeps painting a subtree the compositor is told to skip, paying a
   per-frame ReadPixels GPU stall + a "rendering in a subtree hidden by
   content-visibility" warn. The occlusion-pause INTENT (stand the present loop
   down when off-screen / backgrounded) is served entirely off the event/observer
   path — an `IntersectionObserver` (useIntersectionObserver) drives start/stop of
   the WebGL loop, composed with the tab-visibility pause (useSceneVisibilityPause).
   One owner of "is this surface visible?", never a CSS token racing the GPU. */

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
