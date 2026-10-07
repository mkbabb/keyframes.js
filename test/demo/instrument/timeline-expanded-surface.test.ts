/**
 * test/demo/instrument/timeline-expanded-surface.test.ts — X.KF.W13X.timeline,
 * UIA-KF-085: expanded, the timeline's glass Card had its material stripped by
 * class overrides (`border-0 shadow-none bg-transparent`, `p-2 px-0`) inside a
 * hand-dressed wash cell. The Card is the surface in both modes; expanded, it
 * floats over the stage at glass's floating tier.
 *
 * The cell and the one-timeline half (KFA-56 / UIA-KF-019) are served:
 * `evidence/W13X/timeline/cell.mjs` — BEFORE ×2 3 timelines in the cell, the
 * card transparent inside a 16px wash; AFTER ×2 1 timeline, the card painted.
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";

afterEach(() => {
    document.body.innerHTML = "";
});

const mountTimeline = (expanded: boolean) =>
    mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(KeyframeTimeline, { targets: [document.createElement("div")], expanded }),
            ),
        ),
        { attachTo: document.body, global: { stubs: { CSSPasteDialog: true } } },
    );

describe("UIA-KF-085 — the expanded timeline keeps its Card's material", () => {
    it("expanded: no class strips the Card's border, shadow or fill", () => {
        const w = mountTimeline(true);
        const card = w.get(".cartoon-surface");
        for (const stripped of ["border-0", "shadow-none", "bg-transparent"]) {
            expect(card.classes()).not.toContain(stripped);
        }
        const content = card.get(".relative.flex.flex-col");
        expect(content.classes()).toContain("p-4");
        expect(content.classes()).not.toContain("px-0");
        w.unmount();
    });

    // X-DS pass 1, C1 (KF-C1-07) — in the pane the timeline draws no card of
    // its own: the pane host draws the one frame, so a second stamp would be a
    // card in a card. Its content keeps its own inset.
    it("collapsed (in the pane): no card of its own, the content keeps its inset", () => {
        const w = mountTimeline(false);
        expect(w.find(".cartoon-surface").exists()).toBe(false);
        const content = w.get(".relative.flex.flex-col");
        expect(content.classes()).toContain("p-4");
        w.unmount();
    });

    it("expanded, the Card floats at glass's floating tier", () => {
        const w = mountTimeline(true);
        const card = w.get(".cartoon-surface");
        const root = card.element as HTMLElement;
        expect([root.className, ...Object.values(root.dataset)].join(" ")).toMatch(/floating/);
        w.unmount();
    });
});
