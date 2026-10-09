// SERVED MODEL: claude-opus-5-5
/**
 * test/demo/app/r4dock-register.test.ts — X.KF.W13X.r4dock · UIA-KF-230
 * (KF-W13.md addendum (g), the R-4 "dock and menu" row): one dock row, one
 * register. The @mbabb trigger is a dock label (no mono face, no code
 * register); the identifier register stays on the menu's "@mbabb · GitHub" row.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { GlassDock } from "@mkbabb/glass-ui/dock";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

const saved = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeAll(() => {
    class NoopResizeObserver { observe() {} unobserve() {} disconnect() {} }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
            matches: false, media: query, onchange: null,
            addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
            dispatchEvent: () => false,
        });
    }
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = saved;
});

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = "";
});

const pointerInit = { bubbles: true, cancelable: true, button: 0 };
async function press(el: Element): Promise<void> {
    el.dispatchEvent(new window.PointerEvent("pointerdown", pointerInit));
    el.dispatchEvent(new window.PointerEvent("pointerup", pointerInit));
    el.dispatchEvent(new window.MouseEvent("click", { ...pointerInit, detail: 1 }));
    await nextTick();
    await nextTick();
}

describe("X.KF.W13X.r4dock — UIA-KF-230 · one register in the dock row", () => {
    it("(1) the @mbabb trigger is a dock label; the identifier register stays in the menu", async () => {
        const Host = defineComponent({
            components: { GlassDock, MbabbMenu },
            template: `<GlassDock collapse="open"><MbabbMenu :on-scene-restore="() => {}" /></GlassDock>`,
        });
        wrapper = mount(Host, { attachTo: document.body });
        const trigger = wrapper.find('[aria-label="@mbabb menu"]').element as HTMLElement;
        expect(trigger.classList.contains("dock-label")).toBe(true);
        expect(trigger.classList.contains("font-mono")).toBe(false);
        expect(trigger.closest('[data-register="code"]')).toBeNull();
        await press(trigger);
        await vi.waitFor(() => expect(document.body.textContent).toContain("GitHub"));
        const ident = [...document.body.querySelectorAll<HTMLElement>('[role="menu"] [data-register="code"]')];
        expect(ident.map((el) => el.textContent?.trim())).toEqual(["@mbabb"]);
    });
});
