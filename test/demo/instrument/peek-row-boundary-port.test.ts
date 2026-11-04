/**
 * value.js X §0hm.1 D-28 — the phone PEEK detent lands on a row boundary AS
 * SEEN THROUGH THE SHEET'S SCROLL PORT.
 *
 * Served at d6277e80 (390x844, cube): the sheet rested at 181 px, its scroll
 * port ended 20.5 px above the sheet's foot (the reserve counted only the
 * sheet's 12 px end padding), and the first field (`duration`, 40 px) showed
 * cut 9 px short. The geometry below is that page's, relative to the sheet's
 * top edge; the port's end ramp (glass's `--fade-scroll-width`) feathers its
 * last px while rows trail below, though its scroll-driven value still reads 0
 * at mount, when the detent is measured.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { rowBoundaryPeek } from "@components/instrument/pane/composables/useStageReserve";

const IH = 844;
const SHEET_PAD_END = 12;
const PORT_INSET = 20.5; // sheet foot → port clip edge
const RAMP = 16; // glass's --fade-scroll-width (1rem); the live ramp has not run at mount
const ROWS = [
    { slot: "configurator-layer-trigger", top: 66, bottom: 121 },
    { slot: "labeled-field", top: 129, bottom: 169 },
    { slot: "labeled-field", top: 173, bottom: 213 },
    { slot: "labeled-field", top: 217, bottom: 257 },
];

const rect = (top: number, bottom: number) =>
    ({ top, bottom, height: bottom - top, left: 0, right: 390, width: 390, x: 0, y: top }) as DOMRect;

/** Build the sheet at a resting height `h`: sheet → port → wrapper → rows. */
const build = (h: number) => {
    const sheet = document.createElement("div");
    const port = document.createElement("div");
    port.className = "fading-scroll fading-scroll--y";
    const wrapper = document.createElement("div"); // content-sized overflow:hidden
    sheet.append(port);
    port.append(wrapper);
    for (const r of ROWS) {
        const e = document.createElement("div");
        e.dataset.slot = r.slot;
        e.getBoundingClientRect = () => rect(r.top, r.bottom);
        wrapper.append(e);
    }
    sheet.getBoundingClientRect = () => rect(0, h);
    port.getBoundingClientRect = () => rect(40, h - PORT_INSET);
    wrapper.getBoundingClientRect = () => rect(66, 400);
    const styles = new Map<Element, Record<string, string>>([
        [sheet, { minBlockSize: "171px", paddingBlockEnd: `${SHEET_PAD_END}px`, overflowY: "visible" }],
        [port, { overflowY: "auto", borderBottomWidth: "0px", "--fade-end": "0px", "--fade-scroll-width": "1rem" }],
        [wrapper, { overflowY: "hidden", borderBottomWidth: "0px", "--fade-end": "0px" }],
    ]);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
        const s = styles.get(el) ?? { overflowY: "visible", borderBottomWidth: "0px", fontSize: `${RAMP}px` };
        return { ...s, getPropertyValue: (k: string) => s[k] ?? "" } as unknown as CSSStyleDeclaration;
    });
    return sheet;
};

const SELECTOR = '[data-slot="configurator-layer-trigger"], [data-slot="labeled-field"]';

afterEach(() => vi.restoreAllMocks());

describe("D-28 — the PEEK rests on a row foot seen through the port", () => {
    it("draws every row it shows whole: none straddles the port's clean edge", () => {
        vi.stubGlobal("innerHeight", IH);
        const t = rowBoundaryPeek(build(171), SELECTOR);
        expect(t).not.toBeNull();
        const h = t! * IH;
        // The port's clean edge at the resting height: its clip, less the ramp.
        const clean = h - PORT_INSET - RAMP;
        const cut = ROWS.filter((r) => r.top < clean - 1 && r.bottom > clean + 1);
        expect(cut).toEqual([]);
        // …and the first field is shown whole, not traded for the header alone.
        expect(clean).toBeGreaterThanOrEqual(ROWS[1]!.bottom - 0.5);
        vi.unstubAllGlobals();
    });

    it("stays at or above glass's floor", () => {
        vi.stubGlobal("innerHeight", IH);
        const t = rowBoundaryPeek(build(171), SELECTOR)!;
        expect(t * IH).toBeGreaterThanOrEqual(171 - 0.5);
        vi.unstubAllGlobals();
    });
});
