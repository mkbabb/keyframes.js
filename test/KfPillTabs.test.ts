/**
 * test/KfPillTabs.test.ts — the S.B7 (fold row 71, T8) interaction-axis gate.
 *
 * KfPillTabs (the DM-5 CONTINGENCY-KILL SegmentedTabs replacement, promoted to a
 * standard panel primitive at S.D2) shipped UNTESTED with a roving-tabindex
 * defect (a12 F1, HIGH): the arrow handler moved SELECTION but never FOCUS, so
 * focus stayed pinned to the entry tab and traversal collapsed one hop in — a
 * third tab was unreachable by keyboard. The 2-option spring strip masked it; the
 * 3+-option control strip was the live victim.
 *
 * This is the T8 half a source-shape gate cannot cover: a REAL interaction test.
 * It mounts a representative `role=tablist` host wiring `useKfPillTabs` — the
 * exact keyboard core KfPillTabs.vue consumes — attached to document.body so jsdom
 * focus + `activeElement` are LIVE, dispatches real `KeyboardEvent`s, and asserts
 * that arrow/Home/End move FOCUS and SELECTION together across ≥3 tabs (the third
 * tab reachable), with wrap, disabled-skip, and an empty-`modelValue` tab stop.
 * (vitest has no Vue-SFC plugin — the composable is driven through a host, exactly
 * as KfPillTabs.vue wires it; the useToolbarKeyboard precedent.)
 *
 * BITE: revert the `focusTab` call in useKfPillTabs → focus stops following
 * selection → the "third tab reachable" assertion reds (recorded via revert).
 */
import { afterEach, describe, expect, it } from "vitest";
import { type App, createApp, defineComponent, h, nextTick, ref } from "vue";
import {
    useKfPillTabs,
    type KfPillTabOption,
} from "@components/custom/useKfPillTabs";

interface Harness {
    /** The rendered tab buttons, in DOM order. */
    tabs: () => HTMLButtonElement[];
    /** The tab whose value is currently the model selection. */
    selected: () => string;
    /** `data-value` of the focused tab, or null. */
    focusedValue: () => string | null;
    /** Dispatch a bubbling keydown from the currently-focused tab. */
    press: (key: string) => Promise<void>;
    /** Focus the tab with the given value (simulate Tab-into + click focus). */
    focus: (value: string) => void;
    cleanup: () => void;
}

let mounted: Array<{ app: App; el: HTMLElement }> = [];

afterEach(() => {
    for (const m of mounted) {
        m.app.unmount();
        m.el.remove();
    }
    mounted = [];
});

function mountTablist(
    options: KfPillTabOption[],
    initial: string,
    orientation: "horizontal" | "vertical" = "horizontal",
): Harness {
    const model = ref(initial);
    const Host = defineComponent({
        setup() {
            const kb = useKfPillTabs({
                options: () => options,
                orientation: () => orientation,
                modelValue: () => model.value,
                select: (v) => {
                    model.value = v;
                },
            });
            return () =>
                h(
                    "div",
                    { role: "tablist", "aria-orientation": orientation },
                    options.map((opt) =>
                        h(
                            "button",
                            {
                                type: "button",
                                role: "tab",
                                "data-value": opt.value,
                                disabled: opt.disabled,
                                "aria-selected": opt.value === model.value,
                                tabindex: opt.value === kb.rovingValue.value ? 0 : -1,
                                onKeydown: (e: KeyboardEvent) =>
                                    kb.onKeydown(e, opt.value),
                            },
                            opt.label,
                        ),
                    ),
                );
        },
    });
    const app = createApp(Host);
    const el = document.createElement("div");
    document.body.appendChild(el);
    app.mount(el);
    mounted.push({ app, el });

    const tabs = () =>
        Array.from(el.querySelectorAll<HTMLButtonElement>("[role=tab]"));
    const byValue = (value: string) =>
        tabs().find((b) => b.dataset.value === value);
    return {
        tabs,
        selected: () => model.value,
        focusedValue: () =>
            (document.activeElement as HTMLElement | null)?.dataset.value ?? null,
        press: async (key) => {
            (document.activeElement ?? el).dispatchEvent(
                new KeyboardEvent("keydown", { key, bubbles: true }),
            );
            await nextTick(); // the focus move is queued on nextTick
        },
        focus: (value) => byValue(value)?.focus(),
        cleanup: () => {
            app.unmount();
            el.remove();
            mounted = mounted.filter((m) => m.el !== el);
        },
    };
}

const OPTS: KfPillTabOption[] = [
    { label: "Controls", value: "controls" },
    { label: "Keyframes", value: "keyframes" },
    { label: "Timeline", value: "timeline" },
];

describe("KfPillTabs — roving-tabindex keyboard traversal (a12 F1)", () => {
    it("the single tab stop is the selected tab (tabindex 0)", () => {
        const h = mountTablist(OPTS, "controls");
        const [a, b, c] = h.tabs();
        expect(a!.tabIndex).toBe(0);
        expect(b!.tabIndex).toBe(-1);
        expect(c!.tabIndex).toBe(-1);
    });

    it("ArrowRight moves BOTH focus and selection — the 3rd tab is reachable", async () => {
        const h = mountTablist(OPTS, "controls");
        h.focus("controls");
        expect(h.focusedValue()).toBe("controls");

        await h.press("ArrowRight");
        expect(h.selected()).toBe("keyframes");
        expect(h.focusedValue()).toBe("keyframes"); // focus FOLLOWED selection

        // The bug: focus stayed on tab 1, so this second hop was unreachable.
        await h.press("ArrowRight");
        expect(h.selected()).toBe("timeline");
        expect(h.focusedValue()).toBe("timeline"); // the THIRD tab, reached
    });

    it("wraps at both ends", async () => {
        const h = mountTablist(OPTS, "timeline");
        h.focus("timeline");
        await h.press("ArrowRight"); // wrap forward → first
        expect(h.focusedValue()).toBe("controls");
        await h.press("ArrowLeft"); // wrap back → last
        expect(h.focusedValue()).toBe("timeline");
    });

    it("Home/End jump to the first/last tab", async () => {
        const h = mountTablist(OPTS, "keyframes");
        h.focus("keyframes");
        await h.press("End");
        expect(h.focusedValue()).toBe("timeline");
        expect(h.selected()).toBe("timeline");
        await h.press("Home");
        expect(h.focusedValue()).toBe("controls");
        expect(h.selected()).toBe("controls");
    });

    it("skips a disabled tab", async () => {
        const opts: KfPillTabOption[] = [
            { label: "A", value: "a" },
            { label: "B", value: "b", disabled: true },
            { label: "C", value: "c" },
        ];
        const h = mountTablist(opts, "a");
        h.focus("a");
        await h.press("ArrowRight");
        expect(h.focusedValue()).toBe("c"); // B skipped
        expect(h.selected()).toBe("c");
    });

    it("a vertical strip navigates on ArrowUp/ArrowDown", async () => {
        const h = mountTablist(OPTS, "controls", "vertical");
        h.focus("controls");
        await h.press("ArrowDown");
        expect(h.focusedValue()).toBe("keyframes");
        await h.press("ArrowUp");
        expect(h.focusedValue()).toBe("controls");
    });

    it("empty/unmatched modelValue still leaves a tab stop (Tab-reachable)", () => {
        const h = mountTablist(OPTS, "");
        // No selection matches → the first enabled tab holds the roving 0 stop.
        expect(h.tabs()[0]!.tabIndex).toBe(0);
        expect(h.tabs().some((b) => b.tabIndex === 0)).toBe(true);
    });
});
