/**
 * test/demo/instrument/timeline-channel-session.test.ts — X.KF.W13X.timeline,
 * KFA-58: a Controls → Timeline round trip destroyed the user's keyframes.
 *
 * The pane mounts `KeyframeTimeline` under `v-if` + `:key`, and the session
 * (keyframes, engine, undo trail) was scoped to the component, so every
 * unmount dropped it. The session now belongs to the channel: `useTimeline`
 * takes an owner (the channel's targets array) and hands every later mount of
 * that channel the same session.
 *
 * Served witness: `docs/tranches/X/keyframes/evidence/W13X/timeline/tl.mjs`,
 * `rt` (markers after the round trip) 0 at the before bytes.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import type { Ref } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { defineComponent, h } from "vue";
import { useTimeline } from "../../../demo/components/instrument/timeline/composables/useTimeline";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";
import type { TimelineKeyframe } from "../../../demo/components/instrument/timeline/timelineTypes";
import { percentSelector } from "../../../demo/utils/keyframeSelector";

const kf = (percent: number): TimelineKeyframe => ({
    id: `kf-session-${percent}`,
    selector: percentSelector(percent),
    percent,
    vars: { opacity: String(percent / 100) },
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
});

describe("KFA-58 — the timeline session belongs to the channel", () => {
    it("a second mount of the same channel receives the first mount's keyframes and undo trail", async () => {
        vi.useFakeTimers();
        const channelTargets: HTMLElement[] = [document.createElement("div")];
        const targets: Ref<HTMLElement[]> = ref(channelTargets);

        const first = effectScope();
        const a = first.run(() => useTimeline(targets, undefined, channelTargets))!;
        a.state.value.keyframes.push(kf(0), kf(100));
        await nextTick();
        vi.advanceTimersByTime(150);
        await nextTick();
        first.stop(); // the tab switch unmounts the component

        const second = effectScope();
        const b = second.run(() => useTimeline(targets, undefined, channelTargets))!;
        expect(b.state.value.keyframes.map((k) => k.percent)).toEqual([0, 100]);
        expect(b.canUndo.value).toBe(true);
        second.stop();
    });

    it("two channels never share a session", () => {
        const one: HTMLElement[] = [document.createElement("div")];
        const two: HTMLElement[] = [document.createElement("div")];
        const scope = effectScope();
        const [a, b] = scope.run(() => [
            useTimeline(ref(one), undefined, one),
            useTimeline(ref(two), undefined, two),
        ])!;
        a!.state.value.keyframes.push(kf(0));
        expect(b!.state.value.keyframes).toHaveLength(0);
        scope.stop();
    });

    it("KeyframeTimeline re-mounted on the same channel shows the keyframes it had", async () => {
        const channelTargets: HTMLElement[] = [document.createElement("div")];
        const Host = defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(KeyframeTimeline, { targets: channelTargets }),
            ),
        );
        const stubs = { CSSCodeEditor: true, CSSPasteDialog: true };
        const first = mount(Host, { attachTo: document.body, global: { stubs } });
        // Author through the channel's own session (what Import / Snapshot write).
        const scope = effectScope();
        const session = scope.run(() => useTimeline(ref(channelTargets), undefined, channelTargets))!;
        session.state.value.keyframes.push(kf(0), kf(50), kf(100));
        await nextTick();
        expect(first.findAll(".keyframe-marker")).toHaveLength(3);
        first.unmount(); // Controls tab
        scope.stop();

        const second = mount(Host, { attachTo: document.body, global: { stubs } });
        await nextTick();
        expect(second.findAll(".keyframe-marker")).toHaveLength(3);
        second.unmount();
    });
});
