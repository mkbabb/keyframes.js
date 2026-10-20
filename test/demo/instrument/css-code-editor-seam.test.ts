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
 * resolution cannot load), `@mkbabb/glass-ui/toast` (spied, so the boundary's toasts are
 * observable), `@utils/formatEditorCSS` (a `vi.fn` whose rejection is the
 * subject of the format boundary), and the sibling's engine-bound
 * composables (`@kf-engine`, `useKeyframesEditor`, `useKeyframeBrushApply`,
 * `@composables/copyWithToast`) — none of which is a subject of this gate. jsdom gaps
 * are polyfilled as SYMBOLS only (`CSS.escape`, `matchMedia`, a 2d canvas
 * context that measures nothing, a `ResizeObserver` that reports the box jsdom
 * cannot lay out — once per observed element, as a browser's first observation
 * does — and a non-zero `offsetWidth` for the format width); none alters a
 * component under test. Nothing is skipped, allow-listed or guarded around a defect.
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
 *       toast and the next edit still parses (nothing is latched for the
 *       session); UIA-KF-219 — that ACCEPTED edit raises no success toast (the
 *       editor shows it; the per-parse toast was chatter); and (KF-CE-7) a
 *       successful format's text reaches the model.
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
// jsdom lays nothing out and ships no ResizeObserver. The polyfill reports a
// 480×300 box for each element it starts observing (a browser's first
// observation), unless `boxes.held` — a well in a skipped
// (`content-visibility: hidden`) subtree, which a browser never lays out and
// never reports. `resizeAll` delivers a later box change to every live observer.
type Box = { width: number; height: number };
const boxes = { held: false };
const liveObservers = new Set<{ cb: (entries: unknown[]) => void; targets: Set<Element> }>();
const report = (o: { cb: (entries: unknown[]) => void }, target: Element, box: Box) =>
    o.cb([{ target, contentRect: { ...box, x: 0, y: 0, top: 0, left: 0, right: box.width, bottom: box.height } }]);
(globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    private o: { cb: (entries: unknown[]) => void; targets: Set<Element> };
    constructor(cb: (entries: unknown[]) => void) {
        this.o = { cb, targets: new Set() };
        liveObservers.add(this.o);
    }
    observe(target: Element) {
        this.o.targets.add(target);
        if (boxes.held) return;
        queueMicrotask(() => {
            if (this.o.targets.has(target)) report(this.o, target, { width: 480, height: 300 });
        });
    }
    unobserve(target: Element) {
        this.o.targets.delete(target);
    }
    disconnect() {
        this.o.targets.clear();
        liveObservers.delete(this.o);
    }
};
const resizeAll = (box: Box) => {
    for (const o of [...liveObservers]) for (const t of [...o.targets]) report(o, t, box);
};
// jsdom lays nothing out: every element answers a box (the format width reads it).
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
const toastSpy = vi.hoisted(() =>
    vi.fn((_o: { title?: string; tone?: string; description?: string }) => ({
        id: "0",
        dismiss: () => {},
        update: () => {},
    })),
);
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: toastSpy, ToastAction: {} }));
/** The toasts raised in one tone (glass's `tone` axis: success · destructive). */
const toastsOf = (tone: string) => toastSpy.mock.calls.filter(([o]) => o.tone === tone);
const formatEditorCSS = vi.hoisted(() => vi.fn<(raw: string, width?: number) => Promise<string>>());
vi.mock("@utils/formatEditorCSS", () => ({ formatEditorCSS }));
vi.mock("@composables/copyWithToast", () => ({ copyWithToast: async () => ({ ok: true }) }));
vi.mock("@kf-engine", () => ({
    kfEngine: () => ({
        CSSKeyframesAnimation: class {},
        // The real seat API: a preset returns an animation whose `setTargets`
        // binds the element and hands back the same animation to `play()`.
        presets: {
            shake: () => {
                const anim = { setTargets: () => anim, play() {} };
                return anim;
            },
        },
        compileToCSS: async () => ({ eligible: false, css: "", refusals: [] }),
    }),
}));
const updateFromString = vi.hoisted(() => vi.fn(async (_value: string) => {}));
vi.mock("@components/instrument/keyframes/composables/useKeyframesEditor", () => ({
    useKeyframesEditor: () => ({
        cssKeyframesString: ref("a { color: red }"),
        // X.KF.W13X.esc1 — the parse status is the channel's (store-held), so
        // the editor composable hands it to the pane with the buffer.
        parseState: ref<"parsed" | "error">("parsed"),
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
const { CODE_INK, tokenizeCSS } = await import(
    "@components/instrument/keyframes/utils/codeTokens"
);
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
    toastSpy.mockClear();
    updateFromString.mockClear();
    formatEditorCSS.mockReset();
});

describe("G-KFW12-4 — the Monaco seam", () => {
    // OD19-ALL (editor open, KF-P3). FIRST in the file on purpose: the boot is
    // module-scoped (one per page), so this case is the one that meets a cold
    // chunk. The Keyframes pane force-mounts the well hidden at idle (T.G9), and
    // the open used to pay the chunk's fetch + evaluation and `editor.create` in
    // its own frames (276–407 ms input→editor paint, one 128–134 ms frame). The
    // hidden well now warms the chunk in its first idle period: the module boot
    // only (the css language is registered), no editor, no geometry read.
    it("(0) OD19-ALL: a hidden well warms the Monaco chunk and the font measurement at idle, creating no editor in the well and reading no geometry", async () => {
        let geometryReads = 0;
        const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")!;
        const height = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight")!;
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => (geometryReads++, 480) });
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get: () => (geometryReads++, 300) });
        const idle: Array<() => void> = [];
        const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
        w.requestIdleCallback = (cb) => idle.push(cb);
        boxes.held = true;
        const cssRegistered = () => monaco.languages.getLanguages().some((l) => l.id === "css");
        try {
            expect(cssRegistered()).toBe(false);
            mounted = mount(CSSCodeEditor, {
                props: { modelValue: "a { color: red }" },
                attachTo: document.body,
            });
            await nextTick();
            expect(idle.length).toBe(1);
            idle.splice(0).forEach((run) => run());
            for (let i = 0; i < 100 && !cssRegistered(); i++) await sleep(20);
            expect(cssRegistered()).toBe(true);
            expect(mounted.element.querySelector(".monaco-editor")).toBeNull();
            expect(geometryReads).toBe(0);
            // One idle period later the font measurement is primed: a throwaway
            // editor with the well's font, in a box OUTSIDE the well, disposed
            // in the same task (Monaco caches the measurement for the page).
            expect(idle.length).toBe(1);
            const create = vi.spyOn(monaco.editor, "create");
            const live = monaco.editor.getEditors().length;
            try {
                idle.splice(0).forEach((run) => run());
                expect(create).toHaveBeenCalledTimes(1);
                const [box, options] = create.mock.calls[0]!;
                expect(mounted.element.contains(box)).toBe(false);
                expect(box.isConnected).toBe(false);
                expect(options).toMatchObject({ fontLigatures: true, fontSize: 14 });
                expect(monaco.editor.getEditors().length).toBe(live);
                expect(mounted.element.querySelector(".monaco-editor")).toBeNull();
            } finally {
                create.mockRestore();
            }
        } finally {
            boxes.held = false;
            delete w.requestIdleCallback;
            Object.defineProperty(HTMLElement.prototype, "offsetWidth", width);
            Object.defineProperty(HTMLElement.prototype, "offsetHeight", height);
        }
    });

    // OD19-ALL (load). The boot and the font warm are the PAGE's, not the
    // well's: the Keyframes pane force-mounts a well on every scene swap, and
    // with the boot in <script setup> each mount re-registered the css
    // grammar and made a second throwaway editor inside the swap.
    it("(0b) OD19-ALL: a second hidden well re-registers no language and makes no second throwaway editor", async () => {
        const idle: Array<() => void> = [];
        const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
        w.requestIdleCallback = (cb) => idle.push(cb);
        boxes.held = true;
        const tokens = vi.spyOn(monaco.languages, "setMonarchTokensProvider");
        const create = vi.spyOn(monaco.editor, "create");
        try {
            mounted = mount(CSSCodeEditor, {
                props: { modelValue: "a { color: red }" },
                attachTo: document.body,
            });
            await nextTick();
            for (let round = 0; round < 3; round++) {
                idle.splice(0).forEach((run) => run());
                await sleep(20);
            }
            expect(idle.length).toBe(0);
            expect(tokens).not.toHaveBeenCalled();
            expect(create).not.toHaveBeenCalled();
            expect(mounted.element.querySelector(".monaco-editor")).toBeNull();
        } finally {
            tokens.mockRestore();
            create.mockRestore();
            boxes.held = false;
            delete w.requestIdleCallback;
        }
    });

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

    it("(4) KF-CE-9 + KF-CE-37 + KF-CE-7 + UIA-KF-219: a rejected format is surfaced, the next edit parses without a success toast, a good format reaches the model", async () => {
        mounted = mount(KeyframesStringControls, {
            props: { animation: {} as never },
            attachTo: document.body,
        });
        await booted(mounted);
        const vm = mounted.vm as unknown as { formatCSS: () => Promise<void> };

        formatEditorCSS.mockRejectedValueOnce(new Error("CssSyntaxError: Unexpected }"));
        await vm.formatCSS();
        expect(toastsOf("destructive")).toHaveLength(1);
        expect(String(toastsOf("destructive")[0]?.[0]?.description)).toContain(
            "Unexpected }",
        );

        // nothing is latched: the next edit parses. UIA-KF-219 — and an
        // accepted edit raises no success toast (the editor already shows it)
        await sleep(350);
        const model = monaco.editor
            .getModels()
            .find((m) => m.getValue() === "a { color: red }")!;
        model.applyEdits([
            { range: model.getFullModelRange(), text: "a { color: blue }" },
        ]);
        await sleep(350);
        expect(updateFromString).toHaveBeenCalledWith("a { color: blue }");
        expect(toastsOf("success")).toHaveLength(0);

        // KF-CE-7 — a successful format's text reaches the model (the parent
        // receives it), not only the buffer
        const FORMATTED = "a {\n    color: blue;\n}\n";
        formatEditorCSS.mockResolvedValueOnce(FORMATTED);
        updateFromString.mockClear();
        await vm.formatCSS();
        await sleep(350);
        expect(updateFromString).toHaveBeenCalledWith(FORMATTED);
    });

    // X.KF.W13X.r4init — KFA-81 stall limb (ESC-r4shell-1, COHESION §0fa item 3).
    // Booted inline from `onMounted`, Monaco's evaluation and `editor.create`
    // landed in the frame that mounts the pane (a 525 ms LoAF on a cold cube
    // entry, `evidence/W13X/r4shell/swapprof-gh-coldcube.txt`). The boot now
    // waits for the first idle period after the pane's paint; the well holds
    // its Skeleton (`aria-busy`) until then. The idle queue is driven by hand.
    it("(5) KFA-81: the editor boots in the first idle period after the pane paints, the well busy under its Skeleton until then", async () => {
        const idle: Array<() => void> = [];
        const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
        w.requestIdleCallback = (cb) => idle.push(cb);
        try {
            mounted = mount(CSSCodeEditor, {
                props: { modelValue: "a { color: red }" },
                attachTo: document.body,
            });
            // Longer than a boot takes when it is not held (the cases above).
            await sleep(600);
            expect(mounted.element.querySelector(".monaco-editor")).toBeNull();
            expect(mounted.element.querySelector("[aria-busy='true']")).not.toBeNull();
            expect(mounted.element.querySelector("[data-stub='Skeleton']")).not.toBeNull();
            expect(idle.length).toBe(1);
            idle.splice(0).forEach((run) => run());
            await booted(mounted);
            expect(mounted.element.querySelector("[aria-busy='true']")).toBeNull();
        } finally {
            delete w.requestIdleCallback;
        }
    });

    it("(6) KFA-81: the outgoing editor's teardown also waits for the paint (a swap unmounts one pane and mounts the next in one frame)", async () => {
        mounted = mount(CSSCodeEditor, {
            props: { modelValue: "a { color: red }" },
            attachTo: document.body,
        });
        await booted(mounted);
        await sleep(50);
        const idle: Array<() => void> = [];
        const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
        w.requestIdleCallback = (cb) => idle.push(cb);
        try {
            const live = monaco.editor.getEditors().length;
            mounted.unmount();
            mounted = undefined;
            expect(monaco.editor.getEditors().length).toBe(live);
            idle.splice(0).forEach((run) => run());
            expect(monaco.editor.getEditors().length).toBe(live - 1);
        } finally {
            delete w.requestIdleCallback;
        }
    });

    it("(7) KF.W13X C1r2-2: a well in a skipped subtree reads no geometry and boots nothing until it is laid out", async () => {
        let geometryReads = 0;
        const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")!;
        const height = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight")!;
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => (geometryReads++, 480) });
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get: () => (geometryReads++, 300) });
        boxes.held = true;
        try {
            mounted = mount(CSSCodeEditor, {
                props: { modelValue: "a { color: red }" },
                attachTo: document.body,
            });
            // Longer than a boot takes when the well has a box (cases 1–4).
            await sleep(600);
            expect(geometryReads).toBe(0);
            expect(mounted.element.querySelector(".monaco-editor")).toBeNull();
            expect(mounted.element.querySelector("[aria-busy='true']")).not.toBeNull();
            // X-DS r7 pass 11 (KF-C11-01): the hidden well mounts no Skeleton,
            // so glass's infinite breathe never runs in a pane never opened.
            expect(mounted.element.querySelector("[data-stub='Skeleton']")).toBeNull();
            // The pane is shown: the well is laid out and its observer reports the box.
            resizeAll({ width: 480, height: 300 });
            await nextTick();
            expect(mounted.element.querySelector("[data-stub='Skeleton']")).not.toBeNull();
            await booted(mounted);
        } finally {
            boxes.held = false;
            Object.defineProperty(HTMLElement.prototype, "offsetWidth", width);
            Object.defineProperty(HTMLElement.prototype, "offsetHeight", height);
        }
    });

    it("(8) KF.W13X C1r2-3: the well's observer lays the live editor out and stops at unmount, so the outgoing editor never re-lays itself in a swap frame", async () => {
        const before = new Set(monaco.editor.getEditors());
        mounted = mount(CSSCodeEditor, {
            props: { modelValue: "a { color: red }" },
            attachTo: document.body,
        });
        await booted(mounted);
        const editor = monaco.editor.getEditors().find((e) => !before.has(e))!;
        expect(editor.getRawOptions().automaticLayout).toBe(false);
        const layout = vi.spyOn(editor, "layout");
        resizeAll({ width: 400, height: 200 });
        expect(layout).toHaveBeenCalledWith({ width: 400, height: 200 });
        const idle: Array<() => void> = [];
        const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
        w.requestIdleCallback = (cb) => idle.push(cb);
        try {
            mounted.unmount();
            mounted = undefined;
            layout.mockClear();
            // The detached well shrinks to nothing while the outgoing editor waits for idle.
            resizeAll({ width: 0, height: 0 });
            resizeAll({ width: 300, height: 120 });
            expect(layout).not.toHaveBeenCalled();
            expect(monaco.editor.getEditors()).toContain(editor);
            idle.splice(0).forEach((run) => run());
            expect(monaco.editor.getEditors()).not.toContain(editor);
        } finally {
            delete w.requestIdleCallback;
        }
    });

    // OD19-K7 (owner 2026-10-19: "better syntax colour coding in the code
    // editor") — the theme rules ink SIX classes apart (BEFORE: three rungs, so
    // selectors, `@keyframes`, property names and value keywords shared inks),
    // and the grammar names the keyframe stops and the animation's name. jsdom
    // resolves no colour, so the canvas pixel read is answered with bytes
    // derived from the colour expression the theme resolved: equal expressions
    // give equal hex, distinct expressions distinct hex.
    it("(9) OD19-K7: the theme inks six Monarch classes apart; the grammar emits keyframe stops and the name as structure", async () => {
        const getContext = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "getContext")!;
        Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
            configurable: true,
            value: () => {
                let fill = "";
                return new Proxy({ webkitBackingStorePixelRatio: 1 } as Record<PropertyKey, unknown>, {
                    get: (target, key) => {
                        if (key === "getImageData")
                            return () => {
                                let hsh = 2166136261;
                                for (const c of fill) hsh = Math.imul(hsh ^ c.charCodeAt(0), 16777619) >>> 0;
                                return { data: [hsh & 255, (hsh >> 8) & 255, (hsh >> 16) & 255, 255] };
                            };
                        return key in target ? target[key] : () => ({ width: 0, data: [] });
                    },
                    set: (_t, key, v) => {
                        if (key === "fillStyle") fill = String(v);
                        return true;
                    },
                });
            },
        });
        const define = vi.spyOn(monaco.editor, "defineTheme");
        try {
            mounted = mount(CSSCodeEditor, {
                props: { modelValue: "@keyframes spin { 0% { opacity: 0 } }" },
                attachTo: document.body,
            });
            await booted(mounted);
            const theme = define.mock.calls.at(-1)![1];
            const rule = (token: string) => theme.rules.find((r) => r.token === token);
            const classes = ["keyword", "attribute.name", "attribute.value", "attribute.value.number", "keyframe.stop", "delimiter"];
            const inks = classes.map((c) => rule(c)?.foreground);
            expect(inks.every(Boolean)).toBe(true);
            expect(new Set(inks).size).toBe(6);
            expect(rule("tag")?.foreground).toBe(rule("keyword")?.foreground);
            expect(rule("comment")?.foreground).toBe(rule("delimiter")?.foreground);
            expect(rule("keyframe.stop")?.fontStyle).toBe("bold");

            const types = monaco.editor
                .tokenize("@keyframes spin {\n  0% { opacity: 0.5; }\n  to { transform: rotate(1turn); }\n}", "css")
                .flat()
                .map((t) => t.type);
            expect(types).toContain("keyframe.stop.css");
            expect(types).toContain("tag.css");
            expect(types.filter((t) => t === "keyframe.stop.css")).toHaveLength(2);
            expect(types).toContain("attribute.name.css");
            expect(types).toContain("attribute.value.number.css");
        } finally {
            define.mockRestore();
            Object.defineProperty(HTMLCanvasElement.prototype, "getContext", getContext);
        }
    });

    it("(10) OD19-K7: tokenizeCSS folds the same six rungs (StartingStyleTarget stays in lockstep)", () => {
        const css = "@keyframes spin {\n  0% { opacity: 0.5; }\n  to { transform: rotate(1turn); }\n}";
        const tokens = tokenizeCSS(css);
        expect(tokens.map((t) => t.text).join("")).toBe(css);
        const inkOf = (text: string) => {
            const at = css.indexOf(text);
            let pos = 0;
            for (const t of tokens) {
                if (at < pos + t.text.length) return t.ink;
                pos += t.text.length;
            }
            return undefined;
        };
        expect(inkOf("@keyframes")).toBe("structure");
        expect(inkOf("spin")).toBe("structure");
        expect(inkOf("0%")).toBe("stop");
        expect(inkOf("to {")).toBe("stop");
        expect(inkOf("opacity")).toBe("property");
        expect(inkOf("0.5")).toBe("number");
        expect(inkOf("1turn")).toBe("number");
        expect(inkOf("rotate")).toBe("value");
        expect(inkOf("{")).toBe("punct");
        expect(new Set(tokens.map((t) => t.ink).filter(Boolean)).size).toBe(6);
        expect(new Set(Object.values(CODE_INK)).size).toBe(6);
    });

    // OD19-K7 — the status is a bigger dot only: no visible word; the word is
    // the dot's accessible name, and the polite live region still carries it.
    it("(11) OD19-K7: the pane status is a labelled md dot with no visible text, inside the polite live region", async () => {
        mounted = mount(KeyframesStringControls, {
            props: { animation: {} as never },
            attachTo: document.body,
        });
        const status = mounted.element.querySelector("[role=status]")!;
        expect(status).not.toBeNull();
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.textContent?.trim()).toBe("");
        const dot = status.querySelector(".status-dot")!;
        expect(dot.getAttribute("data-size")).toBe("md");
        expect(dot.getAttribute("data-state")).toBe("success");
        expect(dot.getAttribute("aria-label")).toBe("Parsed");
        expect(dot.getAttribute("role")).toBe("img");
    });
});
