/**
 * X.KF.W8 G12 — CHARACTERIZATION of the ONE css-paste shell.
 *
 * WHAT SHAPE THIS IS WRITTEN AGAINST. G12 is gated on KF.W7's R-7 verdict and
 * may not pin a surface W7 might delete. R-7 has RULED and the fold has LANDED:
 * the direction is pinned to THIS file — `CSSPasteDialog.vue` survives as the
 * one shell, `KeyframesAddDialog.vue` is "a thin adapter over this shell", and
 * the contract the fold settles is stated in the shell's own docblock. Every
 * clause below characterizes one item of THAT contract, at the real component:
 *
 *   • `text` is a MODEL, not an `initialText` prop copied into local state
 *     (R-19 — the twin's hoisting contract won);
 *   • `submit` is a PROP and it is AWAITABLE (G14 P2) — resolve closes, reject
 *     leaves the dialog open with the message beside the draft, `void` leaves
 *     `open` alone so the consumer keeps its own close contract;
 *   • the primary action is disabled on an empty or whitespace-only draft
 *     (R-17 — the silent dead click) and re-entry is guarded while busy
 *     (KAD-10 — re-entry used to re-append stops);
 *   • the a11y composition is the fold's adopted half: `DialogTitle` and
 *     `DialogDescription` are SIBLINGS under `DialogContent`, never nested
 *     (KAD-6's content-model violation is what the fold adopted away from);
 *   • the fold's ONE structural addition: the `trigger` slot renders inside
 *     `<Dialog>` and never inside `<DialogContent>`, because the twin's
 *     `DialogTrigger` needs reka's root context.
 *
 * THE PRODUCER SEAM, STATED — what is replaced here and why it is not a mock of
 * the subject. `@mkbabb/glass-ui`'s dist imports `@mkbabb/keyframes.js`, and a
 * package never installs itself into its own `node_modules`; vitest's
 * `@mkbabb/keyframes.js` alias resolves SOURCE specifiers and cannot reach an
 * import originating inside `node_modules`, so any spec that loads the producer
 * root barrel dies at `Cannot find package '@mkbabb/keyframes.js' imported from
 * node_modules/@mkbabb/glass-ui/dist/useSpring-*.js` before a single assertion
 * runs. This is the same realm wall `timeline-hover-preview.test.ts` records for
 * `KeyframeTimeline` and that `aurora-opacity-ceiling.test.ts` (a KF.W4 create)
 * already answers with `vi.mock` of the producer. The durable cure is a runner
 * change — inlining the producer so the alias applies — and `vitest.config.ts`
 * is carved in this wave to the `measure` project and nothing else, so it is
 * ESCALATED rather than reached across for.
 *
 * What that means for this spec, said plainly rather than smuggled: the
 * producer's primitives are replaced by SLOT-RENDERING stubs, so the SUBJECT's
 * own template, bindings, guards, models and submit machine all execute for
 * real — G12's falsifier forbids mocking "the dialog under test", and the
 * dialog under test is not mocked. What is NOT characterized here is the
 * producer's own overlay/portal behaviour, which is glass-ui's to test.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
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

vi.mock("@mkbabb/glass-ui/forms", () => ({
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

const baseProps = {
    title: "Paste CSS",
    description: "Paste a @keyframes block",
    buttonLabel: "Apply CSS",
};

const mountShell = (
    over: Partial<{ text: string; submit: (t: string) => void | Promise<void> }> = {},
) =>
    mount(CSSPasteDialog, {
        props: {
            ...baseProps,
            open: true,
            text: over.text ?? "",
            submit: over.submit ?? (() => {}),
        },
        attachTo: document.body,
    });

const primary = (w: ReturnType<typeof mountShell>) =>
    w.find("footer button").element as HTMLButtonElement;

describe("CSSPasteDialog — the ONE shell R-7 folded onto", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("(1) the draft is a MODEL: editing the well emits update:text, never local state", async () => {
        const w = mountShell({ text: "a {}" });

        const well = w.find("textarea");
        expect((well.element as HTMLTextAreaElement).value).toBe("a {}");

        (well.element as HTMLTextAreaElement).value = "b {}";
        await well.trigger("input");

        expect(w.emitted("update:text")?.at(-1)).toEqual(["b {}"]);

        // The other half of R-19's distinction, and the one that actually
        // separates a MODEL from an `initialText` prop copied into local state
        // on open: a parent write AFTER mount reaches the well. A copy-on-open
        // would ignore it forever. (`defineModel` is deliberately optimistic
        // locally, so the post-edit local value is not the discriminator and is
        // not asserted on here.)
        await w.setProps({ text: "c {}" });
        expect(w.findComponent({ name: "Textarea" }).props("modelValue")).toBe("c {}");
        w.unmount();
    });

    it("(2) an empty or whitespace-only draft disables the primary action (R-17)", async () => {
        const w = mountShell({ text: "" });
        expect(primary(w).disabled).toBe(true);

        await w.setProps({ text: "   \n\t " });
        expect(primary(w).disabled).toBe(true);

        await w.setProps({ text: "a {}" });
        expect(primary(w).disabled).toBe(false);
        w.unmount();
    });

    it("(3) submit is AWAITABLE: a resolving promise closes the dialog", async () => {
        let release!: () => void;
        const gate = new Promise<void>((r) => (release = r));
        const submit = vi.fn(() => gate);

        const w = mountShell({ text: "a {}", submit });
        await w.find("footer button").trigger("click");

        expect(submit).toHaveBeenCalledWith("a {}");
        // In flight: the action reports `loading` and the dialog is still open.
        expect(primary(w).dataset.loading).toBe("true");
        expect(w.emitted("update:open")).toBeUndefined();

        release();
        await new Promise((r) => setTimeout(r, 0));
        await w.vm.$nextTick();

        expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
        expect(primary(w).dataset.loading).toBe("false");
        w.unmount();
    });

    it("(4) a REJECTING submit leaves the dialog open with the message beside the draft (G14 P2)", async () => {
        const submit = vi.fn(() => Promise.reject(new Error("unparseable @keyframes")));

        const w = mountShell({ text: "a {", submit });
        await w.find("footer button").trigger("click");
        await new Promise((r) => setTimeout(r, 0));
        await w.vm.$nextTick();

        // Still open — no close was requested.
        expect(w.emitted("update:open")).toBeUndefined();

        const err = w.find("#css-paste-dialog-error");
        expect(err.exists()).toBe(true);
        expect(err.text()).toContain("unparseable @keyframes");
        expect(err.attributes("role")).toBe("status");
        expect(err.attributes("aria-live")).toBe("polite");
        // The well points at the message it caused.
        expect(w.find("textarea").attributes("aria-describedby")).toBe(
            "css-paste-dialog-error",
        );
        // The draft is untouched.
        expect((w.find("textarea").element as HTMLTextAreaElement).value).toBe("a {");
        w.unmount();
    });

    it("(5) a VOID submit leaves `open` alone — the consumer keeps its own close contract", async () => {
        const submit = vi.fn((): void => {});

        const w = mountShell({ text: "a {}", submit });
        await w.find("footer button").trigger("click");
        await new Promise((r) => setTimeout(r, 0));

        expect(submit).toHaveBeenCalledTimes(1);
        expect(w.emitted("update:open")).toBeUndefined();
        w.unmount();
    });

    it("(6) re-entry is guarded while a submit is in flight (KAD-10)", async () => {
        let release!: () => void;
        const gate = new Promise<void>((r) => (release = r));
        const submit = vi.fn(() => gate);

        const w = mountShell({ text: "a {}", submit });
        await w.find("footer button").trigger("click");
        await w.find("footer button").trigger("click");
        await w.find("footer button").trigger("click");

        expect(submit).toHaveBeenCalledTimes(1);

        release();
        await new Promise((r) => setTimeout(r, 0));
        w.unmount();
    });

    it("(7) Mod+Enter in the well submits (R-23)", async () => {
        const submit = vi.fn((): void => {});
        const w = mountShell({ text: "a {}", submit });

        await w.find("textarea").trigger("keydown", { key: "Enter", metaKey: true });
        expect(submit).toHaveBeenCalledTimes(1);

        await w.find("textarea").trigger("keydown", { key: "Enter", ctrlKey: true });
        expect(submit).toHaveBeenCalledTimes(2);
        w.unmount();
    });

    it("(8) title and description are SIBLINGS under the content, never nested (the fold's adopted a11y half)", () => {
        const w = mountShell({ text: "a {}" });

        const content = w.find('[data-stub="DialogContent"]').element;
        const title = w.find('[data-stub="DialogTitle"]').element;
        const description = w.find('[data-stub="DialogDescription"]').element;

        expect(title.parentElement).toBe(content);
        expect(description.parentElement).toBe(content);
        expect(title.contains(description)).toBe(false);
        expect(w.find('[data-stub="DialogTitle"]').text()).toBe(baseProps.title);
        expect(w.find('[data-stub="DialogDescription"]').text()).toBe(
            baseProps.description,
        );
        w.unmount();
    });

    it("(9) the trigger slot renders inside <Dialog> and NEVER inside <DialogContent> (R-7's one structural addition)", () => {
        const w = mount(CSSPasteDialog, {
            props: { ...baseProps, open: true, text: "a {}", submit: () => {} },
            slots: { trigger: '<button id="the-trigger">open</button>' },
            attachTo: document.body,
        });

        const trigger = w.find("#the-trigger").element;
        const dialog = w.find('[data-stub="Dialog"]').element;
        const content = w.find('[data-stub="DialogContent"]').element;

        expect(dialog.contains(trigger)).toBe(true);
        expect(content.contains(trigger)).toBe(false);
        w.unmount();
    });
});
