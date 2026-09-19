import { markRaw, onBeforeUnmount, ref, type Ref } from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { tesselateSphere } from "./utils";
import {
    BOX_SIZE,
    FLOOR_Y,
    SPHERE_HOME,
    SPHERE_RADIUS,
    WALL_X,
} from "./useAmigaDemo";

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
 * changed, the group is playing, the user is scrubbing or dragging, or a seam is
 * still settling (the scene reports its liveness via the `onFrame` return). At
 * true rest the WebGL context is idle (renderer.info.render.frame stable) — M-5:
 * that is a statement about the GPU and not about the CPU, and the loop body
 * says so where it runs.
 */
const CONTACT_FLOOR = FLOOR_Y - SPHERE_RADIUS; // the shadow sits on the floor plane

// ── D-6 + D-11 — THE FRAMING TERMS, re-derived at this wave's own ref ─────────
// (OP-3/D-19: a geometry cure written off a banked figure is a cure to the wrong
// number. Both banked figures reproduce exactly at these bytes.)
//
// D-6, the fit: the camera is VERTICAL-fov, the arc is HORIZONTAL. View-axis
// distance to the room origin = hypot(lift, z); the vertical half-extent there is
// d·tan(fov/2) = 13.8813 · tan 25° = 6.4728, so the half-WIDTH is that times the
// aspect, and the authored sweep needs WALL_X + SPHERE_RADIUS = 6. The arc
// therefore fits only when aspect ≥ 6 / 6.4728 = 0.927 — a portrait phone is
// 0.46, and the resize handler adjusted `camera.aspect` alone, with no letterbox
// or fit term anywhere since the J.W7a frustum-fit apparatus was deleted. The
// cure SCALES THE CAMERA, never the arc (the authored excursion IS the scene):
// below the fit the camera dollies out along its own view axis, just far enough.
//
// D-11, the vertical bias: at the authored 1.5 lift the frustum met the ball
// plane at +6.199 / −6.861, so headroom above the apex+r (+3) was 3.199 and
// footroom below the floor−r (−5) was 1.861 — 1.719:1, bottom-heavy AGAINST the
// house's declared φ law (layout.css `--dock-margin`'s "bottom anchor + /φ"). A
// 1.75 lift reads +6.173 / −6.954 → 3.173 : 1.954 = 1.624:1, φ to within 0.4 %,
// and it shows MORE of the floor + contact shadow — the very reason the lift
// exists. One free parameter, one arithmetic answer, no taste spent.
const CAMERA_FOV = 50;
const CAMERA_LIFT = 1.75;
const CAMERA_Z = BOX_SIZE * 1.15;
const HALF_FOV_RAD = (CAMERA_FOV / 2) * (Math.PI / 180);
/** The half-width the authored wall-to-wall sweep needs at the ball plane. */
const SWEEP_HALF_WIDTH = WALL_X + SPHERE_RADIUS;

interface AmigaThreeHandle {
    /** Build the Three.js room. Call once at mount, after the canvas ref is live. */
    setup(): void;
    /**
     * The boing-ball mesh (the interactive subject). L-M5/C-4 — genuinely
     * `undefined` before `setup()` runs (and after a context loss), and the type
     * says so: the field, the JSDoc and the consumer's guard used to disagree
     * about one value, with only the TYPE lying.
     */
    getSphere(): ReturnType<typeof tesselateSphere> | undefined;
    /** The contact-shadow blob mesh (positioned per-frame by the scene). */
    getContactShadow(): THREE.Mesh | undefined;
    /** The live camera (the sphere-spin gesture raycasts against it). */
    getCamera(): THREE.PerspectiveCamera | undefined;
    /** Enable/disable OrbitControls (the sphere-grab stands orbit down). */
    setOrbitEnabled(enabled: boolean): void;
    /** T.A12 — force a render next frame (mount, resize, external state change). */
    markRenderDirty(): void;
    /**
     * D-8 — true when the room could not be built (no WebGL, a refused context,
     * a driver that threw) or the GL context is currently lost. The scene reads
     * it so the manipulable-subject affordances do not outlive the object; a ref,
     * because a context can be lost long after mount.
     */
    readonly failed: Readonly<Ref<boolean>>;
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
    let sphereMesh: ReturnType<typeof tesselateSphere> | undefined;
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
    const failed = ref(false);

    /**
     * D-6 — seat the projection for a viewport, dollying out along the camera's
     * own view axis when the aspect is too narrow for the authored sweep. The
     * ORBIT is preserved: the position is scaled, never re-seated, so a user who
     * has orbited keeps their angle across a resize. M-4 — the zero-size window
     * (a pre-layout mount, a display:none ancestor) is guarded HERE, once, for
     * the mount path and the resize path alike; the mount path used to divide by
     * a zero the sibling resize handler had always guarded against.
     */
    const frameRoom = (width: number, height: number): void => {
        if (!camera || !renderer || width === 0 || height === 0) return;
        const aspect = width / height;
        camera.aspect = aspect;
        const needed = SWEEP_HALF_WIDTH / (aspect * Math.tan(HALF_FOV_RAD));
        const distance = camera.position.length();
        if (distance > 0 && distance < needed) {
            camera.position.multiplyScalar(needed / distance);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        controls?.update();
        renderDirty = true;
    };

    const buildRoom = () => {
        const canvas = canvasEl.value!;

        scene = new THREE.Scene();

        // T.A9 — the camera frames the ROOM (the whole BOX_SIZE cube), not the
        // rest pose, so the authored wall-to-wall / floor↔apex arc renders at
        // authored scale. Subject = pivot = framing (the look-at is the centred
        // home). The lift keeps the floor + shadow readable and carries D-11's
        // φ bias (the derivation is at the constants).
        camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 1000);
        camera.position.set(0, CAMERA_LIFT, CAMERA_Z);

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

        frameRoom(canvas.clientWidth, canvas.clientHeight);
        renderDirty = true;
        start();
    };

    /**
     * D-8 — the room is built behind an ERROR POSTURE. `new THREE.WebGLRenderer`
     * throws on a machine with no WebGL, a blocked context, or a driver that
     * refuses — and it sat bare inside `onMounted` with no try/catch, no
     * fallback and no `onErrorCaptured` anywhere in demo/ or src/, so the whole
     * scene mount died and the subject's `cursor: grab` went on advertising an
     * object that was never built. A failure is now a STATE the scene can read
     * and paint honestly, not an exception that takes the route down.
     */
    const setup = () => {
        try {
            buildRoom();
            failed.value = false;
        } catch (error) {
            failed.value = true;
            stop();
            console.warn("[amiga] the WebGL room could not be built", error);
        }
    };

    function start() {
        if (present.running || failed.value) return;
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
            // M-5, recorded rather than glossed: render-on-demand gates the DRAW,
            // not the FRAME. This callback keeps returning true, so `controls
            // .update()` + the scene's compose run at 60 Hz for as long as the
            // scene is mounted and visible — the GL context idles at rest, the
            // CPU does not. The cost is accepted, not overlooked: standing the
            // FRAME down would require every input edge (a pointerdown on the
            // subject, a keyboard nudge, a transport scrub, an OrbitControls
            // damping tail) to re-arm the loop before its own first frame, and
            // this scene's own liveness contract runs the other way — the scene
            // TELLS the loop what is live, from inside the loop. The suspend
            // seams that matter (tab hidden, scene scrolled away) stop the loop
            // outright, and they are wired.
            return true;
        });
    }

    function stop() {
        present.stop();
    }

    /**
     * L-M2/C-14 — dispose EVERY owned GPU resource, not the Mesh subset.
     *
     * The walk used to test `obj instanceof THREE.Mesh`, and both GridHelpers are
     * `LineSegments` — so the floor and back-wall geometries and materials were
     * never released. `Material.dispose()` does not walk its own maps either, so
     * both `CanvasTexture`s (the 1024² checkerboard ≈ 4 MB and the shadow blob)
     * stayed resident. Every `Object3D` carrying geometry or material is walked
     * here by shape, and each material's textures go with it.
     */
    const disposeMaterial = (material: THREE.Material): void => {
        // The texture slots are declared by three's material SUBCLASSES, so the
        // base type is widened structurally (each slot optional) rather than
        // walked by string key — a material without a slot simply has none.
        const mapped = material as THREE.Material &
            Partial<
                Record<
                    "map" | "alphaMap" | "specularMap" | "envMap",
                    THREE.Texture | null
                >
            >;
        mapped.map?.dispose();
        mapped.alphaMap?.dispose();
        mapped.specularMap?.dispose();
        mapped.envMap?.dispose();
        material.dispose();
    };

    const disposeGraph = () => {
        controls?.dispose();
        controls = undefined;
        scene?.traverse((obj) => {
            const drawable = obj as Partial<THREE.Mesh>;
            drawable.geometry?.dispose();
            const material = drawable.material;
            if (Array.isArray(material)) material.forEach(disposeMaterial);
            else if (material) disposeMaterial(material);
        });
        scene = undefined;
        sphereMesh = undefined;
        contactShadow = undefined;
        camera = undefined;
        // The GL context is otherwise held until GC collects the unrooted
        // closure — deterministic release is one call, and it is the difference
        // between "released now" and "released whenever".
        renderer?.forceContextLoss();
        renderer?.dispose();
        renderer = undefined;
    };

    function dispose() {
        stop();
        disposeGraph();
    }

    // Canvas resize → the framing term (D-6's fit + M-4's zero-size guard, both
    // inside `frameRoom`, which the mount path calls too).
    useResizeObserver(canvasEl, () => {
        const canvas = canvasEl.value;
        if (!canvas) return;
        frameRoom(canvas.clientWidth, canvas.clientHeight);
    });

    // D-8 — the GL context can be taken from a live page (a GPU reset, a driver
    // update, too many contexts). `preventDefault()` on the loss is what makes
    // the browser promise a restore; without it the canvas stays blank forever
    // and — composed with C-9 limb 1 — the loop spins on a dead context. Neither
    // event was handled anywhere in demo/ or src/.
    useEventListener(canvasEl, "webglcontextlost", (event: Event) => {
        event.preventDefault();
        failed.value = true;
        stop();
    });
    useEventListener(canvasEl, "webglcontextrestored", () => {
        disposeGraph();
        failed.value = false;
        setup();
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
        failed,
        get running() {
            return present.running;
        },
        start,
        stop,
        dispose,
    };
}
