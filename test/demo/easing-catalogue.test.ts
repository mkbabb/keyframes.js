/**
 * easing-catalogue — X.KF.W4 `.e` / **G-KFW4-14** ("one catalogue, one truth").
 *
 * The demo reads TWO bezier catalogues. `NAMED_EASING_BEZIER` (the demo's own,
 * in `demo/utils/reference-data/animationDescriptions.ts`) is what the caption,
 * `isBezierEditable` and `selectEasing`'s stored quad key off; `bezierPresets`
 * (value.js's, and glass-ui's `EasingPicker` catalogue) is what `seedFor`
 * reached. They are not the same set — and the one name they differ on is
 * `smooth-step-3`, whose tile therefore printed *"is engine-native — editing
 * here authors a custom cubic-bezier"* directly above a picker seeded with a
 * `smooth-step-3` PRESET. Picker, stored quad and stage disagreed three ways on
 * one tile.
 *
 * **The cure is the cure-lock, verbatim: "gate `seedFor` on
 * `NAMED_EASING_BEZIER`, never merge the catalogues."** Merging is forbidden by
 * owner ruling — COHESION **§0j.C KF-SS3**: *"`smooth-step-3` is NOT repointed
 * at `bezierPresets`; its class is preserved. A smoothstep polynomial is not a
 * cubic bézier; flipping its class to make a name resolve is a behaviour change
 * dressed as hygiene."* Clause (2) below is that ruling's measurement.
 *
 * Three clauses, each with its own BITE:
 *
 *   (1) **THE TWO CATALOGUES** — `NAMED_EASING_BEZIER` is a byte-exact STRICT
 *       SUBSET of `bezierPresets`: 29 of 30 keys, sole delta `smooth-step-3`,
 *       zero value differences. BITE: merge them (add `smooth-step-3` to the
 *       demo map) or let one quad drift and this reds.
 *   (2) **THE CLASS IS PRESERVED** — the engine's `smooth-step-3` is NOT
 *       reproduced by the same-named preset: the two diverge by ≫0 on the
 *       33-point grid. BITE: repoint the name at `bezierPresets` (the branch
 *       KF-SS3 ruled out) and the demo hands the user a curve this far from the
 *       one the stage runs.
 *   (3) **THE MOUNTED TILE** — for every tile the specimen gallery renders, the
 *       caption's class claim, `seedFor`'s seed and the seeded quad agree. Read
 *       off a REAL mount of `EasingSidebar.vue` (never off its source text —
 *       G-L7 rule (c)/(d)), with the vendor stubbed at its own module seam
 *       because glass-ui is not the subject. BITE — the cure-lock's own
 *       falsifier: restore `seedFor`'s `if (name in bezierPresets)` and
 *       `smooth-step-3` renders the caption AND receives a preset, which is the
 *       contradiction this gate exists to forbid.
 *
 * The oracle is NOT this component's own answer (G-L7 rule (e)): membership in
 * `NAMED_EASING_BEZIER` is supplied by the DEMO CONTEXT, exactly as
 * `useEasingDemo.ts`'s `isBezierEditable` computes it, and the component's seed
 * decision and rendered caption are compared against it.
 *
 * Not a duplicate of `test/demo/reference-data/easing-catalog.test.ts`, which
 * is a DATA gate over `EASING_GROUPS` (every item resolves through value.js).
 * This one asserts a different proposition — caption-class claim vs `seedFor`'s
 * source vs the seeded quad — and neither weakens the other.
 */
import { describe, expect, it, vi } from "vitest";
import { computed, createApp, defineComponent, h, ref } from "vue";
import { bezierPresets } from "@mkbabb/value.js/easing";
import { NAMED_EASING_BEZIER } from "@utils/reference-data/animationDescriptions";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import {
    cubicBezierEasing,
    namedEasing,
} from "@utils/reference-data/timingCurveUtils";

type Quad = [number, number, number, number];

/** What the real component handed the vendor picker on its last render. */
const received: {
    mode?: unknown;
    preset?: unknown;
    steps?: unknown;
    term?: unknown;
} = {};

vi.mock("@mkbabb/glass-ui/easing", () => ({
    EasingPicker: defineComponent({
        name: "EasingPickerStub",
        props: {
            mode: { type: String, default: undefined },
            preset: { type: String, default: undefined },
            steps: { type: Number, default: undefined },
            term: { type: String, default: undefined },
            playback: { type: Boolean, default: undefined },
            label: { type: String, default: undefined },
        },
        setup(props) {
            return () => {
                received.mode = props.mode;
                received.preset = props.preset;
                received.steps = props.steps;
                received.term = props.term;
                return h("div", { class: "picker-stub" });
            };
        },
    }),
}));

const passthrough = (name: string, cls: string) =>
    defineComponent({
        name,
        setup(_props, { slots }) {
            return () => h("div", { class: cls }, slots.default?.());
        },
    });

vi.mock("@mkbabb/glass-ui", () => ({
    Card: passthrough("CardStub", "card-stub"),
    CardContent: passthrough("CardContentStub", "card-content-stub"),
    // X.KF.W13V.y — the Curve facet separates the picker from the duration
    // param row with the glass Separator (DESIGN-NOTE N-2).
    Separator: defineComponent({ name: "SeparatorStub", setup: () => () => h("hr") }),
}));

vi.mock("@mkbabb/glass-ui/labeled-field", () => ({
    LabeledSlider: defineComponent({
        name: "LabeledSliderStub",
        setup: () => () => h("div", { class: "slider-stub" }),
    }),
}));

const { default: EasingSidebar } =
    await import("../../demo/scenes/easing/EasingSidebar.vue");

/** The 33-point grid — `linearDensifyEasing`'s own sample set (`n = 32`). */
const GRID = Array.from({ length: 33 }, (_, i) => i / 32);

const presetQuads = bezierPresets as unknown as Record<string, Quad>;
const namedQuads = NAMED_EASING_BEZIER as Record<string, Quad>;

/** Every tile the specimen gallery renders. */
const TILES = EASING_GROUPS.flatMap((group) => group.items).map((i) => i.name);

const STEPS_TILES = ["steps", "step-start", "step-end"];

/**
 * `useEasingDemo.ts`'s `isBezierEditable` / `isSteps`, re-stated so the ORACLE
 * is the demo's declared catalogue rather than the component's own answer. The
 * rest of the context is inert for this gate; `EasingSidebar.vue` reads exactly
 * these eight members.
 */
const makeDemoContext = (name: string) => {
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
        isSteps: computed(() => STEPS_TILES.includes(currentEasingName.value)),
        selectEasing: () => {},
        updateBezierPoints: () => {},
    };
};

/** Mount the real sidebar on one tile and read what it rendered. */
const renderTile = (name: string) => {
    for (const k of Object.keys(received)) {
        delete (received as Record<string, unknown>)[k];
    }
    const host = document.createElement("div");
    document.body.appendChild(host);
    const app = createApp(EasingSidebar, { demo: makeDemoContext(name) });
    app.mount(host);
    try {
        const caption = host.querySelector('p[data-register="code"]');
        return {
            captionShown: caption !== null,
            captionText:
                caption?.textContent?.replace(/\s+/g, " ").trim() ?? "",
            picker: { ...received },
        };
    } finally {
        app.unmount();
        host.remove();
    }
};

const maxDelta = (a: (t: number) => number, b: (t: number) => number): number =>
    GRID.reduce((m, t) => Math.max(m, Math.abs(a(t) - b(t))), 0);

describe("the easing catalogue — one truth per tile", () => {
    it("(1) NAMED_EASING_BEZIER is a byte-exact strict subset of bezierPresets", () => {
        const named = Object.keys(namedQuads);
        const presets = Object.keys(presetQuads);
        expect(named).toHaveLength(29);
        expect(presets).toHaveLength(30);
        // BITE: merging the catalogues empties this array and reds the line.
        expect(presets.filter((k) => !(k in namedQuads))).toEqual([
            "smooth-step-3",
        ]);
        expect(named.filter((k) => !(k in presetQuads))).toEqual([]);
        // BITE: any quad drifting between the two catalogues reds here — the
        // subset is byte-exact, which is what makes seeding by NAME honest.
        expect(
            named.filter((k) => !quadEq(namedQuads[k]!, presetQuads[k]!)),
        ).toEqual([]);
    });

    it("(2) smooth-step-3's CLASS is preserved — no bezier reproduces it (KF-SS3)", () => {
        const quad = presetQuads["smooth-step-3"]!;
        const divergence = maxDelta(
            namedEasing("smooth-step-3"),
            cubicBezierEasing(...quad),
        );
        // A smoothstep polynomial is not a cubic bézier. The same-named preset
        // is an APPROXIMATION and this is how far off it is — the number the
        // caption's "engine-native" claim rests on.
        // BITE: repoint the name at `bezierPresets` and the demo hands the user
        // this much error; shrink the bound and the ruling stops being measured.
        expect(divergence).toBeGreaterThan(0.1);
        expect(divergence).toBeLessThan(0.12);
    });

    it.each(TILES)(
        "(3) tile %s — caption, seed and seeded quad agree",
        (name) => {
            const editable = name in namedQuads;
            const isSteps = STEPS_TILES.includes(name);
            const gap = !editable && !isSteps && name !== "cubic-bezier";
            const { captionShown, captionText, picker } = renderTile(name);

            // The caption's class claim ⟺ the demo catalogue says engine-native.
            expect(captionShown).toBe(gap);
            if (gap) expect(captionText).toContain(name);

            if (isSteps) {
                expect(picker.mode).toBe("steps");
                expect(picker.preset).toBeUndefined();
                return;
            }

            // BITE (the cure-lock's falsifier): `seedFor` reaching
            // `bezierPresets` seeds `smooth-step-3` — a name the caption above
            // has just called engine-native — and this line reds. An unseedable
            // name leaves the mounted picker on its declared initial fallback,
            // which is never the tile's own name.
            if (editable) {
                expect(picker.preset).toBe(name);
            } else {
                expect(picker.preset).not.toBe(name);
            }

            if (editable) {
                // The seeded quad IS the stored quad: the picker's catalogue
                // (`bezierPresets`) and the demo's map agree on this key, so a
                // seeded tile shows the curve the stage runs.
                expect(presetQuads[name]).toEqual(namedQuads[name]);
            }
        },
    );
});

function quadEq(a: Quad, b: Quad): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}
