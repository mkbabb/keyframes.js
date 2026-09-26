// SERVED MODEL: claude-opus-5-5
/**
 * test/demo/instrument/transport-w13x.test.ts — X.KF.W13X.transport, the unit's
 * falsifiers (one case per row cured at the transport dock / the ribbon /
 * their composables). Each case is RED at the pre-cure bytes and GREEN after.
 *
 *   (1)  KFA-54      — an open channel Select HOLDS the transport (keepOpen /
 *                      release), exactly as ChromeDock's Selects do.
 *   (2)  UIA-KF-152  — the channel list opens ABOVE the bottom dock, offset
 *                      clear of the dock's top edge (side "top").
 *   (3)  UIA-KF-256  — the trigger rides DockTrigger's own rung (no `dock-label`).
 *   (4)  UIA-KF-257  — no redundant "Select animation" Tooltip / wrapper div.
 *   (5)  UIA-KF-151 · KFA-167 · UIA-KF-108 (dock half) · UIA-KF-261 — no
 *                      per-row status dot / progress ring / bold; the glass
 *                      SelectItem indicator is the one selection channel.
 *   (6)  UIA-KF-153 · UIA-KF-283 — no timeline Collapse chip + inert
 *                      "Timeline" label in the transport.
 *   (7)  KFA-166     — the transport mounts COLLAPSED (it idles like ChromeDock).
 *   (8)  KFA-165     — the Reset twist is ONE rotateY interval (no stall at
 *                      the mirrored pose); the scale dip is its own track.
 *   (9)  UIA-KF-051 · UIA-KF-155 — the ribbon carries no Play/Pause twin of
 *                      the dock's Play (one control per verb).
 *   (10) KFA-174     — Reverse re-arms the read-back (`scrubbed`), so a paused
 *                      ribbon re-seats instead of holding the stale position.
 *   (11) KFA-104     — selecting a channel never starts playback.
 *   (12) A2-KE-L1-3  — one ticker name: `useRafLoop` is gone.
 *   (13) UIA-KF-225  — the stage cell reserves the STABLE dock band.
 *   (14) UIA-KF-300  — the ball-preview eye's tooltip states the action the next
 *                      press takes; its name stays one stable name + aria-pressed.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { StoredAnimationGroupControlOptions } from "@state";

/** What the GlassDock seat saw: its `collapse` posture, and the hold calls. */
const dockSeat = vi.hoisted(() => ({
    collapse: undefined as unknown,
    keepOpen: vi.fn(),
    release: vi.fn(),
    expand: vi.fn(),
}));

vi.mock("@mkbabb/glass-ui", async () => {
    const { defineComponent, h } = await import("vue");
    const select =
        await vi.importActual<typeof import("@mkbabb/glass-ui/select")>("@mkbabb/glass-ui/select");
    const slider =
        await vi.importActual<typeof import("@mkbabb/glass-ui/slider")>("@mkbabb/glass-ui/slider");
    const Button = defineComponent({
        name: "ButtonSeat",
        setup(_, { slots }) {
            return () => h("button", { type: "button" }, slots.default?.());
        },
    });
    return { ...select, ...slider, Button };
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
        setup(props, { slots, expose }) {
            expose({
                expand: dockSeat.expand,
                collapse: () => {},
                keepOpen: dockSeat.keepOpen,
                release: dockSeat.release,
            });
            return () => {
                dockSeat.collapse = props.collapse;
                return h("div", { "data-dock-seat": "" }, [
                    h("div", { "data-seat": "persistent" }, slots.persistent?.()),
                    h("div", { "data-layer": "full" }, slots.default?.()),
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
vi.mock("../../../demo/components/playback/AnimationVisualizer.vue", () => ({
    default: defineComponent({
        name: "AnimationVisualizerStub",
        setup() {
            return () => h("div", { "data-stub": "AnimationVisualizer" });
        },
    }),
}));

const { default: TransportDock } =
    await import("../../../demo/components/instrument/transport/TransportDock.vue");
const { default: PlaybackRibbon } = await import("../../../demo/components/playback/PlaybackRibbon.vue");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");
const { default: PreviewToggle } = await import("../../../demo/components/playback/PreviewToggle.vue");
const { kfEngine, warmKfEngine } = await import("../../../demo/kf-engine");
const { useIconSpin } =
    await import("../../../demo/components/instrument/transport/TransportDock/useIconSpin");
const { useAnimationGroupPlayback } =
    await import("../../../demo/components/instrument/transport/AnimationControlsGroup/useAnimationGroupPlayback");
const { CSSKeyframesAnimation } = await import("../../../src/animation/engine");
const { AnimationGroup } = await import("../../../src/animation/group");

const ROOT = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
});

let mounted: VueWrapper[] = [];
afterEach(() => {
    for (const w of mounted) w.unmount();
    mounted = [];
    dockSeat.keepOpen.mockClear();
    dockSeat.release.mockClear();
    vi.restoreAllMocks();
});

const storedOptions = (
    over: Partial<StoredAnimationGroupControlOptions> = {},
): StoredAnimationGroupControlOptions =>
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
        ...over,
    }) as StoredAnimationGroupControlOptions;

/** The transport as AnimationControlsGroup mounts it (props only — no emit is under test). */
function mountTransport(stored = storedOptions(), animationNames = ["alpha", "beta"]) {
    const w = mount(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(TransportDock, {
                            storedControls: stored,
                            isPlaying: true,
                            animationNames,
                            // The pre-cure contract's per-row inputs (the dot state and the
                            // progress ring, both deleted by (5)): passed so the RED at the
                            // pre-cure bytes reads each defect rather than a missing prop.
                            // After the cure they are undeclared and fall through inert.
                            isStarted: true,
                            animationProgress: {},
                        } as InstanceType<typeof TransportDock>["$props"]),
                }),
        }),
        { attachTo: document.body },
    );
    mounted.push(w);
    return w;
}

const TRANSPORT = "demo/components/instrument/transport/TransportDock.vue";

describe("X.KF.W13X.transport — the transport dock", () => {
    it("(1) KFA-54 — an open channel Select holds the dock, and a closed one releases it", async () => {
        const w = mountTransport();
        const select = w.findComponent({ name: "Select" });
        expect(select.exists()).toBe(true);
        select.vm.$emit("update:open", true);
        await nextTick();
        expect(dockSeat.keepOpen).toHaveBeenCalledTimes(1);
        select.vm.$emit("update:open", false);
        await nextTick();
        expect(dockSeat.release).toHaveBeenCalledTimes(1);
        // hold only — the Select never re-expands the dock (RR-2 MISSED #1)
        expect(dockSeat.expand).not.toHaveBeenCalled();
    });

    it("(2) UIA-KF-152 — the channel list opens above the bottom dock, offset clear of its edge", () => {
        const w = mountTransport();
        const content = w.findComponent({ name: "SelectContent" });
        expect(content.exists()).toBe(true);
        expect(content.props("side")).toBe("top");
        expect(content.props("sideOffset")).toBeGreaterThanOrEqual(8);
    });

    it("(3) UIA-KF-256 — the trigger rides DockTrigger's own rung (no dock-label on it)", () => {
        const w = mountTransport();
        const trigger = (w.element as HTMLElement).querySelector<HTMLElement>('[aria-label="Select animation"]');
        expect(trigger).not.toBeNull();
        expect(trigger!.classList.contains("dock-label")).toBe(false);
    });

    it("(4) UIA-KF-257 — no Tooltip (and no wrapper div) around the channel Select", () => {
        const w = mountTransport();
        let vm = w.findComponent({ name: "Select" }).vm.$parent;
        const chain: string[] = [];
        while (vm && (vm.$options as { __name?: string }).__name !== "TransportDock") {
            chain.push(String(vm.$options.name));
            vm = vm.$parent;
        }
        expect(chain.filter((n) => /Tooltip/.test(n))).toEqual([]);
        expect(read(TRANSPORT)).not.toMatch(/<TooltipContent>Select animation<\/TooltipContent>/);
    });

    it("(5) UIA-KF-151 · KFA-167 · UIA-KF-108 · UIA-KF-261 — rows carry no status dot, progress ring or bold; the SelectItem indicator shows the selection", () => {
        const src = read(TRANSPORT);
        const template = src.slice(0, src.indexOf("<script"));
        expect(template).not.toMatch(/hide-indicator/);
        expect(template).not.toMatch(/<StatusDot/);
        expect(template).not.toMatch(/progress-dot/);
        expect(template).not.toMatch(/font-bold/);
    });

    it("(6) UIA-KF-153 · UIA-KF-283 — no timeline Collapse chip and no inert 'Timeline' label in the transport", () => {
        const w = mountTransport(storedOptions({ isTimelineExpanded: true }));
        expect(w.element.querySelector('[aria-label="Collapse timeline"]')).toBeNull();
        const labels = [...w.element.querySelectorAll("span")].filter((s) => s.textContent?.trim() === "Timeline");
        expect(labels).toHaveLength(0);
    });

    it("(7) KFA-166 — the transport mounts collapsed, like ChromeDock (it idles without a first hover)", () => {
        mountTransport();
        expect(dockSeat.collapse).toBe("closed");
    });
});

describe("X.KF.W13X.transport — the Reset glyph's twist", () => {
    it("(8) KFA-165 — rotateY is ONE decelerating interval (no stop at the mirrored pose), the scale dip its own track", () => {
        const setTargets = vi.spyOn(kfEngine().CSSKeyframesAnimation.prototype, "setTargets");
        const Host = defineComponent({
            setup() {
                const { resetIconSpin } = useIconSpin(
                    { value: document.createElement("span") } as unknown as Parameters<typeof useIconSpin>[0],
                );
                resetIconSpin();
                return () => h("span");
            },
        });
        mounted.push(mount(Host));
        expect(setTargets).toHaveBeenCalledTimes(1);
        const twist = setTargets.mock.contexts[0] as { at: (p: number, render: boolean) => void };
        const host = setTargets.mock.calls[0]![0] as HTMLElement;
        const angles: number[] = [];
        for (let i = 0; i <= 20; i++) {
            twist.at(i / 20, true);
            const m = /rotateY\((-?[\d.]+)deg\)/.exec(host.style.transform);
            angles.push(m ? Number(m[1]) : NaN);
        }
        expect(angles[0]).toBeCloseTo(0, 5);
        expect(angles[20]).toBeCloseTo(-360, 5);
        const speeds = angles.slice(1).map((a, i) => Math.abs(a - angles[i]!));
        // one easeOutCubic interval: the per-step angle never grows back
        for (let i = 1; i < speeds.length; i++) expect(speeds[i]!).toBeLessThanOrEqual(speeds[i - 1]! + 1e-6);
        // the dip rides its own track (scale), not the rotation's keyframes
        twist.at(0.4, true);
        expect(Number(host.style.getPropertyValue("scale"))).toBeLessThan(1);
    });
});

describe("X.KF.W13X.transport — the ribbon", () => {
    function mountRibbon(over: Record<string, unknown> = {}) {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        const log: string[] = [];
        const listeners = Object.fromEntries(
            ["scrubStart", "scrubEnd", "scrubbed", "sliderUpdate", "togglePlay", "toggleReverse"].map((n) => [
                `on${n[0]!.toUpperCase()}${n.slice(1)}`,
                () => log.push(n),
            ]),
        );
        const w = mount(
            defineComponent({
                setup: () => () =>
                    h(TooltipProvider, null, () =>
                        h(PlaybackRibbon, {
                            animation: anim,
                            currentT: 250,
                            isAnimPlaying: false,
                            userReversed: false,
                            ...listeners,
                            ...over,
                        } as InstanceType<typeof PlaybackRibbon>["$props"]),
                    ),
            }),
            { attachTo: document.body },
        );
        mounted.push(w);
        return { w, log };
    }

    it("(9) UIA-KF-051 · UIA-KF-155 — the ribbon carries no Play/Pause twin of the dock's Play", () => {
        for (const isAnimPlaying of [false, true]) {
            const { w } = mountRibbon({ isAnimPlaying });
            const twins = [...w.element.querySelectorAll("button")].filter((b) =>
                /^(Play|Pause)\b/.test(b.textContent?.trim() ?? ""),
            );
            expect(twins).toHaveLength(0);
        }
    });

    it("(10) KFA-174 — Reverse re-arms the read-back, so a paused ribbon re-seats in the new direction", async () => {
        const { w, log } = mountRibbon();
        const reverse = [...w.element.querySelectorAll("button")].find((b) => /Reverse/.test(b.textContent ?? ""));
        expect(reverse).toBeDefined();
        reverse!.click();
        await nextTick();
        expect(log).toContain("toggleReverse");
        expect(log).toContain("scrubbed");
    });
});

describe("X.KF.W13X.transport — the group playback seam", () => {
    it("(11) KFA-104 — selecting a channel on an idle group (pick or keyboard cycle) does not start playback", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString("from { opacity: 0; } to { opacity: 1; }");
        a.name = "alpha";
        const group = new AnimationGroup(a as never);
        const emit = vi.fn();
        const stored = storedOptions({ selectedAnimation: "" });
        const { onSelectAnimation, cycleAnimation } = useAnimationGroupPlayback(() => group, stored, emit);
        onSelectAnimation("alpha");
        expect(stored.selectedAnimation).toBe("alpha");
        // the keyboard twin (the shortcut's cycle) is a selection too
        cycleAnimation(1);
        expect(stored.selectedAnimation).toBe("alpha");
        expect(emit.mock.calls.filter(([e, v]) => e === "playStateChange" && v === true)).toEqual([]);
    });
});

describe("X.KF.W13X.transport — structure", () => {
    it("(12) A2-KE-L1-3 — one ticker name: the useRafLoop alias is deleted and nothing imports it", () => {
        expect(existsSync(resolve(ROOT, "demo/components/instrument/transport/composables/useRafLoop.ts"))).toBe(false);
        for (const rel of [
            "demo/components/playback/AnimationVisualizer.vue",
            "demo/components/instrument/transport/AnimationControlsGroup.vue",
        ]) {
            expect(read(rel)).not.toMatch(/useRafLoop/);
        }
    });

    it("(13) UIA-KF-225 — the stage cell reserves the STABLE (peak) dock band, so an expanding transport never rims over it", () => {
        const css = read("demo/components/instrument/transport/AnimationControlsGroup.css");
        const rule = /\.stage-cell\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
        expect(rule).toMatch(/padding-block:\s*var\(--dock-band-reserve-stable/);
    });
});

describe("X.KF.W13X.transport — the ball-preview eye", () => {
    it("(14) UIA-KF-300 — the eye's tooltip states the next action; the name stays stable with aria-pressed", async () => {
        const w = mount(
            defineComponent({
                setup: () => () =>
                    h(TooltipProvider, { delayDuration: 0 }, () =>
                        h(PreviewToggle, { state: "hidden" }, () => h("div", { "data-preview": "" })),
                    ),
            }),
            { attachTo: document.body },
        );
        mounted.push(w);
        const eye = (w.element as HTMLElement).querySelector<HTMLButtonElement>("button")!;
        expect(eye.getAttribute("aria-label")).toBe("Hide ball preview");
        expect(eye.getAttribute("aria-pressed")).toBe("true");
        eye.dispatchEvent(new FocusEvent("focus"));
        eye.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        await nextTick();
        await nextTick();
        const tips = [...document.querySelectorAll('[role="tooltip"]')].map((t) => t.textContent?.trim());
        expect(tips).toContain("Show ball preview");
    });
});
