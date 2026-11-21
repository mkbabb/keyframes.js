/**
 * test/demo/instrument/hero-wave-pause.test.ts — KF.DS.r1 (COHESION §0gf.2(b),
 * owner word, reversing KFA-134's visible toggle).
 *
 * The hero's title wave and dots are identity motion, KEPT (KF-C3-02). The
 * visible "Pause the title animation" control is REMOVED: the motion is static
 * under `prefers-reduced-motion` and parks while the page is hidden or the
 * title is offscreen (hero-motion-park.test.ts owns the park). This spec holds
 * the removal: the start screen renders no pause control, and the heading
 * carries no consumer-side `--motion-weight` override (the wave's stillness is
 * decided at its own root, never per instance). Mounts the REAL
 * EditorStartScreen; the TypingDots engine seam is stubbed (its own contract is
 * typing-dots-engine-seam.test.ts).
 */
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

vi.mock("@app/hero/TypingDots.vue", () => ({
    default: defineComponent({ name: "TypingDots", setup: () => () => h("span", { class: "dots-stub" }) }),
}));

describe("KF.DS.r1 — the hero renders no visible pause control", () => {
    it("has no pause button, and the heading carries no --motion-weight override", async () => {
        const { default: EditorStartScreen } = await import(
            "@app/hero/EditorStartScreen.vue"
        );
        const w = mount(EditorStartScreen, { props: { hint: "or drag M. cubert" } });
        const heading = w.get("h1");
        expect(w.find('button[aria-label="Pause the title animation"]').exists()).toBe(false);
        // The one button is the headline itself, which opens the Scene list it
        // names; nothing else on the start screen is a control.
        const buttons = w.findAll("button");
        expect(buttons.length).toBe(1);
        expect(buttons[0]!.element.closest("h1")).toBe(heading.element);
        expect(buttons[0]!.attributes("aria-haspopup")).toBe("listbox");
        expect(w.text()).not.toContain("Pause the title animation");
        expect(heading.element.style.getPropertyValue("--motion-weight")).toBe("");
        // the wave itself is still rendered (identity motion kept)
        expect(heading.findAll(".wave-char").length).toBeGreaterThan(0);
    });
});
