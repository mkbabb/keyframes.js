/**
 * X.KF.W13R.m (glass 10.0.1 repin) — the demo project's jsdom LAYOUT gaps that
 * glass 10's components now reach, each answered with what a layout-less DOM
 * truly gives. First, jsdom implements no hit testing:
 * `document.elementsFromPoint` is absent (jsdom has no layout, so no box sits
 * at any point). glass-ui's GlassDock adaptive-luminance sampler reads the
 * page beneath the dock through it (`dist/dock.js`, the backdrop-luma probe),
 * and at 10.0.1 that read runs on mount, so every demo test that mounts a real
 * GlassDock died with `document.elementsFromPoint is not a function` before a
 * single assertion. This supplies the API with the answer a layout-less DOM
 * truly gives — no element at any point — and the producer takes its own
 * documented fallback (the body's background). It never overrides a real
 * implementation.
 */
if (typeof document !== "undefined" && !("elementsFromPoint" in document)) {
    Object.defineProperty(document, "elementsFromPoint", {
        configurable: true,
        value: (): Element[] => [],
    });
}

/**
 * The same class of gap: jsdom ships no `ResizeObserver` (no layout, so no box
 * ever resizes). glass 10.0.1's selection engine (ToggleGroup's
 * `useSelectionGroup` indicator measure) constructs one in a post-flush watch,
 * so a mounted ToggleGroup died `ResizeObserver is not defined`. The no-op
 * observer is the honest one for a layout-less DOM (nothing is ever observed to
 * change); a test that installs its own (fifteen demo files do, saving and
 * restoring the global) still wins, and a real implementation is never replaced.
 */
if (typeof globalThis.ResizeObserver === "undefined") {
    class LayoutlessResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    Object.defineProperty(globalThis, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: LayoutlessResizeObserver,
    });
}

/**
 * And the third: jsdom implements no scrolling, so `Element.prototype.
 * scrollIntoView` is absent. glass 10.0.1's selection engine reveals the chosen
 * item on select (`useSelectionGroup` → `scrollIntoView`), so a click on a
 * ToggleGroupItem threw an unhandled `scrollIntoView is not a function`. With no
 * scroll port in a layout-less DOM there is nothing to reveal; the no-op is
 * that truth, and a real implementation is never replaced.
 */
if (typeof Element !== "undefined" && !("scrollIntoView" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "scrollIntoView", {
        configurable: true,
        writable: true,
        value(): void {},
    });
}
