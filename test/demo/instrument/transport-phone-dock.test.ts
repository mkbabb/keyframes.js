/**
 * The phone's transport is the page's one bottom dock (an upright phone, under
 * 1024 px wide and over 500 px tall): it never folds, so Play and the scene's
 * choices stay in view, and its Controls seat opens and closes the controls
 * sheet, saying which with `aria-expanded`. A desk and a landscape phone keep
 * the folding transport; the pane is a rail there.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TransportDock from "../../../demo/components/instrument/transport/TransportDock.vue";
import type { StoredAnimationGroupControlOptions } from "@state";

const authored: { slots: string[] } = { slots: [] };

vi.mock("@mkbabb/glass-ui", async () => {
    const { defineComponent, h } = await import("vue");
    const select =
        await vi.importActual<typeof import("@mkbabb/glass-ui/select")>("@mkbabb/glass-ui/select");
    const Button = defineComponent({
        name: "ButtonSeat",
        setup(_, { slots }) {
            return () => h("button", { type: "button" }, slots.default?.());
        },
    });
    return { ...select, Button };
});
vi.mock("@mkbabb/glass-ui/dock", async () => {
    const { defineComponent, h } = await import("vue");
    const GlassDock = defineComponent({
        name: "GlassDockSeat",
        props: ["collapse", "fitContent"],
        setup(props, { slots, expose }) {
            expose({ expand: () => {}, collapse: () => {}, keepOpen: () => {}, release: () => {} });
            return () => {
                authored.slots = Object.keys(slots).sort();
                return h("div", { "data-dock-seat": "", "data-collapse": String(props.collapse) }, [
                    h("div", { "data-seat": "persistent" }, slots.persistent?.()),
                    h("div", { "data-layer": "full" }, slots.default?.()),
                    h("div", { "data-layer": "summary" }, slots.collapsed?.()),
                ]);
            };
        },
    });
    const DockSeparator = defineComponent({
        name: "DockSeparatorSeat",
        setup() {
            return () => h("span", { role: "separator" });
        },
    });
    return {
        GlassDock,
        DockControl: defineComponent({
        name: "DockControlSeat",
        inheritAttrs: false,
        setup(_, { slots, attrs }) {
            return () => h("button", { type: "button", ...attrs }, slots.default?.());
        },
    }),
        DockSeparator,
    };
});
vi.mock("@mkbabb/glass-ui/dock-trigger", async () => {
    const { defineComponent, h } = await import("vue");
    const DockTrigger = defineComponent({
        name: "DockTriggerSeat",
        setup(_, { slots }) {
            return () => h("button", { type: "button" }, slots.default?.());
        },
    });
    return { DockTrigger };
});

// jsdom ships no ResizeObserver; the transport's menubar measure observes one.
const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeAll(() => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
});

const stored = {
    selectedControl: "controls",
    selectedAnimation: "alpha",
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
    keyframeControls: {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    },
} as StoredAnimationGroupControlOptions;


/** The viewport the media queries read. */
let viewport = { w: 390, h: 844 };
const matches = (q: string): boolean => {
    let ok = true;
    for (const [, kind, axis, px] of q.matchAll(/\((max|min)-(width|height): (\d+)px\)/g)) {
        const v = axis === "height" ? viewport.h : viewport.w;
        ok &&= kind === "max" ? v <= Number(px) : v >= Number(px);
    }
    return ok;
};
const savedMM = window.matchMedia;
beforeAll(() => {
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
});
afterAll(() => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: savedMM });
});

let playhead = 0.25;
const scrubbed: number[] = [];

function mountAt(w: number, h0: number, controlsSeat: boolean, onToggle: () => void = () => {}) {
    viewport = { w, h: h0 };
    return mount(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(TransportDock, {
                            storedControls: stored,
                            isPlaying: false,
                            animationNames: ["alpha", "beta"],
                            controlsSeat,
                            getScrubT: () => playhead,
                            scrubTo: (f: number) => scrubbed.push(f),
                            onToggleControls: onToggle,
                        }),
                }),
        }),
        { attachTo: document.body },
    );
}

const seat = (w: { element: Element }) => w.element.querySelector('button[aria-label="Controls"]');
const timeSliders = () => document.querySelectorAll('[role="slider"][aria-label="Time"]');

describe("the phone's one bottom dock", () => {
    it("an upright phone: the dock never folds and offers Play and a Controls seat that says whether the controls are open", async () => {
        let toggled = 0;
        const w = mountAt(390, 844, true, () => toggled++);
        expect(w.element.querySelector("[data-collapse]")!.getAttribute("data-collapse")).toBe("false");
        expect(w.element.querySelectorAll('button[aria-label="Play animation"]')).toHaveLength(1);
        const s = seat(w);
        expect(s).not.toBeNull();
        expect(s!.getAttribute("aria-expanded")).toBe(String(stored.isControlsPanelOpen === true));
        (s as HTMLButtonElement).click();
        expect(toggled).toBe(1);
        w.unmount();
    });

    it("an upright phone: the dock holds the page's one scrub, named Time, at the selected channel's playhead", () => {
        playhead = 0.25;
        const w = mountAt(390, 844, true);
        const sliders = timeSliders();
        expect(sliders).toHaveLength(1);
        expect(w.element.contains(sliders[0]!)).toBe(true);
        // The thumb speaks the playhead (jsdom lays out no thumb, so its
        // value text is the read; aria-valuenow waits on a measured box).
        expect(sliders[0]!.getAttribute("aria-valuetext")).toBe("25 %");
        // No visible "time" label: the bar says it.
        expect(w.element.textContent ?? "").not.toMatch(/\btime\b/i);
        w.unmount();
    });

    it("an upright phone with a controls sheet: the channel select and Reset are the sheet's, not the dock's", () => {
        const w = mountAt(390, 844, true);
        expect(w.element.querySelector('button[aria-label="Reset animation"]')).toBeNull();
        expect(w.element.querySelector('[aria-label="Channel to edit"]')).toBeNull();
        w.unmount();
    });

    it("a scene with no controls pane offers no Controls seat, and keeps Reset in the dock beside the scrub", () => {
        const w = mountAt(390, 844, false);
        expect(seat(w)).toBeNull();
        expect(timeSliders()).toHaveLength(1);
        expect(w.element.querySelector('button[aria-label="Reset animation"]')).not.toBeNull();
        w.unmount();
    });

    it("a desk and a landscape phone keep the folding transport and no Controls seat (the pane is a rail there)", () => {
        for (const [vw, vh] of [[1440, 900], [844, 390]] as const) {
            const w = mountAt(vw, vh, true);
            expect(w.element.querySelector("[data-collapse]")!.getAttribute("data-collapse")).toBe("closed");
            expect(seat(w)).toBeNull();
            // The scrub stays the pane's rail there.
            expect(timeSliders()).toHaveLength(0);
            expect(w.element.querySelector('button[aria-label="Reset animation"]')).not.toBeNull();
            w.unmount();
        }
    });
});
