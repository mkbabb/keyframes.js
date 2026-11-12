/**
 * owner-1112 (item 2, "these and other icons should animate on hover") — every
 * option glyph carries a hover motion, and every motion it names has a rule in
 * the one idiom (`svg[data-glyph-motion]`, design-idioms.css) that moves it only
 * while its own control is hovered or highlighted, and never under reduced motion.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as glyphs from "../../../demo/components/instrument/pane/channel-controls/optionGlyphs";

const css = readFileSync(resolve(process.cwd(), "demo/styles/design-idioms.css"), "utf8");
const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");
const MOTION = (glyphs as Record<string, unknown>).OPTION_GLYPH_MOTION as Record<string, string> | undefined;

describe("option glyphs move on hover (owner-1112 item 2)", () => {
    it("every glyph has a motion, and every motion has a hover rule", () => {
        expect(MOTION).toBeDefined();
        expect(Object.keys(MOTION ?? {}).sort()).toEqual(Object.keys(glyphs.OPTION_GLYPHS).sort());
        for (const motion of new Set(Object.values(MOTION ?? {})))
            expect(css, motion).toMatch(
                new RegExp(`:is\\(\\[data-highlighted\\], button:hover\\) svg\\[data-glyph-motion="${motion}"\\]`),
            );
    });
    it("the motion is a transition gated on no-preference (a lean that returns, no snap)", () => {
        expect(css).toMatch(/svg\[data-glyph-motion\] > \* \{[^}]*transition:/);
        const at = css.indexOf("@media (prefers-reduced-motion: no-preference)");
        expect(at).toBeGreaterThan(-1);
        expect(css.slice(at)).toMatch(/data-glyph-motion="lean-end"/);
    });
    it("the trigger and every option glyph carry their motion name", () => {
        const form = read("demo/components/instrument/pane/channel-controls/ChannelOptionsForm.vue");
        expect(form.match(/:data-glyph-motion="OPTION_GLYPH_MOTION\[/g)?.length).toBe(2);
    });
});
