import { markRaw, onBeforeUnmount, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { tesselateSphere } from "./utils";
import { BOUNCE, BOX_SIZE, SPHERE_HOME } from "./useAmigaAnimations";
import type { BounceScale } from "./useAmigaAnimations";

/**
 * R.W6-decomp — the amiga scene's Three.js room (renderer · scene · camera ·
 * OrbitControls · the boing-ball mesh · the managed present loop · the bounce-
 * aware framing math), extracted from AmigaScene.vue as a colocated sub-unit
 * (the demo ≤500L-per-file decomposition; proof:demo-no-oversize; R.W5 §4 F1).
 *
 * The scene keeps the EGG ORCHESTRATION (the dblclick boing, the power-on boot,
 * the telemetry sampling, the occlusion/visibility pause) — this composable owns
 * only the WebGL plumbing the eggs drive. One driver, the engine's MANAGED
 * `RAFPlayback` (inv ζ — no hand-rolled rAF): the scene injects its per-frame
 * work via the `onFrame` hook the present loop calls each frame.
 *
 * SPHERE_HOME / BOUNCE / BOX_SIZE are the ONE centred-home + authored-amplitude
 * authority (useAmigaAnimations); the bounce-fit scale is derived here from the
 * canonical camera (subject = pivot = framing — the framing owner owns the fit)
 * and read by useAmigaAnimations through the `getBounceScale` seam.
 */

// J.W7a S1 (D3 · fix-round 1) — BOUNCE-AWARE framing. The D3 protagonist reframe
// (FOV 50°, z = 0.7×BOX_SIZE) frames the REST pose; the bounce animations
// translate the sphere ±BOUNCE about home, and at the tightened frustum the
// PLAYING subject left the frame entirely. The bounce amplitude is scaled INTO
// the live frustum — per-axis fit factors derived from the canonical camera (fov
// / aspect / distance-to-home) so home ± scale·BOUNCE + r stays inside the frame
// even at the simultaneous-worst corner (x extreme + y extreme + z nearest).
const SPHERE_RADIUS = 1;
// K4-B CURE — amplitude reduced from the edge-kiss 0.95 to a tasteful 0.35: a
// ≈37% canvas-half excursion per axis (a visible but contained hover arc, not a
// frame-filling sweep), and the simultaneous-worst corner still keeps the sphere
// clearly inside the frame on portrait mobile. The authored BOUNCE (=5) is
// unchanged so the seam is surgical.
const BOUNCE_FIT_MARGIN = 0.35;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export interface AmigaThreeHandle {
    /** Build the Three.js room. Call once at mount, after the canvas ref is live. */
    setup(): void;
    /** The boing-ball mesh (the interactive subject). Undefined before mount. */
    getSphere(): ReturnType<typeof tesselateSphere>;
    /** The per-axis frustum-fit bounce scale (read by useAmigaAnimations). */
    getBounceScale(): BounceScale;
    /** The live camera (the sphere-spin gesture raycasts against it). */
    getCamera(): THREE.PerspectiveCamera | undefined;
    /** Enable/disable OrbitControls (the sphere-grab stands orbit down). */
    setOrbitEnabled(enabled: boolean): void;
    /** True while the managed present loop is running. */
    readonly running: boolean;
    /** Start the WebGL present loop (idempotent). */
    start(): void;
    /** Stop the WebGL present loop (the genuine suspend seam). */
    stop(): void;
    /** Tear down the GL context + geometries/materials (call on unmount). */
    dispose(): void;
}

/**
 * @param canvasEl  the `<canvas>` template ref.
 * @param onFrame   per-frame injection (spin-glide tick · telemetry · bloom) —
 *                  called by the present loop AFTER controls.update(), BEFORE the
 *                  render. The scene owns this work; the loop owns the cadence.
 */
export function useAmigaThree(
    canvasEl: Ref<HTMLCanvasElement | null>,
    onFrame: () => void,
): AmigaThreeHandle {
    let sphereMesh: ReturnType<typeof tesselateSphere>;
    let renderer: THREE.WebGLRenderer | undefined;
    let controls: OrbitControls | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    // The WebGL present loop rides the engine's MANAGED RAFPlayback driver (the
    // `loop()` self-rescheduling shape) — the scene owns NO hand-rolled rAF.
    const present = markRaw(new RAFPlayback());

    const bounceScale: BounceScale = { x: 1, y: 1, z: 1 };

    const refreshBounceFraming = () => {
        if (!camera) return;
        // The canonical pose: the camera sits on the y–z plane looking at the
        // centred home (= OrbitControls.target) → screen-horizontal == world-x,
        // while world-y and world-z SHARE screen-vertical and view-depth with
        // mirrored weights, so the vertical and depth projection sums collapse to
        // the same S below.
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
        const sv = clamp01((mT * d0 - SPHERE_RADIUS) / (BOUNCE * S * (1 + mT)));
        const dMin = d0 - sv * BOUNCE * S;
        bounceScale.x = clamp01(
            (mT * camera.aspect * dMin - SPHERE_RADIUS) / BOUNCE,
        );
        bounceScale.y = sv;
        bounceScale.z = sv;
    };

    const setup = () => {
        const canvas = canvasEl.value!;

        scene = new THREE.Scene();
        // J.W7a S1 (D3 / A-02) — the PROTAGONIST reframe: FOV 75°→50° + the camera
        // pulled in to 0.7×BOX_SIZE so the r=1 sphere fills ~20% of the vertical
        // FOV while the room walls stay in frame as the contextual surround.
        // Subject = pivot = framing. This frustum frames the REST pose only — the
        // PLAYING bounce envelope is scaled into it via refreshBounceFraming().
        camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000,
        );

        camera.position.z = BOX_SIZE * 0.7;
        // J.W7a S1 (D6 / A-01) — the camera-space lift: the eye rises to
        // BOX_SIZE/2 so the mobile-open sheet leaves the sphere clear above the
        // sheet boundary.
        camera.position.y = BOX_SIZE / 2;
        // Derive the frustum-fit bounce scale from the canonical framing just set
        // (re-derived on every canvas resize below).
        refreshBounceFraming();
        // S1d (H.W7) — `alpha: true` so the canvas composites over the demo's
        // themed backdrop instead of an opaque white fill (the full-bleed mobile
        // stage would otherwise obliterate the grid-bg + dark mode).
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas,
        });
        // A2 (MEASURE-FIRST): cap the device-pixel-ratio at 2 — the former
        // `devicePixelRatio * 2` rendered a 4× CSS-pixel buffer (16× fragments vs
        // CSS pixels on a dpr=2 retina). MSAA already carries the edge quality, so
        // the extra super-sampling was pure fill-rate waste.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // S1d (H.W7) — clear to TRANSPARENT (alpha 0) so the canvas composites
        // over the themed CSS backdrop instead of obliterating it with white.
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

        // L.W11.S3 — the Boing-Ball crayon red is KEPT but RE-SOURCED to
        // var(--amiga-red) (→ var(--rainbow-red), the demo's canonical crayon red,
        // hue single-sourced in design-idioms.css). tesselateSphere resolves the
        // CSS var against the live DOM before painting the offscreen 2D checker.
        sphereMesh = tesselateSphere("#ffffff", "var(--amiga-red)", SPHERE_RADIUS);
        // I.W3 S1 — seat the subject at the CENTRED home (the room origin) so a
        // centre-drag HITS the mesh and fires the spin gesture.
        sphereMesh.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        scene.add(sphereMesh);

        // Set renderer size to match canvas layout dimensions
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        // I.W3 S1 — the orbit pivot IS the subject: target the sphere's centred
        // home so an empty-space drag orbits ABOUT the subject.
        controls.target.copy(sphereMesh.position);
        controls.update();

        start();
    };

    function start() {
        if (present.running) return;
        // The managed driver's `loop(cb)` self-reschedules each frame while `cb`
        // returns true; it is stopped explicitly via `present.stop()`.
        present.loop(() => {
            controls?.update();
            // The scene's per-frame injection (spin-glide tick · telemetry
            // snapshot · phosphor bloom) — owned by the scene, paced by the loop.
            onFrame();
            if (renderer && scene && camera) renderer.render(scene, camera);
            return true; // keep presenting until an explicit stop()
        });
    }

    function stop() {
        present.stop();
    }

    function dispose() {
        stop();
        controls?.dispose();
        // Dispose all Three.js geometries and materials to free GPU memory.
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
    }

    // Canvas resize → camera-aspect. A plain reactive DOM observer (vueuse owns
    // its lifecycle via tryOnScopeDispose); the guard covers the pre-mount window
    // before `camera`/`renderer` exist.
    useResizeObserver(canvasEl, () => {
        if (!camera || !renderer) return;
        const w = canvasEl.value!.clientWidth;
        const h = canvasEl.value!.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        // The frustum-fit bounce scale is aspect-dependent; re-derive it.
        refreshBounceFraming();
    });

    onBeforeUnmount(dispose);

    return {
        setup,
        getSphere: () => sphereMesh,
        getBounceScale: () => bounceScale,
        getCamera: () => camera,
        setOrbitEnabled: (enabled: boolean) => {
            if (controls) controls.enabled = enabled;
        },
        get running() {
            return present.running;
        },
        start,
        stop,
        dispose,
    };
}
