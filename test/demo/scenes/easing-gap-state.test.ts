/**
 * X.KF.W13X.easing · UIA-KF-093 (+ UIA-KF-091's consumer half) — in the
 * catalogue-gap state the Curve facet shows the SELECTED curve.
 *
 * MEASURED (served, kf `c79cb7f4`, `evidence/W13X/easing/before-r{1,2}.log`,
 * 1440 + 390, light + dark): with the engine-native `ease-in-bounce` tile
 * selected, the Curve facet's picker read `cubic-bezier(0, 0, 1, 1)` and drew
 * the linear diagonal, beside a second copy control ("Copy curve literal") —
 * the editor drew a curve that was not the selection.
 *
 * The witness mounts the REAL `EasingSidebar` (glass's real `EasingCurve`; the
 * authoring picker stubbed at its module seam with the readout it shows at
 * the linear quad) on a demo context, and asserts: in the gap state the
 * picker is not shown, glass's display plot of the selected curve is, with
 * the stroke the stage's function draws; "Edit as a custom curve" reveals the
 * picker; a bezier-expressible tile shows the picker and no display plot.
 */
import { describe, expect, it, vi } from "vitest";
import { computed, createApp, defineComponent, h, nextTick, ref } from "vue";
import { NAMED_EASING_BEZIER } from "@utils/reference-data/animationDescriptions";
import { namedEasing } from "@utils/reference-data/timingCurveUtils";
import { curvePlot, unitEasingFrame } from "@utils/curvePlot";

vi.mock("@mkbabb/glass-ui/easing", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@mkbabb/glass-ui/easing")>()),
    EasingPicker: defineComponent({
        name: "EasingPickerStub",
        setup: () => () =>
            h("div", { class: "picker-stub" }, [
                h("code", "cubic-bezier(0, 0, 1, 1)"),
                h("button", { "aria-label": "Copy curve literal" }),
            ]),
    }),
}));

const { default: EasingSidebar } = await import(
    "../../../demo/scenes/easing/EasingSidebar.vue"
);

type Quad = [number, number, number, number];
const STEPS = ["steps", "step-start", "step-end"];

const makeDemo = (name: string) => {
    const currentEasingName = ref(name);
    return {
        currentEasingName,
        bezierControlPoints: ref<Quad>([0, 0, 1, 1]),
        stepOptions: ref({ steps: 4, jumpTerm: "jump-end" as const }),
        duration: ref(1500),
        isBezierEditable: computed(
            () =>
                currentEasingName.value === "cubic-bezier" ||
                currentEasingName.value in NAMED_EASING_BEZIER,
        ),
        isSteps: computed(() => STEPS.includes(currentEasingName.value)),
        selectEasing: (n: string) => {
            currentEasingName.value = n;
        },
        updateBezierPoints: () => {},
    };
};

const mount = (name: string) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const demo = makeDemo(name);
    const app = createApp(EasingSidebar, { demo });
    app.mount(host);
    const shown = (sel: string) => {
        const el = host.querySelector<HTMLElement>(sel);
        return el !== null && el.style.display !== "none";
    };
    return { host, demo, shown, done: () => (app.unmount(), host.remove()) };
};

describe("UIA-KF-093 — the catalogue gap shows the selected curve", () => {
    it("ease-in-bounce: no linear picker, glass's display plot of the stage's curve", async () => {
        const { host, shown, done } = mount("ease-in-bounce");
        await nextTick();
        expect(shown(".picker-stub")).toBe(false);
        const plot = host.querySelector('[aria-label="ease-in-bounce curve"]');
        expect(plot).not.toBeNull();
        const ds = [...host.querySelectorAll(".gap-plot path")].map((p) => p.getAttribute("d"));
        expect(ds).toContain(curvePlot(namedEasing("ease-in-bounce"), unitEasingFrame()).d);
        done();
    });

    it("UIA-KF-054 · the gap caption is sentence-case small-register prose; the identifier is its one code chip", async () => {
        const { host, done } = mount("ease-in-bounce");
        await nextTick();
        const cap = host.querySelector("p.gap-caption");
        expect(cap).not.toBeNull();
        expect(cap!.classList.contains("text-small")).toBe(true);
        expect(cap!.classList.contains("text-mono-caption")).toBe(false);
        expect(cap!.querySelector("code")?.textContent).toBe("ease-in-bounce");
        expect(cap!.textContent?.replace(/\s+/g, " ").trim()).toMatch(/^ease-in-bounce is engine-native: .*\.$/);
        done();
    });

    it("the edit gesture departs: 'Edit as a custom curve' reveals the picker", async () => {
        const { host, shown, done } = mount("ease-in-bounce");
        await nextTick();
        const edit = [...host.querySelectorAll("button")].find((b) =>
            /Edit as a custom curve/.test(b.textContent ?? ""),
        );
        expect(edit).toBeDefined();
        edit!.click();
        await nextTick();
        expect(shown(".picker-stub")).toBe(true);
        expect(host.querySelector(".gap-plot")).toBeNull();
        done();
    });

    it("a bezier-expressible tile (ease-in) shows the picker and no display plot", async () => {
        const { host, shown, done } = mount("ease-in");
        await nextTick();
        expect(shown(".picker-stub")).toBe(true);
        expect(host.querySelector(".gap-plot")).toBeNull();
        done();
    });
});
