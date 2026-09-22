// SERVED MODEL: claude-opus-5[1m]
/**
 * test/demo/instrument/apply-css-identity.test.ts — X.KF.W12.e (APPLY-UNIT),
 * the runtime half of **G-KFW12-5**: "one name, one lifetime".
 *
 * Every clause is EXECUTED over the real seat, the real composables and the
 * real engine, with a real target in the document. Only the producer
 * (`@mkbabb/glass-ui`) and the toast surface are stubbed at the module seam,
 * for the measured reason every demo spec that mounts this tree states: the
 * producer's dist imports `@mkbabb/keyframes.js`, a package never installs
 * itself, and vitest's alias cannot reach a specifier originating inside
 * `node_modules`. `@kf-engine` is NOT stubbed — the one `cssIdent` route this
 * gate is about lives behind it, and a stub of it would be the gate reading
 * itself.
 *
 *   (1) N-8 — ONE NAME, AND IT IS THE LIBRARY'S. For an animation whose id
 *       carries an UPPERCASE letter, the class the Apply control puts on the
 *       target, the `.selector` / `animation-name` / `@keyframes` name inside
 *       `getCSSString()`, and the library's own `cssIdent` answer for this
 *       animation are ONE string. BITE: a second hand-rolled derivation beside
 *       `cssIdent` (the audited `styleId.replace("keyframes-style-",
 *       "").toLowerCase()`) reds the equality on the case alone — which is why
 *       the fixture's id is uppercase-bearing and the clause asserts the name
 *       is NOT its own lowercase.
 *
 *   (2) L-BL-1 / L-BL-2 — THE SHEET BINDS THE TARGET. The rule the press
 *       injected is read back through CSSOM and matched against the target
 *       element itself (`target.matches(rule.selectorText)`), so the clause
 *       fails on a sheet that parses but selects nothing — the exact shape of
 *       the blocker ("Apply CSS adds a class no emitted rule can ever match").
 *       A name bearing a space is exercised in the same clause: it used to make
 *       `classList.add` throw `InvalidCharacterError` mid-apply.
 *
 *   (3) RB-6 — ONE LIFETIME FOR THE STATE AND ITS AFFORDANCE. The Apply toggle
 *       is the RIBBON's, behind `v-if="selectedControl === 'keyframes'"`, while
 *       the pane holding the state is force-mounted and never unmounts. Leaving
 *       the tab takes the identity down through the seat's handle. BITE: drop
 *       the ribbon's watch and the class, the sheet and the forced pause all
 *       outlive the only control that could undo them.
 *
 *   (4) KF-KE-12 ≡ N-5 — `clear()` IS WIRED. Unmounting the sole holder while
 *       applied restores the PRIOR pause state (S-6-as-corrected, kept whole),
 *       empties the sheet and strips the class. BITE: `clear()` with zero
 *       callers leaves the animation pinned paused with its sheet removed.
 *
 * **Anti-work clause (the spec's own, §Gates G-KFW12-5)**: the filed "both
 * animate the same target simultaneously" scenario is KILLED at the bank
 * (L-BL-1) and is NOT cured, witnessed or asserted anywhere in this file. It is
 * named here once, as killed, so its absence is a measurement.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, markRaw, nextTick, reactive } from "vue";
import { mount } from "@vue/test-utils";
import type { StoredAnimationGroupControlOptions } from "@state";

const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup: (_p, { slots, attrs }) =>
            () =>
                h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
    });

const buttonStub = defineComponent({
    name: "ButtonStub",
    inheritAttrs: false,
    setup: (_p, { slots, attrs }) =>
        () =>
            h("button", { type: "button", ...attrs }, slots.default?.()),
});

vi.mock("@mkbabb/glass-ui", () => ({
    Button: buttonStub,
    Skeleton: slotStub("div", "Skeleton"),
    Card: slotStub("div", "Card"),
    CardContent: slotStub("div", "CardContent"),
}));
vi.mock("@mkbabb/glass-ui/card", () => ({
    Card: slotStub("div", "Card"),
    CardContent: slotStub("div", "CardContent"),
}));
vi.mock("@mkbabb/glass-ui/dark", async () => {
    const { ref: vueRef } = await import("vue");
    const isDark = vueRef(false);
    return { useGlobalDark: () => ({ isDark, onFlipSettled: () => () => {} }) };
});
vi.mock("vue-sonner", () => ({
    toast: Object.assign(() => {}, {
        success: () => {},
        error: () => {},
        warning: () => {},
        dismiss: () => {},
    }),
}));
vi.mock("@utils/clipboard", () => ({ copyText: async () => {} }));

// The warm precedes the subject's IMPORT, exactly as `main.ts` guarantees it.
const { warmKfEngine, kfEngine } = await import("@kf-engine");
await warmKfEngine();

const { cssIdent } = kfEngine();
const { createAnimationUUId } = await import("@state");
const { importCSSToTimeline, buildAnimationFromTimeline } = await import(
    "@components/instrument/timeline/utils/timelineEngine"
);
const KeyframesStringControls = (
    await import("@components/instrument/keyframes/KeyframesStringControls.vue")
).default;
const RibbonBar = (
    await import(
        "@components/instrument/transport/controls-pane/RibbonBar.vue"
    )
).default;

const CSS_SOURCE = `
    @keyframes applied {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

/**
 * A real animation over a REAL target in the document. The default name carries
 * an UPPERCASE letter so a case-folding derivation cannot pass by coincidence;
 * callers pass a space-bearing name to exercise L-BL-2's ident hazard (the
 * shipped `"Spring Keyframes"` shape, `useSpringKeyframesEditor.ts:65`).
 */
const buildFixture = async (name: string, superKey: string) => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const keyframes = await importCSSToTimeline(CSS_SOURCE);
    const animation = await buildAnimationFromTimeline(
        { keyframes, captureProperties: [], animationName: "applied" },
        { duration: 1_000 },
        [target],
    );
    animation.name = name;
    animation.superKey = superKey;
    return { animation: markRaw(animation), target };
};

/** The identity as the LIBRARY derives it — the one route N-8 permits. */
const identityOf = (
    animation: Parameters<typeof createAnimationUUId>[0],
    superKey: Parameters<typeof createAnimationUUId>[1],
) => cssIdent(`keyframes-style-${createAnimationUUId(animation, superKey)}`);

/**
 * The seat's `defineExpose` surface, named once.
 *
 * `@vue/test-utils` types a mounted SFC's exposed members as possibly-absent on
 * `wrapper.vm` (they exist only once setup has run), so reading them at seven
 * call sites would otherwise mean seven non-null assertions. One named contract
 * is the honest shape — and it is the SAME contract the ribbon consumes at
 * runtime through `activeKeyframesRef?.clearAppliedCSS?.()`.
 */
interface ApplySeat {
    getCSSString: () => string;
    applyCSSStyles: () => void;
    clearAppliedCSS: () => void;
    cssApplied: boolean;
}

const seatOf = (wrapper: { vm: object }) => wrapper.vm as unknown as ApplySeat;

const injectedSheets = () =>
    Array.from(
        document.head.querySelectorAll<HTMLStyleElement>("style"),
    ).filter((el) => el.id.startsWith("keyframes-style-"));

/** The projection is async (engine + prettier) and heavier than vitest's 5 s
 *  default on a shared runner (the wave's D59 precedent: explicit timeouts,
 *  assertions untouched). */
const HEAVY = { timeout: 30_000 };

/** The animation `buildFixture` builds — the one shape the seat's `animation`
 *  prop takes, named from its producer rather than re-declared. */
type FixtureAnimation = Awaited<ReturnType<typeof buildFixture>>["animation"];

/** Mount the APPLY seat and wait for its one-shot projection to land. */
const mountSeat = async (animation: FixtureAnimation) => {
    const wrapper = mount(KeyframesStringControls, {
        props: { animation },
        attachTo: document.body,
    });
    await nextTick();
    await vi.waitFor(
        () => {
            expect(String(seatOf(wrapper).getCSSString())).toContain("@keyframes");
        },
        { timeout: 20_000 },
    );
    return wrapper;
};

beforeEach(() => {
    for (const el of injectedSheets()) el.remove();
    document.body.innerHTML = "";
});

describe("G-KFW12-5 — APPLY: one name, one lifetime", () => {
    it("(1) N-8: the class, the emitted selector and cssIdent's own answer are ONE string", HEAVY, async () => {
        const { animation, target } = await buildFixture("Apply-Transform", "kfapply");
        const wrapper = await mountSeat(animation);

        const css = String(seatOf(wrapper).getCSSString());
        const selectorName = /^\s*\.(\S+)\s*\{/m.exec(css)?.[1];
        const animationName = /animation-name:\s*([^;\s]+)\s*;/.exec(css)?.[1];
        const keyframesName = /@keyframes\s+(\S+)\s*\{/.exec(css)?.[1];

        // The press is the ONLY producer of the class: `getClassName()` is
        // `() => styleId` inside the seat, so what lands on the target IS its
        // executed return value.
        seatOf(wrapper).applyCSSStyles();
        await nextTick();
        const classes = Array.from(target.classList);
        expect(classes.length).toBe(1);
        const className = classes[0]!;

        // The ONE route: the library's own published normalizer over the
        // demo's own id. Nothing here re-derives a name.
        const libraryName = identityOf(animation, "kfapply");

        // The strings the receipt pastes, side by side.
        console.info(
            `[G-KFW12-5/N-8] class=${JSON.stringify(className)} selector=${JSON.stringify(selectorName)} animation-name=${JSON.stringify(animationName)} @keyframes=${JSON.stringify(keyframesName)} cssIdent=${JSON.stringify(libraryName)}`,
        );

        expect(selectorName).toBe(className);
        expect(animationName).toBe(className);
        expect(keyframesName).toBe(className);
        expect(libraryName).toBe(className);
        // The bite, named: the audited derivation was the case-folded strip, so
        // a name that is its own lowercase could pass by coincidence.
        expect(className).not.toBe(className.toLowerCase());

        seatOf(wrapper).clearAppliedCSS();
        wrapper.unmount();
    });

    it("(2) L-BL-1/L-BL-2: the injected rule SELECTS the target, for a name bearing a space", HEAVY, async () => {
        // The shipped whitespace-name shape (`useSpringKeyframesEditor.ts:65`):
        // pre-cure this threw `InvalidCharacterError` inside `classList.add`
        // and made the `#id` sheet lookup parse as a descendant selector.
        const { animation, target } = await buildFixture("Spring Keyframes", "kfapply");
        const wrapper = await mountSeat(animation);

        expect(seatOf(wrapper).cssApplied).toBe(false);
        seatOf(wrapper).applyCSSStyles();
        await nextTick();
        expect(seatOf(wrapper).cssApplied).toBe(true);

        const sheets = injectedSheets();
        expect(sheets.length).toBe(1);
        const sheet = sheets[0]!;
        const rules = Array.from(sheet.sheet!.cssRules);

        // The style rule the press injected, read back through CSSOM — and
        // matched against the element itself. A sheet that parses but selects
        // nothing reds here, which is L-BL-1's whole shape.
        const styleRule = rules.find(
            (r): r is CSSStyleRule => r instanceof CSSStyleRule,
        )!;
        expect(styleRule).toBeDefined();
        expect(target.matches(styleRule.selectorText)).toBe(true);

        // ...and the rule it binds names the `@keyframes` block in the SAME
        // sheet, so the target animates under what was injected.
        const declaredName = styleRule.style.getPropertyValue("animation-name").trim();
        const keyframesRule = rules.find(
            (r): r is CSSKeyframesRule => r instanceof CSSKeyframesRule,
        )!;
        expect(keyframesRule).toBeDefined();
        expect(keyframesRule.name).toBe(declaredName);
        expect(styleRule.selectorText).toBe(`.${declaredName}`);

        console.info(
            `[G-KFW12-5/binds] selectorText=${JSON.stringify(styleRule.selectorText)} matchesTarget=${target.matches(styleRule.selectorText)} @keyframes=${JSON.stringify(keyframesRule.name)}`,
        );

        seatOf(wrapper).clearAppliedCSS();
        wrapper.unmount();
    });
    it("(3) RB-6: leaving the keyframes tab takes the applied identity down with the affordance", HEAVY, async () => {
        const { animation, target } = await buildFixture("Ribbon-Lifetime", "kfapply");
        const seat = await mountSeat(animation);

        // The ribbon is the ONLY host of the Apply toggle, behind
        // `v-if="selectedControl === 'keyframes'"`; the seat below it is
        // force-mounted in the shipped tree and never unmounts, which is the
        // whole asymmetry RB-6 names.
        const storedControls = reactive<StoredAnimationGroupControlOptions>({
            selectedControl: "keyframes",
            selectedAnimation: "",
            keyframeControls: {
                selectedKeyframesControl: "keyframes",
                dialogOpen: false,
                keyframes: "",
                addKeyframes: "",
            },
            isTimelineExpanded: false,
            isControlsPanelOpen: true,
        });
        const ribbon = mount(RibbonBar, {
            props: {
                storedControls,
                activeKeyframesRef: seat.vm,
                activeTimelineRef: null,
            },
            attachTo: document.body,
        });
        await nextTick();

        const applyButton = ribbon
            .findAll("button")
            .find((b) => b.text().includes("Apply CSS"))!;
        expect(applyButton).toBeDefined();

        await applyButton.trigger("click");
        await nextTick();
        expect(seatOf(seat).cssApplied).toBe(true);
        expect(target.classList.length).toBe(1);
        expect(injectedSheets()[0]!.textContent).toContain("@keyframes");

        // Switch tabs: the affordance's own branch leaves, and the identity
        // goes with it. Pre-cure the class, the sheet and the forced pause all
        // stayed, with no visible undo anywhere in the app.
        storedControls.selectedControl = "timeline";
        await nextTick();

        expect(ribbon.findAll("button").some((b) => b.text().includes("Apply CSS"))).toBe(
            false,
        );
        expect(seatOf(seat).cssApplied).toBe(false);
        expect(Array.from(target.classList)).toEqual([]);
        expect(injectedSheets()[0]!.textContent).toBe("");

        ribbon.unmount();
        seat.unmount();
    });

    it("(4) KF-KE-12 ≡ N-5: clear() is wired — the sole holder's unmount restores the pause state and strips the identity", HEAVY, async () => {
        const { animation, target } = await buildFixture("Teardown-Wired", "kfapply");

        // A PRIOR pause state that is not the applied one, so the restore is a
        // real assertion rather than a coincidence (S-6-as-corrected: the
        // `prevPaused` save/restore is the right mechanism and is kept whole).
        (animation as unknown as { paused: boolean }).paused = true;

        const seat = await mountSeat(animation);
        seatOf(seat).applyCSSStyles();
        await nextTick();

        expect(seatOf(seat).cssApplied).toBe(true);
        expect(target.classList.length).toBe(1);
        expect((animation as unknown as { paused: boolean }).paused).toBe(false);
        expect(injectedSheets().length).toBe(1);

        // The sole holder leaves while applied. Pre-cure: `clear()` had zero
        // callers, so the animation stayed pinned at the forced pause value,
        // the class stayed on every target, and the sheet was removed anyway.
        seat.unmount();
        await nextTick();

        expect((animation as unknown as { paused: boolean }).paused).toBe(true);
        expect(Array.from(target.classList)).toEqual([]);
        expect(injectedSheets().length).toBe(0);
    });
});
