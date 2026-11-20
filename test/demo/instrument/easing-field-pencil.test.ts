/**
 * The easing field's pencil (open the curve editor) is a glyph with no word:
 * it says its name in a glass tooltip, as the pane's other glyph buttons do.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import EasingField from "@components/instrument/pane/channel-controls/EasingField.vue";

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = "";
});

describe("the easing field's pencil", () => {
    it("says its name in a tooltip", async () => {
        wrapper = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(EasingField, {
                        selectedCurveKey: "ease-in-out",
                        curveGlyphs: new Map(),
                        curveFnFor: () => (t: number) => t,
                        open: false,
                    }),
                ),
            ),
            { attachTo: document.body },
        );
        const pencil = document.querySelector<HTMLElement>('[aria-label="Edit easing curve"]')!;
        expect(pencil).toBeTruthy();
        pencil.focus();
        pencil.dispatchEvent(new window.FocusEvent("focus"));
        await vi.waitFor(() => expect(document.querySelector("[role=tooltip]")?.textContent?.trim()).toBe("Edit easing curve"), {
            timeout: 600,
        });
    });
});
