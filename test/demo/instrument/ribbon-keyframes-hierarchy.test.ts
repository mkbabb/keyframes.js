/**
 * X.KF.W13X.mobile · UIA-KF-319 — the Keyframes ribbon has ONE row and a
 * hierarchy: Apply CSS (the stateful toggle, the primary) leads with its
 * label; Copy / Format / Export CSS are secondary icon commands (glass
 * `iconOnly`, each accessibly named).
 *
 * Served (1440x900, every scene): the four labelled sm Buttons wrapped 3 + 1
 * inside the 26rem rail, leaving Apply CSS alone on a second row (distinct
 * button tops = 2). The row count is a layout fact the served probe reads
 * (evidence W13X/mobile/rail.mjs); this test pins the structure that makes
 * one row possible: order and icon geometry.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, h, reactive } from "vue";
import RibbonBar from "../../../demo/components/instrument/transport/controls-pane/RibbonBar.vue";

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
});

function mountKeyframesRibbon() {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const storedControls = reactive({ selectedControl: "keyframes", selectedAnimation: "a" });
    const app = createApp({
        render: () =>
            h(RibbonBar, {
                storedControls: storedControls as never,
                activeKeyframesRef: { cssApplied: false },
                activeTimelineRef: null,
            }),
    });
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    return [...el.querySelectorAll("button")];
}

describe("UIA-KF-319 — the Keyframes ribbon hierarchy", () => {
    it("Apply CSS leads the row, labelled", () => {
        const buttons = mountKeyframesRibbon();
        expect(buttons).toHaveLength(4);
        expect(buttons[0]?.textContent?.trim()).toBe("Apply CSS");
        expect(buttons[0]?.hasAttribute("data-icon-only")).toBe(false);
    });

    it("Copy, Format and Export CSS are named icon commands", () => {
        const buttons = mountKeyframesRibbon().slice(1);
        expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual(["Copy", "Format", "Export CSS"]);
        for (const b of buttons) {
            expect(b.hasAttribute("data-icon-only")).toBe(true);
            expect(b.textContent?.trim()).toBe("");
        }
    });
});
