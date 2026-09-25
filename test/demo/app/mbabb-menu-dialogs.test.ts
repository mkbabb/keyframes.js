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

describe("UIA-KF-148 · UIA-KF-149 — the destructive confirm on the glass dialog canon", () => {
    it("(4) title and description sit in DialogHeader with no type overrides; the grammar is deliberate (no redundant ✕)", async () => {
        const { wrapper, trigger } = mountHost();
        await activate(trigger.element);
        await selectRow("Clear all");
        await vi.waitFor(() => expect(confirmDialog()).toBeTruthy());
        const d = confirmDialog()!;
        const title = d.querySelector("[data-slot=dialog-title], h2")!;
        const desc = d.querySelector("[data-slot=dialog-description], p")!;
        expect(title.closest("[data-slot=dialog-header]")).toBeTruthy();
        expect(desc.closest("[data-slot=dialog-header]")).toBeTruthy();
        expect(title.className).not.toMatch(/\btext-/);
        expect(desc.className).not.toMatch(/\btext-/);
        const host = d.closest("[data-dismiss]") ?? d;
        expect(host.getAttribute("data-dismiss")).toBe("deliberate");
        expect([...d.querySelectorAll("button")].filter((b) => b.textContent?.trim() === "Close")).toHaveLength(0);
        const cancel = [...d.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Cancel")!;
        cancel.click();
        await vi.waitFor(() => expect(confirmDialog()).toBeFalsy());
        wrapper.unmount();
    });
});

describe("UIA-KF-060 — the destructive row reads the canon's red, the confirm button's", () => {
    it("(5) the Clear-all row paints --destructive, not the demo's --accent-red", async () => {
        const { wrapper, trigger } = mountHost();
        await activate(trigger.element);
        const r = row("Clear all")!;
        expect(r.className).toMatch(/\btext-destructive\b/);
        expect(r.className).not.toMatch(/accent-red/);
        wrapper.unmount();
    });
});

describe("A2-KE-L2-13 · UIA-KF-137 — the theme is a checkbox row, the ppmycota boolean's idiom", () => {
    it("(6) the Dark mode row is a menuitemcheckbox and selecting the ROW flips the theme", async () => {
        const { wrapper, trigger } = mountHost();
        await activate(trigger.element);
        const r = row("Dark mode")!;
        expect(r.getAttribute("role")).toBe("menuitemcheckbox");
        const before = document.documentElement.classList.contains("dark");
        expect(r.getAttribute("aria-checked")).toBe(String(before));
        await selectRow("Dark mode");
        await vi.waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(!before));
        // the menu stays open (the mark is the feedback), as on the ppmycota row
        expect(menu()).toBeTruthy();
        await vi.waitFor(() => expect(row("Dark mode")!.getAttribute("aria-checked")).toBe(String(!before)));
        await selectRow("Dark mode");
        await vi.waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(before));
        wrapper.unmount();
    });
});

describe("UIA-KF-138 — one subtitle, one identity row", () => {
    it("(7) only Clear all keeps a second line; the identity is ONE item that opens the source", async () => {
        const { wrapper, trigger } = mountHost();
        await activate(trigger.element);
        const rows = [...menu()!.querySelectorAll<HTMLElement>("[role^=menuitem]")];
        const withSub = rows.filter((r) => r.querySelector("p")).map((r) => r.textContent?.trim().slice(0, 9));
        expect(withSub).toEqual(["Clear all"]);
        const id = row("@mbabb")!;
        expect(id.textContent?.replace(/\s+/g, " ").trim()).toContain("@mbabb · GitHub");
        expect(id.querySelectorAll("a")).toHaveLength(0);
        expect(menu()!.textContent).not.toContain("CSS keyframe animation engine");
        const open = vi.spyOn(window, "open").mockImplementation(() => null);
        await selectRow("@mbabb");
        expect(open).toHaveBeenCalledWith("https://github.com/mkbabb/keyframes.js", "_blank", "noopener,noreferrer");
        open.mockRestore();
        wrapper.unmount();
    });
});

describe("A2-KE-L2-17 — the short layout keeps the command rows only", () => {
    it("(8) under (max-width:1023px) and (max-height:500px) the brand rows leave the menu; elsewhere they stay", async () => {
        const short = vi.spyOn(window, "matchMedia").mockImplementation(
            (query: string) =>
                ({
                    matches: /max-height:\s*500px/.test(query),
                    media: query,
                    onchange: null,
                    addListener() {},
                    removeListener() {},
                    addEventListener() {},
                    removeEventListener() {},
                    dispatchEvent: () => false,
                }) as unknown as MediaQueryList,
        );
        const a = mountHost();
        await activate(a.trigger.element);
        expect(row("Clear all")).toBeTruthy();
        expect(row("ppmycota")).toBeFalsy();
        expect(row("@mbabb")).toBeFalsy();
        a.wrapper.unmount();
        short.mockRestore();
        await vi.waitFor(() => expect(menu()).toBeNull());

        const b = mountHost();
        await activate(b.trigger.element);
        expect(row("ppmycota")).toBeTruthy();
        expect(row("@mbabb")).toBeTruthy();
        b.wrapper.unmount();
    });
});
