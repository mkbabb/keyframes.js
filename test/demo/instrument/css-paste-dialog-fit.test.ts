/**
 * test/demo/instrument/css-paste-dialog-fit.test.ts — X.KF.W13X.timeline:
 *
 *   A2-KE-X-5  at 844x390 the ten-row well pushed the dialog's primary action
 *              below its fold (served BEFORE x2: button bottom 435 > dialog
 *              bottom 374); a short viewport now takes 4 rows. The description
 *              reads in glass's own register, not the demo's muted override
 *              that vanished into the translucent dialog.
 *   UIA-KF-054 the error line is sentence case at the small type rung, not the
 *              uppercase micro-mono eyebrow register.
 *
 * Served witness: `evidence/W13X/timeline/x5.mjs` (before/after ×2).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

/** A stub that renders its default slot, so the subject's template really runs. */
const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup: (_p, { slots, attrs }) =>
            () =>
                h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
    });

vi.mock("@mkbabb/glass-ui", () => ({
    Dialog: slotStub("div", "Dialog"),
    DialogContent: slotStub("div", "DialogContent"),
    DialogTitle: slotStub("h2", "DialogTitle"),
    DialogDescription: slotStub("p", "DialogDescription"),
    DialogFooter: slotStub("footer", "DialogFooter"),
    Button: defineComponent({
        name: "Button",
        inheritAttrs: false,
        props: { loading: Boolean, disabled: Boolean },
        setup: (p, { slots, attrs }) =>
            () =>
                h(
                    "button",
                    {
                        ...attrs,
                        disabled: p.disabled || undefined,
                        "data-loading": p.loading ? "true" : "false",
                    },
                    slots.default?.(),
                ),
    }),
}));

vi.mock("@mkbabb/glass-ui/textarea", () => ({
    Textarea: defineComponent({
        name: "Textarea",
        inheritAttrs: false,
        props: { modelValue: { type: String, default: "" } },
        emits: ["update:modelValue"],
        setup: (p, { emit, attrs }) =>
            () =>
                h("textarea", {
                    ...attrs,
                    value: p.modelValue,
                    onInput: (e: Event) =>
                        emit("update:modelValue", (e.target as HTMLTextAreaElement).value),
                }),
    }),
}));

const CSSPasteDialog = (await import("@components/instrument/timeline/CSSPasteDialog.vue"))
    .default;

const savedMatchMedia = window.matchMedia;
const viewport = (short: boolean) => {
    window.matchMedia = ((query: string) => ({
        matches: short && query.includes("max-height"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
};

afterEach(() => {
    window.matchMedia = savedMatchMedia;
    document.body.innerHTML = "";
});

const mountShell = (submit: (t: string) => void | Promise<void> = () => {}) =>
    mount(CSSPasteDialog, {
        props: {
            title: "Import CSS @keyframes",
            description: "Paste CSS @keyframes to load into the timeline",
            buttonLabel: "Import",
            open: true,
            text: "a {",
            submit,
        },
        attachTo: document.body,
    });

describe("A2-KE-X-5 — the paste dialog fits a landscape phone", () => {
    it("a short viewport takes a 4-row well", () => {
        viewport(true);
        const w = mountShell();
        expect(w.find("textarea").attributes("rows")).toBe("4");
        w.unmount();
    });

    it("a tall viewport keeps the 10-row well", () => {
        viewport(false);
        const w = mountShell();
        expect(w.find("textarea").attributes("rows")).toBe("10");
        w.unmount();
    });

    it("the description wears glass's own register (no muted override)", () => {
        viewport(false);
        const w = mountShell();
        const desc = w.get('[data-stub="DialogDescription"]');
        expect(desc.classes()).not.toContain("text-muted-foreground");
        w.unmount();
    });
});

describe("UIA-KF-054 — the error line is a sentence, not an eyebrow", () => {
    it("renders the failure at the small rung, never force-uppercased", async () => {
        viewport(false);
        const w = mountShell(() => Promise.reject(new Error("No @keyframes stops found in that CSS.")));
        await w.find("footer button").trigger("click");
        await new Promise((r) => setTimeout(r, 0));
        await w.vm.$nextTick();
        const err = w.get("#css-paste-dialog-error");
        expect(err.classes()).not.toContain("uppercase");
        expect(err.classes()).not.toContain("text-mono-micro");
        expect(err.classes()).toContain("text-small");
        w.unmount();
    });
});
