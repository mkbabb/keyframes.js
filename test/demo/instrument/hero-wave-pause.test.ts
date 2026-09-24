/**
 * test/demo/instrument/hero-wave-pause.test.ts — X.KF.W13V.u · KFA-134.
 *
 * The hero wave's in-content pause (WCAG 2.2.2, KF-AT-17) was claimed in
 * AnimatedText's docblock ("`--motion-weight: 0` on any ancestor stills the
 * wave … reachable from the app") while no UI ever set the weight. The start
 * screen now owns one toggle that writes the producer's `--motion-weight: 0` on
 * the heading. Mounts the REAL EditorStartScreen; the TypingDots engine seam is
 * stubbed (its own contract is typing-dots-engine-seam.test.ts).
 */
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

vi.mock("../../../demo/components/instrument/shell/TypingDots.vue", () => ({
    default: defineComponent({ name: "TypingDots", setup: () => () => h("span", { class: "dots-stub" }) }),
}));

describe("KFA-134 — the hero wave's pause is reachable from the UI", () => {
    it("one pressed toggle writes --motion-weight: 0 on the heading, and a second press releases it", async () => {
        const { default: EditorStartScreen } = await import(
            "../../../demo/components/instrument/shell/EditorStartScreen.vue"
        );
        const w = mount(EditorStartScreen, { props: { hint: "or drag M. cubert" } });
        const heading = w.get("h1");
        const toggle = w.get('button[aria-label="Pause the title animation"]');
        expect(toggle.attributes("aria-pressed")).toBe("false");
        expect(heading.element.style.getPropertyValue("--motion-weight")).toBe("");

        await toggle.trigger("click");
        await nextTick();
        expect(toggle.attributes("aria-pressed")).toBe("true");
        expect(heading.element.style.getPropertyValue("--motion-weight")).toBe("0");
        // the wave glyphs sit under the heading that carries the weight
        expect(heading.findAll(".wave-char").length).toBeGreaterThan(0);

        await toggle.trigger("click");
        await nextTick();
        expect(toggle.attributes("aria-pressed")).toBe("false");
        expect(heading.element.style.getPropertyValue("--motion-weight")).toBe("");
    });
});
