/**
 * G-KFW12-4 — the Monaco seam, executed against the REAL editor under jsdom
 * (X.KF.W12.d, EDITOR-UNIT).
 *
 * What is REAL here: `CSSCodeEditor.vue` and `KeyframesStringControls.vue`
 * (the two files the seam spans), the installed `monaco-editor` 0.55.1 booted
 * through the component's own `editor.api` boot (the test registers NO
 * language and NO tokenizer — whatever `tokenize` sees was put there by the
 * component), vueuse's `useTimeoutFn`, and the `@lucide/vue` glyph. What is
 * STUBBED, at the module seam: the glass-ui `card` / `dark` subpaths and the
 * ROOT barrel (the lane's known wall — every entry whose closure reaches
 * `useSpring-*.js` imports `@mkbabb/keyframes.js`, which vitest's externalized
 * resolution cannot load), `vue-sonner` (spied, so the boundary's toasts are
 * observable), `@utils/formatEditorCSS` (a `vi.fn` whose rejection is the
 * subject of the format boundary), and the sibling's engine-bound
 * composables (`@kf-engine`, `useKeyframesEditor`, `useKeyframeBrushApply`,
 * `@utils/clipboard`) — none of which is a subject of this gate. jsdom gaps
 * are polyfilled as SYMBOLS only (`CSS.escape`, `matchMedia`, a 2d canvas
 * context that measures nothing, `ResizeObserver`, a non-zero `offsetWidth`
 * so the component takes its immediate-init branch); none alters a component
 * under test. Nothing is skipped, allow-listed or guarded around a defect.
 *
 * The four runtime clauses, each a behaviour and each born RED at the bytes
 * this wave opened on (the RED run is pasted in the wave record):
 *   (1) KF-CE-3 — Tab is NOT swallowed by the editor: a Tab keydown on the
 *       focused input area leaves `defaultPrevented` false, so the browser
 *       moves focus (the WCAG 2.1.2 trap is the editor preventing it to
 *       insert indentation).
 *   (2) KF-CE-1 — the CSS tokenizer the component's boot registered produces
 *       ≥ 2 token classes for `a { color: red }`.
 *   (3) KF-CE-2 (child half) — an external model write cancels the pending
 *       debounced emit, so a stale buffer never lands on the parent after a
 *       selection change.
 *   (4) KF-CE-9 + KF-CE-37 — a rejected `formatCSSContent` surfaces an error
 *       toast and RELEASES `isFormatting` (the next parse's success toast is
 *       not suppressed for the session); and (KF-CE-7) a successful format's
 *       text reaches the model.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";

// ── jsdom gaps, polyfilled as symbols only ───────────────────────────────────
if (typeof (globalThis as { CSS?: unknown }).CSS === "undefined") {
    (globalThis as { CSS?: unknown }).CSS = {
        escape: (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`),
        supports: () => false,
    };
}
if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
    })) as typeof window.matchMedia;
}
// jsdom's canvas has no 2d context without the `canvas` package; monaco reads
// the backing-store ratio through it and paints its overview ruler on it. A
// context whose every method is a no-op paints nothing and measures nothing.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () =>
        new Proxy({ webkitBackingStorePixelRatio: 1 } as Record<PropertyKey, unknown>, {
            get: (target, key) =>
                key in target ? target[key] : () => ({ width: 0, data: [] }),
            set: () => true,
        }),
});
if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
// jsdom lays nothing out: give every element a box so the component takes its
// immediate-init branch instead of waiting on a ResizeObserver that never fires.
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get: () => 480,
});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => 300,
});

// ── The module-seam stubs ────────────────────────────────────────────────────
const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup(_props, { slots, attrs }) {
            return () => h(tag, { "data-stub": name, ...attrs }, slots.default?.());
        },
    });
vi.mock("@mkbabb/glass-ui", () => ({
    Skeleton: slotStub("div", "Skeleton"),
    Button: defineComponent({
        name: "ButtonStub",
        setup(_props, { slots, attrs }) {
            return () => h("button", { type: "button", ...attrs }, slots.default?.());
        },
    }),
}));
vi.mock("@mkbabb/glass-ui/card", () => ({
    Card: slotStub("div", "Card"),
}));
const isDark = ref(false);
vi.mock("@mkbabb/glass-ui/dark", () => ({
    useGlobalDark: () => ({
        isDark,
        onFlipSettled: () => () => {},
    }),
}));
const toastSpies = vi.hoisted(() => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    dismiss: vi.fn(),
}));
vi.mock("vue-sonner", () => ({
    toast: Object.assign(() => {}, toastSpies),
}));
const formatEditorCSS = vi.hoisted(() => vi.fn<(raw: string, width?: number) => Promise<string>>());
vi.mock("@utils/formatEditorCSS", () => ({ formatEditorCSS }));
vi.mock("@utils/clipboard", () => ({ copyText: async () => {} }));
vi.mock("@kf-engine", () => ({
    kfEngine: () => ({
        CSSKeyframesAnimation: class {},
        presets: { shake: () => ({ play() {} }) },
        compileToCSS: async () => ({ eligible: false, css: "", refusals: [] }),
    }),
}));
const updateFromString = vi.hoisted(() => vi.fn(async (_value: string) => {}));
vi.mock("@components/instrument/keyframes/composables/useKeyframesEditor", () => ({
    useKeyframesEditor: () => ({
        cssKeyframesString: ref("a { color: red }"),
        keyframesStyleId: "keyframes-style-test",
        getTmpAnimationName: () => "test",
        updateFromString,
        updateCSSAnimationKeyframesStringFromAnimation: async () => {},
    }),
}));
vi.mock("@components/instrument/keyframes/composables/useKeyframeBrushApply", () => ({
    useKeyframeBrushApply: () => ({
        applyCSSStyles: () => {},
        cssApplied: ref(false),
    }),
}));

const monaco = await import("monaco-editor/esm/vs/editor/editor.api.js");
const CSSCodeEditor = (
    await import("@components/instrument/keyframes/CSSCodeEditor.vue")
).default;
const KeyframesStringControls = (
    await import("@components/instrument/keyframes/KeyframesStringControls.vue")
).default;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Wait until the component's boot has created its editor over the well. */
const booted = async (wrapper: VueWrapper<unknown>) => {
    for (let i = 0; i < 100; i++) {
        if (wrapper.element.querySelector(".monaco-editor textarea")) return;
        await sleep(20);
    }
    throw new Error("the editor never booted");
};
let mounted: VueWrapper<unknown> | undefined;
afterEach(() => {
    mounted?.unmount();
    mounted = undefined;
    toastSpies.success.mockClear();
    toastSpies.error.mockClear();
    updateFromString.mockClear();
    formatEditorCSS.mockReset();
});

describe("G-KFW12-4 — the Monaco seam", () => {
    it("(1) KF-CE-3: a Tab keydown on the focused input area is not swallowed", async () => {
        mounted = mount(CSSCodeEditor, {
            props: { modelValue: "a { color: red }" },
            attachTo: document.body,
        });
        await booted(mounted);
        const textarea = mounted.element.querySelector(
            ".monaco-editor textarea",
        ) as HTMLTextAreaElement;
        textarea.focus();
        await nextTick();
        const tab = new KeyboardEvent("keydown", {
            key: "Tab",
            code: "Tab",
            keyCode: 9,
            bubbles: true,
            cancelable: true,
        });
        textarea.dispatchEvent(tab);
        expect(tab.defaultPrevented).toBe(false);
    });

    it("(2) KF-CE-1: the tokenizer the boot registered classifies `a { color: red }`", async () => {
        mounted = mount(CSSCodeEditor, {
            props: { modelValue: "a { color: red }" },
            attachTo: document.body,
        });
        await booted(mounted);
        const lines = monaco.editor.tokenize("a { color: red }", "css");
        const classes = new Set(
            lines.flat().map((t) => t.type).filter((t) => t !== ""),
        );
        expect(classes.size).toBeGreaterThanOrEqual(2);
    });

    it("(3) KF-CE-2 child half: an external write cancels the pending debounced emit", async () => {
        mounted = mount(CSSCodeEditor, {
            props: { modelValue: "a { color: red }" },
            attachTo: document.body,
        });
        await booted(mounted);
        const model = monaco.editor
            .getModels()
            .find((m) => m.getValue() === "a { color: red }")!;
        expect(model).toBeDefined();
        // the user types: a content change arms the 200 ms emit
        model.applyEdits([
            { range: model.getFullModelRange(), text: "a { color: red; }x" },
        ]);
        // the parent selects another keyframe and projects its CSS in
        await mounted.setProps({ modelValue: "b { opacity: 0 }" });
        await sleep(350);
        const emitted = (mounted.emitted("update:modelValue") ?? []).flat();
        expect(emitted).not.toContain("a { color: red; }x");
        expect(model.getValue()).toBe("b { opacity: 0 }");
    });

    it("(4) KF-CE-9 + KF-CE-37 + KF-CE-7: a rejected format is surfaced, the latch releases, a good format reaches the model", async () => {
        mounted = mount(KeyframesStringControls, {
            props: { animation: {} as never },
            attachTo: document.body,
        });
        await booted(mounted);
        const vm = mounted.vm as unknown as { formatCSS: () => Promise<void> };

        formatEditorCSS.mockRejectedValueOnce(new Error("CssSyntaxError: Unexpected }"));
        await vm.formatCSS();
        expect(toastSpies.error).toHaveBeenCalledTimes(1);
        expect(String(toastSpies.error.mock.calls[0]?.[1]?.description)).toContain(
            "Unexpected }",
        );

        // the latch is released: the next parse's success feedback is not
        // suppressed for the session
        await sleep(350);
        const model = monaco.editor
            .getModels()
            .find((m) => m.getValue() === "a { color: red }")!;
        model.applyEdits([
            { range: model.getFullModelRange(), text: "a { color: blue }" },
        ]);
        await sleep(350);
        expect(updateFromString).toHaveBeenCalledWith("a { color: blue }");
        expect(toastSpies.success).toHaveBeenCalled();

        // KF-CE-7 — a successful format's text reaches the model (the parent
        // receives it), not only the buffer
        const FORMATTED = "a {\n    color: blue;\n}\n";
        formatEditorCSS.mockResolvedValueOnce(FORMATTED);
        updateFromString.mockClear();
        await vm.formatCSS();
        await sleep(350);
        expect(updateFromString).toHaveBeenCalledWith(FORMATTED);
    });
});
