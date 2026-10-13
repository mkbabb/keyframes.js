// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shared — three shared-seat rows, read at the bytes.
 *
 *  · the `.stage-field-x` idiom closes: it ruled quarter lines at 0/25/50/75 %
 *    and no line at 100 %, so a field had no right edge at x = +1 while `-y`
 *    had its baseline. The Square patched its own copy shut with a border; the
 *    idiom draws the closing line now, and the patch is gone.
 *  · A2-KE-L2-14, consumer residue: the ppmycota row's trailing site link was a
 *    bare 16 x 16 px glyph anchor. Its target is the row's full height and a
 *    44 px inline slot.
 *  · UIA-KF-064, sequence half: the Sequence stage hand-rolled a status span.
 *    It reports no state now, and the badge markup has one author.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import SceneStageHeader from "../../../demo/scenes/SceneStageHeader.vue";

const read = (rel: string): string => readFileSync(resolve(process.cwd(), rel), "utf8");
/** The declarations of the one rule whose selector is exactly `selector`. */
const rule = (css: string, selector: string): string => {
    const at = css.search(new RegExp(`^${selector.replace(/[.\\]/g, "\\$&")} \\{`, "m"));
    expect(at).toBeGreaterThanOrEqual(0);
    return css.slice(at, css.indexOf("\n}", at));
};

describe("the .stage-field-x idiom closes at 100 %", () => {
    const idioms = read("demo/styles/design-idioms.css");

    it("rules a closing line on the inline end, beside its quarter lines", () => {
        const x = rule(idioms, ".stage-field-x");
        expect(x).toMatch(/repeating-linear-gradient\(\s*to right,/);
        // the closing edge: one hairline measured from the right, the mirror of -y's baseline
        expect(x).toMatch(/linear-gradient\(to left, var\(--border\) 1px, transparent 1px\)/);
        expect(rule(idioms, ".stage-field-y")).toMatch(/linear-gradient\(to top, var\(--border\) 1px, transparent 1px\)/);
    });

    it("the Square no longer shuts its own copy with a border", () => {
        const sfc = read("demo/scenes/square/SquareInstrument.vue");
        const style = sfc.slice(sfc.indexOf("<style"));
        expect(style).not.toMatch(/\.square-field\.stage-field-x/);
        expect(style).not.toMatch(/border-inline-end/);
    });
});

describe("A2-KE-L2-14 — the ppmycota site link is a full target", () => {
    it("the anchor fills the row's height and holds a 44 px inline slot", () => {
        const menu = read("demo/app/dock/menu/MbabbMenu.vue").replace(/<!--[\s\S]*?-->/g, "");
        const anchor = menu.match(/<a href="https:\/\/ppmycota\.com"[^>]*>/)?.[0] ?? "";
        expect(anchor).not.toBe("");
        const classes = (anchor.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/);
        for (const c of ["self-stretch", "inline-flex", "items-center", "justify-center", "min-w-11"]) {
            expect(classes).toContain(c);
        }
        // the glyph stays 16 px; the target is the anchor's box
        expect(anchor).toMatch(/aria-label="ppmycota\.com"/);
    });
});

describe("UIA-KF-064 — the sequence half", () => {
    it("the Sequence stage reports no status, so it renders no badge", () => {
        const target = read("demo/scenes/sequence/SequenceTarget.vue").replace(/<!--[\s\S]*?-->/g, "");
        const header = target.match(/<SceneStageHeader[\s\S]*?>/)?.[0] ?? "";
        expect(header).not.toBe("");
        expect(header).not.toMatch(/\bstatus=|:status=/);
        expect(target).not.toMatch(/status-badge/);
    });

    it("the one header renders the badge only when a status is given", () => {
        const none = mount(SceneStageHeader, { props: { title: "Sequence" } });
        expect(none.findAll(".status-badge")).toHaveLength(0);
        none.unmount();
        const some = mount(SceneStageHeader, { props: { title: "Square", status: "settled" } });
        expect(some.findAll(".status-badge")).toHaveLength(1);
        some.unmount();
    });
});
