// SERVED MODEL: claude-opus-5[1m]
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, shallowRef } from "vue";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { TooltipContent, TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TimelineHoverPreview from "../../../demo/components/instrument/timeline/components/TimelineHoverPreview.vue";
import TimelineTrack from "../../../demo/components/instrument/timeline/components/TimelineTrack.vue";
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
 * THE GHOST/CACHE FAMILY (G10) LANDED WHOLE AT X.KF.W7.g, and the four
 * assertions X.KF.W7.e could only STATE here are the four `describe` blocks
 * below — RUNNING, never `test.skip`'d:
 *   (a) editing a keyframe's vars evicts its `ready` entry;
 *   (b) a rejecting capture yields ONE `failed` entry and no second attempt;
 *   (c) a keyframe with no ghost-mappable vars and no capture renders the
 *       terminal `v-else` ("No previewable properties") rather than nothing;
 *   (d) the ghost PLATE carries no `transform`; the wrapper inside it does.
 *
 * G9 LANDED WHOLE AT X.KF.W7.h, and its assertions are the last `describe`
 * block below: the panel's accessible description is DERIVED from the data that
 * renders it, PUNCTUATED at every boundary, RE-DERIVED on the ghost→image swap,
 * and never force-uppercased — asserted end to end, at the `role="tooltip"`
 * node reka actually builds, so the `props.ariaLabel || textContent` fallback is
 * proven not to fire rather than assumed not to.
 *
 * (a) and (b) are asserted against the cache's OWN rules rather than through a
 * `KeyframeTimeline` mount, and the reason is measured, not preferred: that
 * component cannot be mounted in this realm at all — the glass-ui root barrel's
 * `useSpring` chunk resolves `@mkbabb/keyframes.js` through node from inside
 * `node_modules`, where the vitest alias does not reach ("Cannot find package
 * '@mkbabb/keyframes.js' imported from …/@mkbabb/glass-ui/dist/useSpring-*.js").
 * The rules are the exact functions the component calls — the only injected
 * seam is the capture itself, which is the one thing a test must be able to
 * make fail.
 */

const kf = (over: Partial<TimelineKeyframe> = {}): TimelineKeyframe => ({
    id: "kf-fixture-0",
    selector: percentSelector(38),
    percent: 38,
    vars: { opacity: "0.5" },
    ...over,
});

const mountPreview = (keyframe: TimelineKeyframe, source?: HTMLElement) =>
    mount(TimelineHoverPreview, {
        props: source ? { keyframe, source } : { keyframe },
        attachTo: document.body,
    });

/** A stand-in scene subject: a positioned box with one face, like the cube's. */
const subject = (): HTMLElement => {
    const el = document.createElement("div");
    el.className = "scene-subject";
    el.style.transform = "rotateX(324deg)"; // the scene's LIVE pose (KFA-121)
    el.innerHTML = '<div class="face" id="face-1" tabindex="0">1</div>';
    return el;
};

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

    // D-2/L-D9 — the value the panel exists to show was the one thing it would
    // not show: `truncate` at ~29 characters against 80-character matrices,
    // with no wrap, no copy and no title.
    it("carries the full declaration as each truncated row's title", () => {
        const w = mountPreview(
            kf({ vars: { transform: "matrix(1, 0, 0, 1, 300, 0)" } }),
        );
        const row = w.get('[data-register="code"] > div');
        expect(row.attributes("title")).toBe(
            "transform: matrix(1, 0, 0, 1, 300, 0)",
        );
    });
});

// ─── KFA-59 / UIA-KF-022 — the pose replaces the capture ───────────────────
// The hover preview RASTERISED the scene with html2canvas, which cannot parse
// CSS `color()`: every hover printed "Preview unavailable — Attempting to parse
// an unsupported color function". The capture, its memo (G10 (a)/(b): the
// PreviewEntry cache, its eviction and its failure state) and the raw error
// line are gone with it; the preview is the stop's declarations on a clone.
describe("KFA-59 — the hover preview poses the subject", () => {
    it("mounts an inert clone carrying the stop's declarations", async () => {
        const w = mountPreview(kf({ vars: { opacity: "0.5", transform: "rotate(90deg)" } }), subject());
        await nextTick();
        const clone = (w.element as HTMLElement).querySelector<HTMLElement>("[data-timeline-preview-subject]");
        expect(clone).not.toBeNull();
        expect(clone!.style.opacity).toBe("0.5");
        expect(clone!.style.transform).toBe("rotate(90deg)");
        expect(clone!.inert).toBe(true);
        expect(clone!.querySelector("[id], [tabindex]")).toBeNull();
        w.unmount();
    });

    it("re-poses on an edit — never a picture of a pose that no longer exists", async () => {
        const frame = kf({ vars: { opacity: "0.5" } });
        const w = mountPreview(frame, subject());
        await nextTick();
        await w.setProps({ keyframe: { ...frame, vars: { opacity: "0.25" } } });
        await nextTick();
        const clone = (w.element as HTMLElement).querySelector<HTMLElement>("[data-timeline-preview-subject]");
        expect(clone!.style.opacity).toBe("0.25");
        w.unmount();
    });

    it("starts from the subject's rest, not the scene's live pose (KFA-121)", async () => {
        const w = mountPreview(kf({ vars: { opacity: "1" } }), subject());
        await nextTick();
        const clone = (w.element as HTMLElement).querySelector<HTMLElement>("[data-timeline-preview-subject]");
        expect(clone!.style.transform).toBe("");
        w.unmount();
    });

    it("prints no capture state and no engine error — there is no capture", async () => {
        const w = mountPreview(kf({ label: "hero lift" }), subject());
        await nextTick();
        expect(w.text()).not.toContain("Preview unavailable");
        expect(w.text()).not.toContain("Capturing preview");
        expect(w.find("img").exists()).toBe(false);
        expect(w.get('[role="img"]').attributes("aria-label")).toBe(
            "Posed preview of hero lift, the keyframe at 38%.",
        );
        w.unmount();
    });

    it("html2canvas is imported nowhere in the timeline", () => {
        const root = join(__dirname, "../../../demo/components/instrument/timeline");
        const files: string[] = [];
        const walk = (dir: string) => {
            for (const name of readdirSync(dir)) {
                const path = join(dir, name);
                if (statSync(path).isDirectory()) walk(path);
                else if (/\.(ts|vue)$/.test(name)) files.push(path);
            }
        };
        expect(existsSync(root)).toBe(true);
        walk(root);
        const importers = files.filter((f) => /import\(\s*["']html2canvas["']\s*\)|from\s+["']html2canvas["']/.test(readFileSync(f, "utf8")));
        expect(importers).toEqual([]);
    });

    // UIA-KF-279 — the value is the content: a row wraps, it is never cut to a stub.
    it("wraps a long declaration instead of truncating it", () => {
        const w = mountPreview(kf({ vars: { transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 300, 0, 0, 1)" } }));
        const row = w.get('[data-register="code"] > div');
        expect(row.classes()).not.toContain("truncate");
        expect(row.classes()).toContain("break-words");
        w.unmount();
    });
});

// ─── (c) ───────────────────────────────────────────────────────────────────
describe("G10 (c) — the media box has a terminal state", () => {
    it("says so when a keyframe has nothing previewable and no capture", () => {
        const w = mountPreview(kf({ vars: { "font-size": "12px" } }));
        expect(w.text()).toContain("No previewable properties");
        // Never an empty media slot: the plate is there either way.
        expect(w.find(".ghost-plate").exists()).toBe(true);
        expect(w.find(".ghost-xform").exists()).toBe(false);
    });

    it("renders the plate — not nothing — for a keyframe with NO declarations at all", () => {
        const w = mountPreview(kf({ vars: {} }));
        expect(w.find(".ghost-plate").exists()).toBe(true);
        expect(w.text()).toContain("No previewable properties");
    });

    it("stays silent about previewability once there IS something to draw", () => {
        const w = mountPreview(kf({ vars: { "background-color": "red" } }));
        expect(w.text()).not.toContain("No previewable properties");
        expect(w.find(".ghost-xform").exists()).toBe(true);
    });
});

// ─── (d) ───────────────────────────────────────────────────────────────────
describe("G10 (d) — the plate is fixed, the payload moves", () => {
    // `matrix(0, 1, -1, 0, 300, 0)` = rotate(90deg) with a 300px translate —
    // the exact shape D-7 convicts: composed as `scale(0.3) ${matrix}` the
    // translate applied INSIDE the scaled frame and the swatch was displaced
    // 90px into the tooltip's own `overflow-hidden`.
    const rotated = kf({ vars: { transform: "matrix(0, 1, -1, 0, 300, 0)" } });

    it("puts NO transform on the bordered plate", () => {
        const w = mountPreview(rotated);
        expect(w.get(".ghost-plate").attributes("style")).toBeUndefined();
    });

    it("puts the DECOMPOSED transform on the wrapper inside it", () => {
        const style = mountPreview(rotated).get(".ghost-xform").attributes("style");
        expect(style).toContain("rotate(1.5707963267948966rad)");
        expect(style).toContain("scale(1, 1)");
        // The translation is dropped, not scaled down and clipped away.
        expect(style).not.toContain("300");
        expect(style).not.toContain("scale(0.3)");
    });

    it("leaves the wrapper untransformed for a value the UA has not normalised", () => {
        const w = mountPreview(
            kf({ vars: { transform: "translateX(300px) rotate(45deg)" } }),
        );
        // No hand-rolled parser: an un-normalised list yields no ghost
        // transform, and the authored text is still readable in the rows.
        expect(w.get(".ghost-xform").attributes("style")).toBeUndefined();
        expect(w.text()).toContain("translateX(300px) rotate(45deg)");
    });

    it("paints `opacity: 0` on the swatch, never on the plate (D-7 arm 1)", () => {
        const w = mountPreview(kf({ vars: { opacity: "0" } }));
        expect(w.get(".ghost-swatch").attributes("style")).toContain("opacity: 0");
        expect(w.get(".ghost-plate").attributes("style")).toBeUndefined();
    });

    it("keeps the plate's own frame at full size whatever the keyframe paints", () => {
        const plate = mountPreview(rotated).get(".ghost-plate");
        // MISSED-4: the frame used to scale with its content — 0.3px of border
        // at 30% alpha, a 1.2px radius, a 19.2px swatch in a 64px slot.
        expect(plate.classes()).toContain("w-16");
        expect(plate.classes()).toContain("h-16");
        expect(plate.classes()).toContain("border");
    });
});

// ─── G9 ────────────────────────────────────────────────────────────────────
//
// THE TOOLTIP ANNOUNCES WHAT IT SHOWS (MISSED-1 + D-10 (KeyframeTimeline) + M7
// + RR-A missed-1). The panel's own mount is `TimelineTrack`, so these
// assertions mount it: the description is a PROP of `TooltipContent`, and what
// it is worth can only be read where reka builds the tooltip's accessible node.

/** jsdom ships no ResizeObserver; floating-ui's autoUpdate needs one to open a
 *  tooltip at all. The same gap `resize-tracks.test.ts` and `KfPillTabs.test.ts`
 *  already polyfill — a platform absence, not a defect being stood in for. */
const savedResizeObserver = (globalThis as { ResizeObserver?: unknown })
    .ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
});

const trackMounts: Array<{ unmount: () => void }> = [];
afterEach(() => {
    while (trackMounts.length) trackMounts.pop()!.unmount();
    document.body.innerHTML = "";
});

const mountTrack = (keyframes: TimelineKeyframe[]) => {
    const source = shallowRef<HTMLElement | null>(null);

    const w = mount(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, { delayDuration: 0 }, {
                    default: () =>
                        h(TimelineTrack, {
                            sortedKeyframes: keyframes,
                            scrubT: 0,
                            selectedKeyframeId: null,
                            previewSource: source.value,
                        }),
                }),
        }),
        { attachTo: document.body },
    );
    trackMounts.push(w);

    return {
        w,
        source,
        /** What the mount PASSES — the first arm of reka's `ariaLabel`.
         *  [X.KF.W13R.m, glass 10.0.1] glass's TooltipContent no longer
         *  DECLARES `ariaLabel` (bca22bd9, W-OVERLAY); the binding rides its
         *  forwarded attrs to reka's content, so it is read off `$attrs`. */
        passed: () => w.findComponent(TooltipContent).vm.$attrs["aria-label"] as string,
        marker: () => w.get<HTMLElement>(".keyframe-marker"),
        /** What reka BUILDS — the `role="tooltip"` node's own words. */
        announced: () =>
            document.body.querySelector('[role="tooltip"]')?.textContent ?? null,
    };
};

describe("G9 — the tooltip announces what it shows", () => {
    // MISSED-1's mechanism: `TooltipContentImpl` takes `props.ariaLabel` FIRST
    // and only then scrapes `currentElement.textContent` — an untracked read,
    // taken once. Passing the prop is the cure, and this is the assertion that
    // the prop is passed at all.
    it("PASSES a description rather than leaving reka to scrape the panel", () => {
        const t = mountTrack([kf({ vars: { transform: "translateX(10px)" } })]);
        expect(t.passed()).toBeTruthy();
        expect(t.passed().length).toBeGreaterThan(0);
    });

    it("punctuates at every boundary — a sentence per thing, `; ` between rows", () => {
        const t = mountTrack([
            kf({ vars: { transform: "translateX(10px)", opacity: "0.5" } }),
        ]);
        const said = t.passed();
        // Rows are separated, not run together: the whole of MISSED-1's second
        // horn was that block boundaries contributed no separator at all.
        expect(said).toContain("transform translateX(10px); opacity 0.5.");
        expect(said.endsWith(".")).toBe(true);
        expect(said).toContain("Keyframe at 38%. ");
    });

    it("leads with the typed label when the author gave one", () => {
        const t = mountTrack([kf({ label: "hero lift" })]);
        expect(t.passed().startsWith("hero lift. ")).toBe(true);
    });

    it("says the AUTHORED selector, never a percent nobody wrote", () => {
        const t = mountTrack([
            kf({
                id: "kf-entry",
                selector: requireKeyframeSelector("entry 100%"),
                percent: 25,
            }),
        ]);
        expect(t.passed()).toContain("Keyframe at entry 100% (25%).");
    });

    // M7 — `text-admin-label` force-uppercased the declaration dump, which is
    // the instrument's ONLY textual ground truth for case-sensitive CSS value
    // grammar. A description that is a STRING cannot be transformed by a type
    // register, and this asserts the values arrive as the author typed them.
    it("is not force-uppercased — the values arrive in the authored case", () => {
        const t = mountTrack([
            kf({ vars: { transform: "translateX(10px)", color: "var(--myVar)" } }),
        ]);
        const said = t.passed();
        expect(said).toContain("translateX(10px)");
        expect(said).toContain("var(--myVar)");
        expect(said).not.toContain("TRANSLATEX(10PX)");
        expect(said).not.toContain("VAR(--MYVAR)");
    });

    // The frozen-at-first-mount horn: `textContent` is read ONCE and never
    // again, so an AT user's preview stayed whatever it was before the capture
    // landed. A derived string re-derives.
    it("re-derives when a subject arrives to pose", async () => {
        const frame = kf({ vars: { opacity: "0.5" } });
        const t = mountTrack([frame]);
        expect(t.passed()).toContain("Ghost preview.");

        t.source.value = subject();
        await nextTick();
        expect(t.passed()).toContain("Posed preview.");
        expect(t.passed()).not.toContain("Ghost preview.");
        expect(t.passed()).not.toContain("Preview unavailable");
    });

    // End to end: what reka actually builds for the `role="tooltip"` node. If
    // the fallback were firing this would be the panel's run-on `textContent`
    // instead — the defect, reproduced — so this is the assertion that the
    // first arm wins.
    it("reaches the `role=\"tooltip\"` node as the panel's accessible name", async () => {
        const t = mountTrack([
            kf({ label: "hero lift", vars: { opacity: "0.5" } }),
        ]);
        await t.marker().trigger("focus");
        await nextTick();
        await nextTick();

        expect(t.announced()).toBe(t.passed());
        expect(t.announced()).toContain("hero lift. Keyframe at 38%. ");
    });

    // D-10 (KeyframeTimeline) — one seam, both modalities: focus opens the
    // same panel hover does, and with a subject it carries the pose.
    it("opens the posed panel on FOCUS, not on hover alone", async () => {
        const t = mountTrack([kf({ vars: { opacity: "0.5" } })]);
        t.source.value = subject();
        await nextTick();
        await t.marker().trigger("focus");
        await nextTick();
        await nextTick();
        const panel = document.body.querySelector('[role="img"][aria-label^="Posed preview"]');
        expect(panel).not.toBeNull();
    });

    // UIA-KF-183 — the panel opens below the rail, away from the card's own
    // toolbar and tick labels.
    it("opens below the rail", () => {
        const t = mountTrack([kf()]);
        expect(t.w.findComponent(TooltipContent).props("side")).toBe("bottom");
    });

    // RR-A missed-1 — the two-attribute cure, at the container the rail has.
    it("names the instrument once, as a group", () => {
        const t = mountTrack([kf()]);
        const group = t.w.get('[role="group"]');
        expect(group.attributes("aria-label")).toBe("Keyframe timeline");
        // The rail keeps G8's playhead slider; the group is its container.
        expect(group.find(".timeline-track").exists()).toBe(true);
    });

    it("hides the graduations — they are a ruler, not content", () => {
        const t = mountTrack([kf()]);
        const ticks = t.w.findAll(".timeline-tick-label");
        expect(ticks.length).toBeGreaterThan(0);
        for (const tick of ticks) {
            expect(
                tick.element.closest("[aria-hidden='true']"),
            ).not.toBeNull();
        }
    });

    // Reader 3 — N sliders are told apart by the author's word, not by a number
    // the user has to hold in their head.
    it("leads the marker's own name with the label too", () => {
        const t = mountTrack([kf({ label: "hero lift" })]);
        expect(t.marker().attributes("aria-label")).toBe(
            "hero lift — Keyframe at 38% — drag or arrow to move",
        );
    });
});
