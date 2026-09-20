/**
 * test/demo/instrument/transport-icon-spin.test.ts — G-KFW13-4's spin half
 * (X.KF.W13.b · TD-1 + TD-4 + PRM, one commit with the composable).
 *
 * Drives `useIconSpin` the way TransportDock wires it — a real host component
 * owning a typed template ref on an HTMLElement that wraps the functional-lucide
 * glyph — against the REAL engine (`kfEngine()` warmed), and observes the engine
 * through prototype spies rather than a widened composable surface:
 *   (1) TD-1 — the target REACHES the engine: `setTargets` receives the host,
 *       and the host wraps the lucide `SVGSVGElement` the dead `instanceof
 *       HTMLElement` branches never matched (the premise stated, then cured).
 *   (2) TD-4 — nothing is built at setup: no `fromString` parse until the first
 *       spin; the second spin re-uses the instance.
 *   (3) PRM — under an active `prefers-reduced-motion: reduce` query the spin
 *       snaps (the engine's `respectReducedMotion` path): the host paints the
 *       final identity pose SYNCHRONOUSLY and never starts; without the query
 *       the first frame is mid-flight and `playing()` reads true.
 *   (4) teardown — unmounting the host `stop()`s the twist.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, useTemplateRef } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { RotateCcw } from "@lucide/vue";
import { kfEngine, warmKfEngine } from "../../../demo/kf-engine";
import { useIconSpin } from "@components/instrument/transport/TransportDock/useIconSpin";

beforeAll(async () => {
    await warmKfEngine();
});

let mounted: VueWrapper[] = [];
afterEach(() => {
    for (const w of mounted) w.unmount();
    mounted = [];
    vi.restoreAllMocks();
});

/** The TransportDock wiring, reduced to the seat under test. */
function mountSeat() {
    let spin: (() => void) | null = null;
    const Host = defineComponent({
        setup() {
            const resetIconEl = useTemplateRef<HTMLElement>("resetIconEl");
            const { resetIconSpin } = useIconSpin(resetIconEl);
            spin = resetIconSpin;
            return () =>
                h("button", { type: "button" }, [
                    h("span", { ref: "resetIconEl", class: "inline-flex" }, [
                        h(RotateCcw, { class: "icon-lg" }),
                    ]),
                ]);
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    mounted.push(wrapper);
    const host = wrapper.element.querySelector("span")!;
    return { wrapper, host, spin: () => spin!() };
}

const proto = () => kfEngine().CSSKeyframesAnimation.prototype;

/** One painted frame (jsdom rAF cadence). */
const frame = () => new Promise<void>((resolve) => setTimeout(resolve, 40));

/** Stub the reduce query on/off; the engine reads it at play time. */
function withReducedMotion(matches: boolean) {
    const mql = (query: string) =>
        ({
            matches: matches && /prefers-reduced-motion:\s*reduce/.test(query),
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
    vi.stubGlobal("matchMedia", mql);
    (window as unknown as { matchMedia: typeof mql }).matchMedia = mql;
}

describe("useIconSpin — TD-1 + TD-4 + PRM + teardown", () => {
    it("(1) TD-1 — the glyph host reaches the engine, and it wraps the lucide SVGSVGElement the dead branches never matched", () => {
        const setTargets = vi.spyOn(proto(), "setTargets");
        const { host, spin } = mountSeat();
        expect(host).toBeInstanceOf(HTMLElement);
        expect(host.firstElementChild).toBeInstanceOf(SVGSVGElement);
        spin();
        expect(setTargets).toHaveBeenCalledTimes(1);
        expect(setTargets.mock.calls[0]).toEqual([host]);
    });

    it("(2) TD-4 — nothing is parsed at setup; the twist is built on the first spin and memoised", () => {
        const fromString = vi.spyOn(proto(), "fromString");
        const { spin } = mountSeat();
        expect(fromString).not.toHaveBeenCalled();
        spin();
        expect(fromString).toHaveBeenCalledTimes(1);
        spin();
        expect(fromString).toHaveBeenCalledTimes(1);
    });

    it("(3) PRM — under an active reduce query the spin snaps to the final pose and runs no loop; without it, it plays", async () => {
        const setTargets = vi.spyOn(proto(), "setTargets");
        withReducedMotion(true);
        const reduced = mountSeat();
        reduced.spin();
        const twistReduced = setTargets.mock.instances[0] as { playing(): boolean };
        // The final, identity pose is painted SYNCHRONOUSLY and nothing starts.
        expect(reduced.host.style.transform).toContain("rotateY(-360deg)");
        await frame();
        expect(twistReduced.playing()).toBe(false);
        expect(reduced.host.style.transform).toContain("rotateY(-360deg)");

        withReducedMotion(false);
        const free = mountSeat();
        free.spin();
        const twistFree = setTargets.mock.instances[1] as { playing(): boolean; stop(): unknown };
        await frame();
        expect(twistFree.playing()).toBe(true);
        expect(free.host.style.transform).toMatch(/rotateY\(-?\d/);
        expect(free.host.style.transform).not.toContain("rotateY(-360deg)");
        twistFree.stop();
    });

    it("(4) teardown — unmounting the host stops the twist", () => {
        withReducedMotion(false);
        const setTargets = vi.spyOn(proto(), "setTargets");
        const stop = vi.spyOn(proto(), "stop");
        const seat = mountSeat();
        seat.spin();
        const twist = setTargets.mock.instances[0];
        expect(stop).not.toHaveBeenCalled();
        seat.wrapper.unmount();
        mounted = [];
        expect(stop).toHaveBeenCalledTimes(1);
        expect(stop.mock.instances[0]).toBe(twist);
    });
});
