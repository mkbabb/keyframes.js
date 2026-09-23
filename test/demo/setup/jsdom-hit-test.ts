/**
 * X.KF.W13R.m (glass 10.0.1 repin) — jsdom implements no hit testing:
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
