// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.amiga — the Amiga scene's register rows, falsified at the scene.
 *
 *  · KFA-19  — a drag turns the ball about the SCREEN axis (a trackball), at any
 *              attitude: after a quarter-turn pitch a horizontal drag still moves
 *              the front of the ball sideways under the finger.
 *  · KFA-65  — the gesture composes INSIDE the Boing spin: a pitched ball still
 *              spins about the authentic tilted world axis.
 *  · KFA-20  — an arrow nudge is a visible turn (several painted frames), not a
 *              one-frame texture-symmetry swap.
 *  · KFA-130 — Home carries the ball back to rest over several frames.
 *  · KFA-128 — the glide steps on the FRAME clock the present loop hands in.
 *  · KFA-129 — the release impulse reads the flick window, not the last sample.
 *  · KFA-66  — every bounce reaches the same apex (the loop seam is an apex).
 *  · KFA-126 / UIA-KF-023 — a transport stop edge hands the stage to HOME, even
 *              when the group's last played write lands between two frames.
 *  · UIA-KF-197 — Home also brings the room view home.
 *  · UIA-KF-291 — the per-axis values are read-only readouts, not inert sliders.
 *
 * The Three.js room is the one test double (jsdom has no WebGL), exactly as in
 * amiga-paused-pose.test.ts; the compose, the gesture, the group are real.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import * as THREE from "three";

import { warmKfEngine } from "../../../demo/kf-engine";

const room = vi.hoisted(() => ({
    onFrame: undefined as undefined | ((now: number) => boolean),
    sphere: undefined as unknown,
    shadow: undefined as unknown,
    camera: undefined as unknown,
    homeViews: 0,
    running: true,
}));

vi.mock("../../../demo/scenes/amiga/useAmigaThree", async (importOriginal) => {
    const real = await importOriginal<Record<string, unknown>>();
    return {
        ...real,
        useAmigaThree: (_canvasEl: unknown, onFrame: (now: number) => boolean) => {
            room.onFrame = onFrame;
            return {
                setup: () => {},
                getSphere: () => room.sphere,
                getContactShadow: () => room.shadow,
                getCamera: () => room.camera,
                setOrbitEnabled: () => {},
                markRenderDirty: () => {},
                homeView: () => {
                    room.homeViews++;
                },
                get running() {
                    return room.running;
                },
                start: () => {
                    room.running = true;
                },
                stop: () => {
                    room.running = false;
                },
                dispose: () => {},
            };
        },
    };
});

import AmigaScene from "../../../demo/scenes/amiga/AmigaScene.vue";
import { APEX_Y, BOX_SIZE, SPHERE_HOME, useAmigaDemo } from "../../../demo/scenes/amiga/useAmigaDemo";
import { useSphereSpin } from "../../../demo/scenes/amiga/useSphereSpin";

interface Channel {
    name: string;
    setProgress(t: number): void;
}
interface Facility {
    channels: Channel[];
    group: { advanceTo(t: number): unknown; pause(): void; stop(): void };
}

const TILT = new THREE.Vector3(Math.sin(0.28), Math.cos(0.28), 0).normalize();

let now = 0;
let jitter = 0;

function measurable(canvas: HTMLCanvasElement, w = 200, h = 200): void {
    canvas.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h, x: 0, y: 0 }) as DOMRect;
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
}

function pointer(canvas: HTMLCanvasElement, type: string, x: number, y: number): void {
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    Object.assign(ev, { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y });
    canvas.dispatchEvent(ev);
}

function key(canvas: HTMLCanvasElement, k: string): void {
    canvas.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
}

describe("X.KF.W13X.amiga — the scene rows", () => {
    let wrapper: ReturnType<typeof mount>;
    let mesh: THREE.Mesh;
    let canvas: HTMLCanvasElement;
    let facility: Facility;
    let nowSpy: ReturnType<typeof vi.spyOn> | undefined;

    beforeAll(async () => {
        await warmKfEngine();
    });

    beforeEach(() => {
        now = 1000;
        jitter = 0;
        nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now + jitter);
        mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial());
        const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        cam.position.set(0, 0, 5);
        cam.lookAt(0, 0, 0);
        cam.updateMatrixWorld(true);
        room.sphere = mesh;
        room.camera = cam;
        room.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial());
        room.homeViews = 0;
        wrapper = mount(AmigaScene);
        canvas = wrapper.find("canvas").element as HTMLCanvasElement;
        measurable(canvas);
        facility = (wrapper.vm as unknown as { facility: Facility }).facility;
    });

    afterEach(() => {
        facility.group.stop();
        wrapper.unmount();
        nowSpy?.mockRestore();
    });

    const frame = (ms = 16): boolean => {
        now += ms;
        return room.onFrame!(now);
    };
    const settle = (cap = 400): number => {
        let n = 0;
        while (n < cap && frame()) n++;
        return n;
    };
    const angle = (): number => mesh.quaternion.angleTo(new THREE.Quaternion());
    const channel = (name: string): Channel => facility.channels.find((c) => c.name === name)!;
    /** A quarter-turn pitch: 157 px down at 0.01 rad/px, released stale (no coast). */
    const pitchQuarter = (): void => {
        pointer(canvas, "pointerdown", 100, 100);
        pointer(canvas, "pointermove", 100, 257);
        now += 200;
        pointer(canvas, "pointerup", 100, 257);
        settle();
    };

    it("KFA-19 — after a quarter-turn pitch, a horizontal drag still moves the ball's front sideways", () => {
        frame();
        pitchQuarter();
        const facing = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion.clone().invert());
        pointer(canvas, "pointerdown", 100, 100);
        pointer(canvas, "pointermove", 105, 100); // +0.05 rad
        frame();
        const moved = facing.clone().applyQuaternion(mesh.quaternion);
        expect(moved.x).toBeGreaterThan(0.04);
        now += 200;
        pointer(canvas, "pointerup", 105, 100);
    });

    it("KFA-65 — a pitched ball still spins about the tilted WORLD axis", () => {
        frame();
        pitchQuarter();
        channel("Spin").setProgress(0.05);
        settle();
        const q1 = mesh.quaternion.clone();
        channel("Spin").setProgress(0.1);
        settle();
        const r = mesh.quaternion.clone().multiply(q1.clone().invert());
        const axis = new THREE.Vector3(r.x, r.y, r.z).normalize();
        expect(Math.abs(axis.dot(TILT))).toBeGreaterThan(0.99);
    });

    it("KFA-20 — an arrow nudge paints a turn across several frames and lands on a sixteenth", () => {
        frame();
        key(canvas, "ArrowRight");
        const seen: number[] = [];
        for (let i = 0; i < 60; i++) {
            frame();
            seen.push(angle());
        }
        expect(new Set(seen.map((a) => a.toFixed(4))).size).toBeGreaterThanOrEqual(5);
        expect(seen.at(-1)!).toBeCloseTo(Math.PI / 8, 3);
    });

    it("KFA-130 — Home carries the ball back to rest, it does not snap", () => {
        frame();
        key(canvas, "ArrowRight");
        key(canvas, "ArrowDown");
        settle();
        expect(angle()).toBeGreaterThan(0.3);
        key(canvas, "Home");
        frame();
        expect(angle()).toBeGreaterThan(0.05);
        const frames = settle();
        expect(frames).toBeGreaterThan(3);
        expect(angle()).toBeLessThan(1e-3);
    });

    it("UIA-KF-197 — Home also brings the room view home", () => {
        frame();
        key(canvas, "Home");
        expect(room.homeViews).toBeGreaterThan(0);
    });

    it("KFA-128 — the glide steps on the frame clock, so an even frame cadence coasts evenly", () => {
        frame();
        pointer(canvas, "pointerdown", 100, 100);
        for (let i = 1; i <= 6; i++) {
            now += 16;
            pointer(canvas, "pointermove", 100 + i, 100); // 1 px per frame
        }
        pointer(canvas, "pointerup", 106, 100);
        let prev = angle();
        const steps: number[] = [];
        for (let i = 0; i < 24; i++) {
            jitter = i % 2 === 0 ? 6 : -6; // the main thread's wall clock wobbles; the frame clock does not
            frame();
            const a = angle();
            steps.push(a - prev);
            prev = a;
        }
        jitter = 0;
        for (let i = 2; i < steps.length; i++) {
            expect(steps[i]!).toBeLessThanOrEqual(steps[i - 1]! + 1e-9);
        }
    });

    it("KFA-66 — the Y loop's seam is an apex: every bounce reaches the same height", () => {
        const demo = useAmigaDemo();
        const group = demo.animationGroup as unknown as {
            animations: Record<string, { animation: { options: { duration?: number } } }>;
            setChildTime(anim: unknown, t: number): { render(): void };
        };
        const y = group.animations["Bouncing Y"]!.animation;
        const dur = y.options.duration ?? 1600;
        const at = (p: number): number => {
            group.setChildTime(y, p * dur).render();
            return demo.pose.py;
        };
        expect(at(0)).toBeCloseTo(APEX_Y, 3);
        expect(at(0.5)).toBeCloseTo(APEX_Y, 3);
        expect(at(1)).toBeCloseTo(APEX_Y, 3);
    });

    it("KFA-126 / UIA-KF-023 — a pause whose last played write lands between frames still settles HOME", () => {
        facility.group.advanceTo(now); // play
        frame();
        channel("Bouncing X").setProgress(0.25); // the stage travels to the wall
        settle();
        expect(mesh.position.x).toBeGreaterThan(4);
        // The group's last write lands between two frames (its loop and the
        // compose are not phase-locked, C-17), and the pause arrives before the
        // compose has read it.
        channel("Bouncing Y").setProgress(0.3);
        facility.group.pause();
        const frames = settle();
        expect(frames).toBeGreaterThan(3); // a settle, not a teleport
        expect(mesh.position.x).toBeCloseTo(SPHERE_HOME, 3);
        expect(mesh.position.y).toBeCloseTo(SPHERE_HOME, 3);
    });

    it("UIA-KF-023 / UIA-KF-197 — a transport stop settles every channel HOME and brings the view home", () => {
        facility.group.advanceTo(now);
        frame();
        channel("Bouncing X").setProgress(0.25);
        settle();
        facility.group.stop(); // the transport's Reset (useAnimationGroupActions.reset)
        settle();
        expect(mesh.position.x).toBeCloseTo(SPHERE_HOME, 3);
        expect(mesh.position.y).toBeCloseTo(SPHERE_HOME, 3);
        expect(room.homeViews).toBeGreaterThan(0);
    });

    it("KFA-125 / KFA-196 — the contact shadow stays on the floor at a wall apex, and never vanishes", () => {
        frame();
        channel("Bouncing X").setProgress(0.25); // the +wall
        channel("Bouncing Y").setProgress(0.5); // an apex
        settle();
        const shadow = room.shadow as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
        const reach = Math.abs(shadow.position.x) + 1.3 * shadow.scale.x; // the room's shadow plate is 2.6 u wide: half-extent 1.3 x scale
        expect(reach).toBeLessThanOrEqual(BOX_SIZE / 2 + 1e-6);
        expect(shadow.material.opacity).toBeGreaterThan(0.05);
    });

    it("UIA-KF-291 — the per-axis values are read-only readouts, never an inert slider", () => {
        const inert = [...canvas.querySelectorAll<HTMLElement>('[role="slider"]')].filter(
            (s) => s.tabIndex < 0,
        );
        expect(inert.length).toBe(0);
        const readouts = [...canvas.querySelectorAll('[role="status"]')].map((e) => e.textContent?.trim());
        expect(readouts).toEqual(["yaw 0°", "pitch 0°"]);
    });
});

describe("X.KF.W13X.amiga — KFA-129 the release impulse", () => {
    it("reads the flick window, so one jittered last sample cannot set the coast", () => {
        let t = 1000;
        const spy = vi.spyOn(performance, "now").mockImplementation(() => t);
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial());
        const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        cam.position.set(0, 0, 5);
        cam.lookAt(0, 0, 0);
        cam.updateMatrixWorld(true);
        const canvas = document.createElement("canvas");
        measurable(canvas);
        const spin = useSphereSpin({
            getMesh: () => mesh,
            getCamera: () => cam,
            setOrbitEnabled: () => {},
        });
        spin.attach(canvas);
        pointer(canvas, "pointerdown", 100, 100);
        let x = 100;
        for (let i = 0; i < 5; i++) {
            t += 16;
            x += 10;
            pointer(canvas, "pointermove", x, 100); // an even 10 px / 16 ms
        }
        t += 6;
        x += 10;
        pointer(canvas, "pointermove", x, 100); // one sample landed early
        pointer(canvas, "pointerup", x, 100);
        const omega = spin.angularVelocity(); // the coast's seeded speed (rad/s)
        const even = (10 * 0.01) / 0.016; // 6.25 rad/s
        expect(omega).toBeGreaterThan(even * 0.8);
        expect(omega).toBeLessThan(even * 1.25);
        spin.detach();
        spy.mockRestore();
    });
});
