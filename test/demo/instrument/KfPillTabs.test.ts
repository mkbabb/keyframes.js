/**
 * The control-strip INTERACTION-AXIS gate — MIGRATED, not deleted (KF.W6 S-1 /
 * KPT-SUP-4).
 *
 * WHAT CHANGED. The gate was written against `useKfPillTabs`, the kf-internal
 * roving-tabindex core behind `KfPillTabs.vue`. That fork existed because
 * glass-ui 4.0.1's `SegmentedTabs` emitted `aria-orientation` unconditionally on
 * a `role=group`; the strip it drove was then rendered behind a `v-if` that the
 * App holds permanently false, so it shipped dead. KF.W6 deletes the fork and
 * the strip. The KEYBOARD CONTRACT does not die with them: at the installed
 * glass-ui 7.0.0 the same roving machine is PUBLISHED as `useSelectionGroup` on
 * the `./motion-core` subpath (it composes `useTabRovingFocus` verbatim), and
 * that is the seam this gate now drives. `useTabRovingFocus` itself is a private
 * hashed chunk with no published entry — a deep import into `dist/` is a defect,
 * never a migration target.
 *
 * WHAT A SOURCE-SHAPE GATE CANNOT COVER, and is why this is a REAL interaction
 * test: it mounts a representative `role=tablist` host wired exactly as a
 * consumer wires the published engine (options + model + containerRef +
 * index-aligned buttonRefs), attaches it to document.body so jsdom focus and
 * `activeElement` are LIVE, dispatches real `KeyboardEvent`s, and asserts that
 * arrow/Home/End move FOCUS and SELECTION together across >=3 tabs (the third
 * tab reachable), with wrap, disabled-skip, and an empty-`modelValue` tab stop.
 *
 * BITE: bind `:tabindex="0"` on every item instead of `rovingTabindex(idx)` ->
 * the exactly-one-tabstop assertions red; drop the strip-root `@keydown` wire ->
 * every traversal assertion reds.
 *
 * THE FIVE THINGS THE MIGRATION WAS ORDERED TO CARRY (KPT-SUP-4), each stated
 * where it lands:
 *
 *  (i) `rovingValue`'s four-line contract — "the single tab stop is the SELECTED
 *      enabled tab, or, when the model matches nothing enabled, the FIRST
 *      enabled tab, so the strip is never Tab-unreachable". PRESERVED: the
 *      published engine resolves `activeIndex` the same way, and cases 1, 5 and
 *      7 below assert all three limbs.
 *
 *  (ii) L:D-14's host-shape criterion — the fork's `focusTab` walked
 *      `list.children` and matched `dataset.value`, an undocumented FLAT-host
 *      requirement that nesting a button inside a wrapper would have broken
 *      silently. REPLACED DELIBERATELY: the published engine focuses through the
 *      caller's index-aligned `buttonRefs` and never reads the DOM tree shape,
 *      so the criterion is retired rather than carried. Case 8 pins the
 *      replacement by mounting a NESTED host — the exact shape the fork could
 *      not serve.
 *
 *  (iii) D:D-21's forced-colors reservation (`border: 2px solid transparent` at
 *      rest, so a forced-colors/prefers-contrast indicator cannot grow the box
 *      by 4px on activation) — a PAINT criterion on a mounted successor strip.
 *      KF.W6 mounts no successor (S-1 is DELETE, not replace), so it is carried
 *      HERE IN WRITING as the acceptance criterion any future strip inherits,
 *      not as an assertion over a fixture's own stylesheet.
 *
 *  (iv) missed-M6's untested click path — the fork guarded its selection in two
 *      places and the pointer branch was the untested one. The published engine
 *      has ONE guarded `select`, and case 9 drives the POINTER path through it
 *      (including the disabled refusal) so the branch is no longer untested.
 *
 *  (v) the getter-thunk composable-params idiom — the fork took `() => options`
 *      thunks. REPLACED DELIBERATELY: the published engine takes `ComputedRef`s
 *      and a caller-owned model `Ref` (no shadow registry), which is the same
 *      "the caller owns the source, the engine reads it live" property expressed
 *      in Vue's own vocabulary; the harness below uses them directly.
 *
 * FILE NAME: retained at its §Bounds path. KF.W6's grant on this file is
 * "modify (migrate)", never a move; the rename onto the seam it now drives is
 * declared, not taken here.
 */
import { afterEach, beforeAll, afterAll, describe, expect, it } from "vitest";
import {
    type App,
    computed,
    createApp,
    defineComponent,
    h,
    nextTick,
    ref,
} from "vue";
import { useSelectionGroup } from "@mkbabb/glass-ui/motion-core";

/** The minimal option shape the published engine reads (`value` + `disabled`). */
interface StripOption {
    label: string;
    value: string;
    disabled?: boolean;
}

// ── jsdom gaps the engine touches, stubbed at the harness boundary ───────────
// jsdom ships no ResizeObserver (the same gap `resize-tracks.test.ts` polyfills)
// and no `Element.prototype.scrollIntoView`. The engine observes the container
// for its indicator measure and recenters the selected item on every select;
// with no indicator element the measure no-ops, but both symbols must EXIST.
// These are environment gaps, never a guard around a defect.
const savedRO = (globalThis as any).ResizeObserver;
const savedScrollIntoView = (Element.prototype as any).scrollIntoView;

beforeAll(() => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as any).ResizeObserver = NoopResizeObserver;
    (window as any).ResizeObserver = NoopResizeObserver;
    (Element.prototype as any).scrollIntoView = function scrollIntoView() {};
});

afterAll(() => {
    (globalThis as any).ResizeObserver = savedRO;
    (window as any).ResizeObserver = savedRO;
    (Element.prototype as any).scrollIntoView = savedScrollIntoView;
});

interface Harness {
    /** The rendered tab buttons, in DOM order. */
    tabs: () => HTMLButtonElement[];
    /** The tab whose value is currently the model selection. */
    selected: () => string;
    /** `data-value` of the focused tab, or null. */
    focusedValue: () => string | null;
    /** Dispatch a bubbling keydown from the currently-focused tab. */
    press: (key: string) => Promise<void>;
    /** Focus the tab with the given value (simulate Tab-into + click focus). */
    focus: (value: string) => void;
    /** Click the tab with the given value (the POINTER path — missed-M6). */
    click: (value: string) => Promise<void>;
    /** The roving tabindex the engine assigns each rendered tab, in DOM order. */
    tabIndices: () => number[];
}

let mounted: Array<{ app: App; el: HTMLElement }> = [];

afterEach(() => {
    for (const m of mounted) {
        m.app.unmount();
        m.el.remove();
    }
    mounted = [];
});

/**
 * Mount a representative tablist over the PUBLISHED engine.
 *
 * `nested` wraps each button in a `<span>` — the host shape the retired
 * `focusTab` could not serve (L:D-14). The engine focuses through `buttonRefs`,
 * so the strip behaves identically flat or nested; that is the assertion.
 */
function mountTablist(
    options: StripOption[],
    initial: string,
    orientation: "horizontal" | "vertical" = "horizontal",
    nested = false,
): Harness {
    const model = ref<string | string[] | undefined>(initial);
    const Host = defineComponent({
        setup() {
            const containerRef = ref<HTMLElement | null>(null);
            const buttonRefs = ref<HTMLElement[]>([]);
            const group = useSelectionGroup<StripOption>({
                options: computed(() => options),
                model,
                role: "tablist",
                vertical: computed(() => orientation === "vertical"),
                containerRef,
                buttonRefs,
            });
            const button = (opt: StripOption, idx: number) =>
                h(
                    "button",
                    {
                        ref: (el: any) => {
                            if (el) buttonRefs.value[idx] = el as HTMLElement;
                        },
                        type: "button",
                        "data-value": opt.value,
                        disabled: opt.disabled,
                        tabindex: group.rovingTabindex(idx),
                        onClick: () => group.select(opt.value, idx),
                        ...group.itemAttrs(opt.value),
                    },
                    opt.label,
                );
            return () =>
                h(
                    "div",
                    {
                        ref: (el: any) => {
                            containerRef.value = (el as HTMLElement) ?? null;
                        },
                        role: "tablist",
                        "aria-orientation": orientation,
                        onKeydown: group.onKeydown,
                    },
                    options.map((opt, idx) =>
                        nested
                            ? h("span", { class: "tab-wrapper" }, [button(opt, idx)])
                            : button(opt, idx),
                    ),
                );
        },
    });
    const app = createApp(Host);
    const el = document.createElement("div");
    document.body.appendChild(el);
    app.mount(el);
    mounted.push({ app, el });

    const tabs = () =>
        Array.from(el.querySelectorAll<HTMLButtonElement>("[role=tab]"));
    const byValue = (value: string) =>
        tabs().find((b) => b.dataset.value === value);
    return {
        tabs,
        selected: () => String(model.value ?? ""),
        focusedValue: () =>
            (document.activeElement as HTMLElement | null)?.dataset.value ?? null,
        press: async (key) => {
            (document.activeElement ?? el).dispatchEvent(
                new KeyboardEvent("keydown", { key, bubbles: true }),
            );
            await nextTick();
        },
        focus: (value) => byValue(value)?.focus(),
        click: async (value) => {
            byValue(value)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            await nextTick();
        },
        tabIndices: () => tabs().map((b) => b.tabIndex),
    };
}

const OPTS: StripOption[] = [
    { label: "Controls", value: "controls" },
    { label: "Keyframes", value: "keyframes" },
    { label: "Timeline", value: "timeline" },
];

describe("control strip — roving-tabindex keyboard traversal on the published glass-ui engine (a12 F1)", () => {
    it("the single tab stop is the selected tab (tabindex 0)", () => {
        const h = mountTablist(OPTS, "controls");
        expect(h.tabIndices()).toEqual([0, -1, -1]);
    });

    it("ArrowRight moves BOTH focus and selection — the 3rd tab is reachable", async () => {
        const h = mountTablist(OPTS, "controls");
        h.focus("controls");
        expect(h.focusedValue()).toBe("controls");

        await h.press("ArrowRight");
        expect(h.selected()).toBe("keyframes");
        expect(h.focusedValue()).toBe("keyframes"); // focus FOLLOWED selection

        // The a12 F1 bug: focus stayed on tab 1, so this second hop was
        // unreachable. The published engine moves focus through buttonRefs.
        await h.press("ArrowRight");
        expect(h.selected()).toBe("timeline");
        expect(h.focusedValue()).toBe("timeline"); // the THIRD tab, reached
    });

    it("wraps at both ends", async () => {
        const h = mountTablist(OPTS, "timeline");
        h.focus("timeline");
        await h.press("ArrowRight"); // wrap forward → first
        expect(h.focusedValue()).toBe("controls");
        await h.press("ArrowLeft"); // wrap back → last
        expect(h.focusedValue()).toBe("timeline");
    });

    it("Home/End jump to the first/last tab", async () => {
        const h = mountTablist(OPTS, "keyframes");
        h.focus("keyframes");
        await h.press("End");
        expect(h.focusedValue()).toBe("timeline");
        expect(h.selected()).toBe("timeline");
        await h.press("Home");
        expect(h.focusedValue()).toBe("controls");
        expect(h.selected()).toBe("controls");
    });

    it("skips a disabled tab", async () => {
        const opts: StripOption[] = [
            { label: "A", value: "a" },
            { label: "B", value: "b", disabled: true },
            { label: "C", value: "c" },
        ];
        const h = mountTablist(opts, "a");
        h.focus("a");
        await h.press("ArrowRight");
        expect(h.focusedValue()).toBe("c"); // B skipped
        expect(h.selected()).toBe("c");
    });

    it("a vertical strip navigates on ArrowUp/ArrowDown", async () => {
        const h = mountTablist(OPTS, "controls", "vertical");
        h.focus("controls");
        await h.press("ArrowDown");
        expect(h.focusedValue()).toBe("keyframes");
        await h.press("ArrowUp");
        expect(h.focusedValue()).toBe("controls");
    });

    it("empty/unmatched modelValue still leaves a tab stop (Tab-reachable)", () => {
        const h = mountTablist(OPTS, "");
        // No selection matches → the FIRST ENABLED tab holds the roving 0 stop
        // (the fallback limb of the four-line contract the migration carries).
        expect(h.tabIndices()).toEqual([0, -1, -1]);
        expect(h.tabs().some((b) => b.tabIndex === 0)).toBe(true);
    });

    // ── L:D-14, carried as its deliberate REPLACEMENT ────────────────────────
    it("traverses a NESTED host — the flat-`children` host shape is retired", async () => {
        const h = mountTablist(OPTS, "controls", "horizontal", true);
        // Each button sits inside a wrapper span: the retired `focusTab` read
        // `list.children` and would have found nothing to focus here.
        expect(h.tabs()[0]!.parentElement!.tagName).toBe("SPAN");
        h.focus("controls");
        await h.press("ArrowRight");
        expect(h.selected()).toBe("keyframes");
        expect(h.focusedValue()).toBe("keyframes");
    });

    // ── missed-M6, the untested POINTER branch, through the ONE guarded select ─
    it("the click path selects through the same guard, and a disabled tab refuses", async () => {
        const opts: StripOption[] = [
            { label: "A", value: "a" },
            { label: "B", value: "b", disabled: true },
            { label: "C", value: "c" },
        ];
        const h = mountTablist(opts, "a");

        await h.click("c");
        expect(h.selected()).toBe("c");
        expect(h.tabIndices()).toEqual([-1, -1, 0]); // the stop followed the pick

        await h.click("b"); // disabled → the ONE guard refuses
        expect(h.selected()).toBe("c");
        expect(h.tabs()[1]!.getAttribute("aria-selected")).toBe("false");
    });
});
