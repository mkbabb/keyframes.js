// SERVED MODEL: claude-fable-5-1
/**
 * test/demo/instrument/keyframes-editor-honest.test.ts — X.KF.W12.c
 * (KFED-UNIT), the runtime half of **G-KFW12-3**: "Apply-CSS applies
 * something; honest surface".
 *
 * Every clause is the EXECUTED form of a cure — never a reading. The subjects
 * (`KeyframesEditor.vue`, its card list and cards, the keyframe composables,
 * the real engine) are mounted for real over a real parsed animation with a
 * real target element; only the producer (`@mkbabb/glass-ui`) is stubbed at the
 * module seam, for the measured reason every card-mounting demo spec states:
 * the producer's dist imports `@mkbabb/keyframes.js`, a package never installs
 * itself, and vitest's alias cannot reach a specifier originating inside
 * `node_modules`.
 *
 *   (1) KF-KE-4 — THE IDENTITY. Pressing Apply adds ONE class to the target and
 *       injects ONE sheet; the class on the target, the sheet's `.selector`,
 *       its `animation-name` and its `@keyframes` name are the SAME string,
 *       read back from the DOM. BITE: the audited bytes derived the selector as
 *       `styleId.replace("keyframes-style-", "").toLowerCase()` while the class
 *       stayed `styleId` — this clause reds on exactly that pair, which four
 *       audits read past. The fixture's id carries an UPPERCASE letter so a
 *       case-folded derivation cannot pass by coincidence.
 *
 *   (2) KF-KE-3 — THE FIELD'S GRAMMAR. The per-stop offset field validates
 *       through the keyframe-selector grammar: `500%` and `-20%` are rejected
 *       AT THE FIELD (marked invalid, nothing emitted, the model untouched) and
 *       `from`/`to` are accepted. BITE: `parseCssScalar` admits any percentage
 *       scalar and rejects the two keywords.
 *
 *   (3) KF-KE-5 — THE CLUSTER IS HIT-TESTABLE. The card's action cluster is
 *       positioned ABOVE the code plate on a declared z rung, the overlay box
 *       itself lets pointer events fall through to the plate, and the plate is
 *       no longer a later positioned sibling. BITE: return the cluster to a
 *       z-auto `absolute` box beside a `relative` `<pre>` and the paint order
 *       puts the plate on top.
 *
 *   (4) KF-KE-7 — DELETE IS A COMMAND, NOT A HOSTAGE. The removal control is a
 *       named focusable; activating it removes the stop even when the exit
 *       choreography cannot run (headless, the engine cannot resolve the
 *       transform it animates — `.a` measured the rejection); a second
 *       activation on a departing stop is a no-op. BITE: gate the mutation on
 *       the choreography's promise and the delete is silently dropped.
 *
 *   (5) KF-KE-6 — TWO OWNERS, ONE SHEET. Two editors over one animation share
 *       one applied identity; unmounting one leaves the sheet and the class for
 *       the other; unmounting the last clears both (KF-KE-12). BITE: per-instance
 *       node ownership removes the sheet on the first unmount.
 *
 *   (6) EE-03 — the frontier-cured length-watch is a RE-REGRESSION GUARD:
 *       mounting raises no "Invalid watch source" warning.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, markRaw, nextTick } from "vue";
import { mount } from "@vue/test-utils";

let shimInstalled = false;

beforeAll(() => {
    if (!("innerText" in HTMLElement.prototype)) {
        Object.defineProperty(HTMLElement.prototype, "innerText", {
            configurable: true,
            get(this: HTMLElement) {
                return this.textContent ?? "";
            },
            set(this: HTMLElement, value: string) {
                this.textContent = value;
            },
        });
        shimInstalled = true;
    }
});

afterAll(() => {
    if (shimInstalled) {
        Reflect.deleteProperty(HTMLElement.prototype, "innerText");
        shimInstalled = false;
    }
});

const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup: (_p, { slots, attrs }) =>
            () =>
                h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
    });

const buttonStub = defineComponent({
    name: "ButtonStub",
    inheritAttrs: false,
    props: { disabled: Boolean, loading: Boolean },
    setup: (p, { slots, attrs }) =>
        () =>
            h(
                "button",
                { ...attrs, disabled: p.disabled || undefined },
                slots.default?.(),
            ),
});

const sliderStub = defineComponent({
    name: "SliderStub",
    inheritAttrs: false,
    props: {
        modelValue: { type: Array, default: () => [] },
        min: { type: Number, default: undefined },
        max: { type: Number, default: undefined },
        step: { type: Number, default: undefined },
        marks: { type: Array, default: undefined },
    },
    emits: ["update:modelValue"],
    setup: (_p, { attrs }) =>
        () =>
            h("div", { ...attrs, "data-stub": "Slider" }),
});

const labeledFieldStub = defineComponent({
    name: "LabeledField",
    inheritAttrs: false,
    props: { label: String, description: String, controlLabelable: Boolean },
    setup: (p, { slots, attrs }) =>
        () =>
            h("div", { ...attrs, "data-stub": "LabeledField" }, [
                h("span", { id: "lf-label" }, p.label),
                slots.default?.({
                    controlId: "lf-control",
                    labelledBy: "lf-label",
                    describedBy: "lf-description",
                    errorId: undefined,
                    invalid: false,
                    disabled: false,
                    required: false,
                }),
            ]),
});

/**
 * The producer's `Input` forwards `$attrs` onto its `<input>` and renders
 * `invalid` as `aria-invalid` (measured at `dist/Input-9BlLluik.js`:
 * `forwardedAttrs` spread + `"aria-invalid": ariaInvalid`). The stub keeps
 * exactly that contract so a `change`/`keydown` listener bound on the
 * component reaches the element and the invalid mark is observable.
 */
const inputStub = defineComponent({
    name: "InputStub",
    inheritAttrs: false,
    props: {
        modelValue: { type: [String, Number], default: "" },
        invalid: { type: Boolean, default: false },
    },
    emits: ["update:modelValue"],
    setup: (p, { emit, attrs }) =>
        () =>
            h("input", {
                ...attrs,
                value: String(p.modelValue),
                "aria-invalid": p.invalid ? "true" : undefined,
                onInput: (e: Event) =>
                    emit("update:modelValue", (e.target as HTMLInputElement).value),
            }),
});

vi.mock("@mkbabb/glass-ui", () => ({
    Separator: slotStub("hr", "Separator"),
    Dialog: slotStub("div", "Dialog"),
    DialogContent: slotStub("div", "DialogContent"),
    DialogTitle: slotStub("h2", "DialogTitle"),
    DialogDescription: slotStub("p", "DialogDescription"),
    DialogFooter: slotStub("footer", "DialogFooter"),
    Button: buttonStub,
}));
vi.mock("@mkbabb/glass-ui/input", () => ({ Input: inputStub }));
vi.mock("@mkbabb/glass-ui/textarea", () => ({
    Textarea: slotStub("textarea", "Textarea"),
}));
vi.mock("@mkbabb/glass-ui/button", () => ({ Button: buttonStub }));
vi.mock("@mkbabb/glass-ui/card", () => ({
    Card: slotStub("div", "Card"),
    CardContent: slotStub("div", "CardContent"),
}));
vi.mock("@mkbabb/glass-ui/labeled-field", () => ({
    LabeledField: labeledFieldStub,
}));
vi.mock("@mkbabb/glass-ui/slider", () => ({ Slider: sliderStub }));
vi.mock("@mkbabb/glass-ui/tooltip", () => ({
    Tooltip: slotStub("span", "Tooltip"),
    TooltipTrigger: slotStub("span", "TooltipTrigger"),
    TooltipContent: slotStub("span", "TooltipContent"),
}));
vi.mock("@mkbabb/glass-ui/dialog", () => ({
    DialogTrigger: slotStub("span", "DialogTrigger"),
}));
vi.mock("@mkbabb/glass-ui/keyboard", () => ({
    registerShortcut: () => () => {},
}));
// A REAL ref: `useCodeHighlight` watches it, and a plain `{ value }` would raise
// Vue's "Invalid watch source" warning — the very warning clause (6) asserts
// absent, so the harness must not manufacture it.
vi.mock("@mkbabb/glass-ui/dark", async () => {
    const { ref } = await import("vue");
    const isDark = ref(false);
    return { useGlobalDark: () => ({ isDark }) };
});
vi.mock("@mkbabb/glass-ui/toast", () => ({
    toast: () => ({ id: "0", dismiss: () => {}, update: () => {} }),
    ToastAction: {},
}));

// The warm precedes the subject's IMPORT, exactly as `main.ts` guarantees it.
const { warmKfEngine } = await import("@kf-engine");
await warmKfEngine();

const { selectorText } = await import("@utils/keyframeSelector");
const { importCSSToTimeline, buildAnimationFromTimeline } = await import(
    "@components/instrument/timeline/utils/timelineEngine"
);
const KeyframesEditor = (
    await import("@components/instrument/keyframes/KeyframesEditor.vue")
).default;
const CopyButton = (await import("@components/CopyButton/CopyButton.vue"))
    .default;

const PERCENT_CSS = `
    @keyframes offsets {
        from { opacity: 0; }
        50% { opacity: 0.5; }
        to { opacity: 1; }
    }
`;

/**
 * A real animation over a REAL target, with an ident-clean id that carries an
 * UPPERCASE letter (the identity must hold independent of case) — named the way
 * the shipped call site names its animation (`useSpringSweepAnimation.ts:56-57`).
 */
const buildFixture = async (
    css: string,
    name = "offsets-Transform",
    superKey = "kfed",
) => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const keyframes = await importCSSToTimeline(css);
    const animation = await buildAnimationFromTimeline(
        { keyframes, captureProperties: [], animationName: "offsets" },
        { duration: 1_000 },
        [target],
    );
    animation.name = name;
    animation.superKey = superKey;
    return { animation: markRaw(animation), target };
};

type Frames = { start: unknown }[];
const framesOf = (animation: unknown): Frames =>
    (animation as { templateFrames: Frames }).templateFrames;

/** Mount the real editor and wait for its projection to land. */
const mountEditor = async (
    animation: Awaited<ReturnType<typeof buildFixture>>["animation"],
) => {
    const wrapper = mount(KeyframesEditor, {
        props: { animation },
        attachTo: document.body,
    });
    await nextTick();
    // The TOOLBAR's copy control carries the whole `@keyframes` projection; each
    // card carries its own stop's, so the wait is on the set, not the first.
    await vi.waitFor(
        () => {
            expect(
                wrapper
                    .findAllComponents(CopyButton)
                    .some((c) => String(c.props("text")).includes("@keyframes")),
            ).toBe(true);
        },
        { timeout: 10_000 },
    );
    return wrapper;
};

/** The projection is async and heavier than vitest's 5 s default on a shared
 *  runner (the wave's D59 precedent: explicit timeouts, assertions untouched). */
const HEAVY = { timeout: 30_000 };

type EditorWrapper = Awaited<ReturnType<typeof mountEditor>>;

const applyButton = (wrapper: EditorWrapper) =>
    wrapper
        .findAll("button")
        .find((b) => b.attributes("aria-pressed") !== undefined)!;

const removeButtons = (wrapper: EditorWrapper) =>
    wrapper
        .findAll("button")
        .filter((b) =>
            (b.attributes("aria-label") ?? "").startsWith("Remove the keyframe"),
        );

const injectedSheets = () =>
    Array.from(
        document.head.querySelectorAll<HTMLStyleElement>("style"),
    ).filter((el) => el.id.startsWith("keyframes-style-"));

beforeEach(() => {
    document.body.innerHTML = "";
    for (const el of injectedSheets()) el.remove();
});

describe("G-KFW12-3 — the keyframes authoring surface, executed", () => {
    it("(1) KF-KE-4: the class on the target and the selector in the injected sheet are ONE string", HEAVY, async () => {
        const { animation, target } = await buildFixture(PERCENT_CSS, "identity-Transform");
        const wrapper = await mountEditor(animation);

        const apply = applyButton(wrapper);
        expect(apply.attributes("aria-pressed")).toBe("false");
        await apply.trigger("click");
        await nextTick();

        expect(apply.attributes("aria-pressed")).toBe("true");

        // (a) the class the press added to the REAL target.
        const classes = Array.from(target.classList);
        expect(classes.length).toBe(1);
        const className = classes[0]!;

        // (b) the sheet the press injected — read from the document head.
        const sheets = injectedSheets();
        expect(sheets.length).toBe(1);
        const css = sheets[0]!.textContent ?? "";
        expect(css).toContain("@keyframes");

        const selectorName = /^\.(\S+)\s*\{/m.exec(css)?.[1];
        const animationName = /animation-name:\s*(\S+);/.exec(css)?.[1];
        const keyframesName = /@keyframes\s+(\S+)\s*\{/.exec(css)?.[1];

        // The strings the receipt pastes, side by side.
        console.info(
            `[KF-KE-4] class=${JSON.stringify(className)} selector=${JSON.stringify(selectorName)} animation-name=${JSON.stringify(animationName)} @keyframes=${JSON.stringify(keyframesName)}`,
        );

        expect(selectorName).toBe(className);
        expect(animationName).toBe(className);
        expect(keyframesName).toBe(className);
        // The bite, named: the audited derivation was the case-folded strip.
        expect(className).not.toBe(className.toLowerCase());

        // Unapply: the class leaves and the state reads false.
        await apply.trigger("click");
        await nextTick();
        expect(apply.attributes("aria-pressed")).toBe("false");
        expect(Array.from(target.classList)).toEqual([]);

        wrapper.unmount();
    });

    it("(2) KF-KE-3: the offset field refuses 500%/-20% at the field and accepts from/to, committing on change", HEAVY, async () => {
        const { animation } = await buildFixture(PERCENT_CSS, "offsets-Field");
        const frames = framesOf(animation);
        const wrapper = await mountEditor(animation);

        const field = (i: number) => wrapper.findAll("input")[i]!;
        // Keystrokes are `input` events alone (VTU's `setValue` would also fire
        // `change`, which is the commit this clause distinguishes from typing).
        const keystrokes = async (i: number, text: string) => {
            (field(i).element as HTMLInputElement).value = text;
            await field(i).trigger("input");
            await nextTick();
        };
        const type = async (i: number, text: string) => {
            await keystrokes(i, text);
            await field(i).trigger("change");
            await nextTick();
        };

        // Out of the grammar's domain: refused AT THE FIELD — marked invalid,
        // described by a status line, the model untouched, nothing reprojected.
        await type(1, "500%");
        expect(field(1).attributes("aria-invalid")).toBe("true");
        const describedBy = field(1).attributes("aria-describedby");
        expect(describedBy).toBeDefined();
        expect(wrapper.find(`#${describedBy}`).text()).toContain("500%");
        expect(selectorText(frames[1]!.start as never)).toBe("50%");

        await type(1, "-20%");
        expect(field(1).attributes("aria-invalid")).toBe("true");
        expect(selectorText(frames[1]!.start as never)).toBe("50%");

        // KF-KE-26 — keystrokes alone commit nothing: a valid draft without a
        // `change` leaves the model as it was.
        await keystrokes(1, "25%");
        expect(selectorText(frames[1]!.start as never)).toBe("50%");

        // In the grammar: `from` and `to` are accepted (the scalar grammar
        // refused both), the mark clears, and the write is a WHOLE selector.
        await type(1, "25%");
        expect(field(1).attributes("aria-invalid")).toBeUndefined();
        expect(frames[1]!.start).toEqual({ kind: "percent", value: 0.25 });

        await type(0, "from");
        expect(field(0).attributes("aria-invalid")).toBeUndefined();
        expect(frames[0]!.start).toEqual({ kind: "percent", value: 0 });

        await type(2, "entry 50%");
        expect(field(2).attributes("aria-invalid")).toBeUndefined();
        expect(selectorText(frames[2]!.start as never)).toBe("entry 50%");

        wrapper.unmount();
    });

    it("(3) KF-KE-5: the action cluster is declared above the plate, and only its controls take the pointer", HEAVY, async () => {
        const { animation } = await buildFixture(PERCENT_CSS, "offsets-Cluster");
        const wrapper = await mountEditor(animation);

        const card = wrapper.find("[role='group']");
        const remove = card
            .findAll("button")
            .find((b) =>
                (b.attributes("aria-label") ?? "").startsWith("Remove the keyframe"),
            )!;
        const plate = card.find("pre[contenteditable]");

        // jsdom lays nothing out, so hit-testing is asserted at the layer that
        // decides it: the DECLARED stacking. The cluster is the positioned
        // ancestor of the remove control; it carries the content-plane rung and
        // is itself pointer-transparent, while the row holding the controls
        // re-enables the pointer.
        const cluster = remove.element.closest(".absolute") as HTMLElement | null;
        expect(cluster).not.toBeNull();
        expect(cluster!.classList.contains("z-content")).toBe(true);
        expect(cluster!.classList.contains("pointer-events-none")).toBe(true);
        const row = remove.element.closest(".pointer-events-auto");
        expect(row).not.toBeNull();
        expect(cluster!.contains(row)).toBe(true);

        // The plate is a LATER sibling than the cluster in tree order — the
        // condition under which a positioned z-auto plate painted over it — and
        // it is no longer positioned, so tree order no longer decides.
        expect(
            cluster!.compareDocumentPosition(plate.element) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        expect(plate.classes()).not.toContain("relative");

        // The offset field claims no rung and no dead sticky (KC-25 / KF-KE-41).
        const offset = card.find("input");
        expect(offset.classes()).not.toContain("z-modal");
        expect(offset.classes()).not.toContain("sticky");

        wrapper.unmount();
    });

    /**
     * Clause (4) drives the removal handler at the ENGINE SEAM, twice: jsdom
     * cannot resolve a transform, so the shipped `warpLeft`/`jumpUp` throw
     * INSIDE the draw loop (`.a`'s measurement) — an error vitest reports as
     * unhandled and the group's `play()` never settles on. Both sub-cases hand
     * the handler a group at `AnimationGroup.of`, the one seam it composes the
     * motion through: (4a) one whose `play()` SETTLES (the browser path, made
     * deterministic — a real rAF motion raced against a wall clock is a coin
     * on a loaded runner, which is not the handler's contract); (4b) one whose
     * `play()` never settles, the engine's own headless behaviour, so the
     * budget path executes. The subject in both is the editor's handler,
     * untouched; the presets are still constructed for real.
     */
    it("(4a) KF-KE-7: the removal lands after a motion that settles, and a second press is a no-op", HEAVY, async () => {
        const { animation } = await buildFixture(PERCENT_CSS, "delete-Settles");
        const { AnimationGroup } = await import("@kf-engine").then((m) => m.kfEngine());
        const settling = vi.spyOn(AnimationGroup, "of").mockImplementation(
            () =>
                ({
                    play: () => new Promise<void>((r) => setTimeout(r, 30)),
                }) as never,
        );
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const wrapper = await mountEditor(animation);
            const removes = removeButtons(wrapper);
            expect(removes.length).toBe(3);
            const target = removes[1]!.element as HTMLButtonElement;
            expect(target.disabled).toBe(false);
            target.focus();
            expect(document.activeElement).toBe(target);

            // Two presses inside the busy window remove ONE stop — never two,
            // never a neighbour.
            target.click();
            target.click();
            await vi.waitFor(
                () => {
                    expect(framesOf(animation).length).toBe(2);
                },
                { timeout: 3_000 },
            );
            // Enough time for a second removal to have landed, had one been queued.
            await new Promise((r) => setTimeout(r, 120));
            expect(
                framesOf(animation).map((f) => selectorText(f.start as never)),
            ).toEqual(["0%", "100%"]);
            expect(settling).toHaveBeenCalledTimes(1);
            expect(
                warn.mock.calls.some((args) =>
                    String(args[0]).includes("exit motion did not settle"),
                ),
            ).toBe(false);
            wrapper.unmount();
        } finally {
            settling.mockRestore();
            warn.mockRestore();
        }
    });

    it("(4b) KF-KE-7: a motion that never settles holds the removal for at most its declared length, reported", HEAVY, async () => {
        const { animation } = await buildFixture(PERCENT_CSS, "delete-Hostage");
        const { AnimationGroup } = await import("@kf-engine").then((m) => m.kfEngine());
        const pending = vi
            .spyOn(AnimationGroup, "of")
            .mockImplementation(
                () => ({ play: () => new Promise<void>(() => {}) }) as never,
            );
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const wrapper = await mountEditor(animation);
            const started = performance.now();
            (removeButtons(wrapper)[1]!.element as HTMLButtonElement).click();
            await vi.waitFor(
                () => {
                    expect(framesOf(animation).length).toBe(2);
                },
                { timeout: 4_000 },
            );
            const held = performance.now() - started;
            // Held for about twice the presets' declared 700 ms — never
            // open-endedly.
            expect(held).toBeGreaterThanOrEqual(1_300);
            expect(held).toBeLessThan(3_000);
            expect(
                warn.mock.calls.filter((args) =>
                    String(args[0]).includes("exit motion did not settle"),
                ).length,
            ).toBe(1);
            expect(pending).toHaveBeenCalledTimes(1);
            wrapper.unmount();
        } finally {
            pending.mockRestore();
            warn.mockRestore();
        }
    });

    it("(5) KF-KE-6 + KF-KE-12: two owners share one applied identity; the last owner out clears it", HEAVY, async () => {
        const { animation, target } = await buildFixture(PERCENT_CSS, "shared-Owners");
        const first = await mountEditor(animation);
        const second = await mountEditor(animation);

        // Apply pauses a RUNNING animation (`paused = started`) and the unapply
        // restores whatever it found; the fixture is played first so the
        // restoration is observable rather than vacuous.
        void animation.play();
        await nextTick();
        const pausedBefore = animation.paused;

        // ONE flag: applied from the first owner, read true by the second.
        await applyButton(first).trigger("click");
        await nextTick();
        expect(applyButton(first).attributes("aria-pressed")).toBe("true");
        expect(applyButton(second).attributes("aria-pressed")).toBe("true");
        expect(injectedSheets().length).toBe(1);
        expect(target.classList.length).toBe(1);
        expect(animation.paused).toBe(animation.started);

        // The first owner leaves: the sheet and the class stay for the survivor.
        first.unmount();
        await nextTick();
        expect(injectedSheets().length).toBe(1);
        expect(injectedSheets()[0]!.textContent).toContain("@keyframes");
        expect(target.classList.length).toBe(1);
        expect(applyButton(second).attributes("aria-pressed")).toBe("true");

        // The last owner leaves: `clear()` ran — class gone, sheet gone, pause
        // state restored to what it was before Apply.
        second.unmount();
        await nextTick();
        expect(injectedSheets().length).toBe(0);
        expect(Array.from(target.classList)).toEqual([]);
        expect(animation.paused).toBe(pausedBefore);
        animation.pause();
    });

    it("(6) EE-03 re-regression guard: mounting raises no invalid-watch-source warning", HEAVY, async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const { animation } = await buildFixture(PERCENT_CSS, "watch-Guard");
            const wrapper = await mountEditor(animation);
            const watchWarnings = warn.mock.calls.filter((args) =>
                String(args[0]).includes("Invalid watch source"),
            );
            expect(watchWarnings).toEqual([]);
            wrapper.unmount();
        } finally {
            warn.mockRestore();
        }
    });
});

export { framesOf, removeButtons, selectorText };
