/**
 * X.KF.W13X.mobile · UIA-KF-319 — the Keyframes ribbon has ONE row and a
 * hierarchy: Apply CSS (the stateful toggle, the primary) leads with its
 * label; Copy / Format / Export CSS are secondary commands — quiet and
 * labelled since X-DS pass 4 (KF-C4-12), each accessibly named.
 *
 * Served (1440x900, every scene): the four labelled sm Buttons wrapped 3 + 1
 * inside the 26rem rail, leaving Apply CSS alone on a second row (distinct
 * button tops = 2). The row count is a layout fact the served probe reads
 * (evidence W13X/mobile/rail.mjs); this test pins the structure that makes
 * one row possible: order and icon geometry.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, h, reactive } from "vue";
import RibbonBar from "@components/instrument/pane/RibbonBar.vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

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
        // The app mounts every surface under glass's TooltipProvider.
        render: () =>
            h(TooltipProvider, null, {
                default: () => h(RibbonBar, { storedControls: storedControls as never }),
            }),
    });
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    return [...el.querySelectorAll("button")];
}

describe("UIA-KF-319 + owner-1112 [42] — the Keyframes ribbon is a centred glass dock with a hierarchy", () => {
    it("the four verbs sit in one never-folding glass dock, centred in the ribbon", () => {
        mountKeyframesRibbon();
        const row = document.querySelector(".ribbon-dock");
        expect(row, "the ribbon's dock row").not.toBeNull();
        expect(row!.classList.contains("justify-center")).toBe(true);
        const dock = row!.querySelector(".glass-dock, [data-slot='dock'], [class*='dock']");
        expect(dock, "a glass dock").not.toBeNull();
    });

    it("Apply CSS leads, labelled, and is a toggle (aria-pressed)", () => {
        const buttons = mountKeyframesRibbon();
        expect(buttons).toHaveLength(4);
        expect(buttons[0]?.textContent?.trim()).toBe("Apply CSS");
        expect(buttons[0]?.getAttribute("aria-pressed")).toBe("false");
    });

    // In the dock the three commands are glyph seats (four glyph-and-word
    // seats overflowed the ~360 px rail); each keeps its accessible name and
    // says its word in a glass tooltip.
    it("Copy, Format and Compiled are named glyph seats", () => {
        const buttons = mountKeyframesRibbon().slice(1);
        expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual(["Copy keyframes", "Format", "Copy compiled CSS"]);
        for (const b of buttons) {
            expect(b.querySelector("svg"), "a glyph").not.toBeNull();
            expect(b.textContent?.trim()).toBe("");
        }
    });
});
