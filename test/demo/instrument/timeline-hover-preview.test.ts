// SERVED MODEL: claude-opus-5[1m]
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TimelineHoverPreview from "../../../demo/components/instrument/timeline/components/TimelineHoverPreview.vue";
import type { TimelineKeyframe } from "../../../demo/components/instrument/timeline/timelineTypes";
import {
    percentSelector,
    requireKeyframeSelector,
} from "../../../demo/utils/keyframeSelector";

/**
 * KF.W7 G11 fixture 3 — THE HOVER PREVIEW IS MOUNTED BY A TEST AT ALL.
 *
 * C-9 (THP): "zero test coverage: no test names the SFC or either cache prop;
 * `timeline-undo.test.ts` exercises the same state without this surface." This
 * file is the surface's first mount. Every clause below is a KF.W7 §Carry P7
 * row read as an assertion, born RED at `ae83da07`:
 *
 *   • C-5 (THP) — the `KeyframeSelector` discriminant is dropped at the caption,
 *     so a named scroll phase is captioned with a percent the author never
 *     wrote (`entry 100%` and `cover 0%` both render "25%"). The cure renders
 *     the AUTHORED form, resolved percent secondary.
 *   • N-2 (label, WIRE — G15-FOLD-RULING §4 reader 2) — the typed label is
 *     write-only state read by nothing; the caption is one of its three ruled
 *     readers.
 *   • the rows block is the instrument's only textual ground truth (M7): a
 *     property VALUE must reach the DOM in the case the author typed it.
 *
 * OWED BY THE RE-HOMED GHOST/CACHE FAMILY (G10 — X.KF.W7.e ESCALATED it; the
 * family's four `TimelineTrack.vue` carves are outside this seat's writable
 * set, G10-GHOST-CACHE-DESIGN §6). The assertions belong here, at this mount,
 * the moment the family lands whole:
 *   (a) editing a keyframe's vars evicts its `ready` entry;
 *   (b) a rejecting capture yields ONE `failed` entry and no second attempt;
 *   (c) a keyframe with no ghost-mappable vars and no capture renders the
 *       terminal `v-else` ("No previewable properties") rather than nothing;
 *   (d) the ghost PLATE carries no `transform`; the wrapper inside it does.
 * They are stated, not skipped: no `test.skip` stands in for a cure this seat
 * could not lawfully write.
 */

const kf = (over: Partial<TimelineKeyframe> = {}): TimelineKeyframe => ({
    id: "kf-fixture-0",
    selector: percentSelector(38),
    percent: 38,
    vars: { opacity: "0.5" },
    ...over,
});

const mountPreview = (keyframe: TimelineKeyframe) =>
    mount(TimelineHoverPreview, {
        props: { keyframe, ghostStyle: {} },
    });

describe("TimelineHoverPreview — the mount (KF.W7 G11 fixture 3)", () => {
    it("mounts and renders every authored declaration as a row", () => {
        const w = mountPreview(
            kf({ vars: { transform: "translateX(10px)", opacity: "0.5" } }),
        );
        const text = w.text();
        // The case the author typed reaches the DOM (M7's subject: the tooltip
        // is the instrument's only textual ground truth for the CSS).
        expect(text).toContain("translateX(10px)");
        expect(text).toContain("transform");
        expect(text).toContain("opacity");
    });

    it("renders an explicit empty state for a keyframe with no declarations", () => {
        expect(mountPreview(kf({ vars: {} })).text()).toContain("No properties");
    });

    // C-5 (THP) — born RED: the caption is `Math.round(keyframe.percent)%`, so
    // `entry 100%` (resolved 25%) is captioned "25%" — a percent the author
    // never wrote. Both named phases below resolve to percents that collide
    // with other authored forms, which is the row's own witness.
    it("captions a named scroll phase with the AUTHORED form, not a fabricated percent", () => {
        const entry = requireKeyframeSelector("entry 100%");
        const w = mountPreview(
            kf({ id: "kf-entry", selector: entry, percent: 25 }),
        );
        expect(w.text()).toContain("entry 100%");
    });

    it("keeps the resolved percent as the SECONDARY reading of a named phase", () => {
        const cover = requireKeyframeSelector("cover 0%");
        const w = mountPreview(
            kf({ id: "kf-cover", selector: cover, percent: 25 }),
        );
        const text = w.text();
        expect(text).toContain("cover 0%");
        expect(text).toContain("25%");
        // The authored form leads; the resolution follows it.
        expect(text.indexOf("cover 0%")).toBeLessThan(text.indexOf("25%"));
    });

    it("captions a plain percent selector exactly once (no doubled reading)", () => {
        const text = mountPreview(kf({ percent: 38 })).text();
        expect(text.match(/38%/g)?.length ?? 0).toBe(1);
    });

    // N-2 — born RED: `label` is written by the editor and read by nothing.
    it("reads the typed label in the caption, label first (N-2 WIRE, reader 2)", () => {
        const text = mountPreview(kf({ label: "hero lift" })).text();
        expect(text).toContain("hero lift");
        expect(text.indexOf("hero lift")).toBeLessThan(text.indexOf("38%"));
    });

    it("omits the label affordance entirely when none was typed", () => {
        expect(mountPreview(kf()).text()).not.toContain("·");
    });
});
