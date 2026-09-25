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
 * The glass Sheet is stubbed at its seam (it records the ladder it is handed);
 * the pane wrapper is REAL — the ladder is the wrapper's.
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
    Dialog: defineComponent({ setup: (_p, { slots }) => () => slots.default?.() }),
    DialogTitle: defineComponent({ setup: (_p, { slots }) => () => h("h2", slots.default?.()) }),
}));
vi.mock("../../../demo/components/instrument/transport/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({ name: "ChannelControlsStub", setup: () => () => h("div") }),
}));
vi.mock("../../../demo/components/instrument/transport/controls-pane/RibbonBar.vue", () => ({
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
    await import("../../../demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue");

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
    sheetProps.splice(0);
});

async function mountAt(w: number, ht: number, stageMode: "subject" | "editor") {
    viewport = { w, h: ht };
    const storedControls = reactive({
        selectedAnimation: "a",
        selectedControl: "controls",
        isControlsPanelOpen: false,
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
                        activeKeyframesRef: null,
                        activeTimelineRef: null,
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
    const rec = sheetProps.at(-1);
    if (!rec) throw new Error("no SheetContent mounted");
    return { rec, storedControls };
}

describe("the mobile sheet's detent ladder", () => {
    it.each([
        [360, 780],
        [390, 844],
        [768, 1024],
    ])("UIA-KF-217 — the editor stage's open rung holds the stage floor (%ix%i)", async (w, h) => {
        const { rec, storedControls } = await mountAt(w, h, "editor");
        storedControls.isControlsPanelOpen = true;
        await nextTick();
        expect(rec.props.side).toBe("bottom");
        expect(rec.props.detent).toBeLessThanOrEqual(0.36);
    });

    it("A2-KE-L2-10 — a FULL rung above the open one, capped at the band between the docks", async () => {
        const { rec, storedControls } = await mountAt(390, 844, "subject");
        const d: number[] = rec.props.detents;
        expect(d.length).toBe(3);
        expect(d[2]).toBeGreaterThan(d[1]!);
        const style = rec.attrs.style as Record<string, string>;
        expect(style.maxBlockSize).toContain("var(--stage-top-inset)");
        expect(style.maxBlockSize).toContain("var(--stage-bottom-inset)");
        // the grip / drag landing on FULL opens the sheet AT full
        rec.emit("update:detent", d[2]);
        await nextTick();
        expect(storedControls.isControlsPanelOpen).toBe(true);
        expect(rec.props.detent).toBe(d[2]);
        // a close parks at peek, and the next open is the open rung, not full
        storedControls.isControlsPanelOpen = false;
        await nextTick();
        expect(rec.props.detent).toBe(d[0]);
        storedControls.isControlsPanelOpen = true;
        await nextTick();
        expect(rec.props.detent).toBe(d[1]);
    });

    it.each([
        [844, 390],
        [932, 430],
    ])("A2-KE-L2-3 — a short viewport (%ix%i) gets a right side sheet between the dock bands, with distinct rungs", async (w, h) => {
        const { rec } = await mountAt(w, h, "subject");
        expect(rec.props.side).toBe("right");
        const d: number[] = rec.props.detents;
        expect(new Set(d).size).toBe(d.length);
        const style = rec.attrs.style as Record<string, string>;
        expect(style.top).toBe("var(--stage-top-inset)");
        expect(style.bottom).toBe("var(--stage-bottom-inset)");
    });
});
