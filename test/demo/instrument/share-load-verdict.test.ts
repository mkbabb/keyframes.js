/**
 * test/demo/instrument/share-load-verdict.test.ts — X.KF.W13V.u · UIA-KF-003.
 *
 * The Share popover's "load" path decoded the payload, checked only that the
 * decode was truthy, then applied it and toasted "State restored!" — while the
 * apply (`restoreStateFromParam`) had REFUSED it. A payload that decodes to a
 * non-state value (`MTIz` → 123) therefore reported success and closed the
 * field. The UI now reports the apply's own verdict: refused → the error toast,
 * the field stays open.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

const toastSpy = vi.hoisted(() =>
    vi.fn((_o: { title?: string; tone?: string }) => ({ id: "0", dismiss: () => {}, update: () => {} })),
);
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: toastSpy, ToastAction: {} }));

import { useShareState } from "@components/instrument/shell/useShareState";

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    toastSpy.mockClear();
});

async function seat() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: "/", name: "home", component: { render: () => null } }],
    });
    await router.push("/");
    let api!: ReturnType<typeof useShareState>;
    const Host = defineComponent({
        setup() {
            api = useShareState();
            return () => h("div");
        },
    });
    wrapper = mount(Host, { global: { plugins: [router] } });
    return api;
}

describe("UIA-KF-003 — the share load reports the apply's verdict", () => {
    it("a payload that decodes to a non-state value is refused, and the field stays open", async () => {
        const s = await seat();
        s.sharePopoverOpen.value = true;
        s.loadHashInput.value = "MTIz"; // base64 of "123"
        s.loadFromInput();
        expect(toastSpy).toHaveBeenCalledTimes(1);
        expect(toastSpy.mock.calls[0]?.[0]).toMatchObject({ title: "Invalid shared state", tone: "destructive" });
        expect(s.sharePopoverOpen.value).toBe(true);
    });

    it("an undecodable payload is refused the same way", async () => {
        const s = await seat();
        s.sharePopoverOpen.value = true;
        s.loadHashInput.value = "not-base64-%%";
        s.loadFromInput();
        expect(toastSpy.mock.calls.map(([o]) => o.tone)).toEqual(["destructive"]);
        expect(s.sharePopoverOpen.value).toBe(true);
    });
});
