/**
 * G-KFW13-0 — the mechanism proof, EXECUTED, before any deletion is spent.
 *
 * kf-ChromeDock M-4's cure (delete the `itemsPopupOpen` five-site round-trip and
 * let MbabbMenu hold the dock open itself) rests on ONE claim about Vue: that
 * `inject` resolves along the RUNTIME PARENT chain, so a component authored as
 * slot content in the PARENT (App.vue writes `<MbabbMenu>` into ChromeDock's
 * `#items` slot) still resolves the provider that RENDERS it (`<GlassDock>`,
 * inside ChromeDock). `ChromeDock.vue:109-113` asserts the opposite in prose.
 * The registry killed that prose (kf-ChromeDock.md:106, C/S-2 + C-17 — "a
 * superlative was awarded for a false statement about Vue; it is withdrawn"),
 * and this file is the kill EXECUTED rather than read: the deletion's safety
 * predicate is this mount, not a line count (§B.3 LAW A (1)).
 *
 * Nothing is stubbed. The provider is the installed `@mkbabb/glass-ui`
 * `GlassDock`, its real `provideDockContext`, its real `useDockState` collapse
 * machine. The harness reaches the producer's chunks because `vitest.config.ts`
 * inlines `@mkbabb/glass-ui` (KF13-E2, COHESION §0ai): the dist chunk imports
 * the bare self-specifier `@mkbabb/keyframes.js` (`dist/dock.js:24`), which
 * vitest's externalized resolution never hands to the S.B7 alias.
 *
 * No `demo/**` byte belongs to this file's commit.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import {
    GlassDock,
    useOptionalDockContext,
    type DockContext,
} from "@mkbabb/glass-ui/dock";

/** jsdom ships no ResizeObserver; the dock's own measure pass needs one to
 *  mount at all. The same platform gap `timeline-hover-preview.test.ts`,
 *  `KfPillTabs.test.ts` and `resize-tracks.test.ts` already polyfill — an
 *  absent browser API, not a defect being stood in for. */
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
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
});

/**
 * The probe stands exactly where `MbabbMenu` stands: authored by the PARENT of
 * the provider's host and passed down as slot content, so its `inject` call is
 * lexically outside `<GlassDock>` and only the runtime parent chain can resolve
 * it. `seen` is written in `setup()` — the same phase MbabbMenu's self-hold
 * will run in.
 */
let seen: DockContext | null | undefined;

const SlotProbe = defineComponent({
    name: "SlotProbe",
    setup() {
        seen = useOptionalDockContext();
        return () => h("span", { "data-probe": "slot" }, "probe");
    },
});

/** The host authors the slot content, exactly as App.vue authors `#items`. */
const Host = defineComponent({
    name: "DockHost",
    components: { GlassDock, SlotProbe },
    template: `
        <GlassDock ref="dockRef" :collapse-delay="50" :start-collapsed="false">
            <SlotProbe />
        </GlassDock>
    `,
});

function mountHost() {
    seen = undefined;
    const wrapper = mount(Host, { attachTo: document.body });
    const dock = wrapper.findComponent(GlassDock);
    return { wrapper, dock };
}

describe("G-KFW13-0 — slot content resolves the GlassDock provider it is rendered inside", () => {
    it("(1) `useOptionalDockContext()` in parent-authored slot content is NON-NULL", () => {
        const { wrapper } = mountHost();

        // The claim ChromeDock.vue:109-113 makes ("resolves ABOVE this provider
        // and cannot hold the dock open itself") would make this null.
        expect(seen).not.toBeNull();
        expect(seen).toBeDefined();
        expect(typeof seen!.id).toBe("string");
        expect(seen!.id).toMatch(/^glass-dock-/);
        expect(typeof seen!.keepOpen).toBe("function");
        expect(typeof seen!.release).toBe("function");

        wrapper.unmount();
    });

    it("(2) it is THIS provider's context — the id the dock renders with", () => {
        const { wrapper, dock } = mountHost();

        // Same object identity as the provider's own held flag: the dock's
        // exposed `isHeld` and the injected `held` are one computed.
        seen!.keepOpen();
        expect(seen!.held.value).toBe(true);
        expect(dock.vm.isHeld).toBe(true);

        seen!.release();
        expect(seen!.held.value).toBe(false);
        expect(dock.vm.isHeld).toBe(false);

        wrapper.unmount();
    });
});

describe("G-KFW13-0 — the hold the slot child takes is observable on `expanded`", () => {
    it("(3) keepOpen() from slot content blocks the collapse the dock would otherwise run; release() lets it through", async () => {
        vi.useFakeTimers();
        try {
            const { wrapper, dock } = mountHost();
            expect(dock.vm.expanded).toBe(true);

            // Held from the SLOT CHILD: the producer's `keepOpen` clears the
            // pending collapse timer and `release()` is the only thing that can
            // re-arm it (dist/dock.js — `g.value++ , T()` / `Math.max(0, …)`).
            seen!.keepOpen();
            await nextTick();
            vi.advanceTimersByTime(2_000);
            await nextTick();
            expect(dock.vm.expanded).toBe(true);
            expect(dock.vm.isHeld).toBe(true);

            // The pairing MbabbMenu will own: one release per keepOpen. The
            // producer re-arms its collapse on the falling edge of the count.
            seen!.release();
            await nextTick();
            expect(dock.vm.isHeld).toBe(false);
            vi.advanceTimersByTime(2_000);
            await nextTick();
            expect(dock.vm.expanded).toBe(false);

            wrapper.unmount();
        } finally {
            vi.useRealTimers();
        }
    });
});
