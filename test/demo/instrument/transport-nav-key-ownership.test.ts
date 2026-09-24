/**
 * test/demo/instrument/transport-nav-key-ownership.test.ts — X.KF.W13V.u · KFA-95.
 *
 * The page-level transport scrub shortcuts (ArrowLeft/ArrowRight ± Shift, Home,
 * End) are dispatched by glass-ui's ONE keyboard registry from a bubble-phase
 * `window` listener — the LAST listener an event reaches. A focused widget that
 * owns those keys (the Square box's nudges, the ribbon's Slider thumb, any
 * APG slider/grid) has already handled the press and marked it handled with
 * `preventDefault` by the time the registry sees it. At glass 7.0.0 (the
 * audit's capture) the dispatcher ignored `defaultPrevented`, so the transport
 * scrubbed AGAIN on that consumed event — two actuators for one press (Square:
 * Home re-seated the tour pose under the box's own re-centre; the ribbon: +2
 * steps whenever the two writers read different playheads). glass 10.0.1's
 * dispatcher returns on a consumed event (installed by X.KF.W13R.m `dca116e1`);
 * this file is the consumer's lock on that contract — GREEN-BEFORE-CURE (R.2),
 * LANDED-BY the repin, never claimed as a local cure.
 *
 * The policy (the same one TD-40 wrote for Space): a key a focused control
 * already consumed belongs to that control; the page-level shortcut stands
 * aside, and fires — once, preventing the scroll default itself — for every
 * press no widget claimed.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { useControlsKeyboardShortcuts } from "@components/instrument/transport/AnimationControlsGroup/useControlsKeyboardShortcuts";

let wrappers: VueWrapper[] = [];
afterEach(() => {
    for (const w of wrappers) w.unmount();
    wrappers = [];
});

function seat() {
    const scrubActive = vi.fn();
    const Host = defineComponent({
        setup() {
            useControlsKeyboardShortcuts({
                toggleAnimationGroup: () => {},
                reset: () => {},
                resetIconSpin: () => {},
                getActiveT: () => 0.5,
                scrubActive,
                cycleAnimation: () => {},
                switchTab: () => {},
                activeKeyframesRef: ref(null),
                activeTimelineRef: ref(null),
            });
            return () =>
                h("div", [
                    // A focused widget that OWNS its navigation keys (the Square
                    // box / a Slider thumb): it handles the press and marks it.
                    h("div", {
                        "data-widget": "",
                        role: "slider",
                        tabindex: 0,
                        onKeydown: (e: KeyboardEvent) => e.preventDefault(),
                    }),
                    // A focusable that does NOT own the keys.
                    h("div", { "data-plain": "", tabindex: 0 }),
                ]);
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    wrappers.push(wrapper);
    const el = (sel: string) => wrapper.element.querySelector(sel) as HTMLElement;
    const press = (target: HTMLElement, key: string, shiftKey = false) => {
        const e = new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true });
        target.dispatchEvent(e);
        return e;
    };
    return { scrubActive, widget: el("[data-widget]"), plain: el("[data-plain]"), press };
}

const NAV: Array<[string, boolean]> = [
    ["ArrowLeft", false],
    ["ArrowRight", false],
    ["ArrowLeft", true],
    ["ArrowRight", true],
    ["Home", false],
    ["End", false],
];

describe("KFA-95 — a navigation key a focused widget consumed is not scrubbed twice", () => {
    it.each(NAV)("%s (shift=%s) on a key-owning widget: the transport stands aside", (key, shift) => {
        const s = seat();
        s.press(s.widget, key, shift);
        expect(s.scrubActive).not.toHaveBeenCalled();
    });

    it.each(NAV)("%s (shift=%s) with no owner: the transport scrubs once and prevents the default", (key, shift) => {
        const s = seat();
        const e = s.press(s.plain, key, shift);
        expect(s.scrubActive).toHaveBeenCalledTimes(1);
        expect(e.defaultPrevented).toBe(true);
    });
});
