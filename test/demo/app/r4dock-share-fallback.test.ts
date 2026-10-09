// SERVED MODEL: claude-opus-5-5
/**
 * test/demo/app/r4dock-share-fallback.test.ts — X.KF.W13X.r4dock · UIA-KF-321
 * (KF-W13.md addendum (g), the R-4 "dock and menu" row): a refused clipboard
 * write leaves the share surface open with the link in a read-only field,
 * focused and wholly selected; no toast points at the address bar and the
 * address is not rewritten. (The menu-chain limb, Share closing the @mbabb
 * menu, is mbabb-menu-share-keyboard.test.ts (2)(3).)
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

const toastSpy = vi.hoisted(() =>
    vi.fn((_o: { title?: string; tone?: string }) => ({ id: "0", dismiss: () => {}, update: () => {} })),
);
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: toastSpy, ToastAction: {} }));

import SharePopover from "@components/instrument/shell/SharePopover.vue";

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
    toastSpy.mockClear();
    document.body.innerHTML = "";
});

describe("X.KF.W13X.r4dock — UIA-KF-321 · a refused copy offers the link on the surface", () => {
    it("(2) the surface stays open with the link read-only, focused and selected; no address-bar fallback", async () => {
        // jsdom has no async clipboard: glass's writeClipboard names the refusal.
        expect(navigator.clipboard?.writeText).toBeUndefined();
        const r = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: "/", name: "cube", component: { render: () => null } }],
        });
        await r.push("/");
        const anchor = document.body.appendChild(document.createElement("button"));
        wrapper = mount(SharePopover, {
            attachTo: document.body,
            global: { plugins: [r] },
            props: { anchor, open: true, "onUpdate:open": (open: boolean) => wrapper!.setProps({ open }) },
        });
        const pop = () => document.body.querySelector<HTMLElement>('[role="dialog"]');
        await vi.waitFor(() => expect(pop()).not.toBeNull());
        [...pop()!.querySelectorAll<HTMLButtonElement>("button")]
            .find((b) => b.textContent?.trim() === "Copy link")!
            .click();
        const linkField = () => pop()?.querySelector<HTMLInputElement>("input[readonly]") ?? null;
        await vi.waitFor(() => expect(linkField()).not.toBeNull());
        await vi.waitFor(() => expect(document.activeElement).toBe(linkField()));
        const field = linkField()!;
        expect(field.value).toMatch(/^http:\/\/localhost(:\d+)?\/.*\?state=[^&]+/);
        expect([field.selectionStart, field.selectionEnd]).toEqual([0, field.value.length]);
        expect(wrapper.emitted("update:open")?.some(([o]) => o === false) ?? false).toBe(false);
        expect(toastSpy.mock.calls.map(([o]) => o.title ?? "").filter((t) => /address bar/i.test(t))).toEqual([]);
        expect(r.currentRoute.value.query.state).toBeUndefined();
    });
});
