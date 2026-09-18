/**
 * test/demo/instrument/timeline-mount-projection.test.ts — KF.W7 G11 fixture 1
 * (pointer-guard + grab-offset + rebuild-rate), the coverage the gate's leg (i)
 * convicts as absent: before this file, ZERO tests named the timeline surface.
 *
 * It MOUNTS the real `TimelineTrack` SFC over the real glass `Tooltip` (the
 * published `@mkbabb/glass-ui/tooltip` subpath — the house idiom, 6 other demo
 * call sites) through the house `createApp` harness the repo already uses for
 * interaction gates (`kf-toolbar-keyboard.test.ts`), attached to `document.body`
 * so focus and hit wiring are live. Nothing is stubbed but the two things jsdom
 * does not implement: layout (`getBoundingClientRect` on the rail) and pointer
 * capture. The rail is 400px — the low end of the real `--rail-width`
 * `clamp(25rem, 33svi, 32rem)` = 400–512px (the banked "800px track" and
 * "~600px rail" are fictions; kf-TimelineTrack D-12's citation correction).
 *
 * Gates asserted here:
 *   • G2 (guard half, re-asserted where a gate can read it) — non-primary press,
 *     right-button press and a second contact (pinch) begin NO gesture.
 *   • G3 — a grab is not a teleport: the first pointermove at zero pointer delta
 *     emits the PRE-GRAB percent exactly, and a mid-drag delete ends the gesture
 *     rather than driving a dangling id into the sink (L-m-14).
 *   • G4 — rebuild economics: ≤1 build per animation frame across a 60-move
 *     drag; ZERO builds (and zero state mutation, hence zero `useRefHistory`
 *     entries) on a zero-clamped-delta hold.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, reactive, ref, type App } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TimelineTrack from "@components/instrument/timeline/components/TimelineTrack.vue";
import { useTimelineOps } from "@components/instrument/timeline/composables/useTimelineOps";
import type {
    TimelineKeyframe,
    TimelineState,
} from "@components/instrument/timeline/timelineTypes";
import { percentSelector } from "@utils/keyframeSelector";

/** The rail width every projection assertion below is computed against. */
const RAIL = 400;

const kf = (id: string, percent: number): TimelineKeyframe => ({
    id,
    selector: percentSelector(percent),
    percent,
    vars: { opacity: "1" },
});

interface Harness {
    host: HTMLElement;
    app: App;
    rail: HTMLElement;
    markers: () => HTMLElement[];
    /** `update:scrubT` payloads, in order. */
    scrubs: number[];
    /** `moveKeyframe` payloads, in order. */
    moves: Array<[string, number]>;
    /** `select` payloads, in order. */
    selects: string[];
    state: { keyframes: TimelineKeyframe[]; scrubT: number; selectedId: string | null };
}

const mounted: Harness[] = [];

afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.app.unmount();
        m.host.remove();
    }
});

/** jsdom has neither layout nor pointer capture — supply exactly those two. */
function equip(rail: HTMLElement): void {
    rail.getBoundingClientRect = () =>
        ({
            left: 0,
            top: 0,
            width: RAIL,
            height: 48,
            right: RAIL,
            bottom: 48,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }) as DOMRect;
    const captured = new Set<number>();
    rail.setPointerCapture = (id: number) => void captured.add(id);
    rail.releasePointerCapture = (id: number) => void captured.delete(id);
    rail.hasPointerCapture = (id: number) => captured.has(id);
}

function mount(keyframes: TimelineKeyframe[]): Harness {
    const state = reactive({
        keyframes,
        scrubT: 0,
        selectedId: null as string | null,
    });
    const scrubs: number[] = [];
    const moves: Array<[string, number]> = [];
    const selects: string[] = [];

    const host = document.createElement("div");
    document.body.appendChild(host);

    const app = createApp(
        defineComponent({
            setup() {
                const trackProps = () => ({
                    sortedKeyframes: state.keyframes,
                    scrubT: state.scrubT,
                    selectedKeyframeId: state.selectedId,
                    previewCache: {},
                    previewLoading: {},
                    "onUpdate:scrubT": (t: number) => {
                        scrubs.push(t);
                        state.scrubT = t;
                    },
                    onMoveKeyframe: (id: string, percent: number) => {
                        moves.push([id, percent]);
                    },
                    onSelect: (id: string) => {
                        selects.push(id);
                        state.selectedId = id;
                    },
                });
                return () =>
                    h(TooltipProvider, null, {
                        default: () => h(TimelineTrack, trackProps()),
                    });
            },
        }),
    );
    app.mount(host);

    const rail = host.querySelector(".timeline-track") as HTMLElement;
    equip(rail);

    const harness: Harness = {
        host,
        app,
        rail,
        markers: () => [...host.querySelectorAll<HTMLElement>(".keyframe-marker")],
        scrubs,
        moves,
        selects,
        state,
    };
    mounted.push(harness);
    return harness;
}

/** jsdom lacks PointerEvent — synthesize a plain Event carrying what we read. */
function pointer(
    el: HTMLElement,
    type: string,
    clientX: number,
    over: Record<string, unknown> = {},
): Event {
    const ev = new Event(type, { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    ev.pointerId = 1;
    ev.isPrimary = true;
    ev.button = 0;
    ev.buttons = 1;
    ev.clientX = clientX;
    ev.clientY = 24;
    Object.assign(ev, over);
    el.dispatchEvent(ev);
    return ev;
}

describe("KF.W7 G2 (guard half) — one pointer policy over the whole handler set", () => {
    it("declines a right-button press, a non-primary contact, and a pinch", () => {
        const h1 = mount([kf("a", 50)]);

        // Each declined contact is lifted, exactly as the platform delivers it.
        pointer(h1.rail, "pointerdown", 100, { button: 2, buttons: 2 });
        expect(h1.scrubs).toEqual([]);
        pointer(h1.rail, "pointerup", 100, { button: 2, buttons: 0 });

        pointer(h1.rail, "pointerdown", 100, { isPrimary: false, pointerId: 2 });
        expect(h1.scrubs).toEqual([]);
        pointer(h1.rail, "pointerup", 100, { pointerId: 2 });

        // A primary press scrubs to the projected percent — 100/400 = 25%.
        pointer(h1.rail, "pointerdown", 100);
        expect(h1.scrubs).toEqual([0.25]);

        // A second contact ENDS the live gesture and suppresses until all lift.
        pointer(h1.rail, "pointerdown", 300, { pointerId: 2 });
        pointer(h1.rail, "pointermove", 320, { pointerId: 1 });
        pointer(h1.rail, "pointermove", 340, { pointerId: 2 });
        expect(h1.scrubs).toEqual([0.25]);

        // Both lift; a fresh primary press is admitted again.
        pointer(h1.rail, "pointerup", 320, { pointerId: 1 });
        pointer(h1.rail, "pointerup", 340, { pointerId: 2 });
        pointer(h1.rail, "pointerdown", 200);
        expect(h1.scrubs).toEqual([0.25, 0.5]);
    });

    it("ignores a button-held pointer that merely ENTERS the band", () => {
        const h1 = mount([kf("a", 50)]);
        // No pointerdown on the rail: a text-selection drag begun elsewhere.
        pointer(h1.rail, "pointermove", 120, { buttons: 1 });
        expect(h1.scrubs).toEqual([]);
    });
});

describe("KF.W7 G3 — a grab is not a teleport", () => {
    it("emits the PRE-GRAB percent on the first move at zero pointer delta", async () => {
        const h1 = mount([kf("a", 50)]);
        const marker = h1.markers()[0]!;
        expect(marker).toBeTruthy();

        // The marker sits at 50% ⇒ x = 200px. Grab it +11px off centre — the
        // real worst case inside the 24px pad: 11/400 = 2.75% at z=1, itself
        // ~3× the component's finest keyboard increment.
        pointer(marker, "pointerdown", 211);
        expect(h1.selects).toEqual(["a"]);
        expect(h1.moves).toEqual([]);

        // First move at the SAME clientX: a grab, not a teleport.
        pointer(h1.rail, "pointermove", 211);
        expect(h1.moves).toEqual([["a", 50]]);

        // ...and the offset is carried, not re-applied: +50px ⇒ +12.5%.
        pointer(h1.rail, "pointermove", 261);
        expect(h1.moves[1]).toEqual(["a", 62.5]);

        // The grab alone mutates nothing, so the deep-cloned `useRefHistory`
        // over `state` banks nothing for it (G4's dirty check is the other
        // half, asserted at the ops seam below).
        expect(h1.moves.filter(([, p]) => p !== 50).length).toBe(1);
    });

    it("drags a multi-member stop as ONE, every member to the same percent", () => {
        const h1 = mount([kf("a", 50), kf("b", 50)]);
        expect(h1.markers().length).toBe(1);
        const marker = h1.markers()[0]!;
        pointer(marker, "pointerdown", 200);
        pointer(h1.rail, "pointermove", 300);
        expect(h1.moves).toEqual([
            ["a", 75],
            ["b", 75],
        ]);
    });

    it("L-m-14 — a mid-drag delete ends the gesture instead of dangling an id", async () => {
        const h1 = mount([kf("a", 50)]);
        const marker = h1.markers()[0]!;
        pointer(marker, "pointerdown", 200);
        pointer(h1.rail, "pointermove", 220);
        expect(h1.moves.length).toBe(1);

        // The frame is deleted under the drag (an undo, a ✕, an import).
        h1.state.keyframes.splice(0, 1);
        pointer(h1.rail, "pointermove", 240);
        expect(h1.moves.length).toBe(1); // no dangling id reaches the sink
        expect(h1.rail.hasPointerCapture(1)).toBe(false); // capture released
    });
});

describe("KF.W7 G4 — the rebuild rate is bounded and dirty-checked", () => {
    const opsHarness = () => {
        const state = ref<TimelineState>({
            keyframes: [kf("a", 50)],
            captureProperties: ["opacity"],
            animationName: "test",
        });
        const scrubT = ref(0);
        const targets = ref<HTMLElement[]>([]);
        let builds = 0;
        // The builder is ASYNC (G14 · L-11): the ops seam now takes
        // `() => Promise<void>` so the build's settlement is visible to it. The
        // counter still increments SYNCHRONOUSLY on entry, which is what the
        // per-frame assertions below read.
        const ops = useTimelineOps(state, scrubT, targets, async () => {
            builds++;
        });
        return { state, ops, builds: () => builds };
    };

    /** One frame of rAF, driven by hand so the assertion is deterministic. */
    const frame = (fns: FrameRequestCallback[]) => {
        const due = fns.splice(0);
        for (const fn of due) fn(performance.now());
    };

    it("collapses a 60-move drag to ONE build per animation frame", () => {
        const queued: FrameRequestCallback[] = [];
        const raf = vi
            .spyOn(globalThis, "requestAnimationFrame")
            .mockImplementation((fn: FrameRequestCallback) => {
                queued.push(fn);
                return queued.length;
            });

        const { ops, builds } = opsHarness();
        for (let i = 0; i < 60; i++) ops.moveKeyframe("a", 50 + i * 0.1);
        expect(builds()).toBe(0); // nothing built DURING the frame
        expect(queued.length).toBe(1); // one latch, not sixty
        frame(queued);
        expect(builds()).toBe(1);

        raf.mockRestore();
    });

    it("builds ZERO times on a zero-clamped-delta hold, and mutates nothing", () => {
        const queued: FrameRequestCallback[] = [];
        const raf = vi
            .spyOn(globalThis, "requestAnimationFrame")
            .mockImplementation((fn: FrameRequestCallback) => {
                queued.push(fn);
                return queued.length;
            });

        const { state, ops, builds } = opsHarness();
        // A drag held past the rail end: every move clamps to the same 100%.
        ops.moveKeyframe("a", 100);
        frame(queued);
        expect(builds()).toBe(1);

        const held = JSON.stringify(state.value.keyframes);
        for (let i = 0; i < 60; i++) ops.moveKeyframe("a", 100 + i);
        expect(queued.length).toBe(0); // nothing even scheduled
        frame(queued);
        expect(builds()).toBe(1); // still the one build the real move earned
        // ...and a same-percent write leaves the state byte-identical, so the
        // deep-cloned `useRefHistory` records no undo step for the hold.
        expect(JSON.stringify(state.value.keyframes)).toBe(held);
        expect(state.value.keyframes[0]!.percent).toBe(100);

        raf.mockRestore();
    });
});
