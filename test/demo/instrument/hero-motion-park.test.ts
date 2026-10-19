/**
 * test/demo/instrument/hero-motion-park.test.ts — KF.DS.r1 (COHESION §0ge.7,
 * KF-C3-02 RULED: the home title wave and hero dots are KEPT as identity
 * motion, static under prefers-reduced-motion, PARKED while the page is hidden
 * or the element is offscreen).
 *
 * The park lives at each animation's own root — AnimatedText's `.wave-text`
 * (the CSS wave: `animation-play-state` under `.is-parked`) and TypingDots
 * (the engine dots: `pause()` / `resume()`) — never as a per-instance override
 * in a consumer. Mounts the REAL components; IntersectionObserver and
 * `document.visibilityState` are the only stubs (jsdom has neither live).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import AnimatedText from "@app/hero/AnimatedText.vue";
import TypingDots from "@app/hero/TypingDots.vue";

type IOCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void;
const observers: { cb: IOCallback; targets: Element[] }[] = [];

class FakeIntersectionObserver {
    private rec: { cb: IOCallback; targets: Element[] };
    constructor(cb: IOCallback) {
        this.rec = { cb, targets: [] };
        observers.push(this.rec);
    }
    observe(el: Element) {
        this.rec.targets.push(el);
    }
    unobserve() {}
    disconnect() {
        this.rec.targets = [];
    }
    takeRecords() {
        return [];
    }
}

function setOnscreen(on: boolean): void {
    for (const o of observers)
        o.cb(o.targets.map((target) => ({ isIntersecting: on, target })));
}

let visibility: DocumentVisibilityState = "visible";
function setHidden(hidden: boolean): void {
    visibility = hidden ? "hidden" : "visible";
    document.dispatchEvent(new Event("visibilitychange"));
}

const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
let wrapper: VueWrapper | null = null;

beforeEach(() => {
    observers.length = 0;
    visibility = "visible";
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => visibility,
    });
    Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => visibility === "hidden",
    });
});

afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.unstubAllGlobals();
    delete (document as { visibilityState?: unknown }).visibilityState;
    delete (document as { hidden?: unknown }).hidden;
});

describe("KF.DS.r1 — the title wave parks at its root", () => {
    it("parks while offscreen or hidden, and runs again when both clear", async () => {
        wrapper = mount(AnimatedText, {
            props: { text: "Select an animation" },
            attachTo: document.body,
        });
        await nextTick();
        const root = wrapper.get(".wave-text");
        expect(root.classes()).not.toContain("is-parked");

        setOnscreen(false);
        await nextTick();
        expect(root.classes()).toContain("is-parked");

        setOnscreen(true);
        await nextTick();
        expect(root.classes()).not.toContain("is-parked");

        setHidden(true);
        await nextTick();
        expect(root.classes()).toContain("is-parked");

        setHidden(false);
        await nextTick();
        expect(root.classes()).not.toContain("is-parked");
    });
});

describe("KF.DS.r1 — the hero dots park at their root", () => {
    async function mountDots() {
        wrapper = mount(TypingDots, { attachTo: document.body });
        await nextTick();
        const painted = () =>
            wrapper!
                .findAll<HTMLElement>(".typing-dot")
                .every((d) => d.element.style.opacity !== "");
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline && !painted()) await frame();
        expect(painted()).toBe(true);
    }

    /** The dots' painted opacities, sampled across `n` frames. */
    async function sample(n = 30): Promise<Set<string>> {
        const seen = new Set<string>();
        for (let i = 0; i < n; i++) {
            await frame();
            seen.add(
                wrapper!
                    .findAll<HTMLElement>(".typing-dot")
                    .map((d) => d.element.style.opacity)
                    .join("|"),
            );
        }
        return seen;
    }

    it("stops painting while offscreen, and paints again when back on screen", async () => {
        await mountDots();
        setOnscreen(false);
        await nextTick();
        await frame();
        expect((await sample(60)).size).toBe(1);

        setOnscreen(true);
        await nextTick();
        expect((await sample(90)).size).toBeGreaterThan(1);
    });

    it("stops painting while the page is hidden", async () => {
        await mountDots();
        setHidden(true);
        await nextTick();
        await frame();
        expect((await sample(60)).size).toBe(1);

        setHidden(false);
        await nextTick();
        expect((await sample(90)).size).toBeGreaterThan(1);
    });
});
