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
 *
 * X-DS r6 pass 5 (KF-C5-01 · KF-C5-02) — the Card is drawn only in the 390
 * sheet over the stage (`sheet`, the expanded cell), at the controls sheet's
 * floating tier and with no `cartoon-surface` stamp. Unfolded on the desktop
 * rail (`expanded` without `sheet`) the timeline is a section of the pane's
 * one frame: no card of its own, its verbs in the pane ribbon.
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";

afterEach(() => {
    document.body.innerHTML = "";
});

const mountTimeline = (expanded: boolean, sheet = expanded) =>
    mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(KeyframeTimeline, { targets: [document.createElement("div")], expanded, sheet }),
            ),
        ),
        { attachTo: document.body, global: { stubs: { CSSPasteDialog: true } } },
    );

describe("UIA-KF-085 — the expanded timeline keeps its Card's material", () => {
    it("expanded: no class strips the Card's border, shadow or fill", () => {
        const w = mountTimeline(true);
        const card = w.get(".card");
        for (const stripped of ["border-0", "shadow-none", "bg-transparent"]) {
            expect(card.classes()).not.toContain(stripped);
        }
        const content = card.get(".relative.flex.flex-col");
        // X-DS pass 9 (KF-C9-07): the inline inset is the pane's one token.
        expect(content.classes()).toEqual(expect.arrayContaining(["px-(--configurator-pad-inline)", "py-4"]));
        expect(content.classes()).not.toContain("px-0");
        w.unmount();
    });

    // X-DS pass 1, C1 (KF-C1-07) — in the pane the timeline draws no card of
    // its own: the pane host draws the one frame, so a second stamp would be a
    // card in a card. Its content keeps its own inset.
    it("collapsed (in the pane): no card of its own, the content keeps its inset", () => {
        const w = mountTimeline(false);
        expect(w.find(".card").exists()).toBe(false);
        const content = w.get(".relative.flex.flex-col");
        // X-DS pass 9 (KF-C9-07): the inline inset is the pane's one token.
        // X-DS pass 11 (KF-C11-04): the block start is the pane header line's.
        expect(content.classes()).toEqual(expect.arrayContaining(["px-(--configurator-pad-inline)", "pt-2", "pb-4"]));
        w.unmount();
    });

    it("in the sheet, the Card wears the controls sheet's floating tier, with no cartoon stamp", () => {
        const w = mountTimeline(true);
        const card = w.get(".card");
        const root = card.element as HTMLElement;
        expect([root.className, ...Object.values(root.dataset)].join(" ")).toMatch(/floating/);
        expect(w.find(".cartoon-surface").exists()).toBe(false);
        w.unmount();
    });

    // KF-C5-01 — unfolded on the desktop rail: a taller track in the pane's
    // one frame, never a second card over the pane.
    it("unfolded on the rail (expanded, not the sheet): no card of its own", () => {
        const w = mountTimeline(true, false);
        expect(w.find(".card").exists()).toBe(false);
        expect(w.find(".cartoon-surface").exists()).toBe(false);
        w.unmount();
    });
});

// X-DS pass 2 (KF-C2-04) — the timeline's verbs travel with it. Docked in the
// pane they are teleported to the frame's ribbon (one row under the pane's
// hairline); expanded they are the floating card's footer — never left behind
// in the rail as a titleless card of four buttons.
describe("KF-C2-04 — the timeline's verbs go where the timeline goes", () => {
    const withRibbon = (expanded: boolean, sheet = expanded) => {
        const ribbon = document.createElement("div");
        ribbon.id = "timeline-ribbon-target";
        document.body.appendChild(ribbon);
        const w = mountTimeline(expanded, sheet);
        return { w, ribbon };
    };
    const snapshotIn = (root: Element) =>
        [...root.querySelectorAll("button")].some((b) => b.textContent?.trim() === "Snapshot");

    it("docked: the verbs are in the pane ribbon, not in the timeline body", async () => {
        const { w, ribbon } = withRibbon(false);
        await w.vm.$nextTick();
        expect(snapshotIn(ribbon)).toBe(true);
        expect(snapshotIn(w.element as Element)).toBe(false);
        w.unmount();
    });

    it("unfolded on the rail: the verbs stay in the pane ribbon", async () => {
        const { w, ribbon } = withRibbon(true, false);
        await w.vm.$nextTick();
        expect(snapshotIn(ribbon)).toBe(true);
        expect(snapshotIn(w.element as Element)).toBe(false);
        w.unmount();
    });

    it("in the sheet: the verbs are the sheet card's footer, under a separator", async () => {
        const { w, ribbon } = withRibbon(true);
        await w.vm.$nextTick();
        expect(snapshotIn(ribbon)).toBe(false);
        const card = w.get(".card").element;
        expect(snapshotIn(card)).toBe(true);
        const lead = [...card.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Snapshot")!;
        expect(lead.parentElement?.previousElementSibling?.classList.contains("separator")).toBe(true);
        w.unmount();
    });
});
