// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { effectScope } from "vue";

import { useOrbitalGesture } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalGesture";
import type { OrbitState } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalGesture";
import { applyScreenDelta, quatAngleBetween, shoemakeArc, sphereMap, type Quat } from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

/**
 * A touch drawn one sample back, on a busy page (cube-gestures: "a second
 * finger joining, the first lifting, and a third finger never jump the die").
 *
 * Under load a phone's touches reach the page about 22 ms apart, each one
 * 13 to 19 ms after its own time, against 8.3 ms frames. A frame whose
 * instant has passed the newest sample holds the die there; when the next
 * sample lands, the frame must not show the time it held in one step. The
 * die resumes from where it stood and catches up over the following frames.
 *
 * The rubric is the browser spec's: a frame's change (turn × R/2 + pan + zoom
 * × side) is a JUMP when it is over 4 px and over three times the median of
 * the moving frames within six on either side.
 */

const SIDE = 200;
/** side 200 → h 100 → R = 2h = 200 (no stage cap). */
const R = 200;
const FRAME = 1000 / 120;

type Step = { type: "down" | "move" | "up"; pts: Array<{ id: number; x: number; y: number }> };

const ev = (type: string, id: number, x: number, y: number, t: number) => {
    const e = new PointerEvent(type, { clientX: x * R, clientY: y * R, pointerId: id, pointerType: "touch", bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

/** The browser spec's hand, in R units about the die's centre. */
function hand(): Step[] {
    const A = (x: number, y: number) => ({ id: 1, x, y });
    const B = (x: number, y: number) => ({ id: 2, x, y });
    const C = (x: number, y: number) => ({ id: 3, x, y });
    const s: Step[] = [{ type: "down", pts: [A(-0.4, 0)] }];
    for (let i = 1; i <= 10; i++) s.push({ type: "move", pts: [A(-0.4 + 0.03 * i, 0)] });
    s.push({ type: "down", pts: [B(0.3, 0.2)] });
    for (let i = 1; i <= 10; i++) s.push({ type: "move", pts: [A(-0.1, 0.02 * i), B(0.3, 0.2 + 0.02 * i)] });
    s.push({ type: "down", pts: [C(0, 0.6)] });
    for (let i = 1; i <= 8; i++) s.push({ type: "move", pts: [A(-0.1 - 0.01 * i, 0.2), B(0.3 + 0.01 * i, 0.4), C(0, 0.6 + 0.01 * i)] });
    s.push({ type: "up", pts: [C(0, 0.68)] });
    s.push({ type: "up", pts: [A(-0.18, 0.2)] });
    for (let i = 1; i <= 10; i++) s.push({ type: "move", pts: [B(0.38 - 0.03 * i, 0.4)] });
    return s;
}

/**
 * Replay `steps` `gap` ms apart, each delivered `delays[i % n]` ms after its
 * own time, against frames every `frame` ms; return each frame's change (px).
 */
/** A fresh reader on a 200 px die (R 200), with its state. */
function reader(onCommit: () => void = () => {}) {
    const container = document.createElement("div");
    document.body.append(container);
    const state: OrbitState = { q: [0, 0, 0, 1], t: { x: 0, y: 0 }, s: 1 };
    const scope = effectScope();
    const gesture = scope.run(() =>
        useOrbitalGesture({
            surfaceRef: () => container,
            scrollOwner: () => "stage",
            G: attitudeQuat(),
            state,
            frame: () => ({ centre: { x: 0, y: 0 }, side: SIDE, fit: 1, stage: null }),
            scaleRange: [0.4, 3],
            requestCommit: onCommit,
            onGestureStart: () => {},
            onGestureEnd: () => {},
        }),
    )!;
    return {
        gesture,
        state,
        dispose: () => {
            scope.stop();
            container.remove();
        },
    };
}

/**
 * `idles`: OrbitalDrag's own frame loop, which runs a frame only when a move
 * asked for one or the last frame was still settling, and idles between a
 * hand's samples otherwise (the hand is not shown in the frames it skips).
 */
function replay(gap: number, delays: number[], frame = FRAME, { idles = false } = {}): { d: number[]; stalls: number } {
    let asked = false;
    const { gesture, state, dispose } = reader(() => (asked = true));
    let last: string = "idle";
    const steps = hand();
    const queue = steps.map((s, i) => ({ s, t: 100 + i * gap, d: 100 + i * gap + delays[i % delays.length]! }));
    const poses: Array<{ q: Quat; t: { x: number; y: number }; s: number }> = [];
    const end = queue[queue.length - 1]!.d + 200;
    let qi = 0;
    for (let now = 100; now < end; now += frame) {
        while (qi < queue.length && queue[qi]!.d <= now) {
            const { s, t } = queue[qi++]!;
            for (const p of s.pts) {
                if (s.type === "down") gesture.onPointerDown(ev("pointerdown", p.id, p.x, p.y, t));
                else document.dispatchEvent(ev(s.type === "move" ? "pointermove" : "pointerup", p.id, p.x, p.y, t));
            }
        }
        if (!idles || asked || last === "settling") {
            asked = false;
            last = gesture.handAt(now);
        }
        poses.push({ q: [...state.q] as Quat, t: { ...state.t }, s: state.s });
    }
    dispose();
    const d: number[] = [];
    for (let i = 1; i < poses.length; i++) {
        const a = poses[i - 1]!;
        const b = poses[i]!;
        d.push((quatAngleBetween(a.q, b.q) * R) / 2 + Math.hypot(b.t.x - a.t.x, b.t.y - a.t.y) + Math.abs(Math.log(b.s / a.s)) * SIDE);
    }
    // A stall: a frame that holds the die between two that move it.
    let stalls = 0;
    for (let i = 1; i + 1 < d.length; i++) if (d[i]! < 0.05 && d[i - 1]! > 0.05 && d[i + 1]! > 0.05) stalls++;
    return { d, stalls };
}

/** The browser spec's rubric. */
const jumpsOf = (d: number[]) =>
    d.filter((v, i) => {
        const near = d.slice(Math.max(0, i - 6), i + 7).filter((x, j) => x > 0.05 && j !== Math.min(6, i));
        const med = near.sort((a, b) => a - b)[near.length >> 1] ?? 0;
        return v > 4 && v > 3 * Math.max(med, 1);
    });

/** The share of the stream's frames (first moving frame to last) that move the die. */
const movingShare = (d: number[]) => {
    const first = d.findIndex((v) => v > 0.05);
    const last = d.length - 1 - [...d].reverse().findIndex((v) => v > 0.05);
    const span = d.slice(first, last + 1);
    return span.filter((v) => v > 0.05).length / span.length;
};

describe("a touch on a busy page: late samples never jump the die", () => {
    it("samples 22 ms apart, delivered 13 to 19 ms late, 8.3 ms frames: no jump", () => {
        const { d } = replay(22, [13, 19, 14, 17, 13, 19, 15, 18, 16, 13]);
        expect(d.filter((v) => v > 0.05).length).toBeGreaterThan(40);
        expect(jumpsOf(d)).toEqual([]);
    });

    it("samples 26 ms apart, delivered 10 to 24 ms late: no jump", () => {
        const { d } = replay(26, [10, 24, 12, 21, 10, 19, 24, 11]);
        expect(jumpsOf(d)).toEqual([]);
    });

    it("an unloaded 60 Hz hand, delivered 4 ms late: no jump and no held frame", () => {
        const { d, stalls } = replay(1000 / 60, [4]);
        expect(jumpsOf(d)).toEqual([]);
        expect(stalls).toBe(0);
    });

    // The browser's own cadence (cube-gestures, the spec's hand at 390x844,
    // read per frame on production and on this branch): each step 25 to 33 ms
    // after the last, seen 23 ms after its own time, and the frame loop idling
    // whenever the hand had nothing new. Counted from the sample's own time, the
    // frame that saw a step showed it whole and the next two held: one frame in
    // three moved the die. Now every frame of the stream moves it but those of
    // the hand's own pauses (a finger set down or lifted holds it for a step)
    // and one at the first step, seen before the page's delay is known.
    it("the frame loop idling between samples 25 ms apart, seen 23 ms late: no jump, and the frames move the die", () => {
        const { d, stalls } = replay(25, [23, 24, 22, 23], FRAME, { idles: true });
        expect(jumpsOf(d)).toEqual([]);
        expect(stalls).toBeLessThanOrEqual(1);
        expect(movingShare(d)).toBeGreaterThanOrEqual(0.85);
    });

    it("the frame loop idling between samples 32 ms apart, seen 23 ms late: no jump, and most frames move the die", () => {
        const { d } = replay(32, [23, 24, 22, 23], FRAME, { idles: true });
        expect(jumpsOf(d)).toEqual([]);
        expect(movingShare(d)).toBeGreaterThanOrEqual(0.75);
    });

    // The browser spec's "one finger tracks 1:1": a hand moved in steps 50 ms
    // apart (each step sent once the last has landed) is shown at its newest
    // step within 2 px two frames after the step lands.
    it("a slow hand moving in steps is shown at its newest step within two frames", () => {
        const { gesture, state, dispose } = reader();
        const G = attitudeQuat();
        const p0 = { x: -0.45, y: 0.1 };
        gesture.onPointerDown(ev("pointerdown", 1, p0.x, p0.y, 0));
        let now = 0;
        for (let k = 0; k < 4; k++) gesture.handAt((now += FRAME));
        let worst = 0;
        for (let i = 1; i <= 16; i++) {
            const u = { x: -0.45 + 0.05 * i, y: 0.1 - 0.012 * i };
            while (now < 50 * i) gesture.handAt((now += FRAME));
            now += FRAME;
            document.dispatchEvent(ev("pointermove", 1, u.x, u.y, now - 3));
            gesture.handAt(now);
            gesture.handAt((now += FRAME));
            gesture.handAt((now += FRAME));
            const want = applyScreenDelta([0, 0, 0, 1], shoemakeArc(sphereMap(p0.x, p0.y), sphereMap(u.x, u.y)), G);
            worst = Math.max(worst, (quatAngleBetween(state.q, want) * R) / 2);
        }
        dispose();
        expect(worst).toBeLessThanOrEqual(2);
    });
});
