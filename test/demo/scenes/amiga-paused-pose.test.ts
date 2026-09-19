// SERVED MODEL: claude-opus-5[1m]
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import * as THREE from "three";

import { warmKfEngine } from "../../../demo/kf-engine";

/**
 * X.KF.W11.h · G-KFW11-8 — THE AMIGA PACKET'S BORN-RED GATE.
 *
 * Every mechanism below was a SILENT failure before this file existed: nothing
 * threw, nothing logged, every gate in the tree stayed green, and the scene's
 * headline gesture did nothing at all.
 *
 *  · D-1 (BLOCKER) — the paused stage was pinned to HOME. The group is the ONE
 *    pose author and it authors in TWO ways: a played frame and a SCRUB
 *    (`setChildTime(anim, t).render()`, the transport's own seam) both run the
 *    group's `transform` and write `pose`. The compose read `pose` only inside
 *    the `playing` branch, so the scrubber moved, the pose moved, and the stage
 *    did not — and the gate was DOUBLED: even had the compose read it, the frame
 *    reported itself dead and the render-on-demand loop discarded it.
 *  · L-B1 (BLOCKER) — the primary gesture painted nothing: the render gate had
 *    no edge from the drag, so the ball did not turn under the finger.
 *  · D-3 + C-18 + M-3 + L-M4/C-2 — the T.A8 "never a teleport" contract was kept
 *    on stop and broken on resume, and a frame that survived a backgrounding
 *    integrated the WHOLE suspend in one step.
 *  · D-2 — the rendered DOM was one bare `<canvas>`: no role, no name, no
 *    tabindex, no keyboard path. The cure is BORROWED from SquareScene's landed
 *    subject-a11y idiom (X.KF.W11.b) and this file asserts it against that
 *    exemplar's own bytes, never against a description of them.
 *  · MISSED-E — the "gravity-flavoured bounce" was anti-gravity at the floor.
 *
 * The Three.js room is the ONE test double: jsdom has no WebGL context, so
 * `useAmigaThree` (renderer · camera · OrbitControls · the managed present loop)
 * is replaced by a seam-level stub that hands this file the scene's own
 * per-frame injection. Everything under test — the compose, the pose authority,
 * the continuity lanes, the gesture, the group, the facility — is REAL.
 */
const room = vi.hoisted(() => ({
    onFrame: undefined as undefined | (() => boolean),
    sphere: undefined as unknown,
    shadow: undefined as unknown,
    camera: undefined as unknown,
    dirty: 0,
    running: true,
}));

vi.mock("../../../demo/scenes/amiga/useAmigaThree", () => ({
    useAmigaThree: (_canvasEl: unknown, onFrame: () => boolean) => {
        room.onFrame = onFrame;
        return {
            setup: () => {},
            getSphere: () => room.sphere,
            getContactShadow: () => room.shadow,
            getCamera: () => room.camera,
            setOrbitEnabled: () => {},
            markRenderDirty: () => {
                room.dirty++;
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
}));

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import AmigaScene from "../../../demo/scenes/amiga/AmigaScene.vue";
import {
    APEX_Y,
    FLOOR_Y,
    SPHERE_HOME,
    createPoseContinuity,
    useAmigaDemo,
} from "../../../demo/scenes/amiga/useAmigaDemo";

interface Channel {
    name: string;
    progress(): number;
    setProgress(t: number): void;
}
interface Facility {
    channels: Channel[];
    isPlaying(): boolean;
    group: {
        /** The absolute-clock advance the group's own rAF loop calls. */
        advanceTo(t: number): unknown;
        pause(): void;
        resume(): void;
        stop(): void;
    };
}

/** The wall the X sweep reaches at 25 % of its period (`WALL_X`, useAmigaDemo). */
const WALL_X = 5;

let now = 0;
let nowSpy: ReturnType<typeof vi.spyOn> | undefined;

function makeCanvasMeasurable(canvas: HTMLCanvasElement, w = 200, h = 200): void {
    canvas.getBoundingClientRect = () =>
        ({
            left: 0,
            top: 0,
            width: w,
            height: h,
            right: w,
            bottom: h,
            x: 0,
            y: 0,
        }) as DOMRect;
    // jsdom has no pointer capture; stub it so the gesture wiring runs.
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
}

function firePointer(
    canvas: HTMLCanvasElement,
    type: string,
    x: number,
    y: number,
    extra: Record<string, unknown> = {},
): void {
    // jsdom lacks PointerEvent — synthesize a plain Event with the needed props.
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

describe("X.KF.W11.h · G-KFW11-8 — the amiga scene repair", () => {
    let wrapper: ReturnType<typeof mount>;
    let mesh: THREE.Mesh;
    let canvas: HTMLCanvasElement;
    let facility: Facility;

    beforeAll(async () => {
        await warmKfEngine();
    });

    beforeEach(() => {
        now = 1000;
        nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);

        mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial(),
        );
        const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        cam.position.set(0, 0, 5);
        cam.lookAt(0, 0, 0);
        cam.updateMatrixWorld(true);

        room.sphere = mesh;
        room.camera = cam;
        room.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial(),
        );
        room.onFrame = undefined;
        room.dirty = 0;

        wrapper = mount(AmigaScene);
        canvas = wrapper.find("canvas").element as HTMLCanvasElement;
        makeCanvasMeasurable(canvas);
        facility = (wrapper.vm as unknown as { facility: Facility }).facility;
    });

    afterEach(() => {
        facility.group.stop();
        wrapper.unmount();
        nowSpy?.mockRestore();
    });

    /** Advance the present loop one frame; returns the scene's own liveness. */
    const frame = (ms = 16): boolean => {
        now += ms;
        return room.onFrame!();
    };

    /** Run frames until the scene declares itself at rest (or the cap trips). */
    const settle = (cap = 400): number => {
        let n = 0;
        while (n < cap && frame()) n++;
        return n;
    };

    /** Start the real group exactly as its own rAF loop does (`advanceTo`), so
     *  `started && !paused` — playing — holds without a live jsdom rAF clock. */
    const play = (): void => {
        facility.group.advanceTo(now);
    };

    const channel = (name: string): Channel => {
        const c = facility.channels.find((ch) => ch.name === name);
        if (!c) throw new Error(`no channel ${name}`);
        return c;
    };

    describe("D-1 — the paused stage shows the scrubbed pose, not HOME", () => {
        it("a paused scene + setProgress(t) renders the scrubbed pose", () => {
            frame(); // seat the frame clock; the never-played stage rests HOME
            expect(mesh.position.x).toBe(SPHERE_HOME);

            // The transport's own seam: 25 % of the X sweep is the +wall.
            channel("Bouncing X").setProgress(0.25);
            settle();

            expect(facility.isPlaying()).toBe(false);
            expect(mesh.position.x).toBeCloseTo(WALL_X, 2);
        });

        it("the frame that consumes a scrub declares itself LIVE (the doubled gate's second half)", () => {
            frame();
            channel("Bouncing X").setProgress(0.25);
            // Born-RED here too: the compose could be un-gated and the frame
            // would STILL be discarded by the render-on-demand loop.
            expect(frame()).toBe(true);
            settle();
            // …and the scene returns to rest once the stage has caught up.
            expect(frame()).toBe(false);
        });

        it("a scrub takes the stage back from an in-flight settle (the headline sequence)", () => {
            play();
            frame();
            channel("Bouncing X").setProgress(0.25);
            settle();
            expect(mesh.position.x).toBeCloseTo(WALL_X, 2);

            // The user grabs the scrubber: the machine PAUSEs first…
            facility.group.pause();
            frame();
            frame();
            frame();
            // …the stage has begun to settle home…
            expect(Math.abs(mesh.position.x)).toBeLessThan(WALL_X);
            // …and then the scrub lands: the stage follows the SCRUB, not HOME.
            channel("Bouncing X").setProgress(0.75);
            settle();
            expect(mesh.position.x).toBeCloseTo(-WALL_X, 2);
        });

        it("a pause with NO scrub still settles HOME (T.A8 preserved, not traded away)", () => {
            play();
            frame();
            channel("Bouncing X").setProgress(0.25);
            settle();
            expect(mesh.position.x).toBeCloseTo(WALL_X, 2);

            facility.group.pause();
            const frames = settle();
            expect(frames).toBeGreaterThan(3); // a settle, never a teleport
            expect(mesh.position.x).toBeCloseTo(SPHERE_HOME, 3);
        });
    });

    describe("L-B1 — the primary gesture paints", () => {
        it("a sphere-drag at rest declares the frame LIVE and turns the ball", () => {
            frame();
            expect(frame()).toBe(false); // at true rest

            firePointer(canvas, "pointerdown", 100, 100); // centre → sphere hit
            // THE defect: the compose wrote the quaternion every frame and the
            // frame was discarded, so nothing the drag did ever reached a pixel.
            expect(frame()).toBe(true); // the grab alone is a render edge

            const before = mesh.quaternion.clone();
            firePointer(canvas, "pointermove", 140, 100); // +40 px → yaw
            expect(frame()).toBe(true);
            expect(mesh.quaternion.angleTo(before)).toBeGreaterThan(0);

            firePointer(canvas, "pointerup", 140, 100);
        });
    });

    describe("D-3 + C-18 + M-3 + L-M4/C-2 — continuity at every seam", () => {
        it("resume does not teleport: the stage travels to the live pose, it does not jump", () => {
            play();
            frame();
            channel("Bouncing X").setProgress(0.25);
            settle();

            facility.group.pause();
            for (let i = 0; i < 6; i++) frame();
            const parked = mesh.position.x; // mid-settle, somewhere below +5
            expect(parked).toBeLessThan(WALL_X);
            expect(parked).toBeGreaterThan(SPHERE_HOME);

            facility.group.resume(); // the group resumes at the SAME pose (+5)
            const firstFrame = frame();
            expect(firstFrame).toBe(true);
            // The old compose assigned `rendered = pose` in ONE frame — it
            // covered the whole gap at once, the exact `position.set` snap the
            // T.A8 contract forbids. A travel covers a fraction of it.
            const gap = Math.abs(WALL_X - parked);
            const step = Math.abs(mesh.position.x - parked);
            expect(step).toBeLessThan(gap / 4);
            settle();
            expect(mesh.position.x).toBeCloseTo(WALL_X, 2);
        });

        it("a frame that survives a suspend cannot complete the settle in one step", () => {
            play();
            frame();
            channel("Bouncing X").setProgress(0.25);
            settle();
            facility.group.pause();
            frame(); // the HOME settle is armed and live

            // The tab was backgrounded for a minute; `lastFrameAt` was never
            // re-armed, so this frame's dt used to be the WHOLE suspend and the
            // analytic spring evaluated straight to its settled value.
            frame(60_000);
            expect(Math.abs(mesh.position.x - SPHERE_HOME)).toBeGreaterThan(0.1);
        });

        it("the seam carries the channel's OWN velocity (per-channel lanes, not one progress scalar)", () => {
            // A stop seam on the linear X channel: the stage is 2 units from
            // home and STILL MOVING at 2.5 u/s — the velocity the shared
            // 0-seeded progress re-seat threw away (L-M4/C-2).
            const carried = createPoseContinuity();
            carried.seed({ px: 2, py: 0, spin: 0 }, { px: 2.5, py: 0, spin: 0 });
            // The old shape, for contrast: the same gap, seeded at v = 0.
            const kinked = createPoseContinuity();
            kinked.seed({ px: 2, py: 0, spin: 0 }, { px: 0, py: 0, spin: 0 });

            expect(carried.offset.px).toBe(2); // value-continuous at the seam
            expect(kinked.offset.px).toBe(2);

            const dt = 0.5;
            carried.tick(dt);
            kinked.tick(dt);
            const slope = ((carried.offset.px - 2) / dt) * 1000;
            // Velocity-continuous: the first step's slope IS the channel's own
            // entry velocity (2.5 u/s), bent by one half-millisecond of spring.
            expect(slope).toBeGreaterThan(2.0);
            expect(slope).toBeLessThan(2.6);
            // The 0-seeded lane leaves the seam travelling the WRONG way — the
            // kink the row names, reproduced beside the cure.
            expect(kinked.offset.px).toBeLessThan(2);

            for (let i = 0; i < 400 && carried.live; i++) carried.tick(16);
            expect(carried.live).toBe(false);
            expect(carried.offset.px).toBe(0);
        });
    });

    describe("D-2 — the subject a11y idiom, borrowed from SquareScene's LANDED cure", () => {
        it("the subject carries every a11y attribute the square's subject carries", () => {
            // Read the exemplar's own bytes (X.KF.W11.b, `3af1422b`), never a
            // description of them: a borrow from an uncured exemplar is the
            // defect this row exists to prevent (§Sequencing 7).
            const square = readFileSync(
                resolve(process.cwd(), "demo/scenes/square/SquareScene.vue"),
                "utf8",
            );
            // Comments first: the exemplar EXPLAINS its contract above the
            // element that carries it, and a naive index would read the prose.
            const markup = square.replace(/<!--[\s\S]*?-->/g, "");
            const at = markup.indexOf('role="group"');
            expect(at).toBeGreaterThan(0);
            const open = markup.lastIndexOf("<", at);
            const close = markup.indexOf(">", at);
            const subject = markup.slice(open, close);
            const exemplar = new Set(
                [...subject.matchAll(/(?:^|\s)[:@]?([a-zA-Z-]+)=/g)].map(
                    (m) => m[1]!,
                ),
            );
            for (const required of [
                "role",
                "aria-label",
                "aria-keyshortcuts",
                "aria-describedby",
                "tabindex",
            ]) {
                expect(exemplar.has(required)).toBe(true); // the exemplar's own bytes
                expect(canvas.getAttribute(required)).toBeTruthy(); // the borrow
            }
            expect(subject).toContain("kf-focus-ring");
            expect(canvas.className).toContain("kf-focus-ring");

            // The describedby target is REAL and reachable (the canvas's own
            // fallback content — the accessible subtree of a replaced element).
            const helpId = canvas.getAttribute("aria-describedby")!;
            const help = canvas.querySelector(`#${helpId}`);
            expect(help?.textContent?.trim().length ?? 0).toBeGreaterThan(20);

            // Two axis sliders, exactly as the square's 2D subject carries.
            const sliders = canvas.querySelectorAll('[role="slider"]');
            expect(sliders.length).toBe(2);
            for (const s of sliders) {
                expect(s.getAttribute("aria-label")).toBeTruthy();
                expect(s.getAttribute("aria-valuenow")).toBeTruthy();
            }
        });

        it("the keyboard path turns the ball (the subject is operable without a pointer)", () => {
            frame();
            const before = mesh.quaternion.clone();

            const ev = new KeyboardEvent("keydown", {
                key: "ArrowRight",
                bubbles: true,
                cancelable: true,
            });
            canvas.dispatchEvent(ev);
            expect(ev.defaultPrevented).toBe(true);

            expect(frame()).toBe(true); // the nudge is a render edge too
            expect(mesh.quaternion.angleTo(before)).toBeGreaterThan(0);
        });
    });

    describe("MISSED-E — the bounce is gravity-flavoured in the direction gravity works", () => {
        it("the ball is fastest at the floor slam and slowest at the apex", () => {
            // The channels are reached through the GROUP's own entries — the
            // same route the scene facility builds its channel handles from
            // (C-5: the demo returns the group and the pose sink, nothing else).
            const demo = useAmigaDemo();
            const group = demo.animationGroup as unknown as {
                animations: Record<string, { animation: KeyframesAnimation }>;
                setChildTime(anim: unknown, t: number): { render(): void };
            };
            const bouncingY = group.animations["Bouncing Y"]!.animation;
            const dur = bouncingY.options.duration ?? 1600;
            const sample = (p: number): number => {
                group.setChildTime(bouncingY, p * dur).render();
                return demo.pose.py;
            };
            const d = 0.01; // 1 % of the period
            // 0 % → 25 % is the fall to the floor; 25 % → 50 % the climb to apex.
            const floorSpeed = Math.abs(sample(0.25) - sample(0.25 - d));
            const apexSpeed = Math.abs(sample(0.5) - sample(0.5 - d));

            expect(sample(0.25)).toBeCloseTo(FLOOR_Y, 3);
            expect(sample(0.5)).toBeCloseTo(APEX_Y, 3);
            // A single symmetric bezier across all five keyframes put v = 0 at
            // the slam AND at the apex — the ball was slowest exactly where a
            // falling body is fastest, the inverse of the physics the comments
            // claim twice.
            expect(floorSpeed).toBeGreaterThan(apexSpeed * 3);
        });
    });
});
