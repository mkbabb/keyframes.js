/**
 * test/demo/instrument/overlays-w13x.test.ts — X.KF.W13X.overlays.
 *
 * The Share popover and the Keyboard shortcuts dialog, mounted for real:
 *  (1) FORTY-SIXTH E · the link Share copies is the address itself (the
 *      address is the page): no `?state=` blob is added to it.
 *  (2) FORTY-SIXTH E · the import path retired with the blob: no paste field,
 *      no Load button.
 *  (3) UIA-KF-071 · the primary action is a named "Copy link" button.
 *  (4) UIA-KF-224 · no native `title` tooltip inside the popover.
 *  (5) UIA-KF-248 · the popover opens with focus on the primary action.
 *  (6) UIA-KF-070 · a completed copy closes the surface through its host's
 *      open model (X.KF.W13X.esc2: the host's menu is already closed, so no
 *      `done` relay is left to emit).
 *  (7) UIA-KF-140 · ESC-dock-1 (X.KF.W13X.esc2): the surface has no trigger of
 *      its own, so neither the 28x36 egg nor its recede fade can render.
 *  (8) UIA-KF-016 · the scroll port is the sr-only spans' containing block (`relative`).
 *  (9) UIA-KF-072 · UIA-KF-139 · group headings are static, with no opaque plate.
 * (10) UIA-KF-251 · UIA-KF-139 · sentence-case title, a one-line description, no dead row radius.
 * (11) UIA-KF-250 · the port hides the platform scrollbar (the fade masks signal overflow).
 * (12) UIA-KF-147 · at >= md the groups lay out in two columns.
 */
import { afterEach, beforeAll, describe, expect, it, onTestFinished, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

const toastSpy = vi.hoisted(() =>
    vi.fn((_o: { title?: string; tone?: string }) => ({ id: "0", dismiss: () => {}, update: () => {} })),
);
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: toastSpy, ToastAction: {} }));
const copySpy = vi.hoisted(() => vi.fn(async () => ({ ok: true as const })));
vi.mock("@composables/copyWithToast", () => ({ copyWithToast: copySpy }));

import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { useShareState } from "@app/dock/menu/useShareState";
import SharePopover from "@app/dock/menu/SharePopover.vue";
import KeyboardShortcutsModal from "@app/dock/menu/KeyboardShortcutsModal.vue";

beforeAll(() => {
    class NoopResizeObserver { observe() {} unobserve() {} disconnect() {} }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    registerShortcut("Delete", () => {}, { label: "Delete keyframe", group: "Actions" });
    registerShortcut("Space", () => {}, { label: "Play / pause", group: "Playback" });
    registerShortcut("KeyX", () => {}, { label: "Orbit on X axis (hold)", group: "Cube" });
});

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    toastSpy.mockClear();
    copySpy.mockClear();
    document.body.innerHTML = "";
});

async function router() {
    const r = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: "/", name: "cube", component: { render: () => null } }],
    });
    await r.push("/");
    return r;
}

const pop = () => document.body.querySelector<HTMLElement>('[role="dialog"]');
const field = () => pop()?.querySelector<HTMLInputElement>("input") ?? null;
const buttons = () => [...(pop()?.querySelectorAll<HTMLButtonElement>("button") ?? [])];

async function openShare() {
    const r = await router();
    const anchor = document.body.appendChild(document.createElement("button"));
    wrapper = mount(SharePopover, {
        attachTo: document.body,
        global: { plugins: [r] },
        props: {
            anchor,
            open: true,
            "onUpdate:open": (open: boolean) => wrapper!.setProps({ open }),
        },
    });
    await vi.waitFor(() => expect(pop()).not.toBeNull());
    await nextTick();
    return wrapper;
}

/** The platform takes the clipboard write (jsdom has no async clipboard). */
function clipboard() {
    const writeText = vi.fn(async (_text: string) => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    onTestFinished(() => {
        delete (navigator as { clipboard?: unknown }).clipboard;
    });
    return writeText;
}

describe("X.KF.W13X.overlays — Share", () => {
    it("(1) FORTY-SIXTH E — the link Share copies is the address, with no state blob", async () => {
        const writeText = clipboard();
        history.replaceState(null, "", "/#/cube?skin=daraksha&anim=Matrix");
        const r = await router();
        let api!: ReturnType<typeof useShareState>;
        wrapper = mount(defineComponent({ setup() { api = useShareState(); return () => h("div"); } }), { global: { plugins: [r] } });
        expect(await api.shareState()).toBe(true);
        expect(writeText).toHaveBeenCalledWith(location.href);
        expect(writeText.mock.calls[0]?.[0]).toMatch(/#\/cube\?skin=daraksha&anim=Matrix$/);
        expect(writeText.mock.calls[0]?.[0]).not.toMatch(/state=/);
    });

    it("(2) FORTY-SIXTH E — the import path retired: no paste field, no Load", async () => {
        await openShare();
        expect(field()).toBeNull();
        expect(buttons().map((b) => b.textContent?.trim())).not.toContain("Load");
    });

    it("(3) UIA-KF-071 — 'Copy link' is the named primary", async () => {
        await openShare();
        expect(buttons().map((b) => b.textContent?.trim())).toEqual(["Copy link"]);
    });

    it("(4) UIA-KF-224 — no native title tooltip in the popover", async () => {
        await openShare();
        expect(pop()!.querySelectorAll("[title]").length).toBe(0);
    });

    it("(5) UIA-KF-248 — the popover opens on its primary action", async () => {
        await openShare();
        await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe("Copy link"));
    });

    it("(6) UIA-KF-070 — a copy closes the surface", async () => {
        // X.KF.W13X.r4dock · UIA-KF-321 — a COMPLETED copy: the platform takes the
        // write (a refused write keeps the surface open on the link, r4dock.test.ts (2)).
        const writeText = clipboard();
        const w = await openShare();
        buttons().find((b) => b.textContent?.trim() === "Copy link")!.click();
        await vi.waitFor(() => expect(w.emitted("update:open")?.at(-1)).toEqual([false]));
        expect(writeText).toHaveBeenCalledTimes(1);
    });

    it("(7) UIA-KF-140 · ESC-dock-1 — the surface renders no trigger of its own", async () => {
        const r = await router();
        wrapper = mount(SharePopover, { attachTo: document.body, global: { plugins: [r] } });
        expect(document.body.querySelector('[aria-label="Share animation"]')).toBeNull();
        expect(document.body.querySelectorAll("button").length).toBe(0);
    });
});

async function openShortcuts() {
    wrapper = mount(KeyboardShortcutsModal, { attachTo: document.body, props: { open: true } });
    await vi.waitFor(() => expect(document.body.querySelector("dl")).not.toBeNull());
    return document.body.querySelector<HTMLElement>('[role="dialog"]')!;
}

describe("X.KF.W13X.overlays — Keyboard shortcuts", () => {
    it("(8) UIA-KF-016 — the port is the sr-only spans' containing block", async () => {
        const d = await openShortcuts();
        expect(d.querySelector('[role="region"]')!.classList).toContain("relative");
    });

    it("(9) UIA-KF-072 · 139 — group headings carry no sticky opaque plate", async () => {
        const d = await openShortcuts();
        for (const h3 of d.querySelectorAll("h3")) {
            expect([...h3.classList].filter((c) => /^(sticky|bg-|-mx-)/.test(c))).toEqual([]);
        }
    });

    it("(10) UIA-KF-251 · 139 — sentence-case title, no description line, no dead row radius", async () => {
        const d = await openShortcuts();
        expect(d.querySelector("h2")!.textContent!.trim()).toBe("Keyboard shortcuts");
        // The groups' own headings say how the list is ordered; a line saying
        // so restates them.
        expect(d.querySelector("p")).toBeNull();
        expect(d.hasAttribute("aria-describedby")).toBe(false);
        for (const row of d.querySelectorAll("dl > div")) expect(row.classList).not.toContain("rounded-md");
    });

    it("(10b) a spatial key's cap and its spoken twin read the key, not its code", async () => {
        const d = await openShortcuts();
        const row = [...d.querySelectorAll("dl > div")].find((r) => r.querySelector("dt")!.textContent!.includes("Orbit on X axis"))!;
        expect([...row.querySelectorAll("kbd")].map((k) => k.textContent!.trim())).toEqual(["X"]);
        expect(row.querySelector("dd .sr-only")!.textContent!.trim()).toBe("X");
    });

    it("(11) UIA-KF-250 — the port hides the platform scrollbar", async () => {
        const d = await openShortcuts();
        expect(d.querySelector('[role="region"]')!.classList).toContain("scrollbar-hidden");
    });

    it("(12) UIA-KF-147 — two columns at >= md", async () => {
        const d = await openShortcuts();
        const list = d.querySelector('[role="region"]')!.firstElementChild!;
        expect(list.classList).toContain("md:columns-2");
        for (const g of list.children) expect(g.classList).toContain("break-inside-avoid");
    });
});
