// H.W5 S6/A5 — the amiga sphere is the interactive subject: a pointer-drag on
// the MESH spins it, and on RELEASE the engine `decay()` glide coasts the spin
// to rest (the cube dogfood idiom, inv-ζ). This locks the A5 contract
// (`proof:amiga-engine-drives-mesh`, WV-W5-MED-3): after a pointer-drag-RELEASE
// the mesh `rotation` keeps changing for ≥N frames under the closed-form glide
// — NOT under autoplay, and INDEPENDENT of the camera orbit.
//
// The drive path is the engine's SHIPPED analytic `decay()` (same surface the
// orbital inertia consumes). The test exercises `useSphereSpin` directly with a
// real Three.js sphere + camera + canvas, so the raycast hit-test, the velocity
// accumulation, and the post-release glide are all real.

import { beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { useSphereSpin } from "../demo/amiga/useSphereSpin";

/** A canvas whose getBoundingClientRect is deterministic (jsdom returns 0×0). */
function makeCanvas(w = 200, h = 200): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h, x: 0, y: 0 }) as DOMRect;
    // jsdom has no pointer-capture; stub it so the gesture wiring runs.
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    return canvas;
}

function fire(
    canvas: HTMLCanvasElement,
    type: string,
    x: number,
    y: number,
): void {
    // jsdom lacks PointerEvent — synthesize a plain Event with the needed props.
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    ev.pointerId = 1;
    ev.clientX = x;
    ev.clientY = y;
    canvas.dispatchEvent(ev);
}

describe("useSphereSpin — the amiga A5 engine-drives-mesh contract", () => {
    let mesh: THREE.Mesh;
    let camera: THREE.PerspectiveCamera;
    let canvas: HTMLCanvasElement;
    let orbitEnabled: boolean;
    let spin: ReturnType<typeof useSphereSpin>;

    beforeEach(() => {
        // A unit sphere at the origin, a camera looking straight down -Z at it,
        // so a raycast through canvas-center (NDC 0,0) hits the sphere.
        mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial(),
        );
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld(true);

        canvas = makeCanvas();
        orbitEnabled = true;

        spin = useSphereSpin({
            getMesh: () => mesh,
            getCamera: () => camera,
            setOrbitEnabled: (e) => {
                orbitEnabled = e;
            },
            friction: 2.4,
            sensitivity: 0.01,
        });
        spin.attach(canvas);
    });

    it("a center-grab hit-tests the sphere and stands the camera orbit down", () => {
        fire(canvas, "pointerdown", 100, 100); // canvas center → NDC (0,0) → hit
        expect(spin.isDragging()).toBe(true);
        expect(orbitEnabled).toBe(false); // orbit suppressed for the spin gesture
    });

    it("a miss falls through to OrbitControls (no spin gesture, orbit stays on)", () => {
        // A corner well outside the sphere's screen projection.
        fire(canvas, "pointerdown", 2, 2);
        expect(spin.isDragging()).toBe(false);
        expect(orbitEnabled).toBe(true);
    });

    it("dragging the sphere mutates its rotation live", () => {
        const y0 = mesh.rotation.y;
        fire(canvas, "pointerdown", 100, 100);
        fire(canvas, "pointermove", 140, 100); // +40px horizontal → yaw
        expect(mesh.rotation.y).not.toBe(y0);
        expect(mesh.rotation.y).toBeGreaterThan(y0); // dx>0 → +yaw at sensitivity>0
    });

    it("RELEASE seeds a decay() glide that drives the mesh for ≥N frames, slowing monotonically", () => {
        // A fast flick: large per-move deltas with a short wall-clock dt → high
        // release velocity. We control the clock so the velocity is deterministic.
        let now = 1000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);

        fire(canvas, "pointerdown", 100, 100);
        for (let i = 0; i < 5; i++) {
            now += 8; // ~8ms between moves (a brisk flick)
            fire(canvas, "pointermove", 100 + (i + 1) * 24, 100);
        }
        now += 8;
        fire(canvas, "pointerup", 100 + 6 * 24, 100);

        expect(spin.isGliding()).toBe(true); // a glide was armed at release

        // Advance the render-loop glide tick frame-by-frame; the mesh rotation
        // must keep changing for many frames AND the per-frame delta must shrink
        // (the engine decay bleeds velocity off — not a constant spin).
        const deltas: number[] = [];
        let prevY = mesh.rotation.y;
        let liveFrames = 0;
        for (let f = 0; f < 40; f++) {
            now += 16; // ~60fps
            const live = spin.tickGlide();
            const dy = Math.abs(mesh.rotation.y - prevY);
            if (dy > 0) liveFrames++;
            deltas.push(dy);
            prevY = mesh.rotation.y;
            if (!live) break;
        }

        // ≥N frames of post-release motion (the WV-W5-MED-3 "≥N frames" clause).
        expect(liveFrames).toBeGreaterThanOrEqual(10);

        // Monotonic slow-down: a later-frame delta is strictly smaller than an
        // early-frame delta (the decay glide, not a constant-velocity spin).
        const early = deltas[1]!;
        const late = deltas.find((_, i) => i >= 8 && deltas[i]! > 0)!;
        expect(late).toBeLessThan(early);

        // The glide eventually rests (velocity bled below the rest threshold).
        let rested = false;
        for (let f = 0; f < 600 && !rested; f++) {
            now += 16;
            if (!spin.tickGlide()) rested = true;
        }
        expect(rested).toBe(true);
        expect(spin.isGliding()).toBe(false);

        nowSpy.mockRestore();
    });

    it("a static tap (no flick velocity) arms no glide", () => {
        let now = 2000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);
        fire(canvas, "pointerdown", 100, 100);
        now += 200; // a long, still press — no movement
        fire(canvas, "pointerup", 100, 100);
        expect(spin.isGliding()).toBe(false);
        nowSpy.mockRestore();
    });
});
