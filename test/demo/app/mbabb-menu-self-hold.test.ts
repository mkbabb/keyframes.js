/**
 * G-KFW13-1 — the round-trip is gone AND the menu still opens.
 *
 * M-4's cure is a DELETION (the `itemsPopupOpen` five-site round-trip) whose
 * worded form would also take `MbabbMenu`'s own `v-model:open` with it. The
 * registry raised MM-28 to a MUST-CARRY rider on exactly that point: with
 * glass-ui's `open` prop Boolean-cast, an unbound primitive is permanently
 * CONTROLLED and never toggles itself — "executed as worded, the menu becomes
 * permanently unopenable", and a byte-only check cannot see it.
 *
 * So this file is the RUNTIME clause, not a grep: the real `MbabbMenu` is
 * mounted as slot content of a real `GlassDock`, its real trigger is activated,
 * and the assertions are that the content renders, that the dock is HELD while
 * it is up, that the hold is released when it closes, and that no hold leaks
 * when the menu unmounts open.
 *
 * Nothing is stubbed but jsdom's absent `ResizeObserver` (the repo's standing
 * polyfill idiom) and `window.matchMedia`, which the dark-mode toggle reads at
 * setup. The producer is the installed `@mkbabb/glass-ui` 7.0.0 — reachable at
 * all because `vitest.config.ts` inlines it (KF13-E2, COHESION §0ai).
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { GlassDock } from "@mkbabb/glass-ui/dock";
import MbabbMenu from "@app/dock/MbabbMenu.vue";
import ChromeDock from "@app/dock/ChromeDock.vue";

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown })
    .ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (
            query: string,
        ) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent: () => false,
        });
    }
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
});

/** App.vue's shape exactly: the menu is authored by the PARENT and handed to a
 *  dock as slot content, so only the runtime parent chain can resolve the
 *  provider its self-hold injects. */
const Host = defineComponent({
    name: "MenuHost",
    components: { GlassDock, MbabbMenu },
    props: { menuMounted: { type: Boolean, default: true } },
    template: `
        <GlassDock ref="dockRef" collapse="open">
            <MbabbMenu v-if="menuMounted" :on-scene-restore="noop" />
        </GlassDock>
    `,
    setup() {
        return { noop: () => {} };
    },
});

function mountHost() {
    const wrapper = mount(Host, { attachTo: document.body });
    const dock = wrapper.findComponent(GlassDock);
    return { wrapper, dock };
}

/** The menu content is PORTALLED to `document.body` by reka, so it is never in
 *  the wrapper's own subtree. The destructive row's label is the one string no
 *  other demo surface in this mount renders. */
function menuIsOpen(): boolean {
    return document.body.textContent?.includes("Clear all") ?? false;
}

/** The producer's `DockTrigger` actuates on `pointerdown` (the D9 synthesis),
 *  so the gesture is dispatched as the browser sends it — a real
 *  `PointerEvent` on the real trigger element, not a `.vm` write. */
async function activate(trigger: { element: Element }): Promise<void> {
    const init = { bubbles: true, cancelable: true, button: 0 };
    trigger.element.dispatchEvent(new window.PointerEvent("pointerdown", init));
    trigger.element.dispatchEvent(new window.PointerEvent("pointerup", init));
    // A pointer-originated click carries its click count (`detail: 1`); a
    // `detail: 0` click is the keyboard-synthesised one, which the producer's
    // trigger deliberately lets through as a second toggle.
    trigger.element.dispatchEvent(
        new window.MouseEvent("click", { ...init, detail: 1 }),
    );
    await nextTick();
    await nextTick();
}

describe("G-KFW13-1 — the MUST-CARRY rider, proven at runtime", () => {
    it("(1) the menu OPENS on trigger activation and its content renders", async () => {
        const { wrapper } = mountHost();
        expect(menuIsOpen()).toBe(false);

        const trigger = wrapper.find('[aria-label="@mbabb menu"]');
        expect(trigger.exists()).toBe(true);

        await activate(trigger);

        // The rider's whole point: this is what a commit that deleted
        // `v-model:open` along with the round-trip would fail, invisibly.
        expect(menuIsOpen()).toBe(true);

        wrapper.unmount();
    });
});

describe("G-KFW13-1 — the dock is held by the MENU, not by a prop from the App", () => {
    it("(2) opening takes the dock's keep-open hold; closing releases it", async () => {
        const { wrapper, dock } = mountHost();
        expect(dock.vm.isHeld).toBe(false);

        const trigger = wrapper.find('[aria-label="@mbabb menu"]');
        await activate(trigger);
        expect(menuIsOpen()).toBe(true);

        // The hold arrives through `useOptionalDockContext()` inside
        // MbabbMenu — no `itemsPopupOpen` prop, no App-level ref, nothing
        // travelling up and back down.
        expect(dock.vm.isHeld).toBe(true);

        document.dispatchEvent(
            new window.KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
            }),
        );
        // reka's dismissable layer settles the close a macrotask after the
        // keydown (measured: still `data-state="open"` two ticks later, gone
        // within one 16 ms frame), so the close is awaited, not assumed. The
        // assertion is unchanged: the menu MUST close and the hold MUST go.
        await vi.waitFor(() => expect(menuIsOpen()).toBe(false));
        expect(dock.vm.isHeld).toBe(false);

        wrapper.unmount();
    });

    it("(3) the hold survives the collapse the dock would otherwise run, then lets it through", async () => {
        // Only the timer queue is faked. Faking `Date` as well would freeze
        // Vue's event-invoker guard (`runtime-dom` drops an event whose `_vts`
        // stamp is <= the time its listener was attached, both read from
        // `Date.now()`), so the trigger's capture-phase `pointerdown` would be
        // silently ignored and the menu would never open — a harness artefact,
        // not the product's behaviour.
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        try {
            const { wrapper, dock } = mountHost();
            const trigger = wrapper.find('[aria-label="@mbabb menu"]');
            await activate(trigger);
            expect(dock.vm.isHeld).toBe(true);

            vi.advanceTimersByTime(4_000);
            await nextTick();
            expect(dock.vm.expanded).toBe(true);

            document.dispatchEvent(
                new window.KeyboardEvent("keydown", {
                    key: "Escape",
                    bubbles: true,
                    cancelable: true,
                }),
            );
            await nextTick();
            await nextTick();
            expect(dock.vm.isHeld).toBe(false);
            // glass 10.0.1: the release grace (800 ms) then the one idle
            // window (3600 ms) — 4400 ms to the collapse.
            vi.advanceTimersByTime(5_000);
            await nextTick();
            expect(dock.vm.expanded).toBe(false);

            wrapper.unmount();
        } finally {
            vi.useRealTimers();
        }
    });

    it("(4) a menu unmounted while OPEN leaks no hold (i-2's unpaired release, inverted)", async () => {
        const { wrapper, dock } = mountHost();
        const trigger = wrapper.find('[aria-label="@mbabb menu"]');
        await activate(trigger);
        expect(dock.vm.isHeld).toBe(true);

        // A scene swap under an open dropdown. The old round-trip had no
        // teardown at all; the counter would have stayed above zero forever.
        // Unmounted the way the product unmounts it — the parent's `v-if`
        // drops the slot child while the dock stays up.
        await wrapper.setProps({ menuMounted: false });
        await nextTick();
        expect(wrapper.findComponent(MbabbMenu).exists()).toBe(false);
        expect(dock.vm.isHeld).toBe(false);

        wrapper.unmount();
    });
});

describe("G-KFW13-1 — the round-trip's other end is gone from the type", () => {
    it("(5) ChromeDock declares no `itemsPopupOpen` prop", () => {
        const declared = Object.keys(
            (ChromeDock as { props?: Record<string, unknown> }).props ?? {},
        );
        expect(declared.length).toBeGreaterThan(0);
        expect(declared).not.toContain("itemsPopupOpen");
        expect(declared).not.toContain("items-popup-open");
    });
});
