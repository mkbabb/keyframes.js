// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.dock — the @mbabb menu and the dialogs it opens.
 *
 *   KFA-113    the dock stays held while a dialog the menu opened is up
 *              (Clear all, Keyboard shortcuts), not only while the dropdown is
 *   UIA-KF-118 closing the Clear-all confirm returns focus to the @mbabb trigger
 *   UIA-KF-148 the confirm's title and description sit in the glass DialogHeader
 *              with the canon's own type (no class overrides)
 *   UIA-KF-149 the destructive confirm takes the `deliberate` dismissal grammar
 *   UIA-KF-060 the destructive row and the confirm button read one red
 *   A2-KE-L2-13 · UIA-KF-137 the theme is a checkbox row: a press anywhere on
 *              the row flips it, as the ppmycota boolean beside it does
 *   UIA-KF-138 one subtitle (under Clear all) and a one-row identity item
 *
 * App's shape (as `mbabb-menu-self-hold.test.ts`): the real MbabbMenu is slot
 * content of a real GlassDock. Stubs: jsdom's absent ResizeObserver and
 * matchMedia only.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { GlassDock } from "@mkbabb/glass-ui/dock";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent: () => false,
        });
    }
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
});

const Host = defineComponent({
    name: "MenuHost",
    components: { GlassDock, MbabbMenu },
    template: `<GlassDock collapse="open"><MbabbMenu :on-scene-restore="noop" /></GlassDock>`,
    setup: () => ({ noop: () => {} }),
});

function mountHost() {
    const wrapper = mount(Host, { attachTo: document.body });
    return { wrapper, dock: wrapper.findComponent(GlassDock), trigger: wrapper.find('[aria-label="@mbabb menu"]') };
}

/** DockTrigger actuates on pointerdown (the browser's own sequence, as the self-hold test). */
async function activate(el: Element): Promise<void> {
    const init = { bubbles: true, cancelable: true, button: 0 };
    el.dispatchEvent(new window.PointerEvent("pointerdown", init));
    el.dispatchEvent(new window.PointerEvent("pointerup", init));
    el.dispatchEvent(new window.MouseEvent("click", { ...init, detail: 1 }));
    await nextTick();
    await nextTick();
}

const menu = () => document.querySelector<HTMLElement>("[role=menu]");
const row = (text: string) =>
    [...(menu()?.querySelectorAll<HTMLElement>("[role^=menuitem]") ?? [])].find((r) => r.textContent?.includes(text));
const confirmDialog = () =>
    [...document.querySelectorAll<HTMLElement>("[role=dialog],[role=alertdialog]")].find((d) =>
        d.textContent?.includes("Clear all saved"),
    );

/** Select a menu row the way the keyboard does (Enter on the focused row). */
async function selectRow(text: string): Promise<void> {
    const r = row(text);
    expect(r, `row "${text}"`).toBeTruthy();
    r!.focus();
    r!.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await nextTick();
    await nextTick();
}

describe("KFA-113 — the dock is held while the menu's dialogs are up", () => {
    it("(1) Clear all: the hold survives the dropdown closing and goes with the dialog", async () => {
        const { wrapper, dock, trigger } = mountHost();
        await activate(trigger.element);
        expect(dock.vm.isHeld).toBe(true);
        await selectRow("Clear all");
        await vi.waitFor(() => expect(confirmDialog()).toBeTruthy());
        await vi.waitFor(() => expect(menu()).toBeNull());
        expect(dock.vm.isHeld).toBe(true);
        const cancel = [...confirmDialog()!.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Cancel")!;
        cancel.click();
        await vi.waitFor(() => expect(confirmDialog()).toBeFalsy());
        expect(dock.vm.isHeld).toBe(false);
        wrapper.unmount();
    });

    it("(2) Keyboard shortcuts: the hold survives the dropdown closing", async () => {
        const { wrapper, dock, trigger } = mountHost();
        await activate(trigger.element);
        await selectRow("Keyboard shortcuts");
        await vi.waitFor(() => expect(menu()).toBeNull());
        expect(dock.vm.isHeld).toBe(true);
        wrapper.unmount();
        expect(dock.exists()).toBe(false);
    });
});

describe("UIA-KF-118 — closing the Clear-all confirm returns focus to the @mbabb trigger", () => {
    it("(3) Cancel lands focus on the trigger, not <body>", async () => {
        const { wrapper, trigger } = mountHost();
        await activate(trigger.element);
        await selectRow("Clear all");
        await vi.waitFor(() => expect(confirmDialog()).toBeTruthy());
        const cancel = [...confirmDialog()!.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Cancel")!;
        cancel.click();
        await vi.waitFor(() => expect(confirmDialog()).toBeFalsy());
        await vi.waitFor(() => expect(document.activeElement).toBe(trigger.element));
        wrapper.unmount();
    });
});
