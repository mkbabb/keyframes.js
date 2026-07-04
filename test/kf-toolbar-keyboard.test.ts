/**
 * test/kf-toolbar-keyboard.test.ts — the S.C3b (C-19) T8 interaction-axis gate.
 *
 * S.C3b migrated KeyframesEditor's action bar off the deleted `ui/menubar`
 * shadcn island (the a24-F6 relocate-in-place toolbar). The census clause proves
 * the island is GONE (source-shape); this is the T8 half the census cannot cover
 * — a REAL interaction test that the migrated bar's KEYBOARD/FOCUS behavior
 * survives the remap, exercising `useToolbarKeyboard` (the roving-tabindex core
 * the reka `Menubar` used to supply) the way KeyframesEditor.vue consumes it.
 *
 * It is a genuine interaction test, not a source-shape grep: it mounts a real
 * Vue toolbar host (attached to document.body so jsdom focus + `activeElement`
 * are live), dispatches real `KeyboardEvent`s that bubble to the container's
 * `keydown`, and asserts the roving tab stop, arrow/Home/End navigation with
 * wrap (keyboard + focus), repeat (held-arrow determinism + repeat activation),
 * and the aria-hidden decorative-icon exclusion. The KfPillTabs precedent: the
 * accessible keyboard behavior is verified by driving it, not by inspecting
 * markup. (vitest has no Vue-SFC plugin, so the composable — the actual keyboard
 * code path KeyframesEditor wires — is exercised through a representative host,
 * exactly as the demo mounts it.)
 */
import { afterEach, describe, expect, it } from "vitest";
import { type App, createApp, defineComponent, h, nextTick, ref } from "vue";
import { useToolbarKeyboard } from "@components/custom/keyframes-editor/composables/useToolbarKeyboard";

interface Harness {
    /** The roving cohort — the real (non-aria-hidden) toolbar buttons. */
    buttons: () => HTMLButtonElement[];
    /** Per-item click counters (index-aligned with `buttons()`). */
    clicks: number[];
    /** Dispatch a bubbling keydown from `target` (reaches the container). */
    key: (target: HTMLElement, key: string) => void;
    cleanup: () => void;
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
 * Mount a WAI-ARIA toolbar host wired to `useToolbarKeyboard` with `n` real
 * buttons (optionally preceded by one aria-hidden decorative button, to prove
 * the exclusion), attached to document.body so jsdom focus works.
 */
function mountToolbar(n = 3, opts: { decorative?: boolean } = {}): Harness {
    const clicks = Array<number>(n).fill(0);
    const Host = defineComponent({
        setup() {
            const container = ref<HTMLElement | null>(null);
            const kb = useToolbarKeyboard(() => container.value);
            const setRef = (el: unknown) => {
                container.value = (el as HTMLElement) ?? null;
            };
            return () =>
                h(
                    "div",
                    {
                        ref: setRef,
                        role: "toolbar",
                        "aria-label": "Test toolbar",
                        onKeydown: kb.onKeydown,
                    },
                    [
                        ...(opts.decorative
                            ? [h("button", { "aria-hidden": "true", "data-decorative": "" })]
                            : []),
                        ...Array.from({ length: n }, (_, i) =>
                            h(
                                "button",
                                {
                                    "data-i": i,
                                    onClick: () => {
                                        clicks[i]!++;
                                    },
                                },
                                String.fromCharCode(65 + i),
                            ),
                        ),
                    ],
                );
        },
    });
    const app = createApp(Host);
    const el = document.createElement("div");
    document.body.appendChild(el);
    app.mount(el);
    mounted.push({ app, el });
    return {
        buttons: () =>
            Array.from(
                el.querySelectorAll<HTMLButtonElement>("button:not([aria-hidden='true'])"),
            ),
        clicks,
        key: (target, key) =>
            target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })),
        cleanup: () => {
            app.unmount();
            el.remove();
            mounted = mounted.filter((m) => m.el !== el);
        },
    };
}

/** Flush mount + the composable's queueMicrotask(refresh) seeding. */
async function settle(): Promise<void> {
    await nextTick();
    await Promise.resolve();
}

describe("S.C3b T8 — KeyframesEditor toolbar keyboard (roving tabindex)", () => {
    it("keyboard + focus: one tab stop; arrows/Home/End move focus with wrap", async () => {
        const t = mountToolbar(3);
        await settle();
        const b = t.buttons();
        expect(b).toHaveLength(3);
        // Single tab stop — seated on the first item, the rest removed from Tab.
        expect(b.map((x) => x.tabIndex)).toEqual([0, -1, -1]);

        b[0]!.focus();
        expect(document.activeElement).toBe(b[0]);

        t.key(b[0]!, "ArrowRight");
        expect(document.activeElement).toBe(b[1]);
        // The single tab stop roved WITH focus.
        expect(b.map((x) => x.tabIndex)).toEqual([-1, 0, -1]);

        t.key(b[1]!, "ArrowRight");
        expect(document.activeElement).toBe(b[2]);

        t.key(b[2]!, "ArrowRight"); // wrap forward → first
        expect(document.activeElement).toBe(b[0]);

        t.key(b[0]!, "ArrowLeft"); // wrap backward → last
        expect(document.activeElement).toBe(b[2]);

        t.key(b[2]!, "Home");
        expect(document.activeElement).toBe(b[0]);

        t.key(b[0]!, "End");
        expect(document.activeElement).toBe(b[2]);
    });

    it("repeat: a held ArrowRight roves deterministically on every press", async () => {
        const t = mountToolbar(3);
        await settle();
        const b = t.buttons();
        b[0]!.focus();
        const landed: number[] = [];
        // 5 repeats over a 3-item bar → 1,2,0,1,2 (wraps twice); no drift/stall.
        for (let i = 0; i < 5; i++) {
            t.key(document.activeElement as HTMLElement, "ArrowRight");
            landed.push(b.findIndex((x) => x === document.activeElement));
        }
        expect(landed).toEqual([1, 2, 0, 1, 2]);
    });

    it("activation: a focused item fires on click and RE-fires on repeat", async () => {
        const t = mountToolbar(3);
        await settle();
        const b = t.buttons();
        b[1]!.focus();
        b[1]!.click();
        b[1]!.click(); // repeat activation
        expect(t.clicks[1]).toBe(2);
        expect(t.clicks[0]).toBe(0);
        expect(t.clicks[2]).toBe(0);
    });

    it("focus: aria-hidden decorative icons are excluded from the roving cohort", async () => {
        const t = mountToolbar(2, { decorative: true });
        await settle();
        const real = t.buttons();
        const decorative = document.querySelector<HTMLElement>(
            "button[aria-hidden='true']",
        )!;
        expect(real).toHaveLength(2);
        // The seeded tab stop lands on the first REAL item, never the decorative.
        expect(real[0]!.tabIndex).toBe(0);

        real[0]!.focus();
        for (let i = 0; i < 4; i++) {
            t.key(document.activeElement as HTMLElement, "ArrowRight");
            expect(document.activeElement).not.toBe(decorative);
            expect(real).toContain(document.activeElement);
        }
    });
});
