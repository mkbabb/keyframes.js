/**
 * X.KF.W13X.easing · UIA-KF-091 (consumer half, the header) — one print per
 * fact: the header names the curve once.
 *
 * MEASURED (served, kf `c79cb7f4`, `evidence/W13X/easing/before-r{1,2}.log`):
 * with `ease-in-bounce` selected the header read `header: "ease-in-bounce"`
 * AND `headerLiteral: "ease-in-bounce"` — for an engine-named curve the
 * literal IS the name, so the header printed it twice. The literal line is
 * the header's second fact only when it differs from the name (a bezier quad,
 * a steps() call); the copy control stays beside the name either way.
 *
 * The witness mounts the REAL `EasingTarget` over the REAL `useEasingDemo`.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../../demo/scenes/easing/easingKeys";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

beforeAll(async () => {
    await warmKfEngine();
});

class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

describe("UIA-KF-091 — the header literal never re-prints the name", () => {
    let host: HTMLElement;
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", NoopObserver);
        vi.stubGlobal("IntersectionObserver", NoopObserver);
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        host.remove();
    });

    it("engine-named ease-in-bounce: one name, no literal twin; ease-in: the quad literal shows", async () => {
        const { default: EasingTarget } = await import(
            "../../../demo/scenes/easing/EasingTarget.vue"
        );
        let demo!: ReturnType<typeof useEasingDemo>;
        const app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    provide(EASING_DEMO_KEY, demo);
                    return () => h(TooltipProvider, null, { default: () => h(EasingTarget) });
                },
            }),
        );
        app.mount(host);
        await nextTick();

        const header = () => host.querySelector(".gallery-header")!;

        demo.selectEasing("ease-in-bounce");
        await nextTick();
        await nextTick();
        // The h2 swaps under an out-in <Transition> (jsdom never ends the
        // leave), so the proposition is read on the literal line itself: it
        // never re-prints the name the h2 carries.
        const lit = header().querySelector(".literal-text");
        expect(lit?.textContent?.trim() ?? null).not.toBe("ease-in-bounce");
        expect(header().querySelector('[aria-label="Copy easing literal"]')).not.toBeNull();

        demo.selectEasing("ease-in");
        await nextTick();
        await nextTick();
        expect(header().querySelector(".literal-text")?.textContent).toMatch(/^cubic-bezier\(/);

        app.unmount();
    }, 30_000);
});
