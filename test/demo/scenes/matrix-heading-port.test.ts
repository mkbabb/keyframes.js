// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r3res2d (COHESION §0fj 4 · the §0fh item 6 idiom · UIA-KF-267 pane
 * side) — the cube Matrix surface's title stays in view on a short rail.
 *
 * At 844×390 the sheet's window was 326 px and the Matrix surface 602 px, so
 * the pane's one port scrolled the "Transform matrix" heading out above it
 * (and at 390×844 too). The cure: the surface's layer is `.pane-bounded`, the
 * boxes down to it shrink to the pane's port, and the layer's BODY is the one
 * scroll port, so its header sits OUTSIDE the port and never leaves.
 *
 * The geometry (the heading's box inside the viewport after the pane is
 * scrolled to its end, ×2 per theme at 844×390 / 1440×900 / 390×844) is read
 * by the served probe `evidence/W13X/r3res2d/probe.mjs`. This witness holds
 * the structure that geometry rests on, in the mounted editor: one scroll
 * port, the grid and the slider row inside it, the heading outside it, and
 * the port inside the bounded layer's region.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { createApp, h, nextTick } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

import { warmKfEngine } from "../../../demo/kf-engine";
import {
    AUTHORED_MATRIX_END,
    createMatrix,
    getAxisFromIx,
    getSliderOptionsFromIx,
    getTransformFromIx,
    matrixCellName,
} from "../../../demo/scenes/cube/matrix-editor/transformMath";

beforeAll(async () => {
    await warmKfEngine();
});

describe("UIA-KF-267 (pane side) — the Matrix title sits outside the surface's one scroll port", () => {
    it("one port holds the grid and the slider row; the heading is its sibling above, in the bounded layer", async () => {
        const { default: MatrixEditor } = await import(
            "../../../demo/scenes/cube/matrix-editor/MatrixEditor.vue"
        );
        const meta = Array.from({ length: 16 }, (_, i) => ({
            axis: getAxisFromIx(i),
            transform: getTransformFromIx(i),
            sliderOptions: getSliderOptionsFromIx(i, { halfWidth: 439, halfHeight: 396, side: 370 }),
            ...matrixCellName(i),
        }));
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp({
            render: () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(MatrixEditor, {
                            matrix3dEnd: createMatrix(AUTHORED_MATRIX_END),
                            matrixCellMeta: meta,
                            superKey: "cube",
                        }),
                }),
        });
        app.mount(host);
        await nextTick();

        const heading = [...host.querySelectorAll<HTMLElement>("*")].find(
            (e) => e.children.length === 0 && e.textContent?.trim() === "Transform matrix",
        );
        expect(heading, "the titled section").toBeDefined();

        // ONE scroll port in the surface (glass FadingScroll, the pane's port kind).
        const ports = host.querySelectorAll<HTMLElement>(".fading-scroll");
        expect(ports.length, "scroll ports in the Matrix surface").toBe(1);
        const port = ports[0]!;

        // The rows scroll inside it; the heading does not.
        expect(port.contains(host.querySelector(".matrix-grid")), "grid inside the port").toBe(true);
        expect(port.contains(host.querySelector(".param-row")), "slider row inside the port").toBe(true);
        expect(port.contains(heading!), "heading inside the port").toBe(false);

        // The heading and the port share the bounded layer: the header row above,
        // the port in the layer's region below it.
        const layer = heading!.closest<HTMLElement>("[data-slot=configurator-layer]");
        expect(layer?.classList.contains("pane-bounded"), "the layer is .pane-bounded").toBe(true);
        expect(layer!.querySelector("[role=region]")?.contains(port), "port in the layer's region").toBe(true);

        app.unmount();
        host.remove();
    }, 30_000);
});
