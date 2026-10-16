// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r3res2c · COHESION §0fj item 3 — the square's axis read-out reads
 * the box's live transform.
 *
 * MEASURED at kf `cd2025d9` (`SquareScene.vue:381-389` · `:551` · `:556-565` ·
 * `:601`): the per-axis read-outs in the box's accessible subtree (the
 * SubjectAxes `role="status"` pair, the successor of the retired
 * "Horizontal/Vertical position" sliders) were a second store, written by
 * `syncReadouts()` from a drag's `onScrub` / `onEnd` and the keyboard's
 * `onTarget` only. A transport-authored pose (Reset's rewind, which the
 * renderer seats the springs on, `useSquareDemo.enginePainted`) never reached
 * it, so after a takeover drag + Escape the box rested at identity while the
 * read-outs kept the drag's values.
 *
 * The witness mounts the REAL SquareScene on a controllable rAF queue,
 * registers its playback adapter with the machine as the shell does, and
 * presses Escape through the REAL transport shortcut layer
 * (`useControlsKeyboardShortcuts` → `useAnimationGroupActions.reset` → the
 * machine's RESET). The read-outs must equal the live transform at every
 * reading: the stage header's x/y (fed by the renderer, whichever writer
 * paints) and, after Escape, the identity the box is painted at.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick, shallowRef } from "vue";
import { mount } from "@vue/test-utils";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state";
import SquareScene from "../../../demo/scenes/square/SquareScene.vue";
import { useAnimationGroupActions } from "@components/instrument/transport/composables/useAnimationGroupActions";
import { useControlsKeyboardShortcuts } from "@components/instrument/transport/composables/useControlsKeyboardShortcuts";

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
const settle = (cap = 600): void => {
    for (let i = 0; i < cap && queue.size > 0; i++) flush();
};

interface Facility {
    playback: Parameters<ReturnType<typeof useSceneMachine>["register"]>[1];
    group: { stop(): void; started: boolean; paused: boolean };
}

function pointer(el: EventTarget, type: string, x: number, y: number): void {
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event & Record<string, unknown>;
    Object.assign(ev, { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y, pointerType: "mouse" });
    el.dispatchEvent(ev);
}

/** "−0.12" / "+0.12" / "0.12" → a number (the header signs with U+2212). */
const num = (s: string): number => Number(s.trim().replace("−", "-").replace("+", "")) + 0; // −0 → 0
/** The two reads agree to the read-out's own 2 dp grain. */
const same = (a: { x: number; y: number }, b: { x: number; y: number }): void => {
    expect(Math.abs(a.x - b.x)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(0.01);
};

describe("square · the axis read-out derives from the live transform (§0fj 3)", () => {
    let wrapper: ReturnType<typeof mount>;
    let shortcuts: ReturnType<typeof createApp> | null = null;
    let release: () => void = () => {};
    let box: HTMLElement;
    let facility: Facility;

    beforeAll(async () => {
        await warmKfEngine();
    });
    beforeEach(async () => {
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
        wrapper = mount(SquareScene, { attachTo: document.body });
        await nextTick();
        box = wrapper.find(".demo-box").element as HTMLElement;
        box.getBoundingClientRect = () =>
            ({ left: 0, top: 0, width: 192, height: 192, right: 192, bottom: 192, x: 0, y: 0 }) as DOMRect;
        box.setPointerCapture = () => {};
        facility = (wrapper.vm as unknown as { facility: Facility }).facility;
        // The transport's Reset as the owner presses it: Escape through the
        // real shortcut layer, ending at the machine's one RESET.
        const host = document.createElement("div");
        document.body.appendChild(host);
        shortcuts = createApp(
            defineComponent({
                setup() {
                    const actions = useAnimationGroupActions({
                        getGroup: () => facility.group as never,
                        storedControls: {} as never,
                        findAnimationGroupObject: () => undefined,
                        syncPlayState: () => {},
                    });
                    useControlsKeyboardShortcuts({
                        toggleAnimationGroup: () => {},
                        reset: actions.reset,
                        resetIconSpin: () => {},
                        getActiveT: () => 0,
                        scrubActive: () => {},
                        cycleAnimation: () => {},
                        switchTab: () => {},
                        commands: shallowRef(null),
                    });
                    return () => h("div");
                },
            }),
        );
        shortcuts.mount(host);
    });
    afterEach(() => {
        release();
        release = () => {};
        facility.group.stop();
        shortcuts?.unmount();
        shortcuts = null;
        wrapper.unmount();
        useSceneMachine().dispatch({ type: "PAUSE" });
        window.requestAnimationFrame = prevRaf;
        window.cancelAnimationFrame = prevCancel;
    });

    /** The box's accessible read-outs (SubjectAxes, `role="status"`). */
    const axes = () =>
        Object.fromEntries(
            wrapper.findAll(".demo-box [role=status]").map((n) => {
                const [label, value] = n.text().split(/\s+/);
                return [label!, num(value!)];
            }),
        ) as { x: number; y: number };
    /** The stage header's x / y: the deflection the renderer paints. */
    const live = () => {
        const [x, y] = wrapper
            .findAll(".square-telemetry-axes .stage-readout span:last-child")
            .map((n) => num(n.text()));
        return { x: x!, y: y! };
    };
    /** The box's painted translate (px): `translate(…)` leads the transform. */
    const translate = () => {
        const m = /translate\(\s*(-?[\d.e+-]+)px,\s*(-?[\d.e+-]+)px\)/.exec(box.style.transform);
        return { tx: Number(m?.[1] ?? NaN), ty: Number(m?.[2] ?? NaN) };
    };

    const play = async () => {
        const machine = useSceneMachine();
        release = machine.register("square", facility.playback);
        machine.dispatch({ type: "NAVIGATE", to: "square" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PAUSE" }); // the singleton may rest on "playing"
        machine.dispatch({ type: "PLAY" });
        await nextTick();
        flush();
        expect(facility.group.started && !facility.group.paused).toBe(true);
    };

    it("after a takeover drag then Escape, the read-outs read identity with the box", async () => {
        await play();
        flush(30);
        // the takeover drag: grab mid-tour, pull, release; the chase comes to rest
        pointer(box, "pointerdown", 96, 96);
        for (let i = 1; i <= 4; i++) pointer(window, "pointermove", 96 + i * 8, 96 + i * 4);
        pointer(window, "pointerup", 128, 112);
        settle();
        await nextTick();
        const dragged = axes();
        // non-vacuous: the drag moved the box, and the read-out reads it
        expect(Math.abs(dragged.x) + Math.abs(dragged.y)).toBeGreaterThan(0.05);
        same(dragged, live());

        document.body.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
        );
        await nextTick();
        settle();
        await nextTick();

        const t = translate();
        expect(Math.abs(t.tx) + Math.abs(t.ty)).toBeLessThan(0.5); // the box rests at identity
        expect(live()).toEqual({ x: 0, y: 0 });
        expect(axes()).toEqual({ x: 0, y: 0 }); // …and the read-out says so
    });

    it("the read-outs follow the live chase, not a gesture's end", async () => {
        box.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
        flush(3); // mid-chase: the box has left home but not arrived
        await nextTick();
        const mid = live();
        expect(mid.x).toBeGreaterThan(0);
        expect(mid.x).toBeLessThan(0.25);
        same(axes(), mid);
        settle();
        await nextTick();
        same(axes(), live());
        expect(axes().x).toBeCloseTo(0.25, 2);
    });
});
