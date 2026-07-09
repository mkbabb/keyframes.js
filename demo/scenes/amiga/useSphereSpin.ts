import * as THREE from "three";
import { useEventListener } from "@vueuse/core";
// inv ζ — the amiga sphere dogfoods the engine's SHIPPED analytic `decay()`
// closed form (the SAME idiom the cube's orbital inertia rides,
// useOrbitalInertia.ts). A pointer-drag on the mesh accumulates an angular
// velocity; on RELEASE the engine's frictional glide bleeds that velocity off
// over many frames. `decay` is the light surface (zero value.js edge), imported
// directly like every demo engine consumer.
import { decay, type DecaySample } from "@mkbabb/keyframes.js";

/**
 * The interactive subject of the amiga scene. Drag the SPHERE to spin it; on
 * release the engine `decay()` glide coasts the spin to rest.
 *
 * T.A7 — the gesture is an ADDITIVE LAYER, never a second mesh writer. It
 * accumulates into `offset` (a stable `{ x, y }` object the scene reads each
 * frame); the scene composes `groupPose + offset` into the mesh transform (ONE
 * writer). So drag and the group animation compose by construction — the user's
 * spin delta accumulates ON TOP of the composite bounce/spin, and the pre-gesture
 * pose is preserved after the glide settles.
 *
 * Camera orbit (OrbitControls) stays the BACKGROUND gesture: a pointerdown that
 * RAYCASTS the sphere is the spin gesture (and suppresses orbit for its
 * duration); a miss falls through to OrbitControls untouched. The two gesture
 * landlords are disjoint by hit-test, never racing.
 */
interface SphereSpinOptions {
    /** The mesh the drag spins (the raycast hit-test target). */
    getMesh: () => THREE.Object3D | undefined;
    /** The camera the raycaster projects through. */
    getCamera: () => THREE.Camera | undefined;
    /** Suspend/resume camera orbit while a sphere-spin gesture owns the pointer. */
    setOrbitEnabled: (enabled: boolean) => void;
    /**
     * Friction coefficient (1/s) of the release glide — larger = shorter coast.
     * Default 2.4 (a long, legible spin-down).
     */
    friction?: number;
    /** Drag pixels → radians of spin. Default 0.01. */
    sensitivity?: number;
}

const DEFAULT_FRICTION = 2.4;
const DEFAULT_SENSITIVITY = 0.01;
// Below this (rad/s) the glide is visually at rest — stop integrating.
const REST_SPEED = 1e-3;

export function useSphereSpin(options: SphereSpinOptions) {
    const friction = options.friction ?? DEFAULT_FRICTION;
    const sensitivity = options.sensitivity ?? DEFAULT_SENSITIVITY;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    let canvasEl: HTMLCanvasElement | undefined;

    // T.A7 — the ADDITIVE gesture offset (rad), a stable object the scene composes
    // onto the group pose each frame. `x` = pitch (drag-y), `y` = yaw (drag-x).
    const offset = { x: 0, y: 0 };

    // ── Drag state ───────────────────────────────────────────────────────────
    let dragging = false;
    let activePointer: number | undefined;
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = 0;
    // Running angular velocity (rad/s) handed to `decay()` at release.
    let velX = 0;
    let velY = 0;

    // ── Glide state: a `decay()` sampler per axis, advanced by wall-clock ──────
    // seconds in the render loop. The per-frame DELTA is added to the offset, so
    // the spin keeps accumulating until the velocity bleeds below REST_SPEED.
    let glideX: ((t: number) => DecaySample) | undefined;
    let glideY: ((t: number) => DecaySample) | undefined;
    let glideStart = 0;
    let lastGlideX = 0;
    let lastGlideY = 0;

    const toNDC = (clientX: number, clientY: number) => {
        const rect = canvasEl!.getBoundingClientRect();
        ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const hitsSphere = (clientX: number, clientY: number): boolean => {
        const mesh = options.getMesh();
        const camera = options.getCamera();
        if (!mesh || !camera || !canvasEl) return false;
        // The mesh world transform is written by the scene's present loop; ensure
        // it is current for the raycast even between render-on-demand frames.
        mesh.updateMatrixWorld();
        toNDC(clientX, clientY);
        raycaster.setFromCamera(ndc, camera);
        return raycaster.intersectObject(mesh, false).length > 0;
    };

    const onPointerDown = (e: PointerEvent) => {
        if (!hitsSphere(e.clientX, e.clientY)) return; // → OrbitControls
        // The sphere owns this gesture: take the pointer, stand the camera orbit
        // down, and cancel any in-flight glide (a new grab re-seeds velocity).
        dragging = true;
        activePointer = e.pointerId;
        canvasEl!.setPointerCapture(e.pointerId);
        options.setOrbitEnabled(false);
        glideX = glideY = undefined;
        velX = velY = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        lastMoveTime = performance.now();
        e.preventDefault();
        e.stopPropagation();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== activePointer) return;
        const now = performance.now();
        const dt = Math.max((now - lastMoveTime) / 1000, 1e-3);
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        // Horizontal drag → yaw (offset.y); vertical drag → pitch (offset.x). The
        // gesture accumulates into the ADDITIVE offset, never the mesh (T.A7).
        const dAngY = dx * sensitivity;
        const dAngX = dy * sensitivity;
        offset.y += dAngY;
        offset.x += dAngX;

        // Track instantaneous angular velocity (rad/s) for the release impulse.
        velY = dAngY / dt;
        velX = dAngX / dt;

        lastX = e.clientX;
        lastY = e.clientY;
        lastMoveTime = now;
    };

    const endDrag = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== activePointer) return;
        dragging = false;
        activePointer = undefined;
        if (canvasEl?.hasPointerCapture(e.pointerId)) {
            canvasEl.releasePointerCapture(e.pointerId);
        }
        options.setOrbitEnabled(true);

        // Hand the release velocity to the engine's closed-form glide. Only seed
        // an axis whose flick had real speed (a static tap glides nowhere).
        const seed = (v: number) =>
            Math.abs(v) > REST_SPEED
                ? decay({ velocity: v, friction })
                : undefined;
        glideX = seed(velX);
        glideY = seed(velY);
        glideStart = performance.now();
        lastGlideX = 0;
        lastGlideY = 0;
    };

    /**
     * Advance the release glide one render frame — call from the scene's present
     * loop. Adds the engine `decay()` delta to the ADDITIVE offset. Returns true
     * while the glide is still live (used by the render-on-demand present loop,
     * T.A12).
     */
    const tickGlide = (): boolean => {
        if (!glideX && !glideY) return false;

        const t = (performance.now() - glideStart) / 1000;
        let live = false;

        if (glideX) {
            const s = glideX(t);
            offset.x += s.value - lastGlideX;
            lastGlideX = s.value;
            if (Math.abs(s.velocity) > REST_SPEED) live = true;
            else glideX = undefined;
        }
        if (glideY) {
            const s = glideY(t);
            offset.y += s.value - lastGlideY;
            lastGlideY = s.value;
            if (Math.abs(s.velocity) > REST_SPEED) live = true;
            else glideY = undefined;
        }
        return live;
    };

    // The canvas-pointer listeners ride @vueuse/core's useEventListener (the
    // inv-ζ dogfood discipline the demo's other drag seams keep): each returns a
    // stop() handle, auto-released on the host's scope dispose too.
    let stopHandles: Array<() => void> = [];

    /** Wire the pointer listeners onto the canvas (imperative — the canvas exists
     *  only after the Three.js renderer mounts). */
    const attach = (canvas: HTMLCanvasElement) => {
        canvasEl = canvas;
        // Capture-phase pointerdown so the hit-test runs BEFORE OrbitControls'
        // own (bubbling) listener claims a sphere-hit drag.
        stopHandles = [
            useEventListener(canvas, "pointerdown", onPointerDown, {
                capture: true,
            }),
            useEventListener(canvas, "pointermove", onPointerMove),
            useEventListener(canvas, "pointerup", endDrag),
            useEventListener(canvas, "pointercancel", endDrag),
        ];
    };

    const detach = () => {
        for (const stop of stopHandles) stop();
        stopHandles = [];
        canvasEl = undefined;
    };

    /**
     * T.A11 — the decay() dogfood witness, a NON-DOM sampling hook (no readout
     * DOM). The current angular speed (rad/s): the live `Math.hypot(velX, velY)`
     * accumulator during a drag, the engine `decay()` sampler's instantaneous
     * velocity during the glide (the SAME already-tracked physics). It bleeds to 0
     * as the glide settles — the visible decay() coast, now witnessed by a probe
     * on the gesture layer rather than a parked telemetry readout.
     */
    const angularVelocity = (): number => {
        if (dragging) return Math.hypot(velX, velY);
        if (!glideX && !glideY) return 0;
        const t = (performance.now() - glideStart) / 1000;
        const gx = glideX ? glideX(t).velocity : 0;
        const gy = glideY ? glideY(t).velocity : 0;
        return Math.hypot(gx, gy);
    };

    return {
        attach,
        detach,
        tickGlide,
        /** The additive gesture offset (rad) the scene composes onto the pose. */
        offset,
        /** True while the user is actively dragging the sphere. */
        isDragging: () => dragging,
        /** True while the release glide is still driving the offset. */
        isGliding: () => !!(glideX || glideY),
        angularVelocity,
    };
}
