/**
 * test/demo/instrument/playback-ribbon-contract.test.ts — G-KFW13-5
 * (X.KF.W13.b · the ribbon: C-2 + KF-CO-15 · D-1 + C-3 + C-4 · the prose pass).
 *
 * Drives the REAL PlaybackRibbon SFC over the REAL glass-ui Slider (the
 * `/slider` subpath loads clean) and a REAL engine animation, and — for the
 * KF-CO-15 edge — the REAL ChannelOptions card whose duration write is the one
 * writer of the rail's scale. PR-CAUTION holds throughout: nothing here swaps
 * the Slider; every assertion reads the primitive's own thumb (`[role=slider]`).
 *
 * Module-seam stubs, exactly where X.KF.W12.b's record placed them: the root
 * barrel reaches the keyframes.js-import wall, so `Button` is a `<button>`
 * host and the card's Card/Select/Separator members are passthroughs (the
 * Slider is the REAL one, re-exported from the clean `/slider` subpath);
 * `/number-field`, `/drawer` and `/easing` are stubbed the way the
 * render-edge gate stubs them (their closures reach the same wall). The
 * AnimationVisualizer (KF.W11's file, `aria-hidden`, not a subject here) is
 * stubbed at its own seam because it imports the root barrel.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref, shallowRef } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { warmKfEngine } from "../../../demo/kf-engine";

const passthrough = (name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup(_props, { slots }) {
            return () => h("div", { "data-stub": name }, slots.default?.());
        },
    });
/** KF.W13U.e — `SelectValue`'s default slot is SCOPED in the producer
 *  (`{ selectedLabel, modelValue }`, glass-ui 7.0.0 `select`), and the options
 *  card's easing trigger now reads it; the stub hands the declared scope (no
 *  selection seated: this gate is about the rail, not the picker). */
const selectValueStub = defineComponent({
    name: "SelectValueStub",
    setup(_props, { slots }) {
        return () =>
            h(
                "span",
                { "data-stub": "SelectValueStub" },
                slots.default?.({ selectedLabel: [], modelValue: undefined }),
            );
    },
});
const buttonHost = defineComponent({
    name: "ButtonHost",
    setup(_props, { slots }) {
        return () => h("button", { type: "button" }, slots.default?.());
    },
});

vi.mock("@mkbabb/glass-ui", async () => {
    const slider =
        await vi.importActual<typeof import("@mkbabb/glass-ui/slider")>("@mkbabb/glass-ui/slider");
    return {
        ...slider,
        Button: buttonHost,
        Card: passthrough("CardStub"),
        CardContent: passthrough("CardContentStub"),
        Select: passthrough("SelectStub"),
        SelectContent: passthrough("SelectContentStub"),
        SelectGroup: passthrough("SelectGroupStub"),
        SelectItem: passthrough("SelectItemStub"),
        SelectLabel: passthrough("SelectLabelStub"),
        SelectSeparator: passthrough("SelectSeparatorStub"),
        SelectTrigger: passthrough("SelectTriggerStub"),
        SelectValue: selectValueStub,
        Separator: passthrough("SeparatorStub"),
        useTouchGate: () => ({
            isActive: ref(false),
            isTouchDevice: false,
            handleScrollCheck: () => {},
            handleTouchEnd: () => {},
            handleTouchStart: () => false,
            suppressDeactivate: () => {},
        }),
    };
});
vi.mock("@mkbabb/glass-ui/number-field", () => ({
    NumberField: defineComponent({
        name: "NumberFieldStub",
        props: {
            modelValue: { type: Number, default: undefined },
            step: { type: Number, default: undefined },
            formatOptions: { type: Object, default: undefined },
            disabled: { type: Boolean, default: false },
            id: { type: String, default: undefined },
        },
        emits: ["update:modelValue"],
        setup(_props, { slots }) {
            return () => h("div", { "data-stub": "NumberField" }, slots.default?.());
        },
    }),
    NumberFieldContent: passthrough("NumberFieldContentStub"),
    NumberFieldDecrement: buttonHost,
    NumberFieldIncrement: buttonHost,
    NumberFieldInput: defineComponent({
        name: "NumberFieldInputStub",
        setup() {
            return () => h("input", { type: "text" });
        },
    }),
}));
vi.mock("@mkbabb/glass-ui/drawer", () => ({
    Drawer: passthrough("DrawerStub"),
    DrawerContent: passthrough("DrawerContentStub"),
    DrawerTitle: passthrough("DrawerTitleStub"),
}));
vi.mock("@mkbabb/glass-ui/easing", () => ({
    EasingPicker: defineComponent({
        name: "EasingPickerStub",
        props: {
            mode: { type: String, default: undefined },
            preset: { type: String, default: undefined },
            steps: { type: Number, default: undefined },
            term: { type: String, default: undefined },
            modelValue: { type: Object, default: undefined },
            playback: { type: Boolean, default: undefined },
            label: { type: String, default: undefined },
            readout: { type: Boolean, default: undefined },
        },
        emits: ["update:modelValue"],
        setup() {
            return () => h("div", { class: "picker-stub" });
        },
    }),
}));
vi.mock("../../../demo/components/playback/AnimationVisualizer.vue", () => ({
    default: defineComponent({
        name: "AnimationVisualizerStub",
        props: { animation: { type: Object, default: undefined }, isPlaying: Boolean },
        setup() {
            return () => h("div", { "data-stub": "AnimationVisualizer", "aria-hidden": "true" });
        },
    }),
}));

const { default: PlaybackRibbon } =
    await import("../../../demo/components/playback/PlaybackRibbon.vue");
type RibbonProps = InstanceType<typeof PlaybackRibbon>["$props"];
const { default: ChannelOptions } =
    await import("../../../demo/components/instrument/transport/channel-controls/ChannelOptions.vue");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

type PointerCaptureSurface = {
    hasPointerCapture?: ((id: number) => boolean) | undefined;
    releasePointerCapture?: ((id: number) => void) | undefined;
    setPointerCapture?: ((id: number) => void) | undefined;
};
const elementProto = Element.prototype as unknown as PointerCaptureSurface;
const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
const savedCapture = {
    has: elementProto.hasPointerCapture,
    release: elementProto.releasePointerCapture,
    set: elementProto.setPointerCapture,
};
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    elementProto.hasPointerCapture = () => false;
    elementProto.releasePointerCapture = () => {};
    elementProto.setPointerCapture = () => {};
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
    elementProto.hasPointerCapture = savedCapture.has;
    elementProto.releasePointerCapture = savedCapture.release;
    elementProto.setPointerCapture = savedCapture.set;
});

let mounted: VueWrapper[] = [];
afterEach(() => {
    for (const w of mounted) w.unmount();
    mounted = [];
});

const SCENE = "gate-kfw13-b";
const DURATION = 5000;

function makeAnimation(duration = DURATION) {
    const a = new CSSKeyframesAnimation({ duration }).fromString(`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    `);
    a.name = "rotate";
    a.superKey = SCENE;
    return a;
}

const settle = async () => {
    await nextTick();
    await nextTick();
};

const thumbOf = (root: ParentNode) => {
    const el = root.querySelector<HTMLElement>('[role="slider"]');
    if (!el) throw new Error("no [role=slider] thumb in the mounted ribbon");
    return el;
};

interface RibbonSeat {
    wrapper: VueWrapper;
    root: HTMLElement;
    anim: ReturnType<typeof makeAnimation>;
    emitted: (name: string) => unknown[][];
    /** Every emit, in order — the pairing witness. */
    sequence: string[];
    setProps: (p: Partial<RibbonProps>) => Promise<void>;
}

/** Mount the ribbon the way the channel mount feeds it: `currentT` is EFFECTIVE ms. */
function mountRibbon(over: Partial<RibbonProps> = {}): RibbonSeat {
    const anim = makeAnimation();
    const props = shallowRef<RibbonProps>({
        animation: anim,
        currentT: 0,
        isAnimPlaying: false,
        isAnimStarted: true,
        userReversed: false,
        ...over,
    });
    const log = new Map<string, unknown[][]>();
    const sequence: string[] = [];
    const listeners: Record<string, (...args: unknown[]) => void> = {};
    for (const name of ["scrubStart", "scrubEnd", "scrubbed", "sliderUpdate", "togglePlay", "toggleReverse"]) {
        const key = `on${name[0]!.toUpperCase()}${name.slice(1)}`;
        listeners[key] = (...args: unknown[]) => {
            sequence.push(name);
            log.set(name, [...(log.get(name) ?? []), args]);
        };
    }
    const Host = defineComponent({
        setup() {
            return () =>
                h(TooltipProvider, null, () => h(PlaybackRibbon, { ...props.value, ...listeners }));
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    mounted.push(wrapper);
    return {
        wrapper,
        root: wrapper.element as HTMLElement,
        anim,
        emitted: (name) => log.get(name) ?? [],
        sequence,
        setProps: async (p) => {
            props.value = { ...props.value, ...p };
            await settle();
        },
    };
}

describe("C-2 — the time-space contract: the ribbon receives and displays EFFECTIVE ms, emits RAW t once-inverted", () => {
    it("under Reverse the thumb displays the effective time it was fed, and a scrub at effective T emits raw duration − T", async () => {
        const seat = mountRibbon({ currentT: 1000, userReversed: true });
        seat.anim.reversed = true;
        await settle();
        const thumb = thumbOf(seat.root);
        expect(thumb.getAttribute("aria-valuenow")).toBe("1000");
        expect(thumb.getAttribute("aria-valuemax")).toBe(String(DURATION));
        const slider = seat.wrapper.findComponent({ name: "Slider" });
        slider.vm.$emit("valueCommit", [1000]);
        await settle();
        const [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
        expect(payload.t).toBe(DURATION - 1000);
        // The signed-seek witness's other half: seating that raw t on the engine
        // reads back the SAME effective time the thumb shows — the ball (which
        // paints from `effectiveT`) and the thumb agree.
        seat.anim.t = payload.t;
        expect(seat.anim.effectiveT).toBe(1000);
    });

    it("forward, no inversion: a scrub at effective T emits raw T", async () => {
        const seat = mountRibbon({ currentT: 250 });
        await settle();
        seat.wrapper.findComponent({ name: "Slider" }).vm.$emit("valueCommit", [250]);
        await settle();
        const [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
        expect(payload.t).toBe(250);
    });

    it("KF-CO-15 (signed seek killed): the rail and the inversion share ONE duration read — with a fresh 2000 scale over a stale 5000 clock no scrub ever emits a negative raw t", async () => {
        const seat = mountRibbon({ userReversed: true, duration: 2000 });
        seat.anim.reversed = true;
        await settle();
        expect(thumbOf(seat.root).getAttribute("aria-valuemax")).toBe("2000");
        const slider = seat.wrapper.findComponent({ name: "Slider" });
        for (const effective of [0, 500, 2000]) {
            slider.vm.$emit("valueCommit", [effective]);
            await settle();
            const [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
            expect(payload.t).toBe(2000 - effective);
            expect(payload.t).toBeGreaterThanOrEqual(0);
        }
    });

    it("KF-CO-15 (the ribbon edge): the published scale re-scales the thumb's max reactively", async () => {
        const seat = mountRibbon({ duration: 5000 });
        await settle();
        expect(thumbOf(seat.root).getAttribute("aria-valuemax")).toBe("5000");
        await seat.setProps({ duration: 2000 });
        expect(thumbOf(seat.root).getAttribute("aria-valuemax")).toBe("2000");
    });
});

describe("KF-CO-15 — the options card's duration write re-scales the teleported rail (LP-1's edge)", () => {
    it("typing a new duration into the card re-scales the ribbon's :max and the engine agrees", async () => {
        const anim = makeAnimation();
        let target = document.getElementById("controls-ribbon-target");
        if (!target) {
            target = document.createElement("div");
            target.id = "controls-ribbon-target";
            document.body.appendChild(target);
        }
        const Host = defineComponent({
            setup() {
                return () =>
                    h(TooltipProvider, null, () =>
                        h(ChannelOptions, {
                            animation: anim,
                            blendAvailable: false,
                            active: true,
                            isPlaying: false,
                        }),
                    );
            },
        });
        const wrapper = mount(Host, { attachTo: document.body });
        mounted.push(wrapper);
        await settle();
        expect(thumbOf(target).getAttribute("aria-valuemax")).toBe(String(DURATION));
        const durationField = wrapper
            .findAllComponents({ name: "LabeledInput" })
            .find((c) => c.props("label") === "duration");
        expect(durationField).toBeDefined();
        durationField!.vm.$emit("update:modelValue", "2s");
        await settle();
        expect(anim.options.duration).toBe(2000);
        expect(thumbOf(target).getAttribute("aria-valuemax")).toBe("2000");
    });
});

const key = (target: Element, k: string) => {
    const e = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    target.dispatchEvent(e);
    return e;
};

describe("D-1 + C-3 + C-4 — named, stepped, keyboard-scrubbable, ON the Slider", () => {
    it("(D-1) the thumb — the sole AT-exposed scrub control — carries an accessible name through the producer's forward", async () => {
        const seat = mountRibbon();
        await settle();
        expect(thumbOf(seat.root).getAttribute("aria-label")).toBe("Scrub animation timeline");
    });

    it("(C-4) an arrow press moves by the declared step — 1 % of the rail (50 ms over 5000), not reka's 1 ms; Page ×10", async () => {
        const seat = mountRibbon({ currentT: 1000 });
        await settle();
        const thumb = thumbOf(seat.root);
        thumb.focus();
        key(thumb, "ArrowRight");
        await settle();
        let [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
        expect(payload.t).toBe(1050);
        await seat.setProps({ currentT: 1050 });
        key(thumb, "PageUp");
        await settle();
        [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
        expect(payload.t).toBe(1550);
    });

    it("(C-3) a keyboard scrub during playback is paired with the pause/resume lifecycle: scrubStart → sliderUpdate → scrubEnd", async () => {
        const seat = mountRibbon({ currentT: 1000, isAnimPlaying: true });
        await settle();
        const thumb = thumbOf(seat.root);
        thumb.focus();
        const mark = seat.sequence.length;
        key(thumb, "ArrowLeft");
        await settle();
        // The commit is bracketed — pause, seat, re-arm, resume — and it is the
        // ONLY seat: reka emits the commit before its live update, and the live
        // update seats only inside a pointer gesture.
        expect(seat.sequence.slice(mark)).toEqual([
            "scrubStart",
            "sliderUpdate",
            "scrubbed",
            "scrubEnd",
        ]);
        const [payload] = seat.emitted("sliderUpdate").at(-1) as [{ t: number }];
        expect(payload.t).toBe(950);
    });
});

describe("D-5 + D-6 + L-M1 — the hint reaches the thumb, disabled is the primitive's, one gate", () => {
    it("(D-5) the thumb is described by the visible-to-AT hint through the producer's aria-describedby forward", async () => {
        const seat = mountRibbon();
        await settle();
        const thumb = thumbOf(seat.root);
        const id = thumb.getAttribute("aria-describedby");
        expect(id).toBeTruthy();
        const hint = seat.root.querySelector(`[id="${id}"]`);
        expect(hint?.textContent?.trim()).toMatch(/arrow keys/);
    });

    it("(D-6 → OA-29, KF.W13U.t) before the animation starts the rail is LIVE — in the tab order, not disabled, not costumed, and a keyboard step seats the playhead", async () => {
        // Superseded contract: D-6 disabled the thumb until the animation
        // started (`:disabled="!isAnimStarted"`), which left the timeline
        // greyed and inert on every scene until Play (the owner's OA-29). The
        // scrub seat is lifecycle-free, so a never-started animation scrubs.
        const seat = mountRibbon({ isAnimStarted: false, currentT: 1000 });
        await settle();
        const thumb = thumbOf(seat.root);
        expect(thumb.getAttribute("tabindex")).toBe("0");
        expect(thumb.hasAttribute("data-disabled")).toBe(false);
        expect(seat.root.querySelector(".glass-slider[data-disabled]")).toBeNull();
        expect(seat.root.querySelector(".is-disabled")).toBeNull();
        key(thumb, "ArrowRight");
        await settle();
        expect(seat.emitted("sliderUpdate")).toHaveLength(1);
        expect(seat.sequence).toEqual(["scrubStart", "sliderUpdate", "scrubbed", "scrubEnd"]);
    });

    it("(L-M1) the wrapper runs no gate of its own: a primary mouse press arms the drag seam directly (scrubStart)", async () => {
        const seat = mountRibbon();
        await settle();
        const wrapper = seat.root.querySelector<HTMLElement>(".timeline-green, .scrub-rail")!;
        wrapper.dispatchEvent(
            new PointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse", isPrimary: true, button: 0, bubbles: true }),
        );
        expect(seat.emitted("scrubStart")).toHaveLength(1);
        window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, pointerType: "mouse", isPrimary: true, bubbles: true }));
        expect(seat.emitted("scrubEnd")).toHaveLength(1);
    });
});

describe("D-2 — a visible playhead on the primitive's declared axis", () => {
    it("the rail is the Slider's `spectrum` variant (a painted thumb), still scaled and named as before", async () => {
        const seat = mountRibbon({ currentT: 2500 });
        await settle();
        const root = seat.root.querySelector<HTMLElement>(".glass-slider");
        expect(root?.getAttribute("data-variant")).toBe("spectrum");
        const thumb = thumbOf(seat.root);
        expect(thumb.getAttribute("aria-valuenow")).toBe("2500");
        expect(thumb.getAttribute("aria-label")).toBe("Scrub animation timeline");
    });
});

describe("D-20 / D-25 — the five false load-bearing comments are gone; the rail carries its true name", () => {
    it("the SFC no longer asserts what the tree contradicts", async () => {
        const { readFileSync } = await import("node:fs");
        const { resolve } = await import("node:path");
        const src = readFileSync(
            resolve(process.cwd(), "demo/components/playback/PlaybackRibbon.vue"),
            "utf8",
        );
        for (const falsehood of [
            "red range fill",
            "the thumb keeps its variant size",
            "Non-scoped global rules",
            "glass-ui 4.0.0",
            "which glass-ui's Slider does NOT provide",
        ]) {
            expect(src, falsehood).not.toContain(falsehood);
        }
        expect(src).not.toContain("timeline-green");
        expect(src).not.toContain('ref="sliderRef"');
    });
});

/**
 * G-KFW9-9 / K-5 — the two-deletion act (X.KF.W13.c), as a contract.
 *
 * The affordance this act protects cannot be read from jsdom: `forced-colors`
 * is a UA mode no test environment paints, and the producer `Button` is stubbed
 * at this file's seam (the keyframes.js-import wall, KF13-E2). So the case
 * asserts the three REAL bytes the affordance is made of — the subject's class
 * list from the mounted SFC, the producer's shipped rules from the installed
 * package (read-only), and the demo's own sheets — and it fails the moment any
 * of them stops holding. It is NOT a screenshot: the AFTER witness is KF.W9 /
 * SS-13's to re-shoot (S-9), handed back by row id.
 */
type CssVisit = (selector: string, body: string, atRules: string[]) => void;
const walkCss = (css: string, visit: CssVisit): void => {
    const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const stack: string[] = [];
    let head = "";
    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        if (ch === "{") {
            const label = head.trim();
            head = "";
            if (label.startsWith("@")) {
                stack.push(label);
                continue;
            }
            let depth = 1;
            let body = "";
            i++;
            while (i < src.length) {
                const c = src[i];
                if (c === "{") depth++;
                else if (c === "}") {
                    depth--;
                    if (depth === 0) break;
                }
                body += c;
                i++;
            }
            visit(label, body, [...stack]);
        } else if (ch === "}") {
            stack.pop();
            head = "";
        } else {
            head += ch;
        }
    }
};
const readRepo = async (path: string): Promise<string> => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    return readFileSync(resolve(process.cwd(), path), "utf8");
};
const GLASS_DIST = "node_modules/@mkbabb/glass-ui/dist";

describe("G-KFW9-9 / K-5 — the focus affordance survives the two-deletion act", () => {
    it("a focused Play button carries a forced-colors indicator, and no demo-owned unlayered rule defeats it", async () => {
        const seat = mountRibbon();
        await settle();

        // (i) the subject: the ribbon's Play cell is a producer `Button` wearing
        //     the demo's `.btn-playback` skin — the rule's own census, live.
        const play = seat.root.querySelector<HTMLElement>(".btn-playback-accent")!;
        expect(play).not.toBeNull();
        expect(play.tagName).toBe("BUTTON");
        expect(play.classList.contains("btn-playback")).toBe(true);

        // (ii) the indicator's real source: every glass `Button` renders
        //      `focus-ring` itself, the producer realizes that class in
        //      `@layer components`, and its UNLAYERED forced-colors override
        //      restores a system outline for it.
        const buttonEntry = await readRepo(`${GLASS_DIST}/button.js`);
        const chunk = buttonEntry.match(/from\s*"\.\/([^"]+)"/)?.[1];
        expect(chunk, "the Button entry re-exports a chunk").toBeTruthy();
        expect(await readRepo(`${GLASS_DIST}/${chunk}`)).toMatch(/"[^"]*\bfocus-ring\b[^"]*"/);
        expect(await readRepo(`${GLASS_DIST}/styles/utilities/base.css`)).toMatch(
            /\.focus-ring:focus-visible\s*\{[^}]*box-shadow:\s*var\(--focus-ring-shadow\)/,
        );
        const a11y = await readRepo(`${GLASS_DIST}/styles/utilities/a11y-overrides.css`);
        expect(a11y).toMatch(/@media \(forced-colors: active\)[\s\S]*?\.focus-ring:focus-visible/);
        expect(a11y).toMatch(/outline:\s*2px solid Highlight/);

        // (iii) the defect this act removes: a demo-owned `:focus-visible` rule
        //       over the same host, unlayered and later in the cascade, whose
        //       `outline: none` erases (ii) — with no parity of its own.
        const defeaters: string[] = [];
        for (const sheet of ["demo/styles/playback-idiom.css", "demo/styles/design-idioms.css"]) {
            walkCss(await readRepo(sheet), (selector, body, atRules) => {
                if (!/\.btn-playback/.test(selector) || !/:focus-visible/.test(selector)) return;
                if (atRules.some((rule) => /forced-colors/.test(rule))) return;
                if (/outline\s*:\s*none/.test(body)) defeaters.push(`${sheet} — ${selector.trim()}`);
            });
        }
        expect(defeaters).toEqual([]);
    });

    it("the counterpart keeps BOTH arms: the act deleted nothing KF.W6 ruled load-bearing", async () => {
        const design = await readRepo("demo/styles/design-idioms.css");
        let ordinary = false;
        let forcedColors = false;
        walkCss(design, (selector, body, atRules) => {
            if (!/\.kf-focus-ring:focus-visible/.test(selector)) return;
            if (atRules.some((rule) => /forced-colors/.test(rule))) {
                if (/outline:\s*2px solid Highlight/.test(body)) forcedColors = true;
            } else if (/box-shadow:\s*var\(--focus-ring-shadow\)/.test(body)) {
                ordinary = true;
            }
        });
        expect({ ordinary, forcedColors }).toEqual({ ordinary: true, forcedColors: true });
        expect(design).toContain("G-KFW9-9");
    });
});

/**
 * X.KF.W13T.e · OA-10 (§0ao.1) — the ball preview's inline hide toggle. The
 * toggle is the producer Button in its pressed form (`aria-pressed`, one
 * stable name), offered only where the mount binds `preview`; hidden is
 * ABSENT (the twin leaves the DOM and the tree).
 */
describe("OA-10 — the ball preview hides behind an inline pressed toggle", () => {
    const toggleOf = (root: ParentNode) =>
        root.querySelector<HTMLButtonElement>('button[aria-label="Hide ball preview"]');
    const previewOf = (root: ParentNode) =>
        root.querySelector('[data-stub="AnimationVisualizer"]');

    it("an unbound ribbon (every mount but easing) offers no toggle and keeps its preview", async () => {
        const seat = mountRibbon();
        await settle();
        expect(toggleOf(seat.root)).toBeNull();
        expect(previewOf(seat.root)).not.toBeNull();
    });

    it("a bound ribbon: pressed=false shows the preview; a press asks to hide; hidden removes the twin", async () => {
        const asked: string[] = [];
        const seat = mountRibbon({
            preview: "shown",
            "onUpdate:preview": (next: "shown" | "hidden") => {
                asked.push(next);
            },
        });
        await settle();
        const toggle = toggleOf(seat.root)!;
        expect(toggle.getAttribute("aria-pressed")).toBe("false");
        expect(previewOf(seat.root)).not.toBeNull();
        toggle.click();
        expect(asked).toEqual(["hidden"]);
        await seat.setProps({ preview: "hidden" });
        expect(toggleOf(seat.root)!.getAttribute("aria-pressed")).toBe("true");
        expect(previewOf(seat.root)).toBeNull();
        await seat.setProps({ preview: "shown" });
        expect(previewOf(seat.root)).not.toBeNull();
    });
});

/**
 * X.KF.W13T.e · OA-8 (§0ao.1) — the styling limb.
 */
describe("OA-8 — the scrub rail wears the producer Slider's own paint", () => {
    it("the SFC authors no `--slider-*` override (no raw thumb, no colour-mix groove)", async () => {
        const { readFileSync } = await import("node:fs");
        const { resolve } = await import("node:path");
        const src = readFileSync(
            resolve(process.cwd(), "demo/components/playback/PlaybackRibbon.vue"),
            "utf8",
        );
        expect(src).not.toMatch(/--slider-[a-z-]+\s*:/);
        expect(src).not.toContain("<style");
    });
});
