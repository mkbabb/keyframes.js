/**
 * X.KF.W8 G12 — CHARACTERIZATION of the fold's ADAPTER half.
 *
 * WHAT SHAPE THIS IS WRITTEN AGAINST. G12 is gated on KF.W7's R-7 verdict and
 * may not pin a surface W7 might delete. R-7 has RULED and the fold has LANDED
 * in the pinned direction: `CSSPasteDialog.vue` is the ONE shell and this file
 * is "a thin adapter over this shell". So the thing worth characterizing is not
 * a second dialog — it is the ADAPTER CONTRACT, i.e. exactly what survived the
 * fold and what it is forbidden from re-growing. Four genuine deltas were
 * ruled; two of them (highlighting, Tab-insert) were mooted with the `<pre>`
 * host when S-9 swapped in the producer `Textarea`, and the two that remain are
 * `DialogTrigger` and `reformat` — both covered below.
 *
 * WHY THESE CLAUSES. Each is a decision the fold settled that a later edit could
 * silently undo, and none is visible to a type checker:
 *
 *   • the adapter DELEGATES — it renders the shell and passes the four content
 *     props; a re-grown local dialog tree would be R-7 reopening;
 *   • both models pass through in BOTH directions (`open`, `text`), which is the
 *     hoisting contract the fold adopted from this twin;
 *   • `submit` returns VOID here, deliberately: the parent (`useKeyframeOps`)
 *     owns the close, and the shell's void-return rule is what preserves that —
 *     the adapter must emit `submit` and must NOT close the dialog itself;
 *   • `reformat` HANDLES a rejecting formatter (KAD-5/KAD-13): prettier throws
 *     on the draft's normal mid-typing condition, and the ruled cure leaves the
 *     draft byte-for-byte intact and reports the cause — never a swallowed
 *     rejection and never an eaten draft;
 *   • a resolving formatter WRITES BACK through the model (`update:text`) —
 *     KAD-13's triple-write, where the JSDoc declared a pure formatter while the
 *     wiring secretly wrote the parent model and never emitted;
 *   • the feedback sweep is DECORATIVE (KAD-15 / S-10 declined in writing): it
 *     is `aria-hidden`, it is NOT a `role="progressbar"`, and it rests at zero
 *     (`scale-x-0`) rather than painting complete at idle.
 *
 * THE PRODUCER SEAM, STATED — the same one `CSSPasteDialog.test.ts` states and
 * for the same measured reason: `@mkbabb/glass-ui`'s dist imports
 * `@mkbabb/keyframes.js`, a package never installs itself, and vitest's alias
 * cannot reach a specifier originating inside `node_modules`, so loading the
 * producer barrel dies before any assertion. The lane already answers this with
 * `vi.mock` of the producer (`aurora-opacity-ceiling.test.ts`, a KF.W4 create).
 * The durable cure is a runner change and `vitest.config.ts` is carved in this
 * wave to the `measure` project alone, so it is ESCALATED, not reached across
 * for. The subject is NOT mocked: this spec mounts the real adapter over the
 * real shell, and only the producer's primitives are stubbed.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup: (_p, { slots, attrs }) =>
            () =>
                h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
    });

const buttonStub = defineComponent({
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
});

vi.mock("@mkbabb/glass-ui", () => ({
    Dialog: slotStub("div", "Dialog"),
    DialogContent: slotStub("div", "DialogContent"),
    DialogTitle: slotStub("h2", "DialogTitle"),
    DialogDescription: slotStub("p", "DialogDescription"),
    DialogFooter: slotStub("footer", "DialogFooter"),
    Button: buttonStub,
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

vi.mock("@mkbabb/glass-ui/button", () => ({ Button: buttonStub }));
vi.mock("@mkbabb/glass-ui/dialog", () => ({
    DialogTrigger: slotStub("span", "DialogTrigger"),
}));
vi.mock("@mkbabb/glass-ui/tooltip", () => ({
    Tooltip: slotStub("span", "Tooltip"),
    TooltipTrigger: slotStub("span", "TooltipTrigger"),
    TooltipContent: slotStub("span", "TooltipContent"),
}));

/** The reformat shortcut registry: capture the handler the adapter registers. */
const registered: Array<{ combo: string; run: () => void }> = [];
vi.mock("@mkbabb/glass-ui/keyboard", () => ({
    registerShortcut: (combo: string, run: () => void) => {
        registered.push({ combo, run });
        return () => {
            const i = registered.findIndex((r) => r.run === run);
            if (i >= 0) registered.splice(i, 1);
        };
    },
}));

const KeyframesAddDialog = (
    await import("@components/instrument/keyframes/components/KeyframesAddDialog.vue")
).default;

const mountAdapter = (
    over: Partial<{ text: string; format: (raw: string) => Promise<string> }> = {},
) =>
    mount(KeyframesAddDialog, {
        props: {
            open: true,
            text: over.text ?? "a {}",
            format: over.format ?? ((raw: string) => Promise.resolve(raw)),
        },
        attachTo: document.body,
    });

/** Run the registered reformat handler and let its promise settle. */
const runReformat = async () => {
    const entry = registered.find((r) => r.combo === "Shift+Alt+KeyF");
    expect(entry, "the adapter registers its reformat shortcut").toBeTruthy();
    entry!.run();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
};

describe("KeyframesAddDialog — the fold's thin adapter", () => {
    beforeEach(() => {
        registered.length = 0;
        vi.restoreAllMocks();
    });

    it("(1) it DELEGATES to the one shell and passes the content props", () => {
        const w = mountAdapter();

        const shell = w.findComponent({ name: "CSSPasteDialog" });
        expect(shell.exists()).toBe(true);
        expect(shell.props("title")).toBe("Add keyframes");
        expect(shell.props("description")).toBe(
            "Append @keyframes stops to the current animation",
        );
        expect(shell.props("buttonLabel")).toBe("Add keyframes");
        expect(typeof shell.props("submit")).toBe("function");

        // One dialog tree, not two: the adapter grew no shell of its own.
        expect(w.findAll('[data-stub="DialogContent"]')).toHaveLength(1);
        w.unmount();
    });

    it("(2) the draft model passes through in BOTH directions", async () => {
        const w = mountAdapter({ text: "a {}" });

        expect(w.findComponent({ name: "Textarea" }).props("modelValue")).toBe("a {}");

        const well = w.find("textarea");
        (well.element as HTMLTextAreaElement).value = "b {}";
        await well.trigger("input");

        expect(w.emitted("update:text")?.at(-1)).toEqual(["b {}"]);
        w.unmount();
    });

    it("(3) submit EMITS and leaves the close to the parent (the void-return contract)", async () => {
        const w = mountAdapter({ text: "a {}" });

        await w.find("footer button").trigger("click");
        await new Promise((r) => setTimeout(r, 0));

        expect(w.emitted("submit")?.at(-1)).toEqual(["a {}"]);
        // The parent (useKeyframeOps) closes on its own success path — the
        // adapter must not, and the shell's void-return rule is what allows it.
        expect(w.emitted("update:open")).toBeUndefined();
        w.unmount();
    });

    it("(4) a REJECTING formatter leaves the draft byte-for-byte and reports the cause (KAD-5)", async () => {
        const boom = new Error("Unexpected token at 1:3");
        const format = vi.fn(() => Promise.reject(boom));
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});

        const w = mountAdapter({ text: "a {", format });
        await runReformat();

        expect(format).toHaveBeenCalledWith("a {");
        // The rejection is HANDLED, not swallowed and not floated.
        expect(spy).toHaveBeenCalledTimes(1);
        expect(String(spy.mock.calls[0]?.[0])).toContain("the draft is unchanged");
        expect(spy.mock.calls[0]?.[1]).toBe(boom);
        // A failed reformat never eats the text it could not parse.
        expect(w.emitted("update:text")).toBeUndefined();
        expect(w.findComponent({ name: "Textarea" }).props("modelValue")).toBe("a {");
        w.unmount();
    });

    it("(5) a RESOLVING formatter writes back through the model, and only through it (KAD-13)", async () => {
        const format = vi.fn(() => Promise.resolve("a {\n  opacity: 0;\n}"));

        const w = mountAdapter({ text: "a{opacity:0}", format });
        await runReformat();

        expect(w.emitted("update:text")?.at(-1)).toEqual(["a {\n  opacity: 0;\n}"]);
        w.unmount();
    });

    it("(6) the reformat binding lives exactly as long as the dialog is open", async () => {
        const w = mountAdapter();
        expect(registered.filter((r) => r.combo === "Shift+Alt+KeyF")).toHaveLength(1);

        await w.setProps({ open: false });
        expect(registered.filter((r) => r.combo === "Shift+Alt+KeyF")).toHaveLength(0);

        await w.setProps({ open: true });
        expect(registered.filter((r) => r.combo === "Shift+Alt+KeyF")).toHaveLength(1);

        w.unmount();
        expect(registered.filter((r) => r.combo === "Shift+Alt+KeyF")).toHaveLength(0);
    });

    it("(7) the feedback sweep is DECORATIVE and rests at zero (KAD-15 / S-10 declined)", () => {
        const w = mountAdapter();

        const bar = w.find(".progress-bar");
        expect(bar.exists()).toBe(true);
        expect(bar.attributes("aria-hidden")).toBe("true");
        // S-10: the producer's Progress was declined IN WRITING because this bar
        // measures nothing — announcing a progress that does not exist is the
        // defect, so no progressbar role may appear here.
        expect(bar.attributes("role")).toBeUndefined();
        expect(w.find('[role="progressbar"]').exists()).toBe(false);
        // KAD-15 / D-20: it rests at zero, never painted complete at idle.
        expect(bar.classes()).toContain("scale-x-0");
        expect(bar.classes()).toContain("origin-left");
        w.unmount();
    });

    it("(8) the trigger is a real named button, and it renders OUTSIDE the dialog content", () => {
        const w = mountAdapter();

        const trigger = w.find('button[aria-label="Add keyframes"]');
        expect(trigger.exists()).toBe(true);

        const content = w.find('[data-stub="DialogContent"]').element;
        expect(content.contains(trigger.element)).toBe(false);
        w.unmount();
    });
});
