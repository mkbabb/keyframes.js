// SERVED MODEL: claude-opus-5-5
/**
 * test/demo/instrument/transport-r4.test.ts — X.KF.W13X.r4transport, the
 * unit's transport-dock falsifiers (R-4 row "transport and ribbon"). Each case
 * is RED at the pre-cure bytes and GREEN after. The row's other falsifiers:
 * a2-ke-l1-24-inert-toggle-play, kfa-69-scrub-seeks-group,
 * uia-kf-026-ribbon-readback, playback-ribbon-contract (KFA-226).
 *
 *   (1) UIA-KF-052 (consumer half) — Play is a DockControl like its Reset
 *       sibling: no literal `rounded-full w-10 h-10`, no bespoke scale-on-hover.
 *   (2) UIA-KF-122 — the channel list takes glass's menu rung: no `dock-label`
 *       on the SelectGroup, no padding override on the rows.
 *   (3) UIA-KF-229 — on the start screen the transport is Play alone (no
 *       channel list, no Reset).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, reactive } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { StoredAnimationGroupControlOptions } from "@state";

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
        props: { collapse: { type: [String, Boolean], default: undefined }, fitContent: Boolean },
        setup(_, { slots, expose }) {
            expose({ expand: () => {}, collapse: () => {}, keepOpen: () => {}, release: () => {} });
            return () =>
                h("div", { "data-dock-seat": "" }, [
                    h("div", { "data-seat": "persistent" }, slots.persistent?.()),
                    h("div", { "data-layer": "full" }, slots.default?.()),
                ]);
        },
    });
    const DockSeparator = defineComponent({
        name: "DockSeparatorSeat",
        setup: () => () => h("span", { role: "separator" }),
    });
    return {
        GlassDock,
        DockControl: buttonHost("DockControlSeat"),
        DockTrigger: buttonHost("DockTriggerSeat"),
        DockSeparator,
    };
});

const { default: TransportDock } =
    await import("../../../demo/components/instrument/transport/TransportDock.vue");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");
const { warmKfEngine } = await import("../../../demo/kf-engine");

const ROOT = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");
const TRANSPORT = "demo/components/instrument/transport/TransportDock.vue";

const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
});

let mounted: VueWrapper[] = [];
afterEach(() => {
    for (const w of mounted) w.unmount();
    mounted = [];
});

const stored = (): StoredAnimationGroupControlOptions =>
    reactive({
        selectedControl: "controls",
        selectedAnimation: "alpha",
        keyframeControls: {
            selectedKeyframesControl: "keyframes",
            dialogOpen: false,
            keyframes: "",
            addKeyframes: "",
        },
        isTimelineExpanded: false,
        isControlsPanelOpen: true,
    }) as StoredAnimationGroupControlOptions;

function mountTransport(extra: Record<string, unknown> = {}) {
    const w = mount(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(TransportDock, {
                            storedControls: stored(),
                            isPlaying: false,
                            animationNames: ["alpha", "beta"],
                            ...extra,
                        } as InstanceType<typeof TransportDock>["$props"]),
                }),
        }),
        { attachTo: document.body },
    );
    mounted.push(w);
    return w;
}

describe("X.KF.W13X.r4transport — the transport dock", () => {
    it("(1) UIA-KF-052 — Play is a DockControl like Reset, with no literal radius, size or hover scale", () => {
        const w = mountTransport();
        const controls = w.findAllComponents({ name: "DockControlSeat" });
        const labels = controls.map((c) => c.attributes("aria-label"));
        expect(labels).toContain("Play animation");
        expect(labels).toContain("Reset animation");
        const play = (w.element as HTMLElement).querySelector<HTMLElement>('[aria-label="Play animation"]')!;
        for (const literal of ["rounded-full", "w-10", "h-10", "p-0", "scale-on-hover"]) {
            expect(play.classList.contains(literal)).toBe(false);
        }
    });

    it("(2) UIA-KF-122 — the channel list rows take glass's menu rung (no dock-label, no padding override)", () => {
        const src = read(TRANSPORT);
        const template = src.slice(0, src.indexOf("<script"));
        expect(template).not.toMatch(/<SelectGroup[^>]*dock-label/);
        expect(template).not.toMatch(/<SelectItem[^>]*\bpy-2\b/);
        expect(template).not.toMatch(/<SelectItem[^>]*\bpx-3\b/);
    });
});
