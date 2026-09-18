/**
 * test/demo/instrument/timeline-mount-keyboard.test.ts — KF.W7 G11 fixture 2
 * (keyboard parity, non-destructive selection, the caret read gesture, the one
 * wheel policy). The half of the cluster's coverage that no test in the tree
 * reaches: `timeline-undo.test.ts` (a read-only witness) exercises the same
 * state WITHOUT the surface.
 *
 * Same harness law as fixture 1: the real SFCs, the real glass `Tooltip` through
 * its published subpath, the house `createApp` mount attached to `document.body`
 * (so `document.activeElement` is live — MISS-α2's whole subject), and nothing
 * stubbed but jsdom's two absences (layout on the rail, pointer capture).
 *
 * Gates asserted here:
 *   • G8 — every pointer verb has a keyboard route (scrub · zoom · pan · select ·
 *     retime); NO inspection keystroke mutates the document (M3); the argless
 *     `snapshot()` captures at the keyboard user's position (D-1's adopted harm);
 *     Enter/Escape leave the caret editor without stranding focus on `<body>`.
 *   • G7 — a read gesture writes nothing: open the caret editor and blur without
 *     typing ⇒ ZERO commits; the display returns at MODEL precision.
 *   • G13 — the wheel does not eat the page: prevent ONLY on consumed events;
 *     shift-wheel pans on whichever axis the engine delivers; the pan readout is
 *     operable; the open caret editor is wheel-shielded by an is-editing guard.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive, ref, type App } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TimelineTrack from "@components/instrument/timeline/components/TimelineTrack.vue";
import TimelineCaret from "@components/instrument/timeline/TimelineCaret.vue";
import { useTimelineOps } from "@components/instrument/timeline/composables/useTimelineOps";
import type {
    TimelineKeyframe,
    TimelineState,
} from "@components/instrument/timeline/timelineTypes";
import { percentSelector } from "@utils/keyframeSelector";

const RAIL = 400;

const kf = (id: string, percent: number): TimelineKeyframe => ({
    id,
    selector: percentSelector(percent),
    percent,
    vars: { opacity: "1" },
});

const teardown: Array<{ app: App; host: HTMLElement }> = [];

afterEach(() => {
    for (const t of teardown.splice(0)) {
        t.app.unmount();
        t.host.remove();
    }
});

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

interface TrackHarness {
    host: HTMLElement;
    rail: HTMLElement;
    markers: () => HTMLElement[];
    scrubs: number[];
    moves: Array<[string, number]>;
    selects: string[];
    state: { keyframes: TimelineKeyframe[]; scrubT: number; selectedId: string | null };
}

function mountTrack(keyframes: TimelineKeyframe[], selectedId: string | null = null) {
    const state = reactive({ keyframes, scrubT: 0, selectedId });
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
    teardown.push({ app, host });
    const rail = host.querySelector(".timeline-track") as HTMLElement;
    equip(rail);
    const harness: TrackHarness = {
        host,
        rail,
        markers: () => [...host.querySelectorAll<HTMLElement>(".keyframe-marker")],
        scrubs,
        moves,
        selects,
        state,
    };
    return harness;
}

function key(el: HTMLElement, k: string, over: Record<string, unknown> = {}): Event {
    const ev = new Event("keydown", { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    ev.key = k;
    ev.shiftKey = false;
    ev.ctrlKey = false;
    ev.metaKey = false;
    Object.assign(ev, over);
    el.dispatchEvent(ev);
    return ev;
}

function wheel(el: HTMLElement, over: Record<string, unknown> = {}): Event {
    const ev = new Event("wheel", { bubbles: true, cancelable: true }) as Event &
        Record<string, unknown>;
    ev.deltaX = 0;
    ev.deltaY = 100;
    ev.clientX = 200;
    ev.clientY = 24;
    ev.ctrlKey = false;
    ev.metaKey = false;
    ev.shiftKey = false;
    Object.assign(ev, over);
    el.dispatchEvent(ev);
    return ev;
}

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

describe("KF.W7 G8 — the playhead has a keyboard route (D-1)", () => {
    it("the rail is a focusable slider that scrubs on Arrow / Home / End / Page", async () => {
        const t = mountTrack([kf("a", 50)]);
        expect(t.rail.getAttribute("role")).toBe("slider");
        expect(t.rail.getAttribute("tabindex")).toBe("0");
        expect(t.rail.getAttribute("aria-valuenow")).toBe("0");

        key(t.rail, "ArrowRight");
        expect(t.scrubs.at(-1)).toBeCloseTo(0.01, 6);
        await nextTick();

        expect(t.rail.getAttribute("aria-valuenow")).toBe("1");
        expect(t.rail.getAttribute("aria-valuetext")).toBe("1%");

        key(t.rail, "ArrowRight", { shiftKey: true });
        expect(t.scrubs.at(-1)).toBeCloseTo(0.11, 6);

        // Each keystroke reads the position the previous one published, so the
        // prop is allowed to settle between them — as it does between two real
        // key events.
        key(t.rail, "Home");
        await nextTick();
        expect(t.scrubs.at(-1)).toBe(0);
        key(t.rail, "End");
        await nextTick();
        expect(t.scrubs.at(-1)).toBe(1);
        key(t.rail, "PageDown");
        await nextTick();
        expect(t.scrubs.at(-1)).toBeCloseTo(0.9, 6);
        key(t.rail, "PageUp");
        await nextTick();
        expect(t.scrubs.at(-1)).toBe(1);

        // The keystroke is consumed, so the page does not also scroll.
        expect(key(t.rail, "ArrowLeft").defaultPrevented).toBe(true);
        // ...and an unrelated key is NOT consumed.
        expect(key(t.rail, "a").defaultPrevented).toBe(false);
    });

    it("a marker keystroke does not ALSO scrub the rail", () => {
        const t = mountTrack([kf("a", 50)]);
        key(t.markers()[0]!, "ArrowRight");
        expect(t.moves).toEqual([["a", 51]]);
        expect(t.scrubs).toEqual([]);
    });

    it("the argless snapshot captures at the keyboard user's position (D-1's harm)", () => {
        const state = ref<TimelineState>({
            keyframes: [],
            captureProperties: ["opacity"],
            animationName: "test",
        });
        const scrubT = ref(0);
        const el = document.createElement("div");
        document.body.appendChild(el);
        const targets = ref<HTMLElement[]>([el]);
        const ops = useTimelineOps(state, scrubT, targets, () => {});
        // The keyboard route moved the playhead; the ribbon's argless call
        // must land there, not at 0%.
        scrubT.value = 0.42;
        ops.snapshot();
        expect(state.value.keyframes[0]!.percent).toBeCloseTo(42, 6);
        el.remove();
    });
});

describe("KF.W7 G8 — selection is non-destructive (M3 · D-8)", () => {
    it("Enter and Space select WITHOUT retiming", () => {
        const t = mountTrack([kf("a", 50)]);
        const marker = t.markers()[0]!;
        key(marker, "Enter");
        expect(t.selects).toEqual(["a"]);
        expect(t.moves).toEqual([]);
        key(marker, " ");
        expect(t.selects).toEqual(["a", "a"]);
        expect(t.moves).toEqual([]);
    });

    it("the selected stop says so in the accessibility tree (D-8)", async () => {
        const t = mountTrack([kf("a", 50)], "a");
        await nextTick();
        expect(t.markers()[0]!.getAttribute("data-state")).toBe("selected");
        const u = mountTrack([kf("b", 50)]);
        expect(u.markers()[0]!.getAttribute("data-state")).not.toBe("selected");
    });
});

describe("KF.W7 G7 — a read gesture writes nothing (the caret)", () => {
    interface CaretHarness {
        host: HTMLElement;
        display: () => HTMLElement | null;
        input: () => HTMLInputElement | null;
        commits: number[];
        selects: number;
        marker: HTMLElement;
    }

    function mountCaret(percent: number): CaretHarness {
        const commits: number[] = [];
        let selects = 0;
        const host = document.createElement("div");
        document.body.appendChild(host);
        // The sibling `role="slider"` marker the caret hands focus back to.
        const marker = document.createElement("div");
        marker.id = "timeline-marker-a";
        marker.setAttribute("role", "slider");
        marker.tabIndex = 0;
        host.appendChild(marker);
        const mountPoint = document.createElement("div");
        host.appendChild(mountPoint);
        const app = createApp(
            defineComponent({
                setup() {
                    const caretProps = () => ({
                        keyframeId: "a",
                        percent,
                        position: 50,
                        isSelected: true,
                        onCommitPercent: (p: number) => commits.push(p),
                        onSelect: () => {
                            selects++;
                        },
                    });
                    return () => h(TimelineCaret, caretProps());
                },
            }),
        );
        app.mount(mountPoint);
        teardown.push({ app, host });
        return {
            host,
            display: () => host.querySelector<HTMLElement>(".timeline-caret-readout"),
            input: () => host.querySelector<HTMLInputElement>("input"),
            commits,
            get selects() {
                return selects;
            },
            marker,
        };
    }

    it("displays the MODEL value, not a rounded lie", () => {
        const c = mountCaret(42.4);
        expect(c.display()?.textContent?.trim()).toBe("42.4%");
    });

    it("open + blur without typing ⇒ ZERO commits", async () => {
        const c = mountCaret(42.4);
        c.display()!.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        const input = c.input()!;
        expect(input).toBeTruthy();
        expect(input.value).toBe("42.4"); // the model's precision, into the editor
        expect(document.activeElement).toBe(input); // m-1/L-10: focus is REQUESTED
        input.dispatchEvent(new Event("blur"));
        await nextTick();
        expect(c.commits).toEqual([]);
        expect(c.display()?.textContent?.trim()).toBe("42.4%");
    });

    it("a typed change commits ONCE, and Escape commits nothing", async () => {
        const c = mountCaret(42.4);
        c.display()!.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        const input = c.input()!;
        input.value = "43";
        key(input, "Enter");
        await nextTick();
        expect(c.commits).toEqual([43]);

        c.display()!.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        const again = c.input()!;
        again.value = "77";
        key(again, "Escape");
        await nextTick();
        expect(c.commits).toEqual([43]);
    });

    it("Enter and Escape leave focus on the sibling slider, never on <body>", async () => {
        const c = mountCaret(42.4);
        c.display()!.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        expect(c.input()!.getAttribute("aria-controls")).toBe("timeline-marker-a");
        key(c.input()!, "Escape");
        await nextTick();
        expect(document.activeElement).toBe(c.marker);
        expect(document.activeElement).not.toBe(document.body);

        c.display()!.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        key(c.input()!, "Enter");
        await nextTick();
        expect(document.activeElement).toBe(c.marker);
    });
});

describe("KF.W7 G13 — the wheel does not eat the page", () => {
    const panThumb = (t: TrackHarness) =>
        t.host.querySelector<HTMLElement>(".timeline-pan-thumb");

    it("a plain wheel is NOT prevented — the ancestor scrolls", () => {
        const t = mountTrack([kf("a", 50)]);
        expect(wheel(t.rail).defaultPrevented).toBe(false);
    });

    it("ctrl/⌘-wheel zooms and IS prevented (the consumed event)", async () => {
        const t = mountTrack([kf("a", 50)]);
        const ev = wheel(t.rail, { ctrlKey: true, deltaY: -100 });
        expect(ev.defaultPrevented).toBe(true);
        await nextTick();
        expect(t.host.textContent).toContain("x"); // the zoom readout is live
    });

    it("shift-wheel pans on whichever axis the engine delivers", async () => {
        const t = mountTrack([kf("a", 50)]);
        for (let i = 0; i < 40; i++) wheel(t.rail, { ctrlKey: true, deltaY: -100 });
        await nextTick();
        const before = panThumb(t)!.style.left;

        // deltaY-only (the axis the old reader assumed)
        expect(wheel(t.rail, { shiftKey: true, deltaY: 200 }).defaultPrevented).toBe(true);
        await nextTick();
        const afterY = panThumb(t)!.style.left;
        expect(afterY).not.toBe(before);

        // deltaX-only — a trackpad's horizontal flick. The composition IS the row.
        wheel(t.rail, { shiftKey: true, deltaY: 0, deltaX: 200 });
        await nextTick();
        expect(panThumb(t)!.style.left).not.toBe(afterY);
    });

    it("the pan readout is operable from the keyboard", async () => {
        const t = mountTrack([kf("a", 50)]);
        for (let i = 0; i < 40; i++) wheel(t.rail, { ctrlKey: true, deltaY: -100 });
        await nextTick();
        const bar = t.host.querySelector<HTMLElement>(".timeline-pan-bar")!;
        expect(bar.getAttribute("tabindex")).toBe("0");
        expect(bar.getAttribute("role")).toBe("scrollbar");
        const before = panThumb(t)!.style.left;
        key(bar, "ArrowRight");
        await nextTick();
        expect(panThumb(t)!.style.left).not.toBe(before);
    });

    it("the zoom has a keyboard route with the rail focused (D-11)", async () => {
        const t = mountTrack([kf("a", 50)]);
        expect(t.host.querySelector(".timeline-pan-bar")).toBeTruthy(); // height reserved
        key(t.rail, "+");
        await nextTick();
        expect(t.host.textContent).toMatch(/1\.\dx/);
    });

    it("the open caret editor is wheel-shielded by an explicit is-editing guard", async () => {
        const t = mountTrack([kf("a", 50)]);
        for (let i = 0; i < 40; i++) wheel(t.rail, { ctrlKey: true, deltaY: -100 });
        await nextTick();
        const zoomBefore = t.host.querySelector(".timeline-zoom-readout")!.textContent;

        const readout = t.host.querySelector<HTMLElement>(".timeline-caret-readout")!;
        readout.dispatchEvent(new Event("click", { bubbles: true }));
        await nextTick();
        const input = t.host.querySelector<HTMLInputElement>(".timeline-caret input")!;
        wheel(input, { ctrlKey: true, deltaY: -100 });
        await nextTick();
        expect(t.host.querySelector(".timeline-zoom-readout")!.textContent).toBe(
            zoomBefore,
        );
    });

    it("a primary press on the caret readout does not scrub the rail (M2)", async () => {
        const t = mountTrack([kf("a", 50)]);
        const readout = t.host.querySelector<HTMLElement>(".timeline-caret-readout")!;
        pointer(readout, "pointerdown", 211);
        expect(t.scrubs).toEqual([]);
    });
});
