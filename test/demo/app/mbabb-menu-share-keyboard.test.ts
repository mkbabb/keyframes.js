/**
 * X.KF.W13U.d4 · ESC-d-3 (COHESION §0br) — the @mbabb menu's Share row is
 * keyboard-actuatable. Re-cut at X.KF.W13X.esc2 (ESC-dock-1, the popover form):
 * the row runs Share as a plain menuitem, so the nested trigger is gone.
 *
 * OA-33 folded Share into the @mbabb menu, where its only command was a button
 * NESTED in the row (`SharePopover`'s trigger) that the menu's roving focus
 * never reaches, while the row itself was layout-only (`@select.prevent`): Enter
 * on the row opened nothing. The cure: `SharePopover` exposes its open model
 * (owned by `useShareState`) and the row's select sets it.
 *
 * The real `MbabbMenu` is mounted as slot content of a real `GlassDock` (App's
 * shape, as `mbabb-menu-self-hold.test.ts`), the real trigger is activated, and
 * the Share row receives the keydown the browser sends. The theme row's
 * keyboard form is the producer's (`DARK-MENU-ITEM`, O-61 R-3) and is not
 * asserted here. Stubs: jsdom's absent `ResizeObserver` and `matchMedia` only.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import { GlassDock } from "@mkbabb/glass-ui/dock";
import MbabbMenu from "@app/dock/menu/MbabbMenu.vue";

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown })
    .ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (
            query: string,
        ) => ({
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
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
});

const Host = defineComponent({
    name: "MenuHost",
    components: { GlassDock, MbabbMenu },
    template: `
        <GlassDock collapse="open">
            <MbabbMenu :on-scene-restore="noop" />
        </GlassDock>
    `,
    setup() {
        return { noop: () => {} };
    },
});

const pointerInit = { bubbles: true, cancelable: true, button: 0 };

async function press(el: Element): Promise<void> {
    el.dispatchEvent(new window.PointerEvent("pointerdown", pointerInit));
    el.dispatchEvent(new window.PointerEvent("pointerup", pointerInit));
    el.dispatchEvent(new window.MouseEvent("click", { ...pointerInit, detail: 1 }));
    await nextTick();
    await nextTick();
}

/** Both overlays are portalled to `document.body` by reka. */
// X.KF.W13X.overlays — the field is named by its LabeledField ("Load from
// link"), and the popover opens on its primary action ("Copy link", UIA-KF-248).
const shareField = () =>
    document.body.querySelector('[role="dialog"] input[inputmode="url"]');
const sharePrimary = () =>
    [...document.body.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')].find(
        (b) => b.textContent?.trim() === "Copy link",
    ) ?? null;
const copiedPrimary = () =>
    [...document.body.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')].find(
        (b) => b.textContent?.trim() === "Link copied",
    ) ?? null;

function shareRow(): HTMLElement {
    const row = [...document.body.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
        (el) => el.textContent?.trim() === "Share",
    );
    expect(row).toBeDefined();
    return row!;
}

/** A clipboard that takes the write (jsdom has none: absent, a write is refused). */
const writeText = vi.fn(async (_: string) => {});
function grantClipboard(): void {
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}
afterEach(() => {
    writeText.mockClear();
    delete (navigator as { clipboard?: unknown }).clipboard;
});

async function openMenu() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: "/", name: "cube", component: { render: () => null } }],
    });
    await router.push("/");
    const wrapper = mount(Host, { attachTo: document.body, global: { plugins: [router] } });
    await press(wrapper.find('[aria-label="@mbabb menu"]').element);
    await vi.waitFor(() => expect(document.body.textContent).toContain("Clear all"));
    return wrapper;
}

const menuOpen = () => document.body.querySelector('[role="menu"]') !== null;
const trigger = () => document.body.querySelector<HTMLElement>('[aria-label="@mbabb menu"]');

// X.KF.W13X.esc2 · ESC-dock-1 (KF-W13.md addendum (g), COHESION §0er) — the
// popover form RULED: Share is a plain menuitem; selecting it closes the menu
// and opens the share surface as its own popover anchored to the @mbabb
// trigger. Born RED at `0e1623ca`: the row nested SharePopover's trigger
// button, and its select held the menu open (`.prevent`).
describe("KF.W13X.esc2 — Share is a plain menuitem that opens its own popover", () => {
    it("(1) the Share row holds no interactive content (no nested trigger)", async () => {
        const wrapper = await openMenu();
        const row = shareRow();
        expect(row.getAttribute("role")).toBe("menuitem");
        expect(
            row.querySelectorAll('button, a[href], input, [role="button"], [aria-haspopup], [tabindex]:not([tabindex="-1"])')
                .length,
        ).toBe(0);
        expect(document.body.querySelector('[aria-label="Share animation"]')).toBeNull();
        wrapper.unmount();
    });

    it("(2) keyboard: Enter on the row copies the link, closes the menu, and opens the popover saying so, focus on its primary action", async () => {
        grantClipboard();
        const wrapper = await openMenu();
        expect(shareField()).toBeNull();

        const row = shareRow();
        row.focus();
        row.dispatchEvent(
            new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
        );
        await vi.waitFor(() => expect(shareField()).not.toBeNull());
        await vi.waitFor(() => expect(menuOpen()).toBe(false));
        // One press, one write: the popover opens on the act already done.
        await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
        expect(writeText.mock.calls[0]![0]).toMatch(/\?state=[^&]+/);
        await vi.waitFor(() => expect(document.activeElement).toBe(copiedPrimary()));
        expect(copiedPrimary()!.querySelector("svg.lucide-check")).not.toBeNull();
        expect(sharePrimary()).toBeNull();

        wrapper.unmount();
    });

    it("(3) pointer: a press on the row does the same, and Escape returns focus to the @mbabb trigger", async () => {
        grantClipboard();
        const wrapper = await openMenu();
        await press(shareRow());
        await vi.waitFor(() => expect(shareField()).not.toBeNull());
        await vi.waitFor(() => expect(menuOpen()).toBe(false));
        await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
        await vi.waitFor(() => expect(copiedPrimary()).not.toBeNull());

        document.activeElement!.dispatchEvent(
            new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
        );
        await vi.waitFor(() => expect(shareField()).toBeNull());
        await vi.waitFor(() => expect(document.activeElement).toBe(trigger()));

        wrapper.unmount();
    });

    it("(4) a refused copy at the row's press opens the popover on the link itself", async () => {
        const wrapper = await openMenu();
        await press(shareRow());
        const linkField = () => document.body.querySelector<HTMLInputElement>('[role="dialog"] input[readonly]');
        await vi.waitFor(() => expect(linkField()).not.toBeNull());
        expect(linkField()!.value).toMatch(/\?state=[^&]+/);
        await vi.waitFor(() => expect(document.activeElement).toBe(linkField()));
        wrapper.unmount();
    });

    it("(5) the load field is named without a visible label: its placeholder and Load say it", async () => {
        grantClipboard();
        const wrapper = await openMenu();
        await press(shareRow());
        await vi.waitFor(() => expect(shareField()).not.toBeNull());
        const field = shareField()!;
        expect(field.getAttribute("aria-label")).toBe("Load from link");
        expect(field.getAttribute("placeholder")).toBe("Paste a share link");
        expect(document.body.querySelector('[role="dialog"] label')).toBeNull();
        wrapper.unmount();
    });
});
