// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4ribbon · A2-KE-L1-24 (mount-once) + A2-KE-L1-23 step 2 (the two
 * DOM-id portals) — one family (value.js COHESION §0fa item 2).
 *
 * The ribbon had three mount sites with three wiring copies: ChannelOptions
 * teleported one into `#controls-ribbon-target`, and the easing and spring
 * scenes each built one in a `#ribbon-content` render function that travelled
 * down four slot pass-throughs. The expanded timeline was teleported from the
 * channel host into `#timeline-expanded-target`.
 *
 * The cure: ONE `<PlaybackRibbon>` in RibbonBar, bound off a typed seat
 * (`RIBBON_SEAT_KEY`) that the selected channel's host and the scene publish
 * bindings into; the expanded cell renders from AnimationControlsGroup off a
 * second seat (`EXPANDED_TIMELINE_KEY`). No DOM id is a layout seam.
 * X-DS r6 pass 6 (KF-C6-01) — the expanded cell and its seat are deleted: the
 * timeline unfolds in its one place, the pane, at every width.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";
import { mount } from "@vue/test-utils";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(__dirname, "../../..");
const DEMO = resolve(ROOT, "demo");
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");
const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
        const p = join(dir, name);
        return statSync(p).isDirectory() ? walk(p) : /\.(vue|ts)$/.test(name) ? [p] : [];
    });
/** Source with its comments removed (`<!-- -->`, block and line comments). */
const code = (src: string) =>
    src
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
const sitesOf = (re: RegExp) =>
    walk(DEMO)
        .filter((p) => re.test(code(readFileSync(p, "utf8"))))
        .map((p) => relative(ROOT, p))
        .sort();

const PANE = "demo/components/instrument/pane";
const RIBBON_BAR = `${PANE}/RibbonBar.vue`;
const OPTIONS = `${PANE}/channel-controls/ChannelOptions.vue`;
const CHANNEL = `${PANE}/channel-controls/ChannelControls.vue`;

describe("X.KF.W13X.r4ribbon — structure", () => {
    it("(1) A2-KE-L1-23 step 2 — neither DOM-id portal stands: no Teleport to either id, and neither id exists", () => {
        for (const p of walk(resolve(ROOT, PANE))) {
            const src = code(readFileSync(p, "utf8"));
            expect([relative(ROOT, p), /to="#controls-ribbon-target"/.test(src)]).toEqual([relative(ROOT, p), false]);
            expect([relative(ROOT, p), /to="#timeline-expanded-target"/.test(src)]).toEqual([relative(ROOT, p), false]);
        }
        expect(sitesOf(/controls-ribbon-target/)).toEqual([]);
        expect(sitesOf(/timeline-expanded-target/)).toEqual([]);
        expect(code(read(OPTIONS))).not.toMatch(/<Teleport\b/);
        expect(code(read(CHANNEL))).not.toMatch(/\bTeleport\b/);
    });

    it("(2) A2-KE-L1-24 — PlaybackRibbon has ONE mount site in the demo: RibbonBar", () => {
        expect(sitesOf(/h\(\s*PlaybackRibbon\b|<PlaybackRibbon\b/)).toEqual([RIBBON_BAR]);
        expect(code(read(RIBBON_BAR)).match(/<PlaybackRibbon\b/g) ?? []).toHaveLength(1);
        expect(sitesOf(/import PlaybackRibbon from/)).toEqual([RIBBON_BAR]);
    });

    it("(3) the ribbon state left ChannelOptions; the channel host publishes it into the seat", () => {
        const options = code(read(OPTIONS));
        for (const gone of [/useAnimationSync/, /usePlaybackToggle/, /PlaybackRibbon/, /ballPreview/, /"scrubStart"/, /"sliderUpdate"/]) {
            expect(options).not.toMatch(gone);
        }
        const channel = code(read(CHANNEL));
        expect(channel).toMatch(/RIBBON_SEAT_KEY/);
        expect(channel).toMatch(/publishChannel\(/);
        expect(channel).toMatch(/useAnimationSync\(/);
        expect(channel).toMatch(/usePlaybackToggle\(/);
        expect(code(read(RIBBON_BAR))).toMatch(/inject\(RIBBON_SEAT_KEY/);
    });

    it("(4) the scenes' ribbon render-fns are folded: no `ribbon-content` slot is left, and the scene member is a typed binding source", () => {
        expect(sitesOf(/ribbon-content/)).toEqual([]);
        expect(code(read("demo/app/scene/sceneExposedApi.ts"))).toMatch(/ribbonContent\?: RibbonSource;/);
        expect(code(read("demo/app/App.vue"))).toMatch(/provide\(\s*RIBBON_SEAT_KEY/);
    });

    it("(5) KF-C6-01 — the expanded timeline cell and its seat are deleted: the timeline renders in the pane only", () => {
        expect(sitesOf(/EXPANDED_TIMELINE_KEY|createExpandedTimelineSeat|timeline-expanded-cell/)).toEqual([]);
        const channel = code(read(CHANNEL));
        expect(channel).toMatch(/<component :is="renderTimeline" v-if="timelineShown" \/>/);
        expect(channel).toMatch(/storedControls\.selectedControl === "timeline"/);
    });
});

// ── Mounted: the one mount shows the binding of the surface on show ──────────
vi.mock("@components/playback/PlaybackRibbon.vue", () => ({
    default: defineComponent({
        name: "PlaybackRibbonStub",
        props: ["animation", "currentT", "isAnimPlaying", "userReversed", "preview", "duration"],
        emits: ["toggleReverse", "sliderUpdate", "scrubStart", "scrubEnd", "scrubbed", "update:preview"],
        setup(props, { emit }) {
            return () =>
                h("button", {
                    "data-stub": "PlaybackRibbon",
                    "data-t": String(props.currentT),
                    "data-owner": String((props.animation as { name?: string } | undefined)?.name),
                    onClick: () => emit("toggleReverse"),
                });
        },
    }),
}));
vi.mock("@mkbabb/glass-ui", () => ({
    Button: defineComponent({ name: "ButtonStub", setup: (_p, { slots }) => () => h("button", slots.default?.()) }),
    Separator: defineComponent({ name: "SeparatorStub", setup: () => () => h("hr") }),
}));

const mounted: { unmount: () => void }[] = [];
afterEach(() => {
    while (mounted.length) mounted.pop()!.unmount();
    document.body.innerHTML = "";
});

describe("X.KF.W13X.r4ribbon — the one mount, off the seat", () => {
    it("(6) Controls shows the channel's binding, a facet surface the scene's, Keyframes and Timeline none; one ribbon at most", async () => {
        const { RIBBON_SEAT_KEY, createRibbonSeat } =
            await import("../../../demo/components/instrument/transport/injectionKeys");
        const { default: RibbonBar } = await import("../../../demo/components/instrument/pane/RibbonBar.vue");
        type Binding = NonNullable<ReturnType<ReturnType<typeof createRibbonSeat>["bindingFor"]>>;

        const noop = () => {};
        let channelReversed = 0;
        const binding = (name: string, t: number, onToggleReverse: () => void = noop): Binding =>
            ({
                animation: { name },
                currentT: t,
                isAnimPlaying: false,
                userReversed: false,
                preview: "shown",
                "onUpdate:preview": noop,
                onToggleReverse,
                onSliderUpdate: noop,
                onScrubStart: noop,
                onScrubEnd: noop,
            }) as unknown as Binding;

        const seat = createRibbonSeat(
            () => (surface) => (surface.selectedControl === "easing" ? binding("scene", 7) : null),
        );
        const release = seat.publishChannel(() => binding("channel", 120, () => channelReversed++));
        const storedControls = reactive({ selectedControl: "controls" });
        const w = mount(RibbonBar, {
            attachTo: document.body,
            props: { storedControls: storedControls as never },
            global: { provide: { [RIBBON_SEAT_KEY as symbol]: seat } },
        });
        mounted.push(w);
        const ribbons = () =>
            [...document.querySelectorAll<HTMLElement>('[data-stub="PlaybackRibbon"]')].map(
                (el) => `${el.dataset.owner}@${el.dataset.t}`,
            );

        await nextTick();
        expect(ribbons()).toEqual(["channel@120"]);
        document.querySelector<HTMLElement>('[data-stub="PlaybackRibbon"]')!.click();
        expect(channelReversed).toBe(1);

        storedControls.selectedControl = "easing";
        await nextTick();
        expect(ribbons()).toEqual(["scene@7"]);

        for (const surface of ["keyframes", "timeline", "matrix"]) {
            storedControls.selectedControl = surface;
            await nextTick();
            expect([surface, ribbons()]).toEqual([surface, []]);
        }

        storedControls.selectedControl = "controls";
        await nextTick();
        expect(ribbons()).toEqual(["channel@120"]);
        release();
        await nextTick();
        expect(ribbons()).toEqual([]);
    });
});
