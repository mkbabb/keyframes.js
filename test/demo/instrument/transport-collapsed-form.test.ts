/**
 * test/demo/instrument/transport-collapsed-form.test.ts — G-W13W-d
 * (X.KF.W13W.d · OA-57, COHESION §0cq — the collapsed dock, keyframes' consumer half).
 *
 * Served at 1440 the transport's collapsed plate measured 56 px (glass necks the
 * `#collapsed` summary seat to one circle: `aspect-ratio: 1` at
 * `--dock-collapsed-summary-min-size`) while the consumer had hand-duplicated TWO
 * seats into it — a second Play mirror plus the animation name, 132 px — so both
 * spilled 38 px out of the plate on every idle collapse (value.js
 * evidence/W13W/d). The consumer cure is glass's own seam: Play is ONE control in
 * `#persistent` (in-flow on both faces, never inert) and `#collapsed` is not
 * authored, so the summary is `:empty` and the plate centres Play. A multi-seat
 * collapsed plate is the producer's (O-65 DOCK-COLLAPSED-FORM), relay only.
 *
 * This reads which GlassDock slots the real TransportDock SFC authors, through a
 * contract-faithful dock seat that records them.
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
    const buttonHost = (name: string) =>
        defineComponent({
            name,
            setup(_, { slots }) {
                return () => h("button", { type: "button" }, slots.default?.());
            },
        });
    const GlassDock = defineComponent({
        name: "GlassDockSeat",
        setup(_, { slots, expose }) {
            expose({ expand: () => {}, collapse: () => {}, keepOpen: () => {}, release: () => {} });
            return () => {
                authored.slots = Object.keys(slots).sort();
                return h("div", { "data-dock-seat": "" }, [
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
        DockControl: buttonHost("DockControlSeat"),
        DockTrigger: buttonHost("DockTriggerSeat"),
        DockSeparator,
    };
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

function mountTransport(animationNames: string[]) {
    return mount(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(TransportDock, {
                            storedControls: stored,
                            isPlaying: true,
                            isStarted: true,
                            animationProgress: {},
                            animationNames,
                        }),
                }),
        }),
        { attachTo: document.body },
    );
}

describe("G-W13W-d — the transport's collapsed form rides glass's own seats", () => {
    for (const names of [["alpha"], ["alpha", "beta"]]) {
        it(`(${names.length} channel${names.length > 1 ? "s" : ""}) authors no #collapsed seat — the summary circle stays :empty`, () => {
            const w = mountTransport(names);
            expect(authored.slots).toContain("persistent");
            expect(authored.slots).not.toContain("collapsed");
            expect(w.element.querySelector('[data-layer="summary"]')!.children).toHaveLength(0);
            w.unmount();
        });

        it(`(${names.length} channel${names.length > 1 ? "s" : ""}) Play is ONE control, in the persistent seat, outside both faces`, () => {
            const w = mountTransport(names);
            const plays = w.element.querySelectorAll('button[aria-label$=" animation"][aria-label^="Pause"], button[aria-label$=" animation"][aria-label^="Play"]');
            expect(plays).toHaveLength(1);
            expect(plays[0]!.closest('[data-seat="persistent"]')).not.toBeNull();
            expect(plays[0]!.closest("[data-layer]")).toBeNull();
            w.unmount();
        });
    }
});
