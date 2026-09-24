/**
 * test/demo/instrument/toast-surface.test.ts — X.KF.W13V.u · UIA-KF-001 / 002.
 *
 * The demo's toasts were raised through vue-sonner, mounted UNSTYLED with no
 * stylesheet inside `DemoGlobalChrome` (a static `<ol data-sonner-toaster>`
 * teleported after `<body>`: every toast painted at y = the viewport height,
 * off screen, under `overflow: hidden`) — and that host sat inside the
 * super-keyed controls group, so a scene switch tore it down with any toast in
 * flight. The cure is glass's toast surface: ONE `<Toaster>` at the App root
 * (fixed on `--z-toast`), and every call site raising glass's `toast()`.
 *
 * Witnesses: (1) the shared copy helper raises glass's toast (tone success);
 * (2) the super-keyed chrome no longer mounts a toaster host of its own.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";

const toastSpy = vi.hoisted(() =>
    vi.fn((_o: { title?: string; tone?: string }) => ({ id: "0", dismiss: () => {}, update: () => {} })),
);
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: toastSpy, ToastAction: {} }));

import { copyText } from "@utils/clipboard";
import DemoGlobalChrome from "../../../demo/components/instrument/transport/components/DemoGlobalChrome.vue";

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    toastSpy.mockClear();
});

describe("UIA-KF-001/002 — one glass toast surface", () => {
    it("the copy helper raises glass's toast with its success message", async () => {
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: async () => {} },
            configurable: true,
        });
        await copyText("a { color: red }", "CSS copied to clipboard!");
        expect(toastSpy).toHaveBeenCalledTimes(1);
        expect(toastSpy.mock.calls[0]?.[0]).toMatchObject({
            title: "CSS copied to clipboard!",
            tone: "success",
        });
    });

    it("the super-keyed chrome mounts no toaster host of its own", () => {
        wrapper = mount(DemoGlobalChrome, { attachTo: document.body });
        expect(document.querySelector("[data-sonner-toaster], ol[aria-live], section[aria-live]")).toBeNull();
        expect(document.querySelector("#rainbow-gradient")).not.toBeNull();
    });
});
