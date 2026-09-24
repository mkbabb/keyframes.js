/**
 * test/demo/instrument/transport-keyboard-propagation.test.ts — G-KFW13-3
 * (X.KF.W13.b · TD-2 + TD-38 + TD-40, one propagation policy).
 *
 * A COMPOSITION test: the real TransportDock SFC (the one persistent Play, Reset,
 * the Collapse-timeline chip) is mounted INSIDE the real GlassDock and WITH the
 * real glass-ui keyboard registry populated by `useControlsKeyboardShortcuts`
 * — the two actuators TD-2 found firing together. A test that mounts the
 * buttons without the registry proves nothing about the policy, because the
 * registry IS the second actuator.
 *
 * The policy under test (value.js evidence/W13/b-td-remainder-derivation.md §4):
 *   (1) Space on Play actuates EXACTLY ONCE — the button's native keyup arm —
 *       and the page-level Space shortcut does not fire beside it; this holds on
 *       BOTH faces because Play is ONE control in glass's `#persistent` seat,
 *       in-flow on both (X.KF.W13W.d, OA-57: the hand-duplicated `#collapsed`
 *       mirror spilled out of the collapsed plate and is retired).
 *   (2) Space on Reset / Collapse-timeline leaves the activation default INTACT
 *       (`defaultPrevented` stays false — the browser's own Space→click is what
 *       these `@click` buttons depend on; jsdom synthesises no activation click,
 *       so the un-prevented default is the observable) and does NOT fire playback.
 *   (3) Space with no activation target (the page) still toggles playback once,
 *       prevents the scroll default, and swallows OS auto-repeat.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { warmKfEngine } from "../../../demo/kf-engine";
import TransportDock from "../../../demo/components/instrument/transport/TransportDock.vue";
import { useControlsKeyboardShortcuts } from "@components/instrument/transport/AnimationControlsGroup/useControlsKeyboardShortcuts";
import type { StoredAnimationGroupControlOptions } from "@state";

// THE LANE'S KNOWN WALL (X.KF.W12.b's record): glass-ui's `dock.js` and the
// `button` chunk import `@mkbabb/keyframes.js` by its published name, which the
// vitest alias cannot reach inside an externalised node_modules dependency.
// Exactly those two seams are stubbed, contract-faithfully — a `<button>` host
// with ordinary attr/listener fallthrough for Button/DockControl/DockTrigger, a
// host that renders the `#persistent` seat beside the two layers (default and
// `#collapsed`), as GlassDock 10.1.0 does, and exposes `expand()` for GlassDock. Everything else is REAL: the TransportDock SFC and
// its handlers, `usePlayActuation`, the keyboard registry (`/keyboard` loads
// clean), the Select family (re-exported from the real `/select` subpath),
// Tooltip and StatusDot. The dock's own listener phases are not exercised here
// — they are cited from the dist census in the derivation receipt; the policy's
// second actuator, the registry, IS exercised.
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
            return () =>
                h("div", { "data-dock-seat": "" }, [
                    h("div", { "data-seat": "persistent" }, slots.persistent?.()),
                    h("div", { "data-layer": "full" }, slots.default?.()),
                    h("div", { "data-layer": "summary" }, slots.collapsed?.()),
                ]);
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
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
});

const stored = (over: Partial<StoredAnimationGroupControlOptions> = {}) =>
    ({
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
        ...over,
    }) as StoredAnimationGroupControlOptions;

interface Seat {
    wrapper: VueWrapper;
    /** The registry's Space handler — `toggleAnimationGroup` (TD-2's second actuator). */
    registryToggle: ReturnType<typeof vi.fn>;
    /** The transport's own `togglePlay` emit (the button's native arm). */
    togglePlay: ReturnType<typeof vi.fn>;
    /** Every button whose accessible name begins with "Play animation" (one: the persistent Play). */
    playMirrors: () => HTMLButtonElement[];
    byName: (name: string) => HTMLButtonElement;
}

let seats: Seat[] = [];
afterEach(() => {
    for (const s of seats) s.wrapper.unmount();
    seats = [];
});

function mountTransport(over: Partial<StoredAnimationGroupControlOptions> = {}): Seat {
    const registryToggle = vi.fn();
    const togglePlay = vi.fn();
    const storedControls = stored(over);
    const Host = defineComponent({
        setup() {
            useControlsKeyboardShortcuts({
                toggleAnimationGroup: registryToggle,
                reset: () => {},
                resetIconSpin: () => {},
                getActiveT: () => 0,
                scrubActive: () => {},
                cycleAnimation: () => {},
                switchTab: () => {},
                activeKeyframesRef: ref(null),
                activeTimelineRef: ref(null),
            });
            return () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(TransportDock, {
                            storedControls,
                            isPlaying: false,
                            isStarted: false,
                            animationProgress: {},
                            animationNames: ["alpha", "beta"],
                            onTogglePlay: togglePlay,
                        }),
                });
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    const root = wrapper.element as HTMLElement;
    const seat: Seat = {
        wrapper,
        registryToggle,
        togglePlay,
        playMirrors: () =>
            Array.from(
                root.querySelectorAll<HTMLButtonElement>('button[aria-label^="Play animation"]'),
            ),
        byName: (name) => {
            const el = root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`);
            if (!el) throw new Error(`no button named "${name}" in the mounted transport`);
            return el;
        },
    };
    seats.push(seat);
    return seat;
}

const space = (type: "keydown" | "keyup", repeat = false) =>
    new KeyboardEvent(type, { key: " ", code: "Space", bubbles: true, cancelable: true, repeat });

/** One native Space press on `el`: keydown then keyup, both bubbling to window. */
function pressSpace(el: HTMLElement | Element): { down: KeyboardEvent; up: KeyboardEvent } {
    const down = space("keydown");
    const up = space("keyup");
    el.dispatchEvent(down);
    el.dispatchEvent(up);
    return { down, up };
}

describe("G-KFW13-3 — one propagation policy, both faces, with the registry mounted", () => {
    it("(1) Space on the focused Play actuates EXACTLY once — the native keyup arm; the registry does not fire beside it", () => {
        const s = mountTransport();
        const [expanded] = s.playMirrors();
        expect(expanded).toBeInstanceOf(HTMLButtonElement);
        const { down } = pressSpace(expanded!);
        expect(s.togglePlay).toHaveBeenCalledTimes(1);
        expect(s.registryToggle).not.toHaveBeenCalled();
        // The button's own arm owns the default (page scroll suppressed there).
        expect(down.defaultPrevented).toBe(true);
    });

    it("(1′) the collapsed face holds the SAME control under the SAME policy — one Play, in the persistent seat, one actuation per press, no registry echo, no `.stop` needed", () => {
        const s = mountTransport();
        const mirrors = s.playMirrors();
        // ONE Play (X.KF.W13W.d): it lives in glass's `#persistent` seat, outside
        // both crossfade layers, so the collapsed face shows the very control the
        // expanded face does — no second mirror to keep in step.
        expect(mirrors).toHaveLength(1);
        const play = mirrors[0]!;
        expect(play.closest('[data-seat="persistent"]')).not.toBeNull();
        expect(play.closest("[data-layer]")).toBeNull();
        pressSpace(play);
        expect(s.togglePlay).toHaveBeenCalledTimes(1);
        expect(s.registryToggle).not.toHaveBeenCalled();
        // A second press is one more actuation, not two.
        pressSpace(play);
        expect(s.togglePlay).toHaveBeenCalledTimes(2);
        expect(s.registryToggle).not.toHaveBeenCalled();
    });

    it("(2) Space on Reset leaves the activation default intact and does not fire playback", () => {
        const s = mountTransport();
        const reset = s.byName("Reset animation");
        const { down } = pressSpace(reset);
        expect(down.defaultPrevented).toBe(false);
        expect(s.registryToggle).not.toHaveBeenCalled();
        expect(s.togglePlay).not.toHaveBeenCalled();
    });

    it("(2′) Space on Collapse-timeline leaves the activation default intact and does not fire playback", () => {
        const s = mountTransport({ isTimelineExpanded: true });
        const chip = s.byName("Collapse timeline");
        const { down } = pressSpace(chip);
        expect(down.defaultPrevented).toBe(false);
        expect(s.registryToggle).not.toHaveBeenCalled();
        expect(s.togglePlay).not.toHaveBeenCalled();
    });

    it("(3) Space on the page (no activation target) toggles playback once, prevents scroll, and swallows auto-repeat", () => {
        const s = mountTransport();
        const down = space("keydown");
        document.body.dispatchEvent(down);
        expect(s.registryToggle).toHaveBeenCalledTimes(1);
        expect(down.defaultPrevented).toBe(true);
        document.body.dispatchEvent(space("keydown", true));
        document.body.dispatchEvent(space("keydown", true));
        expect(s.registryToggle).toHaveBeenCalledTimes(1);
        expect(s.togglePlay).not.toHaveBeenCalled();
    });
});
