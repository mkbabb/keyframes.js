/**
 * X.KF.W13U.d4 · ESC-d-3 (COHESION §0br) — the @mbabb menu's Share row is
 * keyboard-actuatable.
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
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { GlassDock } from "@mkbabb/glass-ui/dock";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

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
const shareField = () =>
    document.body.querySelector('input[aria-label="Share URL or hash to load"]');

function shareRow(): HTMLElement {
    const row = [...document.body.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
        (el) => el.textContent?.includes("Copy link or load shared state"),
    );
    expect(row).toBeDefined();
    return row!;
}

async function openMenu() {
    const wrapper = mount(Host, { attachTo: document.body });
    await press(wrapper.find('[aria-label="@mbabb menu"]').element);
    await vi.waitFor(() => expect(document.body.textContent).toContain("Clear all"));
    return wrapper;
}

describe("KF.W13U.d4 — Enter on the Share row opens Share", () => {
    it("(1) keyboard: Enter on the focused row opens the popover and hands focus to its field; the menu stays open", async () => {
        const wrapper = await openMenu();
        expect(shareField()).toBeNull();

        const row = shareRow();
        row.focus();
        row.dispatchEvent(
            new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
        );
        await vi.waitFor(() => expect(shareField()).not.toBeNull());
        await vi.waitFor(() => expect(document.activeElement).toBe(shareField()));
        // `.prevent` holds the menu — the popover anchors to its trigger in the row.
        expect(document.body.textContent).toContain("Clear all");

        wrapper.unmount();
    });

    it("(2) pointer parity: the nested trigger opens Share, and a second press on it closes it (the row does not re-open it)", async () => {
        const wrapper = await openMenu();
        const trigger = document.body.querySelector('[aria-label="Share animation"]');
        expect(trigger).not.toBeNull();

        await press(trigger!);
        await vi.waitFor(() => expect(shareField()).not.toBeNull());

        await press(trigger!);
        await vi.waitFor(() => expect(shareField()).toBeNull());
        expect(document.body.textContent).toContain("Clear all");

        wrapper.unmount();
    });
});
