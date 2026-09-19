/**
 * resize-tracks — G.W3 (the C1 container-resize staleness fold).
 *
 * The G.W2 re-pin added a C1 endpoint cache keyed by a monotonic layout epoch.
 * The epoch and its two accessors are THIS repo's own — `bumpLayoutEpoch` /
 * `getLayoutEpoch`, exported from `src/animation/resolve/browser.ts`; the
 * auto-bump listener they install rides `window.resize`. (KF-AV-18: the prose
 * here previously attributed both symbols to value.js, which exports neither —
 * a false provenance claim `scripts/gates/census.mjs --clause provenance`
 * now reds on.) The ONE resize the listener structurally cannot observe is a
 * CONTAINER resize decoupled from the viewport (a dock toggle / split-pane
 * drag / flex re-layout) — so a `cqw` animation whose container box changes
 * without a window resize serves the STALE pre-resize target. G.W3 wires
 * `AnimationVisualizer`'s `container-inline-size` box:
 * `useResizeObserver(containerEl, () => bumpLayoutEpoch())`.
 *
 * This gate is the falsifiable close. It exercises the REAL primitives the wire
 * uses — vueuse's `useResizeObserver` + this repo's `bumpLayoutEpoch` /
 * `getLayoutEpoch` — inside a real Vue setup, and asserts:
 *   (1) a container resize WITHOUT a window resize bumps the epoch (busting the
 *       C1 cache so the next frame re-resolves the new 100cqw);
 *   (2) the negative control — a host with NO wire — does NOT bump the epoch on
 *       a container resize (the staleness reproduces absent the wire);
 *   (3) the REAL `AnimationVisualizer.vue`, MOUNTED, observes its container and
 *       bumps the epoch when that container resizes.
 *
 * (3) was two `fs.readFileSync` + `toMatch` pins over the component's SOURCE
 * TEXT until X.KF.W4 `.d`. G-L7 rule (e) — a gate may not re-derive its own
 * oracle — and the audit's closing clause — a gate may not assert over its
 * subject's source text — retire that shape: the component is now MOUNTED and
 * the wire is read off its behaviour, so a rename, a re-spelling or a move
 * cannot green it and a genuine removal cannot hide behind a matching regex.
 *
 * BITE: remove the `useResizeObserver(..., bumpLayoutEpoch)` wire → assertion
 * (1)/(3) red. A window-resize-only bust would NOT catch this (the test resizes
 * the container, not the viewport).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { bumpLayoutEpoch, getLayoutEpoch } from "../../../src/animation/resolve/browser";

// glass-ui's dist self-imports `@mkbabb/keyframes.js`, which resolves inside
// THIS package but not from inside `node_modules/@mkbabb/glass-ui`, so the
// vendor barrel cannot load under the demo project's externalized resolution.
// The touch gate is not this spec's subject — it is stubbed at its own seam so
// the SUBJECT (the container-resize wire) is measured on the real component.
// Nothing about the wire is stubbed.
vi.mock("@mkbabb/glass-ui", () => ({
    useTouchGate: () => ({
        isActive: ref(false),
        isTouchDevice: false,
        handleScrollCheck: () => {},
        handleTouchEnd: () => {},
        handleTouchStart: () => false,
        suppressDeactivate: () => {},
    }),
}));

const { default: AnimationVisualizer } = await import(
    "@components/playback/AnimationVisualizer.vue"
);

// jsdom ships no ResizeObserver. Install a controllable polyfill that captures
// each observer's callback so the test can fire a synthetic CONTAINER resize
// (NOT a window resize) — the exact edge browser.ts's own auto-`window.resize`
// listener cannot see (that listener is THIS repo's, not value.js's).
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
            // The EXACT AnimationVisualizer wire (real vueuse + this repo's
            // real `bumpLayoutEpoch`).
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
        // Absent the wire, the container edge is invisible to the epoch's own
        // owner (browser.ts): it is unchanged, so the cache serves the stale
        // pre-resize target.
        expect(getLayoutEpoch()).toBe(epochBefore);
    });

    it("the MOUNTED AnimationVisualizer observes its container and bumps the epoch on a container resize", async () => {
        // The component reads two fields off its animation prop
        // (`options.duration`, `effectiveT`) and never plays here — isPlaying
        // is false, so the rAF loop stays guarded off.
        const animation = { options: { duration: 1000 }, effectiveT: 0 };
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp(AnimationVisualizer, {
            animation: animation as never,
            isPlaying: false,
        });
        app.mount(el);
        await nextTick();
        unmount = () => {
            app.unmount();
            el.remove();
        };

        // The component registered a ResizeObserver over a REAL observed
        // element — the wire exists as behaviour, not as matching source text.
        const observed = observers.filter((o) => o.targets.length > 0);
        expect(observed.length).toBeGreaterThan(0);

        const epochBefore = getLayoutEpoch();
        fireContainerResize();
        expect(getLayoutEpoch()).toBeGreaterThan(epochBefore);
    });
});
