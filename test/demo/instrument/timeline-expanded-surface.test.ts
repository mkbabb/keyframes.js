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
 * X-DS r6 pass 5 (KF-C5-01 · KF-C5-02) — unfolded on the desktop rail the
 * timeline is a section of the pane's one frame: no card of its own, its verbs
 * in the pane ribbon.
 * X-DS r6 pass 6 (KF-C6-01) — and at 390 too: the expanded cell over the
 * stage (the last place the timeline drew a Card, stacked on the controls
 * sheet over the cube) is deleted with the `sheet` prop, so the timeline has
 * one place at every width and never draws a card of its own.
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

describe("UIA-KF-085 → KF-C6-01 — the timeline draws no card of its own, folded or unfolded", () => {
    // X-DS pass 1, C1 (KF-C1-07) — in the pane the timeline draws no card of
    // its own: the pane host draws the one frame, so a second stamp would be a
    // card in a card. Its content keeps its own inset.
    it("folded (in the pane): no card of its own, the content keeps its inset", () => {
        const w = mountTimeline(false);
        expect(w.find(".card").exists()).toBe(false);
        // X-DS pass 9 (KF-C9-07): the inline inset is the pane's one token.
        // X-DS pass 11 (KF-C11-04): the block start is the pane header line's.
        // X-DS r6 pass 9 (KF-C9-05): both are now the pane header's own — the
        // timeline wears glass's ConfiguratorLayer (the facets' header), which
        // insets its trigger and body by `--configurator-pad-inline`; the body
        // keeps the pb-4 foot.
        const layer = w.get("[data-slot=configurator-layer]");
        expect(layer.get(".configurator-section-label").text()).toBe("Timeline");
        expect(layer.get(".configurator-layer-body").classes()).toContain("pb-4");
        w.unmount();
    });

    // KF-C5-01 · KF-C6-01 — unfolded: a taller track in the pane's one frame
    // (the rail's, or the 390 sheet's), never a second card over the pane.
    it("unfolded: no card of its own, no cartoon stamp, the same inset", () => {
        const w = mountTimeline(true);
        expect(w.find(".card").exists()).toBe(false);
        expect(w.find(".cartoon-surface").exists()).toBe(false);
        const layer = w.get("[data-slot=configurator-layer]");
        expect(layer.get(".configurator-layer-body").classes()).toContain("pb-4");
        w.unmount();
    });

    it("the `sheet` prop is retired with the expanded cell", () => {
        expect(Object.keys((KeyframeTimeline as { props?: object }).props ?? {})).not.toContain("sheet");
    });
});

// X-DS pass 2 (KF-C2-04) — the timeline's verbs travel with it. Docked in the
// pane they are teleported to the frame's ribbon (one row under the pane's
// hairline), folded or unfolded, at every width (KF-C6-01) — never left
// behind in the rail as a titleless card of four buttons.
describe("KF-C2-04 — the timeline's verbs go where the timeline goes", () => {
    const withRibbon = (expanded: boolean) => {
        const ribbon = document.createElement("div");
        ribbon.id = "timeline-ribbon-target";
        document.body.appendChild(ribbon);
        const w = mountTimeline(expanded);
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

    it("unfolded: the verbs stay in the pane ribbon", async () => {
        const { w, ribbon } = withRibbon(true);
        await w.vm.$nextTick();
        expect(snapshotIn(ribbon)).toBe(true);
        expect(snapshotIn(w.element as Element)).toBe(false);
        w.unmount();
    });
});
