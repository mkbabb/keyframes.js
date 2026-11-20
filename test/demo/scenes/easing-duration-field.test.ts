/**
 * X.KF.W13X.easing · UIA-KF-303 — no prop that does nothing on the Curve
 * facet's duration field.
 *
 * MEASURED (served, kf `c79cb7f4`, `evidence/W13X/easing/before-r{1,2}.log`,
 * `inertAttrs: ["tooltip"]` at 1440 + 390, light + dark): glass 10.1.0's
 * `LabeledSliderProps` declare label / description / requirement / layout /
 * errorLive (`labeled-field/types.d.ts`), not `tooltip`, so the sidebar's
 * `tooltip="Sweep duration (ms)"` fell through as a raw DOM attribute on
 * `div.labeled-field` and showed nothing. The unit is already on the row (the
 * `ms` readout) and in the slider's value text ("… milliseconds").
 *
 * The witness mounts the REAL `EasingSidebar` with glass's real LabeledSlider
 * and asserts the field root carries no undeclared attribute.
 */
import { describe, expect, it } from "vitest";
import { computed, createApp, nextTick, ref } from "vue";

const { default: EasingSidebar } = await import(
    "../../../demo/scenes/easing/EasingSidebar.vue"
);

describe("UIA-KF-303 — the duration field carries no inert prop", () => {
    it("div.labeled-field has no tooltip / label-class attribute", async () => {
        const name = ref("ease-in");
        const demo = {
            currentEasingName: name,
            bezierControlPoints: ref<[number, number, number, number]>([0.42, 0, 1, 1]),
            stepOptions: ref({ steps: 4, jumpTerm: "jump-end" as const }),
            duration: ref(1500),
            isBezierEditable: computed(() => true),
            isSteps: computed(() => false),
            selectEasing: () => {},
            updateBezierPoints: () => {},
        };
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp(EasingSidebar, { demo });
        app.mount(host);
        await nextTick();
        const fields = [...host.querySelectorAll(".labeled-field")];
        expect(fields.length).toBe(1);
        for (const f of fields) {
            expect(f.hasAttribute("tooltip")).toBe(false);
            expect(f.hasAttribute("label-class")).toBe(false);
        }
        app.unmount();
        host.remove();
    }, 30_000);
});

describe("the upright phone's sheet holds the curve section without a title row", () => {
    /** The viewport the media queries read. */
    const at = (w: number, h: number) => (query: string) => {
        let ok = true;
        for (const [, kind, axis, px] of query.matchAll(/\((max|min)-(width|height): (\d+)px\)/g)) {
            const v = axis === "height" ? h : w;
            ok &&= kind === "max" ? v <= Number(px) : v >= Number(px);
        }
        return { matches: ok, media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false };
    };
    const mountAt = async (w: number, h: number) => {
        Object.defineProperty(window, "matchMedia", { configurable: true, value: at(w, h) });
        const demo = {
            currentEasingName: ref("ease-in"),
            bezierControlPoints: ref<[number, number, number, number]>([0.42, 0, 1, 1]),
            stepOptions: ref({ steps: 4, jumpTerm: "jump-end" as const }),
            duration: ref(1500),
            isBezierEditable: computed(() => true),
            isSteps: computed(() => false),
            selectEasing: () => {},
            updateBezierPoints: () => {},
        };
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp(EasingSidebar, { demo });
        app.mount(host);
        await nextTick();
        return { host, done: () => { app.unmount(); host.remove(); } };
    };

    it("at 390x844 no title row; at 1440x900 the titled section stays; both keep the duration field", async () => {
        const saved = Object.getOwnPropertyDescriptor(window, "matchMedia");
        try {
            const phone = await mountAt(390, 844);
            expect(phone.host.querySelector("[data-slot=configurator-layer-trigger]")).toBeNull();
            expect(phone.host.querySelectorAll(".labeled-field")).toHaveLength(1);
            phone.done();
            const desk = await mountAt(1440, 900);
            expect(desk.host.querySelector("[data-slot=configurator-layer-trigger]")?.textContent).toMatch(/Easing/);
            expect(desk.host.querySelectorAll(".labeled-field")).toHaveLength(1);
            desk.done();
        } finally {
            if (saved) Object.defineProperty(window, "matchMedia", saved);
            else delete (window as { matchMedia?: unknown }).matchMedia;
        }
    }, 30_000);
});
