// H.W5 S6/A5 — the amiga sphere is the interactive subject: a pointer-drag on
// the MESH spins it, and on RELEASE the engine `decay()` glide coasts the spin
// to rest (the cube dogfood idiom, inv-ζ). This locks the A5 contract
// (`proof:amiga-engine-drives-mesh`, WV-W5-MED-3): after a pointer-drag-RELEASE
// the accumulated spin keeps changing for ≥N frames under the closed-form glide
// — NOT under autoplay, and INDEPENDENT of the camera orbit.
//
// T.A7 (ARMING-AUDIT re-arm): the gesture is now an ADDITIVE LAYER. It no longer
// writes `mesh.rotation` (a second writer racing the group compositor); it
// accumulates into a stable `spin.offset` object the SCENE composes onto the mesh
// (the ONE mesh writer). So the contract is now asserted on `spin.offset.y`, and
// the glide drives THAT offset — the pre-gesture pose is preserved by construction.
//
// The drive path is the engine's SHIPPED analytic `decay()` (same surface the
// orbital inertia consumes). The test exercises `useSphereSpin` directly with a
// real Three.js sphere + camera + canvas, so the raycast hit-test, the velocity
// accumulation, and the post-release glide are all real.

import { beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { useSphereSpin } from "../../../demo/scenes/amiga/useSphereSpin";

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
    extra: Record<string, unknown> = {},
): void {
    // jsdom lacks PointerEvent — synthesize a plain Event with the needed props.
    // X.KF.W11.h — `isPrimary`/`button` join the shape because a real
    // PointerEvent always carries them and MISSED-G's guards read them; `extra`
    // lets a case pose as a second touch or a secondary button.
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    ev.pointerId = 1;
    ev.isPrimary = true;
    ev.button = 0;
    ev.clientX = x;
    ev.clientY = y;
    Object.assign(ev, extra);
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

    it("dragging the sphere accumulates the additive spin offset live (T.A7 — not the mesh)", () => {
        const y0 = spin.offset.y;
        fire(canvas, "pointerdown", 100, 100);
        fire(canvas, "pointermove", 140, 100); // +40px horizontal → yaw
        // T.A7: the gesture writes the ADDITIVE offset, never the mesh directly.
        expect(spin.offset.y).not.toBe(y0);
        expect(spin.offset.y).toBeGreaterThan(y0); // dx>0 → +yaw at sensitivity>0
        // The gesture is NOT a second mesh writer — the mesh is untouched by the
        // gesture layer (the scene composes offset onto it, the ONE writer).
        expect(mesh.rotation.y).toBe(0);
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

        // Advance the render-loop glide tick frame-by-frame; the ADDITIVE offset
        // (T.A7) must keep changing for many frames AND the per-frame delta must
        // shrink (the engine decay bleeds velocity off — not a constant spin).
        const deltas: number[] = [];
        let prevY = spin.offset.y;
        let liveFrames = 0;
        for (let f = 0; f < 40; f++) {
            now += 16; // ~60fps
            const live = spin.tickGlide();
            const dy = Math.abs(spin.offset.y - prevY);
            if (dy > 0) liveFrames++;
            deltas.push(dy);
            prevY = spin.offset.y;
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

    // ── X.KF.W11.h — the gesture rows of the amiga scene-repair packet ───────

    it("MISSED-G — a second touch does not steal the active drag", () => {
        fire(canvas, "pointerdown", 100, 100); // pointer 1 owns the gesture
        expect(spin.isDragging()).toBe(true);
        const owned = spin.offset.y;

        // A second finger lands on the sphere mid-drag. It used to overwrite
        // `activePointer` outright, so pointer 1's moves were ignored from that
        // instant and its release could not end the gesture.
        fire(canvas, "pointerdown", 100, 100, { pointerId: 2, isPrimary: false });
        fire(canvas, "pointermove", 140, 100, { pointerId: 2, isPrimary: false });
        expect(spin.offset.y).toBe(owned); // the intruder moves nothing

        fire(canvas, "pointermove", 140, 100); // pointer 1 still owns it
        expect(spin.offset.y).toBeGreaterThan(owned);
        fire(canvas, "pointerup", 140, 100);
        expect(spin.isDragging()).toBe(false);
    });

    it("MISSED-G — a secondary-button press is not a spin gesture", () => {
        fire(canvas, "pointerdown", 100, 100, { button: 2 });
        expect(spin.isDragging()).toBe(false);
        // …and orbit is NOT stood down, so the surface is not hijacked behind a
        // `preventDefault` the user cannot undo.
        expect(orbitEnabled).toBe(true);
    });

    it("L-M1/C-8 — a flick that went stale before release arms no glide", () => {
        let now = 5000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);

        fire(canvas, "pointerdown", 100, 100);
        for (let i = 0; i < 4; i++) {
            now += 8;
            fire(canvas, "pointermove", 100 + (i + 1) * 24, 100);
        }
        // The finger comes to REST on the ball for half a second, then lifts.
        // `velX/velY` are written only by `pointermove`, so the release used to
        // hand the glide a velocity that was 500 ms out of date.
        now += 500;
        fire(canvas, "pointerup", 196, 100);

        expect(spin.isGliding()).toBe(false);
        expect(spin.angularVelocity()).toBe(0);
        nowSpy.mockRestore();
    });

    it("L-M1/C-8 — a coalesced sample pair cannot amplify the release impulse", () => {
        let now = 7000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);

        fire(canvas, "pointerdown", 100, 100);
        now += 0.2; // two samples 200 µs apart — a coalesced delivery
        fire(canvas, "pointermove", 124, 100); // 24 px in 0.2 ms
        fire(canvas, "pointerup", 124, 100);

        // 24 px × 0.01 rad/px = 0.24 rad. Under the old 1 ms floor that read as
        // 240 rad/s — 38 turns a second from one flick of the wrist. The floor
        // is now a real sampling period (240 Hz), so the impulse is bounded by
        // the physics of a hand, not by an event-delivery artefact.
        expect(spin.angularVelocity()).toBeLessThan(100);
        expect(spin.angularVelocity()).toBeGreaterThan(0);
        nowSpy.mockRestore();
    });

    it("D-2 — the keyboard nudge writes the SAME additive offset, and Home rests it", () => {
        const y0 = spin.offset.y;
        spin.nudge(0, Math.PI / 8);
        expect(spin.offset.y).toBeCloseTo(y0 + Math.PI / 8, 6);
        expect(mesh.rotation.y).toBe(0); // still not a second mesh writer

        spin.nudge(Math.PI / 30, 0);
        expect(spin.offset.x).toBeCloseTo(Math.PI / 30, 6);

        spin.rest();
        expect(spin.offset.x).toBe(0);
        expect(spin.offset.y).toBe(0);
        expect(spin.isGliding()).toBe(false);
    });
});
