/**
 * test/demo/instrument/overlays-w13x.test.ts — X.KF.W13X.overlays.
 *
 * The Share popover and the Keyboard shortcuts dialog, mounted for real:
 *  (1) UIA-KF-249 · a successful load clears the field (useShareState).
 *  (2) UIA-KF-142 · a refused load marks the field: `aria-invalid`, and an
 *      inline message the field names through `aria-describedby`; typing clears it.
 *  (3) UIA-KF-071 · the primary action is a named "Copy link" button; the load
 *      path is a labelled field of its own with a labelled Load button.
 *  (4) UIA-KF-224 · no native `title` tooltip inside the popover.
 *  (5) UIA-KF-248 · the popover opens with focus on the primary action, not on
 *      the paste field (whose focus ring was the heaviest stroke on the page).
 *  (6) UIA-KF-070 · a completed share action (copy, or a load) emits `done`,
 *      so the host can dismiss the whole menu stack.
 *  (7) UIA-KF-140 · the trigger wears no recede-on-hover opacity fade (the
 *      28x36 egg is the host slot's, carried with ESC-dock-1).
 *  (8) UIA-KF-016 · the scroll port is the sr-only spans' containing block (`relative`).
 *  (9) UIA-KF-072 · UIA-KF-139 · group headings are static, with no opaque plate.
 * (10) UIA-KF-251 · UIA-KF-139 · sentence-case title, a one-line description, no dead row radius.
 * (11) UIA-KF-250 · the port hides the platform scrollbar (the fade masks signal overflow).
 * (12) UIA-KF-147 · at >= md the groups lay out in two columns.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
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
import { encodeStateToHash, getAllState } from "@state";
import { useShareState } from "@components/instrument/shell/useShareState";
import SharePopover from "@components/instrument/shell/SharePopover.vue";
import KeyboardShortcutsModal from "@components/instrument/shell/KeyboardShortcutsModal.vue";

beforeAll(() => {
    class NoopResizeObserver { observe() {} unobserve() {} disconnect() {} }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    registerShortcut("Delete", () => {}, { label: "Delete keyframe", group: "Actions" });
    registerShortcut("Space", () => {}, { label: "Play / pause", group: "Playback" });
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

const validHash = () => encodeStateToHash(getAllState("cube"));
const pop = () => document.body.querySelector<HTMLElement>('[role="dialog"]');
const field = () => pop()?.querySelector<HTMLInputElement>("input") ?? null;
const buttons = () => [...(pop()?.querySelectorAll<HTMLButtonElement>("button") ?? [])];

async function openShare() {
    const r = await router();
    wrapper = mount(SharePopover, { attachTo: document.body, global: { plugins: [r] } });
    (wrapper.vm as unknown as { open: boolean }).open = true;
    await vi.waitFor(() => expect(field()).not.toBeNull());
    await nextTick();
    return wrapper;
}

describe("X.KF.W13X.overlays — Share", () => {
    it("(1) UIA-KF-249 — a successful load clears the field", async () => {
        const r = await router();
        let api!: ReturnType<typeof useShareState>;
        wrapper = mount(defineComponent({ setup() { api = useShareState(); return () => h("div"); } }), { global: { plugins: [r] } });
        api.loadHashInput.value = validHash();
        expect(api.loadFromInput()).toBe(true);
        expect(api.loadHashInput.value).toBe("");
    });

    it("(2) UIA-KF-142 — a refused load marks the field and names the reason; typing clears it", async () => {
        await openShare();
        field()!.value = "@@not-base64@a";
        field()!.dispatchEvent(new Event("input", { bubbles: true }));
        field()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await vi.waitFor(() => expect(field()!.getAttribute("aria-invalid")).toBe("true"));
        const ids = (field()!.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
        const msg = ids.map((id) => document.getElementById(id)?.textContent?.trim()).join(" ");
        expect(msg).toMatch(/shared state/i);
        field()!.value = "@@not-base64@ab";
        field()!.dispatchEvent(new Event("input", { bubbles: true }));
        await vi.waitFor(() => expect(field()!.getAttribute("aria-invalid")).not.toBe("true"));
    });

    it("(3) UIA-KF-071 — 'Copy link' is the named primary; the load path is labelled", async () => {
        await openShare();
        const names = buttons().map((b) => b.textContent?.trim());
        expect(names[0]).toBe("Copy link");
        expect(names).toContain("Load");
        const id = field()!.id;
        expect(id && pop()!.querySelector(`label[for="${id}"]`)?.textContent?.trim()).toBe("Load from link");
    });

    it("(4) UIA-KF-224 — no native title tooltip in the popover", async () => {
        await openShare();
        expect(pop()!.querySelectorAll("[title]").length).toBe(0);
    });

    it("(5) UIA-KF-248 — the popover opens on its primary action, not on the paste field", async () => {
        await openShare();
        await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe("Copy link"));
    });

    it("(6) UIA-KF-070 — a copy and a successful load each emit done", async () => {
        const w = await openShare();
        buttons().find((b) => b.textContent?.trim() === "Copy link")!.click();
        await vi.waitFor(() => expect(w.emitted("done")?.length).toBe(1));
        (w.vm as unknown as { open: boolean }).open = true;
        await vi.waitFor(() => expect(field()).not.toBeNull());
        field()!.value = validHash();
        field()!.dispatchEvent(new Event("input", { bubbles: true }));
        field()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await vi.waitFor(() => expect(w.emitted("done")?.length).toBe(2));
    });

    it("(7) UIA-KF-140 — the trigger has no recede fade", async () => {
        const r = await router();
        wrapper = mount(SharePopover, { attachTo: document.body, global: { plugins: [r] } });
        const t = wrapper.find('[aria-label="Share animation"]');
        expect(t.classes().some((c) => /opacity/.test(c))).toBe(false);
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

    it("(10) UIA-KF-251 · 139 — sentence-case title, one-line description, no dead row radius", async () => {
        const d = await openShortcuts();
        expect(d.querySelector("h2")!.textContent!.trim()).toBe("Keyboard shortcuts");
        expect(d.querySelector("p")!.textContent!.replace(/\s+/g, " ").trim()).toBe("Grouped by area.");
        for (const row of d.querySelectorAll("dl > div")) expect(row.classList).not.toContain("rounded-md");
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
