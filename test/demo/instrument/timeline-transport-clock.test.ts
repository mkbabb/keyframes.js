/**
 * test/demo/instrument/timeline-transport-clock.test.ts — X.KF.W13X.timeline,
 * KFA-55: the timeline was not wired to the transport. Scrubbing was the only
 * driver of the playhead, so Play, Pause and Space moved the scene and left
 * the playhead and the preview standing.
 *
 * The channel's playing animation is the clock: while it runs, the pane's
 * playhead follows its normalized time; paused, the timeline stays where the
 * user put it.
 *
 * Served witness: `evidence/W13X/timeline/tl.mjs`, `play` — 1 distinct
 * playhead/preview sample in 12 over 1.2 s of transport play at the before
 * bytes.
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, effectScope, h, nextTick, reactive, ref } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { useTimeline } from "../../../demo/components/instrument/timeline/composables/useTimeline";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";
import type { TimelineKeyframe } from "../../../demo/components/instrument/timeline/timelineTypes";
import { percentSelector } from "../../../demo/utils/keyframeSelector";

const kf = (percent: number): TimelineKeyframe => ({
    id: `kf-clock-${percent}`,
    selector: percentSelector(percent),
    percent,
    vars: { opacity: String(percent / 100) },
});

const frames = (n: number) =>
    new Promise<void>((resolve) => {
        let left = n;
        const tick = () => (--left <= 0 ? resolve() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
    });

afterEach(() => {
    document.body.innerHTML = "";
});

async function setup() {
    const targets: HTMLElement[] = [document.createElement("div")];
    document.body.append(targets[0]!);
    const clock = reactive({ t: 0, started: true, paused: false, options: { duration: 1000 } });
    const wrapper = mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(KeyframeTimeline, { targets, animationOptions: { duration: 1000 }, clock }),
            ),
        ),
        { attachTo: document.body, global: { stubs: { CSSCodeEditor: true, CSSPasteDialog: true } } },
    );
    const scope = effectScope();
    const session = scope.run(() => useTimeline(ref(targets), undefined, targets))!;
    session.state.value.keyframes.push(kf(0), kf(100));
    await session.rebuild();
    await nextTick();
    const playhead = () =>
        Number(wrapper.find('[aria-label="Playhead — scrub the animation"]').attributes("aria-valuenow"));
    return { wrapper, clock, playhead, scope };
}

describe("KFA-55 — the Timeline pane follows the transport clock", () => {
    it("moves the playhead with a running clock", async () => {
        const { wrapper, clock, playhead, scope } = await setup();
        clock.t = 400;
        await frames(3);
        await nextTick();
        expect(playhead()).toBe(40);
        clock.t = 750;
        await frames(3);
        await nextTick();
        expect(playhead()).toBe(75);
        wrapper.unmount();
        scope.stop();
    });

    it("leaves the playhead where the user put it while the clock is paused", async () => {
        const { wrapper, clock, playhead, scope } = await setup();
        clock.paused = true;
        clock.t = 600;
        await frames(3);
        await nextTick();
        expect(playhead()).toBe(0);
        wrapper.unmount();
        scope.stop();
    });
});
