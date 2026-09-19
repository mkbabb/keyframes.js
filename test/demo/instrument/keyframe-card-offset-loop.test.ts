// SERVED MODEL: claude-opus-5[1m]
/**
 * test/demo/instrument/keyframe-card-offset-loop.test.ts — X.KF.W12.a
 * (CARD-UNIT), the acceptance test of **KF-KC-48**, and the runtime half of
 * **G-KFW12-1**.
 *
 * WHY THIS FILE EXISTS AT ALL. `git grep -c "KeyframeCard" origin/master --
 * test/` returned **0**: the keyframe authoring loop — the demo's primary
 * authoring surface — had no coverage of any kind, in a suite that tests its
 * siblings. KF-KC-48 rules that absence the causal proof of the three blockers
 * this unit cures, and it GATES KF-KC-1. So the gate is the loop, end to end,
 * executed: read the offset, write it back, remove the stop.
 *
 * THE THREE CLAUSES, each the executed form of a cure, each with its bite.
 *
 *   (1) THE READOUT — KC-1. A `from` / `50%` / `to` animation renders each
 *       card's offset through `selectorText`. BITE: bind `.toString()` and the
 *       cards read `[object Object]`; bind FE-3's `startScalar` and the middle
 *       stop reads the bare fraction `0.5` where the commit path demands `50%`,
 *       while a NAMED selector falls back through to `[object Object]` — the
 *       exact half-cure this unit replaced, which is why the named case is
 *       asserted beside the percent ones rather than instead of them.
 *
 *   (2) THE WRITER — KC-2 ≡ KF-KE-2, and the reason its two halves may not be
 *       split. value.js deep-freezes every parse result, so the fixture's
 *       selectors are genuinely frozen (asserted, not assumed: a fixture that
 *       had quietly thawed would make this clause vacuous). A retiming emit
 *       must therefore REPLACE the selector rather than write into it, land in
 *       the `0..100` domain, and carry a fractional step.
 *       BITE (freeze): restore the in-place assignment to the selector's own
 *       `value` property and the handler throws `TypeError` at i=0, the loop
 *       aborts, and the remaining stops never move.
 *       BITE (unit): route the write without `percentSelector` and a drag to
 *       50 writes `50` where the model holds `0.5` — the silent 100x retime;
 *       the assertion is on the SELECTOR, so a fraction/percent confusion in
 *       either direction reds.
 *       BITE (domain): put the rail back on `-10..110 step 1` and both the
 *       declared-domain assertion and the fractional-step case red.
 *
 *   (3) THE REMOVAL — KC-3 ≡ KF-CB-11 + KC-7 + KC-10. The delete affordance is
 *       reachable and operable FROM THE KEYBOARD, which a bare `<svg>` with a
 *       click listener never was. The test activates it the way a keyboard user
 *       does — focus, then the button's own activation — and never by calling
 *       the emit directly, because calling the emit is what a mouse-only
 *       affordance also satisfies.
 *       BITE: return the `<X>` to a bare lucide `<svg>` and there is no
 *       focusable element to find; drop `canRemove` and the last-keyframe floor
 *       stops being expressible in the control.
 *
 * THE PRODUCER SEAM, STATED — the same one `KeyframesAddDialog.test.ts` states
 * and for the same measured reason: `@mkbabb/glass-ui`'s dist imports
 * `@mkbabb/keyframes.js`, a package never installs itself, and vitest's alias
 * cannot reach a specifier originating inside `node_modules`, so loading a
 * producer barrel dies before any assertion. Every glass subpath this tree
 * reaches is therefore stubbed — and only the producer is. The SUBJECTS
 * (`KeyframesEditor.vue`, `KeyframeCardList.vue`, `KeyframeCard.vue`, the
 * keyframe composables and the real engine) are mounted for real, on a real
 * animation whose selectors came out of the real parser.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, markRaw, nextTick } from "vue";
import { mount } from "@vue/test-utils";

/**
 * jsdom implements no `innerText` (`"innerText" in HTMLElement.prototype` →
 * false at this jsdom). The editing host is a `white-space: pre` block, where
 * `innerText` and `textContent` agree byte for byte, so the same `<pre>`-faithful
 * shim the sibling highlight spec installs is installed here, and removed after
 * the file so no other spec inherits it.
 */
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

/**
 * The Slider stub records what the subject DECLARES (domain and step, the two
 * facets KF-KE-2 kills the control on) and re-emits what a drag would emit. It
 * renders nothing interactive, because the assertion is on the subject's
 * handler, never on reka's internals.
 */
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
    setup: (p, { attrs }) =>
        () =>
            h("div", {
                ...attrs,
                "data-stub": "Slider",
                "data-min": String(p.min),
                "data-max": String(p.max),
                "data-step": String(p.step),
                "data-marks": (p.marks ?? []).join(","),
                "data-model": (p.modelValue as number[]).join(","),
            }),
});

/** `LabeledField` hands its default slot the ids the control names itself with. */
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

const inputStub = defineComponent({
    name: "InputStub",
    inheritAttrs: false,
    props: { modelValue: { type: [String, Number], default: "" } },
    emits: ["update:modelValue"],
    setup: (p, { emit, attrs }) =>
        () =>
            h("input", {
                ...attrs,
                value: String(p.modelValue),
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
vi.mock("@mkbabb/glass-ui/forms", () => ({
    Input: inputStub,
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
vi.mock("@mkbabb/glass-ui/dark", () => ({
    useGlobalDark: () => ({ isDark: { value: false } }),
}));
vi.mock("vue-sonner", () => ({
    toast: Object.assign(() => {}, {
        error: () => {},
        success: () => {},
        dismiss: () => {},
    }),
}));

// The warm precedes the subject's IMPORT, not just its mount: the brush
// composable reads `kfEngine()` at module scope, exactly as `main.ts` guarantees
// by awaiting `warmKfEngine()` before `app.mount()`. Warming in a `beforeAll`
// would be a different program from the one that ships.
const { warmKfEngine } = await import("@kf-engine");
await warmKfEngine();

const { selectorText } = await import("@utils/keyframeSelector");
const { importCSSToTimeline, buildAnimationFromTimeline } = await import(
    "@components/instrument/timeline/utils/timelineEngine"
);
const KeyframesEditor = (
    await import("@components/instrument/keyframes/KeyframesEditor.vue")
).default;
const KeyframeCardList = (
    await import(
        "@components/instrument/keyframes/components/KeyframeCardList.vue"
    )
).default;

/**
 * A real three-stop animation whose selectors came out of the real parser — so
 * `templateFrames[i].start` is a genuinely frozen value.js parse result, which
 * is the premise clause (2) turns on.
 */
const buildFixture = async (css: string) => {
    const keyframes = await importCSSToTimeline(css);
    const animation = await buildAnimationFromTimeline(
        { keyframes, captureProperties: [], animationName: "offsets" },
        { duration: 1_000 },
        [],
    );
    // `markRaw`, exactly as the shipped call site marks it
    // (`useSpringKeyframesEditor.ts:57`). The engine keys its compiler state off
    // the animation's own identity, so a reactive proxy over it is a DIFFERENT
    // object and every `templateFrames` read throws. The demo already knows
    // this; the fixture must hand the component the same thing the app does.
    return markRaw(animation);
};

const PERCENT_CSS = `
    @keyframes offsets {
        from { opacity: 0; }
        50% { opacity: 0.5; }
        to { opacity: 1; }
    }
`;

const NAMED_CSS = `
    @keyframes phases {
        entry 50% { opacity: 0; }
        exit 100% { opacity: 1; }
    }
`;

/**
 * The rows the list projects, taken from a real animation.
 *
 * Clause (3) mounts the LIST rather than the editor, and the reason is a
 * measurement, not a convenience. The editor's removal handler awaits a
 * decorative exit choreography before it touches the model
 * (`AnimationGroup.of(presets.warpLeft(), presets.jumpUp()).play()`), and in a
 * headless realm that choreography REJECTS —
 * `BrowserScalarResolutionError: Could not resolve "translateX(0%) rotate(0deg)"`
 * — so `removeKeyframeData` is never reached and the delete is silently
 * dropped. That is KF-KC-27's own third aggravation reproduced verbatim (*"a
 * play() failure silently drops the delete — no catch anywhere on the template
 * chain"*), and ungating the mutation from the animation is KF-KE-7, `.c`'s
 * row at a site outside this unit's `:76-88` card seam. Waiting for a rejection
 * would gate this unit on another unit's cure; asserting it would fail the
 * moment that cure lands. So clause (3) witnesses exactly what it claims —
 * that delete is a reachable, named, keyboard-operable command that DELIVERS —
 * at the seam this unit owns, and the editor-level finding is carried in the
 * receipt for the seat that owns it.
 */
const buildRows = async (css: string) => {
    const animation = await buildFixture(css);
    const frames = (
        animation as unknown as { templateFrames: { start: unknown }[] }
    ).templateFrames;
    return {
        frames,
        frameStrings: frames.map(
            (frame) => `${selectorText(frame.start as never)} { opacity: 1; }`,
        ),
    };
};

const mountList = (frames: unknown[], frameStrings: string[]) =>
    mount(KeyframeCardList, {
        props: { frames, frameStrings },
        attachTo: document.body,
    });

type ListWrapper = ReturnType<typeof mountList>;

const removeButtons = (wrapper: ListWrapper) =>
    wrapper
        .findAll("button")
        .filter((button) =>
            (button.attributes("aria-label") ?? "").startsWith(
                "Remove the keyframe",
            ),
        );

/**
 * The list's OWN live region: the one status region that is not inside a card.
 * Every card mounts a real CopyButton, which carries its own `role="status"`
 * region, so a bare `[role='status']` query returns a card's, not the set's.
 */
const setLevelStatus = (wrapper: ListWrapper) =>
    wrapper
        .findAll("[role='status']")
        .find((region) => region.element.closest("[role='group']") === null);

/** Mount the real editor over a real animation and let its `onMounted` settle. */
const mountEditor = async (animation: unknown) => {
    const wrapper = mount(KeyframesEditor, {
        props: { animation },
        attachTo: document.body,
    });
    await nextTick();
    await vi.waitFor(() => {
        expect(wrapper.findAll("[data-stub='Slider']").length).toBe(1);
    });
    return wrapper;
};

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("KF-KC-48 — the keyframe offset loop, executed end to end", () => {
    it("(1) KC-1: every card reads its offset through the canonical serializer", async () => {
        const animation = await buildFixture(PERCENT_CSS);
        const wrapper = await mountEditor(animation);

        const offsets = wrapper
            .findAll("input")
            .map((input) => (input.element as HTMLInputElement).value);

        expect(offsets).toEqual(["0%", "50%", "100%"]);
        // The two shapes the bypassed serializer produced, named so a
        // regression cannot pass by reading "close enough".
        expect(offsets).not.toContain("[object Object]");
        expect(offsets).not.toContain("0.5");

        wrapper.unmount();
    });

    it("(1) KC-1: a NAMED selector renders as its own text, not as a coerced object", async () => {
        const animation = await buildFixture(NAMED_CSS);
        const wrapper = await mountEditor(animation);

        const offsets = wrapper
            .findAll("input")
            .map((input) => (input.element as HTMLInputElement).value);

        expect(offsets).toEqual(["entry 50%", "exit 100%"]);

        wrapper.unmount();
    });

    it("(1) KC-27: each card is a group named by its offset, never by its index", async () => {
        const animation = await buildFixture(PERCENT_CSS);
        const wrapper = await mountEditor(animation);

        const names = wrapper
            .findAll("[role='group']")
            .map((card) => card.attributes("aria-label"));

        expect(names).toEqual([
            "Keyframe at 0%",
            "Keyframe at 50%",
            "Keyframe at 100%",
        ]);

        wrapper.unmount();
    });

    it("(2) KC-2: the rail declares the grammar's own domain with a fractional step", async () => {
        const animation = await buildFixture(PERCENT_CSS);
        const wrapper = await mountEditor(animation);

        const slider = wrapper.find("[data-stub='Slider']");
        expect(slider.attributes("data-min")).toBe("0");
        expect(slider.attributes("data-max")).toBe("100");
        expect(Number(slider.attributes("data-step"))).toBeLessThan(1);
        expect(Number(slider.attributes("data-step"))).toBeGreaterThan(0);
        // The rail reads the model in the SAME domain it declares.
        expect(slider.attributes("data-model")).toBe("0,50,100");
        expect(slider.attributes("data-marks")).toBe("0,25,50,75,100");
        // KF-KE-34: the control names itself through the producer's own seam.
        expect(slider.attributes("aria-labelledby")).toBe("lf-label");

        wrapper.unmount();
    });

    it("(2) KC-2 ≡ KF-KE-2: a retiming emit REPLACES the frozen selector, in percent", async () => {
        const animation = await buildFixture(PERCENT_CSS);
        const frames = (animation as { templateFrames: { start: unknown }[] })
            .templateFrames;

        // The premise, asserted rather than assumed: these are frozen results.
        expect(frames.map((frame) => Object.isFrozen(frame.start))).toEqual([
            true,
            true,
            true,
        ]);

        const wrapper = await mountEditor(animation);

        // What a drag of the middle thumb to 37.5% emits.
        await wrapper
            .findComponent({ name: "SliderStub" })
            .vm.$emit("update:modelValue", [0, 37.5, 100]);
        await nextTick();

        // The write landed — no TypeError aborted the loop before it — and it
        // landed as a WHOLE selector in the model's own fraction domain.
        expect(frames.map((frame) => selectorText(frame.start as never))).toEqual(
            ["0%", "37.5%", "100%"],
        );
        expect(frames[1]!.start).toEqual({ kind: "percent", value: 0.375 });

        // The stops that did not move were not rewritten, so a neighbouring
        // named stop could not be silently flattened into a percent.
        expect(frames[0]!.start).toEqual({ kind: "percent", value: 0 });

        wrapper.unmount();
    });

    it("(2) KC-2: the surviving frames all move, so no throw aborted the loop", async () => {
        const animation = await buildFixture(PERCENT_CSS);
        const frames = (animation as { templateFrames: { start: unknown }[] })
            .templateFrames;
        const wrapper = await mountEditor(animation);

        await wrapper
            .findComponent({ name: "SliderStub" })
            .vm.$emit("update:modelValue", [10, 60, 90]);
        await nextTick();

        expect(frames.map((frame) => selectorText(frame.start as never))).toEqual(
            ["10%", "60%", "90%"],
        );

        wrapper.unmount();
    });

    it("(3) KC-3 ≡ KF-CB-11: removal is a focusable, named, keyboard-operable command", async () => {
        const { frames, frameStrings } = await buildRows(PERCENT_CSS);
        const wrapper = mountList(frames, frameStrings);

        const removes = removeButtons(wrapper);
        expect(removes.length).toBe(3);
        expect(removes.map((button) => button.attributes("aria-label"))).toEqual([
            "Remove the keyframe at 0%",
            "Remove the keyframe at 50%",
            "Remove the keyframe at 100%",
        ]);

        // A real `<button>`: focusable, enabled, and carrying the native
        // activation semantics Enter and Space invoke. jsdom synthesizes no
        // click from a key event, so the activation itself is invoked directly
        // — what is asserted is that there IS a focusable element to activate,
        // which a bare lucide `<svg>` with a click listener never provided.
        const target = removes[1]!.element as HTMLButtonElement;
        expect(target.tagName).toBe("BUTTON");
        expect(target.disabled).toBe(false);
        target.focus();
        expect(document.activeElement).toBe(target);

        target.click();
        await nextTick();

        // The command is DELIVERED, carrying the stop it belongs to.
        expect(wrapper.emitted("remove")?.length).toBe(1);
        expect(
            (wrapper.emitted("remove")![0]![0] as { index: number }).index,
        ).toBe(1);

        wrapper.unmount();
    });

    it("(3) KC-7: at the last keyframe the command says it is unavailable", async () => {
        const { frames, frameStrings } = await buildRows(`
            @keyframes single {
                from { opacity: 0; }
            }
        `);
        const wrapper = mountList(frames, frameStrings);

        const removes = removeButtons(wrapper);
        expect(removes.length).toBe(1);
        expect((removes[0]!.element as HTMLButtonElement).disabled).toBe(true);

        wrapper.unmount();
    });

    it("(3) KC-10: the removal announces itself and hands focus to a survivor", async () => {
        const { frames, frameStrings } = await buildRows(PERCENT_CSS);
        const wrapper = mountList(frames, frameStrings);

        const live = () => setLevelStatus(wrapper);
        expect(live()).toBeDefined();
        expect(live()!.text()).toBe("");

        (removeButtons(wrapper)[1]!.element as HTMLButtonElement).click();
        await nextTick();

        // What the editor does once the model has actually dropped the stop.
        const survivors = frames.filter((_, i) => i !== 1);
        await wrapper.setProps({
            frames: survivors,
            frameStrings: frameStrings.filter((_, i) => i !== 1),
        });
        await nextTick();
        await nextTick();

        expect(live()!.text()).toBe("Keyframe at 50% removed; 2 remaining.");

        // Focus did not fall to `<body>`: the surviving neighbour's own command
        // has it, which is the whole of KC-10's other half.
        const remaining = removeButtons(wrapper);
        expect(remaining.length).toBe(2);
        expect(document.activeElement).toBe(remaining[1]!.element);

        wrapper.unmount();
    });
});
