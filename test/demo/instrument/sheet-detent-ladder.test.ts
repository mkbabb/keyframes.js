/**
 * X.KF.W13X.mobile · UIA-KF-217 / A2-KE-L2-10 / A2-KE-L2-3 — the mobile
 * controls sheet's detent LADDER.
 *
 * - UIA-KF-217: the 0.62 editor rung covered the spring track at every phone;
 *   the open rung is ONE rung for every stage mode, on the 0.45 stage floor.
 * - A2-KE-L2-10: the open rung left a 171-257px scroll window for 700+px of
 *   controls; a third FULL rung (the whole band between the two docks) is the
 *   editing room, the sheet's size capped at that band.
 * - A2-KE-L2-3: on a short viewport (a phone in landscape) the bottom ladder was
 *   degenerate (the 204px glass chrome floor exceeds 0.12 and 0.36 of 390px);
 *   there the sheet is a RIGHT side sheet between the dock bands.
 *
 * - An upright phone's sheet truly closes: there is no parked peek. The
 *   ladder is OPEN and FULL; closed is absent (the dialog is not open), not a
 *   resting rung, so the stage holds the screen at rest.
 *
 * The glass Sheet is stubbed at its seam (it records the ladder it is handed);
 * the Dialog stub renders its content only while open, as reka's does; the
 * pane wrapper is REAL — the ladder is the wrapper's.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";

const sheetProps: Record<string, any>[] = [];
vi.mock("@mkbabb/glass-ui/sheet", () => ({
    SheetContent: defineComponent({
        name: "SheetContentStub",
        inheritAttrs: false,
        props: ["side", "detents", "detent", "scroll"],
        emits: ["update:detent"],
        setup(props, { attrs, slots, emit }) {
            const rec = { props, attrs, emit };
            sheetProps.push(rec);
            return () => h("div", { "data-stub": "SheetContent" }, slots.default?.());
        },
    }),
}));
vi.mock("@mkbabb/glass-ui/dialog", () => ({
    Dialog: defineComponent({
        props: ["open", "modal"],
        setup: (p, { slots }) => () => (p.open ? slots.default?.() : null),
    }),
    DialogTitle: defineComponent({ setup: (_p, { slots }) => () => h("h2", slots.default?.()) }),
}));
vi.mock("@components/instrument/pane/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({ name: "ChannelControlsStub", setup: () => () => h("div") }),
}));
vi.mock("@components/instrument/pane/RibbonBar.vue", () => ({
    default: defineComponent({ name: "RibbonBarStub", setup: () => () => h("div") }),
}));
vi.mock("../../../demo/components/instrument/timeline/SequenceTimeline.vue", () => ({
    default: defineComponent({ name: "SequenceTimelineStub", setup: () => () => h("div") }),
}));

let viewport = { w: 390, h: 844 };
function matches(q: string): boolean {
    let ok = true;
    for (const [, kind, axis, px] of q.matchAll(/\((max|min)-(width|height): (\d+)px\)/g)) {
        const v = axis === "height" ? viewport.h : viewport.w;
        ok &&= kind === "max" ? v <= Number(px) : v >= Number(px);
    }
    return ok;
}
Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
        matches: matches(query),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
    }),
});

const { default: ControlsPaneWrapper } =
    await import("@components/instrument/pane/ControlsPaneWrapper.vue");

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
    sheetProps.splice(0);
});

async function mountAt(w: number, ht: number, stageMode: "subject" | "editor", open = false) {
    viewport = { w, h: ht };
    const storedControls = reactive({
        selectedAnimation: "a",
        selectedControl: "controls",
        isControlsPanelOpen: open,
        isTimelineExpanded: false,
    });
    const group = {
        animations: { a: { animation: { id: "a" }, layer: undefined } },
        singleTarget: true,
    };
    const el = document.createElement("div");
    document.body.appendChild(el);
    const app = createApp(
        defineComponent({
            setup() {
                return () =>
                    h(ControlsPaneWrapper as any, {
                        animationGroup: group,
                        blendAvailable: true,
                        storedControls,
                        stageMode,
                        isPlaying: false,
                        onSetControlsPanelOpen: (v: boolean) => {
                            storedControls.isControlsPanelOpen = v;
                        },
                    });
            },
        }),
    );
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    await nextTick();
    // The wrapper's mobile mount-reset lowers the controls; a case that wants
    // them open opens them, as the Controls seat does.
    if (open) {
        storedControls.isControlsPanelOpen = true;
        await nextTick();
    }
    const rec = sheetProps.at(-1);
    if (!rec) throw new Error("no SheetContent mounted");
    return { rec, storedControls };
}

/** The sheet as it stands: the last SheetContent mounted, if it is still in the DOM. */
const sheetShown = () => document.querySelector('[data-stub="SheetContent"]') !== null;

describe("the mobile sheet's detent ladder", () => {
    it.each([
        [360, 780],
        [390, 844],
        [768, 1024],
    ])("UIA-KF-217 — the editor stage's open rung holds the stage floor (%ix%i)", async (w, h) => {
        const { rec } = await mountAt(w, h, "editor", true);
        expect(rec.props.side).toBe("bottom");
        expect(rec.props.detent).toBeLessThanOrEqual(0.36);
    });

    it("an upright phone's sheet is closed at rest: absent, not parked", async () => {
        viewport = { w: 390, h: 844 };
        const storedControls = reactive({
            selectedAnimation: "a",
            selectedControl: "controls",
            isControlsPanelOpen: false,
            isTimelineExpanded: false,
        });
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp(
            defineComponent({
                setup: () => () =>
                    h(ControlsPaneWrapper as any, {
                        animationGroup: { animations: { a: { animation: { id: "a" }, layer: undefined } }, singleTarget: true },
                        blendAvailable: true,
                        storedControls,
                        stageMode: "subject",
                        isPlaying: false,
                        onSetControlsPanelOpen: (v: boolean) => {
                            storedControls.isControlsPanelOpen = v;
                        },
                    }),
            }),
        );
        app.mount(el);
        mounted.push({ unmount: () => app.unmount(), el });
        await nextTick();
        expect(sheetShown()).toBe(false);
        expect(sheetProps).toHaveLength(0);
        storedControls.isControlsPanelOpen = true;
        await nextTick();
        expect(sheetShown()).toBe(true);
    });

    it("A2-KE-L2-10 — the ladder is OPEN and FULL: a FULL rung above the open one, capped at the band between the docks", async () => {
        const { rec, storedControls } = await mountAt(390, 844, "subject", true);
        const d: number[] = rec.props.detents;
        expect(d.length).toBe(2);
        expect(d[0]).toBe(0.36);
        expect(d[1]).toBeGreaterThan(d[0]!);
        expect(rec.props.detent).toBe(d[0]);
        const style = rec.attrs.style as Record<string, string>;
        expect(style.maxBlockSize).toContain("var(--stage-top-inset)");
        expect(style.maxBlockSize).toContain("var(--stage-bottom-inset)");
        // the grip / drag landing on FULL takes the sheet to full
        rec.emit("update:detent", d[1]);
        await nextTick();
        expect(storedControls.isControlsPanelOpen).toBe(true);
        expect(rec.props.detent).toBe(d[1]);
        // a flick onto 0 closes it: the sheet leaves, nothing parks
        rec.emit("update:detent", null);
        await nextTick();
        expect(storedControls.isControlsPanelOpen).toBe(false);
        expect(sheetShown()).toBe(false);
        // the next open is the open rung, not full
        storedControls.isControlsPanelOpen = true;
        await nextTick();
        expect(sheetProps.at(-1)!.props.detent).toBe(d[0]);
    });

    it.each([
        [844, 390],
        [932, 430],
    ])("A2-KE-L2-3 — a short viewport (%ix%i) gets a right side sheet between the dock bands, with distinct rungs", async (w, h) => {
        const { rec } = await mountAt(w, h, "subject");
        expect(rec.props.side).toBe("right");
        const d: number[] = rec.props.detents;
        expect(new Set(d).size).toBe(d.length);
        // the side sheet rests as a rail, not a grip strip (a 0.12 strip crushed the pane)
        expect(d[0]! * w).toBeGreaterThanOrEqual(300);
        const style = rec.attrs.style as Record<string, string>;
        expect(style.top).toBe("var(--stage-top-inset)");
        expect(style.bottom).toBe("var(--stage-bottom-inset)");
    });
});
