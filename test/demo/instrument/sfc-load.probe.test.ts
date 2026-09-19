/**
 * X.KF.W8 G10 — THE SFC-LOAD PROBE.
 *
 * WHAT THIS PROVES, and why it is not redundant with the lane's other specs.
 * The `demo` vitest project's ability to compile a `.vue` single-file component
 * is a property of the RUNNER, not of any component: it lives in
 * `vitest.config.ts`'s root `plugins: [vue()]` registration (KF.W4's booked act,
 * G-KFW4-2). Before that registration the config declared `resolve` and `test`
 * and no `plugins` array at all, so vitest could not transform a single SFC —
 * the demo lane passed with ZERO mounted components, and any spec reaching an
 * SFC died at transform rather than at an assertion. A wiring that EXISTS is not
 * a wiring that WORKS, and nothing in the lane asserted the difference at the
 * runner level. This probe is that assertion, and it is the whole of it: it
 * holds the hole open, so a future config edit that drops or mis-scopes the
 * plugin reds here, by name, instead of silently emptying the lane again.
 *
 * WHY IT MOUNTS RATHER THAN IMPORTS. G10's falsifier names the three ways a
 * probe can reach green while proving nothing: stubbing the component
 * (`vi.mock`), importing a `.ts` shim instead of an SFC, or asserting only that
 * the import did not throw. All three pass with a dead transform. So this file
 * imports ONE REAL `demo/**\/*.vue` by its published alias, mounts it with
 * `@vue/test-utils` (G10 leg (b)'s devDep), and asserts a real, connected DOM
 * subtree — the template half of the SFC, which only the plugin can produce.
 *
 * WHY `TimelineHoverPreview.vue`, stated rather than assumed. The probe needs a
 * component whose failure means "the transform is dead", never "this component's
 * dependencies are unhappy", so its import graph must stay inside vue + the demo
 * + value.js: this one reaches `@utils/keyframeSelector`, two value.js subpaths
 * and `vue`, and touches the glass-ui root barrel nowhere. That matters here for
 * a measured reason the lane already records — `timeline-hover-preview.test.ts`
 * states that `KeyframeTimeline` "cannot be mounted in this realm at all" over
 * the glass-ui root barrel, and a probe built on a glass-ui-bearing SFC inherits
 * that wall: a first draft of this file used `CopyButton.vue` and failed at
 * `Cannot find package '@mkbabb/keyframes.js' imported from
 * node_modules/@mkbabb/glass-ui/dist/useSpring-*.js` — the externalized producer
 * resolving the self-package from inside `node_modules`, where the config's
 * source alias cannot reach. That is a real resolution edge and it is NOT what
 * G10 measures, so the probe is seated where the only thing it can fail on is
 * the transform. It is likewise deliberately NOT one of this wave's own move
 * subjects (`CopyButton` · `KeyframeCard` · `TimelineCaret` · `HeroAurora`) and
 * not `TypingDots`, whose external test importer is the open G7 question.
 *
 * BITE: delete `plugins: [vue()]` from `vitest.config.ts` and this file fails at
 * import with a transform error — the hole it exists to hold open. Move the
 * registration from the root onto the `library` project and it fails the same
 * way, which is the second case G10's falsifier names.
 */
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TimelineHoverPreview from "@components/instrument/timeline/components/TimelineHoverPreview.vue";
import { percentSelector } from "@utils/keyframeSelector";
import type { TimelineKeyframe } from "@components/instrument/timeline/timelineTypes";

const keyframe = (): TimelineKeyframe => ({
    id: "g10-probe-0",
    selector: percentSelector(38),
    percent: 38,
    vars: { opacity: "0.5" },
});

describe("G10 — the demo project can load and mount a real SFC", () => {
    it("(1) the import yields a COMPILED component, not an untransformed module", () => {
        // An untransformed `.vue` has neither of these: the shape assertion the
        // falsifier's "asserted only that the import did not throw" case cannot
        // make, because a resolve-only success leaves both undefined.
        expect(TimelineHoverPreview).toBeTypeOf("object");
        const c = TimelineHoverPreview as { render?: unknown; setup?: unknown };
        expect(typeof c.render === "function" || typeof c.setup === "function").toBe(
            true,
        );
    });

    it("(2) mounting it produces a real, connected DOM subtree", () => {
        const w = mount(TimelineHoverPreview, {
            props: { keyframe: keyframe() },
            attachTo: document.body,
        });

        try {
            // The template half compiled and rendered: a real element exists, it
            // is in the live document, and it carries the component's own text.
            expect(w.element).toBeInstanceOf(HTMLElement);
            expect((w.element as HTMLElement).isConnected).toBe(true);
            expect(w.element.querySelectorAll("*").length).toBeGreaterThan(0);
            // `opacity` is this fixture's one authored declaration; it can only
            // be on screen if script-setup ran and the template rendered it.
            expect(w.text()).toContain("opacity");
        } finally {
            w.unmount();
        }
    });
});
