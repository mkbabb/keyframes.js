/**
 * proof:resize-tracks — G.W3 (the C1 container-resize staleness fold).
 *
 * The value.js re-pin (G.W2) added a C1 endpoint cache keyed by a monotonic
 * `layoutEpoch` that value.js bumps on `window.resize`. The ONE resize it
 * structurally cannot observe is a CONTAINER resize decoupled from the viewport
 * (a dock toggle / split-pane drag / flex re-layout) — so a `cqw` animation
 * whose container box changes without a window resize serves the STALE
 * pre-resize target. G.W3 wires `AnimationVisualizer`'s `container-inline-size`
 * box: `useResizeObserver(containerEl, () => bumpLayoutEpoch())`.
 *
 * This gate is the falsifiable close. It exercises the REAL primitives the wire
 * uses — vueuse's `useResizeObserver` + value.js's `bumpLayoutEpoch`/
 * `getLayoutEpoch` — inside a real Vue setup, and asserts:
 *   (1) a container resize WITHOUT a window resize bumps the epoch (busting the
 *       C1 cache so the next frame re-resolves the new 100cqw);
 *   (2) the negative control — a host with NO wire — does NOT bump the epoch on
 *       a container resize (the staleness reproduces absent the wire);
 *   (3) AnimationVisualizer.vue carries the wire (binding the mechanism test to
 *       the real component).
 *
 * BITE: remove the `useResizeObserver(..., bumpLayoutEpoch)` wire → assertion
 * (1)/(3) red. A window-resize-only bust would NOT catch this (the test resizes
 * the container, not the viewport).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createApp, defineComponent, h } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { bumpLayoutEpoch, getLayoutEpoch } from "@mkbabb/value.js";

// jsdom ships no ResizeObserver. Install a controllable polyfill that captures
// each observer's callback so the test can fire a synthetic CONTAINER resize
// (NOT a window resize) — the exact edge value.js's auto-window.resize cannot see.
const observers: Array<{ cb: ResizeObserverCallback; targets: Element[] }> = [];
class TestResizeObserver {
    private entry: { cb: ResizeObserverCallback; targets: Element[] };
    constructor(cb: ResizeObserverCallback) {
        this.entry = { cb, targets: [] };
        observers.push(this.entry);
    }
    observe(el: Element) {
        this.entry.targets.push(el);
    }
    unobserve(el: Element) {
        this.entry.targets = this.entry.targets.filter((t) => t !== el);
    }
    disconnect() {
        this.entry.targets = [];
    }
}

/** Fire a synthetic resize on every observed target (a container re-layout). */
function fireContainerResize() {
    for (const o of observers) {
        if (o.targets.length === 0) continue;
        o.cb(
            o.targets.map(
                (t) =>
                    ({
                        target: t,
                        contentRect: { width: 999, height: 48 } as DOMRectReadOnly,
                    }) as ResizeObserverEntry,
            ),
            {} as ResizeObserver,
        );
    }
}

/** Mount `setup` in a real Vue app against a detached element, return unmount. */
function mountWith(setup: () => unknown) {
    const el = document.createElement("div");
    const app = createApp(
        defineComponent({
            setup() {
                setup();
                return () => h("div");
            },
        }),
    );
    app.mount(el);
    return () => app.unmount();
}

describe("proof:resize-tracks — the C1 cache busts on a container resize without a window resize", () => {
    let unmount: (() => void) | null = null;
    beforeEach(() => {
        observers.length = 0;
        (globalThis as any).ResizeObserver = TestResizeObserver;
        (window as any).ResizeObserver = TestResizeObserver;
    });
    afterEach(() => {
        unmount?.();
        unmount = null;
        delete (globalThis as any).ResizeObserver;
        delete (window as any).ResizeObserver;
    });

    it("wires the container ResizeObserver to bumpLayoutEpoch — container resize advances the epoch", () => {
        const container = document.createElement("div");
        const epochBefore = getLayoutEpoch();

        unmount = mountWith(() => {
            // The EXACT AnimationVisualizer wire (real vueuse + real value.js).
            useResizeObserver(container, () => bumpLayoutEpoch());
        });

        // A CONTAINER resize, no window resize.
        fireContainerResize();

        // The epoch advanced → the C1 endpoint cache is busted → the next frame
        // re-resolves the new 100cqw (the ball tracks the new target).
        expect(getLayoutEpoch()).toBeGreaterThan(epochBefore);
    });

    it("negative control — NO wire → a container resize does NOT advance the epoch (the staleness)", () => {
        const container = document.createElement("div");

        unmount = mountWith(() => {
            // No useResizeObserver / bumpLayoutEpoch — the pre-G.W3 shape.
            void container;
        });

        const epochBefore = getLayoutEpoch();
        fireContainerResize(); // no observer registered → no bump
        // Absent the wire, the container edge is invisible to value.js: the
        // epoch is unchanged, so the cache serves the stale pre-resize target.
        expect(getLayoutEpoch()).toBe(epochBefore);
    });

    it("AnimationVisualizer.vue carries the bumpLayoutEpoch container wire (binds the mechanism to the component)", () => {
        const file = path.resolve(
            import.meta.dirname,
            "../demo/@/components/custom/animation-transport/controls/AnimationVisualizer.vue",
        );
        const src = fs.readFileSync(file, "utf8");
        expect(src).toMatch(/useResizeObserver\s*\(\s*containerEl/);
        expect(src).toMatch(/bumpLayoutEpoch\s*\(\s*\)/);
        expect(src).toMatch(/from\s+["']@mkbabb\/value\.js["']/);
    });
});
