// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.square — the Square scene's register rows, falsified at the scene.
 *
 *  · KFA-34  — a hand's diagonal drag never flips the stretch axis frame to frame.
 *  · KFA-92  — a horizontal pull leans the SIDES against the travel (the top
 *              trails), eases in rather than snapping to a cap on frame one.
 *  · KFA-186 — an ordinary drag reads as mass, not distortion: the stretch and
 *              the lean are never both pinned together.
 *  · KFA-94 / UIA-KF-199 — a grab mid-tour keeps the painted scale, and the box
 *              comes back upright in its own rest colour.
 *  · KFA-90 / KFA-91 / KFA-206 — the tour starts and ends on the rest identity
 *              and never passes through grey.
 *  · KFA-98 / KFA-97 / KFA-207 — the tumble takes off from the box's own colour,
 *              lands as a thunk (no second half-turn), and its marker clears
 *              when the box comes to rest.
 *  · KFA-93 / UIA-KF-293 — a held drag stays in drag mode, and so does the
 *              release fling until the springs come to rest.
 *  · KFA-147 — a tap flashes no drag affordance.
 *  · KFA-96  — Play mid-tumble retires the spin loop and its sweep.
 *  · UIA-KF-026 — Reset returns the scene to its rest identity, in sync.
 *  · UIA-KF-088 — the coordinate field draws both axes.
 *
 * The frame loop is real; rAF is a controllable queue (scene-contract-identity's
 * harness) so every frame is deterministic.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { parseCssColor } from "@mkbabb/value.js/css";
import { convertColor } from "@mkbabb/value.js/color";

import { withSetup } from "../../support/withSetup";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state";
import { useSquareDemo } from "../../../demo/scenes/square/useSquareDemo";
import SquareScene from "../../../demo/scenes/square/SquareScene.vue";
import SquareInstrument from "../../../demo/scenes/square/SquareInstrument.vue";

const REST = "#52e898";

// ── a controllable rAF queue ──────────────────────────────────────────────
let queue = new Map<number, FrameRequestCallback>();
let nextId = 1;
let clock = 0;
let prevRaf: typeof window.requestAnimationFrame;
let prevCancel: typeof window.cancelAnimationFrame;
const flush = (n = 1): void => {
    for (let i = 0; i < n; i++) {
        clock += 16;
        const current = queue;
        queue = new Map();
        for (const cb of current.values()) cb(clock);
    }
};
const pending = (): number => queue.size;

beforeEach(() => {
    queue = new Map();
    clock = 1000;
    prevRaf = window.requestAnimationFrame;
    prevCancel = window.cancelAnimationFrame;
    window.requestAnimationFrame = (cb: FrameRequestCallback) => {
        const id = nextId++;
        queue.set(id, cb);
        return id;
    };
    window.cancelAnimationFrame = (id: number) => {
        queue.delete(id);
    };
});
afterEach(() => {
    window.requestAnimationFrame = prevRaf;
    window.cancelAnimationFrame = prevCancel;
});

// ── the painted 2D matrix, composed from the inline transform string ──────
type M = [number, number, number, number, number, number]; // a b c d e f
const mul = (p: M, q: M): M => [
    p[0] * q[0] + p[2] * q[1],
    p[1] * q[0] + p[3] * q[1],
    p[0] * q[2] + p[2] * q[3],
    p[1] * q[2] + p[3] * q[3],
    p[0] * q[4] + p[2] * q[5] + p[4],
    p[1] * q[4] + p[3] * q[5] + p[5],
];
const rad = (v: string) => (parseFloat(v) * Math.PI) / 180;
function matrixOf(transform: string): M {
    let m: M = [1, 0, 0, 1, 0, 0];
    for (const [, fn, raw] of transform.matchAll(/([a-zA-Z]+)\(([^)]*)\)/g)) {
        const a = raw!.split(",").map((s) => s.trim());
        let q: M;
        if (fn === "translate") q = [1, 0, 0, 1, parseFloat(a[0]!), parseFloat(a[1] ?? "0")];
        else if (fn === "rotate") {
            const t = rad(a[0]!);
            q = [Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), 0, 0];
        } else if (fn === "skew") q = [1, Math.tan(rad(a[1] ?? "0")), Math.tan(rad(a[0]!)), 1, 0, 0];
        else if (fn === "skewX") q = [1, 0, Math.tan(rad(a[0]!)), 1, 0, 0];
        else if (fn === "skewY") q = [1, Math.tan(rad(a[0]!)), 0, 1, 0, 0];
        else if (fn === "scale") q = [parseFloat(a[0]!), 0, 0, parseFloat(a[1] ?? a[0]!), 0, 0];
        else throw new Error(`unparsed transform function ${fn}`);
        m = mul(m, q);
    }
    return m;
}
/** Rotation, principal stretch axis (deg, mod 180), anisotropy and shear. */
function readPose(el: HTMLElement) {
    const [a, b, c, d, e, f] = matrixOf(el.style.transform);
    const A = a * a + c * c;
    const B = a * b + c * d;
    const C = b * b + d * d;
    const axis = (0.5 * Math.atan2(2 * B, A - C) * 180) / Math.PI;
    const tr = (A + C) / 2;
    const dt = Math.sqrt(((A - C) / 2) ** 2 + B * B);
    const s1 = Math.sqrt(tr + dt);
    const s2 = Math.sqrt(Math.max(0, tr - dt));
    const cos = (a * c + b * d) / (Math.hypot(a, b) * Math.hypot(c, d));
    const shear = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI - 90;
    return { a, b, c, d, tx: e, ty: f, rot: (Math.atan2(b, a) * 180) / Math.PI, axis, aniso: s1 / s2 - 1, s1, shear };
}
const fillOf = (el: HTMLElement) => el.style.getPropertyValue("--subject-fill").trim();
function oklch(css: string): [number, number, number] {
    const parsed = parseCssColor(css);
    if (!parsed.ok) throw new Error(`not a colour: ${css}`);
    const c = convertColor(parsed.value, "oklch");
    if (!c.ok) throw new Error(`no oklch for ${css}`);
    return c.value.channels as unknown as [number, number, number];
}
function deltaE(x: string, y: string): number {
    const [l1, c1, h1] = oklch(x);
    const [l2, c2, h2] = oklch(y);
    const a1 = c1 * Math.cos((h1 * Math.PI) / 180);
    const b1 = c1 * Math.sin((h1 * Math.PI) / 180);
    const a2 = c2 * Math.cos((h2 * Math.PI) / 180);
    const b2 = c2 * Math.sin((h2 * Math.PI) / 180);
    return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

// ── the composable: the drag's mass, the takeover, the tour's colour, the tumble ──
describe("X.KF.W13X.square — the composable rows", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    const setup = () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const [demo, app] = withSetup(() => useSquareDemo(ref(el)));
        demo.anim.setTargets(el);
        demo.paintRest();
        return { el, demo, done: () => (app.unmount(), el.remove()) };
    };

    it("KFA-34 — a hand's diagonal never flips the stretch axis between frames (no width pops)", () => {
        const { el, demo, done } = setup();
        try {
            // the painted footprint of a 192 px box: a flip of the stretch axis between
            // a tall and a wide rhombus pops the bounding width by tens of px per frame
            const widths: number[] = [];
            for (let i = 1; i <= 40; i++) {
                const j = i % 2 ? 0.006 : -0.006;
                demo.reseat(i * 0.02 + j, i * 0.02 - j);
                flush();
                const p = readPose(el);
                widths.push(192 * (Math.abs(p.a) + Math.abs(p.c)));
            }
            let pop = 0;
            for (let i = 1; i < widths.length; i++) pop = Math.max(pop, Math.abs(widths[i]! - widths[i - 1]!));
            expect(pop).toBeLessThan(6);
        } finally {
            done();
        }
    });

    it("KFA-92 — a horizontal pull leans the sides (the top trails) and eases in", () => {
        const { el, demo, done } = setup();
        try {
            demo.reseat(0.8, 0);
            flush();
            const first = readPose(el);
            expect(Math.abs(first.shear)).toBeLessThan(2); // no one-frame jump to a cap
            flush(5);
            const p = readPose(el);
            // x̂ stays horizontal (the top and bottom edges do not slant) …
            expect(Math.abs(p.b)).toBeLessThan(1e-3);
            // … and the vertical edges lean against the travel: the top trails.
            expect(p.c).toBeGreaterThan(0.01);
        } finally {
            done();
        }
    });

    it("KFA-186 — an ordinary drag never pins the stretch and the lean together", () => {
        const { el, demo, done } = setup();
        try {
            let pinned = 0;
            let maxShear = 0;
            for (let i = 1; i <= 12; i++) {
                demo.reseat(i * 0.05, i * 0.05);
                flush();
                const p = readPose(el);
                maxShear = Math.max(maxShear, Math.abs(p.shear));
                if (p.aniso >= 0.15 && Math.abs(p.shear) >= 7) pinned++;
            }
            flush(30);
            expect(pinned).toBe(0);
            expect(maxShear).toBeLessThan(7);
        } finally {
            done();
        }
    });

    it("KFA-94 / UIA-KF-199 — a grab mid-tour keeps the painted scale, then the box rests upright in its rest colour", () => {
        const { el, demo, done } = setup();
        try {
            demo.anim.interpFrames(0.45 * demo.anim.options.duration, true);
            const painted = readPose(el);
            expect(Math.abs(painted.rot)).toBeGreaterThan(90);
            demo.seatFromPose();
            // the first loop frame paints the painted scale; the carrier then
            // decays it without a pop (the old seat jumped 6.5 % in one frame)
            flush();
            let prev = readPose(el).s1;
            expect(Math.abs(prev / painted.s1 - 1)).toBeLessThan(0.005);
            for (let i = 0; i < 10; i++) {
                flush();
                const s1 = readPose(el).s1;
                expect(Math.abs(s1 / prev - 1)).toBeLessThan(0.02);
                prev = s1;
            }
            for (let i = 0; i < 400 && pending() > 0; i++) flush();
            const rest = readPose(el);
            expect(Math.abs(rest.rot)).toBeLessThan(0.5);
            const fill = fillOf(el);
            expect(fill === "" || deltaE(fill, REST) < 0.02).toBe(true);
        } finally {
            done();
        }
    });

    it("KFA-90 / KFA-91 — the tour starts and ends on the rest identity and never goes grey", () => {
        const { el, demo, done } = setup();
        try {
            const duration = demo.anim.options.duration;
            demo.anim.interpFrames(0, true);
            expect(deltaE(fillOf(el), REST)).toBeLessThan(0.02);
            let minChroma = Infinity;
            for (let i = 0; i <= 50; i++) {
                demo.anim.interpFrames((i / 50) * duration, true);
                minChroma = Math.min(minChroma, oklch(fillOf(el))[1]);
            }
            expect(deltaE(fillOf(el), REST)).toBeLessThan(0.02);
            expect(minChroma).toBeGreaterThan(0.08);
        } finally {
            done();
        }
    });

    it("KFA-98 / KFA-207 / KFA-97 — the tumble leaves from the rest colour, lands as a thunk, and its marker clears at rest", () => {
        const { el, demo, done } = setup();
        try {
            demo.tumble();
            const frames: { rot: number; fill: string; marker: boolean }[] = [];
            let unwrapped = 0;
            let last = readPose(el).rot;
            for (let i = 0; i < 400 && pending() > 0; i++) {
                flush();
                const p = readPose(el);
                let d = p.rot - last;
                if (d > 180) d -= 360;
                if (d < -180) d += 360;
                unwrapped += d;
                last = p.rot;
                frames.push({ rot: unwrapped, fill: fillOf(el), marker: el.hasAttribute("data-palette-sweep") });
            }
            const firstPainted = frames.find((f) => f.fill !== "")!;
            expect(deltaE(firstPainted.fill, REST)).toBeLessThan(0.05); // KFA-98
            expect(Math.max(...frames.map((f) => f.rot)) - 360).toBeLessThan(10); // KFA-207
            let restAt = 0;
            for (let i = 1; i < frames.length; i++) {
                if (Math.abs(frames[i]!.rot - frames[i - 1]!.rot) > 0.2) restAt = i;
            }
            const markerEnd = frames.reduce((m, f, i) => (f.marker ? i : m), 0);
            expect(markerEnd - restAt).toBeLessThan(16); // KFA-97: ≤ 250 ms after rest
        } finally {
            done();
        }
    });
});

// ── the mounted scene: the FSM, the transport's edges, the field ──────────
interface Facility {
    playback: Parameters<ReturnType<typeof useSceneMachine>["register"]>[1];
    channels: { setProgress(t: number): void }[];
    group: { play(): unknown; stop(): void; started: boolean; paused: boolean };
}
function pointer(el: Element, type: string, x: number, y: number): void {
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event & Record<string, unknown>;
    Object.assign(ev, { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y, pointerType: "mouse" });
    el.dispatchEvent(ev);
}

describe("X.KF.W13X.square — the mounted scene rows", () => {
    let wrapper: ReturnType<typeof mount>;
    let box: HTMLElement;
    let facility: Facility;
    let release: () => void = () => {};

    beforeAll(async () => {
        await warmKfEngine();
    });
    beforeEach(async () => {
        wrapper = mount(SquareScene, { attachTo: document.body });
        await nextTick();
        box = wrapper.find(".demo-box").element as HTMLElement;
        box.getBoundingClientRect = () =>
            ({ left: 0, top: 0, width: 192, height: 192, right: 192, bottom: 192, x: 0, y: 0 }) as DOMRect;
        box.setPointerCapture = () => {};
        facility = (wrapper.vm as unknown as { facility: Facility }).facility;
    });
    afterEach(() => {
        release();
        facility.group.stop();
        wrapper.unmount();
        const machine = useSceneMachine();
        machine.dispatch({ type: "PAUSE" });
    });
    const mode = () => box.dataset.squareMode;
    const settle = (cap = 400) => {
        for (let i = 0; i < cap && pending() > 0; i++) flush();
    };
    /** The App's lifecycle: the scene's playback adapter registered on the
     *  machine (the ONE path to the group), then PLAY. */
    const play = async () => {
        const machine = useSceneMachine();
        release = machine.register("square", facility.playback);
        machine.dispatch({ type: "NAVIGATE", to: "square" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PAUSE" }); // a known edge: the singleton may rest on "playing"
        machine.dispatch({ type: "PLAY" });
        await nextTick();
        flush(); // the group is `started` from its first tick
        expect(facility.group.started && !facility.group.paused).toBe(true);
    };

    it("KFA-93 / UIA-KF-293 — a held drag stays in drag mode, and so does the release fling until rest", async () => {
        pointer(box, "pointerdown", 96, 96);
        for (let i = 1; i <= 6; i++) pointer(window as unknown as Element, "pointermove", 96 + i * 10, 96 + i * 10);
        settle(); // the springs arrive under a still pointer
        await nextTick();
        expect(mode()).toBe("drag");
        pointer(window as unknown as Element, "pointermove", 96 + 200, 96 + 200);
        flush(2);
        pointer(window as unknown as Element, "pointerup", 96 + 200, 96 + 200);
        flush(2);
        await nextTick();
        expect(mode()).toBe("drag"); // the fling is still moving the box
        settle();
        await nextTick();
        expect(mode()).toBe("idle");
    });

    it("KFA-147 — a tap flashes no drag affordance", async () => {
        const seen: string[] = [];
        pointer(box, "pointerdown", 96, 96);
        await nextTick();
        seen.push(mode()!, String(box.classList.contains("demo-box--dragging")));
        flush();
        pointer(window as unknown as Element, "pointerup", 96, 96);
        await nextTick();
        seen.push(mode()!);
        expect(seen).not.toContain("drag");
        expect(seen).not.toContain("true");
    });

    it("KFA-96 — Play mid-tumble retires the spin loop and its sweep", async () => {
        pointer(box, "pointerdown", 96, 96);
        pointer(box, "pointerup", 96, 96);
        pointer(box, "pointerdown", 96, 96);
        pointer(box, "pointerup", 96, 96);
        flush(8);
        expect(box.hasAttribute("data-palette-sweep")).toBe(true); // the tumble is live
        await play();
        flush(20);
        expect(box.hasAttribute("data-palette-sweep")).toBe(false);
        // one writer: the painted rotation is the tour's own (0 → 360 over the loop)
        const tour = readPose(box).rot;
        flush(1);
        expect(Math.abs(readPose(box).rot - tour)).toBeLessThan(5);
    });

    it("UIA-KF-026 — Play → drag takeover → Reset returns the scene to its rest identity, and Home keeps it", async () => {
        await play();
        flush(30);
        pointer(box, "pointerdown", 96, 96);
        pointer(window as unknown as Element, "pointermove", 140, 110);
        pointer(window as unknown as Element, "pointerup", 140, 110);
        flush(4);
        // the transport's Reset: `stop()` rewinds, then the machine rests
        facility.group.stop();
        useSceneMachine().dispatch({ type: "PAUSE" });
        await nextTick();
        flush(40);
        const p = readPose(box);
        expect(Math.abs(p.tx) + Math.abs(p.ty)).toBeLessThan(0.5);
        expect(Math.abs(p.rot)).toBeLessThan(0.5);
        const fill = fillOf(box);
        expect(fill === "" || deltaE(fill, REST) < 0.02).toBe(true);
        await nextTick();
        expect(wrapper.find(".square-telemetry [class*=badge]").text()).toBe("settled");
        expect(mode()).toBe("idle");
        box.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
        settle();
        const h = readPose(box);
        expect(Math.abs(h.rot)).toBeLessThan(0.5);
        expect(Math.abs(h.tx) + Math.abs(h.ty)).toBeLessThan(0.5);
    });
});

describe("X.KF.W13X.square — the instrument", () => {
    it("UIA-KF-088 — the field draws both axes: each idiom class on its own layer", () => {
        const w = mount(SquareInstrument, {
            props: { deflX: 0, deflY: 0, settled: true, tetherActive: false, tumbleHintShown: false, tourHintShown: false, travel: 110 },
        });
        const x = w.findAll(".stage-field-x");
        const y = w.findAll(".stage-field-y");
        expect(x).toHaveLength(1);
        expect(y).toHaveLength(1);
        // two classes that both write `background-image` on ONE element: the later rule wins
        expect(x[0]!.element).not.toBe(y[0]!.element);
        w.unmount();
    });
});
