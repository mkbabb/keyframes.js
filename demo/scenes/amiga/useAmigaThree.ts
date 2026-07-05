import { markRaw, onBeforeUnmount, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { tesselateSphere } from "./utils";
import { BOX_SIZE, FLOOR_Y, SPHERE_HOME, SPHERE_RADIUS } from "./useAmigaDemo";

/**
 * R.W6-decomp — the amiga scene's Three.js room (renderer · scene · camera ·
 * OrbitControls · the boing-ball mesh · the managed present loop), extracted from
 * AmigaScene.vue as a colocated sub-unit.
 *
 * T.A9 — the camera frames the ROOM, not the rest pose: the entire J.W7a
 * frustum-fit apparatus (refreshBounceFraming / BounceScale / getBounceScale /
 * BOUNCE_FIT_MARGIN) is DELETED. The authored arc is rendered at authored scale.
 *
 * T.A10 — the gray Lambert box DIES; the floor + back-wall are drawn as a
 * paper-grid over the theme backdrop (renderer stays `alpha:true`), and a soft
 * radial contact-shadow blob tracks the ball's x, scaling/fading with height.
 * (The grid-room COMPOSITION rides T.M owner sign-off — a taste-packet,
 * PENDING-OWNER; the removals + the alpha composite are RULED.)
 *
 * T.A12 — render-on-demand: the present loop renders only when OrbitControls
 * changed, the group is playing, a glide is live, or a re-seat is live (the scene
 * reports its liveness via the `onFrame` return). At true rest the WebGL context
 * is idle (renderer.info.render.frame stable).
 */
const CONTACT_FLOOR = FLOOR_Y - SPHERE_RADIUS; // the shadow sits on the floor plane

export interface AmigaThreeHandle {
    /** Build the Three.js room. Call once at mount, after the canvas ref is live. */
    setup(): void;
    /** The boing-ball mesh (the interactive subject). Undefined before mount. */
    getSphere(): ReturnType<typeof tesselateSphere>;
    /** The contact-shadow blob mesh (positioned per-frame by the scene). */
    getContactShadow(): THREE.Mesh | undefined;
    /** The live camera (the sphere-spin gesture raycasts against it). */
    getCamera(): THREE.PerspectiveCamera | undefined;
    /** Enable/disable OrbitControls (the sphere-grab stands orbit down). */
    setOrbitEnabled(enabled: boolean): void;
    /** T.A12 — force a render next frame (mount, resize, external state change). */
    markRenderDirty(): void;
    /** True while the managed present loop is running. */
    readonly running: boolean;
    /** Start the WebGL present loop (idempotent). */
    start(): void;
    /** Stop the WebGL present loop (the genuine suspend seam). */
    stop(): void;
    /** Tear down the GL context + geometries/materials (call on unmount). */
    dispose(): void;
}

/** A soft radial black→transparent blob for the fake contact shadow (T.A10). */
function makeShadowTexture(): THREE.CanvasTexture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    );
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.5, "rgba(0,0,0,0.28)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
}

/**
 * @param canvasEl  the `<canvas>` template ref.
 * @param onFrame   per-frame injection (compose pose+gesture onto the mesh ·
 *                  advance the glide/re-seat). Called AFTER controls.update(),
 *                  BEFORE the (gated) render. MUST return whether the scene is
 *                  LIVE this frame (group playing / glide / re-seat) so the
 *                  present loop can skip the render at rest (T.A12).
 */
export function useAmigaThree(
    canvasEl: Ref<HTMLCanvasElement | null>,
    onFrame: () => boolean,
): AmigaThreeHandle {
    let sphereMesh: ReturnType<typeof tesselateSphere>;
    let contactShadow: THREE.Mesh | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let controls: OrbitControls | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    // The WebGL present loop rides the engine's MANAGED RAFPlayback driver — the
    // scene owns NO hand-rolled rAF.
    const present = markRaw(new RAFPlayback());

    // T.A12 — the render-on-demand dirty flag. Set on mount/resize/interaction;
    // cleared after each render. The present loop also renders while
    // OrbitControls is still settling (controls.update() returns true) or the
    // scene reports itself live.
    let renderDirty = true;

    const setup = () => {
        const canvas = canvasEl.value!;

        scene = new THREE.Scene();

        // T.A9 — the camera frames the ROOM (the whole BOX_SIZE cube), not the
        // rest pose, so the authored wall-to-wall / floor↔apex arc renders at
        // authored scale. Subject = pivot = framing (the look-at is the centred
        // home). A slight lift keeps the floor + shadow readable.
        camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000,
        );
        camera.position.set(0, 1.5, BOX_SIZE * 1.15);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas,
        });
        // A2 — cap DPR at 2 (MSAA carries edge quality; extra super-sampling is
        // pure fill-rate waste on retina).
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // T.A10 — clear to TRANSPARENT so the canvas composites over the themed
        // CSS paper-grid backdrop instead of a foreign gray slab.
        renderer.setClearColor(0xffffff, 0);

        // Lighting: a soft sky/ground fill + a top-front key for the specular lobe.
        const hemi = new THREE.HemisphereLight("white", "#c8c8c8", 1.6);
        scene.add(hemi);
        const key = new THREE.SpotLight("white", 0.7, 0, Math.PI / 2, 0.9);
        key.position.set(0, BOX_SIZE, BOX_SIZE / 2);
        scene.add(key);

        // T.A10 — the grid-room: a paper-grid FLOOR + BACK-WALL over the theme
        // backdrop (the gray Lambert box is gone). Quiet neutral lines; the CSS
        // grid-bg shows through the transparent composite behind them.
        const gridColor = new THREE.Color("#b9b9c6");
        const floorGrid = new THREE.GridHelper(BOX_SIZE, 12, gridColor, gridColor);
        (floorGrid.material as THREE.Material).opacity = 0.35;
        (floorGrid.material as THREE.Material).transparent = true;
        floorGrid.position.y = CONTACT_FLOOR;
        scene.add(floorGrid);

        const backGrid = new THREE.GridHelper(BOX_SIZE, 12, gridColor, gridColor);
        (backGrid.material as THREE.Material).opacity = 0.18;
        (backGrid.material as THREE.Material).transparent = true;
        backGrid.rotation.x = Math.PI / 2;
        backGrid.position.z = -BOX_SIZE / 2;
        scene.add(backGrid);

        // T.A10 — the fake contact-shadow blob on the floor plane, tracked to the
        // ball's x + scaled/faded by height each frame (by the scene's compose).
        contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(2.6, 2.6),
            new THREE.MeshBasicMaterial({
                map: makeShadowTexture(),
                transparent: true,
                depthWrite: false,
            }),
        );
        contactShadow.rotation.x = -Math.PI / 2;
        contactShadow.position.set(0, CONTACT_FLOOR + 0.01, 0);
        scene.add(contactShadow);

        // The Boing-Ball: the crayon-red checker sphere, re-sourced to
        // var(--amiga-red) (→ var(--rainbow-red), single-sourced in
        // design-idioms.css). Seated at the centred home so a centre-drag HITS it.
        sphereMesh = tesselateSphere("#ffffff", "var(--amiga-red)", SPHERE_RADIUS);
        sphereMesh.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        scene.add(sphereMesh);

        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        // I.W3 S1 — the orbit pivot IS the subject: target the centred home so an
        // empty-space drag orbits ABOUT the subject.
        controls.target.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        controls.update();
        // T.A12 — any user orbit dirties the render.
        controls.addEventListener("change", () => {
            renderDirty = true;
        });

        renderDirty = true;
        start();
    };

    function start() {
        if (present.running) return;
        present.loop(() => {
            // OrbitControls.update() applies damping and returns true while the
            // camera is still settling — a render trigger on its own (T.A12).
            const controlsChanged = controls ? controls.update() : false;
            // The scene composes pose+gesture onto the mesh and reports liveness.
            const sceneLive = onFrame();
            if (
                renderer &&
                scene &&
                camera &&
                (renderDirty || controlsChanged || sceneLive)
            ) {
                renderer.render(scene, camera);
                renderDirty = false;
            }
            return true; // keep presenting; the render itself is gated
        });
    }

    function stop() {
        present.stop();
    }

    function dispose() {
        stop();
        controls?.dispose();
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

    // Canvas resize → camera-aspect. A plain reactive DOM observer; the guard
    // covers the pre-mount window before `camera`/`renderer` exist.
    useResizeObserver(canvasEl, () => {
        if (!camera || !renderer) return;
        const w = canvasEl.value!.clientWidth;
        const h = canvasEl.value!.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderDirty = true;
    });

    onBeforeUnmount(dispose);

    return {
        setup,
        getSphere: () => sphereMesh,
        getContactShadow: () => contactShadow,
        getCamera: () => camera,
        setOrbitEnabled: (enabled: boolean) => {
            if (controls) controls.enabled = enabled;
        },
        markRenderDirty: () => {
            renderDirty = true;
        },
        get running() {
            return present.running;
        },
        start,
        stop,
        dispose,
    };
}
